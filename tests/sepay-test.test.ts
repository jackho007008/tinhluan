import { beforeAll, afterAll, it, expect, vi } from "vitest";
import { createHmac, randomUUID } from "node:crypto";
import { readFile, mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pool } from "../lib/db";
import {
  createTrialOwner,
  saveTrialReading,
  getTrialReading,
} from "../lib/trial/store";
import { freezeReading } from "../lib/internal-review/dynamic-reading";
import {
  createTrialReadingOrder,
  getOwnedReadingOrder,
  readingHash,
} from "../lib/order-readings";
import {
  enrollSePayTestOrder,
  receiveSePayTest,
  sepayTestProvider,
  sepayTestConfig,
} from "../lib/payments/sepay-test";
import { runReportJob } from "../lib/jobs";
import { POST } from "../app/api/payments/sepay-test/webhook/route";
import type { InternalReading } from "../lib/internal-review/reading-store";
const mocks = vi.hoisted(() => ({
  build: vi.fn(() => {
    throw Error("CATALOG_MUST_NOT_RUN");
  }),
}));
vi.mock("../lib/reports", () => ({ buildReport: mocks.build }));
const secret = "local-fixture-only-not-a-sepay-credential-2026";
let base: InternalReading,
  seq = 910000;
const sign = (
  raw: string,
  timestamp = String(Math.floor(Date.now() / 1000)),
) => ({
  timestamp,
  signature:
    "sha256=" +
    createHmac("sha256", secret)
      .update(timestamp + "." + raw)
      .digest("hex"),
});
const payload = (code: string, extra: Record<string, unknown> = {}) => ({
  id: ++seq,
  gateway: "FixtureBank",
  accountNumber: "TEST-ACCOUNT-ONLY",
  subAccount: "",
  code,
  transferAmount: 1000,
  transferType: "in",
  transactionDate: "2026-10-16 12:00:00",
  content: "PRIVATE bank narrative",
  description: "PRIVATE customer name",
  accumulated: 999999,
  referenceCode: "PRIVATE reference " + seq,
  ...extra,
});
async function order(enroll = true) {
  const session = await createTrialOwner(),
    record = { ...base, id: randomUUID() };
  await saveTrialReading(session.owner, record);
  const id = await createTrialReadingOrder(session.owner, record.id, 1000);
  const code = (await pool.query("SELECT code FROM orders WHERE id=$1", [id]))
    .rows[0].code as string;
  if (enroll) await enrollSePayTestOrder(id);
  return { id, code, session, record };
}
const send = (data: ReturnType<typeof payload>) => {
  const raw = JSON.stringify(data);
  return receiveSePayTest(raw, sign(raw));
};
async function unpaid(id: string) {
  expect(
    (await pool.query("SELECT payment_status FROM orders WHERE id=$1", [id]))
      .rows[0].payment_status,
  ).toBe("pending");
  for (const table of [
    "report_jobs",
    "payment_transactions",
    "reports",
    "access_tokens",
  ])
    expect(
      (await pool.query("SELECT * FROM " + table + " WHERE order_id=$1", [id]))
        .rowCount,
    ).toBe(0);
}
beforeAll(async () => {
  for (const [key, value] of Object.entries({
    SEPAY_MODE: "test",
    SEPAY_TEST_ENABLED: "true",
    SEPAY_TEST_WEBHOOK_SECRET: secret,
    SEPAY_TEST_GATEWAY: "FixtureBank",
    SEPAY_TEST_ACCOUNT_NUMBER: "TEST-ACCOUNT-ONLY",
    SEPAY_TEST_SUB_ACCOUNT: "",
    CORE_ORDER_TEST_ENABLED: "true",
    DEMO_ENABLED: "true",
    PAYMENT_PROVIDER: "mock",
  }))
    vi.stubEnv(key, value);
  vi.stubEnv(
    "TRIAL_READING_DIR",
    await mkdtemp(path.join(os.tmpdir(), "sepay-test-")),
  );
  const samples = JSON.parse(
    await readFile("fixtures/customer-reading-samples.json", "utf8"),
  );
  // Existing engine snapshot, technical local ownership/order fixture. Not a SePay-origin transaction.
  base = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    snapshot: samples[0].snapshot,
    receipt: samples[0].receipt,
    frozen: freezeReading(samples[0].snapshot, samples[0].receipt),
  };
});
afterAll(async () => {
  vi.unstubAllEnvs();
  await pool.end();
});
it("verifies documented timestamp.raw-body HMAC; rejects modified bytes, key, signature and stale/future timestamp", () => {
  const raw = JSON.stringify(payload("CORE123456789ABC"));
  expect(sepayTestProvider.verify(raw, sign(raw)).transferAmount).toBe(1000);
  for (const auth of [
    { ...sign(raw), signature: "sha256=" + "0".repeat(64) },
    { ...sign(raw), signature: "wrong" },
    sign(raw, String(Math.floor(Date.now() / 1000) - 301)),
    sign(raw, String(Math.floor(Date.now() / 1000) + 301)),
  ])
    expect(() => sepayTestProvider.verify(raw, auth)).toThrow("SEPAY_AUTH");
  expect(() => sepayTestProvider.verify(raw + " ", sign(raw))).toThrow(
    "SEPAY_AUTH",
  );
});
it("fails closed with disabled, live or incomplete config; has no checkout implementation", async () => {
  vi.stubEnv("SEPAY_TEST_ENABLED", "false");
  expect(() => sepayTestConfig()).toThrow("SEPAY_TEST_DISABLED");
  vi.stubEnv("SEPAY_TEST_ENABLED", "true");
  vi.stubEnv("SEPAY_MODE", "live");
  expect(() => sepayTestConfig()).toThrow("SEPAY_TEST_DISABLED");
  vi.stubEnv("SEPAY_MODE", "test");
  vi.stubEnv("SEPAY_TEST_WEBHOOK_SECRET", "");
  expect(() => sepayTestConfig()).toThrow("SEPAY_TEST_CONFIG");
  vi.stubEnv("SEPAY_TEST_WEBHOOK_SECRET", secret);
  await expect(
    sepayTestProvider.create({ id: randomUUID(), code: "TEST", amount: 1000 }),
  ).rejects.toThrow("SEPAY_CHECKOUT_NOT_IMPLEMENTED");
});
it("two owners get exact frozen reports after valid webhook; concurrent replay and worker retry never duplicate or rerun catalog", async () => {
  const a = await order(),
    b = await order();
  for (const o of [a, b]) {
    const p = payload(o.code);
    const results = await Promise.all([send(p), send(p), send(p)]);
    expect(results.map((r) => r.disposition).sort()).toEqual([
      "accepted",
      "duplicate",
      "duplicate",
    ]);
    await runReportJob(o.id);
    const first = (
      await pool.query("SELECT id,data FROM reports WHERE order_id=$1", [o.id])
    ).rows;
    await pool.query(
      "UPDATE report_jobs SET status='retry',run_after=now() WHERE order_id=$1",
      [o.id],
    );
    await runReportJob(o.id);
    expect(
      (
        await pool.query("SELECT id,data FROM reports WHERE order_id=$1", [
          o.id,
        ])
      ).rows,
    ).toEqual(first);
    expect(
      (await getOwnedReadingOrder(o.session.token, o.id))?.reading,
    ).toEqual(o.record);
    expect(await getTrialReading(o.session.owner, o.record.id)).toEqual(
      o.record,
    );
    for (const table of [
      "report_jobs",
      "payment_transactions",
      "reports",
      "access_tokens",
    ])
      expect(
        (
          await pool.query("SELECT * FROM " + table + " WHERE order_id=$1", [
            o.id,
          ])
        ).rowCount,
      ).toBe(1);
    expect(
      (
        await pool.query("SELECT * FROM email_deliveries WHERE order_id=$1", [
          o.id,
        ])
      ).rowCount,
    ).toBe(0);
  }
  expect(await getOwnedReadingOrder(a.session.token, b.id)).toBeNull();
  expect(await getOwnedReadingOrder(b.session.token, a.id)).toBeNull();
  expect(mocks.build).not.toHaveBeenCalled();
});
it.each([
  ["underpayment", { transferAmount: 999 }, "mismatch"],
  ["overpayment", { transferAmount: 1001 }, "mismatch"],
  ["wrong account", { accountNumber: "OTHER" }, "wrong_account"],
  ["wrong bank", { gateway: "OtherBank" }, "wrong_account"],
  ["wrong VA", { subAccount: "OTHER" }, "wrong_account"],
  ["outgoing", { transferType: "out" }, "not_incoming"],
  ["missing code", { code: null }, "invalid_code"],
  ["empty code", { code: "" }, "invalid_code"],
  [
    "code only in narrative",
    { code: null, content: "CORE123456789ABC" },
    "invalid_code",
  ],
  ["unknown exact code", { code: "COREFFFFFFFFFFFF" }, "unknown_order"],
  ["substring code", { code: "note CORE123456789ABC" }, "invalid_code"],
] as const)(
  "does not pay %s; saves a sanitized rejection",
  async (_name, change, reason) => {
    const o = await order();
    const result = await send(payload(o.code, change));
    expect(result.disposition).toBe(reason);
    await unpaid(o.id);
    const row = (
      await pool.query(
        "SELECT * FROM sepay_test_events WHERE transaction_id=$1",
        [result.transactionId],
      )
    ).rows[0];
    expect(row.disposition).toBe(reason);
    expect(JSON.stringify(row)).not.toContain("PRIVATE");
    expect(JSON.stringify(row)).not.toContain("TEST-ACCOUNT-ONLY");
  },
);
it("does not accept non-enrolled/demo=false/expired orders, and enrollment is protected", async () => {
  const a = await order(false);
  expect((await send(payload(a.code))).disposition).toBe("not_enrolled");
  await unpaid(a.id);
  await enrollSePayTestOrder(a.id);
  await pool.query("UPDATE orders SET demo=false WHERE id=$1", [a.id]);
  expect((await send(payload(a.code))).disposition).toBe("not_enrolled");
  await unpaid(a.id);
  const b = await order();
  await pool.query(
    "UPDATE orders SET expires_at=now()-interval '1 second' WHERE id=$1",
    [b.id],
  );
  expect((await send(payload(b.code))).disposition).toBe("late");
  await unpaid(b.id);
  const cancelled = await order();
  await pool.query("UPDATE orders SET payment_status='cancelled' WHERE id=$1", [
    cancelled.id,
  ]);
  expect((await send(payload(cancelled.code))).disposition).toBe(
    "invalid_order_state",
  );
  vi.stubEnv("NODE_ENV", "production");
  await expect(enrollSePayTestOrder(a.id)).rejects.toThrow("DEMO_DISABLED");
  vi.stubEnv("NODE_ENV", "test");
});
it("pins the enrolled account; configuration rotation cannot silently retarget an existing order", async () => {
  const o = await order();
  vi.stubEnv("SEPAY_TEST_ACCOUNT_NUMBER", "CHANGED");
  try {
    await expect(enrollSePayTestOrder(o.id)).rejects.toThrow(
      "TEST_ACCOUNT_CHANGED",
    );
    expect(
      (await send(payload(o.code, { accountNumber: "CHANGED" }))).disposition,
    ).toBe("not_enrolled");
    await unpaid(o.id);
  } finally {
    vi.stubEnv("SEPAY_TEST_ACCOUNT_NUMBER", "TEST-ACCOUNT-ONLY");
  }
});
it("same transaction ID cannot be moved to a different order or amount; formatting-only replay is safe", async () => {
  const a = await order(),
    b = await order(),
    p = payload(a.code);
  expect((await send(p)).disposition).toBe("accepted");
  expect((await send({ ...p, code: b.code })).disposition).toBe(
    "event_conflict",
  );
  expect((await send({ ...p, transferAmount: 2000 })).disposition).toBe(
    "event_conflict",
  );
  await unpaid(b.id);
  const formatted = JSON.stringify(
    { ...p, description: "Changed private metadata" },
    null,
    2,
  );
  expect((await receiveSePayTest(formatted, sign(formatted))).disposition).toBe(
    "duplicate",
  );
  expect((await send(payload(a.code))).disposition).toBe("duplicate");
  expect(
    (
      await pool.query("SELECT * FROM payment_transactions WHERE order_id=$1", [
        a.id,
      ])
    ).rowCount,
  ).toBe(1);
});
it("queue failure rolls back inbox/transaction/paid; identical authenticated delivery succeeds on retry", async () => {
  const o = await order(),
    p = payload(o.code);
  await pool.query(
    "CREATE FUNCTION sepay_fail_job() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN RAISE EXCEPTION 'fixture queue failure'; END$$; CREATE TRIGGER sepay_fail_job BEFORE INSERT ON report_jobs FOR EACH ROW EXECUTE FUNCTION sepay_fail_job()",
  );
  try {
    await expect(send(p)).rejects.toThrow("fixture queue failure");
    await unpaid(o.id);
    expect(
      (
        await pool.query(
          "SELECT * FROM sepay_test_events WHERE transaction_id=$1",
          ["sepay:test:" + p.id],
        )
      ).rowCount,
    ).toBe(0);
  } finally {
    await pool.query(
      "DROP TRIGGER sepay_fail_job ON report_jobs; DROP FUNCTION sepay_fail_job()",
    );
  }
  expect((await send(p)).disposition).toBe("accepted");
  await runReportJob(o.id);
  expect(
    readingHash((await getOwnedReadingOrder(o.session.token, o.id))?.reading),
  ).toBe(readingHash(o.record));
});
it("HTTP returns SePay acknowledgement only after commit; auth/schema/size errors do not leak payload or secrets", async () => {
  const logs = vi.spyOn(console, "info").mockImplementation(() => {}),
    warnings = vi.spyOn(console, "warn").mockImplementation(() => {});
  const o = await order(),
    raw = JSON.stringify(payload(o.code)),
    auth = sign(raw);
  const request = (body: string, headers: Record<string, string> = {}) =>
    new Request("http://localhost/api/payments/sepay-test/webhook", {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        "x-sepay-timestamp": auth.timestamp,
        "x-sepay-signature": auth.signature,
        ...headers,
      },
    });
  try {
    expect(
      (await POST(request(raw, { "x-sepay-signature": "bad" }))).status,
    ).toBe(401);
    await unpaid(o.id);
    expect(
      (await POST(request(raw, { "content-type": "text/plain" }))).status,
    ).toBe(415);
    expect((await POST(request("x".repeat(32769)))).status).toBe(413);
    const invalid = JSON.stringify(payload(o.code, { transferAmount: 1.5 })),
      badAuth = sign(invalid);
    expect(
      (
        await POST(
          request(invalid, {
            "x-sepay-timestamp": badAuth.timestamp,
            "x-sepay-signature": badAuth.signature,
          }),
        )
      ).status,
    ).toBe(400);
    await unpaid(o.id);
    const response = await POST(request(raw));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(await (await POST(request(raw))).json()).toEqual({ success: true });
    const logged = JSON.stringify([...logs.mock.calls, ...warnings.mock.calls]);
    for (const text of [
      secret,
      "PRIVATE",
      "TEST-ACCOUNT-ONLY",
      o.code,
      o.session.token,
    ])
      expect(logged).not.toContain(text);
  } finally {
    logs.mockRestore();
    warnings.mockRestore();
  }
});
