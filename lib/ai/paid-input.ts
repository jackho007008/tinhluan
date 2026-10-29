import type { InternalReading } from "../internal-review/reading-store";
import { menhFacts } from "./facts";
import { PAID_EDITION, PAID_PALACES } from "./paid-contract";
import type { Knowledge } from "./contract";
export function paidInput(record: InternalReading, palace: string) {
  if (!PAID_PALACES.includes(palace as any))
    throw Error("AI_PAID_TARGET_INVALID");
  const input = menhFacts(record, palace);
  input.paidTarget = { palace, edition: PAID_EDITION };
  if (record.frozen.customerReport?.snapshotId !== record.snapshot.resultId)
    throw Error("AI_UNVERIFIED_SNAPSHOT");
  const seen = new Set<string>(),
    knowledge: Knowledge[] = [];
  for (const s of record.frozen.customerReport?.sections || [])
    for (const p of s.paragraphs) {
      if (
        !s.palaces.includes(palace) ||
        seen.has(p.id) ||
        /\{\{|\}\}/.test(p.text)
      )
        continue;
      const rules = p.members?.flatMap((m) => m.claim.rules) || [];
      if (!rules.length) continue;
      seen.add(p.id);
      knowledge.push({
        id: "paid-v1." + p.id,
        title: p.title || s.title,
        text: p.text,
        conditions: rules.flatMap(
          (r) => r.presentation?.sourceConditions || [],
        ),
        limits: rules.flatMap((r) => [
          ...r.limitations,
          ...(r.presentation?.knownExceptions || []),
          ...(r.presentation?.unknownConditions || []),
        ]),
        references: rules.flatMap((r) =>
          r.sourceReferences.map((x) => ({
            title: x.title,
            location: x.location,
          })),
        ),
        selection: "matched-saved-context",
        provenance: {
          ruleIds: rules.map((r) => r.id),
          ruleStatuses: rules.map((r) => r.status),
          sourceVersion: record.frozen.customerReport!.version,
          certification: "editorial-reference-not-expert-approved",
        },
      });
      if (knowledge.length >= 12) break;
    }
  input.knowledge = knowledge.slice(0, 12);
  if (!knowledge.length)
    input.missing.push(
      "Chưa có lời V1 phù hợp chủ đề cung này; chỉ dùng dữ kiện và giữ giới hạn.",
    );
  return input;
}
