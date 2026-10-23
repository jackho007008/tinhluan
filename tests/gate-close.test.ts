import {it,expect} from 'vitest';
import fs from 'node:fs';
import {kinAssessment,kinBranches,kinKey} from '../lib/interpretation-rules/phu-tu';
import {approvedKinBranches} from '../lib/interpretation-rules/kin-approved';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {buildContinuousReport} from '../lib/internal-review/continuous-report';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {familyRules} from '../lib/interpretation-rules/phu-huynh';
import type {ChartSnapshot} from '../lib/tuvi-engine';
const load=(i:number):ChartSnapshot=>JSON.parse(fs.readFileSync(`.local/gate-partial-20261023/after/${i}.json`,'utf8')).snapshot;
const branch=kinBranches.find(r=>r.id==='cu-low-relation')!;
for(const i of [56,156,111,168])it('engine snapshot '+i+' retains local Cự relation and rescue limit without count or global outcome',()=>{
 const s=load(i);expect(kinAssessment(s,branch).value).toBe(true);
 const reading=buildTanBienReading(s),continuous=buildContinuousReport(s,reading,true),report=buildCustomerReport(s,continuous,RULESET_VERSION);
 const ps=report.sections.flatMap(s=>s.paragraphs).filter(p=>p.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.'+kinKey(branch))));
 expect(ps).toHaveLength(1);expect(ps[0].review).toBe('editorial-checked');expect(ps[0].text).toContain('thường giải trừ được khá nhiều');expect(ps[0].text).toContain('chưa có cách áp mức cứu giảm');expect(ps[0].text).not.toMatch(/hai hay ba|hai ba|lần thứ|chắc chắn/);
 const t=structuredClone(s);(t.chart.palaces.find(p=>p.name==='Phu Thê')!.majorStars[0] as any).scope='year';expect(kinAssessment(t,branch).value).not.toBe(true);
 const u=structuredClone(s);u.chart.palaces.find(p=>p.name==='Phu Thê')!.earthlyBranch='Ngọ';expect(kinAssessment(u,branch).value).not.toBe(true);
 delete (s.chart.tanBien as any).completeness;expect(kinAssessment(s,branch).value).toBeUndefined();
});
it('N7 preserves sớm, natal transformation verification and no extra absence gate on unrelated stars',()=>{
 const r=approvedKinBranches.find(r=>r.id==='quyen-early-attainment')!;
 let hits=0;for(let i=0;i<192;i++){const s=load(i);if(kinAssessment(s,r).value!==true)continue;hits++;const t=structuredClone(s);t.chart.natalTransformations={...t.chart.natalTransformations,version:'invalid'} as any;expect(kinAssessment(t,r).value).toBeUndefined();}
 expect(hits).toBe(22);expect(r.customer).toContain('sớm hiển đạt');expect(r.customer).toContain('không đặt mốc tuổi');
});
for(const id of ['tu-pha','tham-thin-tuat','tham-ty-ngo','pha-ty-ngo'])it('source correction '+id+' keeps independent wealth/harmony and removes unsupported separation',()=>{
 const r=familyRules.find(r=>r.id==='tanbien.parents-'+id)!;expect(r.claimTemplate).toMatch(/hòa khí|bất hòa/);expect(r.claimTemplate).not.toMatch(/xa cách|lìa|khắc|làm con nuôi/);expect(r.version).toBe('0.1.1');
});
