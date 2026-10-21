import {NextResponse,type NextRequest} from 'next/server';
import {beginGoogle} from '@/lib/customer-auth/google';
import {accountGuard,accountRedirect,accountCookie,accountForm} from '@/lib/customer-auth/http';
import {OAUTH_COOKIE} from '@/lib/customer-auth/config';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 const denied=accountGuard(req);if(denied)return denied;
 try{
  if(Number(req.headers.get('content-length')||0)>2048)return accountRedirect(req,'/la-so-cua-toi?notice=error');
  const form=await accountForm(req);const flow=await beginGoogle(form.get('returnTo'));
  const response=NextResponse.redirect(flow.url,303);response.headers.set('Cache-Control','no-store');response.headers.set('Referrer-Policy','no-referrer');
  response.cookies.set(OAUTH_COOKIE,flow.state,accountCookie(req,600));return response;
 }catch{return accountRedirect(req,'/la-so-cua-toi?notice=unavailable');}
}
