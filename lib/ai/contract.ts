import { z } from "zod";
export const AI_EDITION = "menh-ai-1.0.0";
export const PROMPT_VERSION = "menh-vietnamese-1.1.0";
export const FACTS_VERSION = "menh-facts-1.0.0";
export const KNOWLEDGE_VERSION = "menh-retrieval-1.1.0";
export const SECTION_KINDS = [
  "overview",
  "traits",
  "strengths",
  "major_combination",
  "supporting_stars",
  "trine_opposition",
  "tensions",
  "reflection",
] as const;
const section = z
  .object({
    kind: z.enum(SECTION_KINDS),
    title: z.string().min(1).max(140),
    content: z.string().min(30).max(6500),
    factIds: z.array(z.string()).min(1).max(20),
    knowledgeIds: z.array(z.string()).max(12),
    basis: z.enum(["facts", "source-interpretation", "ai-synthesis"]),
  })
  .strict();
export const narrationSchema = z
  .object({
    sections: z.array(section).length(8),
    limitations: z.array(z.string().min(1).max(500)).min(1).max(8),
  })
  .strict();
export type Narration = z.infer<typeof narrationSchema>;
export type AiFact = {
  id: string;
  text: string;
  kind: "engine" | "geometry";
  paths: string[];
  provenance?: {
    palace: string;
    relation: string;
    field: string;
    scope: "natal";
    verification:
      | "source-traced"
      | "source-conflict"
      | "upstream-unverified"
      | "engine-reported";
    source: string;
  };
};
export type Knowledge = {
  group?: "A" | "B" | "C" | "D";
  application?: "direct" | "context" | "reference-only";
  subjectPalaces?: string[];
  predicate?: { conditions: unknown[]; exceptions: unknown[] };
  id: string;
  title: string;
  text: string;
  conditions: string[];
  limits: string[];
  references: { title: string; location: string }[];
  selection:
    | "reference-only"
    | "matched-saved-context"
    | "matched-v1-editorial"
    | "matched-snapshot"
    | "background-method";
  provenance?: {
    ruleIds: string[];
    ruleStatuses: string[];
    sourceVersion: string;
    certification: "editorial-reference-not-expert-approved";
  };
};
export type MenhInput = {
  paidTarget?: { palace: string; edition: string };
  version: typeof FACTS_VERSION | "paid-facts-1.1.0";
  knowledgeVersion:
    | typeof KNOWLEDGE_VERSION
    | "menh-retrieval-1.0.0"
    | "paid-retrieval-1.1.0"
    | "paid-retrieval-1.1.1"
    | "paid-retrieval-1.2.0"
    | "paid-retrieval-1.3.0";
  facts: AiFact[];
  knowledge: Knowledge[];
  missing: string[];
  editorial?: {
    version: string | null;
    status: "available" | "absent" | "mismatch";
    totalGroups: number;
    acceptedGroups: number;
    excludedGroups: number;
    note: string;
  };
};
export type AiResult<T = Narration> = {
  content: T;
  facts: AiFact[];
  knowledge: Knowledge[];
  promptVersion: string;
  edition: string;
  model: string;
  provider: "openai" | "test-mock";
  durationMs: number;
  usage: {
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    cacheWriteTokens?: number;
    cacheBreakdownComplete?: boolean;
    _background?: import("./background").BackgroundState;
  };
  cost?: ReturnType<typeof import("./cost").responseCost>["cost"];
  timing?: {
    providerCreatedAt?: string;
    providerCompletedAt?: string;
    providerElapsedMs?: number;
    queueWaitMs?: number;
    observationMs?: number;
    accumulatedObservationMs?: number;
    dispatchToPersistMs?: number;
  };
  estimatedCostUsd: number | null;
};
export type AiView = {
  enabled: boolean;
  eligible: boolean;
  state: "not-created" | "generating" | "completed" | "error";
  queued: boolean;
  queueDelayed?: boolean;
  canRetry: boolean;
  errorCode?: string;
  result?: AiResult;
};
