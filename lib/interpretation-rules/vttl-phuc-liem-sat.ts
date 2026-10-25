import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {principalIntegrity,CHART_BRANCHES} from '../tuvi-engine/chart-integrity';
import {voidMembership} from '../internal-review/career-definitions';
import {ruleSchema,readPath} from './schema';

export const VTTL_PHUC_LIEM_SAT='vttl.phuc-liem-sat-effort';
export const VTTL_PHUC_LIEM_SAT_FACT='fact.phuc-vttl-liem-sat-effort';
export const VTTL_PHUC_LIEM_SAT_METHOD='vttl-phuc-liem-sat-local-1.0.0';
export const VTTL_PHUC_LIEM_SAT_COPY='Trong cách luận về phúc đức, Liêm Trinh–Thất Sát được mô tả bằng sự vất vả, khó nhọc. Đây chưa phải kết luận về hoàn cảnh hay diễn biến thực tế của bạn.';
export const VTTL_PHUC_SAT_HOLD=['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh'] as const;

/** Approved project subset of PDF84, not a universal definition of the source word “thêm”. */
export function vttlPhucLiemSatAssessment(s:ChartSnapshot):{value?:'yes'|'no';reason:string;paths:string[];cause?:'missing-data'|'unresolved-adjustment'}{
 const paths=['chart.palaces','chart.tanBien.completeness.majorStars'];
 const result=(value:'yes'|'no'|undefined,reason:string,cause?:'missing-data'|'unresolved-adjustment')=>({value,reason,paths,cause:cause??(value===undefined?'missing-data' as const:undefined)});
 if(s.profile.id!=='tanbien-vn-trial-v2')return result(undefined,'Ngoài profile dữ kiện bản mệnh đã xác minh.');
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return result(undefined,'Thiếu chứng nhận hoặc dữ kiện 12 cung/14 chính tinh gốc không toàn vẹn.');
 const found=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Phúc Đức');
 if(found.length!==1)return result(undefined,'Chưa xác định duy nhất cung Phúc Đức bản mệnh.');
 const {p,i}=found[0];paths.push(`chart.palaces.${i}.name`,`chart.palaces.${i}.earthlyBranch`,`chart.palaces.${i}.majorStars`);
 if(p.majorStars.length!==2||!['Liêm Trinh','Thất Sát'].every(n=>p.majorStars.some(st=>st.name===n))||!['Sửu','Mùi'].includes(p.earthlyBranch))return result('no','Ngoài tập con Liêm–Sát đồng cung Phúc tại Sửu/Mùi; không mượn sao chiếu, không suy kết quả ngược.');
 paths.push('chart.tanBien.voidRanges');const ranges=s.chart.tanBien.voidRanges;
 if(!Array.isArray(ranges)||ranges.length!==2||ranges.some(v=>!v)||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))return result(undefined,'Thiếu hoặc bất nhất hai cặp Tuần/Triệt; không suy vắng TT trực tiếp Phúc.');
 const active=ranges.filter(v=>voidMembership(p.earthlyBranch,v.branches));
 if(active.length)return result(undefined,active.map(v=>v.name).join(' và ')+' trực tiếp Phúc: chưa đặc tả điều chỉnh đúng vế, giữ unknown.','unresolved-adjustment');
 const fields=['minorStars','adjectiveStars'] as const,c=s.chart.tanBien.completeness;
 paths.push('chart.tanBien.completeness.minorStars','chart.tanBien.completeness.adjectiveStars');
 const related=s.chart.palaces.map((q,j)=>({q,j})).filter(({q})=>[0,4,6,8].includes((CHART_BRANCHES.indexOf(q.earthlyBranch)-CHART_BRANCHES.indexOf(p.earthlyBranch)+12)%12));
 for(const {j}of related)paths.push(`chart.palaces.${j}.name`,`chart.palaces.${j}.earthlyBranch`,...fields.map(k=>`chart.palaces.${j}.${k}`));
 if(related.length!==4||fields.some(k=>c[k]!=='complete-with-declared-supplements')||related.some(({q})=>fields.some(k=>!Array.isArray(q[k])||q[k].some(st=>!st||typeof st.name!=='string'||!st.name.trim()||(st as {scope?:string}).scope!=='origin'))))return result(undefined,'Thiếu hoặc bất nhất danh sách phụ tinh/sao bổ sung bản mệnh tại bản phương, tam hợp hoặc xung Phúc; không suy vắng tập sao giữ.');
 if(related.some(({q})=>{const stars=fields.flatMap(k=>q[k]);return new Set(stars.map(st=>st.name)).size!==stars.length;}))return result(undefined,'Danh sách sao tại vị trí liên quan Phúc bị trùng; chưa chứng minh vắng tập sao giữ.');
 const held=related.flatMap(({q})=>fields.flatMap(k=>q[k].filter(st=>VTTL_PHUC_SAT_HOLD.some(n=>n===st.name)).map(st=>`${st.name} tại ${q.name} ${q.earthlyBranch}`)));
 if(held.length)return result(undefined,'Có '+held.join(', ')+' trong bản phương/tam hợp/xung Phúc: chưa phối điều chỉnh đúng vế Toàn Thư84, giữ unknown.','unresolved-adjustment');
 return result('yes',`Liêm Trinh–Thất Sát bản mệnh đồng cung Phúc ${p.earthlyBranch}; dữ liệu được chứng nhận, vắng TT trực tiếp và Kình/Đà/Hỏa/Linh tại bản phương/tam hợp/xung. Toàn Thư84 nói riêng “cùng Liêm Trinh tân khổ”. Chi Sửu/Mùi và các cổng TT/4 sát là tập con dự án được duyệt, không phải nguyên văn điều kiện sách. Không xác nhận hoàn cảnh thực tế hoặc loại mọi điều chỉnh khác.`);
}
export function vttlPhucLiemSatFacts(s:ChartSnapshot):DerivedFact[]{
 const a=vttlPhucLiemSatAssessment(s),common={derivationId:VTTL_PHUC_LIEM_SAT_METHOD,version:'1.0.0',text:a.reason,evidencePaths:a.paths.filter(p=>readPath(s,p)!==undefined),status:'source-table' as const,limitation:'Chỉ vế tân khổ riêng Toàn Thư84; không suy sức khỏe, tuổi thọ, nghèo khó, đạo đức hoặc hoàn cảnh họ hàng. Có điều chỉnh chưa giải/thiếu dữ liệu giữ unknown.'};
 return [{...common,id:VTTL_PHUC_LIEM_SAT_FACT+'-status',value:a.value??'unknown'},...(a.value?[{...common,id:VTTL_PHUC_LIEM_SAT_FACT,value:a.value}]:[])];
}
export const vttlPhucLiemSatRule=ruleSchema.parse({
 id:VTTL_PHUC_LIEM_SAT,version:'1.0.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:[VTTL_PHUC_LIEM_SAT_FACT],conditions:[{fact:VTTL_PHUC_LIEM_SAT_FACT,op:'eq',value:'yes'}],exceptions:[],claimTemplate:VTTL_PHUC_LIEM_SAT_COPY,evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges'],
 sourceReferences:[{id:'vttl170-phuc-liem-sat',title:'Vũ Tài Lục dịch và bình chú — Tử Vi Đẩu Số Toàn Thư',url:'/internal/editorial/vttl-phuc-liem-sat#effort',location:'PDF/header84, Phúc Đức, đoạn Thất Sát: cùng Liêm Trinh tân khổ; ngữ cảnh17–18,38–39,57,159; bản170trang.',accessedOn:'2026-10-25',rights:'pending',rightsNote:'Đúng nhánh/văn được chủ dự án duyệt theo đặc tả414be37; không mở các nhánh Toàn Thư khác/quyền thương mại. SHA256789b02281b5d52b4cb746baa12616a7c25bca468489c937a87eada3303d1b06b.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:['Không sửa/xóa câu Tân Biên hoặc coi vế này đã giải các chuỗi bệnh/sinh tử/hình ngục; không hoàn chỉnh Phúc.'],
 presentation:{title:'Vất vả, khó nhọc',readingTheme:'phuc',contentType:'element-gloss',sourceConditions:['Toàn Thư84 tại Phúc Đức: Thất Sát cùng Liêm Trinh, câu riêng “cùng Liêm Trinh tân khổ”.','Câu riêng không nêu chi/giới/tuổi/trạng thái; không chuyển điều kiện nữ Sát đơn thủ sang cặp.','Cùng đoạn có nhánh Sát hãm thêm Dương Đà/Linh Hỏa; chưa dùng bảng nguồn khác hoặc câu vô hãm ở39 để xóa ngoại lệ.'],
 projectScope:[VTTL_PHUC_LIEM_SAT_METHOD,'Phê duyệt riêng nhánh sau414be37, không mở Toàn Thư khác hoặc N11–N12.','Tập con dự án: Liêm–Sát bản mệnh đồng cung Phúc Sửu/Mùi, vắng TT trực tiếp, vắng Kình/Đà/Hỏa/Linh tại bản phương/tam hợp/xung. Không gán các cổng này thành nguyên văn sách.','Profilev2/receipt;12cung/14chính tinh và phụ tinh/sao bổ sung liên quan đủ chứng nhận, scope origin, tên chuẩn/không trùng. Không theo ID mẫu.'],
 knownExceptions:['TT trực tiếp hoặc Kình/Đà/Hỏa/Linh tại bản phương/tam hợp/xung giữ unknown: chưa phối điều chỉnh đúng vế.','Vị trí0/4/6/8 là tập con dự án theo hình học17–18, không định nghĩa chữ thêm chung cho mọi câu; không tuyên bố sao ngoài tập này vô ảnh hưởng.'],unknownConditions:['Thiếu/bất nhất dữ liệu hoặc có điều chỉnh trực tiếp chưa giải: unknown, không suy vắng TT/sát hoặc kết quả ngược.'],readerLimit:'Không suy sức khỏe, tuổi thọ, nghèo khó, đạo đức hoặc hoàn cảnh họ hàng; chưa xác nhận hoàn cảnh hay diễn biến thực tế.',applicability:'Rule chung cho mọi hồ sơ đủ điều kiện đã duyệt, không theo ID/tên/ngày sinh.',sourceScope:'Nguồn riêng Toàn Thư84; không sửa hoặc chọn nguồn thắng Tân Biên, không tổng hợp toàn Phúc.'}
});
