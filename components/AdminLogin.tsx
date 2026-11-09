'use client';
import {useState,type FormEvent} from 'react';
export default function AdminLogin(){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError('');
  const data=new FormData(e.currentTarget);
  try{
   const response=await fetch('/api/admin-login',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({identifier:String(data.get('identifier')||''),password:String(data.get('password')||'')})});
   if(response.ok&&response.redirected){window.location.assign('/internal/admin');return;}
   setError('Chưa đăng nhập được. Kiểm tra tài khoản và mật khẩu, hoặc thử lại sau 10 phút.');
  }catch{setError('Không kết nối được máy chủ. Vui lòng thử lại.');}finally{setBusy(false);}
 }
 return <form onSubmit={submit} className="card"><h1>Đăng nhập quản trị</h1><p>Dùng tài khoản đã được cấp quyền quản trị.</p><label className="field">Username hoặc email<input name="identifier" autoComplete="username" required maxLength={320}/></label><label className="field">Mật khẩu<input name="password" type="password" autoComplete="current-password" required maxLength={1024}/></label>{error&&<p role="alert">{error}</p>}<button className="button" type="submit" disabled={busy}>{busy?'Đang đăng nhập…':'Đăng nhập'}</button></form>;
}
