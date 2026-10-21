import {pool} from '../db';
import {readingHash} from '../order-readings';
import {resolveTrialReading,resolveReadingOrder} from './recovery';
import {validReadingId} from '../internal-review/reading-store';
import {projectReading} from './reading-policy';
/** Ownership and paid scope are distinct. Existing order/grant/worker is the only full-scope authority.
 * G4 can attach a server-priced order to the same immutable edition. Login never writes grants. */
export async function customerReadingAccess(trial:string|undefined,recovery:string|undefined,id:string,customer?:string){
 if(!validReadingId(id))return null;
 const original=await resolveTrialReading(trial,recovery,id,customer);
 if(original?.record.accessPolicy===undefined&&original)return {...original,...projectReading(original.record)};
 // Query only candidate IDs; resolveReadingOrder rechecks the owner, paid/delivery state, expiry,
 // revocation and frozen content hash. Knowledge of reading/order IDs is not authorization.
 const orders=(await pool.query('SELECT order_id FROM order_reading_bindings WHERE reading_id=$1',[id])).rows;
 for(const row of orders){
  const a=await resolveReadingOrder(trial,recovery,row.order_id,customer),record=a?.order.reading;
  if(!record||original&&readingHash(original.record)!==readingHash(record))continue;
  const grant=(await pool.query("SELECT MIN(a.expires_at) AS expires_at FROM access_tokens a WHERE a.order_id=$1 AND a.purpose='customer-order' AND a.revoked_at IS NULL AND a.expires_at>now()",[row.order_id])).rows[0];
  if(!grant?.expires_at)continue;
  return {record,identity:a!.identity,key:row.order_id as string,expiresAt:new Date(grant.expires_at).getTime(),...projectReading(record,true)};
 }
 return original?{...original,...projectReading(original.record)}:null;
}
