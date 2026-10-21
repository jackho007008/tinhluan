import type {NextRequest} from 'next/server';
import {rateLimit} from '@/lib/db';
import {createTrialOwner,trialOwner,TRIAL_COOKIE,TRIAL_TTL,purgeExpiredTrialSessions} from '@/lib/trial/store';
import {trialPostGuard,trialJson,trialError,trialBody} from '@/lib/trial/http';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 const blocked=trialPostGuard(req);if(blocked)return blocked;
 try{
  const body=await trialBody(req);if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).length)return trialJson({error:'Yêu cầu không hợp lệ.'},400);
  const old=await trialOwner(req.cookies.get(TRIAL_COOKIE)?.value);
  if(old)return trialJson({expiresAt:old.expiresAt});
  await rateLimit('free-trial:sessions',100);
  await purgeExpiredTrialSessions();
  const {token,owner}=await createTrialOwner();const res=trialJson({expiresAt:owner.expiresAt});
  res.cookies.set(TRIAL_COOKIE,token,{httpOnly:true,sameSite:'lax',secure:req.headers.get('origin')!.startsWith('https://'),path:'/',maxAge:TRIAL_TTL});
  return res;
 }catch(e){return trialError(e);}
}
