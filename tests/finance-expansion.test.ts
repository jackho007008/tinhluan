import {it,expect}from'vitest';import{calculate}from'../lib/tuvi-engine';import{executeRules}from'../lib/interpretation-rules/execute';import{tanBienRules}from'../lib/interpretation-rules/profile-rules';import{financeSupplements}from'../lib/interpretation-rules/tanbien-finance-content';import{financeSupplementFacts}from'../lib/interpretation-rules/finance-supplement-facts';
const raw=await calculate({date:'1992-08-07',hour:16,minute:0,unknownTime:false,place:'Hà Nội',gender:'male',calendar:'solar',profile:'tanbien-vn-trial-v2',timezone:'Asia/Ho_Chi_Minh',consent:true});
const base=()=>{const s=structuredClone(raw);delete s.chart.natalTransformations;s.chart.fiveElementsClass='Thổ Ngũ Cục';s.chart.lunar.lunarDay=1;return s};const q=(s:any)=>s.chart.palaces.find((p:any)=>p.name==='Tài Bạch');
const status=(s:any,id:string)=>executeRules(s,tanBienRules(s),'internal-draft').traces.find(t=>t.ruleId===id)!.status;
// Technical fixtures: expected predicates transcribed from PDF191/195/197 and PDF32; not engine sample claims.
for(const spec of financeSupplements)it(spec.id+' local natal predicate / missing / wrong relation / annual',()=>{
 const s=base(),p=q(s),id='tanbien.finance-extra-'+spec.id;p.majorStars=[{name:'Thiên Phủ',scope:'origin'}];p.minorStars=[];p.adjectiveStars=[];p.boshi12='Bác Sỹ';
 if(spec.stars.length)p.minorStars=spec.stars.map(name=>({name,scope:'origin'}));else p.majorStars[0].mutagen=spec.id==='loc-position'?'Lộc':'Kỵ';
 expect(status(s,id)).toBe('matched');expect(executeRules(s,tanBienRules(s).filter(r=>r.id===id),'customer').traces[0].status).toBe('not-approved');
 const copy=structuredClone(s);q(copy).majorStars=undefined;q(copy).minorStars=undefined;q(copy).adjectiveStars=undefined;delete q(copy).boshi12;expect(status(copy,id)).toBe('missing-facts');
 const stars=[...p.majorStars,...p.minorStars,...p.adjectiveStars];stars.forEach(st=>st.scope='yearly');expect(status(s,id)).not.toBe('matched');
 stars.forEach(st=>st.scope='origin');const moved=structuredClone(s);const target=moved.chart.palaces.find(x=>x.name==='Quan Lộc')!;target.majorStars=q(moved).majorStars;target.minorStars=q(moved).minorStars;q(moved).majorStars=[];q(moved).minorStars=[];expect(status(moved,id)).not.toBe('matched');
 if(spec.stars.length>1){p.minorStars.pop();expect(status(s,id)).toBe('condition-false');p.minorStars=[{name:'Địa Không',scope:'origin'},{name:'Địa Kiếp',scope:'origin'}];expect(status(s,id)).toBe('condition-false');}
});
it('Ky exclusion and certified unknown are not opposite claims',()=>{
 const s=base(),p=q(s);p.majorStars=[{name:'Thái Dương',scope:'origin',mutagen:'Kỵ'},{name:'Thái Âm',scope:'origin'}];expect(status(s,'tanbien.finance-extra-ky-general')).toBe('condition-false');expect(status(s,'tanbien.finance-nhat-nguyet-ky')).toBe('matched');
 delete (s.chart.tanBien as any).completeness;p.majorStars=[{name:'Thái Dương',scope:'origin',mutagen:'Kỵ'}];expect(status(s,'tanbien.finance-extra-ky-general')).toBe('missing-facts');
 s.chart.natalTransformations={version:'bad'}as any;expect(status(s,'tanbien.finance-nhat-nguyet-ky')).not.toBe('matched');expect(financeSupplementFacts(s).some(f=>f.id==='fact.finance-origin-ky')).toBe(false);
});
it('two Sun branches: single, exact branch, wrong/missing/annual; no duplicate pair',()=>{
 for(const[id,b]of[['nhat-alone-dan-ngo','Ngọ'],['nhat-alone-than-ty','Hợi']]){const s=base(),p=q(s);p.majorStars=[{name:'Thái Dương',scope:'origin'}];p.earthlyBranch=b;expect(status(s,'tanbien.finance-'+id)).toBe('matched');p.earthlyBranch='Sửu';expect(status(s,'tanbien.finance-'+id)).toBe('condition-false');p.earthlyBranch=b;p.majorStars.push({name:'Cự Môn',scope:'origin'});expect(status(s,'tanbien.finance-'+id)).toBe('condition-false');delete p.majorStars;expect(status(s,'tanbien.finance-'+id)).toBe('missing-facts');}
});
it('draft gate and method metadata',()=>{for(const r of tanBienRules(raw).filter(r=>r.id.startsWith('tanbien.finance-extra-'))){expect(r.status).toBe('draft');expect(r.review).toBeNull();expect(executeRules(raw,[r],'customer').previewClaims).toHaveLength(0);}});
it('global certificate confirms absence; invalid path and contradictory local label remain unknown',()=>{
 const s=structuredClone(raw);const entry=s.chart.natalTransformations!.entries.find(e=>e.kind==='Kỵ')!;expect(entry.palace).not.toBe('Tài Bạch');expect(financeSupplementFacts(s).find(f=>f.id==='fact.finance-origin-ky')?.value).toBe('no');
 entry.path='chart.palaces.99.majorStars.0';expect(financeSupplementFacts(s).find(f=>f.id==='fact.finance-origin-ky')).toBeUndefined();
 const t=structuredClone(raw);q(t).majorStars[0].mutagen='Kỵ';expect(financeSupplementFacts(t).find(f=>f.id==='fact.finance-origin-ky')).toBeUndefined();
});
