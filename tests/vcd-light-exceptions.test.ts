import {it,expect}from'vitest';
import{calculate}from'../lib/tuvi-engine';
import{certifyNatalTransformations}from'../lib/tuvi-engine/natal-transformations';
import{VCD_LIGHT_BRANCHES,vcdLightAssessment,vcdLightRules,vcdLightId}from'../lib/interpretation-rules/vcd-light-exceptions';
import{buildTanBienReading}from'../lib/internal-review/tanbien-reading';
import{buildContinuousReport}from'../lib/internal-review/continuous-report';
import{buildCustomerReport}from'../lib/internal-review/customer-report';
import{captureReadingPolicy,projectReading}from'../lib/trial/reading-policy';
import{RULESET_VERSION}from'../lib/interpretation-rules/catalog';
import{factEvidence}from'../lib/internal-review/tanbien-presentation';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
const branch=(key:string)=>VCD_LIGHT_BRANCHES.find(r=>r.key===key)!;
// Deliberately synthetic boundary geometry; no claim of engine reachability.
function fixture(key:string){
 const s=structuredClone(base),r=branch(key),ps=s.chart.palaces;
 const cfg=key==='career-bright'?['Mùi','Sửu','Sửu','Tý']:key==='career-scale'?['Mùi','Dần','Tý','Mão']:key==='finance-direct'?['Ngọ','Dần','Tý','Mão']:['Dậu','Mão','Hợi','Sửu'];
 const[target,sun,moon,safe]=cfg;
 const setName=(chi:string,name:string)=>{const p=ps.find(p=>p.earthlyBranch===chi)!,q=ps.find(p=>p.name===name)!;[p.name,q.name]=[q.name,p.name];};
 setName(target,r.palace);if(key==='career-bright')setName(sun,'Phu Thê');
 const all=ps.flatMap(p=>(['majorStars','minorStars','adjectiveStars']as const).flatMap(f=>p[f].map(st=>({f,st}))));
 for(const p of ps){p.majorStars=[];p.minorStars=[];p.adjectiveStars=[];p.isBodyPalace=false;}
 for(const{f,st}of all)ps.find(p=>p.earthlyBranch===(st.name==='Thái Dương'?sun:st.name==='Thái Âm'?moon:safe))![f].push(st);
 s.chart.tanBien!.voidRanges=key==='career-bright'?[{name:'Tuần Không',branches:['Tý','Sửu'],source:'technical fixture'},{name:'Triệt Lộ',branches:['Tý','Sửu'],source:'technical fixture'}]:key==='finance-scale'?[{name:'Tuần Không',branches:['Hợi','Tý'],source:'technical fixture'},{name:'Triệt Lộ',branches:['Tý','Sửu'],source:'technical fixture'}]:[{name:'Tuần Không',branches:['Ngọ','Mùi'],source:'technical fixture'},{name:'Triệt Lộ',branches:['Tý','Sửu'],source:'technical fixture'}];
 if(key==='career-scale')s.chart.tanBien!.voidRanges[0].branches=['Thân','Dậu'];
 s.chart.natalTransformations=certifyNatalTransformations(s.chart);return s;
}
it.each(VCD_LIGHT_BRANCHES.map(r=>r.key))('%s has a complete positive condition proof without snapshot mutation',key=>{
 const s=fixture(key),before=JSON.stringify(s),a=vcdLightAssessment(s,branch(key));expect(a.value,a.text).toBe(true);expect(JSON.stringify(s)).toBe(before);
});
it('Quan absence of one required beam rules out its exception independently of brightness or other stars',()=>{
 const s=fixture('career-scale');delete(s.chart as any).natalTransformations;delete(s.chart.tanBien as any).completeness.minorStars;
 expect(vcdLightAssessment(s,branch('career-scale')).value).toBe(true);
 // Move Moon from Tý to Mão: both now chiếu Mùi, so position alone cannot release the clause.
 const p=s.chart.palaces.find(p=>p.earthlyBranch==='Tý')!,q=s.chart.palaces.find(p=>p.earthlyBranch==='Mão')!;q.majorStars.push(...p.majorStars);p.majorStars=[];
 expect(vcdLightAssessment(s,branch('career-scale')).value).not.toBe(true);
});
it('the same absence of beams does not silently repair the money phrase hợp chiến',()=>{
 const s=fixture('career-scale'),p=s.chart.palaces.find(p=>p.name==='Quan Lộc')!,q=s.chart.palaces.find(p=>p.name==='Tài Bạch')!;[p.name,q.name]=[q.name,p.name];s.chart.tanBien!.voidRanges[1].branches=['Thìn','Tỵ'];
 expect(vcdLightAssessment(s,branch('finance-scale')).value).toBeUndefined();
});
it.each(['finance-scale','finance-direct'])('%s uses TT at the light itself and preserves counteracting-light exceptions',key=>{
 const s=fixture(key),r=branch(key);expect(vcdLightAssessment(s,r).value).toBe(true);
 const moon=s.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Thái Âm'))!;
 moon.adjectiveStars.push({name:'Thiên Tài',scope:'origin',type:'soft',brightness:''}as any);
 expect(vcdLightAssessment(s,r).value).toBeUndefined();moon.adjectiveStars.pop();
 moon.adjectiveStars.push({name:'Hồng Loan',scope:'origin',type:'soft',brightness:''}as any);
 expect(vcdLightAssessment(s,r).value).toBeUndefined();
});
it('TT at the receiver is not a beam that darkens a light elsewhere',()=>{
 const s=fixture('finance-direct');s.chart.tanBien!.voidRanges[1].branches=['Mão','Thìn'];
 expect(vcdLightAssessment(s,branch('finance-direct')).value).toBeUndefined();
});
it.each(['one-TT','dimmer','body','no-target-beam','no-certificate'])('the bounded bright exception holds %s',kind=>{
 const s=fixture('career-bright'),r=branch('career-bright'),p=s.chart.palaces.find(p=>p.earthlyBranch==='Sửu')!;
 if(kind==='one-TT')s.chart.tanBien!.voidRanges[1].branches=['Dần','Mão'];
 if(kind==='dimmer')p.minorStars.push({name:'Đà La',scope:'origin',type:'tough',brightness:''}as any);
 if(kind==='body')p.isBodyPalace=true;
 if(kind==='no-target-beam'){const a=s.chart.palaces.find(p=>p.name==='Quan Lộc')!,b=s.chart.palaces.find(p=>p.earthlyBranch==='Dần')!;[a.name,b.name]=[b.name,a.name];}
 if(kind==='no-certificate')delete(s.chart as any).natalTransformations;
 expect(vcdLightAssessment(s,r).value).not.toBe(true);
});
it.each(['incomplete','duplicate','bad-TT','annual','missing-minors'])('malformed %s cannot assert the brightness subset',kind=>{
 const s=fixture('finance-direct');
 if(kind==='incomplete')delete(s.chart.tanBien as any).completeness.majorStars;
 if(kind==='duplicate')s.chart.palaces[0].majorStars.push({...s.chart.palaces.find(p=>p.majorStars.length)!.majorStars[0]});
 if(kind==='bad-TT')s.chart.tanBien!.voidRanges[0].branches=['Ngọ','Tuất'];
 if(kind==='annual')(s.chart.palaces.find(p=>p.majorStars.length)!.majorStars[0]as any).scope='annual';
 if(kind==='missing-minors')delete(s.chart.tanBien as any).completeness.minorStars;
 expect(vcdLightAssessment(s,branch('finance-direct')).value).toBeUndefined();
});
it.each(VCD_LIGHT_BRANCHES.map(r=>r.key))('%s reaches the common customer path once and stays locked by G2',key=>{
 const s=fixture(key),r=branch(key),reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),report=buildCustomerReport(s,continuous,RULESET_VERSION);
 const claims=reading.execution.previewClaims.filter(c=>c.rules.some(q=>q.id===vcdLightId(r)));expect(claims).toHaveLength(1);
 const paragraphs=report.sections.flatMap(s=>s.paragraphs).filter(p=>p.members.some(m=>m.claim.rules.some(q=>q.id===vcdLightId(r))));expect(paragraphs).toHaveLength(1);expect(paragraphs[0].review).toBe('editorial-checked');expect(paragraphs[0].text).toBe(r.text);
 const record:any={snapshot:s,frozen:{customerReport:report,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);expect(JSON.stringify(projectReading(record))).not.toContain(r.text);
 expect(JSON.stringify(factEvidence(s,'fact.vcd-light-'+key))).not.toContain('chưa có ánh xạ');
 const sameFacet=reading.execution.previewClaims.filter(c=>c.rules.some(q=>q.id===vcdLightId(r)||q.id===(r.palace==='Quan Lộc'?'tanbien.career-vcd-scale-limit':r.mode==='direct'?'tanbien.finance-vcd-direct-void':'tanbien.finance-vcd-scale-limit')));expect(sameFacet).toHaveLength(1);
});
it('existing VCD claims suppress only the matching fallback, not unrelated content',()=>{
 const s=fixture('finance-direct'),moon=s.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Thái Âm'))!,other=s.chart.palaces.find(p=>p.earthlyBranch==='Dần')!;
 const star=moon.majorStars.splice(moon.majorStars.findIndex(st=>st.name==='Thái Âm'),1)[0];other.majorStars.push(star);s.chart.natalTransformations=certifyNatalTransformations(s.chart);
 const a=vcdLightAssessment(s,branch('finance-direct'));expect(a.value).toBe(false);expect(a.text).toContain('không lặp');
});
