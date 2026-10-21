import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {resolveReadingOrder,RECOVERY_COOKIE,recoveryEnabled} from '@/lib/trial/recovery';
import type {NextRequest} from 'next/server';
import {getOwnedReadingOrder} from '@/lib/order-readings';
import {TRIAL_COOKIE} from '@/lib/trial/store';
import {trialJson} from '@/lib/trial/http';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 try{
  const access=await resolveReadingOrder(req.cookies.get(TRIAL_COOKIE)?.value,req.cookies.get(RECOVERY_COOKIE)?.value,(await params).id,req.cookies.get(CUSTOMER_COOKIE)?.value);const order=access?.order;
  return order?trialJson({order}):trialJson({error:'Đơn không thuộc phiên này hoặc đã hết hạn.'},404);
 }catch{return trialJson({error:'Chưa đọc được đơn. Vui lòng thử lại.'},503);}
}
