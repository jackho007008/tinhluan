import type {PoolClient} from 'pg';
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { transaction } from "../db";
import { requireOrderTestOperator } from "../order-readings";
import { acceptPaymentInTransaction, type PaymentProvider } from "./index";

export class SePayError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
  }
}
export function sepayTestConfig() {
  if (
    process.env.SEPAY_MODE !== "test" ||
    process.env.SEPAY_TEST_ENABLED !== "true" ||
    process.env.CORE_ORDER_TEST_ENABLED !== "true"
  )
    throw new SePayError("SEPAY_TEST_DISABLED", 503);
  const secret = process.env.SEPAY_TEST_WEBHOOK_SECRET || "";
  const account = process.env.SEPAY_TEST_ACCOUNT_NUMBER || "";
  const gateway = process.env.SEPAY_TEST_GATEWAY || "";
  const subAccount = process.env.SEPAY_TEST_SUB_ACCOUNT || "";
  if (secret.length < 32 || !account || !gateway)
    throw new SePayError("SEPAY_TEST_CONFIG", 503);
  return { secret, account, gateway, subAccount };
}
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const recipientHash = (gateway: string, account: string, subAccount: string) =>
  digest(JSON.stringify([gateway, account, subAccount]));
const schema = z.object({
  id: z.number().int().positive().safe(),
  gateway: z.string().min(1).max(100),
  accountNumber: z.string().min(1).max(100),
  subAccount: z.string().max(100),
  code: z.string().max(100).nullable(),
  referenceCode: z.string().max(200).optional(),
  transferType: z.enum(["in", "out"]),
  transferAmount: z.number().int().positive().safe(),
});
export type SePayNotice = Omit<z.infer<typeof schema>, "id"> & {
  id: number | string;
};
type Notice = z.infer<typeof schema>;
type Authentication = { signature: string; timestamp: string };
/** HMAC contract: official /vi/sepay-webhooks/xac-thuc, checked 2026-10-16.
 * JSON only. Exact account/gateway/VA and exact SePay-extracted code; no guessing from content. */
export const sepayTestProvider: PaymentProvider<Notice, Authentication> = {
  async create() {
    throw new SePayError("SEPAY_CHECKOUT_NOT_IMPLEMENTED", 503);
  },
  verify(raw, auth) {
    const { secret } = sepayTestConfig();
    if (
      !/^\d{10}$/.test(auth.timestamp) ||
      Math.abs(Date.now() / 1000 - Number(auth.timestamp)) > 300 ||
      !/^sha256=[a-f0-9]{64}$/.test(auth.signature)
    )
      throw new SePayError("SEPAY_AUTH", 401);
    const expected =
      "sha256=" +
      createHmac("sha256", secret)
        .update(auth.timestamp + "." + raw)
        .digest("hex");
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(auth.signature)))
      throw new SePayError("SEPAY_AUTH", 401);
    try {
      return schema.parse(JSON.parse(raw));
    } catch {
      throw new SePayError("SEPAY_PAYLOAD", 400);
    }
  },
};
/** Local protected CLI only; amount and frozen artifact already belong to the existing order. */
export async function enrollSePayTestOrder(orderId: string) {
  requireOrderTestOperator();
  if (!z.string().uuid().safeParse(orderId).success)
    throw new SePayError("ORDER_ID", 400);
  return transaction(c=>enrollSePayTestOrderInTransaction(c,orderId));
}
/** Trusted checkout/operator paths only; no public self-payment route. */
export async function enrollSePayTestOrderInTransaction(c:PoolClient,orderId:string){
  const cfg = sepayTestConfig(),
    recipient = recipientHash(cfg.gateway, cfg.account, cfg.subAccount);

    const o = (
      await c.query(
        `SELECT o.*,b.owner_expires_at FROM orders o JOIN order_reading_bindings b ON b.order_id=o.id WHERE o.id=$1 FOR UPDATE OF o`,
        [orderId],
      )
    ).rows[0];
    if (
      !o ||
      !o.demo ||
      o.scope?.testOnly !== true ||
      o.scope?.artifact !== "frozen-customer-reading-v1" ||
      o.payment_status !== "pending" ||
      new Date(o.expires_at).getTime() <= Date.now() ||
      new Date(o.owner_expires_at).getTime() <= Date.now()
    )
      throw new SePayError("TEST_ORDER_REQUIRED", 409);
    await c.query(
      "INSERT INTO sepay_test_orders(order_id,recipient_hash) VALUES($1,$2) ON CONFLICT DO NOTHING",
      [orderId, recipient],
    );
    if (
      (
        await c.query(
          "SELECT recipient_hash FROM sepay_test_orders WHERE order_id=$1",
          [orderId],
        )
      ).rows[0].recipient_hash !== recipient
    )
      throw new SePayError("TEST_ACCOUNT_CHANGED", 409);
    return {
      orderId: o.id,
      code: o.code,
      testAmount: o.amount,
      currency: o.currency,
      testOnly: true,
      priceApproved: false,
    };
}
export async function receiveSePayTest(raw: string, auth: Authentication) {
  return settleSePayTest(sepayTestProvider.verify(raw, auth), raw, "webhook");
}
/** Trusted server adapters only. API input must pass its own schema and Bearer transport. */
export async function settleSePayTest(
  notice: SePayNotice,
  raw: string,
  source: "webhook" | "api",
) {
  const cfg = sepayTestConfig();
  const id = "sepay:test:" + (source === "api" ? "api:" : "") + notice.id;
  const recipient = recipientHash(
    notice.gateway,
    notice.accountNumber,
    notice.subAccount,
  );
  const expectedRecipient = recipientHash(
    cfg.gateway,
    cfg.account,
    cfg.subAccount,
  );
  // Stable business identity ignores descriptive fields/JSON formatting which can vary on replay.
  const settlementHash = digest(
    JSON.stringify([
      notice.id,
      notice.code,
      notice.transferAmount,
      notice.transferType,
      recipient,
    ]),
  );
  return transaction(async (c) => {
    await c.query("SET LOCAL lock_timeout = '5s'");
    await c.query("SET LOCAL statement_timeout = '10s'");
    // Serialize both ingress paths. IDs differ (numeric webhook, UUID v2); never cast them.
    await c.query(
      "SELECT pg_advisory_xact_lock(hashtextextended('sepay-test-settlement',0))",
    );
    const businessHash = digest(
      JSON.stringify([
        notice.code,
        notice.transferAmount,
        notice.transferType,
        recipient,
      ]),
    );
    const referenceKey = notice.referenceCode
      ? "reference:" +
        digest(
          JSON.stringify([
            notice.gateway,
            notice.accountNumber,
            notice.referenceCode,
          ]),
        )
      : null;
    const sourceKey = source + ":" + notice.id;
    const keys = referenceKey ? [sourceKey, referenceKey] : [sourceKey];
    const aliases = (
      await c.query(
        "SELECT * FROM sepay_test_identities WHERE identity_key=ANY($1::text[])",
        [keys],
      )
    ).rows;
    if (aliases.length) {
      const prior = aliases[0];
      const conflict = aliases.some(
        (a) =>
          a.business_hash !== businessHash ||
          a.transaction_id !== prior.transaction_id ||
          a.reference_key !== referenceKey,
      );
      if (conflict) {
        await c.query(
          "INSERT INTO sepay_test_reconcile_issues(source_id,reason) VALUES($1,'identity_conflict') ON CONFLICT(source_id,reason) DO NOTHING",
          [sourceKey],
        );
        return {
          transactionId: prior.transaction_id as string,
          disposition: "event_conflict",
        };
      }
      for (const key of keys)
        await c.query(
          "INSERT INTO sepay_test_identities(identity_key,reference_key,transaction_id,business_hash) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
          [key, referenceKey, prior.transaction_id, businessHash],
        );
      return {
        transactionId: prior.transaction_id as string,
        disposition: "duplicate",
      };
    }
    const remember = async () => {
      for (const key of keys)
        await c.query(
          "INSERT INTO sepay_test_identities(identity_key,reference_key,transaction_id,business_hash) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
          [key, referenceKey, id, businessHash],
        );
    };
    const inserted = await c.query(
      `INSERT INTO sepay_test_events(transaction_id,settlement_hash,body_hash,amount,recipient_hash,direction,disposition)
   VALUES($1,$2,$3,$4,$5,$6,'processing') ON CONFLICT DO NOTHING RETURNING transaction_id`,
      [
        id,
        settlementHash,
        digest(raw),
        notice.transferAmount,
        recipient,
        notice.transferType,
      ],
    );
    if (!inserted.rowCount) {
      const prior = (
        await c.query(
          "SELECT settlement_hash FROM sepay_test_events WHERE transaction_id=$1",
          [id],
        )
      ).rows[0];
      if (prior.settlement_hash === settlementHash) await remember();
      return {
        transactionId: id,
        disposition:
          prior.settlement_hash === settlementHash
            ? "duplicate"
            : "event_conflict",
      };
    }
    let disposition: string,
      orderId: string | null = null;
    if (notice.transferType !== "in") disposition = "not_incoming";
    else if (recipient !== expectedRecipient) disposition = "wrong_account";
    else if (!notice.code || !/^CORE[0-9A-F]{12}$/.test(notice.code))
      disposition = "invalid_code";
    else {
      const o = (
        await c.query(
          `SELECT o.*,s.recipient_hash,b.owner_expires_at FROM orders o
    LEFT JOIN sepay_test_orders s ON s.order_id=o.id LEFT JOIN order_reading_bindings b ON b.order_id=o.id
    WHERE o.code=$1 FOR UPDATE OF o`,
          [notice.code],
        )
      ).rows[0];
      if (!o) disposition = "unknown_order";
      else {
        orderId = o.id;
        if (
          !o.demo ||
          o.scope?.testOnly !== true ||
          o.scope?.artifact !== "frozen-customer-reading-v1" ||
          o.recipient_hash !== recipient
        )
          disposition = "not_enrolled";
        else if (!["pending", "paid"].includes(o.payment_status))
          disposition = "invalid_order_state";
        else if (new Date(o.owner_expires_at).getTime() <= Date.now())
          disposition = "owner_expired";
        else
          disposition = await acceptPaymentInTransaction(
            c,
            {
              eventId: id,
              transactionId: id,
              orderId: o.id,
              code: notice.code,
              amount: notice.transferAmount,
              currency: "VND",
              recipient: "sepay:test:" + recipient,
              status: "paid",
            },
            "sepay:test:" + expectedRecipient,
          );
      }
    }
    await c.query(
      "UPDATE sepay_test_events SET order_id=$2,disposition=$3 WHERE transaction_id=$1",
      [id, orderId, disposition],
    );
    await remember();
    return { transactionId: id, disposition };
  });
}
