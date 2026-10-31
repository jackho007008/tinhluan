import type { PoolClient } from "pg";
import { backgroundLimits } from "./background";
/** Dispatch-day accounting is UTC. Unresolved previous-day reservations carry over. */
export const AI_DAY_START_SQL =
  "(date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')";
export async function paidBudgetSnapshot(
  c: Pick<PoolClient, "query">,
  edition: string,
) {
  const r = (
    await c.query(
      `SELECT count(*) FILTER(WHERE a.started_at>=${AI_DAY_START_SQL}) AS count,
 COALESCE(sum(COALESCE(a.estimated_cost_usd,(a.usage->'_background'->>'reservedUsd')::numeric,$2)),0) AS reserved
 FROM ai_reading_attempts a JOIN ai_reading_jobs j ON j.id=a.job_id
 WHERE j.edition=$1 AND (a.started_at>=${AI_DAY_START_SQL} OR a.status IN ('running','uncertain'))`,
      [edition, backgroundLimits().reservationUsd],
    )
  ).rows[0];
  return { dailyAttempts: +r.count, accountedUsd: +r.reserved };
}
