import type { ChartSnapshot } from "./tuvi-engine";

/** Evidence annotation only. Never recomputes or modifies saved chart.soul/body. */
export const RULER_CONVENTION = {
  id: "supplemental-palace-soul-year-body-1.0.0",
  name: "Mệnh chủ theo chi cung Mệnh; Thân chủ theo chi năm sinh",
  implementation: "iztro@2.6.1 / algorithm=default",
  sources: [
    "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷二",
    "https://vocus.cc/article/66bae062fd89780001fcf0d5",
  ],
  status:
    "Quy ước bổ sung, không gán cho Tân Biên. Chưa tìm thấy bảng quy định hai chủ tinh trong PDF Tân Biên đã kiểm tra.",
} as const;

export function rulerConvention(snapshot: ChartSnapshot) {
  if (snapshot.chart.rulers?.method === 'birth-year-branch') return {
    id: snapshot.chart.rulers.version,
    name: snapshot.chart.rulers.body ? 'Mệnh chủ và Thân chủ được tra theo địa chi năm sinh.' : 'Mệnh chủ được tra theo địa chi năm sinh.',
    implementation: snapshot.chart.rulers.body ? 'Quy ước bổ sung theo đoạn trích Quản Xuân Thịnh' : 'Product adapter / iztro@2.6.1 table',
    sources: snapshot.chart.rulers.body ? ['Đoạn trích do chủ dự án cung cấp; chưa đối chiếu bản gốc Quản Xuân Thịnh'] : RULER_CONVENTION.sources,
    status: snapshot.chart.rulers.source,
  };
  // Do not retrospectively assign this convention to unknown engines/profiles.
  return snapshot.normalized.profile === "tanbien-vn-trial-v2" &&
    ["tanbien-trial-0.2.0", "tanbien-trial-0.3.0"].includes(
      snapshot.versions.engine,
    ) &&
    snapshot.versions.dependency === "iztro@2.6.1" &&
    "bridge" in snapshot.versions &&
    snapshot.versions.bridge === "iztro-vn-bridge-1.0.0"
    ? RULER_CONVENTION
    : undefined;
}

