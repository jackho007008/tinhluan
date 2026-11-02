import type { MenhInput } from "./contract";
import type { PaidReadingV2 } from "./paid-reading-v2";
/** Only the versioned new writer enforces the additional source metadata.
 * Stored older jobs keep their validator and text unchanged. */
export function validatePaidSourceAnchors(
  content: PaidReadingV2,
  input: MenhInput,
) {
  for (const section of content.sections)
    for (const p of section.paragraphs) {
      if (p.basis === "facts") continue;
      for (const id of p.knowledgeIds) {
        const k = input.knowledge.find((k) => k.id === id);
        if (
          k?.anchorFactIds &&
          (!k.anchorFactIds.length ||
            k.anchorFactIds.some(
              (anchor) =>
                !p.factIds.includes(anchor) ||
                !input.facts.some((f) => f.id === anchor),
            ))
        )
          throw Error("AI_REFERENCE_SCOPE");
      }
    }
}
