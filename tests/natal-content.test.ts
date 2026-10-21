import { expect, it } from "vitest";
import fs from "node:fs";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/profile-rules";
import { freezeReading } from "../lib/internal-review/dynamic-reading";
import { exploration } from "../lib/exploration/model";
import type { InternalReading } from "../lib/internal-review/reading-store";
const load = (id: string): InternalReading => JSON.parse(fs.readFileSync(`.local/internal-readings/${id}.json`, "utf8"));
const kim = load("9f53ec47-4361-49b6-953c-6238060cbb08");
const tai = load("d7953053-6452-4f9c-a3a1-b2fe46eda69d");
const run = (s: typeof kim.snapshot) => executeRules(s, tanBienRules(s), "internal-draft");
// Expectations transcribed from p158 §8.1 and p190 §12.2, NOT generated from rule outputs.
for (const spec of [
  { id: "r40", palace: "Quan Lộc", branch: "Ngọ", stars: ["Tử Vi"] },
  { id: "r41", palace: "Quan Lộc", branch: "Tý", stars: ["Tử Vi"] },
  { id: "r42", palace: "Tài Bạch", branch: "Tuất", stars: ["Liêm Trinh", "Thiên Phủ"] },
  { id: "r43", palace: "Tài Bạch", branch: "Ngọ", stars: ["Liêm Trinh", "Thiên Tướng"] },
]) it(`${spec.id}: source branch / wrong condition / missing / unresolved adjustment remains gloss`, () => {
  const s = structuredClone(kim.snapshot), p = s.chart.palaces.find(p => p.name === spec.palace)!;
  p.earthlyBranch = spec.branch; p.majorStars = spec.stars.map(name => ({name}));
  const match = () => run(s).previewClaims.find(c => c.rules.some(r => r.id === `tanbien.${spec.id}`));
  expect(match()?.rules[0].presentation?.contentType).toBe("context");
  expect(match()?.rules[0].status).toBe("draft"); expect(match()?.rules[0].review).toBeNull();
  // Known adjustment not fully computable: NEVER promote to individual conclusion.
  p.minorStars = [{ name: "Linh Tinh", brightness: "Đắc" }]; p.adjectiveStars = [{name: "Triệt Lộ"}];
  expect(match()?.rules[0].presentation?.readerLimit).toMatch(/Chưa|chưa/);
  const original = p.majorStars;
  p.majorStars = [{name: "Tham Lang"}]; expect(match()).toBeUndefined();
  delete (p as Partial<typeof p>).majorStars;
  expect(run(s).traces.find(t => t.ruleId === `tanbien.${spec.id}`)?.status).toBe("missing-facts");
  p.majorStars = original;
  if (spec.palace === "Quan Lộc") {
    p.earthlyBranch = "Dần"; expect(match()).toBeUndefined(); p.earthlyBranch = spec.branch;
    p.majorStars.push({ name: "Thiên Phủ" }); expect(match()).toBeUndefined(); p.majorStars.pop();
  }
  s.chart.fiveElementsClass = "Kim Tứ Cục"; s.chart.lunar.lunarDay = 21;
  expect(match()).toBeUndefined();
  expect(run(s).traces.find(t => t.ruleId === `tanbien.${spec.id}`)?.details).toContain("fact.source-position-available");
});
it("actual profiles: expanded coverage, correct subject/evidence, history unchanged, draft gate", () => {
  // 1.33: 1992 Hóa Khoa tại Phu Thê, hồ sơ nam (TB PDF214 §14.21).
  // 1.33: Kim Thái Âm mang Kỵ tại Tử Nữ Hợi → xung khắc (TB PDF204 §13.3.24).
  // Source: Kim Điền Cơ Tỵ without barriers (§7.6), Nô both barriers (§9.2.11).
  // 1.36 NPL260 adds a qualified Điền adjustment, not the blocked unqualified gloss.
  for (const r of [kim,tai]) {
    const original = JSON.stringify(r), frozen = freezeReading(r.snapshot,r.receipt), m = exploration(r.snapshot,frozen);
    expect(JSON.stringify(r)).toBe(original);
    expect(m.palaces.filter(p => p.claims.length).map(p => p.name).sort()).toEqual((r===kim ? ["Mệnh","Quan Lộc","Tài Bạch","Phúc Đức","Thiên Di","Nô Bộc","Điền Trạch","Phụ Mẫu","Huynh Đệ","Tử Nữ"] : ["Mệnh","Quan Lộc","Tài Bạch","Phúc Đức","Thiên Di","Điền Trạch","Phụ Mẫu","Huynh Đệ","Phu Thê"]).sort());
    expect(exploration(r.snapshot).paragraphs).toHaveLength(0);
    for (const p of m.paragraphs) expect(p.evidence.flatMap(e => e.facts).some(f => f.text.includes(p.subject!))).toBe(true);
    expect(m.decades.every(d => !("claims" in d))).toBe(true);
  }
  // Ất Dậu is âm; Mệnh Dần is dương (HS10, TH107–108): opposed, not aligned.
  const m=exploration(kim.snapshot,freezeReading(kim.snapshot,kim.receipt));
  expect(m.paragraphs.flatMap(p=>p.claim.rules.map(r=>r.id)).sort()).toEqual(["npl.life-polarity-opposed","npl.life-foundation-cuc","npl.life-two-major-generates","npl.life-body-wealth","tanbien.life-body-same-trine","tanbien.life-body-role","tanbien.finance-npl-thien-khong","tanbien.career-void-tu-ngo","tanbien.r01","tanbien.r09","tanbien.r40","tanbien.r42","tanbien.phuc-sat-thin-tuat","tanbien.di-pha-dan-than","tanbien.no-void","tanbien.dien-co-high","tanbien.parents-sun-high","tanbien.parents-loc","tanbien.parents-hoa-quyen","tanbien.siblings-dong-cu","tanbien.children-ky"].sort());
});
it("changed branches r01/r05/r06 retain critical conditions and fail closed for missing lists", () => {
  for (const [id, base, palace, stars] of [
    ["r01",kim,"Mệnh",["Vũ Khúc"]], ["r05",tai,"Quan Lộc",["Tử Vi","Thiên Tướng"]], ["r06",tai,"Tài Bạch",["Liêm Trinh"]],
  ] as const) {
    const s=structuredClone(base.snapshot), p=s.chart.palaces.find(p=>p.name===palace)!;
    const has=()=>run(s).previewClaims.some(c=>c.rules.some(r=>r.id===`tanbien.${id}`));
    expect(has()).toBe(true);
    p.majorStars=p.majorStars.filter(star=>star.name!==stars[0]); expect(has()).toBe(false);
    delete (p as Partial<typeof p>).majorStars;
    expect(run(s).traces.find(t=>t.ruleId===`tanbien.${id}`)?.status).toBe("missing-facts");
  }
});
