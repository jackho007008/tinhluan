# Công việc 1.23.0 — hợp đồng dữ liệu và các nhánh độc lập

## Phạm vi và mức xác minh

Baseline đọc1.22.0. Không đổi phép an, lịch, rule cũ, snapshot hoặc bản đọc lịch sử. Data contract natal-transformations-1.0.0 mới ở adapter v2; engine vẫn tanbien-trial-0.3.0. Đây là chứng nhận đầu ra tính toán, không phải phê duyệt chuyên môn hay hòa giải nguồn can Tân.

## Hợp đồng Tứ Hóa

applyTanBien xóa mọi mutagen rồi gán bốn mục theo bảng sẵn có (trace mutagens). Trước đây DTO không chứng nhận đủ bốn mục; absence của thuộc tính không cho facts quyền phủ định. Không fallback từ snapshot cũ sang tính lại.

Adapter mới sau phép an xác minh trace có đúng bốn sao phân biệt, mỗi Lộc/Quyền/Khoa/Kỵ có đúng một sao bản mệnh, đúng vị trí và scope; lưu danh sách bốn gán với path, source, sourceStatus, method, version. Thiếu hoặc lệch chặn chứng nhận. Không thêm mutagen rỗng vào sao. Facts mới chỉ dùng certificate hợp lệ để xác nhận không có Kỵ ở Quan. Các facts/rule nguồn cũ không đổi bảng hay cơ chế metadata của chúng.

- Không có thuộc tính: không biết nếu chỉ nhìn riêng sao, có thể xác nhận không Hóa khi hợp đồng đủ hợp lệ bao phủ đầu ra.
- Chuỗi rỗng: giá trị tường minh ở bản lưu, không mặc nhiên chứng minh danh sách đầy đủ.
- Sao không được Hóa: kết quả không có trong bốn gán đã chứng nhận; không phải một trong bốn gán thiếu.
- Chưa xác định: không có certificate hợp lệ hoặc metadata/danh sách thiếu; giữ unknown/missing-facts.
- Source-conflict là trạng thái quy ước, khác với độ đầy đủ phần mềm. Can Tân giữ phương pháp hiện hành, không tự đổi Quyền. Certificate lưu sourceStatus để không che mâu thuẫn.

## Nguồn đã đọc

Tân Biên 277 trang: toàn mục Quan Lộc PDF158–167, số chân trang ebook trùng; định nghĩa đồng cung PDF33§2.8 đã xác minh trước; ảnh165 và166 đối chiếu trực tiếp cả đoạn Kình–Lực qua trang. Không coi dấu phẩy là toán tử: §8.23 có “hay” và “đồng cung”; §8.29 có “đồng cung”; §8.32 có “đồng cung”. Thiên Lương giữ vai trò bổ sung khi thiếu; không có xung đột cùng đối tượng/điều kiện/phạm vi được chứng minh cho ba nhánh này trong hồ sơ nguồn hiện có. Không dùng ưu tiên Thiên Lương để thay toàn mục.

## Ba đặc tả trước kiểm thử

Tất cả chỉ Quan Lộc, sao bản mệnh; scope khác/thiếu không làm witness dương. Positive đủ witness; negative đòi danh sách đủ, scope rõ (hoặc vòng Bác Sỹ bản mệnh tường minh trong tanBien). Unknown không là false. Phương pháp trạng thái none: không nhánh nào yêu cầu sáng/mờ. Không dùng bảng1.21.0 để đổi điều kiện.

1. §8.32 PDF165–166: Kình Dương AND Lực Sỹ đồng cung Quan. Lực Sỹ lấy vòng Bác Sỹ bản mệnh boshi12. Kết quả cục bộ: công danh trắc trở, ít được ghi nhận, công việc khó bền, bất đắc chí; không áp vào chức vụ/sự kiện thật. Không có ngoại lệ riêng trong đoạn; không suy là toàn lá số không còn điều chỉnh.
2. §8.23 PDF165: Tham Lang AND (Văn Xương OR Văn Khúc) đồng cung Quan Hợi hoặc Tý. Cả hai Xương/Khúc chỉ một claim. Nguồn mô tả danh chức/biết tiếng/tài lộc; giữ là nhận định của nguồn, không xác nhận thu nhập/chức vụ thực tế. Không thêm độ sáng hoặc tác động tương tác chưa có nguồn.
3. §8.29 PDF165: Thất Sát ở Quan Dần hoặc Thân AND Hóa Quyền bản mệnh cùng cung. Không thay đồng cung bằng tam hợp/đối cung. Kết quả chỉ diễn giải uy quyền/vị nể theo đoạn; không suy nghề/quyền chức hiện thực. Có thể không có mẫu hợp lệ trong engine; không nới điều kiện để khớp.

Nhánh Kỵ1.22.0 vẫn có ngoại lệ Nhật–Nguyệt Sửu/Mùi loại nhánh nền. Cổng nguồn Kim Cục ngày21/24 giữ nguyên. Mẫu đầu tiên tìm được ngoại lệ rơi cổng này: không tháo cổng mà tiếp tục tìm trong cùng phạm vi hữu hạn.

## Expected độc lập với output

Từng nhánh đủ các toán hạng nêu trên -> đúng một claim; thiếu một nhóm đã xác nhận -> không khớp; thiếu dữ liệu nhóm không có bằng chứng phủ định -> unknown; đổi phạm vi sang sao lưu hoặc cung khác -> không kích hoạt. Mẫu ngoại lệ Kỵ cần vừa thỏa hình học/Tứ Hóa vừa qua cổng nguồn; không có đồng thời nền và ngoại lệ. Fixture sửa sao chỉ kiểm tra kỹ thuật, không gọi là engine thật.
