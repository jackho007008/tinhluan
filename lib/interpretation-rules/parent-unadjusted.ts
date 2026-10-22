import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {familyBranches,familyAssessment,familyKey,makeFamilyRule} from './phu-huynh';
import {familyVcdBranches,familyVcdAssessment,familyVcdKey,familyVcdRules} from './family-vcd';
import {ruleSchema} from './schema';

// Explicit independent clauses from the existing audit. No antonym generation.
// §5.2.30 concerns parents' wealth/status, not harmony, inheritance or disposal.
// Conditional/prescriptive separation is deliberately not copied (Tử–Phá/Tử–Tham).
export const parentUnadjustedText:Record<string,string>={
 'tu-phu':'mô tả con được thừa hưởng phần của cải cha mẹ để lại.',
 'tu-tuong':'mô tả gia đình yên vui.',
 'tu-sat':'mô tả sự bất hòa, không hợp tính giữa cha mẹ và con, và gia đình ly tán.',
 'tu-pha':'mô tả trong nhà hay có sự bất hòa.',
 'tu-tham':'mô tả hoàn cảnh cha mẹ bình thường.',
 'liem':'mô tả con sớm xa cách cha mẹ.',
 'liem-phu':'mô tả cha mẹ bất hòa, cha mẹ và con không hợp tính.',
 'liem-tham':'mô tả sự xa cách trong gia đình, con sớm lìa cha mẹ.',
 'dong-dau':'mô tả hoàn cảnh cha mẹ bình thường.',
 'dong-ty-hoi':'mô tả cha mẹ xa cách nhau, con thường phải xa cha mẹ.',
 'vu-tham':'mô tả cha mẹ và con không hợp tính, trong nhà thiếu hòa khí.',
 'sun-moon':'mô tả cha mẹ bất hòa, con khó sống gần cha mẹ.',
 'co-low':'mô tả hoàn cảnh cha mẹ bình thường, cha mẹ và con không hợp tính.',
 'co-am-dan':'mô tả con sớm xa cách cha mẹ.',
 'phu-other':'mô tả con sớm xa cách cha mẹ.',
 'tham-thin-tuat':'mô tả con không được thừa hưởng của cha mẹ, trong nhà thiếu hòa khí.',
 'tham-dan-than':'mô tả cha mẹ bất hòa, hay xa cách nhau và không hợp tính con.',
 'tham-ty-ngo':'mô tả hoàn cảnh cha mẹ bình thường, trong nhà thiếu hòa khí.',
 'cu-high':'mô tả cha mẹ không hợp tính con; phần chung của mục còn nêu bất hòa và tranh chấp.',
 'tuong-high':'mô tả cha mẹ hay bất hòa.',
 'tuong-low':'mô tả hoàn cảnh cha mẹ bình thường.',
 'luong-suu-mui':'mô tả hoàn cảnh cha mẹ bình thường, trong nhà thiếu hòa khí.',
 'sat-dan-than':'mô tả cha mẹ bất hòa hoặc cha mẹ và con không hợp tính.',
 'sat-ngo':'mô tả cha mẹ bất hòa hoặc cha mẹ và con không hợp tính.',
 'pha-ty-ngo':'mô tả trong nhà thiếu hòa khí.',
 'loc':'mô tả con làm tiêu tán phần của cải cha mẹ, cha mẹ và con không hợp tính.',
};
export const parentUnadjustedBranches=[
 ...familyBranches.filter(r=>r.palace==='Phụ Mẫu'&&r.wealth&&parentUnadjustedText[r.id]).map(row=>({row,vcd:false})),
 ...familyVcdBranches.filter(r=>r.palace==='Phụ Mẫu'&&r.wealth&&parentUnadjustedText[r.id]).map(row=>({row,vcd:true})),
];
export type ParentUnadjustedBranch=typeof parentUnadjustedBranches[number];
export const parentUnadjustedKey=({row,vcd}:ParentUnadjustedBranch)=>(vcd?familyVcdKey(row):familyKey(row))+'-unadjusted';
export function parentUnadjustedAssessment(s:ChartSnapshot,b:ParentUnadjustedBranch){
 const assess=b.vcd?familyVcdAssessment:familyAssessment;
 const structural=assess(s,{...b.row,wealth:false});
 if(structural.value!==true)return structural;
 const original=assess(s,b.row);
 const paths=[...new Set([...structural.paths,...original.paths])];
 // Emit only when the whole source clause is withheld. Never duplicate the
 // unadjusted fragment alongside the same full clause on no-void charts.
 if(original.value===true)return {...structural,paths,value:false,text:'Câu đầy đủ đã xuất; không lặp vế độc lập.'};
 return {...structural,paths,value:true,text:structural.text+' Chỉ giữ vế độc lập ngoài giàu nghèo/sang hèn của §5.2.30; không đảo sao tọa thủ hoặc sao xung chiếu.'};
}
export const parentUnadjustedFacts=(s:ChartSnapshot):DerivedFact[]=>parentUnadjustedBranches.flatMap(b=>{
 const a=parentUnadjustedAssessment(s,b),id=parentUnadjustedKey(b);
 return a.value===undefined?[]:[{id:'fact.'+id,derivationId:id,version:'1.0.0',value:a.value?'yes':'no',text:a.text,evidencePaths:a.paths,status:'engine-reported' as const,limitation:'Vế độc lập đã đối chiếu; không áp phép nghịch đảo hoặc chuyển điều chỉnh giữa hai cung.'}];
});
export const parentUnadjustedRules=parentUnadjustedBranches.map(b=>{
 const id=parentUnadjustedKey(b),base=b.vcd?familyVcdRules.find(r=>r.id==='tanbien.'+familyVcdKey(b.row))!:makeFamilyRule(b.row);
 const position=b.vcd?'Phụ Mẫu vô chính diệu, '+b.row.stars.join('–')+' xung chiếu':base.presentation!.title;
 return ruleSchema.parse({...base,id:'tanbien.'+id,version:'0.1.0',requiredFacts:['fact.'+id,'fact.source-position-available'],conditions:[{fact:'fact.'+id,op:'eq',value:'yes'}],
 claimTemplate:'Theo Tân Biên, '+position+', sách '+parentUnadjustedText[b.row.id],
 evidencePaths:['chart.palaces','chart.tanBien.completeness'],
 sourceReferences:base.sourceReferences.map(r=>({...r,location:r.location+' Tách vế độc lập theo PDF131 §5.2.30: chỉ giàu nghèo/sang hèn chịu nghịch đảo; không suy đảo thừa hưởng, tiêu tán hoặc quan hệ.',accessedOn:'2026-10-22'})),
 presentation:{...base.presentation,title:position+' — phương diện độc lập',projectScope:['parent-unadjusted-1.0.0; dùng evaluator vị trí và pipeline chung.','Chỉ khi câu đầy đủ bị giữ lại; không trùng vế đã có.','Giữ đúng vế quan hệ, nguồn thừa hưởng, tiêu tán hoặc hoàn cảnh trung tính; không xuất kết quả đảo giàu nghèo/sang hèn.','Không dùng chỉ dẫn tọa thủ để nghịch đảo chính tinh xung chiếu.'],knownExceptions:['Phép đảo phần giàu nghèo/sang hèn giữ riêng; không chặn vế độc lập.'],unknownConditions:['Chưa có bảng đối ứng chi tiết cho phần giàu nghèo/sang hèn hoặc vị trí áp điều chỉnh khi xung chiếu.']}});
});
