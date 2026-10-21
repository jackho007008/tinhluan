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
