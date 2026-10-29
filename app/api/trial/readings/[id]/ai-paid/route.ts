import type { NextRequest } from "next/server";
import { customerReadingAccess } from "@/lib/trial/reading-access";
import { TRIAL_COOKIE } from "@/lib/trial/store";
import { RECOVERY_COOKIE } from "@/lib/trial/recovery";
import { CUSTOMER_COOKIE } from "@/lib/customer-auth/config";
import {
  trialJson,
  trialPostGuard,
  trialBody,
  trialEnabled,
} from "@/lib/trial/http";
import { readPaid, retryPaid } from "@/lib/ai/paid-store";
import { paidEnabled } from "@/lib/ai/paid-contract";
export const runtime = "nodejs";
const owned = (r: NextRequest, id: string) =>
  customerReadingAccess(
    r.cookies.get(TRIAL_COOKIE)?.value,
    r.cookies.get(RECOVERY_COOKIE)?.value,
    id,
    r.cookies.get(CUSTOMER_COOKIE)?.value,
  );
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!trialEnabled() || !paidEnabled())
    return trialJson({ error: "Không tìm thấy nội dung." }, 404);
  try {
    const a = await owned(req, (await params).id);
    if (!a) return trialJson({ error: "Không tìm thấy báo cáo." }, 404);
    return trialJson(
      await readPaid(a.record, a.scope.full ? a.key : undefined),
    );
  } catch {
    return trialJson(
      {
        error:
          "Chưa đọc được trạng thái. Quyền và kết quả đã lưu vẫn được giữ.",
      },
      503,
    );
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = trialPostGuard(req);
  if (blocked) return blocked;
  if (!paidEnabled()) return trialJson({ error: "Chưa mở tác vụ này." }, 404);
  try {
    const a = await owned(req, (await params).id);
    if (!a) return trialJson({ error: "Không tìm thấy báo cáo." }, 404);
    const b = await trialBody(req);
    if (!b || Object.keys(b).length !== 1 || typeof b.palace !== "string")
      return trialJson({ error: "Yêu cầu không hợp lệ." }, 400);
    await retryPaid(a.record, a.scope.full ? a.key : undefined, b.palace);
    return trialJson(
      await readPaid(a.record, a.scope.full ? a.key : undefined),
    );
  } catch {
    return trialJson(
      {
        error:
          "Chưa thể thử lại. Hãy kiểm tra quyền hoặc liên hệ hỗ trợ; không cần thanh toán lại.",
      },
      409,
    );
  }
}
