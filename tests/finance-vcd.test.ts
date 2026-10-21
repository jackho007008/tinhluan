import {factEvidence} from '../lib/internal-review/tanbien-presentation';
import {it,expect,vi} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {financeVcdAssessment,financeVcdRules,FINANCE_VCD_ID,FINANCE_VCD_TEXT} from '../lib/interpretation-rules/finance-vcd';
import * as source from '../lib/tuvi-engine/tanbien';
import {executeRules} from '../lib/interpretation-rules/execute';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
// Synthetic geometry for condition boundaries; engine witnesses are compared separately.
function fixture(){
 const s=structuredClone(base),ps=s.chart.palaces,p=ps.find(p=>p.name==='Tài Bạch')!,q=ps.find(p=>p.earthlyBranch==='Sửu')!;
 [p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];
 const stars=ps.flatMap(p=>p.majorStars);for(const p of ps)p.majorStars=[];
 ps.find(p=>p.earthlyBranch==='Ngọ')!.majorStars=stars.filter(st=>st.name==='Thái Âm');
 ps.find(p=>p.earthlyBranch==='Tỵ')!.majorStars=stars.filter(st=>st.name==='Thái Dương');
 ps.find(p=>p.earthlyBranch==='Mão')!.majorStars=stars.filter(st=>!['Thái Âm','Thái Dương'].includes(st.name));
 s.chart.tanBien!.voidRanges=[{name:'Tuần Không',source:'technical fixture',branches:['Tý','Sửu']},{name:'Triệt Lộ',source:'technical fixture',branches:['Thìn','Tỵ']}];return s;
}
function move(s:typeof base,name:string,chi:string){let st:any;for(const p of s.chart.palaces){const i=p.majorStars.findIndex(st=>st.name===name);if(i>=0)st=p.majorStars.splice(i,1)[0];}s.chart.palaces.find(p=>p.earthlyBranch===chi)!.majorStars.push(st);}
it.each(['Tuần','Triệt','both'])('direct %s uses the complete sequence, no mutation or age trigger',kind=>{
 const s=fixture();if(kind==='Triệt')s.chart.tanBien!.voidRanges.reverse().forEach((v,i)=>v.name=i===0?'Tuần Không':'Triệt Lộ');if(kind==='both')s.chart.tanBien!.voidRanges[1].branches=['Sửu','Dần'];
 const before=JSON.stringify(s);expect(financeVcdAssessment(s).value).toBe(true);expect(executeRules(s,financeVcdRules,'internal-draft').previewClaims[0].text).toBe(FINANCE_VCD_TEXT);expect(JSON.stringify(s)).toBe(before);
 s.normalized.gender='female';s.normalized.date='2008-01-01';s.chart.palaces.forEach(p=>p.majorStars.forEach(st=>st.brightness='Miếu'));expect(financeVcdAssessment(s).value).toBe(true);
});
it('requires the target really empty; no substitute palace or opposite void',()=>{
 const s=fixture();move(s,'Tử Vi','Sửu');expect(financeVcdAssessment(s).value).toBe(false);
 const t=fixture();t.chart.tanBien!.voidRanges=[{name:'Tuần Không',source:'technical fixture',branches:['Ngọ','Mùi']},{name:'Triệt Lộ',source:'technical fixture',branches:['Thìn','Tỵ']}];expect(financeVcdAssessment(t).value).toBe(false);
});
it.each(['Tý','Hợi','Dậu'])('both-bright exception stays outside even for Moon %s, without interpreting the typo',chi=>{
 const s=fixture();move(s,'Thái Âm',chi);const a=financeVcdAssessment(s);expect(a.value).toBeUndefined();expect(a.cause).toBe('outside-subset');expect(executeRules(s,financeVcdRules,'internal-draft').previewClaims).toHaveLength(0);
});
it('states remain at the real positions, not the empty receiving branch',()=>{
 const s=fixture();move(s,'Thái Dương','Hợi');move(s,'Thái Âm','Dậu');expect(financeVcdAssessment(s).value).toBe(true);expect(financeVcdAssessment(s).text).toContain('Hợi: Hãm');
});
it.each(['completeness','duplicate','annual','void-missing','void-duplicate','void-nonadjacent','void-single'])('missing or malformed proof %s stays unknown',kind=>{
 const s=fixture();if(kind==='completeness')delete(s.chart.tanBien as any).completeness;
 if(kind==='duplicate')s.chart.palaces.find(p=>p.earthlyBranch==='Mão')!.majorStars.push({...s.chart.palaces.find(p=>p.earthlyBranch==='Ngọ')!.majorStars[0]});
 if(kind==='annual')(s.chart.palaces.find(p=>p.earthlyBranch==='Ngọ')!.majorStars[0] as any).scope='year';
 if(kind==='void-missing')delete(s.chart.tanBien as any).voidRanges;
 if(kind==='void-duplicate')s.chart.tanBien!.voidRanges[1].name='Tuần Không';
 if(kind==='void-nonadjacent')s.chart.tanBien!.voidRanges[0].branches=['Sửu','Hợi'];
 if(kind==='void-single')s.chart.tanBien!.voidRanges.pop();
 expect(financeVcdAssessment(s).value).toBeUndefined();expect(financeVcdAssessment(s).cause).toBe('missing-data');
});
it('a missing source table cell is unknown, not filled by engine brightness',()=>{
 const spy=vi.spyOn(source,'bookState').mockReturnValue({value:undefined} as any);try{expect(financeVcdAssessment(fixture()).cause).toBe('missing-data');}finally{spy.mockRestore();}
});
it('the whole narrative and evidence reach the common customer pipeline but stay locked by G2',()=>{
 const s=fixture(),reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),report=buildCustomerReport(s,continuous,RULESET_VERSION),p=report.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===FINANCE_VCD_ID)))!;
 expect(JSON.stringify(factEvidence(s,'fact.finance-vcd-direct-void'))).toContain('Tài Bạch Sửu');expect(JSON.stringify(factEvidence(s,'fact.finance-vcd-direct-void'))).not.toContain('chưa có ánh xạ');expect(p.text).toBe(FINANCE_VCD_TEXT);expect(p.review).toBe('editorial-checked');expect(p.title).toBe('Tiền bạc');expect(report.sections.find(s=>s.paragraphs.includes(p))!.id).toBe('assets');
 const record:any={snapshot:s,frozen:{customerReport:report,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(JSON.stringify(projectReading(record))).not.toContain(p.text);
 expect(FINANCE_VCD_TEXT).toContain('Nhật–Nguyệt không cùng');expect(FINANCE_VCD_TEXT).toContain('khó khăn lúc đầu, về sau dễ dàng hơn, càng về già càng sung túc');expect(financeVcdRules[0].review).toBeNull();
});
