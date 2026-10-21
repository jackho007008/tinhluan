import {beforeAll,describe,it,expect} from 'vitest';
import {calculateInternal,freezeReading} from '../lib/internal-review/dynamic-reading';
import {diVcdFacts,diVcdRules} from '../lib/interpretation-rules/di-vcd';
import {executeRules} from '../lib/interpretation-rules/execute';
import {phucDiRules} from '../lib/interpretation-rules/phuc-di';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import type {ChartSnapshot} from '../lib/tuvi-engine';
// Expected from PDF175§10.5/176§10.8 first sentence +180§10.36, fixed before execution.
// The additive Tuần/Kỵ sentence has unresolved location; it is NOT an absence gate on the base.
const id='tanbien.di-vcd-nhat-nguyet-base',rules=diVcdRules.filter(r=>r.id===id);
let samples:Awaited<ReturnType<typeof calculateInternal>>[];
const run=(s:ChartSnapshot)=>executeRules(s,rules,'internal-draft');
beforeAll(async()=>{samples=[];for(const date of ['1978-02-18','1988-08-18'])samples.push(await calculateInternal({date,hour:1,minute:0,gender:'female',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',calendar:'solar',profile:'tanbien-vn-trial-v2',unknownTime:false,consent:true}));});
describe('ND04 independent Sun–Moon Di base, not the unresolved modifier',()=>{
 it.each([[0,'Sửu','Mùi'],[1,'Mùi','Sửu']])('engine witness %i: original positions, source meaning, G2 and trace',(i,donor,target)=>{
  const{snapshot,receipt}=samples[Number(i)],before=JSON.stringify(snapshot),di=snapshot.chart.palaces.find(p=>p.name==='Thiên Di')!,life=snapshot.chart.palaces.find(p=>p.name==='Mệnh')!;
  expect(di.earthlyBranch).toBe(target);expect(life.earthlyBranch).toBe(donor);expect(di.majorStars).toHaveLength(0);expect(life.majorStars.map(s=>s.name).sort()).toEqual(['Thái Dương','Thái Âm'].sort());expect(run(snapshot).previewClaims).toHaveLength(1);
  const frozen=freezeReading(snapshot,receipt),section=frozen.customerReport!.sections.find(s=>s.palaces.includes('Thiên Di'))!,p=section.paragraphs.find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===id)))!;
  for(const meaning of ['ra ngoài hơn ở nhà','gần nơi quyền thế','được tôn phục','chưa áp dụng vế tăng thêm','xung chiếu từ cung Mệnh'])expect(p.text).toContain(meaning);
  expect(p.text).not.toMatch(/càng rực rỡ|hóa giải|Triệt|về sau|thành công/);expect(p.claimIds).toHaveLength(1);expect(p.review).toBe('editorial-checked');expect(p.sentences.every(s=>s.claimIds.includes(p.claimIds[0]))).toBe(true);expect(p.members[0].claim.rules[0].sourceReferences[0].location).toContain('175–176');
  const record:any={snapshot,receipt,frozen};record.accessPolicy=captureReadingPolicy(record);expect(projectReading(record).scope.palaces.find(p=>p.name==='Thiên Di')?.state).toBe('locked');expect(JSON.stringify(projectReading(record).report)).not.toContain(id);expect(projectReading(record,true).report).toEqual(frozen.customerReport);expect(JSON.stringify(snapshot)).toBe(before);
 });
 it('technical fixtures: TT, Kỵ and brightness never create the unresolved amplification or remove minor claims',()=>{
  for(const location of ['Mệnh','Thiên Di']){const s=structuredClone(samples[0].snapshot),p=s.chart.palaces.find(p=>p.name===location)!;
   delete s.chart.natalTransformations;
   p.minorStars.push({name:'Văn Khúc',type:'soft',scope:'origin',brightness:'',mutagen:'Kỵ'} as any);
   s.chart.tanBien!.voidRanges![0].branches=[p.earthlyBranch,'Dần'];
   const life=s.chart.palaces.find(p=>p.name==='Mệnh')!;life.majorStars.reverse();life.majorStars.forEach(s=>s.brightness='Hãm');
   expect(run(s).previewClaims).toHaveLength(1);expect(run(s).previewClaims[0].text).not.toContain('lại càng rực rỡ');
   const oldRules=phucDiRules.filter(r=>r.id!==id),old=executeRules(s,oldRules,'internal-draft'),all=executeRules(s,phucDiRules,'internal-draft');expect(all.previewClaims.filter(c=>!c.rules.some(r=>r.id===id))).toEqual(old.previewClaims);if(location==='Thiên Di')expect(all.previewClaims.some(c=>c.rules.some(r=>r.id==='tanbien.di-hoa-ky'))).toBe(true);
   expect(diVcdFacts(s).find(f=>f.id==='fact.di-vcd-nhat-nguyet-base')!.evidencePaths.every(p=>!p.includes('voidRanges')&&!p.includes('minorStars'))).toBe(true);
  }
 });
 it('technical fixtures: missing Tứ Hóa is not read as absent Kỵ and is not required for this base',()=>{
  const s=structuredClone(samples[0].snapshot);delete s.chart.natalTransformations;delete(s.chart.tanBien as any).voidRanges;
  expect(run(s).traces[0].status).toBe('matched');expect(rules[0].requiredFacts).not.toContain('fact.no-hoa-ky');expect(rules[0].presentation?.knownExceptions.join(' ')).toContain('Nền không đòi hỏi vắng');
 });
 it('technical fixtures: no borrowing if Di occupied or pair differs',()=>{
  let s=structuredClone(samples[0].snapshot),di=s.chart.palaces.find(p=>p.name==='Thiên Di')!,life=s.chart.palaces.find(p=>p.name==='Mệnh')!;[di.majorStars,life.majorStars]=[life.majorStars,di.majorStars];expect(run(s).traces[0].status).toBe('condition-false');
  s=structuredClone(samples[0].snapshot);life=s.chart.palaces.find(p=>p.name==='Mệnh')!;const other=s.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Thiên Đồng'))!,j=other.majorStars.findIndex(st=>st.name==='Thiên Đồng');[life.majorStars[0],other.majorStars[j]]=[other.majorStars[j],life.majorStars[0]];expect(run(s).traces[0].status).toBe('condition-false');
 });
 it('technical fixtures: incomplete/annual/invalid opposition is unknown, not blank Di',()=>{
  for(const kind of ['incomplete','annual','opposition','missing'] as const){const s=structuredClone(samples[0].snapshot),life=s.chart.palaces.find(p=>p.name==='Mệnh')!,di=s.chart.palaces.find(p=>p.name==='Thiên Di')!;
   if(kind==='incomplete')delete(s.chart.tanBien as any).completeness;if(kind==='annual')(life.majorStars[0] as any).scope='yearly';if(kind==='missing')delete(di as any).majorStars;if(kind==='opposition'){const q=s.chart.palaces.find(p=>p.name==='Quan Lộc')!;[di.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,di.earthlyBranch];}
   expect(run(s).traces[0].status).toBe('missing-facts');expect(run(s).previewClaims).toHaveLength(0);
  }
 });
});
