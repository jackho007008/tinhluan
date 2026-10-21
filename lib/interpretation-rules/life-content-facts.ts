import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {emptyLifeFacts} from './life-empty-facts';
import {allLifeExpansionBranches} from './tanbien-life-content';
import {tanBienLifeTables} from './tanbien-source';
/** Read before scope filtering: an incomplete/annual list cannot become a natal absence. */
export function lifeContentFacts(s:ChartSnapshot):DerivedFact[]{
 const proof=emptyLifeFacts(s).find(f=>f.id==='fact.life-complete-major-count');
 if(!proof)return[];
 const i=s.chart.palaces.findIndex(p=>p.name==='Mệnh'),p=s.chart.palaces[i];
 return allLifeExpansionBranches.flatMap(spec=>{
  const present=spec.stars.every(n=>p.majorStars.some(st=>st.name===n));
  const branchOK=spec.branches.length===0||(spec.branches as readonly string[]).includes(p.earthlyBranch);
  const table=spec.table?tanBienLifeTables[spec.table]:null,state=table?.states[p.earthlyBranch];
  if(present&&branchOK&&spec.table&&!state)return[];
  const yes=present&&branchOK&&(!table||state===spec.state);
  return[{id:'fact.life-batch-'+spec.id,derivationId:'life-source-local',version:'1.0.0',value:yes?'yes':'no',text:`Mệnh tại ${p.earthlyBranch}: ${p.majorStars.map(st=>st.name).join(', ')||'không có chính tinh'}.`+(present&&table?` ${table.star}: ${state||'chưa xác định'} theo bảng Tân Biên PDF${table.pdfPage} §${table.section}.`:''),evidencePaths:[`chart.palaces.${i}.majorStars`,`chart.palaces.${i}.earthlyBranch`,...proof.evidencePaths],status:table?'source-table' as const:'engine-reported' as const,limitation:'Chỉ điều kiện cục bộ; không đánh giá toàn cung hay thay trạng thái đã lưu.'}];
 });
}
