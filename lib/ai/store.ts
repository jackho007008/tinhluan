import { randomUUID } from "node:crypto";
import { pool, transaction } from "../db";
import { readingHash } from "../order-readings";
import type { InternalReading } from "../internal-review/reading-store";
import { aiEnabled, aiConfig } from "./config";
import {
  AI_EDITION,
  PROMPT_VERSION,
  type AiView,
  type MenhInput,
  type AiResult,
} from "./contract";
import { menhFacts } from "./facts";
import { retrieveMenhKnowledge } from "./knowledge";
export const aiEligible = (r: InternalReading) =>
  r.aiPolicy?.edition === AI_EDITION && r.aiPolicy.palace === "Mệnh";
export const captureAiPolicy = () =>
  aiEnabled() ? { edition: AI_EDITION, palace: "Mệnh" as const } : undefined;
export async function findAiJob(record: InternalReading) {
  return (
    await pool.query(
      "SELECT * FROM ai_reading_jobs WHERE reading_id=$1 AND reading_hash=$2 AND palace=$3 AND edition=$4",
      [
        record.id,
        readingHash(record),
        "Mệnh",
        record.aiPolicy?.edition || AI_EDITION,
      ],
    )
  ).rows[0];
}
/** The unique DB key is the cross-process deduplication boundary. No snapshot,
 * frozen report, policy, entitlement, or paid job is ever updated here. */
export async function requestMenh(record: InternalReading, retry = false) {
  if (!aiEnabled() || !aiEligible(record)) throw Error("AI_NOT_ELIGIBLE");
  const old = await findAiJob(record);
  if (old) {
    if (retry) await retryMenh(record);
    return;
  }
  const input = await retrieveMenhKnowledge(record, menhFacts(record));
  await transaction(async (c) => {
    await c.query(
      "SELECT pg_advisory_xact_lock(hashtextextended('menh-ai-daily-quota',0))",
    );
    const duplicate = (
      await c.query(
        "SELECT id FROM ai_reading_jobs WHERE reading_id=$1 AND reading_hash=$2 AND palace=$3 AND edition=$4",
        [record.id, readingHash(record), "Mệnh", AI_EDITION],
      )
    ).rows[0];
    if (duplicate) return;
    const count = +(
      await c.query(
        "SELECT count(*) FROM ai_reading_jobs WHERE created_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'",
      )
    ).rows[0].count;
    if (count >= aiConfig().maxDailyJobs) throw Error("AI_DAILY_LIMIT");
    await c.query(
      "INSERT INTO ai_reading_jobs(id,reading_id,reading_hash,palace,edition,prompt_version,input,input_hash,status,requested_model) VALUES($1,$2,$3,'Mệnh',$4,$5,$6,$7,'queued',$8) ON CONFLICT DO NOTHING",
      [
        randomUUID(),
        record.id,
        readingHash(record),
        AI_EDITION,
        PROMPT_VERSION,
        input,
        readingHash(input),
        aiConfig().model || null,
      ],
    );
  });
}
export async function retryMenh(record: InternalReading) {
  if (!aiEnabled() || !aiEligible(record)) throw Error("AI_NOT_ELIGIBLE");
  await pool.query(
    "UPDATE ai_reading_jobs SET status='queued',error_code=NULL,retryable=false,requested_model=$5 WHERE reading_id=$1 AND reading_hash=$2 AND palace=$3 AND edition=$4 AND status='error' AND retryable AND attempts<3 AND run_after<=now() AND result IS NULL",
    [
      record.id,
      readingHash(record),
      "Mệnh",
      record.aiPolicy!.edition,
      aiConfig().model || null,
    ],
  );
}
export async function readMenh(record: InternalReading): Promise<AiView> {
  const enabled = aiEnabled(),
    eligible = aiEligible(record);
  const hasEdition =
    record.aiPolicy?.palace === "Mệnh" &&
    typeof record.aiPolicy.edition === "string";
  const row = hasEdition ? await findAiJob(record) : undefined;
  // Disable new work without hiding an already completed, owner-authorized edition.
  if (row?.status === "completed")
    return {
      enabled,
      eligible,
      state: "completed",
      queued: false,
      canRetry: false,
      result: row.result as AiResult,
    };
  if (!enabled || !eligible)
    return {
      enabled,
      eligible,
      state: "not-created",
      queued: false,
      canRetry: false,
    };
  if (!row)
    return {
      enabled,
      eligible,
      state: "not-created",
      queued: false,
      canRetry: true,
    };
  return {
    enabled,
    eligible,
    state:
      row.status === "completed"
        ? "completed"
        : row.status === "running"
          ? "generating"
          : row.status === "queued"
            ? "not-created"
            : "error",
    queued: row.status === "queued",
    canRetry:
      row.status === "error" &&
      row.retryable &&
      row.attempts < 3 &&
      new Date(row.run_after).getTime() <= Date.now() &&
      aiConfig().configured,
    errorCode: row.error_code || undefined,
    ...(row.status === "completed" ? { result: row.result as AiResult } : {}),
  };
}
export type ClaimedJob = {
  id: string;
  attempt_id: string;
  input: MenhInput;
  prompt_version: string;
  edition: string;
  attempts: number;
  response_id?: string;
  attempt_started_at?: Date;
  revalidating_output?: boolean;
  previous_duration_ms?: number;
  previous_estimated_cost_usd?: string;
};
