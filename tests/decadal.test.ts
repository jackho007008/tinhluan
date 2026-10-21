import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { calculate } from "../lib/tuvi-engine";
import { decadalLayer } from "../lib/tuvi-engine/decadal";
import { sheetPalaces } from "../lib/chart-sheet";
const old = JSON.parse(
  fs.readFileSync(
    ".local/internal-readings/8cc3fc09-8c8f-4be3-b84f-974f7c3a9c77.json",
    "utf8",
  ),
).snapshot;
const old92 = JSON.parse(
  fs.readFileSync(
    ".local/internal-readings/2416e5c2-f087-49ba-9640-b226a424ca2b.json",
    "utf8",
  ),
).snapshot;
describe("đại vận: Tân Biên ranges + explicit iztro 2.6.1 supplement", () => {
  it("Kim Thoa Kỷ Mão 15–24, literal source locations and linked Kỷ mutagens", () => {
    const d = decadalLayer(old.chart, 2026, "female");
    expect(d.status).toBe("available");
    expect(d.range).toEqual([15, 24]);
    expect(d.palace).toBe("Phụ Mẫu");
    expect([d.stem, d.branch]).toEqual(["Kỷ", "Mão"]);
    // location.js: Kỷ Khôi Tý/Việt Thân; Xương Dậu/Khúc Tỵ; Lộc Ngọ+羊未/陀巳;
    // Mão belongs Hợi–Mão–Mùi -> Mã Tỵ; Hồng Loan Mão minus Mão -> Tý, Hỷ Ngọ.
    expect(
      Object.fromEntries(
        d.stars.filter((s) => !s.target).map((s) => [s.name, s.branch]),
      ),
    ).toEqual({
      "Thiên Khôi": "Tý",
      "Thiên Việt": "Thân",
      "Văn Xương": "Dậu",
      "Văn Khúc": "Tỵ",
      "Lộc Tồn": "Ngọ",
      "Kình Dương": "Mùi",
      "Đà La": "Tỵ",
      "Thiên Mã": "Tỵ",
      "Hồng Loan": "Tý",
      "Thiên Hỷ": "Ngọ",
    });
    expect(
      d.stars
        .filter((s) => s.target)
        .map((s) => [s.name, s.target!.name, s.branch]),
    ).toEqual([
      ["Hóa Lộc", "Vũ Khúc", "Dần"],
      ["Hóa Quyền", "Tham Lang", "Tý"],
      ["Hóa Khoa", "Thiên Lương", "Mão"],
      ["Hóa Kỵ", "Văn Khúc", "Thân"],
    ]);
    expect(
      d.stars.every(
        (s) => s.scope === "decadal" && s.id && s.version && s.source,
      ),
    ).toBe(true);
  });
  it("inclusive range endpoints, next decade, absent/out-of-range/ambiguous inputs", () => {
    expect(
      [2019, 2028, 2029].map((y) => decadalLayer(old.chart, y, "female").range),
    ).toEqual([
      [15, 24],
      [15, 24],
      [25, 34],
    ]);
    expect(
      [2024, 2033, 2034].map((y) => decadalLayer(old92.chart, y, "male").range),
    ).toEqual([
      [33, 42],
      [33, 42],
      [43, 52],
    ]);
    for (const y of [undefined, 2005, 2200])
      expect(decadalLayer(old.chart, y, "female").status).toBe("unavailable");
    const missing = structuredClone(old.chart);
    missing.palaces.forEach((p: any) => delete p.decadal);
    expect(decadalLayer(missing, 2026, "female").stars).toEqual([]);
    const duplicate = structuredClone(old.chart);
    duplicate.palaces.push(
      duplicate.palaces.find((p: any) => p.name === "Phụ Mẫu"),
    );
    expect(decadalLayer(duplicate, 2026, "female").status).toBe("unavailable");
  });
  it("four independent scopes and natal Lưu Hà; no historical or natal mutation", async () => {
    const before = JSON.stringify(old);
    const now = await calculate(old.normalized);
    expect(now.chart.palaces).toEqual(old.chart.palaces);
    expect(JSON.stringify(old)).toBe(before);
    const entries = (a = false, d = false) =>
      sheetPalaces(now, "tanbien", true, a, false, d).flatMap((p) => p.entries);
    expect(
      entries().filter((e) => ["moving", "decadal"].includes(e.kind)),
    ).toHaveLength(0);
    expect(entries(true).filter((e) => e.kind === "moving")).toHaveLength(9);
    expect(
      entries(false, true).filter((e) => e.kind === "decadal"),
    ).toHaveLength(14);
    expect(
      entries(true, true).filter((e) => ["moving", "decadal"].includes(e.kind)),
    ).toHaveLength(23);
    expect(entries(true, true).find((e) => e.name === "Lưu Hà")?.label).toBe(
      "Lưu Hà",
    );
    expect(
      entries(true, true)
        .filter((e) => e.name === "Lộc Tồn" || e.name === "Lưu Lộc Tồn")
        .map((e) => e.label),
    ).toEqual(expect.arrayContaining(["Lộc Tồn", "L. Lộc Tồn", "ĐV. Lộc Tồn"]));
  });
  it("opposite direction uses saved ranges, never annual flowing position", async () => {
    const s = await calculate({
      ...old.normalized,
      gender: "male",
      viewYear: 2019,
    });
    const d = decadalLayer(s.chart, 2019, "male");
    expect(d.direction).toBe("nghịch");
    expect(d.range).toEqual([15, 24]);
    expect(d.palace).toBe("Huynh Đệ");
    expect(d.branch).toBe("Sửu");
  });
  it("all ten stems from independently transcribed An tinh quyết §§14–15, Dần/Tý conversion", () => {
    const stems = [
      "Giáp",
      "Ất",
      "Bính",
      "Đinh",
      "Mậu",
      "Kỷ",
      "Canh",
      "Tân",
      "Nhâm",
      "Quý",
    ];
    const branches = [
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
    ];
    const expected = [
      ["Sửu", "Mùi", "Dần"],
      ["Tý", "Thân", "Mão"],
      ["Hợi", "Dậu", "Tỵ"],
      ["Hợi", "Dậu", "Ngọ"],
      ["Sửu", "Mùi", "Tỵ"],
      ["Tý", "Thân", "Ngọ"],
      ["Sửu", "Mùi", "Thân"],
      ["Ngọ", "Dần", "Dậu"],
      ["Mão", "Tỵ", "Hợi"],
      ["Mão", "Tỵ", "Tý"],
    ];
    stems.forEach((stem, i) => {
      const c = structuredClone(old.chart);
      c.palaces.forEach((p: any) => (p.decadal.range = [100, 109]));
      Object.assign(c.palaces[0], {
        heavenlyStem: stem,
        earthlyBranch: branches[i],
        decadal: { range: [15, 24] },
      });
      const d = decadalLayer(c, 2026, "female");
      expect(
        ["Thiên Khôi", "Thiên Việt", "Lộc Tồn"].map(
          (n) => d.stars.find((s) => s.name === n)?.branch,
        ),
      ).toEqual(expected[i]);
    });
  });
  it("missing mutagen target gives partial, preserves independent stars", () => {
    const c = structuredClone(old.chart);
    c.palaces.forEach(
      (p: any) =>
        (p.minorStars = p.minorStars.filter((s: any) => s.name !== "Văn Khúc")),
    );
    const d = decadalLayer(c, 2026, "female");
    expect(d.status).toBe("partial");
    expect(d.stars).toHaveLength(13);
    expect(d.issues.join()).toContain("Văn Khúc");
  });
});
