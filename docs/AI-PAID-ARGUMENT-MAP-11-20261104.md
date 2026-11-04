# Bài chuẩn Tài Bạch và bản đồ luận điểm 11 cung — 04/11/2026

**Hoàn thành hồ sơ biên tập/mock; chưa nghiệm thu thương mại.** Baseline `main@5c5dfe3`, branch main, tracked/index sạch khi bắt đầu. Giữ nguyên `buu-dinh-7parts/`, `docs/design-handoff/`. Không đổi ứng dụng, prompt2.8, input1.15, facts1.1, model, schema, quyền, offer hoặc bài lịch sử.

Đầu ra chính: [đọc bài Tài Bạch chuẩn đề xuất](AI-PAID-TAI-BACH-STANDARD-20261104.md). Không phải API mới; chờ chủ dự án đánh giá giá trị và văn phong. [Bản đồ máy đọc được](../.local/ai-paid-standard-map-20261104/argument-map-11.json) giữ căn cứ/điều kiện/ngoại lệ/provenance; [12 phiếu rà hẹp kho chữ](../.local/ai-paid-standard-map-20261104/source-cards.json) giữ locator/hash, không sao chép toàn sách vào Git.

## Cách dùng và giới hạn

Ký hiệu địa chỉ nguồn trong hồ sơ: **TB** = Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*; **NPL/Tổng Hợp** = Nguyễn Phát Lộc, *Tử Vi Tổng Hợp*; **HS** = Nguyễn Phát Lộc, *Tử Vi Hàm Số*; **THP1/THP2** = Nguyễn Anh Vũ, *Trung Châu Tử Vi Đẩu Số, Tứ Hóa Phái*, phần 1/2. Số trang giữ đúng hệ PDF/in đã ghi trong từng unit, không tự quy đổi. Tên sách ở hồ sơ căn cứ này, không trong lời khách hàng.

Dùng câu hỏi [K12/T1 đã chốt](PRODUCT-SCOPE-D-REVIEW.md#k12-customer-questions-20261027), không đặt mẫu số/phần trăm mới. Bản đồ là đặc tả biên tập trên **một snapshot engine QA đã lưu**, không là bộ chọn lời sản xuất hoặc bằng chứng bao phủ mọi lá số. Mỗi cung dùng input riêng đã được factory chọn đúng điều kiện. Không chọn lời theo tên/ID/ngày sinh. Mệnh miễn phí V1/Luna không thuộc phần viết lại.

Có **26 mục**: 23 mục ứng viên diễn ý/tổng hợp, 2 mục Tật chỉ nghiên cứu và 1 mục Hóa Khoa ở Phu bị loại khỏi luận chính. Con số không phải 26 kết luận độc lập hoặc thước đo chiều sâu. Các nguồn cùng một nhận định hoặc cùng Hóa Lộc không được đếm như nhiều bằng chứng xác nhận nhau.

Trình tự biên tập: câu hỏi → facts đúng cung → lời nguồn đủ điều kiện → đóng góp của ngữ cảnh → tổng hợp được phép → giới hạn. Một ý không thêm giá trị thì gộp/bỏ, không tạo phần cho đủ số. Không bắt buộc có nguyên văn toàn tổ hợp mới được phân tích từ các tiền đề phù hợp; cũng không tự đặt phép thắng/thua/chế hóa. C/D giữ cung gốc và vai trò; điều kiện chưa rõ không được coi là đã không áp dụng.

Mục diễn ý nguồn chỉ cung cấp lời đã có và đúng điều kiện. Nếu triển khai đóng góp biên tập bằng một nhận định mới, phải viết đoạn riêng với `basis=ai-synthesis`, không gắn chung vào lời nguồn. Nhãn của mục trong bản đồ không thay thế kiểm attribution từng đoạn.

Input sản xuất vẫn `paid-retrieval-1.15.0`, prompt `paid-palaces-vietnamese-2.8.0`, contract `paid-reading-v2.0.0`. **Bản đồ chưa được nối vào writer**, không tạo job/version mới hoặc sửa input của attempt cũ. Trước API tương lai phải tích hợp bản đồ đủ điều kiện bằng đường dùng chung và kiểm lại; không dựng pipeline riêng cho bài mẫu.

## Bản đồ từng cung

### Phụ Mẫu

**Câu hỏi phải trả lời trên mẫu:**

- **PM1** — Quan hệ cha mẹ với nhau: có lời áp dụng, phạm vi giới hạn.
- **PM2** — Quan hệ cha mẹ–con: có lời áp dụng, phạm vi giới hạn.
- **PM3** — Hoàn cảnh vật chất khi lời áp dụng có vế ấy: có lời áp dụng, phạm vi giới hạn.

**Luận điểm và đóng góp:**

- **PM-A1 — Vật chất, hòa thuận và gần con là ba mặt trong cùng một lời** (diễn ý nguồn). Nêu cả ba mặt một lần; giải thích sự đủ đầy không phải chính sự hòa thuận, không dựng nguyên nhân bất hòa. Điều kiện/ngoại lệ: Giữ đồng cung Sửu/Mùi và ba vế khá giả–bất hòa–khó gần con. Không dùng vật chất trả lời thay quan hệ.
  Căn cứ dùng: `paid-v1.natal-paragraph-1-0`.
- **PM-A2 — Hai vai gia đình của người đọc** (tổng hợp biên tập). Chỉ thêm góc quan hệ với con nếu cần phân biệt hai chủ thể; không viết chương bù đắp hay truyền đời. Điều kiện/ngoại lệ: Giữ Lộc tại Nô khi dùng lời Tử; Tử Nữ là ngữ cảnh tam hợp, không kết quả của Phụ.
  Căn cứ dùng: `paid-v1.natal-paragraph-1-0`, `paid-context.tu-nu.paid-book.thp1-130-tu-from-no-loc`.

**Còn thiếu:** Chưa có phối hợp phụ tinh/điều chỉnh trực tiếp hoàn chỉnh; chưa giải nguyên nhân khoảng cách. Không coi ba vế một nguồn là ba bằng chứng độc lập.

**Địa chỉ và phần cần làm rõ:** TB126§5.2.5; toàn mục124–131, điều chỉnh§5.2.30; THP1/130 ý12. Đặc tả đúng điều chỉnh trực tiếp đối với câu Nhật–Nguyệt khi gặp cấu trúc khác; không cần xin thêm sách cho ba vế hiện có.

### Phúc Đức

**Câu hỏi phải trả lời trên mẫu:**

- **P1** — Hưởng phúc theo nghĩa truyền thống: có lời áp dụng, phạm vi giới hạn.
- **P2** — Quan hệ, hoàn cảnh và phân tán họ hàng: có lời áp dụng, phạm vi giới hạn.

**Luận điểm và đóng góp:**

- **P-A1 — Nền họ tộc và điều kiện sống xa** (diễn ý nguồn). Giải thích nền họ tộc bình thường và nét thuận có điều kiện ở xa xét hai phạm vi khác nhau; không chấm điểm phúc/đạo đức. Điều kiện/ngoại lệ: Tham đơn Dần/Thân; Mã tọa Phúc. Giữ cả khá giả khi xa quê và họ hàng không gần nhau.
  Căn cứ dùng: `paid-v1.natal-paragraph-2-0`, `paid-v1.natal-paragraph-2-1`.
- **P-A2 — Điều kiện nơi sống và cách được đón nhận bên ngoài** (tổng hợp biên tập). Một đoạn đối chiếu nơi sống với sự nể trọng/may rủi, không khuyên di cư hoặc gán thời điểm. Điều kiện/ngoại lệ: Thiên Di là ngữ cảnh tam hợp, Thất Sát đơn Ngọ; không từ xa quê suy mọi việc thuận.
  Căn cứ dùng: `paid-v1.natal-paragraph-2-1`, `paid-v1.natal-paragraph-6-0`.

**Còn thiếu:** Chưa có phép phối hợp đầy đủ Tham–Linh–Mã hoặc điều chỉnh Triệt tại chính Phúc; lời nền không thành tổng kết hưởng phúc.

**Địa chỉ và phần cần làm rõ:** TB135§6.1.9;139§6.1.29;140§6.1.36;177§10.13; Triệt thực tại Dần. TB140 đã có lời TT: vế xa quê/phân tán và hai nhánh nhiều sao sáng/mờ. Cần tách đúng phương diện, giữ lượng từ và loại phần tuổi thọ; không tự cho Triệt xóa hay đảo mọi lời.

### Điền Trạch

**Câu hỏi phải trả lời trên mẫu:**

- **D1** — Nguồn gốc nhà đất: thừa hưởng hay tự tạo: chưa có câu trả lời đủ căn cứ trong đầu vào này.
- **D2** — Tạo lập và duy trì biến chuyển ra sao: có lời áp dụng, phạm vi giới hạn.

**Luận điểm và đóng góp:**

- **D-A1 — Hai chặng tạo và giữ, có Triệt trực tiếp** (diễn ý nguồn). Khó/chậm tạo lập khác hao hụt khi đã có; giữ cả hai thời đoạn, không kể chuyện đã mất nhà. Điều kiện/ngoại lệ: Cơ–Cự tại Điền, Triệt ngay Mão; không chỉ nêu nền thuận rồi bỏ Triệt.
  Căn cứ dùng: `paid-v1.natal-paragraph-3-0`.
- **D-A2 — Nơi ở và quan hệ với con là hai phương diện nếp nhà** (tổng hợp biên tập). Chỉ giữ câu đối chiếu nếu giúp người đọc hiểu chỗ ở khác tình thân; không dùng nó lấp D1. Điều kiện/ngoại lệ: Tử Nữ đối cung; Lộc ở Nô vẫn ở Nô. Lời đối đãi không bảo đảm giữ tài sản.
  Căn cứ dùng: `paid-v1.natal-paragraph-3-0`, `paid-context.tu-nu.paid-book.thp1-130-tu-from-no-loc`.

**Còn thiếu:** Nguồn được chọn chưa trả lời thừa hưởng hay tự tạo. Không biến khó tạo thành không được thừa hưởng.

**Địa chỉ và phần cần làm rõ:** NPL Tổng Hợp260–261,241–245,257–259; TB155/157; THP1/130. Tìm đúng mệnh đề về nguồn gốc với Cơ–Cự và Triệt trực tiếp; nếu chưa xác minh phải ghi D1 thiếu, không thêm lời từ phỏng đoán.

### Quan Lộc

**Câu hỏi phải trả lời trên mẫu:**

- **Q1** — Cách làm việc/khuynh hướng công việc: có lời áp dụng, phạm vi giới hạn.
- **Q2** — Tiến trình và sự ổn định: chưa có câu trả lời đủ căn cứ trong đầu vào này.
- **Q3** — Mức công danh khi có lời phù hợp: chưa có câu trả lời đủ căn cứ trong đầu vào này.

**Luận điểm và đóng góp:**

- **Q-A1 — Tổ chức, biểu đạt và vị trí Hóa Quyền** (diễn ý nguồn). Chia tổ chức việc và truyền đạt ý; Quyền được việc chỉ là vị trí, không chức danh hay nhãn lãnh đạo chắc chắn. Điều kiện/ngoại lệ: Hổ–Tấu đồng cung, Quyền năm sinh tại Quan. Giữ mặt mưu tính/vượt quyền cùng khả năng tổ chức.
  Căn cứ dùng: `paid-v1.natal-paragraph-4-0`, `paid-v1.natal-paragraph-4-1`, `paid-v1.natal-paragraph-4-2`.
- **Q-A2 — Từ cách giải quyết đến cách thực hiện và tạo khoản thu** (tổng hợp biên tập). Suy xét ở Mệnh, tổ chức/biểu đạt ở Quan, cạnh tranh/tích lũy ở Tài cho ba khâu khác nhau; giải thích điểm nối thay vì lặp quyền–trách nhiệm. Điều kiện/ngoại lệ: Mệnh/Tài tam hợp; giữ hạn chế lời nền Phủ, không suy phương án tốt thì tiền đến.
  Căn cứ dùng: `paid-v1.natal-paragraph-4-0`, `paid-v1.natal-paragraph-4-1`, `paid-v1.natal-paragraph-0-3`, `paid-v1.natal-paragraph-8-0`.

**Còn thiếu:** Chưa có mệnh đề đủ điều kiện về tiến trình/ổn định và mức công danh; điều chỉnh sát tinh§8.14 chưa đặc tả. Không lấy tích lũy chậm tại Tài làm chậm thăng chức.

**Địa chỉ và phần cần làm rõ:** TB158§8.1;162§8.11;166§8.39; phương pháp Tứ Hóa13–14; Phủ76; Liêm190. Rà đúng điều chỉnh§8.14 với các sao và quan hệ hiện có; cần mệnh đề tiến trình/mức công danh chứ không thêm lời quản trị chung.

### Nô Bộc

**Câu hỏi phải trả lời trên mẫu:**

- **N1** — Quan hệ và sự trợ giúp qua lại: mới trả lời một phần.
- **N2** — Thuận–khó, duy trì/diễn tiến trợ giúp: chưa có câu trả lời đủ căn cứ trong đầu vào này.

**Luận điểm và đóng góp:**

- **N-A1 — Thiện chí và kỳ vọng đáp lại** (diễn ý nguồn). Viết về phía người đọc gửi tình cảm/kỳ vọng trong giao du; không gán bạn bè trung thành hoặc thực tế đông bạn. Điều kiện/ngoại lệ: Lộc năm sinh ở Nô; cảm tình không tự là chân tình. Chưa có phi hóa phù hợp để khẳng định được nâng đỡ.
  Căn cứ dùng: `paid-book.thp1-128-no-loc`, `paid-library.thp1-no-loc-network`.
- **N-A2 — Biểu hiện hợp tác chưa là lợi ích thực nhận** (diễn ý nguồn). Phân tích riêng mở quan hệ hợp tác và nhận trợ lực/thu lợi; không lấy thiện chí làm bằng chứng lợi nhuận. Điều kiện/ngoại lệ: THP1/130 ý12; thu lợi cần xét Nô và tam phương, chưa có phép tổng hợp kết quả.
  Căn cứ dùng: `paid-library.thp1-no-loc-cooperation`.
- **N-A3 — Đối đãi mềm mỏng và độ sâu chia sẻ** (tổng hợp biên tập). Đặt cảm tình gửi đi cạnh nét xa cách anh chị em; một câu phân biệt mạng lưới và tình thân, không dùng để lấp N2. Điều kiện/ngoại lệ: Lương là nghĩa nền dù đắc/hãm, không chứng minh phẩm chất bạn bè; Huynh Đệ đối cung.
  Căn cứ dùng: `paid-book.thp1-128-no-loc`, `paid-library.hs125-luong-general-disposition`, `paid-v1.natal-paragraph-11-0`.

**Còn thiếu:** Chất lượng và sự bền vững của trợ giúp chưa được trả lời. Bảng Mệnh–Nô chưa có phép chọn hàng đã xác minh cho Mệnh hai chính tinh Vũ–Phủ; không lấy hàng Lương hãm riêng.

**Địa chỉ và phần cần làm rõ:** THP1/128–130§4.2.8; TB168–172 bảng Mệnh–Nô; HS125§4. Cần chú giải điều kiện chọn hàng bảng khi Mệnh hai chính tinh/VCD/TT và phép phi hóa phù hợp nếu muốn dùng nhánh trợ giúp. Chưa được tự tính thêm phi hóa.

### Thiên Di

**Câu hỏi phải trả lời trên mẫu:**

- **DI1** — Thuận–khó khi ra ngoài: có lời áp dụng, phạm vi giới hạn.
- **DI2** — Hỗ trợ, cạnh tranh hoặc trở ngại có căn cứ: mới trả lời một phần.

**Luận điểm và đóng góp:**

- **DI-A1 — Được tin phục vẫn đi cùng may rủi** (diễn ý nguồn). Phân biệt được nhìn nhận với kết quả mỗi việc; không hứa thành công hoặc chuyển may rủi thành tai họa cụ thể. Điều kiện/ngoại lệ: Thất Sát đơn thủ Tý/Ngọ; giữ cả nể sợ/tin phục và may rủi.
  Căn cứ dùng: `paid-v1.natal-paragraph-6-0`.
- **DI-A2 — Sống xa và được đón nhận bên ngoài** (tổng hợp biên tập). Giải thích nơi sống có nét thuận và việc ra ngoài có may rủi có thể cùng xuất hiện; không khuyên di cư. Điều kiện/ngoại lệ: Phúc tam hợp; lời Mã giữ xa quê cùng họ hàng phân tán, không chuyển Mã sang Di.
  Căn cứ dùng: `paid-v1.natal-paragraph-6-0`, `paid-v1.natal-paragraph-2-1`.

**Còn thiếu:** Nguồn hỗ trợ/trở ngại cụ thể và phối hợp phụ tinh còn mỏng; không dùng sao chưa truy nguồn để kể thêm.

**Địa chỉ và phần cần làm rõ:** TB177§10.13;139§6.1.29. Cần mệnh đề đúng vị trí/quan hệ cho các phụ tinh Di thực có; không cần thêm danh sách nghề hay vận hạn.

### Tật Ách

**Câu hỏi phải trả lời trên mẫu:**

- **T1a** — Mệnh đề truyền thống áp dụng cho cấu trúc: chưa có câu trả lời đủ căn cứ trong đầu vào này.
- **T1b** — Điều kiện/điều chỉnh trực tiếp của mệnh đề: chưa có câu trả lời đủ căn cứ trong đầu vào này.

**Luận điểm và đóng góp:**

- **T-A1 — Phân biệt VCD và các lớp sao đã lưu** (chỉ phương pháp, không viết lời cá nhân). Chỉ lập hồ sơ cấu trúc; đây chưa là đoạn luận cá nhân và không tính bài trả phí đã giao. Điều kiện/ngoại lệ: Tật VCD tại Mùi; Bệnh Phù khác giai đoạn Bệnh. Không chọn nhánh chỉ từ tên sao.
  Căn cứ dùng: `paid-library.tb182-tat-t1-branches`.
- **T-A2 — Nhánh cứu/tác và phạm vi từng sao** (chưa được dùng thành lời cá nhân). Giữ trạng thái insufficient; không đổi bệnh thành stress/sức bền, không dùng Y như phép trừ Bệnh Phù. Điều kiện/ngoại lệ: Tả/Quyền ở cung khác không chuyển thành tọa Tật; nhiều cứu/tác chưa có ngưỡng; Thiên Sứ cần bối cảnh hạn.
  Căn cứ dùng: `paid-library.tb182-tat-t1-branches`.

**Còn thiếu:** T1 đã được chấp nhận về hướng nhưng chưa có bài cá nhân được duyệt xuất. Còn quan hệ cứu/tác đúng vế, lượng từ, vị trí, thời điểm; Mộ source-conflict và Thiên Sát upstream-unverified không được diễn giải.

**Địa chỉ và phần cần làm rõ:** TB181–182/188; HS154/220/216–217; hồ sơ9phiếu tại ai-paid-depth-review-20261103/tat-source-review.json. Đặc tả một mệnh đề T1 có đầu ra được phép và điều chỉnh trực tiếp đủ rõ từ kho đã có; nếu cần bổ sung, cần đoạn chú giải đúng nhóm/vị trí/thời điểm, không thêm lời chẩn đoán hoặc hạ chuẩn bằng notice.

### Tài Bạch

**Câu hỏi phải trả lời trên mẫu:**

- **TA1** — Tiến trình tạo khoản thu: có lời áp dụng, phạm vi giới hạn.
- **TA2** — Tích lũy và giữ lại: có lời áp dụng, phạm vi giới hạn.
- **TA3** — Chi tiêu đúng phạm vi: có lời áp dụng, phạm vi giới hạn.

**Luận điểm và đóng góp:**

- **TA-A1 — Cạnh tranh để kiếm tiền, tích lũy cần thời gian** (diễn ý nguồn). Giữ tiến trình cạnh tranh/chậm và sắc thái chắc nhưng không hứa làm giàu; không dùng sao khác để xóa lời. Điều kiện/ngoại lệ: Liêm độc thủ Dần/Thân; độc là một chính tinh, không phải vắng phụ tinh.
  Căn cứ dùng: `paid-v1.natal-paragraph-8-0`, `paid-book.npl261-liem-tai`.
- **TA-A2 — Suy xét–tổ chức–tạo thu nhập** (tổng hợp biên tập). Giải thích vai chuẩn bị phương án, triển khai và tạo khoản thu; không chỉ nhắc ba cung khác nhau hoặc tự hứa cơ hội nghề. Điều kiện/ngoại lệ: Mệnh/Quan tam hợp. Phủ chỉ nghĩa nền còn điều chỉnh chưa khép; tổ chức không là lợi nhuận.
  Căn cứ dùng: `paid-v1.natal-paragraph-8-0`, `paid-v1.natal-paragraph-0-3`, `paid-v1.natal-paragraph-4-0`.
- **TA-A3 — Thu và khoản giữ lại cần xét cả Hao** (tổng hợp biên tập). Giữ hai chiều tích lũy và hao hụt mà không chọn sao thắng; không quy mọi hao thành mua sắm hoặc suy tài sản ròng. Điều kiện/ngoại lệ: Đại Hao tại Tài Đắc; Tiểu Hao tại Phúc đối cung, không tọa Tài. Không áp nhánh Mão/Dậu hoặc Nhị Hao hãm.
  Căn cứ dùng: `paid-v1.natal-paragraph-8-0`, `paid-library.tb41-tai-hao-scope`.
- **TA-A4 — Chi sinh hoạt theo từng đợt** (diễn ý nguồn). Đọc nhịp sử dụng tiền cụ thể, không gán tính cách con hoặc biến thành lúc nào cũng tiêu nhiều. Điều kiện/ngoại lệ: Tử Nữ VCD thật, Hỏa/Linh không tọa Tử; chỉ chi ngoài công việc. Giữ chi theo hứng rồi có lúc giữ chặt.
  Căn cứ dùng: `paid-v1.natal-paragraph-8-1`.

**Còn thiếu:** Đủ ba mặt thu–giữ–chi ở mức limited trên mẫu; chưa có phép cân Liêm–Hao hay điều chỉnh trực tiếp toàn bộ yếu tố. Không bắt buộc phải có nguyên văn cho cả tổ hợp mới được tổng hợp có căn cứ.

**Địa chỉ và phần cần làm rõ:** TB190§12.2,41§3.27,195§12.27; NPL261; THP2/201,617,619,626; Mệnh76/Quan162. Đối chiếu các vế điều chỉnh trực tiếp nếu muốn kết luận sâu hơn; chưa có lý do xin thêm sách chung chung. Bản chuẩn hiện không cần kết luận tài sản ròng.

### Tử Tức

**Câu hỏi phải trả lời trên mẫu:**

- **TU1** — Con/diễn tiến trong loại đã duyệt: chưa có câu trả lời đủ căn cứ trong đầu vào này.
- **TU2** — Quan hệ cha mẹ–con: có lời áp dụng, phạm vi giới hạn.
- **TU3** — Điều kiện đối tượng/sớm muộn của đúng vế: mới trả lời một phần.

**Luận điểm và đóng góp:**

- **TU-A1 — Một nét hòa hợp đúng điều kiện Lộc ở Nô** (diễn ý nguồn). Giữ có thể và chủ thể quan hệ; không từ hòa hợp dựng phẩm chất/nhu cầu/hành vi của con. Điều kiện/ngoại lệ: Lộc năm sinh tại Nô theo phép cung biểu hiện; không phải Lộc tại Tử và không phải phép mượn chính tinh.
  Căn cứ dùng: `paid-book.thp1-130-tu-from-no-loc`.
- **TU-A2 — Quan hệ với cha mẹ và quan hệ với con** (tổng hợp biên tập). Một đoạn phân biệt hai quan hệ; không dựng truyền tinh/gánh nặng/nuôi dạy qua thế hệ để kéo bài dài. Điều kiện/ngoại lệ: Phụ tam hợp; Nhật–Nguyệt giữ vật chất/bất hòa/khoảng cách đúng chủ thể.
  Căn cứ dùng: `paid-book.thp1-130-tu-from-no-loc`, `paid-v1.natal-paragraph-1-0`.

**Còn thiếu:** Tử VCD chưa có lời đủ điều kiện về diễn tiến; không lấy Cơ–Cự ở Điền thành sao tọa Tử. Một nét đối đãi không thành bài đầy đủ về con.

**Địa chỉ và phần cần làm rõ:** THP1/130 ý12; THP2/180; TB200–201/207; PhụTB126. Cần mệnh đề đúng Tử VCD/đối tượng và cầu nối chuyển lời được xác minh nếu định dùng đối cung; không xin số con/sinh sản/giới tính ngoài phạm vi.

### Phu Thê

**Câu hỏi phải trả lời trên mẫu:**

- **PH1** — Tương tác/hòa hợp/trở ngại: mới trả lời một phần.
- **PH2** — Diễn tiến và điều kiện chung sống: mới trả lời một phần.

**Luận điểm và đóng góp:**

- **PH-A1 — Sức theo đuổi và dấu ấn trợ giúp qua một giai đoạn** (diễn ý nguồn). Diễn riêng hai lời: sức theo đuổi có lượng từ và sự trợ giúp từng qua một giai đoạn; phần so sánh thêm phải tách thành đoạn tổng hợp, không gắn nhãn lời nguồn. Điều kiện/ngoại lệ: Phá hoặc Sát/Tham tọa Phu; Tả/Hữu tọa Phu. Giữ phần nhiều, thường thường, từng trợ giúp qua một giai đoạn và va chạm rồi mới hợp.
  Căn cứ dùng: `paid-book.thp2-178-phu-sat-pha-tham`, `paid-library.thp2-phu-ta-huu`.
- **PH-A2 — Mức chắc trước hành động và nhu cầu tự do trong ví dụ** (tổng hợp biên tập). Nối hai cách tiếp cận để giải thích khác biệt nhịp quyết định, không tạo quy luật đối phương hoặc chuyện tranh cãi thực tế. Điều kiện/ngoại lệ: Ví dụ cần cả Mệnh Vũ–Phủ và Phu Phá; không nhận là hình học tam hợp Mệnh–Phu. Nhánh sát tụ phía sau chưa được chọn.
  Căn cứ dùng: `paid-book.thp2-178-phu-sat-pha-tham`, `paid-library.thp2-phu-vu-phu-pha-context`.
- **PH-A3 — Hóa Khoa không trả lời thay câu hỏi tương tác** (có nguồn nhưng loại khỏi luận chính). Có nguồn nhưng chưa đóng góp cho PH1/PH2; bỏ khỏi phần luận chính, không dựng chương học vấn để lấp chiều sâu quan hệ. Điều kiện/ngoại lệ: Nam mệnh, Khoa năm sinh tại Phu; học vấn không đổi thành lắng nghe/biết điều/cứu giải.
  Căn cứ dùng: `paid-v1.natal-paragraph-10-0`.

**Còn thiếu:** Phá–Đà–Hỏa và Tuần trực tiếp chưa có phép phối hợp đủ điều kiện; lời Đà ở nữ mệnh không áp mẫu nam. Không biến phép Hỏa làm dịu Phá (đã bị nguồn bác) thành chế hóa.

**Địa chỉ và phần cần làm rõ:** THP2/173–174/178–179,172,465–466,699; TB214§14.21. Khóa điều kiện và đầu ra được phép của nhánh sát tụ/Thiên La–Địa Võng/TT; không đòi trích nguyên cả ba sao, không mở lời phản bội/chia ly để làm sâu.

### Huynh Đệ

**Câu hỏi phải trả lời trên mẫu:**

- **H1** — Quan hệ và trợ giúp anh chị em: mới trả lời một phần.
- **H2** — Gần–xa/phân tán/diễn tiến: có lời áp dụng, phạm vi giới hạn.

**Luận điểm và đóng góp:**

- **H-A1 — Nét xa cách chưa xác định hình thức** (diễn ý nguồn). Một ý gọn đúng chủ thể, không kể số người hoặc dự đoán điều xấu. Điều kiện/ngoại lệ: Thiên Đồng đơn thủ Tỵ/Hợi; không tự đổi xa cách thành bất hòa, nơi ở hay không quan tâm.
  Căn cứ dùng: `paid-v1.natal-paragraph-11-0`.
- **H-A2 — Giao du rộng khác chia sẻ trong tình thân** (tổng hợp biên tập). Giữ đối chiếu ngắn giữa độ rộng kết nối và tình thân; không lấy bạn bè bù anh chị em. Điều kiện/ngoại lệ: Nô đối cung; Lộc nằm ở Nô, cảm tình không đủ kết luận được giúp.
  Căn cứ dùng: `paid-v1.natal-paragraph-11-0`, `paid-context.no-boc.paid-book.thp1-128-no-loc`, `paid-context.no-boc.paid-library.thp1-no-loc-network`.

**Còn thiếu:** Chất lượng trợ giúp và ảnh hưởng Tuần trực tiếp tại Hợi chưa đủ đặc tả; một nét xa cách không trả lời toàn H1.

**Địa chỉ và phần cần làm rõ:** TB218§15.2.3;223§15.2.34;217–224 và giới hạn liên cungPhúc217; THP1/128–130. TB223 có lời TT: cần tách vế quan hệ/không gần nhau lâu khỏi vế sinh tử và số lượng, giữ đúng điều kiện TT; không đặt lời khuyên ở riêng thành dự báo.

## Những gì cần bổ sung, đúng loại khoảng thiếu

**Chưa yêu cầu chủ dự án gửi thêm sách.** Đã có kho chữ và các hồ sơ phù hợp để tiếp tục xử lý những chỗ dưới đây. Không nói đã rà hết mọi sách hoặc đã chứng minh không còn nguồn. Chỉ đề nghị tài liệu mới sau khi chỉ ra một mệnh đề cụ thể chưa tìm được trong phạm vi nguồn đã rà.

1. **Nguồn có nhưng chưa đủ đặc tả/khai thác:** Phúc có lời Tuần/Triệt ngay TB140§6.1.36; Huynh có TB223§15.2.34; Điền có hai hoàn cảnh di sản/tự lập ngay NPL260. Đây là ứng viên cần tách vế và giữ điều kiện, không được báo chung là thiếu sách. Không chọn hoàn cảnh của khách, tự đếm “nhiều”, xuất sinh tử hoặc mốc hạn để lấp bài. Phiếu S10–S12 ghi riêng, chưa đưa vào input như lời đã được duyệt.
2. **Điều kiện nối chưa rõ:** Nô cần cách áp bảng TB168–172 cho Mệnh hai chính tinh và điều kiện phi hóa nếu định kết luận trợ giúp; Phu cần nhánh phụ/sát/TT đúng đích, giữ nữ mệnh ở THP2/172 và không dùng Hỏa làm dịu Phá theo465–466. Không yêu cầu chủ dự án tự chọn hàng bảng hoặc AND/OR. Codex phải đề xuất cách hiểu có chứng cứ trước.
3. **Lời cá nhân còn hẹp:** Tử VCD mới có một nét đối đãi từ Lộc tại Nô; chưa có cầu nối để lấy Cơ–Cự đối cung thành lời tại Tử. Tài có thu–giữ–chi ở mức limited; thiếu phép kết luận sâu hơn không đồng nghĩa phải tạo quy tắc Liêm–Đại Hao hoặc tài sản ròng. Quan còn thiếu tiến trình/mức công danh; Phụ/Di có lời hẹp, chưa đủ phối hợp mọi điều chỉnh trực tiếp.
4. **Tật T1:** hướng chú giải cấu trúc đã được chấp nhận, không hỏi lại hướng ấy. Còn thiếu một mệnh đề được phép dùng và điều chỉnh trực tiếp đủ rõ (nhóm/vị trí/lượng từ/thời điểm), cùng bản nội dung đủ điều kiện xuất. Tái dùng [9 phiếu Tật](../.local/ai-paid-depth-review-20261103/tat-source-review.json), không biến thông báo `insufficient` thành bài đã giao. Không đổi bệnh thành stress/sức bền để né giới hạn; không yêu cầu thêm sách y khoa hoặc lời dự đoán tuổi thọ.

Nếu thật sự cần tài liệu bổ sung, phiếu yêu cầu phải ghi tác giả/mục đã tra, câu đang thiếu và điều kiện cần được chú giải. Hiện chưa có căn cứ chỉ định một đầu sách mới cụ thể; không yêu cầu bạn mua hoặc gửi thêm toàn bộ PDF.

## Kiểm mock thực sự đã chạy

Node24.21.0; không load `.env`, bỏ key/DB URL, AI tắt; chặn fetch/socket/TLS trước import. Chỉ gọi input factory/validator hiện có trong bộ nhớ. Không OpenAI CREATE/GET, không truy cập DB, worker, supervisor, migration hoặc deploy.

- 11 input được tái tạo từ cùng bản lưu và so bằng sâu với input1.15 đã kiểm; mỗi cung159facts, snapshot không đổi.
- 11 bản đồ/26 mục kiểm ID, loại nguồn, điều kiện, ngoại lệ, provenance và neo bắt buộc; bảy đoạn Tài có bản đối chiếu riêng.
- 10 bản limited (Tài mới +9 bản đề xuất cũ) và trạng thái Tật insufficient qua validator2.8; không gọi đó là 11 bài hoàn chỉnh.
- 14 probe âm bị từ chối: ID sai, C thành trực tiếp, D thành kết luận, nền thành lời nguồn, thiếu neo, trộn attribution, tên sách, template, ba dạng y khoa, insufficient giả và mất sắc thái giai đoạn trợ giúp. Câu giới hạn y khoa theo cách viết đã được hỗ trợ vẫn qua.
- 35 lượt kiểm hash tham chiếu, trên 32 file chữ nguồn duy nhất; 167 file bài/input/receipt/nguồn cũ giữ hash. Không cộng số lượt thành số nguồn mới.

[Script kiểm](../.local/ai-paid-standard-map-20261104/check.ts) · [Log cuối](../.local/ai-paid-standard-map-20261104/check-final.log) · [Summary](../.local/ai-paid-standard-map-20261104/mock-summary.json) · [Manifest bảo toàn](../.local/ai-paid-standard-map-20261104/preservation-before.json).

**Giữ lỗi đầu và giới hạn:** lần1 bắt optional metadata bị ghi `null` thay vì giữ vắng mặt, đã sửa artifact generator; lần2 guard attribution chặn nhầm “đọc…cạnh tranh”, đổi câu trong bản thảo thành diễn ý trực tiếp rõ hơn, không nới guard. Lần3 phát hiện guard chặn câu giới hạn hợp lệ “Không dự báo tuổi thọ.”; **chưa sửa mã**, giữ quan sát false-positive riêng, cách viết đầy đủ “Không dự báo tuổi thọ hoặc tử vong.” đã qua. Không đổi expected thành chứng nhận câu bị chặn là nguy hiểm. Một helper source-card lỗi encoding stdin trước khi ghi đã chuyển sang fileUTF-8; một patch không khớp context bị từ chối trước ghi. Không mất nguồn/bài cũ.

Chỉ artifact/tài liệu nên không build/typecheck/suite ứng dụng/E2E/PDF. Không kiểm model, quyền credit, phiên browser, thanh toán thật hoặc độ phủ đa lá số. Quan sát đọc riêng QA3118 vẫn listen bằng PID74791 tại checkout `.local/qa-paid-current-20261103/checkout`; không lấy HEAD root làm phiên bản phục vụ mới, không restart hoặc đưa artifact vào checkout ấy. Không truy cập QA3062/3070.

## Điểm dừng và tiến độ

Bài chuẩn đề xuất và bản đồ đã có để duyệt; **chưa có bài chuẩn được chủ dự án chấp nhận, chưa nghiệm thu thương mại**. Bản đồ này không tự đổi P05/P09 hoặc phạm vi đã chốt. Checklist hồ sơ kế thừa giữ nguyên: Phụ90%, Phúc90%, Điền90%, Quan90%, Nô90%, Di90%, Tật90%, Tài90%, Tử90%, Phu90%, Huynh90%. Đây không phải phần trăm chất lượng, độ phủ hay sẵn sàng thu phí; Tài P09 partial, mười cung khác chưa kiểm model hiện hành. Không tăng điểm bằng bản thảo/mock.

Ba việc còn chặn: bài chuẩn chưa được chấp nhận về giá trị đọc; các điều kiện/nội dung thiếu nêu cụ thể ở từng cung chưa khép; đầu ra model và runtime thương mại trên phiên bản tương ứng chưa được nghiệm thu. Không có quyền gọi API tiếp, tự publish, đổi gói, cập nhậtQA3062/3070 hoặc mở bán từ hồ sơ này.
