import { it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { loadSample } from "../lib/internal-review/samples";
const previous = JSON.parse(
  readFileSync("exports/tanbien-reading-v1.6-archive/examples.json", "utf8"),
);
const current = JSON.parse(
  readFileSync("exports/tanbien-reading-examples.json", "utf8"),
);
const ids = ["demo-wuqu-tianfu", "vn-0", "vn-co-cu-loc", "vn-jumen", "vn-16"];
it("editorial layer keeps pre-existing claims and rule outcomes across the source expansion", () => {
  for (const old of previous) {
    const now = current.find((r: any) => r.id === old.id);
    expect(now.snapshotId).toBe(old.snapshotId);
    expect(
      now.execution.traces.filter((t: any) => t.ruleId !== "tanbien.r21"),
    ).toEqual(old.execution.traces);
    expect(
      now.execution.previewClaims.filter(
        (c: any) => !c.rules.some((r: any) => r.id === "tanbien.r21"),
      ),
    ).toEqual(old.execution.previewClaims);
  }
});
it("five review articles retain conditions, limits and claim/source trace; display edits are separate", () => {
  const short = readFileSync("exports/tanbien-five-reading-review.md", "utf8");
  for (const id of ids) {
    const r = current.find((r: any) => r.id === id);
    expect(short).toContain(r.introduction.text);
    expect(
      readFileSync("exports/tanbien-five-reading-comparison.md", "utf8"),
    ).toContain(r.snapshotId);
    for (const s of r.sections)
      for (const p of s.paragraphs) {
        expect(short).toContain(p.display.text);
        expect(p.claim.id).toBeTruthy();
        expect(p.evidence.every((e: any) => e.sources.length > 0)).toBe(true);
        expect(p.display.text).not.toMatch(
          /brightness|evaluator|fact\.|chart\.|không tự hòa giải/,
        );
      }
  }
});
it("R20 shortened limit stays adjacent, full explanation remains in evidence, no reverse conclusion", async () => {
  const r = buildTanBienReading(
    (await loadSample("vn-co-cu-loc"))!.report.snapshot,
  );
  const p = r.sections
    .flatMap((s) => s.paragraphs)
    .find((p) => p.claim.rules.some((r) => r.id === "tanbien.r20"))!;
  expect(p.display.text).toBe(p.claim.text.replace("ở Mão hoặc Dậu", "ở Dậu"));
  expect(p.display.bindings.some(b => b.text === "Mệnh tại Dậu.")).toBe(true);
  expect(p.display.text).toContain("Lộc Tồn đồng cung");
  expect(p.nearbyNotes.map((n) => n.text).join(" ")).toContain(
    "chưa đủ để đánh giá cách giao tiếp",
  );
  expect(p.nearbyNotes.map((n) => n.text).join(" ")).not.toContain("hòa giải");
  expect(
    p.evidence
      .flatMap((e) => e.contextNotes)
      .map((n) => n.text)
      .join(" "),
  ).toContain("không tự hòa giải");
  for (const id of ["vn-jumen", "vn-16", "vn-2"]) {
    const x = buildTanBienReading((await loadSample(id))!.report.snapshot);
    expect(
      x.sections
        .flatMap((s) => s.claims)
        .some((c) => c.rules.some((r) => r.id === "tanbien.r20")),
    ).toBe(false);
  }
  const empty = buildTanBienReading(
    (await loadSample("vn-2"))!.report.snapshot,
  );
  expect(empty.sections.filter(s=>["structure","action","learning"].includes(s.id)).flatMap((s) => s.claims)).toHaveLength(0);
  // Finance may independently have context; this test covers the empty Mệnh article.
  expect(empty.sections.filter(s=>["structure","action","learning"].includes(s.id)).every(s=>!s.claims.length)).toBe(true);
});
it("selected context is factual, concise and complete evidence remains available", () => {
  for (const r of current) {
    expect(r.unassessed.length).toBeLessThanOrEqual(3);
    for (const n of r.unassessed) {
      expect(n.kind).toBe("snapshot");
      expect(n.paths.length).toBeGreaterThan(0);
    }
  }
  const co = current.find((r: any) => r.id === "vn-co-cu-loc");
  expect(co.unassessed.some((n: any) => n.text.includes("Tuần Không"))).toBe(
    true,
  );
  const vn16 = current.find((r: any) => r.id === "vn-16");
  expect(
    vn16.sections.filter((s: any) => s.claims.length).map((s: any) => s.id),
  ).toEqual(["learning", "finance"]);
});
