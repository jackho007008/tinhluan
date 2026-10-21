import {it,expect,vi,beforeEach} from 'vitest';
const browser=vi.hoisted(()=>({launch:vi.fn(),addCookies:vi.fn(),goto:vi.fn(),close:vi.fn(),pdf:vi.fn(),version:'1.47.0',texts:['Nội dung đã lưu, có dấu tiếng Việt.'],evaluate:vi.fn()}));
vi.mock('playwright-core',()=>({chromium:{launch:browser.launch}}));
import {renderStoredCustomerPdf} from '../lib/internal-review/customer-pdf';
import type {InternalReading} from '../lib/internal-review/reading-store';
const record={id:'12345678-1234-4234-8234-123456789abc',frozen:{customerReport:{version:'1.47.0',sections:[{paragraphs:[{text:'Nội dung đã lưu, có dấu tiếng Việt.'}]}]}}} as InternalReading;
beforeEach(()=>{vi.clearAllMocks();process.env.CUSTOMER_PDF_ORIGIN='http://127.0.0.1:3062';browser.version='1.47.0';browser.texts=['Nội dung đã lưu, có dấu tiếng Việt.'];browser.pdf.mockResolvedValue(Buffer.from('%PDF-'));browser.close.mockResolvedValue(undefined);browser.launch.mockResolvedValue({close:browser.close,newContext:async()=>({addCookies:browser.addCookies,newPage:async()=>({goto:browser.goto,locator:()=>({waitFor:async()=>{},getAttribute:async()=>browser.version,allTextContents:async()=>browser.texts}),emulateMedia:async()=>{},evaluate:browser.evaluate,pdf:browser.pdf})})});});
it('uses existing pagination, local-only route and only guest ownership cookie, no basic/evidence override',async()=>{
 await renderStoredCustomerPdf(record,{kind:'trial',token:'guest-only'},true);
 expect(browser.goto).toHaveBeenCalledWith('http://127.0.0.1:3062/ban-doc?id='+record.id+'&print=1',expect.any(Object));
 expect(browser.addCookies).toHaveBeenCalledWith([expect.objectContaining({name:'tinhluan_trial',value:'guest-only',url:'http://127.0.0.1:3062'})]);expect(browser.pdf).toHaveBeenCalledWith(expect.objectContaining({format:'A4',printBackground:true}));expect(browser.close).toHaveBeenCalledTimes(1);
});
it('rejects mismatched saved prose/version and releases renderer for retry',async()=>{
 browser.texts=['Nội dung khác'];await expect(renderStoredCustomerPdf(record,{kind:'trial',token:'x'})).rejects.toThrow('PRINT_CONTENT_MISMATCH');expect(browser.pdf).not.toHaveBeenCalled();
 browser.texts=['Nội dung đã lưu, có dấu tiếng Việt.'];browser.version='1.46.0';await expect(renderStoredCustomerPdf(record,{kind:'trial',token:'x'})).rejects.toThrow('PRINT_VERSION_MISMATCH');
 browser.version='1.47.0';await expect(renderStoredCustomerPdf(record,{kind:'trial',token:'x'})).resolves.toBeDefined();
});
it('only operator loopback can be navigated; internal print route remains separate',async()=>{
 process.env.CUSTOMER_PDF_ORIGIN='https://attacker.test';await expect(renderStoredCustomerPdf(record,{kind:'trial',token:'x'})).rejects.toThrow('PRINT_ORIGIN_MISSING');expect(browser.launch).not.toHaveBeenCalled();
 process.env.CUSTOMER_PDF_ORIGIN='http://localhost:3062';await renderStoredCustomerPdf(record,{kind:'internal',token:'internal-only'},true);expect(browser.goto).toHaveBeenCalledWith('http://localhost:3062/internal/readings?id='+record.id+'&print=1&evidence=1',expect.any(Object));expect(browser.addCookies).toHaveBeenCalledWith([expect.objectContaining({name:'tuvi_internal',value:'internal-only'})]);
});
it('duplicate concurrent exports do not launch another browser',async()=>{
 let resolve!:(v:Buffer)=>void;browser.pdf.mockImplementationOnce(()=>new Promise(r=>{resolve=r;}));const first=renderStoredCustomerPdf(record,{kind:'trial',token:'x'});
 await vi.waitFor(()=>expect(browser.pdf).toHaveBeenCalled());await expect(renderStoredCustomerPdf(record,{kind:'trial',token:'x'})).rejects.toThrow('PRINT_BUSY');resolve(Buffer.from('%PDF-'));await first;expect(browser.launch).toHaveBeenCalledTimes(1);
});
it('order print uses the order entitlement route with guest cookie, never the free-trial report ID',async()=>{
 const orderId='876bf6fb-3c2a-4d53-837b-f0314c678382';await renderStoredCustomerPdf(record,{kind:'order',token:'owner',orderId},true);
 expect(browser.goto).toHaveBeenCalledWith('http://127.0.0.1:3062/don-thu?id='+orderId+'&print=1',expect.any(Object));expect(browser.addCookies).toHaveBeenCalledWith([expect.objectContaining({name:'tinhluan_trial',value:'owner'})]);
});
