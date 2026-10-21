import { it, expect } from "vitest";
import fs from "node:fs";
import {
  sheetPalaces,
  sheetVoids,
  BRANCH_POSITION,
  stateCode,
} from "../lib/chart-sheet";
import { executeRules } from "../lib/interpretation-rules/execute";
import { catalog } from "../lib/interpretation-rules/catalog";
// Private audit remains local; no birth data copied into a public fixture.
const s = JSON.parse(
  fs.readFileSync(
    ".local/internal-readings/be2c9b04-e80f-4438-af2f-25845f3ef05b.json",
    "utf8",
  ),
).snapshot;
it("maps all selected source paths exactly once, including pair annotations and merged ring aliases", () => {
  const before = JSON.stringify(s),
    execution = executeRules(s, catalog, "internal-draft");
  const cells = sheetPalaces(s, "tanbien"),
    voids = sheetVoids(s);
  const paths = [
    ...cells.flatMap((c) =>
      [...c.majors, ...c.entries].flatMap((e) => e.paths),
    ),
    ...voids.flatMap((v) => v.paths),
  ];
  for (const [i, p] of s.chart.palaces.entries()) {
    for (const group of ["majorStars", "minorStars", "adjectiveStars"])
      for (const [j, star] of p[group].entries()) {
        const path = `chart.palaces.${i}.${group}.${j}`;
        expect(paths.filter((x) => x === path)).toHaveLength(1);
        if (star.mutagen)
          expect(paths.filter((x) => x === `${path}.mutagen`)).toHaveLength(1);
      }
    for (const ring of ["boshi12", "suiqian12", "jiangqian12"])
      expect(
        paths.filter((x) => x === `chart.palaces.${i}.${ring}`),
      ).toHaveLength(1);
  }
  expect(JSON.stringify(s)).toBe(before);
  expect(executeRules(s, catalog, "internal-draft")).toEqual(execution);
});
it("anchors every supported pair by branch, including coincident ranges", () => {
  const pairs = [
    ["Tý", "Sửu"],
    ["Dần", "Mão"],
    ["Thìn", "Tỵ"],
    ["Ngọ", "Mùi"],
    ["Thân", "Dậu"],
    ["Tuất", "Hợi"],
  ];
  const expected = [
    [600, 1230],
    [150, 1230],
    [150, 410],
    [600, 410],
    [1050, 410],
    [1050, 1230],
  ];
  pairs.forEach((branches, i) => {
    const copy = structuredClone(s);
    copy.chart.tanBien.voidRanges = [
      { name: "Tuần Không", branches },
      { name: "Triệt Lộ", branches: [...branches].reverse() },
    ];
    const v = sheetVoids(copy);
    expect(v).toHaveLength(1);
    expect([v[0].x, v[0].y]).toEqual(expected[i]);
    expect(v[0].label).toBe("Tuần/Triệt");
  });
  expect(
    new Set(Object.values(BRANCH_POSITION).map((x) => x.join(","))).size,
  ).toBe(12);
});
it("does not merge same-named stars from different layers or unrelated ring records", () => {
  const c = structuredClone(s);
  const p = c.chart.palaces[0];
  p.adjectiveStars = [
    { name: "Hoa Cái", scope: "origin" },
    { name: "Hoa Cái", scope: "yearly" },
    { name: "Khác", scope: "origin" },
  ];
  p.jiangqian12 = "Hoa Cái";
  p.boshi12 = "Khác";
  const entries = sheetPalaces(c, "tanbien", true, true)[0].entries;
  expect(entries.filter((e) => e.name === "Hoa Cái")).toHaveLength(2);
  expect(entries.filter((e) => e.name === "Khác")).toHaveLength(2);
});
it("distinguishes missing, recorded empty and complete empty; never uses engine brightness as book fallback", () => {
  const c = structuredClone(s);
  delete c.chart.palaces[0].majorStars;
  expect(sheetPalaces(c, "tanbien")[0].missing).toContain("Chưa có chính tinh");
  c.chart.palaces[0].majorStars = [];
  expect(sheetPalaces(c, "tanbien")[0].emptyMajor).toBe("Vô chính diệu");
  c.chart.tanBien.completeness.majorStars = "unknown";
  expect(sheetPalaces(c, "tanbien")[0].emptyMajor).toContain("ghi rỗng");
  expect(
    stateCode(
      { name: "Sao không có bảng", brightness: "Miếu" },
      "Tý",
      s,
      "tanbien",
    ),
  ).toBe("");
  expect(
    stateCode(
      { name: "Sao", brightness: "Hạn" },
      "Tý",
      { ...s, chart: { ...s.chart, tanBien: undefined } },
      "engine",
    ),
  ).toBe("H");
});
it("compact mode omits other layers deliberately, full mode retains their identity", () => {
  const c = structuredClone(s);
  c.chart.tanBien.viewing = {
    year: 2030,
    stars: [
      {
        name: "Lưu Linh",
        scope: "year",
        branch: c.chart.palaces[0].earthlyBranch,
      },
    ],
    months: [],
    annual: "Tý",
  };
  expect(sheetPalaces(c, "tanbien", false)[0].entries).toEqual([]);
  expect(
    sheetPalaces(c, "tanbien", true, true)[0].entries.find(
      (e) => e.kind === "moving",
    )?.paths,
  ).toEqual(["chart.tanBien.viewing.stars.0"]);
});

it("draws exactly two trines and one opposite for every palace without changing facts", async () => {
  const { sheetRays } = await import("../lib/chart-sheet");
  const before = JSON.stringify(s);
  for (const p of s.chart.palaces) {
    const rays = sheetRays(s, p.earthlyBranch);
    expect(rays).toHaveLength(3);
    expect(rays.filter((r) => r.relation === "tam hợp")).toHaveLength(2);
    expect(rays.filter((r) => r.relation === "đối cung")).toHaveLength(1);
    for (const r of rays) {
      expect(r.from.x).toBeGreaterThanOrEqual(300);
      expect(r.to.x).toBeLessThanOrEqual(900);
      expect(r.from.y).toBeGreaterThanOrEqual(410);
      expect(r.to.y).toBeLessThanOrEqual(1230);
    }
  }
  expect(
    sheetRays(s, "Tý")
      .map((r) => r.branch)
      .sort(),
  ).toEqual(["Thìn", "Thân", "Ngọ"].sort());
  expect(
    sheetRays(s, "Dần")
      .map((r) => r.branch)
      .sort(),
  ).toEqual(["Ngọ", "Tuất", "Thân"].sort());
  const partial = structuredClone(s);
  partial.chart.palaces.pop();
  expect(sheetRays(partial, "Tý")).toEqual([]);
  expect(sheetRays(s, "?")).toEqual([]);
  expect(JSON.stringify(s)).toBe(before);
});

it("hiding the annual layer preserves every natal entity and the snapshot", () => {
  const trial = structuredClone(s);
  trial.chart.tanBien.viewing = {
    year: 2026,
    canChi: "Bính Ngọ",
    age: 30,
    ageConvention: "test",
    stars: [{ name: "Lưu Thiên Mã", branch: "Tý", scope: "year" }],
    annual: "Tý",
    decade: "Ngọ",
    months: [{ month: 1, branch: "Tý" }],
  };
  const before = JSON.stringify(trial);
  const on = sheetPalaces(trial, "tanbien", true, true),
    off = sheetPalaces(trial, "tanbien", true, false);
  expect(
    on.flatMap((c) => c.entries).filter((e) => e.kind === "moving"),
  ).toHaveLength(1);
  expect(
    off.flatMap((c) => c.entries).filter((e) => e.kind === "moving"),
  ).toHaveLength(0);
  expect(
    on.flatMap((c) => c.entries).filter((e) => e.kind !== "moving"),
  ).toEqual(off.flatMap((c) => c.entries));
  expect(off.some((c) => c.annual || c.months)).toBe(false);
  expect(JSON.stringify(trial)).toBe(before);
});
