# Nghiệm thu vòng khách demo — 08/10/2026

## Môi trường và điều tra trước sửa

Đọc README, OPERATIONS, CONVENTIONS, CALENDAR-CONVENTIONS, TEST-RESULTS, schema/input/UI/API/jobs và E2E có sẵn. Không có AGENTS.md ở dự án hoặc các thư mục cha đã kiểm tra. macOS, Node 20.20.2, Next 15.5.27, Playwright/Chrome headless; viewport 360×900, 390×900, 1280×900. Không giả lập iOS/Android thật.

Không tái hiện được việc ứng dụng xóa ngày 1992-06-15 sau thao tác nhập hợp lệ. Các ca bàn phím theo ngày/tháng/năm, blur, nút/Enter, submit thiếu nơi sinh rồi sửa, quay lại sau xác nhận/lá số đều giữ ngày. Ban đầu test gửi tháng/ngày theo locale khác và dùng selector exact cho nhãn đã có lỗi nên thất bại; đã sửa test, không sửa input vì các thất bại đó.

**Tái hiện có kiểm soát:** gán trực tiếp `input.value` không phát sự kiện input/change cho React: DOM hiển thị ngày, state vẫn rỗng, lần render khi submit đưa ngày về rỗng. Đây là chẩn đoán bẫy tự động hóa, không chứng minh lần trình duyệt từ xa trước đó dùng cách này. Không thêm workaround đọc DOM để che lệch state.

Input controlled, update chỉ sửa đúng trường bằng functional setState; không thay key/remount input và không có nhánh reset ngày khi validation lỗi. Kiểm tra keyboard/blur không ghi nhận triệu chứng hydration làm mất ngày.

**Native picker:** đã mở và có ảnh popup tại ba viewport. Các lệnh chọn ngày bằng phím/tọa độ Playwright không ổn định khi popup thực sự mở; thử trước không chụp popup không đủ chứng minh đã chọn trong popup. Test cuối chỉ khẳng định mở/đóng không mất ngày. Chrome riêng qua công cụ UI không khả dụng; không can thiệp cửa sổ Chrome đang được người dùng sử dụng. Chọn ngày bằng chuột trong native popup trên thiết bị thật vẫn cần nghiệm thu thủ công. Không tự nhận phần này đạt.

**Chặn Origin đã xác định:** tiến trình ban đầu có APP_ORIGIN là địa chỉ HTTPS không phải localhost; browser localhost gửi đúng Origin localhost và bị API từ chối 403. Phiên nghiệm thu dùng override môi trường cho dev/worker `APP_ORIGIN=http://localhost:3000`, không sửa .env, không nới whitelist hoặc cho phép null Origin.

## Thay đổi

- `lib/calendar/profile-ranges.json`: một nguồn giới hạn VN 1976-01-01–2050-12-31 và CN 1900-01-01–2099-12-31. UI min/max/nhãn, schema client/server và guard lịch VN cùng đọc. Adapter chưa hỗ trợ vẫn bị chặn.
- Kiểm tra ngày Gregorian bằng số ngày/tháng và quy tắc năm nhuận; không dùng Date/UTC để chuẩn hóa ngày sinh. Phân biệt thiếu ngày, ngày không tồn tại và ngoài phạm vi profile. Không đổi ngày hoặc profile ngầm.
- Khi thay input, hủy snapshot preview cũ và xác nhận cũ. Không sửa snapshot đơn hoặc báo cáo đã giao.
- Trạng thái UI phân biệt báo cáo failed, retry và chờ xử lý; nút thử lại dùng endpoint cũ, không thu tiền thêm.
- Không đổi quy tắc an sao/lịch, rule chuyên môn, migrations, payment verification hoặc quyền token. Guard lịch chỉ chuyển hằng số sang cấu hình với cùng giá trị. Hợp đồng báo cáo cũ giữ nguyên.

## Bảng nghiệm thu

| Bước | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| Nhập ngày/giờ, bàn phím, blur | Đạt | 1992-06-15, 10:30; ngày/tháng/năm theo Chrome trên máy |
| Native date picker | Một phần | Có ảnh mở popup; chọn ngày bằng chuột chưa xác minh ổn định |
| Validation profile | Đạt | Client/server cùng schema; năm nhuận và biên thực tế hai profile, cả engine tại min/max |
| Submit thiếu trường rồi sửa | Đạt | Không xóa ngày đã nhập; selector test sửa theo accessible name có lỗi |
| Xác nhận | Đạt | Khớp 1992-06-15 · 10:30 và profile VN |
| Lá số / chỉnh lại | Đạt | 12 cung; sửa 1992-06-16 tạo resultId khác; profile và input response đúng |
| Gói và giá | Đạt | Toàn diện 199.000 VND demo, scope snapshot không hứa interpretation/scoring |
| QR | Đạt | Nhãn không chuyển tiền; refresh giữ đơn; double-click không thêm đơn |
| Thanh toán và job | Đạt | Webhook demo hiện có; gọi lặp vẫn 1 report_jobs, 1 report, 1 email_delivery |
| Chờ xử lý / lỗi / retry | Đạt trong mô phỏng lỗi | Một đơn QA mới được đặt failed bằng SQL trong test riêng, endpoint retry + worker thật phục hồi; không sửa báo cáo đã giao |
| Báo cáo khách | Đạt | Chỉ dữ kiện; claims rỗng, không có draft/evidencePaths nội bộ |
| Refresh / mở lại | Đạt | Cookie sở hữu; browser mới không quyền trả 401 |
| Email demo một lần | Đạt | File local; đổi token thành session ở browser khác; xóa fragment, replay bị chặn |
| Desktop / mobile | Đạt phần giao diện web | 360/390/1280px không tràn cấp trang, vùng lá số riêng; không đại diện mọi thiết bị thật |
| Production payment gate | Đạt | Local production 3001: orders, mock-pay, webhook đều 400 “Thanh toán demo đã tắt…” |

## Đơn demo bàn giao

Các đơn hoàn tất toàn luồng ban đầu nhập 1992-06-15, sau đó thử sửa thành **1992-06-16 10:30**, nữ, profile VN; email example.invalid. Không dùng thông tin khách thật.

- 360px: **TV822DB9FF97C4**, ID `d47f1fa8-f29d-4ce8-914c-2063420c2a92`.
- 390px: **TV7C2923084822**, ID `c8b71b6e-3d8e-4937-9ba0-a824680395c3`.
- Desktop: **TV87B1AAA186E2**, ID `bd201c66-41f8-4993-b7b3-245a0549ea18`.

Mã/ID đơn không cấp quyền. Trong /internal đã đăng nhập, chọn mã đơn hoặc dùng `?report=<ID>`. Muốn xem đúng luồng khách trên browser khác: “Tìm báo cáo” với email demo tương ứng journey-360@example.invalid, journey-390@example.invalid, journey-1280@example.invalid; liên kết mới chỉ lưu trong .local/mail, không gửi ra ngoài. Liên kết E2E đã dùng không còn hiệu lực; không đưa token vào tài liệu. Đơn retry riêng và các lần thử chưa hoàn tất có nhãn email journey-retry@example.invalid; file retry-order.json ghi ID lần cuối.

## Kết quả test

- `npm test`: **213/213**, 10 files, 13.60s. Worker ngoài dừng trong lúc test database. Bao gồm transaction rollback, webhook trùng/sai, retry và token expiry/replay.
- Ba E2E toàn luồng khách: **3/3**, 44.7s; có một đơn mới/viewport. Log full-flow-tests.txt.
- Bảy E2E validation/unknown-time/tương thích report: **7/7**, 10.5s. Các thao tác picker sơ bộ trong lần này không thay thế kiểm tra popup thực; xem giới hạn trên.
- Bộ E2E cuối birth-input và retry: **6/6 đạt**, xem final-ui-tests.txt; chỉ ghi nhận đúng mức đã xác minh cho popup.
- Typecheck và production build: đạt. Production gate đã thử local 3001, không triển khai public.
- Hash báo cáo gốc trước/sau vẫn trùng. Không thay trạng thái phê duyệt để có nội dung trong test.

## Ảnh và vận hành

Ảnh trong `docs/evidence/customer-journey/`: mỗi viewport có confirmation, chart, packages, qr, processing, report và date-picker. Chỉ dữ liệu demo; không khóa/token. Chọn ảnh 390-date-picker.png, 360-qr.png, 360-report.png và 1280-processing.png để xem nhanh.

Phiên local đang chạy với Origin override. Để chạy lại mà không sửa .env:

```sh
APP_ORIGIN=http://localhost:3000 npm run dev
APP_ORIGIN=http://localhost:3000 npm run worker
```

Nếu dùng một địa chỉ khác, frontend, APP_ORIGIN và link email phải cùng origin. Không thêm bypass cho Origin hoặc production. Chưa thử iOS/Safari thực, screen reader đầy đủ, mất mạng ngay sau server tạo đơn nhưng trước khi client nhận ID (API tạo đơn chưa có idempotency key cho trường hợp này). Demo double-click/reload không thay thế kiểm thử mất response. Báo cáo vẫn chỉ là dữ kiện và chưa đủ điều kiện mở bán.
