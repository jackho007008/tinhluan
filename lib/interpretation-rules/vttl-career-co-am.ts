import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {principalIntegrity} from '../tuvi-engine/chart-integrity';
import {voidMembership} from '../internal-review/career-definitions';
import {ruleSchema,readPath} from './schema';
export const VTTL_CAREER_CO_AM='vttl.career-co-am-dan-progress';
export const VTTL_CAREER_CO_AM_FACT='fact.career-vttl-co-am-dan-progress';
export const VTTL_CAREER_CO_AM_METHOD='vttl-natal-career-1.0.0';
export const VTTL_CAREER_CO_AM_COPY='Trong công việc, bạn được mô tả là có thể tiến thân giữa hoàn cảnh xáo động. Đây là lời luận của một cấu trúc sao, không khẳng định bạn sẽ thăng chức hoặc thành công trong một biến động thực tế.';
// PDF43: explicit non-hãm positions only. Dần/Thân are omitted by the source.
const KHUC_NON_HAM=['Tý','Thìn','Tỵ','Dậu','Sửu','Hợi','Mão','Mùi'];
export function vttlCareerCoAmAssessment(s:ChartSnapshot):{value?:'yes'|'no';reason:string;paths:string[];cause?:'missing-data'|'unresolved-adjustment'}{
 const paths=['chart.palaces','chart.tanBien.completeness.majorStars'];
 const result=(value:'yes'|'no'|undefined,reason:string,cause?:'missing-data'|'unresolved-adjustment')=>({value,reason,paths,cause:cause??(value===undefined?'missing-data' as const:undefined)});
 if(s.profile.id!=='tanbien-vn-trial-v2')return result(undefined,'Ngoài profile dữ kiện bản mệnh đã xác minh.');
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return result(undefined,'Thiếu chứng nhận hoặc dữ kiện 14 chính tinh/12 cung không toàn vẹn.');
 const matches=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Quan Lộc');
 if(matches.length!==1)return result(undefined,'Chưa xác định duy nhất cung Quan Lộc gốc.');
 const {p,i}=matches[0];paths.push(`chart.palaces.${i}.earthlyBranch`,`chart.palaces.${i}.majorStars`);
 if(p.earthlyBranch!=='Dần'||p.majorStars.length!==2||!['Thiên Cơ','Thái Âm'].every(n=>p.majorStars.some(st=>st.name===n)))return result('no','Ngoài tập con dự án Cơ–Âm bản mệnh đồng cung Quan Lộc tại Dần; không phải lời phủ định khả năng tiến thân.');
 paths.push('chart.tanBien.voidRanges');const ranges=s.chart.tanBien?.voidRanges;
 if(!Array.isArray(ranges)||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))return result(undefined,'Thiếu hoặc bất nhất hai cặp Tuần/Triệt để kiểm điều chỉnh trực tiếp tại Quan.');
 const active=ranges.filter(v=>voidMembership(p.earthlyBranch,v.branches)===true);
 if(active.length)return result(undefined,active.map(v=>v.name).join(' và ')+' trực tiếp tại Quan; chưa có phép phối hợp với câu tiến thân, giữ unknown. Không đảo hoặc tự hủy khi cả hai.','unresolved-adjustment');
 paths.push('chart.tanBien.completeness.minorStars','chart.tanBien.completeness.adjectiveStars');
 const complete=s.chart.tanBien?.completeness;
 const fields=['minorStars','adjectiveStars'] as const;
 if(complete?.minorStars!=='complete-with-declared-supplements'||complete?.adjectiveStars!=='complete-with-declared-supplements'||s.chart.palaces.some(q=>fields.some(k=>!Array.isArray(q[k])||q[k].some(st=>!st||typeof st.name!=='string'||!st.name.trim()||(st as {scope?:string}).scope!=='origin'))))return result(undefined,'Thiếu hoặc bất nhất danh sách phụ tinh bản mệnh để xác định Văn Khúc duy nhất; không suy vắng ảnh hưởng.');
 const khuc=s.chart.palaces.flatMap((q,j)=>fields.flatMap(k=>q[k].filter(st=>st.name==='Văn Khúc').map(()=>({q,path:`chart.palaces.${j}.${k}`,branchPath:`chart.palaces.${j}.earthlyBranch`}))));
 if(khuc.length!==1)return result(undefined,'Chưa có đúng một Văn Khúc gốc để xét điều kiện hãm theo Toàn Thư PDF43.');
 const x=khuc[0];paths.push(x.path,x.branchPath);
 if(!KHUC_NON_HAM.includes(x.q.earthlyBranch))return result(undefined,`Văn Khúc tại ${x.q.earthlyBranch}: ${['Ngọ','Tuất'].includes(x.q.earthlyBranch)?'PDF43 ghi hãm':'PDF43 chưa phân loại đủ'}. Nhánh Khúc hãm AND gặp Cơ–Âm ở PDF79 chưa giải quan hệ; không chọn vị trí gặp hẹp để xuất lời.`, 'unresolved-adjustment');
 return result('yes',`Cơ–Âm gốc đồng cung Quan Dần, vắng Tuần/Triệt trực tiếp; Văn Khúc gốc tại ${x.q.earthlyBranch} được Toàn Thư PDF43 ghi không hãm. Điều kiện Khúc hãm của PDF79 false, không cần đoán quan hệ gặp. Dần/vắng TT là tập con dự án; câu nguồn79 không nêu chi hoặc tuổi.`);
}
export function vttlCareerCoAmFacts(s:ChartSnapshot):DerivedFact[]{
 const a=vttlCareerCoAmAssessment(s),common={derivationId:VTTL_CAREER_CO_AM_METHOD,version:'1.0.0',text:a.reason,evidencePaths:a.paths.filter(p=>readPath(s,p)!==undefined),status:'source-table' as const,limitation:'Chỉ nhánh Quan Dần đã duyệt. Không suy chức vụ/thu nhập/tuổi hoặc khuyên tạo biến động. TT/Khúc chưa giải và dữ liệu thiếu giữ unknown.'};
 return [{...common,id:VTTL_CAREER_CO_AM_FACT+'-status',value:a.value??'unknown'},...(a.value?[{...common,id:VTTL_CAREER_CO_AM_FACT,value:a.value}]:[])];
}
export const vttlCareerCoAmRule=ruleSchema.parse({
 id:VTTL_CAREER_CO_AM,version:'1.0.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:[VTTL_CAREER_CO_AM_FACT],conditions:[{fact:VTTL_CAREER_CO_AM_FACT,op:'eq',value:'yes'}],exceptions:[],claimTemplate:VTTL_CAREER_CO_AM_COPY,evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges'],
 sourceReferences:[{id:'vttl170-career-co-am',title:'Vũ Tài Lục dịch và bình chú — Tử Vi Đẩu Số Toàn Thư',url:'/internal/editorial/vttl-career-co-am#progress',location:'PDF/header79, Tam Quan Lộc Cung, đoạn Thái Âm: cùng Thiên Cơ náo trung tiến thân; PDF43 bảng Văn Khúc để xét ngoại lệ; ngữ cảnh17,57,78–80; bản170trang.',accessedOn:'2026-10-25',rights:'pending',rightsNote:'Đúng nhánh/văn được chủ dự án duyệt sau đặc tả5310b2e; không mở Toàn Thư khác hoặc quyền thương mại. SHA256 789b02281b5d52b4cb746baa12616a7c25bca468489c937a87eada3303d1b06b.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Không sửa câu Thìn/về khoa/như trên của Tân Biên; không đồng nhất hai nguồn. Không phải kết luận toàn Quan hoặc thành công thực tế.'],
 presentation:{title:'Tiến thân trong hoàn cảnh xáo động',readingTheme:'work',contentType:'combination',sourceConditions:['Thiên Cơ và Thái Âm bản mệnh thực sự đồng cung Quan Lộc; PDF79 mô tả náo trung tiến thân.','Chính vế này không đặt chi, can, tuổi hoặc trạng thái miếu của cặp.','PDF79 có nhánh riêng Văn Khúc hãm AND gặp Cơ–Âm. PDF43 xếp Khúc miếu tại Tý/Thìn/Tỵ/Dậu/Sửu, vượng tại Hợi/Mão/Mùi; điều kiện hãm false tại các chi ấy.'],
 projectScope:[VTTL_CAREER_CO_AM_METHOD,'Chủ dự án duyệt riêng sau5310b2e; không mở nhánh Toàn Thư khác.','Tập con dự án: đúng hai chính tinh Cơ–Âm gốc tại Quan Dần, vắng TT trực tiếp đã được chứng nhận. Dần/vắng TT không phải điều kiện nguyên văn sách.','Chứng nhận14 chính tinh/12 cung và danh sách phụ tinh gốc đầy đủ; xác định duy nhất Văn Khúc. Dùng bảng43 riêng, không lấy brightness engine.'],
 knownExceptions:['TT trực tiếp Quan giữ unknown/unresolved-adjustment; chưa có phép phối câu79, không đảo/tự hủy khi cả hai.','KhúcNgọ/Tuất hãm, Dần/Thân chưa phân loại đủ hoặc thiếu/trùng Khúc giữ unknown; chưa giải quan hệ gặp. Không tuyên bố Khúc hãm luôn xóa cặp.','Không lấy HỏaQuan80/ĐịaKhông/ÂmKhoa làm phép bảo đảm hoặc triệt tiêu câu79; không suy tiến thân sớm, chức vụ hoặc thu nhập.'],
 unknownConditions:['Thiếu hoặc bất nhất dữ kiện giữ unknown; ngoài tập con rõ giữ no của phạm vi dự án, không phủ định nguồn.'],readerLimit:'Nhận định riêng về công việc, không xác nhận thăng chức/thành công hoặc hoàn chỉnh Quan.',applicability:'Chỉ đúng tập con và dữ kiện gốc đã duyệt, không mượn sao chiếu hoặc chọn theo mẫu.',sourceScope:'Phương pháp riêng Toàn Thư do Vũ Tài Lục dịch/bình chú, không gán cho Tân Biên/NPL/Trung Châu.'}
});
