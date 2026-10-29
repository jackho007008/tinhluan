import { pool } from "../lib/db";
import { paidEnabled, PAID_PALACES } from "../lib/ai/paid-contract";
import { reconcilePaidOrders } from "../lib/ai/paid-store";
import { runAiMenhJob } from "../lib/ai/worker";
import { validReadingId } from "../lib/internal-review/reading-store";
if (!paidEnabled()) throw Error("AI_PAID_DISABLED");
const id = process.env.AI_PAID_READING_ID,
  limit = Number(process.env.AI_PAID_MAX_NEW_JOBS),
  palace = process.env.AI_PAID_PALACE;
if(palace && !PAID_PALACES.includes(palace as any))throw Error("AI_INVALID_PALACE_SCOPE");
if (
  !id ||
  !validReadingId(id) ||
  !Number.isInteger(limit) ||
  limit < 1 ||
  limit > 11
)
  throw Error("AI_PAID_EXPLICIT_SCOPE_AND_LIMIT_REQUIRED");
try {
  await reconcilePaidOrders(id);
  for (let i = 0; i < limit; i++)
    if (!(await runAiMenhJob(undefined, { paid: true, readingId: id, palace }))) break;
} finally {
  await pool.end();
}
