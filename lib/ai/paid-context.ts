import type { Knowledge } from "./contract";
/** Editorial relevance only: these are retrieval priorities, never astrological scores. */
const RELATED_THEMES: Record<string, string[]> = {
  "Quan Lộc": ["finance", "action", "initiative", "learning", "spouse"],
  "Tài Bạch": ["work", "action", "initiative", "phuc", "learning"],
  "Phu Thê": ["phuc", "di", "work"],
  "Phúc Đức": ["spouse", "di", "finance"],
  "Thiên Di": ["action", "initiative", "phuc", "spouse", "learning"],
};
export type ContextMetadata = { themes: string[]; types: string[] };
export const contextBytes = (k: Knowledge) =>
  Buffer.byteLength(JSON.stringify(k), "utf8");
export function selectPaidContext(
  candidates: Knowledge[],
  target: string,
  metadata: Map<string, ContextMetadata>,
) {
  // Do not enlarge knowledge versus the previous C8, even when new passages are longer.
  const legacy = [...candidates]
    .sort(
      (a, b) =>
        Number(b.selection === "matched-v1-editorial") -
          Number(a.selection === "matched-v1-editorial") ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 8);
  const byteBudget = Math.min(
    24000,
    legacy.reduce((n, k) => n + contextBytes(k), 0),
  );
  const remaining = [...candidates],
    selected: Knowledge[] = [],
    seen = new Map<string, number>();
  const origins = (k: Knowledge) => [...new Set(k.subjectPalaces || [])];
  const uses = (k: Knowledge) =>
    Math.max(0, ...origins(k).map((p) => seen.get(p) || 0));
  const relevance = (k: Knowledge) => {
    const m = metadata.get(k.id),
      order = RELATED_THEMES[target] || [];
    const topic = Math.min(
      order.length,
      ...(m?.themes || []).map((t) => {
        const i = order.indexOf(t);
        return i < 0 ? order.length : i;
      }),
    );
    const kind = m?.types.every((t) => t === "method-gloss")
      ? 2
      : m?.types.some((t) => ["context", "combination"].includes(t))
        ? 0
        : 1;
    return [kind, topic];
  };
  let used = 0;
  while (selected.length < 8) {
    const fitting = remaining.filter(
      (k) => origins(k).length && used + contextBytes(k) <= byteBudget,
    );
    if (!fitting.length) break;
    fitting.sort(
      (a, b) =>
        uses(a) - uses(b) ||
        relevance(a)[0] - relevance(b)[0] ||
        relevance(a)[1] - relevance(b)[1] ||
        a.id.localeCompare(b.id),
    );
    const k = fitting[0];
    selected.push(k);
    used += contextBytes(k);
    remaining.splice(remaining.indexOf(k), 1);
    for (const p of origins(k)) seen.set(p, (seen.get(p) || 0) + 1);
  }
  return {
    items: selected,
    byteBudget,
    usedBytes: used,
    decisions: candidates.map((k) => ({
      id: k.id,
      origins: origins(k),
      relevance: relevance(k),
      reason: selected.includes(k)
        ? "selected-relevant-origin-diversity"
        : used + contextBytes(k) > byteBudget
          ? "context-byte-budget"
          : "context-rank-and-item-cap",
    })),
  };
}
