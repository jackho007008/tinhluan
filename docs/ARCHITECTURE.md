# Kiến trúc Tinh Luận hiện hành

## 01/11 — Retrieval1.4 và prompt2.2, chưa gọi provider

Bốn trích ý sách lấy facts đã kiểm receipt, giữ vị trí điều kiện khác chủ đề nhận lời (Lộc tạiNô →vế đối đãi Tử đúng nguồn). contextGuide chỉ trỏ C/A-B/facts có quan hệ đã kiểm, không tri thức mới; bỏ method-only, không nhân bản văn nguồn. Prompt2.2 giữ schemaV2, guard C tên cung gốc trên cả tổng hợp chỉ áp phiên bản mới. reviewPaidContextUse chỉ đọc, không coverage/status/retry tự động; job/attempt cũ giữ đúng prompt. Không queue/DB/UI/offer/Mệnh mới. [Cách kiểm và giới hạn](AI-PAID-SOURCES-CONTEXT-20261101.md).

## 01/11 — Lỗi provider và nguồn nền trả phí

Generation giữ lỗi terminal an toàn cùng receipt/usage/timing; worker phân biệt billing, incomplete/cancelled, provider failure và validation V2, không biến credit thành schema hoặc tự CREATE lại. Operator có billing-held. Retrieval1.3.0 giữ evaluator/Cbudget, thêm trích ý sách B/reference-only có điều kiện; validator chỉ cho tổng hợp cùng nền A/B direct. Prompt2.1.0 dùng schema2.0.0, chọn theo job/attempt; reader giữ V1/V2/2.0 và writer vẫn opt-in. Không migration, queue, offer/edition hoặc Mệnh mới. [Kiến trúc thực kiểm và giới hạn](AI-PAID-RELEASE-READINESS-20261101.md).

## 01/11 — Paid Reading V2 đã kiểm mock trên QA3118

ContractV2/prompt2.0 riêng, readerV1/V2 và chọn schema theo job đã lưu; writer mặc định tắt, chỉQA3118 bật.84/84test/typecheck/build đạt; browser/mobile360/390, refresh/mở lại và căn cứ đạt. QA11processed/8có bài(1focused/7limited)/3insufficient, không báo11bài sâu giả;44job cũ nguyên. Recovery1fixture đã được duyệt và revoked;0OpenAI. Chưa chất lượng/schemaAPI thật, khôngQA3062/3070/Live. [Bàn giao, mock và giới hạn](AI-PAID-READING-V2-HANDOFF-20261101.md).

## Content P0 —01/11, chỉ nội dung input và validation

paid-context chọn C bằng metadata theme/contentType/cung gốc của nguồn đã hợp lệ, giảm ưu tiên cung đã dùng và cap8/serializedbyte không quálegacyC8/trần24KB. A/B/D và nguồn không đổi; trace lựa chọn ngoài packet. Retrieval1.2.0/prompt1.2.0 cho job mới; registry giữ cũ, không schema/queue/UI/migration. paid-safety whitelist nguyên câu giới hạn y khoa trước regex, không bỏ qua câu phủ định tùy ý; API vẫn kiểm schema/IDs/guard. [Cách kiểm và giới hạn](AI-PAID-CONTENT-P0-HANDOFF-20261101.md).

## Gói3.5 — view reconciling và giám sát operator

readPaid chỉ SELECT receipt/error để ánh xạ uncertain còn tự đối soát thành reconciling; exhausted/404/mấtID giữ attention, không đổi status DB hoặc quyền. CLI ai:paid-status chỉ đọc metadata có scope, không prompt/content/credential; không endpoint/scheduler mới. Worker/provider/schema giữ3.4; kiểm process restart qua DB clone và HTTP mock. [Cơ chế hữu hạn và bằng chứng](AI-PAID-PACKAGE35-HANDOFF.md).

## Gói 3.4 — đối soát ngắn, trạng thái trên attempt cũ

Paid provider CREATE/GET một lượt, receipt bền trước yield; worker lưu lịch ở job.run_after và budget/quan sát ở attempt.usage._background. Không schema/queue mới; claim/reservation khóa transaction, consumer khóa session theo reading. Cost breakdown/price và timing mới là metadata tùy chọn, đọc kết quả cũ không cần backfill. Retrieval1.1.1 thêm hai lựa chọn phương pháp D theo dấu mốc đã lưu, không thay evaluator/rule hoặc prompt1.1.0. [Giới hạn, cấu hình và cơ chế phục hồi](AI-PAID-PACKAGE34-HANDOFF.md).

## Gói 3.3 — paid facts/retrieval1.1.0

`paid-facts` đọc bốn field vòng đã lưu, provenance phân cung/quan hệ/nguồn/phạm vi và mức kiểm; không an lại. Boshi/suiqian kiểm trace, changsheng giữ bất nhất, jiangqian và supplementary upstream không thành căn cứ cá nhân. `paid-retrieval` tái dùng executeRules, loại false/unknown/template/conflict, ưu tiên V1 trực tiếp và phân A/B/C/D; context không được chuyển chủ đề. Registry prompt1.1.0 giữ legacy body, provider dùng version từ job; Mệnh cũ không đổi. Queue/payment/schema/engine không sửa. Một CREATE đã quauncertain→GET được phép→lưucompleted cùngattempt/ID bằng worker/validator/store hiện có, khôngHTTP khi lưu. Không consumer thường trực/requeue tự động. Metadata phí cần xử lý cache_write_tokens trướcQA3062. [Chi tiết](AI-PAID-PACKAGE33-HANDOFF.md).

## Gói 3.2 — scope cung và prompt trả phí 1.0.1

Consumer hiện có nhận `palace` tùy chọn, kiểm tên cung trả phí, áp cùng scope cho claim/stale; CLI hỗ trợ `AI_PAID_PALACE`. Provider dùng paidUserInput đúng cung thay task Mệnh, prompt1.0.1, không đổi Mệnh miễn phí hoặc queue. Ba request thật dùng root code; webQA3113 vẫn build Gói3.1, chỉ tắt cờ nhãn mock/key vẫn rỗng. Adapter bỏ sót trường vòng riêng là lỗi còn mở; không sửa engine hoặc backfill input/output. [Bàn giao](AI-PAID-PACKAGE32-EVALUATION.md).

## 29/10 — Gói3.1 trên QA riêng, chỉ kiểm mock

QA3113 triển khai payment/grant → queue11cung → consumer cùng hạ tầng → lưu/poll/màn chờ/thư viện. Hai báo cáo tổng hợp đủ11/11mock, webhook lặp1grant, đóng trang/refresh/reopen không thêmattempt; MệnhV1/Luna giữ nguyên.54/54test/typecheck/build; mobile360/390.0API thật/$0, ETA5phút chưa đo, chưa nghiệm thu chất lượngAstra/TậtÁch hoặc consumer thật thường trực. Không cập nhậtQA3062/3070/3101/3111/worker chính/Live. Migration011/012 chỉDBmới; [bàn giao, kiến trúc, bằng chứng và giới hạn](AI-PAID-PACKAGE31-HANDOFF.md).

## Gói2.5 — snapshot kho và kế hoạch web QA3062

`v1-edit-transfer`/CLI `snapshot-v1-edit-store` sao chép toàn bộ artifact/journal sang thư mục mới, manifestSHA256/bytes, kiểm nguồn ổn định/JSON và từ chối symlink/overlap/overwrite; verify phát hiện thiếu/thừa/đổi. Khôi phục chỉ sang root mới, không DB/process/API. Kho runtimeprivate ngoài checkout trên DATA, backup/restore thử; không coi cùng volume là bản sao ngoài ổ. Không đổi đường dựng lời/runtime của f18acee.

Ứng dụng miễn phí có thể phục vụ bằng Node24 với AI_MENH_ENABLED=false/keyrỗng, chỉ đọc approved/V1; main không cần schemaAI011 hoặc worker. Gói2.5 chỉ build/preview riêng và chuẩn bị env/rollback; webQA3062 hiệnNode20 vẫn nguyên. [Kế hoạch](QA3062-MENH-V1-INTEGRATION-PLAN.md).

## Gói 2.4 — registry nguồn và journal duyệt trong kho private

Tái dùng `AI_V1_EDIT_DIR`: sources bất biến chứa unit V1/nguồn/điều kiện/report/catalog; requests/candidates/errors giữ cơ chế reservation cũ. reviews theo candidateKey + sourceContextHash là chuỗi sequence/previousReviewId, ghi temp rồi hardlink độc quyền, stale không overwrite. `v1-edit-storage` giữ canonical hash cũ; `v1-review-store` kiểm context/journal; `v1-inventory` nhận snapshot hữu hạn, đọc đúng các nhóm nguồn renderer/policy hiện hành, không AI hay bộ chọn rule mới. Similarity chỉ gợi ý đọc soát.

Selection mới cần approved,5pass,candidateHash,unit/điều kiện/nguồn/report/catalog/model/prompt chính xác, không technical findings; lỗi/chưa nhận trả V1. Prompt registry giữ actual1.0, ưu tiên1.1, không relabel candidate cũ. `freeMenhView` chỉ đọc saved selection, không tham khảo journal mới khi reopen. CLI operator có register/list/inspect/review và prepare một unit chủ động, không endpoint/CMS/worker/queue mới. Không migration; journal private cần volume bền/backup/chuyển đầy đủ trước tích hợp host khác. [Chi tiết](AI-MENH-PACKAGE24-HANDOFF.md).

<a id="ai-menh-architecture-20261027"></a>
## Gói2.3 — V1 miễn phí và kho biên tập

Luồng customer mới: engine/frozen → policy miễn phí → `captureFreeMenh` đọc artifact đã đối chiếu hoặc V1gốc → lưu `freeMenh` optional vào JSON báo cáo → SSR `FreeMenhReading`. Không API/queue trong đường hiển thị. `freeMenhView` chỉ đọc lựa chọn đã chốt, không đổi lịch sử khi cache tăng. Nguồn và metadata gốc giữ trong frozen; bản Luna private tách riêng theo content/conditions/source/model/prompt hash, reservation ghi độc quyền và approval theo candidate hash, không worker/queue mới. CLI chỉ một unit, lỗi/unknown không tự retry. Public API/old outbox không enqueue Astra miễn phí; CLI worker cũ chỉ đối soát GET theo ID, hạt nhân AI cũ và completed giữ nguyên. Hai model explicit độc lập, không fallback từ `OPENAI_MODEL`. Paidmodel mới chỉ cấu hình, không11cung. [Chi tiết](AI-MENH-PACKAGE23-HANDOFF.md).

## Bổ sung Gói 2 — AI Mệnh, môi trường QA riêng

**Gói2.2:** `v1-editorial.ts` đọc nhómMệnh trong frozencontinuousreport đúngsnapshot, kiểmreceipt/nhánh/chínhtinh/điềukiện qua evaluatorcũ; khôngrenderlạiV1. V1primarycómetadata nguồn/ngoạilệ/statusdraft, khôngchứngnhậnđúngđờithật. Retrieval1.1 chỉthêmclaimkhớp, textđãresolve, loại trùngruleV1, phươngphápnền táchriêng. Promptregistrychọnđúng `job.prompt_version` (1.0giữnguyên,1.1chojobmới). Workercóreadingscope/maxnewprocess; chếđộrevalidateoutputphảicóreadingIDvàallowCreatefalse,GETcùngID/attempt,giữmetricscũ. Khôngqueue/bảng/migrationmới. [Kiểm](TESTING.md#ai-menh-package22-testing-20261028),[bàn giao](AI-MENH-PACKAGE22-HANDOFF.md).

**Bổ sung Gói2.1:** Background opt-in (`AI_MENH_BACKGROUND`, mặc địnhfalse), `store=true` khi bật để phục hồi response sau mất kết nối. CREATE một lần, callback lưuID/model/provider vào `ai_reading_attempts` có sẵn trước polling. `uncertain` cóID được cùngqueue claim và GET lại, không tăngattempt hoặc tạo response mới; khôngID không tựdispatch; GET404 chuyển lỗi khôngretry. Mỗi lượtpoll tối đa5phút rồi giữID cho đốisoát tiếp. Không thêm bảng/queue, không bật trênmain. Provider retention cần chốt trước tích hợp. [Kiểm và giới hạn](TESTING.md#ai-menh-package21-testing-20261027).

Luồng AI mới không thay engine hoặc renderer PDF/catalog. Các module trong `lib/ai/` tách facts, retrieval, prompt/schema, provider, store và worker. Chỉ `scripts/ai-worker.ts` xử lý queue AI; không thêm tác vụ vào `scripts/worker.ts` của thanh toán/email. SDK `openai@7.45.0` yêu cầu Node>=22; QA dùng24.19. Cấu hình mặc định `AI_MENH_ENABLED=false`, key/model chỉ server, không có model mặc định hoặc fallback.

1. POST tạo lá số lưu snapshot/receipt/frozen/policy như cũ, chỉ bản mới khi bật AI có `aiPolicy`. Sau lưu mới enqueue; marker đã lưu là outbox để worker đối soát nếu DB enqueue lỗi. Duplicate POST dùng đúng record đã lưu, không tạo phiên bản quyền mới.
2. `menhFacts` kiểm receipt/toàn vẹn và đọc snapshot, không tính/an sao lại. Đưa nạp âm/Cục/âm dương, các cung/sao/trạng thái, Thân, hình học tam hợp/xung/giáp và chứng nhận Tứ Hóa; thiếu dữ kiện giữ thiếu. Không gửi tên/email/ngày giờ sinh chính xác. Facts engine và geometry có ID/path riêng.
3. Retrieval chọn tối đa12 nhánh catalog theo sao/ngữ cảnh/nhánh đã khớp, cùng tối đa5 hồ sơ phương pháp từ kho riêng. Điều kiện/ngoại lệ/bất định và từng tác giả giữ riêng. Nhánh chỉ tham khảo không tự thành kết luận; không cần có claim mới được luận. Không đọc PDF toàn sách. Metadata predicate chỉ cho kiểm/AI, giao diện hiện điều kiện nguồn bằng tiếng Việt.
4. Migration011 tạo `ai_reading_jobs` và `ai_reading_attempts`, không sửa bảng cũ. Unique(reading_id,reading_hash,palace,edition), input/prompt/source packet lưu cố định. Claim bằng transaction/FOR UPDATE SKIP LOCKED; API bên ngoài chạy sau commit, không giữ lock DB trong lúc gọi mạng. Daily quota kiểm dưới advisory lock, mặc định20 job/ngày.
5. Worker dùng Responses/Structured Outputs, SDK retry=0, `store:false`, kiểm model qua Models API trước khi gọi sinh. Trạng thái model nhìn thấy chưa chứng minh model hỗ trợ đầy đủ Responses/schema; lỗi trả về được giữ, không đổi model khác. Sau phản hồi kiểm schema/8 phần/thứ tự/ID fact/nguồn và ràng buộc scope; actual model/usage/latency/response ID lưu từ server, không tin metadata do model tự viết. Giá chỉ ước tính khi operator đặt đủ rates, không tự đoán.
6. Completed là artifact bền vững, retry không overwrite. Lỗi đã biết có cooldown30s và tối đa3 attempt; không tự retry request tính phí. Timeout/mạng/5xx hoặc worker mất sau dispatch giữ uncertain; worker quá6phút không tự dispatch lại. Chưa có UI đối soát uncertain; operator cần kiểm provider trước khi cho phép thêm chi phí. Không bảo đảm exactly-once billing của hệ ngoài.
7. GET `/api/trial/readings/[id]/ai-menh` chỉ đọc; POST kiểm origin/sở hữu/marker và chỉ tạo hoặc retry Mệnh. Không nhận palace/model/raw output từ client. `AiMenhReading` đọc/poll từ server, hiển thị8 phần/căn cứ và nhãn AI hoặc MOCK; state gắn key theo reading ID. 11 cung khóa AI; catalog vẫn ở vùng biên tập riêng. Artifact hoàn thành vẫn đọc khi tắt tạo mới hoặc edition không còn được sinh, miễn quyền sở hữu còn hợp lệ.

**Đích hiện tại:** QA3111/database preview/kho riêng, database test khác hẳn. Chỉ áp011 ở hai DB riêng mới sau schema backup. Main chưa có bảng AI, QA3062/3070/3101 và worker thanh toán giữ nguyên. Không backfill lịch sử, đưa AI vào PDF cũ hoặc triển khai Gói 3. [Kiểm/bàn giao](V1-DELIVERY-PLAN.md#ai-menh-package2-20261027).

Tài liệu API đã kiểm: [Structured Outputs/Responses](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses), [SDK TypeScript chính thức](https://developers.openai.com/api/reference/typescript). Trang model công khai không chứng minh quyền tài khoản; phiên này không có key nên không chọn model live.

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
