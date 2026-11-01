# AI Paid Reading V2 — triển khai QA, 01/11/2026

**Đã triển khai và kiểm bằng mock trên QA3118; chưa kiểm Astra thật hoặc nghiệm thu chất lượng thương mại.** Baseline thực tế `main@8eb4393`, không phải49280a8. Đầu phiên tracked/index sạch, chỉ `buu-dinh-7parts/` untracked; giữ nguyên thư mục đó. Không đổi PAID_EDITION, offer, thanh toán, engine, Mệnh V1/Luna, PDF hoặc báo cáo lịch sử.

## 1. Contract và prompt

- Contract riêng `paid-reading-v2.0.0` tại `lib/ai/paid-reading-v2.ts`: schemaVersion, coverage, coverageNote, sections, limitations. Section có id/role/title/paragraphs; paragraph có text/basis/factIds/knowledgeIds.
- Tối đa8section, focused2–8, limited1–8, insufficient0. Không ép năm/tám phần hoặc số từ tối thiểu. ID phần duy nhất, không dùng role làm React key. Schema gửi provider không chứa refinement liên trường; server kiểm các ràng buộc sau parse.
- Prompt riêng `paid-palaces-vietnamese-2.0.0` tại `paid-prompt-v2.ts`: tổ chức theo ý có căn cứ, gộp lặp, không dựng chương chỉ để kể sao/giới hạn; tiếng Việt điềm đạm, tổng hợp có mức độ, giữ C ở cung gốc/D tham khảo và hạn chế Tật Ách. Các hàm prompt1.0/1.1/1.2 và body trong `paid-prompt.ts` giữ nguyên.
- `AI_PAID_READING_V2_ENABLED=false` mặc định, đã thêm vào `.env.example`. Reader hỗ trợ hai định dạng trước khi writer opt-in. Chỉ job mới do reconcile tạo khi cờ=true nhận promptV2; job đã tồn tại không bị cập nhật. `PAID_PROMPT` mặc định vẫn1.2.0 và `PAID_EDITION` vẫn `paid-palaces-ai-1.0.0`. Chỉ QA3118 bật cờV2 trong env riêng, không sửa `.env` thật.

Validator kiểm phiên bản, coverage/count, role, ID lặp, tham chiếu lạ, đoạn facts không giả làm lời nguồn; diễn giải không dùng facts upstream-unverified/source-conflict/engine-reported. Lời nguồn C chỉ được ở context và nói đúng tên cung gốc; D không làm source-interpretation hoặc căn cứ duy nhất cho ai-synthesis. Focused phải thực sự dẫn nguồn A/B trực tiếp, không chỉ có nguồn trong input rồi viết toàn facts. Kiểm guard trên coverageNote, ID/tiêu đề, mọi đoạn và limitations; kiểm cả cụm y khoa bị tách qua các field. Giữ nguyên medical guard cũ và ngoại lệ câu giới hạn hoàn chỉnh.

**Giới hạn kiểm tự động:** kiểm được cấu trúc/provenance và dấu hiệu cấm; không chứng minh ngữ nghĩa mọi câu đều suy ra đúng từ sách. Nêu đúng tên cung trong C không tự bảo đảm phép liên hệ đúng. Cần tiếp tục đọc toàn văn/căn cứ khi nghiệm thu thật; không gọi validator là thẩm định chuyên môn hoặc khả năng chống mọi suy diễn.

## 2. Chọn version cho CREATE/GET và lưu

`reconcilePaidOrders` chốt prompt_version khi INSERT job mới, không đổi unique/readHash/quyền. `provider.ts` chọn JSON schema theo promptVersion worker truyền từ job, không theo cờ writer hoặc HEAD tại thời điểm đối soát. Job paid thiếu version bị từ chối trước mọi network call. Phiên bản không hỗ trợ không fallback model/schema.

CREATE gửi schemaV1 hoặcV2 tương ứng. GET không gửi schema tạo mới; nhận response của receipt cũ rồi `worker.ts` gọi validator đúng job.prompt_version. Test chứng minh bật writerV2 khi jobV1 đang pending vẫn GET cùng responseID/attempt và lưu tám phầnV1. Không thay retry/backoff, lease, budget, queue, receipt hoặc model config.

`AiResult<T=Narration>` cho phép type nội dung paidV1/V2; mặc định của Mệnh cũ vẫn NarrationV1. Result JSONB hiện có lưu V2 tại `result.content.schemaVersion`, cùng envelope model/provider/promptVersion/facts/knowledge/usage/cost/timing. Không migration, không backfill hoặc ghi đè completed. Unique vẫn `(reading_id,reading_hash,palace,edition)`, không tự tạo phiên bản thứ hai trên cùng job. Tắt cờ writer không xóa V2 đã lưu; reader vẫn hỗ trợV2.

## 3. Reader và trạng thái giao nội dung

`readPaidContent` là decoder thuần dùng ở server/client: promptV1 đã biết phải parse đúng tám kind/thứ tự; promptV2 phải có marker/schemaV2 đúng. Không đoán V1 khi gặp version/shape không biết. Server đưa job đó sang trạng thái view `unsupported`, không gửi raw result xuống client; quyền/bản lưu giữ nguyên, không bật retry.

`PaidReadingContent.tsx` giữ nguyên văn/thứ tự tám phầnV1, V2 render section theo id và paragraph, có Xem căn cứ ở mỗi đoạn. Không JSON thô hoặc tám mục đệm. Căn cứ giữ facts, văn nguồn, tác giả/vị trí, điều kiện/giới hạn; không gắn AI lên văn catalog cũ.

`paid-progress.ts` chỉ tính view sau kiểm grant server hiện có:

- `processed`: số job completed về kỹ thuật, kể cả insufficient hoặc nội dung cần kiểm tra phiên bản.
- `completed`: số cung có bài V1 hoặcV2 focused/limited đọc được. Insufficient không được tính thành bài đã giao.
- `focused/limited/insufficient`: số nội dungV2 theo từng phạm vi, không điểm chất lượng.
- Khi11job đã xử lý và có limited/insufficient: `content-limited`, thông báo kết thúc có giới hạn, không quay loading/ETA vô hạn. Limited không được đổi thành “chuyên sâu”. Insufficient không tự retry; quyền mua còn nguyên.
- Khi có version không đọc được: attention/unsupported, không giả completed. Các lỗi/uncertain/reconciling và canRetry trước đây giữ semantics.
- Báo cáo toànV1 vẫn progress11/11/statecompleted như cũ. Mệnh miễn phí vẫn đường V1/Luna riêng.

## 4. QA riêng và ví dụ mock

DB mới `tinhluan_ai_paidv2_qa_1793504794263`, cổng55448, PostgreSQL PID68265; DB test riêng `tinhluan_ai_menh_paid31_test_v2_1793504794263`. Chỉ restore backup QA có kiểm soát vào hai DB mới, không migration/restore DB gốc. Dữ liệu đặt dưới `.local/ai-paid-v2-20261101`. Không tiêu thụ18queued gốc;44job/attempt cũ trong clone giữ nguyên sau kiểm.

WebQA3118: checkout `.local/ai-paid-v2-20261101/qa`, Node24.22.1, build cuối `lZKMw1LLmtrFCyWhZAS74`, PID68941. Web có key rỗng, baseURL API bị vô hiệu, maxnew/dailyCREATE0 và supervisor=false. Không consumer thường trực hoặc scheduler mới. Build riêng không ghi `.next` của QA khác. Web/DB QA riêng còn chạy để giữ môi trường; tab kiểm đã đóng, recovery đã thu hồi. QA3062/3070 không bị cập nhật/restart; hai cổng đó không listening ở các lượt kiểm đầu/cuối, không tuyên bố đã smoke runtime chính.

Báo cáo synthetic mới `32513f1d-f1bf-4f0f-9c5f-6992d1106961`, đơn test `34aa10f7-8e01-4373-955a-c459c58b9357`. Dùng snapshot QA có receipt đã lưu, không sửa/an lại engine. Thanh toán test HMAC → giao frozen/cấp grant →11job → gọi worker hiện có với narrator fixture, từng cung được chỉ định. Không narrator giả trong runtime production; fixture nằm tại `tests/fixtures/ai-paid-v2-mock.ts` và lời luôn có nhãn MÔ PHỎNG.

Kết quả mock: **11job/11attempt, processed11, có bài8 gồm1focused/7limited,3insufficient; statecontent-limited**. Đây là trạng thái kiểm kỹ thuật, không kết luận các cung đã có chất lượng chuyên môn.

- [Quan Lộc focused: hai section](../.local/ai-paid-v2-20261101/focused-mock.md), [result](../.local/ai-paid-v2-20261101/focused-mock.json).
- [Tài Bạch limited: một section](../.local/ai-paid-v2-20261101/limited-mock.md), [result](../.local/ai-paid-v2-20261101/limited-mock.json).
- [Nô Bộc insufficient: không section](../.local/ai-paid-v2-20261101/insufficient-mock.md), [result](../.local/ai-paid-v2-20261101/insufficient-mock.json).

Các ví dụ ngoài Git/private, không phải bài Astra hoặc lời luận nghiệm thu. Không phát sinh CREATE/GET OpenAI, không Luna, chi phí API0USD.

## 5. Kiểm thực sự đã chạy

**84/84 test trong7file**, chạy trên DB test55448/key rỗng, guard chặn fetch ngoài loopbackQA. Các file: ai-paid-v2, ai-paid-v2-db, ai-paid, ai-background, ai-paid-adapter, ai-paid-context, ai-paid-safety. [Log cuối](../.local/ai-paid-v2-20261101/tests.log), [log83test trước guard thiếu version](../.local/ai-paid-v2-20261101/tests-initial.log).

Các ca mới bao gồm focused2/4section, limited1/8section, insufficient0; count sai, role sai, ID lặp, nguồn lạ, C làm trực tiếp, D làm nguồn/nguồn duy nhất, facts chưa xác minh, focused viết toàn facts; guard y khoa trong note/title/paragraph/limitations/cụm tách field; V1 đầy đủ8và unknownversion; SDK CREATE/GET fetchmock với cờ writer trái version đã lưu; thiếu version0fetch. DB test giữ webhook lặp1grant,11job; xử lý cả ba coverage; đọc lặp không thêm job/attempt; retryinsufficient/completed không tái tạo; Mệnh/free record hash bất biến; V1 pending cùng receipt/attempt/prompt1.2 sau bậtV2.

Typecheck root đạt; build Next15.5.27 riêng Node24 đạt. Build đầu đã đạt; build cuối sau guard thiếu version cũng đạt và browser đã reload xác nhận. Không chạy toàn E2E/PDF hoặc gọi provider thật. [Build metadata](../.local/ai-paid-v2-20261101/build.json), [log build cuối](../.local/ai-paid-v2-20261101/build-final.log).

Browser thật trên đúng báo cáo QA3118 qua recovery hợp lệ: thấy focused2, limited1, insufficient0section; căn cứ từng đoạn mở được; Mệnh miễn phí vẫn hiện; refresh và rời trang sang trang lập lá số rồi mở lại nhận kết quả đã lưu. Lúc vừa tải trang có trạng thái kiểm tra ngắn trước GET trả về, sau đó kết thúc đúng, không chờ vô hạn. Kiểm thư viện bằng hàm server thấy liên kết đúng bản lưu; không tuyên bố đã đăng nhập Google hoặc thao tác thư viện bằng browser trong phiên recovery này.

Mobile360×800 và390×844: document.scrollWidth bằng360/390, không tràn; căn cứ mở ở390 vẫn vừa màn hình. [Browser proof](../.local/ai-paid-v2-20261101/browser-proof.json), [ảnh360focused](../.local/ai-paid-v2-20261101/mobile360-focused.png), [ảnh390limited](../.local/ai-paid-v2-20261101/mobile390-limited.png), [ảnh390insufficient](../.local/ai-paid-v2-20261101/mobile390-insufficient.png), [ảnh390tiến trình](../.local/ai-paid-v2-20261101/mobile390-progress.png). Viewport đã reset sau kiểm.

API không phiên/sai phiên404; đúng owner200, payload đọc lặp bằng nhau. Toàn bộ input/result/attempt/counter hash sau browser khớp trước kiểm;44job cũ/18queued trong clone giữ nguyên, snapshot/freeMenh của báo cáo mới giữ nguyên. Customer-order grant đúng1 và không bị thu hồi khi revoke recovery. [Biên nhận cuối](../.local/ai-paid-v2-20261101/final-verification.json).

## 6. Lỗi từng lượt và phục hồi fixture

- Typecheck đầu sau thêm test lỗi do đọc `.schemaVersion` trên union schemaV1/V2 trong assertion. Sửa assertion dùng toMatchObject, không sửa expected nguồn; typecheck/build sau đạt.
- Lượt dựng QA đầu dừng trước tạo order/job vì secret HMAC test chưa đủ32ký tự. Sửa cấu hình test riêng và thêm gate trước ghi; giữ một bản synthetic chưa có đơn/job từ lượt đó trong clone. Không thay cấu hình thanh toán thật.
- Guest `bindRecoveryEmail` không hỗ trợ owner_hash của customer-order; dừng trước insert binding. Auto-review tiếp tục từ chối tạo credential fixture vì cần quyền cụ thể. Chủ dự án sau đó trả lời **“Cho phép 1 fixture QA3118”**. Chỉ tạo đúng1binding cho synthetic owner đã có, đối chiếu DB/owner/link/order/grant, kiểm bằng `bindingReading`, local delivery và browser exchange hiện có. Không thêm endpoint, chèn cookie hoặc bypass kiểm quyền. Không external email.
- Sau UI, thu hồi binding và mọi token recovery liên quan, active0, credential thô trong mail/fixture đã loại bỏ. Không thu hồi customer-order grant, không sửa result/job.
- Một lượt kiểm bảo toàn bị false alarm do so Date object của pg với JSON đã serialize. Chuẩn hóa cùng JSON rồi hash,44job cũ khớp; không sửa dữ liệu để qua kiểm. Một số locator Playwright dùng chữ in hoa CSS/selector không duy nhất bị timeout; đọc lại AX và chọn đúng accordion, không sửa UI để né kiểm.

## 7. Phạm vi file thay đổi

Contract chung chỉ generic hóa typeAiResult, giữ mặc địnhV1. Paid-contract/provider/worker/paid-store thêm chọn phiên bản và view. Thêm paid-reading-v2/paid-version/paid-result/paid-prompt-v2/paid-progress; thêm rendererPaidReadingContent, nối PaidAiReading; thêm hai testfile và fixturemock; thêm cờ tắt mặc định trong.env.example. Tài liệu trạng thái/quyết định/kiến trúc/kiểm cập nhật theo task. Không đổi engine, facts adapter, retrieval/kho sách, DB schema, payment/offer/grant SQL, Mệnh renderer hoặc PDF.

## 8. Những điểm còn chặn và đề xuất vòng thật

Chưa kiểm model thật với JSON schemaV2, chất lượng văn, token/chi phí/thời gian hoặc tỷ lệ insufficient thực tế. Mock không dự báo độ sâu của Astra. Nguồn Liêm–Hao/Phá–Đà–Hỏa và các cung nền mỏng vẫn là giới hạn; V2 không tự khép khoảng trống. Nhãn focused không phải chứng nhận chuyên sâu hoặc quyền mở bán. Guard và ID không thay đọc đối chiếu toàn văn.

Đề xuất sau khi chủ dự án duyệt riêng: tối đa2CREATE Astra,1Quan Lộc+1Tài Bạch, cùng snapshot đối chứng nhưng report QA mới có grant hợp lệ, prompt2.0/schemaV2. Không tạo lại các job completed hiện có, không xử lý các cung khác, không retryuncertain hoặc tự fallback. Dự phòng khoảng3USD cho vòng, cần kiểm lại input/giá/credit và giới hạn project trước gọi; không coi dự phòng nội bộ là hardcap. Background/GET theo receipt và giới hạn sẵn có; đọc toàn văn cùng rubric9tiêu chí, đặc biệt mức lặp, phép nối nguồn và lý do coverage. Nếu kết quả limited/insufficient thì giữ đúng mức, không gọi thêm để nâng điểm.

Không có quyền gọi thật từ đề xuất này. QA3062/3070, SePayLive, thương mại, PDF AI, cải tiến concurrency/hạ tầng nằm ngoài task.
