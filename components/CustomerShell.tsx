import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { customerAuthEnabled } from '@/lib/customer-auth/config';

export default function CustomerShell({ children, input = false, publicTrial = false, result = false, home = false }: {
  children: ReactNode; input?: boolean; publicTrial?: boolean; result?: boolean; home?: boolean;
}) {
  const birthUrl = publicTrial ? '/lap-la-so' : '/internal/customer';
  const libraryUrl = publicTrial ? '/ban-doc' : '/internal/readings';
  const hasAccount = publicTrial && customerAuthEnabled();
  const links = <>
    <a href={birthUrl} aria-current={input ? 'page' : undefined}>Lập lá số</a>
    <a href={libraryUrl}>Bản đọc đã lưu</a>
    <a href="/toan-thu">Toàn thư</a>
    {hasAccount && <a href="/la-so-cua-toi">Lá số của tôi</a>}
  </>;
  return <div className={'reference-ui' + (result ? ' result-shell' : '')} data-trial-home={home || undefined} data-web-ui="customer-ui-3.0.0" data-co-thu={publicTrial || undefined}>
    <header><div className="header-inner">
      <a className="brand" href={birthUrl} aria-label="Tinh Luận — Lập lá số">
        <img className="tinhluan-logo" src="/images/tinhluan.png" alt="Tinh Luận — tinhluan.com" width="2043" height="770" />
      </a>
      <nav className="desktop-nav" aria-label="Điều hướng chính">{links}</nav>
      <a className="old" href={hasAccount ? '/la-so-cua-toi' : libraryUrl}>Hồ sơ ↗</a>
      {publicTrial && <details className="tl-mobile-nav">
        <summary aria-label="Menu điều hướng"><Menu aria-hidden="true" size={22} /></summary>
        <nav aria-label="Điều hướng chính">{links}</nav>
      </details>}
    </div></header>
    {!home && <div className="prototype-label">{publicTrial ? 'Bản dùng thử miễn phí' : 'TINH LUẬN · BẢN ĐỌC THAM KHẢO'}</div>}
    {children}
    {home ? <footer className="home-footer"><div className="home-container"><strong>Tinh Luận</strong><nav aria-label="Sản phẩm"><a href="/lap-la-so">Lập lá số</a><a href="/toan-thu">Toàn thư</a></nav><p>Nội dung mang tính tham khảo.</p></div></footer> : <footer><a href="/toan-thu">Toàn thư</a> · Tinh Luận · Bản đọc tham khảo<br/>
      {publicTrial ? 'Báo cáo tham khảo · Chưa được phê duyệt chuyên môn.' : 'QA nội bộ · Thanh toán khách hàng chưa mở.'}
    </footer>}
  </div>;
}
