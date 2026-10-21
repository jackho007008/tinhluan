import { exploration } from "@/lib/exploration/model";
import { customerRequestOrigin } from "@/lib/customer-origin";
import { customerReport } from "@/lib/reading/customer";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { pool, transaction, rateLimit } from "@/lib/db";
import { calculate } from "@/lib/tuvi-engine";
import { birthSchema, profileRanges } from "@/lib/calendar";
import { packages, groups } from "@/lib/config";
import {
  authorize,
  demoOnly,
  hash,
  issueToken,
  exchangeToken,
} from "@/lib/security";
import { mockProvider, acceptPayment, sign } from "@/lib/payments";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const orderSchema = z
  .object({
    birth: birthSchema,
    packageId: z.enum(["topic", "complete", "year"]),
    topic: z.enum(groups),
    year: z.number().int().min(1900).max(2099),
    email: z.string().trim().email().max(254),
    confirmed: z.literal(true),
  })
  .strict();
function response(data: unknown, token?: string) {
  const res = NextResponse.json(data);
  res.headers.set("Cache-Control", "private, no-store");
  if (token)
    res.cookies.set("tuvi_session", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 86400 * 30,
    });
  return res;
}
async function boundedText(req: NextRequest) {
  const reader = req.body?.getReader();
  if (!reader) return "";
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > 20000) {
      await reader.cancel();
      throw new Error("TOO_LARGE");
    }
    chunks.push(part.value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
async function jsonBody(req: NextRequest) {
  return JSON.parse(await boundedText(req));
}
async function handle(req: NextRequest) {
  try {
    const action = req.nextUrl.pathname.slice(5);
    const method = req.method;
    const token = req.cookies.get("tuvi_session")?.value;
    if (method === "POST" && action !== "webhook") {
      const origin = req.headers.get("origin");
      if (!customerRequestOrigin(origin))
        return NextResponse.json(
          { error: "Nguồn yêu cầu không hợp lệ" },
          { status: 403 },
        );
    }
    if (method === "POST") {
      await rateLimit("global:" + action, action === "chart" ? 100 : 60);
      if (Number(req.headers.get("content-length") || 0) > 20000)
        throw new Error("TOO_LARGE");
    }
    if (method === "GET" && action === "packages")
      return response({
        packages,
        demo:
          process.env.NODE_ENV !== "production" &&
          process.env.DEMO_ENABLED === "true",
      });
    if (method === "POST" && action === "chart") {
      const snapshot = await calculate(await jsonBody(req));
      return response({ ...snapshot, exploration: exploration(snapshot) });
    }
    if (method === "POST" && action === "orders") {
      demoOnly();
      const data = orderSchema.parse(await jsonBody(req));
      const p = packages.find((p) => p.id === data.packageId)!;
      const snapshot = await calculate(data.birth);
      const order = await transaction(async (c) => {
        const birthId = randomUUID(),
          chartId = randomUUID(),
          id = randomUUID(),
          code =
            "TV" + randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
        const scope = {
          groups: p.groups === 1 ? [data.topic] : [...groups],
          year: p.id === "year" ? data.year : null,
          accessDays: p.accessDays,
          scoring: false,
          interpretation: false,
        };
        await c.query(
          "INSERT INTO birth_profile_snapshots(id,data) VALUES($1,$2)",
          [birthId, snapshot.normalized],
        );
        await c.query(
          "INSERT INTO chart_snapshots(id,birth_id,result_id,data) VALUES($1,$2,$3,$4)",
          [chartId, birthId, snapshot.resultId, snapshot],
        );
        await c.query(
          "INSERT INTO orders(id,code,email,chart_id,amount,demo,scope,expires_at) VALUES($1,$2,$3,$4,$5,true,$6,now()+interval '30 minutes')",
          [id, code, data.email.toLowerCase(), chartId, p.price, scope],
        );
        await c.query(
          "INSERT INTO order_items(id,order_id,package_snapshot) VALUES($1,$2,$3)",
          [randomUUID(), id, p],
        );
        return {
          id,
          token: await issueToken(c, id, "session", Math.min(p.accessDays, 30)),
        };
      });
      return response({ id: order.id }, order.token);
    }
    if (method === "GET" && action === "order") {
      const id = z.string().uuid().parse(req.nextUrl.searchParams.get("id"));
      await authorize(token, id);
      const o = (
        await pool.query(
          "SELECT o.*,i.package_snapshot FROM orders o JOIN order_items i ON i.order_id=o.id WHERE o.id=$1",
          [id],
        )
      ).rows[0];
      const report = (
        await pool.query("SELECT data FROM reports WHERE order_id=$1", [id])
      ).rows[0]?.data;
      const payment =
        o.payment_status === "pending" && process.env.NODE_ENV !== "production"
          ? await mockProvider.create(o)
          : null;
      return response({
        order: {
          id: o.id,
          code: o.code,
          amount: o.amount,
          package: o.package_snapshot,
          scope: o.scope,
          expiresAt: o.expires_at,
          paymentStatus: o.payment_status,
          reportStatus: o.report_status,
          emailStatus: o.email_status,
        },
        payment,
        report: report ? customerReport(report) : undefined,
        chartSnapshot: report?.snapshot,
      });
    }
    if (method === "POST" && action === "mock-pay") {
      demoOnly();
      const { id } = z
        .object({ id: z.string().uuid() })
        .strict()
        .parse(await jsonBody(req));
      await authorize(token, id);
      const o = (await pool.query("SELECT * FROM orders WHERE id=$1", [id]))
        .rows[0];
      const raw = JSON.stringify({
        eventId: randomUUID(),
        transactionId: "mock-" + id,
        orderId: id,
        code: o.code,
        amount: o.amount,
        currency: "VND",
        recipient: "DEMO_RECIPIENT",
        status: "paid",
      });
      return response({
        status: await acceptPayment(mockProvider.verify(raw, sign(raw))),
      });
    }
    if (method === "POST" && action === "webhook") {
      const raw = await boundedText(req);
      if (raw.length > 20000) throw new Error("TOO_LARGE");
      return response({
        status: await acceptPayment(
          mockProvider.verify(raw, req.headers.get("x-mock-signature") || ""),
        ),
      });
    }
    if (method === "POST" && action === "resend") {
      const { id } = z
        .object({ id: z.string().uuid() })
        .parse(await jsonBody(req));
      await authorize(token, id);
      await rateLimit("resend:" + id, 3);
      await pool.query(
        "WITH queued AS (UPDATE email_deliveries SET status='pending',attempts=0,run_after=now() WHERE order_id=$1 AND status IN ('sent','failed') RETURNING order_id) UPDATE orders SET email_status='queued' WHERE id IN (SELECT order_id FROM queued)",
        [id],
      );
      return response({ ok: true });
    }
    if (method === "POST" && action === "retry") {
      const { id } = z
        .object({ id: z.string().uuid() })
        .parse(await jsonBody(req));
      await authorize(token, id);
      await rateLimit("retry:" + id, 3);
      await transaction(async (c) => {
        await c.query(
          "UPDATE report_jobs SET status='pending',attempts=0,run_after=now() WHERE order_id=$1 AND status='failed'",
          [id],
        );
        await c.query(
          "UPDATE orders SET report_status='queued' WHERE id=$1 AND report_status='failed'",
          [id],
        );
      });
      return response({ ok: true });
    }
    if (method === "POST" && action === "recover") {
      const { email } = z
        .object({ email: z.string().email().max(254) })
        .parse(await jsonBody(req));
      await rateLimit("recover:" + hash(email.toLowerCase()), 3);
      await pool.query(
        "WITH queued AS (UPDATE email_deliveries e SET status='pending',attempts=0,run_after=now() FROM orders o WHERE e.order_id=o.id AND o.email=$1 AND o.report_status='ready' AND o.created_at+((o.scope->>'accessDays')::int)*interval '1 day'>now() AND e.status IN ('sent','failed') RETURNING e.order_id) UPDATE orders SET email_status='queued' WHERE id IN (SELECT order_id FROM queued)",
        [email.toLowerCase()],
      );
      return response({ ok: true });
    }
    if (method === "POST" && action === "exchange") {
      const { token: t } = z
        .object({ token: z.string().min(40).max(100) })
        .parse(await jsonBody(req));
      const r = await exchangeToken(t);
      return response({ id: r.id }, r.token);
    }
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  } catch (e) {
    if (e instanceof z.ZodError)
      return NextResponse.json(
        { error: "Kiểm tra lại thông tin", fields: e.flatten().fieldErrors },
        { status: 400 },
      );
    const m = e instanceof Error ? e.message : "";
    const messages: Record<string, string> = {
      UNKNOWN_TIME:
        "Chưa rõ giờ sinh: chưa thể lập lá số. Hãy bổ sung giờ sinh để tiếp tục.",
      VN_UNAVAILABLE:
        "Lịch Việt Nam chưa được hỗ trợ. Không tự chuyển sang lịch khác.",
      VN_DATE_RANGE: `${profileRanges["vn-utc7-midnight-v1"].label} chỉ nhận ngày từ ${profileRanges["vn-utc7-midnight-v1"].min} đến ${profileRanges["vn-utc7-midnight-v1"].max}.`,
      CALENDAR_BOUNDARY_REVIEW:
        "Ngày này nằm trong khoảng có sự kiện thiên văn sát nửa đêm cần xác minh thêm. Chưa thể lập lá số; không tự chuyển lịch.",
      UNAUTHORIZED:
        "Liên kết không hợp lệ hoặc đã hết hạn. Hãy xác thực lại bằng email.",
      DEMO_DISABLED: "Thanh toán demo đã tắt. Chưa mở bán thật.",
      INVALID_SIGNATURE: "Xác thực webhook không hợp lệ",
      RATE_LIMIT: "Quá nhiều yêu cầu. Vui lòng thử lại sau 10 phút.",
    };
    return NextResponse.json(
      {
        error:
          messages[m] ||
          "Chưa xử lý được. Dữ liệu đã nhập vẫn được giữ; vui lòng thử lại.",
      },
      {
        status:
          m === "UNAUTHORIZED" || m === "INVALID_SIGNATURE"
            ? 401
            : m === "RATE_LIMIT"
              ? 429
              : 400,
      },
    );
  }
}
export const GET = handle;
export const POST = handle;
