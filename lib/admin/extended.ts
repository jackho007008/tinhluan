import {linkedReading,type ReadingLink} from '../customer-auth/accounts';
import {pool} from '../db';import {requireAdmin} from './auth';
import {adminReports,adminOrders,adminOrder,adminTransactions,adminReading,querySchema,type AdminQuery} from './operations';
export function dateBounds(q:AdminQuery){
 const valid=(s:string|undefined)=>!s||new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
 if(!valid(q.from)||!valid(q.to)||(q.from&&q.to&&q.from>q.to))throw Error('INVALID_DATES');
 return [q.from?q.from+'T00:00:00+07:00':null,q.to?new Date(new Date(q.to+'T00:00:00+07:00').getTime()+86400000).toISOString():null];
}
export const within=(value:string|Date,q:AdminQuery)=>{const [a,b]=dateBounds(q),t=new Date(value).getTime();return (!a||t>=new Date(a).getTime())&&(!b||t<new Date(b).getTime());};
export async function adminOverview(token:string|undefined,q:AdminQuery){
 await requireAdmin(token);const [a,b]=dateBounds(q),args=[a,b,q.environment];
 const orders=(await pool.query(`SELECT count(*)::int total,count(*) FILTER(WHERE payment_status='pending')::int pending,count(*) FILTER(WHERE payment_status='paid')::int paid,count(*) FILTER(WHERE report_status='ready')::int delivered,count(*) FILTER(WHERE report_status IN ('retry','failed'))::int errors FROM orders WHERE ($1::timestamptz IS NULL OR created_at>=$1) AND ($2::timestamptz IS NULL OR created_at<$2) AND ($3='all' OR demo=($3='test'))`,args)).rows[0];
 const payments=(await pool.query(`SELECT o.demo,count(*)::int count,coalesce(sum(p.amount),0)::text amount FROM payment_transactions p JOIN orders o ON o.id=p.order_id WHERE ($1::timestamptz IS NULL OR p.created_at>=$1) AND ($2::timestamptz IS NULL OR p.created_at<$2) AND ($3='all' OR o.demo=($3='test')) GROUP BY o.demo`,args)).rows;
 const users=Number((await pool.query(`SELECT count(*) FROM customer_users WHERE ($1::timestamptz IS NULL OR created_at>=$1) AND ($2::timestamptz IS NULL OR created_at<$2)`,[a,b])).rows[0].count);
 const reports=await adminReports(token,{...q,q:'',source:'all',size:50,page:1});
 // Report inventory counts unique saved IDs, not the free/order copies of one edition.
 return {users,readings:reports.uniqueTotal,orders,payments,observationSince:(await pool.query("SELECT started_at FROM operations_metadata WHERE key='g5-observation'")).rows[0]?.started_at??null};
}
export async function adminUsers(token:string|undefined,q:AdminQuery){
 await requireAdmin(token);const [a,b]=dateBounds(q),args=[q.q,a,b];
 const where=`WHERE (strpos(lower(u.id::text),lower($1))>0 OR EXISTS(SELECT 1 FROM customer_identities i WHERE i.user_id=u.id AND (strpos(lower(coalesce(i.display_name,'')),lower($1))>0 OR strpos(lower(coalesce(i.email,'')),lower($1))>0))) AND ($2::timestamptz IS NULL OR u.created_at>=$2) AND ($3::timestamptz IS NULL OR u.created_at<$3)`;
 const total=Number((await pool.query('SELECT count(*) FROM customer_users u '+where,args)).rows[0].count);
 const items=(await pool.query(`SELECT u.id,u.created_at,(SELECT coalesce(display_name,'Khách') FROM customer_identities i WHERE i.user_id=u.id ORDER BY created_at LIMIT 1) name,(SELECT email FROM customer_identities i WHERE i.user_id=u.id ORDER BY created_at LIMIT 1) email,EXISTS(SELECT 1 FROM admin_roles r WHERE r.user_id=u.id AND r.revoked_at IS NULL) admin,(SELECT count(DISTINCT reading_id)::int FROM customer_reading_links l WHERE l.user_id=u.id) readings,(SELECT count(*)::int FROM orders o WHERE EXISTS(SELECT 1 FROM customer_checkouts c WHERE c.order_id=o.id AND c.user_id=u.id) OR EXISTS(SELECT 1 FROM customer_reading_links l JOIN order_reading_bindings b ON b.order_id=o.id AND b.reading_id=l.reading_id AND b.owner_hash=l.owner_hash WHERE l.user_id=u.id AND (l.order_id IS NULL OR l.order_id=o.id))) orders FROM customer_users u ${where} ORDER BY u.created_at DESC,u.id LIMIT $4 OFFSET $5`,[...args,q.size,(q.page-1)*q.size])).rows;
 return {items,total};
}
export async function adminUser(token:string|undefined,q:AdminQuery){
 await requireAdmin(token);if(!q.id)return null;
 const user=(await adminUsers(token,{...q,q:q.id,from:undefined,to:undefined,page:1})).items.find(x=>x.id===q.id);if(!user)return null;
 const rights=await adminRights(token,q);
 const orders=(await pool.query('SELECT o.id,o.code,o.amount,o.demo,o.payment_status,o.report_status FROM orders o WHERE EXISTS(SELECT 1 FROM customer_checkouts c WHERE c.order_id=o.id AND c.user_id=$1) OR EXISTS(SELECT 1 FROM customer_reading_links l JOIN order_reading_bindings b ON b.order_id=o.id AND b.reading_id=l.reading_id AND b.owner_hash=l.owner_hash WHERE l.user_id=$1 AND (l.order_id IS NULL OR l.order_id=o.id)) ORDER BY o.created_at DESC LIMIT $2 OFFSET $3',[q.id,q.size,(q.page-1)*q.size])).rows;
 return {user,rights,orders};
}
export async function adminRights(token:string|undefined,q:AdminQuery){
 await requireAdmin(token);const [a,b]=dateBounds(q);const args=[q.id||null,q.q,a,b];
 const where=`WHERE ($1::uuid IS NULL OR l.user_id=$1) AND (strpos(l.reading_id::text,$2)>0 OR strpos(l.user_id::text,$2)>0 OR strpos(coalesce(l.order_id::text,''),$2)>0) AND ($3::timestamptz IS NULL OR l.created_at>=$3) AND ($4::timestamptz IS NULL OR l.created_at<$4)`;
 const total=Number((await pool.query('SELECT count(*) FROM customer_reading_links l '+where,args)).rows[0].count);
 const items=(await pool.query(`SELECT l.id,l.user_id,l.reading_id,l.order_id,l.expires_at,l.created_at,b.presentation_version,b.catalog_version,b.data#>>'{accessPolicy,version}' policy,
 CASE WHEN l.order_id IS NULL THEN 'Theo chính sách bản gốc' ELSE 'Toàn bản đã lưu và PDF' END scope,
 CASE WHEN l.expires_at<=now() THEN 'expired'
 WHEN rb.revoked_at IS NOT NULL OR EXISTS(SELECT 1 FROM access_tokens a WHERE a.order_id=l.order_id AND a.purpose='customer-order' AND a.revoked_at IS NOT NULL) THEN 'revoked'
 WHEN l.order_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM access_tokens a JOIN orders o ON o.id=a.order_id WHERE a.order_id=l.order_id AND a.purpose='customer-order' AND a.revoked_at IS NULL AND a.expires_at>now() AND o.payment_status='paid' AND o.report_status='ready') THEN 'unavailable'
 ELSE 'in-term' END state
 FROM customer_reading_links l LEFT JOIN order_reading_bindings b ON b.order_id=l.order_id LEFT JOIN reading_recovery_bindings rb ON rb.id=l.recovery_binding_id ${where} ORDER BY l.created_at DESC,l.id LIMIT $5 OFFSET $6`,[...args,q.size,(q.page-1)*q.size])).rows;
 for(const item of items){
  const raw=(await pool.query('SELECT * FROM customer_reading_links WHERE id=$1',[item.id])).rows[0] as ReadingLink;
  const record=await linkedReading(raw);
  if(!record&&item.state==='in-term')item.state='unavailable';
  if(record){item.scope=item.order_id?'Toàn bản đã lưu và PDF':record.accessPolicy?'Mệnh miễn phí — chính sách bản lưu':'Quyền đầy đủ theo bản cũ';item.presentation_version=record.frozen.presentationVersion;item.catalog_version=record.frozen.catalogVersion;item.name=record.snapshot.normalized.name||'Hồ sơ bản mệnh';}
 }
 return {items,total,note:'Danh sách liên kết tài khoản. Còn hạn không thay thế kiểm quyền khi mở; quyền phiên chưa liên kết nằm trong chi tiết đơn. Không hiển thị token hoặc mã băm phiên.'};
}
export async function adminActivity(token:string|undefined,q:AdminQuery){
 await requireAdmin(token);const [a,b]=dateBounds(q),args=[q.channel,q.q,a,b];
 const where=`WHERE ($1='all' OR e.channel=$1) AND (strpos(coalesce(e.reading_id::text,''),$2)>0 OR strpos(coalesce(e.order_id::text,''),$2)>0 OR strpos(e.code,$2)>0) AND ($3::timestamptz IS NULL OR e.created_at>=$3) AND ($4::timestamptz IS NULL OR e.created_at<$4)`;
 const total=Number((await pool.query('SELECT count(*) FROM operations_events e '+where,args)).rows[0].count);
 const items=(await pool.query(`SELECT e.*,coalesce(e.order_id,s.order_id) resolved_order_id FROM operations_events e LEFT JOIN sepay_test_events s ON s.transaction_id=e.transaction_id ${where} ORDER BY e.created_at DESC,e.id LIMIT $5 OFFSET $6`,[...args,q.size,(q.page-1)*q.size])).rows;
 return {items,total,since:(await pool.query("SELECT started_at FROM operations_metadata WHERE key='g5-observation'")).rows[0]?.started_at};
}
export async function adminAudit(token:string|undefined,q:AdminQuery){
 await requireAdmin(token);const [a,b]=dateBounds(q),args=[q.q,a,b];const where=`WHERE (strpos(action,$1)>0 OR strpos(target_id::text,$1)>0 OR strpos(coalesce(actor_user_id::text,''),$1)>0) AND ($2::timestamptz IS NULL OR created_at>=$2) AND ($3::timestamptz IS NULL OR created_at<$3)`;
 const total=Number((await pool.query('SELECT count(*) FROM admin_audit '+where,args)).rows[0].count);const items=(await pool.query(`SELECT * FROM admin_audit ${where} ORDER BY created_at DESC,id LIMIT $4 OFFSET $5`,[...args,q.size,(q.page-1)*q.size])).rows;return {items,total};
}
export async function adminData(token:string|undefined,q:AdminQuery){
 await requireAdmin(token);dateBounds(q);
 switch(q.view){case 'overview':return adminOverview(token,q);case 'users':return adminUsers(token,q);case 'user':return adminUser(token,q);case 'rights':return adminRights(token,q);case 'activity':return adminActivity(token,q);case 'audit':return adminAudit(token,q);case 'reports':return adminReports(token,q);case 'orders':return adminOrders(token,q);case 'transactions':return adminTransactions(token,q);case 'order':return q.id?adminOrder(token,q.id):null;case 'report':return q.id?adminReading(token,q.source,q.id):null;}
}
