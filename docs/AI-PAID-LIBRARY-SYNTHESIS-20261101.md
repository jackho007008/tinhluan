# Retrieval thư viện và tổng hợp có căn cứ — 01/11/2026

**Đã triển khai và kiểm mock; chưa gọi Astra hoặc nghiệm thu chất lượng văn mới.** Baseline `main@0aa60f1`, tracked/index sạch; giữ nguyên `buu-dinh-7parts/` và `docs/handoff/` chưa commit. Phạm vi Nô/Tử/Phu/Tài, không phát hành hoặc cập nhật QA3062/3070.

## Đã thay đổi

Retrieval **`paid-retrieval-1.5.0`** tái dùng evaluator/V1/C/D và thêm bộ đọc index đoạn sách đã rà trong kho riêng. Không xây lại engine, queue hay hệ rule luận đoán. Thêm nguồn tiếp theo bằng dữ liệu index, không phải thêm một nhánh TypeScript cho mỗi tổ hợp. Bộ chọn chỉ chứng minh điều kiện lấy đoạn, không tự tính kết quả cuộc đời.

`paid-library.ts` đọc `${AI_KNOWLEDGE_DIR}/paid-passages/index.json` và đúng các trang chữ được index chỉ tên dưới `${AI_KNOWLEDGE_DIR}/../books`. Mỗi đơn vị có chủ đề/cung, đoạn diễn ý, tác giả/vị trí, điều kiện AND/OR tường minh, ngoại lệ, trạng thái reviewed/draft/rejected, hash trang nguồn. Chỉ reviewed đủ điều kiện và hash khớp được dùng; sai/mất index, sai hash/trang, template, anchor chưa xác minh đều không được lấy. `reviewed` là Codex rà biên tập theo nguồn, **không chứng nhận chuyên môn độc lập hoặc quyết định mở bán**.

Giới hạn: index tối đa64đơn vị/256KB; một request lấy tối đa4đoạn thư viện và14KB JSON, giữ cap A12/B10/C8/D3 cũ. Ưu tiên lời trực tiếp trước nghĩa nền và số neo phù hợp; không điểm chất lượng lá số. Không đọc PDF, không search toàn sách mỗi request hoặc gửi toàn văn sách. Tên sao không đủ: phải đúng field/cung, nguồn `source-traced` và natal; Tứ Hóa dùng đúng fact năm sinh, không Lộc Tồn/tự hóa/phi hóa. Các yêu cầu phải cùng đạt, không suy OR từ tên bộ. Nguồn tương đương chỉ thay đoạn cũ trong **input mới** khi đoạn thư viện mới thực sự qua kiểm; nếu kho lỗi, nguồn cũ vẫn giữ.

Index hiện có **7đơn vị**, từ8trang chữ đã xử lý của NPL/TứHóaPhái1–2. Đây là lô hữu hạn, **chưa index toàn kho và không khẳng định hết sách**. Không sửa Bửu Đình, hồ sơ nguồn cũ, engine hoặc catalog.

## Nguồn và điều kiện

1. **Nô — giao du và cảm tình:** TứHóaPhái1 PDF129, Hóa Lộc năm sinh tại Nô, các ý(1)/(6). Thêm phương diện thích giao du/mạng lưới qua lại; không suy số bạn thực, chân tình hoặc trợ giúp. Cùng tác giả/vị trí Lộc với đoạn kỳ vọng đã có, không tính là xác nhận độc lập.
2. **Nô — biểu hiện hợp tác khác thu lợi:** cùng sách PDF130 ý(12). Giữ chủ thể hợp tác, thu lợi cần xét Nô/tam phương; không hứa hợp tác thành công hoặc tự đặt phép tính lợi ích. Không đem vế con/cha mẹ ở cùng trang làm lời cộng sự.
3. **Phu — trợ giúp và khác biệt quan niệm:** TứHóaPhái2 PDF173–174 §2.3.7 mở đầu/nhánh TảPhụ hoặc HữuBật. TảPhụ được đối chiếu tên TảPhù trong snapshot, phải tọa Phu. Giữ hai mặt trợ giúp từng giai đoạn và quan niệm có chỗ va chạm; chưa tính các phụ/hung tinh và phi/tự hóa. Không đưa các dự báo người thứ ba/tái hôn vào đầu ra. Không lấy Khoa hoặc Tả/Hữu hóa giải Phá–Đà–Hỏa.
4. **Tử — Lộc và tình cảm quan tâm:** TứHóaPhái2 PDF196, chỉ vế mệnh tạo thương con khi Lộc năm sinh tọa Tử. Không số con, sinh sản, tình dục, đầu tư hoặc khẳng định đặc điểm trẻ.
5. **Tử — Kỵ và quan tâm/lo lắng:** cùng sách PDF196–197, đúng Kỵ năm sinh tọa Tử. Giữ mặt tình cảm có thể đi cùng nghiêm khắc/lo lắng để tự đối chiếu; loại các vế y khoa, sinh đẻ, giới tính/số con, thời điểm hôn nhân/di chuyển hoặc đầu tư. Không chẩn đoán tâm lý hay xác nhận người xem đã có con.
6. **Tài — nghĩa nền TháiTuế:** NPL PDF226, ngữ cảnh năng khiếu nghề dạy học/biểu đạt. Giữ `reference-only`, không biến lời về ngôn ngữ thành lời kiếm tiền hoặc tranh tụng. Đây là bản có neo facts/hash của nguồn đã dùng, thay `paid-book.npl226-thai-tue` trong input mới, **không một luận điểm mới độc lập**.
7. **Tài — Thai–Tọa:** NPL PDF250. Bộ chọn nhận cả TamThai và BátTọa tọa Tài, giữ điều kiện hai sao, không chỉ một BátTọa. Không dùng Mộ để tự tăng tài sản hoặc hứa thuận lợi tài chính. Mẫu đối chứng chỉ có BátTọa nên **bị loại**, không lấp Tài bằng một nguồn thiếu điều kiện.

Tái dùng chữ/nhật ký/hồ sơ đã có và đọc hẹp đúng đoạn; không mở PDF hoặc kiểm ảnh mới. Giữ riêng quan điểm từng tác giả. Hash không chứng minh OCR/diễn ý đúng; những đoạn còn mơ hồ, phạm vi sai hoặc thiếu dữ kiện không được tự nâng thành lời trực tiếp. [Index đầy đủ](../.local/source-library/knowledge/paid-passages/index.json), [manifest trang/index và bản sao riêng](../.local/ai-paid-library-20261101/source-manifest.json).

## Astra tổng hợp và tương thích

Prompt mới **`paid-palaces-vietnamese-2.3.0`**, contract vẫn `paid-reading-v2.0.0`, facts vẫn1.1.0. Hướng dẫn chọn luận điểm, gộp ý trùng, giải thích đóng góp riêng của từng nguồn và phần liên hệ do AI đề xuất. **Không đòi sách có nguyên văn tên toàn bộ tổ hợp mới được phân tích**; vẫn không tự đặt quy tắc thắng/thua/chế hóa hoặc biến sự kiện đời sống thành chắc chắn. Nghĩa thiếu của một sao không được bịa, cũng không buộc cả bài chỉ còn lời xin lỗi. Nô phân giao du/kỳ vọng/thực chất trợ giúp; Phu phân tương tác/trợ giúp/khác biệt; Tài phân tạo/tích lũy/dùng tiền/biểu đạt; Tử giữ đúng quan hệ/quan tâm có nguồn.

Tham khảo việc tách chỉ dẫn và ngữ cảnh trong [OpenAI Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering); tài liệu API không chứng nhận nội dung Tử Vi.

Các đoạn nguồn là dữ liệu tham khảo, không chỉ dẫn để model thi hành. Không ghi thuật ngữ nội bộ trong thân bài, không coaching thay phân tích, không kéo dài để đạt mục/từ. Một góc liên cung tốt cần giải thích được ích lợi khi đọc cùng; không dừng mọi lần ở A không bảo đảm B. C/D giữ phạm vi, không đổi nghĩa của cung khác thành lời trực tiếp.

Với **2.3**, một B/reference-only có `passage.kind=foundation`, digest và neo facts phù hợp có thể hỗ trợ **ai-synthesis limited** mà không cần sẵn A/Bdirect. Nó không thành source-interpretation, không đủ focused; D không được hưởng cơ chế này. Validator bắt buộc dẫn đủ neo của mọi passage được dùng, kể cả khi có thêm A/Bdirect, không dùng ID trực tiếp để bỏ mất căn cứ nền. Đây là kiểm cấu trúc/provenance, **không chứng minh mọi câu suy ra đúng từ sách**.

Registry giữ các prompt1.x/2.0/2.1/2.2, chọn schema/prompt từ job/attempt như trước. GET job2.2 vẫn dùng validator2.2, không áp quyền tổng hợp nghĩa nền mới vào bài cũ. Guard C theo cung gốc của2.2 giữ ở2.2 và2.3. Mọi trường text vẫn qua guard Tật/y khoa. Không đổi job/receipt/retry/backoff/budget/payment/edition, không migration/result backfill. Mệnh V1/Luna và reader/UI không sửa.

## Dry-run và mock

Cùng snapshot đối chứng cũ, facts159 và byte JSON của nguồn C giữ nguyên; toàn snapshot/freeMenh không đổi. Các số dưới đây là số đoạn đủ điều kiện, không số luận điểm độc lập hay độ sâu thương mại:

- **Nô:** direct1→3, thêm giao du và biểu hiện hợp tác. Ba đoạn cùng dựa Lộc tại Nô, phải biên luận gộp thay vì kể thành ba lần may mắn.
- **Phu:**2→3, thêm nhánh Tả/Hữu. Có cơ sở đặt nét Phá cạnh trợ giúp/khác biệt, chưa có phép chế hóa Phá–Đà–Hỏa.
- **Tử:**1→1 trên mẫu đối chứng; **không chọn** nhánh Khoa/Lộc/Kỵ nếu sai vị trí. Snapshot QA khác có Lộc tại Tử nhận đoạn Lộc; snapshot năm1985 có Kỵ tại Tử nhận đoạn Kỵ. Không sửa facts để tạo witness. Tử VCD đối chứng vẫn thiếu nền toàn cấu trúc, không tuyên bố đã lấp.
- **Tài:** direct3→3; nghĩa nền TháiTuế được gắn đủ dấu vết và được phép tham gia tổng hợp có giới hạn. Thai–Tọa bị loại vì thiếu TamThai; Liêm–Hao vẫn chưa có phép phối hợp trực tiếp. Không báo có tri thức mới chỉ vì đổi ID nguồn.
- **Quan:** direct3→3, guide/C cũ không đổi; chỉ nhận hướng dẫn biên luận2.3.
- **Tật:**0→0, không nguồn thư viện mới, không mở phạm vi y khoa.

[So sánh và lý do loại/giữ](../.local/ai-paid-library-20261101/dry-summary.json); mock trong các file `*-dry.json`/`*-dry.mock.md` cùng thư mục chỉ chứng minh contract/căn cứ, **không phải bài Astra hoặc ví dụ đã duyệt cho khách**. [Witness KỵTử và mock](../.local/ai-paid-library-20261101/tu-ky-engine-witness.json). Đã đọc lại sáu kết quả thật2.1/2.2 bằng input/prompt đã lưu, tất cả qua validator đúng phiên bản; không sửa nội dung.113artifact nguồn/lịch sử được so hash, prompt cũ giữ nguyên byte. [Bảo toàn](../.local/ai-paid-library-20261101/history-check.json).

## Kiểm thực chạy và lỗi đầu

- **100/100 pure test trong9file:** bộ chọn điều kiện/AND–OR, natal vs self/flow, nguồn thiếu/đổi hash/draft/template, giới hạn/khử trùng/thay tương đương, nền2.3limited và2.2strict, anchor kể cả có direct, C/y khoa, adapter/books/topic/context/reader/provider-failure. Fetch thật bị chặn trong launcher, SDK trong test dùng mock.
- **3/3 DB mock:** PostgreSQL test riêng55453, identity được kiểm trước; clone từ backup QA có kiểm soát, không DB gốc/migration chính. Kiểm writer mới, quyền/thanh toán lặp, đọc không CREATE, Mệnh/legacy và V1pending qua test V2 hiện có. Không consumer/supervisor. [Biên nhận](../.local/ai-paid-library-20261101/test-db-receipt.json).
- Typecheck đạt. Build Node24.22.1 cách ly/key rỗng/AI tắt/DBcổng1 đạt; BUILD_ID `De7QFQulqh-Wu-Ojc3HNp`. Chỉ build, không serve/restart web hoặc kiểm browser/mobile mới. Không toàn E2E/PDF.
- Lỗi đầu: fixture dùng helper cũ tự trả insufficient khi không có direct, nên chưa có section để sửa; dựng explicit mock limited cho ca nền mới, không sửa fixture/lịch sử cũ để ép xanh. Ca guard tiếp theo dùng câu phủ định ngoài whitelist nguyên câu hiện hành nên bị chặn đúng contract; đổi mock sang câu đã hỗ trợ, không nới validator y khoa. Witness Kỵ phát hiện đoạn diễn ý có cụm giới hạn y khoa dễ bị sao chép vào thân bài; đổi diễn ý thành không xác nhận trạng thái tâm lý thực tế, giữ giới hạn an toàn trong nguồn/prompt, rồi mock witness đạt. Không đổi nguyên văn trang sách.
- Các lượt kiểm lại sau siết anchor và thêm trường sao đúng schema, không benchmark hoặc API để chọn văn đẹp. [Logs/tests/build](../.local/ai-paid-library-20261101/manifest.json).

**0CREATE/0GET OpenAI thật,0Luna, chi phí API0USD.** QA3062/3070 không cập nhật, QA3118 giữPID68941; chỉ DB test55453 được tạo/chạy test rồi dừng, data giữ lại. Không worker thanh toán, job queued QA chính, quyền/báo cáo lịch sử, engine, BửuĐình hoặc Live bị thay.

## Bàn giao kho private và điểm dừng

Mã nguồn nằm trong Git; index và trang sách ngoài Git theo SOURCE-LIBRARY. Có bản sao riêng9artifact (index+8trang) ở `.local/ai-paid-library-20261101/source-bundle`, kèm manifestSHA256. Cần bố trí đúng index và các trang dưới cùng layout khi sau này triển khai worker ở máy/checkout khác; không chỉ chuyển code hoặc index. Mất index có cảnh báo input và fallback về nguồn V1/catalog có thật; sai trang/hash loại đoạn tương ứng. Chưa chuyển kho hoặc deploy QA3062/3070, chưa coi cùng volume là backup ngoài máy.

Phần đã hoàn thành là retrieval đọc index có kiểm điều kiện và contract tổng hợp2.3. **Chưa thể kết luận Astra viết hay hơn hoặc đã đạt phát hành.** Tử đối chứng còn mỏng; Liêm–Hao/Phá–Đà–Hỏa còn thiếu phép phối hợp trực tiếp, các nghĩa nền chỉ được tổng hợp có mức độ. Chưa khai thác hết kho hoặc khẳng định mọi lá số có đủ nguồn. Dừng ở mock/build; không gọi thêm API hoặc tự mở nhiệm vụ thương mại.
