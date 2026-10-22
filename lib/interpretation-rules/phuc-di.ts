import {diVcdFacts, diVcdRules} from './di-vcd';
import data from "./phuc-di-content.json";
import { voidMembership } from "../internal-review/career-definitions";
import type { ChartSnapshot } from "../tuvi-engine";
import type { DerivedFact } from "./derived";
import {
  principalIntegrity,
  CHART_BRANCHES,
} from "../tuvi-engine/chart-integrity";
import { verifiedNatalTransformations } from "../tuvi-engine/natal-transformations";
import { ruleSchema } from "./schema";
export const isSunOccupancy = (r: (typeof data)[number]) => r.palace === "Thiên Di" && ["sun-good", "sun-low"].includes(r.id);
export const DI_VU_TU_MO = "tanbien.di-vu-tu-mo";
export const DI_VU_METHOD = "tanbien-di-vu-tu-mo-1.0.0";
const isVuTuMo = (r: (typeof data)[number]) => r.palace === "Thiên Di" && r.id === "vu-tu-mo";
const isOccupancy = (r: (typeof data)[number]) => isSunOccupancy(r) || isVuTuMo(r);
export const PHUC_DI_METHOD = "tanbien-phuc-di-1.0.0";
export const phucDiBranches = data;
export const branchKey = (r: (typeof data)[number]) =>
  (r.palace === "Phúc Đức" ? "phuc" : "di") + "-" + r.id;
/** Local predicates only: no virtual palace, no opposing-star borrow, no new placement. */
export function phucDiFacts(s: ChartSnapshot): DerivedFact[] {
  const c = s.chart.tanBien?.completeness,
    majorFull =
      c?.majorStars === "complete" && principalIntegrity(s.chart).valid;
  const cert = verifiedNatalTransformations(s.chart),
    out: DerivedFact[] = [];
  for (const r of data) {
    const xs = s.chart.palaces
      .map((p, i) => ({ p, i }))
      .filter((x) => x.p.name === r.palace);
    if (xs.length !== 1) continue;
    const { p, i } = xs[0],
      base = `chart.palaces.${i}`,
      fields = ["majorStars", "minorStars", "adjectiveStars"] as const;
    if (!CHART_BRANCHES.includes(p.earthlyBranch) || !majorFull) continue;
    const all = fields.flatMap((g) => (Array.isArray(p[g]) ? p[g] : [])),
      names = p.majorStars.map((st) => st.name);
    let yes: boolean;
    if (!r.minor)
      yes =
        (isOccupancy(r) || names.length === r.stars.length) &&
        r.stars.every((n) => names.includes(n)) &&
        (!r.branches.length || r.branches.includes(p.earthlyBranch));
    else {
      if (r.id === "thai-tue") {
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
        const ring = (p as typeof p & { suiqian12?: string }).suiqian12;
        if (ring === "Thái Tuế") yes = true;
        else if (
          s.chart.palaces.every((q) =>
            cycle.includes(
              (q as typeof q & { suiqian12?: string }).suiqian12 || "",
            ),
          ) &&
          new Set(
            s.chart.palaces.map(
              (q) => (q as typeof q & { suiqian12?: string }).suiqian12,
            ),
          ).size === 12
        )
          yes = false;
        else continue;
      } else if (r.stars[0].startsWith("Hóa ")) {
        // Certificate disagreement must never be overridden by a positive row.
        if (s.chart.natalTransformations && !cert) continue;
        const hit = all.some(
          (st) =>
            (st as { scope?: string }).scope === "origin" &&
            st.mutagen === r.stars[0].slice(4),
        );
        if (!hit && !cert) continue;
        yes = hit;
      } else {
        const hit = all.some(
          (st) =>
            (st as { scope?: string }).scope === "origin" &&
            st.name === r.stars[0],
        );
        const full =
          c?.minorStars === "complete-with-declared-supplements" &&
          c?.adjectiveStars === "complete-with-declared-supplements" &&
          fields.every(
            (g) =>
              Array.isArray(p[g]) &&
              p[g].every(
                (st) => st && (st as { scope?: string }).scope === "origin",
              ),
          );
        if (!hit && !full) continue;
        yes = hit;
      }
      // §10.5/10.8 gives a specific Ky adjustment: do not emit the general adverse gloss.
      if (
        r.id === "hoa-ky" &&
        names.includes("Thái Dương") &&
        names.includes("Thái Âm")
      )
        yes = false;
      // §10.27 Mã with barriers needs a separate adverse interpretation, not the unqualified §10.24 gloss.
      if (r.palace === "Thiên Di" && r.id === "ma" && yes) {
        const ranges = s.chart.tanBien?.voidRanges;
        if (
          !ranges ||
          ranges.length !== 2 ||
          new Set(ranges.map((v) => v.name)).size !== 2 ||
          ranges.some(
            (v) => voidMembership(p.earthlyBranch, v.branches) === undefined,
          )
        )
          continue;
        if (ranges.some((v) => v.branches.includes(p.earthlyBranch)))
          yes = false;
      }
    }
    if (r.id.startsWith("nhat-nguyet") && yes) {
      if (s.chart.natalTransformations && !cert) continue;
      const hit = all.some(
        (st) =>
          (st as { scope?: string }).scope === "origin" && st.mutagen === "Kỵ",
      );
      if (!hit && !cert) continue;
      yes = r.id.endsWith("-ky") ? hit : !hit;
    }
    const key = branchKey(r);
    out.push({
      id: "fact." + key,
      derivationId: key,
      version: "1.0.0",
      value: yes ? "yes" : "no",
      text: `${r.palace} tại ${p.earthlyBranch}; chính tinh tọa thủ: ${names.join(", ") || "không có"}. ${r.stars.join("–")}${r.minor ? " bản mệnh" : " " + (isOccupancy(r) ? "tọa thủ" : r.stars.length === 1 ? "đơn thủ" : "đồng cung")}${r.branches.length ? " ở " + r.branches.join("/") : ""}: ${yes ? "đúng điều kiện" : "không thỏa điều kiện"}.`,
      evidencePaths: [
        base + ".name",
        base + ".earthlyBranch",
        base + ".majorStars",
        ...(r.minor || r.id.startsWith("nhat-nguyet")
          ? fields.filter((g) => Array.isArray(p[g])).map((g) => base + "." + g)
          : []),
        "chart.tanBien.completeness",
        ...(cert ? ["chart.natalTransformations"] : []),
        ...(r.id === "thai-tue"
          ? s.chart.palaces.map((_, j) => `chart.palaces.${j}.suiqian12`)
          : []),
        ...(r.id === "ma" &&
        r.palace === "Thiên Di" &&
        s.chart.tanBien?.voidRanges
          ? ["chart.tanBien.voidRanges"]
          : []),
      ],
      status: "engine-reported",
      limitation:
        "Dữ kiện snapshot bản mệnh; bảng trạng thái: không sử dụng — nhánh lấy đúng địa chi/tổ hợp được sách nêu.",
    });
  }
  return [...out, ...diVcdFacts(s)];
}
export const phucDiRules = data.map((r) => {
  const key = branchKey(r),
    condition = `${r.stars.join("–")} ${r.minor ? "bản mệnh tọa thủ" : isOccupancy(r) ? "tọa thủ" : r.stars.length === 1 ? "đơn thủ" : "đồng cung"} ${r.palace}${r.branches.length ? " tại " + r.branches.join("/") : ""}`;
  return ruleSchema.parse({
    id: "tanbien." + key,
    version: isSunOccupancy(r) ? "0.2.0" : "0.1.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["tanbien-vn-trial-v2"],
    requiredFacts: ["fact." + key, "fact.source-position-available"],
    conditions: [{ fact: "fact." + key, op: "eq", value: "yes" }],
    exceptions: [],
    claimTemplate: `Theo Tân Biên, ${condition} ${r.text}`,
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "tanbien-supplied-pdf",
        title: "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên",
        url: "/internal/editorial/demo-wuqu-tianfu#source-list",
        location: isVuTuMo(r) ? "Trang PDF236 §20.12, gạch cuối; ngữ cảnh235–236; đối chiếu175 §10.4 và176 §10.9. Tân Biên bản277 trang, SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc. Định nghĩa tọa thủ PDF33; Tứ Mộ: Thìn/Tuất/Sửu/Mùi." : `PDF/trang in ${r.page}, §${r.section}; toàn mục ${r.palace === "Phúc Đức" ? "6 (132–148)" : "10 (174–180)"}. Định nghĩa tọa thủ/đơn thủ/đồng cung: PDF33 §2.6–2.8.`,
        accessedOn: r.id === "luong-ty-hoi-movement" ? "2026-10-22" : isVuTuMo(r) ? "2026-10-19" : "2026-10-13",
        rights: "pending",
        rightsNote:
          "Đối chiếu văn bản và ảnh; chú giải biên soạn, không phải phê duyệt chuyên môn.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chú giải cục bộ của nguồn truyền thống, chưa có phép phối hợp mọi yếu tố của cung.",
      "Không dùng các câu về tuổi thọ, cách chết, bệnh tật hoặc phẩm hạnh người thân để nhận định thực tế; phần bị loại được ghi trong đặc tả nguồn.",
    ],
    presentation: {
      title: condition,
      readingTheme: r.palace === "Phúc Đức" ? "phuc" : "di",
      contentType: r.minor
        ? "element-gloss"
        : r.stars.length > 1
          ? "combination"
          : "element-gloss",
      sourceConditions: [
        condition,
        ...(r.id.startsWith("nhat-nguyet")
          ? [
              r.id.endsWith("-ky")
                ? "Có Hóa Kỵ bản mệnh cùng cung."
                : "Có chứng nhận hợp lệ xác nhận không có Hóa Kỵ bản mệnh cùng cung.",
            ]
          : []),
      ],
      projectScope: [
        isVuTuMo(r) ? DI_VU_METHOD : isSunOccupancy(r) ? "tanbien-di-sun-occupancy-1.1.0" : PHUC_DI_METHOD,
        "Trạng thái: none. Không dùng brightness của engine hoặc bảng tác giả khác.",
        "Cung thật; không mở rộng sang chiếu. Chính tinh đơn thủ yêu cầu đúng một sao và chứng cứ danh sách đầy đủ.",
        ...(isVuTuMo(r) ? ["§20.12 dùng tọa thủ tại Tứ Mộ: không yêu cầu đơn thủ, độ sáng, can hoặc giới tính. Không tự thêm điều kiện vắng Tuần/Triệt hoặc sát tinh.", "Bổ sung nghĩa về hoạt động buôn bán; không thay hay hóa giải lời §10.4/10.9 hoặc Hóa Kỵ. Ngữ cảnh xét Mệnh–Thân–Di–Tài–Quan chưa thành phép tổng hợp."] : []),
        ...(isSunOccupancy(r)
          ? [
              "§10.5 dùng tọa thủ: không thêm điều kiện đơn thủ. Các lời tổ hợp vẫn độc lập, không suy lời này thay thế chúng.",
            ]
          : []),
      ],
      readerLimit:
        "Đây là chú giải có điều kiện trong sách, chưa phải kết luận toàn cung hoặc xác nhận sự việc thực tế.",
      knownExceptions:
        r.id === "hoa-ky"
          ? [
              "Không xuất nhánh Kỵ chung khi Nhật–Nguyệt đồng cung; nhánh cụ thể của đúng cung được giữ riêng.",
            ]
          : r.id === "nhat-nguyet"
            ? [
                "Hóa Kỵ đồng cung chuyển sang nhánh §6.1.43, không xuất đồng thời hai nhánh.",
              ]
            : r.id === "ma" && r.palace === "Thiên Di"
              ? [
                  "Có Tuần/Triệt trực tiếp: không xuất nhánh Mã chung, phần §10.27 chưa đưa lời về tai nạn vào sản phẩm.",
                ]
              : [],
      unknownConditions: [
        "Chưa có phép hợp nhất mọi nhận định cùng cung và liên cung.",
      ],
      applicability: "Đủ điều kiện vị trí, tổ hợp và dữ kiện bản mệnh.",
      sourceScope:
        "Chỉ " +
        r.palace +
        "; không chuyển thành lời Mệnh, Tài Bạch hoặc luận vận.",
    },
  });
}).concat(diVcdRules);
