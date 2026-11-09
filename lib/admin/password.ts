import {readFile} from 'node:fs/promises';
import {scrypt,randomBytes,timingSafeEqual} from 'node:crypto';
import {z} from 'zod';
import {rateLimit,transaction} from '../db';
import {tokenHash} from '../customer-auth/accounts';
import {customerAuthEnabled,SESSION_SECONDS} from '../customer-auth/config';

const credentialSchema=z.object({userId:z.string().uuid(),username:z.string().min(1).max(100),email:z.string().email().optional(),salt:z.string().regex(/^[a-f0-9]{32}$/),hash:z.string().regex(/^[a-f0-9]{128}$/)});
export const passwordLoginEnabled=()=>customerAuthEnabled()&&!!process.env.ADMIN_PASSWORD_FILE;
export async function verifyPassword(password:string,salt:string,hash:string){
 const actual=await new Promise<Buffer>((resolve,reject)=>scrypt(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(err,key)=>err?reject(err):resolve(key)));
 return timingSafeEqual(actual,Buffer.from(hash,'hex'));
}
/** Explicit server-side credential binding, never infer ownership or grant a role from email. */
export async function loginAdminPassword(identifier:string,password:string,oldToken?:string){
 if(!passwordLoginEnabled())throw Error('LOGIN_UNAVAILABLE');
 await rateLimit('admin:password:global',20);
 if(!identifier||identifier.length>320||password.length<1||Buffer.byteLength(password)>1024)throw Error('LOGIN_INVALID');
 const c=credentialSchema.parse(JSON.parse(await readFile(process.env.ADMIN_PASSWORD_FILE!,'utf8')));
 const name=identifier.trim().toLowerCase();
 const valid=await verifyPassword(password,c.salt,c.hash);
 if(!valid||![c.username.toLowerCase(),c.email?.toLowerCase()].includes(name))throw Error('LOGIN_INVALID');
 return transaction(async db=>{
  const role=await db.query("SELECT user_id FROM admin_roles WHERE user_id=$1 AND role='admin' AND revoked_at IS NULL FOR SHARE",[c.userId]);
  if(!role.rowCount)throw Error('LOGIN_INVALID');
  const token=randomBytes(32).toString('base64url');
  await db.query("INSERT INTO customer_sessions(hash,user_id,expires_at) VALUES($1,$2,now()+$3*interval '1 second')",[tokenHash(token),c.userId,SESSION_SECONDS]);
  if(oldToken&&/^[A-Za-z0-9_-]{43}$/.test(oldToken))await db.query('UPDATE customer_sessions SET revoked_at=now() WHERE hash=$1',[tokenHash(oldToken)]);
  return token;
 });
}
