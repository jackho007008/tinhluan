import type { ChartSnapshot, Star } from "./tuvi-engine";
import { starState, type ChartContext } from "./chart-presentation";
import { palaceGeometry } from "./internal-review/tanbien-presentation";
import { entryProvenance, sheetDisplayName } from "./chart-provenance";
export const SHEET_VERSION = "1.6.0";
export const SHEET_WIDTH = 1200,
  SHEET_HEIGHT = 1760;
export const BRANCH_POSITION: Record<string, [number, number]> = {
  Tỵ: [0, 0],
  Ngọ: [1, 0],
  Mùi: [2, 0],
  Thân: [3, 0],
  Dậu: [3, 1],
  Tuất: [3, 2],
  Hợi: [3, 3],
  Tý: [2, 3],
  Sửu: [1, 3],
  Dần: [0, 3],
  Mão: [0, 2],
  Thìn: [0, 1],
};
const codes: Record<string, string> = {
  Miếu: "M",
  Vượng: "V",
  Đắc: "Đ",
  Bình: "B",
  "Bình hòa": "B",
  Hãm: "H",
  Lợi: "L",
  Bất: "Bt",
};
export function stateCode(
  s: Star,
  branch: string,
  snapshot: ChartSnapshot,
  context: ChartContext,
) {
  return codes[starState(s, branch, snapshot, context).display] || "";
}
export type SheetEntry = {
  label: string;
  name: string;
  paths: string[];
  kind: string;
  parent?: string;
};
// Known duplicate representations of one natal yearly entity, not arbitrary name deduplication.
// iztro 2.6.1 adjectiveStar/location + decorativeStar share these yearly placements;
// v2 adds Kiếp Sát from the same year-group formula. Other same-name entities remain separate.
const ringAliases: Record<string, string[]> = {
  jiangqian12: ["Hoa Cái", "Hàm Trì", "Kiếp Sát"],
  suiqian12: ["Thiên Đức"],
};
export function sheetPalaces(
  snapshot: ChartSnapshot,
  context: ChartContext,
  full = true,
  showAnnual = false,
  showExtended = true,
  showDecadal = false,
  showAnnualPosition = showAnnual,
) {
  const tb = snapshot.chart.tanBien;
  const viewing = tb && "viewing" in tb ? tb.viewing : undefined;
  return snapshot.chart.palaces.map((p, i) => {
    const entries: SheetEntry[] = [];
    const majors: SheetEntry[] = [];
    const missing: string[] = [];
    for (const group of [
      "majorStars",
      "minorStars",
      "adjectiveStars",
    ] as const) {
      if (!full && group !== "majorStars") continue;
      if (!Array.isArray(p[group])) {
        missing.push(
          group === "majorStars"
            ? "Chưa có chính tinh"
            : group === "minorStars"
              ? "Chưa có phụ tinh"
              : "Chưa có tạp diệu",
        );
        continue;
      }
      p[group].forEach((s, j) => {
        const path = `chart.palaces.${i}.${group}.${j}`;
        const scope = (s as Star & { scope?: string }).scope;
        const isYear = scope === "year" || scope === "yearly";
        const isDecadal = scope === "decadal";
        if ((isYear && !showAnnual) || (isDecadal && !showDecadal)) return;
        const voidRange = tb?.voidRanges.find(
          (v) => v.name === s.name && v.branches.includes(p.earthlyBranch),
        );
        // Pair annotations replace their own origin records only, preserving path links below.
        if (full && scope === "origin" && voidRange) return;
        const code = stateCode(s, p.earthlyBranch, snapshot, context);
        const e = {
          name: s.name,
          label: `${isYear ? "L. " : isDecadal ? "ĐV. " : scope && scope !== "origin" ? `[${scope}] ` : ""}${sheetDisplayName(snapshot, s.name)}${code ? ` (${code})` : ""}`,
          paths: [path],
          kind: isYear ? "moving" : isDecadal ? "decadal" : group,
        };
        (group === "majorStars" ? majors : entries).push(e);
        if (full && s.mutagen) {
          const name = `Hóa ${s.mutagen}`,
            code = stateCode({ name }, p.earthlyBranch, snapshot, context);
          entries.push({
            name,
            label: `${isYear ? "L. " : isDecadal ? "ĐV. " : ""}${name}${code ? ` (${code})` : ""}`,
            paths: [`${path}.mutagen`],
            kind: isYear ? "moving" : isDecadal ? "decadal" : "mutagen",
            parent: path,
          });
        }
      });
    }
    const raw = p as typeof p & Record<string, unknown>;
    if (full)
      for (const key of ["boshi12", "suiqian12", "jiangqian12"]) {
        const name = raw[key];
        if (typeof name !== "string" || !name) {
          missing.push(
            `Thiếu ${key === "boshi12" ? "vòng Bác Sỹ" : key === "suiqian12" ? "vòng Tuế" : "vòng Tướng"}`,
          );
          continue;
        }
        const path = `chart.palaces.${i}.${key}`;
        const alias =
          snapshot.versions.dependency === "iztro@2.6.1" &&
          ringAliases[key]?.includes(name)
            ? entries.find(
                (e) =>
                  e.kind === "adjectiveStars" &&
                  e.name === name &&
                  (
                    p.adjectiveStars?.find((s) => s.name === name) as Star & {
                      scope?: string;
                    }
                  )?.scope === "origin",
              )
            : undefined;
        if (alias) alias.paths.push(path);
        else {
          const code = stateCode({ name }, p.earthlyBranch, snapshot, context);
          entries.push({
            name,
            label: name + (code ? ` (${code})` : ""),
            paths: [path],
            kind: key,
          });
        }
      }
    if (full && showAnnual)
      viewing?.stars.forEach((s, j) => {
        if (s.scope === "year" && s.branch === p.earthlyBranch)
          entries.push({
            name: s.name,
            label: `L. ${s.name.replace(/^Lưu /, "")}`,
            paths: [`chart.tanBien.viewing.stars.${j}`],
            kind: "moving",
          });
      });
    if (full && showDecadal && tb && "decadal" in tb)
      tb.decadal?.stars.forEach((s, j) => {
        if (s.branch === p.earthlyBranch)
          entries.push({
            name: s.name,
            label: `ĐV. ${s.name}`,
            paths: [`chart.tanBien.decadal.stars.${j}`],
            kind: "decadal",
            parent: s.target?.path,
          });
      });
    const foot =
      full && typeof raw.changsheng12 === "string" ? raw.changsheng12 : "";
    const months =
      full && showAnnualPosition
        ? viewing?.months
            .filter((m) => m.branch === p.earthlyBranch)
            .map((m) => `Th.${m.month}`)
            .join(", ")
        : undefined;
    return {
      index: i,
      p,
      position: BRANCH_POSITION[p.earthlyBranch],
      majors,
      entries: showExtended
        ? entries
        : entries.filter(
            (e) => entryProvenance(snapshot, e).layer !== "extended",
          ),
      missing,
      foot,
      months,
      annual: full && showAnnualPosition && viewing?.annual === p.earthlyBranch,
      emptyMajor:
        Array.isArray(p.majorStars) && !p.majorStars.length
          ? tb?.completeness.majorStars === "complete"
            ? "Vô chính diệu"
            : "Danh sách chính tinh ghi rỗng"
          : "",
    };
  });
}
export function sheetVoids(snapshot: ChartSnapshot) {
  const groups = new Map<
    string,
    { label: string; branches: string[]; x: number; y: number; paths: string[] }
  >();
  snapshot.chart.tanBien?.voidRanges.forEach((v, i) => {
    if (v.branches.length !== 2) return;
    const [a, b] = v.branches.map((k) => BRANCH_POSITION[k]);
    if (!a || !b || Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) !== 1) return;
    const key = [...v.branches].sort().join("|");
    const x = a[1] === b[1] ? Math.max(a[0], b[0]) * 300 : a[0] * 300 + 150;
    const y =
      a[1] === b[1] ? (a[1] === 0 ? 410 : 1230) : Math.max(a[1], b[1]) * 410;
    const label = v.name.startsWith("Tuần") ? "Tuần" : "Triệt";
    const paths = [`chart.tanBien.voidRanges.${i}`];
    snapshot.chart.palaces.forEach((p, pi) => {
      for (const g of ["minorStars", "adjectiveStars"] as const)
        p[g]?.forEach((s, si) => {
          if (
            s.name === v.name &&
            v.branches.includes(p.earthlyBranch) &&
            (s as Star & { scope?: string }).scope === "origin"
          )
            paths.push(`chart.palaces.${pi}.${g}.${si}`);
        });
    });
    const old = groups.get(key);
    if (old) {
      old.label += `/${label}`;
      old.paths.push(...paths);
    } else groups.set(key, { label, branches: v.branches, x, y, paths });
  });
  return [...groups.values()];
}

/** Visual relations only; reuse the reading layer's validated palace geometry. */
export function sheetRays(snapshot: ChartSnapshot, branch: string) {
  const source = snapshot.chart.palaces.find((p) => p.earthlyBranch === branch);
  if (!source) return [];
  const origin = BRANCH_POSITION[branch];
  if (!origin) return [];
  const anchor = ([col, row]: [number, number]) => ({
    x: Math.max(300, Math.min(900, col * 300 + 150)),
    y: Math.max(410, Math.min(1230, row * 410 + 205)),
  });
  return snapshot.chart.palaces
    .filter((p) => p !== source)
    .flatMap((p) => {
      const evidence = palaceGeometry(snapshot, source.name, p.name);
      if (!evidence || !BRANCH_POSITION[p.earthlyBranch]) return [];
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
      const opposite =
        (branches.indexOf(p.earthlyBranch) - branches.indexOf(branch) + 12) %
          12 ===
        6;
      return [
        {
          from: anchor(origin),
          to: anchor(BRANCH_POSITION[p.earthlyBranch]),
          branch: p.earthlyBranch,
          relation: opposite ? "đối cung" : "tam hợp",
          label: `${p.name} (${p.earthlyBranch})`,
          paths: evidence.paths,
        },
      ];
    });
}
