import {customerReadingAccess} from '@/lib/trial/reading-access';
import {TRIAL_COOKIE} from '@/lib/trial/store';
import {RECOVERY_COOKIE} from '@/lib/trial/recovery';
import {cookies} from 'next/headers';
import CustomerShell from '@/components/CustomerShell';
import TestCheckout from '@/components/TestCheckout';
import {CUSTOMER_COOKIE,safeReturn,googleConfig} from '@/lib/customer-auth/config';
import {customerSession} from '@/lib/customer-auth/accounts';
import {checkoutEntry,checkoutScope,checkoutOrder,describeCheckout} from '@/lib/checkout/test';
import CheckoutAnchor from '@/components/CheckoutAnchor';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{id?:string;order?:string}>}){
 const p=await searchParams,token=(await cookies()).get(CUSTOMER_COOKIE)?.value,session=await customerSession(token);
 const order=p.order?await checkoutOrder(token,p.order):null;
 const scope=p.id?await checkoutScope(token,p.id):null;
 const guestAccess=!session&&p.id?await customerReadingAccess((await cookies()).get(TRIAL_COOKIE)?.value,(await cookies()).get(RECOVERY_COOKIE)?.value,p.id,token):null;
 const guestScope=guestAccess?describeCheckout(guestAccess.record):null;
 const returnTo=safeReturn('/checkout?'+(p.order?'order='+p.order:'id='+p.id));
 return <CustomerShell publicTrial><main className="checkout-page">
 {!session&&guestScope?<CheckoutAnchor scope={guestScope} login returnTo={returnTo}/>:!session?<section className="card"><h1>Đăng nhập để xem phạm vi gói</h1><p>Checkout Test Mode chỉ dành cho tài khoản QA được chỉ định. Chưa mở bán.</p>{googleConfig()&&<CheckoutAnchor login returnTo={returnTo}/>}</section>:order?<TestCheckout initialOrder={order} anchor="cung-0"/>:scope&&await checkoutEntry(token)==='allowed'?<CheckoutAnchor scope={scope}/>:<section className="card"><h1>Chưa mở checkout cho yêu cầu này</h1><p>Chỉ tài khoản QA được chỉ định và báo cáo mới còn quyền sở hữu được dùng thử. Không có quyền chỉ từ mã báo cáo hoặc mã đơn.</p><a href="/la-so-cua-toi">Lá số của tôi</a></section>}
 </main></CustomerShell>;
}
