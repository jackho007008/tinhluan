# Vận hành và adapter

## PostgreSQL

Schema tại db/001_init.sql, migration có thể chạy lại. DB riêng cho demo và test. Không chạy tests/database.test.ts trên DB production: test tạo/xóa trigger mô phỏng lỗi và xử lý queue.

Mỗi Order chụp BirthProfileSnapshot, ChartSnapshot, OrderItem.package_snapshot, amount VND nguyên, scope groups/year/accessDays/scoring/interpretation. Catalog trong lib/config.ts, seed vào packages. Mã đơn chỉ hiển thị; quyền truy cập cần cookie/token.

## Payment

`PaymentProvider` tại lib/payments. Chỉ mock được triển khai. QR chứa chuỗi TUVI-DEMO, không phải VietQR/EMV có thể chuyển tiền. Không có tài khoản ngân hàng thật. /api/mock-pay kiểm tra session sở hữu đơn, chỉ dev, tạo sự kiện mock đã ký rồi qua cùng verifier và transaction handler. /api/webhook kiểm tra HMAC-SHA256 của raw body bằng x-mock-signature (giao thức demo riêng, không phải chữ ký của nhà cung cấp).

Đối chiếu orderId/code/amount/currency/recipient/status/expiry. Tiền thiếu/thừa hoặc sai nội dung vào mismatch, muộn vào late, không tạo job; xem events để xử lý hỗ trợ. Pending/failed không đảo paid. eventId và transactionId UNIQUE, khóa row order, insert transaction + cập nhật paid + report_jobs trong một transaction. Không chấp nhận callback browser làm thanh toán thật.

`npm run reconcile` khôi phục downstream jobs từ orders đã paid và tổng hợp sự kiện cần đối soát. Đây là đối soát nội bộ, không xác nhận giao dịch bị mất webhook tại ngân hàng. Trước tích hợp thật phải chọn provider, đọc tài liệu chính thức hiện hành, lưu version/URL, triển khai verify signature, query statement/status, recipient validation, idempotency key, refunds/manual handling và test sandbox. Không đoán API.

Production chặn tạo đơn demo, mock-pay và webhook mock bất kể DEMO_ENABLED. Không có nút bật thu thật qua biến môi trường. Cần code provider + xét duyệt phạm vi chuyên môn/giá trước mở bán.

## Queue / worker

Chạy process riêng `npm run worker`. PostgreSQL report_jobs là durable outbox/queue; không promise nền HTTP. SELECT FOR UPDATE SKIP LOCKED, giữ transaction trong quá trình tạo báo cáo; worker chết sẽ nhả lock/rollback để worker khác lấy. Snapshot đã tính nên worker không cần engine lại. Insert report UNIQUE(order_id), enqueue email cùng transaction. Retry tối đa 5 lượt, backoff 30*2^attempts giây. Nút thử lại có giới hạn 3/10 phút, không thu tiền lại.

Email delivery có queue riêng, template link vào fragment /recover#token để tránh access log URL. Local provider ghi file .local/mail/{deliveryId}.json (0700 directory/0600 file), ghi atomic qua rename, dùng ID ổn định nên không tạo nhiều file do webhook lặp. File có dữ liệu cá nhân/token, không commit hoặc public. Email local KHÔNG được gửi Internet. Demo không có inbox UI công khai; người vận hành mở file để thử magic link.

Production email provider chưa triển khai. Khi thêm provider thật, cần idempotency API theo deliveryId và cơ chế xử lý timeout sau khi provider nhận mail để tránh trùng gửi; không được hứa exactly-once với SMTP thường. Báo cáo vẫn tồn tại khi email lỗi.

## Truy cập và dữ liệu

Session/magic token 32 byte ngẫu nhiên, DB chỉ lưu SHA256; cookie HttpOnly/SameSite strict/Secure production. Link magic 15 phút, tiêu thụ một lần trong transaction, đổi ra session. Quyền gói kiểm tra server trên mỗi lần truy cập; session tối đa 30 ngày, phải xác thực email lại khi cần. Có expires/revoked fields. Thông tin sinh không nằm trong URL. No-store/noindex toàn site. Không logging payload/token/email trong app.

Request JSON <=20KB, origin exact với APP_ORIGIN, schema strict, limit theo action toàn cục và theo order/email cho resend/recover; bản thử nghiệm không tin X-Forwarded-For. Production cần reverse proxy body/time/rate limits theo IP đáng tin cậy, TLS, CSP phù hợp Next, observability chỉ mã lỗi không PII, encryption-at-rest và backup access policy.

## Lưu giữ / xóa

`npm run data:delete -- UUID` xóa toàn bộ dữ liệu đơn, tokens và file mail liên quan. `npm run data:purge` xóa đơn quá 90 ngày, rate limit hết hạn, mail local quá một ngày. Chưa cài cron: người vận hành phải thiết lập lịch dọn và chính sách pháp lý trước mở bán. Backup phải có vòng đời xóa riêng. Không dùng chính sách demo như chính sách pháp lý đã duyệt.

## Beta sau quyết định phát hành riêng

Migration 002 thêm bảng beta tách khỏi giao dịch; default BETA_ENABLED=false. Quy trình chuẩn bị, release riêng, token fragment một lần, thu hồi/xóa/purge và chính sách còn cần chốt: [BETA-READING.md](BETA-READING.md). Chưa có lịch purge tự động; owner phải bố trí và kiểm chứng trước mời thật. Draft khách mua hàng vẫn bị chặn; quyền beta không cấp quyền internal/order.

## Địa chỉ đăng nhập nội bộ

`APP_ORIGIN` phải là **một origin** (scheme + host + port), không phải danh sách URL. Nó cũng được dùng làm địa chỉ chính cho luồng khách và liên kết khôi phục. Khi cần đăng nhập nội bộ qua nhiều địa chỉ do chủ dự án kiểm soát, đặt `INTERNAL_REVIEW_ALLOWED_ORIGINS` thành danh sách origin bổ sung, phân cách bằng dấu phẩy. Ví dụ: `http://localhost:3000,https://review.example.test`. Không nhập đường dẫn `/internal`, wildcard, query hoặc thông tin đăng nhập trong URL. Khi đổi tunnel, cập nhật danh sách, bỏ địa chỉ cũ và khởi động lại server.

Danh sách bổ sung chỉ áp dụng POST đăng nhập/đăng xuất nội bộ; không mở quyền API khách, beta hoặc bỏ kiểm tra khóa. Redirect giữ đúng origin đã được kiểm tra, để cookie không bị chuyển sang một hostname khác. Cấu hình sai bị từ chối; không tin Host/X-Forwarded-Host để tự cho phép địa chỉ. Khóa không thay đổi. Beta vẫn cần quyết định phát hành riêng.

Chẩn đoán: HTTP 403 báo địa chỉ chưa được cấu hình; 429 báo giới hạn thử; sai khóa chuyển về trang `denied=1`. Không đưa khóa vào URL, screenshot hoặc log. Có thể phải tải lại trang sau khi sửa cấu hình. Phiên localhost và phiên tunnel là các cookie riêng.

### Xác minh sửa đăng nhập 08/10/2026

Phát hiện APP_ORIGIN trong cấu hình cục bộ chứa hai URL phân cách dấu phẩy, còn tiến trình dev đang override bằng localhost. Khóa hiện có được API chấp nhận trên localhost. Code cũ so Origin bằng một chuỗi APP_ORIGIN, nên origin khác bị 403 và UI chỉ hiển thị lỗi chung. Đây là lỗi cấu hình/đối chiếu origin đã xác định; không có bằng chứng khóa sai. Không xác định được origin của lần chụp màn hình từ ảnh đơn lẻ.

Đã chuẩn hóa cấu hình địa chỉ (không đổi secret), thêm danh sách cho phép rõ ràng cho đăng nhập/đăng xuất và thông báo 403 cụ thể. Kiểm tra sau sửa: API cho localhost và external origin đã cấu hình trả 303, cookie mở được /internal; origin ngoài danh sách trả 403 không cookie. Kiểm tra external origin dùng header gửi vào server cục bộ, chưa phải kiểm thử đường truyền tunnel Internet. Chrome/Playwright thực hiện đăng nhập và đăng xuất localhost thành công; /beta vẫn hiển thị chưa mở. Không tạo screenshot/trace chứa khóa. `npm test -- tests/internal-origin.test.ts tests/reading.test.ts`: 9/9 pass; `npm run typecheck`: pass. Không chạy lại toàn bộ build hoặc toàn bộ bộ test cho thay đổi nhỏ này.

### Sửa thông báo đăng nhập 09/10/2026

Database cục bộ không nhận kết nối (ECONNREFUSED); catch của internal-login đã trả nhầm mọi lỗi database thành 429. Bộ đếm lưu thực tế count=1 và đã hết hạn, không có bằng chứng vượt ngưỡng. Khởi động lại instance `.local/postgres` hiện có ở55439, không initdb/migrate/xóa bộ đếm. Khóa hiện có sau đó được API chấp nhận:303 về /internal, có cookie phiên (không xuất giá trị).

API nay chỉ trả429 khi RATE_LIMIT; lỗi dịch vụ trả503 và không cấp phiên. Form thông báo dịch vụ tạm không khả dụng. Giới hạn8lần/10phút, kiểm tra origin và khóa giữ nguyên. Không log chi tiết lỗi database hoặc bí mật. Test tập trung internal-login/internal-origin:3/3 đạt; typecheck đạt. Không chạy toàn bộ build/E2E cho bản sửa nhỏ này. PostgreSQL chưa có bằng chứng được cấu hình tự khởi động sau khi máy khởi động lại; nếu tái diễn cần kiểm tra tiến trình trước khi yêu cầu người dùng chờ10phút.

### Luồng khách qua tunnel — 09/10/2026

Lỗi “Nguồn yêu cầu không hợp lệ” ở bước lập lá số: tiến trình dev dùng APP_ORIGIN=localhost, trong khi người dùng truy cập URL ngrok. POST chart từ ngrok bị403 trước engine. Đăng nhập nội bộ có allowlist riêng không tự cấp quyền cho API khách.

`CUSTOMER_ALLOWED_ORIGINS` nay là danh sách origin bổ sung chính xác cho API khách (phân cách bằng dấu phẩy); APP_ORIGIN vẫn là địa chỉ chính để tạo liên kết. Chỉ thêm tunnel do chủ dự án cung cấp, không wildcard, không tin Host/Forwarded, không dùng INTERNAL_REVIEW_ALLOWED_ORIGINS thay danh sách khách. Cấu hình sai/path/credentials/query bị từ chối. Webhook vẫn dùng kiểm tra riêng; beta và quyền truy cập báo cáo không thay đổi. Khi tunnel đổi, xóa origin cũ và cập nhật origin mới, tải lại cấu hình/khởi động lại tiến trình nếu cần. Worker vẫn cần APP_ORIGIN phù hợp cho liên kết khôi phục; đợt sửa này không gửi email hoặc thay worker.

Xác minh bằng dữ liệu sinh giả lập: POST chart localhost200/12cung, origin ngrok vào server local200/12cung, **gọi trực tiếp HTTPS tunnel200/12cung**, origin lạ403. Không tạo đơn/giao dịch; không dùng dữ liệu thật. Unit customer-origin/internal-origin4/4 đạt; typecheck đạt. Chưa kiểm lại toàn luồng mua hoặc thao tác form trên tunnel bằng trình duyệt; xác minh ở API thực qua đường truyền tunnel. Không sửa engine hoặc nới giới hạn đăng nhập.
