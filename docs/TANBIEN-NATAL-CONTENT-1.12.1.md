# Nội dung bản mệnh 1.12.1 — 10/10/2026

Đợt này dùng evaluator/catalog hiện hành. Không sửa engine, vị trí sao hoặc snapshot. Catalog interpretation-1.15.0; template 1.12.1; dynamic reading 1.1.0. Quyền nguồn pending; tất cả rule vẫn draft/review=null.

## Nguồn và quyết định

Tái sử dụng văn bản PDF Tân Biên đã lưu tại `.local/tanbien-engine-source`. Đọc Vũ Khúc 65–68, Thiên Tướng 90–92, Quan Lộc 158–167 và Tài Bạch 190–197. Đối chiếu ảnh 158,190,192. Trang in trùng chỉ số trang PDF tại các vị trí này. Bảng trạng thái cũ không thay đổi.

- R40/R41: Tử Vi là chính tinh duy nhất ở Quan Lộc Ngọ/Tý, tr.158 §8.1. Phụ tinh không làm mất điều kiện độc thủ. Hai nhánh phân biệt chi, không chuyển mô tả từ Mệnh. Tr.163–164 §8.14 còn điều chỉnh sát tinh; chưa có đặc tả tổng hợp đủ chặt. Vì vậy chỉ xuất chú giải cách sách phân nhánh, không phát hành kết luận công danh.
- R42/R43: Liêm Trinh với Thiên Phủ/Thiên Tướng đồng cung Tài Bạch, tr.190 §12.2; đối chiếu 192 §12.7 và193 §12.11. Chú giải nguồn bàn về tích lũy/giữ của. Mở đầu tr.190 yêu cầu xét Mệnh, Thân, Phúc Đức, Quan Lộc, Thiên Di; điều chỉnh 194–197 chưa tổng hợp. Không xác nhận giàu hoặc năng lực giữ tiền.
- R01: giữ nguyên điều kiện; bổ sung mặt hiếu thắng cùng với quả quyết/cương nghị/tổ chức của tr.65 để không chỉ chọn phần thuận lợi.
- R05: giữ nguyên cặp Tử Vi–Thiên Tướng tại Quan Lộc; thêm mặt mưu tính/vượt quyền trong chính đoạn158/162. Hạ phân loại thành chú giải; không quy kết hành vi.
- R06: giữ Liêm Trinh độc thủ Tài Bạch Dần/Thân; giữ cạnh tranh và tích lũy chậm/chắc theo nguồn, nhắc yêu cầu liên cung ngay trong đoạn; hạ thành chú giải.
- Vũ Khúc–Thiên Tướng tại Mệnh: phần đã đọc không cho đặc tả tổ hợp riêng đủ chặt. R01/R09 giữ riêng, không cộng nghĩa hoặc lấy câu ở Quan Lộc/Tài Bạch thay thế.

`natalSourceContent` là đặc tả nguồn được biên dịch vào cùng DSL, không phải evaluator khác. `fact.source-position-available` tái dùng cổng dữ liệu Cục/ngày âm hiện có; không phải thêm phép an sao. Trường hợp Kim Cục ngày21/24 và thiếu Cục/ngày âm không phát hành các chú giải mới phụ thuộc vị trí. Không suy dữ liệu thiếu thành điều kiện sai.

## Chẩn đoán và bài đọc

Kim Thoa bản cũ khớp R01/R09; không có rule phù hợp cho Tử Vi độc thủ Quan Lộc Ngọ hoặc Liêm–Phủ Tài Bạch. R05 thiếu Thiên Tướng tại Quan Lộc; R06 sai số chính tinh/chi; R07 không có Lộc Tồn tại Tài Bạch. Đây không phải lỗi render. Bản mới thêm R40/R42 nên ba cung có nội dung, nhưng nội dung mới chỉ là chú giải nền.

Hồ sơ1992 vẫn có R01/R03/R02/R05/R38/R06 ở ba cung; không tăng độ phủ giả. Ý mới là mặt hạn chế của nguồn R01/R05 và yêu cầu liên cung R06.

Bài đọc mới lưu `readerLimit` trong metadata phiên bản rule; phần chi tiết giữ nguyên mọi giới hạn/source/trace. Nội dung rule không có giới hạn ngắn vẫn hiển thị giới hạn đã lưu. Không sửa bài cũ tại tầng render. Chuyển nhãn kỹ thuật và ghi chú quy trình vào căn cứ; một thông báo dự thảo chung. Chủ đề nằm trong Tổng quan; bốn nhóm điều hướng chính. Mười hai cung bắt đầu Mệnh trong thứ tự DOM/bàn phím, đủ trạng thái có luận giải/chỉ dữ kiện; không đổi khung lá số.

## Nghiệm thu và bàn giao

`tests/natal-content.test.ts`: ca tối thiểu theo nguồn (không phải lá số giả được giao cho khách): đúng/sai sao, chi, độc thủ, thiếu dữ kiện, cổng nguồn; chưa tính ngoại lệ thì luôn giữ kiểu context. Hai hồ sơ thật qua API tạo record mới và GET exploration. Toàn snapshot so sánh bằng nhau; SHA-256 tất cả hồ sơ cũ và mã engine giữ nguyên.

HTML tự chứa `.local/natal-content-20261010/ban-giao.html`: toàn văn, căn cứ, trace từng rule, độ phủ12cung và các phần thiếu. `links.json` chỉ bản cuối; các bản trung gian không xóa/ghi đè. `tests.log`, `before-hashes.json`, ảnh mobile trong cùng thư mục. Sửa kiểm thử hồi quy cũ để phân biệt claim ID đổi phiên bản với đổi nội dung, và ràng buộc chi thực tế đã có của R20.

Chưa có rule vận/năm/ngày; không dùng luận bản mệnh làm dự báo. Chưa duyệt chuyên môn và quyền nguồn: cổng khách hàng vẫn chặn draft. Không bật dịch vụ, không AI/scoring.
