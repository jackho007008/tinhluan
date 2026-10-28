import { narrationSchema, SECTION_KINDS, type MenhInput } from "./contract";
/** Only a narrowly phrased prohibition about lifespan is a disclaimer. Do not
 * waive predictions, numbers, contrast clauses or other medical terms. */
function scopeText(text: string) {
  return text
    .split(/(?<=[.!?;])\s+|\n+/u)
    .map((sentence) => {
      const hits = sentence.match(/tuổi thọ/giu) || [];
      if (
        hits.length === 1 &&
        !/\d|nhưng|tuy nhiên|dù vậy|song\b|chẩn đoán|điều trị|tử vong|mắc bệnh/iu.test(
          sentence,
        ) &&
        /không\s+(?:(?:được|nên|thể)\s+)?(?:tự\s+)?(?:dự đoán|luận|suy đoán|đoán|mở thành)\b[^,;.!?\n]*tuổi thọ[.!?]?$/iu.test(
          sentence,
        )
      )
        return sentence.replace(/tuổi thọ/giu, "phạm vi bị loại trừ");
      return sentence;
    })
    .join("\n");
}
export function validateNarration(raw: unknown, input: MenhInput) {
  const parsed = narrationSchema.safeParse(raw);
  if (!parsed.success) throw Error("AI_INVALID_SCHEMA");
  const r = parsed.data;
  if (
    input.knowledgeVersion === "menh-retrieval-1.1.0" &&
    r.limitations.some((t) =>
      /\b(?:engine|packet|retrieval|catalog|schema)\b|gói\s+trả\s+phí|\{\{|\}\}/iu.test(
        t,
      ),
    )
  )
    throw Error("AI_SCOPE_VIOLATION");
  if (r.sections.map((s) => s.kind).join(",") !== SECTION_KINDS.join(","))
    throw Error("AI_SECTION_ORDER");
  const facts = new Set(input.facts.map((f) => f.id)),
    knowledge = new Set(input.knowledge.map((k) => k.id));
  for (const section of r.sections) {
    if (
      input.knowledgeVersion === "menh-retrieval-1.1.0" &&
      /\b(?:engine|packet|retrieval|catalog|schema)\b|gói\s+trả\s+phí|\{\{[^}]*\}\}/iu.test(
        section.title + " " + section.content,
      )
    )
      throw Error("AI_SCOPE_VIOLATION");
    if (
      section.basis === "source-interpretation" &&
      section.knowledgeIds.length === 0
    )
      throw Error("AI_UNKNOWN_REFERENCE");
    if (
      section.factIds.some((id) => !facts.has(id)) ||
      section.knowledgeIds.some((id) => !knowledge.has(id))
    )
      throw Error("AI_UNKNOWN_REFERENCE");
    if (
      /(?:trang|PDF|tr\.)\s*\d+|chẩn đoán|điều trị|tuổi thọ|tử vong|mắc bệnh|(?:sống|thọ)\s+(?:đến\s+)?\d+\s*tuổi|thu nhập (?:của|sẽ)|(?:vợ|chồng) (?:sẽ|của bạn)|chắc chắn (?:giàu|nghèo|thành công)/iu.test(
        scopeText(section.content),
      )
    )
      throw Error("AI_SCOPE_VIOLATION");
  }
  return r;
}
