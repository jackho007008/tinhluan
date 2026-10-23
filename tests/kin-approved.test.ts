import {it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {PRINCIPAL_STARS} from '../lib/tuvi-engine/chart-integrity';
import {kinAssessment,kinKey,type KinBranch} from '../lib/interpretation-rules/phu-tu';
import {approvedKinBranches,approvedKinRules} from '../lib/interpretation-rules/kin-approved';
import {executeRules} from '../lib/interpretation-rules/execute';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
// Technical assignments only; not an engine chart or a professional expected outcome.
function fixture(r:KinBranch){
 const s=structuredClone(base);delete s.chart.natalTransformations;s.normalized.gender=(r.gender||'male') as 'male'|'female';
 const p=s.chart.palaces.find(p=>p.name===r.palace)!;
 if(r.branches.length){const q=s.chart.palaces.find(q=>q.earthlyBranch===r.branches[0])!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];}
 for(const q of s.chart.palaces){q.majorStars=[];q.minorStars=[];q.adjectiveStars=[];}
 const names=r.stars.filter(n=>PRINCIPAL_STARS.includes(n));const star=(name:string)=>({name,scope:'origin',type:'major',brightness:'',mutagen:''}) as any;
 p.majorStars=names.map(star);s.chart.palaces.find(q=>q!==p)!.majorStars=PRINCIPAL_STARS.filter(n=>!names.includes(n)).map(star);
 for(const n of r.stars.filter(n=>!names.includes(n))){if(n.startsWith('Hóa ')){p.minorStars.push({...star('Văn Khúc'),mutagen:n.slice(4)});}else if(r.mode==='ring'){(p as any).changsheng12=n;}else p.minorStars.push(star(n));}
 if(['Thái Tuế','Phục Binh'].includes(r.stars[0])){const field=r.stars[0]==='Thái Tuế'?'suiqian12':'boshi12';const q=s.chart.palaces.find(q=>(q as any)[field]===r.stars[0])!;[(p as any)[field],(q as any)[field]]=[(q as any)[field],(p as any)[field]];}
 return s;
}

for(const r of approvedKinBranches){
 const rule=approvedKinRules.find(q=>q.id==='tanbien.'+kinKey(r))!;
 it(r.id+' uses certified natal position, excludes wrong palace, annual stars and missing data',()=>{
  const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>p.name==='Mệnh')!;
  expect(kinAssessment(s,r).value).toBe(true);expect(executeRules(s,[rule],'internal-draft').previewClaims).toHaveLength(1);
  for(const field of ['majorStars','minorStars','adjectiveStars']as const)[p[field],q[field]]=[q[field],p[field]];
  expect(kinAssessment(s,r).value).not.toBe(true);
  const t=fixture(r);t.chart.palaces.find(p=>p.name===r.palace)!.majorStars.forEach(st=>(st as any).scope='year');t.chart.palaces.find(p=>p.name===r.palace)!.minorStars.forEach(st=>(st as any).scope='year');expect(kinAssessment(t,r).value).not.toBe(true);
  delete (t.chart.tanBien as any).completeness;expect(kinAssessment(t,r).value).toBeUndefined();
 });
 it(r.id+' keeps source limits in customer text, serialized state and G2',()=>{
  const s=fixture(r),reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),report=buildCustomerReport(s,continuous,RULESET_VERSION),para=report.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(q=>q.id===rule.id)))!;
  expect(para).toBeDefined();expect(para.review).toBe('editorial-checked');expect(para.text).toContain(r.condition??(r.id.startsWith('khoa')?'thông minh':r.id.startsWith('quyen')?'sớm hiển đạt':'khéo tay'));
  if(r.condition){expect(para.conditionalAssessment).toEqual([{condition:r.condition,status:'unknown',outcomeApplied:false}]);expect(para.text).toContain('chưa');expect(para.title).toContain('chưa xác định');expect(rule.presentation!.applicability).toContain('không xác nhận');}else expect(para.conditionalAssessment).toBeUndefined();
  const record:any={snapshot:s,frozen:{customerReport:report,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(JSON.stringify(projectReading(record))).not.toContain(para.text);expect(record.accessPolicy.freeParagraphIds).not.toContain(para.id);
  expect(JSON.parse(JSON.stringify(report)).sections.flatMap((x:any)=>x.paragraphs).find((x:any)=>x.id===para.id)).toEqual(para);
 });
 if(r.branches.length)it(r.id+' rejects other branches and extra/missing required majors',()=>{
  const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>!r.branches.includes(p.earthlyBranch))!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];expect(kinAssessment(s,r).value).toBe(false);
  const t=fixture(r),a=t.chart.palaces.find(p=>p.name===r.palace)!,b=t.chart.palaces.find(p=>p!==a&&p.majorStars.length)!;a.majorStars.push(b.majorStars.pop()!);expect(kinAssessment(t,r).value).toBe(false);
 });
}
it('Hóa Khoa rejects a contradictory transformation certificate',()=>{const r=approvedKinBranches[2],s=fixture(r);s.chart.natalTransformations=structuredClone(base.chart.natalTransformations);expect(kinAssessment(s,r).value).toBeUndefined();});
