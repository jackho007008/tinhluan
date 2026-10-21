# Đối soát SePay Test Mode — 16/10/2026

## Phạm vi

CLI chỉ phía máy chủ, không có route đối soát công khai. Dùng `sepayTestConfig`, cùng `settleSePayTest` với webhook, cùng `acceptPaymentInTransaction` và worker giao bản đã lưu. Không gọi catalog, gửi email, tạo checkout hoặc hỗ trợ Live. Migration 005 chỉ thêm sổ định danh, vấn đề đối soát và checkpoint; không sửa đơn hay báo cáo lịch sử.

## Hợp đồng nguồn đã đọc

- [API v2 Sandbox](https://developer.sepay.vn/vi/sepay-api/v2/sandbox): host cố định `https://userapi-sandbox.sepay.vn/v2`; Bearer token Test Mode riêng. Không cho cấu hình host tùy ý hoặc theo redirect.
- [Danh sách giao dịch](https://developer.sepay.vn/vi/sepay-api/v2/giao-dich/danh-sach): `page/per_page`, tối đa 100; `meta.pagination`; UUID; tiền nguyên; trường `code` do SePay nhận diện. Không tự rút mã từ nội dung chuyển khoản.
- [Nâng cấp v1 → v2](https://developer.sepay.vn/vi/sepay-api/v2/nang-cap-tu-v1): UUID khác ID số; hướng dẫn đối chiếu bằng tài khoản và mã tham chiếu.
- [Mô phỏng Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode/mo-phong-giao-dich): webhook có ID số, `referenceCode`, tài khoản, tiền vào/ra; tham chiếu Sandbox được SePay tự sinh.

## Định danh hai đường

`api:<UUID>` và `webhook:<ID số>` là hai alias, không ép đổi kiểu. Khóa ghép là SHA-256 của ngân hàng + tài khoản + mã tham chiếu (`reference_number` / `referenceCode`). So thêm hash nghiệp vụ gồm mã đơn, số tiền, chiều giao dịch và người nhận (ngân hàng/tài khoản/VA). Khác các trường đó trả `event_conflict`, lưu vấn đề, không cấp quyền. Không ghi nội dung chuyển tiền, tên người chuyển, token hay raw webhook vào bảng mới.

Cùng tham chiếu chỉ giải quyết một lần trong khóa transaction chung giữa hai đường; alias được lưu cùng transaction với settlement. Mã giao dịch nội bộ đầu tiên được giữ, alias đến sau trỏ cùng sự kiện. Một giao dịch chuyển sang mã đơn khác bị chặn. Quyền và báo cáo tiếp tục dùng khóa duy nhất theo đơn sẵn có.

Webhook lịch sử trước migration chưa giữ tham chiếu: không viết lại sổ cũ để bịa ánh xạ. Lần API đầu có thể thêm dòng inbox `duplicate` theo đơn đã paid, nhưng không thêm payment transaction/job/grant/report. Khi webhook được phát lại có tham chiếu, hai alias được nối từ dữ kiện thật. Các dòng lịch sử cũ vẫn giữ nguyên.

API thiếu tham chiếu, trường bắt buộc hoặc tiền/chiều bất nhất: ghi fingerprint + mã lỗi, dừng scan, không tiến checkpoint. Webhook cũ thiếu tham chiếu vẫn giữ hợp đồng numeric-ID trước đây; chưa xác minh được đồng nhất hai nguồn cho dạng thiếu tham chiếu này, không tuyên bố đã ghép được.

## Phân trang và checkpoint

Đây là đối soát thủ công hữu hạn, **quét đầy đủ từ trang 1 mỗi lần**, không phải incremental polling. Mặc định 100 giao dịch/trang, tối đa 100 trang; nghỉ 400ms giữa trang. Không lọc `webhook_success`, ngày, mã đơn hoặc tiền để tránh bỏ qua giao dịch cần xử lý. Checkpoint chỉ xác nhận một scan hoàn tất (scope tài khoản băm, thời điểm và số giao dịch), không được dùng làm mốc cắt bỏ dữ liệu cũ.

Mỗi sự kiện được commit nguyên tử qua settlement chung. Lỗi HTTP/timeout/JSON/schema/DB trước khi hết trang: không tiến checkpoint. Chạy lại từ trang 1; sự kiện đã commit được nhận diện lại, phần chưa xử lý còn cơ hội chạy. Không dùng offset trang cũ sau lỗi, không so UUID theo chữ, không giả định ngày giao dịch luôn tăng theo thời gian ingest.

Kiểm tra tổng số không đổi giữa trang, số ID duy nhất bằng total, không ID lặp và metadata trang hợp lệ. Nếu thay đổi tập trang, dừng để chạy lại. SePay không công bố snapshot nhất quán xuyên nhiều request: không thể bảo đảm một scan đồng thời có sửa/xóa giao dịch hoàn toàn ổn định; quét lại toàn bộ tránh bỏ sót vĩnh viễn do watermark. Không tự xóa checkpoint/skip row để vượt lỗi. Có khóa độc quyền theo scope để không chạy hai scan song song. Quá giới hạn trả lỗi và không tiến checkpoint.

Giao dịch hợp lệ về cấu trúc nhưng sai tiền/tài khoản/mã/chiều, đơn không đăng ký hoặc hết hạn: lưu disposition trong `sepay_test_events`. Không tự thử lại thanh toán sau khi thay dữ kiện đơn; cần xử lý riêng sau này, chưa có thao tác quản trị trong gói.

## Cấu hình và cách chạy

Giữ `.env` chỉ trên máy chủ: `SEPAY_MODE=test`, `SEPAY_TEST_ENABLED=true`, `CORE_ORDER_TEST_ENABLED=true`, `SEPAY_TEST_API_TOKEN` và cấu hình HMAC/ngân hàng/tài khoản Test Mode hiện có. Không gửi token qua URL. API token khác webhook secret.

QA hiện hành dùng database kiểm thử được runtime QA chọn, không lấy database mặc định làm QA:

```sh
node --env-file=.env .local/sepay-reconcile-20261016/run.mjs migrate
node --env-file=.env .local/sepay-reconcile-20261016/run.mjs
# Kiểm phân trang với dữ liệu thử ít:
node --env-file=.env .local/sepay-reconcile-20261016/run.mjs --page-size=1
```

Lệnh nguồn tái sử dụng ở môi trường kiểm thử đã cấu hình đúng DATABASE_URL:
`node --env-file=.env --import tsx scripts/sepay-reconcile.ts`.
Cần cùng cổng bảo vệ operator hiện có (`NODE_ENV=test`, `DEMO_ENABLED=true`, database local). Không nới cổng cho production/Live. Worker QA sẵn có nhận job; CLI không tự gửi email hoặc dựng báo cáo mới.

## Bằng chứng kiểm tra

Bằng chứng trong `.local/sepay-reconcile-20261016/`. Kết quả ca SePay thật và hạn chế cuối lượt được ghi tại phần tương ứng trong `V1-DELIVERY-PLAN.md`. Test fixture cục bộ không tính là giao dịch phát sinh từ SePay.

### Kết quả nghiệm thu thực tế

Đã kiểm API Sandbox có phân trang: sai2000VND không cấp quyền, đúng1000VND giao một bản frozen, quét lại không trùng. Lỗi401 thật không tiến checkpoint. 38/38 kiểm thử tập trung, typecheck và productionbuildQA đạt. Chưa khép ca phát lại webhook39064 sauAPI: đến14:47:48 ngày16/10/2026 chưa thấy aliaswebhook ở máy chủ; Chrome trả trang chi tiết trống dù chủ dự án báo đã khôi phụcURL/gọi lại. Không dùng test cục bộ thay chứng cứ này. Chi tiết từng ca và giới hạn trong kế hoạch; không bậtLive.
