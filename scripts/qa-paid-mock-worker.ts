/** Local synthetic QA consumer only. Not imported by the real AI worker or HTTP. */
import {pool} from '../lib/db';
import {reconcilePaidOrders} from '../lib/ai/paid-store';
import {runAiMenhJob} from '../lib/ai/worker';
import {mockPaidGeneration} from '../tests/fixtures/ai-paid-mock';
const url=new URL(process.env.DATABASE_URL||'postgresql://invalid');
if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname)||!url.pathname.startsWith('/tinhluan_ai_menh_paid31_qa_')||process.env.QA_PAID_MOCK_WORKER!=='true'||process.env.SEPAY_LIVE_ENABLED!=='false'||process.env.OPENAI_API_KEY?.trim())throw Error('ISOLATED_KEYLESS_MOCK_QA_REQUIRED');
let stopped=false;process.on('SIGTERM',()=>{stopped=true;});process.on('SIGINT',()=>{stopped=true;});
console.log('LOCAL MOCK ONLY: no OpenAI calls; persisted paid queue consumer.');
try{while(!stopped){await reconcilePaidOrders();const worked=await runAiMenhJob(async input=>{await new Promise(r=>setTimeout(r,2000));return mockPaidGeneration(input);},{paid:true});if(!worked)await new Promise(r=>setTimeout(r,2000));}}finally{await pool.end();}
