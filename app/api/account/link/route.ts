import type {NextRequest} from 'next/server';
import {customerSession,linkAvailableReadings} from '@/lib/customer-auth/accounts';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {accountGuard,accountRedirect} from '@/lib/customer-auth/http';
import {TRIAL_COOKIE} from '@/lib/trial/store';
import {RECOVERY_COOKIE} from '@/lib/trial/recovery';
import {rateLimit} from '@/lib/db';
export async function POST(req:NextRequest){
 const denied=accountGuard(req);if(denied)return denied;
 const session=await customerSession(req.cookies.get(CUSTOMER_COOKIE)?.value);if(!session)return accountRedirect(req,'/la-so-cua-toi');
 try{await rateLimit('customer:link:'+session.userId,10);await linkAvailableReadings(session.userId,req.cookies.get(TRIAL_COOKIE)?.value,req.cookies.get(RECOVERY_COOKIE)?.value);return accountRedirect(req,'/la-so-cua-toi?notice=linked');}
 catch{return accountRedirect(req,'/la-so-cua-toi?notice=link-retry');}
}
