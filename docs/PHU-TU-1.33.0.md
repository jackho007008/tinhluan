# Phu Thê / Tử Nữ — 1.33.0

Baseline nội dung 1.32.0; căn cứ npl-evidence-process-1.0.0; engine không đổi. Phương pháp cục bộ mới: `tanbien-spouse-children-1.0.0`. Rule draft, review=null. Đối chiếu văn bản không phải phê duyệt chuyên môn.

## Phạm vi nguồn và triển khai

Tân Biên bản 277 trang: đọc toàn mục Tử Tức PDF/trang in 198–207 và Thê Thiếp/Phu Quân 208–216, đối chiếu ảnh toàn bộ; định nghĩa PDF33 §2.6–2.8. Thiên Lương bản 298 trang: đối chiếu PDF137–140, 164–167; Hàm Số bản 237 trang PDF40–42. Hash, ảnh và ma trận toàn mục ở `.local/phu-tu-20261013/`. Không tuyên bố đọc toàn ba sách.

`phu-tu-content.json` có 56 nhánh; điều kiện, câu biên tập, địa chỉ nguồn và giới hạn từng nhánh là đặc tả dữ liệu được kiểm thử. Dùng evaluator, familyAssessment và chứng nhận sao/Tứ Hóa hiện có. Không thêm một engine hoặc tính lại sao. Các mệnh đề được chọn quy định sao/địa chi trực tiếp, khai báo stateMethod=none; không đổi bảng trạng thái.

Nhánh một chính tinh được nguồn quy định đơn thủ dùng exact; tổ hợp dùng đúng bộ chính tinh. Thiên Tướng–Đào Hoa–Hồng Loan yêu cầu đủ ba đồng cung theo tiêu đề §14.39, không ép Thiên Tướng đơn thủ. Hóa Lộc/Quyền/Khoa Phu Thê phân biệt nam/nữ từ normalized.gender, không suy tình trạng hôn nhân. Tử là vòng Tràng Sinh, khác Tử Phù. Thái Tuế/Phục Binh lấy từ vòng suiqian12/boshi12 đã lưu: chỉ xác nhận âm khi đủ 12 tên vòng hợp lệ, duy nhất; thiếu hoặc sai giữ unknown. Không dùng sao lưu để kích hoạt bản mệnh.

Không thêm điều kiện vắng Tuần/Triệt hàng loạt. Không xuất những vế số lượng con/hôn nhân, sinh sản, sinh tử, quy kết phẩm hạnh hoặc lời khuyên cưới/sinh. Không thay chúng bằng lời tích cực khác. Điều kiện sớm/muộn, lần kết hôn và lượng từ chưa rõ giữ ngoài nhánh thực thi. Ma trận ghi rõ phần đã làm và phần còn lại theo từng mục.

Không áp Thiên Lương như một ưu tiên toàn sách: đoạn PDF165–167 là khung liên hệ và điều kiện cần, chưa thành công thức đủ cho các nhánh cụ thể. Hàm Số bổ sung giới hạn người thân/liên cung; ý giả thuyết về hôn nhân tiếp theo không thực thi. Không có thay thế phương pháp nguồn hiện hành.

## Bảo toàn và phiên bản

Bổ sung hai section/bộ chọn cung; bản mới lưu frozen reading 1.33.0. 8 bản mới dùng nguyên snapshot của bộ ứng viên, có parentId; không sửa lịch sử. Phụ Mẫu chỉ sửa giới hạn trình bày: thay lời mơ hồ về Nhật–Nguyệt bằng yếu tố còn chưa tổng hợp (chú giải khác chiều, sao phụ, liên cung). Claim/điều kiện không đổi.

Hồi quy cùng 192 v2 xác nhận claim, text, trace cũ và các section khác không đổi (Phụ Mẫu chỉ khác ghi chú). Hash 452 bản lịch sử và engine/calendar bảo toàn. Không dùng các snapshot QA sửa sao vào mẫu engine.

## Độ phủ và kiểm thử

192 v2, nhóm loại trừ nhau: Phu Thê 53 chính tinh/tổ hợp + 59 chỉ phụ tinh + 80 chỉ dữ kiện; Tử Nữ 54 + 30 + 108. Không missing-facts trong các nhánh mới trên bộ này; không có nghĩa các đoạn nguồn chưa triển khai đã rõ.

49/56 nhánh có mẫu trong 192 v2. Tìm hữu hạn 576 đầu vào tổng hợp thêm được 5 nhánh. Hai nhánh Thiên Tướng–Đào Hoa–Hồng Loan theo nam/nữ chưa tìm thấy; chưa chứng minh bất khả thi, không tính fixture kỹ thuật là mẫu engine.

- Full unit/integration: 70 file / 2713 test đạt, database test riêng. Không fail/skip.
- Typecheck và production build đạt (build trong QA copy, không đụng .next dev).
- E2E theo phạm vi: 52 lượt cung/mobile 360/390px cho 8 hồ sơ và 5 mẫu bổ sung; API tạo/lưu/mở lại; 8 bản lịch sử; auth và origin guard; không retry.
- Bản production QA kiểm tra: http://127.0.0.1:3027. Server chính 3000 giữ nguyên.

Các expected preview hiện hành được cập nhật cụ thể theo 56 nhánh mới, không sửa golden lịch sử. Kim Thoa: Thái Âm mang Kỵ tại Tử Nữ Hợi, TB PDF204 §13.3.24; 1992: Hóa Khoa tại Phu Thê, nam, TB PDF214 §14.21. Không dùng output làm chuẩn nguồn. Thêm kiểm thử điều kiện đúng/sai/thiếu, bản mệnh/sao lưu, nhóm bắt buộc, sai cung và bất biến snapshot.

## Điểm dừng

11 cung có nội dung cục bộ; Tật Ách chưa có gói. Chưa tổng hợp toàn cung hoặc toàn lá số. Chuẩn bị đọc trọn mục 11 Tân Biên, phần Phụ–Ách Thiên Lương và nhóm Phúc–Mệnh–Thân–Tật Hàm Số; chưa triển khai. Giữ nguyên beta, thanh toán, email và cổng duyệt.

## Lô ND12/13 và ND04/Tử — 21/10/2026, trình bày1.56.0/catalog1.53.0

Baseline thực `main@28328cc`, sạch; QA3062 đầu lô chạy checkout `.local/family-accuracy-20261021/qa-final`. Dùng lại ma trận audit trên, đặc tả19/10 và evaluator `kinAssessment`; không lấy trạng thái bàn giao làm bằng chứng predicate. Đọc lại **ảnh đã render của đúng PDF199,208–213** để giải các câu bị chặn; không đọc lại toàn sách. Nguồn và hash277trang giữ như hồ sơ cũ.

### Các câu đủ căn cứ được chuyển thành code

Thêm14 nhánh tọa thủ trong `kin-extension-content.json` và2 nhánh TửVCD, nối cuối catalog để giữ ID/văn nhóm cũ. Không sửa phép tính sao, bảng độ sáng hay mở nội dung số lượng/sinh tử/phẩm hạnh. Tất cả draft/review=null; đối chiếu nguồn không phải duyệt chuyên môn.

- **Tử Liêm–Phá, Liêm–Tham: PDF199§13.2.2** (dẫn lại Phá202). Giữ câu con về sau không khá giả. Với Liêm–Phá, “nếu sinh nhiều…” kết thúc ở vế nuôi toàn vẹn; câu sau về vật chất không có nếu/mới. Liêm–Tham nối bằng “và sau này…”; không biến khó nuôi thành điều kiện để xuất lời vật chất, không suy về sinh sản. Ma trận cũ gộp loại cả các vế này là giới hạn biên tập, không phải điều kiện nguồn. Khác Liêm–Tướng có “khó nuôi nhưng lớn lên…” và Sát có “dù sinh nhiều…chỉ còn…nhưng…”: chưa lấy riêng vế thuận trong các câu đó.
- **TửVCD, hai cặp trên:** PDF207§13.3.68 +199§13.2.2. Tử không chính tinh, Điền đúng đối sáu chi có đúng cặp; câu cung nhận không phụ thuộc chi/độ sáng. Dùng evaluator VCD riêng đã có, không mượn phụ tinh/Tứ Hóa hoặc lời Điền, không dựng cung giả. Đây là2 nhánh bổ sung, không chứng minh mọi phép mượn.
- **Phu Âm đơn Dậu/Tuất/Hợi, hai giới: PDF211§14.8.** Giữ vị thế, lấy nhau sớm, hòa thuận lâu bền; nam giữ thêm nể vợ/đôi khi nhờ vợ có danh giá của cải. “Lấy nhau sớm” là mô tả như các nhánh đã giải19/10; không có nếu/mới, không biến thành gate tuổi. Loại nhan sắc/phẩm hạnh theo phạm vi cũ.
- **Phu Cơ–Âm Dần: PDF210§14.6/211§14.8.** Giữ trở ngại cưới hỏi và có tài; lời tránh bất hòa/xa cách gắn muộn vẫn là điều kiện chưa xác định, không dự báo chia ly vô điều kiện.
- **Phu Nhật–Lương Dậu: PDF212§14.12.** Trắc trở cưới xin là vế riêng; tránh chẳng lành có muộn/mới, giữ bên cạnh và chưa áp kết quả. Không dùng nhánh Nhật đơn thủ để tự cho cặp khớp.
- **Phu Sát đơn Dần/Thân và Tý/Ngọ: PDF213§14.13.** Dần/Thân giữ cả hai cương cường. Tý/Ngọ dẫn “cũng như trên”, thêm hay bất hòa; vế chia ly chỉ dưới “nếu sớm lập gia đình”, giữ nguyên và không xác nhận đã thỏa. Không xuất ghen tuông/thứ bậc, không chuyển lời khuyên muộn thành kết luận hại.
- **Phu Liêm–Phủ: PDF208§14.2/210§14.7.** Câu riêng cương cường nhưng sống lâu bền; câu gia đình sung túc/thường có danh giá. Giữ rõ nguồn đặt sau lời khuyên muộn. Nguồn không viết “như thế mới” như Tử–Sát; không thêm gate tuổi, không coi lời khuyên đã thực hiện hoặc bảo đảm kết quả thực tế.
- **Phu Vũ đơn Thìn/Tuất, hai giới: PDF209§14.4.** Câu riêng nam nhờ vợ có tiền/nữ nhờ chồng hưởng giàu sang; lời khuyên muộn/bằng hoặc gần tuổi ở câu trước vẫn được nêu là chưa áp, không đặt tuổi. Không tự giả định đã có người phối ngẫu.
- **Phu Liêm–Sát: PDF209§14.2/213§14.13.** Nguồn trực tiếp nói hình khắc *hay* sinh ly trước lời khuyên muộn. Giữ phép “hoặc”, không đổi hình khắc thành bệnh/tử vong, không tuyên bố người đọc sẽ ly hôn hoặc đã tránh hại.
- **Phu Tướng đơn Tỵ/Hợi/Sửu/Mùi, hai giới: PDF212§14.11.** Hai câu riêng về vợ có tài/khá giả, chồng có danh chức/giỏi giang; không lấy câu khuyên muộn làm điều kiện nguồn của hai câu mô tả. Văn khách giữ các yếu tố muộn/chênh tuổi/họ xa chưa xét; không phát biểu đã tránh bất hòa hoặc đủ họ xa để tốt đôi. Loại nhan sắc, không xác nhận năng lực/tài sản thực tế.

Mọi nhánh tọa thủ giữ exact đúng bộ chính tinh, đúng chi và giới nếu có; chứng nhận thiếu/sao lưu không kích hoạt. Không thêm điều kiện vắng TT. Cổng nguồn không rõ vẫn giữ riêng; đây không phải bỏ toàn bộ cổng bảo thủ.

### Năm nhóm quyết định còn chặn — khép lô1.56.0

Chỉ tổng hợp kết quả audit/đặc tả đã có; không mở lại PDF, không suy thêm điều kiện. Số hiện hành của bộ192: Tử93 cung trống, Phu51. Các nhóm dưới có thể giao nhau; số cấu trúc bị ảnh hưởng không phải số cung chắc chắn sẽ được lấp.

**1. Khi nguồn viết “nếu/mới”, phải biết điều kiện thời gian nào đã thỏa? — ND12/13**

- **Câu và chỗ chưa rõ:** Tướng/Tử201§13.3.11: “Nếu muộn sinh mới dễ nuôi và sau này con mới khá giả”; Cơ–Cự/Tử200 cũng gắn khá giả với muộn sinh. Đồng/Phu Mão209 có “chậm cưới mới…”; Tử–Sát/Phu208/213 có “tiên trở hậu thành mới…” và “như thế mới…”. Chưa có định nghĩa đủ để kiểm sớm/muộn, tiên trở hậu thành, dữ kiện cần biết hoặc phạm vi kết quả chịu điều kiện. Không đồng nhất các câu này với mô tả “lấy nhau sớm” đã triển khai.
- **Loại:** thiếu cách áp dụng nguồn; không phải chủ dự án tùy chọn một tuổi. Với câu có sinh sản/khó nuôi còn có giới hạn sản phẩm, tách ở nhóm5.
- **Cách xử lý và đề xuất:** giữ kết quả có điều kiện chưa áp dụng; chỉ thực thi khi người thẩm định cung cấp định nghĩa có địa chỉ nguồn, dữ kiện cần kiểm và bảng trường hợp đạt/không đạt/chưa biết. Có thể thẩm định một chú giải giữ nguyên “nếu…” mà không khẳng định hồ sơ thỏa điều kiện, nhưng không tính đó là dự báo cá nhân đã áp dụng. **Đề xuất giữ chưa áp cho lô này**, không tự đặt mốc tuổi hay thu thêm tuổi kết hôn khi chưa biết dữ kiện đó có đủ không.
- **Ảnh hưởng:** Tử Tướng, Cơ–Cự, Nhật–Cự Thân, Nhật–Lương Dậu; Phu Đồng Mão, Đồng–Âm Ngọ, Nhật–Cự Thân, Tử–Sát; các vế gắn điều kiện của Cơ–Cự, Nhật–Nguyệt, Vũ–Tham/Vũ–Phá, Phá Tý/Ngọ. Đã có số **10 cung Tử có Thiên Tướng còn trống**, nhưng chưa tách bao nhiêu thuộc riêng Mão/Dậu; không gán cả10 cho điều kiện muộn.
- **Người quyết định:** người thẩm định chốt nghĩa/điều kiện nguồn. Chủ dự án chỉ quyết định có phục vụ chú giải có điều kiện chưa áp dụng hay không, sau khi có mẫu được thẩm định; không quyết định tuổi thay chuyên môn.

**2. Với VCD, được dùng lời nào và lấy điều kiện ở cung nào? — ND04**

- **Câu và chỗ chưa rõ:** Tử207§13.3.68: “Coi Chính diệu xung chiếu như Chính diệu tọa thủ”. Các câu không phụ thuộc chi/trạng thái đã có hợp đồng riêng và đã triển khai. Với phần còn lại, chưa rõ địa chi/trạng thái lấy ở cung cho hay cung nhận, cùng phạm vi ngoại lệ. Phu chưa có hợp đồng riêng đủ căn cứ; không lấy câu Tử để áp sang Phu.
- **Loại:** thiếu cách áp dụng nguồn, không phải thiếu thao tác chuyển sao trong code.
- **Cách xử lý và đề xuất:** tiếp tục giữ ngoài nhánh áp dụng những câu còn phụ thuộc chi/trạng thái; chỉ mở từng tập con khi người thẩm định chỉ rõ câu cung nhận, sao được xét, nơi lấy trạng thái và nơi áp ngoại lệ. **Đề xuất giữ các tập con đã triển khai và chặn phần chưa có hợp đồng**; không dựng cung giả hoặc chuyển toàn bộ catalog đối cung.
- **Ảnh hưởng:** các cấu trúc Tử VCD còn thiếu và **21 cung Phu VCD còn trống trong192**. Không có số đã xác nhận cho riêng tập con Tử phụ thuộc trạng thái sẽ được giải. Liêm–Phá/TửVCD đã có code nhưng chưa có chứng kiến engine; đó là giới hạn bằng chứng kiểm, không phải rule còn chờ triển khai.
- **Người quyết định:** người thẩm định xác lập hợp đồng nguồn; chủ dự án không tự chọn địa chi hoặc trạng thái sao.

**3. Một sao, cả bộ hay “nhiều” sao; ngoại lệ tác động tới vế nào? — ND12/13**

- **Câu và chỗ chưa rõ:** Tử205§13.3.45 dưới tiêu đề “Tuần, Triệt án ngữ” có lời con về sau xung khắc, không chung một nhà; chưa rõ một hay cả hai sao và phạm vi tác động. Phu215§14.30 ghi “Cô, Quả” với lời bất hòa/xa cách; các mục dùng “nhiều sao sáng sủa tốt đẹp” hoặc “nhiều sao mờ ám xấu xa” chưa có tập sao, lượng từ và vị trí đủ rõ. “Lộc” trong tổ hợp ở216 chưa xác định là sao nào. Lộc Tồn/Tử203 có ngoại lệ về khả năng có con, nên không tách lời quan hệ như ngoại lệ đã được xét.
- **Loại:** thiếu cách áp dụng nguồn; không phải lựa chọn sản phẩm giữa AND và OR.
- **Cách xử lý và đề xuất:** chỉ thực thi khi có bảng điều kiện được thẩm định cho đúng mục: danh tính sao, một/cả bộ, quan hệ vị trí, cách xác định sáng/mờ và vế bị điều chỉnh. **Đề xuất giữ các nhóm này chưa áp dụng**; không lấy cách viết của một mục khác hoặc số lần xuất hiện trong192 để đoán toán tử/ngưỡng. Nếu chưa có bảng đó, không có phương án coding hợp lệ để chọn.
- **Ảnh hưởng:** Tử TT, Kình–Đà–Không–Kiếp, Hỏa–Linh, Xương–Khúc, Đẩu Quân, Khốc–Hư, Lộc Tồn; Phu Xương–Khúc, Khôi–Việt, Quang–Quý, Cô–Quả, Cự–Hỏa–Linh, Song Hao và các tổ hợp Lộc. **Chưa có số mẫu tách riêng đáng tin cậy cho từng điều kiện chưa định nghĩa**; không cộng toàn bộ93/51 cung trống vào nhóm này.
- **Người quyết định:** người thẩm định. Chủ dự án không được yêu cầu chọn AND/OR, ngưỡng “nhiều” hoặc tập cung thay bằng chứng nguồn.

**4. Hai chỗ văn bản dẫn tới lời khác chiều xử lý thế nào? — ND13**

- **Câu và chỗ chưa rõ:** Đồng–Âm tại Tý dùng “cũng như trên” ở209§14.3 và211§14.8, nhưng các đoạn được dẫn có nội dung khác chiều. Lương/Phu212§14.12 ghi “đơn thủ tại Tỵ, Ngọ” với lời sớm/dễ dàng/quý hiển, rồi “đơn thủ tại Tỵ, Hợi” với lời dễ gặp/dễ xa; Tỵ nằm ở cả hai dòng.
- **Loại:** bất nhất văn bản/tham chiếu, không phải thiếu thuật toán chọn lời thắng.
- **Cách xử lý và đề xuất:** (a) giữ riêng hai chỗ chưa áp; (b) thay bằng cách đọc đã có bằng chứng đính chính được thẩm định; hoặc (c) trình bày cả hai như chú giải xung đột, nếu được duyệt về chuyên môn và phạm vi hiển thị, không hợp thành kết luận cá nhân. **Đề xuất(a)**. Không tự sửa Tỵ thành Tý, không chọn lời theo kết quả engine.
- **Ảnh hưởng:** Đồng–Âm/Tý và Lương/Tỵ ở Phu. Lương/Ngọ và Lương/Hợi đã được xử lý riêng, không chặn lại. Hồ sơ bàn giao **chưa có số tách riêng cho đúng hai cấu trúc bất nhất**; không dùng tổng ca Lương hoặc Đồng–Âm để thay thế.
- **Người quyết định:** người thẩm định xác nhận cách đọc/đính chính. Chủ dự án chỉ quyết định có cho hiển thị chú giải xung đột đã được thẩm định hay không.

**5. Phần bị loại là phạm vi sản phẩm hay lời chưa tách được khỏi điều kiện? — ND12/13/19**

- **Câu và chỗ chưa rõ:** Liêm–Tướng/Tử199 có “khó nuôi nhưng lớn lên…”; Sát/Tử202 có “dù sinh nhiều…chỉ còn…nhưng…”. Chưa xác nhận có thể lấy riêng vế thuận mà giữ nghĩa. Các mục chỉ số con, thứ bậc, “quý tử”, số lần hôn nhân và các câu về đặc tính con (Hóa Quyền/Khoa/Hồng Loan) bị loại theo phạm vi audit; có câu đã rõ nội dung đơn lẻ nhưng chưa được cho phép vào sản phẩm hiện hành.
- **Loại:** hai lớp cần phân biệt: **thiếu cách áp dụng/tách nghĩa** ở câu ghép; **giới hạn sản phẩm tự đặt** ở số lượng/thứ bậc/quý tử/đặc tính con. Cấm bệnh/sinh tử/quy kết phẩm hạnh đang có hiệu lực, không gộp vào một câu hỏi xin mở tất cả.
- **Cách xử lý và đề xuất:** chủ dự án có thể giữ phạm vi hiện hành hoặc cho thẩm định riêng từng loại phi sức khỏe, trước hết các câu độc lập về đặc tính con; việc cho thẩm định không đồng nghĩa cho phát hành. Người thẩm định phải xác định nghĩa “quý tử”, tính độc lập của vế thuận và điều kiện còn phải giữ. **Đề xuất giữ phạm vi hiện hành để khép1.56; nếu mở bước sau, duyệt danh sách loại cụ thể và mẫu văn trước**, không cho phép lấy riêng vế thuận bằng quyết định thương mại.
- **Ảnh hưởng:** Tử Liêm–Tướng, Vũ đơn, Sát Dần/Thân; các nhánh chỉ số lượng/quý tử và Hóa Quyền/Khoa/Hồng Loan. Phu gồm các nhánh chỉ số lần hôn nhân hoặc gắn nội dung đang loại trừ như Cự thấp, Liêm đơn, một số Phá/Sát. **Chưa có số giảm cung trống được chứng minh cho một lựa chọn phạm vi**; mở phạm vi không tự giải lượng từ, điều kiện hoặc bất nhất của bốn nhóm trước.
- **Người quyết định:** chủ dự án quyết định loại nội dung được thẩm định/đưa vào sản phẩm; người thẩm định quyết định nghĩa và khả năng tách câu. Không ai được coi việc chọn phạm vi là bằng chứng nguồn đã rõ.

### Xác nhận phần triển khai còn lại

**Không còn nhóm đủ đặc tả, thuộc phạm vi sản phẩm hiện hành, nhưng chưa triển khai trong phần Tử–Phu đã rà của lô1.56.0. Phần triển khai được đã hết trong phạm vi này.** Đây là kết luận theo hồ sơ lô đã có, không phải một đợt audit/code/test mới và không tuyên bố đã khai thác hết sách.

Hai nhánh mới Nhật–Lương Dậu/Phu và Liêm–Phá/TửVCD đã có code; còn thiếu chứng kiến engine ngoài fixture. Các câu chỉ đặc tính/số lượng bị loại thuộc câu hỏi phạm vi ở nhóm5, không được ghi thành hàng đợi coding đã được phép. ND04/12/13 còn mở ở mức điều kiện/bằng chứng; ND19 còn mở ở mức phạm vi. Các phương án đề xuất ở trên chưa phải quyết định được duyệt.

### Gói bốn mẫu để duyệt — chưa triển khai hoặc publish

Chuẩn bị từ hồ sơ đã audit tại `.local/phu-tu-20261013/matrix.json` (§14.3, §13.3.23, §13.3.44) và kết luận lô1.56; không đọc lại PDF/chương. Đây là đề xuất văn và phạm vi, chưa phải phê duyệt chuyên môn, rule mới hoặc lời đã áp cho hồ sơ khách. Hai mẫu đầu chỉ đề xuất cách trình bày nhận định có điều kiện trong chủ đề quan hệ hiện hành; không xác nhận điều kiện đã thỏa. Hai mẫu cuối xin phép bổ sung đúng loại đặc tính được nêu, chưa mở phạm vi khi chưa duyệt.

**Mẫu 1 — Nhận định có điều kiện: Đồng tại Mão**

- **Cấu trúc áp dụng:** Phu Thê có Thiên Đồng bản mệnh đơn thủ tại Mão; không áp sang Đồng–Âm hoặc các chi khác.
- **Câu nguồn và trang:** Tân Biên PDF209, §14.3, trích phần quan hệ: “chậm cưới mới được dễ dàng mọi sự và chung sống với nhau đến lúc bạc đầu”. Phần nhan sắc/phẩm hạnh và chỉ dẫn ở sau không nằm trong mẫu đề xuất.
- **Văn khách hàng đề xuất:** “Với Thiên Đồng đơn thủ tại Mão ở cung Phu Thê, nguồn luận đặt điều kiện ‘chậm cưới’ trước nhận định về sự thuận lợi trong hôn nhân và chung sống lâu bền: chậm cưới mới có lời luận thuận này. Bản đọc chưa xác định ‘chậm cưới’ ứng với hoàn cảnh của bạn, nên chưa kết luận điều kiện đã thỏa hoặc hôn nhân sẽ lâu bền.”
- **Đã biết / chưa biết / không được kết luận:** đã rõ cấu trúc và sự ràng buộc bằng chữ ‘mới’; chưa có định nghĩa vận dụng ‘chậm cưới’ và chưa biết hoàn cảnh thực tế. Mẫu không xác nhận khách đã kết hôn, không đặt tuổi, không khuyên cưới muộn, không suy cưới sớm tất bất lợi và không bảo đảm kết quả ngay cả khi sau này xác định được điều kiện.

**Mẫu 2 — Nhận định có điều kiện: Đồng–Âm tại Ngọ**

- **Cấu trúc áp dụng:** Phu Thê có Thiên Đồng và Thái Âm bản mệnh đồng cung tại Ngọ; không áp sang Đồng–Âm tại Tý đang bất nhất.
- **Câu nguồn và trang:** Tân Biên PDF209, §14.3: “Nguyệt đồng cung tại Ngọ: muộn lập gia đình mới tránh được chia ly.”
- **Văn khách hàng đề xuất:** “Với Thiên Đồng và Thái Âm đồng cung tại Ngọ ở cung Phu Thê, nguồn luận chỉ nêu khả năng tránh chia ly trong điều kiện ‘muộn lập gia đình’. Điều kiện này chưa được xác định đối với bạn, vì vậy bản đọc chưa kết luận rằng bạn đã tránh được chia ly. Đây là nhận định có điều kiện của nguồn, không phải lời khuyên về thời điểm kết hôn.”
- **Đã biết / chưa biết / không được kết luận:** đã rõ đúng cặp sao, chi Ngọ và điều kiện ‘muộn…mới’; chưa có định nghĩa vận dụng ‘muộn’ hoặc xác nhận hoàn cảnh khách. Mẫu không đặt tuổi, không kết luận khách sẽ chia ly nếu kết hôn sớm, không hứa kết hôn muộn sẽ bảo đảm bền lâu và không xác nhận tình trạng hôn nhân.

**Mẫu 3 — Đặc tính con: trí thông minh**

- **Cấu trúc áp dụng:** Hóa Khoa bản mệnh tọa Tử Nữ; không tự mở sang xung chiếu/hội chiếu hoặc sao lưu. Câu nguồn không đặt điều kiện chính tinh đơn thủ hay địa chi.
- **Câu nguồn và trang:** Tân Biên PDF203, §13.3.23, Hóa Khoa: “Con thông minh.” Ma trận ghi câu độc lập, bị loại vì ngoài phạm vi biên tập gói quan hệ.
- **Văn khách hàng đề xuất:** “Hóa Khoa tại cung Tử Nữ được nguồn luận gắn với nét thông minh của con. Đây là mô tả theo cấu trúc lá số, chưa phải đánh giá trí thông minh của một người con cụ thể.”
- **Đã biết / chưa biết / không được kết luận:** đã rõ sao, cung và nội dung độc lập; chưa biết năng lực thực tế của con, chưa có quyết định cho phép loại nội dung này. Mẫu không xác nhận khách có con, không suy mọi người con đều như vậy, không suy điểm số, thành tích, nghề nghiệp hoặc thời điểm thành công.
- **Phạm vi xin chủ dự án cho phép:** nhận định truyền thống về **đặc tính trí thông minh của con**, với giới hạn như văn mẫu; không phải đo lường hay xếp hạng trí tuệ.

**Mẫu 4 — Đặc tính con: khéo tay**

- **Cấu trúc áp dụng:** Hồng Loan bản mệnh tọa Tử Nữ; không tự mở sang xung chiếu/hội chiếu hoặc sao lưu. Câu nguồn không đặt điều kiện chính tinh đơn thủ hay địa chi.
- **Câu nguồn và trang:** Tân Biên PDF205, §13.3.44, Hồng Loan: “Con khéo tay.” Ma trận ghi câu độc lập, bị loại vì ngoài phạm vi biên tập gói quan hệ.
- **Văn khách hàng đề xuất:** “Hồng Loan tại cung Tử Nữ được nguồn luận gắn với nét khéo tay của con. Đây là mô tả theo cấu trúc lá số, chưa xác nhận kỹ năng thực tế của một người con cụ thể.”
- **Đã biết / chưa biết / không được kết luận:** đã rõ sao, cung và nội dung độc lập; chưa biết kỹ năng thực tế của con, chưa có quyết định cho phép loại nội dung này. Mẫu không xác nhận khách có con, không suy mọi người con đều như vậy, không suy nghề thủ công, năng khiếu nghệ thuật hoặc thành công nghề nghiệp.
- **Phạm vi xin chủ dự án cho phép:** nhận định truyền thống về **đặc tính khéo tay của con**, với giới hạn như văn mẫu; không mở sang dự báo nghề nghiệp.

Chỉ xin duyệt văn mẫu1–2 và hai loại nội dung cụ thể ở mẫu3–4. Không gộp số con, thứ bậc, bệnh, sinh tử hoặc quy kết phẩm hạnh vào đề xuất. Không chọn Hóa Quyền vì ‘con sớm hiển đạt’ còn là nhận định thành tựu/thời gian, vượt hai đặc tính hẹp đang xin duyệt. Duyệt văn không xác lập định nghĩa ‘chậm/muộn’ hoặc chứng minh điều kiện đã thỏa; duyệt phạm vi không tự cấp phép publish. Cả bốn mẫu chưa vào code, không tính lấp cung trống/hoàn chỉnh cung; số đã kiểm vẫn Tử93 và Phu51 trống trên192. ND12/13/19 giữ trạng thái chờ quyết định tương ứng; không tạo backlog mới.

### Kết quả kỹ thuật

So192 với bản1.55.1: Tử trống97→93 (4 mới/5 bổ sung); Phu67→51 (16 mới/12 bổ sung);37snapshot có37claim mới. Mười cung khác và tất cả claims/facts/traces/relations/văn cũ giữ nguyên, G2 bằng nhau. 13/16 nhánh mới có mẫu trong192; hai đầu vào mới có chủ đích (không quét): nữ06/08/1983 giờSửu chứng kiến thêm Vũ/Phu nữ; nam06/08/1988 giờTỵ chứng kiến TửVCD Liêm–Tham. Còn Nhật–Lương Dậu/Phu và Liêm–Phá/TửVCD chỉ fixture, chưa chứng kiến engine; bốn nhánh VCD cũ chưa có engine vẫn giữ trạng thái cũ.

Bằng chứng, bài đầy đủ và kiểm thực thi ở `.local/kin-batch-20261021/`; không đưa dữ liệu riêng vào Git. Backlog duy nhất là ND04/12/13/19 trong V1-DELIVERY-PLAN, không coi phụ lục này là backlog mới.

## Bốn nội dung đã duyệt — 1.57.0/catalog1.54.0, 21/10/2026

Yêu cầu trực tiếp tiếp nối gói bốn mẫu đã duyệt triển khai cả bốn, cho biên tập gọn và đưa vào luồng khách; thay trạng thái “chưa duyệt/chưa triển khai” của gói mẫu ở trên đối với đúng bốn nội dung. Không mở các loại khác. Đây là duyệt phạm vi/văn, không phải xác nhận điều kiện thời gian hoặc phê duyệt chuyên môn toàn catalog.

Code `3bff73c`, baseline `0613901` sạch. `kin-approved.ts` dùng lại `kinAssessment/makeKinRule`, catalog/derived, continuous/customer renderer, frozen store và G2 chung. Hai nhánh Phu chỉ khớp cấu trúc để chọn chú giải; lưu `conditionalAssessment: {condition, status: "unknown", outcomeApplied: false}` trong rule và đoạn khách. Không tính tuổi, hỏi thêm, suy kết quả ngược hoặc cho điều kiện đã thỏa. Tiêu đề khách/PDF: “Chú giải có điều kiện — chưa xác định”. Hai nhánh Tử giữ riêng thông minh/khéo tay; không mở Hóa Quyền, số lượng, sinh tử, phẩm hạnh hoặc nghề nghiệp. Chỉ dùng hồ sơ audit sẵn có, không đọc lại chương.

**Toàn văn phục vụ:**

- **Đồng/Mão — Phu, TB209§14.3:** Thiên Đồng đơn thủ tại Mão ở Phu Thê có lời luận: chậm cưới mới thuận lợi trong hôn nhân và chung sống lâu bền. “Chậm cưới” chưa được xác định đối với bạn; đây là chú giải có điều kiện, chưa kết luận hôn nhân sẽ lâu bền và không phải lời khuyên cưới muộn.
- **Đồng–Âm/Ngọ — Phu, TB209§14.3:** Thiên Đồng–Thái Âm đồng cung tại Ngọ ở Phu Thê có lời luận: muộn lập gia đình mới tránh được chia ly. Điều kiện “muộn lập gia đình” chưa được xác định đối với bạn, nên chưa kết luận bạn đã tránh được chia ly. Đây không phải lời khuyên về thời điểm kết hôn, cũng không có nghĩa kết hôn sớm sẽ chia ly.
- **Hóa Khoa — Tử, TB203§13.3.23:** Hóa Khoa tại cung Tử Nữ được nguồn luận gắn với nét thông minh của con. Đây là mô tả theo cấu trúc lá số, chưa phải đánh giá trí thông minh của một người con cụ thể.
- **Hồng Loan — Tử, TB205§13.3.44:** Hồng Loan tại cung Tử Nữ được nguồn luận gắn với nét khéo tay của con. Đây là mô tả theo cấu trúc lá số, chưa xác nhận kỹ năng thực tế của một người con cụ thể.

**Trước/sau bộ192:** Tử93→76 cung chưa có nhận định:17 mới có nhận định,22 đã có được bổ sung. Phu51 cung chưa có nhận định vẫn là51: trong đó2 nay chỉ có chú giải có điều kiện và49 chưa có cả chú giải. Không gọi2 chú giải là2 kết quả đã áp dụng hoặc cộng17+2 thành cung hoàn chỉnh.41 snapshot đổi,41 đoạn mới (Khoa23, Hồng Loan16, Đồng1, Đồng–Âm1); không mẫu trùng hai nhánh mới trong bộ này. Mười cung khác, mọi facts/rules/traces/claims/văn/relations cũ và policy G2 bằng baseline. Bốn nhánh đều có engine witness192; fixture kỹ thuật chỉ kiểm phản ví dụ, không thay chứng kiến engine.

**Tự tạo trên luồng khách QA3062:** mở `/lap-la-so`, chọn Dương lịch, giờTỵ09:00–10:59 trừ mẫu Khoa dùng giờSửu01:00–02:59; nơi sinh mặc định, UTC+7. Nữ06/11/1993: Đồng/Mão; nữ06/02/2013: Đồng–Âm/Ngọ; nam06/02/1978 giờSửu: Hóa Khoa/Tử; nam18/05/1978 giờTỵ: Hồng Loan/Tử. Bấm “Lập lá số” (nhãn nút thực tế) để tạo bản đọc mới. Hai cung vẫn theo quyền G2: cần quyền chi tiết để xem; không gửi lời khóa trong bản miễn phí. Không đổi quyền hoặc cập nhật bản cũ để xem nội dung mới.

**Kiểm:**447/447 tại6file nội dung; G2 riêng6/6; PDFmock6/6; typecheck/build đạt. Bốn mẫu engine qua form→lưu→mở lại, mobile360/390, căn cứ, freePDF403 và chéo đọc/PDF404. Full grant là bốn đơn mock trong DB QA3083 riêng, không phải SePay thật. PDF đại diện Đồng/Mão8trang/17đoạn khớp frozen, đã kiểm ảnh đủ8trang và trang nội dung mới. Lỗi công cụ: runtimePython không có fitz; dùng Poppler/pypdf sẵn có, không sửa ứng dụng hoặc rerun test vì lỗi này. Không có test fail/skip trong tập đã chạy; không chạy toàn gate hoặc provider thật.

QA3062 đã phục vụ checkout `.local/kin-approved-20261021/qa-final`, web72303/worker72307;4bản mới qua form trên QA chính đúng1.57/catalog1.54, free/reload/G2 đạt, không tạo đơn mock ở QA chính. DB/kho giữ nguyên;181file lịch sử/phiên/code được chụp giữ hash; quyền/binding/link và34bài công khai giữ nguyên. QA3070 PID94421 không đổi; Livefalse. Bằng chứng/bản trước-sau ở `.local/kin-approved-20261021/`. Không nghiệm thu lại tunnel/Google/SePay/SMTP.


## Rà cổng Nô–Tử22/10/2026 — dừng, không có tập con mới đủ căn cứ

Nối `main@c5fe112` sạch; bản khách1.64.1/catalog1.60. Đã tra toàn ma trận mục13 và kho chữTB198–207, đối chiếu code `phu-tu`, `kin-extension`, `kin-approved`, `children-vcd`; các nhãn cũ như Khoa/Hồng “chưa dùng”, Liêm–Phá/Tham hoặc Đồng/Lương “chưa tách” đã bị lô sau thay thế, không dùng để tạo rule lần nữa. Rà lần này không mở sách mới hoặc kiểm ảnh lại vì không có nghi vấn OCR cần giải. [192dựng lại khớp sâu](../.local/no-tu-clause-review-20261022/verification192.json), [toàn đoạn trước=sau](../.local/no-tu-clause-review-20261022/full-before-after.txt).

1. **§13.3.45 TT,205:** vế “sau này con cái hay xung khắc với cha mẹ và không thể chung sống cùng một nhà được” có thể phân biệt với khó nuôi đầu lòng và hai gạch tăng/giảm số con. Hai gạch sau chỉ đích **số con**, không có căn cứ gọi chúng là phép đảo mọi quan hệ. Tuy vậy điều kiện đầu “Tuần, Triệt án ngữ” cho lời quan hệ chưa giải một hay cả hai. Không lấy OR ởNô hoặc Phụ làm chứng cứ choTử; cũng không tự chọn AND rồi gọi là tập con chắc chắn. Có vế quan hệ độc lập về phương diện, **chưa đủ điều kiện kích hoạt**. Giữ chưa triển khai câu này; không chặn thêm mọi lờiTử cóTT.
2. **Tướng Mão/Dậu§13.3.11,201–202 và Cơ–Cự§13.3.6,201:** “nếu muộn sinh mới dễ nuôi…con mới khá giả” giữ liên kết điều kiện với khá giả. Tách vật chất ra sẽ làm mất “mới”. Tướng Tỵ/Hợi/Sửu/Mùi và Cơ đơn chỉ còn số lượng; không có lời quan hệ độc lập để bổ sung.
3. **Nhật–Cự Thân§13.2.5,200:** câu “Con sinh sau đẻ muộn lại rất quý hiển” còn xác định đối tượng sinh sau/đẻ muộn. Không bỏ đối tượng đó để dự báo mọi con hiển đạt. Nhật–Lương Dậu200/202 chỉ nói muộn mới có số con, sớm khó nuôi/khổ vì con; không đổi lời tránh hại thành kết quả thuận chắc chắn. Nhật thấp/Vũ–Tham cũng còn muộn–dễ nuôi và số con, không có nhận định quan hệ mới trong phạm vi.
4. **Liêm–Tướng199, Vũ đơnThìn/Tuất200, Sát Dần/Thân202:** “khó nuôi nhưng lớn lên…”, “sinh nhiều nuôi ít…chỉ có một con nhưng…”, “dù…chỉ còn hai con nhưng…” gắn vế hiển đạt/khá giả với đối tượng và quá trình còn lại. Không lấy riêng vế thuận để mở đối tượng mọi con hoặc giấu quá trình sinh tử. Liêm–Sát/Vũ–Sát199–202 và PháDần/Thân202 còn hình khắc trong ngữ cảnh nuôi/sốcon; chưa chứng minh đó là xung khắc quan hệ thay vì mấtcon. Không tạo lời nhẹ hơn.
5. **Các câu độc lập đã có:** TửNgọ/Tý/Tử–Sát/Tử–Phá; Liêm–Phủ/Phá/Tham; Đồng–Cự và Đồng/LươngTỵ/Hợi; Vũ–Phủ; Nhật cao/Nhật–CựDần/Nhật–LươngMão; Cơ–Lương; ÂmMão/Thìn/Tỵ; ThamThìn/Tuất/Dần/Thân; Cựcao/thấp; PháTý/Ngọ/Thìn/Tuất. Kỵ204 đã giữ riêng xung khắc, không giữ muộn/khó nuôi; HóaLộc203 đã giữ khá giả/nhờcon. Vế “nếu có con” củaTử vòngTràngSinh204 vẫn là giới hạn đối tượng, không xác nhận cócon. Không phục hồi cổngTT hàng loạt hoặc tạo bản sao những câu này.
6. **LộcTồn§13.3.20,203:** câu bất hòa/thường xa cha mẹ tách được khỏi giảm hai con và muộn tốt hơn sớm về cú pháp. Nhưng ngoại lệ “Nếu Lộc gặp thêm nhiều sao mờ…tuyệt dòng dõi” còn khả năng làm mất chính đối tượng con; chưa định nghĩa tập/ngưỡng/vị trí để biết ngoại lệ không xảy ra. Không gọi vế quan hệ độc lập với ngoại lệ chỉ vì khác câu; không dùng cảnh báo chung thay kiểm điều kiện.
7. **Nhóm§13.3.14 Kình–Đà–Không–Kiếp;16Hỏa–Linh;17Xương–Khúc;26ĐẩuQuân:** vế khágiả/bấthòa/thôngminh/hiểnđạt còn nằm dưới nhiều/sáng–mờ. Phạm vi đã duyệt nét thôngminh của **HóaKhoa** không tự cho phép Xương–Khúc khi chưa giải điều kiện riêng. Khốc–Hư39, SongHao40, Lương–Khốc–Tuế55 còn lượng từ/vị trí; riêng SongHao không tự áp “hay” ở mụcMệnh vàoTử. Không đổi chơi bời/phá tán thành lời xa cách chung rồi bỏ điều kiện.
8. **§13.3.18Khôi–Việt,19Tả–Hữu,25Cô–Quả,27–31/33–38,41–43,46–54,56–67 và§13.1:** còn sốlượng/giớitính/sinhsản/nhậnnuôi/phẩmhạnh/thầnnhân hoặc danh tính nhóm chưa rõ. “Đồng, Đức”46 chưa định danhĐức; Quang–Quý38 còn đối tượng connuôi và phẩmhạnh. Không tách hiếuthảo/đẹp/quýtử/thầnđồng để suy thêm nét con. HóaQuyền22 “sớm hiểnđạt” chưa được mở riêng bằng duyệtKhoa/Hồng; Khoa23/Hồng44 đã có, không nhân đôi. Tử–Phủ/Tử–Tướng/Tử–Tham, Phủ/Lươngđơn và các nhánh chỉquýtử/sốcon không thêm câu quan hệ. Phần dẫn lại sao khác không thành claimmới.
9. **VCD§13.3.68,207:** tám cặp không phụ thuộc chi/trạng thái đã có trong evaluator chung. Cặp còn lại phụ thuộc chi/đối tượng muộn/quýtử hoặc chỉ có sốcon; chưa có hợp đồng cungcho/nhận đủ cho từng câu. Không lấy phương phápPhụ–Điền làm phép mượnTử hoặc chuyển lờiĐiền. Bốn cặp Tử–Sát/Tử–Phá/Liêm–Phủ/Vũ–Phủ và Liêm–PháVCD vẫn chỉ có fixture theo tìmkiếm lịch sử; không có lượt tìm engine/E2E mới xác nhận chúng trong phiên này. Không gặp192 không có nghĩa bấtkhảđạt.

**Phân loại cổng:** “nếu/mới”, đối tượng sinhmuộn, tập nhiều/sáng–mờ và vịtrí là điều kiện nguồn cần giữ. Những mục loại sốcon/phẩmhạnh/quýtử… thuộc phạmvi sản phẩm đang áp dụng; thiếu phép giải lượng từ không phải quyền tùy chọn AND/OR. Tử hiện không có cổng vắngTT toàn hàng nhưPhụ. Kết luận mới là xác định rõ vếquan hệTT tách khỏi tăng/giảmsốcon **chưa đủ** để mởrule, không khẳngđịnh mọi lờiTử chịu đảoTT.

**Kết quả hữu hạn:**0điều kiện được giải đủ đểcode,0cổngthu hẹp,0Tử mới có nhậnđịnh/0bổsung;76/192thiếu giữ nguyên.192reading/continuous/customer/G2khớp sâu baseline; không sửa vănkhách, không thêm chúgiải chung. Không tuyênbố hết sách hoặc hoànchỉnhcung. Không đổi ứngdụng nên không chạy build/testDB/mobile/PDF lại; bằngchứng cũ không gọi là nghiệmthumới. Dừng đúng yêu cầu nếu không còn vế đủ căn cứ.
