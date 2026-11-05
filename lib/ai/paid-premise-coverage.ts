import type { AiFact, Knowledge, MenhInput } from "./contract";
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

// Frozen editorial packets identify the matched R05 rule but do not carry
// anchorFactIds for it. Its two premises are co-located career major stars.
function careerPairAnchors(sources: Knowledge[], facts: AiFact[]): string[] {
  if (
    !sources.some(
      (k) =>
        k.group === "C" &&
        k.application === "context" &&
        k.selection === "matched-v1-editorial" &&
        k.subjectPalaces?.length === 1 &&
        k.subjectPalaces[0] === "Quan Lộc" &&
        k.provenance?.ruleIds.length === 1 &&
        k.provenance.ruleIds[0] === "tanbien.r05",
    )
  )
    return [];
  const pair = ["Tử Vi", "Thiên Tướng"].map((name) =>
    facts.find(
      (f) =>
        f.provenance?.palace === "Quan Lộc" &&
        f.provenance.field === "majorStars" &&
        f.provenance.scope === "natal" &&
        f.provenance.verification === "source-traced" &&
        /^palace\.\d+\.majorStars\.\d+$/u.test(f.id) &&
        f.text.startsWith("Quan Lộc tại ") &&
        f.text.split(": ")[1]?.split(";")[0] === name,
    ),
  );
  const [tu, tuong] = pair;
  if (!tu || !tuong || tu.id.split(".")[1] !== tuong.id.split(".")[1])
    return [];
  return [tu.id, tuong.id];
}

// In this cited foundation “Đại Hao–Tiểu Hao” names the book entry.
// Mask only the second name within an explicit, delimited group label.
// Other occurrences and every explicit fact reference are still checked.
function premiseText(text: string, sources: Knowledge[]) {
  if (
    !sources.some(
      (k) =>
        k.id === "paid-library.tb41-tai-hao-scope" &&
        k.group === "B" &&
        k.application === "reference-only" &&
        k.passage?.kind === "foundation" &&
        k.passage.digest ===
          "13ef0725399f252a80c67b93e96c5b6bbe0f75c2e6e4c4564c9ea59707e48b36",
    )
  )
    return text;
  return text
    .normalize("NFC")
    .replace(
      /trong nghĩa chung của nhóm Đại Hao\s*[–—-]\s*Tiểu Hao(?=\s*[,;)])/giu,
      "trong nghĩa chung của nhóm Đại Hao",
    );
}

function mentionsStar(text: string, name: string) {
  // “Tử Vi” names a major star. The first syllable does not also cite the
  // Trường Sinh stage Tử. Likewise “để suy ra” is a verb, not the stage Suy.
  if (name === "Tử")
    return contains(
      normalize(text).replace(
        /(?<![\p{L}\p{N}])tử\s+vi(?![\p{L}\p{N}])/gu,
        " ",
      ),
      name,
    );
  if (name === "Suy") return contains(text.replace(/để suy ra/gu, " "), name);
  return contains(text, name);
}

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
      for (const anchor of careerPairAnchors(sources, citedStars))
        supported.add(anchor);
      const text = premiseText(p.text, sources);
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
            ].some((t) => contains(text, t))
          : mentionsStar(text, name);
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
