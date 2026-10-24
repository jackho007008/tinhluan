import {it,expect} from 'vitest';
import {calculate,type ChartSnapshot} from '../lib/tuvi-engine';
import {PRINCIPAL_STARS,CHART_BRANCHES} from '../lib/tuvi-engine/chart-integrity';
import {trungchauAssessment as assess,trungchauFacts,trungchauRules,trungchauFact,MOVE365,SPEND201,SPEECH484,MOVE_COPY,SPEND_COPY,SPEECH_COPY,FIRE_BELL_COPY} from '../lib/interpretation-rules/trungchau-natal';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import {executeRules} from '../lib/interpretation-rules/execute';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
const at=(s:ChartSnapshot,n:string)=>s.chart.palaces.find(p=>p.name===n)!;
type Key='move'|'spend'|'speech'|'guard';
const ids={move:MOVE365,spend:SPEND201,speech:SPEECH484};
// Structural fixtures, never described as engine witnesses. Whole-engine witnesses are compared separately in the saved192 audit.
function fixture(key:Key,branch='Sửu'){
 const s=structuredClone(base);delete s.chart.natalTransformations;
 const offset=(CHART_BRANCHES.indexOf(branch)-CHART_BRANCHES.indexOf(at(s,'Mệnh').earthlyBranch)+12)%12;
 s.chart.palaces.forEach(p=>p.earthlyBranch=CHART_BRANCHES[(CHART_BRANCHES.indexOf(p.earthlyBranch)+offset)%12]);
 if(key==='move'){
  s.chart.palaces.forEach(p=>p.majorStars=[]);
  const config=[['Mệnh',['Tử Vi','Phá Quân']],['Tài Bạch',['Vũ Khúc','Thất Sát']],['Quan Lộc',['Liêm Trinh','Tham Lang']],['Thiên Di',['Thiên Tướng']]] as const;
  for(const [p,names] of config)at(s,p).majorStars=names.map(name=>({name,scope:'origin'}) as any);
  at(s,'Phụ Mẫu').majorStars=PRINCIPAL_STARS.filter(n=>!config.some(([,names])=>(names as readonly string[]).includes(n))).map(name=>({name,scope:'origin'}) as any);
 }else if(key==='spend'||key==='guard'){
  at(s,'Phụ Mẫu').majorStars.push(...at(s,'Tử Nữ').majorStars);at(s,'Tử Nữ').majorStars=[];
 }
 for(const name of key==='speech'?['Văn Xương','Văn Khúc']:['Hỏa Tinh','Linh Tinh']){
  const star=s.chart.palaces.flatMap(p=>p.minorStars).find(st=>st.name===name)!;
  s.chart.palaces.forEach(p=>{p.minorStars=p.minorStars.filter(st=>st.name!==name);p.adjectiveStars=p.adjectiveStars.filter(st=>st.name!==name);});
  at(s,key==='speech'?'Mệnh':'Phụ Mẫu').minorStars.push(star);
 }
 return s;
}
function render(s:ChartSnapshot){const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),customer=buildCustomerReport(s,continuous,RULESET_VERSION);const record:any={snapshot:s,frozen:{customerReport:customer,continuousReport:continuous}};record.accessPolicy=captureReadingPolicy(record);return {reading,continuous,customer,record};}
for(const key of ['move','spend','speech'] as const){
 it(key+' matches in shared production execution exactly once',()=>{const s=fixture(key);expect(assess(s,key).value).toBe('yes');expect(executeRules(s,trungchauRules,'internal-draft').previewClaims.filter(c=>c.rules.some(r=>r.id===ids[key]))).toHaveLength(1);});
 for(const [label,edit] of [
  ['missing certificate',(s:ChartSnapshot)=>delete (s.chart.tanBien!.completeness as any).majorStars],
  ['missing principal',(s:ChartSnapshot)=>s.chart.palaces.find(p=>p.majorStars.length)!.majorStars.pop()],
  ['annual principal',(s:ChartSnapshot)=>(s.chart.palaces.find(p=>p.majorStars.length)!.majorStars[0] as any).scope='year'],
  ['duplicate name',(s:ChartSnapshot)=>s.chart.palaces[0].name=s.chart.palaces[1].name],
  ['missing named palace',(s:ChartSnapshot)=>at(s,'Tử Nữ').name='Không xác định'],
  ['invalid branch',(s:ChartSnapshot)=>s.chart.palaces[0].earthlyBranch='invalid'],
  ['wrong profile',(s:ChartSnapshot)=>s.profile.id='cn-reference'],
 ] as const)it(key+' unknown: '+label,()=>{const s=fixture(key);edit(s);expect(assess(s,key).value).toBeUndefined();expect(trungchauFacts(s).find(f=>f.id===trungchauFact(key)+'-status')!.value).toBe('unknown');expect(trungchauFacts(s).find(f=>f.id===trungchauFact(key))).toBeUndefined();});
 it(key+' has versioned source and method, no implicit method borrowing',()=>{const r=trungchauRules.find(r=>r.id===ids[key])!;expect(r.sourceReferences[0].title).toContain('Nguyễn Anh Vũ');expect(r.presentation!.sourceScope).toContain('Tinh hệ gốc Trung Châu');expect(r.sourceReferences[0].rightsNote).toContain('b1a7ae62');expect(r.conflictPolicy).toBe('retain-both');});
 it(key+' routes whole groups with correct G2, trace and customer topic',()=>{const s=fixture(key),{reading,continuous,customer,record}=render(s),ps=customer.sections.flatMap(s=>s.paragraphs).filter(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===ids[key])));expect(ps).toHaveLength(1);const p=ps[0];expect(p.review).toBe('editorial-checked');expect(p.text).toBe({move:MOVE_COPY,spend:SPEND_COPY,speech:SPEECH_COPY}[key]);expect(continuous.unbound).toHaveLength(0);const owner=continuous.palaces.find(p=>p.groups.some(g=>g.claimIds.includes(ps[0].claimIds[0])))!.name;expect(owner).toBe({move:'Quan Lộc',spend:'Tài Bạch',speech:'Mệnh'}[key]);expect(reading.sections.find(s=>s.claims.some(c=>c.rules.some(r=>r.id===ids[key])))!.id).toBe({move:'work',spend:'finance',speech:'learning'}[key]);expect(customer.sections.find(s=>s.paragraphs.includes(p))!.id).toBe({move:'natal-palace-4',spend:'assets',speech:'learning'}[key]);const free=JSON.stringify(projectReading(record));expect(free.includes(p.text)).toBe(key==='speech');expect(JSON.stringify(projectReading(record,true))).toContain(p.text);expect(JSON.parse(JSON.stringify(customer))).toEqual(customer);});
}
for(const key of ['move','speech']as const)for(const branch of ['Sửu','Mùi'])it(key+' '+branch+' exact branch OR',()=>expect(assess(fixture(key,branch),key).value).toBe('yes'));
for(const key of ['move','speech']as const)it(key+' known false even with missing independent minor data',()=>{const s=fixture(key,'Dần');delete (s.chart.tanBien!.completeness as any).minorStars;expect(assess(s,key).value).toBe('no');});
it('MOVE distinguishes false Tử/Phá from inconsistent supporting frame',()=>{const s=fixture('move');const a=at(s,'Mệnh').majorStars,b=at(s,'Tài Bạch').majorStars;[a[1],b[0]]=[b[0],a[1]];expect(assess(s,'move').value).toBe('no');const t=fixture('move'),c=at(t,'Quan Lộc').majorStars,d=at(t,'Tài Bạch').majorStars;[c[0],d[0]]=[d[0],c[0]];expect(assess(t,'move').value).toBeUndefined();});
it('SPEND false with any principal, missing array unknown, auxiliaries do not cancel VCD',()=>{const s=fixture('spend');at(s,'Tử Nữ').majorStars.push(at(s,'Phụ Mẫu').majorStars.pop()!);expect(assess(s,'spend').value).toBe('no');delete (at(s,'Tử Nữ') as any).majorStars;expect(assess(s,'spend').value).toBeUndefined();expect(assess(fixture('spend'),'spend').value).toBe('yes');});
for(const name of ['Văn Xương','Văn Khúc']){
 it('SPEECH requires AND same natal palace: '+name,()=>{const s=fixture('speech'),p=at(s,'Mệnh');at(s,'Quan Lộc').minorStars.push(p.minorStars.find(st=>st.name===name)!);p.minorStars=p.minorStars.filter(st=>st.name!==name);expect(assess(s,'speech').value).toBe('no');});
 for(const [label,edit]of [
  ['duplicate',(s:ChartSnapshot)=>at(s,'Quan Lộc').minorStars.push({...at(s,'Mệnh').minorStars.find(st=>st.name===name)!})],
  ['annual',(s:ChartSnapshot)=>(at(s,'Mệnh').minorStars.find(st=>st.name===name) as any).scope='year'],
  ['noncanonical',(s:ChartSnapshot)=>at(s,'Mệnh').minorStars.find(st=>st.name===name)!.name=name+' '],
 ] as const)it('SPEECH unknown '+name+' '+label,()=>{const s=fixture('speech');edit(s);expect(assess(s,'speech').value).toBeUndefined();});
}
it('SPEECH missing certificate/list cannot imply absence',()=>{for(const field of ['minorStars','adjectiveStars']as const){const s=fixture('speech');delete (s.chart.tanBien!.completeness as any)[field];expect(assess(s,'speech').value).toBeUndefined();const t=fixture('speech');delete (at(t,'Mệnh') as any)[field];expect(assess(t,'speech').value).toBeUndefined();}});
for(const names of [['Hỏa Tinh'],['Linh Tinh'],['Hỏa Tinh','Linh Tinh']])it('guard619 OR with other auxiliaries, no sole-star requirement '+names,()=>{const s=fixture('spend'),p=at(s,'Tử Nữ');for(const name of names){const q=at(s,'Phụ Mẫu');p.minorStars.push(q.minorStars.find(st=>st.name===name)!);q.minorStars=q.minorStars.filter(st=>st.name!==name);}expect(p.minorStars.length).toBeGreaterThan(names.length);expect(assess(s,'guard').value).toBe('yes');const {customer,record,continuous}=render(s),p2=customer.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===SPEND201)))!;expect(p2.text).toBe(SPEND_COPY+' '+FIRE_BELL_COPY);expect(p2.text.split(FIRE_BELL_COPY)).toHaveLength(2);expect(JSON.stringify(projectReading(record))).not.toContain(FIRE_BELL_COPY);expect(continuous.financeAssets!.relations.every(r=>!r.claimIds.some(id=>p2.claimIds.includes(id)))).toBe(true);});
it('guard known absent vs unknown; base independent of missing guard',()=>{expect(assess(fixture('spend'),'guard').value).toBe('no');for(const kind of ['array','certificate']){const s=fixture('spend');if(kind==='array')delete (at(s,'Tử Nữ') as any).minorStars;else delete (s.chart.tanBien!.completeness as any).minorStars;expect(assess(s,'guard').value).toBeUndefined();expect(assess(s,'spend').value).toBe('yes');expect(trungchauFacts(s).find(f=>f.id===trungchauFact('spend')+'-copy')!.value).toBe(SPEND_COPY);}});
it('guard619 also applies with principal stars; PDF618 is never registered',()=>{const s=fixture('spend'),p=at(s,'Tử Nữ'),q=at(s,'Phụ Mẫu');p.majorStars.push(q.majorStars.pop()!);p.minorStars.push(q.minorStars.find(st=>st.name==='Hỏa Tinh')!);q.minorStars=q.minorStars.filter(st=>st.name!=='Hỏa Tinh');expect(assess(s,'guard').value).toBe('yes');expect(assess(s,'spend').value).toBe('no');expect(trungchauRules).toHaveLength(3);});
it('a missing independent branch does not suppress spending',()=>{const s=fixture('speech');at(s,'Phụ Mẫu').majorStars.push(...at(s,'Tử Nữ').majorStars);at(s,'Tử Nữ').majorStars=[];delete (s.chart.tanBien!.completeness as any).minorStars;const claims=executeRules(s,trungchauRules,'internal-draft').previewClaims;expect(claims.some(c=>c.rules.some(r=>r.id===SPEND201))).toBe(true);expect(claims.some(c=>c.rules.some(r=>r.id===SPEECH484))).toBe(false);});

it('a spending-only financial owner retains the unfilled original money gap and children unchanged',()=>{
 const s=fixture('spend'),reading=buildTanBienReading(s);
 for(const section of reading.sections){section.paragraphs=section.paragraphs.filter(p=>!p.claim.factIds.some(id=>id.startsWith('fact.wealth-')||id.startsWith('fact.finance-'))||p.claim.rules.some(r=>r.id===SPEND201));}
 const withSpending=buildContinuousReport(s,reading,true);
 for(const section of reading.sections)section.paragraphs=section.paragraphs.filter(p=>!p.claim.rules.some(r=>r.id===SPEND201));
 const before=buildContinuousReport(s,reading,true),money=withSpending.palaces.find(p=>p.name==='Tài Bạch')!,old=before.palaces.find(p=>p.name==='Tài Bạch')!;
 expect(money.groups).toHaveLength(1);expect(old.groups).toHaveLength(0);expect(money.gap).toEqual(old.gap);expect(money.gap).not.toBeNull();expect(withSpending.palaces.find(p=>p.name==='Tử Nữ')).toEqual(before.palaces.find(p=>p.name==='Tử Nữ'));
});
