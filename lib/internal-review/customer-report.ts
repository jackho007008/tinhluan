import {editCustomerTopics} from './customer-topic-editorial';
import {captureReportPolicy} from '../trial/reading-policy';
import type {ChartSnapshot} from '../tuvi-engine';
import type {ContinuousReport} from './continuous-report';
import {CUSTOMER_COPY} from './customer-copy';
import EDITORIAL from './customer-editorial.json';
export const CUSTOMER_VERSION='1.57.0';
type Group=ContinuousReport['palaces'][number]['groups'][number];
export type CustomerParagraph={conditionalAssessment?:{condition:string;status:'unknown';outcomeApplied:false}[];id:string;title:string;text:string;claimIds:string[];sentences:{text:string;claimIds:string[];kind:'paraphrase'|'editorial-transition'|'source-relation'}[];original:string;members:Group['members'];relations:unknown[];movedToEvidence:string[];review:'editorial-checked'|'pending-editorial'};
export type CustomerSection={id:string;title:string;palaces:string[];intro:string|null;paragraphs:CustomerParagraph[];notices:{text:string;reason:unknown}[]};
export type CustomerReport={version:string;snapshotId:string;title:string;name:string;birth:string;notice:string;intro:string;sections:CustomerSection[];basicSectionIds:string[];basicSelectionVersion?:string;palaces:{name:string;branch:string|null;target:string;facts:string;details:unknown}[];glossary:{term:string;text:string}[];unplaced:unknown[];status:'draft';review:null;catalogVersion:string};
const labels:Record<string,string>={'Phụ Mẫu':'Cha mẹ và gia đình','Huynh Đệ':'Anh chị em','Phu Thê':'Tình cảm và hôn nhân','Tử Nữ':'Quan hệ với con cái','Nô Bộc':'Bạn bè và người trợ giúp','Thiên Di':'Môi trường bên ngoài','Phúc Đức':'Phúc Đức và dòng họ','Quan Lộc':'Sự nghiệp và cách làm việc','Tật Ách':'Tật Ách — phạm vi dữ kiện'};
const unique=<T,>(xs:T[])=>[...new Set(xs)];
const ids=(g:Group)=>g.members.flatMap(m=>m.claim.rules.map(r=>r.id));
const fact=(g:Group,id:string)=>g.members.flatMap(m=>m.facts).find(f=>f.id===id)?.value;
function dynamicCopy(g:Group,r:ContinuousReport,s:ChartSnapshot):string|undefined{
 const rules=ids(g),body=r.body?.palace;
 const voids=(palace:string)=>(s.chart.tanBien?.voidRanges??[]).filter(v=>v.branches.includes(r.palaces.find(p=>p.name===palace)?.branch||'')).map(v=>v.name==='Tuần Không'?'Tuần':v.name==='Triệt Lộ'?'Triệt':v.name).join(' và ');
 if(rules.includes('tanbien.life-body-role'))return `Thân an tại ${body}. Khi đọc phương diện này vẫn cần đặt bên cạnh Mệnh và giữ các điều kiện riêng của cung; lời ở cung an Thân không tự trở thành kết luận về tính cách.`;
 if(rules.includes('tanbien.life-body-same-trine'))return `Mệnh được dùng như hình ảnh về khuôn khổ đời người; Thân nói về thân thế và hành động trong khuôn khổ ấy. Thân cư ${body}, cùng tam hợp Mệnh, có cách gọi biểu tượng “như hoàn toàn chấp nhận định mệnh”. Cách nói này không có nghĩa người đọc thụ động, giàu có hay thành công.`;
 if(rules.includes('tanbien.life-body-other-trine'))return `Mệnh được dùng như hình ảnh về khuôn khổ đời người; Thân nói về thân thế và hành động trong khuôn khổ ấy. Thân cư ${body}, khác tam hợp Mệnh, có cách gọi biểu tượng “như không chấp nhận định mệnh”. Cách nói này chưa kết luận sự chống đối hay khả năng thay đổi số phận; các trường hợp theo vị trí Thái Tuế vẫn cần được phân biệt.`;
 if(rules.includes('npl.life-body-career'))return 'Thân cư Quan Lộc gắn với sự gắn bó xuyên suốt với đường công danh. Đây là ý riêng về vị trí Thân, không xác định chức vụ, thành công hoặc việc chỉ sống vì công việc. Những trở ngại và điều chỉnh tại Quan Lộc vẫn giữ nguyên phạm vi.';
 if(rules.includes('npl.life-body-wealth'))return 'Thân cư Tài Bạch gắn với sự chú trọng tạo dựng của cải, xu hướng kiếm tiền và các công việc thuộc lĩnh vực kinh tế–tài chính. Chỉ vị trí Thân chưa xác định nghề nghiệp, khả năng kiếm tiền hay mức tài sản. Không lấy vị trí này để kết luận giàu có hoặc bỏ qua mặt khó tại Tài Bạch.';
 if(rules.includes('tanbien.life-vu-phu-ty-canh-nham')){
  const actual=(s.chart.tanBien?.voidRanges??[]).map(v=>`${v.name==='Tuần Không'?'Tuần':'Triệt'} tại ${v.branches.join('–')}`).join('; ');
  return `Vũ Khúc–Thiên Phủ tại Mệnh Tý, với can sinh Canh hoặc Nhâm, có lời về tài lộc và hưởng phúc. Cấu trúc này còn được miễn lời mang tiếng xấu do gặp Tuần/Triệt trong đoạn đối chiếu; điều đó không bảo đảm tài lộc hoặc có nghĩa mọi trở ngại đã được hóa giải. Trên lá số: ${actual}.${voids('Mệnh')?' Điều kiện trực tiếp tại Mệnh được ghi trong căn cứ; không tự mở rộng thành hóa giải toàn bộ.':' Tuần và Triệt không án trực tiếp tại Mệnh; ngoại lệ được giới thiệu ở đây không phải một tác động hóa giải đang xảy ra.'}`;
 }
 if(rules.includes('tanbien.life-ky-khoa-ty-hoi')){
  const lead=g.text.split('Tân Biên')[0].trim();
  return `${lead} Cấu trúc này gắn với sự cẩn thận trong lời nói và việc làm. Chú giải chỉ nói về phương diện ấy, không có nghĩa mọi mặt bất lợi của Hóa Kỵ đã được hóa giải.`;
 }
 if(rules.includes('tanbien.dien-void-co-cu'))return `${voids('Điền Trạch')||'Tuần hoặc Triệt'} trực tiếp tại Điền Trạch gắn với việc tạo nhà đất khó hoặc chậm, còn nhà đất đã có dễ hao hụt, suy giảm. Lời thuận về tạo dựng của Cơ–Cự cần được đọc cùng điều kiện này. Đây là phương diện tạo lập và duy trì nhà đất, không đủ để kết luận khả năng kiếm tiền nói chung.`;
 if(rules.includes('tanbien.career-void-tu-ngo'))return `${voids('Quan Lộc')||'Tuần hoặc Triệt'} trực tiếp tại Quan Lộc giới hạn lời thuận của Tử Vi ở Ngọ: công danh có mô tả tiến triển chậm, gặp trở ngại hoặc khó bền. Điều chỉnh này nói về tiến trình và sự ổn định công việc, không xác định thu nhập giảm hoặc thiếu tiền. Nếu cả Tuần và Triệt cùng hiện diện, chúng không được coi là tự triệt tiêu nhau.`;
 const polarity=rules.find(id=>id.startsWith('npl.life-polarity-'));
 if(polarity){
  const inputs=s.chart.tanBien?.inputs,life=s.chart.palaces.find(p=>p.name==='Mệnh');
  const evidence=g.members.flatMap(m=>m.facts).find(f=>f.id==='fact.'+polarity.slice(4))?.text;
  if(!inputs||!life||!evidence)return;
  const aligned=polarity.endsWith('-aligned');
  return `${evidence.split(' Quan hệ ')[0]} ${aligned?'Thuận lý diễn tả sự hòa hợp':'Nghịch lý diễn tả sự đối chọi'} về âm dương giữa tuổi và cung Mệnh. Kết quả chỉ nói về quan hệ này, chưa xác định tính cách, công việc hoặc tài sản.`;
 }
 const foundation=rules.find(id=>id.startsWith('npl.life-foundation-'));
 if(foundation){
  const kind=foundation.slice('npl.life-foundation-'.length),raw=fact(g,`fact.life-npl-foundation-${kind}-text`);
  if(typeof raw!=='string')return;
  const relation=raw.split(' Trong phép xét ')[0],grade=raw.match(/được xếp “([^”]+)”/)?.[1];
  if(!grade)return;
  const scope=kind==='cuc'?'Bản Mệnh–Cục':kind==='empty'?'hành cung Mệnh không chính tinh với Bản Mệnh':'hành cung–hành chính tinh–Bản Mệnh';
  const direction=grade.includes('xấu')?'nghịch':grade.includes('tốt')?'thuận':grade==='trung bình'?'ở mức trung bình':grade==='vừa'?'ở mức “vừa”':null;
  if(!direction)return;
  return `${relation} Đây là quan hệ ${direction} trong phép xét riêng ${scope}; chưa phải đánh giá con người hoặc cả cuộc đời. Các mức phân loại chi tiết của phép xét được giữ trong căn cứ.`;
 }
 if(rules.some(id=>id.startsWith('npl.life-two-major-'))){
  const relations=fact(g,'fact.life-npl-two-v2-relations'),support=fact(g,'fact.life-npl-two-v2-support'),adverse=fact(g,'fact.life-npl-two-v2-adverse');
  if(typeof relations!=='string')return;
  return `${relations} ${support?`Phép xét đánh giá thuận về phía ${support}, vì sao sinh Bản Mệnh. `:''}${adverse?`Phép xét đánh giá nghịch về phía ${adverse}, vì sao khắc Bản Mệnh. `:''}Chưa xác định nét nào của từng sao được tăng hay giảm; cùng hành hoặc chiều sinh ngược hiện chưa có lời diễn giải trong phép xét này. Quan hệ này chưa cho biết nét nào của sao sẽ lấn át nét khác.`;
 }
}
export const DYNAMIC_CUSTOMER_RULES=['npl.life-polarity-aligned','npl.life-polarity-opposed','tanbien.life-body-role','tanbien.life-body-same-trine','tanbien.life-body-other-trine','npl.life-body-career','npl.life-body-wealth','tanbien.life-vu-phu-ty-canh-nham','tanbien.life-ky-khoa-ty-hoi','tanbien.dien-void-co-cu','tanbien.career-void-tu-ngo','npl.life-foundation-cuc','npl.life-foundation-empty','npl.life-foundation-one','npl.life-two-major-generates','npl.life-two-major-controls','npl.life-two-major-mixed'];
export const CUSTOMER_EDITORIAL=EDITORIAL as Record<string,{text:string;sourceTemplate:string;sourceVersion:string;strategy:string;movedToEvidence:string[]}>;
// Only these five relationships were already specified by continuous-report.
// They are consumed as units; any additional members are rendered independently.
const GROUP_COPY:Record<string,string>={
 ...Object.fromEntries(Object.entries(CUSTOMER_COPY).filter(([k])=>k.includes('|'))),
 'tanbien.life-wu-literary-male|tanbien.r02':'Vũ Khúc sáng cùng Văn Khúc gắn với sự học rộng và nhiều khả năng. Ở nam mệnh, cấu trúc này còn có cách gọi “tài kiêm văn võ”. Cách gọi truyền thống ấy không xác định nghề nghiệp, bằng cấp hoặc năng lực thực tế.',
 'tanbien.children-tu|tanbien.children-tu-pha':'Tử Vi–Phá Quân và sao Tử thuộc vòng Tràng Sinh tại Tử Nữ cùng có lời về xung khắc giữa cha mẹ và con khi con lớn lên. Lời này chỉ nói về quan hệ giữa cha mẹ và con, chưa xác định hoàn cảnh gia đình thực tế.',
 'tanbien.parents-co-cu|tanbien.parents-ky':'Thiên Cơ–Cự Môn đồng cung Phụ Mẫu được mô tả là trong nhà thiếu hòa khí. Hóa Kỵ còn có hai cách mô tả: bất hòa giữa cha mẹ với nhau, hoặc không hợp tính giữa cha mẹ và con. Hai mối quan hệ này được giữ riêng, chưa có căn cứ chọn một hoàn cảnh thực tế.',
 'tanbien.parents-hoa-loc|tanbien.parents-loc':'Lộc Tồn và Hóa Lộc tại Phụ Mẫu cùng gắn với của cải của cha mẹ. Riêng Lộc Tồn còn có mặt khó: phần của cải dễ bị tiêu tán bởi con, và cha mẹ–con không hợp tính. Lời thuận về của cải không xóa hai vế hạn chế này.'
};
export function makeCustomerParagraph(g:Group,r:ContinuousReport,s:ChartSnapshot):CustomerParagraph{
 const parts:{text:string;claimIds:string[]}[]=[],consumed=new Set<string>(),moved=[...g.notes,...(g.editorial?[g.editorial]:[])];
 const rules=unique(ids(g));
 if(g.editorial)for(const [key,text] of Object.entries(GROUP_COPY)){
  const required=key.split('|');
  if(required.every(id=>rules.includes(id))){parts.push({text,claimIds:g.members.filter(m=>m.claim.rules.some(r=>required.includes(r.id))).map(m=>m.claim.id)});required.forEach(id=>consumed.add(id));}
 }
 // Consume only the specified Vũ–Di meanings; unrelated members (including Kỵ) remain independent.
 if(g.editorial&&rules.includes('tanbien.di-vu-tu-mo')){
  const base=rules.find(id=>['tanbien.di-vu-alone','tanbien.di-vu-tham'].includes(id));
  if(base){
   const extraIds=g.members.filter(m=>m.claim.rules.some(r=>r.id==='tanbien.di-vu-tu-mo')).map(m=>m.claim.id);
   const baseIds=g.members.filter(m=>m.claim.rules.some(r=>r.id===base)).map(m=>m.claim.id);
   parts.push({text:'Vũ Khúc tại Thiên Di ở Thìn, Tuất, Sửu hoặc Mùi được mô tả là buôn bán giỏi và tài lộc ngày càng tăng tiến.',claimIds:extraIds});
   parts.push({text:base==='tanbien.di-vu-alone'?'Khi Vũ Khúc đơn thủ, đi xa còn được mô tả là có lợi hơn ở nhà; đây không phải khuyến nghị đầu tư.':'Khi Tham Lang đồng cung, lời về tổ hợp còn nêu trước khó sau dễ và hay gặp cạnh tranh ráo riết, không xác định thời điểm chuyển biến.',claimIds:baseIds});
   parts.push({text:'Đây là lời riêng về hoạt động buôn bán khi xét môi trường bên ngoài, chưa xác định sinh kế hoặc tài chính toàn đời; còn cần xem Mệnh, Thân, Tài Bạch và Quan Lộc.',claimIds:extraIds});
   consumed.add(base);consumed.add('tanbien.di-vu-tu-mo');
  }
 }
 let pending=false;
 for(const m of g.members)for(const rule of m.claim.rules){
  if(consumed.has(rule.id)){
   const siblings=g.members.filter(other=>other.claim.rules.some(q=>q.id===rule.id)).map(other=>other.claim.id);
   for(const part of parts)if(part.claimIds.some(id=>siblings.includes(id)))part.claimIds=unique([...part.claimIds,...siblings]);
   continue;
  }
  consumed.add(rule.id);
  const candidate=CUSTOMER_EDITORIAL[rule.id];
  const editorial=candidate?.sourceVersion===rule.version?candidate:undefined;
  // Dynamic copy sees only this rule, never steals other meanings in an unseen group.
  const one={...g,text:m.original,members:[{...m,claim:{...m.claim,rules:[rule]}}]};
  let text=editorial?.text??dynamicCopy(one,r,s);
  if(text&&rule.id.startsWith('tanbien.no-table-')){
   const life=s.chart.palaces.find(p=>p.name==='Mệnh'),no=s.chart.palaces.find(p=>p.name==='Nô Bộc');
   if(life?.majorStars.length===1&&no?.majorStars.length===1)text=`Khi xét ${life.majorStars[0].name} tại Mệnh cùng ${no.majorStars[0].name} tại Nô Bộc: ${text}`;
  }
  if(!text){pending=true;continue;}
  moved.push(...(editorial?.movedToEvidence??[]));
  const same=parts.find(p=>p.text===text);
  if(same)same.claimIds=unique([...same.claimIds,m.claim.id]);else parts.push({text,claimIds:[m.claim.id]});
 }
 if(pending)parts.push({text:'Một phần nội dung đang chờ biên tập; nội dung gốc và giới hạn vẫn được giữ trong căn cứ.',claimIds:g.claimIds});
 const text=parts.map(p=>p.text).join(' ');
 const conditionalAssessment=g.members.flatMap(m=>m.claim.rules.flatMap(rule=>rule.presentation?.conditionalAssessment?[rule.presentation.conditionalAssessment]:[]));
 return {...(conditionalAssessment.length?{conditionalAssessment}:{}),id:g.id,title:'',text,claimIds:g.claimIds,sentences:parts.flatMap(p=>p.text.split(/(?<=[.!?])\s+/u).filter(Boolean).map(text=>({text,claimIds:p.claimIds,kind:'paraphrase' as const}))),original:g.text,members:g.members,relations:r.palaces.flatMap(p=>p.relations).filter(d=>d.claimIds.some(id=>g.claimIds.includes(id))),movedToEvidence:unique(moved),review:pending?'pending-editorial':'editorial-checked'};
}
/** Shared prototype policy: whole topic groups, never select by identity or favorable wording. */
export function selectBasicSectionIds(sections:CustomerSection[]):string[]{
 const preferred=['learning','natal-palace-4','assets'];
 const available=sections.filter(s=>s.paragraphs.length>0);
 return [...preferred.flatMap(id=>available.filter(s=>s.id===id)),...available.filter(s=>!preferred.includes(s.id))].slice(0,3).map(s=>s.id);
}
export function buildCustomerReport(s:ChartSnapshot,r:ContinuousReport,catalogVersion:string):CustomerReport{
 const sections:CustomerSection[]=[{id:'life',title:'Mệnh–Thân',palaces:['Mệnh'],intro:r.lifeBody.structure,paragraphs:[],notices:[]},{id:'traits',title:'Khuynh hướng và cách hành động',palaces:['Mệnh'],intro:null,paragraphs:[],notices:[]},{id:'learning',title:'Học hỏi và biểu đạt',palaces:['Mệnh'],intro:null,paragraphs:[],notices:[]},{id:'elements',title:'Âm dương và ngũ hành',palaces:['Mệnh'],intro:'Âm dương tuổi được xác định theo can chi năm sinh, khác với giới tính. Bản Mệnh là hành nạp âm của năm sinh; Cục là ngũ hành dùng khi lập lá số. Hành cung thuộc địa chi nơi đặt cung, còn hành sao là thuộc tính của sao. Các phép xét dưới đây độc lập: không cộng thành điểm hoặc dùng một kết quả để xóa kết quả khác.',paragraphs:[],notices:[]}];
 const section=(id:string,title:string,palaces:string[])=>{let x=sections.find(x=>x.id===id);if(!x){x={id,title,palaces,intro:null,paragraphs:[],notices:[]};sections.push(x);}return x;};
 const getTarget=(name:string)=>name==='Mệnh'?'life':name==='Tài Bạch'||name==='Điền Trạch'?'assets':r.palaces.find(p=>p.name===name)!.id;
 // Place the entire group, not individual claims, so adjustments cannot be cut away.
 for(const p of r.palaces){
  const target=p.name==='Mệnh'?sections[0]:section(getTarget(p.name),labels[p.name]??'Tiền bạc, tích lũy và nhà đất',p.name==='Tài Bạch'||p.name==='Điền Trạch'?['Tài Bạch','Điền Trạch']:[p.name]);
  for(const g of p.groups){const rules=ids(g);let t=target;
   if(p.name==='Mệnh')t=rules.some(id=>id.includes('life-polarity-')||id.includes('life-foundation-')||id.includes('life-two-major-'))?sections[3]:rules.some(id=>id.includes('life-body-'))?sections[0]:rules.some(id=>['tanbien.r02','tanbien.life-wu-literary-male','npl.life-local-khoa-kiep','tanbien.life-empty-mui-sun-moon-trine'].includes(id))?sections[2]:sections[1];
   const para=makeCustomerParagraph(g,r,s);const asset=r.financeAssets?.entries.find(e=>e.groupId===g.id);para.title=p.name==='Tài Bạch'?(asset?.aspect==='retention'?'Tích lũy và giữ tiền':asset?.aspect==='income'?'Nguồn thu':'Tiền bạc'):p.name==='Điền Trạch'?'Tạo lập và duy trì nhà đất':'';
   if(para.conditionalAssessment?.length)para.title='Chú giải có điều kiện — chưa xác định';
   t.paragraphs.push(para);
  }
  if(p.gap){const kind=p.gap.kind;const text=p.name==='Tật Ách'?(r.tatAch?.notice||'Phần này chỉ trình bày dữ kiện, không đánh giá sức khỏe.'):kind==='missing-data'?'Chưa đủ dữ kiện đáng tin cậy để đọc phần này.':kind==='unresolved-adjustment'?'Một số lời nền chưa được đưa ra vì ảnh hưởng của điều kiện đi kèm còn chưa rõ.':kind==='partial-adjustment'?'Lời về nhà đất đã tính đến điều kiện trực tiếp nêu trên; các yếu tố còn lại chưa được hợp nhất thành kết luận chung.':p.groups.length?'Phần này còn những cấu trúc chưa có luận giải.':'Phần này hiện chưa có luận giải.';
   if(kind!=='partial-adjustment')target.notices.push({text:(p.name==='Điền Trạch'?'Nhà đất: ':p.name==='Tài Bạch'?'Tiền bạc và tích lũy: ':'')+text,reason:p.gap});
  }
 }
 // Preserve existing relations verbatim: no new priority, causality or replacements.
 for(const rel of r.financeAssets?.relations??[]){
  if(rel.id==='property-void')continue; // its full meaning is in the adjusted property paragraph, evidence keeps this relationship.
  const t=section('assets','Tiền bạc, tích lũy và nhà đất',['Tài Bạch','Điền Trạch']);
  const gs=r.palaces.flatMap(p=>p.groups).filter(g=>rel.groupIds.includes(g.id));
  t.paragraphs.push({id:'customer-relation-'+rel.id,title:rel.id==='retention-unresolved'?'Giới hạn của lời giữ tiền':rel.id==='creation-loss'?'Nguồn thu và hao hụt':rel.id==='work-income-boundary'?'Đọc cùng phần công việc':'Tiền bạc và nhà đất',text:rel.text,claimIds:rel.claimIds,sentences:[{text:rel.text,claimIds:rel.claimIds,kind:rel.sentenceKind==='editorial-transition'?'editorial-transition':'source-relation'}],original:rel.text,members:gs.flatMap(g=>g.members),relations:[rel],movedToEvidence:[rel.implementation],review:'editorial-checked'});
 }
 for(const p of r.palaces)for(const rel of p.relations){if(p.name==='Tài Bạch'&&r.financeAssets?.relations.some(d=>d.id==='creation-loss'))continue;section(getTarget(p.name),labels[p.name]||p.name,[p.name]).paragraphs.push({id:'customer-coordination-'+rel.id,title:'Những ý chưa được hợp nhất',text:rel.text,claimIds:rel.claimIds,sentences:[{text:rel.text,claimIds:rel.claimIds,kind:'editorial-transition'}],original:rel.text,members:p.groups.filter(g=>g.claimIds.some(id=>rel.claimIds.includes(id))).flatMap(g=>g.members),relations:[rel],movedToEvidence:[rel.source],review:'editorial-checked'});}
 for(const g of r.candidate?.methodGaps??[])sections[3].notices.push({text:g.kind==='unsupported'?`${g.title}: dữ kiện đã xác định, nhưng trường hợp này hiện chưa có lời diễn giải.`:`${g.title}: chưa đủ dữ kiện nhất quán để diễn giải.`,reason:g});
 const order=['life','traits','learning','elements','natal-palace-4','assets','natal-palace-10','natal-palace-1','natal-palace-11','natal-palace-9','natal-palace-5','natal-palace-6','natal-palace-2','natal-palace-7'];
 const assets=sections.find(x=>x.id==='assets');if(assets)assets.paragraphs.sort((a,b)=>{const order=['Nguồn thu','Tiền bạc','Nguồn thu và hao hụt','Tích lũy và giữ tiền','Giới hạn của lời giữ tiền','Tạo lập và duy trì nhà đất','Tiền bạc và nhà đất','Đọc cùng phần công việc'];return order.indexOf(a.title)-order.indexOf(b.title);});
 editCustomerTopics(sections,r);
 const final=sections.filter(x=>x.paragraphs.length||x.notices.length||x.id==='life').sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
 const policy=captureReportPolicy({sections:final} as CustomerReport,r.palaces.find(p=>p.name==='Mệnh'));
 const freeIds=new Set(policy.freeParagraphIds);
 const candidates=final.filter(x=>['traits','learning'].includes(x.id)).flatMap(x=>x.paragraphs).filter(p=>freeIds.has(p.id)&&p.review==='editorial-checked');
 const highlights:CustomerParagraph[]=[];let words=0;
 for(const p of candidates){const count=p.text.trim().split(/\s+/u).length;if(highlights.length>=3)break;if(highlights.length&&words+count>250)break;highlights.push(p);words+=count;}
 if(highlights.length){
  const selected=new Set(highlights.map(p=>p.id));
  for(const section of final)section.paragraphs=section.paragraphs.filter(p=>!selected.has(p.id));
  for(let i=final.length-1;i>=0;i--)if(['traits','learning'].includes(final[i].id)&&!final[i].paragraphs.length&&!final[i].notices.length)final.splice(i,1);
  final.unshift({id:'key-points',title:'Nét chính về bạn',palaces:['Mệnh'],intro:'Một vài nét từ phần Mệnh, đọc cùng những điều kiện ngay dưới đây.',paragraphs:highlights,notices:[]});
 }
 const n=s.normalized;
 return {version:CUSTOMER_VERSION,snapshotId:s.resultId,title:'Bản đọc bản mệnh',name:n.name||'Hồ sơ bản mệnh',birth:`${n.date.split('-').reverse().join('/')} · ${n.calendar==='solar'?'Dương lịch':'Âm lịch'} · ${String(n.hour).padStart(2,'0')}:${String(n.minute).padStart(2,'0')} · ${n.gender==='male'?'Nam':'Nữ'} · ${r.placeLabel} · ${n.timezone}`,notice:'Đây là cách đọc truyền thống để tham khảo, không xác nhận tính cách, hoàn cảnh hay tương lai của bạn và người thân. Bài không cung cấp đánh giá sức khỏe, vận hạn hoặc lời khuyên đầu tư.',intro:'Bài đọc đi theo từng phương diện của đời sống. Những nét thuận, khó và điều kiện đi kèm được giữ cùng nhau; các lời riêng chưa đủ để tạo một kết luận chung về cả cuộc đời. Bạn có thể mở căn cứ ngay dưới mỗi đoạn.',sections:final,basicSectionIds:[...(highlights.length?['key-points']:[]),...selectBasicSectionIds(final.filter(s=>s.id!=='key-points'))],basicSelectionVersion:'whole-free-groups-1.1.0',palaces:r.palaces.map(p=>({name:p.name,branch:p.branch,target:getTarget(p.name),facts:p.status==='missing-data'?`${p.name}: chưa đủ dữ kiện nhất quán.`:`${p.name} tại ${p.branch}: ${p.facts?.major?.length?p.facts.major.join('–'):'không có chính tinh tọa thủ'}.`,details:{facts:p.facts,gap:p.gap}})),glossary:r.candidate?.glossary??[],unplaced:r.unbound,status:'draft',review:null,catalogVersion};
}
