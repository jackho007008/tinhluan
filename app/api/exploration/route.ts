import { NextRequest, NextResponse } from "next/server";
import { reviewAuthorized } from "@/lib/internal-review/auth";
import { getReading } from "@/lib/internal-review/reading-store";
import { exploration, fullText } from "@/lib/exploration/model";
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export async function GET(req: NextRequest) {
  if (!reviewAuthorized(req.cookies.get("tuvi_internal")?.value))
    return json(
      { error: "Phiên nội bộ hết hạn. Đăng nhập lại để đọc đúng bản đã lưu." },
      401,
    );
  const record = await getReading(req.nextUrl.searchParams.get("id") || "");
  if (!record) return json({ error: "Không tìm thấy bản đọc." }, 404);
  const model = exploration(record.snapshot, record.frozen);
  if (req.nextUrl.searchParams.get("format") === "text")
    return new NextResponse(fullText(model), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="reading-${record.id}.txt"`,
      },
    });
  if (req.nextUrl.searchParams.get("format") === "sources")
    return json({ model, snapshot: record.snapshot, frozen: record.frozen });
  return json(model);
}
