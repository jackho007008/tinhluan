import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {z} from 'zod';
import {pool} from '../db';
import {requireAdmin} from './auth';
import {dateBounds,within} from './extended';
export {requireAdmin,AdminAccessError} from './auth';
import {validReadingId,type InternalReading} from '../internal-review/reading-store';
export const querySchema=z.object({
 view:z.enum(['overview','users','user','rights','activity','audit','reports','orders','transactions','order','report']).default('overview'),
 q:z.string().trim().max(120).default(''),page:z.coerce.number().int().min(1).max(100000).default(1),
 size:z.coerce.number().pipe(z.union([z.literal(5),z.literal(20),z.literal(50)])).default(20),
 source:z.enum(['all','free','order','internal']).default('all'),
 status:z.enum(['all','pending','paid','expired','ready','retry','failed','waiting','accepted','mismatch','unknown_order','ignored','event_conflict','not_enrolled']).default('all'),
 from:z.preprocess(v=>v===''?undefined:v,z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),to:z.preprocess(v=>v===''?undefined:v,z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
 channel:z.enum(['all','pdf','email','report','webhook']).default('all'),
 environment:z.enum(['all','test','live']).default('all'),id:z.string().uuid().optional(),
});
export type AdminQuery=z.infer<typeof querySchema>;
export function parseQuery(p:URLSearchParams){return querySchema.parse(Object.fromEntries(p));}
const time=(d:Date|string)=>new Date(d).toISOString();
export function safeError(value:unknown){if(!value)return null;return typeof value==='string'&&['REPORT_FAILED','EMAIL_FAILED','ORDER_ARTIFACT_MISMATCH','DELIVERED_ARTIFACT_MISMATCH','ORDER_SESSION_EXPIRED','ORDER_NOT_PAID'].includes(value)?value:'Có lỗi đã ghi nhận; nội dung thô được ẩn để bảo vệ thông tin.';}
function summary(r:InternalReading,source:string,key:string){return {id:r.id,key,source,name:r.frozen.customerReport?.name||r.snapshot.normalized.name||'Chưa có tên',createdAt:r.createdAt,presentation:r.frozen.presentationVersion,catalog:r.frozen.catalogVersion};}
async function dirs(dir:string){try{return await readdir(dir,{withFileTypes:true});}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}}
// Read-only discovery of the existing stores. Never read session files or return owner directory names.
async function fileReadings(source:'free'|'internal',id?:string){
 const root=path.resolve(source==='free'?process.env.TRIAL_READING_DIR||'.local/trial-readings':process.env.INTERNAL_READING_DIR||'.local/internal-readings');
 const folders=source==='free'?(await dirs(path.join(root,'readings'))).filter(d=>d.isDirectory()&&/^[a-f0-9]{64}$/.test(d.name)).map(d=>path.join(root,'readings',d.name)):[root];
 const rows:InternalReading[]=[];
 for(const folder of folders)for(const file of await dirs(folder)){
  if(!file.isFile()||!file.name.endsWith('.json')||!validReadingId(file.name.slice(0,-5))||(id&&file.name!==id+'.json'))continue;
  const r=JSON.parse(await readFile(path.join(folder,file.name),'utf8')) as InternalReading;
  if(r.id!==file.name.slice(0,-5)||!r.frozen||!r.snapshot)throw Error('ADMIN_STORE_INVALID');
  rows.push(r);
 }
 if(id&&rows.length>1)throw Error('ADMIN_READING_AMBIGUOUS');
 return rows;
}
const pageOf=<T,>(rows:T[],q:AdminQuery)=>({items:rows.slice((q.page-1)*q.size,q.page*q.size),total:rows.length,page:q.page,size:q.size});
export async function adminReports(session:string|undefined,q:AdminQuery){
 await requireAdmin(session);
 const rows:Array<ReturnType<typeof summary>&{orderCode?:string;delivery?:string}>=[];
 for(const source of ['free','internal'] as const)if(q.source==='all'||q.source===source)for(const r of await fileReadings(source))rows.push(summary(r,source,r.id));
 if(q.source==='all'||q.source==='order'){
  const result=await pool.query(`SELECT o.id,o.code,o.report_status,b.reading_id,coalesce(b.data->>'createdAt',b.created_at::text) created_at,b.presentation_version,b.catalog_version,b.data#>>'{frozen,customerReport,name}' name FROM orders o JOIN order_reading_bindings b ON b.order_id=o.id`);
  for(const r of result.rows)rows.push({id:r.reading_id,key:r.id,source:'order',name:r.name||'Chưa có tên',createdAt:time(r.created_at),presentation:r.presentation_version,catalog:r.catalog_version,orderCode:r.code,delivery:r.report_status});
  const legacy=await pool.query(`SELECT r.id,r.order_id,r.created_at FROM reports r LEFT JOIN order_reading_bindings b ON b.order_id=r.order_id WHERE b.order_id IS NULL`);
  for(const r of legacy.rows)rows.push({id:r.id,key:r.order_id,source:'order',name:'Báo cáo cũ — chưa có bản khách hàng frozen',createdAt:time(r.created_at),presentation:'Chưa ghi nhận',catalog:'Chưa ghi nhận'});
 }
 const needle=q.q.toLocaleLowerCase('vi');
 const filtered=rows.filter(r=>within(r.createdAt,q)&&[r.id,r.key,r.name,r.orderCode||''].some(v=>v.toLocaleLowerCase('vi').includes(needle))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||a.source.localeCompare(b.source)||a.key.localeCompare(b.key));
 return {...pageOf(filtered,q),uniqueTotal:new Set(filtered.map(r=>r.id)).size};
}
export async function adminOrders(session:string|undefined,q:AdminQuery){
 await requireAdmin(session);const args:unknown[]=[q.q,q.environment,q.status,...dateBounds(q)];
 const where=`WHERE (strpos(lower(o.code),lower($1))>0 OR strpos(o.id::text,$1)>0) AND ($2='all' OR o.demo=($2='test')) AND ($3='all' OR o.payment_status=$3 OR o.report_status=$3) AND ($4::timestamptz IS NULL OR o.created_at>=$4) AND ($5::timestamptz IS NULL OR o.created_at<$5)`;
 const total=Number((await pool.query(`SELECT count(*) FROM orders o ${where}`,args)).rows[0].count);
 const items=(await pool.query(`SELECT o.id,o.code,o.amount,o.currency,o.demo,o.payment_status,o.report_status,o.email_status,o.created_at,j.status worker_status,j.attempts,r.id report_id,b.reading_id FROM orders o LEFT JOIN report_jobs j ON j.order_id=o.id LEFT JOIN reports r ON r.order_id=o.id LEFT JOIN order_reading_bindings b ON b.order_id=o.id ${where} ORDER BY o.created_at DESC,o.id LIMIT $6 OFFSET $7`,[...args,q.size,(q.page-1)*q.size])).rows;
 return {items,total,page:q.page,size:q.size};
}
export async function adminTransactions(session:string|undefined,q:AdminQuery){
 await requireAdmin(session);
 if(q.status==='paid'){
  const args=[q.q,...dateBounds(q),q.environment];
  const where=`WHERE (strpos(lower(o.code),lower($1))>0 OR strpos(p.id, $1)>0) AND ($2::timestamptz IS NULL OR p.created_at>=$2) AND ($3::timestamptz IS NULL OR p.created_at<$3) AND ($4='all' OR o.demo=($4='test'))`;
  const total=Number((await pool.query(`SELECT count(*) FROM payment_transactions p JOIN orders o ON o.id=p.order_id ${where}`,args)).rows[0].count);
  const items=(await pool.query(`SELECT p.id transaction_id,p.order_id,p.amount,'in' direction,'accepted' disposition,p.created_at,o.code,o.demo,true booked,(SELECT coalesce(json_agg(i.identity_key ORDER BY i.identity_key),'[]'::json) FROM sepay_test_identities i WHERE i.transaction_id=p.id AND (i.identity_key LIKE 'api:%' OR i.identity_key LIKE 'webhook:%')) aliases,(SELECT count(*)::int FROM operations_events x WHERE x.channel='webhook' AND x.transaction_id=p.id) webhook_receipts FROM payment_transactions p JOIN orders o ON o.id=p.order_id ${where} ORDER BY p.created_at DESC,p.id LIMIT $5 OFFSET $6`,[...args,q.size,(q.page-1)*q.size])).rows;
  return {items,total,page:q.page,size:q.size,checkpoints:[],issues:[]};
 }

 const args=[q.q,...dateBounds(q),q.environment,q.status];const where=`WHERE (strpos(lower(coalesce(o.code,'')),lower($1))>0 OR strpos(lower(e.transaction_id),lower($1))>0) AND ($2::timestamptz IS NULL OR e.created_at>=$2) AND ($3::timestamptz IS NULL OR e.created_at<$3) AND $4<>'live' AND ($5='all' OR e.disposition=$5)`;
 const total=Number((await pool.query(`SELECT count(*) FROM sepay_test_events e LEFT JOIN orders o ON o.id=e.order_id ${where}`,args)).rows[0].count);
 const items=(await pool.query(`SELECT e.transaction_id,e.order_id,e.amount,e.direction,e.disposition,e.created_at,o.code,
 (SELECT coalesce(json_agg(i.identity_key ORDER BY i.identity_key),'[]'::json) FROM sepay_test_identities i WHERE i.transaction_id=e.transaction_id AND (i.identity_key LIKE 'api:%' OR i.identity_key LIKE 'webhook:%')) aliases,
 EXISTS(SELECT 1 FROM payment_transactions p WHERE p.id=e.transaction_id) booked,
 (SELECT count(*)::int FROM operations_events x WHERE x.channel='webhook' AND x.transaction_id=e.transaction_id) webhook_receipts
 FROM sepay_test_events e LEFT JOIN orders o ON o.id=e.order_id ${where} ORDER BY e.created_at DESC,e.transaction_id LIMIT $6 OFFSET $7`,[...args,q.size,(q.page-1)*q.size])).rows;
 const checkpoints=(await pool.query('SELECT completed_at,processed_count FROM sepay_test_checkpoints ORDER BY completed_at DESC')).rows;
 const issues=(await pool.query('SELECT source_id,reason,created_at FROM sepay_test_reconcile_issues ORDER BY created_at DESC LIMIT 20')).rows;
 return {items,total,page:q.page,size:q.size,checkpoints,issues};
}
export async function adminOrder(session:string|undefined,id:string){
 await requireAdmin(session);if(!z.string().uuid().safeParse(id).success)return null;
 const order=(await pool.query(`SELECT o.id,o.code,o.amount,o.currency,o.demo,o.payment_status,o.report_status,o.email_status,o.created_at,o.paid_at,o.expires_at,b.reading_id,b.presentation_version,b.catalog_version,b.owner_expires_at,r.id report_id FROM orders o LEFT JOIN order_reading_bindings b ON b.order_id=o.id LEFT JOIN reports r ON r.order_id=o.id WHERE o.id=$1`,[id])).rows[0];
 if(!order)return null;
 const jobs=(await pool.query('SELECT status,attempts,run_after,locked_at,last_error FROM report_jobs WHERE order_id=$1',[id])).rows.map(r=>({...r,last_error:safeError(r.last_error)}));
 const emails=(await pool.query('SELECT status,attempts,run_after,last_error FROM email_deliveries WHERE order_id=$1',[id])).rows.map(r=>({...r,last_error:safeError(r.last_error)}));
 const rights=(await pool.query(`SELECT purpose,expires_at,revoked_at,created_at FROM access_tokens WHERE order_id=$1 ORDER BY created_at`,[id])).rows;
 const payments=(await pool.query('SELECT id,amount,currency,created_at FROM payment_transactions WHERE order_id=$1 ORDER BY created_at',[id])).rows;
 const events=await adminTransactions(session,querySchema.parse({view:'transactions',q:order.code,size:50}));
 const activity=(await pool.query("SELECT id,channel,outcome,code,created_at FROM operations_events WHERE order_id=$1 OR (reading_id=$2 AND channel='pdf') OR transaction_id IN (SELECT transaction_id FROM sepay_test_events WHERE order_id=$1) ORDER BY created_at DESC LIMIT 50",[id,order.reading_id])).rows;
 const owners=(await pool.query('SELECT user_id,reading_id,expires_at FROM customer_reading_links WHERE order_id=$1',[id])).rows;
 return {order,jobs,emails,rights,payments,events,activity,owners,pdfObservation:'Sổ PDF/email bắt đầu từ G5. Không có ghi nhận không đồng nghĩa đã xuất/gửi thành công; EMAIL_SENT chỉ xác nhận provider nhận gửi, không xác nhận tới hộp thư.'};
}
export async function adminReading(session:string|undefined,source:string,id:string):Promise<{reading:InternalReading|null;note:string}|null>{
 await requireAdmin(session);if(!z.string().uuid().safeParse(id).success)return null;
 if(source==='free'||source==='internal'){const r=(await fileReadings(source,id))[0];return r?{reading:r,note:'Đọc nguyên bản đã lưu; không chạy catalog.'}:null;}
 if(source!=='order')return null;
 const r=(await pool.query(`SELECT r.data delivered,b.data bound FROM orders o LEFT JOIN order_reading_bindings b ON b.order_id=o.id LEFT JOIN reports r ON r.order_id=o.id WHERE o.id=$1`,[id])).rows[0];
 if(!r)return null;
 if(r.delivered)return {reading:r.delivered.kind==='frozen-customer-reading-v1'?r.delivered.reading:null,note:r.delivered.kind==='frozen-customer-reading-v1'?'Đúng bản worker đã giao.':'Báo cáo cũ không có bản khách hàng frozen tương thích; chưa có trình xem tại mục này. Không dựng lại bằng catalog mới.'};
 return {reading:r.bound||null,note:'Bản được gắn vào đơn; chưa có báo cáo worker giao. Quyền admin xem bản này không có nghĩa khách đã được cấp quyền.'};
}
