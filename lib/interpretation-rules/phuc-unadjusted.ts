import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {completionAssessment,completionBranches,completionRules,type CompletionBranch} from './natal-completion';
import {ruleSchema} from './schema';

// TB132 §6.1.1 and TB140 §6.1.36–37 preserve this same facet.
// No operator for sát/TT is inferred, and no other part of the base is released.
export const phucUnadjustedBranches=completionBranches.filter(r=>['phuc-base-tu-pha','phuc-base-tu-tham'].includes(r.id));
export const phucUnadjustedKey=(r:CompletionBranch)=>r.id+'-dispersal';
export function phucUnadjustedAssessment(s:ChartSnapshot,r:CompletionBranch){
 const structural=completionAssessment(s,r,'phuc-dispersal');
 if(structural.value!=='yes')return structural;
 const original=completionAssessment(s,r);
 if(original.value==='yes')return {...structural,value:'no' as const,text:'Câu nền đầy đủ đã có vế ly tán; không xuất lại vế này.'};
 if(original.cause!=='unresolved-adjustment')return original;
 return structural;
}
export const phucUnadjustedFacts=(s:ChartSnapshot):DerivedFact[]=>phucUnadjustedBranches.flatMap(r=>{
 const a=phucUnadjustedAssessment(s,r),id=phucUnadjustedKey(r);
 return a.value===undefined?[]:[{id:'fact.'+id,derivationId:id,version:'1.0.0',value:a.value,text:a.text,evidencePaths:a.paths,status:'source-table' as const,limitation:'Chỉ vế ly tán của hai bộ tọa Phúc đã đặc tả; không phục hồi lời nền hoặc đảo nghĩa sao.'}];
});
export const phucUnadjustedRules=phucUnadjustedBranches.map(r=>{
 const base=completionRules.find(b=>b.id==='tanbien.'+r.id)!,id=phucUnadjustedKey(r);
 return ruleSchema.parse({...base,id:'tanbien.'+id,version:'0.1.0',requiredFacts:['fact.'+id,'fact.source-position-available'],conditions:[{fact:'fact.'+id,op:'eq',value:'yes'}],
 claimTemplate:`Theo Tân Biên, ${r.stars!.join('–')} bản mệnh đồng cung Phúc Đức có lời riêng về sự phân tán của họ hàng.`,
 sourceReferences:base.sourceReferences.map(s=>({...s,location:'PDF132§6.1.1: riêng câu họ hàng ly tán của Tử–Phá/Tử–Tham. Đối chiếu PDF140§6.1.36–37: cùng phương diện phân tán; khá giả không phải tụ họp. Không suy lượng từ sát hoặc toán tử TT, không xuất sinh tử/đảo toàn lời nền.',accessedOn:'2026-10-22'})),
 presentation:{...base.presentation,title:r.stars!.join('–')+' tại Phúc Đức — họ hàng',contentType:'combination',projectScope:['phuc-unadjusted-1.0.0; chỉ khi câu nền bị giữ bởi sát/TT.','Dùng chung kiểm cấu trúc/chứng nhận và cặp TT của lời nền; không rule theo hồ sơ.','Không lặp khi nền đầy đủ đã có; gộp cùng ý với Hóa Kỵ, giữ mọi căn cứ.'],sourceConditions:[r.stars!.join('–')+' bản mệnh thực sự cùng tọa Phúc Đức; không xung/tam chiếu.'],knownExceptions:['Chỉ giữ vế ly tán; mọi vế còn lại và các cổng của chúng không đổi.','Khá giả và phân tán là hai phương diện; không suy cái này phủ định cái kia.'],unknownConditions:['Chưa chốt phép điều chỉnh toàn nền hoặc lượng từ sát/TT; không dùng chúng để suy kết quả khác.','Thiếu/bất nhất chứng nhận hoặc vị trí nguồn vẫn không xuất.'],sourceScope:'Một vế độc lập TB132§6.1.1, không mở các bộ Tử Vi khác hoặc Phúc VCD.'}});
});
