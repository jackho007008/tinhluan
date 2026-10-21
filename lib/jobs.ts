import {recordOperation} from './admin/events';
import {deliverRecoveryEmail} from "./trial/recovery";
import {deliverBoundReading} from "./order-readings";
import { randomUUID } from "node:crypto";
import { transaction } from "./db";
import { buildReport } from "./reports";
import { issueToken } from "./security";
import { sendEmail } from "./notifications";
export async function runReportJob(orderId?: string) {
  return transaction(async (c) => {
    const j = (
      await c.query(
        "SELECT * FROM report_jobs WHERE status IN ('pending','retry') AND run_after<=now() AND ($1::uuid IS NULL OR order_id=$1) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1",
        [orderId ?? null],
      )
    ).rows[0];
    if (!j) return false;
    await c.query("SAVEPOINT work");
    try {
      if (await deliverBoundReading(c, j.order_id)) {
        await c.query("UPDATE report_jobs SET status='done',attempts=attempts+1,last_error=NULL WHERE id=$1", [j.id]);
        await recordOperation({channel:'report',outcome:'success',code:'REPORT_READY',orderId:j.order_id,jobId:j.id},c);
        return true;
      }
      const r = (
        await c.query(
          "SELECT o.scope,c.data FROM orders o JOIN chart_snapshots c ON c.id=o.chart_id WHERE o.id=$1",
          [j.order_id],
        )
      ).rows[0];
      const report = await buildReport(r.data, r.scope);
      await c.query(
        "INSERT INTO reports(id,order_id,data) VALUES($1,$2,$3) ON CONFLICT(order_id) DO NOTHING",
        [randomUUID(), j.order_id, report],
      );
      await c.query(
        "UPDATE orders SET report_status='ready',email_status='queued' WHERE id=$1",
        [j.order_id],
      );
      await c.query(
        "INSERT INTO email_deliveries(id,order_id) VALUES($1,$2) ON CONFLICT(order_id) DO NOTHING",
        [randomUUID(), j.order_id],
      );
      await c.query(
        "UPDATE report_jobs SET status='done',attempts=attempts+1 WHERE id=$1",
        [j.id],
      );
    } catch {
      await c.query("ROLLBACK TO SAVEPOINT work");
      await recordOperation({channel:'report',outcome:'failure',code:'REPORT_FAILED',orderId:j.order_id,jobId:j.id},c);
      await c.query(
        "UPDATE report_jobs SET attempts=attempts+1,status=CASE WHEN attempts>=4 THEN 'failed' ELSE 'retry' END,run_after=now()+power(2,attempts)*interval '30 seconds',last_error='REPORT_FAILED' WHERE id=$1",
        [j.id],
      );
      await c.query("UPDATE orders SET report_status=$2 WHERE id=$1", [
        j.order_id,
        j.attempts >= 4 ? "failed" : "retry",
      ]);
    }
    return true;
  });
}
export async function runEmailJob() {
  return transaction(async (c) => {
    const j = (
      await c.query(
        "SELECT * FROM email_deliveries WHERE status IN ('pending','retry') AND run_after<=now() ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1",
      )
    ).rows[0];
    if (!j) return false;
    await c.query("SAVEPOINT work");
    try {
      if (await deliverRecoveryEmail(c, j)){await recordOperation({channel:'email',outcome:'success',code:'EMAIL_SENT',orderId:j.order_id,jobId:j.id},c);return true;}
      const o = (
        await c.query("SELECT email FROM orders WHERE id=$1", [j.order_id])
      ).rows[0];
      await c.query(
        "UPDATE access_tokens SET revoked_at=now() WHERE order_id=$1 AND purpose='magic'",
        [j.order_id],
      );
      const token = await issueToken(c, j.order_id, "magic", 15 / 1440);
      await sendEmail({
        id: j.id,
        to: o.email,
        link: `${process.env.APP_ORIGIN || "http://localhost:3000"}/recover#${token}`,
      });
      await c.query(
        "UPDATE email_deliveries SET status='sent',attempts=attempts+1 WHERE id=$1",
        [j.id],
      );
      await c.query("UPDATE orders SET email_status=$2 WHERE id=$1", [
        j.order_id, process.env.EMAIL_PROVIDER==='gmail-smtp'?'smtp_accepted':'local',
      ]);
    await recordOperation({channel:'email',outcome:'success',code:'EMAIL_SENT',orderId:j.order_id,jobId:j.id},c);
    } catch {
      await c.query("ROLLBACK TO SAVEPOINT work");
      await recordOperation({channel:'email',outcome:'failure',code:'EMAIL_FAILED',orderId:j.order_id,jobId:j.id},c);
      await c.query(
        "UPDATE email_deliveries SET attempts=attempts+1,status=CASE WHEN attempts>=4 THEN 'failed' ELSE 'retry' END,run_after=now()+power(2,attempts)*interval '30 seconds',last_error='EMAIL_FAILED' WHERE id=$1",
        [j.id],
      );
      await c.query("UPDATE orders SET email_status=$2 WHERE id=$1", [
        j.order_id,
        j.attempts >= 4 ? "failed" : "retry",
      ]);
    }
    return true;
  });
}
