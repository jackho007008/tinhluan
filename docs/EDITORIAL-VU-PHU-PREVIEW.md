# Preview biên soạn riêng Vũ Khúc–Thiên Phủ — 08/10/2026

URL nội bộ: http://localhost:3000/internal/editorial/demo-wuqu-tianfu . Dùng quyền nội bộ hiện có trên website hiện hành; quyền beta không mở được trang này. Có liên kết từ trang /internal sau khi chọn một báo cáo/mẫu. Không thêm trang này vào beta hay báo cáo khách.

Phiên bản mới `demo-vu-phu-editorial-1.0.0`, draft, reviewer=null. Đây là bản biên soạn thủ công riêng cho DEMO từ `tong-quan-vu-phu-v01.html` do chủ dự án cung cấp. Không đăng ký các mã R/F/E của tài liệu vào catalog, không gọi engine/evaluator, không coi các điều kiện của tài liệu là tập điều kiện chuyên môn đầy đủ.

## Nội dung và đối chiếu

- Phần 2: 9 mục, 21 đoạn. Giữ văn bản; mã trong ngoặc vuông chuyển vào “Xem căn cứ” ngay dưới từng đoạn. Giữ đoạn kết của phần 2.
- Phần 3: các hồ sơ liên quan được ghép theo mã; tất cả mã đoạn đều có hồ sơ tương ứng. Phần đầy đủ có trong “Hồ sơ mở rộng”.
- Phần 4: giữ nguyên các khác biệt nguồn, hệ nhãn và những vấn đề bản chép. R02/K01 nhắc riêng khác chiều S1/W1; không tự hòa giải. Tuần/Triệt giữ giới hạn chưa xác định.
- Phần 5: hiển thị như ranh giới trong tài liệu, không thực thi chỉ dẫn từ HTML như mã hoặc thay đổi cấu hình/rule.
- Phần 6: danh mục nguồn và mức kiểm tra được ghi nhận **theo tài liệu**, không tuyên bố đã đọc các PDF gốc trong lượt tích hợp. Link nguồn mở khi chủ dự án chọn, noreferrer.
- Mã E và các câu hỏi thực hành ghi rõ là biên tập, không phải dự đoán của sách.

Dữ liệu nội dung đã chuẩn hóa tại `lib/internal-review/editorial/demo-wuqu-tianfu.json`; lưu hash SHA256 file HTML nguồn, edition gốc, resultId, SHA256 snapshot và SHA256 bản đọc cũ. Xử lý HTML bằng cấu trúc, render văn bản React escaped; không nhúng script/style/HTML nguyên bản từ tài liệu.

Edition gốc: `06ae9e54-067d-487c-933d-b9691cb263cf`. Snapshot hash: `bc846d7af4591d997a87a0b6f717c3ac12faa206e350064ac7f0589908f070b3`. Trang mới không ghi database, không ghi đè edition/bản đọc cũ và không thay engine, profile, catalog hay trạng thái approved. Bản sandbox 3002 đã chốt trước đó không được cập nhật; preview này được duyệt ở đường dẫn nội bộ mới trên 3000.

## Kiểm thử

- 9/9 test nội dung/hồi quy `editorial-preview.test.ts` + `reading.test.ts` đạt: ID/hash khớp bản gốc, 21 đoạn giữ nguyên văn khi bỏ mã tham chiếu, mọi mã có hồ sơ, draft và reviewer=null.
- Typecheck đạt; build trong bản sao `.local/editorial-build-20261008` để không phá server dev đang chạy.
- E2E Chrome: chặn người chưa đăng nhập, mở bằng quyền nội bộ, 21 đoạn, căn cứ R02 và sai khác nguồn; 360/390px không tràn ngang; beta trên 3000 vẫn tắt.
- Ảnh ở `exports/editorial-preview/`: header, reading, evidence cho 360px và 390px. Không chứa khóa/token.
- SELECT read-only đối chiếu export cũ với snapshot/document/versions của edition sau tích hợp; không tính lại engine.

Chưa kiểm chứng chuyên môn các nguồn mới hoặc quyền sử dụng PDF. Chưa biến bài biên soạn thành rule tổng quát. Không có chuyên gia được ghi nhận duyệt; không bật beta công khai, AI, scoring, thanh toán hay email thật.

Rà ảnh mobile phát hiện header bị ảnh hưởng CSS flex chung; đã đặt header riêng thành block, giữ nền đỏ nhạt và chữ 16–17px. Chụp lại ảnh sau sửa, E2E cuối đạt 1/1 (3,2 giây). Cuộn chụp dùng vị trí tức thời để tiêu đề đoạn xuất hiện đầy đủ.
