import { bookState } from "../tuvi-engine/tanbien";
import type { ChartSnapshot } from "../tuvi-engine";
/** Positional evidence only. Existing source-specific rules still call bookState.
 * Spec: docs/SATINH-STATES-1.0.0.md. Never read originalBrightness as fallback. */
export const SATINH_METHOD_VERSION = "satinh-interpretation-states-1.0.0";
export const SATINH_NAMES = [
  "Kình Dương",
  "Đà La",
  "Hỏa Tinh",
  "Linh Tinh",
  "Địa Không",
  "Địa Kiếp",
] as const;
const branches = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];
const sinh = ["Dần", "Thân", "Tỵ", "Hợi"],
  mo = ["Thìn", "Tuất", "Sửu", "Mùi"];
const tl = "Thiên Lương — Tử Vi Nghiệm Lý Toàn Thư (bản Scribd 298 trang)";
export function satinhState(name: string, branch: string) {
  const supported =
    (SATINH_NAMES as readonly string[]).includes(name) &&
    branches.includes(branch);
  const old = supported ? bookState(name, branch) : undefined;
  const evidence: {
    author: "Tân Biên" | "Thiên Lương";
    label: string;
    source: string;
    context: string;
  }[] = [];
  if (old?.value)
    evidence.push({
      author: "Tân Biên",
      label: old.value,
      source: old.source,
      context:
        name === "Đà La" || name === "Kình Dương"
          ? "PDF39 §3.14 chung Kình–Đà; ebook không có tiêu đề3.15 riêng"
          : "Đặc tính sao theo vị trí; không suy lời luận cá nhân",
    });
  let exact = old?.value,
    classification: "favorable-position" | "dim-position" | "unknown" = exact
      ? "favorable-position"
      : "unknown";
  let selectedSource = old?.value
    ? old.source
    : "Chưa xác định từ các đoạn đối chiếu Tân Biên PDF39–40 / Thiên Lương PDF51,60,138";
  let decision: "baseline" | "supplement" | "override" | "unknown" = exact
    ? "baseline"
    : "unknown";
  const tlKnown =
    supported &&
    (name === "Đà La"
      ? sinh.includes(branch)
      : name === "Kình Dương"
        ? mo.includes(branch)
        : ["Hỏa Tinh", "Linh Tinh"].includes(name)
          ? ["Dần", "Mão", "Thìn", "Tỵ", "Ngọ"].includes(branch)
          : sinh.includes(branch));
  if (tlKnown)
    evidence.push({
      author: "Thiên Lương",
      label: "Đắc",
      source: tl + ", PDF60",
      context:
        "Danh sách vị trí trong phần Lục Sát; lời luận đi kèm Mệnh/hạn có điều kiện riêng PDF61–62",
    });
  if (supported && name === "Đà La" && sinh.includes(branch)) {
    evidence.push(
      {
        author: "Thiên Lương",
        label: "Đắc",
        source: tl + ", PDF51",
        context: "Kết đoạn Thiên La–Địa Võng nêu tứ sinh/tứ mộ",
      },
      {
        author: "Thiên Lương",
        label: "Miếu",
        source: tl + ", PDF138",
        context:
          "Đoạn giáp Kình–Đà nhắc bảng vị trí; không áp lời giáp cho Quan",
      },
    );
    exact = undefined;
    classification = "favorable-position";
    decision = "supplement";
    selectedSource = tl + ", PDF51,60 (Đắc), PDF138 (Miếu)";
  }
  if (supported && name === "Đà La" && mo.includes(branch)) {
    evidence.push({
      author: "Thiên Lương",
      label: "Hãm",
      source: tl + ", PDF51",
      context: "Nêu trực tiếp hãm ở tứ mộ; không suy từ phần bù danh sách đắc",
    });
    exact = "Hãm";
    classification = "dim-position";
    decision = "override";
    selectedSource =
      tl + ", PDF51; ưu tiên khi xung đột trực tiếp với Tân Biên PDF39";
  }
  if (
    supported &&
    ["Hỏa Tinh", "Linh Tinh"].includes(name) &&
    ["Sửu", "Mùi"].includes(branch)
  ) {
    exact = "Hãm";
    classification = "dim-position";
    decision = "supplement";
    selectedSource =
      "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, PDF114 §4.2.21 Phú giải";
    evidence.push({
      author: "Tân Biên",
      label: "Hãm",
      source: selectedSource,
      context:
        "Đoạn Mệnh Sửu/Mùi ghi rõ ‘tuy hãm địa’; chỉ trích dữ kiện trạng thái vị trí, không chuyển lời luận tổ hợp Việt/Tham/Vũ/Kiếp sang Quan Lộc",
    });
  }
  return {
    name,
    branch,
    version: SATINH_METHOD_VERSION,
    classification,
    exact: exact ?? null,
    label:
      exact ??
      (classification === "favorable-position"
        ? "Thuận vị trí — Đắc/Miếu theo từng đoạn"
        : "Chưa xác định"),
    source: selectedSource,
    decision,
    directConflict: decision === "override",
    degreeUnresolved: classification === "favorable-position" && !exact,
    baseline: old
      ? { value: old.value ?? null, version: old.version, source: old.source }
      : null,
    evidence,
    limitation:
      "Chỉ là trạng thái vị trí; không tự kích hoạt §8.14, chọn nhóm Tử–Tướng hoặc suy kết quả công việc.",
  };
}
export function snapshotSatinhStates(snapshot: ChartSnapshot) {
  return snapshot.chart.palaces.flatMap((p, i) =>
    (["majorStars", "minorStars", "adjectiveStars"] as const).flatMap((f) =>
      (Array.isArray(p[f]) ? p[f] : []).flatMap((st, j) => {
        if (
          (st as { scope?: string }).scope !== "origin" ||
          !(SATINH_NAMES as readonly string[]).includes(st.name)
        )
          return [];
        const stored =
          snapshot.chart.tanBien?.states?.[`${st.name}@${p.earthlyBranch}`];
        return [
          {
            palace: p.name,
            branch: p.earthlyBranch,
            name: st.name,
            scope: "origin" as const,
            path: `chart.palaces.${i}.${f}.${j}`,
            saved: {
              brightness: st.brightness ?? null,
              sourceState: stored ?? null,
            },
            selected: satinhState(st.name, p.earthlyBranch),
          },
        ];
      }),
    ),
  );
}
