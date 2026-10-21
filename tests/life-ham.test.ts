import{buildTanBienReading}from'../lib/internal-review/tanbien-reading';
import {describe,it,expect} from 'vitest';
import {calculate} from '../lib/tuvi-engine';
import {chartIntegrity} from '../lib/tuvi-engine/chart-integrity';
import {lifeContentFacts} from '../lib/interpretation-rules/life-content-facts';
import {lifeExpansionRules} from '../lib/interpretation-rules/tanbien-life-content';
import {tanBienLifeTables} from '../lib/interpretation-rules/tanbien-source';
import {executeRules} from '../lib/interpretation-rules/execute';
import {sourceTablesForRule,nearbyNotes,factEvidence} from '../lib/internal-review/tanbien-presentation';
// Expectations transcribed from PDF36/37 + general clauses79 and90–91, not evaluator output.
const cases=[
 {id:'nguyet-ham-dan-thin-ngo',date:'1978-05-18',hour:1,gender:'female',star:'Thái Âm',table:'taiyin',branches:['Dần','Thìn','Ngọ']},
 {id:'nguyet-ham-mao-ty',date:'1978-08-06',hour:9,gender:'female',star:'Thái Âm',table:'taiyin',branches:['Mão','Tỵ']},
 {id:'tuong-ham-mao-dau',date:'1998-02-18',hour:9,gender:'male',star:'Thiên Tướng',table:'tianxiang',branches:['Mão','Dậu']},
];
const life=(s:any)=>s.chart.palaces.find((p:any)=>p.name==='Mệnh');
for(const c of cases){const s=await calculate({date:c.date,hour:c.hour,minute:0,unknownTime:false,place:'Hà Nội',gender:c.gender,calendar:'solar',profile:'tanbien-vn-trial-v2',timezone:'Asia/Ho_Chi_Minh',consent:true});const r=lifeExpansionRules.find(r=>r.id==='tanbien.life-batch-'+c.id)!;
 const status=(x:any)=>executeRules(x,[r],'internal-draft').traces[0].status;
 describe(c.id,()=>{
 it('real engine witness, one separate draft gloss; no customer leakage',()=>{expect(chartIntegrity(s.chart).valid).toBe(true);expect(life(s).majorStars.map((x:any)=>x.name)).toContain(c.star);expect(c.branches).toContain(life(s).earthlyBranch);expect(status(s)).toBe('matched');expect(executeRules(s,[r],'internal-draft').previewClaims).toHaveLength(1);expect(r.presentation?.contentType).toBe('element-gloss');expect(r.review).toBeNull();expect(r.status).toBe('draft');expect(executeRules(s,[r],'customer').traces[0].status).toBe('not-approved');expect(sourceTablesForRule(r)).toHaveProperty(c.table);expect(nearbyNotes(s,r.id)[0].text).toBe(r.presentation?.readerLimit);expect(factEvidence(s,r.requiredFacts[0]).kind).toBe('source');expect(buildTanBienReading(s).lifeMajorNotice).toBeNull();});
 it('each specified branch matches; other branches do not (technical geometry fixtures)',()=>{for(const branch of ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi']){const x=structuredClone(s),p=life(x),q=x.chart.palaces.find(z=>z.earthlyBranch===branch)!;[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];expect(status(x)).toBe(c.branches.includes(branch)?'matched':'condition-false');}});
 it('wrong palace or required star absent is false with complete data',()=>{const x=structuredClone(s),p=life(x),q=x.chart.palaces.find(z=>z.name==='Quan Lộc')!;[p.majorStars,q.majorStars]=[q.majorStars,p.majorStars];expect(status(x)).toBe('condition-false');});
 it('missing completeness, missing star list and annual scope remain unknown',()=>{for(const mutate of[(x:any)=>delete x.chart.tanBien.completeness,(x:any)=>delete life(x).majorStars,(x:any)=>life(x).majorStars[0].scope='yearly']){const x=structuredClone(s);mutate(x);expect(status(x)).toBe('missing-facts');}});
 it('missing source entry/table stays unknown; wrong source state false; raw state cannot fill it',()=>{const tables=tanBienLifeTables as any,t=tables[c.table],branch=life(s).earthlyBranch,original=t.states[branch];try{delete t.states[branch];expect(status(s)).toBe('missing-facts');t.states[branch]='Miếu';expect(status(s)).toBe('condition-false');delete tables[c.table];expect(status(s)).toBe('missing-facts');}finally{tables[c.table]=t;t.states[branch]=original;}const x=structuredClone(s);life(x).majorStars[0].brightness='Miếu';life(x).majorStars[0].originalBrightness='Miếu';expect(status(x)).toBe('matched');});
 it('co-present major is retained, not interpreted as a combination; no invented solitude condition',()=>{const x=structuredClone(s),p=life(x),q=x.chart.palaces.find(z=>z.name!=='Mệnh'&&z.majorStars.length)!;p.majorStars.push(q.majorStars.pop()!);expect(status(x)).toBe('matched');const f=lifeContentFacts(x).find(f=>f.id===r.requiredFacts[0])!;expect(f.text).toContain(p.majorStars[1].name);expect(r.presentation?.readerLimit).toMatch(/tổ hợp|chính tinh/);});
 it('does not mutate the snapshot',()=>{const before=JSON.stringify(s);executeRules(s,[r],'internal-draft');expect(JSON.stringify(s)).toBe(before);});
 });}
