import { afterEach, expect, it, vi } from "vitest";
import {
  authorizePaidAccountRetry,
  accountRecoveryPlanSchema,
} from "../lib/ai/account-recovery";
const id = "00000000-0000-4000-8000-000000000001",
  attempt = "00000000-0000-4000-8000-000000000002",
  reading = "00000000-0000-4000-8000-000000000003";
const now = Date.parse("2026-11-03T06:00:00Z");
const plan = () => ({
  version: "paid-account-recovery-1.0.0",
  database: "qa_recovery",
  port: 55459,
  readingId: reading,
  createdAt: new Date(now - 1000).toISOString(),
  expiresAt: new Date(now + 60000).toISOString(),
  accountAndFailureVerified: true,
  reason: "QA operator verified terminal billing failure and restored credit.",
  reserveUsd: 2,
  jobs: [
    {
      jobId: id,
      attemptId: attempt,
      responseId: "resp_existing_failed",
      errorCode: "AI_BILLING_UNAVAILABLE",
    },
  ],
});
function setup(overrides: any = {}) {
  vi.stubEnv("AI_PAID_ENABLED", "true");
  vi.stubEnv("SEPAY_LIVE_ENABLED", "false");
  vi.stubEnv("CHECKOUT_TEST_ENABLED", "true");
  vi.stubEnv("AI_PAID_OPERATOR_RECOVERY_ENABLED", "true");
  vi.stubEnv("AI_PAID_REQUEST_RESERVATION_USD", "2");
  vi.stubEnv("AI_PAID_DAILY_BUDGET_USD", "10");
  vi.stubEnv("AI_PAID_MAX_DAILY_CREATES", "20");
  vi.stubEnv("AI_PAID_MAX_ATTEMPTS", "3");
  const row = {
    id,
    attempt_id: attempt,
    status: "error",
    error_code: "AI_BILLING_UNAVAILABLE",
    attempt_error: "AI_BILLING_UNAVAILABLE",
    attempt_status: "error",
    response_id: "resp_existing_failed",
    result: null,
    retryable: false,
    attempts: 1,
    ...overrides,
  };
  const query = vi.fn(async (sql: string) => {
    if (sql.includes("current_database"))
      return { rows: [{ name: "qa_recovery", port: 55459 }] };
    if (sql.includes("pg_try_advisory")) return { rows: [{ ok: true }] };
    if (sql.includes("pg_advisory")) return { rows: [] };
    if (sql.includes("SELECT EXISTS")) return { rows: [{ active: false }] };
    if (sql.includes("SELECT j.id")) return { rows: [row] };
    if (sql.includes("AS reserved"))
      return { rows: [{ count: "1", reserved: "2" }] };
    if (sql.startsWith("UPDATE")) return { rows: [{ id }], rowCount: 1 };
    throw Error("UNEXPECTED_QUERY");
  });
  return { row, query };
}
afterEach(() => vi.unstubAllEnvs());
it("dry run never writes; apply authorizes only the exact failed job without CREATE, queue or attempt changes", async () => {
  const c = setup();
  const dry = await authorizePaidAccountRetry(c as any, plan(), false, now);
  expect(dry.mode).toBe("dry-run");
  expect(c.query.mock.calls.some(([sql]) => sql.startsWith("UPDATE"))).toBe(
    false,
  );
  const apply = await authorizePaidAccountRetry(c as any, plan(), true, now);
  expect(apply).toMatchObject({
    changed: 1,
    providerCreates: 0,
    attemptsChanged: 0,
    ownerRetryStillRequired: true,
  });
  const writes = c.query.mock.calls.filter(([sql]) => sql.startsWith("UPDATE"));
  expect(writes).toHaveLength(1);
  expect(writes[0][0]).toContain("SET retryable=true");
  expect(writes[0][0]).not.toContain("attempts=");
  expect(writes[0][0]).not.toContain("status='queued'");
  expect(
    c.query.mock.calls.find(([sql]) => sql.includes("SELECT j.id"))?.[0],
  ).toContain("payment_status='paid'");
});
it.each([
  { status: "uncertain" },
  { status: "running" },
  { status: "completed", result: {} },
  { attempt_status: "uncertain" },
  { error_code: "AI_INVALID_OUTPUT" },
  { attempt_error: "AI_RESPONSE_UNAVAILABLE" },
  { attempt_id: reading },
  { response_id: "resp_different" },
  { attempts: 3 },
])("rejects unsafe or stale selection %j", async (override) => {
  const c = setup(override);
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now),
  ).rejects.toThrow("AI_RECOVERY_STALE_OR_UNSAFE_ATTEMPT");
  expect(c.query.mock.calls.some(([sql]) => sql.startsWith("UPDATE"))).toBe(
    false,
  );
});
it("requires exact DB identity, finite fresh plan, explicit gate and valid grant", async () => {
  const c = setup();
  await expect(
    authorizePaidAccountRetry(
      c as any,
      { ...plan(), database: "wrong" },
      true,
      now,
    ),
  ).rejects.toThrow("AI_RECOVERY_DATABASE_MISMATCH");
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now + 120000),
  ).rejects.toThrow("AI_RECOVERY_PLAN_EXPIRED");
  vi.stubEnv("AI_PAID_OPERATOR_RECOVERY_ENABLED", "false");
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now),
  ).rejects.toThrow("AI_RECOVERY_DISABLED");
});
it("keeps the budget and attempt limits even when an operator requests recovery", async () => {
  const c = setup();
  vi.stubEnv("AI_PAID_DAILY_BUDGET_USD", "2");
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now),
  ).rejects.toThrow("AI_RECOVERY_BUDGET_UNAVAILABLE");
});
it("rejects duplicate scopes and long-lived/extra-secret plans", () => {
  for (const p of [
    { ...plan(), jobs: [...plan().jobs, ...plan().jobs] },
    { ...plan(), expiresAt: new Date(now + 3600000).toISOString() },
    { ...plan(), OPENAI_API_KEY: "mock-value" },
  ])
    expect(accountRecoveryPlanSchema.safeParse(p).success).toBe(false);
});
it("refuses to authorize while reconciliation is unresolved or the consumer owns the scope", async () => {
  const c = setup(),
    base = c.query.getMockImplementation()!;
  c.query.mockImplementation(async (sql: string) =>
    sql.includes("SELECT EXISTS")
      ? ({ rows: [{ active: true }] } as any)
      : base(sql),
  );
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now),
  ).rejects.toThrow("AI_RECOVERY_RECONCILE_FIRST");
  c.query.mockImplementation(async (sql: string) =>
    sql.includes("pg_try_advisory")
      ? ({ rows: [{ ok: false }] } as any)
      : base(sql),
  );
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now),
  ).rejects.toThrow("AI_RECOVERY_CONSUMER_RUNNING");
});
it("does not authorize a missing/revoked grant or a stale compare-and-set update", async () => {
  const c = setup(),
    base = c.query.getMockImplementation()!;
  c.query.mockImplementation(async (sql: string) =>
    sql.includes("SELECT j.id") ? ({ rows: [] } as any) : base(sql),
  );
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now),
  ).rejects.toThrow("AI_RECOVERY_SCOPE_OR_GRANT_INVALID");
  c.query.mockImplementation(async (sql: string) =>
    sql.startsWith("UPDATE") ? ({ rows: [], rowCount: 0 } as any) : base(sql),
  );
  await expect(
    authorizePaidAccountRetry(c as any, plan(), true, now),
  ).rejects.toThrow("AI_RECOVERY_CHANGED_DURING_APPLY");
});
