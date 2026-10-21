import fs from 'node:fs';
import {it,expect} from 'vitest';
import type {ChartSnapshot} from '../lib/tuvi-engine';
import {emptyLifeRule as rule} from '../lib/interpretation-rules/tanbien-empty-life';
import {executeRules} from '../lib/interpretation-rules/execute';
import {emptyLifeFacts} from '../lib/interpretation-rules/life-empty-facts';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
// Unmodified historical engine output. Mutations below are explicitly technical fixtures.
const base=()=>JSON.parse(fs.readFileSync('.local/internal-readings/3fbafd93-bb19-4967-9079-66ddd53ebc7d.json','utf8')).snapshot as ChartSnapshot;
const run=(s:ChartSnapshot)=>executeRules(s,[rule],'internal-draft');
const life=(s:ChartSnapshot)=>s.chart.palaces.find(p=>p.name==='Mệnh')!;
const opposite=(s:ChartSnapshot)=>s.chart.palaces.find(p=>p.earthlyBranch==='Sửu')!;
it('source p71: empty Mui + two natal luminaries at Suu yields only a source gloss; no mutation',()=>{
 const s=base(),before=JSON.stringify(s),r=run(s);expect(r.traces[0].status).toBe('matched');expect(r.previewClaims).toHaveLength(1);expect(r.previewClaims[0].rules[0].presentation?.contentType).toBe('context');expect(JSON.stringify(s)).toBe(before);expect(life(s).majorStars).toEqual([]);expect(r.previewClaims[0].text).toContain('Hai sao vẫn thuộc đối cung');
 const reading=buildTanBienReading(s);expect(reading.lifeMajorNotice).toBeNull();expect(reading.lifeOverview.gaps[0].text).toContain('Đã có chú giải');
});
it('technical fixtures: wrong palace, branch, pair and nonempty life fail the source predicates',()=>{
 const p=base();[life(p).name,opposite(p).name]=[opposite(p).name,life(p).name];expect(run(p).traces[0].status).toBe('condition-false');
 const b=base();const other=b.chart.palaces.find(p=>p.earthlyBranch==='Tý')!;[life(b).earthlyBranch,other.earthlyBranch]=[other.earthlyBranch,life(b).earthlyBranch];expect(run(b).previewClaims).toHaveLength(0);
 const pair=base();const otherStar=pair.chart.palaces.find(p=>p.majorStars.some(st=>st.name==='Tử Vi'))!;[opposite(pair).majorStars[0],otherStar.majorStars[0]]=[otherStar.majorStars[0],opposite(pair).majorStars[0]];expect(run(pair).previewClaims).toHaveLength(0);
 const filled=base();life(filled).majorStars.push(opposite(filled).majorStars.pop()!);expect(run(filled).previewClaims).toHaveLength(0);
});
it('technical fixtures: missing declaration/list/star, duplicate and scope never prove emptiness',()=>{
 for(const mutate of [
 (s:ChartSnapshot)=>delete (life(s) as any).majorStars,
 (s:ChartSnapshot)=>delete (s.chart.tanBien as any).completeness,
 (s:ChartSnapshot)=>opposite(s).majorStars.pop(),
 (s:ChartSnapshot)=>opposite(s).majorStars.push(opposite(s).majorStars[0]),
 (s:ChartSnapshot)=>(opposite(s).majorStars[0] as any).scope='annual',
 (s:ChartSnapshot)=>delete (opposite(s).majorStars[0] as any).scope,
 ]){const s=base();mutate(s);expect(run(s).traces[0].status).toBe('missing-facts');expect(run(s).previewClaims).toHaveLength(0);}
});
it('known unresolved adjustments are not silently applied as fortune or complete remedy',()=>{
 const s=base();const text=run(s).previewClaims[0].text;
 // Technical fixture only: presence/absence of saved void pairs cannot upgrade this B gloss.
 (s.chart.tanBien as any).voidRanges=[{name:'Tuần Không',branches:['Mùi','Thân']},{name:'Triệt Lộ',branches:['Mùi','Ngọ']}];
 expect(run(s).previewClaims[0].text).toBe(text);expect(text).toContain('chưa được phối hợp');
 (s.chart.tanBien as any).voidRanges=[];expect(run(s).previewClaims[0].text).toBe(text);
 for(const st of opposite(s).majorStars){(st as any).originalBrightness='Hãm';st.brightness='Hãm';}
 expect(emptyLifeFacts(s).find(f=>f.id==='fact.life-opposite-sun-moon-light')?.value).toBe('bright');
 expect(run(s).previewClaims[0].text).toBe(text);
});
it('old profile and public gate stay separate from source mismatch',()=>{
 const s=base();s.profile.id='vn-utc7-midnight-v1';expect(run(s).traces[0].status).toBe('wrong-profile');
 expect(rule.status).toBe('draft');expect(rule.review).toBeNull();
 expect(executeRules(base(),[rule],'customer').previewClaims).toHaveLength(0);
});
