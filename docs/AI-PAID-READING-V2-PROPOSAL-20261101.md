# Đề xuất cấu trúc bài luận trả phí V2 — 01/11/2026

**Trạng thái: đề xuất để duyệt, chưa triển khai.** V2 tổ chức theo luận điểm thực có, thường khoảng5–8phần; nguồn mỏng được viết ngắn hơn. Đổi cấu trúc giúp giảm lặp và phần rỗng, không tạo thêm tri thức hoặc tự làm gói11cung đủ chất lượng thương mại.

Baseline `main@49280a8`, tracked/index sạch đầu phiên, `buu-dinh-7parts/` untracked giữ nguyên, không đọc/sửa/stage. Chỉ đọc sáu bài, facts/knowledge đã lưu, ma trận11cung và module trực tiếp liên quan; không PDF/sách mới, DB, API model, worker/supervisor, deploy hoặc build/test ứng dụng. Các ví dụ dưới đây do Codex đề xuất biên tập từ tài sản đã có, **không phải bài Astra mới, không thay thế bài đã lưu**.

## 1. Bộ chứng cứ và giới hạn suy rộng

Đã đọc toàn văn tám phần và giới hạn của sáu bài:

- [Quan Lộc3.2](../.local/ai-paid32-20261029/quan-loc-reading.md), [facts](../.local/ai-paid32-20261029/quan-loc-facts.json), [knowledge](../.local/ai-paid32-20261029/quan-loc-knowledge.json).
- [Quan Lộc3.3](../.local/ai-paid33-20261030/quan-loc-reading.md), [input thực gửi](../.local/ai-paid33-20261030/quan-loc-input.json), [content/IDs](../.local/ai-paid33-20261030/quan-loc-content.json).
- [Tài Bạch3.2](../.local/ai-paid32-20261029/tai-bach-reading.md), [facts](../.local/ai-paid32-20261029/tai-bach-facts.json), [knowledge](../.local/ai-paid32-20261029/tai-bach-knowledge.json).
- [Phu Thê3.2](../.local/ai-paid32-20261029/phu-the-reading.md), [facts](../.local/ai-paid32-20261029/phu-the-facts.json), [knowledge](../.local/ai-paid32-20261029/phu-the-knowledge.json).
- [Quan Lộc1.2](../.local/ai-paid12-real-20261101/quan-loc-reading.md), [facts](../.local/ai-paid12-real-20261101/quan-loc-facts.json), [knowledge](../.local/ai-paid12-real-20261101/quan-loc-knowledge.json), [result/IDs](../.local/ai-paid12-real-20261101/quan-loc-result.json).
- [Tài Bạch1.2](../.local/ai-paid12-real-20261101/tai-bach-reading.md), [facts](../.local/ai-paid12-real-20261101/tai-bach-facts.json), [knowledge](../.local/ai-paid12-real-20261101/tai-bach-knowledge.json), [result/IDs](../.local/ai-paid12-real-20261101/tai-bach-result.json).

Đối chiếu [nghiệm thu31/10](AI-PAID-CONTENT-ACCEPTANCE-20261031.md), [ma trận11cung](AI-PAID-CONTENT-READINESS-20261031.csv), [P0/phiếu nguồn](AI-PAID-CONTENT-P0-HANDOFF-20261101.md) và [kết quả Astra1.2](AI-PAID-ASTRA12-EVALUATION-20261101.md). Sáu bài thuộc cùng một cấu trúc QA, không phải sáu lá số khác nhau. Không suy độ phủ mọi cung/mọi khách từ mẫu này. Ma trận31/10 dùng retrieval trướcP0; chỉ cập nhật nhận xét Quan/Tài theo chứng cứ1.2, không giả rằng đã dry-run lại toàn11cung.

## 2. Đánh giá cấu trúc hiện hành: đủ tám mục không đồng nghĩa tám luận điểm

Số phần dưới đây tính tám phần thân bài, không tính phần giới hạn cuối. Ký hiệu dùng trong phân tích: **F** dữ kiện/vị trí; **L** luận điểm có nguồn riêng; **S** tổng hợp có giải thích; **R** lặp ý đã nói; **G** chủ yếu giới hạn; **E** câu hỏi/ví dụ biên tập. Một phần có thể mang nhiều loại; đây là đọc theo ý, không chấm tự động hoặc đếm từ.

### Quan Lộc3.2

1. Tổng quan: **F**, Thìn/Tử–Tướng Vượng/Thân/Quyền; định hướng, chưa là luận điểm diễn giải.
2. Tổ chức và quyền hạn: **L**, R05 giữ cả tổ chức lẫn mưu tính/vượt quyền.
3. Thuận của Quyền: **L**, chú giải vị trí riêng “được việc”.
4. Đọc chung bộ sao và Quyền: **S+R**, liên hệ điều phối–thẩm quyền hợp lệ, nhưng kể lại2–3; nên cùng một phần lập luận.
5. Phụ tinh: **F+G**, liệt kê năm sao rồi nói chưa có nghĩa; không tạo nội dung chuyên sâu.
6. Tam phương/giáp: **F**, danh mục cung và sao; chưa giải thích vì sao từng quan hệ hữu ích cho chủ đề.
7. Thuận–nghịch: **R+G**, lặp tổ chức/vượt quyền, liệt kê Kỵ/Khoa/Đà/Hỏa/Tuần rồi dừng; không có phép chế hóa mới.
8. Tự đối chiếu: **E+R**, ba câu hỏi quanh trục2–4, không phải ba luận điểm nguồn mới.

Sai lệch đáng giữ trong hồ sơ: giới hạn cuối nói không có Hổ–Tấu vì packet111facts thiếu sao vòng. Snapshot thực có hai sao; đây là lỗi đầy đủ đầu vào đã sửa ở3.3, không xóa hoặc sửa bài3.2.

### Quan Lộc3.3

1. Chủ động/phạm vi: **F+S**, giới thiệu luôn trục quyền–trách nhiệm.
2. Tổng thể công việc: **L+E+R**, khai triển nét tổ chức bằng ví dụ tiến độ, chưa thêm lời nguồn.
3. Quyền thuận vị trí: **L**, có nội dung độc lập nhưng dễ gộp với4.
4. Tổ chức khác toàn quyền: **S+R**, đối chiếu R05 với Quyền, phần lập luận trung tâm.
5. Hổ–Tấu: **L+S+E**, thêm biểu đạt/học hỏi có nguồn; nối với tổ chức được phân biệt là biên soạn, không phép phối hợp đã xác nhận.
6. Tam hợp: **L+S**, dùng nghĩa Vũ/Phủ ở Mệnh làm ngữ cảnh; Phu chỉ giữ vị trí/giới hạn.
7. Mục tiêu chung/ý mình: **S+E+R**, liên hệ nét hiếu thắng với công việc là giả thuyết tự đối chiếu; câu hỏi phản biện kế hoạch dễ thành coaching.
8. Nhiệm vụ thực tế: **E+R**, lặp quyền/trách nhiệm/diễn đạt và câu hỏi từ2/5/7.

Phần4/5/6 là các nơi có lập luận đáng giữ. Không tách “tổ chức”, “quyền”, “trách nhiệm” thành ba hạt nhân độc lập chỉ vì khác tiêu đề.

### Tài Bạch3.2

1. Tổng quan: **F**, vị trí/chính tinh/cung liên quan; thiếu sao vòng ở packet cũ.
2. Tạo nguồn: **L**, Liêm độc Dần/Thân gắn cạnh tranh.
3. Tích lũy: **L+R**, vế “chậm nhưng chắc” cùng mệnh đề R06; hai khía cạnh khác nhau nhưng nên giải thích cùng tiến trình, không kéo thành hai phần đối xứng thuận/khó.
4. Tọa/hội chiếu: **F+G**, đúng hình học; gần như bài hướng dẫn phân biệt vị trí.
5. Sao kèm: **F+G**, Bát Tọa/Thiên Tài được kể tên rồi để ngỏ.
6. Bối cảnh: **F+G**, Kỵ/Quyền/Triệt được giữ đúng nơi nhưng chưa có ý nghĩa phối hợp.
7. Chi ngoài việc: **L+S**, mệnh đề riêng của Nguyễn Anh Vũ; phân biệt tạo/giữ với nhịp chi, không coi chi là hiệu ứng đơn thuần do giáp cung.
8. Tự đối chiếu: **E+R**, hỏi lại tạo–tích–chi, không thêm kiến thức.

### Phu Thê3.2

1. Tổng quan: **F**, Phá Đắc/Tả Khoa/Tuần.
2. Chính tinh/trạng thái: **F+G**, lặp lớp sao đầu, nhắc Đắc không nói phẩm chất bạn đời.
3. Khoa nam mệnh: **L**, **luận điểm trực tiếp duy nhất**; nguồn nói học vấn người vợ theo hình tượng truyền thống, không xác nhận người thực.
4. Phá khác Tả hóa Khoa: **F+R**, hiệu chỉnh định danh đúng, chưa có lời phối hợp Phá–Đà–Hỏa.
5. Tuần/Triệt: **F**, phân biệt tọa/chiếu; chưa luận tác động có nguồn.
6. Tam phương/giáp: **F**, bản đồ vị trí, không phải phân tích quan hệ.
7. Chưa phân thuận–nghịch: **G**, không thể bổ sung nghĩa cho sao còn thiếu chỉ từ Khoa/Quyền.
8. Kỳ vọng bạn đời: **E+R**, hỏi về coi trọng học vấn là gợi mở biên tập; không được gọi là nguồn xác nhận kỳ vọng của đương số.

Không nên quảng bá bản này là phân tích chuyên sâu Phá Quân hay quan hệ hôn nhân. Thu ngắn là trung thực hơn; không biến một điểm Khoa thành năm phần bằng đổi tên.

### Quan Lộc1.2

1. Nền: **F**, ngắn và đúng.
2. Quả quyết/suy xét: **L+S**, dùng Vũ/Phủ tại Mệnh làm ngữ cảnh, có ý phân biệt hiếu thắng với suy tính.
3. Quyền: **L**, cùng nguồn đã có.
4. Tổ chức/thẩm quyền: **L+S**, giữ hai mặt R05; là hạt nhân nên gộp3 vào đây.
5. Diễn đạt/học hỏi: **L**, Hổ–Tấu đúng vị trí, không bảo đảm bằng cấp.
6. Quyền/nguồn lực: **L+S**, thêm Liêm ở Tài làm đối chiếu; đoạn Phu cuối chỉ **F+G**.
7. Sức ép: **R+G**, nhắc lại hiếu thắng/vượt quyền và Kỵ chưa phối hợp.
8. Tổng hợp: **R**, có chức năng kết bài nhưng ít giá trị mới; không nên dùng độ dài để giả thành luận điểm thứ tám.

### Tài Bạch1.2

1. Liêm/Hao: **F**, Đại Hao tại Tài, Tiểu Hao tại Phúc xung chiếu; không phải tri thức phối hợp.
2. Chi ngoài việc: **L**, Nguyễn Anh Vũ, độc lập với R06.
3. Gây dựng/tích lũy: **L+S**, gộp cạnh tranh–chậm chắc hợp lý, có phân biệt tích lũy với số tiền còn lại.
4. Không bao trùm Hao: **G+S**, giới hạn khả năng suy rộng; không được đếm như lời mới giải thích Đại Hao.
5. Vai trò phụ: **F+G**, phần rỗng diễn giải, nên chuyển căn cứ/ghi chú.
6. Tổ chức/thu nhập: **L+S**, R05/Quyền ở Quan dùng ngữ cảnh đúng vai; chưa dự báo tiền.
7. Thuận/Kỵ: **L+S+G**, giữ lời Vũ–Phủ Tý/Nhâm ở Mệnh và Kỵ không tự bù; thiếu câu rõ Tuần/Triệt không án trực tiếp Mệnh.
8. Tạo/sử dụng: **S+R**, gom hai phạm vi hữu ích nhưng nhắc lại2–3.

**Kết luận chung:** lập luận phối hợp thực chất xuất hiện khi bài giải thích quan hệ giữa hai ý, nêu vì sao cùng xét và phạm vi của phép nối. Đặt tên sao cạnh nhau, liệt kê sao hội chiếu hoặc nói chưa thể tổng hợp chưa đạt tiêu chí ấy. Cả sáu bài chưa có phép phối hợp được nguồn xác nhận cho Liêm–Hao hay Phá–Đà–Hỏa.

## 3. Sổ đối chiếu các luận điểm chính

Các ID dưới đây là ID của bộ kiến thức đã lưu; số0/4/8/10 trong `natal-paragraph` là phần của ID, không phải số địa bàn của facts. Cùng một nguồn có thể là A ở cung gốc và C khi làm ngữ cảnh. Không chuyển loại chỉ vì đưa vào bài khác.

- **Q1 — Tử Vi–Thiên Tướng và tổ chức/thẩm quyền.** Facts `palace.2.majorStars.0/1`, Quan tại Thìn; knowledge `paid-v1.natal-paragraph-4-0`, R05, Vân Đằng Thái Thứ Lang, Tân Biên158§8.1/162§8.11. Điều kiện đồng cung Quan, không đòi sáng; giữ cả mặt mưu tính/vượt quyền. Câu nối tổ chức với giới hạn quyết định là tổng hợp/biên tập, không lời xác nhận hành vi lấn quyền. Nguồn draft, chưa phối hợp sát tinh§8.14.
- **Q2 — Hóa Quyền “được việc”.** Fact `natal.Quyền`, Tử Vi ngay Quan; knowledge `...-4-2`, Tân Biên32§1.10. Chỉ vị trí Tứ Hóa; không Quyền hội thay tọa, không chức vụ/thăng tiến hoặc giải Kỵ. Đặt Q1/Q2 cạnh nhau không thành hai bảo đảm độc lập.
- **Q3 — Hổ–Tấu về văn chương/ngoại ngữ.** Facts `palace.2.ring.suiqian12/boshi12`; knowledge `...-4-1`, R38, Tân Biên166§8.39. Hai sao vòng bản mệnh cùng Quan, không sao lưu; không bằng cấp/năng lực thực tế. Bài3.2 bỏ vì thiếu packet;3.3/1.2 dùng đúng. Nối với biểu đạt trong công việc có thể ghi tổng hợp; không tự tạo “Hổ–Tấu hóa giải vượt quyền”.
- **C1 — Vũ Khúc/Thiên Phủ ở Mệnh.** Facts `palace.10.majorStars.0/1`, Mệnh Tý; knowledge `...-0-2` R01 Tân Biên65§4.2.4/bảng34–35, `...-0-3` Tân Biên76§4.2.7. Vũ sáng theo bảng nguồn, Phủ thủ Mệnh; quả quyết/hiếu thắng và suy xét/giải quyết khó giữ riêng. Các điều chỉnh Tuần/Triệt/Không/Kiếp/sát chưa phối hợp đầy đủ. Không bịa suy tính tự chế hiếu thắng; chỉ ngữ cảnh, không chép bài Mệnh vào bài Quan.
- **T1 — Liêm độc thủ tạo nguồn/tích lũy.** Facts `palace.6.location/majorStars.0`, Thân/Liêm Vượng, chỉ một chính tinh; knowledge `...-8-0`, R06, Tân Biên190§12.2. Dần hoặc Thân, phụ tinh không hủy độc thủ. Cạnh tranh và chậm chắc thuộc cùng lời, không hứa thu nhập/tài sản. A trong Tài, C trong Quan; không dùng tích lũy chậm để phán tiến độ nghề nghiệp.
- **T2 — Chi ngoài việc.** Fact `palace.7.majorStars.empty`, Tử Nữ gốc VCD; knowledge `...-8-1`, `trungchau.spend201`, Nguyễn Anh Vũ, Trung Châu Tử Vi Đẩu Số phần2 PDF201/617/619/626. Giữ phạm vi chi ngoài hoạt động kiếm tiền, kể cả gia đình; Hỏa OR Linh tọa Tử có giới hạn619, không đòi độc tọa. Không thành lời con cái/khả năng sinh sản hoặc chi do giáp cung. Không cộng trừ với T1 để suy tài ròng.
- **C2 — Vũ–Phủ Tý/can Nhâm và Kỵ.** Facts `palace.10.location/majorStars.0/1`, `birth.can-chi`, `natal.Kỵ`; knowledge `...-0-1`, Tân Biên77§4.2.7. Nhánh Canh/Nhâm có lời tài lộc/hưởng phúc; vẫn là lời Mệnh. Tuần Tuất–Hợi/Triệt Dần–Mão không án trực tiếp Mệnh; ngoại lệ mang tiếng không là tác động giải Kỵ đang xảy ra. Kỵ không tự phủ nhận lời thuận, cũng không lời thuận xóa Kỵ.
- **P1 — Khoa ở Phu trong hồ sơ nam.** Facts/packet Phu ghi Tả Phù hóa Khoa ở Tuất, Dương Nam; knowledge `paid-v1.natal-paragraph-10-0`, `tanbien.spouse-khoa-male`, Tân Biên214§14.21. Ý học vấn người vợ không mở thành tính cách/hòa hợp/kết quả cưới; không Phá Quân hóa Khoa. Chưa có phép phối hợp với Phá/Đà/Hỏa/Tuần/Quyền.
- **G1 — Khoảng thiếu Hao và Phá–Đà–Hỏa.** Đại Hao Đắc tại Tài và Tiểu Hao Đắc tại Phúc là facts mới đủ; NPL27 chỉ D, Song Hao Mão/Dậu không thành Liêm–Hao Thân. Phá Đắc/Đà Đắc/Hỏa chưa trạng thái/Tuần ở Phu có facts nhưng chưa đủ mệnh đề phối hợp. Nguồn thiếu không được thay bằng nghĩa suy từ tên hoặc mượn một nhánh khác điều kiện. Các phiếuP0 giữ nguyên trạng thái chưa đủ.

Câu hỏi tự quan sát/so sánh tiến trình là phần biên tập, không phải facts hoặc chứng cứ cuộc đời. Điều kiện đúng + ID hợp lệ chỉ chứng minh khả năng truy vết, chưa chứng minh toàn bộ câu văn được nguồn hỗ trợ. Toàn bộ nguồn trên còn giới hạn phối hợp và trạng thái draft như hồ sơ gốc.

## 4. Đề cương V2 đề nghị

### 4.1. Tổ chức theo ý, không theo tám ngăn cố định

Một bài đủ hạt nhân thường có5–8phần, gồm:

1. **Tổng quan thế sao:** ngắn, chỉ những facts cần để hiểu các ý tiếp theo. Không đọc lại toàn packet hoặc kể mọi cung giáp.
2. **Luận điểm nổi bật:** một hoặc vài phần theo nội dung thật có. Một phần có một luận điểm trung tâm, căn cứ và giải thích quan hệ. Chính tinh/phụ tinh/Tứ Hóa có thể nằm cùng phần khi cùng giải một vấn đề, không bắt buộc mỗi nhóm sao một tiêu đề.
3. **Liên hệ cung liên quan:** chọn những ngữ cảnh làm thay đổi hoặc bổ sung cách hiểu chủ đề; giữ đúng cung gốc. Chỉ nêu quan hệ hình học không đủ để mở phần này.
4. **Mâu thuẫn/điều chỉnh:** mở riêng khi có nội dung giải thích có căn cứ chưa nói ở trên. Nếu chỉ cần một câu giới hạn, đặt ngay cạnh ý bị giới hạn hoặc vào ghi chú cuối, không tạo một chương “chưa thể kết luận”.
5. **Tổng hợp/tự đối chiếu:** ngắn, nối các ý đã có thành điều nên tự quan sát; tối đa hai câu hỏi cụ thể khi hữu ích. Không tạo lời nguồn mới, không coaching chung hoặc kể lại mọi phần.

Đây là vai trò có thể gộp/bỏ, không năm mục tối thiểu bắt buộc. Có thể có nhiều phần luận điểm và hơn một liên hệ nếu chúng thực sự khác nhau; tối đa8phần để giữ bài tập trung. Không tối thiểu số từ; không bắt buộc nói đủ sao, đủ cung chiếu hoặc đủ “mặt thuận/mặt khó”.

### 4.2. Bài nguồn mỏng

- **Có hạt nhân nhưng giới hạn:** cho phép2–4phần thay vì buộc đạt5. Tài ví dụ bên dưới dùng4. Mức độ giới hạn được nói rõ trước thân bài, không dùng câu “chuyên sâu toàn diện”.
- **Chỉ có một lời phụ không giải được chủ đề chính, hoặc không có nền trực tiếp:** không bắt model tạo bài5phần. Có thể trả bản chú giải rất ngắn với phạm vi rõ, hoặc không tạo bài phân tích. Phu/Nô/Tử/Tật của mẫu hiện có cần xử lý theo phạm vi sản phẩm trước, không tự hoàn tất gói bằng facts.
- Ghi chú nguồn/ngoại lệ còn mở đặt trong “Xem căn cứ”; giới hạn quan trọng ảnh hưởng cách hiểu vẫn có câu sát luận điểm. Không giấu giới hạn bằng cách thu hết vào accordion.
- Số phần, số nguồn, nhãn mức độ và độ dài không phải điểm chất lượng. Không đổi nhãn “insufficient” thành “limited” chỉ để đạt X/11.

### 4.3. Nguyên tắc biên luận

Mỗi luận điểm trả lời ba việc: đang xét điều gì, facts/nguồn nào cho phép nói như vậy, và phép liên hệ dừng ở đâu. Trình bày bằng tiếng Việt điềm đạm; nguồn mượn cảnh giữ câu “ở cung...” nơi cần phân biệt. Không mở mọi đoạn bằng danh sách sao. Tóm tắt giới hạn một lần khi có thể, nhưng không bỏ điều kiện phủ định/ngoại lệ thực sự quan trọng.

Tổng hợp AI được phép nối các ý phù hợp và giải thích mối quan hệ, không cần có một rule cho từng câu nối. Tuy nhiên không tự tạo phép chế hóa, tác động nhân quả, mức độ thắng/lấn át, hay sự kiện đời sống. Suy luận mới phải hiện đúng là cách đọc/tự đối chiếu, không gắn tên tác giả cho câu họ không nói.

## 5. Ví dụ tổ chức lại — bản đề xuất, không phải kết quả Astra

Các đoạn dưới chỉ dùng Q1–Q3/C1/T1–T2/C2 đã đối chiếu. Phần ghi chú căn cứ là chú thích thiết kế bên ngoài văn khách hàng; không chèn vào bài đã lưu. Không thêm lời mới cho Liêm–Hao, Hữu Bật, Bát Tọa hoặc Thiên Tài.

### 5.1. Quan Lộc — năm phần

**1. Nền công việc của lá số**

Quan Lộc tại Thìn có Tử Vi và Thiên Tướng cùng Vượng; Thân cư tại đây, Tử Vi hóa Quyền theo năm sinh. Cách đọc dưới đây tập trung vào tổ chức công việc, phạm vi quyết định và một nét hỗ trợ về diễn đạt.

**2. Khả năng tổ chức và cách sử dụng quyền hạn**

Tân Biên gắn Tử Vi–Thiên Tướng tại Quan với khả năng tổ chức, đồng thời giữ mặt mưu tính và vượt quyền người trên. Hai mặt ấy cùng thuộc lời nguồn; không nên chỉ giữ vế thuận hoặc dùng vế khó để quy kết hành vi thực tế. Hóa Quyền ngay tại Quan lại có nhận xét riêng là “được việc”.

Đọc hai lời cạnh nhau, một hướng tổng hợp là phân biệt khả năng thu xếp công việc với thẩm quyền thực hiện quyết định. Lời thuận về vị trí Hóa Quyền không tự giải quyết mặt khó của bộ chính tinh, cũng chưa cho biết chức vụ hay thành tựu của người đọc.

**3. Một nét riêng về học hỏi và biểu đạt**

Bạch Hổ–Tấu Thư đồng cung Quan có lời riêng về văn chương và việc học ngoại ngữ chóng thông hiểu. Đây là một nét khác với tổ chức: nó hướng việc tự quan sát sang cách tiếp thu và diễn đạt. Liên hệ hai phương diện có thể hữu ích khi đọc công việc, nhưng không phải nguồn khẳng định bộ sao này tất yếu làm người đọc giao tiếp tốt, có bằng cấp hoặc hóa giải vấn đề thẩm quyền.

**4. Cách hành động và nguồn lực trong bối cảnh liên cung**

Ở Mệnh, lời về Vũ Khúc giữ cả sự quả quyết lẫn hiếu thắng; lời về Thiên Phủ nhấn vào suy xét và giải quyết việc khó. Chúng bổ sung bối cảnh cách hành động, không tự chứng minh một mặt đã chế hóa mặt kia.

Trong tam hợp, Tài Bạch có Liêm Trinh độc thủ tại Thân, với lời về cạnh tranh khi kiếm tiền và tích lũy chậm nhưng chắc. Liên hệ với chủ đề công việc, có thể phân biệt quyền quyết định với quá trình gây dựng nguồn lực. Có nét thuận ở quyền hạn chưa bảo đảm nguồn lực cũng thuận; tốc độ tích lũy ở Tài không phải dự báo tiến độ sự nghiệp.

**5. Điều đáng tự đối chiếu**

Có thể lấy một công việc cụ thể để xem xét hai điều: phần quyết định của mình có rõ phạm vi không, và cách diễn đạt có giúp người khác hiểu việc cần làm không? Đây là gợi mở từ hai nhánh tổ chức và biểu đạt, không phải bài kiểm tra xác nhận năng lực của lá số.

**Giới hạn đi cùng bài:** Diễn giải biểu tượng truyền thống, không dự báo nghề nghiệp/chức vụ/thăng tiến. Kỵ tại Mệnh, Khoa tại Phu và các yếu tố chưa có phép phối hợp được giữ trong căn cứ; không dùng Quyền hay Hổ–Tấu để tự xóa chúng.

Chú thích thiết kế:1=F;2=Q1/Q2 và tổng hợp;3=Q3 và liên hệ biên tập;4=C1/T1 đúng cung gốc;5=tổng hợp/tự quan sát. Từ1.2: gộp phần3+4+ý cần thiết của7 thành phần2; phần5 thành3; phần2+6 thành4, chuyển đoạn Phu chỉ kể vị trí sang căn cứ; phần8 rút và thêm gợi mở cụ thể thành5. Giữ giới hạn cần thiết, không giữ một mục riêng chỉ vì có sao chưa giải nghĩa.

### 5.2. Tài Bạch — bốn phần, phân tích có giới hạn

**Phạm vi:** Bài này tập trung vào hai nhánh có lời nguồn: tạo nguồn/tích lũy và chi ngoài công việc. Chưa có căn cứ để luận sâu sự phối hợp Liêm Trinh–Đại Hao hoặc kết quả tài chính toàn cung.

**1. Điểm xuất phát của cách đọc**

Tài Bạch tại Thân có Liêm Trinh Vượng là chính tinh duy nhất và Đại Hao Đắc cùng cung. Tiểu Hao Đắc nằm ở Phúc Đức, xung chiếu Tài Bạch. Các vị trí này được giữ riêng; chưa thể lấy trạng thái Đắc để nói mọi khoản hao có lợi, hoặc tự dựng lời phối hợp Liêm–Hao.

**2. Tạo nguồn và tích lũy trong cùng một tiến trình**

Với Liêm Trinh độc thủ Tài Bạch tại Dần hoặc Thân, Tân Biên nói đến cạnh tranh khi kiếm tiền và tích lũy chậm nhưng chắc. Độc thủ xét chính tinh, nên sao phụ đi cùng không làm mất điều kiện này.

Hai vế mô tả những mặt khác nhau của quá trình gây dựng: cạnh tranh nói về việc tạo nguồn, còn chậm chắc nói về nhịp tích lũy trong lời truyền thống. Chúng không bảo đảm số tiền còn lại sau chi tiêu hoặc tác động của hao tinh.

**3. Chi ngoài công việc có thể khác cách kiếm tiền**

Theo cách xét của Nguyễn Anh Vũ, Tử Nữ gốc vô chính diệu được dùng cho một nhánh chi ngoài hoạt động kiếm tiền, kể cả sinh hoạt gia đình: có lúc chi theo hứng hoặc lời mời, rồi sau một đợt mua sắm lại giữ tiền chặt. Đây không phải lời về con cái hay kết luận người đọc luôn tiêu nhiều.

Nhánh này khác phạm vi lời Liêm Trinh của Tân Biên. Có thể dùng sự phân biệt ấy để tự quan sát cách tạo nguồn và cách sử dụng tiền, nhưng không cộng trừ hai lời để suy tài sản ròng.

**4. Công việc là bối cảnh; kết quả tiền bạc còn để ngỏ**

Ở Quan Lộc, Tử Vi–Thiên Tướng có lời về tổ chức cùng mặt vượt quyền; Hóa Quyền tại đó có nhận xét riêng “được việc”. Dùng làm ngữ cảnh cho Tài, những ý này gợi việc xét quá trình gây dựng nguồn lực bên cạnh cách tổ chức công việc. Chúng không trực tiếp xác định mức thu nhập.

Điều có thể tự đối chiếu là cách tạo nguồn và nhịp chi ngoài công việc có thực sự vận hành giống nhau trong trải nghiệm của mình không. Đây là câu hỏi để quan sát, không một kết luận giàu nghèo từ lá số.

**Giới hạn đi cùng bài:** Chưa có lời phối hợp trực tiếp đủ rõ về Liêm–Hao/Bát Tọa/Thiên Tài. Kỵ ở Mệnh không tự bị Quyền ở Quan bù trừ. Tuần/Triệt không án trực tiếp Mệnh, nên không giới thiệu ngoại lệ nguồn như một phép hóa giải đang xảy ra. Bài không dự báo thu nhập/lợi nhuận và không phải tư vấn đầu tư.

Chú thích thiết kế:1=F/G1;2=T1;3=T2 và tổng hợp khác phạm vi;4=Q1/Q2 ở Quan làm C cùng câu hỏi biên tập. Từ1.2: phần1+giới hạn then chốt của4 thành1; phần3 thành2; phần2 thành3; phần6+phần8 rút thành4. Phần5 chuyển căn cứ; phần7 rút thành giới hạn, không bỏ vị trí Kỵ hoặc điều kiện Tuần/Triệt. Không buộc viết phần thứ5 khi không có luận điểm mới.

## 6. Phạm vi11cung trên snapshot hiện có

Phân loại là **mức sẵn sàng thử nội dung**, không quyền publish hay đánh giá mọi lá số. Không dùng số nguồn làm điều kiện đủ. Cần xem nguồn có giải đúng chủ đề chính, có các ý khác nhau và có căn cứ cho liên hệ hay chỉ có một sao phụ.

### A — Có hạt nhân để thử bài sâu hơn, chưa cam kết đạt

**Quan Lộc:** R05, Hổ–Tấu và vị trí Quyền cho các hướng tổ chức/biểu đạt/quyền; C từ Mệnh/Tài bổ sung. Mẫu1.2 vẫn lặp và thiếu nghĩa điều chỉnh/phụ tinh. Thích hợp kiểm V2 hữu hạn sau duyệt, không gọi đây là đã đủ để bán.

### B — Hiện chỉ đủ phân tích giới hạn

- **Tài Bạch:** hai nhánh tạo–tích và chi có trọng tâm thật; chưa Liêm–Hao, Bát Tọa/Thiên Tài. Ví dụ bốn phần phản ánh giới hạn đó.
- **Phụ Mẫu:** Nhật–Nguyệt đồng cung có một nền, chưa đủ phối hợp Hỷ/Nguyệt Đức/Địa Giải hoặc chiều sâu nhiều quan hệ. Không quy kết cha mẹ.
- **Phúc Đức:** Tham Lang và Thiên Mã có hai lời riêng, chưa phối hợp Linh/Xương/Hao/Triệt. Không đánh giá phúc nghiệp, phẩm hạnh hoặc số phận họ hàng.
- **Điền Trạch:** Cơ–Cự với Triệt trực tiếp có điều kiện, chưa đủ các ngoại lệ/Địa Không/Khôi/Hình; không dự báo sở hữu/mua bán.
- **Thiên Di:** lời Thất Sát đơn thủ có nền, thiếu nghĩa phối hợp sao khác; không hứa vị thế hoặc di cư.
- **Huynh Đệ:** một ý về xa cách, thiếu Lộc Tồn/Cô/Lưu Hà; bài ngắn không xác nhận hành vi/người thân thực tế.

### C — Chưa đủ căn cứ để hứa bài chuyên sâu đúng chủ đề

- **Phu Thê:** Khoa trong hồ sơ nam chỉ là một điểm phụ về học vấn; chưa giải được Phá–Đà–Hỏa/Tuần hay các xu hướng quan hệ trung tâm. Có thể giữ chú giải Khoa có giới hạn, không gọi nó là bài phân tích hôn nhân hoàn chỉnh.
- **Nô Bộc:** facts Lương Hãm/Lộc không thay được luận điểm về cộng sự; mẫu không có A/B trực tiếp. C không tạo nền cho chủ đề.
- **Tử Tức:** VCD, chưa có A/B trực tiếp ở mẫu. Nhánh dùng Tử VCD để nói chi ngoài việc thuộc Tài, không được mượn để lấp bài con cái. Không đoán số con/sinh sản.
- **Tật Ách:** A/B trống theo giới hạn sản phẩm; chỉ có thể chú giải cấu trúc truyền thống. Không phân loại bệnh, chẩn đoán, dự báo tuổi thọ/tử vong hoặc hướng dẫn điều trị. Tên Bệnh Phù/Mộ không là dữ kiện sức khỏe. Không đổi thành bài “chăm sóc sức khỏe” chung để đủ11bài.

Không tự thêm bộ chọn độ sâu theo tên khách/ID/ngày sinh. Nếu triển khai phân loại cần dựa trên nguồn/điều kiện của từng snapshot và đánh giá nội dung, không hardcode danh sách cung trên thành kết quả toàn hệ thống.

## 7. Đề xuất kỹ thuật và tương thích — chưa có code

### 7.1. Định danh phiên bản riêng

Hiện `lib/ai/contract.ts` dùng `narrationSchema.sections.length(8)`, mỗi phần có `kind/title/content/factIds/knowledgeIds/basis`; `validatePaidNarration` trong `paid-contract.ts` còn buộc đủ tám kind đúng thứ tự. Provider luôn dùng schema đó cho cả Mệnh cũ và trả phí. Chỉ sửa `.length(8)` sẽ không đủ, và sửa schema dùng chung có thể làm hỏng kết quả/đối soát cũ.

Đề nghị tên nội dung **`paid-reading-v2.0.0`**, prompt mới riêng **`paid-palaces-vietnamese-2.0.0`**. Đây là tên dự kiến, chưa được đăng ký. Facts/retrieval không tăng phiên bản chỉ vì đổi cách trình bày nếu payload và điều kiện không đổi. Schema, prompt, facts và retrieval là bốn trục phiên bản, không đánh đồng với phiên bản quyền/offer.

Giữ `PAID_EDITION=paid-palaces-ai-1.0.0` cho quyền hiện hành trong phương án tối thiểu. Không đổi constant này toàn cục để “bật V2”: nó đang nằm trong offer, grant SQL, query job và claim worker; đổi sẽ khiến báo cáo cũ không còn được chọn. Đổi thương mại/edition là task riêng, không phải điều kiện cần của schemaV2.

### 7.2. Hình dạng nội dung dự kiến

Một root object, không union ở root gửi provider. Các trường đề nghị:

- `schemaVersion`: literal `paid-reading-v2.0.0`.
- `coverage`: `focused`, `limited`, `insufficient` — mô tả phạm vi, không điểm số/chứng nhận thương mại.
- `coverageNote`: câu ngắn về phạm vi thực sự có/thiếu.
- `sections`: tối đa8 đối tượng `{id, role, title, paragraphs}`; `role` là `overview/analysis/context/adjustment/synthesis`, có thể nhiều phần `analysis/context` khác ý, không yêu cầu đủ năm role.
- `paragraphs`: mỗi đoạn `{text, basis, factIds, knowledgeIds}`; giữ ba loại basis hiện hành. Một đoạn trộn lời nguồn với phép nối AI phải tách đoạn hoặc mang `ai-synthesis`, không gọi cả đoạn là lời tác giả. Các ID chỉ trỏ về facts/knowledge đã gửi, không thêm nội dung bịa vào căn cứ.
- `limitations`: giới hạn quan trọng không trùng lặp; không trở thành kho chứa nội dung bị cấm hoặc cho phép câu khẳng định y khoa.

Dải `sections` ở schema cơ sở0–8 để biểu diễn thiếu nền trung thực. Ràng buộc hình dạng tại server: `focused`2–8phần, `limited`1–8phần, `insufficient`0phần và ghi rõ không có bài phân tích. Về biên tập, focused thường5–8 và limited thường1–4; đây là dải tham khảo, không điều kiện để phân loại. Một bài bốn phần vẫn có thể focused nếu có luận điểm thực chất, còn một bài tám phần vẫn có thể limited nếu thiếu căn cứ trọng tâm. Một chú giải đơn lẻ chỉ là limited. Phân loại dựa trên phạm vi được nguồn hỗ trợ, không số mục. Không nâng `limited` thành `focused` hoặc thêm phần để qua min. Giữ trần token output/ngân sách request hiện hành khi thử triển khai, chỉ đặt giới hạn trên cho văn bản; không tăng packet hoặc ép số từ để đạt cấu trúc. Mức `coverage` do model đề xuất cần đối chiếu đầu vào tại server/QA; tên field không chứng minh độ sâu.

Structured Outputs chỉ bảo đảm hình dạng, không chứng minh căn cứ hoặc tính đúng của Tử Vi. Đề nghị tiếp tục dùng SDK/Zod với `text.format`, object strict, các field required; array có thể rỗng theo nhánh. Các ràng buộc liên trường/role/lập luận đặt ở validator, không cố nhét điều kiện phức tạp vào JSON Schema. [OpenAI Docs: Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) mô tả root object, required fields, additionalProperties và giới hạn schema; **schema đề xuất này chưa được thử với API**. Không gọi API trong nhiệm vụ thiết kế.

### 7.3. Validator: tương thích cũ và kiểm mới

Giữ nguyên parser/validatorV1, thứ tự tám kind và registry prompt cũ. Chọn schema khi CREATE bằng phiên bản đã chốt ở job/input; khi GET đối soát cũng dùng phiên bản của cùng attempt, không schema HEAD mới. Không dùng parseV2 thất bại rồi thửV1 để âm thầm nuốt một output sai.

V2 kiểm schemaVersion, id phần duy nhất, role phù hợp, dải phần theo coverage; mọi tham chiếu tồn tại. Facts thuần không biến source-conflict/upstream-unverified thành nhận định cá nhân. `source-interpretation` cần nguồn phù hợp chủ đề và điều kiện; D không thành căn cứ trực tiếp, C giữ cung gốc. `ai-synthesis` cần facts và những nguồn thực sự đỡ cho nhận định; ID hợp lệ không đủ, vẫn phải đọc nội dung khi nghiệm thu. Không tự động chứng nhận “giữ nghĩa” bằng regex/đếm ID.

Giữ guard Tật Ách, phân biệt câu phủ định/giới hạn an toàn với khẳng định y khoa; không nới chỉ vì chuyển nội dung sang paragraph/coverageNote/limitations. Tất cả trường văn phải được kiểm, kể cả tiêu đề/câu hỏi. Kiểm lặp ý có thể cảnh báo; không tự CREATE lại để tìm bản có điểm cao hơn. Model refusal/incomplete/schema lỗi giữ nhánh lỗi/đối soát hiện có, không giả thành bài ngắn hợp lệ.

### 7.4. Lưu kết quả, queue và đọc lịch sử

DB hiện có `result jsonb`, input/hash/prompt_version/attempt/responseID; unique `(reading_id,reading_hash,palace,edition)`. Vì vậy **dự kiến không cần migration DB** để thêm định dạng nội dung, nhưng cần kiểm khi triển khai; chưa chạy DB trong task này.

Thêm discriminator nội dung vào kết quảV2, giữ envelope model/usage/cost/timing/facts/knowledge và nguồn đầy đủ. Có thể dùng unionV1/V2 **ở TypeScript nội bộ**, không gửi root union sang provider. Bản lưu thiếu schemaVersion chỉ nhận V1 khi envelope/prompt khớp registry cũ; phiên bản không biết báo cần hỗ trợ, không hiện JSON thô hoặc tự gán V1.

V2 chỉ dành job của báo cáo mới sau khi được duyệt bật. Existing completed không UPDATE/backfill, refresh không enqueue. Existing queued/uncertain giữ input, prompt và schema cũ; receipt còn xử lý tiếp tục GET cùng ID/attempt. Không requeue để đổi cấu trúc. Unique hiện có không chứa prompt/schemaVersion, nên không thể tạo thêmV2 cho cùng report/cung bằng một upsert mà giữ cả hai bản; phương án tối thiểu không làm việc đó. Đánh giá tương lai dùng bản QA mới hợp lệ như các vòng trước, không phiên bản ngầm trên job cũ.

`coverage=insufficient` là một output xử lý được nhưng **không phải bài chuyên sâu đã giao**. Đề nghị giữ job kỹ thuật completed nếu đã xử lý/lưu hợp lệ, song API/UI sau này tách `processed` với `delivered` theo nội dung; không đếm thiếu nền thành bài hoàn thành để hiện11/11 giả. Giữ sốjob/receipt cũ, không CREATE tự động khi chưa đủ nguồn. Khi mọi job đã xử lý mà có cung thiếu nền, view cần trạng thái kết thúc có giới hạn về nội dung, không tiếp tục quay loading/ETA hoặc tự retry. Có thể trình bày riêng số cung đã xử lý, có bài phân tích, chỉ chú giải và thiếu nền; không gọi tất cả là bài chuyên sâu đã giao. `limited` có thể là bài ngắn/chú giải theo phạm vi đã được duyệt, không mặc nhiên là thiếu kỹ thuật. Không cần thêm trạng thái DB để diễn đạt view này. Đây là điểm phải duyệt về UX/phạm vi bán trước khi bật V2, chưa đổi tiến trình hiện hành.

### 7.5. Renderer, quyền, PDF

`components/PaidAiReading.tsx` đang map mảng sections, không hardcode tám article, nhưng key=`s.kind` và đọc `s.content`/refs ở cấp phần. V2 nhiều `analysis` sẽ trùng key nếu giữ cách cũ. Đề nghị nhánh renderV2 dùng section.id và paragraphs, căn cứ tại đoạn; V1 giữ nguyên văn/thứ tự/giới hạn cũ. Không đệm mục trống hoặc ép V2 về tám kind chỉ để tái dùng component.

API chỉ trả nội dung sau kiểm owner+paid+ready+grant như hiện tại; schemaVersion/coverage không cấp quyền. Mệnh V1/Luna là đường riêng, không nhập vào paid schemaV2. Tắt tạo mới/rollback không làm mất khả năng đọc các V2 đã lưu: cần đưa reader tương thích trước, chỉ rollback writer khi đã có dữ liệuV2; không quay về reader không biết V2 hoặc rollback DB.

PDF hiện tại dùng frozen customer report; nhánh `print=1` của `/don-thu` trả `CustomerReading`, không paid panel. Không tự đưa V2 vào PDF cũ hoặc hứa gói đã có PDF AI. PDF AI tương lai cần phiên bản layout/artifact riêng, nguồn bản lưu V1/V2 và kiểm quyền server, phân trang theo đoạn và giữ bản cũ; chưa làm trong phương án tối thiểu.

## 8. Mô tả phạm vi thương mại đề nghị

**Chưa đề nghị mở bán với cam kết “11 bài chuyên sâu đồng đều”.** V2 có thể làm bài trung thực, dễ đọc hơn; không giải quyết bốn cung nhómC của mẫu bằng đổi cấu trúc.

Bản mô tả dự thảo để xem xét, chưa đưa vào web/offer:

> Báo cáo diễn giải các chủ đề trong11cung ngoài Mệnh dựa trên lá số và tư liệu phù hợp. Nội dung từng cung có độ dài và mức phân tích khác nhau theo căn cứ thực sự có; phần chỉ đủ chú giải hoặc còn thiếu nền sẽ được nêu rõ. Đây là cách đọc biểu tượng Tử Vi để tham khảo, không xác nhận đặc điểm đời sống hay bảo đảm tương lai. Cung Mệnh miễn phí V1/Luna giữ nguyên. Tật Ách không cung cấp đánh giá sức khỏe cá nhân, chẩn đoán, dự báo tuổi thọ hoặc điều trị.

Chỉ dùng mô tả này nếu sản phẩm có phương án trình bày rõ các phần thiếu ngay trước mua và trách nhiệm giao nội dung được chấp nhận. Không thu tiền theo lời hứa11bài sâu rồi sau thanh toán mới hiện các khoảng thiếu; disclaimer không thay nghĩa vụ đã cam kết. Task này **không chọn giá, điều kiện hoàn tiền, thay entitlement hoặc điều khoản thanh toán**. Chủ dự án cần duyệt phạm vi và cách xử lý cung thiếu trước khi triển khai thương mại. Quyền lịch sử vẫn theo hợp đồng cũ, không dùng V2 hạ quyền hoặc thay bài đã mua.

Không quảng cáo “giải mã toàn diện”, “phân tích mọi sao”, mức chính xác, lời hứa giàu/hôn nhân/con cái, PDF AI hoặc SLA5phút chưa chứng minh. Một lần sinh hợp lệ hay schema không chứng nhận chuyên môn. Phân loại nhómA/B/C chỉ là chứng cứ cho một snapshot, không nhãn bán áp mọi lá số.

## 9. Danh sách thay đổi tối thiểu nếu được phê duyệt

1. **Chốt hợp đồng nội dung:** vai trò mềm5–8, nhánh1–4/0 khi nguồn mỏng, nội dung nào tính là bài đã giao; duyệt cách báo phạm vi trước mua. Chưa cần thêm rule chuyên môn.
2. **Schema/prompt registry:** thêm hợp đồngV2 riêng ở `lib/ai`, giữ contract/promptV1; chọn schema theo job được lưu trong `provider.ts` và `worker.ts`, không sửa receipt/backoff/ngân sách. Không đổi PAID_EDITION/offer cũ.
3. **Validation/storage type:** parser theo version, căn cứ ở đoạn, guard toàn bộ văn, discriminator trong JSONB; không migration/backfill dự kiến. Điều kiện chuyển `processed/delivered` cần đặc tả rõ, không tự tăngX/11.
4. **Reader trước writer:** thêm renderV2 và nhánh view tương thích trong `PaidAiReading.tsx`/paid-store/API DTO; server kiểm quyền như cũ. Giữ đọcV1/Mệnh; version không biết báo hỗ trợ, không gọi provider.
5. **Kiểm mock hữu hạn sau duyệt:** V1 đủ8/bất biến; V2 thường5–8 nhưng có thể ngắn hơn, limited không bị ép số mục và insufficient0; trùngid, ID lạ, điều kiện sai/C/D sai vai, lặp ý, câu an toàn/khẳng định ykhoa; pendingV1 restart vẫnschemaV1; completed không tạo lại; X/11 không đếm giả; unauthorized không nội dung; mobile360/390. Typecheck/build chỉ khi triển khai code.
6. **Nghiệm thu nội dung sau mock:** đọc toàn văn V2 cùng rubric chín tiêu chí và đối chiếu từng luận điểm, không lấy số phần/chữ làm điểm. Mọi API thật tương lai cần quyền/ngân sách/scope riêng; task này không gọi hoặc tự đặt số lượt. Không triển khai PDF/QA3062/worker mới trong lô tối thiểu.

Các file dự kiến tác động chỉ là kế hoạch, chưa sửa: `lib/ai/contract.ts` hoặc contractV2 tách riêng, `paid-contract.ts`, `paid-prompt.ts`, `provider.ts`, `worker.ts`, `paid-store.ts`, `components/PaidAiReading.tsx`, type/view API và test liên quan. Giữ queue/attempt/unique/grant và engine. Không xây CMS, queue thứ hai hoặc chương trình lấp469rule.

## 10. Kiểm tài liệu và điểm dừng

Đã kiểm sáu bài đủ48phần thân;16hash tài sản đối chứng và19hash artifact vòng1.2 khớp manifest cũ. [Biên nhận kiểm tài liệu](../.local/ai-paid-v2-design-20261101/verification.json) giữ danh sách phần và phạm vi kiểm. Chỉ kiểm liên kết/file đích, diff khoảng trắng, nội dung staged và hash các tệp chứng cứ cũ; không chạy app test/build/typecheck/E2E/PDF. Không đọc `.env`, không phát sinh API chi phí, không kết nối DB hoặc khởi động dịch vụ. Các ví dụ đề xuất nằm trong tài liệu này, không ghi vào kho result. Ghi quyết định giao nhiệm vụ thiết kế riêng, không ghi V2 đã được duyệt triển khai. Dừng tại tài liệu; schemaV2, UI, queue, quyền và thương mại vẫn giữ phiên bản hiện hành.
