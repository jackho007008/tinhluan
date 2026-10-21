import { runReportJob, runEmailJob } from "../lib/jobs";
import { pool } from "../lib/db";
let stop = false;
process.on("SIGTERM", () => {
  stop = true;
});
process.on("SIGINT", () => {
  stop = true;
});
console.log("Worker started; PostgreSQL durable queue.");
while (!stop) {
  try {
    const report = await runReportJob();
    const email = await runEmailJob();
    if (!report && !email) await new Promise((r) => setTimeout(r, 1500));
  } catch {
    console.error("Worker unavailable; retrying without logging personal data");
    await new Promise((r) => setTimeout(r, 5000));
  }
}
await pool.end();
