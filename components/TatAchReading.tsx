import type { TatAchReading as Data } from '../lib/internal-review/tat-ach';
export function TatAchReading({data,internal=true,editorial=false}:{data:Data;internal?:boolean;editorial?:boolean}){
 return <section data-tat-ach data-snapshot={data.snapshotId}>
  {!editorial&&<h3>Tật Ách{data.branch?' tại '+data.branch:''}</h3>}<p>{data.notice}</p>
  <h4>Dữ kiện nổi bật</h4>
  {data.groups.map(g=><p key={g.label}>{g.label}: {g.stars.map(s=>s.name+(s.sourceState?' ('+s.sourceState+')':'')).join(', ')|| (g.complete?(editorial?(g.label==='Chính tinh'?'Không có chính tinh tọa thủ.':'Không có '+g.label.toLowerCase()+' bản mệnh tại cung này.'):'Không có sao trong danh sách đầy đủ.'):'Chưa có danh sách được xác nhận đầy đủ.')}{!g.complete&&g.stars.length>0?' — danh sách chưa được xác nhận đầy đủ.':''}</p>)}
  <p>{editorial&&data.transformations.status==='complete'&&!data.transformations.entries.length?'Không có sao mang Tứ Hóa bản mệnh tại cung này':data.transformations.text}</p><p>{data.voids.join(' ')}</p><p>{data.scope}</p><p>{data.limit}</p>
  <details data-health-evidence><summary>Xem căn cứ</summary>
   {editorial&&<p>{data.transformations.text}</p>}<p>Dữ kiện lấy từ bản mệnh đã lưu của chính hồ sơ này. Không dùng sao lưu và không tính lại snapshot.</p>
   {data.groups.flatMap(g=>g.stars).map(s=><p key={s.path}>{s.name}: trạng thái nguồn {s.sourceState||'chưa có trong snapshot'}; trạng thái lá số đã lưu {s.savedState||'chưa ghi nhận'}.{s.source?' '+s.source:''}{s.version?' · '+s.version:''}</p>)}
   {data.rings.map(r=><p key={r.key}>{r.label}: {r.value}.</p>)}
   <p>{data.evidence.statePolicy}</p><p>{data.evidence.decision}</p><p>{data.evidence.dependencies}</p>
   {data.evidence.sources.map(s=><p key={s}>{s}</p>)}
   {internal&&<details data-technical><summary>Chi tiết kỹ thuật</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(data,null,2)}</pre></details>}
  </details>
 </section>;
}
