/** Operator CLI only. Deliberately selects no prompt, content, owner or credential. */
import { pool } from "../lib/db";
import { PAID_EDITION } from "../lib/ai/paid-contract";
import { backgroundLimits } from "../lib/ai/background";
import { validReadingId } from "../lib/internal-review/reading-store";
const id = process.env.AI_PAID_READING_ID;
if (!id || !validReadingId(id)) throw Error("AI_PAID_READING_SCOPE_REQUIRED");
try {
  const rows = (
    await pool.query(
      `SELECT j.palace,j.status,j.error_code,j.attempts,j.run_after,j.completed_at,
  a.usage,a.estimated_cost_usd,a.response_id IS NOT NULL AS has_response_id,a.provider AS attempt_provider,
  j.result->'cost' AS cost,j.result->'timing' AS timing
  FROM ai_reading_jobs j LEFT JOIN ai_reading_attempts a ON a.id=j.attempt_id
  WHERE j.reading_id=$1 AND j.edition=$2 ORDER BY j.palace`,
      [id, PAID_EDITION],
    )
  ).rows;
  const budget = (
    await pool.query(
      `SELECT count(*) FILTER(WHERE a.started_at>=date_trunc('day',now())) AS daily_attempts,
  COALESCE(sum(COALESCE(a.estimated_cost_usd,(a.usage->'_background'->>'reservedUsd')::numeric,$2)),0) AS accounted_usd
  FROM ai_reading_attempts a JOIN ai_reading_jobs j ON j.id=a.job_id WHERE j.edition=$1
  AND (a.started_at>=date_trunc('day',now()) OR a.status IN ('running','uncertain'))`,
      [PAID_EDITION, backgroundLimits().reservationUsd],
    )
  ).rows[0];
  const counts = Object.fromEntries(
    ["queued", "running", "completed", "uncertain", "error"].map((s) => [
      s,
      rows.filter((r) => r.status === s).length,
    ]),
  );
  const jobs = rows.map((r) => ({
    palace: r.palace,
    status: r.status,
    attempts: r.attempts,
    reconciliations: r.usage?._background?.checks || 0,
    hasResponseId: r.has_response_id,
    nextCheckAt:
      r.status === "uncertain" &&
      r.has_response_id &&
      r.attempt_provider === "openai" &&
      !["AI_RESPONSE_UNAVAILABLE", "AI_RECONCILIATION_EXHAUSTED"].includes(
        r.error_code,
      )
        ? r.run_after
        : null,
    errorCode: r.error_code,
    needsOperator:
      r.status === "error" ||
      (r.status === "uncertain" &&
        (!r.has_response_id ||
          r.attempt_provider !== "openai" ||
          ["AI_RESPONSE_UNAVAILABLE", "AI_RECONCILIATION_EXHAUSTED"].includes(
            r.error_code,
          ))),
    usage: r.usage || null,
    estimatedCostUsd:
      r.estimated_cost_usd == null ? null : Number(r.estimated_cost_usd),
    cost: r.cost || null,
    timing: r.timing || null,
  }));
  console.log(
    JSON.stringify(
      {
        observedAt: new Date().toISOString(),
        readingId: id,
        counts,
        limits: backgroundLimits(),
        budget: {
          dailyAttempts: +budget.daily_attempts,
          accountedUsd: +budget.accounted_usd,
          kind: "estimate-and-reservations-not-invoice",
        },
        jobs,
      },
      null,
      2,
    ),
  );
} finally {
  await pool.end();
}
