# Mệnh – văn tinh và Kỵ/Khoa, 1.44.0

Phạm vi: M05/M07 theo nghiệm thu 1992. Catalog `interpretation-1.44.0`, trình bày `1.44.0`, phương pháp `tanbien-life-literary-1.0.0`. Hai rule `0.1.0`, draft, review=null. Engine, bảng nguồn hiện hành, evaluator, P1/P2 và lịch sử không đổi.

## Nguồn và điều kiện

Tử Vi Đẩu Số Tân Biên — Vân Đằng Thái Thứ Lang; PDF277 trang, SHA-256 `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`. Số trang dưới đây là PDF, khớp số hiển thị trên bản số hóa, không khẳng định phân trang ấn bản giấy khác. Ảnh quyết định nằm trong `docs/evidence/life-literary/`; mở qua tuyến nội bộ `/internal/editorial/life-literary`.

### M05 / tanbien.life-wu-literary-male

Đọc PDF65–67, bảng34–35, định nghĩa33. Mục Nam mệnh bắt đầu65; câu tại66: Vũ miếu/vượng/đắc gặp Xương **hay** Khúc **đồng cung**, gắn với “tài kiêm văn võ”.

- Nam; Vũ Khúc bản mệnh tọa Mệnh; trạng thái từ bảng Vũ Tân Biên hiện có, không dùng brightness engine.
- Văn Xương OR Văn Khúc đồng cung Mệnh. Không yêu cầu cả hai, không yêu cầu Vũ đơn thủ, không thêm trạng thái văn tinh.
- Không mở sang nữ mệnh hoặc hội chiếu. Chỉ giữ thuật ngữ văn/võ như lời nguồn; không quy đổi thành nghề, bằng cấp hay năng lực thực tế.
- Không nhập các câu khác về “nhiều sao sáng”, Vũ hãm hoặc các bộ sao khác làm ngoại lệ không được nêu cho câu này.

R02 giữ điều kiện và claim cũ về học hỏi với Văn Khúc. Khi cùng khớp, `continuous-report` gom hai mệnh đề trong một cụm và giữ đủ hai bộ căn cứ. Không gọi là hai bằng chứng độc lập hoặc quan hệ điều chỉnh. Tổng quan giữ từng claim trong cùng mục học hỏi; không dùng một phép luận mới để xóa R02.

### M07 / tanbien.life-ky-khoa-ty-hoi

PDF120, đọc ngữ cảnh118–121: Kỵ tọa Mệnh Tý/Hợi, Khoa **đồng cung hoặc xung chiếu**. Tý đối Ngọ; Hợi đối Tỵ. Không mở thành mọi hội chiếu; không đổi bảng Tứ Hóa sang Hàm Số168. Không nhập câu tiếp Khoa–Lương với “nhiều sao sáng”.

Diễn đạt phần độc lập về sự cẩn thận trong lời nói và việc làm. Các khẳng định khôn ngoan, phẩm hạnh hay sự kính trọng thực tế không đưa vào sản phẩm; không đổi thành một lời tích cực khác. Nguyên đoạn giữ trong ảnh/căn cứ.

Đây là **lời tổ hợp độc lập**. Không có claim nền Kỵ tương ứng được thay thế hay điều chỉnh. Không xóa Kỵ, Kình hoặc lời Khoa–Địa Kiếp.

## Hợp đồng dữ liệu

Dùng validator12cung/14chính tinh và `verifiedNatalTransformations` hiện hành. M05 cần danh sách phụ tinh đầy đủ, bản mệnh, không trùng; giới tính nhất quán với đầu vào an sao. M07 cần chứng nhận Tứ Hóa hợp lệ. Thiếu/sai/mâu thuẫn dữ kiện giữ unknown, không coi vắng sao. Địa chi Mệnh ngoài Tý/Hợi xác nhận ngoài nhánh M07.

Các cổng này là điều kiện kỹ thuật của dự án. Không bổ sung chứng nhận vào snapshot lịch sử. Facts chẩn đoán chỉ dẫn các đường dẫn thực có; thiếu dữ kiện được mô tả trong lý do, không tạo đường dẫn giả.

## Kỳ vọng từ nguồn

- M05: nam + Vũ sáng + Xương hoặc Khúc cùng Mệnh → khớp; nữ/Vũ hãm/văn tinh chỉ ở đối cung → không khớp; giới tính/bảng/danh sách không xác minh được → unknown.
- M07: Kỵ tại Mệnh Tý, Khoa Tý/Ngọ → khớp; Khoa Thìn hoặc Tuất → không khớp; thiếu hoặc mâu thuẫn chứng nhận → unknown. Hợi/Tỵ tương tự theo đúng cặp đối cung.
- 1992: M05 khớp; M07 không khớp do Khoa ở Tuất. Không hardcode hồ sơ.

Hai fixture JSON M07 là đầu ra engine từ ngày sinh tổng hợp, có receipt, không sửa sao. Mẫu Hợi trong unit test là fixture kỹ thuật, không phải mẫu engine. Phạm vi tìm hữu hạn, log lỗi và mẫu số nằm trong bàn giao.

## Nghiên cứu chưa phát hành

M06 chưa chốt lượng từ danh sách Xương/Khúc/Khôi/Việt. Định nghĩa hội hợp không tự quyết định AND/OR. Phủ/Kình đã phân biệt một đến ba sát tinh với đủ bốn, và định nghĩa ảnh hưởng đồng/xung/hợp trong NPL; vẫn chưa đặc tả đủ tập ngoại lệ/phương diện để điều chỉnh sản phẩm. Không dùng cứu bệnh/tai họa thành lợi tài hoặc giảm nóng nảy. Không thêm rule hai nhóm này.

## Kiểm chứng

Xem `.local/menh-than-evidence-20261015/ban-giao.html`, Markdown/JSON và log cùng thư mục. So toàn bộ claim/fact/trace cũ trên192v2, không chỉ so số lượng. Những kỳ vọng phiên bản/số rule hiện hành được cập nhật đúng hai rule; kỳ vọng lịch sử giữ nguyên. Không coi test kỹ thuật là thẩm định chuyên môn.
