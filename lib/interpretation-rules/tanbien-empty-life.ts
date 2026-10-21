import { ruleSchema } from './schema';
export const emptyLifeRule = ruleSchema.parse({
 id:'tanbien.life-empty-mui-sun-moon-opposite',version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',
 requiredEngineProfile:['tanbien-vn-trial-v2'],
 requiredFacts:['fact.life-complete-major-count','fact.life-branch','fact.life-opposite-branch','fact.life-opposite-majors','fact.life-opposite-major-count','fact.life-opposite-sun-moon-light','fact.source-position-available'],
 conditions:[
  {fact:'fact.life-complete-major-count',op:'eq',value:'0'},
  {fact:'fact.life-branch',op:'eq',value:'Mùi'},
  {fact:'fact.life-opposite-branch',op:'eq',value:'Sửu'},
  {fact:'fact.life-opposite-majors',op:'includes',value:'Thái Dương'},
  {fact:'fact.life-opposite-majors',op:'includes',value:'Thái Âm'},
  {fact:'fact.life-opposite-major-count',op:'eq',value:'2'},
  {fact:'fact.life-opposite-sun-moon-light',op:'eq',value:'bright'},
 ],exceptions:[],
 claimTemplate:'Mệnh tại Mùi không có chính tinh; Thái Dương và Thái Âm cùng ở Sửu, chiếu sang từ cung đối diện. Tân Biên nêu riêng thế Nhật–Nguyệt này trong phần luận Mệnh và mô tả theo hướng phúc, sự sung túc. Đây là chú giải về thế chiếu trong tài liệu, không phải kết luận bạn sẽ giàu có hoặc sống lâu. Hai sao vẫn thuộc đối cung; lời luận sao tọa Mệnh không được chép sang đây. Các điều chỉnh về sao phụ, sát tinh và Tuần/Triệt chưa được phối hợp thành kết luận cho toàn bộ trường hợp này.',
 evidencePaths:['chart.palaces','chart.tanBien.completeness'],
 sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:'Trang PDF/ebook 31–32 §1.6; 53–54 §4.1.3; 70–72 §4.2.5 Phú giải, đoạn “Nhật, Nguyệt thủ Mệnh, bất như chiếu hợp tinh minh”; bảng 35 §3.5 và 36 §3.8.',accessedOn:'2026-10-12',rights:'pending',rightsNote:'Đọc trực tiếp PDF chủ dự án cung cấp và ảnh trang 31,32,53,71. Số trang in trong ebook trùng PDF; chưa xác minh bản in gốc hoặc quyền tái sử dụng. Chỉ diễn giải ngắn trong dự thảo nội bộ.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Chỉ là chú giải nhánh Nhật–Nguyệt xung chiếu Mệnh; chưa xét phối hợp sao phụ, sát tinh, Tuần/Triệt để kết luận cá nhân. Không suy trí thông minh, tài sản hoặc tuổi thọ.'],
 presentation:{title:'Mệnh trống tại Mùi — Nhật–Nguyệt xung chiếu từ Sửu',contentType:'context',readingTheme:'action',
 readerLimit:'Chưa có quy tắc phối hợp các điều chỉnh; mô tả thuận lợi của thế chiếu trong sách không phải kết luận tốt/xấu toàn cung.',
 sourceConditions:['§1.6: Mệnh không chính tinh cần xét chính tinh xung chiếu và trung/bàng tinh tọa thủ, hội hợp.','§4.2.5: Mệnh tại Mùi, Nhật–Nguyệt đồng cung Sửu xung chiếu; đoạn dẫn bằng Nhật–Nguyệt miếu/vượng/đắc.'],
 projectScope:['Chỉ profile Tân Biên v2; kiểm tra khai báo đầy đủ, 12 cung và đủ 14 chính tinh bản mệnh duy nhất. Đây là cổng dữ liệu của dự án.','Giới hạn ở Mệnh rỗng tại Mùi, đúng hai chính tinh đối cung Sửu; không mở rộng sang mọi cung trống hoặc sao hợp chiếu khác.','Giữ mức B — chú giải nguồn, không thực thi kết luận phúc thọ/tài sản hoặc nhánh tăng cường Tuần/Triệt.'],
 applicability:'Đúng vị trí, danh sách đầy đủ, bản mệnh và bảng trạng thái Tân Biên; không dùng originalBrightness hoặc sao lưu.',
 knownExceptions:['Trang 53 nêu Tuần/Triệt, Thiên/Địa Không và nhiều sao hội chiếu; trang 71–72 nêu điều chỉnh Nhật–Nguyệt. Chưa có quy tắc phối hợp để xác nhận cứu giải hay nâng mức nhận định.'],
 unknownConditions:['Chưa chốt ngưỡng “nhiều”, phạm vi hội hợp/án ngữ và cách phối hợp sao phụ với thế xung chiếu này.'],
 sourceScope:'Mệnh và chính tinh xung chiếu; không mượn lời luận Thiên Di, Công việc hay Tài chính.'}
});

/** Explicit compatible position clause, PDF71. Source interpretation remains draft. */
export const emptyLifeTrineRules = [
 {id:'mui',branch:'Mùi',sun:'Mão',moon:'Hợi',meaning:'Trong phần phú giải, Tân Biên liên hệ riêng thế chiếu này với học hành và thi cử, dùng hình ảnh “bẻ cành quế”. Đoạn về Nhật–Nguyệt chiếu Mệnh trống cũng nói đến việc học hỏi và suy xét. Đây là chú giải truyền thống về thế chiếu, không xác nhận trí thông minh, bằng cấp hay kết quả thi của người đọc.'},
].map(x=>ruleSchema.parse({
 id:`tanbien.life-empty-${x.id}-sun-moon-trine`,version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],
 requiredFacts:['fact.life-complete-major-count','fact.life-branch','fact.empty-life-sun-branch','fact.empty-life-moon-branch','fact.empty-life-sun-light','fact.empty-life-moon-light','fact.source-position-available'],
 conditions:[{fact:'fact.life-complete-major-count',op:'eq',value:'0'},{fact:'fact.life-branch',op:'eq',value:x.branch},{fact:'fact.empty-life-sun-branch',op:'eq',value:x.sun},{fact:'fact.empty-life-moon-branch',op:'eq',value:x.moon},{fact:'fact.empty-life-sun-light',op:'eq',value:'bright'},{fact:'fact.empty-life-moon-light',op:'eq',value:'bright'}],exceptions:[],
 claimTemplate:`Mệnh tại ${x.branch} không có chính tinh tọa thủ. Thái Dương ở ${x.sun}, Thái Âm ở ${x.moon}: hai sao nằm ở hai cung tam hợp chiếu về Mệnh, không phải sao tọa Mệnh và không phải cùng ở đối cung. ${x.meaning}`,
 evidencePaths:['chart.palaces','chart.tanBien.completeness'],sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',location:`PDF/ebook 71 §4.2.5 Phú giải, câu riêng Mệnh ${x.branch} — Nhật ${x.sun}, Nguyệt ${x.moon}; định nghĩa 31–33; bảng trạng thái 35 §3.5,36 §3.8; ngữ cảnh 53–54,70–72.`,url:'/internal/editorial/demo-wuqu-tianfu#source-list',accessedOn:'2026-10-12',rights:'pending',rightsNote:'Đã đọc ảnh PDF chủ dự án cung cấp. Đối chiếu văn bản, chưa phê duyệt chuyên môn; chỉ dùng trong bản dự thảo nội bộ.'}],
 conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,
 limitations:['Chú giải thế chiếu cụ thể; chưa phối hợp sao phụ, Tuần/Triệt hoặc các yếu tố khác để luận toàn cung.'],
 presentation:{title:`Mệnh trống tại ${x.branch} — Nhật ${x.sun}, Nguyệt ${x.moon} hợp chiếu`,contentType:'context',readingTheme:'action',
 readerLimit:'Chú giải này chưa tổng hợp sao phụ và tác động Tuần/Triệt. Không từ thế chiếu riêng suy thành kết luận thuận lợi cho toàn bộ lá số.',
 sourceConditions:[`Mệnh ${x.branch}; Nhật ${x.sun}, Nguyệt ${x.moon} hợp chiếu — hai vị trí được câu nguồn nêu trực tiếp.`,`Đoạn “Nhật Nguyệt nhi chiếu hư không” yêu cầu Mệnh không chính tinh và Nhật–Nguyệt sáng; bảng 35/36 dùng Miếu/Vượng/Đắc.`],
 projectScope:['Giới hạn profile Tân Biên v2; danh sách đầy đủ, đủ 12 cung và 14 chính tinh bản mệnh duy nhất hợp lệ.','Hai sao vẫn ở cung gốc. Không chạy rule sao tọa Mệnh trên cung giả lập. Phương pháp empty-life-trine-1.0.0; bảng Tân Biên taiyang/taiyin 1.0.0.'],
 applicability:'Chú giải cục bộ theo vị trí và trạng thái nguồn, không phải luận tổng hợp.',knownExceptions:['TB71 nêu thêm Tuần/Triệt án ngữ như nhánh tăng cường riêng; chưa thực thi nhánh này. Đoạn riêng không nêu ngoại lệ loại trừ, không đồng nghĩa không có điều chỉnh khác trong toàn sách.'],unknownConditions:['Chưa chốt toán tử nhóm Tuần/Triệt và cách phối hợp sao phụ thành mức tăng/giảm. Không thực thi “hoàn mỹ” hoặc cứu giải.'],sourceScope:'Mệnh không chính tinh nhận hai sao tam hợp chiếu; không mượn lời luận resident hoặc các cung khác.'}
}));
