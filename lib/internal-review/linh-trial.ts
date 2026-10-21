import type { ChartSnapshot } from "../tuvi-engine";
import { catalog } from "../interpretation-rules/catalog";
import { executeRules } from "../interpretation-rules/execute";
import { deriveFacts } from "../interpretation-rules/derived";
export const LINH_FORMULA = {
  id: "tanbien-linh-comparison",
  version: "0.1.0",
  source:
    "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, PDF/trang in 10–11, §8.6.3",
  status: "draft",
  review: null,
};
export const branches = [
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
const mod = (n: number) => ((n % 12) + 12) % 12;
export function linhPosition(input: {
  yearBranch?: string;
  polarity?: string;
  gender?: string;
  timeIndex?: number;
}) {
  const { yearBranch, polarity, gender, timeIndex } = input;
  const reasons: string[] = [];
  if (!yearBranch || !branches.includes(yearBranch))
    reasons.push("Chưa xác định chi năm sinh");
  if (!["yang", "yin"].includes(polarity || ""))
    reasons.push("Chưa xác định âm/dương năm");
  if (!["male", "female"].includes(gender || ""))
    reasons.push("Chưa xác định giới tính theo quy tắc");
  if (!Number.isInteger(timeIndex) || timeIndex! < 0 || timeIndex! > 11)
    reasons.push("Chưa xác định chỉ số chi giờ 0–11");
  if (
    yearBranch &&
    branches.includes(yearBranch) &&
    ["yang", "yin"].includes(polarity || "") &&
    (branches.indexOf(yearBranch) % 2 === 0) !== (polarity === "yang")
  )
    reasons.push("Chi năm và âm/dương không nhất quán");
  if (reasons.length)
    return { status: "unknown" as const, reasons, formula: LINH_FORMULA };
  const group = ["Dần", "Ngọ", "Tuất"].includes(yearBranch!)
    ? "Dần/Ngọ/Tuất"
    : ["Thân", "Tý", "Thìn"].includes(yearBranch!)
      ? "Thân/Tý/Thìn"
      : ["Tỵ", "Dậu", "Sửu"].includes(yearBranch!)
        ? "Tỵ/Dậu/Sửu"
        : "Hợi/Mão/Mùi";
  const start = group === "Dần/Ngọ/Tuất" ? "Mão" : "Tuất";
  const direction =
    (polarity === "yang" && gender === "male") ||
    (polarity === "yin" && gender === "female")
      ? -1
      : 1;
  const trace = Array.from({ length: timeIndex! + 1 }, (_, step) => ({
    step,
    hour: branches[step],
    branch: branches[mod(branches.indexOf(start) + direction * step)],
  }));
  return {
    status: "computed" as const,
    input,
    formula: LINH_FORMULA,
    group,
    start,
    direction,
    trace,
    branch: trace.at(-1)!.branch,
    reasons: [],
  };
}
export function compareLinh(snapshot: ChartSnapshot) {
  const year = snapshot.chart.lunar?.lunarYear,
    hour = snapshot.normalized?.hour;
  const formula = linhPosition({
    yearBranch: Number.isInteger(year) ? branches[mod(year + 8)] : undefined,
    polarity: Number.isInteger(year)
      ? year % 2 === 0
        ? "yang"
        : "yin"
      : undefined,
    gender: snapshot.normalized?.gender,
    timeIndex:
      typeof hour === "number" &&
      Number.isInteger(hour) &&
      hour >= 0 &&
      hour <= 23
        ? hour === 23
          ? 0
          : Math.floor((hour + 1) / 2)
        : undefined,
  });
  const base = {
    parentResultId: snapshot.resultId,
    kind: "diagnostic-sensitivity-only",
    formula,
  };
  if (formula.status === "unknown")
    return { ...base, status: "unknown" as const, reasons: formula.reasons };
  const ps = snapshot.chart.palaces;
  if (
    ps.length !== 12 ||
    new Set(ps.map((p) => p.earthlyBranch)).size !== 12 ||
    ps.some(
      (p) =>
        !branches.includes(p.earthlyBranch) || !Array.isArray(p.minorStars),
    ) ||
    snapshot.normalized.unknownTime
  )
    return {
      ...base,
      status: "unknown" as const,
      reasons: ["Thiếu dữ liệu cung/phụ tinh/giờ sinh đầy đủ"],
    };
  const locations = ps.flatMap((p, i) =>
    p.minorStars
      .filter((s) => s.name === "Linh Tinh")
      .map((s) => ({ p, i, s })),
  );
  if (locations.length !== 1)
    return {
      ...base,
      status: "unknown" as const,
      reasons: [
        "Cần đúng một Linh Tinh trong danh sách phụ tinh để so vị trí đã lưu",
      ],
    };
  const old = locations[0],
    target = ps.findIndex((p) => p.earthlyBranch === formula.branch);
  const clone = structuredClone(snapshot);
  const changed = old.i !== target;
  // The copy never leaves this function or becomes a persisted engine snapshot.
  if (changed) {
    clone.chart.palaces[old.i].minorStars = clone.chart.palaces[
      old.i
    ].minorStars.filter((s) => s.name !== "Linh Tinh");
    clone.chart.palaces[target].minorStars.push({
      ...old.s,
      brightness: undefined,
    });
  }
  const before = executeRules(snapshot, catalog, "internal-draft"),
    after = executeRules(clone, catalog, "internal-draft");
  const bf = deriveFacts(snapshot),
    af = deriveFacts(clone);
  const factChanges = [...new Set([...bf, ...af].map((f) => f.id))].flatMap(
    (id) => {
      const a = bf.find((f) => f.id === id),
        b = af.find((f) => f.id === id);
      return JSON.stringify(a) !== JSON.stringify(b)
        ? [{ id, before: a ?? null, after: b ?? null }]
        : [];
    },
  );
  const ruleChanges = before.traces.flatMap((t) => {
    const a = after.traces.find((x) => x.ruleId === t.ruleId)!;
    return JSON.stringify(t) !== JSON.stringify(a)
      ? [{ ruleId: t.ruleId, before: t, after: a }]
      : [];
  });
  const claimKey = (c: (typeof before.previewClaims)[number]) =>
    JSON.stringify({ id: c.id, text: c.text, rules: c.rules.map((r) => r.id) });
  return {
    ...base,
    status: "compared" as const,
    old: {
      branch: old.p.earthlyBranch,
      palace: old.p.name,
      brightness: old.s.brightness,
    },
    proposed: { branch: formula.branch, palace: ps[target].name },
    changed,
    lifeMovement:
      old.p.name === "Mệnh" && ps[target].name !== "Mệnh"
        ? "ra Mệnh"
        : old.p.name !== "Mệnh" && ps[target].name === "Mệnh"
          ? "vào Mệnh"
          : "không đổi việc có mặt tại Mệnh",
    factChanges,
    ruleChanges,
    dependentRules: before.traces
      .filter((t) => t.ruleId.startsWith("combination.ziwei-assistants"))
      .map((t) => ({
        ruleId: t.ruleId,
        before: t,
        after: after.traces.find((x) => x.ruleId === t.ruleId)!,
      })),
    claimsRemoved: before.previewClaims.filter(
      (c) => !after.previewClaims.some((d) => claimKey(c) === claimKey(d)),
    ),
    claimsAdded: after.previewClaims.filter(
      (c) => !before.previewClaims.some((d) => claimKey(c) === claimKey(d)),
    ),
    limitation:
      "Chỉ thay vị trí Linh trong bản sao chẩn đoán; bỏ nhãn brightness cũ nếu chuyển cung, không tính nhãn mới. Không phải profile Tân Biên hoặc kết quả Toàn Thư hợp lệ. Không xuất bản sao như snapshot engine.",
  };
}
