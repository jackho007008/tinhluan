import {NextResponse,type NextRequest} from 'next/server';
import {customerRequestOrigin} from '../customer-origin';
import {customerAuthEnabled,googleConfig} from './config';
export function accountGuard(req:NextRequest){
 if(!customerAuthEnabled())return NextResponse.json({error:'Chức năng chưa mở.'},{status:404});
 if(!customerRequestOrigin(req.headers.get('origin'))||req.headers.get('sec-fetch-site')==='cross-site')return NextResponse.json({error:'Yêu cầu không hợp lệ.'},{status:403});
 return null;
}
export function accountRedirect(req:NextRequest,path:string){
 // Configured authority only; never use arbitrary forwarded Host for the OAuth return.
 const origin=googleConfig()?.origin||process.env.APP_ORIGIN||'http://localhost:3000';
 const response=NextResponse.redirect(new URL(path,origin),303);
 response.headers.set('Cache-Control','private, no-store');response.headers.set('Referrer-Policy','no-referrer');return response;
}
export function accountCookie(req:NextRequest,maxAge:number){
 return {httpOnly:true,sameSite:'lax' as const,secure:req.nextUrl.protocol==='https:'||req.headers.get('x-forwarded-proto')==='https',path:'/',maxAge};
}
/** Native form input, bounded independently of Content-Length. */
export async function accountForm(req:NextRequest){
 if(!req.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))throw Error('FORM_INVALID');
 const reader=req.body?.getReader();if(!reader)throw Error('FORM_INVALID');
 const chunks:Uint8Array[]=[];let size=0;
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2048){await reader.cancel();throw Error('FORM_INVALID');}chunks.push(value);}
 const form=new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
 if([...form.keys()].some(k=>k!=='returnTo')||form.getAll('returnTo').length>1)throw Error('FORM_INVALID');return form;
}
