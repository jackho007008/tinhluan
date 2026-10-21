import { it, expect, afterAll } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import {
  calculateInternal,
  freezeReading,
  receiptMatches,
} from "../lib/internal-review/dynamic-reading";
import { saveReading, getReading } from "../lib/internal-review/reading-store";
import { randomUUID } from "node:crypto";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
const pack = JSON.parse(
  fs.readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
);
const dir = await mkdtemp(path.join(os.tmpdir(), "internal-reading-test-"));
process.env.INTERNAL_READING_DIR = dir;
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
  delete process.env.INTERNAL_READING_DIR;
});
it("fresh engine receipt tied to entire chart; only Tân Biên, immutable saved version, idempotent same snapshot", async () => {
  const old = pack.rows.find((r: any) => r.id === "vn-20").snapshot;
  const { snapshot, receipt } = await calculateInternal(old.normalized);
  expect(snapshot.resultId).toBe(old.resultId);
  expect(receiptMatches(snapshot, receipt)).toBe(true);
  const frozen = freezeReading(snapshot, receipt);
  expect(
    frozen.reading.execution.traces.every((t) =>
      t.ruleId.startsWith("tanbien.") || ["npl.life-polarity-aligned","npl.life-polarity-opposed","npl.life-local-liem-tuong","npl.life-local-khoa-kiep","npl.life-foundation-cuc","npl.life-foundation-empty","npl.life-foundation-one","npl.life-body-wealth","npl.life-body-career","npl.life-two-major-generates","npl.life-two-major-controls","npl.life-two-major-mixed"].includes(t.ruleId),
    ),
  ).toBe(true);
  expect(frozen.reading.execution.previewClaims.length).toBeGreaterThan(0);
  const id = randomUUID(),
    record = {
      id,
      createdAt: new Date().toISOString(),
      snapshot,
      receipt,
      frozen,
    };
  await saveReading(record);
  await saveReading({
    ...record,
    frozen: { ...frozen, dynamicVersion: "not-written" },
  });
  expect(await getReading(id)).toEqual(record);
  const changed = structuredClone(snapshot);
  changed.chart.palaces[0].minorStars = [];
  expect(receiptMatches(changed, receipt)).toBe(false);
  await expect(
    saveReading({
      ...record,
      snapshot: { ...snapshot, resultId: "different" },
    }),
  ).rejects.toThrow("ID_CONFLICT");
  expect(await getReading("../../secret")).toBeNull();
});
it("legacy or incomplete valid arrays never become absence claims in strict dynamic mode; historical rendering unchanged", () => {
  const s = structuredClone(
      pack.rows.find((r: any) => r.id === "vn-20").snapshot,
    ),
    before = JSON.stringify(s);
  const historical = buildTanBienReading(s);
  const unknown = freezeReading(s);
  expect(unknown.verified).toBe(false);
  expect(unknown.reading.execution.previewClaims).toHaveLength(0);
  expect(
    unknown.reading.execution.traces.some((t) => t.status === "missing-facts"),
  ).toBe(true);
  expect(
    unknown.reading.background.some((f) =>
      /không có chính tinh|Vô chính/.test(f.text),
    ),
  ).toBe(false);
  expect(buildTanBienReading(s)).toEqual(historical);
  expect(JSON.stringify(s)).toBe(before);
});
it("verified empty Mệnh is different from unknown; new finance content does not backfill Mệnh", async () => {
  const old = pack.rows.find((r: any) => r.id === "vn-2").snapshot;
  const { snapshot, receipt } = await calculateInternal(old.normalized);
  const frozen = freezeReading(snapshot, receipt);
  expect(frozen.verified).toBe(true);
  expect(frozen.reading.sections.find(s => s.id === "action")!.claims).toHaveLength(0);
  expect(frozen.reading.sections.find(s => s.id === "finance")!.claims.flatMap(c => c.rules.map(r => r.id))).toEqual(["tanbien.finance-nhat-luong-mao"]);
  expect(frozen.reading.scope).toBe("supported");
});
