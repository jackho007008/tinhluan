/** Source definitions, not an interpretation evaluator. See docs/CAREER-DEFINITIONS-1.20.0.md. */
export const CAREER_METHOD = "career-definitions/1.0.0";
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
const paired = [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const elements = ["Thủy", "Kim", "Hỏa", "Mộc"] as const;
/** Tân Biên PDF18–19,33 §2.9. A specific condition overrides the general term.
 * Unqualified 'gặp' is deliberately not inferred to mean 'hội hợp'. */
export function sourceRelation(
  from: string,
  to: string,
  term: "hội hợp" | "gặp",
  specific?: "đồng cung" | "tam hợp" | "xung chiếu",
) {
  const a = BRANCHES.indexOf(from),
    b = BRANCHES.indexOf(to);
  if (a < 0 || b < 0) return undefined;
  const d = (b - a + 12) % 12;
  if (specific === "đồng cung") return d === 0;
  if (specific === "tam hợp") return d === 4 || d === 8;
  if (specific === "xung chiếu") return d === 6;
  return term === "hội hợp" ? [0, 4, 6, 8].includes(d) : undefined;
}
/** Thiên Lương PDF122–124: the element of the TRINE, not the branch. */
export function directionalRelation(from: string, to: string) {
  const a = BRANCHES.indexOf(from),
    b = BRANCHES.indexOf(to);
  if (a < 0 || b < 0) return undefined;
  const origin = elements[a % 4],
    target = elements[b % 4];
  if (paired[a] === b) {
    const creates: Record<string, string> = {
      Kim: "Thủy",
      Thủy: "Mộc",
      Mộc: "Hỏa",
      Hỏa: "Thổ",
    };
    return {
      relation: "nhị hợp",
      origin,
      target,
      direction: creates[origin] === target ? "sinh xuất" : "sinh nhập",
    };
  }
  if ((b - a + 12) % 12 === 6) {
    return {
      relation: "xung chiếu",
      origin,
      target,
      direction: ["Thủy", "Kim"].includes(origin) ? "khắc xuất" : "khắc nhập",
    };
  }
  return undefined;
}
/** Thiên Lương PDF86. Validate saved pair; never manufacture one or propagate a beam. */
export function voidMembership(
  branch: string,
  pair: unknown,
): boolean | undefined {
  if (
    !BRANCHES.includes(branch) ||
    !Array.isArray(pair) ||
    pair.length !== 2 ||
    !pair.every((x) => typeof x === "string" && BRANCHES.includes(x))
  )
    return undefined;
  const distance =
    (BRANCHES.indexOf(pair[1]) - BRANCHES.indexOf(pair[0]) + 12) % 12;
  if (distance !== 1 && distance !== 11) return undefined;
  return pair.includes(branch);
}
