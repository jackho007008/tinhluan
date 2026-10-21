import type {NextRequest} from 'next/server';
import {finishGoogle} from '@/lib/customer-auth/google';
import {loginVerifiedGoogle,linkAvailableReadings} from '@/lib/customer-auth/accounts';
import {CUSTOMER_COOKIE,OAUTH_COOKIE,SESSION_SECONDS} from '@/lib/customer-auth/config';
import {accountRedirect,accountCookie} from '@/lib/customer-auth/http';
import {TRIAL_COOKIE} from '@/lib/trial/store';
import {RECOVERY_COOKIE} from '@/lib/trial/recovery';
export const runtime='nodejs';
export async function GET(req:NextRequest){
 try{
  const result=await finishGoogle(req.nextUrl.searchParams,req.cookies.get(OAUTH_COOKIE)?.value);
  if(result.cancelled){const response=accountRedirect(req,'/la-so-cua-toi?notice=cancelled&returnTo='+encodeURIComponent(result.returnTo));response.cookies.set(OAUTH_COOKIE,'',accountCookie(req,0));return response;}
  const login=await loginVerifiedGoogle(result.identity,req.cookies.get(CUSTOMER_COOKIE)?.value);
  let linked=true;
  try{await linkAvailableReadings(login.userId,req.cookies.get(TRIAL_COOKIE)?.value,req.cookies.get(RECOVERY_COOKIE)?.value);}catch{linked=false;}
  const response=accountRedirect(req,linked?result.returnTo:'/la-so-cua-toi?notice=link-retry');
  response.cookies.set(CUSTOMER_COOKIE,login.token,accountCookie(req,SESSION_SECONDS));response.cookies.set(OAUTH_COOKIE,'',accountCookie(req,0));return response;
 }catch{const response=accountRedirect(req,'/la-so-cua-toi?notice=error');response.cookies.set(OAUTH_COOKIE,'',accountCookie(req,0));return response;}
}
