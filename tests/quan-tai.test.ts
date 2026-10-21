import {it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {PRINCIPAL_STARS} from '../lib/tuvi-engine/chart-integrity';
import type {KinBranch} from '../lib/interpretation-rules/phu-tu';
import {quanTaiBranches,quanTaiRules,quanTaiAssessment} from '../lib/interpretation-rules/quan-tai';
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
 if(r.stars.includes('Tang Môn')){const q=s.chart.palaces.find(q=>(q as any).suiqian12==='Tang Môn')!;[(p as any).suiqian12,(q as any).suiqian12]=[(q as any).suiqian12,(p as any).suiqian12];p.minorStars=p.minorStars.filter(st=>st.name!=='Tang Môn');}
 if(['Thái Tuế','Phục Binh'].includes(r.stars[0])){const field=['Thái Tuế','Tang Môn'].includes(r.stars[0])?'suiqian12':'boshi12';const q=s.chart.palaces.find(q=>(q as any)[field]===r.stars[0])!;[(p as any)[field],(q as any)[field]]=[(q as any)[field],(p as any)[field]];}
 return s;
}
for(const r of quanTaiBranches){const rule=quanTaiRules.find(q=>q.id==='tanbien.'+r.id)!;
 it(r.id+' full source sequence without mutating engine output',()=>{const s=fixture(r),before=JSON.stringify(s);expect(quanTaiAssessment(s,r).value).toBe(true);expect(executeRules(s,[rule],'internal-draft').previewClaims).toHaveLength(1);expect(JSON.stringify(s)).toBe(before);});
 it(r.id+' requires each natal star at the right palace',()=>{for(const star of r.stars){const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>p!==s.chart.palaces.find(p=>p.name===r.palace))!;const st=p.majorStars.find(st=>st.name===star)!;p.majorStars=p.majorStars.filter(x=>x!==st);q.majorStars.push(st);expect(quanTaiAssessment(s,r).value).toBe(false);}});
 it(r.id+' does not use unknown or annual evidence',()=>{const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;(p.majorStars[0] as any).scope='year';expect(quanTaiAssessment(s,r).value).toBeUndefined();const t=fixture(r);delete(t.chart.tanBien as any).completeness;expect(quanTaiAssessment(t,r).value).toBeUndefined();});
 it(r.id+' never selects an achieved outcome from age, gender or viewing year',()=>{for(const date of ['1978-01-01','2008-01-01','2013-01-01']){const s=fixture(r);s.normalized.date=date;s.normalized.gender='female';(s.normalized as any).viewYear=2099;const claims=executeRules(s,[rule],'internal-draft').previewClaims;expect(claims).toHaveLength(1);expect(claims[0].text).toBe(r.text);}});
 it(r.id+' retains complete narrative through ND03 and G2',()=>{const s=fixture(r),reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),report=buildCustomerReport(s,continuous,RULESET_VERSION),p=report.sections.flatMap(x=>x.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(q=>q.id===rule.id)))!;expect(p.text).toBe(r.text);expect(p.review).toBe('editorial-checked');const record:any={snapshot:s,frozen:{customerReport:report,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(JSON.stringify(projectReading(record))).not.toContain(p.text);if(r.palace==='Quan Lộc')expect(report.sections.find(s=>s.paragraphs.includes(p))!.id).toBe('natal-palace-4');else {expect(report.sections.find(s=>s.paragraphs.includes(p))!.id).toBe('assets');expect(p.title).toBe('Tiền bạc');}});
 it(r.id+' does not add brightness or blanket void restrictions absent from the source clause',()=>{const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;p.majorStars.forEach(st=>st.brightness='');s.chart.tanBien!.voidRanges[0].branches=[p.earthlyBranch,'Mão'];expect(quanTaiAssessment(s,r).value).toBe(true);});
}
it('Sun–Cu at Than does not leak into Dan, source uncertainty or VCD borrowing',()=>{const r=quanTaiBranches[1],s=fixture(r),p=s.chart.palaces.find(p=>p.name==='Quan Lộc')!,q=s.chart.palaces.find(p=>p.earthlyBranch==='Dần')!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];expect(quanTaiAssessment(s,r).value).toBe(false);});
it('source age phrases remain distinct and cannot be shortened into a present result',()=>{expect(quanTaiBranches[0].text).toContain('từ 30 tuổi trở đi mới');expect(quanTaiBranches[0].text).toContain('Nếu có danh chức');expect(quanTaiBranches[1].text).toContain('về già mới');expect(quanTaiBranches[2].text).toContain('từ ngoài 30 trở đi, mới giàu');expect(quanTaiBranches[2].text).toContain('không suy ngược');});
