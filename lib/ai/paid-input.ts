import type {InternalReading} from '../internal-review/reading-store';
import {PAID_EDITION,PAID_PALACES} from './paid-contract';
import {paidFacts} from './paid-facts';
import {paidKnowledge} from './paid-retrieval';
export function paidInput(record:InternalReading,palace:string){
 if(!PAID_PALACES.includes(palace as any))throw Error('AI_PAID_TARGET_INVALID');
 const input=paidFacts(record,palace);input.paidTarget={palace,edition:PAID_EDITION};
 if(record.frozen.customerReport?.snapshotId!==record.snapshot.resultId)throw Error('AI_UNVERIFIED_SNAPSHOT');
 input.knowledge=paidKnowledge(record,palace).items;input.knowledgeVersion='paid-retrieval-1.1.0';
 if(!input.knowledge.some(k=>k.application==='direct'))input.missing.push('Chưa có luận điểm áp trực tiếp cung này; dùng phần nguồn có thật, không bịa phần thiếu.');
 return input;
}
