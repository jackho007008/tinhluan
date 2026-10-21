# Hợp nhất Gmail/recovery vào QA chính3062 — 18/10/2026

## Phạm vi và checkout

QA chính trước: `.local/encyclopedia-close-20261018/qa`, server90953; worker63228 tại `.local/sepay-test-20261016/qa`. Bản đối chiếu Gmail: `.local/gmail-recovery-20261018/qa`, server94421/worker94426, database riêng. Không sao chép dữ liệu3070.

Checkout hợp nhất: `.local/qa-main-email-20261018/qa`, lấy QA chính làm nền. Đưa đúng21file recovery/Gmail từ3070 vào; giữ7file Toàn thư mới hơn của QA chính (admin,publicpage,style,ArticleBody,Editor,model,related). Dependency bổ sung nodemailer10.1.2/@types/nodemailer8.0.2 cùng lockfile hiện hành; không nâng thư viện khác.263file còn lại trong app/components/lib/scripts/db/public giữ byte-identical. Workspace gốc đã chứa cùng các thay đổi hợp lệ; không cần ghi đè code gốc. Manifest: checkout-diff.json,merge-manifest.json,code-preservation.json.

## Dữ liệu và sao lưu

Database chính `tuvi_stability_1791958936289`; kho báo cáo vẫn `.local/customer-ui-approved-20261015/qa/.local/{internal-readings,trial-readings}`. Bản backup tại `.local/qa-main-email-20261018/private-backup/`, thư mục0700, dump0600, không đưa lên Git hoặc link công khai. Dump custom PostgreSQL đã kiểm đọc danh mục bằng pg_restore --list (121dòng); chưa chạy diễn tập restore toàn bộ. Sao lưu cả23bảng và kho internal31file/trial32file (bao gồm session/index; không coi63file là63báo cáo).

Dừng đúng worker63228/server90953 trước backup. Áp **chỉ migration007** trong transaction sau backup thành công. Kiểm sau migration: dữ liệu23bảng cũ giữ nguyên theo các cột cũ;63file cũ không đổi hash. Migration thêm recovery_bindings và liên kết vào access_tokens/email_deliveries, không nhập dữ liệu thử3070.

## Runtime chung

HTTPS: https://61ac-171-246-109-226.ngrok-free.app

Server/worker dùng cùng hàm env trong `runtime.mjs`: database/kho chính, APP_ORIGIN=RECOVERY_ORIGIN=HTTPS3062; PDF render nội bộ qua127.0.0.1:3062. Gmail đọc từ.env.gmail-qa nhưng override origin3070 bằng HTTPS chính; không sửa file Gmail của3070. Providergmail-smtp,bắt buộc allowlist1địa chỉ,STARTTLS587; Live=false,Beta=false; giữ cấu hình SePayTest/mock của QA chính. Không in secret/token/cookie. Queue trước chuyển không có email chờ; reportjobs5done. Không gửi thư cũ ngoài ý muốn.

Server99456/worker99458 cùng checkout mới; worker cũ dừng. Worker3070 vẫn chạy database riêng làm đối chiếu, không cùng queue với3062. Runtime từ chối start nếu PID/port đã có, worker từ chối khi PIDworker chính cũ còn sống.

Lệnh từ root (không chép secret vào command):

```sh
node --env-file=.env --env-file=.env.gmail-qa .local/qa-main-email-20261018/runtime.mjs start
node --env-file=.env --env-file=.env.gmail-qa .local/qa-main-email-20261018/runtime.mjs worker
```

## Quay lại khi lỗi

1. `node .local/qa-main-email-20261018/rollback.mjs` kiểm cwd rồi dừng đúng server/worker mới; không chạm3070.
2. Sau port3062 được giải phóng: `node --env-file=.env .local/encyclopedia-close-20261018/runtime.mjs start`. Không nạp.env.gmail-qa. Giữ schema007 additive; code cũ không sử dụng cột mới. **Tạm giữ worker tắt** để worker cũ không lấy nhầm job recovery. Điều tra rồi mới nối lại worker phù hợp; không tự đánh dấu job thành công.
3. Không restore dump đè database đang có dữ liệu mới. Nếu cần phục hồi dữ liệu, restore dump vào database tách biệt, đối chiếu và chuyển đích trong cửa sổ bảo trì có kiểm soát. Kho file backup cũng phục hồi sang thư mục riêng trước; không đè báo cáo phát sinh sau backup. Có thể rollback ứng dụng mà vẫn giữ dữ liệu khôi phục mới để điều tra.

## Kiểm tra đã thực hiện

- Typecheck1lượt đạt. Productionbuild1lượt đạt; không chạy gate nội dung/PDF.
- Test liên quan8file:47đạt/1lỗi (48test). Test admin `paginates stable orders without overlap, filters actual statuses and environment, searches literally`: expected7,actual12 vì5đơn từ test core cùng database. Không phải lỗi phân trang sản phẩm, không sửa assertion. Chạy lại riêng admin với database mới:5/5đạt. Không gọi48test xanh trong cùng một lượt.
- Các file: reading-recovery,gmail-smtp,core-orders,encyclopedia,encyclopedia-renderer,admin-operations,public-trial,public-trial-pdf. SMTP trong test mocked, không tính là thư thực nhận.
- Sau deploy localhost/HTTPS: lap-la-so/recover200,Toàn thư34bài,APIadmin403 khi khôngcookie. Kết quả thật tạo→email→khôi phục→PDF cập nhật sau khi hoàn tất; chưa dùng QA3070 thay nghiệm thu bản hợp nhất.

## Trạng thái nghiệm thu thực

Đã tạo **Hợp nhất QA Gmail**, ID `03769744-87b8-4823-b5e2-0fd66d828bba`, bằng form công khai trên HTTPS chính. Chủ hộp thư xác nhận mở thư thật; Chrome khác IAB mở đúng bản. Máy chủ ghi email verified lúc 07:19:44Z. Yêu cầu gửi lại qua trang recover đã gửi thư thứ hai; Gmail hiển thị thư 14:21, máy chủ ghi hai magic token đã dùng và hai session, cùng hạn gốc **23/10/2026 02:35:26Z**. Không gia hạn quyền, vẫn một artifact với SHA-256 `ea9d0910138e92de16b062c6f32f88ea819e3207c1d67fa7fcc90a2f8b46edb9`.

PDF tải qua Chrome từ phiên khôi phục: 8 trang, đúng tên/ngày sinh, bản trình bày1.47.0, đủ13/13đoạn của customerReport frozen, không ký tự thay thế. Đã render/xem cả8trang, không quan sát cắt chữ/trang trắng. Không chạy lại catalog. Hộp thoại Save của macOS vô hiệu khi agent thao tác; chủ dự án lưu giúp đúng file, sau đó sao chép sang tên rõ `qa-main-recovered.pdf` (không xuất lại). Đây là vướng thao tác lưu native, không có lỗi PDF máy chủ được quan sát.

Giao diện trực tiếp hiển thị từ chối liên kết dùng lại; DB vẫn2session. Lượt đầu Chrome trả vùng nội dung xám/trống khi điều hướng nên không tính là đạt. Sau khi chủ dự án đưa tab ra trước, kiểm lại ngày18/10 lúc14:35: cùng phiên Chrome mở được “Hợp nhất QA Gmail”; đổi ID sang `13556c5a-4d99-47b5-9271-6c6d6745e34c` hiển thị **“Không mở được bản đọc — Báo cáo không thuộc phiên trình duyệt này hoặc đã hết hạn”**. Đã lưu ảnh `chrome-cross-reading.png`. Khép phần kiểm đọc chéo trực tiếp còn thiếu; không sửa code, không chạy lại build/test. Quyền PDF chéo có test tích hợp đạt và API không cookie404; thử điều hướng API trực tiếp trong Chrome chưa có nội dung quan sát được, không dùng lần đó làm bằng chứng riêng.

DB sau kiểm vẫn đúng2session/1artifact/cùng hạn gốc/hash không đổi. Gói hợp nhất đạt phạm vi QA một địa chỉ nhận thử; không đồng nghĩa mở email cho mọi khách.

Bảo toàn sau nghiệm thu: toàn bộ63file cũ nguyên hash; thêm đúng1file báo cáo thử mới. Các bảng đơn/giao dịch/report/Toàn thư không đổi; các thay đổi access_tokens,email_deliveries,rate_limits là dữ liệu nghiệm thu mới. Access token cũ so theo cột cũ giữ nguyên. 34 bài công khai vẫn nguyên nội dung; QA3070 không đổi.

## Phần còn thiếu trước beta rộng hơn

- HTTPS/domain vận hành ổn định thay tunnel tạm; backup hiện đã kiểm danh mục, cần diễn tập phục hồi riêng trước vận hành rộng.
- Gmail vẫn chỉ gửi một địa chỉ thử: chưa nghiệm thu nhiều nhà cung cấp hộp thư, quota/chính sách gửi diện rộng và vận hành lỗi thư. Không tự bỏ allowlist.
- Không coi hợp nhất email là duyệt chuyên môn hoặc cho phép thu phí. Checkout/giá/hạn quyền/chính sách và SePay Live cần quyết định/nghiệm thu riêng; giữ trạng thái bằng chứng SePay đối soát trong kế hoạch, không kiểm lại trong gói này.
- Admin hiện chỉ xem/tra cứu; phân vai và thao tác vận hành ngoài phạm vi vẫn chưa làm. Giới hạn nội dung Mệnh–Thân giữ nguyên.



### Bổ sung vận hành18/10/2026 — diễn tập phục hồi đã thực hiện

Trạng thái “chưa diễn tập restore” ở thời điểm hợp nhất phía trên được cập nhật bởi [gói chuẩn bị beta](BETA-DEPLOYMENT.md). Đã chụp lại dữ liệu main hiện hành24bảng/65file, phục hồi vào DB/kho riêng và web3072, mở đúng một bản lưu, xuất PDF/đối chiếu21đoạn, kiểm34bài công khai và quyền admin. QA3062/3070 và dữ liệu gốc giữ nguyên; diễn tập3072 đã dừng. Đây là backup mới phục vụ diễn tập, không thay bằng chứng backup trước migration007. Chưa triển khai host/domain ổn định.
