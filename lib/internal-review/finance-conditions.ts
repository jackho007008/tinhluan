import type { ChartSnapshot, Star } from '../tuvi-engine';
import { uniquePalace, palaceLocation, palaceStars, bodyLocation } from './tanbien-presentation';
import type { Claim } from '../interpretation-rules/execute';
export const FINANCE_ASSESSMENT_VERSION='1.1.0';
const fields=['majorStars','minorStars','adjectiveStars'] as const;
const origin=(st:Star)=>!(st as {scope?:string}).scope || (st as {scope?:string}).scope==='origin';
/** Frozen evidence only. Does not infer any cross-palace interpretation. */
export function financeConditions(s:ChartSnapshot, claims:Claim[], verified:boolean){
 const q=uniquePalace(s,'Tài Bạch');
 const related=['Mệnh','Phúc Đức','Quan Lộc','Thiên Di'].flatMap(n=>[palaceLocation(s,n),palaceStars(s,n)]);
 related.push(bodyLocation(s));
 const body=s.chart.palaces.filter(p=>p.isBodyPalace);if(body.length===1)related.push(palaceStars(s,body[0].name));
 const rows:{title:string;text:string;state:'checked'|'not-applicable'|'unresolved';source:string;paths:string[]}[]=[];
 const source=(page:string)=>`Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, trang sách/PDF ${page}.`;
 const full=!!q && verified && fields.every(f=>Array.isArray(q.p[f]) && q.p[f].every(st=>st && typeof st.name==='string' && !!st.name.trim()));
 const names=q?fields.flatMap(f=>(Array.isArray(q.p[f])?q.p[f]:[]).filter(origin).map(st=>st.name)):[];
 const base=q?`chart.palaces.${q.i}`:'chart.palaces';
 const add=(title:string,text:string,state:'checked'|'not-applicable'|'unresolved',page:string,paths=[base])=>rows.push({title,text,state,source:source(page),paths});
 add('Phạm vi toàn cung','Đã lấy dữ kiện Mệnh, Thân, Phúc Đức, Quan Lộc và Thiên Di để đối chiếu. Nguồn yêu cầu luận các cung này trước, nhưng chưa cho phép dự án tự đặt trọng số hoặc cộng/trừ để kết luận tài sản.','unresolved','190 mở đầu',related.flatMap(x=>x.paths));
 if(!q || !full)add('Danh sách sao','Chưa xác nhận danh sách sao bản mệnh đầy đủ tại Tài Bạch; không suy vắng sao hoặc vô chính diệu.','unresolved','33 §2.7;190');
 const majors=q&&Array.isArray(q.p.majorStars)?q.p.majorStars.filter(origin).map(st=>st.name):null;
 if(full&&majors?.length===0)add('Không có chính tinh','Danh sách chính tinh đầy đủ và rỗng. §12.56 yêu cầu xét chính tinh xung chiếu và các ngoại lệ; chưa chuyển sao đối cung thành sao tọa thủ hoặc mượn lời luận của chúng.','unresolved','197 §12.56',[base+'.majorStars']);
 if(names.includes('Thiên Không'))add('Thiên Không và Địa Kiếp', names.includes('Địa Kiếp')?'Đã có Thiên Không và Địa Kiếp ở cùng Tài Bạch. Nhánh §12.55 được trình bày như chú giải cục bộ khi đủ dữ kiện bản mệnh; chưa kết luận hoàn cảnh tài chính toàn cung.':full?'Có Thiên Không nhưng danh sách bản mệnh không có Địa Kiếp đồng cung Tài Bạch. Vì thiếu sao thứ hai, không áp tổ hợp §12.55; không lấy tên Kiếp Sát hoặc sao ở cung khác thay Địa Kiếp.':'Có Thiên Không; chưa xác nhận đầy đủ danh sách để loại trừ tổ hợp với Địa Kiếp.',names.includes('Địa Kiếp')?'unresolved':full?'not-applicable':'unresolved','197 §12.55;40 §3.21–3.22',fields.map(f=>base+'.'+f));
 const hao=q?[(q.p as typeof q.p & {boshi12?:string}).boshi12,...names].filter(n=>['Đại Hao','Tiểu Hao'].includes(n||'')):[];
 if(hao.length)add('Phạm vi Song Hao',`Tài Bạch ghi ${[...new Set(hao)].join(', ')}. Không lấy một sao Hao làm đủ điều kiện “Song Hao”, cũng không tự đặt phạm vi hội hợp cho §12.27 và §12.45–12.47. Chưa xuất lời kết luận về thói quen chi tiêu hay mất tiền từ các đoạn này.`,'unresolved','195 §12.27;196 §12.45–12.47',[base+'.boshi12',...fields.map(f=>base+'.'+f)]);
 const danger=names.filter(n=>['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp'].includes(n));
 if(danger.length)add('Điều chỉnh theo trạng thái',`Ghi nhận tại Tài Bạch: ${danger.join(', ')}. §12.15–12.17 dùng sáng/tối; chưa xác định cách phối hợp bản tính, vị trí và nhiều sao trái chiều để chọn một kết luận. Không mượn quy tắc Công việc.`, 'unresolved','194 (Kình–Đà bị đánh số 12.14 lần hai), §12.16–12.17');
 const ranges=s.chart.tanBien?.voidRanges;
 add('Tuần/Triệt',Array.isArray(ranges)&&ranges.length===2&&q ? ranges.map(r=>`${r.name} tại ${r.branches.join('–')}; Tài Bạch ${r.branches.includes(q.p.earthlyBranch)?'thuộc':'không thuộc'} cặp này`).join('. ')+'. Vị trí không tự xác định nghĩa án ngữ và lượng từ “nhiều sao” của §12.34.':'Chưa có đủ hai cặp Tuần/Triệt đã lưu; không suy phạm vi từ tên sao đơn lẻ.','unresolved','195–196 §12.34',['chart.tanBien.voidRanges',base+'.earthlyBranch']);
 const adjusted=claims.some(c=>c.rules.some(r=>r.id==='tanbien.finance-nhat-nguyet-ky'));
 if(majors?.includes('Thái Dương')&&majors.includes('Thái Âm'))add('Điều chỉnh Hóa Kỵ trong nhánh Nhật–Nguyệt',adjusted?'Đã thỏa Nhật–Nguyệt và Hóa Kỵ bản mệnh đồng cung; đã đưa ý điều chỉnh cục bộ vào bài. Không kết hợp với vế Tuần/Triệt hoặc tăng độ mạnh bằng cộng nhận định.':'Chưa có đủ điều kiện Hóa Kỵ bản mệnh đồng cung được xác nhận; không thêm điều chỉnh này. Vế Tuần/Triệt án ngữ giữ riêng, chưa triển khai.',adjusted?'checked':'unresolved','191 §12.5;195 §12.23',[base+'.majorStars',base+'.minorStars']);
 return {version:FINANCE_ASSESSMENT_VERSION,mainNote:adjusted?'Đã xét riêng điều chỉnh Hóa Kỵ trong nhánh Nhật–Nguyệt; vẫn chưa kết luận tổng hợp toàn cung.':'Chưa có điều chỉnh nào được áp để thay đổi nhánh nền của hồ sơ này. Những yếu tố có mặt và giới hạn được giữ trong căn cứ.',facts:q?[palaceLocation(s,'Tài Bạch'),palaceStars(s,'Tài Bạch')]:[],related,rows,claimIds:claims.map(c=>c.id),source:source('190 mở đầu;194–197')};
}
