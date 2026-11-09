import {NextRequest,NextResponse} from 'next/server';
import {loginAdminPassword,passwordLoginEnabled} from '@/lib/admin/password';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {logoutCustomer} from '@/lib/customer-auth/accounts';
import {accountCookie} from '@/lib/customer-auth/http';
import {SESSION_SECONDS} from '@/lib/customer-auth/config';
import {customerRequestOrigin} from '@/lib/customer-origin';
export async function POST(req:NextRequest){
 if(!passwordLoginEnabled())return NextResponse.json({error:'Chức năng chưa mở.'},{status:404});
 if(!customerRequestOrigin(req.headers.get('origin'))||req.headers.get('sec-fetch-site')==='cross-site')return NextResponse.json({error:'Yêu cầu không hợp lệ.'},{status:403});
 try{
  if(!req.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))throw Error('FORM_INVALID');
  const reader=req.body?.getReader();if(!reader)throw Error('FORM_INVALID');
  const parts:Uint8Array[]=[];let size=0;
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();throw Error('FORM_INVALID');}parts.push(value);}
  const form=new URLSearchParams(Buffer.concat(parts).toString('utf8'));
  if([...form.keys()].some(k=>!['identifier','password','action'].includes(k))||['identifier','password','action'].some(k=>form.getAll(k).length>1))throw Error('FORM_INVALID');
  const response=NextResponse.redirect(new URL('/internal/admin',process.env.APP_ORIGIN!),303);
  response.headers.set('Cache-Control','no-store');
  if(form.get('action')==='logout'){
   await logoutCustomer(req.cookies.get(CUSTOMER_COOKIE)?.value);
   response.cookies.set(CUSTOMER_COOKIE,'',accountCookie(req,0));
  }else{
   const token=await loginAdminPassword(form.get('identifier')||'',form.get('password')||'',req.cookies.get(CUSTOMER_COOKIE)?.value);
   response.cookies.set(CUSTOMER_COOKIE,token,accountCookie(req,SESSION_SECONDS));
  }
  return response;
 }catch{return NextResponse.json({error:'Chưa đăng nhập được. Kiểm tra tài khoản và mật khẩu, hoặc thử lại sau 10 phút.'},{status:401,headers:{'Cache-Control':'no-store'}});}
}
