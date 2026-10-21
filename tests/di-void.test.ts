import {it,expect} from 'vitest';
import fs from 'node:fs';
import {diVoidAssessment,diVoidRules,DI_VOID_ID,DI_VOID_TEXT} from '../lib/interpretation-rules/di-void';
import {executeRules} from '../lib/interpretation-rules/execute';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import {factEvidence} from '../lib/internal-review/tanbien-presentation';
const saved=(i:number)=>JSON.parse(fs.readFileSync(`.local/finance-vcd-20261021/after/${i}.json`,'utf8')).snapshot;
const base=saved(139);
it('real engine139 has a direct receiving-palace clause; original pair baseline stays absent',()=>{
 const before=JSON.stringify(base),a=diVoidAssessment(base);expect(a.value).toBe(true);expect(a.text).toContain('Thiên Di tại Tý');const claims=executeRules(base,diVoidRules,'internal-draft').previewClaims;expect(claims).toHaveLength(1);expect(claims[0].text).toBe(DI_VOID_TEXT);expect(JSON.stringify(base)).toBe(before);expect(DI_VOID_TEXT).not.toMatch(/phát tài|rất bất lợi|quý nhân/);
});
it.each([34,127])('real engine%s: donor TT is not recipient TT',i=>expect(diVoidAssessment(saved(i)).value).toBe(false));
it.each(['Tuần Không','Triệt Lộ','both'])('technical receiving %s never cancels or doubles the clause',kind=>{
 const s=structuredClone(base),v=s.chart.tanBien.voidRanges;v[0].branches=kind==='Triệt Lộ'?['Thân','Dậu']:['Tý','Sửu'];v[1].branches=kind==='Tuần Không'?['Thìn','Tỵ']:['Tý','Sửu'];expect(diVoidAssessment(s).value).toBe(true);expect(executeRules(s,diVoidRules,'internal-draft').previewClaims).toHaveLength(1);
});
it('TT at both donor and recipient does not erase the independent receiving clause',()=>{
 const s=structuredClone(base);s.chart.tanBien.voidRanges=[{name:'Tuần Không',branches:['Ngọ','Mùi'],source:'technical fixture'},{name:'Triệt Lộ',branches:['Tý','Sửu'],source:'technical fixture'}];expect(diVoidAssessment(s).value).toBe(true);
});
it.each(['ty','ngo'])('actual no-TT engine witness %s does not get a TT clause',suffix=>{
 const s=JSON.parse(fs.readFileSync(`.local/dong-am-di-20261021/witness-${suffix}.json`,'utf8'));expect(diVoidAssessment(s).value).toBe(false);
});
it.each(['missing-completeness','duplicate','annual','missing-void','bad-void','duplicate-void','broken-opposition','missing-major-list'])('technical proof %s never becomes a known absence',kind=>{
 const s=structuredClone(base),ps=s.chart.palaces,d=ps.find((p:any)=>p.name==='Mệnh'),t=ps.find((p:any)=>p.name==='Thiên Di');
 if(kind==='missing-completeness')delete s.chart.tanBien.completeness;
 if(kind==='duplicate')d.majorStars.push({...d.majorStars[0]});
 if(kind==='annual')d.majorStars[0].scope='year';
 if(kind==='missing-void')delete s.chart.tanBien.voidRanges;
 if(kind==='bad-void')s.chart.tanBien.voidRanges[0].branches=['Tý','Ngọ'];
 if(kind==='duplicate-void')s.chart.tanBien.voidRanges[0].name='Triệt Lộ';
 if(kind==='broken-opposition'){const p=ps.find((p:any)=>p.name==='Phụ Mẫu');[t.earthlyBranch,p.earthlyBranch]=[p.earthlyBranch,t.earthlyBranch];}
 if(kind==='missing-major-list')delete d.majorStars;
 expect(diVoidAssessment(s).value).toBeUndefined();
});
it('principal pair or occupied Di never restricts the general source clause',()=>{
 const s=structuredClone(base),d=s.chart.palaces.find((p:any)=>p.name==='Mệnh'),q=s.chart.palaces.find((p:any)=>p.majorStars.some((st:any)=>st.name==='Tử Vi')),j=q.majorStars.findIndex((st:any)=>st.name==='Tử Vi');[d.majorStars[0],q.majorStars[j]]=[q.majorStars[j],d.majorStars[0]];expect(diVoidAssessment(s).value).toBe(true);
 const t=structuredClone(base),life=t.chart.palaces.find((p:any)=>p.name==='Mệnh'),di=t.chart.palaces.find((p:any)=>p.name==='Thiên Di');[life.majorStars,di.majorStars]=[di.majorStars,life.majorStars];expect(diVoidAssessment(t).value).toBe(true);
});
it('the explicit TT clause has no borrowed brightness, auxiliary-absence, age or gender gate',()=>{
 const s=structuredClone(base),d=s.chart.palaces.find((p:any)=>p.name==='Mệnh');d.majorStars.forEach((st:any)=>st.brightness='Miếu');s.normalized.gender='male';s.normalized.date='1978-01-01';delete s.chart.natalTransformations;delete s.chart.tanBien.completeness.minorStars;expect(diVoidAssessment(s).value).toBe(true);
});
it('whole source claim and specific evidence reach the common renderer; G2 keeps them locked',()=>{
 const s=base,reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),report=buildCustomerReport(s,continuous,RULESET_VERSION),p=report.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===DI_VOID_ID)))!;expect(p.text).toBe(DI_VOID_TEXT);expect(p.review).toBe('editorial-checked');expect(report.sections.find(s=>s.paragraphs.includes(p))!.palaces).toContain('Thiên Di');
 const e=JSON.stringify(factEvidence(s,'fact.di-direct-void'));expect(e).toContain('Triệt Lộ');expect(e).not.toContain('chưa có ánh xạ');const record:any={snapshot:s,frozen:{customerReport:report,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(JSON.stringify(projectReading(record))).not.toContain(p.text);expect(diVoidRules[0].review).toBeNull();
});
it('technical opposite direction: actual pair branch Ty, empty Di Ngo, direct recipient void',()=>{
 const s=structuredClone(base),d=s.chart.palaces.find((p:any)=>p.name==='Mệnh'),t=s.chart.palaces.find((p:any)=>p.name==='Thiên Di');[d.earthlyBranch,t.earthlyBranch]=[t.earthlyBranch,d.earthlyBranch];s.chart.tanBien.voidRanges=[{name:'Tuần Không',branches:['Tuất','Hợi'],source:'technical fixture'},{name:'Triệt Lộ',branches:['Ngọ','Mùi'],source:'technical fixture'}];expect(diVoidAssessment(s).value).toBe(true);expect(diVoidAssessment(s).text).toContain('Thiên Di tại Ngọ');expect(executeRules(s,diVoidRules,'internal-draft').previewClaims).toHaveLength(1);
});
it.each([12,32,63,87,139,159,169])('real engine%s: one generic TT claim, no retired pair rule, preserve other claims',i=>{
 const s=saved(i),r=buildTanBienReading(s),claims=r.execution.previewClaims;
 expect(claims.filter(c=>c.rules.some(r=>r.id===DI_VOID_ID))).toHaveLength(1);
 expect(claims.some(c=>c.rules.some(r=>r.id==='tanbien.di-dong-am-receiver-void'))).toBe(false);
 expect(claims.some(c=>c.rules.some(r=>r.id==='tanbien.di-ma'))).toBe(false);
 if(i===32)expect(claims.some(c=>c.rules.some(r=>r.id==='tanbien.di-hoa-ky'))).toBe(true);
 if(i===63)expect(claims.some(c=>c.rules.some(r=>r.id==='tanbien.di-vcd-nhat-nguyet-base'))).toBe(true);
 if(i===139)expect(claims.some(c=>c.rules.some(r=>['tanbien.di-dong-am-ty','tanbien.di-dong-am-ngo'].includes(r.id)))).toBe(false);
});
it('unsupported engine profile cannot publish the source clause',()=>{
 const s=structuredClone(base);s.profile.id='unverified-profile' as any;
 expect(executeRules(s,diVoidRules,'internal-draft').previewClaims).toHaveLength(0);
});
