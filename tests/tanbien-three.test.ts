import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadSample } from "../lib/internal-review/samples";
import { calculate, type ChartSnapshot } from "../lib/tuvi-engine";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/tanbien";
import { tanBienLifeTables } from "../lib/interpretation-rules/tanbien-source";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import {
  nearbyNotes,
  sourceNamingNotes,
  conditionText,
} from "../lib/internal-review/tanbien-presentation";
const life = (s: ChartSnapshot) =>
  s.chart.palaces.find((p) => p.name === "Mệnh")!;
const status = (s: ChartSnapshot, id: string) =>
  executeRules(s, tanBienRules, "internal-draft").traces.find(
    (t) => t.ruleId === id,
  )!.status;
for (const [sample, id, star, bad] of [
  ["vn-lianzhen", "tanbien.r10", "Liêm Trinh", "Hợi"],
  ["vn-tanlang", "tanbien.r11", "Tham Lang", "Tý"],
  ["vn-jumen", "tanbien.r12", "Cự Môn", "Ngọ"],
])
  it(`${id}: frozen fictitious engine chart; synthetic boundaries test source conditions`, async () => {
    const loaded = (await loadSample(sample))!;
    const s = loaded.report.snapshot;
    expect(life(s).majorStars.map((s) => s.name)).toContain(star);
    expect((await calculate(loaded.sample.input)).resultId).toBe(s.resultId);
    const before = JSON.stringify(s);
    expect(status(s, id)).toBe("matched");
    const moved = structuredClone(s);
    const st = life(moved).majorStars.find((s) => s.name === star)!;
    life(moved).majorStars = life(moved).majorStars.filter(
      (s) => s.name !== star,
    );
    moved.chart.palaces.find((p) => p.name === "Tài Bạch")!.majorStars.push(st);
    expect(status(moved, id)).toBe("condition-false");
    const wrong = structuredClone(s);
    life(wrong).earthlyBranch = bad;
    expect(status(wrong, id)).toBe("condition-false");
    for (const key of ["earthlyBranch", "majorStars"] as const) {
      const missing = structuredClone(s);
      delete (life(missing) as Partial<ReturnType<typeof life>>)[key];
      expect(status(missing, id)).toBe("missing-facts");
    }
    const missingLookup = structuredClone(s);
    life(missingLookup).earthlyBranch = "unknown";
    expect(status(missingLookup, id)).toBe("missing-facts");
    const label = structuredClone(s);
    life(label).majorStars.forEach((s) => (s.brightness = "Hãm"));
    expect(status(label, id)).toBe("matched");
    expect(
      executeRules(s, tanBienRules, "customer").approvedClaims,
    ).toHaveLength(0);
    const reading = buildTanBienReading(s);
    const p = reading.sections
      .flatMap((s) => s.paragraphs)
      .find((p) => p.claim.rules.some((r) => r.id === id))!;
    expect(p.evidence[0].contentLabel).toContain("Chú giải nền");
    expect(p.evidence[0].conditions.join(" ")).not.toContain("eligible");
    expect(JSON.stringify(s)).toBe(before);
  });
it("book tables: full branch sets and key distinctions; Cự vượng is project narrowing", () => {
  const expected = {
    lianzhen: {
      Miếu: "Thìn,Tuất",
      Vượng: "Tý,Ngọ,Dần,Thân",
      Đắc: "Sửu,Mùi",
      Hãm: "Tỵ,Hợi,Mão,Dậu",
    },
    tanlang: {
      Miếu: "Sửu,Mùi",
      Vượng: "Thìn,Tuất",
      Đắc: "Dần,Thân",
      Hãm: "Tỵ,Hợi,Tý,Ngọ,Mão,Dậu",
    },
    jumen: {
      Miếu: "Mão,Dậu",
      Vượng: "Tý,Ngọ,Dần",
      Đắc: "Thân,Hợi",
      Hãm: "Thìn,Tuất,Sửu,Mùi,Tỵ",
    },
  };
  for (const [key, groups] of Object.entries(expected)) {
    const table = tanBienLifeTables[key as keyof typeof expected];
    expect(Object.keys(table.states)).toHaveLength(12);
    for (const [state, branches] of Object.entries(groups))
      for (const branch of branches.split(","))
        expect(table.states[branch]).toBe(state);
  }
  const r = tanBienRules.find((r) => r.id === "tanbien.r12")!;
  expect(r.presentation!.sourceConditions!.join(" ")).toContain("vượng");
  expect(r.presentation!.projectScope!.join(" ")).toContain("miếu/đắc");
  expect(r.status).toBe("draft");
  expect(r.review).toBeNull();
});
it("nearby limits preserve Triệt and Hỏa context, with no alias, effect or inferred absence", async () => {
  const a = (await loadSample("vn-4"))!.report.snapshot,
    b = (await loadSample("vn-6"))!.report.snapshot;
  expect(
    nearbyNotes(a, "tanbien.r08")
      .map((n) => n.text)
      .join(" "),
  ).toContain("Triệt Lộ tại Mệnh");
  expect(
    nearbyNotes(b, "tanbien.r09")
      .map((n) => n.text)
      .join(" "),
  ).toContain("Hỏa Tinh");
  expect(
    sourceNamingNotes(b)
      .map((n) => n.text)
      .join(" "),
  ).toContain("chưa đồng nhất với Địa Không");
  const a1 = JSON.stringify(buildTanBienReading(a));
  buildTanBienReading(b);
  expect(JSON.stringify(buildTanBienReading(a))).toBe(a1);
  const missing = structuredClone(a);
  delete (life(missing) as Partial<ReturnType<typeof life>>).minorStars;
  expect(
    nearbyNotes(missing, "tanbien.r08")
      .map((n) => n.text)
      .join(" "),
  ).toContain("Chưa có dữ liệu xác định đầy đủ");
  expect(status(missing, "tanbien.r08")).toBe("matched"); // absence of peripheral context is not an invented prerequisite
});
it("short review and full export use same run and real claims including nearby caveats", () => {
  const rows = JSON.parse(
    readFileSync("exports/tanbien-reading-examples.json", "utf8"),
  );
  const short = readFileSync("exports/tanbien-reading-review.md", "utf8");
  expect(short).toContain(rows[0].runId);
  for (const r of rows)
    for (const s of r.sections)
      for (const p of s.paragraphs) {
        expect(short).toContain(p.display.text);
        for (const n of p.nearbyNotes) expect(short).toContain(n.text);
      }
  expect(short).not.toContain("chart.palaces");
});
