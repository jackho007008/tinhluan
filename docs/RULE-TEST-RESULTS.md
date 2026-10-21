# Kết quả kiểm thử giai đoạn quy tắc — 07/10/2026

Môi trường giữ nguyên: macOS arm64, Node20.20.2, PostgreSQL16.14, Vitest4.1.11, Playwright1.56.1/Chrome. Không thêm dependency runtime hoặc migration.

- `npm run typecheck`: đạt.
- `npm test`: **124/124 đạt**,4 files,4,87 giây:99 kiểm thử engine/payment/database hiện có +25 kiểm thử pipeline/comparator mới. Worker ngoài được dừng khi chạy integration, bật lại sau đó.
- `npx vitest run tests/interpretation.test.ts`: **25/25 đạt** sau các chỉnh sửa cuối về payload/scope/template;0,217 giây.
- `npm run test:e2e`: **5/5 đạt**;360px/390px mua demo, reload, report mới, mở “Xem căn cứ” ở cả hai chủ đề và kiểm tra không tràn ngang; keyboard/client sửa giá; magic link/replay; report kiểu cũ không có interpretation.
- `npm run build`: đạt compile/typecheck/generation/traces.
- `npm run chart:compare -- fixtures/chart-comparison/upstream-subset.json`:4/4 trường khớp, evidenceClass=upstream-example, expertConfirmed=false. Expected chỉ lấy tập con tài liệu upstream, không sinh từ engine hiện tại.
- `npm run chart:compare -- fixtures/chart-comparison/awaiting-vn.json`:awaiting-source, không tính/sinh expected hoặc báo đã xác minh.
- So byte với `release/tuvi-vn-engine-source.zip`:13 file thuộc calendar/engine/provenance/database/payment/notifications, scripts engine, jobs và config **không đổi**. Không đụng dữ liệu báo cáo đã giao.

## Bao phủ pipeline

Match/non-match, ngoại lệ, thiếu/mơ hồ cung, profile sai; draft/reviewed/retired bị chặn; schema thừa confidence/thiếu reviewer/op eval/path prototype bị từ chối; evidence không tồn tại; required fact cho exception; rights pending; gom trùng giữ2 rule; xung đột retain-both; withhold-all lan qua thành phần liên thông; ID rule trùng; synthetic bị chặn; exact counts6 factual +2 draft +0 approved; draft prose không có trong payload report; cùng snapshot/catalog cho cùng kết quả; scope topic; đổi catalog không sửa report object đã tạo; AI cùngcitation nhưng bịa nghĩa/lỗi fallback; pending fixture, mismatch, input/profile khác, scope so sánh, matched synthetic không được coi là independent.

Các approval trong test là **TEST_ONLY_NOT_A_PERSON**, chỉ có trong file tests, origin synthetic. Không có reviewer thật hoặc rule khách approved. Một ca AI test tạo ngữ cảnh giả lập để kiểm tra fallback, không được gọi là nội dung chuyên gia.

Report legacy E2E là fixture trình bày dùng schema cũ (bỏ trường interpretation), không phải lá số độc lập. Không ghi fixture đó vào database hoặc đưa vào catalog khách. Report đã lưu được API đọc từ JSON DB; không gọi catalog mới để dựng lại. Unit kiểm tra detached snapshot sau đổi phiên bản rule; chưa có thử nghiệm nâng phiên bản qua nhiều máy/khôi phục backup.

## Giới hạn

Không có ca chuyên gia độc lập, chưa xác minh bản in Thiên Đồng hoặc quyền nội dung diễn giải, chưa có bộ rule nghề nghiệp đầy đủ. Không gọi AI, ngân hàng/email thật hoặc tính scoring. Test phần mềm không duyệt nội dung học thuật. Không kiểm thử screen reader hoặc mọi thiết bị; mobile ở kích thước đã nêu. Log không chứa thông tin sinh khách thật/token.

Log: `docs/evidence/rules-unit-integration.txt`, `rules-focused.txt`, `rules-mobile.txt`, `rules-build.txt`, `rules-comparison.txt`.
