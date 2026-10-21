import type { BirthInput } from "../calendar";
import type { ChartData, Star } from "./index";
import {
  tanBienTable,
  tanBienLifeTables,
} from "../interpretation-rules/tanbien-source";
export const TANBIEN_PROFILE = "tanbien-vn-trial-v1" as const;
export const TANBIEN_ENGINE_VERSION = "tanbien-trial-0.1.0";
export const BRANCHES = [
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
export const STEMS = [
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
const mod = (v: number, n = 12) => ((v % n) + n) % n;
export const source = (pages: string, section: string) =>
  `Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên, PDF/trang in ${pages}, §${section}`;
export type CalculationTrace = {
  id: string;
  source: string;
  status: "source-formula" | "supplement" | "source-conflict";
  input: Record<string, unknown>;
  result: unknown;
  note?: string;
};
// Exact cells read in the supplied PDF images pp7–8. Tý=0. Do NOT repair the Kim day21/24 inconsistency silently.
export const ZIWEI_DAYS: Record<number, number[][]> = {
  2: [
    [22, 23],
    [1, 24, 25],
    [2, 3, 26, 27],
    [4, 5, 28, 29],
    [6, 7, 30],
    [8, 9],
    [10, 11],
    [12, 13],
    [14, 15],
    [16, 17],
    [18, 19],
    [20, 21],
  ],
  3: [
    [25],
    [2, 28],
    [3, 5],
    [6, 8],
    [1, 9, 11],
    [4, 12, 14],
    [7, 15, 17],
    [10, 18, 20],
    [13, 21, 23],
    [16, 24, 26],
    [19, 27, 29],
    [22, 30],
  ],
  4: [
    [5],
    [3, 9],
    [4, 7, 13],
    [8, 11, 17],
    [2, 12, 15, 21],
    [6, 16, 19, 25],
    [10, 20, 23, 29],
    [14, 21, 27],
    [18, 28],
    [22],
    [26],
    [1, 30],
  ],
  5: [
    [7],
    [4, 12],
    [5, 9, 17],
    [10, 14, 22],
    [3, 15, 19, 27],
    [8, 20, 24],
    [1, 13, 25, 29],
    [6, 18, 30],
    [11, 23],
    [16, 28],
    [21],
    [2, 26],
  ],
  6: [
    [9, 19],
    [5, 15, 25],
    [6, 11, 21],
    [12, 17, 27],
    [4, 18, 23],
    [10, 24, 29],
    [2, 16, 30],
    [8, 22],
    [14, 28],
    [1, 20],
    [7, 26],
    [3, 13],
  ],
};
export function ziweiFromBook(cuc: number, day: number) {
  const matches =
    ZIWEI_DAYS[cuc]?.flatMap((ds, b) => (ds.includes(day) ? [b] : [])) || [];
  return matches.length === 1
    ? { status: "computed" as const, branch: matches[0] }
    : {
        status: "unknown" as const,
        matches,
        reason:
          "Bảng Kim trang 8: ngày 21 trùng ô, ngày 24 không có; không tự sửa sách.",
      };
}
export function fireBell(input: {
  yearBranch: number;
  yearStem: number;
  gender: string;
  hourIndex: number;
}) {
  const { yearBranch: y, yearStem: s, gender: g, hourIndex: h } = input;
  if (
    ![y, s, h].every(Number.isInteger) ||
    y < 0 ||
    y > 11 ||
    s < 0 ||
    s > 9 ||
    h < 0 ||
    h > 11 ||
    s % 2 !== y % 2 ||
    !["male", "female"].includes(g)
  )
    return { status: "unknown" as const };
  const direction = (s % 2 === 0) === (g === "male") ? 1 : -1;
  const group = y % 4,
    starts = { 2: [1, 3], 0: [2, 10], 1: [3, 10], 3: [2, 10] }[group]!;
  const walk = (start: number, d: number) =>
    Array.from({ length: h + 1 }, (_, step) => ({
      hour: BRANCHES[step],
      branch: BRANCHES[mod(start + d * step)],
    }));
  return {
    status: "computed" as const,
    fire: mod(starts[0] + direction * h),
    bell: mod(starts[1] - direction * h),
    direction,
    fireTrace: walk(starts[0], direction),
    bellTrace: walk(starts[1], -direction),
  };
}
export function voidPairs(stem: number, branch: number) {
  if (
    !Number.isInteger(stem) ||
    !Number.isInteger(branch) ||
    stem < 0 ||
    stem > 9 ||
    branch < 0 ||
    branch > 11 ||
    stem % 2 !== branch % 2
  )
    return null;
  const start = mod(branch - stem),
    first = mod(start + 10);
  const triet = [
    [8, 9],
    [6, 7],
    [4, 5],
    [2, 3],
    [0, 1],
  ][stem % 5];
  return { tuan: [first, mod(first + 1)], triet, cycleStart: BRANCHES[start] };
}
export function bookState(name: string, branch: string) {
  name =
    ({ "Thiên Diêu": "Thiên Riêu" } as Record<string, string>)[name] || name;
  if (name === "Thiên Phủ")
    return {
      value: (
        {
          Tý: "Miếu",
          Sửu: "Bình hòa",
          Dần: "Miếu",
          Mão: "Bình hòa",
          Thìn: "Vượng",
          Tỵ: "Đắc",
          Ngọ: "Miếu",
          Mùi: "Đắc",
          Thân: "Miếu",
          Dậu: "Bình hòa",
          Tuất: "Vượng",
          Hợi: "Đắc",
        } as Record<string, string>
      )[branch],
      version: "tanbien-phu-state-1.0.0",
      source: source("36", "3.7"),
    };
  if (name === "Vũ Khúc")
    return {
      value: tanBienTable.states[branch],
      version: tanBienTable.version,
      source: tanBienTable.source,
    };
  const table = Object.values(tanBienLifeTables).find((t) => t.star === name);
  if (table)
    return {
      value: table.states[branch],
      version: table.version,
      source: source(String(table.pdfPage), table.section),
    };
  // Only explicitly printed branches. Omitted branches remain unknown, never filled from iztro.
  const partial: Record<string, [string[], string, string]> = {
    "Kình Dương": [["Thìn", "Tuất", "Sửu", "Mùi"], "39", "3.15"],
    "Đà La": [["Thìn", "Tuất", "Sửu", "Mùi"], "39", "3.15"],
    "Hỏa Tinh": [["Dần", "Mão", "Thìn", "Tỵ", "Ngọ"], "39", "3.16"],
    "Linh Tinh": [["Dần", "Mão", "Thìn", "Tỵ", "Ngọ"], "39", "3.16"],
    "Văn Xương": [["Thìn", "Tuất", "Sửu", "Mùi", "Tỵ", "Hợi"], "39", "3.17"],
    "Văn Khúc": [["Thìn", "Tuất", "Sửu", "Mùi", "Tỵ", "Hợi"], "39", "3.17"],
    "Địa Không": [["Dần", "Thân", "Tỵ", "Hợi"], "40", "3.21"],
    "Địa Kiếp": [["Dần", "Thân", "Tỵ", "Hợi"], "40", "3.21"],
    "Thiên Khốc": [["Tý", "Ngọ", "Mão", "Dậu", "Sửu", "Mùi"], "42", "3.29"],
    "Thiên Hư": [["Tý", "Ngọ", "Mão", "Dậu", "Sửu", "Mùi"], "42", "3.29"],
    "Thiên Mã": [["Tỵ", "Dần"], "42", "3.30"],
    "Thiên Hình": [["Dần", "Thân", "Mão", "Dậu"], "42", "3.31"],
    "Thiên Riêu": [["Dần", "Mão", "Dậu", "Tuất"], "43", "3.32"],
  };
  const p = partial[name];
  return p
    ? {
        value: p[0].includes(branch) ? "Đắc" : undefined,
        version: "tanbien-secondary-states-0.1.0",
        source: source(p[1], p[2]),
      }
    : undefined;
}
export type TanBienCalculation = ReturnType<typeof applyTanBien>["calculation"];
/** New versioned output, never mutates its upstream argument or any historical snapshot. */
export function applyTanBien(base: ChartData, birth: BirthInput) {
  if (
    !base.lunar ||
    birth.hour === null ||
    birth.minute === null ||
    birth.unknownTime
  )
    throw Error("TANBIEN_MISSING_INPUT");
  const chart = structuredClone(base),
    trace: CalculationTrace[] = [];
  const y = mod(base.lunar.lunarYear - 4),
    s = mod(base.lunar.lunarYear - 4, 10),
    m = base.lunar.lunarMonth,
    day = base.lunar.lunarDay,
    h = birth.hour === 23 ? 0 : Math.floor((birth.hour + 1) / 2);
  if (
    m < 1 ||
    m > 12 ||
    day < 1 ||
    day > 30 ||
    chart.palaces.length !== 12 ||
    new Set(chart.palaces.map((p) => p.earthlyBranch)).size !== 12
  )
    throw Error("TANBIEN_MISSING_INPUT");
  const life = mod(2 + m - 1 - h),
    body = mod(2 + m - 1 + h),
    direction = (s % 2 === 0) === (birth.gender === "male") ? 1 : -1;
  const addTrace = (
    id: string,
    pages: string,
    section: string,
    input: Record<string, unknown>,
    result: unknown,
    status: CalculationTrace["status"] = "source-formula",
    note?: string,
  ) =>
    trace.push({
      id,
      source: source(pages, section),
      status,
      input,
      result,
      note,
    });
  const cucRows = [
    [2, 6, 5, 3, 4],
    [6, 5, 3, 4, 2],
    [3, 4, 2, 6, 5],
    [5, 3, 4, 2, 6],
    [4, 2, 6, 5, 3],
  ];
  const row =
      life < 2 ? 0 : life < 4 || life > 9 ? 1 : life < 6 ? 2 : life < 8 ? 3 : 4,
    cuc = cucRows[row][s % 5];
  addTrace(
    "life-body",
    "6–7",
    "5–6",
    { month: m, hourIndex: h },
    { life: BRANCHES[life], body: BRANCHES[body] },
    "source-formula",
    "Thứ tự 12 cung kế thừa iztro; văn trang 6 bỏ Phụ Mẫu, ví dụ đại hạn trang20 có Phụ Mẫu.",
  );
  addTrace("cuc", "7", "7", { yearStem: STEMS[s], life: BRANCHES[life] }, cuc);
  const lifeP = chart.palaces.find((p) => p.name === "Mệnh");
  if (
    lifeP?.earthlyBranch !== BRANCHES[life] ||
    chart.palaces.find((p) => p.isBodyPalace)?.earthlyBranch !== BRANCHES[body]
  )
    throw Error("TANBIEN_BASE_PALACE_MISMATCH");
  chart.fiveElementsClass = (
    {
      2: "Thủy Nhị Cục",
      3: "Mộc Tam Cục",
      4: "Kim Tứ Cục",
      5: "Thổ Ngũ Cục",
      6: "Hỏa Lục Cục",
    } as Record<number, string>
  )[cuc];
  const original = chart.palaces.flatMap((p) =>
    [...p.majorStars, ...p.minorStars, ...p.adjectiveStars].map((star) => ({
      branch: p.earthlyBranch,
      star: structuredClone(star),
    })),
  );
  const planned = new Map<
    string,
    {
      branch: number;
      group: "majorStars" | "minorStars" | "adjectiveStars";
      traceId: string;
    }
  >();
  const place = (
    name: string,
    branch: number,
    pages: string,
    section: string,
    input: Record<string, unknown>,
    group: "majorStars" | "minorStars" | "adjectiveStars" = "adjectiveStars",
    status: CalculationTrace["status"] = "source-formula",
    note?: string,
  ) => {
    name =
      (
        {
          "Phượng Các": "Phụng Các",
          "Thiên Riêu": "Thiên Diêu",
          "Thai Phụ": "Đài Phụ",
        } as Record<string, string>
      )[name] || name;
    const id = "star." + name;
    planned.set(name, { branch: mod(branch), group, traceId: id });
    addTrace(id, pages, section, input, BRANCHES[mod(branch)], status, note);
  };
  const ziwei = ziweiFromBook(cuc, day),
    oldZi = original.find((x) => x.star.name === "Tử Vi");
  if (!oldZi) throw Error("TANBIEN_MISSING_BASE_ZIWEI");
  const z =
      ziwei.status === "computed"
        ? ziwei.branch
        : BRANCHES.indexOf(oldZi.branch),
    fu = mod(4 - z);
  for (const [name, offset] of [
    ["Tử Vi", 0],
    ["Liêm Trinh", 4],
    ["Thiên Đồng", 7],
    ["Vũ Khúc", 8],
    ["Thái Dương", 9],
    ["Thiên Cơ", 11],
  ] as const)
    place(
      name,
      z + offset,
      "7–8",
      "8.1",
      { cuc, day, ziwei: BRANCHES[z] },
      "majorStars",
      ziwei.status === "computed" ? "source-formula" : "supplement",
      ziwei.status === "unknown"
        ? ziwei.reason + " Giữ vị trí Tử Vi upstream được công bố riêng."
        : undefined,
    );
  for (const [name, offset] of [
    ["Thiên Phủ", 0],
    ["Thái Âm", 1],
    ["Tham Lang", 2],
    ["Cự Môn", 3],
    ["Thiên Tướng", 4],
    ["Thiên Lương", 5],
    ["Thất Sát", 6],
    ["Phá Quân", 10],
  ] as const)
    place(
      name,
      fu + offset,
      "9",
      "8.2",
      { ziwei: BRANCHES[z], phu: BRANCHES[fu] },
      "majorStars",
      ziwei.status === "computed" ? "source-formula" : "supplement",
    );
  const loc = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][s],
    ta = mod(4 + m - 1),
    huu = mod(10 - m + 1),
    xuong = mod(10 - h),
    khuc = mod(4 + h);
  const minor = (
    n: string,
    b: number,
    p: string,
    sec: string,
    input: Record<string, unknown>,
  ) => place(n, b, p, sec, input, "minorStars");
  minor("Lộc Tồn", loc, "9", "8.4", { yearStem: STEMS[s] });
  minor("Kình Dương", loc + 1, "10", "8.6.1", { loc: BRANCHES[loc] });
  minor("Đà La", loc - 1, "10", "8.6.1", { loc: BRANCHES[loc] });
  minor("Địa Kiếp", 11 + h, "10", "8.6.2", { hourIndex: h });
  minor("Địa Không", 11 - h, "10", "8.6.2", { hourIndex: h });
  const fire = fireBell({
    yearBranch: y,
    yearStem: s,
    gender: birth.gender,
    hourIndex: h,
  });
  if (fire.status !== "computed") throw Error("TANBIEN_MISSING_INPUT");
  minor("Hỏa Tinh", fire.fire, "10–11", "8.6.3", {
    yearBranch: BRANCHES[y],
    gender: birth.gender,
    hourIndex: h,
    direction: fire.direction,
    walk: fire.fireTrace,
  });
  minor("Linh Tinh", fire.bell, "10–11", "8.6.3", {
    yearBranch: BRANCHES[y],
    gender: birth.gender,
    hourIndex: h,
    direction: -fire.direction,
    walk: fire.bellTrace,
  });
  if (y % 4 === 3) {
    const t = trace.find((t) => t.id === "star.Hỏa Tinh")!;
    t.status = "source-conflict";
    t.note =
      "Bảng §8.6.3 khởi Dần; ví dụ273/275 theo ô cố định lại phù hợp khởi Dậu. Bản thử chọn bảng, chưa hòa giải hai bằng chứng; không tuyên bố khớp ví dụ này.";
  }
  minor("Tả Phù", ta, "11", "8.7", { month: m });
  minor("Hữu Bật", huu, "11", "8.7", { month: m });
  minor("Văn Xương", xuong, "11", "8.8", { hourIndex: h });
  minor("Văn Khúc", khuc, "11", "8.8", { hourIndex: h });
  const long = mod(4 + y),
    phuong = mod(10 - y);
  place("Long Trì", long, "11", "8.9", { yearBranch: BRANCHES[y] });
  place("Phượng Các", phuong, "11", "8.9", { yearBranch: BRANCHES[y] });
  minor("Thiên Khôi", [1, 0, 11, 11, 1, 0, 6, 6, 3, 3][s], "11", "8.10", {
    yearStem: STEMS[s],
  });
  minor("Thiên Việt", [7, 8, 9, 9, 7, 8, 2, 2, 5, 5][s], "11", "8.10", {
    yearStem: STEMS[s],
  });
  place("Thiên Khốc", 6 - y, "11–12", "8.11", { yearBranch: BRANCHES[y] });
  place("Thiên Hư", 6 + y, "12", "8.11", { yearBranch: BRANCHES[y] });
  place("Tam Thai", ta + day - 1, "12", "8.12", { ta: BRANCHES[ta], day });
  place("Bát Tọa", huu - day + 1, "12", "8.12", { huu: BRANCHES[huu], day });
  place("Ân Quang", xuong + day - 2, "12", "8.13", {
    xuong: BRANCHES[xuong],
    day,
  });
  place(
    "Thiên Quý",
    khuc - day + 2,
    "12,272–275",
    "8.13/phụ lục",
    {
      khuc: BRANCHES[khuc],
      day,
      steps: day - 1,
      finalStep: "quay lại một cung sau đếm nghịch",
    },
    "adjectiveStars",
    "source-formula",
    "Đọc ô cố định theo trang5, không dùng chữ chi lưu niên trong sơ đồ: bốn ví dụ cho Dậu/Mão/Dần/Dần. Đính chính hồ sơ đối chiếu cũ; chưa phê duyệt chuyên môn.",
  );
  for (const [n, b, sec] of [
    ["Thiên Đức", 9 + y, "8.14"],
    ["Nguyệt Đức", 5 + y, "8.14"],
    ["Thiên Hình", 9 + m - 1, "8.15"],
    ["Thiên Riêu", 1 + m - 1, "8.15"],
    ["Thiên Y", 1 + m - 1, "8.15"],
  ] as const)
    place(n, b, "12", sec, { month: m, yearBranch: BRANCHES[y] });
  for (const [n, b, sec] of [
    ["Quốc Ấn", loc + 8, "8.17"],
    ["Đường Phù", loc - 7, "8.17"],
    ["Thiên Giải", 8 + m - 1, "8.18"],
    ["Địa Giải", 7 + m - 1, "8.18"],
    ["Giải Thần", phuong, "8.18"],
    ["Thai Phụ", 6 + h, "8.19"],
    ["Phong Cáo", 2 + h, "8.19"],
    ["Thiên Tài", life + y, "8.20"],
    ["Thiên Thọ", body + y, "8.20"],
  ] as const)
    place(n, b, "12–13", sec, {
      loc: BRANCHES[loc],
      month: m,
      hourIndex: h,
      yearBranch: BRANCHES[y],
      life: BRANCHES[life],
      body: BRANCHES[body],
    });
  // Source §8.16 repeats "năm sinh" at the starting point; use explicitly disclosed existing convention Tý at Mão.
  minor("Hồng Loan", 3 - y, "12", "8.16", { yearBranch: BRANCHES[y] });
  minor("Thiên Hỷ", 9 - y, "12", "8.16", { yearBranch: BRANCHES[y] });
  trace.find((t) => t.id === "star.Hồng Loan")!.status = "supplement";
  trace.find((t) => t.id === "star.Hồng Loan")!.note =
    "Điểm khởi năm Tý tại Mão kế thừa iztro; câu sách ghi năm sinh hai lần, chưa coi đã xác minh.";
  trace.find((t) => t.id === "star.Thiên Hỷ")!.status = "supplement";
  for (const [name, palace] of [
    ["Thiên Thương", "Nô Bộc"],
    ["Thiên Sứ", "Tật Ách"],
  ] as const)
    place(
      name,
      BRANCHES.indexOf(
        chart.palaces.find((p) => p.name === palace)!.earthlyBranch,
      ),
      "13",
      "8.21",
      { palace },
    );
  place("Thiên La", 4, "13", "8.22", {});
  place("Địa Võng", 10, "13", "8.22", {});
  place("Thiên Quan", [7, 4, 5, 2, 3, 9, 11, 9, 10, 6][s], "14", "8.24", {
    yearStem: STEMS[s],
  });
  place("Thiên Phúc", [9, 8, 0, 11, 3, 2, 6, 5, 6, 5][s], "14", "8.24", {
    yearStem: STEMS[s],
  });
  const seasonal = Math.floor(mod(y + 1) / 3);
  place("Cô Thần", [2, 5, 8, 11][seasonal], "14", "8.25", {
    yearBranch: BRANCHES[y],
  });
  place("Quả Tú", [10, 1, 4, 7][seasonal], "14", "8.25", {
    yearBranch: BRANCHES[y],
  });
  minor("Đào Hoa", [9, 6, 3, 0][y % 4], "14–15", "8.26", {
    yearBranch: BRANCHES[y],
  });
  minor("Thiên Mã", [2, 11, 8, 5][y % 4], "15", "8.27", {
    yearBranch: BRANCHES[y],
  });
  place("Kiếp Sát", [5, 2, 11, 8][y % 4], "15", "8.28", {
    yearBranch: BRANCHES[y],
  });
  place("Phá Toái", [5, 9, 1][y % 3], "15", "8.29", {
    yearBranch: BRANCHES[y],
  });
  place("Hoa Cái", [4, 1, 10, 7][y % 4], "15", "8.30", {
    yearBranch: BRANCHES[y],
  });
  place("Lưu Hà", [9, 10, 7, 4, 5, 6, 8, 3, 11, 2][s], "16", "8.31", {
    yearStem: STEMS[s],
  });
  place("Thiên Trù", [5, 6, 0, 5, 6, 8, 2, 6, 9, 10][s], "16", "8.32", {
    yearStem: STEMS[s],
  });
  place("Văn Tinh", [5, 6, 8, 9, 8, 9, 11, 0, 2, 3][s], "16", "8.33", {
    yearStem: STEMS[s],
  });
  place("Đẩu Quân", y - m + 1 + h, "16", "8.35", {
    yearBranch: BRANCHES[y],
    month: m,
    hourIndex: h,
  });
  place("Thiên Không", y + 1, "16", "8.36", { yearBranch: BRANCHES[y] });
  // Remove and recreate source-governed stars, preserving independent upstream objects as explicitly supplemental.
  for (const p of chart.palaces)
    for (const g of ["majorStars", "minorStars", "adjectiveStars"] as const)
      p[g] = p[g].filter(
        (st) =>
          !planned.has(st.name) &&
          !["Tuần Không", "Triệt Lộ"].includes(st.name),
      );
  for (const [name, v] of planned) {
    const old = original.find((x) => x.star.name === name)?.star;
    chart.palaces
      .find((p) => p.earthlyBranch === BRANCHES[v.branch])!
      [v.group].push({ ...old, name, scope: "origin" } as Star);
  }
  const pairs = voidPairs(s, y)!;
  for (const [name, bs] of [
    ["Tuần Không", pairs.tuan],
    ["Triệt Lộ", pairs.triet],
  ] as const)
    for (const b of bs)
      chart.palaces
        .find((p) => p.earthlyBranch === BRANCHES[b])!
        .adjectiveStars.push({ name, scope: "origin" } as Star);
  addTrace(
    "void-pairs",
    "16–17",
    "8.37",
    {
      yearStem: STEMS[s],
      yearBranch: BRANCHES[y],
      cycleStart: pairs.cycleStart,
    },
    pairs,
    "source-conflict",
    "Dùng bảng và sơ đồ Triệt; ví dụ Canh Ngọ ghi Thân/Dậu trái bảng Ngọ/Mùi. Quyết định bản thử, chưa hòa giải nguồn.",
  );
  const transformations = [
    ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"],
    ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"],
    ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"],
    ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"],
    ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"],
    ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"],
    ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"],
    ["Cự Môn", "Thiên Lương", "Văn Khúc", "Văn Xương"],
    ["Thiên Lương", "Tử Vi", "Tả Phù", "Vũ Khúc"],
    ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"],
  ][s];
  const all = chart.palaces.flatMap((p) => [
    ...p.majorStars,
    ...p.minorStars,
    ...p.adjectiveStars,
  ]);
  for (const star of all) delete star.mutagen;
  transformations.forEach((name, i) => {
    const target = all.find((x) => x.name === name);
    if (!target) throw Error("TANBIEN_MUTAGEN_TARGET");
    target.mutagen = ["Lộc", "Quyền", "Khoa", "Kỵ"][i];
  });
  addTrace(
    "mutagens",
    "13–14",
    "8.23",
    { yearStem: STEMS[s] },
    transformations,
    "source-formula",
    "Tân can Quyền=Thiên Lương đúng bảng đã đọc, khác bảng upstream; không tự sửa để giống nguồn khác.",
  );
  const thai = [
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
  const bac = [
    "Bác Sỹ",
    "Lực Sỹ",
    "Thanh Long",
    "Tiểu Hao",
    "Tướng Quân",
    "Tấu Thư",
    "Phi Liêm",
    "Hỷ Thần",
    "Bệnh Phù",
    "Đại Hao",
    "Phục Binh",
    "Quan Phù",
  ];
  // §8.5 prose omits Suy; §3.79 p50 supplies Suy between Đế Vượng and Bệnh. Decision disclosed in trace.
  const trang = [
    "Tràng Sinh",
    "Mộc Dục",
    "Quan Đới",
    "Lâm Quan",
    "Đế Vượng",
    "Suy",
    "Bệnh",
    "Tử",
    "Mộ",
    "Tuyệt",
    "Thai",
    "Dưỡng",
  ];
  const start = ({ 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 } as Record<number, number>)[
      cuc
    ],
    annualStart = [10, 7, 4, 1][y % 4];
  for (const p of chart.palaces) {
    const b = BRANCHES.indexOf(p.earthlyBranch),
      raw = p as typeof p & Record<string, unknown>;
    raw.suiqian12 = thai[mod(b - y)];
    raw.boshi12 = bac[mod((b - loc) * direction)];
    raw.changsheng12 = trang[mod((b - start) * direction)];
    const begin = cuc + 10 * mod((b - life) * direction);
    p.decadal = { ...p.decadal, range: [begin, begin + 9] };
    const first =
      1 + mod((b - annualStart) * (birth.gender === "male" ? 1 : -1));
    p.ages = Array.from({ length: 10 }, (_, i) => first + 12 * i);
  }
  addTrace(
    "rings",
    "9–10,16,50",
    "8.3–8.5/8.34/3.79",
    { yearBranch: BRANCHES[y], loc: BRANCHES[loc], cuc, direction },
    { thaiTue: thai, bacSy: bac, trangSinh: trang },
    "source-conflict",
    "Tràng Sinh dùng Suy từ §3.79 để hoàn thành 12 bước; vòng Tướng trước giữ iztro, chưa có đặc tả Tân Biên.",
  );
  addTrace(
    "periods",
    "20–23",
    "10.1/10.3",
    {
      cuc,
      life: BRANCHES[life],
      gender: birth.gender,
      direction,
      annualStart: BRANCHES[annualStart],
    },
    "Đại hạn cách 1; tiểu hạn khởi tuổi 1, chu kỳ12; không tính lớp lưu năm xem",
  );
  const supplemental = original
    .filter(
      (x) =>
        !planned.has(x.star.name) &&
        !["Tuần Không", "Triệt Lộ"].includes(x.star.name),
    )
    .map((x) => x.star.name);
  addTrace(
    "aliases",
    "11–13",
    "8.7/8.9/8.15/8.19",
    {},
    {
      "Tả Phụ": "Tả Phù",
      "Phượng Các": "Phụng Các",
      "Thiên Riêu": "Thiên Diêu",
      "Thai Phụ": "Đài Phụ",
    },
    "supplement",
    "Ánh xạ nhãn sách sang tên vi-VN iztro để giữ hợp đồng facts; không an hai sao do khác cách gọi.",
  );
  addTrace(
    "supplemental",
    "—",
    "quy ước dự án",
    { dependency: "iztro@2.6.1" },
    [...new Set(supplemental)],
    "supplement",
    "Giữ các sao ngoài danh mục đã đặc tả; Mệnh chủ theo chi Mệnh, Thân chủ theo chi năm, can cung theo iztro; lịch VN UTC+7, nhuận lặp tháng, đổi ngày00:00 là quy ước dự án.",
  );
  const states: Record<string, ReturnType<typeof bookState>> = {};
  for (const p of chart.palaces)
    for (const g of ["majorStars", "minorStars", "adjectiveStars"] as const)
      for (const star of p[g]) {
        const originalStar = original.find((x) => x.star.name === star.name);
        const state = bookState(star.name, p.earthlyBranch);
        states[star.name + "@" + p.earthlyBranch] = state;
        (
          star as Star & {
            originalBrightness?: string;
            originalBranch?: string;
          }
        ).originalBrightness = originalStar?.star.brightness;
        (star as Star & { originalBranch?: string }).originalBranch =
          originalStar?.branch;
        if (state?.value) star.brightness = state.value;
        else delete star.brightness;
      }
  const calculation = {
    version: TANBIEN_ENGINE_VERSION,
    sourceEdition:
      "Tác phẩm Sài Gòn1956; ebook đánh máy 2014 (PDF277trang), người đánh máy không rõ; chưa đối chiếu bản in1956",
    status: "experimental-partial" as const,
    review: null,
    inputs: {
      lunar: base.lunar,
      yearStem: STEMS[s],
      yearBranch: BRANCHES[y],
      polarity: s % 2 === 0 ? "Dương" : "Âm",
      gender: birth.gender,
      hourIndex: h,
    },
    trace,
    states,
    voidRanges: [
      {
        name: "Tuần Không",
        branches: pairs.tuan.map((b) => BRANCHES[b]),
        source: source("16–17", "8.37.1"),
      },
      {
        name: "Triệt Lộ",
        branches: pairs.triet.map((b) => BRANCHES[b]),
        source: source("17", "8.37.2"),
      },
    ],
    completeness: {
      majorStars: "complete",
      minorStars: "complete-with-declared-supplements",
      adjectiveStars: "complete-with-declared-supplements",
    },
    supplementalStars: [...new Set(supplemental)],
    limitations: [
      "Thiên Quý theo §8.13, đã đối chiếu lại vị trí ô bốn ví dụ; chưa phê duyệt chuyên môn.",
      "Kim cục ngày21/24 giữ Tử Vi upstream vì bảng mâu thuẫn/thiếu.",
      "Triệt dùng bảng/sơ đồ, ví dụ Canh Ngọ trái bảng.",
      "Hỏa nhóm Hợi/Mão/Mùi dùng khởi Dần theo bảng; ví dụ273/275 khác bảng, chưa chốt.",
      "Lịch, Mệnh chủ/Thân chủ, can cung và vòng Tướng trước là quy ước bổ sung.",
      "Không tính sao lưu, lưu đại/nguyệt/nhật/thời hạn; chưa được phê duyệt chuyên môn.",
    ],
  };
  return { chart, calculation };
}
