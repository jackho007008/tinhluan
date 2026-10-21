import { createHash } from "node:crypto";
import { z } from "zod";
import { pool } from "../db";
import { requireOrderTestOperator } from "../order-readings";
import {
  SePayError,
  sepayTestConfig,
  settleSePayTest,
  type SePayNotice,
} from "./sepay-test";

const amount = z.number().int().nonnegative().safe();
const apiRow = z.object({
  id: z.string().uuid(),
  account_number: z.string().min(1).max(100),
  bank_brand_name: z.string().min(1).max(100),
  va: z.string().max(100).nullable(),
  code: z.string().max(100).nullable(),
  reference_number: z.string().min(1).max(200),
  transfer_type: z.enum(["in", "out"]),
  amount_in: amount,
  amount_out: amount,
});
const pageSchema = z.object({
  status: z.literal("success"),
  data: z.array(z.unknown()).max(100),
  meta: z.object({
    pagination: z.object({
      total: z.number().int().nonnegative(),
      per_page: z.number().int().min(1).max(100),
      current_page: z.number().int().positive(),
      last_page: z.number().int().nonnegative(),
      has_more: z.boolean(),
    }),
  }),
});
export function apiNotice(value: unknown): SePayNotice {
  const r = apiRow.safeParse(value);
  if (!r.success) throw new SePayError("SEPAY_API_ROW", 502);
  const a = r.data;
  if (
    (a.transfer_type === "in" && (a.amount_in <= 0 || a.amount_out !== 0)) ||
    (a.transfer_type === "out" && (a.amount_out <= 0 || a.amount_in !== 0))
  )
    throw new SePayError("SEPAY_API_DIRECTION", 502);
  return {
    id: a.id,
    gateway: a.bank_brand_name,
    accountNumber: a.account_number,
    subAccount: a.va ?? "",
    code: a.code,
    referenceCode: a.reference_number,
    transferType: a.transfer_type,
    transferAmount: a.transfer_type === "in" ? a.amount_in : a.amount_out,
  };
}
export async function sepayApiPage(
  page: number,
  perPage: number,
  fetcher: typeof fetch = fetch,
) {
  sepayTestConfig();
  const token = process.env.SEPAY_TEST_API_TOKEN;
  if (!token) throw new SePayError("SEPAY_TEST_API_TOKEN_MISSING", 503);
  // Fixed Sandbox only. Never accept a caller URL, redirects, or a Live fallback.
  const url = new URL("https://userapi-sandbox.sepay.vn/v2/transactions");
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: { Authorization: "Bearer " + token, Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new SePayError("SEPAY_API_NETWORK", 502);
  }
  if (!response.ok)
    throw new SePayError("SEPAY_API_HTTP_" + response.status, 502);
  if (Number(response.headers.get("content-length")) > 1_000_000)
    throw new SePayError("SEPAY_API_SIZE", 502);
  let parsed: unknown;
  try {
    const text = await response.text();
    if (text.length > 1_000_000) throw Error();
    parsed = JSON.parse(text);
  } catch {
    throw new SePayError("SEPAY_API_JSON", 502);
  }
  const result = pageSchema.safeParse(parsed);
  if (!result.success) throw new SePayError("SEPAY_API_PAGE", 502);
  const p = result.data.meta.pagination;
  if (
    p.current_page !== page ||
    p.per_page !== perPage ||
    p.has_more !== page < p.last_page ||
    (!result.data.data.length && p.has_more)
  )
    throw new SePayError("SEPAY_API_PAGINATION", 502);
  return result.data;
}
/** Manual, bounded full scans. Restart at page 1, NEVER resume by offset/date/UUID arithmetic.
 * A checkpoint certifies a completed scan, not permission to skip older transactions. This
 * deliberately catches late/backdated items too. Each settlement is durable/idempotent;
 * checkpoint advances only after all pages commit. A changed page set forces a fresh run. */
export async function reconcileSePayTest(
  options: { perPage?: number; maxPages?: number; fetcher?: typeof fetch } = {},
) {
  requireOrderTestOperator();
  const cfg = sepayTestConfig();
  if (!process.env.SEPAY_TEST_API_TOKEN)
    throw new SePayError("SEPAY_TEST_API_TOKEN_MISSING", 503);
  const perPage = options.perPage ?? 100,
    maxPages = options.maxPages ?? 100;
  if (
    !Number.isInteger(perPage) ||
    perPage < 1 ||
    perPage > 100 ||
    !Number.isInteger(maxPages) ||
    maxPages < 1 ||
    maxPages > 100
  )
    throw new SePayError("SEPAY_SCAN_LIMIT", 400);
  const scope = createHash("sha256")
    .update(JSON.stringify([cfg.gateway, cfg.account, cfg.subAccount]))
    .digest("hex");
  const lock = await pool.connect();
  let locked = false;
  const results: {
    apiId: string;
    transactionId: string;
    disposition: string;
  }[] = [];
  try {
    locked = (
      await lock.query(
        "SELECT pg_try_advisory_lock(hashtextextended($1,0)) AS locked",
        ["sepay-scan:" + scope],
      )
    ).rows[0].locked;
    if (!locked) throw new SePayError("SEPAY_SCAN_BUSY", 409);
    const seen = new Set<string>();
    let total: number | undefined,
      finished = false,
      pages = 0;
    for (let page = 1; page <= maxPages; page++) {
      const data = await sepayApiPage(page, perPage, options.fetcher);
      pages = page;
      const pagination = data.meta.pagination;
      if (total !== undefined && total !== pagination.total)
        throw new SePayError("SEPAY_SCAN_CHANGED", 409);
      total = pagination.total;
      for (const raw of data.data) {
        let notice: SePayNotice;
        try {
          notice = apiNotice(raw);
        } catch (e) {
          const fingerprint = createHash("sha256")
            .update(JSON.stringify(raw))
            .digest("hex");
          await lock.query(
            "INSERT INTO sepay_test_reconcile_issues(source_id,reason) VALUES($1,$2) ON CONFLICT DO NOTHING",
            [
              "api-row:" + fingerprint,
              e instanceof SePayError ? e.code : "SEPAY_API_ROW",
            ],
          );
          throw e;
        }
        if (seen.has(String(notice.id)))
          throw new SePayError("SEPAY_SCAN_CHANGED", 409);
        seen.add(String(notice.id));
        const settled = await settleSePayTest(
          notice,
          JSON.stringify(notice),
          "api",
        );
        results.push({ apiId: String(notice.id), ...settled });
      }
      if (!pagination.has_more) {
        finished = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 400)); // Official 3 requests/sec ceiling.
    }
    if (!finished) throw new SePayError("SEPAY_SCAN_LIMIT", 409);
    if (seen.size !== total) throw new SePayError("SEPAY_SCAN_CHANGED", 409);
    await lock.query(
      `INSERT INTO sepay_test_checkpoints(scope,completed_at,processed_count) VALUES($1,now(),$2)
   ON CONFLICT(scope) DO UPDATE SET completed_at=EXCLUDED.completed_at,processed_count=EXCLUDED.processed_count`,
      [scope, seen.size],
    );
    return {
      mode: "test",
      scan: "full-from-page-1",
      pages,
      processed: seen.size,
      results,
    };
  } finally {
    if (locked)
      await lock.query("SELECT pg_advisory_unlock(hashtextextended($1,0))", [
        "sepay-scan:" + scope,
      ]);
    lock.release();
  }
}
