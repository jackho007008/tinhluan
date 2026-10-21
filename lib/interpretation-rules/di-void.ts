import type {ChartSnapshot} from '../tuvi-engine';
import {CHART_BRANCHES,principalIntegrity} from '../tuvi-engine/chart-integrity';
import {voidMembership} from '../internal-review/career-definitions';
import type {DerivedFact} from './derived';
import {ruleSchema} from './schema';

export const DI_VOID_METHOD='tanbien-di-direct-void-1.0.0';
export const DI_VOID_ID='tanbien.di-direct-void';
export const DI_VOID_FACT='fact.di-direct-void';
export const DI_VOID_TEXT='Tuần hoặc Triệt án tại Thiên Di gắn với việc ra ngoài thường gặp nhiều phiền lòng. Đây là nhận định riêng về yếu tố án ngữ, chưa phải kết luận chung của cung.';
export type DiVoidAssessment={value?:boolean;text:string;paths:string[]};

/** TB179§10.27: independent distress clause, for occupied and empty Di alike. */
export function diVoidAssessment(s:ChartSnapshot):DiVoidAssessment{
 const paths=['chart.tanBien.completeness.majorStars'];
 const result=(value:boolean|undefined,text:string)=>({value,text,paths});
 // Transport integrity checks, not conditions placed on the source sentence.
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)
  return result(undefined,'Chưa xác nhận dữ liệu 12 cung/14 chính tinh bản mệnh đầy đủ, duy nhất và hợp lệ; đây là kiểm tính toàn vẹn, không phải điều kiện chính tinh của TB179.');
 const ps=s.chart.palaces,i=ps.findIndex(p=>p.name==='Thiên Di'),j=ps.findIndex(p=>p.name==='Mệnh'),t=ps[i],d=ps[j];
 if(!t||!d)return result(undefined,'Thiếu định danh Mệnh hoặc Thiên Di.');
 paths.push(...ps.map((_,k)=>`chart.palaces.${k}.majorStars`),...['name','earthlyBranch'].flatMap(k=>[`chart.palaces.${i}.${k}`,`chart.palaces.${j}.${k}`]));
 if((CHART_BRANCHES.indexOf(d.earthlyBranch)+6)%12!==CHART_BRANCHES.indexOf(t.earthlyBranch))
  return result(undefined,'Định danh Mệnh–Thiên Di không nhất quán với vị trí đối cung.');
 paths.push('chart.tanBien.voidRanges');
 const ranges=s.chart.tanBien.voidRanges;
 if(!ranges||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.filter(v=>v.name===n).length===1)||ranges.some(v=>voidMembership(t.earthlyBranch,v.branches)===undefined))
  return result(undefined,'Chưa có hai cặp Tuần/Triệt duy nhất, kề nhau hợp lệ để kiểm án ngữ trực tiếp.');
 const active=ranges.filter(v=>v.branches.includes(t.earthlyBranch));
 if(!active.length)return result(false,'Không có Tuần/Triệt án trực tiếp Thiên Di; án ở cung khác hoặc chỉ xung chiếu không thay điều kiện này.');
 return result(true,`Thiên Di tại ${t.earthlyBranch} ${t.majorStars.length?'có chính tinh':'vô chính diệu'}; ${active.map(v=>v.name).join(' và ')} án trực tiếp. TB179§10.27 không giới hạn cặp sao hoặc tình trạng có/trống chính tinh. Chỉ áp vế phiền lòng độc lập, một lần dù có cả Tuần lẫn Triệt; không xóa, đảo hoặc mở lời nền khác. Các dòng Tham/Phá, Tướng và Mã không có mệnh đề hủy vế này; không xuất các vế tai nạn/sinh tử.`);
}
export function diVoidFacts(s:ChartSnapshot):DerivedFact[]{
 const a=diVoidAssessment(s);
 return a.value===undefined?[]:[{id:DI_VOID_FACT,derivationId:DI_VOID_METHOD,version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'source-table',limitation:'Lời phiền lòng TT trực tiếp tại Di; không kết luận chung, không mở nền Đồng–Âm.'}];
}
export const diVoidRules=[ruleSchema.parse({
 id:DI_VOID_ID,version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:[DI_VOID_FACT,'fact.source-position-available'],conditions:[{fact:DI_VOID_FACT,op:'eq',value:'yes'}],exceptions:[],claimTemplate:DI_VOID_TEXT,evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges'],
 sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:'PDF179§10.27, dưới tiêu đề Tuần, Triệt án ngữ trong chương Thiên Di: vế ra ngoài phiền lòng, không điều kiện chính tinh/VCD/cặp sao. Các dòng Tham/Phá, Tướng, Mã sau đó không quy định hủy vế này. PDF175–176: điều chỉnh Nhật–Nguyệt là phương diện riêng; không tổng hợp tốt/xấu. Bản277trang SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc.',accessedOn:'2026-10-21',rights:'pending',rightsNote:'Tái dùng hồ sơ và kho chữ đã kiểm; chỉ vế phiền lòng, loại sinh tử/tai nạn.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Không dự báo sinh tử/tai nạn hoặc khuyên di chuyển.','Không xóa/đảo lời chính tinh, không xuất nền Đồng–Âm chưa giải, không kết luận toàn cung.'],
 presentation:{title:'Tuần/Triệt án tại Thiên Di',readingTheme:'di',contentType:'combination',sourceConditions:['Tuần hoặc Triệt án ngữ trực tiếp tại Thiên Di.','Không yêu cầu chính tinh, vô chính diệu, cặp sao, địa chi, tuổi, giới hoặc độ sáng.'],projectScope:[DI_VOID_METHOD,'Tính hợp lệ dữ liệu: đủ12cung/14chính tinh bản mệnh; định danh Mệnh–Di đối cung; hai cặp TT duy nhất/kề nhau. Không phải điều kiện sách.','Giới hạn dự án: chỉ vế phiền lòng độc lập; loại sinh tử/tai nạn và chưa mở nền Đồng–Âm.','Dùng profile Tân Biên và vị trí nguồn đã đối chiếu; không nhập kết luận VCDTT của tác giả khác.'],readerLimit:'Nhận định riêng về án ngữ; chưa phải kết luận chung của cung.',knownExceptions:['Các dòng Tham/Phá, Tướng, Mã thêm phương diện khác, không nói hủy vế phiền lòng. Giữ chặn lời Mã tổng quát khi TT trực tiếp.','Điều chỉnh Nhật–Nguyệt/sáng–mờ không được dùng tự xóa hoặc đảo lời này, và lời này không thay chúng.'],unknownConditions:['Thiếu/bất nhất dữ liệu: unknown, không coi là vắng TT.','Quan hệ từng vế lời nền Đồng–Âm với điều chỉnh sao vẫn chưa giải.'],applicability:'Thiên Di có chính tinh hoặc vô chính diệu, TT trực tiếp tại cung; không lấy TT chỉ ở cung xung chiếu.',sourceScope:'Một vế độc lập TB179§10.27, không phát hành các vế sinh tử/tai nạn hoặc kết luận toàn cung.'}
})];
