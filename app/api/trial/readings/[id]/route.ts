import {customerReadingAccess} from '@/lib/trial/reading-access';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {resolveTrialReading,RECOVERY_COOKIE} from '@/lib/trial/recovery';
import type {NextRequest} from 'next/server';
import {trialOwner,TRIAL_COOKIE,getTrialReading} from '@/lib/trial/store';
import {trialEnabled,trialJson,trialError} from '@/lib/trial/http';
export const runtime='nodejs';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!trialEnabled())return trialJson({error:'Không tìm thấy báo cáo.'},404);
 try{const access=await customerReadingAccess(req.cookies.get(TRIAL_COOKIE)?.value,req.cookies.get(RECOVERY_COOKIE)?.value,(await params).id,req.cookies.get(CUSTOMER_COOKIE)?.value);
  const record=access?.record;
  if(!record)return trialJson({error:'Báo cáo không thuộc phiên này hoặc đã hết hạn.'},404);
  return trialJson({id:record.id,report:access!.report,scope:access!.scope,expiresAt:access!.expiresAt});
 }catch(e){return trialError(e);}
}
