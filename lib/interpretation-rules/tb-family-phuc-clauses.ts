import type { ChartSnapshot } from "../tuvi-engine";
import type { DerivedFact } from "./derived";
import {
  CHART_BRANCHES,
  principalIntegrity,
} from "../tuvi-engine/chart-integrity";
import { verifiedNatalTransformations } from "../tuvi-engine/natal-transformations";
import { voidMembership } from "../internal-review/career-definitions";
import { familyBranches, familyAssessment } from "./phu-huynh";
import { familyVcdBranches, familyVcdAssessment } from "./family-vcd";
import {
  parentUnadjustedBranches,
  parentUnadjustedAssessment,
} from "./parent-unadjusted";
import { readPath, ruleSchema } from "./schema";

export const TB_P01 = "tanbien.parents-vcd-sun-moon-relation";
export const TB_P02 = "tanbien.parents-vcd-sun-cu-relation";
export const TB_P03 = "tanbien.parents-thai-tue-relation";
export const TB_F01 = "tanbien.phuc-vcd-tu-tham-dispersal";
export const TB_FAMILY_PHUC_IDS = [TB_P01, TB_P02, TB_P03, TB_F01];
export const tbFamilyPhucFact = (id: string) =>
  "fact." + id.slice("tanbien.".length);
export const TB_FAMILY_PHUC_METHOD = "tanbien-independent-family-phuc-1.0.0";
export const TB_FAMILY_PHUC_COPY: Record<string, string> = {
  "tanbien.parents-vcd-sun-moon-relation":
    "Theo Tân Biên, Phụ Mẫu vô chính diệu nhận Thái Dương–Thái Âm xung chiếu trong thế Sửu–Mùi có lời riêng về cha mẹ bất hòa và con khó sống gần cha mẹ. Đoạn này chưa xác nhận quan hệ hoặc hoàn cảnh thực tế của gia đình bạn.",
  "tanbien.parents-vcd-sun-cu-relation":
    "Theo Tân Biên, khi xét Cự Môn trong cặp Thái Dương–Cự Môn xung chiếu vào Phụ Mẫu vô chính diệu, lời riêng về Phụ Mẫu nói cha mẹ bất hòa, trong nhà có tranh chấp. Đoạn này chưa xác nhận quan hệ hoặc hoàn cảnh thực tế của gia đình bạn.",
  "tanbien.parents-thai-tue-relation":
    "Theo Tân Biên, Thái Tuế tại Phụ Mẫu có lời về thiếu hòa khí và tranh chấp trong nhà, cha mẹ và con không hợp tính nhau. Đoạn này chưa xác nhận quan hệ hoặc hoàn cảnh thực tế của gia đình bạn.",
  "tanbien.phuc-vcd-tu-tham-dispersal":
    "Theo Tân Biên, Phúc Đức vô chính diệu xét Tử Vi–Tham Lang xung chiếu có lời riêng về sự phân tán của họ hàng. Đây là chú giải cục bộ của nguồn, chưa xác nhận hoàn cảnh thực tế của gia đình bạn hoặc kết luận mức hưởng phúc chung.",
};
type Assessment = {
  value?: "yes" | "no";
  reason: string;
  paths: string[];
  cause?: "missing-data" | "unresolved-adjustment";
};
const fields = ["minorStars", "adjectiveStars"] as const;
const cycle = [
  "Thái Tuế",
  "Thiếu Dương",
  "Tang Môn",
  "Thiếu Âm",
  "Quan Phù",
  "Tử Phù",
  "Tuế Phá",
  "Long Đức",
  "Bạch Hổ",
  "Phúc Đức",
  "Điếu Khách",
  "Trực Phù",
];
// Source-specific clauses already carrying family discord. A favorable family
// clause is never a covering clause. Check actual applicability, not prose or IDs of witnesses.
export const TB_PARENT_DISCORD_COVERS = [
  "tu-sat",
  "tu-pha",
  "liem-phu",
  "liem-sat",
  "dong-cu",
  "vu-tham",
  "vu-pha",
  "sun-moon",
  "co-cu",
  "co-low",
  "tham-thin-tuat",
  "tham-dan-than",
  "tham-ty-ngo",
  "cu-high",
  "cu-ty",
  "cu-mao-dau",
  "tuong-high",
  "luong-suu-mui",
  "sat-dan-than",
  "sat-ngo",
  "pha-ty-ngo",
  "pha-dan-than",
  "pha-thin-tuat",
  "loc",
  "ky",
  "pha-common-discord",
  "sat-common-discord",
];
function existingDiscord(s: ChartSnapshot) {
  const direct = familyBranches.filter(
    (r) => r.palace === "Phụ Mẫu" && TB_PARENT_DISCORD_COVERS.includes(r.id),
  );
  const vcd = familyVcdBranches.filter(
    (r) => r.palace === "Phụ Mẫu" && TB_PARENT_DISCORD_COVERS.includes(r.id),
  );
  const companion = parentUnadjustedBranches.filter((b) =>
    TB_PARENT_DISCORD_COVERS.includes(b.row.id),
  );
  return (
    direct.some((r) => familyAssessment(s, r).value === true) ||
    vcd.some((r) => familyVcdAssessment(s, r).value === true) ||
    companion.some((b) => parentUnadjustedAssessment(s, b).value === true)
  );
}
export function tbFamilyPhucAssessment(
  s: ChartSnapshot,
  id: string,
): Assessment {
  const paths = ["chart.palaces", "chart.tanBien.completeness.majorStars"];
  const result = (
    value: Assessment["value"],
    reason: string,
    cause?: Assessment["cause"],
  ): Assessment => ({
    value,
    reason,
    paths,
    cause: cause ?? (value === undefined ? "missing-data" : undefined),
  });
  if (
    !TB_FAMILY_PHUC_IDS.includes(id) ||
    s.profile.id !== "tanbien-vn-trial-v2"
  )
    return result(
      undefined,
      "Ngoài nhánh/profile dữ kiện bản mệnh đã xác minh.",
    );
  const ps = s.chart.palaces;
  if (
    s.chart.tanBien?.completeness?.majorStars !== "complete" ||
    !Array.isArray(ps) ||
    ps.some((p) => !p) ||
    !principalIntegrity(s.chart).valid
  )
    return result(
      undefined,
      "Thiếu chứng nhận hoặc dữ kiện 12 cung/14 chính tinh bản mệnh không toàn vẹn.",
    );
  const target = id === TB_F01 ? "Phúc Đức" : "Phụ Mẫu",
    donor = id === TB_F01 ? "Tài Bạch" : "Tật Ách";
  const ti = ps.findIndex((p) => p.name === target),
    di = ps.findIndex((p) => p.name === donor);
  if (ti < 0 || di < 0)
    return result(
      undefined,
      "Thiếu định danh duy nhất cung nhận hoặc đối cung.",
    );
  const t = ps[ti],
    d = ps[di];
  for (const i of id === TB_P03 ? [ti] : [ti, di])
    paths.push(
      ...["name", "earthlyBranch", "majorStars"].map(
        (k) => `chart.palaces.${i}.${k}`,
      ),
    );
  if (id !== TB_P03) {
    if (
      (CHART_BRANCHES.indexOf(t.earthlyBranch) + 6) % 12 !==
      CHART_BRANCHES.indexOf(d.earthlyBranch)
    )
      return result(
        undefined,
        "Tên cung và địa chi xung chiếu không nhất quán.",
      );
    if (t.majorStars.length)
      return result(
        "no",
        "Cung nhận có chính tinh tọa thủ; ngoài nhánh VCD, không suy kết quả ngược.",
      );
    const pair =
      id === TB_P01
        ? ["Thái Dương", "Thái Âm"]
        : id === TB_P02
          ? ["Thái Dương", "Cự Môn"]
          : ["Tử Vi", "Tham Lang"];
    if (
      d.majorStars.length !== 2 ||
      !pair.every((n) => d.majorStars.some((st) => st.name === n))
    )
      return result(
        "no",
        "Đối cung không có đúng cặp " +
          pair.join("–") +
          " bản mệnh; không thay bằng sao tam hợp hoặc chuyển phụ tinh.",
      );
    if (
      id === TB_P01 &&
      ![t, d].every((p) => ["Sửu", "Mùi"].includes(p.earthlyBranch))
    )
      return result(
        "no",
        "Ngoài tập con giao chi Sửu/Mùi ở cả cung cho và nhận; chưa giải cách chọn chi cho nhánh khác.",
      );
  }
  if (id === TB_P03) {
    // Verify the existing natal ring against its adapter trace. Do not recalculate stars.
    paths.push(
      "chart.tanBien.trace",
      "chart.tanBien.inputs.yearBranch",
      ...ps.map((_, i) => `chart.palaces.${i}.suiqian12`),
    );
    const trace = s.chart.tanBien!.trace?.find((q) => q.id === "rings"),
      year = s.chart.tanBien!.inputs?.yearBranch;
    const sourceCycle = (trace?.result as { thaiTue?: unknown })?.thaiTue;
    if (
      !CHART_BRANCHES.includes(year ?? "") ||
      (trace?.input as { yearBranch?: string })?.yearBranch !== year ||
      JSON.stringify(sourceCycle) !== JSON.stringify(cycle) ||
      ps.some(
        (p) =>
          (p as typeof p & { suiqian12?: string }).suiqian12 !==
          cycle[
            (CHART_BRANCHES.indexOf(p.earthlyBranch) -
              CHART_BRANCHES.indexOf(year) +
              12) %
              12
          ],
      )
    )
      return result(
        undefined,
        "Vòng Thái Tuế bản mệnh thiếu hoặc bất nhất với chứng nhận/trace hiện có; không suy có hoặc vắng Thái Tuế.",
      );
    if ((t as typeof t & { suiqian12?: string }).suiqian12 !== "Thái Tuế")
      return result(
        "no",
        "Thái Tuế bản mệnh không trực tiếp Phụ; sao chiếu không thay tọa thủ.",
      );
  }
  const relevant = id === TB_P03 ? [ti] : [ti, di],
    c = s.chart.tanBien!.completeness;
  paths.push(
    "chart.tanBien.completeness.minorStars",
    "chart.tanBien.completeness.adjectiveStars",
  );
  for (const i of relevant) {
    paths.push(...fields.map((k) => `chart.palaces.${i}.${k}`));
    const p = ps[i];
    if (
      fields.some(
        (k) =>
          c[k] !== "complete-with-declared-supplements" ||
          !Array.isArray(p[k]) ||
          p[k].some(
            (st) =>
              !st ||
              typeof st.name !== "string" ||
              !st.name.trim() ||
              st.name !== st.name.trim() ||
              (st as { scope?: string }).scope !== "origin",
          ),
      )
    )
      return result(
        undefined,
        "Danh sách phụ tinh/sao bổ sung liên quan thiếu chứng nhận, sai scope hoặc không hợp lệ.",
      );
    const names = fields.flatMap((k) => p[k].map((st) => st.name));
    if (new Set(names).size !== names.length)
      return result(
        undefined,
        "Danh sách sao liên quan bị trùng; không suy vắng điều chỉnh.",
      );
  }
  paths.push("chart.tanBien.voidRanges");
  const ranges = s.chart.tanBien!.voidRanges;
  if (
    !Array.isArray(ranges) ||
    ranges.length !== 2 ||
    ranges.some((v) => !v) ||
    !["Tuần Không", "Triệt Lộ"].every((n) =>
      ranges.some((v) => v.name === n),
    ) ||
    ranges.some((v) =>
      relevant.some(
        (i) => voidMembership(ps[i].earthlyBranch, v.branches) === undefined,
      ),
    )
  )
    return result(
      undefined,
      "Thiếu hoặc bất nhất vị trí Tuần/Triệt; không suy vắng điều chỉnh tại cung cho/nhận.",
    );
  if (id === TB_P01) {
    paths.push("chart.natalTransformations");
    const cert = verifiedNatalTransformations(s.chart);
    if (!cert)
      return result(
        undefined,
        "Chưa có chứng nhận Tứ Hóa bản mệnh hợp lệ để xét Kỵ trực tiếp Phụ; không tính lại hoặc mượn Hóa từ Tật.",
      );
    paths.push(
      ...cert.entries.filter((e) => e.kind === "Kỵ").map((e) => e.path),
    );
    if (cert.entries.some((e) => e.kind === "Kỵ" && e.palace === "Phụ Mẫu"))
      return result(
        undefined,
        "Hóa Kỵ trực tiếp Phụ: quan hệ giữa §5.2.25 và vế Nhật–Nguyệt chưa giải; giữ unknown, không mượn Kỵ từ Tật.",
        "unresolved-adjustment",
      );
  }
  if (
    id === TB_P03 &&
    (existingDiscord(s) || tbFamilyPhucAssessment(s, TB_P01).value === "yes")
  )
    return result(
      "no",
      "Vế bất hòa/thiếu hòa khí đã có ở một nhánh thực sự khớp, kể cả vế độc lập qua TT; chống trùng dự án, không dùng lời thuận để xóa lời khác chiều.",
    );
  return result(
    "yes",
    id === TB_P03
      ? "Thái Tuế bản mệnh trực tiếp Phụ được xác nhận bằng vòng/trace nhất quán. Chỉ câu đầu §5.2.27; điều kiện nhiều sát ở câu sau không sửa câu đầu. Không xuất xa cách, ly tán hoặc tai họa có điều kiện."
      : `${target} VCD nhận đúng cặp chính tinh bản mệnh từ ${donor} xung chiếu.${id === TB_P01 ? " Cả hai chi thuộc Sửu/Mùi, Kỵ trực tiếp Phụ đã kiểm." : ""} Chỉ vế ${id === TB_F01 ? "họ hàng phân tán" : "quan hệ gia đình"}; TT hợp lệ nhưng không đảo phương diện này. Không chuyển Tứ Hóa/phụ tinh hoặc phục hồi toàn lời nền.`,
  );
}
export function tbFamilyPhucFacts(s: ChartSnapshot): DerivedFact[] {
  return TB_FAMILY_PHUC_IDS.flatMap((id) => {
    const a = tbFamilyPhucAssessment(s, id),
      fact = tbFamilyPhucFact(id),
      common = {
        derivationId: TB_FAMILY_PHUC_METHOD,
        version: "1.0.0",
        text: a.reason,
        evidencePaths: a.paths.filter((p) => readPath(s, p) !== undefined),
        status: "source-table" as const,
        limitation:
          "Chỉ vế độc lập đã đặc tả; không kết luận toàn cung hoặc hoàn cảnh người thân, không chuyển điều kiện giữa các nguồn/cung.",
      };
    return [
      { ...common, id: fact + "-status", value: a.value ?? "unknown" },
      ...(a.value ? [{ ...common, id: fact, value: a.value }] : []),
    ];
  });
}
const sourceConditions: Record<string, string[]> = {
  [TB_P01]: [
    "TB131§5.2.31: Phụ VCD xét chính diệu xung chiếu như tọa thủ.",
    "TB126§5.2.5/127§5.2.8: Nhật–Nguyệt Sửu/Mùi có vế hai thân bất hòa, con không thể ở gần; không xuất vế khá giả.",
  ],
  [TB_P02]: [
    "TB131§5.2.31: Phụ VCD xét chính diệu xung chiếu như tọa thủ.",
    "TB128§5.2.10: bất cứ vị trí nào cha mẹ cũng bất hòa, trong nhà có tranh chấp. Câu chung không đòi Cự đơn thủ; các vế Nhật–Cự về vật chất/thời đoạn giữ riêng.",
  ],
  [TB_P03]: [
    "TB131§5.2.27: Thái Tuế tại Phụ, câu đầu nói thiếu hòa khí/tranh chấp/không hợp tính.",
    "Câu sau có điều kiện nếu gặp nhiều sát, nhất là Đà/Kỵ, thêm xa cách/ly tán/tai họa; không phục hồi câu sau từ câu đầu.",
  ],
  [TB_F01]: [
    "TB142§6.1.61: Phúc VCD xét chính diệu xung chiếu như tọa thủ.",
    "TB132§6.1.1/135§6.1.9: Tử–Tham có câu họ hàng ly tán, không điều kiện chi hoặc trạng thái. TB140§36–37/142–143 điều chỉnh hưởng phúc/sống lâu/khá giả không phủ định phân tán.",
  ],
};
export const tbFamilyPhucRules = TB_FAMILY_PHUC_IDS.map((id) =>
  ruleSchema.parse({
    id,
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["tanbien-vn-trial-v2"],
    requiredFacts: [tbFamilyPhucFact(id), "fact.source-position-available"],
    conditions: [{ fact: tbFamilyPhucFact(id), op: "eq", value: "yes" }],
    exceptions: [],
    claimTemplate: TB_FAMILY_PHUC_COPY[id],
    evidencePaths: [
      "chart.palaces",
      "chart.tanBien.completeness",
      "chart.tanBien.voidRanges",
      ...(id === TB_P01
        ? ["chart.natalTransformations"]
        : id === TB_P03
          ? ["chart.tanBien.trace"]
          : []),
    ],
    sourceReferences: [
      {
        id: "tanbien-supplied-pdf",
        title: "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên",
        url: "/internal/editorial/demo-wuqu-tianfu#source-list",
        location:
          sourceConditions[id].join(" ") +
          " Bản277trang SHA2564d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc.",
        accessedOn: "2026-10-26",
        rights: "pending",
        rightsNote:
          "Kế thừa đối chiếu nguồn và đặc tả907abca; triển khai đúng lô được chủ dự án giao, không phê duyệt chuyên môn toàn báo cáo/quyền thương mại.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Không xuất thêm vật chất, mức hưởng phúc, sinh tử, bệnh, phẩm hạnh hoặc lời khuyên sống xa; không xóa lời khác phương diện hoặc tự chọn kết luận thắng.",
    ],
    presentation: {
      title: id === TB_F01 ? "Họ hàng phân tán" : "Quan hệ cha mẹ và gia đình",
      readingTheme: id === TB_F01 ? "phuc" : "parents",
      contentType: id === TB_P03 ? "element-gloss" : "combination",
      sourceConditions: sourceConditions[id],
      projectScope: [
        TB_FAMILY_PHUC_METHOD,
        "Cổng dự án: profilev2/chứng nhận12cung/14chính tinh và các danh sách bản mệnh liên quan; vị trí TT phải đủ hợp lệ, không đòi vắng TT cho vế quan hệ này.",
        id === TB_P01
          ? "Tập con giao chi: cả cung cho và nhận đều Sửu/Mùi; Kỵ trực tiếp Phụ chưa phối giữ unknown. Không chọn chi thắng."
          : id === TB_P02
            ? "Đúng cặp Nhật–Cự bản mệnh đối cung; không đặt cổng tổng hợp lời Nhật về phương diện khác hoặc chuyển Hóa Quyền."
            : id === TB_P03
              ? "Vòng Thái Tuế và trace bản mệnh nhất quán; chống trùng khi vế quan hệ tương đương đã thực sự khớp. Câu có điều kiện nhiều sát vẫn chưa được áp."
              : "Đúng cặp Tử–Tham bản mệnh xung chiếu Phúc VCD; không dời sao, không mượn Hóa/phụ tinh từ Tài.",
        "Rule chung, không theo ID/ngày sinh/tên hoặc cung đang trống; giữ G2 Phụ/Phúc và bản lưu mới.",
      ],
      knownExceptions: [
        id === TB_P01
          ? "Kỵ trực tiếp Phụ §5.2.25 chưa rõ quan hệ với vế Nhật–Nguyệt: unknown. Kỵ đối cung không được chuyển sang Phụ."
          : "Chỉ bỏ cổng đòi giải toàn cung/phương diện khác; các điều chỉnh trực tiếp chưa giải vẫn unknown.",
        "TT không tự xóa quan hệ/phân tán; không đảo giàu nghèo/sang hèn hoặc kết luận đã giải hưởng phúc chung.",
      ],
      unknownConditions: [
        "Thiếu/bất nhất chứng nhận, scope, tên cung, vị trí, danh sách hoặc TT: unknown; không coi thiếu là vắng.",
        "Nếu có điều chỉnh trực tiếp mới đúng vế chưa được giải, giữ unknown; không yêu cầu giải mọi sao hoặc toàn cung.",
      ],
      readerLimit:
        "Chú giải nguồn theo cấu trúc, không xác nhận quan hệ hoặc hoàn cảnh thực tế của người thân.",
      applicability:
        "Bản mệnh đúng điều kiện từng vế; không vận hạn hoặc xét tình trạng có lời của báo cáo.",
      sourceScope:
        id === TB_F01
          ? "Chỉ phân tán họ hàng; căn cứ tại Tài không phải nhận định tiền bạc."
          : "Chỉ quan hệ cha mẹ và gia đình; căn cứ tại Tật không phải luận sức khỏe.",
    },
  }),
);

// The existing customer evidence presenter renders limits separately from source
// conditions. Expose this batch's project guards there as well as in structured metadata.
for (const rule of tbFamilyPhucRules) {
  rule.limitations = [
    ...new Set([
      ...rule.limitations,
      ...rule.presentation!.projectScope!.slice(1),
      ...rule.presentation!.knownExceptions,
    ]),
  ];
}
