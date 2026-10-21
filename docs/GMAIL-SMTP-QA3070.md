# Gmail SMTP — nghiệm thu khôi phục bản đọc/PDF trên QA3070

Cập nhật cuối 18/10/2026. **Đạt nghiệm thu gửi/nhận Gmail thật, xác minh email, yêu cầu mở lại, mở đúng báo cáo trên Chrome và tải PDF bằng quyền khôi phục trên QA3070.** Đã thử trực tiếp token dùng lại và đọc chéo bị chặn. Ca hết hạn/thu hồi/retry gửi lỗi và quyền PDF chéo được kiểm bằng test tích hợp, không giả là thử thư thật cho tất cả trạng thái. QA3062 và34bài Toàn thư công khai giữ nguyên.

[Thử QA3070](https://b513-2402-800-63b9-f9cd-3d68-43fe-2f90-a120.ngrok-free.app/lap-la-so) · [Yêu cầu mở lại](https://b513-2402-800-63b9-f9cd-3d68-43fe-2f90-a120.ngrok-free.app/recover?reading=1). Gmail hiện chỉ cho gửi tới một địa chỉ nhận thử do chủ dự án cấu hình; chưa mở gửi đại trà. Link ngrok là tạm, cần giữ máy chủ và tunnel hoạt động.


## Điền cấu hình trên máy

File riêng: `/Volumes/DATA/TINHLUAN/.env.gmail-qa` (đã tạo, quyền600, nằm trong `.gitignore`). File mẫu không chứa secret: `.env.gmail-qa.example`. Không đưa file riêng, App Password hoặc link khôi phục vào chat/Git/bàn giao.

Điền ba mục:

- `GMAIL_SMTP_USER`: địa chỉ Gmail đầy đủ, ví dụ tài khoản có đuôi `@gmail.com`.
- `GMAIL_SMTP_APP_PASSWORD`: App Password Google, không phải mật khẩu đăng nhập Google. Có thể dán dạng bốn nhóm; adapter bỏ khoảng trắng. Google yêu cầu bật xác minh hai bước để tạo App Password. Tạo trực tiếp trên trang tài khoản Google, không nhờ agent nhập hoặc đổi mật khẩu.
- `GMAIL_SMTP_TEST_TO`: **một địa chỉ duy nhất được chủ dự án chỉ định nhận thử**. Adapter từ chối mọi địa chỉ khác trước khi kết nối SMTP; không có CC/BCC hoặc gửi hàng loạt.

Giữ `GMAIL_SMTP_ENABLED=false` trong lúc điền. `RECOVERY_ORIGIN` sẽ là origin HTTPS riêng trỏ **QA3070**, không dùng tunnel QA3062, không thêm đường dẫn hoặc fragment. From luôn là tài khoản Gmail trên với tên “Tinh Luận”, không cần EMAIL_FROM riêng.

Sau khi lưu, báo “đã lưu cấu hình Gmail”, không gửi giá trị. Bước bật gửi chỉ thực hiện sau kiểm cấu hình và HTTPS. Việc SMTP chấp nhận không chứng minh thư đã vào Inbox; phải kiểm hộp thư người nhận, cả thư rác nếu cần.

## HTTPS đã cấu hình theo ủy quyền

Chủ dự án đã xác nhận mở ngrok riêng cho QA3070 và đã lưu cấu hình Gmail. Endpoint riêng đang hoạt động:

https://b513-2402-800-63b9-f9cd-3d68-43fe-2f90-a120.ngrok-free.app

Tunnel `tinhluan-qa3070-email` trỏ `http://127.0.0.1:3070`, inspection=false. Tunnel QA3062 `https://61ac-171-246-109-226.ngrok-free.app` giữ nguyên. Trước khi có ủy quyền, auto-review từng chặn; sau khi có ủy quyền đã tạo thành công. Lần gọi API có trường bind_tls trả400; loại trường không được hỗ trợ, dùng schemes=https, kết quả201. Không ảnh hưởng endpoint3062.

`RECOVERY_ORIGIN`, `APP_ORIGIN` và allowlist khách dùng cùng HTTPS3070; PDF render qua loopback3070. Gmail được bật, server/worker dùng cùng cấu hình riêng. Trước khi bật đã kiểm queue không có email pending/retry. Cookie khôi phục Secure trên HTTPS; token nằm trong fragment, GET không tiêu thụ, POST Tiếp tục mới đổi quyền.

## Triển khai

- `lib/notifications/gmail.ts`: Nodemailer10.1.2, `smtp.gmail.com:587`, `secure=false`, **requireTLS=true**, ignoreTLS=false, TLS>=1.2 và kiểm chứng chỉ/hostname. Không fallback plaintext, không tắt kiểm chứng chỉ.
- `sendEmail` chọn provider trong module notifications hiện có. Cả nhánh khôi phục và email worker tái sử dụng queue `email_deliveries`, savepoint/transaction, retry/backoff cũ. Không tạo queue/worker/report thứ hai.
- Gmail chỉ chạy khi provider=`gmail-smtp`, cờ bật, Gmail/App Password/địa chỉ nhận thử/HTTPS hợp lệ. Không cấu hình host/port tùy ý. Kiểm link đúng origin, đường `/recover`, fragment token đúng dạng, và messageID hợp lệ trước khi gửi.
- Gửi text tiếng Việt, tên Tinh Luận, từ/envelope trùng tài khoản. Không đính kèm báo cáo; người nhận phải đổi link thành phiên có quyền rồi tải PDF hiện có. Tắt SMTP logger/debug, URL/file attachment access; mọi lỗi SMTP được che thành mã chung. Không ghi địa chỉ nhận, mật khẩu, SMTP response hoặc token vào log.
- `email_deliveries.status=sent` nghĩa là provider trả thành công, **không phải xác nhận đã tới hộp thư**. Với nhánh đơn dùng Gmail, `orders.email_status=smtp_accepted`; local vẫn giữ `local`. Không thêm tracking pixel hoặc cơ chế xác nhận đọc thư.
- Mạng/SMTP có thể chấp nhận rồi timeout trước khi ứng dụng biết: retry có thể gửi thư lần nữa. Không hứa email exactly-once. Mỗi link vẫn theo quyền gốc và token một lần; không tạo lại báo cáo hoặc gia hạn.

## QA đã chạy

- Lượt đầu:17/17 test ở3file Gmail SMTP, reading recovery, core orders; không lỗi/skip.
- Thêm ca tích hợp Gmail giả lập với worker: lượt cuối18/18 ở3file, không lỗi/skip. Ca SMTP từ chối rollback token, queue retry, lượt sau thành công, token đổi một lần, đúng artifact/hạn gốc, không đọc chéo. SMTP test dùng mock transport; **không phải kết nối thật tới Gmail**.
- Các ca provider: bắt buộc STARTTLS/chứng chỉ, From đúng, cấu hình thiếu/tắt/HTTP, người nhận khác, URL khác host/path, sanitize lỗi, accepted/rejected và retry.
- Typecheck trước/sau bổ sung test đạt. Production build QA3070 đạt (cảnh báo Next nhiều lockfile/workspace root, không lỗi build). Không chạy gate nội dung/PDF.
- Trước bật Gmail: nạp QA3070 từ checkout riêng `.local/gmail-recovery-20261018/qa`, chỉ cập nhật email provider/dispatch và dependency, giữ database/kho báo cáo của QA3070 cũ. Server93951/worker93952 chạy **provider local**, Gmail tắt. Smoke: `/lap-la-so`, `/recover?reading=1` trả200, API quản trị không đăng nhập403. QA3062 giữ PID90953, API vẫn34bài.
- Bằng chứng kiểm cục bộ trên chưa bao gồm gửi thật; kết quả gửi thật xem mục bên dưới. Chưa chạy lại tải PDF thật bằng link Gmail. Bằng chứng cũ local-mail/PDF giữ ở `READING-EMAIL-RECOVERY-QA.md`, không dùng để báo nghiệm thu Gmail.

Bằng chứng mới: `.local/gmail-recovery-20261018/` gồm tests.log, tests-final.log, typecheck-final.log, build.log, smoke.json, changed-code.json. Không đính kèm file cấu hình hoặc hộp thư local.

## Vận hành sau khi đủ cấu hình

Từ thư mục dự án, lệnh kiểm chỉ báo **tên mục còn thiếu**, không in giá trị:

```sh
node --env-file=.env --env-file=.env.gmail-qa .local/gmail-recovery-20261018/runtime.mjs check
```

Runtime `start`/`worker` nạp cùng hai file env; phải dừng đúng PID3070 cũ trước khi khởi động, không chạy chồng. Runtime giữ database/kho3070, tắt SePay Test/Live và payment provider mock. Không cần build lại khi chỉ đổi cấu hình server. Không dùng runtime cũ trong `reading-recovery-20261018/` vì nó cố định provider local.

Khi cấu hình đầy đủ, kiểm đích HTTPS và địa chỉ được phép; mới bật `GMAIL_SMTP_ENABLED=true`, khởi động lại server/worker3070. Khóa người nhận thử vẫn bắt buộc. Chưa cần sửa trang khách hoặc thêm chức năng.

## Kịch bản nghiệm thu thật (kết quả cuối ở dưới)

1. Qua origin HTTPS3070, tạo bản mới, gắn đúng email được cho phép; đọc trạng thái worker chỉ để xác nhận SMTP chấp nhận.
2. Chủ hộp thư xác nhận thư thực nhận (Inbox/Spam); mở link và bấm Tiếp tục. Không đưa URL chứa token vào log/bàn giao.
3. Yêu cầu khôi phục email đã xác minh; nhận thư mới. Mở trên trình duyệt khác/phiên mới không có cookie sở hữu; đọc đúng bản frozen và tải đúng PDF. So tên/phiên bản/nội dung với bản lưu, không tạo lại catalog.
4. Dùng lại token bị chặn; đổi ID không đọc/tải bản khác. Quyền hết hạn/thu hồi tiếp tục bị chặn theo hợp đồng đã kiểm.
5. Ghi riêng thời điểm SMTP chấp nhận và bằng chứng thư thực nhận. Nếu PDF lỗi, ghi hiện tượng/status và log đã lọc trước khi retry.

## Nhật ký nghiệm thu thật — lần đầu gửi

- Tạo qua biểu mẫu HTTPS một hồ sơ giả định “Nghiệm thu Gmail QA”, ngày07/08/1992, giờThân, nam. Bản lưu mới `a20590ba-271e-4581-b229-5b3ffce299a6`; không dùng lại báo cáo lịch sử.
- Gắn đúng người nhận được cấu hình bằng phiên đang sở hữu. API trả thông báo chung, không trả token/link. Worker job `4eed41b1-e757-481d-a447-c04138ce1370`: **sent, attempts=1, last_error=null**. Đây là kết nối Gmail SMTP thật; Nodemailer xác nhận accepted cho địa chỉ cho phép. Không phải giả lập cục bộ.
- `verified_at=null` khi kiểm lần đầu: đang chờ chủ hộp thư xác nhận thư thực nhận và bấm Tiếp tục. Không coi SMTP accepted là đã nhận Inbox.
- Mobile390/360px: form gắn email, nút gửi và thông báo rõ; body.scrollWidth bằng viewport, không tràn. Ảnh đã xóa địa chỉ khỏi ô trước khi chụp: email-390.png/email-360.png. Locator theo role+nhãn có dấu cộng không khớp summary; đổi sang summary theo chữ thực tế rồi thao tác được, không sửa code.
- Chưa khép ca khôi phục ở trình duyệt mới, PDF từ phiên khôi phục thật và token Gmail dùng lại. Ca tương ứng trong test/local đã đạt trước đó, không thay thế nghiệm thu thật.
- Server/worker QA3070 hiện chạy Gmail QA; chỉ cho phép một người nhận đã cấu hình. QA3062 và34bài Toàn thư giữ nguyên. Không bật Live hoặc gửi khách đại trà.

Bằng chứng gửi thật: `.local/gmail-recovery-20261018/live-send-status.json`; không lưu token, mật khẩu hay nội dung thư. Khi chủ dự án thao tác email xong, cập nhật tiếp kết quả tại đây.

## Tài liệu chính thức đã đối chiếu

- [Google — thông số SMTP Gmail, TLS/STARTTLS587](https://support.google.com/mail/answer/7104828?hl=en-GB).
- [Google — App Password và xác minh hai bước](https://support.google.com/accounts/answer/185833).
- [Nodemailer — SMTP, requireTLS, bảo vệ dữ liệu và timeout](https://nodemailer.com/smtp).


### Cập nhật người nhận xác nhận thư thật

Chủ dự án báo “đã mở được Nghiệm thu Gmail QA”. Máy chủ ghi verified_at=2026-10-18T05:45:45.975Z; reading-magic đầu đã revoked/tiêu thụ, một reading-session còn hiệu lực, không vượt hạn gốc2026-10-25T05:41:51.004Z. Quan sát Chrome thật mở đúng bản chi tiết a20590ba-271e-4581-b229-5b3ffce299a6; hồ sơ/luận đúng bản lưu. Bản lưu chỉ1file, SHA-256 ce4f0f4dc3c2d8bad92cb6acf1390e421c6cde5863f151bdcba2d83b66b4f0e1, không đổi sau xác minh.

Đã yêu cầu mở lại qua form bằng email đã xác minh: worker gửi thành công, thêm1magic token chưa dùng, giữ1session cũ. attempts=1 là số lần của chu kỳ gửi hiện tại (queue tái sử dụng hàng), không dùng số này để kết luận chỉ có1thư trong cả lượt.

Lượt bấm PDF trên Chrome bị ngắt do người dùng chuyển sang Toàn thư trước thao tác; chưa có bằng chứng request PDF hoặc lỗi PDF, không ghi là PDF lỗi. Đã đề nghị giữ tab để kiểm tiếp. Không xuất token/cookie/email vào tài liệu.


## Kết quả cuối — khép nghiệm thu Gmail QA

1. **Gửi/nhận thật:** Gmail chấp nhận thư xác minh; chủ hộp thư xác nhận thư đến và đã mở “Nghiệm thu Gmail QA”. Máy chủ ghi verified_at05:45:45.975Z. Không dùng trạng thái sent thay bằng chứng nhận thư.
2. **Khôi phục:** yêu cầu gửi lại qua form bằng email đã xác minh; Gmail nhận gửi, người dùng mở thư thứ hai và Tiếp tục. Máy chủ có2magic đã dùng và2session hợp lệ (mỗi lần đổi1session), cùng hạn gốc25/10/2026 05:41:51.004Z. Không tạo thêm báo cáo, không kéo dài quyền. Chrome thật hiển thị đúng bản chi tiết, không có chức năng sửa/gắn email dành cho phiên sở hữu gốc; phù hợp nhánh recovered trong page.
3. **PDF thật:** bấm tải từ Chrome phục hồi; ứng dụng trả PDF, hộp thoại macOS xuất hiện. Điều khiển Save gặp nút disabled, nhập tên bị nối chuỗi ở một lượt; đã khôi phục tên và người dùng lưu giúp. Đây là trở ngại điều khiển hộp thoại, không có bằng chứng lỗi PDF máy chủ; không xuất lại. File `gmail-qa-recovered.pdf`,9trang, tên/ngày sinh đúng, phiên bản1.47.0, đủ22/22đoạn customerReport đã lưu sau chuẩn hóa khoảng trắng/NFC. Không có U+FFFD, đã render/xem cả9trang, không thấy chữ bị cắt/chồng hoặc trang trắng. Lời cũ “chưa có thông tin nơi sinh” còn trong bìa PDF thuộc renderer hiện hành; không sửa ngoài phạm vi email.
4. **Token dùng lại:** mở lại đúng link trong thư Gmail vừa dùng, bấm Tiếp tục; web báo “Liên kết hoặc quyền truy cập không còn hợp lệ…”. Sau đó DB vẫn2session, không tạo session thứ3. Không lưu raw link/token.
5. **Không đọc chéo:** trên Chrome đã phục hồi, đổi ID sang một bản QA có thật khác (`5658e384-e6a3-48b9-a1c3-72fb38c7e368`); trang hiện “Không mở được bản đọc / Báo cáo không thuộc phiên…”. Thử URL PDF chéo bằng native Chrome không trả nội dung AX đọc được, không kết luận từ màn hình đó. Quyền PDF chéo đã có test route tích hợp và không-cookie HTTP404. Không dùng thử UI không quan sát được làm bằng chứng đạt.
6. **Không-cookie:** API đọc và PDF của bản nghiệm thu trả404. GET sai đường internal trả404/405 không được tính là kiểm quyền; kiểm đúng `/api/internal-admin?view=reports` trả403. API Toàn thư3062 vẫn34bài công khai.
7. **Bảo toàn:** bản mới chỉ1artifact, hash trước/sau ce4f0f4dc3c2d8bad92cb6acf1390e421c6cde5863f151bdcba2d83b66b4f0e1. Không sửa engine/catalog/lịch sử hoặc payment. Không chạy lại build/gate vì lượt này chỉ thao tác nghiệm thu, kiểm file và cập nhật tài liệu;18/18test liên quan,typecheck/build lượt triển khai vẫn là kết quả có hiệu lực.

PDF SHA-256:81eaead2667cef7cd89b8497b5d766bbf5ef41a90e1fac73435dfe931db06cd6. Bằng chứng: `pdf-check.json`, `pdf-contact-sheet.jpg`, `chrome-cross-reading.png`, `chrome-token-reused.png`, `live-status.json` trong thư mục gói. Không chứa App Password/token/cookie.

**Giới hạn:** mới nghiệm thu một địa chỉ nhận thử và một hồ sơ giả định trên Gmail; không chứng minh mọi nhà cung cấp/hộp thư nhận được hoặc email tới Inbox thay vì Spam. Chưa gửi khách đại trà. Các lỗi gửi SMTP/retry, hết hạn và thu hồi kiểm trong test; không gây lỗi hoặc thu hồi báo cáo người dùng trên QA chỉ để thử. Hạ tầng HTTPS cố định, provider/sender phát hành và chính sách vận hành gửi thật vẫn là việc trước phát hành. Không phát sinh task nội dung hoặc thanh toán.
