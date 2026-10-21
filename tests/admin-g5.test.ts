import {beforeAll,afterAll,it,expect,vi} from 'vitest';import {randomUUID} from 'node:crypto';import {mkdtemp} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {NextRequest} from 'next/server';
import {pool} from '../lib/db';import {testAdmin} from './helpers/admin';import {loginVerifiedGoogle} from '../lib/customer-auth/accounts';import {adminIdentity} from '../lib/admin/auth';import {adminOverview,adminActivity,adminAudit,adminUsers,dateBounds} from '../lib/admin/extended';import {adminOrders,adminTransactions,querySchema} from '../lib/admin/operations';import {GET} from '../app/api/internal-admin/route';import {mutateArticle} from '../lib/encyclopedia/model';import {recordOperation} from '../lib/admin/events';import {renderStoredCustomerPdf} from '../lib/internal-review/customer-pdf';import {runEmailJob} from '../lib/jobs';
vi.mock('../lib/notifications',()=>({sendEmail:vi.fn(async()=>{throw Error('secret-and-token-must-not-be-stored')})}));
let admin:Awaited<ReturnType<typeof testAdmin>>,guest:typeof admin,order:string;
const q=(v:Record<string,unknown>={})=>querySchema.parse(v);
beforeAll(async()=>{admin=await testAdmin();guest=await loginVerifiedGoogle({subject:'g5-customer'});const dir=await mkdtemp(path.join(os.tmpdir(),'g5-'));vi.stubEnv('TRIAL_READING_DIR',dir);vi.stubEnv('INTERNAL_READING_DIR',dir);vi.stubEnv('CUSTOMER_PDF_ORIGIN','');
 order=randomUUID();await pool.query("INSERT INTO orders(id,code,email,amount,demo,scope,expires_at,payment_status,report_status) VALUES($1,'G5FIXTURE','test@example.invalid',1000,true,'{}',now()+interval '1 day','paid','ready')",[order]);await pool.query("INSERT INTO payment_transactions(id,order_id,amount,currency,recipient) VALUES('g5-unique',$1,1000,'VND','private-recipient')",[order]);
});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('ordinary Google and shared internal key denied; role revocation effective on next request',async()=>{
 expect(await adminIdentity(guest.token)).toBeNull();expect(await adminIdentity('shared-internal')).toBeNull();
 for(const cookie of ['', 'tuvi_internal=legacy','tinhluan_customer='+guest.token])expect((await GET(new NextRequest('http://localhost/api/internal-admin',{headers:{cookie}}))).status).toBe(403);
 expect(await adminIdentity(admin.token)).not.toBeNull();await pool.query('UPDATE admin_roles SET revoked_at=now() WHERE user_id=$1',[admin.userId]);expect(await adminIdentity(admin.token)).toBeNull();await expect(mutateArticle(admin.token,{action:'create'})).rejects.toThrow('ADMIN_REQUIRED');await pool.query('UPDATE admin_roles SET revoked_at=NULL WHERE user_id=$1',[admin.userId]);
});
it('overview equals detailed ledger and orders, Test money never becomes Live; date boundary is Vietnam',async()=>{
 const d=await adminOverview(admin.token,q({environment:'test'}));expect(d.orders.total).toBe((await adminOrders(admin.token,q({environment:'test'}))).total);expect(d.payments).toEqual([{demo:true,count:1,amount:'1000'}]);
 const ledger=await adminTransactions(admin.token,q({environment:'test',status:'paid'}));expect(ledger.total).toBe(1);expect(Number(ledger.items[0].amount)).toBe(1000);
 await recordOperation({channel:'webhook',outcome:'received',code:'WEBHOOK_ACCEPTED',transactionId:'sepay:test:999'});await recordOperation({channel:'webhook',outcome:'received',code:'WEBHOOK_DUPLICATE',transactionId:'sepay:test:999'});
 expect((await adminOverview(admin.token,q({environment:'test'}))).payments).toEqual(d.payments);expect((await adminOverview(admin.token,q({environment:'live'}))).payments).toEqual([]);
 await pool.query("INSERT INTO sepay_test_events(transaction_id,settlement_hash,body_hash,recipient_hash,order_id,amount,direction,disposition) VALUES('sepay:test:filter-case','fixture','fixture','fixture',$1,2000,'in','mismatch')",[order]);
 expect((await adminTransactions(admin.token,q({status:'mismatch'}))).items.map(x=>x.transaction_id)).toEqual(['sepay:test:filter-case']);
 expect((await adminTransactions(admin.token,q({status:'accepted'}))).total).toBe(0);
 expect(dateBounds(q({from:'2026-10-19',to:'2026-10-19'}))).toEqual(['2026-10-19T00:00:00+07:00','2026-10-19T17:00:00.000Z']);expect(()=>dateBounds(q({from:'2026-02-30'}))).toThrow();
 const bad=await GET(new NextRequest('http://localhost/api/internal-admin?from=2026-02-30',{headers:{cookie:'tinhluan_customer='+admin.token}}));expect(bad.status).toBe(400);
});
it('CMS write and actor audit commit together; no private content in audit and no audit for invalid mutation',async()=>{
 const a=await mutateArticle(admin.token,{action:'create',content:{title:'G5 fixture',slug:'g5-fixture',category:'Kiến thức nền',description:'Fixture không phải nội dung xuất bản.',body:'PRIVATE_DRAFT_MARKER',references:'Fixture'}});
 await mutateArticle(admin.token,{action:'save',id:a.id,revision:a.revision,content:{...a.draft,body:'SECOND_PRIVATE_BODY ghi chú fixture đủ độ dài'}});
 const log=await adminAudit(admin.token,q({q:a.id}));expect(log.total).toBe(2);expect(log.items.every(x=>x.actor_user_id===admin.userId)).toBe(true);expect(JSON.stringify(log)).not.toContain('PRIVATE');
 await expect(mutateArticle(admin.token,{action:'publish',id:a.id,revision:a.revision})).rejects.toThrow('STALE_REVISION');expect((await adminAudit(admin.token,q({q:a.id}))).total).toBe(2);
});
it('PDF and email failures persist safe codes; no token/message/body/recipient in operation log',async()=>{
 const readingId=randomUUID();await expect(renderStoredCustomerPdf({id:readingId,frozen:{customerReport:{}}} as never,{kind:'trial',token:'private-token'})).rejects.toThrow('PRINT_ORIGIN_MISSING');
 const mail=randomUUID();await pool.query('INSERT INTO email_deliveries(id,order_id) VALUES($1,$2)',[mail,order]);await runEmailJob();
 const d=await adminActivity(admin.token,q());expect(d.items.some(x=>x.channel==='pdf'&&x.code==='PRINT_ORIGIN_MISSING'&&x.reading_id===readingId)).toBe(true);expect(d.items.some(x=>x.channel==='email'&&x.code==='EMAIL_FAILED'&&x.job_id===mail)).toBe(true);
 const text=JSON.stringify(d);for(const s of ['private-token','secret-and-token','test@example','recipient'])expect(text).not.toContain(s);
 expect((await pool.query('SELECT status,last_error FROM email_deliveries WHERE id=$1',[mail])).rows[0]).toEqual({status:'retry',last_error:'EMAIL_FAILED'});
});
it('search, pagination and API data stay bounded with no identity subject or session material',async()=>{
 for(let i=0;i<6;i++)await loginVerifiedGoogle({subject:'g5-page-'+i,name:'Phân trang '+i});const a=await adminUsers(admin.token,q({q:'Phân trang',size:5})),b=await adminUsers(admin.token,q({q:'Phân trang',size:5,page:2}));expect(a.total).toBe(6);expect(a.items.length).toBe(5);expect(b.items.length).toBe(1);expect(a.items.some(x=>b.items.some(y=>y.id===x.id))).toBe(false);expect(JSON.stringify(a)).not.toContain('g5-page-');
});
