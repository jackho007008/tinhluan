// Read-only browser probe. No bodies, cookies, secrets or query strings are recorded.
import { chromium } from '@playwright/test';
import { createHmac } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const origin = process.env.PROBE_ORIGIN || 'http://localhost:3000';
const expires = String(Date.now()+3600000);
const token = expires+'.'+createHmac('sha256',process.env.INTERNAL_REVIEW_KEY).update('internal-review:'+expires).digest('hex');
const browser=await chromium.launch({channel:'chrome'});
const ctx=await browser.newContext({viewport:{width:360,height:844}});
await ctx.addCookies([{name:'tuvi_internal',value:token,url:origin,httpOnly:true,sameSite:'Strict'}]);
const events=[]; let step='initial';
await ctx.exposeBinding('jsonProbe',(_,event)=>events.push({step,...event}));
await ctx.addInitScript(()=>{
 const parse=JSON.parse;
 JSON.parse=function(value,reviver){try{return parse(value,reviver)}catch(e){window.jsonProbe({kind:'parse',length:typeof value==='string'?value.length:null,stack:e.stack});throw e}};
 const json=Response.prototype.json;
 Response.prototype.json=async function(){try{return await json.call(this)}catch(e){window.jsonProbe({kind:'response-json',path:new URL(this.url,location.href).pathname,status:this.status,type:this.headers.get('content-type'),stack:e.stack});throw e}};
});
const page=await ctx.newPage();
page.on('pageerror',e=>events.push({step,kind:'pageerror',stack:e.stack}));
page.on('response',async r=>{if(r.request().resourceType()==='document'||r.status()>=400)events.push({step,kind:'response',path:new URL(r.url()).pathname,status:r.status(),type:r.headers()['content-type']});});
page.on('requestfailed',r=>events.push({step,kind:'requestfailed',path:new URL(r.url()).pathname,error:r.failure()?.errorText}));
try {
 await page.goto(origin+'/internal/editorial/demo-wuqu-tianfu?view=reading');
 for(let i=0;i<15;i++)for(const sample of ['vn-2','vn-12','vn-20','vn-4','vn-6','']){
  step=`${i}:${sample||'demo'}`;
  await page.locator('select[name=sample]').selectOption(sample);
  await page.getByRole('button',{name:'Đối chiếu rule'}).click();
  await page.locator('[data-testid=rule-reading]').waitFor({timeout:10000});
  if(events.some(e=>e.kind==='pageerror'))throw Error('RUNTIME_ERROR_CAPTURED');
 }
}catch(e){events.push({step,kind:'probe-stop',message:e.message.split('\n')[0]});await page.screenshot({path:'docs/evidence/json-stability/probe.png'});}
finally{writeFileSync('docs/evidence/json-stability/probe.json',JSON.stringify(events,null,2));await browser.close();}
console.log(JSON.stringify({events:events.length,errors:events.filter(e=>['parse','pageerror','response-json'].includes(e.kind)).length}));
