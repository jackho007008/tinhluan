# Gói 2.1 — đánh giá ba bài AI Mệnh thật

Ngày 27/10/2026. Baseline `b6fa7dc`; triển khai Gói2 `44b42c0`. Chỉ QA3111, không cập nhật QA3062.

Ba đầu vào kỹ thuật được chọn theo cấu trúc trước khi xem bài, từ lưới tối đa36 phép tính engine; tìm đủ sau26. Đây là snapshot engine thật trên dữ liệu QA tổng hợp, không phải khách hàng thật hoặc fixture sửa sao. A: Liêm Trinh–Phá Quân cùng Hãm tại Dậu; B: Mệnh Hợi vô chính diệu; C: Thái Dương Hãm tại Tý có Địa Kiếp/Thiên Khôi. Không chọn theo chất lượng bài. Không đưa tên, ngày giờ sinh, cookie/key vào các file bàn giao dưới đây.

## Model, prompt và chi phí

Project hiện tại truy cập được `gpt-6-astra`; dùng đúng model đó, reasoning `high`, Structured Outputs với schema8phần thực tế. SDK7.45.0, Node24.19.0. Prompt `menh-vietnamese-1.0.0` giữ nguyên, không chỉnh lời/prompt sau khi xem bài. Mỗi mẫu đúng1CREATE/1attempt/1bài completed. Ba GET provider sau hoàn thành đối soát cùngresponseID, nội dung khớp database.

| Mẫu | Input token | Output token | Reasoning (nằm trong output) | Thời gian worker | Ước tính USD |
| --- | ---: | ---: | ---: | ---: | ---: |
| A | 15298 | 6745 | 3522 | 182.301 giây | 0.49023 |
| B | 15344 | 8865 | 5753 | 221.633 giây | 0.59669 |
| C | 16054 | 6801 | 3624 | 185.098 giây | 0.50059 |

**Tổng vòng này: $1,58751**, theo [giá Standard](https://developers.openai.com/api/docs/pricing?latest-pricing=standard) $10/$1/$50 cho1triệu token input/cache/output; cached input cả3 là0. Reasoning đã nằm trong output, không cộng phí lần nữa. Đây là ước tính, không phải hóa đơn. Request timeout ở lượt trước chưa có usage/chi phí và không nằm trong tổng này. Thời gian từ claim attempt đến lưu kết quả, gồm gửi/poll; không tính chờ trong queue.

## Hồ sơ đầy đủ, tách theo mẫu

- **A:** [bài đầy đủ](../.local/ai-menh-package21-20261027/A/reading.txt), [facts](../.local/ai-menh-package21-20261027/A/facts.json), [tri thức](../.local/ai-menh-package21-20261027/A/knowledge.json), [prompt thực gửi](../.local/ai-menh-package21-20261027/A/prompt.txt), [metadata/tiêu chí chọn](../.local/ai-menh-package21-20261027/A/metadata.json), [model/usage/responseID](../.local/ai-menh-package21-20261027/A/run.json), ảnh [360](../.local/ai-menh-package21-20261027/A/completed-360.png) / [390](../.local/ai-menh-package21-20261027/A/completed-390.png).
- **B:** [bài đầy đủ](../.local/ai-menh-package21-20261027/B/reading.txt), [facts](../.local/ai-menh-package21-20261027/B/facts.json), [tri thức](../.local/ai-menh-package21-20261027/B/knowledge.json), [prompt thực gửi](../.local/ai-menh-package21-20261027/B/prompt.txt), [metadata/tiêu chí chọn](../.local/ai-menh-package21-20261027/B/metadata.json), [model/usage/responseID](../.local/ai-menh-package21-20261027/B/run.json), ảnh [360](../.local/ai-menh-package21-20261027/B/completed-360.png) / [390](../.local/ai-menh-package21-20261027/B/completed-390.png).
- **C:** [bài đầy đủ](../.local/ai-menh-package21-20261027/C/reading.txt), [facts](../.local/ai-menh-package21-20261027/C/facts.json), [tri thức](../.local/ai-menh-package21-20261027/C/knowledge.json), [prompt thực gửi](../.local/ai-menh-package21-20261027/C/prompt.txt), [metadata/tiêu chí chọn](../.local/ai-menh-package21-20261027/C/metadata.json), [model/usage/responseID](../.local/ai-menh-package21-20261027/C/run.json), ảnh [360](../.local/ai-menh-package21-20261027/C/completed-360.png) / [390](../.local/ai-menh-package21-20261027/C/completed-390.png).

## Bảng đánh giá 0–5

Codex; đã đọc toàn văn 3 bài và đối chiếu đúng packet gửi đi, không phải phê duyệt chuyên môn độc lập. 0: sai hoặc bỏ hẳn; 1: thiếu nghiêm trọng; 2: có nhưng nông; 3: dùng được một phần; 4: tốt trong phạm vi đối chiếu; 5: đáp ứng đầy đủ tiêu chí đã kiểm. Không suy độ chính xác Tử Vi ngoài engine từ điểm này.

| Tiêu chí | A | B | C |
| --- | ---: | ---: | ---: |
| Đúng dữ kiện engine | 4 | 4 | 4 |
| Kết hợp chính tinh và phụ tinh | 2 | 3 | 2 |
| Tam phương tứ chính đúng ngữ cảnh | 3 | 3 | 3 |
| Tổng hợp mâu thuẫn, chế hóa | 2 | 3 | 2 |
| Tri thức sách đúng căn cứ | 4 | 4 | 4 |
| Tiếng Việt tự nhiên, cụ thể | 3 | 3 | 3 |
| Không quá mức hoặc lấn 11 cung | 5 | 5 | 5 |

Không tính điểm tổng hoặc gọi đạt nghiệm thu từ độ trôi chảy. Điểm4 về facts nghĩa là các mệnh đề được rà khớp packet, không chứng minh engine hoặc Tử Vi đúng thực nghiệm. Điểm5 về phạm vi dựa trên việc đọc toàn văn cả8phần: chưa thấy nội dung trả phí/y khoa/định mệnh bị vượt.

### Mẫu A

1. **Đúng dữ kiện engine — 4/5:** Phần1/4/5/6 giữ Liêm–Phá cùng Hãm tại Dậu, Tuần/Triệt Thân–Dậu, Vũ–Tham Miếu tại Sửu và Tử Vi Miếu/Thất Sát Vượng tại Tỵ; khớp facts. Không phát hiện sai facts khi đối chiếu, nhưng chưa kiểm lại chính engine hoặc mọi hàm ý ngôn ngữ.
2. **Kết hợp chính tinh và phụ tinh — 2/5:** Phần4–5 chủ yếu loại nhánh không khớp và liệt kê sao; chưa phân tích Liêm–Phá cùng các sao tại Mệnh. Trục giữ chuẩn/sửa phương pháp là giả thuyết AI, chưa có nguồn riêng cho tổ hợp.
3. **Tam phương tứ chính đúng ngữ cảnh — 3/5:** Phần6 giữ đúng Sửu/Tỵ tam hợp, Mão xung chiếu, không lấy Thiên Tướng xung chiếu áp Liêm–Tướng đồng cung; phần tác động lên Mệnh còn ít.
4. **Tổng hợp mâu thuẫn, chế hóa — 2/5:** Phần7 không tuyên bố sáng chiếu thắng Hãm hoặc Tuần/Triệt cứu hết; chưa tổng hợp được cơ chế điều chỉnh có căn cứ.
5. **Tri thức sách đúng căn cứ — 4/5:** Phần4 dùng NPL15 để giữ đồng cung khác cộng nghĩa, loại r10/r19 sáng vì cả hai đang Hãm; không bịa sách/trang. Tính đúng phạm vi tốt hơn độ sâu tri thức riêng của tổ hợp.
6. **Tiếng Việt tự nhiên, cụ thể — 3/5:** 1328 từ, rõ nhưng nhiều câu về engine/gói/chưa đủ; trục tự quan sát lặp ở nhiều phần và còn chung.
7. **Không quá mức hoặc lấn 11 cung — 5/5:** Đọc cả8phần: không dự báo định mệnh, không y khoa, không bài tài sản/hôn nhân/nghề nghiệp; cung khác chỉ làm bối cảnh.

### Mẫu B

1. **Đúng dữ kiện engine — 4/5:** Phần1/4/6 giữ Mệnh Hợi VCD, Liêm–Tham Hãm ở Tỵ, Văn Khúc Đắc/Kỵ và Tham Lang Quyền tại Tỵ; không đưa sao đối cung vào Mệnh. Khớp packet; đây là đối chiếu engine, không xác nhận con người.
2. **Kết hợp chính tinh và phụ tinh — 3/5:** Phần2/3 kết hợp Quyền–Kỵ ở đối cung thành câu hỏi tự chủ/được hiểu. Linh–Diêu chỉ là liên tưởng AI đã ghi rõ, còn Thiên Y/Đường Phù chưa được phân tích.
3. **Tam phương tứ chính đúng ngữ cảnh — 3/5:** Phần6 xác định Mão/Mùi tam hợp, Tỵ xung, Không ở Tuất/Kiếp ở Tý hai bên; không gọi đồng cung hoặc tự xác lập cách giáp. Chưa đi sâu tương tác của toàn bộ cấu trúc.
4. **Tổng hợp mâu thuẫn, chế hóa — 3/5:** Phần7 giữ Văn Khúc Đắc khác hóa Kỵ và Quyền không tự giải Kỵ; có trục tự quyết/diễn đạt nhưng cơ chế chế hóa truyền thống chưa được giải.
5. **Tri thức sách đúng căn cứ — 4/5:** Dùng NPL01/07/16 đúng để không mượn sao giả và không chuyển lời sao tọa Mệnh sang sao chiếu; giữ các điều kiện chưa đủ. Chưa có tri thức riêng đầy đủ cho VCD này.
6. **Tiếng Việt tự nhiên, cụ thể — 3/5:** 1272 từ, câu hỏi cụ thể hơn A, nhưng phần phủ định/giới hạn vẫn dài và câu engine/gói lặp; các liên tưởng tâm lý chưa có kiểm chứng thực tế.
7. **Không quá mức hoặc lấn 11 cung — 5/5:** Đọc cả8phần: không luận riêng tiền bạc, nghề, hôn nhân hoặc bệnh/tuổi thọ; không biến hóa Quyền/Kỵ thành sự kiện chắc chắn.

### Mẫu C

1. **Đúng dữ kiện engine — 4/5:** Phần1/4/5/6 giữ Dương Hãm tại Tý, Kiếp/Khôi cùng Mệnh, Lương Miếu/Khoa tại Ngọ, Thân Phúc Đức Dần; tất cả khớp packet. Không đồng nhất Lương chiếu với Lương tọa.
2. **Kết hợp chính tinh và phụ tinh — 2/5:** Phần5 xác nhận Kiếp/Khôi/Quang/Diêu/Y có mặt nhưng dừng vì thiếu chú giải; chưa đáp ứng chiều sâu tổ hợp cát/sát của mẫu C.
3. **Tam phương tứ chính đúng ngữ cảnh — 3/5:** Phần6 giữ Cự Môn Hãm ở Thìn, cung Thân không chính tinh, Lương/Khoa đối cung Ngọ; đúng quan hệ, nhưng ít phân tích ảnh hưởng phối hợp lên Mệnh.
4. **Tổng hợp mâu thuẫn, chế hóa — 2/5:** Phần7 không áp Khoa–Kiếp đồng cung khi Khoa ở đối cung; không tự nói Khoa giải Kiếp. Đúng giới hạn, chưa có tổng hợp chế hóa đủ sâu.
5. **Tri thức sách đúng căn cứ — 4/5:** Phần1/4 dùng r21 Hợi/Tý để nói văn chương/triết học/đạo lý, không lấy r14 sáng đảo nghĩa sang Hãm. Không tự áp các nhánh Nhật–Nguyệt hoặc VCD Mùi không khớp.
6. **Tiếng Việt tự nhiên, cụ thể — 3/5:** 1387 từ, diễn giải rõ một chủ đề nhưng lặp chủ đề suy xét và nhiều lời rào; phần tự đối chiếu vẫn chưa phân biệt mạnh tổ hợp phụ tinh.
7. **Không quá mức hoặc lấn 11 cung — 5/5:** Đọc cả8phần: không chẩn đoán, dự tuổi thọ, luận chi tiết thu nhập/hôn nhân/nghề; không chắc chắn hóa sở thích hay năng lực.

## Phân loại vấn đề

- **Dữ kiện — Không phát hiện lỗi trong phạm vi đối chiếu:** Các vị trí/trạng thái/Tứ Hóa/quan hệ được bài nêu khớp packet. Không tự an sao, không đổi snapshot. Chưa kiểm lại tính đúng toàn bộ engine hoặc chứng minh Tử Vi ngoài đời.
- **Retrieval — Cần sửa trước QA3062:** Xếp hạng từ khóa đưa nhiều nhánh không khớp và template chưa resolve vào input. A có4, B3, C3 đoạn còn {{fact...}}; chỉ5/4/5 mục matched-saved-context trên tổng16/17/16 tham chiếu (không đồng nghĩa mọi mục khác vô ích). A có nhánh Vũ–Phủ tại Tý; C có VCD Mùi/Nhật–Nguyệt Sửu/Mùi. Thiếu tri thức nghĩa sao/tổ hợp sát với chính cung, làm bài nặng về từ chối. Không yêu cầu lấp mọi rule thủ công; cần truy xuất và kết xuất tốt hơn từ tri thức đã xử lý.
- **Prompt — Cần cải thiện trước QA3062:** 8phần có đủ nhưng lặp nhiều lời giới hạn và từ engine/gói trong thân bài. Cần giữ trace ở căn cứ, giảm lặp và yêu cầu tổng hợp có trọng tâm hơn; không đổi prompt để tái tạo ba bài đã lưu trong vòng này.
- **Model suy luận — Chưa thấy kết luận sai facts rõ ràng; độ sâu còn thiếu:** A giữ chuẩn/sửa cách làm; B tự chủ/được hiểu và Linh–Diêu/độ nhạy; C suy xét/thích ý nghĩa đều được ghi là giả thuyết. Không coi chúng là tri thức sách đã xác nhận hoặc tính cách người thật. Model thận trọng nhưng chưa phân tích đầy đủ phụ tinh/cát sát và chế hóa.
- **Nguồn chưa xác nhận — Giữ trạng thái chưa biết:** Chưa có đoạn trực tiếp trong packet cho Liêm–Phá Hãm tại Dậu với Tuần/Triệt; VCD Hợi với Linh–Diêu; Dương Hãm Tý cùng Kiếp–Khôi. Việc packet thiếu không chứng minh kho sách không có. Không đọc lại toàn bộ sách hoặc chọn nguồn thắng trong lượt đánh giá.

## Timeout, chống trùng và kiểm kỹ thuật

Background mode là opt-in `AI_MENH_BACKGROUND=true`, `store=true`; lưu responseID ngay sau CREATE vào bảng attempt hiện có, trước GET polling. Mất key trong quá trình đối soát vẫn giữ uncertain. Mất kết nối sau ID hoặc worker crash: cùng queue đối soát bằng GET cùng ID/cùng attempt, không CREATE và không tăng số lượt. Xóa/mất response trả404: dừng, không retry tính phí. Nếu mất kết nối trước khi biết ID: giữ uncertain, không tự tạo lại. Không bảo đảm exactly-once billing ở khoảng provider đã nhận nhưng ID chưa được lưu.

Request cũ `e404…` tiếp tục uncertain và bất biến; không thử gọi lại hoặc gán kết quả ba mẫu mới cho nó. Không có cách đối soát tự động trong adapter khi không có responseID; cần kiểm log/provider trước quyết định tiếp. `X-Client-Request-Id` chỉ là mã truy vết, không được coi là idempotency guarantee.

22/22 mock AI liên quan đạt (18cũ+4khôi phục), typecheck/build QA đạt; không chạy lại toàn E2E/PDF. Actualschema8phần/validation/database/UI đạt cả3. Mở lại và2POST retry hoàn thành mỗi mẫu không tăngattempt; worker không còn công việc mới.4tab,11khóaAI,360/390 khôngtràn, căn cứ mở được, khôngJSON/template trong evidence đã kiểm; console không pageerror.68JS không chứa key thực; browser không gọi thẳng provider.5AIjob cũ nguyên.

Chỉ webQA3111 được restart sang build mới; AIworkerQA3111 tạm dừng để giữ đúng giới hạn3bài, không có worker chạy chồng. 282file/8bảng main và PID/cwd/start QA3062/3070/3101/worker thanh toán được đối chiếu, main không có schemaAI. Không migration, thanh toán Live, Gói3 hoặc thay báo cáo/quyền cũ.

## Trước QA3062

Cần sửa retrieval/template và chiều sâu lời luận/prompt như phân loại trên rồi kiểm nội dung có kiểm soát; không dùng ba bài này để tuyên bố chất lượng toàn sản phẩm. Chốt chính sách lưu response ở provider, thời hạn dữ liệu và đối soát mấtID; Background `store=true` giữ dữ liệu tại provider theo chính sách hiện hành. Node>=22, backup/migration AI riêng, quy trình vận hành và quyền triển khai main vẫn cần. Không cập nhật QA3062 trong task này.

[Bằng chứng kỹ thuật](../.local/ai-menh-package21-20261027/verification.json), [điểm và dẫn chứng máy đọc được](../.local/ai-menh-package21-20261027/assessment.json), [test](../.local/ai-menh-package21-20261027/test.log), [typecheck](../.local/ai-menh-package21-20261027/typecheck.log), [build](../.local/ai-menh-package21-20261027/build.log).
