# Công việc 1.24.0 — đặc tả nguồn 1.0.0

Ngày 12/10/2026. Rule dự thảo, review=null; đối chiếu văn bản không phải duyệt chuyên môn.

## Nguồn và phạm vi
Tân Biên của Vân Đằng Thái Thứ Lang, bản PDF277trang, SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc. PDF158–167 là mục Quan Lộc; số chân trang cùng số PDF ở các trang này, không khẳng định số trang mọi ấn bản. Đã đọc toàn mục ở đợt1.23; đợt này xem lại ảnh158,159,161,162,163,165 và đoạn trước/sau cho các nhánh chọn. Đồng cung/độc thủ theo định nghĩa PDF33; danh sách chính tinh đầy đủ là ràng buộc kỹ thuật để xác nhận độc thủ.

Không có xung đột trực tiếp cùng điều kiện/phạm vi đã xác minh với Thiên Lương cho các câu được chọn; dùng Tân Biên, không lấy lời Mệnh/hạn của Thiên Lương thay lời Quan. Không thay quy tắc nguồn của các nhánh cũ.

## Điều kiện trực tiếp và kết quả được phép
Danh sách chính thức, câu diễn giải đầy đủ, trang/mục và ID nằm trong `lib/interpretation-rules/career-occupations.ts` (16 nhánh). Các điều kiện là:
- Liêm Trinh độc thủ Dần/Thân (§8.2); Liêm–Phủ, Liêm–Tướng, Liêm–Sát, Liêm–Phá đồng cung (§8.2, đoạn đối xứng ở8.7/11/13/14). Giữ vế thăng giáng/rủi ro của Liêm–Sát và bất đắc chí của Liêm–Phá.
- Vũ Khúc độc thủ Thìn/Tuất; Vũ–Phủ, Vũ–Tướng, Vũ–Sát, Vũ–Phá đồng cung (§8.4). Giữ thăng giáng/chật vật; Vũ–Phủ có liên hệ tài chính/kinh tế trực tiếp, không suy nghề hiện đại cụ thể.
- Tham Lang độc thủ Thìn/Tuất hoặc Dần/Thân (§8.9). Nhánh Dần/Thân giữ cả công danh trắc trở/chức vị thấp và vế buôn bán.
- Thất Sát độc thủ Dần/Thân hoặc Tý/Ngọ (§8.13). Tý/Ngọ giữ trở ngại/may rủi. Tử–Sát đồng cung (§8.1/13) chỉ liên hệ quân sự/uy quyền theo sách.
- Thiên Đồng, Thái Âm và Kình Dương cùng Quan tại Ngọ (§8.25): cả ba do câu “đồng cung” trực tiếp, không suy toán tử cho mục liệt kê khác. Giữ nghĩa lịch sử võ quan biên thùy/thời loạn; không gán danh hiệu anh hùng cho người đọc.

Mọi sao phải bản mệnh tại chính Quan. Độc thủ cần đúng một chính tinh, phạm vi hẹp được kỹ thuật hóa, không phải phụ tinh vắng mặt. Cặp cần hai sao được ghi trong danh sách chính tinh; bộ ba cần ba nhân chứng bản mệnh. Thiếu dữ kiện => unknown nếu không có điều kiện khác chứng minh sai; danh sách đầy đủ xác nhận vắng mặt => false. Không dùng sao lưu hay sao chiếu thay đồng cung. Branch không biết => unknown. Không cần brightness: không sử dụng bảng trạng thái nào để kích hoạt hoặc loại các câu này.

Đoạn nguồn chọn không đặt ngoại lệ riêng. Đây không phải chứng minh toàn sách không có điều chỉnh. §8.14 sát tinh/phụ tá chưa có phép hợp nhất nên các câu chỉ là liên hệ cục bộ theo sách, không kết luận toàn cung. Không tạo điểm/nghề khuyến nghị/thời điểm. Một cặp chỉ tạo một claim dù sách nói lại ở hai mục. Nguồn giữ hai vị trí dẫn.

## Sát–Quyền §8.29
Ảnh PDF165 đúng chữ “Sát tọa thủ tại Dần, Thân gặp Quyền đồng cung”. Không có chỉ dẫn lớp Hóa khác ở đoạn này.
Phép an hiện hành z=Tử Vi, Phủ=4−z mod12, Sát=Phủ+6=10−z. Sát tạiDần2 => z8; tạiThân8 => z2. Liệt kê14chính tinh cho12z cho thấy Sát đứng một mình ở hai vị trí này. Cả10can gán Quyền cho chính tinh và không can nào gán Sát. Do đó Hóa Quyền bản mệnh không đồng cung Sát ởDần/Thân theo profilev2/formula0.3.0. Tính cả fallbackz vào0..11 vẫn không đổi chứng minh.
Script đọc mảng nguồn trực tiếp: `.local/career-occupations-20261012/proof.py`; kết quảproof.json. Không quét ngày sinh để chứng minh bất khả thi. Giữ rule/spec trong xuất research/fixture; loại khỏi catalog mới và không tính độ phủ. Lịch sử1.23 không đổi. Cần tài liệu xác định Quyền trong câu là lớp/phương pháp khác, hoặc khảo dị văn bản; không tự sửa sách/engine.

## Căn cứ
Block cơ sở ghi snapshot. Block trạng thái dùng nguồn đúng của từng sao từ bookState, tách định nghĩaPDF33 và nhóm§8.14. Block Tử Vi chỉ dẫn Thiên Tướng nếu có Thiên Tướng. Không gắn§8.1 làm căn cứ chung.

## Nghiệm thu dự kiến trước chạy
Mỗi nhánh: đủ điều kiện => một claim; bỏ từng sao/saiQuan/scopeyear => không claim; sai chi => khôngclaim; thiếu danh sách cần thiết =>unknown; độc thủ thêmchính tinh =>false. Brightnessunknown không chặn vì không yêu cầu. Bộ ba saiNgọ khôngkhớp. Draftcustomer0. Các claimcũ ngoàiSatQuyen giữnguyên. Không đổi snapshot/engine. Fixtuređổi sao chỉ testlogic; mẫuengine từđầu vàohợp lệ táchriêng.
