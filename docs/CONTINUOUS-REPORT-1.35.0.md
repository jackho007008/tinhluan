# Bản ứng viên bản mệnh 1.35.0

Phạm vi: tổ chức toàn văn từ bản trình bày 1.34.0, không thêm phương pháp luận, rule hoặc claim. Catalog 1.33.0, lớp căn cứ npl-evidence-process-1.0.0 và Tật Ách tat-ach-scope-1.0.0 giữ nguyên. Template 1.35.0; lớp trình bày continuous-report-1.0.0.

## Cơ chế

`freezeReading` lưu thêm `continuousReport`, gồm thông tin sinh, vị trí Thân, 12 cung bắt đầu từ Mệnh, đoạn trình bày, các claim gốc, facts/trace/nguồn, quan hệ chưa giải quyết và khoảng trống. Trang nội bộ chỉ render trường đã lưu; không tính lại khi mở lịch sử. Bản cũ không có trường này tiếp tục dùng component cũ. Không có phát hành ra khách hàng.

`ContinuousReport.tsx` được dùng trực tiếp trong ứng dụng và xuất HTML tự chứa. Thứ tự cung là quyết định biên tập. Không có cung Thân thứ 13, không thêm vận hạn. Không đổi vị trí sao, không dùng sao lưu cho dữ kiện bản mệnh.

Các claim `finance-extra` đã tồn tại trong section finance nhưng `subjectOf` cũ chỉ nhận tiền tố wealth. Bản toàn văn dùng section đã lưu làm chủ thể dự phòng; không thay evaluator hoặc renderer lịch sử. Đã kiểm tra toàn bộ claim xuất đúng một lần trên 192 v2, không có claim không được trình bày.

## Biên tập có kiểm soát

- Tử–Phá / Tử vòng Tràng Sinh ở Tử Nữ: cùng quan hệ cha mẹ–con, cùng mốc con lớn; gộp một câu, giữ hai bộ căn cứ.
- Cơ–Cự / Hóa Kỵ Phụ Mẫu: gom một đoạn nhưng vẫn phân biệt con với cha mẹ và cha mẹ với nhau, giữ phép “hoặc”, không gộp hai đối tượng thành kết luận.
- Lộc Tồn / Hóa Lộc Phụ Mẫu: gộp ý của cải, giữ riêng vế tiêu tán và không hợp tính của Lộc Tồn.
- Cùng nguyên văn, cùng cung: giảm lặp trình bày, không tăng độ mạnh. Đơn sao và tổ hợp khác nội dung không bị xóa.
- Ghi chú giống hệt nhau lặp trong cùng cung chuyển lên đầu cung; các giới hạn riêng vẫn cạnh đoạn. Nguyên văn đầy đủ vẫn trong căn cứ.

## Bốn quyết định phối hợp

A Điền Tử–Tướng/Đà, B Phụ Liêm–Tham hoặc Tham/Lộc, C Tài Cơ–Lương/Kỵ, D Quan Thất Sát/Kình–Lực: giữ các ý và nêu quan hệ chưa giải quyết tại cung khi cả hai claim đã khớp. Không dựa riêng việc có sao, không suy dữ liệu thiếu thành nhánh âm. Không có ngoại lệ chuyên môn mới.

Nguồn/đối tượng/khía cạnh/thời gian và câu hỏi còn thiếu ghi trong `.local/report-candidate-20261013/decision-detail.json`. Tái sử dụng hồ sơ trước, đối chiếu lại các trang quyết định; không khảo sát lại toàn bộ sách. Không áp quy tắc Mệnh/hạn của Thiên Lương sang Quan/Điền. Nguyên tắc định tính của Hàm Số chưa phải phép thay một mô tả cụ thể.

## Kiểm chứng

- 192 v2: sections, execution, readerPresentation, palaceReview, tatAch không đổi; mỗi claim đúng một lần trong bản toàn văn.
- Tạo tám bản từ snapshot cũ với parentId; không tính engine lại cho tám bản đối chiếu. Một luồng API sinh mới kiểm tra riêng.
- Kiểm thử kỹ thuật: điều kiện đủ/thiếu cặp claim, sai chủ thể, không xóa đơn sao, đối tượng quan hệ không bị hòa lẫn, nguồn/trace đủ, dữ liệu thiếu khác rỗng, sao lưu, lịch sử và Tật Ách.
- Unit/integration 72 tệp / 2746 test đạt. Typecheck và production build đạt; lần build đầu bản sao QA thiếu một JSON exports đã được sửa ở luồng sao chép.
- Kết quả production/mobile thực tế: `.local/report-candidate-20261013/browser-final-results.json`; HTML đối chiếu component: `html-check.json` cùng thư mục.
- Engine, lịch, catalog/rule và 510 tệp lịch sử baseline được đối chiếu hash. Trạng thái dịch vụ thật không thay.

Bàn giao: `.local/report-candidate-20261013/ban-giao.html`, QA 127.0.0.1:3030. Dừng tại bản ứng viên; không tuyên bố tổng hợp toàn lá số hay phê duyệt chuyên môn.
