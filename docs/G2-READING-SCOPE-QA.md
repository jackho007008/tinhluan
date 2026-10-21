# G2 — Quyền đọc theo cung trên QA

Bắt đầu 18/10/2026 18:23 (Asia/Ho_Chi_Minh). G1b Zalo tạm hoãn chờ xét duyệt.

## Hợp đồng đã chốt trước kiểm thử

- Mỗi bản mới từ API lập lá số lưu `accessPolicy.version=menh-free-1.0.0` và danh sách nhóm miễn phí. Không sửa bản đã lưu; không có trường này nghĩa là bản legacy, giữ toàn quyền và hạn cũ. Chính sách không phụ thuộc ngày đăng nhập hoặc cờ bật/tắt giao diện.
- Không thay phiên bản trình bày 1.47.0/catalog 1.45.0: không sửa văn bản, evaluator hoặc điều kiện rule. Đây là phiên bản chính sách truy cập riêng.
- Quyền sở hữu vẫn qua phiên lập lá số, recovery hoặc tài khoản Google đã chứng minh quyền. ID không phải quyền. Đơn đã trả/giao và access token gốc còn hạn, chưa thu hồi mới mở toàn bản. Dùng lại `order_reading_bindings`, worker, `reports`, `access_tokens`, `customer_reading_links`; không có endpoint công khai tự cấp quyền.
- Hạn phiên Google chỉ xác thực đăng nhập. Hạn quyền của bản/đơn giữ riêng từ hồ sơ quyền gốc; đăng nhập lại không INSERT/UPDATE quyền đầy đủ hoặc thay hạn. Chưa quyết định giá/hạn gói mới. G4 phải dùng bản đóng băng và quyền đơn này, không chạy lại catalog.

## Phân nhóm miễn phí

Nguồn phân loại là `frozen.continuousReport.palaces[name=Mệnh].groups`, claim IDs và relations đã lưu, không phải tiêu đề hay nội dung câu. Giữ toàn bộ paragraph, members, original, trace, điều chỉnh và ngoại lệ. Nhóm R02/M05 và Liêm–Tướng không bị tách.

Các rule `tanbien.life-body-*`, `npl.life-body-*` nói về vị trí/quan hệ Thân với cung khác: lưu nguyên nhóm trong `heldGroups` với lý do `body-palace-cross-scope`, chưa phân vào miễn phí. Quan hệ chứa claim ngoài phạm vi phải giữ lại cả nhóm liên thông (`incomplete-or-cross-scope-relation`). Không tự viết lại/cắt lời. Dữ kiện vị trí Mệnh/Thân vẫn hiển thị; quyết định mở nhóm này miễn phí là việc phạm vi sản phẩm còn cần chốt, không phải thiếu rule.

Bản gửi khách miễn phí chỉ chứa các sections Mệnh và paragraph được phép; không có paid originals, unplaced claims, gap evidence của cung khóa. Dữ kiện lá số 12 cung vẫn được xem. Trạng thái khóa/không có lời dựa vào nhóm nghĩa đã lưu từng cung. Không coi trả phí tạo ra nội dung còn thiếu.

## Các cửa kiểm quyền

`customerReadingAccess` là cửa chung cho `/ban-doc`, JSON đọc và PDF. Trang print cũng đòi full scope. Căn cứ được render từ chính projection đã lọc; không có endpoint căn cứ riêng vượt quyền. Đường đơn giữ kiểm paid/worker/grant và hash của bản đóng băng. Đường nội bộ giữ khóa hiện hành.

## Bảo toàn và rollback

Backup riêng `.local/g2-20261018/private-backup`: 29 bảng, 31 file nội bộ, 38 file kho trial (gồm session và report, không phải 38 lá số). Có manifest SHA-256. 54 file engine/catalog/calendar được ghi hash. Không cần migration/schema mới. Rollback mã phải giữ bộ kiểm chính sách G2; không chạy mã cũ không biết policy trên kho có bản G2, vì sẽ cấp thừa quyền. Nếu rollout lỗi, dừng public reading trước, giữ DB/kho, triển khai lại bản G2 đã sửa; QA cũ chỉ được mở với backup cô lập, không ghi đè kho chính.

Kết quả kiểm thử/triển khai sẽ ghi sau khi thực chạy. Quyền full dùng nghiệm thu chỉ trên database kiểm thử riêng qua đơn mock, không cấp cho khách QA chính. Toàn bộ 12 cung và phê duyệt chuyên môn vẫn là hạng mục bắt buộc riêng trước mở bán.

## Kết quả thực chạy

1. `node --env-file=.env --env-file=.env.gmail-qa --env-file=.env.google-qa .local/g2-20261018/run.mjs test`: **39/39, 6 file, không fail/skip**, 18:31:17; 7,54 giây. Các file: reading-scope, public-trial, public-trial-pdf, customer-accounts, reading-recovery, stored-customer-pdf. Không đổi expected lịch sử. Hai mock DB cũ bổ sung `pool.query` trả danh sách đơn rỗng để test lớp tra quyền mới; assertion cũ giữ nguyên.
2. Typecheck hai lượt (sau triển khai và sau thêm test): đều đạt. Production build một lượt: đạt; cảnh báo workspace có nhiều package-lock, không phải lỗi build. Không chạy gate nội dung/toàn bộ E2E.
3. `.local/g2-20261018/http-check.mjs`: production thật trên port3074/database cô lập, Google **identity fixture** (không nhận là OAuth thật). Guest và account miễn phí: JSON đúng projection; HTML + RSC không chứa bất kỳ đoạn khóa của bản lưu; `mode=basic/detail` không vượt quyền; print không render bản toàn bài; PDF403. Account khác đọc/PDF404; căn cứ nội bộ401. Account có đơn mock đã giao nhận đúng toàn bộ bản, PDF200, hạn gốc. Không có endpoint tự cấp quyền. Port3074 đã dừng sau kiểm.
4. Đơn fixture dùng số tiền1.000đ để đi qua cơ chế mock có sẵn, không phải giá gói. Worker retry không sinh report/grant trùng; hết hạn/thu hồi chuyển về chỉ Mệnh, PDF403. Đăng nhập lại hoặc link lại không hồi sinh full grant. Hết phiên Google cần đăng nhập lại; hạn quyền gốc không đổi.
5. PDF fixture:9 trang, tên đúng,22/22 đoạn và3/3 ghi chú khớp bản lưu sau trích xuất. Renderer tự so toàn bộ paragraph DOM với bản lưu trước khi xuất. Đã xem contact sheet đủ9trang: không trang trắng bất thường/cắt nội dung; không thay renderer PDF. Không xuất lại bộ PDF.
6. 9 mẫu engine có sẵn:46 nhóm miễn phí;21 nhóm giữ riêng thuộc5 rule Mệnh–Thân (`npl.life-body-career`, `npl.life-body-wealth`, `tanbien.life-body-role`, `tanbien.life-body-same-trine`, `tanbien.life-body-other-trine`). Mỗi paragraph được phép bằng nguyên đối tượng đã lưu: text, members, nguồn, quan hệ và ngoại lệ. Đây là kiểm phạm vi quyền, không phải kiểm lại chuyên môn hoặc tuyên bố mọi lá số đều đủ nội dung.
7. QA3062 production: đã tự nhập hồ sơ minh họa qua form, tạo bản mới `750f65a9-5101-4d2e-8000-895993d06a16`, reload đúng7 đoạn Mệnh. Tại360px:scrollWidth360;390px:scrollWidth390;12 trạng thái và căn cứ hoạt động, không có PDF toàn bài khi thiếu quyền. Ảnh `mobile-390.png`, `menh-360.png`, `menh-evidence-360.png`.
8. Bản thực thi `.local/g2-20261018/qa`; web và một worker cùng runtime/config/database/kho QA chính. Không Git commit có sẵn trong checkout; mã đối chiếu bằng SHA/changed-files. Không chép dữ liệu fixture vào QA chính. Không thay Google/Gmail/SePay credentials. QA3070 giữ nguyên.

### Bằng chứng bảo toàn

`preservation.json`:31/31 file nội bộ,38/38 file trial cũ nguyên hash; chỉ thêm1 bản mới.54/54 file engine/catalog/calendar nguyên hash.29 bảng chỉ `rate_limits` đổi do kiểm API; mọi bảng quyền/account/orders/reports/email/Toàn thư nguyên hash.2 users Google/12 liên kết nguyên trạng. Bản backup bao gồm cả mọi bản đang có trước G2, không chỉ11 bản A.

### File thay đổi

- `lib/trial/reading-policy.ts`, `lib/trial/reading-access.ts`: policy đóng băng, projection, tái sử dụng grant đơn.
- `lib/internal-review/reading-store.ts`: trường policy tùy chọn, tương thích lịch sử.
- `lib/order-readings.ts`: thêm metadata policy/scope vào đơn thử **mới**, không đổi cơ chế thanh toán/giao/hạn.
- `app/api/trial/readings/route.ts`, `[id]/route.ts`, `[id]/report-pdf/route.ts`, `app/ban-doc/page.tsx`: lưu policy, kiểm quyền và projection.
- `components/ReferenceCustomerReading.tsx`, `app/customer-experience.css`: trạng thái12cung và lời Mệnh; không CSS-hide dữ liệu khóa.
- `tests/reading-scope.test.ts`, hai mockDB trong public-trial/public-trial-pdf; tài liệu này và kế hoạch V1.

### Giới hạn và điểm dừng

- 5 rule Mệnh–Thân nêu trên giữ riêng chờ quyết định **phạm vi miễn phí của nhóm liên cung**, không phải lỗi rule hay thiếu toàn bộ nguồn. Toàn văn vẫn nằm nguyên bản và có trong quyền full.
- G4 chưa làm: checkout/account-bound order, giá/hạn quyền thương mại, SePayLive. Cơ chế hiện hành đã kiểm với đơn mock+worker, không phải đã mở bán.
- Không chạy OAuth thật lại trong G2; tái sử dụng nghiệm thu2 tài khoản Google G1a, kiểm scope và hai tài khoản kỹ thuật ở production tách riêng. Không cấp full grant thử cho hai tài khoản thật của chủ dự án.
- Hoàn thiện nội dung12cung và duyệt chuyên môn vẫn là việc riêng bắt buộc trước mở bán; paywall không giải quyết thiếu lời.

URL tự nhập: https://61ac-171-246-109-226.ngrok-free.app/lap-la-so . Bản mới chỉ mở trong phiên sở hữu hoặc tài khoản đã liên kết. URL không thay quyền.

Thời gian:18:23–18:40 ngày18/10/2026, khoảng17phút. Không có lượt test/build lỗi cần chạy lại. Hai lượt typecheck là trước và sau bổ sung test; production build chỉ1lượt. Dừng tại G2.
