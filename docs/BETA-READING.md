# Đọc thử miễn phí 5–10 người — chuẩn bị, chưa phát hành

Ngày 2026-10-08. Cờ `BETA_ENABLED` mặc định tắt; `.env` đang chạy không được bật bởi đợt triển khai này. Không gửi lời mời/email, không tạo người thử thật và không đổi rule draft thành approved. `/internal` và báo cáo mua hàng giữ nguyên chính sách. Beta là quyết định phát hành **riêng** của chủ dự án, không phải cách né phê duyệt nội dung.

## Phạm vi và dữ liệu

Chỉ Tổng quan của bản được chủ dự án chọn. Lấy dữ kiện và claim từ evaluator/template hiện có một lần lúc chuẩn bị; lưu bản chốt cùng snapshot gốc và phiên bản engine/profile/rules/hash/template. Không chạy lại evaluator khi người thử mở bài. Sửa nội dung phải tạo edition mới; feedback cũ vẫn gắn edition cũ. Không có AI, điểm vận mệnh, thanh toán hoặc hứa báo cáo hoàn chỉnh.

`beta_reports`, `beta_grants`, `beta_feedback` tách khỏi orders/reports/payments. Trigger cấm sửa document/snapshot/versions và cấm UPDATE feedback. Xóa được qua công cụ vận hành, có cascade. Chỉ bản chiếu gồm văn bản, căn cứ, giới hạn và dữ kiện liên quan được gửi tới người thử; không gửi snapshot đầy đủ, ngày sinh, rule trace/evidence paths hay khóa nội bộ. Mã đoạn/claim và phiên bản không phải thông tin xác thực.

Mã giả danh được sinh ngẫu nhiên, không cần tên/email/điện thoại. Chủ dự án giữ liên hệ mời bên ngoài ứng dụng theo sự đồng ý của người thử. Bản engine mẫu luôn ghi dữ liệu giả lập; không nói đó là lá số của người tham gia. Fixture kỹ thuật tổng hợp không được dùng làm nguồn `prepare --sample`.

Token ngẫu nhiên 32 byte, DB chỉ giữ hash. Liên kết `/beta#TOKEN` dùng một lần đổi thành cookie HttpOnly/SameSite Strict/Secure production, chỉ gửi tới `/api/beta`. Fragment được xóa bằng replaceState trước gọi API; không lưu token vào localStorage, analytics hoặc log. Referrer-Policy no-referrer, no-store, noindex, CSP cùng origin, nguồn bên ngoài chỉ mở khi nhấn với noreferrer. Mã báo cáo/giả danh không cấp quyền. Phiên beta không đọc đơn hàng hay `/internal`. Hết hạn/thu hồi kiểm trên mỗi lần đọc và ghi, kể cả sau khi đã đổi token; nội dung đã được người đọc chụp/lưu không thể thu hồi từ xa.

Giới hạn: phản hồi chỉ nhận section/claim có trong edition; phiên bản lấy từ server. Mã bản và mã người thử mà tab đang đọc phải khớp phiên hiện tại; nếu cookie đổi ở tab khác, máy chủ yêu cầu tải lại thay vì gắn nhầm phản hồi. UUID gửi lặp cùng nội dung không tạo thêm dòng; UUID đã dùng với nội dung khác bị từ chối. Tối đa 12 phản hồi/10 phút và 50 phản hồi/người; khóa giao dịch bảo vệ gửi đồng thời. Giới hạn 10 quyền chuẩn bị/cohort, kể cả quyền đã thu hồi. Không đo số người độc lập bằng số lượt đánh dấu.

## Quyết định bắt buộc trước mời người thật

1. Chọn phạm vi và từng bản đọc, kiểm lại quyền dùng dữ liệu sinh; không tự dùng báo cáo khách cho nghiên cứu. Nếu chỉ đọc mẫu, giới thiệu rõ dữ liệu giả lập.
2. Xem bản chốt tại `/internal/beta`: nội dung thiếu, phần thuật ngữ, tổ hợp bị chặn và nguồn/quyền còn pending. Quyết định có đủ cơ sở cho đợt đọc thử riêng; đây không phải phê duyệt chuyên môn hay quyền thương mại.
3. Chốt hạn truy cập và ngày dọn dữ liệu, người chịu trách nhiệm dọn, chính sách bản sao lưu, kênh xin rút/xóa. Tham số bắt buộc khi prepare, **không có thời hạn lưu mặc định ngầm**. UI nói ngày dọn dự kiến, không hứa xóa tự động. Cần bố trí lịch chạy purge thực tế trước mời người thật.
4. Chốt người phụ trách phản hồi, tên liên hệ trong lời mời, thông tin nguồn dữ liệu và sự đồng ý phù hợp. Dùng HTTPS ở môi trường phát hành, kiểm referrer/body logging của proxy, không cài analytics/third-party script trên beta.
5. Chủ dự án quyết định bật cờ và phát hành từng edition. Không chia sẻ INTERNAL_REVIEW_KEY. Nếu chưa quyết định, giữ cả cờ tắt và edition chưa release.

## Các lệnh vận hành (không tự chạy release/grant cho người thật)

Yêu cầu database đã cấu hình; không in `.env`. Lệnh dưới đây chạy trên máy chủ bởi chủ dự án/người được ủy quyền. UI nội bộ chỉ đọc, không tự gửi lời mời.

```sh
# Chỉ tạo schema beta; không đụng gói/đơn và không bật beta
node --env-file=.env --import tsx scripts/beta.ts migrate

# Tạo bản từ mẫu engine công khai. Thay hạn bằng quyết định cụ thể ở định dạng ISO-8601.
node --env-file=.env --import tsx scripts/beta.ts prepare --sample vn-4 --cohort free-beta-1 --expires '<ISO hạn đọc>' --delete-after '<ISO ngày dọn>'

# Hoặc bản từ đơn đã được chủ dữ liệu đồng ý sử dụng cho đợt thử:
node --env-file=.env --import tsx scripts/beta.ts prepare --order '<ORDER_UUID>' --source-consent --cohort free-beta-1 --expires '<ISO hạn đọc>' --delete-after '<ISO ngày dọn>'
```

Xem bản đã chốt tại `/internal/beta` sau đăng nhập nội bộ. `prepare` trả UUID edition, không công khai bản đọc. Bản thiếu dữ kiện hoặc chỉ thuật ngữ có cảnh báo trước nút bắt đầu; chủ dự án quyết định có đưa bản đó vào thử hay không.

Chỉ sau quyết định phát hành:

```sh
node --env-file=.env --import tsx scripts/beta.ts release --id '<BETA_REPORT_UUID>' --confirm-release
# Chủ dự án đặt BETA_ENABLED=true cho tiến trình được chọn và restart.
# APP_ORIGIN phải đúng origin HTTPS phát hành. Chưa cấu hình thì beta vẫn tắt.
mkdir -p .local/beta
chmod 700 .local/beta
node --env-file=.env --import tsx scripts/beta.ts grant --id '<BETA_REPORT_UUID>' --out .local/beta/invite-01.json
```

CLI chỉ in UUID quyền và mã giả danh. Liên kết nằm trong file 0600, tạo mới độc quyền (không ghi đè); không đưa file vào git/log/tài liệu. Chủ dự án tự chuyển riêng liên kết nếu đã quyết định mời; phần mềm không gửi. Sau khi thực sự mời, ghi nhận thủ công:

```sh
node --env-file=.env --import tsx scripts/beta.ts invited --id '<GRANT_UUID>'
```

Mở lại bài: cùng trình duyệt vào `/beta` dùng phiên còn hạn. Link đã dùng không mở lại trên trình duyệt khác. Nếu cần cấp lại, thao tác sau vô hiệu hóa phiên cũ và lưu link một lần mới vào file riêng:

```sh
node --env-file=.env --import tsx scripts/beta.ts reissue --id '<GRANT_UUID>' --out .local/beta/reissue-01.json
node --env-file=.env --import tsx scripts/beta.ts revoke --id '<GRANT_UUID>'
node --env-file=.env --import tsx scripts/beta.ts withdraw --id '<BETA_REPORT_UUID>'
```

Tắt toàn bộ: đặt `BETA_ENABLED=false`/bỏ biến và restart mọi instance. Routes beta không cung cấp draft khi tắt, nhưng dữ liệu chưa bị xóa. Thu hồi grant/edition chặn cả token chưa dùng và phiên đang có. Đóng phiên từ UI xóa quyền session hiện tại; muốn trở lại phải được cấp link mới.

```sh
# Xóa riêng người thử và phản hồi; edition chia sẻ vẫn còn
node --env-file=.env --import tsx scripts/beta.ts delete-participant --id '<GRANT_UUID>'
# Xóa edition, snapshot beta, mọi quyền và feedback liên quan (không xóa báo cáo mua hàng gốc)
node --env-file=.env --import tsx scripts/beta.ts delete --id '<BETA_REPORT_UUID>'
# Dọn edition đến ngày đã chọn — cần chủ dự án đặt lịch chạy thực tế
node --env-file=.env --import tsx scripts/beta.ts purge
```

Nếu dữ liệu cá nhân nằm trong edition riêng, yêu cầu xóa người thử phải xét cả edition và bản nguồn/backup theo chính sách; không coi delete-participant là đã xóa mọi dữ liệu sinh. File lời mời cục bộ cũng cần xóa sau dùng/hết hạn. Không kéo dài quyền bằng sửa snapshot.

## Kịch bản thử 20–30 phút

Chọn 5–10 người có mức quen Tử vi khác nhau: chưa từng xem, đôi lần đọc, đã quen thuật ngữ. Không chỉ chọn người đã thích sản phẩm. Không gắn tỷ lệ đại diện thị trường cho nhóm này. Người phụ trách ghi mức quen theo mã giả danh trong ghi chú riêng được đồng ý; hệ thống không tự thu hồ sơ cá nhân.

Giới thiệu: “Đây là bản dự thảo miễn phí, phạm vi Tổng quan còn hẹp. Chúng tôi muốn biết cách trình bày có rõ và có căn cứ dễ hiểu không; không yêu cầu bạn xác nhận Tử vi dự đoán đúng.” Nếu dùng lá số mẫu, nói rõ không phải thông tin của người đọc.

Nhiệm vụ:

1. Mở link riêng, đọc phạm vi/dữ liệu, tự quyết định bắt đầu hoặc dừng.
2. Đọc Tổng quan, nói lại một ý bằng lời của mình. Người quan sát không giải thích hộ ngay.
3. Tìm “Xem căn cứ” cho một đoạn; hỏi người đọc hiểu nguồn và giới hạn thế nào.
4. Dùng nút đánh dấu đoạn, chọn nhãn, gửi phản hồi.
5. Chọn “Toàn báo cáo” để phản hồi mức hiểu, phần hữu ích/khó hiểu/lo lắng/còn thiếu.
6. Tải lại hoặc mở `/beta` cùng trình duyệt; kiểm người đọc có biết quay lại không.

Ghi nhận mắc ở đâu bằng mã giả danh, bước, hành động quan sát, câu nói nguyên văn (nếu được đồng ý), mức cản trở và phiên bản. Không mặc định dừng đọc là không thích sản phẩm; hỏi lý do. Không yêu cầu chia sẻ màn hình chứa token hoặc thông tin người khác. Không ghi hình/âm thanh nếu chưa có sự đồng ý riêng.

## Tổng hợp và quyết định vòng tiếp theo

`/internal/beta` chỉ dành cho khóa nội bộ: bản được chọn, quyền chuẩn bị, lời mời ghi nhận thủ công, bắt đầu, hoàn thành, lượt nhãn theo đoạn và phản hồi nguyên văn kèm phiên bản. Demo tách nhãn. Không có người thật thì ghi chưa có, không tự tạo số. Mỗi quyền nên cấp cho đúng một người trong cohort; số quyền không tự chứng minh số người độc lập, chủ dự án phải đối chiếu danh sách mời riêng. Các lượt lặp cùng người không phải người độc lập. Bảng chỉ hiện tối đa 500 phản hồi mới nhất và ghi rõ phạm vi đếm.

Ưu tiên đọc từng phản hồi, gom theo **đoạn + phiên bản + vấn đề**, giữ ý kiến khác chiều. Danh sách sửa ghi: mã đoạn, quan sát/câu nói, ảnh hưởng, loại việc, người xử lý, tiêu chí kiểm lại. Không đổi feedback cũ khi sửa nội dung.

- Sửa ngay: lộ bài người khác, link/thu hồi không đúng, mất hoặc gắn nhầm phản hồi; tạm dừng đợt thử đến khi khắc phục. Câu khiến người đọc hiểu thành dự đoán chắc chắn/tai họa cần rà ngay, không đợi đủ số lượng.
- Biên tập: thuật ngữ khó hiểu, câu dài/chung chung, giới hạn không tìm thấy. Sửa khi có bằng chứng cụ thể; kiểm lại với chính đoạn mới, không nâng rule lên approved.
- Nghiên cứu lại rule: căn cứ không hỗ trợ câu diễn đạt, điều kiện không đầy đủ, mâu thuẫn nguồn. Rút đoạn/giữ mô tả dữ kiện trong bản mới; cần người phụ trách phương pháp quyết định.
- Để sau: thêm chủ đề, AI, chấm điểm, hỏi ý định mua, tự động hóa nghiên cứu hoặc dashboard. Chưa cần để trả lời vấn đề hiện tại.

Đủ để tiếp tục vòng đọc khi các lỗi truy cập/lưu dữ liệu đã xử lý, người đọc có thể tự mở bài/tìm căn cứ/gửi phản hồi, và các vấn đề nội dung lặp lại có phạm vi sửa cụ thể. Nếu đa số chỉ thấy câu chung chung, thu hẹp giá trị thử nghiệm và nghiên cứu nội dung trước; không dùng cảm giác “đúng với tôi” hoặc 5–10 câu trả lời để kết luận khả năng dự đoán, nhu cầu thị trường hay tỷ lệ mua.

## Lời mời dự thảo — CHƯA GỬI

“Chào bạn, mình đang chuẩn bị một bản đọc thử Tổng quan Tử vi miễn phí và muốn nhờ bạn góp ý về cách trình bày. Nội dung còn là dự thảo, chưa phải báo cáo hoàn chỉnh hay kết luận chắc chắn về cuộc đời. Mình muốn biết đoạn nào rõ, khó hiểu, chung chung, thiếu căn cứ hoặc khiến bạn lo lắng — không hỏi lá số đúng đến mức nào.

Nếu bạn đồng ý, bạn sẽ đọc phạm vi trước khi bắt đầu, thử mở một căn cứ và gửi vài phản hồi, khoảng 20–30 phút. [Nêu rõ đây là lá số mẫu hoặc dữ liệu bạn đã đồng ý cung cấp.] Bạn không cần tên thật và có thể dừng. Hạn truy cập: [ngày]; dự kiến lưu/xóa: [chính sách đã chốt]; liên hệ rút/xóa: [người phụ trách]. Đây là liên kết riêng của bạn: [chèn link riêng sau quyết định phát hành]. Không có khoản thanh toán.”
