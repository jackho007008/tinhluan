import {pool} from '../db';
import {customerSession,linkedReading,type ReadingLink} from './accounts';
import {projectReading} from '../trial/reading-policy';

export type LibraryTab='readings'|'purchased'|'orders';
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase();
/** Metadata only. Ownership is an exact existing link, never an email or a shared name. */
export async function customerLibrary(token:string|undefined,options:{q?:string;page?:string;tab?:string}={}){
 const session=await customerSession(token);if(!session)return null;
 const tab:LibraryTab=options.tab==='orders'||options.tab==='purchased'?options.tab:'readings';
 const q=(options.q||'').trim().slice(0,100);
 const links=(await pool.query('SELECT * FROM customer_reading_links WHERE user_id=$1 ORDER BY created_at DESC',[session.userId])).rows as (ReadingLink&{created_at:Date})[];
 // A session owner hash alone is insufficient: prove a link to this exact saved edition.
 const orders=(await pool.query(`SELECT o.id,o.code,o.amount,o.demo,o.payment_status,o.report_status,o.created_at,b.reading_id,EXISTS(SELECT 1 FROM customer_checkouts ck WHERE ck.order_id=o.id AND ck.user_id=$1) AS checkout
 FROM orders o JOIN order_reading_bindings b ON b.order_id=o.id WHERE EXISTS
 (SELECT 1 FROM customer_reading_links l WHERE l.user_id=$1 AND l.owner_hash=b.owner_hash AND l.reading_id=b.reading_id AND (l.order_id IS NULL OR l.order_id=o.id)) OR EXISTS(SELECT 1 FROM customer_checkouts ck WHERE ck.order_id=o.id AND ck.user_id=$1) ORDER BY o.created_at DESC`,[session.userId])).rows;
 const items: {id:string;name:string;dateLabel:string;createdAt:string;expiresAt:string;status:string;url:string|null;editUrl:string|null;order?:{code:string;amount:number;test:boolean;payment:string;delivery:string}}[]=[];
 const byReading=new Map<string,typeof items[number]>();
 for(const link of links){
  const record=await linkedReading(link);
  const prior=byReading.get(link.reading_id);
  const row={id:link.reading_id,dateLabel:record?'Tạo ngày':'Liên kết ngày',name:record?(record.snapshot.normalized.name||'Hồ sơ bản mệnh'):'Bản đọc không còn quyền truy cập',createdAt:record?.createdAt||new Date(link.created_at).toISOString(),expiresAt:new Date(link.expires_at).toISOString(),status:record?(projectReading(record,!!link.order_id).scope.full?'Đọc toàn bài và PDF':'Đọc Mệnh miễn phí'):new Date(link.expires_at).getTime()<=Date.now()?'Đã hết hạn':'Quyền hiện không còn hiệu lực',url:record?(link.order_id?'/don-thu?id='+link.order_id:'/ban-doc?id='+link.reading_id):null,editUrl:record?.inputReceipt?'/lap-la-so?edit='+link.reading_id:null};
  if(!prior||(!prior.url&&row.url)||(link.order_id&&row.url))byReading.set(link.reading_id,row);
 }
 if(tab==='readings')items.push(...byReading.values());
 else for(const o of orders){
  if(tab==='purchased'&&((o.demo&&!o.checkout)||o.payment_status!=='paid'))continue;
  const r=byReading.get(o.reading_id);
  // Delivered access is checked again by the order route. Do not advertise an open link without a valid exact order grant.
  const link=links.find(l=>l.order_id===o.id);
  const valid=link?await linkedReading(link):null;
  items.push({id:o.id,dateLabel:'Tạo ngày',name:r?.name||'Báo cáo của đơn hàng',createdAt:new Date(o.created_at).toISOString(),expiresAt:r?.expiresAt||'',status:valid?'Đã giao · còn quyền đọc':o.report_status==='ready'?'Đã giao · kiểm tra quyền khi mở':o.report_status==='failed'?'Chưa giao được báo cáo':'Chưa giao báo cáo',url:o.checkout?'/checkout?order='+o.id:valid?'/don-thu?id='+o.id:null,editUrl:null,order:{code:o.code,amount:Number(o.amount),test:!!o.demo,payment:o.payment_status,delivery:o.report_status}});
 }
 const filtered=items.filter(r=>!q||normalize([r.name,r.id,r.order?.code||''].join(' ')).includes(normalize(q))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 const size=8,total=filtered.length,pages=Math.max(1,Math.ceil(total/size));
 const requested=/^[0-9]{1,6}$/.test(options.page||'')?Number(options.page):1,page=Math.max(1,Math.min(pages,requested));
 return {tab,q,page,pages,total,items:filtered.slice((page-1)*size,page*size)};
}
