import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadSample } from "../lib/internal-review/samples";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/tanbien";
import { tanBienLifeTables } from "../lib/interpretation-rules/tanbien-source";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const life = (s: ChartSnapshot) =>
  s.chart.palaces.find((p) => p.name === "Mệnh")!;
const status = (s: ChartSnapshot, id: string) =>
  executeRules(s, tanBienRules, "internal-draft").traces.find(
    (t) => t.ruleId === id,
  )!.status;
for (const [sample, id, star, bad] of [
  ["vn-jumen", "tanbien.r13", "Thiên Cơ", "Hợi"],
  ["vn-taiyang", "tanbien.r14", "Thái Dương", "Tý"],
  ["vn-tiantong", "tanbien.r15", "Thiên Đồng", "Ngọ"],
  ["vn-0", "tanbien.r16", "Thái Âm", "Dần"],
])
  it(`${id}: source states and actual engine sample; wrong/missing facts stay distinct`, async () => {
    const s = (await loadSample(sample))!.report.snapshot;
    const before = JSON.stringify(s);
    expect(life(s).majorStars.map((s) => s.name)).toContain(star);
    expect(status(s, id)).toBe("matched");
    // All mutations below are artificial evaluator fixtures, NOT engine-valid charts.
    const moved = structuredClone(s);
    const st = life(moved).majorStars.find((s) => s.name === star)!;
    life(moved).majorStars = life(moved).majorStars.filter(
      (s) => s.name !== star,
    );
    moved.chart.palaces.find((p) => p.name === "Quan Lộc")!.majorStars.push(st);
    expect(status(moved, id)).toBe("condition-false");
    const wrong = structuredClone(s);
    life(wrong).earthlyBranch = bad;
    expect(status(wrong, id)).toBe("condition-false");
    for (const field of ["earthlyBranch", "majorStars"] as const) {
      const x = structuredClone(s);
      delete (life(x) as Partial<ReturnType<typeof life>>)[field];
      expect(status(x, id)).toBe("missing-facts");
    }
    const lookup = structuredClone(s);
    life(lookup).earthlyBranch = "unknown";
    expect(status(lookup, id)).toBe("missing-facts");
    const label = structuredClone(s);
    life(label).majorStars.forEach((s) => (s.brightness = "Hãm"));
    expect(status(label, id)).toBe("matched");
    expect(life(label).majorStars[0].brightness).toBe("Hãm");
    const r = tanBienRules.find((r) => r.id === id)!;
    expect(r.status).toBe("draft");
    expect(r.review).toBeNull();
    expect(r.presentation!.contentType).toBe("element-gloss");
    expect(
      executeRules(s, tanBienRules, "customer").approvedClaims,
    ).toHaveLength(0);
    expect(JSON.stringify(s)).toBe(before);
  });
it("four source tables cover exactly the checked branches; no engine label substitution", () => {
  const groups = {
    tianji: {
      Miếu: "Thìn,Tuất,Mão,Dậu",
      Vượng: "Tỵ,Thân",
      Đắc: "Tý,Ngọ,Sửu,Mùi",
      Hãm: "Dần,Hợi",
    },
    taiyang: {
      Miếu: "Tỵ,Ngọ",
      Vượng: "Dần,Mão,Thìn",
      Đắc: "Sửu,Mùi",
      Hãm: "Thân,Dậu,Tuất,Hợi,Tý",
    },
    tiantong: {
      Miếu: "Dần,Thân",
      Vượng: "Tý",
      Đắc: "Mão,Tỵ,Hợi",
      Hãm: "Ngọ,Dậu,Thìn,Tuất,Sửu,Mùi",
    },
    taiyin: {
      Miếu: "Dậu,Tuất,Hợi",
      Vượng: "Thân,Tý",
      Đắc: "Sửu,Mùi",
      Hãm: "Dần,Mão,Thìn,Tỵ,Ngọ",
    },
  };
  for (const [key, states] of Object.entries(groups)) {
    const table = tanBienLifeTables[key as keyof typeof groups];
    expect(Object.keys(table.states)).toHaveLength(12);
    for (const [state, branches] of Object.entries(states))
      for (const b of branches.split(",")) expect(table.states[b]).toBe(state);
  }
});
it("Sun at Tý remains outside source range; Moon/Co and Co/Cu stay separate meanings", async () => {
  const no = (await loadSample("vn-16"))!.report.snapshot;
  expect(life(no).earthlyBranch).toBe("Tý");
  expect(status(no, "tanbien.r14")).toBe("condition-false");
  const ids = (s: ChartSnapshot) =>
    buildTanBienReading(s)
      .sections.flatMap((s) =>
        s.claims.flatMap((c) => c.rules.map((r) => r.id)),
      )
      .sort();
  expect(ids((await loadSample("vn-0"))!.report.snapshot)).toEqual([
    "tanbien.finance-dong-thin-tuat",
    "tanbien.r13",
    "tanbien.r16",
  ]);
  expect(ids((await loadSample("vn-jumen"))!.report.snapshot)).toEqual([
    "tanbien.finance-dong-ty-hoi",
    "tanbien.r12",
    "tanbien.r13",
  ]);
  expect(ids(no)).toEqual(["tanbien.r07", "tanbien.r21", "tanbien.r32"]); // R14 still false; independent p.69 branch now supported
});
it("time-dependent conclusions are unimplemented, not inferred from brightness or civil hour", async () => {
  for (const [sample, id] of [
    ["vn-taiyang", "tanbien.r14"],
    ["vn-0", "tanbien.r16"],
  ]) {
    const s = (await loadSample(sample))!.report.snapshot;
    const r = tanBienRules.find((r) => r.id === id)!;
    expect(r.claimTemplate).not.toMatch(/thuận lý|toàn mỹ|rực rỡ|phú quý/);
    expect(r.presentation!.projectScope!.join(" ")).toContain(
      "Không triển khai",
    );
    const p = buildTanBienReading(s)
      .sections.flatMap((s) => s.paragraphs)
      .find((p) => p.claim.rules.some((r) => r.id === id))!;
    expect(p.nearbyNotes.map((n) => n.text).join(" ")).toContain(
      "Chưa đánh giá mức thuận theo ngày/đêm",
    );
    expect(p.evidence[0].limits.join(" ")).toContain("Chưa đặc tả");
  }
});
it("reader cleanup retains scope limits and naming uncertainty only inside evidence", async () => {
  for (const sample of ["vn-6", "vn-lianzhen"]) {
    const r = buildTanBienReading((await loadSample(sample))!.report.snapshot);
    expect(
      r.sections
        .flatMap((s) =>
          s.paragraphs.flatMap((p) => p.nearbyNotes.map((n) => n.text)),
        )
        .join(" "),
    ).not.toContain("đồng nhất");
    expect(
      r.sections
        .flatMap((s) =>
          s.paragraphs.flatMap((p) =>
            p.evidence.flatMap((e) => e.contextNotes.map((n) => n.text)),
          ),
        )
        .join(" "),
    ).toContain("chưa đồng nhất với Địa Không");
  }
  const short = readFileSync("exports/tanbien-reading-review.md", "utf8"),
    full = readFileSync("exports/tanbien-reading-examples.md", "utf8");
  expect(short).not.toMatch(
    /\n{3,}|Chưa có nội dung cho: chưa tổng hợp|chưa đồng nhất|chart\.palaces/,
  );
  expect(short).toContain(
    "Phạm vi hiện tại: các nhận định cục bộ; chưa tổng hợp toàn lá số.",
  );
  expect(full).toContain("chưa đồng nhất với Địa Không");
  const rows = JSON.parse(
    readFileSync("exports/tanbien-reading-examples.json", "utf8"),
  );
  expect(rows).toHaveLength(19);
  expect(short).toContain(rows[0].runId);
  expect(full).toContain(rows[0].runId);
  for (const row of rows)
    for (const s of row.sections)
      for (const p of s.paragraphs) {
        expect(short).toContain(p.display.text);
        for (const note of p.nearbyNotes) expect(short).toContain(note.text);
      }
});

it("shared context is concise without losing each claim's evidence", async () => {
  const r = buildTanBienReading(
    (await loadSample("vn-jumen"))!.report.snapshot,
  );
  const paragraphs = r.sections.flatMap((s) => s.paragraphs);
  expect(paragraphs.map(p=>p.claim.rules[0].id)).toEqual(["tanbien.r12", "tanbien.r13", "tanbien.finance-dong-ty-hoi"]);
  expect(
    r.unassessed.filter((n) => n.text.includes("Tuần Không")),
  ).toHaveLength(1);
  for (const p of paragraphs) {
    if (p.claim.rules[0].id === "tanbien.finance-dong-ty-hoi") {
      expect(p.evidence.flatMap(e=>e.contextNotes)).toEqual([]);
      expect(p.evidence[0].sourceConditions.join(" ")).toContain("Tài Bạch");
    } else expect(p.evidence.flatMap(e=>e.contextNotes).some(n=>n.text.includes("Tuần Không"))).toBe(true);
  }
});
