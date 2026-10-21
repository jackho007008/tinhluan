import type {NextRequest} from 'next/server';
import {z} from 'zod';
import {trialPostGuard,trialBody,trialJson,trialError} from '@/lib/trial/http';
import {TRIAL_COOKIE} from '@/lib/trial/store';
import {bindRecoveryEmail,requestRecovery,exchangeReadingToken,recoveryEnabled,RECOVERY_COOKIE} from '@/lib/trial/recovery';
import {rateLimit} from '@/lib/db';
export const runtime='nodejs';
const email=z.string().trim().email().max(254);
const input=z.discriminatedUnion('action',[
 z.object({action:z.literal('bind'),email,readingId:z.string().uuid(),orderId:z.string().uuid().optional()}).strict(),
 z.object({action:z.literal('request'),email}).strict(),
 z.object({action:z.literal('exchange'),token:z.string().regex(/^[A-Za-z0-9_-]{43}$/)}).strict(),
]);
export async function POST(req:NextRequest){
 const blocked=trialPostGuard(req);if(blocked)return blocked;
 if(!recoveryEnabled())return trialJson({error:'Khôi phục qua email chưa mở.'},404);
 try{
  const parsed=input.safeParse(await trialBody(req));if(!parsed.success)return trialJson({error:'Kiểm tra địa chỉ email hoặc liên kết.'},400);
  const b=parsed.data;
  if(b.action==='exchange'){
   await rateLimit('recovery:exchange:global',100);
   const grant=await exchangeReadingToken(b.token);
   const res=trialJson({url:grant.url});res.cookies.set(RECOVERY_COOKIE,grant.token,{httpOnly:true,secure:req.headers.get('origin')!.startsWith('https://'),sameSite:'lax',path:'/',expires:new Date(grant.expiresAt)});return res;
  }
  if(b.action==='bind')await bindRecoveryEmail(req.cookies.get(TRIAL_COOKIE)?.value,b.readingId,b.orderId,b.email);
  else await requestRecovery(b.email);
  return trialJson({message:'Nếu yêu cầu hợp lệ, liên kết sẽ được gửi tới email. Hãy kiểm tra hộp thư; bạn có thể thử lại sau nếu chưa nhận được.'},202);
 }catch(e){
  if(e instanceof Error&&e.message==='RECOVERY_DENIED')return trialJson({error:'Liên kết hoặc quyền truy cập không còn hợp lệ. Hãy yêu cầu liên kết mới trong thời hạn quyền đọc.'},403);
  return trialError(e);
 }
}
