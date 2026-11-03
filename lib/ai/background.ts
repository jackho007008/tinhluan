const bounded = (name: string, fallback: number, min: number, max: number) => {
  const n = Number(process.env[name] ?? fallback);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
};
export const backgroundLimits = () => ({
  maxChecks: Math.floor(bounded("AI_BACKGROUND_MAX_CHECKS", 12, 1, 100)),
  maxAgeMs: bounded("AI_BACKGROUND_MAX_AGE_MS", 86400000, 60000, 172800000),
  baseDelayMs: bounded("AI_BACKGROUND_BASE_DELAY_MS", 30000, 1000, 600000),
  maxDelayMs: bounded("AI_BACKGROUND_MAX_DELAY_MS", 300000, 1000, 3600000),
  maxRunning: Math.floor(bounded("AI_PAID_MAX_RUNNING", 4, 1, 11)),
  maxAttempts: Math.floor(bounded("AI_PAID_MAX_ATTEMPTS", 3, 1, 3)),
  maxDailyCreates: Math.floor(bounded("AI_PAID_MAX_DAILY_CREATES", 20, 1, 100)),
  dailyBudgetUsd: bounded("AI_PAID_DAILY_BUDGET_USD", 10, 0, 1000),
  reservationUsd: bounded("AI_PAID_REQUEST_RESERVATION_USD", 2, 0.01, 100),
});
export type BackgroundState = {
  cacheWriteTtl?: "30m" | "12h";
  observationMsTotal?: number;
  checks?: number;
  reservedUsd?: number;
  providerCreatedAt?: string;
  providerCompletedAt?: string;
  lastCheckedAt?: string;
  lastCode?: string;
};
export function backgroundDecision(
  state: BackgroundState,
  started: Date | string,
  now = Date.now(),
) {
  const l = backgroundLimits(),
    checks = state.checks || 0;
  return {
    exhausted:
      checks >= l.maxChecks || now - new Date(started).getTime() >= l.maxAgeMs,
    delayMs: Math.min(l.maxDelayMs, l.baseDelayMs * 2 ** Math.min(checks, 16)),
  };
}
