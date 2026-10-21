import {describe,it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {PRINCIPAL_STARS,CHART_BRANCHES} from '../lib/tuvi-engine/chart-integrity';
import {kinBranches,kinRules,kinAssessment,kinFacts,kinKey,type KinBranch} from '../lib/interpretation-rules/phu-tu';
import {executeRules} from '../lib/interpretation-rules/execute';
import {subjectOf} from '../lib/exploration/model';
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
for(const r of kinBranches)describe(kinKey(r),()=>{
 const rule=kinRules.find(x=>x.id==='tanbien.'+kinKey(r))!;
 it('source predicate, palace binding and draft gate',()=>{const run=executeRules(fixture(r),[rule],'internal-draft');expect(run.traces[0].status).toBe('matched');expect(subjectOf(run.previewClaims[0])).toBe(r.palace);expect(rule.review).toBeNull();expect(executeRules(fixture(r),[rule],'customer').approvedClaims).toHaveLength(0);});
 it('missing certified major list stays unknown and never mutates input',()=>{const s=fixture(r);const before=JSON.stringify(s);kinFacts(s);expect(JSON.stringify(s)).toBe(before);delete (s.chart.palaces.find(p=>p.name===r.palace)! as any).majorStars;expect(kinAssessment(s,r).value).toBeUndefined();});
 it('same stars in the wrong palace do not match',()=>{const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>p.name==='Mệnh')!;[p.majorStars,q.majorStars]=[q.majorStars,p.majorStars];[p.minorStars,q.minorStars]=[q.minorStars,p.minorStars];if(r.mode==='ring')(p as any).changsheng12='Đế Vượng';if(['Thái Tuế','Phục Binh'].includes(r.stars[0])){const f=r.stars[0]==='Thái Tuế'?'suiqian12':'boshi12';[(p as any)[f],(q as any)[f]]=[(q as any)[f],(p as any)[f]];}expect(kinAssessment(s,r).value).not.toBe(true);});
 it('each required star removed prevents matching',()=>{if(r.mode==='ring')return;for(const n of r.stars){const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>p.name==='Mệnh')!;for(const field of ['majorStars','minorStars','adjectiveStars'] as const){q[field].push(...p[field].filter(st=>st.name===n||('Hóa '+st.mutagen)===n));p[field]=p[field].filter(st=>st.name!==n&&('Hóa '+st.mutagen)!==n);}if(['Thái Tuế','Phục Binh'].includes(n))delete (p as any)[n==='Thái Tuế'?'suiqian12':'boshi12'];expect(kinAssessment(s,r).value).not.toBe(true);}});
 it('annual scope cannot provide positive natal evidence',()=>{if(r.mode==='ring')return;const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!;[...p.majorStars,...p.minorStars].forEach(st=>(st as any).scope='year');if(['Thái Tuế','Phục Binh'].includes(r.stars[0]))delete (p as any)[r.stars[0]==='Thái Tuế'?'suiqian12':'boshi12'];expect(kinAssessment(s,r).value).not.toBe(true);});
 it('no blanket Tuần/Triệt or state-table requirement',()=>{const s=fixture(r);delete (s.chart.tanBien! as any).voidRanges;for(const p of s.chart.palaces)for(const st of p.majorStars)st.brightness='';expect(kinAssessment(s,r).value).toBe(true);});
 if(r.branches.length)it('wrong earthly branch is excluded',()=>{const s=fixture(r),p=s.chart.palaces.find(p=>p.name===r.palace)!,q=s.chart.palaces.find(p=>!r.branches.includes(p.earthlyBranch))!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];expect(kinAssessment(s,r).value).toBe(false);});
 if(r.gender)it('wrong or missing sex cannot select gender-specific clause',()=>{const s=fixture(r);s.normalized.gender=r.gender==='male'?'female':'male';expect(kinAssessment(s,r).value).toBe(false);delete (s.normalized as any).gender;expect(kinAssessment(s,r).value).toBeUndefined();});
});
it('đơn thủ is not tọa thủ: source §14.5 rejects Nhật–Cự, §14.39 permits another major with the three named stars',()=>{
 const single=kinBranches.find(r=>r.id==='sun-high'&&r.palace==='Phu Thê')!,s=fixture(single),p=s.chart.palaces.find(p=>p.name==='Phu Thê')!,q=s.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Cự Môn'))!;p.majorStars.push(q.majorStars.find(st=>st.name==='Cự Môn')!);q.majorStars=q.majorStars.filter(st=>st.name!=='Cự Môn');expect(kinAssessment(s,single).value).toBe(false);
 const three=kinBranches.find(r=>r.id==='tuong-dao-hong-male')!,t=fixture(three),a=t.chart.palaces.find(p=>p.name==='Phu Thê')!,b=t.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Tử Vi'))!;a.majorStars.push(b.majorStars.find(st=>st.name==='Tử Vi')!);b.majorStars=b.majorStars.filter(st=>st.name!=='Tử Vi');expect(kinAssessment(t,three).value).toBe(true);
});
it('§14.22 certificate-based absence vs historical missing and inconsistent positive',()=>{
 const r=kinBranches.find(r=>r.id==='ky'&&r.palace==='Phu Thê')!;expect(kinAssessment(base,r).value).toBe(false); // Nhâm gives Kỵ to Vũ at Mệnh in this case.
 const s=structuredClone(base);delete s.chart.natalTransformations;expect(kinAssessment(s,r).value).toBeUndefined();
 const t=fixture(r);t.chart.natalTransformations=structuredClone(base.chart.natalTransformations);expect(kinAssessment(t,r).value).toBeUndefined();
});
it('ambiguous timing and contradictory Tỵ are not silently broadened',()=>{expect(kinBranches.some(r=>r.id==='luong-hoi'&&r.branches.includes('Tỵ'))).toBe(false);expect(kinBranches.some(r=>r.palace==='Phu Thê'&&r.stars.includes('Thái Âm')&&r.stars.includes('Thiên Đồng'))).toBe(false);});
it('source adverse half preserved: Vũ–Phủ not pure wealth; Tham Dần/Thân not pure prominence',()=>{
 expect(kinBranches.find(r=>r.id==='vu-phu'&&r.palace==='Phu Thê')!.text).toContain('bất hòa');expect(kinBranches.find(r=>r.id==='tham-dan-than'&&r.palace==='Tử Nữ')!.text).toContain('không hợp tính');
});
it('no duplicate branch/claim identities',()=>{expect(new Set(kinRules.map(r=>r.id)).size).toBe(kinRules.length);const run=executeRules(base,kinRules,'internal-draft');expect(new Set(run.previewClaims.map(c=>c.id)).size).toBe(run.previewClaims.length);});

import {readPath,pathSchema} from '../lib/interpretation-rules/schema';
it('only normalized.gender is newly allowed as evidence, not arbitrary birth or prototype paths',()=>{expect(readPath(base,'normalized.gender')).toBe('male');for(const p of ['normalized.date','normalized.__proto__','normalized.gender.constructor','__proto__.gender'])expect(pathSchema.safeParse(p).success).toBe(false);});
