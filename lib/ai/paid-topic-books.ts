import type { Knowledge, MenhInput } from "./contract";

/** Narrow source extracts from the already processed Trung Châu books.
 * The caller supplies receipt-verified engine facts, never user-written facts.
 * No phi-hóa calculation, star relocation or judgement about real people. */
export function paidTopicBooks(input: MenhInput, target: string): Knowledge[] {
  const natalAt = (kind: string, palace = target) =>
    input.facts.some(
      (f) => f.id === `natal.${kind}` && f.text.includes(`tại ${palace} (`),
    );
  const items: Knowledge[] = [];
  const add = (
    id: string,
    title: string,
    text: string,
    part: number,
    location: string,
    conditions: string[],
    limits: string[],
    anchorFactIds: string[],
  ) => {
    items.push({
      id: `paid-book.${id}`,
      title,
      text,
      group: "B",
      application: "direct",
      subjectPalaces: [target],
      selection: "matched-snapshot",
      conditions,
      limits,
      anchorFactIds,
      references: [
        {
          title: `Nguyễn Anh Vũ — Trung Châu Tử Vi Đẩu Số, Tứ Hóa Phái, phần ${part}`,
          location,
        },
      ],
      provenance: {
        ruleIds: [],
        ruleStatuses: [],
        sourceVersion: "paid-topic-books-1.1.0",
        certification: "editorial-reference-not-expert-approved",
      },
    });
  };
  if (target === "Nô Bộc" && natalAt("Lộc"))
    add(
      "thp1-128-no-loc",
      "Hóa Lộc năm sinh tại Nô: kỳ vọng trong giao du",
      "Trong phần Hóa Lộc năm sinh ở Nô Bộc, nguồn mô tả sự bày tỏ tình cảm và kỳ vọng hướng vào bạn bè: mệnh tạo đối đãi có tình và có thể đơn phương mong người khác đáp lại như mình. Nguồn cũng nói việc ký thác hy vọng vào bạn bè; muốn kết luận có quý nhân nâng đỡ còn cần phi hóa Nô có lợi. Chính nguồn phân biệt thiên về tình cảm với có chân tình: phải xét phi hóa mới định được sự chân tình.",
      1,
      "PDF128–130, §4.2.8, đặc biệt các ý(2),(3),(6),(12)",
      [
        "Hóa Lộc năm sinh tọa Nô Bộc đã được xác minh; không phải Lộc Tồn, tự Lộc hoặc can cung phi Lộc.",
        "Chỉ lấy phương diện kỳ vọng/đối đãi của mệnh tạo, không khẳng định đặc tính thực của bạn bè.",
      ],
      [
        "Nguồn yêu cầu phối hợp sao, cung và các hóa; không lấy thùy tượng rời rạc để phán toàn cung.",
        "Chưa có phi hóa phù hợp thì không kết luận được giúp đỡ, chân tình, lợi nhuận hợp tác hoặc quý nhân. Không tự tính phi hóa.",
        "Không chuyển các lời số lượng bạn bè, tai họa, bệnh hoặc các dự báo khác trong chương thành sự kiện của khách hàng.",
      ],
      ["natal.Lộc"],
    );
  const stars = input.facts.filter(
    (f) =>
      f.provenance?.palace === target &&
      f.provenance.field === "majorStars" &&
      f.provenance.relation === "target" &&
      f.provenance.verification === "source-traced",
  );
  if (
    target === "Phu Thê" &&
    ["Thất Sát", "Tham Lang", "Phá Quân"].some((name) =>
      stars.some((f) => f.text.includes(`: ${name};`)),
    )
  )
    add(
      "thp2-178-phu-sat-pha-tham",
      "Sát/Tham/Phá tại Phu: nét xung động trong tương tác",
      "Mục Các kiểu tình yêu trong cung Phu Thê nêu một nhánh khi Phu có Thất Sát, Tham Lang hoặc Phá Quân. Trong cách mô tả đơn lẻ này, tác giả dùng lượng từ phần nhiều, nhấn vào tính mạnh, chủ quan và sự xung động của người có cấu trúc ấy khi theo đuổi điều mình cho là tốt đẹp; tác giả đồng thời lưu ý quan hệ cần nhiều tâm tư để duy trì. Không đổi phần nhiều thành mọi người. Chủ đề là quan hệ tác động giữa mệnh tạo và người phối ngẫu, không chỉ cá tính của người kia.",
      2,
      "PDF173 và178, §2.3.7 mở đầu và mục(4)",
      [
        "Ít nhất một trong Thất Sát/Tham Lang/Phá Quân tọa Phu Thê; không lấy sao hội chiếu thay tọa thủ.",
        "Đây là gợi ý đơn lẻ chưa tính phụ/hung tinh đồng cung, can cung phi hóa và tự hóa. Chưa tính không có nghĩa phải vắng những yếu tố ấy.",
      ],
      [
        "Không suy người phối ngẫu thực sự chủ quan, không dự báo cưới nhanh, nguội lạnh, chia tay hoặc kết quả hôn nhân; các dự báo ấy trong nguồn nằm ngoài đầu ra được dùng.",
        "Không xác nhận phép phối hợp Phá Quân–Đà La–Hỏa Tinh. Không dùng Hóa Khoa xóa sát tinh hoặc bỏ Tuần.",
        "Giữ riêng quan điểm Tứ Hóa phái; không hợp nhất với Tân Biên thành một kết luận chắc chắn hoặc biến nguồn thành lời khuyên chấp nhận bạo hành.",
      ],
      stars
        .filter((f) =>
          ["Thất Sát", "Tham Lang", "Phá Quân"].some((name) =>
            f.text.includes(`: ${name};`),
          ),
        )
        .map((f) => f.id),
    );
  if (target === "Tử Nữ" && natalAt("Lộc", "Nô Bộc"))
    add(
      "thp1-130-tu-from-no-loc",
      "Quan hệ với con theo cách đọc Lộc tại Nô của Khâm Thiên",
      "Trong mục Hóa Lộc năm sinh ở Nô Bộc, ý(12) nêu: khi đọc Nô như cung biểu hiện của Tử Nữ, có thể luận con cái hòa hợp với mệnh tạo. Đây là một chú giải cục bộ về đối đãi theo mô hình cung chức của nguồn; điều kiện nằm ở Nô nhưng chủ đề nhận lời là quan hệ với con. Phần hợp tác làm ăn ở câu tiếp theo là chủ đề khác và còn yêu cầu phối hợp Nô với tam phương để xét thu lợi.",
      1,
      "PDF130, §4.2.8, ý(12); đối chiếu lời giới hạn ở PDF128–129",
      [
        "Hóa Lộc năm sinh tại Nô Bộc đã xác minh; không phải Lộc tại Tử, Lộc Tồn, tự Lộc hoặc phi Lộc.",
        "Chỉ dùng khi luận quan hệ với con theo cách nguồn đọc Nô như cung biểu hiện của Tử; đây là phương pháp Khâm Thiên, không đổi hình học hoặc sao đã an.",
      ],
      [
        "Giữ chữ có thể và phạm vi cục bộ. Không xác nhận người đọc đã có con hoặc quan hệ gia đình thực tế hòa hợp; còn phải phối hợp sao, cung và các hóa.",
        "Không chuyển Hóa Lộc từ Nô sang Tử, không lấy câu này giải nghĩa chính tinh xung chiếu của Tử VCD hoặc giải hết các ngoại lệ của Tân Biên.",
        "Không suy số con, sinh sản, giới tính, học vấn, tài sản hoặc lợi nhuận hợp tác từ lời đối đãi này.",
      ],
      ["natal.Lộc"],
    );
  if (target === "Tử Nữ" && natalAt("Khoa"))
    add(
      "thp2-196-tu-khoa",
      "Hóa Khoa năm sinh tại Tử: phương diện học hỏi và ứng xử",
      "Trong mục Ý tượng cơ bản của Tứ Hóa năm sinh ở Tử Nữ, nguồn gắn Hóa Khoa với các nét nho nhã, biết nghe lời và hiếu học của con cái theo biểu tượng truyền thống. Đây là lời cục bộ về phương diện học hỏi và ứng xử, không phải quan sát hoặc đánh giá một trẻ thực tế.",
      2,
      "PDF196–197, §2.4, Ý tượng cơ bản của Tứ Hóa năm sinh ở cung Tử Nữ, nhánh Hóa Khoa",
      [
        "Hóa Khoa năm sinh tọa Tử Nữ đã xác minh; không mượn Khoa ở đối cung, can cung hoặc tự Khoa.",
        "Chỉ lấy vế học hỏi/ứng xử; không dùng để xác nhận đã có con hoặc tính cách của một người con cụ thể.",
      ],
      [
        "Các vế số lượng con, hình thể, sinh sản hoặc đào hoa trong đoạn nguồn không được chuyển thành kết luận cá nhân.",
        "Không chẩn đoán trí tuệ, sức khỏe hoặc khả năng sinh sản; không hứa thành tích học tập.",
        "Không áp nhánh Khoa cho Tử vô chính diệu chỉ vì có Đào Hoa/Ân Quang; thiếu Khoa năm sinh thì nhánh này không phù hợp.",
      ],
      ["natal.Khoa"],
    );
  return items;
}
