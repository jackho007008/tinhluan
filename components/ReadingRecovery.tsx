'use client';
import {useEffect,useRef,useState} from 'react';
export default function ReadingRecovery(){
 const [token,setToken]=useState(''),[email,setEmail]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');const lock=useRef(false);
 useEffect(()=>{const receive=()=>{const value=location.hash.slice(1);if(value){setToken(value);setMessage('');}history.replaceState(null,'','/recover?reading=1');};receive();window.addEventListener('hashchange',receive);return()=>window.removeEventListener('hashchange',receive);},[]);
 async function submit(e:React.FormEvent){e.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setMessage('');
  try{const res=await fetch('/api/trial/recovery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(token?{action:'exchange',token}:{action:'request',email})});const d=await res.json();if(!res.ok)throw Error(d.error||'Chưa thực hiện được. Vui lòng thử lại.');if(token){location.replace(d.url);return;}setMessage(d.message);}catch(e){setMessage(e instanceof Error?e.message:'Chưa thực hiện được. Vui lòng thử lại.');}finally{lock.current=false;setBusy(false);}
 }
 return <section className="card recovery-page"><h1>Mở lại bản đọc</h1><p>{token?'Bấm Tiếp tục để xác minh email và mở bản đọc. Chỉ mở trang này chưa sử dụng liên kết.':'Nhập email đã xác minh để nhận liên kết mở lại bản đọc còn hạn.'}</p><form onSubmit={submit}>{!token&&<label>Email đã xác minh<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>}<button className="button" disabled={busy}>{busy?'Đang xử lý…':token?'Tiếp tục':'Gửi liên kết mở lại'}</button></form><p role="status">{message}</p><p>Liên kết dùng một lần, có hạn tối đa 15 phút; không gia hạn quyền đọc hoặc khôi phục quyền đã bị thu hồi.</p>{token&&<a href="/recover?reading=1">Yêu cầu liên kết mới</a>}<p><a href="/lap-la-so">Lập lá số miễn phí</a></p></section>;
}
