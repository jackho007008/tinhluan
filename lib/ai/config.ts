function number(name: string, fallback: number, min: number, max: number) {
  const n = Number(process.env[name] ?? fallback);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
}
export const aiEnabled = () => process.env.AI_MENH_ENABLED === "true";
/** No cross-purpose fallback. OPENAI_MODEL belongs only to legacy artifacts. */
export const aiModels = () => ({
  freeEdit: process.env.AI_FREE_EDIT_MODEL?.trim() || undefined,
  paidReading: process.env.AI_PAID_READING_MODEL?.trim() || undefined,
});
export function aiConfig() {
  const model = process.env.OPENAI_MODEL?.trim(),
    apiKey = process.env.OPENAI_API_KEY?.trim();
  return {
    enabled: aiEnabled(),
    model,
    apiKey,
    configured: !!(apiKey && model),
    timeoutMs: number("AI_MENH_TIMEOUT_MS", 120000, 1000, 180000),
    background: process.env.AI_MENH_BACKGROUND === "true",
    backgroundWaitMs: number(
      "AI_MENH_BACKGROUND_WAIT_MS",
      300000,
      1000,
      300000,
    ),
    maxOutputTokens: number("AI_MENH_MAX_OUTPUT_TOKENS", 12000, 2000, 20000),
    maxDailyJobs: number("AI_MENH_MAX_DAILY_JOBS", 20, 1, 500),
    reasoningEffort: process.env.OPENAI_REASONING_EFFORT || "high",
  };
}
