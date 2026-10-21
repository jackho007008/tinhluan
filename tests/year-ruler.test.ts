import {it,expect} from 'vitest';
import {calculate,type ChartData} from '../lib/tuvi-engine';
import {applyYearRuler,yearSoul,BRANCH_IDS,YEAR_SOUL} from '../lib/year-ruler';
import {reference} from './fixtures/ruler-reference';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {earthlyBranches}=require('iztro/lib/data/earthlyBranches');
const base={date:'1992-08-07',hour:16,minute:0,gender:'male',calendar:'solar',timezone:'Asia/Ho_Chi_Minh',profile:'tanbien-vn-trial-v2',place:'Kiểm tra',consent:true,unknownTime:false};
it('matches all 12 user-approved branch/star codes and installed library',()=>{
 BRANCH_IDS.forEach((id,i)=>{
  expect(YEAR_SOUL[id]).toBe(reference[i][2]);
  expect(earthlyBranches[id].soul).toBe(reference[i][2]);
  expect(yearSoul(id)).toEqual({starId:reference[i][2],name:reference[i][4]});
 });
 expect(yearSoul(undefined)).toBeUndefined();expect(yearSoul('Thân')).toBeUndefined();
});
it('uses normalized natal lunar year and is independent of translations or other chart fields',async()=>{
 const s=await calculate(base),before=structuredClone(s.chart);
 expect(s.chart.rulers?.birthYearBranchId).toBe('shenEarthly');
 expect(s.chart.soul).toBe('Liêm Trinh');expect(s.chart.body).toBe('Thiên Lương');expect(s.chart.fiveElementsClass).toBe('Mộc Tam Cục');
 const upstream=structuredClone(s.chart);delete upstream.rulers;upstream.soul='Tham Lang';
 const applied=applyYearRuler(upstream),{soul,rulers,...rest}=applied;
 const {soul:old,...oldRest}=upstream;expect(rest).toEqual(oldRest);
 expect(applied.rulers?.previous.value).toBe('Tham Lang');
 upstream.tanBien!.inputs.yearBranch='UNTRANSLATED';expect(applyYearRuler(upstream).soul).toBe('Liêm Trinh');
 expect(s.chart).toEqual(before);
 const missing=structuredClone(upstream);Reflect.deleteProperty(missing.tanBien!.inputs,'lunar');
 expect(applyYearRuler(missing).soul).toBe('');expect(applyYearRuler(missing).rulers?.status).toBe('missing-birth-year');
},10000);
it('changing viewing year never changes the natal ruler',async()=>{
 const a=await calculate({...base,viewYear:2026}),b=await calculate({...base,viewYear:2036});
 expect(b.chart.rulers).toEqual(a.chart.rulers);expect(b.chart.soul).toBe(a.chart.soul);
},10000);

// Expected transcribed from the user's Quản Xuân Thịnh excerpt, not iztro output.
it('checks the chosen body table for every branch, including the distinct Tý/Ngọ entries',async()=>{
 const {yearBody}=await import('../lib/year-ruler');
 const expected=[['lingxingMin','Linh Tinh'],['tianxiangMaj','Thiên Tướng'],['tianliangMaj','Thiên Lương'],['tiantongMaj','Thiên Đồng'],['wenchangMin','Văn Xương'],['tianjiMaj','Thiên Cơ'],['huoxingMin','Hỏa Tinh'],['tianxiangMaj','Thiên Tướng'],['tianliangMaj','Thiên Lương'],['tiantongMaj','Thiên Đồng'],['wenchangMin','Văn Xương'],['tianjiMaj','Thiên Cơ']];
 BRANCH_IDS.forEach((branch,i)=>expect(yearBody(branch)).toEqual({starId:expected[i][0],name:expected[i][1]}));
 expect(yearBody(undefined)).toBeUndefined();expect(yearBody('Tý')).toBeUndefined();
 const original=(await calculate({...base,date:'1996-06-07'})).chart;
 const upstream=structuredClone(original);delete upstream.rulers;upstream.body='Hỏa Tinh';upstream.soul='CŨ';
 const before=structuredClone(upstream),updated=applyYearRuler(upstream);
 expect(updated.body).toBe('Linh Tinh');expect(updated.rulers?.body?.previous.value).toBe('Hỏa Tinh');
 const strip=(c:ChartData)=>{const {soul,body,rulers,...rest}=c;return rest;};
 expect(strip(updated)).toEqual(strip(before));expect(upstream).toEqual(before);
 const missing=structuredClone(upstream);Reflect.deleteProperty(missing.tanBien!.inputs,'lunar');
 expect(applyYearRuler(missing).body).toBe('');expect(applyYearRuler(missing).rulers?.body?.starId).toBeNull();
},10000);
