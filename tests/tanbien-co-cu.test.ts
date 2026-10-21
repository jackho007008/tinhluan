import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadSample } from "../lib/internal-review/samples";
import { tanBienRules } from "../lib/interpretation-rules/tanbien";
import { executeRules } from "../lib/interpretation-rules/execute";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import {
  factEvidence,
  sourceTablesForRule,
} from "../lib/internal-review/tanbien-presentation";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const id = "tanbien.r20";
const life = (s: ChartSnapshot) =>
  s.chart.palaces.find((p) => p.name === "Mệnh")!;
const state = (s: ChartSnapshot) =>
  executeRules(s, tanBienRules, "internal-draft").traces.find(
    (t) => t.ruleId === id,
  )!;
const source = async () =>
  structuredClone((await loadSample("vn-co-cu-loc"))!.report.snapshot);
it("real engine pair differs on source-required Lộc Tồn, not sample ID", async () => {
  const yes = await source(),
    no = (await loadSample("vn-jumen"))!.report.snapshot;
  for (const s of [yes, no]) {
    expect(life(s).earthlyBranch).toBe("Dậu");
    expect(life(s).majorStars.map((s) => s.name)).toEqual([
      "Thiên Cơ",
      "Cự Môn",
    ]);
  }
  expect(life(yes).minorStars.some((s) => s.name === "Lộc Tồn")).toBe(true);
  expect(life(no).minorStars).toEqual([]);
  expect(state(yes).status).toBe("matched");
  expect(state(no).status).toBe("condition-false");
  expect(state(no).details.join(" ")).toContain("fact.life-minor-stars");
  expect(state((await loadSample("vn-0"))!.report.snapshot).status).toBe(
    "condition-false",
  );
  const r = tanBienRules.find((r) => r.id === id)!;
  expect(r.status).toBe("draft");
  expect(r.review).toBeNull();
  expect(sourceTablesForRule(r)).toEqual({});
  expect(r.exceptions).toEqual([]);
  expect(r.limitations.join(" ")).toContain("ngoại lệ");
  expect(
    executeRules(yes, tanBienRules, "customer").approvedClaims,
  ).toHaveLength(0);
});
it("synthetic fixtures: each mandatory placement is independent, Hóa Lộc cannot replace Lộc Tồn", async () => {
  // All mutations below are technical fixtures, not engine-valid charts or independent validation.
  for (const star of ["Thiên Cơ", "Cự Môn", "Lộc Tồn"]) {
    const s = await source(),
      m = life(s),
      other = s.chart.palaces.find((p) => p.name === "Quan Lộc")!;
    const field = star === "Lộc Tồn" ? "minorStars" : "majorStars";
    const chosen = m[field].find((s) => s.name === star)!;
    m[field] = m[field].filter((s) => s.name !== star);
    other[field].push(chosen);
    expect(state(s).status).toBe("condition-false");
  }
  const s = await source();
  life(s).majorStars.forEach((s) => {
    s.mutagen = "Lộc";
    s.brightness = "Hãm";
  });
  expect(state(s).status).toBe("matched"); // source has no brightness requirement
  life(s).minorStars = life(s).minorStars.filter((s) => s.name !== "Lộc Tồn");
  expect(state(s).status).toBe("condition-false");
  const x = await source();
  life(x).earthlyBranch = "Mão";
  expect(state(x).status).toBe("matched");
  life(x).earthlyBranch = "Dần";
  expect(state(x).status).toBe("condition-false");
});
it("missing or ambiguous input remains unknown; valid empty list means not-matched", async () => {
  for (const field of ["majorStars", "minorStars", "earthlyBranch"] as const) {
    const s = await source();
    delete (life(s) as Partial<ReturnType<typeof life>>)[field];
    expect(state(s).status).toBe("missing-facts");
    expect(
      buildTanBienReading(s)
        .sections.flatMap((s) => s.claims)
        .some((c) => c.rules.some((r) => r.id === id)),
    ).toBe(false);
  }
  const s = await source();
  life(s).earthlyBranch = "unknown";
  expect(state(s).status).toBe("missing-facts");
  const x = await source();
  life(x).minorStars = [];
  expect(state(x).status).toBe("condition-false");
  const y = await source();
  y.chart.palaces.push(structuredClone(life(y)));
  expect(state(y).status).toBe("missing-facts");
  expect(factEvidence(s, "fact.life-mao-dau").text).not.toContain(
    "Mão hoặc Dậu tại",
  );
});
it("base and combination claims keep separate scopes, evidence and snapshots across A–B–A", async () => {
  const a = await source(),
    before = JSON.stringify(a),
    b = (await loadSample("vn-jumen"))!.report.snapshot;
  const run = (s: ChartSnapshot) => buildTanBienReading(s);
  const first = run(a),
    second = run(b),
    again = run(a);
  expect(first).toEqual(again);
  expect(JSON.stringify(a)).toBe(before);
  const ids = (r: ReturnType<typeof run>) =>
    r.sections
      .flatMap((s) => s.claims)
      .flatMap((c) => c.rules.map((r) => r.id));
  expect(ids(first)).toEqual(["tanbien.r12", "tanbien.r13", "tanbien.r20", "tanbien.finance-dong-ty-hoi"]);
  expect(ids(second)).toEqual(["tanbien.r12", "tanbien.r13", "tanbien.finance-dong-ty-hoi"]);
  const ps = first.sections.flatMap((s) => s.paragraphs);
  const p = ps.find((p) => p.claim.rules.some((r) => r.id === id))!;
  expect(p.evidence[0].contentLabel).toBe("Nhận định phối hợp có điều kiện");
  expect(p.evidence[0].facts.map((f) => f.text).join(" ")).toContain("Lộc Tồn");
  expect(p.claim.evidencePaths.some((p) => p.includes("minorStars"))).toBe(
    true,
  );
  expect(p.nearbyNotes.some((n) => n.text.includes("không tự hòa giải"))).toBe(
    false,
  );
  expect(
    p.evidence
      .flatMap((e) => e.contextNotes)
      .some((n) => n.text.includes("không tự hòa giải")),
  ).toBe(true);
  expect(
    first.unassessed.filter((n) => n.text.includes("Tuần Không")),
  ).toHaveLength(1);
  for (const p of ps) {
    if (p.claim.rules[0].id === "tanbien.finance-dong-ty-hoi") {
      expect(p.evidence.flatMap(e=>e.contextNotes)).toEqual([]);
      expect(p.evidence[0].sourceConditions.join(" ")).toContain("Tài Bạch");
    } else expect(p.evidence.flatMap(e=>e.contextNotes).some(n=>n.text.includes("Tuần Không"))).toBe(true);
  }
});
it("all eighteen previous snapshots and rule definitions remain identical", () => {
  const old = JSON.parse(
    readFileSync("exports/tanbien-reading-v1.5-archive/examples.json", "utf8"),
  );
  const rows = JSON.parse(
    readFileSync("exports/tanbien-reading-examples.json", "utf8"),
  );
  expect(old).toHaveLength(18);
  expect(rows).toHaveLength(19);
  for (const r of old) {
    const n = rows.find((x: any) => x.id === r.id);
    expect(n.snapshotId).toBe(r.snapshotId);
    expect(
      n.sections
        .flatMap((s: any) => s.claims)
        .filter((c: any) => !c.rules.some((r: any) => r.id === "tanbien.r21")),
    ).toEqual(r.sections.flatMap((s: any) => s.claims));
    for (const rule of r.execution.rules)
      expect(n.execution.rules.find((x: any) => x.id === rule.id)).toEqual(
        rule,
      );
  }
});
