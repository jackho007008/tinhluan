import type {ChartSnapshot} from '../tuvi-engine';
import {bookState} from '../tuvi-engine/tanbien';
import {verifiedNatalTransformations} from '../tuvi-engine/natal-transformations';
import {sourceRelation} from '../internal-review/career-definitions';
import {financeVcdAssessment, financeVcdScaleRules, careerVcdScaleRules, financeVcdRules} from './finance-vcd';
import type {DerivedFact} from './derived';
import {ruleSchema} from './schema';

export const VCD_LIGHT_METHOD='tanbien-vcd-light-exceptions-1.0.0';
export const VCD_LIGHT_BRANCHES=[
 {key:'finance-scale',palace:'Tài Bạch',mode:'scale',text:'Tài Bạch không có chính tinh. Với cấu trúc này, lời luận đặt giới hạn “không thể giàu to lớn”, kể cả khi có nhiều sao tốt hội hợp. Nhận định này chỉ nói về quy mô tài lộc, không xác định thu nhập hay tài sản hiện có.'},
 {key:'career-scale',palace:'Quan Lộc',mode:'scale',text:'Quan Lộc không có chính tinh. Với cấu trúc này, công danh được mô tả là không thể hiển đạt, chức vị bình thường, dù có nhiều sao tốt phối chiếu. Đây là lời riêng về mức hiển đạt, không xác định nghề nghiệp hoặc chức vụ hiện có.'},
 {key:'finance-direct',palace:'Tài Bạch',mode:'direct',text:'Tài Bạch không có chính tinh và có Tuần hoặc Triệt án ngữ trực tiếp. Việc kiếm tiền được mô tả là khó khăn lúc đầu, về sau dễ dàng hơn, càng về già càng sung túc. Các vế nói về một diễn tiến, chưa xác định bạn đang ở giai đoạn nào.'},
 {key:'career-bright',palace:'Quan Lộc',mode:'bright',text:'Quan Lộc không có chính tinh, nhận Nhật–Nguyệt cùng sáng chiếu tới. Với cấu trúc này, công danh được mô tả là rực rỡ, uy quyền hiển hách. Đây là nhận định riêng về công danh, chưa xác định chức vụ hiện có.'},
] as const;
type Branch=(typeof VCD_LIGHT_BRANCHES)[number];
export const vcdLightId=(r:Branch)=>'tanbien.vcd-light-'+r.key;
export const vcdLightFactId=(r:Branch)=>'fact.vcd-light-'+r.key;

/** Additional source-backed subsets. Never relocates stars or rewrites legacy facts. */
export function vcdLightAssessment(s:ChartSnapshot,r:Branch){
 const palace=r.palace, legacy=financeVcdAssessment(s,r.mode==='direct'?'direct-void':'scale-limit',palace);
 const paths=[...legacy.paths],result=(value:boolean|undefined,text:string)=>({value,text,paths});
 if(legacy.cause==='missing-data')return result(undefined,legacy.text);
 const ps=s.chart.palaces,p=ps.find(p=>p.name===palace)!;
 if(p.majorStars.length)return result(false,palace+' có chính tinh; không thuộc VCD.');
 const ranges=s.chart.tanBien!.voidRanges!,direct=ranges.filter(v=>v.branches.includes(p.earthlyBranch));
 if(r.mode==='direct'?!direct.length:direct.length>0)return result(false,'Không khớp án ngữ trực tiếp tại cung nhận của tập con này.');
 // Existing source clauses win only for duplicate suppression, never a competing prediction.
 if(r.mode!=='bright'&&legacy.value===true)return result(false,'Nhánh VCD đã có xuất cùng ý; không lặp.');
 const lights=['Thái Dương','Thái Âm'].map(name=>{
  const i=ps.findIndex(q=>q.majorStars.some(st=>st.name===name)),q=ps[i];
  paths.push(`chart.palaces.${i}.earthlyBranch`);
  return {name,p:q,index:i,state:bookState(name,q.earthlyBranch)?.value,
   shines:sourceRelation(p.earthlyBranch,q.earthlyBranch,'hội hợp','xung chiếu')===true||sourceRelation(p.earthlyBranch,q.earthlyBranch,'hội hợp','tam hợp')===true,
   tt:ranges.filter(v=>v.branches.includes(q.earthlyBranch))};
 });
 const detail=lights.map(l=>`${l.name} tại ${l.p.name} ${l.p.earthlyBranch}: ${l.state??'chưa rõ'}, ${l.shines?'chiếu':'không tam/xung chiếu'} ${palace}; TT tại sao: ${l.tt.map(v=>v.name).join(', ')||'không'}`).join('; ');
 // Quan167 says chiếu. This short-circuit does not need any brightness resolution.
 if(r.key==='career-scale'&&lights.some(l=>!l.shines))return result(true,detail+'. Một sao không chiếu Quan: không thỏa ngoại lệ Nhật–Nguyệt cùng sáng chiếu Quan. KhôngTT tại Quan: giữ câu mức hiển đạt166–167.');
 if(lights.some(l=>!l.state))return result(undefined,detail+'. Thiếu ô nguồn; không dùng brightness engine.');
 const c=s.chart.tanBien!.completeness,fields=['majorStars','minorStars','adjectiveStars'] as const;
 if(c?.minorStars!=='complete-with-declared-supplements'||c?.adjectiveStars!=='complete-with-declared-supplements'||!verifiedNatalTransformations(s.chart)||ps.some(q=>fields.some(f=>!Array.isArray(q[f])||q[f].some(st=>(st as {scope?:string}).scope!=='origin'))))
  return result(undefined,detail+'. Thiếu chứng nhận phụ tinh/TứHóa bản mệnh để kiểm đúng các điều chỉnh ánh sáng.');
 paths.push('chart.natalTransformations','chart.tanBien.completeness');
 ps.forEach((_,i)=>fields.forEach(f=>paths.push(`chart.palaces.${i}.${f}`)));
 const vicinity=(branch:string)=>ps.filter(q=>sourceRelation(branch,q.earthlyBranch,'hội hợp')===true).flatMap(q=>fields.flatMap(f=>q[f]));
 const at=(l:(typeof lights)[number])=>fields.flatMap(f=>l.p[f]);
 // Only named, same-facet modifiers. This screen is conservative project scope,
 // not a claim that every “gặp” means hội hợp or that all other stars must be solved.
 const dark=lights.some(l=>{
  if(!['Miếu','Vượng'].includes(l.state!)||!l.tt.length)return false;
  const boosters=l.name==='Thái Dương'?['Đào Hoa','Hồng Loan','Thiên Hỷ','Hỏa Tinh','Linh Tinh']:['Đào Hoa','Hồng Loan','Thiên Hỷ'];
  return !vicinity(l.p.earthlyBranch).some(st=>boosters.includes(st.name))&&!at(l).some(st=>st.name==='Thiên Tài');
 });
 if(r.mode!=='bright'){
  if(dark)return result(true,detail+'. Có sao miếu/vượng bịTT tại chính chi sao làm mờ (35–36; toán tử đối chiếu124). Không gặp nhóm tăng sáng chưa phối hợp trong tập con dự án: đã loại điều kiện cùng sáng; không truyền TT qua chiếu. '+(r.mode==='direct'?'Giữ đủ diễn tiến kiếm tiền197.':'Giữ riêng câu giới hạn của cung nhận.'));
  return result(undefined,detail+'. Chưa loại ngoại lệ cùng sáng: Tài còn chữ hợp chiến; TT và các điều chỉnh ánh sáng khác chưa có phép phối hợp trong tập con.');
 }
 if(!lights.every(l=>l.shines&&l.state==='Đắc'&&l.tt.length===2)||lights[0].p!==lights[1].p||['Mệnh','Thân'].includes(lights[0].p.name)||lights[0].p.isBodyPalace)
  return result(undefined,detail+'. Ngoài tập con Quan nhận hai sao đồng cung đắc địa, cảhaiTT tại sao; không coi đây là điều kiện bắt buộc của sách.');
 const dimmers=['Thiên Diêu','Thiên Riêu','Đà La','Kình Dương','Địa Không','Địa Kiếp'];
 if(vicinity(lights[0].p.earthlyBranch).some(st=>dimmers.includes(st.name)||st.mutagen==='Kỵ'))return result(undefined,detail+'. Có yếu tố giảm vẻ sáng35–36: chưa chứng nhận cùng sáng sau phối hợp; không suy giảm bằng thành hãm.');
 return result(true,detail+'. Hai sao đắc địa theo33/35–36, Âm đắc cóTT tăng sáng; không áp câu miếu/vượng bịTT thànhmờ cho đắc địa. Đủ ngoại lệ chiếu Quan167 trong tập con dự án; không mượn lời đối cung hoặc mở nhánhTT tạiQuan.');
}
export function vcdLightFacts(s:ChartSnapshot):DerivedFact[]{return VCD_LIGHT_BRANCHES.flatMap(r=>{const a=vcdLightAssessment(s,r);return a.value===undefined?[]:[{id:vcdLightFactId(r),derivationId:VCD_LIGHT_METHOD,version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:[...new Set(a.paths)],status:'source-table' as const,limitation:'Tập con ngoại lệ theo đúng Tài/Quan; không tổng hợp toàn cung, không sửa hợp chiến hoặc mượn trạng thái chi nhận.'}];});}
export const vcdLightRules=VCD_LIGHT_BRANCHES.map(r=>{
 const base=r.palace==='Quan Lộc'?careerVcdScaleRules[0]:r.mode==='direct'?financeVcdRules[0]:financeVcdScaleRules[0];
 return ruleSchema.parse({...base,id:vcdLightId(r),version:'0.1.0',requiredFacts:[vcdLightFactId(r),r.palace==='Quan Lộc'?'fact.career-source-available':'fact.source-position-available'],conditions:[{fact:vcdLightFactId(r),op:'eq',value:'yes'}],claimTemplate:r.text,
  sourceReferences:base.sourceReferences.map(v=>({...v,location:(r.palace==='Quan Lộc'?'PDF166–167§8.45: mức hiển đạt và ngoại lệ Nhật–Nguyệt cùng sáng xung/hợp chiếu.':'PDF197§12.56: giới hạn quy mô/diễn tiến TT; giữ chữ hợp chiến chưa giải.')+' PDF18–19 tam/xung;33§2.10 và35–36 trạng thái tại chi thật/TT làm mờ miếu–vượng, Âm đắc tăng sáng. PDF124§5.1.1–2 đối chiếu cách viết Tuần HAY Triệt của cùng phép phân sáng/mờ, không nhập lời sinh tử. PDF46 ThiênTài chỉ đồng cung. Tập con và cổng dự án ghi trong presentation.',accessedOn:'2026-10-23'})),
  presentation:{...base.presentation,title:r.palace+' vô chính diệu — '+(r.mode==='bright'?'Nhật–Nguyệt chiếu':'ngoại lệ có phạm vi'),sourceConditions:[r.palace+' không có chính tinh.',r.mode==='bright'?'Nhật–Nguyệt cùng sáng, mỗi sao ở xung hoặc tam chiếu Quan; khôngTT tạiQuan.':r.mode==='direct'?'Tuần hoặc Triệt trực tiếpTài; đã loại ngoại lệ cùng sáng.':'KhôngTT tại cung nhận; đã loại ngoại lệ Nhật–Nguyệt bằng quan hệ củaQuan hoặc điều chỉnh ánh sáng.'],projectScope:[VCD_LIGHT_METHOD,'Không tự sửa hợp chiến thành hợp chiếu. Quan: một sao khôngchiếu đủ loại ngoại lệ, không phải tính mọi điều chỉnh của sao.','Miếu/vượng cóTT tại sao chỉ được chứng nhận mờ trong tập con không nhóm tăng sáng chưa phối hợp tại tọa/tam/xung; ThiênTài xét riêng đồng cung. Đây là cổng dự án bảo thủ.','Nhánh cùng sáng Quan: chỉ đồngNNđắc, cảhaiTT tại sao, khôngMệnh/Thân và không nhóm giảm ánh sáng tại tọa/tam/xung. Không áp miếu/vượng đảo lênđắc hoặc gọi sách bắt cảhaiTT.','Không lặp ý đã xuất ở nhánh VCD cũ; không chọn dự báo thắng.'],knownExceptions:['TT trực tiếp tại cung nhận khácTT tại Nhật/Nguyệt; không truyền qua chiếu.','Có nhóm điều chỉnh ánh sáng chưa phối hợp: giữ ngoài tập con dương tính/đảo sáng tương ứng.'],unknownConditions:['QuanTT trực tiếp chưa mở; Tài hợp chiến chưa định nghĩa.','Chưa phối hợp tăng/giảm ánh sáng hoặc mượn toàn lời đối cung; không đặt tỷ lệ.'],applicability:'Theo cấu trúc cung, chi sao và điều kiện nguồn; không tên, ID, ngày sinh hoặc bản mẫu.',sourceScope:'Riêng quy mô Tài, diễn tiến kiếm tiền hoặc công danh; không tổng hợp toàn cung hoặc sao khác.'}});
});
