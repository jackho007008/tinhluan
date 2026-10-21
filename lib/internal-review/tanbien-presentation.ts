import {approvedKinBranches} from '../interpretation-rules/kin-approved';
import {kinExtensionBranches} from '../interpretation-rules/kin-extension';
import {childrenVcdBranches,childrenVcdFacts} from '../interpretation-rules/children-vcd';
import {familyVcdBranches,familyVcdKey,familyVcdAssessment} from '../interpretation-rules/family-vcd';
import {bookState} from '../tuvi-engine/tanbien';
import {completionFacts} from '../interpretation-rules/natal-completion';
import {lifeLiteraryFacts,M05} from '../interpretation-rules/life-literary';
import {nplLocalFacts} from '../interpretation-rules/npl-local-adjustments';
import {nplFoundationFacts,nplTwoV2Facts,NPL_FOUNDATION_TABLES,NPL_ELEMENT_V2} from '../interpretation-rules/npl-foundation';
import {nplTwoFacts,NPL_STAR_ELEMENTS,NPL_NAP_AM,NPL_ELEMENT_VERSION} from '../interpretation-rules/npl-two-major';
import {lifeBodyFacts} from '../interpretation-rules/life-body-method';
import {retentionFacts} from '../interpretation-rules/finance-retention';
import {voidBranches,voidAssessment} from '../interpretation-rules/void-palace';
import {kinRules,kinBranches,kinKey,kinCondition,kinAssessment} from '../interpretation-rules/phu-tu';
import {familyRules,familyBranches,familyKey,familyCondition,familyAssessment} from '../interpretation-rules/phu-huynh';
import {noDienFacts,noDienBranches,noDienKey,noDienCondition,noDienAssessment} from "../interpretation-rules/no-dien";
import {phucDiFacts,phucDiBranches,branchKey,isSunOccupancy} from "../interpretation-rules/phuc-di";
import {emptyLifeTrineRules} from '../interpretation-rules/tanbien-empty-life';
import { verifiedNatalTransformations } from '../tuvi-engine/natal-transformations';
import { lifeQuyenFact } from '../interpretation-rules/life-quyen-fact';
import {lifeContentFacts} from "../interpretation-rules/life-content-facts";
import {allLifeExpansionBranches,lifeHamBranches} from "../interpretation-rules/tanbien-life-content";
import { financeSupplementFacts } from "../interpretation-rules/finance-supplement-facts";
import { financeSupplements } from "../interpretation-rules/tanbien-finance-content";
import { careerClosingFacts, careerClosingBranches } from "../interpretation-rules/career-closing";
import { occupationalCareerFacts, occupationalBranches } from "../interpretation-rules/career-occupations";
import { independentCareerFacts, independentBranches } from "../interpretation-rules/career-independent";
import { careerKyFacts } from "../interpretation-rules/career-ky-facts";
import { careerQuyenFact } from "../interpretation-rules/career-quyen-fact";
import { emptyLifeFacts } from "../interpretation-rules/life-empty-facts";
import { careerContent } from "../interpretation-rules/tanbien-career-content";
import { careerSourceGate } from "../interpretation-rules/derived";
import type { ChartSnapshot, Star } from "../tuvi-engine";
import type { Rule, Condition } from "../interpretation-rules/schema";
import {
  tanBienTable,
  tanBienLifeTables,
} from "../interpretation-rules/tanbien-source";
export const PRESENTATION_VERSION = "1.14.0";
export type ReadingEvidence = {
  text: string;
  kind: "snapshot" | "geometry" | "source" | "editorial";
  paths: string[];
};
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
const fields = ["majorStars", "minorStars", "adjectiveStars"] as const;
type Field = (typeof fields)[number];
export function uniquePalace(s: ChartSnapshot, name: string) {
  const found = s.chart.palaces
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p.name === name);
  return found.length === 1 ? found[0] : undefined;
}
function validStars(stars: unknown): stars is Star[] {
  return (
    Array.isArray(stars) &&
    stars.every((s) => s && typeof s.name === "string" && s.name.trim()) &&
    new Set(stars.map((s) => s.name)).size === stars.length
  );
}
const item = (
  text: string,
  paths: string[] = [],
  kind: ReadingEvidence["kind"] = "snapshot",
): ReadingEvidence => ({ text, paths, kind });
export function palaceLocation(
  s: ChartSnapshot,
  name: string,
): ReadingEvidence {
  const x = uniquePalace(s, name);
  return x && branches.includes(x.p.earthlyBranch)
    ? item(`${name} tại ${x.p.earthlyBranch}.`, [
        `chart.palaces.${x.i}.name`,
        `chart.palaces.${x.i}.earthlyBranch`,
      ])
    : item(`Chưa có dữ liệu xác định vị trí ${name}.`);
}
export function palaceStars(
  s: ChartSnapshot,
  name: string,
  field: Field = "majorStars",
): ReadingEvidence {
  const x = uniquePalace(s, name),
    label = field === "majorStars" ? "chính tinh" : "phụ tinh";
  if (!x || !validStars(x.p[field]))
    return item(`Chưa có dữ liệu xác định danh sách ${label} tại ${name}.`);
  const names = x.p[field].map((s) => s.name);
  return item(
    names.length === 1 && field === "majorStars"
      ? `${name} có một chính tinh là ${names[0]}.`
      : names.length
        ? `${label[0].toUpperCase() + label.slice(1)} tại ${name}: ${names.join(", ")}.`
        : `Danh sách ${label} tại ${name} được ghi rỗng.`,
    [`chart.palaces.${x.i}.name`, `chart.palaces.${x.i}.${field}`],
  );
}
export function bodyLocation(s: ChartSnapshot): ReadingEvidence {
  const found = s.chart.palaces
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p.isBodyPalace === true);
  if (
    found.length !== 1 ||
    s.chart.palaces.some((p) => typeof p.isBodyPalace !== "boolean")
  )
    return item("Chưa có dữ liệu xác định duy nhất vị trí Thân.");
  const { p, i } = found[0];
  return item(
    `Thân cư ${p.name}${branches.includes(p.earthlyBranch) ? ` tại ${p.earthlyBranch}` : " (chưa xác định địa chi)"}.`,
    [
      `chart.palaces.${i}.name`,
      ...(branches.includes(p.earthlyBranch)
        ? [`chart.palaces.${i}.earthlyBranch`]
        : []),
      `chart.palaces.${i}.isBodyPalace`,
    ],
  );
}
// Branch distance only. No brightness, school-specific hội chiếu, or goodness inference.
export function palaceGeometry(
  s: ChartSnapshot,
  from: string,
  to: string,
): ReadingEvidence | undefined {
  const ps = s.chart.palaces;
  if (
    ps.length !== 12 ||
    ps.some((p) => !branches.includes(p.earthlyBranch)) ||
    new Set(ps.map((p) => p.earthlyBranch)).size !== 12 ||
    new Set(ps.map((p) => p.name)).size !== 12
  )
    return;
  const a = uniquePalace(s, from),
    b = uniquePalace(s, to);
  if (!a || !b) return;
  const delta =
    (branches.indexOf(b.p.earthlyBranch) -
      branches.indexOf(a.p.earthlyBranch) +
      12) %
    12;
  const relation =
    delta === 0
      ? "cùng cung"
      : delta === 6
        ? "đối cung"
        : [4, 8].includes(delta)
          ? "tam hợp"
          : null;
  if (!relation) return;
  return item(
    `${to} tại ${b.p.earthlyBranch} ${relation} với ${from} tại ${a.p.earthlyBranch} (quan hệ vị trí, không phải đánh giá tốt/xấu).`,
    ps.flatMap((_, i) => [
      `chart.palaces.${i}.name`,
      `chart.palaces.${i}.earthlyBranch`,
    ]),
    "geometry",
  );
}
export function familyScope(
  s: ChartSnapshot,
): "supported" | "outside" | "unknown" {
  const x = uniquePalace(s, "Mệnh");
  if (!x || !validStars(x.p.majorStars)) return "unknown";
  return x.p.majorStars.some((x) => ["Vũ Khúc", "Thiên Phủ"].includes(x.name))
    ? "supported"
    : "outside";
}
const factLabels: Record<string, string> = {
 "fact.life-npl-local-liem-tuong":"Liêm Trinh–Thiên Tướng đồng cung Mệnh",
 "fact.life-npl-local-khoa-kiep":"Hóa Khoa–Địa Kiếp đồng cung Mệnh",
 "fact.life-body-position":"vị trí cung an Thân",
 "fact.life-body-relation":"quan hệ vị trí Mệnh–Thân",
 "fact.life-complete-major-count":"số chính tinh Mệnh trong danh sách bản mệnh đầy đủ",
 "fact.life-opposite-branch":"địa chi đối cung Mệnh",
 "fact.life-opposite-majors":"chính tinh tại đối cung Mệnh",
 "fact.life-opposite-major-count":"số chính tinh đối cung trong danh sách đầy đủ",
 "fact.life-opposite-sun-moon-light":"trạng thái Nhật–Nguyệt đối cung theo bảng Tân Biên",
  "fact.life-branch": "địa chi Mệnh",
  "fact.tanbien-ziwei-eligible": "trạng thái Tử Vi theo bảng Tân Biên",
  "fact.tanbien-tianxiang-eligible":
    "trạng thái Thiên Tướng theo bảng Tân Biên",
  "fact.life-stars": "chính tinh tại Mệnh",
  "fact.life-minor-stars": "phụ tinh tại Mệnh",
  "fact.tanbien-wuqu-eligible":
    "trạng thái Vũ Khúc tại địa chi Mệnh theo bảng Tân Biên",
  "fact.life-wuqu-origin-mutagen": "tứ hóa bản mệnh của Vũ Khúc tại Mệnh",
  "fact.career-stars": "chính tinh tại Quan Lộc",
  "fact.career-major-count": "số chính tinh tại Quan Lộc",
  "fact.career-minor-stars": "phụ tinh tại Quan Lộc",
  "fact.career-branch-groups": "địa chi Quan Lộc",
  "fact.career-boshi": "vòng Bác Sỹ bản mệnh tại Quan Lộc",
  "fact.career-suiqian": "vòng Thái Tuế bản mệnh tại Quan Lộc",
  "fact.career-source-available": "phạm vi nguồn an chính tinh (Cục/ngày âm)",
  "fact.wealth-stars": "chính tinh tại Tài Bạch",
  "fact.wealth-branch-groups": "địa chi Tài Bạch",
  "fact.wealth-origin-mutagens": "Tứ Hóa bản mệnh tại Tài Bạch",
  "fact.career-origin-ky": "Hóa Kỵ bản mệnh tại Quan Lộc",
  "fact.career-ky-sun-moon-exception": "ngoại lệ Nhật–Nguyệt tại Quan Lộc Sửu/Mùi",
  "fact.career-origin-quyen-position": "vị trí Hóa Quyền bản mệnh tại Quan Lộc",
  "fact.life-mao-dau": "địa chi Mệnh (Mão hoặc Dậu)",
  "fact.wealth-major-count": "số chính tinh tại Tài Bạch",
  "fact.wealth-branch-group": "địa chi Tài Bạch",
  "fact.wealth-minor-stars": "phụ tinh tại Tài Bạch",
};
export function conditionText(c: Condition): string {
  const children=childrenVcdBranches.slice(6).find(r=>c.fact==='fact.children-vcd-'+r.id);if(children)return `Tử Nữ không có chính tinh; đúng cặp ${children.stars.join('–')} tại Điền Trạch xung chiếu, không chuyển phụ tinh.`;
  const vcd=familyVcdBranches.find(r=>c.fact==='fact.'+familyVcdKey(r));if(vcd)return `${vcd.palace} không có chính tinh; đúng cả cặp ${vcd.stars.join('–')} bản mệnh xung chiếu.`;
  if(c.fact === "fact.life-literary-m05")return "Nam mệnh; Vũ miếu/vượng/đắc tọa Mệnh, Xương hoặc Khúc đồng cung theo Tân Biên.";
  if(c.fact === "fact.life-literary-m07")return "Kỵ bản mệnh tọa Mệnh Tý/Hợi; Khoa bản mệnh đồng cung hoặc xung chiếu.";
  const kin=[...kinBranches,...kinExtensionBranches.slice(9),...approvedKinBranches].find(r=>c.fact==='fact.'+kinKey(r)); if(kin)return kinCondition(kin);
  const fam=familyBranches.find(r=>c.fact==='fact.'+familyKey(r)); if(fam)return familyCondition(fam);
  const nd=noDienBranches.find(r=>c.fact==='fact.'+noDienKey(r));
  if(nd)return noDienCondition(nd)+' — đúng cung bản mệnh; điều chỉnh Tuần/Triệt được kiểm tra riêng.';
  const pd=phucDiBranches.find(r=>c.fact==='fact.'+branchKey(r));
  if(pd)return pd.stars.join('–')+' bản mệnh tại '+pd.palace+(pd.branches.length?' ở '+pd.branches.join('/'):'')+(pd.minor?'':isSunOccupancy(pd)?' — tọa thủ, không yêu cầu đơn thủ.':pd.stars.length===1?' — danh sách đầy đủ và đúng một chính tinh.':' — các chính tinh đồng cung, không mượn sao cung chiếu.');
  const life=allLifeExpansionBranches.find(s=>c.fact==="fact.life-batch-"+s.id);
  if(life)return life.title+" — sao bản mệnh, đúng vị trí"+(life.state?" và trạng thái "+life.state+" theo bảng Tân Biên":"")+".";
  if(c.fact === "fact.life-birth-stem-group") return "Can năm sinh âm lịch là Canh hoặc Nhâm.";
  if (c.fact === "fact.life-hoi-ty") return "Cung Mệnh phải ở Hợi hoặc Tý.";
  if (c.fact === "fact.tanbien-taiyang-state")
    return "Thái Dương phải ở hãm địa theo bảng Tân Biên, không lấy nhãn engine thay thế.";
  if (c.fact === "fact.tanbien-ziwei-eligible")
    return "Tử Vi tại Mệnh phải ở miếu hoặc bình hòa theo bảng Tân Biên.";
  if (c.fact === "fact.tanbien-tianxiang-eligible")
    return "Thiên Tướng tại Mệnh phải ở miếu/vượng/đắc theo bảng Tân Biên.";
  for (const [key, table] of Object.entries(tanBienLifeTables))
    if (c.fact === `fact.tanbien-${key}-eligible`)
      return `${table.star} tại Mệnh phải ở ${table.eligible.join(" hoặc ")} theo bảng Tân Biên (phạm vi thực thi của rule).`;
  if (c.fact === "fact.life-mao-dau") return "Cung Mệnh phải ở Mão hoặc Dậu.";
  if(c.fact==='fact.finance-single-complete')return 'Danh sách chính tinh bản mệnh đầy đủ, đúng một sao tại Tài Bạch (phạm vi sản phẩm thu hẹp).';
  if(c.fact==='fact.finance-origin-ky') return 'Có Hóa Kỵ bản mệnh tại chính Tài Bạch, với chứng nhận không mâu thuẫn nếu được cung cấp.';
  if(c.fact==='fact.finance-npl-thien-khong')return 'Thiên Không bản mệnh tọa thủ Tài Bạch; không phải Địa Không, không mở rộng sang hội chiếu.';
  const finance=financeSupplements.find(r=>c.fact==='fact.finance-extra-'+r.id);
  if(finance)return finance.title+' — đúng vị trí bản mệnh.'+(finance.id==='ky-general'?' Danh sách chính tinh đầy đủ loại trường hợp Nhật–Nguyệt đồng cung.':'');
  const independent = [...independentBranches, ...occupationalBranches, ...careerClosingBranches].find(r => c.fact === "fact.career-"+r.id);
  if(independent) return independent.title + " — đủ điều kiện bản mệnh.";
  const label = factLabels[c.fact] || "dữ kiện cần kiểm tra";
  if (c.op === "exists") return `Cần xác định ${label}.`;
  if (c.fact === "fact.tanbien-wuqu-eligible" && c.value === "eligible")
    return "Vũ Khúc ở miếu, vượng hoặc đắc theo bảng Tân Biên; không dùng nhãn độ sáng đang lưu trên lá số thay thế.";
  if (c.fact === "fact.wealth-branch-group" && c.value === "dan-than")
    return "Tài Bạch phải ở Dần hoặc Thân.";
  if (c.fact === "fact.life-major-count")
    return "Mệnh có đúng một chính tinh; phụ tinh không làm mất điều kiện này (phạm vi dự án thu hẹp).";
  if (c.fact === "fact.career-major-count")
    return "Quan Lộc có đúng một chính tinh; phụ tinh không làm mất điều kiện độc thủ.";
  if (c.fact === "fact.career-branch-groups")
    return `Quan Lộc ở ${String(c.value).split("/").join(" hoặc ")}.`;
  if (c.fact === "fact.wealth-branch-groups") return `Tài Bạch ở ${String(c.value).split("/").join(" hoặc ")}.`;
  if (c.fact === "fact.wealth-major-count")
    return `Tài Bạch phải có đúng ${c.value} chính tinh; phụ tinh không làm mất điều kiện ‘độc thủ’.`;
  if(c.fact === "fact.career-origin-ky") return "Có Hóa Kỵ bản mệnh tại chính Quan Lộc.";
  if(c.fact === "fact.career-ky-sun-moon-exception") return "Cả Thái Dương và Thái Âm bản mệnh đồng cung Quan Lộc tại Sửu hoặc Mùi.";
  if (c.fact === "fact.career-origin-quyen-position" && c.value === "present")
    return "Có sao được ghi Hóa Quyền ở lớp bản mệnh tại chính cung Quan Lộc.";
  if (c.fact === "fact.life-wuqu-origin-mutagen" && c.value === "Quyền")
    return "Vũ Khúc tại Mệnh phải được ghi Hóa Quyền ở lớp bản mệnh.";
  return c.op === "includes"
    ? `Danh sách ${label} phải có ${c.value}.`
    : `Điều kiện về ${label}: ${c.value}.`;
}
export function factEvidence(s: ChartSnapshot, id: string): ReadingEvidence {
 const children=childrenVcdBranches.slice(6).find(r=>id==='fact.children-vcd-'+r.id);if(children){const f=childrenVcdFacts(s).find(f=>f.id===id);return f?item(f.text,f.evidencePaths,'snapshot'):item('Chưa đủ dữ kiện chính tinh và quan hệ xung chiếu để kiểm tra nhánh Tử Nữ này.');}
 const vcd=familyVcdBranches.find(r=>id==='fact.'+familyVcdKey(r));if(vcd){const a=familyVcdAssessment(s,vcd);return item(a.text,a.paths,a.cause==='unresolved-adjustment'?'editorial':'snapshot');}
 if(id.startsWith("fact.life-literary-")){const f=lifeLiteraryFacts(s).find(f=>f.id===id);return f?item(f.text,f.evidencePaths,"source"):item("Chưa đủ dữ kiện nhất quán để kiểm tra nhánh văn tinh/Tứ Hóa tại Mệnh.");}
 if(id.startsWith("fact.life-npl-local-")){const f=nplLocalFacts(s).find(f=>f.id===id);return f?item(f.text,f.evidencePaths,"snapshot"):item("Chưa có đủ dữ kiện nhất quán để kiểm tra quan hệ đồng cung bản mệnh này.");}
 if(id.startsWith("fact.life-npl-foundation-")||id.startsWith("fact.life-npl-two-v2-")){const f=[...nplFoundationFacts(s),...nplTwoV2Facts(s)].find(f=>f.id===id);return f?item(f.text,f.evidencePaths,"source"):item("Chưa đủ dữ kiện nhất quán cho phép xét ngũ hành này.");}
 if(id.startsWith("fact.life-npl-two-")){const f=nplTwoFacts(s).find(f=>f.id===id);return f?item(f.text,f.evidencePaths,"source"):item("Chưa đủ dữ kiện hoặc bảng NPL nhất quán để xét hai chính tinh với Bản Mệnh.");}
 if(["fact.life-body-position","fact.life-body-relation"].includes(id)){const f=lifeBodyFacts(s).find(f=>f.id===id);return f?item(f.text,f.evidencePaths,"snapshot"):item("Chưa đủ dữ kiện nhất quán để xác định vị trí hoặc quan hệ Mệnh–Thân.");}
 const vb=voidBranches.find(r=>id==='fact.'+r.key); if(vb){const a=voidAssessment(s,vb);return item(a.text,a.paths,a.cause==='unresolved-adjustment'?'editorial':'snapshot');}
  const kin=[...kinBranches,...kinExtensionBranches.slice(9),...approvedKinBranches].find(r=>id==='fact.'+kinKey(r));if(kin){const a=kinAssessment(s,kin);return item(a.text,a.paths,'snapshot');}
  const fam=familyBranches.find(r=>id==='fact.'+familyKey(r));if(fam){const a=familyAssessment(s,fam);return item(a.text,a.paths,a.cause==='unresolved-adjustment'?'editorial':'snapshot');}
  const nd=noDienBranches.find(r=>id==='fact.'+noDienKey(r));
  if(nd){const a=noDienAssessment(s,nd);return item(a.text,a.paths,a.cause==='unresolved-adjustment'?'editorial':'snapshot');}
  const kyFact = [...completionFacts(s),...retentionFacts(s),...noDienFacts(s),...phucDiFacts(s),...lifeContentFacts(s),...careerKyFacts(s), ...independentCareerFacts(s), ...occupationalCareerFacts(s), ...careerClosingFacts(s), ...financeSupplementFacts(s)].find(f=>f.id===id);
  if(kyFact) return item(kyFact.text,kyFact.evidencePaths,lifeHamBranches.some(x=>id==="fact.life-batch-"+x.id)?"source":"snapshot");
  const emptyFact = emptyLifeFacts(s).find(f=>f.id===id);
  if (emptyFact) return item(emptyFact.text,emptyFact.evidencePaths,emptyFact.status==="source-table"?"source":"snapshot");
  if(id === "fact.life-branch") return palaceLocation(s,"Mệnh");
  if(id === "fact.life-birth-stem-group") {
    const stem=s.chart.tanBien?.inputs.yearStem;
    return stem ? item(`Can năm sinh âm lịch đã lưu: ${stem}.`,["chart.tanBien.inputs.yearStem"]) : item("Hồ sơ thiếu can năm sinh âm lịch.");
  }
  if (["fact.career-source-available", "fact.source-position-available"].includes(id)) {
    const gate = careerSourceGate(s);
    return item(gate.reason, gate.available ? gate.paths : [], "editorial");
  }
  if (id === "fact.career-major-count") return palaceStars(s, "Quan Lộc");
  if (id === "fact.career-minor-stars")
    return palaceStars(s, "Quan Lộc", "minorStars");
  if (id === "fact.career-branch-groups") return palaceLocation(s, "Quan Lộc");
  if (["fact.career-boshi", "fact.career-suiqian"].includes(id)) {
    const x = uniquePalace(s, "Quan Lộc"),
      key = id.endsWith("boshi") ? "boshi12" : "suiqian12";
    return x &&
      typeof (x.p as typeof x.p & Record<typeof key, string>)[key] ===
        "string" &&
      (x.p as typeof x.p & Record<typeof key, string>)[key].trim()
      ? item(
          `Quan Lộc ghi ${(x.p as typeof x.p & Record<typeof key, string>)[key]} ở vòng ${key === "boshi12" ? "Bác Sỹ" : "Thái Tuế"} bản mệnh.`,
          [`chart.palaces.${x.i}.name`, `chart.palaces.${x.i}.${key}`],
        )
      : item("Chưa có dữ liệu xác định vòng sao bản mệnh tại Quan Lộc.");
  }
  for (const [key, table] of Object.entries(tanBienLifeTables))
    if (
      id === `fact.tanbien-${key}-eligible` ||
      (key === "taiyang" && id === "fact.tanbien-taiyang-state")
    ) {
      const x = uniquePalace(s, "Mệnh");
      const state =
        x && Object.hasOwn(table.states, x.p.earthlyBranch)
          ? table.states[x.p.earthlyBranch]
          : undefined;
      return x && state
        ? item(
            `${table.star} tại ${x.p.earthlyBranch}: ${state} theo Tân Biên.`,
            [`chart.palaces.${x.i}.earthlyBranch`],
            "source",
          )
        : item(
            `Chưa có dữ liệu xác định trạng thái ${table.star} theo bảng Tân Biên.`,
            [],
            "source",
          );
    }
  const mapping: Record<string, [string, Field]> = {
    "fact.life-stars": ["Mệnh", "majorStars"],
    "fact.life-minor-stars": ["Mệnh", "minorStars"],
    "fact.career-stars": ["Quan Lộc", "majorStars"],
    "fact.wealth-stars": ["Tài Bạch", "majorStars"],
    "fact.wealth-minor-stars": ["Tài Bạch", "minorStars"],
  };
  if (mapping[id]) return palaceStars(s, ...mapping[id]);
  if (id === "fact.life-hoi-ty") return palaceLocation(s, "Mệnh");
  if (id === "fact.life-mao-dau") return palaceLocation(s, "Mệnh");
  if (id === "fact.life-major-count") return palaceStars(s, "Mệnh");
  if (id === "fact.wealth-branch-groups") return palaceLocation(s, "Tài Bạch");
  if (id === "fact.career-origin-quyen-position") {
    const fact = careerQuyenFact(s)[0];
    return item(fact?.text || "Chưa đủ metadata xác định Hóa Quyền bản mệnh tại Quan Lộc; không suy là vắng mặt.", fact?.evidencePaths || []);
  }
  if (id === "fact.wealth-origin-mutagens") {
    const x = uniquePalace(s, "Tài Bạch");
    const hits = x ? ["majorStars","minorStars"].flatMap(f => (x.p[f as Field] || []).filter(st => (st as { scope?: string }).scope === "origin" && st.mutagen).map(st => `${st.name} Hóa ${st.mutagen}`)) : [];
    return item(hits.length ? `Tại Tài Bạch: ${hits.join(", ")} (bản mệnh).` : "Chưa ghi nhận Tứ Hóa bản mệnh đủ metadata tại Tài Bạch.", x ? [`chart.palaces.${x.i}.majorStars`, `chart.palaces.${x.i}.minorStars`] : []);
  }
  if (id === "fact.wealth-major-count") return palaceStars(s, "Tài Bạch");
  if (id === "fact.wealth-branch-group") return palaceLocation(s, "Tài Bạch");
  if (id === "fact.tanbien-wuqu-eligible") {
    const x = uniquePalace(s, "Mệnh"),
      state =
        x && Object.hasOwn(tanBienTable.states, x.p.earthlyBranch)
          ? tanBienTable.states[x.p.earthlyBranch]
          : undefined;
    return x && state
      ? item(
          `Vũ Khúc tại ${x.p.earthlyBranch}: ${state} theo bảng Tân Biên.`,
          [`chart.palaces.${x.i}.earthlyBranch`],
          "source",
        )
      : item(
          "Chưa có dữ liệu xác định trạng thái Vũ Khúc theo bảng Tân Biên.",
          [],
          "source",
        );
  }
  if (id === "fact.life-wuqu-origin-mutagen") {
    const fact = lifeQuyenFact(s)[0];
    if (fact) return item(fact.text, fact.evidencePaths);
    return item("Chưa đủ bằng chứng nhất quán để xác định Hóa Quyền bản mệnh của Vũ Khúc tại Mệnh; không suy thành vắng Hóa Quyền.");
  }
  return item(
    factLabels[id] ? `Hồ sơ chưa cung cấp dữ kiện ${factLabels[id]}.` : `Phần trình bày căn cứ chưa có ánh xạ cho dữ kiện ${id}; không thể kết luận hồ sơ thiếu dữ liệu.`,
  );
}
export const ruleTitles: Record<string, string> = {
  "tanbien.r10": "Liêm Trinh tại Mệnh",
  "tanbien.r11": "Tham Lang tại Mệnh",
  "tanbien.r12": "Cự Môn tại Mệnh",
  "tanbien.r13": "Thiên Cơ tại Mệnh",
  "tanbien.r14": "Thái Dương tại Mệnh",
  "tanbien.r15": "Thiên Đồng tại Mệnh",
  "tanbien.r16": "Thái Âm tại Mệnh",
  "tanbien.r17": "Thiên Lương tại Mệnh",
  "tanbien.r18": "Thất Sát tại Mệnh",
  "tanbien.r19": "Phá Quân tại Mệnh",
  "tanbien.r20": "Cơ–Cự–Lộc Tồn tại Mệnh",
  "tanbien.r21": "Thái Dương tại Mệnh Hợi/Tý",
  "tanbien.r08": "Tử Vi tại Mệnh",
  "tanbien.r09": "Thiên Tướng tại Mệnh",
  "tanbien.r01": "Vũ Khúc tại Mệnh",
  "tanbien.r02": "Vũ Khúc và Văn Khúc tại Mệnh",
  "tanbien.r03": "Thiên Phủ tại Mệnh",
  "tanbien.r04": "Hóa Quyền tại Mệnh",
  "tanbien.r05": "Tử Vi và Thiên Tướng tại Quan Lộc",
  "tanbien.r22": "Thiên Cơ và Thiên Lương tại Quan Lộc",
  "tanbien.r06": "Liêm Trinh độc thủ tại Tài Bạch",
  "tanbien.r07": "Lộc Tồn tại Tài Bạch",
};
export function uniqueEvidence(items: ReadingEvidence[]) {
  return [...new Map(items.map((x) => [x.text, x])).values()];
}
export function ruleEvidence(s: ChartSnapshot, rule: Rule) {
  const name =
    rule.presentation?.readingTheme === "work"
      ? "Quan Lộc"
      : rule.presentation?.readingTheme === "finance"
        ? "Tài Bạch"
        : rule.presentation?.readingTheme === "phuc" ? "Phúc Đức" : rule.presentation?.readingTheme === "di" ? "Thiên Di" : rule.presentation?.readingTheme === "no" ? "Nô Bộc" : rule.presentation?.readingTheme === "dien" ? "Điền Trạch" : rule.presentation?.readingTheme === "parents" ? "Phụ Mẫu" : rule.presentation?.readingTheme === "spouse" ? "Phu Thê" : rule.presentation?.readingTheme === "children" ? "Tử Nữ" : rule.presentation?.readingTheme === "siblings" ? "Huynh Đệ" : "Mệnh";
  return {
    contentLabel: rule.presentation?.conditionalAssessment ? "Chú giải có điều kiện — chưa xác định, kết quả chưa áp dụng" :
      rule.presentation?.contentType === "context"
        ? "Chú giải nền theo nhánh nguồn — chưa kết luận"
        : [
              "tanbien.r05",
              "tanbien.r20",
              "tanbien.r22",
              "tanbien.r23",
              "tanbien.r27",
              "tanbien.r38",
              "tanbien.r39",
            ].includes(rule.id)
          ? "Nhận định phối hợp có điều kiện"
          : rule.presentation?.contentType === "combination"
            ? "Nhận định theo điều kiện cụ thể"
            : "Chú giải nền / biểu tượng riêng",
    sourceConditions: rule.presentation?.sourceConditions || [],
    projectScope: rule.presentation?.projectScope || [],
    title:
      ruleTitles[rule.id] ||
      rule.presentation?.title?.replace(/^R\d+ · /, "") ||
      "Nhận định theo nguồn",
    facts: uniqueEvidence([
      palaceLocation(s, name),
      ...rule.requiredFacts.map((id) => factEvidence(s, id)),
    ]),
    contextNotes:
      name === "Mệnh"
        ? [...sourceNamingNotes(s), ...nearbyNotes(s, rule.id)]
        : [],
    conditions: rule.conditions.map(conditionText),
    limits: rule.limitations
      .filter((l) => !l.includes(tanBienTable.id))
      .map((l) =>
        l
          .replace("scope origin", "lớp bản mệnh")
          .replace("S1", "Tân Biên")
          .replace(
            "Điều kiện cục bộ; ngoại lệ chưa đầy đủ, danh sách ngoại lệ rỗng không chứng minh không có ngoại lệ.",
            "Phạm vi điều chỉnh và ngoại lệ chưa được tổng hợp đầy đủ.",
          ),
      ),
    sources: rule.sourceReferences.map((source) => ({
      ...source,
      location: source.location
        .replace(/Tr\./g, "PDF / trang in ")
        .replace(/; hồ sơ HTML.*$/, ""),
    })),
  };
}
export function missingText(ids: string[]) {
  return ids.map(
    (id) =>
      `Chưa có dữ liệu xác định ${factLabels[id] || "căn cứ cần thiết cho nhận định"}.`,
  );
}

export function readingContext(
  s: ChartSnapshot,
  section: "structure" | "action" | "learning" | "work" | "finance" | "phuc" | "di" | "no" | "dien" | "parents" | "siblings" | "spouse" | "children",
) {
  const focus =
    section === "work"
      ? "Quan Lộc"
      : section === "finance"
        ? "Tài Bạch"
        : section === "phuc" ? "Phúc Đức" : section === "di" ? "Thiên Di" : section === "no" ? "Nô Bộc" : section === "dien" ? "Điền Trạch" : section === "parents" ? "Phụ Mẫu" : section === "spouse" ? "Phu Thê" : section === "children" ? "Tử Nữ" : section === "siblings" ? "Huynh Đệ" : "Mệnh";
  const result: ReadingEvidence[] = [];
  const related = s.chart.palaces.filter(
    (p) => p.name !== focus && palaceGeometry(s, focus, p.name),
  );
  const selected = new Set([focus, ...related.map((p) => p.name)]);
  if (section === "finance")
    for (const name of ["Mệnh", "Phúc Đức", "Quan Lộc", "Thiên Di"])
      selected.add(name);
  if (section === "finance") {
    result.push(bodyLocation(s));
    for (const name of ["Mệnh", "Phúc Đức", "Quan Lộc", "Thiên Di"])
      result.push(palaceLocation(s, name), palaceStars(s, name));
  }
  for (const name of selected) {
    const x = uniquePalace(s, name);
    if (!x) {
      result.push(item(`Chưa có dữ liệu xác định cung ${name}.`));
      continue;
    }
    for (const field of fields) {
      const stars = x.p[field];
      if (!validStars(stars)) {
        result.push(
          item(
            `Chưa có dữ liệu xác định ${field === "majorStars" ? "chính tinh" : field === "minorStars" ? "phụ tinh" : "tạp diệu"} tại ${name}; chưa thể rà đủ yếu tố bổ sung.`,
          ),
        );
        continue;
      }
      stars.forEach((star, j) => {
        const wanted = [
          "Kình Dương",
          "Đà La",
          "Hỏa Tinh",
          "Linh Tinh",
          "Tuần Không",
          "Triệt Lộ",
          "Địa Không",
          "Địa Kiếp",
          "Thiên Không",
        ].includes(star.name);
        const origin = (star as Star & { scope?: string }).scope === "origin";
        const transformed =
          name === focus &&
          origin &&
          ["Lộc", "Quyền", "Khoa", "Kỵ"].includes(star.mutagen || "");
        if (!wanted && !transformed) return;
        const base = `chart.palaces.${x.i}.${field}.${j}`;
        result.push(
          item(
            transformed
              ? `${star.name} tại ${name} mang Hóa ${star.mutagen} bản mệnh.`
              : `${name} ghi nhận ${star.name}.`,
            [
              `chart.palaces.${x.i}.name`,
              `${base}.name`,
              ...(transformed ? [`${base}.scope`, `${base}.mutagen`] : []),
            ],
          ),
        );
        const geometry = palaceGeometry(s, focus, name);
        if (name !== focus && geometry) result.push(geometry);
      });
    }
  }
  const focal = uniquePalace(s, focus);
  if (focus === "Mệnh" && focal && validStars(focal.p.majorStars)) {
    const certified = verifiedNatalTransformations(s.chart);
    focal.p.majorStars.forEach((star, index) => {
      if (certified && (star as Star & {scope?:string}).scope === "origin" && s.chart.palaces.flatMap(p => [...p.majorStars, ...p.minorStars, ...p.adjectiveStars]).filter(x => x.name === star.name).length === 1) return;
      const missingScope = typeof (star as Star & { scope?: unknown }).scope !== "string";
      const missingMutagen = typeof star.mutagen !== "string";
      if (!missingScope && !missingMutagen) return;
      const missing = [missingScope ? "lớp áp dụng" : "", missingMutagen ? "trường Tứ Hóa" : ""].filter(Boolean).join(" và ");
      result.push(item(`${star.name} tại Mệnh chưa lưu ${missing}; chưa thể xác nhận Tứ Hóa bản mệnh của riêng sao này từ các trường đó. Không suy là không có Tứ Hóa; dữ kiện đã biết của sao khác vẫn được giữ.`, [`chart.palaces.${focal.i}.majorStars.${index}.name`]));
    });
  }
  if (
    focus !== "Mệnh" && focal &&
    validStars(focal.p.majorStars) &&
    focal.p.majorStars.some(
      (star) =>
        typeof star.mutagen !== "string" ||
        typeof (star as Star & { scope?: unknown }).scope !== "string",
    )
  )
    result.push(
      item(
        `Chưa có dữ liệu xác định đầy đủ lớp áp dụng và tứ hóa của chính tinh tại ${focus}.`,
      ),
    );
  if (!palaceGeometry(s, focus, focus))
    result.push(
      item(
        "Chưa có dữ liệu xác định đủ 12 địa chi duy nhất để đối chiếu quan hệ cung.",
        [],
        "geometry",
      ),
    );
  // Xương/Khúc locations matter to the local co-palace requirement, but no impact is inferred elsewhere.
  if (section === "learning" || section === "action") {
    if (
      s.chart.palaces.length !== 12 ||
      s.chart.palaces.some((p) => fields.some((field) => !validStars(p[field])))
    )
      result.push(
        item(
          "Chưa có dữ liệu đầy đủ để rà vị trí Văn Xương, Văn Khúc trên toàn bộ lá số; các vị trí dưới đây chỉ là những gì đã ghi nhận.",
        ),
      );
    for (const { p, i } of s.chart.palaces.map((p, i) => ({ p, i }))) {
      for (const field of fields) {
        if (!validStars(p[field])) continue;
        p[field].forEach((star, j) => {
          if (["Văn Xương", "Văn Khúc"].includes(star.name))
            result.push(
              item(
                `${star.name} được ghi tại ${p.name}${branches.includes(p.earthlyBranch) ? ` (${p.earthlyBranch})` : ""}.`,
                [
                  `chart.palaces.${i}.name`,
                  ...(branches.includes(p.earthlyBranch)
                    ? [`chart.palaces.${i}.earthlyBranch`]
                    : []),
                  `chart.palaces.${i}.${field}.${j}.name`,
                ],
              ),
            );
        });
      }
    }
  }
  return {
    items: uniqueEvidence(result),
    unresolved:
      section === "finance"
        ? "Nguồn Tân Biên (PDF / trang in 190, mở đầu Tài Bạch) yêu cầu xét thêm Mệnh, Thân, Phúc Đức, Quan Lộc và Thiên Di. Bản đọc chưa tổng hợp ảnh hưởng của các yếu tố được ghi ở đây."
        : "Các vị trí và nhãn sao trên chỉ là dữ kiện để xét thêm; bản đọc chưa có quy tắc tổng hợp tác động của chúng. Không suy phạm vi án ngữ hai cung từ nhãn Tuần Không/Triệt Lộ, không đồng nhất quan hệ vị trí với hội chiếu theo một trường phái.",
  };
}

// A nearby scope note is direct snapshot context, never an effect or an exclusion.
export function nearbyNotes(
  s: ChartSnapshot,
  ruleId: string,
): ReadingEvidence[] {
  const kin=kinRules.find(r=>r.id===ruleId);
  if(kin)return [item(kin.presentation!.readerLimit!,[], 'editorial')];
  const fam=familyRules.find(r=>r.id===ruleId);
  if(fam)return [item(fam.presentation!.readerLimit!,[], "editorial")];
  const trine = emptyLifeTrineRules.find(r=>r.id===ruleId);
  if(trine) return [item(trine.presentation!.readerLimit!,[], 'editorial')];
  const ham = lifeHamBranches.find(r=>"tanbien.life-batch-"+r.id===ruleId);
  if(ham)return [item(ham.limit,[],"editorial")];
  const spec = careerContent.find((r) => "tanbien." + r.id === ruleId);
  if (spec)
    return [
      item(
        spec.limit ||
          "Đoạn này chỉ mô tả điều kiện cục bộ tại Quan Lộc; chưa tổng hợp sao đi cùng và điều chỉnh sát tinh, không dự đoán kết quả nghề nghiệp.",
        [],
        "editorial",
      ),
    ];
  if (["tanbien.r05", "tanbien.r22"].includes(ruleId))
    return [
      item(
        "Đoạn này chỉ diễn giải tổ hợp tại Quan Lộc; chưa tổng hợp các sao đi cùng và hội chiếu, không dự đoán kết quả nghề nghiệp.",
        [],
        "editorial",
      ),
    ];
  const names: Record<string, string> = {
    "tanbien.r08": "Tử Vi",
    "tanbien.r09": "Thiên Tướng",
    "tanbien.r10": "Liêm Trinh",
    "tanbien.r11": "Tham Lang",
    "tanbien.r12": "Cự Môn",
    "tanbien.r13": "Thiên Cơ",
    "tanbien.r14": "Thái Dương",
    "tanbien.r15": "Thiên Đồng",
    "tanbien.r16": "Thái Âm",
    "tanbien.r17": "Thiên Lương",
    "tanbien.r18": "Thất Sát",
    "tanbien.r19": "Phá Quân",
    "tanbien.r20": "Cơ–Cự–Lộc Tồn",
    "tanbien.r21": "Thái Dương",
  };
  const star = names[ruleId];
  if (!star) return [];
  const x = uniquePalace(s, "Mệnh");
  if (!x) return [item("Chưa có dữ liệu xác định ngữ cảnh tại Mệnh.")];
  const relevant = new Set([
    "Tuần Không",
    "Triệt Lộ",
    "Hỏa Tinh",
    "Linh Tinh",
    "Kình Dương",
    "Đà La",
    "Thiên Không",
    "Địa Không",
    "Địa Kiếp",
    "Thiên Hình",
  ]);
  const hits: { name: string; path: string }[] = [];
  const missing: string[] = [];
  for (const field of fields) {
    if (!validStars(x.p[field])) {
      missing.push(field);
      continue;
    }
    x.p[field].forEach((st, i) => {
      if (relevant.has(st.name))
        hits.push({
          name: st.name,
          path: `chart.palaces.${x.i}.${field}.${i}.name`,
        });
    });
  }
  const notes: ReadingEvidence[] = [];
  if (hits.length)
    notes.push(
      item(
        `Mẫu này còn ghi nhận ${[...new Set(hits.map((h) => h.name))].join(", ")} tại Mệnh; ảnh hưởng ${hits.length === 1 ? "của yếu tố này" : "của các yếu tố này"} chưa được tổng hợp.`,
        hits.map((h) => h.path),
      ),
    );
  if (ruleId === "tanbien.r21")
    notes.push(
      item(
        "Đoạn này không xác định sở thích thực tế, học vấn hoặc năng lực của người đọc.",
        [],
        "editorial",
      ),
    );
  if (ruleId === "tanbien.r20")
    notes.push(
      item(
        "Đoạn phối hợp này chỉ nói về mức thận trọng trong lời nói theo nguồn truyền thống, chưa đủ để đánh giá cách giao tiếp của người đọc. Hai chú giải sao riêng ở trên có phạm vi khác; bản đọc không tự hòa giải chúng.",
        [],
        "editorial",
      ),
    );
  if (ruleId === "tanbien.r19")
    notes.push(
      item(
        "Bản thử chỉ xét Phá Quân là chính tinh duy nhất tại Mệnh; chưa luận trường hợp đồng cung chính tinh khác.",
        [],
        "editorial",
      ),
    );
  if (["tanbien.r14", "tanbien.r16"].includes(ruleId))
    notes.push(
      item(
        ruleId === "tanbien.r14"
          ? "Chưa đánh giá mức thuận theo ngày/đêm sinh; đoạn này chỉ trình bày ý nghĩa nền."
          : "Chưa đánh giá mức thuận theo ngày/đêm sinh và ngày âm lịch; đoạn này chỉ trình bày ý nghĩa nền.",
        [],
        "editorial",
      ),
    );
  if (missing.length)
    notes.push(
      item(
        "Chưa có dữ liệu xác định đầy đủ các danh sách sao để trình bày ngữ cảnh tại Mệnh; không suy ra các yếu tố còn lại vắng mặt.",
      ),
    );
  return notes;
}

// Naming uncertainty is explanatory evidence, not a second paragraph of the main reading.
export function sourceNamingNotes(s: ChartSnapshot): ReadingEvidence[] {
  const x = uniquePalace(s, "Mệnh");
  if (!x) return [];
  const paths = fields.flatMap((field) =>
    validStars(x.p[field])
      ? x.p[field].flatMap((st, i) =>
          st.name === "Thiên Không"
            ? [`chart.palaces.${x.i}.${field}.${i}.name`]
            : [],
        )
      : [],
  );
  return paths.length
    ? [
        item(
          "Giữ nguyên tên Thiên Không trong dữ liệu; chưa đồng nhất với Địa Không hoặc thuật ngữ ‘Không’ trong sách.",
          paths,
          "editorial",
        ),
      ]
    : [];
}

// Technical evidence lists only source tables required by this rule, not the entire registry.
export function sourceTablesForRule(rule: Rule): Record<string,{id:string;version:string;states:Readonly<Record<string,string>>;author?:string;title?:string;pdfPages?:number[];printedPages?:number[];source?:string;verification?:string}> {
 if(rule.id.startsWith('tanbien.no-table-'))return {wuqu:tanBienTable,...tanBienLifeTables,phu:{id:'tanbien-phu-state',version:'1.0.0',states:Object.fromEntries(branches.map(b=>[b,bookState('Thiên Phủ',b)!.value!])),author:'Vân Đằng Thái Thứ Lang',title:'Tử Vi Đẩu Số Tân Biên',pdfPages:[36],printedPages:[36],source:'§3.7; giữ cùng quy ước bảng đã dùng bởi bookState, không đổi engine.'}};
 if(rule.id.startsWith('npl.life-polarity-'))return {polarity:{id:'npl-age-palace-polarity',version:'1.0.0',states:{duong:'Giáp,Bính,Mậu,Canh,Nhâm;Tý,Dần,Thìn,Ngọ,Thân,Tuất',am:'Ất,Đinh,Kỷ,Tân,Quý;Sửu,Mão,Tỵ,Mùi,Dậu,Hợi'},author:'Nguyễn Phát Lộc',title:'Tử Vi Tổng Hợp; Tử Vi Hàm Số',pdfPages:[107,108,10],source:'TH107–108 quan hệ; HS10 định nghĩa tuổi/cung.',verification:'Đối chiếu ảnh, chưa phê duyệt chuyên môn.'}};
 if(rule.id===M05)return {wuqu:tanBienTable};
 if(rule.id.startsWith('npl.life-foundation-')||(rule.id.startsWith('npl.life-two-major-')&&rule.version==='0.2.0'))return {nplElements:{id:'npl-elements',version:NPL_ELEMENT_V2,states:{...NPL_FOUNDATION_TABLES.stars,...Object.fromEntries(NPL_FOUNDATION_TABLES.napAm.map((v,i)=>['napam-pair-'+i,v??'unknown'])),...Object.fromEntries(Object.entries(NPL_FOUNDATION_TABLES.branches).map(([k,v])=>['palace-'+k,v]))},author:'Nguyễn Phát Lộc',title:'Tử Vi Tổng Hợp; Tử Vi Hàm Số',pdfPages:[62,102,108,109,349,350,351,352],source:'Tổng Hợp: bảng cung62, sao102, phép xét108–109, nạp âm349–352. Riêng cặp14: Hàm Số10–11; đối chiếu Cục: Hàm Số13.',verification:'Đã đối chiếu ảnh; chưa phê duyệt chuyên môn.'},nplCuc:{id:'npl-cuc-check',version:'1.0.0',states:Object.fromEntries(NPL_FOUNDATION_TABLES.cucRows.map((r,i)=>['stem-pair-'+i,r.join('|')])),author:'Nguyễn Phát Lộc',title:'Tử Vi Hàm Số',pdfPages:[13],source:'Can năm âm × cặp cung Mệnh; chỉ xác minh dữ kiện Cục đã lưu.',verification:'Đối chiếu ảnh.'}};

  if(rule.id.startsWith('npl.life-two-major-'))return {nplElements:{id:'npl-elements',version:NPL_ELEMENT_VERSION,states:{...NPL_STAR_ELEMENTS,...Object.fromEntries(NPL_NAP_AM.map((v,i)=>['napam-pair-'+i,v??'unknown']))},author:'Nguyễn Phát Lộc',title:'Tử Vi Tổng Hợp',pdfPages:[102,108,109,349,350,351,352],printedPages:[102,108,109,349,350,351,352],source:'Bảng102; chiều sinh/khắc108; hai chính tinh109; nạp âm349–352.',verification:'Đối chiếu ảnh; không có phê duyệt chuyên môn.'}};

  return Object.fromEntries(
    Object.entries({ wuqu: tanBienTable, ...tanBienLifeTables }).filter(
      ([key]) =>
        rule.requiredFacts.includes(`fact.tanbien-${key}-eligible`) ||
        (emptyLifeTrineRules.some(r=>r.id===rule.id) && ["taiyang","taiyin"].includes(key)) ||
        rule.requiredFacts.includes(`fact.tanbien-${key}-state`) ||
        lifeHamBranches.some(s=>rule.id === "tanbien.life-batch-"+s.id && s.table===key),
    ),
  );
}

/** Presentation layers only; original evidence/rule remain in the technical record. */
export function evidenceLayers(
  e: ReturnType<typeof ruleEvidence>,
  adjacent: ReadingEvidence[],
  ruleId: string,
) {
  const shown = new Set(adjacent.map((n) => n.text));
  const contextNotes = e.contextNotes.filter((n) => !shown.has(n.text));
  return {
    snapshot: e.facts.filter(
      (f) => f.kind === "snapshot" || f.kind === "geometry",
    ),
    sourceFacts: e.facts.filter((f) => f.kind === "source"),
    sourceConditions: e.sourceConditions,
    sources: e.sources,
    projectScope: e.projectScope,
    contextNotes,
    limits: [...new Set(e.limits)].filter(
      (l, i) => !shown.has(l) && !(ruleId === "tanbien.r21" && i === 0),
    ),
  };
}
