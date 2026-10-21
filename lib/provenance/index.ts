import { createHash } from "node:crypto";
export const versions = {
  engine: "reference-adapter-0.1.0",
  dependency: "iztro@2.6.1",
  dependencies: {
    iztro: "2.6.1",
    "lunar-lite": "0.2.8",
    "lunar-typescript": "1.8.6",
    dayjs: "1.11.23",
  },
  rules: "facts-0.1.0",
  scoring: "unavailable-0.1.0",
  narration: "template-0.1.0",
};
export function resultId(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
export const profile = {
  id: "cn-reference",
  system: "Tử vi Đẩu số — iztro default",
  calendar: "Lịch Trung Quốc qua lunar-lite; KHÔNG phải lịch Việt Nam",
  timezone:
    "Giữ ngày và giờ dân sự đã khai báo tại Asia/Ho_Chi_Minh; không chuyển đổi sang UTC+8. Đây là quy ước tham chiếu, chưa hiệu chỉnh địa lý.",
  leapMonth:
    "fixLeap=true: nửa đầu tháng nhuận dùng tháng trước, nửa sau dùng tháng sau theo thư viện",
  dayBoundary: "23:00 là Tý muộn, dayDivide=forward; từ 00:00 là Tý sớm",
  yearBoundary: "yearDivide=normal; năm âm lịch theo upstream",
  age: "Tuổi mụ upstream, ageDivide=normal",
  stars:
    "algorithm=default; global config và ngôn ngữ cô lập trong tiến trình riêng cho mỗi yêu cầu",
  validationStatus: "software-only",
  sources: [
    "https://docs.iztro.com/quick-start",
    "https://github.com/SylarLong/iztro/tree/v2.6.1",
  ],
};

export const vietnameseProfile = {
  id: "vn-utc7-midnight-v1",
  system: "Tử vi Đẩu số — iztro default, cầu nối lịch UTC+7",
  calendar:
    "Âm dương lịch Việt Nam theo quy ước thiên văn UTC+7; 1976–2050, loại ngày sát ranh giới chưa xác minh",
  timezone:
    "UTC+7 cố định; giờ dân sự Asia/Ho_Chi_Minh. Không hiệu chỉnh lịch sử hoặc giờ mặt trời.",
  leapMonth:
    "Tháng không trung khí đầu tiên sau tháng 11 trong chu kỳ 13 tháng là nhuận; an sao lặp số tháng suốt tháng nhuận (fixLeap=false).",
  dayBoundary:
    "00:00 đổi ngày; 23:00–00:59 là chi Tý nhưng 23:00 không đổi ngày âm",
  yearBoundary: "Mùng 1 tháng 1 âm lịch; không đổi năm tại Lập xuân",
  age: "Tuổi mụ normal của iztro; khoảng đại vận kỹ thuật, chưa kiểm duyệt chuyên môn",
  stars:
    "iztro 2.6.1 algorithm=default, dayDivide=current; thay toàn bộ lunar-lite trong tiến trình riêng; cấm lunar-typescript",
  validationStatus:
    "calendar-source-checked; stars-upstream-only; not-expert-reviewed",
  sources: [
    "https://www.xemamlich.uhm.vn/calrules_en.html",
    "https://github.com/cosinekitty/astronomy",
    "https://eclipse.gsfc.nasa.gov/phase/phase2001gmt.html",
    "https://github.com/SylarLong/iztro/tree/v2.6.1",
  ],
};
export const vietnameseVersions = {
  ...versions,
  engine: "vn-adapter-1.0.0",
  dependencies: { ...versions.dependencies, "astronomy-engine": "2.1.19" },
  calendar: "vn-astronomical-1.0.0",
  bridge: "iztro-vn-bridge-1.0.0",
};
