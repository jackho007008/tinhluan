import fs from "node:fs";
import { it, expect } from "vitest";
import type { ChartSnapshot } from "../lib/tuvi-engine";
import { CHART_BRANCHES } from "../lib/tuvi-engine/chart-integrity";
import { certifyNatalTransformations } from "../lib/tuvi-engine/natal-transformations";
import {
  TB_P01,
  TB_P02,
  TB_P03,
  TB_F01,
  TB_FAMILY_PHUC_IDS as IDS,
  TB_FAMILY_PHUC_COPY as COPY,
  tbFamilyPhucFact as fact,
  tbFamilyPhucAssessment as assess,
  tbFamilyPhucFacts,
  tbFamilyPhucRules as rules,
} from "../lib/interpretation-rules/tb-family-phuc-clauses";
import { catalog, RULESET_VERSION } from "../lib/interpretation-rules/catalog";
import { executeRules } from "../lib/interpretation-rules/execute";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { buildContinuousReport } from "../lib/internal-review/continuous-report";
import { buildCustomerReport } from "../lib/internal-review/customer-report";
import { conditionText } from "../lib/internal-review/tanbien-presentation";
import {
  captureReadingPolicy,
  projectReading,
} from "../lib/trial/reading-policy";
const original = (i: number) =>
  JSON.parse(
    fs.readFileSync(
      `.local/root-batch-delivery-20261025/after/${i}.json`,
      "utf8",
    ),
  );
const witnesses: Record<string, number[]> = {
  [TB_P01]: [0, 22, 48, 187],
  [TB_P02]: [32, 39],
  [TB_P03]: [54, 99, 158],
  [TB_F01]: [99, 176, 183],
};
const snapshot = (id: string): ChartSnapshot =>
  original(witnesses[id][0]).snapshot;
const at = (s: ChartSnapshot, id: string) =>
  s.chart.palaces.find(
    (p) => p.name === (id === TB_F01 ? "Phúc Đức" : "Phụ Mẫu"),
  )!;
const donor = (s: ChartSnapshot, id: string) =>
  s.chart.palaces.find(
    (p) => p.name === (id === TB_F01 ? "Tài Bạch" : "Tật Ách"),
  )!;
function render(s: ChartSnapshot) {
  const reading = buildTanBienReading(s),
    continuous = buildContinuousReport(s, reading, true),
    customer = buildCustomerReport(s, continuous, RULESET_VERSION);
  const record: any = {
    snapshot: s,
    frozen: { customerReport: customer, continuousReport: continuous },
  };
  record.accessPolicy = captureReadingPolicy(record);
  return { reading, continuous, customer, record };
}
// All mutations below are technical predicate fixtures, not new engine witnesses.
function kyFixture(s: ChartSnapshot, palace: string) {
  for (const p of s.chart.palaces)
    for (const k of ["majorStars", "minorStars", "adjectiveStars"] as const)
      for (const st of p[k]) if (st.mutagen === "Kỵ") delete st.mutagen;
  const source = s.chart.palaces.find((p) =>
      p.minorStars.some((st) => st.name === "Văn Khúc"),
    )!,
    n = source.minorStars.findIndex((st) => st.name === "Văn Khúc"),
    st = source.minorStars.splice(n, 1)[0];
  st.mutagen = "Kỵ";
  s.chart.palaces.find((p) => p.name === palace)!.minorStars.push(st);
  // Declared synthetic assignment for certificate-path tests only; no Hóa formula is recomputed.
  (
    s.chart.tanBien!.trace.find((t) => t.id === "mutagens")!.result as string[]
  )[3] = "Văn Khúc";
  s.chart.natalTransformations = certifyNatalTransformations(s.chart);
  return s;
}
it("four finite schemas/registrations, exact approved copy and separate source/project conditions", () => {
  const approved = JSON.parse(
    fs.readFileSync(
      ".local/full-review-20261026/candidates-final-before-after.json",
      "utf8",
    ),
  ).copies;
  expect(IDS.map((id) => COPY[id])).toEqual(
    ["P01", "P02", "P03", "F01"].map((k) => approved[k]),
  );
  for (const r of rules) {
    expect(catalog.filter((q) => q.id === r.id)).toHaveLength(1);
    expect(r.claimTemplate).toBe(COPY[r.id]);
    expect(r.conflictPolicy).toBe("retain-both");
    expect(r.presentation!.sourceConditions!.length).toBeGreaterThan(1);
    expect(r.presentation!.projectScope!.join(" ")).toContain("Cổng dự án");
    expect(conditionText(r.conditions[0])).toContain(
      r.id === TB_F01 ? "142" : "131",
    );
  }
});
for (const id of IDS)
  for (const i of witnesses[id])
    it(
      id +
        " existing engine witness " +
        i +
        " first word, exact paid copy/trace and old claims retained",
      () => {
        const b = original(i),
          s = b.snapshot,
          r = render(s);
        expect(assess(s, id).value).toBe("yes");
        const ps = r.customer.sections
          .flatMap((s) => s.paragraphs)
          .filter((p) =>
            p.members.some((m) => m.claim.rules.some((q) => q.id === id)),
          );
        expect(ps).toHaveLength(1);
        expect(ps[0].text).toBe(COPY[id]);
        expect(ps[0].review).toBe("editorial-checked");
        expect(r.continuous.unbound).toEqual([]);
        const section = r.customer.sections.find((s) =>
          s.palaces.includes(at(snap(id, i), id).name),
        )!;
        expect(
          section.notices.some(
            (n) => n.text === "Phần này hiện chưa có luận giải.",
          ),
        ).toBe(false);
        for (const c of b.reading.execution.previewClaims)
          expect(
            r.reading.execution.previewClaims.find((q) => q.id === c.id),
          ).toEqual(c);
        const free = JSON.stringify(projectReading(r.record));
        expect(free).not.toContain(id);
        expect(free).not.toContain(COPY[id]);
        expect(JSON.stringify(projectReading(r.record, true))).toContain(
          COPY[id],
        );
        expect(
          buildTanBienReading(s, {
            unverifiedStarLists: true,
          }).execution.previewClaims.some((c) =>
            c.rules.some((q) => q.id === id),
          ),
        ).toBe(false);
      },
    );
function snap(id: string, i: number): ChartSnapshot {
  return original(i).snapshot;
}
for (const id of IDS)
  for (const [label, edit] of [
    ["profile", (s: ChartSnapshot) => (s.profile.id = "cn-reference")],
    [
      "major cert",
      (s: ChartSnapshot) =>
        delete (s.chart.tanBien!.completeness as any).majorStars,
    ],
    [
      "missing major list",
      (s: ChartSnapshot) => delete (at(s, id) as any).majorStars,
    ],
    [
      "major missing",
      (s: ChartSnapshot) =>
        s.chart.palaces.find((p) => p.majorStars.length)!.majorStars.pop(),
    ],
    [
      "major scope",
      (s: ChartSnapshot) =>
        ((
          s.chart.palaces.find((p) => p.majorStars.length)!.majorStars[0] as any
        ).scope = "year"),
    ],
    [
      "duplicate name",
      (s: ChartSnapshot) =>
        (s.chart.palaces.find((p) => p !== at(s, id))!.name = at(s, id).name),
    ],
    ["palace null", (s: ChartSnapshot) => ((s.chart.palaces as any)[0] = null)],
    [
      "minor cert",
      (s: ChartSnapshot) =>
        delete (s.chart.tanBien!.completeness as any).minorStars,
    ],
    [
      "adjunct cert",
      (s: ChartSnapshot) =>
        delete (s.chart.tanBien!.completeness as any).adjectiveStars,
    ],
    [
      "minor missing",
      (s: ChartSnapshot) => delete (at(s, id) as any).minorStars,
    ],
    [
      "wrong adjunct scope",
      (s: ChartSnapshot) =>
        at(s, id).adjectiveStars.push({ name: "Test", scope: "year" } as any),
    ],
    [
      "adjunct duplicate",
      (s: ChartSnapshot) =>
        at(s, id).adjectiveStars.push(
          { name: "Test", scope: "origin" } as any,
          { name: "Test", scope: "origin" } as any,
        ),
    ],
    [
      "TT missing",
      (s: ChartSnapshot) => delete (s.chart.tanBien as any).voidRanges,
    ],
    [
      "TT null",
      (s: ChartSnapshot) => ((s.chart.tanBien!.voidRanges as any)[0] = null),
    ],
    [
      "TT duplicate name",
      (s: ChartSnapshot) =>
        (s.chart.tanBien!.voidRanges![1].name = "Tuần Không"),
    ],
    [
      "TT invalid pair",
      (s: ChartSnapshot) =>
        (s.chart.tanBien!.voidRanges![0].branches = ["Tý", "Dần"]),
    ],
  ] as const)
    it(id + " missing/inconsistent " + label + " stays unknown", () => {
      const s = snapshot(id);
      edit(s);
      expect(assess(s, id).value).toBeUndefined();
      expect(assess(s, id).cause).toBe("missing-data");
      expect(
        tbFamilyPhucFacts(s).find((f) => f.id === fact(id) + "-status")!.value,
      ).toBe("unknown");
    });
for (const id of [TB_P01, TB_P02, TB_F01])
  it(
    id +
      " exact opposite pair; VCD is structural, no date/ID/brightness selection",
    () => {
      const s = snapshot(id),
        p = at(s, id),
        d = donor(s, id),
        other = s.chart.palaces.find(
          (q) => q !== p && q !== d && q.majorStars.length,
        )!;
      p.majorStars.push(other.majorStars.pop()!);
      expect(assess(s, id).value).toBe("no");
      other.majorStars.push(p.majorStars.pop()!);
      other.majorStars.push(d.majorStars.pop()!);
      expect(assess(s, id).value).toBe("no");
      d.majorStars.push(other.majorStars.pop()!);
      d.majorStars.push(other.majorStars.pop()!);
      expect(assess(s, id).value).toBe("no");
      other.majorStars.push(d.majorStars.pop()!);
      const x = snapshot(id);
      x.resultId = "not-an-acceptance-id";
      x.normalized.name = "Unrelated name";
      x.normalized.date = "2005-01-01";
      donor(x, id).majorStars.forEach((st) => (st.brightness = "Hãm"));
      expect(assess(x, id).value).toBe("yes");
    },
  );
for (const id of IDS)
  for (const names of [
    [],
    ["Tuần Không"],
    ["Triệt Lộ"],
    ["Tuần Không", "Triệt Lộ"],
  ])
    for (const side of id === TB_P03 ? ["target"] : ["target", "donor"])
      it(
        id +
          " TT " +
          names.join("+") +
          " at " +
          side +
          " does not invert independent relation",
        () => {
          const s = snapshot(id),
            p = side === "target" ? at(s, id) : donor(s, id),
            i = CHART_BRANCHES.indexOf(p.earthlyBranch),
            pair = CHART_BRANCHES.slice(i - (i % 2), i - (i % 2) + 2),
            away = Array.from({ length: 6 }, (_, j) =>
              CHART_BRANCHES.slice(j * 2, j * 2 + 2),
            ).filter(
              (p) =>
                !p.includes(at(s, id).earthlyBranch) &&
                !p.includes(donor(s, id).earthlyBranch),
            );
          s.chart.tanBien!.voidRanges = [
            {
              name: "Tuần Không",
              branches: names.includes("Tuần Không") ? pair : away[0],
            },
            {
              name: "Triệt Lộ",
              branches: names.includes("Triệt Lộ") ? pair : away[1],
            },
          ] as any;
          expect(assess(s, id).value).toBe("yes");
        },
      );
it("P01 requires both source/receiver branches in Sửu/Mùi, not whichever side helps", () => {
  const s = snapshot(TB_P01),
    t = at(s, TB_P01),
    d = donor(s, TB_P01),
    a = s.chart.palaces.find((p) => p.earthlyBranch === "Tý")!,
    b = s.chart.palaces.find((p) => p.earthlyBranch === "Ngọ")!;
  [t.earthlyBranch, a.earthlyBranch] = [a.earthlyBranch, t.earthlyBranch];
  [d.earthlyBranch, b.earthlyBranch] = [b.earthlyBranch, d.earthlyBranch];
  expect(assess(s, TB_P01).value).toBe("no");
});
it("P01 direct Kỵ holds; certified donor Kỵ is not borrowed; missing/mismatched certificate unknown", () => {
  const s = kyFixture(snapshot(TB_P01), "Phụ Mẫu");
  expect(assess(s, TB_P01).value).toBeUndefined();
  expect(assess(s, TB_P01).cause).toBe("unresolved-adjustment");
  expect(
    executeRules(s, [rules.find((r) => r.id === TB_P01)!], "internal-draft")
      .previewClaims,
  ).toHaveLength(0);
  expect(assess(kyFixture(snapshot(TB_P01), "Tật Ách"), TB_P01).value).toBe(
    "yes",
  );
  for (const edit of [
    (s: ChartSnapshot) => delete s.chart.natalTransformations,
    (s: ChartSnapshot) => s.chart.natalTransformations!.entries.pop(),
  ]) {
    const x = snapshot(TB_P01);
    edit(x);
    expect(assess(x, TB_P01).cause).toBe("missing-data");
  }
});
it("P02 carries only universal Cự harmony, not the Sun wealth/age or donor transformations", () => {
  const s = snapshot(TB_P02);
  delete s.chart.natalTransformations;
  expect(assess(s, TB_P02).value).toBe("yes");
  expect(COPY[TB_P02]).not.toMatch(/giàu|sống lâu|tuổi|khắc|con nuôi/);
});
it("P03 validates complete natal ring/trace; arbitrary direct label or projected Thái Tuế cannot replace it", () => {
  for (const edit of [
    (s: ChartSnapshot) => delete (at(s, TB_P03) as any).suiqian12,
    (s: ChartSnapshot) =>
      ((s.chart.palaces.find((p) => p !== at(s, TB_P03)) as any).suiqian12 =
        "Thái Tuế"),
    (s: ChartSnapshot) =>
      s.chart.tanBien!.trace.splice(
        s.chart.tanBien!.trace.findIndex((t) => t.id === "rings"),
        1,
      ),
    (s: ChartSnapshot) => (s.chart.tanBien!.inputs.yearBranch = "Tý"),
  ]) {
    const s = snapshot(TB_P03);
    edit(s);
    expect(assess(s, TB_P03).cause).toBe("missing-data");
  }
  expect(assess(original(32).snapshot, TB_P03).value).toBe("no");
});
it("P03 does not gate its first clause on the unresolved many-sat extension or choose a favorable winner", () => {
  const s = snapshot(TB_P03);
  expect(at(s, TB_P03).minorStars.some((st) => st.name === "Đà La")).toBe(true);
  expect(assess(s, TB_P03).value).toBe("yes");
  expect(COPY[TB_P03]).not.toMatch(/ly tán|tai họa|kiện cáo|xa cách/);
  const r = render(original(64).snapshot);
  expect(
    r.customer.sections
      .find((s) => s.palaces.includes("Phụ Mẫu"))!
      .paragraphs.map((p) => p.text)
      .join(" "),
  ).toContain("gia đình yên vui");
  expect(
    r.customer.sections
      .flatMap((s) => s.paragraphs)
      .some((p) => p.text === COPY[TB_P03]),
  ).toBe(true);
});
for (const i of [2, 5, 38, 45, 116, 139, 142, 161, 177])
  it(
    "P03 existing applied discord " +
      i +
      " does not receive equivalent prose twice",
    () => {
      expect(assess(original(i).snapshot, TB_P03).value).toBe("no");
      expect(
        render(original(i).snapshot).reading.execution.previewClaims.some((c) =>
          c.rules.some((r) => r.id === TB_P03),
        ),
      ).toBe(false);
    },
  );
it("F01 applies generically at an already populated Phúc; no empty-palace-output gate", () => {
  const s = original(83).snapshot;
  expect(assess(s, TB_F01).value).toBe("yes");
  const r = render(s),
    sec = r.customer.sections.find((s) => s.palaces.includes("Phúc Đức"))!;
  expect(sec.paragraphs.some((p) => p.text === COPY[TB_F01])).toBe(true);
  expect(
    sec.paragraphs.some((p) =>
      p.members.some((m) =>
        m.claim.rules.some((q) => q.id === "tanbien.phuc-thai-tue"),
      ),
    ),
  ).toBe(true);
});
it("F01 does not import donor Hóa or suppress dispersion because another facet concerns enjoyment of phúc", () => {
  const s = kyFixture(snapshot(TB_F01), "Tài Bạch");
  expect(assess(s, TB_F01).value).toBe("yes");
  expect(COPY[TB_F01]).not.toMatch(/giàu|sống lâu|tài lộc/);
});
it("matched and unknown section states retain the old limits, while genuinely empty sections stay empty", () => {
  const r = render(original(158).snapshot),
    sec = r.customer.sections.find((s) => s.palaces.includes("Phụ Mẫu"))!;
  expect(sec.notices.length).toBeGreaterThan(0);
  expect(
    sec.notices.some((n) => n.text === "Phần này hiện chưa có luận giải."),
  ).toBe(false);
  expect(
    r.continuous.palaces
      .find((p) => p.name === "Phụ Mẫu")!
      .gap!.reasons.some((r) => r.ruleId === "tanbien.parents-vu-phu"),
  ).toBe(true);
  const s = snapshot(TB_P01);
  delete s.chart.natalTransformations;
  const u = render(s),
    gap = u.continuous.palaces.find((p) => p.name === "Phụ Mẫu")!.gap!;
  expect(gap.reasons.find((r) => r.ruleId === TB_P01)!.cause).toBe(
    "missing-data",
  );
  expect(JSON.stringify(projectReading(u.record))).not.toContain(TB_P01);
});

it("119 overlaps P02/P03: one approved paragraph preserves both claims and the parent-child facet", () => {
  const r = render(original(119).snapshot),
    ps = r.customer.sections
      .find((s) => s.palaces.includes("Phụ Mẫu"))!
      .paragraphs.filter((p) =>
        p.members.some((m) =>
          m.claim.rules.some((q) => [TB_P02, TB_P03].includes(q.id)),
        ),
      );
  expect(ps).toHaveLength(1);
  expect(ps[0].text).toBe(COPY[TB_P03]);
  expect(
    ps[0].members.flatMap((m) => m.claim.rules.map((r) => r.id)).sort(),
  ).toEqual([TB_P02, TB_P03].sort());
  expect(ps[0].text.match(/tranh chấp/g)).toHaveLength(1);
  expect(ps[0].text).toContain("cha mẹ và con");
  for (const old of original(119).customer.sections.find((s: any) =>
    s.palaces.includes("Phụ Mẫu"),
  ).paragraphs)
    expect(
      r.customer.sections
        .flatMap((s) => s.paragraphs)
        .find((p) => p.id === old.id),
    ).toEqual(old);
});
for (const i of [12, 27, 120])
  it(
    "old dossier candidate " +
      i +
      " actually has direct Sun–Cự, remains outside P02 VCD",
    () => {
      expect(assess(original(i).snapshot, TB_P02).value).toBe("no");
    },
  );

it("the actual customer evidence exposes project guards separately from source conditions", () => {
  for (const id of IDS) {
    const r = render(snapshot(id)),
      p = r.customer.sections
        .flatMap((s) => s.paragraphs)
        .find((p) =>
          p.members.some((m) => m.claim.rules.some((q) => q.id === id)),
        )!;
    const layer = p.members
      .flatMap((m) => m.layers)
      .find((l) =>
        l.sourceConditions.some((t) =>
          t.includes(id === TB_F01 ? "142" : "131"),
        ),
      )!;
    expect(layer.sourceConditions).not.toEqual([]);
    expect(layer.limits.join(" ")).toContain("Cổng dự án");
  }
});
