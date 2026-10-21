// Local-only harness. Never reads the project's .env; never connects to its DB.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import net from 'node:net';
import {spawnSync,spawn} from 'node:child_process';
const root=process.cwd(), base=path.join(root,'.local/json-stability'), app=path.join(base,'app');
const command=process.argv[2];
const envFile=path.join(base,'test.env');
function run(bin,args,opts={}){const r=spawnSync(bin,args,{stdio:'inherit',...opts});if(r.status!==0)process.exit(r.status||1);}
if(command==='build'||command==='prepare') {
 const serving=await new Promise(resolve=>{const socket=net.connect(3005,'127.0.0.1');socket.once('connect',()=>{socket.destroy();resolve(true)});socket.once('error',()=>resolve(false));});
 if(serving)throw Error('STOP_ISOLATED_SERVER_3005_BEFORE_CHANGING_BUILD');
}
if(command==='prepare'){
 fs.mkdirSync(app,{recursive:true});
 for(const dir of ['app','components','lib','db','public','exports','scripts']) fs.cpSync(path.join(root,dir),path.join(app,dir),{recursive:true,filter:p=>!p.endsWith('.png')});
 for(const file of ['package.json','package-lock.json','tsconfig.json','next.config.ts','next-env.d.ts','postcss.config.mjs'])if(fs.existsSync(file))fs.copyFileSync(file,path.join(app,file));
 if(!fs.existsSync(path.join(app,'node_modules')))fs.symlinkSync(path.join(root,'node_modules'),path.join(app,'node_modules'));
 if(!fs.existsSync(envFile))fs.writeFileSync(envFile,`APP_ORIGIN=http://localhost:3005\nINTERNAL_REVIEW_KEY=${crypto.randomBytes(32).toString('hex')}\nDATABASE_URL=postgresql://${os.userInfo().username}@127.0.0.1:55443/tuvi_json_test\nBETA_ENABLED=false\nDEMO_ENABLED=false\nEMAIL_PROVIDER=local\n`,{mode:0o600});
 console.log('Prepared isolated app. Initialize isolated PostgreSQL per docs; no live DB operation.');
 process.exit(0);
}
if(!fs.existsSync(envFile))throw Error('RUN_PREPARE_FIRST');
const local=Object.fromEntries(fs.readFileSync(envFile,'utf8').trim().split('\n').map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
if(local.APP_ORIGIN!=='http://localhost:3005'||!local.DATABASE_URL?.includes('@127.0.0.1:55443/tuvi_json_test'))throw Error('ISOLATED_CONFIG_REQUIRED');
const env={...process.env,...local,E2E_ORIGIN:local.APP_ORIGIN};
if(command==='build')run(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build'],{cwd:app,env});
else if(command==='start'){
 const p=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port','3005'],{cwd:app,env,stdio:'inherit'});
 process.on('SIGINT',()=>p.kill('SIGINT'));process.on('SIGTERM',()=>p.kill('SIGTERM'));p.on('exit',code=>process.exit(code||0));
}else if(command==='test'){
 const buildId=fs.readFileSync(path.join(app,'.next/BUILD_ID'),'utf8');
 for(let i=1;i<=3;i++){
  if(fs.readFileSync(path.join(app,'.next/BUILD_ID'),'utf8')!==buildId)throw Error('BUILD_CHANGED_DURING_TEST');
  const log=fs.openSync(`docs/evidence/json-stability/production-run-${i}.txt`,'w');
  const r=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','test','-c','playwright.stability.config.ts'],{env,stdio:['ignore',log,log]});fs.closeSync(log);
  console.log(`Isolated production run ${i}: ${r.status===0?'PASS':'FAIL'} (automatic retries=0)`);
  if(r.status!==0)process.exit(r.status||1);
  if(fs.readFileSync(path.join(app,'.next/BUILD_ID'),'utf8')!==buildId)throw Error('BUILD_CHANGED_DURING_TEST');
 }
}else throw Error('Use prepare | build | start | test');
