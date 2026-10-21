import React from 'react';
import {it,expect} from 'vitest';
import {createRequire} from 'node:module';
import {renderToStaticMarkup} from 'react-dom/server';
import {calculate} from '../lib/tuvi-engine';
import ChartSheet from '../components/ChartSheet';
import {rulerConvention,RULER_CONVENTION} from '../lib/ruler-conventions';
import {reference} from './fixtures/ruler-reference';
const require=createRequire(import.meta.url);
const {earthlyBranches}=require('iztro/lib/data/earthlyBranches');
const {EARTHLY_BRANCHES}=require('iztro/lib/data/constants');
const vi=require('iztro/lib/i18n/locales/vi-VN/star').default;
const zh=require('iztro/lib/i18n/locales/zh-CN/star').default;
const input={date:'2005-06-07',hour:8,minute:30,gender:'female',calendar:'solar',timezone:'Asia/Ho_Chi_Minh',profile:'tanbien-vn-trial-v2',place:'Kiểm tra quy ước',consent:true,unknownTime:false};
it('checks all 12 branch IDs and Vietnamese/Chinese labels against independent tables',()=>{
 expect(require('iztro/package.json').version).toBe('2.6.1');
 reference.forEach((r,i)=>{const row=earthlyBranches[EARTHLY_BRANCHES[i]];
 expect([row.soul,zh[row.soul],vi[row.soul],row.body,zh[row.body],vi[row.body]]).toEqual(r.slice(2));
 });
});
it('distinguishes palace input from year input across all 12 life palaces in the same birth year',async()=>{
 const seen=new Set();
 for(let h=0;h<24;h+=2){const s=await calculate({...input,hour:h});
 const tyIndex=((4-h/2+2)%12+12)%12;
 const r=reference[tyIndex]; const p=s.chart.palaces.find(p=>p.name==='Mệnh')!;
 expect(p.earthlyBranch).toBe(r[0]); expect(s.chart.soul).toBe('Văn Khúc');expect(s.chart.body).toBe('Thiên Đồng');seen.add(p.earthlyBranch);
 } expect(seen.size).toBe(12);
},30000);
it('checks year input for body over all 12 years, independent of life palace',async()=>{
 for(let i=0;i<12;i++){const s=await calculate({...input,date:`${1996+i}-06-07`});expect(s.chart.body).toBe(i===0 ? 'Linh Tinh' : reference[i][7]);}
},30000);
it('checks both audited cases and preserves stored values in sheet rendering',async()=>{
 const kim=await calculate(input);expect([kim.chart.soul,kim.chart.body]).toEqual(['Văn Khúc','Thiên Đồng']);
 const old=await calculate({...input,date:'1992-08-07',hour:16,minute:0,gender:'male'});expect([old.chart.soul,old.chart.body]).toEqual(['Liêm Trinh','Thiên Lương']);
 expect(reference[9][4]).toBe('Văn Khúc'); // Birth-year alternative cannot explain AItuvi Cự Môn.
 expect(rulerConvention(kim)?.id).toBe('quan-xuan-thinh-year-rulers-1.0.0');
 
 const saved=structuredClone(kim);saved.chart.soul='GIÁ TRỊ MỆNH ĐÃ LƯU';saved.chart.body='GIÁ TRỊ THÂN ĐÃ LƯU';
 const before=JSON.stringify(saved);
 const html=renderToStaticMarkup(React.createElement(ChartSheet,{snapshot:saved,context:"tanbien",full:true,zoom:false,onSelect:()=>{}}));
 expect(html).not.toContain('Nguồn và phương pháp');expect(html).not.toContain('Theo chi cung Mệnh:');
 expect(html).toContain('GIÁ TRỊ MỆNH ĐÃ LƯU');expect(html).toContain('GIÁ TRỊ THÂN ĐÃ LƯU');expect(JSON.stringify(saved)).toBe(before);
},10000);

it('renders saved rulers and hides the unsupported cục ruler', async()=>{
 const {customerInfo}=await import('../lib/chart-customer-info');
 const s=await calculate({...input,date:'1992-08-07',hour:16,minute:0,gender:'male'});
 expect(customerInfo(s).find(r=>r.label==='Sao chủ cục')).toBeUndefined();
 expect(customerInfo(s).find(r=>r.label==='Mệnh chủ')).toEqual({label:'Mệnh chủ',value:'Liêm Trinh'});
 expect(customerInfo(s).find(r=>r.label==='Thân chủ')).toEqual({label:'Thân chủ',value:'Thiên Lương'});
});
