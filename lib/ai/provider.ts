import { paidOutputSchema } from "./paid-version";
import { responseCost } from "./cost";
import { paidInstructions, paidUserInput, PAID_PROMPT } from "./paid-contract";
import { aiModels } from "./config";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { aiConfig } from "./config";
import { narrationSchema, type MenhInput, type AiResult } from "./contract";
import { menhInstructions, menhUserInput } from "./prompt";
export type Generation = {
  raw: unknown;
  model: string;
  provider: AiResult["provider"];
  responseId: string;
  usage: AiResult["usage"];
  durationMs: number;
  cost?: AiResult["cost"];
  timing?: AiResult["timing"];
  estimatedCostUsd: number | null;
};
export type Narrator = (
  input: MenhInput,
  attemptId: string,
  recovery?: {
    responseId?: string;
    promptVersion?: string;
    onResponseCreated: (id: string, model: string) => Promise<void>;
  },
) => Promise<Generation>;
export class GenerationFailure extends Error {
  constructor(
    public code: string,
    public retryable: boolean,
    public uncertain = false,
    public background?: import("./background").BackgroundState,
  ) {
    super(code);
  }
}
/** No key/model fallback and no SDK retry of a possibly billed request. */
export const openaiNarrator: Narrator = async (input, attemptId, recovery) => {
  if (input.paidTarget && !recovery?.promptVersion)
    throw new GenerationFailure(
      "AI_PROMPT_VERSION_UNSUPPORTED",
      false,
      !!recovery?.responseId,
    );
  let instructions: string;
  try {
    instructions = input.paidTarget
      ? paidInstructions(input, recovery?.promptVersion)
      : menhInstructions(recovery?.promptVersion);
  } catch {
    throw new GenerationFailure("AI_PROMPT_VERSION_UNSUPPORTED", false);
  }
  const config = {
    ...aiConfig(),
    model: input.paidTarget ? aiModels().paidReading : aiConfig().model,
    ...(input.paidTarget ? { background: true } : {}),
  };
  if (!config.apiKey || (!config.model && !recovery?.responseId))
    throw new GenerationFailure(
      "AI_NOT_CONFIGURED",
      !recovery?.responseId,
      !!recovery?.responseId,
    );
  const client = new OpenAI({
    apiKey: config.apiKey,
    timeout: config.timeoutMs,
    maxRetries: 0,
  });
  if (!recovery?.responseId) {
    try {
      await client.models.retrieve(config.model!);
    } catch {
      throw new GenerationFailure("AI_MODEL_UNAVAILABLE", true);
    }
  }
  const start = Date.now();
  let responseId = recovery?.responseId;
  try {
    if (config.background && !recovery)
      throw new GenerationFailure("AI_RECOVERY_REQUIRED", false);
    let response = responseId
      ? await client.responses.retrieve(
          responseId,
          input.paidTarget
            ? { timeout: Math.min(30000, config.timeoutMs) }
            : undefined,
        )
      : await client.responses.create(
          {
            model: config.model!,
            store: config.background,
            ...(config.background ? { background: true } : {}),
            instructions,
            input: input.paidTarget
              ? paidUserInput(input)
              : menhUserInput(input),
            max_output_tokens: config.maxOutputTokens,
            reasoning: { effort: config.reasoningEffort as "high" },
            text: {
              format: zodTextFormat(
                input.paidTarget
                  ? paidOutputSchema(recovery!.promptVersion!)
                  : narrationSchema,
                "menh_reading",
              ),
            },
          },
          { headers: { "X-Client-Request-Id": attemptId } },
        );
    if (!responseId && config.background) {
      responseId = response.id;
      // Do not poll until the ID is durable. If this write fails, the attempt is
      // ambiguous and must not be dispatched again.
      await recovery!.onResponseCreated(response.id, response.model);
    }
    if (
      input.paidTarget &&
      ["queued", "in_progress"].includes(response.status!)
    ) {
      throw new GenerationFailure("AI_BACKGROUND_PENDING", false, true, {
        ...(Number.isFinite(response.created_at)
          ? {
              providerCreatedAt: new Date(
                response.created_at * 1000,
              ).toISOString(),
            }
          : {}),
      });
    }
    while (response.status === "queued" || response.status === "in_progress") {
      const remaining = config.backgroundWaitMs - (Date.now() - start);
      if (!responseId || remaining <= 0)
        throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(2000, remaining)),
      );
      const timeout = config.backgroundWaitMs - (Date.now() - start);
      if (timeout <= 0)
        throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
      response = await client.responses.retrieve(responseId, {
        timeout: Math.min(config.timeoutMs, timeout),
      });
    }
    const { usage, estimatedCostUsd, cost } = responseCost(response);
    let raw: unknown = null;
    try {
      raw = JSON.parse(response.output_text);
    } catch {
      /* persisted as an invalid-schema attempt by the worker */
    }
    if (response.status !== "completed") raw = null;
    return {
      raw,
      cost,
      timing: {
        ...(Number.isFinite(response.created_at)
          ? {
              providerCreatedAt: new Date(
                response.created_at * 1000,
              ).toISOString(),
            }
          : {}),
        ...((response as any).completed_at
          ? {
              providerCompletedAt: new Date(
                (response as any).completed_at * 1000,
              ).toISOString(),
              providerElapsedMs: Math.max(
                0,
                ((response as any).completed_at - response.created_at) * 1000,
              ),
            }
          : {}),
        observationMs: Date.now() - start,
      },
      model: response.model,
      provider: "openai",
      responseId: response.id,
      usage,
      durationMs: Date.now() - start,
      estimatedCostUsd,
    };
  } catch (error) {
    if (error instanceof GenerationFailure) throw error;
    if (responseId) {
      // Retrieval never creates a new billed response. An expired/deleted ID
      // needs operator review, not a fresh CREATE or an endless GET loop.
      if (error instanceof OpenAI.APIError && error.status === 404)
        throw new GenerationFailure(
          "AI_RESPONSE_UNAVAILABLE",
          false,
          !!input.paidTarget,
        );
      throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
    }
    if (
      error instanceof OpenAI.APIError &&
      error.status &&
      error.status < 500 &&
      error.status !== 408
    ) {
      throw new GenerationFailure(
        error.status === 429 ? "AI_RATE_LIMITED" : "AI_REQUEST_REJECTED",
        error.status === 429 || error.status === 401 || error.status === 403,
      );
    }
    // Timeout/network/5xx may have reached the provider. Never automatically send
    // a second charged request; retain an uncertain state for operator review.
    throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
  }
};
