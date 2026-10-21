import {customerReadingAccess} from '@/lib/trial/reading-access';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {resolveTrialReading,RECOVERY_COOKIE} from '@/lib/trial/recovery';
import type {NextRequest} from 'next/server';
import {rateLimit} from '@/lib/db';
import {trialOwner,TRIAL_COOKIE,getTrialReading} from '@/lib/trial/store';
import {trialEnabled,trialJson} from '@/lib/trial/http';
import {renderStoredCustomerPdf} from '@/lib/internal-review/customer-pdf';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!trialEnabled())return trialJson({error:'Không tìm thấy báo cáo.'},404);
 if(req.headers.get('sec-fetch-site')==='cross-site')return trialJson({error:'Hãy mở báo cáo trong phiên đã tạo để tải PDF.'},403);
 try{
  const id=(await params).id;
  const access=await customerReadingAccess(req.cookies.get(TRIAL_COOKIE)?.value,req.cookies.get(RECOVERY_COOKIE)?.value,id,req.cookies.get(CUSTOMER_COOKIE)?.value);
  const record=access?.record;
  if(!record?.frozen.customerReport)return trialJson({error:'Báo cáo không thuộc phiên này hoặc đã hết hạn.'},404);
  if(!access!.scope.full)return trialJson({error:'PDF toàn bài cần quyền đọc đầy đủ. Chưa mở bán trên QA.'},403);
  if(new URL(req.url).searchParams.get('evidence')==='1')return trialJson({error:'Bản dùng thử hiện chỉ tải PDF bản đọc.'},400);
  await rateLimit('free-trial:pdf:owner:'+access!.key,5);
  await rateLimit('free-trial:pdf:global',20);
  const bytes=await renderStoredCustomerPdf(record,access!.identity);
  if(!(await customerReadingAccess(req.cookies.get(TRIAL_COOKIE)?.value,req.cookies.get(RECOVERY_COOKIE)?.value,id,req.cookies.get(CUSTOMER_COOKIE)?.value))?.scope.full)return trialJson({error:'Phiên dùng thử đã hết hạn.'},404);
  return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="tinh-luan-ban-doc-${record.id}.pdf"`,'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
 }catch(e){
  const message=e instanceof Error?e.message:'';
  if(message==='RATE_LIMIT')return trialJson({error:'Đã tới giới hạn tải PDF. Vui lòng đợi 10 phút rồi thử lại.'},429);
  if(message==='PRINT_BUSY')return new Response(JSON.stringify({error:'Đang chuẩn bị một PDF khác. Vui lòng thử lại sau ít phút.'}),{status:429,headers:{'Content-Type':'application/json','Cache-Control':'private, no-store','Vary':'Cookie','Retry-After':'10'}});
  return trialJson({error:'Chưa chuẩn bị được PDF. Bản đọc vẫn được giữ nguyên, bạn có thể thử lại.'},503);
 }
}
