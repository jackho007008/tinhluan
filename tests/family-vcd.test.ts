import {describe,expect,it} from 'vitest';
import {calculateInternal} from '../lib/internal-review/dynamic-reading';
import {familyVcdAssessment,familyVcdBranches,familyVcdFacts,familyVcdKey,familyVcdRules} from '../lib/interpretation-rules/family-vcd';
import {CHART_BRANCHES,principalIntegrity} from '../lib/tuvi-engine/chart-integrity';
import type {FamilyBranch} from '../lib/interpretation-rules/phu-huynh';
import {executeRules} from '../lib/interpretation-rules/execute';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';

const {snapshot:base}=await calculateInternal({date:'2000-01-10',hour:10,minute:0,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',timezone:'Asia/Ho_Chi_Minh',place:'Việt Nam',unknownTime:false,consent:true});
// Predicate fixtures only: rearrange a complete natal set; not additional engine charts.
function fixture(r:FamilyBranch){
 const s=structuredClone(base),t=s.chart.palaces.find(p=>p.name===r.palace)!,d=s.chart.palaces.find(p=>p.name===(r.palace==='Phụ Mẫu'?'Tật Ách':'Nô Bộc'))!;
 const stars=s.chart.palaces.flatMap(p=>p.majorStars);s.chart.palaces.forEach(p=>p.majorStars=[]);
 d.majorStars=stars.filter(st=>r.stars.includes(st.name));
 const others=s.chart.palaces.filter(p=>p!==t&&p!==d);stars.filter(st=>!r.stars.includes(st.name)).forEach((st,i)=>others[i%others.length].majorStars.push(st));
 const pairs=Array.from({length:6},(_,i)=>CHART_BRANCHES.slice(i*2,i*2+2)).filter(p=>!p.includes(t.earthlyBranch)&&!p.includes(d.earthlyBranch));
 s.chart.tanBien!.voidRanges=[{name:'Tuần Không',branches:pairs[0]},{name:'Triệt Lộ',branches:pairs[1]}] as NonNullable<typeof s.chart.tanBien>['voidRanges'];
 return {s,t,d,others};
}
describe('receiving-palace source clauses, PDF131 /224 (technical fixtures)',()=>{
 for(const r of familyVcdBranches)it(`${familyVcdKey(r)} requires the whole opposite pair and an actually empty target`,()=>{
  const {s,t,d,others}=fixture(r);expect(principalIntegrity(s.chart).valid).toBe(true);
  expect(familyVcdAssessment(s,r).value).toBe(true);
  const rule=familyVcdRules.find(q=>q.id==='tanbien.'+familyVcdKey(r))!;
  expect(executeRules(s,[rule],'internal-draft').previewClaims).toHaveLength(1);
  t.majorStars.push(others[0].majorStars.pop()!);expect(familyVcdAssessment(s,r).value).toBe(false);
  others[0].majorStars.push(t.majorStars.pop()!);
  others[0].majorStars.push(d.majorStars.pop()!);expect(familyVcdAssessment(s,r).value).toBe(false);
 });
 it('tam hợp is not xung chiếu; inconsistent palace names never become a match',()=>{
  const r=familyVcdBranches.find(r=>r.id==='co-luong')!,{s,d,others}=fixture(r);
  [d.majorStars,others[0].majorStars]=[others[0].majorStars,d.majorStars];expect(familyVcdAssessment(s,r).value).toBe(false);
  const x=fixture(r);[x.d.name,x.others[0].name]=[x.others[0].name,x.d.name];expect(familyVcdAssessment(x.s,r).cause).toBe('missing-data');
 });
 it('missing/inconsistent/non-natal evidence is unknown, not a genuinely empty palace',()=>{
  const r=familyVcdBranches[0];
  for(const mode of ['missing','partial','duplicate','year']){
   const {s,t,d}=fixture(r);
   if(mode==='missing')delete(t as any).majorStars;
   if(mode==='partial')s.chart.tanBien!.completeness!.majorStars='partial' as never;
   if(mode==='duplicate')d.majorStars.push({...d.majorStars[0]});
   if(mode==='year')(d.majorStars[0] as any).scope='year';
   expect(familyVcdAssessment(s,r).cause).toBe('missing-data');
   expect(familyVcdFacts(s).find(f=>f.id==='fact.'+familyVcdKey(r))).toBeUndefined();
  }
 });
 it('parental wealth remains unresolved under a void at either end; missing void data differs',()=>{
  const r=familyVcdBranches.find(r=>r.palace==='Phụ Mẫu'&&r.id==='co-luong')!;
  for(const side of ['t','d']as const){const x=fixture(r),branch=x[side].earthlyBranch,i=CHART_BRANCHES.indexOf(branch);x.s.chart.tanBien!.voidRanges![0].branches=CHART_BRANCHES.slice(i-i%2,i-i%2+2);
   expect(familyVcdAssessment(x.s,r).cause).toBe('unresolved-adjustment');
  }
  const {s}=fixture(r);delete (s.chart.tanBien as any).voidRanges;expect(familyVcdAssessment(s,r).cause).toBe('missing-data');
 });
 it('does not invent brightness, age, gender or absence-of-void conditions for independent relations',()=>{
  for(const r of familyVcdBranches.filter(r=>!r.wealth)){
   const {s,d}=fixture(r);d.majorStars.forEach(st=>delete(st as any).brightness);s.normalized.gender='female';s.normalized.date='2025-01-10';delete (s.chart.tanBien as any).voidRanges;
   expect(familyVcdAssessment(s,r).value).toBe(true);
  }
 });
 it('keeps difficult and favorable sides, source meaning and paid scope; never borrows donor prose',()=>{
  const r=familyVcdBranches.find(r=>r.id==='vu-tham-later')!,{s}=fixture(r);
  const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),customer=buildCustomerReport(s,continuous,RULESET_VERSION);
  const p=customer.sections.flatMap(x=>x.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(q=>q.id==='tanbien.siblings-vcd-vu-tham-later')))!;
  expect(p.text).toContain('sớm xa nhau');expect(p.text).toContain('về sau đều giàu có');expect(p.text).not.toMatch(/sau \d+|vì vậy|nhờ đó|bù lại/);
  expect(p.review).toBe('editorial-checked');expect(p.sentences.every(x=>x.claimIds.length)).toBe(true);
  const record:any={snapshot:s,frozen:{customerReport:customer,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);
  expect(record.accessPolicy.freeParagraphIds).not.toContain(p.id);expect(JSON.stringify(projectReading(record))).not.toContain(JSON.stringify(p.text));
  expect(continuous.palaces.find(p=>p.name==='Tật Ách')!.groups).toHaveLength(0);
 });
 it('does not expand state/branch-dependent or count-only clauses; conditional harm is not softened into separation',()=>{
  expect(familyVcdBranches.some(r=>r.id==='dong-moon-ty'||r.id==='sun-cu-dan'||r.id==='vu-tuong'&&r.palace==='Huynh Đệ')).toBe(false);
  for(const id of ['parents-vcd-co-cu','siblings-vcd-dong-cu']){
   const r=familyVcdRules.find(r=>r.id==='tanbien.'+id)!;
   expect(r.claimTemplate).toContain('thiếu hòa khí');expect(r.claimTemplate).not.toContain('xa cách');
  }
  expect(familyVcdRules.every(r=>r.status==='draft'&&r.review===null)).toBe(true);
 });
});
