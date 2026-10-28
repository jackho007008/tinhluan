# Gói 2.3 — Mệnh V1 đọc ngay, Luna biên tập, Astra giữ riêng

Ngày28/10/2026, baseline `main@f6bb4f0`, tracked/index sạch trước sửa; giữ nguyên Bửu Đình. Chỉ QA3111, không cập nhật QA3062/3070/3101 hoặc worker thanh toán.

## Quyết định và hành vi

Quyết định Gói2.3 thay cơ chế tự dùng Astra tạo Mệnh miễn phí. Sau engine tính, ứng dụng lấy đúng V1 của báo cáo, chọn bản Luna đã đối chiếu nếu có, rồi lưu snapshot và bản hiển thị trước khi trả kết quả. Không chờ provider/worker. Tạo mới và gửi lại cùng ID không tạo job Astra. Mở lại chỉ đọc; V1 thiếu phần nào thì không thêm lời cho phần đó.

Nguồn gốc là `record.frozen.customerReport`1.79.0, đã biên soạn từ `continuous-report-1.14.0`, rule/catalog và căn cứ sách được lưu cùng snapshot. `freeMenhParagraphs` kiểm snapshot/receipt rồi dùng đúng `accessPolicy.freeParagraphIds`; không lấy mọi nhóm Mệnh thô hoặc lời của lá số khác. Bản cũ không có policy được giới hạn riêng cho phần hiển thị này bằng phép chọn Mệnh hiện có, không ghi lại quyền cũ. Policy lạ hoặc snapshot không khớp trả phần trống.

Lá số đang kiểm có10nhóm Mệnh,7đoạn miễn phí,3nhóm giữ ngoài phạm vi theo policy cũ. Các rule còn status `draft`; đã có nguồn/biên tập không đồng nghĩa chứng nhận chuyên môn hoặc phủ kín Mệnh. Số đoạn thay đổi theo từng cấu trúc, không có tỷ lệ hoàn chỉnh chung. Không khảo cứu lại engine/PDF/sách.

## Phân tầng model và lưu trữ

- `AI_FREE_EDIT_MODEL=gpt-6-luna`: chỉ biên tập từng đơn vị V1; không nhận nhiệm vụ suy luận mới hoặc tự thêm dữ kiện. `AI_PAID_READING_MODEL=gpt-6-astra`: cấu hình dự phòng cho luận chuyên sâu sau này, **chưa có luồng tạo11cung**. Hai mục đích không fallback sang `OPENAI_MODEL`; biến cũ chỉ giữ cho hạ tầng lịch sử.
- Đã kiểm Models API bằng key server của QA: cả hai model có quyền. [Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) hỗ trợ Responses/Structured Outputs, reasoning `none`;3request thật dùng schema `{text}` đã thành công. Astra không có CREATE mới trong gói này; khả năng Structured Outputs có bằng chứng Gói2.1 và [tài liệu model](https://developers.openai.com/api/docs/models/gpt-6-astra).
- V1 gốc tiếp tục nằm trong frozen report. Kho biên tập riêng `AI_V1_EDIT_DIR` chứa reservation, candidate và bản đã đối chiếu, file riêng tư ghi nguyên tử/không overwrite. Không có queue/worker mới. Mỗi lệnh `scripts/edit-v1-unit.ts` chỉ chuẩn bị một đơn vị; không endpoint công khai, không tự quét catalog, không tự phê duyệt.
- Khóa dùng chung gồm toàn văn gốc, phiên bản nguồn, nguồn/điều kiện/ngoại lệ/quan hệ, prompt và model. Chỉ giống đầy đủ mới dùng lại. `menh-v1-copyedit-1.0.0` chỉ sửa văn; Structured Outputs và kiểm số/tên sao/thuật ngữ là kiểm kỹ thuật, **không chứng minh giữ nghĩa**. Bản phải được đọc đối chiếu toàn văn và chốt đúng candidate hash trước khi dùng. Codex đối chiếu lần này, không gọi là thẩm định Tử Vi chuyên môn.
- Báo cáo mới lưu `freeMenh` phiên bản `menh-v1-immediate-1.0.0`, nguồn hash, text đã chọn, nhãn gốc/Luna, model/prompt/artifact hash. Chọn một lần khi lập; thêm bản biên tập sau đó không đổi lời báo cáo cũ. Mở lại không đọc cache mới hoặc gọi API. Cache lỗi/mất/khác điều kiện khi lập thì V1 gốc; bản đã chốt vẫn đọc được từ báo cáo.
- Bài Astra cũ tiếp tục ở bảng AI và hiển thị riêng dưới “Bài AI Mệnh đã lưu · phiên bản trước”, không đổi nội dung hoặc quyền. Outbox Mệnh miễn phí ngừng enqueue; public POST từ chối tạo/retry mới, vẫn đọc completed. GET không đưa job miễn phí cũ thành trạng thái chờ hoạt động. CLI worker cũ chỉ GET đối soát theo readingID, không CREATE; hạt nhân lưu/claim/provider/validation vẫn giữ để phát triển sau, không viết Gói3.

## Ba đoạn Luna thật và đối chiếu

Chọn đúng3đoạn từ V1 đã lưu trước khi xem đầu ra: một đoạn Vũ–Phủ/Tuần–Triệt có ngoại lệ, một đoạn Vũ Khúc về hành động, một đoạn Thiên Phủ về suy xét. Không tên/ngày sinh được gửi provider. **3CREATE Luna,0CREATE Astra, không gọi thêm để sửa văn.**

- Đoạn1:1417input/151output,4,102giây, ước$0,0002172. Chấp nhận sau đối chiếu: giữ Tý, Canh **hoặc** Nhâm, vị trí Tuần/Triệt, ngoại lệ và phủ định bảo đảm/hóa giải.
- Đoạn2:938input/65output,2,095giây, ước$0,0001263. Chấp nhận: giữ quả quyết/cương nghị/tổ chức/hiếu thắng gắn riêng Vũ Khúc và giới hạn chưa là kết luận chung tính cách.
- Đoạn3:903input/68output,3,463giây, ước$0,0001243. **Chưa chấp nhận**, giữ V1 gốc: “các sao chiếu về Mệnh” bị đổi thành “các sao hội chiếu”, mất đích Mệnh, thêm nhãn chú giải nền. Không kết luận mọi nghĩa đều sai; chưa giữ đủ mức chính xác nguồn để dùng chung.

Tổng3258input/284output, cached0; ước **$0,0004678**, theo [giá Standard](https://developers.openai.com/api/docs/pricing?latest-pricing=standard) Luna0,10/0,01/0,50 USD mỗi triệu input/cache/output. Latency tính Responses, không gồm bước Models GET hoặc thời gian đọc đối chiếu; không phải hóa đơn.

[V1 gốc và Luna toàn văn, kèm lý do từng đoạn](../.local/ai-menh-package23-20261028/luna-examples.txt), [usage/responseID](../.local/ai-menh-package23-20261028/luna-examples.json), [đơn vị nguồn và điều kiện](../.local/ai-menh-package23-20261028/source-units.json). Không gọi mock là API thật; không coi3đoạn là nghiệm thu toàn catalog.

## QA và bảo toàn

QA3111 đã nạp build mới, cấu hình đúng hai model và kho edit riêng; chỉ restart web, AI worker vẫn dừng. Bản QA mới tạo qua form thật, đổi tên hiển thị kiểm thử: `502e31c4…`, có7đoạn ngay,2Luna/5V1gốc, không aiPolicy Astra hoặc job mới. Dùng lại theo nội dung/điều kiện, không theo tên/ID/ngày sinh. [Bài hiển thị](../.local/ai-menh-package23-20261028/new-free-reading.txt), [đối chiếu](../.local/ai-menh-package23-20261028/verification.json), [runtime](../.local/ai-menh-package23-20261028/runtime.json).

Browser360/390 không tràn ngang,4tab,11khóa, căn cứ mở–đóng, refresh/rời trang/mở lại vẫn2Luna/5gốc. [Ảnh360](../.local/ai-menh-package23-20261028/mobile360.png), [ảnh390](../.local/ai-menh-package23-20261028/mobile390.png), [reopen](../.local/ai-menh-package23-20261028/reopen.json). Bản chủ dự án đang mở `708869e0…` giữ7V1gốc, không chờ; Astra cũ `b69fb574…` mở riêng đủ8phần.12file báo cáo trước và12jobAI trước (gồm pending/uncertain/completed) giữ hash/trạng thái/attempt/responseID; cache vẫn chỉ3requests/3candidates/2approved. Main282file/8bảng và dịch vụ được bảo toàn nguyên, không schema/migration/quyền/đơn/webhook/Live/Google/Toàn thư.

40/40test liên quan:30AI/4editorial/6scope; kiểm SSR có văn Mệnh trước JavaScript, đơn vị cùng nội dung khác điều kiện không dùng chung, tạo đồng thời chỉ một dispatch, timeout/lỗi không tự lặp, reviewhash/corrupt cache/fallback, selection lịch sử bất biến, lưu/mở không tạo AI và quyền máy chủ. Typecheck/build cuối đạt; cảnh báo nhiều lockfile đã có. Không fullE2E/PDF. [Test](../.local/ai-menh-package23-20261028/test.log), [typecheck](../.local/ai-menh-package23-20261028/typecheck.log), [build](../.local/ai-menh-package23-20261028/build.log). Lượt đầu có lỗi cú pháp JSX, đã sửa; lượt test đầu một ca dùng chung cache fixture, đã tách môi trường từng ca và kiểm lại; [log lỗi test đầu](../.local/ai-menh-package23-20261028/test-first-failure.log), [nhật ký kiểm](../.local/ai-menh-package23-20261028/verification-notes.json).

## File và trước QA3062

Nhóm thay đổi: `lib/ai/free-menh.ts`, `v1-edit.ts`, `config.ts`, `outbox.ts`; trường optional trong `reading-store.ts`; route lập/mở lá số và API Mệnh cũ; `FreeMenhReading`, `AiMenhReading`, workspace/wrapper và CSS; CLI edit/model/worker, env example/package script;2file test và tài liệu đầu mối. Không sửa engine/rule/catalog hoặc pipeline thanh toán.

Chưa cập nhật QA3062/3070. Trước khi tích hợp cần quyền riêng, cấu hình hai model và kho private trên đúng host, sao lưu/chuyển các artifact đã đối chiếu cùng báo cáo theo quy trình triển khai hiện có; không cần migration schema cho trường JSON optional này. Mới2đơn vị được dùng chung, V1 vẫn có giới hạn nguồn/độ phủ và trạng thái draft; schema/regex không bảo đảm giữ mọi nghĩa. Những đơn vị mới cần tiếp tục đối chiếu trước dùng, chưa có quyền chạy batch toàn catalog. Không xử lý/xóa pending cũ hoặc CREATE lại uncertain; không11cung, Gói3 hay SePayLive.
