import {careerConditions} from '../lib/internal-review/career-conditions';
import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import saved from '../exports/demo-wuqu-tianfu-review.json';
import {financeBranches} from '../lib/interpretation-rules/tanbien-finance-content';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {financeConditions} from '../lib/internal-review/finance-conditions';
import {catalog} from '../lib/interpretation-rules/catalog';
import {executeRules} from '../lib/interpretation-rules/execute';
import {tanBienRules} from '../lib/interpretation-rules/profile-rules';
import {exploration} from '../lib/exploration/model';
import type {ChartSnapshot} from '../lib/tuvi-engine';
const base=()=>structuredClone(saved.snapshot) as unknown as ChartSnapshot;
const q=(s:ChartSnapshot)=>s.chart.palaces.find(p=>p.name==='Tài Bạch')!;
const rules=(s:ChartSnapshot)=>tanBienRules(s);
const trace=(s:ChartSnapshot,id:string)=>executeRules(s,rules(s),'internal-draft').traces.find(t=>t.ruleId===id)!;
// Technical fixtures only, independently specified conditions are transcribed
// in financeBranches from Tân Biên 190–194. No output used as expected oracle.
for(const spec of financeBranches.filter(s=>!s.existing)) it(`${spec.id}: book ${spec.pages}; exact local predicate, wrong and missing data`,()=>{
 const s=base(),p=q(s),id='tanbien.finance-'+spec.id;
 s.chart.fiveElementsClass='Thổ Ngũ Cục';s.chart.lunar.lunarDay=1;
 if(spec.id.startsWith('nhat-alone-'))s.chart.tanBien=JSON.parse(readFileSync('.local/internal-readings/52a88679-bc5c-432c-adc0-b475a986ca29.json','utf8')).snapshot.chart.tanBien;
 p.majorStars=spec.stars.map(name=>({name,scope:'origin'} as any));
 p.earthlyBranch=(spec.branches?.[0]||'Dần') as any;
 expect(trace(s,id).status).toBe('matched');
 p.minorStars=[{name:'Hỏa Tinh',scope:'origin'} as any];
 expect(trace(s,id).status).toBe('matched'); // no invented absence exception
 p.majorStars=p.majorStars.slice(1);expect(trace(s,id).status).toBe('condition-false');
 delete (p as any).majorStars;expect(trace(s,id).status).toBe('missing-facts');
 p.majorStars=spec.stars.map(name=>({name,scope:'annual'} as any));expect(trace(s,id).status).toBe('condition-false');
 p.majorStars=spec.stars.map(name=>({name,scope:'origin'} as any));
 if(spec.alone){p.majorStars.push({name:'Thiên Phủ',scope:'origin'} as any);expect(trace(s,id).status).toBe('condition-false');p.majorStars.pop();}
 if(spec.branches){p.earthlyBranch=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'].find(b=>!spec.branches!.includes(b)) as any;expect(trace(s,id).status).toBe('condition-false'); delete (p as any).earthlyBranch;expect(trace(s,id).status).toBe('missing-facts');}
 expect(buildTanBienReading(s,{unverifiedStarLists:true}).sections.find(s=>s.id==='finance')!.claims).toHaveLength(0);
 const rule=catalog.find(r=>r.id===id)!;expect(rule.status).toBe('draft');expect(rule.review).toBeNull();expect(rule.presentation!.contentType).toBe('context');
 expect(executeRules(s,rules(s),'customer').approvedClaims).toHaveLength(0);
});
it('191 §12.5: Kỵ modifies only natal Nhật–Nguyệt same palace; generic Kỵ is never used to invert it',()=>{
 const s=base(),p=q(s),id='tanbien.finance-nhat-nguyet-ky';
 s.chart.fiveElementsClass='Thổ Ngũ Cục';s.chart.lunar.lunarDay=1;

 p.majorStars=[{name:'Thái Dương',scope:'origin',mutagen:''},{name:'Thái Âm',scope:'origin',mutagen:'Kỵ'}] as any;
 p.minorStars=[];expect(trace(s,id).status).toBe('matched');
 const r=buildTanBienReading(s);expect(r.financeAssessment.rows.find(x=>x.title.startsWith('Điều chỉnh Hóa Kỵ'))!.state).toBe('checked');
 p.majorStars[1].mutagen='';expect(trace(s,id).status).toBe('missing-facts');
 p.majorStars[1].mutagen='Kỵ';(p.majorStars[1] as any).scope='annual';expect(trace(s,id).status).toBe('condition-false');
 (p.majorStars[1] as any).scope='origin';delete p.majorStars[1].mutagen;expect(trace(s,id).status).toBe('missing-facts');
 p.majorStars[1].mutagen='';s.chart.palaces.find(x=>x.name==='Quan Lộc')!.majorStars=[{name:'Thái Âm',scope:'origin',mutagen:'Kỵ'}] as any;expect(trace(s,id).status).toBe('missing-facts');
 p.majorStars[1].mutagen='Kỵ';s.chart.fiveElementsClass='Kim Tứ Cục';s.chart.lunar.lunarDay=21;expect(trace(s,id).status).toBe('missing-facts');
});
it('missing palace/lists differ from empty major list; no invented opposing-star claim',()=>{
 const s=base();q(s).majorStars=[];expect(financeConditions(s,[],true).rows.some(r=>r.title==='Không có chính tinh')).toBe(true);
 delete (q(s) as any).majorStars;expect(financeConditions(s,[],true).rows.some(r=>r.title==='Không có chính tinh')).toBe(false);
 s.chart.palaces=s.chart.palaces.filter(p=>p.name!=='Tài Bạch');expect(financeConditions(s,[],false).rows.some(r=>r.text.includes('Chưa xác nhận'))).toBe(true);
});
it('1.25.1 baseline: Career claims and saved main assessments unchanged, snapshots immutable',()=>{
 const rows=JSON.parse(readFileSync('.local/finance-expand-20261012/before.json','utf8'));
 for(const x of rows){const before=JSON.stringify(x.snapshot),r=buildTanBienReading(x.snapshot);const w={claims:executeRules(x.snapshot,x.execution.rules,'internal-draft').previewClaims.filter(c=>c.rules.some(z=>z.presentation?.readingTheme==='work'))}; // Replay the saved catalog, not new 1.36 branches.
 const ordered=(xs:any[])=>xs.map(c=>({text:c.text,rules:c.rules})).sort((a,b)=>a.rules[0].id.localeCompare(b.rules[0].id));expect(ordered(w.claims)).toEqual(ordered(x.execution.previewClaims.filter((c:any)=>c.rules.some((z:any)=>z.presentation?.readingTheme==='work'))));
 expect(JSON.stringify(x.snapshot)).toBe(before);expect(exploration(x.snapshot).financeAssessment).toBeNull();}
 for(const x of JSON.parse(readFileSync('.local/finance-expand-20261012/mains.json','utf8')))expect(careerConditions(x.snapshot,x.frozen.reading.sections.find((s:any)=>s.id==='work').claims,true)).toEqual(x.frozen.reading.careerAssessment);
});
it('real main profiles: no replacement claim to appear more conclusive; specific gaps are accurately bound',()=>{
 for(const [id,needle] of [['022f8c5c-6b60-4974-ab70-60555fca0c58','Thiên Không'],['f63c003d-2d69-4a21-b1e9-a31e60847e95','Song Hao']]){
  const x=JSON.parse(readFileSync('.local/internal-readings/'+id+'.json','utf8'));const r=buildTanBienReading(x.snapshot);
  const claims=r.sections.find(s=>s.id==='finance')!.claims;
  // 1.37 supplements the independent Thiên Không passage (NPL265); never replaces historical claims.
  expect(claims.filter(c=>!c.rules.some(q=>q.id==='tanbien.finance-npl-thien-khong')).map(c=>c.text)).toEqual(x.frozen.reading.sections.find((s:any)=>s.id==='finance').claims.map((c:any)=>c.text));
  expect(claims.filter(c=>c.rules.some(q=>q.id==='tanbien.finance-npl-thien-khong')).length).toBe(needle==='Thiên Không'?1:0);
  expect(r.financeAssessment.rows.some(row=>row.title.includes(needle))).toBe(true);
 }
});
