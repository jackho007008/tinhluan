import { randomUUID } from "node:crypto";
import { pool, transaction } from "../db";
import type { InternalReading } from "../internal-review/reading-store";
import { readingHash } from "../order-readings";
import {
  PAID_EDITION,
  PAID_PROMPT,
  PAID_PALACES,
  paidEnabled,
} from "./paid-contract";
import { paidInput } from "./paid-input";
import { aiModels } from "./config";
import type { AiResult } from "./contract";
/** Same paid/grant predicate is checked before claiming work. No client state is authority. */
export const PAID_GRANT_SQL = `EXISTS(SELECT 1 FROM order_reading_bindings b JOIN orders o ON o.id=b.order_id JOIN customer_checkouts cc ON cc.order_id=o.id JOIN access_tokens a ON a.order_id=o.id AND a.purpose='customer-order' AND a.revoked_at IS NULL AND a.expires_at>now() WHERE b.reading_id=j.reading_id AND b.content_hash=j.reading_hash AND cc.offer->>'aiEdition'='${PAID_EDITION}' AND o.payment_status='paid' AND o.report_status='ready')`;
async function grant(orderId: string, record: InternalReading) {
  const r = (
    await pool.query(
      `SELECT o.paid_at FROM orders o JOIN order_reading_bindings b ON b.order_id=o.id JOIN customer_checkouts cc ON cc.order_id=o.id WHERE o.id=$1 AND b.reading_id=$2 AND b.content_hash=$3 AND cc.offer->>'aiEdition'=$4 AND o.payment_status='paid' AND o.report_status='ready' AND EXISTS(SELECT 1 FROM access_tokens a WHERE a.order_id=o.id AND a.purpose='customer-order' AND a.revoked_at IS NULL AND a.expires_at>now())`,
      [orderId, record.id, readingHash(record), PAID_EDITION],
    )
  ).rows[0];
  return r;
}
/** Durable grant/order rows are the outbox. Only the AI consumer reconciles it;
 * GET/refresh never enqueue. New offer marker excludes historical purchases. */
export async function reconcilePaidOrders(readingId?: string) {
  if (!paidEnabled()) return 0;
  const rows = (
    await pool.query(
      `SELECT DISTINCT s.raw_reading,b.content_hash FROM order_reading_bindings b JOIN ai_paid_sources s ON s.order_id=b.order_id AND s.reading_hash=b.content_hash JOIN orders o ON o.id=b.order_id JOIN customer_checkouts cc ON cc.order_id=o.id WHERE cc.offer->>'aiEdition'=$1 AND o.payment_status='paid' AND o.report_status='ready' AND (SELECT count(*) FROM ai_reading_jobs j WHERE j.reading_id=b.reading_id AND j.reading_hash=b.content_hash AND j.edition=$1)<11 AND ($2::uuid IS NULL OR b.reading_id=$2) AND EXISTS(SELECT 1 FROM access_tokens a WHERE a.order_id=o.id AND a.purpose='customer-order' AND a.revoked_at IS NULL AND a.expires_at>now()) LIMIT 20`,
      [PAID_EDITION, readingId || null],
    )
  ).rows;
  let inserted = 0;
  for (const row of rows) {
    const record = JSON.parse(row.raw_reading) as InternalReading;
    if (readingHash(record) !== row.content_hash)
      throw Error("AI_PAID_SNAPSHOT_MISMATCH");
    const model = aiModels().paidReading;
    if (!model) throw Error("AI_PAID_MODEL_REQUIRED");
    await transaction(async (c) => {
      await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
        "paid-ai:" + record.id + ":" + row.content_hash,
      ]);
      for (const palace of PAID_PALACES) {
        const exists = (
          await c.query(
            "SELECT id FROM ai_reading_jobs WHERE reading_id=$1 AND reading_hash=$2 AND palace=$3 AND edition=$4",
            [record.id, row.content_hash, palace, PAID_EDITION],
          )
        ).rowCount;
        if (exists) continue;
        const input = paidInput(record, palace);
        const r = await c.query(
          `INSERT INTO ai_reading_jobs(id,reading_id,reading_hash,palace,edition,prompt_version,input,input_hash,status,requested_model) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'queued',$9) ON CONFLICT DO NOTHING RETURNING id`,
          [
            randomUUID(),
            record.id,
            row.content_hash,
            palace,
            PAID_EDITION,
            PAID_PROMPT,
            input,
            readingHash(input),
            model,
          ],
        );
        inserted += r.rowCount || 0;
      }
    });
  }
  return inserted;
}
export type PaidView = {
  eligible: boolean;
  simulation?: boolean;
  completed: number;
  total: 11;
  state: "not-entitled" | "processing" | "completed" | "attention";
  startedAt?: string;
  overEstimate: boolean;
  palaces: {
    palace: string;
    state: string;
    canRetry: boolean;
    result?: AiResult;
  }[];
};
export async function readPaid(
  record: InternalReading,
  authorizedOrderId?: string,
): Promise<PaidView> {
  const empty: PaidView = {
    eligible: false,
    completed: 0,
    total: 11,
    state: "not-entitled",
    overEstimate: false,
    palaces: [],
  };
  if (!paidEnabled() || !authorizedOrderId) return empty;
  const g = await grant(authorizedOrderId, record);
  if (!g) return empty;
  const rows = (
    await pool.query(
      "SELECT palace,status,retryable,attempts,run_after,result FROM ai_reading_jobs WHERE reading_id=$1 AND reading_hash=$2 AND edition=$3",
      [record.id, readingHash(record), PAID_EDITION],
    )
  ).rows;
  const palaces = PAID_PALACES.map((palace) => {
    const r = rows.find((r) => r.palace === palace);
    return {
      palace,
      state: r?.status || "awaiting-queue",
      canRetry:
        !!r &&
        r.status === "error" &&
        r.retryable &&
        r.attempts < 3 &&
        new Date(r.run_after).getTime() <= Date.now(),
      ...(r?.status === "completed" && r.result
        ? { result: r.result as AiResult }
        : {}),
    };
  });
  const completed = palaces.filter(
    (p) => p.state === "completed" && p.result,
  ).length;
  return {
    eligible: true,
    simulation:process.env.QA_PAID_MOCK_WORKER==='true',
    completed,
    total: 11,
    state:
      completed === 11
        ? "completed"
        : palaces.some((p) => ["error", "uncertain"].includes(p.state))
          ? "attention"
          : "processing",
    startedAt: new Date(g.paid_at).toISOString(),
    overEstimate:
      completed !== 11 && Date.now() - new Date(g.paid_at).getTime() > 300000,
    palaces,
  };
}
export async function retryPaid(
  record: InternalReading,
  authorizedOrderId: string | undefined,
  palace: string,
) {
  if (
    !PAID_PALACES.includes(palace as any) ||
    !paidEnabled() ||
    !authorizedOrderId ||
    !(await grant(authorizedOrderId, record))
  )
    throw Error("AI_PAID_ACCESS_DENIED");
  // Explicit retry only known failures. Uncertain/completed can never be requeued here.
  await pool.query(
    `UPDATE ai_reading_jobs SET status='queued',error_code=NULL,retryable=false WHERE reading_id=$1 AND reading_hash=$2 AND edition=$3 AND palace=$4 AND status='error' AND retryable AND attempts<3 AND run_after<=now() AND result IS NULL`,
    [record.id, readingHash(record), PAID_EDITION, palace],
  );
}

/** Only the already-authorized paid edition can select this private raw snapshot. */
export async function paidDisplayRecord(
  record: InternalReading,
  authorizedOrderId?: string,
) {
  if (
    !paidEnabled() ||
    !authorizedOrderId ||
    !(await grant(authorizedOrderId, record))
  )
    return record;
  const s = (
    await pool.query(
      "SELECT raw_reading,reading_hash FROM ai_paid_sources WHERE order_id=$1",
      [authorizedOrderId],
    )
  ).rows[0];
  if (!s) return record;
  const source = JSON.parse(s.raw_reading) as InternalReading;
  if (
    readingHash(source) !== s.reading_hash ||
    s.reading_hash !== readingHash(record)
  )
    throw Error("AI_PAID_SNAPSHOT_MISMATCH");
  return source;
}
