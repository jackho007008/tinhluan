import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { careerConditions, careerRelations, positionLight } from "../lib/internal-review/career-conditions";
import { freezeReading } from "../lib/internal-review/dynamic-reading";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/profile-rules";
import { factEvidence } from "../lib/internal-review/tanbien-presentation";
import { readPath } from "../lib/interpretation-rules/schema";
import type { InternalReading } from "../lib/internal-review/reading-store";
const records = [
  "366bc412-66dc-4ba2-be5e-5048be5d0341",
  "9661be99-48cf-4921-a8b3-913d789db689",
].map(
  (id) =>
    JSON.parse(
      fs.readFileSync(`.local/internal-readings/${id}.json`, "utf8"),
    ) as InternalReading,
);
const run = (s: InternalReading["snapshot"]) =>
  executeRules(s, tanBienRules(s), "internal-draft");
const audit = (s: InternalReading["snapshot"], verified = true) =>
  careerConditions(
    s,
    run(s).previewClaims.filter((c) =>
      c.factIds.some((f) => f.startsWith("fact.career-")),
    ),
    verified,
  );
const row = (a: ReturnType<typeof audit>, id: string) =>
  a.rows.find((r) => r.id === id)!;
describe("Quan Lộc: source specification before expected — 158§8.1, 163–164§8.14,166§8.39,166–167§8.45", () => {
  it("real profiles: natal positions verified; no VCD exception on occupied palace; no expert conclusion", () => {
    const kim = audit(records[0].snapshot),
      tai = audit(records[1].snapshot);
    expect(row(kim, "satinh").text).toContain(
      "Linh Tinh (Đắc theo nguồn đã chọn) tại Quan Lộc Ngọ, đồng cung",
    );
    expect(row(kim, "void-position").text).toContain("Ngọ–Mùi");
    for (const a of [kim, tai])
      expect(row(a, "vcd-exception").state).toBe("not-applicable");
    expect(row(kim, "ho-tau").state).toBe("not-applicable");
    expect(row(tai, "ho-tau").state).toBe("checked");
    expect(row(tai, "mixed-family").cause).toBe("missing-interpretation");
    expect(row(kim, "satinh").cause).toBe("undefined-relation");
  });
  it("technical fixture: same Linh Tinh in wrong palace changes geometry, not a invented effect", () => {
    const s = structuredClone(records[0].snapshot),
      q = s.chart.palaces.find((p) => p.name === "Quan Lộc")!,
      di = s.chart.palaces.find((p) => p.name === "Thiên Di")!;
    const star = q.minorStars.find((st) => st.name === "Linh Tinh")!;
    q.minorStars = q.minorStars.filter((st) => st !== star);
    di.minorStars.push(star);
    expect(row(audit(s), "satinh").text).not.toContain(
      "Linh Tinh (Đắc theo nguồn đã chọn) tại Quan Lộc",
    );
    expect(row(audit(s), "satinh").state).toBe("unresolved");
  });
  it("technical fixture: missing list or receipt cannot prove absence / VCD", () => {
    const s = structuredClone(records[0].snapshot),
      q = s.chart.palaces.find((p) => p.name === "Quan Lộc")!;
    delete (q as Partial<typeof q>).majorStars;
    expect(row(audit(s), "vcd-exception").cause).toBe("missing-data");
    expect(row(audit(records[0].snapshot, false), "base").cause).toBe(
      "missing-data",
    );
  });
  it("technical fixture: verified empty majors activates unresolved VCD branch, not automatic Tuần/Triệt benefit", () => {
    const s = structuredClone(records[0].snapshot);
    s.chart.palaces.find((p) => p.name === "Quan Lộc")!.majorStars = [];
    const r = row(audit(s), "vcd-exception");
    expect(r.state).toBe("unresolved");
    expect(r.cause).toBe("undefined-relation");
    expect(r.text).toContain("đầy đủ và rỗng");
  });
  it("technical fixture: explicit annual stars cannot satisfy natal branches; indices still point to natal star", () => {
    const s = structuredClone(records[0].snapshot),
      q = s.chart.palaces.find((p) => p.name === "Quan Lộc")!;
    (q.majorStars[0] as unknown as { scope: string }).scope = "yearly";
    expect(
      run(s).previewClaims.some((c) =>
        c.rules.some((r) => r.id === "tanbien.r40"),
      ),
    ).toBe(false);
    const s2 = structuredClone(records[0].snapshot),
      q2 = s2.chart.palaces.find((p) => p.name === "Quan Lộc")!;
    q2.majorStars.unshift({
      ...q2.majorStars[0],
      name: "Thiên Tướng",
      scope: "decadal",
    } as (typeof q2.majorStars)[0]);
    const claim = run(s2).previewClaims.find((c) =>
      c.rules.some((r) => r.id === "tanbien.r40"),
    )!;
    expect(claim).toBeDefined();
    expect(
      claim.evidencePaths
        .filter((p) => p.endsWith(".majorStars.1.name"))
        .map((p) => readPath(s2, p)),
    ).toContain("Tử Vi");
    expect(
      run(s2).previewClaims.some((c) =>
        c.rules.some((r) => r.id === "tanbien.r05"),
      ),
    ).toBe(false);
  });
  it("technical fixture: wrong Hổ/Tấu co-palace fails R38; stored rings remain independent from stars", () => {
    const s = structuredClone(records[1].snapshot),
      q = s.chart.palaces.find((p) => p.name === "Quan Lộc")!;
    (q as unknown as { boshi12: string }).boshi12 = "Phi Liêm";
    expect(row(audit(s), "ho-tau").state).toBe("not-applicable");
  });
  it("technical fixture: missing natal ring field is missing data, not an absent pair", () => {
    const s=structuredClone(records[1].snapshot),q=s.chart.palaces.find(p=>p.name==='Quan Lộc')!;
    delete (q as unknown as {boshi12?:string}).boshi12;
    expect(row(audit(s),'ho-tau').cause).toBe('missing-data');
  });
  it("source conflicts are not missing data; source-position evidence no unmapped fallback", () => {
    const s = structuredClone(records[0].snapshot);
    s.chart.fiveElementsClass = "Kim Tứ Cục";
    s.chart.lunar.lunarDay = 21;
    expect(row(audit(s), "source-gate").cause).toBe("source-conflict");
    expect(factEvidence(s, "fact.source-position-available").text).toContain(
      "mâu thuẫn",
    );
  });
  it("metadata is branch-specific; history unchanged and draft gate maintained", () => {
    for (const r of records) {
      const before = JSON.stringify(r),
        f = freezeReading(r.snapshot, r.receipt);
      expect(JSON.stringify(r)).toBe(before);
      expect(f.reading.careerAssessment.version).toBe("1.5.0");
      expect(
        executeRules(r.snapshot, tanBienRules(r.snapshot), "customer")
          .approvedClaims,
      ).toHaveLength(0);
      for (const rule of f.reading.execution.rules)
        expect(rule.review).toBeNull();
      const rules = f.reading.execution.rules;
      expect(
        rules
          .find((r) => r.id === "tanbien.r42")
          ?.presentation?.projectScope?.join(" "),
      ).not.toContain("Độc thủ nghĩa");
      expect(
        rules
          .find((r) => r.id === "tanbien.r01")
          ?.presentation?.projectScope?.join(" "),
      ).toContain("hiếu thắng");
      for (const row of f.reading.careerAssessment.rows)
        for (const path of row.paths)
          expect(readPath(r.snapshot, path), path).not.toBeUndefined();
    }
  });
});

// Expected from Tân Biên diagrams pp18–20 and definitions p33, not evaluator output.
describe("Source evidence 1.14.0 — not branch approval", () => {
 it("keeps nhị hợp and adjacent relations together, in both directions", () => {
  expect(careerRelations("Ngọ","Mùi")).toEqual(["nhị hợp","cung kề (chưa suy cách giáp)"]);
  expect(careerRelations("Mùi","Ngọ")).toEqual(["nhị hợp","cung kề (chưa suy cách giáp)"]);
  expect(careerRelations("Thìn","Dậu")).toEqual(["nhị hợp"]);
  expect(careerRelations("Ngọ","Dần")).toEqual(["tam hợp"]);
  expect(careerRelations("Thìn","Tuất")).toEqual(["đối cung"]);
  expect(careerRelations("?","Ngọ")).toEqual([]);
 });
 it("position evidence has no implicit fallback or nature override", () => {
  for(const state of ["Miếu","Vượng","Đắc"]) expect(positionLight(state)).toBe("sáng theo vị trí");
  expect(positionLight("Hãm")).toBe("mờ theo vị trí");
  expect(positionLight("Bình")).toBe("Bình hòa — giữ riêng");
  for(const state of ["Lợi","Bất","",undefined]) expect(positionLight(state)).toBe("chưa có ánh xạ theo nguồn này");
  const a=audit(records[0].snapshot);
  expect(a.observations.find(o=>o.name==='Linh Tinh')?.light).toBe('sáng theo vị trí');
  // New method: TB114 explicitly calls Hỏa/Linh at Sửu/Mùi hãm; stored TB table is unchanged.
  expect(a.observations.find(o=>o.name==='Hỏa Tinh')?.state).toBe('Hãm');
  expect(a.observations.find(o=>o.name==='Hỏa Tinh')?.source).toContain('PDF114');
  expect(a.observations.find(o=>o.name==='Hỏa Tinh')?.relations).toContain('nhị hợp');
 });
 it("research is separate and records exact scope additions; frozen claims remain baseline", () => {
  for(const record of records) {
   const a=audit(record.snapshot);
   expect(a.research.map(r=>r.id)).toEqual(['P0','P1','P2']);
   const fresh=freezeReading(record.snapshot,record.receipt);
   const old=record.frozen.reading.sections.find(s=>s.id==='work')!;
   const work = fresh.reading.sections.find(s=>s.id==='work')!.claims;
   const positionId = 'tanbien.career-quyen-position';
   // PDF32 §1.10 adds a separate position gloss in 1.19.0. It is not P0/P1/P2.
   // Known saved fixtures: 1992 has Tử Vi Quyền; Kim has Tử Vi Khoa.
   const expectedNew = record.snapshot.normalized.date === '1992-08-07' ? [positionId] : ['tanbien.career-void-tu-ngo']; // NPL306, Tử Vi Ngọ + direct voids, specified in 1.36.
   expect(work.flatMap(c=>c.rules.map(r=>r.id)).sort()).toEqual([...old.claims.flatMap(c=>c.rules.map(r=>r.id)), ...expectedNew].sort());
   expect(work.filter(c=>!c.rules.some(r=>expectedNew.includes(r.id))).map(c=>c.text)).toEqual(old.claims.map(c=>c.text));
   expect(record.frozen.reading.sections.find(s=>s.id==='work')!.claims.some(c=>c.rules.some(r=>r.id===positionId))).toBe(false);
   expect(fresh.reading.sections.flatMap(s=>s.claims).some(c=>/Phương án nghiên cứu|P0|D1–D6/.test(c.text))).toBe(false);
  }
  const kim=audit(records[0].snapshot);
  expect(kim.research[2].added).toHaveLength(2);
  const tai=audit(records[1].snapshot);
  expect(tai.readerFacts.join(' ')).toContain('không có Lục Sát đồng cung');
  expect(audit(records[1].snapshot,false).readerFacts.join(' ')).not.toContain('đã xác nhận không có');
 });
});
