# Công việc — xác minh văn bản 2026-10-12

Đặc tả `career-source-decision-1.0.0`; mức xác minh văn bản, không phê duyệt chuyên môn. Bài mới 1.19.0, catalog 1.21.0. Giữ engine và snapshot.

## Quyết định C1: Hóa Quyền ở Quan Lộc

Nguồn trực tiếp: Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên, PDF 32, số in trên trang ebook 32, phần 2 §1.10. Đã đọc cả trang 31–33 và ảnh trang 32. Chưa xác minh phân trang ấn bản giấy khác.

Sách đặt câu hỏi về vị trí Tứ Hóa và lấy “Hóa Quyền ở cung Quan” làm ví dụ “được việc”. Đây là ví dụ riêng, không suy toán tử OR từ tiêu đề §8.20. Chỉ chú giải vị trí theo tài liệu, không thực thi kết luận tài lộc/danh chức của §8.20.

- Đầu vào: snapshot profile Tân Biên v2, cung Quan Lộc duy nhất; sao với tên hợp lệ, `scope=origin`, `mutagen=Quyền`. Không tính lại Tứ Hóa, không lấy từ năm xem.
- Điều kiện: có ít nhất một bằng chứng Hóa Quyền bản mệnh tại chính Quan Lộc. Không lấy tam hợp, đối cung, nhị hợp thay vị trí trong câu nguồn. Không yêu cầu Tử Vi hoặc một sao được hóa cụ thể.
- Trạng thái: không yêu cầu Miếu/Vượng/Đắc/Hãm; §1.10 không đặt điều kiện này. Không lấp trạng thái trống.
- Kỹ thuật: đọc majorStars/minorStars. Bằng chứng hiện diện cụ thể đủ cho nhận xét vị trí dù metadata sao khác còn thiếu. Chỉ xác nhận không hiện diện nếu đủ hai danh sách, khai báo độ đầy đủ và mỗi sao có scope cùng mutagen hợp lệ rõ ràng. Nếu thiếu: không có fact, evaluator giữ unknown/missing-facts. Cổng nguồn hiện hành và receipt vẫn áp dụng, là giới hạn dự án.
- Không coi sao lưu là bản mệnh; không coi thiếu scope là origin.
- Ngoại lệ: §1.10 không nêu ngoại lệ cho ví dụ vị trí; điều đó không chứng minh không có ngoại lệ cho lời luận toàn cung. §3.24 PDF40 có điều chỉnh “nhiều sao tốt/xấu”; chưa có ngưỡng và quan hệ đủ rõ để thực thi. Giữ giới hạn ngay trong đoạn mới.
- Nhận định: Hóa Quyền ở Quan Lộc là ví dụ Tứ Hóa “được việc” trong cách xét vị trí của sách; không xác nhận chức vụ, thăng tiến hoặc kết quả công việc. Chưa phối hợp với chính tinh, sát tinh hay phụ tá.
- Rule `tanbien.career-quyen-position`, draft, review=null; contentType=context; nguồn được ghi trong sourceReferences/projectScope. Không dùng trạng thái review làm chứng cứ văn bản.

## A: Phạm vi và trạng thái sát tinh

PDF18–20 §9.1–9.4: tam chiếu, xung chiếu, nhị hợp là quan hệ riêng; phạm vi khảo sát chung không phải toán tử mặc định mọi nhánh. PDF33 §2.6–2.9 định nghĩa tọa thủ/đơn thủ/đồng cung/hội hợp. “Gặp” tự nó không xác định duy nhất quan hệ: PDF38 có “gặp Kình đồng cung”; PDF165 §8.26 phân biệt Cơ–Nguyệt đồng cung và Tả–Hữu hội hợp. PDF163–164 §8.14 Sát tinh không ghi toán tử quan hệ ở đầu mục; không tự chốt P0/P1/P2.

PDF32 §1.11,39–40 định danh Lục Sát. PDF33 §2.10–2.11 có hai cơ sở: bản tính hoặc vị trí. Giữ riêng bằng chứng Miếu/Vượng/Đắc sáng, Hãm mờ; Bình riêng; Lợi/Bất/trống không lấp. Sát tinh Đắc có thể đồng thời có mô tả bản tính xấu; sách không cho bộ phân xử chung. Không tự tổng hợp nhiều sát tinh hoặc dùng đa số. Chưa thêm rule điều chỉnh §8.14.

Lỗi văn bản PDF20: ví dụ Sửu ghi Tý xung, Mùi tam hợp, không khớp các hình tam/xung/nhị hợp kèm theo; hình nhị hợp có ô Dần ghi Thân. Không sửa engine hoặc dùng câu ví dụ lỗi để đảo quan hệ đã lưu.

## B: Tử Vi–Thiên Tướng

PDF158 §8.1 và PDF162 §8.11 lặp trực tiếp cùng lời luận tổ hợp. Nhánh hiện hành R05 đúng phạm vi đồng cung; giữ một claim, không tăng sức nặng vì có hai vị trí dẫn.

PDF163–164 §8.14 nhóm có Tử và nhóm Vũ–Tướng có lời luận khác nhau. Chưa tìm được quy tắc nhóm nào thắng hoặc cách gộp ở các mục đã đọc. PDF34 Tử chế Hỏa–Linh và PDF37–38 Tướng chế sát/kỵ Kình đồng cung không cung cấp thứ tự ưu tiên áp §8.14. Các ý nguồn giữ riêng trong căn cứ; không xuất hai kết luận vô điều kiện cho ca Tử–Tướng.

## C: Tả/Hữu và Khoa/Quyền/Lộc

PDF164 §8.17/8.20 chỉ có tiêu đề liệt kê và một câu; không có “hay”, “hoặc”, “cả”, “đồng cung”, “hội hợp”. PDF39 §3.19 cho bản tính trợ tinh và hai chiều tăng tốt/tăng xấu, không làm rõ số lượng sao đủ cho §8.17. PDF40–41 §3.24–3.25 phân biệt tính Hóa Quyền với bộ Khoa gặp Quyền/Lộc, chưa chứng minh §8.20 là OR hoặc AND. Không tạo rule phụ tá hay tăng tài/quyền/lộc từ hai tiêu đề.

PDF165 §8.23 dùng rõ “Xương (hay Khúc)”; §8.26 có “đồng cung … hội hợp”; §8.29 ghi riêng Sát tại Dần/Thân gặp Quyền đồng cung. Đây là bằng chứng phải đọc điều kiện từng đoạn, không dùng một toán tử toàn sách. §8.29 không áp cho Tử–Tướng/Thiên Lương/Thái Âm hay riêng Quyền; ngoài nhánh C1 đang triển khai, không mở rộng các tổ hợp chuyên biệt khác trong đợt này.

## Expected trước kiểm thử

C1: 1992 Tử Vi Quyền ở Quan → thêm đúng một chú giải vị trí. Kim Thoa Tử Vi Khoa ở Quan → không tạo claim Quyền; metadata thiếu không bị đổi thành vắng mặt. Thiên Lương Quyền ở Quan (16/08/2001), Thái Âm Quyền ở Quan (05/04/1998) → cùng chú giải, không hardcode tên sao hoặc hồ sơ. Đổi sao Quyền ra đối cung → không đủ vị trí. Scope năm/đại vận, thiếu scope/mutagen/danh sách/cung trùng → không tạo claim; khác profile → wrong-profile. Thiếu độ sáng không chặn hiện diện Quyền. Sát tinh/Tuần/Triệt không được ngầm tạo hóa giải hoặc xóa chú giải vị trí. Draft bị chặn ở customer. Toàn bộ rule cũ giữ nguyên claim và trạng thái; lịch sử giữ byte nguyên vẹn.

Đối chiếu thêm PDF108–110 §4.2.18 (đã đọc ảnh108/110): mục Mệnh ghi rõ “Tả Phụ hay Hữu Bật” ở câu đầu, nhưng các cách khác ghi đồng cung, giáp và xung/hội chiếu riêng. Điều này phản bác việc ép mọi dấu phẩy thành AND; cũng không chứng minh §8.17 Quan Lộc là OR. Không chuyển lời luận Mệnh sang Quan Lộc.
