# Gói 3.1 — QA AI 11 cung sau thanh toán

Ngày 29/10/2026. Baseline `2579fa1`, branch main; chỉ `buu-dinh-7parts/` chưa theo dõi khi bắt đầu, không sửa/stage. Chủ dự án đã cấp quyền triển khai QA riêng, mock trước; không có quyền cập nhật QA3062/3070 hoặc bật Live.

## Kết quả và giới hạn

QA riêng: `http://paid31.localhost:3113`, checkout `.local/ai-paid31-20261029/qa`, Node24.22.1. Build/PID cuối trong [runtime](../.local/ai-paid31-20261029/runtime.json) và [prepared](../.local/ai-paid31-20261029/prepared.json). Web và consumer **mock không key** đang chạy, không dùng worker thanh toán chính. Hai database mới có prefix `tinhluan_ai_menh_paid31_test_`/`tinhluan_ai_menh_paid31_qa_`; private configuration/backup/log trong `.local/ai-paid31-20261029` (không đưa file phiên đăng nhập vào Git hoặc bàn giao công khai).

Hai báo cáo engine thật với thông tin đầu vào tổng hợp, thanh toán bằng webhook **test tự ký**, không phải giao dịch từ ngân hàng/SePay-origin:

- `6a711ff1-4871-4478-abbb-6620f3522b00`: đã quan sát tự redirect, tiến trình 1/11 →9/11 →11/11; Mệnh7đoạn,2Lunaapproved.
- `8e8988f0-0468-418f-b6de-4ce52b1a142e`: đóng tab khi0/11; mở tab mới từ thư viện →11/11, mở Phụ Mẫu thấy8phần và căn cứ; refresh dùng nội dung đã lưu.

Mỗi báo cáo11job/11result, mỗi job1attempt,1grant/1paymenttransaction dù gửi webhook trùng. Không có job Mệnh. Provider/model hiển thị rõ mock. **0 OpenAI CREATE,0Luna/Astra thật,$0API.** Mock không chứng minh chất lượng luận, quyền model hiện tại, tốc độ/chi phí11cung hoặc ETA5phút. Chưa nghiệm thu chuyên môn Tật Ách; prompt chỉ cho chú giải truyền thống theo cấu trúc, không chẩn đoán/điều trị/tuổi thọ. Không gọi đây là bản mở bán.

## Kiến trúc

- Checkout mới được server gắn `aiEdition=paid-palaces-ai-1.0.0` chỉ khi `AI_PAID_ENABLED=true`, `CHECKOUT_TEST_ENABLED=true`, `SEPAY_LIVE_ENABLED=false`. Đơn/quyền cũ không được nâng thành AI edition.
- Dùng nguyên thanh toán/report worker/grant hiện có. Chỉ sau `paid`+`ready`+grant còn hiệu lực, AI consumer đối soát đơn/quyền như outbox và tạo11job trong **queue ai_reading_jobs hiện có**, advisorylock+unique key theo reading/hash/palace/edition. GET/refresh không enqueue.
- Facts từ snapshot đã lưu; adapter nhận cung đích, tính quan hệ cung từ vị trí có sẵn, không tự an sao. Retrieval chỉ dùng đoạn V1 đã render đúng snapshot/chủ đề, giữ nguồn/điều kiện/ngoại lệ/trạng thái, loại template; tối đa12mục. Nguồn ít phải nêu giới hạn, không tuyên bố đã bao phủ kho sách hoặc luận hoàn chỉnh11cung.
- `AI_PAID_READING_MODEL=gpt-6-astra` tách Luna biên tập Mệnh. Responses/StructuredOutputs dùng SDK hiện có, paid dùng background/store, SDKretry0; lưu responseID ngay khi nhận. Uncertain cóID chỉ GET đối soát cùngattempt; khôngID không tự CREATE lại. Retry chỉ lỗi đã biết, quyền còn hiệu lực, tối đa3attempt và cooldown, không đổi completed.
- Một consumer có mode paid dùng cùng claim/attempt/lock với Mệnh cũ. CLI thật `npm run worker:ai-paid` bắt buộc `AI_PAID_READING_ID` và `AI_PAID_MAX_NEW_JOBS=1..11`, chạy hữu hạn rồi thoát. Không tự chạy bằng key thật. Consumer mock riêng là harness, không phải queue mới; khóa vào DB local prefix QA và từ chối key/Live.
- Migration012 chỉ tạo `ai_paid_sources` lưu **chuỗi JSON gốc của checkout AI mới**, cùng canonicalhash. Lý do: JSONB đổi thứ tự key trong snapshot làm receipt cũ vốn băm JSON.stringify mất hiệu lực. Không sửa engine/receipt/báo cáo/quyền lịch sử; không backfill. Đã backup trước011/012 và áp chỉ2DB mới, main không có bảng AI.
- UI4tab không đổi. Poll GET4giây, đếm completed córesult thật X/11, thanh toán thành công/ETA tạm/đọc Mệnh/rời trang/thư viện/hoàn thành. Quá ETA tiếp tục; lỗi/uncertain giữ quyền và bài xong, retry tường minh. Không gửi lời AI chưa có quyền xuống client. Đường `/don-thu` từ thư viện đã bổ sung Mệnh miễn phí chỉ cho AI edition hợp lệ, không viết lại bản lưu/PDF.

Tài liệu API chính thức đã đối chiếu: [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [Background Responses](https://developers.openai.com/api/docs/guides/background). Không xác minh quyền project bằng API thật ở lượt này.

## Kiểm chứng

- **54/54test trong5file**:9paidintegration +30AI Mệnh +4V1edit +5V1review +6checkout. Scope DB riêng; typecheck/buildQA đạt. Không toànE2E/PDF.
- Paidtests: không sinh trước payment; owner/servergrant; webhook đồng thời;11job duy nhất; đơn cũ không upgrade;2consumer claim khác nhau;GET không tăngattempt; lỗi giữ quyền/retryidempotent; timeoutuncertain khôngCREATE; mockreceiptGET cùngattempt; đủ11mớicomplete; quáETAkhôngfail; revokechặnread/retry/claim màgiữresult; schema/reference/geometry/hash.
- Các lỗi đầu được giữ trong log: receipt invalid sau JSONB →thêmrawsource012; fixture cố đổi offer immutable →tạo đơn legacy riêng; rerun phụ thuộc thứ tựjobretry →cho test xử lý xong retry trước timeout, giữ assertion1attempt; không sửa expected nguồn/lịch sử. Bộ duyệt tự động từng từ chối đề xuất assertion dựa số thực tế; không áp cách đó.
- Harnessprepare lần đầu thiếu file mới do bộ lọc tên, đã sửa sync; một lệnh gọi Node dùng đường dẫn không tồn tại, chuyển đúng executable đã xác minh. Không coi lỗi công cụ là kiểm đạt.
- Mobile360/390:4tab, tiến trình, Mệnh,8phầnpaid/căn cứ, scrollWidth bằngviewport; ảnh [chờ360](../.local/ai-paid31-20261029/waiting-360.png), [đóng trang390](../.local/ai-paid31-20261029/leave-progress-390.png), [hoàn thành390](../.local/ai-paid31-20261029/completed-390.png), [bài390](../.local/ai-paid31-20261029/palace-390.png). Bằng chứngtrạng thái/attempt/result hash [trước](../.local/ai-paid31-20261029/audit-before-browser-refresh.json)/[sau](../.local/ai-paid31-20261029/audit-after-browser-refresh.json).
- Đăng nhậpQA là fixture account tổng hợp qua helper ephemeral local-only đã đóng sau một lần; không thêm endpoint auth vào app, không kiểm Google thật.
- Main8bảng/quyền/đơn/thanh toán/Toànthư và manifest bản đọc trước/sau, PIDs/start/cwd QA3062/3070/3101/3111+worker chính đối chiếu nguyên: [receipt bảo toàn](../.local/ai-paid31-20261029/protected-after.json). Không update/restart các dịch vụ này.

## Vận hành và việc còn chặn

Chỉ QA3113 dùng migration011/012 và flags mới. Rollback QA: dừng đúng web/consumer của runtime sau xác minh PID/cwd, giữ DB/private artifacts để đối soát; không restore/drop DB chính hoặc dịch vụ khác. Không chạy đồng thời worker thật/mock cùng DB. Consumer thật hiện là CLI hữu hạn theo report/ngân sách; chưa có quyền bật consumer thật thường trực/tạo phí.

Trước xin quyền cập nhậtQA3062: cần duyệt thửAPI thật hữu hạn với dự toán11cung, quyềnmodel/StructuredOutputs, chất lượng từngchủđề/giới hạn TậtÁch, đo thời gianqueue/APIvàchi phí, đối soát lỗi provider thực tế. Rà vận hành consumer có giám sát/ngân sách, kế hoạchbackup/migration011+012 riêng và quyền triển khai. ETA5phút chưa đo, khôngSLA. PDF cũ vẫn là snapshotV1, **chưa xuất AI11cung sangPDF**, không tự mở rộng phạm vi. Chưa kiểm toànE2E, Google thật, ngân hàng/SePay-origin hoặc APIAstra thật ởGói3.1. Không mở bán/Live.
