import {customerSession} from '@/lib/customer-auth/accounts';
import {customerReadingAccess} from '@/lib/trial/reading-access';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {RECOVERY_COOKIE} from '@/lib/trial/recovery';
import {recoveryEnabled} from '@/lib/trial/recovery';
import {cookies} from 'next/headers';
import {trialOwner,TRIAL_COOKIE,getTrialReading} from '@/lib/trial/store';
import {notFound} from 'next/navigation';
import CustomerShell from '@/components/CustomerShell';
import ReferenceBirthForm from '@/components/ReferenceBirthForm';
import {trialEnabled} from '@/lib/trial/http';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{edit?:string}>}){
 if(!trialEnabled())notFound();
 const {edit}=await searchParams;
 const jar=await cookies();
 const previous=edit?(await customerReadingAccess(jar.get(TRIAL_COOKIE)?.value,jar.get(RECOVERY_COOKIE)?.value,edit,jar.get(CUSTOMER_COOKIE)?.value))?.record:null;
 if(edit&&!previous?.inputReceipt)return <CustomerShell publicTrial input><main><section className="card"><h1>Không mở được thông tin</h1><p>Bản đọc không thuộc phiên này hoặc đã hết hạn.</p><a href="/lap-la-so">Nhập thông tin mới</a></section></main></CustomerShell>;
 return <CustomerShell publicTrial input><main><ReferenceBirthForm accountSignedIn={!!await customerSession(jar.get(CUSTOMER_COOKIE)?.value)} emailRecovery={recoveryEnabled()} key={edit||'new'} publicTrial initialInput={previous?.inputReceipt?.entered}/></main></CustomerShell>;
}
