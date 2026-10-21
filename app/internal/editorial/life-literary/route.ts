import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { reviewAuthorized } from "@/lib/internal-review/auth";
export async function GET(req: NextRequest) {
  if (!reviewAuthorized(req.cookies.get("tuvi_internal")?.value))
    return new NextResponse("Phiên nội bộ không hợp lệ.", { status: 401 });
  const groups = [
    { id: "m05", pages: [34, 35, 65, 66, 67] },
    { id: "m07", pages: [118, 120, 121] },
  ];
  const sections = await Promise.all(
    groups.map(
      async (g) =>
        '<section id="' +
        g.id +
        '"><h2>' +
        g.id.toUpperCase() +
        "</h2>" +
        (
          await Promise.all(
            g.pages.map(
              async (n) =>
                '<figure><img alt="Tân Biên PDF ' +
                n +
                '" src="data:image/png;base64,' +
                (
                  await readFile(
                    path.join(
                      process.cwd(),
                      "docs/evidence/life-literary",
                      `tb-${String(n).padStart(3, "0")}.png`,
                    ),
                  )
                ).toString("base64") +
                '"><figcaption>PDF / số hiển thị ' +
                n +
                "</figcaption></figure>",
            ),
          )
        ).join("") +
        "</section>",
    ),
  );
  return new NextResponse(
    '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Căn cứ M05/M07 — Tân Biên</title><style>body{max-width:900px;margin:auto;padding:16px;font:16px/1.6 system-ui;overflow-wrap:anywhere}img{max-width:100%;height:auto}figure{margin:12px 0}</style><main><h1>Căn cứ M05/M07</h1><p>Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, bản277 trang. SHA-256: 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc. Đối chiếu văn bản, chưa phê duyệt chuyên môn. Chỉ các trang quyết định; không phải toàn sách.</p>' +
      sections.join("") +
      "</main></html>",
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
