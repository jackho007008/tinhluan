# Gói Nô Bộc – Điền Trạch 1.31.0

Xác minh văn bản, không phải phê duyệt chuyên môn. Rule draft, review=null.

## Phạm vi và nguồn
Tân Biên đọc toàn PDF149–157 (§7), 168–173 (§9), đối chiếu ảnh toàn các trang. Rà lại PDF132–141 và174–180 cho102 nhánh Phúc/Di; định nghĩa PDF33. Tái sử dụng hồ sơ 1.30 cho các đoạn đã xác minh; không tuyên bố đọc lại toàn sách. PDF149–157/168–173 trùng số trang in ở bản này.
Thiên Lương bản298 trang: PDF86–87,104–105,117,155–159. Xem ảnh86 và155–159. Bốn ví dụ1,5,7,11 được dùng nguyên cấu trúc ba cung, không ghép bảng nhóm Tân Biên. Trạng thái của ví dụ là cách nguồn mô tả vị trí, không thay bảng trạng thái snapshot. Các ví dụ khác có phối hợp với Phối/Di, nhóm chiếu hoặc nhận định phẩm hạnh chưa đủ đặc tả toàn bộ, không tách vế thuận lợi.
Nguyễn Phát Lộc: PDF43–44 và223–226; ảnh43,44,224,225. Phạm vi Nô gồm nhiều loại quan hệ, không có sao chỉ danh người cụ thể. PDF225 phản đối phép nghịch đảo tuyệt đối của Tuần/Triệt: lưu xung đột với Tân Biên§7.32, không tự ưu tiên nguồn mới. Không áp số lượng nhà, số tiền, bệnh tật, cái chết, ma quái hoặc cáo buộc người xung quanh.

## Điều kiện thực thi
Điền: đúng cung bản mệnh; danh sách14 chính tinh/12 cung hợp lệ và complete; đúng một chính tinh khi sách ghi đơn thủ, đúng bộ khi đồng cung, đúng nhóm địa chi. Không suy trạng thái từ brightness engine. Các địa chi được nguồn nêu đã trực tiếp là điều kiện. Không mở sang địa chi khác.
Các phụ tinh chỉ dùng bằng chứng origin. Phủ định cần danh sách đầy đủ; Hóa Kỵ/Quyền dùng verifiedNatalTransformations hiện có. Tướng Quân đọc vòng boshi12 đúng snapshot; âm tính cần đủ12 nhãn vòng hợp lệ, không suy từ tên thiếu.
Tuần/Triệt: hai cặp đã lưu, có tên và cặp địa chi hợp lệ. Chỉ ảnh hưởng trực tiếp trong các nhánh này, không truyền qua chiếu. Nhánh nền có vị trí phù hợp nhưng gặp điều chỉnh chưa đặc tả => unknown kèm nguyên nhân phương pháp, không gán thiếu dữ liệu hay false. Cả hai cùng Điền giữ riêng§7.33; lời nền bị loại theo giới hạn triển khai để tránh xuất lời chưa điều chỉnh. Đây không phải tuyên bố sách vô hiệu hóa mọi sao.
Nô: §9.2.3 Lộc Tồn, §9.2.5 Kỵ, §9.2.8 Tướng Quân độc lập; vế đầu§9.2.11 về khó tìm/khó giữ người trợ giúp tách khỏi hai vế đảo sáng/mờ. Tuần hoặc Triệt được nhận bằng từng cặp vị trí; cả hai cùng có vẫn chỉ một đoạn.
Ví dụ Thiên Lương: kiểm tra đủ cả ba cung, cả địa chi và đúng bộ sao theo ví dụ. Không mượn cung đối diện. Dự án giới hạn chưa xuất khi một trong ba cung có Tuần/Triệt trực tiếp vì ví dụ chưa chỉ cách điều chỉnh. Không dùng đánh giá đạo đức của văn bản như sự thật về người cụ thể.

## Rà 102 nhánh cũ
§10.5 Thái Dương ghi tọa thủ ở Dần/Mão/Thìn/Tỵ/Ngọ và Thân/Dậu/Tuất/Hợi; chỉ Tý ghi đơn thủ. 1.30 đã ghi giới hạn dự án trong projectScope, không phải sách yêu cầu. Sửa hai nhánh good/low ở phiên bản0.2.0, giữ nhánhTý.100 nhánh khác giữ điều kiện; sửa dẫn chiếu định nghĩa chung thành§2.6–2.8. Không nhân đôi lời tổ hợp để tăng độ mạnh. Những mâu thuẫn nội bộ đã loại ở Phúc (Cự/Lương) không mở lại. Bảng chi tiết: audit102.json trong bàn giao.

## Ca kiểm thử độc lập
Mỗi hàng no-dien-content.json là đặc tả vị trí: fixture kỹ thuật đặt chính tinh đúng/cung sai, branch sai, thiếu danh sách, sao lưu, thiếu cặp Tuần/Triệt, có điều chỉnh; expected là vị trí ghi trong hàng nguồn, không lấy output hàm làm chuẩn. Thiên Lương kiểm tra riêng từng cung bắt buộc. Phép Hóa mâu thuẫn chứng nhận => unknown. Cả hai Tuần/Triệt tại Điền không xuất đồng thời lời nền.
Mẫu engine tìm có giới hạn, khác fixture; số liệu192v2 không cộng mẫu tìm riêng. Bản đọc mới lưu frozen; không sửa snapshot hoặc bản cũ.

## Chưa hỗ trợ
Bảng§9.1 tổng quát, sát tinh hỗn hợp, hai nhóm chính tinh khác chiều, lượng từ nhiều và định nghĩa hợp nhất sáng/mờ. Phủ đơn thủDần/Thân§7.7 không khớp cấu trúc engine, không chữa sách. Điền vô chính diệu§7.63 có nhánh Tuần/Triệt và Nhật–Nguyệt cùng sáng chưa đặc tả phối hợp. Các nhóm sao liệt kê chưa đủ toán tử. Không tự bổ sung lời cảnh báo chung để tính là có nội dung.


## Lô 1.58.0 / catalog1.55.0 — 21/10/2026

Baseline thực tế `main` sạch9f8d407 (code3bff73c);192 báo cáo dựng lại khớp1.57/catalog1.54. Dùng audit/ma trận cũ; chỉ đối chiếu câu tại ảnh PDF153/157, không đọc lại chương. Code `e7bd1e4`, module `no-dien-phuc.ts`, evaluator/facts/renderer/quyền chung; rule draft/review=null.

- `dien-vcd-inheritance`: PDF157§7.63 gạch đầu: “Không được thừa hưởng tổ nghiệp: phải tự tay gây dựng.” Điều kiện nguồn là Điền không có chính tinh. Các gạch sau nói quy mô/diễn tiến khi phối hợp TT/Nhật–Nguyệt; không dùng chúng để chặn mọi câu về nguồn gốc tài sản. Chỉ xuất nguồn gốc/tự gây dựng; không mượn chính tinh đối cung, không suy quy mô hoặc thời điểm.
- `dien-kinh-bright`: PDF153 mục Kình Dương mang số§7.14 in trùng Phá Quân: “Sáng sủa tốt đẹp: cơ nghiệp trước phá sau thành.” Trạng thái dùng bảngTB39 đã audit: chỉ Đắc tại Thìn/Tuất/Sửu/Mùi. Không suy các ô không in thành Hãm. Câu Không–Kiếp ngay sau chưa rõ một hay cả hai: nhánh hiện tại xác nhận vắng cả hai, không gọi một sao là đủ kích hoạt ngoại lệ.
- Hai nhánh vẫn giữ cổng chưa xuất khi TT trực tiếp theo§7.32: **giới hạn triển khai vì phép điều chỉnh chưa rõ**, không tuyên bố nguồn cấm mọi nhận định. Không đảo mọi lời hoặc ưu tiên nguồn thắng.

Bộ192: Điền59→43 trống,16 mới có nhận định/4 đã có được bổ sung; VCD khớp19, Kình2 (có giao nhau). Nô71→71,0 mới/0 bổ sung. Nô không còn nhánh mới đủ đặc tả trong ma trận đã rà: bảng khác ô/VCD và TT chưa có phép áp; nhóm Xương–Khúc/Khôi–Việt/Tả–Hữu/Khoa–Quyền–Lộc/Khốc–Hư thiếu lượng từ, Phục Binh phụ thuộc “nhiều”; ví dụ TL giữ đủ ba cung. Không tự bỏ cổng này.

Điền còn chặn: Kình ở ô trạng thái chưa được bảng định nghĩa; nhóm Hỏa–Linh/Không–Kiếp/Xương–Khúc/Khôi–Việt/Lộc–Khoa/Tả–Hữu/Cô–Quả/Quang–Quý/Đẩu thiếu lượng từ; VCD phối hợp TT/Nhật–Nguyệt chưa rõ điều kiện và tác động. Ma quái, bệnh/sinh tử, số lượng tài sản không được mở phạm vi. Phần triển khai đủ căn cứ đã hết **trong phạm vi đã rà**, không tuyên bố đã khai thác hết sách. Xem ND04/09/10 trong backlog duy nhất và [kiểm/bàn giao](../.local/no-dien-phuc-20261021/ban-giao.md).


## Tuần/Triệt theo phương diện — 1.64.1,22/10/2026

Dùng đúng audit PDF155§7.32–33; kiểm lại ảnh155 có sẵn vì hai chỗ chữ bất thường. Ảnh thực cũng in “của của nghiệp” và “không sao tọa thủ”; không tự sửa thành câu tác giả khác hoặc dùng lỗi chữ đó tạo toán tử.

§7.32 viết “Nhận định nghịch đảo ảnh hưởng của những sao tọa thủ, tốt hóa xấu, xấu thành tốt.” Câu này không chia riêng thừa hưởng/tạo lập/duy trì, không nêu bảng đối ứng từng sao. Đối tượng là **ảnh hưởng sao tọa thủ**, không phải mọi câu dưới tiêu đề Điền và không tự bao gồm chính tinh xung chiếu. Một Tuần hoặc một Triệt vẫn giữ cổng lời nền sao chưa có ánh xạ; không đảo mua bán thành không mua bán, tranh chấp thành hòa thuận, ít nhà thành nhiều nhà hoặc giữ nhà thành mất nhà.

§7.33 riêng **cả Tuần và Triệt trực tiếp cùng Điền**: (1) không có phần nghiệp để lại; nếu có chút thì sau phá tán hoặc lìa bỏ/không thừa hưởng; (2) tự gây dựng, thành bại thất thường, đổi chỗ ở; về già mới có nhà đất nhỏ/tầm thường; (3) “không cần phải chú trọng nhiều” ảnh hưởng sao tọa thủ. Không phải hai TT tự hủy, cũng không đủ nói mọi sao vô hiệu. `dien-both-void` đã có trọn diễn tiến và tiếp tục tái dùng, **0rule ngoại lệ mới**. Việc chưa xuất lời sao nền cùng cảhai là giới hạn triển khai hiện hữu để tránh lời chưa điều chỉnh, không gọi đó là yêu cầu nguồn xóa mọi sao.

Tập con gỡ chặn: câu đầu§7.63VCD đã audit — không thừa hưởng tổ nghiệp, phải tự gây dựng — là **nguồn gốc cơ nghiệp**, không phải ảnh hưởng của sao tọa thủ. MộtTT không làm mất câu độc lập này. Khi cảhaiTT, không xuất thêm câu nguồn gốc trùng với§7.33; dùng nhánh ngoại lệ chung. Không từ đó xuất diễn tiến lậpnghiệp riêng§7.63 hoặc nhánh Nhật–Nguyệt/cảsáng chưa đặc tả. Không chuyển lời thuận về nguồn thu sang nhà đất. Cổng saoKình/Không–Kiếp, nhiều sáng/mờ và những lời saoĐiền khác giữ riêng.

So192: **0Điền mới có nhận định,16bổ sung**, vẫn43Điền chưa có nhận định; không cung nào được nhận hoàn chỉnh. [Phân định Phụ và phần đảo còn thiếu](PHU-HUYNH-1.32.0.md#tuầntriệt-theo-phương-diện--164122102026), [toàn đoạn](../.local/parent-property-void-20261022/full-before-after.txt), [bàn giao](../.local/parent-property-void-20261022/ban-giao.md).

Còn thiếu ở§7.32: mức đối ứng từng lời tạo lập/giữ/thừa hưởng, lượng từ và phép phối hợp nhiều ảnh hưởng; không có căn cứ nối sang sao chiếu. Phương án đề xuất: đặc tả hữu hạn theo **một vế và một vị trí** mỗi lần; chỉ đảo cực khi câu nguồn có đối ứng đủ rõ, giữ nguyên thời đoạn/điều kiện. Không suy đảo mọi lời thuận/nghịch. Giữ NPL225 phản biện phép đảo tuyệt đối ở hồ sơ riêng, không dùng NPL làm lời giải cho TânBiên. Chủ dự án đã đồng ý triển khai phần chắc và bàn giao phần này, chưa duyệt bảng đảo chi tiết.


## Rà cổng Nô–Tử22/10/2026 — dừng, không có tập con mới đủ căn cứ

Yêu cầu trực tiếp nối baseline1.64.1/catalog1.60/code1b8c1c1, tài liệuc5fe112. `main@c5fe112` sạch đầu phiên. Rà ma trận Nô cũ, kho chữTB168–173 và hồ sơ liên quan; đối chiếu predicate thực `natal-completion.ts`/`no-dien.ts`, không lấy nhãn lịch sử trong ma trận làm trạng thái hiện hành. Không mở sách mới/kiểm ảnh mới: chỗ còn thiếu là lượng từ và phép điều chỉnh, không phải chữ OCR chưa đọc. [Kết quả192 và code khớp checkout phục vụ](../.local/no-tu-clause-review-20261022/verification192.json), [toàn đoạn trước=sau](../.local/no-tu-clause-review-20261022/full-before-after.txt).

- **Bảng§9.1, TB168–171:** các vế tài năng/trợ giúp, số người, khá giả, quần tụ–ly tán đều nằm dưới cùng ô Mệnh–Nô/sáng–mờ. Tách câu không làm mất điều kiện ô. Khác Phụ§5.2.30 chỉ đích giàu/nghèo/sang/hèn, Nô§9.2.11 không khoanh riêng mặt vật chất; chưa chứng minh tài năng hoặc ly tán nằm ngoài phần cần đổi. Cổng khôngTT tại Mệnh/Nô là **cổng dự án**; không gọi nguồn yêu cầu vắngTT, cũng chưa đủ căn cứ gỡ riêng một vế. Nhiều chính tinh đồng nhất ô đã có; ô hỗn hợp/Bình/Lợi/ô trống và VCD vẫn thiếu phép nguồn, không chọn sao thắng hoặc tự điền bảng.
- **§9.2.1 Xương–Khúc–Khôi–Việt:** câu “Bạn bè có danh chức” đứng riêng, không mang chữ “nhiều” của hai gạch sau. Tuy nhiên tiêu đề chưa giải một sao/từng cặp/cả bốn và quan hệ vị trí; không thể dùng riêng một sao để xuất câu này. Hai gạch sau còn điều kiện nhiều/sáng–mờ, lời khuyên và quy kết gây hại; không lấy vế danh chức để lách các điều kiện đó. **Có câu độc lập về nghĩa, chưa có điều kiện kích hoạt đủ.**
- **§9.2.2 Tả–Hữu và§9.2.9 Phục Binh:** tài giỏi/đắc lực/bạn bè tốt đều nằm dưới nhiều sao sáng; nhánh mờ mang lời làm hại. Không có vế quan hệ vô điều kiện để lấy riêng; Phục Binh một sao không thay cho ngưỡng nhiều sao.
- **§9.2.4 Khoa–Quyền–Lộc,§9.2.7 Khốc–Hư,§9.2.13 Tả–Hữu–Tướng–Binh:** có lời trợ giúp/quan hệ thuộc chủ đề đã có, nhưng danh sách tiêu đề chưa định nghĩa lượng từ và tập vị trí. Không suy AND/OR từ dấu phẩy; ngay cả giữ vế “khá giả” hay “oán trách” vẫn chịu điều kiện nhóm.
- **§9.2.6 Song Hao:** vế “Khó thuê mượn người làm” đứng trước “nếu có người giúp việc”; câu sau về bạn bè mang quy kết phẩm hạnh. Vế đầu có thể tách về cú pháp, nhưng “Song Hao” trong chínhTB còn được diễn đạt “Đại Hao hay Tiểu Hao” ở phần Mệnh; không tự chuyển cách dùng mục Mệnh thành toán tử tại Nô. Hai Hao không cùng một ô vòng Bác Sỹ; chưa có căn cứ dùng một sao, cả hai hoặc hội chiếu cho đúng câuNô. Chưa đủ điều kiện kích hoạt; không thêm nhánh khó thuê bằng lựa chọn toán tử.
- **§9.2.3 Lộc Tồn,§9.2.5 Kỵ,§9.2.8 Tướng Quân:** lời độc lập đã có rule; không phải nội dung mới bị loại khỏi catalog. Predicate vẫn giữ cổngTT của dự án khi chưa giải tác động§9.2.11; nguồn không nêu mặt nào trong ba lời này miễn điều chỉnh. Không tạo rule trùng với tên khác.
- **§9.2.11 TT:** vế trước khó/sau dễ/không lâu bền đã có `no-void`, không phụ thuộc hai gạch sáng–mờ và không tạo rule thứ hai. Hai gạch sau chưa có tập sao/ngưỡng/ánh xạ kết quả cho từng ô; không biến trước khó/sau dễ thành bảo đảm có người giúp.
- **§9.2.10/12/14 (hai mục cùng số)/16:** lời tình dục, vợ lẽ, phẩm hạnh, gian dâm hoặc quy kết hành vi người khác thuộc giới hạn sản phẩm hiện hành. Không tách “quý mến”, “thuận hòa” khỏi đối tượng vợ cả/lẽ hay tình dục để đổi sang quan hệ bạn bè chung.
- **Ví dụTL155–159:** giữ riêng hệ nguồn; bốn ví dụ1/5/7/11 đã có đúng cấu trúc Mệnh–Bào–Nô. CổngTT tại ba cung là giới hạn dự án vì chưa có phép điều chỉnh từng ví dụ. Các vế trợ giúp/lấn át/ly tán vẫn là kết quả của cấu trúc cả ba cung, không có căn cứ bỏ cung hay giữ vế thuận bất chấpTT. Ví dụ còn lại có liên hệ Di/Phối, thế sinh–khắc hoặc phẩm hạnh; không lấy riêng tài năng/trung thành để bỏ các phần ấy.

**Kết quả:** không giải thêm điều kiện/không thu hẹp cổng;0Nô mới có nhận định,0Nô bổ sung;71/192 vẫn thiếu. Đây là kết luận hữu hạn cho các nhóm audit vừa rà, không tuyên bố hết sách hay cổng dự án là yêu cầu nguồn. Không sửa văn khách, catalog, quyền hoặc dữ liệu. Dừng theo yêu cầu; không biến lượt rà thành gói chỉnh văn.


## Đối chiếu phép điều chỉnh bảng Nô — nối23c8906,22/10/2026

Lượt này chỉ xét **bảng chính tinh168–171 và§9.2.11ở173**; không rà lại nhóm câu độc lập. Baseline `main@23c8906` sạch. [Bằng chứng chữ/ảnh và phân loại](../.local/no-tu-void-method-20261022/evidence.json), [bàn giao](../.local/no-tu-void-method-20261022/ban-giao.md). Đã xem lại ảnh168/171 để kiểm cột/ô, ảnh173 để loại khả năng mất chú thích; ảnh155 chỉ phục vụ đối chiếu cách tác giả phân trường hợpTT. Không có sửaOCR hoặc mở sách mới.

**Sách quy định tới đâu:** mở mục9ở168 yêu cầu nhận định đồng thời sáng/mờ của chính diệu hoặc sát tinh tại **Mệnh và Nô**, rồi kết hợp hai cung; sau đó mới phụ đoán. Cuối171 nói Nô có chính diệu cùngsát tinh thì chỉ xét sáng/mờ của chính diệu. Bảng chia nhóm sao và trạng thái của từng cột; quan hệ trợ giúp, tài năng, hoàn cảnh bạn bè và quần tụ/ly tán xuất hiện cùng điều kiện ô. §9.2.11 có một lời trực tiếp về **thuê người trước khó/sau dễ nhưng không lâu bền**, rồi hai gạch yêu cầu khi nhiều sao sáng thì nhận địnhmờ và khi nhiều sao mờ thì nhận địnhsáng. Sách **có yêu cầu điều chỉnh**, không chỉ nói thêm lời khó thuê. Không ghi chỉ vật chất chịu đổi, không miễn quan hệ/tài năng/ly tán. Ngược lại cũng không liệt kê từng phương diện phải đổi thành câu đối nghĩa nào.

**Không thể đồng nhất với đảo từng mệnh đề:** ở171, giữ cột Mệnh Vũ–Tướng sáng và nhóm NôTử–Phủ–Cự–Nhật–Cơ–Nguyệt–Đồng–Lương: ôNô sáng nói khá giả/có tài năng/có lòng tốt; ôNô mờ nói giúp việc bất tài, bạn bècó lòng tốt nhưng khôngkhá giả. Như vậy đổi nhãn sáng/mờ **không** biến lòng tốt thành lòng xấu. Ở170, ôMệnhSát–Phá–Liêm–Tham sáng/Nônhóm A sáng có cả trước khó sau dễ và không nhất trí; không được tự đảo vếkhông nhất trí thành hòa hợp. Những ví dụ này loại phép thay từng từ bằng từ trái nghĩa; chúng chưa chứng minh§9.2.11 bắtbuộc dùng ôđối trạng thái nào.

**Phân biệt cổng nguồn và cổng dự án trong code hiện hành:**

- `natal-completion.ts::completionAssessment`, nhánh`no-table`, tra từng chính diệu theo bảngTB rồi yêu cầu mọi sao trong mỗi cung đồngnhất một ô. Sau đó `targets=[life,p]`: có bất kỳ TT trực tiếp tại **Mệnh hoặc Nô** thì unknown, chưa xuất bảng. Sách không ghi câu “chỉ xuất khi cả Mệnh vàNô đều vắngTT”; đây là **cổng dự án** để chưa xuất kếtquả chưa điều chỉnh. Điều kiện nguồn còn thiếu không được đổi tên thành thiếu dữ liệu.
- `no-dien.ts::noDienAssessment` giữ cổngTT tại **Nô thật** cho các lời phụ đoán đang có; `no-void` đã xuất riêng lời trướckhó/sau dễ/không lâu bền. Đây không phải code thực hiện hai gạch chuyển sáng/mờ, không chứng minhOR của tiêu đề hoặc chứng minh các lời khác đã được miễn điều chỉnh.
- §9.2.11 nằm trong mục Nô, nên TT trực tiếp Nô là vị trí được gắn trực tiếp với lời đoạn đó. ViệcTT tại Mệnh có làm đổi cách phân loại cột Mệnh theo lời riêng từngsao phải có căn cứ riêng; đoạn 173 không mô tả một phép đổi hai cột. Không gọi việc chặnMệnh hiện nay là câu nguyên văn173; cũng không từ đó cho phép bỏ cổngMệnh khi các tác động riêng chưa giải.

**Các cách đọc đã kiểm và chưa đủ để chọn làm thuật toán:** (1) đổi lời cuối thành tốt/xấu đối lập — bị loại bởi ví dụ171 nêu trên; (2) giữ nhóm, đổi nhãn sáng/mờ rồi tra ôcòn lại — là giả thuyết có căn cứ cấu trúc hơn(1), nhưng173 chưa nói đổi cột Nô, cột Mệnh hay nhận định phối hợp, chưa xác định tập “nhiều sao” có bao gồm trung/bàng tinh hay chỉ chính diệu; (3) chỉ thêm lời TT rồi giữ nguyên mọi lời bảng — không thực hiện hai gạchđiều chỉnh, bị loại; (4) chỉ đảo vật chất và miễn quan hệ — không có chỉđích nhưPhụ, bị loại; (5) áp hai lần khi cả hai TT rồi trả về nền — không có phép hợp thành hoặc tự hủy trong173, bị loại. Không tự đặt ngưỡng sao, phần trăm suy giảm hay buộc phải có kết luận ròng toàn cung.

**Đối chiếu khác tác giả:** Hàm Số/NPL227 chỉ nêu người giúp việc thayđổi, ra/vào luôn, không ở lâu; phùhợp mặt duy trì trong lời TTđộc lập củaTB nhưng không cungcấp ánhxạ ôMệnh–Nô. Hồ sơThiên LươngTT giới hạn vị trí/phép tác động theo hệ củaThiên Lương; không có phép đổi từng lời bảngTB. Không dùng chúng thay§9.2.11 hoặc âmthầm miễn ảnhhưởng cho một nhóm chính diệu.

**Mắt xích còn thiếu:** tập sao và vị trí của điều kiện nhiều/sáng–mờ trong chính phép173; biến đổi cụ thể trên cột/ô/nhận định; cách áp khiTTởMệnh, ởNô, ởcả hai cung hoặc cả hai TTcùng án. Không thiếu một tỷ lệ định lượng hoặc điểm tốt/xấu toàn cung. Chưa chứngminh tập con nào đủ điều kiện mới;0nhánh/0gỡ cổng/0Nômới có nhận định/0bổ sung. Nô71/192thiếu giữ từ23c8906, không tính là chạy 192 mới. Giữ cổng dự án dưới nhãn cổng dự án; dừng sau đối chiếu trực tiếp, không chỉnh văn hoặc mở nhóm khác.
