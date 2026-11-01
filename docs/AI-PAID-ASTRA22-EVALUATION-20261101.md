# Kiểm chứng Astra 2.2 trên QA riêng — 01/11/2026

## Phạm vi và danh tính thực thi

Theo quyền chủ dự án: tối đa3CREATE Quan Lộc/Tài Bạch/Phu Thê, dự phòng3USD, không CREATE thay thế uncertain. Baseline `main@866bd37`; tracked/index sạch, giữ `buu-dinh-7parts/` và `docs/handoff/` chưa commit. Không sửa ứng dụng, prompt, nguồn hoặc bài cũ trong vòng này.

QA3121/DB clone55452 mới, Node24.22.1/SDK7.45.0, build `QzPj4G4XnE4qZMGJoF-yd` đã kiểm ở vòng mock. Web không có API key, không worker/supervisor thường trực. Báo cáo synthetic mới `742e6f3f-fa1c-4e81-9218-facdf5ef5b0e`; quyền qua checkout/webhook test/evaluator hiện hành, không chèn entitlement. Database clone từ backup QA có hash đã kiểm; không dùng DB QA chính.

Snapshot đối chứng có SHA256 `bbeaa031ed477ac4f5cd9c744cb8d8fa51f03c514a424397ae976e498ceed370`, receipt hợp lệ,159facts; retrieval `paid-retrieval-1.4.0`, prompt `paid-palaces-vietnamese-2.2.0`, contract `paid-reading-v2.0.0`. Ba packet bằng từng byte JSON với dry-run đã kiểm của866bd37; không unresolved template, sao hay điều kiện nguồn bị đổi. Chỉ ba job mới được chọn; tám job mới khác và18queued cũ ngoài scope không được xử lý.

## Dự toán trước CREATE

Model GET xác nhận quyền `gpt-6-astra`. Đếm input bằng endpoint `/responses/input_tokens` cho đúng instructions/input/reasoning/schema: Quan29160, Tài29321, Phu26680. Ba POST đếm token **không phải Responses CREATE tạo bài**; được ghi riêng. Dự toán tổng2,91775USD với5% dự phòng input, toàn input ở giá cache-write12,5USD/M và tối đa12000output/bài ở50USD/M. Không giảm model hoặc reasoning để lọt ngân sách. Giá uncached10USD/M, cached read1USD/M; reasoning nằm trong output, không cộng lần hai. [Giá model](https://developers.openai.com/api/docs/models/gpt-6-astra), [token count](https://developers.openai.com/api/docs/guides/token-counting).

Không đọc được số dư/spending limit project trực tiếp. Quyền ngân sách do chủ dự án xác nhận; dự toán và reservation nội bộ không là hard cap hóa đơn. [Gate, số token và phép tính](../.local/ai-paid22-real-20261101/cost-preflight.json).

## Toàn văn và đầu vào thực gửi

Các tài liệu riêng không chứa key, cookie hoặc danh tính khách hàng thật; toàn văn là kết quả đã lưu, không biên tập sau phản hồi. Giữ dữ liệu này ngoài Git/phần công khai.

- **Quan Lộc:** [toàn văn](../.local/ai-paid22-real-20261101/quan-loc-reading.md), [result/basis](../.local/ai-paid22-real-20261101/quan-loc-result.json), [facts](../.local/ai-paid22-real-20261101/quan-loc-facts.json), [knowledge](../.local/ai-paid22-real-20261101/quan-loc-knowledge.json), [instructions/input](../.local/ai-paid22-real-20261101/quan-loc-prompt.md), [packet/hash/version](../.local/ai-paid22-real-20261101/quan-loc-input.json).
- **Tài Bạch:** [toàn văn](../.local/ai-paid22-real-20261101/tai-bach-reading.md), [result/basis](../.local/ai-paid22-real-20261101/tai-bach-result.json), [facts](../.local/ai-paid22-real-20261101/tai-bach-facts.json), [knowledge](../.local/ai-paid22-real-20261101/tai-bach-knowledge.json), [instructions/input](../.local/ai-paid22-real-20261101/tai-bach-prompt.md), [packet/hash/version](../.local/ai-paid22-real-20261101/tai-bach-input.json).
- **Phu Thê:** [toàn văn](../.local/ai-paid22-real-20261101/phu-the-reading.md), [result/basis](../.local/ai-paid22-real-20261101/phu-the-result.json), [facts](../.local/ai-paid22-real-20261101/phu-the-facts.json), [knowledge](../.local/ai-paid22-real-20261101/phu-the-knowledge.json), [instructions/input](../.local/ai-paid22-real-20261101/phu-the-prompt.md), [packet/hash/version](../.local/ai-paid22-real-20261101/phu-the-input.json).

Đối chứng đã đọc toàn văn: [Quan2.1](../.local/ai-paid-finish-20261101/quan-loc-reading.md), [Tài2.1](../.local/ai-paid-finish-20261101/tai-bach-reading.md), [Quan1.2](../.local/ai-paid12-real-20261101/quan-loc-reading.md), [Tài1.2](../.local/ai-paid12-real-20261101/tai-bach-reading.md), [Phu3.2](../.local/ai-paid32-20261029/phu-the-reading.md). Không sửa các tệp đối chứng.

## Đánh giá chất lượng — đọc toàn văn và đối chiếu từng luận điểm

Theo cùng chín tiêu chí của [báo cáo nghiệm thu](AI-PAID-CONTENT-ACCEPTANCE-20261031.md). Đánh giá biên tập có dẫn chứng, không dùng model làm judge hoặc lấy nhãn coverage/số phần làm điểm thương mại. “Đúng facts” chỉ nói khớp snapshot/packet, không xác nhận Tử Vi đúng đời sống.

### Quan Lộc — giảm lặp và dùng Tài, chưa có nhiều trục luận mới

So2.1 bốn phần không C,2.2 ba phần/bảy đoạn có hai đoạn dùng Tài đúng cung gốc. Câu “Hai cung nằm trong tam hợp, nhưng phép đối chiếu này không biến ý ‘được việc’ ở Quan Lộc thành lời hứa về thu nhập” giữ ranh giới quan trọng. Bài1.2 từng có Tài/Mệnh nhưng quyền–trách nhiệm lặp ở nhiều chương;2.2 gộp trục đó vào phần đầu, phần thứ hai về Hổ–Tấu, phần cuối về tổ chức khác kết quả tiền bạc. Thay đổi là tổ chức lập luận và khai thác nguồn C, không phát hiện thêm phép chế hóa.

1. **Facts:** Tử–Tướng Vượng tại Thìn/Tử hóa Quyền/Thân ở Quan/Hổ–Tấu đồng cung/Liêm độc thủ Tài Thân đều khớp snapshot. Không thấy lỗi fact nghiêm trọng.
2. **Chính/phụ tinh:** giải thích Tử–Tướng với Quyền thay vì đếm hai bảo đảm độc lập; Hổ–Tấu có ý nghĩa biểu đạt và NPL226 được giới hạn nghĩa nền trong ngữ cảnh dạy học. Hữu Bật và các sao khác chưa có phân tích, không từ tên sao tự suy.
3. **Tam phương/tứ chính:** Tài là tam hợp và có phạm vi riêng. Không dùng Mệnh/Phu không phải lỗi bắt buộc; guide yêu cầu một liên hệ có ích, không quota hết mọi cung. Quan hệ này được giải thích rõ hơn2.1 nhưng chủ yếu là phân biệt hai lĩnh vực, chưa phân tích tác động sâu.
4. **Tứ Hóa/điều chỉnh:** Quyền “được việc” không thành chức vụ; biểu đạt không tự giải vấn đề thẩm quyền. Chưa có Kỵ Mệnh/Khoa đối cung hoặc ngoại lệ phối hợp, không tự đặt phép bù trừ.
5. **Chiều sâu chủ đề:** có ba phương diện tổ chức–quyết định, truyền đạt phương án, và tổ chức khác tích lũy. Trục đầu vẫn là ý đã có ở1.2/2.1; chưa tăng nhiều luận điểm chuyên môn độc lập.
6. **Nguồn:** giữ đủ mặt thuận và mưu tính/vượt quyền của Tân Biên; NPL226 không thành chỉ định nghề dạy học. C chỉ dùng Tài, không bị nâng thành nghĩa của sao tọa Quan. Không có D làm kết luận cá nhân.
7. **Văn phong:** ba phần mạch lạc hơn tám phần1.2, bỏ phần coaching cuối2.1. Còn lặp nhẹ “quyền quyết định/trách nhiệm/phạm vi” trong phần đầu và lời phủ định nhiều; không hoàn toàn thoát giọng chú giải nguồn.
8. **Cụ thể/tự đối chiếu:** ví dụ quyết định khác giải thích cho người thực hiện và tổ chức khác tích lũy hữu ích hơn danh sách sao; vẫn là phân biệt khái niệm rộng, không nên coi là nhận diện sâu cá nhân.
9. **Không bịa/dự báo:** không kết luận chức vụ, thăng tiến hoặc thực trạng năng lực. Câu giới hạn không lấy “Suy” thành công việc sa sút đúng provenance vòng Trường Sinh còn bất nhất. `focused` chỉ thể hiện phạm vi có trọng tâm.

### Tài Bạch — cải thiện ngữ cảnh, chưa thành phối hợp Liêm–Hao

So2.1 bốn phần không dùng C, bài2.2 ba phần/sáu đoạn có hai đoạn C từ Quan. Không thêm một tri thức Tử Vi trực tiếp về Liêm–Hao: thay đổi thực chất nằm ở cách đặt các luận điểm cạnh nhau. Câu “quyền sử dụng hay phân bổ nguồn lực trong một công việc, nếu có, không đồng nghĩa nguồn lực ấy trở thành khoản tích lũy cá nhân” nối lời tổ chức/Quyền ở Quan với khâu tích lũy ở Tài. Đây là tổng hợp có điều kiện của AI, không lời sách về mức thu nhập. So1.2 đã có Quan/Mệnh,2.2 chọn một liên hệ và giải thích rõ hơn, bỏ chương kể Bát Tọa/Thiên Tài không có nghĩa; không chứng minh sâu hơn trên mọi phương diện.

1. **Facts:** Liêm Vượng độc thủ Thân/Đại Hao Đắc đúng; không đổi bảng độ sáng để áp Nhị Hao hãm. Không tìm thấy sai sao/vị trí nghiêm trọng trong toàn văn.
2. **Chính/phụ tinh:** giữ Đại Hao riêng, giải thích vì sao chưa áp nhánh NPL. Đây là quản lý giới hạn, chưa phải phân tích tác dụng phối hợp thực chất; Bát Tọa/Thiên Tài/Thái Tuế chưa khai thác.
3. **Tam phương/tứ chính:** nêu Quan tam hợp, giữ nguồn ở Quan, phân biệt tổ chức với sở hữu; vượt lỗi bỏ toàn bộ C của2.1. Chưa phát triển Mệnh/Phúc, không ép dùng mọi phía.
4. **Tứ Hóa/điều chỉnh:** Quyền ở Quan không thành Quyền tại Tài, không tự tăng tiền hoặc giải Hao; chưa có luận điểm điều chỉnh toàn cấu trúc.
5. **Chiều sâu chủ đề:** có ba góc tạo/tích lũy, đổi nhịp chi ngoài việc, và điều phối khác sở hữu. Hai góc đầu đã có ở2.1; nguồn tổ hợp Liêm–Hao vẫn thiếu.
6. **Nguồn:** Tân Biên/NPL cùng ý Liêm không được tính hai phát hiện; Trung Châu Tử VCD nói chi tiêu của đương số, không tính cách con. Giữ ngoại lệ và nguồn gốc, không bịa phép chế hóa.
7. **Văn phong:** gọn hơn1.2, không danh sách sao kéo dài, không coaching kết thúc riêng như2.1. Vẫn nhiều “không…”, “lời…”, “nhánh…”; còn cảm giác giải thích giới hạn tài liệu.
8. **Cụ thể/tự đối chiếu:** hỏi tác động khoản chi ngoài kế hoạch đến phần định giữ là cụ thể nhưng gần bài cũ; phân biệt quyền phân bổ và tài sản riêng là ý mới đáng đọc. Chưa đủ để gắn chuyên sâu toàn cung.
9. **Không bịa/dự báo:** không hứa thu nhập/tài sản/lợi nhuận; phân biệt tổng hợp và lời nguồn. Nhãn model `focused` đúng trọng tâm cục bộ, không nâng thành chứng nhận thương mại.

### Phu Thê — thêm một luận điểm trực tiếp, giữ limited

So3.2 tám phần chủ yếu kể vị trí và giới hạn của nguồn Khoa,2.2 ba phần/bảy đoạn có nét Phá Quân từ Trung Châu và đối chiếu Quan. Câu “điều một bên cho là tốt đẹp được mặc nhiên xem là điều tốt cho cả hai” triển khai nét chủ quan của nguồn thành câu hỏi về đồng thuận. Câu “hiệu quả tổ chức không tự thay thế sự đồng thuận” dùng Quan ở đúng đối cung; không biến Tử–Tướng thành phẩm chất người phối ngẫu. Đây là tổng hợp biên luận, không quy tắc sao mới.

1. **Facts:** Phá Đắc/Đà Đắc/Hỏa chưa rõ/Tả hóa Khoa/Quan đối đúng; Tuần hiện diện nhưng provenance phép an riêng chưa xác minh, không bị bỏ. Không thấy sai fact nghiêm trọng.
2. **Chính/phụ tinh:** thực sự diễn giải Phá theo nhánh Sát/Tham/Phá tọa Phu, giữ lượng từ “phần nhiều”; chưa có phối hợp Phá–Đà–Hỏa, không giả vờ đã có.
3. **Tam phương/tứ chính:** hai đoạn dùng Quan đúng xung; phân biệt sắp xếp việc và cùng quyết định, thay bản đồ kể sao cũ. Chưa triển khai Phúc/Di.
4. **Tứ Hóa/điều chỉnh:** Khoa thuộc Tả, không Phá hóa Khoa; học vấn không tự bảo đảm hòa hợp hoặc xóa Đà/Hỏa. Phần điều chỉnh tổng thể vẫn thiếu.
5. **Chiều sâu chủ đề:** thêm tương tác chủ quan/đồng thuận và phân biệt học thức với trao đổi bất đồng. Có ích hơn bài cũ chỉ Khoa, nhưng chưa đánh giá toàn cấu trúc quan hệ.
6. **Nguồn:** giữ Tứ Hóa phái riêng, lời Khoa Tân Biên cục bộ; không đem nhánh nữ mệnh áp hồ sơ nam, không suy cưới/chia tay. Nguồn mới chưa tính phụ/hung tinh, bài không đổi thành điều kiện phải vắng.
7. **Văn phong:** ba luận điểm liên tục, tự nhiên hơn tám mục cũ, tránh liệt kê. Vẫn nặng lời giới hạn; “cấu trúc”, “nhánh” hơi giống hồ sơ nguồn.
8. **Cụ thể/tự đối chiếu:** đồng thuận khác nhiệt thành, học thức khác khả năng trao đổi, tổ chức khác quyết định chung là ba phân biệt rõ; một phần là lời suy ngẫm quan hệ phổ quát, không coi là chứng minh cá nhân.
9. **Không bịa/dự báo:** không khẳng định cá tính người vợ hoặc kết quả hôn nhân; không tạo phép Khoa giải sát. `limited` phù hợp, không tự nâng thành sâu.

## Kết quả kỹ thuật và số đo

Cả ba completed/Structured Outputs hợp lệ, cùng1attempt/cung,3section/cung; Quan/Tài `focused`, Phu `limited`. Không insufficient hoặc fallback. Mọi fact/knowledge ID tồn tại; C giữ cung gốc cả trong ai-synthesis, B/reference-only không bị diễn giải thành khẳng định cá nhân. Hai đoạn C mỗi bài; review contextGuide Quan/Tài không còn cảnh báo bỏ toàn bộ ngữ cảnh. Điều này chứng minh sử dụng đúng lớp nguồn, không tự chứng minh lập luận sâu hoặc đời sống đúng. [Audit basis/ID từng đoạn](../.local/ai-paid22-real-20261101/reference-audit.json).

- **Quan Lộc**: input29167, cache-write29164, cached read0, uncached3; output5398 **đã gồm** reasoning3541. Provider359giây; queue46.308giây; dispatch→lưu467.748giây; quan sát HTTP cộng dồn9.322giây.1CREATE/4ResponsesGET/1attempt; ước**0.6344800USD**. Receipt `resp_09d265c2debd4baa006ae71d02f45887d29770dd34112e8248`.
- **Tài Bạch**: input29328, cache-write29325, cached read0, uncached3; output5777 **đã gồm** reasoning3970. Provider131giây; queue49.453giây; dispatch→lưu223.023giây; quan sát HTTP cộng dồn3.977giây.1CREATE/3ResponsesGET/1attempt; ước**0.6554425USD**. Receipt `resp_0a31aa8a63bfd826006ae71d05179c87d2b22ca86c650fb031`.
- **Phu Thê**: input26687, cache-write26684, cached read0, uncached3; output4445 **đã gồm** reasoning2588. Provider84giây; queue51.628giây; dispatch→lưu98.923giây; quan sát HTTP cộng dồn3.322giây.1CREATE/2ResponsesGET/1attempt; ước**0.5558300USD**. Receipt `resp_0b0926817f86b588006ae71d072e6487d2aede88d1d9b32f83`.

Tổng **3CREATE +9ResponsesGET**, thêm4ModelsGET (1preflight/3dispatch) và3POSTinput_tokens, không call provider khác. Chi phí ba response ước**1,8457525USD**, dưới dự phòng3USD. Đây là estimate theo usage thực/rates Standard `openai-standard-2026-10-30`, không hóa đơn provider; không gọi token count miễn phí hóa đơn khi chưa có chứng cứ riêng. Actual input cao hơn count7token/bài, nằm trong5% dự phòng. Cached read0, cache-write là tập con input; reasoning không cộng lần hai. [Usage/breakdown/timing](../.local/ai-paid22-real-20261101/metrics.json), [network ledger không có header/key](../.local/ai-paid22-real-20261101/network-events.jsonl).

Background dùng receipt/attempt cũ và lịch run_after bền vững30/60/120/240giây, cap12checks/24giờ, không reset. Quan4GET/Tài3GET/Phu2GET; khoảng provider xong đến lưu Quan/Tài lớn hơn vì backoff, không tính thành thời gian model. Không có CREATE retry hoặc request mất ID; không thử crash/restart lại vì đã kiểm mock/runtime trước và lượt này không sửa cơ chế. Không suy ETA11cung hoặc thay giao diện5phút từ ba bài.

## Quyền, lưu/mở và bảo toàn

HTTP trên đúng QA3121/báo cáo mới: không phiên trả404, đúng owner synthetic trả200 ba lần; mở trang đơn/thư viện hợp lệ, result API bằng DB, đọc lặp trả nội dung đồng nhất. Không tăng job/attempt/network event khi đọc lại; snapshot/freeMenh và bản báo cáo lưu giữ hash. Đây là kiểm máy chủ/HTTP với phiên synthetic do cơ chế QA hiện có tạo, **không phải nghiệm thu browser/mobile hoặc OAuth Google thực mới**. Không tạo recovery fixture hay chèn cookie vào trình duyệt. [Bằng chứng HTTP/quyền](../.local/ai-paid22-real-20261101/http-verification.json).

Progress trả3/11/processing là đúng: tám job mới khác vẫn queued/0attempt theo giới hạn thử, không phải lỗi giao11bài hoặc đã nghiệm thu11/11. Không chạy consumer/supervisor thường trực.44job cũ/18queued cùng attempt/receipt/result giữ nguyên; bảy bảng lịch sử QA clone, mỗi bảng4hàng gốc, khớp backup;85artifact lịch sử/nguồn giữ hash. Không retry hai failed-credit V2 cũ. [Job/read](../.local/ai-paid22-real-20261101/preservation-and-read.json), [bảy bảng](../.local/ai-paid22-real-20261101/historical-data.json), [85hash](../.local/ai-paid22-real-20261101/historical-artifacts.json).

Đã backup riêng DB clone sau kiểm, dừng đúng QA3121/PG55452, giữ data/artifact/receipt để truy vết. QA3118 PID68941 không đổi; QA3062/3070 không nghe cổng ở cả trước/sau, không tự khởi động hoặc cập nhật. Không worker thanh toán, Live, API Luna, engine, schema, quyền hoặc báo cáo lịch sử bị sửa. [Backup receipt](../.local/ai-paid22-real-20261101/backup-after.json), [shutdown scope](../.local/ai-paid22-real-20261101/shutdown.json).

Không sửa code ứng dụng nên không chạy lại test/build/E2E/PDF. Tái dùng build đã kiểm92test/typecheck/build ở866bd37, đối chiếu module nguồn trước serve. Những kiểm **thực chạy vòng này**: token preflight, pipeline thật snapshot→input→provider→validation→DB, reference audit, HTTP quyền/read lại, hash/lịch sử, backup và shutdown scope; kiểm diff/link/secret tài liệu trước commit. Không gọi kiểm mock cũ là kết quả mới.

## Kết luận và phạm vi11cung

**ĐẠT vòng kiểm kỹ thuật ba bài; CHƯA ĐẠT để phát hành thương mại11cung.** Hai điểm chặn có tiến bộ rõ: Quan/Tài không bỏ toàn bộ C nữa; Phu có thêm nét tương tác thực sự từ nguồn mới. Không lấy việc mọi bài ba phần hoặc focused làm chứng nhận chất lượng. Không thay bài cũ, prompt2.2/retrieval1.4 được giữ nguyên để đọc đánh giá; không có lượt tối ưu thêm.

Phạm vi trên snapshot này: Quan/Tài có bài tập trung cục bộ; Phu có bài giới hạn; Phúc giữ bài2.1limited. Nô/Tử có thêm mỗi một lời hẹp đủ điều kiện, **chưa API thật**, chưa toàn diện; Phụ Mẫu/Điền/Di/Huynh chỉ đủ phân tích có giới hạn từ ma trận cũ. Tật chỉ chú giải cấu trúc an toàn/có thể insufficient, không chẩn đoán/tuổi thọ/điều trị. Không suy độ phủ mọi lá số từ một snapshot. [Ma trận11cung trước](AI-PAID-RELEASE-READINESS-20261101.csv) phải đọc cùng [bổ sung nguồn mới/điều kiện](AI-PAID-SOURCES-CONTEXT-20261101.md); các số0 Nô/Tử và Phu1 trong ma trận trước là mốc lịch sử, hiện thành1/1/2nguồn trực tiếp hẹp.

Còn **hai vấn đề chặn**:

1. **Nền phối hợp và độ phủ chuyên môn:** Liêm–Hao, Phá–Đà–Hỏa và phần lớn Nô/Tử còn thiếu căn cứ phối hợp đúng điều kiện; không gán mọi cung cùng độ sâu hoặc lấy source count làm bảo đảm. Nguồn đã bổ sung chỉ giải một khía cạnh hẹp, không lấp toàn bộ.
2. **Giá trị bài đọc:** Quan/Tài đã dùng ngữ cảnh nhưng phần nối còn thiên phân biệt ranh giới và phủ định, ít luận điểm chuyên môn mới; Phu gọn hơn nhưng một phần gần lời tự đối chiếu quan hệ phổ quát. Cần chủ dự án đánh giá toàn văn này về giá trị thực trước cam kết chuyên sâu; không tự gọi thêm bài để chọn văn đẹp hoặc tự mở gói mới.

Không phát hành/QA3062/3070/SePayLive, không tự chạy các job còn lại hoặc API thêm.
