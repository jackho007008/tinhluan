import raw from './phu-huynh-content.json';
import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {principalIntegrity,CHART_BRANCHES} from '../tuvi-engine/chart-integrity';
import {verifiedNatalTransformations} from '../tuvi-engine/natal-transformations';
import {voidMembership} from '../internal-review/career-definitions';
import {ruleSchema} from './schema';
export type FamilyBranch={id:string;palace:string;stars:string[];branches:string[];text:string;page:number;section:string;mode:string;wealth:boolean;coveredBy?:string[]};
export const familyBranches:FamilyBranch[]=raw;
export const familyKey=(r:FamilyBranch)=>(r.palace==='Phụ Mẫu'?'parents-':'siblings-')+r.id;
export const familyCondition=(r:FamilyBranch)=>r.stars.join('–')+(r.mode==='exact'?(r.stars.length===1?' đơn thủ ':' đồng cung '):' tọa thủ ')+r.palace+(r.branches.length?' tại '+r.branches.join('/'):'');
export type FamilyAssessment={value?:boolean;cause?:'missing-data'|'unresolved-adjustment';text:string;paths:string[]};
export function familyAssessment(s:ChartSnapshot,r:FamilyBranch):FamilyAssessment{
 const paths=['chart.tanBien.completeness'];const ret=(value:boolean|undefined,text:string,cause?:FamilyAssessment['cause'])=>({value,text,cause,paths});
 const ps=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name===r.palace);
 if(ps.length!==1||s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return ret(undefined,'Thiếu danh sách chính tinh đầy đủ và hợp lệ của 12 cung.','missing-data');
 const {p,i}=ps[0],base=`chart.palaces.${i}`;paths.push(base+'.name',base+'.earthlyBranch',base+'.majorStars');
 if(!CHART_BRANCHES.includes(p.earthlyBranch)||p.majorStars.some(st=>(st as {scope?:string}).scope!=='origin'))return ret(undefined,'Chưa xác nhận địa chi hoặc lớp chính tinh bản mệnh.','missing-data');
 if(r.branches.length&&!r.branches.includes(p.earthlyBranch))return ret(false,'Không đúng địa chi nguồn quy định.');
 let match:boolean|undefined;
 if(['exact','presence'].includes(r.mode)) match=r.stars.every(n=>p.majorStars.some(st=>st.name===n))&&(r.mode==='presence'||p.majorStars.length===r.stars.length);
 else if(r.mode==='ring'){
  paths.push(base+'.changsheng12');
  const ring=(p as typeof p & {changsheng12?:string}).changsheng12;match=['Tràng Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng'].includes(ring||'')?ring===r.stars[0]:undefined;
 }else{
  const keys=['majorStars','minorStars','adjectiveStars'] as const;
  const stars=keys.flatMap(k=>Array.isArray(p[k])?p[k]:[]);paths.push(...keys.filter(k=>Array.isArray(p[k])).map(k=>base+'.'+k));
  if(r.stars[0].startsWith('Hóa ')){
   const cert=verifiedNatalTransformations(s.chart);if(s.chart.natalTransformations)paths.push('chart.natalTransformations');
   if(s.chart.natalTransformations&&!cert)return ret(undefined,'Chứng nhận Tứ Hóa không nhất quán với snapshot.','missing-data');
   const positive=stars.some(st=>(st as {scope?:string}).scope==='origin'&&st.mutagen===r.stars[0].slice(4));match=positive?true:cert?false:undefined;
  }else{
   const complete=s.chart.tanBien?.completeness;
   match=stars.some(st=>(st as {scope?:string}).scope==='origin'&&st.name===r.stars[0])?true:complete?.minorStars==='complete-with-declared-supplements'&&complete?.adjectiveStars==='complete-with-declared-supplements'&&keys.every(k=>Array.isArray(p[k])&&p[k].every(st=>(st as {scope?:string}).scope==='origin'))?false:undefined;
  }
 }
 if(match===undefined)return ret(undefined,'Chưa có bằng chứng bản mệnh hoặc chứng nhận đầy đủ để xác nhận điều kiện này.','missing-data');
 if(!match)return ret(false,'Không có đúng sao/tổ hợp tọa thủ bắt buộc; không mượn sao cung khác.');
 if(r.mode==='ky-base'&&['Sửu','Mùi'].includes(p.earthlyBranch)&&['Thái Dương','Thái Âm'].every(n=>p.majorStars.some(st=>st.name===n)))return ret(undefined,'Có Hóa Kỵ cùng Nhật–Nguyệt tại Sửu/Mùi. §5.2.25 nêu lời riêng về giàu sang nhưng chưa nói rõ thay hay giữ ý bất hòa; chưa xuất nhánh nền.','unresolved-adjustment');
 // §5.2.30 explicitly governs wealth/status. It is NOT a blanket absence condition for relation-only clauses or Huynh Đệ.
 if(r.wealth){
  const ranges=s.chart.tanBien?.voidRanges;paths.push('chart.tanBien.voidRanges');
  if(!ranges||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))return ret(undefined,'Thiếu vị trí Tuần/Triệt hợp lệ để kiểm tra điều chỉnh của phần giàu nghèo, sang hèn.','missing-data');
  if(ranges.some(v=>v.branches.includes(p.earthlyBranch)))return ret(undefined,'Tuần/Triệt trực tiếp tại Phụ Mẫu; §5.2.30 yêu cầu đổi cách luận giàu nghèo, sang hèn, nhưng chưa đặc tả được kết quả cho đoạn này. Không xuất nguyên lời nền.','unresolved-adjustment');
 }
 // These source-wide relation clauses already occur in some narrower branches.
 // The same structural assessment with wealth=false is the existing 1.64 contract;
 // it also covers the saved relation-only companion when TT holds the full base.
 if(r.coveredBy){
  const covered=r.coveredBy.map(id=>{const b=familyBranches.find(b=>b.palace===r.palace&&b.id===id);if(!b)throw Error('UNKNOWN_COVERAGE_REFERENCE:'+id);return familyAssessment(s,{...b,wealth:false});}).find(a=>a.value===true);
  if(covered){paths.push(...covered.paths);return ret(false,'Vế quan hệ đã có ở nhánh nền hoặc nhánh độc lập giữ qua TT; không xuất trùng.');}
  // Unknown covering conditions do not emit claims, so cannot cause duplication.
 }
 return ret(true,familyCondition(r)+'. Vị trí và lớp bản mệnh lấy từ snapshot; không dùng trạng thái engine thay điều kiện địa chi.');
}
export function familyFacts(s:ChartSnapshot,branches:FamilyBranch[]=familyBranches):DerivedFact[]{return branches.flatMap(r=>{const a=familyAssessment(s,r);return a.value===undefined?[]:[{id:'fact.'+familyKey(r),derivationId:familyKey(r),version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'engine-reported' as const,limitation:'Chú giải cục bộ đúng cung; bảng trạng thái: none, dùng vị trí được nguồn nêu; không tổng hợp toàn cung.'}];});}
// PDF127/128 and219/220: retain the independent lack-of-harmony clause.
// Conditional/prescriptive separation is not an unconditional family prediction.
const correctedRelation=(r:FamilyBranch)=>['parents-co-cu','siblings-dong-cu'].includes(familyKey(r));
export const makeFamilyRule=(r:FamilyBranch)=>ruleSchema.parse({
 id:'tanbien.'+familyKey(r),version:correctedRelation(r)?'0.1.1':'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.'+familyKey(r),'fact.source-position-available'],conditions:[{fact:'fact.'+familyKey(r),op:'eq',value:'yes'}],exceptions:[],claimTemplate:`Theo Tân Biên, ${familyCondition(r)}, sách ${r.text}`,evidencePaths:['chart.palaces'],
 sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:correctedRelation(r)?`Trang PDF${r.page}, §${r.section}; đối chiếu câu lặp ${r.palace==='Phụ Mẫu'?'PDF128 §5.2.10':'PDF220 §15.2.10'}. Giữ câu độc lập trong nhà thiếu hòa khí; không chuyển lời khuyên hoặc điều kiện xa cách để tránh tổn hại thành dự báo. Ngữ cảnh ${r.palace==='Phụ Mẫu'?'PDF124–131; §5.2.30 chỉ đổi giàu nghèo/sang hèn':'PDF217–224; yêu cầu xét Phúc Đức PDF217'}; định nghĩa đồng cung PDF33. Bản277trang SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc.`:`PDF/trang in ${r.page}, §${r.section}; toàn mục ${r.palace==='Phụ Mẫu'?'5, PDF124–131; điều chỉnh §5.2.30':'15, PDF217–224; giới hạn liên cung Phúc Đức PDF217'}. Định nghĩa tọa thủ/đơn thủ/đồng cung: PDF33 §2.6–2.8.`,accessedOn:r.coveredBy||r.id==='am-low-cohabitation'?'2026-10-22':correctedRelation(r)?'2026-10-21':'2026-10-13',rights:'pending',rightsNote:'Đã đối chiếu ảnh trang; chưa phê duyệt chuyên môn.'}],conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Không xác nhận hoàn cảnh, phẩm hạnh, hành vi hay sự kiện của người thân từ lá số này.','Không suy số anh chị em, bệnh tật, tuổi thọ hoặc sự mất còn.'],
 presentation:{title:familyCondition(r),readingTheme:r.palace==='Phụ Mẫu'?'parents':'siblings',contentType:r.stars.length>1?'combination':'element-gloss',sourceConditions:[familyCondition(r)],projectScope:['tanbien-family-1.0.0; trạng thái: none, điều kiện địa chi trực tiếp của nguồn.',...(r.coveredBy?['Câu quan hệ chung mọi vị trí; dự phòng khi các nhánh hẹp '+r.coveredBy.join('/')+' chưa chứa ý này. Kiểm cấu trúc của cả bản đầy đủ và vế độc lập qua TT bằng cùng familyAssessment với wealth=false; đây là chống trùng dự án, không thêm điều kiện nguồn.']:[]),r.wealth?'Chưa xuất phần giàu nghèo/sang hèn khi Tuần/Triệt trực tiếp: điều chỉnh §5.2.30 chưa có phép áp dụng cụ thể.':'Không thêm điều kiện vắng Tuần/Triệt vào mệnh đề độc lập này.','Chỉ diễn giải cục bộ sao tọa thủ; không chạy trên cung giả hoặc sao đối cung.','Biên tập bỏ số lượng, thứ bậc, mất còn, bệnh tật, lời khuyên xa gia đình/làm con nuôi và quy kết phẩm hạnh; không thay bằng ý thuận lợi.'],readerLimit:r.palace==='Phụ Mẫu'?'Đây là chú giải cục bộ về quan hệ hoặc hoàn cảnh gia đình trong sách, không xác nhận thực tế về cha mẹ; chưa tổng hợp các chú giải khác chiều, sao phụ và ảnh hưởng liên cung.':'Đây là chú giải cục bộ, không xác định người anh/chị/em cụ thể. Chưa phối hợp Phúc Đức và các yếu tố khác để kết luận quan hệ gia đình.',knownExceptions:[r.wealth?'Tuần/Triệt trực tiếp: giữ unresolved, không đảo nghĩa tự động.':r.mode==='ky-base'?'Nhật–Nguyệt cùng cung Sửu/Mùi: giữ unresolved vì chưa rõ quan hệ giữa hai mệnh đề §5.2.25.':'Không coi việc đoạn này không nêu ngoại lệ là chứng minh không có điều chỉnh khác.'],unknownConditions:['Chưa có quy tắc hợp nhất các chú giải khác chiều hoặc liên cung.'],applicability:'Bản mệnh đúng cung, sao và địa chi; danh sách đầy đủ, hợp lệ.',sourceScope:r.palace+'; không luận vận hoặc khẳng định sự kiện gia đình.'}
});
export const familyRules=familyBranches.map(makeFamilyRule);
