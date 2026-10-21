import type { Condition } from "./schema";
/** Source review 2026-10-10: book/PDF 158–167, 190–197.
 * These are source glosses ONLY. Aggregate exceptions are not computable yet;
 * no conclusion about the individual is licensed by a local pattern match.
 */
export const natalSourceContent: {
  id: string;
  theme: "work" | "finance";
  title: string;
  conditions: Condition[];
  text: string;
  pages: string;
  limit: string;
}[] = [
  {
    id: "r40",
    theme: "work",
    title: "Tử Vi độc thủ Quan Lộc tại Ngọ",
    conditions: [
      { fact: "fact.career-stars", op: "includes", value: "Tử Vi" },
      { fact: "fact.career-major-count", op: "eq", value: "1" },
      { fact: "fact.career-branch-groups", op: "includes", value: "Ngọ" },
    ],
    text: "Trong mục Quan Lộc, Tân Biên xếp Tử Vi độc thủ tại Ngọ vào nhánh thuận lợi về công danh. Đây là chú giải của riêng nhánh trong sách, chưa phải kết luận rằng người đọc có chức vị hoặc thành công nghề nghiệp.",
    pages: "158 §8.1; điều chỉnh sát tinh 163–164 §8.14; toàn mục 158–167",
    limit:
      "Ảnh hưởng của sát tinh và hội hợp chưa được tổng hợp; chưa thể kết luận về công danh.",
  },
  {
    id: "r41",
    theme: "work",
    title: "Tử Vi độc thủ Quan Lộc tại Tý",
    conditions: [
      { fact: "fact.career-stars", op: "includes", value: "Tử Vi" },
      { fact: "fact.career-major-count", op: "eq", value: "1" },
      { fact: "fact.career-branch-groups", op: "includes", value: "Tý" },
    ],
    text: "Tân Biên mô tả nhánh Tử Vi độc thủ Quan Lộc tại Tý là bình thường, khác với nhánh tại Ngọ. Cách phân loại trong sách không phải đánh giá năng lực hoặc mức thành đạt của người đọc.",
    pages: "158 §8.1; điều chỉnh sát tinh 163–164 §8.14; toàn mục 158–167",
    limit:
      "Chưa tổng hợp điều chỉnh sát tinh và hội hợp; không lấy chữ bình thường để suy công việc kém thuận lợi.",
  },
  ...(
    [
      ["r42", "Thiên Phủ", "192 §12.7"],
      ["r43", "Thiên Tướng", "193 §12.11"],
    ] as const
  ).map(([id, companion, parallel]) => ({
    id,
    theme: "finance" as const,
    title: `Liêm Trinh–${companion} tại Tài Bạch`,
    conditions: [
      {
        fact: "fact.wealth-stars",
        op: "includes" as const,
        value: "Liêm Trinh",
      },
      { fact: "fact.wealth-stars", op: "includes" as const, value: companion },
    ],
    text: `Ở mục Tài Bạch, Tân Biên gắn nhánh Liêm Trinh–${companion} đồng cung với sự tích lũy và giữ của bền vững. Đây là chú giải về tổ hợp được sách nêu trực tiếp, không phải ghép nghĩa hai sao riêng; chưa thể dùng nó để xác nhận tài sản hay khả năng giữ tiền của người đọc.`,
    pages: `190 mở đầu và §12.2; đối chiếu ${parallel}; điều chỉnh 194–197`,
    limit:
      "Sách yêu cầu xét Mệnh, Thân, Phúc Đức, Quan Lộc và Thiên Di trước khi luận tài. Chưa tổng hợp các cung này, Tuần/Triệt và các sao đi cùng nên chưa thể kết luận về khả năng tích lũy của người đọc.",
  })),
];
