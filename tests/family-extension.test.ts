import {expect,it} from 'vitest';
import {calculateInternal,freezeReading} from '../lib/internal-review/dynamic-reading';
import {siblingsVuTham,familyExtensionRules} from '../lib/interpretation-rules/family-extension';
import {familyAssessment} from '../lib/interpretation-rules/phu-huynh';
import {executeRules} from '../lib/interpretation-rules/execute';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
const input={date:'2008-11-06',hour:17,minute:0,gender:'male' as const,calendar:'solar' as const,profile:'tanbien-vn-trial-v2',place:'Hà Nội',timezone:'Asia/Ho_Chi_Minh',unknownTime:false,consent:true};
const {snapshot,receipt}=await calculateInternal(input);
it('source exact pair in siblings matches an engine witness without a present-age predicate',()=>{
 expect(familyAssessment(snapshot,siblingsVuTham).value).toBe(true);
 const result=executeRules(snapshot,familyExtensionRules,'internal-draft');
 expect(result.previewClaims).toHaveLength(1);
 const text=result.previewClaims[0].text;
 expect(text).toMatch(/sớm xa nhau/);expect(text).toMatch(/về sau đều giàu có/);
 expect(text).not.toMatch(/ba người|sau \d+|vì vậy|nhờ đó/);
 expect(familyExtensionRules[0].status).toBe('draft');expect(familyExtensionRules[0].review).toBeNull();
});
// These mutations are predicate fixtures, not additional engine charts.
it('wrong palace or only one member fails; opposing stars are not borrowed',()=>{
 for(const whole of [false,true]){
  const s=structuredClone(snapshot),p=s.chart.palaces.find(p=>p.name==='Huynh Đệ')!,q=s.chart.palaces.find(p=>p.name==='Thiên Di')!;
  if(whole)[p.majorStars,q.majorStars]=[q.majorStars,p.majorStars];
  else q.majorStars.push(p.majorStars.pop()!);
  expect(familyAssessment(s,siblingsVuTham).value).toBe(false);
 }
});
it('uncertified, duplicate or non-natal principal data never activates',()=>{
 for(const change of ['incomplete','duplicate','year']){
  const s=structuredClone(snapshot),p=s.chart.palaces.find(p=>p.name==='Huynh Đệ')!;
  if(change==='incomplete')delete(s.chart.tanBien as any).completeness;
  if(change==='duplicate')p.majorStars.push({...p.majorStars[0]});
  if(change==='year')(p.majorStars[0]as any).scope='year';
  expect(familyAssessment(s,siblingsVuTham).value).toBeUndefined();
 }
});
it('does not invent brightness, gender, age or parental void barriers',()=>{
 const s=structuredClone(snapshot),p=s.chart.palaces.find(p=>p.name==='Huynh Đệ')!;
 s.normalized.gender='female';s.normalized.date='2025-11-06';
 p.majorStars.forEach(st=>delete(st as any).brightness);delete(s.chart.tanBien as any).voidRanges;
 expect(familyAssessment(s,siblingsVuTham).value).toBe(true);
});
it('frozen prose preserves both facets, evidence and G2 exclusion from the free projection',()=>{
 const frozen=freezeReading(snapshot,receipt),record:any={snapshot,frozen};
 const paragraph=frozen.customerReport!.sections.flatMap(s=>s.paragraphs).find(p=>p.members.some(m=>m.claim.rules.some(r=>r.id===familyExtensionRules[0].id)))!;
 expect(paragraph).toBeTruthy();expect(paragraph.text).toContain('sớm xa nhau');expect(paragraph.text).toContain('về sau đều giàu có');
 record.accessPolicy=captureReadingPolicy(record);
 expect(record.accessPolicy.freeParagraphIds).not.toContain(paragraph.id);
 expect(JSON.stringify(projectReading(record))).not.toContain(JSON.stringify(paragraph.text));
 expect(JSON.parse(JSON.stringify(record)).frozen.customerReport).toEqual(frozen.customerReport);
});
