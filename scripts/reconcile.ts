import { pool } from "../lib/db";
// Repair missing downstream jobs for already verified paid orders only.
// A real provider statement/poll adapter is intentionally not configured.
await pool.query(
  "INSERT INTO report_jobs(id,order_id) SELECT gen_random_uuid(),id FROM orders WHERE payment_status='paid' ON CONFLICT(order_id) DO NOTHING",
);
await pool.query(
  "INSERT INTO email_deliveries(id,order_id) SELECT gen_random_uuid(),order_id FROM reports ON CONFLICT(order_id) DO NOTHING",
);
const result = await pool.query(
  "SELECT disposition,count(*)::int AS count FROM payment_events WHERE disposition IN ('mismatch','late','unknown_order','transaction_reused') GROUP BY disposition",
);
console.log({
  review: result.rows,
  providerReconciliation: "unconfigured; no bank verification performed",
});
await pool.end();
