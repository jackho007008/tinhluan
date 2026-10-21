import type {InternalReading} from '../internal-review/reading-store';
import type {ContinuousReport} from '../internal-review/continuous-report';
import type {CustomerReport} from '../internal-review/customer-report';
export const READING_POLICY='menh-free-1.0.0' as const;
export type ReadingPolicy={version:typeof READING_POLICY;freeParagraphIds:string[];heldGroups:{id:string;reason:string}[]};
export type PalaceAccess={name:string;target:string;state:'free'|'available'|'locked'|'empty'};
export type ReadingScope={policy:string;full:boolean;palaces:PalaceAccess[];heldCount:number};
/** Capture at creation using frozen semantic palace groups; never infer scope from prose/headings. */
export function captureReadingPolicy(record:InternalReading):ReadingPolicy{
 return captureReportPolicy(record.frozen.customerReport,record.frozen.continuousReport?.palaces.find(p=>p.name==='Mệnh'));
}
/** Same G2 contract used for saved opening selection; no policy expansion. */
export function captureReportPolicy(report:CustomerReport|undefined,life:ContinuousReport['palaces'][number]|undefined):ReadingPolicy{
 const heldGroups:ReadingPolicy['heldGroups']=[];
 const groups=life?.groups??[],allowedClaims=new Set<string>();
 for(const g of groups){
  // These claims explicitly discuss the body palace, not only Mệnh. Keep the entire group for scope review.
  if(g.members.some(m=>m.claim.rules.some(r=>/^(tanbien|npl)\.life-body-/.test(r.id)))){heldGroups.push({id:g.id,reason:'body-palace-cross-scope'});continue;}
  g.claimIds.forEach(id=>allowedClaims.add(id));
 }
 const paragraphs=report?.sections.flatMap(s=>s.paragraphs)??[];
 const eligible=(p:typeof paragraphs[number])=>p.claimIds.length>0&&p.claimIds.every(id=>allowedClaims.has(id))&&p.members.length>0&&p.members.every(m=>allowedClaims.has(m.claim.id))&&p.relations.every(r=>{
  const ids=(r as {claimIds?:string[]}).claimIds;return Array.isArray(ids)&&ids.length>0&&ids.every(id=>allowedClaims.has(id));
 });
 // A relation crossing the boundary withholds its whole connected group, not one sentence or exception.
 let changed=true;while(changed){changed=false;for(const p of paragraphs)if(p.claimIds.some(id=>allowedClaims.has(id))&&!eligible(p)){p.claimIds.forEach(id=>{if(allowedClaims.delete(id))changed=true;});if(!heldGroups.some(g=>g.id===p.id))heldGroups.push({id:p.id,reason:'incomplete-or-cross-scope-relation'});}}
 return {version:READING_POLICY,freeParagraphIds:paragraphs.filter(eligible).map(p=>p.id),heldGroups};
}
export function projectReading(record:InternalReading,full=false):{report:CustomerReport;scope:ReadingScope}{
 const saved=record.frozen.customerReport;if(!saved)throw Error('CUSTOMER_REPORT_MISSING');
 const policy=record.accessPolicy;
 // Only absence denotes a legacy edition. Unknown/malformed policy never upgrades to full.
 const legacy=policy===undefined,known=policy?.version===READING_POLICY;
 full=legacy||full;
 const selected=new Set(known&&Array.isArray(policy.freeParagraphIds)?policy.freeParagraphIds:[]);
 const semantic=record.frozen.continuousReport;
 const palaces:PalaceAccess[]=(saved.palaces??[]).map(p=>{
  const hasContent=!!semantic?.palaces.find(x=>x.name===p.name)?.groups.length;
  return {name:p.name,target:p.target,state:p.name==='Mệnh'?'free':!hasContent?'empty':full?'available':'locked'};
 });
 const scope:ReadingScope={policy:legacy?'legacy-full-trial':policy?.version||'unknown',full,palaces,heldCount:policy?.heldGroups?.length??0};
 if(full)return {report:saved,scope};
 const sections=saved.sections.filter(s=>s.palaces.length===1&&s.palaces[0]==='Mệnh').map(s=>({...s,paragraphs:s.paragraphs.filter(p=>selected.has(p.id))}));
 // No locked originals, traces, unplaced claims, gap evidence or section intros enter the browser.
 const report:CustomerReport={...saved,sections,basicSectionIds:sections.map(s=>s.id),unplaced:[],palaces:saved.palaces.map(p=>({...p,details:{facts:(p.details as {facts?:unknown})?.facts??null}}))};
 return {report,scope};
}
