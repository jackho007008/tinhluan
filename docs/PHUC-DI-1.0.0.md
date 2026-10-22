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

## Một quyết định phương pháp còn chờ — Đồng–Âm xung chiếu Di,21/10/2026

Phiên nối80d9232 đã triển khai nhóm TàiVCD trực tiếp1.60, chưa mở lại9Di. Khi tra điểm chặn, hồ sơ NPL-16/HS52 cho biết **có phương pháp giữ chi/trạng thái sao chiếu tại vị trí thật**; ví dụ Âm ởNgọ chiếuTý không được dời vềTý. TânBiên180§10.36 cho xét chính diệu xungchiếu, nhưng không nói tường minh chi trong câu Đồng–Âm/Di175§10.3/176§10.8 phải hiểu ở cung cho hay nhận. Hai vị trí Tý/Ngọ có lời trái chiều. Không ghép hai nguồn chỉ vì một vế thuận.

**Phương án đề xuất để chủ dự án quyết định:** chấp thuận một hợp đồng phối hợp **TB–NPL riêng cho Đồng–Âm/Di**, dùng HS52 để cố định chi cặp tạiMệnh thật; dùng đúng lời **vềDi** TB175–176 theo chi đó. Ghi tên hai nguồn/phần đóng góp trong căn cứ, không gán cách phối hợp này cho một tác giả. Không dời sao, không tính lại độ sáng ởDi, không chuyển lờiMệnh, TT/Kỵ hay phụ tinh; không tự nhân rộng sangPhụ/Phúc/Quan/Tài/Phu. TH88 nói mức xungchiếu không được lượng hóa: không đặt tỷ lệ, không gọi đây là kết luận toànDi. Duyệt phương pháp này vẫn cần kiểm đủ phảnvídụ/ngoạilệ và văn trước khi tích hợp; chưa có code/coverage mới.

**Ví dụ đầu ra dự kiến**, Di tạiTý trống, cặp thật ởMệnhNgọ:

> Thiên Di không có chính tinh; Thiên Đồng–Thái Âm ở Mệnh tại Ngọ xung chiếu về. Lời riêng về môi trường bên ngoài của cấu trúc này nhấn vào cạnh tranh, sự ghen ghét và việc ra ngoài rất bất lợi. Mức ảnh hưởng của thế chiếu chưa được xác định, nên chưa dùng đoạn này làm kết luận chung về việc đi xa.

Cặp thật ởMệnhTý chiếuDiNgọ phải theo vếTý: quý nhân giúp đỡ, được kính trọng, buôn bán thuận; **không** lấy vếNgọ chỉ vì cung nhận ởNgọ. Hai hướng được chọn bằng một hợp đồng hình học nhất quán, không chọn câu thuận. Mẫu trên là phương án chưa duyệt.

**Phương án giữ nguyên:** chỉ dùng TB trong các nhánhDi hiện hành; không ghépHS52 để chọn câu phụ thuộc chi. Ví dụ đầu ra cho cùng cấu trúc: “Thiên Di chưa có nhận định cho cấu trúc này”, kèm dữ kiện thật ở phần tra cứu; không tạo đoạn lành/dữ chung để lấp. Không tăng độ phủ, nhưng chưa đưa một phép phối hợp tác giả vào sản phẩm.

**Tác động đo được, chưa phải kết quả triển khai:** lọc hình học từ192snapshot đã lưu có3ứngviên34/127/139, cả3Di trước chưa cóđoạn;2cặp ởMệnhTý,1ởMệnhNgọ. Nếu duyệt, đây là tối đa3cung mới có nhận định trong tập con đó trước kiểm ngoại lệ, không hứa giảm đủ3hoặc giải6DiVCDcòn lại. [Danh sách ứng viên cục bộ](../.local/finance-vcd-20261021/di-method-candidates.json). Không có yêu cầu thẩm định bên ngoài; chủ dự án quyết định hợp đồng sản phẩm sau lập luận của Codex. **Chưa duyệt/chưa triển khai** phương án này.

## Đồng–Âm/Di — nguyên tắc đã duyệt và kết quả giải TT,21/10/2026

**Thay trạng thái “chờ quyết định chọn chi” phía trên:** U trực tiếp đã duyệt giữ chi thật của cặp tại Mệnh, chọn lời Di tương ứng của Tân Biên, ghi rõ nguyên tắc không dời sao từ Hàm Số là phần phối hợp của dự án. Không phải công thức nguyên văn TB; chưa duyệt ba đoạn thẩm định hoặc bỏ điều chỉnh TT. Task tiếp theo cho giải nguồn/tìm engine hữu hạn và triển khai đúng tập con đủ căn cứ, không bắt buộc tỷ lệ hoặc kết luận tốt–xấu chung.

**Phân loại theo phương diện, tái dùng kho nguồn:**

- **Loại1 — nguồn nói rõ có thay đổi:** TB36§3.8: Âm miếu/vượng gặp TT trực tiếp thành mờ; Âm hãm gặp TT thành sáng. Giữ chi thật nên xét điều này tại Mệnh chứa sao. Không được bỏ điều chỉnh bắt buộc hoặc coi cả hai TT tự triệt tiêu. **Loại3 còn lại:** chưa có đoạn nối sự đổi trạng thái đó với từng vế quý nhân, kính trọng, phát tài hay cạnh tranh, ghen ghét, bất lợi của cặp xung chiếu. Chưa tự đảo lời hoặc giữ nguyên toàn nền. Vấn đề thiếu là quan hệ định tính giữa điều chỉnh và phương diện, không phải thiếu một tỷ lệ.
- **Loại2 — lời thêm độc lập:** TB179§10.27 nói TT án tại Di: “Ra ngoài hay gặp nhiều sự phiền lòng, lúc chết ở xa nhà”. Vế phiền lòng có nghĩa độc lập; vế sinh tử không phát hành theo phạm vi hiện hành. Mục này không nói xóa hay thay các vế của lời cặp. Có thể giữ lời phiền lòng cùng nền **khi nền đã đủ điều kiện**; không cần chọn kết quả chung. Lượt này chỉ triển khai lời TTDi, chưa xuất nền. Không coi TT tại Di là án trực tiếp Thái Âm ở Mệnh.
- **Loại3 — chưa đủ xác định quan hệ:** TB36 còn có tăng/giảm vẻ rực rỡ với Riêu/Đà/Kỵ/Kình/Không/Kiếp và Đào/Hồng/Hỷ; phạm vi “gặp”, lượng từ nhóm và phép chuyển sang từng vế cặp chưa khép. Không tự coi chỉ đồng cung hoặc tự mở thành mọi sao chiếu. TH89 và HS225–227 nói giảm/đảo/tương tác khác nhau; TH91 giới hạn đảo sao đồng cung. Đây là đối chiếu, không nhập toàn phương pháp TT của NPL để chọn thắng TB179. Hướng thuận của VCDTT ở HS51/226 không tự xóa lời phiền lòng của TB.

**Tập con thực thi — 1.61.0/catalog1.58.0:** rule `tanbien.di-dong-am-receiver-void`, module cũ `dong-am-di.ts` (đã được thay bởi [di-void.ts](../lib/interpretation-rules/di-void.ts) ở1.62), dùng facts/evaluator/renderer hiện có. Di thật trống; Mệnh đúng hai sao Đồng–Âm tạiTý/Ngọ đối sáu chi; danh sách chính tinh complete/toàn vẹn/bản mệnh; hai cặp TT duy nhất/kề nhau hợp lệ; ít nhất một cặp án **Di**. TT chỉ ở Mệnh không khớp; TT ở cả hai cung không nhân đôi/xóa lời TTDi. Thiếu/bất nhất giữ unknown. Cặp Đồng–Âm là giới hạn task, nguồn TTDi rộng hơn; không gán cặp thành điều kiện sách.

Không thêm cổng phải vắng Không/Kỵ/Hóa Khoa hay độ sáng để dùng chính vế TTDi: nguồn không đặt những ngoại lệ đó cho lời phiền lòng. Điều này không bỏ điều chỉnh của **nền Đồng–Âm**, vì nền chưa được xuất. Không chọn lời theo mẫu/ngày/giới/tuổi; không chuyển sao, lời Mệnh, phụ tinh hoặc Tứ Hóa sang Di. Rule vẫn draft/review=null.

**Văn khách hàng đầy đủ của nhánh mới:**

> Thiên Di không có chính tinh, nhận Thiên Đồng–Thái Âm từ Mệnh xung chiếu. Khi Tuần hoặc Triệt án ngay tại Thiên Di, lời riêng về yếu tố này nói đến việc ra ngoài thường gặp nhiều phiền lòng. Nhận định này nói về yếu tố án ngữ, chưa đánh giá kết quả chung của mọi sao trong cung.

**Engine hữu hạn:** định trước480 đầu vào (1980–1999 ×18/05,06/11 ×12giờ lẻ1..23, nam).239lượt đầu tìm được hai chiều không TT; xét điều kiện còn lại bằng241lượt còn lại cùng lưới. Tổng480 hợp lệ,0lỗi,13cấu trúc Đồng–Âm/DiVCD,6 không TT ở cảhai cung. Đã chứng minh **có thể xảy ra**, không suy bất khả đạt. Sáu trường hợp:18/05/1987 giờHợi;06/11/1989 giờHợi;06/11/1991 giờTỵ;06/11/1992 giờHợi;18/05/1994 giờTỵ;18/05/1997 giờTỵ. Các ảnh hưởng khác như Hỷ hoặc ĐịaKhông ở Mệnh/Di vẫn cần giải phạm vi, không xem vắng TT là đủ để áp toàn nền. [Kết quả từng lượt/đầu vào](../.local/dong-am-di-20261021/search-complete.json).

**Ba ứng viên192:**34 và127 TT trực tiếp ở Mệnh nhưng không ở Di, không nhận claim mới; nền Tý vẫn chưa áp.139 có Triệt tại DiTý, nhận **chỉ lời phiền lòng độc lập**, không nhận nền Ngọ hoặc đoạn thẩm định. So192 thực tế: **1Di mới có nhận định,0bổ sung,14→13 chưa có nhận định**, không phải cung hoàn chỉnh. Không tăng độ phủ từ các mẫu tìm ngoài192. [Bằng chứng và bàn giao](../.local/dong-am-di-20261021/ban-giao.md).

Điểm dừng: nhánh TTDi có căn cứ đã vào pipeline dùng chung; chưa giải nền Đồng–Âm dưới TT/các điều chỉnh khác. Không tạo thêm đoạn unknown để lấp cung. G2/lịch sử/Tật/hai mẫu chưa duyệt/Livefalse giữ nguyên; NPA120/DDSN898 vẫn chưa đọc.

## TTDi dùng chung — thay giới hạn Đồng–Âm,21/10/2026

Theo yêu cầu trực tiếp của chủ dự án nối `ca75881`, quy tắc TB179§10.27 được mở đúng phạm vi nguồn, thay tập con1.61. Đây không phải mở lời nền Đồng–Âm hoặc đổi hợp đồng phối hợp chọn chi. [Module dùng chung](../lib/interpretation-rules/di-void.ts) thay module hẹp; `tanbien.di-dong-am-receiver-void` rời catalog mới, không cùng chạy với `tanbien.di-direct-void`. Bản lưu cũ giữ văn/metadata đã đóng băng.

**Nguồn:** tiêu đề “Tuần, Triệt án ngữ” thuộc chương Thiên Di; dòng đầu có vế phiền lòng và vế chết xa nhà. Vế phiền lòng độc lập không giới hạn chính tinh/VCD, cặp sao, địa chi, sáng–mờ, tuổi hoặc giới. Chỉ TT trực tiếp tại Di; TT chỉ ở Mệnh/đối cung không đủ. Một trong hai hoặc cả hai cùng án đều tạo một lời. Đây là áp dụng trực tiếp TB179; không cần phép mượn hay phối hợp Hàm Số để chọn chi.

**Ngoại lệ liên quan đã đối chiếu từ hồ sơ/kho chữ:** các dòng Tham/Phá, Tướng Quân/Thiên Tướng, Mã trong §10.27 không viết rằng vế phiền lòng mất hiệu lực; chúng thêm phương diện tai nạn/sinh tử, không xuất trong gói này. Mã chung §10.24 vẫn bị chặn khi TT trực tiếp, không dùng vế phiền lòng thay cho việc giải lời Mã. Nhật–Nguyệt tại §10.5/10.8 có vế tăng rực rỡ riêng; chữ “Tuần, Tuần” giữ nguyên, không tự sửa thành Triệt. Nguồn không nói tăng rực rỡ xóa phiền lòng; cũng không dùng phiền lòng đảo/xóa lời chính tinh. Chưa giải vế tăng cho sao xung chiếu. Hóa Kỵ tại Di giữ ngoại lệ Nhật–Nguyệt hiện có, không vì TTDi mà mở lại nhánh bị loại. Các tác giả nói VCDTT thuận không được nhập để hủy vế TB179.

**Kiểm tính hợp lệ dữ liệu, không phải điều kiện sách:** profile Tân Biên có vị trí nguồn; danh sách12cung/14chính tinh bản mệnh complete, duy nhất và hợp lệ; Mệnh–Di định danh đối cung; hai cặp Tuần/Triệt duy nhất, kề nhau theo helper hiện có. Thiếu/bất nhất là unknown, không xuất. Không yêu cầu phụ tinh/Tứ Hóa/sáng–mờ đầy đủ để phát hành chính vế này. Cổng toàn vẹn dùng chung bảo vệ tính nhất quán snapshot; không biến chính tinh thành điều kiện chuyên môn.

**Giới hạn dự án:** chỉ vế phiền lòng độc lập; loại sinh tử/tai nạn vì phạm vi sản phẩm hiện hành. Không kết luận ròng, không tự điều chỉnh/xóa các lời khác. Nền Đồng–Âm và ba đoạn thẩm định chưa mở vì quan hệ điều chỉnh từng vế còn thiếu. Không mở Tật Ách/G2/Live. Rule vẫn draft, review=null; kiểm kỹ thuật không là phê duyệt chuyên môn cho nội dung khác.

**Chống trùng:** một fact/rule chung cho mọi cấu trúc, không sao chép theo cặp; cả hai TT chỉ một claim. Rule hẹp bị thay thế, không giữ song song. Hóa Kỵ cùng có chữ phiền lòng nhưng thêm thị phi và có căn cứ khác; giữ nguyên toàn lời đó, không xóa căn cứ hoặc nhập thành kết luận tổng hợp. Các lời chính tinh đã có không sửa. So192 xác nhận mọi fact/rule/trace/claim/đoạn khác và quan hệ/G2 giữ nguyên.

**Văn mới:**

> Tuần hoặc Triệt án tại Thiên Di gắn với việc ra ngoài thường gặp nhiều phiền lòng. Đây là nhận định riêng về yếu tố án ngữ, chưa phải kết luận chung của cung.

So với1.61:59mẫu khớp (52có chính tinh,7VCD),58được thêm lời:3Di mới có nhận định/55bổ sung, mẫu139 thay lời TTDi cũ. Di13→10chưa có nhận định, không coi cung hoàn chỉnh. [Bằng chứng/toàn văn trước-sau](../.local/di-void-shared-20261021/ban-giao.md). Không thay các mốc lịch sử phía trên.

## 1.66 — các vế độc lập còn thiếu,22/10/2026

[Lượt rà12cung](V1-DELIVERY-PLAN.md#coverage-repair-166-20261022): PhúcĐồng đơnThìn/Tuất vàTỵ/Hợi(TB133§6.1.3); Lương đơnTý/Ngọ vàTỵ/Hợi(136§6.1.12); Cự đơnTỵ/Thìn/Tuất chỉcâu họ thườngtranhchấp(135§6.1.10). Dùng`localPalaceAssessment(exact)`, giữ cổngTT; không biến ly tổ tránh hại thành dự báo, không chọn dòng giàu nghèo thắng giữa phần bất nhất. Cự không lặp khi nhánh cùngcung đãcó bất hòa/tranhchấp, không đòi vắng mọi sao. LươngTý/Ngọ0/192, chỉfixture. Phúc36→29thiếu,7mới/5bổsung.

DiLương đơnTỵ/Hợi(TB177§10.12) có vế “nay đây mai đó” độc lập, không có nếu/mới để tránh hại; loại sinh tử. TT179§10.27 vẫn có câuphiềnlòng riêng, tiểu mụcTham/Phá/Tướng/Mã không hủy vếLương. Dùng`phucDiFacts` hiện có,3Dimới10→7thiếu; không mở bảyDiVCD. Chữ/ảnh và đặc tả theo [hồ sơvếnguồn](../.local/coverage-repair-20261022/source-spec.md).
