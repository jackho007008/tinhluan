import { readingContext, factEvidence } from '../lib/internal-review/tanbien-presentation';
import fs from'node:fs';import{describe,it,expect}from'vitest';
import{lifeQuyenFact}from'../lib/interpretation-rules/life-quyen-fact';
import{executeRules}from'../lib/interpretation-rules/execute';
import{tanBienRules}from'../lib/interpretation-rules/profile-rules';
const yes=JSON.parse(fs.readFileSync('.local/life-patch-20261012/positive.json','utf8')).snapshot;
const rows=JSON.parse(fs.readFileSync('.local/life-patch-20261012/before.json','utf8'));
const no=rows.find((r:any)=>r.snapshot.chart.palaces.find((p:any)=>p.name==='Mệnh').majorStars.some((s:any)=>s.name==='Vũ Khúc')&&lifeQuyenFact(r.snapshot)[0]?.value==='not-quyen').snapshot;
const clone=(s:any)=>structuredClone(s),out=(s:any)=>lifeQuyenFact(s)[0]?.value??'unknown',rule=tanBienRules(yes).find((r:any)=>r.id==='tanbien.r04')!;
const st=(s:any)=>s.chart.palaces.find((p:any)=>p.name==='Mệnh').majorStars.find((s:any)=>s.name==='Vũ Khúc');
describe('R04 certificate1.27.1; mutated cases are technical fixtures',()=>{
 it('engine positive, certified negative, unchanged source rule',()=>{expect(out(yes)).toBe('Quyền');expect(out(no)).toBe('not-quyen');expect(rule.conditions).toEqual(rows[0].execution.rules.find((r:any)=>r.id==='tanbien.r04').conditions);expect(rule.claimTemplate).toEqual(rows[0].execution.rules.find((r:any)=>r.id==='tanbien.r04').claimTemplate);});
 it.each(['missing','version','scope','status','path','palace','method','source'])('%s invalid certificate cannot prove absence',key=>{const s=clone(no);if(key==='missing')delete s.chart.natalTransformations;else if(['path','palace'].includes(key))s.chart.natalTransformations.entries[1][key]='invalid';else s.chart.natalTransformations[key]='invalid';expect(out(s)).toBe('unknown');});
 it('positive legacy witness usable, supplied contradiction unknown',()=>{const s=clone(yes);delete s.chart.natalTransformations;expect(out(s)).toBe('Quyền');const t=clone(yes);t.chart.natalTransformations.entries[1].path='chart.palaces.99.majorStars.0';expect(out(t)).toBe('unknown');const u=clone(no);st(u).mutagen='Quyền';expect(out(u)).toBe('unknown');});
 it.each(['yearly','decadal'])('does not accept %s',scope=>{const s=clone(yes);st(s).scope=scope;expect(out(s)).toBe('unknown');delete s.chart.natalTransformations;expect(out(s)).toBe('unknown');});
 it.each([undefined,'','Lộc'])('missing/empty/non-Quyen metadata alone is not certified absence: %s',value=>{const s=clone(no);delete s.chart.natalTransformations;if(value===undefined)delete st(s).mutagen;else st(s).mutagen=value;expect(out(s)).toBe('unknown');});
 it('evidence uses the same contract and avoids a false missing-field warning',()=>{expect(factEvidence(no,'fact.life-wuqu-origin-mutagen').text).toContain('không mang Hóa Quyền');expect(readingContext(no,'action').items.some(i=>i.text.includes('Vũ Khúc tại Mệnh chưa lưu'))).toBe(false);const s=clone(no);delete s.chart.natalTransformations;delete st(s).mutagen;expect(readingContext(s,'action').items.some(i=>i.text.includes('Vũ Khúc tại Mệnh chưa lưu'))).toBe(true);});
 it('immutable history and draft gate',()=>{for(const s of[yes,no]){const before=JSON.stringify(s);lifeQuyenFact(s);expect(JSON.stringify(s)).toBe(before);}expect(executeRules(yes,[rule],'customer').traces[0].status).toBe('not-approved');});
});
