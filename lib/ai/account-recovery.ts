import { z } from "zod";
import type { PoolClient } from "pg";
import { PAID_EDITION, paidEnabled } from "./paid-contract";
import { PAID_GRANT_SQL } from "./paid-store";
import { backgroundLimits } from "./background";
import { paidBudgetSnapshot } from "./budget";

/** Server operator only: authorize the existing owner retry, never dispatch or
 * edit an attempt/result. This plan is not a credential or a provider receipt. */
export const accountRecoveryPlanSchema = z
  .object({
    version: z.literal("paid-account-recovery-1.0.0"),
    database: z.string().min(1).max(100),
    port: z.number().int().min(1).max(65535),
    readingId: z.string().uuid(),
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    accountAndFailureVerified: z.literal(true),
    reason: z.string().min(20).max(240),
    reserveUsd: z.number().positive().max(1000),
    jobs: z
      .array(
        z
          .object({
            jobId: z.string().uuid(),
            attemptId: z.string().uuid(),
            responseId: z
              .string()
              .regex(/^resp_[A-Za-z0-9_-]+$/)
              .nullable(),
            errorCode: z.enum([
              "AI_BILLING_UNAVAILABLE",
              "AI_ACCESS_UNAVAILABLE",
            ]),
          })
          .strict(),
      )
      .min(1)
      .max(11),
  })
  .strict()
  .superRefine((p, ctx) => {
    if (
      new Set(p.jobs.map((j) => j.jobId)).size !== p.jobs.length ||
      new Set(p.jobs.map((j) => j.attemptId)).size !== p.jobs.length
    )
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "duplicate scope" });
    if (
      Date.parse(p.expiresAt) <= Date.parse(p.createdAt) ||
      Date.parse(p.expiresAt) - Date.parse(p.createdAt) > 900000
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "maximum 15 minute plan lifetime",
      });
  });
export async function authorizePaidAccountRetry(
  c: Pick<PoolClient, "query">,
  raw: unknown,
  apply = false,
  now = Date.now(),
) {
  const parsed = accountRecoveryPlanSchema.safeParse(raw);
  if (!parsed.success) throw Error("AI_RECOVERY_PLAN_INVALID");
  const plan = parsed.data;
  if (
    !paidEnabled() ||
    process.env.AI_PAID_OPERATOR_RECOVERY_ENABLED !== "true"
  )
    throw Error("AI_RECOVERY_DISABLED");
  if (now < Date.parse(plan.createdAt) || now >= Date.parse(plan.expiresAt))
    throw Error("AI_RECOVERY_PLAN_EXPIRED");
  const identity = (
    await c.query(
      "SELECT current_database() AS name,inet_server_port() AS port",
    )
  ).rows[0];
  if (identity.name !== plan.database || identity.port !== plan.port)
    throw Error("AI_RECOVERY_DATABASE_MISMATCH");
  if (apply) {
    // Caller owns the transaction. Refuse overlap with the existing consumer.
    const locked = (
      await c.query(
        "SELECT pg_try_advisory_xact_lock(hashtextextended($1,0)) AS ok",
        ["paid-ai-consumer:" + plan.readingId],
      )
    ).rows[0].ok;
    if (!locked) throw Error("AI_RECOVERY_CONSUMER_RUNNING");
    await c.query(
      "SELECT pg_advisory_xact_lock(hashtextextended('paid-ai-dispatch',0))",
    );
  }
  const active = (
    await c.query(
      "SELECT EXISTS(SELECT 1 FROM ai_reading_jobs WHERE edition=$1 AND reading_id=$2 AND status IN ('running','uncertain')) AS active",
      [PAID_EDITION, plan.readingId],
    )
  ).rows[0].active;
  if (active) throw Error("AI_RECOVERY_RECONCILE_FIRST");
  const rows = (
    await c.query(
      `SELECT j.id,j.attempt_id,j.status,j.error_code,j.attempts,j.retryable,j.result,a.status AS attempt_status,a.error_code AS attempt_error,a.response_id FROM ai_reading_jobs j JOIN ai_reading_attempts a ON a.id=j.attempt_id WHERE j.edition=$1 AND j.reading_id=$2 AND j.id=ANY($3::uuid[]) AND ${PAID_GRANT_SQL}${apply ? " FOR UPDATE OF j" : ""}`,
      [PAID_EDITION, plan.readingId, plan.jobs.map((j) => j.jobId)],
    )
  ).rows;
  if (rows.length !== plan.jobs.length)
    throw Error("AI_RECOVERY_SCOPE_OR_GRANT_INVALID");
  const limits = backgroundLimits();
  for (const item of plan.jobs) {
    const r = rows.find((r) => r.id === item.jobId);
    if (
      !r ||
      r.status !== "error" ||
      r.result !== null ||
      r.attempt_status !== "error" ||
      r.error_code !== item.errorCode ||
      r.attempt_error !== item.errorCode ||
      r.attempt_id !== item.attemptId ||
      (r.response_id || null) !== item.responseId ||
      r.attempts >= limits.maxAttempts
    )
      throw Error("AI_RECOVERY_STALE_OR_UNSAFE_ATTEMPT");
  }
  const budget = await paidBudgetSnapshot(c, PAID_EDITION);
  if (
    plan.reserveUsd < plan.jobs.length * limits.reservationUsd ||
    budget.dailyAttempts + plan.jobs.length > limits.maxDailyCreates ||
    budget.accountedUsd + plan.reserveUsd > limits.dailyBudgetUsd
  )
    throw Error("AI_RECOVERY_BUDGET_UNAVAILABLE");
  let changed = 0;
  if (apply) {
    const r = await c.query(
      "UPDATE ai_reading_jobs j SET retryable=true FROM unnest($1::uuid[],$2::uuid[],$3::text[]) AS wanted(id,attempt_id,error_code) WHERE j.id=wanted.id AND j.attempt_id=wanted.attempt_id AND j.error_code=wanted.error_code AND j.status='error' AND j.result IS NULL AND j.retryable=false RETURNING j.id",
      [
        plan.jobs.map((j) => j.jobId),
        plan.jobs.map((j) => j.attemptId),
        plan.jobs.map((j) => j.errorCode),
      ],
    );
    changed = r.rowCount || 0;
    if (changed !== rows.filter((r) => !r.retryable).length)
      throw Error("AI_RECOVERY_CHANGED_DURING_APPLY");
  }
  return {
    mode: apply ? "authorized" : "dry-run",
    readingId: plan.readingId,
    jobs: rows.length,
    changed,
    alreadyAuthorized: rows.filter((r) => r.retryable).length,
    providerCreates: 0,
    attemptsChanged: 0,
    ownerRetryStillRequired: true,
    budgetIsPrecheckNotReservation: true,
  };
}
