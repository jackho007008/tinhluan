import type { ChartSnapshot } from "../tuvi-engine";
import {
  principalIntegrity,
  CHART_BRANCHES,
} from "../tuvi-engine/chart-integrity";
import { verifiedNatalTransformations } from "../tuvi-engine/natal-transformations";
import { tanBienTable } from "./tanbien-source";
import type { DerivedFact } from "./derived";
import { ruleSchema, readPath } from "./schema";

export const LIFE_LITERARY_METHOD = "tanbien-life-literary-1.0.0";
export const M05 = "tanbien.life-wu-literary-male";
export const M07 = "tanbien.life-ky-khoa-ty-hoi";
type Assessment = {
  value?: "yes" | "no";
  reason: string;
  paths: string[];
  structure?: string;
};
export function lifeLiteraryAssessment(s: ChartSnapshot): {
  m05: Assessment;
  m07: Assessment;
} {
  const paths = ["chart.tanBien.completeness.majorStars", "chart.palaces"];
  const unknown = (reason: string): Assessment => ({ reason, paths });
  if (
    s.chart.tanBien?.completeness?.majorStars !== "complete" ||
    !principalIntegrity(s.chart).valid
  )
    return {
      m05: unknown("Danh sách chính tinh chưa đầy đủ hoặc không hợp lệ."),
      m07: unknown("Danh sách chính tinh chưa đầy đủ hoặc không hợp lệ."),
    };
  const i = s.chart.palaces.findIndex((p) => p.name === "Mệnh");
  if (i < 0)
    return {
      m05: unknown("Chưa xác định cung Mệnh."),
      m07: unknown("Chưa xác định cung Mệnh."),
    };
  const p = s.chart.palaces[i],
    base = `chart.palaces.${i}`;
  paths.push(base + ".name", base + ".earthlyBranch", base + ".majorStars");
  const assessM05 = (): Assessment => {
    const gender = s.normalized.gender,
      recorded = s.chart.tanBien?.inputs?.gender;
    const ps = [...paths, "normalized.gender", "chart.tanBien.inputs.gender"];
    if (!["male", "female"].includes(gender) || gender !== recorded)
      return {
        reason:
          "Giới tính thiếu hoặc không nhất quán giữa đầu vào và dữ kiện an sao.",
        paths: ps,
      };
    if (gender !== "male" || !p.majorStars.some((st) => st.name === "Vũ Khúc"))
      return {
        value: "no",
        reason: "Không thỏa nam mệnh có Vũ Khúc tọa thủ.",
        paths: ps,
      };
    const state = tanBienTable.states[p.earthlyBranch];
    if (!state)
      return {
        reason: "Chưa có trạng thái Vũ Khúc theo bảng nguồn tại địa chi này.",
        paths: ps,
      };
    if (!["Miếu", "Vượng", "Đắc"].includes(state))
      return {
        value: "no",
        reason: `Vũ Khúc tại ${p.earthlyBranch}: ${state}, ngoài trạng thái của nhánh Nam mệnh được chọn.`,
        paths: ps,
      };
    const fields = ["minorStars", "adjectiveStars"] as const;
    const complete = fields.every(
      (f) =>
        s.chart.tanBien?.completeness?.[f] ===
          "complete-with-declared-supplements" &&
        Array.isArray(p[f]) &&
        p[f].every(
          (st) =>
            st &&
            (st as { scope?: string }).scope === "origin" &&
            typeof st.name === "string" &&
            st.name.trim(),
        ) &&
        new Set(p[f].map((st) => st.name)).size === p[f].length,
    );
    ps.push(...fields.map((f) => base + "." + f), "chart.tanBien.completeness");
    if (!complete)
      return {
        reason:
          "Danh sách văn tinh bản mệnh chưa được xác minh đầy đủ, đúng lớp và duy nhất.",
        paths: ps,
      };
    const stars = fields
      .flatMap((f) => p[f])
      .filter((st) => ["Văn Xương", "Văn Khúc"].includes(st.name));
    if (new Set(stars.map((st) => st.name)).size !== stars.length)
      return { reason: "Văn tinh trùng giữa các danh sách.", paths: ps };
    const structure = `Nam mệnh, Vũ Khúc tại ${p.earthlyBranch} (${state} theo Tân Biên)${stars.length ? ", đồng cung " + stars.map((st) => st.name).join(" và ") : ", không có Xương hoặc Khúc đồng cung trong danh sách đầy đủ"}`;
    return {
      value: stars.length ? "yes" : "no",
      reason: structure + ".",
      structure,
      paths: ps,
    };
  };
  const assessM07 = (): Assessment => {
    if (!["Tý", "Hợi"].includes(p.earthlyBranch))
      return {
        value: "no",
        reason: `Mệnh tại ${p.earthlyBranch}, ngoài Tý/Hợi của nhánh nguồn.`,
        paths,
      };
    const cert = verifiedNatalTransformations(s.chart),
      ps = [...paths, "chart.natalTransformations", "chart.tanBien.trace"];
    if (!cert)
      return {
        reason:
          "Thiếu hoặc không nhất quán chứng nhận Tứ Hóa bản mệnh; chưa xác định quan hệ Kỵ–Khoa.",
        paths: ps,
      };
    const ky = cert.entries.find((e) => e.kind === "Kỵ")!,
      khoa = cert.entries.find((e) => e.kind === "Khoa")!;
    ps.push(ky.path, khoa.path);
    const opposite =
      CHART_BRANCHES[(CHART_BRANCHES.indexOf(p.earthlyBranch) + 6) % 12];
    const same = khoa.branch === p.earthlyBranch;
    const yes =
      ky.branch === p.earthlyBranch && (same || khoa.branch === opposite);
    const structure = `Mệnh tại ${p.earthlyBranch}; ${ky.star} mang Hóa Kỵ tại ${ky.palace} (${ky.branch}), ${khoa.star} mang Hóa Khoa tại ${khoa.palace} (${khoa.branch})`;
    return {
      value: yes ? "yes" : "no",
      structure:
        structure +
        (yes ? `, ${same ? "đồng cung" : "xung chiếu"} với Mệnh` : ""),
      reason:
        structure +
        (yes
          ? ": đủ quan hệ đồng cung/xung chiếu của nhánh."
          : ": không đủ quan hệ Kỵ tọa Mệnh và Khoa đồng cung/xung chiếu."),
      paths: ps,
    };
  };
  return { m05: assessM05(), m07: assessM07() };
}
export function lifeLiteraryFacts(s: ChartSnapshot): DerivedFact[] {
  return Object.entries(lifeLiteraryAssessment(s)).flatMap(([key, a]) => {
    const common = {
      derivationId: LIFE_LITERARY_METHOD,
      version: "1.0.0",
      text: a.reason,
      evidencePaths: a.paths.filter((path) => readPath(s, path) !== undefined),
      status: "source-table" as const,
      limitation:
        "Chỉ điều kiện nguồn và tính đầy đủ dữ liệu; không đánh giá con người hoặc tổng hợp toàn Mệnh.",
    };
    return [
      {
        ...common,
        id: `fact.life-literary-${key}-status`,
        value: a.value ?? "unknown",
      },
      ...(a.value
        ? [{ ...common, id: `fact.life-literary-${key}`, value: a.value }]
        : []),
      ...(a.value
        ? [
            {
              ...common,
              id: `fact.life-literary-${key}-structure`,
              value: a.structure ?? a.reason,
            },
          ]
        : []),
    ];
  });
}
export const lifeLiteraryRules = [
  {
    id: M05,
    key: "m05",
    title: "Vũ Khúc với văn tinh đồng cung — nhánh Nam mệnh",
    theme: "learning",
    pages: "34–35;65–67, mục Nam mệnh tiếp trang66",
    text: "{{fact.life-literary-m05-structure}}. Trong mục Nam mệnh, Tân Biên liên hệ cấu trúc này với “tài kiêm văn võ”. Giữ nguyên cách gọi của nguồn, không quy đổi thành nghề nghiệp, bằng cấp hoặc năng lực thực tế đã được xác nhận.",
    conditions: [
      "Nam mệnh; Vũ Khúc miếu/vượng/đắc tọa Mệnh theo tanbien-wuqu-state@1.1.0.",
      "Văn Xương hoặc Văn Khúc đồng cung Mệnh; chữ “hay” tại PDF66 xác định các lựa chọn, không yêu cầu cả hai.",
    ],
    limits:
      "Không mở sang nữ mệnh, hội chiếu hoặc thêm trạng thái văn tinh. R02 nói riêng về học hỏi với Văn Khúc; không phải hai bằng chứng độc lập xác nhận tài giỏi.",
  },
  {
    id: M07,
    key: "m07",
    title: "Kỵ–Khoa tại Mệnh Tý/Hợi — chú giải tổ hợp",
    theme: "action",
    pages: "118–121, đặc biệt120: “Kỵ ngộ Khoa tinh cư Hợi, Tý”",
    text: "{{fact.life-literary-m07-structure}}. Tân Biên liên hệ tổ hợp này với sự cẩn thận trong lời nói và việc làm. Đây là chú giải truyền thống cục bộ, không xác nhận phẩm hạnh hoặc hành vi thực tế; không có nghĩa mọi mặt bất lợi của Hóa Kỵ đã được hóa giải.",
    conditions: [
      "Hóa Kỵ bản mệnh tọa Mệnh tại Tý hoặc Hợi.",
      "Hóa Khoa bản mệnh đồng cung hoặc xung chiếu với Mệnh; không mở thành mọi hội chiếu.",
    ],
    limits:
      "Lời tổ hợp độc lập: chưa có claim nền Kỵ tương ứng để điều chỉnh/thay thế. Không lấy nhánh Khoa–Lương/nhiều sao sáng ở câu kế tiếp; không xuất phán xét trí thông minh, sự kính trọng hoặc đức độ thực tế.",
  },
].map((x) =>
  ruleSchema.parse({
    id: x.id,
    version: "0.1.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["tanbien-vn-trial-v2"],
    requiredFacts: [
      `fact.life-literary-${x.key}`,
      `fact.life-literary-${x.key}-structure`,
      "fact.source-position-available",
    ],
    conditions: [
      { fact: `fact.life-literary-${x.key}`, op: "eq", value: "yes" },
    ],
    exceptions: [],
    claimTemplate: x.text,
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "tanbien-life-literary",
        title: "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên",
        url: "/internal/editorial/life-literary#" + x.key,
        location: "PDF/số hiển thị " + x.pages + "; bản277 trang.",
        accessedOn: "2026-10-15",
        rights: "pending",
        rightsNote:
          "Đã đối chiếu ảnh; SHA-256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc. Chưa phê duyệt chuyên môn hoặc quyền phát hành.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [x.limits],
    presentation: {
      title: x.title,
      readingTheme: x.theme,
      contentType: "combination",
      sourceConditions: x.conditions,
      projectScope: [
        LIFE_LITERARY_METHOD,
        "Cổng toàn vẹn/chứng nhận là điều kiện kỹ thuật của dự án, không phải nguyên văn sách.",
        "Chỉ dữ liệu bản mệnh; không sửa snapshot hoặc đổi bảng Tứ Hóa.",
      ],
      readerLimit: x.limits,
      knownExceptions: [
        "Không có ngoại lệ riêng được xác định cho mệnh đề chọn; các nhánh khác trong ngữ cảnh không tự nhập vào.",
      ],
      unknownConditions: [
        "Thiếu dữ kiện hoặc chứng nhận không nhất quán giữ unknown, không suy vắng sao.",
      ],
      applicability:
        "Đúng cung, quan hệ và điều kiện nguồn; không mượn sao đối cung cho điều kiện tọa thủ.",
      sourceScope:
        "Tân Biên riêng; không lấy bảng Tứ Hóa hoặc lời kết luận nguồn khác.",
    },
  }),
);
