import { ruleSchema } from "./schema";
const shared = {
  version: "0.1.0",
  kind: "interpretation",
  topic: "overview",
  origin: "catalog",
  requiredEngineProfile: ["tanbien-vn-trial-v2"],
  requiredFacts: [
    "fact.career-origin-ky",
    "fact.career-ky-sun-moon-exception",
    "fact.career-source-available",
  ],
  evidencePaths: ["chart.palaces"],
  sourceReferences: [
    {
      id: "tanbien-supplied-pdf",
      title: "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên",
      url: "/internal/editorial/demo-wuqu-tianfu#source-list",
      location:
        "PDF/trang ebook164 §8.19 Hóa Kỵ; ngữ cảnh163–165; định nghĩa đồng cung PDF33§2.8. Đối chiếu Thiên Lương PDF31–32: khác phạm vi, không thay nhánh Quan.",
      accessedOn: "2026-10-12",
      rights: "pending",
      rightsNote:
        "Đọc trực tiếp đoạn và ảnh. Xác minh nguồn, không phê duyệt chuyên môn.",
    },
  ],
  conflictsWith: [],
  conflictGroup: null,
  conflictPolicy: "retain-both",
  status: "draft",
  review: null,
  limitations: [
    "Chỉ nhánh cục bộ Hóa Kỵ ở Quan Lộc với ngoại lệ đã ghi trong §8.19; không phải tổng hợp toàn cung.",
    "Không suy chức vụ, nghề nghiệp, thu nhập hoặc thời điểm. Không coi nguồn không nêu thêm ngoại lệ là chứng minh không có điều chỉnh khác.",
  ],
};
const presentation = {
  contentType: "combination",
  readingTheme: "work",
  readerLimit:
    "Đây là nhận định cục bộ theo điều kiện trong sách, không phải dự báo chắc chắn về sự nghiệp.",
  sourceConditions: [
    "Hóa Kỵ ở Quan Lộc; đoạn nêu riêng ngoại lệ Nhật–Nguyệt đồng cung tại Sửu/Mùi.",
  ],
  projectScope: [
    "career-ky/1.0.0. Phương pháp trạng thái: none — nhánh không yêu cầu sáng/mờ; không dùng satinh-interpretation-states-1.0.0 để chọn kết quả.",
    "Chỉ sao bản mệnh tại chính Quan Lộc. Hai chính tinh phải đồng cung tại đây, không thay bằng sao tam hợp/xung/nhị hợp.",
    "Profile v2, receipt/cổng nguồn hiện hành. Không điền metadata thiếu.",
  ],
  knownExceptions: [
    "Nhật–Nguyệt đồng cung Quan Lộc tại Sửu/Mùi làm thay nhận định nền; hai đoạn không xuất đồng thời.",
  ],
  unknownConditions: [
    "Chưa có quy tắc phối hợp nhánh cục bộ này với mọi sao khác của toàn cung; không mở rộng kết quả ra ngoài §8.19.",
  ],
  sourceScope: "Mục Quan Lộc §8.19, không mượn lời luận Mệnh hoặc hạn.",
};
export const careerKyRules = [
  ruleSchema.parse({
    ...shared,
    id: "tanbien.career-ky-base",
    conditions: [{ fact: "fact.career-origin-ky", op: "eq", value: "yes" }],
    exceptions: [
      { fact: "fact.career-ky-sun-moon-exception", op: "eq", value: "yes" },
    ],
    claimTemplate:
      "Quan Lộc có Hóa Kỵ bản mệnh và không thuộc ngoại lệ Nhật–Nguyệt đồng cung tại Sửu/Mùi. Trong nhánh này, Tân Biên mô tả sự phiền lòng và những trắc trở trên đường công danh. Đây là nội dung của nhánh đang thỏa điều kiện, không khẳng định bạn sẽ gặp một biến cố hay thất bại cụ thể.",
    presentation: {
      ...presentation,
      title: "Hóa Kỵ tại Quan Lộc — nhánh có trở ngại",
      applicability:
        "Có Hóa Kỵ bản mệnh ở Quan Lộc và đã xác định ngoại lệ §8.19 không áp dụng.",
    },
  }),
  ruleSchema.parse({
    ...shared,
    id: "tanbien.career-ky-exception",
    conditions: [
      { fact: "fact.career-origin-ky", op: "eq", value: "yes" },
      { fact: "fact.career-ky-sun-moon-exception", op: "eq", value: "yes" },
    ],
    exceptions: [],
    claimTemplate:
      "Quan Lộc có Hóa Kỵ bản mệnh cùng Thái Dương và Thái Âm tại Sửu/Mùi. Đây là ngoại lệ được Tân Biên nêu ngay trong nhánh Hóa Kỵ: sách chuyển lời luận trắc trở sang công danh phát đạt và sự hanh thông. Không áp đồng thời nhận định nền về trắc trở; ngoại lệ này cũng không phải bảo đảm chức vụ hoặc thành công thực tế.",
    presentation: {
      ...presentation,
      title: "Hóa Kỵ cùng Nhật–Nguyệt — ngoại lệ tại Quan Lộc",
      applicability:
        "Hóa Kỵ và cả hai chính tinh Nhật–Nguyệt bản mệnh tại chính Quan Lộc Sửu/Mùi.",
    },
  }),
];
