import {readPaid,paidDisplayRecord} from '@/lib/ai/paid-store';
import {freeMenhView} from '@/lib/ai/free-menh';
import {projectReading} from '@/lib/trial/reading-policy';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {resolveReadingOrder,RECOVERY_COOKIE,recoveryEnabled} from '@/lib/trial/recovery';
import {cookies} from 'next/headers';
import CustomerShell from '@/components/CustomerShell';
import CustomerReading from '@/components/CustomerReading';
import ReferenceCustomerReading from '@/components/ReferenceCustomerReading';
import {getOwnedReadingOrder} from '@/lib/order-readings';
import {TRIAL_COOKIE} from '@/lib/trial/store';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{id?:string;mode?:string;print?:string}>}){
 const {id='',mode,print}=await searchParams;
 const trialToken=(await cookies()).get(TRIAL_COOKIE)?.value;
 const access=await resolveReadingOrder(trialToken,(await cookies()).get(RECOVERY_COOKIE)?.value,id,(await cookies()).get(CUSTOMER_COOKIE)?.value);const order=access?.order;
 if(!order)return <CustomerShell publicTrial><main><section className="card"><h1>Không mở được đơn thử</h1><p>Đơn không thuộc phiên này hoặc đã hết hạn.</p><a href="/lap-la-so">Lập lá số miễn phí</a></section></main></CustomerShell>;
 const r=order.reading;
 const freeMenh=r&&(await readPaid(r,order.id)).eligible?freeMenhView(await paidDisplayRecord(r,order.id)):undefined;
 if(print==='1'&&r)return <CustomerReading report={r.frozen.customerReport!} snapshot={r.snapshot} print evidence={false} basic={false} birthTimeLabel={r.inputReceipt?.timeLabel}/>;
 return <CustomerShell publicTrial result={!!r}><section className="card"><strong>Đơn kiểm thử · {order.code}</strong><p>{r?'Báo cáo đã sẵn sàng. Nội dung giữ nguyên bản đã lưu khi lập đơn.':order.paymentStatus==='paid'?'Đang giao báo cáo. Hãy tải lại trang sau ít phút.':'Đơn đang chờ thao tác kiểm thử nội bộ.'}</p><p>Không có thanh toán thật hoặc giá gói được áp dụng.</p></section>{r&&<ReferenceCustomerReading freeMenh={freeMenh} scope={projectReading(r,true).scope} allowBirthEdit={!!r.inputReceipt} publicTrial emailRecovery={recoveryEnabled()&&access?.identity.kind==='order'} orderId={order.id} id={r.id} report={r.frozen.customerReport!} snapshot={r.snapshot} basic={mode==='basic'} birthTimeLabel={r.inputReceipt?.timeLabel}/>}</CustomerShell>;
}
