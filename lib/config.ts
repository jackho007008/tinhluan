export const brand = {
  name: "Tử vi",
  tagline: "Tính toán theo quy tắc. Diễn giải có căn cứ.",
  colors: {
    primary: "#B4232D",
    hover: "#941C25",
    background: "#FFFFFF",
    surface: "#FFF4F4",
    text: "#202124",
    border: "#E8E3E3",
  },
};
export const groups = [
  "Tổng quan",
  "Tình duyên",
  "Sự nghiệp & tài lộc",
  "Vận hạn",
  "Hôn nhân & gia đạo",
  "Sức khỏe",
] as const;
export const packages = [
  {
    id: "topic",
    name: "Một chủ đề",
    price: 99000,
    description: "Đi sâu vào một điều bạn quan tâm",
    groups: 1,
    scope: "Dữ kiện lá số gốc · một chủ đề",
    accessDays: 30,
  },
  {
    id: "complete",
    name: "Toàn diện",
    price: 199000,
    description: "Khám phá sáu khía cạnh cuộc sống",
    groups: 6,
    scope: "Dữ kiện lá số gốc · sáu chủ đề",
    accessDays: 90,
  },
  {
    id: "year",
    name: "Toàn diện & năm",
    price: 299000,
    description: "Sáu chủ đề và một năm được chọn",
    groups: 6,
    scope: "Lá số gốc · một năm được chọn",
    accessDays: 90,
  },
] as const;
export const money = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);
