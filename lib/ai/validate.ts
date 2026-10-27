import { narrationSchema, SECTION_KINDS, type MenhInput } from "./contract";
export function validateNarration(raw: unknown, input: MenhInput) {
  const parsed = narrationSchema.safeParse(raw);
  if (!parsed.success) throw Error("AI_INVALID_SCHEMA");
  const r = parsed.data;
  if (r.sections.map((s) => s.kind).join(",") !== SECTION_KINDS.join(","))
    throw Error("AI_SECTION_ORDER");
  const facts = new Set(input.facts.map((f) => f.id)),
    knowledge = new Set(input.knowledge.map((k) => k.id));
  for (const section of r.sections) {
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
      /(?:trang|PDF|tr\.)\s*\d+|chẩn đoán|điều trị|tuổi thọ|tử vong|mắc bệnh|thu nhập (?:của|sẽ)|(?:vợ|chồng) (?:sẽ|của bạn)|chắc chắn (?:giàu|nghèo|thành công)/iu.test(
        section.content,
      )
    )
      throw Error("AI_SCOPE_VIOLATION");
  }
  return r;
}
