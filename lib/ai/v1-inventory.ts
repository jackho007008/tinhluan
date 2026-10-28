import type { InternalReading } from "../internal-review/reading-store";
import { TANBIEN_MENH_SOURCE_IDS } from "../internal-review/tanbien-reading";
import { catalog, RULESET_VERSION } from "../interpretation-rules/catalog";
import { subjectOf } from "../exploration/model";
import { freeMenhParagraphs } from "./free-menh";
import { v1EditUnit } from "./v1-edit";
import { contentHash } from "./v1-edit-storage";
import { v1SourceContext, sourceContextId } from "./v1-review-store";

const words = (s: string) =>
  new Set(
    s
      .normalize("NFC")
      .toLocaleLowerCase("vi")
      .match(/[\p{L}\p{N}]+/gu) || [],
  );
export function v1TextSimilarity(left: string, right: string) {
  const a = words(left),
    b = words(right),
    intersection = [...a].filter((w) => b.has(w)).length;
  return a.size + b.size - intersection
    ? intersection / (a.size + b.size - intersection)
    : 0;
}
/** Inventory is bounded by caller-provided snapshots. It never calls a model,
 * invents an applicable rule or merges similar wording across conditions. */
export function inventoryV1Menh(
  samples: { label: string; record: InternalReading }[],
) {
  const ids = new Set(TANBIEN_MENH_SOURCE_IDS);
  const templates = catalog
    .filter(
      (r) =>
        ids.has(r.id) &&
        r.kind === "interpretation" &&
        r.origin !== "synthetic" &&
        r.status !== "retired",
    )
    .map((r) => ({
      id: r.id,
      version: r.version,
      subject: subjectOf({ factIds: r.requiredFacts }),
      heldFromFree: /^(tanbien|npl)\.life-body-/.test(r.id),
      text: r.claimTemplate,
      conditions: r.conditions,
      exceptions: r.exceptions,
      sourceConditions: r.presentation?.sourceConditions || [],
      applicability: r.presentation?.applicability || null,
      sources: r.sourceReferences,
      sourceStatus: r.status,
      limitations: r.limitations,
      unknowns: r.presentation?.unknownConditions || [],
      needsRendering: /\{\{/.test(r.claimTemplate),
    }));
  const units = new Map<
    string,
    {
      id: string;
      source: ReturnType<typeof v1SourceContext>;
      unit: ReturnType<typeof v1EditUnit>;
      seenIn: string[];
      occurrences: { sample: string; paragraphId: string }[];
    }
  >();
  const seenRules = new Set<string>();
  const coverage = samples.map(({ label, record }) => {
    const life = record.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!,
      paragraphs = freeMenhParagraphs(record),
      ruleIds = [
        ...new Set(
          paragraphs.flatMap((p) =>
            p.members.flatMap((m) => m.claim.rules.map((r) => r.id)),
          ),
        ),
      ];
    ruleIds.forEach((id) => seenRules.add(id));
    for (const p of paragraphs) {
      const unit = v1EditUnit(p, record.frozen.customerReport!.version),
        source = v1SourceContext(
          unit,
          record.frozen.customerReport!.catalogVersion,
        ),
        id = sourceContextId(source);
      const old = units.get(id);
      if (old) {
        old.seenIn.push(label);
        old.occurrences.push({ sample: label, paragraphId: p.id });
      } else
        units.set(id, {
          id,
          source,
          unit,
          seenIn: [label],
          occurrences: [{ sample: label, paragraphId: p.id }],
        });
    }
    const majorNames = life.majorStars.map((s) => s.name),
      specializedVoid = ruleIds.filter((id) =>
        /empty-life|empty-trine|vcd/.test(id),
      );
    return {
      label,
      branch: life.earthlyBranch,
      majorStars: majorNames,
      voidMajor: !majorNames.length,
      freeParagraphs: paragraphs.length,
      ruleIds,
      specializedVoidRules: specializedVoid,
      voidElementMethodRules: ruleIds.filter(
        (id) => id === "npl.life-foundation-empty",
      ),
      majorNamesAbsentFromFreeText: majorNames.filter(
        (n) => !paragraphs.some((p) => p.text.includes(n)),
      ),
      heldGroups: record.accessPolicy?.heldGroups || [],
      sourceGaps: record.frozen.continuousReport?.lifeGaps || [],
      partial: true,
      scope:
        "Only matched free V1; paragraph count is not complete Mệnh interpretation.",
    };
  });
  const rendered = [...units.values()];
  const exact = new Map<string, string[]>();
  for (const u of rendered) {
    const key = contentHash(u.unit.text);
    exact.set(key, [...(exact.get(key) || []), u.id]);
  }
  const near: {
    left: string;
    right: string;
    similarity: number;
    sameConditions: boolean;
  }[] = [];
  for (let i = 0; i < rendered.length; i++)
    for (let j = i + 1; j < rendered.length; j++) {
      const l = rendered[i],
        r = rendered[j];
      if (l.unit.text === r.unit.text) continue;
      const similarity = v1TextSimilarity(l.unit.text, r.unit.text);
      if (similarity >= 0.82)
        near.push({
          left: l.id,
          right: r.id,
          similarity,
          sameConditions:
            contentHash(l.unit.conditions) === contentHash(r.unit.conditions),
        });
    }
  return {
    version: "menh-v1-inventory-1.0.0",
    catalogVersion: RULESET_VERSION,
    sampleCount: samples.length,
    templateCount: templates.length,
    menhSubjectTemplates: templates.filter((t) => t.subject === "Mệnh").length,
    freeCandidateTemplates: templates.filter(
      (t) => t.subject === "Mệnh" && !t.heldFromFree,
    ).length,
    renderedUnitCount: rendered.length,
    templates,
    units: rendered,
    coverage,
    observedRuleIds: [...seenRules].sort(),
    heldTemplateIds: templates.filter((t) => t.heldFromFree).map((t) => t.id),
    unobservedFreeTemplateIds: templates
      .filter(
        (t) => t.subject === "Mệnh" && !t.heldFromFree && !seenRules.has(t.id),
      )
      .map((t) => t.id),
    unobservedTemplateIds: templates
      .filter((t) => !seenRules.has(t.id))
      .map((t) => t.id),
    exactTextDifferentContext: [...exact.values()].filter(
      (ids) => ids.length > 1,
    ),
    nearDuplicates: near.sort((a, b) => b.similarity - a.similarity),
    note: "Templates are not rendered units. Unobserved is not unreachable. Similarity is a review hint, never permission to merge or infer AND/OR.",
  };
}
