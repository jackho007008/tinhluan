import {accountReading} from '../customer-auth/accounts';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import type {PoolClient} from 'pg';
import {pool,transaction,rateLimit} from '../db';
import {sendEmail} from '../notifications';
import {trialOwner,getTrialReading,type TrialOwner} from './store';
import {orderGrantHash,orderTrialEnabled,readingHash} from '../order-readings';
import type {InternalReading} from '../internal-review/reading-store';
import {validReadingId} from '../internal-review/reading-store';
export const RECOVERY_COOKIE='tinhluan_reading_access';
export const recoveryEnabled=()=>process.env.READING_RECOVERY_ENABLED==='true';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
export const normalizeRecoveryEmail=(s:string)=>s.trim().toLowerCase();
type Binding={id:string;owner_hash:string;reading_id:string;order_id:string|null;email:string;expires_at:Date;verified_at:Date|null;revoked_at:Date|null};
type Query=Pick<PoolClient,'query'>;
/** Check the original lifetime/revocation on every use, not just when issuing a link. */
export async function bindingReading(b:Binding,c:Query=pool):Promise<InternalReading|null>{
 if(b.revoked_at||new Date(b.expires_at).getTime()<=Date.now())return null;
 if(b.order_id){
  if(!orderTrialEnabled())return null;
  const row=(await c.query(`SELECT b.data,b.content_hash,r.data AS delivered FROM order_reading_bindings b
   JOIN orders o ON o.id=b.order_id JOIN reports r ON r.order_id=o.id
   JOIN access_tokens a ON a.order_id=o.id AND a.hash=$3 AND a.purpose='customer-order'
   WHERE b.order_id=$1 AND b.owner_hash=$2 AND b.reading_id=$4 AND b.owner_expires_at>now()
   AND o.payment_status='paid' AND o.report_status='ready' AND a.revoked_at IS NULL AND a.expires_at>now()`,[b.order_id,b.owner_hash,orderGrantHash(b.owner_hash,b.order_id),b.reading_id])).rows[0];
  if(!row||readingHash(row.data)!==row.content_hash||row.delivered?.kind!=='frozen-customer-reading-v1'||row.delivered.contentHash!==row.content_hash||readingHash(row.delivered.reading)!==row.content_hash)return null;
  return row.delivered.reading;
 }
 try{
  if(!/^[a-f0-9]{64}$/.test(b.owner_hash))return null;
  const session=JSON.parse(await readFile(path.resolve(process.env.TRIAL_READING_DIR||'.local/trial-readings','sessions',b.owner_hash+'.json'),'utf8'));
  if(!Number.isFinite(session.expiresAt)||session.expiresAt<=Date.now())return null;
  return await getTrialReading({hash:b.owner_hash,expiresAt:Math.min(session.expiresAt,new Date(b.expires_at).getTime())},b.reading_id);
 }catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}
}
async function enqueue(c:Query,bindingId:string){
 await c.query(`INSERT INTO email_deliveries(id,recovery_binding_id) VALUES($1,$2)
 ON CONFLICT(recovery_binding_id) DO UPDATE SET status='pending',attempts=0,run_after=now(),last_error=NULL
 WHERE email_deliveries.status NOT IN ('pending','retry')`,[randomUUID(),bindingId]);
}
export async function bindRecoveryEmail(token:string|undefined,readingId:string,orderId:string|undefined,email:string){
 if(!recoveryEnabled()||!validReadingId(readingId)||(orderId&&!validReadingId(orderId)))throw Error('RECOVERY_DENIED');
 const owner=await trialOwner(token);if(!owner)throw Error('RECOVERY_DENIED');
 const candidate:Binding={id:randomUUID(),owner_hash:owner.hash,reading_id:readingId,order_id:orderId||null,email:normalizeRecoveryEmail(email),expires_at:new Date(owner.expiresAt),verified_at:null,revoked_at:null};
 if(!await bindingReading(candidate))throw Error('RECOVERY_DENIED');
 await rateLimit('recovery:bind:'+owner.hash,3);await rateLimit('recovery:email:'+hash(candidate.email),3);await rateLimit('recovery:global',40);
 await transaction(async c=>{
  const row=(await c.query(`INSERT INTO reading_recovery_bindings(id,owner_hash,reading_id,order_id,email,expires_at)
   VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING *`,[candidate.id,owner.hash,readingId,orderId||null,candidate.email,candidate.expires_at])).rows[0]
   ||(await c.query("SELECT * FROM reading_recovery_bindings WHERE owner_hash=$1 AND reading_id=$2 AND order_id IS NOT DISTINCT FROM $3::uuid AND email=$4 FOR UPDATE",[owner.hash,readingId,orderId||null,candidate.email])).rows[0];
  if(!row||row.revoked_at)throw Error('RECOVERY_DENIED');
  await enqueue(c,row.id);
 });
}
export async function requestRecovery(email:string){
 if(!recoveryEnabled())throw Error('RECOVERY_DENIED');
 email=normalizeRecoveryEmail(email);
 await rateLimit('recovery:email:'+hash(email),3);await rateLimit('recovery:global',40);
 // Same public response regardless of membership. Only verified, unexpired bindings can enqueue.
 await pool.query(`INSERT INTO email_deliveries(id,recovery_binding_id)
 SELECT gen_random_uuid(),id FROM reading_recovery_bindings WHERE email=$1 AND verified_at IS NOT NULL AND revoked_at IS NULL AND expires_at>now()
 ON CONFLICT(recovery_binding_id) DO UPDATE SET status='pending',attempts=0,run_after=now(),last_error=NULL WHERE email_deliveries.status NOT IN ('pending','retry')`,[email]);
}
/** Runs inside the existing email worker transaction; raw tokens enter only the selected email provider, never logs. */
export async function deliverRecoveryEmail(c:PoolClient,job:{id:string;recovery_binding_id?:string|null}){
 if(!job.recovery_binding_id)return false;
 if(!recoveryEnabled())throw Error('RECOVERY_DISABLED');
 const b=(await c.query('SELECT * FROM reading_recovery_bindings WHERE id=$1 FOR UPDATE',[job.recovery_binding_id])).rows[0] as Binding;
 if(!b||!await bindingReading(b,c))throw Error('RECOVERY_DENIED');
 const origin=new URL(process.env.RECOVERY_ORIGIN||'');
 if(origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash||!(origin.protocol==='https:'||(process.env.QA_LOCAL_MAIL_ENABLED==='true'&&origin.protocol==='http:'&&['127.0.0.1','localhost'].includes(origin.hostname))))throw Error('RECOVERY_ORIGIN_INVALID');
 const token=randomBytes(32).toString('base64url');
 await c.query("UPDATE access_tokens SET revoked_at=now() WHERE recovery_binding_id=$1 AND purpose='reading-magic' AND revoked_at IS NULL",[b.id]);
 await c.query("INSERT INTO access_tokens(hash,purpose,recovery_binding_id,expires_at) VALUES($1,'reading-magic',$2,LEAST($3::timestamptz,now()+interval '15 minutes'))",[hash(token),b.id,b.expires_at]);
 await sendEmail({id:job.id,to:b.email,link:origin.origin+'/recover?reading=1#'+token});
 await c.query("UPDATE email_deliveries SET status='sent',attempts=attempts+1,last_error=NULL WHERE id=$1",[job.id]);
 return true;
}
export async function exchangeReadingToken(token:string){
 if(!recoveryEnabled()||!/^[A-Za-z0-9_-]{43}$/.test(token))throw Error('RECOVERY_DENIED');
 return transaction(async c=>{
  const a=(await c.query("SELECT recovery_binding_id FROM access_tokens WHERE hash=$1 AND purpose='reading-magic' AND revoked_at IS NULL AND expires_at>now() FOR UPDATE",[hash(token)])).rows[0];
  if(!a)throw Error('RECOVERY_DENIED');
  const b=(await c.query('SELECT * FROM reading_recovery_bindings WHERE id=$1 FOR UPDATE',[a.recovery_binding_id])).rows[0] as Binding;
  if(!b||!await bindingReading(b,c))throw Error('RECOVERY_DENIED');
  const session=randomBytes(32).toString('base64url');
  await c.query('UPDATE access_tokens SET revoked_at=now() WHERE hash=$1',[hash(token)]);
  await c.query('UPDATE reading_recovery_bindings SET verified_at=COALESCE(verified_at,now()) WHERE id=$1',[b.id]);
  await c.query("INSERT INTO access_tokens(hash,purpose,recovery_binding_id,expires_at) VALUES($1,'reading-session',$2,$3)",[hash(session),b.id,b.expires_at]);
  return {token:session,expiresAt:new Date(b.expires_at).getTime(),url:(b.order_id?'/don-thu?id='+b.order_id:'/ban-doc?id='+b.reading_id)};
 });
}
export async function recoveredReading(token:string|undefined,readingId?:string,orderId?:string){
 if(!recoveryEnabled()||!token||!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
 const b=(await pool.query(`SELECT b.* FROM access_tokens a JOIN reading_recovery_bindings b ON b.id=a.recovery_binding_id
 WHERE a.hash=$1 AND a.purpose='reading-session' AND a.revoked_at IS NULL AND a.expires_at>now() AND b.verified_at IS NOT NULL`,[hash(token)])).rows[0] as Binding|undefined;
 if(!b||(orderId?b.order_id!==orderId:b.order_id!==null||b.reading_id!==readingId))return null;
 const record=await bindingReading(b);return record?{record,expiresAt:new Date(b.expires_at).getTime(),key:b.id}:null;
}
export async function resolveTrialReading(trialToken:string|undefined,recoveryToken:string|undefined,id:string,customerToken?:string){
 const owner=await trialOwner(trialToken);const record=owner?await getTrialReading(owner,id):null;
 if(record)return {record,expiresAt:owner!.expiresAt,key:owner!.hash,identity:{kind:'trial' as const,token:trialToken!}};
 const r=await recoveredReading(recoveryToken,id);if(r)return {...r,identity:{kind:'recovered' as const,token:recoveryToken!}};
 const a=await accountReading(customerToken,id);return a?{...a,identity:{kind:'customer' as const,token:customerToken!}}:null;
}
export async function resolveReadingOrder(trialToken:string|undefined,recoveryToken:string|undefined,id:string,customerToken?:string){
 const {getOwnedReadingOrder}=await import('../order-readings');
 const original=await getOwnedReadingOrder(trialToken,id);
 if(original)return {order:original,identity:{kind:'order' as const,token:trialToken!,orderId:id}};
 const recovered=await recoveredReading(recoveryToken,undefined,id);const r=recovered||await accountReading(customerToken,undefined,id);if(!r)return null;
 const o=(await pool.query('SELECT code FROM orders WHERE id=$1',[id])).rows[0];
 if(!o)return null;
 return {order:{id,code:o.code as string,readingId:r.record.id,paymentStatus:'paid',reportStatus:'ready',presentationVersion:r.record.frozen.presentationVersion,catalogVersion:r.record.frozen.catalogVersion,snapshotId:r.record.snapshot.resultId,contentHash:readingHash(r.record),reading:r.record},identity:{kind:recovered?'recovered-order' as const:'customer-order' as const,token:recovered?recoveryToken!:customerToken!,orderId:id}};
}
/** Navigation only; goes through the same live permission check as report/PDF access. */
export async function recoveryDestination(token:string|undefined){
 if(!recoveryEnabled()||!token||!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
 const row=(await pool.query(`SELECT b.reading_id,b.order_id FROM access_tokens a JOIN reading_recovery_bindings b ON b.id=a.recovery_binding_id WHERE a.hash=$1 AND a.purpose='reading-session' AND a.revoked_at IS NULL AND a.expires_at>now()`,[hash(token)])).rows[0];
 if(!row)return null;
 const access=await recoveredReading(token,row.reading_id,row.order_id||undefined);
 return access?{id:row.reading_id as string,name:access.record.frozen.customerReport?.name||'Bản đọc',url:row.order_id?'/don-thu?id='+row.order_id:'/ban-doc?id='+row.reading_id}:null;
}
