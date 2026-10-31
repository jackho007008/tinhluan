import { beforeAll, afterAll, afterEach, it, expect, vi } from "vitest";
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
  await pool.query("TRUNCATE ai_reading_attempts,ai_reading_jobs");
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
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
import { openaiNarrator } from "../lib/ai/provider";
import { backgroundDecision } from "../lib/ai/background";
const scope = (palace: string) => ({
  paid: true,
  readingId: record.id,
  palace,
});
const job = async (palace: string) =>
  (
    await pool.query(
      "SELECT j.*,a.response_id,a.usage,a.started_at FROM ai_reading_jobs j LEFT JOIN ai_reading_attempts a ON a.id=j.attempt_id WHERE j.reading_id=$1 AND j.palace=$2",
      [record.id, palace],
    )
  ).rows[0];
const due = async (palace: string) =>
  pool.query(
    "UPDATE ai_reading_jobs SET run_after=now() WHERE reading_id=$1 AND palace=$2",
    [record.id, palace],
  );
it("provider >300 seconds yields once, survives restart, and completes same attempt via GET only", async () => {
  await pay();
  await runReportJob(order);
  await reconcilePaidOrders(record.id);
  vi.stubEnv("OPENAI_API_KEY", "mock-only-key");
  let creates = 0,
    gets = 0,
    ready = false;
  const raw = mockPaidGeneration(paidInput(record, "Quan Lộc")).raw;
  const fetcher = vi.fn(async (url: any, init: any) => {
    const u = String(url),
      method = init?.method || "GET";
    if (u.includes("/models/")) return Response.json({ id: "gpt-6-astra" });
    if (method === "POST") {
      creates++;
      expect(JSON.parse(init.body).store).toBe(true);
    } else {
      gets++;
      expect(u).toContain("/responses/resp_bg34");
    }
    return Response.json({
      id: "resp_bg34",
      object: "response",
      created_at: 1793326353,
      completed_at: ready ? 1793327165 : null,
      status: ready ? "completed" : "in_progress",
      model: "gpt-6-astra",
      service_tier: "default",
      output: ready
        ? [
            {
              type: "message",
              role: "assistant",
              id: "msg",
              content: [
                {
                  type: "output_text",
                  text: JSON.stringify(raw),
                  annotations: [],
                },
              ],
            },
          ]
        : [],
      usage: ready
        ? {
            input_tokens: 28108,
            input_tokens_details: {
              cached_tokens: 0,
              cache_write_tokens: 28105,
            },
            output_tokens: 5916,
            output_tokens_details: { reasoning_tokens: 3358 },
          }
        : null,
    });
  });
  vi.stubGlobal("fetch", fetcher);
  await runAiMenhJob(openaiNarrator, scope("Quan Lộc"));
  const first = await job("Quan Lộc");
  expect(first.status).toBe("uncertain");
  expect(first.error_code).toBe("AI_BACKGROUND_PENDING");
  await pool.query(
    "UPDATE orders SET paid_at=now()-interval '6 minutes' WHERE id=$1",
    [order],
  );
  const pendingView = await readPaid(record, order);
  expect(pendingView.state).toBe("processing");
  expect(pendingView.overEstimate).toBe(true);
  expect(pendingView.palaces.find((p) => p.palace === "Quan Lộc")?.state).toBe(
    "reconciling",
  );
  expect(creates).toBe(1);
  expect(gets).toBe(0);
  // A fresh invocation uses only persisted DB state, not an in-memory timer.
  await due("Quan Lộc");
  await runAiMenhJob(openaiNarrator, {
    ...scope("Quan Lộc"),
    allowCreate: false,
  });
  expect((await job("Quan Lộc")).usage._background.checks).toBe(1);
  expect(
    await runAiMenhJob(openaiNarrator, {
      ...scope("Quan Lộc"),
      allowCreate: false,
    }),
  ).toBe(false);
  ready = true;
  await due("Quan Lộc");
  await Promise.all([
    runAiMenhJob(openaiNarrator, scope("Quan Lộc")),
    runAiMenhJob(openaiNarrator, scope("Quan Lộc")),
  ]);
  const last = await job("Quan Lộc");
  expect(last.status).toBe("completed");
  expect(last.attempt_id).toBe(first.attempt_id);
  expect(last.attempts).toBe(1);
  expect(creates).toBe(1);
  expect(gets).toBe(2);
  expect(last.result.timing.providerElapsedMs).toBe(812000);
  expect(last.result.estimatedCostUsd).toBeCloseTo(0.6471425, 8);
  expect(last.result.cost.kind).toBe("estimate-not-provider-invoice");
  const before = JSON.stringify(last.result);
  await readPaid(record, order);
  await runAiMenhJob(openaiNarrator, scope("Quan Lộc"));
  expect(JSON.stringify((await job("Quan Lộc")).result)).toBe(before);
  expect(creates).toBe(1);
});
it("restart after dispatch uses durable ID; provider errors back off then 404 requires review, never CREATE", async () => {
  await runAiMenhJob(async (_i, _a, r) => {
    await r!.onResponseCreated("resp_restart", "gpt-6-astra");
    throw new GenerationFailure("AI_BACKGROUND_PENDING", false, true);
  }, scope("Tài Bạch"));
  const first = await job("Tài Bạch");
  await pool.query(
    "UPDATE ai_reading_jobs SET status='running',locked_at=now()-interval '7 minutes',run_after=now() WHERE id=$1",
    [first.id],
  );
  vi.stubEnv("OPENAI_API_KEY", "mock-only-key");
  let gets = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: any, init: any) => {
      expect(init?.method || "GET").toBe("GET");
      gets++;
      return Response.json(
        { error: { message: "fixture", type: "server_error" } },
        { status: gets === 1 ? 500 : 404 },
      );
    }),
  );
  await runAiMenhJob(openaiNarrator, {
    ...scope("Tài Bạch"),
    allowCreate: false,
  });
  const pending = await job("Tài Bạch");
  expect(pending.usage._background.checks).toBe(1);
  expect(new Date(pending.run_after).getTime() - Date.now()).toBeGreaterThan(
    50000,
  );
  await due("Tài Bạch");
  await runAiMenhJob(openaiNarrator, scope("Tài Bạch"));
  expect((await job("Tài Bạch")).error_code).toBe("AI_RESPONSE_UNAVAILABLE");
  await due("Tài Bạch");
  expect(await runAiMenhJob(openaiNarrator, scope("Tài Bạch"))).toBe(false);
  expect(gets).toBe(2);
  const held = await readPaid(record, order);
  expect(held.state).toBe("attention");
  expect(held.palaces.find((p) => p.palace === "Tài Bạch")).toMatchObject({
    state: "uncertain",
    canRetry: false,
  });
  expect((await job("Tài Bạch")).attempts).toBe(1);
});
it("unknown accepted CREATE with lost ID is held without another request", async () => {
  let calls = 0;
  await runAiMenhJob(async () => {
    calls++;
    throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
  }, scope("Phu Thê"));
  await due("Phu Thê");
  expect(
    await runAiMenhJob(async () => {
      calls++;
      throw Error("unexpected");
    }, scope("Phu Thê")),
  ).toBe(false);
  expect(calls).toBe(1);
  expect((await job("Phu Thê")).retryable).toBe(false);
  const held = await job("Phu Thê");
  await pool.query(
    "UPDATE ai_reading_attempts SET provider='test-mock',response_id='mock-non-provider-receipt' WHERE id=$1",
    [held.attempt_id],
  );
  expect(
    (await readPaid(record, order)).palaces.find((p) => p.palace === "Phu Thê")
      ?.state,
  ).toBe("uncertain");
});
it("GET budget survives crash, exhaustion releases scheduling and does not block another eligible job", async () => {
  await runAiMenhJob(async (_i, _a, r) => {
    await r!.onResponseCreated("resp_budget", "gpt-6-astra");
    throw new GenerationFailure("AI_BACKGROUND_PENDING", false, true);
  }, scope("Thiên Di"));
  const first = await job("Thiên Di");
  await pool.query(
    "UPDATE ai_reading_attempts SET usage=jsonb_set(usage,'{_background,checks}','12') WHERE id=$1",
    [first.attempt_id],
  );
  await due("Thiên Di");
  let gets = 0;
  await runAiMenhJob(
    async () => {
      gets++;
      throw Error("unexpected");
    },
    { ...scope("Thiên Di"), allowCreate: false },
  );
  expect(gets).toBe(0);
  expect((await job("Thiên Di")).error_code).toBe(
    "AI_RECONCILIATION_EXHAUSTED",
  );
  // Pending work yields CPU; reservations remain conservative until reconciled.
  vi.stubEnv("AI_PAID_MAX_RUNNING", "11");
  await runAiMenhJob(async (i) => mockPaidGeneration(i), scope("Phúc Đức"));
  expect((await job("Phúc Đức")).status).toBe("completed");
  const d = backgroundDecision({ checks: 1 }, new Date(Date.now() - 90000000));
  expect(d.exhausted).toBe(true);
});
it("serializes daily budget/concurrency reservations and caps attempts without calling provider", async () => {
  vi.stubEnv("AI_PAID_DAILY_BUDGET_USD", "0");
  const narrator = vi.fn(async (i: any) => mockPaidGeneration(i));
  expect(await runAiMenhJob(narrator, scope("Điền Trạch"))).toBe(false);
  expect(narrator).not.toHaveBeenCalled();
  vi.stubEnv("AI_PAID_DAILY_BUDGET_USD", "100");
  vi.stubEnv("AI_PAID_MAX_RUNNING", "1");
  expect(await runAiMenhJob(narrator, scope("Điền Trạch"))).toBe(false);
  expect(narrator).not.toHaveBeenCalled();
  vi.stubEnv("AI_PAID_MAX_RUNNING", "11");
  await pool.query(
    "UPDATE ai_reading_jobs SET attempts=3 WHERE reading_id=$1 AND palace='Điền Trạch'",
    [record.id],
  );
  expect(await runAiMenhJob(narrator, scope("Điền Trạch"))).toBe(false);
});
it("atomically reserves the last request budget across concurrent consumers", async () => {
  vi.stubEnv("AI_PAID_MAX_RUNNING", "11");
  vi.stubEnv("AI_PAID_MAX_DAILY_CREATES", "100");
  const spent = +(
    await pool.query(
      `SELECT COALESCE(sum(COALESCE(a.estimated_cost_usd,(a.usage->'_background'->>'reservedUsd')::numeric,2)),0) AS usd FROM ai_reading_attempts a JOIN ai_reading_jobs j ON j.id=a.job_id WHERE j.edition=$1 AND (a.started_at>=date_trunc('day',now()) OR a.status IN ('running','uncertain'))`,
      [PAID_EDITION],
    )
  ).rows[0].usd;
  vi.stubEnv("AI_PAID_DAILY_BUDGET_USD", String(spent + 2));
  const narrator = vi.fn(async (i: any) => {
    await new Promise((r) => setTimeout(r, 30));
    return mockPaidGeneration(i);
  });
  await Promise.all([
    runAiMenhJob(narrator, scope("Nô Bộc")),
    runAiMenhJob(narrator, scope("Phụ Mẫu")),
  ]);
  expect(narrator).toHaveBeenCalledTimes(1);
});
it("daily CREATE cap blocks a fresh mock attempt without changing queued data", async () => {
  vi.stubEnv("AI_PAID_MAX_DAILY_CREATES", "1");
  vi.stubEnv("AI_PAID_MAX_RUNNING", "11");
  vi.stubEnv("AI_PAID_DAILY_BUDGET_USD", "1000");
  const before = await job("Tử Nữ");
  const narrator = vi.fn(async (i: any) => mockPaidGeneration(i));
  expect(await runAiMenhJob(narrator, scope("Tử Nữ"))).toBe(false);
  expect(narrator).not.toHaveBeenCalled();
  expect(await job("Tử Nữ")).toEqual(before);
});
it("UTC day rollover resets CREATE count but retains unresolved old reservations across restart", async () => {
  const { paidBudgetSnapshot } = await import("../lib/ai/budget");
  const c = await pool.connect();
  await c.query("BEGIN");
  try {
    await c.query("SET LOCAL TIME ZONE 'Asia/Ho_Chi_Minh'");
    await c.query(
      "UPDATE ai_reading_attempts SET started_at=now()-interval '2 days',status='completed',estimated_cost_usd=1",
    );
    const ids = (
      await c.query(
        "SELECT a.id FROM ai_reading_attempts a JOIN ai_reading_jobs j ON j.id=a.job_id WHERE j.edition=$1 ORDER BY a.id LIMIT 2",
        [PAID_EDITION],
      )
    ).rows.map((r) => r.id);
    expect(ids).toHaveLength(2);
    await c.query(
      "UPDATE ai_reading_attempts SET status='uncertain',estimated_cost_usd=NULL,usage='{\"_background\":{\"reservedUsd\":2}}' WHERE id=$1",
      [ids[0]],
    );
    expect(await paidBudgetSnapshot(c, PAID_EDITION)).toEqual({
      dailyAttempts: 0,
      accountedUsd: 2,
    });
    await c.query(
      "UPDATE ai_reading_attempts SET started_at=now(),estimated_cost_usd=.5 WHERE id=$1",
      [ids[1]],
    );
    expect(await paidBudgetSnapshot(c, PAID_EDITION)).toEqual({
      dailyAttempts: 1,
      accountedUsd: 2.5,
    });
    await c.query("SET LOCAL TIME ZONE 'UTC'");
    expect(await paidBudgetSnapshot(c, PAID_EDITION)).toEqual({
      dailyAttempts: 1,
      accountedUsd: 2.5,
    });
    await c.query(
      "UPDATE ai_reading_attempts SET status='completed',estimated_cost_usd=1 WHERE id=$1",
      [ids[0]],
    );
    expect(await paidBudgetSnapshot(c, PAID_EDITION)).toEqual({
      dailyAttempts: 1,
      accountedUsd: 0.5,
    });
  } finally {
    await c.query("ROLLBACK");
    c.release();
  }
});
