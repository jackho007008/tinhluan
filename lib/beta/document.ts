import type { ReportData } from "../reports";
import { internalPreview } from "../internal-review/preview";
export const BETA_TEMPLATE_VERSION = "beta-reader-1.0.0";
export type BetaSection = {
  id: string;
  claimId: string | null;
  title: string;
  text: string;
  basis: {
    factor: string;
    sources: { title: string; url: string; location: string }[];
    conditions: string;
    limits: string;
  };
};
export type BetaDocument = {
  title: string;
  notice: string;
  warnings: string[];
  sections: BetaSection[];
  versions: {
    engine: ReportData["snapshot"]["versions"];
    profile: string;
    rules: string;
    ruleHash: string;
    template: string;
    preview: string;
  };
  demo: boolean;
};
export function freezeBeta(report: ReportData, demo: boolean): BetaDocument {
  const p = internalPreview(report),
    t = p.topics.find((t) => t.id === "overview");
  if (!t) throw Error("BETA_NO_OVERVIEW");
  const factual: BetaSection = {
    id: "overview-facts",
    claimId: null,
    title: "Dữ kiện nổi bật",
    text: [
      t.summary,
      ...t.stars.map(
        (s) =>
          `${s.name}: trạng thái ${s.state || "không ghi nhận"}; tứ hóa ${s.transformation || "không ghi nhận"}.`,
      ),
      ...t.supportingFacts.map((f) => f.text),
    ].join("\n"),
    basis: {
      factor: t.positions.join(" "),
      sources: [],
      conditions: t.conditions,
      limits: t.limits,
    },
  };
  const notes = [...t.mainNotes, ...t.glossaryNotes, ...t.detailNotes];
  return {
    title: "Tổng quan — bản đọc thử",
    notice: "Bản đọc thử miễn phí — nội dung dự thảo",
    demo,
    warnings: [
      ...(t.majorStarsStatus === "missing"
        ? ["Thiếu dữ liệu chính tinh; bản này chưa đủ để đọc Tổng quan."]
        : []),
      ...(notes.length ? [] : ["Chưa có chú giải phù hợp; chỉ có dữ kiện."]),
      ...t.unexplainedStars.map(
        (s) => `${s}: chưa có diễn giải riêng tại Mệnh.`,
      ),
      ...t.scopeGaps,
      "Chưa có luận giải toàn lá số, dự báo năm/ngày hoặc biểu đồ điểm. Bản chép, quyền nội dung và diễn nghĩa chuyên môn còn chờ xác minh.",
    ],
    versions: {
      engine: report.snapshot.versions,
      profile: report.snapshot.profile.id,
      rules: p.contentVersion,
      ruleHash: p.execution.ruleSetHash,
      template: BETA_TEMPLATE_VERSION,
      preview: p.version,
    },
    sections: [
      factual,
      ...notes.map((n) => ({
        id: `claim-${n.claimId}`,
        claimId: n.claimId,
        title: n.title,
        text: n.text,
        basis: {
          factor: n.factor,
          sources: n.sources.map((s) => ({
            title: s.title,
            url: s.url,
            location: s.location,
          })),
          conditions: n.claim.rules.every((r) => r.presentation)
            ? n.condition
            : "Chỉ áp dụng cho yếu tố ghi trên lá số; điều kiện đầy đủ đang chờ kiểm duyệt.",
          limits: n.missing
            .replaceAll("mảng exceptions rỗng", "chưa ghi nhận ngoại lệ")
            .replaceAll("snapshot", "bản đã lưu")
            .replaceAll("DTO", "dữ liệu lá số"),
        },
      })),
      ...t.adjustments.map((c) => ({
        id: `claim-${c.id}`,
        claimId: c.id,
        title: "Yếu tố bổ sung",
        text: c.text,
        basis: {
          factor: c.factIds
            .map(
              (id) => p.execution.derivedFacts.find((f) => f.id === id)?.text,
            )
            .join(" "),
          sources: c.rules.flatMap((r) =>
            r.sourceReferences.map((s) => ({
              title: s.title,
              url: s.url,
              location: s.location,
            })),
          ),
          conditions: "Chỉ mô tả nhãn và yếu tố đang được ghi nhận.",
          limits: c.rules.flatMap((r) => r.limitations).join(" "),
        },
      })),
      {
        id: "overview-limits",
        claimId: null,
        title: "Phần chưa đủ căn cứ",
        text: t.synthesis,
        basis: {
          factor: "Phạm vi nội dung hiện có",
          sources: [],
          conditions: "Không cộng nghĩa từng sao thành kết luận tổ hợp.",
          limits: t.limits,
        },
      },
    ],
  };
}
