import {describe,it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {PRINCIPAL_STARS,CHART_BRANCHES} from '../lib/tuvi-engine/chart-integrity';
import {noDienBranches,noDienRules,noDienAssessment,noDienFacts} from '../lib/interpretation-rules/no-dien';
import {executeRules} from '../lib/interpretation-rules/execute';
import {subjectOf} from '../lib/exploration/model';
import {phucDiRules,phucDiFacts} from '../lib/interpretation-rules/phuc-di';
const base=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',consent:true});
// Synthetic assignments test predicates only, never counted as valid engine witnesses.
function fixture(r:typeof noDienBranches[number]){
 const s=structuredClone(base);delete s.chart.natalTransformations;
 const p=s.chart.palaces.find(p=>p.name===r.palace)!;
 if(r.branches.length){const q=s.chart.palaces.find(q=>q.earthlyBranch===r.branches[0])!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];}
 for(const q of s.chart.palaces){q.majorStars=[];q.minorStars=[];q.adjectiveStars=[];}
 const wanted=r.kind==='major'?r.stars:['Thiên Phủ'];
 const star=(name:string)=>({name,scope:'origin',type:'major',brightness:'',mutagen:''}) as any;
 p.majorStars=wanted.map(star);s.chart.palaces.find(q=>q!==p)!.majorStars=PRINCIPAL_STARS.filter(n=>!wanted.includes(n)).map(star);
 const i=CHART_BRANCHES.indexOf(p.earthlyBranch),b=(n:number)=>CHART_BRANCHES[(i+n)%12];
 s.chart.tanBien!.voidRanges=[{name:'Tuần Không',branches:[b(2),b(3)]},{name:'Triệt Lộ',branches:[b(4),b(5)]}] as any;
 if(r.kind==='tl-example'){
  const used=r.config!.flatMap(c=>c.stars);for(const q of s.chart.palaces)q.majorStars=[];
  for(const c of r.config!){const q=s.chart.palaces.find(q=>q.name===c.palace)!,other=s.chart.palaces.find(q=>q.earthlyBranch===c.branch)!;[q.earthlyBranch,other.earthlyBranch]=[other.earthlyBranch,q.earthlyBranch];q.majorStars=c.stars.map(star);}
  s.chart.palaces.find(q=>!r.config!.some(c=>c.palace===q.name))!.majorStars=PRINCIPAL_STARS.filter(n=>!used.includes(n)).map(star);
  const avoid=r.config!.map(c=>c.branch);const k=CHART_BRANCHES.findIndex((b,i)=>!avoid.includes(b)&&!avoid.includes(CHART_BRANCHES[(i+1)%12]));s.chart.tanBien!.voidRanges.forEach(v=>v.branches=[CHART_BRANCHES[k],CHART_BRANCHES[(k+1)%12]]);
 }
 if(r.kind==='minor'){
 if(r.stars[0].startsWith('Hóa '))p.majorStars[0].mutagen=r.stars[0].slice(4);
 else if(r.stars[0]==='Tướng Quân')(p as any).boshi12='Tướng Quân';
 else p.minorStars.push(star(r.stars[0]));
 }
 if(['void','both-void'].includes(r.kind))s.chart.tanBien!.voidRanges[0].branches=[b(0),b(1)];
 if(r.kind==='both-void')s.chart.tanBien!.voidRanges[1].branches=[b(0),b(1)];
 return s;
}
for(const [i,r] of noDienBranches.entries())describe(r.palace+' '+r.id,()=>{
 const rule=noDienRules[i];
 it('source predicate positive; correct palace, source and draft gate',()=>{
 const s=fixture(r),run=executeRules(s,[rule],'internal-draft');expect(run.traces[0].status).toBe('matched');expect(subjectOf(run.previewClaims[0])).toBe(r.palace);expect(rule.sourceReferences[0].location).toContain(String(r.page));expect(rule.review).toBeNull();expect(executeRules(s,[rule],'customer').approvedClaims).toHaveLength(0);
 });
 it('incomplete major list is unknown, not absence; facts do not mutate snapshot',()=>{const s=fixture(r);const before=JSON.stringify(s);noDienFacts(s);expect(JSON.stringify(s)).toBe(before);delete (s.chart.palaces.find(p=>p.name===r.palace)! as any).majorStars;expect(noDienAssessment(s,r).value).toBeUndefined();});
 it('barrier missing remains unknown',()=>{const s=fixture(r);delete (s.chart.tanBien! as any).voidRanges;expect(noDienAssessment(s,r).value).toBeUndefined();});
 it('wrong palace, branch or barrier excludes the branch',()=>{
 const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;
 if(['void','both-void'].includes(r.kind)){const i=CHART_BRANCHES.indexOf(p.earthlyBranch);s.chart.tanBien!.voidRanges.forEach(v=>v.branches=[CHART_BRANCHES[(i+2)%12],CHART_BRANCHES[(i+3)%12]]);}
 else if(r.kind==='major'||r.kind==='tl-example'){const q=s.chart.palaces.find(q=>q!==p)!;[p.majorStars,q.majorStars]=[q.majorStars,p.majorStars];}
 else if(r.stars[0]==='Tướng Quân'){(p as any).boshi12=undefined;}
 else {p.majorStars.forEach(st=>st.mutagen='');p.minorStars=[];}
 expect(noDienAssessment(s,r).value).not.toBe(true);
 });
 it('ordinary source is not emitted under an unresolved barrier adjustment',()=>{if(['void','both-void'].includes(r.kind))return;const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,i=CHART_BRANCHES.indexOf(p.earthlyBranch);s.chart.tanBien!.voidRanges[0].branches=[p.earthlyBranch,CHART_BRANCHES[(i+1)%12]];expect(noDienAssessment(s,r).cause).toBe('unresolved-adjustment');expect(executeRules(s,[rule],'internal-draft').previewClaims).toHaveLength(0);});
 it('annual star cannot activate natal branch',()=>{if(['void','both-void'].includes(r.kind)||r.stars[0]==='Tướng Quân')return;const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;[...p.majorStars,...p.minorStars].forEach(st=>(st as any).scope='year');expect(noDienAssessment(s,r).value).not.toBe(true);});
});
it('§10.5 explicitly tọa thủ: Sun with Cự at Dần allowed, Tý retains đơn thủ',()=>{
 const s=fixture({...noDienBranches[0],palace:'Thiên Di',stars:['Thái Dương','Cự Môn'],branches:['Dần']}),f=phucDiFacts(s);
 expect(f.find(f=>f.id==='fact.di-sun-good')?.value).toBe('yes');
 const rule=phucDiRules.find(r=>r.id==='tanbien.di-sun-good')!;expect(rule.presentation!.title).toContain('tọa thủ');expect(rule.version).toBe('0.2.0');
 const t=fixture({...noDienBranches[0],palace:'Thiên Di',stars:['Thái Dương','Cự Môn'],branches:['Tý']});expect(phucDiFacts(t).find(f=>f.id==='fact.di-sun-ty')?.value).toBe('no');
});
it('certificate disagreement never becomes a positive mutagen or absence',()=>{const r=noDienBranches.find(r=>r.palace==='Điền Trạch'&&r.id==='ky')!,s=fixture(r);s.chart.natalTransformations=structuredClone(base.chart.natalTransformations);expect(noDienAssessment(s,r).value).toBeUndefined();});
it('both voids retain dedicated branch and exclude ordinary baseline',()=>{const r=noDienBranches.find(r=>r.kind==='both-void')!,s=fixture(r),p=s.chart.palaces.find(p=>p.name==='Điền Trạch')!;expect(noDienAssessment(s,r).value).toBe(true);const minor=noDienBranches.find(r=>r.palace==='Điền Trạch'&&r.id==='ky')!;p.majorStars[0].mutagen='Kỵ';expect(noDienAssessment(s,minor).value).toBe(false);});
for(const r of noDienBranches.filter(r=>r.kind==='tl-example'))for(const c of r.config!)it(`Thiên Lương ${r.id}: wrong ${c.palace} branch cannot activate`,()=>{const s=fixture(r),p=s.chart.palaces.find(p=>p.name===c.palace)!,q=s.chart.palaces.find(p=>!r.config!.some(c=>c.palace===p.name))!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];expect(noDienAssessment(s,r).value).toBe(false);});
