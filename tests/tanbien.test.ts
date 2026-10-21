import { expect, it } from "vitest";
import saved from "../exports/demo-wuqu-tianfu-review.json";
import { catalog } from "../lib/interpretation-rules/catalog";
import { executeRules } from "../lib/interpretation-rules/execute";
import type { ChartSnapshot } from "../lib/tuvi-engine";
import newer from "../lib/internal-review/editorial/demo-wuqu-tianfu-v1.1.json";
import older from "../lib/internal-review/editorial/demo-wuqu-tianfu.json";
const rules = catalog.filter((r) => r.id.startsWith("tanbien."));
const base = () => structuredClone(saved.snapshot) as unknown as ChartSnapshot;
const palace = (s: ChartSnapshot, name: string) =>
  s.chart.palaces.find((p) => p.name === name)!;
const run = (s: ChartSnapshot, id: string) =>
  executeRules(s, rules, "internal-draft").traces.find(
    (t) => t.ruleId === "tanbien." + id,
  )!.status;
// Every mutation below is a SYNTHETIC evaluator fixture, not an engine-valid chart.
const cases: [string, string, (s: ChartSnapshot) => void, string][] = [
  [
    "R02 Văn Khúc cung khác",
    "r02",
    (s) => {
      const m = palace(s, "Mệnh");
      const v = m.minorStars.find((x) => x.name === "Văn Khúc")!;
      m.minorStars = m.minorStars.filter((x) => x.name !== "Văn Khúc");
      palace(s, "Phúc Đức").minorStars.push(v);
    },
    "condition-false",
  ],
  [
    "R02 Vũ Khúc không ở Mệnh",
    "r02",
    (s) => {
      palace(s, "Mệnh").majorStars = palace(s, "Mệnh").majorStars.filter(
        (x) => x.name !== "Vũ Khúc",
      );
    },
    "condition-false",
  ],
  [
    "R02 chi chưa có bảng",
    "r02",
    (s) => {
      palace(s, "Mệnh").earthlyBranch = "chưa xác định";
    },
    "missing-facts",
  ],
  [
    "R02 engine khác bảng nguồn",
    "r02",
    (s) => {
      palace(s, "Mệnh").majorStars.find(
        (x) => x.name === "Vũ Khúc",
      )!.brightness = "Hãm";
    },
    "matched",
  ],
  [
    "R02 thiếu phụ tinh",
    "r02",
    (s) => {
      delete (palace(s, "Mệnh") as Partial<ReturnType<typeof palace>>)
        .minorStars;
    },
    "missing-facts",
  ],
  [
    "R02 phụ tinh rỗng",
    "r02",
    (s) => {
      palace(s, "Mệnh").minorStars = [];
    },
    "condition-false",
  ],
  [
    "R05 bộ sao ở Mệnh",
    "r05",
    (s) => {
      palace(s, "Mệnh").majorStars = palace(s, "Quan Lộc").majorStars;
      palace(s, "Quan Lộc").majorStars = [];
    },
    "condition-false",
  ],
  [
    "R05 hai cung khác nhau",
    "r05",
    (s) => {
      const p = palace(s, "Quan Lộc");
      const star = p.majorStars.find((x) => x.name === "Thiên Tướng")!;
      p.majorStars = p.majorStars.filter((x) => x.name !== "Thiên Tướng");
      palace(s, "Mệnh").majorStars.push(star);
    },
    "condition-false",
  ],
  [
    "R05 không có brightness",
    "r05",
    (s) => {
      palace(s, "Quan Lộc").majorStars.forEach((x) => delete x.brightness);
    },
    "matched",
  ],
  [
    "R06 thêm phụ tinh",
    "r06",
    (s) => {
      palace(s, "Tài Bạch").minorStars.push({ name: "Văn Khúc" });
    },
    "matched",
  ],
  [
    "R06 thêm chính tinh",
    "r06",
    (s) => {
      palace(s, "Tài Bạch").majorStars.push({ name: "Tử Vi" });
    },
    "condition-false",
  ],
  [
    "R06 sai địa chi",
    "r06",
    (s) => {
      palace(s, "Tài Bạch").earthlyBranch = "Tý";
    },
    "condition-false",
  ],
  [
    "R06 Liêm Trinh ở Mệnh",
    "r06",
    (s) => {
      palace(s, "Mệnh").majorStars = palace(s, "Tài Bạch").majorStars;
      palace(s, "Tài Bạch").majorStars = [];
    },
    "condition-false",
  ],
  [
    "R06 thiếu chính tinh",
    "r06",
    (s) => {
      delete (palace(s, "Tài Bạch") as Partial<ReturnType<typeof palace>>)
        .majorStars;
    },
    "missing-facts",
  ],
  [
    "R06 Dần",
    "r06",
    (s) => {
      palace(s, "Tài Bạch").earthlyBranch = "Dần";
    },
    "matched",
  ],
];
it("stored DEMO matches all seven local conditions; draft never becomes customer claims", () => {
  const s = base(),
    before = JSON.stringify(s);
  const e = executeRules(s, rules, "internal-draft");
  expect(e.traces).toHaveLength(536); // +30 Tân Biên completion branches; DEMO matched claims remain seven. // +7 explicitly specified direct-void branches in 1.36. // 265 baseline 1.30 + 73 Nô/Điền. Baseline 1.26:154 catalog branches +5 source-local life branches; seven legacy DEMO claims stay unchanged.
  expect(e.traces.find(t=>t.ruleId === "tanbien.life-empty-mui-sun-moon-opposite")?.status).toBe("wrong-profile");
  expect(e.traces.find(t => t.ruleId === "tanbien.r22")?.status).toBe("condition-false");
  expect(e.traces.filter((t) => t.status === "matched")).toHaveLength(7);
  expect(e.previewClaims).toHaveLength(7);
  expect(e.approvedClaims).toHaveLength(0);
  expect(executeRules(s, rules, "customer").approvedClaims).toHaveLength(0);
  expect(JSON.stringify(s)).toBe(before);
});
for (const [name, id, change, status] of cases)
  it("synthetic logic only: " + name, () => {
    const s = base();
    change(s);
    const before = JSON.stringify(s);
    expect(run(s, id)).toBe(status);
    expect(JSON.stringify(s)).toBe(before);
  });
it("known false does not turn into unknown just because another AND condition is unknown", () => {
  const s = base();
  palace(s, "Mệnh").majorStars = [];
  palace(s, "Mệnh").earthlyBranch = "chưa xác định";
  expect(run(s, "r02")).toBe("condition-false");
});
it("editorial 1.1 keeps paragraph identity and evidence; old text remains in version 1.0", () => {
  const a = newer.articles.flatMap((a) => a.paragraphs),
    b = older.articles.flatMap((a) => a.paragraphs);
  expect(a.map((p) => [p.id, p.references])).toEqual(
    b.map((p) => [p.id, p.references]),
  );
  expect(a[2].text).not.toContain("Vế sau là");
  expect(a[2].editorialNotes.join(" ")).toContain("Vế sau là");
  expect(b[2].text).toContain("Vế sau là");
  expect(newer.snapshotSha256).toBe(older.snapshotSha256);
  expect(newer.oldReadingSha256).toBe(older.oldReadingSha256);
});

import { tanBienTable } from "../lib/interpretation-rules/tanbien-source";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { loadSample } from "../lib/internal-review/samples";
it("source lookup follows PDF 34–35, independently of engine brightness", () => {
  for (const [branches, state] of [
    ["Thìn Tuất Sửu Mùi", "Miếu"],
    ["Dần Thân Tý Ngọ", "Vượng"],
    ["Mão Dậu", "Đắc"],
    ["Tỵ Hợi", "Hãm"],
  ]) {
    for (const branch of branches.split(" ")) {
      expect(tanBienTable.states[branch]).toBe(state);
      const s = base();
      palace(s, "Mệnh").earthlyBranch = branch;
      expect(run(s, "r02")).toBe(
        state === "Hãm" ? "condition-false" : "matched",
      );
      expect(run(s, "r01")).toBe(
        state === "Hãm" ? "condition-false" : "matched",
      );
    }
  }
});
it("new element glosses require the specified palace and explicit origin layer", () => {
  const s = base();
  const m = palace(s, "Mệnh");
  m.majorStars = m.majorStars.filter((s) => s.name !== "Thiên Phủ");
  expect(run(s, "r03")).toBe("condition-false");
  const wu = m.majorStars.find((s) => s.name === "Vũ Khúc")! as {
    scope?: string;
    mutagen?: string;
  };
  delete wu.scope;
  expect(run(s, "r04")).toBe("missing-facts");
  wu.scope = "decadal";
  expect(run(s, "r04")).toBe("condition-false");
  wu.scope = "origin";
  delete wu.mutagen;
  expect(run(s, "r04")).toBe("missing-facts");
  wu.mutagen = "";
  // Empty legacy metadata without a certificate cannot prove absence.
  expect(run(s, "r04")).toBe("missing-facts");
  const w = palace(s, "Tài Bạch");
  w.minorStars = [];
  expect(run(s, "r07")).toBe("condition-false");
  delete (w as Partial<typeof w>).minorStars;
  expect(run(s, "r07")).toBe("missing-facts");
});
it("narrative uses matched claims only and A→B→A does not retain content", async () => {
  const a = base();
  const before = JSON.stringify(a);
  const b = (await loadSample("vn-2"))!.report.snapshot;
  const first = buildTanBienReading(a);
  const second = buildTanBienReading(b);
  expect(
    second.sections
      .flatMap((s) => s.claims)
      .some((c) =>
        c.rules.some((r) =>
          ["tanbien.r01", "tanbien.r02", "tanbien.r03", "tanbien.r04"].includes(
            r.id,
          ),
        ),
      ),
  ).toBe(false);
  expect(second.snapshotId).not.toBe(first.snapshotId);
  expect(buildTanBienReading(a)).toEqual(first);
  for (const reading of [first, second]) {
    const displayed = reading.sections.flatMap((s) => s.claims);
    expect(new Set(displayed.map((c) => c.id)).size).toBe(displayed.length);
    expect(
      displayed.every((c) =>
        reading.execution.previewClaims.some(
          (p) => p.id === c.id && p.text === c.text,
        ),
      ),
    ).toBe(true);
  }
  expect(JSON.stringify(a)).toBe(before);
});
