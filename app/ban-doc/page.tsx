import {checkoutEntry} from '@/lib/checkout/test';
import ReadingAccountLink from '@/components/ReadingAccountLink';
import {customerReadingAccess} from '@/lib/trial/reading-access';
import {CUSTOMER_COOKIE,customerAuthEnabled} from '@/lib/customer-auth/config';
import {resolveTrialReading,RECOVERY_COOKIE,recoveryEnabled,recoveryDestination} from '@/lib/trial/recovery';
import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';
import CustomerReading from '@/components/CustomerReading';
import CustomerShell from '@/components/CustomerShell';
import ReferenceCustomerReading from '@/components/ReferenceCustomerReading';
import {trialEnabled} from '@/lib/trial/http';
import {trialOwner,TRIAL_COOKIE,getTrialReading,listTrialReadings} from '@/lib/trial/store';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{id?:string;mode?:string;print?:string}>}){
 if(!trialEnabled())notFound();
 const owner=await trialOwner((await cookies()).get(TRIAL_COOKIE)?.value);
 const {id,mode,print}=await searchParams;
 if(id){
  const access=await customerReadingAccess((await cookies()).get(TRIAL_COOKIE)?.value,(await cookies()).get(RECOVERY_COOKIE)?.value,id,(await cookies()).get(CUSTOMER_COOKIE)?.value);const record=access?.record;
  if(!record?.frozen.customerReport)return <CustomerShell publicTrial><main><section className="card"><h1>Không mở được bản đọc</h1><p>Báo cáo không thuộc phiên trình duyệt này hoặc đã hết hạn. Đường dẫn riêng không thay thế quyền truy cập.</p><a href="/lap-la-so">Lập lá số miễn phí</a>{recoveryEnabled()&&<p><a href="/recover?reading=1">Mở lại bằng email đã xác minh</a></p>}</section></main></CustomerShell>;
  if(print==='1'&&!access!.scope.full)return <CustomerShell publicTrial><main><section className="card"><h1>Chưa có quyền PDF toàn bài</h1><a href={'/ban-doc?id='+id}>Đọc cung Mệnh miễn phí</a></section></main></CustomerShell>;
  if(print==='1')return <CustomerReading report={access!.report} snapshot={record.snapshot} id={record.id} basic={false} print evidence={false} birthTimeLabel={record.inputReceipt?.timeLabel}/>;
  return <CustomerShell publicTrial>{customerAuthEnabled()&&<p style={{margin:'12px 16px'}}><ReadingAccountLink url={'/ban-doc?id='+id+(mode==='basic'?'&mode=basic':'')}>Lưu và mở lại trong tài khoản</ReadingAccountLink></p>}<ReferenceCustomerReading checkout={await checkoutEntry((await cookies()).get(CUSTOMER_COOKIE)?.value)} scope={access!.scope} publicTrial emailRecovery={recoveryEnabled()&&access?.identity.kind==='trial'} allowBirthEdit={!!record.inputReceipt} report={access!.report} snapshot={record.snapshot} id={record.id} basic={mode==='basic'} birthTimeLabel={record.inputReceipt?.timeLabel}/></CustomerShell>;
 }
 const rows=owner?await listTrialReadings(owner):[];
 const restored=await recoveryDestination((await cookies()).get(RECOVERY_COOKIE)?.value);
 return <CustomerShell publicTrial><main><section className="card"><h1>Bản đọc của phiên này</h1><p>Quyền đọc của phiên dùng thử có hạn 7 ngày kể từ khi mở phiên. Nếu đã xác minh email, bạn có thể mở lại bằng liên kết email trong thời hạn này.</p>
 {rows.length?<ul>{rows.map(r=><li key={r.id}><a href={'/ban-doc?id='+r.id+'&mode=basic'}>{r.snapshot.normalized.name||'Hồ sơ bản mệnh'} · {r.snapshot.normalized.date.split('-').reverse().join('/')}</a></li>)}</ul>:!restored&&<p>Chưa có bản đọc trong phiên này.</p>}
 {restored&&!rows.some(r=>r.id===restored.id)&&<p><a href={restored.url}>Bản đọc đã khôi phục: {restored.name}</a></p>}
 <a className="button" href="/lap-la-so">Lập lá số miễn phí</a>{recoveryEnabled()&&<p><a href="/recover?reading=1">Mở lại bằng email đã xác minh</a></p>}</section></main></CustomerShell>;
}
