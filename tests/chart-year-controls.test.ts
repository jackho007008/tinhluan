import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import fs from "node:fs";
import Chart from "../components/Chart";
const snapshot = JSON.parse(
  fs.readFileSync(".local/chart-sheet-background/synthetic.json", "utf8"),
);
it("SSR without year disables layers until the current-year calculation hydrates", () => {
  const s = structuredClone(snapshot);
  delete s.normalized.viewYear;
  delete s.chart.tanBien.viewing;
  delete s.chart.tanBien.decadal;
  const html = renderToStaticMarkup(
    React.createElement(Chart, { snapshot: s, readingId: "test-parent" }),
  );
  expect(html).toContain("Năm âm lịch đang xem");
  expect(html).toContain("Cập nhật năm xem");
  expect(html).toContain('value=""');
  expect(html).not.toContain("An lưu tiểu vận");
  const inputs = html.match(/<input[^>]*type="checkbox"[^>]*\/>/g)!;
  expect(
    inputs
      .slice(0, 3)
      .every((x) => x.includes("disabled") && !x.includes("checked")),
  ).toBe(true);
});
it("saved year never enables layers by default", () => {
  const s = structuredClone(snapshot);
  s.normalized.viewYear = 2024;
  const html = renderToStaticMarkup(
    React.createElement(Chart, { snapshot: s }),
  );
  expect(html).toContain('value="2024"');
  expect(html).not.toContain('checked=""');
});

it('customer reading exposes real year/layer/export controls while static print stays unchanged', async () => {
  const {default:CustomerChart}=await import('../components/CustomerChart');
  const interactive=renderToStaticMarkup(React.createElement(CustomerChart,{snapshot,interactive:true}));
  expect(interactive).toContain('Năm xem của lá số');
  expect(interactive).toContain('Tiểu vận (vị trí)');
  expect(interactive).toContain('Tải PNG 2400px');
  expect(interactive).toContain('Tải PDF A4');
  const staticChart=renderToStaticMarkup(React.createElement(CustomerChart,{snapshot}));
  expect(staticChart).not.toContain('Năm xem của lá số');
});

it('annual stars and minor-period position are independent layers without changing natal data',async()=>{
 const {sheetPalaces}=await import('../lib/chart-sheet');
 const s=structuredClone(snapshot),before=JSON.stringify(s);
 // Explicit technical fixture: independent layer visibility, not an engine validation.
 s.chart.tanBien.viewing={...s.chart.tanBien.viewing,year:2026,annual:s.chart.palaces[0].earthlyBranch,months:[],stars:[{scope:'year',branch:s.chart.palaces[0].earthlyBranch,name:'Lưu Thiên Mã'}]};
 const saved=JSON.stringify(s);
 const starsOnly=sheetPalaces(s,'tanbien',true,true,false,false,false);
 expect(starsOnly.some(c=>c.annual)).toBe(false);
 expect(starsOnly[0].entries.some(e=>e.label==='L. Thiên Mã')).toBe(true);
 const positionOnly=sheetPalaces(s,'tanbien',true,false,false,false,true);
 expect(positionOnly.filter(c=>c.annual)).toHaveLength(1);
 expect(positionOnly.flatMap(c=>c.entries).some(e=>e.kind==='moving')).toBe(false);
 expect(JSON.stringify(s)).toBe(saved);
 expect(before).not.toBe(saved);
});

it('customer chart keeps the supplied brand and omits superseded sheet boilerplate',async()=>{
 const {default:CustomerChart}=await import('../components/CustomerChart');
 const html=renderToStaticMarkup(React.createElement(CustomerChart,{snapshot,interactive:true}));
 expect(html).toContain('TINHLUAN.COM');
 expect(html).not.toContain('Bản thử nghiệm — một số quy ước đang được đối chiếu');
 expect(html).not.toContain('TỬ VI · Tính toán theo quy tắc. Diễn giải có căn cứ.');
 expect(html).toContain('aria-label="Tải PNG 2400px"');
 expect(html).toContain('aria-label="Tải PDF A4"');
});
