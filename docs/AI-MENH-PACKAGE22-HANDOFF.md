# Gói 2.2 — khôi phục job Mệnh và dùng V1 làm nguồn biên tập

Ngày 28/10/2026. Baseline `main@858dc92`, tracked/index sạch lúc bắt đầu; giữ thư mục Bửu Đình. Chỉ QA3111, không cập nhật QA3062/3070 hoặc worker chính.

## Job đang chờ và cách xử lý

Web thực tế: cổng3111, checkout `.local/ai-menh-package2-20261027/qa`, PID đầu59187, PID sau build53543; database/kho QA riêng. Không có AI worker. Queue có2queued,5completed,2error,1uncertain. Job mục tiêu queued/0attempt/khôngresponseID, prompt1.0 và input đã lưu. Nguyên nhân chờ là worker dừng có chủ đích ở Gói2.1, không phải API tạo yêu cầu không lưu hoặc queue mất job.

Đã chạy đúng worker AI QA riêng, giới hạn `AI_MENH_READING_ID` vào lá số mục tiêu và `AI_MENH_MAX_NEW_JOBS=1`. Chế độ có phạm vi không reconcile outbox toàn kho; claim và stale check đều theo readingID. Không thêm queue/bảng/migration.

Chuỗi thực tế: queued0 → running1/córesponseID → providercompleted nhưng validation từ chối → GET-only đối soát → completed1. Lần từ chối đầu là false positive: câu nói không được suy đoán tuổi thọ bị regex cũ nhận như dự đoán. Sửa nhận diện phủ định hẹp; vẫn chặn số tuổi, câu tương phản và dự đoán thật. Không sửa nguyên văn bài để làm test xanh.

`AI_MENH_REVALIDATE_OUTPUT=true` bắt buộc readingID và `allowCreate=false`, chỉ lấy lại response đã biết. Dùng cùngattempt/responseID, giữ thời gian/giá gốc. Worker tự thoát sau hạn mức hoặc hết việc của ID được cấp. Không bật dịch vụ tiêu thụ queue thường trực.

**Trạng thái cuối:** mục tiêu completed/1attempt; một jobqueued khác còn nguyên,9job ngoài phạm vi không đổi,5completed cũ và1uncertain cũ nguyên. Worker QA **đang dừng đúng hạn mức**, không có process AI chạy chồng. Đây là khôi phục cho job được cấp quyền; các lá số mới khác vẫn cần worker được chạy trong hạn mức cho phép. Không tự chạy API tiếp trước đánh giá của chủ dự án.

## Bài API thật duy nhất trong task

Model `gpt-6-astra`;14990input/6504output token, trong output có2973reasoning token, cached input0. Thời gian ban đầu129,276giây; chi phí ước tính **$0,47510**, theo [giá Standard](https://developers.openai.com/api/docs/pricing?latest-pricing=standard)10/1/50 USD mỗi triệu input/cache/output. GET đối soát không tạo response mới; không cộng thời gian chờ operator vào độ trễ API. Đây không phải hóa đơn.

[Toàn văn bài](../.local/ai-menh-package22-20261028/target-reading.txt), [kết quả có cấu trúc](../.local/ai-menh-package22-20261028/target-result.json), [usage/attempt](../.local/ai-menh-package22-20261028/target-run.json), [bảo toàn nội dung provider](../.local/ai-menh-package22-20261028/preservation.json), [ảnh hoàn thành](../.local/ai-menh-package22-20261028/completed.jpg). Không đưa tên/ngày giờ sinh vào các file bàn giao này.

[Input gốc thực dùng](../.local/ai-menh-package22-20261028/target-input-original.json), [prompt1.0 gốc](../.local/ai-menh-package22-20261028/target-prompt-original.txt) và [chẩn đoán lỗi nhận diện](../.local/ai-menh-package22-20261028/diagnosis.json) được tách khỏi preview1.1; không nhầm bài đang hiển thị là bài đã dùng đầu vào mới.

**Bài này giữ prompt `menh-vietnamese-1.0.0` và input gốc của yêu cầu đang chờ.** Không đổi nội dung yêu cầu giữa lúc xử lý. Prompt1.0 lưu riêng, hash khớp baseline; worker chọn đúng `job.prompt_version`, không lấy mặc định mới rồi ghi nhãn cũ. Không gọi thêm API để thử prompt1.1 hoặc tối ưu lời.

## V1 lấy từ đâu và dùng được đến đâu

- Nguồn dựng V1: `lib/internal-review/tanbien-reading.ts` dùng evaluator `lib/interpretation-rules/execute.ts`, derived facts và rule/catalog theo snapshot. Chọn đoạn bằng facts, điều kiện, ngoại lệ, trạng thái sao/cung; không theo tên, ID hoặc ngày sinh mẫu.
- Nguồn adapter đọc: `record.frozen.continuousReport`, phiên bản `continuous-report-1.14.0`, đúng cung Mệnh và các nhóm đã phối hợp bởi `continuous-report.ts`. Lấy văn đã biên tập, không dựng lại hoặc ghi đè V1.
- Kiểm receipt/snapshotID/địa chi/chính tinh, đối chiếu điều kiện của chính rule đã lưu qua evaluator hiện có. Khác snapshot hoặc thiếu V1 thì bỏ nguồn V1 ấy; fallback sang facts và luận điểm sách thật sự khớp.
- Mỗi đoạn giữ rule IDs, source references, điều kiện, ngoại lệ, unknowns và metadata `certification=editorial-reference-not-expert-approved`. Các rule được chọn trong hồ sơ mục tiêu có status `draft`; có nguồn và đã biên tập không đồng nghĩa chứng nhận chuyên môn hoặc đúng thực nghiệm. Không nâng trạng thái review.

Hồ sơ mục tiêu có10nhóm V1 Mệnh, dùng9, loại1nhóm Thân–Quan về công danh để giữ phạm vi; vị trí Thân vẫn có trong facts. [Preview V1 đầu vào1.1](../.local/ai-menh-package22-20261028/target-input-preview-1.1.json), không gửi API. A/B/C giữ5/4/5nhóm; đây là đếm nhóm, không phải tỷ lệ hoàn chỉnh Mệnh. A/B vốn thiếu chú giải riêng tổ hợp, không biến số nhóm thành chứng cứ đầy đủ.

## Prompt1.1 và retrieval1.1

Thứ tự: facts quyết định dữ kiện → V1 đúng snapshot làm nền biên tập ưu tiên → luận điểm sách khớp điều kiện → phương pháp nền. Không xem V1 là chân lý, không chỉ viết lại từng đoạn. Yêu cầu tổng hợp chính/phụ tinh và cung chiếu, giữ tác giả/điều kiện và mức suy luận riêng; không bịa sự kiện, tính cách hay tương lai.

Retrieval bỏ xếp hạng từ khóa làm điều kiện áp dụng. Dùng evaluator hiện có cho luận điểm cá nhân, loại nhánh false/missing/exception/conflict-withheld, dùng text đã kết xuất; loại template cả dạng dở. Bỏ nguồn sách trùng rule đã có trong V1; tách `matched-v1-editorial`, `matched-snapshot`, `background-method`. Chỉ đọc vài hồ sơ phương pháp đã xử lý, không quét PDF hoặc xây rule mới.

Prompt `menh-vietnamese-1.1.0` giữ schema8phần nhưng yêu cầu mỗi phần phát triển ý khác, giải thích vai trò sao thay vì liệt kê; không giả danh chuyên gia. Cấm thuật ngữ nội bộ trong thân bài/giới hạn, giảm câu rào lặp, giữ giới hạn quan trọng sát nhận định và ở cuối bài. Validator mới kiểm từ kỹ thuật với input1.1; bài/input cũ giữ cơ chế đọc và phiên bản cũ.

## Dry-run A/B/C — 0API

- **A:** tri thức16→9; nhánhfalse7→0; template4→0; V1 giữ5/5nhóm; payload53908→40605byte. [Input mới](../.local/ai-menh-package22-20261028/A/input-new.json), [prompt dựng](../.local/ai-menh-package22-20261028/A/prompt-new.txt).
- **B:** tri thức17→7; nhánhfalse8→0; template3→0; V1 giữ4/4nhóm; payload54286→36441byte. [Input mới](../.local/ai-menh-package22-20261028/B/input-new.json), [prompt dựng](../.local/ai-menh-package22-20261028/B/prompt-new.txt).
- **C:** tri thức16→8; nhánhfalse7→0; template3→0; V1 giữ5/5nhóm; payload57059→38486byte. [Input mới](../.local/ai-menh-package22-20261028/C/input-new.json), [prompt dựng](../.local/ai-menh-package22-20261028/C/prompt-new.txt).

Facts/snapshot của cả3giữ nguyên. [So sánh máy đọc được](../.local/ai-menh-package22-20261028/dry-run.json). Không tạo lại hoặc thay ba bài Gói2.1. Đây là kiểm cấu trúc/chọn nguồn, **chưa phải bằng chứng chất lượng văn prompt1.1 đã tăng**; chưa có bài API thật với prompt1.1.

## Kiểm đã chạy và bảo toàn

- 28/28testAI trên DBtest riêng:22ca cũ và6ca V1 đúng/crosssnapshot/fallback/template; prompt cũ; scope/budget; phủ định so với dự đoán thật/thuật ngữ nội bộ; GET-onlyrevalidate không thêmattempt, giữmetrics. Typecheck/build QA cuối đạt; không fullE2E/PDF.
- Browser sở hữu thật mở lại bài mục tiêu sau build:4tab,8phần,11khóa, completed. Không dùng ID thay quyền truy cập; không đổi ownership phía server.
- Snapshot/V1/input job mục tiêu giữ hash; nguyên văn lưu bằng provider output.9job khác giữ trạng thái/hash/attempt/responseID, không tự retry uncertain. Main282file/8bảng và QA3062/3070/3101/worker thanh toán được đối chiếu nguyên; không migration chính/Live/quyền/đơn/webhook/Google/Toàn thư.

[Verification](../.local/ai-menh-package22-20261028/verification.json), [test](../.local/ai-menh-package22-20261028/test.log), [typecheck](../.local/ai-menh-package22-20261028/typecheck.log), [build](../.local/ai-menh-package22-20261028/build.log). Cảnh báo nhiều lockfile đã có giữ nguyên, build thành công.

## Còn tồn đọng

1. Chủ dự án chưa đánh giá lời của prompt1.1; không chạy thêm API để chỉnh nội dung. V1 sạch hơn không giải hết chiều sâu tổ hợp còn thiếu trong V1/tri thức.
2. Worker thường trực chưa bật;1job khác vẫn chờ do giới hạn task. Không để một lần khôi phục hút cả backlog.
3. Unknown không có responseID vẫn cần đối soát, không CREATE lại; retention `store=true` và vận hành trước main vẫn cần chốt. Regex không chứng minh toàn bộ nghĩa ngôn ngữ tự nhiên an toàn.
4. Không cập nhật QA3062/3070/worker chính, không triển khai11cung hoặc Gói3.
