import type { InternalReading } from "../internal-review/reading-store";
import type { Knowledge } from "./contract";
import { paidFacts, paidRelations } from "./paid-facts";
import { paidBookKnowledge } from "./paid-book-knowledge";
import { paidLibrary } from "./paid-library";

// A bounded editorial choice of missing origins, not a rule about a person's life.
const ORIGINS: Record<string, string[]> = {
  "Phụ Mẫu": ["Tử Nữ"],
  "Huynh Đệ": ["Nô Bộc"],
};
export const BOOK_CONTEXT_MAX_BYTES = 14000;
export function paidBookContexts(record: InternalReading, target: string) {
  const items: Knowledge[] = [],
    excluded: { id: string; reason: string }[] = [];
  if (!ORIGINS[target]) return { items, excluded };
  const relations = paidRelations(record, target);
  let bytes = 0;
  for (const origin of ORIGINS[target]) {
    if (!["trine", "opposition"].includes(relations.get(origin) || ""))
      continue;
    const facts = paidFacts(record, origin),
      library = paidLibrary(facts, origin);
    const replaced = new Set(library.replacements.map((r) => r.oldId));
    const candidates = [
      ...paidBookKnowledge(record, origin).filter((k) => !replaced.has(k.id)),
      ...library.items,
    ];
    for (const source of candidates) {
      // Background/method and unfulfilled source conditions never become C claims.
      if (
        source.application !== "direct" ||
        !["A", "B"].includes(source.group || "")
      )
        continue;
      const slug = origin
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .replace(/đ/g, "d")
        .replaceAll(" ", "-");
      const k: Knowledge = {
        ...structuredClone(source),
        id: `paid-context.${slug}.${source.id}`,
        group: "C",
        application: "context",
        subjectPalaces: [origin],
        contextOrigin: {
          palace: origin,
          knowledgeId: source.id,
          application: "direct",
        },
      };
      const size = Buffer.byteLength(JSON.stringify(k));
      if (items.length >= 4 || bytes + size > BOOK_CONTEXT_MAX_BYTES) {
        excluded.push({ id: k.id, reason: "book-context-budget" });
        continue;
      }
      if (!items.some((x) => x.id === k.id)) {
        items.push(k);
        bytes += size;
      }
    }
    for (const e of library.excluded)
      excluded.push(
        e.id === "paid-library"
          ? e
          : { id: `paid-context.${origin}.${e.id}`, reason: e.reason },
      );
  }
  return { items, excluded };
}
