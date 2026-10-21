import type { ChartSnapshot, Palace } from './tuvi-engine';
export const CUSTOMER_INFO_VERSION = 'customer-info-1.0.3';
// Tân Biên: printed/PDF pp24 (11.1), 25–26 (polarity), 31 (1.4–1.5).
const branches=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const elements=['Kim','Thủy','Mộc','Hỏa','Thổ'] as const;
export function elementRelation(menh:string|undefined,cuc:string|undefined) {
 const m=elements.indexOf(menh as typeof elements[number]),c=elements.indexOf(cuc as typeof elements[number]);
 if(m<0||c<0)return undefined;
 if(m===c)return 'Mệnh và Cục đồng hành';
 if((m+1)%5===c)return 'Mệnh sinh Cục';
 if((c+1)%5===m)return 'Cục sinh Mệnh';
 if((m+2)%5===c)return 'Mệnh khắc Cục';
 return 'Cục khắc Bản Mệnh';
}
export function polarityRelation(yearBranch:string|undefined,lifeBranch:string|undefined) {
 const y=branches.indexOf(yearBranch||''),m=branches.indexOf(lifeBranch||'');
 return y<0||m<0?undefined:y%2===m%2?'Âm dương thuận lý':'Âm dương nghịch lý';
}
export function majorStatus(s:ChartSnapshot,p:Palace) {
 if(!Array.isArray(p.majorStars))return 'Chưa có dữ liệu chính tinh.';
 if(p.majorStars.length)return undefined;
 return s.chart.tanBien?.completeness.majorStars==='complete'?'Cung này không có chính tinh.':'Chưa xác nhận danh sách chính tinh đầy đủ.';
}
export type CustomerInfoRow={label:string;value:string;secondary?:string};
export function customerInfo(s:ChartSnapshot):CustomerInfoRow[] {
 const a=s.chart,n=s.normalized,t=a.tanBien;
 const viewing=t&&'viewing' in t?t.viewing:undefined;
 const birth=t&&'birthElement' in t?t.birthElement?.value:undefined;
 const life=a.palaces.filter(p=>p.name==='Mệnh');
 const y=branches.indexOf(t?.inputs.yearBranch||'');
 const polarity=y<0?undefined:y%2?'Âm':'Dương';
 const hour=n.hour===null||n.minute===null?undefined:`${String(n.hour).padStart(2,'0')}:${String(n.minute).padStart(2,'0')}`;
 const hourBranch=n.hour===null?undefined:branches[Math.floor((n.hour+1)/2)%12];
 const lunar=a.lunar;
 return [
  {label:'Họ tên',value:n.name?.trim()||'Chưa ghi họ tên'},
  {label:'Dương lịch',value:/^\d{4}-\d{2}-\d{2}$/.test(a.solarDate)?a.solarDate.split('-').reverse().join('/'):'Chưa có dữ liệu'},
  {label:'Âm lịch',value:lunar?`${lunar.lunarDay}/${lunar.lunarMonth}/${lunar.lunarYear}${lunar.isLeap?' (nhuận)':''}`:'Chưa có dữ liệu',secondary:t?`${t.inputs.yearStem} ${t.inputs.yearBranch}`:undefined},
  {label:'Giờ sinh',value:hour&&hourBranch?`${hour} — Giờ ${hourBranch}`:'Chưa xác định',secondary:hour?a.timeRange:undefined},
  ...(viewing?[{label:'Năm xem',value:`${viewing.year} — ${viewing.canChi}`,secondary:`${viewing.age} tuổi mụ`}]:[]),
  {label:'Âm Dương',value:polarity?`${polarity} ${n.gender==='male'?'Nam':'Nữ'}`:'Chưa có dữ liệu',secondary:polarityRelation(t?.inputs.yearBranch,life.length===1?life[0].earthlyBranch:undefined)},
  {label:'Mệnh',value:birth||'Chưa lưu dữ liệu'},
  {label:'Cục',value:a.fiveElementsClass||'Chưa lưu dữ liệu',secondary:elementRelation(birth?.split(' ').at(-1),a.fiveElementsClass?.split(' ')[0])},
  {label:'Mệnh chủ',value:a.soul||'Chưa lưu dữ liệu'},
  {label:'Thân chủ',value:a.body||'Chưa lưu dữ liệu'},
 ];
}
