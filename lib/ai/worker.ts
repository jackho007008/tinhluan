import { PAID_GRANT_SQL } from "./paid-store";
import {
  paidEnabled,
  PAID_EDITION,
  PAID_PALACES,
  validatePaidNarration,
} from "./paid-contract";
import { aiModels } from "./config";
import { randomUUID } from "node:crypto";
import { pool, transaction } from "../db";
import { aiEnabled } from "./config";
import { type AiResult } from "./contract";
import { validateNarration } from "./validate";
import {
  openaiNarrator,
  GenerationFailure,
  type Narrator,
  type Generation,
} from "./provider";
import type { ClaimedJob } from "./store";
import { validReadingId } from "../internal-review/reading-store";
export async function runAiMenhJob(
  narrator: Narrator = openaiNarrator,
  options: {
    paid?: boolean;
    readingId?: string;
    palace?: string;
    allowCreate?: boolean;
    revalidateOutput?: boolean;
  } = {},
) {
  const paid = options.paid === true;
  if (paid ? !paidEnabled() : !aiEnabled()) return false;
  if (options.palace && (!paid || !PAID_PALACES.includes(options.palace as any)))
    throw Error("AI_INVALID_PALACE_SCOPE");
  if (options.readingId && !validReadingId(options.readingId))
    throw Error("AI_INVALID_READING_SCOPE");
  if (
    options.revalidateOutput &&
    (!options.readingId || options.allowCreate !== false)
  )
    throw Error("AI_REVALIDATE_REQUIRES_READ_ONLY_SCOPE");
  const job = await transaction(async (c) => {
    // A crashed/overlong dispatched attempt is never automatically re-billed.
    const stale = await c.query(
      `UPDATE ai_reading_jobs SET status='uncertain',error_code='AI_INTERRUPTED',retryable=false WHERE status='running' AND ${paid ? "edition='" + PAID_EDITION + "'" : "palace='Mệnh'"} AND locked_at<now()-interval '6 minutes' AND ($1::uuid IS NULL OR reading_id=$1) AND ($2::text IS NULL OR palace=$2) RETURNING attempt_id`,
      [options.readingId || null, options.palace || null],
    );
    const staleIds = stale.rows.map((r) => r.attempt_id).filter(Boolean);
    if (staleIds.length)
      await c.query(
        "UPDATE ai_reading_attempts SET status='uncertain',error_code='AI_INTERRUPTED',finished_at=now() WHERE id=ANY($1::uuid[]) AND status='running'",
        [staleIds],
      );
    const row = (
      await c.query(
        `SELECT j.*,a.response_id,a.started_at AS attempt_started_at,a.duration_ms AS previous_duration_ms,a.estimated_cost_usd AS previous_estimated_cost_usd FROM ai_reading_jobs j LEFT JOIN ai_reading_attempts a ON a.id=j.attempt_id WHERE ${paid ? "j.edition='" + PAID_EDITION + "' AND " + PAID_GRANT_SQL : "j.palace='Mệnh'"} AND j.run_after<=now() AND ($1::uuid IS NULL OR j.reading_id=$1) AND ($4::text IS NULL OR j.palace=$4) AND ((j.status='queued' AND $2::boolean) OR ((j.status='uncertain' OR ($3::boolean AND j.status='error' AND j.error_code='AI_INVALID_OUTPUT')) AND a.response_id IS NOT NULL AND a.provider='openai')) ORDER BY j.created_at FOR UPDATE OF j SKIP LOCKED LIMIT 1`,
        [
          options.readingId || null,
          options.allowCreate !== false,
          options.revalidateOutput === true,
          options.palace || null,
        ],
      )
    ).rows[0];
    if (!row) return;
    if (row.status !== "queued") {
      // Same attempt, same provider response: only GET reconciliation. Never
      // enqueue or increment attempts for a response that may already be billed.
      await c.query(
        "UPDATE ai_reading_jobs SET status='running',locked_at=now(),retryable=false WHERE id=$1",
        [row.id],
      );
      await c.query(
        "UPDATE ai_reading_attempts SET status='running',finished_at=NULL WHERE id=$1",
        [row.attempt_id],
      );
      return {
        ...row,
        revalidating_output: row.status === "error",
      } as ClaimedJob;
    }
    const attempt = randomUUID();
    await c.query(
      "UPDATE ai_reading_jobs SET status='running',attempt_id=$2,locked_at=now(),attempts=attempts+1,retryable=false WHERE id=$1",
      [row.id, attempt],
    );
    await c.query(
      "INSERT INTO ai_reading_attempts(id,job_id,status,model) VALUES($1,$2,'running',$3)",
      [attempt, row.id, row.requested_model],
    );
    return {
      ...row,
      attempt_id: attempt,
      attempts: row.attempts + 1,
      response_id: undefined,
      attempt_started_at: new Date(),
    } as ClaimedJob;
  });
  if (!job) return false;
  let generated: Generation | undefined;
  try {
    if (
      paid &&
      (job.input.paidTarget?.palace !== job.palace ||
        job.input.paidTarget?.edition !== PAID_EDITION)
    )
      throw new GenerationFailure("AI_PAID_TARGET_INVALID", false);
    if (
      paid &&
      !job.response_id &&
      job.requested_model !== aiModels().paidReading
    )
      throw new GenerationFailure("AI_MODEL_CONFIGURATION_CHANGED", false);
    generated = await narrator(job.input, job.attempt_id, {
      responseId: job.response_id,
      promptVersion: job.prompt_version,
      onResponseCreated: async (id, model) => {
        const saved = await pool.query(
          "UPDATE ai_reading_attempts SET response_id=$2,provider='openai',model=$3 WHERE id=$1 AND status='running' AND (response_id IS NULL OR response_id=$2) RETURNING id",
          [job.attempt_id, id, model],
        );
        if (saved.rowCount !== 1) throw Error("AI_RESPONSE_ID_NOT_SAVED");
      },
    });
    if (job.revalidating_output && job.previous_duration_ms != null) {
      generated.durationMs = job.previous_duration_ms;
      if (job.previous_estimated_cost_usd != null)
        generated.estimatedCostUsd = Number(job.previous_estimated_cost_usd);
    } else if (job.attempt_started_at)
      generated.durationMs = Math.max(
        generated.durationMs,
        Date.now() - new Date(job.attempt_started_at).getTime(),
      );
    const content = paid
      ? validatePaidNarration(generated.raw, job.input)
      : validateNarration(generated.raw, job.input);
    const result: AiResult = {
      content,
      facts: job.input.facts,
      knowledge: job.input.knowledge,
      promptVersion: job.prompt_version,
      edition: job.edition,
      model: generated.model,
      provider: generated.provider,
      durationMs: generated.durationMs,
      usage: generated.usage,
      estimatedCostUsd: generated.estimatedCostUsd,
    };
    await transaction(async (c) => {
      await c.query(
        "UPDATE ai_reading_jobs SET status='completed',result=$3,completed_at=now(),error_code=NULL,retryable=false WHERE id=$1 AND attempt_id=$2 AND status IN ('running','uncertain') AND result IS NULL",
        [job.id, job.attempt_id, result],
      );
      await c.query(
        "UPDATE ai_reading_attempts SET status='completed',error_code=NULL,model=$2,provider=$3,response_id=$4,usage=$5,duration_ms=$6,estimated_cost_usd=$7,finished_at=now() WHERE id=$1",
        [
          job.attempt_id,
          generated!.model,
          generated!.provider,
          generated!.responseId,
          generated!.usage,
          generated!.durationMs,
          generated!.estimatedCostUsd,
        ],
      );
    });
  } catch (error) {
    const known = error instanceof GenerationFailure ? error : undefined;
    const validation =
      error instanceof Error &&
      /^AI_(INVALID_SCHEMA|SECTION_ORDER|UNKNOWN_REFERENCE|SCOPE_VIOLATION)$/.test(
        error.message,
      );
    // An infrastructure failure after a successful API call is ambiguous, too.
    const code =
        known?.code ||
        (validation ? "AI_INVALID_OUTPUT" : "AI_OUTCOME_UNCERTAIN"),
      uncertain = known?.uncertain || (!known && !validation),
      retryable = known?.retryable ?? validation;
    await transaction(async (c) => {
      await c.query(
        "UPDATE ai_reading_jobs SET status=$3,error_code=$4,retryable=$5,run_after=now()+interval '30 seconds' WHERE id=$1 AND attempt_id=$2 AND status='running' AND result IS NULL",
        [
          job.id,
          job.attempt_id,
          uncertain ? "uncertain" : "error",
          code,
          retryable,
        ],
      );
      await c.query(
        "UPDATE ai_reading_attempts SET status=$2,error_code=$3,model=COALESCE($4,model),provider=COALESCE($5,provider),response_id=COALESCE($6,response_id),usage=COALESCE($7,usage),duration_ms=COALESCE($8,duration_ms),estimated_cost_usd=COALESCE($9,estimated_cost_usd),finished_at=now() WHERE id=$1 AND status<>'completed'",
        [
          job.attempt_id,
          uncertain ? "uncertain" : "error",
          code,
          generated?.model || null,
          generated?.provider || null,
          generated?.responseId || null,
          generated?.usage || null,
          generated?.durationMs || null,
          generated?.estimatedCostUsd ?? null,
        ],
      );
    });
  }
  return true;
}
