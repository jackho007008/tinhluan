import {beforeAll,describe,it,expect} from 'vitest';
import {calculateInternal,freezeReading} from '../lib/internal-review/dynamic-reading';
import {phucDiRules,DI_VU_TU_MO} from '../lib/interpretation-rules/phuc-di';
import {executeRules} from '../lib/interpretation-rules/execute';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import type {ChartSnapshot} from '../lib/tuvi-engine';
import type {InternalReading} from '../lib/internal-review/reading-store';
// Expected conditions/meaning: TB PDF236 §20.12, distinct from175/176.
// These are real engine inputs; modifications in the separate test below are technical fixtures.
const cases=[['1983-05-06',17,'male','Sửu',true],['1983-08-18',1,'female','Sửu',true],['1983-11-18',1,'female','Thìn',false],['1998-08-06',17,'male','Thìn',false],['1998-11-18',17,'female','Mùi',true],['2013-05-18',1,'female','Tuất',false]] as const;
let samples:Awaited<ReturnType<typeof calculateInternal>>[];
const rule=phucDiRules.find(r=>r.id===DI_VU_TU_MO)!;
const status=(s:ChartSnapshot)=>executeRules(s,[rule],'internal-draft').traces[0].status;
beforeAll(async()=>{samples=[];for(const [date,hour,gender]of cases)samples.push(await calculateInternal({date,hour,minute:0,gender,calendar:'solar',profile:'tanbien-vn-trial-v2',timezone:'Asia/Ho_Chi_Minh',place:'Hà Nội',consent:true,unknownTime:false}));});
describe('ND01 source decision and complete semantic groups',()=>{
 it.each(cases.map((c,i)=>[i,...c] as const))('real engine case %i preserves its distinct old meaning', (i,date,hour,gender,branch,tham)=>{
  const {snapshot,receipt}=samples[i],di=snapshot.chart.palaces.find(p=>p.name==='Thiên Di')!;
  expect(di.earthlyBranch).toBe(branch);expect(status(snapshot)).toBe('matched');
  const frozen=freezeReading(snapshot,receipt),section=frozen.customerReport!.sections.find(s=>s.palaces.includes('Thiên Di'))!,groups=section.paragraphs.filter(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===DI_VU_TU_MO)));
  expect(groups).toHaveLength(1);const p=groups[0];expect(p.members).toHaveLength(2);
  expect(p.text.match(/buôn bán giỏi/g)).toHaveLength(1);expect(p.text.match(/tăng tiến/g)).toHaveLength(1);
  expect(p.text).toContain('chưa xác định sinh kế hoặc tài chính toàn đời');expect(p.text).toContain('còn cần xem Mệnh, Thân, Tài Bạch và Quan Lộc');
  if(tham){expect(p.text).toContain('trước khó sau dễ');expect(p.text).toContain('cạnh tranh ráo riết');expect(p.text).toContain('không xác định thời điểm');}
  else {expect(p.text).toContain('đi xa');expect(p.text).toContain('có lợi hơn ở nhà');expect(p.text).toContain('không phải khuyến nghị đầu tư');}
  const sources=p.members.flatMap(m=>m.claim.rules.flatMap(r=>r.sourceReferences.map(s=>s.location))).join(' ');expect(sources).toContain('236');expect(sources).toContain('175');
  const addition=p.members.find(m=>m.claim.rules.some(r=>r.id===DI_VU_TU_MO))!.claim.id;
  expect(p.sentences.filter(s=>s.text.includes('buôn bán giỏi'))[0].claimIds).toEqual([addition]);
  const base=p.members.find(m=>m.claim.id!==addition)!.claim.id;expect(p.sentences.filter(s=>s.text.startsWith('Khi '))[0].claimIds).toEqual([base]);
  if(i===0||i===1)expect(section.paragraphs.some(p=>p.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.di-hoa-ky')))).toBe(true);
  const record:InternalReading={id:'11111111-1111-4111-8111-111111111111',createdAt:'2026-10-19T00:00:00Z',snapshot,receipt,frozen};record.accessPolicy=captureReadingPolicy(record);
  expect(projectReading(record).scope.palaces.find(p=>p.name==='Thiên Di')?.state).toBe('locked');
  expect(JSON.stringify(projectReading(record).report)).not.toContain(DI_VU_TU_MO);expect(JSON.stringify(projectReading(record).report)).not.toContain(p.text);
  expect(projectReading(record,true).report).toEqual(frozen.customerReport);
 });
 it('technical counterexamples: wrong palace/branch, missing or conflicting lists, annual star',()=>{
  const original=samples[0].snapshot,clone=()=>structuredClone(original),di=(s:ChartSnapshot)=>s.chart.palaces.find(p=>p.name==='Thiên Di')!;
  let s=clone();const life=s.chart.palaces.find(p=>p.name==='Mệnh')!,d=di(s);[d.name,life.name]=[life.name,d.name];expect(status(s)).toBe('condition-false');
  s=clone();const other=s.chart.palaces.find(p=>p.earthlyBranch==='Dần')!,x=di(s);[x.earthlyBranch,other.earthlyBranch]=[other.earthlyBranch,x.earthlyBranch];expect(status(s)).toBe('condition-false');
  s=clone();delete (s.chart.tanBien as any).completeness;expect(status(s)).toBe('missing-facts');
  s=clone();delete (di(s) as any).majorStars;expect(status(s)).toBe('missing-facts');
  s=clone();s.chart.palaces[0].name=di(s).name;expect(status(s)).toBe('missing-facts');
  s=clone();(di(s).majorStars.find(s=>s.name==='Vũ Khúc')! as any).scope='yearly';expect(status(s)).toBe('missing-facts');
  s=clone();di(s).majorStars.push({...di(s).majorStars[0]});expect(status(s)).toBe('missing-facts');
 });
 it('technical boundary: no invented brightness, gender, TT or Kỵ absence prerequisite',()=>{
  const s=structuredClone(samples[0].snapshot),di=s.chart.palaces.find(p=>p.name==='Thiên Di')!;
  di.majorStars.forEach(st=>st.brightness='Hãm');s.normalized.gender='female';
  s.chart.tanBien!.voidRanges![0].branches=[di.earthlyBranch,'Dần'];
  expect(status(s)).toBe('matched');expect(rule.status).toBe('draft');expect(rule.review).toBeNull();
  expect(rule.presentation?.projectScope?.join(' ')).toContain('không yêu cầu đơn thủ');
  expect(executeRules(s,[rule],'customer').approvedClaims).toHaveLength(0);
 });
});
