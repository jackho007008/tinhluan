import type { AiFact, Knowledge, MenhInput } from "./contract";

/** Structural check over condition-matched, saved library input. It does not
 * prove a sentence follows its source, or discover new astrological rules.
 * Only the new writer may use this extension; old attempts keep their guard. */
export function groundedFoundationScope(
  source: Knowledge,
  input: MenhInput,
  citedFactIds: string[],
  text: string,
) {
  const target = input.paidTarget?.palace;
  const passage = source.passage;
  if (
    !target ||
    source.group !== "B" ||
    source.application !== "reference-only" ||
    source.subjectPalaces?.length !== 1 ||
    source.subjectPalaces[0] !== target ||
    passage?.version !== "paid-library-1.0.0" ||
    passage.kind !== "foundation" ||
    !/^[a-f0-9]{64}$/.test(passage.digest) ||
    !passage.anchorFactIds.length ||
    !source.conditions.length ||
    !source.references.length
  )
    return false;
  const anchors = passage.anchorFactIds.map((id) =>
    input.facts.find((f) => f.id === id && citedFactIds.includes(id)),
  );
  if (anchors.some((f) => !f)) return false;
  const traced = anchors.filter(
    (f): f is AiFact =>
      f?.kind === "engine" &&
      f.provenance?.scope === "natal" &&
      f.provenance.verification === "source-traced" &&
      ["target", "trine", "opposition"].includes(f.provenance.relation),
  );
  if (
    !traced.some(
      (f) =>
        f.provenance!.palace === target && f.provenance!.relation === "target",
    )
  )
    return false;
  for (const f of anchors as AiFact[]) {
    if (traced.includes(f)) {
      const { palace, relation } = f.provenance!;
      if (palace === target) {
        if (relation !== "target") return false;
        continue;
      }
      if (!["trine", "opposition"].includes(relation)) return false;
      const id =
        relation === "trine" ? "geometry.tam-hop" : "geometry.xung-chieu";
      const label = relation === "trine" ? "tam-hop" : "xung-chieu";
      const geometry = input.facts.find((g) => g.id === id);
      const position = /^(.+? tại [^:;]+)[:;]/u.exec(f.text)?.[1];
      if (
        !citedFactIds.includes(id) ||
        geometry?.kind !== "geometry" ||
        !geometry.paths.includes("chart.palaces") ||
        !geometry.text.startsWith(`${label} của ${target}: `) ||
        !position ||
        !geometry.text.includes(position) ||
        !text
          .normalize("NFC")
          .toLocaleLowerCase("vi")
          .includes(palace.normalize("NFC").toLocaleLowerCase("vi"))
      )
        return false;
      continue;
    }
    // Location facts have no star-placement provenance. Admit a location only
    // when a traced anchor from that same stored palace independently binds it.
    const m = /^palace\.(\d+)\.location$/.exec(f.id);
    const position = /^(.+? tại [^:;]+)[:;]/u.exec(f.text)?.[1];
    if (
      !m ||
      !position ||
      f.kind !== "engine" ||
      f.provenance ||
      !f.paths.includes(`chart.palaces.${m[1]}`) ||
      !traced.some(
        (star) =>
          star.id.startsWith(`palace.${m[1]}.`) &&
          star.paths.some((p) => p.startsWith(`chart.palaces.${m[1]}.`)) &&
          position === /^(.+? tại [^:;]+)[:;]/u.exec(star.text)?.[1] &&
          f.text.startsWith(`${star.provenance!.palace} tại `),
      )
    )
      return false;
  }
  return true;
}
