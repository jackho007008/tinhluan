import {beforeEach,afterAll,it,expect,vi} from 'vitest';
import {mkdtemp,readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import {randomUUID} from 'node:crypto';
import {NextRequest} from 'next/server';
const quotas=vi.hoisted(()=>({counts:new Map<string,number>(),unavailable:false}));
vi.mock('../lib/db',()=>({pool:{query:vi.fn(async()=>({rows:[]}))},rateLimit:vi.fn(async(key:string,max:number)=>{if(quotas.unavailable)throw Error('DB_DOWN');const n=(quotas.counts.get(key)||0)+1;quotas.counts.set(key,n);if(n>max)throw Error('RATE_LIMIT');})}));
import {POST as session} from '../app/api/trial/session/route';
import {POST as create} from '../app/api/trial/readings/route';
import {GET as read} from '../app/api/trial/readings/[id]/route';
import {POST as internal} from '../app/api/internal-readings/route';
import {trialOwner,TRIAL_COOKIE,TRIAL_TTL,purgeExpiredTrialSessions} from '../lib/trial/store';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import ReferenceCustomerReading from '../components/ReferenceCustomerReading';
import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
const origin='https://trial.example.test';
const input={name:'Khách thử',day:10,month:2,year:1997,calendar:'solar',isLeap:false,hourIndex:6,gender:'female'};
let dir:string;
const req=(route:string,body:unknown={},token?:string,source:string|null=origin)=>new NextRequest(origin+route,{method:'POST',headers:{'Content-Type':'application/json',...(source?{Origin:source}:{}),...(token?{Cookie:TRIAL_COOKIE+'='+token}:{})},body:JSON.stringify(body)});
const get=(id:string,token?:string)=>read(new NextRequest(origin+'/api/trial/readings/'+id,{headers:token?{Cookie:TRIAL_COOKIE+'='+token}:{}}),{params:Promise.resolve({id})});
const owner=async()=>{const r=await session(req('/api/trial/session'));expect(r.status).toBe(200);return r.cookies.get(TRIAL_COOKIE)!.value;};
beforeEach(async()=>{dir=await mkdtemp(path.join(os.tmpdir(),'tinhluan-trial-'));vi.stubEnv('TRIAL_READING_DIR',dir);vi.stubEnv('FREE_TRIAL_ENABLED','true');vi.stubEnv('APP_ORIGIN',origin);vi.stubEnv('CUSTOMER_ALLOWED_ORIGINS','');quotas.counts.clear();quotas.unavailable=false;});
afterAll(()=>vi.unstubAllEnvs());
it('anonymous bootstrap returns opaque HttpOnly/Secure cookie, no token in JSON, and fixed expiry',async()=>{
 const r=await session(req('/api/trial/session'));const cookie=r.cookies.get(TRIAL_COOKIE)!;
 expect(cookie.value).toMatch(/^[a-f0-9]{64}$/);expect(cookie.httpOnly).toBe(true);expect(cookie.secure).toBe(true);expect(cookie.sameSite).toBe('lax');expect(cookie.maxAge).toBe(TRIAL_TTL);
 const data=await r.json();expect(JSON.stringify(data)).not.toContain(cookie.value);
 const again=await session(req('/api/trial/session',{},cookie.value));expect(await again.json()).toEqual(data);expect(again.cookies.get(TRIAL_COOKIE)).toBeUndefined();
 expect(await readFile(path.join(dir,'sessions',(await trialOwner(cookie.value))!.hash+'.json'),'utf8')).not.toContain(cookie.value);
});
it('two owners with no internal cookie cannot read one another or internal history; reload is frozen',async()=>{
 const a=await owner(),b=await owner(),id=randomUUID();
 expect((await create(req('/api/trial/readings',{id,customerInput:input},a))).status).toBe(200);
 const first=await (await get(id,a)).json();expect(first.report.name).toBe(input.name);
 expect((await get(id,b)).status).toBe(404);expect((await get(id)).status).toBe(404);
 // A known internal reading ID is still absent from the independent guest store.
 const oldId='520dc069-c242-4134-9b5d-07d0f940a1ed';expect((await get(oldId,a)).status).toBe(404);
 expect((await internal(req('/api/internal-readings',{id:randomUUID(),customerInput:input},a))).status).toBe(401);
 const file=path.join(dir,'readings',(await trialOwner(a))!.hash,id+'.json'),saved=await readFile(file,'utf8');
 expect(JSON.parse(saved).inputReceipt.entered).toEqual(input);
 expect((await create(req('/api/trial/readings',{id,customerInput:input},a))).status).toBe(200);
 expect(await readFile(file,'utf8')).toBe(saved);expect(await (await get(id,a)).json()).toEqual(first);
 expect((await create(req('/api/trial/readings',{id,customerInput:{...input,day:11}},a))).status).toBe(409);
 // Editing creates another immutable record, never overwriting the earlier result.
 const editedId=randomUUID();expect((await create(req('/api/trial/readings',{id:editedId,customerInput:{...input,day:11}},a))).status).toBe(200);
 expect(JSON.parse(await readFile(path.join(dir,'readings',(await trialOwner(a))!.hash,editedId+'.json'),'utf8')).inputReceipt.entered.day).toBe(11);
 expect(await readFile(file,'utf8')).toBe(saved);
 // ID is not a capability: the same ID in B's namespace belongs only to B.
 expect((await create(req('/api/trial/readings',{id,customerInput:{...input,name:'Phiên B'}},b))).status).toBe(200);
 expect((await (await get(id,b)).json()).report.name).toBe('Phiên B');expect((await (await get(id,a)).json()).report.name).toBe(input.name);
});
it('rejects CSRF, absent owner, oversized JSON and invalid dates/extra internal fields',async()=>{
 expect((await session(req('/api/trial/session',{},undefined,'https://attacker.test'))).status).toBe(403);
 expect((await session(req('/api/trial/session',{},undefined,null))).status).toBe(403);
 expect((await session(req('/api/trial/session',{padding:'x'.repeat(9000)}))).status).toBe(413);
 expect((await create(req('/api/trial/readings',{id:randomUUID(),customerInput:input}))).status).toBe(401);
 const a=await owner();
 for(const body of [{id:randomUUID(),customerInput:{...input,day:30,month:2}},{id:randomUUID(),customerInput:input,parentId:'history'},{id:'../../internal-readings/a',customerInput:input}])expect((await create(req('/api/trial/readings',body,a))).status).toBe(400);
 const lunarError=await create(req('/api/trial/readings',{id:randomUUID(),customerInput:{...input,calendar:'lunar',day:31}},a));
 expect(lunarError.status).toBe(400);expect((await lunarError.json()).fieldErrors.birthDate).toEqual(expect.any(String));
 expect((await get('../sessions',a)).status).toBe(404);
});
it('session and global quotas fail closed with Retry-After, database outage does not bypass',async()=>{
 const a=await owner(),hash=(await trialOwner(a))!.hash;
 quotas.counts.set('free-trial:owner:'+hash,5);
 const limited=await create(req('/api/trial/readings',{id:randomUUID(),customerInput:input},a));expect(limited.status).toBe(429);expect(limited.headers.get('retry-after')).toBe('600');
 quotas.counts.clear();quotas.counts.set('free-trial:global',60);expect((await create(req('/api/trial/readings',{id:randomUUID(),customerInput:input},a))).status).toBe(429);
 quotas.unavailable=true;expect((await session(req('/api/trial/session'))).status).toBe(503);
});
it('expired cookie cannot read stored report even if report ID is known',async()=>{
 const a=await owner(),id=randomUUID();expect((await create(req('/api/trial/readings',{id,customerInput:input},a))).status).toBe(200);
 const hash=(await trialOwner(a))!.hash;
 await writeFile(path.join(dir,'sessions',hash+'.json'),JSON.stringify({expiresAt:Date.now()-1}));
 expect(await trialOwner(a)).toBeNull();expect((await get(id,a)).status).toBe(404);
 const clock=vi.spyOn(Date,'now').mockReturnValue(Date.now()+3600001);
 try{await purgeExpiredTrialSessions();expect(await readdir(path.join(dir,'sessions'))).not.toContain(hash+'.json');await expect(readFile(path.join(dir,'readings',hash,id+'.json'))).rejects.toMatchObject({code:'ENOENT'});}finally{clock.mockRestore();}
});
it('feature disabled remains closed and public rendering never offers internal evidence/report links',async()=>{
 vi.stubEnv('FREE_TRIAL_ENABLED','false');expect((await session(req('/api/trial/session'))).status).toBe(404);expect((await get(randomUUID())).status).toBe(404);
 const sample=JSON.parse(fs.readFileSync('fixtures/customer-reading-samples.json','utf8'))[0],report=freezeReading(sample.snapshot,sample.receipt).customerReport!;
 const html=renderToStaticMarkup(React.createElement(ReferenceCustomerReading,{report,id:randomUUID(),basic:true,publicTrial:true}));
 expect(html).toContain('/ban-doc?id=');expect(html).not.toContain('href="/internal');expect(html).not.toContain('/api/internal-readings');expect(html).toContain('Xem căn cứ');
});
