import {VTTL_PHUC_LIEM_SAT,VTTL_PHUC_LIEM_SAT_FACT,vttlPhucLiemSatAssessment} from '../interpretation-rules/vttl-phuc-liem-sat';
import {NPL_PHU326,NPL_PHU326_FACT,nplPhu326Assessment} from '../interpretation-rules/npl-spouse-vcd-lonely';
import {VTTL_NO_LUONG,VTTL_NO_LUONG_FACT,vttlNoLuongAssessment} from '../interpretation-rules/vttl-no-luong';
import {NPL_DIEN_SINGLE_IDS,nplDienSingleBranches,nplDienSingleAssessment} from '../interpretation-rules/npl-dien-single-void';
import {VTTL_CAREER_CO_AM,VTTL_CAREER_CO_AM_FACT,vttlCareerCoAmAssessment} from '../interpretation-rules/vttl-career-co-am';
import {VTTL_DIEN_PHU,VTTL_DIEN_PHU_FACT,vttlDienPhuAssessment} from '../interpretation-rules/vttl-dien-phu';
import {TRUNGCHAU_RULE_IDS} from '../interpretation-rules/trungchau-natal';
import {completionBranches,completionAssessment} from '../interpretation-rules/natal-completion';
import {voidBranches,voidAssessment} from '../interpretation-rules/void-palace';
import type {ChartSnapshot} from '../tuvi-engine';
import type {buildTanBienReading} from './tanbien-reading';
import {subjectOf} from '../exploration/model';
import {noDienBranches,noDienKey,noDienAssessment} from '../interpretation-rules/no-dien';
import {familyBranches,familyKey,familyAssessment} from '../interpretation-rules/phu-huynh';
type Reading=ReturnType<typeof buildTanBienReading>;
export function reportGap(s:ChartSnapshot,r:Reading,name:string,complete:boolean,hasClaims:boolean){
 // Keep legacy no-match diagnostics stable, while retaining new unknown/held-source reasons.
 const vttlUnknown=r.execution.traces.some(t=>t.ruleId===VTTL_DIEN_PHU&&t.status==='missing-facts');
 const careerVttlUnknown=r.execution.traces.some(t=>t.ruleId===VTTL_CAREER_CO_AM&&t.status==='missing-facts');
 const noLuongUnknown=r.execution.traces.some(t=>t.ruleId===VTTL_NO_LUONG&&t.status==='missing-facts');
 const phu326Unknown=r.execution.traces.some(t=>t.ruleId===NPL_PHU326&&t.status==='missing-facts');
 const phucLiemSatUnknown=r.execution.traces.some(t=>t.ruleId===VTTL_PHUC_LIEM_SAT&&t.status==='missing-facts');
 const nplUnknown=NPL_DIEN_SINGLE_IDS.filter(id=>r.execution.traces.some(t=>t.ruleId===id&&t.status==='missing-facts'));
 const rules=r.execution.rules.filter(x=>!TRUNGCHAU_RULE_IDS.includes(x.id)&&(x.id!==VTTL_PHUC_LIEM_SAT||phucLiemSatUnknown)&&(x.id!==NPL_PHU326||phu326Unknown)&&(x.id!==VTTL_NO_LUONG||noLuongUnknown)&&(!NPL_DIEN_SINGLE_IDS.includes(x.id)||nplUnknown.includes(x.id))&&(x.id!==VTTL_DIEN_PHU||vttlUnknown)&&(x.id!==VTTL_CAREER_CO_AM||careerVttlUnknown)&&subjectOf({factIds:x.requiredFacts})===name);
 const traces=r.execution.traces.filter(t=>rules.some(x=>x.id===t.ruleId));
 // Reuse the exact assessment behind a missing fact, only when execution recorded it missing.
 const reasons=traces.filter(t=>t.status==='missing-facts').flatMap(t=>t.details.map(id=>{
  if(id===VTTL_PHUC_LIEM_SAT_FACT){const a=vttlPhucLiemSatAssessment(s);return {ruleId:t.ruleId,factId:id,cause:a.cause,text:a.reason,paths:a.paths};}
  if(id===NPL_PHU326_FACT){const a=nplPhu326Assessment(s);return {ruleId:t.ruleId,factId:id,cause:a.cause,text:a.reason,paths:a.paths};}
  if(id===VTTL_NO_LUONG_FACT){const a=vttlNoLuongAssessment(s);return {ruleId:t.ruleId,factId:id,cause:a.cause,text:a.reason,paths:a.paths};}
  if(nplDienSingleBranches.some(b=>b.fact===id)){const a=nplDienSingleAssessment(s);return {ruleId:t.ruleId,factId:id,cause:a.cause,text:a.reason,paths:a.paths};}
  if(id===VTTL_CAREER_CO_AM_FACT){const a=vttlCareerCoAmAssessment(s);return {ruleId:t.ruleId,factId:id,cause:a.cause,text:a.reason,paths:a.paths};}
  if(id===VTTL_DIEN_PHU_FACT){const a=vttlDienPhuAssessment(s);return {ruleId:t.ruleId,factId:id,cause:a.cause,text:a.reason,paths:a.paths};}
  const nd=noDienBranches.find(x=>'fact.'+noDienKey(x)===id),fa=familyBranches.find(x=>'fact.'+familyKey(x)===id);
  const vb=voidBranches.find(x=>'fact.'+x.key===id);
  const cb=completionBranches.find(x=>'fact.'+x.id===id);
  const a=cb?completionAssessment(s,cb):vb?voidAssessment(s,vb):nd?noDienAssessment(s,nd):fa?familyAssessment(s,fa):undefined;
  return {ruleId:t.ruleId,factId:id,cause:a?.value===undefined?a?.cause:undefined,text:a?.value===undefined?a?.text:undefined,paths:a?.paths||[]};
 }));
 let kind:string,text:string;
 if(name==='Tật Ách'){kind='product-scope';text='Phần này chỉ trình bày dữ kiện; không đánh giá sức khỏe.';}
 else if(!complete){kind='missing-data';text='Dữ kiện cần thiết chưa được xác nhận đầy đủ.';}
 else if(name==='Điền Trạch'&&r.sections.some(s=>s.paragraphs.some(p=>p.claim.rules.some(q=>q.id==='tanbien.dien-void-co-cu')))){kind='partial-adjustment';text='Đã có chú giải riêng về Tuần/Triệt và nhà đất; lời nền chưa được hợp nhất với các yếu tố còn lại.';}
 else if(reasons.some(x=>x.cause==='unresolved-adjustment')){kind='unresolved-adjustment';const tri=reasons.some(x=>x.cause==='unresolved-adjustment'&&x.text?.startsWith('Triệt Lộ trực tiếp'));text=tri?'Có lời nền nhưng chưa xuất vì Triệt trực tiếp; phép điều chỉnh chưa được đặc tả.':'Có lời nền nhưng chưa xuất vì cách điều chỉnh hoặc ngoại lệ chưa được đặc tả.';}
 else if(reasons.some(x=>x.cause==='missing-data')){kind='missing-data';text='Một số nhánh còn thiếu dữ kiện cần thiết để xác định điều kiện.';}
 else if(reasons.length){kind='undetermined';text='Một số điều kiện chưa xác định; chưa ghi nhận đủ lý do để nêu nguyên nhân cụ thể.';}
 else if(!hasClaims&&traces.length&&traces.every(t=>t.status==='condition-false')){kind='no-implemented-match';text='Các nhánh đã triển khai không khớp điều kiện của cung này.';}
 else if(!hasClaims){kind='undetermined';text='Chưa có nhận định được xuất; chưa xác định được nguyên nhân cụ thể từ dữ liệu đã lưu.';}
 else return null;
 return {kind,text,reasons,traces,ruleIds:rules.map(x=>x.id),explanation:kind==='no-implemented-match'?'Kết quả thực thi các nhánh đã có đều không khớp. Điều này không có nghĩa tài liệu không nói về cấu trúc này.':kind==='product-scope'?'Các diễn giải bệnh tật, sinh tử và sức khỏe thực tế nằm ngoài phạm vi bản đọc. Không dùng lời bị loại làm nhận định.':'Lý do chi tiết được lấy từ điều kiện thực thi và bộ kiểm tra dữ kiện hiện có, không suy từ số nhận định.'};
}
export function readerHeading(title:string,name:string,branch:string|null){
 let t=title.replace(/^R\d+\s*·\s*/,'');
 if(!branch)return t;
 // Only a range explicitly attached to this palace is localized. Other palace/exception ranges remain intact.
 const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const re=new RegExp('(?:tọa thủ |đơn thủ |đồng cung |tại )?'+escaped+' tại ((?:Tý|Sửu|Dần|Mão|Thìn|Tỵ|Ngọ|Mùi|Thân|Dậu|Tuất|Hợi)(?:/(?:Tý|Sửu|Dần|Mão|Thìn|Tỵ|Ngọ|Mùi|Thân|Dậu|Tuất|Hợi))*)');
 return t.replace(re,(all,range:string)=>range.split('/').includes(branch)?'tại '+name+' ở '+branch:all);
}
export function readerPlace(place:string|undefined){return !place?.trim()||/^(không ghi|không có|chưa có|chưa ghi|không rõ)/i.test(place.trim())?'Chưa có thông tin nơi sinh':place;}
