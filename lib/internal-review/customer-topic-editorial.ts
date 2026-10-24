import type {CustomerParagraph,CustomerSection} from './customer-report';
import type {ContinuousReport} from './continuous-report';

/** Shared financial text belongs under a palace with content; historical editions keep their placement. */
export function customerTopicOwner(version:string,section:{id:string;palaces:string[]},palaces:{name:string}[],scope:{name:string;state:string}[]){
 if(['1.54.0','1.55.0','1.55.1'].includes(version)&&section.id==='assets'&&section.palaces.includes('Tài Bạch')&&scope.some(p=>p.name==='Tài Bạch'&&['free','available','locked'].includes(p.state)))return 'Tài Bạch';
 return palaces.find(p=>section.palaces.includes(p.name))?.name;
}

/** Presentation only. These labels describe existing whole groups; never split claims or evaluate stars. */
const propertyFacets:Record<string,string>={};
const register=(title:string,ids:string[])=>ids.forEach(id=>{propertyFacets['tanbien.dien-'+id]=title;});
register('Thừa hưởng và tự tạo dựng',['tu-ngo','tu-phu','tu-tuong','tu-pha','vu','vu-phu','vu-tham','sun-cu-dan','sun-luong-mao','sun-cu-than','sun-luong-dau','sun-moon','co-high','co-cu-mao','co-cu-dau','moon-high','tham-mo','tham-other','cu-high','tuong-low','luong-high','sat-dan-than','sat-ty-ngo','loc','both-void']);
register('Phần nhà đất thừa hưởng',['tu-ty','phu']);
register('Thừa hưởng và duy trì nhà đất',['tu-sat','tu-tham','liem','liem-phu','liem-tham','sun-high','da','pha-ty-ngo']);
register('Tự tạo dựng nhà đất',['liem-tuong','liem-sat','liem-pha','dong-mao','dong-am-ty','dong-luong','co-luong','tuong-high','ma']);
register('Biến động và duy trì nhà đất',['dong-dau','dong-am-ngo','dong-ti-hoi','vu-tuong','vu-pha','luong-low','pha-thin-tuat','ky']);
register('Tạo lập và duy trì nhà đất',['void-empty-base','void-empty-light','void-co-cu']);

const relationCopy:Record<string,string>={
 'creation-loss':'Tạo dựng tiền bạc và hao tán là hai mặt riêng trong các lời trên. Chưa có căn cứ xác định chúng liên hệ thế nào hoặc mặt nào lấn át; không thể ghép thành kết luận “kiếm được nhưng không giữ được”.',
 'retention-unresolved':'Các lời về giữ của và khó giữ của cùng nói đến tích lũy, nhưng chưa có cách xác định lời nào điều chỉnh lời nào. Chưa thể kết luận giữ tiền bền vững hay chắc chắn hao hụt.',
 'money-property':'Tiền bạc và nhà đất là hai phương diện riêng. Lời thuận về kiếm tiền hoặc tích lũy không bảo đảm tạo lập được nhà đất; trở ngại về nhà đất cũng chưa phải bất lợi của toàn bộ tài chính.',
 'work-income-boundary':'Trở ngại và sự khó bền trong công việc chưa đồng nghĩa thu nhập giảm hay thiếu tiền. Phần tiền bạc và nhà đất vẫn cần được đọc theo những điều kiện riêng.',
 'A':'Lời về cơ nghiệp và tạo dựng của Tử Vi–Thiên Tướng khác chiều với lời Đà La về không có cơ nghiệp hoặc mất phần thừa hưởng. Chưa có cách kết hợp để chọn một kết quả chung, cũng không thể tự chia thành các giai đoạn cuộc đời.',
 'D':'Công danh của Thất Sát và những trắc trở, sự khó bền lâu của Kình–Lực đều cần được giữ cùng điều kiện riêng. Chưa có căn cứ xác định kết quả chung, mức độ hoặc giai đoạn ứng với mỗi lời.'
};
const ruleIds=(p:CustomerParagraph)=>p.members.flatMap(m=>m.claim.rules.map(r=>r.id));
/** Put existing relation participants together, followed by their explanation. Broad scope notes stay last.
 * This is an order of reading, not a new claim union, causal relation or priority. */
export function editCustomerTopics(sections:CustomerSection[],continuous:ContinuousReport){
 for(const section of sections.filter(s=>['assets','natal-palace-4'].includes(s.id))){
  const career=section.id==='natal-palace-4';
  const spending=section.paragraphs.some(p=>ruleIds(p).includes('trungchau.spend201'));
  section.intro=career?'Những lời dưới đây nói về công việc, công danh và điều kiện đi kèm. Liên hệ với một ngành nghề trong cách đọc truyền thống không phải đề nghị chọn nghề.':'Phần này tách nguồn thu, tích lũy và nhà đất. Một lời có thể nói đến cả thừa hưởng lẫn tự tạo dựng; các ý ấy được đọc cùng nhau, không suy thành mức tài sản chung.';
  if(spending)section.intro+=' Mục chi tiêu ngoài công việc nói riêng về khoản chi của bạn, kể cả sinh hoạt gia đình.';
  for(const p of section.paragraphs){
   const relation=p.id.startsWith('customer-relation-')?p.id.slice('customer-relation-'.length):p.id.startsWith('customer-coordination-')?p.id.slice('customer-coordination-'.length):undefined;
   if(relation){
    if(relationCopy[relation]){p.text=relationCopy[relation];p.sentences=[{text:p.text,claimIds:p.claimIds,kind:p.sentences[0]?.kind??'editorial-transition'}];}
    p.title=['money-property','work-income-boundary'].includes(relation)?'Đọc các phương diện cùng nhau':'Giới hạn khi đọc các lời trên';
    continue;
   }
   const ids=ruleIds(p);
   if(career){p.title=ids.some(id=>['trungchau.move365','tanbien.r40','tanbien.career-void-tu-ngo','tanbien.career-ky-base','tanbien.career-ky-exception','tanbien.career-kinh-luc'].includes(id))?'Tiến trình và sự ổn định công việc':'Công việc và công danh';continue;}
   const entry=continuous.financeAssets?.entries.find(e=>e.groupId===p.id);
   if(entry?.palace==='Điền Trạch'){
    const labels=[...new Set(ids.map(id=>propertyFacets[id]).filter(Boolean))];
    p.title=labels.length===1?labels[0]:'Nhà đất';
   }
  }
  const all=section.paragraphs;
  const notes=all.filter(p=>p.id.startsWith('customer-relation-')||p.id.startsWith('customer-coordination-'));
  const broad=notes.filter(p=>['customer-relation-money-property','customer-relation-work-income-boundary'].includes(p.id));
  const local=notes.filter(p=>!broad.includes(p));
  const narrative=all.filter(p=>!notes.includes(p));
  const pending=new Set(narrative);const emitted=new Set<CustomerParagraph>();const ordered:CustomerParagraph[]=[];
  for(const first of narrative){
   if(!pending.has(first))continue;
   const cluster=new Set([first]);let grew=true;
   while(grew){grew=false;for(const note of local){
    const participants=narrative.filter(p=>p.claimIds.some(id=>note.claimIds.includes(id)));
    if(participants.some(p=>cluster.has(p)))for(const p of participants)if(!cluster.has(p)){cluster.add(p);grew=true;}
   }}
   // The explicit Tử Vi/void relationship predates this presenter. Keep both whole groups adjacent.
   if(career&&[...cluster].some(p=>ruleIds(p).includes('tanbien.r40')))
    narrative.filter(p=>ruleIds(p).includes('tanbien.career-void-tu-ngo')).forEach(p=>cluster.add(p));
   for(const p of narrative.filter(p=>cluster.has(p)&&pending.has(p))){ordered.push(p);pending.delete(p);}
   for(const note of local)if(!emitted.has(note)&&note.claimIds.some(id=>[...cluster].some(p=>p.claimIds.includes(id)))){ordered.push(note);emitted.add(note);}
  }
  section.paragraphs=[...ordered,...local.filter(p=>!emitted.has(p)),...broad];
 }
}
