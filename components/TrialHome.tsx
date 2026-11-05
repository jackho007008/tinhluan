import { Suspense } from 'react';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { categories, listPublished } from '@/lib/encyclopedia/model';
import { Alert, Card, EmptyState, Skeleton } from './co-thu/primitives';
import ReadingDisclosure from './ReadingDisclosure';
import ReferenceBirthForm from './ReferenceBirthForm';

const benefits = [
  ['Lá số đủ 12 cung', 'Xem Bản mệnh, Cục và vị trí các sao trên lá số.'],
  ['Luận cung Mệnh miễn phí', 'Đọc ngay trên trang kết quả và mở phần căn cứ đi kèm.'],
  ['Tứ Hóa năm sinh', 'Tra cứu sao hóa và cung tương ứng theo dữ kiện của lá số.'],
];
const questions = [
  ['Lập lá số có mất phí không?', 'Lập lá số, xem dữ kiện 12 cung, Tứ Hóa và đọc luận cung Mệnh đều miễn phí.'],
  ['Không nhớ chính xác giờ sinh thì sao?', 'Hãy chọn canh giờ chứa giờ sinh của bạn. Nếu chưa xác định được, bạn có thể quay lại sau khi kiểm tra thông tin sinh.'],
  ['Bài luận được lưu ở đâu?', 'Sau khi lập lá số, bạn có thể mở lại trong mục Bản đọc đã lưu, bằng phiên trình duyệt còn quyền.'],
];

async function LatestArticles() {
  let rows;
  try {
    rows = (await listPublished()).slice(0, 3);
  } catch {
    return <Alert tone="warning" title="Chưa tải được bài viết"><a href="/toan-thu">Mở Toàn thư để tra cứu</a></Alert>;
  }
  if (!rows.length) return <EmptyState title="Chưa có bài được xuất bản" />;
  return <div className="home-columns">{rows.map(({id, content}) =>
    <a className="home-article" key={id} href={'/toan-thu/' + content.slug}>
      <span>{content.category}</span><h3>{content.title}</h3><p>{content.description}</p>
    </a>)}</div>;
}

export default function TrialHome({accountSignedIn, emailRecovery}: {accountSignedIn: boolean; emailRecovery: boolean}) {
  return <main className="trial-home">
    <section className="home-hero home-container">
      <div className="home-opening">
        <svg className="home-motif" viewBox="0 0 160 160" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M1 1h158v158H1z M40 1v158m80-158v158M1 40h158M1 120h158M80 1v39m0 80v39M1 80h39m80 0h39"/>
        </svg>
        <span className="home-overline">Tử Vi &amp; Huyền Học</span>
        <h1>Lập lá số, đọc luận cung Mệnh ngay</h1>
        <p>Nhập ngày giờ sinh để lập lá số 12 cung và đọc bài luận cung Mệnh miễn phí.</p>
        <a className="home-jump tl-btn tl-btn--secondary" href="#lap-la-so">Lập lá số miễn phí <ArrowDown size={18}/></a>
        <ul className="home-checks">{['Dữ kiện 12 cung, Tứ Hóa và căn cứ', 'Luận cung Mệnh miễn phí, đọc ngay'].map(line =>
          <li key={line}><Check size={20} aria-hidden="true"/>{line}</li>)}</ul>
      </div>
      <div id="lap-la-so"><ReferenceBirthForm publicTrial embedded accountSignedIn={accountSignedIn} emailRecovery={emailRecovery}/></div>
    </section>
    <section className="home-section home-container"><h2>Bạn nhận được gì</h2>
      <div className="home-columns">{benefits.map(([title, text], i) =>
        <div className="home-benefit" key={title}><span aria-hidden="true">0{i + 1}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
    </section>
    <section className="home-section home-container"><h2>Phần đọc miễn phí</h2>
      <Card className="home-free"><h3>Miễn phí</h3><ul><li>Lá số và dữ kiện 12 cung</li><li>Bản mệnh, Cục, Âm dương và Thân</li><li>Tứ Hóa và căn cứ</li><li>Luận cung Mệnh</li></ul></Card>
    </section>
    <section className="home-ency"><div className="home-container">
      <div><span className="home-overline">Toàn thư Tử Vi</span><h2>Tra cứu sao, cung và thuật ngữ</h2></div>
      <nav aria-label="Tra cứu Toàn thư">{categories.map(c => <a key={c} href={'/toan-thu?category=' + encodeURIComponent(c)}>{c}</a>)}<a href="/toan-thu">Mở Toàn thư <ArrowRight size={16}/></a></nav>
    </div></section>
    <section className="home-section home-container"><div className="home-titles"><h2>Bài mới nhất</h2><a href="/toan-thu">Xem tất cả</a></div>
      <Suspense fallback={<Skeleton label="Đang tải bài viết"/>}><LatestArticles/></Suspense>
    </section>
    <section className="home-section home-container home-faq"><h2>Câu hỏi thường gặp</h2>
      <Card>{questions.map(([q,a],i)=><ReadingDisclosure key={q} initiallyOpen={i===0}><summary>{q}</summary><p>{a}</p></ReadingDisclosure>)}</Card>
    </section>
  </main>;
}
