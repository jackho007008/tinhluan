import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const fail=code=>{throw new Error(code)};
export function validate(e=process.env){
 const required=['DATABASE_URL','APP_ORIGIN','RECOVERY_ORIGIN','INTERNAL_REVIEW_KEY','INTERNAL_READING_DIR','TRIAL_READING_DIR','DEPLOY_STATE_DIR'];
 for(const k of required)if(!e[k]||/REPLACE|example\.invalid/.test(e[k]))fail('CONFIG_REQUIRED_'+k);
 const db=new URL(e.DATABASE_URL),origin=new URL(e.APP_ORIGIN),drill=e.DEPLOY_MODE==='restore-drill';
 if(!['postgres:','postgresql:'].includes(db.protocol))fail('DATABASE_PROTOCOL');
 if(origin.origin!==e.APP_ORIGIN||e.RECOVERY_ORIGIN!==e.APP_ORIGIN)fail('ORIGIN_MISMATCH');
 if(drill){if(!/^\/tinhluan_restore_[a-z0-9_]+$/.test(db.pathname)||!['127.0.0.1','localhost'].includes(db.hostname)||origin.hostname!=='127.0.0.1'||e.GMAIL_SMTP_ENABLED!=='false'||e.READING_RECOVERY_ENABLED!=='false')fail('RESTORE_ISOLATION');}
 else if(e.DEPLOY_MODE!=='beta'||origin.protocol!=='https:')fail('HTTPS_REQUIRED');
 if(e.INTERNAL_REVIEW_KEY.length<32)fail('ADMIN_KEY_SHORT');
 for(const k of ['BETA_ENABLED','DEMO_ENABLED','CORE_ORDER_TEST_ENABLED','SEPAY_TEST_ENABLED','SEPAY_LIVE_ENABLED'])if(e[k]!=='false')fail('BETA_SCOPE_'+k);
 if(e.FREE_TRIAL_ENABLED!=='true'||e.PAYMENT_PROVIDER!=='mock')fail('BETA_SCOPE');
 if(!/^\d{4,5}$/.test(e.PORT||'')||Number(e.PORT)>65535||e.CUSTOMER_PDF_ORIGIN!==`http://127.0.0.1:${e.PORT}`)fail('PDF_LOOPBACK_REQUIRED');
 const roots=['INTERNAL_READING_DIR','TRIAL_READING_DIR','DEPLOY_STATE_DIR'].map(k=>path.resolve(e[k]));
 for(let i=0;i<roots.length;i++){if(!path.isAbsolute(e[['INTERNAL_READING_DIR','TRIAL_READING_DIR','DEPLOY_STATE_DIR'][i]])||roots[i]===process.cwd()||roots[i].startsWith(path.resolve('public')+'/'))fail('PRIVATE_STORE_REQUIRED');for(let j=0;j<i;j++)if(roots[i]===roots[j]||roots[i].startsWith(roots[j]+'/')||roots[j].startsWith(roots[i]+'/'))fail('STORE_OVERLAP');}
 for(const k of ['CUSTOMER_ALLOWED_ORIGINS','INTERNAL_REVIEW_ALLOWED_ORIGINS'])for(const v of (e[k]||'').split(',').filter(Boolean))if(v!==origin.origin)fail('EXTRA_ORIGIN_NOT_ALLOWED');
 if(!drill){if(e.READING_RECOVERY_ENABLED!=='true'||e.GMAIL_SMTP_ENABLED!=='true'||e.EMAIL_PROVIDER!=='gmail-smtp'||e.QA_LOCAL_MAIL_ENABLED!=='false')fail('GMAIL_RESTRICTED_REQUIRED');if(!/^[^@\s]+@gmail\.com$/.test(e.GMAIL_SMTP_USER||'')||!/^[A-Za-z0-9]{16}$/.test((e.GMAIL_SMTP_APP_PASSWORD||'').replace(/\s/g,''))||!/^\S+@\S+\.\S+$/.test(e.GMAIL_SMTP_TEST_TO||''))fail('GMAIL_CONFIG_REQUIRED');}
 return {drill,origin:origin.origin};
}
export function inventory(root){
 if(!fs.existsSync(root))fail('STORE_MISSING');const out={};
 function walk(rel){for(const ent of fs.readdirSync(path.join(root,rel),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const r=path.join(rel,ent.name);if(ent.isSymbolicLink())fail('STORE_SYMLINK_NOT_ALLOWED');if(ent.isDirectory())walk(r);else if(ent.isFile())out[r]=hash(fs.readFileSync(path.join(root,r)));}}
 walk('');return out;
}
export function pgEnv(url){const u=new URL(url);const e={...process.env,PGHOST:u.hostname,PGPORT:u.port||'5432',PGUSER:decodeURIComponent(u.username),PGPASSWORD:decodeURIComponent(u.password),PGDATABASE:u.pathname.slice(1)};for(const [q,k]of Object.entries({sslmode:'PGSSLMODE',sslrootcert:'PGSSLROOTCERT',sslcert:'PGSSLCERT',sslkey:'PGSSLKEY'}))if(u.searchParams.has(q))e[k]=u.searchParams.get(q);return e;}
export function safeError(e){return /^[A-Z0-9_]+$/.test(e?.message||'')?e.message:'DEPLOY_OPERATION_FAILED';}
