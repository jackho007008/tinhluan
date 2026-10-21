import type { ChartSnapshot } from "../tuvi-engine";
import {
  palaceDisplayData,
  recordedLayers,
  periodDisplay,
} from "../chart-presentation";
export function chartInventory(snapshot: ChartSnapshot) {
  return snapshot.chart.palaces.map((p, i) => {
    const groups = palaceDisplayData(p, i);
    const list = groups
      .map(
        (g) =>
          `${g.label}: ${g.status === "missing" ? "không có trong snapshot" : g.status === "empty" ? "danh sách đã lưu rỗng" : g.stars.map((s) => s.star.name + (s.star.mutagen ? ` → Hóa ${s.star.mutagen} (${s.scope})` : "")).join(", ")}`,
      )
      .join("; ");
    const layers = [...recordedLayers(p), ...periodDisplay(p)];
    return {
      palace: `${p.name} (${p.earthlyBranch})`,
      stored:
        list + "; " + layers.map((x) => x.label + ": " + x.value).join("; "),
      previousFrame:
        "Chính tinh, trạng thái theo bảng đang chọn; mốc bắt đầu đại vận",
      previousDetails:
        "Phụ tinh/tạp diệu, Tứ Hóa cạnh sao, nhãn Tuần/Triệt nếu ghi trong danh sách, bốn vòng và range/ages",
      missing: [
        ...groups.filter((g) => g.status === "missing").map((g) => g.label),
        ...layers
          .filter((x) => x.value === "Không có trong snapshot")
          .map((x) => x.label),
        "Không có lớp sao lưu theo năm xem; không có hình học phạm vi án ngữ hai cung",
      ].join("; "),
    };
  });
}
