# Audit engine — 07/10/2026

## Đầu vào đã đọc

Dự án hiện tại tại `/Volumes/DATA/TINHLUAN`; không có AGENTS.md tại dự án hoặc các thư mục cha đã kiểm tra. Đã đọc README, docs hiện có, mã engine, rules, scoring, reports, orders, worker và tests. Giữ Next.js/TypeScript/PostgreSQL và bố cục giao diện cũ; chỉ sửa nhãn/profile liên quan tích hợp.

ZIP có thật: `/Users/taiho/Desktop/huyenhoc-engine-v0.1.zip`. SHA-256: `e0f16329ab1f7ba0d7caace4bcf7deb1e4634fe99407b4517b07341055513a96`. Giải nén phục vụ audit tại `.local/engine-audit/huyenhoc-engine/`, không đưa thư mục này vào runtime. Đã đọc `README.md`, `docs/DECISIONS.md`, `docs/VALIDATION.md`, `src/tuvi.js`, `src/validation.js`, `src/rules.js`, `src/provenance.js`, `test/engine.test.js`.

Chạy nguyên suite ZIP bằng `node --test`: **13/13 pass**, log tại [evidence/attached-engine-tests.txt](evidence/attached-engine-tests.txt). Suite có cả module ngoài phạm vi Tử vi; không gọi đây là 13 ca Tử vi được xác minh độc lập. Ảnh Crimson mobile có thật, chỉ dùng tham khảo thiết kế, không trích công thức hay điểm từ ảnh.

## Trạng thái ban đầu và thay đổi

| Phần | Trước audit | Sau tích hợp | Mã liên quan |
|---|---|---|---|
| Lá số | Tính thật bằng iztro, lịch Trung Quốc; không phải fixture | Giữ profile cũ; thêm lịch thiên văn UTC+7, an sao thật qua bridge | `lib/tuvi-engine/index.ts`, `scripts/engine*.cjs` |
| Lịch Việt Nam | Chặn `vn-unavailable` | Profile `vn-utc7-midnight-v1`, phạm vi và quy ước riêng | `lib/calendar/vietnamese.cjs`, `iztro-bridge.cjs` |
| Báo cáo | Template sao chép dữ kiện thật; giao dịch demo | Tiếp tục đọc snapshot, không tính lại theo engine mới | `lib/reports/index.ts`, `lib/jobs.ts` |
| Rules | Chỉ dữ kiện, factual-only | Không bổ sung luận mệnh hay nhãn đã duyệt | `lib/interpretation-rules/index.ts` |
| AI | Adapter allow-list, mặc định template | Không gọi AI, không cho điểm | `lib/narration/index.ts` |
| Bốn biểu đồ giới thiệu | Fixture cố định có nhãn minh họa | Giữ riêng UI, không đưa vào report | `components/DemoCharts.tsx`, `lib/scoring/*` |
| Đại vận trong báo cáo | Range tuổi thật từ iztro | Range kỹ thuật theo snapshot/profile, chưa chuyên gia xác nhận | `components/Periods.tsx` |
| Điểm/năm/ngày trong báo cáo | Null/unavailable | Giữ unavailable; không biến thiếu thành 0 | `lib/scoring/index.ts` |
| QR/webhook/email | Mock provider, HMAC demo, email file cục bộ | Giữ nguyên; production chặn mock | `lib/payments`, `lib/notifications`, `lib/security.ts` |
| Đơn/job | Transaction + durable DB queue | Không migration/rewrite snapshot cũ | `app/api/[...action]/route.ts`, `lib/jobs.ts`, `db/001_init.sql` |

Tên “demo” ở giao dịch/báo cáo nói về chế độ sản phẩm chưa thương mại; không có nghĩa các vị trí sao trong báo cáo được random. Ngược lại, các điểm minh họa hoàn toàn không được dùng làm dữ kiện cá nhân.

## Audit ZIP và chuỗi chuyển lịch

Engine ZIP 0.1.0 dùng iztro 2.6.1. `solar-cn-reference` đi vào bySolar; `lunar-cn-reference` chuyển bằng lunar-javascript 1.7.7 rồi vẫn bySolar. Không có lịch Việt Nam. Rules chỉ chép dữ kiện. Không tái sử dụng ZIP như một engine thương mại hoặc đưa các module ngoài Tử vi lên UI.

Trong iztro 2.6.1:

- `lib/astro/astro.js`: byLunar chuyển lịch rồi gọi bySolar; chỉ đưa ngày âm Việt Nam vào byLunar là chưa đủ.
- `lib/utils/index.js`: fixLunarMonthIndex gọi solar2lunar lại; nửa tháng nhuận phụ thuộc fixLeap và timeIndex.
- `lib/star/location.js`: getStartIndex đọc ngày âm/độ dài tháng; chỉ số Tý muộn 12 có nhánh tăng ngày riêng.
- `lib/astro/palace.js`, `lib/star/{majorStar,minorStar,adjectiveStar,decorativeStar,location}.js`: lấy can chi qua lunar-lite nhiều lần.
- `lib/astro/FunctionalAstrolabe.js`: có đường dùng trực tiếp lunar-typescript cho monthlyList; không được phép dùng trong profile mới.

Giải pháp: tiến trình mới thay **toàn bộ export lunar-lite trước khi require iztro**, chỉ cho phép các hàm bridge đã audit; export không biết sẽ throw. lunar-typescript bị thay bằng proxy từ chối truy cập. Khóa iztro 2.6.1; trả DTO JSON, không trả các hàm horoscope/monthlyList. Cách này phụ thuộc cấu trúc CommonJS của phiên bản cố định: nâng dependency bắt buộc audit lại, không tự động nâng.

`getSign` bị loại khỏi khả năng sản phẩm (trả chuỗi rỗng nội bộ, không xuất DTO). Không dựng Bát tự hay lịch tiết khí để suy mệnh. Can chi tháng/ngày/giờ bridge là dữ kiện quy ước; không dùng để quảng bá module khác.

## Tính bất biến và giới hạn

Profile/versions cũ và `scripts/engine.cjs` được giữ nguyên. Chuỗi JSON snapshot đã lưu không được viết lại. Orders mới vẫn tính server, lưu normalized input, profile, versions, chart, warnings, resultId trong chart snapshot trước nhận tiền; worker chỉ đọc snapshot. Report cũ giữ nguyên nội dung. Profile `vn-unavailable` cũ vẫn bị chặn, không đổi nghĩa nó thành VN mới.

Cầu nối mới lưu `chart.calendarEvidence`: sóc/trung khí, đầu/cuối tháng, độ dài tháng, profile đổi ngày/tháng nhuận, thống kê đường gọi bridge. Các metadata không chứa thông tin thanh toán hay token. Root validationStatus vẫn `software-only`; mô tả chi tiết trong profile nói rõ kiểm chứng lịch khác kiểm chứng an sao.

Chưa có ca lá số được chuyên gia độc lập xác nhận; chưa có phương pháp scoring hay luận giải được duyệt. Xem [ENGINE-VALIDATION.md](ENGINE-VALIDATION.md) và [CALENDAR-CONVENTIONS.md](CALENDAR-CONVENTIONS.md).
