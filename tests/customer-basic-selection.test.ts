import {it,expect} from 'vitest';
import fs from 'node:fs';
import {selectBasicSectionIds,type CustomerSection} from '../lib/internal-review/customer-report';
import {captureReportPolicy,projectReading} from '../lib/trial/reading-policy';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
const section=(id:string,hasText=true):CustomerSection=>({id,title:id,palaces:[],intro:null,paragraphs:hasText?[{id:id+'-p',text:'Lời nền và điều kiện đi kèm.'} as CustomerSection['paragraphs'][number]]:[],notices:[]});
it('uses the approved topic order, not identity, positive language or report length',()=>{
 const sections=['life','traits','learning','natal-palace-4','assets'].map(id=>section(id));
 expect(selectBasicSectionIds(sections)).toEqual(['learning','natal-palace-4','assets']);
 sections[4].paragraphs[0].text='Mặt khó và giới hạn của nhà đất.';
 expect(selectBasicSectionIds(sections)).toEqual(['learning','natal-palace-4','assets']);
});
it('falls back to available complete sections and never fills missing topics with notices',()=>{
 const sections=[section('life'),section('learning',false),section('natal-palace-4',false),section('assets',false),section('family')];
 sections[2].notices=[{text:'Chưa có luận giải.',reason:{kind:'unmatched'}}];
 expect(selectBasicSectionIds(sections)).toEqual(['life','family']);
 expect(selectBasicSectionIds([section('empty',false)])).toEqual([]);
});
it('selection leaves every paragraph, adjustment, evidence and limit unchanged on nine engine structures',()=>{
 const samples=JSON.parse(fs.readFileSync('fixtures/customer-reading-samples.json','utf8'));
 for(const sample of samples){
  const report=freezeReading(sample.snapshot,sample.receipt).customerReport!;
  const before=JSON.stringify(report.sections);
  const opening=report.sections.find(s=>s.id==='key-points');
  const rest=report.sections.filter(s=>s.id!=='key-points');
  const ids=[...(opening?['key-points']:[]),...selectBasicSectionIds(rest)];
  expect(report.basicSelectionVersion).toBe('whole-free-groups-1.1.0');
  expect(report.basicSectionIds).toEqual(ids);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.length).toBe((opening?1:0)+Math.min(3,rest.filter(s=>s.paragraphs.length).length));
  expect(JSON.stringify(report.sections)).toBe(before);
  const frozen=freezeReading(sample.snapshot,sample.receipt);
  const policy=captureReportPolicy(report,frozen.continuousReport!.palaces.find(p=>p.name==='Mệnh'));
  const projected=projectReading({snapshot:sample.snapshot,frozen,accessPolicy:policy} as any).report;
  const all=report.sections.flatMap(s=>s.paragraphs),free=projected.sections.flatMap(s=>s.paragraphs);
  expect(free.map(p=>p.id).sort()).toEqual([...policy.freeParagraphIds].sort());
  expect(new Set(free.map(p=>p.id)).size).toBe(free.length);
  for(const p of all){
   if(policy.freeParagraphIds.includes(p.id))expect(free.find(q=>q.id===p.id)).toEqual(p);
   else expect(JSON.stringify(projected)).not.toContain(JSON.stringify(p.text));
  }
  for(const p of opening?.paragraphs??[]){expect(policy.freeParagraphIds).toContain(p.id);expect(rest.flatMap(s=>s.paragraphs).some(q=>q.id===p.id)).toBe(false);}
  for(const id of ids){const topic=report.sections.find(s=>s.id===id)!;expect(topic.paragraphs.length).toBeGreaterThan(0);expect(topic.paragraphs.every(p=>p.claimIds.length>0)).toBe(true);}

 }
});
