import ReadingAccountLink from './ReadingAccountLink';
import type {CustomerReport} from '@/lib/internal-review/customer-report';
import type {ChartSnapshot} from '@/lib/tuvi-engine';
import type {ReadingScope} from '@/lib/trial/reading-policy';
import CustomerChart from './CustomerChart';
import {CustomerEvidence} from './CustomerReading';
import ReadingDisclosure from './ReadingDisclosure';
import ReadingPosition from './ReadingPosition';
import TrialReadingPdf from './TrialReadingPdf';
import ReadingEmailAccess from './ReadingEmailAccess';
import {customerTopicOwner} from '@/lib/internal-review/customer-topic-editorial';
const labels={free:'Đọc miễn phí',available:'Đã mở',locked:'Đang khóa',empty:'Chưa có luận giải'};
/** Presentation of the server-authorized saved projection. No inference or report generation here. */
export default function CustomerReadingWorkspace({report:r,snapshot,id,basic,birthTimeLabel,orderId,emailRecovery,allowBirthEdit,scope,checkout='closed'}:{report:CustomerReport;snapshot?:ChartSnapshot;id?:string;basic:boolean;birthTimeLabel?:string;orderId?:string;emailRecovery?:boolean;allowBirthEdit?:boolean;scope:ReadingScope;checkout?:'closed'|'login'|'allowed'}){
 const edition=id||r.snapshotId,url=orderId?'/don-thu?id='+orderId:'/ban-doc?id='+id;
 const visible=basic&&scope.full?r.sections.filter(s=>r.basicSectionIds.includes(s.id)):r.sections;
 const opening=r.sections.find(s=>s.id==='key-points');
 const visibleBody=visible.filter(s=>s.id!=='key-points');
 const contentPalaces=scope.palaces.filter(p=>p.name!=='Mệnh'&&['locked','available'].includes(p.state));
 const emptyPalaces=scope.palaces.filter(p=>p.state==='empty');
 const birth=r.birth.split(' · ').filter(p=>p!=='Chưa có thông tin nơi sinh'&&p!=='Asia/Ho_Chi_Minh').join(' · ');
 const anchor=(name:string)=>'cung-'+r.palaces.findIndex(p=>p.name===name);
 const firstOwner=(section:typeof r.sections[number])=>customerTopicOwner(r.version,section,r.palaces,scope.palaces);
 return <main className="customer-workspace" data-reading-mode={basic?'basic':'detailed'} data-customer-version={r.version}>
 <ReadingPosition edition={edition}/>
 <section className="card compact-profile" id="profile" data-reading-position><h1>{r.name}</h1><p>{birth}</p><div className="workspace-actions">{allowBirthEdit&&id&&<a href={'/lap-la-so?edit='+id}>Sửa thông tin · tạo bản mới</a>}<a href="/la-so-cua-toi">Lá số của tôi</a></div></section>
 <nav className="workspace-nav" aria-label="Điều hướng bài đọc"><a href="#cung-0">Đọc Mệnh</a><a href="#reading-toc">12 cung</a><a href="#chart">Lá số</a><a href="#reading-options">Tùy chọn</a><ReadingAccountLink url={url+(basic?'&mode=basic':'')}>Hồ sơ</ReadingAccountLink></nav>
 <ReadingDisclosure id="reading-toc" className="card compact-disclosure" persistKey={edition+':toc'}><summary>Mục lục · 12 cung</summary><nav className="palace-access-grid" aria-label="Mục lục 12 cung">{scope.palaces.map(p=><a key={p.name} href={'#'+anchor(p.name)} data-palace-access={p.state}><strong>{p.name}</strong><span>{labels[p.state]}</span></a>)}</nav></ReadingDisclosure>
 {snapshot&&<ReadingDisclosure id="chart" className="card compact-disclosure" persistKey={edition+':chart'}><summary>Xem lá số</summary><CustomerChart interactive snapshot={snapshot} birthTimeLabel={birthTimeLabel}/></ReadingDisclosure>}
 <p className="reading-note">Nội dung tử vi mang tính tham khảo. Điều kiện và ngoại lệ được giữ trong từng đoạn.</p>
 {opening&&<section className="card palace-chapter" id="key-points" data-customer-section="key-points" data-reading-position><h2>{opening.title}</h2>{opening.intro&&<p>{opening.intro}</p>}{opening.paragraphs.map(p=><article id={p.id} key={p.id} data-customer-paragraph={p.id} data-reading-position><p data-customer-text>{p.text}</p><CustomerEvidence p={p} allowInternalLinks={false}/></article>)}</section>}
 <div id="reading">{r.palaces.map(p=>{
  const state=scope.palaces.find(x=>x.name===p.name)?.state||'empty';
  const owned=visibleBody.filter(s=>firstOwner(s)===p.name),shared=visibleBody.filter(s=>s.palaces.includes(p.name)&&firstOwner(s)!==p.name);
  const omitted=scope.full&&basic&&r.sections.some(s=>s.palaces.includes(p.name)&&!visible.includes(s));
  return <ReadingDisclosure id={anchor(p.name)} data-reading-position key={p.name} initiallyOpen={p.name==='Mệnh'} persistKey={edition+':'+p.name} className="card palace-chapter">
   <summary><span>{p.name}</span><span className={'palace-badge '+state}>{labels[state]}</span></summary>
   <p className="palace-facts">{p.facts}</p>
   {state==='locked'?<p className="access-message">Cung này có luận giải trong bản đã lưu và cần quyền đọc đầy đủ. {checkout==='closed'?'Chưa mở bán.':<><a className="button quiet" href={'/checkout?id='+id+'#'+anchor(p.name)}>{checkout==='login'?'Đăng nhập · xem phạm vi gói thử':'Xem phạm vi gói Test Mode'}</a> Chỉ dành cho tài khoản QA được chỉ định.</>}</p>:<>
   {state==='empty'&&<p className="access-message">Phần này hiện chưa có luận giải. Mở quyền không tạo thêm lời cho cung này.</p>}
   {owned.map(s=><section id={s.id} key={s.id} data-customer-section={s.id} data-reading-position><h2>{s.title}</h2>{s.intro&&<p>{s.intro}</p>}{s.paragraphs.map((p,paragraphIndex)=><article id={p.id} key={p.id} data-customer-paragraph={p.id} data-reading-position>{p.title&&(!['1.54.0','1.55.0'].includes(r.version)||p.title!==s.paragraphs[paragraphIndex-1]?.title)&&<h3>{p.title}</h3>}<p data-customer-text>{p.text}</p><CustomerEvidence p={p} allowInternalLinks={false}/></article>)}{s.notices.map((n,i)=><p className="notice" key={i} data-customer-gap>{n.text}</p>)}</section>)}
   {shared.map(s=><p key={s.id}>Nội dung {s.palaces.join(' và ')} được trình bày cùng một mục: <a href={'#'+s.id}>{s.title}</a>.</p>)}
   {omitted&&<p><a href={url+'#'+anchor(p.name)}>Đọc phần này trong bản chi tiết</a></p>}
   {p.name==='Mệnh'&&opening&&<p><a href="#key-points">Xem các nét chính từ Mệnh ở đầu bài</a></p>}
   {p.name==='Mệnh'&&scope.heldCount>0&&!scope.full&&<p className="notice">Một số nhóm Mệnh–Thân liên quan cung khác được giữ riêng, chưa đưa vào phần miễn phí. Lời nền và điều chỉnh không bị tách khỏi nhau.</p>}
   {p.name==='Mệnh'&&!scope.full&&<div className="access-message" id="full-report-scope"><h3>Trong bản đọc đầy đủ của hồ sơ này</h3>{contentPalaces.length>0?<p>Các cung đã có nội dung: {contentPalaces.map(p=>p.name).join(', ')}. Bạn có thể đọc các đoạn cùng điều kiện, căn cứ và tải PDF khi có quyền đầy đủ.</p>:<p>Hồ sơ này chưa có luận giải ở các cung khác.</p>}{emptyPalaces.length>0&&<p>Chưa có luận giải tại {emptyPalaces.map(p=>p.name).join(', ')}. Mở quyền không tạo thêm nội dung cho các phần này.</p>}<p>Những chủ đề có lời vẫn có thể còn thiếu phép phối hợp; đây chưa phải báo cáo luận đầy đủ12 cung. Chưa mở bán; checkout Test Mode chỉ dành cho tài khoản QA được chỉ định.</p></div>}
   </>}
   <ReadingDisclosure><summary>Dữ kiện cung {p.name}</summary><p>{Object.entries((p.details as {facts?:Record<string,string[]>}).facts??{}).map(([k,v])=>`${({major:'Chính tinh',minor:'Phụ tinh',other:'Các sao khác'} as Record<string,string>)[k]||k}: ${Array.isArray(v)?v.length?v.join(', '):k==='major'?'Không có chính tinh tọa thủ':'Không có sao trong nhóm đã ghi nhận':'Chưa đủ dữ kiện'}`).join('. ')}</p></ReadingDisclosure>
  </ReadingDisclosure>;
 })}</div>
 <section className="card" id="reading-options" data-reading-position><h2>Tùy chọn bản đọc</h2>{scope.full?<><p><a className="button quiet" href={basic?url:url+'&mode=basic'}>{basic?'Đọc bản chi tiết':'Đọc bản cơ bản'}</a></p>{id&&<TrialReadingPdf id={id} orderId={orderId}/>}</>:<p>PDF toàn bài cần quyền đọc đầy đủ. QA chưa mở bán.</p>}
 {emailRecovery&&id&&<ReadingEmailAccess readingId={id} orderId={orderId}/>}
 <ReadingDisclosure><summary>Cách đọc và phạm vi</summary><p>{r.intro}</p><p>{r.notice}</p></ReadingDisclosure>
 <ReadingDisclosure><summary>Thuật ngữ trong bài</summary>{r.glossary.map(g=><p key={g.term}><strong>{g.term}: </strong>{g.text}</p>)}</ReadingDisclosure>
 {snapshot&&<ReadingDisclosure><summary>Tứ Hóa bản mệnh</summary>{snapshot.chart.natalTransformations?.status==='complete'?snapshot.chart.natalTransformations.entries.map(e=><p key={e.kind}>Hóa {e.kind} · {e.star} · {e.palace} tại {e.branch}</p>):<p>Chưa đủ dữ kiện để tra cứu Tứ Hóa bản mệnh.</p>}</ReadingDisclosure>}
 </section></main>;
}
