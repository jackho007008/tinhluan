import {it,expect} from 'vitest';import fs from 'node:fs';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {editCustomerTopics,customerTopicOwner} from '../lib/internal-review/customer-topic-editorial';
import type {CustomerSection} from '../lib/internal-review/customer-report';
const samples=JSON.parse(fs.readFileSync('fixtures/customer-reading-samples.json','utf8'));
it('shared finance lives under the palace with content, with historical placement unchanged',()=>{
 const section={id:'assets',palaces:['Tài Bạch','Điền Trạch']},palaces=[{name:'Điền Trạch'},{name:'Quan Lộc'},{name:'Tài Bạch'}];
 const scope=[{name:'Điền Trạch',state:'empty'},{name:'Tài Bạch',state:'available'}];
 expect(customerTopicOwner('1.54.0',section,palaces,scope)).toBe('Tài Bạch');
 expect(customerTopicOwner('1.53.0',section,palaces,scope)).toBe('Điền Trạch');
 expect(customerTopicOwner('1.54.0',section,palaces,[{name:'Điền Trạch',state:'available'},{name:'Tài Bạch',state:'empty'}])).toBe('Điền Trạch');
 expect(customerTopicOwner('1.54.0',{id:'work',palaces:['Quan Lộc']},palaces,scope)).toBe('Quan Lộc');
});
it('retains every original claim, adjustment and exception in the topic evidence',()=>{
 for(const sample of samples){const f=freezeReading(sample.snapshot,sample.receipt),r=f.customerReport!;
  for(const name of ['Quan Lộc','Tài Bạch','Điền Trạch'])for(const g of f.continuousReport!.palaces.find(p=>p.name===name)!.groups){const p=r.sections.flatMap(s=>s.paragraphs).find(p=>p.id===g.id)!;expect(p).toBeDefined();expect(p.members).toEqual(g.members);expect(p.original).toEqual(g.text);expect(p.claimIds).toEqual(g.claimIds);expect(new Set(p.sentences.flatMap(s=>s.claimIds))).toEqual(new Set(p.claimIds));}
  const ids=r.sections.flatMap(s=>s.paragraphs.map(p=>p.id));expect(new Set(ids).size).toBe(ids.length);
 }
});
it('local contrasts follow all participants, broad boundary stays after the topics',()=>{
 const r=freezeReading(samples[0].snapshot,samples[0].receipt).customerReport!,a=r.sections.find(s=>s.id==='assets')!;
 const note=a.paragraphs.find(p=>p.id==='customer-relation-retention-unresolved')!;
 expect(note).toBeDefined();for(const id of note.claimIds){const base=a.paragraphs.findIndex(p=>!p.id.startsWith('customer-')&&p.claimIds.includes(id));expect(base).toBeGreaterThanOrEqual(0);expect(base).toBeLessThan(a.paragraphs.indexOf(note));}
 expect(note.relations).toEqual(expect.arrayContaining([expect.objectContaining({kind:'unresolved'})]));
 const end=a.paragraphs.slice(-2).map(p=>p.id);expect(end).toContain('customer-relation-money-property');expect(end).toContain('customer-relation-work-income-boundary');
});
it('unseen mixtures are not split, renamed as single-facet, dropped or given an invented relation',()=>{
 const f=freezeReading(samples[0].snapshot,samples[0].receipt),r=structuredClone(f.customerReport!),a=r.sections.find(s=>s.id==='assets')!;
 const p=structuredClone(a.paragraphs.find(p=>!p.id.startsWith('customer-'))!);p.id='technical-fixture-mixed';p.members[0].claim.rules[0].id='unclassified-future-rule';p.text='Điều kiện và ngoại lệ giữ nguyên.';p.title='Tiền bạc';
 const s:CustomerSection={...a,paragraphs:[p],notices:[]};const before=JSON.stringify(p);editCustomerTopics([s],f.continuousReport!);expect(s.paragraphs).toHaveLength(1);expect(JSON.stringify(s.paragraphs[0])).toBe(before);
});
it('property inheritance and maintenance stay in one paragraph with its qualifying condition',()=>{
 const f=freezeReading(samples.find((s:any)=>s.role===1).snapshot,samples.find((s:any)=>s.role===1).receipt),ps=f.customerReport!.sections.find(s=>s.id==='assets')!.paragraphs;
 const adjustment=ps.find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id==='tanbien.dien-void-co-cu')))!;
 expect(adjustment.text).toContain('Triệt trực tiếp');expect(adjustment.text).toContain('khó hoặc chậm');expect(adjustment.text).toContain('hao hụt');expect(adjustment.text).not.toContain('Tuần trực tiếp');expect(adjustment.title).toBe('Tạo lập và duy trì nhà đất');
});
