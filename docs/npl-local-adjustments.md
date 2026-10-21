# P2 — quyết định trước khi coding (2026-10-14)
Baseline trình bày 1.41.1; catalog 1.41.0. Không có AGENTS.md hoặc .git tại checkout/cha đã kiểm tra. 192 v2 đã chụp lại trước sửa; manifest giữ mọi file báo cáo cũ kể cả các bản QA trùng nội dung.

## L — điều chỉnh cục bộ Liêm–Tướng
- NPL Hàm Số PDF/in 89 §4 mô tả Liêm sáng: thẳng, can đảm, nghiêm/nghiệt, nóng. PDF90 §6a khẳng định Tướng đi với Liêm khắc chế nóng; PDF132 §6a nhắc lại chế nóng nảy, khắc nghiệt. Không phải giả thuyết hay lời trích phản biện.
- HS49–50 cho phép xét bộ sao đồng cung, phân biệt hội chiếu. Triển khai **tập con đồng cung Mệnh bản mệnh**; đây là giới hạn dự án, không gán chữ “chỉ đồng cung” cho tác giả. Không dùng “gặp” để mở sang hội chiếu.
- Đầu vào: Mệnh duy nhất; 12 cung/14 chính tinh định danh chuẩn, duy nhất, scope origin; chứng nhận major complete; Liêm và Tướng cùng Mệnh. Không thêm giới tính, can, địa chi hay nhãn sáng vào công thức NPL này. Không dùng bảng P1 làm độ điều chỉnh.
- R10 Tân Biên PDF34,60–62 giữ nguyên điều kiện và claim gốc. TB60 và HS89 cùng nét nóng tại Mệnh; TB34 và HS89 cùng bảng vị trí Liêm. Đây là phối hợp nguồn có giới hạn của sản phẩm, không gán toàn bộ kết quả cho NPL.
- Khi R10 cùng khớp, điều chỉnh **nóng nảy**; giữ thẳng thắn, can đảm, nghiêm nghị. “Khắc nghiệt” không đồng nhất với “nghiêm nghị”, nên không xóa nghiêm nghị. Không xóa claim gốc. Lưu quan hệ facet-adjustment và các ID hai phía. Hiển thị cạnh nhau ở từng cung; báo cáo toàn văn gom thành một đoạn có cả hai căn cứ.
- Nếu R10 không xuất, chỉ lời tổ hợp NPL độc lập; không tự tạo lời nền. Thống kê độc lập, không tính là cơ chế điều chỉnh.
- HS131–132/TH340–342: Kình/Hình/Tuần/Triệt liên quan cứu giải tai họa/công danh, không có câu hủy chính nét tiết chế nóng đang xét. Không gắn điều kiện vắng các sao đó cho nét nóng. Không xuất nội dung sức khỏe, sinh tử, phẩm hạnh, binh nghiệp.
- Không có hệ số; không kết luận hết nóng, tính cách tốt, tài lộc/sự nghiệp/hôn nhân tốt; không đánh giá người thật.
- Thiếu/không hợp lệ danh sách: unknown; đủ và không cùng Mệnh: no. Sao lưu không được tính.

## K — lời tổ hợp độc lập Khoa–Địa Kiếp
- TH PDF/in74: Hóa Khoa **đồng cung Địa Kiếp**: trình độ học vấn giảm **hoặc** cao nhưng thi cử lận đận. Đây là ví dụ quy tắc phối hợp có mệnh đề chung, không là một lá số riêng. HS166–167 xác định phạm vi học vấn tại Mệnh; giới hạn sản phẩm chỉ Mệnh.
- Bằng chứng Hóa Khoa bản mệnh và Địa Kiếp cùng Mệnh; không phải Thiên Không/Địa Không. Tái sử dụng verifiedNatalTransformations, không tạo chứng nhận khác. Chứng nhận sai/mâu thuẫn => unknown; thiếu chứng nhận chỉ bằng chứng dương rõ được dùng. Phủ định cần chứng nhận; mảng minor thiếu không là vắng Kiếp.
- Không có lời nền Khoa về học vấn đã xuất trong catalog hiện hành. Vì vậy xuất **lời tổ hợp độc lập**, không báo đã sửa một claim nền. Giữ cả hai khả năng; không chọn người học thấp hay trượt thi; không suy trí thông minh hoặc khả năng học.
- HS167 riêng tài năng không mất khác phương diện với khoa bảng; không coi là mâu thuẫn buộc chọn bên thắng. TH344 cứu giải chung và HS167 cứu bệnh không được đưa vào.

## F — Thiên Phủ: khoanh nhánh
HS128–129, TH340–342: tên Kình, Đà, Hỏa, Linh; giới hạn 1/2/3 so với cả4 rõ, nhưng “gặp” chưa xác định vị trí để đếm hoặc phạm vi liên cung. Chọn đồng cung toàn nhóm còn khiến Kình–Đà bất khả thi trong profile. Chưa nhập rule. Phần cứu bệnh/tai họa ngoài phạm vi; phần tài lộc không ghép sang công thức cứu giải. Cần đoạn xác định tập cung cùng chịu phép đếm và điều kiện ngoại lệ KK/Tuần/Triệt theo đúng phương diện. Không cần nguồn mới cho L/K.

## Expected
L: đủ cặp cùng Mệnh=>yes; Liêm đơn/sao ở đối cung/cặp ở cung khác=>no; thiếu chứng nhận major/định danh lặp/scope lưu=>unknown; TT/Hình/Kình không tự hủy nét nóng. Khi R10 khớp, 3 nét không bị tác động vẫn còn, chỉ nóng đổi cách trình bày; 2 claim gốc giữ đủ nguồn.
K: Khoa origin+Địa Kiếp Mệnh=>yes; Kiếp cung khác hoặc Khoa cung khác xác minh=>no; chứng nhận sai/thiếu mà không có bằng chứng dương hoặc danh sách không đủ=>unknown; sao lưu không kích hoạt; không dùng Địa Không thay Kiếp. Không thêm quy tắc Phủ cứu giải.
