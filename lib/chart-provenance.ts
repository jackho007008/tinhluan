import type { ChartSnapshot } from "./tuvi-engine";
import type { SheetEntry } from "./chart-sheet";

// Presentation projection only. A shared display name is not an entity identifier.
export function entryProvenance(snapshot: ChartSnapshot, entry: SheetEntry) {
  const tb = snapshot.chart.tanBien;
  const dependency = snapshot.versions.dependency;
  if (entry.kind === "decadal")
    return {
      layer: "moving" as const,
      source:
        "Sao lưu đại vận; quy ước bổ sung iztro@2.6.1; chart.tanBien.decadal",
    };
  if (entry.kind === "moving")
    return {
      layer: "moving" as const,
      source: `Sao lưu năm ${tb && "viewing" in tb ? (tb.viewing?.year ?? "chưa rõ") : "chưa rõ"}; chart.tanBien.viewing`,
    };
  if (!tb)
    return {
      layer: "unclassified" as const,
      source: `${dependency}; chưa có danh mục Tân Biên trong snapshot`,
    };
  const hasStarRecord = entry.paths.some((p) =>
    /\.(majorStars|minorStars|adjectiveStars)\.\d+$/.test(p),
  );
  const supplemental =
    hasStarRecord && tb.supplementalStars.includes(entry.name);
  const ringOnly = entry.paths.every((p) => p.endsWith(".jiangqian12"));
  if (supplemental || ringOnly)
    return {
      layer: "extended" as const,
      source: `${dependency}; ${ringOnly ? "vòng Tướng trước (jiangqian12), tính theo năm sinh" : "sao bổ sung trong chart.tanBien.supplementalStars"}; ngoài danh mục Tân Biên đã đặc tả`,
    };
  const trace = tb.trace.find((t) => t.id === `star.${entry.name}`);
  return {
    layer: "natal" as const,
    source:
      trace?.source ??
      "Danh mục Tân Biên; đối chiếu chart.tanBien.trace (chính tinh, Tứ Hóa hoặc vòng Bác Sỹ/Thái Tuế)",
  };
}

export function sheetDisplayName(snapshot: ChartSnapshot, name: string) {
  // §8.19 uses Thai Phụ; the snapshot retains iztro's taifu / 台辅 label Đài Phụ.
  return snapshot.chart.tanBien && name === "Đài Phụ" ? "Thai Phụ" : name;
}
