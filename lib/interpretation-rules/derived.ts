import {familyVcdFacts} from './family-vcd';
import {familyExtensionFacts} from './family-extension';
import {kinExtensionFacts} from './kin-extension';
import {childrenVcdFacts} from './children-vcd';
import {completionFacts} from './natal-completion';
import {lifeLiteraryFacts} from './life-literary';
import {nplLocalFacts} from './npl-local-adjustments';
import {nplFoundationFacts,nplTwoV2Facts} from './npl-foundation';
import {nplTwoFacts} from './npl-two-major';
import {lifeBodyFacts} from './life-body-method';
import {retentionFacts} from './finance-retention';
import {voidFacts} from './void-palace';
import {kinFacts} from './phu-tu';
import {familyFacts} from './phu-huynh';
import {noDienFacts} from "./no-dien";
import {phucDiFacts} from "./phuc-di";
import { lifeQuyenFact } from './life-quyen-fact';
import {lifeContentFacts} from "./life-content-facts";
import { financeSupplementFacts } from "./finance-supplement-facts";
import { careerClosingFacts, careerClosingBranches } from "./career-closing";
import { occupationalCareerFacts } from "./career-occupations";
import { independentCareerFacts } from "./career-independent";
import { careerKyFacts } from "./career-ky-facts";
import { careerQuyenFact } from "./career-quyen-fact";
import { emptyLifeFacts } from "./life-empty-facts";
import { financeBranches } from "./tanbien-finance-content";
import { tanBienTable, tanBienLifeTables } from "./tanbien-source";
import type { ChartSnapshot } from "../tuvi-engine";
import { readPath } from "./schema";
export const DERIVATION_VERSION = "1.17.0";
export type DerivedFact = {
  id: string;
  derivationId: string;
  version: string;
  value: string | string[];
  text: string;
  evidencePaths: string[];
  status: "engine-reported" | "source-table";
  limitation: string;
};
// Six technical mappings. None infer a personal trait or make an expert claim.
export const derivations = [
  { id: "fact.life-location", label: "Vị trí Mệnh", topic: "overview" },
  { id: "fact.body-location", label: "Vị trí Thân", topic: "overview" },
  { id: "fact.life-stars", label: "Chính tinh tại Mệnh", topic: "overview" },
  {
    id: "fact.life-state",
    label: "Trạng thái chính tinh tại Mệnh",
    topic: "overview",
  },
  { id: "fact.career-location", label: "Vị trí Quan Lộc", topic: "career" },
  {
    id: "fact.career-stars",
    label: "Chính tinh tại Quan Lộc",
    topic: "career",
  },
] as const;
// A project release gate, not an extra condition attributed to the book.
export function careerSourceGate(snapshot: ChartSnapshot) {
  const cuc = snapshot.chart.fiveElementsClass;
  const day = snapshot.chart.lunar?.lunarDay;
  const paths = ["chart.fiveElementsClass", "chart.lunar.lunarDay"];
  if (
    ![
      "Thủy Nhị Cục",
      "Mộc Tam Cục",
      "Kim Tứ Cục",
      "Thổ Ngũ Cục",
      "Hỏa Lục Cục",
    ].includes(cuc) ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 30
  )
    return {
      available: false,
      paths,
      reason:
        "Chưa có dữ liệu xác định Cục và ngày âm để kiểm tra phạm vi nguồn an chính tinh cho phần Công việc.",
    };
  if (cuc === "Kim Tứ Cục" && [21, 24].includes(day))
    return {
      available: false,
      paths,
      reason:
        "Bảng Kim Cục ngày 21/24 trong Tân Biên còn mâu thuẫn. Phần Công việc chưa xuất nhận định phụ thuộc vị trí chính tinh này; đây không phải kết luận về người đọc.",
    };
  return {
    available: true,
    paths,
    reason:
      "Cục và ngày âm không thuộc hai ô Kim Cục 21/24 còn mâu thuẫn nguồn. Đây là kiểm tra phạm vi dữ liệu của dự án, không xác nhận toàn bộ phép an hoặc toàn cung.",
  };
}
export function deriveFacts(snapshot: ChartSnapshot): DerivedFact[] {
  const quyenFacts = [...completionFacts(snapshot),...lifeLiteraryFacts(snapshot),...nplLocalFacts(snapshot),...nplFoundationFacts(snapshot),...nplTwoV2Facts(snapshot),...nplTwoFacts(snapshot), ...lifeBodyFacts(snapshot), ...retentionFacts(snapshot), ...voidFacts(snapshot), ...childrenVcdFacts(snapshot), ...kinExtensionFacts(snapshot), ...kinFacts(snapshot), ...familyFacts(snapshot), ...familyVcdFacts(snapshot), ...familyExtensionFacts(snapshot), ...noDienFacts(snapshot),...phucDiFacts(snapshot),...lifeQuyenFact(snapshot), ...lifeContentFacts(snapshot), ...careerQuyenFact(snapshot), ...careerKyFacts(snapshot), ...independentCareerFacts(snapshot), ...occupationalCareerFacts(snapshot), ...careerClosingFacts(snapshot), ...financeSupplementFacts(snapshot)];
  // Natal matching never consumes an explicitly annual/decadal star.
  // Undefined legacy scopes remain compatible; completeness is independently
  // guarded by server receipts and the new saved career assessment.
  snapshot = structuredClone(snapshot);
  const originalIndexes = new Map<string, number[]>();
  snapshot.chart.palaces.forEach((p, i) => {
    for (const f of ["majorStars", "minorStars", "adjectiveStars"] as const)
      if (Array.isArray(p[f])) {
        const kept = p[f]
          .map((st, j) => ({ st, j }))
          .filter(
            ({ st }) =>
              !st || !(st as { scope?: string }).scope ||
              (st as { scope?: string }).scope === "origin",
          );
        originalIndexes.set(
          `chart.palaces.${i}.${f}`,
          kept.map((x) => x.j),
        );
        p[f] = kept.map((x) => x.st);
      }
  });
  const out: DerivedFact[] = emptyLifeFacts(snapshot);
  for (const spec of derivations) {
    const candidates = snapshot.chart.palaces
      .map((p, i) => ({ p, i }))
      .filter(({ p }) =>
        spec.id === "fact.body-location"
          ? p.isBodyPalace
          : p.name === (spec.topic === "career" ? "Quan Lộc" : "Mệnh"),
      );
    if (candidates.length !== 1) continue; // Missing/ambiguous never becomes a false assertion.
    const { p, i } = candidates[0],
      base = `chart.palaces.${i}`;
    let value: string | string[], paths: string[];
    if (spec.id.endsWith("location")) {
      value = `${p.name} tại ${p.earthlyBranch}`;
      paths = [
        `${base}.name`,
        `${base}.earthlyBranch`,
        ...(spec.id === "fact.body-location" ? [`${base}.isBodyPalace`] : []),
      ];
    } else if (spec.id.endsWith("stars")) {
      if (!Array.isArray(p.majorStars)) continue;
      if (
        p.majorStars.some(
          (s) => !s || typeof s.name !== "string" || !s.name.trim(),
        )
      )
        continue;
      value = p.majorStars.map((s) => s.name);
      paths = [
        `${base}.name`,
        `${base}.majorStars`,
        ...p.majorStars.map((_, j) => `${base}.majorStars.${j}.name`),
      ];
    } else {
      if (!Array.isArray(p.majorStars)) continue;
      if (
        p.majorStars.some(
          (s) => !s || typeof s.name !== "string" || !s.name.trim(),
        )
      )
        continue;
      value = p.majorStars.map(
        (s) =>
          `${s.name}: ${s.brightness || "chưa có trạng thái độ sáng"}; ${s.mutagen || "không ghi tứ hóa"}`,
      );
      paths = [
        `${base}.name`,
        `${base}.majorStars`,
        ...p.majorStars.map((_, j) => `${base}.majorStars.${j}.name`),
      ];
    }
    if (paths.some((path) => readPath(snapshot, path) === undefined)) continue;
    out.push({
      id: spec.id,
      derivationId: spec.id,
      version: DERIVATION_VERSION,
      value,
      text: `${spec.label}: ${Array.isArray(value) ? value.join(", ") || "không có chính tinh được ghi" : value}.`,
      evidencePaths: paths,
      status: "engine-reported",
      limitation:
        "Chép dữ kiện của engine theo profile đã chọn; chưa được chuyên gia độc lập xác nhận. Không suy ra tính cách hoặc kết quả nghề nghiệp.",
    });
  }
  // Structured matching keys; never inspect the formatted prose above.
  for (const name of ["Mệnh", "Quan Lộc"]) {
    const matches = snapshot.chart.palaces
      .map((p, i) => ({ p, i }))
      .filter((x) => x.p.name === name);
    if (matches.length !== 1) continue;
    const { p, i } = matches[0],
      base = `chart.palaces.${i}`,
      prefix = name === "Mệnh" ? "life" : "career";
    const add = (suffix: string, value: string | string[], paths: string[]) =>
      out.push({
        id: `fact.${prefix}-${suffix}`,
        derivationId: `fact.${prefix}-${suffix}`,
        version: DERIVATION_VERSION,
        value,
        text: Array.isArray(value) ? value.join(", ") : value,
        evidencePaths: paths,
        status: "engine-reported",
        limitation: "Nhãn dữ liệu cấu trúc, chưa phải diễn giải.",
      });
    if (
      Array.isArray(p.majorStars) &&
      p.majorStars.every(
        (s) => s && typeof s.name === "string" && s.name.trim(),
      )
    )
      add("major-presence", p.majorStars.length === 0 ? "empty" : "present", [
        `${base}.name`,
        `${base}.majorStars`,
      ]);
    if (name === "Quan Lộc") {
      const valid = (stars: typeof p.majorStars) =>
        Array.isArray(stars) &&
        stars.every((s) => s && typeof s.name === "string" && s.name.trim()) &&
        new Set(stars.map((s) => s.name)).size === stars.length;
      if (valid(p.majorStars))
        add("major-count", String(p.majorStars.length), [
          `${base}.name`,
          `${base}.majorStars`,
        ]);
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
      if (branches.includes(p.earthlyBranch))
        add(
          "branch-groups",
          [
            p.earthlyBranch,
            ...[
              "Mão/Dậu",
              "Tỵ/Hợi",
              "Thìn/Tuất",
              "Tý/Ngọ",
              "Thìn/Tỵ",
              "Tuất/Hợi",
            ].filter((g) => g.split("/").includes(p.earthlyBranch)),
          ],
          [`${base}.name`, `${base}.earthlyBranch`],
        );
      if (valid(p.minorStars))
        add(
          "minor-stars",
          p.minorStars.map((s) => s.name),
          [`${base}.name`, `${base}.minorStars`],
        );
      const ringData = p as typeof p & { boshi12?: string; suiqian12?: string };
      // Ring claims are not supported for an unverified/stripped star-list contract.
      if (
        valid(p.majorStars) &&
        valid(p.minorStars) &&
        valid(p.adjectiveStars)
      ) {
        if (typeof ringData.boshi12 === "string" && ringData.boshi12.trim())
          add("boshi", ringData.boshi12, [
            `${base}.name`,
            `${base}.boshi12`,
            `${base}.minorStars`,
          ]);
        if (typeof ringData.suiqian12 === "string" && ringData.suiqian12.trim())
          add("suiqian", ringData.suiqian12, [
            `${base}.name`,
            `${base}.suiqian12`,
            `${base}.minorStars`,
          ]);
      }
    }
    if (
      name === "Mệnh" &&
      Array.isArray(p.minorStars) &&
      p.minorStars.every(
        (s) => s && typeof s.name === "string" && s.name.trim(),
      ) &&
      new Set(p.minorStars.map((s) => s.name)).size === p.minorStars.length
    ) {
      const names = p.minorStars.map((s) => s.name),
        paths = [
          `${base}.name`,
          `${base}.minorStars`,
          ...names.map((_, j) => `${base}.minorStars.${j}.name`),
        ];
      const localSat = names.filter((n) =>
        ["Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh"].includes(n),
      );
      add("minor-stars", names, paths);
      add("local-sat", localSat.length ? "recorded" : "none-recorded", paths);
      add("local-sat-stars", localSat, paths);
    }
    // Source p.89 requires Mão/Dậu. Unrecognized/missing branch stays unknown.
    if (
      name === "Mệnh" &&
      [
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
      ].includes(p.earthlyBranch)
    )
      add(
        "mao-dau",
        ["Mão", "Dậu"].includes(p.earthlyBranch) ? "mao-dau" : "other",
        [`${base}.name`, `${base}.earthlyBranch`],
      );
    if (
      name === "Mệnh" &&
      Object.hasOwn(tanBienLifeTables.taiyang?.states ?? {}, p.earthlyBranch)
    )
      add(
        "hoi-ty",
        ["Hợi", "Tý"].includes(p.earthlyBranch) ? "hoi-ty" : "other",
        [`${base}.name`, `${base}.earthlyBranch`],
      );
    if (typeof p.earthlyBranch === "string")
      add("branch", p.earthlyBranch, [`${base}.name`, `${base}.earthlyBranch`]);
    for (const [suffix, field] of [
      ["transformations", "mutagen"],
      ["brightness", "brightness"],
    ] as const) {
      if (
        !Array.isArray(p.majorStars) ||
        p.majorStars.some(
          (s) =>
            !s ||
            typeof s.name !== "string" ||
            !s.name.trim() ||
            typeof s[field] !== "string",
        )
      )
        continue;
      add(
        suffix,
        p.majorStars.map((s) => `${s.name}:${s[field]}`),
        [
          `${base}.name`,
          `${base}.majorStars`,
          ...p.majorStars.flatMap((_, j) => [
            `${base}.majorStars.${j}.name`,
            `${base}.majorStars.${j}.${field}`,
          ]),
        ],
      );
    }
  }
  const bodies = snapshot.chart.palaces
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p.isBodyPalace === true);
  if (bodies.length === 1) {
    const { p, i } = bodies[0];
    out.push({
      id: "fact.body-palace",
      derivationId: "fact.body-palace",
      version: DERIVATION_VERSION,
      value: p.name,
      text: `Thân cư ${p.name}`,
      evidencePaths: [
        `chart.palaces.${i}.name`,
        `chart.palaces.${i}.isBodyPalace`,
      ],
      status: "engine-reported",
      limitation: "Chỉ vị trí an Thân.",
    });
  }
  // Additional structured facts for the three Tân Biên drafts only.
  const lives = snapshot.chart.palaces
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p.name === "Mệnh");
  if (lives.length === 1) {
    const { p, i } = lives[0];
    if (
      Array.isArray(p.majorStars) &&
      p.majorStars.every(
        (s) => s && typeof s.name === "string" && s.name.trim(),
      )
    )
      out.push({
        id: "fact.life-major-count",
        derivationId: "fact.life-major-count",
        version: DERIVATION_VERSION,
        value: String(p.majorStars.length),
        text: `Mệnh có ${p.majorStars.length} chính tinh được ghi nhận.`,
        evidencePaths: [
          `chart.palaces.${i}.name`,
          `chart.palaces.${i}.majorStars`,
        ],
        status: "engine-reported",
        limitation:
          "Đếm danh sách chính tinh hợp lệ; không đếm phụ tinh, không coi dữ liệu thiếu là rỗng.",
      });
    for (const [key, table] of Object.entries(tanBienLifeTables)) {
      const value = Object.hasOwn(table.states, p.earthlyBranch)
        ? table.states[p.earthlyBranch]
        : undefined;
      if (value && key === "taiyang")
        out.push({
          id: "fact.tanbien-taiyang-state",
          derivationId: table.id,
          version: table.version,
          value,
          text: `${table.star} tại ${p.earthlyBranch}: ${value} theo Tân Biên.`,
          evidencePaths: [
            `chart.palaces.${i}.name`,
            `chart.palaces.${i}.earthlyBranch`,
          ],
          status: "source-table",
          limitation:
            "Bảng Tân Biên PDF/trang in 35, mục 3.5; không dùng brightness engine.",
        });
      if (value)
        out.push({
          id: `fact.tanbien-${key}-eligible`,
          derivationId: table.id,
          version: table.version,
          value: table.eligible.includes(value) ? "eligible" : "ineligible",
          text: `${table.star} tại ${p.earthlyBranch}: ${value} theo Tân Biên.`,
          evidencePaths: [
            `chart.palaces.${i}.name`,
            `chart.palaces.${i}.earthlyBranch`,
          ],
          status: "source-table",
          limitation: `Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên, PDF ${table.pdfPage} / trang in ${table.printedPage}, mục ${table.section}; đã đọc lớp chữ và ảnh trang, chưa phê duyệt chuyên môn.`,
        });
    }
    const state = Object.hasOwn(tanBienTable.states, p.earthlyBranch)
      ? tanBienTable.states[p.earthlyBranch]
      : undefined;
    if (state)
      out.push({
        id: "fact.tanbien-wuqu-eligible",
        derivationId: tanBienTable.id,
        version: tanBienTable.version,
        value: ["Miếu", "Vượng", "Đắc"].includes(state)
          ? "eligible"
          : "ineligible",
        text: `Vũ Khúc tại ${p.earthlyBranch}: ${state} theo Tân Biên; nhãn engine giữ riêng.`,
        evidencePaths: [
          `chart.palaces.${i}.name`,
          `chart.palaces.${i}.earthlyBranch`,
        ],
        status: "source-table",
        limitation: tanBienTable.verification,
      });
  }
  const wealths = snapshot.chart.palaces
    .map((p, i) => ({ p, i }))
    .filter((x) => x.p.name === "Tài Bạch");
  if (wealths.length === 1) {
    const { p, i } = wealths[0];
    const base = `chart.palaces.${i}`;
    const add = (id: string, value: string | string[], paths: string[]) =>
      out.push({
        id,
        derivationId: id,
        version: DERIVATION_VERSION,
        value,
        text: JSON.stringify(value),
        evidencePaths: paths,
        status: "engine-reported",
        limitation: "Dữ liệu cấu trúc Tài Bạch; không luận mệnh.",
      });
    if (
      Array.isArray(p.majorStars) &&
      p.majorStars.every(
        (s) => s && typeof s.name === "string" && s.name.trim(),
      )
    ) {
      add(
        "fact.wealth-stars",
        p.majorStars.map((s) => s.name),
        [`${base}.name`, `${base}.majorStars`],
      );
      add("fact.wealth-major-count", String(p.majorStars.length), [
        `${base}.majorStars`,
      ]);
    }
    if (
      Array.isArray(p.minorStars) &&
      p.minorStars.every(
        (s) => s && typeof s.name === "string" && s.name.trim(),
      )
    )
      add(
        "fact.wealth-minor-stars",
        p.minorStars.map((s) => s.name),
        [`${base}.name`, `${base}.minorStars`],
      );
    const branches = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
    if (branches.includes(p.earthlyBranch))
      add("fact.wealth-branch-groups", [...new Set(financeBranches.filter(s => s.branches?.includes(p.earthlyBranch)).map(s => s.branches!.join("/")))], [`${base}.earthlyBranch`]);
    // Presence of an explicit origin mutagen is usable even if other fields are
    // incomplete. Absence is only asserted for complete, explicit metadata.
    const lists = [p.majorStars, p.minorStars];
    const known = lists.flatMap(xs => Array.isArray(xs) ? xs : []).filter(st => (st as { scope?: string }).scope === "origin" && typeof st.mutagen === "string");
    const present = known.map(st => st.mutagen!).filter(Boolean);
    if (present.length || lists.every(xs => Array.isArray(xs) && xs.every(st => (st as { scope?: string }).scope === "origin" && typeof st.mutagen === "string")))
      add("fact.wealth-origin-mutagens", present, [`${base}.name`, `${base}.majorStars`, `${base}.minorStars`]);
    if (typeof p.earthlyBranch === "string" && p.earthlyBranch.trim())
      add(
        "fact.wealth-branch-group",
        ["Dần", "Thân"].includes(p.earthlyBranch) ? "dan-than" : "other",
        [`${base}.earthlyBranch`],
      );
  }
  const gate = careerSourceGate(snapshot);
  if (gate.available)
    out.push({
      id: "fact.career-source-available",
      derivationId: "fact.career-source-available",
      version: DERIVATION_VERSION,
      value: "available",
      text: gate.reason,
      evidencePaths: gate.paths,
      status: "source-table",
      limitation:
        "Cổng dữ kiện của dự án; không phải điều kiện chuyên môn bổ sung trong đoạn Quan Lộc.",
    });
  if (gate.available)
    out.push({
      id: "fact.source-position-available",
      derivationId: "source-position-release-gate",
      version: DERIVATION_VERSION,
      value: "available",
      text: gate.reason,
      evidencePaths: gate.paths,
      status: "source-table",
      limitation:
        "Cổng phạm vi dữ liệu của dự án; không phải điều kiện chuyên môn và không xác nhận ngoại lệ đã đầy đủ.",
    });
  // Saved normalized input only: no calendar recalculation and no viewing-year fallback.
  const natalStem = snapshot.chart.tanBien?.inputs.yearStem;
  if (typeof natalStem === "string" && ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"].includes(natalStem))
    out.push({id:"fact.life-birth-stem-group",derivationId:"life-birth-stem-group",version:"1.0.0",value:["Canh","Nhâm"].includes(natalStem)?"canh-nham":"other",text:`Can năm sinh âm lịch: ${natalStem}.`,evidencePaths:["chart.tanBien.inputs.yearStem"],status:"engine-reported",limitation:"Chỉ đầu vào can sinh đã lưu, không phải can cung Mệnh hoặc can năm xem."});
  return [...out.map((f) => ({
    ...f,
    evidencePaths: f.evidencePaths.map((path) =>
      path.replace(
        /^(chart\.palaces\.\d+\.(?:majorStars|minorStars|adjectiveStars))\.(\d+)(?=\.|$)/,
        (_, base, index) =>
          `${base}.${originalIndexes.get(base)?.[Number(index)] ?? index}`,
      ),
    ),
  })), ...quyenFacts];
}
