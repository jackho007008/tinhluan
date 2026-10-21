# G5 — Admin vận hành QA

Ngày 19/10/2026. QA chính 3062, bản chạy `.local/g5-20261019/qa-final`; một web và một worker cùng cấu hình/database/kho gốc. QA3070 không đổi. Nội dung 1.47.0, catalog interpretation-1.45.0, policy menh-free-1.0.0 giữ nguyên.

## Đường vào và danh tính

[Admin QA](https://61ac-171-246-109-226.ngrok-free.app/internal/admin) · [Toàn thư](https://61ac-171-246-109-226.ngrok-free.app/toan-thu) · [Luồng miễn phí](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so).

Chủ dự án chỉ định **chỉ tài khoản Google A**. Vai trò đã được cấp cho ID `626f24d8-4707-4ce3-b90a-5532f5ddf221`, xác định từ liên kết sở hữu đã nghiệm thu; không suy theo tên/email. B vẫn là khách. Vào admin bằng phiên Google A; khi chưa đăng nhập, nút Google dẫn trở lại admin. Đăng xuất dùng cơ chế phiên hiện có.

Trang và API admin/CMS đều kiểm phiên tài khoản còn hạn và vai trò chưa thu hồi tại máy chủ. Khóa nội bộ chung không còn đủ quyền admin; các công cụ `/internal` khác vẫn giữ cổng cũ. Không có API/nút khách tự cấp vai trò. Các phiên/quyền đọc báo cáo cũ không bị đổi.

Chỉ định/thu hồi quản trị sau này: operator máy chủ chạy `scripts/admin-role.ts grant|revoke USER_UUID` với đúng cấu hình database QA. Phải xác minh UUID người đã đăng nhập trước; không lấy email làm khóa. CLI ghi actor `server-operator`, không giả danh người đăng nhập. Đây là thao tác máy chủ, không phải chức năng cấp/thu hồi quyền đọc trong admin.

## Phần hoạt động

- Điều hướng chung kem–đỏ trầm: tổng quan, người dùng, báo cáo, đơn, giao dịch, quyền, email/PDF, nhật ký, CMS.
- Khoảng ngày theo Việt Nam, ngày cuối bao gồm trọn ngày. Số người dùng mới và bản lưu theo ngày tạo; đơn theo ngày tạo; tiền theo ngày ghi sổ giao dịch. Trạng thái đơn có thể chồng lấp, không cộng thành tổng đơn.
- Tiền lấy từ `payment_transactions`, không từ số lần webhook. Test/Live tách riêng; số liệu thử không gọi doanh thu thật. Metric có đường đối chiếu danh sách tương ứng.
- Người dùng tìm tên/email/ID, phân trang, xem bản và đơn có quan hệ sở hữu. Đơn của hồ sơ người dùng là danh sách toàn thời gian; bộ lọc bên dưới áp dụng bản đọc/quyền, có nhãn rõ.
- Báo cáo tìm tên/ID, lọc nguồn, xem đúng bản lưu. Tổng quan đếm ID duy nhất; danh sách vẫn phân biệt bản miễn phí và binding đơn. Không dựng lại catalog.
- Đơn có thanh toán, worker, quyền/hạn, báo cáo đã giao, giao dịch và alias API/webhook. Danh sách giao dịch có lọc kết quả không khớp/chấp nhận và sổ khoản đã thanh toán riêng.
- Quyền tài khoản hiển thị phạm vi, hạn gốc, trạng thái thu hồi/hết hạn/không còn hiệu lực; kiểm thêm hợp đồng quyền đang dùng. Quyền phiên chưa liên kết tài khoản xem tại đơn, không bịa người sở hữu từ email.
- Sổ `operations_events` lưu mã an toàn cho PDF, email, report worker và lượt webhook đã xác thực từ G5. Không ghi message/stack, token, cookie, bank narrative hoặc secret. PDF/email lỗi thử riêng đã được ghi bền vững. Không có sự kiện không đồng nghĩa thành công. EMAIL_SENT chỉ xác nhận provider chấp nhận, không chứng minh tới Inbox.
- CMS giữ chức năng hiện có. Tạo/lưu/xuất bản/ẩn ghi actor tài khoản, hành động, đối tượng, revision trong cùng transaction. Không ghi nội dung bài/ghi chú nhạy cảm. 34 bài công khai không bị sửa.
- Không thêm nút paid, hoàn tiền, retry, cấp/thu hồi quyền đọc. SePay Live vẫn tắt; Gmail vẫn giới hạn địa chỉ thử.

## Bằng chứng dữ liệu thật và bảo toàn

Đối chiếu SQL chỉ đọc trên QA chính lúc 13:35–13:39:

- 2 tài khoản; 1 vai trò admin đang hiệu lực, đúng A.
- 7 đơn Test: 6 paid/ready, 1 pending/waiting. 6 khoản chấp nhận, tổng **6.000đ Test**. Không có khoản Live.
- CORE64D308A2F679 gắn đúng reading `513211fa-72dd-4c0f-b5e8-86ca63611bc3`, report `a7883694-c95e-4a3e-827a-89fa43fe974c`; 1 payment, 1 quyền customer-order. #39519 sai 2.000đ vẫn mismatch, #39520 đúng 1.000đ accepted.
- 34 bài visible, 2 bài ngoài bộ vẫn không công khai. Không xuất bản thêm.
- Snapshot trước migration010: 30 bảng; **31 tệp kho internal, 45 tệp kho trial** (số tệp gồm metadata theo manifest, không gọi là 76 lá số). Không tệp gốc nào đổi/mất/thêm; toàn bộ dòng cũ của 30 bảng cùng hash tại lần kiểm cuối. 54 tệp engine/catalog/lịch cùng hash.
- Backup database SHA-256: `1d7c3decc280c0a7332fcfdd9c6ed7520aa4183a948893a2742fea0326f77132`. Bản dump và kho ở `.local/g5-20261019/private-backup/`, không phát hành.
- Evidence: [số liệu thật](../.local/g5-20261019/real-evidence.json), [manifest đối chiếu](../.local/g5-20261019/preservation.json), [file ứng dụng thay đổi](../.local/g5-20261019/changes.json).

QA HTTP không đăng nhập: `/api/internal-admin` và `/api/internal-encyclopedia` trả 403; `/toan-thu`, `/lap-la-so` trả 200. Trình duyệt chưa có role chỉ thấy cổng đăng nhập, không có dữ liệu admin. Các ca A/B có role/không role, thu hồi role và CMS được kiểm trong database fixture riêng; không giả lập Google thật trên QA chính. Chủ dự án đã xác nhận mở tab A; trực tiếp quan sát Chrome thấy A vào danh sách 2 người dùng, đúng nhãn admin, rồi tổng quan 63 ID bản lưu/7 đơn/6.000đ Test khớp máy chủ. Khi chuyển tiếp sang chi tiết, Chrome trả màn xám/ngắt điều khiển; không tính URL đổi là đã đọc trang chi tiết thật. Truy đơn–bản–quyền có đối chiếu SQL và integration fixture, không giả thành toàn bộ thao tác Chrome đã đạt.

## Các lượt kiểm đã chạy

1. Tám file liên quan trên tám database test riêng: **53 đạt / 1 lỗi**. Lỗi `admin-g5 > CMS write and actor audit commit together`: fixture save chỉ 19 ký tự trong khi schema đòi tối thiểu 20; mong đợi save thành công, thực tế Zod từ chối. Sửa body fixture đủ điều kiện; giữ assertion audit/rollback/bảo mật, không sửa schema hoặc expected lịch sử.
2. Chạy lại `admin-g5`, `admin-operations`: **10/10 đạt**.
3. Kiểm UI phát hiện bộ lọc giao dịch cũ hiển thị lựa chọn nhưng truy vấn chưa lọc disposition. Sửa đúng truy vấn và lựa chọn phù hợp giao dịch; thêm assertion mismatch/accepted. Chạy lại riêng hai file: **10/10 đạt**.
4. `sepay-test`, `sepay-reconcile`: **32/32 đạt**, kiểm bằng payload ký fixture cục bộ, không gọi SePay thật. Bao gồm route webhook nhận lặp, kiểm tiền, đối soát và retry worker không tạo lại báo cáo.
5. Typecheck/build bản đầu đạt. Sau sửa bộ lọc, **typecheck/build bản cuối đều đạt**. Không có skip ở các file đã chạy. Kết quả cuối còn hiệu lực cho **86 test khác nhau/10 file**, qua các lượt trên; không gọi là một lượt gate 86 test. Không chạy toàn gate nội dung hoặc bộ PDF.

Các file: admin-operations, admin-g5, encyclopedia, encyclopedia-renderer, reading-recovery, stored-customer-pdf, test-checkout, customer-accounts, sepay-test, sepay-reconcile.

Lệnh runner (tự tạo database riêng/migration; không in secret):

```sh
node --env-file=.env .local/g5-20261019/run.mjs test
node --env-file=.env .local/g5-20261019/rerun.mjs test
node --env-file=.env .local/g5-20261019/test-payments.mjs test
node --env-file=.env --env-file=.env.gmail-qa --env-file=.env.google-qa --env-file=.env.checkout-qa .local/g5-20261019/runtime-final.mjs typecheck
node --env-file=.env --env-file=.env.gmail-qa --env-file=.env.google-qa --env-file=.env.checkout-qa .local/g5-20261019/runtime-final.mjs build
```

Log cùng thư mục: tests-first/rerun/filter/webhook, typecheck-filter, build-filter. Build có cảnh báo nhiều lockfile do checkout QA, không phải lỗi biên dịch. Script bằng chứng lần đầu dùng nhầm tên cột CMS `status`, PostgreSQL từ chối SELECT; đổi sang `visible` và chạy lại, không sửa dữ liệu. Lần chạy fixture thiếu quyền socket sandbox bị EPERM; chạy lại với quyền loopback được duyệt. Đây không phải lỗi sản phẩm.

UI fixture production build: desktop1365, mobile360/390; tìm kiếm người dùng, phân trang 5+1 không trùng, trạng thái trống, lọc mismatch/accepted, từ lỗi sang đơn, khách không role bị chặn. DOM scrollWidth bằng viewport360/390. Lỗi email/PDF là fixture riêng, không thêm lỗi giả vào QA chính. Công cụ chọn label có một timeout; đọc lại DOM và dùng combobox có tên, thao tác thành công, không sửa/chờ né lỗi ứng dụng.

[Desktop QA thật](../.local/g5-20261019/admin-desktop-qa-real.png) · [Desktop fixture](../.local/g5-20261019/admin-desktop-fixture.png) · [Người dùng390](../.local/g5-20261019/users-mobile390-fixture.png) · [Lỗi360](../.local/g5-20261019/events-mobile360-fixture.png) · [Đơn360](../.local/g5-20261019/order-mobile360-fixture.png) · [Giao dịch360 bản cuối](../.local/g5-20261019/transactions-mobile360-fixture.png).

## Triển khai và quay lại

Migration010 chỉ thêm bảng/index và mốc quan sát. Sao lưu trước migration; không chép fixture vào QA. Web/worker G4 đã dừng trước khi khởi động G5; QA3070 không bị chạm. Runtime-final cùng cấu hình phía máy chủ, Gmail test-only và SePay Live=false.

Nếu cần quay lại: dừng đúng hai PID trong `.local/g5-20261019/{start,worker}.pid` sau khi xác minh cwd, chạy lại G4 `runtime-final.mjs` với cùng bộ env/kho/database. Không cần xóa bảng010 hoặc restore database để rollback code. **G4 còn dùng khóa admin chung**, vì vậy rollback làm trở lại mô hình quyền cũ; cần chủ dự án cân nhắc/đóng cổng admin trong thời gian xử lý. Không tự chạy rollback và không ghi đè dữ liệu mới bằng dump.

## Điểm dừng và phần còn lại

G5 đã triển khai trên QA chính, các kiểm tra kỹ thuật/phần hiển thị trong phạm vi trên đạt. Đã quan sát giao diện danh sách người dùng và tổng quan thật bằng Google A. Giới hạn quan sát Chrome ở bước chi tiết được ghi riêng ở trên. G4 vẫn chờ xác nhận thao tác bấm quay lại Huynh Đệ, không tự khép bằng việc thấy URL hash.

Không bịa/backfill lịch sử email/PDF hay số lượt webhook trước G5. Báo cáo số lượng là dữ liệu còn trong kho, chưa phải thống kê lịch sử đã bị dọn. Quy trình hỗ trợ, thời hạn lưu/xóa nhật ký và giám sát máy chủ thuộc chuẩn bị phát hành, chưa thêm vào gói này. Cổng nội dung12cung, Zalo chờ duyệt, giá/hạn thương mại và Live vẫn chưa hoàn tất. Không mở G6.

**Thời gian thực tế:** khoảng 30 phút làm việc G5 (xấp xỉ13:15–13:45,19/10), gồm triển khai/kiểm/cutover và phối hợp mở tab. Không tính gói G4 buổi sáng. Không mở rộng sang G6.
