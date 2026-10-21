import { expect, it } from "vitest";
import saved from "../exports/demo-wuqu-tianfu-review.json";
import { careerContent } from "../lib/interpretation-rules/tanbien-career-content";
import { catalog } from "../lib/interpretation-rules/catalog";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { deriveFacts } from "../lib/interpretation-rules/derived";
import type { ChartSnapshot } from "../lib/tuvi-engine";
import { readPath } from "../lib/interpretation-rules/schema";
const q = (s: ChartSnapshot) =>
  s.chart.palaces.find((p) => p.name === "Quan Lộc")!;
// All mutations in this file are MINIMAL TECHNICAL FIXTURES, not engine charts.
function fixture(spec: (typeof careerContent)[number]) {
  const s = structuredClone(saved.snapshot) as unknown as ChartSnapshot;
  s.profile.id = "tanbien-vn-trial-v2";
  q(s).majorStars = (spec.stars || []).map((name) => ({ name }));
  q(s).minorStars = spec.minor ? [{ name: spec.minor }] : [];
  q(s).earthlyBranch = spec.branches?.[0] || "Dần";
  Object.assign(q(s), {
    suiqian12: spec.rings?.[0] || "Thái Tuế",
    boshi12: spec.rings?.[1] || "Bác Sỹ",
  });
  s.chart.fiveElementsClass = "Mộc Tam Cục";
  s.chart.lunar.lunarDay = 9;
  return s;
}
const trace = (s: ChartSnapshot, id: string) =>
  buildTanBienReading(s).execution.traces.find(
    (t) => t.ruleId === "tanbien." + id,
  )!;
for (const spec of careerContent)
  it(`${spec.id}: exact source clause, wrong palace, missing facts, required branches and sole-major distinction`, () => {
    const s = fixture(spec),
      original = JSON.stringify(s);
    expect(trace(s, spec.id).status).toBe("matched");
    const r = buildTanBienReading(s),
      claim = r.execution.previewClaims.find((c) =>
        c.rules.some((r) => r.id === "tanbien." + spec.id),
      )!;
    expect(claim).toBeDefined();
    for (const path of claim.evidencePaths)
      expect(readPath(s, path)).toBeDefined();
    expect(JSON.stringify(s)).toBe(original);
    if (spec.stars) {
      q(s).majorStars = [];
      expect(trace(s, spec.id).status).toBe("condition-false");
      delete (q(s) as any).majorStars;
      expect(trace(s, spec.id).status).toBe("missing-facts");
    } else if (spec.minor) {
      q(s).minorStars = [];
      expect(trace(s, spec.id).status).toBe("condition-false");
      delete (q(s) as any).minorStars;
      expect(trace(s, spec.id).status).toBe("missing-facts");
    } else {
      (q(s) as any).suiqian12 = "Thái Tuế";
      expect(trace(s, spec.id).status).toBe("condition-false");
      delete (q(s) as any).suiqian12;
      expect(trace(s, spec.id).status).toBe("missing-facts");
    }
    if (spec.branches) {
      const s = fixture(spec);
      q(s).earthlyBranch = "Sửu";
      expect(trace(s, spec.id).status).toBe("condition-false");
      delete (q(s) as any).earthlyBranch;
      expect(trace(s, spec.id).status).toBe("missing-facts");
    }
    if (spec.alone) {
      const s = fixture(spec);
      q(s).minorStars.push({ name: "Văn Khúc" });
      expect(trace(s, spec.id).status).toBe("matched");
      q(s).majorStars.push({ name: "Tử Vi" });
      expect(trace(s, spec.id).status).toBe("condition-false");
    }
    if (spec.stars?.length === 2) {
      const s = fixture(spec);
      q(s).majorStars.pop();
      expect(trace(s, spec.id).status).toBe("condition-false");
    }
  });
it("one shared quality gate blocks only major-position dependent claims; absent gate never becomes false", () => {
  for (const spec of careerContent) {
    const s = fixture(spec);
    s.chart.fiveElementsClass = "Kim Tứ Cục";
    s.chart.lunar.lunarDay = 21;
    expect(trace(s, spec.id).status).toBe(
      spec.stars ? "missing-facts" : "matched",
    );
    s.chart.lunar.lunarDay = 24;
    expect(trace(s, spec.id).status).toBe(
      spec.stars ? "missing-facts" : "matched",
    );
    s.chart.lunar.lunarDay = 20;
    expect(trace(s, spec.id).status).toBe("matched");
    delete (s.chart as any).lunar;
    expect(trace(s, spec.id).status).toBe(
      spec.stars ? "missing-facts" : "matched",
    );
    const rule = catalog.find((r) => r.id === "tanbien." + spec.id)!;
    expect(rule.presentation!.sourceConditions!.join(" ")).not.toContain("Kim");
    expect(rule.review).toBeNull();
    expect(rule.status).toBe("draft");
  }
});
it("rings stay origin-only v2; unverified contracts never produce auxiliary/ring claims", () => {
  for (const spec of careerContent) {
    const s = fixture(spec);
    expect(
      buildTanBienReading(s, { unverifiedStarLists: true }).execution
        .previewClaims,
    ).toHaveLength(0);
  }
  const s = fixture(careerContent.find((s) => s.id === "r38")!);
  s.profile.id = "cn-reference";
  expect(trace(s, "r38").status).toBe("wrong-profile");
});
it("duplicate organization is collapsed editorially without loss of matched claim/trace; switching reconstructs source evidence", () => {
  const s = fixture(careerContent.find((s) => s.id === "r31")!);
  q(s).minorStars = [{ name: "Lộc Tồn" }, { name: "Thiên Mã" }];
  const a = buildTanBienReading(s),
    work = a.sections.find((s) => s.id === "work")!;
  expect(
    work.paragraphs.find((p) =>
      p.claim.rules.some((r) => r.id === "tanbien.r36"),
    )?.secondary,
  ).toBe(true);
  expect(
    a.execution.traces.find((t) => t.ruleId === "tanbien.r36")?.status,
  ).toBe("matched");
  const empty = structuredClone(s);
  q(empty).majorStars = [];
  q(empty).minorStars = [];
  expect(
    buildTanBienReading(empty).sections.find((s) => s.id === "work")!.claims,
  ).toHaveLength(0);
  expect(buildTanBienReading(s)).toEqual(a);
  const known = deriveFacts(s).find((f) => f.id === "fact.career-major-count");
  expect(known?.value).toBe("1");
});

it("versioned export pairs prose/JSON and all added branches have actual engine sample input, not mutated technical charts", async () => {
  const { readFileSync } = await import("node:fs");
  const { createHash } = await import("node:crypto");
  const text = readFileSync(
      "exports/tanbien-career-1.11.0/readings.json",
      "utf8",
    ),
    pack = JSON.parse(text),
    md = readFileSync("exports/tanbien-career-1.11.0/review.md", "utf8");
  expect(md).toContain(pack.runId);
  expect(md).toContain(createHash("sha256").update(text).digest("hex"));
  for (const spec of careerContent) {
    const coverage = pack.coverage.find(
      (c: any) => c.id === "tanbien." + spec.id,
    );
    expect(coverage.selected).toBeTruthy();
    const row = pack.rows.find((r: any) => r.id === coverage.selected);
    expect(row.kind).not.toMatch(/technical|fixture/i);
    expect(row.snapshot.normalized.date).toBeTruthy();
    const p = row.snapshot.chart.palaces.find(
      (p: any) => p.name === "Quan Lộc",
    );
    if (spec.stars)
      for (const name of spec.stars)
        expect(p.majorStars.map((s: any) => s.name)).toContain(name);
    if (spec.branches) expect(spec.branches).toContain(p.earthlyBranch);
    if (spec.alone) expect(p.majorStars).toHaveLength(1);
    for (const paragraph of row.after.section.paragraphs)
      expect(md).toContain(paragraph.display.text);
  }
});
it("no imported source instruction or scope note substitutes for a source exception; no speculative sat interaction", () => {
  const spec = careerContent.find((s) => s.id === "r27")!,
    s = fixture(spec);
  q(s).minorStars = [
    { name: "Hỏa Tinh" },
    { name: "Linh Tinh" },
    { name: "Thiên Quý" },
  ];
  q(s).adjectiveStars = [{ name: "Triệt Lộ" }];
  q(s).majorStars.forEach((s) => (s.brightness = "Hãm"));
  expect(trace(s, "r27").status).toBe("matched"); // The selected Dương–Cự clause specifies Dần and đồng cung, no brightness test.
  expect(
    buildTanBienReading(s).execution.previewClaims.find((c) =>
      c.rules.some((r) => r.id === "tanbien.r27"),
    )!.text,
  ).not.toMatch(/Hỏa|Linh|Triệt|Thiên Quý/);
});
