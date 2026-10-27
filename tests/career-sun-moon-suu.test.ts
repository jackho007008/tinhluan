import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {CAREER_SUN_MOON_SUU as ID,CAREER_SUN_MOON_SUU_COPY as COPY,careerSunMoonSuuRule as rule} from '../lib/interpretation-rules/career-sun-moon-suu';
import {executeRules} from '../lib/interpretation-rules/execute';
import {tanBienLifeTables} from '../lib/interpretation-rules/tanbien-source';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {sourceTablesForRule} from '../lib/internal-review/tanbien-presentation';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
const saved=(i:number)=>JSON.parse(fs.readFileSync(`.local/tb-family-phuc-20261026/after/${i}.json`,'utf8'));
const base=saved(116).snapshot;
const status=(s:any)=>executeRules(s,[rule],'internal-draft').traces[0].status;
const life=(s:any)=>s.chart.palaces.find((p:any)=>p.name==='Mệnh');
const lum=(s:any,n:string)=>s.chart.palaces.find((p:any)=>p.majorStars?.some((t:any)=>t.name===n));
const report=(s:any)=>{const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),customer=buildCustomerReport(s,continuous,RULESET_VERSION);return {reading,continuous,customer};};
describe('Q-U42 explicit natal Sửu–Tỵ–Dậu clause',()=>{
 it.each([116,123])('engine witness %s answers attainment separately from organization, paid work subject',i=>{
  const old=saved(i),s=old.snapshot,before=JSON.stringify(s),o=report(s);
  expect(status(s)).toBe('matched');const frozen=freezeReading(s);expect(frozen.compatibility?.version).toBe('tanbien-profile-compatibility-0.13.0');expect(frozen.compatibility?.changes).toContain(ID+'@1.0.0');expect(life(s).majorStars.length).toBeGreaterThan(0);
  const ps=o.customer.sections.flatMap(s=>s.paragraphs),targets=ps.filter(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===ID)));
  expect(targets).toHaveLength(1);expect(targets[0].text).toBe(COPY);expect(targets[0].review).toBe('editorial-checked');expect(JSON.stringify(targets[0].members.flatMap(m=>m.layers))).toContain('Cổng dự án Q-U42');expect(targets[0].title).toBe('Thế Nhật–Nguyệt chiếu Mệnh và công danh');
  expect(o.customer.sections.find(s=>s.id==='natal-palace-4')!.paragraphs).toContain(targets[0]);
  expect(o.continuous.palaces.find(p=>p.name==='Mệnh')!.groups.flatMap(g=>g.members).some(m=>m.claim.rules.some(r=>r.id===ID))).toBe(false);
  expect(o.continuous.unbound).toEqual([]);
  for(const p of old.customer.sections.flatMap((s:any)=>s.paragraphs))expect(ps.find(x=>x.id===p.id)?.text).toBe(p.text);
  const record:any={frozen:{customerReport:o.customer,continuousReport:o.continuous}};record.accessPolicy=captureReadingPolicy(record);
  expect(record.accessPolicy).toEqual(old.accessPolicy);
  const free=projectReading(record,false),full=projectReading(record,true);expect(JSON.stringify(free)).not.toContain(ID);expect(JSON.stringify(free)).not.toContain(COPY);expect(full.report).toBe(o.customer);
  expect(JSON.stringify(s)).toBe(before);
 });
 it('source tables are the same author, no table or saved brightness fallback',()=>{
  expect(sourceTablesForRule(rule)).toHaveProperty('taiyang');expect(sourceTablesForRule(rule)).toHaveProperty('taiyin');
  const tables=tanBienLifeTables as any,t=tables.taiyang,orig=t.states['Tỵ'];try{delete t.states['Tỵ'];expect(status(base)).toBe('missing-facts');t.states['Tỵ']='Hãm';expect(status(base)).toBe('condition-false');delete tables.taiyang;expect(status(base)).toBe('missing-facts');}finally{tables.taiyang=t;t.states['Tỵ']=orig;}
 });
 it('VCD and wrong chi/geometry do not match; fixtures are not engine witnesses',()=>{
  const x=structuredClone(base),l=life(x),other=x.chart.palaces.find((p:any)=>p.name==='Phụ Mẫu');other.majorStars.push(...l.majorStars);l.majorStars=[];expect(status(x)).toBe('condition-false');
  for(const name of ['Thái Dương','Thái Âm']){const y=structuredClone(base),a=lum(y,name),b=y.chart.palaces.find((p:any)=>p.name==='Phu Thê');[a.majorStars,b.majorStars]=[b.majorStars,a.majorStars];expect(status(y)).toBe('condition-false');}
  const y=structuredClone(base),b=y.chart.palaces.find((p:any)=>p.name==='Phụ Mẫu');[life(y).name,b.name]=[b.name,life(y).name];expect(status(y)).toBe('condition-false');
 });
 const changes:[string,(s:any)=>void][]=[['declaration',s=>delete s.chart.tanBien.completeness],['list',s=>delete life(s).majorStars],['duplicate principal',s=>life(s).majorStars.push({...lum(s,'Thái Dương').majorStars.find((x:any)=>x.name==='Thái Dương')})],['non-natal principal',s=>lum(s,'Thái Dương').majorStars.find((x:any)=>x.name==='Thái Dương').scope='yearly'],['noncanonical name',s=>lum(s,'Thái Dương').majorStars.find((x:any)=>x.name==='Thái Dương').name='wrong']];
 it.each(changes)('missing or invalid %s is unknown',(_,change)=>{const x=structuredClone(base);change(x);expect(status(x)).toBe('missing-facts');});
 it('does not transfer TT enhancement or require synthesis of every principal',()=>{
  for(const branches of [['Sửu','Dần'],['Tỵ','Ngọ'],['Dậu','Tuất']]){const x=structuredClone(base);for(const v of x.chart.tanBien.voidRanges)v.branches=branches;expect(status(x)).toBe('matched');}
  const x=structuredClone(base);delete x.chart.tanBien.voidRanges;expect(status(x)).toBe('matched');expect(COPY).not.toMatch(/hoàn mỹ|tuổi thọ|giàu có/);expect(rule.presentation!.sourceConditions![0]).toContain('không yêu cầu Mệnh vô chính diệu');
 });
});
