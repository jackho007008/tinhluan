import React from 'react';
import fs from 'node:fs';
import {beforeAll,describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {calculate,type ChartSnapshot} from '../lib/tuvi-engine';
import {resultPresentation,initialAiState,AI_STATE_LABELS} from '../lib/result-presentation';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {captureReadingPolicy,projectReading,type ReadingScope} from '../lib/trial/reading-policy';
import type {InternalReading} from '../lib/internal-review/reading-store';
import Workspace from '../components/CustomerReadingWorkspace';
import AiReadingStatus from '../components/AiReadingStatus';
import CustomerReading from '../components/CustomerReading';
let snapshot:ChartSnapshot;
beforeAll(async()=>{snapshot=await calculate({name:'Kiểm giao diện',date:'2005-06-07',hour:8,minute:30,gender:'female',calendar:'solar',timezone:'Asia/Ho_Chi_Minh',profile:'tanbien-vn-trial-v2',place:'Không ghi',unknownTime:false,consent:true});});
const scope=(full=false):ReadingScope=>({policy:'test-only',full,palaces:[],heldCount:0});
describe('Gói 1 reads saved engine facts without upgrading historical data',()=>{
 it('keeps 12 ordered palaces, actual star states, body, and all four certified natal transformations',()=>{
  const before=JSON.stringify(snapshot),view=resultPresentation(snapshot);
  expect(view.palaces).toHaveLength(12);expect(view.palaces[0].name).toBe('Mệnh');
  for(const p of view.palaces){const saved=snapshot.chart.palaces.find(s=>s.name===p.name)!;expect(p.branch).toBe(saved.earthlyBranch);expect(p.stars.map(s=>s.name)).toEqual(saved.majorStars.map(s=>s.name));expect(p.voidConfirmed).toBe(saved.majorStars.length===0);for(const s of p.stars)expect(s.display).toBe(snapshot.chart.tanBien!.states[s.name+'@'+p.branch]!.value);}
  expect(view.body).toBe(snapshot.chart.palaces.find(p=>p.isBodyPalace)!.name);
  expect(view.transformations.map(t=>t.entry)).toEqual(snapshot.chart.natalTransformations!.entries);
  expect(JSON.stringify(snapshot)).toBe(before);
 });
 it('distinguishes absent lists from certified vô chính diệu, duplicates, and missing snapshot',()=>{
  const s=structuredClone(snapshot),p=s.chart.palaces.find(p=>p.name==='Mệnh')!;delete (p as Partial<typeof p>).majorStars;
  expect(resultPresentation(s).palaces[0]).toMatchObject({voidConfirmed:false,empty:'Chưa có dữ liệu chính tinh.'});
  s.chart.palaces.push({...p});expect(resultPresentation(s).palaces[0]).toMatchObject({voidConfirmed:false,branch:'Chưa có dữ kiện'});
  expect(resultPresentation().palaces).toHaveLength(12);expect(resultPresentation().transformations.every(t=>!t.entry)).toBe(true);
 });
 it('does not fill historical or inconsistent Tứ Hóa or unverified ruler fields',()=>{
  const old=structuredClone(snapshot);delete old.chart.natalTransformations;delete old.chart.rulers;
  expect(resultPresentation(old).transformations.every(t=>!t.entry)).toBe(true);expect(resultPresentation(old).soul).toBeUndefined();expect(resultPresentation(old).bodyRuler).toBeUndefined();
  const bad=structuredClone(snapshot);bad.chart.natalTransformations!.entries[0].palace='Mệnh';bad.chart.natalTransformations!.entries[0].star='Không hợp lệ';
  expect(resultPresentation(bad).transformations.every(t=>!t.entry)).toBe(true);
 });
 it('only exposes placeholder AI states in production, independent of catalog content',()=>{
  expect(initialAiState('Mệnh',scope())).toBe('not-created');expect(initialAiState('Quan Lộc',scope())).toBe('not-entitled');expect(initialAiState('Quan Lộc',scope(true))).toBe('not-created');
  for(const [state,label] of Object.entries(AI_STATE_LABELS)){const html=renderToStaticMarkup(React.createElement(AiReadingStatus,{state:state as keyof typeof AI_STATE_LABELS}));expect(html).toContain(label);expect(html).not.toContain('<button');}
 });
});
describe('Saved content, access scope and print compatibility',()=>{
 const samples=JSON.parse(fs.readFileSync('fixtures/customer-reading-samples.json','utf8'));
 it('renders exactly four tabs, Mệnh open, other 11 closed, no AI prose or scoring',()=>{
  const s=samples[0],r:InternalReading={id:'fixture',createdAt:'2026-10-27',snapshot:s.snapshot,frozen:freezeReading(s.snapshot,s.receipt)};r.accessPolicy=captureReadingPolicy(r);const v=projectReading(r),before=JSON.stringify(r);
  const html=renderToStaticMarkup(React.createElement(Workspace,{report:v.report,snapshot:r.snapshot,basic:false,scope:v.scope}));
  expect(html.match(/role="tab"/g)).toHaveLength(4);expect(html).toContain('Tổng quan');expect(html).toContain('12 cung');expect(html).toContain('Tứ Hóa');expect(html).toContain('Vận hạn');
  expect(html).toMatch(/id="cung-0"[^>]*data-open="true"/);for(let i=1;i<12;i++)expect(html).toMatch(new RegExp(`id="cung-${i}"[^>]*data-open="false"`));
  expect(html.match(/data-ai-state="not-created"/g)).toHaveLength(1);expect(html.match(/data-ai-state="not-entitled"/g)).toHaveLength(11);
  expect(html).toContain('Phần Vận hạn đang được hoàn thiện.');expect(html).not.toMatch(/Luận chi tiết AI|\d+(?:\.\d+)?%|đại cát|đại hung|data-ai-state="completed"/i);
  for(const p of r.frozen.customerReport!.sections.flatMap(s=>s.paragraphs))if(!r.accessPolicy.freeParagraphIds.includes(p.id))expect(html).not.toContain(`data-customer-paragraph="${p.id}"`);
  expect(JSON.stringify(r)).toBe(before);
 });
 it('keeps every authorized frozen paragraph exactly once in free/full and old editions, without changing policies or hashes',()=>{
  for(const sample of samples.slice(0,6))for(const full of [false,true]){
   const r:InternalReading={id:'fixture',createdAt:'2026-10-27',snapshot:sample.snapshot,frozen:freezeReading(sample.snapshot,sample.receipt)};r.accessPolicy=captureReadingPolicy(r);if(full)delete r.accessPolicy;
   const before=JSON.stringify(r),v=projectReading(r,full);
   const html=renderToStaticMarkup(React.createElement(Workspace,{report:v.report,snapshot:r.snapshot,basic:false,scope:v.scope}));
   for(const section of v.report.sections){expect(html.split(`data-customer-section="${section.id}"`).length-1).toBe(1);for(const notice of section.notices)expect(html).toContain(renderToStaticMarkup(React.createElement('p',null,notice.text)).slice(3,-4));}
   for(const p of v.report.sections.flatMap(s=>s.paragraphs)){
    expect(html.split(`data-customer-paragraph="${p.id}"`).length-1).toBe(1);
    const escaped=renderToStaticMarkup(React.createElement('p',null,p.text));expect(html).toContain(escaped.slice(3,-4));
   }
   expect(JSON.stringify(r)).toBe(before);
  }
 });
 it('keeps existing basic-mode selection and print output separate from tab UI',()=>{
  const s=samples[1],r=freezeReading(s.snapshot,s.receipt).customerReport!;
  const html=renderToStaticMarkup(React.createElement(Workspace,{report:r,snapshot:s.snapshot,basic:true,scope:scope(true)}));
  for(const section of r.sections)expect(html.includes(`data-customer-section="${section.id}"`)).toBe(r.basicSectionIds.includes(section.id));
  for(const version of ['1.45.0','1.46.0',r.version]){
   const print=renderToStaticMarkup(React.createElement(CustomerReading,{report:{...r,version},snapshot:s.snapshot,print:true}));expect(print).not.toContain('role="tab"');expect(print).not.toContain('data-ai-state');
  }
 });
});
