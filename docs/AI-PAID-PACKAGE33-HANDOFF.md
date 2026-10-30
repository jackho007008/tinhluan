# Gói 3.3 — packet/prompt mới, một bài Quan Lộc thật

Ngày **30/10/2026**, giờ Việt Nam. Baseline `a931d18`, nhánh main; tracked/index sạch, chỉ `buu-dinh-7parts/` chưa theo dõi và không sửa/stage. Không cập nhật QA3062/3070, worker thanh toán, engine, schema, quyền lịch sử, Vận hạn, PDF hoặc Live.

## Kết quả và giới hạn

Đã triển khai adapter trả phí, retrieval phân nhóm và prompt **paid-palaces-vietnamese-1.1.0**, giữ bản cũ. **64/64 test, typecheck và production build tại root đạt.** Dry-run đúng ba cung Gói 3.2 đạt; snapshot và 111 facts gốc không đổi. Mệnh miễn phí V1/Luna giữ nguyên, không có Luna API.

Vòng thực tế có **1 CREATE Quan Lộc, 1 attempt, 1 response ID**. Ban đầu job uncertain sau cửa sổ300s; ba GET thủ công còn in_progress. Bộ duyệt tự động chặn GET thêm vì coi vượt ba lượt đã báo; sau khi chủ dự án cho phép **đúng một GET, không CREATE**, GET thứ tư trả completed. Đã validation và lưu nguyên văn qua worker/store hiện có, cùng attempt/response ID; bước lưu dùng phản hồi thật đã nhận, không HTTP/CREATE mới và không requeue. Không dùng mock thay bài thật.

Quan Lộc cải thiện rõ ở việc dùng Bạch Hổ–Tấu Thư và nối tổ chức với biểu đạt. Vẫn thiên tự đối chiếu/coaching, chưa phân tích đủ phụ tinh, Tài trong tam hợp hoặc các mâu thuẫn Tứ Hóa. **Chưa nghiệm thu chất lượng cho11cung. Tài Bạch/Phu Thê chưa gọi API**, không có bài mới để đánh giá hai cung này. Dừng ở1CREATE sau checkpoint uncertain/quyền GET bổ sung, không tự tiếp tục các CREATE còn lại.

Worker hữu hạn đã thoát; consumer mock vẫn dừng.33job cũ (25completed+8queued) nguyên. Báo cáo mới có1completed+10queued; toàn QA còn18queued, không xử lý chúng. WebQA3113 vẫn PID58121/build`ntiOuygYJ28ps6XIbVdkI`, không restart hoặc truyền key vào web.

## Adapter: đúng field và mức xác minh

`lib/ai/paid-facts.ts` mở rộng riêng paid adapter, phiên bản **paid-facts-1.1.0**. Adapter Mệnh cũ giữ nguyên.

- **boshi12 / suiqian12:** Bác Sĩ và Tuế Tiền/Thái Tuế. Đối chiếu12giá trị đã lưu với `chart.tanBien.trace.rings` (`result.bacSy`/`result.thaiTue`), không suy danh sách từ tên nhóm hoặc an lại. Có trace nguồn và trạng thái đã lưu khi thực sự có; không gán độ sáng cho dữ kiện còn thiếu.
- **changsheng12:** giữ nguyên giai đoạn Trường Sinh. Trace ghi bất nhất về Suy nên đánh dấu `source-conflict`, giữ note/nguồn. Không coi giai đoạn vòng là độ sáng chính tinh, bệnh hoặc vận hạn.
- **jiangqian12:** vòng Tướng trước kế thừa upstream, chưa có phép an Tân Biên được xác minh theo inheritance/trace. Chỉ Bối/Nguyệt Sát vào packet đúng vị trí nhưng là `upstream-unverified`, không dùng làm tiền đề luận cá nhân.
- Sao thuộc `supplementalStars` cũng được phân biệt nguồn upstream. Nếu chưa có trace phép an riêng thì `engine-reported`, không tự nâng thành đã xác minh. Xác minh vị trí không đồng nghĩa có tri thức giải nghĩa sao.

Mỗi fact ghi paths; metadata có cung gốc, quan hệ với mục tiêu (target/trine/opposition/adjacent/other), field, phạm vi bản mệnh, nguồn và mức xác minh. Không chuyển sao chiếu thành đồng cung, không đổi trạng thái sao.

Các kiểm cụ thể đạt:

- Quan Lộc tạiThìn: **Bạch Hổ=suiqian12, Tấu Thư=boshi12**, source-traced/target.
- Tài Bạch tạiThân: **Đại Hao, Thái Tuế, Chỉ Bối**. Chỉ Bối chỉ ghi nhận upstream.
- Phu Thê tạiTuất: **Quan Phù, Tang Môn, Nguyệt Sát**. Nguyệt Sát chỉ ghi nhận upstream.

111facts cũ giữ nguyên ID/text/paths; thêm đúng **48facts vòng** (4field×12cung), tổng159facts. Không có điểm số/trọng số hoặc kết luận mới.

## Retrieval: A/B/C/D, kiểm điều kiện bằng hệ hiện có

`paid-retrieval.ts` dùng **executeRules**, catalog theo profile và rules V1 đã lưu. Không thêm rule hoặc evaluator mới. Chỉ lấy matched còn qua ngoại lệ/xung đột; conditional assessment còn unknown bị loại. Kiểm template trong nội dung, điều kiện và giới hạn. Không loại nguồn khác chỉ vì văn trùng: dedup theoID, giữ provenance; V1 ưu tiên hơn đoạn catalog trùng cùng rule.

- **A:** luận điểm V1 trực tiếp theo chủ đề cung.
- **B:** nghĩa sao/tổ hợp phù hợp điều kiện, gồm đơn vị V1 chuyên biệt và matched catalog chưa được bao phủ; `application=direct` khi đúng cung.
- **C:** nội dung đúng cung gốc trong tam hợp/xung chiếu, chỉ làmcontext; không mặc định mọi đoạn trongsection nhiều cung đều áp trực tiếp.
- **D:** ba hồ sơ phương pháp đã xử lý (`inherited-NPL-01/07/15`), chỉ tham khảo. Validator không cho dùng D làm source-interpretation trực tiếp.

Ưu tiên A/B rồi C/D, ngân sách hữu hạn; giữ tác giả/điều kiện/ngoại lệ/trạng thái draft. Nhánh false/missing/conflict không trở lại như lời cá nhân. Không đọc PDF; chỉ modules, metadata kho đã xử lý và đoạn liên quan của crosswalk cũ.

**Bao phủ còn thiếu:** không tìm được hồ sơ nghĩa sao tổng quát mới đủ điều kiện cho các tổ hợp đang thử; không làm đầy B bằng suy đoán. Crosswalk cũ vẫn giữ một số lời Phu Thê ởU15–18 vì điều kiện/phạm vi sản phẩm. C/D không thay được nguồn trực tiếp, đặc biệt nghĩa Phá Quân–Đà–Hỏa.

## Đối chiếu trước/sau

[Bảng CSV](../.local/ai-paid33-20261030/packet-comparison.csv), [summary](../.local/ai-paid33-20261030/dry-summary.json), [facts bổ sung/đoạn bị loại](../.local/ai-paid33-20261030/facts-and-removals.json).

- **Quan Lộc:**111→159facts;3→14tri thức, A3/B0/C8/D3. Bạch Hổ–Tấu Thư có cảfacts vàV1 trực tiếp đúng điều kiện.
- **Tài Bạch:**111→159facts;4→13tri thức, A1/B1/C8/D3. Hai mục Điền/quan hệ tiền–nhà đất thuộcsection chung bị loại khỏi lời trực tiếp Tài; không tách sửa một phần nhóm để tăng bao phủ.
- **Phu Thê:**111→159facts;1→10tri thức, A0/B1/C6/D3. Khoa tạiPhu làB direct; Phúc/Di/Quan chỉ làm ngữ cảnh, không chuyển thành kết luận hôn nhân.

Ước lượng input trước phí lần lượt33.130–49.695/32.472–48.708/30.081–45.121token, dùng UTF-8bytes/3..bytes/2 cho payload+instructions. **Đây là ước lượng thô, không phải cận chắc/tokenizer/billing**, chưa tính chính xác schema. Quan Lộc thực tế28.108input thấp hơn dải dự đoán; không dùng dải đó làmusage thật.

Packet/nguồn/exclusions/toànprompt: [Quan](../.local/ai-paid33-20261030/quan-loc-dry.json), [Tài](../.local/ai-paid33-20261030/tai-bach-dry.json), [Phu](../.local/ai-paid33-20261030/phu-the-dry.json). [Dry gate](../.local/ai-paid33-20261030/dry-gate.json), [gate trước API](../.local/ai-paid33-20261030/pre-api-gate.json): cùngchart Gói3.2, packet thực khớpdry và33job cũ nguyên.

## Prompt và schema

Prompt **paid-palaces-vietnamese-1.1.0** tại `paid-prompt.ts`, registry `paid-contract.ts`; provider dùng version của job. Giữ body1.0.0/1.0.1; hash prompt Quan Lộc1.0.1 khớp bản đã gọi thật Gói3.2, không relabel hoặc sửa bài cũ.

Mỗi cung có focus riêng. Khung phân tích linh hoạt từ chính tinh/trạng thái, đồng cung, hội chiếu, Tứ Hóa, mâu thuẫn/điều chỉnh tới tổng hợp chủ đề. Cho tổng hợp có mức độ từ nguồn, không chỉ viết lạiV1; cấm tự đặt quy tắc chế hóa. Phân biệt facts/source-interpretation/ai-synthesis; giả thuyết chưa có nguồn trực tiếp phải thể hiện mức độ trong văn. Giảm liệt kê/lặp ý/lời rào và thuật ngữ nội bộ; không dùng một mẫu thay tên cung.

Tật Ách chỉ chú giải truyền thống/tự đối chiếu, không bệnh/điều trị/tuổi thọ. Schema tám phần giữ nguyên; không tab mới, PDF hoặc thayMệnh. Đã kiểm [OpenAI Docs](https://developers.openai.com/api/docs/models/gpt-6-astra) và [hướng dẫn prompt](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra). GiữAstra/high/12.000maxoutput/Background/store/SDKretry0 và mô hình tuần tự, không đổi concurrency.

## Bài thật và đối chiếu chất lượng

Report mới **cbb4fd02-55d1-49c7-9e49-dbcbdd77879b**, order **83983d26-f2fe-4e32-929c-b71803660f4d**. Cùngchart3.2, ID/bản lưu mới. Quyền qua webhook test tự ký và delivery scoped một đơn, không ngân hàng/SePay-origin hoặc worker thanh toán chính.

JobQuan **2dc4adf6-900d-4ca1-a3b1-21f729a72847**; response **resp_0d107a4e130040e4006ae3fd114c8087d29f3ba4b2eb3d20a6**. [Toàn văn nguyên bản](../.local/ai-paid33-20261030/quan-loc-reading.md), [content/IDs/basis](../.local/ai-paid33-20261030/quan-loc-content.json), [packet thực gửi](../.local/ai-paid33-20261030/quan-loc-input.json), [provider GET](../.local/ai-paid33-20261030/quan-loc-reconciliation-get.json), [receipt lưu cùng attempt](../.local/ai-paid33-20261030/persistence-receipt.json). Không chỉnh lời sau phản hồi.

Đọc soát theo cùng8tiêu chí của [Gói3.2](AI-PAID-PACKAGE32-EVALUATION.md), không phải phê duyệt chuyên môn hoặc phép đo độ đúng của TửVi:

1. **Facts:** cũ từ chối Bạch Hổ–Tấu Thư vìpacket thiếu; mới khẳng định đúng “hai sao vòng bản mệnh cùng ở Quan Lộc”, dẫn đúng hai ringfact IDs. Không tự an sao/đổi độ sáng. Đây là cải thiện rõ.
2. **Trọng tâm:** mới giữ công việc, phối hợp và trách nhiệm; câu “biết tổ chức không đồng nghĩa với được toàn quyền” rõ chủ đề, không viết lại Mệnh hay suy chức vụ.
3. **Chính/phụ tinh:** mới nối TửVi–Tướng vớiQuyền vàBạchHổ–TấuThư, giải thích tổ chức cần diễn đạt để cùng làm. Ghi rõ đây là liên hệ biên soạn, không phải nguồn bảo đảm giao tiếp tốt. HữuBật/các phụ tinh khác vẫn chưa được phân tích sâu do thiếu nguồn.
4. **Tam phương:** cũ chủ yếu liệt kê vị trí; mới dùng lời riêng VũKhúc/ThiênPhủ tạiMệnh làmcontext, không chuyển thành hiệu quả công việc. Nhưng bỏ qua phần lớn Tài trongtam hợp/giáp cung, nên bao phủ chưa trọn.
5. **Mâu thuẫn/điều chỉnh:** mới tách khả năng tổ chức với thẩm quyền, hiếu thắng với giữ mục tiêu chung, gắn nhãn giả thuyết ai-synthesis. Không tự đặt phép hóa giải. Chưa phân tích sâu Kỵ tạiMệnh và các yếu tốchiếu khác, không coi đây là chếhóa đã hoàn chỉnh.
6. **Nguồn:** dùng đúngV1 BạchHổ–TấuThư và giữcung gốc của nguồnC. Không dùng ChỉBối/NguyệtSát chưa kiểm để luận người, khôngbịa nguồn/phẩm chất. Vẫn là tài liệu draft, chưa có chứng nhận chuyên môn.
7. **Văn phong:** cụ thể hơn, ví dụ mục tiêu/khâu phối hợp/người quyết định; ít kể dữkiện đơn thuần. Còn nhiều câu hỏi tựđối chiếu và lặp chủ đề trách nhiệm/quyền hạn, thiêncoaching hơn một bài TửVi giàu phốihợp sao. Cải thiện một phần, chưa gọi đạt toàn bộ mục tiêu.
8. **Không chắc chắn:** mới nhấn biểu tượng, “nếu phù hợp trải nghiệm”, không tiên đoán thành công/chức vụ hoặc tạo quy tắc chếhóa. GiữSuy ởphần giới hạn, không suy suygiảm sựnghiệp.

Tài Bạch/Phu Thê chỉ có so sánh packet/dry-run, **chưa có văn mới, token/chi phí hoặc so sánh chất lượng thực tế**. Không dùng Quan để kết luận11cung đều cải thiện. Chưa chạy thêm để nâng điểm.

## Token, thời gian, chi phí

[Metrics cuối](../.local/ai-paid33-20261030/metrics-final.json), model`gpt-6-astra`, prompt1.1.0,1attempt/1CREATE:

- Input **28.108**; cached read0; **28.105cache-write** nằm tronginput.
- Output **5.916**, bao gồm **3.358reasoning**; không cộng reasoning thêm lần nữa.
- Ước Standard **$0,6471425**: `(3×10 + 28.105×12,5 + 5.916×50)/1.000.000`. Cache-write dùnggiá$12,50/M thay input$10/M cho phần đó, không tính kép. [Giá model](https://developers.openai.com/api/docs/models/gpt-6-astra). Chưa phải hóa đơn/đối soát tiền đã trừ tài khoản.
- Cách tính input/output cũ bỏ phícache-write sẽ ra$0,57688, thiếu$0,0702625. Lượt này lưuusagecache-write thật và phí đúng qua phản hồi đã nhận. **Parser ướcphí tự động thông thường của provider còn chưa đọc cache_write_tokens: cần bổ sung trước QA3062**; không backfill chi phí bài cũ khi chưa cóusage gốc.
- Queue **215,416s** từjob.created_at tớiattempt.started_at gốc, gồm thời gian chuẩn bị chủđộng, không dùng locked_at đã cập nhật khi đốisoát.
- Provider created09:12:33→completed09:26:05: **812s =13phút32giây**. Đây là wallclockprovider gồm queue/xửlý, không compute thuần. Client đã hết cửa sổ300s; GET bổ sung muộn mới xác nhậncompleted. durationMs trongresult gồm khoảng đợi/người vận hành đốisoát, **không dùng làm latencyAPI**.

Quan Gói3.2:9.192input/4.170output(2.070reasoning), clientphaAPI71,335s, ước$0,30042 theo công thức cũ chưa kiểmcache-write. Mẫu mới tănginput rõ và chậm hơn; không đủ kết luận nguyên nhân hoặc so phí hai vòng như hóađơn cùngcơsở. **Không ngoại suy11cung từmộtbài, không xác nhận ETA5phút.** Không đổi timeout/concurrency hoặc mô hình11cung để vượt kết quả này.

## Kiểm thử và bảo toàn

- **64/64test trong6file**, gồm55ca cũ+9ca adapter/retrieval/prompt. Kiểm8sao yêu cầu, mức xác minh/quan hệ/độ sáng, snapshot bất biến, template trongtext/metadata, falsepredicate/unknown, nguồn khác cóvăn trùng, Dkhông làm chứng cứ trực tiếp, hashpromptcũ vàfocusmới. Typecheck/rootbuild đạt. Không toànE2E/PDF.
- Lượtđầu63/64do thiếu đúng câu guardTậtÁch cũ; khôi phục trongprompt, không sửaassertion. [Log lỗi đầu](../.local/ai-paid33-20261030/test-first-failure.log), [log cuối](../.local/ai-paid33-20261030/test.log), [build](../.local/ai-paid33-20261030/build.log).
- Worker/store hiện có lưu phản hồiGET thật, cùngattempt vàID, allowCreate=false, khôngHTTP khi lưu; schema/validation đạt. Không sửa25completed hoặc8queued cũ. [Receipt DB/API](../.local/ai-paid33-20261030/preservation-final.json), [API1/11](../.local/ai-paid33-20261030/api-status-final.json).
- UI đúngbản mới:1/11,8phầnQuanLộc/BạchHổ–TấuThư; Mệnh7đoạn/2Luna cũ. Refresh/thư viện mở lại nguyên văn, không tăngattempt. [DOM](../.local/ai-paid33-20261030/browser-reopened.json), [ảnh](../.local/ai-paid33-20261030/quan-loc-ui.png). Web3113khôngrestart, không nhậnkey.
- 185file/8bảngmain, PID/start/cwdQA3062/3070/3101/3111/worker chính nguyên. Khôngmigration; toàn33jobcũ mọifield/hash nguyên,3bàiGói3.2 giữ nguyên. KhôngLuna/Live/Vận hạn/PDF/Gói3.4.

Lỗiharness: dumpđầu vượtbuffer40MB nhưng chuỗi shell vẫn tạo fixtureQA mới trước backupmới; chưaCREATE. Đã chặnphầnAPI, chuyển dumpquaFD vàlưu54.679.657bytes trước phí, kiểm33jobcũ nguyên, khôngrestore/drop. BướcGETthứ4 từng bịauto-review từchối, chỉ chạy sau phép rõ của chủdựán; khôngmở rộngCREATE. Các fileprivate/backup ngoàiGit, khôngkey/session trongtài liệu.

## Trước QA3062 và phạm vi file

1. Chưa đánhgiá hai cungcòn lại hoặc10chủđềkhác; thiếu nghĩa sao/tổhợp/phốihợp, nhấtPhu. C/D không thay nguồntrực tiếp, khôngthêm rule đểlấp khoảngthiếu.
2. Một bài tốt hơn không là nghiệmthu11cung/chuyênmôn. TậtÁch chỉmock/chúgiảicấutrúc; khôngluậncánhânhoànchỉnh.
3. LuồngBackground vượt300s đã được đốisoát cùngID mà khôngCREATEtrùng, nhưng cần vận hành đốisoát bềnvững cóngânsách/giớihạn trước mởbán; không tựbật consumer tronggói này.
4. Bổ sungướcphícache-write, đo thêm khiđượcphép; không chốtETA5phút hoặcđổi môhình/concurrency từmộtmẫu.

Code: `lib/ai/contract.ts`, `paid-facts.ts`, `paid-input.ts`, `paid-retrieval.ts`, `paid-contract.ts`, `paid-prompt.ts`, `provider.ts`; test mới `tests/ai-paid-adapter.test.ts`. Không sửaengine/catalog/evaluator/queue/payment. Tài liệu gồm báo cáo này và đầu mối backlog/trạng thái/kiếntrúc/kiểmthử/quyếtđịnh. CSV/packet/nguồn/exclusions/response/bằngchứng/backup nằm riêng `.local/ai-paid33-20261030`, ngoàiGit.
