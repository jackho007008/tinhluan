import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { pool, transaction } from "../lib/db";
import { calculate } from "../lib/tuvi-engine";
import { acceptPayment, type Payment } from "../lib/payments";
import { runReportJob, runEmailJob } from "../lib/jobs";
import { authorize, issueToken, hash, exchangeToken } from "../lib/security";
const ids: string[] = [];
let chart: Awaited<ReturnType<typeof calculate>>;
beforeAll(async () => {
  chart = await calculate({
    date: "2000-08-16",
    hour: 3,
    minute: 0,
    unknownTime: false,
    place: "Hà Nội",
    gender: "female",
    calendar: "solar",
    profile: "vn-utc7-midnight-v1",
    timezone: "Asia/Ho_Chi_Minh",
    consent: true,
  });
});
async function order() {
  const id = randomUUID();
  ids.push(id);
  await transaction(async (c) => {
    await c.query(
      "INSERT INTO birth_profile_snapshots(id,data) VALUES($1,$2)",
      [id, chart.normalized],
    );
    await c.query(
      "INSERT INTO chart_snapshots(id,birth_id,result_id,data) VALUES($1,$1,$2,$3)",
      [id, chart.resultId, chart],
    );
    await c.query(
      "INSERT INTO orders(id,code,email,chart_id,amount,demo,scope,expires_at) VALUES($1,$2,'test@example.invalid',$1,199000,true,$3,now()+interval '30 minutes')",
      [id, "TEST" + id, { groups: ["Tổng quan"], year: null, accessDays: 30 }],
    );
  });
  return {
    eventId: randomUUID(),
    transactionId: randomUUID(),
    orderId: id,
    code: "TEST" + id,
    amount: 199000,
    currency: "VND",
    recipient: "DEMO_RECIPIENT",
    status: "paid",
  } satisfies Payment;
}
afterAll(async () => {
  for (const t of [
    "access_tokens",
    "email_deliveries",
    "reports",
    "report_jobs",
    "payment_transactions",
    "payment_events",
    "order_items",
  ])
    await pool.query(`DELETE FROM ${t} WHERE order_id=ANY($1::uuid[])`, [ids]);
  await pool.query("DELETE FROM orders WHERE id=ANY($1::uuid[])", [ids]);
  await pool.query("DELETE FROM chart_snapshots WHERE id=ANY($1::uuid[])", [
    ids,
  ]);
  await pool.query(
    "DELETE FROM birth_profile_snapshots WHERE id=ANY($1::uuid[])",
    [ids],
  );
  await pool.end();
});
describe("PostgreSQL transactions and durability", () => {
  it.each([
    { amount: 1 },
    { amount: 200000 },
    { code: "WRONG" },
    { recipient: "WRONG" },
  ])("does not accept mismatch %o", async (change) => {
    const e = await order();
    expect(await acceptPayment({ ...e, ...change })).toBe("mismatch");
    expect(
      (
        await pool.query("SELECT * FROM report_jobs WHERE order_id=$1", [
          e.orderId,
        ])
      ).rowCount,
    ).toBe(0);
  });
  it("rejects unknown orders and late payment", async () => {
    const e = await order();
    expect(await acceptPayment({ ...e, orderId: randomUUID() })).toBe(
      "unknown_order",
    );
    await pool.query(
      "UPDATE orders SET expires_at=now()-interval '1 second' WHERE id=$1",
      [e.orderId],
    );
    expect(await acceptPayment({ ...e, eventId: randomUUID() })).toBe("late");
  });
  it("out-of-order pending cannot regress paid; repeated events only one job", async () => {
    const e = await order();
    expect(
      await acceptPayment({ ...e, eventId: randomUUID(), status: "pending" }),
    ).toBe("ignored");
    const r = await Promise.all([
      acceptPayment(e),
      acceptPayment(e),
      acceptPayment({ ...e, eventId: randomUUID() }),
    ]);
    expect(r.filter((x) => x === "accepted")).toHaveLength(1);
    await acceptPayment({ ...e, eventId: randomUUID(), status: "failed" });
    expect(
      (
        await pool.query("SELECT payment_status FROM orders WHERE id=$1", [
          e.orderId,
        ])
      ).rows[0].payment_status,
    ).toBe("paid");
    expect(
      (
        await pool.query("SELECT * FROM report_jobs WHERE order_id=$1", [
          e.orderId,
        ])
      ).rowCount,
    ).toBe(1);
  });
  it("one provider transaction cannot pay another order", async () => {
    const a = await order(),
      b = await order();
    await acceptPayment(a);
    expect(await acceptPayment({ ...b, transactionId: a.transactionId })).toBe(
      "transaction_reused",
    );
  });
  it("payment and outbox roll back together on job insertion failure", async () => {
    const e = await order();
    await pool.query(
      `CREATE OR REPLACE FUNCTION test_fail_job() RETURNS trigger AS $$ BEGIN IF NEW.order_id='${e.orderId}'::uuid THEN RAISE EXCEPTION 'test crash'; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql; CREATE TRIGGER test_job_failure BEFORE INSERT ON report_jobs FOR EACH ROW EXECUTE FUNCTION test_fail_job()`,
    );
    try {
      await expect(acceptPayment(e)).rejects.toThrow();
      expect(
        (
          await pool.query("SELECT payment_status FROM orders WHERE id=$1", [
            e.orderId,
          ])
        ).rows[0].payment_status,
      ).toBe("pending");
      expect(
        (
          await pool.query(
            "SELECT * FROM payment_transactions WHERE order_id=$1",
            [e.orderId],
          )
        ).rowCount,
      ).toBe(0);
    } finally {
      await pool.query(
        "DROP TRIGGER test_job_failure ON report_jobs; DROP FUNCTION test_fail_job()",
      );
    }
    expect(await acceptPayment(e)).toBe("accepted");
  });
  it("two workers keep one report; email failure does not lose it", async () => {
    const e = await order();
    await acceptPayment(e);
    for (let i = 0; i < 12; i++)
      await Promise.all([runReportJob(), runReportJob()]);
    expect(
      (await pool.query("SELECT * FROM reports WHERE order_id=$1", [e.orderId]))
        .rowCount,
    ).toBe(1);
    const storedReport = (
      await pool.query("SELECT data FROM reports WHERE order_id=$1", [
        e.orderId,
      ])
    ).rows[0].data;
    expect(storedReport.snapshot).toEqual(chart);
    expect(storedReport.snapshot.profile.id).toBe("vn-utc7-midnight-v1");
    expect(storedReport.snapshot.chart.calendarEvidence.cnCalendarAccess).toBe(
      "blocked",
    );
    process.env.EMAIL_PROVIDER = "unconfigured";
    for (let i = 0; i < 12; i++)
      await Promise.all([runEmailJob(), runEmailJob()]);
    expect(
      (
        await pool.query("SELECT report_status FROM orders WHERE id=$1", [
          e.orderId,
        ])
      ).rows[0].report_status,
    ).toBe("ready");
    expect(
      (
        await pool.query(
          "SELECT status FROM email_deliveries WHERE order_id=$1",
          [e.orderId],
        )
      ).rows[0].status,
    ).toBe("retry");
    process.env.EMAIL_PROVIDER = "local";
    await pool.query(
      "UPDATE email_deliveries SET run_after=now() WHERE order_id=$1",
      [e.orderId],
    );
    await runEmailJob();
    expect(
      (
        await pool.query(
          "SELECT status FROM email_deliveries WHERE order_id=$1",
          [e.orderId],
        )
      ).rows[0].status,
    ).toBe("sent");
  });
  it("denies other order, expired and revoked tokens", async () => {
    const a = await order(),
      b = await order();
    const token = await transaction((c) => issueToken(c, a.orderId));
    await expect(authorize(token, a.orderId)).resolves.toBeUndefined();
    await expect(authorize(token, b.orderId)).rejects.toThrow("UNAUTHORIZED");
    await pool.query(
      "UPDATE access_tokens SET expires_at=now()-interval '1 second' WHERE hash=$1",
      [hash(token)],
    );
    await expect(authorize(token, a.orderId)).rejects.toThrow("UNAUTHORIZED");
  });
  it("single-use magic link is consumed once under concurrency and expiry", async () => {
    const e = await order();
    const token = await transaction((c) =>
      issueToken(c, e.orderId, "magic", 15 / 1440),
    );
    const results = await Promise.allSettled([
      exchangeToken(token),
      exchangeToken(token),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const expired = await transaction((c) =>
      issueToken(c, e.orderId, "magic", -1),
    );
    await expect(exchangeToken(expired)).rejects.toThrow("UNAUTHORIZED");
  });
  it("revocation and package access end are enforced", async () => {
    const e = await order();
    const token = await transaction((c) => issueToken(c, e.orderId));
    await pool.query(
      "UPDATE access_tokens SET revoked_at=now() WHERE hash=$1",
      [hash(token)],
    );
    await expect(authorize(token, e.orderId)).rejects.toThrow("UNAUTHORIZED");
    const active = await transaction((c) => issueToken(c, e.orderId));
    await pool.query(
      "UPDATE orders SET created_at=now()-interval '31 days' WHERE id=$1",
      [e.orderId],
    );
    await expect(authorize(active, e.orderId)).rejects.toThrow("UNAUTHORIZED");
  });
  it("report failure retries from the same paid order", async () => {
    const e = await order();
    await acceptPayment(e);
    await pool.query(
      "UPDATE chart_snapshots SET data='{}'::jsonb WHERE id=$1",
      [e.orderId],
    );
    await runReportJob();
    expect(
      (
        await pool.query("SELECT status FROM report_jobs WHERE order_id=$1", [
          e.orderId,
        ])
      ).rows[0].status,
    ).toBe("retry");
    await pool.query("UPDATE chart_snapshots SET data=$2 WHERE id=$1", [
      e.orderId,
      chart,
    ]);
    await pool.query(
      "UPDATE report_jobs SET run_after=now() WHERE order_id=$1",
      [e.orderId],
    );
    await runReportJob();
    expect(
      (
        await pool.query(
          "SELECT report_status,payment_status FROM orders WHERE id=$1",
          [e.orderId],
        )
      ).rows[0],
    ).toMatchObject({ report_status: "ready", payment_status: "paid" });
  });
});
