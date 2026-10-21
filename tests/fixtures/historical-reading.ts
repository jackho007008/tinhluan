import { expect } from "vitest";
import { executeRules } from "../../lib/interpretation-rules/execute";
import type { ChartSnapshot } from "../../lib/tuvi-engine";
// Replay only the rule definitions stored with these historical claims, never today's catalog.
export function checkHistoricalClaims(snapshot: ChartSnapshot, claims: any[]) {
  const rules = [...new Map(claims.flatMap(c => c.rules).map(r => [r.id, r])).values()];
  const replay = executeRules(snapshot, rules, "internal-draft");
  expect(replay.traces.every(t => t.status === "matched")).toBe(true);
  expect(replay.previewClaims.map(c => c.text).sort()).toEqual(claims.map(c => c.text).sort());
  expect(replay.previewClaims.flatMap(c => c.rules).sort((a,b)=>a.id.localeCompare(b.id))).toEqual(rules.sort((a,b)=>a.id.localeCompare(b.id)));
}
