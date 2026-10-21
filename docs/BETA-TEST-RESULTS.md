# Kiểm chứng beta — 2026-10-08

Trạng thái bàn giao: chuẩn bị chức năng, **BETA_ENABLED mặc định false**; không bật beta ở URL hiện hành, không mời người thật hoặc gửi email. Khi kiểm E2E, dùng production build bind loopback ở cổng 3002 với flag bật và dữ liệu DEMO riêng; cổng 3000 giữ flag tắt. Sau test tắt server 3002, dọn edition/grant/feedback DEMO và trả 3000 về dev với flag false. Không có khóa/token trong log bằng chứng.

## Kiểm tra đã chạy

- `node --env-file=.env node_modules/vitest/vitest.mjs run --exclude tests/database.test.ts`: **224/224 đạt**, 10 files, 14.83s. Gồm 13 ca beta và hồi quy engine/calendar/nội dung. Không chạy suite giao dịch worker/payment không thay đổi.
- Beta: default-off, edition chưa release, token một lần, quyền beta không cấp quyền đơn/nội bộ, hết hạn grant/report, thu hồi grant/report, phản hồi trước bắt đầu bị chặn, tab cũ không gắn nhầm báo cáo/người thử khi cookie thay đổi, section từ edition khác bị chặn, giả phiên bản bị từ chối, gửi đồng thời/idempotency, giới hạn spam, trigger bất biến edition/feedback, thiếu dữ kiện, bảo toàn báo cáo nguồn.
- CLI: prepare mẫu engine giả lập không release; grant không ghi invited_at; link chỉ vào file mới 0600, không có token trên stdout; revoke và delete dọn đúng phạm vi. File link tạm được xóa trong finally.
- `npm run typecheck`: đạt. `npm run build`: đạt.
- `BETA_E2E_ORIGIN=http://localhost:3002 npx playwright test tests/e2e/beta.spec.ts tests/e2e/beta-off.spec.ts`: **2/2 đạt**, 6.4s. 360/390px; label/checkbox, mở căn cứ, đánh dấu đoạn, phản hồi toàn bài, reload, fragment bị xóa, quyền revoked trả 401, quyền beta không vào internal; chủ nội bộ xem được phản hồi DEMO; mở bản chốt trong bảng nội bộ ở 360/390px không tràn ngang. Bản tắt không trả document qua trang/API.
- E2E so sánh số đơn/giao dịch và hash toàn bộ báo cáo trước/sau: không đổi. Dữ liệu beta kiểm thử được xóa theo UUID, không xóa dữ liệu khác.
- Ảnh đã xem `.local/reading-review/beta-feedback-360.png` và `beta-feedback-390.png`; không tràn ngang cấp trang. Nút nhãn tối thiểu 44px, không có khóa/token trên ảnh.

Logs: `evidence/beta-tests.txt`, `beta-typecheck.txt`, `beta-build.txt`, `beta-e2e.txt`.

## Vấn đề tìm thấy và xử lý

- Lượt đầu: bộ chọn phản hồi có tên truy cập chứa cả phần option nên locator exact không tìm được. Đặt aria-label rõ ràng “Phản hồi cho”; chạy lại đạt.
- Kiểm owner UI ban đầu điều hướng trước khi fetch đăng nhập hoàn tất. E2E được đồng bộ bằng chờ bộ chọn nội bộ trước điều hướng; không nới cơ chế xác thực.
- Ảnh mobile phát hiện CSS label chung làm checkbox nằm trên chữ và quá dài. Đặt flex row/vùng chạm 44px riêng cho beta; xem lại ảnh và chạy lại E2E đạt.
- Typecheck đầu gặp tệp `.next/types` mất trong lúc dev restart vì config thay đổi. Chạy typecheck/build trên trạng thái ổn định đã đạt; không sửa tsconfig để che lỗi.

## Phạm vi chưa kiểm chứng / cần quyết định

Chưa có người thật tham gia. Không có bằng chứng rằng nội dung dễ hiểu, hữu ích, đủ để bán hoặc dự đoán đúng. Chưa triển khai Internet, HTTPS/proxy/backup của môi trường phát hành chưa được nghiệm thu. Không tích hợp email/thanh toán/AI/scoring. Chưa đặt lịch purge; owner phải chốt và vận hành thời hạn lưu/xóa, quyền dữ liệu sinh và nội dung, danh sách mời và đầu mối hỗ trợ trước khi bật. Test phần mềm không thay kiểm duyệt chuyên môn hoặc quyết định phát hành.

Hướng dẫn đầy đủ, kịch bản và lời mời chưa gửi: [BETA-READING.md](BETA-READING.md).

Rà soát cuối bổ sung kiểm tra ngữ cảnh tab: reportId và mã người thử trong biểu mẫu phải khớp quyền hiện tại, không được dùng làm bằng chứng quyền truy cập. Thử cookie đổi sang báo cáo khác hoặc người khác cùng edition đều bị từ chối; không có phản hồi gắn nhầm.
