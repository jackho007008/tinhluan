import { internalRequestOrigin } from "@/lib/internal-review/origin";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const origin = internalRequestOrigin(req.headers.get("origin"));
  if (!origin) return new NextResponse("Forbidden", { status: 403 });
  const res = NextResponse.redirect(new URL("/internal", origin), 303);
  res.cookies.set("tuvi_internal", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
