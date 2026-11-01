import type { InternalReading } from "../internal-review/reading-store";
import type { Knowledge } from "./contract";
import { paidFacts } from "./paid-facts";
import { paidTopicBooks } from "./paid-topic-books";

/** Small source-backed editorial extracts, not an evaluator or a new chart rule
 * system. General star meanings remain reference-only; conditions are retained.
 * Full books remain private. The audit records the reviewed page hashes. */
export function paidBookKnowledge(record: InternalReading, target: string): Knowledge[] {
  const palace = record.snapshot.chart.palaces.find(p => p.name === target);
  if (!palace || target === "Tật Ách") return [];
  const input = paidFacts(record, target);
  const facts = input.facts;
  const traced = (name: string, field: string) => facts.some(f =>
    f.provenance?.palace === target && f.provenance.field === field &&
    f.provenance.verification === "source-traced" && f.text.includes(name));
  const items: Knowledge[] = [];
  const add = (id: string, title: string, text: string, page: number, conditions: string[], limits: string[], direct = false) => items.push({
    id: "paid-book." + id, title, text, conditions, limits,
    references: [{ title: "Nguyễn Phát Lộc — Tử Vi Tổng Hợp", location: `Trang PDF ${page}; ${title}` }],
    selection: direct ? "matched-snapshot" : "reference-only",
    group: "B", application: direct ? "direct" : "reference-only",
    subjectPalaces: [target],
    provenance: { ruleIds: [], ruleStatuses: [], sourceVersion: "paid-book-extracts-1.0.0", certification: "editorial-reference-not-expert-approved" },
  });
  if (target === "Tài Bạch" && ["Dần", "Thân"].includes(palace.earthlyBranch) &&
      palace.majorStars.length === 1 && palace.majorStars[0].name === "Liêm Trinh" && traced("Liêm Trinh", "majorStars"))
    add("npl261-liem-tai", "Liêm Trinh độc thủ Dần/Thân tại Tài", "Trong mục tiền bạc, tác giả gắn Liêm Trinh ở Dần, Thân với việc kiếm tiền phải cạnh tranh và chậm; phần sau của câu nguồn mô tả làm giàu chắc chắn. Đây là một lời đơn sao theo đúng vị trí, không phải kết luận phối hợp với Đại Hao.", 261,
      ["Cung Tài có Liêm Trinh đơn thủ Dần hoặc Thân; không thay bằng bộ Liêm–Tham/Liêm–Phủ/Liêm–Sát/Liêm–Phá."],
      ["Lời làm giàu chắc chắn là cách khẳng định của tác giả, không được chuyển thành cam kết thu nhập hoặc tài sản của khách hàng.", "Nguồn không giải quyết riêng Liêm–Đại Hao; không suy sao này thắng hoặc chế hóa sao kia."] , true);
  if (target === "Quan Lộc" && traced("Tấu Thư", "boshi12"))
    add("npl226-tau-thu", "Tấu Thư trong nhóm năng khiếu biểu đạt", "Ở mục năng khiếu cho nghề dạy học, tác giả mô tả Tấu Thư bằng sự khôn khéo của ngôn ngữ, ý tưởng thanh nhã, cách trình bày mềm mỏng và hiệu lực thuyết phục. Đây là nghĩa sao trong nhóm biểu đạt, không tự xác định nghề dạy học.", 226,
      ["Tấu Thư có vị trí đã kiểm; trang nguồn bàn về năng khiếu nói và học trong nhóm nghề dạy học."],
      ["Chỉ làm nền phân tích biểu đạt khi có luận điểm trực tiếp phù hợp; không suy bằng cấp, ngoại ngữ hoặc nghề cụ thể từ lời đơn sao này.", "Không tự tạo phép phối hợp Hổ–Tấu mới; đối chiếu mệnh đề tổ hợp riêng đã gửi."]);
  if (target === "Tài Bạch" && traced("Thái Tuế", "suiqian12"))
    add("npl226-thai-tue", "Thái Tuế trong nhóm năng khiếu biểu đạt", "Tác giả xếp Thái Tuế trong nhóm nói giỏi, mô tả nói nhiều, khả năng biện luận và khuynh hướng đấu lý. Đây là nghĩa nền về biểu đạt trong mục nghề nghiệp, không phải lời dự đoán tiền bạc.", 226,
      ["Thái Tuế bản mệnh đã xác minh; giữ ngữ cảnh gốc nghề nghiệp/biểu đạt, không thay bằng Thái Tuế lưu niên."],
      ["Không trực tiếp suy cách kiếm tiền, tranh chấp tài sản hoặc kết quả thu nhập; chỉ được nối ở mức tổng hợp có giới hạn cùng nguồn trực tiếp về Tài."]);
  // NPL262 disagrees with the stored Tân Biên brightness of Hao at Thân.
  // This is an explicit source boundary, never a matched Liêm–Hao claim.
  if (target === "Tài Bạch" && traced("Đại Hao", "boshi12"))
    add("npl262-hao-boundary", "Giới hạn điều kiện Nhị Hao theo Nguyễn Phát Lộc", "Mục hao tiền của tác giả nói Nhị Hao hãm và dành ngoại lệ Mão, Dậu; văn nguồn có các lời hoang phí, túng thiếu và nợ nần. Phạm vi nhóm Nhị Hao và bảng hãm của nguồn này phải giữ riêng, không tự áp sang một Đại Hao có trạng thái thuộc bảng khác.", 262,
      ["Nguồn xét Đại/Tiểu Hao theo nhóm, điều kiện hãm và ngoại lệ Mão/Dậu; cần đối chiếu bảng riêng của tác giả."],
      ["Không đổi trạng thái snapshot để khớp sách; không gán các lời hao tiền, nợ nần hoặc nghiện cho người đọc.", "Không dùng làm phép phối hợp Liêm–Hao hoặc nguồn xác nhận đặc tính tài chính cá nhân."]);
  return [...items, ...paidTopicBooks(input, target)];
}
