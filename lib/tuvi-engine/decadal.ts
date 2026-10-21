import type { ChartData } from "./index";
import { star, data } from "iztro";
const { getKuiYueIndex, getChangQuIndexByHeavenlyStem, getLuYangTuoMaIndex, getLuanXiIndex } = star;
const { heavenlyStems } = data;
import type { HeavenlyStemName, EarthlyBranchName } from "iztro/lib/i18n";

export const DECADAL_VERSION = "supplemental-iztro-decadal-1.0.0";
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
const stems = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
];
const keys = [
  "jia",
  "yi",
  "bing",
  "ding",
  "wu",
  "ji",
  "geng",
  "xin",
  "ren",
  "gui",
];
const names: Record<string, string> = {
  lianzhenMaj: "Liêm Trinh",
  pojunMaj: "Phá Quân",
  wuquMaj: "Vũ Khúc",
  taiyangMaj: "Thái Dương",
  tianjiMaj: "Thiên Cơ",
  tianliangMaj: "Thiên Lương",
  ziweiMaj: "Tử Vi",
  taiyinMaj: "Thái Âm",
  tiantongMaj: "Thiên Đồng",
  wenchangMin: "Văn Xương",
  jumenMaj: "Cự Môn",
  tanlangMaj: "Tham Lang",
  youbiMin: "Hữu Bật",
  wenquMin: "Văn Khúc",
  zuofuMin: "Tả Phù",
};
export type DecadalEntry = {
  id: string;
  code: string;
  name: string;
  scope: "decadal";
  branch: string;
  source: string;
  convention: string;
  version: string;
  target?: { code: string; name: string; path: string };
};
export type DecadalLayer = {
  version: string;
  status: "available" | "partial" | "unavailable";
  year?: number;
  age?: number;
  range?: [number, number];
  palace?: string;
  branch?: string;
  stem?: string;
  stars: DecadalEntry[];
  issues: string[];
  source: string;
  direction?: "thuận" | "nghịch";
};
/** Uses saved Tân Biên ranges, not iztro's childhood fallback or the yearly flowingDecade position.
 * Supplemental star rules: iztro@2.6.1 FunctionalAstrolabe.decadalList/getHoroscopeStar.
 * No configuration changes; location helpers are pure and return Dần=0. */
export function decadalLayer(
  chart: ChartData,
  year: number | undefined,
  gender: "male" | "female",
): DecadalLayer {
  const source =
    "Tân Biên tr.20–21 §10.1 (khoảng tuổi); bổ sung iztro@2.6.1 lib/astro/FunctionalAstrolabe.js decadalList, lib/star/horoscopeStar.js, lib/star/location.js, lib/data/heavenlyStems.js";
  const out: DecadalLayer = {
    version: DECADAL_VERSION,
    status: "unavailable",
    year,
    stars: [],
    issues: [],
    source,
  };
  if (year === undefined) {
    out.issues.push("Chưa chọn năm xem.");
    return out;
  }
  if (
    !Number.isInteger(chart.lunar?.lunarYear) ||
    !Array.isArray(chart.palaces)
  ) {
    out.issues.push("Thiếu năm âm sinh hoặc danh sách cung.");
    return out;
  }
  const age = year - chart.lunar.lunarYear + 1;
  out.age = age;
  if (!Number.isInteger(year) || !Number.isInteger(age)) {
    out.issues.push("Thiếu năm âm sinh hoặc năm xem hợp lệ.");
    return out;
  }
  const matches = chart.palaces.filter(
    (p) =>
      Array.isArray(p.decadal?.range) &&
      p.decadal.range.length === 2 &&
      p.decadal.range.every(Number.isInteger) &&
      p.decadal.range[1] - p.decadal.range[0] === 9 &&
      age >= p.decadal.range[0] &&
      age <= p.decadal.range[1],
  );
  if (matches.length !== 1) {
    out.issues.push(
      matches.length
        ? "Khoảng đại vận chồng nhau, chưa xác định duy nhất."
        : "Tuổi ngoài các khoảng đại vận đã lưu; không thay bằng vận đầu tiên.",
    );
    return out;
  }
  const p = matches[0],
    s = stems.indexOf(p.heavenlyStem),
    b = branches.indexOf(p.earthlyBranch);
  if (s < 0 || b < 0 || s % 2 !== b % 2) {
    out.issues.push("Thiếu hoặc không hợp lệ can chi cung đại vận.");
    return out;
  }
  Object.assign(out, {
    range: [...p.decadal.range],
    palace: p.name,
    branch: p.earthlyBranch,
    stem: p.heavenlyStem,
    direction:
      ((chart.lunar.lunarYear - 4) % 2 === 0) === (gender === "male")
        ? "thuận"
        : "nghịch",
  });
  const stem = p.heavenlyStem as HeavenlyStemName,
    branch = p.earthlyBranch as EarthlyBranchName;
  const { kuiIndex, yueIndex } = getKuiYueIndex(stem),
    { changIndex, quIndex } = getChangQuIndexByHeavenlyStem(stem),
    { luIndex, yangIndex, tuoIndex, maIndex } = getLuYangTuoMaIndex(
      stem,
      branch,
    ),
    { hongluanIndex, tianxiIndex } = getLuanXiIndex(branch);
  const add = (
    code: string,
    name: string,
    dest: string,
    target?: DecadalEntry["target"],
  ) =>
    out.stars.push({
      id: `decadal:${p.decadal.range[0]}:${code}`,
      code,
      name,
      scope: "decadal",
      branch: dest,
      source,
      convention: DECADAL_VERSION,
      version: DECADAL_VERSION,
      ...(target ? { target } : {}),
    });
  const positions: [string, string, number][] = [
    ["tiankui", "Thiên Khôi", kuiIndex],
    ["tianyue", "Thiên Việt", yueIndex],
    ["wenchang", "Văn Xương", changIndex],
    ["wenqu", "Văn Khúc", quIndex],
    ["lucun", "Lộc Tồn", luIndex],
    ["qingyang", "Kình Dương", yangIndex],
    ["tuoluo", "Đà La", tuoIndex],
    ["tianma", "Thiên Mã", maIndex],
    ["hongluan", "Hồng Loan", hongluanIndex],
    ["tianxi", "Thiên Hỷ", tianxiIndex],
  ];
  for (const [code, name, i] of positions) {
    if (Number.isInteger(i) && i >= 0 && i < 12)
      add(code, name, branches[(i + 2) % 12]);
    else out.issues.push(`Chưa xác định ${name}.`);
  }
  // Fixed upstream default table; do not inherit mutable global config or Tân Biên natal mutagens.
  const table =
    heavenlyStems[`${keys[s]}Heavenly` as keyof typeof heavenlyStems].mutagen;
  table.forEach((code, j) => {
    const name = names[code],
      targets: { branch: string; path: string }[] = [];
    chart.palaces.forEach((pal, pi) => {
      (["majorStars", "minorStars"] as const).forEach((group) =>
        pal[group]?.forEach((star, si) => {
          if (star.name === name)
            targets.push({
              branch: pal.earthlyBranch,
              path: `chart.palaces.${pi}.${group}.${si}`,
            });
        }),
      );
    });
    if (targets.length !== 1) {
      out.issues.push(
        `Tứ Hóa: chưa tìm được duy nhất sao gốc ${name || code}.`,
      );
      return;
    }
    add(
      ["hoa-loc", "hoa-quyen", "hoa-khoa", "hoa-ky"][j],
      ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ"][j],
      targets[0].branch,
      { code, name, path: targets[0].path },
    );
  });
  out.status = out.issues.length ? "partial" : "available";
  return out;
}
