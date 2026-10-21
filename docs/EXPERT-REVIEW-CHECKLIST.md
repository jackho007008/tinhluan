# Hồ sơ cần chuyên gia duyệt trước phát hành nhận định

Không có chuyên gia được chỉ định trong phiên này.0 rule chuyên môn approved. Checklist không phải biên bản đã ký.

## Hồ sơ mỗi rule

- [ ] Tên người duyệt có thật, vai trò, ngày, phạm vi, liên kết biên bản và quyền sử dụng danh tính được xác nhận.
- [ ] Tác giả/ấn bản/trang hoặc ảnh quét có quyền dùng, locator chính xác; bản chép và bản dịch đối chiếu được.
- [ ] Trường phái/profile tương thích: lịch UTC+7, ngày00:00, tháng nhuận lặp số tháng, quy tắc sao iztro default; bất đồng ghi riêng, không sửa engine ngầm.
- [ ] Các thành phần chart dùng làm căn cứ có fixture độc lập theo từng trường. Chính tinh đúng không suy ra phụ tinh/tứ hóa/miếu-vượng/đại vận đều đúng.
- [ ] Chỉ rõ requiredFacts, điều kiện AND, ngoại lệ OR; dữ kiện thiếu là chưa đủ, không là không có sao.
- [ ] ClaimTemplate diễn đạt đúng phạm vi nguồn, không khẳng định chắc chắn tính cách/nghề/thu nhập/thành công; không dùng nỗi sợ.
- [ ] Ngoại lệ/hội chiếu/sát tinh/tổ hợp cần thiết đã đặc tả; không phê duyệt hai draft hiện tại khi các mục này còn thiếu.
- [ ] conflictsWith/conflictGroup xác định; giữ khác chiều hoặc chặn toàn nhóm theo phương pháp được duyệt. Không chọn theo cảm tính tích cực.
- [ ] Quyền nội dung cleared; MIT code không được coi là quyền cho nội dung website/sách.
- [ ] Tests bao phủ match/non-match/exception/missing/profile/conflict/evidence; phiên bản mới, giữ report đã giao.
- [ ] Biên bản được kiểm tra trước đổi status approved. Schema chỉ kiểm hình thức record, không xác thực người ký.

## Lá số đối chiếu

Dùng fixtures/chart-comparison/awaiting-vn.json làm cấu trúc. Chỉ điền dữ liệu thật đã được phép dùng; không commit PII. Lưu múi giờ/ranh giới ngày/tháng nhuận/trường phái cùng nguồn, thời điểm đối chiếu, danh sách path được xác nhận và expected từ nguồn. Nhập kết quả nguồn bằng tay hoặc quy trình nhập có audit; không sinh expected từ calculate().

Cần ngày thường, nam/nữ, cục khác nhau, ngày nhuận dương, tháng nhuận, trước/sau ngày15, Tết, Lập xuân,22:59/23:00/23:59/00:00 và khác lịch Việt/Trung. Phạm vi bao gồm Mệnh/Thân, can cung/cục, chính/phụ/tạp tinh, độ sáng/tứ hóa, vòng sao và range/ages nếu định dùng. Chỉ xác nhận các trường đã thực sự xem, không tick “toàn bộ” từ vài sao trùng.

## Riêng hai chủ đề

Tổng quan: cần bản in và kiểm tra dịch đoạn Thiên Đồng; xác định vai trò Mệnh/Thân và điều kiện đi kèm; tránh coi lời truyền thống là đánh giá tâm lý khách quan.

Sự nghiệp: cần bộ quy tắc nghề nghiệp có xuất xứ và đặc tả phối hợp cung/sao; hiện chỉ chọn Quan Lộc để tra cứu dữ kiện. Chưa suy nghề, thu nhập hoặc thời điểm thành công; chưa luận tài lộc dù tên nhóm cũ có chữ tài lộc.

Chưa làm scoring, đại/tiểu/nhật vận, chat tự do, payment thật. Mở bán còn cần các điều kiện vận hành/giá trong README và ENGINE-VALIDATION; duyệt một rule không tự mở những tính năng đó.

## Preview lá số đang đọc

- [ ] Đối chiếu bản in cho các mục Vũ Khúc, Thiên Phủ, Tử Vi, Thiên Tướng của Toàn Thư quyển một.
- [ ] Xác định hệ nhãn “nhàn cung” quyển hai so với “Đắc” trong dữ liệu hiện tại; không sửa engine chỉ để khớp.
- [ ] Xác định đặc tả và ngoại lệ cho Vũ Phủ tại Tý, Tử Tướng tại Thìn, Hóa Kỵ/Hóa Quyền và sao phụ/hội chiếu; không ghép nghĩa sao riêng thành tổ hợp.
- [ ] Kiểm tra phạm vi dùng chú giải Thân cư Quan Lộc hiện đại và quyền nội dung/bản dịch.
- [ ] Duyệt từng dòng bảng căn cứ tại `/internal#claim-map`; hiện tất cả năm chú giải là draft, chưa có người duyệt.

## Cửa duyệt bổ sung sau rà soát 1.4.0

- Đối chiếu bản in các đoạn phụ bật đồng cung / đồng viên với đoạn Tử Vi–Phá Quân, xác định quan hệ, vị trí và mức kết luận được phép; không dùng số lượng test làm xác nhận.
- Quyết định một hay hai phụ tá, đồng cung hay hội chiếu; điều kiện trạng thái và tứ hóa. Hiện tại chỉ chọn đủ hai cùng Mệnh, chặn Phá Quân, không đánh giá thuận.
- Xác định nghĩa và phạm vi nhãn sát tinh/xung phá; mảng không ghi sao tại Mệnh không chứng minh vắng yếu tố ở mọi cung.
- Duyệt cách diễn nghĩa tại Mệnh của Liêm Trinh/Tham Lang/Cự Môn; không tái tạo phán xét đạo đức, giới, bệnh/tử vong trong văn bản cổ.
- Phá Quân/Thất Sát hiện chỉ có thuật ngữ chung. Cần đặc tả riêng trước luận Mệnh; không coi danh mục có chú giải là hoàn tất nội dung.
- Giữ vấn đề hệ nhãn nhàn cung / Đắc độc lập; không đổi nhãn engine để khớp nguồn. Xác minh quyền nội dung và bản dịch; ghi reviewer/ngày/biên bản có thật trước approved.
