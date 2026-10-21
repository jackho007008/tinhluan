/** Tân Biên, mục 12 tr.190–197 (PDF = trang in), đọc cả mở đầu và
 * điều chỉnh. A = điều kiện nhánh cục bộ đặc tả được, KHÔNG phải phép
 * tổng hợp toàn cung. Tất cả lời đọc vẫn là chú giải (context) vì tr.190.
 * Không tái sử dụng cách phân nhóm sát tinh Công việc.
 */
export type FinanceBranch = {
  id: string; stars: string[]; branches?: string[]; alone?: boolean;
  pages: string; meaning: string; existing?: string;
};
const single = (id:string, star:string, branches:string, pages:string, meaning:string, existing?:string):FinanceBranch => ({id,stars:[star],branches:branches.split('/'),alone:true,pages,meaning,existing});
const pair = (id:string, a:string,b:string,pages:string,meaning:string,branches?:string,existing?:string):FinanceBranch => ({id,stars:[a,b],pages,meaning,branches:branches?.split('/'),existing});
export const financeBranches:FinanceBranch[] = [
 single('nhat-alone-dan-ngo','Thái Dương','Dần/Mão/Thìn/Tỵ/Ngọ','191 §12.5','việc kiếm tiền dễ dàng. Phạm vi sản phẩm giới hạn ở đơn thủ để không lặp lời của các tổ hợp đã có'),
 single('nhat-alone-than-ty','Thái Dương','Thân/Dậu/Tuất/Hợi/Tý','191 §12.5','việc kiếm tiền vất vả; đoạn nguồn đặt sinh kế trong thời loạn hoặc đường xoay xở quanh co và nói về sự sung túc lúc già. Đây là mô tả định tính trọn đoạn, không xác định tuổi hay khuyên cách kiếm tiền. Phạm vi sản phẩm giới hạn ở đơn thủ'),
 single('tu-ngo','Tử Vi','Ngọ','190 §12.1','khả năng tích lũy trong nhánh nguồn'),
 single('tu-ty','Tử Vi','Tý','190 §12.1','tích lũy, nhưng được sách phân biệt với nhánh Tử Vi ở Ngọ'),
 pair('tu-tuong','Tử Vi','Thiên Tướng','190 §12.1;193 §12.11','tích lũy của cải'),
 pair('tu-phu','Tử Vi','Thiên Phủ','190 §12.1;192 §12.7','tích lũy và trông coi của cải; đoạn gốc có liên hệ chức vụ tài chính, không dùng để tư vấn nghề'),
 pair('tu-sat','Tử Vi','Thất Sát','190 §12.1;193 §12.13','tốc độ tạo nguồn thu nhanh trong mô tả truyền thống'),
 pair('tu-pha','Tử Vi','Phá Quân','190 §12.1;194 §12.14','khởi đầu chật vật rồi việc kiếm tiền dễ hơn trong mô tả của sách; chưa xác định mốc thời gian'),
 pair('tu-tham','Tử Vi','Tham Lang','190 §12.1;192 §12.9','của thừa hưởng đi cùng khả năng suy giảm về sau trong đoạn nguồn; không xác nhận người đọc có thừa kế'),
 single('liem-dan-than','Liêm Trinh','Dần/Thân','190 §12.2','cạnh tranh và tích lũy chậm nhưng chắc','tanbien.r06'),
 pair('liem-phu','Liêm Trinh','Thiên Phủ','190 §12.2;192 §12.7','tích lũy và giữ của',undefined,'tanbien.r42'),
 pair('liem-tuong','Liêm Trinh','Thiên Tướng','190 §12.2;193 §12.11','tích lũy và giữ của',undefined,'tanbien.r43'),
 pair('liem-sat','Liêm Trinh','Thất Sát','190 §12.2;193 §12.13','nguồn thu trong hoàn cảnh biến động, kèm mặt bất lợi về tiền bạc; không tách vế thuận lợi khỏi vế hạn chế'),
 pair('liem-pha','Liêm Trinh','Phá Quân','190 §12.2;194 §12.14','tiền đến rồi đi, chi tiêu hao tán, hết rồi lại có trong mô tả nguồn'),
 pair('liem-tham','Liêm Trinh','Tham Lang','190 §12.2;192 §12.9','khó khăn về tiền cùng tranh chấp mà sách cảnh báo; không quy kết hành vi hoặc dự báo kiện tụng'),
 single('dong-mao','Thiên Đồng','Mão','190 §12.3','tạo dựng từ ít vốn, tích lũy về sau trong mô tả nguồn'),
 single('dong-dau','Thiên Đồng','Dậu','190 §12.3','tiền tụ rồi tán, không ổn định'),
 single('dong-ty-hoi','Thiên Đồng','Tỵ/Hợi','190 §12.3','kiếm tiền nơi xa đi cùng chi tiêu và hao tán; không suy thành lời khuyên di chuyển'),
 single('dong-thin-tuat','Thiên Đồng','Thìn/Tuất','190 §12.3','sự thiếu thốn trong nhánh nguồn, chưa phải đánh giá hoàn cảnh thực tế'),
 pair('dong-nguyet-ty','Thiên Đồng','Thái Âm','190 §12.3','gây dựng từ ít vốn và tích lũy về sau','Tý'),
 pair('dong-nguyet-ngo','Thiên Đồng','Thái Âm','191 §12.3;192 §12.8','vất vả tạo nguồn thu trước khi có tích lũy trong mô tả nguồn','Ngọ'),
 pair('dong-luong','Thiên Đồng','Thiên Lương','191 §12.3;193 §12.12','nguồn thu và việc kinh doanh phát triển theo mô tả nguồn; không khuyến nghị mở kinh doanh'),
 pair('dong-cu','Thiên Đồng','Cự Môn','191 §12.3;192 §12.10','tiền tụ tán thất thường, thiếu thốn và thị phi; sách còn nêu phương xa, nhưng chưa đủ để khuyên di chuyển'),
 single('vu-thin-tuat','Vũ Khúc','Thìn/Tuất','191 §12.4','tích lũy của cải trong nhánh nguồn'),
 pair('vu-phu','Vũ Khúc','Thiên Phủ','191 §12.4;192 §12.7','giữ của bền; đoạn gốc cũng nói việc coi kho/tài chính, không chuyển thành nghề phù hợp'),
 pair('vu-tuong','Vũ Khúc','Thiên Tướng','191 §12.4;193 §12.11','tích lũy đi cùng sự trợ giúp trong mô tả nguồn'),
 pair('vu-sat','Vũ Khúc','Thất Sát','191 §12.4;193 §12.13','gây dựng từ ít vốn, ban đầu vất vả rồi dễ hơn trong mô tả nguồn, chưa xác định thời điểm'),
 pair('vu-pha','Vũ Khúc','Phá Quân','191 §12.4;194 §12.14','tiền vào rồi ra, trước ít sau có; phần gợi nghề trong sách không dùng làm tư vấn nghề nghiệp'),
 pair('nhat-nguyet','Thái Dương','Thái Âm','191 §12.5','tích lũy từ ít đến nhiều; đoạn này có điều chỉnh riêng khi Hóa Kỵ đồng cung hoặc Tuần/Triệt án ngữ'),
 single('co-ty-ngo-mui','Thiên Cơ','Tỵ/Ngọ/Mùi','191 §12.6','nguồn tiền sung túc trong nhánh nguồn'),
 single('co-hoi-ty-suu','Thiên Cơ','Hợi/Tý/Sửu','191 §12.6','kiếm tiền chậm và khó khăn'),
 pair('co-luong','Thiên Cơ','Thiên Lương','191 §12.6;193 §12.12','việc tạo dựng tài chính thuận lợi theo nhánh nguồn'),
 pair('co-cu','Thiên Cơ','Cự Môn','191 §12.6;192–193 §12.10','hoạt động và cạnh tranh để tạo nguồn thu; không suy thành khuyến nghị kinh doanh'),
 pair('co-nguyet-than','Thiên Cơ','Thái Âm','191 §12.6;192 §12.8','gây dựng từ ít vốn, dần có tích lũy theo sách','Thân'),
 pair('co-nguyet-dan','Thiên Cơ','Thái Âm','191 §12.6;192 §12.8','thành bại thất thường, kiếm tiền khó và chậm','Dần'),
 single('phu-ty-hoi','Thiên Phủ','Tỵ/Hợi','191 §12.7','tích lũy và giữ của bền'),
 single('phu-four','Thiên Phủ','Sửu/Mùi/Mão/Dậu','191 §12.7','tích lũy, nhưng nguồn phân biệt mức mô tả với Thiên Phủ ở Tỵ/Hợi'),
 single('nguyet-dau-tuat-hoi','Thái Âm','Dậu/Tuất/Hợi','192 §12.8','việc kiếm tiền dễ dàng trong nhánh nguồn'),
 single('nguyet-mao-thin-ty','Thái Âm','Mão/Thìn/Tỵ','192 §12.8','kiếm tiền vất vả trong hoàn cảnh khó; sách đặt việc có tích lũy về sau, chưa xác định thời điểm'),
 single('tham-thin-tuat','Tham Lang','Thìn/Tuất','192 §12.9','nguồn tiền đến nhanh, tăng về sau trong nhánh nguồn; không dự báo khoản thu bất ngờ'),
 single('tham-ty-ngo','Tham Lang','Tý/Ngọ','192 §12.9','hao tán do tiêu dùng trong nhánh nguồn; không quy kết người đọc hoang phí'),
 single('tham-dan-than','Tham Lang','Dần/Thân','192 §12.9','tiền vào rồi ra'),
 single('cu-hoi-ty-ngo','Cự Môn','Hợi/Tý/Ngọ','192 §12.10','gây dựng từ ít vốn, nguồn thu gắn với cạnh tranh hoặc biến động theo sách'),
 single('cu-ty-thin-tuat','Cự Môn','Tỵ/Thìn/Tuất','192 §12.10','tiền tụ tán thất thường, khó khăn và tranh chấp trong đoạn nguồn; không dự báo kiện tụng'),
 pair('nhat-cu-dan','Thái Dương','Cự Môn','192 §12.10','việc tạo nguồn thu dễ dàng theo nhánh nguồn','Dần'),
 pair('nhat-cu-than','Thái Dương','Cự Môn','192 §12.10','tạo nguồn thu vất vả, tích lũy về sau trong mô tả nguồn','Thân'),
 single('tuong-four','Thiên Tướng','Tỵ/Hợi/Sửu/Mùi','193 §12.11','nguồn tiền và những mối lợi tự đến theo sách; không xác nhận khoản lợi thực tế'),
 single('tuong-mao-dau','Thiên Tướng','Mão/Dậu','193 §12.11','mức bình thường trong cách phân loại của sách; không dùng gợi nghề công nghệ làm lời khuyên'),
 single('luong-ty-ngo','Thiên Lương','Tý/Ngọ','193 §12.12','sinh kế ổn định trong nhánh nguồn'),
 single('luong-suu-mui','Thiên Lương','Sửu/Mùi','193 §12.12','mức bình thường trong phân loại của sách, chưa phải đánh giá tài chính cá nhân'),
 single('luong-ty-hoi','Thiên Lương','Tỵ/Hợi','193 §12.12','kiếm tiền nơi xa đi cùng chi tiêu và hao tán, chưa phải khuyến nghị di chuyển'),
 pair('nhat-luong-mao','Thái Dương','Thiên Lương','193 §12.12','tạo nguồn thu dễ dàng theo nhánh nguồn','Mão'),
 pair('nhat-luong-dau','Thái Dương','Thiên Lương','193 §12.12','tạo nguồn thu vất vả, tích lũy về sau trong nhánh nguồn','Dậu'),
 single('sat-dan-than','Thất Sát','Dần/Thân','193 §12.13','trước ít sau nhiều trong nhánh nguồn; không chuyển thành dự báo thời điểm phát tài'),
 single('sat-ty-ngo','Thất Sát','Tý/Ngọ','193 §12.13','tiền tụ tán thất thường cùng những mối lợi bất ngờ trong sách, không xác nhận khoản thu sẽ đến'),
 single('sat-thin-tuat','Thất Sát','Thìn/Tuất','193 §12.13','khó khăn về nguồn tiền theo nhánh nguồn, không kết luận hoàn cảnh người đọc'),
 single('pha-ty-ngo','Phá Quân','Tý/Ngọ','193–194 §12.14','nguồn thu nhanh đi cùng chi tiêu mạnh và cách kinh doanh táo bạo trong sách; không khuyến nghị chấp nhận rủi ro'),
 single('pha-thin-tuat','Phá Quân','Thìn/Tuất','194 §12.14','tiền tụ tán thất thường, hết rồi lại có'),
 single('pha-dan-than','Phá Quân','Dần/Thân','194 §12.14','nguồn thu khó, thu ít chi nhiều; phần gợi nghề trong sách không dùng làm tư vấn nghề'),
];
export const FINANCE_READER_LIMIT = 'Đây là cách đọc nhánh trong sách, chưa phải kết luận tài sản hay thu nhập. Các cung liên quan và điều chỉnh chưa có quy tắc phối hợp đầy đủ.';

/** 1.26.0: independent local branches, no brightness or unquantified star groups. */
export const financeSupplements = [
 {id:'ma',stars:['Thiên Mã'],page:'195 §12.24',title:'Thiên Mã tại Tài Bạch',text:'Trong mục Tài Bạch, Tân Biên liên hệ Thiên Mã với việc kiếm tiền ở phương xa. Đây là chú giải về vị trí sao, không phải lời khuyên di chuyển hay xác nhận nguồn thu thực tế.'},
 {id:'dau-quan',stars:['Đẩu Quân'],page:'195 §12.29',title:'Đẩu Quân tại Tài Bạch',text:'Tân Biên mô tả Đẩu Quân tại Tài Bạch bằng ý giữ của vững bền. Ý riêng này chưa tổng hợp với những yếu tố hao tán cùng xuất hiện và không xác nhận khả năng tích lũy của người đọc.'},
 {id:'phuc-binh',stars:['Phục Binh'],page:'195 §12.30',title:'Phục Binh tại Tài Bạch',text:'Tân Biên gắn Phục Binh tại Tài Bạch với lời cảnh báo mất cắp, mất trộm. Đây là nội dung bất lợi của đoạn nguồn, không phải dự báo một sự kiện sẽ xảy ra hoặc căn cứ nghi ngờ một người cụ thể.'},
 {id:'thien-khong-kiep',stars:['Thiên Không','Địa Kiếp'],page:'197 §12.55;40 §3.21–3.22',title:'Thiên Không–Địa Kiếp đồng cung Tài Bạch',text:'Với Thiên Không và Địa Kiếp cùng ở Tài Bạch, Tân Biên nêu một ý bất lợi về sinh kế và sự thiếu thốn. Đây là chú giải cục bộ của đúng tổ hợp; chưa xét đủ các cung liên quan để kết luận hoàn cảnh tài chính. Không thay Thiên Không bằng Địa Không hoặc Địa Kiếp bằng Kiếp Sát.'},
 {id:'loc-position',stars:[],page:'32 §1.10;190 mở đầu',title:'Hóa Lộc tại Tài Bạch — ý nghĩa vị trí',text:'Trong nguyên tắc xét vị trí Tứ Hóa, Tân Biên lấy Hóa Lộc ở cung Tài làm ví dụ “được việc”. Đây là chú giải về vị trí đã ghi nhận; không tự áp ý của nhóm Lộc Tồn–Hóa Lộc hoặc khẳng định có tiền, có lời hay được hóa giải hao tán.'},
 {id:'ky-general',stars:[],page:'195 §12.23;191 §12.5',title:'Hóa Kỵ tại Tài Bạch — ngoài nhánh Nhật–Nguyệt',text:'Đối với Hóa Kỵ tại Tài Bạch, mục riêng trong Tân Biên nêu ý tán tài, tức tiền của hao tán. Nhánh này không áp cho Nhật–Nguyệt đồng cung vì sách có điều chỉnh riêng. Đây chưa phải dự báo mất tiền hay kết luận tài chính toàn lá số.'},
] as const;
