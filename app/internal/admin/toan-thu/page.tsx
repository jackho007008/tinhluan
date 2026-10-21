import {cookies} from 'next/headers';
import {adminIdentity} from '@/lib/admin/auth';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {getDraft,listDrafts,publishedArticleLinks} from '@/lib/encyclopedia/model';
import {categories} from '@/lib/encyclopedia/schema';
import Editor from '@/components/encyclopedia/Editor';
import '../../../toan-thu/style.css';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{id?:string;new?:string;preview?:string;category?:string;draft?:string}>}){
 const session=(await cookies()).get(CUSTOMER_COOKIE)?.value;
 if(!await adminIdentity(session))return <main className="ency-shell"><h1>Cần tài khoản quản trị</h1><a href="/la-so-cua-toi?returnTo=%2Finternal%2Fadmin%2Ftoan-thu">Đăng nhập Google</a></main>;
 const params=await searchParams;
 const category=categories.find(c=>c===params.category);
 const draftOnly=params.draft==='1';
 const filters={...(category?{category}:{}),...(draftOnly?{draft:'1'}:{})};
 const listUrl='/internal/admin/toan-thu?'+new URLSearchParams(filters);
 const previewUrl=(id:string)=>'/internal/admin/toan-thu?'+new URLSearchParams({id,preview:'1',...filters});
 let body;
 try{
  if(params.new==='1')body=<Editor initial={null} publishedArticles={await publishedArticleLinks()}/>;
  else if(params.id){
   const a=await getDraft(session,params.id);
   if(!a)body=<p>Không tìm thấy bài.</p>;
   else{
    const articles=(await listDrafts(session)).filter(x=>(!category||x.draft.category===category)&&(!draftOnly||x.published_version===null)).sort((x,y)=>x.draft.title.localeCompare(y.draft.title,'vi'));
    const index=articles.findIndex(x=>x.id===a.id),previous=index>0?articles[index-1]:null,next=index>=0?articles[index+1]:null;
    body=<><nav className="ency-review-nav" aria-label="Duyệt các bài nháp"><a href={listUrl}>← Danh sách{category?' '+category:''}</a>{previous&&<a href={previewUrl(previous.id)}>← Bài trước: {previous.draft.title}</a>}{next&&<a href={previewUrl(next.id)}>Bài tiếp: {next.draft.title} →</a>}</nav><Editor key={a.id} initial={a} initialPreview={params.preview==='1'} publishedArticles={await publishedArticleLinks()}/></>;
   }
  }else{
   const articles=(await listDrafts(session)).filter(a=>(!category||a.draft.category===category)&&(!draftOnly||a.published_version===null)).sort((a,b)=>a.draft.title.localeCompare(b.draft.title,'vi'));
   body=<><a className="ency-button" href="?new=1">Tạo bản nháp</a><form className="ency-filters" method="get"><label>Nhóm bài<select name="category" defaultValue={category??''}><option value="">Tất cả nhóm</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Trạng thái<select name="draft" defaultValue={draftOnly?'1':''}><option value="">Tất cả trạng thái</option><option value="1">Nháp chưa xuất bản</option></select></label><button type="submit">Lọc bài</button></form><p>{articles.length} bài · Bản nháp và bài ẩn chỉ hiển thị trong khu nội bộ.</p><div className="ency-grid">{articles.map(a=><article className="ency-card" key={a.id}><span className="eyebrow">{a.draft.category}</span><h2>{a.draft.title}</h2><p>{a.visible?'Công khai · bản '+a.published_version:a.published_version?'Đã ẩn · từng xuất bản':'Bản nháp'}</p><p>{a.draft.description}</p><div className="ency-actions"><a href={previewUrl(a.id)}>Xem trước bản nháp →</a><a href={'?id='+a.id}>Soạn bài</a></div></article>)}</div></>;
  }
 }catch{body=<p role="alert">Chưa tải được bài. Kiểm tra kho dữ liệu hoặc đường dẫn rồi thử lại.</p>;}
 return <main className="ency-shell"><span className="eyebrow">TINH LUẬN · QUẢN TRỊ</span><h1>Toàn thư</h1><nav className="ency-tabs" aria-label="Điều hướng Toàn thư"><a href="/internal/admin">← Vận hành</a><a href="/internal/admin/toan-thu">Danh sách bài</a><a href="/toan-thu">Trang công khai ↗</a></nav>{body}</main>;
}
