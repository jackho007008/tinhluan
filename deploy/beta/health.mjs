// Operator CLI, not a public diagnostics endpoint. Never emits env values or query payloads.
import fs from 'node:fs';import path from 'node:path';import pg from 'pg';import {chromium} from 'playwright-core';import {validate,safeError,fail} from './common.mjs';
let db,browser;const checks={};
try{
 validate();checks.config=true;
 db=new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000,query_timeout:5000});await db.connect();await db.query('SELECT 1');
 const q=await db.query("SELECT to_regclass('reading_recovery_bindings') IS NOT NULL AND to_regclass('encyclopedia_versions') IS NOT NULL AS ready");if(!q.rows[0].ready)fail('SCHEMA_MISSING');checks.database=true;
 for(const k of ['INTERNAL_READING_DIR','TRIAL_READING_DIR']){const dir=process.env[k];fs.accessSync(dir,fs.constants.R_OK|fs.constants.W_OK);if(process.argv.includes('--preflight')){const f=path.join(dir,'.health-'+process.pid);fs.writeFileSync(f,'ok',{flag:'wx',mode:0o600});fs.unlinkSync(f);}}checks.stores=true;
 if(!process.argv.includes('--preflight')){
  for(const role of ['web','worker']){const b=JSON.parse(fs.readFileSync(path.join(process.env.DEPLOY_STATE_DIR,role+'.json')));if(Date.now()-Date.parse(b.at)>45000)fail('HEARTBEAT_STALE');process.kill(b.pid,0);process.kill(b.child,0);}checks.processes=true;
  for(const route of ['/lap-la-so','/api/toan-thu']){const r=await fetch(process.env.CUSTOMER_PDF_ORIGIN+route,{signal:AbortSignal.timeout(10000)});if(!r.ok)fail('HTTP_HEALTH_FAILED');}checks.http=true;
 }
 const lag=await db.query("SELECT (SELECT count(*) FROM report_jobs WHERE status IN ('pending','retry') AND run_after<now()-interval '10 minutes')+(SELECT count(*) FROM email_deliveries WHERE status IN ('pending','retry') AND run_after<now()-interval '10 minutes') AS overdue");checks.queueOverdue=Number(lag.rows[0].overdue);if(checks.queueOverdue)fail('QUEUE_OVERDUE');
 if(process.argv.includes('--chrome')){browser=await chromium.launch({channel:'chrome',headless:true});checks.chrome=browser.version();}
 console.log(JSON.stringify({ok:true,checks}));
}catch(e){console.error(JSON.stringify({ok:false,code:safeError(e),checks}));process.exitCode=1;}
finally{await browser?.close();await db?.end().catch(()=>{});}
