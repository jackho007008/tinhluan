import {describe,it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {PRINCIPAL_STARS,CHART_BRANCHES} from '../lib/tuvi-engine/chart-integrity';
import {certifyNatalTransformations} from '../lib/tuvi-engine/natal-transformations';
import {completionAssessment,completionBranches,COMPLETION_SAT} from '../lib/interpretation-rules/natal-completion';
import {phucUnadjustedBranches,phucUnadjustedKey,phucUnadjustedAssessment} from '../lib/interpretation-rules/phuc-unadjusted';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
// Certified-set predicate fixtures; never presented as engine witnesses.
function fixture(stars:string[]){
 const s=structuredClone(base);delete s.chart.natalTransformations;
 const p=s.chart.palaces.find(p=>p.name==='Phúc Đức')!;
 for(const q of s.chart.palaces){q.majorStars=[];q.minorStars=[];q.adjectiveStars=[];}
 const star=(name:string)=>({name,scope:'origin',type:'major',brightness:'',mutagen:''})as any;
 p.majorStars=stars.map(star);
 const others=s.chart.palaces.filter(q=>q!==p);PRINCIPAL_STARS.filter(n=>!stars.includes(n)).forEach((n,i)=>others[i%others.length].majorStars.push(star(n)));
 const pairs=Array.from({length:6},(_,i)=>CHART_BRANCHES.slice(2*i,2*i+2)),at=pairs.find(q=>q.includes(p.earthlyBranch))!,away=pairs.find(q=>!q.includes(p.earthlyBranch))!;
 s.chart.tanBien!.voidRanges=[{name:'Tuần Không',branches:away},{name:'Triệt Lộ',branches:away}]as any;
 return {s,p,at,star};
}
for(const row of phucUnadjustedBranches)describe(phucUnadjustedKey(row),()=>{
 it('keeps only dispersal under each sát, Tuần, Triệt and both; full base stays withheld',()=>{
  const f=fixture(row.stars!);expect(completionAssessment(f.s,row).value).toBe('yes');expect(phucUnadjustedAssessment(f.s,row).value).toBe('no');
  for(const name of COMPLETION_SAT){const {s,p,star}=fixture(row.stars!);p.minorStars.push(star(name));expect(completionAssessment(s,row).cause).toBe('unresolved-adjustment');expect(phucUnadjustedAssessment(s,row).value).toBe('yes');}
  for(const indexes of [[0],[1],[0,1]]){const {s,at}=fixture(row.stars!);for(const i of indexes)s.chart.tanBien!.voidRanges[i].branches=at;expect(completionAssessment(s,row).value).toBeUndefined();expect(phucUnadjustedAssessment(s,row).value).toBe('yes');}
 });
 it('preserves incomplete/annual/invalid evidence and rejects other palace, pair and VCD',()=>{
  const a=fixture(row.stars!);a.p.minorStars.push(a.star('Linh Tinh'));const before=JSON.stringify(a.s);phucUnadjustedAssessment(a.s,row);expect(JSON.stringify(a.s)).toBe(before);
  a.s.chart.tanBien!.completeness!.minorStars='partial' as never;expect(phucUnadjustedAssessment(a.s,row).value).toBeUndefined();
  const b=fixture(row.stars!);(b.p.majorStars[0]as any).scope='year';expect(phucUnadjustedAssessment(b.s,row).value).toBeUndefined();
  const c=fixture(row.stars!);c.p.minorStars.push({...c.star('Linh Tinh'),scope:'year'});expect(phucUnadjustedAssessment(c.s,row).value).toBeUndefined();
  const d=fixture(row.stars!);delete(d.s.chart.tanBien as any).voidRanges;expect(phucUnadjustedAssessment(d.s,row).value).toBeUndefined();
  const e=fixture(row.stars!);e.s.chart.tanBien!.voidRanges[0].branches=['Tý','Ngọ'];expect(phucUnadjustedAssessment(e.s,row).value).toBeUndefined();
  const f=fixture(row.stars!);const q=f.s.chart.palaces.find(p=>p!==f.p)!;q.majorStars.push(...f.p.majorStars);f.p.majorStars=[];expect(phucUnadjustedAssessment(f.s,row).value).toBe('no');
  expect(phucUnadjustedAssessment(fixture(['Tử Vi','Thiên Tướng']).s,row).value).toBe('no');
  const notAllowed=completionBranches.find(r=>r.id==='phuc-base-tu-tuong')!;expect(completionAssessment(fixture(notAllowed.stars!).s,notAllowed,'phuc-dispersal').value).toBe('no');
 });
 it('runs through the shared customer pipeline, keeps G2 and never restores the whole base',()=>{
  const {s,p,star}=fixture(row.stars!);p.minorStars.push(star('Linh Tinh'));
  const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),customer=buildCustomerReport(s,continuous,RULESET_VERSION),id='tanbien.'+phucUnadjustedKey(row);
  expect(reading.execution.previewClaims.some(c=>c.rules.some(r=>r.id==='tanbien.'+row.id))).toBe(false);
  const paragraph=customer.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===id)))!;
  expect(paragraph.review).toBe('editorial-checked');expect(paragraph.text).toContain('phân tán');expect(paragraph.text).not.toMatch(/hưởng phúc|khá giả|xứng ý|xa quê|sinh tử/);
  const record:any={snapshot:s,frozen:{customerReport:customer,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(record.accessPolicy.freeParagraphIds).not.toContain(paragraph.id);expect(JSON.stringify(projectReading(record))).not.toContain(paragraph.text);
 });
});
it('gathers Kỵ and principal evidence into one unchanged Kỵ wording, preserving all conditions',()=>{
 const row=phucUnadjustedBranches.find(r=>r.id==='phuc-base-tu-tham')!,{s,p,star}=fixture(row.stars!);p.minorStars.push(star('Linh Tinh'));
 // Tân assignment is synthetic solely to exercise certified Kỵ and deduplication.
 const names=['Cự Môn','Thái Dương','Văn Khúc','Văn Xương'];s.chart.tanBien!.trace.find(t=>t.id==='mutagens')!.result=names;
 for(const [i,name] of names.entries()){
  let st=s.chart.palaces.flatMap(p=>[...p.majorStars,...p.minorStars]).find(st=>st.name===name);
  if(!st){st=star(name);(name==='Văn Xương'?p:s.chart.palaces.find(q=>q!==p)!).minorStars.push(st!);}st!.mutagen=['Lộc','Quyền','Khoa','Kỵ'][i];
 }
 s.chart.natalTransformations=certifyNatalTransformations(s.chart);
 const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),customer=buildCustomerReport(s,continuous,RULESET_VERSION);
 const id='tanbien.'+phucUnadjustedKey(row),paragraphs=customer.sections.filter(s=>s.palaces.includes('Phúc Đức')).flatMap(s=>s.paragraphs);
 const combined=paragraphs.find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===id)))!;
 expect(combined.members.flatMap(m=>m.claim.rules.map(r=>r.id))).toEqual(expect.arrayContaining([id,'tanbien.phuc-hoa-ky']));
 expect(combined.text.match(/ly tán/g)).toHaveLength(1);expect(combined.text).toContain('tranh chấp');expect(combined.sentences.every(s=>s.claimIds.length===2)).toBe(true);
 expect(paragraphs.filter(p=>p.text.includes('ly tán'))).toHaveLength(1);expect(combined.review).toBe('editorial-checked');
});
