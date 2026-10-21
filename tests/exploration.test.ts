import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { exploration, fullText, subjectOf } from "../lib/exploration/model";
import type { InternalReading } from "../lib/internal-review/reading-store";
const load = (id: string) =>
  JSON.parse(
    fs.readFileSync(".local/internal-readings/" + id + ".json", "utf8"),
  ) as InternalReading;
const kim = load("9f53ec47-4361-49b6-953c-6238060cbb08"),
  tai = load("d7953053-6452-4f9c-a3a1-b2fe46eda69d");
describe("actual saved reading exploration", () => {
  it("binds exact frozen paragraphs, does not mutate records, uses each profile ranges", () => {
    for (const r of [kim, tai]) {
      const before = JSON.stringify(r),
        m = exploration(r.snapshot, r.frozen);
      expect(m.paragraphs.map((p) => p.text)).toEqual(
        r.frozen.reading.sections.flatMap((s) =>
          s.paragraphs.map((p) => p.display.text),
        ),
      );
      expect(m.palaces).toHaveLength(12);
      expect(m.decades.map((d) => d.range)).toEqual(
        r.snapshot.chart.palaces
          .map((p) => p.decadal.range)
          .sort((a, b) => a[0] - b[0]),
      );
      expect(JSON.stringify(r)).toBe(before);
      expect(fullText(m)).toContain(r.snapshot.resultId);
    }
    expect(exploration(kim.snapshot, kim.frozen).decades[0].range).toEqual([
      5, 14,
    ]);
    expect(exploration(tai.snapshot, tai.frozen).decades[0].range).toEqual([
      3, 12,
    ]);
  });
  it("keeps customer gate closed to drafts, does not attach natal claims to decades", () => {
    const m = exploration(kim.snapshot);
    expect(m.paragraphs).toHaveLength(0);
    expect(m.decades.every((d) => !("claims" in d))).toBe(true);
    expect(m.traces.some((t) => t.status === "not-approved")).toBe(true);
  });
  it("distinguishes missing and empty majors; no-rule palace keeps facts", () => {
    const s = structuredClone(kim.snapshot);
    delete (s.chart.palaces[0] as Partial<(typeof s.chart.palaces)[0]>)
      .majorStars;
    const m = exploration(s);
    expect(m.palaces[0].major).toBeNull();
    expect(m.palaces.find((p) => p.name === "Nô Bộc")?.major).toEqual([]);
    expect(
      m.palaces.find((p) => p.name === "Nô Bộc")?.facts.length,
    ).toBeGreaterThan(0);
    expect(m.palaces.find((p) => p.name === "Nô Bộc")?.claims).toEqual([]);
  });
  it("does not infer absence from unverified empty lists", () => {
    const snapshot = structuredClone(kim.snapshot);
    snapshot.chart.tanBien!.completeness.majorStars = "partial";
    const m = exploration(snapshot);
    expect(m.palaces.find((p) => p.name === "Nô Bộc")?.majorNotice).toBe(
      "Chưa xác nhận danh sách chính tinh đầy đủ.",
    );
  });
  it("rejects mixed snapshots and scopes subject rather than every evidence palace", () => {
    expect(() => exploration(tai.snapshot, kim.frozen)).toThrow(
      "SNAPSHOT_MISMATCH",
    );
    const m = exploration(kim.snapshot, kim.frozen);
    const c = m.paragraphs.find((p) =>
      p.claim.factIds.includes("fact.life-stars"),
    )!;
    expect(subjectOf(c.claim)).toBe("Mệnh");
    expect(
      m.palaces.filter((p) => p.claims.includes(c.id)).map((p) => p.name),
    ).toEqual(["Mệnh"]);
  });
  it("marks exact year bounds separately from stage selection and handles missing year", () => {
    for (const [year, palace] of [
      [2028, "Phụ Mẫu"],
      [2029, "Phúc Đức"],
    ] as const) {
      const s = structuredClone(kim.snapshot);
      s.normalized.viewYear = year;
      expect(
        exploration(s)
          .decades.filter((d) => d.current)
          .map((d) => d.palace),
      ).toEqual([palace]);
    }
    const s = structuredClone(kim.snapshot);
    delete s.normalized.viewYear;
    expect(exploration(s).decades.some((d) => d.current)).toBe(false);
  });
});
