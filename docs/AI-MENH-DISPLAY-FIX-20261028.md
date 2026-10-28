# Sửa AI Mệnh không hiển thị — đúng phiên người dùng, 28/10/2026

## Phạm vi và nguyên nhân

Tái hiện trong chính tab và phiên sở hữu của chủ dự án tại `http://localhost:3111`, báo cáo `b69fb574-11bc-487f-8c67-b3a5e87b596f`. Báo cáo đã kiểm ở lượt trước là `32560e37…`; kết quả của nó không chứng minh báo cáo mới này hoạt động. Gói 2.2 đã được lưu riêng bằng commit `a025903` từ baseline `858dc92` trước thay đổi sửa lỗi này; giữ nguyên thư mục Bửu Đình.

Web trước sửa PID53543, cổng3111, checkout `.local/ai-menh-package2-20261027/qa`; database QA riêng. API trong phiên người dùng trả `state=not-created, queued=true, canRetry=false`. Database có đúng một job `ca789b2c-a3cf-44c6-8bfe-3a324ef3b8e2`, trạng thái queued/0attempt/không responseID, prompt `menh-vietnamese-1.1.0`. Queue toàn QA có2queued,6completed,2error,1uncertain; không có AI worker đang chạy.

**Nguyên nhân A:** worker QA đã dừng chủ động sau hạn mức lần trước. API đã lưu yêu cầu nhưng không có consumer xử lý. Không thấy bằng chứng worker claim lỗi, UI che lỗi job, cache completed cũ, sai database hoặc uncertain cho báo cáo mục tiêu. Cấu hình launch web/worker cùng database; nội dung API sau xử lý khớp hash nội dung database. `ps` trên máy không trả environment của web nên không dùng phép đọc đó làm bằng chứng cấu hình.

## Khắc phục và kết quả đúng báo cáo

Chạy riêng AI worker QA3111 PID62751 với `AI_MENH_READING_ID` là báo cáo mục tiêu, `AI_MENH_MAX_NEW_JOBS=1`; kiểm queued/0attempt/khôngID trước dispatch. Không reconcile outbox toàn kho, không claim job khác. Worker tự thoát sau đúng hạn mức, hiện **đã dừng**. Không bật consumer thường trực.

Chuỗi đã quan sát: queued0 → running1/cóID → completed1. Response `resp_0746d5760b9cbd77006ae1601f83a487d097526e8fba1e4933`. Đúng **1 CREATE mới trong lần sửa này**, SDK không retry CREATE, không fallback. Không cần đối soát/revalidate hoặc sửa văn đầu ra. Prompt1.1/input đã lưu của chính job được dùng nguyên trạng; không tạo lại bài để tối ưu nội dung.

Model `gpt-6-astra`;14113input/6677output token, gồm3624reasoning token trong output, cached0;136013ms. Ước tính **$0,47498** theo [giá Standard](https://developers.openai.com/api/docs/pricing?latest-pricing=standard)10/1/50 USD mỗi triệu input/cache/output; không phải hóa đơn. Dự toán trước dispatch khoảng $0,78 với trần12000output; cách tính bảo thủ theo byte văn bản khoảng $1,13, không phải báo giá cam kết.

[Bài luận đầy đủ](../.local/ai-menh-display-fix-20261028/reading.txt), [input thực gửi](../.local/ai-menh-display-fix-20261028/input.json), [prompt thực dùng](../.local/ai-menh-display-fix-20261028/prompt.txt), [kết quả lưu](../.local/ai-menh-display-fix-20261028/result.json), [đối chiếu database](../.local/ai-menh-display-fix-20261028/verification.json), [API đúng phiên](../.local/ai-menh-display-fix-20261028/api-proof.json), [ảnh trình duyệt](../.local/ai-menh-display-fix-20261028/completed.png). Bằng chứng bàn giao không chứa tên/ngày giờ sinh hoặc thông tin đăng nhập.

Trang đang mở tự chuyển sang Hoàn thành với8phần trước khi refresh. Sau build mới, refresh và rời trang rồi mở lại đúng URL đều completed/8phần; API trả completed, queued=false, hash nội dung bằng database.11cung khác vẫn `not-entitled`, database không có job AI cung khác. Không dùng ảnh một bài mẫu khác để kết luận.

## File và giao diện

- `components/AiMenhReading.tsx`: queued hiện “Đã xếp hàng”; chờ quá2phút có thông báo chưa bắt đầu, dịch vụ có thể tạm dừng/bận. Không giả định đang chạy hoặc tự chuyển job sang lỗi. Nút “Kiểm tra trạng thái” chỉ kích hoạt GET, không POST/create/retry; vẫn tự polling trạng thái.
- `lib/ai/contract.ts`, `lib/ai/store.ts`: thêm cờ đọc `queueDelayed` tính từ thời điểm xếp hàng, không sửa dữ liệu job hoặc snapshot. Job error/uncertain tiếp tục trả trạng thái lỗi và quy tắc retry cũ.
- `tests/ai-menh.test.ts`: thêm kiểm queue lâu không tạo attempt/job mới khi GET lặp, sau lỗi trả error thay vì pending. Không thay engine/queue/schema/quyền.

Chỉ build/restart web QA3111, PID53543→63815, Next build `4uptLummRjMraHbPf3YWn`. Nguồn phục vụ đối chiếu theo hash với các file đã kiểm. Không restart QA3062/3070/3101 hoặc worker thanh toán.

## Kiểm và giới hạn

29/29testAI trên database test riêng, typecheck và build đạt. Cảnh báo nhiều lockfile đã có, build thành công. Không fullE2E/PDF. [Test](../.local/ai-menh-display-fix-20261028/test.log), [typecheck](../.local/ai-menh-display-fix-20261028/typecheck.log), [build](../.local/ai-menh-display-fix-20261028/build.log), [mở lại](../.local/ai-menh-display-fix-20261028/reopen-proof.json), [11khóa](../.local/ai-menh-display-fix-20261028/locked-proof.json).

Thông báo chờ/nút GET còn được kiểm riêng trên một báo cáo đang queued khác của cùng phiên; job đó vẫn queued/0attempt, không gọi provider cho nó.10job ngoài mục tiêu giữ nguyên trạng thái/hash/attempt/responseID, gồm6completed và1uncertain cũ; snapshot/V1/input mục tiêu giữ nguyên. Main282file/8bảng và các tiến trình được bảo toàn đối chiếu nguyên.

**Giới hạn vận hành còn lại:**1job khác vẫn chờ, worker không chạy thường trực theo quyền chỉ xử lý một job lần này. Lá số mới tiếp theo vẫn có thể xếp hàng đến khi có consumer được phép; thông báo chờ rõ hơn không thay thế vận hành worker. Không tuyên bố toàn chức năng tạo bài mới tự động đã hoàn tất. Bài prompt1.1 này mới kiểm kỹ thuật, chưa có đánh giá chất lượng từ chủ dự án; không chạy API thêm để tối ưu. Không cập nhật QA3062/Gói3/11cung hoặc thay trạng thái uncertain thiếu căn cứ.
