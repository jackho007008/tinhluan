import { verifiedNatalTransformations } from '../tuvi-engine/natal-transformations';
import type { ChartSnapshot } from '../tuvi-engine';
import type { DerivedFact } from './derived';
/** Source spec career-source-decision-1.0.0, PDF32 §1.10.
 * A positive saved witness is enough when no certificate exists.
 * A supplied inconsistent certificate blocks both outcomes; absence requires a verified certificate.
 * Caller may pass unfiltered snapshots. Never infer origin from missing scope.
 */
export function careerQuyenFact(s: ChartSnapshot): DerivedFact[] {
  const qs = s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Quan Lộc');
  if(qs.length!==1) return [];
  const {p,i}=qs[0], base=`chart.palaces.${i}`;
  const fields=['majorStars','minorStars'] as const;
  const paths:string[]=[];
  for(const field of fields) if(Array.isArray(p[field])) p[field].forEach((st,j)=>{
    if(st && typeof st.name==='string' && st.name.trim() && (st as {scope?:string}).scope==='origin' && st.mutagen==='Quyền')
      paths.push(`${base}.${field}.${j}.name`,`${base}.${field}.${j}.scope`,`${base}.${field}.${j}.mutagen`);
  });
  const certified = verifiedNatalTransformations(s.chart);
  // Never ignore a supplied contradictory/unsupported certificate, even for a positive witness.
  if (s.chart.natalTransformations !== undefined && !certified) return [];
  if (certified && (certified.entries.find(e => e.kind === 'Quyền')?.palace === 'Quan Lộc') !== Boolean(paths.length)) return [];
  if (!paths.length && !certified) return [];
  return [{id:'fact.career-origin-quyen-position',derivationId:'career-origin-quyen-position',version:'1.1.0',value:paths.length?'present':'absent',text:paths.length?'Có Hóa Quyền bản mệnh tại Quan Lộc.':'Chứng nhận Tứ Hóa bản mệnh đầy đủ xác nhận Hóa Quyền ở cung khác, không tại Quan Lộc.',evidencePaths:[`${base}.name`,...(paths.length?paths:['chart.natalTransformations','chart.tanBien.trace'])],status:'engine-reported',limitation:'Chỉ vị trí Tứ Hóa đã lưu; không xác nhận kết quả công việc, không coi thiếu metadata là không có sao.'}];
}
