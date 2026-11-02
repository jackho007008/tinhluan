# Sắc thái nguồn trong đầu vào bài trả phí mới

02/11/2026, baseline `main@fe08f9f`; tracked/index sạch lúc bắt đầu, giữ `buu-dinh-7parts/`, `docs/handoff/`. Thực hiện yêu cầu đưa [các sửa đã đối chiếu nguồn](AI-PAID-READING-SOURCE-FIDELITY-20261102.md) vào đầu vào Astra cho bài mới. **Không gọi API, không chạy worker/consumer/supervisor, không cập nhật QA3062/3070 hoặc dịch vụ khác.**

## Thay đổi thực tế

Input tạo mới có `knowledgeVersion=paid-retrieval-1.12.0`, kèm hiệu đính `paid-source-fidelity-1.0.0` trên đúng ba nguồn. Giữ facts1.1, prompt2.6, ReadingV2, modelconfig, schema đầu ra, quyền, offer, queue và ngân sách hiện hành. Không migration, không thêm rule TửVi hoặc nguồn/đơn vị thư viện mới.

- **Quan Lộc:** chỉ nguồnC từ Tài có đúng rule`tanbien.r06`, một nguồn đơn, metadataTài, tham chiếu TânBiên190 và đã matched. Text mới phân biệt lời cạnh tranh/làmgiàu của tác giả với kết quả tích lũy được bảo đảm. Giữ Tài là cung gốc và C/context, không nâng thành luận trực tiếp ởQuan. Không viết lại đoạn tổng hợp nhiều rule hoặc lời tương tự từ tác giả khác.
- **Nô Bộc:** chỉ unit`hs125-luong-general-disposition` đã được library nhận đúng digest/neo và là B/foundation/reference-only. Nghĩa khoanhòa cho cảđắc/hãm được giữ như hình tượng để phân tích; không gán phẩm chất người đọc/bạn bè hoặc nhận phép Lương–Lộc trực tiếp. Không áp nhánh độ sáng khác bảng snapshot.
- **Phu Thê:** chỉ unit`thp2-phu-ta-huu` đúng digest/neo, tọaPhu và B/direct. Có đủ thườngthường, từngtrợgiúp trongmộtgiaiđoạn, nhiều chỗ va chạmrồimớihợp. Limit giữ rõ không biến trình tự thành cứ va chạm sẽ hòa hợp hoặc trợ giúp suốtđời. Điều kiện chưa xét hết phụ/hung/phi/tựhóa, vế không được dùng và giới hạn Phá–Đà–Hỏa vẫn nguyên.

Hiệu đính là hàm thuần, không chọn lời bằng tên, reportID hoặc ngày sinh. Nó chỉ nhận metadata nguồn đã qua evaluator/library, không tự quyết một nhánh lá số. Library vẫn kiểm trang/hash/neo trước; hai unit thư viện còn cần digest gốc khớp bản đã rà. Digest hoặc phạm vi khác không được tự nhận hiệu đính này; không phải vì thế mà mọi nguồn mới đều bị loại.

Giữ nguyên `id`, role A/B/C/D, application, subject, conditions, references, provenance và các neo. Chỉ thay text, thêm một limit, thêm `sourceReview` gồm version/hash text gốc/hash bản hiệu đính. `passage.digest` vẫn là digest unit thư viện gốc; `sourceReview.reviewDigest` là dấu vết hiệu đính riêng, không tên sách/trang hay chứng nhận chuyên môn. Canonicalindex, V1 gốc và snapshot không bị ghi lại.

## Vị trí tích hợp và tương thích bản lưu

`paidLibrary` hiệu đính sau kiểm điều kiện/hash và **trước** cap4/14KB. `paidKnowledge` hiệu đính nguồnV1 trước selectorC8/24KB; hàm nhận lại một nguồn đã hiệu đính sẽ không nhân limit hoặc đổi digest lần nữa. Các cap không đổi.

`paidInput` mới tiếp tục đi qua serializer`paidUserInput` vào Responses API hiện có. Không chèn bản luận viết sẵn thay kết quả model; chỉ thay phần tri thức được gửi cho lần tạo mới. Prompt2.6 đã có hướng dẫn giữ điều kiện/phân vai và không cần sửa trong task này; outputvalidator/registry CREATE–GET giữ nguyên.

Đã kiểm code: `reconcilePaidOrders` bỏ qua job đã có và lưu trọn input/input_hash/prompt khi tạo job; worker dùng `job.input`/`job.prompt_version`, không gọi lại paidInput để đọc job cũ. GET đối soát không đi qua lớp hiệu đính. Vì vậy job đã lưu, kể cả queued/uncertain, tiếp tục dùng input cũ; không tự requeue hoặc CREATE thay. Việc cập nhật code không tự tạo job.

Chưa cập nhật runtimeQA nào. Bản build cách ly chỉ để kiểm; không nói rằng web/worker đang phục vụ đã dùng retrieval1.12. Khi có quyền triển khai sau này cần đúng code và bundleprivate hiện hành, không chỉ commit tài liệu. Không cần chuyển hay sửa canonicalindex để áp lớp hiệu đính này; thiếu thư viện thì hành vi failclosed/fallback cũ vẫn giữ.

## Mock, dry-run và giới hạn dung lượng

**190/190test liên quan,11file đạt trên mã cuối.** File mới có19test: đúngnguồn/phạmvi/hash, immutable/idempotent, metadata sai, mấtneo, giữfoundation/C, budget, mockHTTPResponses và inputcũ. Cập nhật duy nhất kỳ vọng version hiện hành ở adapter; không đổi expected nội dung sách/lịch sử cho xanh.

- HTTPmock đi qua SDK/provider hiện có, kiểm payloadCREATE của cảQuan/Nô/Phu thực sự chứa bảntext/limit/sourceReview mới, Background vàschemaV2. Input1.11 đã lưu được GET đúng responseID với0POST, không đổi bytes và không ghi receipt mới. Đây là mock, không kiểm quyền model hoặc dịch vụ OpenAI thật.
- Dry11cung trên snapshot đã lưu: **159facts/cung nguyên**, chỉ1nguồn ở mỗiQuan/Nô/Phu đổi; tám cung khác có knowledge nguyên byte. Số nguồn và sourceIDs đã chọn trên mẫu giữ nguyên. Serializer chứa đúng các thay đổi;3bản biên tập mock mới qua validator2.6 với input1.12, không gọi chúng là outputAstra.
- Dung lượng inputJSON trên mẫu: Quan96051→96445byte, Nô84338→84782, Phu89775→90352. Đây là byte, **không token/chi phí provider**. C củaQuan14793/14817byte, vẫn8nguồn; libraryNô7174/14000, Phu4151/14000. Không tăng cap để chứa lời dài.
- **8bài thật cũ** qua đúng savedprompt/validator và giữhash;21artifactbundle nguồn,19artifactbaseline gồm kết quả/input cũ/index/V1/snapshot giữhash. MệnhV1/Luna, Tậtinsufficient và bài đã lưu không bị sửa. Không thực hiện quyền/DBintegration mới; các module quyền và lưu không thay.

Lượt đầu19test mới và suite190đạt, nhưng dry đầu phát hiện Quan giảm15→14nguồn do thêm lời dài làm rơi1C củaMệnh. Sau lần rút gọn đầu vẫn thiếu; rút câu lặp tiếp thì dry cuối giữ đủ15nguồn và cap cũ. **Giữ hai logfail và baseline, không nới expected hoặc tăng ngân sách.** Chạy lại190test, typecheck/build sau sửa cuối, đều đạt. Đây là lý do kiểm lại, không vòng tối ưu API.

[Tests cuối](../.local/ai-paid-source-input-20261102/tests-final-2.log) · [Dryfail1](../.local/ai-paid-source-input-20261102/dry-1.log) · [Dryfail2](../.local/ai-paid-source-input-20261102/dry-2.log) · [Dry cuối](../.local/ai-paid-source-input-20261102/dry-final.log) · [Input mới, thay đổi từng nguồn và số đo](../.local/ai-paid-source-input-20261102/summary.json) · [Scriptdry](../.local/ai-paid-source-input-20261102/dry-run.ts).

## Typecheck/build và bảo toàn

Node24.22.1; test/typecheck không nạp `.env`, keyrỗng/AI tắt/DBcổng1, chặnfetch trừ HTTPmock do test cài. Không đọc hoặc ghi key thật. Typecheck`--noEmit --incremental false` đạt. Build Next15.5.27 trên bản sao nguồn riêng trong`.local`, không dùng hoặc thay `.next` đang phục vụ. BUILD_ID cuối **`bvFnKq_rd3SNWSqtnTqso`**. Cảnh báo workspace-root nhiều lockfile giữ nguyên; không sửa hạ tầng để che cảnh báo.

[Typecheck](../.local/ai-paid-source-input-20261102/typecheck-final.log) · [Buildcuối](../.local/ai-paid-source-input-20261102/build-final.log) · [Buildlượtđầu](../.local/ai-paid-source-input-20261102/build-1.log) · [Baselinehash](../.local/ai-paid-source-input-20261102/preservation-before.json).

Không E2E/PDF/browser/mobile vì không sửa UI hoặc PDF. Không DBmigration/DBwrite, worker, supervisor, payment/Live, deploy hay restart. **0CREATE/0GET OpenAI thật,0USD.** Không xác nhận model khả dụng hoặc chất lượng Astra mới từ các kiểm mock này.

## Checklist sau phiên

**90% từng cung:** PhụMẫu, PhúcĐức, ĐiềnTrạch, QuanLộc, NôBộc, ThiênDi, TậtÁch, TàiBạch, TửTức, PhuThê, HuynhĐệ. Giữ10tiêu chí/trọngsố/mẫusố/phạmvi và mọi status. Chỉ bổ sung bằng chứng nguồn/đầu vào mới;P09tất cảvẫnnot-verified, commercialReady=false. Tật90%là hồ sơT1, không lời sức khỏe cá nhân hoặc quyềnpublish.

Đã đưa các sửa vào inputfactory thực tế cho job mới, không dừng ở bản thảo. Chưa có kiểm Astra thật với retrieval1.12; không tự gọi API hoặc nâng90→100% để thay bằng chứng còn thiếu. Task dừng tại code, mock, typecheck/build cách ly và bàn giao này.
