'use client';
import {useRef,useState} from 'react';
export default function TrialReadingPdf({id,orderId}:{id:string;orderId?:string}){
 const pending=useRef(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false);
 async function download(){
  if(pending.current)return;pending.current=true;setBusy(true);setError('');setDone(false);
  try{
   const response=await fetch('/api/trial/'+(orderId?'orders/':'readings/')+encodeURIComponent(orderId||id)+'/report-pdf',{cache:'no-store'});
   if(!response.ok){const result=await response.json();throw Error(result.error||'Chưa tải được PDF. Vui lòng thử lại.');}
   if(!response.headers.get('content-type')?.includes('application/pdf'))throw Error('Tệp trả về chưa đúng định dạng PDF. Vui lòng thử lại.');
   const url=URL.createObjectURL(await response.blob()),a=document.createElement('a');a.href=url;a.download='tinh-luan-ban-doc-'+id+'.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);setDone(true);
  }catch(e){setError(e instanceof TypeError?'Kết nối bị gián đoạn. Bạn có thể thử tải lại PDF.':e instanceof Error?e.message:'Chưa tải được PDF. Vui lòng thử lại.');}
  finally{pending.current=false;setBusy(false);}
 }
 return <div className="trial-pdf"><button type="button" className="button quiet" aria-label={error?'Thử tải lại PDF toàn bộ bản đọc':'Tải PDF toàn bộ bản đọc'} disabled={busy} onClick={download}>{busy?'Đang chuẩn bị PDF…':error?'Thử tải lại PDF':'Tải PDF'}</button><p className="hint" role="status">{busy?'Đang xuất toàn bộ bài chi tiết đã lưu.':done?'PDF đã sẵn sàng. Bạn có thể mở trong mục tải xuống của trình duyệt.':'Toàn bộ bài chi tiết, gồm cả các phần ngoài bản cơ bản.'}</p>{error&&<p className="error" role="alert">{error}</p>}</div>;
}
