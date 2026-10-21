import { expect, it } from "vitest";
import fs from "node:fs";
import {
  linhPosition,
  compareLinh,
  branches,
} from "../lib/internal-review/linh-trial";
const pack = JSON.parse(
  fs.readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
);
it("source-derived explicit branch counts, four sex/polarity cases and groups", () => {
  const cases = [
    ["Thân", "yang", "male", 8, "Dần"],
    ["Sửu", "yin", "female", 8, "Dần"],
    ["Sửu", "yin", "male", 8, "Ngọ"],
    ["Thân", "yang", "female", 8, "Ngọ"],
    ["Dần", "yang", "male", 0, "Mão"],
    ["Ngọ", "yang", "female", 11, "Dần"],
    ["Hợi", "yin", "male", 11, "Dậu"],
    ["Mão", "yin", "female", 11, "Hợi"],
  ] as const;
  for (const [yearBranch, polarity, gender, timeIndex, branch] of cases)
    expect(
      linhPosition({ yearBranch, polarity, gender, timeIndex }),
    ).toMatchObject({ status: "computed", branch });
  const r = linhPosition({
    yearBranch: "Thân",
    polarity: "yang",
    gender: "male",
    timeIndex: 8,
  });
  if (r.status === "computed")
    expect(r.trace.map((t) => t.branch)).toEqual([
      "Tuất",
      "Dậu",
      "Thân",
      "Mùi",
      "Ngọ",
      "Tỵ",
      "Thìn",
      "Mão",
      "Dần",
    ]);
});
it("288 valid combinations agree with independent one-step walking; software consistency only", () => {
  for (const branch of branches)
    for (const gender of ["male", "female"])
      for (let timeIndex = 0; timeIndex < 12; timeIndex++) {
        const yang = ["Tý", "Dần", "Thìn", "Ngọ", "Thân", "Tuất"].includes(
          branch,
        );
        const reverse =
          (yang && gender === "male") || (!yang && gender === "female");
        let expected = ["Dần", "Ngọ", "Tuất"].includes(branch) ? "Mão" : "Tuất";
        const wheel = reverse ? [...branches].reverse() : branches;
        for (let step = 0; step < timeIndex; step++)
          expected = wheel[(wheel.indexOf(expected) + 1) % 12];
        expect(
          linhPosition({
            yearBranch: branch,
            polarity: yang ? "yang" : "yin",
            gender,
            timeIndex,
          }),
        ).toMatchObject({ branch: expected });
      }
});
it("missing and inconsistent inputs remain unknown, never fallback", () => {
  for (const input of [
    {},
    { yearBranch: "Thân", polarity: "yin", gender: "male", timeIndex: 8 },
    { yearBranch: "Thân", polarity: "yang", gender: "male", timeIndex: 12 },
  ])
    expect(linhPosition(input).status).toBe("unknown");
  const s = structuredClone(
    pack.rows.find((r: any) => r.id === "vn-tiantong").snapshot,
  );
  delete s.chart.palaces[0].minorStars;
  expect(compareLinh(s).status).toBe("unknown");
});
it("full pack stays byte-equivalent; sensitivity is separate, old labels and claims are preserved", () => {
  const before = JSON.stringify(pack);
  for (const r of pack.rows) compareLinh(r.snapshot);
  expect(JSON.stringify(pack)).toBe(before);
  const r = compareLinh(
    pack.rows.find((r: any) => r.id === "vn-tiantong").snapshot,
  );
  expect(r.status).toBe("compared");
  if (r.status === "compared") expect(r.lifeMovement).toBe("ra Mệnh");
});
it("private audit independent nine-step trace; never exports original personal data", () => {
  const a = JSON.parse(
    fs.readFileSync(".local/chart-comparison-1992-08-07/audit.json", "utf8"),
  );
  const r = compareLinh(a.snapshot);
  expect(r).toMatchObject({
    status: "compared",
    old: { branch: "Ngọ" },
    proposed: { branch: "Dần" },
  });
  expect(r).not.toHaveProperty("normalized");
});
it("additional real engine sample enters Mệnh; separate sensitivity fixture can change rule claims", () => {
  const entry = JSON.parse(
    fs.readFileSync(
      "lib/internal-review/engine-samples/linh-trial.json",
      "utf8",
    ),
  );
  const r = compareLinh(entry.snapshot);
  expect(r).toMatchObject({
    status: "compared",
    old: { branch: "Hợi" },
    proposed: { branch: "Dậu", palace: "Mệnh" },
    lifeMovement: "vào Mệnh",
  });
  const fixture = structuredClone(entry.snapshot); // Technical fixture, NOT a valid engine chart.
  const life = fixture.chart.palaces.find((p: any) => p.name === "Mệnh");
  life.majorStars = [{ name: "Tử Vi" }];
  life.minorStars = [{ name: "Tả Phù" }, { name: "Hữu Bật" }];
  const outcome = compareLinh(fixture);
  expect(outcome.status).toBe("compared");
  if (outcome.status === "compared") {
    expect(
      outcome.claimsRemoved.flatMap((c) => c.rules.map((r) => r.id)),
    ).toContain("combination.ziwei-assistants");
    expect(
      outcome.claimsAdded.flatMap((c) => c.rules.map((r) => r.id)),
    ).toContain("combination.ziwei-assistants-qualified");
    expect(outcome.factChanges.some((f) => f.id.includes("sat"))).toBe(true);
  }
});
