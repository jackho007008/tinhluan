import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {resolveReadingOrder,RECOVERY_COOKIE,recoveryEnabled} from '@/lib/trial/recovery';
import type {NextRequest} from 'next/server';
import {getOwnedReadingOrder} from '@/lib/order-readings';
import {TRIAL_COOKIE} from '@/lib/trial/store';
import {trialJson} from '@/lib/trial/http';
import {rateLimit} from '@/lib/db';
import {renderStoredCustomerPdf} from '@/lib/internal-review/customer-pdf';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(req.headers.get('sec-fetch-site')==='cross-site')return trialJson({error:'Hãy mở bản đọc trong phiên sở hữu đơn.'},403);
 try{
  const token=req.cookies.get(TRIAL_COOKIE)?.value;
  const access=await resolveReadingOrder(token,req.cookies.get(RECOVERY_COOKIE)?.value,(await params).id,req.cookies.get(CUSTOMER_COOKIE)?.value);const order=access?.order;
  if(!order)return trialJson({error:'Đơn không thuộc phiên này hoặc đã hết hạn.'},404);
  if(!order.reading)return trialJson({error:'Báo cáo của đơn chưa sẵn sàng hoặc quyền đã bị thu hồi.'},409);
  if(req.nextUrl.searchParams.get('evidence')==='1')return trialJson({error:'Chưa mở PDF kèm căn cứ.'},400);
  await rateLimit('core-order:pdf:'+order.id,5);await rateLimit('free-trial:pdf:global',20);
  const bytes=await renderStoredCustomerPdf(order.reading,access!.identity);
  if(!(await resolveReadingOrder(token,req.cookies.get(RECOVERY_COOKIE)?.value,order.id,req.cookies.get(CUSTOMER_COOKIE)?.value))?.order.reading)return trialJson({error:'Quyền tải không còn hiệu lực.'},404);
  return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="tinh-luan-don-${order.id}.pdf"`,'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
 }catch(e){const m=e instanceof Error?e.message:'';return trialJson({error:m==='RATE_LIMIT'?'Đã tới giới hạn tải. Vui lòng thử lại sau 10 phút.':m==='PRINT_BUSY'?'Đang chuẩn bị PDF khác. Vui lòng thử lại.':'Chưa chuẩn bị được PDF. Bản đã lưu không thay đổi; bạn có thể thử lại.'},m==='RATE_LIMIT'||m==='PRINT_BUSY'?429:503);}
}
