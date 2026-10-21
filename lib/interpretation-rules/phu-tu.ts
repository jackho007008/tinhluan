import raw from './phu-tu-content.json';
import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {familyAssessment,type FamilyAssessment} from './phu-huynh';
import {PRINCIPAL_STARS} from '../tuvi-engine/chart-integrity';
import {ruleSchema} from './schema';
export type KinBranch={id:string;palace:string;stars:string[];branches:string[];text:string;page:number;section:string;mode:string;gender:string|null;limit:string;excerpt:string;stateMethod:string};
export const kinBranches:KinBranch[]=raw;
export const kinKey=(r:KinBranch)=>(r.palace==='Phu Thê'?'spouse-':'children-')+r.id;
export const kinCondition=(r:KinBranch)=>r.stars.join('–')+(r.mode==='exact'?(r.stars.length===1?' đơn thủ ':' đồng cung '):r.mode==='all-present'?' đồng cung ':r.mode==='ring'?' thuộc vòng Tràng Sinh tại ':' tại ')+r.palace+(r.branches.length?' ở '+r.branches.join('/'):'')+(r.gender?' (hồ sơ '+(r.gender==='male'?'nam':'nữ')+')':'');
// Reuse the certified major/minor/mutagen contract. No natal computation or inferred metadata.
export function kinAssessment(s:ChartSnapshot,r:KinBranch):FamilyAssessment{
 const assess=(stars:string[],mode:string)=>familyAssessment(s,{...r,stars,mode,wealth:false});
 const ringField=['Thái Tuế','Tang Môn'].includes(r.stars[0])?'suiqian12':r.stars[0]==='Phục Binh'?'boshi12':null;
 const a=ringField?(()=>{
  const check=assess([], 'presence');if(check.value===undefined)return check;
  const cycle=ringField==='suiqian12'?['Thái Tuế','Thiếu Dương','Tang Môn','Thiếu Âm','Quan Phù','Tử Phù','Tuế Phá','Long Đức','Bạch Hổ','Phúc Đức','Điếu Khách','Trực Phù']:['Bác Sỹ','Lực Sỹ','Thanh Long','Tiểu Hao','Tướng Quân','Tấu Thư','Phi Liêm','Hỷ Thần','Bệnh Phù','Đại Hao','Phục Binh','Quan Phù'];
  const values=s.chart.palaces.map(p=>(p as typeof p & {boshi12?:string;suiqian12?:string})[ringField]);
  const i=s.chart.palaces.findIndex(p=>p.name===r.palace),paths=[...check.paths,...s.chart.palaces.map((_,j)=>`chart.palaces.${j}.${ringField}`)];
  if(!values.every(n=>cycle.includes(n||''))||new Set(values).size!==12)return {paths,cause:'missing-data' as const,text:'Vòng sao bản mệnh chưa đủ 12 vị trí hợp lệ; không suy thiếu trường là vắng sao.'};
  return {value:values[i]===r.stars[0],paths,text:'Đối chiếu vòng sao bản mệnh đã lưu, không dùng vòng sao lưu.'};
 })():r.mode==='all-present'?(()=>{
  const xs=r.stars.map(name=>assess([name],PRINCIPAL_STARS.includes(name)?'presence':'minor'));
  const paths=[...new Set(xs.flatMap(x=>x.paths))];
  if(xs.some(x=>x.value===false))return {value:false,text:'Thiếu ít nhất một sao bắt buộc đồng cung; không lấy sao chiếu thay thế.',paths};
  const missing=xs.find(x=>x.value===undefined);return missing?{...missing,paths}:{value:true,text:kinCondition(r),paths};
 })():assess(r.stars,r.mode);
 if(a.value===undefined)return a;
 if(r.gender&&a.value!==false){
  const gender=s.normalized.gender;const paths=[...a.paths,'normalized.gender'];
  if(!['male','female'].includes(gender))return {text:'Chưa có giới tính chuẩn hóa để chọn lời riêng nam/nữ của nguồn.',cause:'missing-data',paths};
  if(gender!==r.gender)return {value:false,text:'Không thuộc nhánh nam/nữ mà nguồn đang mô tả.',paths};
  a.paths=paths;
 }
 return a.value===true?{...a,text:kinCondition(r)+'. Sao ở chính cung, lớp bản mệnh; không mượn lời đối cung.'}:a;
}
export function kinFacts(s:ChartSnapshot):DerivedFact[]{return kinBranches.flatMap(r=>{const a=kinAssessment(s,r);return a.value===undefined?[]:[{id:'fact.'+kinKey(r),derivationId:kinKey(r),version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'engine-reported' as const,limitation:'tanbien-spouse-children-1.0.0; trạng thái none: đoạn nguồn dùng trực tiếp địa chi/sao; chưa tổng hợp liên cung.'}];});}
const scope=(r:KinBranch)=>r.palace==='Phu Thê'?'Chú giải cục bộ về quan hệ và hoàn cảnh theo sách; không xác nhận tình trạng hôn nhân, hành vi của người phối ngẫu hoặc kết quả chung. Chưa phối hợp Mệnh, Thân, Phúc Đức, Quan Lộc và Nô Bộc.':'Chú giải cục bộ theo sách, không xác nhận hoàn cảnh hay đặc điểm của một người con thực tế. Chưa phối hợp Phúc Đức, Mệnh và Thân.';
export const makeKinRule=(r:KinBranch)=>ruleSchema.parse({
 id:'tanbien.'+kinKey(r),version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.'+kinKey(r),'fact.source-position-available'],conditions:[{fact:'fact.'+kinKey(r),op:'eq',value:'yes'}],exceptions:[],claimTemplate:`Theo Tân Biên, với ${kinCondition(r)}, sách ${r.text}`,evidencePaths:['chart.palaces'],
 sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:`PDF/trang in ${r.page}, §${r.section}; toàn mục ${r.palace==='Phu Thê'?'14, PDF208–216':'13, PDF198–207'}. Định nghĩa tọa thủ/đơn thủ/đồng cung: PDF33 §2.6–2.8.`,accessedOn:'2026-10-13',rights:'pending',rightsNote:'Đối chiếu văn bản và ảnh; không phải phê duyệt chuyên môn.'}],conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:[scope(r),...(r.limit?[r.limit]:[])],presentation:{title:kinCondition(r),readingTheme:r.palace==='Phu Thê'?'spouse':'children',contentType:r.stars.length>1?'combination':'element-gloss',sourceConditions:[kinCondition(r)],projectScope:['tanbien-spouse-children-1.0.0; bảng trạng thái: none; điều kiện trực tiếp về sao/địa chi trong đoạn nguồn.','Đơn thủ dùng đúng một chính tinh; đồng cung không mở rộng thành hội chiếu. Bộ Thiên Tướng–Đào Hoa–Hồng Loan bắt buộc đủ ba vì tiêu đề nguồn ghi đồng cung.','Không thêm điều kiện vắng Tuần/Triệt. Chỉ giữ mệnh đề độc lập; phần sinh tử, số lượng, sinh sản, phẩm hạnh và khuyến nghị cưới/sinh không xuất thành nhận định.','Không suy tình trạng hôn nhân/con cái từ snapshot; không áp chỉ dẫn cho lần kết hôn tiếp theo hoặc điều kiện sớm/muộn chưa có dữ kiện.'],readerLimit:r.limit||scope(r),knownExceptions:['Không coi việc đoạn này không nêu ngoại lệ là chứng minh không có yếu tố điều chỉnh khác.'],unknownConditions:[r.palace==='Phu Thê'?'Chưa có phép phối hợp các cung liên quan và điều chỉnh sớm/muộn, lần kết hôn.':'Chưa có phép phối hợp Phúc Đức–Mệnh–Thân và mức độ tăng/giảm theo lời mở đầu.',...(r.limit?[r.limit]:[])],applicability:'Chú giải bản mệnh đúng cung, đủ sao, địa chi và giới tính nếu được quy định; giữ riêng các ý khác chiều.',sourceScope:r.palace+'; không luận vận, không xác nhận sự kiện hoặc người thân.'}
});
export const kinRules=kinBranches.map(makeKinRule);
