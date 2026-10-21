import {emptyLifeFacts} from "../interpretation-rules/life-empty-facts";
import type { ChartSnapshot } from "../tuvi-engine";
import {
  palaceLocation,
  palaceStars,
  bodyLocation,
  uniquePalace,
} from "./tanbien-presentation";
export function lifeOverview(
  snapshot: ChartSnapshot,
  supported: string[],
  verified: boolean,
  hasEmptyLifeGloss = false,
  localTitles: string[] = [],
) {
  const p = uniquePalace(snapshot, "Mệnh");
  const valid =
    verified &&
    emptyLifeFacts(snapshot).some(f=>f.id==="fact.life-complete-major-count") &&
    !!p &&
    Array.isArray(p.p.majorStars) &&
    p.p.majorStars.every(
      (s) => s && typeof s.name === "string" && s.name.trim(),
    );
  const stars = valid
    ? p!.p.majorStars
        .filter(
          (s) =>
            !(s as { scope?: string }).scope ||
            (s as { scope?: string }).scope === "origin",
        )
        .map((s) => s.name)
    : null;
  const has = (...names: string[]) =>
    !!stars && names.every((n) => stars.includes(n));
  const facts = [
    palaceLocation(snapshot, "Mệnh"),
    valid
      ? { ...palaceStars(snapshot, "Mệnh"), text: `Chính tinh tại Mệnh: ${stars!.join(", ")}.` }
      : {
          text: "Chưa có danh sách chính tinh Mệnh được xác nhận đầy đủ; chưa xác định cung có hay không có chính tinh.",
          kind: "snapshot" as const,
          paths: p ? [`chart.palaces.${p.i}.majorStars`] : [],
        },
    bodyLocation(snapshot),
  ];
  if (stars?.length === 0)
    facts[1] = {
      ...facts[1],
      text: "Cung Mệnh không có chính tinh tọa thủ trong danh sách đầy đủ đã lưu. Điều này không tự có nghĩa lá số xấu hay người đọc thiếu phẩm chất.",
    };
  const gaps: { text: string; source: string; cause: string }[] = [];
  if (has("Vũ Khúc", "Thiên Tướng"))
    gaps.push({
      text: "Vũ Khúc–Thiên Tướng: phần đọc hiện giữ riêng hai chú giải. Những đoạn đã đối chiếu chưa đủ điều kiện để tạo lời luận riêng cho cặp này tại Mệnh.",
      source: "Tân Biên, trang ebook/PDF 65–68 và 90–92.",
      cause: "Chưa có đặc tả tổ hợp có nguồn riêng.",
    });
  else if (has("Vũ Khúc", "Thiên Phủ"))
    gaps.push({
      text: "Vũ Khúc–Thiên Phủ: đoạn riêng tại Tý có phân biệt can sinh; không áp ngoại lệ Canh/Nhâm cho can khác hoặc vị trí khác. Chú giải nhánh này chưa tổng hợp toàn bộ sao chiếu.",
      source:
        "Tân Biên, trang ebook/PDF 76–78; ảnh trang 77 có phần đầu đoạn Giáp/Đinh đứt nghĩa.",
      cause:
        "Mâu thuẫn văn bản ở nhánh khác; chưa có quy tắc phối hợp toàn cung.",
    });
  else if (stars && stars.length > 1)
    gaps.push({
      text: "Các chú giải theo nhánh được giữ riêng; chưa có quy tắc hợp nhất tất cả sao tại Mệnh thành một kết luận chung.",
      source: "Phạm vi các rule khớp được ghi ở căn cứ từng đoạn.",
      cause: "Chưa có quy tắc tổng hợp.",
    });
  else if (stars?.length === 0)
    gaps.push({
      text: hasEmptyLifeGloss ? "Đã có chú giải thế Nhật–Nguyệt chiếu Mệnh; chưa tổng hợp các sao phụ và điều chỉnh thành lời luận toàn cung Mệnh." : "Chưa có chú giải sao chiếu theo các nhánh Tân Biên đang hỗ trợ cho Mệnh không chính tinh ở trường hợp này. Giới hạn này không thay thế các phép xét ngũ hành riêng được trình bày ở trên.",
      source:
        "Tân Biên, trang ebook/PDF 53–54: còn yêu cầu cứu giải, hội chiếu và án ngữ.",
      cause: "Thiếu đặc tả điều kiện trong nguồn.",
    });
  else if (!valid)
    gaps.push({
      text: "Cần danh sách chính tinh Mệnh đầy đủ trước khi kiểm tra tổ hợp; không coi dữ liệu thiếu là sao vắng mặt.",
      source: "Kiểm tra hợp đồng dữ liệu hồ sơ.",
      cause: "Thiếu dữ kiện.",
    });
  const bodyNote =
    "Vị trí Thân được trình bày như dữ kiện. Chưa suy tính cách, sự nghiệp, tài chính hay hậu vận chỉ từ cung Thân cư.";
  return {
    version: "1.1.0",
    facts,
    scope: localTitles.length
      ? `Phần Mệnh hiện có chú giải về: ${localTitles.join("; ")}. Các ý được giữ riêng, chưa hợp nhất thành kết luận về con người.`
      : "Chưa có diễn giải Mệnh khớp trong phạm vi hiện có; vẫn có thể đọc các dữ kiện của Mệnh và Thân.",
    bodyNote,
    gaps,
    bodySource:
      "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, trang ebook/PDF 7 (an Thân), 52–55 (Mệnh–Thân). Các ý Thân cư kèm điều kiện sao/hội hợp/án ngữ; chưa triển khai suy luận từ riêng vị trí.",
  };
}
