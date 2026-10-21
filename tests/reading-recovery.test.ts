import {beforeAll,afterAll,beforeEach,it,expect,vi} from 'vitest';
import {readFile,mkdtemp,writeFile} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import {randomUUID,createHash} from 'node:crypto';
import {NextRequest} from 'next/server';
import {pool} from '../lib/db';
import {createTrialOwner,saveTrialReading,TRIAL_COOKIE,getTrialReading} from '../lib/trial/store';
import {bindRecoveryEmail,requestRecovery,exchangeReadingToken,recoveredReading,resolveReadingOrder,recoveryDestination,RECOVERY_COOKIE} from '../lib/trial/recovery';
import {runEmailJob,runReportJob} from '../lib/jobs';
import {createTrialReadingOrder,orderGrantHash} from '../lib/order-readings';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {acceptPayment} from '../lib/payments';
import {POST} from '../app/api/trial/recovery/route';
import {GET as get} from '../app/api/trial/readings/[id]/route';
const mocks=vi.hoisted(()=>({pdf:vi.fn(async()=>Buffer.from('%PDF-test')),smtp:vi.fn(),close:vi.fn()}));
vi.mock('nodemailer',()=>({default:{createTransport:()=>({sendMail:mocks.smtp,close:mocks.close})}}));
vi.mock('../lib/internal-review/customer-pdf',()=>({renderStoredCustomerPdf:mocks.pdf}));
import {GET as pdf} from '../app/api/trial/readings/[id]/report-pdf/route';
const hash=(v:string)=>createHash('sha256').update(v).digest('hex');
let a:Awaited<ReturnType<typeof createTrialOwner>>,b:typeof a,record:Parameters<typeof saveTrialReading>[1],other:typeof record,dir:string,mail:string;
const api=(body:unknown,cookie?:string)=>POST(new NextRequest('http://localhost:3070/api/trial/recovery',{method:'POST',headers:{Origin:'http://localhost:3070','Content-Type':'application/json',...(cookie?{Cookie:TRIAL_COOKIE+'='+cookie}:{})},body:JSON.stringify(body)}));
async function message(email:string){const row=(await pool.query('SELECT e.id FROM email_deliveries e JOIN reading_recovery_bindings b ON b.id=e.recovery_binding_id WHERE b.email=$1',[email])).rows[0];return JSON.parse(await readFile(path.join(mail,row.id+'.json'),'utf8'));}
async function link(email:string){await runEmailJob();return new URL((await message(email)).link).hash.slice(1);}
beforeAll(async()=>{
 dir=await mkdtemp(path.join(os.tmpdir(),'reading-recovery-'));mail=path.join(dir,'mail');
 for(const [k,v]of Object.entries({TRIAL_READING_DIR:dir,LOCAL_MAIL_DIR:mail,READING_RECOVERY_ENABLED:'true',QA_LOCAL_MAIL_ENABLED:'true',EMAIL_PROVIDER:'local',RECOVERY_ORIGIN:'http://localhost:3070',APP_ORIGIN:'http://localhost:3070',CUSTOMER_ALLOWED_ORIGINS:'',FREE_TRIAL_ENABLED:'true',CORE_ORDER_TEST_ENABLED:'true',DEMO_ENABLED:'true',PAYMENT_PROVIDER:'mock'}))vi.stubEnv(k,v);
 const samples=JSON.parse(await readFile('fixtures/customer-reading-samples.json','utf8'));
 const make=(i:number)=>({id:randomUUID(),createdAt:new Date().toISOString(),snapshot:samples[i].snapshot,receipt:samples[i].receipt,frozen:freezeReading(samples[i].snapshot,samples[i].receipt)});
 a=await createTrialOwner();b=await createTrialOwner();record=make(0);other=make(1);await saveTrialReading(a.owner,record);await saveTrialReading(b.owner,other);
});
beforeEach(async()=>{await pool.query("DELETE FROM rate_limits WHERE key LIKE 'recovery:%'");});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('binding needs an existing owner, never email plus reading ID; public APIs do not return links/tokens',async()=>{
 for(const token of [undefined,b.token])expect((await api({action:'bind',email:'a@example.test',readingId:record.id},token)).status).toBe(403);
 const res=await api({action:'bind',email:' A@example.test ',readingId:record.id},a.token);expect(res.status).toBe(202);expect(JSON.stringify(await res.json())).not.toMatch(/token|https?:|recover#/);
 expect((await pool.query('SELECT verified_at FROM reading_recovery_bindings WHERE email=$1',['a@example.test'])).rows[0].verified_at).toBeNull();
});
it('verification requires POST exchange, is single use under concurrency, preserves expiry/artifact and supports PDF without owner cookie',async()=>{
 const token=await link('a@example.test');const row=(await pool.query('SELECT * FROM access_tokens WHERE hash=$1',[hash(token)])).rows[0];expect(row.purpose).toBe('reading-magic');expect(row.revoked_at).toBeNull();expect(JSON.stringify(row)).not.toContain(token);
 const attempts=await Promise.allSettled([exchangeReadingToken(token),exchangeReadingToken(token)]);expect(attempts.filter(x=>x.status==='fulfilled')).toHaveLength(1);
 const result=attempts.find(x=>x.status==='fulfilled') as PromiseFulfilledResult<Awaited<ReturnType<typeof exchangeReadingToken>>>;const grant=result.value;
 expect(grant.expiresAt).toBe(a.owner.expiresAt);expect((await recoveryDestination(grant.token))?.url).toBe('/ban-doc?id='+record.id);expect((await recoveredReading(grant.token,record.id))?.record).toEqual(record);expect(await recoveredReading(grant.token,other.id)).toBeNull();
 const req=(id:string)=>new NextRequest('http://localhost:3070/api/trial/readings/'+id,{headers:{Cookie:RECOVERY_COOKIE+'='+grant.token}});
 expect((await get(req(record.id),{params:Promise.resolve({id:record.id})})).status).toBe(200);
 expect((await get(req(other.id),{params:Promise.resolve({id:other.id})})).status).toBe(404);
 expect((await pdf(req(record.id),{params:Promise.resolve({id:record.id})})).status).toBe(200);expect(mocks.pdf).toHaveBeenLastCalledWith(record,{kind:'recovered',token:grant.token});
 expect((await pdf(req(other.id),{params:Promise.resolve({id:other.id})})).status).toBe(404);expect(await getTrialReading(a.owner,record.id)).toEqual(record);
 await pool.query('UPDATE access_tokens SET revoked_at=now() WHERE hash=$1',[hash(grant.token)]);expect(await recoveredReading(grant.token,record.id)).toBeNull();expect(await recoveryDestination(grant.token)).toBeNull();
});
it('resend is generic, only verified email queues; new browser gets HttpOnly cookie, no extra report or expiry',async()=>{
 const unknown=await api({action:'request',email:'unknown@example.test'}),known=await api({action:'request',email:'a@example.test'});expect(unknown.status).toBe(known.status);expect(await unknown.json()).toEqual(await known.json());
 const token=await link('a@example.test');const result=await api({action:'exchange',token});expect(result.status).toBe(200);expect(result.cookies.get(RECOVERY_COOKIE)?.httpOnly).toBe(true);expect((await result.json()).url).toBe('/ban-doc?id='+record.id);
 expect((await pool.query('SELECT count(*)::int n FROM reading_recovery_bindings WHERE reading_id=$1',[record.id])).rows[0].n).toBe(1);
});
it('expired link, binding revocation, and original session expiry deny access; resending cannot revive revoked binding',async()=>{
 await requestRecovery('a@example.test');const expired=await link('a@example.test');await pool.query("UPDATE access_tokens SET expires_at=now()-interval '1 minute' WHERE hash=$1",[hash(expired)]);await expect(exchangeReadingToken(expired)).rejects.toThrow('RECOVERY_DENIED');
 await requestRecovery('a@example.test');const token=await link('a@example.test');const grant=await exchangeReadingToken(token);
 await pool.query('UPDATE reading_recovery_bindings SET revoked_at=now() WHERE email=$1',['a@example.test']);expect(await recoveredReading(grant.token,record.id)).toBeNull();await expect(bindRecoveryEmail(a.token,record.id,undefined,'a@example.test')).rejects.toThrow('RECOVERY_DENIED');
 await bindRecoveryEmail(b.token,other.id,undefined,'b@example.test');const bt=await link('b@example.test');const bg=await exchangeReadingToken(bt);
 await writeFile(path.join(dir,'sessions',b.owner.hash+'.json'),JSON.stringify({expiresAt:Date.now()-1}));expect(await recoveredReading(bg.token,other.id)).toBeNull();
});
it('send failure retries via existing worker without issuing a usable token or changing report',async()=>{
 await bindRecoveryEmail(a.token,record.id,undefined,'retry@example.test');vi.stubEnv('EMAIL_PROVIDER','unconfigured');await runEmailJob();
 const q=(await pool.query("SELECT e.* FROM email_deliveries e JOIN reading_recovery_bindings b ON b.id=e.recovery_binding_id WHERE b.email='retry@example.test'")).rows[0];expect(q.status).toBe('retry');expect(q.last_error).toBe('EMAIL_FAILED');expect(q.attempts).toBe(1);
 expect((await pool.query('SELECT * FROM access_tokens WHERE recovery_binding_id=$1',[q.recovery_binding_id])).rowCount).toBe(0);
 vi.stubEnv('EMAIL_PROVIDER','local');await pool.query('UPDATE email_deliveries SET run_after=now() WHERE id=$1',[q.id]);const token=await link('retry@example.test');expect((await exchangeReadingToken(token)).url).toBe('/ban-doc?id='+record.id);expect(await getTrialReading(a.owner,record.id)).toEqual(record);
});
it('order recovery checks original payment/grant, keeps scope and rechecks revocation before exchange/read',async()=>{
 const orderId=await createTrialReadingOrder(a.owner,record.id,1000);await expect(bindRecoveryEmail(a.token,record.id,orderId,'order@example.test')).rejects.toThrow('RECOVERY_DENIED');
 const o=(await pool.query('SELECT * FROM orders WHERE id=$1',[orderId])).rows[0];await acceptPayment({eventId:randomUUID(),transactionId:randomUUID(),orderId,code:o.code,amount:1000,currency:'VND',recipient:'DEMO_RECIPIENT',status:'paid'});await runReportJob(orderId);
 await bindRecoveryEmail(a.token,record.id,orderId,'order@example.test');const grant=await exchangeReadingToken(await link('order@example.test'));
 expect((await resolveReadingOrder(undefined,grant.token,orderId))?.order.reading).toEqual(record);expect(await recoveredReading(grant.token,record.id)).toBeNull();expect(await resolveReadingOrder(undefined,grant.token,randomUUID())).toBeNull();
 await requestRecovery('order@example.test');const pending=await link('order@example.test');await pool.query('UPDATE access_tokens SET revoked_at=now() WHERE hash=$1',[orderGrantHash(a.owner.hash,orderId)]);
 expect(await resolveReadingOrder(undefined,grant.token,orderId)).toBeNull();await expect(exchangeReadingToken(pending)).rejects.toThrow('RECOVERY_DENIED');
 expect((await pool.query('SELECT * FROM reports WHERE order_id=$1',[orderId])).rowCount).toBe(1);
});
it('request limits and origin checks fail closed without returning secrets',async()=>{
 for(let i=0;i<3;i++)expect((await api({action:'request',email:'limits@example.test'})).status).toBe(202);expect((await api({action:'request',email:'limits@example.test'})).status).toBe(429);
 const r=await POST(new NextRequest('http://localhost:3070/api/trial/recovery',{method:'POST',headers:{Origin:'https://foreign.test','Content-Type':'application/json'},body:JSON.stringify({action:'request',email:'a@example.test'})}));expect(r.status).toBe(403);
});

it('Gmail queue failure rolls back tokens; retry accepts SMTP once without rebuilding or extending access',async()=>{
 const email='smtp-qa@example.test';await bindRecoveryEmail(a.token,record.id,undefined,email);
 for(const [k,v]of Object.entries({EMAIL_PROVIDER:'gmail-smtp',GMAIL_SMTP_ENABLED:'true',GMAIL_SMTP_USER:'sender@gmail.com',GMAIL_SMTP_APP_PASSWORD:'abcdefghijklmnop',GMAIL_SMTP_TEST_TO:email,RECOVERY_ORIGIN:'https://qa.example.test'}))vi.stubEnv(k,v);
 mocks.smtp.mockRejectedValueOnce(Error('SMTP denied secret-value'));
 await runEmailJob();
 const job=(await pool.query('SELECT e.* FROM email_deliveries e JOIN reading_recovery_bindings b ON b.id=e.recovery_binding_id WHERE b.email=$1',[email])).rows[0];
 expect(job.status).toBe('retry');expect(job.last_error).toBe('EMAIL_FAILED');expect(job.attempts).toBe(1);
 expect((await pool.query('SELECT * FROM access_tokens WHERE recovery_binding_id=$1',[job.recovery_binding_id])).rowCount).toBe(0);
 mocks.smtp.mockResolvedValueOnce({accepted:[email],rejected:[]});await pool.query('UPDATE email_deliveries SET run_after=now() WHERE id=$1',[job.id]);await runEmailJob();
 const sent=(await pool.query('SELECT * FROM email_deliveries WHERE id=$1',[job.id])).rows[0];expect(sent.status).toBe('sent');expect(sent.attempts).toBe(2);
 const text=mocks.smtp.mock.calls.at(-1)![0].text as string;const link=text.split('\n').find(s=>s.startsWith('https://'))!;
 const grant=await exchangeReadingToken(new URL(link).hash.slice(1));expect(grant.expiresAt).toBe(a.owner.expiresAt);expect((await recoveredReading(grant.token,record.id))?.record).toEqual(record);expect(await recoveredReading(grant.token,other.id)).toBeNull();await expect(exchangeReadingToken(new URL(link).hash.slice(1))).rejects.toThrow('RECOVERY_DENIED');
 expect(await runEmailJob()).toBe(false);expect(mocks.smtp).toHaveBeenCalledTimes(2);
});
