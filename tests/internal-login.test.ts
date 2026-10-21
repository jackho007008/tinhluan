import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ rateLimit: vi.fn(), validKey: vi.fn() }));
vi.mock("@/lib/db", () => ({ rateLimit: mocks.rateLimit }));
vi.mock("@/lib/internal-review/auth", () => ({ validKey: mocks.validKey, issueReviewSession: vi.fn() }));
vi.mock("@/lib/internal-review/origin", () => ({ internalRequestOrigin: () => "http://localhost:3000" }));
import { POST } from "../app/api/internal-login/route";
afterEach(() => vi.resetAllMocks());
it("distinguishes an actual login limit from database unavailability and fails closed", async () => {
  for (const [error, status] of [[new Error("RATE_LIMIT"), 429], [Object.assign(new Error("connection refused"), {code:"ECONNREFUSED"}), 503]] as const) {
    mocks.rateLimit.mockRejectedValueOnce(error);
    const res = await POST(new NextRequest("http://localhost:3000/api/internal-login", {method:"POST"}));
    expect(res.status).toBe(status);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(await res.text()).not.toContain("ECONNREFUSED");
  }
  expect(mocks.validKey).not.toHaveBeenCalled();
  expect(mocks.rateLimit).toHaveBeenCalledWith("internal-login", 8);
});
