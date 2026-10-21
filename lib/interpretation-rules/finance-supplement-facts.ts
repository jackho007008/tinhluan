import type { ChartSnapshot } from '../tuvi-engine';
import type { DerivedFact } from './derived';
import { verifiedNatalTransformations } from '../tuvi-engine/natal-transformations';
import { financeSupplements } from './tanbien-finance-content';
/** finance-expansion/1.0.0. Only local natal witnesses; no inference from missing metadata. */
export function financeSupplementFacts(s:ChartSnapshot):DerivedFact[]{
 const qs=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Tài Bạch');if(qs.length!==1)return[];
 const {p,i}=qs[0],base=`chart.palaces.${i}`,fields=['majorStars','minorStars','adjectiveStars']as const,c=s.chart.tanBien?.completeness;
 const valid=(st:any)=>st&&typeof st.name==='string'&&st.name.trim()&&st.scope==='origin';
 const all=fields.flatMap(f=>Array.isArray(p[f])?p[f].filter(valid):[]);
 const majorFull=c?.majorStars==='complete'&&Array.isArray(p.majorStars)&&p.majorStars.every(valid);
 const full=majorFull&&c?.minorStars==='complete-with-declared-supplements'&&fields.every(f=>Array.isArray(p[f])&&p[f].every(valid));
 const cert=verifiedNatalTransformations(s.chart),bad=s.chart.natalTransformations!==undefined&&!cert;
 const mutagen=(kind:string):boolean|undefined=>bad?undefined:all.some(st=>st.mutagen===kind)?true:cert?false:undefined;
 const majors=Array.isArray(p.majorStars)?p.majorStars.filter(valid).map(st=>st.name):[];
 const pair=majors.includes('Thái Dương')&&majors.includes('Thái Âm')?true:majorFull?false:undefined;
 const result:DerivedFact[]=financeSupplements.flatMap(spec=>{
  let v:boolean|undefined;
  if(spec.id==='loc-position')v=mutagen('Lộc');
  else if(spec.id==='ky-general'){const ky=mutagen('Kỵ');v=ky===false||pair===true?false:ky===true&&pair===false?true:undefined;}
  else if(spec.id==='phuc-binh')v=all.some(st=>st.name==='Phục Binh')||(p as typeof p & {boshi12?:string}).boshi12==='Phục Binh'?true:full&&typeof (p as typeof p & {boshi12?:string}).boshi12==='string'?false:undefined;
  else v=spec.stars.every(n=>all.some(st=>st.name===n))?true:full?false:undefined;
  if(v===undefined)return[];
  return[{id:'fact.finance-extra-'+spec.id,derivationId:'finance-extra-'+spec.id,version:'1.0.0',value:v?'yes':'no',text:spec.title+(v?' — đủ điều kiện vị trí bản mệnh.':' — dữ kiện xác nhận không thỏa điều kiện.'),evidencePaths:[base+'.name',...fields.filter(f=>Array.isArray(p[f])).map(f=>base+'.'+f),...(spec.id==='phuc-binh'&&typeof (p as typeof p & {boshi12?:string}).boshi12==='string'?[base+'.boshi12']:[]),...(cert?['chart.natalTransformations','chart.tanBien.trace']:[])],status:'engine-reported' as const,limitation:'Chỉ Tài Bạch bản mệnh; không dùng trạng thái sao hoặc coi thiếu dữ liệu là vắng mặt.'}];
 });
 const ky=mutagen('Kỵ');if(ky!==undefined)result.push({id:'fact.finance-origin-ky',derivationId:'finance-origin-ky',version:'1.0.0',value:ky?'yes':'no',text:ky?'Có Hóa Kỵ bản mệnh tại Tài Bạch.':'Chứng nhận Tứ Hóa xác nhận Kỵ ở cung khác.',evidencePaths:[base+'.name',...fields.filter(f=>Array.isArray(p[f])).map(f=>base+'.'+f),...(cert?['chart.natalTransformations']:[])],status:'engine-reported',limitation:'Chứng nhận sai giữ unknown; không tính lại snapshot.'});
 if(majorFull)result.push({id:'fact.finance-single-complete',derivationId:'finance-single-complete',version:'1.0.0',value:majors.length===1?'yes':'no',text:'Danh sách chính tinh bản mệnh đầy đủ tại Tài Bạch: '+majors.join(', '),evidencePaths:[base+'.majorStars','chart.tanBien.completeness'],status:'engine-reported',limitation:'Giới hạn sản phẩm để không lặp nhánh tổ hợp; không gán điều kiện độc thủ cho câu tọa thủ trong sách.'});
 return result;
}
