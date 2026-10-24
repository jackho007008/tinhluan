import type { ChartSnapshot } from "../tuvi-engine";
import type { DerivedFact } from "./derived";
import { principalIntegrity } from "../tuvi-engine/chart-integrity";
import { voidMembership } from "../internal-review/career-definitions";
import { ruleSchema, readPath } from "./schema";
export const VTTL_DIEN_PHU = "vttl.dien-phu-hoi-scale";
export const VTTL_DIEN_PHU_FACT = "fact.dien-vttl-phu-hoi-scale";
export const VTTL_DIEN_PHU_METHOD = "vttl-natal-dien-1.0.0";
export const VTTL_DIEN_PHU_COPY =
  "Nhà đất của bạn được mô tả theo khuynh hướng có nhiều đất đai, vườn ruộng. Lời luận này không xác nhận số tài sản hoặc quyền sở hữu thực tế của bạn.";
/** PDF89 supplies the Phủ/Điền statement; Hợi, sole principal and absence of direct voids are the approved project subset. */
export function vttlDienPhuAssessment(s: ChartSnapshot): {
  value?: "yes" | "no";
  reason: string;
  paths: string[];
  cause?: "missing-data" | "unresolved-adjustment";
} {
  const paths = ["chart.palaces", "chart.tanBien.completeness.majorStars"];
  const result = (
    value: "yes" | "no" | undefined,
    reason: string,
    cause?: "missing-data" | "unresolved-adjustment",
  ) => ({
    value,
    reason,
    paths,
    cause:
      cause ?? (value === undefined ? ("missing-data" as const) : undefined),
  });
  if (s.profile.id !== "tanbien-vn-trial-v2")
    return result(undefined, "Ngoài profile dữ kiện bản mệnh đã xác minh.");
  if (
    s.chart.tanBien?.completeness?.majorStars !== "complete" ||
    !principalIntegrity(s.chart).valid
  )
    return result(
      undefined,
      "Thiếu chứng nhận hoặc dữ kiện 14 chính tinh/cung không toàn vẹn.",
    );
  const matches = s.chart.palaces
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p.name === "Điền Trạch");
  if (matches.length !== 1)
    return result(undefined, "Chưa xác định duy nhất cung Điền Trạch gốc.");
  const { p, i } = matches[0];
  paths.push(
    `chart.palaces.${i}.earthlyBranch`,
    `chart.palaces.${i}.majorStars`,
  );
  if (
    p.earthlyBranch !== "Hợi" ||
    p.majorStars.length !== 1 ||
    p.majorStars[0].name !== "Thiên Phủ"
  )
    return result(
      "no",
      "Ngoài tập con dự án Điền Hợi chỉ có chính tinh Thiên Phủ; không phải lời phủ định quy mô nhà đất.",
    );
  paths.push("chart.tanBien.voidRanges");
  const ranges = s.chart.tanBien?.voidRanges;
  if (
    !Array.isArray(ranges) ||
    ranges.length !== 2 ||
    !["Tuần Không", "Triệt Lộ"].every((n) =>
      ranges.some((v) => v.name === n),
    ) ||
    ranges.some(
      (v) => voidMembership(p.earthlyBranch, v.branches) === undefined,
    )
  )
    return result(
      undefined,
      "Thiếu hoặc bất nhất hai cặp Tuần/Triệt để kiểm điều chỉnh trực tiếp tại Điền.",
    );
  const active = ranges.filter(
    (v) => voidMembership(p.earthlyBranch, v.branches) === true,
  );
  if (active.length)
    return result(
      undefined,
      active.map((v) => v.name).join(" và ") +
        " trực tiếp tại Điền; phép phối hợp với câu quy mô chưa được đặc tả, giữ ngoài gói. Không đổi nhiều thành ít.",
      "unresolved-adjustment",
    );
  return result(
    "yes",
    "Thiên Phủ gốc là chính tinh duy nhất tại Điền Hợi; không có Tuần/Triệt trực tiếp tại Điền. Nguồn Toàn Thư PDF89 nói quy mô; Hợi/độc tọa/vắng TT là tập con dự án, không phải điều kiện nguyên văn sách.",
  );
}
export function vttlDienPhuFacts(s: ChartSnapshot): DerivedFact[] {
  const a = vttlDienPhuAssessment(s),
    common = {
      derivationId: VTTL_DIEN_PHU_METHOD,
      version: "1.0.0",
      text: a.reason,
      evidencePaths: a.paths.filter((p) => readPath(s, p) !== undefined),
      status: "source-table" as const,
      limitation:
        "Chỉ quy mô nhà đất định tính. Không xác nhận số lượng, diện tích, giá trị, quyền sở hữu; không suy thừa hưởng/tự tạo/giữ tài sản. Thiếu/điều chỉnh chưa rõ giữ unknown.",
    };
  return [
    {
      ...common,
      id: VTTL_DIEN_PHU_FACT + "-status",
      value: a.value ?? "unknown",
    },
    ...(a.value ? [{ ...common, id: VTTL_DIEN_PHU_FACT, value: a.value }] : []),
  ];
}
export const vttlDienPhuRule = ruleSchema.parse({
  id: VTTL_DIEN_PHU,
  version: "1.0.0",
  kind: "interpretation",
  topic: "overview",
  origin: "catalog",
  requiredEngineProfile: ["tanbien-vn-trial-v2"],
  requiredFacts: [VTTL_DIEN_PHU_FACT],
  conditions: [{ fact: VTTL_DIEN_PHU_FACT, op: "eq", value: "yes" }],
  exceptions: [],
  claimTemplate: VTTL_DIEN_PHU_COPY,
  evidencePaths: [
    "chart.palaces",
    "chart.tanBien.completeness",
    "chart.tanBien.voidRanges",
  ],
  sourceReferences: [
    {
      id: "vttl170-dien-phu",
      title: "Vũ Tài Lục dịch và bình chú — Tử Vi Đẩu Số Toàn Thư",
      url: "/internal/editorial/vttl-dien-phu#scale",
      location:
        "PDF/header89, Cửu Điền Trạch Cung, dòng Thiên Phủ; ngữ cảnh17,30–31,57; bản170trang.",
      accessedOn: "2026-10-24",
      rights: "pending",
      rightsNote:
        "Paraphrase đúng nhánh được chủ dự án duyệt sau fe3f0ac; không xác nhận quyền thương mại hoặc thẩm định ngoài. SHA256 789b02281b5d52b4cb746baa12616a7c25bca468489c937a87eada3303d1b06b.",
    },
  ],
  conflictsWith: [],
  conflictGroup: null,
  conflictPolicy: "retain-both",
  status: "draft",
  review: null,
  limitations: [
    "Giữ “nhiều” như mô tả quy mô định tính; không số tài sản/diện tích/giá trị/quyền sở hữu thực tế. Không kết luận thừa hưởng, tự tạo hay giữ được tài sản; không sửa Dần/Thân của Tân Biên hoặc coi hai nguồn cùng quy tắc.",
  ],
  presentation: {
    title: "Quy mô nhà đất — Thiên Phủ tại Điền",
    readingTheme: "dien",
    contentType: "combination",
    sourceConditions: [
      "Thiên Phủ thực sự tọa Điền Trạch; PDF89 mô tả nhiều đất cát, vườn ruộng.",
      "Câu này không đặt điều kiện chi, miếu/vượng, can hoặc tuổi; các vế đồng Tử Vi/Liêm Trinh/Vũ Khúc là tổ hợp khác.",
    ],
    projectScope: [
      VTTL_DIEN_PHU_METHOD,
      "Chủ dự án duyệt sau fe3f0ac đúng nhánh và văn mẫu; không mở nhánh Toàn Thư khác.",
      "Tập con dự án: Điền Hợi có đúng một chính tinh Thiên Phủ, vắng Tuần/Triệt trực tiếp đã được chứng nhận. Đây không phải sách yêu cầu Hợi hoặc độc tọa.",
      "Toàn vẹn 14 chính tinh và chứng nhận lớp gốc là kiểm kỹ thuật dự án; không đổi engine hoặc bảng sáng/mờ.",
    ],
    knownExceptions: [
      "Có Tuần/Triệt trực tiếp Điền giữ unknown: chưa có phép phối hợp câu quy mô với lời về thừa hưởng; không tự đảo nhiều→ít.",
      "Không nhập vế bảo vệ gia nghiệp của tổ hợp Phủ–Liêm/Vũ hoặc lấy lời cô lập ở30 thành mất đất.",
    ],
    unknownConditions: [
      "Thiếu/trùng/bất nhất cung, sao gốc hoặc cặp Tuần/Triệt giữ unknown; ngoài tập con không là kết luận phủ định nguồn.",
    ],
    readerLimit:
      "Chỉ mô tả quy mô nhà đất định tính, không đánh giá quyền sở hữu hoặc hoàn chỉnh cung Điền.",
    applicability:
      "Đúng cung gốc và tập con đã duyệt; không mượn sao chiếu, không chọn theo hồ sơ mẫu.",
    sourceScope:
      "Phương pháp riêng của bản Toàn Thư do Vũ Tài Lục dịch/bình chú; không gán cho Tân Biên, NPL hoặc Trung Châu.",
  },
});
