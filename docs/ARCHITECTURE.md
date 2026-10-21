# Kiến trúc Tinh Luận hiện hành

Đối chiếu tĩnh ngày 20/10/2026 tại `/Volumes/DATA/TINHLUAN`. Không chạy ứng dụng hoặc truy vấn DB trong phiên tài liệu. [Trạng thái](CURRENT_STATUS.md), [quyền/phạm vi](BUSINESS_RULES.md), [kiểm thử](TESTING.md). [INTERPRETATION-ARCHITECTURE](INTERPRETATION-ARCHITECTURE.md) là thiết kế lịch sử 07/10, giữ để tra nguồn gốc; các con số catalog và đường giao hàng trong đó không mô tả đầy đủ luồng khách hiện nay.

## 1. Nhận diện mã, không chỉ số phiên bản

`git rev-parse --show-toplevel` trả “not a git repository”; root không có `.git`. Không có HEAD/commit hoặc trạng thái tracked/untracked để báo. Không khởi tạo Git trong task này. Không thể kết luận “working tree sạch” hay xác định mọi thay đổi chưa commit.

So byte bốn file root với `.local/family-scope-20261020/qa` đều giống nhau; SHA-256 root:

- [customer-report.ts](../lib/internal-review/customer-report.ts): `0017ec33942f8573baf5aa6f22e0548c2eefeeff9d95b1c4757e081c13f71e33`.
- [catalog.ts](../lib/interpretation-rules/catalog.ts): `0a3ee2ff1fc1397de2366a7a31c4e8e41a70dba741cf20c6ce74082fa685e1f6`.
- [reading-access.ts](../lib/trial/reading-access.ts): `10d688f3673a3241177f17dd38eaaa1e7c6dc2de4868098cdb4ed692acb0864b`.
- [jobs.ts](../lib/jobs.ts): `db6ace802bb10c54e3ccc2ef99cbd730afc0fe0d0aaeac8cf2086353f55ed6f5`.

Đây là đối chiếu có giới hạn, không phải hash toàn checkout hay bằng chứng process đang nạp chính các byte đó. Runtime/bản public đã được nghiệm thu ở [lô gần nhất](../.local/family-scope-20261020/public-acceptance.json); phiên này không tái kiểm HTTP/PID/tunnel.

## 2. Luồng tạo và đọc bản lưu

1. `/lap-la-so` dùng [customer-form.ts](../lib/customer-form.ts), `validateBirthForm`; POST [trial/readings](../app/api/trial/readings/route.ts) kiểm origin/session, input, ID chống trùng, giới hạn tần suất và tải đồng thời.
2. `prepareCustomerBirth` trong [customer-input.ts](../lib/internal-review/customer-input.ts) chuyển đầu vào sang quy ước engine. [dynamic-reading.ts](../lib/internal-review/dynamic-reading.ts) `calculateInternal` gọi `calculate` từ `lib/tuvi-engine`, kiểm tính toàn vẹn, tạo receipt/hash chứng nhận danh sách sao. Receipt không chứng minh độ đúng dự đoán.
3. `freezeReading` gọi [buildTanBienReading](../lib/internal-review/tanbien-reading.ts), các facts/rules/trace trong [derived.ts](../lib/interpretation-rules/derived.ts), [execute.ts](../lib/interpretation-rules/execute.ts) (`executeRules`), catalog và module chuyên đề. [continuous-report.ts](../lib/internal-review/continuous-report.ts) tổ chức nội dung; `buildCustomerReport` dùng văn/quan hệ đã đặc tả, không gọi AI tự luận theo khách.
4. `captureReadingPolicy` ghi policy và nhóm miễn phí **vào bản mới**; `saveTrialReading` lưu snapshot + receipt + frozen + inputReceipt + accessPolicy. `linkCreatedReading` chỉ liên kết từ phiên sở hữu vào Google user đã xác thực.
5. Mở lại qua [API đọc](../app/api/trial/readings/[id]/route.ts) và `/ban-doc`: `customerReadingAccess` giải quyền sở hữu, order/grant nếu có rồi `projectReading`. Bản không policy mới giữ hợp đồng legacy nhưng vẫn cần sở hữu. Có quyền sở hữu chưa đồng nghĩa full scope.
6. [CustomerReading](../components/CustomerReading.tsx), [ReferenceCustomerReading](../components/ReferenceCustomerReading.tsx) dùng bản lưu/phần chiếu được phép. Không tái tính catalog khi tải lại. Không thể chỉ kiểm UI: API, print, căn cứ cũng phải dùng cùng hợp đồng quyền.

## 3. Kho file và PostgreSQL

- [reading-store.ts](../lib/internal-review/reading-store.ts): `InternalReading`, `getReading`, `saveReading`; `INTERNAL_READING_DIR`, mặc định `.local/internal-readings/<id>.json`. Ghi mới bằng file tạm/link, không overwrite bản cũ.
- [trial/store.ts](../lib/trial/store.ts): `TRIAL_READING_DIR`, mặc định `.local/trial-readings`; `sessions/<ownerHash>.json`, `readings/<ownerHash>/<id>.json`. Token phiên không lưu nguyên văn. `TRIAL_TTL` hiện 7 ngày; không suy đây là hạn thương mại.
- Kho QA chính theo runtime đã bàn giao: `.local/customer-ui-approved-20261015/qa/.local/internal-readings` và `.../trial-readings`. Tên thư mục cũ không xác định phiên bản code đang phục vụ. Không cộng mirror/archive thành hồ sơ riêng.
- [db.ts](../lib/db.ts): pool PostgreSQL từ `DATABASE_URL`, `transaction`, rate limits. Có fallback localhost; phải chủ động cấu hình DB test riêng, không dựa fallback.
- [001](../db/001_init.sql): snapshots, orders/items, payment events/transactions, report jobs, reports, email deliveries, access tokens, rate limits. [003](../db/003_order_readings.sql): binding đơn → bản frozen/hash. [004](../db/004_sepay_test.sql)/[005](../db/005_sepay_reconcile.sql): Test enrollment/events, identity aliases, issues, checkpoint.
- [006](../db/006_encyclopedia.sql): nháp và published versions Toàn thư. [007](../db/007_reading_recovery.sql): recovery bindings và mở rộng queue/token. [008](../db/008_customer_accounts.sql): users, provider identities, sessions/OAuth flows, reading links. [009](../db/009_test_checkout.sql): checkout gắn user. [010](../db/010_admin_operations.sql): admin roles, audit actor, operations events/metadata. [002](../db/002_beta.sql) giữ cấu trúc beta cũ; không mặc định là kho phục vụ luồng mới.
- Backup cần DB **và** kho file đúng môi trường; xem [BETA-DEPLOYMENT](BETA-DEPLOYMENT.md), không lặp quy trình restore ở đây. Các tệp evidence cục bộ không thay dữ liệu vận hành.

## 4. Danh tính, quyền, recovery

[accounts.ts](../lib/customer-auth/accounts.ts): `loginVerifiedGoogle`, `customerSession`, `linkAvailableReadings`, `accountReading`, `linkCreatedReading`. Identity dựa provider subject, không merge theo email. [Google adapter](../lib/customer-auth/google.ts) xử lý OAuth; login không tự gia hạn grant.

[recovery.ts](../lib/trial/recovery.ts): `bindRecoveryEmail` yêu cầu quyền có sẵn; `requestRecovery` phản hồi chung; `deliverRecoveryEmail` qua queue; `exchangeReadingToken` đổi token một lần sau thao tác tiếp tục; `resolveTrialReading`/`resolveReadingOrder` dùng chung trial/recovery/customer identity. Không biến liên kết email thành quyền mới vô thời hạn.

[reading-access.ts](../lib/trial/reading-access.ts) kiểm cả binding hash, hạn/thu hồi/delivery; [reading-policy.ts](../lib/trial/reading-policy.ts) `projectReading` không trả lời khóa. [admin/auth.ts](../lib/admin/auth.ts) `adminIdentity`/`requireAdmin` kiểm Google session và `admin_roles` chưa thu hồi mỗi request. Admin G5 khác khóa nội bộ legacy; Google khách không tự là admin. Trang/API CMS phải kiểm riêng quyền, không chỉ middleware.

## 5. Đơn, payment và worker

[checkout/test.ts](../lib/checkout/test.ts): `testOffer`, `allowedCheckoutUser`, `createCheckout`, `checkoutOrder`; cấu hình offer có phiên bản phía server và allowlist QA. [order-readings.ts](../lib/order-readings.ts): `insertFrozenOrder`, `deliverBoundReading`, `readingHash`. Giao **đúng bản frozen**, không tạo lại nội dung mới khi catalog đổi.

[sepay-test.ts](../lib/payments/sepay-test.ts) `receiveSePayTest`/`settleSePayTest` và [sepay-reconcile.ts](../lib/payments/sepay-reconcile.ts) `apiNotice`/`reconcileSePayTest` nối validation/chống trùng. Không coi ID webhook và API là một định dạng; lưu alias nhận diện. Giao dịch không khớp có issue, không tự paid. Dùng lại [payments/index.ts](../lib/payments/index.ts).

[scripts/worker.ts](../scripts/worker.ts) gọi `runReportJob` và `runEmailJob` trong [jobs.ts](../lib/jobs.ts); PostgreSQL queue `FOR UPDATE SKIP LOCKED`, savepoint và retry có backoff. **Hai nhánh phải phân biệt:** có binding thì `deliverBoundReading` giao nguyên bản; đơn legacy không binding còn gọi `buildReport` từ chart snapshot. Vì vậy không tuyên bố mọi đường worker trong toàn code đều không dựng báo cáo. Task mới không được chuyển đơn G4 sang nhánh legacy.

[notifications/index.ts](../lib/notifications/index.ts) chọn provider. [gmail.ts](../lib/notifications/gmail.ts) `gmailQaConfig`/`gmailEmail`: SMTP587 bắt buộc TLS, Gmail sender trùng tài khoản, recipient bị ghim, origin HTTPS; lỗi an toàn. SMTP accepted khác inbox received. Một worker chính, server/worker chung đích DB/kho/cấu hình; không tự bật thêm worker QA3070.

## 6. PDF, Toàn thư, vận hành

[customer-pdf.ts](../lib/internal-review/customer-pdf.ts) `renderStoredCustomerPdf`: Chrome headless qua `playwright-core`, `CUSTOMER_PDF_ORIGIN` loopback; cookie quyền chỉ ở context server, không đưa ra URL. Mở print route được cấp quyền, kiểm phiên bản và toàn văn paragraph khớp frozen trước `page.pdf`; chọn paginator theo phiên bản. [API PDF](../app/api/trial/readings/[id]/report-pdf/route.ts) kiểm quyền trước render. Không gọi catalog lại. PDF không là dịch vụ độc lập; cần Chrome/font và web tương ứng.

[encyclopedia/model.ts](../lib/encyclopedia/model.ts): `mutateArticle` quản lý draft/publish/hide có actor; `getPublished`/`listPublished` chỉ đọc published visible. [related.ts](../lib/encyclopedia/related.ts) chỉ link bài công khai hợp lệ. Bài public là phiên bản xuất bản, sửa draft không thay public ngay.

[admin/events.ts](../lib/admin/events.ts), [operations.ts](../lib/admin/operations.ts), [extended.ts](../lib/admin/extended.ts): lỗi report/email/PDF bền vững từ lúc triển khai; không bịa lịch sử chưa ghi. Dashboard Test/Live tách riêng; webhook attempts không phải số giao dịch được chấp nhận.

Next15/React19, PostgreSQL, Chrome, Google OAuth, SePay Test, Gmail QA; ngrok hiện là tunnel, chưa phải production ổn định. [package.json](../package.json) là nguồn dependency/lệnh; runtime QA trong `.local/family-scope-20261020/` kế thừa cấu hình G5. Không đọc/in secrets để viết tài liệu. Không xác minh lại mạng ngoài hoặc cấu hình bí mật trong phiên này.
