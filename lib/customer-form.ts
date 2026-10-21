import {customerBirthSchema,type CustomerBirthInput} from './customer-birth';
import {civilDateExists} from './calendar';
export type BirthFieldErrors=Partial<Record<keyof CustomerBirthInput|'birthDate',string>>;
const labels:BirthFieldErrors={name:'Tên hiển thị không quá 80 ký tự.',day:'Chọn ngày sinh.',month:'Chọn tháng sinh.',year:'Nhập năm từ 1976 đến 2050.',hourIndex:'Chọn khung giờ sinh.',gender:'Chọn giới tính.',calendar:'Chọn loại lịch.',isLeap:'Kiểm tra tháng nhuận.'};
export function readBirthForm(f:FormData,calendar:string){
 const hour=f.get('hour');
 return {name:String(f.get('name')||''),day:Number(f.get('day')),month:Number(f.get('month')),year:Number(f.get('year')),calendar,isLeap:calendar==='lunar'&&f.get('leap')==='on',hourIndex:hour===null||hour===''?-1:Number(hour),gender:String(f.get('gender'))};
}
/** UI feedback only; the existing server adapter remains authoritative for lunar dates. */
export function validateBirthForm(input:unknown):{input:CustomerBirthInput;errors:null}|{input:null;errors:BirthFieldErrors}{
 const result=customerBirthSchema.safeParse(input);
 if(!result.success){const errors:BirthFieldErrors={};for(const issue of result.error.issues){const key=issue.path[0] as keyof CustomerBirthInput;errors[key]=labels[key]||'Kiểm tra lại thông tin này.';}return {input:null,errors};}
 const v=result.data;
 if(v.calendar==='solar'&&!civilDateExists(`${v.year}-${String(v.month).padStart(2,'0')}-${String(v.day).padStart(2,'0')}`))return {input:null,errors:{birthDate:'Ngày này không tồn tại. Kiểm tra lại ngày, tháng và năm sinh.'}};
 return {input:v,errors:null};
}
/** Same input retries with the same ID; successful navigation stays locked against repeat submits. */
export function birthSubmission(){
 let key='',id='',pending=false;
 return {get pending(){return pending;},async run(input:CustomerBirthInput,send:(id:string)=>Promise<void>){
  if(pending)return;
  const next=JSON.stringify(input);if(next!==key){key=next;id=crypto.randomUUID();}
  pending=true;
  try{await send(id);}catch(e){pending=false;throw e;}
 }};
}
