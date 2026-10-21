# Trải nghiệm đọc và preview nội bộ — 2026-10-07

> Tài liệu lịch sử của preview 1.0.0. Bản hiện tại 2.0.0 đã đưa năm chú giải vào catalog/evaluator chung và có bộ chọn báo cáo; xem [audit cập nhật](UNIFIED-PREVIEW-AUDIT.md).

## Hai nơi đọc khác nhau

Báo cáo khách: API order chỉ trả phép chiếu `lib/reading/customer.ts`, component `components/CustomerReport.tsx` hiển thị Tổng quan và Sự nghiệp theo phạm vi gói. Không trả toàn bộ snapshot, trace, đường dẫn dữ liệu hoặc bản thảo. Thông báo trạng thái ở đầu báo cáo; các mục chưa hỗ trợ được gom riêng. Vị trí cung, chính tinh, trạng thái sao và tứ hóa được trình bày riêng. Giá trị trống ghi “Không ghi nhận trong dữ liệu”, không diễn đạt thành không có.

Báo cáo cũ vẫn đọc từ dữ liệu đã lưu, không chạy lại engine, không ghi đè báo cáo và không đánh giá lại rules. Phép chiếu thay đổi cách trình bày, không thay đổi nội dung trong database. Nhận định đã lưu (nếu có) giữ nguyên; hiện chưa có nhận định chuyên môn được duyệt.

Trang `/internal` đọc đơn được chọn bằng `INTERNAL_REVIEW_ORDER_ID` trên server. Đăng nhập bằng `INTERNAL_REVIEW_KEY` tối thiểu 32 ký tự, không có mật khẩu mặc định. Cookie ký HMAC, HttpOnly, SameSite Strict, hết hạn một giờ, Secure ở production; kiểm tra origin, giới hạn request và kích thước form. Đổi khóa thu hồi mọi phiên. Quyền đọc đơn hàng không cấp quyền nội bộ. Không cache/index. Không đưa mã đơn, khóa hoặc thông tin sinh vào URL truy cập.

Đặt khóa trong `.env`, khởi động lại server khi đổi cấu hình. Khóa không được ghi vào tài liệu hoặc gửi qua URL. Trang nội bộ có đăng xuất, bảng căn cứ và mục mở rộng giữ nguyên snapshot, rule ID, phiên bản, evidence paths, trace và trạng thái duyệt.

## Đối chiếu lá số thực tế

Đã đọc báo cáo mới nhất do người dùng tạo trước khi thay đổi, không lấy ảnh làm dữ liệu tính toán. Dữ liệu lưu khớp: Mệnh Tý có Vũ Khúc, Thiên Phủ; Thân cư Quan Lộc tại Thìn có Tử Vi, Thiên Tướng. Nhãn đã lưu: Vũ Khúc Vượng/Hóa Kỵ, Thiên Phủ Miếu; Tử Vi Đắc/Hóa Quyền, Thiên Tướng Đắc. Trống tứ hóa của từng sao không được coi là chứng minh không có tứ hóa.

Báo cáo này được ghim bằng cấu hình cục bộ; không tự chọn báo cáo mới nhất mỗi lần tải vì test có thể tạo đơn mới. Dấu kiểm tra bất biến lưu riêng dưới `.local/reading-review`, không đưa dữ liệu cá nhân vào source phân phối.

## Phạm vi nội dung

Có **5 chú giải biên tập dự thảo**, không phải 5 rules approved mới. Bốn chú giải biểu tượng sao và một chú giải Thân cư Quan Lộc chỉ xuất khi dữ kiện tương ứng có trong báo cáo lưu. Không thêm scoring, gọi AI hoặc thay catalog duyệt.

Bảng từng nhận định → dữ kiện → nguồn và vị trí → điều kiện → phần còn thiếu được triển khai trực tiếp tại `/internal#claim-map`; “Xem căn cứ” của từng chủ đề có thêm điều chỉnh. Mã và nội dung nằm ở `lib/internal-review/preview.ts`, phiên bản `reading-preview-1.0.0`.

- Vũ Khúc: biểu tượng về tài/quả quyết; cần quy tắc đầy đủ cho Hóa Kỵ, không suy thu nhập hoặc mất tiền.
- Thiên Phủ: hình tượng kho; chưa đủ điều kiện phụ tá, Không Vong; không ghép thành kết luận Vũ Phủ tại Tý.
- Tử Vi: hình tượng đế tọa/phụ tá; Hóa Quyền không tự trở thành lời hứa chức vụ.
- Thiên Tướng: hình tượng ấn/phụ tá; không ghép thành kết luận Tử Tướng tại Thìn.
- Thân cư Quan Lộc: chú giải hiện đại của tác giả iztro về cách hoàn thành công việc; không đủ để kết luận toàn bộ con người hoặc kết quả sự nghiệp.

Các giới hạn cụ thể được giữ trong từng dòng, không giả tạo ngoại lệ chuyên môn. Chưa có bản in đối chiếu, chuẩn hóa thuật ngữ giữa trường phái, quyền sử dụng bản dịch hay người duyệt. Nội dung chỉ để đọc thử và kiểm duyệt nội bộ, không bán.

## Khác biệt chưa giải quyết

Toàn Thư quyển hai, mục `定十二宮星辰落閒`, ghi Tử Vi tại Tý/Thìn/Hợi và Thiên Tướng tại Thìn/Tuất thuộc nhàn cung; báo cáo lưu ghi hai sao tại Thìn là Đắc. Chưa xác định hai hệ phân loại có cùng nghĩa/phạm vi. Không thay nhãn engine, không chọn một bên làm kết luận và không tính điểm.

## Thử nghiệm

Các fixture tự dựng trong `tests/reading.test.ts` chỉ kiểm tra trình bày và cổng xuất chú giải; không phải fixture xác nhận an sao độc lập. Kiểm thử bảo vệ nội bộ, dữ liệu thiếu, cấm lộ kỹ thuật trong phép chiếu, bất biến đối tượng và mobile được ghi ở `docs/READING-TEST-RESULTS.md`.
