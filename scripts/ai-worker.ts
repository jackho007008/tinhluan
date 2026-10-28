import { pool } from "../lib/db";
import { aiEnabled } from "../lib/ai/config";
import { runAiMenhJob } from "../lib/ai/worker";
import { reconcileAiOutbox } from "../lib/ai/outbox";
import { openaiNarrator, GenerationFailure } from "../lib/ai/provider";
import { validReadingId } from "../lib/internal-review/reading-store";
if (!aiEnabled()) throw Error("AI_MENH_DISABLED");
const readingId = process.env.AI_MENH_READING_ID || undefined;
const revalidateOutput = process.env.AI_MENH_REVALIDATE_OUTPUT === "true";
if (readingId && !validReadingId(readingId))
  throw Error("AI_INVALID_READING_SCOPE");
if (revalidateOutput && !readingId)
  throw Error("AI_REVALIDATE_REQUIRES_READING_SCOPE");
const limit =
  process.env.AI_MENH_MAX_NEW_JOBS === undefined
    ? Infinity
    : Number(process.env.AI_MENH_MAX_NEW_JOBS);
if (
  process.env.AI_MENH_MAX_NEW_JOBS !== undefined &&
  (!Number.isFinite(limit) ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100)
)
  throw Error("AI_INVALID_PROCESS_LIMIT");
let dispatched = 0;
let stop = false,
  lastOutbox = 0;
process.on("SIGTERM", () => {
  stop = true;
});
process.on("SIGINT", () => {
  stop = true;
});
console.log("AI Mệnh worker started; independent of payment/email workers.");
while (!stop) {
  try {
    if (!readingId && Date.now() - lastOutbox > 60000) {
      await reconcileAiOutbox();
      lastOutbox = Date.now();
    }
    const worked = await runAiMenhJob(
      async (input, attempt, recovery) => {
        if (!recovery?.responseId) {
          if (dispatched >= limit)
            throw new GenerationFailure("AI_PROCESS_LIMIT", false);
          dispatched++;
        }
        return openaiNarrator(input, attempt, recovery);
      },
      {
        readingId,
        allowCreate: !revalidateOutput && dispatched < limit,
        revalidateOutput,
      },
    );
    if (dispatched >= limit || (!worked && readingId)) break;
    if (!worked) await new Promise((r) => setTimeout(r, 1000));
  } catch {
    console.error(
      "AI worker temporarily unavailable; no personal data or provider error logged.",
    );
    await new Promise((r) => setTimeout(r, 3000));
  }
}
await pool.end();
