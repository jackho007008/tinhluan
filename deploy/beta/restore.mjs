// Never overwrites a DB or stores. Restores to a *new* named database, then verifies bytes/rows.
import fs from 'node:fs';import path from 'node:path';import pg from 'pg';import {spawnSync} from 'node:child_process';
import {inventory,hash,pgEnv,fail,safeError} from './common.mjs';
process.umask(0o077);let admin,db;const [backup,name,dest]=process.argv.slice(2);
try{
 if(!backup||!path.isAbsolute(backup)||!/^tinhluan_restore_[a-z0-9_]{1,40}$/.test(name||'')||!dest||!path.isAbsolute(dest)||fs.existsSync(dest))fail('RESTORE_NEW_TARGET_REQUIRED');
 const m=JSON.parse(fs.readFileSync(path.join(backup,'manifest.json')));if(m.database===name)fail('RESTORE_SOURCE_FORBIDDEN');
 if(hash(fs.readFileSync(path.join(backup,'database.dump')))!==m.dumpSha256)fail('DUMP_HASH_MISMATCH');
 for(const k of ['internal','trial'])if(JSON.stringify(inventory(path.join(backup,k)))!==JSON.stringify(m.stores[k]))fail('STORE_HASH_MISMATCH');
 const u=new URL(process.env.RESTORE_ADMIN_DATABASE_URL||process.env.DATABASE_URL);u.pathname='/postgres';admin=new pg.Client({connectionString:u.href});await admin.connect();
 // CREATE DATABASE fails if target exists. No DROP, no --clean, no reuse.
 await admin.query(`CREATE DATABASE "${name}"`);u.pathname='/'+name;
 const r=spawnSync(process.env.PG_RESTORE_BIN||'pg_restore',['--no-owner','--no-acl','--exit-on-error','--single-transaction','--dbname',name,path.join(backup,'database.dump')],{env:pgEnv(u.href),encoding:'utf8'});if(r.status!==0)fail('PG_RESTORE_FAILED_TARGET_LEFT_FOR_INSPECTION');
 fs.mkdirSync(dest,{recursive:true,mode:0o700});for(const k of ['internal','trial'])fs.cpSync(path.join(backup,k),path.join(dest,k),{recursive:true});
 db=new pg.Client({connectionString:u.href});await db.connect();
 for(const [t,expected]of Object.entries(m.tables)){if(!/^[a-z_][a-z0-9_]*$/.test(t))fail('TABLE_NAME_INVALID');const rows=(await db.query(`SELECT * FROM "${t}"`)).rows;if(rows.length!==expected.count||hash(JSON.stringify(rows.map(x=>JSON.stringify(x)).sort()))!==expected.sha256)fail('RESTORED_TABLE_MISMATCH');}
 for(const k of ['internal','trial'])if(JSON.stringify(inventory(path.join(dest,k)))!==JSON.stringify(m.stores[k]))fail('RESTORED_STORE_MISMATCH');
 const result={ok:true,at:new Date().toISOString(),database:name,tablesVerified:Object.keys(m.tables).length,storeFilesVerified:Object.values(m.stores).reduce((n,v)=>n+Object.keys(v).length,0),sourceUntouched:true};fs.writeFileSync(path.join(dest,'restore-result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}catch(e){console.error(safeError(e));process.exitCode=1;}finally{await db?.end().catch(()=>{});await admin?.end().catch(()=>{});}
