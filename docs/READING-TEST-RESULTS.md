# Nghiệm thu trải nghiệm đọc — 2026-10-07

- `npm test`: **129/129 passed**, 5 files, 5.88s. Gồm 5 test mới cho phép chiếu khách, phân biệt thiếu dữ liệu, báo cáo cũ, cổng chú giải nội bộ và token nội bộ hết hạn/giả mạo.
- `npm run test:e2e`: **6/6 passed**, 46.2s. Luồng mua demo 360/390px, tải lại đơn, worker, email magic link và replay, quyền đơn hàng, legacy presentation; đăng nhập nội bộ, căn cứ, bảng 5 dòng, dữ liệu kỹ thuật và đăng xuất. Kiểm tra API khách không chứa snapshot/trace/đường dẫn nội bộ. Không tràn ngang 360/390px.
- `npm run typecheck`: passed.
- `npm run build`: passed; build cuối sau chỉnh UI được lưu trong `docs/evidence/reading-build.txt`.
- Kiểm tra ảnh chụp bằng mắt: phần dữ kiện, nội dung dự thảo, căn cứ trên mobile. Ảnh nằm riêng `.local/reading-review`, không đóng gói dữ liệu người dùng vào source.
- Hash báo cáo gốc trước/sau thay đổi: trùng khớp. 18 tệp engine/calendar/provenance/rules/payment/storage/report/worker đối chiếu bản source trước: không thay đổi. Database không có migration mới.

Lần E2E đầu: 5 đạt, 1 lỗi đăng nhập form vì kiểm tra Origin không tương thích POST điều hướng với chính sách no-referrer. Đã sửa thành POST fetch cùng nguồn, giữ kiểm tra Origin; lần đầy đủ kế tiếp 6/6 đạt. Không nới xác thực để vượt test.

Các kiểm thử này xác nhận hành vi phần mềm/trình bày. Không phải chuyên gia xác nhận an sao, nội dung cổ thư hoặc hiệu lực dự đoán. Fixture tổng hợp kiểm tra 5 chú giải được đánh dấu rõ trong tests; không dùng làm dữ liệu đối chiếu độc lập.

Sau chỉnh cỡ chữ các dòng sao lên 16px, chạy lại 3 ca mobile 360/390px và internal preview: cả 3 đạt (log `docs/evidence/reading-mobile.txt`). Kiểm tra ảnh cho thấy nội dung không tràn ngang; bảng căn cứ có vùng cuộn riêng.
