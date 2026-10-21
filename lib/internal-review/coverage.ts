import { catalog, RULESET_VERSION } from "../interpretation-rules/catalog";
import type { Rule } from "../interpretation-rules/schema";
import { samples, loadSample, SAMPLE_VERSION } from "./samples";
import { internalPreview } from "./preview";
import type { ReportData } from "../reports";
export const COVERAGE_VERSION = "content-coverage-1.1.0";
// Audit of two legacy rules without presentation metadata. Fail closed for unknown types.
export function contentClass(r: Rule) {
  if (r.kind === "fact") return "fact";
  if (r.id === "draft.overview.tong") return "single";
  if (r.id === "draft.career.palace") return "method";
  if (r.presentation?.contentType === "combination") return "combination";
  if (r.presentation?.contentType === "element-gloss") return "single";
  return "method"; // method/context/general prose never inflates substantive coverage
}
export function measureSample(
  report: ReportData,
  sample: (typeof samples)[number],
) {
  const p = internalPreview(report),
    e = p.execution;
  const matched = new Set(
    e.traces.filter((t) => t.status === "matched").map((t) => t.ruleId),
  );
  const count = (kind: ReturnType<typeof contentClass>) =>
    e.rules.filter((r) => matched.has(r.id) && contentClass(r) === kind).length;
  const isSubstantive = (c: (typeof e.previewClaims)[number]) =>
    c.rules.some((r) => ["single", "combination"].includes(contentClass(r)));
  const visible = [
    ...new Map(
      p.topics
        .flatMap((t) => [...t.mainNotes, ...t.detailNotes].map((n) => n.claim))
        .filter(isSubstantive)
        .map((c) => [c.id, c]),
    ).values(),
  ];
  const missing = e.traces.filter((t) =>
    ["missing-facts", "missing-evidence"].includes(t.status),
  );
  const topics = (["overview", "career"] as const).map((id) => {
    const t = p.topics.find((t) => t.id === id),
      claims = visible.filter((c) => c.topic === id);
    const failures = e.traces.filter(
      (x) =>
        e.rules.some((r) => r.id === x.ruleId && r.topic === id) &&
        ["missing-facts", "missing-evidence", "conflict-withheld"].includes(
          x.status,
        ),
    );
    return {
      id,
      displayed: claims.length,
      empty: !claims.length,
      reason: claims.length
        ? null
        : !t
          ? "Không có cung duy nhất để hiển thị chủ đề."
          : failures.length
            ? "Thiếu căn cứ hoặc bị chặn; xem trace. Chú giải phương pháp không được tính là nội dung theo yếu tố."
            : "Không có chú giải đơn/phối hợp khớp; dữ kiện và giới thiệu phương pháp không tính vào chỉ số này.",
      failures,
    };
  });
  return {
    id: sample.id,
    name: sample.name,
    kind: sample.kind,
    profile: report.snapshot.profile.id,
    engine: report.snapshot.versions.engine,
    rules: RULESET_VERSION,
    ruleSetHash: e.ruleSetHash,
    factsAvailable: e.derivedFacts.map((f) => f.id),
    missing,
    matchedRuleIds: [...matched],
    matchedFacts: count("fact"),
    matchedSingles: count("single"),
    matchedCombinations: count("combination"),
    matchedMethod: count("method"),
    displayed: visible.length,
    mainDisplayed: new Set(
      p.topics.flatMap((t) =>
        t.mainNotes.filter((n) => isSubstantive(n.claim)).map((n) => n.claimId),
      ),
    ).size,
    detailDisplayed: new Set(
      p.topics.flatMap((t) =>
        t.detailNotes
          .filter((n) => isSubstantive(n.claim))
          .map((n) => n.claimId),
      ),
    ).size,
    displayedClaimIds: visible.map((c) => c.id),
    displayedCombinations: visible.filter((c) =>
      c.rules.some((r) => contentClass(r) === "combination"),
    ).length,
    topics,
    unsupported: [
      ...new Set([
        ...p.topics.flatMap((t) =>
          t.unexplainedStars.map((s) => `Chưa có chú giải ${s} tại Mệnh`),
        ),
        "Chưa có tổng hợp toàn lá số được duyệt",
        "Chưa có nội dung được phép phát hành cho khách",
      ]),
    ],
    statusCounts: e.traces.reduce<Record<string, number>>((a, t) => {
      a[t.status] = (a[t.status] || 0) + 1;
      return a;
    }, {}),
  };
}
export type CoverageRow = ReturnType<typeof measureSample>;
export const coverageFilters = {
  all: "Tất cả mẫu",
  empty: "Không có chú giải đơn/phối hợp",
  single: "Chỉ có chú giải đơn",
  combination: "Có nhận định phối hợp",
  missing: "Thiếu dữ kiện",
  uncovered: "Rule chưa khớp mẫu nào",
} as const;
export function filterRows(rows: CoverageRow[], filter: string) {
  return rows.filter((r) =>
    filter === "empty"
      ? r.displayed === 0
      : filter === "single"
        ? r.displayed > 0 && r.displayedCombinations === 0
        : filter === "combination"
          ? r.displayedCombinations > 0
          : filter === "missing"
            ? r.missing.length > 0
            : true,
  );
}
export function summarize(rows: CoverageRow[]) {
  return ["engine", "synthetic"]
    .flatMap((kind) =>
      ["vn-utc7-midnight-v1", "cn-reference"].map((profile) => {
        const group = rows.filter(
          (r) => r.kind === kind && r.profile === profile,
        );
        return {
          kind,
          profile,
          numerator: group.filter((r) => r.displayed > 0).length,
          denominator: group.length,
          overviewNumerator: group.filter(
            (r) => r.topics.find((t) => t.id === "overview")!.displayed > 0,
          ).length,
        };
      }),
    )
    .filter((g) => g.denominator);
}
const targetStars = [
  "Tử Vi",
  "Thiên Cơ",
  "Thái Dương",
  "Vũ Khúc",
  "Thiên Đồng",
  "Liêm Trinh",
  "Thiên Phủ",
  "Thái Âm",
  "Tham Lang",
  "Cự Môn",
  "Thiên Tướng",
  "Thiên Lương",
  "Thất Sát",
  "Phá Quân",
];
export function catalogCoverage() {
  return [
    ...targetStars.map((name) => ({
      name,
      rules: catalog
        .filter(
          (r) =>
            r.status !== "retired" &&
            contentClass(r) === "single" &&
            r.conditions.some(
              (c) =>
                c.fact === "fact.life-stars" &&
                c.op === "includes" &&
                c.value === name,
            ),
        )
        .map((r) => ({ id: r.id, status: r.status, version: r.version })),
    })),
    {
      name: "Mệnh không chính tinh (giải thích phương pháp)",
      rules: catalog
        .filter(
          (r) => r.id === "reading.overview.empty" && r.status !== "retired",
        )
        .map((r) => ({ id: r.id, status: r.status, version: r.version })),
    },
  ];
}
export const readingSampleIds = [
  "vn-0",
  "vn-4",
  "vn-20",
  "engine-combo",
  "engine-exception",
  "vn-2",
];
export async function collectCoverage() {
  const rows: CoverageRow[] = [],
    readings = [];
  for (const sample of samples) {
    const loaded = (await loadSample(sample.id))!;
    rows.push(measureSample(loaded.report, sample));
    if (readingSampleIds.includes(sample.id)) {
      const p = internalPreview(loaded.report),
        t = p.topics.find((t) => t.id === "overview")!;
      readings.push({
        id: sample.id,
        name: sample.name,
        profile: loaded.report.snapshot.profile.id,
        engine: loaded.report.snapshot.versions.engine,
        input: sample.input,
        summary: t.summary,
        stars: t.stars,
        positions: t.positions,
        main: [...t.mainNotes, ...t.glossaryNotes],
        scopeGaps: t.scopeGaps,
        supportingFacts: t.supportingFacts,
        excluded: p.execution.traces.filter(
          (trace) =>
            trace.status !== "matched" &&
            catalog.some(
              (rule) =>
                rule.id === trace.ruleId &&
                rule.topic === "overview" &&
                rule.kind === "interpretation",
            ),
        ),
        details: t.detailNotes,
        adjustments: t.adjustments,
        unsupported: t.unexplainedStars,
        limit: p.limitations,
        synthesis: t.synthesis,
      });
    }
  }
  return {
    version: COVERAGE_VERSION,
    sampleVersion: SAMPLE_VERSION,
    ruleVersion: RULESET_VERSION,
    generatedAt: new Date().toISOString(),
    rows,
    summary: summarize(rows),
    catalog: catalogCoverage(),
    uncoveredRules: catalog
      .filter((r) => !rows.some((row) => row.matchedRuleIds.includes(r.id)))
      .map((r) => ({
        id: r.id,
        version: r.version,
        kind: contentClass(r),
        conditions: r.conditions,
      })),
    readings,
  };
}
