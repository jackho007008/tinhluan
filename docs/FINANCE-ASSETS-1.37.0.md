# Tài chính và tài sản — nội dung 1.37.0

Baseline đã ghi trước sửa: nội dung/catalog 1.36.0, continuous-report-1.0.1, căn cứ NPL đã có. Node20.20.2/npm10.8.2, iztro2.6.1. Không có Git trong thư mục này; đối chiếu bằng SHA-256. Dữ liệu hồi quy: nguyên 192 v2, không bộ gốc lỗi.

## Phạm vi văn bản đã đọc

Tử Vi Tổng Hợp, Nguyễn Phát Lộc, bản 442 trang, SHA256 82f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37. PDF và số in trùng tại các trang dùng. Đã đọc văn bản trích 26–32,73–75,121–124,240–265; đối chiếu ảnh 242,245,254,257,264,265 quyết định. Không tuyên bố đọc cả sách. Tân Biên: đối chiếu trực tiếp ảnh190,191,195,197; tái sử dụng hồ sơ các lời Quan/Điền và Tuần–Triệt1.36. Những hồ sơ TL/Hàm Số về Cơ–Lương/Kỵ trước đây chưa có phép ưu tiên không bị biến thành phép mới. Đợt này không thêm phương pháp TL/Hàm Số.

NPL26–32 và121–124 là tiến trình/quan niệm định tính; 121 có phản biện phương pháp tam hợp, 123–124 tự ghi quan niệm. Không chuyển thành điểm, ngưỡng, cung thắng cung hoặc chính tinh xóa phụ tinh. NPL73–75 không dùng để nới điều kiện đồng cung của catalog. NPL247–249 thuật TL Lộc Tồn và nêu thắc mắc xung chiếu: không triển khai hệ số/tuổi/phép Lộc mới. NPL265 Thiên Giải phản biện quan điểm người khác: không lấy câu dẫn phản biện làm rule.

## Quyết định thực thi

1. `npl-finance-retention-1.0.0`: Thiên Không bản mệnh tại Tài Bạch. NPL265 gọi riêng Thiên Không, khác Địa Không/Địa Kiếp ở264. Mục bao quanh là sao hao tiền. Nguồn: khó giữ lâu, hao tương đối nhanh; có trường hợp chỉ không dư thừa, nguyên nhân ngoài kiểm soát hoặc hệ quả cách thu trước. Không bỏ cách hiểu nhẹ hơn, không quy kết hành vi. Giới hạn dự án: tọa thủ Tài, không hội chiếu. Không thêm yêu cầu sáng/tối, địa chi, Tuần/Triệt. Không có ngoại lệ cụ thể ở đoạn này không chứng minh mọi ngoại lệ vắng mặt. Có chứng cứ dương natal → yes; không có và hợp đồng danh sách đầy đủ → no; còn lại unknown. Validator và receipt vẫn chặn bản lưu bất nhất. Rule draft/review=null, không thay r42 hoặc quy tắc TB Thiên Không–Địa Kiếp.
2. `finance-assets-1.0.0`, phân biệt tiền/nhà đất: NPL241–242,257,261–262. Kích hoạt khi có claim Tài và Điền. Giữ cả hai, không từ Điền suy toàn tài chính. Không thực thi mệnh đề “cả hai cung tốt thì...” vì chưa định nghĩa tốt toàn cung.
3. Cơ–Lương/Kỵ: TB191§12.6 và195§12.23; NPL245,264 đối chiếu cùng khía cạnh. Chỉ khi cả hai claim khớp: tạo của / hao tán được trình bày song song. Không suy dòng tiền ròng, không gán Kỵ xóa Cơ–Lương hoặc hóa giải Kỵ. Ngoại lệ Nhật–Nguyệt vẫn do evaluator cũ quyết định, không được phối hợp lại.
4. Lời giữ của + Thiên Không: ghi xung đột nhận định cục bộ còn chưa giải quyết, giữ hai căn cứ. Đây không phải hai phương pháp mâu thuẫn trực tiếp cùng đối tượng để tự thay Tân Biên. Không kết câu “giữ của bền”.
5. Điền Cơ–Cự gặp TT: tái sử dụng quan hệ điều chỉnh1.36, không khôi phục lời nền đã bị chặn. NPL260–261 chỉ nói nhà đất, NPL257 giới hạn suy rộng.
6. Quan Tử Vi Ngọ gặp TT: tái sử dụng1.36, giới hạn công việc không kết luận thiếu tiền. NPL242/257 phân biệt nghề/chức và tài;306 là căn cứ điều chỉnh cụ thể. Không suy mọi Quan thuận là thu nhập cao.

## Hình thức hóa và lưu

Phân loại aspect bằng danh sách rule được biên soạn rõ, không đoán từ từ khóa. Những nhánh Quan có vế tài lộc/buôn bán trực tiếp được chọn nguyên đoạn, giữ vế khó khăn và điều kiện nghề, không tự chọn nghề thực tế. Nhánh chưa phân loại vẫn ở cung gốc. Mỗi nhóm xuất một lần; liên kết từ cung về đoạn đó, không nhân đôi bằng chứng. Mỗi quan hệ chứa claim IDs, group IDs, loại, nguồn và cách phối hợp của sản phẩm. Không có tính điểm hoặc evaluator thứ hai.

Bốn lời diễn đạt lại: r06, r42, finance-co-luong, finance-extra-ky-general. Còn lại giữ lời hiện có; một chú giải mới có nguồn riêng. Lời gốc vẫn trong căn cứ và đối tượng claim. `continuousReport.financeAssets` cùng bảng quan hệ được đóng băng trong bản lưu; bản không có trường này vẫn đọc giao diện cũ. Nội dung1.37.0, lớp phối hợp1.0.0, renderercontinuous1.1.0; engine nguyên trạng.

Mệnh/Thân/Phúc/Di: TB190 yêu cầu xét trước; NPL241–242,254–257 chỉ dẫn nhiều mặt nhưng chưa có điều kiện tổng hợp đủ rõ. Ghi ở căn cứ, liên kết về cung; không dùng Thân cư làm hệ số, không tuyên bố tài chính đã luận đầy đủ.

## Các điểm chưa triển khai

- Phép phối hợp Liêm–Phủ và Thiên Không để xác định tác động lên giữ của: cần đoạn cùng đối tượng, điều kiện, quan hệ và ngoại lệ; không đủ chỉ một nguyên tắc chung phụ tinh làm giảm chính tinh.
- Lượng tạo của so với hao tán Cơ–Lương/Kỵ: chưa có phép cân đối hay thay thế; không cần chặn trình bày song song.
- Ngưỡng/phương pháp liên cung Mệnh–Thân–Phúc–Di và trạng thái hỗn hợp; không áp những chữ “nhiều”,“tốt”,“xấu” như boolean toàn cung.
- NPL254 không định lượng được “vừa đủ” sao giữ của; không triển khai ngưỡng2. NPL262–265 phần quy kết đạo đức, hình ngục/biến cố không đưa vào sản phẩm. Không thêm nhánh vận.


## Lô Quan–Tài 1.59.0 / catalog1.56.0 — 21/10/2026

Code `bb230d5` bổ sung `tanbien.finance-vu-tham-sequence`: Vũ Khúc–Tham Lang bản mệnh đồng cung Tài; PDF191§12.4 và192§12.9 ghi đúng “từ ngoài 30 trở đi, mới giàu”. Không đổi thành “từ30” của Quan, không tính tuổi hiện tại hoặc khẳng định đã qua mốc/đã giàu, không suy trước mốc phải nghèo. Giới hạn cũ phải chọn thời đoạn hiện tại được bỏ cho việc trình bày nguyên câu; chưa giải quy ước tuổi để chạy dự báo theo năm. Không lấy câu Quan để bổ sung thu nhập cho câu Tài.

ND03 giữ nguyên. Nhánh mới ở **Tiền bạc**, không phân thành Nguồn thu hoặc Giữ của vì câu nguồn chỉ nói diễn tiến mức tài chính. Không thêm quan hệ cân đối/ưu tiên hoặc kết luận ròng. Lịch sử đọc đúng frozen cũ; G2 không đổi. Bộ192: Tài21→21 trống,0 mới có nhận định/2 cung có lời được bổ sung. Mẫu engine ngoài192: nữ05/05/1988 dương lịch giờTỵ, đã tạo qua form Lập lá số.

Rà đủ103 hàng ma trận finance-expand: các nhánh A có ID đã nằm trong code; câu Vũ–Tham là phần thời đoạn vừa triển khai. Thái Dương tọa thủ có cổng đơn thủ do dự án chống trùng: các cặp Nhật–Cự/Nhật–Lương/Nhật–Nguyệt đã có lời riêng, không cần thêm claim trùng; không mở cổng tọa thủ để bỏ qua ngoại lệ Nhật–Nguyệt. Không xem cổng đó là điều kiện nguyên văn.

Còn chặn cụ thể:

- Kình–Đà/Hỏa–Linh/Không–Kiếp: lượng từ và cách chọn khi trạng thái khác nhau; Xương–Khúc/Riêu–Y/TT: “nhiều” và phối hợp chưa định nghĩa. Khôi–Việt/Tả–Hữu/Lộc–Khoa–Quyền/Cô–Quả/Quang–Quý thiếu toán tử; không chọn AND/OR từ dấu phẩy.
- Lộc–Mã/Hồng/Hao/Tang–Đà/Không–Kiếp và các nhóm Song Hao: định danh Lộc/Hao, quan hệ và phạm vi áp dụng chưa đủ. Tử195§12.31 “có của chôn giấu” chưa có đặc tả nhận dạng/áp dụng đã chốt; không tự đổi thành giữ tiền hoặc giàu có. Các vế quy kết hành vi/bạo lực ngoài phạm vi không chuyển thành lời nhẹ hơn.
- VCD197§12.56: chỉ dẫn mượn đi kèm giới hạn không “giàu to lớn” và hai ngoại lệ TT, Nhật–Nguyệt cùng sáng xung/hợp. Bản in là “hợp chiến”; không tự sửa. Chưa có phép gắn giới hạn vào các lời đối cung và xử lý ngoại lệ, không mượn toàn catalog hoặc chép một câu giàu có rồi thêm cảnh báo chung.
- Liêm–Phủ/Thiên Không và Cơ–Lương/Kỵ vẫn giữ song song; chưa có phép xác định lời giữ/tạo tiền thắng hao tán. Không đổi bố cục thành kết luận tổng hợp.

Phần đủ đặc tả trong ma trận đã rà đã hết sau lô này; không tuyên bố hết sách. Backlog duy nhất ND15/16 và phần VCD ND04; [toàn văn mẫu và kiểm](../.local/quan-tai-20261021/ban-giao.md).

## ND04/16 — Tài VCD, Tuần/Triệt trực tiếp, 1.60.0 — 21/10/2026

Lô hữu hạn nối baseline `main@80d9232` sạch; chỉ một nhánh `tanbien.finance-vcd-direct-void`, module [finance-vcd.ts](../lib/interpretation-rules/finance-vcd.ts). Cập nhật này thay kết luận chặn **toàn** §12.56 ở lô1.59 đối với tập con dưới đây; không giải phép mượn chung. Catalog1.57, trình bày1.60; dùng nguyên evaluator/renderer/freeze/G2 hiện có, draft/review=null.

**Căn cứ:** Tân Biên277trang, SHA256 đã ghi ở các mục trước; chữ và ảnh PDF197§12.56 đã đối chiếu đúng trang. Nhánh TT ghi độc lập đủ diễn tiến: buổi đầu kiếm tiền khó, về sau dễ, càng về già càng sung túc. Nó không đòi xác định cặp chính tinh đối cung, không cần tính tuổi hiện tại. Cùng mục có ngoại lệ Nhật–Nguyệt cùng sáng và vế tăng thêm với TT; ảnh thực sự ghi “hợp chiến”, chưa được sửa thành “hợp chiếu”. Bảng trạng thái riêng Tân Biên PDF33§2.10/35–36 xét tại chi sao thật; không dùng bảng NPL/TL hoặc brightness engine.

**Hợp đồng:** Tài thật sự không có chính tinh, danh sách12cung/14chính tinh đủ/toàn vẹn/bản mệnh; hai cặp Tuần Không/Triệt Lộ duy nhất và kề nhau hợp lệ; ít nhất một cặp án trực tiếp Tài. Cả hai cùng có vẫn là có TT, không tự triệt tiêu. Tra được cả hai ô Nhật–Nguyệt tại chi thật và ít nhất một sao không Miếu/Vượng/Đắc. Khi cả hai sáng (dù quan hệ nào), giữ ngoài tập con; thiếu ô/dữ liệu giữ unknown. Đây là **giới hạn dự án nhằm chắc chắn loại điều kiện cần của ngoại lệ thứ hai**, không gán điều kiện vắng hai sao cho sách, không tự giải chữ “hợp chiến”. Không chuyển sao, lời Phúc đối cung, phụ tinh hoặc phép điều chỉnh; không tạo cung giả.

**Văn khách hàng nguyên đoạn:**

> Tài Bạch không có chính tinh, có Tuần hoặc Triệt án ngữ trực tiếp, trong khi Nhật–Nguyệt không cùng ở thế sáng. Với cấu trúc này, việc kiếm tiền được mô tả là khó khăn lúc đầu, về sau dễ dàng hơn, càng về già càng sung túc. Các vế nói về một diễn tiến theo cách luận truyền thống; chưa xác định bạn đang ở giai đoạn nào hoặc mức thu nhập, tài sản thực tế.

Điều kiện ảnh hưởng ý nghĩa nằm trong đoạn; nguồn, trạng thái cụ thể, vị trí TT và lý do giới hạn nằm trong căn cứ. Không biến lời này thành kết luận tài sản ròng hoặc khuyên đầu tư.

**Phân biệt ba nguyên nhân sau tra kho và code:**

- **Có phương pháp, chưa áp:** TT trực tiếp của Tài§12.56 vừa được triển khai. HS52 đã chỉ rõ sao xung chiếu giữ chi/trạng thái thật, ví dụ Âm Ngọ chiếu Tý; chưa áp như hợp đồng chung cho các lời Tân Biên phụ thuộc địa chi. Điều sau là một lựa chọn phối hợp phương pháp cần chốt cụ thể, không mặc định chuyển lời TB theo NPL. TH108 nhánh Mệnh trống và bảng một sao tuy hồ sơ `inherited-NPL-07` còn giữ trạng thái lịch sử thiếu coding, **code npl-foundation.ts hiện đã áp**; không triển khai lại.
- **Yêu cầu dự án tự đặt:** đòi giải toàn phép mượn trước khi xuất câu TT độc lập ở Tài là cổng quá rộng, đã gỡ riêng ở tập con trên. Cổng Phụ có vật chất giữ unknown khi TT ở một trong hai cung là cổng thận trọng của dự án, không phải sách đòi vắng TT; chưa tự gỡ vì còn phạm vi nghịch đảo §5.2.30. ND19 số lượng/thứ bậc/âm phần là phạm vi triển khai, không coi là nguồn thiếu. Không tự mở phạm vi.
- **Nguồn còn thiếu/bất nhất:** “hợp chiến”/phạm vi ngoại lệ Tài; vị trí áp điều chỉnh sau mượn và lời phụ thuộc chi; lượng từ “nhiều”/nhóm chưa xác định; các ô ngũ hành thiếu và mâu thuẫn đã ghi. TL18679–80/183 và TL298118–121/280 có lớp chính văn/phụ luận khác nhau về TamKhông, không chọn câu thắng. TH88–89 thừa nhận mức ảnh hưởng xung chiếu không được lượng hóa; không tự tạo tỷ lệ hoặc kết quả ròng. Không yêu cầu người thẩm định bên ngoài để Codex tiếp tục; bất nhất phải giữ rõ thay vì tự chốt.

**Điểm dừng:** đã giải một nhóm trực tiếp, chưa giải VCD mọi cung, chín Di, PhuVCD, ngoại lệ Phúc/TamKhông hoặc Tật. Chỉ có phương pháp NPL không tự cho phép thay nghĩa/chi của rule TB. Giữ nguồn riêng; nếu mở nhánh phụ thuộc chi cần quyết định dùng tầng NPL riêng hay phối hợp TB–NPL kèm câu và phản ví dụ cụ thể. Tật/hai mẫu/G2/lịch sử/Live không đổi.
