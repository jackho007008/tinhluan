import rawData from './no-dien-content.json';
type Branch={id:string;palace:string;stars:string[];branches:string[];text:string;page:number;section:string;kind:string;config?:{palace:string;branch:string;stars:string[]}[]};
const data:Branch[]=rawData;
import type { ChartSnapshot } from '../tuvi-engine';
import type { DerivedFact } from './derived';
import { principalIntegrity, CHART_BRANCHES } from '../tuvi-engine/chart-integrity';
import { verifiedNatalTransformations } from '../tuvi-engine/natal-transformations';
import { voidMembership } from '../internal-review/career-definitions';
import { ruleSchema } from './schema';
export const NO_DIEN_METHOD = 'tanbien-no-dien-1.0.0';
export const noDienBranches = data;
export const noDienKey = (r: typeof data[number]) => (r.palace === 'Nô Bộc' ? 'no-' : 'dien-') + r.id;
export const noDienCondition = (r: typeof data[number]) => r.kind === 'tl-example' ? r.config!.map(c=>c.stars.join('–')+' tại '+c.palace+' '+c.branch).join('; ') : r.kind === 'both-void' ? 'Tuần và Triệt cùng trực tiếp tại Điền Trạch' : r.kind === 'void' ? 'Tuần hoặc Triệt trực tiếp tại Nô Bộc' : r.stars.join('–') + (r.kind === 'minor' ? ' bản mệnh tọa thủ ' : r.stars.length === 1 ? ' đơn thủ ' : ' đồng cung ') + r.palace + (r.branches.length ? ' tại ' + r.branches.join('/') : '');
export type NoDienAssessment = { value?: boolean; cause?: 'missing-data'|'unresolved-adjustment'; text: string; paths: string[] };
/** Existing snapshot predicates; no placement, state replacement, or virtual palace. */
export function noDienAssessment(s: ChartSnapshot, r: typeof data[number]): NoDienAssessment {
 const paths: string[] = ['chart.tanBien.completeness'];
 const result = (value: boolean|undefined,text:string,cause?:NoDienAssessment['cause']) => ({value,text,paths,cause});
 const found=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name===r.palace);
 if(found.length!==1 || s.chart.tanBien?.completeness?.majorStars!=='complete' || !principalIntegrity(s.chart).valid) return result(undefined,'Chưa có danh sách chính tinh đầy đủ, hợp lệ của đủ 12 cung.','missing-data');
 const {p,i}=found[0],base=`chart.palaces.${i}`; paths.push(base+'.name',base+'.earthlyBranch',base+'.majorStars');
 if(!CHART_BRANCHES.includes(p.earthlyBranch))return result(undefined,'Thiếu địa chi hợp lệ của cung.','missing-data');
 if(p.majorStars.some(st=>(st as {scope?:string}).scope!=='origin'))return result(undefined,'Danh sách chính tinh có mục chưa xác nhận lớp bản mệnh.','missing-data');
 let yes:boolean|undefined;
 if(r.kind==='tl-example'){
  for(const c of r.config!){const xs=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name===c.palace);if(xs.length!==1)return result(undefined,'Chưa xác định duy nhất cung '+c.palace,'missing-data');const q=xs[0];paths.push(`chart.palaces.${q.i}.majorStars`,`chart.palaces.${q.i}.earthlyBranch`);if(q.p.majorStars.some(st=>(st as {scope?:string}).scope!=='origin'))return result(undefined,'Chưa xác nhận chính tinh bản mệnh ở '+c.palace,'missing-data');if(q.p.earthlyBranch!==c.branch||q.p.majorStars.length!==c.stars.length||!c.stars.every(n=>q.p.majorStars.some(st=>st.name===n)))return result(false,'Không đúng toàn bộ cấu trúc của ví dụ Thiên Lương.');}
  yes=true;
 }else if(r.kind==='major')yes=p.majorStars.length===r.stars.length && r.stars.every(n=>p.majorStars.some(st=>st.name===n)) && (!r.branches.length||r.branches.includes(p.earthlyBranch));
 else if(r.kind==='minor'){
  const fields=['majorStars','minorStars','adjectiveStars'] as const;
  const stars=fields.flatMap(k=>Array.isArray(p[k])?p[k]:[]);paths.push(...fields.map(k=>base+'.'+k));
  const target=r.stars[0];
  if(target.startsWith('Hóa ')){
   const cert=verifiedNatalTransformations(s.chart);if(s.chart.natalTransformations)paths.push('chart.natalTransformations');
   if(s.chart.natalTransformations&&!cert)return result(undefined,'Chứng nhận Tứ Hóa không nhất quán; không xác nhận có hoặc không có Hóa tại cung.','missing-data');
   const positive=stars.some(st=>(st as {scope?:string}).scope==='origin'&&st.mutagen===target.slice(4));
   yes=positive?true:cert?false:undefined;
  }else if(target==='Tướng Quân'){
   const ring=(p as typeof p & {boshi12?:string}).boshi12;
   const names=['Bác Sỹ','Lực Sỹ','Thanh Long','Tiểu Hao','Tướng Quân','Tấu Thư','Phi Liêm','Hỷ Thần','Bệnh Phù','Đại Hao','Phục Binh','Quan Phù'];
   const rings=s.chart.palaces.map(q=>(q as typeof q & {boshi12?:string}).boshi12);
   paths.push(...s.chart.palaces.map((_,j)=>`chart.palaces.${j}.boshi12`));
   yes=ring===target?true:rings.every(n=>names.includes(n||''))&&new Set(rings).size===12?false:undefined;
  }else{
   const positive=stars.some(st=>(st as {scope?:string}).scope==='origin'&&st.name===target);
   const c=s.chart.tanBien?.completeness;
   const full=c?.minorStars==='complete-with-declared-supplements'&&c?.adjectiveStars==='complete-with-declared-supplements'&&fields.every(k=>Array.isArray(p[k])&&p[k].every(st=>(st as {scope?:string}).scope==='origin'));
   yes=positive?true:full?false:undefined;
  }
  if(yes===undefined)return result(undefined,'Chưa có bằng chứng bản mệnh hoặc độ đầy đủ để xác nhận sao/phép Hóa trong điều kiện này.','missing-data');
 }
 if(yes===false)return result(false,noDienCondition(r)+': không thỏa vị trí hoặc sao bắt buộc.');
 const ranges=s.chart.tanBien?.voidRanges;paths.push('chart.tanBien.voidRanges');
 if(!ranges||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))return result(undefined,'Chưa có hai cặp vị trí Tuần/Triệt hợp lệ để xét điều chỉnh trực tiếp.','missing-data');
 if(r.kind==='tl-example'){
 const affected=r.config!.filter(c=>ranges.some(v=>v.branches.includes(c.branch)));
 if(affected.length)return result(undefined,'Đúng cấu trúc ví dụ Thiên Lương nhưng có Tuần/Triệt trực tiếp tại '+affected.map(c=>c.palace).join(', ')+'. Ví dụ chưa đặc tả điều chỉnh này; dự án chưa xuất lời nền.','unresolved-adjustment');
 return result(true,noDienCondition(r)+'. Đúng cấu trúc đầy đủ của ví dụ Thiên Lương; không thay nhãn trạng thái lưu trong snapshot.');
 }
 const active=ranges.filter(v=>v.branches.includes(p.earthlyBranch));
 if(r.kind==='both-void')return result(active.length===2,`${p.name} tại ${p.earthlyBranch}: ${active.map(v=>v.name).join(', ')||'không có Tuần/Triệt'} trực tiếp. Nhánh riêng §7.33.`);
 if(r.kind==='void')return result(active.length>0,`${p.name} tại ${p.earthlyBranch}: ${active.map(v=>v.name).join(', ')||'không có Tuần/Triệt'} trực tiếp. Chỉ dùng mệnh đề đầu §9.2.11.`);
 if(active.length){
  if(p.name==='Điền Trạch'&&active.length===2)return result(false,'Cả Tuần và Triệt trực tiếp: giữ nhánh riêng §7.33; không xuất lời nền chưa điều chỉnh.');
  return result(undefined,`${active.map(v=>v.name).join(' và ')} trực tiếp tại ${p.name}. Đã có dữ kiện; chưa đặc tả được phép điều chỉnh ${p.name==='Điền Trạch'?'§7.32':'§9.2.11'} cho lời nền này.`, 'unresolved-adjustment');
 }
 return result(true,`${noDienCondition(r)}. Không có Tuần/Triệt trực tiếp tại cung. Dữ kiện lấy từ snapshot; không mượn sao cung khác.`);
}
export function noDienFacts(s:ChartSnapshot):DerivedFact[]{return data.flatMap(r=>{const a=noDienAssessment(s,r);return a.value===undefined?[]:[{id:'fact.'+noDienKey(r),derivationId:noDienKey(r),version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'engine-reported' as const,limitation:r.kind==='tl-example'?'Ví dụ vị trí Mệnh–Bào–Nô của Thiên Lương; không thay bảng trạng thái hoặc tổng quát hóa ngoài cấu trúc đã nêu.':'Phạm vi cục bộ của đúng cung; phương pháp trạng thái: none, chỉ dùng địa chi/tổ hợp được nguồn nêu.'}];});}
export const noDienRules=data.map(r=>ruleSchema.parse({
 id:'tanbien.'+noDienKey(r),version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.'+noDienKey(r),'fact.source-position-available'],conditions:[{fact:'fact.'+noDienKey(r),op:'eq',value:'yes'}],exceptions:[],
 claimTemplate:`Theo ${r.kind==='tl-example'?'Thiên Lương':'Tân Biên'}, ${noDienCondition(r)}, sách ${r.text}`,
 evidencePaths:['chart.palaces','chart.tanBien.voidRanges'],
 sourceReferences:[{id:r.kind==='tl-example'?'thienluong-supplied-pdf':'tanbien-supplied-pdf',title:r.kind==='tl-example'?'Thiên Lương — Tử Vi Nghiệm Lý Toàn Thư':'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:r.kind==='tl-example'?`PDF ${r.page}, ${r.section}; ngữ cảnh PDF155–159 bản 298 trang. Chỉ dẫn và vị trí trong chính ví dụ; không ghép với bảng nhóm Tân Biên.`:`PDF/trang in ${r.page}, §${r.section}${r.palace==='Điền Trạch'&&r.stars.includes('Cự Môn')?'; cùng PDF151–152 §7.9 (thị phi, tranh chấp)':''}; ngữ cảnh toàn mục ${r.palace==='Nô Bộc'?'9 (168–173)':'7 (149–157)'}. Định nghĩa vị trí: PDF33 §2.6–2.8. Điều chỉnh: ${r.palace==='Nô Bộc'?'PDF173 §9.2.11':'PDF155 §7.32–7.33'}.`,accessedOn:'2026-10-13',rights:'pending',rightsNote:'Đối chiếu văn bản và ảnh; chưa có phê duyệt chuyên môn.'}],conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Chú giải truyền thống có điều kiện, không xác nhận tài sản, tương lai hoặc phẩm hạnh của người thật.','Không hợp nhất các nhận định thành kết luận toàn cung.'],
 presentation:{title:noDienCondition(r),readingTheme:r.palace==='Nô Bộc'?'no':'dien',contentType:r.kind==='tl-example'||r.stars.length>1?'combination':'element-gloss',sourceConditions:[noDienCondition(r)],projectScope:[r.kind==='tl-example'?'thienluong-no-examples-1.0.0':NO_DIEN_METHOD,r.kind==='tl-example'?'Phương pháp trạng thái: các vị trí cụ thể được ví dụ nguồn nêu; không tra bảng Tân Biên hay engine để thay nhãn nguồn. Giới hạn dự án: chưa áp khi có Tuần/Triệt trực tiếp tại một trong ba cung.':'Trạng thái: none; không dùng bảng engine thay lời địa chi của nguồn.',['void','both-void'].includes(r.kind)?'Nhánh riêng về vị trí Tuần/Triệt, không đảo nghĩa từng sao.':'Nhánh nền chỉ xuất khi xác nhận không có Tuần/Triệt trực tiếp; đây là giới hạn dự án để không xuất lời chưa được điều chỉnh.','Danh sách chính tinh đầy đủ và hợp lệ; các nhóm chính tinh chỉ dùng đúng tổ hợp, không hội chiếu.'],readerLimit:r.palace==='Nô Bộc'?'Sách đang mô tả quan hệ với người trợ giúp hoặc bạn bè trong phạm vi đoạn này; không xác định phẩm hạnh hay hành vi của một người cụ thể.':'Đây là liên hệ truyền thống về nhà đất, chưa tổng hợp các yếu tố khác; không xác nhận tài sản hay thời điểm giao dịch thực tế.',knownExceptions:[r.kind==='tl-example'?'Ví dụ chưa mô tả cách phối hợp các sao bổ sung hoặc Tuần/Triệt. Không xuất khi có Tuần/Triệt trực tiếp tại một trong ba cung; đây là giới hạn triển khai.':r.palace==='Nô Bộc'?'§9.2.11 có điều chỉnh theo nhiều sao sáng/mờ; chưa có ngưỡng hoặc cách hợp nhất. Không xuất lời nền khi có Tuần/Triệt trực tiếp.':'§7.32 có điều chỉnh Tuần/Triệt chưa có phép đảo từng nhận định. Cả hai trực tiếp dùng riêng §7.33.'],unknownConditions:['Chưa có phép hợp nhất toàn cung và các cung liên quan.'],applicability:'Đúng vị trí bản mệnh và phạm vi nguồn; không áp sang cung khác.',sourceScope:r.palace+'; không luận vận hoặc đưa khuyến nghị tài chính.'}
}));
