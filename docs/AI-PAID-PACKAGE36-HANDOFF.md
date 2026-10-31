# Gói 3.6 — supervisor QA và vận hành AI trả phí

31/10/2026. Baseline `main@daf2d70`; đầu phiên tracked/index sạch, chỉ `buu-dinh-7parts/` chưa theo dõi, không sửa/stage. **0 CREATE/0 GET OpenAI thật, chi phí API $0.** Không kiểm chất lượng Astra hoặc ETA 11 cung. Backend/runtime mock đã kiểm; **chưa nghiệm thu lại UI trả phí trong phiên trình duyệt khách hàng**, xem giới hạn cuối.

## Thay đổi

- Tách vòng consumer hiện có vào `lib/ai/paid-consumer.ts`; CLI cũ tiếp tục gọi cùng code. Không thêm queue, bảng hoặc migration.
- `lib/ai/supervisor.ts`, `scripts/ai-paid-supervisor.ts` và script npm `worker:ai-paid-supervisor`: invocation hữu hạn, scope allowlist và expiry, dùng khóa advisory supervisor + khóa consumer theo reading đã có. Giữ cùng response/attempt/run_after; không CREATE lại receipt đang xử lý hoặc uncertain.
- `lib/ai/operator.ts` và CLI `ai:paid-status`: queued, dispatching, automatic-reconciliation, completed, error-retryable/error-held, uncertain-missing-id, exhausted, response-unavailable và hướng xử lý. Không xuất prompt, bài luận, tên/email hoặc credential.
- `lib/ai/budget.ts`: worker và CLI dùng chung phép tính ngày UTC; request running/uncertain qua ngày vẫn giữ dự phòng, không reset reservation khi crash/restart. Không thay bảng giá/parser/prompt.
- Hai template `scripts/launchd/`: chỉ mẫu cấu hình, scope mặc định đã hết hạn/maxNew0, không chứa key và không tự cài dịch vụ.

## Supervisor được chọn và cách vận hành

Dùng **launchd user domain có sẵn trên macOS**, không cài scheduler/queue mới. Template chạy Node24 + `--env-file` private, `StartInterval=60`, `KeepAlive=false`. Mỗi invocation gọi consumer cũ rồi thoát; launchd không chạy song song hai instance của cùng label. Khóa DB chặn invocation tay/chồng label cùng scope; khóa theo reading chặn scope khác cùng đọc. Không dùng supervisor cho worker thanh toán.

Bắt buộc `AI_PAID_SUPERVISOR_ENABLED=true`, `AI_PAID_SCOPE_FILE` tuyệt đối, file mode600 và thư mục cha private. Scope ghi đúng DB name, real checkout, UUID allowlist, optional palace, createdAt/expiresAt (tối đa24h), maxRuns, maxScopesPerRun, maxNewJobsPerScope, runtimeMs và maxTicks. DB/checkout không khớp thì từ chối. File `.state.json` cạnh scope chỉ là heartbeat/số lượt chạy/cursor, **không phải queue**; reserve lượt trước khi xử lý, ghi atomic mode600. Crash không reset số lượt. Giữ file scope/state qua deploy; không xóa/reset state hoặc thay scope để lách ngân sách.

`maxNewJobsPerScope` là giới hạn mỗi scope trong một invocation; tổng CREATE còn bị chặn bởi maxRuns, ngân sách toàn edition, attempts/job và maxRunning. Cấu hình supervisor/runtime chỉ do operator được cấp quyền quản lý. Deadline/ticks giới hạn vòng lặp, không hủy mù request HTTP đang gửi; timeout provider/SDK hiện hành vẫn áp dụng. Scope hết hạn hoặc maxRuns hết trả trạng thái no-op, operator unload label sau đợt kiểm; không ngầm gia hạn.

Ngân sách hiện có giữ nguyên: `AI_PAID_MAX_DAILY_CREATES`, `AI_PAID_MAX_RUNNING`, `AI_PAID_MAX_ATTEMPTS`, `AI_PAID_DAILY_BUDGET_USD`, `AI_PAID_REQUEST_RESERVATION_USD`, GET checks/backoff. **Dự phòng USD nội bộ không phải hard cap hóa đơn provider**; usage thiếu vẫn là ước tính, không bảo đảm không vượt phí thực. GET receipt không tiêu thụ quota CREATE và vẫn được phép khi quota/ngân sách CREATE bằng0.

Giám sát bằng `npm run ai:paid-status` với env private, đúng `AI_PAID_READING_ID`; output có counts, checks, lịch GET, token/cost/timing nếu đầy đủ, operator action, heartbeat/expiry/run cap. Không có dashboard hoặc endpoint công khai mới. Template không phải lệnh triển khai QA3062.

## Runtime QA và bảo toàn

Ở đầu phiên, **QA3062/3070/3101/3111/3113/3115 và PG55439 đều không lắng nghe**; không tự bật lại hoặc coi chúng đang hoạt động. Docker5432 PID70684 giữ nguyên. Không dùng DB khác đang chạy để thay cho DB gốc.

Restore backup QA3.5 `54.787.603 byte` vào **instance mới 127.0.0.1:55446**, SCRAM/private credentials, hai DB QA/test riêng; không migrate/restore DB chính. Web mới **3116**, Node24.22.1/SDK7.45.0, checkout `.local/ai-paid36-20261031/qa`, build **yVlddR10fDAS90V0pX_Et**, PID35827 tại lúc kiểm, key rỗng, Livefalse/AI_MENH_ENABLED=false. Danh tính code qua hash file thực tế, không dùng commit ghi nhầm trong metadata launcher làm bằng chứng.

Private evidence tại `.local/ai-paid36-20261031` (ngoài Git). DB, web và provider chỉ của QA mới. Các nguồn engine/catalog/prompt, Mệnh V1/Luna và báo cáo lưu trữ không sửa. Sau kiểm: **44 job/attempt ngoài allowlist trong clone, gồm18queued giữ nguyên hash;185 file lịch sử main giữ hash**. Dịch vụ cũ vẫn offline/Docker giữ PID. **Không thể đối chiếu SQL trực tiếp DB gốc đang offline, hoặc smoke lại34 bài trên QA chính**; không tuyên bố đã kiểm những phần đó. Không restart worker thanh toán hoặc QA cũ.

## Thanh toán test →11 job → kết quả

Chỉ report QA mới **38d15aef-df9f-4903-a397-ff58ad0bb043**, order **d2906537-6033-4dd1-a0ab-a15aafa57111**, synthetic identity; không Google Login thật hoặc thanh toán ngân hàng thật.

1. launchd `gui/501/com.tinhluan.qa36.paid`, StartInterval5s/RunAtLoad, scope đúng report/DB/checkout, maxRuns10, maxNew3 mỗi lượt, runtime8s. Trước thanh toán:0job/0CREATE mock.
2. Webhook test lặp và `runReportJob` đúng order → một payment transaction, một customer-order grant, đúng11job; không chạy worker thanh toán chính/PDF/SMTP.
3. HTTP mock3196 nhận request qua SDK thật, không phải ghi thẳng output vào DB. Phụ Mẫu in_progress15s rồi completed; Nô Bộc500 một GET rồi hoàn thành; Phúc Đức raw sai schema → error retryable; Điền nhận CREATE rồi đứt kết nối → uncertain không ID; Phu404 → response-unavailable. Các cung khác completed. Ban đầu **8completed/1error/2uncertain**.
4. Một retry **tường minh qua API server kiểm quyền**, chỉ Phúc Đức lỗi schema đã biết → attempt2/valid output. Kết quả **9/11 completed,2uncertain**,12attempt. Tám completed cũ và hai uncertain giữ nguyên mọi field; không retry uncertain. Tổng webhook vẫn một payment/grant,0job Mệnh.
5. Hai GET API xác thực và mở lại HTML `/don-thu` không tăng attempt; API eligible=true/completed9/total11/state attention/overEstimate=true, trả đúng completed/held. Mệnh hiện ngay từ bản V1 đã lưu, không chờ AI. Trạng thái attention do hai lỗi cần hỗ trợ, không phải chỉ vì quá ETA.

Tổng **12 CREATE mock (11 lượt ban đầu+1 retry lỗi xác định),24 GET mock**, không duplicate CREATE. Ledger có thêm một receipt fixture GET-only cho kiểm restart dưới đây, **không phải CREATE thứ13**. Key giả và network guard chỉ cho loopback3196; web không nhận OpenAI key thật. Không dùng token/chi phí mock làm latency/cost Astra.

## Restart và chống trùng — bằng chứng riêng

Hai launcher kiểm overlap ban đầu sai env (lần1 key giả chưa override, lần2 scope env cũ đè env-file); chúng **không phải lỗi khóa của ứng dụng và không chứng minh restart**. Giữ log lỗi, không gọi chúng là đạt.

Để không sửa lại bài completed trong QA3116, tạo **DB clone thứ hai** `tinhluan_ai_paid36_restart_...` từ QA mới; chỉ trong clone này đặt một job Phúc Đức thành fixture reconciliation, valid mock output và receipt `resp_mock36_restart_fixture`. Không sửa kết quả ở DB QA3116. Scope duy nhất cung này, maxRuns5, runtime20s, **maxNew0/maxDailyCreates0/dailyBudgetUsd0**.

- launchd PID**37034** GET đầu, lưu checks1/run_after/receipt/attempt. Invocation tay đúng env trả **already-running**, không CREATE.
- Xác minh executable/cwd rồi **SIGKILL chỉ PID37034** khi đã có receipt. launchd lên PID**37086**; heartbeat runs1→2, tiếp tục **cùng attempt ec078f87-a1cb-4913-9f38-0384c389e863/cùng receipt**, checks1→7 rồi completed. Attempts vẫn2 từ fixture, không tăng; GET hoạt động dù CREATE budget hết.
- Đây là mock runtime/process restart thật, **không phải kiểm provider OpenAI thật**. Quá trình thanh toán/CREATE ban đầu và restart GET-only là hai phép kiểm tách biệt, không tuyên bố đã crash đúng lúc gửi CREATE.

Bằng chứng: `prepayment.json`, `payment.json`, `final-receipt.json`, `restart-proof.json`, `overlap-final.json`, `provider-events.jsonl`, `status-final.json`, `protected-after.json`, `source-hashes.json`. Các file `*-private*`/env/DB credentials chứa dữ liệu riêng, không gửi công khai hoặc commit.

## Operator và dừng/khôi phục

- queued: chờ supervisor có scope/ngân sách được duyệt; không gọi API từ việc mở trang.
- automatic-reconciliation: theo run_after/checks/receipt, không CREATE; restart cùng scope/state.
- completed: đọc kết quả lưu, không regenerate.
- error-retryable: kiểm output/receipt, nguyên nhân và quyền, rồi retry tường minh có ngân sách. Không dùng retry cho uncertain.
- uncertain-missing-id: giữ quyền/kết quả khác; tra attempt/client request ID với provider support. Không suy “không có ID” thành “chưa tính phí”.
- exhausted: review giới hạn/tuổi receipt; chỉ GET cùng ID theo quyết định operator, không tự reset checks/CREATE.
- response-unavailable/404: kiểm project/lifetime/receipt và hỗ trợ provider; không CREATE thay thế tự động.

Hiện hai job QA3116 cần operator: Điền mấtID và Phu404, attempts1; giữ nguyên. **Label QA đã bootout sau phép kiểm**, không supervisor/consumer thường trực; mock provider đã dừng, web3116/PG55446 để xem evidence. Không tự xử lý queued còn lại. Muốn dừng web/PG phải xác minh PID/cwd/data dir mới; chỉ dừng riêng QA này, giữ backup và dữ liệu, không restore/drop dịch vụ khác.

## Kiểm thử và phần chưa đạt

**28/28 test trong3file**: ai-background, ai-paid, ai-supervisor trên DB test riêng; typecheck và build QA3116 đạt. Có kiểm UTC rollover, reservation trước ngày mới, concurrent budget/attempt, no duplicate, operator states, scope allowlist/TTL, lưu/mở/quyền/history từ bộ paid. Không toàn E2E/PDF. Log: test-final.log/typecheck.log/build-qa.log.

Lỗi setup đầu: DB55439 offline; sau đó hai assertion timing do env QA1s/20checks đè default test. Chuyển test sang DB riêng/default30s/300s/12checks, không sửa expected cho xanh. Bản chuẩn bị private có nhãn baseline `bc1a903` kế thừa launcher cũ; **Git thực là daf2d70**, dùng hash code/BUILD_ID để định danh runtime.

**UI browser trả phí/đóng mở lại trong phiên đã có quyền: chưa xác minh được.** Tab không có cookie customer, chỉ xem được Mệnh miễn phí; đã đóng tab trong lúc launchd vẫn chạy. API có cookie QA đã kiểm9/11 và reopen không CREATE; không thay thế cho kiểm browser. Bộ duyệt tự động từ chối script seed recovery binding vì tự chèn dữ liệu xác thực chưa được cấp quyền rõ; **script không được chạy**, không tìm cách bypass. Cần phiên đăng nhập QA hợp lệ trên browser hoặc quyền rõ ràng cho recovery fixture cách ly trước khi nghiệm thu UI. Không thay code UI vì chưa có bằng chứng lỗi UI. Không có ảnh paid browser mới để bàn giao.

Trước QA3062 còn chặn: kiểm lại UI phiên có quyền/refresh/library; đánh giá vận hành provider thật và bài Tài/Phu prompt mới; nguồn/độ sâu từ3.3–3.4; phê duyệt scope/ngân sách/monitor và triển khai riêng. Dịch vụ chính đang offline cần chủ dự án xử lý trong phạm vi riêng. ETA5phút chưa xác nhận. **Không cập nhật QA3062/3070, không Live/mở bán/Gói3.7.**
