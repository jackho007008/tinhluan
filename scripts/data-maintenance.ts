import { z } from "zod";
import { unlink, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { transaction, pool } from "../lib/db";
const command = process.argv[2];
const id = process.argv[3];
if (!["purge-expired", "delete-order"].includes(command))
  throw new Error("Use purge-expired or delete-order UUID");
if (command === "delete-order") z.string().uuid().parse(id);
const deleted = await transaction(async (c) => {
  const rows = (
    await c.query(
      command === "delete-order"
        ? "SELECT id,chart_id FROM orders WHERE id=$1 FOR UPDATE"
        : "SELECT id,chart_id FROM orders WHERE created_at<now()-interval '90 days' FOR UPDATE",
      command === "delete-order" ? [id] : [],
    )
  ).rows;
  for (const o of rows) {
    const mail = (
      await c.query("SELECT id FROM email_deliveries WHERE order_id=$1", [o.id])
    ).rows;
    for (const m of mail)
      await unlink(
        path.join(process.cwd(), ".local/mail", m.id + ".json"),
      ).catch(() => {});
    const b = (
      await c.query("SELECT birth_id FROM chart_snapshots WHERE id=$1", [
        o.chart_id,
      ])
    ).rows[0];
    for (const table of [
      "access_tokens",
      "email_deliveries",
      "reports",
      "report_jobs",
      "payment_transactions",
      "payment_events",
      "order_items",
    ])
      await c.query(`DELETE FROM ${table} WHERE order_id=$1`, [o.id]);
    await c.query("DELETE FROM orders WHERE id=$1", [o.id]);
    await c.query("DELETE FROM chart_snapshots WHERE id=$1", [o.chart_id]);
    if (b)
      await c.query("DELETE FROM birth_profile_snapshots WHERE id=$1", [
        b.birth_id,
      ]);
  }
  await c.query("DELETE FROM rate_limits WHERE expires_at<now()");
  return rows.length;
});
// Local mailbox is test-only. Remove expired link payloads after one day, including orphaned test mail.
const dir = path.join(process.cwd(), ".local/mail");
for (const file of await readdir(dir).catch(() => [])) {
  const f = path.join(dir, file);
  if ((await stat(f)).mtimeMs < Date.now() - 86400000) await unlink(f);
}
console.log(
  `Deleted ${deleted} orders; expired limits and local mailbox cleaned.`,
);
await pool.end();
