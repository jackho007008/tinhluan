import type {ChartSnapshot} from '../tuvi-engine';
import {principalIntegrity} from '../tuvi-engine/chart-integrity';
import {verifiedNatalTransformations} from '../tuvi-engine/natal-transformations';
import type {DerivedFact} from './derived';
import {ruleSchema} from './schema';
export const NPL_LOCAL_METHOD='npl-local-adjustments-1.0.0';
export const LIEM_TUONG='npl.life-local-liem-tuong';
export const KHOA_KIEP='npl.life-local-khoa-kiep';
export function nplLocalFacts(s:ChartSnapshot):DerivedFact[]{
 const c=s.chart.tanBien?.completeness;
 if(c?.majorStars!=='complete'||!principalIntegrity(s.chart).valid)return [];
 const i=s.chart.palaces.findIndex(p=>p.name==='Mệnh');if(i<0)return [];
 const p=s.chart.palaces[i],base=`chart.palaces.${i}`,result:DerivedFact[]=[];
 const put=(key:string,yes:boolean,detail:string,paths:string[])=>result.push({id:`fact.life-npl-local-${key}`,value:yes?'yes':'no',text:detail,evidencePaths:[base+'.name','chart.tanBien.completeness',...paths],derivationId:NPL_LOCAL_METHOD,version:'1.0.0',status:'engine-reported',limitation:'Chỉ điều kiện vị trí bản mệnh; không thay trạng thái sao hoặc suy kết quả toàn cung.'});
 const names=p.majorStars.map(x=>x.name),pair=names.includes('Liêm Trinh')&&names.includes('Thiên Tướng');
 put('liem-tuong',pair,`Mệnh tại ${p.earthlyBranch}: ${names.join('–')||'không chính tinh'}. ${pair?'Liêm Trinh và Thiên Tướng đồng cung.':'Không có bộ Liêm Trinh–Thiên Tướng đồng cung tại Mệnh.'}`,[base+'.majorStars']);
 const fields=['majorStars','minorStars','adjectiveStars'] as const;
 if(c.minorStars!=='complete-with-declared-supplements'||c.adjectiveStars!=='complete-with-declared-supplements'||!fields.every(f=>Array.isArray(p[f])&&p[f].every(st=>st&&(st as {scope?:string}).scope==='origin')))return result;
 const cert=verifiedNatalTransformations(s.chart);
 if(s.chart.natalTransformations!==undefined&&!cert)return result;
 const all=fields.flatMap(f=>p[f]),positive=all.some(st=>st.mutagen==='Khoa');
 if(!cert&&!positive)return result;
 const khoa=cert?cert.entries.some(e=>e.kind==='Khoa'&&e.path.startsWith(base+'.')):positive;
 const kiep=all.some(st=>st.name==='Địa Kiếp');
 put('khoa-kiep',khoa&&kiep,`Mệnh tại ${p.earthlyBranch}: ${khoa?'có':'không có'} Hóa Khoa bản mệnh; ${kiep?'có':'không có'} Địa Kiếp tọa thủ.`,[...fields.map(f=>base+'.'+f),...(cert?['chart.natalTransformations','chart.tanBien.trace']:[])]);
 return result;
}
const source=(book:'hs'|'th',pages:string,anchor:string)=>({id:`npl-local-${book}-${anchor}`,title:`Nguyễn Phát Lộc — Tử Vi ${book==='hs'?'Hàm Số':'Tổng Hợp'}`,url:`/internal/editorial/npl-local#${anchor}`,location:`PDF và số trang hiển thị ${pages}; bản ${book==='hs'?237:442} trang.`,accessedOn:'2026-10-14',rights:'pending',rightsNote:`Đối chiếu ảnh; chưa phê duyệt chuyên môn. SHA-256 ${book==='hs'?'2a0245dcadaf77f2d8e35c9798893343c3be7117c5cc40a42087153ea5212709':'82f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37'}`});
export const nplLocalRules=[
 {id:LIEM_TUONG,key:'liem-tuong',title:'Liêm Trinh–Thiên Tướng tại Mệnh: tiết chế nét nóng nảy',text:'Liêm Trinh và Thiên Tướng đồng cung tại Mệnh. Theo Nguyễn Phát Lộc, Thiên Tướng tiết chế nét nóng nảy của Liêm Trinh. Chỉ nét này được điều chỉnh; không có nghĩa mọi mặt khó của Liêm Trinh đã được hóa giải hoặc đây là đánh giá tính cách thực tế của người đọc.',sources:[source('hs','49–50;89–90 §4,§6a;131–132 §5–6','hs-090'),source('hs','132 §6a','hs-132')],conditions:['Bộ Liêm Trinh–Thiên Tướng; HS90,132 nêu đích danh tác động tiết chế nét nóng.','HS49–50 xác nhận cùng cung là một quan hệ tạo bộ sao.'],scope:'Chỉ tập con đồng cung Mệnh bản mệnh; không gán điều kiện chỉ đồng cung hoặc địa chi riêng cho tác giả. Điều chỉnh nét nóng của R10 khi cùng khớp; giữ thẳng thắn, can đảm, nghiêm nghị. Nếu không có R10: lời tổ hợp độc lập.',exceptions:'HS131–132 và TH340–342 nêu các điều kiện cứu giải tai họa/công danh khác phương diện, không phải ngoại lệ hủy tiết chế nóng. Không chuyển chúng thành phép cứu giải chung.',theme:'action'},
 {id:KHOA_KIEP,key:'khoa-kiep',title:'Hóa Khoa–Địa Kiếp tại Mệnh: học vấn và thi cử',text:'Hóa Khoa bản mệnh cùng Địa Kiếp tại Mệnh. Nguyễn Phát Lộc mô tả tổ hợp này theo hai khả năng: mức học vấn bị hạn chế, hoặc học vấn cao nhưng thi cử nhiều trắc trở. Đây là cách mô tả của nguồn về học vấn và thi cử, không xác nhận bằng cấp, năng lực học tập hay kết quả thi thực tế; cũng không có nghĩa Khoa đã hóa giải Kiếp.',sources:[source('th','73–75, đặc biệt 74: đồng cung Địa Kiếp','npl-074'),source('hs','166–167: phạm vi khoa bảng, phân biệt với tài năng','hs-167')],conditions:['Hóa Khoa và Địa Kiếp đồng cung; TH74 viết rõ quan hệ đồng cung và hai khả năng.','HS166–167: khoa bảng tại Mệnh; không áp sang cung khác.'],scope:'Lời tổ hợp độc lập tại Mệnh. Không có claim nền Hóa Khoa về học vấn hiện hành để thay/điều chỉnh. Không triển khai cứu bệnh, sinh tử, phẩm hạnh hoặc mọi sát tinh.',exceptions:'Giữ cả hai khả năng nguồn nêu; không tự chọn một. HS167 nói tài năng không mất là khía cạnh khác, không chuyển thành dự đoán năng lực cá nhân.',theme:'learning'},
].map(x=>ruleSchema.parse({id:x.id,version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:[`fact.life-npl-local-${x.key}`],conditions:[{fact:`fact.life-npl-local-${x.key}`,op:'eq',value:'yes'}],exceptions:[],claimTemplate:x.text,evidencePaths:['chart.palaces','chart.tanBien.completeness'],sourceReferences:x.sources,conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:[x.scope,x.exceptions],presentation:{title:x.title,readingTheme:x.theme,contentType:'combination',sourceConditions:x.conditions,projectScope:[NPL_LOCAL_METHOD,x.scope,'Chứng nhận đầy đủ và kiểm tra toàn vẹn là cổng dữ liệu của dự án, không là điều kiện nguyên văn sách.'],readerLimit:'Chú giải truyền thống cục bộ; không phải kết luận toàn cung hoặc xác nhận về người đọc.',knownExceptions:[x.exceptions],unknownConditions:['Danh sách chưa xác minh/không hợp lệ: unknown. Khoa: chứng nhận mâu thuẫn hoặc thiếu bằng chứng: unknown; không suy vắng từ thiếu mutagen.'],applicability:'Chỉ Mệnh bản mệnh, không mượn sao đối cung hoặc sao lưu.',sourceScope:'NPL độc lập; phối hợp với R10 chỉ nét nóng cùng phạm vi đã đối chiếu TB60/HS89. Không thay bảng P1.'}}));
