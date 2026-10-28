import type { InternalReading } from "../internal-review/reading-store";
import { receiptMatches } from "../internal-review/dynamic-reading";
import { executeRules } from "../interpretation-rules/execute";
import type { Rule } from "../interpretation-rules/schema";
import type { Knowledge, MenhInput } from "./contract";

/** Scope is about the subject, not all palaces appearing as evidence. */
export function isMenhReference(r: Rule) {
  return (
    r.kind === "interpretation" &&
    r.origin !== "synthetic" &&
    r.status !== "retired" &&
    r.topic === "overview" &&
    !!r.presentation &&
    (["action", "learning", "initiative"].includes(
      r.presentation.readingTheme || "",
    ) ||
      /^(tanbien|npl)\.life-/.test(r.id)) &&
    !/^npl\.life-body-(career|wealth)$/.test(r.id) &&
    r.requiredFacts.some(
      (id) => id.startsWith("fact.life-") || id.startsWith("fact.tanbien-"),
    )
  );
}
export const unresolvedTemplate = (s: string) => /\{\{|\}\}/.test(s);
const unique = (v: string[]) => [...new Set(v.filter(Boolean))];
export function ruleReference(
  r: Rule,
  text: string,
  selection: Knowledge["selection"],
  sourceVersion: string,
): Knowledge {
  return {
    id: `catalog:${r.id}@${r.version}`,
    title: r.presentation!.title,
    text,
    conditions: unique([
      ...(r.presentation!.sourceConditions || []),
      r.presentation!.applicability,
    ]),
    limits: unique([
      ...r.limitations,
      ...r.presentation!.knownExceptions,
      ...r.presentation!.unknownConditions,
    ]),
    references: r.sourceReferences.map((s) => ({
      title: s.title,
      location: s.location,
    })),
    selection,
    provenance: {
      ruleIds: [r.id],
      ruleStatuses: [r.status],
      sourceVersion,
      certification: "editorial-reference-not-expert-approved",
    },
  };
}
/** Reads the already rendered, matched Mệnh groups from this immutable report.
 * Reuses the evaluator to check saved rule conditions; never recomposes V1. */
export function v1MenhEditorial(record: InternalReading) {
  if (
    !record.frozen.verified ||
    !receiptMatches(record.snapshot, record.receipt)
  )
    throw Error("AI_UNVERIFIED_SNAPSHOT");
  const report = record.frozen.continuousReport;
  const empty = (status: "absent" | "mismatch", note: string) => ({
    items: [] as Knowledge[],
    coveredRuleIds: new Set<string>(),
    coverage: {
      version: report?.version || null,
      status,
      totalGroups: 0,
      acceptedGroups: 0,
      excludedGroups: 0,
      note,
    } as NonNullable<MenhInput["editorial"]>,
  });
  if (!report)
    return empty(
      "absent",
      "Bản lưu không có phần Mệnh V1; dùng dữ kiện lá số và tri thức phù hợp.",
    );
  const life = record.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
  const palace = report.palaces.find((p) => p.name === "Mệnh");
  if (
    report.snapshotId !== record.snapshot.resultId ||
    record.frozen.reading.snapshotId !== record.snapshot.resultId ||
    palace?.branch !== life.earthlyBranch ||
    JSON.stringify([...(palace?.facts?.major || [])].sort()) !==
      JSON.stringify(life.majorStars.map((s) => s.name).sort())
  )
    return empty(
      "mismatch",
      "Không dùng phần Mệnh V1 vì định danh hoặc cấu trúc không khớp bản lưu đang xử lý.",
    );
  const rules = [
    ...new Map(
      palace.groups
        .flatMap((g) => g.members.flatMap((m) => m.claim.rules))
        .map((r) => [r.id, r]),
    ).values(),
  ];
  const execution = executeRules(record.snapshot, rules, "internal-draft");
  const matched = new Set(
    execution.previewClaims.flatMap((c) =>
      c.rules.map((r) => `${r.id}@${r.version}`),
    ),
  );
  const items: Knowledge[] = [];
  const coveredRuleIds = new Set<string>();
  for (const group of palace.groups) {
    const rs = group.members.flatMap((m) => m.claim.rules);
    if (
      !rs.length ||
      !group.text.trim() ||
      unresolvedTemplate(group.text) ||
      !rs.every(
        (r) => isMenhReference(r) && matched.has(`${r.id}@${r.version}`),
      ) ||
      !group.members.every((m) => m.traces.some((t) => t.status === "matched"))
    )
      continue;
    const refs = [
      ...new Map(
        rs
          .flatMap((r) => r.sourceReferences)
          .map((r) => [
            r.title + "|" + r.location,
            { title: r.title, location: r.location },
          ]),
      ).values(),
    ];
    if (!refs.length) continue;
    items.push({
      id: `v1:${report.version}:${group.id}`,
      title: group.readerTitles.join(" · ") || "Luận Mệnh V1 đã lưu",
      text: group.text,
      conditions: unique(
        rs.flatMap((r) => [
          ...(r.presentation?.sourceConditions || []),
          r.presentation!.applicability,
        ]),
      ),
      limits: unique([
        ...rs.flatMap((r) => [
          ...r.limitations,
          ...(r.presentation?.knownExceptions || []),
          ...(r.presentation?.unknownConditions || []),
        ]),
        ...group.notes,
        "Nội dung biên tập có nguồn, chưa phải chứng nhận chuyên môn hoặc xác nhận đời sống người đọc.",
      ]),
      references: refs,
      selection: "matched-v1-editorial",
      provenance: {
        ruleIds: unique(rs.map((r) => r.id)),
        ruleStatuses: unique(rs.map((r) => r.status)),
        sourceVersion: report.version,
        certification: "editorial-reference-not-expert-approved",
      },
    });
    rs.forEach((r) => coveredRuleIds.add(r.id));
  }
  return {
    items,
    coveredRuleIds,
    coverage: {
      version: report.version,
      status: "available" as const,
      totalGroups: palace.groups.length,
      acceptedGroups: items.length,
      excludedGroups: palace.groups.length - items.length,
      note: "Chỉ lấy văn Mệnh đã lưu và còn khớp điều kiện; giữ điều kiện, ngoại lệ và trạng thái thẩm định. Không tự xác nhận đủ mọi phương diện Mệnh.",
    },
  };
}
