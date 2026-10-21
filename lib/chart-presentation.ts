import type { ChartSnapshot, Palace, Star } from "./tuvi-engine";
import {
  tanBienTable,
  tanBienLifeTables,
} from "./interpretation-rules/tanbien-source";
export type ChartContext = "engine" | "tanbien";
export const CHART_PRESENTATION_VERSION = "1.2.0";
// Only a brightness field from the pinned dependency; never replace prose or hạn periods.
export function engineBrightness(
  value: string | undefined,
  dependency: string,
) {
  return dependency === "iztro@2.6.1" && value === "Hạn"
    ? "Hãm"
    : value || "Chưa ghi nhận trạng thái";
}
export function starState(
  star: Star,
  branch: string,
  snapshot: ChartSnapshot,
  context: ChartContext,
) {
  const table =
    star.name === "Vũ Khúc"
      ? { ...tanBienTable, star: "Vũ Khúc", locator: tanBienTable.source }
      : Object.values(tanBienLifeTables)
          .filter((t) => t.star === star.name)
          .map((t) => ({
            ...t,
            locator: `Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, PDF ${t.pdfPage} / trang in ${t.printedPage}, mục ${t.section}`,
          }))[0];
  const savedState = snapshot.chart.tanBien?.states[star.name + "@" + branch];
  const sourceState = snapshot.chart.tanBien
    ? savedState?.value
    : table && Object.hasOwn(table.states, branch)
      ? table.states[branch]
      : undefined;
  return {
    display:
      context === "tanbien"
        ? sourceState || "Chưa có đối chiếu trạng thái theo Tân Biên"
        : engineBrightness(star.brightness, snapshot.versions.dependency),
    raw:
      (snapshot.chart.tanBien
        ? (star as Star & { originalBrightness?: string }).originalBrightness
        : star.brightness) || "Không có trong snapshot",
    sourceState: sourceState || "Chưa có đối chiếu trạng thái theo Tân Biên",
    source:
      savedState?.source ||
      table?.locator ||
      "Chưa có bảng nguồn trong registry",
    version:
      savedState?.version ||
      (table ? `${table.id}@${table.version}` : "chưa có"),
    engineVersion: snapshot.versions.dependency,
  };
}
export function recordedLayers(p: Palace) {
  const raw = p as Palace & Record<string, unknown>;
  return ["changsheng12", "boshi12", "suiqian12", "jiangqian12"].map(
    (key, i) => ({
      key,
      label: [
        "Vòng Trường Sinh",
        "Vòng Bác Sỹ",
        "Vòng Tuế trước (theo năm sinh)",
        "Vòng Tướng trước (theo năm sinh)",
      ][i],
      value:
        typeof raw[key] === "string" && raw[key]
          ? (raw[key] as string)
          : "Không có trong snapshot",
    }),
  );
}
export function disputedStars(snapshot: ChartSnapshot) {
  return snapshot.chart.palaces.flatMap((p) =>
    [
      ...(p.majorStars || []),
      ...(p.minorStars || []),
      ...(p.adjectiveStars || []),
    ]
      .filter((s) => s.name === "Linh Tinh" || s.name === "Thiên Quý")
      .map((s) => `${s.name} tại ${p.name} (${p.earthlyBranch})`),
  );
}

export function starScope(star: Star) {
  const scope = (star as Star & { scope?: string }).scope;
  return scope === "origin"
    ? "bản mệnh"
    : scope
      ? `lớp ${scope} (không đồng nhất bản mệnh)`
      : "chưa ghi lớp áp dụng";
}
export function palaceDisplayData(p: Palace, index: number) {
  return (["majorStars", "minorStars", "adjectiveStars"] as const).map(
    (key, i) => ({
      key,
      label: ["Chính tinh", "Phụ tinh", "Tạp diệu"][i],
      status: !Array.isArray(p[key])
        ? ("missing" as const)
        : p[key].length
          ? ("recorded" as const)
          : ("empty" as const),
      stars: Array.isArray(p[key])
        ? p[key].map((star, j) => ({
            star,
            path: `chart.palaces.${index}.${key}.${j}`,
            scope: starScope(star),
          }))
        : [],
    }),
  );
}
export function periodDisplay(p: Palace) {
  const period = p.decadal as
    | (Palace["decadal"] & { heavenlyStem?: string; earthlyBranch?: string })
    | undefined;
  return [
    {
      key: "decadal-branches",
      label: "Can chi đại vận đã lưu",
      value:
        period?.heavenlyStem && period?.earthlyBranch
          ? `${period.heavenlyStem} ${period.earthlyBranch}`
          : "Không có trong snapshot",
    },
    {
      key: "decadal",
      label: "Đại vận (tuổi mụ)",
      value: Array.isArray(p.decadal?.range)
        ? p.decadal.range.length
          ? p.decadal.range.join("–")
          : "Danh sách đã lưu rỗng"
        : "Không có trong snapshot",
    },
    {
      key: "ages",
      label: "Tiểu hạn tại cung (tuổi mụ)",
      value: Array.isArray(p.ages)
        ? p.ages.length
          ? p.ages.join(", ")
          : "Danh sách đã lưu rỗng"
        : "Không có trong snapshot",
    },
  ];
}
