'use client';
import {useEffect,useRef,useState} from 'react';
import type {checkoutOrder,checkoutScope} from '@/lib/checkout/test';
type Order=NonNullable<Awaited<ReturnType<typeof checkoutOrder>>>;
type Scope=NonNullable<Awaited<ReturnType<typeof checkoutScope>>>;
const labels:Record<string,string>={pending:'Chờ giao dịch Test Mode',delivering:'Đã thanh toán · đang giao báo cáo',delivered:'Đã giao báo cáo','delivery-error':'Đã thanh toán · chưa giao được báo cáo','access-ended':'Đã giao · quyền đọc không còn hiệu lực',expired:'Đơn thử đã hết thời gian thanh toán'};
export default function TestCheckout({scope,initialOrder,anchor,loginReturnTo}:{scope?:Scope;initialOrder?:Order;anchor:string;loginReturnTo?:string}){
 const [order,setOrder]=useState(initialOrder),[busy,setBusy]=useState(false),[error,setError]=useState(''),[copied,setCopied]=useState('');const submitting=useRef(false);
 useEffect(()=>{
  if(!order||!['pending','delivering','delivery-error'].includes(order.state))return;
  let alive=true;const tick=async()=>{try{const r=await fetch('/api/checkout/'+order.id,{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();if(alive){setOrder(data);setError('');}}catch{if(alive)setError('Chưa kiểm tra được trạng thái. Đơn vẫn được giữ; hãy tải lại trang nếu kết nối chưa trở lại.');}};
  const timer=setInterval(tick,4000);return()=>{alive=false;clearInterval(timer);};
 },[order?.id,order?.state]);
 const create=async()=>{if(submitting.current||!scope)return;submitting.current=true;setBusy(true);setError('');try{
  const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({readingId:scope.readingId,anchor,offerVersion:scope.offer.version})});const d=await r.json();if(!r.ok)throw Error(d.error);window.location.assign(d.url);
 }catch(e){setError(e instanceof Error?e.message:'Chưa tạo được đơn. Hãy thử lại.');setBusy(false);submitting.current=false;}};
 const copy=async(label:string,value:string)=>{try{await navigator.clipboard.writeText(value);setCopied('Đã sao chép '+label.toLowerCase());}catch{setCopied('Chưa sao chép được. Bạn có thể chọn và sao chép thông tin bên cạnh.');}};
 return <section className="card test-checkout"><p className="palace-badge">SePay Test Mode · chưa mở bán</p><h1>{order?'Đơn thử báo cáo':'Phạm vi bản đọc thử'}</h1>
 <p>Chỉ mô phỏng giao dịch trong SePay Test Mode. Không chuyển tiền thật, không quét bằng ứng dụng ngân hàng thật.</p>
 {scope&&!order&&<><h2>{scope.name}</h2><p>Mở nguyên bản chi tiết đã lưu và PDF của hồ sơ này; không tạo lại nội dung.</p><h3>Cung có luận giải</h3><p>{scope.palaces.filter(p=>p.hasContent).map(p=>p.name).join(' · ')}</p><h3>Cung chưa có luận giải</h3><p>{scope.palaces.filter(p=>!p.hasContent).map(p=>p.name).join(' · ')||'Không có mục trống trong bản này.'}</p><p>Mỗi cung chỉ có các nhánh đã được hỗ trợ. Mở quyền không bổ sung nội dung còn thiếu và không đồng nghĩa báo cáo đã luận đầy đủ 12 cung.</p>{scope.heldCount>0&&<p>Các nhóm Mệnh–Thân giữ riêng khỏi phần miễn phí được giữ nguyên trong bản chi tiết, cùng điều kiện và giới hạn đã lưu.</p>}<p><strong>Số tiền kiểm thử: {scope.offer.amount.toLocaleString('vi-VN')} ₫</strong><br/>Quyền thử {scope.offer.accessHours} giờ kể từ lúc máy chủ xác nhận giao dịch, không phụ thuộc hạn phiên đăng nhập.</p><p>Đơn có hiệu lực thanh toán {scope.offer.paymentMinutes} phút. Đây chưa phải giá hoặc thời hạn thương mại.</p><small>Cấu hình thử {scope.offer.version}</small><p>{loginReturnTo?<a className="button" href={'/la-so-cua-toi?returnTo='+encodeURIComponent(loginReturnTo+'#'+anchor)}>Đăng nhập Google để tiếp tục</a>:<button type="button" onClick={create} disabled={busy}>{busy?'Đang tạo đơn thử…':'Tạo đơn Test Mode'}</button>}</p><a href={'/ban-doc?id='+scope.readingId+'#'+anchor}>Quay lại cung đang đọc</a></>}
 {order&&<><h2 role="status">{labels[order.state]}</h2><p>Mã đơn: <strong>{order.code}</strong></p>
 {order.state==='pending'&&<><img className="test-qr" src={order.qrUrl} width={240} height={240} referrerPolicy="no-referrer" alt="QR tài khoản SePay Test Mode, không chuyển tiền thật"/>
 <div className="checkout-transfer">{[['Ngân hàng',order.offer.bank],['Tài khoản Test',order.offer.account],['Số tiền kiểm thử',String(order.amount)],['Nội dung',order.code]].map(([label,value])=><div key={label}><span>{label}<strong>{value}</strong></span><button type="button" onClick={()=>copy(label,value)}>Sao chép</button></div>)}</div><p role="status">{copied}</p><p>Chờ xác nhận từ máy chủ. Việc sao chép hoặc tải lại không xác nhận thanh toán.</p><p>Hạn đơn: {new Date(order.expiresAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</p></>}
 {order.state==='delivery-error'&&<p>Giao dịch đã được ghi nhận. Worker sẽ thử lại theo hàng đợi; không tạo đơn mới hoặc mô phỏng thanh toán lần nữa.</p>}
 {order.state==='delivering'&&<p>Hệ thống đang cấp quyền cho đúng bản đã lưu. Trang sẽ cập nhật trạng thái.</p>}
 {order.state==='delivered'&&<><p><a className="button" href={order.returnUrl}>Mở lại đúng cung đang đọc</a></p><p>PDF toàn bài nằm trong Tùy chọn bản đọc.</p></>}
 {order.accessExpiresAt&&<p>Hạn quyền: {new Date(order.accessExpiresAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</p>}
 <p><a href="/la-so-cua-toi?tab=orders">Đơn hàng của tôi</a></p></>}
 {error&&<p role="alert">{error}</p>}
 </section>;
}
