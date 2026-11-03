import { z } from "zod";
import type { AiResult, MenhInput, Narration } from "./contract";
import { violatesPaidMedicalScope } from "./paid-safety";
import { groundedFoundationScope } from "./paid-foundation-scope";

export const PAID_SCHEMA_V2 = "paid-reading-v2.0.0";
export const PAID_PROMPT_V2 = "paid-palaces-vietnamese-2.0.0";
const paragraph = z
  .object({
    text: z.string().min(1).max(6500),
    basis: z.enum(["facts", "source-interpretation", "ai-synthesis"]),
    factIds: z.array(z.string()).min(1).max(20),
    knowledgeIds: z.array(z.string()).max(12),
  })
  .strict();
/** Provider schema has no refinements; cross-field rules run locally too. */
export const paidReadingV2Schema = z
  .object({
    schemaVersion: z.literal(PAID_SCHEMA_V2),
    coverage: z.enum(["focused", "limited", "insufficient"]),
    coverageNote: z.string().min(1).max(1000),
    sections: z
      .array(
        z
          .object({
            id: z
              .string()
              .min(1)
              .max(80)
              .regex(/^[a-zA-Z0-9_-]+$/),
            role: z.enum([
              "overview",
              "analysis",
              "context",
              "adjustment",
              "synthesis",
            ]),
            title: z.string().min(1).max(140),
            paragraphs: z.array(paragraph).min(1).max(6),
          })
          .strict(),
      )
      .max(8),
    limitations: z.array(z.string().min(1).max(500)).min(1).max(8),
  })
  .strict();
export type PaidReadingV2 = z.infer<typeof paidReadingV2Schema>;
export type PaidContent = Narration | PaidReadingV2;
export type PaidResult = AiResult<PaidContent>;

export function paidV2Shape(raw: unknown): PaidReadingV2 {
  const parsed = paidReadingV2Schema.safeParse(raw);
  if (!parsed.success) throw Error("AI_INVALID_SCHEMA");
  const r = parsed.data;
  if (
    (r.coverage === "focused" && r.sections.length < 2) ||
    (r.coverage === "limited" && r.sections.length < 1) ||
    (r.coverage === "insufficient" && r.sections.length !== 0)
  )
    throw Error("AI_COVERAGE_MISMATCH");
  if (new Set(r.sections.map((s) => s.id)).size !== r.sections.length)
    throw Error("AI_DUPLICATE_SECTION_ID");
  const text = [
    r.coverageNote,
    ...r.limitations,
    ...r.sections.flatMap((s) => [
      s.id,
      s.title,
      ...s.paragraphs.map((p) => p.text),
    ]),
  ];
  if (text.some((t) => !t.trim()) || text.join(" ").length > 52000)
    throw Error("AI_INVALID_SCHEMA");
  if (violatesPaidMedicalScope(text)) throw Error("AI_SCOPE_VIOLATION");
  for (const field of text) {
    if (
      /\b(engine|packet|retrieval|catalog|schema)\b|gói\s+trả\s+phí|\{\{|\}\}|(?:PDF|trang|tr\.)\s*\d+|chắc chắn\s+(giàu|nghèo|thành công)/iu.test(
        field,
      ) ||
      violatesPaidMedicalScope(field)
    )
      throw Error("AI_SCOPE_VIOLATION");
  }
  return r;
}

/** Checks structural provenance, not a proof that every sentence follows a source. */
export function validatePaidV2(
  raw: unknown,
  input: MenhInput,
  allowLibraryFoundation = false,
  allowCrossPalaceFoundation = false,
) {
  const r = paidV2Shape(raw);
  for (const s of r.sections)
    for (const p of s.paragraphs) {
      const facts = p.factIds.map((id) => input.facts.find((f) => f.id === id));
      const knowledge = p.knowledgeIds.map((id) =>
        input.knowledge.find((k) => k.id === id),
      );
      if (facts.some((f) => !f) || knowledge.some((k) => !k))
        throw Error("AI_UNKNOWN_REFERENCE");
      if (p.basis === "facts" && knowledge.length)
        throw Error("AI_REFERENCE_SCOPE");
      if (p.basis !== "facts") {
        if (
          allowLibraryFoundation &&
          knowledge.some(
            (k) =>
              k?.passage &&
              (!k.passage.anchorFactIds.length ||
                k.passage.anchorFactIds.some((id) => !p.factIds.includes(id))),
          )
        )
          throw Error("AI_REFERENCE_SCOPE");
        const backgrounds = knowledge.filter(
          (k) => k?.group === "B" && k.application === "reference-only",
        );
        const direct = knowledge.some(
          (k) =>
            ["A", "B"].includes(k?.group || "") && k?.application === "direct",
        );
        const grounded =
          backgrounds.length > 0 &&
          backgrounds.every(
            (k) =>
              (allowCrossPalaceFoundation &&
                groundedFoundationScope(k!, input, p.factIds, p.text)) ||
              (k!.passage?.version === "paid-library-1.0.0" &&
                k!.passage.kind === "foundation" &&
                /^[a-f0-9]{64}$/.test(k!.passage.digest) &&
                k!.passage.anchorFactIds.length > 0 &&
                k!.passage.anchorFactIds.every(
                  (id) =>
                    p.factIds.includes(id) &&
                    input.facts.some(
                      (f) =>
                        f.id === id &&
                        f.provenance?.verification === "source-traced" &&
                        f.provenance.palace === input.paidTarget?.palace &&
                        f.provenance.relation === "target",
                    ),
                )),
          );
        if (
          backgrounds.length &&
          !direct &&
          !(allowLibraryFoundation && p.basis === "ai-synthesis" && grounded)
        )
          throw Error("AI_REFERENCE_SCOPE");
        if (
          !knowledge.length ||
          knowledge.some(
            (k) => !["A", "B", "C", "D"].includes(k!.group || ""),
          ) ||
          knowledge.every((k) => k!.group === "D")
        )
          throw Error("AI_REFERENCE_SCOPE");
        if (
          facts.some((f) =>
            [
              "source-conflict",
              "upstream-unverified",
              "engine-reported",
            ].includes(f!.provenance?.verification || ""),
          )
        )
          throw Error("AI_UNVERIFIED_INTERPRETATION");
      }
      if (p.basis === "source-interpretation") {
        if (
          knowledge.some(
            (k) => k!.group === "D" || k!.application === "reference-only",
          )
        )
          throw Error("AI_REFERENCE_SCOPE");
        for (const k of knowledge.filter((k) => k!.group === "C")) {
          if (
            s.role !== "context" ||
            !k!.subjectPalaces?.length ||
            !k!.subjectPalaces.every((palace) => p.text.includes(palace))
          )
            throw Error("AI_CONTEXT_AS_DIRECT");
        }
      }
      if (
        p.basis === "ai-synthesis" &&
        knowledge.some((k) => k!.group === "C") &&
        !knowledge.some((k) => k!.group === "A" || k!.group === "B") &&
        !["context", "adjustment", "synthesis"].includes(s.role)
      )
        throw Error("AI_CONTEXT_AS_DIRECT");
    }
  const used = r.sections
    .flatMap((s) => s.paragraphs)
    .filter((p) => p.basis !== "facts");
  if (r.coverage !== "insufficient" && !used.length)
    throw Error("AI_COVERAGE_UNSUPPORTED");
  if (
    r.coverage === "focused" &&
    !used.some((p) =>
      p.knowledgeIds.some((id) =>
        input.knowledge.some(
          (k) =>
            k.id === id &&
            ["A", "B"].includes(k.group || "") &&
            k.application === "direct",
        ),
      ),
    )
  )
    throw Error("AI_COVERAGE_UNSUPPORTED");
  return r;
}
