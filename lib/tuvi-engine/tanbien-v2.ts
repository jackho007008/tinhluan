import { decadalLayer } from "./decadal";
import { solarToLunar } from "../calendar/vietnamese.cjs";
import type { BirthInput } from "../calendar";
import type { ChartData } from "./index";
import { applyTanBien, BRANCHES, STEMS, source, bookState } from "./tanbien";
export const TANBIEN_V2_PROFILE = "tanbien-vn-trial-v2" as const;
export const TANBIEN_V2_VERSION = "tanbien-trial-0.3.0";
const mod = (v: number, n = 12) => ((v % n) + n) % n;
const integer = (v: number, min: number, max: number) =>
  Number.isInteger(v) && v >= min && v <= max;
/** §8.29 p15: three literal source groups, NOT an upstream lookup. Tý=0. */
export function phaToai(yearBranch: number): number | null {
  return integer(yearBranch, 0, 11) ? [5, 1, 9][yearBranch % 3] : null;
}
/** §10.2 pp21–22. Uses the diagrams' 27/38 endpoints; textual repetitions remain documented conflicts. */
export function flowingDecade(
  base: number,
  offset: number,
  direction: 1 | -1,
): number | null {
  if (
    !integer(base, 0, 11) ||
    !integer(offset, 0, 9) ||
    ![1, -1].includes(direction)
  )
    return null;
  return mod(
    base +
      (offset === 0
        ? 0
        : 6 +
          (offset === 1
            ? 0
            : offset === 2
              ? -direction
              : (offset - 3) * direction)),
  );
}
/** §10.4 method 1; explicit lunar birth month and chi-hour, no solar-time/day-night inference. */
export function monthPalace(
  annual: number,
  birthMonth: number,
  hour: number,
  month: number,
): number | null {
  return integer(annual, 0, 11) &&
    integer(birthMonth, 1, 12) &&
    integer(hour, 0, 11) &&
    integer(month, 1, 12)
    ? mod(annual - (birthMonth - 1) + hour + month - 1)
    : null;
}
/** §§10.5–10.6 pp23–24: ordinal day/hour only; caller must validate the selected civil/lunar date separately. */
export function dayHourPalace(month: number, day: number, hour?: number) {
  if (
    !integer(month, 0, 11) ||
    !integer(day, 1, 30) ||
    (hour !== undefined && !integer(hour, 0, 11))
  )
    return null;
  const daily = mod(month + day - 1);
  return { daily, hourly: hour === undefined ? null : mod(daily + hour) };
}
export function annualStars(stem: number, branch: number) {
  if (
    !integer(stem, 0, 9) ||
    !integer(branch, 0, 11) ||
    stem % 2 !== branch % 2
  )
    return null;
  const loc = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][stem];
  return [
    ["Thái Tuế", branch],
    ["Tang Môn", branch + 2],
    ["Bạch Hổ", branch + 8],
    ["Thiên Khốc", 6 - branch],
    ["Thiên Hư", 6 + branch],
    ["Lộc Tồn", loc],
    ["Kình Dương", loc + 1],
    ["Đà La", loc - 1],
    ["Thiên Mã", [2, 11, 8, 5][branch % 4]],
  ].map(([name, b]) => ({
    name: `Lưu ${name}`,
    branch: BRANCHES[mod(Number(b))],
    scope: "year" as const,
    source: source("268–269", "4.1–4.4"),
  }));
}
export function bookStateV2(name: string, branch: string) {
  if (["Hóa Kỵ", "Đại Hao", "Tiểu Hao", "Tang Môn", "Bạch Hổ"].includes(name))
    return {
      value: (name === "Hóa Kỵ"
        ? ["Thìn", "Tuất", "Sửu", "Mùi"]
        : ["Dần", "Thân", "Mão", "Dậu"]
      ).includes(branch)
        ? "Đắc"
        : undefined,
      version: "tanbien-secondary-states-0.2.0",
      source: source(
        "41",
        name === "Hóa Kỵ" ? "3.26" : name.includes("Hao") ? "3.27" : "3.28",
      ),
    };
  const state = bookState(name, branch);
  return state && ["Kình Dương", "Đà La"].includes(name)
    ? { ...state, source: source("39", "3.14") }
    : state;
}
const NAP_AM = [
  "Hải Trung Kim",
  "Lò Trung Hỏa",
  "Đại Lâm Mộc",
  "Lộ Bàng Thổ",
  "Kiếm Phong Kim",
  "Sơn Đầu Hỏa",
  "Giản Hạ Thủy",
  "Thành Đầu Thổ",
  "Bạch Lạp Kim",
  "Dương Liễu Mộc",
  "Tuyền Trung Thủy",
  "Ốc Thượng Thổ",
  "Tích Lịch Hỏa",
  "Tùng Bách Mộc",
  "Trường Lưu Thủy",
  "Sa Trung Kim",
  "Sơn Hạ Hỏa",
  "Bình Địa Mộc",
  "Bích Thượng Thổ",
  "Kim Bạc Kim",
  "Phú Đăng Hỏa",
  "Thiên Hà Thủy",
  "Đại Dịch Thổ",
  "Thoa Xuyến Kim",
  "Tang Đố Mộc",
  "Đại Khê Thủy",
  "Sa Trung Thổ",
  "Thiên Thượng Hỏa",
  "Thạch Lựu Mộc",
  "Đại Hải Thủy",
];
export function napAm(year: number) {
  return Number.isInteger(year)
    ? {
        value: NAP_AM[Math.floor(mod(year - 4, 60) / 2)],
        version: "tanbien-nap-am-1.0.0",
        source: source("241–242", "22"),
        note: "Giữ tên trong ebook (Lò Trung, Phú Đăng, Đại Dịch); không suy tác động.",
      }
    : null;
}
export function applyTanBienV2(base: ChartData, birth: BirthInput) {
  const { chart, calculation } = applyTanBien(base, birth);
  const year = chart.lunar.lunarYear,
    y = mod(year - 4),
    s = mod(year - 4, 10);
  const target = BRANCHES[phaToai(y)!];
  const old = chart.palaces
    .flatMap((p) => p.adjectiveStars)
    .find((st) => st.name === "Phá Toái");
  if (!old) throw Error("TANBIEN_MISSING_PHA_TOAI");
  for (const p of chart.palaces)
    p.adjectiveStars = p.adjectiveStars.filter((st) => st.name !== "Phá Toái");
  chart.palaces
    .find((p) => p.earthlyBranch === target)!
    .adjectiveStars.push(old);
  const placement = calculation.trace.find((t) => t.id === "star.Phá Toái")!;
  placement.result = target;
  placement.note =
    "v2 sửa ánh xạ hai nhóm chi của v1 theo bảng trang15; đối chiếu phụ lục272–275. Không sửa bản v1.";
  // Recompute all source states at their final branch. Never retain a moved star's old brightness.
  calculation.states = {};
  for (const p of chart.palaces) {
    for (const st of [...p.majorStars, ...p.minorStars, ...p.adjectiveStars]) {
      const state = bookStateV2(st.name, p.earthlyBranch);
      calculation.states[st.name + "@" + p.earthlyBranch] = state;
      if (state?.value) st.brightness = state.value;
      else delete st.brightness;
      if (st.mutagen)
        calculation.states["Hóa " + st.mutagen + "@" + p.earthlyBranch] =
          bookStateV2("Hóa " + st.mutagen, p.earthlyBranch);
    }
    const raw = p as typeof p & Record<string, unknown>;
    for (const key of ["boshi12", "suiqian12"])
      if (typeof raw[key] === "string") {
        const name = raw[key] as string;
        calculation.states[name + "@" + p.earthlyBranch] = bookStateV2(
          name,
          p.earthlyBranch,
        );
      }
    // Can cung is independent of star movement: verify inherited implementation against bảng can tháng §11.4.4 p29 (áp sang can cung là quy ước bổ sung).
    const b = BRANCHES.indexOf(p.earthlyBranch);
    const expected = STEMS[mod((s % 5) * 2 + 2 + mod(b - 2), 10)];
    if (p.heavenlyStem !== expected)
      throw Error("TANBIEN_PALACE_STEM_MISMATCH");
  }
  calculation.version = TANBIEN_V2_VERSION;
  const mutagens = calculation.trace.find((t) => t.id === "mutagens")!;
  if (s === 7) {
    mutagens.status = "source-conflict";
    mutagens.note =
      "Bảng trang14: Tân Quyền ở Thiên Lương; ví dụ273 ghi Quyền ở Sửu,275 ở Thân, không phải cung Thiên Lương. Giữ bảng trong bản thử, chưa hòa giải nguồn.";
  }
  calculation.trace.push({
    id: "palace-stems",
    source: source("29", "11.4.4"),
    status: "supplement",
    input: { yearStem: STEMS[s] },
    result: chart.palaces.map((p) => ({
      branch: p.earthlyBranch,
      stem: p.heavenlyStem,
    })),
    note: "Kiểm tra từng can cung kế thừa iztro bằng bảng can tháng và đếm thuận; việc áp bảng tháng cho can cung là quy ước bổ sung, không gọi là phép an cung đã nêu riêng trong sách.",
  });
  const life = BRANCHES.indexOf(
    chart.palaces.find((p) => p.name === "Mệnh")!.earthlyBranch,
  );
  const direction = (s % 2 === 0) === (birth.gender === "male") ? 1 : -1;
  const viewYear = birth.viewYear;
  let viewing:
    | undefined
    | {
        year: number;
        canChi: string;
        age: number;
        ageConvention: string;
        stars: NonNullable<ReturnType<typeof annualStars>>;
        annual: string;
        decade: string | null;
        months: { month: number; branch: string }[];
      };
  if (viewYear !== undefined) {
    const age = viewYear - year + 1;
    const cuc = Number(calculation.trace.find((t) => t.id === "cuc")!.result);
    const annual = mod(
      [10, 7, 4, 1][y % 4] + (age - 1) * (birth.gender === "male" ? 1 : -1),
    );
    const decadeBase =
      age >= cuc ? mod(life + direction * Math.floor((age - cuc) / 10)) : null;
    const decade =
      decadeBase === null
        ? null
        : flowingDecade(decadeBase, (age - cuc) % 10, direction);
    viewing = {
      year: viewYear,
      canChi: `${STEMS[mod(viewYear - 4, 10)]} ${BRANCHES[mod(viewYear - 4)]}`,
      age,
      ageConvention:
        "Tuổi mụ theo năm âm: năm xem − năm âm sinh + 1; năm xem là nhãn năm âm, không tự lấy ngày hiện tại.",
      stars: annualStars(mod(viewYear - 4, 10), mod(viewYear - 4))!,
      annual: BRANCHES[annual],
      decade: decade === null ? null : BRANCHES[decade],
      months: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        branch:
          BRANCHES[
            monthPalace(
              annual,
              chart.lunar.lunarMonth,
              calculation.inputs.hourIndex,
              i + 1,
            )!
          ],
      })),
    };
    calculation.trace.push({
      id: "view-year",
      source: source("21–24,268–269", "10.2–10.6/4.1–4.4"),
      status: "source-conflict",
      input: {
        viewYear,
        age,
        birthMonth: chart.lunar.lunarMonth,
        hourIndex: calculation.inputs.hourIndex,
        direction,
      },
      result: viewing,
      note: "Lưu đại hạn theo bước và sơ đồ; văn ví dụ21–22 lặp số, sơ đồ22 ghi tên Cục khác tiêu đề. Lưu nguyệt cách1. Sao lưu riêng, không đưa vào facts bản mệnh. Nhật/thời hạn chỉ xuất khi chọn ngày cụ thể; tháng nhuận xem giữ unknown.",
    });
  }
  let selectedPeriod:
    | undefined
    | {
        date: string;
        lunar: ReturnType<typeof solarToLunar>;
        status: string;
        month: string | null;
        day: string | null;
        hour: string | null;
        reason: string;
        source: string;
      };
  if (birth.viewDate && viewing) {
    const lunar = solarToLunar(birth.viewDate);
    if (lunar.lunarYear !== viewing.year) throw Error("VIEW_YEAR_MISMATCH");
    const m = lunar.isLeap
      ? null
      : monthPalace(
          BRANCHES.indexOf(viewing.annual),
          chart.lunar.lunarMonth,
          calculation.inputs.hourIndex,
          lunar.lunarMonth,
        );
    const d =
      m === null ? null : dayHourPalace(m, lunar.lunarDay, birth.viewHourIndex);
    selectedPeriod = {
      date: birth.viewDate,
      lunar,
      status: m === null ? "unknown" : "computed",
      month: m === null ? null : BRANCHES[m],
      day: d === null ? null : BRANCHES[d.daily],
      hour:
        d?.hourly === null || d?.hourly === undefined
          ? null
          : BRANCHES[d.hourly],
      reason:
        m === null
          ? "Chưa chốt cách lưu nguyệt cho tháng nhuận xem; không fallback sang tháng thường."
          : birth.viewHourIndex === undefined
            ? "Chưa chọn giờ xem; không tự gán giờ."
            : "Chỉ vị trí, không diễn giải vận.",
      source: source("23–24", "10.4–10.6"),
    };
    calculation.trace.push({
      id: "view-day-hour",
      source: selectedPeriod.source,
      status: "source-formula",
      input: {
        viewDate: birth.viewDate,
        viewHourIndex: birth.viewHourIndex,
        lunarMonth: lunar.lunarMonth,
        lunarDay: lunar.lunarDay,
        isLeap: lunar.isLeap,
      },
      result: selectedPeriod,
    });
  }
  const childNames = [
    "Mệnh",
    "Tài Bạch",
    "Tật Ách",
    "Phu Thê",
    "Phúc Đức",
    "Quan Lộc",
    "Nô Bộc",
    "Thiên Di",
    "Tử Nữ",
    "Huynh Đệ",
    "Phụ Mẫu",
    "Điền Trạch",
  ];
  const childhood = childNames.map((name, i) => ({
    age: i + 1,
    palace: name,
    branch: chart.palaces.find((p) => p.name === name)?.earthlyBranch ?? null,
  }));
  calculation.trace.push({
    id: "childhood-palaces",
    source: source("239", "21.2"),
    status: "source-formula",
    input: { life: BRANCHES[life] },
    result: childhood,
    note: "Chỉ vị trí cung tuổi1–12, không triển khai phán đoán sức khỏe/tử vong trong phần luận tuổi trẻ.",
  });
  calculation.limitations = calculation.limitations
    .filter((x) => !x.startsWith("Không tính sao lưu"))
    .concat([
      "Tứ Hóa can Tân: bảng và hai ví dụ phụ lục mâu thuẫn; bản thử giữ bảng trang14.",
      "Sao lưu chỉ có khi chọn năm âm xem; tách khỏi sao bản mệnh. Nhật/thời hạn tính khi chọn ngày giờ xem hợp lệ; chưa đặc tả tháng nhuận xem.",
      "Chưa được chuyên gia phê duyệt; phạm vi đối chiếu độc lập được ghi riêng trong danh mục.",
    ]);
  const birthElement = napAm(year);
  calculation.trace.push({
    id: "birth-element",
    source: source("241–242", "22"),
    status: "source-formula",
    input: { yearStem: STEMS[s], yearBranch: BRANCHES[y] },
    result: birthElement,
  });
  const inheritance = {
    version: "tanbien-inheritance-0.2.0",
    checked: [
      "Lịch VN và cầu nối lịch riêng; không đổi quy ước",
      "Can cung bảng can tháng §11.4.4 p29 (áp sang can cung là quy ước bổ sung); chặn nếu khác",
      "Thứ tự cung/vị trí Mệnh-Thân §5–6 p6–7",
    ],
    supplements: [
      "Mệnh chủ theo chi Mệnh, Thân chủ theo chi năm (iztro2.6.1; sách chưa tìm thấy phép an)",
      "isOriginalPalace, chỉ số cung, scope/type và tên alias là metadata upstream",
      "Vòng Tướng trước (jiangqian12) chưa có phép an trong sách",
      "Can/chi đại hạn đi theo can/chi cung, không phải sao lưu",
      "UTC+7, đổi ngày00:00, tháng nhuận lặp tháng, đầu vào dương1976–2050",
    ],
    supplementalStars: calculation.supplementalStars,
  };
  return {
    chart,
    calculation: {
      ...calculation,
      viewing,
      decadal: decadalLayer(chart, birth.viewYear, birth.gender),
      selectedPeriod,
      childhood,
      inheritance,
      birthElement,
    },
  };
}
export type TanBienV2Calculation = ReturnType<
  typeof applyTanBienV2
>["calculation"];
