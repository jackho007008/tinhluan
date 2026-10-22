import raw from './natal-completion-content.json';
import type {ChartSnapshot} from '../tuvi-engine';
import {principalIntegrity,CHART_BRANCHES} from '../tuvi-engine/chart-integrity';
import {bookState} from '../tuvi-engine/tanbien';
import {voidMembership} from '../internal-review/career-definitions';
import type {DerivedFact} from './derived';
import {ruleSchema} from './schema';
export const NATAL_COMPLETION_METHOD='natal-local-completion-1.0.0';
export type CompletionBranch={id:string;kind:string;palace:string;life?:string;no?:string;mode?:string;stars?:string[];branches?:string[];page:number;section:string;text:string;title:string};
export const completionBranches:CompletionBranch[]=raw;
export const completionRuleId=(r:CompletionBranch)=>(r.kind==='polarity'?'npl.':'tanbien.')+r.id;
export type CompletionAssessment={value?:'yes'|'no';cause?:'missing-data'|'unsupported'|'unresolved-adjustment';text:string;paths:string[]};
const groups=[['Tử Vi','Thiên Phủ','Cự Môn','Thái Dương','Thiên Cơ','Thái Âm','Thiên Đồng','Thiên Lương'],['Thất Sát','Phá Quân','Liêm Trinh','Tham Lang'],['Vũ Khúc','Thiên Tướng']];
const stems=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
export const COMPLETION_SAT=['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp'];
/** Only predicates over a saved natal chart and versioned source tables; never an astrology engine. */
export function completionAssessment(s:ChartSnapshot,r:CompletionBranch,facet?:'phuc-dispersal'):CompletionAssessment{
 const paths=['chart.palaces','chart.tanBien.completeness'];
 const result=(value:CompletionAssessment['value'],text:string,cause?:CompletionAssessment['cause']):CompletionAssessment=>({value,text,cause,paths:[...paths]});
 const dispersal=facet==='phuc-dispersal'&&r.kind==='phuc-base'&&r.palace==='Phúc Đức'&&['phuc-base-tu-pha','phuc-base-tu-tham'].includes(r.id);
 if(facet&&!dispersal)return result('no','Vế ly tán chỉ được đặc tả cho Tử–Phá/Tử–Tham tọa Phúc Đức.','unsupported');
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return result(undefined,'Danh sách chính tinh chưa đầy đủ hoặc không hợp lệ.','missing-data');
 const p=s.chart.palaces.find(p=>p.name===r.palace),life=s.chart.palaces.find(p=>p.name==='Mệnh');
 if(!p||!life)return result(undefined,'Chưa xác định duy nhất cung cần xét.','missing-data');
 if(r.kind==='polarity'){
  paths.push('chart.tanBien.inputs.yearStem','chart.tanBien.inputs.yearBranch');
  const stem=s.chart.tanBien.inputs.yearStem,branch=s.chart.tanBien.inputs.yearBranch,a=stems.indexOf(stem),b=CHART_BRANCHES.indexOf(branch),c=CHART_BRANCHES.indexOf(life.earthlyBranch);
  if(a<0||b<0||c<0||a%2!==b%2)return result(undefined,'Can–chi năm sinh thiếu hoặc không nhất quán về âm dương.','missing-data');
  const aligned=a%2===c%2;
  return result((r.mode==='aligned')===aligned?'yes':'no',`Năm sinh ${stem} ${branch} thuộc ${a%2?'âm':'dương'}; cung Mệnh tại ${life.earthlyBranch} thuộc ${c%2?'âm':'dương'}. Quan hệ ${aligned?'thuận':'nghịch'} lý theo NPL.`);
 }
 let structure='';
 if(r.kind==='no-table'){
  const classify=(q:typeof p)=>{
   if(!q.majorStars.length)return null;
   const cells=q.majorStars.map(st=>{const state=bookState(st.name,q.earthlyBranch),group=groups.findIndex(g=>g.includes(st.name));
    if(!state?.value||group<0)return undefined;
    const suffix=['Miếu','Vượng','Đắc'].includes(state.value)?'+':state.value==='Hãm'?'-':null;
    return suffix?{key:'ABC'[group]+suffix,text:`${q.name}: ${st.name} tại ${q.earthlyBranch}, ${state.value}; ${state.source}`}:null;
   });
   if(cells.some(c=>c===undefined))return undefined;
   if(cells.some(c=>!c)||!cells.every(c=>c!.key===cells[0]!.key))return null;
   // Every principal maps to the SAME source cell. No majority, priority or mixed-state inference.
   return {key:cells[0]!.key,text:cells.map(c=>c!.text).join(' ')};
  };
  const a=classify(life),b=classify(p);
  if(a===undefined||b===undefined)return result(undefined,'Thiếu ô trạng thái nguồn cần dùng.','missing-data');
  if(!a||!b)return result('no','Ngoài phạm vi bảng triển khai: cần các chính tinh trong mỗi cung cùng một ô nhóm và cùng loại sáng (Miếu/Vượng/Đắc) hoặc Hãm; không gộp hai nhóm hay sáng–hãm hỗn hợp. Không mượn đối cung.','unsupported');
  structure=a.text+' '+b.text;
  if(a.key!==r.life||b.key!==r.no)return result('no',structure);
 }else{
  const names=p.majorStars.map(st=>st.name);
  if(names.length!==r.stars!.length||!r.stars!.every(n=>names.includes(n))||(r.branches!.length&&!r.branches!.includes(p.earthlyBranch)))return result('no','Không thỏa đúng cấu trúc Tử Vi tại Phúc Đức của nhánh.');
  const fields=['minorStars','adjectiveStars']as const;
  if(!fields.every(f=>s.chart.tanBien?.completeness[f]==='complete-with-declared-supplements'&&Array.isArray(p[f])&&p[f].every(st=>st&&(st as {scope?:string}).scope==='origin'&&typeof st.name==='string'&&st.name.trim())))return result(undefined,'Chưa có danh sách đầy đủ để xác nhận vắng sát tinh.','missing-data');
  const all=fields.flatMap(f=>p[f].map(st=>st.name));
  if(new Set(all).size!==all.length)return result(undefined,'Danh sách phụ tinh trùng, chưa thể xác nhận vắng sát tinh.','missing-data');
  const sat=all.filter(n=>COMPLETION_SAT.includes(n));
  if(sat.length&&!dispersal)return result(undefined,`Có ${sat.join(', ')} tại Phúc Đức; chưa chốt lượng từ và tác động của §6.1.37. Không xuất lời nền chưa điều chỉnh.`,'unresolved-adjustment');
  structure=dispersal?`${names.join('–')} bản mệnh cùng tọa Phúc Đức ${p.earthlyBranch}; chỉ xét vế họ hàng ly tán của TB132§6.1.1.`:`${names.join('–')} tại Phúc Đức ${p.earthlyBranch}; danh sách đầy đủ xác nhận không có sáu sát tinh thuộc §8.6 đồng cung.`;
 }
 paths.push('chart.tanBien.voidRanges');
 const ranges=s.chart.tanBien?.voidRanges,targets=r.kind==='no-table'?[life,p]:[p];
 if(!ranges||ranges.length!==2||new Set(ranges.map(v=>v.name)).size!==2||!ranges.some(v=>v.name==='Tuần Không')||!ranges.some(v=>v.name==='Triệt Lộ')||targets.some(q=>ranges.some(v=>voidMembership(q.earthlyBranch,v.branches)===undefined)))return result(undefined,'Cặp Tuần/Triệt thiếu hoặc chưa hợp lệ.','missing-data');
 if(dispersal)return result('yes',structure+' TB140§6.1.36–37 không đảo vế phân tán thành tụ họp; khá giả là phương diện khác. Không khôi phục các vế hưởng phúc, xứng ý, khá giả, xa quê hoặc sinh tử.');
 if(targets.some(q=>ranges.some(v=>v.branches.includes(q.earthlyBranch))))return result(undefined,'Có Tuần/Triệt trực tiếp tại cung đang xét; chưa đặc tả điều chỉnh của bảng/lời nền này.','unresolved-adjustment');
 return result('yes',structure+' Không có Tuần/Triệt trực tiếp tại cung đang xét; đây là giới hạn triển khai.');
}
export function completionFacts(s:ChartSnapshot):DerivedFact[]{return completionBranches.flatMap(r=>{const a=completionAssessment(s,r);return a.value===undefined?[]:[{id:'fact.'+r.id,derivationId:r.id,version:'1.0.0',value:a.value,text:a.text,evidencePaths:a.paths,status:'source-table' as const,limitation:NATAL_COMPLETION_METHOD+'; dữ kiện không đổi, không suy từ nhánh không khớp thành bất lợi.'}];});}
export const completionRules=completionBranches.map(r=>{
 const npl=r.kind==='polarity';
 const condition=r.kind==='no-table'?`Mọi chính tinh tọa Mệnh cùng thuộc ô ${r.life}; mọi chính tinh tọa Nô Bộc cùng thuộc ô ${r.no} của bảng §9.1.`:npl?`Âm dương tuổi và cung Mệnh ${r.mode==='aligned'?'cùng':'khác'} tính.`:`${r.stars!.join('–')} ${r.stars!.length===1?'đơn thủ':'đồng cung'} Phúc Đức${r.branches!.length?' tại '+r.branches!.join('/') :''}.`;
 return ruleSchema.parse({id:completionRuleId(r),version:r.kind==='no-table'?'0.2.0':'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.'+r.id,'fact.source-position-available'],conditions:[{fact:'fact.'+r.id,op:'eq',value:'yes'}],exceptions:[],claimTemplate:`Theo ${npl?'Nguyễn Phát Lộc':'Tân Biên'}, ${condition} ${r.text}`,evidencePaths:['chart.palaces','chart.tanBien.completeness',...(npl?['chart.tanBien.inputs']:['chart.tanBien.voidRanges'])],sourceReferences:[{id:npl?'npl-polarity':'tanbien-natal-completion',title:npl?'Nguyễn Phát Lộc — Tử Vi Tổng Hợp; Tử Vi Hàm Số':'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/natal-completion#'+(npl?'npl-107':`tb-${r.page}`),location:npl?'Tổng Hợp PDF107–108 §A.1a; định nghĩa can/chi tuổi Hàm Số PDF10. Số header bản đánh máy.':`PDF/trang in ${r.page} §${r.section}; ${r.kind==='no-table'?'bảng168–171, ngoại lệ173§9.2.11, bảng trạng thái33–39 và định nghĩa32–33':'ngoại lệ140§6.1.36–37, Lục Sát10§8.6'}.`,accessedOn:'2026-10-15',rights:'pending',rightsNote:npl?'TH SHA25682f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37; HS SHA2562a0245dcadaf77f2d8e35c9798893343c3be7117c5cc40a42087153ea5212709; ảnh đối chiếu, chưa phê duyệt.':'SHA2564d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc; ảnh đối chiếu, chưa phê duyệt.'}],conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:['Chú giải truyền thống cục bộ, không xác nhận hoàn cảnh hoặc phẩm hạnh người thật.'],presentation:{title:r.title,readingTheme:npl?'action':r.kind==='no-table'?'no':'phuc',contentType:r.kind==='no-table'?'method-gloss':'element-gloss',sourceConditions:[condition],projectScope:[r.kind==='no-table'?'tanbien-no-unanimous-cell-1.0.0':NATAL_COMPLETION_METHOD,npl?'Can–chi năm phải cùng tính; không dùng giới tính thay tuổi.':r.kind==='no-table'?'Cùng một ô nguồn: từng chính tinh ở mỗi cung phải có cùng nhóm và cùng loại sáng/hãm; không suy từ hai nhóm hoặc độ sáng khác nhau; chưa xuất nếu Tuần/Triệt trực tiếp tại Mệnh hoặc Nô. Trạng thái theo bảng TB; không thay brightness.':'Giới hạn dự án: chưa xuất nếu có bất kỳ Lục Sát hoặc Tuần/Triệt trực tiếp; xác nhận vắng từ danh sách đầy đủ.'],readerLimit:npl?'Chỉ xét âm dương tuổi–cung, không đánh giá cả cuộc đời.':r.kind==='no-table'?'Chỉ nói về quan hệ trợ giúp/bạn bè, không mặc định đó là quan hệ công sở hoặc phẩm hạnh của ai.':'Chú giải về Phúc Đức và dòng họ, không xác nhận hoàn cảnh một người thân cụ thể.',knownExceptions:[npl?'Không suy thuận lý xóa các kết quả nghịch của phép khác.':r.kind==='no-table'?'Tuần/Triệt§9.2.11 còn chờ phép điều chỉnh; không suy sáng/mờ hỗn hợp hoặc mượn đối cung.':'Tử Vi–sát tinh§6.1.37 và Tuần/Triệt§6.1.36 chưa có phép hợp nhất; chỉ xuất khi xác nhận vắng.'],unknownConditions:['Thiếu/chưa chứng nhận danh sách hoặc mâu thuẫn dữ kiện: unknown.'],applicability:'Bản mệnh; không sao lưu, không vận hạn.',sourceScope:npl?'Bổ sung phép xét riêng NPL.':r.kind==='no-table'?'Bổ sung phép phối hợp hai cung theo từng ô, không thay các chú giải phụ tinh.':'Bổ sung lời nền độc lập, không thay nhận định Phúc Đức cũ.'}});
});
