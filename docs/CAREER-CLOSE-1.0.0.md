# Chốt Công việc — phương pháp nội dung1.25.0

Đây là đóng phạm vi, không tuyên bố tổng hợp đầy đủ Quan Lộc. Tân Biên là nguồn của22nhánh mới, đủ lời trực tiếp nên không ghép Thiên Lương. Không có xung đột trực tiếp mới được xác minh ở những câu chọn. Rule draft/review=null.

## Danh mục trước khi kiểm tra độ phủ
`career-closing.ts` là đặc tả22nhánh: Phủ đơn thủ2, Tử–Phủ, Tướng đơn thủ3, Đồng–ÂmNgọ/Đồng–Lương/Đồng–Cự, Cơđơnthủ2/Cơ–Lương, CựHợi/Tỵ, LươngTýNgọ/SửuMùi, Nhật–LươngMão/Dậu, PháDầnThân/Tử–Phá, ÂmDậuHợi/Tuất. Mỗi câu cópage/section vàstars/branches được chốt từ văn bản trước khi chạy tập đánh giá.
Nguồn Tân Biên277trang, hash4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc. PDF158–163, số chân trang trùng sốPDF tại các trang này. Tái sử dụng ảnh158/159/161/162/163 từ đợt trước; đọc lại ảnh160/161/162 trong đợt này cùng toàn văn158–163. Định nghĩa đồng cung/độc thủ PDF33 được tái sử dụng. Không tuyên bố đọc lại toàn sách.

Nguồn nêu trực tiếp sao, quan hệ đồng cung/đơn thủ và địa chi. Kỹ thuật hóa: phải bản mệnh tại chính Quan; cặp có đủ hai nhân chứng chính tinh; đơn thủ có đúng một chính tinh và chứng cứ danh sách đầy đủ. Sai một điều kiện đã biết =>false; thiếu điều kiện =>unknown; không dùng sao lưu hoặc sao chiếu. Không yêu cầu trạng thái miếu/hãm. Đoạn không nêu ngoại lệ riêng không có nghĩa toàn sách không có điều chỉnh. Không tự áp các câu§8.14 còn thiếu cách phối hợp.
Các từsớm/muộn/thời gian ngắn chỉ là mô tả định tính, không tạo điều kiện tuổi/năm. Vũ–Tham mốc30tuổi không triển khai vì có điều kiện thời gian cụ thể chưa đặc tả. Bản văn Cơ–Nguyệt “Thìn”, “về khoa” và nhánh nối “như trên” không tự sửa thành phương pháp khác. Nhật–Nguyệt/Quantrống vẫn cần điều chỉnh chưa xác định. Các nhóm liệt kê không suyAND/OR. Sát–Quyền vẫn không tương thích như chứng minh1.24.0.

## Biên tập
Không thay claim/điều kiện cũ. `editorialText` chỉ rút câu kỹ thuật “không đòi Hóa Quyền”, lời giới hạn lặp và định nghĩa võchức của nhóm1.24.0. Nguyên vănclaim còn ở căn cứ kỹ thuật; điều kiện không yêu cầuQuyền đã ghi trong metadata. Cấu trúc thực tế vàworkNotice một lần ở đầu phần Công việc; mỗi ý còn giới hạn riêng. Không tạo lời tổng kết tốt/xấu. Bản lịch sử dùngtext đãfreeze, không áp lạibiên tập.
Nguồn căn cứ không thay thế chuỗi“Tân Biên”bên trongtên tácgiả/tácphẩm; nguồn bảng vàđịnh nghĩa tách biệt. Giữnguồn snapshotriêng.

## Bộ đánh giá độc lập, cố định trước khi chạy
192đầu vào: năm1978/1983/1988/1993/1998/2003/2008/2013 × tháng2/5/8/11 × ngày6/18 × giờ1/9/17; genderluânphiên,minute0,VNUTC7profilev2. Không dùng1994/1995/1996của bộ phát triển1.24. Không sửa rule để tăng tỷ lệ sau xem kết quả. Cấu trúcQuan=địachi+đúng bộ chính tinh đã lưu; dedupđầu vào=profile/date/hour/minute/gender/calendar/timezone. Không đếm các phiên bản bài lưu. Không đại diện khách hàng hay độ chính xác dự đoán.
Phân loại loại trừ nhau: bị chặn nguồn vị trí; có lời chính tinh; chỉ phụ tinh/TứHóa; chỉ dữ kiện. Thống kê các traceunknown riêng, không gọi mỗiunknown là vấn đề của lá số. Mẫu tìm nhánh bổ sung ngoài192tách riêng, không cộng vàođộphủholdout.

## Expected kiểm thử nguồn
22ca kỹ thuật đúngsao/chi/độc thủ=>1claim tươngứng; bỏtừngsao, saicung, di chuyển sao sang đối cung, layerlưu=>khôngclaim; thiếu list và bằngchứng=>unknown; thêm chính tinh khiđộc thủ=>false. Không yêu cầubrightness nênunknowntrạngthái khôngchặn. Chỉ mộtclaimcho tổhợp đối xứng (Đồng–Lương, Cơ–Lương...). Không ngầm dùng ngoại lệTuần/Triệt củaNhật–Nguyệt cho nhánh khác. Kháchhàng0draft. Giữhashengine vàlịchsử.
