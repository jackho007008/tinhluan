import {customerSession} from '../customer-auth/accounts';
import {pool} from '../db';
export class AdminAccessError extends Error {}
/** Customer authentication is necessary, never sufficient. Check persisted role on every request. */
export async function adminIdentity(token:string|undefined){
 const session=await customerSession(token);if(!session)return null;
 const row=(await pool.query(`SELECT r.user_id,coalesce((SELECT display_name FROM customer_identities i WHERE i.user_id=r.user_id ORDER BY created_at LIMIT 1),'Quản trị viên') name FROM admin_roles r WHERE r.user_id=$1 AND r.role='admin' AND r.revoked_at IS NULL`,[session.userId])).rows[0];
 return row?{userId:row.user_id as string,name:row.name as string}:null;
}
export async function requireAdmin(token:string|undefined){const actor=await adminIdentity(token);if(!actor)throw new AdminAccessError('ADMIN_REQUIRED');return actor;}
