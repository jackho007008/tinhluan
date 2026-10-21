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


## Lô Quan–Tài 1.59.0 / catalog1.56.0 — 21/10/2026

Baseline thực tế `main` sạch `e9fdbbd`, code `e7bd1e4`; dựng lại192 báo cáo khớp1.58. Dùng ma trận45 mục Quan và103 hàng Tài đã audit, không đọc lại chương. Chỉ đối chiếu câu Quan159§8.4/5 (ảnh), văn đối xứng161§8.9/10–162; Tài191§12.4 (ảnh)/192§12.9; câu VCD166–167/197 (ảnh197). Code `bb230d5`, module `quan-tai.ts`, dùng evaluator/facts/renderer chung; draft/review=null.

Hai giới hạn triển khai cũ được thay trong phạm vi câu toàn thời đoạn:

- **Vũ–Tham tại Quan**, PDF159§8.4/161§8.9: “Lúc thiếu thời mọi sự chẳng được hành thông, từ 30 tuổi trở đi, mới được xứng ý toại lòng.” Cả câu kinh doanh, điều kiện “nếu có danh chức” và diễn tiến được giữ cùng nhau. Không cần tính tuổi hiện tại để xuất nguyên nhận định; không chọn vế thuận rồi coi đã áp. Không suy trước30 là mọi việc thất bại, không quyết định tuổi mụ/dương hoặc dùng năm xem. Cấu trúc: đủ hai chính tinh bản mệnh đồng cung Quan; không thêm chi/độ sáng/giới tính/TT mà câu không đặt.
- **Nhật–Cự tại Quan/Thân**, PDF159§8.5/161–162§8.10: “công danh thăng giáng thất thường, hay mắc thị phi quân sự. Về già mới được xứng ý toại lòng.” Giữ cả diễn tiến và phạm vi quân sự; không xác định tuổi “già”, không tư vấn nghề hoặc dự báo sự kiện. Cổng Thân giữ nguyên, không mở sang Dần.

Đây là triển khai yêu cầu giữ điều kiện tuổi/thời đoạn của task; không áp cơ chế chú giải cưới/sinh được duyệt riêng ở Tử–Phu. Nhận định mới không xác nhận thời đoạn đã đến hoặc kết quả đã xảy ra. Văn toàn đoạn và cách tạo ở [bàn giao](../.local/quan-tai-20261021/ban-giao.md).

Bộ192: Quan28→24 trống,4 mới có nhận định/1 cung đã có được bổ sung. Vũ–Tham khớp4, Nhật–Cự/Thân khớp1. Mẫu engine ngoài192: nam20/02/1978, giờTỵ; Nhật–Cự/Thân kiểm form bằng mẫu trong192 nam06/05/2008 giờSửu. Fixture chỉ dùng kiểm cấu trúc/near-miss, không thay bằng chứng engine.

**Điểm còn chặn:** DươngTý có hai lời trái nhau và Thìn dẫn chiếu; Cơ–Âm ghiThìn không phù hợp cấu trúc engine, chữ “về khoa” và nhánhDần “như trên” chưa rõ; Tử–Tham phụ thuộc “công danh rực rỡ” chưa có tiêu chí; Liêm–Tham/SátThìnTuất không có câu nghề độc lập đủ phạm vi để bỏ hình ngục/binh thương. §8.14–44 còn nhóm thiếu lượng từ, định danh hoặc quan hệ như ma trận; Sát–Quyền vẫn không tương thích profile hiện hành, không tìm hàng loạt ngày để né chứng minh đó.

**VCD166–167§8.45:** sau chỉ dẫn mượn là giới hạn “công danh không thể hiển đạt”, chức vị bình thường, rồi ngoại lệ TT và Nhật–Nguyệt cùng sáng. Chưa có phép áp giới hạn vào từng lời cặp nêu hiển đạt/phú quý và phân vị trí/trạng thái/ngoại lệ. Không thể chỉ bỏ điều kiện tính trạng thái để chép nguyên cặp từ đối cung hoặc tự chọn lời thắng. Đây là thiếu cách áp nguồn, khác giới hạn tính tuổi vừa bỏ. Trong phạm vi ma trận đã rà, không còn câu đủ đặc tả bị treo coding sau lô này; không tuyên bố đã khai thác hết sách.
