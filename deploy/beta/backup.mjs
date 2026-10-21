// Consistent DB snapshot paired with stores that remain byte-identical throughout the capture.
import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import pg from 'pg';
import {inventory,hash,pgEnv,fail,safeError} from './common.mjs';
process.umask(0o077);let c;const dest=process.argv[2];
try{
 if(!dest||!path.isAbsolute(dest)||fs.existsSync(dest))fail('NEW_ABSOLUTE_BACKUP_DIR_REQUIRED');
 const roots={internal:process.env.INTERNAL_READING_DIR,trial:process.env.TRIAL_READING_DIR};
 for(const r of Object.values(roots))if(!r||!path.isAbsolute(r)||dest.startsWith(r+'/')||r.startsWith(dest+'/')||r===dest)fail('BACKUP_PATH_OVERLAP');
 const before=Object.fromEntries(Object.entries(roots).map(([k,r])=>[k,inventory(r)]));
 fs.mkdirSync(dest,{recursive:true,mode:0o700});
 c=new pg.Client({connectionString:process.env.DATABASE_URL});await c.connect();await c.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 const snapshot=(await c.query('SELECT pg_export_snapshot() AS id')).rows[0].id;
 const tables={};for(const {tablename:t}of(await c.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")).rows){
  if(!/^[a-z_][a-z0-9_]*$/.test(t))fail('TABLE_NAME_INVALID');const rows=(await c.query(`SELECT * FROM "${t}"`)).rows;
  tables[t]={count:rows.length,sha256:hash(JSON.stringify(rows.map(x=>JSON.stringify(x)).sort()))};
 }
 const dump=spawnSync(process.env.PG_DUMP_BIN||'pg_dump',['--format=custom','--no-owner','--no-acl','--snapshot='+snapshot,'--file',path.join(dest,'database.dump')],{env:pgEnv(process.env.DATABASE_URL),encoding:'utf8'});
 if(dump.status!==0)fail('PG_DUMP_FAILED');
 for(const [k,r]of Object.entries(roots))fs.cpSync(r,path.join(dest,k),{recursive:true,dereference:false});
 for(const [k,r]of Object.entries(roots))if(JSON.stringify(inventory(r))!==JSON.stringify(before[k])||JSON.stringify(inventory(path.join(dest,k)))!==JSON.stringify(before[k]))fail('STORE_CHANGED_RETRY_IN_MAINTENANCE');
 await c.query('COMMIT');
 const list=spawnSync(process.env.PG_RESTORE_BIN||'pg_restore',['--list',path.join(dest,'database.dump')],{encoding:'utf8'});if(list.status!==0)fail('DUMP_UNREADABLE');
 const m={version:1,createdAt:new Date().toISOString(),database:new URL(process.env.DATABASE_URL).pathname.slice(1),dumpSha256:hash(fs.readFileSync(path.join(dest,'database.dump'))),tables,stores:before,consistency:'exported DB snapshot inside verified stable store interval'};
 fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify(m,null,2),{mode:0o600});
 console.log(JSON.stringify({ok:true,tables:Object.keys(tables).length,files:Object.fromEntries(Object.entries(before).map(([k,v])=>[k,Object.keys(v).length]))}));
}catch(e){console.error(safeError(e));process.exitCode=1;}finally{await c?.end().catch(()=>{});}
