# Bản vá đọc dữ liệu Hóa Quyền 1.25.1

Phạm vi Công việc và lời nguồn giữ tại 1.25.0. Chỉ sửa `careerQuyenFact`, tăng phiên bản fact 1.1.0, catalog/bài đọc 1.25.1; không đổi rule Quyền, evaluator, adapter, bảng Tứ Hóa hoặc Kỵ.

## Hợp đồng

- Có witness bản mệnh tại Quan và không có chứng nhận: vẫn xác nhận dương như lịch sử.
- Chứng nhận được cung cấp: phải qua `verifiedNatalTransformations`, kiểm tra lại toàn bộ bốn gán, path, sao, cung, chi, scope, phương pháp, nguồn và phiên bản với trace đã lưu. Chứng nhận không nhất quán chặn cả dương và âm, không bỏ qua nó để lấy witness thuận tiện.
- Chứng nhận hợp lệ và Quyền ở cung khác: absent. Không cần mọi sao có thuộc tính mutagen.
- Không chứng nhận, không witness dương: unknown. Metadata rỗng cục bộ không chứng minh đủ bốn gán toàn lá số. Bài cũ vẫn đọc nguyên bản đóng băng; không bổ sung chứng nhận cho snapshot cũ.
- Giữ nguyên `sourceStatus` cả khi có mâu thuẫn can Tân. Chứng nhận độ đầy đủ phần mềm không giải quyết mâu thuẫn nguồn. Không sửa công thức.

## Expected và nghiệm thu

Dùng nguyên 192 đầu vào 1.25.0; trước sửa tính lại và kiểm tra từng resultId bằng baseline, sau sửa dùng lại chính các snapshot này, không tính lại. Trước: 10 present, 12 absent, 170 unknown. Sau: 10 present, 182 absent, 0 unknown. Đối chiếu toàn văn/rule của mọi claim, mọi trace ngoài Quyền và facts Kỵ: không thay đổi. Nhóm lời chính tinh / chỉ phụ tinh-Tứ Hóa / chỉ dữ kiện giữ 137/15/40. Không gọi giảm unknown là tăng độ phủ lời luận.

Fixture kỹ thuật kiểm tra chứng nhận thiếu, version/scope/status/path/star/palace/branch/method/source sai, witness dương mâu thuẫn, sao lưu, khách hàng/draft. Hai đầu vào engine hợp lệ dùng trong unit: 1978-05-06 17h nam (dương); 1978-02-06 01h nam (âm). So sánh 192 mẫu và hash lịch sử nằm trong `.local/quyen-facts-20261012/`.

Không trích helper mới và không sửa facts Kỵ. Không mở rộng Công việc hoặc dịch vụ thật. Đây là xác minh phần mềm, không phê duyệt chuyên môn.
