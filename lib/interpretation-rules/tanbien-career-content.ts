/** Source specification read BEFORE implementation: PDF/printed pp158–167.
 * Data consumed by the existing catalog/DSL, never a parallel evaluator.
 * All branches are local Quan Lộc; alone means exactly one major star, not no auxiliaries.
 */
export type CareerContent = {
  id: string;
  stars?: string[];
  alone?: boolean;
  branches?: string[];
  minor?: string;
  rings?: [string, string];
  page: string;
  section: string;
  meaning: string;
  limit?: string;
};
export const careerContent: CareerContent[] = [
  {
    id: "r23",
    stars: ["Thiên Cơ", "Cự Môn"],
    page: "160, 162",
    section: "8.6, 8.10",
    meaning: "được mô tả qua mưu trí và sự ưa thích máy móc",
  },
  {
    id: "r24",
    stars: ["Thiên Đồng"],
    alone: true,
    branches: ["Mão", "Dậu"],
    page: "158",
    section: "8.3",
    meaning: "được mô tả là hay thay đổi công việc",
  },
  {
    id: "r25",
    stars: ["Thiên Đồng"],
    alone: true,
    branches: ["Tỵ", "Hợi"],
    page: "158",
    section: "8.3",
    meaning: "được mô tả là làm việc hay chóng chán và thích di chuyển",
  },
  {
    id: "r26",
    stars: ["Thiên Đồng"],
    alone: true,
    branches: ["Thìn", "Tuất"],
    page: "158",
    section: "8.3",
    meaning: "được liên hệ với cách ăn nói và luận lý",
  },
  {
    id: "r27",
    stars: ["Thái Dương", "Cự Môn"],
    branches: ["Dần"],
    page: "159, 161",
    section: "8.5, 8.10",
    meaning: "được liên hệ với sự luận lý và xét đoán",
  },
  {
    id: "r28",
    stars: ["Thái Âm"],
    alone: true,
    branches: ["Mão"],
    page: "160",
    section: "8.8",
    meaning: "được liên hệ với cách ăn nói và văn chương",
  },
  {
    id: "r29",
    stars: ["Thái Âm"],
    alone: true,
    branches: ["Thìn", "Tỵ"],
    page: "160",
    section: "8.8",
    meaning: "được liên hệ với văn chương",
    limit:
      "Đoạn nguồn còn nói về trở ngại và cơ hội thi thố; bản đọc không chuyển phần văn chương thành kết luận thuận lợi về công danh.",
  },
  {
    id: "r30",
    stars: ["Thái Dương"],
    alone: true,
    branches: ["Tuất", "Hợi"],
    page: "159",
    section: "8.5",
    meaning: "được liên hệ với văn chương",
    limit:
      "Đoạn nguồn còn nói về trở ngại và cơ hội thi thố; bản đọc không chuyển phần văn chương thành kết luận thuận lợi về công danh.",
  },
  {
    id: "r31",
    stars: ["Cự Môn"],
    alone: true,
    branches: ["Tý", "Ngọ"],
    page: "161",
    section: "8.10",
    meaning: "được liên hệ với cách ăn nói, tổ chức và mưu trí",
  },
  {
    id: "r32",
    stars: ["Cự Môn"],
    alone: true,
    branches: ["Thìn", "Tuất"],
    page: "161",
    section: "8.10",
    meaning: "được liên hệ với sự xét đoán, luận lý và cách ăn nói hùng hồn",
    limit:
      "Nguồn còn nhắc thay đổi công việc và chuyện thị phi; đoạn này không phải đánh giá thuận lợi cho toàn cung.",
  },
  {
    id: "r33",
    stars: ["Thiên Lương"],
    alone: true,
    branches: ["Tỵ", "Hợi"],
    page: "162",
    section: "8.12",
    meaning: "được mô tả là làm việc hay chóng chán và thích di chuyển",
  },
  {
    id: "r34",
    stars: ["Phá Quân"],
    alone: true,
    branches: ["Tý", "Ngọ"],
    page: "163",
    section: "8.14 Phá Quân",
    meaning: "được mô tả qua mưu trí và sự dũng mãnh",
    limit:
      "Đây là cách diễn đạt truyền thống, không khuyến khích mạo hiểm hoặc suy thành khả năng thành công trong hoàn cảnh nguy hiểm.",
  },
  {
    id: "r35",
    stars: ["Phá Quân"],
    alone: true,
    branches: ["Thìn", "Tuất"],
    page: "163",
    section: "8.14 Phá Quân",
    meaning: "được liên hệ với mưu trí",
    limit:
      "Nguồn còn nhắc việc át quyền người trên. Không dùng riêng ý mưu trí để đánh giá toàn bộ cách làm việc, cũng không quy kết hành vi cho người đọc.",
  },
  {
    id: "r36",
    minor: "Lộc Tồn",
    page: "164",
    section: "8.18",
    meaning: "được liên hệ với khả năng tổ chức",
  },
  {
    id: "r37",
    minor: "Thiên Mã",
    page: "165",
    section: "8.22",
    meaning: "được liên hệ với khả năng tổ chức và thao lược",
  },
  {
    id: "r38",
    rings: ["Bạch Hổ", "Tấu Thư"],
    page: "166; định danh vòng bản mệnh 9–10",
    section: "8.39",
    meaning:
      "được liên hệ với văn chương và việc học ngoại ngữ chóng thông hiểu",
    limit:
      "Chỉ dùng hai sao vòng bản mệnh, không dùng sao lưu. Không suy trình độ ngoại ngữ thực tế hay thành tích học tập.",
  },
  {
    id: "r39",
    stars: ["Thiên Đồng", "Thái Âm"],
    branches: ["Tý"],
    page: "159–160",
    section: "8.3, 8.8",
    meaning:
      "được liên hệ với khả năng can gián người trên, tức góp lời khuyên ngăn",
    limit:
      "Không quy kết quan hệ với cấp trên hoặc suy rằng lời góp ý sẽ được chấp nhận.",
  },
];
export const careerSourceCondition = (r: CareerContent) =>
  `${r.stars?.join("–") || r.minor || r.rings?.join("–")} ${r.alone ? "là chính tinh duy nhất tại" : (r.stars && r.stars.length > 1) || r.rings ? "đồng cung tại" : "tại"} Quan Lộc${r.branches ? " ở " + r.branches.join(" hoặc ") : ""}.`;
