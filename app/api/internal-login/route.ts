import { internalRequestOrigin } from "@/lib/internal-review/origin";
import { NextRequest, NextResponse } from "next/server";
import { issueReviewSession, validKey } from "@/lib/internal-review/auth";
import { rateLimit } from "@/lib/db";
export async function POST(req: NextRequest) {
  const origin = internalRequestOrigin(req.headers.get("origin"));
  if (!origin) return new NextResponse("Forbidden", { status: 403 });
  try {
    await rateLimit("internal-login", 8);
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT")
      return new NextResponse("Thử lại sau 10 phút.", { status: 429 });
    return new NextResponse("Dịch vụ đăng nhập tạm thời không khả dụng. Vui lòng thử lại sau khi máy chủ được khôi phục.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
  if (Number(req.headers.get("content-length") || 0) > 1024)
    return new NextResponse("Too large", { status: 413 });
  if (
    !req.headers
      .get("content-type")
      ?.startsWith("application/x-www-form-urlencoded")
  )
    return new NextResponse("Unsupported form", { status: 415 });
  const reader = req.body?.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  if (reader) {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 1024) {
        await reader.cancel();
        return new NextResponse("Too large", { status: 413 });
      }
      chunks.push(part.value);
    }
  }
  const body = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
  if (!validKey(String(body.get("key") || "")))
    return NextResponse.redirect(new URL("/internal?denied=1", origin), 303);
  const res = NextResponse.redirect(new URL("/internal", origin), 303);
  res.cookies.set("tuvi_internal", issueReviewSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600,
  });
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
