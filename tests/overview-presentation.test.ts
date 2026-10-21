import {completionRules,completionBranches} from '../lib/interpretation-rules/natal-completion';
import {it,expect} from 'vitest';
import fs from 'node:fs';
import {overviewPresentation} from '../lib/internal-review/overview-presentation';
import {buildTanBienReading} from '../lib/internal-review/tanbien-reading';
import {exploration} from '../lib/exploration/model';
const record=JSON.parse(fs.readFileSync('.local/internal-readings/c926df81-1d36-46a2-88ce-edb48ab0e80b.json','utf8'));
const s=record.snapshot;
it('empty Nô/Tử topics bind their actual palace; never default to Mệnh',()=>{
 const r=buildTanBienReading(s),v=r.overviewPresentation!;
 const no=v.topics.find(t=>t.id==='no')!,tu=v.topics.find(t=>t.id==='children')!;
 expect(no.subjects).toEqual(['Nô Bộc']);expect(no.facts.map(f=>f.text).join(' ')).toContain('Thiên Lương');expect(no.facts[0].text).toBe('Nô Bộc tại Tỵ.');
 expect(tu.subjects).toEqual(['Tử Nữ']);expect(tu.facts[0].text).toBe('Tử Nữ tại Dậu.');expect(tu.facts[1].text).toBe('Tử Nữ không có chính tinh tọa thủ.');
 expect([...no.facts,...tu.facts].some(f=>f.text.includes('Vũ Khúc'))).toBe(false);
});
it('missing/unverified list differs from certified empty; unknown topic stays unknown',()=>{
 const sections=[{id:'children',title:'Tử Nữ',claims:[]},{id:'not-mapped',title:'Other',claims:[]}];
 expect(overviewPresentation(s,sections,false).topics[0].facts[1].text).toContain('Chưa xác minh');
 const x=structuredClone(s);delete x.chart.palaces.find((p:any)=>p.name==='Tử Nữ').majorStars;
 expect(overviewPresentation(x,sections,true).topics[0].facts[1].text).toContain('Chưa có dữ liệu');
 const u=overviewPresentation(s,sections,true).topics[1];expect(u.unknownSubject).toBe(true);expect(u.subjects).toEqual([]);expect(u.facts).toEqual([]);
});
it('cross-palace topics preserve multiple explicit subjects',()=>{
 const v=overviewPresentation(s,[{id:'life-body',title:'Mệnh–Thân',claims:[]},{id:'no',title:'Nô Bộc',claims:[{rules:[{id:'tanbien.no-tl-test'}]}]}],true);
 expect(v.topics[0].subjects).toEqual(['Mệnh','Quan Lộc']);expect(v.topics[1].subjects).toEqual(['Nô Bộc','Mệnh','Huynh Đệ']);expect(v.topics.every(t=>t.kind==='multi-palace')).toBe(true);
});
it('selected factors explicitly illustrative, not a complete synthesis status; history unchanged',()=>{
 const original=JSON.stringify(record);const v=buildTanBienReading(s).overviewPresentation!;
 expect(v.factorNotice).toContain('không phải danh sách đầy đủ');expect(v.factorNotice).toContain('đã tham gia điều kiện');
 expect(exploration(s,record.frozen).overviewPresentation).toBeNull();expect(JSON.stringify(record)).toBe(original);
});
it('Canh/Nhâm context retains claim but distinguishes actual void locations',()=>{
 const r=buildTanBienReading(s);// Current catalog adds only M05/M07; every historical claim remains byte-equivalent.
 const newIds=['tanbien.life-wu-literary-male','tanbien.life-ky-khoa-ty-hoi',...completionRules.map(r=>r.id)];
 expect(r.execution.previewClaims.filter(c=>!c.rules.some(q=>newIds.includes(q.id)))).toEqual(record.frozen.reading.execution.previewClaims);
 expect(r.execution.derivedFacts.filter(f=>!f.id.startsWith('fact.life-literary-')&&!completionBranches.some(r=>f.id==='fact.'+r.id))).toEqual(record.frozen.reading.execution.derivedFacts);
 expect(r.execution.traces.filter(t=>!newIds.includes(t.ruleId))).toEqual(record.frozen.reading.execution.traces);
 const p=r.sections.flatMap(x=>x.paragraphs).find(p=>p.claim.rules.some(r=>r.id==='tanbien.life-vu-phu-ty-canh-nham'))!;
 expect(JSON.stringify(p)).toContain('Tuần tại Tuất–Hợi');expect(JSON.stringify(p)).toContain('Triệt tại Dần–Mão');expect(JSON.stringify(p)).toContain('không án ngữ trực tiếp tại Mệnh');
});
