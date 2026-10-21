import {randomUUID} from 'node:crypto';
import {pool} from '../db';
import type {PoolClient} from 'pg';
const codes=new Set(['PDF_READY','PDF_FAILED','PRINT_BUSY','PRINT_REPORT_MISSING','PRINT_ORIGIN_MISSING','PRINT_VERSION_MISMATCH','PRINT_CONTENT_MISMATCH','EMAIL_FAILED','EMAIL_SENT','REPORT_FAILED','REPORT_READY','WEBHOOK_ACCEPTED','WEBHOOK_DUPLICATE','WEBHOOK_MISMATCH','WEBHOOK_REJECTED','WEBHOOK_IGNORED']);
export type OperationEvent={channel:'pdf'|'email'|'report'|'webhook';outcome:'success'|'failure'|'received';code:string;readingId?:string;orderId?:string;transactionId?:string;jobId?:string};
const uuid=(s:string|undefined)=>s&&/^[a-f0-9-]{36}$/i.test(s)?s:null;
/** Deliberate allowlist. Never accept message, stack, body, email, cookie or token fields. */
export async function recordOperation(e:OperationEvent,db:Pick<PoolClient,'query'>=pool){
 const code=codes.has(e.code)?e.code:e.channel==='pdf'?'PDF_FAILED':e.channel==='email'?'EMAIL_FAILED':e.channel==='report'?'REPORT_FAILED':'WEBHOOK_REJECTED';
 await db.query('INSERT INTO operations_events(id,channel,outcome,code,reading_id,order_id,transaction_id,job_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[randomUUID(),e.channel,e.outcome,code,uuid(e.readingId),uuid(e.orderId),e.transactionId&&/^sepay:test:(?:api:)?[a-f0-9-]{1,80}$/i.test(e.transactionId)?e.transactionId:null,uuid(e.jobId)]);
}
/** Payment delivery must not be undone just because observation storage is temporarily unavailable. */
export async function observeOperation(e:OperationEvent){try{await recordOperation(e);}catch{console.warn(JSON.stringify({event:'operations_record_failed',channel:e.channel}));}}
