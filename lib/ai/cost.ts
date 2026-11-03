/** Provider usage is inclusive: cache reads/writes are subsets of input;
 * reasoning is a subset of output. Missing cache counters mean unknown, not zero. */
export const ASTRA_PRICE = {
  version: "openai-standard-2026-10-30",
  source: "https://developers.openai.com/api/docs/models/gpt-6-astra",
  currency: "USD",
  input: 10,
  cachedRead: 1,
  cacheWrite: 12.5,
  cacheWrite12h: 25,
  output: 50,
} as const;
export const SOL_PRICE = {
  version: "openai-standard-2026-11-03-sol",
  source: "https://developers.openai.com/api/docs/models/gpt-6.1-sol",
  currency: "USD",
  input: 2,
  cachedRead: 0.1,
  cacheWrite: 2.5,
  cacheWrite12h: 5,
  output: 10,
} as const;
const count = (n: unknown): n is number =>
  typeof n === "number" && Number.isSafeInteger(n) && n >= 0;
export function responseCost(
  response: any,
  savedRequest?: { cacheWriteTtl: "30m" | "12h" },
) {
  const u = response.usage,
    read = u?.input_tokens_details?.cached_tokens,
    write = u?.input_tokens_details?.cache_write_tokens,
    reason = u?.output_tokens_details?.reasoning_tokens;
  const valid =
    u &&
    [u.input_tokens, u.output_tokens, read, write, reason].every(count) &&
    read + write <= u.input_tokens &&
    reason <= u.output_tokens;
  const ttl = response.prompt_cache_options?.ttl ?? savedRequest?.cacheWriteTtl;
  const details = u?.input_tokens_details?.cache_write_tokens_details;
  // GPT-6 uses prompt_cache_options.ttl. The legacy prompt_cache_retention
  // field is not a write lifetime for these models. Never infer 12h from 24h.
  const ttlSupported = ttl === undefined || ttl === "30m" || ttl === "12h";
  const splitValid =
    details === undefined ||
    (details !== null &&
      count(details.ttl_30m_tokens) &&
      count(details.ttl_12h_tokens) &&
      details.ttl_30m_tokens + details.ttl_12h_tokens === write &&
      Object.keys(details).every((k) =>
        ["ttl_30m_tokens", "ttl_12h_tokens"].includes(k),
      ));
  const writes30m = details?.ttl_30m_tokens ?? (ttl === "12h" ? 0 : write);
  const writes12h = details?.ttl_12h_tokens ?? (ttl === "12h" ? write : 0);
  const usage = {
    inputTokens: u?.input_tokens ?? 0,
    cachedInputTokens: read ?? 0,
    outputTokens: u?.output_tokens ?? 0,
    reasoningTokens: reason ?? 0,
    ...(count(write) ? { cacheWriteTokens: write } : {}),
    ...(valid && ttlSupported && splitValid
      ? { cacheWrite30mTokens: writes30m, cacheWrite12hTokens: writes12h }
      : {}),
    cacheLifetimeBreakdownComplete:
      !!valid &&
      ttlSupported &&
      splitValid &&
      (details !== undefined || ttl !== undefined || write === 0),
    cacheBreakdownComplete: !!valid,
  };
  const tier = response.service_tier || "default";
  const basePrice =
    response.model === "gpt-6-astra"
      ? ASTRA_PRICE
      : response.model === "gpt-6.1-sol"
        ? SOL_PRICE
        : null;
  const supported =
    basePrice !== null &&
    ["default", "standard", "flex", "batch", "priority"].includes(tier);
  // Priority does not imply Fast. Unknown tiers/pricing are deliberately unpriced.
  const priced =
    supported && tier !== "priority" && valid && ttlSupported && splitValid;
  const long = priced && u.input_tokens > 272000;
  const factor = tier === "flex" || tier === "batch" ? 0.5 : 1;
  const prices = {
    ...(basePrice || ASTRA_PRICE),
    input: (basePrice || ASTRA_PRICE).input * (long ? 2 : 1) * factor,
    cachedRead: (basePrice || ASTRA_PRICE).cachedRead * (long ? 2 : 1) * factor,
    cacheWrite: (basePrice || ASTRA_PRICE).cacheWrite * (long ? 2 : 1) * factor,
    cacheWrite12h:
      (basePrice || ASTRA_PRICE).cacheWrite12h * (long ? 2 : 1) * factor,
    output: (basePrice || ASTRA_PRICE).output * (long ? 1.5 : 1) * factor,
    serviceTier: tier,
  };
  const breakdown = valid
    ? {
        uncachedInputTokens: u.input_tokens - read - write,
        cachedReadTokens: read,
        cacheWriteTokens: write,
        ...(splitValid && ttlSupported
          ? { cacheWrite30mTokens: writes30m, cacheWrite12hTokens: writes12h }
          : {}),
        outputTokens: u.output_tokens,
        reasoningTokensIncluded: reason,
      }
    : null;
  const estimatedCostUsd =
    priced && breakdown
      ? (breakdown.uncachedInputTokens * prices.input +
          read * prices.cachedRead +
          writes30m * prices.cacheWrite +
          writes12h * prices.cacheWrite12h +
          u.output_tokens * prices.output) /
        1e6
      : null;
  return {
    usage,
    estimatedCostUsd,
    cost: {
      kind: "estimate-not-provider-invoice" as const,
      algorithmVersion: "response-usage-cost-2.0.0",
      status: !valid
        ? "incomplete-usage"
        : !splitValid || !ttlSupported
          ? "unsupported-cache-usage"
          : !priced
            ? "unsupported-price"
            : "estimated",
      breakdown,
      price: priced ? prices : null,
      cacheWriteBasis:
        details !== undefined
          ? "provider-ttl-breakdown"
          : response.prompt_cache_options?.ttl !== undefined
            ? "provider-cache-options"
            : savedRequest
              ? "saved-request-cache-options"
              : "documented-default-30m-assumption",
      assumptions:
        details === undefined && ttl === undefined && write > 0
          ? [
              "No write-lifetime breakdown supplied; estimate uses documented 30m default. Not invoice reconciliation.",
            ]
          : [],
    },
  };
}
