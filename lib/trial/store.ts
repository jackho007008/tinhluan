import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {mkdir,readFile,writeFile,readdir,link,unlink,rm} from 'node:fs/promises';
import path from 'node:path';
import type {InternalReading} from '../internal-review/reading-store';
import {validReadingId} from '../internal-review/reading-store';
import {assertChartIntegrity} from '../tuvi-engine/chart-integrity';
export const TRIAL_COOKIE='tinhluan_trial';
export const TRIAL_TTL=7*24*60*60;
export type TrialOwner={hash:string;expiresAt:number};
const root=()=>path.resolve(process.env.TRIAL_READING_DIR||'.local/trial-readings');
const digest=(token:string)=>createHash('sha256').update(token).digest('hex');
const ownerDir=(owner:TrialOwner)=>{
 if(!/^[a-f0-9]{64}$/.test(owner.hash))throw Error('INVALID_OWNER');
 return path.join(root(),'readings',owner.hash);
};
export async function trialOwner(token:string|undefined):Promise<TrialOwner|null>{
 if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
 const hash=digest(token);
 try{const session=JSON.parse(await readFile(path.join(root(),'sessions',hash+'.json'),'utf8'));
  return Number.isFinite(session.expiresAt)&&session.expiresAt>Date.now()?{hash,expiresAt:session.expiresAt}:null;
 }catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}
}
export async function createTrialOwner(){
 const token=randomBytes(32).toString('hex'),owner={hash:digest(token),expiresAt:Date.now()+TRIAL_TTL*1000};
 await mkdir(path.join(root(),'sessions'),{recursive:true,mode:0o700});
 await writeFile(path.join(root(),'sessions',owner.hash+'.json'),JSON.stringify({expiresAt:owner.expiresAt}),{flag:'wx',mode:0o600});
 startTrialMaintenance();
 return {token,owner};
}
export async function getTrialReading(owner:TrialOwner,id:string):Promise<InternalReading|null>{
 if(owner.expiresAt<=Date.now()||!validReadingId(id))return null;
 try{return JSON.parse(await readFile(path.join(ownerDir(owner),id+'.json'),'utf8'));}
 catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}
}
export async function listTrialReadings(owner:TrialOwner):Promise<InternalReading[]>{
 if(owner.expiresAt<=Date.now())return [];
 try{const files=(await readdir(ownerDir(owner))).filter(f=>f.endsWith('.json')&&validReadingId(f.slice(0,-5)));
  const rows=await Promise.all(files.map(f=>getTrialReading(owner,f.slice(0,-5))));
  return rows.filter((r):r is InternalReading=>!!r).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 }catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}
}
export async function saveTrialReading(owner:TrialOwner,record:InternalReading){
 if(owner.expiresAt<=Date.now()||!validReadingId(record.id))throw Error('INVALID_RECORD');
 assertChartIntegrity(record.snapshot.chart);
 const dir=ownerDir(owner);await mkdir(dir,{recursive:true,mode:0o700});
 const temp=path.join(dir,'.'+randomUUID()+'.tmp');
 try{await writeFile(temp,JSON.stringify(record),{flag:'wx',mode:0o600});await link(temp,path.join(dir,record.id+'.json'));}
 catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;
  const old=await getTrialReading(owner,record.id);
  if(JSON.stringify(old?.inputReceipt)!==JSON.stringify(record.inputReceipt))throw Error('ID_CONFLICT');
 }finally{await unlink(temp).catch(()=>{});}
}
let lastSweep=0;
/** Trial-only retention; never reads or deletes the internal/history store. */
export async function purgeExpiredTrialSessions(){
 if(Date.now()-lastSweep<3600000)return;
 const dir=path.join(root(),'sessions');
 const files=await readdir(dir).catch((e:NodeJS.ErrnoException)=>{if(e.code==='ENOENT')return [];throw e;});
 for(const file of files){if(!/^[a-f0-9]{64}\.json$/.test(file))continue;
  const session=JSON.parse(await readFile(path.join(dir,file),'utf8'));
  if(Number.isFinite(session.expiresAt)&&session.expiresAt<=Date.now()){
   await rm(path.join(root(),'readings',file.slice(0,-5)),{recursive:true,force:true});
   await unlink(path.join(dir,file)).catch(()=>{});
  }
 }
 lastSweep=Date.now();
}

let maintenanceTimer:ReturnType<typeof setInterval>|undefined;
function startTrialMaintenance(){
 if(maintenanceTimer)return;
 maintenanceTimer=setInterval(()=>{void purgeExpiredTrialSessions().catch(()=>{});},3600000);
 maintenanceTimer.unref();
}
