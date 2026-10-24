import type { ChartSnapshot } from "../tuvi-engine";
import {
  principalIntegrity,
  CHART_BRANCHES,
} from "../tuvi-engine/chart-integrity";
import type { DerivedFact } from "./derived";
import { ruleSchema, readPath } from "./schema";

export const MOVE365 = "trungchau.move365",
  SPEND201 = "trungchau.spend201",
  SPEECH484 = "trungchau.speech484";
export const TRUNGCHAU_RULE_IDS = [MOVE365, SPEND201, SPEECH484];
export const TRUNGCHAU_METHOD = "trungchau-natal-1.0.0";
export const MOVE_COPY =
  "Trong công việc, bạn có khuynh hướng trải qua nhiều công việc khác nhau hoặc thử sức ở nhiều nơi làm việc. Khuynh hướng này vẫn có thể hiện diện khi có sự trợ giúp thuận lợi.";
export const SPEND_COPY =
  "Trong những khoản chi ngoài công việc, có lúc bạn dễ mua theo hứng hoặc bị lời mời, quảng cáo hấp dẫn nên chi ngoài kế hoạch. Sau một đợt mua sắm, bạn cũng có thể quay sang giữ tiền rất chặt; khuynh hướng này không có nghĩa lúc nào bạn cũng tiêu nhiều.";
export const FIRE_BELL_COPY =
  "Những khoản chi ngoài dự kiến cũng có thể là khoản bắt buộc hoặc chính đáng, không phải lúc nào cũng do mua theo hứng.";
export const SPEECH_COPY =
  "Bạn có xu hướng phản ứng nhanh, suy nghĩ tỉ mỉ và diễn đạt linh hoạt. Khả năng dùng lời này không có nghĩa mọi lúc bạn đều nói năng chín chắn.";
type Assessment = { value?: "yes" | "no"; reason: string; paths: string[] };
const owners = {
  move: "career",
  spend: "wealth",
  speech: "life",
  guard: "wealth",
} as const;
export const trungchauFact = (key: keyof typeof owners) =>
  `fact.${owners[key]}-trungchau-${key}`;
/** Source position and output owner are deliberately separate: spending describes the native, not children. */
export function trungchauAssessment(
  s: ChartSnapshot,
  key: keyof typeof owners,
): Assessment {
  const paths = ["chart.palaces", "chart.tanBien.completeness"];
  const result = (value: Assessment["value"], reason: string): Assessment => ({
    value,
    reason,
    paths,
  });
  if (s.profile.id !== "tanbien-vn-trial-v2")
    return result(undefined, "Ngoài profile dữ kiện bản mệnh đã xác minh.");
  if (
    s.chart.tanBien?.completeness?.majorStars !== "complete" ||
    !principalIntegrity(s.chart).valid
  )
    return result(
      undefined,
      "Thiếu chứng nhận hoặc khung 14 chính tinh không toàn vẹn.",
    );
  const ps = s.chart.palaces,
    at = (name: string) => ps.find((p) => p.name === name),
    life = at("Mệnh"),
    children = at("Tử Nữ");
  if (
    !life ||
    !children ||
    !at("Quan Lộc") ||
    !at("Tài Bạch") ||
    !at("Thiên Di")
  )
    return result(undefined, "Thiếu hoặc sai tên cung gốc cần thiết.");
  if (key === "spend")
    return result(
      children.majorStars.length === 0 ? "yes" : "no",
      `Tử Nữ tại ${children.earthlyBranch}: ${children.majorStars.length === 0 ? "không có chính tinh tọa thủ trong danh sách đầy đủ" : "có chính tinh tọa thủ"}. Chủ thể lời chi tiêu là đương số; chủ đề tài chính.`,
    );
  if (key !== "guard" && !["Sửu", "Mùi"].includes(life.earthlyBranch))
    return result("no", `Mệnh tại ${life.earthlyBranch}, ngoài Sửu/Mùi.`);
  if (key === "move") {
    const exact = (p: typeof life | undefined, names: readonly string[]) =>
      !!p &&
      p.majorStars.length === names.length &&
      names.every((n) => p.majorStars.some((st) => st.name === n));
    if (!exact(life, ["Tử Vi", "Phá Quân"]))
      return result("no", "Mệnh không có Tử Vi và Phá Quân đồng cung.");
    const pos = CHART_BRANCHES.indexOf(life.earthlyBranch);
    for (const [name, names, offset] of [
      ["Tài Bạch", ["Vũ Khúc", "Thất Sát"], 8],
      ["Quan Lộc", ["Liêm Trinh", "Tham Lang"], 4],
      ["Thiên Di", ["Thiên Tướng"], 6],
    ] as const) {
      const p = at(name);
      if (
        !exact(p, names) ||
        p!.earthlyBranch !== CHART_BRANCHES[(pos + offset) % 12]
      )
        return result(
          undefined,
          "Khung Tử–Phá không nhất quán ở " + name + ".",
        );
    }
    return result(
      "yes",
      `Mệnh ${life.earthlyBranch}, Tử Vi–Phá Quân đồng cung; khung Tài Vũ–Sát, Quan Liêm–Tham, Di Tướng và vị trí 8/4/6 nhất quán. Căn cứ Mệnh, chủ đề công việc.`,
    );
  }
  const fields =
    key === "speech"
      ? (["minorStars", "adjectiveStars"] as const)
      : (["minorStars"] as const);
  const targets =
    key === "speech" ? ["Văn Xương", "Văn Khúc"] : ["Hỏa Tinh", "Linh Tinh"];
  for (const field of fields) {
    if (
      s.chart.tanBien?.completeness?.[field] !==
        "complete-with-declared-supplements" ||
      ps.some(
        (p) =>
          !Array.isArray(p[field]) ||
          p[field].some(
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
        "Thiếu hoặc sai danh sách phụ tinh gốc/chứng nhận " + field + ".",
      );
  }
  const all = ps.flatMap((p) => fields.flatMap((f) => p[f]));
  if (targets.some((n) => all.filter((st) => st.name === n).length !== 1))
    return result(
      undefined,
      "Danh tính phụ tinh cần thiết thiếu, không chuẩn hoặc trùng.",
    );
  const p = key === "speech" ? life : children,
    names = fields.flatMap((f) => p[f]).map((st) => st.name);
  const yes =
    key === "speech"
      ? targets.every((n) => names.includes(n))
      : targets.some((n) => names.includes(n));
  return result(
    yes ? "yes" : "no",
    key === "speech"
      ? `Mệnh ${life.earthlyBranch}: ${yes ? "cả Văn Xương và Văn Khúc đồng cung" : "không có đủ Xương và Khúc đồng cung"}.`
      : `Tử Nữ ${children.earthlyBranch}: ${yes ? "có Hỏa hoặc Linh tọa thủ; giới hạn khoản bắt buộc/chính đáng PDF619, không đòi độc tọa" : "không có Hỏa/Linh trong danh sách gốc đầy đủ"}.`,
  );
}
export function trungchauFacts(s: ChartSnapshot): DerivedFact[] {
  const keys = ["move", "spend", "speech", "guard"] as const;
  const assessments = Object.fromEntries(
    keys.map((k) => [k, trungchauAssessment(s, k)]),
  ) as Record<(typeof keys)[number], Assessment>;
  const facts: DerivedFact[] = keys.flatMap((key) => {
    const a = assessments[key],
      common = {
        derivationId: TRUNGCHAU_METHOD,
        version: "1.0.0",
        text: a.reason,
        evidencePaths: a.paths.filter((p) => readPath(s, p) !== undefined),
        status: "source-table" as const,
        limitation:
          "Chỉ cấu trúc gốc và ý riêng nguồn Trung Châu; không tổng hợp toàn cung. Guard unknown không thành vắng Hỏa/Linh.",
      };
    return [
      {
        ...common,
        id: trungchauFact(key) + "-status",
        value: a.value ?? "unknown",
      },
      ...(a.value
        ? [{ ...common, id: trungchauFact(key), value: a.value }]
        : []),
    ];
  });
  // One claim/group includes its local limitation; G2 never cuts the guard away.
  facts.push({
    id: trungchauFact("spend") + "-copy",
    derivationId: TRUNGCHAU_METHOD,
    version: "1.0.0",
    value:
      SPEND_COPY +
      (assessments.guard.value === "yes" ? " " + FIRE_BELL_COPY : ""),
    text: assessments.guard.reason,
    evidencePaths: ["chart.palaces", "chart.tanBien.completeness"],
    status: "source-table",
    limitation:
      "PDF618 khoản lớn và SPEND202 ngoài gói; guard thiếu giữ unknown, không suy mọi khoản chi do xung động.",
  });
  return facts;
}
const specs = [
  {
    id: MOVE365,
    key: "move",
    theme: "work",
    title: "Tiến trình công việc — Trung Châu",
    pages: "365,367",
    text: MOVE_COPY,
    condition:
      "Mệnh Sửu hoặc Mùi, Tử Vi AND Phá Quân đồng cung; khung Tài Vũ–Sát/Quan Liêm–Tham/Di Tướng nhất quán.",
    limit:
      "Tả/Hữu giáp hỗ trợ không xóa khuynh hướng; Mùi giảm mâu thuẫn không thành hết đổi việc. Không suy thất nghiệp, số lần, tuổi hoặc thu nhập.",
  },
  {
    id: SPEND201,
    key: "spend",
    theme: "finance",
    title: "Chi tiêu ngoài công việc",
    pages: "201,617,619,626",
    text: "{{fact.wealth-trungchau-spend-copy}}",
    condition:
      "Tử Nữ gốc không có bất kỳ sao nào trong 14 chính tinh; phụ tinh không hủy VCD. Hỏa OR Linh tọa Tử áp giới hạn619, không đòi độc tọa.",
    limit:
      "Chi ngoài hoạt động kiếm tiền của đương số, kể cả sinh hoạt gia đình; không phải đặc tính con hoặc lời về quan hệ con cái. Không dự báo khoản lớn618, không bù thu/giữ hoặc suy tài ròng.",
  },
  {
    id: SPEECH484,
    key: "speech",
    theme: "learning",
    title: "Phản ứng và diễn đạt — Trung Châu",
    pages: "484,733",
    text: SPEECH_COPY,
    condition:
      "Mệnh Sửu hoặc Mùi; Văn Xương AND Văn Khúc gốc cùng tọa Mệnh, không lấy sao hội chiếu.",
    limit:
      "Giữ mô tả hẹp kể cả phá cách; khéo nói không đồng nghĩa chín chắn. Không suy trí tuệ, đạo đức, thành công; không áp Hà Lạc/Phi Tinh ở554/574.",
  },
] as const;
export const trungchauRules = specs.map((x) =>
  ruleSchema.parse({
    id: x.id,
    version: "1.0.0",
    kind: "interpretation",
    topic: x.key === "move" ? "career" : "overview",
    origin: "catalog",
    requiredEngineProfile: ["tanbien-vn-trial-v2"],
    requiredFacts: [
      trungchauFact(x.key),
      ...(x.key === "spend" ? [trungchauFact("spend") + "-copy"] : []),
    ],
    conditions: [{ fact: trungchauFact(x.key), op: "eq", value: "yes" }],
    exceptions: [],
    claimTemplate: x.text,
    evidencePaths: ["chart.palaces", "chart.tanBien.completeness"],
    sourceReferences: [
      {
        id: "trungchau-thien-co-luan",
        title:
          "Nguyễn Anh Vũ — Trung Châu Tử Vi Đẩu Số, Tứ Hóa Phái, phần 2: Thiên Cơ Luận",
        url: "/internal/editorial/trungchau-natal#" + x.key,
        location: "PDF " + x.pages + "; bản817 trang.",
        accessedOn: "2026-10-24",
        rights: "pending",
        rightsNote:
          "Paraphrase trong phạm vi chủ dự án giao QA24/10; không xác nhận quyền thương mại/thẩm định ngoài. SHA256 b1a7ae620d832404330659d7b0f0083f8605887c0bc1e3d358d50e8e17f1c43b.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [x.limit],
    presentation: {
      title: x.title,
      readingTheme: x.theme,
      contentType: "combination",
      sourceConditions: [x.condition],
      projectScope: [
        TRUNGCHAU_METHOD,
        "Cổng toàn vẹn/chứng nhận là kỹ thuật dự án, không nguyên văn nguồn. Dùng dữ kiện engine hiện có, không thêm phi hóa/đại vận.",
        "Chủ dự án duyệt đúng ba ý và tích hợp QA sau kiểm24/10/2026. Owner đầu ra tách cung căn cứ.",
      ],
      readerLimit: x.limit,
      knownExceptions: [x.limit],
      unknownConditions: [
        "Thiếu hoặc bất nhất dữ kiện giữ unknown; nhánh độc lập đủ điều kiện vẫn được xét.",
      ],
      applicability: x.condition,
      sourceScope:
        "Tinh hệ gốc Trung Châu, phương pháp riêng; không gán Tân Biên, Khâm Thiên, Hà Lạc hoặc Phi Tinh.",
    },
  }),
);
