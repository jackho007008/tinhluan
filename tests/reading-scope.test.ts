import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import {randomUUID} from 'node:crypto';
import {NextRequest} from 'next/server';
import {pool} from '../lib/db';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import type {InternalReading} from '../lib/internal-review/reading-store';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import {customerReadingAccess} from '../lib/trial/reading-access';
import {createTrialOwner,saveTrialReading,TRIAL_COOKIE} from '../lib/trial/store';
import {loginVerifiedGoogle,linkAvailableReadings,tokenHash} from '../lib/customer-auth/accounts';
import {CUSTOMER_COOKIE} from '../lib/customer-auth/config';
import {createTrialReadingOrder,orderGrantHash,readingHash} from '../lib/order-readings';
import {acceptPayment} from '../lib/payments';import {runReportJob} from '../lib/jobs';
const mocks=vi.hoisted(()=>({pdf:vi.fn(async()=>Buffer.from('%PDF-fixture'))}));
vi.mock('../lib/internal-review/customer-pdf',()=>({renderStoredCustomerPdf:mocks.pdf}));
import {GET as get} from '../app/api/trial/readings/[id]/route';
import {GET as pdf} from '../app/api/trial/readings/[id]/report-pdf/route';
import {GET as orderGet} from '../app/api/trial/orders/[id]/route';
let owner:Awaited<ReturnType<typeof createTrialOwner>>,a:Awaited<ReturnType<typeof loginVerifiedGoogle>>,b:typeof a,record:InternalReading,legacy:InternalReading,orderId:string,dir:string,samples:any[];
const req=(id:string,token?:string,trial=false)=>new NextRequest('http://localhost:3062/api/trial/readings/'+id,{headers:token?{Cookie:(trial?TRIAL_COOKIE:CUSTOMER_COOKIE)+'='+token}:{}});
const params=(id:string)=>({params:Promise.resolve({id})});
beforeAll(async()=>{
 dir=await fs.mkdtemp(path.join(os.tmpdir(),'g2-scope-'));
 for(const [k,v]of Object.entries({TRIAL_READING_DIR:dir,CUSTOMER_AUTH_ENABLED:'true',GOOGLE_LOGIN_ENABLED:'false',FREE_TRIAL_ENABLED:'true',CORE_ORDER_TEST_ENABLED:'true',DEMO_ENABLED:'true',PAYMENT_PROVIDER:'mock',READING_RECOVERY_ENABLED:'true'}))vi.stubEnv(k,v);
 samples=JSON.parse(await fs.readFile('fixtures/customer-reading-samples.json','utf8'));
 const make=(s:any)=>({id:randomUUID(),createdAt:new Date().toISOString(),snapshot:s.snapshot,receipt:s.receipt,frozen:freezeReading(s.snapshot,s.receipt)});
 owner=await createTrialOwner();record=make(samples[0]);record.accessPolicy=captureReadingPolicy(record);legacy=make(samples[1]);
 await saveTrialReading(owner.owner,record);await saveTrialReading(owner.owner,legacy);
 a=await loginVerifiedGoogle({subject:'g2-fixture-a'});b=await loginVerifiedGoogle({subject:'g2-fixture-b'});await linkAvailableReadings(a.userId,owner.token,undefined);
});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('projects whole semantic groups regardless of headings; retains Liêm–Tướng / R02–M05 relations and all allowed evidence, no paid text',()=>{
 let adjusted=0;
 for(const s of samples){const r:InternalReading={id:randomUUID(),createdAt:new Date().toISOString(),snapshot:s.snapshot,frozen:freezeReading(s.snapshot,s.receipt)};r.accessPolicy=captureReadingPolicy(r);
  const before=readingHash(r),full=r.frozen.customerReport!,free=projectReading(r),allowed=new Set(r.accessPolicy.freeParagraphIds);
  expect(free.scope.palaces).toHaveLength(12);expect(free.scope.full).toBe(false);expect(free.report.unplaced).toEqual([]);
  for(const p of full.sections.flatMap(s=>s.paragraphs)){const got=free.report.sections.flatMap(s=>s.paragraphs).find(x=>x.id===p.id);
   if(allowed.has(p.id)){expect(got).toEqual(p);if(p.members.length>1)adjusted++;}
   else {expect(got).toBeUndefined();expect(JSON.stringify(free.report)).not.toContain(JSON.stringify(p.text));}
  }
  const renamed=structuredClone(r);renamed.frozen.customerReport!.sections.forEach(s=>s.title='Đổi tiêu đề');expect(captureReadingPolicy(renamed)).toEqual(r.accessPolicy);
  expect(readingHash(r)).toBe(before);
 }
 expect(adjusted).toBeGreaterThan(0);
});
it('cross-scope relation holds the complete group; absent content is not marketed as locked content',()=>{
 const r=structuredClone(record),p=r.frozen.customerReport!.sections.flatMap(s=>s.paragraphs).find(p=>r.accessPolicy!.freeParagraphIds.includes(p.id))!;
 p.relations.push({claimIds:[...p.claimIds,'outside-paid-scope'],text:'paid sentinel'});r.accessPolicy=captureReadingPolicy(r);
 expect(r.accessPolicy.freeParagraphIds).not.toContain(p.id);expect(r.accessPolicy.heldGroups.some(g=>g.id===p.id)).toBe(true);
 expect(projectReading(r).scope.palaces.find(p=>p.name==='Tật Ách')?.state).toBe('empty');
 expect(JSON.stringify(projectReading(r))).not.toContain('paid sentinel');
});
it('guest and unpaid account API/evidence is projected, query mode cannot unlock and PDF is forbidden before rendering',async()=>{
 const expected=projectReading(record);for(const [token,trial]of [[owner.token,true],[a.token,false]] as const){
  const response=await get(req(record.id,token,trial),params(record.id));expect(response.status).toBe(200);expect((await response.json()).report).toEqual(expected.report);
  expect((await pdf(req(record.id,token,trial),params(record.id))).status).toBe(403);
 }
 expect(mocks.pdf).not.toHaveBeenCalled();expect((await get(req(record.id,b.token),params(record.id))).status).toBe(404);
 expect((await pdf(req(record.id,b.token),params(record.id))).status).toBe(404);
});
it('legacy saved report and full PDF retain exact content and original lifetime',async()=>{
 const access=await customerReadingAccess(undefined,undefined,legacy.id,a.token);expect(access?.report).toEqual(legacy.frozen.customerReport);expect(access?.scope.full).toBe(true);expect(access?.expiresAt).toBe(owner.owner.expiresAt);
 expect((await pdf(req(legacy.id,a.token),params(legacy.id))).status).toBe(200);expect(mocks.pdf).toHaveBeenLastCalledWith(legacy,{kind:'customer',token:a.token});
});
it('existing mock order/worker grants only the bound frozen edition; retry is idempotent, other account cannot read/PDF',async()=>{
 orderId=await createTrialReadingOrder(owner.owner,record.id,1000);
 const order=(await pool.query('SELECT * FROM orders WHERE id=$1',[orderId])).rows[0];
 expect(order.scope.readingScope).toBe('full-saved-edition');expect((await customerReadingAccess(owner.token,undefined,record.id,a.token))?.scope.full).toBe(false);
 await acceptPayment({eventId:randomUUID(),transactionId:randomUUID(),orderId,code:order.code,amount:1000,currency:'VND',recipient:'DEMO_RECIPIENT',status:'paid'});await runReportJob(orderId);await runReportJob(orderId);
 await linkAvailableReadings(a.userId,owner.token,undefined);
 const access=await customerReadingAccess(undefined,undefined,record.id,a.token);expect(access?.report).toEqual(record.frozen.customerReport);expect(access?.scope.full).toBe(true);expect(access?.identity.kind).toBe('customer-order');expect(access?.expiresAt).toBe(owner.owner.expiresAt);
 expect((await pdf(req(record.id,a.token),params(record.id))).status).toBe(200);expect(mocks.pdf).toHaveBeenLastCalledWith(record,{kind:'customer-order',token:a.token,orderId});
 expect((await get(req(record.id,b.token),params(record.id))).status).toBe(404);expect((await pdf(req(record.id,b.token),params(record.id))).status).toBe(404);
 expect((await orderGet(req(orderId,b.token),params(orderId))).status).toBe(404);
 expect((await pool.query('SELECT count(*)::int n FROM reports WHERE order_id=$1',[orderId])).rows[0].n).toBe(1);
});
it('paid expiry and revocation cannot be restored by fresh login, worker retry or relinking; free Mệnh remains',async()=>{
 const hash=orderGrantHash(owner.owner.hash,orderId);
 await pool.query("UPDATE access_tokens SET expires_at=now()-interval '1 second' WHERE hash=$1",[hash]);
 expect((await customerReadingAccess(undefined,undefined,record.id,a.token))?.scope.full).toBe(false);expect((await pdf(req(record.id,a.token),params(record.id))).status).toBe(403);
 // Test-only restoration to isolate revoked branch; production has no such mutation endpoint.
 await pool.query('UPDATE access_tokens SET expires_at=$2,revoked_at=now() WHERE hash=$1',[hash,new Date(owner.owner.expiresAt)]);
 const before=(await pool.query('SELECT expires_at,revoked_at FROM access_tokens WHERE hash=$1',[hash])).rows[0];
 a=await loginVerifiedGoogle({subject:'g2-fixture-a'},a.token);await linkAvailableReadings(a.userId,owner.token,undefined);await runReportJob(orderId);
 expect((await customerReadingAccess(undefined,undefined,record.id,a.token))?.scope.full).toBe(false);
 expect((await pool.query('SELECT expires_at,revoked_at FROM access_tokens WHERE hash=$1',[hash])).rows[0]).toEqual(before);
 await pool.query("UPDATE customer_sessions SET expires_at=now()-interval '1 second' WHERE hash=$1",[tokenHash(a.token)]);expect(await customerReadingAccess(undefined,undefined,record.id,a.token)).toBeNull();
 a=await loginVerifiedGoogle({subject:'g2-fixture-a'});expect((await customerReadingAccess(undefined,undefined,record.id,a.token))?.scope.full).toBe(false);
 expect((await customerReadingAccess(undefined,undefined,legacy.id,a.token))?.expiresAt).toBe(owner.owner.expiresAt);
});
