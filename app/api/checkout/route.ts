import type {NextRequest} from 'next/server';
import {z} from 'zod';
import {trialPostGuard,trialBody,trialJson} from '@/lib/trial/http';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {customerSession} from '@/lib/customer-auth/accounts';
import {createCheckout} from '@/lib/checkout/test';
import {rateLimit} from '@/lib/db';
export async function POST(req:NextRequest){
 const denied=trialPostGuard(req);if(denied)return denied;
 try{
  const token=req.cookies.get(CUSTOMER_COOKIE)?.value,s=await customerSession(token);if(!s)return trialJson({error:'Hãy đăng nhập để tiếp tục.'},401);
  const input=z.object({readingId:z.string().uuid(),anchor:z.string().max(30),offerVersion:z.string().max(80)}).strict().parse(await trialBody(req));
  await rateLimit('checkout:create:'+s.userId,20);
  const id=await createCheckout(token,input.readingId,input.anchor,input.offerVersion);return trialJson({id,url:'/checkout?order='+id});
 }catch(e){const code=e instanceof Error?e.message:'';
  return trialJson({error:code==='RATE_LIMIT'?'Bạn đã thử nhiều lần. Vui lòng đợi 10 phút.':code==='OFFER_CHANGED'?'Cấu hình thử đã đổi. Hãy tải lại phạm vi gói.':'Chưa tạo được đơn. Chỉ tài khoản QA được chỉ định và bản đọc còn quyền mới được thử; bạn có thể thử lại.'},code==='RATE_LIMIT'?429:code==='CHECKOUT_DENIED'?403:code==='OFFER_CHANGED'?409:400);
 }
}
