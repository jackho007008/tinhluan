import { it, expect, vi, afterEach } from "vitest";
import {
  providerFailure,
  isOutputValidationError,
} from "../lib/ai/provider-failure";
import { openaiNarrator } from "../lib/ai/provider";
import { operatorDisposition } from "../lib/ai/operator";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v21";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it.each([
  "credit_balance_exhausted",
  "billing_hard_limit_reached",
  "usage_limit_reached",
  "insufficient_quota",
])("holds %s without schema/rate-limit confusion", (code) => {
  expect(providerFailure({ code }, 429)).toEqual({
    code: "AI_BILLING_UNAVAILABLE",
    retryable: false,
  });
});
it("keeps transient limits, access failures and schema errors distinct", () => {
  expect(providerFailure({ code: "rate_limit_exceeded" }, 429)).toMatchObject({
    code: "AI_RATE_LIMITED",
    retryable: true,
  });
  expect(providerFailure({}, 403)).toMatchObject({
    code: "AI_ACCESS_UNAVAILABLE",
    retryable: false,
  });
  expect(providerFailure({ code: "server_error" })).toMatchObject({
    code: "AI_PROVIDER_FAILED",
    retryable: false,
  });
  for (const code of [
    "AI_COVERAGE_MISMATCH",
    "AI_DUPLICATE_SECTION_ID",
    "AI_CONTEXT_AS_DIRECT",
    "AI_UNVERIFIED_INTERPRETATION",
    "AI_REFERENCE_SCOPE",
    "AI_COVERAGE_UNSUPPORTED",
  ])
    expect(isOutputValidationError(code)).toBe(true);
  expect(isOutputValidationError("DB_FAILURE")).toBe(false);
  expect(
    operatorDisposition({
      status: "error",
      error_code: "AI_BILLING_UNAVAILABLE",
      attempts: 1,
    }),
  ).toMatchObject({ state: "billing-unavailable", needsOperator: true });
});
it.each(["failed", "incomplete", "cancelled"])(
  "SDK GET of %s retains receipt, usage and a terminal diagnosis",
  async (status) => {
    vi.stubEnv("OPENAI_API_KEY", "mock-only-no-network");
    vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6-astra");
    const fetcher = vi.fn(
      async (_url: unknown, _init?: unknown) =>
        new Response(
          JSON.stringify({
            id: "resp_existing",
            object: "response",
            status,
            model: "gpt-6-astra",
            created_at: 1793509246,
            error:
              status === "failed"
                ? {
                    code: "credit_balance_exhausted",
                    type: "insufficient_quota",
                    message: "DO_NOT_PERSIST_ACCOUNT_INFORMATION",
                  }
                : null,
            output: [],
            usage: null,
          }),
          { headers: { "Content-Type": "application/json" } },
        ),
    );
    vi.stubGlobal("fetch", fetcher);
    const r = await openaiNarrator(
      {
        paidTarget: { palace: "Quan Lộc", edition: "paid-palaces-ai-1.0.0" },
        facts: [],
        knowledge: [],
        missing: [],
        version: "paid-facts-1.1.0",
        knowledgeVersion: "paid-retrieval-1.3.0",
      },
      "same-attempt",
      {
        responseId: "resp_existing",
        promptVersion: PAID_PROMPT_CURRENT,
        onResponseCreated: async () => {
          throw Error("NO_NEW_RECEIPT");
        },
      },
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(fetcher.mock.calls[0]?.[0])).not.toContain("models");
    expect(r.responseId).toBe("resp_existing");
    expect(r.raw).toBeNull();
    expect(r.failure).toEqual({
      code:
        status === "failed"
          ? "AI_BILLING_UNAVAILABLE"
          : status === "incomplete"
            ? "AI_OUTPUT_INCOMPLETE"
            : "AI_PROVIDER_CANCELLED",
      retryable: false,
    });
    expect(r.estimatedCostUsd).toBeNull();
    expect(r.cost?.status).toBe("incomplete-usage");
    expect(JSON.stringify(r)).not.toContain(
      "DO_NOT_PERSIST_ACCOUNT_INFORMATION",
    );
  },
);
it.each([
  [
    "credit_balance_exhausted",
    "insufficient_quota",
    "AI_BILLING_UNAVAILABLE",
    false,
  ],
  ["rate_limit_exceeded", "rate_limit_error", "AI_RATE_LIMITED", true],
] as const)(
  "SDK 429 %s is classified without automatic CREATE retry",
  async (code, type, expected, retryable) => {
    vi.stubEnv("OPENAI_API_KEY", "mock-only-no-network");
    vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6-astra");
    let posts = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: any) => {
        if (String(url).includes("/models/"))
          return new Response(JSON.stringify({ id: "gpt-6-astra" }), {
            headers: { "Content-Type": "application/json" },
          });
        posts++;
        return new Response(
          JSON.stringify({
            error: { code, type, message: "Mock quota/limit" },
          }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }),
    );
    await expect(
      openaiNarrator(
        {
          paidTarget: { palace: "Tài Bạch", edition: "paid-palaces-ai-1.0.0" },
          facts: [],
          knowledge: [],
          missing: [],
          version: "paid-facts-1.1.0",
          knowledgeVersion: "paid-retrieval-1.3.0",
        },
        "new-attempt",
        {
          promptVersion: PAID_PROMPT_CURRENT,
          onResponseCreated: async () => {
            throw Error("NO_RECEIPT");
          },
        },
      ),
    ).rejects.toMatchObject({ code: expected, retryable, uncertain: false });
    expect(posts).toBe(1);
  },
);
it.each([
  [403, "model_not_found", "AI_ACCESS_UNAVAILABLE"],
  [429, "credit_balance_exhausted", "AI_BILLING_UNAVAILABLE"],
] as const)(
  "classifies model preflight %s before any CREATE",
  async (status, code, expected) => {
    vi.stubEnv("OPENAI_API_KEY", "mock-only");
    vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6.1-sol");
    const fetcher = vi.fn(async (_input: unknown, _init?: unknown) =>
      Response.json({ error: { code, message: "DO_NOT_LOG" } }, { status }),
    );
    vi.stubGlobal("fetch", fetcher);
    await expect(
      openaiNarrator(
        {
          paidTarget: { palace: "Tài Bạch", edition: "paid-palaces-ai-1.0.0" },
          facts: [],
          knowledge: [],
          missing: [],
          version: "paid-facts-1.1.0",
          knowledgeVersion: "paid-retrieval-1.14.0",
        },
        "attempt",
        {
          promptVersion: PAID_PROMPT_CURRENT,
          onResponseCreated: async () => {
            throw Error("NO_CREATE");
          },
        },
      ),
    ).rejects.toMatchObject({
      code: expected,
      retryable: false,
      uncertain: false,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(fetcher.mock.calls[0]?.[0])).toContain("/models/");
  },
);
it("pins the new CREATE cache lifetime and reuses saved request metadata for GET pricing", async () => {
  vi.stubEnv("OPENAI_API_KEY", "mock-only");
  vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6.1-sol");
  const input: any = {
    paidTarget: { palace: "Tật Ách", edition: "paid-palaces-ai-1.0.0" },
    facts: [],
    knowledge: [],
    missing: [],
    version: "paid-facts-1.1.0",
    knowledgeVersion: "paid-retrieval-1.14.0",
  };
  const response = {
    id: "resp_mock_cache_options",
    object: "response",
    status: "completed",
    model: "gpt-6.1-sol",
    output: [
      {
        id: "msg_mock",
        type: "message",
        status: "completed",
        role: "assistant",
        content: [
          {
            type: "output_text",
            text: JSON.stringify({
              schemaVersion: "paid-reading-v2.0.0",
              coverage: "insufficient",
              coverageNote: "BẢN MOCK.",
              sections: [],
              limitations: ["BẢN MOCK."],
            }),
            annotations: [],
          },
        ],
      },
    ],
    usage: {
      input_tokens: 100,
      input_tokens_details: { cached_tokens: 0, cache_write_tokens: 100 },
      output_tokens: 10,
      output_tokens_details: { reasoning_tokens: 5 },
    },
  };
  const requests: any[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: any, init: any) => {
      const r = new Request(input, init);
      if (new URL(r.url).pathname.includes("/models/"))
        return Response.json({ id: "gpt-6.1-sol" });
      requests.push({
        method: r.method,
        body: r.method === "POST" ? await r.json() : null,
      });
      return Response.json(response);
    }),
  );
  const created = await openaiNarrator(input, "new", {
    promptVersion: "paid-palaces-vietnamese-2.8.0",
    onResponseCreated: async () => {},
  });
  expect(requests[0].body.prompt_cache_options).toEqual({ ttl: "30m" });
  expect(created.cost?.cacheWriteBasis).toBe("saved-request-cache-options");
  expect(created.estimatedCostUsd).toBeCloseTo(0.00035, 10);
  const reopened = await openaiNarrator(input, "same", {
    responseId: response.id,
    promptVersion: "paid-palaces-vietnamese-2.8.0",
    cacheWriteTtl: "12h",
    onResponseCreated: async () => {
      throw Error("NO_NEW_RECEIPT");
    },
  });
  expect(requests.map((r) => r.method)).toEqual(["POST", "GET"]);
  expect(reopened.cost?.cacheWriteBasis).toBe("saved-request-cache-options");
  expect(reopened.estimatedCostUsd).toBeCloseTo(0.0006, 10);
});
