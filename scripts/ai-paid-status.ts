import fs from "node:fs/promises";
import { paidBudgetSnapshot } from "../lib/ai/budget";
import { operatorDisposition } from "../lib/ai/operator";
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
      `SELECT j.palace,j.status,j.error_code,j.retryable,j.attempts,j.run_after,j.completed_at,
  a.usage,a.estimated_cost_usd,a.response_id IS NOT NULL AS has_response_id,a.provider AS attempt_provider,
  j.result->'cost' AS cost,j.result->'timing' AS timing
  FROM ai_reading_jobs j LEFT JOIN ai_reading_attempts a ON a.id=j.attempt_id
  WHERE j.reading_id=$1 AND j.edition=$2 ORDER BY j.palace`,
      [id, PAID_EDITION],
    )
  ).rows;
  const budget = await paidBudgetSnapshot(pool, PAID_EDITION);
  const counts = Object.fromEntries(
    ["queued", "running", "completed", "uncertain", "error"].map((s) => [
      s,
      rows.filter((r) => r.status === s).length,
    ]),
  );
  const jobs = rows.map((r) => ({
    palace: r.palace,
    operator: operatorDisposition(r),
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
  let supervisor: unknown = null;
  if (process.env.AI_PAID_SCOPE_FILE) {
    try {
      const scope = JSON.parse(
        await fs.readFile(process.env.AI_PAID_SCOPE_FILE, "utf8"),
      );
      let state: any = {};
      try {
        state = JSON.parse(
          await fs.readFile(
            process.env.AI_PAID_SCOPE_FILE + ".state.json",
            "utf8",
          ),
        );
      } catch {}
      supervisor = {
        scopeId: scope.id,
        readingAllowed:
          Array.isArray(scope.readingIds) && scope.readingIds.includes(id),
        maxRuns: scope.maxRuns,
        runs: state.runs || 0,
        expiresAt: scope.expiresAt,
        lastState: state.state || "not-run",
        startedAt: state.startedAt,
        finishedAt: state.finishedAt,
        scopeExpired: Date.now() >= Date.parse(scope.expiresAt),
        runBudgetExhausted: (state.runs || 0) >= scope.maxRuns,
      };
    } catch {
      supervisor = { state: "configuration-unavailable", needsOperator: true };
    }
  }
  console.log(
    JSON.stringify(
      {
        observedAt: new Date().toISOString(),
        readingId: id,
        counts,
        supervisor,
        limits: backgroundLimits(),
        budget: {
          dailyAttempts: budget.dailyAttempts,
          accountedUsd: budget.accountedUsd,
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
