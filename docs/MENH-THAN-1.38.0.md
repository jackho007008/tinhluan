# Mệnh–Thân 1.38.0 — đặc tả trước triển khai

Baseline ứng dụng 1.37.1, catalog 1.37.0, căn cứ NPL npl-evidence-process-1.0.0. Không thay engine hoặc diễn giải các cung khác.

## Các quyết định

1. **Thiên Lương, Tử Vi Nghiệm Lý Toàn Thư, bản 298 trang, PDF181** (không có số trang in khác được xác minh). Đọc ngữ cảnh PDF180–182, đối chiếu ảnh181. Mệnh được tác giả giải thích như khuôn khổ định mệnh; Thân là thân thế hành động có chấp nhận khuôn khổ đó không. Tác giả phân biệt Mệnh/Quan/Tài với Di/Phúc/Phối bằng cùng/khác tam hợp, dùng từ “như”. Triển khai **chú giải quan hệ biểu tượng**, không đánh giá hành vi thực tế hoặc sự phục tùng/chống đối của người đọc. Ba nhánh loại trừ nhau: đồng cung; Quan/Tài cùng tam hợp; Di/Phúc/Phối khác tam hợp. Vị trí tên cung và địa chi phải nhất quán; không dùng tên cung một mình. Đường dẫn đủ 12 cung, duy nhất Mệnh, duy nhất cờ Thân boolean, địa chi duy nhất và hợp lệ. Không cần độ sáng, giới tính, tuổi hoặc nhóm sao: đây là điều kiện của đoạn định nghĩa, không phải các ví dụ Giáp Thìn/Khổng Minh. Vòng Thái Tuế/Tràng Sinh ở đoạn sau chưa được xét để kết luận cụ thể. Không áp nhận định phẩm hạnh của ví dụ. Quan hệ với claim cũ: bổ sung ngữ cảnh nguồn, không thay/điều chỉnh lời sao.

2. **Nguyễn Phát Lộc, Tử Vi Hàm Số PDF/trang in40–41**. Đối chiếu ảnh40–41: khi xem Thân không bỏ Mệnh; cung an Thân được chú ý hơn. Triển khai chú giải vai trò cung an Thân và liên kết đúng cung, không tăng trọng số hoặc nhân đôi claim. Dữ kiện: cùng hợp đồng vị trí trên, một trong sáu vị trí được nguồn nêu; không fallback vị trí khác. Đây là bổ sung tương thích ở cấp phạm vi xét, độc lập với cách phân nhóm của Thiên Lương; không ghép thành kết luận vận mệnh. Giới hạn: không dùng tuổi30 để bật/tắt Mệnh–Thân, không chuyển lời Quan/Tài thành tính cách. NPL Tổng Hợp PDF/trang in24 có cả quan điểm hậu vận, ranh giới không cố định và ảnh hưởng “gấp bội”; không triển khai phần thời điểm hoặc độ mạnh. Chỉ dùng Hàm Số cho chỉ dẫn phạm vi này.

3. **Tân Biên PDF/trang in52–55**. Có nhận định hai cung sáng/tối, nhóm sao và các nhánh Thân cư. Chưa định nghĩa lượng từ “nhiều”, mức tốt/xấu toàn cung và lượng từ danh sách nhóm sao. PDF54 dòng Thân cư Tài còn câu “Tọa thủ: hay có…” bất nhất; không chọn sao/ngưỡng để làm khớp hai hồ sơ. PDF55 nhánh Quan có Tuần/Triệt, Kiếp/Kỵ và giới tính; không suy mọi Thân cư Quan có trở ngại. Phần tuổi30 ở52 không được đưa thành ngưỡng sản phẩm theo phạm vi đã chốt. Không kết luận nguồn không có nhánh, chỉ chưa đủ đặc tả cho nhánh tương ứng.

4. **Hai chính tinh ở Mệnh**: NPL Tổng Hợp107–112, ảnh109/112. Trang109 có quy tắc sinh/khắc ngũ hành với Bản Mệnh nhưng không quy định xóa lời đơn sao; trang111–112 đề nghị thử nghiệm tương quan Cục–Thân. Không chuyển đề nghị kiểm nghiệm thành phép đã xác minh. Tân Biên các lời Vũ–Phủ hiện có vẫn giữ điều kiện và giới hạn; không thêm kết luận Vũ–Tướng. Không tự gộp hai nghĩa đơn sao. Cần đoạn quy định tác động cụ thể tới cùng khía cạnh/điều kiện của lời đơn và tổ hợp, không cần tác giả gọi tên mã rule.

## Phân loại và giới hạn

Hai phương pháp thực thi là **ngữ cảnh quan hệ Mệnh–Thân** và **vai trò cung an Thân**, không phải dự đoán mới về tiền, chức vụ, tính cách hay kết quả tổng hợp. Chúng có claim draft/review=null, facts dẫn xuất và trace trong catalog hiện có. Không gọi quan hệ hình học là hai bằng chứng độc lập. Giữ đầy đủ claim cũ.

Các trang mới đọc trực tiếp: TB52–55; TL180–182; Hàm Số40–41; Tổng Hợp24–25,107–116,121 và137–138. Tái sử dụng hồ sơ đã đọc26–32/73–75/121–124/241–242 ở đợt trước; không tuyên bố đọc toàn sách. File/hash ở source/identity.json. Trích xuất toàn file chỉ phục vụ tìm kiếm, không đồng nghĩa đã đọc toàn văn.

## Kết quả triển khai và kiểm tra

- Hai hồ sơ chính xác nhận từ snapshot: Kim Thoa Mệnh Vũ–Tướng tại Dần, Thân cư Tài Bạch tại Tuất; 1992 Mệnh Vũ–Phủ tại Tý, Thân cư Quan tại Thìn.
- Ba nhánh Thiên Lương loại trừ nhau và một chú giải NPL được đưa vào catalog/evaluator hiện có; trạng thái draft/review=null. Mỗi hồ sơ đủ điều kiện có một nhánh Thiên Lương và một chú giải NPL, không cộng thành hai bằng chứng dự đoán.
- Bộ192 v2:64 Phúc,64 Phu Thê,64 Thiên Di; thêm384 claim ngữ cảnh, không xóa/thay claim cũ. Không tăng độ phủ lời luận tổ hợp. Tài chính và các cung ngoài Mệnh đối chiếu giữ nguyên.
- Mười bản mới lưu với parentId, gồm tám mẫu hiện hành và hai đối chứng engine cũ đã có receipt hợp lệ cho Thân cư Mệnh/Phu Thê. Hai đối chứng dùng bản so sánh mới tạo bằng mã1.37.1 trên chính snapshot ấy, không ghi đè bản lịch sử1.11/1.25; không cộng chúng vào192.
- Unit/integration đầu:2807 đạt/2 lỗi; sửa cổng dữ liệu và ánh xạ/expected của các claim mới, nhóm sửa45/45 đạt. Cuối:77 file,2810 đạt,0 lỗi,0 bỏ qua. Typecheck đầu thiếu union section mới, cuối đạt; build production đạt. Hồi quy bắt lỗi contextLink section cũ bị đổi; đã tách và xác nhận section cũ giữ nguyên.
- QA3035:22 lượt mobile360/390, tạo–lưu–mở lại, đổi hồ sơ, liên kết cung an Thân/căn cứ, kiểm tra không trùng claim, quyền vô danh/saiOrigin và ba bản lịch sử. Ba E2E liên quan đạt một worker/0retry; không tuyên bố chạy toàn bộ E2E.
- HTML20 lượt mobile khớp nội dung component, căn cứ mở, không tài nguyên ngoài. 631 tệp lịch sử/engine/lịch/rule cũ ngoài đăng ký catalog/derived không đổiSHA256.
- Bàn giao `.local/menh-than-20261013/ban-giao.html`. Không có nguồn mới được gán trạng thái chuyên gia duyệt.
