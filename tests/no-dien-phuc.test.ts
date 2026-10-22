import {it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {certifyNatalTransformations} from '../lib/tuvi-engine/natal-transformations';
import {PRINCIPAL_STARS,CHART_BRANCHES} from '../lib/tuvi-engine/chart-integrity';
import {kinAssessment,kinKey,type KinBranch} from '../lib/interpretation-rules/phu-tu';
import {localPalaceBranches,localPalaceRules,localPalaceAssessment,type LocalPalaceBranch} from '../lib/interpretation-rules/no-dien-phuc';
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


function localFixture(r:LocalPalaceBranch,alternate=false){const stars=r.groups.map(g=>g[alternate?g.length-1:0]);const s=fixture({id:r.id,palace:r.palace,stars,branches:r.branches.length?r.branches:[r.state?'Thìn':'Dần'],mode:r.mode==='empty'?'exact':r.mode,page:r.page,section:r.section,text:r.text,gender:null,limit:'',excerpt:'',stateMethod:'none'});if(r.absent?.includes('Hóa Kỵ')||r.coveredBy?.includes('phuc-cu-ky-relation')){const trace=s.chart.tanBien!.trace.find(t=>t.id==='mutagens')!;for(const [i,name] of (trace.result as string[]).entries()){let st=s.chart.palaces.flatMap(p=>[...p.majorStars,...p.minorStars]).find(st=>st.name===name);if(!st){st={name,scope:'origin',mutagen:'',type:'soft',brightness:''}as any;s.chart.palaces.find(p=>p.name!==r.palace)!.minorStars.push(st!);}st!.mutagen=['Lộc','Quyền','Khoa','Kỵ'][i];}s.chart.natalTransformations=certifyNatalTransformations(s.chart);}s.chart.tanBien!.voidRanges=[{name:'Tuần Không',branches:['Tuất','Hợi']},{name:'Triệt Lộ',branches:['Tý','Sửu']}]as any;if(r.mode==='exact'){const j=CHART_BRANCHES.indexOf(s.chart.palaces.find(p=>p.name===r.palace)!.earthlyBranch);s.chart.tanBien!.voidRanges[0].branches=[CHART_BRANCHES[(j+2)%12],CHART_BRANCHES[(j+3)%12]];s.chart.tanBien!.voidRanges[1].branches=[CHART_BRANCHES[(j+4)%12],CHART_BRANCHES[(j+5)%12]];}return s;}
for(const r of localPalaceBranches){const rule=localPalaceRules.find(q=>q.id==='tanbien.'+r.id)!;
 it(r.id+' source structure matches without engine mutation',()=>{for(const alternate of [false,true]){const s=localFixture(r,alternate),before=JSON.stringify(s);expect(localPalaceAssessment(s,r).value).toBe(true);expect(executeRules(s,[rule],'internal-draft').previewClaims).toHaveLength(1);expect(JSON.stringify(s)).toBe(before);}});
 it(r.id+' rejects missing/annual evidence, wrong palace and direct void; other-palace void does not block',()=>{
  const s=localFixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>p.name==='Mệnh')!;
  if(r.mode==='empty'){q.majorStars.push(s.chart.palaces.flatMap(p=>p.majorStars)[0]);s.chart.palaces.find(p=>p!==q&&p.majorStars.length)!.majorStars.shift();}for(const field of ['majorStars','minorStars','adjectiveStars']as const)[p[field],q[field]]=[q[field],p[field]];expect(localPalaceAssessment(s,r).value).not.toBe(true);
  const t=localFixture(r);t.chart.tanBien!.voidRanges[0].branches=[t.chart.palaces.find(p=>p.name===r.palace)!.earthlyBranch,CHART_BRANCHES[(CHART_BRANCHES.indexOf(t.chart.palaces.find(p=>p.name===r.palace)!.earthlyBranch)+1)%12]];if(r.id==='dien-vcd-inheritance')expect(localPalaceAssessment(t,r).value).toBe(true);else expect(localPalaceAssessment(t,r).cause).toBe('unresolved-adjustment');
  const u=localFixture(r);for(const p of u.chart.palaces)for(const st of [...p.majorStars,...p.minorStars,...p.adjectiveStars])(st as any).scope='year';expect(localPalaceAssessment(u,r).value).not.toBe(true);
  delete(u.chart.tanBien as any).completeness;expect(localPalaceAssessment(u,r).value).toBeUndefined();
 });
 it(r.id+' retains verified customer prose and paid scope',()=>{
  const s=localFixture(r),reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),report=buildCustomerReport(s,continuous,RULESET_VERSION),para=report.sections.flatMap(x=>x.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(q=>q.id===rule.id)))!;expect(para).toBeDefined();expect(para.review).toBe('editorial-checked');expect(para.text).toContain(r.text);expect(para.conditionalAssessment).toBeUndefined();const record:any={snapshot:s,frozen:{customerReport:report,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(JSON.stringify(projectReading(record))).not.toContain(para.text);
 });
 if(r.branches.length)it(r.id+' wrong branch is false',()=>{const s=localFixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>!r.branches.includes(p.earthlyBranch))!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];expect(localPalaceAssessment(s,r).value).toBe(false);});
 for(const star of r.absent??[])it(r.id+' absence gate for '+star+' never invents an exception trigger',()=>{const s=localFixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;delete s.chart.natalTransformations;p.minorStars.push({name:star.startsWith('Hóa ')?'Văn Xương':star,scope:'origin',mutagen:star.startsWith('Hóa ')?star.slice(4):'',brightness:'',type:'soft'}as any);expect(localPalaceAssessment(s,r).cause).toBe('unresolved-adjustment');p.minorStars.pop();delete(s.chart.tanBien!.completeness as any).minorStars;expect(localPalaceAssessment(s,r).value).toBeUndefined();});
}
it('Kình uses printed Đắc cells only, never engine brightness or unprinted Hãm',()=>{const r=localPalaceBranches.find(r=>r.state)!,s=localFixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>p.earthlyBranch==='Mão')!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];p.minorStars[0].brightness='Miếu';expect(localPalaceAssessment(s,r).value).toBeUndefined();});
it('exact source conjunction: Ky plus only one of Không/Kiếp does not match',()=>{const r=localPalaceBranches.find(r=>r.id==='phuc-ky-khong-kiep-relation')!,s=localFixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;p.minorStars=p.minorStars.filter(st=>st.name!=='Địa Kiếp');expect(localPalaceAssessment(s,r).value).toBe(false);});
it('VCD inheritance never borrows opposite stars or predicts property size; source Sun means occupancy',()=>{const r=localPalaceBranches[0];expect(r.text).toContain('chưa xác định quy mô');const sun=localPalaceBranches.find(r=>r.id==='phuc-sun-high-local')!,s=localFixture(sun),p=s.chart.palaces.find(p=>p.name==='Phúc Đức')!,q=s.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Cự Môn'))!;p.majorStars.push(q.majorStars.find(st=>st.name==='Cự Môn')!);q.majorStars=q.majorStars.filter(st=>st.name!=='Cự Môn');s.chart.natalTransformations=certifyNatalTransformations(s.chart);expect(localPalaceAssessment(s,sun).value).toBe(true);});
it('Tang Môn requires the saved complete natal Thái Tuế cycle, not a fabricated minor/annual star',()=>{const r=localPalaceBranches.find(r=>r.id==='phuc-fire-tang-relation')!,s=localFixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;delete(p as any).suiqian12;p.minorStars.push({name:'Tang Môn',scope:'origin',type:'soft',mutagen:'',brightness:''}as any);expect(localPalaceAssessment(s,r).value).toBeUndefined();});
