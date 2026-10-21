// Wrap existing entry points; no second queue or report renderer.
import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import pg from 'pg';
import {validate,safeError,fail} from './common.mjs';
let child,db,timer,stopping=false;const role=process.argv[2];
try{
 const {drill}=validate();if(!['web','worker'].includes(role))fail('ROLE_INVALID');
 if(!fs.existsSync('.next/BUILD_ID'))fail('BUILD_REQUIRED');
 fs.mkdirSync(process.env.DEPLOY_STATE_DIR,{recursive:true,mode:0o700});
 db=new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000,query_timeout:5000});await db.connect();
 if(role==='worker'){
  const q=await db.query("SELECT pg_try_advisory_lock(846410,1) AS held");if(!q.rows[0].held)fail('WORKER_ALREADY_RUNNING');
  if(drill){const q=await db.query("SELECT (SELECT count(*) FROM report_jobs WHERE status IN ('pending','retry'))+(SELECT count(*) FROM email_deliveries WHERE status IN ('pending','retry')) AS n");if(Number(q.rows[0].n)!==0)fail('RESTORE_QUEUE_NOT_EMPTY');}
 }
 const file=path.join(process.env.DEPLOY_STATE_DIR,role+'.json');
 const beat=()=>fs.writeFileSync(file,JSON.stringify({role,pid:process.pid,child:child?.pid,at:new Date().toISOString()}),{mode:0o600});
 child=spawn(process.execPath,role==='web'?['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','-p',process.env.PORT]:['--import','tsx','scripts/worker.ts'],{env:process.env,stdio:'inherit'});
 const stop=()=>{if(stopping)return;stopping=true;clearInterval(timer);child.kill('SIGTERM');};
 process.on('SIGTERM',stop);process.on('SIGINT',stop);db.on('error',stop);
 child.on('error',()=>{console.error('CHILD_START_FAILED');stop();});
 child.on('exit',async(code)=>{clearInterval(timer);fs.rmSync(file,{force:true});await db.end().catch(()=>{});process.exit(stopping?0:(code||1));});
 beat();timer=setInterval(()=>{void db.query('SELECT 1').then(beat).catch(()=>{console.error('DATABASE_UNAVAILABLE');stop();});},15000);
}catch(e){console.error(safeError(e));await db?.end().catch(()=>{});process.exit(1);}
