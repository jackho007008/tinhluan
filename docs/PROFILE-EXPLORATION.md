# Khám phá hồ sơ thật — 10/10/2026

Luồng trang chủ vẫn dùng `/api/chart` và engine hiện có. API bổ sung một mô hình khám phá qua `executeRules(..., 'customer')`; không có điểm số. Danh sách rule Tân Biên và ánh xạ profile được tách từ builder hiện hành sang `profile-rules.ts`, không sửa điều kiện, trạng thái duyệt hay nội dung rule. Cổng approved, review và quyền nguồn vẫn do evaluator thực thi.

Luồng nội bộ đọc snapshot + frozen reading của đúng UUID. `Chart` chia sẻ snapshot đang xem với `ReadingExplorer`; chọn trực tiếp cung trên phiếu cũng mở phần đọc. Các đoạn đã lưu giữ nguyên văn bản biên tập, rule/version, căn cứ và giới hạn; không chạy lại catalog hiện tại khi mở bản cũ. Bài gốc được giữ ở disclosure riêng có nhãn lịch sử. Đổi năm tạo hồ sơ con bằng API hiện có, không ghi đè; nội dung cũ ẩn trong lúc nhập/chờ/lỗi. GET `/api/exploration?id=...` yêu cầu phiên nội bộ, kiểm tra trùng snapshot, trả private/no-store. Không có fallback DEMO.

## Phạm vi và nguồn

- Khám phá 12 cung lấy sao, Tứ Hóa, vòng bản mệnh và lớp bổ sung từ `sheetPalaces`/provenance dùng chung với phiếu. Danh sách sao rỗng nhưng chưa xác nhận đầy đủ không được gọi là không có chính tinh.
- Chủ thể nhận định lấy từ nhóm fact của rule đã khớp: life → Mệnh; career → Quan Lộc; wealth → Tài Bạch. Một cung xuất hiện trong căn cứ hội chiếu không tự trở thành chủ thể. Nhận định không có một chủ thể duy nhất được giữ ở Tổng quan. Đây là ánh xạ điều hướng, không phải công thức hoặc rule mới.
- Dòng thời gian dùng đúng 12 khoảng tuổi đã lưu. Năm âm tương ứng = năm âm sinh + tuổi mụ − 1; hai đầu đều bao gồm. Nguồn quy ước tuổi/chiều: Tân Biên tr.20–21 §10.1 và đặc tả `DECADAL-LAYERS.md`. Dấu năm xem và lựa chọn giai đoạn là hai trạng thái riêng.
- Bộ sao từng giai đoạn là dữ kiện dẫn xuất có phiên bản riêng bằng `decadalLayer` đang dùng trong engine. Dùng năm đầu của khoảng chỉ để chọn đúng đại vận từ dữ liệu đã lưu, không chạy chuyển lịch cho năm tương lai. Can chi cung đại vận, 10 sao và 4 Hóa liên kết sao bản mệnh theo bổ sung iztro 2.6.1; không gán công thức bộ sao này cho Tân Biên. Không hỗ trợ bộ sao này cho profile khác v2. Snapshot lịch sử không bị thêm/sửa lớp này.
- Năm xem: chín sao lưu năm, tiểu hạn là vị trí cung theo tuổi; lưu đại hạn theo năm là trường khác. Không có rule luận vận/năm/ngày được kết nối, nên chỉ hiện dữ kiện và giới hạn, không lấy claim bản mệnh làm dự báo.

## Nghiệm thu

- Hồ sơ Kim Thoa `9f53ec47-4361-49b6-953c-6238060cbb08`: 2 nhận định đã lưu, tại Mệnh. Mốc đầu 5–14 tuổi; năm 2028 thuộc Phụ Mẫu 15–24, 2029 thuộc Phúc Đức 25–34.
- Hồ sơ 07/08/1992 `d7953053-6452-4f9c-a3a1-b2fe46eda69d`: 6 nhận định đã lưu; Mệnh, Quan Lộc, Tài Bạch. Mốc đầu 3–12 tuổi. Năm xem 2026 thuộc Điền Trạch 33–42.
- Form trang chủ nhập Kim Thoa thực tế → API → lá số → khám phá: không có Recharts/điểm mẫu, không có claim draft ở phía khách hàng.
- Chọn Nô Bộc Kim Thoa: không có chính tinh, vẫn còn phụ tinh, vòng và lớp bổ sung; thông báo chưa có luận giải. Fixture mất majorStars và fixture danh sách chưa đầy đủ phân biệt đúng trạng thái.
- Chọn cung bằng Enter, mở căn cứ, chọn đại vận khác với năm xem đã kiểm tra. Mobile 390px/360px: document.scrollWidth bằng viewport, phần khám phá không tràn ngang. Phiếu cố định dùng vùng kéo ngang sẵn có, không đổi bố cục.
- Đổi nhanh 2028 → 2029: phần khám phá cũ ẩn; cuối cùng lá số và bài đọc có cùng resultId `6a1c61ee25f938f58bdf7ef713db5019a1e11fb84eba396c2163df4538533425`, chỉ lưu niên 2029 xuất hiện.
- API hai hồ sơ trả đúng snapshot; tính lại cùng thông tin có dữ liệu bản mệnh bằng tuyệt đối. GET nội bộ không có phiên trả 401. 52 tệp lịch sử trước kiểm tra giữ nguyên SHA-256; các lần đổi năm tạo tệp mới.
- TypeScript qua. 25 test có liên quan qua (5 tệp). Không tuyên bố toàn bộ suite dự án đã qua: suite trước có các lỗi catalog/editorial cũ và kiểm tra DB chưa chạy trong môi trường này.

## Bàn giao và phần còn thiếu

Bản xuất `.local/exploration-20261010/`: toàn văn TXT, snapshot/frozen/source-map JSON, coverage.json, ảnh mobile và báo cáo HTML. Toàn văn nội bộ là dự thảo, không phải nội dung khách hàng đã duyệt. Các link tải cùng nội dung có ngay trong trang hồ sơ.

Chưa có rule vận/năm/ngày, chưa có claim cho đa số cung, chưa có rule approved được phép xuất cho khách hàng. Không tự phê duyệt. Phiên lập miễn phí ở trang chủ vẫn có vòng đời phiên hiện hành; việc mở lại bền vững dùng hồ sơ/báo cáo đã lưu theo cơ chế sẵn có, không thêm hệ lưu trữ thứ hai. Không thay engine, phép an bản mệnh, cấu hình dịch vụ, thanh toán, email, beta hoặc AI.
