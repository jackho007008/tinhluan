'use client';
import {useRef,useState} from 'react';
export default function ReadingEmailAccess({readingId,orderId}:{readingId:string;orderId?:string}){
 const [email,setEmail]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');const sending=useRef(false);
 async function send(e:React.FormEvent){e.preventDefault();if(sending.current)return;sending.current=true;setBusy(true);setMessage('');
  try{const res=await fetch('/api/trial/recovery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'bind',email,readingId,orderId})});const data=await res.json();setMessage(res.ok?data.message:data.error||'Chưa gửi được yêu cầu. Hãy thử lại.');}catch{setMessage('Chưa gửi được yêu cầu. Email đã nhập vẫn được giữ; hãy thử lại.');}finally{sending.current=false;setBusy(false);}
 }
 return <details className="card reading-email"><summary>Mở lại bản đọc qua email</summary><p>Xác minh email để mở đúng bản này trên thiết bị khác. Quyền đọc vẫn hết hạn theo phiên ban đầu, không được gia hạn.</p><form onSubmit={send}><label>Email của bạn<input type="email" required maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><button className="button" disabled={busy} type="submit">{busy?'Đang gửi yêu cầu…':'Gửi liên kết xác minh'}</button></form><p role="status">{message}</p><p><a href="/recover?reading=1">Đã xác minh email? Yêu cầu mở lại</a></p></details>;
}
