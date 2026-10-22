# Tinh Luận — hợp đồng sản phẩm, nguồn và quyết định

Cập nhật 20/10/2026. Đọc cùng [CURRENT_STATUS](CURRENT_STATUS.md) và backlog duy nhất [V1-DELIVERY-PLAN](V1-DELIVERY-PLAN.md). File này phân biệt quyết định chủ dự án, hành vi đang có, lựa chọn kỹ thuật và đề xuất; không phải một danh sách rule mới để tự triển khai.

Căn cứ phân loại quyết định: [DECISIONS](DECISIONS.md) ghi lời chủ dự án theo từng gói, hồ sơ hỗ trợ và những mục chỉ có bằng chứng triển khai. Nhật ký assistant/code không tự là phê duyệt; chỗ chưa có xác nhận được đánh dấu riêng. Các mục1–8 dưới đây tương ứng Q01/Q02/Q05/Q06; bảo toàn lịch sử còn được yêu cầu trực tiếp trong G2 và các task nội dung.

**Chỉ đạo21/10 nối80d9232:** dừng mở thêm sách; NPA120/DDSN898 giữ chưa đọc. Dùng kiến thức đã lưu để hoàn thiện báo cáo; chủ dự án và Codex thực hiện, không yêu cầu người thẩm định bên ngoài như cổng bắt buộc. Có lựa chọn phương pháp thì Codex trình phương án/căn cứ/tác động, không tự ghép hoặc chọn câu thắng. [Quyết định Q12](DECISIONS.md).

## 1. Mục tiêu và những điều đã được chủ dự án chốt

1. Báo cáo cá nhân hóa, có căn cứ, đủ **12 cung** vẫn là mục tiêu V1 trước mở bán. Dữ kiện, tên cung, văn chung hoặc một đoạn không chứng minh chủ đề hoàn chỉnh. Không tự giảm lời hứa thành 11 cung.
2. Beta tiếp tục; **Live tắt, chưa thu tiền thật**, giá/hạn thương mại chưa chốt. G4 chỉ Test Mode cho A/B. Zalo và triển khai máy chủ tạm hoãn; chưa mở G6.
3. Dùng chung nội dung cho mọi hồ sơ trong miền hỗ trợ; không chọn lời theo tên/ID hay viết riêng 1992/Kim Thoa.
4. AI chỉ biên tập nhận định đã xác minh: không thêm kết luận, nghề, nguyên nhân, lời khuyên, dự báo; không chọn bên thắng giữa các ý khác chiều hoặc tạo trọng số. Không mặc định gọi AI bên ngoài cho mỗi khách.
5. Giữ engine, lịch, snapshot và lịch sử nếu task không cho phép thay. Bản mới có phiên bản riêng, không âm thầm dùng renderer/catalog mới thay văn cũ.
6. Không suy bệnh thực tế, chẩn đoán, thời điểm tử vong hoặc khuyên điều trị từ lá số. Không chuyển lời bệnh/tai họa thành “áp lực/sức bền” nếu nguồn không nói vậy.
7. Không mở vận hạn, scoring, nhiều lá số, quy kết phẩm hạnh hoặc tính năng phụ chỉ để bài trông đầy đủ. Phạm vi lớp năm xem của **phiếu** đã có không đồng nghĩa đã có luận vận hạn.
8. Ưu tiên Thiên Lương chỉ cho xung đột trực tiếp, cùng phạm vi đã được xác minh; không trộn bảng/trạng thái nguồn này vào kết luận nguồn khác.

## 2. Quyền khách và bản lưu — đang thực thi, phải bảo toàn

- Mỗi bản mới ghi `menh-free-1.0.0` và danh sách nhóm miễn phí. Miễn phí Mệnh; các cung có nội dung khác và PDF toàn bài cần full grant hợp lệ.
- Phân quyền tại server cho trang, JSON/RSC, căn cứ, print và PDF; không gửi văn trả phí xuống rồi che bằng CSS. Dữ kiện lá số không đồng nghĩa quyền đọc mọi lời luận.
- Nhóm miễn phí giữ trọn lời nền–điều chỉnh–ngoại lệ và liên kết căn cứ. Nhóm giao thoa chưa rõ phạm vi được giữ nguyên ngoài miễn phí, không cắt câu.
- Năm rule đang giữ riêng: `tanbien.life-body-role`, `tanbien.life-body-same-trine`, `tanbien.life-body-other-trine`, `npl.life-body-career`, `npl.life-body-wealth`. Đây là phân phối quyền của nội dung đã có, không phải thiếu rule.
- Bản legacy không có policy mới giữ quyền/hạn gốc; vẫn phải chứng minh sở hữu. ID, email hoặc tên không tự cấp quyền.
- Google đăng nhập không cấp admin, không gia hạn quyền, không tự gộp hai danh tính qua email. Liên kết báo cáo chỉ từ phiên sở hữu hoặc recovery đã xác minh.
- Recovery: email gắn từ quyền sở hữu hiện có; token ngẫu nhiên lưu hash, có hạn và một lần. Mở trang liên kết chưa tiêu thụ token; bấm tiếp tục mới đổi phiên. Không hồi sinh grant đã thu hồi/hết hạn.
- Đơn gắn tài khoản, bản lưu, snapshot/hash, policy và cấu hình gói có phiên bản. Worker giao đúng artifact, không chạy catalog lại; webhook/API/retry không tạo quyền/bản trùng.
- Checkout Test chỉ A/B; 1.000đ/72 giờ là cấu hình kiểm thử. Hạn quyền tách khỏi hạn phiên Google/phiên miễn phí. Gửi HTTP200 cho webhook không đồng nghĩa chấp nhận tiền.
- Gmail vẫn giới hạn địa chỉ thử; không tự gửi email thật cho khách khác. Không đưa secret/token/cookie vào URL bàn giao, log hay Git.

## 3. Giới hạn nào chưa phải quyết định cuối của chủ dự án?

### Hành vi hiện có nhưng xuất phát từ lựa chọn triển khai

- Chỉ trình bày dữ kiện Tật Ách và “chưa chọn nhánh luận nào” là kết quả audit/phạm vi triển khai; **không phải sách không có nội dung Tật Ách**.
- Loại số con/số anh chị em, thứ bậc/giới tính, một số câu số lần hôn nhân, âm phần: là các giới hạn biên tập đang áp dụng trong hồ sơ cũ. Không gán toàn bộ thành quyết định thương mại cuối đã được chủ dự án phê chuẩn; cũng không tự mở lại khi chưa có chỉ đạo.
- Cổng bảo thủ khi chưa biết cách điều chỉnh không có nghĩa sách yêu cầu “không có sao đó”. Ví dụ Phụ Mẫu §5.2.30 yêu cầu xét lại giàu/nghèo dưới Tuần/Triệt; chưa có phép đổi đúng từng lời nên hệ thống giữ nhánh chưa xác định. Không suy thành mọi quan hệ cha mẹ đều bị đảo. Lô1.64 đã tách34nhánh vế độc lập và gỡ cổng mộtTT cho nguồn gốcĐiềnVCD; phần giàu/nghèo/sang/hèn chưa có bảng đảo vẫn giữ, xem PHU-HUYNH/NO-DIEN.
- Việc từng chặn mọi trường hợp Nô có hai chính tinh hoặc chặn Vũ–Tham/Huynh do chữ “sau” là giới hạn cũ của dự án. Các phần đã được chứng minh và thay trong 1.52/1.53 không được thread mới phục hồi nhầm thành điều kiện sách.

### Đề xuất còn chờ duyệt

- ND02: mở nguyên ba nhóm vai trò Mệnh–Thân vào miễn phí, giữ hai nhóm Thân cư Quan/Tài ở chủ đề chi tiết. **Chưa đổi G2**; không dùng file này làm ủy quyền đổi policy.
- Định dạng cụ thể và hai mẫu Tật Ách dưới đây; danh sách loại trừ rộng hơn các cấm rõ ràng của chủ dự án; tiêu chí nghiệm thu luận Tật cá nhân.
- Không có quyết định giá/hạn thương mại, mở Live, hoặc chuyển beta thành phát hành trả phí.

### Quyết định mới nhất về Tật Ách

Chủ dự án **đồng ý hướng “chú giải truyền thống theo cấu trúc” để tiếp tục thẩm định**. Đây **không phải**:

- duyệt nội dung hai mẫu;
- cho phép publish hoặc thêm rule Tật Ách;
- công nhận đã hoàn thành luận cá nhân cung Tật Ách;
- cho phép thu hẹp mục tiêu đủ 12 cung.

Trạng thái này thay câu hỏi cũ “có đồng ý hướng hay không”; thread sau không hỏi lại quyết định hướng đã chốt. Những gì còn cần duyệt là **câu chữ/giới hạn của mẫu, điều kiện chuyên môn và điều kiện phát hành**.

## 4. Các câu hỏi chuyên môn thực sự đang chặn

Mã dưới đây trỏ về ND hiện có, không tạo backlog song song. “Chưa rõ” không được chuyển thành “thiếu coding”; một đoạn đã có lời cũng có thể còn thiếu phối hợp.

- **ND04 — VCD:** 1.61 đã thêm riêng lời TT tại Di trong tập con Đồng–Âm; chọn chi thật đã duyệt theoQ13 nhưng nền chưa áp. [Phân loại thay lời/thêm lời/chưa rõ](PHUC-DI-1.0.0.md). 1.60 đã thêm tập con TT trực tiếp tại Tài, Nhật–Nguyệt chắc chắn không cùng sáng; [đặc tả/phân loại](FINANCE-ASSETS-1.37.0.md). Không cần giải phép mượn để xuất riêng câu này. Tập con33 câu không phụ thuộc địa chi/trạng thái ở Phụ/Huynh đã triển khai1.55 theo [đặc tả](PHU-HUYNH-1.32.0.md). Các nhánh còn lại cần giải cung nào cho/nhận, chỉ chính tinh nào được xét, trạng thái lấy theo chi gốc hay cung nhận, Tuần/Triệt/Kỵ tác động ở đâu? TB33 và từng mục riêng: Di180§10.36; Tử207§13.3.68; Phụ131§5.2.31; Phúc142§6.1.61; các mục Huynh/Điền/Phu tương ứng trong audit. Không dùng hợp đồng Di đã giải để chứng minh toàn bộ cung khác. Sau nhánhTTDi mẫu139 còn támDiVCD chưa có đoạn; các lời nền Đồng–Âm vẫn giữ chưa áp. Không mở các nhánh khác từ một ví dụ.
- **ND05 — M06:** “Xương, Khúc, Khôi, Việt hội hợp” đòi cả bộ, từng sao hay nhóm nào; nằm ở những cung nào? TB118/120, định nghĩa33; HS168–169. Không suy AND/OR từ dấu phẩy hoặc cách dùng ở một cục khác.
- **ND06 — Phủ/Kình:** Kình riêng, nhóm Kình–Đà–Hỏa–Linh, Tuần/Triệt và Không/Kiếp là những câu riêng. “Gặp/phối hợp” là quan hệ nào, lượng từ nào, tác động phương diện nào? TB36/76, HS129, TH340–341. Không lấy câu kinh doanh TB235 để giải câu cứu hung.
- **ND07/17 — ngũ hành, Mệnh–Thân:** ô cùng hành/chiều sinh ngược/lợi địa nào có kết quả được nguồn nêu? Quy tắc nào nối phép ngũ hành với tính chất sao, và lượng từ/tập cung/thứ tự xét của cách cục? TH108–110/134–135, HS68; TB226–237. Không suy ô trống theo đối xứng hoặc biến Phủ sinh Mệnh thành chế Kỵ.
- **ND08 — Phúc:** “nhiều sát tinh”, nhóm sáng/mờ và cứu giải được định nghĩa ra sao? Với Tử Vi, VCD, Âm–Riêu–Đà–Kỵ, Cơ–Cự–Kỵ, điều kiện nào đổi lời riêng? TB132–142§6. Không đặt ngưỡng số sao hoặc phát biểu toàn dòng họ từ dữ kiện riêng.
- **ND09 — Nô:** các ô còn thiếu của bảng Mệnh–Nô và các chính tinh rơi vào nhiều nhóm/trạng thái xử lý thế nào? Tuần/Triệt đổi kết quả nào? TB168–173, TL155–159. Sự nhất trí trong một ô đã triển khai không giải phép phối hợp nhiều ô.
- **ND10/16 — Điền, Tài/Quan:** Nhánh diễn tiến kiếm tiền TT/TàiVCD đã khép1.60 trong tập con trên; ngoại lệ cùng sáng và tổng hợp chưa giải. Tuần/Triệt đổi tạo dựng, thừa hưởng hay giữ tài sản cụ thể ra sao? Khi lời giữ tiền gặp hao tán, nguồn có phép điều chỉnh hay chỉ hai lời khác phương diện? TB149–157,191/195; TH241–245/257/264–265. Không tự lấy kết quả ròng.
- **ND11 — Phụ:** §5.2.30 chỉ đích giàu/nghèo/sang/hèn của cha mẹ;1.64 đã giữ vế quan hệ độc lập. Còn bảng đối ứng từng mức và vị trí áp khi VCD. Lương Tỵ ở PDF128/129 khác nhau; Kỵ cùng Nhật–Nguyệt Sửu/Mùi là thay lời hay giữ các mặt khác nhau? Không sửa chữ hoặc đảo toàn nền.
- **ND12/13 — Tử/Phu:** điều kiện “muộn”, “nếu/mới”, một/cả Tuần–Triệt và lượng từ hội hợp được xác định thế nào? TB198–216, nhất là201/205/207/210/212. Câu chỉ số lượng, khó nuôi, sinh tử hoặc phẩm hạnh có lời quan hệ độc lập hay không? Không tự tạo lời nhẹ hơn.
- **ND14 — Huynh:** các nhóm phụ tinh, VCD và yêu cầu xem Phúc/Mệnh/Bào/Nô cho phép kết luận phối hợp gì? TB217–224, TL155–159. Vũ–Tham đã khép; không tiếp tục yêu cầu tuổi cho chính câu “sau đều giàu có nhưng sớm xa nhau”.
- **ND15 — Quan:** Vũ–Tham gắn mốc30tuổi, Cơ–Âm ghi chi khác cấu trúc engine, Sát có vế đao nghiệp/binh thương; đâu là điều kiện đủ để xuất một lời trong phạm vi? TB158–167. Không bỏ tuổi, đổi chi hoặc đổi tai họa thành nghề nghiệp thuận.
- **ND18 — Tật:** mức tăng/giảm từ Mệnh–Thân–Phúc, tập/quan hệ cứu tinh và tác họa, lượng từ “nhiều”, trình tự phối hợp và nghĩa thuật ngữ cổ. TB181–189; TL160–163, HS44/73 là hệ nguồn riêng, không tự hợp nhất.
- **ND19 — phạm vi:** các nội dung số lượng/thứ bậc/âm phần hoặc sinh tử bị loại có được đưa vào sản phẩm hay không là quyết định phạm vi, không phải câu hỏi có thiếu code. Mọi sự thay đổi phải được chốt cụ thể.

## 5. Toàn văn hai mẫu Tật Ách để duyệt

**Nhãn bắt buộc:** bản thẩm định, chưa duyệt nội dung, chưa publish. Các mẫu chỉ chú giải một đoạn nguồn theo cấu trúc; chưa phải bài luận cá nhân Tật Ách hoàn chỉnh. Không dùng các mẫu làm dữ liệu renderer/catalog trong phiên tài liệu.

Nguồn chung: Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*, tệp277trang, SHA-256 `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`. Dùng **trang PDF**, không tự nhận phân trang giấy. [Danh tính tệp và nguồn bổ trợ](../.local/tat-ach-20261013/sources.json). Chữ/ảnh PDF181–183 đã được đọc lại ở lô trước, không đọc lại toàn sách trong phiên này.

### Mẫu A — Thiên Đồng và Cự Môn đồng cung Tật Ách

> Khi Thiên Đồng và Cự Môn cùng nằm ở Tật Ách, đoạn về Thiên Đồng trong Tân Biên dùng chữ “bệnh tâm khí”. Phần nền của Thiên Đồng còn nói đến đau bụng và bộ máy tiêu hóa. Đây là cách mô tả trong tài liệu tử vi truyền thống; từ “tâm khí” được giữ nguyên, không quy đổi thành một chẩn đoán hiện đại. Đoạn này chưa kết hợp các yếu tố cứu giải và ba cung Mệnh–Thân–Phúc Đức, nên không kết luận tình trạng sức khỏe của bạn.

**Điều kiện:** hai chính tinh bản mệnh Thiên Đồng và Cự Môn cùng ở cung Tật Ách; chứng nhận chính tinh đầy đủ/hợp lệ. Dòng nguồn không thêm tuổi, giới tính, địa chi hoặc mức sáng riêng. Không lấy một sao xung chiếu/hội chiếu thay đồng cung.

**Ánh xạ câu và nguồn:**

- Câu1: [PDF182 §11.2.2](../.local/tat-ach-20261013/images/tb-182.png), dòng “Cự đồng cung: bệnh tâm khí”.
- Câu2: nền ngay phía trên ghi đau bụng, bộ máy tiêu hóa không lành mạnh. Mẫu đang nói về chủ đề của đoạn; khi duyệt cần xác định cách diễn đạt có đủ sát nghĩa hay không, không tự đổi thành sức bền/áp lực.
- Câu3: giới hạn biên tập, không phải phép quy đổi thuật ngữ y khoa từ nguồn.
- Câu4: [PDF181 mở chương11](../.local/tat-ach-20261013/images/tb-181.png) yêu cầu xét ba cung và cân nhắc cứu/tác; phần phối hợp chưa đặc tả.

**Cấu trúc kiểm chứng có thật:** snapshot43 của bộ192 — nữ,06/11/1983 dương lịch,giờ Tỵ; Tật tại Sửu, có Đồng–Cự, Kình/Tả/Hữu và Tuần/Triệt. Đây là chứng kiến cấu trúc engine, **không phải bằng chứng người đó mắc bệnh**.

**Chưa xét:** lời riêng Cự Môn, các phụ tinh/ngoại lệ, ảnh hưởng cứu giải của Tuần/Triệt, vai trò ba cung, cách cân nhắc các lời khác chiều. Không phát hành dòng Đồng–Cự như kết luận riêng rồi bỏ các yếu tố này. Không có kết luận sao nào thắng.

### Mẫu B — Thiên Cơ và Thái Âm đồng cung Tật Ách

> Với Thiên Cơ và Thái Âm cùng ở Tật Ách, mục Thiên Cơ ghi riêng hình ảnh “có nhiều mụn nhọt”; phần nền của mục còn nhắc bệnh ngoài da hoặc tê thấp. Đây là lời gắn với cặp sao trong văn bản truyền thống, không xác định bạn có các biểu hiện ấy. Chưa có cách phối hợp đầy đủ lời riêng của từng sao, các yếu tố đi cùng và phần cứu giải để đưa ra một kết luận Tật Ách cho hồ sơ này.

**Điều kiện:** Thiên Cơ và Thái Âm bản mệnh đồng cung Tật; chính tinh đầy đủ/hợp lệ. Dòng Nguyệt đồng cung không yêu cầu thêm chi, giới tính, tuổi hay mức sáng riêng. Không mở đồng cung thành mọi hội chiếu.

**Ánh xạ câu và nguồn:**

- Câu1: [PDF183 §11.2.5](../.local/tat-ach-20261013/images/tb-183.png), nền Thiên Cơ “bệnh ngoài da hay bệnh tê thấp” và dòng “Nguyệt đồng cung: có nhiều mụn nhọt”.
- Câu2: giới hạn biên tập về việc không xác nhận bệnh thực tế.
- Câu3: yêu cầu phối hợp [PDF181](../.local/tat-ach-20261013/images/tb-181.png) và trạng thái chưa có phép; không phải lời nguồn rằng các sao khác không tác động.

**Cấu trúc kiểm chứng có thật:** snapshot83 của bộ192 — nữ,18/05/1993 dương lịch,giờ Dậu; Tật tại Dần, có Cơ–Âm và Địa Không. Không suy Địa Không tự làm nặng/nhẹ bệnh.

**Chưa xét:** toàn lời Thái Âm, Địa Không và các yếu tố khác, tập sao cứu giải/tác họa, phối hợp Mệnh–Thân–Phúc. Mẫu chỉ giải thích đoạn Thiên Cơ, không gộp thành kết luận toàn Tật.

### Những gì còn phải duyệt sau khi đã đồng ý hướng

1. Câu chữ hai mẫu có giữ đúng mức nghĩa truyền thống và đủ rõ với người đọc mới không? Đặc biệt cách giữ từ “tâm khí”, “tê thấp” mà không tự dịch thành chẩn đoán.
2. Nhãn/chỗ đặt nào phân biệt được chú giải nguồn với luận cá nhân? Không dùng cảnh báo chung để che việc thiếu phép phối hợp.
3. Có đủ điều kiện chuyên môn để áp từng đoạn trong một hồ sơ có sao cứu giải/ngoại lệ hay chỉ được đọc như chú giải tài liệu? Hiện **chưa đủ để nghiệm thu luận cá nhân Tật Ách**.
4. Danh sách loại trừ mở rộng được đề nghị: khẳng định cơ quan yếu/tật/sinh sản, nguyên nhân y khoa, bảo đảm khỏi bệnh/thoát nạn, nhân quả gia đình gây bệnh, dự báo tự sát/cách chết. Đây là đề xuất, không ghi nhầm đã được duyệt toàn bộ. Các cấm chẩn đoán/thời điểm tử vong/điều trị của chủ dự án vẫn có hiệu lực ngay.

Chấp thuận mẫu sau này vẫn không tự cho phép publish; cần quyết định xuất bản rõ, điều kiện áp dụng, kiểm thử và nghiệm thu riêng. Phiên này giữ nguyên ứng dụng và dữ liệu.
