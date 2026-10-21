// Method-specific inventory, not accuracy or independent engine validation.
import {writeFileSync,readFileSync} from 'node:fs';
import {catalog,RULESET_VERSION} from '../lib/interpretation-rules/catalog';
import {executeRules} from '../lib/interpretation-rules/execute';
import {samples,loadSample} from '../lib/internal-review/samples';
import {tanBienLifeTables,tanBienTable} from '../lib/interpretation-rules/tanbien-source';
const targets=[['Tử Vi','r08','ziwei'],['Liêm Trinh','r10','lianzhen'],['Thiên Đồng','r15','tiantong'],['Vũ Khúc','r01','wuqu'],['Thái Dương','r14','taiyang'],['Thiên Cơ','r13','tianji'],['Thiên Phủ','r03',''],['Thái Âm','r16','taiyin'],['Tham Lang','r11','tanlang'],['Cự Môn','r12','jumen'],['Thiên Tướng','r09','tianxiang'],['Thiên Lương','r17','tianliang'],['Thất Sát','r18','qisha'],['Phá Quân','r19','pojun']];
const engine=[];
for(const sample of samples.filter(s=>s.kind==='engine')) {
 const s=(await loadSample(sample.id))!.report.snapshot;
 engine.push({id:sample.id,stars:s.chart.palaces.find(p=>p.name==='Mệnh')!.majorStars.map(s=>s.name),traces:executeRules(s,catalog.filter(r=>r.id.startsWith('tanbien.')),'internal-draft').traces});
}
const esc=(s:string)=>s.replace(/\|/g,'/').replace(/\n/g,' ');
const md=[`## Phạm vi Tân Biên tại Mệnh — ${RULESET_VERSION}, template 1.6.0, 09/10/2026\n`,
'Tất cả 14 sao có dữ kiện an sao trong engine; bảng này chỉ kiểm kê nội dung Tân Biên. Đã nghiên cứu nguồn không đồng nghĩa đã đặc tả mọi điều kiện; có chú giải nền không đồng nghĩa đã luận toàn lá số. Không có nội dung nào được chuyên gia phê duyệt. Mẫu engine là đầu vào giả lập, không phải đối chiếu độc lập.\n',
'Lượt Cơ–Cự đọc trực tiếp tr.73–76, 85–91 và ảnh88–89; các trang38–39,92–101 giữ biên bản đợt1.5.0. Mức đọc của 11 sao trước kế thừa hồ sơ các đợt trước, không tuyên bố đọc lại toàn bộ sách trong lượt này. Quyền nguồn vẫn pending. Catalog Toàn Thư/Cổ Học được giữ riêng; không tính chúng như Tân Biên.\n',
'| Sao | Nghiên cứu / rule triển khai | Loại nội dung | Vị trí/trạng thái hỗ trợ | Chưa hỗ trợ | Điều kiện/ngoại lệ còn thiếu | Mẫu có sao / mẫu khớp rule nền | Duyệt |',
'|---|---|---|---|---|---|---|---|'];
for(const [star,id,key] of targets){
 const r=catalog.find(r=>r.id===`tanbien.${id}`)!;
 const table=key==='wuqu'?{states:tanBienTable.states,eligible:['Miếu','Vượng','Đắc']}:key?tanBienLifeTables[key as keyof typeof tanBienLifeTables]:null;
 const supported=table?Object.entries(table.states).filter(([,s])=>table.eligible.includes(s)).map(([b,s])=>`${b} (${s})`).join(', '):'Không dùng điều kiện trạng thái cho đoạn nền R03';
 const unsupported=table?Object.entries(table.states).filter(([,s])=>!table.eligible.includes(s)).map(([b,s])=>`${b} (${s})`).join(', '):'Chưa có các nhánh điều chỉnh theo vị trí/trạng thái';
 const present=engine.filter(e=>e.stars.includes(star));
 const matched=present.filter(e=>e.traces.some(t=>t.ruleId===r.id&&t.status==='matched')).map(e=>e.id);
 md.push(`| ${star} | Đã đọc theo hồ sơ; triển khai một phần: ${r.id}@${r.version}${id==='r01'?'; R02 đồng cung Văn Khúc':['r12','r13'].includes(id)?'; R20 Cơ–Cự–Lộc Tồn Mệnh Mão/Dậu (không thêm điều kiện trạng thái; PDF89)':''}. ${esc(r.sourceReferences[0].location)} | Chú giải nền có điều kiện${id==='r01'?'; R02 nhận định theo đồng cung':''}; không phải luận tổ hợp toàn diện | ${supported}${id==='r19'?'; thêm phạm vi dự án: đúng một chính tinh tại Mệnh':''} | ${unsupported}${id==='r19'?'; mọi trường hợp đồng cung chính tinh khác':''}; thiếu bảng/địa chi/danh sách giữ unknown | ${esc(r.presentation?.unknownConditions?.join(' ')||r.limitations.join(' '))} | Có sao: ${present.map(e=>e.id).join(', ')||'chưa có'}; **khớp: ${matched.join(', ')||'chưa có'}** | Chưa; draft, review=null |`);
}
md.push('| Mệnh không chính tinh (hàng riêng, không phải sao thứ 15) | Chưa triển khai rule Tân Biên; chú giải phương pháp ở nguồn khác giữ riêng | Có thể trình bày danh sách rỗng hợp lệ; không phải nhận định mệnh | Danh sách chính tinh rỗng đã lưu, phân biệt dữ liệu thiếu | Chưa luận mượn sao đối cung | Cần nguồn Tân Biên và đặc tả quan hệ, phạm vi áp dụng | '+engine.filter(e=>!e.stars.length).map(e=>e.id).join(', ')+' (dữ kiện, không tính khớp Tân Biên) | Chưa |');
md.push('\nR04 Hóa Quyền là chú giải biểu tượng thu hẹp ở Vũ Khúc tại Mệnh; R05 ở Quan Lộc; R06/R07 ở Tài Bạch. Không tính chúng thành chính tinh hoặc thành độ phủ tổ hợp tại Mệnh. R19 chỉ có đoạn nền; điều kiện một chính tinh là giới hạn triển khai của dự án. Không thay cổng tổ hợp Tử Vi–phụ tá cũ.\n',
'R20@0.1.0: nhánh ba sao Cơ–Cự–Lộc Tồn cùng Mệnh Mão/Dậu; không đại diện mọi tổ hợp Cơ–Cự. Mẫu vn-co-cu-loc khớp; vn-jumen không khớp vì không ghi Lộc Tồn ở Mệnh. Chú giải nền và nhận định phối hợp giữ riêng.\n',
'### Tối đa ba ưu tiên nội dung tiếp theo\n',
'1. Đặc tả các nhánh/điều chỉnh thực sự làm thay đổi cách đọc: Cự Môn vượng, ngày/đêm của Nhật–Nguyệt và các can sinh; cần nguồn và quyết định phương pháp trước khi lập trình.\n',
'2. Nghiên cứu tổ hợp đang xuất hiện trong mẫu (Tử Vi–Phá Quân, Cơ–Cự, Cơ–Âm, Nhật–Lương): điều kiện đồng cung/hội hợp phải được xác định, không cộng nghĩa sao riêng.\n',
'3. Làm rõ thuật ngữ Tuần/Triệt/Không và phạm vi hội hợp theo cùng nguồn, sau đó kiểm duyệt điều kiện, văn biên soạn và quyền nội dung. Chưa triển khai các việc này trong đợt hiện tại.\n');
const path='docs/RULE-SOURCES.md',marker='<!-- MENH-COVERAGE -->';
let old=readFileSync(path,'utf8').split(marker)[0];
old=old.replace('Trạng thái mới nhất: catalog 1.2.0, xem [OVERVIEW-COVERAGE](OVERVIEW-COVERAGE.md).','Trạng thái mới nhất: catalog interpretation-1.11.0 / template 1.6.0. Bảng Tân Biên hiện hành ở cuối tài liệu; [OVERVIEW-COVERAGE](OVERVIEW-COVERAGE.md) lưu phạm vi khảo sát trước.');
writeFileSync(path,old+'\n'+marker+'\n'+md.join('\n'));
console.log('Updated method-specific 14-star inventory plus separate empty-Menh row; no DB writes.');
