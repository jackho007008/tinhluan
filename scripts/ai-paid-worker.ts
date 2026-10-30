import { pool } from "../lib/db";
import {
  paidEnabled,
  PAID_PALACES,
  PAID_EDITION,
} from "../lib/ai/paid-contract";
import { reconcilePaidOrders } from "../lib/ai/paid-store";
import { runAiMenhJob } from "../lib/ai/worker";
import { validReadingId } from "../lib/internal-review/reading-store";
if (!paidEnabled()) throw Error("AI_PAID_DISABLED");
const id = process.env.AI_PAID_READING_ID,
  palace = process.env.AI_PAID_PALACE;
const limit = Number(process.env.AI_PAID_MAX_NEW_JOBS),
  ticks = Number(process.env.AI_PAID_MAX_TICKS ?? 100),
  runtime = Number(process.env.AI_PAID_RUN_MS ?? 1800000);
if (palace && !PAID_PALACES.includes(palace as any))
  throw Error("AI_INVALID_PALACE_SCOPE");
if (
  !id ||
  !validReadingId(id) ||
  !Number.isInteger(limit) ||
  limit < 0 ||
  limit > 11 ||
  !Number.isInteger(ticks) ||
  ticks < 1 ||
  ticks > 1000 ||
  !Number.isFinite(runtime) ||
  runtime < 1000 ||
  runtime > 3600000
)
  throw Error("AI_PAID_EXPLICIT_SCOPE_AND_LIMIT_REQUIRED");
// The same consumer can be scheduled again: run_after and attempt state survive exit.
const count = async () =>
  +(
    await pool.query(
      "SELECT count(*) FROM ai_reading_attempts a JOIN ai_reading_jobs j ON j.id=a.job_id WHERE j.edition=$1 AND j.reading_id=$2 AND ($3::text IS NULL OR j.palace=$3)",
      [PAID_EDITION, id, palace || null],
    )
  ).rows[0].count;
const lease = await pool.connect();
try {
  const locked = (
    await lease.query(
      "SELECT pg_try_advisory_lock(hashtextextended($1,0)) AS ok",
      ["paid-ai-consumer:" + id],
    )
  ).rows[0].ok;
  if (!locked) throw Error("AI_PAID_CONSUMER_ALREADY_RUNNING");
  if (limit > 0) await reconcilePaidOrders(id);
  const initial = await count(),
    deadline = Date.now() + runtime;
  for (let tick = 0; tick < ticks && Date.now() < deadline; tick++) {
    const allowCreate = (await count()) - initial < limit;
    const worked = await runAiMenhJob(undefined, {
      paid: true,
      readingId: id,
      palace,
      allowCreate,
    });
    if (worked) continue;
    const next = (
      await pool.query(
        `SELECT min(j.run_after) AS due FROM ai_reading_jobs j JOIN ai_reading_attempts a ON a.id=j.attempt_id WHERE j.edition=$1 AND j.reading_id=$2 AND ($3::text IS NULL OR j.palace=$3) AND j.status='uncertain' AND a.response_id IS NOT NULL AND COALESCE(j.error_code,'') NOT IN ('AI_RECONCILIATION_EXHAUSTED','AI_RESPONSE_UNAVAILABLE')`,
        [PAID_EDITION, id, palace || null],
      )
    ).rows[0].due;
    if (!next) break;
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        Math.min(
          30000,
          Math.max(1000, new Date(next).getTime() - Date.now()),
          Math.max(0, deadline - Date.now()),
        ),
      ),
    );
  }
} finally {
  await lease.query("SELECT pg_advisory_unlock(hashtextextended($1,0))", [
    "paid-ai-consumer:" + id,
  ]);
  lease.release();
  await pool.end();
}
