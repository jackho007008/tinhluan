import { expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { loadSample } from "../lib/internal-review/samples";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/tanbien";
import { tanBienLifeTables } from "../lib/interpretation-rules/tanbien-source";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const life = (s: ChartSnapshot) =>
  s.chart.palaces.find((p) => p.name === "Mệnh")!;
const status = (s: ChartSnapshot, id: string) =>
  executeRules(s, tanBienRules, "internal-draft").traces.find(
    (t) => t.ruleId === id,
  )!.status;
it("Tân Biên source tables are independently transcribed, not engine labels", () => {
  expect(tanBienLifeTables.ziwei.states).toEqual({
    Tỵ: "Miếu",
    Ngọ: "Miếu",
    Dần: "Miếu",
    Thân: "Miếu",
    Thìn: "Vượng",
    Tuất: "Vượng",
    Sửu: "Đắc",
    Mùi: "Đắc",
    Hợi: "Bình hòa",
    Tý: "Bình hòa",
    Mão: "Bình hòa",
    Dậu: "Bình hòa",
  });
  expect(tanBienLifeTables.tianxiang.states.Mão).toBe("Hãm");
  expect(tanBienLifeTables.tianxiang.states.Tỵ).toBe("Đắc");
});
for (const [sample, rule, star, excluded] of [
  ["vn-4", "tanbien.r08", "Tử Vi", "Thìn"],
  ["vn-6", "tanbien.r09", "Thiên Tướng", "Mão"],
])
  it(`${rule}: correct palace, source state, missing/other palace synthetic boundaries`, async () => {
    const s = (await loadSample(sample))!.report.snapshot;
    expect(life(s).majorStars.map((s) => s.name)).toContain(star);
    expect(status(s, rule)).toBe("matched");
    const before = JSON.stringify(s);
    // Every mutation is a technical fixture, not an engine-valid chart.
    const moved = structuredClone(s);
    const starData = life(moved).majorStars.find((s) => s.name === star)!;
    life(moved).majorStars = [];
    moved.chart.palaces
      .find((p) => p.name === "Quan Lộc")!
      .majorStars.push(starData);
    expect(status(moved, rule)).toBe("condition-false");
    const wrongState = structuredClone(s);
    life(wrongState).earthlyBranch = excluded;
    expect(status(wrongState, rule)).toBe("condition-false");
    const unknown = structuredClone(s);
    delete (life(unknown) as Partial<ReturnType<typeof life>>).earthlyBranch;
    expect(status(unknown, rule)).toBe("missing-facts");
    const missing = structuredClone(s);
    delete (life(missing) as Partial<ReturnType<typeof life>>).majorStars;
    expect(status(missing, rule)).toBe("missing-facts");
    const differentEngine = structuredClone(s);
    life(differentEngine).majorStars[0].brightness = "Hãm";
    expect(status(differentEngine, rule)).toBe("matched");
    expect(life(differentEngine).majorStars[0].brightness).toBe("Hãm");
    expect(
      executeRules(s, tanBienRules, "customer").approvedClaims,
    ).toHaveLength(0);
    expect(JSON.stringify(s)).toBe(before);
  });
it("titles use claim metadata; meanings remain separate for Tử Vi–Thiên Phủ", async () => {
  const r = buildTanBienReading((await loadSample("vn-20"))!.report.snapshot);
  expect(r.sections.find((s) => s.id === "learning")!.title).toBe(
    "Sự chủ động",
  );
  const combined = buildTanBienReading(
    (await loadSample("vn-12"))!.report.snapshot,
  );
  expect(
    combined.sections
      .flatMap((s) => s.claims.flatMap((c) => c.rules.map((r) => r.id)))
      .sort(),
  ).toEqual(["tanbien.finance-vu-thin-tuat", "tanbien.r03", "tanbien.r08"]);
  expect(
    combined.sections
      .flatMap((s) => s.paragraphs)
      .every((p) => p.evidence[0].contentLabel.includes("Chú giải nền")),
  ).toBe(true);
  const r04 = tanBienRules.find((r) => r.id === "tanbien.r04")!;
  expect(r04.presentation!.sourceConditions![0]).toContain("biểu tượng chung");
  expect(r04.presentation!.projectScope![0]).toContain("thu hẹp");
});
it("MD and JSON export share run, versions, claims and real relative file link", () => {
  const json = readFileSync("exports/tanbien-reading-examples.json", "utf8");
  const rows = JSON.parse(json);
  const md = readFileSync("exports/tanbien-reading-examples.md", "utf8");
  expect(rows).toHaveLength(19);
  expect(new Set(rows.map((r: { runId: string }) => r.runId)).size).toBe(1);
  expect(md).toContain(rows[0].runId);
  expect(md).toContain(createHash("sha256").update(json).digest("hex"));
  expect(md).toContain("(./tanbien-reading-examples.json)");
  expect(md).not.toContain("..");
  for (const r of rows) {
    expect(md).toContain(r.id);
    expect(md).toContain(r.templateVersion);
    for (const s of r.sections)
      for (const c of s.claims) {
        expect(md).toContain(c.text);
        expect(md).toContain(c.id);
      }
  }
});
