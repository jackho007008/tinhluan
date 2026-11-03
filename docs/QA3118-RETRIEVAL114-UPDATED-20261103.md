# QA3118 — cập nhật checkout phục vụ và chuẩn bị kiểm model

03/11/2026, khoảng 09:59–10:04 giờ Việt Nam. Baseline `main@d64d7e4`; tracked/index sạch, giữ `buu-dinh-7parts/`, `docs/handoff/`. Chủ dự án xác nhận cập nhật QA checkout cũ sau lượt kiểm sẵn sàng. Thực hiện riêng web QA3118 đã xác minh, không gọi model thật hoặc xử lý queue. Không sửa mã ứng dụng trong lượt triển khai này.

## 1. Đích thực tế và phiên bản

Đã đối chiếu listener, cwd, executable Node và thời điểm khởi chạy trước dừng. Web cũ PID 68941, cổng 3118, checkout `.local/ai-paid-v2-20261101/qa`, retrieval 1.2, build `lZKMw1LLmtrFCyWhZAS74`. Không dùng PID từ tài liệu mà thiếu kiểm thực tế. PostgreSQL clone cổng 55448, PID 68265; đối chiếu tên DB, data_directory và system_identifier bằng transaction READ ONLY.

Tạo checkout mới riêng tại [checkout QA](../.local/qa-paid-current-20261103/checkout/) từ Git archive **`d64d7e41489a67156c90450fcd8cfae00932e4d0`**. Không ghi đè checkout cũ vì QA3119 cũng từng dùng thư mục đó. Đối chiếu 393 file mã với bản đã build rồi tái sử dụng build **`ivjOZJ7TYHz1cqLHXROBt`**; không build lên `.next` đang phục vụ.

Web mới chạy bằng Node **24.22.1**, PID cuối **74791**. Chuỗi thực tế: 68941 → 74588 khi thay checkout, rồi 74588 → 74791 để nạp cấu hình bảo vệ hợp lệ ở mục 3. Chỉ web QA3118 được dừng/khởi chạy. Không dùng lệnh restart toàn bộ process manager. Không rollback.

Checkout mới nhận retrieval **1.14.0**, prompt **2.6.0**, Reading V2; không đổi engine, edition/offer, quyền hoặc Mệnh V1/Luna. Đã kiểm marker phiên bản trong server bundle và dựng input bằng chính mã checkout mới. Job đã có vẫn dùng saved input/prompt; việc thay checkout **không nâng 18 job queued từ 1.2 lên 1.14**, không backfill 37 completed. Cần báo cáo mới khi được phép kiểm model với input 1.14.

## 2. Kho nguồn và backup

Kho riêng tại [source-library QA](../.local/qa-paid-current-20261103/source-library/): 33 artifact của bundle đã bàn giao và 80 record kiến thức hiện có, tổng 113 file có manifest/hash. Không symlink kho mới vào thư viện nguồn đang nghiên cứu; cập nhật sau này ở kho gốc không tự đổi snapshot QA. Tất cả 11 input mới khớp bản đã kiểm, 159 facts/cung; Phu/Tài/Tật mock qua đúng validator. [Manifest](../.local/qa-paid-current-20261103/source-manifest.json) · [Kiểm input](../.local/qa-paid-current-20261103/inputs-verified.json).

Trước deploy tạo backup DB clone bằng pg_dump 16/custom format, **5.362.838 byte**, kiểm SHA256 và `pg_restore -l`; không restore/migrate. Giữ bản cấu hình/runtime cũ và 4 file kho trial, đối chiếu hash sau triển khai. Kho internal và kho edit V1 mà cấu hình QA cũ trỏ đến không tồn tại ở baseline; không tạo nội dung thay thế hoặc tự phục hồi dữ liệu. Giữ cấu hình đường dẫn ấy và hành vi fallback V1, không nhận rằng đã smoke nội dung Luna approved trong browser.

[Backup manifest](../.local/qa-paid-current-20261103/backup-manifest.json) · [DB trước](../.local/qa-paid-current-20261103/db-before.json) · [DB cuối](../.local/qa-paid-current-20261103/db-after-guardrails.json). Backup và nguồn private ngoài Git, thư mục QA đặt quyền 0700, dump/log riêng 0600. Không đưa API key/session/cookie hoặc nội dung DB vào Git.

## 3. Cấu hình an toàn đang dùng

- `AI_PAID_READING_MODEL=gpt-6-astra`, `AI_FREE_EDIT_MODEL=gpt-6-luna`; không model fallback.
- Web **không có OpenAI API key**, không có `.env` thật trong checkout mới. Không sửa `.env` gốc. Endpoint provider trong cấu hình web trỏ loopback disabled; preload chặn fetch ngoài loopback. Không kiểm quyền model, credit hoặc giá bằng API trong lượt này.
- Giữ `AI_PAID_ENABLED=true` và writer V2 trên QA theo cấu hình test hiện hành; không bật worker từ cờ này. `AI_MENH_ENABLED=false`, supervisor=false, `maxNewJobs=0`.
- Mức hợp lệ: daily CREATE 1, request đang xử lý 1, attempt/job 1, **ngân sách dự phòng nội bộ 0 USD**. Cấu hình daily CREATE 0 thử ban đầu không được parser chấp nhận và quay về 20; đã phát hiện, thay bằng budget 0 hợp lệ và nạp lại riêng web. Không nói daily 0 là khóa tính phí. Ngân sách này không là hard cap hóa đơn provider; key rỗng/không consumer mới là biện pháp ngăn gọi trong phiên này.
- Giữ thanh toán test/mock, `SEPAY_LIVE_ENABLED=false`; không thay quyền/đơn/webhook hoặc khởi chạy worker thanh toán.

[Env QA không chứa key](../.local/qa-paid-current-20261103/env.mjs) · [Runtime cuối](../.local/qa-paid-current-20261103/web-runtime.json) · [Lần thay checkout](../.local/qa-paid-current-20261103/deployment.json) · [Nạp lại guardrails](../.local/qa-paid-current-20261103/guardrail-reload.json).

## 4. Smoke và bảo toàn thực sự đã kiểm

- HTTP 200: trang chủ, `/lap-la-so` và build manifest của đúng build mới. Node báo Ready; vẫn có cảnh báo workspace root nhiều lockfile từ trước, không sửa hạ tầng để che cảnh báo.
- Decoder mới đọc **37/37 completed** giống nguyên decoder cũ, 0 unsupported: 26 V1, 7 limited, 3 insufficient, 1 focused. Đây là tương thích shape/nội dung đã lưu, không đánh giá lại chất lượng hoặc gọi các bài mock là Astra thật.
- GET API trả phí không cookie trên một report ID đã có trả 404, không gửi payload cung. Không tạo recovery fixture, chèn session hoặc bỏ qua kiểm quyền. **Chưa kiểm browser với phiên owner hợp lệ**, chưa tuyên bố đã refresh/mở lại nội dung trả phí bằng browser hay nghiệm thu mobile mới.
- **37 bảng public giữ nguyên hash/count**, kể cả quyền, đơn, grant, jobs và attempts: 37 completed, 18 queued, 37 attempt trước/sau. Không tạo job, thay attempt/receipt hoặc gọi model.
- Cổng và fingerprint tiến trình được bảo toàn ở 3062/3070/3101/3111/3113/3119 và DB 55448. Các cổng web đó không listening ở baseline và sau kiểm; không tuyên bố đã smoke được dịch vụ không chạy. Không thấy worker theo các lệnh script hiện hành trong snapshot tiến trình; không thực hiện start/restart worker nào.

[Smoke](../.local/qa-paid-current-20261103/smoke.json) · [Tổng hợp](../.local/qa-paid-current-20261103/summary.json) · [Tiến trình trước](../.local/qa-paid-current-20261103/processes-before.json) · [Tiến trình cuối](../.local/qa-paid-current-20261103/processes-final.json) · [Web log](../.local/qa-paid-current-20261103/web.log).

Không chạy lại 216 test/typecheck/build đã đạt vì không sửa code; đã kiểm khớp mã/build, 113 hash nguồn, dry-run 11 input, 3 mock, decoder 37 bài và HTTP/runtime cần cho deploy. Không E2E/PDF, không model-list GET, Responses CREATE/GET, worker hoặc supervisor. Lượt đóng gói đầu dừng vì Python không hỗ trợ tham số filter của tarfile; xác nhận đích rỗng rồi kiểm tên/loại member trước giải nén, chưa dừng dịch vụ ở thời điểm lỗi. Lượt SELECT ban đầu bị sandbox EPERM, chạy lại cùng script READ ONLY theo quyền kiểm DB QA; không đổi DB đích hoặc dùng đường tắt ghi.

## 5. Kết luận và bước trước phép thử thật

**Checkout QA đã cập nhật xong.** Truy cập [QA3118](http://paid31.localhost:3118). Web/nguồn/build đã sẵn cho bước tạo báo cáo QA mới và phép thử có giới hạn được duyệt; **chưa gọi Astra và chưa xác minh credit/quyền project hiện tại**. Phần nội dung Phu/Tài vẫn limited, Tật insufficient/T1; đây không phải nghiệm thu thương mại 11 cung.

Trước phép thử thật cần chỉ định báo cáo mới và cung, giới hạn CREATE/chi phí, kiểm lại quyền/credit rồi cấp key riêng cho tiến trình hữu hạn đúng scope. Không dùng 18 queued cũ hoặc retry các attempt uncertain/failed đã lưu để thay mẫu mới. Không được suy quyền gọi API từ việc cập nhật web QA.

**0 CREATE/0 GET OpenAI thật, 0 USD; không cập nhật QA3062/3070, không Live hoặc mở bán.** Không thay checklist nội dung 90%/P09 chưa kiểm trong lượt vận hành này. Điểm dừng: bàn giao môi trường QA mới, giữ dữ liệu và bài cũ.
