import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {principalIntegrity} from '../tuvi-engine/chart-integrity';
import {voidMembership} from '../internal-review/career-definitions';
import {ruleSchema,readPath} from './schema';
export const NPL_DIEN_SINGLE_METHOD='npl-dien-single-void-1.0.0';
export const NPL_DIEN_SINGLE_SUPPORT='fact.dien-npl-single-tai-support-status';
const COMMON='Về nhà đất, lời luận mô tả việc tạo dựng khó hoặc chậm, hoặc có rồi lại hao hụt, suy giảm. ';
const LIMIT=' Nếu cung Tài tốt, bất lợi về nhà đất có thể được giảm nhẹ; mức hỗ trợ cụ thể chưa xác định. Đoạn này không xác nhận bạn có di sản, đang sở hữu hay sẽ mất tài sản.';
export const nplDienSingleBranches=[
 {key:'tuan',voidName:'Tuần Không',id:'npl.dien-single-tuan',fact:'fact.dien-npl-single-tuan',copy:COMMON+'Với Tuần, ảnh hưởng được nói là nhẹ hơn nhưng kéo dài.'+LIMIT},
 {key:'triet',voidName:'Triệt Lộ',id:'npl.dien-single-triet',fact:'fact.dien-npl-single-triet',copy:COMMON+'Với Triệt, ảnh hưởng được nói là mạnh hơn nhưng ở giai đoạn đầu.'+LIMIT},
] as const;
export const NPL_DIEN_SINGLE_IDS:string[]=nplDienSingleBranches.map(b=>b.id);
export function nplDienSingleAssessment(s:ChartSnapshot):{value?:'tuan'|'triet'|'no';reason:string;paths:string[];cause?:'missing-data'|'unresolved-adjustment'}{
 const paths=['chart.palaces','chart.tanBien.completeness.majorStars'];
 const result=(value:'tuan'|'triet'|'no'|undefined,reason:string)=>({value,reason,paths,cause:value===undefined?'missing-data' as const:undefined});
 if(s.profile.id!=='tanbien-vn-trial-v2')return result(undefined,'Ngoài profile dữ kiện bản mệnh đã xác minh.');
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return result(undefined,'Thiếu chứng nhận hoặc dữ kiện 12 cung/14 chính tinh gốc không toàn vẹn.');
 const found=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Điền Trạch');
 if(found.length!==1)return result(undefined,'Chưa xác định duy nhất cung Điền Trạch gốc.');
 const {p,i}=found[0];paths.push(`chart.palaces.${i}.name`,`chart.palaces.${i}.earthlyBranch`,`chart.palaces.${i}.majorStars`);
 if(!p.majorStars.length)return result('no','Điền vô chính diệu ngoài tập con mới; giữ các nhánh VCD hiện có, không phủ định nhà đất.');
 paths.push('chart.tanBien.voidRanges');const ranges=s.chart.tanBien?.voidRanges;
 if(!Array.isArray(ranges)||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))return result(undefined,'Thiếu hoặc bất nhất hai cặp Tuần/Triệt; không suy thành vắng TT hoặc chỉ có một TT.');
 const active=ranges.filter(v=>voidMembership(p.earthlyBranch,v.branches)===true);
 if(active.length!==1)return result('no',active.length===2?'Cả Tuần lẫn Triệt trực tiếp Điền ngoài nhánh mới; giữ §7.33 cũ, không tự hủy hoặc thay bằng NPL.':'Không có Tuần/Triệt trực tiếp Điền; ngoài tập con nguồn, không dùng TT ở cung chiếu.');
 if(['Mão','Dậu'].includes(p.earthlyBranch)&&p.majorStars.length===2&&['Thiên Cơ','Cự Môn'].every(n=>p.majorStars.some(st=>st.name===n)))return result('no','Ưu tiên cấu trúc Cơ–Cự Mão/Dậu/một TT cho tanbien.dien-void-co-cu hiện có; không xuất lời NPL tương đương lần hai hoặc phục hồi nền TB.');
 const money=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Tài Bạch');
 if(money.length!==1)return result(undefined,'Chưa xác định duy nhất cung Tài Bạch để giữ căn cứ điều kiện hỗ trợ, không coi là không có hỗ trợ.');
 paths.push(`chart.palaces.${money[0].i}.name`,`chart.palaces.${money[0].i}.majorStars`);
 const b=nplDienSingleBranches.find(b=>b.voidName===active[0].name)!;
 return result(b.key,`${b.voidName} trực tiếp Điền có chính tinh, chỉ một TT. NPL260 nói riêng tạo lập/duy trì; phân biệt thời đoạn Tuần/Triệt. Điều kiện Tài tốt ở NPL257 chưa được xác định cho toàn Tài, không suy từ một lời thuận hoặc suy kết quả ngược. Nhánh Cơ–Cự cũ được giữ ưu tiên.`);
}
export function nplDienSingleFacts(s:ChartSnapshot):DerivedFact[]{
 const a=nplDienSingleAssessment(s),common={derivationId:NPL_DIEN_SINGLE_METHOD,version:'1.0.0',text:a.reason,evidencePaths:a.paths.filter(p=>readPath(s,p)!==undefined),status:'source-table' as const,limitation:'NPL257/260–261; một TT và có chính tinh; không đảo lời nguồn khác, không suy di sản/tuổi/tài sản thực tế.'};
 return [{...common,id:'fact.dien-npl-single-status',value:a.value??'unknown'},
  // This release does not define whole-palace Tài tốt. Unknown is evidence, never false or applied relief.
  {...common,id:NPL_DIEN_SINGLE_SUPPORT,value:'unknown',text:'Nếu cung Tài tốt thì bất lợi Điền có thể nhẹ đi (NPL257). Chưa có phép xác định toàn Tài tốt và mức hỗ trợ của cấu trúc này; không coi thiếu phép/data là không có hỗ trợ, không suy đã được giảm nhẹ từ một claim thuận.'},
  ...(a.value?nplDienSingleBranches.map(b=>({...common,id:b.fact,value:a.value===b.key?'yes':'no',text:(a.value===b.key?'Đúng nhánh '+b.voidName+'. ':'Không thuộc nhánh '+b.voidName+'. ')+a.reason})):[])];
}
export const nplDienSingleRules=nplDienSingleBranches.map(b=>ruleSchema.parse({
 id:b.id,version:'1.0.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:[b.fact,NPL_DIEN_SINGLE_SUPPORT],conditions:[{fact:b.fact,op:'eq',value:'yes'}],exceptions:[],claimTemplate:b.copy,evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges'],
 sourceReferences:[{id:'npl-tonghop-dien-single',title:'Nguyễn Phát Lộc — Tử Vi Tổng Hợp',url:'/internal/editorial/npl-dien-single#'+b.key,location:'PDF/header260 mục Tuần, Triệt ở Điền; ngoại lệ VCD ở261; Tài có thể hỗ trợ Điền ở257. Bản442trang.',accessedOn:'2026-10-25',rights:'pending',rightsNote:'Phạm vi mở đúng tập con được chủ dự án duyệt sau1fe982b; không quyền thương mại/thẩm định ngoài. SHA25682f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:['Không sửa/đảo/xóa lời nguồn khác hoặc khôi phục nền TB chưa có phép điều chỉnh. Không suy số lượng/giá trị/quyền sở hữu hoặc năm xảy ra.'],
 presentation:{title:'Tạo lập và duy trì nhà đất',readingTheme:'dien',contentType:'element-gloss',sourceConditions:[b.voidName+' án trực tiếp Điền Trạch, không lấy từ cung chiếu.','NPL260 giữ các khả năng khó tạo, chậm có hoặc có rồi hao/suy; không khẳng định tất cả cùng xảy ra.',b.key==='tuan'?'Tuần tác động nhẹ hơn nhưng kéo dài.':'Triệt tác động mạnh hơn nhưng ở giai đoạn đầu.','NPL257: nếu Tài tốt thì bất lợi Điền có thể giảm; chưa xác định đã thỏa điều kiện hoặc mức hỗ trợ.'],
 projectScope:[NPL_DIEN_SINGLE_METHOD,'Mở tập con theo phê duyệt sau1fe982b, không mở phương pháp đảo mọi sao.','Có chính tinh gốc, chỉ đúng một TT, ngoài Cơ–Cự Mão/Dậu đã được nhánh1.36 nhận. VCD/cảhaiTT giữ các nhánh cũ.','Toàn vẹn12cung/14chính tinh/profilev2; không dùng brightness, tuổi hoặc ID mẫu.'],knownExceptions:['Cơ–Cự Mão/Dậu/một TT ưu tiên rule cũ, không cùng xuất hai lời tương đương.','VCD và cảhaiTT có đoạn riêng, ngoài tập con mới.','Tài hỗ trợ giữ điều kiện trong cùng đoạn; một claim Tài thuận không chứng minh toàn Tài tốt. Không suy đã cứu/không được cứu.'],unknownConditions:['Thiếu/bất nhất cung/chính tinh/cặp TT giữ unknown; không suy vắng TT.','Phần Tài hỗ trợ luôn chưa xác định trong bản này, không đặt trọng số hoặc phân loại tốt/xấu tổng cung.'],readerLimit:'Chỉ tạo lập/duy trì nhà đất; chưa giải toàn U07 hoặc hoàn chỉnh Điền, không xác nhận tài sản thực tế.',applicability:'Điền có chính tinh với đúng một '+b.voidName+' trực tiếp, đúng tập con đã duyệt.',sourceScope:'Lời riêng NPL260 và giới hạn257/261; không chuyển sang tiền bạc, con cái hoặc vận hạn.'}
}));
