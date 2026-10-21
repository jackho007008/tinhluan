import { it, expect } from "vitest";
import fs from "node:fs";
import saved from "../exports/demo-wuqu-tianfu-review.json";
import type { ChartSnapshot } from "../lib/tuvi-engine";
import { catalog } from "../lib/interpretation-rules/catalog";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/profile-rules";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { lifeOverview } from "../lib/internal-review/life-overview";
// Technical fixtures, not engine-valid charts. Expected predicates transcribed from
// the read source specification: p77 Canh/Nhâm + Vũ/Phủ at Tý; p64 Đồng/Âm at Tý;
// p71–72 Nhật/Nguyệt at Sửu or Mùi. No prediction is the expected output.
const cases = [
  ["vu-phu-ty-canh-nham", "Vũ Khúc", "Thiên Phủ", "Tý"],
  ["dong-nguyet-ty", "Thiên Đồng", "Thái Âm", "Tý"],
  ["nhat-nguyet-suu", "Thái Dương", "Thái Âm", "Sửu"],
  ["nhat-nguyet-mui", "Thái Dương", "Thái Âm", "Mùi"],
];
const base = () => {
  const s = structuredClone(saved.snapshot) as unknown as ChartSnapshot;
  s.profile.id = "tanbien-vn-trial-v2";
  s.normalized.profile = "tanbien-vn-trial-v2";
  s.chart.tanBien = { inputs: { yearStem: "Nhâm" } } as any;
  s.chart.fiveElementsClass = "Thổ Ngũ Cục";
  s.chart.lunar.lunarDay = 1;
  return s;
};
const trace = (s: ChartSnapshot, id: string) =>
  executeRules(s, tanBienRules(s), "internal-draft").traces.find(
    (t) => t.ruleId === id,
  )!;
for (const [key, a, b, branch] of cases)
  it(key + " source predicate / wrong / missing / scope", () => {
    const s = base(),
      p = s.chart.palaces.find((p) => p.name === "Mệnh")!,
      id = "tanbien.life-" + key;
    p.majorStars = [
      { name: a, scope: "origin" },
      { name: b, scope: "origin" },
    ] as any;
    p.earthlyBranch = branch;
    const before = JSON.stringify(s);
    expect(trace(s, id).status).toBe("matched");
    expect(JSON.stringify(s)).toBe(before);
    p.earthlyBranch = "Hợi";
    expect(trace(s, id).status).toBe("condition-false");
    p.earthlyBranch = branch;
    p.majorStars[1] = { name: b, scope: "annual" } as any;
    expect(trace(s, id).status).toBe("condition-false");
    p.majorStars = [{ name: a }, { name: b }];
    delete (p as any).majorStars;
    expect(trace(s, id).status).toBe("missing-facts");
    p.majorStars = [{ name: a }, { name: b }];
    const oldName = p.name;
    p.name = "Không phải Mệnh";
    expect(trace(s, id).status).toBe("missing-facts");
    p.name = oldName;
    delete (p as any).earthlyBranch;
    expect(trace(s, id).status).toBe("missing-facts");
    p.earthlyBranch = branch;
    expect(
      buildTanBienReading(s, { unverifiedStarLists: true }).sections.find(
        (s) => s.id === "structure",
      )!.claims,
    ).toHaveLength(0);
    if (key.includes("canh")) {
      s.chart.tanBien!.inputs.yearStem = "Giáp";
      expect(trace(s, id).status).toBe("condition-false");
      Reflect.deleteProperty(s.chart.tanBien!.inputs, "yearStem");
      expect(trace(s, id).status).toBe("missing-facts");
    }
    const r = catalog.find((r) => r.id === id)!;
    expect(r.status).toBe("draft");
    expect(r.review).toBeNull();
    expect(r.presentation?.contentType).toBe("context");
    expect(
      executeRules(s, tanBienRules(s), "customer").approvedClaims.some((c) =>
        c.rules.some((r) => r.id === id),
      ),
    ).toBe(false);
  });
it("Thân position only; empty requires completeness; Vũ–Tướng stays unresolved", () => {
  const mains=JSON.parse(fs.readFileSync(".local/life-expand-20261012/mains.json","utf8"));
  const s=structuredClone(mains[0].snapshot),p=s.chart.palaces.find((p:any)=>p.name==="Mệnh");
  expect(lifeOverview(s,[],true).gaps[0].text).toContain("chưa đủ điều kiện");
  p.majorStars=[];
  expect(lifeOverview(s,[],true).facts[1].text).toMatch(/^Chưa có danh sách/);
  const cohort=JSON.parse(fs.readFileSync(".local/life-expand-20261012/before.json","utf8"));
  const empty=cohort.find((x:any)=>x.snapshot.chart.palaces.find((p:any)=>p.name==="Mệnh").majorStars.length===0).snapshot;
  expect(lifeOverview(empty,[],true).facts[1].text).toBe("Cung Mệnh không có chính tinh tọa thủ trong danh sách đầy đủ đã lưu. Điều này không tự có nghĩa lá số xấu hay người đọc thiếu phẩm chất.");
  delete p.majorStars;
  expect(lifeOverview(s,[],true).facts[1].text).toMatch(/^Chưa có danh sách/);
  expect(lifeOverview(s,[],false).facts[1].text).toMatch(/^Chưa có danh sách/);
});
it("current baseline: career/finance unchanged and no duplicate claims", () => {
  const rows=JSON.parse(fs.readFileSync(".local/life-expand-20261012/before.json","utf8"));
  for(const row of rows){
    const before=JSON.stringify(row.snapshot),r=buildTanBienReading(row.snapshot);
    for(const theme of ["work","finance"]){
      const cs=(e:any)=>e.previewClaims.filter((c:any)=>c.rules.some((r:any)=>r.presentation?.readingTheme===theme));
      expect(cs(executeRules(row.snapshot,row.execution.rules,"internal-draft"))).toEqual(cs(row.execution)); // Historical catalog replay; current additions tested in void-palace.
    }
    expect(JSON.stringify(row.snapshot)).toBe(before);
    const ids=r.sections.flatMap(s=>s.claims.map(c=>c.id));expect(new Set(ids).size).toBe(ids.length);
  }
});
