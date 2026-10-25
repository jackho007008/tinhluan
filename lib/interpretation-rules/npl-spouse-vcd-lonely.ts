import type {ChartSnapshot} from '../tuvi-engine';
import type {DerivedFact} from './derived';
import {principalIntegrity} from '../tuvi-engine/chart-integrity';
import {verifiedNatalTransformations} from '../tuvi-engine/natal-transformations';
import {voidMembership} from '../internal-review/career-definitions';
import {ruleSchema,readPath} from './schema';
export const NPL_PHU326='npl.spouse-vcd-lonely-single';
export const NPL_PHU326_FACT='fact.spouse-npl-vcd-lonely-single';
export const NPL_PHU326_METHOD='npl-spouse-vcd-loneliness-1.0.0';
export const NPL_PHU326_COPY='Cấu trúc này được sách liên hệ với sự cô đơn trong quan hệ vợ chồng, kể cả khi vẫn chung sống. Riêng nhận định này chưa đủ để kết luận chia ly. Đoạn này không xác nhận tình trạng hôn nhân thực tế của bạn.';
export const NPL_PHU326_SET=['Cô Thần','Quả Tú','Đẩu Quân'] as const;
// Approved project hold-set. Not a universal source definition of separation or an ANY operator for other clauses.
export const NPL_PHU326_HOLD=['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Thiên Không','Âm Sát','Hóa Kỵ','Thiên Hình','Quan Phù','Quan Phủ','Thái Tuế','Thiên Mã','Đại Hao','Tiểu Hao','Tang Môn','Bạch Hổ','Thiên Khốc','Thiên Hư','Phục Binh'] as const;
export function nplPhu326Assessment(s:ChartSnapshot):{value?:'yes'|'no';reason:string;paths:string[];cause?:'missing-data'|'unresolved-adjustment'}{
 const paths=['chart.palaces','chart.tanBien.completeness.majorStars'];
 const result=(value:'yes'|'no'|undefined,reason:string,cause?:'missing-data'|'unresolved-adjustment')=>({value,reason,paths,cause:cause??(value===undefined?'missing-data' as const:undefined)});
 if(s.profile.id!=='tanbien-vn-trial-v2')return result(undefined,'Ngoài profile dữ kiện bản mệnh đã xác minh.');
 if(s.chart.tanBien?.completeness?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return result(undefined,'Thiếu chứng nhận hoặc dữ kiện 12 cung/14 chính tinh gốc không toàn vẹn.');
 const found=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Phu Thê');if(found.length!==1)return result(undefined,'Chưa xác định duy nhất cung Phu Thê bản mệnh.');
 const {p,i}=found[0];paths.push(`chart.palaces.${i}.name`,`chart.palaces.${i}.earthlyBranch`,`chart.palaces.${i}.majorStars`);
 if(p.majorStars.length)return result('no','Phu có chính tinh ngoài tập con VCD đã duyệt; không định nghĩa đơn thủ phụ tinh của NPL thành VCD hoặc suy kết quả ngược.');
 const fields=['minorStars','adjectiveStars'] as const,c=s.chart.tanBien.completeness;
 paths.push('chart.tanBien.completeness.minorStars','chart.tanBien.completeness.adjectiveStars',...fields.map(k=>`chart.palaces.${i}.${k}`));
 if(fields.some(k=>c[k]!=='complete-with-declared-supplements'||!Array.isArray(p[k])||p[k].some(st=>!st||typeof st.name!=='string'||!st.name.trim()||(st as {scope?:string}).scope!=='origin')))return result(undefined,'Thiếu hoặc bất nhất danh sách phụ tinh/sao bổ sung bản mệnh tại Phu; không suy vắng sao hoặc đủ bộ.');
 const stars=fields.flatMap(k=>p[k]);if(new Set(stars.map(st=>st.name)).size!==stars.length)return result(undefined,'Danh sách sao tại Phu trùng, chưa xác định số phần tử bộ nguồn hoặc vắng tập giữ.');
 const members=NPL_PHU326_SET.filter(n=>stars.some(st=>st.name===n));if(members.length!==1)return result('no','Có '+members.length+' sao thuộc bộ Cô/Quả/Đẩu trực tiếp Phu; ngoài tập con đúng một đã duyệt, không suy kết quả ngược hoặc lấy sao chiếu thay tọa thủ.');
 paths.push('chart.tanBien.voidRanges');const ranges=s.chart.tanBien.voidRanges;
 if(!Array.isArray(ranges)||ranges.length!==2||ranges.some(v=>!v)||!['Tuần Không','Triệt Lộ'].every(n=>ranges.some(v=>v.name===n))||ranges.some(v=>voidMembership(p.earthlyBranch,v.branches)===undefined))return result(undefined,'Thiếu hoặc bất nhất hai cặp Tuần/Triệt; không suy vắng TT trực tiếp Phu.');
 const active=ranges.filter(v=>voidMembership(p.earthlyBranch,v.branches));if(active.length)return result(undefined,active.map(v=>v.name).join(' và ')+' trực tiếp Phu: giữ unknown, chưa áp nhánh NPL326; không đảo hoặc tự hủy khi cả hai.','unresolved-adjustment');
 paths.push('chart.natalTransformations');const trans=verifiedNatalTransformations(s.chart);if(!trans)return result(undefined,'Chưa có chứng nhận Tứ Hóa bản mệnh hợp lệ; không suy vắng Hóa Kỵ hoặc tính lại Hóa.');
 paths.push(...trans.entries.filter(t=>t.kind==='Kỵ').map(t=>t.path));
 const held:string[]=NPL_PHU326_HOLD.filter(n=>stars.some(st=>st.name===n));if(trans.entries.some(t=>t.kind==='Kỵ'&&t.palace==='Phu Thê'))held.push('Hóa Kỵ');
 if(held.length)return result(undefined,'Có '+[...new Set(held)].join(', ')+' trực tiếp Phu thuộc tập sao giữ unknown của dự án. Chưa giải điều chỉnh đúng vế; không dùng unknown để luận chia ly hoặc xóa lời khác.','unresolved-adjustment');
 return result('yes',`${members[0]} bản mệnh trực tiếp Phu ${p.earthlyBranch}, đúng một trong bộ nguồn NPL326. Phu VCD, vắng TT/tập giữ đã kiểm, Tứ Hóa được chứng nhận. VCD/singleton/vắng TT/tập giữ là tập con dự án, không định nghĩa đơn thủ NPL hoặc loại mọi bất lợi. Không mượn chính tinh Quan, không suy chia ly.`);
}
export function nplPhu326Facts(s:ChartSnapshot):DerivedFact[]{
 const a=nplPhu326Assessment(s),common={derivationId:NPL_PHU326_METHOD,version:'1.0.0',text:a.reason,evidencePaths:a.paths.filter(p=>readPath(s,p)!==undefined),status:'source-table' as const,limitation:'Chỉ nhận định cô đơn của NPL326 trong tập con đã duyệt; không kết luận ly hôn/góa/ngoại tình/phẩm hạnh/số lần hôn nhân hoặc phủ định căn cứ khác.'};
 return [{...common,id:NPL_PHU326_FACT+'-status',value:a.value??'unknown'},...(a.value?[{...common,id:NPL_PHU326_FACT,value:a.value}]:[])];
}
export const nplPhu326Rule=ruleSchema.parse({
 id:NPL_PHU326,version:'1.0.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:[NPL_PHU326_FACT],conditions:[{fact:NPL_PHU326_FACT,op:'eq',value:'yes'}],exceptions:[],claimTemplate:NPL_PHU326_COPY,evidencePaths:['chart.palaces','chart.tanBien.completeness','chart.tanBien.voidRanges','chart.natalTransformations'],
 sourceReferences:[{id:'npl-phu326',title:'Nguyễn Phát Lộc — Tử Vi Tổng Hợp',url:'/internal/editorial/npl-phu326#loneliness',location:'PDF/header326 Cô, Quả, Đẩu quân ở Phu thê; ngữ cảnh322–325 phân chia ly và các dấu liên quan; bản442trang.',accessedOn:'2026-10-25',rights:'pending',rightsNote:'Đúng nhánh/văn được chủ dự án duyệt sau5c5d3ec; không mở nhánh khác, mọi Phu hoặc quyền thương mại. SHA25682f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:['Không sửa TB215 Cô–Quả hoặc chọn NPL thắng. Không kết luận toàn Phu/liên cung hoặc tình trạng hôn nhân thực tế.'],
 presentation:{title:'Cô đơn trong quan hệ vợ chồng',readingTheme:'spouse',contentType:'element-gloss',sourceConditions:['NPL326 nói riêng một trong ba Cô/Quả/Đẩu ở Phu chưa đủ minh chứng ly cách; riêng Cô hay Quả hay Đẩu liên hệ với cô đơn/cô độc, kể cả vẫn chung sống.','OR chỉ có căn cứ cho đúng câu326; không áp mọi nhóm sao/TB215 hoặc biến chưa đủ minh chứng thành bảo đảm không chia ly.','Các ví dụ hình thái không được biến thành dự báo ngoại tình/phẩm hạnh, tử biệt hoặc xa để làm ăn.'],
 projectScope:[NPL_PHU326_METHOD,'Phê duyệt riêng sau5c5d3ec; không mở toàn NPL/Phu hoặc N8 khác.','Tập con dự án: Phu VCD, đúng một thành viên bộ nguồn trực tiếp, vắng TT; VCD không định nghĩa đơn thủ phụ tinh NPL, không mượn sao chiếu/đối cung.','Profilev2/receipt,12cung/14chính tinh đầy đủ, minor/adjective đủ chứng nhận và scopeorigin/không trùng; dùng verifiedNatalTransformations hiện có, không tính lại Hóa.','Tập giữ unknown dự án: '+NPL_PHU326_HOLD.join(', ')+'. Không gọi đây là danh sách ly hôn toàn diện của sách hoặc vắng tập là hết bất lợi.'],
 knownExceptions:['TT trực tiếp, sao trong tập giữ hoặc Kỵ được chứng nhận tại Phu giữ unknown/unresolved-adjustment; không bỏ sao để tăng độ phủ.','Thiếu/bất nhất dữ liệu/chứng nhận Hóa giữ unknown; 0/2/3thành viên hoặc có chính tinh ngoài tập con, không suy kết quả ngược.'],unknownConditions:['Nếu phát hiện điều chỉnh trực tiếp mới đúng vế chưa giải, giữ unknown; không yêu cầu giải toàn lá số khi không có điều chỉnh trực tiếp.'],readerLimit:'Chỉ cô đơn trong quan hệ vợ chồng; không xác nhận hôn nhân, ly hôn, góa, ngoại tình, phẩm hạnh hoặc số lần hôn nhân. Không xóa căn cứ khác.',applicability:'Dùng điều kiện chung cho mọi hồ sơ đủ tập con, không theo ID/tên/ngày sinh.',sourceScope:'Nguồn riêng NPL326 và giới hạn322–325; ownerPhu/G2, không thay lời cung Quan hoặc suy miễn phí Mệnh.'}
});
