import { buildInterpretation } from "./interpretation";
import { facts, validateEvidence } from "../interpretation-rules";
import { narrate } from "../narration";
import { unavailableScore } from "../scoring";
import type { ChartSnapshot } from "../tuvi-engine";
export async function buildReport(
  snapshot: ChartSnapshot,
  scope: { groups: string[]; year: number | null },
) {
  const statements = facts(snapshot);
  validateEvidence(snapshot, statements);
  return {
    interpretation: buildInterpretation(snapshot, scope.groups),
    title: "Báo cáo dữ kiện tham chiếu",
    demo: true,
    snapshot,
    scope,
    statements,
    paragraphs: await narrate(statements),
    scoring: unavailableScore(),
    limitations: [
      "Chưa có bộ luận giải chuyên môn được duyệt. Sáu nhóm chỉ tổ chức dữ kiện, không dự đoán.",
      "Không có chẩn đoán sức khỏe, dự báo tử vong hoặc khuyến nghị đầu tư.",
      "Biểu đồ điểm và vận theo năm/ngày chưa khả dụng trong báo cáo này.",
    ],
    createdAt: new Date().toISOString(),
  };
}
export type ReportData = Omit<
  Awaited<ReturnType<typeof buildReport>>,
  "interpretation"
> & { interpretation?: ReturnType<typeof buildInterpretation> };
