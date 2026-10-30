import type {InternalReading} from '../internal-review/reading-store';
import type {AiFact} from './contract';
import {menhFacts} from './facts';
import {CHART_BRANCHES} from '../tuvi-engine/chart-integrity';
export function paidRelations(record:InternalReading,target:string){
 const ps=record.snapshot.chart.palaces,at=CHART_BRANCHES.indexOf(ps.find(p=>p.name===target)!.earthlyBranch);
 return new Map(ps.map(p=>{const d=(CHART_BRANCHES.indexOf(p.earthlyBranch)-at+12)%12;return[p.name,d===0?'target':[4,8].includes(d)?'trine':d===6?'opposition':[1,11].includes(d)?'adjacent':'other'] as const;}));
}
/** Read stored fields only. In particular jiangqian12 is NOT a Tân Biên-certified placement. */
export function paidFacts(record:InternalReading,target:string){
 const input=menhFacts(record,target),ps=record.snapshot.chart.palaces,tb=record.snapshot.chart.tanBien;
 const relations=paidRelations(record,target),supplements=new Set(tb?.supplementalStars||[]),trace=tb?.trace.find(t=>t.id==='rings');
 const metadata=(i:number,field:string,verification:NonNullable<AiFact['provenance']>['verification'],source:string)=>({palace:ps[i].name,relation:relations.get(ps[i].name)!,field,scope:'natal' as const,verification,source});
 for(const f of input.facts){const m=/^palace\.(\d+)\.(majorStars|minorStars|adjectiveStars)\.(\d+)$/.exec(f.id);if(!m)continue;const i=Number(m[1]),st=(ps[i] as any)[m[2]][Number(m[3])],t=tb?.trace.find(t=>t.id==='star.'+st.name);f.provenance=metadata(i,m[2],supplements.has(st.name)?'upstream-unverified':t?.status==='source-conflict'?'source-conflict':t?.source?'source-traced':'engine-reported',supplements.has(st.name)?'Sao bổ sung upstream; chưa có phép an Tân Biên được xác minh.':t?.source||'Chỉ danh sách sao đã lưu; chưa xác minh nguồn phép an riêng.');}
 const results=trace?.result as {bacSy?:string[];thaiTue?:string[];trangSinh?:string[]}|undefined;
 for(const [i,p] of ps.entries())for(const field of ['boshi12','suiqian12','changsheng12','jiangqian12'] as const){
  const value=(p as any)[field];if(typeof value!=='string'||!value.trim()){input.missing.push(`${p.name}: thiếu trường ${field}; không suy là vắng sao.`);continue;}
  const cycle=field==='boshi12'?results?.bacSy:field==='suiqian12'?results?.thaiTue:field==='changsheng12'?results?.trangSinh:undefined;
  const values=ps.map(q=>(q as any)[field]);const checked=cycle?.length===12&&new Set(values).size===12&&values.every(v=>cycle.includes(v));
  const verification=field==='jiangqian12'?'upstream-unverified':checked?(field==='changsheng12'?'source-conflict':'source-traced'):'engine-reported';
  const source=field==='jiangqian12'?'Vòng Tướng trước giữ upstream iztro; snapshot.inheritance và trace.rings ghi chưa có phép an trong sách.':trace?.source||'Chưa có trace nguồn vòng sao.';
  const state=field==='boshi12'||field==='suiqian12'?tb?.states[value+'@'+p.earthlyBranch]:undefined;
  input.facts.push({id:`palace.${i}.ring.${field}`,kind:'engine',paths:[`chart.palaces.${i}.${field}`,'chart.tanBien.trace'],text:`${p.name} tại ${p.earthlyBranch}: ${value}; trường ${field}; vòng bản mệnh đã lưu${state?.value?'; trạng thái đã lưu '+state.value:''}. ${field==='jiangqian12'?'Chỉ ghi nhận vị trí upstream, không dùng để diễn giải cá nhân.':field==='changsheng12'?'Trường Sinh là giai đoạn vòng, không phải độ sáng chính tinh; nguồn có bất nhất Suy, không suy sức khỏe hoặc vận hạn.':''}`,provenance:metadata(i,field,verification,source+(field==='changsheng12'?'; '+(trace?.note||''):'') )});
 }
 input.version='paid-facts-1.1.0';return input;
}
