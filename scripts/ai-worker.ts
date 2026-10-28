import { pool } from "../lib/db";
import { aiEnabled } from "../lib/ai/config";
import { runAiMenhJob } from "../lib/ai/worker";
import { openaiNarrator, GenerationFailure } from "../lib/ai/provider";
import { validReadingId } from "../lib/internal-review/reading-store";
if (!aiEnabled()) throw Error("AI_MENH_DISABLED");
const readingId = process.env.AI_MENH_READING_ID;
if (readingId && !validReadingId(readingId))
  throw Error("AI_INVALID_READING_SCOPE");
const limit = process.env.AI_MENH_MAX_NEW_JOBS;
if (
  limit !== undefined &&
  (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
)
  throw Error("AI_INVALID_PROCESS_LIMIT");
if (!readingId) throw Error("AI_LEGACY_RECONCILIATION_REQUIRES_READING_SCOPE");
console.log(
  "Legacy AI Mệnh reconciliation only; CREATE disabled, payment workers independent.",
);
try {
  await runAiMenhJob(
    async (input, attempt, recovery) => {
      if (!recovery?.responseId)
        throw new GenerationFailure("AI_FREE_ASTRA_RETIRED", false);
      return openaiNarrator(input, attempt, recovery);
    },
    {
      readingId,
      allowCreate: false,
      revalidateOutput: process.env.AI_MENH_REVALIDATE_OUTPUT === "true",
    },
  );
} finally {
  await pool.end();
}
