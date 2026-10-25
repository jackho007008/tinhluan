import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {principalIntegrity} from '../tuvi-engine/chart-integrity';
import {voidMembership} from '../internal-review/career-definitions';
import {ruleSchema,readPath} from './schema';
export const VTTL_NO_LUONG='vttl.no-luong-single-scale';
export const VTTL_NO_LUONG_FACT='fact.no-vttl-luong-single-scale';
export const VTTL_NO_LUONG_METHOD='vttl-no-luong-single-1.0.0';
export const VTTL_NO_LUONG_COPY='Về người phụ giúp, cấu trúc này được sách mô tả là có nhiều người phụ giúp. Đoạn này không xác nhận số người thực tế, mức độ trợ giúp hoặc phẩm chất của từng người.';
// Source-local table, PDF37. Never substitute engine brightness or another author's states.
export const VTTL_LUONG_STATES:Readonly<Record<string,'Miếu'|'Vượng'|'Hãm'>>={Tuất:'Miếu',Thìn:'Miếu',Ngọ:'Miếu',Sửu:'Vượng',Mùi:'Vượng',Tý:'Vượng',Mão:'Vượng',Dần:'Vượng',Thân:'Vượng',Tỵ:'Hãm',Hợi:'Hãm',Dậu:'Hãm'};
export function vttlNoLuongAssessment(s:ChartSnapshot):{value?:'yes'|'no';reason:string;paths:string[];cause?:'missing-data'|'unresolved-adjustment'}{
 const paths=['chart.palaces','chart.tanBien.completeness.majorStars'];
 const result=(value:'yes'|'no'|undefined,reason:string,cause?:'missing-data'|'unresolved-adjustment')=>({value,reason,paths,cause:cause??(value===undefined?'missing-data' as const:undefined)});
 if(s.profile.id!=='tanbien-vn-trial-v2')return result(undefined,'Ngoài profile dữ kiện bản mệnh đã xác minh.');
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return result(undefined,'Thiếu chứng nhận hoặc dữ kiện 12 cung/14 chính tinh gốc không toàn vẹn.');
 const ps=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Nô Bộc');
 if(ps.length!==1)return result(undefined,'Chưa xác định duy nhất cung Nô Bộc bản mệnh.');
 const {p,i}=ps[0];paths.push(`chart.palaces.${i}.name`,`chart.palaces.${i}.earthlyBranch`,`chart.palaces.${i}.majorStars`);
 if(p.majorStars.length!==1||p.majorStars[0].name!=='Thiên Lương')return result('no','Ngoài tập con Thiên Lương đơn thủ Nô: không mượn VCD/chiếu hoặc bỏ vế Đồng–Lương/Cơ–Lương.');
 const state=VTTL_LUONG_STATES[p.earthlyBranch];if(!state)return result(undefined,'Chưa xác định trạng thái Thiên Lương theo bảng Toàn Thư PDF37.');
 if(state==='Hãm')return result('no','Toàn Thư37 ghi Hãm; ngoài tập con dự án Miếu/Vượng, không suy ít người hoặc đảo câu87.');
 paths.push('chart.tanBien.voidRanges');const ranges=s.chart.tanBien?.voidRanges;
 if(!Array.isArray(ranges)||ranges.length!==2||ranges.some(v=>!v)||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))return result(undefined,'Thiếu hoặc bất nhất hai cặp Tuần/Triệt; không suy vắng TT trực tiếp Nô.');
 const active=ranges.filter(v=>voidMembership(p.earthlyBranch,v.branches));
 if(active.length)return result(undefined,active.map(v=>v.name).join(' và ')+' trực tiếp Nô: chưa đặc tả điều chỉnh đúng vế quy mô người phụ giúp, giữ unknown. Không đảo hoặc tự hủy khi cả hai.','unresolved-adjustment');
 return result('yes',`Thiên Lương bản mệnh đơn thủ Nô ${p.earthlyBranch}, ${state} theo Toàn Thư37, xác nhận vắng TT trực tiếp. PDF87 nói riêng nhiều gia nhân. Đơn thủ/Miếu–Vượng/vắng TT là tập con dự án được duyệt, không phải nguyên văn điều kiện87. Không suy nhiều bạn bè, mức trợ giúp hoặc phẩm chất.`);
}
export function vttlNoLuongFacts(s:ChartSnapshot):DerivedFact[]{
 const a=vttlNoLuongAssessment(s),common={derivationId:VTTL_NO_LUONG_METHOD,version:'1.0.0',text:a.reason,evidencePaths:a.paths.filter(p=>readPath(s,p)!==undefined),status:'source-table' as const,limitation:'Chỉ người phụ giúp theo gia nhân ở Toàn Thư87; không định lượng hoặc suy quan hệ rộng, mức trợ giúp/trung thành. Thiếu dữ kiện/TT giữ unknown.'};
 return [{...common,id:VTTL_NO_LUONG_FACT+'-status',value:a.value??'unknown'},...(a.value?[{...common,id:VTTL_NO_LUONG_FACT,value:a.value}]:[])];
}
export const vttlNoLuongRule=ruleSchema.parse({
 id:VTTL_NO_LUONG,version:'1.0.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:[VTTL_NO_LUONG_FACT],conditions:[{fact:VTTL_NO_LUONG_FACT,op:'eq',value:'yes'}],exceptions:[],claimTemplate:VTTL_NO_LUONG_COPY,evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges'],
 sourceReferences:[{id:'vttl170-no-luong',title:'Vũ Tài Lục dịch và bình chú — Tử Vi Đẩu Số Toàn Thư',url:'/internal/editorial/vttl-no-luong#scale',location:'PDF/header87 Bát Nô Bộc Cung, câu Thiên Lương nhiều gia nhân; PDF37 bảng Thiên Lương; ngữ cảnh17–18,57; bản170trang.',accessedOn:'2026-10-25',rights:'pending',rightsNote:'Đúng nhánh/văn được chủ dự án duyệt sau đặc tả6e7e551; không mở các nhánh Toàn Thư khác/quyền thương mại. SHA256789b02281b5d52b4cb746baa12616a7c25bca468489c937a87eada3303d1b06b.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:['Không sửa hoặc tự thắng/xóa bảng Mệnh–Nô Tân Biên, không xác nhận hoàn cảnh con người thực tế hoặc hoàn chỉnh Nô.'],
 presentation:{title:'Quy mô người phụ giúp',readingTheme:'no',contentType:'element-gloss',sourceConditions:['Toàn Thư87: Thiên Lương tại Nô, câu nhiều gia nhân; trình bày là người phụ giúp, không chuyển thành bạn bè/nhân viên công sở.','Hai vế cùng Thiên Đồng và cùng Thiên Cơ là cấu trúc riêng, không cắt vế đó để dùng câu đơn.','Bảng37: MiếuTuất/Thìn/Ngọ; VượngSửu/Mùi/Tý/Mão/Dần/Thân; HãmTỵ/Hợi/Dậu. Câu87 không tự đặt điều kiện Miếu/Vượng, đơn thủ hoặc vắng TT.'],
 projectScope:[VTTL_NO_LUONG_METHOD,'Phê duyệt đúng nhánh sau6e7e551, không mở Toàn Thư khác.','Tập con dự án: Thiên Lương bản mệnh đơn thủ Nô, Miếu/Vượng theo đúng bảng37, xác nhận vắng TT trực tiếp. Không gán cổng này thành điều kiện nguyên văn87.','Profilev2/receipt;12cung/14chính tinh đầy đủ/hợp lệ, hai cặp TT đủ; không dùng brightness engine, bảngTB hoặc ID mẫu.'],
 knownExceptions:['Đồng–Lương/Cơ–Lương/VCD ngoài tập con mới, không chuyển hoặc mượn sao.','TT trực tiếp Nô giữ unknown/unresolved-adjustment; chưa giải tác động đúng vế, không tự hủy/đảo. Hãm ngoài tập con, không suy kết quả ngược.'],unknownConditions:['Thiếu/bất nhất dữ kiện hoặc trạng thái nguồn giữ unknown, không suy vắng TT/đủ trạng thái.'],readerLimit:'Chỉ quy mô người phụ giúp theo gia nhân; không định lượng, không suy nhiều bạn bè, quan hệ rộng, cấp dưới trung thành hoặc chắc được giúp tốt.',applicability:'Đúng tập con đã duyệt cho mọi hồ sơ, không theo ID/tên/ngày sinh.',sourceScope:'Nguồn riêng Toàn Thư87/37; không thay lời khác phương diện hoặc trộn bảng Mệnh–Nô Tân Biên.'}
});
