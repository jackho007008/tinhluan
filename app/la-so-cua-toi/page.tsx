import {customerLibrary} from '@/lib/customer-auth/library';
import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';
import CustomerShell from '@/components/CustomerShell';
import {customerSession} from '@/lib/customer-auth/accounts';
import {CUSTOMER_COOKIE,customerAuthEnabled,googleConfig,safeReturn} from '@/lib/customer-auth/config';
export const dynamic='force-dynamic';
const notices:Record<string,string>={cancelled:'Bạn đã hủy đăng nhập. Thông tin và bản đọc đang có vẫn được giữ nguyên.',error:'Chưa đăng nhập được. Vui lòng thử lại từ nút Google bên dưới.',unavailable:'Google Login chưa sẵn sàng hoặc đang bận. Bạn vẫn có thể dùng phiên đọc hiện tại.',logout:'Đã đăng xuất tài khoản. Quyền của phiên dùng thử riêng vẫn giữ hạn cũ.',linked:'Đã kiểm tra và liên kết các bản đang có quyền. Những bản hết hạn hoặc thuộc tài khoản khác không được chuyển quyền.','link-retry':'Đăng nhập đã xong nhưng chưa liên kết được các bản đọc. Vui lòng thử liên kết lại.'};
export default async function Page({searchParams}:{searchParams:Promise<{returnTo?:string;notice?:string;q?:string;page?:string;tab?:string}>}){
 if(!customerAuthEnabled())notFound();
 const params=await searchParams,token=(await cookies()).get(CUSTOMER_COOKIE)?.value,session=await customerSession(token),returnTo=safeReturn(params.returnTo);
 const library=session?await customerLibrary(token,params):null;
 const href=(tab:string,page=1)=>'/la-so-cua-toi?'+new URLSearchParams({tab,q:library?.q||'',page:String(page)});
 const date=(s:string)=>new Date(s).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'short',timeStyle:'short'});
 return <CustomerShell publicTrial><main style={{maxWidth:760,margin:'0 auto',padding:'20px 16px'}}><section className="card"><h1>Lá số của tôi</h1>
 {params.notice&&notices[params.notice]&&<p role="status">{notices[params.notice]}</p>}
 {!session?<><p>Đăng nhập để mở lại những bản đọc bạn đang có quyền trên thiết bị khác.</p><p>Các bản của phiên hiện tại hoặc đã khôi phục qua email sẽ được liên kết sau đăng nhập. Hạn đọc giữ nguyên; email trùng nhau không tự nhận quyền.</p>
 {googleConfig()?<form method="post" action="/api/account/google/start"><input type="hidden" name="returnTo" value={returnTo}/><button className="button" type="submit">Đăng nhập bằng Google</button></form>:<p role="status">Google Login đang chờ cấu hình trên QA. Bạn vẫn có thể lập và đọc lá số bằng phiên hiện tại.</p>}
 </>:<><p>Bản đọc đã lưu trong tài khoản. Hạn đọc giữ nguyên khi đăng nhập lại.</p>
 <a className="button" href="/lap-la-so">Lập lá số mới</a>
 <nav className="library-tabs" aria-label="Không gian khách hàng">{[['readings','Lá số của tôi'],['purchased','Báo cáo đã mua'],['orders','Đơn hàng']].map(([key,label])=><a key={key} aria-current={library?.tab===key?'page':undefined} href={href(key)}>{label}</a>)}</nav>
 {library&&<><form className="library-search" method="get"><input type="hidden" name="tab" value={library.tab}/><label htmlFor="library-search">{library.tab==='orders'?'Tìm tên hoặc mã đơn':'Tìm theo tên hoặc mã bản đọc'}</label><div><input id="library-search" name="q" defaultValue={library.q} maxLength={100} placeholder="Nhập tên cần tìm"/><button type="submit">Tìm</button></div></form>
 <p className="library-count" role="status">{library.total} {library.tab==='orders'?'đơn hàng':'bản đọc'}{library.q?' phù hợp':''}</p>
 {library.items.length?<ul className="library-list">{library.items.map(row=><li key={row.id}>
 <h2>{row.url?<a href={row.url}>{row.name}</a>:row.name}</h2><p className="library-meta">{row.dateLabel} {date(row.createdAt)}</p><p className="access-label">{row.status}</p>
 {row.order&&<p>{row.order.test?'Đơn thử nghiệm':'Đơn hàng'} · {row.order.code} · {row.order.amount.toLocaleString('vi-VN')} ₫<br/>{row.order.payment==='paid'?'Đã xác nhận thanh toán':row.order.payment==='pending'?'Chờ thanh toán':row.order.payment==='expired'?'Đơn đã hết hạn':'Chưa xác nhận thanh toán'}</p>}
 {row.expiresAt&&<p className="library-meta">Hạn quyền: {date(row.expiresAt)}</p>}
 <div className="library-actions">{row.url&&<a href={row.url}>Mở bản đọc</a>}{row.editUrl&&<a href={row.editUrl}>Sửa thông tin · tạo bản mới</a>}</div>
 </li>)}</ul>:<div className="library-empty"><p>{library.q?'Không tìm thấy kết quả. Hãy thử tên ngắn hơn.':library.tab==='purchased'?'Bạn chưa có báo cáo đã mua.':library.tab==='orders'?'Bạn chưa có đơn hàng.':'Chưa có bản đọc trong tài khoản. Bạn có thể lập lá số mới hoặc liên kết bản đang có quyền trong phiên này.'}</p>{library.tab!=='readings'&&<p>QA chưa mở bán. Đơn thử nghiệm được ghi riêng trong mục Đơn hàng.</p>}</div>}
 <nav className="library-pagination" aria-label="Phân trang">{library.page>1&&<a href={href(library.tab,library.page-1)}>← Trước</a>}<span>Trang {library.page}/{library.pages}</span>{library.page<library.pages&&<a href={href(library.tab,library.page+1)}>Sau →</a>}</nav></>}
 <details className="library-link"><summary>Bản đọc của phiên chưa có trong danh sách?</summary><p>Chỉ liên kết bản bạn đang có quyền. Không chuyển quyền từ tài khoản khác.</p><form method="post" action="/api/account/link"><button type="submit">Liên kết bản đọc của phiên này</button></form></details>
 <form method="post" action="/api/account/logout"><button type="submit">Đăng xuất</button></form></>}
 <p><a href={returnTo==='/la-so-cua-toi'?'/ban-doc':returnTo}>Quay lại bản đọc hoặc tác vụ đang xem</a></p><p><a href="/lap-la-so">Lập lá số miễn phí</a> · <a href="/recover?reading=1">Khôi phục qua email</a></p>
 </section></main></CustomerShell>;
}
