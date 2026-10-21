import {NextResponse,type NextRequest} from 'next/server';
import {customerRequestOrigin} from '../customer-origin';
export const trialEnabled=()=>process.env.FREE_TRIAL_ENABLED==='true';
export const trialJson=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie',...(status===429?{'Retry-After':'600'}:{})}});
export function trialPostGuard(req:NextRequest){
 if(!trialEnabled())return trialJson({error:'Bản dùng thử chưa mở.'},404);
 if(!customerRequestOrigin(req.headers.get('origin'))||req.headers.get('sec-fetch-site')==='cross-site')return trialJson({error:'Nguồn yêu cầu không hợp lệ.'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return trialJson({error:'Định dạng không hợp lệ.'},415);
}
export async function trialBody(req:NextRequest){
 const reader=req.body?.getReader();let size=0;const chunks:Uint8Array[]=[];
 if(reader)while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;
  if(size>8192){await reader.cancel();throw Error('BODY_LIMIT');}chunks.push(part.value);}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw Error('BAD_JSON');}
}
export const trialError=(e:unknown)=>{
 const message=e instanceof Error?e.message:'';
 if(message==='RATE_LIMIT')return trialJson({error:'Đã tới giới hạn dùng thử. Vui lòng đợi 10 phút rồi thử lại.'},429);
 if(message==='BODY_LIMIT')return trialJson({error:'Thông tin gửi quá lớn.'},413);
 if(message==='BAD_JSON')return trialJson({error:'Thông tin gửi không hợp lệ.'},400);
 if(message==='ID_CONFLICT')return trialJson({error:'Yêu cầu này đã dùng cho thông tin khác. Hãy quay lại sửa và xác nhận.'},409);
 return trialJson({error:'Hệ thống đang bận hoặc chưa lưu được báo cáo. Thông tin trên form vẫn được giữ; vui lòng thử lại sau.'},503);
};
