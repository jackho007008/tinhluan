import {chromium} from 'playwright-core';
import {paginateCustomerReport as paginate146} from './customer-pagination146';
import {paginateCustomerReport} from './customer-pagination';
import type {InternalReading} from './reading-store';
import {observeOperation} from '../admin/events';
let active=false;
/** Shared existing print pipeline; identity selects an authorized stored-reading page, never a caller URL. */
async function renderStoredCustomerPdfInner(record:InternalReading,identity:({kind:'internal'|'trial'|'recovered'|'customer';token:string}|{kind:'order'|'recovered-order'|'customer-order';token:string;orderId:string}),evidence=false){
 const report=record.frozen.customerReport;if(!report)throw Error('PRINT_REPORT_MISSING');
 const origin=process.env.CUSTOMER_PDF_ORIGIN;
 if(!origin||!/^http:\/\/(127\.0\.0\.1|localhost):\d{2,5}$/.test(origin))throw Error('PRINT_ORIGIN_MISSING');
 if(active)throw Error('PRINT_BUSY');
 active=true;let browser;
 try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  const context=await browser.newContext();
  await context.addCookies([{name:identity.kind==='internal'?'tuvi_internal':identity.kind.startsWith('customer')?'tinhluan_customer':identity.kind.startsWith('recovered')?'tinhluan_reading_access':'tinhluan_trial',value:identity.token,url:origin,httpOnly:true,sameSite:'Strict'}]);
  const page=await context.newPage();
  const route=(identity.kind==='order'||identity.kind==='recovered-order'||identity.kind==='customer-order')?'/don-thu':(identity.kind==='trial'||identity.kind==='recovered'||identity.kind==='customer')?'/ban-doc':'/internal/readings';
  await page.goto(origin+route+'?id='+encodeURIComponent((identity.kind==='order'||identity.kind==='recovered-order'||identity.kind==='customer-order')?identity.orderId:record.id)+'&print=1'+(identity.kind==='internal'&&evidence?'&evidence=1':''),{waitUntil:'networkidle',timeout:45000});
  await page.locator('[data-customer-version]').waitFor({timeout:15000});
  await page.locator('[data-chart-sheet]').waitFor({timeout:15000});
  await page.emulateMedia({media:'print'});
  await page.evaluate(()=>document.fonts.ready);
  if(await page.locator('[data-customer-version]').getAttribute('data-customer-version')!==report.version)throw Error('PRINT_VERSION_MISMATCH');
  // The PDF is always the full saved report, even when requested from basic mode.
  const paragraphs=await page.locator('[data-customer-text]').allTextContents();
  if(JSON.stringify(paragraphs)!==JSON.stringify(report.sections.flatMap(s=>s.paragraphs.map(p=>p.text))))throw Error('PRINT_CONTENT_MISMATCH');
  if(report.version==='1.46.0')await page.evaluate(paginate146);
  if(report.version==='1.47.0'||['1.51.0','1.52.0','1.53.0','1.54.0','1.55.0','1.55.1','1.56.0','1.57.0','1.58.0','1.59.0','1.60.0','1.61.0', '1.62.0', '1.63.0', '1.63.1', '1.64.0', '1.64.1', '1.65.0','1.66.0','1.67.0','1.68.0','1.69.0','1.70.0','1.71.0','1.72.0','1.73.0','1.74.0','1.75.0','1.76.0','1.77.0','1.78.0'].includes(report.version))await page.evaluate(paginateCustomerReport);
  return await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font:9px Arial;width:100%;text-align:center;color:#68756c">TINH LUẬN · <span class="pageNumber"></span> / <span class="totalPages"></span></div>'});
 }finally{await browser?.close().catch(()=>{});active=false;}
}

/** Operational observation only; report content and PDF pipeline remain unchanged. */
export async function renderStoredCustomerPdf(...args:Parameters<typeof renderStoredCustomerPdfInner>){
 const [record,identity]=args;const context={channel:'pdf' as const,readingId:record.id,orderId:'orderId' in identity?identity.orderId:undefined};
 try{const bytes=await renderStoredCustomerPdfInner(...args);await observeOperation({...context,outcome:'success',code:'PDF_READY'});return bytes;}
 catch(e){await observeOperation({...context,outcome:'failure',code:e instanceof Error?e.message:'PDF_FAILED'});throw e;}
}
