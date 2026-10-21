import {prepareCustomerBirth} from "@/lib/internal-review/customer-input";
import { NextRequest, NextResponse } from "next/server";
import { reviewAuthorized } from "@/lib/internal-review/auth";
import { internalRequestOrigin } from "@/lib/internal-review/origin";
import { birthSchema } from "@/lib/calendar";
import {
  calculateInternal,
  freezeReading,
} from "@/lib/internal-review/dynamic-reading";
import {
  getReading,
  saveReading,
  validReadingId,
} from "@/lib/internal-review/reading-store";
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
let active = 0;
export async function POST(req: NextRequest) {
  if (!reviewAuthorized(req.cookies.get("tuvi_internal")?.value))
    return json(
      { error: "Phiên nội bộ hết hạn. Đăng nhập lại tại /internal." },
      401,
    );
  if (!internalRequestOrigin(req.headers.get("origin")))
    return json({ error: "Nguồn yêu cầu không hợp lệ." }, 403);
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return json({ error: "Định dạng yêu cầu không được hỗ trợ." }, 415);
  if (active >= 2)
    return json({ error: "Đang có tác vụ lập lá số. Vui lòng thử lại." }, 429);
  active++;
  try {
    const reader = req.body?.getReader();
    let text = "",
      bytes = 0;
    if (reader) {
      const decoder = new TextDecoder();
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        bytes += part.value.length;
        if (bytes > 8192) {
          await reader.cancel();
          return json({ error: "Dữ liệu quá lớn." }, 413);
        }
        text += decoder.decode(part.value, { stream: true });
      }
      text += decoder.decode();
    }
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: "Dữ liệu gửi không hợp lệ." }, 400);
    }
    if (!validReadingId(body.id || ""))
      return json({ error: "Mã yêu cầu không hợp lệ." }, 400);
    let adapted: ReturnType<typeof prepareCustomerBirth> | undefined;
    if (body.customerInput !== undefined) {
      try { adapted = prepareCustomerBirth(body.customerInput); }
      catch { return json({error:"Ngày sinh, tháng nhuận hoặc khung giờ không hợp lệ. Phạm vi hiện hỗ trợ 1976–2050."},400); }
    }
    const parsed = birthSchema.safeParse(adapted?.birth ?? body.birth);
    if (!parsed.success)
      return json(
        {
          error: "Vui lòng kiểm tra thông tin sinh.",
          fields: parsed.error.flatten().fieldErrors,
        },
        400,
      );
    if (parsed.data.unknownTime)
      return json(
        {
          error:
            "Chưa rõ giờ sinh: chưa thể lập lá số đầy đủ; không tự gán giờ.",
        },
        422,
      );
    if (
      body.parentId &&
      body.parentId !== "audit-chart-comparison" &&
      !(await getReading(body.parentId))
    )
      return json(
        { error: "Không tìm thấy hồ sơ nguồn trong phạm vi nội bộ." },
        404,
      );
    const existing = await getReading(body.id);
    if (existing) {
      if (
        JSON.stringify(existing.snapshot.normalized) !==
        JSON.stringify(parsed.data) ||
        JSON.stringify(existing.inputReceipt) !== JSON.stringify(adapted?.receipt)
      )
        return json({ error: "Mã yêu cầu đã dùng cho thông tin khác." }, 409);
      return json({ id: existing.id, snapshot: existing.snapshot });
    }
    const { snapshot, receipt } = await calculateInternal(parsed.data);
    const frozen = freezeReading(snapshot, receipt);
    if (adapted && frozen.customerReport) {
      const b=parsed.data;
      frozen.customerReport.birth=`${b.date.split('-').reverse().join('/')} · Dương lịch · ${adapted.receipt.timeLabel} · ${b.gender==='male'?'Nam':'Nữ'} · ${b.place} · ${b.timezone}`;
    }
    await saveReading({
      id: body.id,
      parentId: body.parentId || undefined,
      createdAt: new Date().toISOString(),
      snapshot,
      receipt,
      frozen,
      ...(adapted ? {inputReceipt:adapted.receipt} : {}),
    });
    return json({ id: body.id, snapshot });
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    return json(
      {
        error:
          message.startsWith("CHART_INTEGRITY:") ? "Lỗi toàn vẹn dữ liệu sao/chứng nhận. Không tạo bản đọc mới từ dữ liệu này." : message === "VIEW_YEAR_MISMATCH"
            ? "Ngày xem không thuộc năm âm đã chọn. Hãy sửa năm hoặc ngày xem."
            : message === "ID_CONFLICT"
              ? "Mã yêu cầu đã tồn tại. Hãy nhập lại."
              : message === "VN_DATE_RANGE" ||
                  message === "CALENDAR_BOUNDARY_REVIEW"
                ? "Ngày sinh cần kiểm tra phạm vi lịch hoặc ranh giới thiên văn."
                : "Không thể tạo hoặc lưu bản đọc. Giữ thông tin và thử lại; không dùng dữ liệu DEMO.",
      },
      message === "VIEW_YEAR_MISMATCH" ? 422 : 503,
    );
  } finally {
    active--;
  }
}
