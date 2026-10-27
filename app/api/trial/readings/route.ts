import {captureAiPolicy,requestMenh,aiEligible} from '@/lib/ai/store';
import {linkCreatedReading} from '@/lib/customer-auth/accounts';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {captureReadingPolicy} from '@/lib/trial/reading-policy';
import type {NextRequest} from 'next/server';
import {validateBirthForm} from '@/lib/customer-form';
import {rateLimit} from '@/lib/db';
import {prepareCustomerBirth} from '@/lib/internal-review/customer-input';
import {calculateInternal,freezeReading} from '@/lib/internal-review/dynamic-reading';
import {validReadingId} from '@/lib/internal-review/reading-store';
import {trialOwner,TRIAL_COOKIE,getTrialReading,saveTrialReading,listTrialReadings} from '@/lib/trial/store';
import {trialPostGuard,trialBody,trialJson,trialError} from '@/lib/trial/http';
export const runtime='nodejs';
let active=0;
const ownersInFlight=new Set<string>();
export async function POST(req:NextRequest){
 const blocked=trialPostGuard(req);if(blocked)return blocked;
 if(active>=2)return trialJson({error:'Đang có nhiều người tạo báo cáo. Vui lòng thử lại sau.'},429);
 active++;let lockedOwner:string|undefined;
 try{
  const owner=await trialOwner(req.cookies.get(TRIAL_COOKIE)?.value);
  if(!owner)return trialJson({error:'Phiên dùng thử đã hết hạn. Vui lòng thử tạo lại để mở phiên mới.'},401);
  const body=await trialBody(req);
  if(!body||!validReadingId(body.id)||Object.keys(body).some(k=>!['id','customerInput'].includes(k)))return trialJson({error:'Yêu cầu không hợp lệ.'},400);
  const checked=validateBirthForm(body.customerInput);
  if(!checked.input)return trialJson({error:'Kiểm tra các trường được đánh dấu.',fieldErrors:checked.errors},400);
  let adapted:ReturnType<typeof prepareCustomerBirth>;
  try{adapted=prepareCustomerBirth(body.customerInput);}catch{return trialJson({error:'Kiểm tra lại ngày sinh và tháng nhuận.',fieldErrors:{birthDate:'Ngày hoặc tháng nhuận không hợp lệ trong lịch đã chọn. Phạm vi hỗ trợ 1976–2050.'}},400);}
  const old=await getTrialReading(owner,body.id);
  if(old){if(JSON.stringify(old.inputReceipt)!==JSON.stringify(adapted.receipt))return trialJson({error:'Yêu cầu đã dùng cho thông tin khác.'},409);await linkCreatedReading(req.cookies.get(CUSTOMER_COOKIE)?.value,req.cookies.get(TRIAL_COOKIE)?.value,old.id);if(aiEligible(old))try{await requestMenh(old);}catch{console.error('AI_MENH_ENQUEUE_PENDING');}return trialJson({id:old.id});}
  if(ownersInFlight.has(owner.hash))return trialJson({error:'Phiên này đang tạo báo cáo. Vui lòng chờ rồi thử lại.'},429);
  ownersInFlight.add(owner.hash);lockedOwner=owner.hash;
  await rateLimit('free-trial:owner:'+owner.hash,5);
  await rateLimit('free-trial:global',60);
  if((await listTrialReadings(owner)).length>=20)return trialJson({error:'Phiên dùng thử đã có 20 báo cáo. Bạn vẫn có thể mở lại các bản đã lưu.'},429);
  const {snapshot,receipt}=await calculateInternal(adapted.birth);const frozen=freezeReading(snapshot,receipt);
  if(!frozen.customerReport)throw Error('MISSING_REPORT');
  const b=adapted.birth;frozen.customerReport.birth=`${b.date.split('-').reverse().join('/')} · Dương lịch · ${adapted.receipt.timeLabel} · ${b.gender==='male'?'Nam':'Nữ'} · ${b.place} · ${b.timezone}`;
  const aiPolicy=captureAiPolicy();
  const record={id:body.id,createdAt:new Date().toISOString(),snapshot,receipt,frozen,inputReceipt:adapted.receipt,...(aiPolicy?{aiPolicy}:{})};
  const savedRecord={...record,accessPolicy:captureReadingPolicy(record)};
  await saveTrialReading(owner,savedRecord);
  await linkCreatedReading(req.cookies.get(CUSTOMER_COOKIE)?.value,req.cookies.get(TRIAL_COOKIE)?.value,body.id);
  if(aiEligible(savedRecord))try{await requestMenh(savedRecord);}catch{console.error('AI_MENH_ENQUEUE_PENDING');}
  return trialJson({id:body.id});
 }catch(e){return trialError(e);}finally{if(lockedOwner)ownersInFlight.delete(lockedOwner);active--;}
}
