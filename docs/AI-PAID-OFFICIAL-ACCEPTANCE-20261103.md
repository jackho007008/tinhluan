# Kiểm chính thức một bài Astra — Tài Bạch, 03/11/2026

**ĐẠT vòng kiểm nội dung trên một mẫu Tài Bạch trong phạm vi đã khai; CHƯA ĐẠT để phát hành thương mại toàn bộ 11 cung.** Bài mới có luận điểm rõ, sử dụng thêm nghĩa nền của Hao và ngữ cảnh nghề nghiệp ở tam phương, không bịa phép phối hợp Liêm–Đại Hao. Không gọi thêm để chọn bài đẹp. Phạm vi `focused` do model trả không đồng nghĩa đã luận toàn diện mọi yếu tố của cung.

## 1. Quyền thực hiện và phiên bản

Chủ dự án cho phép bắt đầu test chính thức, đúng **1 CREATE thật** trên QA riêng. Baseline Git `main@b728404`, tracked/index sạch; giữ nguyên `buu-dinh-7parts/`, `docs/handoff/`. Không đổi mã ứng dụng, prompt, nguồn, schema hoặc cấu hình web trong phiên này. Chạy chính module worker/provider/store trong checkout phục vụ `d64d7e4`, Node **24.22.1**, SDK **7.45.0**, build `ivjOZJ7TYHz1cqLHXROBt`.

Model **gpt-6-astra**, prompt **paid-palaces-vietnamese-2.6.0**, retrieval **paid-retrieval-1.14.0**, facts **paid-facts-1.1.0**, schema **paid-reading-v2.0.0**. Mệnh miễn phí V1/Luna giữ nguyên. Không fallback, consumer thường trực hoặc supervisor.

Báo cáo đang mở trên browser QA3118 là bản miễn phí, không có checkout trả phí. Không cấp quyền hoặc tạo AI vào báo cáo đó. Tạo một báo cáo QA mới từ snapshot synthetic đối chứng hợp lệ đã dùng ở các vòng trước; xác minh receipt, frozen report và giữ nguyên snapshot/frozen. Dùng các hàm hiện có: tạo owner/account QA, link báo cáo, checkout test, nhận thanh toán SePay test, report job và reconcile paid orders. Không gọi payment worker chính, gửi email ngoài hoặc bật Live.

- QA3118, PostgreSQL clone **55448**; đã đối chiếu DB name, data_directory và port trước ghi, backup mới và kiểm `pg_restore -l`.
- Báo cáo mới **`08e50e31-6b66-486e-ac39-3ca4ebf8c4f2`**, job Tài **`73c6e7ac-4bf5-41ba-9af2-b1cea0b446d0`**.
- Attempt thực gửi **`fb5018a5-6e66-467c-8b44-d8b54b574b0d`**, response **`resp_0c17bf9c233748aa006ae9566921ac87d2b65904d6167b7517`**.
- 11 job được tạo qua grant hợp lệ; chỉ job Tài được xử lý. Mười job mới còn lại queued/0 attempt, 18 queued cũ nguyên vẹn. Web vẫn không có OpenAI key.

## 2. Gate, lỗi cục bộ và số request chính xác

[Model docs](https://developers.openai.com/api/docs/models/gpt-6-astra), [giá](https://developers.openai.com/api/docs/pricing) và [Background](https://developers.openai.com/api/docs/guides/background) được kiểm trước CREATE. Models GET thành công. Đếm input cho request tương đương về nội dung: **32.784 token**; dự toán thêm 5% input, toàn bộ write theo mức 12 giờ và tối đa 12.000 output: **1,4606 USD**, đã báo trước. Dự phòng nội bộ 2 USD, không phải hard cap hóa đơn. Không đọc được số dư/giới hạn project trực tiếp; không suy Models GET là bằng chứng đủ credit.

Lượt chuẩn bị đầu bị sandbox EPERM ở SELECT clone; chạy lại cùng preflight có quyền mạng, chưa CREATE. Sau đó bộ guard cục bộ của phép thử so sánh nguyên chuỗi JSON trong `input`; JSONB đổi thứ tự khóa làm guard từ chối **trước HTTP CREATE**. Worker ghi uncertain vì không phân biệt được lỗi guard. Không coi trạng thái này là bằng chứng provider đã nhận:

- Nhật ký chỉ có Models GET; không sự kiện CREATE, không file giữ chỗ HTTP, không receipt. Dựng lại request tái hiện đúng lỗi thứ tự chuỗi; đối tượng JSON, mọi facts/nguồn và trường request còn lại giống nhau.
- Sửa riêng harness private để so sánh JSON đã parse; 4 probe đổi model/prompt/token/cung đều bị từ chối, mock Tài đã lưu qua validator. Không nới guard ứng dụng.
- Có bằng chứng chưa gửi nên phân loại attempt đầu thành `QA_LOCAL_GUARD_BEFORE_SEND`, giữ attempt và dấu vết gốc, giải phóng reservation chưa sử dụng; gọi `retryPaid` có kiểm grant cho chính job ấy. **Không retry một request provider uncertain.** Giới hạn nội bộ cho phép 2 attempt cục bộ, nhưng file giữ chỗ CREATE độc quyền vẫn chỉ cho 1 HTTP CREATE. Không sửa các attempt credit/uncertain lịch sử.
- Sau CREATE, harness dừng trước GET đầu vì còn kiểm cứng số attempt=1. Sửa kiểm nhận diện đúng attempt/receipt và tiếp tục ở chế độ **GET-only**; giữ nguyên response ID, attempt và run_after. Không reset backoff hoặc gửi lại CREATE.

Kết quả: **1 Responses CREATE, 3 Responses GET**, SDK retry 0; thêm **3 Models GET** và **1 POST input_tokens**. DB có **2 attempt**: một lỗi cục bộ không gửi provider và một attempt OpenAI completed. Cả ba GET thực đều thuộc cùng response/attempt. Guard giữ tối đa 12 GET, chỉ chạy khi đến lịch; phiên đã đóng và consumer hữu hạn đã thoát.

[Preflight](../.local/ai-paid-official-20261103/preflight.json) · [Bằng chứng chặn trước gửi](../.local/ai-paid-official-20261103/local-block-proof.json) · [Phân loại operator](../.local/ai-paid-official-20261103/operator-classification.json) · [Nhật ký request](../.local/ai-paid-official-20261103/network-events.jsonl). Không ghi API key/cookie/session vào Git hoặc log bàn giao.

## 3. Toàn văn và đầu vào thực gửi

Các artifact dưới `.local` là private, ngoài Git, có trên máy hiện tại:

- **[Đọc toàn văn bài Astra mới](../.local/ai-paid-official-20261103/tai-bach-reading.md)** — nguyên văn, 4 section/10 paragraph; không biên tập kết quả.
- [Result đã lưu](../.local/ai-paid-official-20261103/tai-bach-result.json), [facts](../.local/ai-paid-official-20261103/tai-bach-facts.json), [knowledge](../.local/ai-paid-official-20261103/tai-bach-knowledge.json).
- [Input/prompt/version/hash của job](../.local/ai-paid-official-20261103/tai-bach-input.json), [HTTP request thực gửi](../.local/ai-paid-official-20261103/actual-request.json), [audit từng đoạn](../.local/ai-paid-official-20261103/reference-audit.json).
- Đã đọc toàn văn đối chứng [Tài 1.2](../.local/ai-paid12-real-20261101/tai-bach-reading.md) và [Tài 2.2](../.local/ai-paid22-real-20261101/tai-bach-reading.md); không sửa các tệp/bài đó.

Input có **159 facts, 18 knowledge** đúng bản đã kiểm; không template chưa resolve. Bài thực dùng **6 knowledge**, gồm luận điểm Liêm tại Tài, chi ngoài công việc, nền Hao/Tân Biên, ngữ cảnh Quan và nhánh nghề nghiệp Liêm Thân hội Tử–Vũ–Phủ. Không ép dùng mọi sao hoặc mọi nguồn. Phúc chỉ dùng đúng facts Tiểu Hao đối cung; phương pháp web không bị nâng thành dự báo tiền bạc.

## 4. Đánh giá toàn văn theo chín tiêu chí

Điểm 0–5 là đánh giá biên tập/trung thành đầu vào trên mẫu này, **không phải xác suất đúng ngoài đời hoặc điểm Tử Vi**. Không cộng điểm để tự quyết mở bán. [Phiếu đầy đủ](../.local/ai-paid-official-20261103/content-review.json).

1. **Facts — 5/5.** Liêm duy nhất tại Thân/Vượng, Đại Hao tại Tài/Đắc, Tiểu Hao tại Phúc/Dần đúng dữ kiện. Tam phương Mệnh–Tài–Quan và thế Tài–Phúc đối cung đúng. Các references đều tồn tại, không đổi trạng thái sao.
2. **Chính tinh/phụ tinh — 4/5.** Phần Hao không chỉ liệt kê: “nhãn này không đủ để bỏ qua phương diện hao”, rồi tách câu hỏi nguồn tạo ra với phần được sử dụng/còn lại. Đây là tổng hợp có nền TB41, không tự phát minh sao nào thắng. Chưa là phép phối hợp toàn diện Liêm–Đại Hao.
3. **Tam phương/tứ chính — 4/5.** Đoạn Quan giữ cung gốc; tổng hợp phân biệt tăng công sức với mở quyền quyết định. Đoạn nghề nghiệp có đúng nhánh Liêm Thân/Tử Quan/Vũ–Phủ Mệnh, tách công việc liên quan tiền khỏi tiền tích lũy cá nhân. Không biến nghề tài chính thành lời khuyên chọn nghề hoặc bảo đảm lợi nhuận. Ngữ cảnh Phúc chủ yếu xác định Tiểu Hao, không phải một bài Phúc phụ.
4. **Tứ Hóa/điều chỉnh — 3/5.** Làm rõ giới hạn nhãn Đắc của Hao và không bù trừ với lời thuận chính tinh. Bài không khai thác Hóa Quyền/Kỵ dù có trong input; không bịa tác động để lấp phần ấy. Đây chưa phải tổng hợp đầy đủ Tứ Hóa.
5. **Chiều sâu theo chủ đề — 4/5.** Có bốn luận điểm khác nhau: tạo/tích lũy, nghĩa Hao, nghề/cách tổ chức từ tam phương, chi ngoài việc. “Chậm trong tích lũy không có nghĩa mọi quyết định mua sắm đều chậm và thận trọng” nối hai tiền đề có thật, có ích hơn một lời rào. Vẫn giới hạn ở phạm vi nguồn hỗ trợ, chưa toàn diện sinh kế/tài sản.
6. **Nguồn và căn cứ — 4/5.** 2 paragraph facts, 3 source-interpretation, 5 ai-synthesis. Lời Quan nằm role context; nguồn nền TB41 và nhánh nghề nghiệp đi vào tổng hợp với đủ neo, không giả thành lời áp trực tiếp. Lời “làm giàu chắc chắn” được giữ là cách nói riêng của Nguyễn Phát Lộc; không rút thành sự bảo đảm cho khách. Hai tác giả không bị ghép thành cùng một mức khẳng định.
7. **Văn phong — 4/5.** Không kéo đủ tám phần như 1.2 hoặc tạo chương chỉ kể sao chưa có nghĩa. Hạn chế chung gom cuối bài; không thuật ngữ engine/packet/catalog trong thân văn. Còn vài câu theo lối hướng dẫn người đọc và nhắc lại giới hạn nghề/tiền, chưa phải văn mẫu tối ưu.
8. **Cụ thể/tự đối chiếu — 4/5.** Giải thích ranh giới giữa công sức, tổ chức và quyền quyết định; phân biệt tiến trình tích lũy dài hơn với chi theo đợt. Không chuyển thành kế hoạch nghề nghiệp hay tư vấn tài chính chung.
9. **Không bịa/dự báo chắc chắn — 4/5.** Chưa thấy facts, trích dẫn hoặc phép chế hóa giả trong 10 đoạn đã đối chiếu. Giữ phủ định/phạm vi của chi ngoài công việc, không suy tính cách con. Lời nguồn mạnh được gắn tác giả và giới hạn cuối bài; vẫn cần đọc thận trọng khi khách gặp câu trích ấy.

### Cải thiện so với bài cũ

So với **1.2**, bỏ các chương chỉ báo Bát Tọa/Thiên Tài chưa đủ nghĩa hoặc liệt kê Hóa Kỵ mà không phát triển được luận điểm; bốn section mới đều có nội dung riêng. Không lấy việc bỏ đoạn làm bằng chứng đã giải nghĩa các sao bị bỏ. So với **2.2**, bổ sung rõ nghĩa Hao vẫn tồn tại dù Đắc và khai thác nguồn nghề nghiệp Liêm Thân đúng tam phương. Bản 2.2 chủ yếu nói tổ chức công việc không đồng nghĩa sở hữu tiền; bản mới phát triển thêm phạm vi trách nhiệm/quyết định và nghề liên quan tài chính.

Bài mới đáng đọc hơn trong phạm vi ấy, giảm các mục chỉ nêu giới hạn, nhưng chưa giải được toàn bộ Liêm–Đại Hao. Việc dùng 4 section thay 3 hay 8 **không** là thước đo chất lượng. Không suy rằng nguồn THP2 về nghề nghiệp đã giải quyết tổ hợp hao tinh, hoặc rằng mọi cung mới đều sẽ đạt như mẫu này.

## 5. Token, thời gian, chi phí

Usage thực: **32.750 input = 3 uncached + 32.747 cache-write + 0 cached-read**; **7.935 output đã gồm 5.484 reasoning**, không cộng reasoning lần nữa. Tier `default`. Preflight đếm request tương đương về nội dung trước khi JSONB đổi thứ tự khóa; usage trên đây mới là số thực provider trả.

Theo parser hiện hành, giá write 30 phút cho ước tính **0,8061175 USD**. Nếu toàn bộ write ở mức 12 giờ thì nhạy cảm giá là **1,215455 USD**. Response có trường legacy `prompt_cache_retention=24h`, nhưng không có `cache_write_tokens_details` tách TTL. Không đồng nhất trường retention legacy với TTL write tính tiền. [Tài liệu caching](https://developers.openai.com/api/docs/guides/prompt-caching) phân biệt hai loại cấu hình; **chưa đối chiếu hóa đơn**, không báo 0,8061 USD là phí chắc chắn. Không sửa hoặc backfill cost trong result. [Số đo](../.local/ai-paid-official-20261103/metrics.json) · [Đối chiếu giá](../.local/ai-paid-official-20261103/cost-review.json).

Provider tạo **03:35:05Z**, hoàn thành **03:38:01Z**: **176 giây**. Dispatch thực → persist **254,051 giây**; tổng quan sát HTTP **11,234 giây**. Queue tới attempt đầu 63,351 giây; tới attempt thực gửi 532,327 giây, có thời gian operator sửa guard cục bộ, không dùng số này để đo độ trễ queue tự động. Không suy ETA 11 cung từ một bài.

## 6. Lưu/mở, quyền và bảo toàn

Validation qua đúng saved prompt; decoder V2 đọc được result đã lưu. `readPaid` hai lần trả cùng nội dung, progress **1/11**; grant đúng order hợp lệ, gọi không có authorized order bị từ chối. Hai lần đọc không có provider fetch hoặc attempt mới. Bản lưu có 7 đơn vị Mệnh miễn phí; snapshot/frozen nguyên.

**55 job cũ**, gồm 18 queued và toàn bộ attempt/result cũ, giữ nguyên byte khi đối chiếu dữ liệu. **216 dòng lịch sử thuộc 37 bảng** giữ nguyên hash; 6 file trial cũ và 6 file đối chứng/runtime giữ hash. Mười job mới khác Tài vẫn queued/0 attempt, không Mệnh job. Báo cáo người dùng đang mở vẫn không có AI job hoặc quyền trả phí tự thêm. [Bảo toàn và đọc lại](../.local/ai-paid-official-20261103/preservation-and-read.json).

Không tạo recovery fixture, chèn cookie hoặc sửa server auth; **chưa kiểm browser/refresh/mobile bằng phiên owner cho bài QA mới**. Store-read có kiểm grant là bằng chứng máy chủ, không thay thế nghiệm thu giao diện. Đọc bài đầy đủ ở artifact riêng mục 3; không lấy báo cáo miễn phí của chủ dự án làm bằng chứng đã mở khóa bài QA mới.

Chỉ chạy kiểm phù hợp: preflight, một mock với input thật, 4 probe request sai, syntax harness, pipeline API thật/validation, audit 10 đoạn/6 nguồn, bảo toàn và read-only store. Không sửa app nên không chạy lại 216 test/typecheck/build đã đạt ở baseline; không E2E/PDF. Không restart web, worker thanh toán, QA3062/3070 hoặc bật Live. Harness CREATE/GET đã kết thúc, có dấu đóng phiên để không dùng lại gọi thêm.

## 7. Tiến độ và điều kiện còn thiếu

**Tài Bạch: 90 → 100% hồ sơ mẫu** do khép P09 bằng Astra hiện hành đã đọc toàn văn đạt trong phạm vi trên. `commercialReady=false` giữ nguyên. 100% ở đây không là độ chính xác, độ phủ mọi lá số hoặc nghiệm thu toàn cung chuyên sâu.

Phụ Mẫu 90%; Phúc Đức 90%; Điền Trạch 90%; Quan Lộc 90%; Nô Bộc 90%; Thiên Di 90%; Tật Ách 90%; Tử Tức (engine: Tử Nữ) 90%; Phu Thê 90%; Huynh Đệ 90%. Mười cung này chưa khép P09 trên cấu hình hiện hành; Tật chỉ hồ sơ T1, chưa publish bài sức khỏe cá nhân. [Checklist](AI-PAID-CONTENT-PROGRESS.json).

Ba điểm còn chặn nghiệm thu toàn bộ bản trả phí:

1. Mười cung khác chưa được đánh giá toàn văn bằng Astra hiện hành; một mẫu Tài không chứng minh chất lượng đồng đều 11 cung.
2. Cam kết chuyên sâu toàn cung chưa được căn cứ hỗ trợ ở các tổ hợp còn mở, nhất là Liêm–Đại Hao/Phá–Đà–Hỏa; Tật T1 vẫn cần giữ giới hạn cấu trúc, không xuất lời sức khỏe cá nhân.
3. Chưa kiểm giao diện/lưu-mở bằng phiên owner của kết quả thật mới. Không coi kiểm server hoặc bài mẫu khác là đã nghiệm thu browser.

Điểm cần theo dõi vận hành: parser cost hiện chưa diễn đạt rõ việc thiếu TTL write; lần này báo ước tính và nhạy cảm giá riêng, không tự sửa billing trong phép thử nội dung. Không phát sinh quyền thử thêm, mở bán hoặc cập nhật QA3062/3070 từ kết quả này. **Dừng sau đúng một CREATE đã hoàn thành.**
