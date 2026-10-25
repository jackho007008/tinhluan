import {VTTL_CAREER_CO_AM} from '../interpretation-rules/vttl-career-co-am';
import {VTTL_DIEN_PHU} from '../interpretation-rules/vttl-dien-phu';
import {SPEND201,TRUNGCHAU_RULE_IDS} from '../interpretation-rules/trungchau-natal';
import {M05} from '../interpretation-rules/life-literary';
import {buildCandidatePresentation, type CandidatePresentation} from './candidate-presentation';
import {LIEM_TUONG} from '../interpretation-rules/npl-local-adjustments';
import {buildFinanceAssets} from './finance-assets';
import type { ChartSnapshot } from '../tuvi-engine';
import type { buildTanBienReading } from './tanbien-reading';
import { subjectOf } from '../exploration/model';
import { evidenceLayers } from './tanbien-presentation';
import {reportGap,readerHeading,readerPlace} from './report-editorial';
export const CONTINUOUS_VERSION = 'continuous-report-1.9.0';
export const PALACE_ORDER = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Nữ','Phu Thê','Huynh Đệ'];
type Reading = ReturnType<typeof buildTanBienReading>;
type Paragraph = Reading['sections'][number]['paragraphs'][number];
export const COORDINATION_DECISIONS = [
 {id:'A',palace:'Điền Trạch',left:['tanbien.dien-tu-tuong'],right:['tanbien.dien-da'],title:'Hai mô tả khác chiều về nhà đất',text:'Nhánh Tử Vi–Thiên Tướng nói về cơ nghiệp và tạo dựng; nhánh Đà La nói không có cơ nghiệp hoặc mất phần thừa hưởng. Chưa xác định được cách phối hợp hai mô tả về nhà đất này. Không kết luận bên nào lấn át hoặc tự chia thành các giai đoạn cuộc đời.',source:'Tân Biên PDF/trang in 149 §7.1;153 §7.16;155 §7.32–33. Đối chiếu quy trình Hàm Số PDF33,49,76–77: nguyên tắc định tính chưa xác định tác động của cặp này.'},
 {id:'B',palace:'Phụ Mẫu',left:['tanbien.parents-liem-tham','tanbien.parents-tham-dan-than'],right:['tanbien.parents-loc','tanbien.parents-hoa-loc'],title:'Hai mô tả khác chiều về hoàn cảnh vật chất',text:'Nhánh Liêm–Tham hoặc Tham Lang mô tả thiếu thốn; nhánh Lộc Tồn hoặc Hóa Lộc nói đến của cải của cha mẹ. Các ý về hòa khí và xa cách vẫn có phạm vi riêng. Chưa có kết luận chung về hoàn cảnh vật chất, cũng chưa có căn cứ chia thành trước nghèo sau giàu.',source:'Tân Biên PDF/trang in 125 §5.2.2;127–128 §5.2.9;130 §5.2.21–22;131 §5.2.30. Không tự định nghĩa mức tốt/xấu để áp nghịch đảo Tuần/Triệt.'},
 {id:'B-vcd',palace:'Phụ Mẫu',left:['tanbien.parents-vcd-liem-tham'],right:['tanbien.parents-loc','tanbien.parents-hoa-loc'],title:'Hai mô tả khác chiều về hoàn cảnh vật chất',text:'Liêm–Tham xung chiếu Phụ Mẫu không có chính tinh mô tả thiếu thốn; Lộc Tồn hoặc Hóa Lộc tại Phụ Mẫu nói đến của cải của cha mẹ. Chưa có kết luận chung về hoàn cảnh vật chất, cũng chưa có căn cứ chia thành trước nghèo sau giàu. Các ý về hòa khí và xa cách vẫn có phạm vi riêng.',source:'Tân Biên trang PDF125 §5.2.2;130 §5.2.21–22;131 §5.2.30–31. Giữ hai lời riêng chưa có phép hợp nhất; không chuyển Lộc hoặc Hóa Lộc từ đối cung.'},
 {id:'C',palace:'Tài Bạch',left:['tanbien.finance-co-luong'],right:['tanbien.finance-extra-ky-general'],title:'Hai ý về tài lộc chưa có phép phối hợp',text:'Cơ–Lương được nguồn liên hệ với việc tạo của thuận lợi, còn Hóa Kỵ được mô tả là hao tán. Chưa có căn cứ ghép thành “kiếm được nhưng không giữ được” hoặc coi một ý đã hóa giải ý kia. Ngoại lệ Nhật–Nguyệt không áp sang Cơ–Lương.',source:'Tân Biên PDF/trang in 191 §12.5–6;195 §12.23;196 §12.34. Thiên Lương PDF60–62,123–126 và Hàm Số PDF119–120,125–128,168–170 trong hồ sơ đối chiếu chưa xác định quan hệ điều chỉnh cho cặp tại Tài.'},
 {id:'D',palace:'Quan Lộc',left:['tanbien.career-occupation-sat-ty-ngo','tanbien.career-occupation-sat-dan-than'],right:['tanbien.career-kinh-luc'],title:'Những mô tả công việc chưa được hợp nhất',text:'Nhánh Thất Sát có mô tả về công danh theo vị trí, còn Kình–Lực nói đến trắc trở và sự khó bền lâu. Giữ cả giới hạn trong từng đoạn; chưa có quy tắc xác định kết quả chung, mức độ hoặc giai đoạn ứng với từng ý.',source:'Tân Biên PDF/trang in 162–163 §8.13;165–166 §8.32. Thiên Lương PDF60–62 về Mệnh/hạn không được chuyển thành phép điều chỉnh Quan Lộc.'},
] as const;
const has=(p:Paragraph,ids:readonly string[])=>p.claim.rules.some(r=>ids.includes(r.id));
export function phucDispersalCopy(ids:string[]){
 const gradual=ids.some(id=>id==='tanbien.phuc-sun-low-local-dispersal'||id==='tanbien.phuc-luong-ty-hoi-local-dispersal');
 if(ids.includes('tanbien.phuc-loc-ton')){
  const named=ids.includes('tanbien.phuc-sun-low-local-dispersal')?'Thái Dương':ids.includes('tanbien.phuc-luong-ty-hoi-local-dispersal')?'Thiên Lương':'các tổ hợp đã khớp';
  return 'Lộc Tồn tại Phúc Đức được liên hệ với hưởng phúc; họ hàng hiếm người, khá giả nhưng dễ tranh chấp. Lời về sự phân tán trong họ được giữ chung với '+named+(gradual?', trong đó '+named+' mô tả chiều hướng ngày càng phân tán.':'.')+(ids.includes('tanbien.phuc-hoa-ky')?' Hóa Kỵ cũng có lời về tranh chấp trong họ.':'')+' Các căn cứ không xác nhận hoàn cảnh thực tế hoặc làm tăng mức độ của nhận định.';
 }
 return 'Các tổ hợp đã khớp tại Phúc Đức cùng có lời về họ hàng '+(gradual?'ngày càng phân tán.':'phân tán.')+(ids.includes('tanbien.phuc-hoa-ky')?' Hóa Kỵ còn có lời về tranh chấp trong họ.':'')+' Các căn cứ được giữ chung, không cộng mức độ hoặc kết luận hoàn cảnh thực tế của gia đình.';
}
export function coordinate(palace:string, ps:Paragraph[]) {
 const used=new Set<string>();
 const groups:{text:string;members:Paragraph[];editorial:string|null}[]=[];
 const merge=(ids:string[],text:string,editorial:string)=>{const members=ids.map(id=>ps.find(p=>has(p,[id])));if(members.every(Boolean)){const values=members as Paragraph[];groups.push({text,members:values,editorial});values.forEach(p=>used.add(p.claim.id));}};
 if(palace==='Mệnh')merge(['tanbien.r10',LIEM_TUONG],'Theo Tân Biên, Liêm Trinh tại Mệnh ở miếu, vượng hoặc đắc được mô tả qua nét thẳng thắn, can đảm, nghiêm nghị và nóng nảy. Với Thiên Tướng đồng cung, Nguyễn Phát Lộc nêu sự tiết chế riêng nét nóng nảy của Liêm Trinh. Các nét thẳng thắn, can đảm và nghiêm nghị vẫn giữ nguyên trong phần đọc này; không có nghĩa mọi mặt khó đã được hóa giải hay đây là đánh giá tính cách thực tế của người đọc.','Điều chỉnh cục bộ có nguồn npl-local-adjustments-1.0.0, không phải gộp trùng hoặc cộng bằng chứng. Giữ claim gốc R10; chỉ tiết chế nét nóng. TB34,60–62 đối chiếu HS89,90,132.');
 if(palace==='Mệnh'){const m05=ps.find(p=>has(p,[M05]));if(m05)merge(['tanbien.r02',M05],m05.display.text+' Với Văn Khúc đồng cung, đoạn Phú giải còn liên hệ Vũ Khúc sáng với sự học rộng và nhiều khả năng. Hai mô tả dùng chung dữ kiện Văn Khúc, không phải hai bằng chứng độc lập xác nhận người đọc tài giỏi.','Gom ngữ cảnh R02/M05, giữ nghĩa học hỏi và thuật ngữ văn võ riêng; không điều chỉnh hoặc thay thế claim.');}
 // §20.12 supplements the local trading aspect; these are editorial unions, not overrides.
 if(palace==='Thiên Di'){
  const extra=ps.find(p=>has(p,['tanbien.di-vu-tu-mo']));
  if(extra){
   const base=ps.find(p=>has(p,['tanbien.di-vu-alone','tanbien.di-vu-tham']));
   if(base){const baseId=base.claim.rules.find(r=>['tanbien.di-vu-alone','tanbien.di-vu-tham'].includes(r.id))!.id;
    merge([baseId,'tanbien.di-vu-tu-mo'],extra.display.text+(baseId==='tanbien.di-vu-alone'?' Với Vũ đơn thủ, §10.4 còn nói đi xa lợi ích hơn ở nhà; không phải khuyến nghị đầu tư.':' §10.4/10.9 còn giữ trước khó sau dễ và cạnh tranh ráo riết, không xác định thời điểm chuyển biến.'),'Bổ sung cùng phương diện theo Tân Biên PDF175–176 §10.4/10.9 và235–236 §20.12; gom ý buôn bán trùng, không tăng độ chắc chắn hoặc chọn lời thắng. Giữ toàn bộ claim/ngoại lệ và những lời khác ở Di.');
   }
  }
 }
 if(palace==='Tử Nữ')merge(['tanbien.children-tu-pha','tanbien.children-tu'],'Theo Tân Biên, hai nhánh Tử Vi–Phá Quân đồng cung và sao Tử thuộc vòng Tràng Sinh tại Tử Nữ cùng mô tả sự xung khắc giữa cha mẹ và con cái khi con lớn lên.','Gộp cùng đối tượng, khía cạnh và thời gian; hai căn cứ không làm tăng độ chắc chắn.');
 if(palace==='Phúc Đức'){
  const pure=['tanbien.phuc-base-tu-pha-dispersal','tanbien.phuc-base-tu-tham-dispersal','tanbien.phuc-fire-tang-relation','tanbien.phuc-sun-low-local-dispersal','tanbien.phuc-luong-ty-hoi-local-dispersal','tanbien.phuc-hoa-ky','tanbien.phuc-loc-ton'];
  const present=pure.filter(id=>ps.some(p=>has(p,[id])));
  if(present.length>1&&present.some(id=>id.includes('-local-dispersal')||id==='tanbien.phuc-fire-tang-relation')){
   merge(present,phucDispersalCopy(present),'Gộp đúng vế họ hàng phân tán đã thực sự xuất; giữ mọi claim, điều kiện và căn cứ. Giữ ngày càng nếu nguồn của nhánh khớp có vế này; giữ riêng tranh chấp của Hóa Kỵ, không cộng mức độ.');
  }else{
 if(palace==='Phúc Đức')for(const id of ['tanbien.phuc-base-tu-pha-dispersal','tanbien.phuc-base-tu-tham-dispersal']){
  const ky=ps.find(p=>has(p,['tanbien.phuc-hoa-ky']));
  if(ky)merge([id,'tanbien.phuc-hoa-ky'],ky.display.text,'Gộp riêng ý họ hàng ly tán, giữ lời tranh chấp của Hóa Kỵ và đầy đủ điều kiện/căn cứ của cả hai cấu trúc. Không cộng mức độ hoặc mở các vế khác của Tử Vi.');
 }
  }
 }
 // Hóa Kỵ also concerns parents with each other: keep this alternative explicit.
 if(palace==='Phụ Mẫu')merge(['tanbien.parents-co-cu','tanbien.parents-ky'],'Theo Tân Biên, nhánh Thiên Cơ–Cự Môn nói về tình trạng trong nhà thiếu hòa khí. Hóa Kỵ có thêm cách mô tả bất hòa giữa cha mẹ với nhau, hoặc không hợp tính giữa cha mẹ và con. Lời về không khí gia đình và hai đối tượng quan hệ của Hóa Kỵ không được đồng nhất.','Gom cùng đoạn để tránh nhắc hai lần; giữ riêng đối tượng và phép “hoặc” của Hóa Kỵ. Không tạo kết luận chung mới.');
 if(palace==='Phụ Mẫu')merge(['tanbien.parents-loc','tanbien.parents-hoa-loc'],'Theo Tân Biên, Lộc Tồn và Hóa Lộc tại Phụ Mẫu cùng có ý liên hệ với của cải của cha mẹ. Riêng nhánh Lộc Tồn còn mô tả phần của cải dễ bị tiêu tán bởi con và cha mẹ–con không hợp tính.','Gộp ý của cải; giữ vế hạn chế chỉ thuộc Lộc Tồn. Không cộng mức giàu hoặc độ chắc chắn.');
 for(const p of ps){if(used.has(p.claim.id))continue;const g=groups.find(g=>g.text===p.display.text);if(g){g.members.push(p);g.editorial='Cùng nguyên văn, cùng cung; giữ tất cả căn cứ, không tăng độ mạnh.';}else groups.push({text:p.display.text,members:[p],editorial:null});}
 return {groups,relations:COORDINATION_DECISIONS.filter(d=>d.palace===palace&&ps.some(p=>has(p,d.left))&&ps.some(p=>has(p,d.right))).map(d=>({...d,claimIds:ps.filter(p=>has(p,[...d.left,...d.right])).map(p=>p.claim.id),status:'unresolved' as const}))};
}
// Append new semantic groups after existing groups, preserving old paragraph IDs and G2 membership.
function paragraphOrder(p:Paragraph){
 if(p.claim.rules.some(r=>(TRUNGCHAU_RULE_IDS.includes(r.id)||r.id===VTTL_DIEN_PHU||r.id===VTTL_CAREER_CO_AM)))return 2;
 return Number(p.claim.rules.some(r=>r.id.startsWith('tanbien.life-body-')||r.id.startsWith('npl.life-body-')||r.id.startsWith('npl.life-two-major-')||r.id.startsWith('npl.life-foundation-')));
}
function buildContinuousReportData(snapshot:ChartSnapshot,reading:Reading,verified:boolean){
 const paragraphs=reading.sections.flatMap(s=>s.paragraphs);
 // Section is the existing narrative subject; finance-extra facts predate subjectOf's wealth prefix.
 const subject=(p:Paragraph)=>subjectOf(p.claim)||({finance:'Tài Bạch',work:'Quan Lộc',structure:'Mệnh',action:'Mệnh',learning:'Mệnh',no:'Nô Bộc'} as Record<string,string>)[reading.sections.find(s=>s.paragraphs.includes(p))?.id||'']||null;
 const body=snapshot.chart.palaces.filter(p=>p.isBodyPalace);
 const palaces=PALACE_ORDER.map((name,index)=>{
  const matches=snapshot.chart.palaces.filter(p=>p.name===name),p=matches.length===1?matches[0]:undefined;
  const complete=verified&&!!p&&snapshot.chart.tanBien?.completeness?.majorStars==='complete'&&(['minorStars','adjectiveStars'] as const).every(g=>snapshot.chart.tanBien?.completeness?.[g]==='complete-with-declared-supplements')&&(['majorStars','minorStars','adjectiveStars'] as const).every(g=>Array.isArray(p[g])&&p[g].every(s=>(s as {scope?:string}).scope==='origin'));
  const ps=paragraphs.filter(p=>subject(p)===name).sort((a,b)=>paragraphOrder(a)-paragraphOrder(b)),c=coordinate(name,ps);
  return {gap:reportGap(snapshot,reading,name,complete,ps.some(p=>p.claim.rules.some(r=>r.id!==SPEND201))),name,id:'natal-palace-'+index,branch:p?.earthlyBranch||null,status:!complete?'missing-data':ps.length?'claims':'facts-only',facts:p?{major:p.majorStars?.filter(s=>(s as {scope?:string}).scope==='origin').map(s=>s.name)||null,minor:p.minorStars?.filter(s=>(s as {scope?:string}).scope==='origin').map(s=>s.name)||null,other:p.adjectiveStars?.filter(s=>(s as {scope?:string}).scope==='origin').map(s=>s.name)||null}:null,
   groups:c.groups.map((g,i)=>({id:'natal-paragraph-'+index+'-'+i,text:g.text,editorial:g.editorial,claimIds:g.members.map(p=>p.claim.id),readerTitles:[...new Set(g.members.flatMap(q=>q.evidence.map(e=>readerHeading(e.title,name,p?.earthlyBranch||null))))],titles:[...new Set(g.members.flatMap(p=>p.evidence.map(e=>e.title)))],topics:[...new Set(g.members.map(p=>reading.sections.find(s=>s.paragraphs.includes(p))?.title))],notes:[...new Set(g.members.flatMap(p=>p.nearbyNotes.map(n=>n.text)))],members:g.members.map(p=>({claim:p.claim,original:p.display.text,layers:p.evidence.map((e,i)=>evidenceLayers(e,p.nearbyNotes,p.claim.rules[i].id)),facts:reading.execution.derivedFacts.filter(f=>p.claim.factIds.includes(f.id)),traces:reading.execution.traces.filter(t=>p.claim.rules.some(r=>r.id===t.ruleId))}))})),relations:c.relations,
   related:name==='Huynh Đệ'?paragraphs.filter(p=>p.claim.factIds.some(id=>id.startsWith('fact.no-tl-'))).map(p=>({claimId:p.claim.id,target:'natal-palace-5',text:p.evidence.map(e=>e.title).join('; ')})):[],
   unknown:reading.execution.traces.filter(t=>t.status==='missing-facts'&&reading.execution.rules.some(r=>r.id===t.ruleId&&subjectOf({factIds:r.requiredFacts})===name)),
  };
 });
 const assets=buildFinanceAssets(snapshot,palaces);
 return {lifeBody: {version:'life-body-context-1.0.0',target:body.length===1?palaces.find(p=>p.name===body[0].name)?.id:null,structure:palaces[0].status!=='missing-data'&&palaces[0].facts?.major?`Mệnh tại ${palaces[0].branch}: ${palaces[0].facts.major.length?palaces[0].facts.major.join('–'):'không có chính tinh tọa thủ'}. ${body.length===1?`Thân cư ${body[0].name} tại ${body[0].earthlyBranch}.`:'Chưa xác định duy nhất cung an Thân.'}`:null},financeAssets:assets.entries.length?{...assets,conditions:reading.financeAssessment}:undefined,editorialPatch:'1.35.1',placeLabel:readerPlace(snapshot.normalized.place),version:CONTINUOUS_VERSION,snapshotId:snapshot.resultId,title:'Báo cáo bản mệnh — bản ứng viên',birth:snapshot.normalized,body:body.length===1?{palace:body[0].name,branch:body[0].earthlyBranch}:null,guide:'Bản dự thảo trình bày dữ kiện và các chú giải truyền thống đang khớp điều kiện. Các nhận định không xác nhận đặc điểm, hoàn cảnh hay tương lai thực tế của người đọc và người thân. Có nội dung ở 12 cung không có nghĩa đã tổng hợp toàn lá số. Thứ tự đọc và việc gom ý là biên tập, không phải quy tắc sao nào thắng sao nào.',palaces,tatAch:reading.tatAch,lifeGaps:reading.lifeOverview?.gaps||[],unbound:paragraphs.filter(p=>!subject(p)).map(p=>({claim:p.claim,text:p.display.text})),scope:reading.readerPresentation?.scope,unassessed:reading.unassessed,contexts:reading.contexts};
}
export type ContinuousReport=ReturnType<typeof buildContinuousReportData> & {candidate?:CandidatePresentation};
export function buildContinuousReport(snapshot:ChartSnapshot,reading:Reading,verified:boolean):ContinuousReport {
 const report=buildContinuousReportData(snapshot,reading,verified);
 return {...report,candidate:buildCandidatePresentation(report,reading)};
}
