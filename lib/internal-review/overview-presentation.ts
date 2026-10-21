import type { ChartSnapshot } from '../tuvi-engine';
import { palaceLocation, palaceStars } from './tanbien-presentation';
/** Frozen presentation only. Never infer a subject or assessment from an empty claim array. */
const subjects: Record<string,string[]> = {
 'life-elements':['Mệnh'],'life-body':['Mệnh'],structure:['Mệnh'],action:['Mệnh'],learning:['Mệnh'],
 work:['Quan Lộc'],finance:['Tài Bạch'],phuc:['Phúc Đức'],di:['Thiên Di'],no:['Nô Bộc'],dien:['Điền Trạch'],parents:['Phụ Mẫu'],siblings:['Huynh Đệ'],spouse:['Phu Thê'],children:['Tử Nữ'],
};
export function overviewPresentation(snapshot:ChartSnapshot, sections:readonly {id:string;title:string;claims:readonly {rules:readonly {id:string}[]}[]}[], verified:boolean){
 return {version:'overview-presentation-1.0.0', factorNotice:'Các mục dưới đây là dữ kiện minh họa được chọn để đối chiếu, không phải danh sách đầy đủ các yếu tố chưa được xét. Có mặt, đã tham gia điều kiện, có lời riêng và đã được phối hợp là những trạng thái khác nhau; danh sách này không xác định thay các trạng thái đó.',topics:sections.map(s=>{
 const names=[...(subjects[s.id]||[])];
 if(s.id==='life-body'){const body=snapshot.chart.palaces.filter(p=>p.isBodyPalace);if(body.length===1&&!names.includes(body[0].name))names.push(body[0].name);}
 // Existing Mệnh–Bào–Nô claims explicitly concern these three palaces, not a default Mệnh binding.
 if(s.claims.some(c=>c.rules.some(r=>r.id.startsWith('tanbien.no-tl-'))))for(const n of ['Mệnh','Huynh Đệ','Nô Bộc'])if(!names.includes(n))names.push(n);
 return {id:s.id,title:s.title,subjects:names,kind:names.length>1?'multi-palace':'palace',facts:names.flatMap(n=>[palaceLocation(snapshot,n),verified?readMajor(snapshot,n):{kind:'snapshot' as const,text:`Chưa xác minh độ đầy đủ danh sách chính tinh tại ${n}.`,paths:[]}]),unknownSubject:names.length===0};
 })};
}

function readMajor(snapshot:ChartSnapshot,name:string){
 const fact=palaceStars(snapshot,name);
 return {...fact,text:fact.text===`Danh sách chính tinh tại ${name} được ghi rỗng.`?`${name} không có chính tinh tọa thủ.`:fact.text};
}
