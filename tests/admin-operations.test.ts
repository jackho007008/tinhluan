import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import {mkdtemp,mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import {randomUUID} from 'node:crypto';
import {NextRequest} from 'next/server';
import {pool} from '../lib/db';
import {testAdmin} from './helpers/admin';
import {issueReviewSession} from '../lib/internal-review/auth';
import {adminReports,adminOrders,adminOrder,adminTransactions,adminReading,querySchema,safeError} from '../lib/admin/operations';
import {GET} from '../app/api/internal-admin/route';
let session:string,root:string,readingId:string,oid:string,record:unknown;
const q=(v:Record<string,unknown>={})=>querySchema.parse(v);
beforeAll(async()=>{
 vi.stubEnv('INTERNAL_REVIEW_KEY','admin-test-only-key-not-real-'.repeat(3));session=(await testAdmin()).token;root=await mkdtemp(path.join(os.tmpdir(),'admin-ops-'));
 vi.stubEnv('TRIAL_READING_DIR',root+'/trial');vi.stubEnv('INTERNAL_READING_DIR',root+'/internal');
 const dir=root+'/trial/readings/'+'b'.repeat(64);await mkdir(dir,{recursive:true});
 readingId=randomUUID();record={id:readingId,createdAt:'2026-10-16T00:00:00Z',snapshot:{normalized:{name:'Tên dự phòng'}},frozen:{presentationVersion:'saved-v1',catalogVersion:'catalog-old',customerReport:{name:'Hồ sơ miễn phí thử'}}};
 await writeFile(dir+'/'+readingId+'.json',JSON.stringify(record));
 for(let i=0;i<7;i++){const id=randomUUID();if(i===0)oid=id;
 await pool.query(`INSERT INTO orders(id,code,email,amount,demo,scope,expires_at,payment_status,report_status,email_status) VALUES($1,$2,'private@example.invalid',1000,$3,'{}',now()+interval '1 day',$4,$5,'not_requested')`,[id,'ADMINTEST'+i,i!==6,i===0?'paid':'pending',i===0?'ready':'waiting']);}
 await pool.query(`INSERT INTO order_reading_bindings(order_id,owner_hash,owner_expires_at,reading_id,snapshot_id,presentation_version,catalog_version,content_hash,data) VALUES($1,'private-owner',now()+interval '1 day',$2,'snapshot','saved-v1','catalog-old','content-hash',$3)`,[oid,readingId,record]);
 await pool.query('INSERT INTO reports(id,order_id,data) VALUES($1,$2,$3)',[randomUUID(),oid,{kind:'frozen-customer-reading-v1',reading:record}]);
 await pool.query(`INSERT INTO report_jobs(id,order_id,status,attempts,last_error) VALUES($1,$2,'done',1,'secret=do-not-leak')`,[randomUUID(),oid]);
 await pool.query(`INSERT INTO access_tokens(hash,order_id,purpose,expires_at) VALUES('private-token',$1,'customer-order',now()+interval '1 day')`,[oid]);
 await pool.query(`INSERT INTO sepay_test_events(transaction_id,settlement_hash,body_hash,order_id,amount,recipient_hash,direction,disposition) VALUES('sepay:test:api:test-uuid','hash','body',$1,1000,'private-recipient','in','accepted'),('sepay:test:wrong','hash2','body2',$1,2000,'private-recipient','in','mismatch')`,[oid]);
 for(const key of ['api:test-uuid','webhook:123'])await pool.query(`INSERT INTO sepay_test_identities(identity_key,reference_key,transaction_id,business_hash) VALUES($1,'private-reference','sepay:test:api:test-uuid','hash')`,[key]);
 await pool.query(`INSERT INTO payment_transactions(id,order_id,amount,currency,recipient) VALUES('sepay:test:api:test-uuid',$1,1000,'VND','private-recipient')`,[oid]);
 await pool.query(`INSERT INTO sepay_test_checkpoints(scope,completed_at,processed_count) VALUES('private-scope',now(),2)`);
});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('requires named admin role; legacy internal key cannot authorize admin, denies guest/expired/forged sessions',async()=>{
 const spy=vi.spyOn(pool,'query');spy.mockClear();
 for(const cookie of ['', 'tinhluan_trial='+'a'.repeat(64),'tuvi_internal=forged','tuvi_internal='+issueReviewSession(Date.now()-7200000)]){
  const r=await GET(new NextRequest('http://localhost/api/internal-admin?view=orders',{headers:{cookie}}));expect(r.status).toBe(403);expect(await r.text()).not.toContain('ADMINTEST');}
 expect(spy).not.toHaveBeenCalled();spy.mockRestore();
 await expect(adminOrder(undefined,oid)).rejects.toThrow('ADMIN_REQUIRED');
});
it('finds free report by name and id, separates order binding, reads exact frozen value without rewriting',async()=>{
 const free=await adminReports(session,q({source:'free',q:'miễn phí'}));expect(free.total).toBe(1);expect(free.items[0].id).toBe(readingId);
 expect((await adminReports(session,q({source:'free',q:readingId}))).total).toBe(1);
 const bound=(await adminReports(session,q({source:'order',q:readingId}))).items[0];expect(bound.key).toBe(oid);expect(bound.createdAt).toBe('2026-10-16T00:00:00.000Z');
 expect((await adminReading(session,'free',readingId))?.reading).toEqual(record);
 expect((await adminReading(session,'order',oid))?.reading).toEqual(record);
 expect(JSON.parse(await readFile(root+'/trial/readings/'+'b'.repeat(64)+'/'+readingId+'.json','utf8'))).toEqual(record);
 expect(await adminReading(session,'free','../../.env')).toBeNull();
});
it('paginates stable orders without overlap, filters actual statuses and environment, searches literally',async()=>{
 const a=await adminOrders(session,q({size:5})),b=await adminOrders(session,q({size:5,page:2}));expect(a.total).toBe(7);expect(a.items.length).toBe(5);expect(b.items.length).toBe(2);expect(a.items.some(x=>b.items.some(y=>x.id===y.id))).toBe(false);
 expect((await adminOrders(session,q({environment:'live'}))).total).toBe(1);
 expect((await adminOrders(session,q({status:'paid'}))).items.map(x=>x.id)).toEqual([oid]);
 expect((await adminOrders(session,q({q:'ADMINTEST0'}))).items[0].id).toBe(oid);
 expect((await adminOrders(session,q({q:"%' OR 1=1--"}))).total).toBe(0);
});
it('shows mismatches, groups API/webhook aliases as one event and keeps ledger amount distinct',async()=>{
 const t=await adminTransactions(session,q({q:'ADMINTEST0'}));expect(t.total).toBe(2);
 const accepted=t.items.find(e=>e.disposition==='accepted');expect(accepted.aliases).toEqual(['api:test-uuid','webhook:123']);expect(accepted.booked).toBe(true);expect(t.items.find(e=>e.disposition==='mismatch').booked).toBe(false);
 const d=await adminOrder(session,oid);expect(d!.payments).toHaveLength(1);expect(d!.rights).toHaveLength(1);expect(d!.emails).toEqual([]);expect(d!.pdfObservation).toContain('bắt đầu từ G5');expect(d!.order.email_status).toBe('not_requested');
 const json=JSON.stringify(d);for(const forbidden of ['private-owner','private-token','private-recipient','private@example','secret=do-not-leak','private-scope'])expect(json).not.toContain(forbidden);
 expect(d!.jobs[0].last_error).toContain('ẩn');expect(safeError('REPORT_FAILED')).toBe('REPORT_FAILED');expect(safeError('ABCSECRETXYZ')).not.toContain('ABCSECRETXYZ');
});
it('API validates pagination, returns safe metadata with no-store, rejects unsupported access',async()=>{
 for(const suffix of ['size=0','size=500','page=-1','page=NaN','source=../../'])expect((await GET(new NextRequest('http://localhost/api/internal-admin?'+suffix,{headers:{cookie:'tinhluan_customer='+session}}))).status).toBe(400);
 const r=await GET(new NextRequest('http://localhost/api/internal-admin?view=order&id='+oid,{headers:{cookie:'tinhluan_customer='+session}}));expect(r.status).toBe(200);expect(r.headers.get('cache-control')).toContain('no-store');expect((await r.json()).order.id).toBe(oid);
});
