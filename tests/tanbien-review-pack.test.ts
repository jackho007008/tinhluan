import { checkHistoricalClaims } from "./fixtures/historical-reading";
import { catalog } from "../lib/interpretation-rules/catalog";
import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import {
  evidenceLayers,
  nearbyNotes,
} from "../lib/internal-review/tanbien-presentation";
import { editorialText } from "../lib/internal-review/tanbien-editorial";
import { readPath } from "../lib/interpretation-rules/schema";
const data = JSON.parse(
  readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
);
const old = JSON.parse(
  readFileSync("exports/tanbien-reading-examples.json", "utf8"),
);
const row = (id: string) => data.rows.find((r: any) => r.id === id);
it("all 19 frozen export results stay identical and complete inventory separates synthetic cases", () => {
  expect(data.rows).toHaveLength(57);
  expect(data.rows.filter((r: any) => r.kind === "synthetic")).toHaveLength(36);
  for (const r of old) {
    const n = row(r.id);
    expect(n.snapshotId).toBe(r.snapshotId);
    expect(n.execution).toEqual(r.execution);
    checkHistoricalClaims(n.snapshot, n.execution.previewClaims);
  }
});
it("R21 localizes only with a verified branch; source conditions and claim stay intact", () => {
  const r = row("vn-16"),
    p = r.sections
      .flatMap((s: any) => s.paragraphs)
      .find((p: any) => p.claim.rules[0].id === "tanbien.r21");
  expect(p.display.text).toContain("Mệnh ở Tý,");
  expect(p.display.text).not.toContain("Hợi hoặc");
  expect(p.claim.text).toContain("Hợi hoặc Tý");
  expect(p.evidence[0].sourceConditions.join(" ")).toContain("Hợi hoặc Tý");
  for (const b of p.display.bindings)
    for (const path of b.evidencePaths)
      expect(readPath(r.snapshot, path)).toBeDefined();
  const s = structuredClone(r.snapshot);
  delete s.chart.palaces.find((x: any) => x.name === "Mệnh").earthlyBranch;
  expect(editorialText(p.claim, s).text).toBe(p.claim.text);
  expect(editorialText(p.claim, s).bindings).toHaveLength(0);
});
it("editorial notes never present as source-table facts; nearby limits are not repeated verbatim", () => {
  for (const id of [
    "vn-16",
    "vn-co-cu-loc",
    "vn-pojun",
    "vn-taiyang",
    "vn-0",
  ]) {
    const r = row(id);
    for (const s of r.sections)
      for (const p of s.paragraphs) {
        const notes = nearbyNotes(r.snapshot, p.claim.rules[0].id);
        for (const n of notes.filter(
          (n) => !n.paths.length && /chưa|Bản thử|Đoạn/.test(n.text),
        ))
          expect(n.kind).toBe("editorial");
        const l = evidenceLayers(
          p.evidence[0],
          p.nearbyNotes,
          p.claim.rules[0].id,
        );
        expect(l.sourceFacts.every((f) => f.kind === "source")).toBe(true);
        for (const n of p.nearbyNotes)
          expect(l.contextNotes.map((x) => x.text)).not.toContain(n.text);
      }
  }
});
it("six selected readings share version and include empty sample without filler; sentence map has three honest classes", () => {
  const selected = readFileSync(
    "exports/tanbien-review-1.9.0/selected-readings.md",
    "utf8",
  );
  const feedback = readFileSync(
    "exports/tanbien-review-1.9.0/feedback.md",
    "utf8",
  );
  expect(selected.match(/^## /gm)).toHaveLength(6);
  expect(feedback.match(/^## /gm)).toHaveLength(6);
  expect(row("vn-2").sections.flatMap((s: any) => s.claims)).toHaveLength(0);
  for (const id of [
    "demo-wuqu-tianfu",
    "vn-0",
    "vn-co-cu-loc",
    "vn-jumen",
    "vn-16",
    "vn-2",
  ]) {
    expect(selected).toContain(`## ${id}`);
    expect(feedback).toContain(row(id).snapshotId);
    for (const p of row(id).sections.flatMap((s: any) => s.paragraphs)) {
      expect(selected).toContain(p.display.text);
      expect(feedback).toContain(p.claim.id);
    }
  }
  const ledger = JSON.parse(
    readFileSync("exports/tanbien-review-1.9.0/sentence-map.json", "utf8"),
  );
  expect(ledger.runId).toBe(data.runId);
  expect(new Set(ledger.map.map((x: any) => x.kind))).toEqual(
    new Set(["nhận định có nguồn", "dữ kiện snapshot", "giới hạn/biên tập"]),
  );
  for (const x of ledger.map) {
    if (x.kind === "nhận định có nguồn") expect(x.claimId).toBeTruthy();
    if (x.kind === "dữ kiện snapshot")
      for (const p of x.evidencePaths)
        expect(readPath(row(x.sample).snapshot, p)).toBeDefined();
  }
});
