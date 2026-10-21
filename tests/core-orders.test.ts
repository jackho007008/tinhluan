import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import {readFile,mkdtemp} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';import {randomUUID} from 'node:crypto';
import {NextRequest} from 'next/server';
import {pool} from '../lib/db';
import {createTrialOwner,saveTrialReading,getTrialReading,TRIAL_COOKIE} from '../lib/trial/store';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {createTrialReadingOrder,getOwnedReadingOrder,readingHash,orderGrantHash} from '../lib/order-readings';
import {acceptPayment,type Payment} from '../lib/payments';
import {runReportJob} from '../lib/jobs';
import type {InternalReading} from '../lib/internal-review/reading-store';
const mocks=vi.hoisted(()=>({build:vi.fn(()=>{throw Error('CATALOG_MUST_NOT_RUN');}),pdf:vi.fn(async()=>Buffer.from('%PDF-test'))}));
vi.mock('../lib/reports',()=>({buildReport:mocks.build}));
vi.mock('../lib/internal-review/customer-pdf',()=>({renderStoredCustomerPdf:mocks.pdf}));
import {GET as pdf} from '../app/api/trial/orders/[id]/report-pdf/route';
import {GET as api} from '../app/api/trial/orders/[id]/route';
let a:Awaited<ReturnType<typeof createTrialOwner>>,b:typeof a;
let ra:InternalReading,rb:InternalReading,oa:string,ob:string;
const event=async(id:string):Promise<Payment>=>{const o=(await pool.query('SELECT * FROM orders WHERE id=$1',[id])).rows[0];return {eventId:randomUUID(),transactionId:'test-'+id,orderId:id,code:o.code,amount:o.amount,currency:'VND',recipient:'DEMO_RECIPIENT',status:'paid'};};
const req=(id:string,token?:string)=>new NextRequest('http://localhost/api/trial/orders/'+id+'/report-pdf',{headers:token?{cookie:TRIAL_COOKIE+'='+token}:{}});
beforeAll(async()=>{
 vi.stubEnv('CORE_ORDER_TEST_ENABLED','true');vi.stubEnv('DEMO_ENABLED','true');vi.stubEnv('PAYMENT_PROVIDER','mock');vi.stubEnv('TRIAL_READING_DIR',await mkdtemp(path.join(os.tmpdir(),'core-orders-')));
 const samples=JSON.parse(await readFile('fixtures/customer-reading-samples.json','utf8'));
 a=await createTrialOwner();b=await createTrialOwner();
 ra={id:randomUUID(),createdAt:new Date().toISOString(),snapshot:samples[0].snapshot,receipt:samples[0].receipt,frozen:freezeReading(samples[0].snapshot,samples[0].receipt)};
 rb={id:randomUUID(),createdAt:new Date().toISOString(),snapshot:samples[1].snapshot,receipt:samples[1].receipt,frozen:freezeReading(samples[1].snapshot,samples[1].receipt)};
 await saveTrialReading(a.owner,ra);await saveTrialReading(b.owner,rb);
});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('binds immutable complete reading/version and serializes duplicate order creation without creating another order',async()=>{
 [oa]=await Promise.all([createTrialReadingOrder(a.owner,ra.id,1000),createTrialReadingOrder(a.owner,ra.id,1000)]);
 ob=await createTrialReadingOrder(b.owner,rb.id,1000);
 expect((await pool.query('SELECT * FROM order_reading_bindings WHERE owner_hash=$1',[a.owner.hash])).rowCount).toBe(1);
 const binding=(await pool.query('SELECT * FROM order_reading_bindings WHERE order_id=$1',[oa])).rows[0];
 expect(binding.data).toEqual(ra);expect(binding.content_hash).toBe(readingHash(ra));expect(binding.catalog_version).toBe(ra.frozen.catalogVersion);
 await expect(pool.query('UPDATE order_reading_bindings SET presentation_version=$2 WHERE order_id=$1',[oa,'new-catalog'])).rejects.toThrow('ORDER_READING_IMMUTABLE');
 await expect(createTrialReadingOrder(b.owner,ra.id,1000)).rejects.toThrow('READING_NOT_OWNED');
 expect((await getOwnedReadingOrder(a.token,oa))?.reading).toBeUndefined();
 expect((await pdf(req(oa,a.token),{params:Promise.resolve({id:oa})})).status).toBe(409);
});
it('delivers two paid orders from their frozen artifacts; replay/job rerun creates one report and one grant',async()=>{
 for(const id of [oa,ob]){const e=await event(id);expect(await acceptPayment(e)).toBe('accepted');expect(await acceptPayment(e)).toBe('duplicate');}
 await Promise.all([runReportJob(oa),runReportJob(oa),runReportJob(ob)]);
 const original=(await pool.query('SELECT id,data FROM reports WHERE order_id=$1',[oa])).rows[0];
 await pool.query("UPDATE report_jobs SET status='retry',run_after=now() WHERE order_id=$1",[oa]);await runReportJob(oa);
 expect((await pool.query('SELECT id,data FROM reports WHERE order_id=$1',[oa])).rows).toEqual([original]);
 for(const [id,session,record] of [[oa,a,ra],[ob,b,rb]] as const){
  expect((await getOwnedReadingOrder(session.token,id))?.reading).toEqual(record);
  expect((await pool.query('SELECT * FROM access_tokens WHERE order_id=$1',[id])).rowCount).toBe(1);
  expect((await pool.query('SELECT * FROM email_deliveries WHERE order_id=$1',[id])).rowCount).toBe(0);
 }
 expect(mocks.build).not.toHaveBeenCalled();expect(await getTrialReading(a.owner,ra.id)).toEqual(ra);expect(await getTrialReading(b.owner,rb.id)).toEqual(rb);
});
it('owner checks protect read/print before exporting; foreign, absent, revoked and expired sessions fail closed',async()=>{
 for(const [id,session,foreign] of [[oa,a,b],[ob,b,a]] as const){
  expect(await getOwnedReadingOrder(foreign.token,id)).toBeNull();expect(await getOwnedReadingOrder(undefined,id)).toBeNull();
  expect((await api(req(id,session.token),{params:Promise.resolve({id})})).status).toBe(200);
  mocks.pdf.mockClear();expect((await pdf(req(id,foreign.token),{params:Promise.resolve({id})})).status).toBe(404);expect(mocks.pdf).not.toHaveBeenCalled();
  expect((await pdf(req(id,session.token),{params:Promise.resolve({id})})).status).toBe(200);expect(mocks.pdf).toHaveBeenCalledWith(id===oa?ra:rb,{kind:'order',token:session.token,orderId:id});
 }
 await pool.query('UPDATE access_tokens SET revoked_at=now() WHERE hash=$1',[orderGrantHash(a.owner.hash,oa)]);
 expect((await getOwnedReadingOrder(a.token,oa))?.reading).toBeUndefined();expect((await pdf(req(oa,a.token),{params:Promise.resolve({id:oa})})).status).toBe(409);
 await pool.query("UPDATE report_jobs SET status='retry',run_after=now() WHERE order_id=$1",[oa]);await runReportJob(oa);
 expect((await getOwnedReadingOrder(a.token,oa))?.reading).toBeUndefined(); // Retry must not undo revocation.
 await pool.query('UPDATE access_tokens SET expires_at=now()-interval \'1 minute\' WHERE hash=$1',[orderGrantHash(b.owner.hash,ob)]);
 expect((await getOwnedReadingOrder(b.token,ob))?.reading).toBeUndefined();
});
it('grant failure rolls back report and readiness; retry completes the same order atomically',async()=>{
 const r={...ra,id:randomUUID()};await saveTrialReading(a.owner,r);const id=await createTrialReadingOrder(a.owner,r.id,1000);await acceptPayment(await event(id));
 await pool.query("CREATE FUNCTION core_fail_grant() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN RAISE EXCEPTION 'test grant failure'; END$$; CREATE TRIGGER core_fail_grant BEFORE INSERT ON access_tokens FOR EACH ROW WHEN (NEW.purpose='customer-order') EXECUTE FUNCTION core_fail_grant()");
 try{await runReportJob(id);expect((await pool.query('SELECT * FROM reports WHERE order_id=$1',[id])).rowCount).toBe(0);expect((await getOwnedReadingOrder(a.token,id))?.reportStatus).toBe('retry');}
 finally{await pool.query('DROP TRIGGER core_fail_grant ON access_tokens; DROP FUNCTION core_fail_grant()');}
 await pool.query('UPDATE report_jobs SET run_after=now() WHERE order_id=$1',[id]);await runReportJob(id);
 expect((await getOwnedReadingOrder(a.token,id))?.reading).toEqual(r);expect(mocks.build).not.toHaveBeenCalled();
});
it('a changed delivered artifact is blocked rather than silently replacing saved prose',async()=>{
 const r={...rb,id:randomUUID()};await saveTrialReading(b.owner,r);const id=await createTrialReadingOrder(b.owner,r.id,1000);await acceptPayment(await event(id));await runReportJob(id);
 await pool.query("UPDATE reports SET data=jsonb_set(data,'{reading,frozen,customerReport,name}','\"changed\"'::jsonb) WHERE order_id=$1",[id]);
 await expect(getOwnedReadingOrder(b.token,id)).rejects.toThrow('DELIVERED_ARTIFACT_MISMATCH');
 mocks.pdf.mockClear();expect((await pdf(req(id,b.token),{params:Promise.resolve({id})})).status).toBe(503);expect(mocks.pdf).not.toHaveBeenCalled();
});
it('operator tools are closed in production and without the explicit test flag',async()=>{
 vi.stubEnv('NODE_ENV','production');await expect(createTrialReadingOrder(a.owner,ra.id,1000)).rejects.toThrow('DEMO_DISABLED');vi.stubEnv('NODE_ENV','test');vi.stubEnv('CORE_ORDER_TEST_ENABLED','false');await expect(createTrialReadingOrder(a.owner,ra.id,1000)).rejects.toThrow('CORE_TEST_DISABLED');expect(await getOwnedReadingOrder(a.token,oa)).toBeNull();vi.stubEnv('CORE_ORDER_TEST_ENABLED','true');
});
