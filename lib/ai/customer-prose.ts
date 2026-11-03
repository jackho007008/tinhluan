/** Customer prose only. References and applicability stay in their structured fields. */
export const CUSTOMER_PROSE_INSTRUCTIONS = `LỜI VĂN DÀNH CHO NGƯỜI CHƯA HỌC TỬ VI
Viết để người chưa biết Tử Vi vẫn hiểu được ý chính. Dùng từ quen thuộc, câu rõ nghĩa, đoạn ngắn vừa đủ; mỗi đoạn giải thích một ý. Nêu điều muốn nói trước rồi giải thích vì sao. Không viết như báo cáo khảo cứu hoặc hướng dẫn cách đọc tài liệu. Không ép số câu hoặc số từ để làm bài dài.
Không nhắc tên sách, tác giả, website, trường phái hay nguồn tham khảo trong title, text, coverageNote hoặc limitations. Không viết “theo sách”, “tác giả cho rằng”, “nguồn này”, không trích số trang hay đường dẫn. Tên sách/tác giả và căn cứ vẫn nằm trong knowledgeIds, factIds, basis và dữ liệu tham chiếu để xem riêng ở Xem căn cứ; không xóa căn cứ khỏi dữ liệu.
Phân biệt facts, source-interpretation và ai-synthesis bằng các trường dữ liệu ấy và bằng cách diễn đạt đúng mức độ, không kể chuyện tra nguồn trong bài. Không biến câu khẳng định mạnh trong sách thành lời hứa cho khách; cũng không chép lại câu ấy dưới tên tác giả để né giới hạn. Khi các cách luận khác nhau, chỉ trình bày phần đủ căn cứ và giới hạn thực sự cần thiết, không tự chọn bên thắng.
Gọi người đọc là “bạn” khi cần, tránh “mệnh tạo”, “mệnh đề”, “nhánh nguồn”, “tiền đề”, “hình học cung”, “phạm vi nguồn”. Không mở mọi đoạn bằng danh sách sao. Giữ tên sao và cung khi giúp hiểu lập luận; thuật ngữ như độc thủ, đồng cung, tam phương hoặc hội chiếu nếu cần dùng thì giải thích ngắn bằng tiếng Việt ngay lần đầu. Không đổi tên sao/trạng thái/cung vị để làm văn dễ đọc hơn.
Dùng cách nói cụ thể: “kiếm tiền”, “giữ lại tiền”, “chi cho công việc/sinh hoạt” thay cho việc lặp “tạo nguồn/nguồn lực”; “cách làm việc”, “cách hai người trao đổi” khi đúng ý. Không coi đây là phép thay từ máy móc; phải giữ đúng chủ thể, lượng từ, phủ định, thời gian và ngoại lệ. Không làm đơn giản bằng cách bỏ sắc thái “phần nhiều” hay “từng trợ giúp qua một giai đoạn”.
Liên hệ các cung bằng câu giải thích có ích, nói đúng tên cung gốc khi dùng ngữ cảnh nhưng không bắt người đọc hiểu toàn bộ kỹ thuật an sao. Không tự thêm quy tắc, sự kiện, lời khuyên chung hoặc ví dụ tưởng tượng về cuộc đời người đọc. Giữ giới hạn an toàn/y khoa và mức độ có thể của nhận định. Rà lại toàn bài: có đọc hiểu ý chính mà không biết sách nào hay thuật ngữ nào không?`;

const normalize = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/\p{M}|\p{Cf}/gu, "")
    .replace(/đ/giu, "d")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const sourceNames = [
  "Tử Vi Đẩu Số Tân Biên",
  "Tân Biên",
  "Tử Vi Tổng Hợp",
  "Tử Vi Hàm Số",
  "Trung Châu Tử Vi Đẩu Số",
  "Trung Châu",
  "Tứ Hóa Phái",
  "Thái Vi Phú",
  "Nguyễn Phát Lộc",
  "Nguyễn Anh Vũ",
  "Vân Đằng",
  "Thái Thứ Lang",
  "Vương Đình Chi",
  "Vương Đình Chí",
  "Dương Lương",
  "楊禎祥",
  "王亭之",
  "Học Viện Lý Số",
].map(normalize);
/** Deliberately narrow: a source-name/citation check, not a readability or truth score.
 * Never called to transform an old reading or to inspect its disclosure metadata. */
export function validateCustomerProse(
  texts: string[],
  referenceTitles: string[] = [],
) {
  const dynamic = referenceTitles
    .map(normalize)
    .filter(
      (t) =>
        t.length >= 16 && t.split(" ").length >= 3 && !t.startsWith("sao "),
    );
  const names = [...sourceNames, ...dynamic];
  for (const field of texts) {
    const text = normalize(field),
      padded = " " + text + " ";
    if (
      // Accent folding makes the ordinary phrase “có học” collide with this
      // short source name. Match its actual spelling instead.
      /\bcổ\s+học\b/iu.test(field.normalize("NFC").replace(/\p{Cf}/gu, "")) ||
      names.some((name) =>
        /[\u3400-\u9fff]/u.test(name)
          ? text.includes(name)
          : padded.includes(" " + name + " "),
      ) ||
      /https?:\/\/|www\./iu.test(field) ||
      /\b(?:theo (?:sach|tac gia|tai lieu|tu lieu)|loi (?:sach|nguon)|nguon (?:nay|tren|duoc dan)|tac gia (?:cho rang|mo ta|nhan dinh))\b/u.test(
        text,
      ) ||
      /\b(?:menh tao|nhanh nguon|pham vi nguon|hinh hoc cung)\b/u.test(text)
    )
      throw Error("AI_CUSTOMER_PROSE");
  }
}
