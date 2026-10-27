import fs from "node:fs/promises";
import path from "node:path";
import { catalog } from "../interpretation-rules/catalog";
import { tanBienRules } from "../interpretation-rules/profile-rules";
import { CHART_BRANCHES } from "../tuvi-engine/chart-integrity";
import type { InternalReading } from "../internal-review/reading-store";
import type { Knowledge, MenhInput } from "./contract";
const themes = new Set(["action", "learning", "initiative"]);
/** Bounded lexical retrieval over processed catalog/source records, not PDFs.
 * Conditions and unresolved exceptions travel with every reference-only item. */
export async function retrieveMenhKnowledge(
  record: InternalReading,
  input: MenhInput,
): Promise<MenhInput> {
  const life = record.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!,
    stars = [
      ...life.majorStars,
      ...life.minorStars,
      ...life.adjectiveStars,
    ].map((s) => s.name);
  const matched = new Set(
    record.frozen.continuousReport?.palaces
      .find((p) => p.name === "Mệnh")
      ?.groups.flatMap((g) =>
        g.members.flatMap((m) => m.claim.rules.map((r) => r.id)),
      ) ?? [],
  );
  const at = CHART_BRANCHES.indexOf(life.earthlyBranch),
    contextStars = record.snapshot.chart.palaces
      .filter((p) =>
        [4, 6, 8].some(
          (n) => p.earthlyBranch === CHART_BRANCHES[(at + n) % 12],
        ),
      )
      .flatMap((p) => [...p.majorStars, ...p.minorStars].map((s) => s.name));
  const candidates = (
    record.snapshot.chart.tanBien ? tanBienRules(record.snapshot) : catalog
  ).filter(
    (r) =>
      r.kind === "interpretation" &&
      r.origin !== "synthetic" &&
      r.status !== "retired" &&
      r.topic === "overview" &&
      r.requiredEngineProfile.some(
        (p) => p === record.snapshot.normalized.profile,
      ) &&
      r.presentation &&
      (themes.has(r.presentation.readingTheme || "") ||
        /^(tanbien|npl)\.life-(?!body-career|body-wealth)/.test(r.id)),
  );
  const scored = candidates
    .map((r) => ({
      r,
      score:
        stars.filter((s) =>
          JSON.stringify([
            r.claimTemplate,
            r.presentation?.sourceConditions,
            r.presentation?.title,
          ]).includes(s),
        ).length *
          2 +
        contextStars.filter((s) => r.claimTemplate.includes(s)).length +
        (matched.has(r.id) ? 5 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.r.id.localeCompare(b.r.id))
    .slice(0, 12);
  const knowledge: Knowledge[] = scored.map(({ r }) => ({
    id: "catalog:" + r.id + "@" + r.version,
    title: r.presentation!.title,
    text: r.claimTemplate,
    conditions: [
      ...(r.presentation?.sourceConditions ?? []),
      r.presentation!.applicability,
    ],
    predicate: { conditions: r.conditions, exceptions: r.exceptions },
    limits: [
      ...r.limitations,
      ...r.presentation!.knownExceptions,
      ...r.presentation!.unknownConditions,
      ...(r.presentation?.projectScope ?? []),
    ],
    references: r.sourceReferences.map((s) => ({
      title: s.title,
      location: s.location,
    })),
    selection: matched.has(r.id) ? "matched-saved-context" : "reference-only",
  }));
  const root =
    process.env.AI_KNOWLEDGE_DIR ||
    path.resolve(".local/source-library/knowledge");
  const ids = [
    "inherited-NPL-01",
    "inherited-NPL-07",
    "inherited-NPL-11",
    "inherited-NPL-15",
    ...(life.majorStars.length === 0 ? ["inherited-NPL-16"] : []),
  ];
  for (const id of ids) {
    try {
      const r = JSON.parse(
        await fs.readFile(path.join(root, "records", id + ".json"), "utf8"),
      );
      if (
        typeof r.source_paraphrase !== "string" ||
        !Array.isArray(r.references)
      )
        continue;
      knowledge.push({
        id: "knowledge:" + id,
        title: String(r.title),
        text: r.source_paraphrase.slice(0, 2400),
        conditions: [r.conditions, r.inputs].filter(
          (x) => typeof x === "string",
        ),
        limits: [
          r.exceptions,
          r.unresolved,
          "Hồ sơ tóm tắt phương pháp; không phải nguyên văn hoặc chứng nhận kết luận.",
        ].filter((x) => typeof x === "string"),
        references: r.references
          .filter(
            (x: any) =>
              typeof x.book === "string" && Array.isArray(x.pdf_pages),
          )
          .map((x: any) => ({
            title: `${r.author} — ${{ npl: "Tử Vi Tổng Hợp", hs: "Tử Vi Hàm Số" }[x.book as "npl" | "hs"] || x.book}; hồ sơ ${r.title}`,
            location:
              "Trang PDF " +
              x.pdf_pages.join(", ") +
              "; nguồn theo hồ sơ đã lưu, không tự đồng nhất trang in.",
          })),
        selection: "reference-only",
      });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT")
        throw Error("AI_KNOWLEDGE_INVALID");
    }
  }
  return { ...input, knowledge };
}
