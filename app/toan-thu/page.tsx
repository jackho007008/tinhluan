import CustomerShell from '@/components/CustomerShell';
import {categories,listPublished} from '@/lib/encyclopedia/model';
import './style.css';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const params=await searchParams,q=typeof params.q==='string'?params.q.slice(0,120):'',category=typeof params.category==='string'?params.category:'';
 let items:Awaited<ReturnType<typeof listPublished>>=[];let unavailable=false;try{items=await listPublished(q,category);}catch{unavailable=true;}
 return <CustomerShell publicTrial><main className="ency-shell"><span className="eyebrow">TINH LUẬN · TRA CỨU</span><h1>Toàn thư</h1><p>Tra cứu thuật ngữ và cách đọc lá số. Nội dung tham khảo, không thay thế việc xét điều kiện của từng hồ sơ.</p><form className="ency-filters"><label>Tìm bài<input name="q" defaultValue={q} maxLength={120} placeholder="Có thể gõ không dấu"/></label><label>Nhóm bài<select name="category" defaultValue={category}><option value="">Tất cả</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label><button>Tìm kiếm</button></form><div className="ency-grid">{items.map(a=><article key={a.id} className="ency-card"><span className="eyebrow">{a.content.category}</span><h2><a href={'/toan-thu/'+a.content.slug}>{a.content.title}</a></h2><p>{a.content.description}</p><a href={'/toan-thu/'+a.content.slug}>Đọc bài →</a></article>)}</div>{unavailable?<p role="alert">Chưa tải được danh sách. Vui lòng thử lại.</p>:!items.length&&<p>{q||category?'Chưa có bài công khai phù hợp.':'Các bài đầu tiên đang được biên tập và duyệt trước khi xuất bản.'}</p>}</main></CustomerShell>;
}
