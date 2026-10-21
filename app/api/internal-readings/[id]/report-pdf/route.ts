import {cookies} from 'next/headers';
import {renderStoredCustomerPdf} from '@/lib/internal-review/customer-pdf';
import {reviewAuthorized} from '@/lib/internal-review/auth';
import {getReading} from '@/lib/internal-review/reading-store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const token=(await cookies()).get('tuvi_internal')?.value;
 if(!reviewAuthorized(token))return new Response('Cần quyền nội bộ',{status:401});
 const {id}=await params;
 const evidence=new URL(_req.url).searchParams.get('evidence')==='1';
 if(!/^[a-f0-9-]{36}$/.test(id))return new Response('Không tìm thấy bản đọc',{status:404});
 const record=await getReading(id);
 if(!record)return new Response('Không tìm thấy bản đọc',{status:404});
 if(!record.frozen.customerReport)return new Response('Bản lịch sử chưa có bản khách hàng đã lưu. Hãy tạo một bản mới; bản lịch sử được giữ nguyên.',{status:409});
 try{
  const bytes=await renderStoredCustomerPdf(record,{kind:'internal',token:token!},evidence);
  return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="tinh-luan-${id}.pdf"`,'Cache-Control':'private, no-store'}});
 }catch(e){
  if(e instanceof Error&&e.message==='PRINT_BUSY')return new Response('Đang xuất một báo cáo khác. Vui lòng thử lại.',{status:429,headers:{'Retry-After':'10'}});
  return new Response('Chưa xuất được PDF toàn bài. Bản đọc đã lưu không thay đổi.',{status:503});
 }
}
