import { pool } from "../lib/db";
import { consumePaidScope } from "../lib/ai/paid-consumer";
try {
  await consumePaidScope({
    readingId: process.env.AI_PAID_READING_ID || "",
    palace: process.env.AI_PAID_PALACE,
    maxNewJobs: Number(process.env.AI_PAID_MAX_NEW_JOBS),
    maxTicks: Number(process.env.AI_PAID_MAX_TICKS ?? 100),
    runtimeMs: Number(process.env.AI_PAID_RUN_MS ?? 1800000),
  });
} finally {
  await pool.end();
}
