# Gói 3.2 — kiểm chứng ba bài Astra thật

Ngày 29/10/2026. Baseline `8847ed2`, nhánh main; tracked/index sạch trước sửa, chỉ `buu-dinh-7parts/` chưa theo dõi và giữ nguyên. Phạm vi: tối đa ba CREATE cho Quan Lộc, Tài Bạch, Phu Thê trên QA riêng. Không sửa engine, mở bán, bật Live hoặc cập nhật QA3062/3070.

## Kết luận

**3/3 bài thật đã completed; schema, validation, lưu, UI và GET đối soát đạt. Chất lượng chưa đạt mục tiêu luận chuyên sâu để đưa lên QA3062.** Mỗi cung một attempt, không retry, không uncertain. Tổng chi phí ước tính **$0,94638**, chưa phải hóa đơn provider.

Các bài đúng trọng tâm và thận trọng, nhưng nhiều phần mô tả vị trí hoặc nêu giới hạn thay cho phân tích phối hợp. Một lỗi đầu vào còn chặn: adapter bỏ sót các trường sao vòng riêng của snapshot. Quan Lộc có `boshi12=Tấu Thư`, `suiqian12=Bạch Hổ`; Astra không nhận hai facts này nên từ chối một đoạn V1 thực sự phù hợp. Không được gọi đây là V1 sai điều kiện hoặc model bịa sao.

Đã dừng ở đúng ba CREATE. Giữ nguyên ba bài thật, 22 bài mock cũ và tám job mới queued/0 attempt. Worker thật hữu hạn đã thoát; consumer mock QA3113 đang dừng để không tiêu thụ tám job ngoài phạm vi. Web vẫn chạy: màn chờ 3/11 là trạng thái QA được chủ động giới hạn, không phải lời hứa tự hoàn thành tám cung còn lại.

## Phiên bản và thay đổi trước khi gọi thật

Node **24.22.1**, SDK **openai@7.45.0**. Models GET chính thức và cả ba Responses trả model thực tế **gpt-6-astra**, không fallback. Root `.env` có key nhưng chưa có paid model; harness dùng đúng cấu hình explicit `AI_PAID_READING_MODEL=gpt-6-astra` của QA. Không sửa `.env` hoặc truyền key vào web. [Receipt quyền model](../.local/ai-paid32-20261029/model-access.json).

Hai sửa đổi có bằng chứng cần thiết:

- Worker trước đây chỉ giới hạn theo report, chưa chọn riêng cung. Thêm `palace`/`AI_PAID_PALACE` vào consumer/CLI hiện có, áp cùng scope cho claim và đối soát stale. Không tạo queue thứ hai. Mock kiểm hai cung được chỉ định, không claim lại completed hoặc Mệnh.
- Packet trả phí vẫn dùng `menhUserInput`, chứa task “Luận riêng cung Mệnh”. Thêm `paidUserInput` đúng cung đích và tăng prompt lên **paid-palaces-vietnamese-1.0.1**. Chỉ 11 job của báo cáo mới, tất cả queued/attempt 0/result null, được chốt phiên bản mới. Có receipt trước/sau; không thay snapshot, input hoặc completed cũ.

Không tối ưu prompt sau khi thấy bài thật, không nới validation để đạt. Lỗi thiếu sao vòng được ghi thành blocker, chưa sửa/backfill packet hoặc sinh lại bài.

Responses dùng Background/store, reasoning high, trần 12.000 output token, chờ Background tối đa 300 giây, SDK retry 0; lưu response ID sớm. Sau khi hoàn thành, GET lại ba ID và so hash toàn output với DB khớp. Models GET chỉ xác nhận quyền model; bằng chứng Structured Outputs là ba request dùng schema thực tế và validation thành công.

Tài liệu: [model/giá Standard](https://developers.openai.com/api/docs/models/gpt-6-astra), [Background Responses](https://developers.openai.com/api/docs/guides/background). Dự toán dùng input $10/M, cached $1/M, output $50/M, ngữ cảnh ngắn; không Fast/Batch. Cả ba cached 0. Reasoning đã nằm trong output, **không tính tiền lần thứ hai**. Không suy số tiền đã trừ tài khoản hoặc phí cache-write khi chưa có số liệu riêng.

## Báo cáo, đầu vào và toàn văn

Report QA **333f768a-833e-4342-bb5b-0018d7cefd63**, order **e3484c28-f618-4fc1-bfa9-4e1ea43bef36**. Đầu vào tổng hợp được tính bằng engine hiện có. Ba cung được chọn trước theo yêu cầu, không chọn để có văn đẹp; cùng một lá số nên không đại diện ba cấu trúc lá số khác nhau.

Thanh toán là webhook test tự ký gửi lặp, một transaction/một grant, paid + ready. Không giao dịch ngân hàng/SePay-origin. Cấp quyền qua luồng hiện có; chỉ gọi report worker scope đúng một đơn trong harness, không chạy worker thanh toán chính.

111 facts mỗi cung lấy từ đúng source snapshot đã lưu và kiểm receipt/hash; payload không có tên, ngày giờ sinh hoặc email. Hình học tam hợp/xung/giáp đúng; không chuyển sao chiếu thành tọa. Không có template chưa resolve trong tri thức. Tuy nhiên, facts **chưa đầy đủ** vì bỏ sót sao vòng; không tuyên bố kiểm đầu vào đã đạt toàn bộ.

- **Quan Lộc:** [toàn văn](../.local/ai-paid32-20261029/quan-loc-reading.md), [facts](../.local/ai-paid32-20261029/quan-loc-facts.json), [3 mục tri thức](../.local/ai-paid32-20261029/quan-loc-knowledge.json), [prompt/packet thực gửi](../.local/ai-paid32-20261029/quan-loc-input.json). Job `d1108b33-2998-4f43-86f3-ba6d5b1217c9`; response `resp_0112b97eae4e7354006ae32e9b113487d0a4935806fc539a00`.
- **Tài Bạch:** [toàn văn](../.local/ai-paid32-20261029/tai-bach-reading.md), [facts](../.local/ai-paid32-20261029/tai-bach-facts.json), [4 mục tri thức](../.local/ai-paid32-20261029/tai-bach-knowledge.json), [prompt/packet thực gửi](../.local/ai-paid32-20261029/tai-bach-input.json). Job `08540498-7e68-4bd6-a587-57b26193bf7e`; response `resp_066a7875c89e9747006ae32ee2cb7487d0b30232af5eea8822`.
- **Phu Thê:** [toàn văn](../.local/ai-paid32-20261029/phu-the-reading.md), [facts](../.local/ai-paid32-20261029/phu-the-facts.json), [1 mục tri thức](../.local/ai-paid32-20261029/phu-the-knowledge.json), [prompt/packet thực gửi](../.local/ai-paid32-20261029/phu-the-input.json). Job `8ec37846-ecab-41ed-aa7e-e0fcbe8bb436`; response `resp_0ef6bd9cd7b537b9006ae32f38e7e487d083e698d6063ddd84`.

Toàn văn xuất nguyên bản từ content đã lưu, không viết lại/cắt đoạn. Facts, tri thức, prompt, provider JSON và DB receipt giữ riêng. Không đưa session token/key vào tài liệu. Chưa đọc lại PDF; đối chiếu với V1, nguồn và điều kiện đã lưu, không coi là xác nhận lại nguyên tác.

Retrieval Quan gồm Tử Vi–Thiên Tướng, Bạch Hổ–Tấu Thư, Hóa Quyền. Điều kiện Bạch Hổ–Tấu Thư khớp snapshot nhưng packet thiếu facts. Tài gồm Liêm Trinh độc thủ Thân, góc nhìn chi ngoài công việc từ Tử VCD và hai mục Điền/quan hệ tiền–nhà đất thuộc ngữ cảnh chung của section. Model không biến Điền thành kết luận chắc về kiếm tiền. Phu chỉ có Hóa Khoa tại Phu trong nam mệnh, chưa có tri thức diễn giải tổ hợp Phá Quân–Đà–Hỏa.

[Audit đầu vào](../.local/ai-paid32-20261029/input-audit.json) còn ghi nhận packet thiếu Đại Hao/Thái Tuế/Chỉ Bối tại Tài và Quan Phù/Tang Môn/Nguyệt Sát tại Phu. Trường Trường Sinh cũng chưa chuyển. Không mặc định mọi trường vòng có cùng mức xác minh hoặc đều được phép diễn giải.

## Đánh giá tám tiêu chí

Đây là đọc soát kỹ thuật/biên tập của Codex, không phê duyệt chuyên môn hoặc chứng minh Tử Vi đúng đời sống. Không dùng đủ tám phần hay văn dài để kết luận chất lượng đạt.

### Quan Lộc — chưa đạt chiều sâu, có hệ quả từ facts thiếu

1. **Facts/vị trí:** Tử Vi–Thiên Tướng Vượng tại Thìn, Thân cư và Hóa Quyền đúng. Nhưng câu cuối “Không áp dụng chú giải Bạch Hổ–Tấu Thư vì dữ kiện Quan Lộc không ghi nhận hai sao này” sai so với snapshot đầy đủ. Nguyên nhân là adapter thiếu trường vòng; model giữ ràng buộc theo packet.
2. **Trọng tâm:** đúng công việc/quyền hạn, không viết lại Mệnh. Cụm “điều phối, quyền quyết định và trách nhiệm” có ích, không suy nghề/chức vụ cụ thể.
3. **Chính/phụ tinh:** nối được Tử Vi–Tướng với Quyền; phần Hữu Bật/Phi Liêm/Đường Phù/Thiên La/Hoa Cái chỉ liệt kê rồi giữ giới hạn. Bỏ mất Bạch Hổ–Tấu Thư vốn có nguồn nên chưa đạt phối hợp.
4. **Tam phương tứ chính:** Mệnh–Tài tam hợp, Phu đối, Điền–Nô giáp đúng, không chuyển sao. Hầu hết vẫn kể tên/vị trí, chưa giải thích liên kết với công việc.
5. **Mâu thuẫn/điều chỉnh:** không đếm bộ Tử Vi–Tướng và Quyền thành hai bảo đảm độc lập; giữ hai mặt tổ chức/vượt quyền. Với Kỵ/Khoa/Hỏa/Đà/Tuần thì dừng ở “chưa có quy tắc phối hợp”, chưa thành luận chế hóa.
6. **Nguồn:** hai luận điểm được dùng giữ nghĩa/phạm vi, không bịa trang. Mục Bạch Hổ–Tấu Thư bị bỏ vì bất nhất packet; không được loại vĩnh viễn nguồn này dựa trên phản hồi model.
7. **Tiếng Việt:** rõ nhưng còn nhiều câu “cấu trúc”, “vị trí”, “chưa có căn cứ”, giống chú giải kỹ thuật hơn bài luận sâu. Ba câu hỏi tự đối chiếu về trách nhiệm/quyền hạn là phần hữu ích.
8. **Không suy diễn chắc chắn:** không dự báo chức vụ/thăng tiến, không quy kết người đọc thật sự vượt quyền. Đạt giới hạn đọc soát này không đồng nghĩa chuyên môn được duyệt.

### Tài Bạch — tổng hợp phạm vi tốt hơn, vẫn thiếu phụ tinh

1. **Facts/vị trí:** Liêm Trinh Vượng độc thủ Thân, Mệnh/Quan tam hợp, Phúc đối, Tử–Tật giáp đúng. “Nhóm phụ tinh để trống” khớp nhóm minorStars đã gửi; toàn packet vẫn thiếu các sao vòng, chưa đầy đủ yếu tố liên quan.
2. **Trọng tâm:** tách nguồn thu/tích lũy/chi ngoài công việc, không lấn Mệnh hoặc tư vấn đầu tư.
3. **Chính/phụ tinh:** phân biệt độc thủ với hội chiếu; Bát Tọa/Thiên Tài không làm mất độc thủ. Chưa luận được vai trò hai sao này; thiếu Đại Hao làm phần phối hợp thu–chi mỏng.
4. **Tam phương tứ chính:** câu “Tham Lang ở Phúc Đức đối diện, nên không tạo thành Liêm Trinh–Tham Lang đồng cung” đúng và cụ thể. Với Quyền/Kỵ/Triệt chỉ xác định vị trí/không bù trừ, chưa phân tích tác động có nguồn.
5. **Mâu thuẫn:** điểm tốt nhất là không lấy tích lũy chậm chắc xóa chi theo hứng, hoặc lấy chi ngoài công việc bác lời cạnh tranh kiếm tiền. Đây là tổng hợp phạm vi, chưa phải phép tính tài ròng.
6. **Nguồn:** giữ riêng Vân Đằng Thái Thứ Lang và Nguyễn Anh Vũ; điều kiện Liêm độc thủ Thân/Tử VCD đúng. Không suy chi tiêu chỉ từ quan hệ giáp hoặc kéo lời Điền thành lời Tài. Chưa kiểm lại PDF gốc trong lượt này.
7. **Tiếng Việt:** tự nhiên hơn hai bài còn lại; ý “tạo tiền”/“nhịp tích lũy” nối hợp lý. Vẫn lặp giới hạn và giải nghĩa kỹ thuật, chưa giàu phân tích phụ tinh.
8. **Không chắc chắn:** “không nên…đọc chữ ‘chắc’ như bảo đảm tài sản sẽ luôn tăng” giữ giới hạn tốt; không bịa mức thu nhập hoặc thời điểm.

### Phu Thê — mỏng, chưa đạt bài chuyên sâu

1. **Facts/vị trí:** Phá Quân Đắc Tuất, Đà La Đắc/Hỏa/Tả Phù, Tả Phù hóa Khoa, Tuần trực tiếp/Triệt tam hợp đúng. Packet thiếu các sao vòng đã nêu, chưa đầy đủ dữ kiện liên quan.
2. **Trọng tâm:** đúng kỳ vọng bạn đời nhưng quanh quẩn học vấn vì chỉ nhận một mục V1; không viết lại Mệnh.
3. **Chính/phụ tinh:** “Hóa Khoa…thuộc Tả Phù…không phải Phá Quân hóa Khoa” đúng và cần thiết. Chưa phân tích ý nghĩa Phá Quân đi với Đà/Hỏa.
4. **Tam phương tứ chính:** Phúc/Di tam hợp, Quan đối, Tử/Huynh giáp đúng. Chỉ kể bố cục và nhắc không đồng cung, chưa nối thành lập luận về quan hệ.
5. **Mâu thuẫn:** giữ Khoa/Quyền/Đà/Hỏa/Tuần riêng, không chọn bên thắng. Câu “chưa thể chọn Khoa làm yếu tố quyết định thuận lợi” đúng giới hạn nhưng chưa thay được phân tích phối hợp.
6. **Nguồn:** Khoa ở Phu nam giữ đúng phạm vi, không biến thành bằng cấp/tình trạng thực tế của người vợ. Một đoạn nguồn không đủ diễn giải tổ hợp; không được coi thiếu retrieval là bằng chứng model không biết Tử Vi.
7. **Tiếng Việt:** dễ hiểu nhưng nhiều phần chỉ phân biệt vị trí/trạng thái. Câu hỏi cuối về bằng cấp/vốn hiểu biết hợp lý song hẹp, chưa có giọng luận sâu.
8. **Không chắc chắn:** không bịa tính cách người phối ngẫu, số lần kết hôn/ly hôn hay tương lai. Giữ an toàn không tự động làm bài đạt chất lượng.

## Token, thời gian và dự toán 11 cung

Cả ba dùng model `gpt-6-astra`, prompt `paid-palaces-vietnamese-1.0.1`, một attempt/cung, cached 0. [Số liệu JSON](../.local/ai-paid32-20261029/metrics.json):

- **Quan Lộc:** input 9.192 / output 4.170; reasoning 2.070 nằm trong output. Queue 133,576 s; pha API 71,335 s; worker 72,747 s. Ước **$0,30042**.
- **Tài Bạch:** input 9.826 / output 5.216; reasoning 2.904. Queue 206,353 s; pha API 85,302 s; worker 86,367 s. Ước **$0,35906**.
- **Phu Thê:** input 8.380 / output 4.062; reasoning 2.070. Queue 292,748 s; pha API 67,418 s; worker 68,206 s. Ước **$0,28690**.

Queue từ job.created_at đến attempt.started_at, gồm thời gian chủ động dừng consumer/kiểm packet/mock trước CREATE và chờ bài trước do chạy tuần tự. Đây không phải benchmark queue tự động. Pha API là wallclock từ trước Responses CREATE tới completed, gồm background provider queue/network/poll GET, không phải thời gian model compute thuần. Worker còn gồm Models GET.

Tổng input **27.398**, output **13.448**, reasoning **7.044** đã nằm trong output; pha API **224,055 s**. Ngoại suy từ trung bình ba bài: **11 cung khoảng $3,47**, nếu giữ model/cấu hình/kích thước packet/độ dài tương tự và mỗi cung một attempt, không cache/retry. Không phải giá bán, hóa đơn hoặc cận trên; tám cung chưa đo có độ dài khác, sửa adapter/prompt có thể đổi chi phí.

Tuần tự theo cách hiện tại: pha API ngoại suy **821,535 s ≈ 13,7 phút** cho 11 cung, chưa cộng queue/lỗi. **Chưa xác nhận ETA 5 phút; mẫu này không ủng hộ 5 phút cho một consumer tuần tự.** Không suy rằng bật đồng thời sẽ bảo đảm 5 phút: chưa đo tải/rate limit/11 chủ đề/concurrency hoặc P90. Đề xuất cân nhắc ước tính dài hơn cho QA tuần tự sau quyết định của chủ dự án; chưa đổi UX/SLA trong lượt này.

## Kiểm thử, UI và bảo toàn

Web QA3113 giữ build **ntiOuygYJ28ps6XIbVdkI** của Gói 3.1, chỉ restart PID **43316 → 58121** cùng checkout/Node 24 để tắt nhãn mock toàn trang; **key vẫn rỗng**. Worker thật dùng code Gói 3.2 tại root, hữu hạn rồi thoát. Consumer mock **41688 đã dừng**. Bài mock cũ vẫn có nhãn riêng trong nội dung. Không có worker thật thường trực.

- **55/55 test** trên DB test riêng; typecheck và production build tại root không phục vụ web đạt. Kiểm scope cung, task đúng cung, mock Tật Ách và chặn khẳng định bệnh/điều trị. Không gọi API Tật Ách, không toàn E2E/PDF.
- Đúng report trên UI: **3/11**, Quan/Tài/Phu mỗi tám phần, nhãn AI thật; Mệnh giữ bảy đoạn, gồm hai Luna đã duyệt. Tám cung còn queued; quá ETA báo tiếp tục, không báo thất bại hoặc hoàn thành giả.
- Refresh → thư viện → đúng order `e348…`: cả **24 tiêu đề/nội dung phần** so nguyên văn provider/DB khớp; số attempt/result hash không đổi. [DOM mở lại](../.local/ai-paid32-20261029/browser-reopened.json), [receipt bảo toàn](../.local/ai-paid32-20261029/preservation-after.json). Snapshot và Mệnh miễn phí nằm trong hash gốc không đổi.
- Ảnh mobile 390: [Quan Lộc](../.local/ai-paid32-20261029/quan-loc-390.png), [Tài Bạch](../.local/ai-paid32-20261029/tai-bach-390.png), [Phu Thê](../.local/ai-paid32-20261029/phu-the-390.png). [Mở QA3113](http://paid31.localhost:3113/ban-doc?id=333f768a-833e-4342-bb5b-0018d7cefd63#cung-4), quyền theo fixture QA, không đặt token trong URL.
- 22 completed cũ, 185 file/8 bảng main, PID/start/cwd QA3062/3070/3101/3111 và worker thanh toán nguyên. Không migration; đã backup DB QA trước ghi báo cáo thử. Không key trong Git/log/client.

Lỗi công cụ: preflight đầu so Node command với title Next nên dừng trước ghi; đã dùng lsof kiểm executable. Wrapper cấu hình cũ đổi argv[2] thành undefined, sửa capture argv trước import, chưa phát sinh CREATE. Tab cũ không lấy được, tạo tab QA riêng và kiểm thành công. Không coi các lỗi công cụ là lỗi Astra hoặc lượt kiểm đạt.

## Những điểm cần sửa trước QA3062

1. Bổ sung facts sao vòng **đã xác minh** từ snapshot, kiểm Bạch Hổ/Tấu Thư và các sao liên quan; không an lại, tự mượn sao hoặc sửa ba bài đã lưu.
2. Phân biệt tri thức trực tiếp cung với ngữ cảnh chung của section. Bổ sung ngữ cảnh có nguồn cho chính/phụ tinh và phối hợp, không quét lại toàn PDF hoặc dựng hệ rule mới.
3. Rà prompt đang quá thiên về mô tả/giới hạn: cho tổng hợp có mức độ từ nguồn được cung cấp mà không biến thành kết luận đời sống. Cần vòng đánh giá mới được duyệt, không tự gọi thêm để nâng điểm.
4. Vận hành consumer có giới hạn/ngân sách/đối soát và đo đủ 11 cung trước chốt ETA/chi phí. Chưa có quyền bật worker thật thường trực hoặc sinh tám cung còn lại.
5. Tật Ách chỉ mock/chú giải cấu trúc, chưa nghiệm thu luận cá nhân hoàn chỉnh; PDF vẫn V1 lịch sử. Không production, mở bán, Live hoặc deploy QA3062 ở gói này.

## File thay đổi và bằng chứng riêng

Code: `.env.example`, `lib/ai/paid-contract.ts`, `lib/ai/provider.ts`, `lib/ai/worker.ts`, `scripts/ai-paid-worker.ts`, `tests/ai-paid.test.ts`. Tài liệu: báo cáo này cùng HANDOFF, CURRENT_STATUS, V1-DELIVERY-PLAN, DECISIONS, ARCHITECTURE, TESTING. Không sửa engine, catalog, thanh toán, schema hoặc báo cáo lịch sử.

Toàn văn/facts/tri thức, backup QA, dispatch reservation, provider/DB receipts, logs và ảnh nằm riêng trong `.local/ai-paid32-20261029`, ngoài Git. Có thêm hash đối chiếu dữ liệu sau mở lại. Các file private có session/key không được đưa vào bàn giao công khai; key chỉ lấy từ môi trường khi chạy harness. Lỗi wrapper Python của công cụ không đọc được UTF-8 ở hai lượt sửa tài liệu, đã chuyển sang ghi UTF-8 trực tiếp/apply_patch; không có CREATE hoặc thay dữ liệu phát sinh từ hai lượt lỗi này.
