# Tài chính và tài sản — nội dung 1.37.0

Baseline đã ghi trước sửa: nội dung/catalog 1.36.0, continuous-report-1.0.1, căn cứ NPL đã có. Node20.20.2/npm10.8.2, iztro2.6.1. Không có Git trong thư mục này; đối chiếu bằng SHA-256. Dữ liệu hồi quy: nguyên 192 v2, không bộ gốc lỗi.

## Phạm vi văn bản đã đọc

Tử Vi Tổng Hợp, Nguyễn Phát Lộc, bản 442 trang, SHA256 82f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37. PDF và số in trùng tại các trang dùng. Đã đọc văn bản trích 26–32,73–75,121–124,240–265; đối chiếu ảnh 242,245,254,257,264,265 quyết định. Không tuyên bố đọc cả sách. Tân Biên: đối chiếu trực tiếp ảnh190,191,195,197; tái sử dụng hồ sơ các lời Quan/Điền và Tuần–Triệt1.36. Những hồ sơ TL/Hàm Số về Cơ–Lương/Kỵ trước đây chưa có phép ưu tiên không bị biến thành phép mới. Đợt này không thêm phương pháp TL/Hàm Số.

NPL26–32 và121–124 là tiến trình/quan niệm định tính; 121 có phản biện phương pháp tam hợp, 123–124 tự ghi quan niệm. Không chuyển thành điểm, ngưỡng, cung thắng cung hoặc chính tinh xóa phụ tinh. NPL73–75 không dùng để nới điều kiện đồng cung của catalog. NPL247–249 thuật TL Lộc Tồn và nêu thắc mắc xung chiếu: không triển khai hệ số/tuổi/phép Lộc mới. NPL265 Thiên Giải phản biện quan điểm người khác: không lấy câu dẫn phản biện làm rule.

## Quyết định thực thi

1. `npl-finance-retention-1.0.0`: Thiên Không bản mệnh tại Tài Bạch. NPL265 gọi riêng Thiên Không, khác Địa Không/Địa Kiếp ở264. Mục bao quanh là sao hao tiền. Nguồn: khó giữ lâu, hao tương đối nhanh; có trường hợp chỉ không dư thừa, nguyên nhân ngoài kiểm soát hoặc hệ quả cách thu trước. Không bỏ cách hiểu nhẹ hơn, không quy kết hành vi. Giới hạn dự án: tọa thủ Tài, không hội chiếu. Không thêm yêu cầu sáng/tối, địa chi, Tuần/Triệt. Không có ngoại lệ cụ thể ở đoạn này không chứng minh mọi ngoại lệ vắng mặt. Có chứng cứ dương natal → yes; không có và hợp đồng danh sách đầy đủ → no; còn lại unknown. Validator và receipt vẫn chặn bản lưu bất nhất. Rule draft/review=null, không thay r42 hoặc quy tắc TB Thiên Không–Địa Kiếp.
2. `finance-assets-1.0.0`, phân biệt tiền/nhà đất: NPL241–242,257,261–262. Kích hoạt khi có claim Tài và Điền. Giữ cả hai, không từ Điền suy toàn tài chính. Không thực thi mệnh đề “cả hai cung tốt thì...” vì chưa định nghĩa tốt toàn cung.
3. Cơ–Lương/Kỵ: TB191§12.6 và195§12.23; NPL245,264 đối chiếu cùng khía cạnh. Chỉ khi cả hai claim khớp: tạo của / hao tán được trình bày song song. Không suy dòng tiền ròng, không gán Kỵ xóa Cơ–Lương hoặc hóa giải Kỵ. Ngoại lệ Nhật–Nguyệt vẫn do evaluator cũ quyết định, không được phối hợp lại.
4. Lời giữ của + Thiên Không: ghi xung đột nhận định cục bộ còn chưa giải quyết, giữ hai căn cứ. Đây không phải hai phương pháp mâu thuẫn trực tiếp cùng đối tượng để tự thay Tân Biên. Không kết câu “giữ của bền”.
5. Điền Cơ–Cự gặp TT: tái sử dụng quan hệ điều chỉnh1.36, không khôi phục lời nền đã bị chặn. NPL260–261 chỉ nói nhà đất, NPL257 giới hạn suy rộng.
6. Quan Tử Vi Ngọ gặp TT: tái sử dụng1.36, giới hạn công việc không kết luận thiếu tiền. NPL242/257 phân biệt nghề/chức và tài;306 là căn cứ điều chỉnh cụ thể. Không suy mọi Quan thuận là thu nhập cao.

## Hình thức hóa và lưu

Phân loại aspect bằng danh sách rule được biên soạn rõ, không đoán từ từ khóa. Những nhánh Quan có vế tài lộc/buôn bán trực tiếp được chọn nguyên đoạn, giữ vế khó khăn và điều kiện nghề, không tự chọn nghề thực tế. Nhánh chưa phân loại vẫn ở cung gốc. Mỗi nhóm xuất một lần; liên kết từ cung về đoạn đó, không nhân đôi bằng chứng. Mỗi quan hệ chứa claim IDs, group IDs, loại, nguồn và cách phối hợp của sản phẩm. Không có tính điểm hoặc evaluator thứ hai.

Bốn lời diễn đạt lại: r06, r42, finance-co-luong, finance-extra-ky-general. Còn lại giữ lời hiện có; một chú giải mới có nguồn riêng. Lời gốc vẫn trong căn cứ và đối tượng claim. `continuousReport.financeAssets` cùng bảng quan hệ được đóng băng trong bản lưu; bản không có trường này vẫn đọc giao diện cũ. Nội dung1.37.0, lớp phối hợp1.0.0, renderercontinuous1.1.0; engine nguyên trạng.

Mệnh/Thân/Phúc/Di: TB190 yêu cầu xét trước; NPL241–242,254–257 chỉ dẫn nhiều mặt nhưng chưa có điều kiện tổng hợp đủ rõ. Ghi ở căn cứ, liên kết về cung; không dùng Thân cư làm hệ số, không tuyên bố tài chính đã luận đầy đủ.

## Các điểm chưa triển khai

- Phép phối hợp Liêm–Phủ và Thiên Không để xác định tác động lên giữ của: cần đoạn cùng đối tượng, điều kiện, quan hệ và ngoại lệ; không đủ chỉ một nguyên tắc chung phụ tinh làm giảm chính tinh.
- Lượng tạo của so với hao tán Cơ–Lương/Kỵ: chưa có phép cân đối hay thay thế; không cần chặn trình bày song song.
- Ngưỡng/phương pháp liên cung Mệnh–Thân–Phúc–Di và trạng thái hỗn hợp; không áp những chữ “nhiều”,“tốt”,“xấu” như boolean toàn cung.
- NPL254 không định lượng được “vừa đủ” sao giữ của; không triển khai ngưỡng2. NPL262–265 phần quy kết đạo đức, hình ngục/biến cố không đưa vào sản phẩm. Không thêm nhánh vận.
