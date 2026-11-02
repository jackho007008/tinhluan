/** Stable, non-secret codes only. Provider messages may contain account details. */
export function providerFailure(error: { code?: unknown; type?: unknown } | null | undefined, status?: number) {
  const code = typeof error?.code === "string" ? error.code : "";
  if (["credit_balance_exhausted", "billing_hard_limit_reached", "usage_limit_reached", "insufficient_quota"].includes(code) || error?.type === "insufficient_quota")
    return { code: "AI_BILLING_UNAVAILABLE", retryable: false };
  if (status === 401 || status === 403 || ["invalid_api_key", "model_not_found"].includes(code))
    return { code: "AI_ACCESS_UNAVAILABLE", retryable: false };
  if (status === 429 || code === "rate_limit_exceeded")
    return { code: "AI_RATE_LIMITED", retryable: true };
  if (status && status >= 400 && status < 500)
    return { code: "AI_REQUEST_REJECTED", retryable: false };
  // Terminal provider failure is not a schema violation. New dispatch, if any,
  // must still use the existing explicit retry/attempt/budget checks.
  return { code: "AI_PROVIDER_FAILED", retryable: false };
}

export const isOutputValidationError = (message: string) =>
  /^AI_(INVALID_SCHEMA|SECTION_ORDER|UNKNOWN_REFERENCE|SCOPE_VIOLATION|COVERAGE_MISMATCH|DUPLICATE_SECTION_ID|REFERENCE_SCOPE|UNVERIFIED_INTERPRETATION|CONTEXT_AS_DIRECT|COVERAGE_UNSUPPORTED|MIXED_ATTRIBUTION|SOURCE_QUALIFIER_LOST)$/.test(message);
