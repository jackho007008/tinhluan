import {TB_FAMILY_PHUC_IDS} from '../lib/interpretation-rules/tb-family-phuc-clauses';
import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {catalog} from '../lib/interpretation-rules/catalog';
import {CUSTOMER_EDITORIAL,DYNAMIC_CUSTOMER_RULES,makeCustomerParagraph} from '../lib/internal-review/customer-report';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
const samples=JSON.parse(fs.readFileSync('fixtures/customer-reading-samples.json','utf8'));
const x=samples[0],continuous=freezeReading(x.snapshot,x.receipt).continuousReport!;
const prototype=continuous.palaces[0].groups[0];
const active=catalog.filter(r=>r.kind==='interpretation'&&(r.id.startsWith('tanbien.')||r.id.startsWith('npl.life-')));
// Rendering fixtures only. They do not assert applicability or engine validity.
const groupFor=(rules:typeof active)=>({...structuredClone(prototype),editorial:null,text:rules.map(r=>r.claimTemplate).join(' '),claimIds:rules.map(r=>'fixture:'+r.id),members:rules.map(r=>({...structuredClone(prototype.members[0]),original:r.claimTemplate,claim:{...prototype.members[0].claim,id:'fixture:'+r.id,rules:[r]}}))});
describe('Customer catalog coverage and compositional safety',()=>{
 it('every active branch has a version-bound copy or explicit fact-driven presenter',()=>{
  expect(new Set(active.map(r=>r.id)).size).toBe(active.length);
  for(const rule of active){const copy=CUSTOMER_EDITORIAL[rule.id];if(!copy){expect(DYNAMIC_CUSTOMER_RULES).toContain(rule.id);continue;}
   expect(copy.sourceVersion).toBe(rule.version);expect(copy.sourceTemplate).toBe(rule.claimTemplate);
   const g=groupFor([rule]),p=makeCustomerParagraph(g,continuous,x.snapshot);
   expect(p.review,rule.id).toBe('editorial-checked');expect(p.text.length).toBeGreaterThan(25);
   expect(TB_FAMILY_PHUC_IDS.includes(rule.id)?p.text.replace(/^Theo Tân Biên, /,''):p.text,rule.id).not.toMatch(/Tân Biên|Nguyễn Phát Lộc|evaluator|snapshot|\bclaim\b|\{\{|undefined/);
   expect(p.members[0].claim.rules[0].conditions).toEqual(rule.conditions);
   expect(p.members[0].claim.rules[0].exceptions).toEqual(rule.exceptions);
   expect(p.members[0].claim.rules[0].sourceReferences).toEqual(rule.sourceReferences);
   expect(p.sentences.every(s=>s.claimIds.includes('fixture:'+rule.id))).toBe(true);
  }
 });
 it('unseen groups keep every meaning and trace without requiring a composite key',()=>{
  const selected=['tanbien.r11','tanbien.finance-co-luong','tanbien.finance-extra-ky-general'].map(id=>active.find(r=>r.id===id)!);
  const p=makeCustomerParagraph(groupFor(selected),continuous,x.snapshot);
  expect(p.review).toBe('editorial-checked');for(const id of p.claimIds)expect(p.sentences.some(s=>s.claimIds.includes(id))).toBe(true);
  for(const meaning of ['dễ chán','bỏ dở','tạo dựng','hao'])expect(p.text).toContain(meaning);
  expect(p.text).not.toMatch(/vì vậy|nhờ đó|bù lại|kiếm được nhưng không giữ được/);
 });
 it('exact duplicate prose is shown once but all contributing claims remain traceable',()=>{
  const rule=active.find(r=>r.id==='tanbien.r11')!,g=groupFor([rule]);g.members.push({...structuredClone(g.members[0]),claim:{...g.members[0].claim,id:'second'}});g.claimIds.push('second');
  const p=makeCustomerParagraph(g,continuous,x.snapshot);expect(p.text.match(/bỏ dở/g)).toHaveLength(1);expect(p.claimIds).toContain('second');
  expect(p.sentences.some(s=>s.claimIds.includes('second'))).toBe(true);
 });
 it('unknown or changed catalog versions remain visible as editorial gaps, never silently omitted',()=>{
  const rule=structuredClone(active.find(r=>r.id==='tanbien.r11')!);rule.version='999';
  const p=makeCustomerParagraph(groupFor([rule]),continuous,x.snapshot);expect(p.review).toBe('pending-editorial');expect(p.original).toBe(rule.claimTemplate);expect(p.text).toContain('chờ biên tập');
 });
 it('partial groups do not acquire a Liêm–Tướng adjustment from a name alone',()=>{
  const g=groupFor([active.find(r=>r.id==='tanbien.r10')!,active.find(r=>r.id==='tanbien.r09')!]);
  const p=makeCustomerParagraph(g,continuous,x.snapshot);expect(p.text).toContain('nóng nảy');expect(p.text).not.toContain('tiết chế');
 });
 it('same-object grouping retains the adverse alternative and does not merge parent-parent with parent-child',()=>{
  const g=groupFor(['tanbien.parents-co-cu','tanbien.parents-ky'].map(id=>active.find(r=>r.id===id)!));g.editorial='existing specified relation' as never;
  const p=makeCustomerParagraph(g,continuous,x.snapshot);for(const phrase of ['trong nhà thiếu hòa khí','giữa cha mẹ với nhau','hoặc không hợp tính giữa cha mẹ và con'])expect(p.text).toContain(phrase);
  expect(p.text).not.toContain('xa cách');expect(p.claimIds).toHaveLength(2);
 });
});
it('an empty Điền subsection does not label the whole financial topic empty',async()=>{
 const {buildCustomerReport}=await import('../lib/internal-review/customer-report');
 const r=structuredClone(continuous),dien=r.palaces.find(p=>p.name==='Điền Trạch')!;
 dien.groups=[];dien.gap={kind:'no-implemented-match',text:'Các nhánh không khớp',reasons:[],traces:[],ruleIds:[],explanation:'Fixture chỉ kiểm tra nhãn khoảng trống.'};
 const customer=buildCustomerReport(x.snapshot,r,'interpretation-1.45.0'),assets=customer.sections.find(s=>s.id==='assets')!;
 expect(assets.paragraphs.length).toBeGreaterThan(0);expect(assets.notices.some(n=>n.text.startsWith('Nhà đất: '))).toBe(true);
 expect(assets.notices.some(n=>n.text==='Phần này hiện chưa có luận giải.')).toBe(false);
});
