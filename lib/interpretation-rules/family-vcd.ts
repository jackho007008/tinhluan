import type {ChartSnapshot} from '../tuvi-engine';
import {CHART_BRANCHES, principalIntegrity} from '../tuvi-engine/chart-integrity';
import {voidMembership} from '../internal-review/career-definitions';
import type {DerivedFact} from './derived';
import {familyBranches, familyKey, type FamilyBranch, type FamilyAssessment} from './phu-huynh';
import {siblingsVuTham} from './family-extension';
import {ruleSchema} from './schema';

export const FAMILY_VCD_METHOD = 'tanbien-family-vcd-pairs-1.0.0';
// Explicit source whitelist, not a generic transfer of opposite-palace interpretations.
// PDF131 §5.2.31 / PDF224 §15.2.47 + each receiving-palace clause below.
const selected = {
  'Phụ Mẫu': ['tu-phu','tu-tuong','tu-sat','tu-pha','tu-tham','liem-phu','liem-tuong','liem-sat','liem-tham','dong-luong','dong-cu','vu-phu','vu-tuong','vu-tham','vu-pha','co-luong','co-cu'],
  'Huynh Đệ': ['tu-phu','tu-tuong','tu-sat','tu-pha','tu-tham','liem-phu','liem-tuong','liem-tham','dong-luong','dong-cu','vu-phu','vu-pha','co-luong','co-cu'],
};
// Only independent in-scope clauses are used. Do not turn a prescription to live
// apart to avoid harm into a prediction that separation will occur.
const independent:Record<string,string> = {
  'parents-tu-pha': 'mô tả cha mẹ khá giả nhưng trong nhà hay có sự bất hòa.',
  'parents-tu-tham': 'mô tả hoàn cảnh cha mẹ bình thường.',
  'parents-liem-sat': 'mô tả trong nhà thường có sự bất hòa.',
  'parents-co-cu': 'mô tả trong nhà thiếu hòa khí.',
  'siblings-dong-cu': 'mô tả trong nhà thiếu hòa khí.',
};
export const familyVcdBranches:FamilyBranch[] = Object.entries(selected).flatMap(([palace,ids]) => ids.map(id => {
  const row=familyBranches.find(r=>r.palace===palace&&r.id===id);
  if(!row || row.branches.length || row.mode!=='exact' || row.stars.length!==2)throw Error('FAMILY_VCD_SOURCE_SCOPE');
  return {...row,text:independent[familyKey(row)]??row.text};
})).concat([siblingsVuTham, {
  // PDF219 §15.2.5 does not specify Sửu/Mùi for this sentence. The direct
  // catalog's branch gate is not copied into this position-independent clause.
  palace:'Huynh Đệ',id:'sun-moon',stars:['Thái Dương','Thái Âm'],branches:[],mode:'exact',wealth:false,
  text:'mô tả anh chị em khá giả nhưng thiếu hòa khí.',page:219,section:'15.2.5',
}]);
export const familyVcdKey=(r:FamilyBranch)=>familyKey(r).replace(/^(parents|siblings)-/,'$1-vcd-');

export function familyVcdAssessment(s:ChartSnapshot,r:FamilyBranch):FamilyAssessment {
  const paths=['chart.tanBien.completeness'];
  const result=(value:boolean|undefined,text:string,cause?:FamilyAssessment['cause'])=>({value,text,cause,paths});
  if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)
    return result(undefined,'Chưa xác nhận đủ 14 chính tinh bản mệnh và 12 cung hợp lệ.','missing-data');
  const donorName=r.palace==='Phụ Mẫu'?'Tật Ách':'Nô Bộc';
  const ti=s.chart.palaces.findIndex(p=>p.name===r.palace),di=s.chart.palaces.findIndex(p=>p.name===donorName);
  if(ti<0||di<0)return result(undefined,'Thiếu định danh cung nhận hoặc đối cung.','missing-data');
  const t=s.chart.palaces[ti],d=s.chart.palaces[di];
  for(const i of [ti,di])paths.push(...['name','earthlyBranch','majorStars'].map(k=>`chart.palaces.${i}.${k}`));
  if((CHART_BRANCHES.indexOf(t.earthlyBranch)+6)%12!==CHART_BRANCHES.indexOf(d.earthlyBranch))
    return result(undefined,'Tên cung và vị trí xung chiếu không nhất quán.','missing-data');
  if(t.majorStars.length!==0)return result(false,`${r.palace} có chính tinh tọa thủ; không áp dụng vô chính diệu.`);
  if(d.majorStars.length!==2||!r.stars.every(n=>d.majorStars.some(st=>st.name===n)))
    return result(false,`Đối cung không có đúng cả cặp ${r.stars.join('–')}; không thay xung chiếu bằng tam hợp.`);
  if(r.wealth){
    paths.push('chart.tanBien.voidRanges');
    const ranges=s.chart.tanBien?.voidRanges;
    if(!ranges||ranges.length!==2||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>[t,d].some(p=>voidMembership(p.earthlyBranch,v.branches)===undefined)))
      return result(undefined,'Thiếu vị trí Tuần/Triệt hợp lệ để kiểm điều chỉnh giàu nghèo, sang hèn.','missing-data');
    if(ranges.some(v=>[t,d].some(p=>v.branches.includes(p.earthlyBranch))))
      return result(undefined,'Tuần/Triệt ở Phụ Mẫu hoặc đối cung: chưa chốt vị trí và kết quả phép nghịch đảo §5.2.30 khi xung chiếu. Đây là giới hạn triển khai, không phải điều kiện vắng sao của sách.','unresolved-adjustment');
  }
  return result(true,`${r.palace} tại ${t.earthlyBranch} không có chính tinh. ${donorName} tại ${d.earthlyBranch} có ${r.stars.join('–')} xung chiếu. Chỉ xét câu riêng về ${r.palace}; không chuyển lời ${donorName}, sao phụ hoặc trạng thái.`);
}
export function familyVcdFacts(s:ChartSnapshot):DerivedFact[]{return familyVcdBranches.flatMap(r=>{
  const a=familyVcdAssessment(s,r);return a.value===undefined?[]:[{
    id:'fact.'+familyVcdKey(r),derivationId:familyVcdKey(r),version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'engine-reported' as const,
    limitation:'Câu riêng của cung nhận không đòi trạng thái/địa chi; không sửa vị trí sao, không truyền phụ tinh hay lời đối cung.',
  }];
});}

export const familyVcdRules=familyVcdBranches.map(r=>{
  const parent=r.palace==='Phụ Mẫu',bridge=parent?'131 §5.2.31':'224 §15.2.47';
  return ruleSchema.parse({
    id:'tanbien.'+familyVcdKey(r),version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',
    requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.'+familyVcdKey(r),'fact.source-position-available'],
    conditions:[{fact:'fact.'+familyVcdKey(r),op:'eq',value:'yes'}],exceptions:[],
    claimTemplate:`Theo Tân Biên, ${r.palace} vô chính diệu xét cặp ${r.stars.join('–')} xung chiếu theo lời riêng về ${r.palace}: sách ${r.text}`,
    evidencePaths:['chart.palaces','chart.tanBien.completeness',...(r.wealth?['chart.tanBien.voidRanges']:[])],
    sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',
      location:`Trang PDF${bridge}: chỉ dẫn riêng vô chính diệu; PDF${r.page} §${r.section}: lời của cặp trong cung nhận; ngữ cảnh ${parent?'124–131, nhất là §5.2.30':'217–224, giới hạn phối hợp Phúc Đức trang217'}; định nghĩa PDF33. Bản277trang SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc.`,accessedOn:'2026-10-21',rights:'pending',rightsNote:'Đối chiếu chữ và ảnh; chưa phê duyệt chuyên môn.'}],
    conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
    limitations:['Chú giải cục bộ trong phạm vi câu đã đối chiếu, không kết luận hoàn cảnh thực tế của người thân.','Không xuất số lượng, sinh tử, bệnh tật, phẩm hạnh hoặc lời khuyên sống xa gia đình để tránh tai họa. Không thay chúng bằng lời nhẹ hơn.'],
    presentation:{title:`${r.palace} vô chính diệu, ${r.stars.join('–')} xung chiếu`,readingTheme:parent?'parents':'siblings',contentType:'combination',
      sourceConditions:[`${r.palace} không có chính tinh tọa thủ.`,`Đúng cả hai chính tinh ${r.stars.join('–')} bản mệnh ở đối cung; quan hệ xung chiếu.`],
      projectScope:[FAMILY_VCD_METHOD,'Chứng nhận chính tinh đầy đủ và toàn vẹn. Không dựng cung giả.','Trạng thái: không dùng; câu được chọn không có điều kiện địa chi/sáng-hãm. Không suy đã giải cách lấy trạng thái cho nhánh khác.',r.wealth?'Giữ chưa xác định khi Tuần/Triệt tại cung nhận hoặc cung cho; chưa giải vị trí áp dụng §5.2.30.':'Không thêm cổng vắng Tuần/Triệt cho câu không thuộc phép đảo giàu nghèo của Phụ Mẫu.'],
      readerLimit:parent?'Lời riêng về cha mẹ và quan hệ gia đình; chưa hợp nhất với Nhật–Nguyệt và các yếu tố khác.':'Lời riêng về anh chị em; chưa phối hợp Phúc Đức để kết luận toàn bộ, không xác định người thân cụ thể.',
      knownExceptions:[r.wealth?'Tuần/Triệt ở một trong hai cung: giữ chưa xác định, không tự đảo lời.':'Không chuyển điều chỉnh, phụ tinh, Tứ Hóa hoặc lời của đối cung.'],
      unknownConditions:['Thiếu hoặc bất nhất chứng nhận, định danh hoặc vị trí: không xuất.','Câu có điều kiện địa chi, trạng thái hoặc ngoại lệ chưa xác định vị trí không thuộc phương pháp này.'],
      applicability:`${r.palace} vô chính diệu có đúng cặp đã chỉ định xung chiếu.`,sourceScope:`Chỉ ${r.palace}; không luận Tật Ách/Nô Bộc hoặc tổng hợp liên cung.`},
  });
});
