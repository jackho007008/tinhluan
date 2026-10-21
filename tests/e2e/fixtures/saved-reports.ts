import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { calculate } from '../../../lib/tuvi-engine';
import { buildReport } from '../../../lib/reports';
import {readFileSync} from 'node:fs';
const pending=JSON.parse(readFileSync('fixtures/chart-comparison/awaiting-vn.json','utf8'));
// Real engine outputs, created only in the explicitly named loopback acceptance database.
export async function savedReports() {
 const target=new URL(process.env.DATABASE_URL!);
 if(!['127.0.0.1','localhost'].includes(target.hostname) || target.pathname!=='/'+process.env.E2E_ISOLATED_DATABASE || !process.env.E2E_ISOLATED_DATABASE?.startsWith('tuvi_stability_')) throw Error('ISOLATED_DATABASE_REQUIRED');
 const db=new Pool({connectionString:process.env.DATABASE_URL}),ids:string[]=[];
 for(const birth of [{...pending.birth,date:'1992-08-07',hour:16,minute:0,gender:'male'},pending.birth]){
  const snapshot=await calculate(birth);const report=await buildReport(snapshot,{groups:['Tổng quan','Sự nghiệp & tài lộc'],year:null});const id=randomUUID();ids.push(id);
  await db.query('INSERT INTO birth_profile_snapshots(id,data) VALUES($1,$2)',[id,snapshot.normalized]);
  await db.query('INSERT INTO chart_snapshots(id,birth_id,result_id,data) VALUES($1,$1,$2,$3)',[id,snapshot.resultId,snapshot]);
  await db.query("INSERT INTO orders(id,code,email,chart_id,amount,demo,scope,expires_at) VALUES($1,$2,'stability@example.invalid',$1,99000,true,$3,now()+interval '1 day')",[id,'STABILITY'+id,report.scope]);
  await db.query('INSERT INTO reports(id,order_id,data) VALUES($1,$1,$2)',[id,report]);
 }
 return {ids, async cleanup(){for(const id of ids){await db.query('DELETE FROM reports WHERE order_id=$1',[id]);await db.query('DELETE FROM orders WHERE id=$1',[id]);await db.query('DELETE FROM chart_snapshots WHERE id=$1',[id]);await db.query('DELETE FROM birth_profile_snapshots WHERE id=$1',[id]);}await db.end();}};
}
