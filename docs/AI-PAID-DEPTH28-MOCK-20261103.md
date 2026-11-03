# Tham chiếu Tài Bạch và biên luận bốn cung — 03/11/2026

Baseline `main@ca7b9e8`, tracked/index sạch; giữ `buu-dinh-7parts/` và `docs/handoff/`. Chủ dự án yêu cầu sửa tham chiếu Tài Bạch, cải thiện bốn bài đã có bằng mock, chưa gọi API hoặc cập nhật QA3062/3070.

**Đã sửa đường tạo bài mới và kiểm offline; chưa tạo bài model mới, chưa sửa job/kết quả đã lưu.** Không tự đối soát lại provider hoặc chạy consumer. Vòng này **0 CREATE, 0 GET OpenAI API, 0 USD, 0 truy cập DB**.

## Đầu ra để đọc

[Bốn bản đề xuất biên tập](../.local/ai-paid-depth28-20261103/bon-ban-bien-tap.md) gồm Phụ Mẫu, Huynh Đệ, Tử Tức, Phu Thê. Đây là **bản Codex biên tập để đối chiếu, không phải kết quả API**, không đưa vào database hoặc thay bài cũ. Mỗi đoạn có basis/factIds/knowledgeIds trong file JSON cùng thư mục; lời khách không có tên sách/tác giả.

[Bốn bài model thật cũ](AI-PAID-SOL-11PALACES-20261103.md#đọc-kết-quả-thật) giữ nguyên. Bài Tài Bạch bị chặn trước đây chỉ được dùng làm ca tái hiện offline, không đổi thành completed.

## Sửa đúng nguyên nhân tham chiếu

Nguồn `paid-library.thp2-tai-liem-than-trine` đã được loader chọn đúng nhánh Liêm Trinh độc tọa Thân tại Tài, cùng Tử Vi ở Quan và Vũ Khúc–Thiên Phủ ở Mệnh. Loader giữ đủ điều kiện, vị trí, ngoại lệ và digest. Nhưng validator trước yêu cầu **mọi neo foundation đứng riêng đều có provenance source-traced tại cung mục tiêu**. Điều này loại cả sao tại cung liên quan và fact location vốn chỉ ghi vị trí, không có provenance an sao. Vì thế một đoạn tổng hợp dẫn đủ nguồn/neo vẫn bị `AI_REFERENCE_SCOPE`.

Bổ sung `groundedFoundationScope`, chỉ bật ở **paid-palaces-vietnamese-2.8.0**:

- Chỉ B/reference-only, passage foundation đúng version/digest, đúng cung chủ đề, có conditions và references. Không đổi B thành direct.
- Mọi neo phải tồn tại và được dẫn. Phải có neo source-traced bản mệnh tại cung mục tiêu.
- Neo sao ngoài cung mục tiêu phải source-traced, đúng phạm vi natal, quan hệ tam hợp hoặc xung chiếu. Paragraph phải dẫn fact geometry tương ứng; fact ấy phải giữ đúng cung mục tiêu, cung gốc và vị trí sao. Lời văn phải nói tên cung gốc.
- Location không có provenance chỉ được nhận khi ID/path và địa chi khớp một neo sao đã source-traced trong chính cung đó. Không dùng một location bất kỳ để né kiểm nguồn.
- Vẫn chỉ là ai-synthesis có giới hạn. Không cho reference-only thành source-interpretation; foundation đơn độc không đủ nâng focused. C/D, nguồn chưa xác minh, y khoa, attribution và thời gian trợ giúp vẫn qua guard hiện có.

Đã kiểm **nguyên văn output Tài cũ** với cùng input: 2.7 vẫn báo lỗi, 2.8 qua validation, không sửa chữ, source ID hoặc facts. Đây là bằng chứng sửa contract, **không** phải nghiệm thu nội dung hoặc quyền cập nhật attempt cũ. Bản đã lưu vẫn giữ prompt/validator cũ; muốn có kết quả mới phải đi luồng job mới phù hợp và có quyền gọi API riêng.

Không đọc kho hiện hành khi GET để đoán phiên bản hoặc sửa metadata của attempt. Reader/schema/JSONB không đổi, phiên bản 2.8 được đăng ký riêng; CREATE/GET mock kiểm cả 2.7 và 2.8 theo saved version. Không sửa retry, receipt, ngân sách, payment, entitlement, worker hoặc supervisor.

## Biên luận mới: thêm lý giải có căn cứ, không thêm chữ cho đủ

Prompt 2.8 thay phần lập luận của 2.7, giữ cấu trúc Reading V2 và các giới hạn cũ. Mỗi ý cần có đóng góp riêng; đoạn chỉ đổi cách nói phải gộp hoặc bỏ. Chỉ dùng liên cung nếu thêm được một góc hiểu cụ thể. Giới hạn chung đặt một nơi; lượng từ, chủ thể, thời gian và giới hạn cục bộ quan trọng vẫn ở cạnh lời áp dụng. Không có số từ tối thiểu hoặc ép đủ tám phần.

Các hướng dẫn theo cung là **chính sách biên tập có điều kiện**, không rule Tử Vi mới hoặc bài chọn theo tên/ID/ngày sinh mẫu. Không thay model/config; dùng được với model trả phí đã được cấu hình, chưa benchmark model.

- **Phụ Mẫu:** giữ 2 phần/4 đoạn, hai nguồn cũ. Tách rõ lời Nhật–Nguyệt về khá giả/bất hòa/khó sống gần và phần giải thích về hai quan hệ khác chủ thể. Không suy khá giả thành đã chăm lo đầy đủ, sống xa thành thiếu tình cảm, hoặc thế hệ sau phải bù đắp. Nguồn trong packet này vẫn hẹp; thay đổi chủ yếu là đúng phạm vi và gọn mạch, chưa có luận điểm mới về phụ tinh.
- **Huynh Đệ:** giữ 2 phần/4 đoạn; dùng thêm nguồn mạng lưới Nô–Lộc đã có trong input nhưng bài thật chưa dùng. Nét giao du, tình cảm gửi đi và kỳ vọng đáp lại là các mặt của **cùng một Lộc**, không nhiều bằng chứng độc lập. Liên hệ với Huynh làm rõ mong muốn kết nối khác mức chia sẻ thực tế; không biến bạn bè thành thay thế gia đình, không suy kết quả phản hồi.
- **Tử Tức:** 2 phần/6 → 2 phần/5 đoạn. Bỏ đoạn coaching về kỳ vọng nuôi dạy chưa được tiền đề hỗ trợ; giải thích Tử Tức/Tử Nữ nhất quán. Giữ Lộc tại Nô, nét đối đãi và hai vai trong lời Phụ/Tử. Không thêm số con, tính cách trẻ hoặc nhân quả giữa các thế hệ. Chưa có thêm nguồn phù hợp trong packet này để giải nghĩa toàn bộ VCD hoặc các phụ tinh.
- **Phu Thê:** 4 phần/9 → 3 phần/7 đoạn. Dùng thêm foundation đã có về **Mệnh Vũ–Phủ và Phu có Phá** (phiếu THP2/173,179), cùng lời trực tiếp Phá tại Phu. Phân tích nét muốn nắm chắc rồi làm so với mạnh/quả quyết, không tự gọi quan hệ Mệnh–Phu này là tam hợp/xung chiếu. Foundation đó không được đứng riêng trong guard mới vì không thỏa geometry; bản đề xuất dùng cùng lời trực tiếp phù hợp và đủ mọi neo, không thêm citation giả để qua kiểm. Giữ “phần nhiều”, “thường thường”, **“từng trợ giúp… một giai đoạn”** và **“va chạm rồi mới hợp”**. Khoa chỉ giữ nét học vấn nam mệnh; không biến thành biết lắng nghe hoặc hóa giải Phá–Đà–Hỏa. Quan Lộc đóng góp một đoạn ngắn về cách thực hiện/mục tiêu chung, không lặp toàn bài thành lời về đồng thuận.

Hai nguồn thêm vào **bản đề xuất**, vốn đã có trong input cũ:

1. `paid-context.no-boc.paid-library.thp1-no-loc-network`: C, Khâm Thiên/Tứ Hóa phần1, mục Lộc năm sinh ở Nô. Giữ điều kiện phi hóa khi nói chân tình/trợ giúp; không chứng minh số lượng bạn hoặc độ tin cậy.
2. `paid-library.thp2-phu-vu-phu-pha-context`: B/reference-only, ví dụ Mệnh Vũ–Phủ/Phu Phá, PDF173/179 đã rà trước. Chỉ lấy nét hai phía, không lấy câu sau về áp lực, ly dị, sát tinh hoặc Thiên La–Địa Võng chưa đủ điều kiện.

Không tăng số nguồn bằng các đoạn trùng nghĩa, không thêm index/unit sách, không rà PDF hoặc Bửu Đình. Phụ/Tử có ít nguồn trong **đầu vào mẫu hiện tại** không đồng nghĩa toàn bộ kho sách thiếu mọi lời. Các bản mới vẫn limited; không dùng số đoạn hay văn trôi chảy làm bằng chứng đạt chiều sâu thương mại.

## Kiểm đã thực sự chạy

- Lượt test đầu: 143/147, bốn lỗi do test mới đòi câu chỉ dành cho Tử xuất hiện ở mọi cung; sửa đúng kiểm theo cung, không đổi expected nguồn.
- Lượt mở rộng: 221/222, còn một assertion writer 2.7 cũ; cập nhật default sang 2.8, giữ toàn bộ test validator cũ và thêm GET/CREATE mock của 2.7.
- Cuối: **222/222, 9 file** — foundation scope, V2/provider version, customer prose, library, web source, editorial, source fidelity, context guide, safety. Negative gồm thiếu neo/geometry, sai vị trí/quan hệ/phạm vi/provenance, nguồn C/D/method, mất tên cung gốc, focused không có direct, medical và ID giả.
- Bốn bản đề xuất qua validator 2.8; **10 probe trên bản đề xuất/Tài** bị chặn, gồm mất cung C, mất giai đoạn trợ giúp, foundation Mệnh–Phu đứng riêng và bỏ geometry của Tài. Validator chỉ kiểm được một phần lỗi ngữ nghĩa; đã đọc toàn văn và đối chiếu các nguồn được dùng, không coi mock là kiểm chất lượng model.
- Bản đề xuất đầu có câu nối “ba nét đặt cạnh nhau” nằm trong paragraph source-interpretation, bị `AI_MIXED_ATTRIBUTION`; chuyển đúng câu tổng hợp sang paragraph riêng. Không nới guard. Giữ log đầu.
- Typecheck đầu phát hiện hai tham số implicit-any trong test mới; bổ sung type rồi **typecheck/build cách ly đạt**, Node24.21.0, BUILD_ID **`mjGCU1syyHAMBw-Tqd1Gy`**. Snapshot riêng, key rỗng, AI tắt, DBcổng1, fetch bị chặn; không thay `.next` web đang chạy.
- 11 prompt 2.7 khớp nguyên instructions đã gửi ở vòng thật. **52 artifact cũ** (input/request/result/provider/receipt/ledger/backup) giữ nguyên hash. Facts/knowledge/retrieval1.14 không đổi. Prompt mới Phu tăng879byte UTF8, các cung khác thay đổi từ−341 đến+225byte; đây là kích thước chữ, **không phải token đo bằng API**. Không tăng cap retrieval/packet để giải quyết thiếu nguồn.
- Không truy cập DB, restore/migrate, chạy worker/consumer/supervisor, API thật, E2E/PDF hoặc mobile mới; không sửa UI. Quan sát listener: QA3118 PID74791 và DB55448 PID68265 nguyên; QA55458 vẫn dừng, 3062/3070 không listen ở thời điểm quan sát, không báo là đã kiểm web của hai cổng này.

[Bằng chứng offline](../.local/ai-paid-depth28-20261103/review-summary.json) · [222 test](../.local/ai-paid-depth28-20261103/tests-verified.log) · [10 probe](../.local/ai-paid-depth28-20261103/negative-probes.json) · [Build](../.local/ai-paid-depth28-20261103/build-identity-verified.json). Các file private/bản biên tập giữ ngoài Git; tài liệu là đầu mối bàn giao.

Theo [OpenAI Docs về Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), schema giúp ràng buộc hình thức nhưng không thay kiểm nội dung. Lượt này giữ schema, kiểm references/provenance riêng và không suy chất lượng model từ mock. [Hướng dẫn prompt](https://developers.openai.com/api/docs/guides/prompt-engineering) được đối chiếu cho cấu trúc chỉ dẫn, không dùng làm nguồn chuyên môn Tử Vi.

## Tiến độ và điểm dừng

Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ **đều giữ90% hồ sơ theo checklist hiện hành**. Chưa kiểm model2.8; không đổi tiêu chí P09Astra thành Sol hoặc mock để tự tăng điểm. Mọi commercialReady=false; Tật vẫn chỉ T1/insufficient, Mệnh V1/Luna nguyên.

Đã có sửa contract/prompt và bản đọc đối chiếu. Còn mở: chất lượng model thật với writer mới, phạm vi phụ tinh ở Phụ/Tử và phép phối hợp Phá–Đà–Hỏa/Liêm–Hao chưa có lời đủ căn cứ; kết quả Tài cũ không tự được giao lại. Không mở bán hoặc cập nhật QA3062/3070. Không tự gọi thêm API để tối ưu hoặc chọn bài đẹp.
