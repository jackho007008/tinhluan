# Ba bản đọc DEMO — môi trường thử riêng 08/10/2026

Chỉ thử cục bộ theo yêu cầu của chủ dự án. Không có người thật, lời mời, email hoặc thanh toán. Nội dung vẫn draft, không có người duyệt được tự tạo.

## Địa chỉ và cách ly

- Bản đọc: http://127.0.0.1:3002/beta. Phải mở bằng quyền riêng trước; URL này không tự cấp quyền.
- Đăng nhập quản trị thử: http://127.0.0.1:3002/internal. Khóa riêng, không dùng khóa website hiện hành.
- Đối chiếu: http://127.0.0.1:3002/internal/beta.
- Website hiện hành http://localhost:3000/beta vẫn tắt. Không sửa cờ trong `.env` chính.

Server thử chỉ bind loopback 127.0.0.1, không tạo tunnel, không dùng được từ máy khác. Dùng đúng hostname 127.0.0.1 cho bản thử để cookie tách khỏi localhost của website hiện hành; cookie không được phân vùng bằng port. Không đổi sandbox sang localhost:3002.

Bản mã nguồn riêng tại `.local/beta-sandbox-20261008/app-copy`; database riêng `tuvi_beta_demo_20261008` trên cùng PostgreSQL cục bộ. Không sao chép đơn khách, bảng thanh toán hoặc báo cáo cũ. Không chạy worker. Bản chạy production chặn thanh toán mock; EMAIL_PROVIDER vẫn local. Các gói phần mềm dùng chung node_modules đã khóa package-lock; không phải container độc lập. Không sửa dependency khi đang nghiệm thu; thay đổi mã nguồn chính không thay bản nội dung đã chốt.

## Ba mẫu đã chốt

Tất cả là dữ kiện do engine tính từ đầu vào giả lập, profile `vn-utc7-midnight-v1`, nữ, Hà Nội, giờ dân sự Asia/Ho_Chi_Minh. Không dùng các ca này làm bằng chứng xác nhận engine hoặc chuyên môn.

1. `demo-wuqu-tianfu`: 2000-08-03 16:00, Mệnh Vũ Khúc–Thiên Phủ. Hai chú giải đơn; không tự tạo kết luận tổ hợp.
2. `engine-combo`: 2001-05-06 20:00, Mệnh Tử Vi–Phá Quân, đủ phụ tá. Hai chú giải; tổng hợp thuận của nhóm phụ tá vẫn bị chặn vì Phá Quân chưa đủ đặc tả.
3. `vn-2`: 2000-08-16 02:00, Mệnh không chính tinh. Một giải thích cấu trúc; không tự mượn sao đối cung hoặc đánh giá tốt/xấu.

Chốt engine `vn-adapter-1.0.0`, calendar `vn-astronomical-1.0.0`, bridge `iztro-vn-bridge-1.0.0`, iztro 2.6.1; rules `interpretation-1.4.0`, preview `reading-preview-2.3.0`, template `beta-reader-1.0.0`. Rule hash `6c2e27f7adf8b090b922ecf2ebc84ceaa8f3ca245086580c3844862e2b674aa8`.

Ba edition bất biến lưu document, snapshot, versions; `editions.json` trong thư mục riêng lưu mã edition/quyền, phiên bản và claim. `source-manifest.json` chốt SHA256 mã nguồn bản chạy. Nâng rule không sửa ba bản này.

Hạn đọc DEMO: 15/10/2026 09:51 giờ Việt Nam. Ngày dọn dự kiến: 22/10/2026. Đây là lựa chọn cho dữ liệu giả lập; chưa có lịch xóa tự động hoặc chính sách cho người thật. Chủ dự án dừng/dọn môi trường sau nghiệm thu.

## Mở quyền thử an toàn

Từ terminal tại `/Volumes/DATA/TINHLUAN`, chạy một mẫu mỗi lần:

```sh
node scripts/beta-sandbox-access.mjs open demo-wuqu-tianfu
node scripts/beta-sandbox-access.mjs open engine-combo
node scripts/beta-sandbox-access.mjs open vn-2
```

Mỗi lệnh đọc liên kết từ file riêng 0600 và mở trình duyệt mặc định, không in token hoặc gửi thông điệp. Ba liên kết bàn giao chưa bị kiểm thử tiêu thụ. Không copy URL chứa fragment vào chat, log hay chụp màn hình thanh địa chỉ. Fragment được xóa trước gọi API. Chỉ dùng máy cục bộ tin cậy: trình duyệt vẫn có thể giữ lịch sử/extension có thể đọc trang; không chia sẻ profile trình duyệt.

Một trình duyệt chỉ có một phiên beta tại một thời điểm. Đọc và gửi xong một mẫu trước khi đổi mẫu; không gửi từ tab cũ sau khi đổi. Muốn so sánh đồng thời, dùng các browser profile riêng. Sau lần mở đầu, quay lại cùng trình duyệt bằng `/beta`; link đã dùng không dùng được trên browser khác.

Nếu link đã dùng và cần mở lại mẫu trước khi thu hồi:

```sh
node scripts/beta-sandbox-access.mjs reissue demo-wuqu-tianfu
node scripts/beta-sandbox-access.mjs open demo-wuqu-tianfu
```

Reissue thay link một lần và vô hiệu hóa phiên cũ; không khôi phục quyền đã thu hồi/hết hạn. File quyền nằm dưới `.local/beta-sandbox-20261008/links/`, không gửi hoặc public thư mục này.

## Thử trọn luồng

1. Mở mẫu bằng lệnh trên. Đọc nhãn dữ liệu giả lập, giới hạn, lưu dữ liệu rồi chọn bắt đầu.
2. Mở “Xem căn cứ” ở một chú giải. Đọc yếu tố, nguồn, điều kiện và giới hạn.
3. “Đánh dấu đoạn”: chọn nhãn, mức hiểu, có tìm được căn cứ, ghi nội dung bắt đầu bằng **DEMO chủ dự án**; gửi.
4. Chọn “Toàn báo cáo” trong “Phản hồi cho”; gửi phản hồi toàn bài. Tải lại để thử mở lại bài.
5. Mở quản trị thử bằng lệnh dưới đây. Lệnh chép **khóa sandbox riêng** vào clipboard và mở trang đăng nhập; dán vào ô khóa, đăng nhập rồi xóa clipboard (chép một đoạn không nhạy cảm). Không chia sẻ khóa với người đọc.

```sh
node scripts/beta-sandbox-access.mjs owner
```

6. Vào `/internal/beta`: chọn đúng edition/mã người thử, mở nội dung chốt, đối chiếu phản hồi theo đoạn/toàn bài, claim và phiên bản. Có sẵn sáu phản hồi “DEMO tự động” từ nghiệm thu (hai mỗi mẫu), không phải ý kiến thật. Số “được mời” vẫn 0. Ba quyền kiểm thử đã hoàn thành/thu hồi tách khỏi ba quyền bàn giao chưa dùng.
7. Thu hồi một mẫu sau khi kiểm tra xong:

```sh
node scripts/beta-sandbox-access.mjs revoke demo-wuqu-tianfu
```

Tải lại `/beta` tại trình duyệt đã mở mẫu đó: không đọc hoặc gửi thêm được. Thay mã mẫu để thu hồi hai mẫu khác. Không thể xóa từ xa nội dung đã được người đọc chụp/lưu. Nếu muốn thử lại sau thu hồi, chủ dự án phải cấp quyền mới bằng CLI trong app-copy và lưu file riêng; không sửa grant cũ thành hoạt động.

## Khởi động/dừng và dọn

Server đang được để chạy cho nghiệm thu. Nếu tiến trình đã dừng:

```sh
node scripts/beta-sandbox-access.mjs start
```

Dừng bằng Ctrl+C trong terminal chạy server. Không dừng server cổng 3000. Thư mục riêng có quyền 0700, `.env` và file quyền 0600; không in các file này. Không chạy lại setup/seed trên sandbox có dữ liệu; chúng từ chối ghi đè.

Dọn các edition đến hạn (chỉ database riêng):

```sh
cd /Volumes/DATA/TINHLUAN/.local/beta-sandbox-20261008/app-copy
node --env-file=.env --import tsx scripts/beta.ts purge
```

Sau khi dọn, chủ dự án cũng xóa file link đã hết hạn và quyết định giữ/xóa bản source/log. Không tự dọn trong khi đang nghiệm thu.

## Kiểm chứng đã chạy

- Production build bản riêng: đạt, gồm TypeScript. Lượt đầu phát hiện lỗi trường metadata `input` thay vì `normalized` trong script chuẩn bị; đã sửa và build lại đạt, không sửa snapshot/engine.
- Typecheck mã nguồn chính: đạt.
- Unit/hồi quy `tests/beta.test.ts` và `tests/internal-origin.test.ts` trên DB riêng: 15/15 đạt (1,31 giây).
- E2E ba edition: đạt (1 scenario, 7.6 giây), Chrome; 360px/390px, xem căn cứ, hai loại phản hồi gắn đúng phiên bản/claim, mở lại, quản trị đối chiếu, beta không có quyền internal, thu hồi trả 401. Không tràn ngang cấp trang.
- Hash document/snapshot/versions trước/sau E2E không đổi. Orders/payment_transactions/email_deliveries trong DB thử bằng 0. Website chính beta vẫn tắt.
- Lượt E2E đầu thất bại vì môi trường chạy riêng đã lọc mất USER dùng mặc định bởi PostgreSQL local; sửa launcher giữ USER/LOGNAME, chạy lại đạt. Không nới xác thực, không đổi cookie Secure.

Log build, E2E và unit test ở `.local/beta-sandbox-20261008/`; không chứa liên kết bàn giao hoặc khóa. Các phản hồi do test tạo có nhãn rõ và được giữ để đối chiếu. Chưa có đánh giá từ người thật, chưa kiểm thử HTTPS/tunnel hay thiết bị ngoài máy này.
