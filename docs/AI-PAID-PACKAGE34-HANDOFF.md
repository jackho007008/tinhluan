# Gói 3.4 — ổn định Background, chi phí và kiểm nguồn

Ngày 30/10/2026 (Việt Nam). Baseline `6840827`, nhánh `main`; không có diff tracked/index ban đầu, chỉ `buu-dinh-7parts/` chưa theo dõi. Không đọc/sửa/stage Bửu Đình. Shell mặc định Node20; test/build dùng **Node24.22.1, SDK OpenAI7.45.0**. QA3113 vẫn checkout Gói3.1, PID58121; thay đổi lần này ở root, **chưa nạp vào web/worker QA**.

## Kết quả và giới hạn thực thi

**0 CREATE/GET OpenAI thật, $0 API mới.** Không chạy consumer QA, không xử lý 18 queued, không migration/restart/deploy. Kiểm mock qua SDK với fetch bị chặn bằng phản hồi giả; test có DB chỉ dùng `tinhluan_ai_menh_paid31_test_…`, khác DB QA. Không sửa bài Gói3.2 hoặc Quan Lộc Gói3.3. Mệnh V1/Luna, thanh toán, quyền, engine, Vận hạn/PDF/Live giữ nguyên.

Đã hoàn thiện cơ chế đối soát có lịch bền vững, parser usage/giá có phiên bản, và kiểm nguồn/dry-run. **76/76 test trong tám file đạt; typecheck và build root đạt.** Chưa kiểm vận hành mới bằng provider thật hoặc restart tiến trình thật; chưa nghiệm thu chiều sâu Tài/Phu và chưa xác nhận ETA5phút.

## 1. Background trên queue/attempt hiện có

`provider.ts`: với cung trả phí, một lượt chỉ CREATE (chỉ khi chưa có receipt) hoặc GET cùng response ID. CREATE dùng Background/store; ID phải lưu trước khi nhường. `queued/in_progress` trả `AI_BACKGROUND_PENDING`, không chiếm worker 300giây. GET có timeout tối đa30giây, SDK retry0; không fallback model. Luồng Mệnh lịch sử giữ chế độ đọc/đối soát riêng, không khôi phục Astra miễn phí.

`worker.ts`: dùng `run_after` của job và `usage._background` của attempt hiện có; **không bảng/migration/queue mới**. Mỗi GET được ghi số lượt trước I/O, giữ cùng attempt, model, prompt và ID. Crash sau CREATE trước ID → uncertain cần kiểm tra, không CREATE lại. Crash sau khi lưu ID → sau lease6phút, nhận lại cùng attempt để GET. Crash giữa GET và commit vẫn tính vào ngân sách kiểm; completed có nội dung không được claim lại.

- Backoff mặc định30giây, sau GET lần1 là60giây, rồi120/240, trần300giây; lỗi mạng/5xx có ID dùng cùng lịch.
- Tối đa **12 GET/attempt**, tuổi attempt tối đa **24giờ**. Hết hạn → `AI_RECONCILIATION_EXHAUSTED`, giữ uncertain/ID và không tự kiểm tiếp. 404 → `AI_RESPONSE_UNAVAILABLE`, cần kiểm tra, không CREATE/requeue.
- Response không còn ID không vào nhánh đối soát. Không coi HTTP timeout hoặc hết thời gian dự kiến là provider thất bại chắc chắn.
- Claim ưu tiên đối soát đã tới lịch; pending nhường ngay, không sleep trong worker. Job không tới lịch không chặn job khác. `SKIP LOCKED` và transaction/advisory lock giữ claim/reservation đồng thời.
- Giới hạn mặc định4 running/outstanding uncertain khi cấp CREATE mới; tối đa3 attempt/job,20 CREATE/ngày, ngân sách dự phòng$10/ngày và$2/request. Cộng cả uncertain từ ngày trước; thiếu cost thì giữ dự phòng. GET vẫn được đối soát khi hết ngân sách CREATE. Hai consumer không được cùng tiêu phần ngân sách còn lại.

Các biến: `AI_BACKGROUND_MAX_CHECKS`, `AI_BACKGROUND_MAX_AGE_MS`, `AI_BACKGROUND_BASE_DELAY_MS`, `AI_BACKGROUND_MAX_DELAY_MS`, `AI_PAID_MAX_RUNNING`, `AI_PAID_MAX_ATTEMPTS`, `AI_PAID_MAX_DAILY_CREATES`, `AI_PAID_DAILY_BUDGET_USD`, `AI_PAID_REQUEST_RESERVATION_USD`. Đều kiểm miền hữu hạn. **Ngân sách USD là kiểm soát bằng ước tính/dự phòng, không phải hard cap hóa đơn provider**; có thể vượt dự phòng nếu giá/usage thực cao hơn. Cần đặt mức dự phòng và giới hạn chi phí ở project trước vận hành tính phí thật; không tuyên bố dự phòng$2 là giá tối đa của mọi packet.

`scripts/ai-paid-worker.ts` mở rộng consumer cũ: bắt buộc reading ID, có thể palace cụ thể; `AI_PAID_MAX_NEW_JOBS=0` chỉ đối soát,1–11 cho giới hạn CREATE được phép. `AI_PAID_MAX_TICKS` mặc định100/trần1000; `AI_PAID_RUN_MS` mặc định30phút/trần1giờ. Chờ lịch tối đa30giây/lượt, hết runtime/ticks thoát; có thể chạy lại bằng lịch vận hành mà không mất ngân sách đối soát. Khóa session theo reading chống CLI chồng. Không cài scheduler, không bật consumer thường trực trong phiên này. Job pending lâu có thể cần lần consumer sau; mất grant vẫn chặn cả claim và đọc, giữ nguyên quyền server.

Timing mới lưu riêng trong result: providerCreatedAt/providerCompletedAt/providerElapsedMs, queueWaitMs từ created→attempt đầu, observationMs từng lần gọi, accumulatedObservationMs, dispatchToPersistMs. Khoảng ngoài quan sát có thể gồm backoff, downtime và operator chờ; **không tự gán toàn bộ thành thời gian compute hoặc operator**. `durationMs` cũ giữ tương thích, không dùng nó làm latency provider.

Nguồn: [OpenAI Background](https://developers.openai.com/api/docs/guides/background), [Responses retrieve](https://developers.openai.com/api/reference/cli/resources/responses/methods/retrieve). Việc provider lưu response với store không thay thế kho kết quả nội bộ.

## 2. Chi phí từ usage thực, không tính trùng

`cost.ts` đọc input/output, cached read, cache-write và reasoning. Cached read/write là phần của input; reasoning là phần của output. Uncached=input−read−write; chỉ tính output một lần. Counter thiếu, âm, chồng vượt input, reasoning vượt output, model hoặc giá/tier chưa hỗ trợ → cost null và lý do, không đoán0 cho cache-write để báo giá.

Lưu breakdown, `kind=estimate-not-provider-invoice`, giá/nguồn/phiên bản **openai-standard-2026-10-30**, currency và tier đã áp dụng. Astra Standard: input$10/M, read$1/M, write$12,50/M, output$50/M; có nhánh giá long-context>272K và Flex/Batch khi metadata phù hợp. Tier chưa xác minh không được tính âm thầm như Standard. [Giá chính thức](https://developers.openai.com/api/docs/models/gpt-6-astra).

Fixtures đã khử định danh tại `tests/fixtures/ai-cost-usage.json`:

- Gói3.3 Quan:28.108 input gồm28.105write/0read →3uncached;5.916output đã gồm3.358reasoning. `(3×10+28.105×12,5+5.916×50)/1M` = **$0,6471425**. Khớp phép đối soát thủ công3.3.
- Gói3.2 Quan/Tài/Phu: các artifact lưu input/output/reasoning/read nhưng **không giữ cache-write đầy đủ**. Parser trả incomplete-usage/cost null khi thử lại fixture; các số lịch sử$0,30042/$0,35906/$0,28690 vẫn giữ nguyên trong DB, không backfill hoặc đổi thành null ở báo cáo cũ.

[Đối chiếu máy](../.local/ai-paid34-20261030/cost-comparison.json). Không gọi GET để bổ sung usage cũ; đây là ước tính theo dữ liệu đã có, không phải hóa đơn.

## 3. Độ sâu nguồn: đang dùng, bỏ sót và khoảng thiếu

Kiểm module V1/catalog/evaluator và metadata hồ sơ đã xử lý; đối chiếu riêng đoạn chữ Tân Biên208–216,194–197,164–166 và Toàn Thư82–83 khi liên quan. Không mở PDF/kiểm ảnh mới, không đọc lại toàn sách, không truy cập Bửu Đình. [Danh sách/hash chứng cứ](../.local/ai-paid34-20261030/source-evidence.json); nội dung OCR/chữ chưa được coi là ảnh đã kiểm.

Trên đúng snapshot Gói3.2, có80/74/58 rule ứng viên mang chủ đề Quan/Tài/Phu. Sau evaluator, **0 rule trực tiếp matched bị retrieval bỏ sót**; đây chỉ là kiểm trên mẫu, không phải toàn kho đã khai thác hết. [Rule/trace/nguồn/exclusion theo cung](../.local/ai-paid34-20261030/dry-summary.json) và các packet chi tiết bên dưới.

- **Quan đang dùng:** Tử Vi–Thiên Tướng (TB158/162), Bạch Hổ–Tấu Thư (TB166§8.39), Quyền tại Quan (TB32). Hữu Bật và điều chỉnh khác chưa có luận điểm trực tiếp đủ điều kiện trong packet. NPL-33 (Tổng Hợp179/204; Hàm Số150–151) có nhắc quan hệ bộ phụ tinh; trước chưa lấy. Nay chỉ bổ sung **D reference-only** khi snapshot có Hổ/Tấu tại Quan; không biến bản tóm tắt hồ sơ thành nghĩa sao hoặc phép chế hóa mới.
- **Tài đang dùng:** Liêm Trinh đơn thủ Thân (TB190§12.2), luận chi tiêu của chính đương số từ nguồn Trung Châu phần2 PDF201/617/619/626 có điều kiện đã được evaluator kiểm. Hai đoạn nhà đất không trở lại làm lời trực tiếp Tài. NPL-27 (Tổng Hợp250/262/264/309; Hàm Số191/230) phân biệt Hao và lưu chuyển: nay đưa **D reference-only** khi Tài có field Bác Sĩ là Đại/Tiểu Hao. Không suy một Đại Hao thành Song Hao Mão/Dậu, không coi nguồn tại Quan áp sang Tài. TB195§12.27 và196§12.45 có điều kiện nhóm riêng; không đủ để tạo thêm nhận định trực tiếp mẫu này.
- **Phu đang dùng:** Hóa Khoa tại Phu trong nam mệnh, TB214§14.21. Tả Phù hóa Khoa không phải Phá Quân hóa Khoa. Quan/Di/Phúc chỉ nhómC, đúng cung gốc.

### Phá Quân–Đà La–Hỏa Tinh tại Phu

Có nguồn liên quan, nhưng **chưa có luận điểm kết hợp ba sao phù hợp để thêm trực tiếp**:

1. TB213§14.14 có Phá Quân đơn thủ Thìn/Tuất nhưng gắn điều kiện lập gia đình sớm/muộn, số lần và lời về người phối ngẫu; không rút thành một tính cách nhẹ hơn rồi gọi có nguồn. TB215§14.35 nói Phá–Tuần/Triệt ở phạm vi đang giữ. Hai nhánh Tử–Phá/Liêm–Phá đã trong catalog nhưng false trên mẫu vì Phu không có hai chính tinh đó.
2. TB214§14.18 Tả/Hữu cần “nhiều sao sáng/tối”; chưa có phép lượng từ đúng nguồn để chọn nhánh từ một sao. Không cho Khoa tự xóa Đà/Hỏa.
3. Toàn Thư83 có Hỏa nhập miếu **và** sao tốt hỗ trợ, nhánh hãm khác. Snapshot không ghi độ sáng Hỏa, không đủ để chọn. Đoạn Phá cũng có phạm vi hôn nhân và lời truyền thống cần giữ giới hạn; không dùng nó làm căn cứ cho sự kiện chắc chắn.
4. Hồ sơ TL186-R2-LAVONG nói Đà Thìn/Tuất nhưng có khác biệt phép an và ngoại lệ chưa khóa; không dùng bảng Thiên Lương để tái chứng nhận sao Tân Biên. TL186-PHU là phương pháp thận trọng với câu phú, không phải nghĩa trực tiếp của bộ Phá–Đà–Hỏa ở Phu. NPL-45 cần hai lá số/hoàn cảnh thật, mẫu chỉ một snapshot nên không lấy làm luận điểm.
5. Crosswalk U15–18 còn điều kiện, bất nhất hoặc phạm vi sản phẩm; không mở lại dự án thêm hàng loạt rule, không gỡ cổng để tăng độ phủ. NPL-24/25/26/28/30/35/37 có tài sản, Tuần/Triệt, cứu giải và các bộ khác nhưng phạm vi/ngoại lệ riêng; không gán thành phép thắng sao chung.

**Đề xuất có căn cứ:** tiếp tục đặc tả nhỏ đúng mệnh đề/điều kiện khi được giao, ưu tiên quan hệ phụ tinh và lượng từ của từng tác giả. Phân loại nguồn tham khảo không đồng nghĩa đã có lời cá nhân mới. Gói này chỉ thêm hai lựa chọn phương pháp D, không thêm rule chuyên môn, nghĩa sao mới hoặc nhómA giả.

## 4. Dry-run Tài/Phu và tính bất biến

Prompt vẫn **paid-palaces-vietnamese-1.1.0**; facts vẫn **paid-facts-1.1.0**, retrieval mới **paid-retrieval-1.1.1** chỉ cho input mới. Không relabel input/job đã lưu.

- Tài:111→159facts so3.2;4→13tri thức, A1/B1/C8/D3. Thay D chung NPL-15 bằng NPL-27, không tăng số lời trực tiếp. Đại Hao/Thái Tuế đúng tọa thủ; Chỉ Bối vẫn upstream-unverified.
- Phu:111→159facts;1→10tri thức, A0/B1/C6/D3. Nội dung facts/knowledge/prompt không đổi so3.3; chỉ metadata version retrieval tăng. Quan Phù/Tang Môn/Nguyệt Sát đúng vị trí, Nguyệt Sát không làm căn cứ cá nhân.
- Quan đối chiếu thêm:159facts,14tri thức A3/B0/C8/D3, D NPL-33 thay NPL-15. Bạch Hổ–Tấu Thư vẫn đúng cung.

[Packet Tài](../.local/ai-paid34-20261030/tai-bach-dry.json), [Phu](../.local/ai-paid34-20261030/phu-the-dry.json), [Quan](../.local/ai-paid34-20261030/quan-loc-dry.json), [summary](../.local/ai-paid34-20261030/dry-summary.json), [CSV trước/sau](../.local/ai-paid34-20261030/packet-comparison.csv). Có facts, nguồn/điều kiện, prompt và trace từng nhánh. Không dùng dry-run để chấm chất lượng bài mới hoặc tính phí/token thật.

## 5. Kiểm thực sự chạy

- **76/76 test, tám file**: AI Mệnh/V1 lịch sử, paid/grant/GET, adapter/retrieval/provenance, Background và cost. Database test riêng, API mock. Có completed sau cửa sổ300giây theo provider timestamp812giây, lần invocation mới/lease stale,5xx→404, mấtID, GET budget/exhaustion, backoff không tới lịch, claim đồng thời, retry lỗi đã xác định, ngân sách cuối cùng dùng một lần giữa hai consumer, cap attempt, immutable completed/read lại. Không dừng/restart worker thật để mô phỏng.
- Typecheck và production build root Node24 đạt; không E2E/PDF/browser/mobile mới vì không sửa UI. Không coi kiểm mock là kiểm provider thật.
- Lượt mock đầu bị budget do attempt test cũ; sửa setup TRUNCATE **chỉ sau guard đúng tên test DB**. Hồi quy tiếp phát hiện guard queued chặn retry lỗi đã xác định và timestamp cũ có thể thiếu; đã sửa code, không hạ expected. Fixture11cung đặt ngân sách test rõ$100 để khác mặc định vận hành$10. Lỗi typecheck field vòng chưa có trên typePalace đã sửa type đọc, không thêm trường engine. Lưu lỗi đầu và từng lượt trong `.local/ai-paid34-20261030`.

[Log cuối](../.local/ai-paid34-20261030/test-final.log), [typecheck](../.local/ai-paid34-20261030/typecheck.log), [build](../.local/ai-paid34-20261030/build.log). [Hash/PID trước–sau](../.local/ai-paid34-20261030/qa-preserved.json) toàn44job và attempt QA3113,18queued, cùng PID/start/cwd các QA được kiểm chỉ đọc; main có đối chiếu riêng185file/8bảng và tiến trình. Không xử lý queue thực.

## 6. Còn chặn trước QA3062

1. Chưa nạp code3.4 vào consumer QA hoặc kiểm lịch vận hành thật sau restart; chưa có quyền bật consumer thường trực. Cần đặt scope, ngân sách, lịch chạy/giám sát và đường xử lý exhausted/mấtID; không tự CREATE bù.
2. Dự phòng USD không thay giới hạn hóa đơn provider; chưa đo toàn bộ11cung, không chốt ETA5phút. Giá/counter/tier chưa đủ phải để chưa biết, không backfill lịch sử.
3. Nguồn trực tiếp Phu còn mỏng, phụ tinh/Tứ Hóa/mâu thuẫn chưa đủ chiều sâu; D mới không phải phần luận bổ sung. Tài/Phu chưa có bài thật prompt1.1 để đánh giá lại.
4. Không phải quyền deploy QA3062/3070/3101/3111, mở bán/Live, Gói3.5, Vận hạn/PDF hoặc gọi Astra/Luna mới.

Code đổi trong `lib/ai`: background/cost mới; provider/worker/store/contract; paid-input/paid-retrieval. Consumer cũ `scripts/ai-paid-worker.ts`; tests Background/cost/usage fixture/paid adapter và setup paid. Tài liệu cập nhật đúng đầu mối trạng thái/backlog/kiến trúc/kiểm thử/quyết định. Kho private, log và packet ngoài Git, không key/cookie hoặc thông tin cá nhân trong bàn giao.
