import { afterEach, describe, expect, it, vi } from "vitest";
import { internalRequestOrigin } from "../lib/internal-review/origin";
afterEach(() => vi.unstubAllEnvs());
describe("internal origin boundary", () => {
  it("accepts only explicitly configured exact origins", () => {
    vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
    vi.stubEnv(
      "INTERNAL_REVIEW_ALLOWED_ORIGINS",
      "https://review.example.test",
    );
    expect(internalRequestOrigin("http://localhost:3000")).toBe(
      "http://localhost:3000",
    );
    expect(internalRequestOrigin("https://review.example.test")).toBe(
      "https://review.example.test",
    );
    for (const origin of [
      null,
      "null",
      "https://review.example.test.attacker.test",
      "http://review.example.test",
      "http://127.0.0.1:3000",
    ])
      expect(internalRequestOrigin(origin)).toBeNull();
  });
  it("fails closed on malformed configuration rather than broadening access", () => {
    vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
    for (const value of [
      "*",
      "https://*.example.test",
      "https://user:password@example.test",
      "https://example.test/path",
      "https://example.test?query=1",
    ]) {
      vi.stubEnv("INTERNAL_REVIEW_ALLOWED_ORIGINS", value);
      expect(internalRequestOrigin("http://localhost:3000")).toBeNull();
    }
    vi.stubEnv("INTERNAL_REVIEW_ALLOWED_ORIGINS", "");
    vi.stubEnv("APP_ORIGIN", "https://example.test,http://localhost:3000");
    expect(internalRequestOrigin("http://localhost:3000")).toBeNull();
  });
});
