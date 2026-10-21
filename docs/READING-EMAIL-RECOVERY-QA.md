# Khôi phục quyền đọc/PDF qua email — QA, 18/10/2026

## Kết quả và đường thử

Đã nối luồng xác minh email và khôi phục bản đã lưu bằng hộp thư test cục bộ. **Chưa nghiệm thu gửi/nhận email thật hoặc HTTPS. Không gửi thư tới khách.**

- [Tự lập bản đọc trên QA3070](http://127.0.0.1:3070/lap-la-so).
- [Yêu cầu liên kết mở lại](http://127.0.0.1:3070/recover?reading=1).
- [Bản đọc trong phiên](http://127.0.0.1:3070/ban-doc).

QA3070 có database và kho dùng thử riêng, không phải bản thay thế QA3062/3055. Không di chuyển dữ liệu lịch sử hay tự gắn email cho các bản cũ. Phiên thử mới không cần khóa nội bộ. Bản trình bày/nội dung giữ 1.47.0, catalog 1.45.0; thay đổi lần này chỉ là khôi phục quyền và giao diện liên quan.

### Cách thử trên máy chủ

1. Lập một bản đọc trên QA3070. Mở **Mở lại bản đọc qua email**, nhập email thử và gửi xác minh.
2. Worker ghi thư vào thư mục riêng `.local/reading-recovery-20261018/mail/`. Chủ máy mở tệp JSON mới nhất bằng trình soạn thảo để lấy trường `link`; đây là hộp thư local, không phải thư đã tới nhà cung cấp. Không đưa thư mục này lên web, không ghi nội dung link/token vào log hoặc gửi trong bàn giao.
3. Mở link ở trình duyệt/phiên khác. Trang mở ra chưa tiêu thụ token; bấm **Tiếp tục** mới xác minh email, cấp cookie đọc và mở bản đã lưu.
4. Sau khi mất phiên, vào trang yêu cầu mở lại, nhập email đã xác minh; lấy thư mới từ hộp thư local rồi bấm Tiếp tục. Có thể mở bản vừa khôi phục từ mục Hồ sơ và tải PDF toàn bài.
5. Bản miễn phí hết hạn theo phiên gốc (7 ngày); liên kết tối đa 15 phút và không vượt hạn quyền. Mỗi cookie khôi phục chỉ mang quyền một bản/đơn. Mở liên kết bản khác thay cookie này; để mở lại bản trước có thể yêu cầu thư mới. Không mở rộng quyền sang toàn bộ bản của chủ phiên.

Các link có ID mẫu trong bằng chứng không cấp quyền. Đơn mẫu đã bị thu hồi grant ở cuối ca kiểm; không mong đợi link đơn đó tiếp tục mở được.

## Những phần được tái sử dụng

- Lấy đúng artifact từ `trial/store` hoặc `order_reading_bindings`/`reports`; nhánh đơn dùng hash và grant `customer-order` hiện có. Không chạy engine/catalog khi gửi thư, đổi token, đọc hoặc tải PDF.
- Dùng bảng `access_tokens` cho hash của token `reading-magic` và `reading-session`, bảng `email_deliveries` cùng worker/retry hiện có. Migration007 chỉ bổ sung liên kết email–artifact và cột tham chiếu; không tạo bộ báo cáo, hệ mật khẩu hoặc queue thứ hai.
- Provider `localEmail` vẫn chỉ ghi file. Production build chỉ được ghi hộp thư QA khi bật cờ riêng, provider=local và database loopback. Mặc định tính năng khôi phục và cờ hộp thư production đều tắt.
- PDF đi qua bộ dựng hiện tại và trang in có kiểm quyền; đối chiếu toàn văn/phiên bản ngay trước xuất như luồng cũ.

## Quyền và giới hạn

- Gắn email cần cookie của phiên đang sở hữu đúng bản; với đơn cần đã paid, ready và grant chưa thu hồi/hết hạn. Email + ID không cấp quyền. Người đang chỉ có cookie khôi phục không được gắn email mới thay chủ phiên.
- Email chuẩn hóa; chỉ được dùng để gửi lại sau khi token xác minh đã đổi thành công. Link ngẫu nhiên 256 bit, DB chỉ lưu hash; kiểm hạn, thu hồi, lock hàng token và tiêu thụ trong transaction. Hai lượt đổi đồng thời chỉ một lượt thành công.
- Trước mỗi lần đọc/tải phải kiểm lại binding và quyền gốc; thu hồi binding chặn khôi phục về sau. Thu hồi token phiên chặn phiên đó; thu hồi grant đơn gốc chặn cả các phiên khôi phục. Đơn chưa giao không được nâng quyền bằng email.
- Token ở fragment, được xóa khỏi thanh địa chỉ; GET không đổi quyền. Nhận cả link mở mới và link đến ngay tab khôi phục đang mở. POST kiểm origin/content-type/giới hạn body, cookie HttpOnly/SameSite; Secure trên origin HTTPS được cho phép.
- Yêu cầu gửi lại dùng cùng thông báo 202 cho email có/không có bản đủ điều kiện, không trả link/token trong JSON. Giới hạn 3 yêu cầu/10 phút theo email; gắn email còn giới hạn theo chủ phiên, có trần gửi và đổi token toàn cục. Không tự tin cậy IP do khách khai trong header.
- Thư lỗi dùng queue `retry`, tăng attempts và lỗi chung `EMAIL_FAILED`; khi lỗi transaction không để token mới có hiệu lực. Bấm gửi lại hoặc worker retry không sinh lại báo cáo, không kéo dài quyền. Local mailbox là nơi duy nhất ngoài trình duyệt chứa link thô, phục vụ test.
- Email xác minh là tác vụ liên kết quyền, không đổi trạng thái email giao báo cáo ban đầu của đơn thành “đã gửi”. Admin chưa có màn quản lý binding hay thu hồi qua giao diện trong gói này.

## Kiểm chứng thực chạy

Bốn file liên quan: `reading-recovery`, `public-trial`, `public-trial-pdf`, `core-orders`.

- Lượt đầu: **23/23 đạt, 4/4 file**. Chạy lại sau điều chỉnh migration/điều hướng: **23/23 đạt, 4/4 file**, không skip. Bao gồm sai/thiếu quyền, email chưa xác minh, chặn đọc/PDF chéo, token dùng lại/hết hạn, binding/session/order grant bị thu hồi, giữ hạn gốc, request giới hạn/origin và lỗi provider rồi retry.
- Typecheck đạt trên mã cuối. Production build đạt; có cảnh báo Next về nhiều lockfile do checkout QA nằm dưới repo, không có lỗi compile/typecheck.
- Chrome headless, các context độc lập không có cookie nội bộ: tạo hai hồ sơ bằng form thật; xác minh, tải lại đúng 22 đoạn; gửi lại khi mất phiên; mở bản đã khôi phục từ Hồ sơ; tải PDF; truy cập chéo và POST nội bộ bị chặn. Có ca đơn mock dùng luồng paid → worker → frozen hiện có, không có giao dịch SePay hoặc chuyển tiền thật.
- Mobile 360/390px: form email, liên kết, nút Tiếp tục, mục Hồ sơ và nút PDF; đo không tràn ngang, ảnh đã xem. Không có pageerror trong lượt đạt.
- PDF bản miễn phí và PDF qua quyền đơn đều 9 trang, đủ 22 đoạn bản lưu khi trích chữ; xem ảnh đủ trang, không phát hiện mất dấu/cắt chữ/trang trắng bất thường. Hai tệp cùng artifact có chủ ý để kiểm hai đường phân quyền, không tính là hai lá số khác nhau.
- So record trước/sau luồng giữ nguyên; đơn vẫn một report. 54 tệp engine/calendar/interpretation-rules so với checkout QA3062 cũ cùng hash. Không chạy toàn gate nội dung, không xuất bộ PDF hay hash toàn kho lịch sử.

### Các lỗi lượt đầu và cách xử lý

1. Phép kiểm khách gọi **GET** `/api/internal-readings` kỳ vọng 401 nhưng actual405 vì API không hỗ trợ GET. Sửa ca kiểm sang **POST** đúng phương thức, vẫn yêu cầu 401; không thay code quyền.
2. Selector nút PDF dùng tên “Tải PDF”, khác accessible name “Tải PDF toàn bộ bản đọc”; timeout chờ download. Sửa selector, không thay assertion PDF hay nới thời gian để che lỗi. Lượt này chưa chứng minh tải PDF.
3. **Lỗi ứng dụng mới:** nhận link có fragment trong cùng tab khôi phục không remount, nên token chưa được nhận. Thêm xử lý `hashchange`, vẫn chỉ đổi token khi bấm Tiếp tục. Lượt chạy sau đã thực hiện đúng ca gây lỗi, cả 360/390px và tải PDF.
4. Khi xem ảnh, nút email chưa dùng style nút chung. Đã dùng class hiện hành, kiểm lại ảnh. Bổ sung điều hướng Hồ sơ cho cookie khôi phục và ẩn Sửa thông tin khi chỉ có quyền đọc, tránh dẫn tới form không có quyền sửa.

Không dùng một ca chạy lại để gọi lượt lỗi đầu là đạt. Log từng lượt được giữ trong thư mục bằng chứng.

## Cấu hình, vận hành QA và điểm còn thiếu

Cấu hình hiện hữu được đọc bằng trạng thái có/không, không in secret: provider là `local`, chưa có EMAIL_FROM/SMTP/Resend được cấu hình trong những biến đã kiểm. Chỉ có implementation local trong code, không suy việc có tài khoản email ở nơi khác thành đã tích hợp provider.

QA3070 bật riêng `READING_RECOVERY_ENABLED`, `QA_LOCAL_MAIL_ENABLED`, `EMAIL_PROVIDER=local`, `RECOVERY_ORIGIN=http://127.0.0.1:3070`, `LOCAL_MAIL_DIR` ngoài public. Live/SePay trên QA riêng đều tắt. File `.env` và QA cũ không bị đổi.

Runtime nội bộ: `.local/reading-recovery-20261018/runtime.mjs`. Dùng `node --env-file=.env .../runtime.mjs build`, `start`, `worker`; chỉ `init` khi cần một database QA mới. Server/worker đang chạy; không chạy start thêm lần nữa khi cổng còn được sử dụng. Migration007 đã áp vào database QA riêng, đã đưa vào `scripts/migrate.ts` cho lần triển khai có chủ đích sau này.

**Còn thiếu để nghiệm thu email thật:** chọn/tích hợp provider thật, địa chỉ/domain gửi được xác minh, cấu hình server và HTTPS ổn định; chạy gửi–nhận tới hộp thư thử được cho phép. Không thực hiện các việc đó hoặc gửi email thật trong lượt này. Chưa triển khai khôi phục tài liệu đã hết hạn/bị xóa, tài khoản/mật khẩu, admin thao tác quyền, hoặc gửi thư đại trà. Hộp thư local cần chủ máy quản lý/xóa sau QA; không phải dịch vụ email công khai.

## Tệp và bằng chứng

Mã thay đổi: migration007 và runner migration; `lib/trial/recovery.ts`; `lib/jobs.ts`; `lib/notifications/index.ts`; loại identity trong `lib/internal-review/customer-pdf.ts`; API trial recovery/read/PDF/order; trang `recover`, `ban-doc`, `don-thu`, `lap-la-so`; component `ReadingRecovery`, `ReadingEmailAccess`, `ReferenceCustomerReading`, `ReferenceBirthForm`; CSS riêng cho form email; `.env.example`; test `reading-recovery.test.ts`. Engine/catalog và bộ dựng nội dung không đổi.

Thư mục `.local/reading-recovery-20261018/` chứa `tests-acceptance.log`, `typecheck-final.log`, `build-acceptance.log`, `browser-acceptance.log`, `browser-results.json`, ảnh mobile, `pdf-check/results.json`, hai PDF và so sánh code được bảo vệ. Không đính kèm thư mục `mail` vào gói bằng chứng gửi ra ngoài.

Đạt luồng QA với hộp thư local; chưa đạt gửi/nhận email thật. Dừng tại đây, không bật Live hoặc phát hành email tới khách.
