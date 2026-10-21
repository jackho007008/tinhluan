/** Local operator tool only. Never expose this as a customer payment endpoint. */
import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {createTrialReadingOrder,requireOrderTestOperator} from '../lib/order-readings';
import {acceptPayment,mockProvider,sign} from '../lib/payments';
import {pool} from '../lib/db';
import {runReportJob} from '../lib/jobs';
import {validReadingId} from '../lib/internal-review/reading-store';
requireOrderTestOperator();
const [command,id,amount]=process.argv.slice(2);
if(!validReadingId(id||''))throw Error('UUID_REQUIRED');
try{
 if(command==='create'){
  const root=path.resolve(process.env.TRIAL_READING_DIR||'.local/trial-readings');
  const owners=[];
  for(const f of await readdir(path.join(root,'sessions'))){
   if(!/^[a-f0-9]{64}\.json$/.test(f))continue;
   const hash=f.slice(0,-5),session=JSON.parse(await readFile(path.join(root,'sessions',f),'utf8'));
   if(session.expiresAt<=Date.now())continue;
   try{await readFile(path.join(root,'readings',hash,id+'.json'));owners.push({hash,expiresAt:session.expiresAt});}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  }
  if(owners.length!==1)throw Error('UNIQUE_ACTIVE_OWNER_REQUIRED');
  const orderId=await createTrialReadingOrder(owners[0],id,Number(amount));
  console.log(JSON.stringify({orderId,url:'/don-thu?id='+orderId,testOnly:true}));
 }else if(command==='pay'){
  const o=(await pool.query('SELECT o.* FROM orders o JOIN order_reading_bindings b ON b.order_id=o.id WHERE o.id=$1 AND o.demo=true',[id])).rows[0];
  if(!o)throw Error('CORE_ORDER_REQUIRED');
  const raw=JSON.stringify({eventId:randomUUID(),transactionId:'core-mock-'+id,orderId:id,code:o.code,amount:o.amount,currency:'VND',recipient:'DEMO_RECIPIENT',status:'paid'});
  console.log(JSON.stringify({orderId:id,result:await acceptPayment(mockProvider.verify(raw,sign(raw))),testOnly:true}));
 }else if(command==='deliver')console.log(JSON.stringify({orderId:id,ran:await runReportJob(id)}));
 else throw Error('Use create READING_UUID TEST_AMOUNT | pay ORDER_UUID | deliver ORDER_UUID');
}finally{await pool.end();}
