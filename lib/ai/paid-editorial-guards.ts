import type { MenhInput } from "./contract";
import type { PaidReadingV2 } from "./paid-reading-v2";
const normalize = (text: string) =>
  text.normalize("NFC").toLocaleLowerCase("vi");
// A narrow warning sign, not semantic entailment or a generic prose classifier.
const linkMarker =
  /(?:đọc|đặt)(?:\s+[^.!?;\n]{1,65})?\s+cạnh|phép nối|tổng hợp (?:hai|các)|liên hệ (?:thêm|sang)|nếu đối chiếu/u;
const assistance = /trợ giúp|hỗ trợ|giúp đỡ/u;
const phase =
  /(?:trong|qua|ở|vào)\s+(?:một|từng|những)\s+(?:giai đoạn|thời kỳ|chặng)|(?:đã|từng)\s+(?:(?:có|nhận|được|sự)\s+){0,3}(?:trợ giúp|hỗ trợ|giúp đỡ)/u;
const timedSourceId = "paid-library.thp2-phu-ta-huu";
/** Only prompt 2.4+: never repair stored prose or relabel a model's basis silently.
 * Other semantic mixing/qualifier loss still needs a full-text editorial review. */
export function validatePaidEditorial(
  content: PaidReadingV2,
  input: MenhInput,
) {
  const paragraphs = content.sections.flatMap((s) => s.paragraphs);
  for (const p of paragraphs) {
    if (p.basis !== "source-interpretation") continue;
    const knowledge = p.knowledgeIds.map(
      (id) => input.knowledge.find((k) => k.id === id)!,
    );
    if (
      linkMarker.test(normalize(p.text)) &&
      !knowledge.some((k) => linkMarker.test(normalize(k.text)))
    )
      throw Error("AI_MIXED_ATTRIBUTION");
  }
  const timed = input.knowledge.find(
    (k) => k.id === timedSourceId && /một giai đoạn/u.test(normalize(k.text)),
  );
  if (!timed) return;
  const used = paragraphs.filter(
    (p) =>
      p.knowledgeIds.includes(timed.id) && assistance.test(normalize(p.text)),
  );
  if (
    used.some(
      (p) =>
        p.basis === "source-interpretation" && !phase.test(normalize(p.text)),
    ) ||
    (used.length > 0 && !used.some((p) => phase.test(normalize(p.text))))
  )
    throw Error("AI_SOURCE_QUALIFIER_LOST");
}
