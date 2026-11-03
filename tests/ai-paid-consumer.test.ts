import { afterEach, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({
  blocked: false,
  attempts: 0,
  options: [] as any[],
  reconciles: 0,
}));
const lease = vi.hoisted(() => ({
  query: vi.fn(async () => ({ rows: [{ ok: true }] })),
  release: vi.fn(),
}));
const query = vi.hoisted(() =>
  vi.fn(async (sql: string) => {
    if (sql.includes("SELECT count(*)"))
      return { rows: [{ count: String(state.attempts) }] };
    if (sql.includes("SELECT EXISTS"))
      return { rows: [{ blocked: state.blocked }] };
    if (sql.includes("min(j.run_after)")) return { rows: [{ due: null }] };
    throw Error("UNEXPECTED_QUERY");
  }),
);
vi.mock("../lib/db", () => ({ pool: { query, connect: async () => lease } }));
vi.mock("../lib/ai/paid-store", () => ({
  reconcilePaidOrders: vi.fn(async () => {}),
}));
const run = vi.hoisted(() => vi.fn());
vi.mock("../lib/ai/worker", () => ({ runAiMenhJob: run }));
import { consumePaidScope } from "../lib/ai/paid-consumer";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  state.blocked = false;
  state.attempts = 0;
  state.options = [];
  state.reconciles = 0;
});
function setup() {
  vi.stubEnv("AI_PAID_ENABLED", "true");
  vi.stubEnv("SEPAY_LIVE_ENABLED", "false");
  vi.stubEnv("CHECKOUT_TEST_ENABLED", "true");
}
const scope = {
  readingId: "00000000-0000-4000-8000-000000000036",
  maxNewJobs: 11,
  maxTicks: 10,
  runtimeMs: 1000,
};
it.each(["AI_BILLING_UNAVAILABLE", "AI_ACCESS_UNAVAILABLE"])(
  "halts new dispatch after %s while allowing GET of a sibling receipt",
  async (code) => {
    setup();
    run.mockImplementation(async (_n, options) => {
      state.options.push(options);
      if (state.options.length === 1) {
        expect(options.allowCreate).toBe(true);
        state.attempts++;
        state.blocked = true;
        return true;
      }
      if (state.options.length === 2) {
        expect(options.allowCreate).toBe(false);
        state.reconciles++;
        return true;
      }
      return false;
    });
    await consumePaidScope(scope);
    expect(state.attempts).toBe(1);
    expect(state.reconciles).toBe(1);
    expect(state.options.map((o) => o.allowCreate)).toEqual([
      true,
      false,
      false,
    ]);
    expect(
      query.mock.calls.find(([sql]) => sql.includes("SELECT EXISTS"))?.[0],
    ).toContain(code);
    expect(state.options.every((o) => o.readingId === scope.readingId)).toBe(
      true,
    );
    expect(lease.release).toHaveBeenCalledTimes(1);
  },
);
it("keeps a persisted account hold on restart and in a narrower palace scope", async () => {
  setup();
  state.blocked = true;
  run.mockImplementation(async (_n, options) => {
    state.options.push(options);
    return false;
  });
  await consumePaidScope({ ...scope, palace: "Tài Bạch" });
  expect(state.options).toEqual([
    expect.objectContaining({ palace: "Tài Bạch", allowCreate: false }),
  ]);
  expect(state.attempts).toBe(0);
});
it("keeps maxNewJobs=0 reconciliation-only even with no account failure", async () => {
  setup();
  run.mockImplementation(async (_n, options) => {
    state.options.push(options);
    return false;
  });
  await consumePaidScope({ ...scope, maxNewJobs: 0 });
  expect(state.options[0].allowCreate).toBe(false);
});
it("still enforces the CREATE count when no account error exists", async () => {
  setup();
  run.mockImplementation(async (_n, options) => {
    state.options.push(options);
    if (options.allowCreate) {
      state.attempts++;
      return true;
    }
    return false;
  });
  await consumePaidScope({ ...scope, maxNewJobs: 1 });
  expect(state.attempts).toBe(1);
  expect(state.options.map((o) => o.allowCreate)).toEqual([true, false]);
});
