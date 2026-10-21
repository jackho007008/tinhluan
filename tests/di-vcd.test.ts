import{beforeAll,describe,it,expect}from'vitest';import{calculateInternal,freezeReading}from'../lib/internal-review/dynamic-reading';import{diVcdRules,diVcdFacts}from'../lib/interpretation-rules/di-vcd';import{executeRules}from'../lib/interpretation-rules/execute';import{captureReadingPolicy,projectReading}from'../lib/trial/reading-policy';import type{ChartSnapshot}from'../lib/tuvi-engine';
// Source expectations fixed before output: PDF180§10.36 and six position-independent Di clauses174–177.
const cases=[['1978-02-06',17,'male','co-luong',['Thiên Cơ','Thiên Lương'],'may mắn'],['1978-02-18',17,'female','liem-tham',['Liêm Trinh','Tham Lang'],'tranh chấp'],['1978-05-06',1,'male','co-cu',['Thiên Cơ','Cự Môn'],'lời qua tiếng lại'],['1978-08-06',1,'male','vu-tham',['Vũ Khúc','Tham Lang'],'cạnh tranh ráo riết'],['1993-11-06',17,'male','dong-cu',['Thiên Đồng','Cự Môn'],'Được tin không đồng nghĩa mọi lời đều đúng'],['2003-11-06',17,'male','dong-luong',['Thiên Đồng','Thiên Lương'],'không từ đó suy nghề']]as const;
let samples:Awaited<ReturnType<typeof calculateInternal>>[];
const statuses=(s:ChartSnapshot)=>executeRules(s,diVcdRules,'internal-draft').traces.map(t=>t.status);
beforeAll(async()=>{samples=[];for(const[date,hour,gender]of cases)samples.push(await calculateInternal({date,hour,minute:0,gender,place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',calendar:'solar',profile:'tanbien-vn-trial-v2',unknownTime:false,consent:true}));});
describe('ND04 Di VCD restricted borrowed pairs',()=>{
 it.each(cases.map((c,i)=>[i,...c]as const))('real engine %i preserves source clause and actual star placement',(i,date,hour,gender,key,pair,meaning)=>{
  const{snapshot,receipt}=samples[i],before=JSON.stringify(snapshot),di=snapshot.chart.palaces.find(p=>p.name==='Thiên Di')!,life=snapshot.chart.palaces.find(p=>p.name==='Mệnh')!;
  expect(di.majorStars).toHaveLength(0);expect(life.majorStars.map(s=>s.name).sort()).toEqual([...pair].sort());const execution=executeRules(snapshot,diVcdRules,'internal-draft');expect(execution.previewClaims).toHaveLength(1);expect(execution.previewClaims[0].rules[0].id).toBe('tanbien.di-vcd-'+key);
  const frozen=freezeReading(snapshot,receipt),section=frozen.customerReport!.sections.find(s=>s.palaces.includes('Thiên Di'))!,p=section.paragraphs.find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.di-vcd-'+key)))!;
  expect(p.text).toContain('không có chính tinh');expect(p.text).toContain('xung chiếu từ cung Mệnh');expect(p.text).toContain(meaning);expect(p.members).toHaveLength(1);expect(p.claimIds).toEqual([execution.previewClaims[0].id]);expect(p.review).toBe('editorial-checked');expect(JSON.stringify(snapshot)).toBe(before);
  if(key==='vu-tham'){expect(p.text).toContain('trước khó sau dễ');expect(p.text).toContain('chưa xác định thời điểm');expect(section.paragraphs.some(p=>p.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.di-vu-tu-mo')))).toBe(false);}
  const record:any={id:'11111111-1111-4111-8111-111111111111',snapshot,receipt,frozen};record.accessPolicy=captureReadingPolicy(record);expect(projectReading(record).scope.palaces.find(p=>p.name==='Thiên Di')?.state).toBe('locked');expect(JSON.stringify(projectReading(record).report)).not.toContain('tanbien.di-vcd-');expect(projectReading(record,true).report).toEqual(frozen.customerReport);
 });
 it('technical fixtures: existing major in Di and unsupported pair cannot borrow',()=>{
  let s=structuredClone(samples[0].snapshot),di=s.chart.palaces.find(p=>p.name==='Thiên Di')!,life=s.chart.palaces.find(p=>p.name==='Mệnh')!;[di.majorStars,life.majorStars]=[life.majorStars,di.majorStars];expect(statuses(s).every(v=>v==='condition-false')).toBe(true);
  s=structuredClone(samples[0].snapshot);life=s.chart.palaces.find(p=>p.name==='Mệnh')!;const moon=s.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Thái Âm'))!;const j=moon.majorStars.findIndex(st=>st.name==='Thái Âm');[life.majorStars[1],moon.majorStars[j]]=[moon.majorStars[j],life.majorStars[1]];expect(statuses(s).every(v=>v==='condition-false')).toBe(true);
 });
 it('technical fixtures: missing, annual, duplicate and broken opposition stay unknown',()=>{
  const clone=()=>structuredClone(samples[0].snapshot);let s=clone();delete(s.chart.tanBien as any).completeness;expect(diVcdFacts(s)).toEqual([]);expect(statuses(s).every(v=>v==='missing-facts')).toBe(true);
  s=clone();delete(s.chart.palaces.find(p=>p.name==='Thiên Di')! as any).majorStars;expect(diVcdFacts(s)).toEqual([]);
  s=clone();(s.chart.palaces.find(p=>p.name==='Mệnh')!.majorStars[0]as any).scope='yearly';expect(diVcdFacts(s)).toEqual([]);
  s=clone();s.chart.palaces.find(p=>p.name==='Mệnh')!.majorStars.push({...s.chart.palaces.find(p=>p.name==='Mệnh')!.majorStars[0]});expect(diVcdFacts(s)).toEqual([]);
  s=clone();const di=s.chart.palaces.find(p=>p.name==='Thiên Di')!,other=s.chart.palaces.find(p=>p.name==='Quan Lộc')!;[di.earthlyBranch,other.earthlyBranch]=[other.earthlyBranch,di.earthlyBranch];expect(diVcdFacts(s)).toEqual([]);
 });
 it('technical fixtures: pair order/state/TT do not invent conditions or transfer minor stars',()=>{
  const s=structuredClone(samples[3].snapshot),life=s.chart.palaces.find(p=>p.name==='Mệnh')!,before=JSON.stringify(s.chart.palaces.find(p=>p.name==='Thiên Di'));
  life.majorStars.reverse();life.majorStars.forEach(st=>st.brightness='Hãm');s.chart.tanBien!.voidRanges![0].branches=[life.earthlyBranch,'Dần'];const facts=diVcdFacts(s);expect(facts.find(f=>f.id==='fact.di-vcd-vu-tham')?.value).toBe('yes');expect(JSON.stringify(s.chart.palaces.find(p=>p.name==='Thiên Di'))).toBe(before);expect(facts.every(f=>f.evidencePaths.every(p=>!p.includes('minorStars')&&!p.includes('voidRanges')))).toBe(true);
  expect(diVcdRules.every(r=>r.status==='draft'&&r.review===null)).toBe(true);expect(executeRules(s,diVcdRules,'customer').approvedClaims).toHaveLength(0);
 });
});
