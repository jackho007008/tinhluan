import {buildCustomerReport, CUSTOMER_VERSION, type CustomerReport} from './customer-report';
import {buildContinuousReport, type ContinuousReport} from "./continuous-report";
import { assertChartIntegrity, chartIntegrity } from '../tuvi-engine/chart-integrity';
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { calculate, type ChartSnapshot } from "../tuvi-engine";
import { buildTanBienReading } from "./tanbien-reading";
import {
  evidenceLayers,
  sourceTablesForRule,
  PRESENTATION_VERSION,
} from "./tanbien-presentation";
import { RULESET_VERSION } from "../interpretation-rules/catalog";
export const DYNAMIC_VERSION = "internal-reading-1.15.0";
const digest = (x: unknown) =>
  createHash("sha256").update(JSON.stringify(x)).digest("hex");
export type ListReceipt = {
  version: "engine-list-receipt-1";
  resultId: string;
  chartHash: string;
  status: "adapter-complete";
  source: string;
  sourceHashes: { runner: string; adapter: string; formula?: string };
};
export function receiptMatches(snapshot: ChartSnapshot, receipt?: ListReceipt) {
  return (
    !!receipt &&
    receipt.version === "engine-list-receipt-1" &&
    receipt.status === "adapter-complete" &&
    receipt.resultId === snapshot.resultId &&
    receipt.chartHash === digest(snapshot.chart) &&
    chartIntegrity(snapshot.chart).valid
  );
}
// Only called immediately on the server's calculate output, never on uploaded/legacy snapshots.
export async function calculateInternal(input: unknown) {
  const snapshot = await calculate(input);
  assertChartIntegrity(snapshot.chart);
  const ps = snapshot.chart.palaces;
  if (
    ps.length !== 12 ||
    new Set(ps.map((p) => p.earthlyBranch)).size !== 12 ||
    ps.some((p) =>
      ["majorStars", "minorStars", "adjectiveStars"].some(
        (g) =>
          !Array.isArray(p[g as keyof typeof p]) ||
          p[g as "majorStars"].some(
            (s) => !s || typeof s.name !== "string" || !s.name.trim(),
          ),
      ),
    )
  )
    throw Error("INCOMPLETE_ENGINE_OUTPUT");
  const receipt: ListReceipt = {
    version: "engine-list-receipt-1",
    resultId: snapshot.resultId,
    chartHash: digest(snapshot.chart),
    status: "adapter-complete",
    sourceHashes: {
      ...(snapshot.chart.tanBien
        ? {
            formula: digest(
              await Promise.all(
                (snapshot.profile.id === "tanbien-vn-trial-v2"
                  ? [
                      "lib/tuvi-engine/tanbien.ts",
                      "lib/tuvi-engine/tanbien-v2.ts",
                    ]
                  : ["lib/tuvi-engine/tanbien.ts"]
                ).map((p) => readFile(p, "utf8")),
              ),
            ),
          }
        : {}),
      runner: digest(
        await readFile(
          snapshot.normalized.profile === "cn-reference"
            ? "scripts/engine.cjs"
            : "scripts/engine-vn.cjs",
          "utf8",
        ),
      ),
      ...(snapshot.chart.rulers ? {rulerAdapter: digest(await readFile("lib/year-ruler.ts", "utf8"))} : {}),
      adapter: digest(await readFile("lib/tuvi-engine/index.ts", "utf8")),
    },
    source:
      "Server calculate → isolated engine/engine-vn.cjs → entire a.palaces; iztro@2.6.1, no UI filtering. Completeness only within this adapter contract, not expert validation.",
  };
  return { snapshot, receipt };
}
export function freezeReading(snapshot: ChartSnapshot, receipt?: ListReceipt) {
  assertChartIntegrity(snapshot.chart);
  const verified = receiptMatches(snapshot, receipt);
  const reading = buildTanBienReading(snapshot, {
    unverifiedStarLists: !verified,
  });
  const layers: Record<string, ReturnType<typeof evidenceLayers>[]> = {};
  const tables: Record<string, ReturnType<typeof sourceTablesForRule>> = {};
  for (const s of reading.sections)
    for (const p of s.paragraphs) {
      layers[p.claim.id] = p.evidence.map((e, i) =>
        evidenceLayers(e, p.nearbyNotes, p.claim.rules[i].id),
      );
      for (const r of p.claim.rules) tables[r.id] = sourceTablesForRule(r);
    }
  const continuousReport = buildContinuousReport(snapshot, reading, verified);
  return {
    reading,
    customerReport: verified ? buildCustomerReport(snapshot, continuousReport, RULESET_VERSION) as CustomerReport | undefined : undefined,
    continuousReport: continuousReport as ContinuousReport | undefined,
    compatibility: snapshot.chart.tanBien
      ? {
          version: "tanbien-profile-compatibility-0.11.0",
          rules: reading.execution.rules.map(r => r.id + "@" + r.version).join(", "),
          status: "input-contract-checked-not-expert-reviewed",
          changes:
            "Các fact vị trí, đồng cung và tứ hóa lấy từ profile mới; bảng điều kiện Tân Biên giữ nguyên. NPL326 thêm riêng npl.spouse-vcd-lonely-single@1.0.0 theo tập con Phu VCD được duyệt sau5c5d3ec, không mở mọi Phu hoặc OR cho nơi khác. NPL260 chỉ mở thêm npl.dien-single-tuan@1.0.0 và npl.dien-single-triet@1.0.0 theo tập conU07 đã duyệt, không đảo/xóa nguồn khác. B01/B02 theo79b3947 chỉ mở vttl.no-am-mieu-scale@1.0.0 và vttl.career-fire-delayed-fulfillment@1.0.0, không mở nhánh khác hoặc vận hạn. Toàn Thư thêm riêng vttl.phuc-liem-sat-effort@1.0.0 theo tập con Phúc được duyệt sau414be37, không mở N11–N12 hoặc nhánh khác. Toàn Thư thêm riêng vttl.no-luong-single-scale@1.0.0 theo tập conNô đã duyệt sau6e7e551; trước đó chỉ bổ sung vttl.dien-phu-hoi-scale@1.0.0 (U08) và vttl.career-co-am-dan-progress@1.0.0 (U24) theo profile v2 và tập con đã duyệt; không mở các nhánh Toàn Thư khác.",
        }
      : undefined,
    layers,
    tables,
    presentationVersion: verified ? CUSTOMER_VERSION : PRESENTATION_VERSION,
    evidenceVersion: PRESENTATION_VERSION,
    catalogVersion: RULESET_VERSION,
    dynamicVersion: DYNAMIC_VERSION,
    verified,
  };
}
export type FrozenReading = ReturnType<typeof freezeReading>;
