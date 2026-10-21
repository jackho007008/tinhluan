# Tật Ách — phạm vi trình bày 1.34.0

Baseline 1.33.0. Không thêm/sửa rule chuyên môn. Catalog/ruleset giữ 1.33.0; template lưu mới 1.34.0; lớp dữ kiện/giới hạn `tat-ach-scope-1.0.0`; căn cứ NPL hiện có không đổi. Engine, lịch và snapshot không đổi.

## Nguồn / quyết định

Đọc trọn Tân Biên PDF/trang in181–189, mục11: mở đầu, 10 mục cứu giải, các chính/phụ tinh và tổ hợp đến Thiên Khôi. Đối chiếu ảnh cả9trang, định nghĩa PDF33. Đọc/đối chiếu Thiên Lương bản298trang PDF160–163 (Phụ Mẫu liên quan gì tới Tật Ách); Hàm Số bản237trang PDF/trang44 và73, ngữ cảnh lân cận. Danh tính/hash/tệp nguồn trong `.local/tat-ach-20261013/sources.json`.

Ma trận toàn mục `.local/tat-ach-20261013/matrix.json`: 55 tiêu đề nguồn, gồm nhóm/mở đầu, không tương đương số rule. A lấy dữ kiện snapshot. B không có nhánh được chọn. C giữ nghiên cứu cả lời bất lợi lẫn lời cứu giải vì vẫn đánh giá bệnh/sức khỏe, tai nạn, sinh tử. Các ví dụ kiện cáo/tù tội cũng giữ nghiên cứu, không đổi nghĩa thành “giao tiếp khó khăn”. D ghi riêng lượng từ nhiều/mức độ, điều chỉnh liên cung, các điểm văn bản; không cộng D với C thành tổng số nhánh.

Ảnh PDF184 Thiên Lương tại Hợi/Tỵ/Sửu khác OCR Tý; không có rule dựa vào lỗi này. PDF189 Thiên Khôi lặp gần nguyên phần Thiên Tướng §11.2.9, giữ nghi vấn văn bản thay vì sửa tên. Số mục trùng/nhảy giữ theo bản PDF.

Thiên Lương Phụ–Ách gồm diễn giải nhân quả gia đình và bệnh nạn, không đưa vào lời cá nhân. Hàm Số nhóm Phúc–Mệnh–Thân–Tật là phạm vi cần xem, không phải phép hợp nhất. Không có quyết định thay nguồn hoặc công thức mới.

## Tích hợp

`lib/internal-review/tat-ach.ts` chỉ chiếu dữ kiện; không gọi tính sao hoặc đưa facts mới vào evaluator. Dùng principalIntegrity, chứng nhận danh sách sao, verifiedNatalTransformations và trạng thái nguồn đã lưu. Unknown vẫn khác dữ liệu đầy đủ xác nhận vắng. Bản mệnh khác sao lưu. Vị trí Tuần/Triệt chỉ được ghi, không suy cứu giải.

`TatAchReading` dùng chung cho phần chọn cung và toàn văn đã lưu. Ghi chú sức khỏe một lần mỗi phần, căn cứ đóng, chi tiết kỹ thuật riêng. Giá trị được freeze vào reading.tatAch; lịch sử thiếu trường này không bị backfill hoặc chạy lại phương pháp mới. Thêm template1.34.0 cho thay đổi phạm vi trình bày có thực, không gọi là tăng nội dung chuyên môn.

## Kết quả

Cùng192v2:192 snapshot hợp lệ;192 đủ dữ kiện danh sách/TứHóa/TuầnTriệt;0chú giảiB;192chỉdữkiện;0thiếudữkiện theo hợp đồng này. Trạng thái sao không có trong nguồn vẫn null, không tính vào thiếu danh sách; không biến thành Hãm. Không tìm mẫu mới vì không có rule mới. Fixture kỹ thuật chỉ kiểm thử hợp đồng.

Hồi quy toàn execution/sections/readerPresentation/palaceReview cũ trên192v2 bằng so sánh sâu.8bản mới có parentId, dùng cùngsnapshot;502filelịch sử giữhash. Catalog/evaluator/enginekhôngsửa. Không thaybeta/payment/email/AI/scoring/cổngkhách.

Kiểm thử:71file/2732testđạt trênDBtestcôlập;typecheck;productionbuildQA. E2Ephạmvi16lượtTậtÁch8mẫu×360/390,đổicung/hồsơ,APIcreate/save/reopen,8lịchsử,auth/origin,khôngretry. QA127.0.0.1:3028; khôngbuildđè.next3000. Không gọi là toàn bộsuiteE2E.

## Chuyển giai đoạn

Bàn giao `.local/tat-ach-20261013/ban-giao.html`, tự chứa toàn văn/ảnh/căn cứ và đánh giá12cung8mẫu. Nhận diện lặp nghĩa tại TửNữ(TháiÂm), Phụ(Cơ–Cự/Kỵ); cặp khác chiều Điền(Tử–Tướng/Đà), Phụ(Liêm–Tham hoặc Tham/Lộc), Tài(Cơ–Lương/Kỵ), Quan(ThấtSát/Kình–Lực). Không chỉnh những câu đó trong đợt này.

Danh sách hữu hạn tiếp theo: (1)tổ chức bài/giới hạn; (2)giảm lặp giữclaim; (3)xửlý đúng các cặp trên bằng nguồn hoặc nhãn khácchiều, khôngtựhòagiải; (4)bảnứngviên8mẫu và nghiệmthu192v2/API/mobile. Không mở vòng bổ sung sao. Đủ12cungcó đường đọc không đồng nghĩa tổng hợp toànlá số.
