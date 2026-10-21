import type { ChartSnapshot } from '../tuvi-engine';
import { verifiedNatalTransformations } from '../tuvi-engine/natal-transformations';
import type { DerivedFact } from './derived';
/** R04 remains Vũ Khúc + natal Quyền, not any Quyền in Mệnh.
 * Verify on the unfiltered snapshot; a contradictory certificate blocks both outcomes.
 */
export function lifeQuyenFact(s: ChartSnapshot): DerivedFact[] {
  const ps=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Mệnh');
  if(ps.length!==1)return [];
  const {p,i}=ps[0];
  if(!Array.isArray(p.majorStars))return [];
  const xs=p.majorStars.map((star,j)=>({star,j})).filter(x=>x.star?.name==='Vũ Khúc');
  if(xs.length!==1)return [];
  const {star,j}=xs[0],base=`chart.palaces.${i}.majorStars.${j}`;
  const cert=verifiedNatalTransformations(s.chart);
  if(s.chart.natalTransformations!==undefined&&!cert)return [];
  if((star as {scope?:string}).scope!=='origin')return [];
  let value:string;
  if(cert){
    const entry=cert.entries.find(e=>e.kind==='Quyền');
    if(!entry)return [];
    value=entry.path===base?'Quyền':'not-quyen';
  }else{
    // A positive, explicit saved witness is usable; empty metadata is not a certificate.
    if(star.mutagen!=='Quyền')return [];
    value='Quyền';
  }
  return [{id:'fact.life-wuqu-origin-mutagen',derivationId:'fact.life-wuqu-origin-mutagen',version:'1.27.1',value,
    text:value==='Quyền'?'Vũ Khúc tại Mệnh có Hóa Quyền bản mệnh.':'Chứng nhận Tứ Hóa bản mệnh đầy đủ xác nhận Vũ Khúc tại Mệnh không mang Hóa Quyền.',
    evidencePaths:[`chart.palaces.${i}.name`,base+'.name',base+'.scope',...(cert?['chart.natalTransformations','chart.tanBien.trace']:[base+'.mutagen'])],
    status:'engine-reported',limitation:'Chỉ dữ kiện của Vũ Khúc dùng bởi R04; thiếu hoặc mâu thuẫn chứng nhận không xác nhận vắng Hóa Quyền.'}];
}
