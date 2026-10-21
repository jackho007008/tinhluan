import {
  SATINH_METHOD_VERSION,
  satinhState,
  snapshotSatinhStates,
} from "../interpretation-rules/satinh-states";
import {
  CAREER_METHOD,
  directionalRelation,
  sourceRelation,
  voidMembership,
} from "./career-definitions";
import type { ChartSnapshot } from "../tuvi-engine";
import type { Claim } from "../interpretation-rules/execute";
import { bookState } from "../tuvi-engine/tanbien";
import { careerSourceGate } from "../interpretation-rules/derived";
import { palaceGeometry, uniquePalace } from "./tanbien-presentation";

export const CAREER_CONDITIONS_VERSION = "1.5.0";
export type CareerCondition = {
  id: string;
  title: string;
  state: "checked" | "not-applicable" | "unresolved";
  cause?:
    | "missing-data"
    | "undefined-relation"
    | "missing-interpretation"
    | "source-conflict";
  text: string;
  paths: string[];
  source: string;
  claimIds: string[];
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
const tough = [
  "Kình Dương",
  "Đà La",
  "Hỏa Tinh",
  "Linh Tinh",
  "Địa Không",
  "Địa Kiếp",
];
export function positionLight(state?: string) {
  if (["Miếu", "Vượng", "Đắc"].includes(state || "")) return "sáng theo vị trí";
  if (state === "Hãm") return "mờ theo vị trí";
  if (["Bình", "Bình hòa"].includes(state || "")) return "Bình hòa — giữ riêng";
  return "chưa có ánh xạ theo nguồn này";
}
const partners: Record<string, string> = {
  Tý: "Sửu",
  Sửu: "Tý",
  Dần: "Hợi",
  Hợi: "Dần",
  Mão: "Tuất",
  Tuất: "Mão",
  Thìn: "Dậu",
  Dậu: "Thìn",
  Tỵ: "Thân",
  Thân: "Tỵ",
  Ngọ: "Mùi",
  Mùi: "Ngọ",
};
export function careerRelations(from: string, to: string): string[] {
  if (!branches.includes(from) || !branches.includes(to)) return [];
  const delta = (branches.indexOf(to) - branches.indexOf(from) + 12) % 12;
  return [
    delta === 0 ? "đồng cung" : null,
    [4, 8].includes(delta) ? "tam hợp" : null,
    delta === 6 ? "đối cung" : null,
    partners[from] === to ? "nhị hợp" : null,
    [1, 11].includes(delta) ? "cung kề (chưa suy cách giáp)" : null,
  ].filter((x): x is string => !!x);
}
export type CareerObservation = {
  name: string;
  relations: string[];
  relation: string;
  palace: string;
  branch: string;
  state?: string;
  light: string;
  nature: string;
  source?: string;
  paths: string[];
};
/** Frozen evidence assessment, not another evaluator. Prose interpretations come
 * from the existing claims; unresolved source terms never become inferred effects. */
export function careerConditions(
  s: ChartSnapshot,
  claims: Claim[],
  verified: boolean,
) {
  const interpretationStates = snapshotSatinhStates(s);
  const observations: CareerObservation[] = [];
  const rows: CareerCondition[] = [],
    q = uniquePalace(s, "Quan Lộc");
  const ids = claims.map((c) => c.id);
  const add = (r: Omit<CareerCondition, "claimIds">, claimIds = ids) =>
    rows.push({ ...r, claimIds });
  if (!q) {
    add({
      id: "career-location",
      title: "Vị trí Quan Lộc",
      state: "unresolved",
      cause: "missing-data",
      text: "Hồ sơ không xác định duy nhất cung Quan Lộc; chưa kiểm tra được các quan hệ cung.",
      paths: [],
      source: "Snapshot đã lưu",
    });
    return {
      version: CAREER_CONDITIONS_VERSION,
      interpretationStateVersion: SATINH_METHOD_VERSION,
      interpretationStates,
      rows,
      observations,
      readerFacts: ["Chưa đủ dữ kiện xác định cung Quan Lộc."],
      research: [] as {
        id: string;
        text: string;
        included: string[];
        added: string[];
      }[],
      summary: "Chưa đủ dữ kiện xác định cung Quan Lộc.",
    };
  }
  const base = `chart.palaces.${q.i}`,
    ps = s.chart.palaces;
  const gate = careerSourceGate(s);
  if (!gate.available)
    add({
      id: "source-gate",
      title: "Cổng nguồn vị trí",
      state: "unresolved",
      cause: gate.reason.includes("mâu thuẫn")
        ? "source-conflict"
        : "missing-data",
      text: gate.reason,
      paths: gate.paths,
      source: "Hồ sơ nguồn an chính tinh của dự án",
    });
  const full = (p: typeof q.p) =>
    verified &&
    fields.every(
      (f) =>
        Array.isArray(p[f]) &&
        p[f].every(
          (st) =>
            st &&
            typeof st.name === "string" &&
            typeof (st as { scope?: string }).scope === "string",
        ),
    );
  const majors = Array.isArray(q.p.majorStars)
    ? q.p.majorStars.filter(
        (st) => (st as { scope?: string }).scope === "origin",
      )
    : null;
  const majorFull =
    verified &&
    Array.isArray(q.p.majorStars) &&
    q.p.majorStars.every(
      (st) =>
        st &&
        typeof st.name === "string" &&
        typeof (st as { scope?: string }).scope === "string",
    );
  add({
    id: "base",
    title: "Nhánh chính tinh bản mệnh",
    state: majorFull ? "checked" : "unresolved",
    ...(!majorFull ? { cause: "missing-data" as const } : {}),
    text: majorFull
      ? `Quan Lộc tại ${q.p.earthlyBranch}: ${majors!.map((st) => st.name).join(", ") || "không có chính tinh"}. Phần diễn giải bên trên ứng với chính tinh và vị trí này.`
      : "Danh sách chính tinh hoặc phạm vi bản mệnh chưa được xác nhận đầy đủ; không suy độc thủ hoặc vô chính diệu.",
    paths: [base + ".name", base + ".earthlyBranch", base + ".majorStars"],
    source: "Snapshot đã lưu: tên cung, địa chi và danh sách chính tinh; không phải nguồn lời luận.",
  });
  const geometryValid = !!palaceGeometry(s, "Quan Lộc", "Quan Lộc");
  if (!geometryValid)
    add({
      id: "geometry",
      title: "Quan hệ cung",
      state: "unresolved",
      cause: "missing-data",
      text: "Chưa có đủ 12 địa chi duy nhất để xác định tam hợp, đối cung, nhị hợp và hai cung kề Quan Lộc.",
      paths: ["chart.palaces"],
      source: "Tân Biên tr.18–20; khoảng cách địa chi",
    });
  for (const [i, p] of ps.entries()) {
    const geometry = palaceGeometry(s, "Quan Lộc", p.name);
    const relations = geometryValid
      ? careerRelations(q.p.earthlyBranch, p.earthlyBranch)
      : [];
    const relation = relations.join("; ");
    if (!relations.length) continue;
    if (!full(p))
      add({
        id: `list-${i}`,
        title: `Danh sách sao ${p.name}`,
        state: "unresolved",
        cause: "missing-data",
        text: `Chưa xác nhận đầy đủ danh sách và scope sao tại ${p.name}; không kết luận các sao không được ghi là vắng mặt.`,
        paths: [`chart.palaces.${i}`],
        source: "Hợp đồng danh sách của adapter",
      });
    for (const f of fields)
      for (const [j, st] of (Array.isArray(p[f]) ? p[f] : []).entries()) {
        if (
          (st as { scope?: string }).scope !== "origin" ||
          !tough.includes(st.name)
        )
          continue;
        const methodState = satinhState(st.name, p.earthlyBranch);
        const state = {
          value:
            methodState.classification === "unknown"
              ? undefined
              : methodState.label,
          source: methodState.source,
        };
        observations.push({
          name: st.name,
          relation,
          relations,
          light:
            methodState.classification === "unknown"
              ? "chưa xác định trạng thái vị trí"
              : methodState.classification === "dim-position"
                ? "mờ theo vị trí"
                : methodState.degreeUnresolved
                  ? "thuận vị trí; chưa chốt mức Đắc/Miếu"
                  : "sáng theo vị trí",
          nature:
            "Thuộc Lục Sát; đặc tính theo từng sao là dữ kiện riêng, không ghi đè trạng thái vị trí (Tân Biên tr.32,39–40).",
          palace: p.name,
          branch: p.earthlyBranch,
          state: state?.value,
          source: state?.source,
          paths: [
            `chart.palaces.${i}.name`,
            `chart.palaces.${i}.earthlyBranch`,
            `chart.palaces.${i}.${f}.${j}.name`,
            `chart.palaces.${i}.${f}.${j}.scope`,
            ...(geometry?.paths || []),
          ],
        });
      }
  }
  add({
    id: "satinh",
    title: "Điều chỉnh sát tinh §8.14",
    state: "unresolved",
    cause: "undefined-relation",
    text: observations.length
      ? `Đã xác định: ${observations.map((o) => `${o.name} ${o.state ? `(${o.state} theo nguồn đã chọn)` : "(bảng nguồn chưa xác định trạng thái ở chi này)"} tại ${o.palace} ${o.branch}, ${o.relation}`).join("; ")}. §8.14 chưa chỉ rõ xét đồng cung hay cả các cung chiếu, và cách xử lý nhiều sát tinh/trạng thái khác nhau. Chưa áp nhánh sáng/tối để thay lời luận nền.`
      : "Không ghi nhận sáu sát tinh trong các danh sách bản mệnh đã đọc ở đồng cung, tam hợp, đối cung, nhị hợp và cung kề. Đây không phải xác nhận vắng mặt toàn bộ hay điều kiện miễn điều chỉnh: phạm vi §8.14 chưa được đặc tả.",
    paths: observations.flatMap((o) => o.paths),
    source:
      "Tân Biên tr.18–20,32–33,39–40 (quan hệ, sáu sát tinh, bảng trạng thái và định nghĩa); tr.163–164 §8.14",
  });
  add({
    id: "satinh-state-method",
    title: "Trạng thái sáu sát tinh dùng cho luận giải",
    state: "checked",
    text:
      interpretationStates
        .map(
          (x) =>
            `${x.name} tại ${x.palace} ${x.branch}: đã lưu ${x.saved.brightness || "chưa xác định"}; luận giải mới ${x.selected.label}. Nguồn chọn: ${x.selected.source}`,
        )
        .join(". ") +
      ". Giữ vị trí và trạng thái cũ trong snapshot. Các rule chỉ định bảng Tân Biên vẫn dùng bảng cũ; trạng thái mới không tự làm phát sinh nhận định.",
    paths: interpretationStates.map((x) => x.path),
    source: `${SATINH_METHOD_VERSION}; Tân Biên PDF39–40, Thiên Lương PDF51,60,138. Nguồn chọn ghi riêng từng sao; ô thiếu giữ chưa xác định.`,
  });
  const states = majorFull
    ? majors!.map((st) => ({
        name: st.name,
        ...bookState(st.name, q.p.earthlyBranch),
      }))
    : [];
  add({
    id: "major-states",
    title: "Trạng thái và nhóm chính tinh",
    state: majorFull ? "checked" : "unresolved",
    ...(!majorFull ? { cause: "missing-data" as const } : {}),
    text: states.length
      ? states
          .map(
            (st) =>
              `${st.name}: ${st.value || "bảng nguồn chưa xác định"} — ${positionLight(st.value)}`,
          )
          .join("; ") +
        ". Định nghĩa nguồn đã có ở tr.33 §2.4–2.11; đây là bằng chứng theo vị trí, chưa đủ để chọn nhánh §8.14 khi phạm vi và cách phối hợp còn chưa xác định."
      : "Chưa đủ dữ kiện chính tinh bản mệnh để tra bảng trạng thái.",
    paths: [base + ".majorStars", base + ".earthlyBranch"],
    source:
      `Định nghĩa chung: Tân Biên PDF33 §2.4–2.11. Bảng vị trí: ${states.map(st=>`${st.name}: ${st.source || "chưa có nguồn bảng"}`).join("; ")}. Phân nhóm để đối chiếu: §8.14 Sát tinh PDF163–164, chưa tự chọn nhánh.`,
  });
  const ranges = s.chart.tanBien?.voidRanges;
  const rangeRows = Array.isArray(ranges)
    ? ranges.filter(
        (r) =>
          ["Tuần Không", "Triệt Lộ"].includes(r.name) &&
          voidMembership(q.p.earthlyBranch, r.branches) !== undefined,
      )
    : [];
  const rangeComplete =
    verified &&
    geometryValid &&
    ranges?.length === 2 &&
    rangeRows.length === 2 &&
    new Set(rangeRows.map((r) => r.name)).size === 2;
  add({
    id: "void-position",
    title: "Phạm vi cặp Tuần/Triệt",
    state: rangeComplete ? "checked" : "unresolved",
    ...(!rangeComplete ? { cause: "missing-data" as const } : {}),
    text: rangeComplete
      ? rangeRows
          .map(
            (r) =>
              `${r.name}: ${r.branches.join("–")}; Quan Lộc ${voidMembership(q.p.earthlyBranch, r.branches) ? "thuộc" : "không thuộc"} cặp này`,
          )
          .join(". ") +
        ". Theo Thiên Lương, phạm vi chỉ gồm hai cung bị chắn, không truyền từ cung chiếu sang Quan Lộc. Đây là xác định phạm vi; chưa suy mức tác động, hóa giải hoặc kết quả công việc."
      : "Chưa xác nhận đủ hai cặp Tuần/Triệt hợp lệ và dữ liệu vị trí; không suy vắng mặt hoặc tự dựng cặp từ nhãn sao.",
    paths: ["chart.tanBien.voidRanges", base + ".earthlyBranch"],
    source: `Thiên Lương — Tử Vi Nghiệm Lý Toàn Thư, PDF86 (bản Scribd 298 trang). Phương pháp ${CAREER_METHOD}: bổ sung phạm vi còn thiếu; không thay phép an Tân Biên.`,
  });
  if (geometryValid) {
    const directions = ps.flatMap((p, i) => {
      const d = directionalRelation(q.p.earthlyBranch, p.earthlyBranch);
      return d
        ? [
            {
              ...d,
              palace: p.name,
              branch: p.earthlyBranch,
              path: `chart.palaces.${i}.earthlyBranch`,
            },
          ]
        : [];
    });
    add({
      id: "directional-relations",
      title: "Chiều quan hệ nhị hợp và xung chiếu",
      state: "checked",
      text:
        directions
          .map(
            (d) =>
              `${d.palace} ${d.branch}: ${d.relation}; tam hợp của Quan Lộc thuộc ${d.origin}, tam hợp của cung này thuộc ${d.target}, nên ${d.direction} đối với Quan Lộc`,
          )
          .join(". ") +
        ". Chỉ ghi chiều quan hệ theo phương pháp nguồn; không quy thành mức may rủi hoặc dùng để kích hoạt mọi nhánh Quan Lộc.",
      paths: [base + ".earthlyBranch", ...directions.map((d) => d.path)],
      source: `Thiên Lương — Tử Vi Nghiệm Lý Toàn Thư, PDF122–124 (bản 298 trang); ${CAREER_METHOD}. Bổ sung định nghĩa, không thay điều kiện riêng của Tân Biên.`,
    });
    add({
      id: "general-hoi",
      title: "Hội hợp và điều kiện riêng",
      state: "checked",
      text:
        "Theo định nghĩa chung, hội hợp gồm đồng cung và chiếu lẫn nhau; trong phép đối chiếu này dùng đồng cung, tam hợp, xung chiếu. Nhị hợp giữ riêng. " +
        observations
          .filter((o) => sourceRelation(q.p.earthlyBranch, o.branch, "hội hợp"))
          .map((o) => `${o.name} tại ${o.palace} ${o.branch}`)
          .join("; ") +
        ". Danh sách này không phải kết luận §8.14: từ ‘gặp’ chưa được tự đồng nhất với ‘hội hợp’; điều kiện ghi rõ đồng cung vẫn chỉ xét đồng cung.",
      paths: observations.flatMap((o) => o.paths),
      source: `Tân Biên PDF18–20,33 §2.6–2.9; ${CAREER_METHOD}. Không tự thêm nhị hợp vào mọi điều kiện chiếu.`,
    });
  }
  add({
    id: "vcd-exception",
    title: "Ngoại lệ vô chính diệu §8.45",
    state: majorFull && majors!.length ? "not-applicable" : "unresolved",
    ...(majorFull && majors!.length
      ? {}
      : {
          cause: majorFull
            ? ("undefined-relation" as const)
            : ("missing-data" as const),
        }),
    text:
      majorFull && majors!.length
        ? "Quan Lộc có chính tinh. Ngoại lệ Tuần/Triệt và Nhật–Nguyệt ở §8.45 thuộc nhánh vô chính diệu, nên không áp dụng vào nhánh đang đọc."
        : majorFull
          ? "Quan Lộc có danh sách chính tinh bản mệnh đầy đủ và rỗng. Phạm vi hai cung Tuần/Triệt được kiểm tra riêng theo Thiên Lương; điều kiện Nhật–Nguyệt “hợp chiếu” và cách phối hợp ngoại lệ §8.45 vẫn chưa đủ đặc tả."
          : "Không có danh sách chính tinh đầy đủ; chưa thể kiểm tra điều kiện vô chính diệu.",
    paths: [base + ".majorStars"],
    source: "Tân Biên tr.166–167 §8.45",
  });
  if (
    majorFull &&
    ["Tử Vi", "Thiên Tướng"].every((name) =>
      majors!.some((st) => st.name === name),
    )
  )
    add({
      id: "mixed-family",
      title: "Tử Vi–Thiên Tướng và §8.14",
      state: "unresolved",
      cause: "missing-interpretation",
      text: "Tử Vi và Thiên Tướng cùng cung nhưng thuộc hai nhóm khác nhau trong §8.14. Nguồn chưa chỉ cách phối hợp hoặc ưu tiên khi hai nhóm có lời luận khác chiều. Thiên Lương PDF60–62 đặt điều kiện và phạm vi Mệnh/hạn cho đoạn Lục Sát; không dùng đoạn đó thay nhánh Quan Lộc. Không chọn nhóm thuận lợi hơn hoặc cộng hai kết quả.",
      paths: [base + ".majorStars"],
      source: "Tân Biên tr.163–164 §8.14; nhánh nền tr.158 §8.1",
    });
  const ringData =
    verified &&
    ["boshi12", "suiqian12"].every(
      (k) =>
        typeof (q.p as unknown as Record<string, unknown>)[k] === "string" &&
        (q.p as unknown as Record<string, string>)[k].trim(),
    );
  const pair = claims.find((c) => c.rules.some((r) => r.id === "tanbien.r38"));
  add(
    {
      id: "ho-tau",
      title: "Bạch Hổ–Tấu Thư §8.39",
      state: pair ? "checked" : ringData ? "not-applicable" : "unresolved",
      ...(!pair && !ringData ? { cause: "missing-data" as const } : {}),
      text: pair
        ? "Bạch Hổ vòng Thái Tuế và Tấu Thư vòng Bác Sỹ cùng nằm tại Quan Lộc. Chú giải văn chương/ngôn ngữ là ý bổ sung; không thay thế nhánh chính tinh và không dùng để hóa giải sát tinh."
        : ringData
          ? "Hai trường vòng sao bản mệnh không thỏa cặp Bạch Hổ–Tấu Thư tại Quan Lộc; không lấy hai sao ở các cung khác ghép thành tổ hợp."
          : "Chưa đủ hai trường vòng sao bản mệnh đã xác nhận để kết luận điều kiện không áp dụng.",
      paths: [base + ".boshi12", base + ".suiqian12"].filter((path) =>
        path.endsWith("boshi12")
          ? typeof (q.p as unknown as Record<string, unknown>).boshi12 ===
            "string"
          : typeof (q.p as unknown as Record<string, unknown>).suiqian12 ===
            "string",
      ),
      source: "Tân Biên tr.166 §8.39; vòng bản mệnh tr.9–10",
    },
    pair ? [pair.id] : [],
  );
  add({
    id: "other-adjustments",
    title: "Các nhánh điều chỉnh khác trong mục Quan Lộc",
    state: "unresolved",
    cause: "missing-interpretation",
    text: `Tại Quan Lộc ghi nhận: ${
      (q.p.minorStars || [])
        .filter((st) => (st as { scope?: string }).scope === "origin")
        .map((st) => st.name)
        .join(", ") || "chưa ghi nhận phụ tinh bản mệnh"
    }; ${
      (majors || [])
        .filter((st) => st.mutagen)
        .map((st) => st.name + " Hóa " + st.mutagen)
        .join(", ") || "chưa ghi nhận Tứ Hóa trên chính tinh bản mệnh"
    }. Đây là dữ kiện, chưa có quy tắc phối hợp §8.15–8.20 với nhánh nền. Những tổ hợp §8.23–8.44 không được áp chỉ vì có một sao thành phần; chỉ giữ các đoạn đã thỏa điều kiện được trình bày bên trên.`,
    paths: [
      base + ".minorStars",
      base + ".adjectiveStars",
      base + ".majorStars",
    ],
    source: "Tân Biên tr.164–166; không thêm sao đơn lẻ để lấp kết luận",
  });
  const co = observations.filter((o) => o.relations.includes("đồng cung"));
  const completeCo = full(q.p);
  const readerFacts = [
    majorFull
      ? `Quan Lộc tại ${q.p.earthlyBranch}: ${states.map((st) => `${st.name} ${st.value || "(chưa xác định trạng thái theo bảng nguồn)"}`).join(", ") || "không có chính tinh"}.`
      : "Chưa xác nhận đầy đủ chính tinh bản mệnh tại Quan Lộc.",
    co.length
      ? `Lục Sát đồng cung: ${co.map((o) => `${o.name}${o.state ? " " + o.state : " (chưa xác định trạng thái)"}`).join(", ")}.`
      : completeCo
        ? "Danh sách bản mệnh đã xác nhận không có Lục Sát đồng cung Quan Lộc; điều này không có nghĩa là không có sát tinh ở cung chiếu."
        : "Danh sách sao tại Quan Lộc chưa đủ để xác nhận Lục Sát vắng mặt.",
    ...observations
      .filter((o) => !o.relations.includes("đồng cung"))
      .map(
        (o) =>
          `${o.name} tại ${o.palace} ${o.branch}: ${o.relations.join(", ")}${o.state ? "; " + o.state + " theo nguồn đã chọn" : "; chưa xác định trạng thái theo nguồn"}.`,
      ),
    ...rangeRows.map(
      (r) =>
        `${r.name} tại ${r.branches.join("–")}; Quan Lộc ${r.branches.includes(q.p.earthlyBranch) ? "thuộc" : "không thuộc"} cặp này.`,
    ),
  ];
  if (majorFull && majors!.some((st) => st.name === "Tử Vi"))
    add({
      id: "source-modifiers",
      title: "Điều chỉnh đã có trong nguồn",
      state: "unresolved",
      cause: "missing-interpretation",
      text: `Tân Biên tr.34 nói Tử Vi chế tính hung của Hỏa–Linh và kỵ Tuần/Triệt án ngữ. ${co.some((o) => ["Hỏa Tinh", "Linh Tinh"].includes(o.name)) ? "Hỏa/Linh đồng cung đã được ghi nhận." : "Không ghi nhận Hỏa/Linh đồng cung trong danh sách đã đọc; không suy vắng mặt nếu danh sách chưa đủ."} Vị trí cặp Tuần/Triệt đã ghi riêng. Phạm vi hai cung bị chắn đã xác định theo Thiên Lương PDF86; nghĩa tác động của “án ngữ” trong nhánh này và quy tắc phối hợp vẫn chưa đủ đặc tả; không tuyên bố hóa giải hoặc truyền nghĩa án ngữ từ đối cung. ${majors!.some((st) => st.name === "Thiên Tướng") ? "Tr.37–38 còn nêu Thiên Tướng sáng chế sát và kỵ Tuần/Triệt; không lấy ý này để chọn nhóm Tướng thắng nhóm Tử." : ""}`,
      paths: [
        base + ".majorStars",
        base + ".minorStars",
        ...(rangeRows.length ? ["chart.tanBien.voidRanges"] : []),
      ],
      source: `Tân Biên PDF33–34 §3.1${majors!.some(st=>st.name === "Thiên Tướng") ? "; PDF37–38 §3.11" : ""}; PDF163–164 §8.14 Sát tinh.`,
    });
  const scopes = [
    ["đồng cung"],
    ["đồng cung", "tam hợp", "đối cung"],
    ["đồng cung", "tam hợp", "đối cung", "nhị hợp"],
  ];
  let previous: string[] = [];
  const research = scopes.map((scope, i) => {
    const included = observations
      .filter((o) => o.relations.some((r) => scope.includes(r)))
      .map((o) => `${o.name} tại ${o.palace} ${o.branch} (${o.light})`);
    const added = included.filter((x) => !previous.includes(x));
    previous = included;
    return {
      id: `P${i}`,
      text: `Phương án nghiên cứu — chưa áp dụng. Phạm vi: ${scope.join(", ")}. Các sao này chỉ là đầu vào đối chiếu, không kích hoạt claim. Phạm vi từ “gặp”, phối hợp trạng thái và hai nhóm chính tinh còn thiếu đặc tả; định nghĩa hội hợp không tự giải quyết những câu hỏi này.`,
      included,
      added,
    };
  });
  // Preserve already fully-qualified citations; do not expand author/title inside themselves.
  for (const row of rows)
    row.source = row.source.replaceAll("Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên, ", "Tân Biên — ");
  return {
    version: CAREER_CONDITIONS_VERSION,
    interpretationStateVersion: SATINH_METHOD_VERSION,
    interpretationStates,
    rows,
    observations,
    readerFacts,
    research,
    summary: rows.some((r) => r.cause === "missing-data")
      ? "Một số điều kiện còn thiếu dữ liệu hồ sơ; các điều kiện thiếu quy tắc nguồn được phân loại riêng bên dưới."
      : "Đã kiểm tra vị trí và điều kiện cục bộ; chưa có kết luận tổng hợp công danh. Các vướng mắc dưới đây là quy tắc nguồn chưa đủ đặc tả, không phải mặc nhiên thiếu dữ liệu hồ sơ.",
  };
}
export type CareerAssessment = ReturnType<typeof careerConditions>;
