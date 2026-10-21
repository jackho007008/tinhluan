import { assertChartIntegrity } from './chart-integrity';
import { certifyNatalTransformations, NATAL_TRANSFORMATIONS_VERSION, type NatalTransformations } from "./natal-transformations";
import { applyYearRuler, YEAR_RULER_VERSION, type RulerMetadata } from "../year-ruler";
import {
  applyTanBienV2,
  TANBIEN_V2_PROFILE,
  TANBIEN_V2_VERSION,
  type TanBienV2Calculation,
} from "./tanbien-v2";
import {
  applyTanBien,
  TANBIEN_PROFILE,
  TANBIEN_ENGINE_VERSION,
  type TanBienCalculation,
} from "./tanbien";
import { spawn } from "node:child_process";
import path from "node:path";
import { normalize } from "../calendar";
import {
  profile,
  versions,
  vietnameseProfile,
  vietnameseVersions,
  resultId,
} from "../provenance";
export type Star = { name: string; brightness?: string; mutagen?: string };
export type Palace = {
  index: number;
  name: string;
  earthlyBranch: string;
  heavenlyStem: string;
  isBodyPalace: boolean;
  majorStars: Star[];
  minorStars: Star[];
  adjectiveStars: Star[];
  decadal: { range: [number, number] };
  ages: number[];
};
export type ChartData = {
  natalTransformations?: NatalTransformations;
  rulers?: RulerMetadata;
  tanBien?: TanBienCalculation | TanBienV2Calculation;
  calendarEvidence?: import("../calendar/vietnamese.cjs").LunarResult & {
    provider: string;
    calendarVersion: string;
    bridgeCalls: Record<string, number>;
    cnCalendarAccess: string;
    timeIndex: number;
    dayBoundary: string;
    leapStarMonth: string;
  };
  solarDate: string;
  lunarDate: string;
  lunar: {
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    isLeap: boolean;
  };
  time: string;
  timeRange: string;
  soul: string;
  body: string;
  fiveElementsClass: string;
  palaces: Palace[];
};
export async function calculate(input: unknown) {
  const normalized = normalize(input);
  if (normalized.unknownTime) throw new Error("UNKNOWN_TIME");
  if (normalized.profile === "vn-unavailable")
    throw new Error("VN_UNAVAILABLE");
  const v2 = normalized.profile === TANBIEN_V2_PROFILE;
  const tb = normalized.profile === TANBIEN_PROFILE || v2;
  const vn = normalized.profile === "vn-utc7-midnight-v1" || tb;
  let chart = await new Promise<ChartData>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(
          process.cwd(),
          vn ? "scripts/engine-vn.cjs" : "scripts/engine.cjs",
        ),
      ],
      { stdio: ["pipe", "pipe", "ignore"] },
    );
    let output = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("ENGINE_TIMEOUT"));
    }, 10000);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (text: string) => (output += text));
    child.on("error", () => {
      clearTimeout(timer);
      reject(new Error("ENGINE_ERROR"));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      try {
        if (code !== 0) {
          const failure = JSON.parse(output).error;
          reject(
            new Error(
              ["VN_DATE_RANGE", "CALENDAR_BOUNDARY_REVIEW"].includes(failure)
                ? failure
                : "ENGINE_ERROR",
            ),
          );
          return;
        }
        resolve(JSON.parse(output));
      } catch {
        reject(new Error("ENGINE_ERROR"));
      }
    });
    child.stdin.end(JSON.stringify(normalized));
  });
  assertChartIntegrity(chart);
  if (tb) {
    const applied = v2
      ? applyTanBienV2(chart, normalized)
      : applyTanBien(chart, normalized);
    chart = { ...applied.chart, tanBien: applied.calculation };
  }
  if (v2) {
    chart = applyYearRuler(chart);
    chart.natalTransformations = certifyNatalTransformations(chart);
  }
  assertChartIntegrity(chart);
  const result = {
    normalized,
    profile: tb
      ? {
          ...vietnameseProfile,
          id: v2 ? TANBIEN_V2_PROFILE : TANBIEN_PROFILE,
          system: "Tân Biên — bản thử có quy ước bổ sung",
          stars: `${v2 ? TANBIEN_V2_VERSION : TANBIEN_ENGINE_VERSION}; xem chart.tanBien.trace cho từng công thức và quy ước bổ sung`,
          validationStatus:
            "source-formulas-tested; source-conflicts-open; not-expert-reviewed",
        }
      : vn
        ? vietnameseProfile
        : profile,
    versions: tb
      ? {
          ...vietnameseVersions,
          ...(v2 ? { rulerConvention: YEAR_RULER_VERSION, dataContract: NATAL_TRANSFORMATIONS_VERSION } : {}),
          engine: v2 ? TANBIEN_V2_VERSION : TANBIEN_ENGINE_VERSION,
        }
      : vn
        ? vietnameseVersions
        : versions,
    chart,
    warnings: tb
      ? chart.tanBien!.limitations
      : vn
        ? [
            "Lịch thiên văn UTC+7, 1976–2050; đổi ngày 00:00, tháng nhuận lặp số tháng. Chưa phải chứng nhận cho mọi trường phái Tử vi Việt Nam.",
            "Dữ kiện an sao và khoảng đại vận chưa được chuyên gia độc lập xác nhận; chưa có luận giải hoặc điểm được duyệt.",
          ]
        : [
            "Lịch Trung Quốc tham chiếu; chưa hỗ trợ lịch Việt Nam.",
            "Chỉ là dữ kiện tính toán; chưa được chuyên gia độc lập xác nhận.",
          ],
    validationStatus: "software-only" as const,
  };
  return { ...result, resultId: resultId(result) };
}
export type ChartSnapshot = Awaited<ReturnType<typeof calculate>>;
