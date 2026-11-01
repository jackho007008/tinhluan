# Kiểm Astra V2 thật — bị chặn bởi credit, 01/11/2026

**Chưa kiểm chứng được chất lượng V2. Hai response thật đều failed với `credit_balance_exhausted` (`insufficient_quota`); không có bài luận mới.** Đã dùng đủ2CREATE được duyệt, một Quan Lộc/một Tài Bạch;4GET đối soát tổng cộng, cùng responseID/attempt. Dừng API, không retryCREATE hoặc đổi model/schema để vượt lỗi. Không có kết quả giả thay bài thật.

## 1. Phiên bản, phạm vi và môi trường

Baseline thực tế `main@6c67fe6`, tracked/index sạch đầu phiên; chỉ `buu-dinh-7parts/` untracked và giữ nguyên. Không sửa code ứng dụng, prompt, validator, DB schema hoặc kết quả cũ. Chỉ tài liệu bàn giao và script/evidence private của phép thử. Node24.22.1, SDK OpenAI7.45.0; sử dụng OpenAI Docs tra tài liệu model/Background/Structured Outputs hiện hành.

Chủ dự án cho phép tối đa2CREATE gpt-6-astra, Quan Lộc/Tài Bạch, ngân sách khoảng3USD. Models GET bằng key server hiện có trả200/model đúng; điều này chỉ xác minh truy cập model, không xác nhận credit hoặc khả năng trả phí. Chưa đọc được trực tiếp credit/spending limit project qua bộ công cụ hiện có; không in key, đọc thông tin thanh toán hoặc yêu cầu gửi key qua chat. `.env` thật không bị sửa, model được cấu hình riêng đúng tên đã duyệt.

DB QA mới `tinhluan_ai_paidv2_real_qa_1793509246456`, cổng55449, instance/data riêng `.local/ai-paid-v2-real-20261101/pgdata`; restore bản sao QA vào instance mới, không migration/restore DB gốc. Web riêng3119 đọc bằng build V2 đã kiểm `lZKMw1LLmtrFCyWhZAS74`, key rỗng, không consumer/supervisor thường trực. QA3118 vẫn PID68941 trong các lượt trước/sau; không restart QA3062/3070 hoặc worker thanh toán.

Bản đánh giá mới `2c2ea82d-eb85-41a8-b993-78b15406cb21`, đơn test `2f36fe98-2448-4d75-ab22-db40f029dadb`, owner synthetic riêng. Thanh toán HMAC tổng hợp/test và giao frozen/grant dùng cơ chế hiện hành, chỉ đơn mới; không ngân hàng/SePay thật hoặc email ngoài môi trường test.

## 2. Đầu vào và giới hạn trước gọi

Dùng cùng snapshot QA các vòng trước, không tính/an lại engine; receipt hợp lệ. Snapshot hash `bbeaa031ed477ac4f5cd9c744cb8d8fa51f03c514a424397ae976e498ceed370`. Hai packet giữ nguyên159facts `paid-facts-1.1.0`, retrieval `paid-retrieval-1.2.0`, bằng packet dry-run P0 và đầu vào1.2. Cung gốc, điều kiện/ngoại lệ/provenance không đổi; không template chưa resolve. Khác biệt thực gửi là prompt `paid-palaces-vietnamese-2.0.0` và Structured Outputs `paid-reading-v2.0.0`; không tăng toàn packet để tạo chiều sâu.

Models GET1 lần preflight, SDK kiểm model1 lần trước mỗi CREATE: tổng3Models GET. Hai job mới queued/attempt0, snapshot/grant/inputhash kiểm trước dispatch; không uncertain cũ bị tạo lại. Chín cung khác cũng có outbox job theo pipeline nhưng không được claim, vẫn queued/attempt0.

Cấu hình hữu hạn: dailyCREATE2, attempt/job1, reservation1,50USD/request, budget nội bộ3USD, output tối đa12k, reasoning high. Dự toán trước gọi2,70USD với giả định60k input/bài đều ở cache-write và12k output/bài. Giá đối chiếu [model chính thức](https://developers.openai.com/api/docs/models/gpt-6-astra): Standard input10/cache-read1/cache-write12,50/output50USD mỗi triệu token. Không xem dự toán/reservation là hóa đơn hoặc hardcap provider.

Runner dùng worker/narrator/store hiện hành, chỉ scope hai job. Guard ghi reservation độc quyền, chặn POST lần hai/mismatch scope/model/attempt; GET chỉ receipt đã lưu. Background/store=true; backoff mặc định30/60/120 rồi tối đa300giây, cap12GET/attempt và24h, không reset. Không bật consumer toàn queue.

## 3. Kết quả thực và nguyên nhân

### Quan Lộc

- Job `ffb82925-87f7-48ba-8e68-f7205ef4ef29`, attempt `12e894f9-7227-4187-9f8b-a606e426ef3b`.
- Response `resp_00bd5bfce3bc788e006ae6c8b3cc7087d0a94a4c45ff930506`.
- Provider created **12:05:55 ngày01/11, UTC+7**. CREATE trả200/pending, ID được lưu trước đối soát. GET1 trả dữ liệu không có bài, worker lưu error/AI_INVALID_OUTPUT.
- GET2 cùng ID/attempt qua nhánh revalidateOutput GET-only hiện có xác nhận `status=failed`, error.type=`insufficient_quota`, error.code=`credit_balance_exhausted`, output0item, usage=null, completed_at=null. Không CREATE thay thế.
- DB sau kiểm: error, một attempt, hai backgroundchecks, result=null. Không có coverage/section V2 hợp lệ để đọc.

### Tài Bạch

- Job `ef1c5cbe-27c0-4957-bcd9-51cf82da8ee0`, attempt `e1fafffa-d4b5-4498-a34d-db5dc5322392`.
- Response `resp_0233f71b2856f0b5006ae6c8b52dc487d0bbb4f119a99cd372`.
- Provider created **12:05:57 ngày01/11, UTC+7**. CREATE trả200/pending, receipt lưu bền vững; GET1 dẫn tới cùng lỗi wrapper.
- GET2 cùng ID/attempt: failed/credit_balance_exhausted, output0item, usage=null, completed_at=null. DB error, một attempt, hai backgroundchecks, result=null.

Thông báo provider nêu không còn credit. Lỗi này thuộc project gắn với API key server đang dùng; không phải bằng chứng model không được cấp quyền, facts sai, schemaV2 sai hoặc bài thiếu chiều sâu. CREATE trả200 chỉ xác nhận nhận request/receipt, không bảo đảm sinh bài thành công. Không tuyên bố Structured Outputs V2 đã được nghiệm thu thật từ việc nhận receipt.

**Vấn đề quan sát được ở wrapper hiện hành:** provider failed có raw=null; worker gom thành AI_INVALID_OUTPUT và chưa lưu nguyên code/error từ Responses. Phải lấy response gốc mới phân biệt được billing với invalid output. Trong nhiệm vụ kiểm chứng này không sửa wrapper/validator hay tự requeue. Nên bổ sung phân loại/lưu error provider bằng mock trước vòng thật sau, nếu chủ dự án giao; không cần tạo queue mới.

## 4. Usage, thời gian và chi phí

- Thực tế **2CREATE,4Responses GET,3Models GET**, không model/cung khác hoặc Luna. Mỗi cung1CREATE/2GET/1attempt. Không request phát sinh từ refresh hoặc mở lại.
- Provider **không trả usage** ở cả hai response. Input/output/reasoning/cached-read/cache-write và chi phí thực/ước theo usage đều **chưa xác định**, không phải0. Các số0 trong attempt là default của parser khi thiếu counter, đã tách thành `storedUsageDefaults` trong metrics; `usage=null`, `usageReported=false`, estimatedCostUsd=null.
- Không có timestamp hoàn thành provider, nên không báo thời gian sinh bài. GET đầu quan sát lỗi khoảng34giây sau created; GET chẩn đoán lúc12:17:25/12:17:26 gồm thời gian operator kiểm code, không phải thời gian model suy luận. Queue trước claim305,676/308,023giây gồm chuẩn bị/operator, không benchmark hệ thống.
- Không có hóa đơn project để đối chiếu. Không kết luận đã tiêu0USD hoặc3USD. Không suy ETA11cung từ hai request failed.

## 5. So sánh với1.2 và nghiệm thu nội dung

[Quan Lộc1.2](../.local/ai-paid12-real-20261101/quan-loc-reading.md) và [Tài Bạch1.2](../.local/ai-paid12-real-20261101/tai-bach-reading.md) vẫn nguyên văn. Đã đọc lại toàn văn hai bài đối chứng; các điểm lặp quyền–trách nhiệm ở Quan và thiếu Liêm–Hao ở Tài vẫn như [đánh giá1.2](AI-PAID-ASTRA12-EVALUATION-20261101.md). Vòng này **không có toàn văn V2**, nên không thể kết luận V2 giảm lặp, sâu hơn, tự nhiên hơn hay đáng đọc hơn.

Đối chiếu đầu vào cho thấy facts/knowledge không đổi, prompt/schema đã chuyển theo thiết kế V2 thay tám kind bắt buộc bằng sections/paragraphs và coverage. Đây là so sánh hợp đồng đầu vào, không phải kết quả nội dung.

Cả hai bài V2 đều chưa đánh giá được chín tiêu chí đầu ra: đúng facts; phối hợp chính/phụ tinh; tam phương/tứ chính; Tứ Hóa/điều chỉnh; chiều sâu chủ đề; nguồn/căn cứ; văn phong; cụ thể/tự đối chiếu; không bịa/dự báo chắc chắn. Không chấm0/5, không lấy0section do lỗi API làm insufficient, không dùng bản mock hoặc bản đề xuất thay bài thật.

## 6. Chứng cứ private và kiểm lưu–mở/bảo toàn

- [Provider diagnostics đã lọc](../.local/ai-paid-v2-real-20261101/provider-diagnostics.json), [metrics](../.local/ai-paid-v2-real-20261101/metrics.json), [network ledger không header/key](../.local/ai-paid-v2-real-20261101/network-events.jsonl).
- Quan: [facts](../.local/ai-paid-v2-real-20261101/quan-loc-facts.json), [knowledge](../.local/ai-paid-v2-real-20261101/quan-loc-knowledge.json), [instructions/input thực dùng](../.local/ai-paid-v2-real-20261101/quan-loc-prompt.md), [packet/hash/version](../.local/ai-paid-v2-real-20261101/quan-loc-input.json).
- Tài: [facts](../.local/ai-paid-v2-real-20261101/tai-bach-facts.json), [knowledge](../.local/ai-paid-v2-real-20261101/tai-bach-knowledge.json), [instructions/input](../.local/ai-paid-v2-real-20261101/tai-bach-prompt.md), [packet/hash/version](../.local/ai-paid-v2-real-20261101/tai-bach-input.json).
- [Bảo toàn job/scope](../.local/ai-paid-v2-real-20261101/preservation-and-read.json), [HTTP/quyền/mở lại](../.local/ai-paid-v2-real-20261101/http-verification.json), [dừng QA riêng](../.local/ai-paid-v2-real-20261101/shutdown.json).

API đúng owner synthetic trả200/eligibletrue, processed0/completed0/stateattention; Quan/Tài error/resultkhôngcó. Không phiên404. Tải trang đơn200 và GET lặp sau đó không đổi payload/job/attempt/ledger; quyền test còn, thư viện có bản lưu; snapshot và Mệnh V1/Luna không bị sửa. Đây là kiểm HTTP/hàm quyền, **không kiểm browser hoặc tạo recovery fixture mới trong vòng này**.

44job cũ (18queued) và attempt trong clone giữ nguyên;9job mới ngoài phạm vi queued/attempt0.35artifact cũ (16đối chứng +19vòng1.2) khớp hash. Không cập nhật kết quảcompleted cũ. Không sửa quyền/đơn lịch sử hoặc kết nối DB chính. QA3118 vẫn PID68941; cổngQA3062/3070 không listening trong các lượt đầu/cuối, không tuyên bố smoke được hai runtime đó.

Consumer hữu hạn đã kết thúc; web3119 PID74225 và PostgreSQL55449 PID74014 đã đối chiếu PID/cwd/datadir rồi dừng, giữ dữ liệu/receipt/log private. Không thay QA3118 hoặc instance55448, không worker/supervisor thường trực. Không `.env`/key/cookie/session vào Git/log/bàn giao.

## 7. Điểm dừng và bước cần thiết

Chủ dự án cần kiểm/nạp credit cho đúng project của key server đang dùng. Không yêu cầu gửi key qua chat. Hai CREATE của vòng này đã dùng hết; **nạp credit không tự cấp quyền retry**. Muốn thử lại cần quyền mới với report/attempt mới hợp lệ và ngân sách rõ, giữ hai failed receipts này để truy vết, không reset cap hoặc thay uncertain thiếu căn cứ.

Trước vòng sau nên xử lý việc mất mã lỗi billing ở wrapper và kiểm bằng mock nếu được giao. Chất lượng/schema thựcV2, token/chi phí, thời gian và so sánh với1.2 vẫn chưa nghiệm thu. Không cập nhật QA3062/3070, mở bán/Live hoặc xử lý queue khác.

Task chỉ bổ sung tài liệu; không chạy lại test/build/typecheck/E2E/PDF ứng dụng.84test/build của6c67fe6 là bằng chứng mock trước đó, không phải lượt mới hoặc kiểm provider thành công. Lần này đã thực hiện Models GET,2CREATE/4GET thật, quan sát failed response, đọc quyền/DB/HTTP, kiểm hash và dừng đúng QA riêng.
