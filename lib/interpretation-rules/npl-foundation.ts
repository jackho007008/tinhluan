import type {ChartSnapshot} from '../tuvi-engine';
import {principalIntegrity} from '../tuvi-engine/chart-integrity';
import type {DerivedFact} from './derived';
import {ruleSchema} from './schema';
import {NPL_NAP_AM,NPL_STAR_ELEMENTS,nplRelation,assessNplTwo,nplTwoRules,nplTwoFacts} from './npl-two-major';
export type Element='Kim'|'Thủy'|'Mộc'|'Hỏa'|'Thổ';
export const FOUNDATION_VERSION='npl-foundation-1.0.0';
export const NPL_ELEMENT_V2='npl-elements-1.1.0';
export const NPL_NAP_AM_V2=NPL_NAP_AM.map((v,i)=>i===14?'Trường Lưu Thủy':v);
export const NPL_BRANCH_ELEMENTS:Record<string,Element>={Tý:'Thủy',Sửu:'Thổ',Dần:'Mộc',Mão:'Mộc',Thìn:'Thổ',Tỵ:'Hỏa',Ngọ:'Hỏa',Mùi:'Thổ',Thân:'Kim',Dậu:'Kim',Tuất:'Thổ',Hợi:'Thủy'};
// HS13: rows Giáp/Kỷ ... Mậu/Quý, columns Tý/Sửu ... Tuất/Hợi.
export const NPL_CUC_ROWS:Element[][]=[['Thủy','Hỏa','Mộc','Thổ','Kim','Hỏa'],['Hỏa','Thổ','Kim','Mộc','Thủy','Thổ'],['Thổ','Mộc','Thủy','Kim','Hỏa','Mộc'],['Mộc','Kim','Hỏa','Thủy','Thổ','Kim'],['Kim','Thủy','Thổ','Hỏa','Mộc','Thủy']];
export const NPL_FOUNDATION_TABLES={version:NPL_ELEMENT_V2,napAm:NPL_NAP_AM_V2,stars:NPL_STAR_ELEMENTS,branches:NPL_BRANCH_ELEMENTS,cucRows:NPL_CUC_ROWS};
const cucLabels:Record<string,Element>={'Thủy Nhị Cục':'Thủy','Mộc Tam Cục':'Mộc','Kim Tứ Cục':'Kim','Thổ Ngũ Cục':'Thổ','Hỏa Lục Cục':'Hỏa'};
const elements=['Kim','Thủy','Mộc','Hỏa','Thổ'];
export const NPL_ONE_CELLS:Record<string,string>={'generates/generates':'tốt nhất','same/generates':'tốt nhì','generates/same':'tốt ba','same/same':'tốt bốn','controls/generates':'vừa','controls/same':'xấu bốn','generates/controls':'xấu ba','same/controls':'xấu nhì','controls/controls':'xấu nhất'};
export const NPL_CUC_GRADES:Record<string,string>={generates:'tốt nhất','birth-generates':'tốt nhì',same:'trung bình','birth-controls':'xấu vừa',controls:'xấu nhất'};
const relationWords:Record<string,string>={generates:'sinh',controls:'khắc',same:'cùng hành với','birth-generates':'được sinh bởi','birth-controls':'bị khắc bởi'};
type Assessment={mode:'ready'|'unknown'|'unsupported'|'outside';reason:string;key:string;text:string;paths:string[]};
export function assessNplFoundation(s:ChartSnapshot,kind:'cuc'|'empty'|'one',tables:typeof NPL_FOUNDATION_TABLES|null=NPL_FOUNDATION_TABLES):Assessment{
 const paths=['chart.lunar.lunarYear','chart.tanBien.birthElement','chart.tanBien.completeness.majorStars','chart.palaces'];
 const result=(mode:Assessment['mode'],reason:string,key='',text=''):Assessment=>({mode,reason,key,text,paths});
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return result('unknown','Danh sách chính tinh chưa đầy đủ, hợp lệ.');
 const p=s.chart.palaces.find(p=>p.name==='Mệnh');if(!p)return result('unknown','Thiếu cung Mệnh.');
 paths.push(`chart.palaces.${s.chart.palaces.indexOf(p)}.majorStars`);
 if(kind!=='cuc'&&p.majorStars.length!==(kind==='empty'?0:1))return result('outside','Số chính tinh tọa Mệnh không thuộc phép xét này.');
 if(!tables||tables.version!==NPL_ELEMENT_V2)return result('unknown','Thiếu bảng NPL đúng phiên bản.');
 const y=s.chart.lunar?.lunarYear;if(!Number.isInteger(y))return result('unknown','Thiếu năm âm đã lưu.');
 const pair=Math.floor(((y-4)%60+60)%60/2),nap=tables.napAm[pair];
 if(!nap)return result('unknown','Thiếu hàng nạp âm nguồn.');
 if(!('birthElement' in s.chart.tanBien)||s.chart.tanBien.birthElement?.value!==nap)return result('unknown','Nạp âm đã lưu thiếu hoặc mâu thuẫn bảng nguồn.');
 const birth=nap.split(' ').at(-1) as Element;if(!elements.includes(birth))return result('unknown','Hành Bản Mệnh chưa xác định.');
 let key='',description='',grade='';
 if(kind==='cuc'){
  paths.push('chart.fiveElementsClass');
  const cuc=cucLabels[s.chart.fiveElementsClass],branch=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'].indexOf(p.earthlyBranch);
  const expected=tables.cucRows[((y-4)%10+10)%10%5]?.[Math.floor(branch/2)];
  if(!cuc||!expected||cuc!==expected)return result('unknown','Cục đã lưu thiếu hoặc không khớp quy ước can năm âm và cung Mệnh ở Hàm Số PDF13.');
  key=nplRelation(cuc,birth);grade=NPL_CUC_GRADES[key];description=`Cục thuộc ${cuc} ${relationWords[key]} Bản Mệnh thuộc ${birth} (${nap})`;
 }else{
  const palace=tables.branches[p.earthlyBranch];if(!elements.includes(palace))return result('unknown','Thiếu hành cung theo bảng NPL.');
  if(kind==='empty'){
   key=nplRelation(palace,birth);if(!['generates','controls'].includes(key))return result('unsupported','Quan hệ đã xác định nhưng câu về Mệnh không chính tinh chỉ đánh giá chiều cung sinh hoặc khắc Bản Mệnh.',key);
   grade=key==='generates'?'tốt':'xấu';description=`Mệnh tại ${p.earthlyBranch} không có chính tinh tọa thủ; hành cung ${palace} ${relationWords[key]} Bản Mệnh ${birth} (${nap})`;
  }else{
   const star=p.majorStars[0].name,element=tables.stars[star];if(!elements.includes(element))return result('unknown','Thiếu hành duy nhất của chính tinh theo NPL.');
   const first=nplRelation(palace,element),second=nplRelation(element,birth);key=first+'/'+second;grade=NPL_ONE_CELLS[key];
   if(!grade)return result('unsupported','Hai quan hệ đã xác định nhưng có chiều ngoài chín ô bảng một chính tinh PDF109; không suy ô đối xứng.',key);
   description=`Mệnh tại ${p.earthlyBranch} có ${star} là chính tinh duy nhất: hành cung ${palace} ${relationWords[first]} hành sao ${element}; hành sao ${element} ${relationWords[second]} Bản Mệnh ${birth} (${nap})`;
  }
 }
 return result('ready','Đối chiếu đúng ô nguồn; bổ sung phương diện ngũ hành, không thay thế nhận định cũ.',key,`${description}. Trong phép xét ${kind==='cuc'?'Bản Mệnh–Cục':kind==='empty'?'Mệnh không chính tinh':'một chính tinh qua hai tầng quan hệ'} của Nguyễn Phát Lộc, trường hợp này được xếp “${grade}”. Mức này chỉ đánh giá các quan hệ vừa nêu, không phải mức tốt/xấu của toàn cung hay kết quả thực tế của người đọc.`);
}
export function nplFoundationFacts(s:ChartSnapshot):DerivedFact[]{return (['cuc','empty','one'] as const).flatMap(kind=>{const a=assessNplFoundation(s,kind);if(a.mode==='unknown')return[];return Object.entries({mode:a.mode,text:a.text,key:a.key}).map(([k,value])=>({id:`fact.life-npl-foundation-${kind}-${k}`,value,text:k==='text'?value:a.reason,evidencePaths:a.paths,derivationId:FOUNDATION_VERSION,version:'1.0.0',status:'source-table' as const,limitation:'Chỉ ô nguồn đã xác định; không thay nhãn trạng thái, snapshot hoặc lời sao.'}));});}
const th={id:'npl-foundation-source',title:'Nguyễn Phát Lộc — Tử Vi Tổng Hợp',url:'/internal/editorial/npl-foundation#npl-108',location:'PDF62,102,108–109; nạp âm349–352. Chỉ số PDF, chưa xác minh phân trang ấn bản giấy.',accessedOn:'2026-10-14',rights:'pending',rightsNote:'SHA25682f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37; đối chiếu ảnh, chưa phê duyệt chuyên môn.'};
export const hs={...th,id:'npl-foundation-hamso',title:'Nguyễn Phát Lộc — Tử Vi Hàm Số',url:'/internal/editorial/npl-foundation#hs-011',location:'PDF10–11: Nhâm Thìn/Quý Tỵ — Trường Lưu Thủy; PDF13: đối chiếu Cục. Bản237trang.',rightsNote:'SHA2562a0245dcadaf77f2d8e35c9798893343c3be7117c5cc40a42087153ea5212709; bổ sung hàng thiếu của Tổng Hợp, không đổi engine.'};
export const nplFoundationRules=(['cuc','empty','one'] as const).map(kind=>ruleSchema.parse({
 ...nplTwoRules[0],id:`npl.life-foundation-${kind}`,version:'0.1.0',requiredFacts:[`fact.life-npl-foundation-${kind}-mode`,`fact.life-npl-foundation-${kind}-text`,`fact.life-npl-foundation-${kind}-key`],conditions:[{fact:`fact.life-npl-foundation-${kind}-mode`,op:'eq',value:'ready'}],claimTemplate:`{{fact.life-npl-foundation-${kind}-text}}`,sourceReferences:[th,hs,...(kind==='cuc'?[{...hs,id:'npl-cuc-image',url:'/internal/editorial/npl-foundation#hs-013',location:'PDF13: bảng đối chiếu Cục'}]:[{...th,id:'npl-foundation-table-image',url:'/internal/editorial/npl-foundation#npl-109',location:'PDF109: bảng một chính tinh và phạm vi hai chính tinh'},{...th,id:'npl-palace-image',url:'/internal/editorial/npl-foundation#npl-062',location:'PDF62: sơ đồ hành cung'}])],evidencePaths:['chart.palaces','chart.lunar.lunarYear','chart.tanBien.birthElement',...(kind==='cuc'?['chart.fiveElementsClass']:[])],presentation:{...nplTwoRules[0].presentation,title:kind==='cuc'?'Bản Mệnh và Cục theo Nguyễn Phát Lộc':kind==='empty'?'Hành cung Mệnh không chính tinh và Bản Mệnh':'Một chính tinh: hành cung, hành sao và Bản Mệnh',sourceConditions:[kind==='cuc'?'TH108 §2a: năm quan hệ có chiều giữa Cục và Bản Mệnh.':kind==='empty'?'TH108 §2b trường hợp1: cung không chính tinh; hành cung sinh/khắc Bản Mệnh.':'TH108–109 trường hợp2: đúng một chính tinh; chỉ chín ô cung→sao→Bản Mệnh.'],projectScope:[FOUNDATION_VERSION,NPL_ELEMENT_V2,'Danh sách đầy đủ và hợp lệ; đối chiếu nạp âm/Cục đã lưu là cổng dữ liệu của dự án.'],readerLimit:'Phép ngũ hành được giữ riêng với lời sao; chưa phối hợp độ sáng, phụ tinh, Tuần/Triệt và lợi địa thành đánh giá toàn cung.',knownExceptions:['Đoạn108–109 không đặc tả ngoại lệ cho đánh giá quan hệ riêng này. Không suy rằng mọi ngoại lệ khác đều không tồn tại.'],unknownConditions:['Thiếu hoặc mâu thuẫn dữ kiện/bảng: unknown. Chiều ngoài ô nguồn: chưa hỗ trợ, không suy ngược.'],applicability:'Bản mệnh theo từng số lượng chính tinh; không dùng sao lưu hoặc đối cung.',sourceScope:'Bổ sung riêng phương diện ngũ hành theo NPL; không thay thế chú giải cũ.'}}));
export const nplTwoV2Rules=nplTwoRules.map(r=>ruleSchema.parse({...r,version:'0.2.0',requiredFacts:r.requiredFacts.map(f=>f.replace('life-npl-two-','life-npl-two-v2-')),conditions:r.conditions.map(c=>({...c,fact:c.fact.replace('life-npl-two-','life-npl-two-v2-')})),claimTemplate:r.claimTemplate.replaceAll('life-npl-two-','life-npl-two-v2-'),sourceReferences:[...r.sourceReferences,hs],presentation:{...r.presentation,projectScope:[...(r.presentation?.projectScope??[]).filter(x=>x!=='npl-elements-1.0.0'),NPL_ELEMENT_V2],unknownConditions:['Thiếu hoặc mâu thuẫn danh sách/nạp âm/bảng: unknown. Hàng Nhâm Thìn/Quý Tỵ đã bổ sung từ Hàm Số10–11.']}}));
export const assessNplTwoV2=(s:ChartSnapshot)=>assessNplTwo(s,NPL_FOUNDATION_TABLES);
export const nplTwoV2Facts=(s:ChartSnapshot)=>nplTwoFacts(s,NPL_FOUNDATION_TABLES).map(f=>({...f,id:f.id.replace('life-npl-two-','life-npl-two-v2-'),version:'1.1.0',evidencePaths:[...f.evidencePaths,...s.chart.palaces.flatMap((p,i)=>p.name==='Mệnh'?[`chart.palaces.${i}.majorStars`]:[])],limitation:'NPL Tổng Hợp102,108–109,349–352; hàng14 bổ sung từ Hàm Số10–11. Không đổi nhãn trạng thái.'}));
