import type {InternalReading} from '../internal-review/reading-store';
import {createHash} from 'node:crypto';
import {pool,transaction} from '../db';
import {customerSession,accountReading} from '../customer-auth/accounts';
import {insertFrozenOrder,orderGrantHash} from '../order-readings';
import {sepayTestConfig,enrollSePayTestOrderInTransaction} from '../payments/sepay-test';
import {projectReading,READING_POLICY} from '../trial/reading-policy';
import {validReadingId} from '../internal-review/reading-store';
export function testOffer(){
 if(process.env.CHECKOUT_TEST_ENABLED!=='true'||process.env.SEPAY_LIVE_ENABLED!=='false')return null;
 try{
  const s=sepayTestConfig();
  // G4 supports the verified ACB sandbox account without VA; other QR conventions stay closed.
  if(s.gateway!=='ACB'||s.subAccount)return null;
  const version=process.env.CHECKOUT_TEST_OFFER_VERSION||'',amount=Number(process.env.CHECKOUT_TEST_AMOUNT),accessHours=Number(process.env.CHECKOUT_TEST_ACCESS_HOURS);
  if(!/^qa-[a-z0-9.-]{1,60}$/.test(version)||!Number.isSafeInteger(amount)||amount<1000||amount>10000||!Number.isSafeInteger(accessHours)||accessHours<1||accessHours>168)return null;
  return {version,amount,accessHours,paymentMinutes:60,currency:'VND',bank:s.gateway,account:s.account,testOnly:true,priceApproved:false};
 }catch{return null;}
}
export function allowedCheckoutUser(id:string){return !!testOffer()&&(process.env.CHECKOUT_TEST_USER_IDS||'').split(',').map(s=>s.trim()).includes(id);}
export async function checkoutEntry(token?:string){const s=await customerSession(token);return !testOffer()?'closed':!s?'login':allowedCheckoutUser(s.userId)?'allowed':'closed';}
export function checkoutAnchor(value:unknown){return typeof value==='string'&&/^cung-(?:[0-9]|1[01])$/.test(value)?value:'cung-0';}
export async function checkoutScope(token:string|undefined,readingId:string){
 const s=await customerSession(token);if(!s||!allowedCheckoutUser(s.userId))return null;
 const a=await accountReading(token,readingId);if(!a?.record.frozen.customerReport||a.record.accessPolicy?.version!==READING_POLICY)return null;
 return describeCheckout(a.record);
}
/** Scope metadata only, after the calling page has proved guest/account ownership. */
export function describeCheckout(record:InternalReading){
 const offer=testOffer();if(!offer||record.accessPolicy?.version!==READING_POLICY)return null;
 const p=projectReading(record);
 return {name:record.snapshot.normalized.name||'Hồ sơ bản mệnh',readingId:record.id,offer,palaces:p.scope.palaces.map(p=>({name:p.name,hasContent:p.state!=='empty'})),heldCount:p.scope.heldCount,presentation:record.frozen.presentationVersion,policy:p.scope.policy};
}
export async function createCheckout(token:string|undefined,readingId:string,anchor:unknown,offerVersion:unknown){
 const session=await customerSession(token);if(!session||!allowedCheckoutUser(session.userId))throw Error('CHECKOUT_DENIED');
 if(!validReadingId(readingId))throw Error('CHECKOUT_DENIED');
 const offer=testOffer()!;
 return transaction(async c=>{
  await c.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))',['checkout:'+session.userId+':'+readingId]);
  const prior=(await c.query('SELECT order_id FROM customer_checkouts WHERE user_id=$1 AND reading_id=$2',[session.userId,readingId])).rows[0];
  if(prior)return prior.order_id as string; // retry always returns the original, never renews expired/revoked rights
  if(offerVersion!==offer.version)throw Error('OFFER_CHANGED');
  const original=await accountReading(token,readingId),record=original?.record;
  if(!record?.frozen.customerReport||record.accessPolicy?.version!==READING_POLICY)throw Error('CHECKOUT_DENIED');
  const ownerHash=createHash('sha256').update('account-checkout:'+session.userId).digest('hex');
  const deadline=Date.now()+offer.paymentMinutes*60000;
  const id=await insertFrozenOrder(c,record,{ownerHash,ownerExpiresAt:deadline+offer.accessHours*3600000,orderExpiresAt:deadline,amount:offer.amount,scope:{checkoutVersion:'g4-test-1',offerVersion:offer.version},offer});
  await c.query('INSERT INTO customer_checkouts(order_id,user_id,reading_id,offer,return_anchor) VALUES($1,$2,$3,$4,$5)',[id,session.userId,readingId,offer,checkoutAnchor(anchor)]);
  await enrollSePayTestOrderInTransaction(c,id);
  return id;
 });
}
/** Returns only account-owned order metadata. No locked report or provider secrets. */
export async function checkoutOrder(token:string|undefined,id:string){
 const session=await customerSession(token);if(!session||!validReadingId(id))return null;
 const row=(await pool.query(`SELECT o.id,o.code,o.amount,o.payment_status,o.report_status,o.expires_at,o.paid_at,c.offer,c.return_anchor,c.reading_id,b.owner_hash,
 j.status AS job_status,j.last_error IS NOT NULL AS delivery_error
 FROM customer_checkouts c JOIN orders o ON o.id=c.order_id JOIN order_reading_bindings b ON b.order_id=o.id LEFT JOIN report_jobs j ON j.order_id=o.id
 WHERE c.order_id=$1 AND c.user_id=$2`,[id,session.userId])).rows[0];
 if(!row)return null;
 const grant=(await pool.query("SELECT expires_at,revoked_at FROM access_tokens WHERE hash=$1 AND purpose='customer-order'",[orderGrantHash(row.owner_hash,id)])).rows[0];
 const active=!!grant&&!grant.revoked_at&&new Date(grant.expires_at).getTime()>Date.now();
 const state=row.payment_status==='paid'?(row.report_status==='ready'?(active?'delivered':'access-ended'):row.delivery_error||row.report_status==='failed'?'delivery-error':'delivering'):new Date(row.expires_at).getTime()<=Date.now()?'expired':'pending';
 const params=new URLSearchParams({acc:row.offer.account,bank:row.offer.bank,amount:String(row.amount),des:row.code,template:'qronly'});
 return {id:row.id as string,code:row.code as string,amount:Number(row.amount),state,offer:row.offer as NonNullable<ReturnType<typeof testOffer>>,readingId:row.reading_id as string,expiresAt:new Date(row.expires_at).toISOString(),accessExpiresAt:grant?new Date(grant.expires_at).toISOString():null,returnUrl:'/ban-doc?id='+row.reading_id+'#'+checkoutAnchor(row.return_anchor),qrUrl:'https://vietqr.app/img?'+params};
}
