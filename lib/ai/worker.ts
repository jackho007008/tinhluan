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
export async function runAiMenhJob(narrator: Narrator = openaiNarrator) {
  if (!aiEnabled()) return false;
  const job = await transaction(async (c) => {
    // A crashed/overlong dispatched attempt is never automatically re-billed.
    const stale = await c.query(
      "UPDATE ai_reading_jobs SET status='uncertain',error_code='AI_INTERRUPTED',retryable=false WHERE status='running' AND palace='Mệnh' AND locked_at<now()-interval '6 minutes' RETURNING attempt_id",
    );
    const staleIds = stale.rows.map((r) => r.attempt_id).filter(Boolean);
    if (staleIds.length)
      await c.query(
        "UPDATE ai_reading_attempts SET status='uncertain',error_code='AI_INTERRUPTED',finished_at=now() WHERE id=ANY($1::uuid[]) AND status='running'",
        [staleIds],
      );
    const row = (
      await c.query(
        "SELECT * FROM ai_reading_jobs WHERE palace='Mệnh' AND status='queued' AND run_after<=now() ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1",
      )
    ).rows[0];
    if (!row) return;
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
    } as ClaimedJob;
  });
  if (!job) return false;
  let generated: Generation | undefined;
  try {
    generated = await narrator(job.input, job.attempt_id);
    const content = validateNarration(generated.raw, job.input);
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
        "UPDATE ai_reading_attempts SET status='completed',model=$2,provider=$3,response_id=$4,usage=$5,duration_ms=$6,estimated_cost_usd=$7,finished_at=now() WHERE id=$1",
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
        "UPDATE ai_reading_attempts SET status=$2,error_code=$3,model=COALESCE($4,model),provider=$5,response_id=$6,usage=$7,duration_ms=$8,estimated_cost_usd=$9,finished_at=now() WHERE id=$1 AND status<>'completed'",
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
