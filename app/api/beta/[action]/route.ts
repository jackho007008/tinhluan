import { NextRequest, NextResponse } from "next/server";
import { betaEnabled } from "@/lib/beta/schema";
import {
  closeBeta,
  betaReading,
  exchangeBeta,
  saveFeedback,
  startBeta,
} from "@/lib/beta/store";
import { rateLimit } from "@/lib/db";
export const dynamic = "force-dynamic";
const reply = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
async function body(req: NextRequest) {
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    throw Error("INVALID_BODY");
  const reader = req.body?.getReader();
  if (!reader) throw Error("INVALID_BODY");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const v = await reader.read();
    if (v.done) break;
    bytes += v.value.length;
    if (bytes > 16000) {
      await reader.cancel();
      throw Error("INVALID_BODY");
    }
    chunks.push(v.value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  if (!betaEnabled()) return reply({ error: "Đợt đọc thử chưa được mở." }, 404);
  if ((await params).action !== "reading")
    return reply({ error: "Không tìm thấy." }, 404);
  try {
    const g = await betaReading(req.cookies.get("tuvi_beta")?.value);
    return reply({
      alias: g.alias,
      reportId: g.report_id,
      expires: g.expires_at,
      deleteAfter: g.delete_after,
      started: !!g.started_at,
      completed: !!g.completed_at,
      document: {
        ...g.document,
        sections: g.started_at ? g.document.sections : [],
      },
    });
  } catch {
    return reply(
      {
        error:
          "Quyền đọc không hợp lệ, đã hết hạn hoặc đã thu hồi. Liên hệ người phụ trách để được cấp lại.",
      },
      401,
    );
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  if (!betaEnabled()) return reply({ error: "Đợt đọc thử chưa được mở." }, 404);
  if (req.headers.get("origin") !== process.env.APP_ORIGIN)
    return reply({ error: "Yêu cầu không hợp lệ." }, 403);
  try {
    const action = (await params).action,
      session = req.cookies.get("tuvi_beta")?.value;
    if (action === "exchange") {
      await rateLimit("beta-exchange", 30);
      const data = await body(req);
      if (
        !data ||
        typeof data.token !== "string" ||
        Object.keys(data).length !== 1
      )
        throw Error("INVALID_BODY");
      const issued = await exchangeBeta(data.token);
      const res = reply({ ok: true });
      res.cookies.set("tuvi_beta", issued.session, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/api/beta",
        expires: issued.expires,
      });
      return res;
    }
    if (action === "start") {
      const data = await body(req);
      if (
        data?.consent !== true ||
        typeof data.reportId !== "string" ||
        typeof data.readerAlias !== "string" ||
        Object.keys(data).length !== 3
      )
        throw Error("INVALID_BODY");
      await startBeta(session, data.reportId, data.readerAlias);
      return reply({ ok: true });
    }
    if (action === "feedback") {
      await saveFeedback(session, await body(req));
      return reply({ ok: true });
    }
    if (action === "logout") {
      await closeBeta(session);
      const res = reply({ ok: true });
      res.cookies.set("tuvi_beta", "", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/api/beta",
        maxAge: 0,
      });
      return res;
    }
    return reply({ error: "Không tìm thấy." }, 404);
  } catch (e) {
    const code = e instanceof Error ? e.message : "";
    return reply(
      {
        error:
          code === "RATE_LIMIT"
            ? "Bạn đã gửi nhiều lần. Hãy thử lại sau 10 phút."
            : code === "BETA_CONTEXT_CHANGED"
              ? "Phiên hoặc bản đọc đã thay đổi ở tab khác. Hãy tải lại trang trước khi tiếp tục."
              : code === "IDEMPOTENCY_CONFLICT"
                ? "Lần gửi này đã được lưu với nội dung khác. Hãy tải lại trước khi gửi thêm."
                : "Không thể xử lý. Kiểm tra quyền truy cập và câu trả lời rồi thử lại.",
      },
      code === "RATE_LIMIT" ? 429 : code === "UNAUTHORIZED" ? 401 : 400,
    );
  }
}
