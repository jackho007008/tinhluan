import { describe, it, expect } from "vitest";
import fs from "node:fs";
import {
  engineBrightness,
  palaceDisplayData,
  periodDisplay,
  starScope,
  starState,
  recordedLayers,
  disputedStars,
} from "../lib/chart-presentation";
import { executeRules } from "../lib/interpretation-rules/execute";
import { catalog } from "../lib/interpretation-rules/catalog";
const audit = JSON.parse(
  fs.readFileSync(".local/chart-comparison-1992-08-07/audit.json", "utf8"),
);
const snapshot = audit.snapshot;
describe("presentation only, iztro and Tan Bien remain separate", () => {
  it("corrects only pinned brightness xian legacy translation, never period/prose", () => {
    expect(engineBrightness("Hạn", "iztro@2.6.1")).toBe("Hãm");
    expect(engineBrightness("Đại Hạn", "iztro@2.6.1")).toBe("Đại Hạn");
    expect(engineBrightness("Hạn", "unknown")).toBe("Hạn");
    expect(engineBrightness(undefined, "iztro@2.6.1")).toContain("Chưa");
  });
  it("uses source states, no fallback including missing table and branch", () => {
    const s = { name: "Tử Vi", brightness: "Đắc" };
    expect(starState(s, "Thìn", snapshot, "tanbien").display).toBe("Vượng");
    expect(starState(s, "Thìn", snapshot, "engine").display).toBe("Đắc");
    expect(starState(s, "?", snapshot, "tanbien").display).toContain(
      "Chưa có đối chiếu trạng thái",
    );
    expect(
      starState(
        { name: "Thiên Phủ", brightness: "Miếu" },
        "Tý",
        snapshot,
        "tanbien",
      ).display,
    ).toContain("Chưa có đối chiếu trạng thái");
    expect(starState(s, "Thìn", snapshot, "tanbien").raw).toBe("Đắc");
  });
  it("keeps saved stars, master and full evaluator output unchanged while formatting each palace", () => {
    const before = JSON.stringify(snapshot),
      execution = executeRules(snapshot, catalog, "internal-draft");
    snapshot.chart.palaces.forEach((p: any) => {
      recordedLayers(p);
      for (const g of ["majorStars", "minorStars", "adjectiveStars"])
        p[g].forEach((s: any) =>
          starState(s, p.earthlyBranch, snapshot, "tanbien"),
        );
    });
    expect(JSON.stringify(snapshot)).toBe(before);
    expect(snapshot.chart.soul).toBe("Tham Lang");
    expect(executeRules(snapshot, catalog, "internal-draft")).toEqual(
      execution,
    );
    expect(disputedStars(snapshot)).toContain("Linh Tinh tại Thiên Di (Ngọ)");
    expect(disputedStars(snapshot)).toContain("Thiên Quý tại Tật Ách (Mùi)");
  });
  it("does not invent missing rings or stars", () => {
    const p = structuredClone(snapshot.chart.palaces[0]);
    delete p.boshi12;
    expect(recordedLayers(p).find((x) => x.key === "boshi12")?.value).toBe(
      "Không có trong snapshot",
    );
  });
});

describe("full chart selected data contract", () => {
  it("preserves every recorded star path, mutagen association and origin scope; no extra star for each transformation", () => {
    const before = JSON.stringify(snapshot);
    const displayed: ReturnType<typeof palaceDisplayData>[number]["stars"] =
      snapshot.chart.palaces.flatMap((p: any, i: number) =>
        palaceDisplayData(p, i).flatMap((g) => g.stars),
      );
    const expected = snapshot.chart.palaces.flatMap((p: any, i: number) =>
      ["majorStars", "minorStars", "adjectiveStars"].flatMap((g) =>
        p[g].map((s: any, j: number) => ({
          path: `chart.palaces.${i}.${g}.${j}`,
          star: s,
        })),
      ),
    );
    expect(displayed.map((s) => ({ path: s.path, star: s.star }))).toEqual(
      expected,
    );
    expect(
      displayed
        .filter((s) => s.star.mutagen)
        .every((s) => s.scope === "bản mệnh"),
    ).toBe(true);
    expect(displayed.map((s) => s.star.name)).toEqual(
      expect.arrayContaining([
        "Văn Khúc",
        "Kình Dương",
        "Linh Tinh",
        "Hỏa Tinh",
        "Tuần Không",
        "Triệt Lộ",
      ]),
    );
    expect(JSON.stringify(snapshot)).toBe(before);
  });
  it("missing lists and periods remain distinct from saved empty lists; non-origin is not labelled natal", () => {
    const p = structuredClone(snapshot.chart.palaces[0]);
    delete p.minorStars;
    p.adjectiveStars = [];
    p.ages = [];
    expect(
      palaceDisplayData(p, 0).find((g) => g.key === "minorStars")?.status,
    ).toBe("missing");
    expect(
      palaceDisplayData(p, 0).find((g) => g.key === "adjectiveStars")?.status,
    ).toBe("empty");
    expect(periodDisplay(p).find((x) => x.key === "ages")?.value).toBe(
      "Danh sách đã lưu rỗng",
    );
    delete p.ages;
    expect(periodDisplay(p).find((x) => x.key === "ages")?.value).toBe(
      "Không có trong snapshot",
    );
    expect(starScope({ name: "test" })).toBe("chưa ghi lớp áp dụng");
    expect(starScope({ name: "test", scope: "yearly" } as any)).not.toBe(
      "bản mệnh",
    );
  });
});
