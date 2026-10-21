# Bản trình bày 1.37.1

Nội dung/catalog giữ 1.37.0; finance-assets-1.0.1 chỉ thay vị trí và cách diễn đạt. Quan hệ điều chỉnh đã có `tanbien.career-void-tu-ngo` được giữ toàn văn tại Quan Lộc cạnh lời nền `tanbien.r40`. Phần tài chính lưu nhắc ngắn và đường dẫn tới chính đoạn đó. Các bản cũ không có metadata placement tiếp tục hiển thị theo bố cục đã lưu.

Rà các nhóm chuyển trong 1.37.0: toàn nhóm Điền cùng ở phần nhà đất, không tách lời nền/điều chỉnh. Hai ý Cơ–Lương/Kỵ vẫn cùng tồn tại, không tạo ngoại lệ. Các lời Quan có liên hệ thu nhập được giữ theo phạm vi cũ; điều chỉnh Tử Vi Ngọ là nhóm work-context duy nhất đang chuyển tách khỏi nền, nay đã sửa. Không suy quan hệ mới từ việc cùng cung.

Câu Điền đọc đúng tên Tuần/Triệt trực tiếp từ dữ kiện đã lưu, không đổi facts hoặc đánh giá điều kiện. Những câu về thao tác triển khai được bỏ khỏi bài chính; căn cứ giữ nguyên claim, nguồn và dấu vết. Mọi bản mới được lưu với parentId; không cập nhật bản cũ.

Bằng chứng trong `.local/finance-presentation-20261013`: 192 v2 và tám bản có execution/sections giữ nguyên; 625 tệp lịch sử/engine/lịch/rules giữ SHA-256. Unit/integration 2792 đạt, 1 timeout trong lượt có build đồng thời; file timeout chạy riêng 6/6 đạt, không đổi timeout/assertion. Typecheck/build đạt. E2E phạm vi ba test đạt, không retry; Chrome 18 lượt mobile, API tạo–lưu–mở lại, quyền và lịch sử đạt. HTML sáu lượt mobile khớp component ứng dụng, không tải tài nguyên ngoài. Đây không phải tuyên bố chạy toàn bộ E2E.

QA production cổng 3034. Không thay trạng thái dịch vụ hoặc phê duyệt chuyên môn.
