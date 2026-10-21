import { it, expect } from "vitest";
import {
  contentClass,
  catalogCoverage,
  measureSample,
  filterRows,
  summarize,
  collectCoverage,
} from "../lib/internal-review/coverage";
import { loadSample } from "../lib/internal-review/samples";
import { catalog } from "../lib/interpretation-rules/catalog";
import { internalPreview } from "../lib/internal-review/preview";
it("facts, general introduction and empty terminology do not inflate substantive claims", async () => {
  const s = (await loadSample("syn-empty"))!,
    r = measureSample(s.report, s.sample);
  expect(r.matchedFacts).toBeGreaterThan(0);
  expect(r.matchedMethod).toBeGreaterThan(0);
  expect(r.displayed).toBe(0);
  expect(
    contentClass(catalog.find((r) => r.id === "draft.career.palace")!),
  ).toBe("method");
  expect(
    contentClass(catalog.find((r) => r.id === "draft.overview.tong")!),
  ).toBe("single");
});
it("editorial details count once, missing facts and filters retain correct denominators", async () => {
  const a = (await loadSample("syn-combo"))!,
    b = (await loadSample("syn-missing-major"))!;
  const before = JSON.stringify(a.report),
    r = measureSample(a.report, a.sample),
    m = measureSample(b.report, b.sample);
  expect(r.matchedCombinations).toBe(1);
  expect(r.displayed).toBe(3);
  // The new Tân Biên base gloss remains separate from the Toàn Thư combination.
  expect(r.mainDisplayed).toBe(2);
  expect(r.detailDisplayed).toBe(1);
  expect(m.missing.length).toBeGreaterThan(0);
  expect(m.displayed).toBe(0);
  expect(filterRows([r, m], "combination")).toEqual([r]);
  expect(filterRows([r, m], "missing")).toContain(m);
  expect(filterRows([r, m], "empty")).toEqual([m]);
  expect(filterRows([r, m], "single")).toEqual([]);
  expect(summarize([r, m])[0]).toMatchObject({ numerator: 1, denominator: 2 });
  expect(JSON.stringify(a.report)).toBe(before);
});
it("target denominator is fixed to 14 major stars plus empty, not sample population", () => {
  const targets = catalogCoverage();
  expect(targets).toHaveLength(15);
  expect(targets.filter((t) => t.rules.length)).toHaveLength(15);
  expect(
    targets.every((t) => t.rules.every((r) => r.status !== "approved")),
  ).toBe(true);
});
it("all samples measured independently; six readings have distinct configurations and only allowed claims", async () => {
  const d = await collectCoverage();
  expect(d.rows).toHaveLength(56);
  expect(d.summary.reduce((a, g) => a + g.denominator, 0)).toBe(56);
  expect(d.readings.length).toBeGreaterThanOrEqual(5);
  const signatures = new Set<string>();
  for (const r of d.readings) {
    const s = (await loadSample(r.id))!,
      p = internalPreview(s.report);
    const life = s.report.snapshot.chart.palaces.find(
      (p) => p.name === "Mệnh",
    )!;
    signatures.add(
      JSON.stringify([life.earthlyBranch, life.majorStars, life.minorStars]),
    );
    for (const n of [...r.main, ...r.details])
      expect(
        p.execution.previewClaims.some(
          (c) => c.id === n.claimId && c.text === n.text,
        ),
      ).toBe(true);
    expect(p.execution.approvedClaims).toHaveLength(0);
  }
  expect(signatures.size).toBe(d.readings.length);
  expect(
    d.uncoveredRules.every((r) =>
      d.rows.every((row) => !row.matchedRuleIds.includes(r.id)),
    ),
  ).toBe(true);
});
it.each(["syn-pojun", "syn-qisha"])(
  "%s terminology does not pretend to fill personal interpretation coverage",
  async (id) => {
    const loaded = (await loadSample(id))!;
    const row = measureSample(loaded.report, loaded.sample);
    expect(row.matchedMethod).toBeGreaterThan(0);
    expect(row.displayed).toBe(1); // new eligible Tân Biên base gloss, not old terminology
    expect(row.matchedSingles).toBe(1);
    expect(row.matchedRuleIds).toContain(id === "syn-pojun" ? "tanbien.r19" : "tanbien.r18");
    const topic = internalPreview(loaded.report).topics[0];
    expect(topic.glossaryNotes).toHaveLength(1);
    expect(topic.unexplainedStars).not.toContain(loaded.sample.star);
  },
);
