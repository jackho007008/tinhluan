import { it, expect, afterEach } from "vitest";
import fs from "node:fs";
import {
  lifeLiteraryAssessment as assess,
  lifeLiteraryRules,
  M05,
  M07,
} from "../lib/interpretation-rules/life-literary";
import { executeRules } from "../lib/interpretation-rules/execute";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { buildContinuousReport } from "../lib/internal-review/continuous-report";
import { freezeReading } from "../lib/internal-review/dynamic-reading";
import { tanBienTable } from "../lib/interpretation-rules/tanbien-source";
const main = JSON.parse(
  fs.readFileSync(
    ".local/acceptance-1992-20261014/samples-before.json",
    "utf8",
  ),
)[1];
const witnesses = ["same", "opposite"].map((x) =>
  JSON.parse(fs.readFileSync(`fixtures/life-literary-m07-${x}.json`, "utf8")),
);
const life = (s: any) => s.chart.palaces.find((p: any) => p.name === "Mệnh");
const claims = (s: any, id: string) =>
  executeRules(s, lifeLiteraryRules, "internal-draft").previewClaims.filter(
    (c) => c.rules.some((r) => r.id === id),
  );
const originalStates = { ...tanBienTable.states };
afterEach(() => {
  Object.assign(tanBienTable.states, originalStates);
});
it("source expected: 1992 male Vũ vượng Tý, Khúc same; Khoa Tuất is neither Tý nor Ngọ", () => {
  expect(life(main.snapshot).earthlyBranch).toBe("Tý");
  expect(assess(main.snapshot).m05.value).toBe("yes");
  expect(assess(main.snapshot).m07.value).toBe("no");
  expect(claims(main.snapshot, M05)).toHaveLength(1);
  expect(claims(main.snapshot, M07)).toHaveLength(0);
});
it.each(["same", "opposite"])(
  "engine witness %s matches TB120 scope, not an adjustment",
  (mode) => {
    const w = witnesses.find((w) => w.mode === mode)!;
    expect(assess(w.snapshot).m07.value).toBe("yes");
    expect(claims(w.snapshot, M07)).toHaveLength(1);
    expect(claims(w.snapshot, M07)[0].text).toContain("cẩn thận");
    expect(
      buildTanBienReading(w.snapshot).localAdjustments.some((x) =>
        x.adjustmentClaimId.includes(M07),
      ),
    ).toBe(false);
  },
);
// All mutations below are technical fixtures. They are not engine witnesses.
it.each(["female", "missing", "conflict"])("M05 gender %s", (kind) => {
  const s = structuredClone(main.snapshot);
  if (kind === "female") {
    s.normalized.gender = "female";
    s.chart.tanBien.inputs.gender = "female";
  }
  if (kind === "missing") delete s.normalized.gender;
  if (kind === "conflict") s.chart.tanBien.inputs.gender = "female";
  expect(assess(s).m05.value).toBe(kind === "female" ? "no" : undefined);
  expect(claims(s, M05)).toHaveLength(0);
});
it.each(["Xương", "Khúc", "both", "elsewhere"])(
  "M05 OR source hay: %s",
  (kind) => {
    const s = structuredClone(main.snapshot),
      p = life(s);
    for (const q of s.chart.palaces)
      for (const g of ["minorStars", "adjectiveStars"])
        q[g] = q[g].filter(
          (x: any) => !["Văn Xương", "Văn Khúc"].includes(x.name),
        );
    const target =
      kind === "elsewhere"
        ? s.chart.palaces.find((q: any) => q.name === "Thiên Di")
        : p;
    for (const name of kind === "both"
      ? ["Văn Xương", "Văn Khúc"]
      : [kind === "Khúc" ? "Văn Khúc" : "Văn Xương"])
      target.minorStars.push({ name, scope: "origin" });
    expect(assess(s).m05.value).toBe(kind === "elsewhere" ? "no" : "yes");
    expect(claims(s, M05)).toHaveLength(kind === "elsewhere" ? 0 : 1);
  },
);
it.each(["state-unsupported", "state-missing", "no-vu"])(
  "M05 brightness and star %s",
  (kind) => {
    const s = structuredClone(main.snapshot),
      p = life(s);
    if (kind === "state-unsupported")
      (tanBienTable.states as Record<string, string>)[p.earthlyBranch] = "Hãm";
    if (kind === "state-missing")
      delete (tanBienTable.states as Record<string, string>)[p.earthlyBranch];
    if (kind === "no-vu") {
      const q = s.chart.palaces.find((q: any) => q.name === "Thiên Di");
      q.majorStars.push(
        ...p.majorStars.splice(
          p.majorStars.findIndex((x: any) => x.name === "Vũ Khúc"),
          1,
        ),
      );
    }
    expect(assess(s).m05.value).toBe(
      kind === "state-missing" ? undefined : "no",
    );
  },
);
it.each([
  "list-missing",
  "list-uncertified",
  "list-duplicate",
  "annual",
  "major-duplicate",
  "major-missing",
])("M05 invalid %s remains unknown", (kind) => {
  const s = structuredClone(main.snapshot),
    p = life(s);
  if (kind === "list-missing") delete p.minorStars;
  if (kind === "list-uncertified")
    delete s.chart.tanBien.completeness.minorStars;
  if (kind === "list-duplicate") p.minorStars.push({ ...p.minorStars[0] });
  if (kind === "annual")
    p.minorStars.find((x: any) => x.name === "Văn Khúc").scope = "yearly";
  if (kind === "major-duplicate") p.majorStars.push({ ...p.majorStars[0] });
  if (kind === "major-missing") delete s.chart.tanBien.completeness.majorStars;
  expect(assess(s).m05.value).toBeUndefined();
  expect(claims(s, M05)).toHaveLength(0);
});
it.each(["missing", "version", "path", "assignment", "annual"])(
  "M07 certificate %s stays unknown",
  (kind) => {
    const s = structuredClone(witnesses[0].snapshot);
    if (kind === "missing") delete s.chart.natalTransformations;
    else if (kind === "version")
      s.chart.natalTransformations.version = "invalid";
    else if (kind === "path")
      s.chart.natalTransformations.entries[2].path =
        "chart.palaces.0.minorStars.99";
    else {
      for (const p of s.chart.palaces)
        for (const g of ["majorStars", "minorStars", "adjectiveStars"])
          for (const st of p[g])
            if (st.mutagen === "Khoa") {
              if (kind === "annual") st.scope = "yearly";
              else delete st.mutagen;
            }
    }
    expect(assess(s).m07.value).toBeUndefined();
    expect(claims(s, M07)).toHaveLength(0);
  },
);
it("wrong Mệnh branch is known negative, same names elsewhere do not activate", () => {
  const s = structuredClone(witnesses[0].snapshot),
    p = life(s),
    q = s.chart.palaces.find((q: any) => q.earthlyBranch === "Dần");
  [p.name, q.name] = [q.name, p.name];
  expect(assess(s).m07.value).toBe("no");
});
it("R02 and M05 share context, both claims and all source evidence retained, no duplicated group", () => {
  const r = buildTanBienReading(main.snapshot),
    c = buildContinuousReport(main.snapshot, r, true),
    gs = c.palaces[0].groups;
  const g = gs.find((g) =>
    g.members.some((m) => m.claim.rules.some((r) => r.id === M05)),
  )!;
  expect(g.members.flatMap((m) => m.claim.rules.map((r) => r.id))).toEqual(
    expect.arrayContaining([M05, "tanbien.r02"]),
  );
  expect(g.text).toContain("tài kiêm văn võ");
  expect(g.text).toContain("học rộng");
  expect(g.text).toContain("không phải hai bằng chứng độc lập");
  expect(
    gs.filter((g) =>
      g.members.some((m) => m.claim.rules.some((r) => r.id === "tanbien.r02")),
    ),
  ).toHaveLength(1);
  expect(
    g.members.every(
      (m) => m.layers.length > 0 && m.layers.some((l) => l.sources.length > 0),
    ),
  ).toBe(true);
});
it("snapshot immutable; rules internal draft and evidence frozen, no source fallback", () => {
  const s = structuredClone(main.snapshot),
    before = JSON.stringify(s);
  const f = freezeReading(s, main.receipt);
  expect(JSON.stringify(s)).toBe(before);
  expect(JSON.stringify(f)).not.toContain("thiếu ánh xạ");
  expect(
    lifeLiteraryRules.every((r) => r.status === "draft" && r.review === null),
  ).toBe(true);
  expect(
    executeRules(s, lifeLiteraryRules, "customer").previewClaims,
  ).toHaveLength(0);
  expect(
    executeRules(s, lifeLiteraryRules, "internal-draft", {
      unverifiedStarLists: true,
    }).previewClaims,
  ).toHaveLength(0);
});

it('technical Hợi/Tỵ uses exact opposite, not every hội chiếu', async()=>{
 const {certifyNatalTransformations}=await import('../lib/tuvi-engine/natal-transformations');
 const branches=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
 for(const w of witnesses){const s=structuredClone(w.snapshot);for(const p of s.chart.palaces)p.earthlyBranch=branches[(branches.indexOf(p.earthlyBranch)+11)%12];s.chart.natalTransformations=certifyNatalTransformations(s.chart);expect(life(s).earthlyBranch).toBe('Hợi');expect(assess(s).m07.value).toBe('yes');}
});
it('diagnostic missing data facts only reference actual evidence, never fabricate paths', async()=>{
 const {lifeLiteraryFacts}=await import('../lib/interpretation-rules/life-literary');const{readPath}=await import('../lib/interpretation-rules/schema');
 const s=structuredClone(main.snapshot);delete s.chart.tanBien.inputs;delete s.chart.natalTransformations;
 expect(assess(s).m05.value).toBeUndefined();expect(assess(s).m07.value).toBeUndefined();
 expect(lifeLiteraryFacts(s).every(f=>f.evidencePaths.every(p=>readPath(s,p)!==undefined))).toBe(true);
});
