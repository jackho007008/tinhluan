import type {ChartSnapshot} from '../tuvi-engine';
import {CHART_BRANCHES,principalIntegrity} from '../tuvi-engine/chart-integrity';
import {voidMembership} from '../internal-review/career-definitions';
import type {DerivedFact} from './derived';
import {ruleSchema} from './schema';
export const DONG_AM_DI_METHOD='project-dong-am-di-receiver-void-1.0.0';
export const DONG_AM_DI_ID='tanbien.di-dong-am-receiver-void';
export const DONG_AM_DI_TEXT='Thiên Di không có chính tinh, nhận Thiên Đồng–Thái Âm từ Mệnh xung chiếu. Khi Tuần hoặc Triệt án ngay tại Thiên Di, lời riêng về yếu tố này nói đến việc ra ngoài thường gặp nhiều phiền lòng. Nhận định này nói về yếu tố án ngữ, chưa đánh giá kết quả chung của mọi sao trong cung.';
export type DongAmDiAssessment={value?:boolean;text:string;paths:string[]};
/** Direct receiving-palace clause only. This never activates the unresolved pair baseline. */
export function dongAmDiAssessment(s:ChartSnapshot):DongAmDiAssessment{
 const paths=['chart.tanBien.completeness.majorStars'];
 const result=(value:boolean|undefined,text:string)=>({value,text,paths});
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)
  return result(undefined,'Chưa xác nhận đủ 14 chính tinh bản mệnh, duy nhất trên 12 cung hợp lệ.');
 const ps=s.chart.palaces,i=ps.findIndex(p=>p.name==='Thiên Di'),j=ps.findIndex(p=>p.name==='Mệnh'),t=ps[i],d=ps[j];
 if(!t||!d)return result(undefined,'Thiếu định danh Mệnh hoặc Thiên Di.');
 paths.push(...ps.map((_,k)=>`chart.palaces.${k}.majorStars`),...['name','earthlyBranch'].flatMap(k=>[`chart.palaces.${i}.${k}`,`chart.palaces.${j}.${k}`]));
 if((CHART_BRANCHES.indexOf(d.earthlyBranch)+6)%12!==CHART_BRANCHES.indexOf(t.earthlyBranch))
  return result(undefined,'Mệnh và Thiên Di không nhất quán với vị trí xung chiếu.');
 if(t.majorStars.length!==0||d.majorStars.length!==2||!['Thiên Đồng','Thái Âm'].every(n=>d.majorStars.some(st=>st.name===n))||!['Tý','Ngọ'].includes(d.earthlyBranch))
  return result(false,'Không thuộc tập con Di vô chính diệu nhận đúng Đồng–Âm tại Mệnh Tý/Ngọ.');
 paths.push('chart.tanBien.voidRanges');
 const ranges=s.chart.tanBien.voidRanges;
 if(!ranges||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.filter(v=>v.name===n).length===1)||ranges.some(v=>voidMembership(t.earthlyBranch,v.branches)===undefined))
  return result(undefined,'Chưa có hai cặp Tuần/Triệt duy nhất, kề nhau hợp lệ để kiểm án ngữ trực tiếp.');
 const active=ranges.filter(v=>v.branches.includes(t.earthlyBranch));
 if(!active.length)return result(false,'Không có Tuần/Triệt trực tiếp ở Di; TT ở Mệnh không thay cho TT ở Di. Lời nền Đồng–Âm vẫn chưa được áp bởi phương pháp này.');
 return result(true,`Thiên Di tại ${t.earthlyBranch} không có chính tinh; Đồng–Âm thật tại Mệnh ${d.earthlyBranch} xung chiếu. ${active.map(v=>v.name).join(' và ')} án trực tiếp Di. Chỉ áp vế phiền lòng TB179§10.27; không xuất nền Đồng–Âm hoặc suy TT ở Di đổi trạng thái Thái Âm tại Mệnh. Cặp là giới hạn task, không phải điều kiện nguồn của lời TTDi. Giữ chi thật theo hợp đồng phối hợp dự án TB175–176/180 và HS52, không nhận là công thức nguyên văn Tân Biên.`);
}
export function dongAmDiFacts(s:ChartSnapshot):DerivedFact[]{const a=dongAmDiAssessment(s);return a.value===undefined?[]:[{id:'fact.di-dong-am-receiver-void',derivationId:DONG_AM_DI_METHOD,version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'source-table',limitation:'Chỉ lời TT trực tiếp tại Di, không áp lời nền cặp hoặc giải phép phối hợp toàn cung.'}];}
export const dongAmDiRules=[ruleSchema.parse({id:DONG_AM_DI_ID,version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.di-dong-am-receiver-void','fact.source-position-available'],conditions:[{fact:'fact.di-dong-am-receiver-void',op:'eq',value:'yes'}],exceptions:[],claimTemplate:DONG_AM_DI_TEXT,evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges'],
 sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:'PDF179§10.27: chỉ vế “Ra ngoài hay gặp nhiều sự phiền lòng”; không xuất vế sinh tử hoặc tai nạn. PDF175§10.3/176§10.8 và180§10.36 định vị tập con Đồng–Âm/Di, không áp lời nền chưa giải; PDF36§3.8 là điều chỉnh riêng Thái Âm, không biến TT tại Di thành án trực tiếp ở Mệnh. Bản277trang SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc.',accessedOn:'2026-10-21',rights:'pending',rightsNote:'Tái dùng hồ sơ và đúng đoạn nguồn, không ghép thành kết luận toàn cung.'},{id:'npl-dong-am-di-position',title:'Nguyễn Phát Lộc — Tử Vi Hàm Số; Tử Vi Tổng Hợp',url:'/internal/editorial/npl-foundation#hs-011',location:'Hàm Số PDF52: không dời sao xung chiếu; Tổng Hợp PDF91: phân biệt tác động trực tiếp và sao chiếu. Chỉ đối chiếu phạm vi; nhận định phiền lòng lấy riêng từ TB179, không nhập đánh giá VCDTT chung của HS51/226.',accessedOn:'2026-10-21',rights:'pending',rightsNote:'Phương pháp chọn chi là phối hợp hữu hạn của dự án đã được chủ dự án duyệt, không công thức nguyên văn TB.'}],conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Chỉ phiền lòng khi ra ngoài, không dự báo tai nạn, sinh tử hoặc khuyên di chuyển.','Không xuất lời nền Đồng–Âm chưa giải; không đảo, xóa hoặc tổng hợp các nhận định khác.'],presentation:{title:'Thiên Di vô chính diệu, Đồng–Âm xung chiếu và Tuần/Triệt trực tiếp',readingTheme:'di',contentType:'combination',sourceConditions:['Tuần hoặc Triệt án ngữ trực tiếp tại Thiên Di.','Chỉ vế phiền lòng TB179§10.27, không phải lời của cặp Đồng–Âm.'],projectScope:[DONG_AM_DI_METHOD,'Giới hạn lô ở Di trống, Đồng–Âm tại Mệnh Tý/Ngọ xung chiếu; nguồn TTDi rộng hơn.','12 cung/14 chính tinh đầy đủ, hợp lệ, bản mệnh; cặp Tuần/Triệt hợp lệ.','Giữ chi thật theo phối hợp dự án TB–HS đã duyệt. Không dời sao hoặc chuyển Tứ Hóa/phụ tinh sang Di.'],readerLimit:'Nhận định cục bộ về án ngữ tại Di; chưa phải kết quả chung của cặp sao hoặc toàn cung.',knownExceptions:['Điều chỉnh sáng–mờ Thái Âm khi TT tại Mệnh không bị bỏ qua: lời nền cặp vẫn chưa xuất.','Không có phép hủy vế phiền lòng bằng Hóa Khoa/Lộc hoặc nhận định thuận về VCDTT của nguồn khác.'],unknownConditions:['Thiếu/bất nhất cấu trúc hoặc vị trí TT: không xuất.','Quan hệ điều chỉnh TT/các sao khác với từng vế lời nền Đồng–Âm còn chưa giải; rule này không tuyên bố đã giải.'],applicability:'Di VCD, đúng cặp bản mệnh ở Mệnh Tý/Ngọ và TT trực tiếp tại Di; không dùng TT chỉ ở đối cung.',sourceScope:'Chỉ lời TT tại Di; không phát hành ba đoạn thẩm định hoặc suy kết quả tổng hợp.'}})];
