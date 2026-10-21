/** Frozen editorial plan. Never evaluates a rule or changes a claim/source relationship. */
import type {buildTanBienReading} from './tanbien-reading';
import type {ContinuousReport} from './continuous-report';
type Input=Omit<ContinuousReport,'candidate'>;
export const CANDIDATE_VERSION='candidate-presentation-1.0.0';
const common='Mức này chỉ đánh giá các quan hệ vừa nêu, không phải mức tốt/xấu của toàn cung hay kết quả thực tế của người đọc.';
const separate='Phép xét này đứng riêng với các chú giải sao; không dùng nó để chọn bên thắng giữa các nhận định khác chiều.';
const definitions=[
 'Bản Mệnh ở đây là hành nạp âm của năm sinh; Cục là nhóm ngũ hành dùng trong cách lập lá số.',
 'Hành cung là ngũ hành của địa chi nơi đặt Mệnh; phép xét này không mượn sao đối cung.',
 'Hành cung là ngũ hành của địa chi nơi đặt Mệnh; hành sao là thuộc tính của chính tinh theo bảng nguồn.',
];
export type CandidatePresentation={
 version:string;presentationVersion:string;introduction:string;instructions:string;exclusions:string;
 glossary:{term:string;text:string}[];elementGuide:string;
 palaces:{id:string;label:string;statusText:string|null;blocks:{id:string;title:string;groupIds:string[]}[];moved:{target:string;title:string}[]}[];
 paragraphs:{id:string;title:string;text:string;claimIds:string[];kind:'existing'|'editorial-shortening';removed:string[]}[];
 financeRelations:{id:string;aspect:string}[];
 methodGaps:{id:string;kind:'unsupported'|'missing-data';title:string;text:string;fact:unknown;trace:unknown}[];
};
export function buildCandidatePresentation(r:Input,reading:ReturnType<typeof buildTanBienReading>):CandidatePresentation{
 const labels:Record<string,string>={'Mệnh':'Mệnh–Thân','Quan Lộc':'Quan Lộc — Công việc','Tài Bạch':'Tài Bạch — Tiền bạc','Điền Trạch':'Điền Trạch — Nhà đất','Phụ Mẫu':'Phụ Mẫu — Cha mẹ','Huynh Đệ':'Huynh Đệ — Anh chị em','Phu Thê':'Phu Thê — Vợ chồng','Tử Nữ':'Tử Nữ — Con cái','Nô Bộc':'Nô Bộc — Bạn bè và người trợ giúp','Thiên Di':'Thiên Di — Ra ngoài','Tật Ách':'Tật Ách — Dữ kiện và phạm vi'};
 const ids=(g:Input['palaces'][number]['groups'][number])=>g.members.flatMap(m=>m.claim.rules.map(q=>q.id));
 const category=(g:Input['palaces'][number]['groups'][number])=>ids(g).some(id=>id.startsWith('npl.life-foundation-')||id.startsWith('npl.life-two-major-'))?'elements':ids(g).some(id=>id.startsWith('tanbien.life-body-')||id.startsWith('npl.life-body-'))?'body':'stars';
 const methodGaps:CandidatePresentation['methodGaps']=[];
 for(const kind of ['cuc','empty','one']){const id='npl.life-foundation-'+kind,fact=reading.execution.derivedFacts.find(f=>f.id===`fact.life-npl-foundation-${kind}-mode`),trace=reading.execution.traces.find(t=>t.ruleId===id);const title=kind==='cuc'?'Bản Mệnh–Cục':kind==='empty'?'Ngũ hành Mệnh không chính tinh':'Ngũ hành Mệnh một chính tinh';
  if(fact?.value==='unsupported')methodGaps.push({id,kind:'unsupported',title,text:`${title}: các quan hệ đã xác định, nhưng nằm ngoài những trường hợp nguồn đã được chốt để diễn giải.`,fact,trace});
  else if(!fact&&trace?.status==='missing-facts')methodGaps.push({id,kind:'missing-data',title,text:`${title}: chưa đủ dữ kiện nhất quán để áp dụng phép xét.`,fact:null,trace});
 }
 return {version:CANDIDATE_VERSION,presentationVersion:'1.44.0',
 introduction:r.guide,
 instructions:'Đọc dữ kiện của cung trước, rồi đến những nhận định đang khớp điều kiện. Lời nền và điều chỉnh đã xác định được đặt cùng cụm. Mở “Xem căn cứ” để kiểm tra từng nguồn; thứ tự trình bày không quyết định nhận định nào thắng.',
 exclusions:'Bản này chưa tổng hợp toàn lá số, không cung cấp vận hạn, đánh giá sức khỏe, điểm số hoặc lời khuyên đầu tư.',
 glossary:[{term:'Bản Mệnh',text:'Hành nạp âm của năm sinh, khác với cung Mệnh.'},{term:'Cục',text:'Nhóm ngũ hành dùng trong cách lập lá số, không thay cho hành Bản Mệnh.'},{term:'Hành cung',text:'Ngũ hành của địa chi nơi đặt cung; với Mệnh không chính tinh, không mượn sao đối cung trong phép xét này.'},{term:'Hành sao',text:'Thuộc tính ngũ hành của chính tinh theo bảng nguồn của phép xét.'},{term:'Tọa thủ / đồng cung',text:'Sao nằm tại cung đang xét / các sao nằm cùng một cung. Hội chiếu là quan hệ với cung khác, không đồng nghĩa tọa thủ.'},{term:'Miếu, vượng, đắc, hãm',text:'Các nhãn trạng thái theo bảng của từng nguồn, không phải đánh giá toàn lá số.'},{term:'Văn chức / võ chức',text:'Cách phân loại dân sự / quân sự trong ngữ cảnh lịch sử, không tự quy đổi thành nghề hiện đại.'}],
 elementGuide:'Bản Mệnh–Cục và hành cung–hành sao–Bản Mệnh là các phép xét riêng. Nhãn “tốt”, “xấu” chỉ đánh giá quan hệ được nêu trong từng đoạn, không đánh giá cả cuộc đời. Không cộng các kết quả hoặc dùng chúng để chọn bên thắng giữa những chú giải sao.',
 palaces:r.palaces.map(p=>{const moved=p.groups.filter(g=>r.financeAssets?.entries.some(e=>e.groupId===g.id&&e.placement!=='palace'));const local=p.groups.filter(g=>!moved.includes(g));const blocks=p.name==='Mệnh'?[{id:'stars',title:'Chú giải sao và các điều chỉnh đã xác định',groupIds:local.filter(g=>category(g)==='stars').map(g=>g.id)},{id:'body',title:'Mệnh, Thân và cung an Thân',groupIds:local.filter(g=>category(g)==='body').map(g=>g.id)},{id:'elements',title:'Các phép xét ngũ hành riêng',groupIds:local.filter(g=>category(g)==='elements').map(g=>g.id)}]:[{id:'palace',title:'',groupIds:local.map(g=>g.id)}];return{id:p.id,label:labels[p.name]||p.name,statusText:p.gap?(p.groups.length&&p.gap.kind==='unresolved-adjustment'?p.gap.text.replace(/^Có lời nền/,'Có một số lời nền'):p.gap.text):null,blocks:blocks.filter(b=>b.groupIds.length),moved:moved.map(g=>({target:g.id,title:g.readerTitles.join(' · ')}))};}),
 paragraphs:r.palaces.flatMap(p=>p.groups.map(g=>{const found=ids(g).some(id=>id.startsWith('npl.life-foundation-'));let text=g.text;const removed:string[]=[];if(found)for(const sentence of [...definitions,common,separate])if(text.includes(sentence)){text=text.replace(sentence,'').trim();removed.push(sentence);}return{id:g.id,title:ids(g).includes('npl.life-local-liem-tuong')&&g.members.length>1?'Liêm Trinh–Thiên Tướng: lời nền và tiết chế nét nóng nảy':g.readerTitles.join(' · '),text,claimIds:g.claimIds,kind:removed.length?'editorial-shortening':'existing',removed};})),
 financeRelations:(r.financeAssets?.relations||[]).map(d=>({id:d.id,aspect:({'money-property':'introduction','creation-loss':'retention','retention-unresolved':'retention','property-void':'property','work-income-boundary':'work-context'} as Record<string,string>)[d.id]||'introduction'})),methodGaps};
}
