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
import {
  apiNotice,
  sepayApiPage,
  reconcileSePayTest,
} from "../lib/payments/sepay-reconcile";
let base: InternalReading,
  seq = 920000;
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
    SEPAY_TEST_API_TOKEN: "fixture-token-not-real",
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
const api = (p: ReturnType<typeof payload>, id = randomUUID()) => ({
  id,
  account_number: p.accountNumber,
  bank_brand_name: p.gateway,
  va: p.subAccount,
  code: p.code,
  reference_number: p.referenceCode,
  transfer_type: p.transferType,
  amount_in: p.transferType === "in" ? p.transferAmount : 0,
  amount_out: p.transferType === "out" ? p.transferAmount : 0,
});
const response = (
  rows: unknown[],
  page = 1,
  total = rows.length,
  perPage = 100,
) =>
  Response.json({
    status: "success",
    data: rows,
    meta: {
      pagination: {
        total,
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(total / perPage),
        has_more: page < Math.ceil(total / perPage),
      },
    },
  });
const scan = (rows: unknown[]) =>
  reconcileSePayTest({ fetcher: vi.fn(async () => response(rows)) });
it("API UUID and numeric webhook correlate by reference + recipient, both arrival orders; worker stays frozen and one grant", async () => {
  for (const apiFirst of [true, false]) {
    const o = await order(),
      p = payload(o.code),
      a = api(p);
    if (apiFirst) {
      expect((await scan([a])).results[0].disposition).toBe("accepted");
      expect((await send(p)).disposition).toBe("duplicate");
    } else {
      expect((await send(p)).disposition).toBe("accepted");
      expect((await scan([a])).results[0].disposition).toBe("duplicate");
    }
    expect((await scan([a])).results[0].disposition).toBe("duplicate");
    await runReportJob(o.id);
    await pool.query(
      "UPDATE report_jobs SET status='retry',run_after=now() WHERE order_id=$1",
      [o.id],
    );
    await runReportJob(o.id);
    expect(
      (await getOwnedReadingOrder(o.session.token, o.id))?.reading,
    ).toEqual(o.record);
    for (const table of [
      "reports",
      "access_tokens",
      "report_jobs",
      "payment_transactions",
    ])
      expect(
        (
          await pool.query("SELECT * FROM " + table + " WHERE order_id=$1", [
            o.id,
          ])
        ).rowCount,
      ).toBe(1);
  }
  expect(mocks.build).not.toHaveBeenCalled();
});
it.each([
  ["wrong amount", { transferAmount: 2000 }, "mismatch"],
  ["wrong account", { accountNumber: "OTHER" }, "wrong_account"],
  ["outgoing", { transferType: "out" }, "not_incoming"],
  ["missing code", { code: null }, "invalid_code"],
])(
  "API %s uses the SAME business checks and stores rejection",
  async (_n, change, reason) => {
    const o = await order();
    expect(
      (await scan([api(payload(o.code, change as Record<string, unknown>))]))
        .results[0].disposition,
    ).toBe(reason);
    await unpaid(o.id);
  },
);
it("reference reused with different code or amount cannot pay another order; no cast of UUID to webhook id", async () => {
  const o = await order(),
    other = await order(),
    p = payload(o.code),
    a = api(p);
  await scan([a]);
  expect((await send({ ...p, code: other.code })).disposition).toBe(
    "event_conflict",
  );
  await unpaid(other.id);
  expect((await scan([{ ...a, amount_in: 2000 }])).results[0].disposition).toBe(
    "event_conflict",
  );
});
it("checkpoint does not advance on page2 HTTP failure; restart page1 handles committed items then remaining pages", async () => {
  const a = await order(),
    b = await order(),
    rows = [api(payload(a.code)), api(payload(b.code))];
  const before = (
    await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope")
  ).rows;
  const failing = vi.fn(async (input: string | URL | Request) =>
    new URL(String(input)).searchParams.get("page") === "1"
      ? response([rows[0]], 1, 2, 1)
      : new Response("", { status: 429 }),
  );
  await expect(
    reconcileSePayTest({ perPage: 1, fetcher: failing }),
  ).rejects.toThrow("SEPAY_API_HTTP_429");
  expect(
    (await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope"))
      .rows,
  ).toEqual(before);
  await unpaid(b.id);
  const success = vi.fn(async (input: string | URL | Request) => {
    const page = Number(new URL(String(input)).searchParams.get("page"));
    return response([rows[page - 1]], page, 2, 1);
  });
  const result = await reconcileSePayTest({ perPage: 1, fetcher: success });
  expect(result.results.map((r) => r.disposition)).toEqual([
    "duplicate",
    "accepted",
  ]);
  expect(
    success.mock.calls.map((c) =>
      new URL(String(c[0])).searchParams.get("page"),
    ),
  ).toEqual(["1", "2"]);
});
it("malformed row is recorded and checkpoint unchanged; empty scan and changed pages are validated", async () => {
  const before = (
    await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope")
  ).rows;
  await expect(
    scan([{ id: randomUUID(), reference_number: "" }]),
  ).rejects.toThrow("SEPAY_API_ROW");
  expect(
    (await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope"))
      .rows,
  ).toEqual(before);
  expect(
    (
      await pool.query(
        "SELECT * FROM sepay_test_reconcile_issues WHERE reason='SEPAY_API_ROW'",
      )
    ).rowCount,
  ).toBeGreaterThan(0);
  expect((await scan([])).processed).toBe(0);
});
it("rejects inconsistent direction, missing reference, unsafe amounts, malformed pagination, HTTP/JSON/network and Live", async () => {
  const a = api(payload("CORE123456789ABC"));
  expect(apiNotice(a).id).toBe(a.id);
  for (const bad of [
    { ...a, amount_out: 1 },
    { ...a, reference_number: "" },
    { ...a, amount_in: "1000" },
    { ...a, amount_in: Number.MAX_SAFE_INTEGER + 1 },
  ])
    expect(() => apiNotice(bad)).toThrow();
  for (const status of [401, 403, 429, 500])
    await expect(
      sepayApiPage(
        1,
        100,
        vi.fn(async () => new Response("", { status })),
      ),
    ).rejects.toThrow("SEPAY_API_HTTP_" + status);
  await expect(
    sepayApiPage(
      1,
      100,
      vi.fn(async () => new Response("bad")),
    ),
  ).rejects.toThrow("SEPAY_API_JSON");
  await expect(
    sepayApiPage(
      1,
      100,
      vi.fn(async () => {
        throw Error("private token");
      }),
    ),
  ).rejects.toThrow("SEPAY_API_NETWORK");
  await expect(
    sepayApiPage(
      1,
      100,
      vi.fn(async () => response([a], 2, 1)),
    ),
  ).rejects.toThrow("SEPAY_API_PAGINATION");
  vi.stubEnv("SEPAY_MODE", "live");
  await expect(scan([])).rejects.toThrow("SEPAY_TEST_DISABLED");
  vi.stubEnv("SEPAY_MODE", "test");
  vi.stubEnv("SEPAY_TEST_API_TOKEN", "");
  await expect(scan([])).rejects.toThrow("SEPAY_TEST_API_TOKEN_MISSING");
  vi.stubEnv("SEPAY_TEST_API_TOKEN", "fixture-token-not-real");
});
it("request is hardwired Sandbox, no redirects, no webhook_success filter that could skip a lost delivery", async () => {
  const fetcher = vi.fn(async () => response([]));
  await sepayApiPage(1, 100, fetcher);
  const call = fetcher.mock.calls[0] as unknown as [URL, RequestInit];
  expect(call[0].origin).toBe("https://userapi-sandbox.sepay.vn");
  expect(call[0].searchParams.has("webhook_success")).toBe(false);
  expect(call[1].redirect).toBe("error");
});
it("concurrent API and webhook deliveries converge atomically on one transaction", async () => {
  const o = await order(),
    p = payload(o.code),
    a = api(p);
  const [apiResult, webhookResult] = await Promise.all([scan([a]), send(p)]);
  expect(
    [apiResult.results[0].disposition, webhookResult.disposition].sort(),
  ).toEqual(["accepted", "duplicate"]);
  expect(
    (
      await pool.query("SELECT * FROM payment_transactions WHERE order_id=$1", [
        o.id,
      ])
    ).rowCount,
  ).toBe(1);
  await runReportJob(o.id);
  expect((await getOwnedReadingOrder(o.session.token, o.id))?.reading).toEqual(
    o.record,
  );
});
it("changed page total, repeated IDs and bounded scan cannot advance checkpoint", async () => {
  const o = await order(),
    a = api(payload(o.code));
  const before = (
    await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope")
  ).rows;
  const changed = vi.fn(async (input: string | URL | Request) => {
    const page = Number(new URL(String(input)).searchParams.get("page"));
    return response([a], page, page === 1 ? 2 : 3, 1);
  });
  await expect(
    reconcileSePayTest({ perPage: 1, fetcher: changed }),
  ).rejects.toThrow("SEPAY_SCAN_CHANGED");
  const repeated = vi.fn(async (input: string | URL | Request) =>
    response(
      [a],
      Number(new URL(String(input)).searchParams.get("page")),
      2,
      1,
    ),
  );
  await expect(
    reconcileSePayTest({ perPage: 1, fetcher: repeated }),
  ).rejects.toThrow("SEPAY_SCAN_CHANGED");
  await expect(
    reconcileSePayTest({ perPage: 1, maxPages: 1, fetcher: repeated }),
  ).rejects.toThrow("SEPAY_SCAN_LIMIT");
  expect(
    (await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope"))
      .rows,
  ).toEqual(before);
});
it("settlement failure leaves checkpoint and unpaid order intact; next scan retries same API row", async () => {
  const o = await order(),
    a = api(payload(o.code));
  const before = (
    await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope")
  ).rows;
  await pool.query(
    "CREATE FUNCTION reconcile_fail_job() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN RAISE EXCEPTION 'fixture queue failure'; END$$; CREATE TRIGGER reconcile_fail_job BEFORE INSERT ON report_jobs FOR EACH ROW EXECUTE FUNCTION reconcile_fail_job()",
  );
  try {
    await expect(scan([a])).rejects.toThrow("fixture queue failure");
    await unpaid(o.id);
    expect(
      (await pool.query("SELECT * FROM sepay_test_checkpoints ORDER BY scope"))
        .rows,
    ).toEqual(before);
  } finally {
    await pool.query(
      "DROP TRIGGER reconcile_fail_job ON report_jobs; DROP FUNCTION reconcile_fail_job()",
    );
  }
  expect((await scan([a])).results[0].disposition).toBe("accepted");
});
