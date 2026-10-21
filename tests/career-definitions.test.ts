import { describe, it, expect } from "vitest";
import fs from "node:fs";
import {
  BRANCHES,
  directionalRelation,
  sourceRelation,
  voidMembership,
} from "../lib/internal-review/career-definitions";
import {
  careerConditions,
  positionLight,
} from "../lib/internal-review/career-conditions";
import type { ChartSnapshot } from "../lib/tuvi-engine";
describe("source definitions — geometry only, no new claims", () => {
  // Expected manually specified from Thiên Lương PDF123 trine table + sinh/khắc direction.
  const pairs = [
    "Sửu",
    "Tý",
    "Hợi",
    "Tuất",
    "Dậu",
    "Thân",
    "Mùi",
    "Ngọ",
    "Tỵ",
    "Thìn",
    "Mão",
    "Dần",
  ];
  const incoming = [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
  ];
  it.each(BRANCHES)("nhị hợp and opposite for %s", (b) => {
    const i = BRANCHES.indexOf(b);
    expect(directionalRelation(b, pairs[i])?.direction).toBe(
      incoming[i] ? "sinh nhập" : "sinh xuất",
    );
    expect(directionalRelation(b, BRANCHES[(i + 6) % 12])?.direction).toBe(
      [0, 1].includes(i % 4) ? "khắc xuất" : "khắc nhập",
    );
  });
  it("TB general hội is not gặp, nhị or adjacency; explicit local condition wins", () => {
    expect(sourceRelation("Ngọ", "Dần", "hội hợp")).toBe(true);
    expect(sourceRelation("Ngọ", "Tý", "hội hợp")).toBe(true);
    expect(sourceRelation("Ngọ", "Mùi", "hội hợp")).toBe(false);
    expect(sourceRelation("Ngọ", "Dần", "hội hợp", "đồng cung")).toBe(false);
    expect(sourceRelation("Ngọ", "Ngọ", "gặp")).toBeUndefined();
    expect(sourceRelation("?", "Ngọ", "hội hợp")).toBeUndefined();
  });
  it("TL86 pair is local, missing/invalid pair is not absent", () => {
    expect(voidMembership("Ngọ", ["Ngọ", "Mùi"])).toBe(true);
    expect(voidMembership("Thìn", ["Tuất", "Hợi"])).toBe(false);
    for (const p of [
      undefined,
      [],
      ["Ngọ", "Ngọ"],
      ["Ngọ", "Tý"],
      ["?", "Mùi"],
    ])
      expect(voidMembership("Ngọ", p)).toBeUndefined();
  });
  it("brightness remains separate from nature and unknown", () => {
    expect(positionLight("Đắc")).toBe("sáng theo vị trí");
    for (const s of [undefined, "Lợi", "Bất", ""])
      expect(positionLight(s)).toBe("chưa có ánh xạ theo nguồn này");
  });
  // Existing engine-created records, never edited on disk. Mutations below are explicitly technical cases.
  const rows = fs
    .readdirSync(".local/internal-readings")
    .filter((n) => n.endsWith(".json"))
    .map((n) =>
      JSON.parse(fs.readFileSync(".local/internal-readings/" + n, "utf8")),
    );
  it.each(["2005-06-07", "1992-08-07"])(
    "real stored chart %s: local void and distinct directions",
    (date) => {
      const s = rows.find(
        (r) =>
          r.snapshot.normalized.date === date &&
          r.snapshot.profile.id === "tanbien-vn-trial-v2",
      )!.snapshot as ChartSnapshot;
      const a = careerConditions(s, [], true);
      const v = a.rows.find((r) => r.id === "void-position")!;
      expect(v.state).toBe("checked");
      expect(v.text).toContain(
        date.startsWith("2005")
          ? "Quan Lộc thuộc cặp này"
          : "Quan Lộc không thuộc cặp này",
      );
      expect(
        a.rows.find((r) => r.id === "directional-relations")!.text,
      ).toContain(date.startsWith("2005") ? "khắc nhập" : "khắc xuất");
      const technical = structuredClone(s);
      technical.chart.tanBien!.voidRanges = [];
      expect(
        careerConditions(technical, [], true).rows.find(
          (r) => r.id === "void-position",
        )!.state,
      ).toBe("unresolved");
      expect(
        careerConditions(s, [], false).rows.find(
          (r) => r.id === "void-position",
        )!.state,
      ).toBe("unresolved");
    },
  );
});
