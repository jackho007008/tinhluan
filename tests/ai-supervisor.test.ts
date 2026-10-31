import { it, expect } from "vitest";
import { supervisorScopeSchema } from "../lib/ai/supervisor";
import { operatorDisposition } from "../lib/ai/operator";
const scope = {
  id: "qa-supervisor",
  database: "qa_isolated",
  checkout: "/tmp/qa",
  readingIds: ["00000000-0000-4000-8000-000000000036"],
  createdAt: "2026-10-31T00:00:00Z",
  expiresAt: "2026-10-31T01:00:00Z",
  maxRuns: 3,
  maxScopesPerRun: 1,
  maxNewJobsPerScope: 1,
  runtimeMs: 2000,
  maxTicks: 5,
};
it("requires explicit bounded allowlist/lifetime and rejects secret/config extras", () => {
  expect(supervisorScopeSchema.safeParse(scope).success).toBe(true);
  for (const v of [
    { ...scope, readingIds: [] },
    { ...scope, readingIds: [...scope.readingIds, ...scope.readingIds] },
    { ...scope, expiresAt: "2026-11-02T00:00:00Z" },
    { ...scope, maxRuns: Infinity },
    { ...scope, maxNewJobsPerScope: 12 },
    { ...scope, OPENAI_API_KEY: "not-a-real-key" },
  ])
    expect(supervisorScopeSchema.safeParse(v).success).toBe(false);
});
it.each([
  [{ status: "queued" }, "queued", false],
  [{ status: "completed" }, "completed", false],
  [
    { status: "running", has_response_id: true },
    "automatic-reconciliation",
    false,
  ],
  [
    { status: "uncertain", has_response_id: true, attempt_provider: "openai" },
    "automatic-reconciliation",
    false,
  ],
  [
    { status: "uncertain", has_response_id: false },
    "uncertain-missing-id",
    true,
  ],
  [
    {
      status: "uncertain",
      has_response_id: true,
      error_code: "AI_RECONCILIATION_EXHAUSTED",
    },
    "exhausted",
    true,
  ],
  [
    {
      status: "uncertain",
      has_response_id: true,
      error_code: "AI_RESPONSE_UNAVAILABLE",
    },
    "response-unavailable",
    true,
  ],
  [
    { status: "error", retryable: true, run_after: "2026-01-01T00:00:00Z" },
    "error-retryable",
    true,
  ],
  [{ status: "error", retryable: true, attempts: 3 }, "error-held", true],
] as const)(
  "classifies operator disposition without dispatch: %j",
  (r, state, needsOperator) => {
    const result = operatorDisposition({ attempts: 1, ...r });
    expect(result.state).toBe(state);
    expect(result.needsOperator).toBe(needsOperator);
    expect(result.action).not.toBe("create");
  },
);
