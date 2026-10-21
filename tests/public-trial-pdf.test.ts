import {it,expect,vi,beforeEach} from 'vitest';
import {NextRequest} from 'next/server';
const mock=vi.hoisted(()=>({render:vi.fn(),rate:vi.fn(),record:{id:'12345678-1234-4234-8234-123456789abc',snapshot:{resultId:'saved'},frozen:{customerReport:{version:'1.47.0',name:'Hồ sơ lưu',sections:[{paragraphs:[{text:'Giữ nguyên nội dung đã lưu.'}]}]}}}}));
vi.mock('../lib/internal-review/customer-pdf',()=>({renderStoredCustomerPdf:mock.render}));
vi.mock('../lib/db',()=>({pool:{query:vi.fn(async()=>({rows:[]}))},rateLimit:mock.rate}));
vi.mock('../lib/trial/store',()=>({TRIAL_COOKIE:'tinhluan_trial',trialOwner:async(token:string)=>token==='owner'?{hash:'owned',expiresAt:Date.now()+60000}:null,getTrialReading:async(_owner:unknown,id:string)=>id===mock.record.id?mock.record:null}));
import {GET} from '../app/api/trial/readings/[id]/report-pdf/route';
const call=(token='owner',id=mock.record.id,query='',site='same-origin')=>GET(new NextRequest('https://trial.test/api/trial/readings/'+id+'/report-pdf'+query,{headers:{Cookie:'tinhluan_trial='+token,'sec-fetch-site':site}}),{params:Promise.resolve({id})});
beforeEach(()=>{process.env.FREE_TRIAL_ENABLED='true';mock.render.mockReset().mockResolvedValue(Buffer.from('%PDF-test'));mock.rate.mockReset().mockResolvedValue(undefined);});
it('owner downloads full stored version from either mode without internal credentials or caching',async()=>{
 const before=JSON.stringify(mock.record);const res=await call('owner',mock.record.id,'?mode=basic');
 expect(res.status).toBe(200);expect(res.headers.get('content-type')).toBe('application/pdf');expect(res.headers.get('cache-control')).toContain('no-store');expect(res.headers.get('vary')).toBe('Cookie');
 expect(mock.render).toHaveBeenCalledWith(mock.record,{kind:'trial',token:'owner'});expect(JSON.stringify(mock.record)).toBe(before);
});
it('foreign/no session, unknown history ID and cross-site request cannot start a renderer',async()=>{
 for(const token of ['','foreign'])expect((await call(token)).status).toBe(404);
 expect((await call('owner','520dc069-c242-4134-9b5d-07d0f940a1ed')).status).toBe(404);
 expect((await call('owner',mock.record.id,'','cross-site')).status).toBe(403);expect(mock.render).not.toHaveBeenCalled();
});
it('evidence mode stays unavailable and feature flag fails closed',async()=>{
 expect((await call('owner',mock.record.id,'?evidence=1')).status).toBe(400);process.env.FREE_TRIAL_ENABLED='false';expect((await call()).status).toBe(404);expect(mock.render).not.toHaveBeenCalled();
});
it('quota, busy renderer and failure return retryable errors without changing saved data',async()=>{
 const before=JSON.stringify(mock.record);mock.rate.mockRejectedValueOnce(Error('RATE_LIMIT'));expect((await call()).status).toBe(429);expect(mock.render).not.toHaveBeenCalled();
 mock.render.mockRejectedValueOnce(Error('PRINT_BUSY'));const busy=await call();expect(busy.status).toBe(429);expect(busy.headers.get('retry-after')).toBe('10');
 mock.render.mockRejectedValueOnce(Error('PDF_FAILED'));expect((await call()).status).toBe(503);expect((await call()).status).toBe(200);expect(JSON.stringify(mock.record)).toBe(before);
});
