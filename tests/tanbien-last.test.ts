import { expect, it } from "vitest";
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
for (const [sample, id, star, bad] of [
  ["vn-tianliang", "tanbien.r17", "Thiên Lương", "Dậu"],
  ["vn-qisha", "tanbien.r18", "Thất Sát", "Thìn"],
  ["vn-pojun", "tanbien.r19", "Phá Quân", "Dần"],
])
  it(`${id}: source states and actual engine sample; wrong/missing facts stay distinct`, async () => {
    const s = (await loadSample(sample))!.report.snapshot;
    const before = JSON.stringify(s);
    expect(life(s).majorStars.map((s) => s.name)).toContain(star);
    expect(status(s, id)).toBe("matched");
    // All mutations below are artificial evaluator fixtures, NOT engine-valid charts.
    const moved = structuredClone(s);
    const st = life(moved).majorStars.find((s) => s.name === star)!;
    life(moved).majorStars = life(moved).majorStars.filter(
      (s) => s.name !== star,
    );
    moved.chart.palaces.find((p) => p.name === "Quan Lộc")!.majorStars.push(st);
    expect(status(moved, id)).toBe("condition-false");
    const wrong = structuredClone(s);
    life(wrong).earthlyBranch = bad;
    expect(status(wrong, id)).toBe("condition-false");
    for (const field of ["earthlyBranch", "majorStars"] as const) {
      const x = structuredClone(s);
      delete (life(x) as Partial<ReturnType<typeof life>>)[field];
      expect(status(x, id)).toBe("missing-facts");
    }
    const lookup = structuredClone(s);
    life(lookup).earthlyBranch = "unknown";
    expect(status(lookup, id)).toBe("missing-facts");
    const label = structuredClone(s);
    life(label).majorStars.forEach((s) => (s.brightness = "Hãm"));
    expect(status(label, id)).toBe("matched");
    expect(life(label).majorStars[0].brightness).toBe("Hãm");
    const r = tanBienRules.find((r) => r.id === id)!;
    expect(r.status).toBe("draft");
    expect(r.review).toBeNull();
    expect(r.presentation!.contentType).toBe("element-gloss");
    expect(
      executeRules(s, tanBienRules, "customer").approvedClaims,
    ).toHaveLength(0);
    expect(JSON.stringify(s)).toBe(before);
  });

it("R19 project single-major scope is explicit; companions and missing lists differ", async () => {
  const s = (await loadSample("vn-pojun"))!.report.snapshot;
  const x = structuredClone(s); // synthetic logic fixture, not engine-valid
  life(x).minorStars.push({ name: "Văn Khúc", brightness: "", mutagen: "" });
  expect(status(x, "tanbien.r19")).toBe("matched");
  life(x).majorStars.push({ name: "Tử Vi", brightness: "", mutagen: "" });
  expect(status(x, "tanbien.r19")).toBe("condition-false");
  delete (life(x) as Partial<ReturnType<typeof life>>).majorStars;
  expect(status(x, "tanbien.r19")).toBe("missing-facts");
  const rule = tanBienRules.find((r) => r.id === "tanbien.r19")!;
  expect(rule.presentation!.projectScope!.join(" ")).toContain(
    "không phải điều kiện nguyên văn",
  );
  expect(rule.presentation!.sourceConditions!.join(" ")).not.toContain(
    "duy nhất",
  );
  for (const id of ["engine-combo", "engine-exception"]) {
    const real = (await loadSample(id))!.report.snapshot;
    expect(life(real).majorStars.map((s) => s.name)).toEqual(
      expect.arrayContaining(["Tử Vi", "Phá Quân"]),
    );
    expect(status(real, "tanbien.r19")).toBe("condition-false");
    expect(
      buildTanBienReading(real)
        .sections.flatMap((s) => s.claims)
        .flatMap((c) => c.rules)
        .map((r) => r.id),
    ).not.toContain("tanbien.r19");
  }
  const p = buildTanBienReading(s)
    .sections.flatMap((s) => s.paragraphs)
    .find((p) => p.claim.rules.some((r) => r.id === "tanbien.r19"))!;
  expect(p.nearbyNotes.map((n) => n.text).join(" ")).toContain(
    "chính tinh duy nhất",
  );
});
it("page 38 tables preserve distinct states and no-engine-label fallback", () => {
  const groups = {
    tianliang: {
      Miếu: "Ngọ,Thìn,Tuất",
      Vượng: "Tý,Mão,Dần,Thân",
      Đắc: "Sửu,Mùi",
      Hãm: "Dậu,Tỵ,Hợi",
    },
    qisha: {
      Miếu: "Dần,Thân,Tý,Ngọ",
      Vượng: "Tỵ,Hợi",
      Đắc: "Sửu,Mùi",
      Hãm: "Mão,Dậu,Thìn,Tuất",
    },
    pojun: {
      Miếu: "Tý,Ngọ",
      Vượng: "Sửu,Mùi",
      Đắc: "Thìn,Tuất",
      Hãm: "Mão,Dậu,Dần,Thân,Tỵ,Hợi",
    },
  };
  for (const [key, values] of Object.entries(groups)) {
    const t = tanBienLifeTables[key as keyof typeof groups];
    expect(Object.keys(t.states)).toHaveLength(12);
    for (const [state, branches] of Object.entries(values))
      for (const branch of branches.split(","))
        expect(t.states[branch]).toBe(state);
  }
});
it("previous thirteen samples keep their claims; no retrospective rewriting", () => {
  const old = JSON.parse(
    readFileSync("exports/tanbien-reading-v1.4-archive/examples.json", "utf8"),
  );
  const now = JSON.parse(
    readFileSync("exports/tanbien-reading-examples.json", "utf8"),
  );
  expect(old).toHaveLength(13);
  expect(now).toHaveLength(19);
  for (const row of old) {
    const next = now.find((x: any) => x.id === row.id);
    expect(typeof next.snapshotId).toBe("string");
    expect(next.snapshotId).toEqual(row.snapshotId);
    const claims = (r: any) =>
      r.sections.flatMap((s: any) =>
        s.claims
          .filter((c: any) => !c.rules.some((r: any) => r.id === "tanbien.r21"))
          .map((c: any) => ({ id: c.id, text: c.text, rules: c.rules })),
      );
    expect(claims(next)).toEqual(claims(row));
  }
});
