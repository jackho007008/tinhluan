import { backgroundLimits } from "./background";
export function operatorDisposition(
  r: {
    status: string;
    error_code?: string;
    has_response_id?: boolean;
    attempt_provider?: string;
    retryable?: boolean;
    attempts: number;
    run_after?: Date | string;
  },
  now = Date.now(),
) {
  if (r.status === "completed")
    return {
      state: "completed",
      needsOperator: false,
      action: "read-saved-result",
    };
  if (r.status === "error" && r.error_code === "AI_BILLING_UNAVAILABLE")
    return {
      state: r.retryable ? "billing-retry-authorized" : "billing-unavailable",
      needsOperator: true,
      action: r.retryable
        ? "explicit-owner-retry-required-no-create-on-read"
        : "verify-provider-credit-and-project-limits-no-automatic-create",
    };
  if (r.status === "queued")
    return {
      state: "queued",
      needsOperator: false,
      action: "await-approved-supervisor",
    };
  if (r.status === "running")
    return {
      state: r.has_response_id ? "automatic-reconciliation" : "dispatching",
      needsOperator: false,
      action: "observe-lease-no-duplicate-dispatch",
    };
  if (r.status === "uncertain") {
    if (!r.has_response_id)
      return {
        state: "uncertain-missing-id",
        needsOperator: true,
        action: "trace-attempt-with-provider-support-never-auto-create",
      };
    if (r.error_code === "AI_RECONCILIATION_EXHAUSTED")
      return {
        state: "exhausted",
        needsOperator: true,
        action: "review-budget-and-same-response-get-no-create",
      };
    if (r.error_code === "AI_RESPONSE_UNAVAILABLE")
      return {
        state: "response-unavailable",
        needsOperator: true,
        action: "provider-support-for-receipt-no-create",
      };
    if (r.attempt_provider === "openai")
      return {
        state: "automatic-reconciliation",
        needsOperator: false,
        action: "wait-until-run-after",
      };
    return {
      state: "uncertain-provider",
      needsOperator: true,
      action: "inspect-provider-receipt-no-create",
    };
  }
  const retryable =
    r.status === "error" &&
    r.retryable &&
    r.attempts < backgroundLimits().maxAttempts &&
    (!r.run_after || new Date(r.run_after).getTime() <= now);
  return {
    state: retryable ? "error-retryable" : "error-held",
    needsOperator: true,
    action: r.has_response_id
      ? "inspect-saved-response-and-validate-before-explicit-retry"
      : "fix-known-error-before-explicit-budgeted-retry",
  };
}
