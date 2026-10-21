import {z} from 'zod';
/** Civil-time intervals used by the existing tanbien-vn-trial-v2 profile. */
export const BIRTH_HOURS = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'].map((branch,index)=>({
 index, branch, hour:index*2,
 range:index===0?'23:00–00:59':`${String(index*2-1).padStart(2,'0')}:00–${String(index*2).padStart(2,'0')}:59`,
}));
export const customerBirthSchema=z.object({
 name:z.string().trim().max(80).optional(),day:z.number().int().min(1).max(31),month:z.number().int().min(1).max(12),year:z.number().int().min(1976).max(2050),
 calendar:z.enum(['solar','lunar']),isLeap:z.boolean(),hourIndex:z.number().int().min(0).max(11),gender:z.enum(['male','female']),place:z.string().trim().min(2).max(120).optional(),
}).strict();
export type CustomerBirthInput=z.infer<typeof customerBirthSchema>;
export type CustomerInputReceipt={version:'customer-input-1.0.0';entered:CustomerBirthInput;timeLabel:string;precision:'branch-interval';representativeTime:string;noticeMode:'owner-authorized-internal-no-checkbox'};
