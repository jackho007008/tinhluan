# Phu Thê / Tử Nữ — 1.33.0

Baseline nội dung 1.32.0; căn cứ npl-evidence-process-1.0.0; engine không đổi. Phương pháp cục bộ mới: `tanbien-spouse-children-1.0.0`. Rule draft, review=null. Đối chiếu văn bản không phải phê duyệt chuyên môn.

## Phạm vi nguồn và triển khai

Tân Biên bản 277 trang: đọc toàn mục Tử Tức PDF/trang in 198–207 và Thê Thiếp/Phu Quân 208–216, đối chiếu ảnh toàn bộ; định nghĩa PDF33 §2.6–2.8. Thiên Lương bản 298 trang: đối chiếu PDF137–140, 164–167; Hàm Số bản 237 trang PDF40–42. Hash, ảnh và ma trận toàn mục ở `.local/phu-tu-20261013/`. Không tuyên bố đọc toàn ba sách.

`phu-tu-content.json` có 56 nhánh; điều kiện, câu biên tập, địa chỉ nguồn và giới hạn từng nhánh là đặc tả dữ liệu được kiểm thử. Dùng evaluator, familyAssessment và chứng nhận sao/Tứ Hóa hiện có. Không thêm một engine hoặc tính lại sao. Các mệnh đề được chọn quy định sao/địa chi trực tiếp, khai báo stateMethod=none; không đổi bảng trạng thái.

Nhánh một chính tinh được nguồn quy định đơn thủ dùng exact; tổ hợp dùng đúng bộ chính tinh. Thiên Tướng–Đào Hoa–Hồng Loan yêu cầu đủ ba đồng cung theo tiêu đề §14.39, không ép Thiên Tướng đơn thủ. Hóa Lộc/Quyền/Khoa Phu Thê phân biệt nam/nữ từ normalized.gender, không suy tình trạng hôn nhân. Tử là vòng Tràng Sinh, khác Tử Phù. Thái Tuế/Phục Binh lấy từ vòng suiqian12/boshi12 đã lưu: chỉ xác nhận âm khi đủ 12 tên vòng hợp lệ, duy nhất; thiếu hoặc sai giữ unknown. Không dùng sao lưu để kích hoạt bản mệnh.

Không thêm điều kiện vắng Tuần/Triệt hàng loạt. Không xuất những vế số lượng con/hôn nhân, sinh sản, sinh tử, quy kết phẩm hạnh hoặc lời khuyên cưới/sinh. Không thay chúng bằng lời tích cực khác. Điều kiện sớm/muộn, lần kết hôn và lượng từ chưa rõ giữ ngoài nhánh thực thi. Ma trận ghi rõ phần đã làm và phần còn lại theo từng mục.

Không áp Thiên Lương như một ưu tiên toàn sách: đoạn PDF165–167 là khung liên hệ và điều kiện cần, chưa thành công thức đủ cho các nhánh cụ thể. Hàm Số bổ sung giới hạn người thân/liên cung; ý giả thuyết về hôn nhân tiếp theo không thực thi. Không có thay thế phương pháp nguồn hiện hành.

## Bảo toàn và phiên bản

Bổ sung hai section/bộ chọn cung; bản mới lưu frozen reading 1.33.0. 8 bản mới dùng nguyên snapshot của bộ ứng viên, có parentId; không sửa lịch sử. Phụ Mẫu chỉ sửa giới hạn trình bày: thay lời mơ hồ về Nhật–Nguyệt bằng yếu tố còn chưa tổng hợp (chú giải khác chiều, sao phụ, liên cung). Claim/điều kiện không đổi.

Hồi quy cùng 192 v2 xác nhận claim, text, trace cũ và các section khác không đổi (Phụ Mẫu chỉ khác ghi chú). Hash 452 bản lịch sử và engine/calendar bảo toàn. Không dùng các snapshot QA sửa sao vào mẫu engine.

## Độ phủ và kiểm thử

192 v2, nhóm loại trừ nhau: Phu Thê 53 chính tinh/tổ hợp + 59 chỉ phụ tinh + 80 chỉ dữ kiện; Tử Nữ 54 + 30 + 108. Không missing-facts trong các nhánh mới trên bộ này; không có nghĩa các đoạn nguồn chưa triển khai đã rõ.

49/56 nhánh có mẫu trong 192 v2. Tìm hữu hạn 576 đầu vào tổng hợp thêm được 5 nhánh. Hai nhánh Thiên Tướng–Đào Hoa–Hồng Loan theo nam/nữ chưa tìm thấy; chưa chứng minh bất khả thi, không tính fixture kỹ thuật là mẫu engine.

- Full unit/integration: 70 file / 2713 test đạt, database test riêng. Không fail/skip.
- Typecheck và production build đạt (build trong QA copy, không đụng .next dev).
- E2E theo phạm vi: 52 lượt cung/mobile 360/390px cho 8 hồ sơ và 5 mẫu bổ sung; API tạo/lưu/mở lại; 8 bản lịch sử; auth và origin guard; không retry.
- Bản production QA kiểm tra: http://127.0.0.1:3027. Server chính 3000 giữ nguyên.

Các expected preview hiện hành được cập nhật cụ thể theo 56 nhánh mới, không sửa golden lịch sử. Kim Thoa: Thái Âm mang Kỵ tại Tử Nữ Hợi, TB PDF204 §13.3.24; 1992: Hóa Khoa tại Phu Thê, nam, TB PDF214 §14.21. Không dùng output làm chuẩn nguồn. Thêm kiểm thử điều kiện đúng/sai/thiếu, bản mệnh/sao lưu, nhóm bắt buộc, sai cung và bất biến snapshot.

## Điểm dừng

11 cung có nội dung cục bộ; Tật Ách chưa có gói. Chưa tổng hợp toàn cung hoặc toàn lá số. Chuẩn bị đọc trọn mục 11 Tân Biên, phần Phụ–Ách Thiên Lương và nhóm Phúc–Mệnh–Thân–Tật Hàm Số; chưa triển khai. Giữ nguyên beta, thanh toán, email và cổng duyệt.

## Lô ND12/13 và ND04/Tử — 21/10/2026, trình bày1.56.0/catalog1.53.0

Baseline thực `main@28328cc`, sạch; QA3062 đầu lô chạy checkout `.local/family-accuracy-20261021/qa-final`. Dùng lại ma trận audit trên, đặc tả19/10 và evaluator `kinAssessment`; không lấy trạng thái bàn giao làm bằng chứng predicate. Đọc lại **ảnh đã render của đúng PDF199,208–213** để giải các câu bị chặn; không đọc lại toàn sách. Nguồn và hash277trang giữ như hồ sơ cũ.

### Các câu đủ căn cứ được chuyển thành code

Thêm14 nhánh tọa thủ trong `kin-extension-content.json` và2 nhánh TửVCD, nối cuối catalog để giữ ID/văn nhóm cũ. Không sửa phép tính sao, bảng độ sáng hay mở nội dung số lượng/sinh tử/phẩm hạnh. Tất cả draft/review=null; đối chiếu nguồn không phải duyệt chuyên môn.

- **Tử Liêm–Phá, Liêm–Tham: PDF199§13.2.2** (dẫn lại Phá202). Giữ câu con về sau không khá giả. Với Liêm–Phá, “nếu sinh nhiều…” kết thúc ở vế nuôi toàn vẹn; câu sau về vật chất không có nếu/mới. Liêm–Tham nối bằng “và sau này…”; không biến khó nuôi thành điều kiện để xuất lời vật chất, không suy về sinh sản. Ma trận cũ gộp loại cả các vế này là giới hạn biên tập, không phải điều kiện nguồn. Khác Liêm–Tướng có “khó nuôi nhưng lớn lên…” và Sát có “dù sinh nhiều…chỉ còn…nhưng…”: chưa lấy riêng vế thuận trong các câu đó.
- **TửVCD, hai cặp trên:** PDF207§13.3.68 +199§13.2.2. Tử không chính tinh, Điền đúng đối sáu chi có đúng cặp; câu cung nhận không phụ thuộc chi/độ sáng. Dùng evaluator VCD riêng đã có, không mượn phụ tinh/Tứ Hóa hoặc lời Điền, không dựng cung giả. Đây là2 nhánh bổ sung, không chứng minh mọi phép mượn.
- **Phu Âm đơn Dậu/Tuất/Hợi, hai giới: PDF211§14.8.** Giữ vị thế, lấy nhau sớm, hòa thuận lâu bền; nam giữ thêm nể vợ/đôi khi nhờ vợ có danh giá của cải. “Lấy nhau sớm” là mô tả như các nhánh đã giải19/10; không có nếu/mới, không biến thành gate tuổi. Loại nhan sắc/phẩm hạnh theo phạm vi cũ.
- **Phu Cơ–Âm Dần: PDF210§14.6/211§14.8.** Giữ trở ngại cưới hỏi và có tài; lời tránh bất hòa/xa cách gắn muộn vẫn là điều kiện chưa xác định, không dự báo chia ly vô điều kiện.
- **Phu Nhật–Lương Dậu: PDF212§14.12.** Trắc trở cưới xin là vế riêng; tránh chẳng lành có muộn/mới, giữ bên cạnh và chưa áp kết quả. Không dùng nhánh Nhật đơn thủ để tự cho cặp khớp.
- **Phu Sát đơn Dần/Thân và Tý/Ngọ: PDF213§14.13.** Dần/Thân giữ cả hai cương cường. Tý/Ngọ dẫn “cũng như trên”, thêm hay bất hòa; vế chia ly chỉ dưới “nếu sớm lập gia đình”, giữ nguyên và không xác nhận đã thỏa. Không xuất ghen tuông/thứ bậc, không chuyển lời khuyên muộn thành kết luận hại.
- **Phu Liêm–Phủ: PDF208§14.2/210§14.7.** Câu riêng cương cường nhưng sống lâu bền; câu gia đình sung túc/thường có danh giá. Giữ rõ nguồn đặt sau lời khuyên muộn. Nguồn không viết “như thế mới” như Tử–Sát; không thêm gate tuổi, không coi lời khuyên đã thực hiện hoặc bảo đảm kết quả thực tế.
- **Phu Vũ đơn Thìn/Tuất, hai giới: PDF209§14.4.** Câu riêng nam nhờ vợ có tiền/nữ nhờ chồng hưởng giàu sang; lời khuyên muộn/bằng hoặc gần tuổi ở câu trước vẫn được nêu là chưa áp, không đặt tuổi. Không tự giả định đã có người phối ngẫu.
- **Phu Liêm–Sát: PDF209§14.2/213§14.13.** Nguồn trực tiếp nói hình khắc *hay* sinh ly trước lời khuyên muộn. Giữ phép “hoặc”, không đổi hình khắc thành bệnh/tử vong, không tuyên bố người đọc sẽ ly hôn hoặc đã tránh hại.
- **Phu Tướng đơn Tỵ/Hợi/Sửu/Mùi, hai giới: PDF212§14.11.** Hai câu riêng về vợ có tài/khá giả, chồng có danh chức/giỏi giang; không lấy câu khuyên muộn làm điều kiện nguồn của hai câu mô tả. Văn khách giữ các yếu tố muộn/chênh tuổi/họ xa chưa xét; không phát biểu đã tránh bất hòa hoặc đủ họ xa để tốt đôi. Loại nhan sắc, không xác nhận năng lực/tài sản thực tế.

Mọi nhánh tọa thủ giữ exact đúng bộ chính tinh, đúng chi và giới nếu có; chứng nhận thiếu/sao lưu không kích hoạt. Không thêm điều kiện vắng TT. Cổng nguồn không rõ vẫn giữ riêng; đây không phải bỏ toàn bộ cổng bảo thủ.

### Phần còn lại và câu hỏi cần chốt

- **ND12:** Tướng Mão/Dậu201§13.3.11 và Cơ–Cự200 có “muộn…mới”; Nhật–Cự Thân200 và Nhật–Lương Dậu200/202 còn điều kiện sinh muộn. Chưa có tuổi/định nghĩa và dữ kiện kiểm, không xuất phần thuận như đã thỏa. TT205§13.3.45 chưa rõ một/cả hai và phạm vi câu quan hệ; các nhóm Kình–Đà–Không–Kiếp/Hỏa–Linh/Xương–Khúc/Đẩu/Khốc–Hư chưa rõ lượng từ, tập cung, sáng/mờ. Lộc Tồn203 có ngoại lệ “nhiều sao mờ” tác động tới sự hiện hữu của đối tượng nên chưa bóc lời quan hệ. Liêm–Tướng, Vũ đơn, Sát Dần/Thân chưa tách phần thuận khỏi hoàn cảnh nuôi con trong câu. Những nhánh chỉ số con/giới tính/quý tử, Hóa Quyền/Khoa/Hồng Loan và phẩm hạnh/sinh tử giữ phạm vi audit cũ, không tự mở.
- **ND13:** Đồng Mão209, Đồng–Âm Ngọ209/211, Nhật–Cự Thân210, Tử–Sát208/213 chỉ cho lời tránh hại/bền lâu khi chậm/muộn/tiên trở hậu thành; chưa định nghĩa. Cơ–Cự210, Nhật–Nguyệt210/211, Vũ–Tham209 và Vũ–Phá209/213, Phá Tý/Ngọ213 gắn vế thuận với nếu/ngoại lệ trong cùng câu: không chỉ lấy vế thuận. Đồng–Âm Tý có “như trên” dẫn khác chiều209/211; Lương Tỵ212 có hai dòng khác chiều, không tự sửa thành Tý hoặc chọn lời thắng. Các nhánh Cự thấp, Liêm đơn, Phá/Sát khác chứa số lần hôn nhân/tai họa/phẩm hạnh, không đổi thành văn quan hệ chung. Nhóm Xương/Khúc, Khôi/Việt, Quang/Quý, Cô/Quả, Cự–Hỏa–Linh, Song Hao và “nhiều” chưa chốt lượng từ/vị trí; Lộc ở216 chưa rõ sao nào. PhuVCD chưa có hợp đồng riêng, không dùng định nghĩa Tử207 cho Phu.
- **Quyết định phạm vi ND19:** giữ hiện trạng (khuyến nghị cho lô này), hoặc cho thẩm định riêng số lượng/thứ bậc/quý tử/đặc tính con. Phương án thứ hai cần duyệt từng loại và cách diễn đạt trước code; chưa thể hứa số cung sẽ giảm. Không bao gồm việc cho phép bệnh/sinh tử/phẩm hạnh.
- **Câu hỏi chuyên môn ND04/12/13:** nguồn nào định nghĩa tuổi sớm/muộn và dữ kiện cần nhập; nếu chưa có, giữ không áp kết quả thay vì tự chọn tuổi. Với VCD/TT/nhóm sao, cần cung cho/nhận, trạng thái, lượng từ và ngoại lệ cụ thể; không biểu quyết AND/OR theo sở thích. Với hai bất nhất209/211 và212, cần bằng chứng đính chính hoặc quyết định giữ hai chú giải xung đột; hiện giữ chưa áp, không chọn bên thắng.

### Kết quả kỹ thuật

So192 với bản1.55.1: Tử trống97→93 (4 mới/5 bổ sung); Phu67→51 (16 mới/12 bổ sung);37snapshot có37claim mới. Mười cung khác và tất cả claims/facts/traces/relations/văn cũ giữ nguyên, G2 bằng nhau. 13/16 nhánh mới có mẫu trong192; hai đầu vào mới có chủ đích (không quét): nữ06/08/1983 giờSửu chứng kiến thêm Vũ/Phu nữ; nam06/08/1988 giờTỵ chứng kiến TửVCD Liêm–Tham. Còn Nhật–Lương Dậu/Phu và Liêm–Phá/TửVCD chỉ fixture, chưa chứng kiến engine; bốn nhánh VCD cũ chưa có engine vẫn giữ trạng thái cũ.

Bằng chứng, bài đầy đủ và kiểm thực thi ở `.local/kin-batch-20261021/`; không đưa dữ liệu riêng vào Git. Backlog duy nhất là ND04/12/13/19 trong V1-DELIVERY-PLAN, không coi phụ lục này là backlog mới.
