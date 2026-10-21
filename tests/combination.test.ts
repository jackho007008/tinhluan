import { beforeAll, it, expect } from "vitest";
import { calculate, type ChartSnapshot } from "../lib/tuvi-engine";
import { catalog } from "../lib/interpretation-rules/catalog";
import { executeRules } from "../lib/interpretation-rules/execute";
import { readPath } from "../lib/interpretation-rules/schema";
import { buildReport } from "../lib/reports";
import { internalPreview } from "../lib/internal-review/preview";
import pending from "../fixtures/chart-comparison/awaiting-vn.json";
let base: ChartSnapshot;
beforeAll(async () => {
  base = await calculate(pending.birth);
});
const plain = "combination.ziwei-assistants",
  qualified = plain + "-qualified";
// Deliberately synthetic placements, for evaluator behavior only.
function fixture() {
  const s = structuredClone(base),
    m = s.chart.palaces.find((p) => p.name === "Mệnh")!;
  m.majorStars = [{ name: "Tử Vi" }];
  m.minorStars = [{ name: "Tả Phù" }, { name: "Hữu Bật" }];
  return { s, m };
}
const run = (s: ChartSnapshot) => executeRules(s, catalog, "internal-draft");
const ids = (s: ChartSnapshot) =>
  run(s).previewClaims.flatMap((c) => c.rules.map((r) => r.id));
it("full same-palace combination emits sourced claim with concrete evidence; draft never publishes", () => {
  const { s } = fixture();
  expect(ids(s)).toContain(plain);
  expect(ids(s)).not.toContain(qualified);
  const c = run(s).previewClaims.find((c) =>
    c.rules.some((r) => r.id === plain),
  )!;
  expect(c.evidencePaths.every((p) => readPath(s, p) !== undefined)).toBe(true);
  expect(c.reasons.join(" ")).toContain("actual");
  expect(c.evidencePaths.some((p) => p.endsWith("minorStars.1.name"))).toBe(
    true,
  );
  expect(executeRules(s, catalog).approvedClaims).toHaveLength(0);
});
it.each(["Tử Vi", "Tả Phù", "Hữu Bật"])(
  "missing required %s at Mệnh rejects even when it occurs elsewhere",
  (name) => {
    const { s, m } = fixture();
    m.majorStars = m.majorStars.filter((s) => s.name !== name);
    m.minorStars = m.minorStars.filter((s) => s.name !== name);
    s.chart.palaces
      .find((p) => p.name === "Quan Lộc")!
      .minorStars.push({ name });
    expect(ids(s)).not.toContain(plain);
    expect(ids(s)).not.toContain(qualified);
    expect(run(s).traces.find((t) => t.ruleId === plain)?.status).toBe(
      "condition-false",
    );
  },
);
it.each(["Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh"])(
  "editorial exception %s preserves qualified counter-reading",
  (name) => {
    const { s, m } = fixture();
    m.minorStars.push({ name });
    const e = run(s);
    expect(ids(s)).not.toContain(plain);
    expect(ids(s)).toContain(qualified);
    expect(e.traces.find((t) => t.ruleId === plain)?.status).toBe("exception");
    expect(
      e.previewClaims.find((c) => c.rules.some((r) => r.id === qualified))
        ?.text,
    ).toContain(name);
  },
);
it.each([
  undefined,
  null,
  {},
  [null],
  [{ name: "Tả Phù" }, { name: "Tả Phù" }],
])("invalid or missing minor list cannot assert absence", (value) => {
  const { s, m } = fixture();
  Reflect.set(m, "minorStars", value);
  const e = run(s);
  expect(e.traces.find((t) => t.ruleId === plain)?.status).toBe(
    "missing-facts",
  );
  expect(ids(s)).not.toContain(qualified);
});
it("editorial move preserves all claims, sources and other context; old report untouched", async () => {
  const { s, m } = fixture();
  m.majorStars.push({ name: "Vũ Khúc", mutagen: "Kỵ" });
  m.majorStars[0].mutagen = "";
  const report = await buildReport(s, { groups: ["Tổng quan"], year: null }),
    before = JSON.stringify(report);
  const p = internalPreview(report),
    t = p.topics[0];
  expect(t.mainNotes[0].id).toBe(plain);
  expect(t.detailNotes.map((n) => n.id)).toContain("reading.overview.ziwei");
  expect(t.notes.map((n) => n.id)).toContain("reading.overview.ziwei");
  expect(t.mainNotes.map((n) => n.id)).toContain("reading.wuqu");
  expect(t.adjustments.flatMap((c) => c.rules.map((r) => r.id))).toContain(
    "context.wuqu-ji",
  );
  expect(JSON.stringify(report)).toBe(before);
  m.minorStars = [];
  const next = internalPreview(
    await buildReport(s, { groups: ["Tổng quan"], year: null }),
  );
  expect(next.topics[0].detailNotes).toHaveLength(0);
  expect(next.topics[0].mainNotes.map((n) => n.id)).not.toContain(plain);
});
it.each([false, true])(
  "Phá Quân blocks both combinations, with local modifier=%s; singles remain",
  async (withModifier) => {
    const { s, m } = fixture();
    m.majorStars.push({ name: "Phá Quân" });
    if (withModifier) m.minorStars.push({ name: "Đà La" });
    const e = run(s);
    expect(ids(s)).not.toContain(plain);
    expect(ids(s)).not.toContain(qualified);
    expect(e.traces.find((t) => t.ruleId === plain)?.status).toBe("exception");
    expect(
      e.traces.find((t) => t.ruleId === plain)?.details.join(" "),
    ).toContain("Phá Quân");
    if (withModifier)
      expect(e.traces.find((t) => t.ruleId === qualified)?.status).toBe(
        "exception",
      );
    expect(ids(s)).toContain("reading.overview.ziwei");
    expect(ids(s)).toContain("reading.overview.pojun");
    const report = await buildReport(s, { groups: ["Tổng quan"], year: null });
    const before = JSON.stringify(report);
    const overview = internalPreview(report).topics[0];
    expect(overview.scopeGaps.join(" ")).toContain("Phá Quân");
    expect(overview.mainNotes.map((n) => n.id)).toContain(
      "reading.overview.ziwei",
    );
    expect(overview.glossaryNotes.map((n) => n.id)).toContain(
      "reading.overview.pojun",
    );
    expect(overview.detailNotes).toHaveLength(0);
    expect(JSON.stringify(report)).toBe(before);
  },
);
it("Phá Quân elsewhere does not trigger a same-palace editorial exception", () => {
  const { s } = fixture();
  s.chart.palaces.find((p) => p.name === "Quan Lộc")!.majorStars = [
    { name: "Phá Quân" },
  ];
  expect(ids(s)).toContain(plain);
  expect(ids(s)).not.toContain("reading.overview.pojun");
});
it.each(["reading.overview.pojun", "reading.overview.qisha"])(
  "%s: missing major list is not empty and cannot publish a terminology gloss",
  (id) => {
    const { s, m } = fixture();
    Reflect.deleteProperty(m, "majorStars");
    expect(run(s).traces.find((t) => t.ruleId === id)?.status).toBe(
      "missing-facts",
    );
    expect(ids(s)).not.toContain("reading.overview.empty");
  },
);
