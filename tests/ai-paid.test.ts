import { beforeAll, afterAll, it, expect, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID, createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { pool } from "../lib/db";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { captureReadingPolicy } from "../lib/trial/reading-policy";
import { captureFreeMenh, freeMenhView } from "../lib/ai/free-menh";
import { createTrialOwner, saveTrialReading } from "../lib/trial/store";
import {
  loginVerifiedGoogle,
  linkCreatedReading,
} from "../lib/customer-auth/accounts";
import { createCheckout, checkoutOrder, testOffer } from "../lib/checkout/test";
import { receiveSePayTest } from "../lib/payments/sepay-test";
import { runReportJob } from "../lib/jobs";
import { readingHash } from "../lib/order-readings";
import { reconcilePaidOrders, readPaid, retryPaid } from "../lib/ai/paid-store";
import {
  PAID_EDITION,
  paidUserInput,
  paidInstructions,
  PAID_PALACES,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { runAiMenhJob } from "../lib/ai/worker";
import { GenerationFailure } from "../lib/ai/provider";
import { mockPaidGeneration } from "./fixtures/ai-paid-mock";
import { paidInput } from "../lib/ai/paid-input";
import { GET, POST } from "../app/api/trial/readings/[id]/ai-paid/route";
import { CUSTOMER_COOKIE } from "../lib/customer-auth/config";
const secret = "local-only-paid-test-secret-not-provider-key";
let record: any,
  user: any,
  other: any,
  order: string,
  code: string,
  seq = Date.now(),
  beforeHash: string;
const req = (token: string, method = "GET", body?: unknown) =>
  new NextRequest(
    "http://localhost:3113/api/trial/readings/" + record.id + "/ai-paid",
    {
      method,
      headers: {
        cookie: CUSTOMER_COOKIE + "=" + token,
        origin: "http://localhost:3113",
        ...(method === "POST" ? { "content-type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );
const args = () => ({ params: Promise.resolve({ id: record.id }) });
const pay = (target = code) => {
  const raw = JSON.stringify({
    id: ++seq,
    gateway: "ACB",
    accountNumber: "0000000001",
    subAccount: "",
    code: target,
    transferType: "in",
    transferAmount: 1000,
    referenceCode: "paid31-" + seq,
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const auth = {
    timestamp,
    signature:
      "sha256=" +
      createHmac("sha256", secret)
        .update(timestamp + "." + raw)
        .digest("hex"),
  };
  return Promise.all([
    receiveSePayTest(raw, auth),
    receiveSePayTest(raw, auth),
  ]);
};
beforeAll(async () => {
  if (
    !new URL(process.env.DATABASE_URL!).pathname.startsWith(
      "/tinhluan_ai_menh_paid31_test_",
    )
  )
    throw Error("DEDICATED_PAID_TEST_DB_REQUIRED");
  for (const [k, v] of Object.entries({
    AI_PAID_ENABLED: "true",
    AI_MENH_ENABLED: "false",
    AI_PAID_READING_MODEL: "gpt-6-astra",
    OPENAI_API_KEY: "",
    CUSTOMER_AUTH_ENABLED: "true",
    FREE_TRIAL_ENABLED: "true",
    READING_RECOVERY_ENABLED: "true",
    APP_ORIGIN: "http://localhost:3113",
    CUSTOMER_ALLOWED_ORIGINS: "http://localhost:3113",
    CHECKOUT_TEST_ENABLED: "true",
    CHECKOUT_TEST_OFFER_VERSION: "qa-paid31-fixture",
    CHECKOUT_TEST_AMOUNT: "1000",
    CHECKOUT_TEST_ACCESS_HOURS: "72",
    SEPAY_MODE: "test",
    SEPAY_TEST_ENABLED: "true",
    SEPAY_LIVE_ENABLED: "false",
    SEPAY_TEST_WEBHOOK_SECRET: secret,
    SEPAY_TEST_ACCOUNT_NUMBER: "0000000001",
    SEPAY_TEST_GATEWAY: "ACB",
    SEPAY_TEST_SUB_ACCOUNT: "",
    CORE_ORDER_TEST_ENABLED: "true",
    TRIAL_READING_DIR: await fs.mkdtemp(path.join(os.tmpdir(), "paid31-")),
  }))
    vi.stubEnv(k, v);
  const { snapshot, receipt } = await calculateInternal({
    name: "QA tổng hợp",
    date: "1992-08-07",
    hour: 16,
    minute: 0,
    gender: "male",
    calendar: "solar",
    timezone: "Asia/Ho_Chi_Minh",
    profile: "tanbien-vn-trial-v2",
    place: "Không ghi",
    unknownTime: false,
    consent: true,
  });
  record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    snapshot,
    receipt,
    frozen: freezeReading(snapshot, receipt),
  };
  record.accessPolicy = captureReadingPolicy(record);
  record.freeMenh = await captureFreeMenh(record);
  beforeHash = readingHash(record);
  user = await loginVerifiedGoogle({ subject: "paid31-" + randomUUID() });
  other = await loginVerifiedGoogle({
    subject: "paid31-other-" + randomUUID(),
  });
  vi.stubEnv("CHECKOUT_TEST_USER_IDS", user.userId);
  const owner = await createTrialOwner();
  await saveTrialReading(owner.owner, record);
  await linkCreatedReading(user.token, owner.token, record.id);
  order = await createCheckout(
    user.token,
    record.id,
    "cung-1",
    testOffer()!.version,
  );
  code = (await pool.query("SELECT code FROM orders WHERE id=$1", [order]))
    .rows[0].code;
});
afterAll(async () => {
  vi.unstubAllEnvs();
  await pool.end();
});
it("free Mệnh is unchanged; no prepayment queue or unowned access", async () => {
  expect(await reconcilePaidOrders(record.id)).toBe(0);
  expect((await readPaid(record, order)).eligible).toBe(false);
  expect((await GET(req(other.token), args())).status).toBe(404);
  expect(
    (
      await pool.query("SELECT * FROM ai_reading_jobs WHERE reading_id=$1", [
        record.id,
      ])
    ).rowCount,
  ).toBe(0);
  expect(freeMenhView(record).paragraphs.length).toBeGreaterThan(0);
});
it("duplicate settlement + grant produce exactly 11 durable jobs, no historical upgrade", async () => {
  await pay();
  await runReportJob(order);
  expect((await checkoutOrder(user.token, order))?.state).toBe("delivered");
  expect((await checkoutOrder(user.token, order))?.returnUrl).toContain(
    "ai=waiting",
  );
  await Promise.all([
    reconcilePaidOrders(record.id),
    reconcilePaidOrders(record.id),
  ]);
  expect(
    (
      await pool.query("SELECT * FROM ai_reading_jobs WHERE reading_id=$1", [
        record.id,
      ])
    ).rowCount,
  ).toBe(11);
  expect(
    (
      await pool.query(
        "SELECT * FROM access_tokens WHERE order_id=$1 AND purpose='customer-order'",
        [order],
      )
    ).rowCount,
  ).toBe(1);
  const legacy = { ...structuredClone(record), id: randomUUID() };
  const owner = await createTrialOwner();
  await saveTrialReading(owner.owner, legacy);
  await linkCreatedReading(user.token, owner.token, legacy.id);
  vi.stubEnv("AI_PAID_ENABLED", "false");
  const oldOrder = await createCheckout(
    user.token,
    legacy.id,
    "cung-1",
    testOffer()!.version,
  );
  vi.stubEnv("AI_PAID_ENABLED", "true");
  const oldCode = (
    await pool.query("SELECT code FROM orders WHERE id=$1", [oldOrder])
  ).rows[0].code;
  await pay(oldCode);
  await runReportJob(oldOrder);
  expect((await checkoutOrder(user.token, oldOrder))?.state).toBe("delivered");
  expect((await readPaid(legacy, oldOrder)).eligible).toBe(false);
  expect(await reconcilePaidOrders(legacy.id)).toBe(0);
});
it("two consumers claim different jobs and GET/reopen never generate more work", async () => {
  let calls = 0;
  const narrator = async (input: any) => {
    calls++;
    await new Promise((r) => setTimeout(r, 20));
    return mockPaidGeneration(input);
  };
  await Promise.all([
    runAiMenhJob(narrator, { paid: true, readingId: record.id, palace: PAID_PALACES[0] }),
    runAiMenhJob(narrator, { paid: true, readingId: record.id, palace: PAID_PALACES[1] }),
  ]);
  expect(calls).toBe(2);
  await expect(runAiMenhJob(narrator,{paid:true,readingId:record.id,palace:"Mệnh"})).rejects.toThrow("AI_INVALID_PALACE_SCOPE");
  expect(await runAiMenhJob(narrator,{paid:true,readingId:record.id,palace:PAID_PALACES[0]})).toBe(false);
  expect((await pool.query("SELECT palace FROM ai_reading_jobs WHERE reading_id=$1 AND status='completed' ORDER BY palace",[record.id])).rows.map(r=>r.palace).sort()).toEqual([PAID_PALACES[0],PAID_PALACES[1]].sort());
  expect(calls).toBe(2);
  const before = await pool.query(
    "SELECT attempts FROM ai_reading_jobs WHERE reading_id=$1 ORDER BY palace",
    [record.id],
  );
  for (let i = 0; i < 3; i++) {
    const r = await GET(req(user.token), args());
    expect((await r.json()).completed).toBe(2);
  }
  expect(
    (
      await pool.query(
        "SELECT attempts FROM ai_reading_jobs WHERE reading_id=$1 ORDER BY palace",
        [record.id],
      )
    ).rows,
  ).toEqual(before.rows);
});
it("known error preserves rights; explicit retry is idempotent and completed immutable", async () => {
  await runAiMenhJob(
    async () => {
      throw new GenerationFailure("AI_NOT_CONFIGURED", true);
    },
    { paid: true, readingId: record.id },
  );
  const bad = (
    await pool.query(
      "SELECT palace FROM ai_reading_jobs WHERE reading_id=$1 AND status='error'",
      [record.id],
    )
  ).rows[0].palace;
  expect((await readPaid(record, order)).eligible).toBe(true);
  await pool.query(
    "UPDATE ai_reading_jobs SET run_after=now() WHERE reading_id=$1 AND palace=$2",
    [record.id, bad],
  );
  await Promise.all([
    retryPaid(record, order, bad),
    retryPaid(record, order, bad),
  ]);
  expect(
    (
      await pool.query(
        "SELECT count(*) FROM ai_reading_jobs WHERE reading_id=$1 AND palace=$2 AND status='queued'",
        [record.id, bad],
      )
    ).rows[0].count,
  ).toBe("1");
  // Isolate the retried job from equally-timestamped queued jobs. This case must
  // finish its two-attempt retry before the next case tests a first-attempt timeout.
  await pool.query("UPDATE ai_reading_jobs SET run_after=now()+interval '1 hour' WHERE reading_id=$1 AND palace<>$2 AND status='queued'", [record.id,bad]);
  await runAiMenhJob(async i=>mockPaidGeneration(i),{paid:true,readingId:record.id});
  expect((await pool.query("SELECT status,attempts FROM ai_reading_jobs WHERE reading_id=$1 AND palace=$2",[record.id,bad])).rows[0]).toMatchObject({status:'completed',attempts:2});
  await pool.query("UPDATE ai_reading_jobs SET run_after=now() WHERE reading_id=$1 AND status='queued'",[record.id]);
  const complete = (
    await pool.query(
      "SELECT palace,result FROM ai_reading_jobs WHERE reading_id=$1 AND status='completed' LIMIT 1",
      [record.id],
    )
  ).rows[0];
  await retryPaid(record, order, complete.palace);
  expect(
    (
      await pool.query(
        "SELECT result FROM ai_reading_jobs WHERE reading_id=$1 AND palace=$2",
        [record.id, complete.palace],
      )
    ).rows[0].result,
  ).toEqual(complete.result);
});
it("ambiguous timeout never CREATEs again and does not turn purchased rights into failure", async () => {
  await runAiMenhJob(
    async () => {
      throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
    },
    { paid: true, readingId: record.id },
  );
  const row = (
    await pool.query(
      "SELECT * FROM ai_reading_jobs WHERE reading_id=$1 AND status='uncertain'",
      [record.id],
    )
  ).rows[0];
  await retryPaid(record, order, row.palace);
  expect(
    (
      await pool.query(
        "SELECT status,attempts FROM ai_reading_jobs WHERE id=$1",
        [row.id],
      )
    ).rows[0],
  ).toMatchObject({ status: "uncertain", attempts: 1 });
  expect((await readPaid(record, order)).state).toBe("attention");
});
it("unknown schema/reference fails validation; target geometry and knowledge use the saved snapshot", () => {
  const i = paidInput(record, "Phụ Mẫu");
  expect(JSON.parse(paidUserInput(i)).task).toBe("Luận riêng cung Phụ Mẫu");
  expect(JSON.parse(paidUserInput(i)).paidTarget.palace).toBe("Phụ Mẫu");
  expect(i.facts.find((f) => f.id === "geometry.tam-hop")!.text).toContain(
    "của Phụ Mẫu",
  );
  expect(() => validatePaidNarration({}, i)).toThrow("AI_INVALID_SCHEMA");
  const mock = mockPaidGeneration(i);
  (mock.raw as any).sections[0].factIds = ["invented"];
  expect(() => validatePaidNarration(mock.raw, i)).toThrow(
    "AI_UNKNOWN_REFERENCE",
  );
  expect(readingHash(record)).toBe(beforeHash);
});
it("over ETA is continuing processing, not a fabricated failure; completed content stays durable", async () => {
  await pool.query(
    "UPDATE orders SET paid_at=now()-interval '6 minutes' WHERE id=$1",
    [order],
  );
  expect((await readPaid(record, order)).overEstimate).toBe(true);
  while (
    await runAiMenhJob(async (i) => mockPaidGeneration(i), {
      paid: true,
      readingId: record.id,
    })
  ) {}
  expect((await readPaid(record, order)).completed).toBe(10);
  expect((await readPaid(record, order)).state).toBe("attention");
  expect(await reconcilePaidOrders(record.id)).toBe(0);
  expect(
    (
      await pool.query(
        "SELECT count(*) FROM ai_reading_jobs WHERE reading_id=$1 AND palace=$2",
        [record.id, "Mệnh"],
      )
    ).rows[0].count,
  ).toBe("0");
});
it("known provider receipt reconciles the same attempt without CREATE and completes 11/11", async () => {
  const j = (
    await pool.query(
      "SELECT * FROM ai_reading_jobs WHERE reading_id=$1 AND status='uncertain'",
      [record.id],
    )
  ).rows[0];
  await pool.query(
    "UPDATE ai_reading_attempts SET provider='openai',response_id='mock-known-receipt' WHERE id=$1",
    [j.attempt_id],
  );
  await pool.query("UPDATE ai_reading_jobs SET run_after=now() WHERE id=$1", [
    j.id,
  ]);
  await runAiMenhJob(
    async (i, attempt, recovery) => {
      expect(attempt).toBe(j.attempt_id);
      expect(recovery?.responseId).toBe("mock-known-receipt");
      return { ...mockPaidGeneration(i), responseId: "mock-known-receipt" };
    },
    { paid: true, readingId: record.id, allowCreate: false },
  );
  const v = await readPaid(record, order);
  expect(v.completed).toBe(11);
  expect(v.state).toBe("completed");
  expect(v.overEstimate).toBe(false);
  expect(
    (
      await pool.query("SELECT attempts FROM ai_reading_jobs WHERE id=$1", [
        j.id,
      ])
    ).rows[0].attempts,
  ).toBe(1);
});
it("revocation blocks reading/retry/worker without deleting results", async () => {
  await pool.query(
    "UPDATE access_tokens SET revoked_at=now() WHERE order_id=$1",
    [order],
  );
  expect((await readPaid(record, order)).eligible).toBe(false);
  await expect(retryPaid(record, order, PAID_PALACES[0])).rejects.toThrow(
    "AI_PAID_ACCESS_DENIED",
  );
  expect(
    await runAiMenhJob(async (i) => mockPaidGeneration(i), {
      paid: true,
      readingId: record.id,
    }),
  ).toBe(false);
  expect(
    (
      await pool.query(
        "SELECT count(*) FROM ai_reading_jobs WHERE reading_id=$1 AND status='completed'",
        [record.id],
      )
    ).rows[0].count,
  ).toBe("11");
  expect(readingHash(record)).toBe(beforeHash);
});

it("Tật Ách dry-run remains structural and rejects medical claims without API", () => {
  const input=paidInput(record,"Tật Ách");
  expect(paidInstructions(input)).toContain("Riêng Tật Ách chỉ chú giải truyền thống theo cấu trúc");
  const safe=mockPaidGeneration(input);
  expect(validatePaidNarration(safe.raw,input).sections).toHaveLength(8);
  (safe.raw as any).sections[0].content="Bạn sẽ mắc bệnh và cần điều trị ngay.";
  expect(()=>validatePaidNarration(safe.raw,input)).toThrow("AI_SCOPE_VIOLATION");
});
