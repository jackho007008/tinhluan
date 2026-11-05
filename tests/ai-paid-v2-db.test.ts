import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v281";
import { authorizePaidAccountRetry } from "../lib/ai/account-recovery";
import { PAID_PROMPT_V2 } from "../lib/ai/paid-reading-v2";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
import { beforeAll, afterAll, it, expect, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID, createHmac } from "node:crypto";
import { spawnSync } from "node:child_process";
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
  await pool.query("TRUNCATE ai_reading_attempts,ai_reading_jobs");
  for (const [k, v] of Object.entries({
    AI_PAID_ENABLED: "true",
    AI_PAID_READING_V2_ENABLED: "true",
    AI_PAID_DAILY_BUDGET_USD: "100",
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
it("new V2 jobs honor duplicate payment/grants, deliver three coverage states, and remain unchanged on refresh/reopen", async () => {
  await pay();
  await runReportJob(order);
  await Promise.all([
    reconcilePaidOrders(record.id),
    reconcilePaidOrders(record.id),
  ]);
  const jobs = (
    await pool.query("SELECT * FROM ai_reading_jobs WHERE reading_id=$1", [
      record.id,
    ])
  ).rows;
  expect(jobs).toHaveLength(11);
  expect(jobs.every((j) => j.prompt_version === PAID_PROMPT_CURRENT)).toBe(
    true,
  );
  for (const [palace, coverage] of [
    ["Quan Lộc", "focused"],
    ["Tài Bạch", "limited"],
    ["Nô Bộc", "insufficient"],
  ] as const) {
    await runAiMenhJob(
      async (i, attempt, recovery) => {
        expect(recovery?.promptVersion).toBe(PAID_PROMPT_CURRENT);
        return mockPaidV2(i, coverage);
      },
      { paid: true, readingId: record.id, palace },
    );
  }
  let v = await readPaid(record, order);
  expect(v).toMatchObject({
    eligible: true,
    processed: 3,
    completed: 2,
    focused: 1,
    limited: 1,
    insufficient: 1,
  });
  const storedBefore = (
    await pool.query(
      "SELECT id,status,attempts,result FROM ai_reading_jobs WHERE reading_id=$1 ORDER BY id",
      [record.id],
    )
  ).rows;
  for (let n = 0; n < 3; n++)
    expect(await (await GET(req(user.token), args())).json()).toEqual(v);
  expect((await GET(req(other.token), args())).status).toBe(404);
  await retryPaid(record, order, "Nô Bộc");
  expect(
    (
      await pool.query(
        "SELECT id,status,attempts,result FROM ai_reading_jobs WHERE reading_id=$1 ORDER BY id",
        [record.id],
      )
    ).rows,
  ).toEqual(storedBefore);
  for (const palace of PAID_PALACES.filter(
    (p) => !["Quan Lộc", "Tài Bạch", "Nô Bộc"].includes(p),
  ))
    await runAiMenhJob(async (i) => mockPaidV2(i), {
      paid: true,
      readingId: record.id,
      palace,
    });
  v = await readPaid(record, order);
  expect(v.processed).toBe(11);
  expect(v.insufficient).toBeGreaterThan(0);
  expect(v.state).toBe("content-limited");
  expect(v.overEstimate).toBe(false);
  expect(await reconcilePaidOrders(record.id)).toBe(0);
  expect(readingHash(record)).toBe(beforeHash);
  expect(freeMenhView(record).paragraphs.length).toBeGreaterThan(0);
  const completed = (
    await pool.query(
      "SELECT id,result FROM ai_reading_jobs WHERE reading_id=$1 ORDER BY id",
      [record.id],
    )
  ).rows;
  await runAiMenhJob(
    async () => {
      throw Error("NO_NEW_GENERATION");
    },
    { paid: true, readingId: record.id },
  );
  expect(
    (
      await pool.query(
        "SELECT id,result FROM ai_reading_jobs WHERE reading_id=$1 ORDER BY id",
        [record.id],
      )
    ).rows,
  ).toEqual(completed);
});
it("V1 pending receipt survives writer V2 enablement and reconciles with its old prompt/attempt", async () => {
  const prior = {
    ...structuredClone(record),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const owner = await createTrialOwner();
  await saveTrialReading(owner.owner, prior);
  await linkCreatedReading(user.token, owner.token, prior.id);
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "false");
  const oldOrder = await createCheckout(
    user.token,
    prior.id,
    "cung-4",
    testOffer()!.version,
  );
  const oldCode = (
    await pool.query("SELECT code FROM orders WHERE id=$1", [oldOrder])
  ).rows[0].code;
  await pay(oldCode);
  await runReportJob(oldOrder);
  await reconcilePaidOrders(prior.id);
  const job = (
    await pool.query(
      "SELECT * FROM ai_reading_jobs WHERE reading_id=$1 AND palace='Quan Lộc'",
      [prior.id],
    )
  ).rows[0];
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "true");
  await runAiMenhJob(
    async (i, a, r) => {
      expect(r?.promptVersion).toBe("paid-palaces-vietnamese-1.2.0");
      await r!.onResponseCreated("resp_qa_v1_pending", "gpt-6-astra");
      throw new GenerationFailure("AI_BACKGROUND_PENDING", false, true);
    },
    { paid: true, readingId: prior.id, palace: "Quan Lộc" },
  );
  const pending = (
    await pool.query("SELECT * FROM ai_reading_jobs WHERE id=$1", [job.id])
  ).rows[0];
  await pool.query("UPDATE ai_reading_jobs SET run_after=now() WHERE id=$1", [
    job.id,
  ]);
  await runAiMenhJob(
    async (i, a, r) => {
      expect(r?.promptVersion).toBe(job.prompt_version);
      expect(r?.responseId).toBe("resp_qa_v1_pending");
      expect(a).toBe(pending.attempt_id);
      return { ...mockPaidGeneration(i), responseId: r!.responseId! };
    },
    { paid: true, readingId: prior.id, palace: "Quan Lộc", allowCreate: false },
  );
  const final = (
    await pool.query("SELECT * FROM ai_reading_jobs WHERE id=$1", [job.id])
  ).rows[0];
  expect(final).toMatchObject({
    status: "completed",
    attempts: 1,
    attempt_id: pending.attempt_id,
    prompt_version: job.prompt_version,
    input_hash: job.input_hash,
  });
  expect(final.result.content.sections).toHaveLength(8);
  expect(final.result.content.schemaVersion).toBeUndefined();
  const v = await readPaid(prior, oldOrder);
  expect(v.completed).toBe(1);
  expect(v.focused).toBe(0);
  expect(v.limited).toBe(0);
});
it("terminal credit failure preserves receipt and rights; V2 validation failure is not uncertain", async () => {
  const fresh = {
    ...structuredClone(record),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const owner = await createTrialOwner();
  await saveTrialReading(owner.owner, fresh);
  await linkCreatedReading(user.token, owner.token, fresh.id);
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "true");
  const id = await createCheckout(
    user.token,
    fresh.id,
    "cung-4",
    testOffer()!.version,
  );
  const c = (await pool.query("SELECT code FROM orders WHERE id=$1", [id]))
    .rows[0].code;
  await pay(c);
  await runReportJob(id);
  await reconcilePaidOrders(fresh.id);
  await runAiMenhJob(
    async (input, _a, recovery) => {
      await recovery!.onResponseCreated(
        "resp_mock_credit_terminal",
        "gpt-6-astra",
      );
      return {
        ...mockPaidV2(input),
        provider: "openai",
        responseId: "resp_mock_credit_terminal",
        raw: null,
        estimatedCostUsd: null,
        failure: { code: "AI_BILLING_UNAVAILABLE", retryable: false },
      };
    },
    { paid: true, readingId: fresh.id, palace: "Quan Lộc" },
  );
  const row = (
    await pool.query(
      "SELECT j.*,row_to_json(a) AS attempt FROM ai_reading_jobs j LEFT JOIN ai_reading_attempts a ON a.id=j.attempt_id WHERE j.reading_id=$1 AND j.palace='Quan Lộc'",
      [fresh.id],
    )
  ).rows[0];
  expect(row).toMatchObject({
    status: "error",
    error_code: "AI_BILLING_UNAVAILABLE",
    attempts: 1,
    retryable: false,
    result: null,
  });
  expect(row.attempt).toMatchObject({
    response_id: "resp_mock_credit_terminal",
    error_code: "AI_BILLING_UNAVAILABLE",
  });
  await retryPaid(fresh, id, "Quan Lộc");
  let invoked = 0;
  await runAiMenhJob(
    async () => {
      invoked++;
      throw Error("NO_REPEAT");
    },
    { paid: true, readingId: fresh.id, palace: "Quan Lộc", allowCreate: false },
  );
  expect(invoked).toBe(0);
  expect((await readPaid(fresh, id)).eligible).toBe(true);
  await runAiMenhJob(
    async (input) => {
      const gen = mockPaidV2(input, "focused");
      (gen.raw as any).sections[1].id = (gen.raw as any).sections[0].id;
      return gen;
    },
    { paid: true, readingId: fresh.id, palace: "Tài Bạch" },
  );
  expect(
    (
      await pool.query(
        "SELECT status,error_code,attempts FROM ai_reading_jobs WHERE reading_id=$1 AND palace='Tài Bạch'",
        [fresh.id],
      )
    ).rows[0],
  ).toMatchObject({
    status: "error",
    error_code: "AI_INVALID_OUTPUT",
    attempts: 1,
  });
});
it("operator recovery preserves the failed receipt/attempt and still requires an authorized owner retry", async () => {
  const fresh = {
      ...structuredClone(record),
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    },
    owner = await createTrialOwner();
  await saveTrialReading(owner.owner, fresh);
  await linkCreatedReading(user.token, owner.token, fresh.id);
  const order2 = await createCheckout(
      user.token,
      fresh.id,
      "cung-4",
      testOffer()!.version,
    ),
    code2 = (await pool.query("SELECT code FROM orders WHERE id=$1", [order2]))
      .rows[0].code;
  await pay(code2);
  await runReportJob(order2);
  await reconcilePaidOrders(fresh.id);
  let generations = 0;
  await runAiMenhJob(
    async (i, _a, recovery) => {
      generations++;
      await recovery!.onResponseCreated(
        "resp_mock_recovery_failed",
        "gpt-6-astra",
      );
      return {
        ...mockPaidV2(i),
        provider: "openai",
        responseId: "resp_mock_recovery_failed",
        raw: null,
        estimatedCostUsd: null,
        failure: { code: "AI_BILLING_UNAVAILABLE", retryable: false },
      };
    },
    { paid: true, readingId: fresh.id, palace: "Quan Lộc" },
  );
  const before = (
    await pool.query(
      "SELECT j.*,row_to_json(a) AS attempt FROM ai_reading_jobs j JOIN ai_reading_attempts a ON a.id=j.attempt_id WHERE j.reading_id=$1 AND j.palace='Quan Lộc'",
      [fresh.id],
    )
  ).rows[0];
  vi.stubEnv("AI_PAID_OPERATOR_RECOVERY_ENABLED", "true");
  vi.stubEnv("AI_PAID_MAX_DAILY_CREATES", "100");
  const identity = (
      await pool.query(
        "SELECT current_database() AS name,inet_server_port() AS port",
      )
    ).rows[0],
    now = Date.now();
  const plan = {
    version: "paid-account-recovery-1.0.0",
    database: identity.name,
    port: identity.port,
    readingId: fresh.id,
    createdAt: new Date(now - 1000).toISOString(),
    expiresAt: new Date(now + 60000).toISOString(),
    accountAndFailureVerified: true,
    reason: "Mock provider billing failure verified and test credit restored.",
    reserveUsd: 2,
    jobs: [
      {
        jobId: before.id,
        attemptId: before.attempt_id,
        responseId: before.attempt.response_id,
        errorCode: "AI_BILLING_UNAVAILABLE",
      },
    ],
  };
  expect(await authorizePaidAccountRetry(pool, plan)).toMatchObject({
    mode: "dry-run",
    changed: 0,
  });
  expect(
    (
      await pool.query("SELECT retryable FROM ai_reading_jobs WHERE id=$1", [
        before.id,
      ])
    ).rows[0].retryable,
  ).toBe(false);
  const planFile = path.join(
    await fs.mkdtemp(path.join(os.tmpdir(), "ai-recovery-plan-")),
    "plan.json",
  );
  await fs.writeFile(planFile, JSON.stringify(plan), { mode: 0o600 });
  const cli = (apply = false) =>
    spawnSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "scripts/ai-paid-account-recovery.ts",
        planFile,
        ...(apply ? ["--apply"] : []),
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, OPENAI_API_KEY: "" },
        encoding: "utf8",
        timeout: 10000,
      },
    );
  const preview = cli();
  expect(preview.status).toBe(0);
  expect(JSON.parse(preview.stdout)).toMatchObject({
    mode: "dry-run",
    changed: 0,
  });
  const applied = cli(true);
  expect(applied.status).toBe(0);
  expect(JSON.parse(applied.stdout)).toMatchObject({
    changed: 1,
    providerCreates: 0,
  });
  expect(
    JSON.parse(await fs.readFile(planFile + ".receipt.json", "utf8")).state,
  ).toBe("authorized");
  expect(cli(true).status).not.toBe(0); // a receipt is never silently replayed
  const authorized = (
    await pool.query(
      "SELECT j.*,row_to_json(a) AS attempt FROM ai_reading_jobs j JOIN ai_reading_attempts a ON a.id=j.attempt_id WHERE j.id=$1",
      [before.id],
    )
  ).rows[0];
  expect(authorized.attempt).toEqual(before.attempt);
  expect(authorized.status).toBe("error");
  expect(authorized.attempts).toBe(1);
  expect(authorized.retryable).toBe(true);
  expect(
    (
      await pool.query(
        "SELECT EXISTS(SELECT 1 FROM ai_reading_jobs WHERE reading_id=$1 AND status='error' AND NOT retryable AND error_code IN ('AI_BILLING_UNAVAILABLE','AI_ACCESS_UNAVAILABLE')) AS blocked",
        [fresh.id],
      )
    ).rows[0].blocked,
  ).toBe(false);
  await readPaid(fresh, order2);
  expect(generations).toBe(1);
  // Existing owner-only retry validates the original grant, not the operator plan.
  await expect(retryPaid(fresh, order, "Quan Lộc")).rejects.toThrow(
    "AI_PAID_ACCESS_DENIED",
  );
  expect(
    (
      await pool.query("SELECT status FROM ai_reading_jobs WHERE id=$1", [
        before.id,
      ])
    ).rows[0].status,
  ).toBe("error");
  await pool.query(
    "UPDATE ai_reading_jobs SET run_after=now()-interval '1 second' WHERE id=$1",
    [before.id],
  );
  await retryPaid(fresh, order2, "Quan Lộc");
  await runAiMenhJob(
    async (i) => {
      generations++;
      return mockPaidV2(i);
    },
    { paid: true, readingId: fresh.id, palace: "Quan Lộc" },
  );
  const after = (
    await pool.query(
      "SELECT status,attempts,attempt_id FROM ai_reading_jobs WHERE id=$1",
      [before.id],
    )
  ).rows[0];
  expect(after.status).toBe("completed");
  expect(after.attempts).toBe(2);
  expect(after.attempt_id).not.toBe(before.attempt_id);
  expect(generations).toBe(2);
  expect(
    (
      await pool.query(
        "SELECT row_to_json(a) AS attempt FROM ai_reading_attempts a WHERE id=$1",
        [before.attempt_id],
      )
    ).rows[0].attempt,
  ).toEqual(before.attempt);
});
