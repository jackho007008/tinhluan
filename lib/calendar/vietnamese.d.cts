export interface LunarResult {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
  monthLength: number;
  monthStart: string;
  nextMonthStart: string;
  newMoonUtc: string;
  nextNewMoonUtc: string;
  principalTerms: string[];
  boundaryRisks: { kind: string; utc: string; seconds: number }[];
}
export interface LunarMonth {
  lunarYear: number;
  lunarMonth: number;
  isLeap: boolean;
  startDay: number;
  endDay: number;
  length: number;
  newMoonUtc: string;
  nextNewMoonUtc: string;
  principalTerms: string[];
  boundaryRisks: LunarResult["boundaryRisks"];
}
export function solarToLunar(
  date: string,
  options?: { allowBoundaryRisk?: boolean },
): LunarResult;
export function lunarToSolar(input: {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}): string;
export function span(year: number): LunarMonth[];
export function civilDay(date: Date, offset?: number): number;
export function parseSolar(date: string, publicRange?: boolean): number;
export const MIN_DATE: string;
export const MAX_DATE: string;
