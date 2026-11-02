# Phu, Tài và Tật T1 — đưa phần đủ căn cứ vào đầu vào mới

02/11/2026, baseline `main@6952371`. Tracked/index sạch lúc bắt đầu; giữ nguyên `buu-dinh-7parts/`, `docs/handoff/`. Thực hiện lô hữu hạn: tái dùng phiếu nguồn đã có cho ba khoảng thiếu, thêm ba đơn vị vào thư viện hiện hành, kiểm điều kiện/phân vai và input mới bằng mock. Điểm dừng là code, kho private và bằng chứng offline; không API hoặc triển khai runtime.

## 1. Phần nguồn đã đưa vào

Tái dùng [phiếu hai tổ hợp](AI-PAID-PAIR-SOURCE-REVIEW-20261102.md) và [ba chú giải có điều kiện](AI-PAID-CONTENT-BLOCKERS-REVIEW-20261102.md). Đối chiếu chữ đã xử lý, không đọc PDF/ảnh mới hoặc quét toàn sách. Bản bổ sung không coi việc thiếu câu nguyên văn về cả bộ là cấm tổng hợp; yêu cầu các tiền đề thực sự phù hợp và tách phần nguồn với phần diễn giải.

- **Tài Bạch — `tb41-tai-hao-scope`:** Tân Biên PDF41§3.27 vẫn giữ nghĩa hao trong mục chung Đại Hao–Tiểu Hao dù ghi đắc tại Dần/Thân/Mão/Dậu. Đối chiếu PDF190§12.2 và195§12.27, không biến nhãn đắc thành lời tụ tài. Đây là **B/foundation/reference-only**. Bộ chọn dùng tập con Liêm độc Dần/Thân có Đại Hao đã truy nguồn; điều kiện Liêm là phạm vi biên tập, không được gán thành điều kiện của câu gốc về Hao. Có thể tổng hợp với lời Liêm phù hợp để phân biệt tạo nguồn với giữ lại, chưa phải phép cộng trừ Liêm–Đại Hao hoặc kết quả tài sản cá nhân.
- **Phu Thê — `thp2-phu-combination-scope`:** Trung Châu, Tứ Hóa Phái2 PDF172 giữ riêng nữ mệnh của lời Đà;465–466 phân biệt tính hỏa của cung vị với Hỏa Tinh, bác phép Hỏa Tinh tự làm ôn hòa Phá. Đối chiếu699 không đổi lời phản bội/đả kích thành phẩm chất nhẹ hơn để áp cho khách hàng. Đây là **D/method/reference-only**, chỉ chọn khi Phá, Đà và Hỏa có neo cùng Phu đã truy nguồn. Không suy độ sáng Hỏa hoặc ghép thành lời về cả bộ ba. Phần trực tiếp đã đủ căn cứ như Tả/Hữu vẫn giữ nguyên, kể cả sắc thái trợ giúp qua một giai đoạn và trình tự “rồi mới”.
- **Tật T1 — `tb182-tat-t1-branches`:** Tân Biên181–182§11.1.8–9 có hai nhánh cứu/tác theo nhóm “nhiều” sao, đồng thời yêu cầu xét Mệnh–Thân–Phúc. Đây là **D/method/reference-only**, không phải lời sức khỏe. Không tự đặt ngưỡng “nhiều”, đổi Quyền/Tả/Hữu ở Quan/Phu thành tọa Tật, hoặc lấy Thiên Y đơn lẻ thay điều kiện nhóm. Vẫn phải phân biệt đồng cung/hội hợp theo từng câu, không tự chốt mọi lời chỉ xét tọa.

`reviewed` trong index là trạng thái trích xuất/biên tập đã rà điều kiện của Codex, **không phải chứng nhận chuyên môn bên ngoài, phê duyệt lời cá nhân hoặc quyền publish T1**. Tật vẫn không có nguồn trực tiếp và ứng dụng trả `insufficient` với0section.

## 2. Tích hợp thực tế và bảo toàn phiên bản

Input mới có `knowledgeVersion=paid-retrieval-1.13.0`. Giữ facts1.1, prompt `paid-palaces-vietnamese-2.6.0`, ReadingV2, model, queue, quyền, ngân sách và renderer. Không thêm pipeline, rule an sao hoặc schemaDB.

Loader hiện có ưu tiên `index-v113.json`, rồi v110/v17/v16/legacy. Index mới sai cấu trúc phải fail closed, không âm thầm lấy bản cũ. Trang/hash/neo/điều kiện và cap4unit/14000byte vẫn được kiểm. Tật được nhận **method**: index có direct/foundation cho Tật bị loại `tat-t1-method-only` trước khi chọn, không vô tình mở lời cá nhân trong tương lai.

Giữ capD3. Khi có phương pháp T1 mới, ưu tiên NPL15 về giới hạn phép cứu giải thay NPL07 về Mệnh vô chính diệu. Ở Phu, phương pháp mới thay NPL01 chung; NPL15 và NPL45 còn giữ. Không tăng toàn bộ packet để chứa thêm lời.

`paidUserInput` hiện có gửi đúng input mới. Không sửa `paid-store`, worker hoặc provider: job đã có tiếp tục dùng `job.input` và prompt đã lưu; GET đối soát không tái dựng input theo Git HEAD. Không ghi lại input/result cũ hoặc tự tạo/retry job. Mệnh V1/Luna không đổi.

Chưa deploy code hoặc kho này vào web/workerQA nào. Commit không tự làm runtime nhận retrieval1.13; khi được cấp quyền triển khai sau này phải chuyển cả code và bundle private đúng hash, không chỉ checkout mã.

## 3. Dry-run và mock

[Script](../.local/ai-paid-scope-input-20261102/dry-run.ts) · [Log](../.local/ai-paid-scope-input-20261102/dry.log) · [Input, số đo và khác biệt](../.local/ai-paid-scope-input-20261102/summary.json).

- Cả11cung trên snapshot đã lưu giữ **159facts/cung**. Tám cung ngoài Phu/Tài/Tật có knowledge nguyên; mọi nguồn được giữ lại ở ba cung cũng nguyên nội dung/metadata. Không dùng tên/reportID/ngày sinh để chọn lời.
- **Tài:**17→18nguồn, thêm nềnB; không loại nguồn cũ. Library7354/14000byte; C14656/14817byte. Input100167→101875byte.
- **Phu:**13→13nguồn, thêm phương phápD, bỏ NPL01 khỏi packet theo capD3; nguồn gốc không bị xóa. Library5783/14000byte; C9540/9540byte. Input90352→90811byte.
- **Tật:**6→6nguồn, thêm phương phápD, bỏ NPL07 khỏi packet và giữ NPL15. Library1531/14000byte; C4708/4708byte. Input78250→78317byte. Không direct, không phần luận cá nhân giả.
- Ba output mock hợp lệ: [Phu limited](../.local/ai-paid-scope-input-20261102/Phu-Thê-mock-result.json), [Tài limited](../.local/ai-paid-scope-input-20261102/Tài-Bạch-mock-result.json), [Tật insufficient](../.local/ai-paid-scope-input-20261102/Tật-Ách-mock-result.json). Phu dùng bản biên tập đã đối chiếu, không biến phương pháp thành luận mới. Tài thêm một đoạn đề xuất phân biệt tạo/giữ, có cả nguồn trực tiếp phù hợp và nềnHao, đánh dấu `ai-synthesis`. Đây là **bản đề xuất mock, không kết quả Astra**; không thay bài lưu.
-8bài API thật cũ qua đúng savedprompt/validator và giữ hash;19artifactbaseline,10bản biên tập cũ và21artifactbundle trước giữ hash. Snapshot không bị ghi lại.

Các số dung lượng là **byteJSON**, không phải token hoặc chi phí provider. Schema/neo hợp lệ không tự chứng minh văn bản đúng nguồn; giới hạn và cách tổng hợp ở mục1 đã được rà riêng theo phiếu chữ. Chưa có kiểm Astra thật với đầu vào mới hoặc bằng chứng chất lượng đầu ra mới.

## 4. Kho private và khả năng bàn giao

Giữ nguyên index-v110 với13unit; index-v113 có16unit,13unit đầu nguyên. [Ba đơn vị mới](../.local/ai-paid-scope-input-20261102/new-units.json) · [Index và hash nền](../.local/ai-paid-scope-input-20261102/baseline.json).

SHA256 index-v113: `edbc5a07cba95af330529cf4556ace5c29789e1e9a84fc5d876ca0a9cf1fb0c1`.

[Bundlemanifest31artifact](../.local/ai-paid-scope-input-20261102/bundle-manifest.json) và bản sao [source-bundle](../.local/ai-paid-scope-input-20261102/source-bundle/) chứa index cùng các trang chữ/asset đã được thư viện dùng. Đã kiểm hash cả nguồn và bản sao. Trang699 cũng được neo hash vì có trong giới hạn/đối chiếu của unitPhu. Sách/trang/indexprivate tiếp tục ngoàiGit và phần công khai; không thay ignore hoặc force-add. Không chuyển sách/asset này vào DB hoặc môi trườngQA đang chạy.

## 5. Kiểm thực sự đã chạy

**201/201test liên quan,12file đạt**, gồm11test mới trong `ai-paid-scope-input`: chọn đúng vai trò, điều kiện/neo, chỉ một chính tinh, không nâng B/D thành lời nguồn trực tiếp, chặn Tật ngoài method, index sai fail closed, budget và serializer. Suite còn giữ các kiểm provider HTTPmock và GET input cũ của lớp sắc thái nguồn. [Log201test](../.local/ai-paid-scope-input-20261102/tests-1.log).

Sau khi bổ sung riêng hash trang699 vào provenance, chạy lại **11/11test mới đạt**, dry11cung đạt và typecheck cuối đạt. Không đổi nội dung nguồn/expected để làm test xanh. Không có lượt mock thất bại trong lô này. [Log11testcuối](../.local/ai-paid-scope-input-20261102/tests-final-source.log) · [Typecheckcuối](../.local/ai-paid-scope-input-20261102/typecheck-final.log).

Node24, không nạp `.env`, keyrỗng/AI tắt/DBcổng1; chặnfetch ngoài mock do test cài. Typecheck `--noEmit --incremental false` đạt. BuildNext15.5.27 cách ly đạt, BUILD_ID **`mLri1ZzuxbCFsqvNaIuP6`**; không thay `.next` đang phục vụ. Cảnh báo nhiều lockfile/workspace root vẫn có, không sửa hạ tầng để che cảnh báo. [Buildlog](../.local/ai-paid-scope-input-20261102/build.log).

Không testDB/E2E/PDF/browser/mobile vì không đổi UI/quyền/PDF. Không consumer, supervisor, worker, deploy, restart, migration hoặc DBwrite. **0CREATE/0GET OpenAI thật,0USD.** QA3062/3070 và dịch vụ khác không được thao tác.

## 6. Tiến độ và phần còn mở

Theo checklist hiện có: **Phụ Mẫu90%; Phúc Đức90%; Điền Trạch90%; Quan Lộc90%; Nô Bộc90%; Thiên Di90%; Tật Ách90%; Tài Bạch90%; Tử Tức90%; Phu Thê90%; Huynh Đệ90%.** Giữ tiêu chí, trọng số, mẫu số và status. Đây là tiến độ hồ sơ trên mẫuQA, không %chất lượng hoặc sẵn sàng thu phí. Tật90% chỉ trong phạm viT1, chưa publish lời sức khỏe cá nhân.

Đã đưa phần đủ căn cứ vào inputfactory thật cho **bài mới**, thay vì chỉ giữ trong tài liệu. Chưa khép:

1. Cầu nối áp dụng đầy đủ cho Phá–Đà–Hỏa tạiPhu và Liêm–ĐạiHao tạiTài. Có các tiền đề riêng và tổng hợp giới hạn; không có quyền tự tạo phép chế hóa, kết quả ròng hoặc gán tính cách/sự kiện chắc chắn.
2. Ngưỡng “nhiều”, phạm vi hội hợp/điều kiện điều chỉnh TậtT1 và quyền xuất nội dung này. Method mới làm rõ nhánh cần kiểm, không chọn nhánh thay nguồn.
3. **P09: đầu ra model với input hiện hành chưa được kiểm.** Không đóng tiêu chí bằng mock, không nâng90→100% hoặc coi đã đạt thương mại. `commercialReady=false` giữ nguyên.

Không cần yêu cầu thêm sách một cách chung chung trong lượt này; những mệnh đề đã tìm thấy có vị trí và giới hạn rõ ở mục1. Task dừng tại nguồn/input/mock; chưa API, chưa publish hoặc cập nhật QA3062/3070.
