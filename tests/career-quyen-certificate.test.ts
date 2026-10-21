import { calculate } from '../lib/tuvi-engine';
import { describe, it, expect } from 'vitest';
import { careerQuyenFact } from '../lib/interpretation-rules/career-quyen-fact';
import { verifiedNatalTransformations } from '../lib/tuvi-engine/natal-transformations';
import { executeRules } from '../lib/interpretation-rules/execute';
import { careerQuyenRule } from '../lib/interpretation-rules/tanbien-career-quyen';
// Two valid engine inputs; mutations below are explicitly technical fixtures.
const input={minute:0,unknownTime:false,place:'Hà Nội',gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',timezone:'Asia/Ho_Chi_Minh',consent:true};
const yes={snapshot:await calculate({...input,date:'1978-05-06',hour:17})};
const no={snapshot:await calculate({...input,date:'1978-02-06',hour:1})};
const rows=[yes,no];
const entry=(s:any)=>s.chart.natalTransformations.entries.find((e:any)=>e.kind==='Quyền');
const clone=(r:any)=>structuredClone(r.snapshot);
const outcome=(s:any)=>careerQuyenFact(s)[0]?.value??'unknown';
const star=(s:any,path:string)=>path.split('.').reduce((v:any,k:string)=>v[k],s);
describe('1.25.1 certified natal Quyen position (software contract, not source interpretation)',()=>{
 it('valid certificate confirms presence/absence without requiring mutagen on every star',()=>{
  expect(outcome(clone(yes))).toBe('present');expect(outcome(clone(no))).toBe('absent');
  expect(careerQuyenFact(no.snapshot)[0].evidencePaths).toContain('chart.natalTransformations');
 });
 it.each(['missing','version','scope','status','path','star','palace','branch','method','source'])('%s certificate cannot prove absence',key=>{
  const s=clone(no),c=s.chart.natalTransformations;
  if(key==='missing')delete s.chart.natalTransformations;
  else if(['path','star','palace','branch'].includes(key))entry(s)[key]='invalid';else c[key]='invalid';
  expect(outcome(s)).toBe('unknown');
  expect(executeRules(s,[careerQuyenRule],'internal-draft').traces[0].status).toBe('missing-facts');
 });
 it('contradictory supplied certificate blocks a local positive, not just a negative',()=>{
  const s=clone(no),q=s.chart.palaces.find((p:any)=>p.name==='Quan Lộc');q.majorStars.push({name:'Tử Vi',scope:'origin',mutagen:'Quyền'});
  expect(verifiedNatalTransformations(s.chart)).toBeUndefined();expect(outcome(s)).toBe('unknown');
  const t=clone(yes);entry(t).path='chart.palaces.99.majorStars.0';expect(outcome(t)).toBe('unknown');
 });
 it('historical positive without certificate is kept; no inferred certificate or negative',()=>{
  const s=clone(yes);delete s.chart.natalTransformations;expect(outcome(s)).toBe('present');
  const t=clone(no);delete t.chart.natalTransformations;expect(outcome(t)).toBe('unknown');
 });
 it.each(['yearly','decadal'])('%s Quyen cannot activate natal rule',scope=>{
  const s=clone(yes);star(s,entry(s).path).scope=scope;expect(outcome(s)).toBe('unknown');
  delete s.chart.natalTransformations;expect(outcome(s)).toBe('unknown');
 });
 it('snapshots and approval gate stay unchanged',()=>{
  for(const r of rows){const prior=JSON.stringify(r.snapshot);expect(outcome(r.snapshot)).toBe(entry(r.snapshot).palace==='Quan Lộc'?'present':'absent');expect(JSON.stringify(r.snapshot)).toBe(prior);}
  expect(executeRules(yes.snapshot,[careerQuyenRule],'customer').traces[0].status).toBe('not-approved');
  expect(careerQuyenRule.status).toBe('draft');expect(careerQuyenRule.review).toBeNull();
 });
});
