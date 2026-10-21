import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {describe,it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {PRINCIPAL_STARS,CHART_BRANCHES} from '../lib/tuvi-engine/chart-integrity';
import {familyBranches,familyRules,familyAssessment,familyFacts} from '../lib/interpretation-rules/phu-huynh';
import {executeRules} from '../lib/interpretation-rules/execute';
import {subjectOf} from '../lib/exploration/model';
import {phucDiRules,phucDiFacts} from '../lib/interpretation-rules/phuc-di';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
// Synthetic assignments test predicates only, never counted as valid engine witnesses.
function fixture(r:typeof familyBranches[number]){
 const s=structuredClone(base);delete s.chart.natalTransformations;
 const p=s.chart.palaces.find(p=>p.name===r.palace)!;
 if(r.branches.length){const q=s.chart.palaces.find(q=>q.earthlyBranch===r.branches[0])!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];}
 for(const q of s.chart.palaces){q.majorStars=[];q.minorStars=[];q.adjectiveStars=[];}
 const wanted=['exact','presence'].includes(r.mode)?r.stars:['Thiên Phủ'];
 const star=(name:string)=>({name,scope:'origin',type:'major',brightness:'',mutagen:''}) as any;
 p.majorStars=wanted.map(star);s.chart.palaces.find(q=>q!==p)!.majorStars=PRINCIPAL_STARS.filter(n=>!wanted.includes(n)).map(star);
 const i=CHART_BRANCHES.indexOf(p.earthlyBranch),b=(n:number)=>CHART_BRANCHES[(i+n)%12];
 s.chart.tanBien!.voidRanges=[{name:'Tuần Không',branches:[b(2),b(3)]},{name:'Triệt Lộ',branches:[b(4),b(5)]}] as any;
 if(['minor','ky-base','ring'].includes(r.mode)){
 if(r.stars[0].startsWith('Hóa '))p.majorStars[0].mutagen=r.stars[0].slice(4);
 else if(r.mode==='ring')(p as any).changsheng12='Tử';
 else p.minorStars.push(star(r.stars[0]));
 }
 return s;
}
for(const [i,r] of familyBranches.entries())describe(r.palace+' '+r.id,()=>{
 const rule=familyRules[i];
 it('source predicate positive; correct palace, source and draft gate',()=>{
 const s=fixture(r),run=executeRules(s,[rule],'internal-draft');expect(run.traces[0].status).toBe('matched');expect(subjectOf(run.previewClaims[0])).toBe(r.palace);expect(rule.sourceReferences[0].location).toContain(String(r.page));expect(rule.review).toBeNull();expect(executeRules(s,[rule],'customer').approvedClaims).toHaveLength(0);
 });
 it('incomplete major list is unknown, not absence; facts do not mutate snapshot',()=>{const s=fixture(r);const before=JSON.stringify(s);familyFacts(s);expect(JSON.stringify(s)).toBe(before);delete (s.chart.palaces.find(p=>p.name===r.palace)! as any).majorStars;expect(familyAssessment(s,r).value).toBeUndefined();});
 it('only wealth clauses require void evidence',()=>{const s=fixture(r);delete (s.chart.tanBien! as any).voidRanges;expect(familyAssessment(s,r).value).toBe(r.wealth?undefined:true);});
 it('wrong palace, branch or barrier excludes the branch',()=>{
 const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;
 if(['exact','presence'].includes(r.mode)){const q=s.chart.palaces.find(q=>q!==p)!;[p.majorStars,q.majorStars]=[q.majorStars,p.majorStars];}
 else if(r.mode==='ring'){(p as any).changsheng12=undefined;}
 else {p.majorStars.forEach(st=>st.mutagen='');p.minorStars=[];}
 expect(familyAssessment(s,r).value).not.toBe(true);
 });
 it('ordinary source is not emitted under an unresolved barrier adjustment',()=>{if(!r.wealth)return;const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,i=CHART_BRANCHES.indexOf(p.earthlyBranch);s.chart.tanBien!.voidRanges[0].branches=[p.earthlyBranch,CHART_BRANCHES[(i+1)%12]];expect(familyAssessment(s,r).cause).toBe('unresolved-adjustment');expect(executeRules(s,[rule],'internal-draft').previewClaims).toHaveLength(0);});
 it('annual star cannot activate natal branch',()=>{if(r.mode==='ring')return;const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;[...p.majorStars,...p.minorStars].forEach(st=>(st as any).scope='year');expect(familyAssessment(s,r).value).not.toBe(true);});
});
it('source §5.2.5 tọa thủ accepts Nhật–Cự; §15.2.5 đơn thủ does not',()=>{
 const parent=familyBranches.find(r=>r.id==='sun-high'&&r.palace==='Phụ Mẫu')!,s=fixture(parent),p=s.chart.palaces.find(p=>p.name==='Phụ Mẫu')!;
 const q=s.chart.palaces.find(q=>q.majorStars.some(st=>st.name==='Cự Môn'))!;p.majorStars.push(q.majorStars.find(st=>st.name==='Cự Môn')!);q.majorStars=q.majorStars.filter(st=>st.name!=='Cự Môn');expect(familyAssessment(s,parent).value).toBe(true);
 const sibling=familyBranches.find(r=>r.id==='sun-high'&&r.palace==='Huynh Đệ')!,t=fixture(sibling),a=t.chart.palaces.find(p=>p.name==='Huynh Đệ')!,b=t.chart.palaces.find(q=>q.majorStars.some(st=>st.name==='Cự Môn'))!;a.majorStars.push(b.majorStars.find(st=>st.name==='Cự Môn')!);b.majorStars=b.majorStars.filter(st=>st.name!=='Cự Môn');expect(familyAssessment(t,sibling).value).toBe(false);
});
it('wrong allowed branch never expands same star to another position',()=>{for(const r of familyBranches.filter(r=>r.branches.length)){const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(q=>!r.branches.includes(q.earthlyBranch))!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];expect(familyAssessment(s,r).value).toBe(false);}});
it('§5.2.25 Nhật–Nguyệt exception is unresolved, not simultaneous contradictory claims',()=>{const r=familyBranches.find(r=>r.mode==='ky-base')!,s=fixture({...r,stars:['Thái Dương','Thái Âm'],branches:['Sửu'],mode:'exact'});s.chart.palaces.find(p=>p.name==='Phụ Mẫu')!.majorStars[0].mutagen='Kỵ';expect(familyAssessment(s,r).cause).toBe('unresolved-adjustment');expect(executeRules(s,[familyRules.find(x=>x.id==='tanbien.parents-ky')!],'internal-draft').previewClaims).toHaveLength(0);});
it('valid transformation absence versus missing and inconsistent certificate',()=>{
 const r=familyBranches.find(r=>r.id==='hoa-quyen')!;
 // Original 1992 engine has Quyền at Quan, not Phụ. This finite assignment is the independent expected.
 expect(familyAssessment(base,r).value).toBe(false);
 const s=structuredClone(base);delete s.chart.natalTransformations;expect(familyAssessment(s,r).value).toBeUndefined();
 const t=fixture(r);t.chart.natalTransformations=structuredClone(base.chart.natalTransformations);expect(familyAssessment(t,r).value).toBeUndefined();
});
it('source adverse statements are retained without converting counts into claims',()=>{expect(familyBranches.find(r=>r.id==='tu-tuong'&&r.palace==='Huynh Đệ')!.text).toContain('thiếu hòa khí');expect(familyBranches.find(r=>r.id==='tu-sat'&&r.palace==='Phụ Mẫu')!.text).toContain('bất hòa');expect(familyBranches.every(r=>!/[0-9]+ người/.test(r.text))).toBe(true);});
it('unrecognized Tràng Sinh label is unknown, not negative',()=>{const r=familyBranches.find(r=>r.mode==='ring')!,s=fixture(r);(s.chart.palaces.find(p=>p.name===r.palace)! as any).changsheng12='invalid';expect(familyAssessment(s,r).value).toBeUndefined();});

// Source correction: PDF127/128 and219/220. These are technical predicate
// fixtures, not engine witnesses or facts about real families.
describe('conditional separation is not an unconditional relationship claim',()=>{
 for(const [palace,id]of [['Phụ Mẫu','co-cu'],['Huynh Đệ','dong-cu']])it(palace+' retains the independent harmony clause only',()=>{
  const r=familyBranches.find(r=>r.palace===palace&&r.id===id)!,rule=familyRules.find(q=>q.id===`tanbien.${palace==='Phụ Mẫu'?'parents':'siblings'}-${id}`)!;
  const s=fixture(r),p=s.chart.palaces.find(p=>p.name===palace)!;
  expect(rule.version).toBe('0.1.1');expect(rule.claimTemplate).toContain('trong nhà thiếu hòa khí');
  expect(rule.claimTemplate).not.toMatch(/xa cách|xa nhau|ly tán|hình khắc|toàn vẹn/);
  expect(executeRules(s,[rule],'internal-draft').previewClaims).toHaveLength(1);
  // No source condition about brightness, gender, age or absence of voids
  // may be introduced to rescue the erroneous separation statement.
  p.majorStars.forEach(st=>(st as any).brightness='hãm');s.normalized.gender='female';
  delete(s.chart.tanBien as any).voidRanges;expect(familyAssessment(s,r).value).toBe(true);
  const other=s.chart.palaces.find(q=>q!==p)!;other.majorStars.push(p.majorStars.pop()!);
  expect(familyAssessment(s,r).value).toBe(false);
  p.majorStars.push(other.majorStars.pop()!);delete(s.chart.tanBien!.completeness as any).majorStars;
  expect(familyAssessment(s,r).cause).toBe('missing-data');
 });
 it('preserves independently asserted separation in a different source clause',()=>{
  const other=familyRules.find(r=>r.id==='tanbien.parents-dong-cu')!;
  expect(other.claimTemplate).toContain('xa cách');expect(other.version).toBe('0.1.0');
 });
});

it('Cơ–Cự with Kỵ preserves both Kỵ alternatives without reviving separation',()=>{
 const r=familyBranches.find(r=>r.palace==='Phụ Mẫu'&&r.id==='co-cu')!,s=fixture(r),p=s.chart.palaces.find(p=>p.name==='Phụ Mẫu')!;
 p.majorStars[0].mutagen='Kỵ';
 const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),customer=buildCustomerReport(s,continuous,RULESET_VERSION);
 const group=continuous.palaces.find(p=>p.name==='Phụ Mẫu')!.groups.find(g=>g.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.parents-co-cu')))!;
 expect(group.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.parents-ky'))).toBe(true);
 expect(group.text).not.toContain('xa cách');
 const para=customer.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.parents-co-cu')))!;
 expect(para.text).toContain('trong nhà thiếu hòa khí');expect(para.text).not.toContain('xa cách');
 expect(para.text).toContain('bất hòa giữa cha mẹ với nhau, hoặc không hợp tính giữa cha mẹ và con');
 expect(new Set(para.claimIds).size).toBe(2);expect(para.review).toBe('editorial-checked');
});
