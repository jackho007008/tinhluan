// Local server operator only. No public endpoint grants administrative privileges.
import {randomUUID} from 'node:crypto';import {pool,transaction} from '../lib/db';
const [action,id]=process.argv.slice(2);
try{
 if(!['grant','revoke'].includes(action)||!/^[a-f0-9-]{36}$/i.test(id||''))throw Error('Usage: admin-role.ts grant|revoke USER_UUID');
 await transaction(async c=>{
  if(!(await c.query('SELECT id FROM customer_users WHERE id=$1',[id])).rowCount)throw Error('USER_NOT_FOUND');
  if(action==='grant')await c.query("INSERT INTO admin_roles(user_id,role) VALUES($1,'admin') ON CONFLICT(user_id) DO UPDATE SET revoked_at=NULL,granted_at=now()",[id]);
  else await c.query('UPDATE admin_roles SET revoked_at=now() WHERE user_id=$1',[id]);
  await c.query("INSERT INTO admin_audit(id,actor_kind,action,target_id) VALUES($1,'server-operator',$2,$3)",[randomUUID(),'role.'+action,id]);
 });console.log(JSON.stringify({action,userId:id,role:'admin',source:'server-operator'}));
}catch(e){console.error(e instanceof Error?e.message:'ROLE_FAILED');process.exitCode=1;}finally{await pool.end();}
