import type { ReportData } from "../reports";
import type { Palace } from "../tuvi-engine";
export type ReadingTopic = {
  id: "overview" | "career";
  title: string;
  summary: string;
  positions: string[];
  stars: {
    name: string;
    state: string | null;
    transformation: string | null;
  }[];
  majorStarsStatus: "present" | "empty" | "missing";
  claims: string[];
  basis: string;
  conditions: string;
  limits: string;
};
export type CustomerReport = {
  title: string;
  notice: string;
  topics: ReadingTopic[];
  unsupported: string[];
  method: { label: string; url: string; calendar: string };
  scope: { groups: string[]; year: number | null };
};
export function customerReport(report: ReportData): CustomerReport {
  const palaces = report.snapshot.chart.palaces;
  const unique = (name: string): Palace | undefined => {
    const a = palaces.filter((p) => p.name === name);
    return a.length === 1 ? a[0] : undefined;
  };
  const bodies = palaces.filter((p) => p.isBodyPalace),
    body = bodies.length === 1 ? bodies[0] : undefined;
  const defs = [
    {
      id: "overview" as const,
      group: "Tổng quan",
      title: "Tổng quan",
      palace: unique("Mệnh"),
    },
    {
      id: "career" as const,
      group: "Sự nghiệp & tài lộc",
      title: "Sự nghiệp",
      palace: unique("Quan Lộc"),
    },
  ];
  const topics = defs
    .filter((d) => report.scope.groups.includes(d.group) && d.palace)
    .map((d) => {
      const p = d.palace!;
      const names = Array.isArray(p.majorStars)
        ? p.majorStars.map((s) => s.name)
        : [];
      const positions = [
        `Cung ${p.name} tại ${p.earthlyBranch}.`,
        ...(d.id === "overview" && body
          ? [
              `Thân cư ${body.name}; cung ${body.name} tại ${body.earthlyBranch}.`,
            ]
          : []),
      ];
      return {
        majorStarsStatus: !Array.isArray(p.majorStars)
          ? ("missing" as const)
          : p.majorStars.length === 0
            ? ("empty" as const)
            : ("present" as const),
        id: d.id,
        title: d.title,
        summary:
          d.id === "overview"
            ? `Mệnh tại ${p.earthlyBranch}${names.length ? `, ghi nhận ${names.join(" và ")}` : ""}.${body ? ` Thân cư ${body.name}.` : ""}`
            : `Cung Quan Lộc tại ${p.earthlyBranch}${names.length ? `, ghi nhận ${names.join(" và ")}` : ""}.${body?.name === "Quan Lộc" ? " Đây cũng là cung an Thân." : ""}`,
        positions,
        stars: (p.majorStars || []).map((s) => ({
          name: s.name,
          state: s.brightness || null,
          transformation: s.mutagen ? `Hóa ${s.mutagen}` : null,
        })),
        claims:
          report.interpretation?.topics
            .find((t) => t.id === d.id)
            ?.claims.map((c) => c.text) || [],
        basis: `Đối chiếu vị trí cung ${p.name}, danh sách chính tinh và các nhãn trạng thái trên lá số đã lập${d.id === "overview" ? " cùng vị trí an Thân" : ""}.`,
        conditions:
          "Các dữ kiện được đọc theo lịch và giờ đã xác nhận khi lập lá số. Miếu, Vượng, Đắc và các nhãn tương tự là cách phân loại truyền thống, không phải điểm số.",
        limits:
          d.id === "career"
            ? "Một cung riêng lẻ không đủ để xác định nghề nghiệp, thu nhập hoặc thời điểm thành công."
            : "Vị trí Mệnh, Thân và từng sao riêng lẻ không đủ để kết luận toàn bộ tính cách hay cuộc đời.",
      };
    });
  const available = defs.filter((d) => d.palace).map((d) => d.group);
  return {
    title: report.title,
    notice:
      "Đây là bản dữ kiện lá số, chưa phải luận giải chuyên môn được duyệt. Phần tính toán và cách diễn giải cuộc đời là hai việc khác nhau; các vị trí sao hiện chưa được chuyên gia độc lập xác nhận.",
    topics,
    unsupported: [
      ...report.scope.groups.filter((g) => !available.includes(g)),
      ...(report.scope.groups.includes("Sự nghiệp & tài lộc")
        ? ["Luận giải tài lộc"]
        : []),
      "Luận giải chuyên môn",
      "Chỉ số biểu đồ và vận theo năm/ngày",
    ],
    method: {
      label: "Phương pháp lập lá số đang sử dụng",
      url: "https://docs.iztro.com/quick-start",
      calendar:
        report.snapshot.profile.id === "cn-reference"
          ? "Lịch Trung Quốc tham chiếu; quy ước đổi ngày từ 23 giờ."
          : "Lịch âm dương UTC+7; đổi ngày lúc 00 giờ, tháng nhuận giữ nguyên số tháng khi an sao.",
    },
    scope: { groups: [...report.scope.groups], year: report.scope.year },
  };
}
