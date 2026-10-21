import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import {readFile,mkdtemp} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {randomUUID,createHmac} from 'node:crypto';
import {pool,transaction} from '../lib/db';
import {createTrialOwner,saveTrialReading} from '../lib/trial/store';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {captureReadingPolicy} from '../lib/trial/reading-policy';
import {loginVerifiedGoogle,linkCreatedReading} from '../lib/customer-auth/accounts';
import {createCheckout,checkoutOrder,checkoutScope,testOffer} from '../lib/checkout/test';
import {deliverBoundReading,readingHash} from '../lib/order-readings';
import {receiveSePayTest,settleSePayTest} from '../lib/payments/sepay-test';
import {customerReadingAccess} from '../lib/trial/reading-access';
import {customerLibrary} from '../lib/customer-auth/library';
import {runReportJob} from '../lib/jobs';
import {GET as read} from '../app/api/trial/readings/[id]/route';
import {GET as pdf} from '../app/api/trial/readings/[id]/report-pdf/route';
import {POST as create} from '../app/api/checkout/route';
import {GET as getOrder} from '../app/api/checkout/[id]/route';
import {CUSTOMER_COOKIE,safeReturn} from '../lib/customer-auth/config';import {NextRequest} from 'next/server';
const mock=vi.hoisted(()=>({build:vi.fn(()=>{throw Error('CATALOG_MUST_NOT_RUN');})}));vi.mock('../lib/reports',()=>({buildReport:mock.build}));
let a:Awaited<ReturnType<typeof loginVerifiedGoogle>>,b:typeof a,owner:Awaited<ReturnType<typeof createTrialOwner>>,record:Parameters<typeof saveTrialReading>[1],id:string,seq=Date.now();
const secret='local-only-checkout-fixture-secret-2026';
const notice=(code:string,more:Record<string,unknown>={})=>({id:++seq,gateway:'ACB',accountNumber:'0000000001',subAccount:'',code,transferType:'in' as const,transferAmount:1000,referenceCode:'g4-'+seq,...more});
const send=async(n:ReturnType<typeof notice>)=>{const raw=JSON.stringify(n),timestamp=String(Math.floor(Date.now()/1000));return receiveSePayTest(raw,{timestamp,signature:'sha256='+createHmac('sha256',secret).update(timestamp+'.'+raw).digest('hex')});};
beforeAll(async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'g4-'));
 for(const [k,v]of Object.entries({TRIAL_READING_DIR:dir,CUSTOMER_AUTH_ENABLED:'true',FREE_TRIAL_ENABLED:'true',READING_RECOVERY_ENABLED:'true',APP_ORIGIN:'http://localhost:3062',CUSTOMER_ALLOWED_ORIGINS:'http://localhost:3062',CHECKOUT_TEST_ENABLED:'true',CHECKOUT_TEST_OFFER_VERSION:'qa-g4-1.0.0',CHECKOUT_TEST_AMOUNT:'1000',CHECKOUT_TEST_ACCESS_HOURS:'72',SEPAY_MODE:'test',SEPAY_LIVE_ENABLED:'false',SEPAY_TEST_ENABLED:'true',SEPAY_TEST_WEBHOOK_SECRET:secret,SEPAY_TEST_ACCOUNT:'0000000001',SEPAY_TEST_GATEWAY:'ACB',SEPAY_TEST_SUB_ACCOUNT:'',CORE_ORDER_TEST_ENABLED:'true'}))vi.stubEnv(k,v);
 a=await loginVerifiedGoogle({subject:'g4-a'});b=await loginVerifiedGoogle({subject:'g4-b'});vi.stubEnv('CHECKOUT_TEST_USER_IDS',a.userId+','+b.userId);
 owner=await createTrialOwner();const sample=JSON.parse(await readFile('fixtures/customer-reading-samples.json','utf8'))[0];
 record={id:randomUUID(),createdAt:new Date().toISOString(),snapshot:sample.snapshot,receipt:sample.receipt,frozen:freezeReading(sample.snapshot,sample.receipt)};record.accessPolicy=captureReadingPolicy(record);await saveTrialReading(owner.owner,record);await linkCreatedReading(a.token,owner.token,record.id);
});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('server offer, policy and ownership before creation; no email/name/ID claim, foreign/extra amount denied',async()=>{
 expect(await checkoutScope(b.token,record.id)).toBeNull();expect(await checkoutScope(undefined,record.id)).toBeNull();
 await expect(createCheckout(b.token,record.id,'cung-3','qa-g4-1.0.0')).rejects.toThrow('CHECKOUT_DENIED');
 await expect(createCheckout(a.token,record.id,'cung-3','old')).rejects.toThrow('OFFER_CHANGED');
 const req=new NextRequest('http://localhost:3062/api/checkout',{method:'POST',headers:{origin:'http://localhost:3062','content-type':'application/json',cookie:CUSTOMER_COOKIE+'='+a.token},body:JSON.stringify({readingId:record.id,anchor:'cung-3',offerVersion:'qa-g4-1.0.0',amount:1})});expect((await create(req)).status).toBe(400);
 vi.stubEnv('SEPAY_LIVE_ENABLED','true');expect(testOffer()).toBeNull();vi.stubEnv('SEPAY_LIVE_ENABLED','false');
 const offer=await checkoutScope(a.token,record.id);expect(offer?.palaces).toHaveLength(12);expect(offer?.palaces.find(p=>p.name==='Tật Ách')?.hasContent).toBe(false);
 expect(JSON.stringify(offer)).not.toContain(record.frozen.customerReport!.sections[0].paragraphs[0].text);
});
it('concurrent submit reuses one account/edition order; versioned terms, saved policy and exact artifact immutable',async()=>{
 const ids=await Promise.all(Array.from({length:3},()=>createCheckout(a.token,record.id,'cung-4','qa-g4-1.0.0')));expect(new Set(ids).size).toBe(1);id=ids[0];
 const row=(await pool.query('SELECT o.*,b.data,b.content_hash FROM orders o JOIN order_reading_bindings b ON b.order_id=o.id WHERE o.id=$1',[id])).rows[0];expect(row.amount).toBe(1000);expect(row.scope.accessPolicy).toBe('menh-free-1.0.0');expect(row.data).toEqual(JSON.parse(JSON.stringify(record)));expect(row.content_hash).toBe(readingHash(record));
 expect((await checkoutOrder(a.token,id))?.returnUrl).toBe('/ban-doc?id='+record.id+'#cung-4');expect(await checkoutOrder(b.token,id)).toBeNull();
 expect((await customerLibrary(a.token,{tab:'orders'}))?.items.find(x=>x.id===id)?.url).toBe('/checkout?order='+id);
 await expect(pool.query("UPDATE customer_checkouts SET return_anchor='cung-0' WHERE order_id=$1",[id])).rejects.toThrow('CHECKOUT_IMMUTABLE');
});
it('wrong amount/code/account/auth never pay; provider alias dedup + worker retry deliver a single unchanged edition/grant',async()=>{
 const o=(await checkoutOrder(a.token,id))!;
 await expect(receiveSePayTest('{}',{timestamp:'0',signature:'bad'})).rejects.toThrow();
 await send(notice(o.code,{transferAmount:2000}));await send(notice('CORE000000000000'));await send(notice(o.code,{accountNumber:'999'}));
 expect((await checkoutOrder(a.token,id))?.state).toBe('pending');expect((await pool.query('SELECT * FROM access_tokens WHERE order_id=$1',[id])).rowCount).toBe(0);
 const event=notice(o.code);await send(event);await send(event);await settleSePayTest({...event,id:randomUUID()},'fixture-api','api');
 expect((await checkoutOrder(a.token,id))?.state).toBe('delivering');await runReportJob();await transaction(c=>deliverBoundReading(c,id));
 expect((await checkoutOrder(a.token,id))?.state).toBe('delivered');
 for(const table of ['reports','access_tokens','payment_transactions','report_jobs','customer_reading_links'])expect((await pool.query('SELECT * FROM '+table+' WHERE order_id=$1',[id])).rowCount).toBe(1);
 expect((await customerReadingAccess(undefined,undefined,record.id,a.token))?.report).toEqual(record.frozen.customerReport);
 expect(await customerReadingAccess(undefined,undefined,record.id,b.token)).toBeNull();expect(mock.build).not.toHaveBeenCalled();
 expect((await customerLibrary(a.token,{tab:'purchased'}))?.items.map(x=>x.id)).toContain(id);expect((await customerLibrary(b.token,{tab:'orders'}))?.total).toBe(0);
});
it('grant starts at payment, survives original free expiry and new login, never extends on retry or revocation',async()=>{
 const old=(await checkoutOrder(a.token,id))!.accessExpiresAt;
 const paid=(await pool.query('SELECT paid_at FROM orders WHERE id=$1',[id])).rows[0].paid_at;
 expect(new Date(old!).getTime()-new Date(paid).getTime()).toBe(72*3600000);
 await pool.query("UPDATE customer_reading_links SET expires_at=now()-interval '1 second' WHERE user_id=$1 AND reading_id=$2 AND order_id IS NULL",[a.userId,record.id]);
 const fresh=await loginVerifiedGoogle({subject:'g4-a'});expect((await customerReadingAccess(undefined,undefined,record.id,fresh.token))?.scope.full).toBe(true);
 expect(await createCheckout(fresh.token,record.id,'cung-8','old')).toBe(id);expect((await checkoutOrder(fresh.token,id))?.accessExpiresAt).toBe(old);
 await pool.query('UPDATE access_tokens SET revoked_at=now() WHERE order_id=$1',[id]);await transaction(c=>deliverBoundReading(c,id));
 expect((await checkoutOrder(fresh.token,id))?.state).toBe('access-ended');expect(await customerReadingAccess(undefined,undefined,record.id,fresh.token)).toBeNull();
});
it('HTTP order/read isolation and OAuth return are bounded; no client payment endpoint',async()=>{
 const req=new NextRequest('http://localhost:3062/api/checkout/'+id,{headers:{cookie:CUSTOMER_COOKIE+'='+b.token}});
 expect((await getOrder(req,{params:Promise.resolve({id})})).status).toBe(404);
 expect((await read(new NextRequest('http://localhost:3062/api/trial/readings/'+record.id,{headers:{cookie:CUSTOMER_COOKIE+'='+b.token}}),{params:Promise.resolve({id:record.id})})).status).toBe(404);
 expect((await pdf(new NextRequest('http://localhost:3062/api/trial/readings/'+record.id+'/report-pdf',{headers:{cookie:CUSTOMER_COOKIE+'='+b.token}}),{params:Promise.resolve({id:record.id})})).status).toBe(404);
 expect(safeReturn('/checkout?id='+record.id+'#cung-4')).toBe('/checkout?id='+record.id+'#cung-4');expect(safeReturn('https://evil.invalid/checkout?id='+record.id)).toBe('/la-so-cua-toi');
});

it('expired grants cannot be revived by login or worker retry',async()=>{
 await pool.query("UPDATE access_tokens SET revoked_at=NULL,expires_at=now()-interval '1 second' WHERE order_id=$1",[id]);
 await transaction(c=>deliverBoundReading(c,id));const fresh=await loginVerifiedGoogle({subject:'g4-a'});
 expect((await checkoutOrder(fresh.token,id))?.state).toBe('access-ended');expect(await customerReadingAccess(undefined,undefined,record.id,fresh.token)).toBeNull();
});
