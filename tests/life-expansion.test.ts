import fs from 'node:fs';
import {describe,it,expect} from 'vitest';
import {lifeExpansionBranches,lifeExpansionRules} from '../lib/interpretation-rules/tanbien-life-content';
import {lifeContentFacts} from '../lib/interpretation-rules/life-content-facts';
import {executeRules} from '../lib/interpretation-rules/execute';
import {tanBienRules} from '../lib/interpretation-rules/profile-rules';
import {lifeOverview} from '../lib/internal-review/life-overview';
const found=JSON.parse(fs.readFileSync('.local/life-expand-20261012/witnesses.json','utf8'));
const status=(s:any,id:string)=>executeRules(s,tanBienRules(s),'internal-draft').traces.find(t=>t.ruleId===id)!.status;
const life=(s:any)=>s.chart.palaces.find((p:any)=>p.name==='Mệnh');
// Positive witnesses are engine-generated synthetic births. Mutations below are technical fixtures only.
for(const spec of lifeExpansionBranches)describe(spec.id,()=>{
 const id='tanbien.life-batch-'+spec.id;
 it('matches the independently specified source branch once; stays draft',()=>{const s=found[id].snapshot;expect(status(s,id)).toBe('matched');const r=lifeExpansionRules.find(r=>r.id===id)!;expect(r.status).toBe('draft');expect(r.review).toBeNull();expect(executeRules(s,[r],'customer').traces[0].status).toBe('not-approved');expect(executeRules(s,[r],'internal-draft').previewClaims).toHaveLength(1);});
 it('wrong palace and missing mandatory star do not match',()=>{const s=structuredClone(found[id].snapshot),p=life(s),other=s.chart.palaces.find((p:any)=>p.name==='Quan Lộc');[p.majorStars,other.majorStars]=[other.majorStars,p.majorStars];expect(status(s,id)).toBe('condition-false');});
 it('incomplete, duplicate and annual scope stay unknown',()=>{for(const change of[(s:any)=>delete s.chart.tanBien.completeness,(s:any)=>delete life(s).majorStars,(s:any)=>life(s).majorStars.push(life(s).majorStars[0]),(s:any)=>life(s).majorStars[0].scope='yearly']){const s=structuredClone(found[id].snapshot);change(s);expect(status(s,id)).toBe('missing-facts');}});
 it('wrong branch is not inferred from raw brightness; unknown branch stays unknown',()=>{const s=structuredClone(found[id].snapshot),p=life(s);p.majorStars.forEach((st:any)=>{st.brightness='Hãm';st.originalBrightness='Miếu'});expect(status(s,id)).toBe('matched');const target=s.chart.palaces.find((x:any)=>x.earthlyBranch==='Dần');[p.earthlyBranch,target.earthlyBranch]=[target.earthlyBranch,p.earthlyBranch];expect(status(s,id)).toBe('condition-false');p.earthlyBranch='unknown';expect(status(s,id)).toBe('missing-facts');});
});
it('the direct pair needs both stars, not a star across the chart',()=>{const id='tanbien.life-batch-co-luong-thin-tuat',s=structuredClone(found[id].snapshot),p=life(s),other=s.chart.palaces.find((p:any)=>p.name==='Tài Bạch');other.majorStars.push(p.majorStars.pop());expect(status(s,id)).toBe('condition-false');});
it('no statement of absence from an empty list without completeness proof',()=>{const s=structuredClone(Object.values(found)[0] as any).snapshot;life(s).majorStars=[];expect(lifeContentFacts(s)).toEqual([]);expect(lifeOverview(s,[],true).facts[1].text).toContain('Chưa có danh sách');});
