import type { InternalReading } from "../internal-review/reading-store";
import { receiptMatches } from "../internal-review/dynamic-reading";
import { customerInfo } from "../chart-customer-info";
import { verifiedNatalTransformations } from "../tuvi-engine/natal-transformations";
import { CHART_BRANCHES } from "../tuvi-engine/chart-integrity";
import {
  FACTS_VERSION,
  KNOWLEDGE_VERSION,
  type AiFact,
  type MenhInput,
} from "./contract";
/** Uses only the immutable saved engine output. Names, exact birth date/time,
 * email, IDs and raw input are deliberately absent from the provider packet. */
export function menhFacts(record: InternalReading): MenhInput {
  const s = record.snapshot;
  if (!record.frozen.verified || !receiptMatches(s, record.receipt))
    throw Error("AI_UNVERIFIED_SNAPSHOT");
  const ps = s.chart.palaces,
    life = ps.filter((p) => p.name === "Mệnh");
  if (life.length !== 1) throw Error("AI_LIFE_DATA_MISSING");
  const facts: AiFact[] = [],
    missing: string[] = [];
  const add = (
    id: string,
    text: string,
    paths: string[],
    kind: AiFact["kind"] = "engine",
  ) => facts.push({ id, text, paths, kind });
  const info = customerInfo(s);
  for (const label of ["Mệnh", "Cục", "Âm Dương"]) {
    const r = info.find((x) => x.label === label);
    if (r)
      add(
        "foundation." +
          { Mệnh: "element", Cục: "class", "Âm Dương": "polarity" }[label],
        `${label}: ${r.value}${r.secondary ? "; " + r.secondary : ""}`,
        ["chart.tanBien", "chart.fiveElementsClass"],
      );
  }
  const year = s.chart.tanBien?.inputs;
  if (year)
    add(
      "birth.can-chi",
      `Can chi năm sinh đã lưu: ${year.yearStem} ${year.yearBranch}.`,
      ["chart.tanBien.inputs.yearStem", "chart.tanBien.inputs.yearBranch"],
    );
  const body = ps.filter((p) => p.isBodyPalace);
  if (body.length === 1)
    add(
      "body.location",
      `Thân cư ${body[0].name}, tại ${body[0].earthlyBranch}.`,
      ["chart.palaces"],
    );
  else missing.push("Chưa xác định duy nhất cung an Thân.");
  for (const p of ps) {
    const i = ps.indexOf(p),
      prefix = "palace." + i;
    add(
      prefix + ".location",
      `${p.name} tại ${p.earthlyBranch}; can cung ${p.heavenlyStem}. Đây là dữ kiện cung, không phải kết quả luận chủ đề cung ấy.`,
      [`chart.palaces.${i}`],
    );
    for (const group of [
      "majorStars",
      "minorStars",
      "adjectiveStars",
    ] as const) {
      const list = p[group];
      if (!Array.isArray(list)) {
        missing.push(`${p.name}: thiếu ${group}`);
        continue;
      }
      if (!list.length)
        add(
          prefix + "." + group + ".empty",
          `${p.name}: không có sao trong nhóm ${{ majorStars: "chính tinh", minorStars: "phụ tinh", adjectiveStars: "các sao khác" }[group]} đã lưu.`,
          [`chart.palaces.${i}.${group}`],
        );
      list.forEach((star, j) => {
        const state =
          s.chart.tanBien?.states[star.name + "@" + p.earthlyBranch];
        add(
          prefix + "." + group + "." + j,
          `${p.name} tại ${p.earthlyBranch}: ${star.name}; nhóm ${{ majorStars: "chính tinh", minorStars: "phụ tinh", adjectiveStars: "các sao khác" }[group]}; trạng thái đã lưu ${state?.value || star.brightness || "chưa ghi nhận"}${state?.source ? "; nguồn trạng thái: " + state.source : ""}.`,
          [`chart.palaces.${i}.${group}.${j}`],
        );
      });
    }
  }
  const at = CHART_BRANCHES.indexOf(life[0].earthlyBranch);
  if (at < 0) throw Error("AI_BRANCH_MISSING");
  for (const [relation, offsets] of [
    ["tam-hop", [4, 8]],
    ["xung-chieu", [6]],
    ["giap-cung", [-1, 1]],
  ] as const) {
    const selected = offsets.map(
      (n) =>
        ps.find((p) => p.earthlyBranch === CHART_BRANCHES[(at + n + 12) % 12])!,
    );
    if (selected.some((p) => !p)) throw Error("AI_GEOMETRY_INCOMPLETE");
    add(
      "geometry." + relation,
      `${relation} của Mệnh: ${selected.map((p) => p.name + " tại " + p.earthlyBranch).join("; ")}. Chỉ xác định vị trí, không tự mượn sao hay áp cách cục.`,
      ["chart.palaces"],
      "geometry",
    );
  }
  const cert = verifiedNatalTransformations(s.chart);
  if (cert) {
    for (const t of cert.entries)
      add(
        "natal." + t.kind,
        `Tứ Hóa năm sinh: ${t.star} hóa ${t.kind}, tại ${t.palace} (${t.branch}). ${cert.source}`,
        ["chart.natalTransformations"],
      );
    const note = s.chart.tanBien?.trace.find((t) => t.id === "mutagens")?.note;
    if (note) add("natal.limit", note, ["chart.tanBien.trace"]);
  } else
    missing.push(
      "Chưa có chứng nhận Tứ Hóa năm sinh nhất quán; không được tính bù.",
    );
  for (const [i, v] of (s.chart.tanBien?.voidRanges ?? []).entries())
    add(
      "void." + i,
      `${v.name}: các địa chi đã lưu ${v.branches.join(", ")}.`,
      ["chart.tanBien.voidRanges"],
    );
  return {
    version: FACTS_VERSION,
    knowledgeVersion: KNOWLEDGE_VERSION,
    facts,
    knowledge: [],
    missing,
  };
}
