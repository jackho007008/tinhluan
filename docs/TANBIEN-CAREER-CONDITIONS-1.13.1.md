# Công việc: kiểm tra điều kiện, nội dung 1.13.1

Phạm vi: R40/R41 (Tử Vi độc thủ Ngọ/Tý), R05 (Tử Vi–Thiên Tướng), các điều chỉnh trực tiếp trong Quan Lộc. Không thêm nghĩa sao riêng, dự báo nghề hoặc rule vận. Catalog interpretation-1.16.0; lớp kiểm tra điều kiện lưu cùng bài đọc career-conditions 1.0.1; engine giữ nguyên.

## Kết quả và nguồn

- Tr.158 §8.1: các điều kiện nền vẫn do evaluator hiện có khớp. Không có bộ luận thứ hai.
- Tr.163–164 §8.14: đã đọc đủ hai trang và kiểm tra ảnh, giữ thứ bậc sát tinh sáng/tối → nhóm chính tinh sáng/tối. Không có đặc tả rõ phạm vi vị trí và cách phối hợp khi nhiều nhóm cùng hiện diện. Chưa cho phép kết luận tổng hợp.
- Tr.39–40: tái sử dụng bookState để đọc trạng thái có nguồn của sáu sát tinh. Ô chưa nêu chi không lấp bằng iztro; không tự coi Đắc=nhánh “sáng sủa” trong đoạn khác.
- Tr.18–20: tái sử dụng palaceGeometry; khoảng cách 0,4/8,6 tương ứng đồng cung/tam hợp/đối cung. Bổ sung hai cung kề chênh1/11, không suy cách giáp hay ý nghĩa. Tr.20 có ví dụ chữ không nhất quán; không dùng ví dụ đó để thay helper hình học đã kiểm tra của dự án.
- Tr.166–167 §8.45: bắt buộc Quan Lộc vô chính diệu. Có chính tinh → không áp ngoại lệ Tuần/Triệt/Nhật–Nguyệt của nhánh này. Danh sách thiếu hoặc chưa xác nhận → không suy rỗng. Rỗng đã xác nhận → vẫn chưa áp nghĩa án ngữ/hợp chiếu khi chưa có đặc tả.
- Tr.166 §8.39: R38 Hổ–Tấu vẫn là ý bổ sung độc lập; không thay thế R05 và không hóa giải sát tinh.
- Tr.164 §8.15–8.20: ghi nhận phụ tinh và Tứ Hóa thực tế, chưa tự tạo phối hợp. Không mở rộng các sao đơn lẻ để lấp khoảng trống.
- Tr.38 Thiên Tướng gặp Tuần/Triệt: không tự chuyển nghĩa tổng quát sang Quan Lộc hoặc suy án ngữ từ vị trí cặp.

Không tìm thấy nguồn bổ sung đã được dự án chấp nhận giải quyết các câu hỏi trên. Hồ sơ Cổ Học/Vương Đình Chi ở R01 thuộc Vũ Khúc; không phải công thức tổng hợp Quan Lộc.

## Những quyết định cần chuyên môn

1. §8.14 tính sát tinh chỉ đồng cung hay cả tam hợp/đối cung/nhị hợp/giáp? Cần định nghĩa gắn với đoạn, không đồng nhất mọi thuật ngữ.
2. Ánh xạ Miếu/Vượng/Đắc/Bình/Lợi/Bất/Hãm sang sáng/tối trong §8.14 là gì? Cần nguồn cho các trạng thái trung gian và chi chưa có bảng.
3. Tử Vi–Thiên Tướng thuộc hai nhóm: xét độc lập, ưu tiên sao nào, hay có đoạn tổ hợp riêng? Không tự đặt trọng số.
4. Nhiều sát tinh và nhiều trạng thái: điều kiện một sao/toàn nhóm hay từng sao? Không đặt ngưỡng “nhiều” vốn không được định lượng trong đoạn.
5. Các ý phụ/tứ hóa là bổ sung hay thay thế nhánh sát tinh? Chưa có thứ tự ưu tiên.
6. Có được áp phần Thiên Tướng chung tr.38 vào Quan Lộc; “án ngữ” ở đó được kiểm tra thế nào? Cặp vị trí không tự cấp nghĩa.

## Hợp đồng dữ liệu và trình bày

Kiểm tra mới được đóng băng trong reading.careerAssessment, không tính lại khi mở bản lịch sử. Dùng receipt của server để xác nhận danh sách đầy đủ; scope phải biết để suy danh sách bản mệnh. Đường dẫn cung/sao được lưu trong từng điều kiện. Kết quả phân biệt checked/not-applicable/unresolved và bốn loại nguyên nhân missing-data/undefined-relation/missing-interpretation/source-conflict.

deriveFacts loại scope lưu được khai báo rõ khỏi lớp bản mệnh; giữ ánh xạ chỉ số về vị trí gốc của snapshot. Không đổi ID sao, không mutate snapshot. Các fixture cũ thiếu scope vẫn theo hợp đồng legacy của evaluator; lớp kiểm tra mới không xác nhận hoàn chỉnh nếu scope thiếu.

Sửa renderer căn cứ source-position-available, không gọi lỗi ánh xạ là hồ sơ thiếu dữ liệu. R01 projectScope đủ ý hiếu thắng; R42/R43 không mang điều kiện độc thủ. HTML mới render introduction.text và từ chối implicit object coercion. Bản HTML/bài đọc lịch sử không đổi.

## Nghiệm thu

57 ca kiểm thử liên quan đạt, TypeScript đạt. Fixture kỹ thuật kiểm tra có/sai/thiếu quan hệ, scope sao lưu, remap đường dẫn, thiếu receipt/danh sách/vòng, nhánh VCD và cổng Kim Cục21. Hai hồ sơ thật tạo mới qua API, toàn bộ snapshot bằng trước và hash engine/hồ sơ cũ không đổi. Đây là nghiệm thu kỹ thuật, không phê duyệt chuyên môn. Rule tiếp tục draft/review=null.

HTML tự chứa và các liên kết hồ sơ: `.local/career-conditions-20261010/ban-giao.html`, `links.json`. Các ảnh mobile và kết quả test ở cùng thư mục.
