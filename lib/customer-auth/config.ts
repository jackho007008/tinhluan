export const CUSTOMER_COOKIE='tinhluan_customer';
export const OAUTH_COOKIE='tinhluan_google_flow';
export const SESSION_SECONDS=7*24*60*60;
export const customerAuthEnabled=()=>process.env.CUSTOMER_AUTH_ENABLED==='true';
export function googleConfig(){
 if(!customerAuthEnabled()||process.env.GOOGLE_LOGIN_ENABLED!=='true')return null;
 const id=process.env.GOOGLE_CLIENT_ID,secret=process.env.GOOGLE_CLIENT_SECRET;
 if(!id||!secret)return null;
 try{
  const u=new URL(process.env.GOOGLE_AUTH_ORIGIN||'');
  if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/'||u.search||u.hash)return null;
  return {id,secret,origin:u.origin,callback:u.origin+'/api/account/google/callback'};
 }catch{return null;}
}
/** Only fixed application destinations; no open redirect or personal data in return URLs. */
export function safeReturn(value:unknown){
 if(typeof value!=='string')return '/la-so-cua-toi';
 try{
  const u=new URL(value,'https://local.invalid');
  if(u.origin!=='https://local.invalid')return '/la-so-cua-toi';
  if(['/la-so-cua-toi','/lap-la-so','/internal/admin','/internal/admin/toan-thu'].includes(u.pathname))return u.pathname;
  if(u.pathname==='/checkout'){const key=u.searchParams.has('order')?'order':'id',id=u.searchParams.get(key)||'';if(/^[a-f0-9-]{36}$/i.test(id))return '/checkout?'+key+'='+id+(/^#cung-(?:[0-9]|1[01])$/.test(u.hash)?u.hash:'');}
  if(['/ban-doc','/don-thu'].includes(u.pathname)&&/^[a-f0-9-]{36}$/i.test(u.searchParams.get('id')||''))return u.pathname+'?id='+u.searchParams.get('id')+(u.searchParams.get('mode')==='basic'?'&mode=basic':'')+(/^#[a-zA-Z0-9_-]{1,100}$/.test(u.hash)?u.hash:'');
 }catch{}
 return '/la-so-cua-toi';
}
