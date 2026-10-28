import type { NextRequest } from "next/server";
import { customerReadingAccess } from "@/lib/trial/reading-access";
import { TRIAL_COOKIE } from "@/lib/trial/store";
import { RECOVERY_COOKIE } from "@/lib/trial/recovery";
import { CUSTOMER_COOKIE } from "@/lib/customer-auth/config";
import {
  trialEnabled,
  trialJson,
  trialPostGuard,
  trialBody,
} from "@/lib/trial/http";
import { readMenh } from "@/lib/ai/store";
export const runtime = "nodejs";
const owned = (req: NextRequest, id: string) =>
  customerReadingAccess(
    req.cookies.get(TRIAL_COOKIE)?.value,
    req.cookies.get(RECOVERY_COOKIE)?.value,
    id,
    req.cookies.get(CUSTOMER_COOKIE)?.value,
  );
/** Read-only reopening: this route never creates or retries a generation. */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!trialEnabled())
    return trialJson({ error: "Không tìm thấy báo cáo." }, 404);
  try {
    const access = await owned(req, (await params).id);
    if (!access) return trialJson({ error: "Không tìm thấy báo cáo." }, 404);
    const view = await readMenh(access.record);
    // Retired free jobs stay untouched in storage, but are not an active
    // customer queue anymore. This also stops old tabs showing an endless wait.
    return trialJson(
      view.state === "completed"
        ? view
        : {
            enabled: false,
            eligible: false,
            state: "not-created",
            queued: false,
            canRetry: false,
            errorCode: "AI_FREE_ASTRA_RETIRED",
          },
    );
  } catch {
    return trialJson({ error: "Chưa đọc được trạng thái AI." }, 503);
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = trialPostGuard(req);
  if (blocked) return blocked;
  try {
    const access = await owned(req, (await params).id);
    if (!access) return trialJson({ error: "Không tìm thấy báo cáo." }, 404);
    const body = await trialBody(req);
    if (
      !body ||
      Object.keys(body).some((k) => k !== "retry") ||
      (body.retry !== undefined && typeof body.retry !== "boolean")
    )
      return trialJson({ error: "Yêu cầu không hợp lệ." }, 400);
    const current = await readMenh(access.record);
    if (current.state === "completed") return trialJson(current);
    return trialJson(
      {
        error:
          "Mệnh miễn phí sử dụng bài đã biên soạn và hiển thị ngay. Tạo luận AI Mệnh tự động đã dừng.",
        code: "AI_FREE_ASTRA_RETIRED",
      },
      409,
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return trialJson(
      {
        error:
          code === "AI_DAILY_LIMIT"
            ? "Đã tới giới hạn tạo bài trong ngày. Vui lòng thử lại sau."
            : "Chưa gửi được yêu cầu AI. Báo cáo đã lưu vẫn được giữ nguyên.",
      },
      code === "RATE_LIMIT" || code === "AI_DAILY_LIMIT" ? 429 : 503,
    );
  }
}
