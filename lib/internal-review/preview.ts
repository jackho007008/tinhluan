import type { ReportData } from "../reports";
import { customerReport } from "../reading/customer";
import { catalog, RULESET_VERSION } from "../interpretation-rules/catalog";
import { executeRules } from "../interpretation-rules/execute";
export function internalPreview(report: ReportData) {
  // Scope only changes in this read-only view, never in the delivered report.
  const reading = customerReport({
    ...report,
    scope: { groups: ["Tổng quan", "Sự nghiệp & tài lộc"], year: null },
  });
  const execution = executeRules(report.snapshot, catalog, "internal-draft");
  const notes = execution.previewClaims
    .filter((c) => c.rules.some((r) => r.kind === "interpretation"))
    .map((c) => {
      const r = c.rules[0];
      return {
        id: r.id,
        claimId: c.id,
        version: r.version,
        // The legacy reader groups work and finance together; claim scope stays unchanged.
        topic: ["work", "finance"].includes(r.presentation?.readingTheme || "") ? "career" : c.topic,
        title:
          r.presentation?.title ||
          (r.topic === "overview"
            ? "Thiên Đồng: chú giải truyền thống"
            : "Phạm vi đọc cung Quan Lộc"),
        text: c.text,
        factor: c.factIds
          .map((id) => execution.derivedFacts.find((f) => f.id === id)?.text)
          .join(" · "),
        source: r.sourceReferences[0],
        sources: r.sourceReferences,
        condition: r.presentation?.applicability || c.reasons.join("; "),
        adjustment: r.presentation?.sourceScope || "Chú giải riêng yếu tố.",
        missing: [
          ...new Set([
            ...r.limitations,
            ...(r.presentation?.unknownConditions || []),
          ]),
        ].join(" "),
        claim: c,
      };
    });
  const moved = new Set(
    execution.previewClaims.flatMap((c) =>
      c.rules.flatMap((r) => r.presentation?.moveToDetails || []),
    ),
  );
  const glossaryIds = new Set([
    "reading.overview.pojun",
    "reading.overview.qisha",
  ]);
  const blockedPojun = execution.traces.some(
    (trace) =>
      trace.ruleId.startsWith("combination.ziwei-assistants") &&
      trace.status === "exception" &&
      trace.details.some((detail) => {
        const condition = JSON.parse(detail) as {
          fact?: string;
          value?: string;
        };
        return (
          condition.fact === "fact.life-stars" && condition.value === "Phá Quân"
        );
      }),
  );
  return {
    label: "Bản nháp nội bộ — chưa kiểm duyệt",
    version: "reading-preview-2.3.0",
    contentVersion: RULESET_VERSION,
    reading,
    execution,
    notes,
    topics: reading.topics.map((t) => ({
      ...t,
      notes: notes.filter((n) => n.topic === t.id),
      mainNotes: notes
        .filter(
          (n) => n.topic === t.id && !moved.has(n.id) && !glossaryIds.has(n.id),
        )
        .sort(
          (a, b) =>
            Number(
              b.claim.rules.some(
                (r) => r.presentation?.contentType === "combination",
              ),
            ) -
            Number(
              a.claim.rules.some(
                (r) => r.presentation?.contentType === "combination",
              ),
            ),
        ),
      supportingFacts:
        t.id === "overview"
          ? execution.derivedFacts
              .filter(
                (f) =>
                  f.id === "fact.life-minor-stars" ||
                  f.id === "fact.life-local-sat-stars",
              )
              .map((f) => ({
                id: f.id,
                evidencePaths: f.evidencePaths,
                text: `${f.id === "fact.life-minor-stars" ? "Phụ tinh được ghi nhận tại Mệnh" : "Trong nhóm Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tại Mệnh"}: ${Array.isArray(f.value) && f.value.length ? f.value.map((name) => (name === "Tả Phù" ? "Tả Phụ (Tả Phù trong dữ liệu)" : name)).join(", ") : "không ghi nhận trong danh sách đang có"}.`,
              }))
          : [],
      glossaryNotes: notes.filter(
        (n) => n.topic === t.id && glossaryIds.has(n.id),
      ),
      readingGuide:
        t.id === "overview"
          ? "Bản đọc bắt đầu từ các yếu tố tại Mệnh. Phần diễn giải dưới đây giữ riêng ý nghĩa có nguồn của từng yếu tố; khi có quan hệ phối hợp đủ điều kiện, quan hệ đó được trình bày trước."
          : null,
      scopeGaps:
        t.id === "overview" && blockedPojun
          ? [
              "Có Phá Quân cùng Tử Vi tại Mệnh: phần tổng hợp chủ tinh–phụ tá tạm dừng vì chưa đặc tả quan hệ Tử Vi–Phá Quân. Các chú giải riêng vẫn đọc được; đây là giới hạn nội dung, không phải đánh giá xấu về lá số.",
            ]
          : [],
      detailNotes: notes.filter((n) => n.topic === t.id && moved.has(n.id)),
      unexplainedStars:
        t.id === "overview"
          ? t.stars
              .filter(
                (star) =>
                  !execution.previewClaims.some(
                    (c) =>
                      c.topic === "overview" &&
                      c.rules.some(
                        (r) =>
                          r.kind === "interpretation" &&
                          r.presentation?.contentType !== "method-gloss" &&
                          r.conditions.some(
                            (condition) =>
                              condition.fact === "fact.life-stars" &&
                              condition.op === "includes" &&
                              condition.value === star.name,
                          ),
                      ),
                  ),
              )
              .map((s) => s.name)
          : [],
      adjustments: execution.previewClaims.filter(
        (c) =>
          c.topic === t.id &&
          c.rules.some((r) => r.presentation?.contentType === "context"),
      ),
      synthesis:
        "Phần đọc hiện chưa bao quát hội chiếu, tương tác giữa các chính tinh và ảnh hưởng của hệ nhãn trạng thái. Những phần đó cần đặc tả riêng trước khi có thể tổng hợp thành một cách đọc toàn lá số.",
    })),
    status: "draft",
    reviewer: null,
    limitations:
      "Bản đọc thử được sinh bằng template từ kết quả rule evaluator, không dùng AI. Chú giải truyền thống chưa được chuyên gia duyệt; bản chép và quyền chuyển ngữ còn chờ xác minh. Chỉ dùng nội bộ, không phải kết luận về tính cách, nghề nghiệp hoặc cuộc đời.",
  };
}
