import { it, expect } from "vitest";
import fixtures from "./fixtures/ai-cost-usage.json";
import { responseCost } from "../lib/ai/cost";
it("reconciles recorded 3.3 usage with cache-write subsets and reasoning included exactly once", () => {
  const r = responseCost(fixtures[3]);
  expect(r.usage.cacheWriteTokens).toBe(28105);
  expect(r.cost.breakdown?.uncachedInputTokens).toBe(3);
  expect(r.estimatedCostUsd).toBeCloseTo(0.6471425, 8);
  expect(r.cost.price?.version).toBe("openai-standard-2026-10-30");
  expect(r.cost.kind).toBe("estimate-not-provider-invoice");
});
it.each(fixtures.slice(0, 3))(
  "does not invent missing 3.2 cache writes or backfill $palace",
  (f) => {
    expect(responseCost(f).estimatedCostUsd).toBeNull();
    expect(responseCost(f).cost.status).toBe("incomplete-usage");
  },
);
it("handles cached reads, writes, uncached input and output without overlap", () => {
  const r = responseCost({
    model: "gpt-6-astra",
    usage: {
      input_tokens: 100,
      input_tokens_details: { cached_tokens: 30, cache_write_tokens: 20 },
      output_tokens: 40,
      output_tokens_details: { reasoning_tokens: 25 },
    },
  });
  expect(r.estimatedCostUsd).toBeCloseTo(
    (50 * 10 + 30 + 20 * 12.5 + 40 * 50) / 1e6,
    9,
  );
});
it("refuses inconsistent, negative, unknown model/tier usage and incomplete counters", () => {
  const r = structuredClone(fixtures[3]);
  r.usage.input_tokens_details.cached_tokens = 100;
  expect(responseCost(r).estimatedCostUsd).toBeNull();
  expect(
    responseCost({ ...fixtures[3], model: "unknown" }).estimatedCostUsd,
  ).toBeNull();
  expect(
    responseCost({ ...fixtures[3], service_tier: "unknown" }).estimatedCostUsd,
  ).toBeNull();
  const u = structuredClone(fixtures[3]);
  u.usage.output_tokens_details.reasoning_tokens = -1;
  expect(responseCost(u).estimatedCostUsd).toBeNull();
});
it("records long-context and Flex prices explicitly rather than using Standard silently", () => {
  const f = structuredClone(fixtures[3]);
  f.usage.input_tokens = 300000;
  const r = responseCost({ ...f, service_tier: "flex" });
  expect(r.cost.price?.input).toBe(10);
  expect(r.cost.price?.cacheWrite).toBe(12.5);
  expect(r.cost.price?.output).toBe(37.5);
});
it("prices explicitly selected Sol with its own table, without changing Astra fixtures", () => {
  const response = {
    model: "gpt-6.1-sol",
    service_tier: "default",
    usage: {
      input_tokens: 100,
      input_tokens_details: { cached_tokens: 30, cache_write_tokens: 20 },
      output_tokens: 40,
      output_tokens_details: { reasoning_tokens: 25 },
    },
  };
  const sol = responseCost(response);
  expect(sol.estimatedCostUsd).toBeCloseTo(
    (50 * 2 + 30 * 0.1 + 20 * 2.5 + 40 * 10) / 1e6,
    10,
  );
  expect(sol.cost.price?.version).toBe("openai-standard-2026-11-03-sol");
  expect(sol.cost.price?.source).toContain("gpt-6.1-sol");
  expect(sol.cost.breakdown?.reasoningTokensIncluded).toBe(25);
  expect(
    responseCost({ ...response, service_tier: "flex" }).estimatedCostUsd,
  ).toBeCloseTo(sol.estimatedCostUsd! / 2, 10);
  expect(
    responseCost({ ...response, model: "unconfirmed-model" }).estimatedCostUsd,
  ).toBeNull();
  expect(responseCost(fixtures[3]).estimatedCostUsd).toBeCloseTo(0.6471425, 8);
});
it("prices mixed 30m/12h writes from actual usage exactly once", () => {
  const r = responseCost({
    model: "gpt-6.1-sol",
    usage: {
      input_tokens: 12000,
      input_tokens_details: {
        cached_tokens: 4000,
        cache_write_tokens: 7000,
        cache_write_tokens_details: {
          ttl_30m_tokens: 3000,
          ttl_12h_tokens: 4000,
        },
      },
      output_tokens: 100,
      output_tokens_details: { reasoning_tokens: 80 },
    },
  });
  expect(r.estimatedCostUsd).toBeCloseTo(
    (1000 * 2 + 4000 * 0.1 + 3000 * 2.5 + 4000 * 5 + 100 * 10) / 1e6,
    10,
  );
  expect(r.cost.cacheWriteBasis).toBe("provider-ttl-breakdown");
  expect(r.cost.breakdown?.cacheWrite12hTokens).toBe(4000);
});
it("uses cache options rather than legacy 24h retention and records missing-lifetime assumptions", () => {
  const f = {
    model: "gpt-6.1-sol",
    usage: {
      input_tokens: 100,
      input_tokens_details: { cached_tokens: 0, cache_write_tokens: 100 },
      output_tokens: 10,
      output_tokens_details: { reasoning_tokens: 5 },
    },
    prompt_cache_retention: "24h",
  };
  expect(
    responseCost({ ...f, prompt_cache_options: { ttl: "12h" } })
      .estimatedCostUsd,
  ).toBeCloseTo(0.0006, 10);
  const defaulted = responseCost(f);
  expect(defaulted.estimatedCostUsd).toBeCloseTo(0.00035, 10);
  expect(defaulted.cost.assumptions.length).toBe(1);
  expect(
    responseCost({ ...f, prompt_cache_options: { ttl: "24h" } })
      .estimatedCostUsd,
  ).toBeNull();
  expect(
    responseCost({ ...f, prompt_cache_options: { ttl: "24h" } }).cost.status,
  ).toBe("unsupported-cache-usage");
});
it.each([
  { ttl_30m_tokens: 30, ttl_12h_tokens: 80 },
  { ttl_30m_tokens: 100 },
  { ttl_30m_tokens: 100, ttl_12h_tokens: 0, ttl_24h_tokens: 5 },
  { ttl_30m_tokens: -1, ttl_12h_tokens: 101 },
  null,
])(
  "does not price incomplete or inconsistent TTL write counters: %j",
  (cache_write_tokens_details) => {
    expect(
      responseCost({
        model: "gpt-6-astra",
        usage: {
          input_tokens: 100,
          input_tokens_details: {
            cached_tokens: 0,
            cache_write_tokens: 100,
            cache_write_tokens_details,
          },
          output_tokens: 1,
          output_tokens_details: { reasoning_tokens: 0 },
        },
      }).estimatedCostUsd,
    ).toBeNull();
  },
);
it("keeps a saved request lifetime on GET, without claiming it came from provider counters", () => {
  const raw = {
    model: "gpt-6.1-sol",
    usage: {
      input_tokens: 100,
      input_tokens_details: { cached_tokens: 0, cache_write_tokens: 100 },
      output_tokens: 10,
      output_tokens_details: { reasoning_tokens: 5 },
    },
  };
  const r = responseCost(raw, { cacheWriteTtl: "12h" });
  expect(r.estimatedCostUsd).toBeCloseTo(0.0006, 10);
  expect(r.cost.cacheWriteBasis).toBe("saved-request-cache-options");
  expect(r.cost.assumptions).toEqual([]);
  expect(r.usage.cacheLifetimeBreakdownComplete).toBe(true);
  expect(r.usage.cacheWrite12hTokens).toBe(100);
  expect(responseCost(raw).usage.cacheLifetimeBreakdownComplete).toBe(false);
});
