# Phúc Đức / Thiên Di — đặc tả nội dung 1.30.0

Nền nội dung 1.29.0; căn cứ `npl-evidence-process-1.0.0` giữ nguyên; phương pháp mới `tanbien-phuc-di-1.0.0`. Đây là đối chiếu văn bản, không phải phê duyệt chuyên môn. Engine, lịch, snapshot không thay.

## Nguồn đã đọc

- Tân Biên, Vân Đằng Thái Thứ Lang: toàn mục 6, PDF/trang in 132–148; toàn mục 10, PDF/trang in 174–180. Đối chiếu ảnh các trang 132–143, 174–179. §6.2 (143–148) chỉ kiểm kê, không triển khai âm phần. Định nghĩa đơn thủ/đồng cung: PDF33 §2.8, tái sử dụng hồ sơ định nghĩa hiện hành.
- Thiên Lương, Tử Vi Nghiệm Lý Toàn Thư, bản Scribd 298 trang: PDF103–106 và152–155; tái sử dụng phạm vi cặp Tuần/Triệt PDF86. Trang PDF là số trang bản Scribd, không gán thành trang in. 103–104 bác cách hiểu cung Phúc có quyền quyết định toàn Mệnh–Thân; 155 lại có câu Phúc chi phối. Không tạo phép cộng/trừ từ các chỉ dẫn định tính có khác ngữ cảnh này. Giữ nhận định cục bộ; không có rule Phúc tốt ⇒ Tài tốt.
- Nguyễn Phát Lộc, Tử Vi Hàm Số bản237: PDF38–45 (giới hạn về gia tộc, ngoại cảnh), các đoạn Phúc/Di PDF111,116,120,127,130,132,137–138,143. Đối chiếu ảnh39 và138 cho câu quyết định. Đây không phải đọc toàn sách. NPL138 nói Tử–Phá tại Di bất lợi, trong khi TB174 có trợ giúp và di chuyển: xung đột cùng đối tượng/phạm vi giữ riêng, không tự thay TB. NPL143 thêm Mệnh ngũ hành và cát tinh vào Vũ tại Di: không cấy điều kiện đó vào TB175. NPL116 dùng “đắc phúc” cả triều/ngưỡng đầu, TB137 phân biệt Sát Tý/Ngọ kém phúc: ghi khác biệt, giữ TB; không coi sách mới tự có quyền ưu tiên.

Hash/filename cụ thể ở `.local/phuc-di-20261013/identity.json`; TL SHA256 291822fa746be0320de5e452652e96f6a6ed10eb51cf05dc9d58f4a105a5ef6d; NPL SHA256 2a0245dcadaf77f2d8e35c9798893343c3be7117c5cc40a42087153ea5212709.

## Đối tượng và thực thi

Danh sách cấu trúc/địa chi, trang, mệnh đề biên soạn: `lib/interpretation-rules/phuc-di-content.json`. Mỗi dòng là một nhánh độc lập; evaluator hiện có thực thi fact `yes/no`, thiếu dữ kiện không xuất fact. Không thêm engine hoặc evaluator.

- Đối tượng: riêng Phúc Đức hoặc Thiên Di bản mệnh; không nhận sao đối cung thành tọa thủ.
- Chính tinh: danh sách complete và validator đủ14 sao/12 cung hợp lệ; nhóm một sao phải đúng1, nhóm2 đúng2; đối chiếu mã tên canonical theo hợp đồng adapter hiện hành (Star chưa có ID riêng).
- Địa chi: so sánh đúng nhóm sách nêu. Không suy nhãn sáng/hãm; phương pháp trạng thái của tất cả nhánh mới là **none**. Nhánh nói tọa thủ Thái Dương được giới hạn về đơn thủ để không tự hợp nhất với lời tổ hợp.
- Cổng phát hành `fact.source-position-available` giữ hai ô Kim Cục ngày21/24 chưa rõ ngoài phạm vi. Đây là giới hạn dự án, không điều kiện gán cho tác giả.
- Phụ tinh: bằng chứng dương phải có scope origin; phủ định phải có chứng cứ danh sách đủ. Tứ Hóa dùng verifier hiện hữu; chứng nhận bất nhất không được ghi đè bằng một mục sao dương.
- Nhánh Nhật–Nguyệt Phúc Sửu/Mùi: nền chỉ khi xác nhận không có Kỵ; có Kỵ chuyển sang §6.1.43; thiếu chứng cứ Kỵ giữ unknown. Hai lời loại trừ nhau. Đây là hình thức hóa nhánh chung và nhánh cụ thể cùng nguồn; không quy ra tác dụng Kỵ trên cung khác.
- Thiên Mã Di §10.24: nếu trực tiếp ở cặp Tuần/Triệt thì không xuất lời chung; §10.27 về tai nạn không được chuyển thành tiên đoán. Thiếu cặp hợp lệ: unknown. Phạm vi cặp từ helper đã đối chiếu TL86. Không truyền án ngữ từ xung chiếu.
- Kỵ Di §10.22: không xuất nhánh bất lợi chung khi có Nhật–Nguyệt đồng cung (§10.5/8 có nhánh riêng). Chưa tự sửa chữ “Tuần, Tuần” thành “Tuần, Triệt”.

## Biên tập, không đổi đối tượng

Mỗi lời luôn mở bằng “Theo Tân Biên” và cấu trúc kích hoạt. Giữ các vế đối chiều cùng câu (Vũ–Tham cạnh tranh/trước khó sau dễ, Cơ–Cự tài lộc/thị phi, Tướng Mão/Dậu ít lợi ích/được mến chuộng, Sát Tý/Ngọ vị nể/may rủi). Không có lời khuyên chuyển nơi ở, đầu tư, nghề hiện đại hoặc tuổi/năm.

Các mệnh đề về tuổi thọ, cách chết, chẩn đoán, nhân cách hoặc tình dục người thân, thần linh và vị trí mộ không đưa thành nhận định. Không đổi những mệnh đề ấy thành tích cực: ghi loại trừ trong ma trận nguồn; giữ vế khó khăn có ý nghĩa độc lập nếu có. Chỉ riêng một ý “hưởng phúc” không chứng minh đời sống thực tế thuận lợi. Những đoạn còn về họ hàng được trình bày như hình ảnh của tài liệu, không là sự thật về người đó.

Tổ hợp không xóa chú giải khác cung; hai chủ đề mới không đổi claim Mệnh, Công việc, Tài Bạch. Dữ kiện liên cung và liên kết chỉ để đọc tiếp.

## Các nhóm chưa thực thi

- Phúc §6.1.1/37: phạm vi sát tinh trong nhánh Tử Vi cần chốt cùng lượng từ; không mượn nhóm §8.14 Quan. Phúc §6.1.5 và39–42: quan hệ/lượng từ Riêu–Đà–Kỵ và tác động lên lời nền chưa rõ. Các chú giải Âm riêng chỉ là nền, không phải giải quyết điều chỉnh này.
- Phúc Cự135 và Lương136 có đoạn địa chi trùng nguyên lời Nhật, gây mâu thuẫn với ngay nhánh đơn thủ. Không sửa sách; giữ các tổ hợp có đoạn đối chiếu độc lập, nhánh Lương Sửu/Mùi không thuộc đoạn mâu thuẫn.
- Phúc Phủ–Tướng134 không thể đồng cung theo cấu trúc chính tinh hiện hành; không biến thành rule.
- Các nhóm dấu phẩy hoặc “nhiều” ở Phúc15–20,26–28,31–42,49–60 và Di15–21,23,26,28–35: cần lượng từ/phạm vi riêng; nhóm nào chỉ có tuổi thọ/tai họa/đạo đức/âm phần thì loại biên tập chứ không gọi thiếu code.
- Phúc§6.1.45 Tham–Vũ Hỏa(hay Linh) nói hưởng phúc/may mắn, trùng ý đã có trong nhánh Vũ–Tham; chưa tạo claim lặp hoặc “mạnh hơn”. Quan hệ tăng tuổi thọ không dùng.
- Phúc§6.1.46 Cự–Kỵ: phần tuổi thọ/người thân không dùng; tác động lên nhánh Cơ–Cự đang có hai giai đoạn chưa được sách chỉ rõ. Giữ thành câu hỏi phối hợp, không đặt ưu tiên ngầm.
- Phúc§6.1.61: vô chính diệu có nhánh độc lập Đà Dần/Thân, nhưng định nghĩa “Đà độc thủ” có loại thêm phụ tinh không ngoài Tuần/Triệt cần đối chiếu; không giả lập cung để chạy toàn bộ lời tọa thủ. Phần Tam Không phải giữ đúng các sao theo nhánh, không đồng nhất Thiên Không/Địa Không/Tuần Không.
- Di§10.36 cho mượn chính diệu đối cung nhưng chưa chuyển toàn bộ các ngoại lệ của chính cung/đối cung; giữ dữ kiện, không chạy rule trên cung giả.
- Nhật–Nguyệt Di: có câu lặp “Tuần, Tuần” ở175/176, không tự sửa. Chưa đưa nền thành kết luận toàn cung.

## Nghiệm thu

192v2 nguyên bản, hash lịch sử, claim/trace và section cũ so sánh sâu; bộ này là hồi quy đã biết, không chứng minh dự đoán. Các nhóm major/minor/facts loại trừ nhau; missing/source-unresolved là chỉ tiêu chồng lấp. Mẫu engine bổ sung tìm trong phạm vi hữu hạn, tách khỏi192. Fixture thay sao chỉ kiểm tra kỹ thuật. Rule draft/review=null và gate khách hàng giữ nguyên.

### Vòng Thái Tuế và các nhánh phụ tinh hoàn tất

Phúc §6.1.24 Hóa Khoa, §6.1.25 Hóa Kỵ, §6.1.30 Thái Tuế có mệnh đề độc lập được thêm cùng đợt. Kỵ chung không xuất khi Nhật–Nguyệt đồng cung. Hóa Quyền §6.1.23 dẫn chiếu Khôi/Việt với “nhiều sao”, nên không bỏ dẫn chiếu để tạo lời vô điều kiện.
Thái Tuế đọc trường bản mệnh `suiqian12`, không tìm riêng trong minorStars. Bằng chứng dương là đúng nhãn vòng tại cung; bằng chứng âm yêu cầu đủ12 nhãn hợp lệ/duy nhất trong12 cung. Thiếu vòng giữ unknown; sao lưu tên Thái Tuế không thay thế trường bản mệnh. Đây là đọc dữ kiện đã lưu, không an lại vòng.


## Bổ sung ND04 ngày19/10/2026 — chỉ Thiên Di vô chính diệu

Giới hạn “không chuyển toàn bộ lời đối cung” ở bản1.30 vẫn đúng. Nay triển khai một phần §10.36 theo đặc tả khóa tại mụcND04 trong `V1-DELIVERY-PLAN.md`: sáu cặp Cơ–Lương/Cơ–Cự/Đồng–Lương/Đồng–Cự/Vũ–Tham/Liêm–Tham có lời **về Di** không phụ thuộc địa chi/trạng thái, đối chiếu ảnh PDF33,174–177,180. Cung cho là Mệnh xung chiếu, cung nhận là DiVCD; giữ tọa độ/sao thật trong snapshot. Không dùng lời đang xuất ở Mệnh, không chuyển phụ tinh/TứHóa/TT, không mượn ND01 hoặc gọi sao xung chiếu là tọa thủ thật.

Phương pháp `tanbien-di-vcd-pairs-1.0.0`; `diVcdFacts` cung cấp facts vào evaluator hiện có, các rule `tanbien.di-vcd-*` draft/review=null. Chứng nhận principal complete/toàn vẹn và Mệnh–Di đối sáu chi là cổng dữ liệu; không có chính tinh khác ở Di. Trạng thái **không sử dụng** vì sáu câu đã chọn không yêu cầu; câu hỏi nơi xác định sáng/hãm của các nhánh khác vẫn chưa giải. Lời phụ tinh và ngoại lệ hiện có chạy nguyên trạng trên cung thật.

Chưa triển khai Đồng–Âm (Tý/Ngọ có hai chiều), Cơ–Âm (Dần/Thân), Dương–Lương/Dương–Cự (lời vị trí), Nhật–Nguyệt (nơi xétKỵ/TT và chữ “Tuần, Tuần”). Không áp dụng cách chuyển này cho VCD các cung khác. Chi tiết điều kiện, expected, số mẫu trước/sau và kiểm thực chạy nằm ở **backlog hiện có**, không tạo kế hoạch mới. Các số trang trong bổ sung này là **trang PDF**, không gán trang in.


### ND04 lượt tiếp 14 mẫu — nền Nhật–Nguyệt, 19/10/2026

Bổ sung sau kết quả sáu cặp trên, không sửa lịch sử đặc tả: đối chiếu ảnh PDF33,175–177,180 xác định câu nền Nhật–Nguyệt ở175§10.5/176§10.8 không có điều kiện chi/sáng-hãm. Câu “lại càng rực rỡ” là tăng thêm trên nền, chưa đặc tả nơi xét Tuần/Kỵ khi xung chiếu; không biến ngoại lệ chưa rõ thành điều kiện phải vắng các sao ấy. Triển khai **chỉ nền** với `tanbien.di-vcd-nhat-nguyet-base`, phương pháp `tanbien-di-vcd-sun-moon-base-1.0.0`: DiVCD thực, Nhật–Nguyệt đồng cung thật tại Mệnh xung chiếu, danh sách chính tinh đầy đủ/toàn vẹn. Không sử dụng brightness của cung cho hay nhận, không dời sao/phụ tinh. Nội dung giữ giới hạn chưa áp dụng vế tăng thêm. Lời phụ tinh, gồm Kỵ Di, vẫn độc lập và không bị xóa.

Đồng–Âm Tý/Ngọ, Cơ–Âm Dần/Thân vẫn chưa rõ lấy vị trí nào để chọn vế; Dương–Lương/Dương–Cự chưa có hợp đồng chuyển điều kiện vị trí và lời đơn thủ. Không lấy sáu cặp trước làm chứng minh. Câu chữ lặp “Tuần, Tuần” vẫn chưa được tự sửa thành Triệt. Nhật–Nguyệt5 mẫu nay có nền,9 mẫu nhóm còn lại vẫn thiếu lời; không gọi ngoại lệ đã giải quyết. Điều kiện, expected trước chạy, toàn bộ kết quả và điểm dừng ghi tại **ND04 trong V1-DELIVERY-PLAN.md**.


## Bổ sung hữu hạn 1.58.0 / catalog1.55.0 — 21/10/2026

Dùng ma trận cũ và đặc tả1.47; chỉ đối chiếu câu tại ảnh133/141/142. Không đọc lại chương. Code `e7bd1e4`, bảy nhánh trong `no-dien-phuc.ts`, không đổi Thiên Di.

- PDF133§6.1.5: Thái Dương **tọa thủ**, không phải đơn thủ. Hai nhóm chi giữ nguyên Dần/Mão/Thìn/Tỵ/Ngọ và Thân/Dậu/Tuất/Hợi/Tý. Chỉ xuất hưởng phúc/khó toại lòng và hoàn cảnh họ hàng; không tuổi thọ/phẩm hạnh hoặc biến lời khuyên ly tổ thành điều kiện đã áp. Bỏ giới hạn đơn thủ tự đặt; không cấy độ sáng engine. Xác nhận vắng Riêu/Đà/Kỵ để tránh§39–40 chưa rõ lượng từ: đây là cổng an toàn của dự án, không suy một sao là đủ kích hoạt ngoại lệ.
- PDF141§46 Cự–Kỵ đồng cung: khó toại lòng, họ hàng bất hòa/ly tán/sa sút. PDF141§47 Cự–Hỏa đồng cung: câu độc lập về họ hàng bất hòa/ly tán/sa sút; không bệnh, chết hoặc cháy từ đường.
- PDF141 tiêu đề§51 và câu142: **Hỏa hay Linh**, đồng cung Tang Môn; giữ câu họ hàng ly tán. Tang Môn dùng vòng Thái Tuế bản mệnh đủ12 vị trí, không giả làm phụ tinh để khớp mẫu.
- PDF142§52: Kỵ đồng cung **Kình hay Đà**; giữ nhiều lo toan, may ít rủi nhiều, họ hàng tranh chấp/sa sút; bỏ vế phẩm hạnh. PDF142§53: **Kỵ, Không, Kiếp đồng cung**, đủ cả ba; giữ khó toại lòng/họ hàng ly tán suy bại, bỏ vế phẩm hạnh.

Chữ “hay” là căn cứ OR, “đồng cung” và danh sách ba sao§53 là căn cứ hội đủ; không tự đặt lượng từ. Tất cả giữ cổng TT trực tiếp chưa giải§36, ghi rõ giới hạn triển khai. Không tự xóa lời nền Cơ–Cự, không chọn Cự–Kỵ thắng; lời tổ hợp giữ riêng và nói rõ chưa hợp nhất. Không áp cơ chế điều kiện unknown của bốn mẫu Tử–Phu sang đây.

Bộ192: Phúc43→36 trống,7 mới có nhận định/8 bổ sung. Số khớp từng nhánh: Dương cao7/thấp1, Cự–Kỵ4, Hỏa/Linh–Tang1, Kỵ–Kình/Đà2. Cự–Hỏa và Kỵ–Không–Kiếp **chỉ có fixture kỹ thuật**, chưa có chứng kiến engine trong192 hoặc các đầu vào mới có chủ đích; không tuyên bố bất khả đạt. Hai mẫu engine ngoài192 được tạo qua form: nữ21/02/1978 giờSửu (Cự–Kỵ), nữ07/11/1978 giờTỵ (Hỏa/Linh–Tang).

Còn chặn: Tử Vi có sát/TT, Riêu–Đà–Kỵ chưa rõ lượng từ/tác động; VCD/Tam Không/Đà độc thủ chưa rõ tập sao/phối hợp; các câu Cự/Lương bất nhất; Hóa Quyền dẫn chiếu chưa xác định lời thay thế. §45 trùng nghĩa không thêm claim;§55–56 lời thuận gắn nguyên nhân thần linh, không tách thành dự báo độc lập;§48/54/57–60 chưa có câu độc lập đủ điều kiện và phạm vi. Không mở âm phần, sinh tử, bệnh, phẩm hạnh. Phần đủ đặc tả trong phạm vi rà này đã triển khai hết, không tuyên bố hết sách. Backlog ND08/19 giữ đúng điểm chặn; [bằng chứng](../.local/no-dien-phuc-20261021/ban-giao.md).
