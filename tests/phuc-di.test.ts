import { describe, it, expect } from "vitest";
import { calculate } from "../lib/tuvi-engine";
import { PRINCIPAL_STARS } from "../lib/tuvi-engine/chart-integrity";
import {
  phucDiBranches,
  phucDiRules,
  phucDiFacts,
  branchKey,
} from "../lib/interpretation-rules/phuc-di";
import { executeRules } from "../lib/interpretation-rules/execute";
import { subjectOf } from "../lib/exploration/model";
import { ruleEvidence } from "../lib/internal-review/tanbien-presentation";
const base = await calculate({
  date: "1992-08-07",
  hour: 16,
  minute: 0,
  unknownTime: false,
  gender: "male",
  calendar: "solar",
  profile: "tanbien-vn-trial-v2",
  place: "Hà Nội",
  timezone: "Asia/Ho_Chi_Minh",
  consent: true,
});
const sunMoonWitness = await calculate({
  ...base.normalized,
  date: "1978-05-06",
  hour: 9,
  gender: "female",
});
// Technical fixtures only. Expected predicates are from the pre-written source rows,
// not copied from actual engine output. Reassigning positions is NEVER an engine witness.
function fixture(r: (typeof phucDiBranches)[number]) {
  const s = structuredClone(base);
  delete s.chart.natalTransformations;
  const p = s.chart.palaces.find((p) => p.name === r.palace)!;
  if (r.branches.length) {
    const q = s.chart.palaces.find((q) => q.earthlyBranch === r.branches[0])!;
    [p.earthlyBranch, q.earthlyBranch] = [q.earthlyBranch, p.earthlyBranch];
  }
  const wanted = r.minor ? ["Thiên Phủ"] : r.stars;
  for (const q of s.chart.palaces) {
    q.majorStars = [];
    q.minorStars = [];
    q.adjectiveStars = [];
  }
  const star = (name: string) =>
    ({
      name,
      scope: "origin",
      type: "major",
      brightness: "",
      mutagen: "",
    }) as any;
  p.majorStars = wanted.map(star);
  const rest = s.chart.palaces.find((q) => q !== p)!;
  rest.majorStars = PRINCIPAL_STARS.filter((n) => !wanted.includes(n)).map(
    star,
  );
  if (r.minor) {
    if (r.stars[0].startsWith("Hóa "))
      p.majorStars[0].mutagen = r.stars[0].slice(4);
    else p.minorStars.push(star(r.stars[0]));
  }
  if (r.id === "thai-tue") (p as any).suiqian12 = "Thái Tuế";
  if (r.id === "nhat-nguyet-ky") p.majorStars[0].mutagen = "Kỵ";
  if (r.id === "ma" && r.palace === "Thiên Di") {
    const bs = s.chart.palaces.map((q) => q.earthlyBranch);
    const i = bs.indexOf(p.earthlyBranch);
    s.chart.tanBien!.voidRanges = [
      { name: "Tuần Không", branches: [bs[(i + 2) % 12], bs[(i + 3) % 12]] },
      { name: "Triệt Lộ", branches: [bs[(i + 4) % 12], bs[(i + 5) % 12]] },
    ] as any;
  }
  return s;
}
for (const [ridx, r] of phucDiBranches.entries()) {
  const rule = phucDiRules[ridx],
    status = (s: any) =>
      executeRules(s, [rule], "internal-draft").traces[0].status;
  describe(branchKey(r), () => {
    it("source condition positive, correct subject/source and draft gate", () => {
      const s = r.id === "nhat-nguyet" ? sunMoonWitness : fixture(r),
        run = executeRules(s, [rule], "internal-draft");
      expect(run.traces[0].status).toBe("matched");
      expect(subjectOf(run.previewClaims[0])).toBe(r.palace);
      expect(ruleEvidence(s, rule).facts[0].text).toContain(r.palace);
      expect(rule.sourceReferences[0].location).toContain(r.page);
      expect(rule.status).toBe("draft");
      expect(rule.review).toBeNull();
      expect(executeRules(s, [rule], "customer").approvedClaims).toHaveLength(
        0,
      );
    });
    it("wrong palace and missing list never match; annual cannot trigger; no snapshot mutation", () => {
      const s = fixture(r),
        p = s.chart.palaces.find((p) => p.name === r.palace)!;
      const before = JSON.stringify(s);
      phucDiFacts(s);
      expect(JSON.stringify(s)).toBe(before);
      const q = s.chart.palaces.find((q) => q.name === "Mệnh")!;
      [p.name, q.name] = [q.name, p.name];
      expect(status(s)).not.toBe("matched");
      const x = fixture(r);
      delete (x.chart.palaces.find((p) => p.name === r.palace)! as any)
        .majorStars;
      expect(status(x)).toBe("missing-facts");
      const y = fixture(r);
      (
        y.chart.palaces.find((p) => p.name === r.palace)!.majorStars[0] as any
      ).scope = "yearly";
      expect(status(y)).toBe("missing-facts");
    });
    it("each required major and branch is enforced; missing completeness remains unknown", () => {
      const s = fixture(r),
        p = s.chart.palaces.find((p) => p.name === r.palace)!;
      delete (s.chart.tanBien as any).completeness;
      expect(status(s)).toBe("missing-facts");
      if (!r.minor)
        for (const n of r.stars) {
          const x = fixture(r),
            a = x.chart.palaces.find((p) => p.name === r.palace)!,
            b = x.chart.palaces.find((p) => p !== a && p.majorStars.length)!;
          b.majorStars.push(
            a.majorStars.splice(
              a.majorStars.findIndex((st) => st.name === n),
              1,
            )[0],
          );
          expect(status(x)).not.toBe("matched");
        }
      if (r.branches.length) {
        const x = fixture(r),
          a = x.chart.palaces.find((p) => p.name === r.palace)!,
          b = x.chart.palaces.find(
            (p) => !r.branches.includes(p.earthlyBranch),
          )!;
        [a.earthlyBranch, b.earthlyBranch] = [b.earthlyBranch, a.earthlyBranch];
        expect(status(x)).toBe("condition-false");
      }
    });
  });
}
it("Phúc Nhật Nguyệt: certificate absence unknown; Ky positive selects exception alone; inconsistent certificate unknown", () => {
  const r = phucDiBranches.find((r) => r.id === "nhat-nguyet-ky")!,
    s = fixture(r),
    rules = phucDiRules.filter((r) => r.id.includes("phuc-nhat-nguyet"));
  expect(
    executeRules(s, rules, "internal-draft").previewClaims.flatMap((c) =>
      c.rules.map((r) => r.id),
    ),
  ).toEqual(["tanbien.phuc-nhat-nguyet-ky"]);
  s.chart.palaces.find((p) => p.name === "Phúc Đức")!.majorStars[0].mutagen =
    "";
  expect(
    executeRules(s, rules, "internal-draft").traces.every(
      (t) => t.status === "missing-facts",
    ),
  ).toBe(true);
  s.chart.natalTransformations = base.chart.natalTransformations;
  expect(executeRules(s, rules, "internal-draft").previewClaims).toHaveLength(
    0,
  );
});
it("Mã directly under barrier does not emit the unqualified Di gloss; missing barrier contract unknown", () => {
  const r = phucDiBranches.find(
      (r) => r.id === "ma" && r.palace === "Thiên Di",
    )!,
    s = fixture(r),
    rule = phucDiRules.find((r) => r.id === "tanbien.di-ma")!,
    p = s.chart.palaces.find((p) => p.name === "Thiên Di")!,
    bs = [
      "Tý",
      "Sửu",
      "Dần",
      "Mão",
      "Thìn",
      "Tỵ",
      "Ngọ",
      "Mùi",
      "Thân",
      "Dậu",
      "Tuất",
      "Hợi",
    ];
  s.chart.tanBien!.voidRanges![0].branches = [
    p.earthlyBranch,
    bs[(bs.indexOf(p.earthlyBranch) + 1) % 12],
  ] as any;
  expect(executeRules(s, [rule], "internal-draft").traces[0].status).toBe(
    "condition-false",
  );
  delete (s.chart.tanBien as any).voidRanges;
  expect(executeRules(s, [rule], "internal-draft").traces[0].status).toBe(
    "missing-facts",
  );
});
it("Thái Tuế uses the stored natal cycle, not a yearly star or an absent list", async () => {
  const s = await calculate({
    ...base.normalized,
    date: "1978-05-18",
    hour: 1,
    gender: "female",
  });
  const rule = phucDiRules.find((r) => r.id === "tanbien.phuc-thai-tue")!;
  expect(executeRules(s, [rule], "internal-draft").traces[0].status).toBe(
    "matched",
  );
  const p = s.chart.palaces.find((p) => p.name === "Phúc Đức")!;
  delete (p as any).suiqian12;
  p.minorStars.push({
    name: "Thái Tuế",
    scope: "yearly",
    type: "adjective",
  } as any);
  expect(executeRules(s, [rule], "internal-draft").traces[0].status).toBe(
    "missing-facts",
  );
  const no = structuredClone(base);
  expect(executeRules(no, [rule], "internal-draft").traces[0].status).toBe(
    "condition-false",
  );
  expect(
    phucDiFacts(s).find((f) => f.id === "fact.phuc-thai-tue"),
  ).toBeUndefined();
});
