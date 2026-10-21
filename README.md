# Tử vi — bản thử nghiệm chạy cục bộ

Website tiếng Việt, mobile-first, Next.js + TypeScript strict + Tailwind + PostgreSQL. Thông điệp: **Tính toán theo quy tắc. Diễn giải có căn cứ.**

**Chưa sẵn sàng thương mại. Không thu tiền thật.** Đã audit ZIP `huyenhoc-engine-v0.1.zip` và ảnh được bổ sung ngày 07/10/2026. Profile mới tính âm dương lịch UTC+7 bằng Astronomy Engine 2.1.19, an sao qua bridge iztro 2.6.1, ngày dương 1976–2050. Giữ riêng profile Trung Quốc cũ; không fallback. Lịch có fixture nguồn độc lập, an sao chưa được chuyên gia xác nhận; luận giải/scoring chưa được duyệt.

Xem [audit engine](docs/ENGINE-AUDIT.md), [quy ước lịch](docs/CALENDAR-CONVENTIONS.md), [kiểm chứng và sai khác](docs/ENGINE-VALIDATION.md).

## Chạy nhanh

Yêu cầu Node.js >=20.19, npm, PostgreSQL 16+. Trong phiên phát triển đã dùng PostgreSQL 16.14 (ServBay), cổng riêng 55439. Không cần AI API key.

```sh
npm ci
cp .env.example .env
```

Sửa DATABASE_URL theo PostgreSQL riêng của bạn. Tạo database `tuvi`. Sửa MOCK_WEBHOOK_SECRET thành chuỗi ngẫu nhiên tối thiểu 32 ký tự; có thể tạo bằng `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` rồi lưu riêng vào .env. Không dùng giá trị mẫu để triển khai.

Nếu có PostgreSQL CLI và muốn tạo instance cục bộ độc lập (chỉ chạy khi `.local/postgres` chưa tồn tại và cổng 55439 chưa dùng):

```sh
mkdir -p .local
initdb -D .local/postgres -A trust --encoding=UTF8 --locale=C
pg_ctl -D .local/postgres -l .local/postgres.log -o '-h 127.0.0.1 -p 55439 -k /tmp' start
createdb -h 127.0.0.1 -p 55439 tuvi
```

Trust chỉ dành cho DB demo bind loopback. Production cần role/password/TLS và phân quyền riêng.

```sh
npm run db:migrate
npm run dev
```

Mở **http://localhost:3000** (khớp APP_ORIGIN). Trong terminal thứ hai:

```sh
npm run worker
```

Worker phải chạy để tạo báo cáo/email. Dừng worker không làm mất job; chạy lại để tiếp tục. Nếu đổi port, sửa APP_ORIGIN và lệnh dev tương ứng.

## Thử trọn luồng

1. Nhập ngày/giờ/phút và nơi sinh. Chọn **Lịch Việt Nam UTC+7 — 1976–2050** hoặc chủ động chọn profile Trung Quốc cũ để đối chiếu. Đọc và xác nhận quy ước; chưa rõ giờ không bị tự điền.
2. Kiểm tra thông tin, xác nhận lập lá số. Xem 12 cung ở tổng thể/phóng to/danh sách.
3. Xem gói demo, nhập email và tạo đơn. Giá server cố định 99.000 / 199.000 / 299.000 VND, chưa duyệt thu thật.
4. Lưu/sao chép QR demo nếu muốn. QR KHÔNG thể chuyển tiền. Nhấn **Mô phỏng webhook đã nhận tiền** để thử xử lý server.
5. Chờ trạng thái thực từ worker, đọc báo cáo dữ kiện và biểu đồ giai đoạn đại vận. Có thể đóng/tải lại trang; chỉ mã đơn lưu localStorage, quyền nằm ở cookie HttpOnly.
6. Xem `.local/mail/*.json` để lấy liên kết demo. File lưu email và token, không chia sẻ công khai. Liên kết `/recover#…` xóa fragment khỏi địa chỉ và cần bấm xác thực, dùng một lần trong 15 phút. Email chưa gửi ra Internet.

Gói một chủ đề lưu đúng chủ đề; các gói nhiều nhóm lưu phạm vi nhóm, năm được chọn (nếu có), giá và quyền 30/90 ngày. Năm chưa có luận vận, biểu đồ điểm chưa được cung cấp. Các mô tả thiếu chuyên môn đều hiển thị chưa khả dụng.

## Kiểm tra / build

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build
npm start
```

`npm test` dùng DATABASE_URL trong .env, cần DB đã migrate. Dùng database demo/test riêng: test có trigger mô phỏng lỗi giao dịch. Dừng worker ngoài khi chạy unit/integration tests để tránh tranh queue với test; chạy server khi chạy E2E. Không bật worker ngoài: fixture E2E chỉ mở worker cho các ca cần xử lý hàng đợi rồi đóng, để ca phục hồi lỗi kiểm soát được trạng thái queued/failed.

E2E dùng Google Chrome đã cài, kiểm tra 360px/390px. Nếu máy không có Chrome, cài Chrome hoặc sửa `playwright.config.ts` để dùng Chromium do Playwright quản lý. Không cần cài trình duyệt để chạy unit tests.

Production build/start luôn tắt thanh toán demo và chưa có thanh toán thật. Không dùng `npm start` để thử nút mock-pay; dùng dev. Không deploy public trong phiên bàn giao này.

Kết quả thực tế xem [docs/TEST-RESULTS.md](docs/TEST-RESULTS.md). Không coi test kỹ thuật là chứng nhận chuyên gia.

## Cấu trúc

- `lib/calendar`: Zod, ngày/giờ/múi giờ, chuẩn hóa và chặn unsupported.
- `lib/tuvi-engine`, `scripts/engine*.cjs`: cô lập từng profile iztro; DTO và evidence.
- `lib/calendar/vietnamese.cjs`, `iztro-bridge.cjs`: lịch thiên văn UTC+7, chặn chuyển lịch CN trong profile VN.
- `lib/interpretation-rules`: chỉ rules mô tả dữ kiện, allow-list và evidence.
- `lib/scoring`: null/unavailable cho thật, fixture UI riêng.
- `lib/narration`: template mặc định, adapter AI với kiểm tra allow-list và fallback.
- `lib/payments`: QR demo, raw-body HMAC, idempotency và transaction.
- `lib/reports`, `lib/jobs`: báo cáo snapshot, PostgreSQL outbox + SKIP LOCKED, retry/backoff.
- `lib/notifications`: adapter email cục bộ, ghi atomic theo delivery ID.
- `lib/security`, `lib/provenance`: token, expiry/revoke, phiên bản, result hash.
- `app`, `components`: UI và API; không an sao/rule/scoring trong component.
- `db/001_init.sql`: migration cho toàn bộ thực thể yêu cầu.

Đổi thương hiệu/màu/gói: `lib/config.ts`. Giá gửi từ client bị từ chối; server tra catalog. Chạy migration lại khi đổi seed catalog. Giá/nhóm đã snapshot không thay đổi ở đơn cũ.

## Tài liệu bàn giao

- [Audit và giới hạn đầu vào](docs/AUDIT.md)
- [Quy ước, phiên bản, nguồn kỹ thuật](docs/CONVENTIONS.md)
- [Worker, payment/email adapter, đối soát và dữ liệu](docs/OPERATIONS.md)
- [Giấy phép bên thứ ba](docs/THIRD-PARTY.md)

Lệnh bảo trì: `npm run reconcile`, `npm run data:purge`, `npm run data:delete -- ORDER_UUID`. Lệnh xóa có tác động thật tới DB được cấu hình; chỉ chạy sau khi xác định đúng đơn.

## Kiểm chứng engine riêng (không cần DB)

```sh
npx vitest run tests/core.test.ts tests/vietnamese-engine.test.ts
node scripts/calendar-validation.cjs
```

Lệnh thứ hai ghi thống kê kỹ thuật và sai lệch mẫu NASA trong `docs/evidence/`; không tạo expected từ output để gọi là kiểm chứng độc lập.

## Điều kiện trước mở bán

Cần lịch Việt Nam và toàn bộ chuỗi chuyển lịch được kiểm chứng; quy tắc luận giải với nguồn/vị trí và người kiểm duyệt có thật; scoring được duyệt nếu bán biểu đồ điểm; ca kiểm chứng độc lập; nhà cung cấp payment/email thật và sandbox tests/chữ ký/đối soát; kiểm thử tải, backup/restore, hard-kill recovery và bảo mật độc lập; chính sách dữ liệu/retention/support; chủ sản phẩm phê duyệt giá và phạm vi. Các điều kiện này chưa được hoàn thành trong bản thử nghiệm.

## Giai đoạn quy tắc và hai chủ đề

Đã có pipeline DerivedFacts → RuleMatches → ConflictResolution → ApprovedClaims → TemplateReport, schema strict và DSL không eval.6 ánh xạ dữ kiện kỹ thuật;6 đặc tả factual draft +2 diễn giải draft có nguồn;0 rule được chuyên gia duyệt. Dữ kiện được trình bày riêng, không xuất claim draft. Engine/database/payment giữ nguyên. Report cũ không được tính lại; report mới có phiên bản/hashes/rules manifest riêng.

Thử đơn demo mới với gói toàn diện: xem “Tổng quan bản mệnh”, “Sự nghiệp” và mở “Xem căn cứ”. Báo cáo cũ giữ bố cục cũ. Không có scoring hoặc nhận định nghề nghiệp được duyệt.

```sh
npx vitest run tests/interpretation.test.ts
npm run chart:compare -- fixtures/chart-comparison/awaiting-vn.json
npm run chart:compare -- fixtures/chart-comparison/upstream-subset.json
```

Fixture independent chưa có expected; mẫu upstream không độc lập. Không tự điền expected bằng engine.

- [Kiến trúc và audit dữ kiện](docs/INTERPRETATION-ARCHITECTURE.md)
- [Danh mục rule/nguồn/trạng thái](docs/RULE-SOURCES.md)
- [Checklist chuyên gia](docs/EXPERT-REVIEW-CHECKLIST.md)
- [Kết quả test giai đoạn rules](docs/RULE-TEST-RESULTS.md)

### Đọc báo cáo và kiểm tra nội bộ

Báo cáo khách nay dùng cách trình bày riêng: tóm tắt Tổng quan/Sự nghiệp, vị trí cung, chính tinh, trạng thái sao, tứ hóa và “Xem căn cứ” bằng ngôn ngữ thông thường. Chi tiết kỹ thuật không được trả trong API báo cáo khách. Dữ liệu báo cáo cũ không bị cập nhật.

Trang `http://localhost:3000/internal` có bản đọc thử **Bản nháp nội bộ — chưa kiểm duyệt**, bảng từng nhận định/căn cứ/phần còn thiếu và dữ liệu truy vết đầy đủ. Cấu hình `INTERNAL_REVIEW_KEY` (khóa ngẫu nhiên ít nhất 32 ký tự) và `INTERNAL_REVIEW_ORDER_ID` trong `.env`; mở trang và nhập khóa. Không dùng khóa trong URL. Phiên riêng hết hạn sau một giờ; đổi khóa để thu hồi phiên. Không tự tạo báo cáo thay thế nếu thiếu đơn được chọn.

Xem [hướng dẫn preview](docs/READING-PREVIEW.md) và [kết quả kiểm thử](docs/READING-TEST-RESULTS.md). Năm chú giải mới là bản thảo biên tập nội bộ, không phải rules đã được duyệt. Engine, snapshot cũ, database schema, payment demo và scoring giữ nguyên.

### Preview thống nhất rules (2.0.0)

Trong `/internal`, chọn **Chọn báo cáo đã lưu → Xem lá số này** để đối chiếu nhiều lá số mà không sửa cấu hình/source. Preview chạy cùng catalog/evaluator, có bảng rule khớp/không khớp/thiếu dữ kiện và căn cứ claim. Sáu rule dữ kiện cũ, hai draft cũ, năm chú giải và ba context cùng một catalog; không có approved mới. Trang hiển thị rõ profile và phiên bản đang xét. Báo cáo đã giao không bị tính lại/ghi đè; engine/calendar/database/payment giữ nguyên. Nội dung là template, không phải AI. Xem [audit và các trường hợp thử](docs/UNIFIED-PREVIEW-AUDIT.md).

### Độ phủ Tổng quan (catalog 1.2.0)

Preview nội bộ có chú giải cho 9/14 chính tinh tại Mệnh và trường hợp mảng chính tinh rỗng hợp lệ. Năm mục còn thiếu được ghi rõ, không ghép nghĩa sao thành luận toàn lá số. Không phát hành draft cho khách. Xem [bảng độ phủ trước/sau và nguồn](docs/OVERVIEW-COVERAGE.md).

Tạo lại ví dụ từ engine bằng `node --import tsx scripts/overview-examples.ts`; đầu vào demo công khai, không sửa vị trí sao. Kết quả trong `docs/evidence/overview-engine-examples.json` chỉ chứng minh tích hợp, không thay thế xác nhận độc lập/chuyên môn.

### Nhóm phối hợp nội bộ (catalog 1.3.0)

Preview 2.2.0 thêm nhóm Tử Vi–Tả Phụ/Hữu Bật đồng cung Mệnh (engine ghi “Tả Phù”). Có hai cách đọc: phối hợp riêng và phối hợp kèm yếu tố cần xét thêm; tất cả draft. Chú giải đơn được chuyển vào mục mở rộng khi trùng phần phối hợp, không xóa claim/trace. Xem [đặc tả, ngoại lệ biên tập và bản trước/sau](docs/COMBINATION-SPEC.md). Ví dụ engine công khai tái lập bằng `node --import tsx scripts/combination-examples.ts`. Engine, báo cáo cũ và payment demo giữ nguyên.

### Bộ mẫu kiểm thử nội dung riêng

Trong `/internal`, dùng **Chọn mẫu kiểm thử → Xem mẫu kiểm thử**. Có 47 mẫu: 36 fixture kỹ thuật (không phải lá số hợp lệ) và 11 ca engine từ thông tin sinh giả lập. Không tạo đơn/giao dịch, không cần worker; giữ nguyên xác thực nội bộ. Mỗi mẫu có kỳ vọng rule/claim và lý do; preview/trace dùng evaluator hiện có. Xem [ma trận và giới hạn](docs/CONTENT-MATRIX.md), [kết quả kiểm thử](docs/CONTENT-MATRIX-RESULTS.md).

### Đo độ phủ nội dung

Đăng nhập `/internal`, mở **Đo độ phủ nội dung và xem các bản Tổng quan mẫu**, hoặc `/internal?view=coverage`. Bảng tính trực tiếp evaluator cho 43 mẫu; lọc mẫu trống, chỉ chú giải đơn, phối hợp, thiếu dữ kiện và rule chưa có ca khớp. Không truy cập đơn khách ở nhánh này. Có sáu bản Tổng quan cùng căn cứ để đối chiếu. Chạy CLI `node --import tsx scripts/content-coverage.ts` để xuất bằng chứng JSON và bản đọc Markdown. Xem [phương pháp đếm, kết quả và ưu tiên](docs/CONTENT-COVERAGE.md). Đây không phải scoring vận mệnh hoặc xác nhận sẵn sàng mở bán.

### Nghiệm thu vòng khách 08/10/2026

Xem [kết quả, mã đơn demo, ảnh và giới hạn native picker](docs/CUSTOMER-JOURNEY-QA.md). Validation ngày dùng chung profile-ranges.json cho UI/API/guard VN, giữ nguyên phạm vi engine. Khi truy cập localhost, tiến trình dev và worker cần APP_ORIGIN khớp http://localhost:3000; có thể đặt biến cho riêng lệnh chạy mà không sửa .env. Báo cáo khách vẫn chỉ chứa dữ kiện, không phát hành draft.

### Rà soát nội dung Tổng quan 1.4.0

Hai rule phụ tá v1.1.0 không còn đánh giá thuận vô điều kiện và bị chặn khi Phá Quân cùng Mệnh. Thêm chú giải **thuật ngữ** Phá Quân/Thất Sát, không tính là luận cá nhân. Catalog 27 rule (9 dữ kiện, 18 diễn giải/phương pháp), tất cả draft, 0 approved.

Xem [nguồn và quyết định còn thiếu](docs/OVERVIEW-REVISION.md), [sáu bản đọc](docs/COVERAGE-READINGS.md), [trước/sau](docs/OVERVIEW-BEFORE-AFTER.md). Trong `/internal`, chọn `engine-combo`, `engine-exception`, `syn-combo` để so sánh; hai mẫu engine có Phá Quân phải bị chặn tổng hợp, mẫu kỹ thuật chỉ kiểm điều kiện. Tái tạo bằng `node --import tsx scripts/content-coverage.ts` rồi `node --import tsx scripts/overview-revision.ts`. Không cần worker, không tạo đơn.

### Chuẩn bị beta miễn phí — mặc định tắt

Luồng `/beta` và bảng `/internal/beta` đã được chuẩn bị; không tự phát hành draft hoặc gửi lời mời. Cần migration 002, edition được chủ dự án chọn release **và** BETA_ENABLED=true mới cấp nội dung qua quyền riêng. Không chia sẻ khóa nội bộ. Xem [hướng dẫn, quyền truy cập, lưu/xóa và kịch bản thử](docs/BETA-READING.md). Phản hồi bất biến gắn edition/claim/version; không coi mức hiểu hoặc phản hồi phù hợp là độ chính xác Tử vi.

## Môi trường nghiệm thu beta riêng

Ba bản đọc DEMO đã chốt, database riêng và hướng dẫn mở quyền/thu hồi: [BETA-SANDBOX.md](docs/BETA-SANDBOX.md). Chỉ loopback `127.0.0.1:3002`; beta website hiện hành vẫn tắt. Không gửi lời mời thật.

### Nhập sinh và đọc Tân Biên nội bộ

Sau đăng nhập `/internal`, mở `/internal/readings` để nhập, xác nhận, lập lá số và lưu bản đọc thử từ đúng snapshot. Chỉ quyền nội bộ; không beta/đơn hàng/email. Dữ liệu lưu ngoài public ở `.local/internal-readings` (hoặc thư mục private `INTERNAL_READING_DIR`), cần giữ khi khởi động lại. Chưa có tự động xóa; có thể xóa tệp UUID của hồ sơ tại kho private. Không dùng thư mục này làm fixture. Xem [luồng, provenance và giới hạn](docs/TANBIEN-RULE-READING.md).

### Nghiệm thu ổn định 1.16.1

E2E chạy tuần tự (`workers: 1`, `retries: 0`). Đặt `E2E_ORIGIN` cùng origin của server; không dùng database chính. Các ca ghi dữ liệu cần `E2E_ISOLATED_DATABASE` trùng tên database loopback có tiền tố `tuvi_stability_`. Hai ca beta là opt-in, chỉ chạy trên bản sao loopback và database DEMO riêng; không bật beta của dự án chính. Chi tiết kết quả đợt này: [báo cáo ổn định](docs/STABILIZATION-1.16.1.md).
