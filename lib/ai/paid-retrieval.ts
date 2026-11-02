import { selectPaidContext, type ContextMetadata } from "./paid-context";
import fs from "node:fs";
import path from "node:path";
import type { InternalReading } from "../internal-review/reading-store";
import { executeRules } from "../interpretation-rules/execute";
import { tanBienRules } from "../interpretation-rules/profile-rules";
import { ruleReference, unresolvedTemplate } from "./v1-editorial";
import { paidRelations } from "./paid-facts";
import { paidLibrary } from "./paid-library";
import { paidFacts } from "./paid-facts";
import { paidBookKnowledge } from "./paid-book-knowledge";
import { paidBookContexts } from "./paid-book-context";
import type { Knowledge } from "./contract";
import { reviewPaidSource } from "./paid-source-fidelity";
export const PAID_THEMES: Record<string, string[]> = {
  "Quan Lộc": ["work"],
  "Tài Bạch": ["finance"],
  "Phu Thê": ["spouse"],
  "Phụ Mẫu": ["parents"],
  "Phúc Đức": ["phuc"],
  "Điền Trạch": ["dien"],
  "Nô Bộc": ["no"],
  "Thiên Di": ["di"],
  "Tử Nữ": ["children"],
  "Huynh Đệ": ["siblings"],
  "Tật Ách": [],
  Mệnh: ["action", "learning", "initiative"],
};
export function paidKnowledge(record: InternalReading, target: string) {
  const sections = record.frozen.customerReport!.sections,
    relations = paidRelations(record, target);
  const saved = sections.flatMap((s) =>
    s.paragraphs.flatMap((p) => p.members?.flatMap((m) => m.claim.rules) || []),
  );
  const rules = [
    ...new Map(
      [...tanBienRules(record.snapshot), ...saved].map((r) => [r.id, r]),
    ).values(),
  ];
  const execution = executeRules(record.snapshot, rules, "internal-draft");
  const matched = new Map(
    execution.previewClaims.flatMap((c) =>
      c.rules.map((r) => [r.id, { r, text: c.text }] as const),
    ),
  );
  const contextMetadata = new Map<string, ContextMetadata>();
  const items: Knowledge[] = [],
    excluded: { id: string; reason: string }[] = [],
    covered = new Set<string>(),
    texts = new Set<string>();
  const subjects = (themes: string[]) =>
    Object.keys(PAID_THEMES).filter((p) =>
      PAID_THEMES[p].some((t) => themes.includes(t)),
    );
  const classify = (rs: typeof rules) => {
    const themes = rs.map((r) => r.presentation?.readingTheme || "");
    if (themes.every((t) => PAID_THEMES[target].includes(t))) return "direct";
    const ps = subjects(themes);
    if (
      ps.length &&
      ps.every((p) => ["trine", "opposition"].includes(relations.get(p) || ""))
    )
      return "context";
    return "outside";
  };
  const add = (k: Knowledge) => {
    k = reviewPaidSource(k, target);
    if (unresolvedTemplate([k.text, ...k.conditions, ...k.limits].join(" "))) {
      excluded.push({
        id: k.id,
        reason: "unresolved-template-in-source-metadata",
      });
      return;
    }
    if (texts.has(k.id)) return;
    texts.add(k.id);
    items.push(k);
  };
  for (const section of sections)
    for (const p of section.paragraphs) {
      const rs = p.members?.flatMap((m) => m.claim.rules) || [];
      if (!rs.length) {
        excluded.push({ id: p.id, reason: "no-source-rule" });
        continue;
      }
      if (unresolvedTemplate(p.text)) {
        excluded.push({ id: p.id, reason: "unresolved-template" });
        continue;
      }
      if (
        !rs.every(
          (r) => matched.has(r.id) && !r.presentation?.conditionalAssessment,
        )
      ) {
        excluded.push({
          id: p.id,
          reason: "condition-exception-conflict-or-unknown",
        });
        continue;
      }
      const scope = classify(rs);
      if (scope === "outside") {
        excluded.push({
          id: p.id,
          reason:
            "outside-topic-or-tam-phuong; shared section is not authority",
        });
        continue;
      }
      const k = ruleReference(
        rs[0],
        p.text,
        "matched-v1-editorial",
        record.frozen.customerReport!.version,
      );
      k.id = "paid-v1." + p.id;
      k.conditions = rs.flatMap((r) => [
        ...(r.presentation?.sourceConditions || []),
        r.presentation!.applicability,
      ]);
      k.limits = rs.flatMap((r) => [
        ...r.limitations,
        ...(r.presentation?.knownExceptions || []),
        ...(r.presentation?.unknownConditions || []),
      ]);
      k.references = rs.flatMap((r) =>
        r.sourceReferences.map((x) => ({
          title: x.title,
          location: x.location,
        })),
      );
      k.provenance = {
        ruleIds: rs.map((r) => r.id),
        ruleStatuses: rs.map((r) => r.status),
        sourceVersion: record.frozen.customerReport!.version,
        certification: "editorial-reference-not-expert-approved",
      };
      k.group =
        scope === "direct"
          ? rs.every((r) =>
              ["element-gloss", "combination"].includes(
                r.presentation!.contentType,
              ),
            )
            ? "B"
            : "A"
          : "C";
      k.application = scope === "direct" ? "direct" : "context";
      k.subjectPalaces = subjects(
        rs.map((r) => r.presentation!.readingTheme || ""),
      );
      contextMetadata.set(k.id, {
        themes: rs.map((r) => r.presentation!.readingTheme || ""),
        types: rs.map((r) => r.presentation!.contentType),
      });
      add(k);
      rs.forEach((r) => covered.add(r.id));
    }
  for (const { r, text } of matched.values()) {
    if (
      covered.has(r.id) ||
      !r.presentation ||
      r.kind !== "interpretation" ||
      r.origin === "synthetic" ||
      r.status === "retired"
    )
      continue;
    const scope = classify([r]);
    if (scope === "outside") continue;
    if (unresolvedTemplate(text) || r.presentation.conditionalAssessment) {
      excluded.push({ id: r.id, reason: "unresolved-or-unknown-assessment" });
      continue;
    }
    const k = ruleReference(r, text, "matched-snapshot", execution.ruleSetHash);
    k.group = scope === "direct" ? "B" : "C";
    k.application = scope === "direct" ? "direct" : "context";
    k.subjectPalaces = subjects([r.presentation.readingTheme || ""]);
    contextMetadata.set(k.id, {
      themes: [r.presentation.readingTheme || ""],
      types: [r.presentation.contentType],
    });
    add(k);
  }
  // A failed evaluator branch is NEVER reintroduced as a personal claim.
  for (const t of execution.traces) {
    const r = rules.find((r) => r.id === t.ruleId);
    if (r?.presentation && classify([r]) === "direct" && t.status !== "matched")
      excluded.push({ id: r.id, reason: t.status });
  }
  // Bounded existing method records, no PDF reads, keyword matching or new rule language.
  const root =
    process.env.AI_KNOWLEDGE_DIR ||
    path.resolve(".local/source-library/knowledge");
  const targetPalace = record.snapshot.chart.palaces.find(
    (p) => p.name === target,
  );
  const storedRings = targetPalace as
    | { boshi12?: string; suiqian12?: string }
    | undefined;
  // Method-only context selected by a stored anchor, never a new personal rule.
  const specificMethod =
    target === "Tài Bạch" &&
    ["Đại Hao", "Tiểu Hao"].includes(storedRings?.boshi12 || "")
      ? "inherited-NPL-27"
      : target === "Quan Lộc" &&
          storedRings?.suiqian12 === "Bạch Hổ" &&
          storedRings?.boshi12 === "Tấu Thư"
        ? "inherited-NPL-33"
        : "inherited-NPL-15";
  const topicMethods: Record<string, string[]> = {
    "Quan Lộc": ["inherited-NPL-42", specificMethod],
    "Tài Bạch": ["inherited-NPL-22", specificMethod],
    "Phu Thê": ["inherited-NPL-45", "inherited-NPL-15"],
    "Nô Bộc": ["inherited-NPL-02", "inherited-NPL-42"],
    "Tử Nữ": ["inherited-NPL-46", "inherited-NPL-07"],
  };
  for (const id of [
    "inherited-NPL-01",
    ...(topicMethods[target] || ["inherited-NPL-07", specificMethod]),
  ]) {
    const file = path.join(root, "records", id + ".json");
    if (!fs.existsSync(file)) continue;
    const r = JSON.parse(fs.readFileSync(file, "utf8"));
    if (
      typeof r.source_paraphrase !== "string" ||
      unresolvedTemplate(r.source_paraphrase)
    )
      continue;
    const references = (r.references || [])
      .filter(
        (x: any) =>
          ["npl", "hs"].includes(x.book) && Array.isArray(x.pdf_pages),
      )
      .map((x: any) => ({
        title: `${r.author} — ${x.book === "npl" ? "Tử Vi Tổng Hợp" : "Tử Vi Hàm Số"}`,
        location: "Trang PDF " + x.pdf_pages.join(", ") + "; hồ sơ " + id,
      }));
    if (!references.length) continue;
    add({
      id: "paid-method." + id,
      title: r.title,
      text: r.source_paraphrase,
      conditions: [r.conditions, r.inputs].filter((x) => typeof x === "string"),
      limits: [
        r.exceptions,
        r.unresolved,
        "Chỉ tham khảo phương pháp; không phải lời áp trực tiếp hoặc quy tắc chế hóa đã xác nhận.",
      ].filter((x) => typeof x === "string"),
      references,
      selection: "background-method",
      group: "D",
      application: "reference-only",
      subjectPalaces: [],
    });
  }
  for (const k of paidBookKnowledge(record, target)) add(k);
  const library = paidLibrary(paidFacts(record, target), target);
  for (const replacement of library.replacements) {
    const oldIndex = items.findIndex((k) => k.id === replacement.oldId);
    if (oldIndex >= 0) {
      items.splice(oldIndex, 1);
      excluded.push({
        id: replacement.oldId,
        reason: "equivalent-reviewed-passage:" + replacement.newId,
      });
    }
  }
  for (const k of library.items) add(k);
  excluded.push(...library.excluded);
  const bookContexts = paidBookContexts(record, target);
  for (const k of bookContexts.items) {
    contextMetadata.set(k.id, {
      themes: PAID_THEMES[k.contextOrigin!.palace] || [],
      types: ["context"],
    });
    add(k);
  }
  excluded.push(...bookContexts.excluded);
  const hasLibraryMethod = library.items.some(
    (k) => k.passage?.kind === "method",
  );
  const topicMethodIds = new Set(
    (topicMethods[target] || []).map((id) => "paid-method." + id),
  );
  const ranked = items.sort(
    (a, b) =>
      a.group!.localeCompare(b.group!) ||
      Number(b.passage?.kind === "method") -
        Number(a.passage?.kind === "method") ||
      (hasLibraryMethod
        ? Number(topicMethodIds.has(b.id)) - Number(topicMethodIds.has(a.id))
        : 0) ||
      Number(b.selection === "matched-v1-editorial") -
        Number(a.selection === "matched-v1-editorial") ||
      a.id.localeCompare(b.id),
  );
  const contextSelection = selectPaidContext(
    ranked.filter((k) => k.group === "C"),
    target,
    contextMetadata,
  );
  const selected = (["A", "B", "C", "D"] as const).flatMap((g) =>
    g === "C"
      ? contextSelection.items
      : ranked
          .filter((k) => k.group === g)
          .slice(0, g === "A" ? 12 : g === "B" ? 10 : 3),
  );
  for (const k of ranked)
    if (!selected.includes(k))
      excluded.push({
        id: k.id,
        reason:
          k.group === "C"
            ? contextSelection.decisions.find((d) => d.id === k.id)!.reason
            : "bounded-context-budget",
      });
  return {
    items: selected,
    excluded,
    ruleSetHash: execution.ruleSetHash,
    contextSelection,
    contextMetadata,
  };
}
