/** Exact complete limitations, not general negation detection or clinical approval. */
const SAFE_LIMITATIONS = new Set([
  "không chẩn đoán",
  "không chẩn đoán bệnh",
  "bài viết này không chẩn đoán bệnh",
  "không điều trị",
  "không hướng dẫn điều trị",
  "bài viết này không điều trị",
  "không chẩn đoán, không điều trị",
  "không chẩn đoán bệnh, không điều trị",
  "không dự báo tuổi thọ hoặc tử vong",
  "nội dung này không thay thế chẩn đoán hoặc điều trị y khoa",
]);
export function violatesPaidMedicalScope(text: string | string[]) {
  const remaining = (Array.isArray(text) ? text : [text])
    .map((field) =>
      field
        .normalize("NFC")
        .split(/[.!?;\n]+/u)
        .map((clause) => clause.trim().replace(/\s+/gu, " "))
        .filter(
          (clause) =>
            !SAFE_LIMITATIONS.has(
              clause.trim().replace(/\s+/gu, " ").toLowerCase(),
            ),
        )
        .join(". "),
    )
    .join(" ");
  return /chẩn đoán|điều trị|tuổi thọ|tử vong|mắc bệnh|phác đồ|kê đơn|uống thuốc|dùng thuốc|(?:sẽ|đang|bị|mắc)\s+(?:bệnh|ung thư)/iu.test(
    remaining,
  );
}
