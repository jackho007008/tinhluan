import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {it,expect} from 'vitest';import {calculate} from '../lib/tuvi-engine';import {customerInfo,elementRelation,polarityRelation,majorStatus} from '../lib/chart-customer-info';import {sheetPalaces} from '../lib/chart-sheet';import ChartSheet from '../components/ChartSheet';
const input={name:'Kim Thoa',date:'2005-06-07',hour:8,minute:30,gender:'female',calendar:'solar',timezone:'Asia/Ho_Chi_Minh',profile:'tanbien-vn-trial-v2',place:'Không ghi trên ảnh',unknownTime:false,consent:true};
it('implements all 25 element pairs from Tan Bien p24 with explicit direction',()=>{
 const es=['Kim','Thủy','Mộc','Hỏa','Thổ'];const expected=[['Mệnh và Cục đồng hành','Mệnh sinh Cục','Mệnh khắc Cục','Cục khắc Bản Mệnh','Cục sinh Mệnh'],['Cục sinh Mệnh','Mệnh và Cục đồng hành','Mệnh sinh Cục','Mệnh khắc Cục','Cục khắc Bản Mệnh'],['Cục khắc Bản Mệnh','Cục sinh Mệnh','Mệnh và Cục đồng hành','Mệnh sinh Cục','Mệnh khắc Cục'],['Mệnh khắc Cục','Cục khắc Bản Mệnh','Cục sinh Mệnh','Mệnh và Cục đồng hành','Mệnh sinh Cục'],['Mệnh sinh Cục','Mệnh khắc Cục','Cục khắc Bản Mệnh','Cục sinh Mệnh','Mệnh và Cục đồng hành']];
 es.forEach((m,i)=>es.forEach((c,j)=>expect(elementRelation(m,c)).toBe(expected[i][j])));expect(elementRelation(undefined,'Thổ')).toBeUndefined();
});
it('compares year and life palace polarity, not sex or decadal direction (p26,p31)',()=>{expect(polarityRelation('Dậu','Dần')).toBe('Âm dương nghịch lý');expect(polarityRelation('Thân','Tý')).toBe('Âm dương thuận lý');expect(polarityRelation('Dậu','Mão')).toBe('Âm dương thuận lý');expect(polarityRelation(undefined,'Dần')).toBeUndefined();});
it('renders customer info and blank major region without changing any saved star or dropping secondary stars',async()=>{
 const s=await calculate(input),before=JSON.stringify(s);const info=customerInfo(s);
 expect(info.find(r=>r.label==='Họ tên')?.value).toBe('Kim Thoa');expect(info.find(r=>r.label==='Dương lịch')?.value).toBe('07/06/2005');expect(info.find(r=>r.label==='Giờ sinh')?.value).toBe('08:30 — Giờ Thìn');expect(info.find(r=>r.label==='Âm Dương')?.secondary).toBe('Âm dương nghịch lý');expect(info.find(r=>r.label==='Cục')?.secondary).toBe('Cục khắc Bản Mệnh');expect(info.some(r=>r.label==='Năm xem')).toBe(false);
 const html=renderToStaticMarkup(React.createElement(ChartSheet,{snapshot:s,context:'tanbien',full:true,zoom:false,onSelect:()=>{}}));const svg=html.slice(html.indexOf('<svg'),html.lastIndexOf('</svg>'));
 expect(svg).not.toMatch(/Vô chính diệu|iztro|tanbien-trial|tanbien-vn/);expect(svg).toContain('Lộc Tồn');expect(svg).toContain('Thiên Đồng');expect(svg).toContain('Thiên Thọ');expect(svg).toContain('Thiên Quý');
 const empty=s.chart.palaces.find(p=>p.majorStars.length===0)!;expect(majorStatus(s,empty)).toBe('Cung này không có chính tinh.');const missing=structuredClone(s);delete (missing.chart.palaces[0] as any).majorStars;expect(majorStatus(missing,missing.chart.palaces[0])).toBe('Chưa có dữ liệu chính tinh.');expect(sheetPalaces(missing,'tanbien',true).find(p=>p.index===0)?.missing.length).toBeGreaterThan(0);
 expect(JSON.stringify(s)).toBe(before);
 const unnamed=await calculate({...input,name:undefined});expect(customerInfo(unnamed)[0].value).toBe('Chưa ghi họ tên');expect(unnamed.chart).toEqual(s.chart);
 const other=await calculate({...input,name:undefined,date:'1992-08-07',hour:16,minute:0,gender:'male'});expect(customerInfo(other).find(r=>r.label==='Âm Dương')).toMatchObject({value:'Dương Nam',secondary:'Âm dương thuận lý'});expect(customerInfo(other).find(r=>r.label==='Cục')?.secondary).toBe('Mệnh khắc Cục');
});
it('covers all four polarity/gender labels without coupling the relation to gender',async()=>{
 for(const [date,gender,value] of [['2005-06-07','male','Âm Nam'],['2005-06-07','female','Âm Nữ'],['1992-08-07','male','Dương Nam'],['1992-08-07','female','Dương Nữ']]){
  const s=await calculate({...input,date,gender});expect(customerInfo(s).find(r=>r.label==='Âm Dương')?.value).toBe(value);
 }
});
