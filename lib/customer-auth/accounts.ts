import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {pool,transaction} from '../db';
import {trialOwner,listTrialReadings} from '../trial/store';
import {bindingReading,recoveredReading,recoveryEnabled} from '../trial/recovery';
import {customerAuthEnabled,SESSION_SECONDS} from './config';
export const tokenHash=(s:string)=>createHash('sha256').update(s).digest('hex');
const validToken=(s:unknown):s is string=>typeof s==='string'&&/^[A-Za-z0-9_-]{43}$/.test(s);
export async function customerSession(token:string|undefined){
 if(!customerAuthEnabled()||!validToken(token))return null;
 const row=(await pool.query('SELECT user_id,expires_at FROM customer_sessions WHERE hash=$1 AND revoked_at IS NULL AND expires_at>now()',[tokenHash(token)])).rows[0];
 return row?{userId:row.user_id as string,expiresAt:new Date(row.expires_at).getTime()}:null;
}
/** Called only after server-side provider verification. Never exposed as an identity-input API. */
export async function loginVerifiedGoogle(identity:{subject:string;email?:string;name?:string},oldToken?:string){
 if(!identity.subject||identity.subject.length>255)throw Error('IDENTITY_INVALID');
 return transaction(async c=>{
  await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',['google:'+identity.subject]);
  let userId=(await c.query("SELECT user_id FROM customer_identities WHERE provider='google' AND subject=$1",[identity.subject])).rows[0]?.user_id;
  if(!userId){userId=randomUUID();await c.query('INSERT INTO customer_users(id) VALUES($1)',[userId]);
   await c.query("INSERT INTO customer_identities(provider,subject,user_id,email,display_name) VALUES('google',$1,$2,$3,$4)",[identity.subject,userId,identity.email?.slice(0,320)||null,identity.name?.slice(0,200)||null]);}
  if(validToken(oldToken))await c.query('UPDATE customer_sessions SET revoked_at=now() WHERE hash=$1',[tokenHash(oldToken)]);
  const token=randomBytes(32).toString('base64url');
  await c.query("INSERT INTO customer_sessions(hash,user_id,expires_at) VALUES($1,$2,now()+$3*interval '1 second')",[tokenHash(token),userId,SESSION_SECONDS]);
  return {token,userId};
 });
}
export async function logoutCustomer(token:string|undefined){if(validToken(token))await pool.query('UPDATE customer_sessions SET revoked_at=now() WHERE hash=$1',[tokenHash(token)]);}
export type ReadingLink={id:string;user_id:string;owner_hash:string;reading_id:string;order_id:string|null;recovery_binding_id:string|null;expires_at:Date};
export async function linkedReading(link:ReadingLink){
 if(new Date(link.expires_at).getTime()<=Date.now())return null;
 if(link.recovery_binding_id){
  if(!recoveryEnabled())return null;
  const b=(await pool.query('SELECT * FROM reading_recovery_bindings WHERE id=$1 AND verified_at IS NOT NULL',[link.recovery_binding_id])).rows[0];
  if(!b||b.owner_hash!==link.owner_hash||b.reading_id!==link.reading_id||b.order_id!==link.order_id)return null;
  return bindingReading({...b,expires_at:new Date(Math.min(new Date(b.expires_at).getTime(),new Date(link.expires_at).getTime()))});
 }
 return bindingReading({id:link.id,owner_hash:link.owner_hash,reading_id:link.reading_id,order_id:link.order_id,email:'',expires_at:link.expires_at,verified_at:null,revoked_at:null});
}
/** Prove existing rights first. IDs/email from the caller are never accepted here. */
export async function linkAvailableReadings(userId:string,trialToken:string|undefined,recoveryToken:string|undefined){
 const candidates:Omit<ReadingLink,'user_id'>[]=[];
 const owner=await trialOwner(trialToken);
 if(owner){
  for(const r of (await listTrialReadings(owner)).slice(0,100))candidates.push({id:randomUUID(),owner_hash:owner.hash,reading_id:r.id,order_id:null,recovery_binding_id:null,expires_at:new Date(owner.expiresAt)});
  const orders=(await pool.query('SELECT order_id,reading_id,owner_expires_at FROM order_reading_bindings WHERE owner_hash=$1 AND owner_expires_at>now() LIMIT 100',[owner.hash])).rows;
  for(const o of orders)candidates.push({id:randomUUID(),owner_hash:owner.hash,reading_id:o.reading_id,order_id:o.order_id,recovery_binding_id:null,expires_at:new Date(Math.min(owner.expiresAt,new Date(o.owner_expires_at).getTime()))});
 }
 if(validToken(recoveryToken)&&recoveryEnabled()){
  const b=(await pool.query(`SELECT b.* FROM access_tokens a JOIN reading_recovery_bindings b ON b.id=a.recovery_binding_id WHERE a.hash=$1 AND a.purpose='reading-session' AND a.revoked_at IS NULL AND a.expires_at>now() AND b.verified_at IS NOT NULL`,[tokenHash(recoveryToken)])).rows[0];
  if(b&&await recoveredReading(recoveryToken,b.reading_id,b.order_id||undefined))candidates.push({id:randomUUID(),owner_hash:b.owner_hash,reading_id:b.reading_id,order_id:b.order_id,recovery_binding_id:b.id,expires_at:b.expires_at});
 }
 let linked=0;
 for(const candidate of candidates){
  if(!await linkedReading({...candidate,user_id:userId}))continue;
  // Never reassign an existing link or update its expiry, including on retry/login.
  linked+=(await pool.query(`INSERT INTO customer_reading_links(id,user_id,owner_hash,reading_id,order_id,recovery_binding_id,expires_at) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,[candidate.id,userId,candidate.owner_hash,candidate.reading_id,candidate.order_id,candidate.recovery_binding_id,candidate.expires_at])).rowCount||0;
 }
 return linked;
}
export async function accountReading(token:string|undefined,readingId?:string,orderId?:string){
 const session=await customerSession(token);if(!session)return null;
 if(!/^[a-f0-9-]{36}$/i.test(orderId||readingId||''))return null;
 const links=(await pool.query(`SELECT * FROM customer_reading_links WHERE user_id=$1 AND ${orderId?'order_id=$2':'reading_id=$2 AND order_id IS NULL'} AND expires_at>now()`,[session.userId,orderId||readingId])).rows as ReadingLink[];
 for(const link of links){const record=await linkedReading(link);if(record)return {record,expiresAt:new Date(link.expires_at).getTime(),key:link.id};}
 return null;
}
export async function accountReadings(token:string|undefined){
 const session=await customerSession(token);if(!session)return [];
 const links=(await pool.query('SELECT * FROM customer_reading_links WHERE user_id=$1 ORDER BY created_at DESC LIMIT 200',[session.userId])).rows as ReadingLink[];
 const rows=[];
 for(const link of links){const record=await linkedReading(link);if(record)rows.push({id:link.id,name:record.snapshot.normalized.name||'Hồ sơ bản mệnh',version:record.frozen.presentationVersion,expiresAt:new Date(link.expires_at).toISOString(),url:link.order_id?'/don-thu?id='+link.order_id:'/ban-doc?id='+link.reading_id});}
 return rows;
}

/** Link only the report just created, after proving both the live account and its trial owner. */
export async function linkCreatedReading(customerToken:string|undefined,trialToken:string|undefined,readingId:string){
 const session=await customerSession(customerToken);if(!session)return;
 const owner=await trialOwner(trialToken);if(!owner)throw Error('LINK_OWNER_EXPIRED');
 const candidate:ReadingLink={id:randomUUID(),user_id:session.userId,owner_hash:owner.hash,reading_id:readingId,order_id:null,recovery_binding_id:null,expires_at:new Date(owner.expiresAt)};
 if(!await linkedReading(candidate))throw Error('LINK_READING_UNAVAILABLE');
 await pool.query(`INSERT INTO customer_reading_links(id,user_id,owner_hash,reading_id,expires_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING`,[candidate.id,session.userId,owner.hash,readingId,candidate.expires_at]);
}
