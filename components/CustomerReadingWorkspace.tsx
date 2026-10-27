import AiMenhReading from './AiMenhReading';
import ReadingAccountLink from './ReadingAccountLink';
import type {CustomerReport,CustomerSection} from '@/lib/internal-review/customer-report';
import type {ChartSnapshot} from '@/lib/tuvi-engine';
import type {ReadingScope} from '@/lib/trial/reading-policy';
import CustomerChart from './CustomerChart';
import {CustomerEvidence} from './CustomerReading';
import ReadingDisclosure from './ReadingDisclosure';
import ReadingPosition from './ReadingPosition';
import TrialReadingPdf from './TrialReadingPdf';
import ReadingEmailAccess from './ReadingEmailAccess';
import {customerTopicOwner} from '@/lib/internal-review/customer-topic-editorial';
import {resultPresentation,RESULT_UI_VERSION} from '@/lib/result-presentation';
import ResultTabs from './ResultTabs';
import AiReadingStatus from './AiReadingStatus';
const labels={free:'Đọc miễn phí',available:'Đã mở',locked:'Đang khóa',empty:'Chưa có luận giải'};
function SavedSection({section:s,version}:{section:CustomerSection;version:string}){
 return <section id={s.id} data-customer-section={s.id} data-reading-position><h3>{s.title}</h3>{s.intro&&<p>{s.intro}</p>}{s.paragraphs.map((p,i)=><article id={p.id} key={p.id} data-customer-paragraph={p.id} data-reading-position>{p.title&&(!['1.54.0','1.55.0','1.55.1'].includes(version)||p.title!==s.paragraphs[i-1]?.title)&&<h4>{p.title}</h4>}<p data-customer-text>{p.text}</p><CustomerEvidence p={p} allowInternalLinks={false}/></article>)}{s.notices.map((n,i)=><p className="notice" key={i} data-customer-gap>{n.text}</p>)}</section>;
}
/** Receives only the existing server-authorized frozen projection. */
export default function CustomerReadingWorkspace({report:r,snapshot,id,basic,birthTimeLabel,orderId,emailRecovery,allowBirthEdit,scope,checkout='closed'}:{report:CustomerReport;snapshot?:ChartSnapshot;id?:string;basic:boolean;birthTimeLabel?:string;orderId?:string;emailRecovery?:boolean;allowBirthEdit?:boolean;scope:ReadingScope;checkout?:'closed'|'login'|'allowed'}){
 const edition=id||r.snapshotId,url=orderId?'/don-thu?id='+orderId:'/ban-doc?id='+id;
 const visible=basic&&scope.full?r.sections.filter(s=>r.basicSectionIds.includes(s.id)):r.sections;
 const opening=visible.find(s=>s.id==='key-points');
 const body=visible.filter(s=>s.id!=='key-points');
 const data=resultPresentation(snapshot),life=data.palaces[0];
 const value=(label:string)=>data.info.find(row=>row.label===label);
 const firstOwner=(s:CustomerSection)=>customerTopicOwner(r.version,s,r.palaces,scope.palaces);
 const menhGroups=body.filter(s=>firstOwner(s)==='Mệnh');
 const birth=r.birth.split(' · ').filter(p=>p!=='Chưa có thông tin nơi sinh'&&p!=='Asia/Ho_Chi_Minh').join(' · ');
 const stars=(p:typeof life)=>p.stars.length?p.stars.map(s=>`${s.name} (${s.display})`).join(' · '):p.voidConfirmed?'Vô chính diệu':p.empty;
 return <main className="customer-workspace result-workspace" data-result-ui={RESULT_UI_VERSION} data-reading-mode={basic?'basic':'detailed'} data-customer-version={r.version}>
 <ReadingPosition edition={edition}/>
 <section className="card compact-profile" id="profile" data-reading-position><p className="result-eyebrow">TINH LUẬN · LÁ SỐ BẢN MỆNH</p><h1>{r.name}</h1><p>{birth}</p><div className="workspace-actions">{allowBirthEdit&&id&&!orderId&&<a href={'/lap-la-so?edit='+id}>Sửa thông tin · tạo bản mới</a>}<a href="/la-so-cua-toi">Lá số của tôi</a><a href="#reading-options">Tùy chọn & PDF</a><ReadingAccountLink url={url+(basic?'&mode=basic':'')}>Hồ sơ</ReadingAccountLink></div>
 {snapshot&&<ReadingDisclosure id="chart" className="compact-disclosure" persistKey={edition+':chart'}><summary>Xem lá số</summary><CustomerChart interactive snapshot={snapshot} birthTimeLabel={birthTimeLabel}/></ReadingDisclosure>}</section>
 <ResultTabs>
 <section className="result-overview" aria-label="Tổng quan lá số">
 <div className="result-facts">{[['Bản mệnh / nạp âm',value('Mệnh')?.value],['Cục',value('Cục')?.value],['Âm dương',value('Âm Dương')?.value]].map(([label,v])=><div className="card" key={label}><span className="result-eyebrow">{label}</span><strong>{v||'Chưa có dữ kiện'}</strong>{label==='Âm dương'&&<small>{value('Âm Dương')?.secondary||'Chưa xác định quan hệ âm dương'}</small>}</div>)}</div>
 <section className="card result-life"><h2>Cung Mệnh tại {life.branch}</h2><p className="result-stars">{stars(life)}</p><p>Thân cư <strong>{data.body}</strong></p><p>Mệnh chủ <strong>{data.soul||'Chưa xác minh'}</strong> · Thân chủ <strong>{data.bodyRuler||'Chưa xác minh'}</strong></p>
 <ReadingDisclosure><summary>Xem căn cứ</summary><p>Đọc dữ kiện từ lá số đã lưu; không tính lại khi mở báo cáo.</p><p>Nạp âm, Cục, âm dương: Tử Vi Đẩu Số Tân Biên, Vân Đằng Thái Thứ Lang, trang PDF 24–26, 31. Thuận/nghịch lý ở đây so âm dương tuổi và cung Mệnh, không phải chiều đại vận.</p>{life.stars.map(s=><p key={s.name}>{s.name}: {s.display}. {s.source}</p>)}{data.convention&&<><p>{data.convention.name}</p><p>{data.convention.status}</p></>}<p>Chỉ dữ kiện có quy ước lưu kèm mới được trình bày ở mục hai chủ tinh; không tự bổ sung cho bản cũ thiếu chứng cứ.</p></ReadingDisclosure></section>
 <section className="card"><h2>Quan hệ ngũ hành</h2><p className="result-stars">{value('Cục')?.secondary||'Chưa đủ dữ kiện để xác định quan hệ Bản Mệnh–Cục.'}</p><p className="result-muted">Phép đối chiếu định tính giữa hành nạp âm và hành Cục. Quan hệ này chưa đủ để kết luận toàn lá số.</p><ReadingDisclosure><summary>Xem căn cứ</summary><p>Tử Vi Đẩu Số Tân Biên — Vân Đằng Thái Thứ Lang, trang PDF 24, mục 11.1. Dùng phép đối chiếu ngũ hành hiện có của lá số; không cộng trọng số hay chấm điểm.</p></ReadingDisclosure></section>
 {opening&&<div className="card saved-editorial"><p className="result-eyebrow">NỘI DUNG BIÊN TẬP ĐÃ LƯU</p><SavedSection section={opening} version={r.version}/></div>}
 <section className="result-patterns"><h2>Bộ sao / Cách cục</h2><p className="result-muted">Tra các nhóm nội dung biên tập đã có căn cứ trong bản lưu. Chưa xác nhận danh mục cách cục độc lập hoặc xếp hạng toàn lá số.</p>{menhGroups.length?menhGroups.map(s=><ReadingDisclosure className="card saved-editorial" key={s.id}><summary>{s.title} · {s.paragraphs.length} đoạn đã lưu</summary><SavedSection section={s} version={r.version}/></ReadingDisclosure>):<ReadingDisclosure className="card"><summary>Các nhóm tại Mệnh</summary><p>Chưa có nhóm nội dung phù hợp trong phần được phép đọc của bản lưu này.</p></ReadingDisclosure>}</section>
 </section>
 <section id="reading" aria-label="Danh sách 12 cung"><p className="result-muted">Dữ kiện lấy từ lá số đã lưu. Nội dung biên tập và trạng thái luận AI được trình bày riêng.</p>{data.palaces.map((p,i)=>{
  const state=scope.palaces.find(x=>x.name===p.name)?.state||'empty';
  const owned=body.filter(s=>firstOwner(s)===p.name),shared=body.filter(s=>s.palaces.includes(p.name)&&firstOwner(s)!==p.name);
  const omitted=scope.full&&basic&&r.sections.some(s=>s.palaces.includes(p.name)&&!visible.includes(s));
  const saved=r.palaces.find(x=>x.name===p.name);
  return <ReadingDisclosure id={'cung-'+i} data-reading-position key={p.name} initiallyOpen={p.name==='Mệnh'} className="card palace-chapter">
  <summary><span className="result-palace-heading"><strong>{p.name==='Tử Nữ'?'Tử Tức':p.name}</strong><span>{p.branch}</span>{p.isBody&&<span className="result-body-badge">Thân</span>}<span className="result-palace-stars">{stars(p)}</span></span></summary>
  {p.name==='Mệnh'&&id?<AiMenhReading key={id} readingId={id}/>:<AiReadingStatus state={p.name==='Mệnh'?'not-created':'not-entitled'}/>}
  <div className="saved-editorial" data-palace-access={state}><p className="result-eyebrow">NỘI DUNG BIÊN TẬP ĐÃ LƯU · {labels[state]}</p>{state==='locked'?<p className="access-message">Cung này có nội dung trong bản đã lưu và cần quyền đọc đầy đủ. {checkout==='closed'?'Chưa mở bán.':<a href={'/checkout?id='+id+'#cung-'+i}>{checkout==='login'?'Đăng nhập · xem phạm vi gói thử':'Xem phạm vi gói Test Mode'}</a>}</p>:<>
  {state==='empty'&&<p className="access-message">Phần này hiện chưa có luận giải. Mở quyền không tạo thêm nội dung cho cung này.</p>}
  {owned.map(s=>p.name==='Mệnh'?<p key={s.id}><a href={'#'+s.id}>{s.title} · đọc tại Tổng quan</a></p>:<SavedSection key={s.id} section={s} version={r.version}/>)}{shared.map(s=><p key={s.id}>Nội dung chung: <a href={'#'+s.id}>{s.title}</a>.</p>)}
  {p.name==='Mệnh'&&opening&&<p><a href="#key-points">Xem nét chính tại Tổng quan</a></p>}
  {omitted&&<p><a href={url+'#cung-'+i}>Đọc phần này trong bản chi tiết</a></p>}
  {p.name==='Mệnh'&&scope.heldCount>0&&!scope.full&&<p className="notice">Một số nhóm Mệnh–Thân liên quan cung khác được giữ riêng, chưa đưa vào phần miễn phí. Lời nền và điều chỉnh không bị tách khỏi nhau.</p>}
  </>}</div>
  <ReadingDisclosure><summary>Dữ kiện cung {p.name==='Tử Nữ'?'Tử Tức':p.name}</summary><p>{saved?.facts||'Chưa có dữ kiện đã lưu.'}</p>{p.stars.map(s=><p key={s.name}>{s.name} · {s.display}. Nguồn trạng thái: {s.source}</p>)}<p>{Object.entries((saved?.details as {facts?:Record<string,string[]>}|undefined)?.facts??{}).map(([k,v])=>`${({major:'Chính tinh',minor:'Phụ tinh',other:'Các sao khác'} as Record<string,string>)[k]||k}: ${Array.isArray(v)?v.length?v.join(', '):'Không có sao trong nhóm đã ghi nhận':'Chưa đủ dữ kiện'}`).join('. ')}</p></ReadingDisclosure>
  </ReadingDisclosure>;
 })}</section>
 <section aria-label="Tứ Hóa năm sinh"><p className="result-muted">Tứ Hóa năm sinh{data.birthYear?' · '+data.birthYear:''}. Dữ kiện theo bảng engine đã dùng khi lập lá số; các giải thích dưới đây là kiến thức khái quát.</p><div className="result-transformations">{data.transformations.map(t=><article className={'card transformation-card'+(t.kind==='Kỵ'?' transformation-ky':'')} key={t.kind}><h2>Hóa {t.kind}</h2><p className="result-transformed-star">{t.entry?.star||'Chưa xác minh sao hóa'}</p><p className="result-location">{t.entry?`${t.entry.palace==='Tử Nữ'?'Tử Tức':t.entry.palace} · ${t.entry.branch}`:'Chưa đủ dữ kiện cung / địa chi'}</p><p>{t.text}</p><p className="result-muted">Không dùng giải thích chung này làm kết luận chắc chắn về cá nhân.</p><ReadingDisclosure><summary>Xem căn cứ</summary><p>{t.source}</p><p>Phép an Tứ Hóa năm sinh: {data.transformationSource||'Bản lưu chưa có chứng nhận Tứ Hóa năm sinh; không tính bù bằng bảng mới.'}</p>{data.transformationNote&&<p>{data.transformationNote}</p>}<p>Không phải Tứ Hóa theo can cung, tự hóa, phi hóa hoặc lưu niên. Chỉ trình bày phần khái quát trong phạm vi sản phẩm; không suy y khoa, phẩm hạnh hoặc tổng hợp toàn cung.</p></ReadingDisclosure></article>)}</div></section>
 <section className="card result-periods"><p>Phần Vận hạn đang được hoàn thiện.</p></section>
 </ResultTabs>
 <section className="card result-options" id="reading-options" data-reading-position><h2>Tùy chọn bản đọc</h2>{scope.full?<><p><a className="button quiet" href={basic?url:url+'&mode=basic'}>{basic?'Đọc bản chi tiết':'Đọc bản cơ bản'}</a></p>{id&&<TrialReadingPdf id={id} orderId={orderId}/>}</>:<p>PDF toàn bài cần quyền đọc đầy đủ. QA chưa mở bán.</p>}{emailRecovery&&id&&<ReadingEmailAccess readingId={id} orderId={orderId}/>}
 <ReadingDisclosure><summary>Cách đọc và phạm vi</summary><p>{r.intro}</p><p>{r.notice}</p><p>Luận AI chưa được kích hoạt trong phiên bản này. Nội dung biên tập đã lưu không phải bài luận AI.</p></ReadingDisclosure><ReadingDisclosure><summary>Thuật ngữ trong bài</summary>{r.glossary.map(g=><p key={g.term}><strong>{g.term}: </strong>{g.text}</p>)}</ReadingDisclosure></section>
 </main>;
}
