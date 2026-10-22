import type {ChartSnapshot} from '../tuvi-engine';
import {principalIntegrity} from '../tuvi-engine/chart-integrity';
import {bookState} from '../tuvi-engine/tanbien';
import {voidMembership} from '../internal-review/career-definitions';
import type {DerivedFact} from './derived';
import {ruleSchema} from './schema';

export const FINANCE_VCD_METHOD='tanbien-finance-vcd-direct-void-1.0.0';
export const FINANCE_VCD_ID='tanbien.finance-vcd-direct-void';
export const FINANCE_VCD_TEXT='Tài Bạch không có chính tinh, có Tuần hoặc Triệt án ngữ trực tiếp, trong khi Nhật–Nguyệt không cùng ở thế sáng. Với cấu trúc này, việc kiếm tiền được mô tả là khó khăn lúc đầu, về sau dễ dàng hơn, càng về già càng sung túc. Các vế nói về một diễn tiến theo cách luận truyền thống; chưa xác định bạn đang ở giai đoạn nào hoặc mức thu nhập, tài sản thực tế.';
export type FinanceVcdAssessment={value?:boolean;cause?:'missing-data'|'outside-subset';text:string;paths:string[]};
export function financeVcdAssessment(s:ChartSnapshot,mode:'direct-void'|'scale-limit'='direct-void',palace:'Tài Bạch'|'Quan Lộc'='Tài Bạch'):FinanceVcdAssessment{
 const sourceSection=palace==='Tài Bạch'?'PDF197§12.56':'PDF166–167§8.45';
 const paths=['chart.tanBien.completeness.majorStars'];
 const result=(value:boolean|undefined,text:string,cause?:FinanceVcdAssessment['cause'])=>({value,text,cause,paths});
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)
  return result(undefined,'Chưa xác nhận đủ 14 chính tinh bản mệnh, duy nhất trên 12 cung hợp lệ.','missing-data');
 const ps=s.chart.palaces;
 paths.push(...ps.map((_,i)=>`chart.palaces.${i}.majorStars`));
 if(ps.some(p=>p.majorStars.some(st=>(st as {scope?:string}).scope!=='origin')))
  return result(undefined,'Chưa xác nhận lớp bản mệnh của chính tinh.','missing-data');
 const i=ps.findIndex(p=>p.name===palace),p=ps[i];
 if(!p)return result(undefined,`Thiếu định danh ${palace}.`,'missing-data');
 paths.push(`chart.palaces.${i}.name`,`chart.palaces.${i}.earthlyBranch`);
 if(p.majorStars.length)return result(false,`${palace} có chính tinh tọa thủ; không thuộc nhánh vô chính diệu.`);
 paths.push('chart.tanBien.voidRanges');
 const ranges=s.chart.tanBien.voidRanges;
 if(!ranges||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.filter(v=>v.name===n).length===1)||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))
  return result(undefined,'Thiếu hai cặp Tuần/Triệt duy nhất và hợp lệ để kiểm án ngữ trực tiếp.','missing-data');
 const active=ranges.filter(v=>v.branches.includes(p.earthlyBranch));
 if(mode==='direct-void'&&!active.length)return result(false,`Không có Tuần hoặc Triệt án ngữ trực tiếp tại ${palace}.`);
 if(mode==='scale-limit'&&active.length)return result(false,'Có Tuần/Triệt trực tiếp: thuộc ngoại lệ của giới hạn quy mô, không xuất câu nền.');
 const lights=['Thái Dương','Thái Âm'].map(name=>{
  const j=ps.findIndex(q=>q.majorStars.some(st=>st.name===name)),q=ps[j];
  paths.push(`chart.palaces.${j}.earthlyBranch`);
  return {name,palace:q.name,branch:q.earthlyBranch,...bookState(name,q.earthlyBranch)};
 });
 if(lights.some(l=>!l.value))return result(undefined,'Thiếu ô trạng thái Tân Biên của Nhật hoặc Nguyệt tại chi thật; không suy từ nhãn engine.','missing-data');
 const detail=lights.map(l=>`${l.name} tại ${l.palace} ${l.branch}: ${l.value} (${l.version})`).join('; ');
 // This subset excludes the both-bright exception without interpreting “hợp chiến”.
 // It does not move stars, infer a receiving-branch state, or borrow palace prose.
 if(lights.every(l=>['Miếu','Vượng','Đắc'].includes(l.value!)))
  return result(undefined,detail+`. Cả hai sáng: ngoài tập con này; chưa chọn quan hệ “${palace==='Tài Bạch'?'hợp chiến':'hợp chiếu'}” hoặc phối hợp ngoại lệ của ${palace==='Tài Bạch'?'§12.56':'§8.45'}.`,'outside-subset');
 if(mode==='scale-limit')return result(true,`${palace} ${p.earthlyBranch} vô chính diệu, không có Tuần/Triệt trực tiếp. ${detail}. Nhật–Nguyệt không cùng sáng: đã loại hai ngoại lệ ${sourceSection}; chỉ giữ giới hạn ${palace==='Tài Bạch'?'quy mô':'mức hiển đạt'}, không mượn lời đối cung.`);
 return result(true,`Tài Bạch ${p.earthlyBranch} không có chính tinh; ${active.map(v=>v.name).join(' và ')} án ngữ trực tiếp. ${detail}. Nhật–Nguyệt không cùng sáng nên không thỏa điều kiện cần của ngoại lệ thứ hai. Chỉ dùng diễn tiến kiếm tiền của nhánh TT trực tiếp tại PDF197§12.56; không mượn lời đối cung. Giới hạn tập con của dự án, không phải sách đòi vắng Nhật–Nguyệt.`);
}
export function financeVcdFacts(s:ChartSnapshot):DerivedFact[]{
 const a=financeVcdAssessment(s);return a.value===undefined?[]:[{id:'fact.finance-vcd-direct-void',derivationId:FINANCE_VCD_METHOD,version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'source-table',limitation:'Chỉ nhánh TT trực tiếp và Nhật–Nguyệt chắc chắn không cùng sáng; chưa giải phép mượn hay ngoại lệ cùng sáng.'}];
}
export const financeVcdRules=[ruleSchema.parse({
 id:FINANCE_VCD_ID,version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.finance-vcd-direct-void','fact.source-position-available'],conditions:[{fact:'fact.finance-vcd-direct-void',op:'eq',value:'yes'}],exceptions:[],claimTemplate:FINANCE_VCD_TEXT,
 evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges'],
 sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:'PDF197 §12.56: nhánh Tuần/Triệt trực tiếp; đủ ba vế buổi đầu khó, về sau dễ, càng về già càng sung túc. Ngoại lệ Nhật–Nguyệt cùng sáng giữ riêng; ảnh ghi “hợp chiến”, chưa đính chính. PDF33§2.10 và35–36: trạng thái từng sao tại chi thật. Bản277trang SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc.',accessedOn:'2026-10-21',rights:'pending',rightsNote:'Tái dùng audit, kiểm đúng ảnh197; không thay phương pháp bằng nguồn NPL/Thiên Lương.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Không xác nhận thu nhập/tài sản hoặc giai đoạn hiện tại; không gán tuổi cho “về già”.','Không mượn chính tinh, phụ tinh hoặc lời của đối cung; không kết luận toàn cung hay cân đối tài sản ròng.'],
 presentation:{title:'Tài Bạch vô chính diệu gặp Tuần hoặc Triệt',readingTheme:'finance',contentType:'combination',sourceConditions:['Tài Bạch không có chính tinh.','Tuần hoặc Triệt án ngữ trực tiếp; giữ nguyên cả diễn tiến buổi đầu–về sau–về già.'],projectScope:[FINANCE_VCD_METHOD,'Chứng nhận chính tinh đủ/hợp lệ, bản mệnh; hai cặp Tuần/Triệt hợp lệ.','Chỉ nhận khi Nhật–Nguyệt chắc chắn không cùng sáng theo bảng Tân Biên tại chi thật. Đây là giới hạn tập con nhằm loại khả năng ngoại lệ thứ hai, không phải điều kiện vắng sao của sách.','Cả hai sáng dù ở quan hệ nào: ngoài tập con. Không sửa “hợp chiến”, không dùng bảng NPL/TL hoặc trạng thái chi nhận.'],readerLimit:'Diễn tiến kiếm tiền theo nguồn, chưa xác định kết quả thực tế hoặc hợp nhất mọi yếu tố tài chính.',knownExceptions:['Nhật–Nguyệt cùng sáng có nhánh riêng và vế tăng thêm với TT; giữ chưa áp trong lô này.','Không coi cả Tuần lẫn Triệt là tự triệt tiêu.'],unknownConditions:['Thiếu hoặc bất nhất danh sách/án ngữ/ô trạng thái nguồn: không xuất lời.','Chưa giải phép mượn cặp đối cung, giới hạn giàu lớn hoặc quan hệ “hợp chiến”.'],applicability:'Tài VCD, TT trực tiếp, Nhật–Nguyệt không cùng sáng; không phụ thuộc tuổi/giới/ngày mẫu.',sourceScope:'Chỉ diễn tiến kiếm tiền ở Tài; không dùng để luận công danh, nhà đất hay Tật Ách.'},
})];

// The concessive “dù có nhiều sao ... cũng” is not a count predicate.
// Both source exceptions are excluded without resolving the borrowing method.
export const FINANCE_VCD_SCALE_ID='tanbien.finance-vcd-scale-limit';
export const FINANCE_VCD_SCALE_TEXT='Tài Bạch không có chính tinh, không có Tuần hoặc Triệt án ngữ trực tiếp và Nhật–Nguyệt không cùng sáng. Với cấu trúc này, lời luận đặt giới hạn “không thể giàu to lớn”, kể cả khi có nhiều sao tốt hội hợp. Đây là nhận định riêng về quy mô tài lộc, không xác định mức thu nhập hay tài sản hiện có.';
export function financeVcdScaleFacts(s:ChartSnapshot):DerivedFact[]{
 const a=financeVcdAssessment(s,'scale-limit');return a.value===undefined?[]:[{id:'fact.finance-vcd-scale-limit',derivationId:'tanbien-finance-vcd-scale-1.0.0',version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'source-table',limitation:'Chỉ giới hạn quy mô PDF197§12.56 khi đã loại hai ngoại lệ; không suy nghèo hoặc mất tài sản.'}];
}
export const financeVcdScaleRules=[ruleSchema.parse({...financeVcdRules[0],id:FINANCE_VCD_SCALE_ID,requiredFacts:['fact.finance-vcd-scale-limit','fact.source-position-available'],conditions:[{fact:'fact.finance-vcd-scale-limit',op:'eq',value:'yes'}],claimTemplate:FINANCE_VCD_SCALE_TEXT,
 sourceReferences:financeVcdRules[0].sourceReferences.map(s=>({...s,location:'PDF197 §12.56: câu giới hạn quy mô “Dù có nhiều sao sáng sủa tốt đẹp hội hợp cũng không thể giàu to lớn được ngoại trừ hai trường hợp đặc biệt sau đây”. Loại cả hai ngoại lệ: không TT trực tiếp và Nhật–Nguyệt chắc chắn không cùng sáng tại chi thật theo bảng35–36. Không cần chọn nghĩa “hợp chiến” hoặc mượn lời đối cung để áp riêng câu này.',accessedOn:'2026-10-22'})),
 limitations:['Chỉ quy mô tài lộc theo nguồn; không xác nhận tài sản/thu nhập hiện có, không suy nghèo hoặc mất của.','Không dùng câu này thay phương pháp mượn chính tinh hoặc tổng hợp toàn cung.'],
 presentation:{...financeVcdRules[0].presentation,readerLimit:'Giới hạn quy mô tài lộc theo nguồn; không suy thu nhập/tài sản thực tế hoặc nghèo.',title:'Tài Bạch vô chính diệu — giới hạn quy mô',sourceConditions:['Tài Bạch không có chính tinh.','Không có Tuần/Triệt trực tiếp; Nhật–Nguyệt không cùng sáng theo bảng Tân Biên tại chi thật.'],projectScope:['tanbien-finance-vcd-scale-1.0.0; dùng chung kiểm chứng nhận, vị trí, hai cặp TT và trạng thái với nhánh diễn tiến.','Cả hai sáng ở bất kỳ quan hệ nào: chưa xuất. Cổng tập con của dự án để loại khả năng ngoại lệ, không phải yêu cầu sách cấm Nhật/Nguyệt.','“Dù có nhiều” là vế nhượng bộ; không yêu cầu đếm sao tốt để kích hoạt. Không mượn chính tinh hoặc xóa lời nguồn thu/giữ tiền khác.'],knownExceptions:['Tuần/Triệt trực tiếp hoặc Nhật–Nguyệt cùng sáng: không xuất giới hạn nền này.'],unknownConditions:['Phép mượn và quan hệ hợp chiến vẫn chưa giải; không dùng để mở rộng tập con.'],applicability:'Tài VCD, không TT trực tiếp, hai sao Nhật/Nguyệt chắc chắn không cùng sáng.',sourceScope:'Chỉ quy mô tài lộc, không kết luận nghèo, khả năng tạo/giữ tài sản hoặc giàu nghèo toàn cung.'}})];

export const CAREER_VCD_SCALE_ID='tanbien.career-vcd-scale-limit';
export const CAREER_VCD_SCALE_TEXT='Quan Lộc không có chính tinh, không có Tuần hoặc Triệt án ngữ trực tiếp và Nhật–Nguyệt không cùng sáng. Với cấu trúc này, công danh được mô tả là không thể hiển đạt, chức vị bình thường, dù có nhiều sao tốt phối chiếu. Đây là lời riêng về mức hiển đạt, không xác định nghề nghiệp hoặc chức vụ hiện có.';
export function careerVcdScaleFacts(s:ChartSnapshot):DerivedFact[]{
 const a=financeVcdAssessment(s,'scale-limit','Quan Lộc');return a.value===undefined?[]:[{id:'fact.career-vcd-scale-limit',derivationId:'tanbien-career-vcd-scale-1.0.0',version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'source-table',limitation:'Chỉ mức hiển đạt PDF166–167§8.45 khi đã loại hai ngoại lệ; không dùng lời về Tài thay công danh.'}];
}
export const careerVcdScaleRules=[ruleSchema.parse({...financeVcdScaleRules[0],id:CAREER_VCD_SCALE_ID,requiredFacts:['fact.career-vcd-scale-limit','fact.career-source-available'],conditions:[{fact:'fact.career-vcd-scale-limit',op:'eq',value:'yes'}],claimTemplate:CAREER_VCD_SCALE_TEXT,
 sourceReferences:financeVcdScaleRules[0].sourceReferences.map(s=>({...s,location:'PDF166–167 §8.45: Quan VCD dù nhiều sao tốt phối chiếu công danh không thể hiển đạt, chức vị bình thường; hai ngoại lệ TT và Nhật–Nguyệt cùng sáng. Chỉ câu mức hiển đạt khi không TT trực tiếp và Nhật–Nguyệt chắc chắn không cùng sáng tại chi thật theo35–36. Không áp phép mượn hoặc diễn tiến ngoại lệ TT.',accessedOn:'2026-10-22'})),
 limitations:['Chỉ mức hiển đạt theo nguồn, không xác nhận nghề nghiệp/chức vụ hiện có.','Không hợp nhất các sao hoặc lấy lời Tài Bạch thay cho Quan Lộc.'],
 presentation:{...financeVcdScaleRules[0].presentation,readerLimit:'Chỉ mức hiển đạt theo nguồn; không xác nhận chức vụ hoặc nghề hiện có.',title:'Quan Lộc vô chính diệu — mức hiển đạt',readingTheme:'work',sourceConditions:['Quan Lộc không có chính tinh.','Không TT trực tiếp; Nhật–Nguyệt chắc chắn không cùng sáng tại chi thật.'],projectScope:['tanbien-career-vcd-scale-1.0.0; chung kiểm chứng nhận/vị trí/TT/trạng thái với Tài, câu kết quả riêng đúng cung.','Cả hai sáng ở bất kỳ quan hệ nào: chưa xuất, là cổng tập con dự án để loại khả năng ngoại lệ. Không lấy “dù có nhiều” làm ngưỡng số sao.','Không giải phép mượn để xuất riêng câu giới hạn, không tổng hợp toàn cung; nhánh TT và cùng sáng giữ riêng chưa áp.'],knownExceptions:['TT trực tiếp hoặc Nhật–Nguyệt cùng sáng: không xuất câu giới hạn nền.'],unknownConditions:['Chưa xác định cách chuyển các lời chính tinh đối cung và ngoại lệ TT/cùng sáng ở Quan; không mở bằng cách code của Tài.'],applicability:'Quan VCD, không TT trực tiếp, Nhật–Nguyệt không cùng sáng.',sourceScope:'Riêng mức hiển đạt, không thu nhập, giữ tiền hoặc chức vụ thực tế.'}})];
