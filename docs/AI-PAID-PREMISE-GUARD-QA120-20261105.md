# Validator tiền đề và QA riêng retrieval 1.20 — 05/11/2026

Đã sửa trường hợp thiếu nguồn Nô bằng contract mới **paid-palaces-vietnamese-2.8.1**, giữ prompt/validator2.8.0 và bài cũ. Đã chuẩn bị **QA3120 / DB clone55462**, retrieval1.20/guide1.3/facts1.1/schemaV2. Không gọi API hoặc xử lý job. Đây là hoàn thành chuẩn bị kiểm model, chưa nghiệm thu nội dung hay thương mại.

Baseline `main@82f486a`, tracked/index sạch trước phiên; giữ `buu-dinh-7parts/`, `docs/design-handoff/`. Phạm vi được giao: sửa lỗi đã tái hiện, kiểm mock và QA riêng; không có quyền API, QA3062/3070 hoặc mở bán.

## Sửa có bằng chứng, giữ phiên bản cũ

Mẫu [probe trước](../.local/ai-paid-offline-ready-20261105/open-semantic-probe.json) bỏ nguồn giải thích Lộc nhưng đoạn tổng hợp vẫn nói Lương và Lộc. Validator2.8 kiểm nguồn→neo, chưa kiểm tiền đề→nguồn nên nhận. 2.8.1 thêm `validatePaidPremiseCoverage`:

- Chỉ đoạn `ai-synthesis` dùng nền B/foundation: mỗi fact sao/Tứ Hóa được dẫn phải có neo ở nguồn thực dùng trong chính đoạn. Không mượn nguồn từ đoạn trước, nguồn direct không liên quan hoặc phương pháp D để lấp chỗ thiếu.
- Kiểm tên sao rõ trong lời theo fact snapshot để chặn việc chỉ xóa factId; nhận Hóa Lộc và các dạng Lộc ở/tại/nối với. Không lấy từ khóa trong lời nguồn làm neo mới. Sao cùng tên phải dẫn đúng instance được nguồn neo; không tự chuyển sao từ cung khác.
- Hình học/cung vị không tự là luận điểm sao. Nền đứng riêng đủ neo vẫn được `limited`; không buộc thêm direct không dùng, không tăng focused, không nới C/D/y khoa. Nếu chỉ kể dữ kiện ngoài phạm vi diễn giải, prompt yêu cầu tách đoạn facts hoặc bỏ liên hệ không có nguồn.
- Lỗi `AI_PREMISE_SOURCE_MISSING` được phân loại output validation, không billing/provider. Không thay retry, ngân sách, queue, receipt hoặc schema.

**Giới hạn:** đây là guard cấu trúc có nhận diện tên, không bộ chứng minh ngữ nghĩa. Dẫn đủ neo chưa chứng minh nguồn hỗ trợ toàn bộ câu. Cách nói gián tiếp không nêu tên, việc gắn basis sai hay dẫn nguồn có cùng neo nhưng không hỗ trợ nhận định vẫn cần đọc toàn văn. Không tuyên bố khép mọi lỗi thiếu căn cứ bằng regex. Đã đối chiếu [OpenAI Docs — Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs): đúng schema vẫn có thể sai nội dung; chỉ đọc tài liệu công khai, không gọi model hoặc đổi SDK/schema.

Writer mới opt-in V2 chọn2.8.1. CREATE/GET dùng promptVersion của job/attempt như trước;2.8.0 vẫn nhận mẫu probe theo hành vi cũ, không đánh giá lại hoặc thay bài lịch sử. Schema `paid-reading-v2.0.0`, retrieval1.20 và tất cả file prompt cũ giữ nguyên. Không đổi engine, Mệnh V1/Luna, quyền, thanh toán hoặc gói bán.

## Kiểm thực sự đã chạy

Node24.21.0, mock trong môi trường sạch không `.env`/key/DB; preload chặn mạng. [Bằng chứng riêng](../.local/ai-paid-validator-qa120-20261105/).

- **174/174 test tại7file đạt**; thêm một ca mock CREATE mới rồi chạy lại riêng file guard **17/17 đạt**. Tổng175case khác nhau, không cộng các lượt chạy lại thành191case. Có mock Background/Structured Outputs2.8.1, receipt một lần và GET theo version cũ/mới không CREATE. [Log suite](../.local/ai-paid-validator-qa120-20261105/tests-final.log), [ca bổ sung](../.local/ai-paid-validator-qa120-20261105/tests-provider-extra.log).
- Lượt đầu172/174: một assertion writer còn2.8.0; một fixture gắn C/D vào tổng hợp bên cạnh direct vốn hợp lệ nhưng lại mong bị chặn. Sửa assertion writer và fixture thành **source-interpretation sai phạm vi** để kiểm đúng tình huống. Không sửa source/history expected hoặc nới guard. [Log đầu](../.local/ai-paid-validator-qa120-20261105/tests-first.log).
- **11 input/bản đối chiếu nguyên**, đủ159facts/cung; cả2.8.0/2.8.1 đọc được 10limited và Tật insufficient. Mẫu thiếu nguồn trước bị chặn đúng2.8.1. **2.606 hash cũ nguyên**. [Mock](../.local/ai-paid-validator-qa120-20261105/mock-summary.json). Toàn văn tham chiếu [giữ bản trước](../.local/ai-paid-offline-ready-20261105/bo-bien-tap-qa.html).
- Typecheck/build **checkout cách ly đạt**, typecheck cuối có test mới đạt. Không build trên `.next` đang phục vụ. [Typecheck](../.local/ai-paid-validator-qa120-20261105/typecheck-final.log), [build](../.local/ai-paid-validator-qa120-20261105/build.log).
- 3 phép gọi bị chặn **trước mạng**: fetch provider, TCP provider và loopback port ngoài allowlist; không là GET OpenAI thật. [Log](../.local/ai-paid-validator-qa120-20261105/network-guard.log).
- Không chạy suiteDB có TRUNCATE/migration, toànE2E/PDF hoặc consumer. Import version trong testDB được cập nhật cho writer mới nhưng **testDB ấy chưa chạy phiên này**. Không đổi UI; không kiểm lại mobile hoặc phiên owner trong browser.

## QA riêng sẵn có

Truy cập [QA3120](http://paid120.localhost:3120). Web PID**60123**, Node24.21.0, build **Wr1jSlACQfJZCRNjcxnS5**; checkout tại `.local/ai-paid-validator-qa120-20261105/checkout`. Đóng mã bằng [code manifest](../.local/ai-paid-validator-qa120-20261105/code-manifest.json), [runtime](../.local/ai-paid-validator-qa120-20261105/runtime.json). Checkout là bản sao baseline cộng sửa phiên này; file mã ứng dụng đối chiếu hash, không suy phiên bản từ HEAD thư mục gốc.

Kho riêng **128artifact** =48bundle nguồn đã kiểm +80knowledge record. Không symlink kho vào nguồn đang biên tập. Kiểm hash và chạy factory từ **chính checkout QA với kho mới**, cả11 input sâu bằng input1.20 đã đóng; validator mới chặn probe. [Nguồn](../.local/ai-paid-validator-qa120-20261105/source-manifest.json), [kiểm runtime input](../.local/ai-paid-validator-qa120-20261105/runtime-inputs.json).

DB nguồn QA55448 được xác minh database/data_directory/system_identifier theo baseline trước khi pg_dump READ ONLY. Restore **chỉ vào cluster mới55462**, database `tinhluan_paid120_qa_20261105`, PostgreSQL16.14 PID**58461**, system_identifier khác. Không migration/restore vào nguồn. Backup custom kiểm SHA256 và `pg_restore -l`; **37 bảng clone khớp nguồn**. [Backup](../.local/ai-paid-validator-qa120-20261105/backup-manifest.json), [DB clone](../.local/ai-paid-validator-qa120-20261105/clone-db-initial.json).

Kho trial được sao8file, hash nguồn/bản sao giữ. Internal và kho edit V1 của QA nguồn không có nội dung; giữ fallback V1, **không tuyên bố đã kiểm Luna approved** hoặc tự tạo dữ liệu thay thế. Kho, dump và credential DB nằm private dưới thư mục0700, không Git/log/bàn giao credential.

Cấu hình: model đọc từ cấu hình hiện hành là **gpt-6.1-sol**, chưa xác minh khả dụng/credit trong phiên này. Web không nhận OpenAI API key, endpoint disabled, mạng chỉ cho127.0.0.1/localhost tại3120/55462. `AI_MENH_ENABLED=false`, supervisor=false, maxNewJobs=0, dự phòngUSD=0; daily1/running1/attempt1 là giá trị hợp lệ, không gọi là hard cap hóa đơn. Worker không chạy; không mở mock provider. Thanh toán test/mock, SePayLive=false. Không sửa `.env` gốc.

## Smoke và bảo toàn

[Smoke](../.local/ai-paid-validator-qa120-20261105/smoke.json): HTTP200 cho trang chủ/lập lá số/Toàn thư/build manifest đúng build. API paid không phiên trả404 hai lần, không trả nội dung khóa. Decoder mới đọc **38/38 completed** giống decoder checkout QA3118. Không dùng phép kiểm decoder/anonymous thay cho nghiệm thu browser owner.

Trước/sau **38completed,28queued,39attempt** và hash37bảng giữ nguyên ở cả source/clone; không CREATE job mới, không thay input của job cũ hoặc retry. Kho8file không đổi. Các listener bảo vệ3062/3070/3101/3111/3113/3118/3119/55448 giữ PID/trạng thái; chỉ thêm web3120 và DB55462. QA3118 vẫn PID74791/input1.14, không restart. Không bật worker thanh toán/AI/supervisor. **0 CREATE/0 GET OpenAI, $0 API.**

## Điểm dừng và trước phép thử thật

Lỗi đã tái hiện được khép cho writer2.8.1, QA nguồn1.20 sẵn; chưa có bài model mới. Không dùng28queued clone làm lượt thử: chúng giữ input/prompt lịch sử. Khi có quyền API mới cần **báo cáo QA mới và grant test hợp lệ**, chọn cung/scope/giới hạn/giá/credit rồi cấp key riêng cho tiến trình hữu hạn. Không cấp key cho web hoặc bật consumer toàn queue; không tự hồi sinh attempt uncertain/credit-failed.

Còn chặn nghiệm thu thương mại: đầu ra thật chưa được đọc/đối chiếu theo2.8.1; phạm vi Tật và các cung có nguồn hẹp chưa chốt. Validator không chứng nhận chuyên môn. Chưa smoke UI bằng phiên owner trên QA3120. Không nâng% checklist hoặc tuyên bố11bài sâu đã hoàn thành. **Chưa đạt phát hành; dừng trước API.**
