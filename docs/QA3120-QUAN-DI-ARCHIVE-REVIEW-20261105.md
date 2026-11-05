# QA3120 — giao lại Quan Lộc và Thiên Di từ phản hồi đã lưu

Ngày 05/11/2026, bộ đọc báo cáo đã thanh toán tăng từ 7 lên 9/11. Hai job ban đầu có lỗi AI_INVALID_OUTPUT và chưa có result. Đã đối chiếu từng receipt, attempt, input và phản hồi cuối lưu tại QA với đúng job. Đã tái hiện lỗi cũ và kiểm hai bản hiệu chỉnh bằng validator của chính prompt 2.8.1 trước khi ghi.

- [Quan Lộc đã giao](../.local/qa3120-quan-di-reviewed/quan-da-giao.md), phạm vi focused. Giữ nguyên thứ tự và lời văn. Đoạn dẫn nguồn trực tiếp còn câu về Bạch Hổ–Tấu Thư ứng với văn chương và học ngoại ngữ. Chuyển câu nói riêng về biểu đạt của Tấu Thư trong dạy học sang đầu đoạn vận dụng, nơi có cả nguồn tham khảo và căn cứ trực tiếp. Đây là sửa phân đoạn và tham chiếu để giải AI_REFERENCE_SCOPE.
- [Thiên Di đã giao](../.local/qa3120-quan-di-reviewed/di-da-giao.md), phạm vi limited. Nguồn Thiên Mã tại Phúc Đức có cả hai ý khá giả khi xa quê và họ hàng ở xa nhau. Diễn đạt lại câu nối cho rõ hai vế thuộc cùng nguồn, giải AI_MIXED_ATTRIBUTION. Một câu tổng hợp phân biệt việc được tin phục và mức dễ trò chuyện thay cho diễn đạt dễ gợi tính khó gần.

Đã dùng cơ chế revalidateOutput hiện hành, khóa CREATE, chặn mạng ngoài clone, giữ cùng attempt, response ID, token, thời gian và chi phí ban đầu. Bản gốc và mẫu biên tập đã duyệt giữ riêng; bản giao có dấu vết biên tập trong metadata. [Kết quả đối chiếu và hash](../.local/qa3120-quan-di-reviewed/verified.json).

Hai lần nạp lại bản lưu qua bộ đọc với đúng quyền đều trả nội dung khớp hai bản đã kiểm và đủ 9/11; lần đọc thiếu quyền bị từ chối. Đối chiếu toàn bộ chín hàng job/attempt còn lại trước và sau. Tử Nữ và Tật Ách còn queued, mỗi job 0 attempt. Không chạy consumer thường trực, không gọi provider, không restart web, không sửa validator hoặc quyền. Kiểm ở phía server, chưa kiểm lại giao diện trình duyệt.
