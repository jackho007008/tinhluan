import {birthSchema} from '../calendar';
import {lunarToSolar} from '../calendar/vietnamese.cjs';
import {BIRTH_HOURS,customerBirthSchema,type CustomerInputReceipt} from '../customer-birth';
/** Input adaptation only: no changes to calendar, day boundary or star placement. */
export function prepareCustomerBirth(input:unknown){
 const entered=customerBirthSchema.parse(input),slot=BIRTH_HOURS[entered.hourIndex];
 if(entered.calendar==='solar'&&entered.isLeap)throw Error('INVALID_LEAP');
 const date=entered.calendar==='lunar'?lunarToSolar({year:entered.year,month:entered.month,day:entered.day,isLeap:entered.isLeap}):`${entered.year}-${String(entered.month).padStart(2,'0')}-${String(entered.day).padStart(2,'0')}`;
 const birth=birthSchema.parse({name:entered.name,date,hour:slot.hour,minute:0,unknownTime:false,place:entered.place??'Chưa có thông tin nơi sinh',gender:entered.gender,calendar:'solar',profile:'tanbien-vn-trial-v2',timezone:'Asia/Ho_Chi_Minh',
 // Legacy engine input contract, not a claim that the visitor checked an acknowledgement.
 // The persisted receipt below explicitly records the owner-authorized UI without checkbox.
 consent:true});
 const receipt:CustomerInputReceipt={version:'customer-input-1.0.0',entered,timeLabel:`Giờ ${slot.branch} (${slot.range})`,precision:'branch-interval',representativeTime:`${String(slot.hour).padStart(2,'0')}:00`,noticeMode:'owner-authorized-internal-no-checkbox'};
 return {birth,receipt};
}
