import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import QRCode from "qrcode";
import { z } from "zod";
import { transaction } from "../db";
import { demoOnly } from "../security";
export const paymentSchema = z
  .object({
    eventId: z.string().min(1).max(100),
    transactionId: z.string().min(1).max(100),
    orderId: z.string().uuid(),
    code: z.string(),
    amount: z.number().int().positive(),
    currency: z.literal("VND"),
    recipient: z.string(),
    status: z.enum(["paid", "pending", "failed"]),
  })
  .strict();
export type Payment = z.infer<typeof paymentSchema>;
export interface PaymentProvider<
  Notification = Payment,
  Authentication = string,
> {
  create(order: {
    id: string;
    code: string;
    amount: number;
  }): Promise<{ qr: string; recipient: string; memo: string }>;
  verify(raw: string, authentication: Authentication): Notification;
}
function secret() {
  const s = process.env.MOCK_WEBHOOK_SECRET;
  if (!s || s.length < 32) throw new Error("PAYMENT_CONFIG");
  return s;
}
export function sign(raw: string) {
  return createHmac("sha256", secret()).update(raw).digest("hex");
}
export const mockProvider: PaymentProvider = {
  async create(o) {
    demoOnly();
    return {
      qr: await QRCode.toDataURL(
        `TUVI-DEMO|${o.id}|${o.code}|${o.amount}|VND|NOT-A-BANK-TRANSFER`,
      ),
      recipient: "MÔ PHỎNG · Không có tài khoản nhận tiền",
      memo: o.code,
    };
  },
  verify(raw, signature) {
    demoOnly();
    const expected = Buffer.from(sign(raw));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given))
      throw new Error("INVALID_SIGNATURE");
    return paymentSchema.parse(JSON.parse(raw));
  },
};
export async function acceptPayment(event: Payment) {
  return transaction((c) => acceptPaymentInTransaction(c, event));
}
/** Shared atomic settlement. Only trusted server adapters select the expected recipient. */
export async function acceptPaymentInTransaction(
  c: PoolClient,
  event: Payment,
  expectedRecipient = "DEMO_RECIPIENT",
) {
  const o = (
    await c.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE", [
      event.orderId,
    ])
  ).rows[0];
  let disposition = "accepted";
  if (!o) disposition = "unknown_order";
  else if (
    event.code !== o.code ||
    event.amount !== o.amount ||
    event.currency !== o.currency ||
    event.recipient !== expectedRecipient
  )
    disposition = "mismatch";
  else if (o.payment_status === "paid") disposition = "duplicate";
  else if (new Date(o.expires_at).getTime() < Date.now()) disposition = "late";
  else if (event.status !== "paid") disposition = "ignored";
  const inserted = await c.query(
    "INSERT INTO payment_events(id,order_id,payload,disposition) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING id",
    [event.eventId, event.orderId, event, disposition],
  );
  if (!inserted.rowCount) return "duplicate";
  if (disposition !== "accepted") return disposition;
  const tx = await c.query(
    "INSERT INTO payment_transactions(id,order_id,amount,currency,recipient) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING RETURNING id",
    [event.transactionId, o.id, event.amount, event.currency, event.recipient],
  );
  if (!tx.rowCount) {
    await c.query(
      "UPDATE payment_events SET disposition='transaction_reused' WHERE id=$1",
      [event.eventId],
    );
    return "transaction_reused";
  }
  await c.query(
    "UPDATE orders SET payment_status='paid',paid_at=now(),report_status='queued' WHERE id=$1",
    [o.id],
  );
  await c.query(
    "INSERT INTO report_jobs(id,order_id) VALUES($1,$2) ON CONFLICT(order_id) DO NOTHING",
    [randomUUID(), o.id],
  );
  return "accepted";
}
