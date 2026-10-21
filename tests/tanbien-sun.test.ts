import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadSample } from "../lib/internal-review/samples";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { tanBienRules } from "../lib/interpretation-rules/tanbien";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienLifeTables } from "../lib/interpretation-rules/tanbien-source";
import { sourceTablesForRule } from "../lib/internal-review/tanbien-presentation";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const life = (s: ChartSnapshot) =>
  s.chart.palaces.find((p) => p.name === "Mệnh")!;
const status = (s: ChartSnapshot, id = "tanbien.r21") =>
  executeRules(s, tanBienRules, "internal-draft").traces.find(
    (t) => t.ruleId === id,
  )!.status;
it("actual engine samples keep R14 unchanged and distinguish the Hợi/Tý source branch", async () => {
  for (const [id, branch, r14, r21] of [
    ["vn-16", "Tý", "condition-false", "matched"],
    ["vn-taiyang", "Ngọ", "matched", "condition-false"],
    ["vn-tianliang", "Mão", "matched", "condition-false"],
  ]) {
    const s = (await loadSample(id))!.report.snapshot;
    const before = JSON.stringify(s);
    expect(life(s).earthlyBranch).toBe(branch);
    expect(life(s).majorStars.some((x) => x.name === "Thái Dương")).toBe(true);
    expect(status(s, "tanbien.r14")).toBe(r14);
    expect(status(s)).toBe(r21);
    expect(
      executeRules(s, tanBienRules, "customer").approvedClaims,
    ).toHaveLength(0);
    expect(JSON.stringify(s)).toBe(before);
  }
});
it("technical fixtures: correct palace, verified source state and missing facts; no engine brightness fallback", async () => {
  const base = (await loadSample("vn-16"))!.report.snapshot;
  // Modified snapshots here are synthetic evaluator fixtures, never engine charts.
  for (const branch of ["Tý", "Hợi"]) {
    const s = structuredClone(base);
    life(s).earthlyBranch = branch;
    life(s).majorStars[0].brightness = "Miếu";
    expect(status(s)).toBe("matched");
  }
  for (const branch of ["Thân", "Dậu", "Tuất", "Ngọ"]) {
    const s = structuredClone(base);
    life(s).earthlyBranch = branch;
    expect(status(s)).toBe("condition-false");
  }
  const moved = structuredClone(base);
  const star = life(moved).majorStars[0];
  life(moved).majorStars = [];
  moved.chart.palaces.find((p) => p.name === "Quan Lộc")!.majorStars.push(star);
  expect(status(moved)).toBe("condition-false");
  for (const field of ["majorStars", "earthlyBranch"] as const) {
    const s = structuredClone(base);
    delete (life(s) as Partial<ReturnType<typeof life>>)[field];
    expect(status(s)).toBe("missing-facts");
  }
  const table = tanBienLifeTables.taiyang.states as Record<string, string>;
  const saved = table.Tý;
  try {
    delete table.Tý;
    expect(status(base)).toBe("missing-facts");
  } finally {
    table.Tý = saved;
  }
  const r = tanBienRules.find((r) => r.id === "tanbien.r21")!;
  expect(r.status).toBe("draft");
  expect(r.review).toBeNull();
  expect(r.version).toBe("0.1.1");
  expect(sourceTablesForRule(r).taiyang.version).toBe("1.0.0");
});
it("scope notice is based on presence of principal-star interpretation, not paragraph count; context stays linked", async () => {
  const outside = buildTanBienReading(
    (await loadSample("vn-2"))!.report.snapshot,
  );
  expect(outside.lifeMajorNotice).toContain(
    "Chưa có diễn giải cho trường hợp Mệnh không có chính tinh này",
  );
  const a = buildTanBienReading((await loadSample("vn-16"))!.report.snapshot);
  const partial = structuredClone((await loadSample("vn-16"))!.report.snapshot);
  life(partial).earthlyBranch = "Thân";
  const thin = buildTanBienReading(partial);
  expect(thin.sections.flatMap((s) => s.claims.flatMap(c=>c.rules.map(r=>r.id))).sort()).toEqual(["tanbien.r07", "tanbien.r32"]);
  expect(thin.lifeMajorNotice).toBe("Chưa có diễn giải cho các chính tinh tại Mệnh trong phạm vi hiện hỗ trợ");
  expect(a.lifeMajorNotice).toBeNull();
  expect(a.sections.find((s) => s.id === "learning")!.title).toBe("Học hỏi");
  for (const s of a.sections)
    for (const p of s.paragraphs) {
      expect(p.display.contextLink).toBeTruthy();
      expect(
        a.contexts.some((c) => "context-" + c.ids[0] === p.display.contextLink),
      ).toBe(true);
    }
  expect(a.contextPolicy).not.toContain("chưa được tổng hợp");
});
it("exports share run and preserve every prior rule definition and result; only R21 is added", () => {
  const old = JSON.parse(
    readFileSync("exports/tanbien-reading-v1.7-archive/examples.json", "utf8"),
  );
  const now = JSON.parse(
    readFileSync("exports/tanbien-reading-examples.json", "utf8"),
  );
  const map = JSON.parse(
    readFileSync("exports/tanbien-sun-sentence-map.json", "utf8"),
  );
  expect(map.runId).toBe(now[0].runId);
  for (const b of old) {
    const n = now.find((r: any) => r.id === b.id);
    expect(n.snapshotId).toBe(b.snapshotId);
    expect(
      n.execution.traces.filter((t: any) => t.ruleId !== "tanbien.r21"),
    ).toEqual(b.execution.traces);
    expect(
      n.execution.previewClaims.filter(
        (c: any) => !c.rules.some((r: any) => r.id === "tanbien.r21"),
      ),
    ).toEqual(b.execution.previewClaims);
  }
  for (const file of [
    "exports/tanbien-reading-examples.md",
    "exports/tanbien-reading-review.md",
    "exports/tanbien-sun-review.md",
  ])
    expect(readFileSync(file, "utf8")).toContain(map.runId);
  expect(
    map.ledger.every(
      (x: any) => x.claimId || x.evidencePaths?.length || x.metadata,
    ),
  ).toBe(true);
});
