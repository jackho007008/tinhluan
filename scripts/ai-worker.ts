import { pool } from "../lib/db";
import { aiEnabled } from "../lib/ai/config";
import { runAiMenhJob } from "../lib/ai/worker";
import { reconcileAiOutbox } from "../lib/ai/outbox";
if (!aiEnabled()) throw Error("AI_MENH_DISABLED");
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
    if (Date.now() - lastOutbox > 60000) {
      await reconcileAiOutbox();
      lastOutbox = Date.now();
    }
    if (!(await runAiMenhJob())) await new Promise((r) => setTimeout(r, 1000));
  } catch {
    console.error(
      "AI worker temporarily unavailable; no personal data or provider error logged.",
    );
    await new Promise((r) => setTimeout(r, 3000));
  }
}
await pool.end();
