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
