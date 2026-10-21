# G4 — Checkout một gói trên SePay Test Mode

Ngày 19/10/2026. QA chính 3062; không mở Live hoặc giá thương mại. Chỉ hai tài khoản Google A/B đã được chủ dự án chỉ định có thể tạo đơn thử. Tài khoản khác vẫn thấy chưa mở bán.

- [Lá số của tôi](https://61ac-171-246-109-226.ngrok-free.app/la-so-cua-toi)
- [Lập lá số](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so)
- [Đơn nghiệm thu — chỉ chủ sở hữu](https://61ac-171-246-109-226.ngrok-free.app/checkout?order=64d308a2-f679-4a92-92e1-28593f1b18d4)

## Phạm vi đã nối

Từ cung khóa tới phạm vi gói của đúng bản lưu, đăng nhập Google nếu cần, tạo đơn, QR Test Mode, chờ máy chủ xác nhận và worker giao bản, quay lại điểm cung đã lưu. Trang phạm vi nêu rõ cung có lời và cung chưa có lời; mở quyền không tạo thêm nội dung. Khách có phiên sở hữu cũng xem được phạm vi trước đăng nhập; không gửi lời bị khóa xuống trang gói.

Cấu hình máy chủ `qa-g4-1.0.0`: **1.000đ mô phỏng, 72 giờ từ paid_at, đơn chờ thanh toán 60 phút**. Đây chỉ là giá/hạn kiểm thử, chưa được chốt làm giá/hạn thương mại. Giao diện yêu cầu dùng SePay Test Mode, không chuyển tiền thật hoặc quét bằng ứng dụng ngân hàng thật. Hỗ trợ đúng tài khoản ACB Sandbox đang xác minh, chưa mở QR cho ngân hàng/VA khác.

Đơn gắn user ID, reading ID, snapshot, hash toàn bản, policy và điều khoản phiên bản. Dùng chung orders, report_jobs, webhook/API settlement, reports và access_tokens hiện có. Worker không gọi engine/catalog; chỉ giao bản cố định và liên kết quyền vào tài khoản. Không có endpoint công khai tự đánh dấu paid. G4 không gửi email.

- Bấm lặp/concurrent hoặc tải lại dùng cùng đơn cho cùng tài khoản + bản đọc. Đơn hết hạn/thu hồi vẫn được trả lại với trạng thái tương ứng; không tự tạo đơn mới/gia hạn.
- Hạn quyền mua thử độc lập với hạn phiên Google và quyền miễn phí. Worker retry không sửa hạn hay phục hồi grant đã thu hồi/hết hạn.
- API đơn, báo cáo và PDF kiểm quyền máy chủ. Số tiền/điều khoản chỉ từ server; JSON thêm trường amount bị từ chối. Google callback giữ điểm quay lại trong danh sách route/anchor cho phép.
- Thư viện hiển thị đơn chờ/đã giao và bản đã mở bằng gói thử, có nhãn kiểm thử; không gộp đơn mock cũ thành mua thật.
- Các trạng thái: chờ thanh toán, hết hạn đơn, đã thanh toán/đang giao, lỗi giao, đã giao, quyền hết hạn/thu hồi. Poll chỉ đọc trạng thái; nút sao chép không xác nhận thanh toán.

## Bằng chứng SePay thật và PDF

Chủ dự án đăng nhập Google, tạo bản **“G4 nghiệm thu”** và đơn `CORE64D308A2F679`, reading `513211fa-72dd-4c0f-b5e8-86ca63611bc3`. Điểm quay lại lưu là `cung-11` — Huynh Đệ.

1. SePay Test Mode **#39519**, 2.000đ, cùng mã: webhook thật HTTP200 lúc 10:49:47 VN, disposition `mismatch`. HTTP200 là đã ghi nhận sự kiện, không phải chấp nhận thanh toán. Đơn vẫn pending, chưa có report/grant/link.
2. **#39520**, đúng 1.000đ: webhook thật HTTP200 lúc 10:50:56 VN, disposition `accepted`; worker giao thành công. Chủ dự án xác nhận giao diện “Đã giao báo cáo”.
3. Chủ dự án tải PDF qua phiên sở hữu. Tệp [PDF nghiệm thu](../.local/g4-20261019/g4-checkout.pdf) có 8 trang, tên đúng, **19/19 đoạn nguyên văn và 4/4 ghi chú phạm vi** từ customerReport đã lưu. Đã render và xem đủ 8 trang, không thấy mất dấu, chữ bị cắt hoặc trang trắng. Một tệp duy nhất được xuất trong gói, không xuất lại bộ PDF. Phần ngũ hành tiếp tục sang trang sau nhưng không mất câu; giữ bố cục PDF hiện có.
4. Gửi lại webhook trực tiếp: chủ dự án báo giao diện SePay hiện không có nút gọi lại; máy chủ/tunnel không thấy request thứ ba. **Không báo ca thao tác resend webhook thật là đạt.**
5. Thay vào đó đã chạy **API Sandbox thật**, một trang/6 giao dịch, rồi chạy lại. API UUID `49026646-cb70-11f1-b21a-a6006ab65aca` ánh xạ về webhook `sepay:test:39520` qua reference chuẩn hóa, trả `duplicate` cả hai lần. API ID khác webhook ID; không mặc định chúng giống nhau. #39519 cũng nhận diện trùng nhưng vẫn giữ disposition nghiệp vụ sai tiền ban đầu.
6. Tài khoản Google QA còn lại: chủ dự án xác nhận cả đơn, đọc báo cáo và PDF đều bị chặn. Chủ dự án không thấy nút quay lại: kiểm trực tiếp Chrome thấy đang ở trang báo cáo `/don-thu?...#cung-11`, Huynh Đệ đã mở. Nút “Mở lại đúng cung đang đọc” thuộc trang `/checkout?order=…`, không nằm trên trang báo cáo. Chưa xác nhận được thao tác click thật từ trang checkout; không kết luận lỗi nút chỉ từ việc không có nút trên trang báo cáo.
7. Sau API lặp vẫn đúng **1 payment_transaction, 1 report_job, 1 report, 1 grant, 1 account link** của đơn. Bản gốc = binding = bản worker giao theo canonical hash; snapshot/policy/phiên bản trùng. Hạn 22/10/2026 10:50:56.426 VN, đúng 72 giờ từ paid_at, không đổi sau đối soát.

Chi tiết: [final-evidence.json](../.local/g4-20261019/final-evidence.json), [events-wrong.json](../.local/g4-20261019/events-wrong.json), [API lần đầu](../.local/g4-20261019/reconcile-real.json), [API chạy lại](../.local/g4-20261019/reconcile-real-repeat.json), [PDF so chữ](../.local/g4-20261019/pdf-check.json), [ảnh đủ trang](../.local/g4-20261019/pdf-contact.png).

## Kiểm tự động và trình duyệt — phân biệt fixture

- Lượt đầu **58/58, 7 file**: checkout, workspace, reading-scope, SePay webhook/API, public PDF, direct form. Lệnh có một filter tên `order-readings.test.ts` không tồn tại; không tính nó là file đã chạy. Bộ đúng `core-orders.test.ts` được chạy ở lượt sau.
- Lượt bổ sung checkout/core/accounts: **19 đạt, 3 lỗi**. Test dùng lại ID giao dịch fixture cố định trên database test của lượt trước, gây xung đột sự kiện và hai ca phụ thuộc thất bại. Đổi ID fixture theo từng lần chạy; không sửa assertion hoặc expected nguồn/lịch sử. Chạy lại **22/22, 3 file**.
- Sau bổ sung phạm vi trước đăng nhập, chạy lại riêng checkout: **6/6**. Không cộng các lượt chồng lấp thành số test độc lập.
- Typecheck đầu đạt; khi thêm test nhận lỗi TS2345 do `transferType` bị suy thành string. Đã khai báo literal `'in' as const`; typecheck chạy lại và lượt cuối đạt. Production build đầu và build cuối sau phần scope đều đạt (`build-scope.log`). Không chạy toàn bộ gate/nội dung/PDF.
- Test kiểm bấm đồng thời, amount từ client, account sở hữu, scope chưa có lời, Live fail-closed, auth/sai tiền/mã/tài khoản, webhook lặp/API alias, retry worker, nguyên văn/hash, expiry/revocation, quyền cũ, foreign đọc/đơn/PDF và Google return URL. Hai tài khoản trong test là danh tính fixture, không gọi đó là Google thật.
- Production UI fixture ở database riêng: cung khóa → phạm vi → tạo đơn → QR tải được → sao chép mã → reload giữ đơn → mock settlement → giao → quay lại đúng Quan Lộc với điều chỉnh gốc. **Đây là mock, tách khỏi giao dịch SePay thật ở trên.** Đã kiểm 360/390px, document không rộng hơn viewport. Bản QA chính còn kiểm desktop guest thấy đúng danh sách phạm vi trước Google, không có văn bị khóa.
- Bằng chứng ảnh: [phạm vi 390px](../.local/g4-20261019/scope-390.png), [QR 390px](../.local/g4-20261019/qr-390.png), [QR 360px](../.local/g4-20261019/qr-360.png), [đã giao 360px](../.local/g4-20261019/delivered-360.png), [guest QA chính desktop](../.local/g4-20261019/guest-scope-desktop.png). Các ảnh mobile là fixture giao diện, không phải ảnh SePay/Google thật.

## Triển khai, cấu hình, bảo toàn

QA3062 chạy `.local/g4-20261019/qa-final`, web và một worker dùng `runtime-final.mjs` cùng thư mục. Tái sử dụng database/kho QA chính, không chép fixture vào QA. QA3070 giữ nguyên. Phiên bản nội dung **1.47.0**, catalog **interpretation-1.45.0**, policy **menh-free-1.0.0** không đổi; checkout `g4-test-1`/offer `qa-g4-1.0.0` riêng.

Migration bổ sung `db/009_test_checkout.sql` sau backup, chỉ thêm bảng liên kết checkout và trigger bất biến; không cập nhật quyền cũ hoặc giá gói cũ. Backup trước migration gồm 29 bảng, 31 tệp internal, 44 tệp trial (gồm tệp phiên, không phải số lá số). Dump SHA-256 `05a4fc4a741e3da8afee8a4f620456961540bb6e645beec833ef3bf35e7ff96c`. Kho private-backup nằm trong `.local/g4-20261019/`, không công khai.

Sau nghiệm thu, mọi tệp cũ nguyên hash; thêm đúng một bản G4. 54 tệp engine/catalog/lịch được bảo vệ không đổi. Các hàng cũ báo cáo/đơn/quyền/account/Toàn thư không đổi. Thay đổi hợp lệ ở bảng OAuth flow, rate_limits và checkpoint đối soát do thao tác thật; không dùng hash toàn bảng có thêm hàng mới để báo nhầm lịch sử bị sửa. [Manifest sau](../.local/g4-20261019/preservation.json).

Mẫu cấu hình `.env.checkout-qa.example` không chứa secret, mặc định disabled. File `.env.checkout-qa` riêng có allowlist ID A/B do chủ dự án chọn; không đưa vào Git/bàn giao. Cùng `.env`, `.env.gmail-qa`, `.env.google-qa` cho server/worker. Gmail chỉ địa chỉ thử; SePay Live=false. Không ghi secret/cookie/token vào bằng chứng.

Chạy đối soát thủ công trên QA hiện hành (giữ cấu hình Test đã có):

```sh
node --env-file=.env .local/sepay-reconcile-20261016/run.mjs --page-size=100 --max-pages=2
```

Nếu cần quay lại: đóng `CHECKOUT_TEST_ENABLED`, dừng web/worker G4 bằng PID đã xác minh, giữ database/kho và migration bổ sung. Không chạy worker cũ giao các đơn G4 đang chờ vì worker cũ chưa liên kết quyền tài khoản. Giữ worker G4 tương thích hoặc dừng xử lý cho tới sửa; không restore dump cũ đè lên đơn đã phát sinh. Checkout G3 trước đó còn trong `.local/g3-20261019/qa-final` để đối chiếu UI.

Files thay đổi nằm trong [changes.json](../.local/g4-20261019/changes.json), kèm `next.config.ts` (Referrer-Policy cho form Google/checkout), test checkout, mẫu env và ignore cấu hình riêng. `release.json` ghi hash đối chiếu mã root/QA cuối. Không sửa renderer PDF hoặc lời luận.

## Giới hạn và điểm dừng

G4 là ứng viên checkout **Test Mode**, không phải mở bán. Còn giá/hạn/chính sách thương mại, SePay Live, domain triển khai ổn định, G1b Zalo chờ duyệt; **hoàn thiện nội dung 12 cung vẫn là hạng mục riêng bắt buộc trước mở bán**. Không mở G5 hoặc thêm tính năng trong gói này.

Resend webhook thật chưa thao tác được trên dashboard; webhook lặp đã kiểm cục bộ, chống trùng webhook/API và API chạy lại đã kiểm bằng SePay thật. Quyền chéo đơn/đọc/PDF đã đạt trong test HTTP/fixture. Google thật: chủ dự án đã xác nhận tài khoản còn lại bị chặn cả đơn/đọc/PDF. Đã quan sát bản đọc thật ở #cung-11 với Huynh Đệ mở; thao tác click nút từ checkout chưa xác nhận, theo ghi chú ở trên. Không sửa code hoặc chạy lại test/build cho lượt ghi nhận này.

Nguồn triển khai: [SePay QR Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode/mo-phong-tao-ma-vietqr), [tham số QR](https://developer.sepay.vn/vi/tien-ich-khac/tao-qr-code), [mô phỏng giao dịch](https://docs.sepay.vn/gia-lap-giao-dich.html). G4 tái sử dụng adapter webhook/API đã nghiệm thu; không đổi quy ước giao dịch.

Thời gian thực tế: khoảng 28 phút, từ 10:35 đến 11:03 ngày 19/10/2026 (Asia/Ho_Chi_Minh), gồm chờ thao tác SePay/Google/PDF. Chức năng G4 và các kiểm kỹ thuật đã hoàn thành; các xác nhận thao tác thật còn thiếu được ghi riêng ở trên.
