import {it,expect,afterAll,vi} from 'vitest';
import {mkdtemp,readFile} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';import {randomUUID} from 'node:crypto';
import {NextRequest} from 'next/server';
import {BIRTH_HOURS} from '../lib/customer-birth';
import {prepareCustomerBirth} from '../lib/internal-review/customer-input';
import {calculate} from '../lib/tuvi-engine';
import {issueReviewSession} from '../lib/internal-review/auth';
import {POST} from '../app/api/internal-readings/route';
const input={name:'Mẫu khoảng giờ',day:7,month:8,year:1992,calendar:'solar',isLeap:false,hourIndex:8,gender:'male',place:'Quảng Nam'};
it('twelve explicit intervals use a representative time without inventing precision',()=>{
 expect(BIRTH_HOURS).toHaveLength(12);
 for(let i=0;i<12;i++){const {birth,receipt}=prepareCustomerBirth({...input,hourIndex:i});expect(birth.hour).toBe(i*2);expect(birth.minute).toBe(0);expect(birth.date).toBe('1992-08-07');expect(receipt.precision).toBe('branch-interval');expect(receipt.entered.hourIndex).toBe(i);}
 expect(prepareCustomerBirth(input).receipt.timeLabel).toBe('Giờ Thân (15:00–16:59)');
 expect(prepareCustomerBirth({...input,hourIndex:0}).receipt.timeLabel).toBe('Giờ Tý (23:00–00:59)');
});
it('invalid, missing hour and impossible solar/lunar date fail closed',()=>{
 for(const patch of [{hourIndex:-1},{hourIndex:12},{hourIndex:undefined},{day:30,month:2},{isLeap:true},{year:1975},{calendar:'lunar',day:31},{calendar:'lunar',isLeap:true,month:1}])expect(()=>prepareCustomerBirth({...input,...patch})).toThrow();
 // Existing Vietnamese calendar: lunar New Year 2024 is solar 10/02/2024.
 expect(prepareCustomerBirth({...input,calendar:'lunar',day:1,month:1,year:2024}).birth.date).toBe('2024-02-10');
});
it('actual current engine uses branches, ignores intra-branch minutes, preserves civil date at Ty',async()=>{
 const {birth}=prepareCustomerBirth(input);
 const a=await calculate({...birth,hour:15,minute:0}),b=await calculate({...birth,hour:16,minute:59}),next=await calculate({...birth,hour:17,minute:0});
 expect(a.chart).toEqual(b.chart);expect(a.chart.calendarEvidence?.timeIndex).toBe(8);expect(next.chart.calendarEvidence?.timeIndex).toBe(9);expect(a.chart.palaces).not.toEqual(next.chart.palaces);
 const early=await calculate({...birth,hour:0,minute:0}),late=await calculate({...birth,hour:23,minute:59});expect(early.chart).toEqual(late.chart);expect(late.normalized.date).toBe(birth.date);expect(late.chart.calendarEvidence?.dayBoundary).toBe('00:00');
});
it('authenticated direct submit stores input precision and frozen text; auth, origin and legacy validation stay closed',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'tinhluan-interval-'));
 vi.stubEnv('INTERNAL_READING_DIR',dir);vi.stubEnv('INTERNAL_REVIEW_KEY','test-only-interval-key-at-least-32-characters');vi.stubEnv('APP_ORIGIN','http://localhost:3062');
 const id=randomUUID(),body={id,customerInput:input};
 const request=(authorized=true,origin='http://localhost:3062',payload:unknown=body)=>new NextRequest('http://localhost:3062/api/internal-readings',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...(authorized?{Cookie:'tuvi_internal='+issueReviewSession()}: {})},body:JSON.stringify(payload)});
 expect((await POST(request(false))).status).toBe(401);expect((await POST(request(true,'http://attacker.test'))).status).toBe(403);
 expect((await POST(request(true,undefined,{id:randomUUID(),birth:{...prepareCustomerBirth(input).birth,consent:false}}))).status).toBe(400);
 expect((await POST(request())).status).toBe(200);const before=await readFile(path.join(dir,id+'.json'),'utf8'),saved=JSON.parse(before);
 expect(saved.inputReceipt.entered).toEqual(input);expect(saved.inputReceipt.noticeMode).toBe('owner-authorized-internal-no-checkbox');expect(saved.frozen.customerReport.birth).toContain('Giờ Thân (15:00–16:59)');expect(saved.frozen.customerReport.birth).not.toContain(' · 16:00 · ');
 expect((await POST(request())).status).toBe(200);expect(await readFile(path.join(dir,id+'.json'),'utf8')).toBe(before);
 expect((await POST(request(true,undefined,{...body,customerInput:{...input,hourIndex:9}}))).status).toBe(409);
});
afterAll(()=>vi.unstubAllEnvs());

it('omitted place is recorded as missing and does not change chart calculation',async()=>{
 const {place:_,...withoutPlace}=input;
 const a=prepareCustomerBirth(withoutPlace),b=prepareCustomerBirth(input);
 expect(a.receipt.entered).not.toHaveProperty('place');
 expect(a.birth.place).toBe('Chưa có thông tin nơi sinh');
 expect((await calculate(a.birth)).chart).toEqual((await calculate(b.birth)).chart);
});
