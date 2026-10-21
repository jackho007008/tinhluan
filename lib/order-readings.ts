import {createHash,randomUUID} from 'node:crypto';
import type {PoolClient} from 'pg';
import {pool,transaction} from './db';
import {getTrialReading,trialOwner,type TrialOwner} from './trial/store';
import type {InternalReading} from './internal-review/reading-store';
import {validReadingId} from './internal-review/reading-store';
import {demoOnly} from './security';

// JSONB changes object key order. Hash values canonically, including every frozen claim/fact/version.
function canonical(value:unknown):string {
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
 return JSON.stringify(value);
}
export const readingHash=(value:unknown)=>createHash('sha256').update(canonical(value)).digest('hex');
export const orderGrantHash=(ownerHash:string,orderId:string)=>createHash('sha256').update('customer-order:'+ownerHash+':'+orderId).digest('hex');
export const orderTrialEnabled=()=>process.env.CORE_ORDER_TEST_ENABLED==='true';
export function requireOrderTestOperator(){
 demoOnly();
 const db=new URL(process.env.DATABASE_URL||'postgresql://localhost:55439/tuvi');
 if(!orderTrialEnabled()||!['localhost','127.0.0.1','::1','[::1]'].includes(db.hostname))throw Error('CORE_TEST_DISABLED');
}
/** Server operator only; no public creation/payment endpoint. testAmount is fixture data, not a package price. */
export async function createTrialReadingOrder(owner:TrialOwner,readingId:string,testAmount:number){
 requireOrderTestOperator();
 if(!Number.isSafeInteger(testAmount)||testAmount<=0)throw Error('TEST_AMOUNT_REQUIRED');
 const record=await getTrialReading(owner,readingId);
 if(!record?.frozen.customerReport)throw Error('READING_NOT_OWNED');
 return transaction(async c=>{
  await c.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))',[owner.hash+':'+readingId]);
  const old=(await c.query('SELECT order_id FROM order_reading_bindings WHERE owner_hash=$1 AND reading_id=$2',[owner.hash,readingId])).rows[0];
  if(old)return old.order_id as string;
  return insertFrozenOrder(c,record,{ownerHash:owner.hash,ownerExpiresAt:owner.expiresAt,orderExpiresAt:owner.expiresAt,amount:testAmount});
 });
}
/** Shared persistence only. Callers must prove ownership and select server-side terms. */
export async function insertFrozenOrder(c:PoolClient,record:InternalReading,options:{ownerHash:string;ownerExpiresAt:number;orderExpiresAt:number;amount:number;scope?:Record<string,unknown>;offer?:Record<string,unknown>}){
  const id=randomUUID(),chartId=randomUUID(),birthId=randomUUID();
  await c.query('INSERT INTO birth_profile_snapshots(id,data) VALUES($1,$2)',[birthId,record.snapshot.normalized]);
  await c.query('INSERT INTO chart_snapshots(id,birth_id,result_id,data) VALUES($1,$2,$3,$4)',[chartId,birthId,record.snapshot.resultId,record.snapshot]);
  await c.query("INSERT INTO orders(id,code,email,chart_id,amount,demo,scope,expires_at) VALUES($1,$2,'core-test@example.invalid',$3,$4,true,$5,$6)",[id,'CORE'+id.replaceAll('-','').slice(0,12).toUpperCase(),chartId,options.amount,{artifact:'frozen-customer-reading-v1',testOnly:true,accessPolicy:record.accessPolicy?.version||'existing-trial-session',readingScope:'full-saved-edition',priceApproved:false,...options.scope},new Date(options.orderExpiresAt)]);
  await c.query('INSERT INTO order_items(id,order_id,package_snapshot) VALUES($1,$2,$3)',[randomUUID(),id,{id:'core-test-frozen',name:'Đơn kiểm thử bản đọc đã lưu',testOnly:true,priceApproved:false,presentationVersion:record.frozen.presentationVersion,catalogVersion:record.frozen.catalogVersion,...options.offer}]);
  await c.query('INSERT INTO order_reading_bindings(order_id,owner_hash,owner_expires_at,reading_id,snapshot_id,presentation_version,catalog_version,content_hash,data) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',[id,options.ownerHash,new Date(options.ownerExpiresAt),record.id,record.snapshot.resultId,record.frozen.presentationVersion,record.frozen.catalogVersion,readingHash(record),record]);
 return id;
}
/** Called within the existing worker transaction. No engine, catalog or narration call. */
export async function deliverBoundReading(c:PoolClient,orderId:string):Promise<boolean>{
 const row=(await c.query('SELECT b.*,o.payment_status,o.paid_at FROM order_reading_bindings b JOIN orders o ON o.id=b.order_id WHERE b.order_id=$1',[orderId])).rows[0];
 if(!row)return false;
 if(row.payment_status!=='paid')throw Error('ORDER_NOT_PAID');
 if(new Date(row.owner_expires_at).getTime()<=Date.now())throw Error('ORDER_SESSION_EXPIRED');
 const record=row.data as InternalReading;
 if(readingHash(record)!==row.content_hash||record.id!==row.reading_id||record.snapshot.resultId!==row.snapshot_id||record.frozen.presentationVersion!==row.presentation_version||record.frozen.catalogVersion!==row.catalog_version)throw Error('ORDER_ARTIFACT_MISMATCH');
 const checkout=(await c.query('SELECT * FROM customer_checkouts WHERE order_id=$1',[orderId])).rows[0];
 const grantExpiry=checkout?new Date(new Date(row.paid_at).getTime()+checkout.offer.accessHours*3600000):new Date(row.owner_expires_at);
 if(!Number.isFinite(grantExpiry.getTime())||grantExpiry.getTime()>new Date(row.owner_expires_at).getTime()||grantExpiry.getTime()<=Date.now())throw Error('ORDER_ACCESS_EXPIRED');
 const payload={kind:'frozen-customer-reading-v1',contentHash:row.content_hash,reading:record};
 await c.query('INSERT INTO reports(id,order_id,data) VALUES($1,$2,$3) ON CONFLICT(order_id) DO NOTHING',[randomUUID(),orderId,payload]);
 const delivered=(await c.query('SELECT data FROM reports WHERE order_id=$1',[orderId])).rows[0]?.data;
 if(readingHash(delivered)!==readingHash(payload))throw Error('DELIVERED_ARTIFACT_MISMATCH');
 await c.query("INSERT INTO access_tokens(hash,order_id,purpose,expires_at) VALUES($1,$2,'customer-order',$3) ON CONFLICT(hash) DO NOTHING",[orderGrantHash(row.owner_hash,orderId),orderId,grantExpiry]);
 if(checkout)await c.query(`INSERT INTO customer_reading_links(id,user_id,owner_hash,reading_id,order_id,expires_at)
 SELECT $1,$2,$3,$4,$5,$6 WHERE EXISTS(SELECT 1 FROM access_tokens WHERE hash=$7 AND revoked_at IS NULL AND expires_at>now()) ON CONFLICT DO NOTHING`,[randomUUID(),checkout.user_id,row.owner_hash,row.reading_id,orderId,grantExpiry,orderGrantHash(row.owner_hash,orderId)]);
 await c.query("UPDATE orders SET report_status='ready',email_status='not_requested' WHERE id=$1",[orderId]);
 return true;
}
export async function getOwnedReadingOrder(token:string|undefined,id:string){
 if(!orderTrialEnabled()||!validReadingId(id))return null;
 const owner=await trialOwner(token);if(!owner)return null;
 const row=(await pool.query(`SELECT o.id,o.code,o.payment_status,o.report_status,b.reading_id,b.content_hash,b.presentation_version,b.catalog_version,b.snapshot_id,r.data,
 EXISTS(SELECT 1 FROM access_tokens a WHERE a.hash=$3 AND a.order_id=o.id AND a.purpose='customer-order' AND a.revoked_at IS NULL AND a.expires_at>now()) AS granted
 FROM orders o JOIN order_reading_bindings b ON b.order_id=o.id LEFT JOIN reports r ON r.order_id=o.id
 WHERE o.id=$1 AND b.owner_hash=$2 AND b.owner_expires_at>now()`,[id,owner.hash,orderGrantHash(owner.hash,id)])).rows[0];
 if(!row)return null;
 let reading:InternalReading|undefined;
 if(row.payment_status==='paid'&&row.report_status==='ready'&&row.granted){
  if(row.data?.kind!=='frozen-customer-reading-v1'||row.data.contentHash!==row.content_hash||readingHash(row.data.reading)!==row.content_hash)throw Error('DELIVERED_ARTIFACT_MISMATCH');
  reading=row.data.reading;
 }
 return {id:row.id as string,code:row.code as string,readingId:row.reading_id as string,paymentStatus:row.payment_status as string,reportStatus:row.report_status as string,presentationVersion:row.presentation_version as string,catalogVersion:row.catalog_version as string,snapshotId:row.snapshot_id as string,contentHash:row.content_hash as string,reading};
}
