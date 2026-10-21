> Audit lịch sử giai đoạn đầu; nhận định thiếu file chỉ áp dụng thời điểm đó. ZIP và ảnh đã được bổ sung và audit ngày 07/10/2026: xem [ENGINE-AUDIT.md](ENGINE-AUDIT.md).

# Audit đầu vào — 2026-10-07

Workspace có khung Next.js, TypeScript strict, cấu hình màu/gói, schema SQL và hàm chuẩn hóa ban đầu. Không tìm thấy AGENTS.md tại project hoặc các thư mục cha đã kiểm tra. Không có Git metadata. Không có ảnh mockup, ảnh biểu đồ hay huyenhoc-engine-v0.1.zip trong workspace. Không tuyên bố đã đọc/test ZIP đó.

node_modules có nhiều package chưa được khai báo và một số tệp chưa đầy đủ; đã khai báo dependency chính xác, tạo package-lock.json, cài lại các package lỗi và cập nhật bản vá. Giữ Next.js/PostgreSQL thay vì thay stack. Dùng SQL tham số hóa với pg, không ORM: transaction và SKIP LOCKED được thể hiện trực tiếp, không cần một lớp ORM chỉ cho demo.

Đã đọc README, LICENSE, lib/astro/astro.js, astro.d.ts của iztro 2.6.1, cùng tài liệu chính thức https://docs.iztro.com/quick-start. Package phân phối không kèm test upstream; các test trong repo này là test adapter/phần mềm, không phải chạy toàn bộ test upstream.

Phát hiện: byLunar đổi về dương rồi gọi bySolar; bySolar và các hàm sao/cung lại gọi lunar-lite bên trong. withOptions có thể đổi global config; ngôn ngữ cũng là global. Adapter chạy node process riêng mỗi yêu cầu, cấu hình tường minh và trả DTO đã chọn. Không sử dụng AI trong tính toán.

## Phạm vi được mở

- Dương lịch 1900–2099, giờ/phút cụ thể, nam/nữ theo engine.
- Asia/Ho_Chi_Minh: ngày giờ dân sự do người dùng khai báo. Nơi sinh chỉ là thông tin xác nhận, không geocode, không tự suy múi giờ.
- Chỉ cn-reference, có opt-in và cảnh báo. Không hiệu chỉnh múi giờ lịch sử/giờ mặt trời. Không công bố là lịch Việt Nam.
- Chưa rõ giờ, âm lịch, múi giờ khác và vn-unavailable đều bị chặn, không fallback.

## Lịch Việt Nam chưa hoàn thiện

Không có triển khai lịch Việt Nam được kiểm chứng trong đầu vào. Nguồn nghiên cứu cần đánh giá tiếp: Hồ Ngọc Đức, https://www.informatik.uni-leipzig.de/~duc/amlich/ (công cụ web không đọc được nguồn này trong phiên; chưa dùng làm công thức). Cần đọc quyền sử dụng, nguồn thiên văn, new moon/solar longitude, múi giờ lịch sử, leap-month và kiểm tra tất cả lần chuyển lịch nội bộ. Không thay nhãn hoặc chỉ đổi UTC offset để giả là hoàn thiện.

## Không được mở bán

Chưa có bộ rules chuyên môn, scoring hay ca expert review. Giá chỉ demo. Không có nhà cung cấp thanh toán/email thật được cấu hình. Adapter mock không mô phỏng API của một ngân hàng/nhà cung cấp cụ thể. Chưa tích hợp API thanh toán thật, do đó chưa tuyên bố đã kiểm tra chữ ký nhà cung cấp nào.
