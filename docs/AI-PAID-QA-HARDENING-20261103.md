# AI trả phí — hoàn thiện QA, chưa chốt thương mại — 03/11/2026

**Giữ QA, chưa nghiệm thu thương mại.** Khi được hỏi phạm vi “10 cung theo căn cứ; Tật chỉ dữ kiện/giới hạn, không cam kết 11 bài sâu tương đương”, chủ dự án trả lời **“Chưa chốt, tiếp tục giữ QA”**. Không coi phương án đó đã được duyệt, không sửa offer, giá, hạn, hoàn tiền hoặc mở bán.

Baseline `main@6b7a82a`, tracked/index sạch. Giữ `buu-dinh-7parts/`, `docs/handoff/`. Lô thực hiện: khôi phục lỗi tài khoản có kiểm soát, chi phí cache theo lifetime, phân loại model preflight và bộ biên tập QA thống nhất. **0 OpenAI CREATE/GET thật; 0 USD API; không cập nhật/restart QA3062/3070 hoặc worker thanh toán.**

## Bộ biên tập để đọc và duyệt

[Đọc HTML](../.local/ai-paid-commercial-hardening-20261103/bo-bien-tap-qa.html) · [Markdown](../.local/ai-paid-commercial-hardening-20261103/bo-bien-tap-qa.md) · [Căn cứ/trạng thái từng bài](../.local/ai-paid-commercial-hardening-20261103/manuscript-review.json).

Có **10 bản đề xuất limited**, mọi đoạn được gắn lại với facts/knowledge của input1.14 và qua validator2.8. Đây là bản Codex biên tập, **không phải kết quả model mới**, không ghi vào báo cáo hoặc giao cho khách. Mệnh V1/Luna giữ nguyên. Tật chỉ ghi trạng thái chưa có bài cá nhân được duyệt; không ghép bản nghiên cứu T1 thành nội dung trả phí.

- Bốn bản Phụ Mẫu/Huynh Đệ/Tử Tức/Phu Thê tái dùng [lô2.8](AI-PAID-DEPTH28-MOCK-20261103.md), không âm thầm sửa những bản ấy.
- Sáu bản còn lại dựa trên bản nguồn đã đối chiếu và input hiện có. Phúc phân biệt họ hàng/nơi sống/trải nghiệm; Điền giữ tạo lập/duy trì và Triệt; Di giữ cả sự đón nhận lẫn may rủi. Quan gộp tổ chức/quyền, thêm biểu đạt và nhịp tạo tiền. Nô giữ tình cảm gửi đi khác trợ giúp, nghĩa nền Lương và điều kiện liên hệ chuyển hóa giữa cung. Tài biên tập lại output2.7 để kiểm chữ/phạm vi2.8, giữ Đại Hao tại Tài/Tiểu Hao tại Phúc, không bịa phép Liêm–Hao.
- Không tên sách/tác giả trong thân bài. Nguồn, điều kiện, ngoại lệ, basis và ID xem riêng trong JSON/disclosure. Không tăng mức khẳng định hoặc lấy văn trôi chảy làm bằng chứng chuyên môn.
- **Không thêm tri thức hoặc rule mới.** Dùng lại kho chữ/phiếu đã rà, không quét PDF hoặc Bửu Đình. Bản biên tập không được đưa vào prompt như lời đúng cho mọi lá số, không chọn lời sản xuất theo ID/ngày sinh mẫu.

[Preview360](../.local/ai-paid-commercial-hardening-20261103/qa-cover-360.png) · [Preview390](../.local/ai-paid-commercial-hardening-20261103/qa-cover-390.png). Dùng renderer hiện hành, không tràn/pageerror ở360/390. Đây là HTML cục bộ, **không phải smoke phiên đăng nhập trên web mới**.

## Khép thao tác recovery billing/access trên QA

Trước đây consumer dừng CREATE sau lỗi credit/access nhưng chưa có đường vận hành mở lại an toàn. Nay có `npm run ai:paid-account-recovery -- /private/path/plan.json`, **dry-run mặc định**, `--apply` là thao tác operator riêng. Không có endpoint/admin dashboard mới hoặc cơ chế queue thứ hai.

- Bắt buộc `AI_PAID_OPERATOR_RECOVERY_ENABLED=true`, feature paid đang ở test/Live tắt, plan private0600 không symlink, version đúng, DBname/port/readingID khớp. Plan tối đa11 job, không ID trùng, hạn tối đa15phút, có reason và mức dự phòng.
- Operator phải **thực sự xác minh tài khoản/credit và lỗi terminal** trước khi đặt `accountAndFailureVerified=true`. Tool không tự đọc được balance provider; cờ xác nhận không phải chứng cứ từ API.
- Chỉ nhận job error billing/access, attempt hiện hành cũng error cùng mã, đúng attempt/responseID đã chọn, result null, chưa hết attempt. Completed, uncertain, đang chạy, lỗi validation, mất dấu kết quả chưa rõ hoặc receipt404 không được mở theo lối này. Trường hợp không receipt chỉ có thể là lỗi tài khoản đã xác định, không phải uncertain mất ID.
- Kiểm lại **grant thanh toán tại server** theo predicate hiện có; không cấp/sửa quyền. Nếu báo cáo còn running/uncertain, phải đối soát trước. Từ chối nếu consumer đang nắm lock, dùng lại lock dispatch và transaction hiện hành.
- Budget là kiểm trước theo attempts/ngày, dự phòngUSD và attempt/job; **không giữ chỗ ngân sách hay hard cap hóa đơn**. Worker vẫn kiểm lại trước từng dispatch.
- Apply chỉ đặt `retryable=true` cho đúng job/attempt/error đã kiểm bằng compare-and-set. Không đổi status thành queued, không tạo attempt/job hoặc sửa input/result/model/prompt/receipt. Owner vẫn phải dùng POST retry có kiểm quyền hiện hành; đọc/refresh không tạo bài.
- Consumer chỉ giữ hold với lỗi tài khoản **chưa** được operator cho retry. Restart/cung scope không bỏ qua hold. Sau retry, một lỗi mới lại cần kiểm riêng; plan cũ không cấp phép cho attempt mới.
- CLI ghi receipt0600 trước thao tác, rồi hoàn tất bằng rename. Receipt đã tồn tại không được chạy lại; trạng thái applying sau crash/commit cần operator kiểm tra, không tự gửi lại. Không lưu API key, cookie/session hoặc nội dung bài vào receipt.

**Không áp recovery lên bất kỳ job cũ nào trong phiên này.** Toàn bộ apply thực hiện trên fixture mới trong DBtest55459; không tự retry11lượt Sol đã dùng hết ở vòng trước, không đổi kết quả Tài cũ.

## Cache, chi phí và lỗi model

Đối chiếu [OpenAI Docs về cache](https://developers.openai.com/api/docs/guides/prompt-caching) và [bảng giá](https://developers.openai.com/api/docs/pricing): lifetime mới dùng `prompt_cache_options.ttl`; `prompt_cache_retention=24h` là trường cũ, **không phải write12h/24h của mô hình cache mới**. Khi có `ttl_30m_tokens`/`ttl_12h_tokens`, hai số phải cộng đúng tổng write, không cộng tổng write lần nữa. Reasoning vẫn nằm trong output.

- Parser tách write30m/12h, ordinary input/read/output và ghi algorithmVersion2.0.0. Thiếu/sai bộ đếm hoặc TTL không hỗ trợ thì cost null; thiếu lifetime dùng mặc định30m **có ghi rõ giả định**, không gọi là đối soát hóa đơn.
- CREATE mới Astra/Sol pin30m mà SDK7.45.0 hiện hỗ trợ. Lưu lựa chọn ấy vào attempt background trước dispatch; GET sau restart lấy lựa chọn đã lưu, không lấy cấu hình mới. Parser vẫn đọc được usage12h/mixed khi provider hoặc saved request có đủ dữ kiện; không gửi12h bằng ép kiểu hoặc nâng SDK.
- Khi output bị validation chặn, usage vẫn giữ `_cost` để operator thấy bảng giá/breakdown/giả định của request đã tốn phí. StatusCLI dùng metadata ấy khi chưa có result. Nếu revalidate giữ số tiền cũ, không gắn phép tính giá mới vào số tiền đã giữ; không backfill báo cáo cũ.
- Lỗi403/model_not_found hoặc quota tại model GET được phân loại access/billing đúng, không gom thành model unavailable có thể retry hoặc fallback. GET model chưa phải CREATE; bộ đếm dispatch nội bộ vẫn bảo thủ tính attempt, không được gọi là số response tính phí chính xác.
- Fixture số liệu3.2 thiếu write vẫn không được bịa để tính phí; số3.3 với giả định30m giữ nguyên. Sáu response Sol cũ chỉ được đọc offline, không viết lại giá đã lưu. Các ước tính/hóa đơn và credit còn lại là những khái niệm riêng.

## Kiểm thực tế và lỗi đầu

**185/185 test unit ở9file; 42/42 integration ở3file DB**, tổng227 case khác nhau. Có thêm lượt chạy đúng1case recovery qua CLI thật trong cùng môi trường test; không cộng lại thành228 case khác nhau.

Các đường kiểm: model403/quota trước CREATE, không fallback, cache30m/12h/mixed và provenance, GET dùng lifetime đã lưu, hold billing/access, plan sai DB/expired/duplicate/budget, consumer đang chạy, grant thiếu, stale attempt/CAS. DB kiểm thanh toán webhook lặp → grant →11job → mock → lưu từng cung/coverage → GET owner và từ chối người khác → refresh/mở lại không tạo bài → retry có quyền. Completed/insufficient và Mệnh miễn phí không bị tạo lại.

Recovery CLI được kiểm dry-run không ghi, apply chỉ đổi retryable, receipt chống replay. Owner khác/order khác bị từ chối; owner đúng tạo attempt thứ2 bằng mock, **attempt thứ1/receipt giữ nguyên JSON từng trường**, gồm timestamp đủ độ chính xác.

Giữ log các lỗi đầu:

1. Lần mở rộng unit vô tình đưa hai suite DB vào khi chưa truyền testDB: setup từ chối/38case skipped; sau đó chuyển đúng DB cách ly, không sửa guard DB.
2. Network guard ban đầu chưa nhận dạng `Socket.connect(port,host)`, chặn cả PostgreSQL; sửa để chỉ nhận localhost55459. Mạng ngoài/TLS/OpenAI vẫn bị chặn.
3. Mock cũ chép “lời nguồn trên”/“mệnh tạo” vào body nên guard văn phong từ chối đúng. Fixture nay chỉ mô phỏng lưu/version/quyền, không giả việc chép đoạn sách là kiểm chất lượng; **không nới validator hoặc sửa nguồn thực**.
4. Assertion sai khi gọi retry bằng order khác và so timestamp Date với rowJSON: sửa assertion từ chối và so cùng rowJSON giữ đủ precision, không làm mất field để test xanh.
5. Typecheck phát hiện SDK chỉ nhận30m cho CREATE và fetch mock không khai báo tham số; sửa đúng type/request, không ép any hoặc nâng dependency.

[Unit cuối](../.local/ai-paid-commercial-hardening-20261103/tests-final.log) · [DB42](../.local/ai-paid-commercial-hardening-20261103/tests-db-final.log) · [CLI1](../.local/ai-paid-commercial-hardening-20261103/tests-cli-integration.log).

**Typecheck/build cách ly đạt**, Node24.21.0, BUILD_ID **`BqBHeUrFXX2sLbXrK8Y9S`**; cập nhật test CLI sau build đã typecheck lại trong snapshot riêng, app code không đổi. Key rỗng/AI tắt/fetch blocked/DBcổng1; không sửa `.next` web đang phục vụ. Không toàn E2E/PDF. [Build](../.local/ai-paid-commercial-hardening-20261103/build-identity-final.json) · [Typecheck test cuối](../.local/ai-paid-commercial-hardening-20261103/typecheck-last-test.log).

## Môi trường và bảo toàn

DB test rỗng riêng **55459**, tên có prefix `tinhluan_ai_menh_paid31_test_hardening_`. Xác minh port/name/data_directory, backup rỗng trước khi áp schema001–012 có sẵn, không tạo migration mới hoặc restore dữ liệu nguồn. Không đọc/ghi DB55448 hoặc dữ liệu lịch sử để chạy test. Auth/payment là fixture tổng hợp qua helper/route hiện có, không Google/ngân hàng thật, không SMTP ngoài.

Đã backup cuối, kiểm `pg_restore -l` và dừng **duy nhất PostgreSQLtest55459**. Lúc đóng có1completed/10queued của fixture mới; không consumer/supervisor thường trực để tiêu thụ chúng. Backup21.292.650byte, SHA256 `60c27cba110b2133461bbc29e25e54215bccb2eda0c411fabc21baba48b721ed`. Không restore sau kiểm. [Identity](../.local/ai-paid-commercial-hardening-20261103/test-db-identity.json) · [Đóng test](../.local/ai-paid-commercial-hardening-20261103/closed-test.json).

52artifact Sol trước giữ hash; các bản nguồn/biên tập trước chỉ đọc. WebQA3118 PID74791 và DB55448 PID68265 giữ listener; QA3062/3070 không listen tại lúc quan sát, không tuyên bố đã smoke hai web đó. Không chạy/restart worker thanh toán chính hoặc thay `.env`, engine, quyền lịch sử, Google/thư viện,34bài Toàn thư, SePayLive, Vận hạn/PDF. Chỉ test route/quyền trong DB mới và preview cục bộ, chưa có browser owner/runtime mới.

## Tiến độ và điều kiện còn mở

Checklist hồ sơ lên version1.1 **về định nghĩa, không tăng điểm**: P09 theo model trả phí chủ dự án đã chọn/cấu hình, hiện `gpt-6.1-sol`, thay tên Astra cố định. Yêu cầu API thật đúng model/prompt, đọc toàn văn và đánh giá nội dung giữ nguyên; không cho mock/model khác thay thế. Giữ tiêu chí cũ trong history và không chấm lại các bài đã có.

Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ **đều giữ90% hồ sơ**, không phải90% sẵn sàng bán hàng. Mọi commercialReady=false, model2.8 chưa kiểm thật. Mười bản đề xuất limited không tự lấp các nguồn phụ tinh/tổ hợp còn thiếu; Tật chưa thành bài cá nhân.

Ba điểm còn chặn nghiệm thu thương mại:

1. **Phạm vi chưa được chủ dự án chốt**, đặc biệt Tật và mức lời hứa10/11cung. Giữ QA theo câu trả lời mới nhất, không sửa offer hoặc chính sách hoàn tiền.
2. **Chưa có kiểm model thật với writer2.8**; các11CREATE trước đã dùng hết, không retry hoặc thay thế. Có dự toán offline để xem sau, không có quyền gọi mới: tối đa10cung không Tật, gate đầu Phu/Tài, cận bảo thủ khoảng$2,69/dự phòng$3,10 theo counts trước + byte tăng và output trần. Không phải token đếm mới, balance đã xác minh hoặc hard cap. Vì chưa chốt phạm vi, chưa đề nghị thực thi vòng tốn phí này.
3. **Build mới chưa triển khai/runtime owner smoke**. QA kỹ thuật và preview không phải bằng chứng website mới đã giao đủ nội dung. Không tự cập nhật QA3062/3070 hoặc mở bán từ kết quả test.

Dừng ở bản QA và bằng chứng có thể đọc/kiểm. Không tự triển khai gói nghiên cứu mới, gọi API để chọn bài đẹp hoặc đổi nhãn thành đã hoàn thành thương mại.
