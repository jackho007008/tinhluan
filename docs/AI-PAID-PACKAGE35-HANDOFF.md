# Gói 3.5 — runtime Background trên QA clone, provider giả lập

Ngày30/10/2026 (Việt Nam). Baseline **bc1a903**, nhánh main; tracked/index sạch lúc đầu, chỉ `buu-dinh-7parts/` chưa theo dõi. Không đọc/sửa/stage Bửu Đình. **0 CREATE và0 GET OpenAI thật; $0 API phát sinh.** Không coi HTTP mock là kiểm provider thật hoặc kiểm chất lượng Astra.

## Runtime và phạm vi đã thực hiện

QA mới **http://paid31.localhost:3115**, checkout `.local/ai-paid35-20261030/qa`, Node24.22.1/SDK7.45.0. Web cuối PID**14874**, build **PUX8VqqZDZ5zR8PfspbsR**, key rỗng/Live tắt. Consumer dùng nguyên worker/CLI3.4; web bổ sung sửa trạng thái pending đã tái hiện. [Runtime](../.local/ai-paid35-20261030/web-runtime.json), [hash app/consumer đã chạy](../.local/ai-paid35-20261030/runtime-source-hashes.json).

Tạo backup chỉ đọc QA3113 **54.787.603byte**, restore vào DB mới `tinhluan_ai_paid35_qa_1793342914395`; không restore/migrate DB gốc. Chép kho bản đọc QA vào thư mục private riêng. Backup, DB identity và rollback tại `.local/ai-paid35-20261030`; rollback chỉ dừng PID mới, giữ clone/backup, không restore/drop dịch vụ khác.

Chỉ kiểm báo cáo **cbb4fd02-55d1-49c7-9e49-dbcbdd77879b** trong **clone**, cùng order test83983d26…; đây không phải sửa báo cáo tương ứng ở QA3113. Giữ nguyên một bài Quan Lộc completed đã chép từ3.3. Các receipt giả lập được seed riêng trong clone để kiểm GET, không gọi CREATE hoặc sửa input/snapshot/V1.33job ngoài báo cáo trong clone giữ nguyên; toàn44job/attempt và18queued **QA3113 gốc** giữ nguyên hash.

Mock HTTP **127.0.0.1:3195/v1**, PID4074, trả trạng thái theo đồng hồ/điều khiển riêng và từ chối POST. Consumer có thêm network guard chỉ cho GET tới đúng origin loopback này, dùng key giả, không có key thật. SDK/validation/worker/store vẫn là code hiện có; không thay bằng narrator ghi thẳng kết quả. Nội dung ghi rõ BẢN MÔ PHỎNG; UI có badge QA không API thật.

## Restart, lịch và kết quả

Tất cả lần chạy có `AI_PAID_MAX_NEW_JOBS=0`, cùng reading scope; lần đầu còn scope riêng Tài Bạch. Backoff QA rút xuống1giây/trần2giây, max3GET để kiểm hữu hạn; **không đổi mặc định vận hành3.4**.

1. Consumer PID**5290** GET Tài→in_progress, lưu checks1 và run_after, sau đó dừng đúng PID bằng SIGTERM khi đang chờ. [Receipt trước/sau](../.local/ai-paid35-20261030/restart-first.json).
2. Consumer PID**10325**, invocation mới/runtime4giây, tiếp tục **cùng attempt/response ID**, GET Tài→pending rồi completed; không tăng attempt. Nô Bộc500 ở GET đầu, backoff rồi GET completed. Tới deadline consumer thoát0. [Receipt](../.local/ai-paid35-20261030/restart-second.json).
3. Consumer PID**10343**, runtime12giây, chạy lại trên lịch đã lưu; Phu đạt3GET→`AI_RECONCILIATION_EXHAUSTED`, thoát0. Không reset số GET sau lần chạy mới. [Receipt](../.local/ai-paid35-20261030/restart-third.json).

Kết quả cuối scope: **3completed /3queued /5uncertain /0running /0error**. Hai completed mới là mock Tài/Nô, một completed cũ Quan giữ nguyên mọi field. Ba queued vẫn0attempt. Phúc Đức có lịch tương lai tại thời điểm consumer chạy,0GET; không ngăn các cung tới lịch hoàn thành. Thiên Di đã có checks3 từ fixture, không GET thêm và chuyển exhausted. Phụ Mẫu404 chỉ1GET rồi dừng; Điền mấtID0GET, không CREATE, không có nút retry tính phí.

Tổng **9GET mock,0POST/CREATE mock,0request OpenAI thật**. Các GET kế tiếp khi pending/lỗi cách nhau ít nhất khoảng2giây theo run_after; 404/exhausted/mấtID không bị lặp. [Nhật ký HTTP không header/credential](../.local/ai-paid35-20261030/provider-requests.jsonl), [receipt tổng hợp](../.local/ai-paid35-20261030/runtime-receipt.json).

Khoảng tắt consumer đầu tới chạy lại khoảng31phút là thao tác vận hành/browser/build trong phép kiểm; timestamp/usage provider do mock cung cấp. **Không dùng chúng làm latency Astra hoặc ETA11cung.** Kiểm restart ở điểm đã lưu receipt/lịch; không tuyên bố đã kiểm mọi điểm crash trong mạng thật.

## Ngân sách và quan sát

Trong clone: maxDailyCreates1, maxRunning1, maxAttempts1, dailyBudgetUsd0; status cuối có8attempt ngày hiện tại và accountedUsd10,6530625 từ bản chép/ước tính/dự phòng giả lập. **GET cùng receipt vẫn hoạt động khi ngân sách CREATE hết**, không cấp attempt mới. Các guard CREATE/ngày, outstanding, dự phòng USD, tối đa attempt được kiểm thêm bằng mock DB test riêng; không thử CREATE có tính phí. Không gọi dự phòng USD là hard cap hóa đơn.

CLI mới **`npm run ai:paid-status`** bắt buộc `AI_PAID_READING_ID`: chỉ SELECT counts, checks, run_after, hasResponseId, error/operator flag, token/cost/timing và giới hạn/dự phòng toàn edition. Không chọn input/prompt, content, tên/email, token phiên hoặc API key. Không có endpoint công khai mới. [Trước resume](../.local/ai-paid35-20261030/status-before-resume.json), [cuối](../.local/ai-paid35-20261030/status-final.json).

Hai kết quả HTTP mock có input100 gồm read10/write20/uncached70, output40 đã gồm reasoning15; parser lưu breakdown/price và estimate$0,00296/mẫu. **Đây là số giả lập kiểm parser, không token/bill thực.** Bài Quan sao chép giữ cost lịch sử, không bị tính lại.

Cơ chế chạy lại dùng **consumer cũ có vòng chờ run_after, deadline/tick và khóa session**, đã kiểm bằng hai invocation hữu hạn nối tiếp; không cài cron/launchd/scheduler hoặc queue thứ hai. QA launcher/private env cố định clone, scope và maxNew0. Sau deadline có thể khởi động lại cùng CLI, không reset DB state. Hiện các consumer đã thoát và provider giả lập đã dừng; **web3115 chỉ để xem kết quả, không tự xử lý các job còn lại**.

Đọc giám sát clone (không khởi chạy consumer):

```sh
node --env-file=.env .local/ai-paid35-20261030/run.mjs --import tsx scripts/ai-paid-status.ts
```

Không dùng cấu hình mock vào dịch vụ thật. Trước vận hành thường xuyên cần chốt supervisor hiện hành chạy lại consumer hữu hạn, scope/ngân sách được duyệt và theo dõi operator; không mặc nhiên bật một scheduler mới hay worker thanh toán để làm việc này.

## UI: lỗi đã phát hiện và sửa đúng phạm vi

Trước sửa, receipt Background đang chạy bị ánh xạ thành attention/“cần thử lại hoặc đối soát”, cung báo liên hệ hỗ trợ dù còn lịch GET tự động. [AX trước](../.local/ai-paid35-20261030/ui-pending-before.txt), [ảnh trước](../.local/ai-paid35-20261030/ui-pending-before.png).

`readPaid` nay phân biệt uncertain cóID từ provider OpenAI còn tự đối soát thành **reconciling** ở view, không đổi DB status. UI hiển thị “Đang tạo”; exhausted/404/mấtID vẫn **“Cần kiểm tra”**, không tự retry. API pending trả processing/overEstimate=true, không báo lỗi chỉ vì vượt5phút. [API pending](../.local/ai-paid35-20261030/api-pending.json), [API cuối](../.local/ai-paid35-20261030/api-final.json).

Trình duyệt thấy tự cập nhật1→3/11, đọc đủ8phần mock Tài; Phúc còn lịch hiển thị Đang tạo, Phu exhausted hiển thị Cần kiểm tra. Đã refresh và mở lại **từ thư viện→đúng order**;8phần vẫn đủ, Mệnh7đoạn/V1-Luna giữ nguyên. [Trạng thái DOM](../.local/ai-paid35-20261030/ui-states.json), [mở lại](../.local/ai-paid35-20261030/ui-reopened.json), [refresh](../.local/ai-paid35-20261030/ui-refreshed.json), [receipt không đổi job/attempt/GET](../.local/ai-paid35-20261030/refresh-receipt.json), [ảnh tiến trình](../.local/ai-paid35-20261030/ui-final.png), [ảnh completed](../.local/ai-paid35-20261030/ui-completed.png).

Công cụ browser từng mất kết nối; reset phiên điều khiển khôi phục được, không đổi phiên đăng nhập. Một selector rolebutton không khớp summary của accordion được sửa bằng AX đúng phần tử; không coi đây là lỗi sản phẩm. Sau khôi phục đã kiểm UI thực sự. Không kiểm lại viewport360/390 hoặc toàn E2E/PDF trong gói này.

## Test, bảo toàn và điểm dừng

- **17/17 test trong2file** Background/paid, gồm thêm pending→processing, held→attention và cap CREATE/ngày. Typecheck Node24 đạt; build checkout QA mới đạt sau sửa UI. Không chạy lại toàn bộ76test vì parser/engine/retrieval/prompt không đổi.
- App/consumer source hash khớp root đã kiểm; `lib/ai/worker.ts`, provider/cost/retrieval vẫn nguyên3.4. Chỉ sửa view mapping/UI, thêm CLI giám sát, test và package script/tài liệu.
- Source QA3113:44job/attempt/18queued nguyên hash; QA3062/3070/3101/3111/3113 cùng PID/start/cwd. Main185file/8bảng và worker thanh toán đối chiếu nguyên. Clone8bảng quyền/đơn/transaction/nguồn Toàn thư khớp bản gốc; kho Toàn thư QA clone rỗng, không dùng nó làm chứng minh nội dung công khai main. [Receipt gốc](../.local/ai-paid35-20261030/qa-preserved.json). Không engine, quyền cũ, Live, Vận hạn, PDF hoặc Gói3.6.

Trước QA3062: kiểm có cấp quyền với provider thật vẫn chưa làm; cần chính sách vận hành lại/giám sát hữu hạn và đường xử lý exhausted/mấtID, project spending limit/dự phòng hợp lý. Chất lượng Tài/Phu và ETA11cung vẫn là khoảng chưa nghiệm thu. Kết quả lần này chứng minh **process thật + DB/HTTP thật trên QA clone với provider giả lập**, không chứng minh OpenAI thực tế.

[Log17test](../.local/ai-paid35-20261030/test-final.log), [typecheck](../.local/ai-paid35-20261030/typecheck.log), [build QA](../.local/ai-paid35-20261030/build-qa-fixed.log). Kho private/backup/log/phiên QA ngoài Git; không đưa key/cookie vào bàn giao.
