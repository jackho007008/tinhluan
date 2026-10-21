import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {careerQuyenRule as rule} from '../lib/interpretation-rules/tanbien-career-quyen';
import {careerQuyenFact} from '../lib/interpretation-rules/career-quyen-fact';
import {executeRules} from '../lib/interpretation-rules/execute';
import {readPath} from '../lib/interpretation-rules/schema';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import type{ChartSnapshot}from'../lib/tuvi-engine';
const load=(prefix:string)=>JSON.parse(fs.readFileSync('.local/internal-readings/'+fs.readdirSync('.local/internal-readings').find(n=>n.startsWith(prefix)),'utf8'));
const saved=load('a0fdc46c'),kim=load('6f1828af');
const base=():ChartSnapshot=>structuredClone(saved.snapshot);
const quan=(s:ChartSnapshot)=>s.chart.palaces.find(p=>p.name==='Quan Lộc')!;
const run=(s:ChartSnapshot)=>executeRules(s,[rule],'internal-draft');
const status=(s:ChartSnapshot)=>run(s).traces[0].status;
describe('PDF32 §1.10: Quyền ở Quan is a positional gloss, not §8.20',()=>{
 it('real stored charts: 1992, Thiên Lương and Thái Âm qualify independently of star identity; Kim Khoa does not',()=>{
  for(const prefix of ['a0fdc46c','1b21098b','939c1650'])expect(run(load(prefix).snapshot).previewClaims.map(c=>c.rules[0].id)).toEqual([rule.id]);
  expect(run(kim.snapshot).previewClaims).toHaveLength(0);
 });
 it('technical fixture: opposite/trine palace cannot replace local placement',()=>{
  for(const target of ['Phu Thê','Mệnh']){
   const s=base(),st=quan(s).majorStars.find(x=>x.mutagen==='Quyền')!;st.mutagen='';
   s.chart.palaces.find(p=>p.name===target)!.majorStars[0].mutagen='Quyền';
   expect(run(s).previewClaims).toHaveLength(0);
  }
 });
 it('technical fixtures: missing scope, mutagen, lists, ambiguous palace, and annual/decadal scopes stay unknown',()=>{
  const mutations=[
   (s:ChartSnapshot)=>{delete (quan(s).majorStars[0] as any).scope},
   (s:ChartSnapshot)=>{delete quan(s).majorStars[0].mutagen},
   (s:ChartSnapshot)=>{delete (quan(s) as any).majorStars},
   (s:ChartSnapshot)=>{s.chart.palaces.push(structuredClone(quan(s)))},
   (s:ChartSnapshot)=>{(quan(s).majorStars[0] as any).scope='yearly'},
   (s:ChartSnapshot)=>{(quan(s).majorStars[0] as any).scope='decadal'},
  ];
  for(const change of mutations){const s=base();change(s);expect(status(s)).toBe('missing-facts');expect(run(s).previewClaims).toHaveLength(0)}
 });
 it('technical fixture: known positive survives unrelated metadata missing; an unrelated known mutagen cannot prove absence',()=>{
  const s=base();delete (quan(s) as any).minorStars;expect(run(s).previewClaims).toHaveLength(1);
  quan(s).majorStars[0].mutagen='Khoa';expect(status(s)).toBe('missing-facts');
 });
 it('technical fixture: local empty metadata without a global certificate cannot prove absence',()=>{
  const s=base();for(const field of ['majorStars','minorStars'] as const)for(const st of quan(s)[field])st.mutagen='';
  expect(careerQuyenFact(s)).toEqual([]);expect(status(s)).toBe('missing-facts');
  delete quan(s).minorStars[0].mutagen;expect(status(s)).toBe('missing-facts');
 });
 it('technical fixture: brightness is not a condition; source exceptions are not inferred remedies',()=>{
  const s=base();delete quan(s).majorStars[0].brightness;expect(run(s).previewClaims).toHaveLength(1);
  const text=run(s).previewClaims[0].text;(s.chart.tanBien as any).voidRanges=[];
  expect(run(s).previewClaims[0].text).toBe(text);expect(text).toContain('không xác nhận chức vụ');expect(text).toContain('Chưa có quy tắc phối hợp');
 });
 it('real evidence and technical fixture indices point to natal witness even with annual star before it',()=>{
  const s=base();const a={...quan(s).majorStars[0],scope:'yearly'};quan(s).majorStars.unshift(a as any);
  const f=run(s).derivedFacts.find(f=>f.id==='fact.career-origin-quyen-position')!;
  expect(f.evidencePaths.some(p=>p.endsWith('.majorStars.1.mutagen'))).toBe(true);
  for(const p of f.evidencePaths)expect(readPath(s,p)).not.toBeUndefined();
 });
 it('source gate, profile, receipt, and customer approval remain independent',()=>{
  const s=base();s.profile.id='vn-utc7-midnight-v1';expect(status(s)).toBe('wrong-profile');
  const conflict=base();conflict.chart.fiveElementsClass='Kim Tứ Cục';conflict.chart.lunar!.lunarDay=21;expect(status(conflict)).toBe('missing-facts');
  expect(executeRules(base(),[rule],'customer').traces[0].status).toBe('not-approved');
  expect(rule.status).toBe('draft');expect(rule.review).toBeNull();
  expect(freezeReading(saved.snapshot).reading.sections.flatMap(s=>s.claims).some(c=>c.rules.some(r=>r.id===rule.id))).toBe(false);
 });
 it('new frozen reading contains exactly one new position paragraph and does not mutate snapshot or historical file',()=>{
  const original=JSON.stringify(saved);const f=freezeReading(saved.snapshot,saved.receipt);
  const q=f.reading.sections.find(s=>s.id==='work')!.paragraphs.filter(p=>p.claim.rules.some(r=>r.id===rule.id));
  expect(q).toHaveLength(1);expect(q[0].evidence[0].facts.some(f=>f.text==='Có Hóa Quyền bản mệnh tại Quan Lộc.')).toBe(true);
  expect(JSON.stringify(saved)).toBe(original);expect(f.reading.templateVersion).toBe('1.45.0');
 });
});
