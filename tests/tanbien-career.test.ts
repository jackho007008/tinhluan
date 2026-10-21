import { checkHistoricalClaims } from "./fixtures/historical-reading";
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import saved from "../exports/demo-wuqu-tianfu-review.json";
import { catalog } from "../lib/interpretation-rules/catalog";
import { executeRules } from "../lib/interpretation-rules/execute";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { careerSourceGate } from "../lib/interpretation-rules/derived";
import { readPath } from "../lib/interpretation-rules/schema";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const rules = catalog.filter((r) =>
  ["tanbien.r05", "tanbien.r22"].includes(r.id),
);
const base = () => structuredClone(saved.snapshot) as unknown as ChartSnapshot;
const q = (s: ChartSnapshot) =>
  s.chart.palaces.find((p) => p.name === "Quan Lộc")!;
const outcome = (s: ChartSnapshot, id = "tanbien.r22") =>
  executeRules(s, rules, "internal-draft").traces.find((t) => t.ruleId === id)!;
// Mutated stars below are technical fixtures ONLY. They do not validate the engine.
const coLuong = () => {
  const s = base();
  q(s).majorStars = [{ name: "Thiên Cơ" }, { name: "Thiên Lương" }];
  return s;
};
it("R05 keeps source star conditions; R22 requires both stars at Quan Loc, not mere presence elsewhere", () => {
  expect(outcome(base(), "tanbien.r05").status).toBe("matched");
  expect(outcome(coLuong()).status).toBe("matched");
  const s = coLuong();
  s.chart.palaces.find((p) => p.name === "Mệnh")!.majorStars = q(s).majorStars;
  q(s).majorStars = [];
  expect(outcome(s).status).toBe("condition-false");
  q(s).majorStars = [{ name: "Thiên Cơ" }];
  expect(outcome(s).status).toBe("condition-false");
});
it("missing arrays remain unknown; valid empty is known false; unverified list receipt never yields claims", () => {
  const s = coLuong();
  delete (q(s) as Partial<ReturnType<typeof q>>).majorStars;
  expect(outcome(s).status).toBe("missing-facts");
  q(s).majorStars = [];
  expect(outcome(s).status).toBe("condition-false");
  expect(
    buildTanBienReading(coLuong(), { unverifiedStarLists: true }).sections.find(
      (s) => s.id === "work",
    )!.claims,
  ).toHaveLength(0);
});
it("Kim21/24 are blocked by source dependency, not a false inverse claim; missing lunar data stays unknown", () => {
  for (const id of ["tanbien.r05", "tanbien.r22"])
    for (const day of [21, 24]) {
      const s = id.endsWith("r05") ? base() : coLuong();
      s.chart.fiveElementsClass = "Kim Tứ Cục";
      s.chart.lunar.lunarDay = day;
      expect(outcome(s, id).status).toBe("missing-facts");
      expect(outcome(s, id).details).toContain("fact.career-source-available");
      expect(buildTanBienReading(s).workStatusNote).toContain("còn mâu thuẫn");
    }
  const s = coLuong();
  delete (s.chart as Partial<typeof s.chart>).lunar;
  expect(careerSourceGate(s).available).toBe(false);
  expect(outcome(s).status).toBe("missing-facts");
});
it("other disputed layers do not become invented exclusions or brightness conditions", () => {
  const s = coLuong();
  s.chart.fiveElementsClass = "Kim Tứ Cục";
  s.chart.lunar.lunarDay = 20;
  q(s).minorStars = [{ name: "Hỏa Tinh" }, { name: "Linh Tinh" }];
  q(s).adjectiveStars = [{ name: "Triệt Lộ" }, { name: "Thiên Quý" }];
  q(s).majorStars.forEach((x) => {
    x.brightness = "Hãm";
    x.mutagen = "Quyền";
  });
  expect(outcome(s).status).toBe("matched"); // Source selected clause has no exclusion based on these fields.
  const p = buildTanBienReading(s).sections.find((s) => s.id === "work")!
    .paragraphs[0];
  expect(p.nearbyNotes.map((n) => n.text).join(" ")).toContain("chưa tổng hợp");
});
it("facts precede work text, evidence is Quan Loc, source/project gates remain separate, no new occupation promises", () => {
  const s = coLuong(),
    frozen = JSON.stringify(s),
    r = buildTanBienReading(s),
    work = r.sections.find((s) => s.id === "work")!;
  expect(work.claims).toHaveLength(1);
  expect(r.workFacts[0].text).toContain("Quan Lộc tại");
  const p = work.paragraphs[0];
  expect(p.evidence[0].title).toContain("Thiên Cơ");
  expect(p.evidence[0].facts.some((f) => f.text.includes("Quan Lộc"))).toBe(
    true,
  );
  expect(p.evidence[0].sourceConditions.join(" ")).not.toContain("Kim Cục");
  expect(p.evidence[0].projectScope.join(" ")).toContain("Kim Cục");
  expect(p.display.text).not.toMatch(
    /thầy thuốc|thầy giáo|chức vị|thu nhập|thành công/,
  );
  for (const path of p.claim.evidencePaths)
    expect(readPath(s, path)).toBeDefined();
  expect(JSON.stringify(s)).toBe(frozen);
  expect(
    buildTanBienReading(base()).sections.find((s) => s.id === "work")!.claims[0]
      .rules[0].id,
  ).toBe("tanbien.r05");
  expect(
    buildTanBienReading(s).sections.find((s) => s.id === "work")!.claims[0]
      .rules[0].id,
  ).toBe("tanbien.r22");
});
it("draft never enters customer output; unknown is not an inverse description; no false review", () => {
  const s = coLuong();
  expect(executeRules(s, rules, "customer").approvedClaims).toHaveLength(0);
  for (const r of rules) {
    expect(r.status).toBe("draft");
    expect(r.review).toBeNull();
  }
  q(s).majorStars = [];
  expect(
    buildTanBienReading(s).sections.find((s) => s.id === "work")!.claims,
  ).toHaveLength(0);
});
it("old review pack remains historical; untouched prose survives the versioned content revision", () => {
  const old = JSON.parse(
    readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
  );
  for (const row of old.rows.filter((r: any) => r.kind !== "synthetic")) {
    checkHistoricalClaims(row.snapshot, row.execution.previewClaims);
    expect(row.templateVersion).toBe("1.9.0");
  }
});
