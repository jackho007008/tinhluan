import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import {readFile,mkdtemp,writeFile} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import {randomUUID,randomBytes} from 'node:crypto';
import {NextRequest} from 'next/server';
import {pool} from '../lib/db';
import {createTrialOwner,saveTrialReading,TRIAL_COOKIE} from '../lib/trial/store';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {loginVerifiedGoogle,customerSession,logoutCustomer,linkAvailableReadings,accountReading,accountReadings,tokenHash} from '../lib/customer-auth/accounts';
import {accountForm} from '../lib/customer-auth/http';
import {CUSTOMER_COOKIE,safeReturn} from '../lib/customer-auth/config';
import {beginGoogle,finishGoogle} from '../lib/customer-auth/google';
import {resolveTrialReading,resolveReadingOrder,RECOVERY_COOKIE} from '../lib/trial/recovery';
const mocks=vi.hoisted(()=>({pdf:vi.fn(async()=>Buffer.from('%PDF-test')),getToken:vi.fn(),verifyIdToken:vi.fn()}));
vi.mock('../lib/internal-review/customer-pdf',()=>({renderStoredCustomerPdf:mocks.pdf}));
// Only the network provider is mocked. These cases do not claim a real Google login.
vi.mock('google-auth-library',async original=>{const real=await original<typeof import('google-auth-library')>();return {...real,OAuth2Client:class extends real.OAuth2Client {getToken=mocks.getToken;verifyIdToken=mocks.verifyIdToken;}};});
import {GET as get} from '../app/api/trial/readings/[id]/route';
import {GET as pdf} from '../app/api/trial/readings/[id]/report-pdf/route';
import {createTrialReadingOrder,orderGrantHash} from '../lib/order-readings';
import {acceptPayment} from '../lib/payments';
import {runReportJob} from '../lib/jobs';
import {GET as orderPdf} from '../app/api/trial/orders/[id]/report-pdf/route';
import {POST as internalCreate} from '../app/api/internal-readings/route';
import {GET as callback} from '../app/api/account/google/callback/route';
import {POST as linkApi} from '../app/api/account/link/route';
import {POST as logoutApi} from '../app/api/account/logout/route';
let a:Awaited<ReturnType<typeof createTrialOwner>>,b:typeof a,record:Parameters<typeof saveTrialReading>[1],other:typeof record,dir:string,ua:Awaited<ReturnType<typeof loginVerifiedGoogle>>,ub:typeof ua;
beforeAll(async()=>{
 dir=await mkdtemp(path.join(os.tmpdir(),'g1a-'));
 for(const [k,v]of Object.entries({TRIAL_READING_DIR:dir,CUSTOMER_AUTH_ENABLED:'true',FREE_TRIAL_ENABLED:'true',READING_RECOVERY_ENABLED:'true',APP_ORIGIN:'https://qa.example.test',CUSTOMER_ALLOWED_ORIGINS:'http://localhost:3062',GOOGLE_AUTH_ORIGIN:'https://qa.example.test',GOOGLE_LOGIN_ENABLED:'true',CORE_ORDER_TEST_ENABLED:'true',DEMO_ENABLED:'true',PAYMENT_PROVIDER:'mock',GOOGLE_CLIENT_ID:'fixture.apps.googleusercontent.com',GOOGLE_CLIENT_SECRET:'fixture-not-a-secret'}))vi.stubEnv(k,v);
 const samples=JSON.parse(await readFile('fixtures/customer-reading-samples.json','utf8'));
 const make=(i:number)=>({id:randomUUID(),createdAt:new Date().toISOString(),snapshot:samples[i].snapshot,receipt:samples[i].receipt,frozen:freezeReading(samples[i].snapshot,samples[i].receipt)});
 a=await createTrialOwner();b=await createTrialOwner();record=make(0);other=make(1);await saveTrialReading(a.owner,record);await saveTrialReading(b.owner,other);
 ua=await loginVerifiedGoogle({subject:'fixture-a',email:'same@example.test'});ub=await loginVerifiedGoogle({subject:'fixture-b',email:'same@example.test'});
});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('provider subject is identity; same email never merges, repeat subject keeps account and rotates session',async()=>{
 expect(ua.userId).not.toBe(ub.userId);const again=await loginVerifiedGoogle({subject:'fixture-a',email:'changed@example.test'},ua.token);
 expect(again.userId).toBe(ua.userId);expect(await customerSession(ua.token)).toBeNull();ua=again;
 expect(JSON.stringify((await pool.query('SELECT * FROM customer_sessions WHERE user_id=$1',[ua.userId])).rows)).not.toContain(ua.token);
});
it('no ownership by ID/email, owner-linked reports keep exact frozen bytes and original expiry; retry cannot transfer ownership',async()=>{
 expect(await linkAvailableReadings(ua.userId,undefined,undefined)).toBe(0);expect(await accountReading(ua.token,record.id)).toBeNull();
 expect(await linkAvailableReadings(ua.userId,a.token,undefined)).toBe(1);expect(await linkAvailableReadings(ub.userId,b.token,undefined)).toBe(1);
 expect(await linkAvailableReadings(ub.userId,a.token,undefined)).toBe(0);
 const read=await accountReading(ua.token,record.id);expect(read?.record).toEqual(record);expect(read?.expiresAt).toBe(a.owner.expiresAt);
 expect(await accountReading(ub.token,record.id)).toBeNull();expect(await accountReading(ua.token,other.id)).toBeNull();
 expect((await accountReadings(ua.token)).map(x=>x.name)).toEqual([record.snapshot.normalized.name]);
 expect(await linkAvailableReadings(ua.userId,a.token,undefined)).toBe(0);
});
it('fresh account session reads/PDFs only own saved report without original trial cookie',async()=>{
 const fresh=await loginVerifiedGoogle({subject:'fixture-a'});
 const req=(id:string)=>new NextRequest('http://localhost:3062/api/trial/readings/'+id,{headers:{Cookie:CUSTOMER_COOKIE+'='+fresh.token}});
 expect((await get(req(record.id),{params:Promise.resolve({id:record.id})})).status).toBe(200);
 expect((await get(req(other.id),{params:Promise.resolve({id:other.id})})).status).toBe(404);
 expect((await pdf(req(record.id),{params:Promise.resolve({id:record.id})})).status).toBe(200);expect(mocks.pdf).toHaveBeenLastCalledWith(record,{kind:'customer',token:fresh.token});
 expect((await pdf(req(other.id),{params:Promise.resolve({id:other.id})})).status).toBe(404);
 expect((await resolveTrialReading(undefined,undefined,record.id,fresh.token))?.expiresAt).toBe(a.owner.expiresAt);
});
it('verified recovery is proof; unverified/revoked binding and expired origin cannot become durable account rights',async()=>{
 const c=await createTrialOwner(),r={...record,id:randomUUID()};await saveTrialReading(c.owner,r);
 const binding=randomUUID(),recovery=randomBytes(32).toString('base64url');
 await pool.query('INSERT INTO reading_recovery_bindings(id,owner_hash,reading_id,email,expires_at) VALUES($1,$2,$3,$4,$5)',[binding,c.owner.hash,r.id,'same@example.test',new Date(c.owner.expiresAt)]);
 await pool.query("INSERT INTO access_tokens(hash,purpose,recovery_binding_id,expires_at) VALUES($1,'reading-session',$2,$3)",[tokenHash(recovery),binding,new Date(c.owner.expiresAt)]);
 expect(await linkAvailableReadings(ua.userId,undefined,recovery)).toBe(0);
 await pool.query('UPDATE reading_recovery_bindings SET verified_at=now() WHERE id=$1',[binding]);expect(await linkAvailableReadings(ua.userId,undefined,recovery)).toBe(1);
 expect((await accountReading(ua.token,r.id))?.record).toEqual(r);
 await pool.query('UPDATE reading_recovery_bindings SET revoked_at=now() WHERE id=$1',[binding]);expect(await accountReading(ua.token,r.id)).toBeNull();
 await writeFile(path.join(dir,'sessions',b.owner.hash+'.json'),JSON.stringify({expiresAt:Date.now()-1}));expect(await accountReading(ub.token,other.id)).toBeNull();
});
it('expiry and logout are server-side; expired accounts and cross-site mutations fail, free trial keeps its original rights',async()=>{
 const req=(origin:string)=>new NextRequest('http://localhost:3062/api/account/link',{method:'POST',headers:{Origin:origin,Cookie:CUSTOMER_COOKIE+'='+ua.token}});
 expect((await linkApi(req('https://attacker.test'))).status).toBe(403);
 const exp=await loginVerifiedGoogle({subject:'fixture-expired'});await pool.query("UPDATE customer_sessions SET expires_at=now()-interval '1 second' WHERE hash=$1",[tokenHash(exp.token)]);expect(await customerSession(exp.token)).toBeNull();
 expect((await logoutApi(req('http://localhost:3062'))).cookies.get(CUSTOMER_COOKIE)?.maxAge).toBe(0);expect(await customerSession(ua.token)).toBeNull();
 expect((await resolveTrialReading(a.token,undefined,record.id))?.record).toEqual(record);
});
it('OAuth uses state, browser cookie, nonce, S256 PKCE, exact callback; cancellation consumes state; redirects are restricted',async()=>{
 expect(safeReturn('https://attacker.test')).toBe('/la-so-cua-toi');expect(safeReturn('//attacker.test')).toBe('/la-so-cua-toi');expect(safeReturn('/internal')).toBe('/la-so-cua-toi');
 const f=await beginGoogle('/ban-doc?id='+record.id);const u=new URL(f.url);expect(u.searchParams.get('code_challenge_method')).toBe('S256');expect(u.searchParams.get('redirect_uri')).toBe('https://qa.example.test/api/account/google/callback');
 await expect(finishGoogle(new URLSearchParams({state:f.state,error:'access_denied'}),randomBytes(32).toString('base64url'))).rejects.toThrow('GOOGLE_FLOW_INVALID');
 expect((await finishGoogle(new URLSearchParams({state:f.state,error:'access_denied'}),f.state)).cancelled).toBe(true);
 await expect(finishGoogle(new URLSearchParams({state:f.state,error:'access_denied'}),f.state)).rejects.toThrow('GOOGLE_FLOW_INVALID');
});
it('OAuth requires verified ID token plus matching nonce; expired state fails before token exchange',async()=>{
 const f=await beginGoogle('/la-so-cua-toi'),q=new URLSearchParams({state:f.state,code:'fixture-code'}),nonce=new URL(f.url).searchParams.get('nonce');
 mocks.getToken.mockResolvedValue({tokens:{id_token:'fixture-id-token'}});mocks.verifyIdToken.mockResolvedValue({getPayload:()=>({sub:'verified-fixture',email:'x@example.test',email_verified:true,nonce})});
 const result=await finishGoogle(q,f.state);expect(result.cancelled).toBe(false);if(!result.cancelled)expect(result.identity.subject).toBe('verified-fixture');
 const mismatch=await beginGoogle('/');mocks.verifyIdToken.mockResolvedValue({getPayload:()=>({sub:'fixture',nonce:'wrong'})});await expect(finishGoogle(new URLSearchParams({state:mismatch.state,code:'fixture'}),mismatch.state)).rejects.toThrow('GOOGLE_IDENTITY_INVALID');
 const expired=await beginGoogle('/');await pool.query("UPDATE customer_oauth_flows SET expires_at=now()-interval '1 minute' WHERE state_hash=$1",[tokenHash(expired.state)]);mocks.getToken.mockClear();await expect(finishGoogle(new URLSearchParams({state:expired.state,code:'fixture'}),expired.state)).rejects.toThrow('GOOGLE_FLOW_INVALID');expect(mocks.getToken).not.toHaveBeenCalled();
});

it('order claims require paid/delivered original grant; retry preserves one report/expiry and revocation denies account PDF',async()=>{
 const fresh=await loginVerifiedGoogle({subject:'fixture-a'}),orderId=await createTrialReadingOrder(a.owner,record.id,1000);
 await linkAvailableReadings(fresh.userId,a.token,undefined);expect(await accountReading(fresh.token,undefined,orderId)).toBeNull();
 const o=(await pool.query('SELECT * FROM orders WHERE id=$1',[orderId])).rows[0];await acceptPayment({eventId:randomUUID(),transactionId:randomUUID(),orderId,code:o.code,amount:1000,currency:'VND',recipient:'DEMO_RECIPIENT',status:'paid'});await runReportJob(orderId);
 expect(await linkAvailableReadings(fresh.userId,a.token,undefined)).toBe(1);expect(await linkAvailableReadings(fresh.userId,a.token,undefined)).toBe(0);
 const r=await resolveReadingOrder(undefined,undefined,orderId,fresh.token);expect(r?.order.reading).toEqual(record);expect(r?.identity.kind).toBe('customer-order');expect((await accountReading(fresh.token,undefined,orderId))?.expiresAt).toBe(a.owner.expiresAt);
 expect(await resolveReadingOrder(undefined,undefined,orderId,ub.token)).toBeNull();
 const req=new NextRequest('http://localhost:3062/api/trial/orders/'+orderId+'/report-pdf',{headers:{Cookie:CUSTOMER_COOKIE+'='+fresh.token}});
 expect((await orderPdf(req,{params:Promise.resolve({id:orderId})})).status).toBe(200);expect(mocks.pdf).toHaveBeenLastCalledWith(record,{kind:'customer-order',token:fresh.token,orderId});
 await pool.query('UPDATE access_tokens SET revoked_at=now() WHERE hash=$1',[orderGrantHash(a.owner.hash,orderId)]);expect(await accountReading(fresh.token,undefined,orderId)).toBeNull();expect((await orderPdf(req,{params:Promise.resolve({id:orderId})})).status).toBe(404);
 expect((await pool.query('SELECT count(*)::int n FROM reports WHERE order_id=$1',[orderId])).rows[0].n).toBe(1);
 expect((await internalCreate(new NextRequest('http://localhost:3062/api/internal-readings',{method:'POST',headers:{Cookie:CUSTOMER_COOKIE+'='+fresh.token}}))).status).toBe(401);
});
it('callback exchanges validated provider response into HttpOnly session and returns exact report; cancellation grants nothing',async()=>{
 const f=await beginGoogle('/ban-doc?id='+record.id+'&mode=basic');const nonce=new URL(f.url).searchParams.get('nonce');
 mocks.verifyIdToken.mockResolvedValue({getPayload:()=>({sub:'fixture-a',nonce})});
 const response=await callback(new NextRequest('https://qa.example.test/api/account/google/callback?state='+f.state+'&code=fixture-code',{headers:{Cookie:'tinhluan_google_flow='+f.state+'; '+TRIAL_COOKIE+'='+a.token}}));
 expect(response.status).toBe(303);expect(response.headers.get('location')).toBe('https://qa.example.test/ban-doc?id='+record.id+'&mode=basic');
 expect(response.cookies.get(CUSTOMER_COOKIE)?.httpOnly).toBe(true);expect(response.cookies.get(CUSTOMER_COOKIE)?.secure).toBe(true);
 expect((await customerSession(response.cookies.get(CUSTOMER_COOKIE)?.value))?.userId).toBe(ua.userId);
 const cancel=await beginGoogle('/lap-la-so');const cr=await callback(new NextRequest('https://qa.example.test/api/account/google/callback?state='+cancel.state+'&error=access_denied',{headers:{Cookie:'tinhluan_google_flow='+cancel.state}}));
 expect(cr.cookies.get(CUSTOMER_COOKIE)).toBeUndefined();expect(cr.headers.get('location')).toContain('notice=cancelled');
});

it('OAuth native form is bounded even without Content-Length and rejects duplicate/foreign fields',async()=>{
 const req=(body:string)=>new NextRequest('https://qa.example.test/api/account/google/start',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
 expect((await accountForm(req('returnTo=%2Fla-so-cua-toi'))).get('returnTo')).toBe('/la-so-cua-toi');
 for(const body of ['returnTo='+ 'x'.repeat(2100),'returnTo=a&returnTo=b','email=claim@example.test'])await expect(accountForm(req(body))).rejects.toThrow('FORM_INVALID');
});
