import { financeBranches, financeSupplements, FINANCE_READER_LIMIT } from "./tanbien-finance-content";
import { natalSourceContent } from "./tanbien-natal-content";
import { careerContent, careerSourceCondition } from "./tanbien-career-content";
import { ruleSchema, type Condition } from "./schema";
import { tanBienTable } from "./tanbien-source";
const source = (location: string) => ({
  id: "tanbien-supplied-pdf",
  title: "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên",
  url: "/internal/editorial/demo-wuqu-tianfu#source-list",
  location,
  accessedOn: "2026-10-08",
  rights: "pending",
  rightsNote:
    "Đã đọc trực tiếp PDF chủ dự án cung cấp; trang PDF trùng số trang in tại các vị trí dẫn. Diễn giải ngắn do dự án biên soạn; quyền sử dụng nguồn chưa được xác minh.",
});
const make = (
  id: string,
  title: string,
  conditions: Condition[],
  text: string,
  location: string,
  limits: string[],
  contentType: "element-gloss" | "combination" | "context" = "combination",
) =>
  ruleSchema.parse({
    id: "tanbien." + id,
    version: "0.3.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: [...new Set(conditions.map((c) => c.fact))],
    conditions,
    exceptions: [],
    claimTemplate: text,
    evidencePaths: ["chart.palaces"],
    sourceReferences: [source(location)],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      ...limits,
      "Điều kiện cục bộ; ngoại lệ chưa đầy đủ, danh sách ngoại lệ rỗng không chứng minh không có ngoại lệ.",
    ],
    presentation: {
      title,
      contentType,
      applicability:
        "Chỉ khi đáp ứng đúng các điều kiện cấu trúc theo nguồn Tân Biên.",
      knownExceptions: [],
      unknownConditions: limits,
      sourceScope: "Dự thảo theo Tân Biên; không phải kết luận toàn lá số.",
    },
  });
export const tanBienRules = [
  make(
    "r02",
    "R02 · Vũ Khúc–Văn Khúc tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Vũ Khúc" },
      { fact: "fact.life-minor-stars", op: "includes", value: "Văn Khúc" },
      { fact: "fact.tanbien-wuqu-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Vũ Khúc ở vị trí miếu, vượng hoặc đắc, đồng cung Văn Khúc tại Mệnh, được liên hệ với sự học rộng và nhiều khả năng.",
    "Tr.34–35: bảng Vũ Khúc; tr.67: Phú giải Vũ Khúc–Văn Khúc.",
    [
      "Không suy bằng cấp, trí thông minh hoặc năng khiếu cụ thể.",
      `Bảng ${tanBienTable.id}@${tanBienTable.version} đã đối chiếu 12 chi trên ảnh PDF; không dùng brightness engine thay bảng nguồn.`,
      "Khác biệt: mục Vương Đình Chi trên Cổ Học bàn về sự do dự khi gặp sao Văn; giữ riêng với S1, không tự hòa giải.",
    ],
  ),
  make(
    "r05",
    "R05 · Tử Vi–Thiên Tướng tại Quan Lộc",
    [
      { fact: "fact.career-stars", op: "includes", value: "Tử Vi" },
      { fact: "fact.career-stars", op: "includes", value: "Thiên Tướng" },
    ],
    "Theo Tân Biên, Tử Vi–Thiên Tướng đồng cung Quan Lộc được liên hệ với khả năng tổ chức công việc.",
    "Tr.158 mục 8.1; tr.162 mục 8.11.",
    [
      "Chưa tổng hợp sao hội chiếu và ngoại lệ. Không suy chức vụ, nghề nghiệp hoặc thời điểm thành công.",
      "Không yêu cầu brightness; không quy kết hành vi lấn quyền. Câu hỏi quyền hạn nếu có là biên tập.",
    ],
  ),
  make(
    "r22",
    "R22 · Thiên Cơ–Thiên Lương tại Quan Lộc",
    [
      { fact: "fact.career-stars", op: "includes", value: "Thiên Cơ" },
      { fact: "fact.career-stars", op: "includes", value: "Thiên Lương" },
    ],
    "Theo Tân Biên, Thiên Cơ–Thiên Lương đồng cung Quan Lộc được mô tả qua sự cẩn thận khi làm việc và thói quen suy xét xa gần.",
    "PDF / trang in 160, mục 8.6; 162, mục 8.12, đoạn Cơ–Lương đồng cung Quan Lộc.",
    [
      "Chỉ là nhận định cục bộ theo phương pháp truyền thống; chưa tổng hợp sao đi cùng và hội chiếu. Không suy chức vụ, nghề cụ thể, thu nhập hoặc thời điểm thành công.",
      "Không nêu ngoại lệ riêng cho vế được chọn; các điều chỉnh sát tinh ở mục 8.14 trang 163–164 chưa được đặc tả thành kết luận tổng hợp.",
    ],
  ),
  make(
    "r06",
    "R06 · Liêm Trinh độc thủ Tài Bạch Dần/Thân",
    [
      { fact: "fact.wealth-stars", op: "includes", value: "Liêm Trinh" },
      { fact: "fact.wealth-major-count", op: "eq", value: "1" },
      { fact: "fact.wealth-branch-group", op: "eq", value: "dan-than" },
    ],
    "Theo Tân Biên, Liêm Trinh độc thủ tại Tài Bạch ở Dần hoặc Thân được diễn giải theo hướng kiếm tiền qua cạnh tranh và tích lũy chậm.",
    "Tr.190 mục 12.2.",
    [
      "Độc thủ là một chính tinh; phụ tinh không làm mất điều kiện này.",
      "Không hứa giàu có hoặc thu nhập; chưa tổng hợp Tuần/Triệt và các cung liên quan. Không áp cho Mệnh/Quan Lộc.",
    ],
  ),
  make(
    "r01",
    "R01 · Ý nghĩa nền Vũ Khúc tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Vũ Khúc" },
      { fact: "fact.tanbien-wuqu-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Vũ Khúc tại Mệnh ở miếu, vượng hoặc đắc được mô tả qua sự quả quyết và khả năng tổ chức. Đây là ý nghĩa nền của sao trong phương pháp truyền thống.",
    "PDF / trang in 65, mục 4.2.4 Đại cương; bảng trạng thái PDF / trang in 34–35, mục 3.4.",
    [
      "Nguồn cũng nhắc đến hiếu thắng; chưa tổng hợp tương tác các sao. Không suy bằng cấp, nghề nghiệp, giàu sang hoặc tuổi thọ.",
      `Tra bảng ${tanBienTable.id}@${tanBienTable.version}; không dùng nhãn engine thay nhãn sách.`,
    ],
    "element-gloss",
  ),
  make(
    "r03",
    "R03 · Ý nghĩa nền Thiên Phủ tại Mệnh",
    [{ fact: "fact.life-stars", op: "includes", value: "Thiên Phủ" }],
    "Trong phần Thiên Phủ thủ Mệnh, Tân Biên nêu ý nghĩa suy tính và tìm cách giải quyết công việc khó. Đây mới là chú giải nền, chưa tổng hợp Tuần, Triệt và sao hội chiếu.",
    "PDF / trang in 76, mục 4.2.7 Đại cương, đoạn mở đầu và các đoạn điều chỉnh tiếp ngay sau.",
    [
      "Nguồn nêu Tuần/Triệt án ngữ, Không/Kiếp và sát tinh hội hợp có thể thay đổi cách đọc. Chưa đặc tả đầy đủ quan hệ và ngoại lệ; không coi chúng vắng mặt.",
      "Không suy đạo đức, tài sản hoặc kết luận cuối cùng cho Thiên Phủ đồng cung sao khác.",
    ],
    "element-gloss",
  ),
  make(
    "r04",
    "R04 · Hóa Quyền của Vũ Khúc tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Vũ Khúc" },
      { fact: "fact.life-wuqu-origin-mutagen", op: "eq", value: "Quyền" },
    ],
    "Ở đây Vũ Khúc tại Mệnh ghi nhận Hóa Quyền bản mệnh. Trong ý nghĩa riêng của Hóa Quyền, Tân Biên nhấn mạnh sự mạnh bạo, mau mắn và khuynh hướng nắm quyền hành; chưa thể xem đó là kết luận cho toàn bộ tổ hợp sao.",
    "PDF / trang in 40, mục 3.24 Hóa Quyền; hồ sơ HTML R04 giới hạn Vũ Khúc tại Mệnh, scope origin.",
    [
      "Trang 40 mô tả biểu tượng chung, không phải quy tắc riêng của Vũ–Phủ. Điều kiện Vũ Khúc / bản mệnh là phạm vi triển khai thu hẹp theo hồ sơ.",
      "Nguồn còn xét sao tốt/xấu đi cùng; chưa đặc tả nên không kết luận mức độ hoặc quy kết hành vi lấn quyền.",
    ],
    "element-gloss",
  ),
  make(
    "r07",
    "R07 · Lộc Tồn tại Tài Bạch",
    [{ fact: "fact.wealth-minor-stars", op: "includes", value: "Lộc Tồn" }],
    "Tài Bạch ghi nhận Lộc Tồn. Tân Biên xếp sao này vào chủ đề tài lộc; sự hiện diện ấy chưa đủ để kết luận có nhiều tiền hay giữ tiền tốt.",
    "PDF / trang in 40, mục 3.20 Lộc Tồn; PDF / trang in 190, mở đầu mục Tài Bạch.",
    [
      "Ý nghĩa chung của sao được đặt cạnh dữ kiện Tài Bạch; không phải quy tắc dự đoán riêng cho cung này.",
      "Chưa tổng hợp Tuần/Triệt, Mệnh, Thân, Phúc Đức, Quan Lộc và Thiên Di. Không suy mức tài sản hoặc thu nhập.",
    ],
    "element-gloss",
  ),
  make(
    "r08",
    "R08 · Tử Vi tại Mệnh theo Tân Biên",
    [
      { fact: "fact.life-stars", op: "includes", value: "Tử Vi" },
      { fact: "fact.tanbien-ziwei-eligible", op: "eq", value: "eligible" },
    ],
    "Trong phần Tử Vi thủ Mệnh, Tân Biên liên hệ vị trí miếu hoặc bình hòa với sự trung hậu và thẳng thắn. Đây là chú giải nền có điều kiện, chưa tổng hợp các sao đồng cung, hội chiếu và Tuần/Triệt.",
    "PDF / trang in 55–56, mục 4.2.1 Đại cương và Phú giải; bảng PDF / trang in 33, mục 3.1.",
    [
      "Không kết luận năng lực lãnh đạo, chức vụ, tài sản, tuổi thọ hoặc sự kiện tương lai. Không suy ý ngược cho vị trí không đạt điều kiện.",
      "Nguồn 55–57 còn nêu Tuần/Triệt, Không/Kiếp, phụ tá và sao hội hợp. Chưa có đặc tả đầy đủ; không mặc định chúng vắng mặt, không ghép với Thiên Phủ thành kết luận tổ hợp.",
    ],
    "element-gloss",
  ),
  make(
    "r09",
    "R09 · Thiên Tướng tại Mệnh theo Tân Biên",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thiên Tướng" },
      { fact: "fact.tanbien-tianxiang-eligible", op: "eq", value: "eligible" },
    ],
    "Trong phần Thiên Tướng thủ Mệnh, Tân Biên mô tả tính đôn hậu, đồng thời nhắc đến sự ưa chuộng ăn ngon, mặc đẹp khi sao ở miếu, vượng hoặc đắc. Đây là ý nghĩa nền; ảnh hưởng của sao đi cùng và Tuần/Triệt chưa được tổng hợp trong nhận định này.",
    "PDF / trang in 90–91, mục 4.2.11 Đại cương; bảng PDF / trang in 37, mục 3.11, đọc tiếp phần điều chỉnh trang 38 và 92.",
    [
      "Không suy nghề nghiệp, chức vụ, mức tài sản, sức khỏe hoặc sự kiện tương lai; không áp đoạn Quan Lộc sang Mệnh.",
      "Nguồn nêu Tuần/Triệt án ngữ, Hình đồng cung, Kình/Đà và sao hội hợp; phạm vi và ngoại lệ chưa được đặc tả đủ để tổng hợp. Không tự suy án ngữ hai cung từ nhãn đang lưu.",
    ],
    "element-gloss",
  ),
  make(
    "r10",
    "R10 · Liêm Trinh tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Liêm Trinh" },
      { fact: "fact.tanbien-lianzhen-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Liêm Trinh tại Mệnh ở miếu, vượng hoặc đắc được mô tả qua nét thẳng thắn, can đảm, đi cùng sự nghiêm nghị và nóng nảy. Đây là chú giải truyền thống riêng của sao, không phải đánh giá đạo đức của người đọc.",
    "PDF / trang in 60–62, mục 4.2.2; bảng trang 34, mục 3.2.",
    [
      "Các đoạn Liêm–Xương/Khúc, Sát tinh/Kỵ/Hình hội hợp chưa được tổng hợp. Không suy nghề nghiệp, kiện tụng, tuổi thọ hoặc kết quả tài chính.",
    ],
    "element-gloss",
  ),
  make(
    "r11",
    "R11 · Tham Lang tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Tham Lang" },
      { fact: "fact.tanbien-tanlang-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Tham Lang tại Mệnh ở miếu, vượng hoặc đắc được mô tả là ưa hoạt động và có tài tổ chức. Cùng đoạn này, sách nêu khuynh hướng muốn việc chóng xong, dễ chán và bỏ dở sau lúc đầu chuyên cần. Đây là chú giải nền theo phương pháp truyền thống, chưa tổng hợp các sao đi cùng.",
    "PDF / trang in 81–83, mục 4.2.9; bảng trang 37, mục 3.9.",
    [
      "Chưa đặc tả đầy đủ phạm vi hội hợp, Hỏa/Linh đắc địa và các đoạn Kỵ/Riêu. Không suy tham lam từ tên sao, tuổi phát đạt, nghề hoặc bệnh tật.",
    ],
    "element-gloss",
  ),
  make(
    "r12",
    "R12 · Cự Môn tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Cự Môn" },
      { fact: "fact.tanbien-jumen-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Cự Môn tại Mệnh ở miếu hoặc đắc được liên hệ với sự xét đoán và cách ăn nói đanh thép. Đây là phần chú giải nền trong đoạn thủ Mệnh, không phải kết luận về năng lực giao tiếp hoặc nghề nghiệp của người đọc.",
    "PDF / trang in 86–87, mục 4.2.10; bảng trang 37, mục 3.10; đọc tiếp điều chỉnh trang 88–90.",
    [
      "Chưa triển khai vượng địa: bảng sách yêu cầu thêm Hóa Lộc đồng cung hoặc Tuần/Triệt án ngữ cho cách ngọc trong đá; chưa đặc tả đủ phạm vi này. Không suy chức vụ, tài lộc, pháp lý hoặc ý ngược khi không khớp.",
    ],
    "element-gloss",
  ),
  make(
    "r13",
    "R13 · Thiên Cơ tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thiên Cơ" },
      { fact: "fact.tanbien-tianji-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Thiên Cơ tại Mệnh ở miếu, vượng hoặc đắc được mô tả qua mưu trí và sự linh hoạt khi xử lý tình huống. Đây là chú giải nền riêng của sao, không phải đánh giá trí thông minh hay kết luận về nghề nghiệp.",
    "PDF / trang in 74, mục 4.2.6 Đại cương, đoạn đầu; đọc tiếp điều chỉnh 75–76. Bảng PDF / trang in 35, mục 3.6.",
    [
      "Chưa tổng hợp Song Hao, các sao hội hợp, Sát đồng cung hoặc Tuần/Triệt. Không suy bệnh tật, tai nạn, tuổi thọ, nghề y hoặc kỹ thuật từ đoạn nền.",
    ],
    "element-gloss",
  ),
  make(
    "r14",
    "R14 · Thái Dương tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thái Dương" },
      { fact: "fact.tanbien-taiyang-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Thái Dương tại Mệnh ở miếu, vượng hoặc đắc được mô tả là thẳng thắn, cương nghị và hơi nóng nảy. Đây là chú giải nền của sao, chưa phải đánh giá tổng hợp các điều kiện đi cùng.",
    "PDF / trang in 68, mục 4.2.5 Đại cương, đoạn đầu; đọc điều chỉnh 69–73. Bảng PDF / trang in 35, mục 3.5.",
    [
      "Chưa đặc tả ranh giới sinh ban ngày/ban đêm; không xuất kết luận thuận lý hay rực rỡ. Trạng thái theo sách không thay điều kiện thời gian. Chưa tổng hợp Tuần/Triệt, Kỵ, hội hợp; không suy uy quyền, thu nhập hoặc sức khỏe.",
    ],
    "element-gloss",
  ),
  make(
    "r15",
    "R15 · Thiên Đồng tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thiên Đồng" },
      { fact: "fact.tanbien-tiantong-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Thiên Đồng tại Mệnh ở miếu, vượng hoặc đắc được mô tả là khoan hòa, nhưng cũng thiếu quả quyết, khó bền chí và hay thay đổi ý kiến, công việc. Đây là chú giải nền của sao trong phương pháp truyền thống.",
    "PDF / trang in 62, mục 4.2.3 Đại cương, đoạn thứ hai; đọc điều chỉnh 63–64. Bảng PDF / trang in 34, mục 3.3.",
    [
      "Chưa triển khai đoạn Tỵ/Hợi với tuổi Đinh/Canh, sao hội hợp hoặc các tổ hợp Đồng–Lương/Đồng–Âm. Không suy trí tuệ, giàu sang, sức khỏe hoặc tuổi thọ. Các câu bất nhất tại trang63 chưa được hiệu đính.",
    ],
    "element-gloss",
  ),
  make(
    "r16",
    "R16 · Thái Âm tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thái Âm" },
      { fact: "fact.tanbien-taiyin-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Thái Âm tại Mệnh ở miếu, vượng hoặc đắc được mô tả là khoan hòa, ưa thích văn chương và mỹ thuật. Đây là chú giải nền riêng của sao, không phải kết luận về năng khiếu hay nghề nghiệp.",
    "PDF / trang in 78, mục 4.2.8 Đại cương, đoạn đầu; đọc điều chỉnh 79–80. Bảng PDF / trang in 36, mục 3.8.",
    [
      "Chưa đặc tả ngày/đêm và chưa hòa giải phạm vi ngày 1–15 ở trang36 với 10–20 ở trang78; không xuất kết luận thuận lý/toàn mỹ. Chưa tổng hợp Tuần/Triệt, Kỵ và hội hợp; không suy nhà đất, tài sản, sức khỏe hoặc tuổi thọ.",
    ],
    "element-gloss",
  ),
  make(
    "r17",
    "R17 · Thiên Lương tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thiên Lương" },
      { fact: "fact.tanbien-tianliang-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Thiên Lương tại Mệnh ở miếu, vượng hoặc đắc được mô tả theo hướng khoan hòa, nhân hậu và ưa việc từ thiện.",
    "PDF 92 / trang in 92, mục 4.2.12, Đại cương; bảng PDF 38 / trang in 38, mục 3.12. Ngữ cảnh đã đọc: PDF/trang in 92–101.",
    [
      "Không suy sức khỏe, tuổi thọ hoặc bảo đảm tránh tai họa. Chưa đặc tả các nhánh can sinh, hội hợp và Phú giải riêng.",
    ],
    "element-gloss",
  ),
  make(
    "r18",
    "R18 · Thất Sát tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thất Sát" },
      { fact: "fact.tanbien-qisha-eligible", op: "eq", value: "eligible" },
    ],
    "Theo Tân Biên, Thất Sát tại Mệnh ở miếu, vượng hoặc đắc được mô tả theo hướng can đảm, cương nghị và hiếu thắng.",
    "PDF 95 / trang in 95, mục 4.2.13, Đại cương; bảng PDF 38 / trang in 38, mục 3.13. Ngữ cảnh đã đọc: PDF/trang in 92–101.",
    [
      "Không suy bạo lực, nguy hiểm hoặc một nghề cụ thể. Chưa đặc tả các nhánh can sinh, hội hợp và vận.",
    ],
    "element-gloss",
  ),
  make(
    "r19",
    "R19 · Phá Quân tại Mệnh",
    [
      { fact: "fact.life-stars", op: "includes", value: "Phá Quân" },
      { fact: "fact.tanbien-pojun-eligible", op: "eq", value: "eligible" },
      { fact: "fact.life-major-count", op: "eq", value: "1" },
    ],
    "Theo Tân Biên, Phá Quân tại Mệnh ở miếu, vượng hoặc đắc được mô tả là ưa hoạt động, thích đi xa và hiếu thắng.",
    "PDF 98 / trang in 98, mục 4.2.14, Đại cương; bảng PDF 38 / trang in 38, mục 3.14. Ngữ cảnh đã đọc: PDF/trang in 92–101.",
    [
      "Bản thử chỉ xét khi Phá Quân là chính tinh duy nhất tại Mệnh; không luận tổ hợp với chính tinh khác. Không suy đổi mới, sáng tạo hoặc khởi nghiệp. Nhánh can sinh và hội hợp chưa được đặc tả.",
    ],
    "element-gloss",
  ),
  make(
    "r21",
    "R21 · Thái Dương tại Mệnh Hợi/Tý",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thái Dương" },
      { fact: "fact.life-hoi-ty", op: "eq", value: "hoi-ty" },
      { fact: "fact.tanbien-taiyang-state", op: "eq", value: "Hãm" },
    ],
    "Theo Tân Biên, Thái Dương tại Mệnh ở Hợi hoặc Tý, thuộc hãm địa theo bảng sách, được liên hệ với sự ham chuộng văn chương, triết học và đạo lý.",
    "PDF 69 / trang in 69, mục 4.2.5 Đại cương, dòng Nhật hãm địa Hợi, Tý; bảng PDF 35 / trang in 35, mục 3.5. Đọc toàn phần 68–73; đối chiếu ảnh 35 và 69.",
    [
      "Đây là cách mô tả theo nguồn truyền thống, không xác định sở thích thực tế, học vấn hoặc năng lực của người đọc.",
      "Chỉ dùng vế ham chuộng văn chương, triết học, đạo lý; không dùng các phán xét đạo đức trong cùng dòng. Không lấy mô tả ở miếu/vượng/đắc đảo nghĩa sang hãm.",
      "Dòng được chọn không đặt thêm can sinh, giờ sinh, ngày/đêm hay hội hợp; các đoạn kế là nhánh riêng, chưa tổng hợp Tuần/Triệt, sao đi cùng hoặc kết quả cuộc đời. Không xác nhận đã hết ngoại lệ toàn hệ thống.",
    ],
  ),
  make(
    "r20",
    "R20 · Cơ–Cự–Lộc Tồn tại Mệnh Mão/Dậu",
    [
      { fact: "fact.life-stars", op: "includes", value: "Thiên Cơ" },
      { fact: "fact.life-stars", op: "includes", value: "Cự Môn" },
      { fact: "fact.life-mao-dau", op: "eq", value: "mao-dau" },
      { fact: "fact.life-minor-stars", op: "includes", value: "Lộc Tồn" },
    ],
    "Theo Tân Biên, Thiên Cơ–Cự Môn tại Mệnh ở Mão hoặc Dậu, có Lộc Tồn đồng cung, được liên hệ với cách ăn nói thiếu thận trọng.",
    "PDF 89 / trang in 89, mục 4.2.10 Phú giải, mục Cự, Cơ nhi ngộ Lộc Tồn, ngôn ngữ bất cẩn; đọc ngữ cảnh 88–90 và phần Thiên Cơ 74–76; đối chiếu ảnh 88–89.",
    [
      "Đây là mô tả truyền thống của điều kiện này, chưa đủ để đánh giá cách giao tiếp của người đọc. Không suy đạo đức, nghề nghiệp hoặc kết quả tương lai.",
      "Không triển khai vế mở rộng Cự Môn–Lộc Tồn ở mọi vị trí. Đoạn được chọn không đặt điều kiện trạng thái, can sinh, giới, tứ hóa hoặc vận; không lấy điều kiện ở đoạn phú khác ghép ngầm vào đây.",
      "Ngoại lệ riêng không được nêu trong đoạn này; chưa tổng hợp các điều chỉnh khác của toàn hệ thống. Không tự coi Tuần/Triệt là điều kiện loại trừ hoặc coi nhãn sao đang lưu xác nhận phạm vi án ngữ.",
    ],
  ),
];
// Compile source specifications into the SAME finite DSL/catalog.
for (const spec of careerContent) {
  const conditions: Condition[] = (spec.stars || []).map((value) => ({
    fact: "fact.career-stars",
    op: "includes",
    value,
  }));
  if (spec.alone)
    conditions.push({ fact: "fact.career-major-count", op: "eq", value: "1" });
  if (spec.branches)
    conditions.push({
      fact: "fact.career-branch-groups",
      op: "includes",
      value: spec.branches.join("/"),
    });
  if (spec.minor)
    conditions.push({
      fact: "fact.career-minor-stars",
      op: "includes",
      value: spec.minor,
    });
  if (spec.rings)
    conditions.push(
      { fact: "fact.career-suiqian", op: "eq", value: spec.rings[0] },
      { fact: "fact.career-boshi", op: "eq", value: spec.rings[1] },
    );
  const subject = careerSourceCondition(spec).replace(/\.$/, "");
  const rule = make(
    spec.id,
    `${spec.id.toUpperCase()} · ${subject}`,
    conditions,
    `Theo Tân Biên, ${subject} ${spec.meaning}.`,
    `PDF / trang in ${spec.page}, mục ${spec.section}.`,
    [
      spec.limit ||
        "Đây là mô tả cục bộ theo nguồn truyền thống, không xác định năng lực thực tế hoặc dự đoán kết quả nghề nghiệp.",
      "Không suy nghề cụ thể, chức vụ, thu nhập hay thời điểm thành công. Điều chỉnh sát tinh §8.14 chưa đủ đặc tả để tổng hợp.",
    ],
    spec.minor ? "element-gloss" : "combination",
  );
  if (spec.rings) rule.requiredEngineProfile = ["tanbien-vn-trial-v2"];
  rule.version = "0.1.0";
  rule.presentation!.readingTheme = "work";
  rule.presentation!.sourceConditions = [
    subject + ".",
    "Vế được chọn không đặt thêm điều kiện trạng thái, can sinh, thời gian hoặc hội hợp.",
  ];
  rule.presentation!.projectScope = [
    "Chỉ dùng vế mô tả trong mục Quan Lộc; bỏ dự báo chức vị, tài lộc, nghề và thời điểm. Không chuyển phần đã lược bỏ thành đánh giá thuận lợi toàn cung.",
    ...(spec.alone
      ? ["Độc thủ: đúng một chính tinh; phụ tinh không làm mất điều kiện."]
      : []),
    ...(spec.rings
      ? [
          "Chỉ vòng bản mệnh: Bạch Hổ thuộc Thái Tuế; Tấu Thư thuộc Lộc Tồn/Bác Sỹ (tr.9–10); không dùng sao lưu.",
        ]
      : []),
  ];
  tanBienRules.push(rule);
}
export const careerMajorRuleIds = new Set([
  "tanbien.r05",
  "tanbien.r22",
  ...careerContent.filter((s) => s.stars).map((s) => "tanbien." + s.id),
]);
tanBienRules[0].sourceReferences.push({
  id: "cohoc-vuong-dinh-chi",
  title: "Cổ Học — Sao Vũ Khúc",
  url: "https://tuvi.cohoc.net/sao-vu-khuc-nid-183.html",
  location:
    "Mục Sao Vũ Khúc – Vương Đình Chi; khác biệt được hồ sơ K01 ghi nhận.",
  accessedOn: "2026-10-08",
  rights: "pending",
  rightsNote:
    "Dẫn theo tài liệu chủ dự án, chưa kiểm tra lại trang trong lượt này; không gộp phương pháp với Tân Biên.",
});

// Editorial metadata lives on the same catalog rules, not in a second matching system.
const readingMetadata: Record<
  string,
  {
    readingTheme: "action" | "learning" | "initiative" | "work" | "finance";
    sourceConditions: string[];
    projectScope: string[];
  }
> = {
  r01: {
    readingTheme: "action",
    sourceConditions: [
      "Vũ Khúc thủ Mệnh, trạng thái miếu/vượng/đắc theo bảng sách.",
    ],
    projectScope: [
      "Chú giải nền gồm quả quyết, cương nghị, tổ chức và hiếu thắng; chưa tổng hợp các dự đoán và tương tác khác trong đoạn sách.",
    ],
  },
  r02: {
    readingTheme: "learning",
    sourceConditions: [
      "Vũ Khúc tại Mệnh ở miếu/vượng/đắc; Văn Khúc đồng cung.",
    ],
    projectScope: [
      "Giữ chủ đề học hỏi, nhiều khả năng; không suy trí thông minh, bằng cấp hoặc năng khiếu cụ thể.",
    ],
  },
  r03: {
    readingTheme: "action",
    sourceConditions: [
      "Thiên Phủ thủ Mệnh; phần Đại cương nêu ý nghĩa suy tính, giải quyết việc khó.",
    ],
    projectScope: [
      "Chỉ chú giải nền, không kết luận sau khi xét Tuần/Triệt, Không/Kiếp và hội hợp.",
    ],
  },
  r04: {
    readingTheme: "initiative",
    sourceConditions: [
      "Mục Hóa Quyền mô tả biểu tượng chung mạnh bạo, mau mắn và nắm quyền hành; không phải đoạn riêng cho Vũ Khúc tại Mệnh.",
    ],
    projectScope: [
      "Dự án chỉ hiển thị khi Vũ Khúc tại Mệnh được ghi Hóa Quyền bản mệnh. Đây là phạm vi triển khai thu hẹp, không phải điều kiện sách đặt ra cho ý nghĩa chung Hóa Quyền.",
    ],
  },
  r05: {
    readingTheme: "work",
    sourceConditions: [
      "Tử Vi và Thiên Tướng đồng cung Quan Lộc; đoạn nguồn không yêu cầu trạng thái sáng.",
    ],
    projectScope: [
      "Chỉ giữ chủ đề tổ chức công việc, chưa tổng hợp hội chiếu và ngoại lệ.",
    ],
  },
  r22: {
    readingTheme: "work",
    sourceConditions: [
      "Thiên Cơ và Thiên Lương đồng cung Quan Lộc; hai đoạn tương ứng không đặt điều kiện brightness, địa chi, can sinh hay thời vận cho vế cẩn thận và suy xét.",
    ],
    projectScope: [
      "Chỉ giữ ý cẩn thận khi làm việc, suy xét xa gần. Bỏ dự đoán chức vụ, nghề và danh tiếng; không kết luận toàn cung.",
      "Không xuất khi thiếu dữ kiện Cục/ngày âm hoặc thuộc Kim Cục ngày 21/24 còn mâu thuẫn; đây là cổng dữ kiện dự án, không phải điều kiện sách cho tổ hợp.",
    ],
  },
  r06: {
    readingTheme: "finance",
    sourceConditions: [
      "Liêm Trinh độc thủ Tài Bạch tại Dần hoặc Thân; độc thủ là không có chính tinh khác cùng cung.",
    ],
    projectScope: [
      "Không dùng vế hứa hẹn kết quả tài sản; chưa tổng hợp Tuần/Triệt và các cung liên quan.",
    ],
  },
  r07: {
    readingTheme: "finance",
    sourceConditions: [
      "Mục Lộc Tồn nêu ý nghĩa chung liên quan tài lộc, không phải nhận định riêng cho cung Tài Bạch.",
    ],
    projectScope: [
      "Dự án đặt biểu tượng chung cạnh dữ kiện Lộc Tồn tại Tài Bạch; không suy mức tài sản hoặc khả năng giữ tiền.",
    ],
  },
  r08: {
    readingTheme: "action",
    sourceConditions: [
      "Tử Vi thủ Mệnh ở miếu hoặc bình hòa theo bảng sách, không phải vượng/đắc.",
    ],
    projectScope: [
      "Chỉ diễn giải ý nghĩa nền trung hậu, thẳng thắn; không tổng hợp Tử Vi–Thiên Phủ hoặc dự đoán tương lai.",
    ],
  },
  r09: {
    readingTheme: "action",
    sourceConditions: ["Thiên Tướng thủ Mệnh ở miếu/vượng/đắc theo bảng sách."],
    projectScope: [
      "Chỉ chú giải nền đôn hậu và sự chú ý đến ăn mặc; không chuyển thành luận giải đầy đủ hoặc nhận định tổ hợp.",
    ],
  },
  r10: {
    readingTheme: "action",
    sourceConditions: ["Liêm Trinh thủ Mệnh ở miếu/vượng/đắc theo bảng sách."],
    projectScope: [
      "Chỉ chú giải nền từ đoạn Đại cương, không áp dụng các phán xét đạo đức/giới hoặc dự đoán tuyệt đối; không dùng đoạn ở cung khác.",
    ],
  },
  r11: {
    readingTheme: "action",
    sourceConditions: ["Tham Lang thủ Mệnh ở miếu/vượng/đắc theo bảng sách."],
    projectScope: [
      "Chỉ chú giải nền từ đoạn Đại cương, không áp dụng các phán xét đạo đức/giới hoặc dự đoán tuyệt đối; không dùng đoạn ở cung khác.",
    ],
  },
  r12: {
    readingTheme: "action",
    sourceConditions: ["Cự Môn thủ Mệnh ở miếu/vượng/đắc theo bảng sách."],
    projectScope: [
      "Chỉ triển khai miếu/đắc; vượng giữ chưa triển khai để không bỏ qua điều kiện bổ sung ở trang 37/86.",
    ],
  },
  r13: {
    readingTheme: "action",
    sourceConditions: [
      "Thiên Cơ là chính tinh tại Mệnh, ở miếu/vượng/đắc theo bảng Tân Biên.",
    ],
    projectScope: [
      "Chỉ diễn giải phần mô tả nền, không suy nhận định tổ hợp, dự báo hoặc phán xét người đọc.",
    ],
  },
  r14: {
    readingTheme: "action",
    sourceConditions: [
      "Thái Dương là chính tinh tại Mệnh, ở miếu/vượng/đắc theo bảng Tân Biên.",
    ],
    projectScope: [
      "Chỉ diễn giải phần mô tả nền, không suy nhận định tổ hợp, dự báo hoặc phán xét người đọc.",
      "Không triển khai các kết luận thuận lý/toàn mỹ phụ thuộc ngày/đêm hoặc ngày âm lịch; đoạn nền được chọn không đặt các yếu tố này làm tiền đề.",
    ],
  },
  r15: {
    readingTheme: "action",
    sourceConditions: [
      "Thiên Đồng là chính tinh tại Mệnh, ở miếu/vượng/đắc theo bảng Tân Biên.",
    ],
    projectScope: [
      "Chỉ diễn giải phần mô tả nền, không suy nhận định tổ hợp, dự báo hoặc phán xét người đọc.",
    ],
  },
  r16: {
    readingTheme: "action",
    sourceConditions: [
      "Thái Âm là chính tinh tại Mệnh, ở miếu/vượng/đắc theo bảng Tân Biên.",
    ],
    projectScope: [
      "Chỉ diễn giải phần mô tả nền, không suy nhận định tổ hợp, dự báo hoặc phán xét người đọc.",
      "Không triển khai các kết luận thuận lý/toàn mỹ phụ thuộc ngày/đêm hoặc ngày âm lịch; đoạn nền được chọn không đặt các yếu tố này làm tiền đề.",
    ],
  },
  r17: {
    readingTheme: "action",
    sourceConditions: [
      "Thiên Lương là chính tinh tại Mệnh, ở miếu/vượng/đắc theo bảng Tân Biên.",
    ],
    projectScope: [
      "Chỉ biên soạn một phần mô tả nền; loại các phán xét đạo đức/giới và dự đoán tuyệt đối, không biến thành kết luận tổ hợp.",
    ],
  },
  r18: {
    readingTheme: "action",
    sourceConditions: [
      "Thất Sát là chính tinh tại Mệnh, ở miếu/vượng/đắc theo bảng Tân Biên.",
    ],
    projectScope: [
      "Chỉ biên soạn một phần mô tả nền; loại các phán xét đạo đức/giới và dự đoán tuyệt đối, không biến thành kết luận tổ hợp.",
    ],
  },
  r19: {
    readingTheme: "action",
    sourceConditions: [
      "Phá Quân là chính tinh tại Mệnh, ở miếu/vượng/đắc theo bảng Tân Biên.",
    ],
    projectScope: [
      "Chỉ biên soạn một phần mô tả nền; loại các phán xét đạo đức/giới và dự đoán tuyệt đối, không biến thành kết luận tổ hợp. Dự án thu hẹp thêm: đúng một chính tinh tại Mệnh; đây không phải điều kiện nguyên văn của đoạn Đại cương. Phụ tinh không làm mất điều kiện này.",
    ],
  },
  r21: {
    readingTheme: "learning",
    sourceConditions: [
      "Thái Dương là chính tinh tại Mệnh ở Hợi hoặc Tý; hãm địa theo bảng Tân Biên 3.5.",
      "Dòng Đại cương tr.69 không nêu điều kiện thời gian, can sinh hay sao hội hợp cho vế này.",
    ],
    projectScope: [
      "Chỉ diễn đạt vế ham chuộng văn chương, triết học, đạo lý; bỏ đánh giá đạo đức. Không đánh giá sở thích thực tế, năng lực hoặc luận tổ hợp.",
    ],
  },
  r20: {
    readingTheme: "action",
    sourceConditions: [
      "Thiên Cơ, Cự Môn và Lộc Tồn đồng cung Mệnh tại Mão hoặc Dậu.",
      "Đoạn nguồn không yêu cầu thêm trạng thái, can sinh, giới, tứ hóa hay vận; Lộc Tồn không đồng nhất với Hóa Lộc.",
    ],
    projectScope: [
      "Chỉ nhánh ba sao ở Mão/Dậu; không triển khai vế mở rộng Cự Môn–Lộc Tồn ở mọi vị trí. Chỉ dùng dữ kiện bản mệnh trong snapshot, không tính vận.",
      "Chỉ mô tả cách diễn giải truyền thống; không đánh giá chắc chắn hành vi người đọc. Giữ chú giải riêng R12/R13 vì chúng không đồng nghĩa và không tự hòa giải khác biệt.",
    ],
  },
};
for (const rule of tanBienRules) {
  if (
    [
      "tanbien.r10",
      "tanbien.r11",
      "tanbien.r12",
      "tanbien.r13",
      "tanbien.r14",
      "tanbien.r15",
      "tanbien.r16",
      "tanbien.r17",
      "tanbien.r18",
      "tanbien.r19",
      "tanbien.r20",
      "tanbien.r21",
    ].includes(rule.id)
  )
    rule.version = "0.1.0";
  if (
    [
      "tanbien.r17",
      "tanbien.r18",
      "tanbien.r19",
      "tanbien.r20",
      "tanbien.r21",
    ].includes(rule.id)
  )
    rule.sourceReferences.forEach((s) => (s.accessedOn = "2026-10-09"));
  Object.assign(rule.presentation!, readingMetadata[rule.id.split(".")[1]]);
  if (careerMajorRuleIds.has(rule.id)) {
    rule.version = rule.id === "tanbien.r05" ? "0.4.0" : "0.1.0";
    rule.requiredFacts.push("fact.career-source-available");
    rule.presentation!.projectScope!.push(
      "Cần xác định Cục/ngày âm; không phát hành nhận định dựa trên ô Kim Cục 21/24 còn mâu thuẫn. Đây là giới hạn triển khai, không phải điều kiện sách.",
    );
    rule.sourceReferences.forEach((s) => (s.accessedOn = "2026-10-09"));
  }
  ruleSchema.parse(rule);
}

// New source glosses share the existing DSL and source-position release gate.
for (const spec of natalSourceContent) {
  const rule = make(
    spec.id,
    spec.title,
    spec.conditions,
    spec.text,
    `PDF / trang in ${spec.pages}.`,
    [spec.limit],
    "context",
  );
  rule.version = "0.2.0";
  rule.requiredFacts.push("fact.source-position-available");
  Object.assign(rule.presentation!, {
    readingTheme: spec.theme,
    sourceConditions: [spec.title + "."],
    projectScope: [
      "Chỉ chú giải nền theo nhánh nguồn; không phải kết luận tổng hợp.",
      ...(spec.conditions.some((c) => c.fact === "fact.career-major-count")
        ? [
            "Độc thủ nghĩa là đúng một chính tinh bản mệnh, không loại phụ tinh.",
          ]
        : [
            "Hai chính tinh bản mệnh được yêu cầu đồng cung Tài Bạch; không có điều kiện độc thủ.",
          ]),
      "Cổng dữ liệu vị trí giữ nguyên giới hạn Kim Cục ngày 21/24 của dự án.",
    ],
    knownExceptions: [spec.limit],
  });
  rule.sourceReferences.forEach((s) => (s.accessedOn = "2026-10-10"));
  tanBienRules.push(ruleSchema.parse(rule));
}
// Content revisions affect only newly built readings, never frozen records.
for (const rule of tanBienRules) {
  if (rule.id === "tanbien.r01") {
    rule.version = "0.4.0";
    rule.claimTemplate =
      "Trong phần Vũ Khúc thủ Mệnh ở miếu, vượng hoặc đắc, Tân Biên mô tả sự quả quyết, cương nghị và khả năng tổ chức, đồng thời nhắc đến tính hiếu thắng. Đây là chú giải nền của sao, chưa phải đánh giá tính cách của người đọc.";
  }
  if (rule.id === "tanbien.r05") {
    rule.version = "0.5.0";
    rule.claimTemplate =
      "Trong mục Quan Lộc, Tân Biên liên hệ Tử Vi–Thiên Tướng đồng cung với khả năng tổ chức, nhưng cũng nhắc tới mưu tính và việc vượt quyền người trên. Đây là hai mặt của đoạn nguồn; không dùng chúng để quy kết năng lực hay hành vi thực tế của người đọc.";
    rule.presentation!.contentType = "context";
  }
  if (rule.id === "tanbien.r06") {
    rule.version = "0.4.0";
    rule.claimTemplate =
      "Trong mục Tài Bạch, Tân Biên mô tả Liêm Trinh độc thủ ở Dần hoặc Thân qua sự cạnh tranh khi kiếm tiền và tích lũy chậm nhưng chắc. Đây là chú giải của nhánh nguồn, chưa phải kết luận về sinh kế thực tế; sách yêu cầu xét thêm Mệnh, Thân, Phúc Đức, Quan Lộc và Thiên Di.";
    rule.presentation!.contentType = "context";
  }
  ruleSchema.parse(rule);
}

for (const rule of tanBienRules) {
  if (!rule.presentation) continue;
  if (
    !natalSourceContent.some((s) => "tanbien." + s.id === rule.id) &&
    !["tanbien.r01", "tanbien.r05", "tanbien.r06"].includes(rule.id)
  ) {
    const v = rule.version.split(".").map(Number);
    v[2]++;
    rule.version = v.join(".");
  }
  if (rule.presentation.readingTheme === "work")
    rule.presentation.contentType = "context";
  const spec = natalSourceContent.find((s) => "tanbien." + s.id === rule.id);
  rule.presentation.readerLimit =
    spec?.limit ||
    (rule.presentation.readingTheme === "finance"
      ? "Chưa tổng hợp Mệnh, Thân, Phúc Đức, Quan Lộc, Thiên Di và Tuần/Triệt; phần này chưa kết luận tài sản hay thu nhập."
      : rule.presentation.readingTheme === "work"
        ? "Chưa tổng hợp các sao đi cùng, hội chiếu và điều chỉnh sát tinh; đây chưa phải kết luận về nghề nghiệp hoặc công danh."
        : "Các ý nghĩa riêng chưa được tổng hợp với sao đi cùng, hội chiếu và Tuần/Triệt; không ghép chúng thành kết luận tính cách hay kết quả cuộc đời.");
  ruleSchema.parse(rule);
}

// Evidence corrections and scoped career assessment: new reads only.
for (const rule of tanBienRules) {
  if (
    [
      "tanbien.r01",
      "tanbien.r05",
      "tanbien.r40",
      "tanbien.r41",
      "tanbien.r42",
      "tanbien.r43",
    ].includes(rule.id)
  ) {
    const v = rule.version.split(".").map(Number);
    v[1]++;
    v[2] = 0;
    rule.version = v.join(".");
  }
  if (["tanbien.r05", "tanbien.r40", "tanbien.r41"].includes(rule.id)) {
    rule.presentation!.readerLimit =
      "Chưa kết luận về công danh; các yếu tố liên quan của hồ sơ được trình bày trong căn cứ.";
    rule.presentation!.projectScope = [
      "Chỉ giữ chú giải nhánh Tử Vi tại Quan Lộc trong §8.1. Không ghép với ý nghĩa Tử Vi ở Mệnh hoặc Tài Bạch.",
      "Đánh giá điều kiện đã lưu cùng bài đọc phân biệt vị trí cung, trạng thái theo bảng sách, nhánh không áp dụng và quy tắc chưa xác định. Không đồng nhất vị trí Tuần/Triệt với án ngữ.",
    ];
    rule.limitations = [
      rule.presentation!.readerLimit,
      "§8.45 chỉ áp dụng nhánh vô chính diệu. Tr.33 đã định nghĩa sáng/mờ theo vị trí; phạm vi áp dụng §8.14 và quy tắc phối hợp các nhóm vẫn chưa được chốt.",
    ];
    rule.presentation!.knownExceptions = [
      "Điều chỉnh sát tinh §8.14 đang chờ đặc tả; không tự quyết định thay thế nhánh nền. Không áp ngoại lệ vô chính diệu vào cung có chính tinh.",
    ];
  }
  ruleSchema.parse(rule);
}

// Source metadata revision only; conditions and claims remain unchanged.
for (const rule of tanBienRules) {
  if (["tanbien.r05", "tanbien.r40", "tanbien.r41"].includes(rule.id)) {
    const v = rule.version.split(".").map(Number);
    v[2]++;
    rule.version = v.join(".");
    rule.presentation!.projectScope!.push(
      "Tr.33 §2.4–2.11 cung cấp định nghĩa vị trí; tr.34,37–38 cung cấp ý điều chỉnh. D1–D6 chưa được chốt, không đưa phương án nghiên cứu vào claim.",
    );
    ruleSchema.parse(rule);
  }
}

// Finance batch: canonical source branches, draft only. Parallel mentions in
// 12.1–12.14 map to one rule; no scoring and no borrowed career adjustments.
for (const spec of financeBranches.filter(s => !s.existing)) {
  const conditions: Condition[] = spec.stars.map(value => ({fact:'fact.wealth-stars',op:'includes',value}));
  if(spec.id.startsWith('nhat-alone-')) conditions.push({fact:'fact.finance-single-complete',op:'eq',value:'yes'});
  if(spec.alone) conditions.push({fact:'fact.wealth-major-count',op:'eq',value:'1'});
  if(spec.branches) conditions.push({fact:'fact.wealth-branch-groups',op:'includes',value:spec.branches.join('/')});
  const rule=make('finance-'+spec.id, spec.stars.join('–')+' tại Tài Bạch'+(spec.branches?' '+spec.branches.join('/') : ''), conditions,
    `Trong mục Tài Bạch, Tân Biên mô tả nhánh ${spec.stars.join('–')}${spec.alone?' độc thủ':' đồng cung'}${spec.branches?' tại '+spec.branches.join(' hoặc '):''} qua ${spec.meaning}. Đây là chú giải có điều kiện của đoạn nguồn, không xác nhận kết quả tài chính của người đọc.`,
    `PDF / trang in ${spec.pages}; định nghĩa đơn thủ/đồng cung tr.33 §2.7–2.8; mở đầu tr.190; điều chỉnh tr.194–197.`,[FINANCE_READER_LIMIT],'context');
  rule.version='0.1.0'; rule.requiredFacts.push('fact.source-position-available');
  Object.assign(rule.presentation!,{readingTheme:'finance',readerLimit:FINANCE_READER_LIMIT,
    sourceConditions:[`Tại Tài Bạch bản mệnh có ${spec.stars.join(' và ')}${spec.alone?', không có chính tinh khác đồng cung':''}${spec.branches?'; địa chi '+spec.branches.join(' hoặc '):''}.`],
    projectScope:['Điều kiện nhánh cục bộ rõ; chỉ xuất chú giải, chưa tổng hợp toàn cung theo mở đầu tr.190.','Các đoạn lặp theo tên hai chính tinh được hợp nhất, không tăng độ mạnh. Không suy tuổi/năm phát tài hoặc nghề phù hợp.'],
    knownExceptions:['Nhật–Nguyệt có điều chỉnh Hóa Kỵ đồng cung hoặc Tuần/Triệt án ngữ tại tr.191; chỉ vế Hóa Kỵ với liên kết bản mệnh rõ được kiểm tra riêng.','Điều chỉnh tổng quát tr.194–197 và yêu cầu xét các cung tr.190 chưa có phép phối hợp đầy đủ.'],
    unknownConditions:[FINANCE_READER_LIMIT]});
  // Do not attach a branch-specific exception to an unrelated combination.
  if(spec.id!=='nhat-nguyet') rule.presentation!.knownExceptions!.shift();
  rule.sourceReferences.forEach(s=>s.accessedOn='2026-10-11');tanBienRules.push(ruleSchema.parse(rule));
}
const financeKy=make('finance-nhat-nguyet-ky','Nhật–Nguyệt có Hóa Kỵ bản mệnh tại Tài Bạch',[
 {fact:'fact.wealth-stars',op:'includes',value:'Thái Dương'},
 {fact:'fact.wealth-stars',op:'includes',value:'Thái Âm'},
 {fact:'fact.finance-origin-ky',op:'eq',value:'yes'},
], 'Riêng với Nhật–Nguyệt đồng cung Tài Bạch và có Hóa Kỵ bản mệnh tại cung này, đoạn nguồn nêu một điều chỉnh thuận hơn về việc tạo dựng tiền bạc. Vì vậy không áp ý chung “Hóa Kỵ là tán tài” thay cho điều kiện riêng này. Đây là chú giải điều chỉnh cục bộ, không xác nhận người đọc sẽ giàu hoặc coi Hóa Kỵ luôn có lợi.',
 'PDF / trang in 191 §12.5; đối chiếu 195 §12.23; mở đầu 190.',[FINANCE_READER_LIMIT],'context');
financeKy.version='0.2.0'; financeKy.requiredFacts.push('fact.source-position-available');
Object.assign(financeKy.presentation!,{readingTheme:'finance',readerLimit:FINANCE_READER_LIMIT,
 sourceConditions:['Thái Dương và Thái Âm đồng cung Tài Bạch; có sao mang Hóa Kỵ với scope origin ngay tại Tài Bạch. Không dùng sao lưu.'],
 projectScope:['Chỉ vế Hóa Kỵ đồng cung được nguồn nói rõ; không triển khai vế Tuần/Triệt án ngữ. Không cộng hai đoạn thành độ mạnh tài vận.'],
 knownExceptions:['Phép phối hợp với các cung liên quan và Tuần/Triệt chưa xác định; không xuất kết luận cá nhân.'],unknownConditions:[FINANCE_READER_LIMIT]});
financeKy.sourceReferences.forEach(s=>s.accessedOn='2026-10-11');tanBienRules.push(ruleSchema.parse(financeKy));

// Independent Finance additions use the same evaluator, trace and renderer.
for (const spec of financeSupplements) {
 const r=make('finance-extra-'+spec.id,spec.title,[{fact:'fact.finance-extra-'+spec.id,op:'eq',value:'yes'}],spec.text,`PDF/trang in ${spec.page}; định nghĩa tọa thủ/đồng cung PDF33; giới hạn toàn cung PDF190.`,[FINANCE_READER_LIMIT],'context');
 r.version='0.1.0';r.requiredEngineProfile=['tanbien-vn-trial-v2'];
 r.requiredFacts.push('fact.source-position-available');
 Object.assign(r.presentation!,{readingTheme:'finance',readerLimit:FINANCE_READER_LIMIT,sourceConditions:[spec.id==='ky-general'?'Có Hóa Kỵ bản mệnh tại Tài Bạch; danh sách chính tinh đầy đủ xác nhận không phải Nhật–Nguyệt đồng cung.':spec.id==='loc-position'?'Có Hóa Lộc bản mệnh tại chính Tài Bạch.':spec.stars.join(' và ')+' bản mệnh cùng tại Tài Bạch.'],projectScope:['finance-expansion/1.0.0; phương pháp trạng thái: none. Không thay bằng cung chiếu.','Chứng nhận natal-transformations-1.0.0 được xác minh lại; chứng nhận sai giữ unknown.'],knownExceptions:spec.id==='ky-general'?['Nhật–Nguyệt đồng cung: không xuất nhánh tán tài này; giữ nhánh riêng PDF191.']:['Đoạn không nêu ngoại lệ riêng; không chứng minh đã tổng hợp các điều chỉnh toàn cung.'],unknownConditions:[FINANCE_READER_LIMIT]});
 r.sourceReferences.forEach(x=>x.accessedOn='2026-10-12');tanBienRules.push(ruleSchema.parse(r));
}
