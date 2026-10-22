import {describe,it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {CHART_BRANCHES,PRINCIPAL_STARS} from '../lib/tuvi-engine/chart-integrity';
import {parentUnadjustedBranches,parentUnadjustedAssessment,parentUnadjustedRules,parentUnadjustedKey} from '../lib/interpretation-rules/parent-unadjusted';
import {familyAssessment} from '../lib/interpretation-rules/phu-huynh';
import {familyVcdAssessment} from '../lib/interpretation-rules/family-vcd';
import {localPalaceAssessment,localPalaceBranches} from '../lib/interpretation-rules/no-dien-phuc';
import {noDienAssessment,noDienBranches} from '../lib/interpretation-rules/no-dien';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
type B=typeof parentUnadjustedBranches[number];
// Certified-set predicate fixtures only; these are not engine witnesses.
function fixture(b:B){
 const s=structuredClone(base);delete s.chart.natalTransformations;
 const t=s.chart.palaces.find(p=>p.name==='Phụ Mẫu')!,d=s.chart.palaces.find(p=>p.name==='Tật Ách')!;
 if(b.row.branches.length){const q=s.chart.palaces.find(p=>p.earthlyBranch===b.row.branches[0])!;[q.earthlyBranch,t.earthlyBranch]=[t.earthlyBranch,q.earthlyBranch];}
 const p=b.vcd?d:t;
 for(const q of s.chart.palaces){q.majorStars=[];q.minorStars=[];q.adjectiveStars=[];}
 const wanted=b.row.mode==='minor'?['Thiên Phủ']:b.row.stars;
 const star=(name:string)=>({name,scope:'origin',type:'major',brightness:'',mutagen:''}) as any;
 p.majorStars=wanted.map(star);s.chart.palaces.find(q=>q!==t&&q!==d)!.majorStars=PRINCIPAL_STARS.filter(n=>!wanted.includes(n)).map(star);
 if(b.row.mode==='minor')p.minorStars.push(star(b.row.stars[0]));
 const pairs=Array.from({length:6},(_,i)=>CHART_BRANCHES.slice(i*2,i*2+2));
 const away=pairs.filter(q=>!q.includes(t.earthlyBranch)&&!q.includes(d.earthlyBranch));
 s.chart.tanBien!.voidRanges=[{name:'Tuần Không',branches:away[0]},{name:'Triệt Lộ',branches:away[1]}]as any;
 return {s,t,d,p,pairs};
}
for(const b of parentUnadjustedBranches)describe(parentUnadjustedKey(b),()=>{
 it('retains only the independent facet for one Tuần, one Triệt and both; no duplication without void',()=>{
  const {s,t,pairs}=fixture(b),old=b.vcd?familyVcdAssessment:familyAssessment;
  expect(old(s,b.row).value).toBe(true);expect(parentUnadjustedAssessment(s,b).value).toBe(false);
  for(const indexes of [[0],[1],[0,1]]){
   const x=structuredClone(s),pair=pairs.find(q=>q.includes(t.earthlyBranch))!;
   for(const i of indexes)x.chart.tanBien!.voidRanges[i].branches=pair;
   expect(old(x,b.row).cause).toBe('unresolved-adjustment');expect(parentUnadjustedAssessment(x,b).value).toBe(true);
   const r=parentUnadjustedRules.find(r=>r.id==='tanbien.'+parentUnadjustedKey(b))!;
   expect(r.claimTemplate).not.toMatch(/giàu sang|khá giả|có quyền|có vị thế|thiếu thốn|túng thiếu|nghèo/);
  }
 });
 it('preserves structural gates, natal evidence and VCD position; never transfers inversion',()=>{
  const {s,t,p}=fixture(b);delete(s.chart.tanBien as any).voidRanges;
  expect(parentUnadjustedAssessment(s,b).value).toBe(true);
  s.chart.tanBien!.completeness!.majorStars='partial' as never;expect(parentUnadjustedAssessment(s,b).value).toBeUndefined();
  const x=fixture(b);for(const st of [...x.p.majorStars,...x.p.minorStars])(st as any).scope='year';expect(parentUnadjustedAssessment(x.s,b).value).not.toBe(true);
  if(b.vcd){const q=fixture(b);q.s.chart.tanBien!.voidRanges[0].branches=q.pairs.find(p=>p.includes(q.d.earthlyBranch))!;expect(parentUnadjustedAssessment(q.s,b).value).toBe(true);q.t.majorStars.push(q.d.majorStars.pop()!);expect(parentUnadjustedAssessment(q.s,b).value).toBe(false);}
 });
});
it('does not convert conditional separation or excluded parental content into a relation',()=>{
 for(const b of parentUnadjustedBranches.filter(b=>['tu-pha','tu-tham','sat-ngo','pha-ty-ngo','tham-thin-tuat','tham-ty-ngo'].includes(b.row.id))){const r=parentUnadjustedRules.find(r=>r.id==='tanbien.'+parentUnadjustedKey(b))!;expect(r.claimTemplate).not.toMatch(/xa cách|sinh tử|tai nạn|giảm thọ|làm con nuôi/);}
});
it('renders the preserved relation through the shared customer pipeline and keeps G2',()=>{
 const b=parentUnadjustedBranches.find(b=>!b.vcd&&b.row.id==='liem-phu')!,{s,t,pairs}=fixture(b);
 s.chart.tanBien!.voidRanges[0].branches=pairs.find(p=>p.includes(t.earthlyBranch))!;
 const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),customer=buildCustomerReport(s,continuous,RULESET_VERSION);
 const p=customer.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.'+parentUnadjustedKey(b))))!;
 expect(p.review).toBe('editorial-checked');expect(p.text).toContain('bất hòa');expect(p.text).not.toMatch(/giàu|nghèo|chưa kết luận/);
 const record:any={snapshot:s,frozen:{customerReport:customer,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(record.accessPolicy.freeParagraphIds).not.toContain(p.id);expect(JSON.stringify(projectReading(record))).not.toContain(p.text);
 expect(continuous.palaces.find(p=>p.name==='Tật Ách')!.groups).toHaveLength(0);
});
it('VCD origin is independent with one void; both reuse §7.33 exactly once',()=>{
 const s=structuredClone(base),t=s.chart.palaces.find(p=>p.name==='Điền Trạch')!,q=s.chart.palaces.find(p=>p!==t)!;q.majorStars.push(...t.majorStars);t.majorStars=[];
 const row=localPalaceBranches.find(r=>r.id==='dien-vcd-inheritance')!,both=noDienBranches.find(r=>r.kind==='both-void')!;
 const pairs=Array.from({length:6},(_,i)=>CHART_BRANCHES.slice(i*2,i*2+2)),at=pairs.find(p=>p.includes(t.earthlyBranch))!,away=pairs.find(p=>!p.includes(t.earthlyBranch))!;
 for(const indexes of [[],[0],[1],[0,1]]){s.chart.tanBien!.voidRanges=[{name:'Tuần Không',branches:indexes.includes(0)?at:away},{name:'Triệt Lộ',branches:indexes.includes(1)?at:away}]as any;
  expect(localPalaceAssessment(s,row).value).toBe(indexes.length<2);expect(noDienAssessment(s,both).value).toBe(indexes.length===2);
 }
 delete(s.chart.tanBien as any).voidRanges;expect(localPalaceAssessment(s,row).value).toBeUndefined();
});
