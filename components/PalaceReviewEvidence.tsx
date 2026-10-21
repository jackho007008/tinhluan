import type { PalaceReview } from '@/lib/internal-review/palace-review';
export default function PalaceReviewEvidence({value}:{value:PalaceReview}) {
  return <details data-palace-review className="card">
    <summary>Xem căn cứ — quy trình xét cung và liên cung</summary>
    <p>Quy trình đối chiếu bổ sung theo Nguyễn Phát Lộc. Đây là dữ kiện để xem xét; không phải lời luận tổng hợp mới.</p>
    {value.procedure.map(p=><section key={p.title}><h4>{p.title}</h4><p>{p.text}</p></section>)}
    <p>{value.stateNotice}</p>
    {value.targets.map(t=><details key={t.target} data-review-target={t.target}>
      <summary>{t.target}{t.palace && t.target==='Thân cư' ? ' '+t.palace : ''}{t.branch ? ' tại '+t.branch : ' — chưa xác định vị trí'}</summary>
      <p>{t.limit}</p>
      {t.status==='missing-data' && <p>Chưa đủ dữ liệu đã xác minh để lập các quan hệ cung.</p>}
      {t.rows.map(r=><section key={r.path}>
        <h5>{r.palace} tại {r.branch} — {r.relations.map(x=>x==='đồng cung'?'chính cung':x==='đối cung'?'đối cung / xung chiếu':x).join(' · ')}</h5>
        {r.lists.map(l=><p key={l.group}>{l.group==='majorStars'?'Chính tinh':'Phụ tinh '+(l.group==='minorStars'?'nhóm 1':'nhóm 2')}: {!l.complete?'chưa có danh sách bản mệnh đầy đủ đã xác minh.':l.stars.length?l.stars.map(s=>s.name+(s.state?' ('+s.state+')':'')).join(', '):l.group==='majorStars'?'không có chính tinh tọa thủ.':'danh sách đã xác minh rỗng.'}</p>)}
      </section>)}
      <p>{t.source}</p>
    </details>)}
    <details data-review-dependencies><summary>Các cung liên quan theo từng nguồn</summary>
      {value.dependencies.map(g=><section key={g.id}><h4>{g.title}</h4><ul>{g.members.map(m=><li key={m.role}>{m.role}: {m.palace ? (m.role==='Thân cư'?m.palace+' ':'')+'tại '+m.branch : 'chưa xác định duy nhất trong hồ sơ'}.</li>)}</ul><p>{g.source}</p></section>)}
    </details>
    <p>{value.claimPolicy}</p>
    <details data-technical><summary>Chi tiết kỹ thuật</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(value,null,2)}</pre></details>
  </details>;
}
