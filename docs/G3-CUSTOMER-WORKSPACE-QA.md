# G3 — Không gian khách hàng và trải nghiệm đọc trên QA

Ngày nghiệm thu: 19/10/2026. Phạm vi G3, kế thừa G1a/G2; chưa mở G4, Zalo hoặc Live.

- [Lá số của tôi](https://61ac-171-246-109-226.ngrok-free.app/la-so-cua-toi)
- [Lập lá số](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so)
- QA chính: 3062, checkout `.local/g3-20261019/qa-final`, khởi động bằng `runtime-final.mjs` trong cùng thư mục G3. Web và một worker dùng cùng database/kho chính. QA3070 không được chuyển hoặc dừng.
- Giữ trình bày nội dung đã lưu 1.47.0, catalog interpretation-1.45.0 và policy menh-free-1.0.0. G3 là thay đổi giao diện/quản lý tài khoản, không dựng lại hay tăng phiên bản nội dung lịch sử. Không có migration.

## Đã hoàn thành

**Thư viện tài khoản:** tìm theo tên hoặc mã, có/không dấu (cả Đ/đ), 8 mục/trang, ngày tạo và hạn quyền. Ba mục Lá số của tôi / Báo cáo đã mua / Đơn hàng dùng dữ liệu máy chủ. Đơn test được ghi riêng, không tính thành báo cáo đã mua. Không có dữ liệu thì hiện trống; chưa có nút mua hoặc giá bán.

**Tạo và sửa:** API tạo liên kết riêng bản vừa lưu với tài khoản đang đăng nhập sau khi chứng minh phiên sở hữu. Retry dùng lại bản cũ và không cập nhật hạn/quyền. Trường hợp liên kết lỗi, API báo lỗi để thử lại cùng ID; không tạo một hệ lưu khác. “Sửa thông tin” sử dụng cùng resolver quyền đọc, hỗ trợ tài khoản/khôi phục đã xác minh; chỉ truyền đầu vào được phép tới form, tạo bản mới khi gửi, không ghi đè bản gốc.

**Bài đọc:** đầu bài gọn, lá số thu mặc định, Mệnh mở trước; điều hướng cố định tới Mệnh, 12 cung, lá số, tùy chọn và tài khoản. Mỗi cung mở/thu độc lập, có trạng thái miễn phí / đã mở / khóa / chưa có luận giải. Tài–Điền giữ nguyên nhóm chung, chỉ dẫn chiếu từ cung còn lại. Không tạo ra phép luận liên cung mới.

**Căn cứ và vị trí:** căn cứ đóng mặc định, nút đóng ở cuối đưa tiêu điểm và vị trí về đoạn đọc. Lưu trạng thái mở và vị trí theo edition trên thiết bị; điểm neo cấu trúc cũng đi qua `returnTo` đã kiểm soát khi sang tài khoản/Google callback. Không đưa thông tin sinh hoặc token vào URL. Nếu bộ nhớ trình duyệt bị xóa, không hứa giữ được vị trí trên thiết bị khác; điểm neo trong URL vẫn dùng được.

**Quyền:** giữ nguyên projection G2 ở máy chủ, 5 rule Mệnh–Thân giữ riêng, expiry/revocation và các endpoint PDF. Giao diện chỉ nhận phần đã được cấp quyền; không dùng CSS làm paywall. Toàn bộ lời văn, điều chỉnh và ngoại lệ lấy nguyên văn từ bản lưu. Mở/thu không tạo quyền.

## Nghiệm thu thực chạy

### Kiểm tự động và HTTP

- Lượt đầu: **43/43**, 7 file: customer-workspace, reading-scope, public-trial, public-trial-pdf, customer-accounts, reading-recovery, stored-customer-pdf.
- Sau sửa nhãn hồ sơ không tên: **11/11**, customer-workspace + reading-scope.
- Test form lần đầu: **4 đạt, 1 lỗi**. Test cũ mock trực tiếp kho trial và dùng `report-id`; trang sửa nay gọi resolver quyền dùng chung. Đã thay đúng ranh giới mock, dùng UUID hợp lệ; giữ nguyên assertion không gửi prefill cho người không có quyền. Chạy lại **5/5**; thêm ca điểm neo an toàn qua returnTo rồi đạt **6/6**.
- Hồi quy tài khoản/OAuth sau thay returnTo: **10/10**. Không thay expected lịch sử.
- Lượt cuối sửa Đ/đ: **5/5** customer-workspace, gồm tìm không dấu tên bắt đầu bằng Đ, phân trang, tài khoản độc lập, tạo/retry/sửa và expiry.
- Typecheck đạt trên mã cuối. Các production build đều đạt; build cuối `build-search.log`. Có cảnh báo nhiều lockfile do checkout QA đặt trong repository, không có lỗi build. Không chạy gate nội dung/toàn bộ E2E hoặc xuất lại PDF.
- HTTP production trên database riêng: khách và tài khoản miễn phí nhận đúng projection; không có lời khóa trong HTML/RSC; print/PDF toàn bài bị chặn. Bản có quyền/legacy nhận nguyên văn bản lưu, mỗi đoạn đúng một lần; 12 vùng cung. Tài khoản khác bị 404 ở đọc/PDF. Danh sách tài khoản không lộ ID bản bên kia. Không tạo PDF mới trong gói.
- Bộ kiểm HTTP ban đầu báo `0 !== 5` vì chỉ đếm `data-customer-text=""`, trong khi React xuất `="true"`. Đã sửa cách đọc thuộc tính; không đổi số đoạn expected hay phép so nguyên văn. Lượt chạy lại và bản final đạt.

### Thao tác trình duyệt

Dùng production build và database fixture riêng trên loopback; hai danh tính tổng hợp A/B, **không gọi đây là lần Google Login thật mới**. G1a đã có nghiệm thu Google thật; G3 không đổi provider hoặc đổi quyền theo email.

- A nhập mẫu 12/04/1995 giờ Ngọ, tạo bản → tự thấy trong tài khoản → mở lại → sửa tên/ngày sang 13/04 → nhận ID mới. Bản gốc còn nguyên. Tìm “ban sua” trả đúng bản sửa.
- A có 11 bản fixture để kiểm hai trang không trùng/thiếu; B phiên sạch có danh sách trống. B không mở được bản A. B tạo mẫu 22/09/2000 giờ Mão, nhận bản riêng; A không thấy hoặc đọc được bản B.
- Kiểm mục “Báo cáo đã mua” trống và đơn mock đã giao từ database thật của môi trường test, có nhãn thử nghiệm. Không đưa dữ liệu mẫu này vào QA chính.
- Kiểm 360/390px: thư viện, tìm kiếm, phân trang, Mệnh, mục lục 12 cung, khóa/chưa có lời, căn cứ, thu/mở lá số. Chiều rộng tài liệu bằng viewport, không tràn ngang. Desktop 1280px: danh sách đơn, bản đầy đủ và dẫn chiếu Tài–Điền.
- Kiểm tải lại tại Quan Lộc: vẫn mở và vị trí đầu cung khoảng 80px dưới thanh điều hướng. Qua “Hồ sơ” rồi quay về cũng giữ cùng điểm. Đã sửa hai lỗi phát hiện: sự kiện mở cung phát trước listener khi mount; điểm neo không được mang qua trang tài khoản.
- Lỗi CSS mobile ban đầu ẩn link điều hướng do quy tắc cũ `nav > a {display:none}`; đã giới hạn override vào các menu G3, kiểm lại các nút hiện và hoạt động. Bản không có tên dùng “Hồ sơ bản mệnh”, không bị báo nhầm mất quyền.
- Sau chuyển QA3062 thật: mở lại bản G2 đã lưu, Mệnh/căn cứ bàn phím Enter hoạt động; 12 mục, Nô Bộc giữ dữ kiện Tỵ–Thiên Lương và ghi chưa có lời. Không thử gửi email/khôi phục hoặc Google OAuth thật lại trong G3.

## Ảnh và bằng chứng

- [Đầu bài QA3062 — 390px](../.local/g3-20261019/qa3062-reading-390.png)
- [Mục lục QA3062 — 360px](../.local/g3-20261019/qa3062-toc-360.png)
- [Mệnh và căn cứ QA3062 — 360px](../.local/g3-20261019/qa3062-menh-360.png)
- [Thư viện 390px — tài khoản fixture](../.local/g3-20261019/library-390.png)
- [Đơn hàng desktop — đơn fixture](../.local/g3-20261019/orders-desktop.png)
- Log kiểm trong `.local/g3-20261019/`: `tests-first.log`, `tests-final.log`, `form-tests*.log`, `form-anchor-tests.log`, `account-regression.log`, `search-tests.log`, `http-release.log`, `typecheck-search.log`, `build-search.log`, `smoke.json`, `preservation.json`, `release.json`.

## Bảo toàn và giới hạn

Backup trước sửa gồm 29 bảng, 31 tệp kho internal và 41 tệp kho trial (số này gồm dữ liệu phiên, không phải 41 lá số). Sau chuyển bản cuối, **mọi tệp có trước đều nguyên hash**; 54 tệp engine/catalog/lịch được bảo vệ không đổi. 28/29 bảng nguyên hash; bảng rate_limits thay đổi theo hoạt động QA. Có thêm hai tệp bản đọc trong thời gian QA được sử dụng, không phải ghi đè bản cũ; các ca tạo bằng trình duyệt của G3 chạy ở kho fixture riêng. Hai user Google, hai identity và 12 liên kết gốc giữ nguyên. Policy/projection G2 và bộ xuất PDF không đổi. Toàn thư công khai vẫn đúng 34 bài, không đổi nội dung.

Thư viện chỉ trả metadata đã chứng minh thuộc tài khoản. Nếu quyền hết hạn/thu hồi và kho gốc không còn đọc được, hiện ngày liên kết/hạn cùng trạng thái không còn quyền; không bịa lại tên hoặc ngày lập. Khôi phục tên của bản đã hết hạn không được suy từ email. Danh sách hiện lọc/phân trang metadata phía máy chủ sau kiểm từng quyền; phù hợp lượng QA hiện có, chưa tuyên bố đã kiểm tải quy mô lớn.

Điểm dừng: khép G3 về chức năng trên QA. Còn chủ dự án duyệt trải nghiệm; G1b Zalo chờ xét duyệt; G4 checkout/giá/hạn gói/Live chưa triển khai. **Hoàn thiện nội dung 12 cung vẫn là hạng mục riêng bắt buộc trước mở bán**, không được thay bằng việc có đủ 12 mục giao diện. Các nhóm Mệnh–Thân G2 chưa phân scope tiếp tục giữ riêng. Không cấp quyền mới cho báo cáo cũ, không triển khai máy chủ.

Thời gian thực tế: khoảng 27 phút, từ 10:03 đến 10:30 ngày 19/10/2026 (Asia/Ho_Chi_Minh).
