import type { AiFact, MenhInput } from "./contract";
import type { PaidReadingV2 } from "./paid-reading-v2";

const starFact = (f: AiFact) =>
  f.kind === "engine" &&
  (/^natal\./u.test(f.id) ||
    /^palace\.\d+\.(?:(?:majorStars|minorStars|adjectiveStars)\.\d+|ring\.)/u.test(
      f.id,
    ));
const normalize = (s: string) => s.normalize("NFC").toLocaleLowerCase("vi");
const words = (s: string) =>
  normalize(s)
    .match(/[\p{L}\p{N}]+/gu)
    ?.join(" ") || "";
const contains = (text: string, term: string) =>
  ` ${words(text)} `.includes(` ${words(term)} `);

/** A bounded structural guard, NOT semantic entailment. In a synthesis that
 * uses library foundations, every star premise must have a cited source anchor.
 * Geometry/location describe the frame, not a new interpretive star premise.
 * Also inspect explicit star names to catch deleting only their factIds. Do not
 * infer a source anchor from keywords in its text, or borrow it from another
 * paragraph. Old attempts never run this guard. */
export function validatePaidPremiseCoverage(
  content: PaidReadingV2,
  input: MenhInput,
) {
  for (const s of content.sections)
    for (const p of s.paragraphs) {
      if (p.basis !== "ai-synthesis") continue;
      const sources = input.knowledge.filter((k) =>
        p.knowledgeIds.includes(k.id),
      );
      if (
        !sources.some(
          (k) => k.group === "B" && k.passage?.kind === "foundation",
        )
      )
        continue;
      const supported = new Set(
        sources
          .filter((k) => k.group !== "D" && k.passage?.kind !== "method")
          .flatMap((k) => [
            ...(k.anchorFactIds || []),
            ...(k.passage?.anchorFactIds || []),
          ]),
      );
      const citedStars = input.facts.filter(
        (f) => starFact(f) && p.factIds.includes(f.id),
      );
      if (citedStars.some((f) => !supported.has(f.id)))
        throw Error("AI_PREMISE_SOURCE_MISSING");

      for (const f of input.facts.filter(starFact)) {
        const transformation = /^natal\.(.+)$/u.exec(f.id)?.[1];
        const name = transformation || /: ([^;]+);/u.exec(f.text)?.[1];
        if (!name) continue;
        // Short Tứ Hóa names are recognized only in explicit star/location phrases;
        // ordinary words such as “tài lộc” or the palace “Quan Lộc” are not stars.
        const mentioned = transformation
          ? [
              "Hóa " + name,
              name + " ở",
              name + " tại",
              "với " + name,
              "nền " + name,
            ].some((t) => contains(p.text, t))
          : contains(p.text, name);
        if (!mentioned) continue;
        const same = citedStars.filter((c) =>
          transformation
            ? c.id === f.id
            : !c.id.startsWith("natal.") &&
              /: ([^;]+);/u.exec(c.text)?.[1] === name,
        );
        // Same-named stars in different palaces must still use the exact cited
        // instance. The factIds check above rejects citing an unsupported instance.
        if (!same.some((c) => supported.has(c.id)))
          throw Error("AI_PREMISE_SOURCE_MISSING");
      }
    }
}
