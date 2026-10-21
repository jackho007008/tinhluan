import { verifiedNatalTransformations } from "../tuvi-engine/natal-transformations";
import type { ChartSnapshot } from "../tuvi-engine";
import type { DerivedFact } from "./derived";
/** TB PDF164 §8.19, source spec career-ky/1.0.0. No brightness dependency. */
export function careerKyFacts(s: ChartSnapshot): DerivedFact[] {
  const qs = s.chart.palaces
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p.name === "Quan Lộc");
  if (qs.length !== 1) return [];
  const { p, i } = qs[0],
    base = `chart.palaces.${i}`,
    fields = ["majorStars", "minorStars"] as const;
  const out: DerivedFact[] = [];
  const push = (id: string, value: boolean, text: string, paths: string[]) =>
    out.push({
      id: "fact." + id,
      derivationId: id,
      version: "1.1.0",
      value: value ? "yes" : "no",
      text,
      evidencePaths: [base + ".name", ...paths],
      status: "engine-reported",
      limitation:
        "Phạm vi chính Quan Lộc, bản mệnh; không suy vắng mặt từ metadata thiếu. Không dùng bảng trạng thái.",
    });
  const hits = fields.flatMap((f) =>
    (Array.isArray(p[f]) ? p[f] : []).flatMap((st, j) =>
      st && (st as { scope?: string }).scope === "origin" && st.mutagen === "Kỵ"
        ? [
            `${base}.${f}.${j}.name`,
            `${base}.${f}.${j}.scope`,
            `${base}.${f}.${j}.mutagen`,
          ]
        : [],
    ),
  );
  const c = s.chart.tanBien?.completeness;
  const full =
    c?.majorStars === "complete" &&
    c?.minorStars === "complete-with-declared-supplements" &&
    fields.every(
      (f) =>
        Array.isArray(p[f]) &&
        p[f].every(
          (st) =>
            st &&
            typeof st.name === "string" &&
            (st as { scope?: string }).scope === "origin" &&
            typeof st.mutagen === "string" &&
            ["", "Lộc", "Quyền", "Khoa", "Kỵ"].includes(st.mutagen),
        ),
    );
  const certified = verifiedNatalTransformations(s.chart);
  if (hits.length || full || certified)
    push(
      "career-origin-ky",
      !!hits.length,
      hits.length
        ? "Có Hóa Kỵ bản mệnh tại chính Quan Lộc."
        : "Chứng cứ Tứ Hóa đầy đủ xác nhận không có Hóa Kỵ bản mệnh tại Quan Lộc.",
      hits.length
        ? hits
        : certified ? ["chart.natalTransformations", "chart.tanBien.trace", base + ".name"] : [
            base + ".majorStars",
            base + ".minorStars",
            "chart.tanBien.completeness",
          ],
    );
  const valid = [
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
  ].includes(p.earthlyBranch);
  if (!valid) return out;
  const rightBranch = ["Sửu", "Mùi"].includes(p.earthlyBranch);
  const both = ["Thái Dương", "Thái Âm"].every((n) =>
    p.majorStars?.some(
      (st) => st.name === n && (st as { scope?: string }).scope === "origin",
    ),
  );
  const majorFull =
    c?.majorStars === "complete" &&
    Array.isArray(p.majorStars) &&
    p.majorStars.every(
      (st) =>
        st &&
        typeof st.name === "string" &&
        (st as { scope?: string }).scope === "origin",
    );
  if (!rightBranch || both || majorFull)
    push(
      "career-ky-sun-moon-exception",
      rightBranch && both,
      !rightBranch
        ? "Quan Lộc không ở Sửu/Mùi: không thuộc ngoại lệ Nhật–Nguyệt của §8.19."
        : both
          ? "Thái Dương và Thái Âm bản mệnh cùng ở Quan Lộc tại Sửu/Mùi: thỏa ngoại lệ §8.19."
          : "Danh sách chính tinh đầy đủ không có đủ Nhật–Nguyệt đồng cung Quan Lộc tại Sửu/Mùi.",
      [
        base + ".earthlyBranch",
        ...(rightBranch
          ? [base + ".majorStars", "chart.tanBien.completeness"]
          : []),
      ],
    );
  return out;
}
