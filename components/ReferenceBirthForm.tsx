'use client';
import {Alert,FormField,Segmented} from './co-thu/primitives';
import {useState,useRef,useEffect} from 'react';
import {BIRTH_HOURS,customerBirthSchema,type CustomerBirthInput} from '@/lib/customer-birth';
import {birthSubmission,readBirthForm,validateBirthForm,type BirthFieldErrors} from '@/lib/customer-form';
export default function ReferenceBirthForm({publicTrial=false,initialInput,emailRecovery=false,accountSignedIn=false,embedded=false}:{embedded?:boolean;publicTrial?:boolean;emailRecovery?:boolean;accountSignedIn?:boolean;initialInput?:CustomerBirthInput}){
 const request=useRef(birthSubmission());
 const heading=useRef<HTMLHeadingElement>(null), form=useRef<HTMLFormElement>(null);
 const [ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 const [confirmed,setConfirmed]=useState<CustomerBirthInput|null>(null);
 useEffect(()=>{if(confirmed)heading.current?.focus();},[confirmed]);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[calendar,setCalendar]=useState(initialInput?.calendar||'solar');
 const [fields,setFields]=useState<BirthFieldErrors>({});
 const invalid=(key:keyof BirthFieldErrors)=>({'aria-invalid':Boolean(fields[key]),'aria-describedby':fields[key]?`error-${key}`:undefined});
 const fieldError=(key:keyof BirthFieldErrors)=>fields[key]?<p className="field-error" id={`error-${key}`}>{fields[key]}</p>:null;
 function focusError(){requestAnimationFrame(()=>form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());}
 function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(request.current.pending)return;const f=new FormData(e.currentTarget);
  const input=readBirthForm(f,calendar);
  if(publicTrial){const result=validateBirthForm(input);setFields(result.errors||{});setError('');if(!result.input){focusError();return;}void create(result.input);return;}
  const parsed=customerBirthSchema.safeParse(input);
  if(!parsed.success){setError('Vui lòng điền đủ ngày, tháng, năm, khung giờ (1976–2050).');return;}
  setError('');setConfirmed(parsed.data);
 }
 async function create(input:CustomerBirthInput){
  try{await request.current.run(input,async id=>{
   setBusy(true);setError('');
   if(publicTrial){const session=await fetch('/api/trial/session',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!session.ok){const result=await session.json();throw Error(result.error||'Chưa mở được phiên dùng thử. Vui lòng thử lại.');}}
   const res=await fetch(publicTrial?'/api/trial/readings':'/api/internal-readings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,customerInput:input})});
   const data=await res.json();if(!res.ok){if(publicTrial&&data.fieldErrors){setFields(data.fieldErrors);focusError();}throw Error(data.error||'Chưa lập được lá số.');}
   window.location.assign((publicTrial?'/ban-doc?id=':'/internal/readings?id=')+encodeURIComponent(data.id)+'&mode=basic'+(publicTrial?'':'&experience=1'));
  });}catch(e){setError(e instanceof TypeError?'Chưa kết nối được. Thông tin vẫn được giữ, bạn có thể thử lại.':e instanceof Error?e.message:'Chưa kết nối được. Vui lòng thử lại.');setBusy(false);}
 }
 const errorLabels:Record<string,string>={name:'Tên hiển thị',day:'Ngày sinh',month:'Tháng sinh',year:'Năm sinh',birthDate:'Ngày sinh',hourIndex:'Giờ sinh',calendar:'Loại lịch',gender:'Giới tính',isLeap:'Tháng nhuận'};
 const genderField=<fieldset className="field"><legend>Giới tính</legend><Segmented style={{margin:0}}><label><input id="birth-gender" name="gender" type="radio" value="male" defaultChecked={initialInput?.gender!=='female'}/><span>Nam</span></label><label><input name="gender" type="radio" value="female" defaultChecked={initialInput?.gender==='female'}/><span>Nữ</span></label></Segmented>{fieldError('gender')}</fieldset>;
 const calendarOptions=<Segmented><label><input id="birth-calendar" type="radio" name="calendar" value="solar" checked={calendar==='solar'} onChange={()=>setCalendar('solar')}/><span>Dương lịch</span></label><label><input type="radio" name="calendar" value="lunar" checked={calendar==='lunar'} onChange={()=>setCalendar('lunar')}/><span>Âm lịch</span></label></Segmented>;
 const problems=Object.keys(fields);
 return <div className="input-wrap" data-birth-form={publicTrial?'trial':undefined}><section className="card">
 {publicTrial ? (embedded?<h2>Thông tin lá số</h2>:<h1>Lập lá số</h1>) : <div className="intro"><span className="mini-seal">TỬ<br/>VI</span><div><h1 ref={heading} tabIndex={-1}>{confirmed?'Xác nhận thông tin':'Lập lá số'}</h1><p>{confirmed?'Kiểm tra trước khi tạo bản đọc':'Thông tin sinh của bạn'}</p></div></div>}
 {publicTrial && problems.length>0 && <Alert tone="danger" title={`Còn ${problems.length} mục cần sửa`}><div className="birth-error-links">{problems.map(key=><a key={key} href={key==='name'?'#name':key==='hourIndex'?'#hour':'#birth-'+key}>{errorLabels[key]||'Thông tin sinh'}</a>)}</div></Alert>}
 <form ref={form} method="post" onSubmit={submit} noValidate={publicTrial} hidden={Boolean(confirmed)} aria-busy={busy}><fieldset disabled={busy||(publicTrial&&!ready)}>
 <FormField id="name" label="Tên hiển thị" message={fieldError('name')}><input id="name" name="name" defaultValue={initialInput?.name||''} placeholder="Tên hoặc cách xưng hô" maxLength={80} autoComplete="off" {...invalid('name')}/></FormField>
 {publicTrial && <div className="birth-choices">{genderField}<fieldset className="field"><legend>Loại lịch</legend>{calendarOptions}{fieldError('calendar')}</fieldset></div>}
 <fieldset className="field"><legend>Ngày tháng năm sinh</legend>{!publicTrial && calendarOptions}
 <div className="row"><div><select id={fields.birthDate?'birth-birthDate':'birth-day'} name="day" aria-label="Ngày sinh" defaultValue={initialInput?.day??''} required {...invalid(fields.birthDate?'birthDate':'day')}><option value="" disabled>Ngày</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>Ngày {i+1}</option>)}</select></div><div><select id="birth-month" name="month" aria-label="Tháng sinh" defaultValue={initialInput?.month??''} required {...invalid('month')}><option value="" disabled>Tháng</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>Tháng {i+1}</option>)}</select></div><div><input id="birth-year" name="year" aria-label="Năm sinh" type="number" min="1976" max="2050" placeholder="Năm" defaultValue={initialInput?.year??''} required {...invalid('year')}/></div></div>
 {fieldError('day')}{fieldError('month')}{fieldError('year')}{fieldError('birthDate')}{calendar==='lunar'&&<label className="leap-choice"><input id="birth-isLeap" type="checkbox" name="leap" defaultChecked={initialInput?.isLeap}/> Tháng nhuận</label>}{fieldError('isLeap')}</fieldset>
 <div className={publicTrial?"field":"row two field"}><div><label htmlFor="hour">Giờ sinh</label><select id="hour" name="hour" defaultValue={initialInput?.hourIndex??''} required {...invalid('hourIndex')}><option value="" disabled>Chọn khung giờ</option>{BIRTH_HOURS.map(h=><option key={h.index} value={h.index}>{h.branch} ({h.range})</option>)}</select>{fieldError('hourIndex')}</div>{!publicTrial && genderField}</div>
 <button className="button" type="submit" disabled={busy||(publicTrial&&!ready)}>{publicTrial?(busy?'Đang lập lá số…':'Lập lá số'):'Tiếp tục →'}</button><p className="hint" role="status">{publicTrial&&problems.length>0&&!busy?'Các thông tin khác bạn đã nhập vẫn được giữ.':publicTrial&&busy?'Đang tạo và lưu bản đọc của bạn.':'Nội dung tử vi mang tính tham khảo.'}</p>
 </fieldset></form>
 {confirmed&&<section className="birth-confirm" aria-label="Thông tin sẽ dùng để tạo báo cáo" aria-busy={busy}>
 <dl><div><dt>Tên hiển thị</dt><dd>{confirmed.name||'Hồ sơ bản mệnh'}</dd></div>
 <div><dt>Ngày sinh</dt><dd>{String(confirmed.day).padStart(2,'0')}/{String(confirmed.month).padStart(2,'0')}/{confirmed.year} · {confirmed.calendar==='solar'?'Dương lịch':'Âm lịch'}{confirmed.isLeap?' · Tháng nhuận':''}</dd></div>
 <div><dt>Giờ sinh</dt><dd>{BIRTH_HOURS[confirmed.hourIndex].branch} ({BIRTH_HOURS[confirmed.hourIndex].range})</dd></div>
 <div><dt>Giới tính</dt><dd>{confirmed.gender==='male'?'Nam':'Nữ'}</dd></div></dl>
 <div className="confirm-actions"><button type="button" className="button" disabled={busy} onClick={()=>void create(confirmed)}>{busy?'Đang tạo báo cáo…':error?'Thử tạo lại':'Xác nhận và tạo báo cáo'}</button>
 <button type="button" className="button quiet" disabled={busy} onClick={()=>{setConfirmed(null);setError('');requestAnimationFrame(()=>form.current?.querySelector<HTMLInputElement>('input')?.focus());}}>← Sửa thông tin</button></div>
 <p className="hint" role="status">{busy?'Đang lập lá số và lưu bài đọc của bạn.':'Báo cáo được tạo từ đúng thông tin đã xác nhận ở trên.'}</p>
 </section>}
 <p className="error" role="alert">{error}</p>{publicTrial&&<details className="birth-access"><summary>Lưu và mở lại bản đọc</summary><p className="hint">{accountSignedIn?'Bản mới tự lưu vào Lá số của tôi. Bạn có thể đăng nhập cùng tài khoản để mở lại trên thiết bị khác trong hạn quyền gốc.':'Bạn có thể mở lại báo cáo trong cùng trình duyệt trong 7 ngày.'} {!accountSignedIn&&(emailRecovery?'Đường dẫn riêng không thay thế quyền truy cập. Bạn có thể xác minh email trong trang bản đọc để mở lại trên thiết bị khác trong thời hạn này.':'Xóa cookie, đóng phiên ẩn danh hoặc đổi thiết bị sẽ không mở lại được bằng đường dẫn.')} Không cần dùng tên thật.</p></details>}</section><div className="input-extra"><span>{publicTrial?'Phiên riêng · tối đa 7 ngày':'Thông tin được lưu nội bộ'}</span><a href={publicTrial?(accountSignedIn?'/la-so-cua-toi':'/ban-doc'):'/internal/readings'}>Hồ sơ đã lưu →</a></div></div>;
}
