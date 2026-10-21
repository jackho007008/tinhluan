// Allowlist only: no .env, .local, DB, node_modules or OS-specific .next in delivery.
import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {inventory,hash,fail,safeError} from './common.mjs';
try{
 const dest=process.argv[2];if(!dest||!path.isAbsolute(dest)||fs.existsSync(dest)||dest.startsWith(path.resolve('public')+'/'))fail('NEW_PRIVATE_PACKAGE_DIR_REQUIRED');
 fs.mkdirSync(dest,{recursive:true,mode:0o700});
 for(const p of ['app','components','lib','scripts','db','public','deploy/beta','package.json','package-lock.json','tsconfig.json','next.config.ts','next-env.d.ts','postcss.config.mjs','docs/BETA-DEPLOYMENT.md','docs/UBUNTU-BETA-QUICKSTART.md']){fs.mkdirSync(path.dirname(path.join(dest,p)),{recursive:true});fs.cpSync(p,path.join(dest,p),{recursive:true});}
 for(const p of ['tanbien-review-1.9.0/readings.json','tanbien-reading-examples.json','demo-wuqu-tianfu-review.json']){fs.mkdirSync(path.dirname(path.join(dest,'exports',p)),{recursive:true});fs.copyFileSync(path.join('exports',p),path.join(dest,'exports',p));}
 const files=inventory(dest);const m={createdAt:new Date().toISOString(),presentation:'1.47.0',catalog:'interpretation-1.45.0',files};fs.writeFileSync(path.join(dest,'release-manifest.json'),JSON.stringify(m,null,2));
 const archive=dest+'.tar.gz';if(fs.existsSync(archive))fail('PACKAGE_ARCHIVE_EXISTS');const r=spawnSync('tar',['-czf',archive,'-C',path.dirname(dest),path.basename(dest)],{stdio:'pipe'});if(r.status!==0)fail('PACKAGE_TAR_FAILED');fs.chmodSync(archive,0o600);const digest=hash(fs.readFileSync(archive));fs.writeFileSync(archive+'.sha256',digest+'  '+path.basename(archive)+'\n',{mode:0o600});console.log(JSON.stringify({files:Object.keys(files).length,archiveSha256:digest}));
}catch(e){console.error(safeError(e));process.exitCode=1;}
