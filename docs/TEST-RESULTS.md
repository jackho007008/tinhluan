> Giai đoạn quy tắc mới: xem [RULE-TEST-RESULTS.md](RULE-TEST-RESULTS.md) —124 tests và5 E2E. Kết quả lịch UTC+7 bên dưới là lịch sử giai đoạn trước.

# Kết quả kiểm thử thực tế — 07/10/2026, tích hợp lịch UTC+7

Môi trường: macOS arm64, Node20.20.2, PostgreSQL16.14 (ServBay), Next15.5.27, Vitest4.1.11, Playwright1.56.1 / Chrome headless. Giữ payment mock và email local. Kết quả giai đoạn trước43 tests đã được thay bằng lần chạy mới dưới đây; không cộng trùng.

## Kết quả cuối

- `npm run typecheck`: đạt, strict TypeScript.
- `npm test`: **99/99 đạt**, 3 file,4,72 giây.30 core +56 VN calendar/engine +13 database. Worker ngoài đã dừng khi chạy integration; bật lại sau đó.
- `npm run test:e2e`: **4/4 đạt**,45,4 giây.360px dùng profile VN;390px dùng CN cũ. Kiểm tra không tràn ngang tại lá số và báo cáo, danh sách/phóng to, bàn phím, reload, mua demo, nhận report và magic link.
- `npm run build`: đạt, compile/typecheck/static generation/build traces.
- Production smoke tại loopback3001: `/api/chart` với17/02/2007 23:59, profile VN trả200, âm lịch1/1/2007, `cnCalendarAccess=blocked`. `/api/orders`, `/api/mock-pay`, `/api/webhook` đều400 “Thanh toán demo đã tắt. Chưa mở bán thật.” Không thu tiền.
- `npm audit --omit=dev`:0 cảnh báo runtime tại thời điểm kiểm tra. Đây không phải security audit độc lập.
- ZIP engine gốc: `node --test`,**13/13 đạt**; suite chứa cả phần ngoài Tử vi. Log [attached-engine-tests.txt](evidence/attached-engine-tests.txt).
- `node scripts/calendar-validation.cjs`: **27.394 ngày roundtrip**,0 lỗi,0 ngày bị guard chặn trong phiên bản này;6 mẫu sóc NASA sai lệch42,001–61,291 giây trong ngưỡng test120 giây.

Log chạy phần mềm tại [evidence/application-tests.txt](evidence/application-tests.txt), [evidence/mobile-tests.txt](evidence/mobile-tests.txt), [evidence/production-build.txt](evidence/production-build.txt). Các log không chứa token, email người dùng hoặc dữ liệu sinh người dùng; dữ kiện ngày sinh nêu trên là fixture kỹ thuật.

## Những hành vi được kiểm tra

Ngày sai/năm nhuận; tháng nhuận; missing time; lịch/múi giờ/phạm vi không hỗ trợ;24 giờ;22:59/23:00/23:59/00:00 qua năm âm; quanh Lập xuân; lịch VN/CN khác; hash tái lập; global config cô lập; nguồn evidence và allow-list AI; điểm thiếu giữnull.

Database: thiếu/thừa tiền, sai mã/người nhận/đơn; trùng/đảo thứ tự/muộn; transaction dùng lại; rollback khi insert job lỗi; hai worker chỉ tạo một report; **report giữ đúng snapshot VN/evidence/profile**; retry report/email; token sai đơn/hết hạn/thu hồi, quyền gói hết hạn; concurrent magic link chỉ một lần thành công. Unit kiểm tra xây report từ snapshot CN cũ sau khi chạy VN vẫn giữ nguyên snapshot.

Browser: input→xác nhận→lá số→gói/email→QR→reload→webhook demo→worker→report; browser khác bị401; sửa giá client bị400; email fragment được xóa và replay bị chặn. Không thay giao diện ngoài nhãn/quy ước/profile liên quan.

## Lần thất bại có ý nghĩa và cách sửa

Fixture ban đầu lấy08/02/2024=28 Chạp từ một bài trên Cổng Chính phủ đã **thất bại** (engine=29). Không đổi engine hoặc chọn đa số nguồn: kiểm tra bảng sóc NASA11/01, quy tắc ngày bắt đầu tháng và thông báo lịch nghỉ Tết xác nhận29. Giữ dữ kiện bị loại trong `tests/calendar-fixtures.json:disputes` và bảng sai khác ENGINE-VALIDATION. Hai bản HND còn khác ngày kết thúc tháng1/1984; cách xử lý được ghi cùng tài liệu.

## Chưa kiểm chứng

Không có golden toàn bộ lá số được chuyên gia độc lập ký; không có oracle niên giám độc lập cho toàn bộ27.394 ngày. Roundtrip là consistency, sampleNASA là đối chiếu thiên văn, fixtureiztro là upstream, các mức này không thay thế nhau.

Chưa kiểm thử ngân hàng/email thật, tải lớn, audit accessibility đầy đủ, screen reader thực, mọi thiết bị, backup/restore hoặc hard-kill tại từng instruction. Lỗi giữa ghi tiền và job được mô phỏng bằng rollbackSQL, không gọi là test tắt máy thực tế. Thay đổi hôm nay không chạy lại kiểm tra hình ảnh screenshot từ giai đoạn trước; kiểm tra browser tự động đã nêu chính xác ở trên.

Luận giải/scoring chuyên môn chưa được duyệt. Xem [ENGINE-VALIDATION.md](ENGINE-VALIDATION.md) cho nguồn, sai khác và điều kiện còn thiếu trước mở bán.
