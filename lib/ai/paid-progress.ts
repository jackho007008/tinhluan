import { PAID_PALACES } from "./paid-contract";
import { readPaidContent } from "./paid-result";
import type { PaidResult } from "./paid-reading-v2";
export type PaidView = {
  eligible: boolean;
  simulation?: boolean;
  completed: number;
  processed: number;
  focused: number;
  limited: number;
  insufficient: number;
  total: 11;
  state:
    | "not-entitled"
    | "processing"
    | "completed"
    | "attention"
    | "content-limited";
  startedAt?: string;
  overEstimate: boolean;
  palaces: {
    palace: string;
    state: string;
    canRetry: boolean;
    result?: PaidResult;
  }[];
};
export function emptyPaidView(): PaidView {
  return {
    eligible: false,
    completed: 0,
    processed: 0,
    focused: 0,
    limited: 0,
    insufficient: 0,
    total: 11,
    state: "not-entitled",
    overEstimate: false,
    palaces: [],
  };
}
type Row = {
  palace: string;
  status: string;
  error_code?: string;
  retryable?: boolean;
  attempts: number;
  run_after: Date | string;
  response_id?: string;
  attempt_provider?: string;
  result?: PaidResult;
};
/** Read projection only: content coverage never changes grants or job status. */
export function paidProgress(
  rows: Row[],
  startedAt: string,
  simulation = false,
  now = Date.now(),
): PaidView {
  let processed = 0,
    focused = 0,
    limited = 0,
    insufficient = 0,
    completed = 0;
  const palaces = PAID_PALACES.map((palace) => {
    const r = rows.find((r) => r.palace === palace);
    if (r?.status === "completed") processed++;
    const content =
      r?.status === "completed" && r.result ? readPaidContent(r.result) : null;
    if (
      content &&
      (content.version === 1 || content.content.coverage !== "insufficient")
    )
      completed++;
    const unsupported = r?.status === "completed" && !content;
    if (content?.version === 2) {
      if (content.content.coverage === "focused") focused++;
      if (content.content.coverage === "limited") limited++;
      if (content.content.coverage === "insufficient") insufficient++;
    }
    const reconciling =
      r?.status === "uncertain" &&
      r.response_id &&
      r.attempt_provider === "openai" &&
      !["AI_RECONCILIATION_EXHAUSTED", "AI_RESPONSE_UNAVAILABLE"].includes(
        r.error_code || "",
      );
    return {
      palace,
      state: unsupported
        ? "unsupported"
        : reconciling
          ? "reconciling"
          : r?.status || "awaiting-queue",
      canRetry:
        !!r &&
        r.status === "error" &&
        !!r.retryable &&
        r.attempts < 3 &&
        new Date(r.run_after).getTime() <= now,
      ...(content && r?.result ? { result: r.result } : {}),
    };
  });

  const attention = palaces.some((p) =>
    ["error", "uncertain", "unsupported"].includes(p.state),
  );
  return {
    eligible: true,
    simulation,
    completed,
    processed,
    focused,
    limited,
    insufficient,
    total: 11,
    state: attention
      ? "attention"
      : processed === 11
        ? limited || insufficient
          ? "content-limited"
          : "completed"
        : "processing",
    startedAt,
    overEstimate:
      processed !== 11 && now - new Date(startedAt).getTime() > 300000,
    palaces,
  };
}
