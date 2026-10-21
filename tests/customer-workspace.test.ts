import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import {readFile,mkdtemp} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import {randomUUID} from 'node:crypto';
import {pool} from '../lib/db';
import {createTrialOwner,saveTrialReading,TRIAL_COOKIE,getTrialReading} from '../lib/trial/store';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
import {loginVerifiedGoogle,linkCreatedReading,accountReading,tokenHash} from '../lib/customer-auth/accounts';
import {customerLibrary} from '../lib/customer-auth/library';
import {CUSTOMER_COOKIE} from '../lib/customer-auth/config';
import {captureReadingPolicy,projectReading} from '../lib/trial/reading-policy';
import {createTrialReadingOrder} from '../lib/order-readings';
import {NextRequest} from 'next/server';
import {POST as create} from '../app/api/trial/readings/route';
import {customerReadingAccess} from '../lib/trial/reading-access';
let a:Awaited<ReturnType<typeof createTrialOwner>>,b:typeof a,ua:Awaited<ReturnType<typeof loginVerifiedGoogle>>,ub:typeof ua,records:Parameters<typeof saveTrialReading>[1][]=[];
beforeAll(async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'g3-'));
 for(const [k,v]of Object.entries({TRIAL_READING_DIR:dir,CUSTOMER_AUTH_ENABLED:'true',FREE_TRIAL_ENABLED:'true',READING_RECOVERY_ENABLED:'true',APP_ORIGIN:'http://localhost:3062',CUSTOMER_ALLOWED_ORIGINS:'http://localhost:3062',CORE_ORDER_TEST_ENABLED:'true',DEMO_ENABLED:'true',PAYMENT_PROVIDER:'mock'}))vi.stubEnv(k,v);
 a=await createTrialOwner();b=await createTrialOwner();ua=await loginVerifiedGoogle({subject:'g3-a'});ub=await loginVerifiedGoogle({subject:'g3-b'});
 const samples=JSON.parse(await readFile('fixtures/customer-reading-samples.json','utf8'));
 for(let i=0;i<10;i++){
  const sample=structuredClone(samples[i%2]);sample.snapshot.normalized.name=i===3?'Đặng Ánh 3':'Hồ sơ Ánh '+i;
  const r={id:randomUUID(),createdAt:new Date(Date.now()-i*1000).toISOString(),snapshot:sample.snapshot,receipt:sample.receipt,frozen:freezeReading(sample.snapshot,sample.receipt)};
  records.push({...r,accessPolicy:captureReadingPolicy(r)});await saveTrialReading(a.owner,records[i]);await linkCreatedReading(ua.token,a.token,r.id);
 }
});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('search, paging and empty tabs use exact account metadata; no prose or foreign orders escape',async()=>{
 const first=await customerLibrary(ua.token),second=await customerLibrary(ua.token,{page:'2'});
 expect(first?.total).toBe(10);expect(first?.items).toHaveLength(8);expect(second?.items).toHaveLength(2);
 expect(new Set([...first!.items,...second!.items].map(x=>x.id)).size).toBe(10);
 expect((await customerLibrary(ua.token,{q:'dang anh 3'}))?.items.map(x=>x.id)).toEqual([records[3].id]);
 expect((await customerLibrary(ua.token,{q:'absent'}))?.total).toBe(0);
 expect((await customerLibrary(ub.token))?.total).toBe(0);expect(await customerLibrary(undefined)).toBeNull();
 expect((await customerLibrary(ua.token,{tab:'purchased'}))?.total).toBe(0);
 expect(JSON.stringify(first)).not.toContain(records[0].frozen.customerReport!.sections[0].paragraphs[0].text);
 const order=await createTrialReadingOrder(a.owner,records[0].id,1000);
 expect((await customerLibrary(ua.token,{tab:'orders'}))?.items[0].id).toBe(order);
 expect((await customerLibrary(ub.token,{tab:'orders'}))?.total).toBe(0);
 expect((await customerLibrary(ua.token,{tab:'purchased'}))?.total).toBe(0);
});
it('automatic linking retries do not transfer ownership, duplicate links or extend original expiry',async()=>{
 await linkCreatedReading(ua.token,a.token,records[0].id);await linkCreatedReading(ub.token,a.token,records[0].id);
 expect(await accountReading(ub.token,records[0].id)).toBeNull();
 const links=(await pool.query('SELECT * FROM customer_reading_links WHERE reading_id=$1',[records[0].id])).rows;
 expect(links).toHaveLength(1);expect(new Date(links[0].expires_at).getTime()).toBe(a.owner.expiresAt);
 expect((await accountReading(ua.token,records[0].id))?.record).toEqual(records[0]);
});
it('real creation API links to logged-in owner; edit creates a second immutable edition; foreign access fails',async()=>{
 const id=randomUUID(),body={id,customerInput:{name:'G3 tạo mới',day:7,month:8,year:1992,calendar:'solar',isLeap:false,hourIndex:8,gender:'male'}};
 const req=(data:unknown)=>new NextRequest('http://localhost:3062/api/trial/readings',{method:'POST',headers:{Origin:'http://localhost:3062','Content-Type':'application/json',Cookie:TRIAL_COOKIE+'='+b.token+'; '+CUSTOMER_COOKIE+'='+ub.token},body:JSON.stringify(data)});
 const response=await create(req(body));expect(response.status,await response.clone().text()).toBe(200);
 const original=await accountReading(ub.token,id);expect(original?.record.id).toBe(id);expect(original?.expiresAt).toBe(b.owner.expiresAt);
 expect((await create(req(body))).status).toBe(200);
 const nextId=randomUUID();expect((await create(req({...body,id:nextId,customerInput:{...body.customerInput,name:'G3 sửa tên'}}))).status).toBe(200);
 expect((await accountReading(ub.token,nextId))?.record.snapshot.normalized.name).toBe('G3 sửa tên');
 expect((await getTrialReading(b.owner,id))).toEqual(original?.record);
 expect(await customerReadingAccess(undefined,undefined,id,ua.token)).toBeNull();
 expect((await customerLibrary(ub.token))?.total).toBe(2);
});
it('expiry remains independent from account login and is visible without an open link',async()=>{
 await pool.query("UPDATE customer_reading_links SET expires_at=now()-interval '1 second' WHERE user_id=$1 AND reading_id=$2",[ua.userId,records[1].id]);
 const fresh=await loginVerifiedGoogle({subject:'g3-a'});
 const row=(await customerLibrary(fresh.token,{q:records[1].id}))?.items[0];
 expect(row?.status).toBe('Đã hết hạn');expect(row?.url).toBeNull();expect(await accountReading(fresh.token,records[1].id)).toBeNull();
});

it('a nameless valid saved report is not mislabeled as lost access',async()=>{
 const r=structuredClone(records[0]);r.id=randomUUID();r.snapshot.normalized.name='';await saveTrialReading(b.owner,r);await linkCreatedReading(ub.token,b.token,r.id);
 const row=(await customerLibrary(ub.token,{q:r.id}))?.items[0];expect(row?.name).toBe('Hồ sơ bản mệnh');expect(row?.url).toBe('/ban-doc?id='+r.id);
});
