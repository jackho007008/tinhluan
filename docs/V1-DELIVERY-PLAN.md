# Đặc tả và kế hoạch bàn giao Tinh Luận V1

**Bàn giao giữa các thread (20/10/2026):** bắt đầu tại [HANDOFF.md](HANDOFF.md), đọc [CURRENT_STATUS.md](CURRENT_STATUS.md) và [BUSINESS_RULES.md](BUSINESS_RULES.md). Backlog ND01–ND19 trong file này vẫn là danh sách công việc duy nhất. Hai mẫu Tật Ách có **toàn văn, điều kiện, phần chưa xét và nguồn** trong BUSINESS_RULES; không coi việc chủ dự án đồng ý hướng thẩm định là duyệt mẫu hoặc cho phép publish.

> **Bản điều hành hiện hành — 20/10/2026, sau G5, ND01, ND04/Thiên Di và lô khách hàng ND03/Mệnh–ND04/Tử Nữ;  kết quả và phần còn chặn tại V1-4.** Các mục V1-0 đến V1-9 dưới đây thay thế phạm vi/lịch cũ. Nhật ký trước đó được giữ ở cuối để truy vết, không phải yêu cầu triển khai song song. **Cập nhật sau G1a/G2/G3/G4 Test/G5: triển khai máy chủ và G1b Zalo vẫn tạm hoãn; Google, quyền G2, không gian khách hàng G3 và checkout G4 Test đã chạy QA theo ủy quyền riêng.** Không bật thu phí/Live hoặc thay quyền cũ. Các quyết định thương mại và nội dung ở V1-8 vẫn cần chốt.

## V1-0. Kết luận và baseline thực tế

V1 hướng tới: **lập lá số → đọc miễn phí cung Mệnh → đăng nhập Google/Zalo → lưu vào tài khoản → mua một báo cáo mở các cung còn lại và PDF toàn bài → mở lại ở thiết bị khác; admin theo dõi toàn bộ quá trình.** Toàn thư tiếp tục công khai. Không mang mô hình tín dụng, điểm số, vận hạn, “15 chương”, “100 mục”, AI hay Hợp hôn vào V1 chỉ vì trang tham khảo có.

**Hai điều chưa thể coi đã hoàn thành:** (1) toàn bộ tài khoản/checkout thương mại (Google và scope G2 đã có; checkout Test đã có; Zalo, giá/hạn thương mại và Live còn chờ); (2) nội dung đủ lời hứa 12 cung cho mọi cấu trúc đầu vào hiện được engine hỗ trợ. Đặc biệt Tật Ách hiện chỉ có dữ kiện, không có luận sức khỏe; không được bán lời hứa “đủ luận 12 cung” bằng cách đếm tiêu đề. Quyết định phạm vi này phải chốt trước mở bán, không ngăn việc thiết kế tài khoản/quyền độc lập.

Baseline hiện hành được đối chiếu trong gói tài liệu21/10: **trình bày1.59.0 / catalog interpretation-1.56.0**, code `bb230d5`, HEAD đầu phiên `bfcdb2b` trên `main`, sạch. Checkout QA3062 `.local/quan-tai-20261021/qa-final`;8 file receipt trùng root/checkout, PID81341/81345 có cwd đúng. Không nghiệm thu lại HTTP/DB/tunnel trong phiên tài liệu. Các mốc1.55–1.58 bên dưới là lịch sử. [Bảng quyết định cuối gói tài liệu](#bảng-quyết-định-cuối-gói-tài-liệu--21102026) tổng hợp điểm chặn/đề xuất; [CURRENT_STATUS](CURRENT_STATUS.md) giữ trạng thái ngắn. G2/lịch sử/QA3070 giữ nguyên, Beta tiếp tục, Live tắt; chưa publish Tật.

Trạng thái hiện có:

- Tạo bản thật và lưu cố định. **Bản mới theo G2:** miễn phí nhóm Mệnh; cung có lời còn lại và PDF toàn bài đòi quyền đầy đủ. **Bản cũ:** giữ cơ bản ba nhóm/chi tiết/PDF theo quyền và hạn gốc. Chưa mở bán; G4 chỉ cho hai tài khoản QA A/B tạo đơn SePay Test, điều khoản kiểm thử 1.000đ/72 giờ có phiên bản máy chủ.
- Quyền phiên miễn phí có hạn 7 ngày; email xác minh/khôi phục không kéo dài hạn, không phục hồi quyền đã thu hồi. Gmail chỉ được phép gửi tới địa chỉ thử đã cấu hình.
- Đơn thử gắn bản đã lưu, worker giao bản đó; SePay **Test Mode** có webhook, API đối soát, chống trùng hai nguồn. Không phải checkout bán thật hoặc SePay Live đã nghiệm thu.
- Admin xem/tra cứu báo cáo, đơn, giao dịch và trạng thái worker; Toàn thư có CMS phiên bản. **34 bài đã được chủ dự án duyệt nội dung và xuất bản trên QA3062**, gồm 8 nền, 12 cung, 14 chính tinh; không phải phê duyệt chuyên môn báo cáo. Bài bổ trợ/fixture không thuộc 34 bài.
- Google Login đã nghiệm thu G1a; quyền theo policy bản mới đã tích hợp G2. G3 đã bổ sung tìm kiếm/phân trang, tự liên kết khi tạo, thư viện/đơn hàng, 12 cung mở–thu và giữ điểm đọc trên QA ngày 19/10; G4 đã nối checkout Test cho A/B, chưa có checkout thương mại. Zalo tạm hoãn chờ xét duyệt. G5 đã dùng phiên Google và vai trò admin tại máy chủ, chỉ tài khoản A được chỉ định; khóa nội bộ chung không còn đủ quyền admin/CMS. Thao tác CMS có actor/revision, không ghi nội dung nhạy cảm.
- Gói Ubuntu/backup/restore đã chuẩn bị và diễn tập riêng theo [BETA-DEPLOYMENT.md](BETA-DEPLOYMENT.md); **triển khai máy chủ nay tạm hoãn**, không đánh dấu đã chạy trên Ubuntu sản xuất.

Lượt khảo sát gốc không chạy test/build. Các đợt triển khai G1a/G2 sau đó có kiểm thực chạy riêng, ghi tại V1-6; không dùng bằng chứng cũ làm kết quả mới.

## V1-1. Bằng chứng khảo sát và điều chưa xác minh

### Phương pháp ghi nhận

- **T — thao tác/đọc trực tiếp:** trình duyệt Chrome có phiên tuvi.work do chủ dự án đăng nhập; chỉ điều hướng/xem. Không đăng xuất, sửa hồ sơ, lưu lá số, dùng tín dụng, mua gói hay gửi thanh toán.
- **A — ảnh tham khảo:** ảnh chủ dự án cung cấp trong `/Users/taiho/Desktop/chuptuvi/`. Đây là ảnh mobile có nhãn iPhone 16, không phải bằng chứng đã thao tác trên điện thoại trong lượt này. [Danh mục ảnh và hash](../.local/v1-scope-20261018/reference-images.json); hash chỉ định danh ảnh, không xác minh nội dung tử vi.
- **H — hồ sơ trước:** khảo sát desktop 1280×900/mobile 360/390 của ngày 15/10 được tái sử dụng và ghi riêng. Không coi là lần kiểm mới.
- **C — code/hồ sơ Tinh Luận:** kiểm kê tĩnh và đọc bản QA thật; không chứng nhận lại toàn hệ thống.

Chrome có lúc chỉ trả khung xám và không có cây nội dung sau điều hướng. Sau khi chủ dự án đưa tab ra trước, đã đọc được trang tài khoản. Các lần chuyển tiếp lịch sử/gói luận vẫn chỉ xác nhận URL/tiêu đề. **Đây là giới hạn quan sát của lượt khảo sát, không kết luận website lỗi hoặc tài khoản bị chặn.** Không kéo dài bằng cách thử URL đoán hoặc truy cập ngoài quyền.

| Phần tham khảo | Bằng chứng thực có | Đã đọc được / điều học được | Chưa xác minh |
|---|---|---|---|
| Tài khoản — [tuvi.work/tai-khoan](https://tuvi.work/tai-khoan) | T, phiên đăng nhập | Tên tài khoản, số dư tín dụng; một lá số đã lưu với đường Địa bàn/Luận giải; mục lá số bản mệnh chưa đặt; mục nội dung mở khóa đang trống; các đường Lịch sử, Gói Luận, Thiên Thư. Không sao chép email cá nhân vào hồ sơ nghiên cứu | Chưa thao tác đăng nhập mới Google/Zalo; chưa có báo cáo đã mua để kiểm quyền người mua. Không đổi các lựa chọn nhận thư |
| Lịch sử — [tuvi.work/lich-su](https://tuvi.work/lich-su) | T: bấm liên kết, URL/tiêu đề đúng; phần thân không đọc được | Xác nhận có đường truy cập từ tài khoản | Danh sách đơn/giao dịch, trạng thái, phân trang và đơn chi tiết: **chưa xác minh** |
| Tổng quan bản luận | T đọc trang; A ảnh ref-4 | Hồ sơ, đường xem lá số, tab theo nội dung, dữ kiện Mệnh/Cục/Thân và lời theo sao. Có biểu đồ và các lời quảng bá | Không kiểm tính đúng phương pháp, không kế thừa phần trăm, trọng số hoặc cách cục. Không dùng tổng quan này làm nguồn luận |
| 12 cung, mở/thu | A ref-0/ref-1 | Mệnh mở; các cung có tiêu đề, địa chi, chính tinh/trạng thái. Ảnh ref-1 cho thấy mở cung khóa vẫn có mô tả ngắn và lời bị cắt, CTA tại chỗ | Thử tab trong Chrome chỉ xác nhận URL hash, chưa xác nhận nội dung chuyển; chưa kiểm tương tác mở/thu thành công trong phiên hiện tại |
| Cung khóa → mở khóa | A ref-1-2 | Ảnh quảng bá mở trọn 12 cung của **một lá số**, gồm luận/cơ hội/thách thức; hiển thị **5 tín dụng ≈15.000đ**. Đây là quyền lợi/giá trên ảnh, không phải quyền đã mua, giá hiện hành đã xác minh hay giá Tinh Luận | Không chứng minh gói này gồm PDF; không đồng nhất với gói bài dài |
| Gói luận → thanh toán | T mở liên kết [the-luan](https://tuvi.work/the-luan) từ tài khoản; thân trang không đọc được | Xác nhận có trang chọn gói riêng | **Chưa xác minh** lựa chọn gói, QR, số tiền checkout, thời hạn/quyền hoặc việc quay lại cung sau thanh toán. Chưa đi hết luồng cung khóa → thanh toán; không tạo giao dịch |
| Bài dài / PDF tuvi.work | T thấy liên kết/preview quảng bá; H từng tới màn đăng nhập | Có sản phẩm bài dài riêng quảng bá 15 chương và PDF, mức149.000đ hiển thị trên banner trong lần đọc này | **Chỉ quảng cáo/preview.** Không có quyền mua trong mục nội dung mở khóa; chưa đọc toàn bài, mục lục, tải PDF hoặc xác minh chất lượng PDF. Không suy gói này cùng quyền với mở12 cung |
| Mobile tuvi.work | A ref-0…4 + H khảo sát cũ | Thẻ cung, tab ngang, điểm nhấn đỏ/vàng trên nền kem; nội dung có nhiều quảng bá/khối xác nhận trước phần đọc; nút nổi có thể che mép chữ trong ảnh | Lần này chưa đo viewport thực, chưa kiểm giữ vị trí/Back/Reload trên thiết bị. Không coi ảnh dài là kiểm mobile tương tác |
| Tuvihomnay | A ref-5, xem toàn bộ5 lát của ảnh gốc | Có lá số, vùng giới thiệu/mời mở khóa, phần mở đầu văn liên tục, tiêu đề rõ, từ khóa nhấn màu. Ảnh cho thấy chuyển đoạn theo chủ đề nhưng đoạn khá dài | Chỉ phần ảnh được cung cấp; chưa đọc phần trả phí100 mục, chưa thao tác mục lục/PDF. Không lấy các liên hệ nhân quả, lời khuyên, vận hạn hoặc kết luận trong ảnh làm phương pháp Tinh Luận |

**Cách tổ chức nên học:** từ lá số sang bài đọc rõ; 12 cung có địa chỉ dễ tìm; khối khóa nằm đúng nơi khách muốn đọc; tài khoản gom tài sản đã lưu/đã mua. **Điều chỉnh cho Tinh Luận:** nội dung Mệnh xuất hiện sớm, không đặt nhiều banner trước bài; mục lục gọn; nguồn đóng; giữ vị trí đọc. Bài dài viết theo ý đã có quan hệ được đặc tả, không mượn cách nối văn của đối thủ để tạo kết luận mới.

## V1-2. Hành trình, trang và quyền sản phẩm

Thuật ngữ trong đặc tả: **scope** là phạm vi nội dung được cấp; **grant** là quyền truy cập; **edition** là bản nội dung cố định; **projection** là phần dữ liệu máy chủ được phép trả về. **TT** trong ma trận nguồn viết tắt Tuần/Triệt; **VCD** là vô chính diệu.

Các đường mới dưới đây là đặc tả, chưa phải route đã triển khai. Giữ các route hiện có hoặc chuyển hướng tương thích; không xây bộ dựng báo cáo thứ hai.

```text
/ → /lap-la-so → /ban-doc?id=…
                    ├─ Lá số / dữ kiện12 cung / Tứ Hóa bản mệnh
                    ├─ Luận Mệnh miễn phí + căn cứ của phần được đọc
                    └─ Cung bị khóa → Phạm vi gói của đúng bản → Đăng nhập
                          → Đơn/QR SePay → Chờ xác nhận → Mở đúng cung đang đọc
                          → Toàn bài đã lưu + PDF
/dang-nhap → Google hoặc Zalo Login → quay lại đúng tác vụ
/tai-khoan → Lá số của tôi | Báo cáo đã mua | Đơn hàng | Email khôi phục
/recover  → giữ cơ chế link một lần đã có
/toan-thu → tìm/lọc → bài công khai
/internal/admin → Tổng quan | Người dùng | Báo cáo | Đơn/Giao dịch
                  | Quyền đọc | Lỗi email/PDF | Toàn thư | Nhật ký
```

### Chính sách mới, áp dụng tương lai

1. Khách chưa đăng nhập vẫn nhập dữ liệu và đọc **đầy đủ phần Mệnh trong phạm vi đã hỗ trợ**, gồm các đoạn thuộc Mệnh đang nằm ở nhóm Mệnh–Thân/khuynh hướng/học hỏi/ngũ hành; không chỉ lấy một section hoặc ba đoạn thuận. Giữ nguyên lời nền–điều chỉnh–ngoại lệ trong đơn vị đọc. Dữ kiện Thân ở đâu được xem miễn phí; không vì thế tự cấp toàn bộ lời Quan/Tài của cung an Thân.
2. Một sản phẩm trả phí gắn **một snapshot + một edition báo cáo đã lưu + scope + giá/hạn quyền có phiên bản**; mở11 cung còn lại và PDF toàn bài theo phạm vi đã công bố/đạt cổng nội dung. Chưa chốt giá hoặc hạn ở task này. Không bán tín dụng, không chia thêm gói từng cung trong V1.
3. Đăng nhập khi khách muốn giữ trong “Lá số của tôi” hoặc mua; sau callback trở lại đúng báo cáo/cung. Sửa đầu vào tạo lá số/bản mới, không ghi đè bản đã mua. Không tự chuyển quyền mua sang lá số mới hoặc chạy catalog mới khi mở lại.
4. **Máy chủ quyết định nội dung trả về:** kiểm chủ sở hữu, grant, scope, trạng thái thanh toán/giao, hết hạn/thu hồi cho HTML, API, dữ liệu hydration, căn cứ, PDF và đường xuất/in. Không gửi toàn bộ lời trả phí xuống rồi ẩn bằng CSS. “Có dữ kiện trên lá số” không đồng nghĩa có quyền đọc lời cung đó.
5. Nhóm nhiều cung/điều chỉnh phải có scope rõ, giữ nguyên đơn vị nghĩa; không cắt nền khỏi điều chỉnh để tạo preview. Dùng bản đồ claim/relations đã lưu để phân quyền; **không chỉ dựa vào tiêu đề hoặc `section.palaces`** vì một đoạn liên cung có thể nằm dưới một tiêu đề. Nếu chưa phân được scope của nhóm, chưa cho chào bán bản đó; không bỏ im đoạn khỏi toàn bài.
6. Trước mua hiện mục nào có luận, phạm vi nào còn chưa phục vụ và chính sách PDF/hạn quyền. Không hứa mở khóa sẽ tạo ra phần luận đang không có. Đọc Mệnh ít nội dung vẫn nói đúng mức; không chèn văn mẫu.
7. PDF toàn bài chỉ cấp cho chủ sở hữu có scope thích hợp hoặc grant lịch sử đã cho phép. Dùng nguyên văn bản lưu; PDF phiếu lá số là chức năng riêng, không bị nhầm là PDF báo cáo.

### Quyền lịch sử và chuyển đổi

- Chốt mốc chính sách mới bằng `policyVersion`/thời điểm chuyển đổi ở máy chủ; lập manifest quyền hiện có trước migration. Không backfill bản cũ thành gói Mệnh-only.
- Báo cáo miễn phí đã được cấp cơ bản+chi tiết+PDF tiếp tục các quyền đó **đến hạn gốc**. Đơn/beta/grant cũ giữ đúng scope, edition, thời hạn và thu hồi; không kéo dài hoặc phục hồi quyền đã hết hạn/thu hồi.
- Liên kết báo cáo cũ vào tài khoản mới phải chứng minh quyền bằng phiên sở hữu hợp lệ hoặc luồng email đã xác minh; **email trùng, tên trùng hoặc biết ID không đủ**. Gắn Google/Zalo không tự nhận mọi đơn có cùng email.
- Một bản có nhiều grant chỉ mở theo grant còn hiệu lực tương ứng; hết phiên khách không vô tình thu hồi quyền mua hợp lệ, và đăng nhập không làm sống lại grant đã hết hạn. Cần quy định hạn gói mới riêng với TTL cookie/phiên; code CORE thử hiện đang buộc hạn vào phiên cũ, chưa phù hợp bán thật.
- Cookie ngrok không chuyển sang domain mới. Phải có phương án claim/recovery được nghiệm thu trước cutover; Gmail allowlist hiện không bảo đảm khôi phục cho mọi khách. Không hứa chuyển toàn bộ khách xuyên domain chỉ vì đã sao lưu báo cáo.

### Google và Zalo

- **Google Login:** xác minh token phía máy chủ, danh tính ổn định theo provider+`sub`; session ứng dụng tách quyền mua. Chỉ xin phạm vi nhận diện cần thiết. Không dùng email làm khóa chủ sở hữu. Căn cứ: [hướng dẫn chính thức Google](https://developers.google.com/identity/siwg/best-practices).
- **Zalo Login:** chức năng xác thực người dùng của Zalo Social; phải cấu hình ứng dụng, callback HTTPS và quyền nhận diện được duyệt. **Không đồng nghĩa Zalo OA**, theo dõi OA, gửi tin OA/ZNS hay quyền gửi thông báo. Không yêu cầu OA trong V1 chỉ để đăng nhập. [Zalo Developers](https://developers.zalo.me/) có mục Đăng nhập qua Zalo; trang tài liệu động chưa trả đủ chi tiết endpoint/quyền trong lượt này. Hợp đồng OAuth hiện hành, yêu cầu xét duyệt và thuộc tính được cấp phải xác minh ở task adapter; không tự hứa lấy được email/số điện thoại.
- Liên kết hai nhà cung cấp chỉ khi khách đã xác thực cả tài khoản hiện tại và danh tính mới; không tự gộp theo tên/email. Có đăng xuất, xử lý từ chối đăng nhập, mất phiên; không tạo mật khẩu riêng. Tài khoản khách đăng nhập thành công không tự thành admin.

## V1-3. A — Tính năng tham khảo → hiện trạng → việc cần làm → nghiệm thu

| Tính năng tham khảo/yêu cầu | Hiện trạng Tinh Luận đã đối chiếu | Việc hữu hạn còn lại | Đầu ra nghiệm thu V1 |
|---|---|---|---|
| Đăng nhập và hồ sơ | Phiên khách và recovery; chưa có OAuth/tài khoản khách | Bảng user/identities/sessions; Google/Zalo; hồ sơ tối thiểu và claim quyền cũ | Hai provider vào đúng tài khoản; không chiếm quyền bằng email/ID; callback lỗi không mất tác vụ |
| Lá số của tôi | Bản lưu theo phiên, đường mở gần nhất; chưa có thư viện theo user | Nối ownership, danh sách tên/ngày tạo/edition; tìm và mở/sửa tạo bản mới | Hai tài khoản không xem chéo; mở lại sau đăng nhập mới đúng bản; sửa không đổi bản cũ |
| Báo cáo đã mua / đơn | CORE Test lưu binding frozen; chưa có thư viện khách mua thật | Danh sách grant/report/order của user; trạng thái tách biệt | Đã trả tiền nhưng worker lỗi không bị hiển thị “đã giao”; trả về đúng artifact |
| Mệnh miễn phí /11 cung trả phí | Hiện cơ bản3 nhóm và full/PDF đều miễn phí | Policy mới, projection máy chủ, giữ legacy, scope nhóm liên cung | Chưa mua không nhận lời11 cung qua mọi đường; Mệnh giữ trọn ý; legacy nguyên quyền |
| Mở cung khóa và chọn gói | Chưa có checkout thật trên bản khách hàng | Một trang phạm vi đúng report; khóa ở mỗi mục; một sản phẩm | Hiện quyền, giá máy chủ, edition/hạn; không tạo đơn trùng khi bấm lại; không bán cấu trúc thiếu nội dung theo tiêu chí |
| QR và nhận báo cáo | SePay Test webhook+API/worker/chống trùng đã có | Nối checkout account-bound; adapter/cấu hình Live riêng chỉ sau cho phép | Test sai tiền/mã/tài khoản không cấp; API+webhook một thanh toán; giao đúng bản, retry không nhân grant |
| Bài dài,12 cung, căn cứ | Renderer/relations/customer prose/PDF dùng chung đã có | Mục lục12 cung + chủ đề; không lặp Tài–Điền; phạm vi nội dung từng bản | Không mất ngoại lệ; không có mục rỗng giả đầy đủ; câu truy được claim/nguồn |
| Mobile đọc sớm/quay lại | UI đã có, đầu trang hiện chart/tool/email khá dài | Mệnh xuất hiện sớm; lá số mở khi cần; TOC gọn và lưu vị trí theo report | 360/390 không tràn; đóng căn cứ về đúng đoạn; Back từ gói/login về đúng cung, reload đúng mục |
| PDF toàn bài | Đã xuất frozen, kiểm quyền phiên/recovery/order Test | Nối grant account+paid; giữ bản cũ; trạng thái/lỗi PDF bền vững | Cơ bản/chi tiết tải cùng edition full khi có quyền; không có quyền bị chặn; không lộ nguồn nội bộ/token |
| Email mở lại | Worker+Gmail test allowlist và token một lần đã có | Nối account/grant; vận hành gửi rộng cần cấu hình/nghiệm thu riêng | Không gia hạn/thu hồi ngược; SMTP accepted khác nhận thư; lỗi thư không mất báo cáo |
| Admin tổng quan | Chưa có dashboard tổng hợp | Thẻ số liệu tối thiểu theo khoảng ngày, Test/Live riêng | Đơn chờ/paid, báo cáo ready/error, lỗi thư/PDF có định nghĩa; webhook lặp không cộng doanh thu |
| Admin người dùng | Chưa có danh tính khách/admin riêng | Tra người dùng và tài sản/quyền; admin role ở máy chủ | Khách và user thường không vào trang/API admin; không lộ token/secret; thao tác có actor |
| Admin báo cáo/đơn/giao dịch | Có tìm/lọc/phân trang, binding, worker và SePay Test events/aliases | Nối user, scope, edition; sổ Live riêng khi mở; link hai chiều | Một giao dịch có nhiều alias vẫn là một khoản; Test không vào doanh thu Live |
| Admin quyền đọc | Hiện chi tiết đơn hiển thị grants; chưa có màn tra cứu tổng | Danh sách scope/expiry/revocation/provenance; chỉ đọc trong V1 cơ sở | Phân biệt chưa cấp/hết hạn/thu hồi/còn hiệu lực; không có nút tự paid/cấp quyền ngoài quy trình |
| Admin email/PDF lỗi | Email có deliveries; **chưa có sổ PDF bền vững theo đơn** | Sổ lỗi có mã, job/report/edition, thời gian và trạng thái; không lưu secret | “Chưa chạy/chưa ghi nhận” khác “thành công”; nhìn được retry lịch sử; UI retry tay để sau |
| Admin Toàn thư | CMS phiên bản,34 bài công khai đã có | Giữ và nối actor/audit; không viết thêm bài trong V1 này | Sửa nháp không đổi public; bài ẩn/nháp không lộ;34 bài đã duyệt giữ nguyên |
| Admin nhật ký thao tác | Có sổ nghiệp vụ thanh toán, chưa có audit admin thống nhất | Actor/action/target/time/result cho đăng nhập quản trị, publish/hide và thay đổi được cho phép | Không lưu token/dữ liệu cá nhân; tra được ai làm gì; không giả nhật ký quá khứ |
| Hạ tầng ổn định | Web/worker/PG/kho/Chromium, backup-restore đã có gói | Chờ bật lại task deploy; xác minh Ubuntu/domain/HTTPS/backup sau triển khai | Một host mới chạy được web+worker+PDF; phục hồi đúng bản; rollback không mất dữ liệu phát sinh |

**Nền tái sử dụng cụ thể:** `lib/order-readings.ts`, `lib/trial/recovery.ts`, `lib/trial/store.ts`, `lib/admin/operations.ts`, `lib/notifications.ts`, `db/001_init.sql`…`007_reading_recovery.sql`, `lib/internal-review/customer-report.ts`, các route `/api/trial/readings/[id]` và PDF. Code hiện trả `record.frozen.customerReport` đầy đủ cho chủ phiên; phải thay projection theo policy mới, không đổi nội dung frozen. Không xây queue, engine hay hệ dựng bài khác.

## V1-4. B — Backlog nội dung V1 duy nhất, chốt ngày 19/10/2026

**Ưu tiên sau G5: nội dung báo cáo; chưa mở G6, chưa triển khai máy chủ.** Bảng dưới thay ma trận “một phần” trước đây, không mở một danh mục nghiên cứu song song. Yêu cầu hoàn thiện luận 12 cung của chủ dự án **vẫn giữ nguyên**. Việc một nhánh bị chặn không tự chuyển chủ đề đó ra khỏi lời hứa V1, cũng không cho phép lấp bằng dữ kiện hoặc văn chung.

### Bằng chứng và mức đối chiếu của lượt chốt này

- Kiểm tĩnh phiên bản trong `customer-report.ts` và `catalog.ts`: **1.47.0 / interpretation-1.45.0**. Đọc lại kết quả có sẵn của [gói 1.47](../.local/natal-system-20261015/ban-giao.md), [ma trận chủ đề](../.local/natal-system-20261015/content-matrix.json), [đặc tả nguồn](../.local/natal-system-20261015/decision-spec.md), [audit NPL](../.local/npl-full-audit-20261014/audit.json), [kiểm kê Tân Biên](TANBIEN-READING-COVERAGE.md) và [bổ luận Mệnh–Thân](TANBIEN-MENH-THAN-SUPPLEMENT-AUDIT.md). Trạng thái “chưa triển khai” của audit NPL ngày14/10 không được bê sang baseline mới: P1, P2, M05/M07, âm dương tuổi–Mệnh, bảng Mệnh–Nô và các lời Tử Vi–Phúc đã có các phần triển khai sau audit.
- Đối chiếu [topic-counts.json](../.local/natal-system-20261015/topic-counts.json), [gaps.json](../.local/natal-system-20261015/gaps.json), [coverage.json](../.local/natal-system-20261015/coverage.json) và mã tạo các bằng chứng đó. Đây là **đầu ra lần chạy 1.47 đã lưu**, không phải kết quả chạy evaluator/test mới. Đọc cấu trúc, đoạn và căn cứ trong [cases.json](../.local/natal-system-20261015/cases.json): 27 bản/snapshot riêng, trong đó 9 mẫu nghiệm thu chính và18 bản bổ sung;15 snapshot trùng bộ192, không cộng thành219 lá số độc lập. Đọc lại toàn văn hai mẫu Kim Thoa/1992 và các cụm Mệnh, điều chỉnh, giới hạn của bảy mẫu còn lại; kiểm cấu trúc mục/đoạn của cả27. **Không tuyên bố đã đọc lại toàn văn192 bản trong lượt này.**
- Số hồ sơ có ít nhất một đoạn theo cung trong bộ192: **Mệnh192; Quan164; Tài171; Điền133; Phu112; Phụ122; Huynh127; Tử84; Nô102; Di155; Phúc149; Tật0**. Đây là sự hiện diện đoạn, không phải điểm đầy đủ chủ đề. Khoảng thiếu lần lượt còn28 Quan,21 Tài,59 Điền,80 Phu,70 Phụ,65 Huynh,108 Tử,90 Nô,37 Di,43 Phúc,192 Tật. Không cộng các cung thành số khách hàng.
- `gaps.json` còn ghi điều chỉnh chưa rõ ở Phụ35, Điền45, Nô42, Phúc8 lượt cung. Một cung có thể **vừa có lời vừa có khoảng chưa luận**: vì thế không cộng số này với số cung không có đoạn. Ví dụ Kim Thoa có lời Tuần/Triệt ở Nô nhưng vẫn thiếu phần nền bị chặn;1992 chưa có lời Nô/Tử, không phải lỗi đưa thiếu tên sao vào văn. Kim Thoa chưa có lời Phu; cả hai chỉ có dữ kiện Tật.
- Bằng chứng biên tập 1.47 ghi548 nhánh đủ điều kiện xuất đã có presenter, không còn đoạn chờ biên tập;19 nhánh vẫn chỉ có fixture trong bằng chứng này. Các con số ấy **không chứng minh độ phủ sách, đủ luận12 cung hay khả đạt mọi nhánh**. Backlog biên tập dưới đây là sửa mạch đọc/phạm vi của lời đã có, không tái mở việc “viết548 đoạn” đã xong.

**Phân loại:** A = mệnh đề/điều kiện đủ rõ, thiếu triển khai; B = lời đã có, thiếu tổ chức/biên tập hoặc quyết định phân nhóm; C = thiếu phương pháp/điều kiện hoặc có xung đột nguồn; D = ngoài phạm vi hiện hành, cần chủ dự án quyết định. P0 là quyết định ảnh hưởng lời hứa; P1 là việc có thể làm ngay; P2 là đối chiếu đúng câu đang chặn. Thứ tự không có nghĩa mục C/D được phép bỏ khỏi tiêu chí đầy đủ.

Tất cả số trang sau là **trang PDF** của đúng tệp đã định danh trong audit: TB = Tân Biên bản277 trang (SHA256 `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`); TH = Tử Vi Tổng Hợp NPL bản442; HS = Tử Vi Hàm Số NPL bản237; TL = Thiên Lương bản298. Không gán tiền tố ID `tanbien.*` thành tên nguồn khi claim thực tế dẫn TL/NPL.

### Danh sách hữu hạn — 19 việc, không mở thêm chủ đề

| Ưu tiên / mã / loại | Cung, câu hỏi và cấu trúc còn thiếu | Nguồn/đoạn đã kiểm; hiện trạng thực xuất | Việc cụ thể cần làm | Tiêu chí hoàn thành / điểm dừng |
|---|---|---|---|---|
| **P1 · ND01 · A — ĐÃ XONG QA19/10** | **Thiên Di:** ngoại cảnh và mưu sinh; Vũ tọa Thìn/Tuất/Sửu/Mùi | TB236§20.12 gạch cuối, ngữ cảnh235–236; audit bổ luận§11. Hiện `di-vu-alone` chỉ đơn thủ Thìn/Tuất (175§10.4), `di-vu-tham` theo175–176. Đã thêm mệnh đề236 trong1.48/1.46. Sáu snapshot192 khớp thật, cả sáu đã có lời Di;0 cung trống được lấp. Đặc tả và kết quả dưới đây. | Bổ sung đúng lời cục bộ Vũ tọa Thiên Di Tứ Mộ; nối nguyên nhóm với lời Vũ hiện có, không lặp vế buôn bán. Giữ trước khó/sau dễ, cạnh tranh và lời phụ tinh đang xuất. Không thêm điều kiện đơn thủ/độ sáng của câu khác. | Bảng quyết định bốn chi; ca sai cung/chi, thiếu chứng nhận; mẫu đã lưu ở cả bốn chi. Mọi lời mới truy236; không xóa lời175–176, không suy tài chính toàn thể hoặc nghề thực tế. Kết thúc bằng bản mới/đối chiếu cũ; không mở toàn§20. |
| **P0 · ND02 · B** | **Mệnh–Thân / Quan / Tài / Phúc / Di / Phu:** năm rule liên cung bị giữ riêng trong G2 | TL181 (180–182), HS40–41, TH191–192/224/241; [Mệnh–Thân1.38](MENH-THAN-1.38.0.md), [G2](G2-READING-SCOPE-QA.md). Chín mẫu có21 nhóm giữ riêng; lời vẫn tồn tại trong full. | Chốt phạm vi ba nhóm nghĩa bên dưới, lập ánh xạ nguyên paragraph–claims–relations–căn cứ; đề xuất chính sách phiên bản mới sau khi được duyệt. Không coi21 nhóm là21 rule hay thiếu nội dung. | Mỗi nhóm có nơi đọc miễn phí/chi tiết rõ; giữ điều chỉnh/giới hạn và quan hệ nguyên vẹn. **21/10: đề xuất giữ nguyên phân phối hiện tại, chờ chủ dự án chốt ND02; nội dung đã có trong full.** Xem bảng quyết định tổng hợp ngay dưới bảng ND. G2 hiện hành và mọi hạn/quyền cũ không đổi. |
| **P1 · ND03 · B — XONG DI, MỞ ĐẦU MỆNH VÀ CÔNG VIỆC/TÀI–ĐIỀN (1.54.0)** | **Mệnh, Quan, Tài–Điền và các chủ đề đã có lời:** văn còn nhiều giới hạn sát nhau, nguồn thu/giữ của/nhà đất dễ bị đọc như kết luận chung | Toàn văn Kim Thoa/1992 trong `cases.json`; TH241–242/257/261–265, TB191/195; [Tài–Điền1.37](FINANCE-ASSETS-1.37.0.md). Nền Quan Tử Vi–TT, Liêm–Tướng, R02/M05 và các giới hạn đã có, không thiếu presenter. | Biên tập theo nhóm nghĩa dùng chung: một lời dẫn ngắn, ý chính và điều chỉnh ở cạnh nhau; gom giới hạn trùng nhưng giữ vế đổi nghĩa tại đoạn. Dẫn từ12 cung tới đúng đoạn, không nhân đôi lời Quan vào tài chính như bằng chứng mới. | So từng câu với claim/quan hệ đã lưu; giữ cả hai khả năng Khoa–Kiếp, nét nóng Liêm–Tướng và các ngoại lệ. Không đổi evaluator, không tạo tổng kết ròng; bản lịch sử nguyên văn. Chỉ làm trong nhóm được gói triển khai chọn, không viết lại toàn catalog. |
| **P2 · ND04 · A/C — XONG DI, TẬP CON TỬ NỮ VÀ PHỤ/HUYNH; CÒN NGOẠI LỆ/CẤU TRÚC KHÁC** | **Vô chính diệu ngoài Mệnh:** thiếu lời ở Di32, Tài21, Phụ34, Huynh29, Tử26, Phu21, Nô17 lượt cung không khớp trong192; có thể còn phụ tinh đã nói riêng | TB33 và các kết luận VCD: Di180§10.36, Tử207§13.3.68; [Phúc–Di](PHUC-DI-1.0.0.md), [Phụ–Huynh](PHU-HUYNH-1.32.0.md), [Phu–Tử](PHU-TU-1.33.0.md), [Nô–Điền](NO-DIEN-1.31.0.md). Đã có hợp đồng hạn chế sáu cặp và câu nền Nhật–Nguyệt không phụ thuộc địa chi/trạng thái; 23/32 cung trống có lời, 9 còn chặn. Năm mẫu Nhật–Nguyệt vẫn chưa xử lý ngoại lệ tăng thêm (kết quả19/10 bên dưới). Chưa có hợp đồng mượn chung. | Chốt lần lượt **cung gốc/cung nhận, chi dùng cho trạng thái, sao nào được mượn, ngoại lệ tại mỗi nơi** từ đúng mục đã kiểm. Không dùng một định nghĩa “mượn” chung để chuyển cả catalog. Đã xử lý23/32 khoảng trống DiVCD; 9 DiVCD và5 Di có chính tinh còn thiếu lời. Nền mới không đồng nghĩa đã giải ngoại lệ Tuần/Kỵ. Lô tiếp ngày19/10 đã mở riêng Tử Nữ Cơ–Lương/Đồng–Cự từ đúng mục207/200:4 cung trống có lời,1 cung được bổ sung. Những cặp khác và9 Di chặn không mở lại. | **Khép lô1.56/Tử–Phu: phần đủ đặc tả đã triển khai; phần còn lại chờ người thẩm định, xem nhóm2 trong đặc tả Phu–Tử.** Chỉ sẵn sàng coding khi có bảng đủ bốn yếu tố và phản ví dụ. Nếu đoạn đã định vị vẫn không giải được, ghi chính xác ô chưa rõ; không tạo cung giả hoặc tái kiểm toàn sách. Không tính số trên là số khách độc lập.  **21/10: đã khép tập con Phụ/Huynh không phụ thuộc chi/trạng thái,33 nhánh; Phụ70→54 (16 mới/2 bổ sung), Huynh64→44 (20 mới/5 bổ sung). Lô1.56 thêm2cặp TửVCD Liêm–Phá/Tham từ câu không phụ thuộc chi; Liêm–Tham có4mẫu192, Liêm–Phá vẫn chỉfixture. Giữ18 nhánh Phụ/Huynh chưa có engine witness ngoài fixture. Chặn trạng thái/ngoại lệ và6 ca Phụ có TT ở một bên; không mở lại9 Di.**  **1.58: ĐiềnVCD chỉ câu nguồn gốc/tự gây dựng157§7.63 đã triển khai; không phải hợp đồng mượn chung hoặc đã giải TT/Nhật–Nguyệt.** |
| **P2 · ND05 · C** | **Mệnh/học hỏi:** Kỵ với Xương–Khúc–Khôi–Việt (M06); đặc biệt1992 có Kỵ/Khúc nhưng chưa có phép kết | TB33/118/120; HS55/168–169; [điều tra15/10](../.local/menh-than-evidence-20261015/research.json). Chưa chốt lượng từ bốn tên và phân bố vị trí. | Chỉ đối chiếu bằng chứng trực tiếp giải lượng từ/quan hệ của đúng câu; phân TB và HS. Không lấy “đủ bộ” TB229 ở cục khác làm đáp án. | Có điều kiện ALL/ANY/nhóm và quan hệ được nguồn chứng minh mới chuyển A; nếu không, giữ nghiên cứu. Không xuất “có tài nhưng công danh trắc trở” hoặc cho Kỵ xóa R02/M05. |
| **P2 · ND06 · C** | **Mệnh/Quan/Tài:** Phủ với Kình riêng, đủ Kình–Đà–Hỏa–Linh, TT/Không–Kiếp là ba vấn đề khác nhau | TB36/76; HS129; TH340–341; TB235§20.12 về kinh doanh là đoạn khác. Điều tra15/10 và audit bổ luận§11 đã tách các nhánh; P2 chỉ Liêm–Tướng có điều chỉnh, Khoa–Kiếp là lời tổ hợp. | Ghi đúng từng tập sao/quan hệ, phương diện và ngoại lệ; giải tập vị trí của “gặp/phối hợp”, không ép cả Kình–Đà đồng cung. Không chuyển cứu tai họa thành giữ tiền. | Một nhánh chỉ chuyển A khi đủ vị trí/lượng từ/kết quả trong phạm vi. Nội dung sức khỏe/sinh tử vẫn D; câu kinh doanh235 không giải hộ chế hung NPL. Không tự mở M06/Phủ trong ND01. |
| **P2 · ND07 · C** | **Mệnh0/1/2 chính tinh:** những chiều ngũ hành/ô lợi địa ngoài P1, hợp nhất ngũ hành với tính chất sao | TH108–110,134–135; HS68; [P1](../.local/npl-foundation-20261014/spec.md). Năm quan hệ Mệnh–Cục, chín ô một sao và các nhánh đã chốt đã chạy; không phải thiếu coding toàn P1. | Liệt kê đúng ô cùng hành/chiều ngược chưa có lời và bất nhất lợi địa; giữ “dữ kiện đã biết nhưng ngoài ô” khác thiếu dữ liệu. Chỉ mở ô có câu quyết định, không suy đối xứng. | Không đổi bảng/trạng thái để ép khớp. Không coi thuận ngũ hành là tăng phẩm chất, Phủ sinh Mệnh là chế Kỵ; giả thuyết Cục–Thân111–112 không triển khai. |
| **P2 · ND08 · C** | **Phúc Đức:** Tử Vi có sát/TT; VCD; Âm/Riêu–Đà–Kỵ, Cơ–Cự/Kỵ | TB132/140§6.1.1/36–37/39–46,142§6.1.61; [đặc tả1.47](../.local/natal-system-20261015/decision-spec.md), Phúc–Di1.30.149/192 có đoạn;8 lượt còn điều chỉnh chưa rõ. | Giải lượng từ/tác động khi sát hiện diện; phân cổng an toàn **vắng cả6 sát** của dự án với điều kiện nguồn. VCD/Đà độc thủ phải rõ có loại phụ tinh nào. | Không gọi một sát là “nhiều”, không bỏ cổng hiện tại khi chưa đặc tả. Giữ bảy nền Tử Vi đã có và lời độc lập khác; không suy Phúc thuận làm mọi cung thuận.  **1.58 đã thêm7 nhánh độc lập: Dương tọa thủ cao/thấp và5 tổ hợp; trống43→36,7 mới/8 bổ sung. Cự–Hỏa và Kỵ–Không–Kiếp chỉfixture. Còn chặn lượng từ/TT/VCD và bất nhất; phần đủ đặc tả trong ma trận đã rà đã hết. Xem Phúc–Di cập nhật.** |
| **P2 · ND09 · A/C — XONG Ô ĐỒNG NHẤT** | **Nô Bộc:** nhiều chính tinh, cùng nhóm, Bình/Lợi, TT tại Mệnh/Nô; quan hệ trợ giúp còn thiếu | TB168–173§9, bảng168–170; TL155–159; [đặc tả1.47](../.local/natal-system-20261015/decision-spec.md).23 ô đã chạy,102/192 có lời,42 lượt còn điều chỉnh;12 ô bảng chỉ có fixture trong tìm kiếm trước. | Đã đối chiếu168–171: cổng đúng một sao là giới hạn dự án, đã mở khi từng chính tinh cùng một ô nguồn trong mỗi cung;121/192 nay có lời. Chưa mở hai ô khác nhau. Còn TT tác động **ô nào, phần trợ giúp nào**. Giữ riêng bốn ví dụ TL ba cung. Với12 ô chưa có mẫu, chỉ tìm hữu hạn theo điều kiện nguồn đã khóa. | Không gọi fixture là engine hay không tìm thấy là bất khả đạt. Hoàn tất khi mỗi cấu trúc có lời/điểm chặn cụ thể; không thêm lời quy kết bạn bè để phủ90 cung chưa có đoạn.  **1.58 rà lại ma trận: không có nhánh mới đủ đặc tả; trống71 giữ nguyên,0 bổ sung. Không chọn sao thắng cho ô hỗn hợp hoặc suy “nhiều”; giữ nhóm thiếu điều kiện riêng.** |
| **P2 · ND10 · C** | **Điền Trạch:** TT với nền chưa được điều chỉnh, VCD, Đẩu Quân/nhiều sáng–mờ và nhóm phụ tinh | TB149–157§7,155 Đẩu Quân,§7.32–33/63; NPL225 khác phép nghịch đảo; [Nô–Điền](NO-DIEN-1.31.0.md). Cơ–Cự/Triệt đã có;133/192 có đoạn,45 lượt còn điều chỉnh. | Đối chiếu riêng tác động lên tạo dựng/thừa hưởng/duy trì; giải lượng từ nhóm Xương/Khúc, Tả/Hữu… theo từng câu. Không dùng TT đảo mọi nền hoặc gộp Điền vào Tài để che phần trống. | Có kết quả cho đúng phương diện và điều kiện mới coding; giữ xung đột nguồn riêng. Dữ kiện nhà đất không thành kết luận giàu/nghèo.  **1.58 khép2 câu độc lập VCD nguồn gốc cơ nghiệp và KìnhĐắc trước phá sau thành: trống59→43,16 mới/4 bổ sung; giữ TT và Không–Kiếp chưa giải, không suy KìnhHãm từ ô trống. Xem Nô–Điền cập nhật.** |
| **P2 · ND11 · C** | **Phụ Mẫu:** TT với nền Vũ–Phủ và các lời của cải/quan hệ; Lương tại Tỵ bất nhất, Kỵ/Âm–Dương | TB124–131§5,§5.2.30; [Phụ–Huynh](PHU-HUYNH-1.32.0.md).Sau ND04 ngày21/10:138/192 có đoạn (Phụ70→54 trống);35 lượt điều chỉnh nền cũ không được tự bỏ. Trong38VCD, trống35→19;6 trường hợp cặp của lô mới còn TT tại một bên nên chưa xác định. Kim Thoa có lời tài sản/quyền thế khác lời cha mẹ–con;1992 có vật chất thuận, quan hệ khác chiều. | **21/10: khép lỗi claim Cơ–Cự tọa thủ và mẫu ghép Kỵ; giữ câu thiếu hòa khí, bỏ dự báo xa cách không điều kiện.2/192 được sửa, không đổi predicate.** Xác định §5.2.30 đổi lời nào, không tự đảo hòa thuận thành bất hòa; khoanh bất nhất Lương và nhánh Hóa riêng. Tách cha mẹ với nhau, cha mẹ–con và tài sản. | Có câu trước/sau cùng đối tượng và cùng điều kiện; giữ lời độc lập đủ rõ. Không chuyển bệnh/cha mẹ mất/phẩm hạnh sang lời quan hệ nhẹ hơn. |
| **P2 · ND12 · A/C — THÊM LIÊM–PHÁ/THAM1.56** | **Tử Nữ:** TT§13.3.45; Tướng có điều kiện muộn sinh; VCD; quan hệ cha mẹ–con chưa được phục vụ | TB201§13.3.11,205§13.3.45,207§13.3.68; [ma trận Phu–Tử](../.local/phu-tu-20261013/matrix.json).Baseline84/192 có đoạn; sau lô trước là88/192; sau lô này95/192 có lời (Đồng/Lương Tỵ/Hợi thêm7 cung). Trong26 VCD trước không khớp,4 nay có lời; thêm1 VCD vốn có phụ tinh được bổ sung.10 ca Tướng và các cấu trúc còn lại chưa được giải. Lương/Sát202 có phần bị loại, không phải mọi khoảng trống đều thiếu code. **21/10 lô1.56: thêm2tọa thủ/2VCD Liêm–Phá/Tham; trống97→93,4mới/5bổ sung.** | **1.57: theo duyệt riêng, thêm Khoa/Hồng Loan; Tử93→76 trống,17 mới có nhận định/22 bổ sung.** Khép phần coding đủ căn cứ1.56; còn câu hỏi nhóm1/2/3/5 tại đặc tả Phu–Tử, không phải hàng đợi code đã sẵn sàng.** Giải một/cả TT và vế “sau này” gắn hoàn cảnh đầu; xác định liệu câu quan hệ độc lập được không. Tướng không tách điều kiện muộn sinh; Đồng/Lương Tỵ/Hợi đã có câu ly tán độc lập; VCD theo ND04 (4 cặp bổ sung chưa có engine witness). | Không tách vế thuận khỏi điều kiện nuôi con/sinh tử. Nếu chưa có câu quan hệ độc lập đủ điều kiện, ghi đúng cấu trúc chưa phục vụ; không bù bằng số con/giới tính. |
| **P2 · ND13 · A/C — THÊM12NHÁNH1.56** | **Phu Thê:** cấu trúc VCD, Sát/Phá/Lương chưa có lời quan hệ áp dụng; các điều kiện sớm/muộn/hội hợp | TB208–216§14; TL164–167; HS40–42; [Phu–Tử](PHU-TU-1.33.0.md).Trước112/192 có đoạn,80 chỉ dữ kiện; sau lô này125/192 có đoạn,67 còn trống. Mô tả sớm không đồng nhất với điều kiện nếu/mới; xem kết quả hữu hạn bên dưới. **21/10 lô1.56: thêm12nhánh tọa thủ; trống67→51,16mới/12bổ sung; [đặc tả](PHU-TU-1.33.0.md).** | **1.57: Đồng/Mão và Đồng–Âm/Ngọ đã có chú giải, điều kiện unknown/kết quả chưa áp;2 cung chỉ chú giải,49 chưa có đoạn,51 vẫn chưa có nhận định kết quả.** Khép phần coding đủ căn cứ1.56; nhóm1–4 chờ thẩm định cách hiểu nguồn, nhóm5 theoND19.** Từ ma trận từng mục đã có, tách câu quan hệ độc lập với số lần hôn nhân/phẩm hạnh và điều kiện chưa định nghĩa; không tái viết một bài sao chung cho cung thiếu. | Chỉ chuyển A những câu giữ đủ điều kiện và đối tượng. Không suy người đọc đã có vợ/chồng từ lời Khoa; không biến khung liên cung TL thành công thức đủ. |
| **P2 · ND14 · A đã khép / C còn lại** | **Huynh Đệ:** Vũ–Tham vế thời gian, nhóm sao có lượng từ; VCD; quan hệ ba cung | TB217–224§15; TL155–159; [Phụ–Huynh](PHU-HUYNH-1.32.0.md).Sau ND04 ngày21/10:148/192 có đoạn,44 còn trống; trong36VCD, trống29→9.7 ca Tướng chỉ số người không được đổi thành lời quan hệ. Vũ–Tham219/220 đã triển khai giữ cả hai vế thời gian, không đặt tuổi. Bốn dẫn Mệnh–Bào–Nô đã có. | **21/10: khép lỗi claim Đồng–Cự tọa thủ; giữ câu thiếu hòa khí, bỏ dự báo xa cách không điều kiện.1/192 được sửa, không đổi predicate.** Giữ vế thời gian gắn đúng lời Vũ–Tham khi đặc tả, không thêm tuổi; giải lượng từ riêng. Dẫn tới nhóm ba cung nguyên vẹn, không tạo thêm claim trùng. | Một câu trả lời được quan hệ/trợ giúp trong điều kiện nguồn; không lấy số lượng/thứ bậc hoặc sinh tử làm lời quan hệ. |
| **P2 · ND15 · C** | **Quan Lộc:** VCD, Vũ–Tham/Cơ–Âm/Sát chưa khớp trong một số cấu trúc; phối hợp nghề/chức/thu nhập | TB158–167§8; TH242/257/306; [Tài–Điền1.37](FINANCE-ASSETS-1.37.0.md).164/192 có đoạn;15 VCD và ba ca mỗi cấu trúc kể trên trong28 ca không khớp. Không khớp không chứng minh thiếu toàn bộ rule cho cặp sao. | Đối chiếu đúng địa chi/trạng thái/cổng của ca trống với nhánh đã có; chốt điều kiện “nhiều/trội” trước mọi kết luận nghề hoặc toàn công danh. ND03 chỉ sửa mạch đọc các nền/TT đã đủ. | Không sửa điều kiện chỉ để28 ca có lời; nếu không có nhánh nguồn hợp lệ, ghi ô còn thiếu. Không dùng tổ chức tốt⇒thu nhập cao hoặc tự chọn nghề.  **1.59 đã khép Vũ–Tham và Nhật–Cự/Thân: giữ nguyên diễn tiến “từ30”/“về già”, không chọn kết quả hiện tại. Quan28→24 trống,4 mới/1 bổ sung. Còn VCD, bất nhất Dương/Cơ–Âm, nhóm thiếu lượng từ/định danh và phạm vi Sát; xem CAREER-CLOSE cập nhật.** |
| **P2 · ND16 · C** | **Tài Bạch–Điền/Quan:** giữ của Liêm–Phủ đối Thiên Không; tạo của Cơ–Lương đối hao tán Kỵ;21 Tài VCD chưa có lời | TB190–197,191§12.6/195§12.23; TH241–242/245/257/264–265; [Tài–Điền1.37](FINANCE-ASSETS-1.37.0.md).171/192 có đoạn; Kim Thoa có lời giữ/khó giữ cùng tồn tại, không thiếu hai nền. | Chỉ tìm phép ưu tiên/điều chỉnh cùng phương diện và điều kiện; còn lại trình bày song song theo ND03, tách nguồn thu–tích lũy–nhà đất. VCD theo ND04. | Không hứa kết luận tài chính ròng khi chỉ có hai lời; không lấy chỉ dẫn “xem Mệnh/Phúc/Di” làm thuật toán hợp nhất.  **1.59 thêm Vũ–Tham/Tài giữ “ngoài30 mới giàu”, không suy đã đạt mốc; Tài21→21 trống,0 mới/2 bổ sung. VCD và phép cân đối giữ/tạo/hao tiền vẫn chưa giải. Phần đủ đặc tả trong103 hàng đã rà đã hết; xem FINANCE-ASSETS cập nhật.** |
| **P2 · ND17 · C** | **Mệnh–Thân/liên cung:** Thượng/Trung/Hạ/Phi thường cách, Phú/Quý cục, tổng hợp ngũ hành với tính chất | TB31–33/51–55/226–237; audit bổ luận22 mệnh đề vàQ01–Q08; NPL-52/53: TH14/30–32/73–74/80–86/257/428, HS76–82. | Giữ riêng phần điều kiện cần đã rõ (đủ bộ229, nhị hợp231, ngoại lệ233) và các cổng chưa rõ; không nhập nhãn cách cục chỉ vì nhận diện được một cặp sao. | Không mở đợt đọc toàn sách. Chỉ tiến khi giải được tập cung/lượng từ/trạng thái/ngoại lệ của đúng phép; nếu chưa, tiếp tục chặn lời hứa tổng hợp hoàn chỉnh, không chặn các chú giải cục bộ độc lập. |
| **P0 · ND18 · D — thẩm định, chưa phát hành** | **Tật Ách:** toàn192 chỉ dữ kiện; chưa có luận cá nhân trong phạm vi hiện hành | TB181–189§11 (toàn9 trang đã đối chiếu), định nghĩa33; TL160–163; HS44/73; [Tật Ách1.34](TAT-ACH-1.34.0.md), [ma trận55 tiêu đề](../.local/tat-ach-20261013/matrix.json). Không có nhánh B được chọn. | Ngày20/10 chủ dự án đã chọn hướng chú giải truyền thống theo cấu trúc để thẩm định; chưa duyệt hai mẫu hoặc cho phép publish. Còn phải chốt câu chữ, điều kiện phối hợp và tiêu chí luận cá nhân; xem phân tích dưới và BUSINESS_RULES. Chưa có rule phi sức khỏe đủ nguồn được audit chọn để coding ngay. **21/10: đã gom thiếu phạm vi, phép cứu/tác–liên cung và nghiệm thu thành hồ sơ thẩm định hữu hạn; xem phân tích hai mẫu trong bảng quyết định dưới đây. Chưa có phê duyệt mới.** | Không đánh dấu đủ bằng tên cung, dữ kiện hoặc lời khuyên chăm sóc bản thân. Giữ yêu cầu còn chưa đạt; chỉ đóng việc khi có quyết định sản phẩm cụ thể và, nếu bổ sung luận cá nhân, đặc tả/phê duyệt tương ứng. |
| **P0 · ND19 · D** | **Gia đình, Phúc, Mệnh và toàn báo cáo:** các vế bị loại theo phạm vi, khác thiếu code | TB198–224 (số con/anh em, sinh tử, phẩm hạnh),143–148 (âm phần); các ma trận cung nêu trên. Ví dụ Tử Lương/Sát202 gắn sinh sản/số lượng/sinh tử, không lấy riêng vế thuận. | **1.57: đã duyệt và triển khai riêng đặc tính thông minh/khéo tay (Khoa/Hồng Loan), không mở loại khác.** Xác nhận danh sách loại trừ trong mô tả gói; giữ đánh giá sức khỏe/sinh tử, quy kết phẩm hạnh, vận hạn ngoài phạm vi hiện hành. Không tự mở chỉ để phủ hết cấu trúc. | Mô tả gói không hứa nội dung bị loại; khoảng trống vẫn ghi đúng. Thay đổi phạm vi cần quyết định riêng, không được tính là đã giải quyết nội dung trong lần chốt này. **21/10: đề xuất danh sách loại trừ cụ thể trong bảng quyết định bên dưới; chờ chủ dự án trả lời, không suy loại trừ sẽ lấp cấu trúc trống.** |

### Bảng quyết định cuối gói tài liệu — 21/10/2026

Đây là bản tổng hợp điều hành của **ND01–ND19 hiện có**, không phải backlog mới hoặc phê duyệt phương án. Các nhật ký/số liệu cũ phía dưới giữ để truy vết; khi khác nhau, dùng cập nhật này và kết quả1.59. Mục tiêu chủ dự án nhắc lại trong phiên: **báo cáo đủ 12 cung có thể thu phí, áp dụng chung cho mọi khách hàng**. Không thay mục tiêu bằng12 tiêu đề, chỉ bán một tập mẫu hoặc chú giải Tật thay luận cá nhân.

**Baseline kiểm trực tiếp:** `/Volumes/DATA/TINHLUAN`, branch `main`, HEAD đầu phiên `bfcdb2b`, status/diff/staged diff sạch; code `bb230d5`, không có thay đổi `lib/app/components/tests` từ code đó tới HEAD. Đọc `CUSTOMER_VERSION=1.59.0`, `RULESET_VERSION=interpretation-1.56.0`;8 file trong receipt `serving-code.json` trùng SHA256 giữa root, checkout `.local/quan-tai-20261021/qa-final` và receipt. PID81341/81345 có cwd đúng checkout khi kiểm. Đây là kiểm tĩnh/file/cwd, không nghiệm thu lại HTTP, DB, dịch vụ hoặc tunnel. QA3070 không thao tác.

**Hiện trạng định lượng tái sử dụng:** [impact192 của1.59](../.local/quan-tai-20261021/impact192.json): số cung chưa có nhận định là Mệnh0, Phụ54, Phúc36, Điền43, Quan24, Nô71, Di14, Tật192, Tài21, Tử76, Phu51, Huynh44. Trong51 Phu có2 chỉ chú giải điều kiện. Đây không phải số thiếu bài hoàn chỉnh;192/192 còn thiếu Tật, và có lời chưa chứng minh đủ chủ đề. Không cộng các nhóm chặn vì giao nhau; không có số tin cậy phân bổ từng nguyên nhân khi điều kiện còn chưa định nghĩa. Bộ192 không đại diện mọi cấu trúc engine.

**Bốn loại nguyên nhân:** A — đủ căn cứ, còn việc triển khai/kiểm; C — cách áp dụng chưa rõ hoặc văn bản bất nhất; D — giới hạn sản phẩm tự đặt/cần xác nhận; B — đã có nhận định, còn tổ chức hoặc phối hợp. B có thể chứa chặn chuyên môn C; không được xử lý bằng nối văn. Cổng dữ liệu thiếu chứng nhận khác thiếu phương pháp, không được bỏ cổng để lấp cung.

| Nhóm nguyên nhân và ND hiện có | Nguồn, audit và code liên quan | Cung/cấu trúc bị ảnh hưởng | Cách xử lý đề xuất có căn cứ | Codex tự làm trong gói được giao / quyết định thật sự cần |
|---|---|---|---|---|
| **A — phần đủ đặc tả đã khép; còn bằng chứng khả đạt**, ND01/03 và tập con04/08–16 | Các lô1.55–1.59 tại [Phụ–Huynh](PHU-HUYNH-1.32.0.md), [Phu–Tử](PHU-TU-1.33.0.md), [Nô–Điền](NO-DIEN-1.31.0.md), [Phúc–Di](PHUC-DI-1.0.0.md), [Quan](CAREER-CLOSE-1.0.0.md), [Tài](FINANCE-ASSETS-1.37.0.md); `familyVcdAssessment`, `kinAssessment`, `quanTaiFacts` | Các nhánh đã có code nhưng mới fixture:18 Phụ/Huynh;4 cặp TửVCD cũ; Nhật–Lương Dậu/Phu, Liêm–Phá/TửVCD; Cự–Hỏa và Kỵ–Không–Kiếp/Phúc. Các tập bằng chứng khác thời điểm, không cộng thành tổng khả đạt | Không còn hàng đợi rule mới đủ đặc tả trong những ma trận vừa khép; không khẳng định hết sách. Rà receipt từng nhánh, tìm engine hữu hạn hoặc chứng minh bất khả đạt theo profile; giữ rõ nhánh chưa chứng kiến, không đổi expected/nguồn | Codex tự lập đối chiếu và kiểm trong gói kỹ thuật sau này, không cần chủ dự án đoán ngày sinh. Người thẩm định vẫn phải duyệt nội dung; test đạt không thay duyệt. Không tăng rule chỉ để giảm số trống |
| **C — VCD chưa có hợp đồng áp dụng đầy đủ**, ND04/08–16 | TB33; Phụ131§5.2.31, Phúc142§6.1.61, Điền157§7.63, Quan166–167§8.45, Di180§10.36, Tài197§12.56, Tử207§13.3.68, Huynh224; audit các cung ở hàng trên. [family-vcd.ts](../lib/interpretation-rules/family-vcd.ts), [void-palace.ts](../lib/interpretation-rules/void-palace.ts) | Nhánh còn phụ thuộc chi/sáng–hãm; cung nhận/cho và ngoại lệ chưa rõ.9 DiVCD còn chặn; Tài21 trống thuộc VCD; PhuVCD chưa có hợp đồng riêng. Không phủ nhận tập con Phụ/Huynh/Tử/Điền/Quan đã chạy | Khóa riêng từng mục: sao nào được xét, lời của cung nào, trạng thái theo chi nào, TT/Kỵ ở cung nào tác động vế nào; có ca phản ví dụ. Không chuyển cả catalog hoặc tạo cung giả. Giữ9Di khi không có bằng chứng mới | Codex gom câu/điều kiện hiện có và code phần có hợp đồng được thẩm định. **Người thẩm định** xác lập phương pháp còn thiếu bằng nguồn; chủ dự án chỉ giao phạm vi và người duyệt, không chọn trạng thái sao |
| **C — lượng từ, định danh, vị trí và điều kiện chưa kiểm được**, ND05/06/08–16/17 | TB118/120 + HS168–169 (M06); TB36/76, HS129, TH340–341 (Phủ); TB132–142,149–173,190–224,226–237; [bổ luận](TANBIEN-MENH-THAN-SUPPLEMENT-AUDIT.md), [câu hỏi nguồn](BUSINESS_RULES.md#4-các-câu-hỏi-chuyên-môn-thực-sự-đang-chặn), nhóm1/3 [Phu–Tử](PHU-TU-1.33.0.md). [life-literary.ts](../lib/interpretation-rules/life-literary.ts), [no-dien.ts](../lib/interpretation-rules/no-dien.ts), [kin-approved.ts](../lib/interpretation-rules/kin-approved.ts) | M06; Phủ–sát; “nhiều”, “hội hợp”, Lộc/Hao, nhóm sáng/mờ và các tổ hợp ở nhiều cung; nếu muộn sinh/chậm cưới/tiên trở hậu thành. Không gán mọi ca trống cho nhóm này | Bảng danh tính sao–lượng từ–quan hệ–điều kiện–kết quả đạt/không đạt/chưa biết. Không suy AND/OR từ dấu phẩy, không tự đặt tuổi/ngưỡng. Giữ nguyên toàn diễn tiến thời gian đã giải ở1.59; không phục hồi cổng tuổi cũ. Hai chú giải Phu1.57 vẫn unknown/outcomeApplied=false, không tự mở sang câu khác | Codex chuẩn bị phiếu nguồn và phản ví dụ, triển khai sau khi đủ đặc tả. Người thẩm định chốt nghĩa có căn cứ. Chủ dự án có thể duyệt việc trình bày chú giải chưa áp dụng sau khi xem mẫu, nhưng duyệt đó không tạo ra điều kiện chuyên môn |
| **C — ô nguồn thiếu/bất nhất văn bản hoặc cấu trúc**, ND07/08/09/11/13/15/17/18 | TH108–110/134–135, HS68; TB128–129 (Lương/Phụ), Phúc132–142, Quan158–167, Phu209/211/212; Tật184/189. [NPL/P1](../.local/npl-foundation-20261014/spec.md), audit Quan/Phúc/Phu–Tử/Tật. [npl-foundation.ts](../lib/interpretation-rules/npl-foundation.ts), `noDienAssessment` | Ô ngũ hành chiều ngược/cùng hành, Nô đa nhóm/ô trống; DươngTý/Quan hai lời, Cơ–Âm ghiThìn không phù hợp engine; LươngTỵ ở Phụ/Phu; Đồng–Âm Tý “như trên”; Tật Thiên Khôi lặp mục Thiên Tướng | Giữ ô chưa xác định. Chỉ sửa cách đọc khi có bản đính chính hoặc bằng chứng trực tiếp được thẩm định. Không suy đối xứng, không chọn sao thắng, không sửa chi/tên sao vì “có vẻ hợp lý”; không đổi engine để khớp câu. Nhánh Sát–Quyền không tương thích profile không giải bằng quét ngày | Codex chỉ đối chiếu đúng đoạn khi audit chưa đủ và ghi hai cách đọc. Người thẩm định chịu trách nhiệm đính chính/giải nghĩa; chủ dự án không được yêu cầu chọn câu nguồn thắng. Không có đính chính thì ghi blocker còn mở, không ghi đã giải |
| **B/C — đã có lời nhưng chưa có phép phối hợp/điều chỉnh**, ND03/06–17 | TB131§5.2.30,149–157,168–173,190–197,217–224; TH241–245/257/264–265, TL155–159; [Tài–Điền](FINANCE-ASSETS-1.37.0.md), các audit cung. [finance-assets.ts](../lib/internal-review/finance-assets.ts), [customer-topic-editorial.ts](../lib/internal-review/customer-topic-editorial.ts) | TT với vật chất Phụ/Điền và trợ giúp Nô; TửVi–sát/Phúc; Liêm–Phủ/ThiênKhông, Cơ–Lương/Kỵ; Mệnh–Thân/ngũ hành/cách cục và liên cung. Một cung có lời vẫn có thể thuộc nhóm này | ND03 đã khép bố cục; giữ song song những lời khác phương diện, không đòi “kết quả ròng” nếu nguồn không có. Với xung đột cùng phương diện hoặc ngoại lệ bắt buộc chưa giải, cần phép điều chỉnh cụ thể và phạm vi tác động; không dùng đoạn kết văn chương che chỗ thiếu | Codex biên tập/ánh xạ căn cứ và giữ nguyên nhóm nghĩa. Người thẩm định xác nhận quan hệ, ngoại lệ và mức đủ của bài; **đề xuất chủ dự án chấp nhận bài nhiều phương diện, không buộc chốt tốt/xấu chung**, nhưng không coi chấp nhận này là bỏ yêu cầu phối hợp bắt buộc |
| **D — giới hạn sản phẩm và phân phối quyền**, ND02/19 | TL181, HS40–41, TH191–192/224/241; TB143–148/198–224. [DECISIONS](DECISIONS.md), [BUSINESS_RULES](BUSINESS_RULES.md); [reading-policy.ts](../lib/trial/reading-policy.ts), [customer-report.ts](../lib/internal-review/customer-report.ts) | Năm rule Mệnh–Thân đã có trong full; số con/anh chị em, thứ bậc/giới tính, số lần hôn nhân, âm phần và đặc tính con. Khoa/HồngLoan đã mở riêng1.57, không bao trùm HóaQuyền/loại khác | **Đề xuất giữ G2 hiện tại**, đóng quyết định ND02 theo giữ nguyên nếu chủ dự án chốt; đây không phải thiếu nội dung trong full. Đề xuất xác nhận loại số lượng/thứ bậc/giới tính/số lần hôn nhân/âm phần khỏi lời hứa thương mại; giữ hai đặc tính đã duyệt. Các cấm bệnh thực tế/chẩn đoán/tử vong/điều trị/phẩm hạnh không đưa ra xin mở lại | Chủ dự án xác nhận phạm vi từng loại; Codex lập ánh xạ các câu bị loại và chứng minh còn lời độc lập nào trả lời chủ đề. **Loại nội dung không tự lấp cung trống**; nếu cấu trúc chỉ có lời bị loại thì vẫn chặn mục tiêu chung. Không coi quyết định loại trừ là đủ 12 cung |
| **D + C + B — Tật Ách chưa có luận cá nhân**, ND18 (liên quan19/17) | TB181 mở chương,182§11.2.2,183§11.2.5,184/189; TL160–163; HS44/73; [audit55 tiêu đề](../.local/tat-ach-20261013/matrix.json), [đặc tả](TAT-ACH-1.34.0.md), [hai mẫu nguyên văn](BUSINESS_RULES.md#5-toàn-văn-hai-mẫu-tật-ách-để-duyệt). [tat-ach.ts](../lib/internal-review/tat-ach.ts): `tatAchReading` chỉ facts-only/missing-data | Mọi cấu trúc Tật trong mục tiêu,192/192 mới dữ kiện. Hai mẫu chỉ Đồng–Cự và Cơ–Âm, không đại diện các cấu trúc còn lại | Ưu tiên khóa tiêu chí và thẩm định hai mẫu cùng những yếu tố chưa xét; không code hai mẫu rồi gọi xongTật. Nếu nguồn hiện có không chứng minh được lời cá nhân trong phạm vi cấm đã chốt, phải ghi **chưa có đường hoàn thành được chứng minh**, tiếp tục giữ cổng bán đóng | Codex chuẩn bị hồ sơ thẩm định và hiện thực đặc tả đủ nguồn; chủ dự án duyệt phạm vi/câu chữ/tiêu chí, chỉ định người thẩm định. Người thẩm định xác nhận có hay không phép phối hợp và đầu ra hợp lệ. Duyệt mẫu, duyệt chuyên môn và cho phép publish là ba việc riêng |

#### Tật Ách: hai mẫu giải được gì, còn thiếu gì

Audit đã đọc9 trang TB181–189 và các đoạn TL/HS liên quan; không cần đọc lại toàn sách. Code hiện chỉ chiếu dữ kiện có chứng nhận, giữ ô trạng thái thiếu là chưa xác định. Do đó thiếu luận không phải lỗi chưa tải sao.55 tiêu đề audit không phải55 rule sẵn sàng; chưa chọn được nhánhB phù hợp để coding.

- **Đồng–Cự:** đã khóa hai sao đồng cung bản mệnh, không tự thêm chi/tuổi/độ sáng; truy được “tâm khí” và nền tiêu hóa ởTB182. Mẫu giải cách giới thiệu câu nguồn, không dịch thành chẩn đoán. Chưa phối hợp lời Cự Môn, Kình/Tả/Hữu, TT trong cấu trúc chứng kiến và Mệnh–Thân–Phúc; chưa biết những yếu tố đó làm thay lời nào.
- **Cơ–Âm:** đã khóa đồng cung, truy mụn nhọt/nền ngoài da–tê thấp ởTB183. Chưa phối hợp toàn lời Thái Âm, Địa Không trong cấu trúc chứng kiến, tập cứu/tác và ba cung. Không suy Địa Không làm nặng hoặc nhẹ.
- **Cả hai:** có chứng kiến cấu trúc engine trong bộ192, không chứng minh sự kiện sức khỏe, không phủ mọi cấu trúc, chưa duyệt câu chữ/chỗ đặt, chưa được publish. Duyệt chúng chỉ khép cách diễn đạt hai chú giải, không khép điều kiện áp dụng toàn cung, không giảm192 Tật thiếu luận cá nhân.

**Đầu ra phải có trước khi có thể gọi Tật hoàn chỉnh:** (1) chủ đề cá nhân hợp lệ trong giới hạn đã chốt, phân biệt rõ với trích giải văn bản; (2) bảng cấu trúc/điều kiện cho miền engine, gồm VCD, ngoại lệ, dữ liệu chưa biết; (3) phép xét lời riêng, cứu/tác và Mệnh–Thân–Phúc có địa chỉ nguồn hoặc kết luận rõ chưa có bằng chứng; (4) biên tập giữ nghĩa và mức khẳng định; (5) người thẩm định nghiệm thu nội dung và chủ dự án cho phép phát hành riêng; (6) kiểm qua pipeline chung và bản lưu mới. Đây là **tiêu chí đề xuất**, chưa chứng nhận khả thi chuyên môn hoặc phê duyệt hai mẫu.

Đề xuất bước quyết định: duyệt **phạm vi hồ sơ thẩm định** trên và người có thẩm quyền ký kết quả; người thẩm định trả về “đủ đặc tả” hoặc “thiếu bằng chứng tại điều kiện cụ thể”. Không buộc họ sản xuất một công thức bằng mọi giá. Không dùng thông báo miễn trừ để biến câu bệnh thành luận cá nhân được chấp nhận.

#### Các gói còn lại, phụ thuộc và ước lượng có điều kiện

Các gói dưới chỉ là cách thi công các ND hiện có, không tạo mã backlog. Ước lượng là **giờ công tập trung**, dự toán của phiên này, không phải số đo các lô trước hay ngày hẹn; gồm một vòng sửa thông thường. “Thẩm định” là giờ người có chuyên môn thực đọc/kết luận; **thời gian chờ lịch, nguồn đính chính hoặc quyết định không nằm trong số giờ**. Phạm vi tối đa mỗi lô giữ hữu hạn; nếu còn nhánh, cập nhật chính ND tương ứng và ước lượng lại, không tự mở lô kế tiếp.

| Gói theo ND / phụ thuộc | Đầu ra và tiêu chí dừng | Triển khai/đặc tả kỹ thuật | Biên tập/hồ sơ | Nghiệm thu kỹ thuật | Thẩm định nội dung và thời gian chờ |
|---|---|---|---|---|---|
| **Khóa phạm vi và Tật trước — ND18/19/02/17**; gói đề xuất tiếp theo sau khi chốt người duyệt | Một hợp đồng “đủ 12 cung” theo phương diện; phiếu thẩm định đúng2 mẫu Tật và bảng cứu/tác/liên cung còn thiếu; xác nhận ND02/19. Dừng khi mỗi câu có kết quả thẩm định hoặc blocker có địa chỉ, không thêm rule/publish | 2–4 giờ lập đặc tả,0 code | 4–8 giờ | 1–2 giờ kiểm tài liệu | 4–8 giờ thẩm định ban đầu; chờ người duyệt/nguồn: **chưa định lượng**. Kết quả có thể vẫn chưa đủ cơ sở hoàn thành Tật |
| **Giải điều kiện nguồn — ND04–17**, sau phạm vi; ưu tiên VCD rồi TT/lượng từ/ô bất nhất tác động lời hứa | Mỗi lô tối đa1 nhóm nguyên nhân,10 câu nguồn; bảng đạt/không đạt/chưa biết, phạm vi ngoại lệ, phản ví dụ. Tái dùng audit; chỉ mở đúng đoạn thiếu. Dừng ở bảng đủ hoặc kết luận thiếu bằng chứng, không vòng nghiên cứu vô hạn | 3–6 giờ/lô | 2–4 giờ/lô | 1–2 giờ/lô kiểm bảng/link | 4–8 giờ/lô thẩm định; đính chính/nguồn mới và tổng số lô **chưa biết**. Không bảo đảm mọi câu sẽ được giải |
| **Đưa đặc tả đã duyệt vào pipeline — các tập con ND04–18**; chỉ sau hai gói trên cung cấp phần đủ điều kiện | Mỗi lô tối đa10 nhánh/1 hợp đồng phương pháp, dùng engine/evaluator/renderer hiện có. Bản mới có version; đúng/sai/unknown/ngoại lệ, không sửa lịch sử/G2. Tật chỉ vào gói khi có phép và cho phép phát hành cụ thể | 6–12 giờ/lô | 3–6 giờ/lô | 4–8 giờ/lô theo TESTING,DB riêng | 2–4 giờ/lô duyệt văn/kết quả; chờ phê duyệt tách riêng. Phép phối hợp mới vượt hợp đồng này phải ước lượng lại trước làm |
| **Khép mạch bài và bằng chứng — ND03/04/07–18**, sau mọi phần cần cho lời hứa đã đủ đặc tả | Một bản ứng viên chung; rà ma trận chủ đề từng cấu trúc, quan hệ cùng/khác phương diện; so192 và mẫu engine bổ sung có chủ đích, tách fixture/bất khả đạt/chưa chứng kiến. Kiểm free/full, lưu–mở, mobile,PDF đại diện và bảo toàn. Dừng khi không còn ô thiếu trong miền hỗ trợ đã mô tả; nếu còn, trả về đúng ND, không gọi đủ | 4–8 giờ | 6–12 giờ | 8–16 giờ | 8–16 giờ thẩm định bài; số vòng sửa thêm chưa biết.192 đạt không thay chứng minh ma trận miền hỗ trợ |
| **Sẵn sàng thu phí — G0/G6/G7, V1-7**, chỉ sau cổng nội dung và ủy quyền riêng | Chốt quyền dùng nguồn/phê duyệt chuyên môn, giá/hạn/hỗ trợ/hoàn tiền; kiểm quyền/giao hàng/vận hành/domain/email/Live theo kế hoạch sẵn có. Zalo/máy chủ đang hoãn, không tự đưa vào thực thi phiên này | Dự phòng8–16 giờ cấu hình/tích hợp khi đủ đầu vào | 2–4 giờ điều khoản/mô tả gói | 8–16 giờ | 2–4 giờ duyệt sản phẩm; chờ dịch vụ/tài khoản/pháp lý nguồn **chưa định lượng**. Không suy có thể bật Live ngay sau khép nội dung |

Với **một lô giải nguồn + một lô code** và các gói cố định: dự toán minh họa23–46 giờ kỹ thuật/đặc tả,17–34 giờ biên tập,22–44 giờ nghiệm thu kỹ thuật,20–40 giờ thẩm định; tổng82–164 giờ công, **không phải tổng hoàn thành12 cung**. Mỗi lô nguồn thêm cần6–12 giờ Codex +4–8 giờ thẩm định; mỗi lô code thêm13–26 giờ Codex +2–4 giờ thẩm định. Chưa biết số lô, tính khả thi Tật và thời gian chờ nên **chưa có tổng thời gian hoàn thành đáng tin cậy**. Không quy giờ công thành ngày lịch hoặc hứa ngày bán.

#### Quyết định cụ thể cần chủ dự án trả lời

1. **Người thẩm định và tiêu chí Tật:** chỉ định ai có thẩm quyền kết luận điều kiện/phối hợp, và chấp thuận gói hồ sơ2 mẫu + tiêu chí ở trên? **Đề xuất có**, nhưng chưa duyệt nguyên văn2 mẫu/publish; cần kết quả chuyên môn trước. Mục tiêu12 cung đã xác nhận, không hỏi lại có hạ mục tiêu không.
2. **Phạm vi ND19:** xác nhận loại số lượng con/anh chị em, thứ bậc/giới tính, số lần hôn nhân và âm phần khỏi sản phẩm thương mại; giữ hai đặc tính Khoa/HồngLoan đã duyệt? **Đề xuất xác nhận danh sách này**, ghi rõ các cấu trúc thiếu lời độc lập vẫn chưa đủ; không mở bệnh/sinh tử/phẩm hạnh để bù.
3. **Tiêu chí bài hoàn chỉnh:** chấp nhận bài phân phương diện, giữ lời khác chiều có căn cứ và không ép kết luận tốt/xấu ròng khi nguồn không có phép? **Đề xuất có**. Vẫn bắt buộc giải ngoại lệ và phối hợp mà chính nguồn yêu cầu, trả lời chủ đề của từng cung; một đoạn hoặc chú giải unknown không đủ.
4. **ND02:** giữ năm nhóm Mệnh–Thân theo G2 hiện hành và đánh dấu quyết định phân phối đã khép? **Đề xuất giữ nguyên**; nội dung đã có trong full. Không phải điều kiện phải mở miễn phí mới hoàn thành12 cung. Phiên này không đổi policy dù chưa trả lời.
5. **Trước gói thương mại, chưa cần mở trong gói kế tiếp:** ai xác nhận quyền sử dụng nguồn/phê duyệt nội dung; giá, hạn đọc/lưu/PDF, lưu giữ/xóa dữ liệu tài khoản, hỗ trợ/hoàn tiền, domain/kênh hỗ trợ, người sở hữu cấu hình nhà cung cấp và thời điểm cho phép triển khai dịch vụ? **Đề xuất chốt sau cổng nội dung**, giữ bản mua cố định và không chuyển quyền sang lá số sửa. Không dùng1.000đ/72 giờ thử làm phương án giá được duyệt.

Không có câu hỏi yêu cầu chủ dự án chọn AND/OR, địa chi/trạng thái hoặc câu nguồn thắng. Nếu chủ dự án cũng là người thẩm định, phần chuyên môn vẫn phải trả bằng dẫn nguồn, điều kiện và phản ví dụ, không chỉ chọn một phương án. Các đề xuất trên chưa được duyệt; chưa đóng ND18/19/02 bằng chính tài liệu này.

**Kết thúc phiên tài liệu:** chỉ cập nhật kế hoạch, CURRENT_STATUS và ghi phạm vi yêu cầu mới trong DECISIONS; không thêm rule, không sửa ứng dụng, không chạy test/build/PDF, không ghi DB/kho, không restart/worker/migration, không mở mẫu Tật/Live. G2/lịch sử giữ nguyên. Kiểm link/diff và commit tài liệu riêng; bằng chứng nghiệm thu ứng dụng nêu ở đây đều tái sử dụng.


### Cập nhật 21/10 — sửa chính xác Cơ–Cự/Phụ và Đồng–Cự/Huynh

Đối chiếu chữ/ảnh đúng PDF127–128§5.2.6/5.2.10 và219–220§15.2.3/15.2.10, ngữ cảnh126/218. **Đã chứng minh lỗi rút gọn claim**, không phải thiếu predicate: lời “nên phải” và “có ... mới ...” gắn tránh hình khắc/toàn vẹn bị đổi thành dự báo xa cách không điều kiện. Hai rule0.1.1 giữ câu độc lập “trong nhà thiếu hòa khí”; sửa cả mẫu ghép Cơ–Cự/Hóa Kỵ, giữ hai khả năng riêng của Kỵ. Không thêm điều kiện tuổi/chi/trạng thái hoặc miễn trừ để cứu kết luận sai. [Nguồn và expected](PHU-HUYNH-1.32.0.md).

Bộ192:3hồ sơ sửa văn (Phụ2,Huynh1), không thêm/mất claim hay đổi tập khớp/facts/relations; số cung trống giữ nguyên.33nhánh VCD và18nhánh chỉfixture không đổi; không tìm thêm mẫu.663/663 test tại5file cuối, typecheck/build đạt; hai ca qua form khách, lưu/mở lại đúng toàn văn, G2/chéo phiên/mobile360/390 đạt. Không xuất PDF mới vì không đổi layout/paginator; kiểm quyền PDF403/404. Lượt đầu so192 bắt mẫu ghép còn chữ cũ; hai test cũ yêu cầu lời sai được thay expected theo nguồn và kiểm đủ vế Kỵ, giữ fixture lịch sử. Lượt setup build thiếu env dừng trước chạy, đã nạp cấu hình đúng; chỉ một production build thực chạy.

Lịch sử120file báo cáo,37file phiên,14filecode bảo vệ giữ hash; các quyền/binding/link cũ và34bài công khai không đổi. Hai bản/hai đơn mock QA mới, không SePay thật/Live. [Bàn giao trước/sau](../.local/family-accuracy-20261021/ban-giao.md), [so192](../.local/family-accuracy-20261021/impact192.json), [QA](../.local/family-accuracy-20261021/public-acceptance.json). Khép phát hiện ở ND11/14; không mở lô mới, Tật chưa publish, G2 giữ nguyên.

### Cập nhật 21/10 — ND04 Phụ Mẫu/Huynh Đệ, khép tập con

- Chỉ dẫn riêng PDF131§5.2.31 /224§15.2.47 được đối chiếu với từng câu125–127/218–219; **33 câu không đòi địa chi/trạng thái**. Không mượn lời Tật/Nô; không chuyển phụ tinh hoặc đảo lời. [Bảng điều kiện và expected nguồn](PHU-HUYNH-1.32.0.md).
- Phân cổng dự án: chặn toàn VCD vì chưa giải trạng thái là quá rộng đối với tập con này. Giữ cổng thẩm định đối với giàu/nghèo/sang/hèn của Phụ khi TT có ở cung nhận **hoặc** cung cho; chưa xác định nơi/kết quả áp dụng §5.2.30. Không nói sách bắt buộc vắng TT. Quan đã có nhánh VCD/TT trực tiếp, không được gọi là thiếu toàn bộ; chưa chuyển các lời cặp Quan/Tài khi chưa giải tương tác với ngoại lệ riêng.
- Bộ192: **38 snapshot có43 claim mới;36 cung trước trống có lời,7 cung vốn có lời được bổ sung.** Không tính thêm đủ12cung. Số trống: Mệnh0, Phụ54, Phúc43, Điền59, Quan28, Nô71, Di14, Tật192, Tài21, Tử97, Phu67, Huynh44. Các claim/fact/rule/trace/quan hệ cũ giữ nguyên; chỉ thêm quan hệ chưa hợp nhất B-vcd khi đúng cả hai bên. G2 giữ nguyên toàn bộ nhóm miễn phí.
- Tìm hữu hạn1.440 đầu vào hợp lệ ngoài192:15 nhánh có chứng kiến engine trên14 đầu vào khác nhau;18 nhánh còn chỉ fixture, **chưa chứng minh khả đạt**, không gọi bất khả đạt. Hai mẫu mới qua form khách; không dùng fixture làm lá số thật.
- Kiểm cuối:679/679 tại8file liên quan, G2 riêng6/6, typecheck/build đạt. Hai phiên khách: tạo/lưu/mở lại nguyên văn; chưa có full grant thì PDF403 và không có lời khóa trong payload; chéo phiên đọc/PDF404. Hai đơn mock nội bộ để xem toàn bài, không SePay/Live. Mobile360/390, căn cứ; một PDF8trang đủ18đoạn, đã xem ảnh cả8trang. Không chạy toàngate hoặc bộPDF.
- Bảo toàn kho phục vụ trước lô:117file báo cáo/103ID (có mirror),35file phiên;14file engine/quyền/payment và các dòng quyền/binding/link cũ giữ hash.34bài Toàn thư công khai không đổi. Không lấy kho archive/QA sao chép làm mẫu độc lập.
- **Còn cần thẩm định:** (1) TT tại cung nào ảnh hưởng chính diệu xung chiếu của Phụ, và biến đổi từng phương diện ra sao; (2) chi cho hay nhận với câu có địa chi/trạng thái; (3) mức phối hợp Phúc–Huynh. Năm cách rút gọn của nhánh mới chỉ giữ câu độc lập; văn tọa thủ cũ Cơ–Cự/Phụ và Đồng–Cự/Huynh có chỗ diễn đạt xa cách rộng hơn câu điều kiện, ghi để thẩm định trong ND11/14, không tự sửa lịch sử. Không cần quyết định mở rộng phạm vi để dùng33 câu đã triển khai; Tật giữ đúng trạng thái chưa duyệt mẫu/chưa publish.
- [Bàn giao/toàn văn/cách tạo](../.local/vcd-20261021/ban-giao.md), [chênh lệch192](../.local/vcd-20261021/impact192.json), [QA](../.local/vcd-20261021/public-acceptance.json). Dừng lô; không mở G6/Zalo/Live hoặc nghiên cứu toàn sách.

### Cập nhật 20/10 — lô gia đình và thẩm định Tật Ách

**Phạm vi hữu hạn:** ND08/10/11/14 từ audit hiện có. Không mở lại các nhánh đã chặn khi chưa có bằng chứng mới. Trong bốn cung ưu tiên, nhánh còn thiếu triển khai và đủ rõ là Vũ–Tham tại Huynh Đệ. “Sau” thuộc lời diễn biến, không phải điều kiện tuổi mà người dùng phải đạt. Bỏ rào cản thời gian tự đặt của đặc tả cũ, không bỏ điều kiện nguồn.

| Cung | Trống trước → sau /192 | Trước trống nay có lời | Đã có lời, được bổ sung | Còn chặn |
|---|---:|---:|---:|---|
| Phụ Mẫu |70 →70|0|0|35 VCD; trạng thái/địa chi cung nhận và ngoại lệ chưa rõ. Các nền giàu nghèo gặp Tuần/Triệt chưa có phép điều chỉnh; Lương Tỵ bất nhất; lời sinh tử không đổi thành quan hệ. |
| Điền Trạch |59 →59|0|0|16 VCD; cách đổi riêng từng phương diện dưới Tuần/Triệt và lượng từ nhóm phụ tinh chưa rõ. Không đảo hoặc bỏ cổng toàn bộ. |
| Huynh Đệ |65 →64|1|1|29 VCD;7 Thiên Tướng có lời số lượng nhưng không có lời quan hệ thay thế. Các ô khác vướng phạm vi số lượng/phẩm hạnh/bệnh nạn hoặc lượng từ/liên cung. |
| Phúc Đức |43 →43|0|0|21 VCD; các cổng sát tinh/ngoại lệ và mức phối hợp chưa chốt. Không bỏ cổng Tử Vi để tăng độ phủ. |

Toàn192 vẫn có cung thiếu lời; Tật Ách192/192. Các cung khác giữ nguyên: Mệnh0, Quan28, Nô71, Di14, Tài21, Tử97, Phu67. Đây là số **có/không có đoạn**, không phải mức hoàn chỉnh chuyên môn.

**ND14 đã khép một nhánh:** `tanbien.siblings-vu-tham-later`, Vũ Khúc–Tham Lang bản mệnh đồng cung Huynh Đệ, chính tinh12cung đầy đủ/hợp lệ. Không mượn đối cung, không thêm giới tính, trạng thái sáng hay tuổi. Tân Biên bản277trang, SHA-256 `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`: [ảnh trang PDF219 §15.2.4](../.local/phu-huynh-20261013/images/tb-219.png), [PDF220 §15.2.9](../.local/phu-huynh-20261013/images/tb-220.png), định nghĩa đồng cung PDF33, phạm vi Huynh PDF217. Hai ảnh quyết định đã đọc lại. Giữ cả “sớm xa nhau” và “sau đều giàu có”, không suy xa nhau gây giàu có; bỏ số lượng theo giới hạn sản phẩm, không chuyển tiền của anh chị em thành tài chính đương số. Chưa phối hợp Phúc Đức hoặc chọn lời thắng.

**Văn mới:** “Vũ Khúc–Tham Lang cùng ở Huynh Đệ gắn với cảnh anh chị em sớm xa nhau, về sau đều giàu có. Lời này không xác định tuổi diễn ra hay một người anh, chị, em cụ thể.”

Câu1 → claim/rule trên → `fact.siblings-vu-tham-later` → hai sao tại Huynh → PDF219/220. Câu2 là giới hạn biên tập. Snapshot164 trước chưa có lời Huynh; snapshot169 có lời riêng được bổ sung nguyên đoạn, không hợp nhất hoặc xuất trùng ở mục Tham. [Chênh lệch192, toàn đoạn trước/sau](../.local/family-scope-20261020/impact192.json).

**Tạo thử bằng luồng chung:** nam,05/11/2008 dương lịch,giờ Dậu(17–19h), Huynh tại Sửu — mẫu engine ngoài192. Nữ,06/02/2013,giờ Tỵ(09–11h), Huynh tại Mùi — mẫu192 số169. Tìm hữu hạn±7ngày quanh hai đầu vào:16 phép tính, tìm1 chứng kiến ngoài bộ; chưa tìm thêm Mùi ngoài bộ trong phạm vi đó, không gọi bất khả đạt. Fixture hoán đổi sao/thiếu chứng nhận là test kỹ thuật. Huynh vẫn cần quyền G2; chỉ QA A/B có checkout thử, không tự mở nội dung trả phí.

#### Tật Ách — đề xuất để duyệt, chưa publish

Ngày20/10 chủ dự án cho phép thẩm định/đề xuất, chưa cho phép phát hành kết luận sức khỏe/sinh tử. Mục tiêu luận cá nhân12cung giữ nguyên. Các đoạn dưới **chưa phải luận Tật Ách hoàn chỉnh** và không được tính là đã giải quyết192cung trống.

Tái sử dụng audit toàn chương181–189 và55 tiêu đề (không phải55rule); lượt này đọc lại chữ và ảnh [PDF181](../.local/tat-ach-20261013/images/tb-181.png), [182](../.local/tat-ach-20261013/images/tb-182.png), [183](../.local/tat-ach-20261013/images/tb-183.png), đúng bản/hash Tân Biên nêu trên. Không ghép NPL/Thiên Lương thành cùng phương pháp.

- **Nguồn thực đề cập:** tì vết, bệnh, tai ương và lúc chết. PDF181 yêu cầu xét Mệnh–Thân–Phúc Đức trước, tìm cả cứu tinh và sao tác họa hội hợp rồi cân nhắc tăng/giảm. Đây là yêu cầu nguồn. Chưa có lượng từ “nhiều”, mức cứu giải hoặc thứ tự thắng đủ để chạy máy; không tự tạo điểm số.
- **Hai lời riêng có điều kiện rõ:** Đồng–Cự đồng cung Tật (§11.2.2,PDF182) gắn với chữ “bệnh tâm khí”; Cơ–Âm đồng cung Tật (§11.2.5,PDF183) có lời “nhiều mụn nhọt”. Không có tuổi/giới tính/địa chi/trạng thái sáng riêng trong hai dòng này; không mở đồng cung thành hội chiếu. Có thể đề nghị dạng **chú giải tri thức truyền thống theo cấu trúc**, chưa được suy người mang lá số mắc bệnh hoặc bỏ yêu cầu phối hợp đầu chương.
- **Cứu giải cũng cần giữ điều kiện:** Khoa§11.1.2; Lộc Tồn/Hóa Lộc/Bác Sĩ có ngoại lệ khi nhiều sát tinh xâm phạm§11.1.4; Tràng Sinh gặp nhiều sao tác họa§11.1.6; Quyền/Tả Hữu theo nhóm cứu/tác§11.1.8–9. Không xuất riêng “ít bệnh/khỏe mạnh” rồi bỏ ngoại lệ; không đổi cứu bệnh thành giảm áp lực hay tăng tiền bạc.
- **Đề nghị loại khỏi sản phẩm:** chẩn đoán bệnh thực tế, khẳng định cơ quan yếu/tật/sinh sản, nguyên nhân y khoa, dự báo tử vong/tự sát/tuổi thọ/cách chết, bảo đảm khỏi bệnh/thoát nạn, chỉ định xét nghiệm/điều trị, nhân quả gia đình gây bệnh. Lá số không cung cấp bằng chứng y khoa cho những kết luận này; nhãn “truyền thống” không làm chúng thành đánh giá y khoa đáng tin. Lời tai nạn/hình ngục không đổi thành “áp lực/sức bền” để dễ phát hành.
- **Còn thiếu cụ thể:** cách tăng/giảm từ ba cung; tập sao và lượng từ hội hợp; cách phối hợp nền/đồng cung/cứu giải cùng phương diện; nghĩa thuật ngữ cổ nếu muốn diễn giải hiện đại. Audit cũ còn nghi vấn Lương PDF184 và Khôi PDF189; không đọc lại hoặc sửa đoán trong lô này.

**Mẫu A — Đồng–Cự tại Tật, chỉ chú giải nguồn:**

> Khi Thiên Đồng và Cự Môn cùng nằm ở Tật Ách, đoạn về Thiên Đồng trong Tân Biên dùng chữ “bệnh tâm khí”. Phần nền của Thiên Đồng còn nói đến đau bụng và bộ máy tiêu hóa. Đây là cách mô tả trong tài liệu tử vi truyền thống; từ “tâm khí” được giữ nguyên, không quy đổi thành một chẩn đoán hiện đại. Đoạn này chưa kết hợp các yếu tố cứu giải và ba cung Mệnh–Thân–Phúc Đức, nên không kết luận tình trạng sức khỏe của bạn.

Ánh xạ: câu1→PDF182§11.2.2 dòng Cự đồng cung; câu2→nền ngay trên; câu3→giới hạn biên tập; câu4→yêu cầu PDF181 và trạng thái chưa đặc tả. Cấu trúc engine thật: snapshot43,nữ06/11/1983 giờ Tỵ,Tật tại Sửu, có cả Tuần/Triệt và Tả/Hữu/Kình. Không phát hành dòng Đồng–Cự như kết luận cá nhân rồi bỏ cứu giải; không xác định bên nào thắng.

**Mẫu B — Cơ–Âm tại Tật, chỉ chú giải nguồn:**

> Với Thiên Cơ và Thái Âm cùng ở Tật Ách, mục Thiên Cơ ghi riêng hình ảnh “có nhiều mụn nhọt”; phần nền của mục còn nhắc bệnh ngoài da hoặc tê thấp. Đây là lời gắn với cặp sao trong văn bản truyền thống, không xác định bạn có các biểu hiện ấy. Chưa có cách phối hợp đầy đủ lời riêng của từng sao, các yếu tố đi cùng và phần cứu giải để đưa ra một kết luận Tật Ách cho hồ sơ này.

Ánh xạ: câu1→PDF183§11.2.5 nền và dòng Nguyệt đồng cung; câu2→giới hạn biên tập; câu3→PDF181 và thao tác chưa đặc tả. Cấu trúc engine thật: snapshot83,nữ18/05/1993 giờ Dậu,Tật tại Dần,có Địa Không. Không tự lấy Địa Không làm bằng chứng phủ định/nặng bệnh. Mẫu chỉ giải thích đoạn Thiên Cơ, chưa phối hợp cả lời Thái Âm, không phải toàn luận Tật của hồ sơ.

**Quyết định mới nhất của chủ dự án, 20/10:** đồng ý hướng *chú giải truyền thống theo cấu trúc* để tiếp tục thẩm định. **Chưa duyệt hai đoạn mẫu, chưa cho phép publish và không tính là hoàn thành luận cá nhân Tật Ách.** Không hỏi lại việc đồng ý hướng; phần còn cần duyệt là câu chữ/giới hạn của hai mẫu, điều kiện áp dụng và phép phối hợp cứu/tác với Mệnh–Thân–Phúc Đức. Mục tiêu đủ12cung giữ nguyên; beta tiếp tục, Live tắt. Danh sách loại trừ mở rộng trong đề xuất vẫn là đề xuất; các cấm chẩn đoán, thời điểm tử vong và khuyên điều trị đã được chủ dự án chốt vẫn có hiệu lực.

**ND03 đã được chủ dự án giao và hoàn thành20/10:** tổ chức văn Công việc / Tiền bạc–tích lũy–nhà đất từ claim và quan hệ hiện có. Không thêm rule hoặc kết luận tài chính ròng; không dùng để khép cung trống hoặc hứa ngày hoàn thành12cung.

#### ND03 Công việc / Tài–Điền — đã triển khai và nghiệm thu 20/10

Đây là phần cụ thể đã khép của ND03 trong backlog19việc theo yêu cầu trực tiếp của chủ dự án; không phải lô rule mới. Không tự mở sang chủ đề khác.

- Đầu vào: `continuousReport`, `financeAssets`, claim/relations và văn hiện có; tái sử dụng [Tài–Điền1.37](FINANCE-ASSETS-1.37.0.md) và [trình bày1.37.1](FINANCE-PRESENTATION-1.37.1.md).
- Đầu ra: tổ chức chủ đề Công việc và Tiền bạc–tích lũy–nhà đất theo phương diện; ánh xạ câu → claim/điều chỉnh/nguồn; phiên bản trình bày mới chỉ áp báo cáo mới. Có thể triển khai biên tập ngay từ lời hiện có, không mở nghiên cứu/rule.
- Giữ lời trái chiều, điều kiện và ngoại lệ; không tạo kết luận ròng, ưu tiên hoặc quan hệ nhân quả ngoài nguồn. Phần chưa có phép phối hợp vẫn ghi rõ.
- Kiểm: nhóm Tuần/Triệt công việc, giữ/khó giữ, tạo dựng/hao hụt và nhóm chỉ có một mặt; bảo toàn claim/facts/relations192, G2, lưu/mở lại, mobile và PDF đại diện nếu cách dựng đổi. Chỉ kiểm phần ảnh hưởng.
- Dừng sau các chủ đề này; không sửa lịch sử hoặc publish Tật Ách. Gói cải thiện cách đọc, không làm đầy cung trống thiếu nguồn và không thay mục tiêu12cung.

**Kết quả ND03:** trình bày1.54.0/catalog1.51.0 đang phục vụ tại QA3062, checkout `.local/nd03-20261020/qa-final`.20 mẫu lời dùng chung được biên tập, nhóm lời nền/điều chỉnh/khác chiều đặt cạnh nhau; nguồn đóng mặc định. Phân biệt nguồn thu, giữ tiền và các mặt thừa hưởng/tự tạo/duy trì nhà đất. Mục tài chính dùng chung nằm tại Tài khi có lời, Điền dẫn chiếu; giữ bố cục bản cũ. Không đổi evaluator, G2, claim/facts/relations hoặc lịch sử.

192 mẫu: các cung trống trước/sau nguyên số (Quan28, Tài21, Điền59; các cung khác không đổi); **0 cung mới có lời, 0 bổ sung claim**,192 có thay đổi biên tập/tiêu đề/lời dẫn trong phạm vi, không có nghĩa192 đều sửa toàn văn. Hai cấu trúc mới qua form công khai kiểm hai lượt đầu/cuối: tổng4 bản và4 đơn mock QA, không đếm thành4 cấu trúc. Lời khóa không xuống API/HTML; PDF403 trước quyền, chéo phiên404. Không phải nghiệm thu SePay mới.

Lượt đầu20đạt/2lỗi (expected cơ bản cũ + câu/tiêu đề ND03); đối chiếu hợp đồng trước cập nhật, không đổi expected lịch sử. Sau sửa26/26; cuối27/27 tại5file. G2 riêng6/6; typecheck/build cuối đạt. Một lần script thiếu env và một lần sandbox DB bị chặn được ghi riêng, không coi lỗi sản phẩm. Không chạy toàn gate. Bảo toàn112file báo cáo/98ID và31file phiên; quyền/binding/link cũ, CMS34bài công khai giữ hash. Mobile360/390 đã xem; một PDF8trang đúng13đoạn, xem đủ8trang, không cắt/trắng bất thường. Sửa cuối chỉ vị trí web nên không xuất PDF lần hai.

[Toàn văn trước/sau, cách tạo mẫu và kết quả](../.local/nd03-20261020/ban-giao.md); [192](../.local/nd03-20261020/impact192.json); [kiểm cuối](../.local/nd03-20261020/tests-final.log); [quyền](../.local/nd03-20261020/g2-tests.log); [public](../.local/nd03-20261020/public-acceptance.json); [bảo toàn](../.local/nd03-20261020/file-preservation.json). Thời gian khoảng25phút,15:50–16:15. Dừng ND03; chưa publish Tật, Live tắt, không thêm kế hoạch.

#### Nghiệm thu lô 20/10

- QA3062 đang phục vụ **1.53.0 / interpretation-1.51.0**, cùng luồng công khai và bộ dựng nội bộ; `draft`, `review=null`, Live tắt. [Luồng khách](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so). [Bản đối chiếu cho admin A](http://127.0.0.1:3062/internal/readings?id=f181cfd3-50a6-48a2-b79d-f2bf78a8a6ec&experience=1&mode=detail); bản sao nội bộ giữ đúng frozen của hồ sơ công khai, không dựng nội dung riêng.
- Lượt đầu:616đạt/1lỗi ở5file. Lỗi `customer-basic-selection.test.ts` đòi `whole-topics-1.0.0`, thực tế từ1.51 đã là `whole-free-groups-1.1.0`. Chạy riêng trên checkout1.52 cũng1lỗi/2đạt, xác nhận kỳ vọng tồn tại sẵn. Không đổi expected lịch sử hoặc sửa ứng dụng để trở lại cơ chế cũ. Test này còn cần cập nhật hợp đồng riêng; **không gọi toàn bộ kiểm thử xanh**.
- Tập đúng phần ảnh hưởng/hợp đồng hiện hành:619/619 tại5file (`family-extension`, `phu-huynh`, `customer-editorial-catalog`, `customer-reading`, `content-batch`);6/6 G2 trong database thử riêng. Typecheck và production build mỗi phần một lượt đạt; không chạy toàn bộ gate. [Log kiểm tập trung](../.local/family-scope-20261020/tests-focused-final.log), [lỗi đối chứng baseline](../.local/family-scope-20261020/baseline-basic-selection.log).
- Hai hồ sơ qua form khách thật: tạo/lưu/tải lại nguyên văn; không có cookie nội bộ. API/HTML miễn phí không chứa lời khóa; PDF trước quyền403, đổi phiên đọc/PDF404. Hai đơn mock nội bộ cấp quyền nghiệm thu đúng bản, không phải giao dịch SePay. [Kết quả thao tác](../.local/family-scope-20261020/public-acceptance.json).
- Đọc toàn văn hai bản cuối; không làm mất lời Kỵ ở Huynh của mẫu Mùi, không lấy giàu có xóa bất hòa/xa cách. [Mobile360](../.local/family-scope-20261020/full-0-360.png), [mobile390](../.local/family-scope-20261020/full-1-390.png): đã xem ảnh, không tràn; căn cứ mở/đóng được.
- [PDF đại diện](../.local/family-scope-20261020/ban-doc-khach.pdf):8trang, đủ17đoạn và4ghi chú của bản lưu, đủ dấu; render và xem cả8trang, không thấy cắt chữ/trang trắng. Trang nguồn có219/220. Chỉ một PDF, không xuất cả bộ. [Đối chiếu văn bản](../.local/family-scope-20261020/pdf-check.json).
- Bảo toàn107file bản đọc gốc/bản sao nội bộ,95ID khác nhau,28file phiên có trước lượt này, không đếm archive/QA cũ thành hồ sơ mới. Hash engine/bảng nguồn/G2 và code ngoài danh sách thay đổi giữ nguyên. Database giữ nguyên16quyền cũ,13binding đơn cũ,18liên kết tài khoản,36bài/38phiên bản CMS với34bài công khai; sau nghiệm thu có thêm2quyền/2binding mock có nhãn. [Manifest](../.local/family-scope-20261020/preservation-final.json), [database](../.local/family-scope-20261020/db-after.json). Không sửa snapshot, quyền/hạn cũ, email hoặc thanh toán.
- Tệp ứng dụng đổi: `family-extension.ts` mới; `phu-huynh.ts` chỉ tách factory và cho nhận danh sách nhánh, output rule/fact cũ bằng baseline; `catalog.ts`, `derived.ts` nối nhánh; `customer-editorial.json` thêm văn có hash rule; `customer-report.ts` tăng phiên bản; `customer-pdf.ts` cho bản1.53 đi cùng cơ chế phân trang hiện có. Test mới `family-extension.test.ts`; không đổi renderer, không thêm rule Tật Ách.
- Thời gian thực tế khoảng27phút từ13:53 đến14:20 ngày20/10/2026. Lô kết thúc ở nhánh đủ căn cứ; ND08/10/11 và phần ND14 còn chặn giữ nguyên câu hỏi. Không mở G6, Zalo, Live hoặc một kế hoạch khác.

### Xử lý nguyên nhóm nghĩa của năm rule đang giữ riêng — đề xuất, chưa đổi G2

1. **Ngữ cảnh Mệnh–Thân:** `tanbien.life-body-role` (thực dùng HS40–41), `tanbien.life-body-same-trine` và `tanbien.life-body-other-trine` (TL181). Đề xuất cho nguyên các nhóm áp dụng vào phần Mệnh miễn phí, gồm toàn câu giới hạn và căn cứ. Đây là vai trò/quan hệ biểu tượng, không tự kéo lời của Quan/Tài/Phúc/Di/Phu vào miễn phí. Không hợp hai tác giả thành một kết luận hoặc tính hai lời như hai bằng chứng.
2. **Thân cư Quan:** `npl.life-body-career` — TH191–192. Giữ nguyên nhóm ở chủ đề công việc trong phần chi tiết, dẫn chiếu ngắn từ vị trí Thân. Không cắt riêng vế “gắn bó công danh” thành teaser thuận rồi giấu điều kiện/giới hạn.
3. **Thân cư Tài:** `npl.life-body-wealth` — TH191–192/224/241. Giữ nguyên nhóm ở tài chính trong phần chi tiết, cùng đầy đủ giới hạn không suy nghề/tài sản; không chuyển thành nét tính cách để được miễn phí.

**Cách xét quyền đề xuất:** phân bằng claim và quan hệ của bản lưu, không tên tiêu đề. Nếu một nhóm nối sang claim khác qua quan hệ điều chỉnh, xét cả thành phần liên thông; nhóm hỗn hợp chưa tách được về nghĩa tiếp tục giữ riêng, không cắt câu. Nội dung liên kết phải theo cùng quyền, không lộ lời ở căn cứ/JSON/PDF. Cần chủ dự án duyệt phân nhóm trước khi đổi policy cho bản mới; bản cũ không bị backfill hay đổi hạn. Đây là việc phân phối nội dung **đã có**, không phải năm phương pháp còn thiếu triển khai.

### Tật Ách — vấn đề cần quyết định, không đổi tên để coi là đã luận

**Hiện có:** vị trí cung, danh sách sao được chứng nhận, Tứ Hóa bản mệnh, Tuần/Triệt và trạng thái nguồn; dữ kiện đầy đủ khác thiếu dữ kiện. Có đường tra cứu và ghi phạm vi. **Hiện chưa có:** nhận định cá nhân được phát hành; toàn55 tiêu đề nguồn đã rà không có nhánh diễn giải thuộc phần B được chọn. Những lời cứu giải trong mục bệnh/tai họa vẫn là lời về sức khỏe/tai họa; không được chuyển thành “sức bền”, “cách ứng phó áp lực” hoặc lời thuận chung.

**Nội dung có thể tổ chức thêm từ nguồn đã có:** giải thích ngắn cung này dùng để xét phương diện nào, chỉ rõ dữ kiện của hồ sơ, dẫn bài Toàn thư và căn cứ; TB33/181, HS44/73 đủ cho giới thiệu phạm vi. Đây là kiến thức/tra cứu, **không phải luận cá nhân còn thiếu** và không làm đạt yêu cầu12 cung. TL160–163 và HS nhóm Phúc–Mệnh–Thân–Tật không đủ tạo một kết luận tâm lý hay phép phối hợp phi y khoa mới.

**Phần muốn bổ sung để đáp ứng luận cá nhân:** cần xác định câu hỏi cá nhân nào được phép trả lời trong cung này và nguồn/điều kiện cho đúng câu hỏi. Audit hiện có chưa chọn được mệnh đề như vậy ngoài các nội dung đã loại. Không đề xuất viết rule sức khỏe trong gói kế tiếp, không tự khẳng định tài liệu không bao giờ có phương pháp. Yêu cầu đầy đủ vẫn là hạng mục chưa đạt; chủ dự án cần quyết định cách giải xung đột phạm vi trước mở bán, không phải chỉ đồng ý một đoạn miễn trừ.

### Gói nội dung đã triển khai: ND01 + phần ND03 tại Thiên Di

**Tên:** “Thiên Di — ngoại cảnh và mưu sinh, hoàn chỉnh nhóm Vũ Khúc”. Chọn vì mệnh đề236 đã được audit chữ/ảnh và có cấu trúc thực trong tập hiện có; không chọn Nô hoặc VCD chỉ vì nhiều ca trống khi phương pháp còn chưa rõ. Đây là bước bổ sung cục bộ có mục tiêu khách hàng, không phải kế hoạch thêm từng sao vô hạn.

- **Giá trị:** người đọc cấu trúc Vũ tại Di Tứ Mộ thấy đúng lời về hoạt động buôn bán/tài lộc trong bối cảnh bên ngoài, cùng các mặt cạnh tranh/trở ngại đã có. Không xuất hai lần cùng ý thuận và không biến nó thành kết luận tài chính toàn đời. Tổ chức đoạn dùng chung cho mọi hồ sơ phù hợp, không viết theo1992/Kim Thoa.
- **Mẫu có sẵn:** lọc trực tiếp snapshot trong `baseline192`, không chạy engine, thấy6 cấu trúc: chỉ số32/39 ở Sửu Vũ–Tham;45/110 ở Thìn Vũ;119 ở Mùi Vũ–Tham;177 ở Tuất Vũ. Ở lượt lập backlog đây chỉ là ứng viên; lượt triển khai19/10 đã chạy và xác nhận cả sáu khớp rule mới. Cả sáu đã có `di-vu-alone` hoặc `di-vu-tham`, hai ca32/39 còn `di-hoa-ky`. Không báo sẽ mở thêm sáu cung trống.37 ca Di chưa có lời, trong đó32 VCD, vẫn ở ND04/cổng nội dung; không bị giấu đi sau gói này.
- **Phạm vi kỹ thuật:** tái sử dụng evaluator/trace/validation, thêm mệnh đề nguồn236 riêng nếu đặc tả triển khai xác nhận không trùng hoàn toàn; ghép nghĩa với hai nhánh175–176 bằng quan hệ bổ sung, không tự gọi thay thế/điều chỉnh. Giữ mọi ngoại lệ cũ. Nếu không có ý mới ngoài lời đã có, chỉ bổ sung căn cứ/tổ chức đoạn, không tạo claim trùng để tăng số. Rà tương tác với56 nhánh Di hiện hành trong bằng chứng catalog, không viết lại56 nhánh hay mở thêm nguồn.
- **Bước đầu hữu hạn:** mở lại đúng ảnh235–236 và175–176 để khóa bảng điều kiện/giới hạn trong đặc tả coding; dùng audit đã có, không đọc lại§19 hoặc toàn sách. Đầu20.12 yêu cầu xét Mệnh/Thân/Di/Tài/Quan phải được giữ là ngữ cảnh “cần xem”, không biến thành một kết luận phối hợp đã thực hiện. Không thêm đơn thủ/độ sáng hoặc cổng tránh TT/sát nếu đúng đoạn không cho phép.
- **Nghiệm thu:** đúng bốn chi, sai cung/chi, danh sách thiếu/bất nhất; đọc toàn đoạn6 ca ứng viên, hai mẫu hồi quy và đối chứng không khớp; giữ vế khó/ngoại lệ và nguồn từng phần; so chênh lệch192 chỉ ở danh sách rule/nhóm được duyệt, tạo–lưu–mở lại đúng bản, scope G2 và lịch sử không đổi. Chỉ kiểm phần chịu ảnh hưởng; mẫu fixture không gọi là engine thật.
- **Ước lượng:** đặc tả/đối chiếu đúng đoạn **0,5–1 giờ**; lập trình **2–3 giờ**; biên tập/đọc bản cuối **0,5–1 giờ**; kiểm thử và lưu/mở lại **1,5–2 giờ**: tổng **4,5–7 giờ làm việc**. Chờ chủ dự án duyệt văn tách riêng, không có thời gian chờ tài khoản/provider. Đây là ước lượng gói này, không phải ngày hoàn thiện12 cung. Đây là ước lượng trước triển khai; kết quả và thời gian thực tế ghi ở mốc nghiệm thu dưới đây.
- **Điểm dừng:** một bản nội dung ứng viên có chênh lệch được giải thích, đủ căn cứ và không trùng nghĩa; danh sách ca chưa phục vụ vẫn hiện rõ. Không mở sang M06, Phủ–sát, VCD, phân cách, quyền miễn phí hoặc G6.

### ND01 — đặc tả khóa trước coding, 19/10/2026

Đã kiểm hash đúng bản TB277 và đọc chữ/ảnh PDF175,176,235,236 trong lượt triển khai. Ảnh quyết định lưu tại `.local/nd01-20261019/source/`. Câu cuối§20.12 có hai ý **buôn bán giỏi** và **tài lộc ngày càng tăng tiến**, khác lời thuận buôn bán và lợi ích đi xa của§10.4, đồng thời không lặp nguyên câu trước khó/sau dễ của Vũ–Tham§10.4/10.9. Vì có ý thêm xác định được, triển khai một mệnh đề bổ sung, không phải phép thay thế hay cứu giải.

- Điều kiện nguồn: **cung Thiên Di** ở **Thìn/Tuất/Sửu/Mùi**, có **Vũ Khúc tọa thủ**; không yêu cầu đơn thủ, miếu/vượng/đắc, giới tính, can hoặc vắng TT/Kỵ. Cổng kỹ thuật: cung/địa chi duy nhất hợp lệ, danh sách chính tinh đầy đủ và toàn vẹn, sao bản mệnh. Thiếu/bất nhất → unknown; sai cung/chi hoặc vắng Vũ trong dữ kiện đầy đủ → không khớp. Không mượn đối cung.
- Ngữ cảnh nguồn: đầu§20.12 yêu cầu xét Mệnh, Thân, Di, Tài, Quan; giữ như giới hạn của lời cục bộ, không giả thành năm cung đã được tổng hợp. Các gạch có dấu cộng trước câu này là những cấu trúc khác, không lấy lượng từ “nhiều Tài tinh” hoặc “sáng” ở đó ghép vào câu Vũ–Di. Câu cuối20.13 “tất cả mọi sao” nằm dưới mục kỹ nghệ, không chuyển ngược thành điều kiện20.12.
- Kết quả được phép: mô tả truyền thống về khả năng buôn bán và chiều tăng tiến tài lộc trong phạm vi Di; không xác nhận năng lực thật, chọn nghề, định năm/tuổi hoặc tài chính toàn đời. Không xóa Kỵ, TT hay vế cạnh tranh.
- Phối hợp trình bày: nhóm mới + `di-vu-alone` giữ vế lợi đi xa; nhóm mới + `di-vu-tham` giữ trước khó/sau dễ và cạnh tranh. Một ý buôn bán chung chỉ xuất một lần; nguyên claims/nguồn vẫn ở căn cứ. Rule mới đứng riêng vẫn có văn hoàn chỉnh. Mọi lời khác ở Di giữ nguyên, kể cả Kỵ hai mẫu32/39.
- Expected lập từ nguồn trước chạy: sáu snapshot ứng viên32/39/45/110/119/177 đủ cấu trúc, ngoài tập ấy trong192 không khớp; cả bốn chi được hỗ trợ. Thiếu chứng nhận, Vũ sao lưu, danh sách sai/thiếu hoặc trùng cung → không được phát claim. Đổi trạng thái sáng/hãm, có Kỵ/TT **không tự chặn câu cục bộ này**; không đồng nghĩa các yếu tố ấy đã được tổng hợp. Fixture thay dữ kiện chỉ là kiểm hợp đồng, không phải lá số engine hợp lệ.
- Phiên bản đã triển khai: catalog `interpretation-1.46.0`, trình bày `1.48.0`, phương pháp cục bộ `tanbien-di-vu-tu-mo-1.0.0`, phối hợp bài `continuous-report-1.6.0`. G2 `menh-free-1.0.0` giữ nguyên. Không ghi đè bản cũ, status=draft/review=null.

### ND01 + ND03/Thiên Di — nghiệm thu thực chạy 19/10/2026

**Đã hoàn thành trên QA3062, dừng tại nhóm này.** Đây là bổ sung nghĩa cục bộ và phối hợp trình bày, không phải quy tắc chọn lời thắng, thay thế hay tổng hợp toàn cung. Rule `tanbien.di-vu-tu-mo` vẫn `draft`, `review=null`; không coi QA là phê duyệt chuyên môn.

- **Ảnh hưởng192:** 0 cung trước trống nay có lời; **6 cung đã có lời được bổ sung/biên tập**,186 không có lời mới. Cấu trúc: Vũ đơn thủ ở Thìn (45/110), Tuất (177); Vũ–Tham ở Sửu (32/39), Mùi (119). Sáu mẫu engine thật được tính lại để xác nhận cấu trúc, không gọi fixture thay dữ kiện là lá số thật. Hai mẫu32/39 giữ nguyên toàn đoạn Hóa Kỵ.37 Di chưa có lời vẫn còn; không dùng thêm một claim để báo hoàn thiện12cung.
- **Chênh lệch giải thích:** chỉ thêm claim/fact/trace của rule mới và gom với `di-vu-alone`/`di-vu-tham`. Toàn bộ rule cũ, claim cũ, facts/traces cũ, relations, phần Tài–Điền, nội dung các cung khác và phân nhóm G2 so sâu bằngID/dữ liệu vẫn bằng baseline. Ca không khớp có thêm trace/ID căn cứ phạm vi của rule mới, không thêm lời. [Kết quả192 và toàn đoạn trước/sau6mẫu](../.local/nd01-20261019/impact192.json).
- **Ví dụ Sửu Vũ–Tham:** trước: “Vũ Khúc–Tham Lang tại Thiên Di được liên hệ với buôn bán, trước khó sau dễ nhưng cạnh tranh ráo riết. Trở ngại đi cùng mặt thuận; chưa xác định thời điểm chuyển biến.” Sau: “Vũ Khúc tại Thiên Di ở Thìn, Tuất, Sửu hoặc Mùi được mô tả là buôn bán giỏi và tài lộc ngày càng tăng tiến. Khi Tham Lang đồng cung, lời về tổ hợp còn nêu trước khó sau dễ và hay gặp cạnh tranh ráo riết, không xác định thời điểm chuyển biến. Đây là lời riêng về hoạt động buôn bán khi xét môi trường bên ngoài, chưa xác định sinh kế hoặc tài chính toàn đời; còn cần xem Mệnh, Thân, Tài Bạch và Quan Lộc.” Lời Kỵ ở đoạn kế tiếp không bị xóa/giảm. Đã đọc lại toàn cụm Di cả6mẫu; chưa tuyên bố đọc lại toàn bài192mẫu.
- **Lưu và mở:** tạo6bản mới bằng API nội bộ thật, gọi lại cùngID không đổi hash; mở/tải lại bằng trình duyệt và so toàn bộ đoạn với bản lưu,6/6 đúng nguyên văn. Không sao chép vào bản cũ. [Danh sách6link/ID/hash](../.local/nd01-20261019/saved.json); [mẫu Sửu có Kỵ](http://127.0.0.1:3062/internal/readings?id=9d41c2f8-525d-4257-b794-f51b6095b618&experience=1&mode=detail#natal-palace-6); [mẫu Thìn đơn thủ](http://127.0.0.1:3062/internal/readings?id=f521517c-51b9-453f-8e4c-acd97eaf4ab2&experience=1&mode=detail#natal-palace-6). Link nội bộ cần quyền; bản khách mới vẫn khóa Di theo G2 nếu chưa có quyền đầy đủ.
- **Mobile:** mẫu32 tại360/390px không tràn ngang; mở/đóng căn cứ giữ đủ hai nguồn175/236. [Ảnh360](../.local/nd01-20261019/mobile-360.png), [ảnh390](../.local/nd01-20261019/mobile-390.png), [căn cứ390](../.local/nd01-20261019/mobile-evidence-390.png), [biên bản kiểm](../.local/nd01-20261019/acceptance.json).
- **Kiểm liên quan:**369test khác nhau thuộc8file có kết quả đạt còn hiệu lực qua các lượt, **không phải một lượt toàn gate**. Lượt đầu327đạt/8bỏ do beforeAll của test mới thiếu `place`; lượt tiếp28đạt/8bỏ do `place` rỗng. Sửa đầu vào fixture theo schema hiện có, không đổi expectednguồn; testND01 cuối8/8đạt, gồm6engine và2nhóm fixture âm/thiếu dữ liệu. G2tích hợp6/6đạt trênDBriêng sau sandbox chặnloopback ở lượt đầu. Typecheck đầu phát hiện optional `projectScope` trong test; sửa truy cập optional, typecheckcuối đạt, test8/8chạy lại đạt. Productionbuild đạt. Không chạy gate toàn bộ,E2Etoàn bộ hoặcPDF.
- **Lỗi công cụ nghiệm thu, không phải lỗi ứng dụng:** scriptdiff đầu đọc nhầm trường không tồn tại; sau đó cần tách trace của rule mới khỏi phép so phần cũ. Đã sửa phép kiểm nhưng giữ strictcompare toàn bộ phần cũ. APIlogin đầu dùngOriginlocal không nằm trong allowlist nội bộ nên403; dùng đúng OriginHTTPSđãcho phép thì đạt, không nới quyền. KiểmUIđầu tìm `summary` trong component thực dùngbutton nêntimeout; selector đúng đã mở/đóng được căn cứ ở cả360/390. Các log từng lượt nằm tại `.local/nd01-20261019/`; không tính lượt lỗi là đạt.
- **Bảo toàn:**77tệp kho hiện hữu (31internal +46trial, trong đó64tệp báo cáo,13metadata phiên) nguyên hash;14tệp engine/quyền/thanh toán trong manifest và295tệp code được bảo vệ khớp trước/sau cảroot vàcheckouttriển khai. [Manifest kết quả](../.local/nd01-20261019/preservation-final.json). Không migrationDB, không thay grant/hạnquyền;6bản nội bộ mới tách riêng. Web/worker3062 cùngcheckout/cấu hình/kho cũ,workerG5cũ đã dừng;3070 không đổi. Livefalse. CheckoutG5giữ nguyên để rollback.
- **File ứng dụng thay đổi:** `phuc-di-content.json`, `phuc-di.ts`, `catalog.ts`, `continuous-report.ts`, `customer-report.ts`, `customer-editorial.json`; thêm `tests/di-vu-tu-mo.test.ts`. Không sửa giao diện, engine, G2 hoặcPDF. Chỉ cập nhật backlog này, không tạo kế hoạch khác.

**Thời gian thực tế:** khoảng18phút,14:30–14:48ngày19/10/2026, gồm đối chiếu đúng4ảnh, đặc tả, triển khai, biên tập, test, build và nghiệm thuQA. Không có thời gian chờ tài khoản. ND01đóng; ND03chỉđóng phầnDi. Không mởND02/M06/Phủ/G6/Zalo/Live. Yêu cầu đủ nội dung12cung vẫn chưa hoàn thành và không bị thu hẹp.

### ND04 — Thiên Di vô chính diệu: đặc tả khóa trước coding, 19/10/2026

Phạm vi hữu hạn: không mượn lời Mệnh sang Di. TB PDF180§10.36 viết: “Coi Chính diệu xung chiếu như Chính diệu tọa thủ.” Ảnh180 chỉ có câu này dưới tiêu đề Vô Chính diệu; câu tai nạn phía trên thuộc§10.35, không ghép làm ngoại lệ. PDF33§2.6–2.11 định nghĩa vị trí sao thật/đơn thủ/đồng cung/hội hợp và sáng/hãm, không chỉ cách định lại trạng thái khi mượn. PDF174 đầu chương xác nhận Mệnh–Di xung chiếu. Tệp277trang/hash `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`. Đối chiếu ảnh33,174–177,180; chỉ những câu trực tiếp cho các tổ hợp dưới, không đọc lại toàn sách.

**Phần đủ để triển khai độc lập:** §10.36 cho xét chính diệu của Mệnh (cung cho, đối diện thật sáu địa chi) tại Di VCD (cung nhận lời). Chỉ xét toàn bộ cặp chính diệu bản mệnh, không chọn một sao thuận từ cặp; không chuyển phụ tinh, Tứ Hóa, Tuần/Triệt, trạng thái hoặc lời đang luận tại Mệnh. Dùng các **lời về Thiên Di** không có điều kiện địa chi/sáng-hãm trong chính câu: Cơ–Lương175§10.6/177§10.12; Cơ–Cự175§10.6; Đồng–Lương175§10.3/177§10.12 (177 xác nhận riêng, tránh suy dấu phẩy175); Đồng–Cự175§10.3; Vũ–Tham175§10.4/176§10.9; Liêm–Tham174§10.2/176§10.9. Đây là sáu nhánh có danh sách cho phép rõ, không là cơ chế chuyển cả catalog.

- Đầu vào: Thiên Di/Mệnh duy nhất, địa chi đúng đối cung, danh sách chính tinh complete và integrity14sao/12cung, sao scope origin. Di phải thực sự không có chính tinh. Cặp ở Mệnh phải đúng cả hai sao; thứ tự không quan trọng. Sai cấu trúc → không khớp; thiếu/bất nhất chứng nhận, cung/chi hoặc sao → unknown. Không sửa snapshot để giả đặt sao tại Di.
- **Trạng thái dùng vị trí nào:** sáu lời trên không dùng trạng thái/địa chi, nên phép này không tính lại sáng/hãm ở Di và cũng không mang brightness Mệnh làm điều kiện. Không giải đáp hộ câu hỏi vị trí của các nhánh khác. Địa chi Mệnh/Di chỉ dùng xác minh quan hệ đối cung.
- Kết quả: giữ nguyên cả mặt thuận/khó của lời Di đã biên tập có căn cứ. Đồng–Cự giữ thị phi/tranh chấp và lời nói được tin không đồng nghĩa mọi lời đều đúng; Vũ–Tham giữ cạnh tranh/trước khó sau dễ, không định thời điểm; Liêm–Tham giữ bất lợi/tranh chấp nhưng không quy kết người thật. Không thêm sinh tử/phẩm hạnh hoặc nghề/lời khuyên. Mỗi đoạn ghi rõ cặp đang xung chiếu, không nói sao tọa Di thực tế.
- Ngoại lệ: sáu câu không nêu điều kiện TT/Kỵ riêng; không tự chế gate vắng sát tinh/TT. Những lời phụ tinh thật tại Di và điều chỉnh Mã–TT/Kỵ hiện hành chạy nguyên trạng; không chuyển phụ tinh ở Mệnh thành đồng cung Di, không dùng lời mới để xóa chúng. ND01 chỉ Vũ thật tọa Di, không chạy bằng Vũ mượn.
- **Giữ nghiên cứu:** Đồng–Âm Tý/Ngọ, Cơ–Âm Dần/Thân, Dương–Lương/Dương–Cự phụ thuộc lời vị trí; Nhật–Nguyệt có ngoại lệ Kỵ/“Tuần, Tuần” chưa chốt nơi xét và chữ nguồn. Chưa chọn địa chi cung cho hay cung nhận để xuất lời thuận/nghịch. Không mở nhánh khác ngoài sáu tổ hợp vừa đối chiếu.
- Expected trước chạy: bộ192 có33DiVCD, trong đó32trước không có đoạn và1đã có phụ tinh; không đánh đồng33với32. Sáu tổ hợp đủ điều kiện nằm ở indices2,5,6,12,26,27,64,66,76,92,96,120,132,140,149,152,157,165,185 (19 tổng); nhóm còn lại14 không thêm lời. Sẽ phân mẫu có phụ tinh hiện hữu khi đo đối chiếu, không hứa19cung trống. Ca phản chứng: Di có chính tinh; đối diện sai/cặp khác; thiếu danh sách; sao lưu; đảo cặp không đổi; không chuyển Kỵ/TT từ cung cho.
- Phiên bản đã triển khai: trình bày1.49.0/catalog interpretation-1.47.0; phương pháp `tanbien-di-vcd-pairs-1.0.0`; rule draft/review=null; G2/ND01/ngũ hành và các quan hệ cũ nguyên trạng. Không giả đã hoàn thiện toàn bộ DiVCD hoặc12cung.

### ND04/Thiên Di — kết quả triển khai và điểm dừng 19/10/2026

**Khép sáu nhánh đã đủ điều kiện; chưa khép toàn bộ Thiên Di vô chính diệu.** Giữ quy tắc nhận ảnh hưởng riêng của§10.36 và lời cặp **ở chương Thiên Di**, không sao chép lời Mệnh hoặc dùng NPL để lấp điều kiện. Đã cập nhật đặc tả Phúc–Di hiện có; không tạo kế hoạch mới.

- **Mẫu số:**192snapshotriêng;33có DiVCD, gồm32trước chưa có đoạn +1đã có Thiên Mã. Trong **32ứng viên:18nay có lời,14vẫn chưa có lời**. Mẫu152 ngoài32được bổ sung Đồng–Lương và giữ nguyên Thiên Mã. Tổng19mẫu có claimmới,173không có claimmới. Cả192giữ sâu toàn bộ claim/fact/trace cũ, relations, lời ND01, tài chính và phần các cung khác; G2project/capturekhông đổi. Không dùng19claim để đánh giá đầy đủ12cung. Di có đoạn tăng155→173/192, còn19không có đoạn (14VCD +5cấu trúc khác). [Kết quả và danh sách32/33](../.local/nd04-di-20261019/impact192.json).
- **Sáu cấu trúc áp dụng chung:** Cơ–Lương3, Cơ–Cự5, Đồng–Lương2, Đồng–Cự3, Vũ–Tham3, Liêm–Tham3. Các số là mẫu riêng trong192, không phải số khách hàng toàn hệ thống. Nhánh không ràng buộc giới tính, can hay bảng trạng thái; không viết theo tên/ID/ngày sinh. Không chuyển sao vàoDi, không gọi đối cung là tam hợp, không mởVCDởPhúc/Tài/cungkhác.
- **Trước/sau mẫu12:** trước chỉ có “Phần này hiện chưa có luận giải.” Sau: “Thiên Di không có chính tinh. Cặp Vũ Khúc–Tham Lang xung chiếu từ cung Mệnh được liên hệ với buôn bán, trước khó sau dễ nhưng cạnh tranh ráo riết. Trở ngại đi cùng mặt thuận; chưa xác định thời điểm chuyển biến.” Không chạy ND01 bởi Vũ đang ởMệnh, không tọaDi. Mẫu152 giữ nguyên: “Thiên Mã tại Thiên Di được mô tả là di chuyển nhiều và được mến chuộng.” và thêm đoạn Đồng–Lương, không coi hai đoạn là phép hợp nhất.
- **14mẫu còn chặn đúng điều kiện:** Nhật–Nguyệt5 (3/51/63/72/147): cần chốt nơi xétKỵ/TT và chữ “Tuần, Tuần”; Đồng–Âm3 (34/127/139): chọnTýhayNgọ của cung cho/nhận sẽ đổi chiều lời175–176; Cơ–Âm3 (37/95/188): Dần/Thân đổi vế đố kỵ/giới hạn xa nhà; Dương–Lương1 (40) và Dương–Cự2 (164/169): chưa có phép chuyển điều kiện vị trí của các lời sao riêng thành lờiDiVCD. Câu180 và định nghĩa33 chưa trả lời các lựa chọn ấy. **Không tự chọn vị trí, chuyển ngoại lệ hay xuất lời thuận thay câu khó.** Không tìm thấy lời đời sống riêng tại180 ngoài chỉ dẫn xét chính diệu xung chiếu; không viết một đoạn chung thay phương pháp. Đây là phần nguồn/đặc tả còn mở, không gọi thiếu dữ kiện lá số.
- **Rule/căn cứ:** `tanbien.di-vcd-{co-luong,co-cu,dong-luong,dong-cu,vu-tham,liem-tham}`; `diVcdFacts` vào evaluator sẵn có. Mỗi đoạn giữ mộtclaimriêng và đủfacts choDi/Mệnh,quan hệ đối cung; điều kiện/vị trí/giới hạn trong căn cứ. Nhánh chính tinh thật và lời phụ tinh không bị thay. Rule draft/review=null. Nội dung mới1.49.0/catalog1.47.0; ND01vàcontinuous1.6không đổi.
- **Kiểm thực chạy:**5file nội dung344/344đạt ở lượt đầu. Sau chỉnh câu dẫn cho tự nhiên và bỏ một assertion thừa trong test mới, chạy lại3filechịuảnh hưởng24/24đạt. Sáu caengine thật xác nhận6cặp;3nhóm fixture kiểmDi cósao/cặp khác,thiếu/bất nhất/sao lưu/đối cung sai,đảo thứtự/trạng thái/TT. Fixture không gọi là engine thật. ScopeG2 trênDBriêng6/6đạt; tổng350testkhácnhau/6file có kết quả còn hiệu lực qua các lượt, không phải gate toàn bộ. Typecheck/build1lượt đạt. Không sửa expectednguồn/historical; không chạy toànE2EhoặcPDF.
- **Lỗi công cụ đã ghi:** lần gọi CLItsx đầu bị sandbox chặnIPC, chuyển sang`node --import tsx`; scriptdiff đầu lỗi chuẩn hóa một trường optionalundefined, sửa normalizer rồi đối chiếu192đạt. Trích chữ bằngpdftotext hệ thống không có, dùng lớp chữ033/180đãlưu của đúngPDF và đối chiếu ảnh mới. Không coi những lỗi công cụ này là lỗi phương pháp/ứng dụng hoặc lượt đạt.
- **QA thật:** tạo4bản mới qua API nội bộ, retry cùngIDgiữhash; mở/tải lại4/4 nguyên văn toàn bộđoạn theo bản lưu (mẫu12Vũ–Tham,5Liêm–Tham,2Cơ–Lương,152Đồng–Lương+Mã). Khách khôngcookie tạoAPI401. Mobile360/390không tràn, mở/đóng căn cứ có175/180, không nhầm sao xung chiếu là tọaDi. [MẫuVũ–Tham](http://127.0.0.1:3062/internal/readings?id=7ed6fb5a-bfd2-4855-b842-9caad3d5fdec&experience=1&mode=detail#natal-palace-6) · [Mẫuđã cóMã](http://127.0.0.1:3062/internal/readings?id=c807979e-6f03-4584-8e1e-a3c5a5b3cf51&experience=1&mode=detail#natal-palace-6) · [4link/ID/hash](../.local/nd04-di-20261019/saved.json) · [ảnh360](../.local/nd04-di-20261019/mobile-360.png) · [ảnh390](../.local/nd04-di-20261019/mobile-390.png) · [biên bản](../.local/nd04-di-20261019/acceptance.json). Linknội bộ cầnquyền; Di vẫn khóa với kháchG2chưa có quyền đầy đủ.
- **Bảo toàn:**381tệp code/kho trongmanifesttrước sửa khôngđổi, gồm73bản báo cáo hiện hữu;4bản mới riêng. Codeđược bảo vệ trongcheckout triển khai cũngkhớp. [Hashkếtquả](../.local/nd04-di-20261019/preservation-final.json). KhôngmigrationDB/đổi quyền/hạn,khôngchạm3070. Web/worker3062cùngcheckout/kho chính;dừng đúngworkerND01cũ;Livefalse. CheckoutND01được giữđểrollback. Đổi4fileứngdụng(`phuc-di.ts`,`catalog.ts`,`customer-report.ts`,`customer-editorial.json`),thêm`di-vcd.ts`vàtest;khôngđổi engine,renderer,G2,ND01,PDF hoặcToànthư.

**Thời gian:** khoảng13phút,15:37–15:50ngày19/10/2026,khôngcóthờigianchờchủdựán. Dừng tại sáu nhánhDiVCDđãđủ;khôngmởG6/cungkhác. Phần14mẫu còn chặn đã ghi câu hỏi cụ thể, không suy diễn để tăng độ phủ. Nội dung12cung vẫn là hạng mục chưa hoàn thành trước mở bán.

### ND04 — đối chiếu tiếp14mẫu, đặc tả trước coding 19/10/2026

Đọc lại chữ và ảnh đúng PDF33,175,176,177,180 của cùng bản277trang/hash `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`; dùng ảnh đã xác minh ở `.local/nd04-di-20261019/source/`. Không dùng sáu nhánh trước làm bằng chứng giải các nhánh này; không mượn NPL hoặc ví dụ cung khác. Kết luận nguồn theo từng nhóm:

- **Đồng–Âm — 3mẫu34/127/139:**175§10.3 và176§10.8 phân Tý (trợ giúp/kính trọng/buôn bán) với Ngọ (cạnh tranh/ghen ghét/bất lợi).180§10.36 cho coi chính diệu xung chiếu như tọa thủ, nhưng không nói giữ chi của sao thực hay xét chi cung nhận.33định nghĩa trạng thái ở vị trí sao được an, không nói xử lý vị trí giả khi mượn.34/127:MệnhTý→DiNgọ;139:MệnhNgọ→DiTý. Hai lựa chọn đảo câu; **vẫn chặn, không coding**.
- **Cơ–Âm — 3mẫu37/95/188:**175§10.6 nối176và176§10.8: Thân buôn bán/được mến; Dần vẫn buôn bán nhưng đố kỵ và không nên xa lâu. Cả3MệnhDần→DiThân. Chưa có câu quy định lấy chi nào khi chuyển; không bỏ vế khó bằng chọnThân hoặc ghép hai vế như một kết luận đã phối hợp. **Vẫn chặn**.
- **Dương–Lương — mẫu40:**175§10.5 và177§10.12 viết lời tọa thủ theo địa chi, không có đoạn cặp này độc lập khỏi vị trí trong phạm vi đã định vị. MệnhMão→DiDậu làm khác lời Thái Dương;177không đưa hợp đồng chuyển trạng thái. **Vẫn chặn**, không mượn lời sáu cặp.
- **Dương–Cự — 2mẫu164/169:**175§10.5 có nhóm địa chi củaDương;177§10.10 là Cự **đơn thủ**, không lấy nó cho cặpCự–Nhật. MệnhDần→DiThân và chiều ngược sẽ đổi lờiDương. **Vẫn chặn** vị trí xét; không tự tạo lời tổ hợp từ hai sao.
- **Nhật–Nguyệt — 5mẫu3/51/63/72/147:**175§10.5 và176§10.8 đều có câu nền riêng không có chi hoặc nhãn sáng/hãm: ra ngoài lợi ích hơn ở nhà, gần nơi quyền quý, được tôn phục. Câu kế tiếp “Nếu gặp Tuần, Tuần án ngữ hay Kỵ đồng cung lại càng rực rỡ” là **tăng thêm** trên nền, không viết nền chỉ đúng khi có/vắng yếu tố ấy. Có thể triển khai **câu nền độc lập** bằng chính180§10.36 + câu nền175/176; đây là quyết định tách phạm vi sau đối chiếu, không phải đã giải được ngoại lệ. Không yêu cầu vắngTT/Kỵ để xuất nền, cũng không suy chúng đã có tác dụng. Câu về chôn cất cuối đoạn vẫn ngoài phạm vi.

**Vị trí trạng thái/ngoại lệ:** chưa có căn cứ chọn vị trí cho bốn nhóm đầu. Riêng nền Nhật–Nguyệt không dùng trạng thái hoặc chi, nên không cần giả quyết định vị trí. Vế tăng thêm chưa rõ (a) “Tuần, Tuần” trong đúng bản, không tự sửa thànhTriệt; (b) án ngữ/Kỵ đồng cung xét ởMệnh cócặp thật hayDi nhận; (c) cách nối vào lờiKỵ đang xuất tạiDi. Giữ ngoại lệ nghiên cứu và giới hạn cục bộ ngay trong đoạn nền; **không gọi là đã điều chỉnh Kỵ/TT**. Không đọc thêm chương khác để tìm bằng mọi giá.

**Hợp đồng nhánh nền:** ID `tanbien.di-vcd-nhat-nguyet-base`, phương pháp `tanbien-di-vcd-sun-moon-base-1.0.0`; Di thực sự không chính tinh, cặpNhật–Nguyệt bản mệnh tạiMệnh đối sáu chi, principalcomplete/toànvẹn. Dùng cùng evaluator/factsđốicung hiện có, không sửa sáu nhánh cũ. Kỵ/TT không làgate của **nền**, thiếuTứHóa không được hiểu thành vắngKỵ; không chuyển phụ tinh/brightness/saoMệnh sangDi. Lời phụ tinh/ngoại lệ cũ chạy nguyên trạng; phần nền không tự sửa `di-hoa-ky`. Bảnmới1.50.0/catalog1.48.0; phươngpháp6cặp1.0.0vàND01khôngđổi. Draft/review=null.

**Expected trước chạy:**5mẫu trên thêm một nền;9mẫu khác vẫn không lời. Trong192:5trước trống nay có lời,0đã có lời được bổ sung ở lượt này;187không claimmới. TổngND04:23/32ứng viên banđầu cólời,9còntrống;5mẫu có nền mới vẫn chưa được giải ngoại lệ tăng thêm. Testcặpđảo thứtự,Di cósao/cặp khác,thiếu/bấtnhất danh sách,không dùng sao lưu;TT/Kỵ có/thiếu không tạo tăng sáng hoặcxóa lờiKỵ. Nguyên dữliệuND01/sáunhánh/claimphụtinh/relations/G2/historical giữ nguyên.

### ND04 — kết quả lượt tiếp 14 mẫu, 19/10/2026

**Đã triển khai:** chỉ nền Nhật–Nguyệt `tanbien.di-vcd-nhat-nguyet-base`, phương pháp `tanbien-di-vcd-sun-moon-base-1.0.0`, dùng evaluator/facts hiện hành. Đây là lời cặp chính diệu xung chiếu về Di, **không phải điều chỉnh Tuần/Kỵ hay kết luận toàn cung**. Trình bày1.50.0/catalog1.48.0, draft/review=null. Sáu nhánh cũ và phương pháp ND01 giữ nguyên. Không thay trạng thái hoặc chuyển sao trong snapshot; không tạo lời tổ hợp Dương–Cự/Dương–Lương từ lời đơn sao.

**Mỗi nhóm đã có điểm dừng:** Nhật–Nguyệt5 mẫu triển khai nền, giữ riêng ngoại lệ tăng thêm; Đồng–Âm3, Cơ–Âm3, Dương–Lương1, Dương–Cự2 vẫn chặn đúng điều kiện được liệt kê ngay trên. Không còn nhóm nào trong14 mẫu chưa được xử lý ở lượt đối chiếu này. Chín mẫu chưa có lời là thiếu đặc tả vị trí/phạm vi, không phải thiếu dữ kiện. Chưa có căn cứ chọn cung cho hoặc cung nhận để xét trạng thái/địa chi; không tiếp tục đọc chương khác trong gói này.

**Đối chiếu192 thực chạy:**5 cung trước trống nay có lời (chỉ số0-based3/51/63/72/147); **0 cung đã có lời được bổ sung** ở lượt này;187 mẫu không claim mới;9/14 ứng viên vẫn trống. Cộng với lượt ND04 trước:23/32 khoảng trống DiVCD ban đầu đã có ít nhất một lời; mẫu152 vốn có Thiên Mã được bổ sung ở lượt trước, không cộng vào23. Tổng Di có ít nhất một đoạn178/192, còn14 trống (9VCD và5 cấu trúc khác), **không phải178 báo cáo Thiên Di hoàn chỉnh**. Cả5 mẫu có nền mới chưa giải vế tăng thêm Tuần/Kỵ. [Chênh lệch192](../.local/nd04-di-followup-20261019/impact192.json) so ID và toàn dữ liệu claim/facts/trace cũ, mọi relations/finance, câu Di cũ, nội dung cung khác và capture G2 đều bằng baseline; không chỉ so số lượng.

**Trước/sau mẫu3 (engine thật, MệnhSửu → DiMùi):**

- Trước: “Phần này hiện chưa có luận giải.”
- Sau: “Thiên Di không có chính tinh. Cặp Thái Dương–Thái Âm xung chiếu từ cung Mệnh gắn với lợi ích khi ra ngoài hơn ở nhà, thường gần nơi quyền thế và được tôn phục. Đoạn này chỉ xét lời nền, chưa áp dụng vế tăng thêm khi gặp Tuần hoặc Hóa Kỵ cho sao xung chiếu.”

Mỗi câu trong đoạn mới giữ claim ID, rule, fact chỉ đúng cặp bản mệnh thực tại Mệnh và cung Di trống, đường dẫn bằng chứng trong snapshot, trang175–176 và180. Chưa áp dụng ngoại lệ không có nghĩa ngoại lệ vắng mặt; không gọi lời này là hóa giải Kỵ. Kiểm fixture có Kỵ thật tại Di giữ nguyên claim Kỵ và thêm nền riêng, không xóa hay thay thế.

**Kiểm thử thực chạy, không mở gate toàn hệ thống:**

- Lượt1:350/350 test,6 file (`di-vcd-sun-moon`, `di-vcd`, `di-vu-tu-mo`, `phuc-di`, `customer-editorial-catalog`, `customer-reading`),0 fail/skip. Sau đọc lại test, phát hiện fixture xóa nhầm tên trường chứng nhận Tứ Hóa nên chưa thực sự kiểm tình huống thiếu chứng nhận; sửa fixture sang `chart.natalTransformations`, thêm assertion giữ claim Kỵ ở Di, **không sửa expected nguồn hoặc sản phẩm**. Chạy lại file mới:6/6 đạt. 344 test còn lại giữ hiệu lực vì không có sửa code ứng dụng sau lượt đầu.
- Sáu test G2 `reading-scope` đạt trong database riêng, không đổi database/quyền chính. Tổng356 ca khác nhau thuộc7 file, kết quả thuộc các lượt nêu trên; không gộp thành một lượt gate toàn bộ.
- Lệnh prepare/typecheck ban đầu thiếu `--env-file`, launcher dừng `ERR_INVALID_URL` trước khi tsc chạy; không phải lỗi TypeScript. Chạy đúng launcher với bốn file env: typecheck và production build đều đạt, không có sửa ứng dụng sau build. Log [test](../.local/nd04-di-followup-20261019/tests-first.log), [fixture kiểm lại](../.local/nd04-di-followup-20261019/tests-fixture-correction.log), [G2](../.local/nd04-di-followup-20261019/scope-tests.log), [typecheck](../.local/nd04-di-followup-20261019/typecheck.log), [build](../.local/nd04-di-followup-20261019/build.log).
- Tạo ba bản riêng bằng API trên QA3062 từ đầu vào engine mẫu3/63/147; hai chiều Sửu–Mùi và Tuần/Triệt tại cung cho/nhận. Lưu–gửi lặp cùng ID–mở–tải lại đều giữ hash và toàn văn tất cả đoạn đúng bản lưu. Gửi API nội bộ không xác thực trả401. Fixture kỹ thuật chỉ kiểm điều kiện/thiếu dữ liệu, không tính là lá số engine bổ sung.
- Mobile360/390 không tràn ngang; mở/đóng căn cứ đúng trang175/180, đã xem ảnh thực: [360](../.local/nd04-di-followup-20261019/mobile-360.png), [390/căn cứ](../.local/nd04-di-followup-20261019/mobile-evidence-390.png). [Kết quả luồng](../.local/nd04-di-followup-20261019/acceptance.json). Không chạy lại toàn bộ E2E/PDF.

**Bản nghiệm thu đã lưu:** [mẫu3](http://127.0.0.1:3062/internal/readings?id=431df1da-518d-4bee-a7c9-23be5ba5c540&experience=1&mode=detail#natal-palace-6), [mẫu63](http://127.0.0.1:3062/internal/readings?id=96e29f24-fbdc-472d-96db-da7b1bef7c2e&experience=1&mode=detail#natal-palace-6), [mẫu147](http://127.0.0.1:3062/internal/readings?id=a2190630-99aa-4a81-89de-0f9177479939&experience=1&mode=detail#natal-palace-6). Cần quyền nội bộ; các bản tạo mới vẫn tuân G2 khi chiếu ra luồng khách, không tự mở Di miễn phí.

**Bảo toàn:** manifest trước/sau giữ nguyên298 file code được bảo vệ; **75 file bản đọc cũ** trong kho QA chính (41 nội bộ,34 dùng thử) và13 file phiên giữ nguyên hash. Không đếm13 phiên như13 bản đọc; không cộng archive/bản sao QA. Ba bản nghiệm thu là bản mới riêng. [Manifest kết quả](../.local/nd04-di-followup-20261019/preservation.json), trước/sau cùng thư mục. Không migration, không sửa quyền, engine, bảng nguồn, snapshot hay lịch sử; QA3070 không đổi; Livefalse; một web/worker trên QA3062 dùng cùng kho/database. Checkout cũ `.local/nd04-di-20261019/qa` còn để quay lại.

**File thay đổi:** `lib/interpretation-rules/di-vcd.ts`, `catalog.ts`; `lib/internal-review/customer-editorial.json`, `customer-report.ts`; thêm `tests/di-vcd-sun-moon.test.ts`; cập nhật đặc tảPhúc–Di và chính backlog này. Dữ liệu/testlog nằm `.local/nd04-di-followup-20261019/`, không tạo kế hoạch thứ hai.

**Thời gian thực tế:** khoảng12 phút,16:09:59–16:22 ngày19/10/2026; không chờ đầu vào. Dừng đúng phạm vi:9 mẫu còn chặn đã có lý do cụ thể, không mở VCD cung khác/G6/Live. Yêu cầu nội dung đủ12 cung vẫn chưa hoàn thành trước mở bán.

### Lô khách hàng + ND03/Mệnh + ND04/Tử Nữ — đặc tả trước coding, 19/10/2026

Lô hữu hạn từ backlog19 việc: (1) xác minh API công khai dùng chung calculateInternal/freezeReading, giữ ND01 và bảy nhánhDi đã xong; (2) ND03: đưa2–3 nguyên nhóm nghĩa miễn phí G2 về đầu bài “Nét chính về bạn”, không chọn theo thuận/nghịch, không cắt câu/điều chỉnh; (3) ND04/Tử Nữ: chỉ Cơ–Lương và Đồng–Cự xung chiếu từ Điền Trạch. Chưa mở9mẫuDi, ND02 quyền liên cung, M06, G6 hoặcLive. Dự kiến trình bày1.51.0/catalog1.49.0. Không có dịch vụAI gọi theo khách; dùng văn đã biên tập và lưu cố định.

NguồnTửNữ: ảnh đúng TânBiên277trang/hash4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc; đọc lại199–200/205/207, tái dùng định nghĩa33 và auditPhu–Tử.207§13.3.68 cho xét chính diệu xung chiếu như tọa thủ; **không phải bằng chứng từ các nhánhDi**.200§13.3.6 Cơ–Lương có câu về hoàn cảnh khá giả và quý tử, không phụ thuộcchi/trạngthái; dùng đúng cách biên tập “mặt thuận về vị thế” đã được audit chọn.200§13.2.3 Đồng–Cự có câu riêng “Lớn lên con cái bất hòa và ly tán”; giữ vế lớn lên, bất hòa và ly tán. Các vế số con/khó nuôi không được xuất hoặc biến thành lời thuận.205§13.3.45 là nhánhTT riêng chưa chốt lượng từ và vế đầu; không coiTTđảo hai nền, không truyềnTTtừĐiền hoặc xóa các lời phụ tinh thật tạiTửNữ. Hai câu nền không phải đã giải điều chỉnhTT.

Điều kiện: danh sách14chính tinh đầy đủ/toànvẹn; TửNữ thực sự trống; ĐiềnTrạch đối sáuchi, đúng đủ cặp bản mệnh. Trạng thái **none**, không chọnbrightnesscungcho/cungnhận. Không mượn lờiĐiền, phụtinh/TứHóa hoặc chuyển sao trongsnapshot. Hai ID `tanbien.children-vcd-co-luong`, `tanbien.children-vcd-dong-cu`; phương pháp `tanbien-children-vcd-pairs-1.0.0`, draft/review=null. CóKỵ/Tử/nhánhkhác tạiTửNữ giữ nguyên, không tự chọn kếtluận ròng. Expected trước chạy: đúng cặp/đối cung, chỉ **Tử Nữ** trống=>mộtclaim; cặp khác/cósaotạiTửNữ=>false; thiếu/bất nhất/sao lưu=>unknown; đổi trạng thái/TT không thành điều chỉnh. Ứng viên192: Cơ–Lương12/27/120, Đồng–Cự50/69; số cung trước trống phải đo, không mặc địnhcả5.

ND03/Nétchính: chọn nguyên paragraph đã qua biên tập ở khuynh hướng/học hỏi, theo thứ tự hiển thị có sẵn; tối đa3, mục tiêu150–250từ khi đủ, thiếu thìngắn hơn. Không lựa theo nhãn tốt/xấu; nếu nhóm dài không cắt ngoại lệ. Dùng chính hợp đồng G2 để chọn;5ruleMệnh–Thân vẫn giữriêng. Chuyển đoạn (khôngcopy) lênđầu, mọiclaim/relations/sentences/căn cứ nguyênvẹn. Không gọi đây là phân cách hay tổng hợp toànlá số. Web/PDF cùng sections đãlưu; không áp bố cục mới lên bảncũ. CuốiMệnh ghi các cung đãcónội dung/chưa có, bằng state phía máy chủ, không gửi lời khóa hoặc hứa mua sẽ có đủ12cung.

ND15 rà đúng phần đãđịnhvị trong lô:159/161 Vũ–Tham gắn mốc30tuổi, chưa được bỏ vế thời gian;160/161 Cơ–Âm ghiThìn (khác cấu trúc an sao Dần/Thân), không tự sửaThìn→Thân;163SátThìn/Tuất gắn đao nghiệp binh thương ngoài phạm vi. Không dùng ba câu này lấp9caQuan thiếu. Không mởnghiêncứu tiếp choND15 tronglô. TậtÁchND18 vẫn cần chủdựán chốt phạmvi: auditkhông có nhánhphi sức khỏe đã đủ điều kiện; giữ yêu cầu12cung chưađạt, khôngtự thu hẹp.

### Lô khách hàng 1.51.0 / 1.49.0 — kết quả ngày 19/10/2026

**Đã đưa vào luồng khách đang dùng thử**, không chỉ lưu ở nội bộ. API tạo công khai vốn dùng chung `calculateInternal → freezeReading → captureReadingPolicy → saveTrialReading`; không có catalog khách riêng hay cờ publish để bật lại từng rule. Lượt này thay checkout web/worker3062 bằng bản đã build, dùng cùng DB/kho; xác nhận bằng hai hồ sơ mới tạo từ form ẩn danh. ND01 và ND04 Vũ–Tham xuất đúng trên các bản đó; bảy nhánh Di và ND01 được giữ sâu qua toàn192, không chỉ so số claim. Không tự cập nhật bản cũ hoặc bản đã mua.

**Nội dung đã khép trong lô:**
- ND04/Tử Nữ: hai nền Cơ–Lương và Đồng–Cự ở Điền Trạch xung chiếu Tử Nữ trống; đúng phạm vi/spec trên. Cả hai có mẫu engine thật trong192 và phản ví dụ kỹ thuật. Giữ lời phụ tinh, không tự đảo nền theo Tuần/Triệt. Không dùng kết quả Di làm bằng chứng nguồn cho Tử.
- ND03/Mệnh: “Nét chính về bạn” chuyển nguyên nhóm khuynh hướng/học hỏi miễn phí lên đầu, không thêm câu tổng hợp, không lặp nguyên đoạn ở phía sau. Điều chỉnh Liêm–Tướng và nguyên nhóm R02/M05 được giữ cùng căn cứ.139/192 có đoạn mở đầu (96 có1 nhóm,33 có2,10 có3);53 không đủ nhóm thích hợp nên không chèn lời mẫu. Các đoạn dài15–104từ; **chưa đạt mục tiêu150–250từ khi xét độ dài**, chủ động giữ ngắn vì không có thêm nét được phép để kéo dài. Không chọn chỉ lời thuận. Những giới hạn cục bộ vẫn ở cạnh câu; không có dịch vụ AI trực tiếp.
- Cuối phần miễn phí nêu các cung thực có lời và các cung chưa có; không hứa trả tiền sẽ sinh thêm nội dung. Mọi lời khóa/căn cứ của lời khóa vẫn ở máy chủ.5 rule Mệnh–Thân giữ riêng theo G2 như cũ, không đổi quyền miễn phí.

**Chênh lệch192 snapshot riêng:** Tử Nữ trước108 trống →104 trống: **4 cung trước chưa có lời nay có lời** (12/27/50/69), **1 cung đã có lời được bổ sung** (120). Những cung khác không đổi. Toàn192 vẫn có ít nhất một cung chưa có luận, không được gọi là đủ12 cung. Số còn trống theo cung: Mệnh0; Phụ Mẫu70; Phúc Đức43; Điền Trạch59; Quan Lộc28; Nô Bộc90; Thiên Di14; Tật Ách192; Tài Bạch21; Tử Nữ104; Phu Thê80; Huynh Đệ65. Các số này là thiếu đoạn luận, không đánh giá các cung có đoạn đã hoàn chỉnh. Di14 gồm9 VCD đã chốt điểm chặn và5 cấu trúc khác; không đọc lại nguồn9 ca. [Đối chiếu sâu và5 thay đổi](../.local/content-batch-20261019/impact192.json), [độ phủ mở đầu](../.local/content-batch-20261019/opening192.json).

**Trước/sau tiêu biểu:** mẫu12 trước chỉ “Phần này hiện chưa có luận giải.” Sau: “Tử Nữ không có chính tinh. Cặp Thiên Cơ–Thiên Lương xung chiếu từ Điền Trạch gắn với hoàn cảnh khá giả và mặt thuận về vị thế của con cái về sau. Đây là lời về con cái của cặp sao, không phải lời về nhà đất; chưa phối hợp những yếu tố khác để kết luận về một người con thực tế.” Mẫu50 thêm đủ bất hòa **và** ly tán **khi con cái lớn lên**; không bỏ vế khó. Phần mở đầu chỉ đổi vị trí các đoạn có sẵn, nội dung/claim/quan hệ/căn cứ từng đoạn cũ không đổi.

**Nghiệm thu công khai và mẫu ngoài192:** tìm hữu hạn44 đầu vào engine (giới hạn54), có hai đầu vào mới khớp:04/09/1978 giờDần cho Cơ–Lương/TửVCD và ND04DiVũ–Tham;11/05/1983 giờDậu cho ND01DiTứMộ. Không tìm được đầu vào Đồng–Cự mới trong giới hạn đã định; không gọi bất khả đạt, vì192 đã có hai mẫu engine50/69. Cả hai mẫu mới đi qua giao diện `/lap-la-so` không cookie nội bộ, tạo→mở→reload nguyên văn; báo cáo mới xác nhận version1.51.0/catalog1.49.0. Đã đọc toàn văn hai mẫu cuối, đối chiếu đoạn của5 mẫu thay đổi. Không tuyên bố đã đọc toàn văn192 lần nữa.

- Mẫu khách1: [bản lưu để chủ dự án duyệt nội bộ](http://127.0.0.1:3062/internal/readings?id=5ca77486-939b-4c61-b0df-5bb19d916554&experience=1&mode=detail), [toàn văn đã lưu](../.local/content-batch-20261019/mau-khach-hang.md), [PDF8trang](../.local/content-batch-20261019/ban-doc-khach.pdf). Bản nội bộ là bản sao **cùng ID/artifact frozen** của hồ sơ sinh từ form công khai, không dựng lời riêng và không tính thành lá số thứ hai. Link công khai theoID vẫn đòi phiên sở hữu; không biến link nghiệm thu thành quyền công khai cho người khác.
- Mẫu khách2: [bản lưu duyệt nội bộ](http://127.0.0.1:3062/internal/readings?id=d49dcd4d-80b2-4daf-b9fc-a2ae7f6102a4&experience=1&mode=detail). MệnhVCD không có nét khuynh hướng đủ nguồn, không dựng “Nét chính” giả. [Kết quả browser/API](../.local/content-batch-20261019/public-acceptance.json).
- Mobile360/390 không tràn, mở/đóng căn cứ, reload đúng lời; không có pageerror. [360](../.local/content-batch-20261019/free-360.png) / [390](../.local/content-batch-20261019/free-390.png). Phiên khác đọc/PDF404; chưa đủ quyền PDF403. Toàn văn trả phí không xuất trong payload/HTML miễn phí.
- Một quyền **mock test nội bộ** được tạo qua cơ chế đơn/worker hiện có, để chính phiên thử tải PDF. Không phải sự kiện SePay, giá thương mại hoặc cấp quyền cho khách; không gọi Live/email. Sau cấp quyền, API full trùng sâu bản frozen; web có đủ từng đoạn; PDF đủ21/21đoạn,8trang, tiếng Việt/mục lục/số trang đúng, đã xem ảnh cả8trang không thấy cắt chữ/trang trắng. Web/PDF dùng cùng bản lưu. [Kiểm PDF](../.local/content-batch-20261019/pdf-check.json).

**Kiểm thử thực chạy:**419/419 ở7file nội dung/nguồn/Di/ND01/Phu–Tử;5/5storedPDF;9/9workspace/publicPDF trênDBfixture riêng;6/6G2. Tổng439case khác nhau có kết quả cuối còn hiệu lực qua các lượt, **không phải một lượt toàn gate**. Typecheck cuối và productionbuild đạt; không sửa ứng dụng sau build.

Lỗi/lượt chạy lại: ban đầu test khách giữ giả định đoạn Liêm–Tướng ở mục`traits`, đổi assertion tìm nguyên nhóm claim và vẫn kiểm đủ nghĩa sau di chuyển; harnesscompare gặpoptionalundefined rồi phát hiện vị trí chèn rule mới làm dịchIDparagraph cũ — đã đưa rule mới saukinRules, đối chiếu cuối mọiparagraph cũ giữ sâu. Test mới ban đầuđuôi.tsx không đượcVitestinclude, đổi.ts trước lượt cuối. Typecheck phát hiệndelete trường bắt buộc của fixture, sửa castfixture.5workspace ban đầuskip vìsandbox chặnDB, chạy lạiDBriêng5/5 cùng4publicPDF. Browser: lượt1selector tên nút căn cứ sai, lượt2nhầm component làsummaryHTML, lượt3đòi mở đầu ở hồ sơ không đủ nét; sửa harness theoDOM và điều kiện thực, lượt4 hoàn thành hai ca. Không sửa nguồn/expected lịch sử để xanh; những lượt trước có thêm hồ sơ thử mới, giữ nguyên chúng, không tính thành lá số độc lập mới trong mẫu kiểm.

**Bảo toàn/triển khai:**80file báo cáo có trước (46internal/34trial),13file phiên và292file code được bảo vệ giữ hash;4file trongmanifest đổi đúng phạm vi (workspace, hàm dùng chung G2, PDF chọn paginator theo1.51, derivedfacts). Không có thay đổi ngoài danh sách hoặc file mất. [Manifest kết quả](../.local/content-batch-20261019/preservation-final.json). Không migration/ghi lại bản cũ/đổi hạn; không tuyên bố hash toànDB khi chỉ chụp file. G2 hồi quy xác nhận hạn/thu hồi/giữ quyền cũ. QA3070 không chạm; mộtweb/worker3062 cùng cấu hình/kho; Livefalse. Checkout1.50 còn đểrollback. PDF1.51 dùng bộ phân trang sẵn có, không áp vào bản frozen1.48–1.50.

**Điểm dừng:** hai nhánh Tử đủ rõ và phần mở đầu đã hoạt động cho khách. ND15 đối chiếu hữu hạn vẫn chặn ở các câu đã ghi trên, không làm giả lờiQuan. Các mụcC/D còn nguyên; ND03 các chủ đề khác chưa khép. **Tật Ách cần quyết định cụ thể của chủ dự án:** yêu cầu luận cá nhân12cung đang xung đột với phạm vi loại trừ sức khỏe/sinh tử và chưa có nhánh phi sức khỏe đủ nguồn trongaudit. Chưa tự giảm yêu cầu hoặc thay bằng lời khuyên. Chưa đủ điều kiện quảng bá/thu phí “báo cáo hoàn chỉnh12cung”; Zalo/G6/Live/deploy vẫn hoãn.

Thời gian thực tế của lô: khoảng21phút,17:00:30–17:21ngày19/10/2026, gồm nguồn đã định vị, coding, kiểm thử, triển khaiQA và8trangPDF; không có thời gian chờ quyết định. Thay đổi tài liệu cuối không yêu cầu build lại.

### Lô Tử Nữ–Nô Bộc–Phu Thê — đặc tả trước coding 19/10/2026

Đặc tả khóa trước coding 19/10/2026, lô ND09/ND12/ND13 và ND04/Tử.
Nguồn TB277 SHA2564d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc; ảnh168–171/173,199–202/207–210/212 đã mở. Không dùng NPL ghép bảng.
Nô: bỏ riêng cổng dự án đúng1sao nếu TẤT CẢ chính tinh tọa từng cung phân vào CÙNG key nhóm A/B/C và cùng nhãn sáng(M/V/Đ) hoặc hãm theo bảngTB. Không trung bình/đa số/chọn mạnh. Cần cả Mệnh/Nô nonempty, complete/integrity; giữ cổng TTcảhai, trạng thái Bình/Lợi chưa định nghĩa, hai nhóm/ánh sáng khác nhau, VCD chưa xác địnhchi lấytrạngthái => unsupported. Không thêm hàngA-A/B-B/C-C sách không có. Không tăng/giảm theo sáttinh khi cóchínhdiệu vì171nóichỉnhậnđịnhchínhdiệu. 1sao cũ vẫntext/factnhưcũ. Đây là thu hẹp vào giao của cùng ô rõ, không khẳng định sách nêu thuật toáncho2sao khácô. Expected:22case mới khớp192,19trống→cólời,3bổsung; phải đo lại.
Tử: Đồng đơnTỵ/Hợi199 và Lương đơnTỵ/Hợi202 có CÂU RIÊNG: “Sau này con cái thường ly tán, phiêu bạt.” Câu trước vềnếu sinh thêm/nuôi toànvẹn và câu sau vềduđãng không được chuyển thành lời quan hệ. Lời ly tán giữ nguyên nghĩa, không tạo từ phánxét phẩmhạnh; không rút từ vế “nhưng” phụthuộc. Giới hạn cũ loại cả đoạn là lựa chọn biên tập, không điều kiện kích hoạt nguồn. Exactmajor1; chiTỵ/Hợi; nostate/age/extravacancy. Không khẳngđịnh cócon hay sốcon.
TửVCD: thêm4cặp khôngđiềukiệnchi/trạngthái đã có lời tọathủ trongaudit: Tử–Sát199/202 (vềsauxacha mẹ),Tử–Phá199 (vềsauxungkhắccha mẹ),Liêm–Phủ199/201 (vềsaukhágiả),Vũ–Phủ200/201 (vềsauquýhiển). Dùng hợpđồng207riêngTử,Điềnđốicung; không thêm đối tượng/tuổi/sốcon. Có thể không có enginewitness trong192, phải ghi riêng tìm hữu hạn.
Phu: mô tả sớm không phải gate dữ kiện đã kết hôn sớm: Đồng–Lương209/212 (sớm;họhàng hoặc hai giađìnhquenlâunăm;đẹpđôi/giàusang), Cơ Tỵ/Ngọ/Mùi210 (sớm;cươngcường;chungsống;cótài/khágiả), Cơ–Lương210 (sớm gặp;lấydễ;khágiả;quenhoặchọhàngxa;hòahợp), Cơ–ÂmThân210 (cótài/khágiả;kếthônsớm;namnểvợ). Không ngầm đặt tuổi hay xácnhận tìnhtrạnghônnhân; giữ sớm trong văn. LươngNgọ212: lấynhausớm/dễ;quýhiển, không ápTỵ(vănxungđột), không tự sửaTỵ→Tý. Khuyếnnghị thứbậc/trưởng không biếnthànhgate.
Phu Nhật Dậu/Tuất/Hợi/Tý210: câu độc lập cưới xin trắc trở được xuất; giữ giới hạn lời tránh chẳnglành gắnmuộn chưa cómốctuổi, không xuất tránhbấtlợi vôđiềukiện. Cùng mẫu kiểm phạmviđãdùngchoTướngMão/Dậu, nhưng bằngchứngmới là chính210. Không làm các nhánh “nếu sớm...”, “muộn mới...” còn lại thành vôđiềukiện. Khôngchọn lời nào thắngphụtinh/TT.
DùngkinAssessment/facts/evaluator chung; không đổi engine; appendrulecuốicatalog tránhđổiIDparagraphcũ. Newcatalog1.50.0/presentation1.52.0; draft/reviewnull. G2khôngđổi.


### Lô Tử Nữ–Nô Bộc–Phu Thê 1.52.0 / 1.50.0 — 19/10/2026

**Đã triển khai vào bộ xử lý chung, không viết riêng theo hồ sơ.** Tái sử dụng `kinAssessment`, evaluator/facts/trace và bản lưu; không đổi engine, bảng trạng thái hoặc G2. Nô mở 23 ô hiện có cho trường hợp mọi chính tinh trong từng cung cùng một ô nguồn; không tạo lời bảng trùng. Thêm 9 nhánh câu độc lập ở Tử/Phu, cùng 4 nhánh TửVCD đã có câu tọa thủ không phụ thuộc trạng thái. Các nhánh mới vẫn draft/review=null. Không có AI dịch vụ chạy theo khách. Không kết luận tổng hợp toàn cung.

| Cung, cùng 192 snapshot v2 | Trước: chưa có đoạn | Sau: chưa có đoạn | Trước trống, nay có lời | Đã có lời, được bổ sung |
|---|---:|---:|---:|---:|
| Tử Nữ | 104 | 97 | 7 | 0 |
| Nô Bộc | 90 | 71 | 19 | 3 |
| Phu Thê | 80 | 67 | 13 | 7 |

Đây là lượt cung, không cộng thành số khách độc lập. 44 snapshot có ít nhất một nhánh mới khớp; các lần đổi metadata/version của nhánh Nô vốn khớp không tính thành lời mới. Các cung khác không đổi; toàn192 vẫn còn ít nhất một cung thiếu, Tật Ách192/192 chỉ dữ kiện. Có đoạn không đồng nghĩa đã luận đủ chủ đề. [So sánh từng cấu trúc/câu và quyền](../.local/kin-coverage-20261019/impact192.json), [những cấu trúc còn trống và chỉ số mẫu](../.local/kin-coverage-20261019/remaining.json).

#### Phân biệt nguồn, giới hạn dự án và điểm chặn — không tạo backlog thứ hai

| Nhóm trong ND09/12/13/04 | Căn cứ đã kiểm bằng ảnh, đúng bản TB277 | Kết quả / phần còn thiếu |
|---|---|---|
| Nô: nhiều chính tinh nhưng cùng ô trong từng cung | PDF168 mở đầu, bảng168–170, giải thích171 | Cổng “đúng một sao” là giới hạn triển khai, không phải chữ “đơn thủ” trong đoạn này. Nay tra từng sao; chỉ khi cùng A/B/C và cùng loại sáng(Miếu/Vượng/Đắc) hoặc Hãm mới có một ô thống nhất. Giữ nguyên lời bảng và phụ tinh. Không có trung bình, đa số hay chọn sao thắng. 19 cung trống có lời,3 bổ sung. |
| Nô: trạng thái khác nhau, VCD, ô không có, TT | PDF168–171,173§9.2.11 | 71 ca trống phân nhóm loại trừ nhau theo điểm chặn đầu tiên:32 có Mệnh hoặc Nô VCD (trong đó17 NôVCD);22 không cùng ô nhóm/sáng–hãm hoặc Bình/Lợi;9 có TT trực tiếp khi cấu trúc bảng đã khớp;8 hai cung cùng nhóm, bảng không có ô đó. “Vắng TT” là cổng thận trọng của dự án; nguồn173 dùng nhiều chính diệu/sát sáng–mờ và đảo kết quả, chưa đủ xác định lượng từ/phương diện của từng ô. Không bỏ cổng hoặc tự điền ô. |
| Tử: Đồng/Lương đơn thủ Tỵ/Hợi | PDF199§13.2.3 và202§13.3.12, ngữ cảnh toàn gạch đầu dòng | Triển khai câu riêng “Sau này con cái thường ly tán, phiêu bạt”. Giữ nguyên ly tán/phiêu bạt/về sau; không lấy lời du đãng để đổi thành xa cách. Câu số con/nuôi con trước đó không trở thành lời sinh tử; câu phẩm hạnh sau đó không xuất. Giới hạn cũ loại cả đoạn là lựa chọn biên tập, không phải nguồn yêu cầu thêm một sao.7 ca trước trống có lời. |
| Tử VCD: bốn cặp bổ sung | PDF207§13.3.68;199 Tử–Sát/Tử–Phá/Liêm–Phủ,200 Vũ–Phủ; đối chiếu201/202 | Bổ sung đúng câu về Tử, dùng cặp ở Điền đối cung; không chuyển lời nhà đất, phụ tinh hay trạng thái. **Chỉ đã kiểm fixture điều kiện, chưa có mẫu engine xác nhận:** không gặp trong192 và480 đầu vào mới giới hạn.0 đóng góp vào bảng độ phủ, không gọi bất khả đạt hay đã nghiệm thu end-to-end. Hai cặp Cơ–Lương/Đồng–Cự cũ giữ nguyên. |
| Tử còn thiếu | PDF199–202,205§13.3.45,207; ma trận Phu–Tử đã có | 22 VCD còn trống: các cặp Đồng–Lương/Cơ–Cự/Nhật–Nguyệt/Nhật–Cự/Đồng–Âm/Liêm–Tham/Nhật–Lương/Tử–Tham/Vũ–Tham có câu phụ thuộc vị trí, muộn sinh hoặc “quý tử” chưa đủ nghĩa/điều kiện.10 Tướng còn gắn muộn sinh. Các câu chỉ số lượng/con trai gái, khó nuôi, bệnh, phẩm hạnh giữ ngoài phạm vi; các vế “nhưng”, “mới” phụ thuộc không tách thành lời thuận. TT205 chưa rõ một/cả và tác động, không tự đảo nền. Không ghi97 ca đều thiếu coding. |
| Phu: lời mô tả sớm, không phải điều kiện tuổi đầu vào | PDF209§14.3/212§14.12 Đồng–Lương;210§14.6 Cơ Tỵ/Ngọ/Mùi,Cơ–Lương,Cơ–Âm Thân;212§14.12 LươngNgọ | 6 nhánh theo cấu trúc/giới tính: Đồng–Lương; Cơ đơn; Cơ–Lương; Cơ–Âm Thân nam/nữ; LươngNgọ. Giữ “sớm”, tài/vật chất, cương cường nhưng chung sống, quen trước/họ hàng đúng câu; nam Cơ–Âm giữ nể vợ. Không đặt tuổi hoặc xác nhận người đọc đã kết hôn. Không biến khuyến nghị lấy con trưởng thành dữ kiện đã biết. |
| Phu: Thái Dương đơn Dậu/Tuất/Hợi/Tý | PDF210§14.5 | Thêm câu cưới xin trắc trở; ngay cạnh giữ việc tránh chẳng lành gắn muộn đường hôn phối chưa có mốc tuổi. Không xuất cứu giải vô điều kiện. Tổng7 nhánh Phu giúp13 trống có lời,7 đã có lời được bổ sung; không gọi lời bổ sung là điều chỉnh claim cũ. |
| Phu còn thiếu | PDF208–216§14 đã có ma trận; lượt này mở lại208–210/212 | 21 VCD chưa có hợp đồng riêng chỉ rõ chi/trạng thái/lời được áp; Đồng thấp/Cự thấp/Liêm–Phủ/Vũ/Đồng–Âm/Nhật–Cự/ThấtSát… còn “nếu”, “mới”, muộn/kết hôn tiếp theo hoặc vế tử vong/phẩm hạnh. LươngTỵ có hai dòng khác chiều ở212, không tự sửa chữ Tỵ→Tý. Các bộ Cô–Quả/Quang–Quý/Cự–Hỏa–Linh và “nhiều” chưa giải lượng từ/vị trí; không suy AND/OR từ dấu phẩy. Phá/Sát có lời số lần hôn nhân/sinh tử không đổi thành “cần giao tiếp”.67 ca trống vẫn giữ trạng thái thật. |

Nguồn không được ghép với NPL để giải điều kiện Tân Biên. [Đặc tả khóa trước coding](../.local/kin-coverage-20261019/spec.txt). Ảnh được xem trong hồ sơ cũ: Nô168/169/170/171/173 và Phu–Tử199/200/201/202/207/208/209/210/212; không đọc lại toàn sách. Các source locator mới dùng trang PDF, không tự xác nhận trang in.

**Ví dụ trước/sau:** mẫu192 số20, Tử Nữ trước “Phần này hiện chưa có luận giải.” Sau: “Thiên Đồng đơn thủ tại Tử Nữ ở Tỵ hoặc Hợi mô tả con cái về sau thường ly tán và phiêu bạt. Lời này nói về sự phân tán, xa cách trong hoàn cảnh con cái; không xác định người con nào hay thời điểm xảy ra.” Đây là lời cục bộ quan hệ, không thay thế hay làm nhẹ câu phẩm hạnh. Nô trước chỉ có HóaKỵ ở mẫu ngoài bộ03/02/1978, nay thêm trước khó/sau dễ và sự không nhất trí, không cho vế thuận xóa bất hòa. Phu mẫu ngoài bộ19/11/2013 giữ HóaKhoa/học vấn và thêm Cơ–Âm Thân/sớm/nể vợ, không cộng thành kết luận tài giỏi.

**Tìm mẫu hữu hạn:**18 đầu vào lân cận (giới hạn56) cho3 nhóm chính và Cơ–Âm nam; tìm riêng6/48 đầu vào Nô xác nhận mới khớp so với evaluator cũ, không chỉ tìm một ô đã chạy. Ba cấu trúc ngoài192 được dùng cho form công khai: nam03/02/1978 giờDậu; nam07/11/1978 giờDậu; nam19/11/2013 giờSửu. Không tìm thêm mẫu Đồng–Lương trong14 ngày lân cận, nhưng có5 mẫu engine192. Bốn cặp TửVCD bổ sung:480 đầu vào ngày14, tháng2/5/8/11, năm1977→2022 cách5năm,12 khung giờ; không thấy ca dương. [Kết quả](../.local/kin-coverage-20261019/new-engine.json). Fixture không tính là lá số engine, nhiều bản lưu cùng đầu vào không tính thêm mẫu.

#### Nghiệm thu và bản đang phục vụ khách

- **Luồng thật:** [Lập lá số](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so), HTTPS trả200. QA3062 chạy checkout `.local/kin-coverage-20261019/qa`, web/worker cùng cấu hình và kho chính; source runtime trùng code cuối. Dừng đúng web/worker cũ theo PID/cwd, giữ checkout1.51 để quay lại; không đổi QA3070 hoặc migration.
- **Tạo mẫu trong phiên sở hữu của chủ dự án:** dương lịch, nam;03/02/1978 giờDậu → Nô mới;07/11/1978 giờDậu → Tử mới;19/11/2013 giờSửu → Phu Cơ–Âm nam. Tên tùy chọn, không tham gia chọn lời. Bấm Lập lá số, mở đúng cung; ba cung vẫn theo G2, cần quyền thử đầy đủ để đọc lời chi tiết. Chưa mở bán/Live. Các bản kiểm tự động thuộc phiên riêng, URL không cấp quyền cho người khác.
- **Đường duyệt bản cố định bằng quyền nội bộ hiện có:** [Nô](http://127.0.0.1:3062/internal/readings?id=233dbbb6-2359-4873-b57b-fb557b59a3bc&experience=1&mode=detail), [Tử](http://127.0.0.1:3062/internal/readings?id=0a0e9ef5-aebd-4a2b-96eb-1704692c5bcb&experience=1&mode=detail), [Phu](http://127.0.0.1:3062/internal/readings?id=7606c16f-a2d2-4de0-beea-a32abdfc41dd&experience=1&mode=detail). Đây là nguyên artifact của form công khai được lưu thêm vào kho duyệt, không dựng báo cáo thứ hai và không đếm là mẫu mới. [PDF đại diện](../.local/kin-coverage-20261019/ban-doc-khach.pdf).
- **Kiểm thử thực chạy:** lượt đầu5file432đạt/2lỗi: fixture tổng hợp sai chứng nhận Tứ Hóa khi freeze, và test cũ chặn mọi2chính tinh. Sửa fixture lưu thành engine thật, đối chứng Nô thành2sao khác nhóm, giữ assertion không chọn sao thắng. Lượt lại434/434. Lượt mở rộng8file457/457 (gồm ND01/ND04 giữ nguyên); G2 trên database riêng6/6. Typecheck đầu lỗi optional `projectScope`, sửa đọc an toàn; typecheck và buildQA cuối đạt. Sau sửa guard chạy lại riêng16/16 ca kin. Không sửa expected lịch sử, không skip và không chạy gate toàn bộ. Lệnh/log trong `.local/kin-coverage-20261019/`; các số là kiểm kỹ thuật, không chứng minh tử vi đúng.
- **UI:** hai lượt đầu tạo/lưu/quyền đã qua, dừng khi script cuộn đoạn còn thu gọn; lượt1 thiếu mở cung, lượt2 nhầm component là `details` (thực tế div/button). Sửa thao tác harness dùng nút thật, không tăng timeout/bỏ assertion, không sửa giao diện. Lượt cuối3/3 mẫu qua formẩn danh→API đúng1.52/1.50→reload đủ nguyên văn; không cookie nội bộ. Đã mở lời mới/căn cứ và xem ảnh cả360/390, không tràn ngang hoặc pageerror. [Kết quả](../.local/kin-coverage-20261019/public-acceptance.json), [Tử360](../.local/kin-coverage-20261019/full-1-360.png), [Nô390](../.local/kin-coverage-20261019/full-0-390.png), [Phu390](../.local/kin-coverage-20261019/full-2-390.png). Đã đọc toàn văn ba mẫu ngoài bộ; không gọi là đọc toàn văn192 lại.
- **Quyền:** API/HTML miễn phí không chứa paragraph khóa, PDF miễn phí403; phiên khác đọc/PDF404. Đơn mock QA nội bộ cấp đúng bản, không chạy catalog lại. Lượt cuối3đơn mock;2lượt UI dừng trước đó để lại2đơn mock và6bản thử khác; ghi đúng9lần tạo/3đầu vào độc lập, không đếm9lá số. Không dùng mock làm bằng chứng SePay mới, không gửi email thật hoặc bật Live.
- **PDF:** một PDF thật tải từ nút công khai với quyền thử, đúng tên/dữ kiện/bản lưu;16đoạn và5ghi chú đối chiếu văn bản đều đủ. Đã render/xem cả8trang, dấu Việt/đoạn/TOC/nguồn đọc được, không cắt chữ/trang trắng bất thường. Thay đổi renderer chỉ thêm version1.52 vào cơ chế phân trang đã có, không xuất lại bộPDF. [Đối chiếu](../.local/kin-coverage-20261019/pdf-check.json).
- **Bảo toàn:** 410file trong manifest trước;88tệp báo cáo lịch sử kho chính(47nội bộ+41công khai),85IDriêng và19file phiên cũ nguyên hash. Không nhân bản archive vào số đếm. Engine/bảng nguồn/G2/payment/UI ngoài allowlist không đổi.11dòng token quyền,8ràng buộc đơn,18liên kết tài khoản cũ nguyên hash/hạn;36bàiCMS/38phiênbản không đổi,34bài vẫn công khai. Chỉ thêm dữ liệu nghiệm thu mới. [File](../.local/kin-coverage-20261019/preservation-final.json), [DB](../.local/kin-coverage-20261019/db-after.json). Không chạm các archive/QA3070. Các file thực sửa: natal-completion,phu-tu(factory),children-vcd,kin-extension(+JSON),catalog,derived,customer-editorial,customer-report(version),customer-pdf(versionguard),hai filetest và kế hoạch này.

**Thời gian thực tế lô này:** 24.7 phút, từ17:35:03 đến17:59:43 ngày19/10/2026 (Asia/Ho_Chi_Minh). Khép lô đã chọn, không mở công việc khác.

#### Tật Ách — quyết định cụ thể còn cần chủ dự án, chưa mở nội dung

**Ai đặt giới hạn:** chủ dự án đã nhiều lần yêu cầu không mở sức khỏe/sinh tử/quy kết phẩm hạnh và lần này nhắc lại; đó là phạm vi đang có hiệu lực. “B=0”, chỉ hiển thị dữ kiện và việc chưa chọn các câu kiện cáo/tù tội là kết quả/đề xuất triển khai trong [Tật Ách1.34](TAT-ACH-1.34.0.md), không phải tác giả nói cung không có nội dung. Các nhãn số con/số lần hôn nhân bị loại trong [Phu–Tử1.33](PHU-TU-1.33.0.md) là giới hạn biên tập hiện hành; chưa tìm thấy quyết định độc lập của chủ dự án cho phép mở chúng, nên không nới trong lượt này.

**Nguồn có gì để đặt câu hỏi:** TB181–189 bàn loại bệnh/bộ phận cơ thể, tai nạn/nguy hiểm, kiện cáo/tù tội và các sao cứu giải; TL160–163 gắn Phụ–Ách với nhân quả gia đình/bệnh nạn; HS44/73 yêu cầu xem Phúc–Mệnh–Thân–Tật. Đây là nội dung truyền thống của tài liệu, không phải bằng chứng chẩn đoán hoặc dự báo y khoa đáng tin cậy. Nguồn hiện có **không cung cấp trong audit một phép phi sức khỏe đã đủ đặc tả** trả lời “bạn ứng phó áp lực thế nào” hay “cách chăm sóc bản thân riêng cho bạn”. Không viết những câu đó để thay bài Tật Ách.

Ba phương án ghi ở lô19/10 dưới đây là **nhật ký lịch sử**. Quyết định20/10 đã cho phép thẩm định và sau đó đồng ý hướng chú giải truyền thống theo cấu trúc, chưa duyệt mẫu/publish; không đọc đoạn cũ này thành yêu cầu hỏi lại lựa chọn hướng. Không có quyết định giảm mục tiêu12cung:
1. **Giữ loại trừ, sửa lời hứa thương mại:**12 cung để tra cứu, luận cá nhân các phương diện có nội dung; Tật Ách chỉ kiến thức/dữ kiện. Phải bỏ lời hứa “luận cá nhân đủ12cung” và công bố riêng các cấu trúc còn thiếu của11cung; không tự coi11cung đã đủ.
2. **Giữ mục tiêu luận cá nhân12cung, cho phép một gói thẩm định phạm vi Tật Ách trước coding:** giới hạn đúng TB181–189/TL160–163/HS44/73 đã có, chủ dự án quyết định có cho xem xét nội dung sức khỏe truyền thống hay chỉ mệnh đề kiện cáo/tai nạn phi y khoa; người duyệt chuyên môn phải xác định câu nào được phép, điều kiện/ngoại lệ, cách không biến thành chẩn đoán/tiên đoán sinh tử. Đây là quyền nghiên cứu/duyệt, không phải quyền xuất bản hoặc khẳng định sức khỏe người thật. Chưa có ngày hoàn thành12cung được chứng minh; chưa mở bán.
3. **Giữ nguyên cả mục tiêu12cung và loại trừ hiện nay:** beta tiếp tục, cổng thu phí vẫn đóng; ND18 chờ bằng chứng mới cho một phương pháp phi sức khỏe thực sự. Không mở lại vô hạn cùng tài liệu khi chưa có câu hỏi/bằng chứng mới, không đặt ngày hoàn thành giả.

Các quyết định trên không làm thay đổi nội dung đã mua, quyền G2 hoặc Live. Lượt này hoàn thành phần độc lập của ba cung và dừng; không tự mở Tật Ách, G6, Zalo hay nghiên cứu ngoài lô.

### Cổng đủ nội dung và điểm kết thúc backlog

Một cung phải trả lời được câu hỏi của chính nó bằng lời áp dụng đúng dữ kiện, giữ điều kiện/điều chỉnh/ngoại lệ và truy vết; thông tin sao hoặc số đoạn không thay cho tiêu chí này. Tài Bạch phải phân tạo thu nhập/giữ tiền với Điền tạo lập/duy trì tài sản; Phụ/Tử/Phu/Huynh phải đúng đối tượng quan hệ; Mệnh phải phân nét sao, phương pháp ngũ hành và vai trò Thân, không tự hợp nhất. Một lời phụ tinh đơn lẻ không chứng minh cả chủ đề đã đầy đủ.

- **A/B:** chỉ đóng sau khi công việc cụ thể, văn và các ca ảnh hưởng đạt; sửa bản mới, không ghi đè lịch sử. Không tuyên bố toàn chủ đề đủ chỉ vì một hàng được đóng.
- **C:** mỗi việc chỉ đối chiếu đúng câu/ngoại lệ đã nêu, kết thúc bằng bảng điều kiện đủ hoặc chỗ còn thiếu bằng chứng. Không chuyển sang D vì khó; chưa giải được vẫn là chặn nội dung tương ứng, không hẹn nghiên cứu vô hạn. Các phần đọc nguồn P0–2a/2b/P0–4 còn lại trong kiểm kê vẫn được giữ, chỉ nâng thành chặn khi chỉ ra câu hiện xuất/định bán chịu ảnh hưởng; không mở lại toàn sách.
- **D:** chỉ đóng bằng quyết định phạm vi rõ của chủ dự án và cập nhật lời hứa; hiện chưa có quyết định giảm yêu cầu12 cung. Đặc biệt ND18 chưa giải được bằng biên tập.
- **Mở bán:** yêu cầu12 cung chưa đạt và chưa có căn cứ hẹn ngày hoàn tất chuyên môn. Hoàn tất ND01, G1–G5 hoặc cải thiện văn không thay thế nghiệm thu nội dung. Không dùng paywall/Toàn thư để che chỗ trống. Không có lỗi rule cụ thể theo chính nguồn của rule được chứng minh mới trong lượt này.

**Nhật ký lượt chốt19/10:** chỉ đọc hồ sơ/JSON/code tĩnh và cập nhật mục này cùng trạng thái G0; không chạy evaluator, test/build/PDF, không sửa code/catalog, không đọc lại toàn sách, không thao tác dữ liệu/QA. Hoàn tất cập nhật lúc 14:11 19/10/2026 (Asia/Ho_Chi_Minh). Đã kiểm đủ19 mã không trùng, cấu trúc bảng và các liên kết cục bộ trong mục; đây chỉ là kiểm tài liệu, không phải chạy test ứng dụng.

## V1-5. Bố cục khách hàng và admin cần nghiệm thu

**Mobile360/390:** header Tinh Luận gọn; tên/hồ sơ, đường xem lá số và nút Mục lục ở đầu. Sau phần nhận diện ngắn là đoạn Mệnh có ích, không bắt kéo qua toàn lá số, form email hoặc quảng cáo. Lá số hiện tại được giữ, mở/thu khi cần. Thanh điều hướng “Bài đọc ·12 cung ·Lá số”; không nhét tab vận hạn/AI từ đối thủ. Mục lục12 cung ghi đang xem/đã mở/khóa/chưa có lời theo trạng thái thật; không dùng cùng ổ khóa cho thiếu nội dung và thiếu quyền.

Mỗi cung/chủ đề: câu mở đầu có căn cứ → nét bổ sung → điều chỉnh/ngoại lệ → giới hạn cục bộ nếu cần → “Xem căn cứ”. Một lưu ý chung cho bài, không lặp sau mọi đoạn. Có chế độ bài liền mạch và điều hướng12 cung trên cùng dữ liệu; nguồn đóng mặc định. Tài–Điền gom theo chủ đề nhưng12 cung dẫn tới đúng đoạn. Không lấy lời tài chính viết lại thành tính cách.

Chạm mục lục cuộn đúng tiêu đề không bị header che; mở căn cứ không mất vị trí; Back từ checkout/login quay lại đúng cung; reload giữ report và vị trí đọc theo ID bản lưu. Trạng thái đọc lưu riêng, không sửa văn lịch sử. Kiểm bàn phím/focus, vùng chạm tối thiểu44 px, không tràn toàn trang; bảng rộng cuộn cục bộ. Desktop có cột mục lục, không ép dùng lại chiều ngang mobile.

**Khóa mua:** hiển thị dữ kiện cung và mô tả phạm vi sẽ được mở, không cắt nửa câu luận gây hiểu sai. CTA gói rõ; chưa có nội dung ghi khác với chưa mua. Một trang QR, có sao chép ngân hàng/số tiền/nội dung; cùng điện thoại vẫn dùng được. Chỉ webhook/API máy chủ xác nhận; nút khách “đã chuyển” nếu có chỉ yêu cầu kiểm lại, không tự paid. Chưa triển khai nút này trong task tài liệu.

**Admin V1:** chỉ những chức năng ở V1-3; không thêm BI, biểu đồ phức tạp, CMS mới, sửa bản lịch sử hoặc tự đánh dấu paid. Tái sử dụng danh sách/filter hiện có. Tổng quan tách **đơn, giao dịch duy nhất, lần gửi webhook, job và quyền**; số tiền Live chỉ từ giao dịch đã chấp nhận, không từ webhook nhận được. BảngTest/Live không trộn mặc định; chưa cóLive ghi “chưa có dữ liệu”, không ghi “đã đối soát Live”. Người dùng/role quản trị và nhật ký actor là việc mới; khóa nội bộ chung không đủ cho audit trách nhiệm nhiều admin. Quyền đọc và lỗi trong V1 cơ sở là xem/tra cứu, chưa có cấp/thu hồi/retry tay hoặc hoàn tiền nếu chưa được chốt riêng.

## V1-6. C — Các gói hữu hạn, theo phụ thuộc

Ước lượng **ngày công8 giờ**, gồm kiểm phần chịu ảnh hưởng; không phải thời gian chờ nhà cung cấp. Đây là ước lượng từ kiểm kê nhanh, không cam kết lịch giao cố định. Biên tập/nghiên cứu không gộp vào giờ lập trình; cột chờ không cộng thành thời gian làm. Không tạo ngày beta giả khi chưa chốt nội dung/giá/domain/OAuth.

| Gói | Đầu ra và điểm kết thúc | Phụ thuộc | Lập trình/QA | Biên tập/đối chiếu nội dung | Chờ cấu hình/quyết định |
|---|---|---|---:|---:|---|
| **G0 — Nội dung12 cung** | **Backlog19 việc đã chốt tại V1-4**, chưa hoàn thiện nội dung. Đã khép ND01 + ND03/Di, sáu cặp ND04 và nền Nhật–Nguyệt ngày19/10; 9 mẫu DiVCD còn trống, ngoại lệ Nhật–Nguyệt chưa chốt. Các phần ND03 khác, năm rule G2 và Tật Ách còn mở | Audit và đầu ra1.47 đã lưu; không mở G6 | ND01: đã thực hiện; xem kết quả dưới V1-4 | ND01: đã đối chiếu4trang và biên tập nhóm; không cộng thành lịch đủ12 cung | ND02/18/19 chờ quyết định; các mục C chưa có ngày hoàn thiện được chứng minh |
| **G1 — Tài khoản và nhận quyền cũ** | Google + Zalo Login, user/session/identity; claim bản cũ bằng bằng chứng sở hữu; admin riêng, backup/migration | Quy tắc quyền ở G0; callback domain |4–6 ngày |0,5 ngày nhãn/lỗi/hướng dẫn | App/clientsecret phía máy chủ, domain/HTTPS, provider review; chưa có thời hạn được xác minh |
| **G2 — Scope miễn phí/trả phí** | Projection mọi đường; một edition/scope; tách hạn phiên/quyền; manifest legacy và hồi quy truy cập chéo | G0+G1 |3–5 ngày |1–2 ngày phân nhóm đoạn/căn cứ liên cung | Giá/hạn gói chưa cần để test quyền, nhưng phải có trước chào bán |
| **G3 — Không gian khách hàng và bài đọc** | Lá số của tôi, đã mua, đơn; TOC/mobile/giữ vị trí; sửa tạo bản mới; văn theo nhóm đã duyệt | G1+G2; nội dung G0 |3–4 ngày |2–3 ngày đọc bản cuối đại diện các cấu trúc, không viết thêm phép luận | Chủ dự án duyệt trải nghiệm, không dùng duyệt UI thay duyệt nguồn |
| **G4 — Checkout một gói, SePay** | **Test đã triển khai 19/10**, bằng chứng ở mục G4 dưới; phần thương mại/Live chưa mở. Đơn account-bound, scope/edition server, QR→worker, chống trùng và quay lại cung | G2; giá/hạn/chính sách |3–4 ngày |0,5 ngày mô tả quyền lợi/chính sách gói | Tài khoản/ngân hàng/credentials và phê chuẩnLive; Test không chờLive |
| **G5 — Admin vận hành** | **Đã triển khai QA 19/10**, chi tiết/giới hạn ở mục G5 dưới. Tổng quan, người dùng, báo cáo/đơn/giao dịch/quyền, lỗi, Toàn thư, nhật ký; Test/Live riêng; chỉ xem quyền và giao dịch | G1+G2; G4 cho dữ liệu checkout |3–5 ngày |0,5 ngày định nghĩa trạng thái/chỉ số | Chỉ định quản trị viên, chính sách lưu/xóa dữ liệu và quy trình hỗ trợ |
| **G6 — PDF/email/vận hành phát hành** | Grant mới đọc/PDF/recovery đúng bản; lỗi PDF bền vững; cấu hình email được phép; triển khai Ubuntu/HTTPS/backup khi được mở lại | G2+G4+G5, domain ổn định |2–3 ngày |0,5 ngày email và chỉ dẫn | Máy chủ/domain/DNS/email gửi rộng; deployment đang tạm hoãn |
| **G7 — Nghiệm thu V1 và dừng** | Ma trận quyền/legacy, luồng hai tài khoản, miễn phí/mua/lỗi/retry, mobile, PDF; ký phạm vi nội dung và release checklist; không mở vòng thêm sao | G0–G6 và các cổng bên dưới |2–3 ngày |1–2 ngày duyệt nội dung cuối của phạm vi đã chốt | Chủ dự án nghiệm thu; phê duyệt chuyên môn nếu dùng lời giới thiệu đòi hỏi mức đó |

Tổng phần đã ước lượng: **20,5–31 ngày công lập trình/QA;9–14 ngày công biên tập/đối chiếu/duyệt**, chưa tính chờ. Có thể làm G1 song song phần biên tập G0, G3/G5 song song sau hợp đồng G2, nhưng chỉ khi có người phụ trách riêng; không cộng đơn giản thành ngày lịch hoặc giả định sẵn nhân sự. Nếu giữ mục tiêu luận đủ mọi12 cung gồmTật Ách, phần nghiên cứu/duyệt mới chưa có ước lượng đáng tin; báo rõ chặn trướcG4 Live thay vì tăng vô hạn task kỹ thuật.

**Đề xuất tại thời điểm khảo sát (đã được thực hiện, xem cập nhật dưới):** G1a, thiết kế và triển khai danh tính khách + Google Login trên QA, giữ quyền cũ, không paywall/chuyển Live; thời lượng1–2 ngày trongG1. Đầu ra: người dùng đăng nhập, quay lại đúng bản sở hữu, liên kết một phiên cũ có chứng minh, tài khoản khác bị chặn; cần Google Web client và callbackHTTPS. Zalo được thực hiện tiếp trong cùngG1 theo hợp đồng provider, không coiGoogle đạt làG1 hoàn tất. Trước codingG1a cần chốt chính sách claim/hạn ở V1-8, không chờ giải M06.

### G1a — tiến độ triển khai QA ngày 18/10/2026

Chủ dự án đã chốt: giữ phạm vi/hạn quyền cũ; chỉ claim bằng phiên sở hữu hợp lệ hoặc recovery đã xác minh; không gộp email/tên; Google không cấp admin. Thay trạng thái “chưa thực hiện” của đề xuấtG1a ở trên bằng: **đã tích hợp schema tài khoản/provider/session, Google Authorization Code + PKCE, liên kết quyền gốc, Lá số của tôi, logout và quyền API/PDF trên QA3062; hai ca còn thiếu đã khép bằng Google thật ngày18/10/2026**. Xem [bàn giao và cấu hình G1a](G1A-GOOGLE-LOGIN-QA.md).

Backup trước migration đã có; chỉ thêm schema008, giữ dữ liệu/kho QA chính và QA3070.22/22kiểm liên quan đạt; sau chặn bodyOAuth quá2KB, nhóm tài khoản10/10đạt, typecheck/build cuối đạt. Productionfixture hai tài khoản kiểm nguyên văn/hạn/PDF/truy cậpchéo đạt; **fixture không tính Google thật**. Chủ dự án đã đăng nhập Google thật thành công; máy chủ có1user/1Googleidentity và11liên kết giữ đúng hạn gốc. Đã sửa lỗi Origin của nativePOST bằng header riêng trang tài khoản; callback Google đã cấu hình đúng. Cùng tài khoản đã đăng nhập lại trên Chrome ẩn danh, danh sách11bản và hạn gốc được giữ; logout đã thu hồi phiên trước. Nghiệmthu bổ sung16:38–16:58 đã dùng2Googleaccount thật: PDF A200 với chỉcookieGoogle (khôngtrial/recovery), đúng8trang/toànvăn/hạn; Bkhôngthấy11bảnA, tạo/liênkết riêng1bản và quyềnđọc/PDFchéo bịchặn. Đã phânbiệt thao tácchủdựán với logHTTP, DB vàPDF tảithật trong bàn giao; các lượtA kiểmchéo còncookiecũ không được gọiGoogle-only.11bảnA nguyênhash/hạn,12quyềnA+B đúnghạngốc. Không sửacode hoặc chạytest/build lại trongđợtnghiệmthu. **G1a đã khép; G1 vẫn chưa đầyđủ vì Zalo chưa triểnkhai, không tự mởG2.**

**Giữ mục tiêu nội dung12cung đã giao**, không chuyển thành báo cáo phạm vi rútgọn vì đang làm tài khoản. Quyết định miền nội dung/phê duyệt và các khoảng thiếu ở V1-4 vẫn còn nguyên.

### G1b tạm hoãn / G2 — QA ngày 18/10/2026

Theo yêu cầu mới của chủ dự án, **G1b — Zalo Login tạm hoãn do chờ xét duyệt**. G1a Google giữ nguyên. G2 đã được triển khai trên QA3062, không cần chờ Zalo; không mở G3/G4 trong lượt này.

- Báo cáo mới từ `/lap-la-so` lưu chính sách **menh-free-1.0.0**. Khách/Google chưa có quyền đầy đủ chỉ nhận nguyên nhóm Mệnh qua trang, JSON và căn cứ; trang in và PDF toàn bài bị chặn phía máy chủ. Không gửi đoạn khóa xuống trình duyệt. Phiên bản văn 1.47.0/catalog 1.45.0 không thay đổi.
- Báo cáo cũ thiếu marker chính sách vẫn theo quyền cũ. Không sửa bản lưu, không đổi hạn, không lấy ngày đăng nhập làm ngày gia hạn. Quyền đầy đủ tái sử dụng đơn → worker → bản đóng băng → `access_tokens`; liên kết tài khoản chỉ nhận quyền đã chứng minh.
- 12 cung phân biệt Mệnh miễn phí, có lời nhưng khóa, đã có quyền, và chưa có lời. Chưa mở bán; không đặt giá. Các nhóm Thân/liên cung chưa chốt phạm vi miễn phí được giữ nguyên nhóm trong manifest chính sách và ghi riêng, không cắt điều chỉnh/ngoại lệ.
- **Kiểm thực chạy:** 39/39 test thuộc 6 file; typecheck đạt; production build đạt một lượt (cảnh báo nhiều lockfile). HTTP production với hai tài khoản fixture, 3 bản lưu, 1 đơn mock trên database riêng kiểm JSON/HTML/RSC/print/PDF, quyền chéo và legacy. Một PDF 9 trang khớp 22/22 đoạn +3/3 ghi chú; fixture không tính là thanh toán hoặc Google Login thật mới.
- QA3062: tạo bằng biểu mẫu, mở lại đúng bản `750f65a9-5101-4d2e-8000-895993d06a16`; 7 đoạn Mệnh, 12 trạng thái; mobile360/390 không tràn ngang, mở căn cứ được. Hai Google users/12 liên kết hiện có và mọi hạn/hash quyền cũ không đổi. 34 bài Toàn thư giữ nguyên; QA3070 không tác động.
- Bảo toàn: backup29 bảng;31 file nội bộ +38 file trial trước sửa; toàn bộ file cũ nguyên hash, chỉ thêm1 bản QA mới;54 file engine/catalog/calendar không đổi. Không migration. Chỉ rate-limit counters thay đổi trong29 bảng chính sau nghiệm thu.

Chi tiết: [G2 — quyền đọc trên QA](G2-READING-SCOPE-QA.md). Đã khép kỹ thuật G2 ở phạm vi QA bằng quyền thử trong database cô lập. **Không đồng nghĩa đã chốt gói bán:** G4 vẫn cần giá/hạn/chính sách và đơn gắn tài khoản; việc hoàn thiện nội dung12cung vẫn bắt buộc trước mở bán. Chưa mở SePay Live, chưa cấp quyền trả phí cho khách QA chính. Không triển khai Zalo/G3/G4 tiếp trong lượt này.

### G3 — Không gian khách hàng và bài đọc, QA ngày 19/10/2026

**Đã triển khai và kiểm trong phạm vi G3.** [Bàn giao và bằng chứng](G3-CUSTOMER-WORKSPACE-QA.md). [Lá số của tôi](https://61ac-171-246-109-226.ngrok-free.app/la-so-cua-toi), [tự nhập](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so).

- Tìm tên/mã, có/không dấu, phân trang 8 mục; ngày tạo/hạn/quyền. Báo cáo đã mua và Đơn hàng truy dữ liệu thật, phân biệt đơn test và trạng thái trống. Không tạo số liệu mẫu trên QA chính.
- Tạo khi đang đăng nhập tự liên kết đúng bản với tài khoản qua chứng minh phiên sở hữu. Retry không tạo trùng/gia hạn. Sửa thông tin theo resolver quyền dùng chung, tạo edition mới; bản gốc không đổi.
- Mệnh mở sớm; lá số thu mặc định; mục lục12cung và mở/thu, nhãn miễn phí/đã mở/khóa/chưa có lời; căn cứ đóng, trở lại đúng đoạn; điểm đọc giữ khi tải lại hoặc quay về từ tài khoản. Tài–Điền giữ một nhóm nội dung, dẫn chiếu không nhân đôi.
- Không đổi policy/projection G2,5ruleMệnh–Thân giữ riêng, nguyên văn bản lưu hoặc PDF. Giữ phiên bản nội dung1.47.0/catalog1.45.0. Không migration, không mở bán/Live; QA3070 nguyên môi trường.
- Bằng chứng:43/43 lượt đầu7file;11/11 sau sửa thư viện; test form4đạt/1lỗi do mock quyền cũ, sửa mock và giữ assertion rồi5/5; thêm kiểm anchor6/6; tài khoản10/10; tìm Đ/đ cuối5/5. Typecheck/build cuối đạt. HTTPproduction và trình duyệt360/390/1280 đã kiểm; không chạy gate nội dung hoặc xuất PDF lại. Hai tài khoản trong G3 là fixture cô lập, không tính là Google Login thật mới; bằng chứng Google thật G1a giữ nguyên.
- Mọi tệp có trước trong hai kho chính giữ hash;54tệpengine/catalog/lịch không đổi;34bàiToàn thư còn công khai. Chỉ rate_limits thay đổi trong DB và có thêm bản mới từ hoạt động QA, không ghi đè lịch sử.

**Điểm còn lại:** chủ dự án duyệt trải nghiệm; G1bZalo vẫn chờ; G4chưa triển khai. Cổng nội dung12cung vẫn bắt buộc trước mở bán, không dùng việc đủ12mục giao diện để khép G0. Tra cứu tên bản đã hết hạn phụ thuộc metadata còn được giữ theo chính sách lưu hiện có; không tự tăng hạn lưu hoặc quyền. G3 không mở sang gói tiếp theo.


### G4 — Checkout một gói Test Mode, QA ngày 19/10/2026

**Đã triển khai trên QA3062**, chỉ mở cho hai tài khoản Google A/B theo chỉ định chủ dự án. [Bàn giao G4 và bằng chứng](G4-TEST-CHECKOUT-QA.md). Bản nội dung 1.47.0 / catalog interpretation-1.45.0 / policy menh-free-1.0.0 giữ nguyên. Checkout g4-test-1, offer qa-g4-1.0.0: **1.000đ mô phỏng, 72 giờ từ paid_at, chờ trả 60 phút** — không phải giá/hạn thương mại.

- Cung khóa → phạm vi thật (có lời/chưa có lời) → Google → đơn/QR → webhook/API hiện có → worker giao đúng bản lưu → điểm cung gốc. Đơn/báo cáo/PDF kiểm quyền máy chủ, điều khoản cố định theo đơn, retry không tăng hạn hoặc tạo quyền trùng. Thư viện có đơn và gói thử đã giao. Không có nút tự paid, không gửi email G4.
- SePay thật: #39519 sai 2.000đ không cấp quyền; #39520 đúng 1.000đ giao đơn CORE64D308A2F679. Chủ dự án tải PDF “G4 nghiệm thu”, 8 trang, đủ 19 đoạn bản lưu. Hash gốc/binding/bản giao trùng nhau.
- API Sandbox thật nhận cùng #39520 bằng UUID khác webhook ID và trả duplicate; chạy lại vẫn 1 giao dịch thanh toán/1 job/1 report/1 grant/1 liên kết. Dashboard hiện không có nút phát lại theo phản hồi chủ dự án: **chưa xác nhận resend webhook thật**, không thay bằng chứng đó bằng mock. Webhook lặp và sai mã/tài khoản đã có test fixture.
- Kiểm tập trung: 58/58 lượt đầu 7 file; lượt bổ sung 19 đạt/3 lỗi do ID sự kiện fixture dùng lại, sửa fixture không đổi assertion rồi 22/22; sau phần scope trước đăng nhập 6/6. Typecheck lỗi kiểu literal trong test đã sửa; typecheck/build cuối đạt. Mobile360/390 QR/copy/đã giao/return đã kiểm qua production UI fixture; Google/SePay/PDF thật ghi riêng. Không chạy toàn bộ gate hoặc bộ PDF.
- Backup trước migration009; mọi tệp lịch sử cũ và 54 tệp engine/catalog/lịch nguyên hash. Thêm đúng một bản G4; OAuth/rate/checkpoint thay đổi do hoạt động. QA3070, Toàn thư34 bài và quyền/hạn cũ giữ nguyên.

**Chưa mở bán/Live, không chuyển sang G5.** Hoàn thiện nội dung12cung vẫn bắt buộc trước mở bán; G1bZalo chờ xét duyệt. Giá/hạn/chính sách thương mại chưa chốt. Google thật: chủ dự án xác nhận tài khoản còn lại bị chặn cả đơn/đọc/PDF. Trình duyệt thật đang ở báo cáo #cung-11 với Huynh Đệ mở; nút quay lại thuộc trang checkout, chưa xác nhận click thật từ đó. Test UI fixture đã đạt; không đồng nhất hai mức bằng chứng. Thời gian gói khoảng28 phút.


## V1-7. Điểm kết thúc và cổng phát hành

- **Cổng nội dung:** từng cấu trúc được chào bán đáp ứng V1-4; Tật Ách và thiếu phép tổng hợp được công bố đúng. Không tự tuyên bố34 bài Toàn thư đã duyệt đồng nghĩa báo cáo cá nhân đã duyệt. Không tăng rule để hoàn thành số mục.
- **Cổng quyền:** hai tài khoản/phiên không đọc chéo; chưa mua không nhận lời khóa quaAPI/SSR/căn cứ/PDF; grantcũ giữnguyên; hết hạn/thu hồi không sống lại bởilogin/email; thử tokenlặp/hết hạn và chuyển domain.
- **Cổng giao hàng:** một giao dịch/đơn/bản/quyền; Test/Live tách; retry không dựng lại; paid nhưng giao/PDF/email lỗi nhìn được và khách vẫn mở phần được cấp đúng.
- **Cổng trải nghiệm:** đọc sớm, mục lục/12 cung/nguồn, quay lại chỗ đọc; mobile360/390, desktop; tên dài/bài ngắn/dài/nhiềuđiều chỉnh PDF; không thử hàng loạtPDF khi không đổi phần đó.
- **Cổng vận hành:** admin xác thực server,actor/audit; backup DB+kho phục hồi đúng bản;HTTPS/worker/Chromium thực trênUbuntu; bảo vệsecret, giới hạn tạo/gửi, nguồn lỗi đủ điều tra.
- **Cổng thương mại:** giá, hạn, nội dung nhận được, chính sách hỗ trợ/hoàn tiền/quyền riêng tư được chủ dự án duyệt; SePay Live và email gửi khách chỉ mở sau nghiệm thu/ủy quyền riêng. Không coi mở publicbeta miễnphí là cho phép thu tiền.

V1 kết thúc khi các góiG0–G7 và cổng của **phạm vi đã được duyệt** đạt. Những phép phân cách, M06/Phủ–sát chưa chốt, vận hạn, Hợp hôn, OA/ZNS, AI, score, mở rộngToàn thư, dashboardBI, thao tácadmin hoàn tiền/retry/cấpquyền tay không tự nối thành V1.1. Nếu còn phần nguồn ngoài phạm vi, ghi danh sách và dừng; nếu phần đó thuộc lời hứa đang bán thì chưa được khép V1 trả phí.

## V1-8. D — Những quyết định thực sự cần chủ dự án chốt

Dùng [danh sách quyết định cụ thể trong bảng tổng hợp21/10](#quyết-định-cụ-thể-cần-chủ-dự-án-trả-lời). Danh sách đó thay câu hỏi cũ đề nghị hạ mục tiêu xuống12 cung tra cứu/chỉ bán một số cấu trúc: **chủ dự án đã nhắc lại mục tiêu đủ12cung cho mọi khách hàng**, không hỏi lại để giảm phạm vi. G2/quyền lịch sử/danh tính/admin đã chốt, không xin duyệt lại những nguyên tắc đó.

Việc còn cần chốt là người thẩm định và tiêu chíTật; phạm vi loại trừ ND19; mức đầy đủ theo phương diện; giữ nguyên phân phối ND02; sau cổng nội dung mới chốt điều khoản/quyền nguồn/vận hành thương mại. Phương án trong bảng chưa phải phê duyệt hoặc quyền triển khai/publish/Live.

## V1-9. Dấu vết và giới hạn của lần chốt phạm vi

Tài liệu dự án đã dùng: [QA-MAIN-EMAIL-MERGE](QA-MAIN-EMAIL-MERGE.md), [đối soát SePay](SEPAY-TEST-RECONCILIATION.md), [34 bài công khai](TOAN-THU-V1-DANH-SACH-DUYET-34-BAI.md), [độ phủ Tân Biên](TANBIEN-READING-COVERAGE.md), [audit Mệnh–Thân](TANBIEN-MENH-THAN-SUPPLEMENT-AUDIT.md), các đặc tả được dẫn ở V1-4. Có nhật ký fulltext cũ nhưng thiếu bằng chứng phân tích một số phần; không ghi nhầm “chắc chắn chưa từng đọc”.

So với kế hoạch cũ: thêm tài khoảnGoogle/Zalo và thư viện sở hữu; đổi **chính sách tương lai** từ3 nhóm/free-full sangMệnh-free/11 cung trả phí; mở admin tối thiểu thành phạm vi vận hành hữu hạn; tách rõ cổng nội dung/kinh doanh khỏi kỹ thuật; giữ lịch sử/quyền cũ; bỏ lịch cũ như một cam kết; triển khai Ubuntu tạm hoãn. Toàn thư34public và recovery/Gmail hợp nhất đã có, không đưa lại thành việc xây từ đầu.

Chưa xác minh được màn thanh toán thực tế của tuvi.work, bài trả phí/PDF, lịch sử đơn, hoặc tương tácmobile/giữ vị trí trong phiên mới. Những thiếu sót khảo sát này được ghi rõ; không ngăn việc đặc tả hệ thống của mình dựa trên yêu cầu chủ dự án và code đã có. Không có kết luận về độ đúng phương pháp đối thủ. Các ảnh riêng được giữ tại máy, không xuất bản lại hay nhúng nguyên văn đối thủ vào bàiTinhLuận.

Lượt này chỉ cập nhật tài liệu và bằng chứng tham khảo; không sửa code/catalog/engine/snapshot/báo cáo/CMS, không chạy test/build/PDF, không thay QA3062/3070/tunnel hay thực hiện thanh toán. Tài liệu cũ được giữ nguyên văn dưới đây để tra lịch sử; trạng thái cũ “34 nháp”, “chưa cóCMS/SePay/email” không còn là baseline hiện hành.

---

<details>
<summary>Nhật ký kế hoạch cũ — chỉ để truy vết, đã được đặc tả V1-0…V1-9 phía trên thay thế</summary>

# Kế hoạch bàn giao Tinh Luận V1

> Toàn thư V1 đã khép **soạn thảo 34/34 bài** (8 nền + 12 cung + 14 chính tinh), chờ chủ dự án duyệt nội dung và quyết định xuất bản. Chưa ghi nhận duyệt; đã xuất bản 0/34. Giữ toàn bộ là nháp. [Danh sách duyệt cuối cùng, có liên kết từng bài](TOAN-THU-V1-DANH-SACH-DUYET-34-BAI.md); bài bổ trợ Vũ Khúc–Văn Khúc và fixture không tính vào 34. Cập nhật 18/10/2026.


Ngày lập và cập nhật phạm vi: **15/10/2026**. Ngày bắt đầu kế hoạch: **16/10/2026**. Kế hoạch hữu hạn từ ứng viên nội bộ đến beta có kiểm soát; không mở tiếp chuỗi bổ sung rule.

> Cập nhật vận hành 16/10/2026: Toàn thư bản đầu đã có CMS và trang tra cứu thật; ba bài mẫu còn nháp chờ duyệt. Xem mục “Toàn thư bản đầu — 16/10/2026” cuối tài liệu. Các kiểm kê “chưa có CMS” bên dưới là mốc lịch sử, không phải trạng thái hiện tại.

## 1. Điểm xuất phát và tiêu chí hoàn thành

Đã kiểm trực tiếp mã nguồn: trình bày **1.47.0** (`lib/internal-review/customer-report.ts`), catalog **interpretation-1.45.0** (`lib/interpretation-rules/catalog.ts`). QA bàn giao **3055**, đường vào [tự nhập nội bộ](http://127.0.0.1:3055/internal/customer). Lượt này không gọi QA, không xác nhận uptime, không đổi môi trường. Không thấy AGENTS.md tại repo, docs và các thư mục cha đã kiểm. Checkout không có `.git`; dùng manifest cho mốc phát hành, không tự gán commit.

Đã dùng:

- [Bàn giao gần nhất](/Volumes/DATA/TINHLUAN/.local/natal-system-20261015/ban-giao.md), phạm vi/đặc tả và kết quả kiểm chứng trong đó.
- [Kiểm kê đọc Tân Biên](/Volumes/DATA/TINHLUAN/docs/TANBIEN-READING-COVERAGE.md).
- [Audit Mệnh–Thân, gồm cập nhật229–237](/Volumes/DATA/TINHLUAN/docs/TANBIEN-MENH-THAN-SUPPLEMENT-AUDIT.md).
- [Vận hành](/Volumes/DATA/TINHLUAN/docs/OPERATIONS.md), [luồng khách demo](/Volumes/DATA/TINHLUAN/docs/CUSTOMER-JOURNEY-QA.md), [quyền beta](/Volumes/DATA/TINHLUAN/docs/BETA-READING.md).

**Không coi kiểm thử lịch sử là kiểm thử mới.** Bàn giao1.47 ghi gate logic3002 đạt, sau đó có vá trình bày và46 test ảnh hưởng; E2E cuối19/19, kiểm PDF134trang và sửa race hydration đã tái hiện. Đây là bằng chứng tái sử dụng có phạm vi, không chứng nhận luồng mua1.47 đã hoạt động. Luồng đơn demo ngày08/10 giao bản dữ kiện cũ; chưa nối đầy đủ bản khách hàng mới.

V1 hoàn thành khi một người trong miền dữ liệu hỗ trợ đi hết luồng dưới đây, nội dung/giá/quyền đúng lời hứa, admin xử lý được lỗi, và các cổng phát hành được nghiệm thu. **V1 hoàn thành không có nghĩa phân cách hoặc tổng hợp đầy đủ Mệnh–Thân.** Không lấy số trang, rule hay test làm tiêu chí đầy đủ chuyên môn.

## 2. Quyết định phạm vi cập nhật — U1a đang tạm hoãn

**Chưa có lệnh phát hành hoặc triển khai giao diện thật.** U1a chưa thực hiện và tiếp tục tạm hoãn. Lượt nghiên cứu trước chỉ sửa tài liệu; không sửa ứng dụng, không gọi QA3055, không chạy test hoặc xuất PDF. Đã kiểm lại hằng phiên bản và các đường payment/worker; chưa có adapter SePay. Không thấy mô-đun Hợp hôn hoặc CMS Toàn thư trong các đường app/lib/components và tìm kiếm tên liên quan. Đây là kiểm kê nhanh mã, không phải kiểm thử chạy. Lượt tiếp theo đã được cho phép dựng prototype riêng theo **phương án A** để duyệt trải nghiệm; kết quả và giới hạn ở §13, không đánh dấu các tính năng sản phẩm là đã hoàn thành.

**Khuyến nghị phương án A:** V1 gồm báo cáo bản mệnh, Toàn thư khởi đầu, admin và thanh toán SePay thử; Hợp hôn được thiết kế thành mô-đun riêng và triển khai sau khi phương pháp được chốt. **Phương án B** đưa Hợp hôn vào cùng V1, nhưng ngày beta phụ thuộc cổng xác minh phương pháp; không dùng điểm hợp nhau hoặc ghép hai cung Phu Thê để lấp chỗ thiếu.

Thay đổi so với kế hoạch trước:

- Thêm Toàn thư có tìm kiếm, bài riêng, nguồn và quản lý phiên bản trong admin; giới hạn ban đầu 34 bài đề xuất, không nhập toàn sách.
- Thêm đặc tả sản phẩm Hợp hôn và một gói nghiên cứu hữu hạn trước coding phép so hai hồ sơ. Bỏ câu loại trừ tuyệt đối “so nhiều lá số” khỏi mọi phương án; giữ nó ngoài báo cáo bản mệnh và ngoài phương án A.
- Chốt nhà cung cấp **SePay API ngân hàng + VietQR + webhook + API v2**, thay mục “chọn một provider”. Không mặc định đó là sản phẩm Cổng thanh toán/IPN hoặc Bank Hub của SePay.
- Làm rõ bố cục mobile, trạng thái khóa nội dung, quyền khách, luồng cùng điện thoại và Toàn thư miễn phí. Giữ đỏ trầm–kem–vàng, không sao chép phong cách hoặc văn luận của đối thủ.
- Thay lịch cũ 17–26 ngày công bằng hai lịch ở §10; lịch cũ không còn là mốc cam kết. Giữ lại phần code tái sử dụng và việc đọc nguồn còn mở.

Giới hạn bản mệnh không đổi: profile `tanbien-vn-trial-v2`, miền ngày hiện hỗ trợ 1976–2050 và giờ dân sự theo hợp đồng hiện hành; không tự đổi lịch/mốc năm hoặc chấp nhận đầu vào API chưa phục vụ. Thiếu giờ phải báo trước mua. Chưa phân cách hoặc tổng hợp đầy đủ Mệnh–Thân; không thêm rule, vận hạn, scoring, AI tự luận, sức khỏe/sinh tử hoặc quy kết phẩm hạnh để hoàn thiện giao diện. Trạng thái chuyên môn và lịch sử giữ trung thực; quyền đọc beta không phải phê duyệt chuyên môn.

## 3. Khảo sát trải nghiệm tham khảo — bằng chứng và giới hạn

Khảo sát ngày 15/10/2026 trong trình duyệt, desktop **1280×900**, mobile mô phỏng **390×844 và 360×800**; chưa thử điện thoại vật lý/Safari/iOS. Chỉ dùng dữ liệu hư cấu, không gửi hồ sơ 1992/Kim Thoa. Không đăng nhập, trả tiền, gọi AI hoặc tải PDF đối thủ. Thao tác đổi viewport không chứng minh mọi breakpoint đều đạt.

| Luồng / nguồn | Đã thực sự thao tác | Chỉ quan sát/đọc | Chặn hoặc chưa xác minh |
|---|---|---|---|
|[Lập lá số](https://tuvi.work/#lap-la-so), desktop|Điền “Mẫu thử A”, 15/06/1990 dương, nam, giờ Tỵ; gửi và nhận trang lá số; mở liên kết luận giải.|Form tên, âm/dương lịch, ngày/tháng/năm, canh giờ, giới tính; kết quả có dữ kiện, phiếu 12 cung, nút in/ảnh, chuyển luận giải.|Không kiểm tính đúng an sao/lịch; chưa thử âm lịch, tháng nhuận, lỗi ngày hoặc giờ chưa biết. Không thấy nơi sinh/múi giờ trong form đã khảo sát.|
|Lập lá số, mobile 360px|Tạo hồ sơ giả “Mẫu mobile”, 01/01/1990, nam, giờ Ngọ; nhận đúng tên/giờ vừa nhập trên trang kết quả.|Header gọn, nội dung một cột; nút sang luận giải, in/PDF.|Chưa tải/in; đây không phải nghiệm thu responsive toàn website.|
|Luận giải, desktop và 390px|Mở từ phiếu; thử chọn tab 12 Cung và đóng hướng dẫn.|Có Tổng quan, Luận chi tiết AI, 12 Cung, Tứ Hóa, Vận Hạn, Bố Sao; liên kết bài dài 15 chương; lời mời đăng nhập đọc thử.|Lớp hướng dẫn vẫn còn và tab vẫn Tổng quan sau các lần thử, kể cả click trực tiếp. **Chưa xác minh chuyển tab/bài dài thành công**; không kết luận lỗi sản phẩm đối thủ hay nguyên nhân JS. Đã mở trực tiếp đường “Bản Luận Trọn Đời” được trang cung cấp và bị chuyển tới đăng nhập Google/Zalo; chưa đọc hoặc thử mục lục bài dài. Lưu lịch sử chưa kiểm vì chưa đăng nhập.|
|[Hợp hôn](https://tuvi.work/hop-hon), 390px|Nhập hai hồ sơ giả: A như trên, B 20/09/1993 dương, nữ, giờ Thân; gửi và thấy kết quả cho đúng hai tên.|Kết quả có điểm và nhãn; danh mục ngũ hành, Phu Thê, Tứ Hóa chéo, đào hoa; desktop 1280px có hai thẻ nhập cạnh nhau, kết quả phía dưới.|Luận từng mặt khóa đăng nhập. Không xác minh thuật toán/nguồn điểm; không kế thừa điểm, Tứ Hóa chéo hoặc lời khuyên hôn nhân. Desktop chỉ đổi viewport quan sát, không gửi thêm một cặp.|
|[Toàn thư](https://tuvi.work/toan-thu), desktop|Gõ “Vũ Khúc”, danh sách lọc còn bài tương ứng; mở bài Vũ Khúc.|Nhóm chính tinh/phụ tinh/12 cung/64 quẻ; bài có breadcrumb, tiêu đề, các mục, bảng, liên kết tổ hợp và theo cung.|Chưa kiểm toàn bộ tìm kiếm, typo/không dấu, admin, nội dung mọi bài. Không đem 64 quẻ vào phạm vi Tinh Luận.|
|[Bài Vũ Khúc](https://tuvi.work/toan-thu/sao/vu-khuc), 360px|Mở và xem bố cục mobile.|Bài một cột, các phần phân cấp và liên kết tra cứu.|Không đối chiếu nhận định chuyên môn của bài; không coi ghi tên sách là đã có chứng cứ đúng điều kiện. Không sao chép văn.|
|SePay (§8)|Đọc tài liệu chính thức qua web.|VietQR, webhook, API v2, Test Mode và yêu cầu xác thực.|Chưa đăng nhập dashboard, tạo tài khoản test/token/webhook, mô phỏng hoặc đối soát một giao dịch. Chưa xác minh quyền/gói dịch vụ của tài khoản chủ dự án.|

**Điều học được để áp dụng:** đưa thông tin hồ sơ và đường xem lá số lên đầu; tách bài đọc/tra cứu; danh mục ngắn, tìm nhanh, bài có mục lục; hai hồ sơ được nhận diện rõ. Tránh lớp tour/quảng bá chắn nội dung, thanh tab quá dài trên mobile và dữ liệu sinh nằm công khai trong URL. Chỉ tham khảo trải nghiệm, không nhập văn luận, điểm số hoặc phương pháp đối thủ.

## 4. Sơ đồ trang và hành trình khách

Các đường dưới là **đề xuất**, không khẳng định đã có route sản phẩm. Tận dụng component/API hiện hành, không dựng lại engine.

```text
/  Trang chủ Tinh Luận
├─ /lap-la-so → Xác nhận hồ sơ → /ban-doc/:id (cơ bản)
│  ├─ Xem lá số / tra 12 cung / Tứ Hóa
│  ├─ Xem phạm vi một gói “Báo cáo bản mệnh”
│  └─ /don-hang/:id → QR SePay → Chờ xác nhận → Đang chuẩn bị
│     └─ /bao-cao/:id → Nội dung chi tiết → PDF đọc / PDF kèm căn cứ
├─ /mo-lai → Liên kết email một lần → Các đơn/bản đọc được cấp quyền
├─ /toan-thu → Tìm kiếm / chủ đề → /toan-thu/:slug
├─ /hop-hon → Hai hồ sơ → Xác nhận cặp → Kết quả (chỉ khi đạt gate phương pháp)
├─ /pham-vi, /huong-dan, /lien-he, /dieu-khoan, /bao-mat, /chinh-sach-thanh-toan
└─ /admin → Đơn / Báo cáo / Lỗi / Đối soát / Toàn thư
```

**Miễn phí:** nhập và xác nhận, phiếu lá số, những nhóm đoạn cơ bản hoàn chỉnh lấy từ cùng bản nội dung, tra 12 cung/Tứ Hóa ở phạm vi dữ kiện, Toàn thư đã xuất bản. Không cắt điều chỉnh hoặc chỉ chọn vế thuận. Cơ bản không phải toàn bộ chi tiết gửi xuống client rồi ẩn CSS.

**Một gói trả phí bản mệnh:** các chủ đề thực có của đúng hồ sơ, bản lưu cố định, mở lại và hai PDF. Trước mua hiển thị phần nào có luận/đang chưa phục vụ; không hứa một chủ đề sẽ được bổ sung sau trả tiền. Nếu hồ sơ không có phần luận đủ để giao theo lời hứa gói, chưa chào bán hồ sơ đó; không đặt ngưỡng số claim thay đánh giá nội dung. Không đặt giá/hạn quyền theo gói demo 99/199/299 nghìn và 30/90 ngày. Nội dung chưa rõ nguồn không được biến thành lợi ích trả phí.

**Thanh toán:** đơn khóa hồ sơ, scope, số tiền và edition; QR và thông tin chuyển khoản đúng đơn → máy chủ kiểm giao dịch → worker giao đúng artifact → đọc ngay trong phiên sở hữu đơn, đồng thời gửi email. Email lỗi không làm mất quyền hoặc buộc mua lại. Trạng thái riêng: chờ trả tiền / đang xác minh / cần hỗ trợ / đang tạo / đã sẵn sàng / lỗi tạo; không báo thành công chỉ do bấm “đã chuyển”.

**Mở lại:** tái dùng phiên đơn và magic link, chưa xây tài khoản mật khẩu/social login. ID chỉ là định danh, không phải quyền. URL không chứa tên/ngày sinh hoặc secret; kiểm quyền trên web, API và PDF. Chốt thời hạn quyền trước bán.

**Toàn thư:** tra từ menu hoặc thuật ngữ trong căn cứ; quay về đúng đoạn đang đọc, không mất hồ sơ. Tra cứu giáo dục không tự chạy rule lên người xem.

**Hợp hôn:** là mô-đun riêng, không phần thưởng mở khóa báo cáo bản mệnh. Ở phương án A chưa có nút gửi cặp hoặc nhận tiền; menu giới thiệu có thể ghi “đang nghiên cứu”, không quảng bá “đã sẵn sàng”. Ở B chỉ công bố đầu ra đã qua §7; chưa chốt miễn phí/trả phí cho mô-đun này.

## 5. Tính năng đã có và phần cần nối/xây

### Bằng chứng code và phần có thể tái sử dụng

| Thành phần / bằng chứng code | Đã có và tái sử dụng | Khoảng thiếu thực tế |
|---|---|---|
|`components/InternalBirthForm.tsx`, `app/api/internal-readings/route.ts`|Nhập/xác nhận, validation, request ID, tạo snapshot và bản frozen thật; có xử lý thiếu giờ, dữ liệu không hợp lệ.|Chỉ quyền nội bộ; cần hợp đồng preview sở hữu bởi phiên khách, không mở nguyên API nội bộ ra công khai.|
|`components/CustomerReading.tsx`, `lib/internal-review/customer-report.ts`|Bản cơ bản/chi tiết, chủ đề,12cung, căn cứ, văn đã biên tập dùng chung; renderer lịch sử riêng.|Gắn vào hành trình khách và quyền mua; tách lớp kiểm chứng nội bộ, giữ nguồn khách được phép xem.|
|`lib/internal-review/reading-store.ts`, `dynamic-reading.ts`|Frozen document lưu file riêng; tạo độc quyền, không ghi đè lịch sử.|Kho này khác `reports` PostgreSQL của đơn hàng. Cần một artifact có phiên bản gắn đơn; không tạo hai hệ dựng bài. Chốt lưu document trong DB hoặc kho riêng có tham chiếu/hash/backup.|
|`app/api/[...action]/route.ts`, `db/001_init.sql`|Đơn, snapshot giá/gói, trạng thái thanh toán/báo cáo, quyền sở hữu, retry/recover.|Tạo đơn đang `demoOnly`, scope `interpretation:false`; chưa có gói V1 đúng phạm vi. API tính snapshot theo luồng cũ; cần bảo đảm mua đúng hồ sơ vừa xem và phiên bản đã chốt.|
|`lib/jobs.ts`, `scripts/worker.ts`|Queue PostgreSQL, lock `SKIP LOCKED`, retry/backoff, report một lần mỗi đơn, email queue.|Worker gọi `buildReport` cũ. Phải giao bản khách hàng frozen1.47/thế hệ kế tiếp, giữ version lúc tạo đơn; lỗi/PDF/email không thu tiền lại.|
|`lib/reports/index.ts`, `interpretation.ts`, `lib/reading/customer.ts`|Luồng khách cũ có cổng approved claims và mẫu dữ kiện.|Không phải renderer đầy đủ1.47. Không chỉ bật biến môi trường để bán bản draft; cần đường release/edition được quyết định rõ, giữ cổng cũ và lịch sử.|
|`lib/security.ts`, `/recover`, API order/recover/exchange|Token ngẫu nhiên, hash trong DB, TTL, thu hồi, đổi magic link một lần; kiểm quyền theo đơn.|Nối cùng quyền sang bài frozen/PDF, kiểm truy cập chéo đơn/preview, khôi phục trên thiết bị khác và thời hạn gói mới; tuyệt đối không dùng ID làm quyền.|
|`app/api/internal-readings/[id]/report-pdf/route.ts`|Hai chế độ, phiên bản bản lưu, Chrome, mục lục/số trang, giới hạn export.|Chỉ nhận cookie nội bộ, in qua loopback. Cần endpoint khách theo quyền đơn, print credential giới hạn cho đúng artifact; không chuyển khóa admin sang trình duyệt khách. Cần vận hành PDF nhiều yêu cầu và cache/job phù hợp.|
|`lib/payments/index.ts`|Interface provider, mock HMAC, lưu event/transaction, chống trùng, kiểm tiền/mã/currency, enqueue.|**QR không phải QR ngân hàng**, recipient cố định `DEMO_RECIPIENT`, verify chỉ mock. Chưa có adapter thật hoặc sandbox nhà cung cấp.|
|`scripts/reconcile.ts`|Bù job cho đơn đã được đánh dấu paid, tổng hợp lỗi đối soát.|Không hỏi ngân hàng/provider; không phục hồi giao dịch mất webhook bằng chứng độc lập. Cần query trạng thái/đối soát thật và quy trình sai/thiếu/thừa/chuyển muộn.|
|`lib/notifications/index.ts`|Interface email, file local atomic, delivery ID.|Bị chặn production, chưa có gửi email thật hoặc cơ chế xử lý timeout sau khi provider nhận thư.|
|`app/internal/page.tsx`, beta store/CLI|Đăng nhập nội bộ, xem100báo cáo gần nhất, xem mẫu; beta có edition/grant/thu hồi.|Chưa là admin đơn hàng/lỗi/retry/đối soát có audit. Không cần viết lại trang kiểm chứng.|
|`lib/config.ts`, `components/Experience.tsx`|Trang demo, chọn gói/QR/chờ/mở báo cáo.|Nhãn “Toàn diện”, vận hạn/sức khỏe và ba gói không đúng V1. Phải thay phạm vi luồng mới; giữ snapshot gói cũ nguyên trạng.|

Điểm nghẽn chính là **nối bản đọc mới với đơn hàng, quyền và worker**, sau đó adapter thanh toán/email thật; không phải chỉ thêm một nút QR.


### Phân loại theo sản phẩm cập nhật

| Tính năng | Đã có | Cần nối | Cần xây | Cần nghiên cứu/chốt chuyên môn |
|---|---|---|---|---|
|Nhập → lá số → cơ bản/chi tiết|Form/API/reader nội bộ, lưu bất biến|Đường khách, phiên sở hữu, edition được phép giao|Vỏ hành trình mobile, thông báo lỗi và xác nhận rõ|Khóa lời hứa bản mệnh; không mở thêm rule|
|Báo cáo và PDF|Bản khách hàng 1.47, hai PDF nội bộ|Order/worker tới artifact mới và quyền tải|Job/cache export, màn chờ/lỗi và delivery khách|Phê duyệt nội dung/nguồn là việc riêng|
|Đơn, quyền, mở lại|DB, token/hash/TTL, queue/retry|Luồng cũ sang bản frozen mới, email thật|Trang một gói và trạng thái đầy đủ|Giá, thời hạn, chính sách hoàn/hủy|
|SePay|Adapter Test Mode HMAC + inbox + atomic paid/queue đã kiểm cục bộ (§20)|Giao dịch mô phỏng từ dashboard SePay khi có cấu hình Test Mode|Checkout/QR khách, API đối soát, vận hành Live vẫn chưa làm|Không liên quan rule tử vi; chưa xác minh giao dịch SePay-origin|
|Admin vận hành|Trang kiểm chứng/đăng nhập nội bộ, beta edition/grant|Quyền owner, danh sách artifacts, lỗi jobs|Tìm/lọc đơn, retry có audit, đối soát, thu hồi|Không cho admin sửa claim/lịch sử hoặc tự gán chuyên gia duyệt|
|Toàn thư|Nguồn/audit/glossary nội bộ để tham khảo|Liên kết thuật ngữ/căn cứ → bài public|Schema bài/version, search, trang chi tiết, CMS|Biên tập 34 bài, phân biệt định nghĩa và lời riêng; quyền nguồn|
|Hợp hôn|Validator/engine một hồ sơ có thể dùng lại|Hai snapshot, quyền cặp và nguồn phiên bản|Form cặp, màn kết quả, lưu/truy vết nếu phương pháp đạt|**Chưa có đặc tả so hai người đã được xác minh**; điều kiện/ngoại lệ/hướng quan hệ chưa đủ|

## 6. Toàn thư khởi đầu — hữu hạn, miễn phí

**Đề xuất 34 bài:** 14 chính tinh; 12 cung (Tật Ách chỉ phạm vi/khái niệm, không chẩn đoán); 8 bài nền: (1) Mệnh và Thân, (2) Bản Mệnh và nạp âm, (3) Cục, (4) hành sao và hành cung, (5) trạng thái sao, (6) tọa thủ/đồng cung/chiếu/hội, (7) Tứ Hóa, (8) Tuần–Triệt. Đây là giới hạn biên tập khởi đầu, không hứa mỗi sao tại 12 cung hoặc toàn bộ phụ tinh/tổ hợp. Không nhập Kinh Dịch, vận hạn, nội dung bệnh/sinh tử hoặc nhận định phẩm hạnh.

Mỗi bài có tóm tắt dễ hiểu, phạm vi, thuật ngữ/định nghĩa, điều kiện quan trọng, khác biệt nguồn đã xác minh, nguồn/trang, bài liên quan và ngày cập nhật. Dùng diễn giải tự biên tập từ hồ sơ nguồn đã có, trích ngắn khi cần; không sao chép đối thủ hoặc đăng toàn bản sách. Không xuất mệnh đề còn mơ hồ thành công thức chung. Những phần chưa chốt được nêu đúng giới hạn; chưa có nội dung thì không tạo trang SEO rỗng.

**Admin tối thiểu:** danh sách/tìm/lọc theo nhóm/trạng thái; sửa bản nháp; xem trước desktop/mobile; kiểm nguồn và liên kết; xuất bản/ẩn bài, xem lịch sử và khôi phục một phiên bản bằng bản mới. Trường dữ liệu: slug, tiêu đề, nhóm, đoạn có ID ổn định, refs sách/hash/trang, giới hạn, bài liên quan, version, người biên tập, người duyệt nội dung nếu thực có, thời điểm xuất bản. Trạng thái biên tập `draft → in_review → published` tách khỏi `rule.review`; không ghi thẩm định chuyên môn giả. V1 một owner, ghi nhật ký thao tác; chưa xây cộng tác nhiều vai trò hoặc editor kéo-thả phức tạp.

**Điểm dừng:** 34 bài có kiểm nội dung, tìm có/không dấu theo tiêu đề/từ đồng nghĩa đã khai báo; URL ổn định, không lộ draft, bài liên quan không gãy. Nếu bài nào chưa đủ nguồn, ghi cụ thể và quyết định có chặn phạm vi Toàn thư đã hứa không; không lấy 34 tiêu đề làm bằng chứng đủ nội dung. Quyền sử dụng nguồn là gate xuất bản, không đợi đến sau beta.

## 7. Hợp hôn — hợp đồng sản phẩm trước phương pháp

**Đầu vào dự kiến:** hai hồ sơ A/B, mỗi hồ sơ có tên hiển thị tùy chọn, ngày/lịch/tháng nhuận nếu hợp đồng hiện hành hỗ trợ, giờ/phút hoặc “chưa biết”, giới tính theo điều kiện nguồn, nơi sinh và múi giờ trong miền engine. Khách nhập dữ liệu người khác phải xác nhận có quyền sử dụng; không công khai URL kèm ngày sinh. Không tự điền giờ để có kết quả. Với thiếu giờ, chỉ chạy phương pháp thực sự không cần giờ nếu được đặc tả; nếu chưa có thì dừng kết quả cặp và giải thích.

**Đầu ra mong muốn, chưa phải tính năng đã có:** nhận diện hai hồ sơ và quy ước; từng phương diện quan hệ mà nguồn cho phép so; dữ kiện A/B nào tham gia; điều kiện, thuận/khó và ngoại lệ trong cùng ngữ cảnh; phần chưa xét; nguồn mở được; lưu một phiên bản cho cặp. Không có điểm/%, xếp hạng “đáng cưới”, khẳng định ngoại tình/ly hôn, chọn năm cưới hoặc khuyên cưới/bỏ. Hai bài Phu Thê đặt cạnh nhau chỉ là đối chiếu hai lời riêng, **không được gọi là luận hợp hôn**.

**Gói xác minh H0, 3–5 ngày công nghiên cứu có điểm dừng:**

1. Từ audit và mục hôn nhân/Phu Thê trong bốn sách hiện có, lập danh sách đúng những đoạn nói về **hai hồ sơ**, phân biệt với người phối ngẫu được mô tả trong một lá số.
2. Chốt tối đa một nhóm phương pháp liên quan: đầu vào, quan hệ có hướng A→B/B→A, lượng từ/vị trí, ngoại lệ, kết quả được phép, dữ kiện thiếu. Không lấy phép Mệnh–Cục hoặc ngũ hành trong một người chuyển sang hai người; không tự triển khai Tứ Hóa chéo từ trang tham khảo.
3. Viết bảng ca dương/âm/thiếu dữ kiện và mẫu engine cặp hữu hạn; đảo A/B phải giữ nghĩa hoặc đổi đúng chiều được nguồn nêu. Bằng chứng phải chỉ ra tác giả và trang, không chỉ tên sách ở footer.
4. Kết thúc bằng **go/no-go**: có ít nhất một phép so hai hồ sơ tạo nội dung hữu ích, đủ đặc tả và được chấp thuận phạm vi thì lập trình; nếu chưa đủ, bàn giao đúng câu còn thiếu và Hợp hôn vẫn sau V1. Không nối dài nghiên cứu hoặc tạo output giả để giữ ngày hẹn.

Khoảng thiếu hiện nay: chưa có schema/claim quan hệ hai người; chưa xác minh một công thức đối chiếu/cứu giải giữa hai lá số; chưa chốt miền cặp/giới tính và trường hợp giờ thiếu; chưa chốt miễn phí hay gói riêng. Những lời riêng về hôn nhân trong catalog không giải quyết các thiếu hụt đó. Lượt này **không đọc lại sách để kết luận H0 đã đạt**, cũng không kết luận sách không có phương pháp.

Nếu H0 đạt, H1 xây form cặp + evaluate theo đặc tả + trace/lưu/quyền; H2 biên tập theo phương diện và kiểm cơ bản/chi tiết/PDF nếu được đưa vào scope. Không sửa engine một hồ sơ. Mọi quy tắc mới cần phiên bản và nghiệm thu riêng; không dựng module chấm điểm cạnh evaluator hiện hành.

## 8. SePay — hướng tích hợp đã đối chiếu tài liệu chính thức

Chọn **API ngân hàng** theo yêu cầu, dùng tài khoản nhận tiền của chủ thể bán hàng. Không tích hợp OAuth cho nhiều người bán/Bank Hub hoặc Cổng thanh toán thẻ/IPN trong V1. Trang [API ngân hàng](https://sepay.vn/api-ngan-hang.html) là điểm vào; đặc tả kỹ thuật theo Developer Portal dưới đây. Các con số/hợp đồng cần đối chiếu lại lúc coding; chưa gọi API có xác thực trong lượt nghiên cứu.

### 8.1 QR và thanh toán trên một điện thoại

Tài liệu hiện hướng dẫn ảnh VietQR tại `vietqr.app/img` với ngân hàng/tài khoản, số tiền và nội dung; QR có thể tải ảnh. Quy tắc VA/nội dung phụ thuộc ngân hàng, nên chỉ chốt cấu hình sau khi biết ngân hàng và loại tài khoản chủ dự án. Không lấy QR mock hiện tại làm QR thật. [Nguồn VietQR](https://developer.sepay.vn/vi/tien-ich-khac/tao-qr-code).

Thiết kế Tinh Luận: số tiền lấy server từ đơn bất biến; mã thanh toán ngắn duy nhất, không chứa thông tin sinh; hiển thị ngân hàng/chủ tài khoản/số tiền/nội dung cạnh QR. Có tải ảnh và sao chép từng trường cho khách dùng cùng điện thoại; không hứa deep link mở app ngân hàng khi chưa kiểm được. Hết hạn QR của giao diện không có nghĩa ngân hàng không nhận chuyển muộn: giao dịch muộn vào hàng xử lý hỗ trợ, không bị mất dấu hoặc tự cấp gói khác.

### 8.2 Webhook

SePay gửi POST giao dịch; tài liệu hướng dẫn có `id`, `accountNumber`, `code`, `content`, `transferType`, `transferAmount`, `referenceCode`. Phản hồi thành công được tài liệu hướng dẫn quy định HTTP 200/201 + JSON `success:true` trong 30 giây; webhook có thể gửi lặp, retry tối đa 7 lần trong tối đa 5 giờ. [Hướng dẫn webhook](https://docs.sepay.vn/tich-hop-webhooks.html).

Đề xuất dùng HMAC-SHA256 theo tài liệu: chữ ký trên timestamp + dấu chấm + **raw body**, kiểm timestamp và so chữ ký constant-time; secret chỉ server. API key header là phương án khác, không lẫn với Bearer token dùng để truy vấn API. Không tái dùng định dạng HMAC mock. [Xác thực webhook](https://developer.sepay.vn/vi/sepay-webhooks/xac-thuc).

Quyết định kỹ thuật của Tinh Luận: xác thực → lưu sự kiện bền vững/chống trùng theo môi trường/provider → kiểm tiền vào, đúng tài khoản/VA, mã đơn và số tiền → ghi giao dịch/paid/enqueue trong transaction → ACK; tạo report/email/PDF ở worker, không trong request webhook. Sai tiền/mã, thiếu/thừa, chuyển muộn, event gửi lại vào trạng thái có audit, không tự “paid”. Không lấy ảnh biên lai hoặc nút “đã chuyển” làm bằng chứng. Một giao dịch không mua hai đơn.

### 8.3 API đối soát

Tài liệu API v2 dùng `GET https://userapi.sepay.vn/v2/transactions`, có lọc ngày/tài khoản/chiều tiền, mã tham chiếu, phân trang (mặc định 20, tối đa 100) và `since_id`. [Danh sách giao dịch v2](https://developer.sepay.vn/vi/sepay-api/v2/giao-dich/danh-sach). Xác thực Bearer; rate limit được tài liệu v2 ghi 3 request/giây/IP, xử lý 429 và `Retry-After`. [Xác thực v2](https://developer.sepay.vn/vi/sepay-api/v2/xac-thuc).

Bổ sung job đối soát có checkpoint, phân trang/cửa sổ chồng lấn an toàn; dùng cùng bộ xác nhận giao dịch với webhook. Script hiện tại chỉ bù job cho đơn đã paid, chưa làm phần này. **Điểm phải kiểm bằng payload thật trong Test Mode:** ví dụ webhook dùng ID số, API v2 dùng UUID; không mặc định hai ID bằng nhau. Chốt khóa đối chiếu giao dịch theo hợp đồng provider/mã tham chiếu/tài khoản, lưu cả hai định danh; nếu chưa ánh xạ chắc thì vào hàng hỗ trợ, không tự cấp quyền lần hai. Khóa DB và replay phải kiểm trên cả hai đường.

### 8.4 Test Mode và giới hạn xác minh

SePay có Test Mode tách tài khoản ngân hàng, webhook, API Access và giao dịch khỏi Live; có mô phỏng giao dịch. Tài khoản phải có quyền Test Mode và hạn mức. [Tổng quan Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode). Token test chỉ dùng ở `userapi-sandbox.sepay.vn`, token Live ở `userapi.sepay.vn`; ví dụ API sandbox `/v2/bank-accounts`. [API Access Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode/api-access).

Kế hoạch thử: tạo cấu hình test riêng → mô phỏng đúng tiền/mã → webhook → worker → quyền → PDF; sau đó trùng/replay, sai tiền/tài khoản/mã, tiền ra, đến muộn, mất webhook và API đối soát, lỗi report/email, 401/429. Không quét QR Live để kiểm sandbox. Tách DB/secret/endpoint môi trường và nhãn Test Mode; không đưa token vào client/log/PDF.

**Chưa xác minh:** dashboard của chủ dự án, ngân hàng/VA cụ thể, quyền/gói API/hạn mức, payload có chữ ký và mapping ID, QR sandbox thực tế, khả năng nhận biến động Live. Tài liệu docs và developer có khác mô tả vị trí nút Test Mode/số lựa chọn xác thực; không lấy mô tả UI đó làm bằng chứng tài khoản đã hỗ trợ. Trước Live phải kiểm một giao dịch thật do chủ dự án chủ động phê chuẩn; lượt này không tạo tài khoản, chuyển tiền hay bật webhook.

## 9. Bố cục mobile và tiêu chí nghiệm thu trước coding

**Thương hiệu:** nền kem, chữ tối, đỏ trầm cho header/CTA/nhấn, vàng ấm cho điểm nhấn; không dùng vàng nhạt làm chữ dài trên nền kem hoặc dùng đỏ/xanh chấm tốt/xấu cuộc đời. Tái dùng tokens/component hiện có, không làm lại phiếu lá số.

| Màn | Bố cục mobile đề xuất | Desktop | Tiêu chí nghiệm thu |
|---|---|---|---|
|Trang chủ/nhập|Header gọn; CTA lập lá số; form một cột với nhãn cố định; bước xác nhận rõ tên/ngày/giờ/múi giờ; lỗi cạnh trường|Form và hướng dẫn ngắn cạnh nhau|360/390px không tràn; bàn phím không che CTA; giữ input khi lỗi; không mặc định giờ chưa biết; tab/focus đọc được|
|Kết quả cơ bản|Thông tin hồ sơ + nút xem lá số; ngay sau là nhóm đoạn có nghĩa; thanh “Chủ đề / Lá số / Tra cứu”; một CTA xem phạm vi chi tiết|Mục lục bên trái, nội dung có độ rộng đọc thoải mái|Không tour/modal bắt buộc; cơ bản giữ cả nền–điều chỉnh/ngoại lệ; 12 cung đúng dữ kiện dù không có lời; không gửi chi tiết chưa cấp quyền|
|Bài chi tiết|Nút Mục lục gọn mở danh sách/chọn chủ đề, tiêu đề neo; căn cứ đóng; hai PDF trong menu rõ|Mục lục bám cạnh bài|Không thanh tab dài bắt kéo ngang để tìm hết chủ đề; neo không bị header che; back giữ vị trí; bàn phím mở/đóng căn cứ và trở về focus|
|QR/đơn|Một cột: gói/phạm vi/số tiền → QR → sao chép/tải ảnh → trạng thái máy chủ và hỗ trợ|QR cạnh tóm tắt đơn|Khách dùng cùng điện thoại được; refresh/back không tạo đơn trùng; không lộ token; sai/thiếu/thừa/đến muộn không báo paid giả|
|Toàn thư|Tìm kiếm ở đầu, nhóm chủ đề, danh sách bài; bài có breadcrumb/mục lục rút gọn/nguồn/bài liên quan|Lưới danh mục, nội dung bài giới hạn chiều rộng|Tìm có/không dấu; không kết quả có hướng quay lại; không lộ nháp; nguồn đúng phiên bản; trở về báo cáo không mất đoạn|
|Hợp hôn nếu được duyệt|Bước A → B → xác nhận cặp, thẻ tóm tắt/sửa riêng; kết quả theo phương diện|Hai thẻ hồ sơ cạnh nhau|Không tráo A/B; đổi một hồ sơ vô hiệu kết quả cũ; thiếu giờ đúng trạng thái; không score hoặc lời suy từ hai bài riêng|

Chung: vùng chạm tối thiểu 44px, chữ thân bài tối thiểu 16px, độ tương phản WCAG AA, focus hiện, tăng chữ 200% không mất thao tác; kiểm 360/390px và desktop1280px, rồi một thiết bị thật iOS/Android phù hợp. Đường dài không có đoạn chung lấp trống; nguồn không chen thân bài. PDF dùng đúng artifact, không hướng dẫn click không thực hiện được; mục lục/số trang/ngoại lệ/nguồn offline. Không tạo phiên bản nội dung chỉ để đánh dấu sửa menu.

Nghiệm thu luồng: một hồ sơ mới ngoài bộ mẫu, một hồ sơ ít lời và một hồ sơ nhiều điều chỉnh → cơ bản → scope → đơn Test Mode → report/PDF → đổi thiết bị/mở lại; thử quyền chéo, mất webhook, retry, thu hồi. Toàn thư cần test publish/ẩn/rollback version và link từ báo cáo. Không dùng kết quả khảo sát đối thủ làm expected tử vi.

## 10. Công việc và hai phương án lịch

Đơn vị **ngày công 6 giờ**, một người thực hiện theo thứ Hai–thứ Sáu; công lập trình gồm kiểm thử/sửa lỗi phạm vi. Không giả định có đội song song hoặc tự chạy nền giữa các lượt chat. Ước lượng dựa trên code tái sử dụng ở §5, cần rà lại sau khi nối artifact/đơn. Thời gian chờ tài khoản/quyết định không nằm trong tổng công. Không cam kết ngày beta nếu chưa có lịch làm việc thực tế.

### A — V1 có Toàn thư, Hợp hôn sau V1 (khuyến nghị)

| Mã | Đầu ra và phụ thuộc | Lập trình/QA | Biên tập | Nghiên cứu |
|---|---|---:|---:|---:|
|R1|Rà nguồn hữu hạn §11 + định nghĩa/nguồn cho Toàn thư; chỉ chặn lỗi ảnh hưởng câu đang xuất|0|0|1–2|
|R2|Khóa phạm vi báo cáo và edition nghiệm thu, cơ bản/chi tiết, nhánh chỉ fixture; sau R1 và người duyệt|0|2–3|0|
|UX|Form/xác nhận, menu mobile, reader và màn gói/QR; tái dùng renderer; cần chốt scope|2–3|0|0|
|CORE|Nối preview→đơn→worker→artifact frozen; quyền/magic link/email; PDF khách theo đúng quyền, cache/job; sau R2/UX|5–7|0|0|
|ADM|Đơn/báo cáo/lỗi, retry/thu hồi có audit; schema đối soát; sau CORE|2–3|0|0|
|SEP|VietQR + HMAC/webhook + v2 đối soát + Test Mode trọn luồng; sau CORE/ADM, cần tài khoản test|3–5|0|0|
|TT1|CMS bài/phiên bản/xuất bản, search/trang/links; dùng quyền admin; sau ADM, schema nội dung được khóa|3–4|0|0|
|TT2|34 bài ngắn, nguồn/giới hạn/khác biệt, duyệt và liên kết; sau R1; đưa vào TT1|0|3–5|0|
|REL|Staging HTTPS/backup/restore/monitor; gate cuối, thiết bị thật/PDF/quyền; nghiệm thu và beta được mời, sau các mục trên|3–4|0|0|
|**Tổng**|**24–36 ngày công = 144–216 giờ, chưa chờ**|**18–26**|**5–8**|**1–2**|

Cửa sổ tính từ **16/10/2026**, giả định phạm vi và đầu vào tới đúng lúc; không có ngày nghỉ bổ sung trong khoảng này:

| Mốc | Công tích lũy | Dự kiến có điều kiện |
|---|---:|---|
|Báo cáo V1 ứng viên khóa phạm vi|3–5 ngày|20–22/10/2026|
|Giao diện khách QA|5–8|22–27/10|
|Đơn/quyền/worker/PDF nối bản mới|10–15|29/10–05/11|
|Admin vận hành|12–18|02–10/11|
|SePay Test Mode trọn luồng|15–23|05–17/11|
|Toàn thư + admin nội dung|21–32|13–30/11|
|Ứng viên beta có kiểm soát|24–36|**18/11–04/12/2026**|

Các mốc là đầu ra kỹ thuật/biên tập, không tự đồng nghĩa được phép thu tiền. Nếu R2 hoặc quyền nguồn chưa được chấp thuận, vẫn có thể chạy nội bộ; không gọi đó là đã ra mắt khách hàng. H0 chưa nằm trong công A, sẽ được lên lịch riêng khi chủ dự án chọn bắt đầu Hợp hôn.

### B — Đưa cả Hợp hôn vào V1

Giữ toàn bộ A; thêm **H0 nghiên cứu 3–5 ngày**, **H1 lập trình/QA 8–12 ngày** (cặp dữ liệu, phép xét được chốt, trace/lưu/quyền, UI và kiểm thử), **H2 biên tập 2–3 ngày**. Tổng **37–56 ngày công = 222–336 giờ**: lập trình/QA26–38, biên tập7–11, nghiên cứu4–7. Đây là giả định **một nhóm phương pháp hữu hạn**, không phải nhập tất cả phương pháp hôn nhân.

Làm H0 ngay sau R1, trước đầu tư H1. Các mốc lõi A nếu thực hiện tuần tự sẽ dịch thêm3–5ngày công; H1/H2 xong trước REL. Cửa sổ beta tất cả **07/12/2026–04/01/2027**, giả định H0 đạt, đầu vào đúng hạn và loại ngày01/01 khỏi lịch. **Không có ngày beta B đáng tin nếu H0 không tìm được phép so đủ rõ hoặc chưa được duyệt**; khi đó quay A hoặc chốt yêu cầu mới, không lặng lẽ giảm Hợp hôn thành hai bài riêng. Đây là lý do khuyến nghị A.

### Thời gian chờ tách riêng

- **Quyết định sản phẩm:** A/B; phạm vi34bài; giá/hạn quyền/chính sách hoàn-hủy của một gói; Hợp hôn miễn phí hay gói riêng nếu chọn B. Chưa có hạn phản hồi nên không tính ngày chờ vào công.
- **Tài khoản và hạ tầng:** SePay quyền Test Mode/API/ngân hàng nhận tiền và loại tài khoản, domain/staging HTTPS, DB/kho file, email gửi thử. Không yêu cầu gửi secret qua chat; chủ dự án cấu hình trong nơi quản lý secrets. Chưa có SLA cấp tài khoản; không hẹn ngày Live.
- **Biên tập/thẩm định/quyền nguồn:** chỉ định người chốt nội dung và quyền sử dụng; tách duyệt văn với duyệt chuyên môn. Không ghi giả approved. Hợp hôn thêm thời gian chờ thẩm định đặc tả sau H0.
- Nếu chờ trùng nhau, chỉ dịch thời gian thực sự chặn đường phụ thuộc, không cộng hai lần; có thể làm việc độc lập trước. Không lấy ngày trôi qua giữa hai lượt chat làm ngày công đã thực hiện.

## 11. Việc đọc nguồn còn lại và ranh giới V1


| Việc trong kiểm kê nguồn | Trạng thái cập nhật | Có chặn V1 không? / điểm dừng |
|---|---|---|
|P0–1:226–227 và P0–3:229–237|Đã có audit22mệnh đề, sau đó đối chiếu đủ9trang. Không còn coi chưa kiểm.|Không chặn chú giải cục bộ hiện có nếu không phát hiện rule sai chính nguồn của nó. Chặn lời hứa phân cách/tổng hợp toàn Mệnh–Thân; giữ ngoài V1.|
|P0–2a:44–51,60–61,81–84|Nhật ký nội dung còn thưa|R1 rà30–45phút, gắn từng ngoại lệ với rule đang xuất. Chỉ lỗi/thiếu điều kiện có tác động cụ thể mới chặn nhánh; không bắt phải nhập mọi câu sách.|
|P0–2b:102–117,122–123|Cần sổ ngữ cảnh/phụ tinh đầy đủ hơn|R1 rà45–60phút; kết thúc bằng ma trận rule đang dùng ↔ nguồn/ngoại lệ. M06 không có bằng chứng mới thì giữ nghiên cứu.|
|P0–4:54–55,36/76/77,118/120,163–164,190–197|Đã có hồ sơ câu khó, không phải tất cả chưa đọc|20–30phút sau các lượt trên; chỉ đối chiếu bằng chứng mới. Nếu vẫn chưa rõ, không xuất kết luận mới, giữ giới hạn ở chủ đề.|
|P1–5:225,228,243|Bổ luận/dữ liệu nền chưa có đủ ghi chú riêng|15–25phút; chỉ kiểm có chi phối câu V1 đang xuất không. Không tự mở luận mùa sinh/số con/sinh tử.|
|M06, Phủ–sát tinh; phụ tá/Trung/Hạ/Phi thường; bất nhất§19|Còn thiếu lượng từ, vị trí, trạng thái hoặc đúng đoạn đối chứng|Không là điều kiện bắt buộc để ra V1 giới hạn hiện hành. Bắt buộc không hứa đã xử lý. Không sửa NPL theo Tân Biên hoặc dùng ngoại lệ cục này cho mọi rule cùng sao.|
|19nhánh chỉ fixture theo bàn giao1.47|Chưa có mẫu engine dương, không phải bất khả thi|R2 ghi rõ rủi ro từng nhánh và mức kiểm chứng. Bounded witness review nếu cần; không tìm vô hạn. Trước paid release người duyệt quyết định phạm vi được giao, không dùng fixture gọi là đã E2E.|
|Luận vận, tiểu nhi, âm phần, bệnh/sinh tử/phẩm hạnh|Ngoài V1|Không đọc/coding thêm để đủ sách.|

Nguồn đã có ghi nhận đọc toàn277trang, nhưng không tương đương đã đặc tả/đối chiếu mọi logic. Không dùng548nhánh biên tập làm bằng chứng đọc hết sách hoặc đủ báo cáo.


Toàn thư bổ sung đúng 34 bài đề xuất ở §6; khi audit cũ chưa đủ cho một đoạn, kiểm đúng đoạn đó, không đọc lại sách theo thói quen. H0 là nghiên cứu **quan hệ hai hồ sơ**, không lẫn với P0–1 phân cách Mệnh–Thân. Không để yêu cầu mới âm thầm hợp thức hóa M06/Phủ–sát tinh hoặc phương pháp đối thủ.

## 12. Gate beta, quyết định cần chủ dự án chốt và điểm dừng

**Bắt buộc trước beta:** phạm vi có thể giao và các khoảng thiếu đã công bố; edition được cho phép; quyền khách tách admin; dữ liệu chi tiết/PDF không lộ khi chưa cấp quyền; lịch sử bất biến; SePay Test Mode, chống trùng hai đường webhook/API, lỗi worker/email có phục hồi; web/mobile/PDF nhất quán; backup/restore/monitor/rollback; các bài Toàn thư có nguồn và quyền xuất bản; bộ gate trên mã cuối. B có thêm H0 đạt và nghiệm thu phương pháp cặp. Không đánh đồng beta dự thảo với phê duyệt chuyên môn.

**Trước thu tiền thật:** chủ thể nhận tiền, phạm vi/giá/hạn truy cập/hoàn tiền, quyền nguồn và nội dung đã được người có thẩm quyền chốt; email/domain ổn định; giao dịch thật thử có chủ dự án chủ động cho phép; quyết định go-live riêng. Không bỏ cổng approved hiện có để bán mọi draft.

**Sau V1:** trong A là Hợp hôn sau H0; ngoài cả hai phương án là hệ nhiều gói/khuyến mại/affiliate, nhiều provider, mật khẩu/social login, phân quyền đội ngũ lớn, vận hạn/Kinh Dịch/Bát Tự, điểm số, AI diễn giải, tổng hợp đầy đủ Mệnh–Thân và các rule còn khoanh. Không tự mở chuỗi bổ sung sao.

**Các quyết định thực sự cần chốt:**

1. **Cơ sở thiết kế đã chốt: A** theo yêu cầu prototype ngày15/10/2026: bản mệnh + Toàn thư + SePay; Hợp hôn giai đoạn sau. Không cần hỏi lại A/B cho việc duyệt prototype. Phương án B ở trên được giữ để tham chiếu chi phí/phụ thuộc, không là phạm vi triển khai hiện tại.
2. **Phạm vi nội dung và kinh doanh:** chấp thuận Toàn thư khởi đầu34bài miễn phí; một gói bản mệnh có giá/hạn quyền/chính sách nào; ai duyệt văn, chuyên môn và quyền nguồn. Nếu B, chốt miền cặp và cách cung cấp Hợp hôn (miễn phí/gói riêng); chưa cần định giá một phương pháp chưa xác minh.
3. **Đầu vào vận hành:** ngân hàng/loại tài khoản/chủ thể SePay, ai cấp quyền Test Mode và cấu hình secrets, domain/hosting/email. Chưa cần trả lời credential trong cuộc chat.

**Trạng thái tại lượt lập kế hoạch: U1a từng tạm hoãn; đã triển khai luồng QA thật theo §15 dưới đây.** Sau khi chọn phương án và thông qua bố cục/tiêu chí §9, task coding đầu tiên vẫn có thể là lát cắt30–45phút của UX: làm rõ bước nhập/xác nhận bằng form thật, tên/ngày/giờ/nơi sinh/múi giờ và đường tới bản cơ bản; không thêm payment hoặc rule. Lượt này không thực hiện task đó và không tự lên lịch automation.

Điểm kết thúc cập nhật: một kế hoạch có nguồn, hai phương án có điều kiện, danh sách việc và gate hữu hạn. Không mở tài khoản, xuất bản bài, sửa app hoặc tác động QA3055. Nghiên cứu tham khảo có giới hạn như §3; phần chưa truy cập không được ghi đã nghiệm thu.

Thời gian lượt khảo sát/cập nhật: khoảng **15 phút** (19:00–19:15 ngày15/10/2026, Asia/Ho_Chi_Minh). Chỉ `docs/V1-DELIVERY-PLAN.md` được cập nhật trong repository; không chạy gate và không phát sinh kết quả kiểm thử ứng dụng mới.


## 13. Prototype mobile để duyệt — 15/10/2026

**Phương án A đã được chọn làm cơ sở thiết kế.** Prototype riêng ở [localhost3060](http://127.0.0.1:3060/#input), [bộ ảnh màn hình](http://127.0.0.1:3060/anh-duyet.html), [phạm vi/kiểm tra](/Volumes/DATA/TINHLUAN/.local/v1-mobile-prototype-20261015/README.md). Có thể mở offline [index.html](/Volumes/DATA/TINHLUAN/.local/v1-mobile-prototype-20261015/index.html). Chạy trên máy hiện tại, không công khai và không tác động QA3055.

Đã dựng để bấm duyệt: nhập/xác nhận/sửa; kết quả cơ bản và phạm vi chi tiết; bài dài/mục lục/căn cứ; tải hai PDF mẫu có sẵn; QR minh họa/sao chép/chờ/thành công giả lập; Toàn thư tìm kiếm/danh mục/một bài thuật ngữ mẫu. Thương hiệu đỏ trầm–kem–vàng, 390px ưu tiên, kiểm thêm360px, khung desktop1280px. Giữ22đoạn của bản lưu1.47.0 và căn cứ, không biên soạn lời luận mới.

**Prototype chưa phải tính năng đã hoàn thành.** Không nối engine hoặc API; thông tin nhập không tạo lá số; không có giá bán, đơn hàng, SePay thật/Test Mode, quyền đọc/email hoặc PDF sinh mới. Tra cứu12cung chưa là phiếu đồ họa thật. Toàn thư chỉ có hai định nghĩa trong một bài mẫu, chưa hoàn thành34bài. Bản đọc và PDF dùng dữ liệu mẫu cố định được ghi rõ ngay trong giao diện. Không khấu trừ việc backend/biên tập/nghiệm thu khỏi ước lượng V1 chỉ vì các màn đã bấm được.

U1a ứng dụng thật vẫn tạm hoãn cho đến khi chủ dự án duyệt trải nghiệm. Bước kế tiếp sau duyệt là lát cắt nhập–xác nhận–bản cơ bản dùng dữ liệu thật theo §9/§12; chưa tự chạy bước đó. Không cần chốt lại A/B, chưa đặt giá hoặc lịch Live mới.

Thời gian thực tế lượt prototype: khoảng **22 phút**, 19:31–19:53 ngày15/10/2026 (Asia/Ho_Chi_Minh). Kết thúc ở bản mẫu nội bộ để duyệt; chưa triển khai U1a thật.

## 14. Áp dụng hướng giao diện đã duyệt vào ứng dụng — 15/10/2026

Chủ dự án đã duyệt prototype `reference-redesign` và yêu cầu giữ hình lá số cũ. U1a được tiếp tục trong phạm vi nhập/xác nhận → tạo bản đọc thật → cơ bản/chi tiết → căn cứ → mở lại. Đã tích hợp vào mã ứng dụng, kiểm tra bằng production build riêng tại [QA3062](http://127.0.0.1:3062/internal/customer). QA3055 và prototype3060 giữ nguyên.

Lớp web `customer-ui-1.0.0` dùng nền kem, màu đất đỏ, chữ Be Vietnam Pro/Phudu tự lưu trong ứng dụng, header gọn và điều hướng theo nội dung. Giữ nguyên SVG `ChartSheet`, vị trí sao và màu/nhãn lá số cũ; trên mobile giữ cuộn ngang trong khung. Phiên bản nội dung1.47.0/catalog1.45.0 không đổi. Bản đọc mới tạo từ form vào giao diện mới; danh sách hồ sơ có đường “Mở giao diện mới” cho bản1.47.0. Đường cũ vẫn mở giao diện cũ; PDF không đổi.

Đây là tích hợp thật có quyền nội bộ, chưa phải phát hành khách hàng. Chưa nối SePay/đơn hàng/quyền khách, chưa xây Toàn thư thật. Không coi toàn bộ V1 hoàn thành. Bằng chứng, ảnh và giới hạn kiểm tra: `.local/customer-ui-approved-20261015/README.md`.

### 14.1. Hiệu chỉnh đúng mẫu và khung giờ — 15/10/2026

Theo yêu cầu tiếp theo, thay lớp theme gần giống bằng DOM/CSS được scope trực tiếp từ `reference-redesign`; giữ SVG lá số cũ. Formkhách dùng ngày/tháng/năm, Dương/Âm lịch và12khung giờ; bỏ checkbox giới hạn và bước kiểm tra thông tin. Giữ quyền nội bộ. Engine hiện dùng chi giờ, phút không tham gia an sao; biên ngày00:00 được giữ. Inputreceipt ghi khoảng giờ, không giả thành giờ sinh chính xác. Lịch âm dùng bộ chuyển đổi có sẵn, không thêm lịch mới. QA3062 cập nhật UI2.0.0; nội dung/catalogkhôngđổi. Bằng chứng: `.local/reference-exact-20261015/README.md`. Thanh toán/Toàn thư/phát hành chưa được triển khai trong việc này.


## 15. Luồng nhập → xác nhận → báo cáo thật trên QA — 16/10/2026

**Đã thực hiện, không còn là prototype:** [Tự nhập tại QA3062](http://127.0.0.1:3062/internal/customer). Dùng form theo giao diện được duyệt, validation `customerBirthSchema`/`prepareCustomerBirth`, API `/api/internal-readings`, engine và `freezeReading` hiện có. Không có bộ dựng bài thứ hai. Khi hết phiên, đăng nhập nội bộ rồi mở lại đường tự nhập; quyền khách/đơn hàng chưa triển khai ở luồng này.

- Nhập → **Tiếp tục** → bảng xác nhận ngày, loại lịch, khoảng giờ, giới tính và tên → **Xác nhận và tạo báo cáo**. Nút sửa giữ nguyên trường nhập. Chỉ đối tượng đã hiển thị để xác nhận được gửi tới API, không đọc lại form đang ẩn lúc tạo.
- Đang tạo: khóa thao tác tạo/sửa, có thông báo trạng thái; chống nhấn lặp. Khi lỗi, giữ dữ liệu và cho thử lại/sửa. Cùng dữ liệu thử lại giữ mã yêu cầu; API hiện có xử lý idempotency, không ghi đè bản đã lưu.
- Giữ nguyên thông tin khoảng giờ trong `inputReceipt`; giờ đại diện chỉ dùng qua adapter hiện hành. Không thêm nơi sinh hoặc múi giờ vào giao diện xác nhận.
- Bản cơ bản: tái sử dụng đúng chính sách prototype, ưu tiên **Học hỏi và biểu đạt → Công việc → Tiền bạc, tích lũy và nhà đất**; thiếu nhóm nào thì lấy nhóm có lời tiếp theo theo thứ tự báo cáo, tối đa ba. Không dùng tên/ID/chiều thuận khó để chọn. Giữ nguyên toàn bộ đoạn, căn cứ, quan hệ và giới hạn trong mỗi nhóm. Chỉ có thông báo thiếu nội dung thì không được tính thành nhóm có lời; không chèn lời mẫu. Cấu trúc Mệnh–Thân vẫn nằm trong phần hồ sơ/lá số.
- Lựa chọn nhóm được lưu cùng bản mới (`basicSelectionVersion=whole-topics-1.0.0`), mở lại dùng đúng `basicSectionIds` đã lưu. Bản cũ giữ lựa chọn cũ. Nội dung trình bày **1.47.0**, catalog **interpretation-1.45.0** không đổi; lớp giao diện luồng **customer-ui-3.0.0**. Không thêm/sửa lời luận hoặc rule.
- Chi tiết dùng toàn văn của cùng bản lưu, mục lục và căn cứ. Sửa lỗi CSS mobile kế thừa `nav > a { display:none }` bằng phạm vi `.reference-ui .topic-nav > a`: trước sửa mở mục lục nhưng không thấy liên kết; sau sửa liên kết và bàn phím hoạt động.
- Footer ghi rõ **QA nội bộ · Thanh toán và Toàn thư chưa khả dụng**; không có QR/giao dịch giả được trình bày như thật.

### Hồ sơ nghiệm thu mới (đầu vào giả lập, engine thật)

| Hồ sơ | Thao tác thật | Cấu trúc kết quả | Kết quả |
|---|---|---|---|
|[A](http://127.0.0.1:3062/internal/readings?id=a3bf49e6-4c57-4ea3-80fe-6abb4354ce44&mode=basic&experience=1)|Nhập 09/02/1997 nữ, giờ Ngọ; xác nhận → quay lại sửa thành **10/02/1997** → xác nhận → tạo|Mệnh Thân có Đồng–Lương; Thân cư Mệnh|Lưu đúng ngày sau sửa; cơ bản 3 nhóm, 8 đoạn nguyên vẹn; chi tiết14 đoạn; tải lại/mở lại nguyên văn|
|[B](http://127.0.0.1:3062/internal/readings?id=764e9666-5f57-4e6c-9a89-75aaba801d25&mode=basic&experience=1)|Nhập 30/02/1988 nam, giờ Tỵ; API từ chối, thử lại vẫn báo lỗi; quay lại sửa **28/02/1988** → xác nhận → tạo|Mệnh Dậu có Liêm–Phá; Thân cư Phu Thê|Không tạo bản cho ngày sai; sửa giữ tên/giờ/giới tính; cơ bản 3 nhóm, 8 đoạn; chi tiết11 đoạn; mở lại từ danh sách đúng bản|

Số đoạn chỉ là đối chiếu toàn vẹn, không chứng minh đầy đủ phương pháp. A/B không dùng Kim Thoa/1992 hay ID mẫu để chọn văn. Hai bản cơ bản khác nhóm theo nội dung có thực; không tự bù luận công việc khi B chưa có.

### Kiểm chứng thực tế và các lượt sửa

- Unit/integration ban đầu **10/10**, 3 file: khoảng giờ/đầu vào/API auth-origin-idempotency, chọn nhóm, renderer cơ bản/chi tiết trên 9 cấu trúc hiện có.
- Rà thêm `customer-reading.test.ts`: **7/8**, lỗi kỳ vọng cũ luôn chọn `traits`. Chính sách mới chọn ba chủ đề theo prototype, nên không còn yêu cầu luôn chọn traits. Giữ assertion đầy đủ các nét Liêm–Tướng; bổ sung kiểm bản cơ bản khi traits được chọn làm nhóm thay thế vẫn giữ nguyên lời nền/điều chỉnh/căn cứ.
- Lượt kế **17/18**: assertion mới sai vì đòi mã claim xuất trong HTML khách hàng. Sửa thành kiểm đối chiếu đầy đủ ID trong dữ liệu thành viên, đồng thời kiểm nguyên các nét văn và căn cứ trong bản cơ bản; không thay expected nguồn/lịch sử.
- Lượt cuối **18/18 trong 4 file**: `customer-basic-selection`, `customer-experience`, `customer-birth-interval`, `customer-reading`. Typecheck đạt trên trạng thái cuối. Hai production build đều đạt; build cuối có sửa mục lục mobile.
- E2E bằng trình duyệt thật trên QA production: nhập/sửa/xác nhận/tạo hai hồ sơ; lỗi ngày không hợp lệ/thử lại/sửa; đổi cơ bản–chi tiết; tải lại, mở lại và không lẫn hồ sơ; mục lục/căn cứ bằng Enter; kiểm 360/390px không tràn ngang, không có console error trong hai luồng cuối. Một thao tác mục lục đầu tiên thất bại do CSS đã nêu; kiểm lại đạt sau sửa. Một locator kiểm tên hồ sơ dùng tham số không được hỗ trợ đã được sửa thành tên cụ thể; không phải lỗi sản phẩm.
- Lệnh curl đầu trong sandbox bị chặn kết nối (HTTP000); kiểm lại với quyền mạng local trả **401** cho API tạo không có phiên, form chặn khi chưa đăng nhập; kiểm origin sai **403** trong integration. Không nới quyền nội bộ.
- Nguyên văn cơ bản/chi tiết trình duyệt so bằng dữ liệu thật với JSON đã lưu đều bằng nhau. 930 tệp có trước: **902 bản gốc +28 bản QA**, SHA-256 không đổi; không cộng bản sao QA thành số lá số độc lập. Manifest bảo vệ trước đó951 mục cũng không đổi.
- Cập nhật `tests/e2e/customer-system.spec.ts` theo bước xác nhận và bỏ trường nơi sinh đã loại trước đó. **Không chạy lại suite Playwright này hoặc xuất PDF trong đợt**; không nhận vơ suite đó đạt. Nghiệm thu UI ở trên chạy qua trình duyệt trực tiếp. Không chạy toàn bộ gate hoặc bộ192 vì không thay engine/catalog/evaluator; dùng 9 mẫu cấu trúc và tests phần ảnh hưởng.

Bằng chứng: `.local/customer-confirm-flow-20261016/` gồm log từng lượt, manifest trước, `verification.json`, `browser-verification.json`, `web-storage-comparison.json`, ảnh xác nhận A390/B360, căn cứ A390/B360 và bản cơ bản A360/B390. Ảnh hồ sơ A bổ sung được lưu đúng kích thước trong `profile-a-360.png`.

QA3062 đã khởi động lại bằng production build riêng. Không khởi động/dừng/sửa QA3055; lần kiểm tra cuối không thấy tiến trình nghe3055, không báo rằng QA đó đang chạy. Prototype3060 không sửa.

### Phạm vi còn lại

Luồng QA nội bộ đã nối thực tế; thanh toán SePay, Toàn thư, cấp quyền khách và phát hành vẫn chưa nối. Không xuất lại PDF; đường tải hiện có được giữ, không ghi thêm kết quả nghiệm thu PDF mới. Chưa giả lập timeout/mất phản hồi sau khi máy chủ đã lưu trong trình duyệt; retry cùng ID đã được kiểm integration. Trạng thái đang tạo có trong UI nhưng quá trình thực tế nhanh, không đo thời lượng/không giả chậm máy chủ để chụp. Không suy từ hai hồ sơ mới hoặc9 mẫu hồi quy thành đã kiểm mọi lá số.

Điểm dừng: chủ dự án tự nhập thử trên QA3062. Không mở nguồn/rule mới, không đổi lịch sử, không nối thanh toán hoặc phát hành.


Các file ứng dụng thay đổi trong lượt §15: `components/ReferenceBirthForm.tsx`, `components/CustomerShell.tsx`, `components/ReferenceCustomerReading.tsx`, `app/customer-experience.css`, `lib/internal-review/customer-report.ts`. Kiểm thử: thêm `tests/customer-basic-selection.test.ts`, cập nhật `tests/customer-reading.test.ts` và luồng nhập trong `tests/e2e/customer-system.spec.ts`. Tài liệu tiến độ nằm ngay tại §15 này. Log bảo toàn phân biệt rõ bản gốc và bản sao QA. Mốc kiểm kê đầu09:00, chốt09:12 ngày16/10/2026; không vượt ngân sách45–60phút.

## 16. Beta công khai miễn phí — 16/10/2026

**Đã nối luồng công khai theo yêu cầu mới**, thay giới hạn chỉ nội bộ của §15 cho riêng bản dùng thử. Đường gửi người thử: **https://61ac-171-246-109-226.ngrok-free.app/lap-la-so**. Trang chủ cùng origin có nút **Lập lá số miễn phí**. Tunnel hiện trỏ QA3062; phụ thuộc máy và ngrok còn chạy, địa chỉ có thể đổi. Không tác động QA3055/prototype3060.

### Phạm vi đã hoạt động

- `/lap-la-so` dùng lại `ReferenceBirthForm`: nhập → xác nhận → tạo; dữ liệu đã xác nhận được gửi qua POST, không đặt thông tin sinh trong URL. Giữ sửa/thử lại/đang tạo và validation hiện có.
- `/ban-doc?id=…&mode=basic` và chế độ chi tiết đọc cùng báo cáo đã lưu; giữ nguyên lựa chọn nhóm cơ bản, căn cứ, điều chỉnh/giới hạn. `/ban-doc` liệt kê riêng bản đọc của phiên hiện tại. Không cần đăng nhập hoặc khóa nội bộ.
- Cùng `prepareCustomerBirth`, `calculateInternal`, `freezeReading` và renderer hiện có; không có hệ luận mới. Trình bày nội dung **1.47.0**, catalog **interpretation-1.45.0** không đổi. Đây là thay đổi luồng/quyền web, không phát hành phương pháp mới.
- Nhãn **Bản dùng thử miễn phí**; không có nút mua, QR hay Toàn thư giả. Bản chi tiết miễn phí. Căn cứ vẫn có dữ kiện, điều kiện, tác giả/trang; không dẫn khách sang hồ sơ nguồn nội bộ.
- Tải phiếu lá số PNG/PDF hiện có được giữ. **PDF toàn bài chưa mở cho khách trong đợt này**: ẩn nút dùng API nội bộ; không nới API đó. Không xuất lại/kiểm lại bộ PDF.

### Quyền, lưu giữ và vận hành

- `POST /api/trial/session` tạo token ngẫu nhiên256bit. Cookie HttpOnly, SameSite=Lax, Secure trên HTTPS; server chỉ lưu hash token. Không đưa khóa nội bộ vào trình duyệt/URL/JSON.
- `POST /api/trial/readings` và `GET /api/trial/readings/[id]` kiểm chủ sở hữu. ID chỉ định bản đọc, không cấp quyền. Kho `.local/trial-readings` trong runtime QA tách khỏi kho nội bộ; đọc sai phiên, ID lịch sử hoặc hết hạn đều không trả nội dung. SSR cũng kiểm quyền trước dựng bài.
- POST kiểm origin được cho phép, content-type và body≤8KiB. Không lấy header client tự khai làm khóa phân quyền. Session có hạn cố định **7 ngày kể từ khi mở phiên**, không gia hạn mỗi lần đọc. Cookie mất/đổi trình duyệt/đóng toàn bộ cửa sổ ẩn danh thì không thể khôi phục chỉ bằng link. Không có tài khoản hay cơ chế khôi phục đa thiết bị.
- Tối đa **5 lượt tạo/10phút/phiên**, **60 lượt/10phút/toàn hệ thống**, **20 báo cáo/phiên**; tối đa2 yêu cầu tạo đồng thời/process, mỗi phiên1. Bootstrap phiên mới giới hạn100/10phút toàn hệ thống. Dùng rate limiter DB hiện có; lỗi DB không bỏ qua giới hạn. Có lỗi429/Retry-After và lời nhắc khi quá tải. Retry cùng ID và cùng đầu vào không tạo bản trùng; đổi đầu vào cùng ID bị409.
- Hết7ngày bị từ chối truy cập ngay. Dọn **chỉ kho dùng thử** theo giờ khi process chạy và khi mở phiên mới sau khởi động; lúc máy dừng tệp có thể còn trên đĩa đến lượt dọn tiếp theo. Không dọn kho lịch sử/nội bộ. Lưu giữ và giới hạn này được nêu trước khi nhập.
- `FREE_TRIAL_ENABLED=true` trong launcherQA3062. Cổng paid beta cũ `BETA_ENABLED=false`, thanh toán/email/dịch vụ thật không bật. `/internal`, admin, API nội bộ và PDF lịch sử giữ guard hiện hành. Không bỏ middleware/guard toàn hệ thống.
- Đây là beta thử trên một process/kho local, chưa phải hạ tầng phát hành trả phí hoặc cam kết sẵn sàng cao. Không xem giới hạn theo phiên là chống được người cố ý đổi cookie; quota toàn hệ thống/concurrency là lớp giới hạn bổ sung. Chưa có CAPTCHA/giám sát vận hành đa máy.

### Kiểm chứng thực chạy

- Unit/integration: **24/24, 5file** (`public-trial`, `customer-basic-selection`, `customer-birth-interval`, `customer-experience`, `customer-reading`). Các lượt đầu, sau dọn phiên và cuối đều đạt; không sửa expected nguồn/lịch sử. Kiểm phiên/token/expiry, CSRF, payload, unknownowner, input sai, idempotency, quota/DBfailclosed và link công khai không lộ đường nội bộ.
- **Typecheck và production build cuối đạt** sau sửa nhãn mục lục công khai bỏ “PDF” khi chưa mở PDF toàn bài. Không chạy toàn suite/E2E tự động/bộ192; engine/catalog/evaluator không sửa. Log riêng từng lượt tại `.local/public-trial-20261016/`; bản cuối `tests-release.log`, `typecheck-release.log`, `build-release.log`. Build chạy kho QA riêng, không làm hỏng cache dev.
- HTTP thực qua **HTTPS tunnel**, hai cookie jar độc lập không cookie nội bộ: A/B đọc bản mình200, A đọcB/B đọcA404, khôngcookie404; guest gọi API tạo nội bộ401, PDF nội bộ401, dùngID lịch sử trong APIguest404. Tải lại JSON nguyên vẹn, retry cùngID thành công, trang saiowner không lộ tên/nội dung. Cookie Secure+HttpOnly xác nhận từ phản hồi. Chi tiết `live-http.json`.
- Trình duyệt thật trên origin công khai: trước tạo, `/internal/customer` yêu cầu đăng nhập; sau đó nhập/xác nhận/tạo hồ sơ mới không đăng nhập, thấy đang tạo, đọc cơ bản/chi tiết, toàn bộ đoạn cơ bản tồn tại nguyên văn trong chi tiết, tải lại nguyên văn và danh sách riêng phiên. Đổi sangID của phiênHTTP khác hiển thị “Không mở được bản đọc”.
- Mobile360/390: form, báo cáo, mục lục/căn cứ bằng Enter, năm xem2026/lá số tải xong; scrollWidth bằng viewport, không tràn; không lỗi console trong lượt cuối. Một locator ban đầu trùng tên ở2 mục lục đã được sửa bằng giới hạn đúng navigation; không phải lỗi sản phẩm.
- **Chưa hoàn tất thao tác trên cửa sổ Chrome ẩn danh riêng** vì người dùng đang thao tác Chrome. Không nhận là đã chạy ca đó; điều kiện không có quyền nội bộ đã được kiểm trên trình duyệt public, hai phiên sở hữu kiểm bằng HTTP thực và integration. Không dùng cookie nội bộ trong các ca guest.
- Bảo toàn SHA-256 **982tệp**: **902 bản gốc +31 bản sao QA +49 tệp code engine/catalog được bảo vệ**, không thay đổi. Bản sao QA không tính thành lá số độc lập. `protected-before.json` và `protected-verification.json`. Chỉ thêm báo cáo thử vào kho khách, không sinh lại lịch sử.

### Bằng chứng và phần còn lại

Ảnh `input-390.png`, `input-360.png`, `confirm-390.png`, `report-390.png`, `report-360.png`, `evidence-360.png`; `browser-verification.json` cùng thư mục `.local/public-trial-20261016/`. Không lưu token xác thực trong bằng chứng.

File mới: `lib/trial/{store,http}.ts`, `app/api/trial/session/route.ts`, `app/api/trial/readings/route.ts`, `app/api/trial/readings/[id]/route.ts`, `app/lap-la-so/page.tsx`, `app/ban-doc/page.tsx`, `tests/public-trial.test.ts`. Sửa có điều kiện publicTrial trong `ReferenceBirthForm`, `CustomerShell`, `ReferenceCustomerReading`, `CustomerReading`; CTA/flag tại `app/page.tsx`; launcherQA và kế hoạch này. Mặc định đường nội bộ giữ hành vi cũ.

Trạng thái: **beta công khai miễn phí**, chưa phải phát hành trả phí, chưa phê duyệt chuyên môn. Còn lại ngoài gói: tài khoản/khôi phục đa thiết bị, PDF toàn bài cho guest, SePay, Toàn thư, hạ tầng vận hành ổn định. Đóng gói tại đây, không thêm rule hoặc nghiên cứu nguồn.

## 17. Rút gọn form công khai — 16/10/2026

Đã áp dụng trên **https://61ac-171-246-109-226.ngrok-free.app/lap-la-so** (QA3062). Thay bước xác nhận của §16 bằng **nhập → Lập lá số → đọc kết quả**. Trang chủ đã bỏ chỉ dẫn kiểm tra/xác nhận trung gian. Luồng nội bộ vẫn giữ bước xác nhận cũ.

- Tái sử dụng form và API guest. Lỗi schema/ngày dương được báo cạnh trường; ngày âm/tháng nhuận tiếp tục kiểm qua adapter lịch hiện có trên máy chủ, trả lỗi vào nhóm ngày. Giữ tất cả dữ liệu khi lỗi. Nút hiện **Đang lập lá số…**, khóa gửi lặp.
- Cơ chế request ID được tách thành helper dùng chung: cùng dữ liệu thử lại giữ ID, đang gửi không tạo lần thứ hai; đổi dữ liệu sau lỗi đổi ID. Thành công giữ khóa đến khi chuyển trang. Không đổi quota/cookie/owner authorization.
- Cả cơ bản và chi tiết có **Sửa thông tin** → `/lap-la-so?edit=<reportId>`. Máy chủ kiểm quyền phiên trước khi lấy `inputReceipt.entered`; không truyền thông tin sinh trong URL. Form sửa được điền đầy đủ ngày, loại lịch, tháng nhuận, giờ, giới tính, tên. Tạo lại dùng ID mới; không ghi đè hoặc tái dựng bản cũ.
- Không sửa engine/catalog/nội dung lưu; không thêm chức năng/PDF/thanh toán. Nội dung1.47.0/catalog1.45.0, miễn phí7ngày và giới hạn tạo giữ nguyên.

### Kiểm tra và lỗi đã sửa

- Unit/integration **19/19 trong4file**: `public-direct-form`, `public-trial`, `customer-birth-interval`, `customer-basic-selection`. Các lượt trước/sau sửa đều đạt; bổ sung ca lỗi vừa phát hiện, không thay expected nguồn/lịch sử. Typecheck và production build cuối đạt. Không chạy toàn bộ gate/E2E tự động/PDF.
- Trong kiểm UI ban đầu phát hiện ô giờ chưa chọn bị FormData bỏ qua, `Number(null)` trở thành0/giờ Tý. Đã sửa phân biệt `null`/chuỗi rỗng với số0. Kiểm lại form trống:4 trường lỗi, có “Chọn khung giờ sinh”; chọn Tý tạo được đúng giờ Tý.
- Kiểm thao tác rất sớm sau reload phát hiện submit native GET trước khi hydration, đưa **dữ liệu giả lập của ca thử** vào URL. Đã chặn bằng fieldset/nút disabled trên SSR cho tới khi khởi tạo xong, đồng thời form dùng POST. Có assertion SSR kiểm hai bảo vệ. Kiểm lại reload → tương tác ngay → bấm đúp trên production: đi tới bản đọc chỉ có ID/mode, không gửi dữ liệu sinh bằng URL.
- Trình duyệt trên tunnel: form thiếu dữ liệu; ngày30/02 sai; ngày31 âm bị API từ chối; nhấn thử lại giữ dữ liệu; sửa thành29/02/1996 nam giờThân → bấm đúp chỉ tạo **một** bản `2546ca4e-9d5c-4a3d-92b5-eff0f5110658`. Thấy nút đang tạo bị khóa và chuyển thẳng kết quả, không màn xác nhận.
- Từ kết quả **Sửa thông tin**: điền đúng dữ liệu cũ; sửa thành28/02/1996 giờTý → tạo bản mới `aa6df43d-5c08-4991-9b70-f9e083e58eda`, không trùngID. Đã kiểm tải lại bản mới và mở bản cũ nguyên văn; file bản cũ vẫn cùngSHA-256. Một phép so DOM ngay sau điều hướng ban đầu chưa chờ đúng tài liệu nên khác; sau xác nhận trang đích đã tải,8/8đoạn cũ bằng nhau; không phải biến đổi bản lưu.
- Đổi `edit` sangID thuộc phiên khác: thông báo không mở được, không gửi nội dung đầu vào. Unit có ca owner/foreign; các kiểm API ownership, quota, expiry trước đó chạy lại đạt.
- Mobile360/390: form nhập/sửa, lỗi cạnh trường, kết quả và link sửa; scrollWidth bằngviewport. Không lỗi JavaScript; lỗiHTTP400 có chủ ý cho ca ngày âm sai. Mất phản hồi mạng sau lưu được kiểm bằng unit request controller + API idempotency; không giả lập đứt mạng trực tiếp trong trình duyệt.
- Bảo toàn **986 tệp trước lượt**:933bản lịch sử gốc/QA,4bản guest sẵn có và49tệp code được bảo vệ; không đổihash. Hai bản mới của đợt được lưu riêng. Manifest/log/ảnh ở `.local/public-direct-flow-20261016/`; log cuối `tests-release.log`, `typecheck-release.log`, `build-release.log`. QA3055 không tác động.

File thay đổi: `components/ReferenceBirthForm.tsx`, `components/ReferenceCustomerReading.tsx`, `app/lap-la-so/page.tsx`, `app/page.tsx`, `app/api/trial/readings/route.ts`, `app/customer-experience.css`, helper mới `lib/customer-form.ts`; test mới `tests/public-direct-form.test.ts` và mở rộng `tests/public-trial.test.ts`. Điểm dừng: chỉ rút gọn luồng công khai, không mở thêm tính năng.

## 18. PDF toàn bài cho phiên dùng thử — 16/10/2026

**Đã mở trên https://61ac-171-246-109-226.ngrok-free.app/lap-la-so (QA3062).** Thay trạng thái “PDF toàn bài chưa mở” ở §16; chỉ PDF bản đọc, chưa mở PDF kèm căn cứ. Trang báo cáo cơ bản và chi tiết đều có nút **Tải PDF**, xuất toàn bộ bản chi tiết đã lưu. Trình bày nội dung1.47.0/catalog interpretation-1.45.0 giữ nguyên.

### Cơ chế và quyền

- Dùng chung `renderStoredCustomerPdf` được tách từ exporter nội bộ hiện có; giữ layout, phân trang, font, mục lục, lá số và danh mục nguồn. Không chạy lại catalog, không sửa snapshot/bản lưu. Trước xuất kiểm phiên bản và đối chiếu **toàn bộ nguyên văn các đoạn** DOM với bản frozen; thiếu/sai nội dung thì không trả PDF.
- API `/api/trial/readings/[id]/report-pdf` kiểm cookie phiên và quyền sở hữu ở máy chủ trước render. Trang in `/ban-doc?…&print=1` kiểm lại quyền và luôn dùng toàn văn; không phụ thuộc mode=basic. Chỉ dùng cookie guest trong trình render loopback, không đưa khóa nội bộ vào trình duyệt khách, URL hoặc PDF. Origin xuất do cấu hình máy chủ quyết định, không lấy từ URL khách gửi.
- Sai phiên/không phiên/hết hạn/ID lịch sử không trả PDF. Chặn yêu cầu cross-site; `evidence=1` không khả dụng. Response private/no-store, Vary Cookie, nosniff. API/PDF nội bộ giữ quyền cũ.
- Nút có trạng thái **Đang chuẩn bị PDF…**, khóa gửi lặp bằng ref và disabled, báo lỗi và **Thử tải lại PDF**. Giới hạn PDF riêng:5 lượt/10phút/phiên,20/10phút toàn hệ thống,1 render đồng thời/process; không thay quota tạo báo cáo. Khi bận/quá giới hạn có429, thất bại503 và lời nhắc thử lại. Không lưu cache PDF công khai.
- Mở lại/tải lại trên website vẫn theo hạn phiên7ngày; mất cookie hoặc đóng toàn bộ Chrome ẩn danh mất quyền mở lại. File đã tải về máy vẫn giữ được. Tunnel/máy QA phải hoạt động; chưa có hạ tầng tải bất đồng bộ đa máy. Không mở thanh toán, không thay cổng phát hành trả phí.

### Hai hồ sơ mới, thao tác thật

1. **Ẩn danh — Bài ngắn**, 15/05/1987 dương lịch, nam, giờTỵ. ID `876bf6fb-3c2a-4d53-837b-f0314c678382`. Tạo → đọc cơ bản → tải qua **cửa sổ Google Chrome ẩn danh thật**, không cookie nội bộ. File `output/pdf/ban-doc-ngan-an-danh.pdf`:7trang, đủ12đoạn toàn văn đã lưu. Ca còn thiếu của §16 đã được khép.
2. **Bài dài — Nguyễn Minh Ánh**, 07/06/2005 dương lịch, nữ, giờThìn. ID `003470ed-c05a-46fb-b587-767e8b63bedc`. Tạo qua form công khai mobile390; chuyển chi tiết, bấm đúp tải thấy nút bị khóa. File `output/pdf/ban-doc-dai-mobile.pdf`:9trang, đủ24đoạn. Sau đó mở cơ bản ở360, Enter trên nút tải thành công; toàn văn PDF từ cơ bản và chi tiết bằng nhau.

Đây là đầu vào giả lập qua engine thật, hai snapshot khác nhau; không phải dữ liệu khách thật. Link bản đọc chỉ mở được trong phiên sở hữu, không phải liên kết chia sẻ công khai. Các PDF kiểm chứng được bàn giao trực tiếp để chủ dự án xem không phụ thuộc cookie thử.

### Kết quả kiểm tra

- **21/21 test trong5file đạt ngay lượt đầu**: `public-trial-pdf`, `stored-customer-pdf`, `public-trial`, `public-direct-form`, `customer-experience`. Lệnh: `npm test -- tests/public-trial-pdf.test.ts tests/stored-customer-pdf.test.ts tests/public-trial.test.ts tests/public-direct-form.test.ts tests/customer-experience.test.ts`. Bao phủ quyền, ID lịch sử, cross-site, chế độ căn cứ bị chặn, quota/busy/failure/retry, phiên bản/nguyên văn sai bị chặn, renderer nội bộ và luồng guest hiện có.
- `npm run typecheck` đạt; `npm run build` production trong runtime QA riêng đạt, không thay cache dev. Build có cảnh báo nhiều lockfile/workspace root, không lỗi build. Không sửa mã sau lượt này; chỉ thêm bằng chứng/tài liệu. Không chạy toàn bộ gate/bộ192 hoặc xuất lại bộ PDF lịch sử.
- Trình duyệt: Chrome ẩn danh thật tải được bài ngắn; phiên IAB khác đổiID sang bài ngắn bị từ chối, không PDF. HTTP tunnel khôngcookie trả404; API PDF nội bộ khôngcookie trả401. Lỗi503 rồi retry200, quota/busy được kiểm ở integration; **chưa giả lập mất mạng/503 trực tiếp trong giao diện trình duyệt**, không báo là đã thao tác ca đó.
- Mobile360/390: nút tải hoạt động, Enter hoạt động, trạng thái chuẩn bị khóa nút, trạng thái tải thành công hiển thị; scrollWidth bằng360/390, không tràn. Không consoleerror trong lượt cuối. Đã tải thực từ cả basic/detail, không chỉ kiểm nút hiện ra.
- Trích xuất PDF đối chiếu12/12 và24/24đoạn với bản lưu, đúng tên/ngày sinh/phiên bản, không ký tự thay thế U+FFFD. Đã render và xem **toàn bộ16trang**, không phát hiện cắt chữ, mất dấu hoặc trang trắng bất thường; số trang/mục lục và ngắt đoạn giữ layout cũ. Không có URL localhost/internal trong annotations. Không coi số trang là bằng chứng đầy đủ chuyên môn.
- **989tệp baseline không đổihash**:902bản gốc +31bản sao QA +7bản guest có trước +49tệp engine/catalog được bảo vệ. Hai bản vừa tạo cũng giữ nguyên hash sau các lượt xuất. Không cộng bản sao QA thành lá số độc lập. Checkout không có Git, nên dùng manifestSHA-256 thay commit. Không tác động QA3055.

Bằng chứng: `.local/public-pdf-20261016/` có `protected-before.json`, `protected-verification.json`, `saved-reports.json`, `pdf-text-check.json`, `live-anonymous-http.json`, logtest/typecheck/build, ảnh Chrome ẩn danh vàmobile360/390, ảnh render từng trang. Không lưu token/cookie trong hồ sơ bằng chứng.

File ứng dụng mới: `components/TrialReadingPdf.tsx`, `lib/internal-review/customer-pdf.ts`, `app/api/trial/readings/[id]/report-pdf/route.ts`. File sửa: `components/ReferenceCustomerReading.tsx`, `app/customer-experience.css`, `app/ban-doc/page.tsx`, `app/api/internal-readings/[id]/report-pdf/route.ts`. Test mới: `tests/public-trial-pdf.test.ts`, `tests/stored-customer-pdf.test.ts`. PDF bản kèm căn cứ và thanh toán vẫn ngoài đợt này. Không thêm rule/nghiên cứu hay tăng phiên bản nội dung chỉ để đánh dấu chức năng tải.

> Cập nhật sau CORE: adapter SePay Test Mode đã hoàn thành kiểm thử cục bộ và đưa vào QA ở trạng thái tắt; xem §20. Những câu “chưa có adapter” trong các biên bản trước mô tả thời điểm bàn giao cũ.

## 19. CORE — gắn đơn thử với bản đọc frozen và worker — 16/10/2026

**Đã hoàn thành một luồng CORE chạy được trên QA3062**, không phải toàn bộ CORE/SePay/email trong bảng lộ trình. Dùng lại `orders`, `order_items`, `payment_events`, `payment_transactions`, `report_jobs`, `reports`, `access_tokens`, transaction/lock/retry hiện có. Không xây queue hoặc engine luận mới. Trình bày1.47.0/catalog interpretation-1.45.0 giữ nguyên.

### Đã nối

- Bổ sung migration003: `order_reading_bindings` khóa đúng readingID, snapshotID, phiên bản trình bày/catalog, toàn bộ frozen record và SHA-256 canonical. Claim/facts/nguồn/phiên bản phương pháp thành phần vẫn nằm nguyên trong record. Trigger từ chối cập nhật binding; không trỏ tới “catalog hiện hành” lúc giao.
- Đơn tạo từ báo cáo guest đang thuộc phiên còn hiệu lực. Unique(owner,reading) và transaction advisorylock chống tạo hai đơn cho cùng bản khi retry. Đây là chính sách đơn thử; chưa quyết định chính sách mua lại/nâng cấp sản phẩm.
- Worker cũ nhận nhánh artifact mới: kiểm paid và hash, chép đúng bản đã khóa vào `reports`; cấp một grant trong `access_tokens`, đánh dấu ready **trong cùng transaction**. Không gọi `buildReport`, `freezeReading`, engine/catalog ở nhánh này. Đơn legacy vẫn chạy nhánh cũ; đã kiểm regression DB cũ.
- `ON CONFLICT` không ghi đè bản giao hoặc cấp thêm grant. Kiểm lại toàn artifact khi gặp report đã có. Retry không gia hạn quyền, không khôi phục grant đã thu hồi. Nếu ghi quyền lỗi thì cả report/readiness hoàn tác; retry sau đó dùng đúng binding.
- `/don-thu?id=<orderId>` dùng lại giao diện/renderer cơ bản–chi tiết và nút PDF. Máy chủ kiểm cookie phiên, ownerbinding, paid/ready và grant chưa thu hồi/hết hạn. API đọc `/api/trial/orders/[id]`; PDF `/api/trial/orders/[id]/report-pdf`. ID không cấp quyền. Print route cũng kiểm quyền; PDF lấy nguyên văn artifact đã giao, kiểm lại quyền trước trả file. Không đưa token hoặc khóa nội bộ vào URL/clientprops.
- Luồng dùng thử miễn phí `/lap-la-so` và `/ban-doc` giữ nguyên. Đơn thử không thay quyền miễn phí, không khóa nội dung vốn đã được phép xem miễn phí. Mất quyền của đơn không tự thu hồi quyền miễn phí độc lập.

### Thao tác thử có bảo vệ

**Không thêm POST công khai tạo/đánh dấu paid cho đơn CORE.** CLI `scripts/core-order.ts` chỉ chạy khi CORE_ORDER_TEST_ENABLED=true, DEMO_ENABLED=true, PAYMENT_PROVIDER=mock, NODE_ENV khácproduction và DB local. Công cụ nằm phía máy chủ, cần quyền máy/.env; mô phỏng payment ký bằng mockProvider rồi đi qua `acceptPayment` hiện có. Endpoint `/api/mock-pay` cũ vẫn bị chặn trên QA production. Không bật SePay Live, email thật hoặc thanh toán khách.

Các lệnh vận hành QA (chạy tại repo, không đưa .env/token vào trình duyệt):

```sh
node --env-file=.env .local/core-orders-20261016/runtime.mjs operator create READING_UUID TEST_AMOUNT
node --env-file=.env .local/core-orders-20261016/runtime.mjs operator pay ORDER_UUID
```

Worker QA đang chạy `scripts/worker.ts` và tự nhận job; không cần thao tác deliver sau pay. Công cụ `operator deliver ORDER_UUID` dùng cùng hàm worker để chẩn đoán hữu hạn. Runtime/helper chốt DB QA cũ, kho free-trial cũ và origin3062. Build mới nằm riêng `.local/core-orders-20261016/qa`, không ghi vào cache server cũ. PID server/worker ghi trong `server.pid`/`worker.pid`; log không chứa dữ liệu sinh hoặc token.

`TEST_AMOUNT=1000` trong các ca nghiệm thu chỉ là số tiền fixture để đi qua hợp đồng mock, **không phải giá bán đã chốt**. Quyền đơn thử hết cùng phiên dùng thử7ngày sẵn có; không đặt thời hạn gói trả phí. Không gửi email, không phát magiclink hoặc dựng giá/QR thật. Kho binding DB giữ bản sao bất biến cho kiểm thử; chính sách lưu giữ/backup đơn trả phí còn phải chốt.

### Nghiệm thu đã chạy

- Hai phiên guest mới qua API hiện hành, hai hồ sơ engine thật đầu vào giả lập: A `3a4f366c-f269-406a-b28d-85986a8a5b5e` → đơn `01225122-7380-4da2-b8e6-3df9a7be1be9`; B `82b12700-79ae-4139-954d-e18d5233713d` → đơn `72b540e5-fe45-416f-b8d6-03ef0b2e9248`. A12đoạn/B24đoạn, đúng tên, snapshot, presentation/catalog. Tạo đơn lại trả cùngID; mockpayment replay=duplicate; job chạy lại không pending; chủ động requeue vẫn giữ nguyên reportID/data, mỗi đơn đúng1job/1grant.
- HTTP tunnel: chủ đơn đọc200/tảiPDF200; đổi phiên A↔B đọc404/PDF404; khôngcookie404. Trước giao không có artifact trong response, PDF409. `/api/mock-pay` công khai bị400/DEMO_DISABLED. Bản miễn phí của cùng hồ sơ vẫn200; mở lại nguyên văn.
- Thêm **một đơn minh họa UI**, không phải hồ sơ thứba được tạo lại: `8d99017b-0308-4c8d-8149-1c7baf934adb` gắn bản dài đã có `003470ed-c05a-46fb-b587-767e8b63bedc`. Kiểm trình duyệt trạng thái chờ → ready, 24/24đoạn bằng nguyên văn bản trước đó; chuyển cơ bản và reload giữ cùng đơn, mobile360/390 không tràn. Worker process thật nhận job retry của đơn này, giữ nguyên report/grant. [Mở đơn minh họa](https://61ac-171-246-109-226.ngrok-free.app/don-thu?id=8d99017b-0308-4c8d-8149-1c7baf934adb) cần đúng phiên IAB đã tạo báo cáo; không phải link chia sẻ quyền.
- Hai PDF riêng của A/B xuất từ endpoint đơn:7/9trang; trích xuất đủ12/24đoạn frozen, tên đúng, không ký tự mất dấu. Render và xem cả16trang, không phát hiện cắt chữ/trang trắng bất thường. Không xuất lại bộ PDF lịch sử. Các PDF đã bàn giao trước đó không bị ghi đè.
- Tập kiểm tập trung đầu **35/35 trong6file**; thêm ca artifact bị sửa phải failclosed và điều hướng/UIđơn, lượt cuối **37/37 trong6file**: `core-orders`, `database`, `public-trial`, `public-trial-pdf`, `stored-customer-pdf`, `customer-experience`. PostgreSQL kiểm thử dùng DB riêng mới, không dùng DBQA để chạy test có faultinjection. Có kiểm haiworker cạnh tranh, grantfailure rollback/retry, revoked/expired, paidgating, mockoperator productionclosed, nội dung hỏng không được xuất. Không sửa expected lịch sử/nguồn.
- Typecheck đầu và cuối đạt; productionbuild đạt trên mã ứng dụng cuối, cảnh báo nhiều lockfile như baseline. Sau build chỉ bổ sung tests/tài liệu/helper kiểm, không sửa mã ứng dụng. Không chạy toàn bộ gate hoặc nghiên cứu rule.
- **Lỗi thực tế được giữ trong log:** lượt HTTP đầu dừng tại `PDF_FAILED`, script lúc đó chưa ghi status/body nên chưa xác định nguyên nhân; lượt HTTP đầy đủ chạy lại cảhai đơn đều200 và đủ nguyên văn. Một lần chẩn đoán exporter bằng tsx ngoài production bị `__name is not defined` khi serialize pagination; đây là môi trường chạy thử ngoài buildNext, không phải kết quả tải production. Không tuyên bố đã sửa nguyên nhân của lỗi PDF thoáng qua; cần giữ theo dõi nếu tái diễn. Không làm yếu assertion; lượt đầu và lượt sau được lưu riêng.
- **991tệp có trước không đổihash**:902bản gốc +31bản saoQA +9bản guest +49tệp engine/catalog được bảo vệ. DBQA trước đợt có0đơn/report/chart DB; không nhầm khoDB rỗng với kho báo cáo file đã có. Không sửa snapshot hoặc sinh lại lịch sử. QA3055 không tác động. Các grant và binding mới chỉ thuộc các đơn thử nêu trên.

Bằng chứng: `.local/core-orders-20261016/` có `live-verification.json`, `worker-process.json`, `pdf-verification.json`, `protected-before.json`, `protected-verification.json`, log từng lượt, ảnh mobile và `order-a.pdf`/`order-b.pdf`. `live-private.json` chứa cookie thử, chmod600, chỉ phục vụ máy chạy kiểm và **không đưa vào bàn giao/công khai**.

### Điểm dừng và phần còn thiếu trước SePay

CORE đợt này đạt **bind → mock paid → queue/worker → đúng frozenartifact → quyền đọc/PDF theo phiên**. Chưa phải checkout hoặc giao báo cáo trả phí hoàn chỉnh.

1. Chốt gói, giá, thời hạn truy cập, retention và chính sách hoàn tiền/nâng cấp; sau đó khóa package snapshot trong đơn thật. Không dùng fixture1000/phiên7ngày làm chính sách kinh doanh.
2. Adapter SePay Test Mode: mapping giao dịch/tài khoản/mãđơn/sốtiền, xác thựcwebhook theo tài liệu hiện hành, inboxbềnvững, trùng/replay, sai/thiếu/thừa/chuyểnmuộn, APIđốisoát; táchkhóa test/live. `acceptPayment` hiện vẫn là hợp đồngmock với DEMO_RECIPIENT, **chưa thể nhận payloadSePay trực tiếp**.
3. Nối checkout và trạng thái đơn vào hành trình khách; công cụ operator hiện là luồng thử, không phảiadminđơn hoàn chỉnh. Cầnaudit/retry/thu hồi/đốisoát cho admin.
4. Tài khoản hoặc magiclink/email phục hồi đa thiết bị cho **artifact mới**, độc lập cookie dùng thử. Nhánh CORE hiện chủ động không enqueueemail; email legacy chưa được coi là đã tích hợp nội dung1.47.
5. Vận hành worker/PDF có giám sát, timeout/loglỗi an toàn, backup/restoreDB và artifact. Theo dõi lỗiPDF thoáng qua ghi trên; chưa kết luận nguyên nhân đã được khắc phục.

Dừng tại QA và bộ đơn thử. Không bật thanh toánLive, không tự chốt giá/thời hạn, không đổi catalog/engine hoặc mở rộng CORE sangadmin/email trong lượt này.


## 20. SePay Test Mode → đơn frozen → worker — 16/10/2026

**Đã triển khai adapter và webhook, kiểm chứng cục bộ qua production HTTP + worker process. Chưa xác minh giao dịch gửi từ SePay.** Không tìm thấy biến `SEPAY*` trong môi trường tiến trình làm việc hoặc `.env`; không đăng nhập dashboard hoặc gọi API SePay. QA3062 đã cập nhật build, **webhook mặc định tắt và trả503** đến khi cấu hình Test Mode đầy đủ. Không có adapter Live, không có checkout mới, không tự đánh dấu đơn paid từ trình duyệt, không gửi email hoặc chạy API đối soát.

Phiên bản nội dung giữ nguyên: trình bày1.47.0, catalog interpretation-1.45.0. Dùng chung provider interface (thêm generic kiểu thông báo/xác thực), bộ settlement `acceptPaymentInTransaction`, bảng giao dịch, queue, worker và quyền theo phiên của CORE. Không tạo hệ giao báo cáo thứ hai.

### Hợp đồng đã thực hiện

- Endpoint `POST /api/payments/sepay-test/webhook`, Node runtime, JSON tối đa32KiB. Chỉ bật khi `SEPAY_MODE=test`, `SEPAY_TEST_ENABLED=true`, `CORE_ORDER_TEST_ENABLED=true` và cấu hình hợp lệ. `live` hoặc thiếu cấu hình đều đóng. Không fallback sang mock/API key/no-auth.
- HMAC-SHA256 theo [tài liệu xác thực chính thức](https://developer.sepay.vn/vi/sepay-webhooks/xac-thuc): `X-SePay-Signature: sha256=<hex>` và `X-SePay-Timestamp`; ký timestamp + dấu chấm + body gốc; so constant-time; chấp nhận lệch tối đa300giây. Không parse/serialize lại trước kiểm chữ ký. Secret tối thiểu32ký tự là yêu cầu cấu hình của dự án. Chỉ chọn HMAC trong đợt này.
- [Payload/ACK chính thức](https://developer.sepay.vn/vi/sepay-webhooks/tich-hop-webhook): dùng `id` làm khóa giao dịch, kiểm `transferType=in`, số tiền nguyên VNĐ, `code` do SePay nhận diện. Không suy mã từ `content` khi `code` null/rỗng. So chính xác ngân hàng, tài khoản, VA và mã CORE; không nhận substring, tự chọn mã gần đúng hoặc cộng dồn khoản thiếu.
- Migration004 bổ sung `sepay_test_orders` để operator đăng ký đúng **đơn thử đang pending**, đã gắn frozen artifact và phiên chưa hết hạn. Khóa hash ngân hàng/tài khoản/VA bất biến vào enrollment. Đơn legacy, không đăng ký, demo=false, sai scope, đã hủy hoặc hết hạn không được nhận tiền Test Mode. Thay cấu hình tài khoản không tự chuyển enrollment cũ sang tài khoản mới.
- `sepay_test_events` lưu inbox đã xác thực: ID có namespace `sepay:test:`, hash thông tin quyết toán, hash body, amount, chiều giao dịch, orderID nếu tìm được và disposition. Không lưu tên/ngữ cảnh chuyển khoản/số dư/raw body/secret/cookie. Tài khoản lưu dưới dạng hash. `payment_events`/`payment_transactions` hiện có chỉ nhận sự kiện chuẩn hóa đã kiểm; số tiền so với **orders.amount phía máy chủ**, không với thông tin trình duyệt.
- Inbox → kiểm đơn → payment transaction → paid → report_job thực hiện trong **cùng transaction DB**. Enqueue lỗi thì hoàn tác cả inbox/paid/giao dịch; retry xử lý lại. Unique giao dịch và row lock bảo vệ gửi đồng thời. Cùng ID nhưng đổi đơn/tiền/tài khoản được ghi log `event_conflict`, không chuyển giao dịch sang đơn khác. Định dạng JSON hoặc phần mô tả đổi nhưng thông tin quyết toán giữ nguyên vẫn là replay an toàn.
- HTTP200 + `{"success":true}` chỉ xác nhận đã lưu/xử lý webhook, **không đồng nghĩa đơn được trả tiền**. Sai tiền/tài khoản/mã/chiều được lưu disposition rồi ACK để không retry vô ích. Sai xác thực401, payload400, quá lớn413, sai Content-Type415; lỗi cấu hình hoặc DB503 để SePay có thể retry. Không trả chi tiết đơn cho bên gọi. Log JSON chỉ có requestID, ID giao dịch và mã kết quả/lỗi cố định; không ghi exception thô/header/body.
- Worker CORE giữ nguyên: giao đúng bản frozen, không chạy lại catalog; retry giữ reportID và một grant, không khôi phục grant đã thu hồi. Luồng miễn phí không phụ thuộc thanh toán này.

### Cấu hình còn cần bổ sung — chỉ trên máy chủ, không gửi secret qua chat

Mẫu không chứa secret: `.env.sepay-test.example`. Tạo file môi trường riêng (ví dụ `.env.sepay-test`, quyền600, không commit), điền:

1. `SEPAY_TEST_WEBHOOK_SECRET`: secret HMAC của webhook **trong SePay Test Mode**.
2. `SEPAY_TEST_GATEWAY`, `SEPAY_TEST_ACCOUNT_NUMBER`: đúng giá trị ngân hàng/tài khoản test trong payload. `SEPAY_TEST_SUB_ACCOUNT` để rỗng nếu không dùng VA, hoặc đúng mã VA test.
3. `SEPAY_MODE=test`, `SEPAY_TEST_ENABLED=true`, `CORE_ORDER_TEST_ENABLED=true` khi sẵn sàng thử. Không dùng secret/tài khoản Live.

Test/Live có cùng định dạng payload, nên không thể chứng minh môi trường từ một trường payload. Ranh giới ở đây là secret Test riêng, tài khoản test đã ghim, endpoint riêng và danh sách đơn thử; operator phải cấu hình đúng trong dashboard. Xem [phạm vi Test Mode](https://developer.sepay.vn/vi/sepay-webhooks/test-mode/so-sanh-voi-live) và [tạo webhook Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode/tao-webhook).

Tại dashboard **Test Mode**:

- Webhook: JSON, tiền vào, chọn đúng tài khoản test, HMAC-SHA256, bật retry khi lỗi. URL hiện dùng: `https://61ac-171-246-109-226.ngrok-free.app/api/payments/sepay-test/webhook`. Tunnel có thể đổi; kiểm lại host trước khi lưu. Chỉ gửi thử sau khi server đã nạp cấu hình.
- Bật nhận diện mã: tiền tố `CORE`, hậu tố tối thiểu=tối đa12, loại **Số và chữ**. Đây là cấu trúc mã đơn CORE hiện có; không đổi mã đơn lịch sử. [Cấu hình mã chính thức](https://developer.sepay.vn/vi/sepay-webhooks/cau-hinh-ma-thanh-toan).
- Tạo báo cáo thử qua luồng hiện có, operator tạo đơn rồi đăng ký SePay. Số tiền1000 trong nghiệm thu là fixture có nhãn **không phải giá bán**. Mô phỏng tiền vào trên SePay với đúng số tiền/mã do CLI trả về; không chuyển tiền ngân hàng thật.

Lệnh operator ở repo, dùng DB QA đã chốt trong helper (không đưa khóa ra URL):

```sh
# Tạo đơn từ bản guest đã lưu và còn thuộc phiên; TEST_AMOUNT là dữ liệu kiểm thử.
node --env-file=.env .local/sepay-test-20261016/runtime.mjs operator create READING_UUID TEST_AMOUNT
# Đăng ký đúng đơn đó cho adapter Test Mode; trả mã và số tiền kiểm thử từ DB.
node --env-file=.env --env-file=.env.sepay-test .local/sepay-test-20261016/runtime.mjs sepay-enroll ORDER_UUID
```

Server/worker cần khởi động với cùng file môi trường Test Mode sau khi điền cấu hình. Helper `runtime.mjs start/worker` dùng build mới `.local/sepay-test-20261016/qa`, giữ kho báo cáo và DB QA cũ. Trước restart phải xác minh PID/cổng và dừng đúng server/worker hiện tại; không chạy trùng. Không thay config của QA3055. CLI enrollment chỉ chạy local DB, quyền operator, NODE_ENV khácproduction cùng các cổng mock/CORE hiện có; không có endpoint enrollment công khai. Đường webhook trên production build chỉ dựa vào HMAC và cổng Test Mode riêng, không dựa vào cookie nội bộ.

**Chưa cần API Access token** cho đợt nhận webhook. API đối soát nằm ngoài phạm vi; token Test/Live cho API phải được tách khi triển khai bước đó.

### Kiểm thử thực chạy và giới hạn

- Lượt đầu khởi tạo DB kiểm thử bị sandbox `EPERM` kết nốilocalhost55439, **chưa chạy test**. Chạy lại với quyền kết nối local, DB mới riêng: **56/56 test trong7file đạt**. Sau bổ sung chặn đơn đã hủy, lượt cuối chạy lại đủ cùng7file: **56/56 đạt**. Không có fail/skip trong lượt cuối; không gọi đây là toàn bộ gate.
- Tập file: `sepay-test`, `core-orders`, `database`, `public-trial`, `public-trial-pdf`, `stored-customer-pdf`, `customer-experience`. Có kiểm raw-body/HMAC/timestamp, config đóng, under/overpayment, tài khoản/bank/VA, incoming/outgoing, null/mã sai, enrollment, hết hạn/hủy, concurrent replay, transaction dùng lại, queuefailure rollback/retry, frozen artifact, revoked/expired quyền và không chạy catalog. Expected theo hợp đồng nguồn/provider, không cập nhật expected lịch sử.
- Typecheck trước triển khai kiểm thử, sau thêm test và trên mã cuối đều đạt. Production build đạt lượt đầu; chỉ cảnh báo nhiều lockfile như baseline. Không sửa code ứng dụng sau build. Không chạy toàn bộ gate/PDF.
- **HTTP production + worker process riêng tại3064**, DB/local store thử riêng: hai session với snapshot engine có sẵn làm fixture order; webhook HMAC tự ký cục bộ → inbox → paid → queue → worker → đúng frozen hash. Replay đồng thời và chủ động retry job giữ mỗi đơn1report/1grant/1job/1transaction. Đổi phiên đọc404/tảiPDF404, khôngcookiePDF404; không enqueueemail. Nội dung sau giao bằng nguyên record trước giao. Không coi đây là giao dịch gửi từ SePay hoặc lá số người dùng mới nhập qua UI. Server3064/worker thử đã dừng.
- Kiểm HTTP sau cập nhật QA qua cảlocalhost3062 vàtunnel: `/lap-la-so`200; đọc đơn có sẵn khôngcookie404; webhook chưa cấu hình503. Luồng miễn phí và khóa quyền vẫn hoạt động. Không sửa giao diện, không chạy lại mobile hoặc xuất PDF vì không thay các lớp này; quyền PDF có hồi quy và HTTP kiểm chặn phiên khác.
- **994tệp có trước không đổi SHA-256:**902bản gốc,31bản saoQA,12bản guest,49tệp engine/catalog được bảo vệ. Không cộng bản sao thành hồ sơ độc lập. 53hàng DB QA có trước giữ nguyênhash (3đơn cùng artifact/report/grant và các bảng liên quan); migration chỉ thêm bảng/trigger. Không Git checkout, dùng manifest code thay commit. Các đơn SePay mô phỏng nằm trong DB kiểm thử riêng, không ghi vào lịch sử QA.

Bằng chứng trong `.local/sepay-test-20261016/`: `tests-first.log` (EPERM), `tests-second.log`, `tests-final.log`, các logtypecheck/build, `http-verification.json`, `http-server.log`, `http-worker.log`, `qa-smoke.json`, `database-before.json`/`database-verification.json`, `protected-before.json`/`protected-verification.json`, `code-manifest.json`. Không lưu cookie hoặc secret trong báo cáo bằng chứng. Script kiểm thử dùng secret giả có tên rõ, không phải credential SePay.

File mới: `lib/payments/sepay-test.ts`, `app/api/payments/sepay-test/webhook/route.ts`, `scripts/sepay-test-order.ts`, `db/004_sepay_test.sql`, `tests/sepay-test.test.ts`, `.env.sepay-test.example`. File sửa: `lib/payments/index.ts`, `scripts/migrate.ts`, `.gitignore` (bỏ qua file secret Test Mode), tài liệu kế hoạch này. Các helper/bằng chứng ở `.local/sepay-test-20261016/` không thuộc engine/catalog.

### Điểm dừng

Đã nối đầy đủ phần cục bộ **SePay-contract webhook → cùng settlement → cùng worker → cùng quyền/frozen report**. Còn thiếu: cấu hình Test Mode thật và một giao dịch mô phỏng do SePay gửi để khép nghiệm thu provider. Không mở Live; không có API đối soát, checkout, email hoặc giá/thời hạn chính thức trong gói. Sau khi có cấu hình, chỉ cần khép ca SePay-origin/replay/worker, không làm lại adapter hoặc dựng hệ thứ hai.

### Cập nhật kích hoạt Test Mode sau khi chủ dự án lưu cấu hình

Đã kiểm `.env` có secret HMAC đủ độ dài, ACB và tài khoản test được chủ dự án cung cấp; không in/lưu secret vào log bằng chứng. Bổ sung ba cờ `SEPAY_MODE=test`, `SEPAY_TEST_ENABLED=true`, `CORE_ORDER_TEST_ENABLED=true` vào **.env**, nạp lại QA3062/worker. File `.env.sepay-test` tạo mẫu trước đó không được nạp ở lần này; dùng `.env` làm cấu hình hiện hành, không truyền thêm file mẫu để tránh ghi đè. Live vẫn không hỗ trợ/bật.

Endpoint localhost và tunnel trả401 khi thiếu chữ ký, thay vì503 do tắt cấu hình trước đó. Đây chỉ xác nhận cổng xác thực đã bật, chưa chứng minh secret khớp cấu hình trên dashboard SePay.

Qua biểu mẫu công khai trong phiên trình duyệt hiện tại, tạo hồ sơ giả lập có nhãn **SePay — Hồ sơ kiểm thử**, bản `519726bc-faad-42c0-9ff2-f00a6d075a65`. Operator tạo và đăng ký đơn `83e774d3-2263-49fe-b37b-e5725b765f7c`, mã `CORE83E774D32263`, số tiền kiểm thử1000VND (không phải giá bán). Đơn vẫn pending/waiting; không dùng mock pay hoặc tự ký webhook để giả là SePay đã gửi.

[Mở đơn chờ trong đúng phiên trình duyệt](https://61ac-171-246-109-226.ngrok-free.app/don-thu?id=83e774d3-2263-49fe-b37b-e5725b765f7c). Bằng chứng: `activation.json`, `sepay-order-pending.png` trong thư mục SePay hiện có. Chờ chủ dự án mô phỏng **tiền vào** từ dashboard Test Mode, đúng tài khoản/số tiền/mã, để kiểm webhook SePay-origin → worker → cùng bản frozen và replay. Không chuyển tiền thật; chưa ghi nghiệm thu provider đạt.

### Đối chiếu dashboard SePay thật — 16/10/2026, chưa khép nghiệm thu

Đã truy cập dashboard SePay bằng phiên Chrome đã đăng nhập, đọc màn Test Mode: mô phỏng giao dịch, danh sách webhook, danh sách/chi tiết tài khoản và biểu mẫu tạo tài khoản thủ công. Chưa bấm gửi giao dịch, chưa tạo tài khoản, chưa thay webhook hoặc secret.

**Điểm chặn đã xác minh:** danh sách chỉ có một tài khoản ACB **0000000001**, tên TINH LUAN, **nhãn gợi nhớ 68686868**, không có VA. Webhook `test` đang bật, HMAC-SHA256, gắn ACB ****0001, host tunnel hiện hành; dashboard ghi chưa gửi. Máy chủ lại ghim `SEPAY_TEST_ACCOUNT_NUMBER=68686868`, VA rỗng. Nhãn gợi nhớ không phải số tài khoản gửi trong payload. Secret hiện diện và đạt độ dài cấu hình, nhưng **chưa chứng minh khớp secret webhook**. Chưa kiểm chứng đầy đủ đường dẫn endpoint trong cấu hình webhook hoặc nhận diện mã bằng một giao dịch thực từ SePay.

Chủ dự án đã chọn **giữ tài khoản Test Mode 68686868** sau khi được báo sai khác; không tự đổi `.env` sang0000000001 hoặc sửa enrollment bất biến để ép khớp. [Tài liệu chính thức về tài khoản Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode/tai-khoan-ngan-hang) và biểu mẫu đã mở xác nhận: tài khoản tạo thủ công được cấp số10chữ số tự động, không có trường nhập số68686868. Tùy chọn sao chép từ Live giữ thông tin tài khoản gốc; chưa thao tác tùy chọn này, không bật Live hay chuyển tiền thật.

Trạng thái từng ca trong lượt này:

- Giao dịch hợp lệ từ SePay → xác thực → paid → worker: **chưa chạy**, bị chặn bởi sai tài khoản cấu hình/dashboard.
- Phiên sở hữu đọc/tải PDF của đơn đã giao: **chưa chạy**, đơn chưa paid/ready; không xuất PDF và không có lỗi PDF mới để ghi nhận.
- Gửi lại cùng sự kiện từ SePay, không trùng report/grant: **chưa chạy**, chưa có sự kiện SePay gốc.
- Sai số tiền không cấp quyền: **chưa chạy trên SePay**; không dùng kết quả webhook tự ký cục bộ trước đây thay thế.
- Kiểm DB tại `2026-10-16T06:06:57.160Z`: đơn `83e774d3-2263-49fe-b37b-e5725b765f7c`, mã `CORE83E774D32263`, số tiền thử1000VND vẫn pending/waiting; 0sự kiện gắn đơn, 0job, 0report được giao, 0grant. Bản đọc nguồn đã lưu trước đó vẫn riêng biệt với report giao theo đơn. Bằng chứng an toàn: `.local/sepay-acceptance-20261016/checkpoint.json`.

**Thao tác còn cần từ chủ dự án:** nếu tiếp tục giữ68686868, cần có tài khoản đó thực sự trong **Test Mode → Tài khoản ngân hàng**, không chỉ nhãn. Nếu đây là tài khoản đã có ở Live, có thể chủ động dùng chức năng **Sao chép từ LIVE ngay trong Test Mode**; không cần bật nhận tiền Live. Sau đó gắn webhook Test với đúng tài khoản ấy. Nếu không có tài khoản gốc tương ứng, tài liệu hiện hành chưa chỉ ra cách tự chọn số cho tài khoản Test tạo thủ công; cần quyết định lại số tài khoản thử trước khi tiếp tục. Không yêu cầu gửi secret qua chat.

Khi tài khoản đúng đã sẵn sàng: kiểm lại URL `/api/payments/sepay-test/webhook`, HMAC Test, tiền vào và mã CORE; dùng đơn đang chờ (nếu chưa hết hạn), gửi2000VND để kiểm sai tiền trước, rồi1000VND hợp lệ, sau đó gửi lại cùng sự kiện hợp lệ từ lịch sử webhook SePay. Số tiền đều là dữ liệu kiểm thử, không phải giá bán. Lưu transactionID/log SePay cùng dispositionDB, rồi kiểm frozen hash/worker/quyền/PDF. Đây là các bước còn thiếu, **không phải kết quả đã đạt**.

Không sửa ứng dụng, engine/catalog, lịch sử, cấu hình Live hoặc QA3055; không chạy gate, không xuất lại PDF. Kết luận hiện tại: cấu hình kết nối SePay chưa đồng nhất, **nghiệm thu provider còn mở**.

### Khép ca SePay-origin với ACB 0000000001 — 16/10/2026

**Đạt luồng nghiệm thu hữu hạn Test Mode đã giao:** giao dịch do dashboard SePay phát sinh → HMAC hợp lệ → đúng đơn → worker giao bản frozen → phiên sở hữu đọc và tải PDF; phát lại cùng giao dịch không tạo thêm báo cáo/quyền; sai số tiền không cấp quyền. Không phải nghiệm thu SePay Live, checkout hay phát hành thu phí.

Chủ dự án đổi lựa chọn sang **0000000001**. Chỉ đổi `SEPAY_TEST_ACCOUNT_NUMBER` trong `.env`; giữ secret, bank ACB, VA rỗng và MODE=test. Nạp lại đúng QA3062/worker sau xác minh PID/cwd (PID mới94578/94579); QA3055 giữ nguyên. Không sửa enrollment của đơn cũ. Không thay code ứng dụng hoặc chạy lại build/gate vì build hiện hành không đổi.

Tạo hồ sơ giả lập mới qua `/lap-la-so` trong phiên sở hữu: **SePay — Thử tài khoản 0001**, bản `cfaedfa0-4c69-4177-9152-8d2bc37b3a40`. Đơn thử mới `9c9d9612-2d8f-4787-9e83-72cd0707ec74`, mã **CORE9C9D96122D8F**, **1000VND chỉ là tiền thử, không phải giá bán**. Trình bày1.47.0/cataloginterpretation-1.45.0. Bản gắn đơn có hash `6d3c738329c1754aa05d8bb7951343f039282f0e4d15d42ccfdb537e3863d251`.

Kết quả thực tế từ SePay, giờ Việt Nam ngày16/10/2026:

- **Sai số tiền trước khi thanh toán:** SePay giao dịch **39021**, 2000VND, mã đơn đúng, ACB0000000001, không VA. Nhật ký gửi **50936**,13:20:46,HTTP200. Server xác thực rồi ghi `mismatch`. DB13:21:54: pending/waiting, **0report/0grant/0job/0payment transaction**. SePay báo webhook thành công là ACK nhận sự kiện, không phải đơn paid.
- **Đúng số tiền:** SePay giao dịch **39022**,1000VND, cùng mã/tài khoản. Nhật ký gửi **50938**,13:23:07,HTTP200. Server `accepted`; DB13:23:40: paid/ready, **1report/1grant/1job/1payment transaction**. ReportID `f6c91974-6924-43b0-9a66-57f8a11ae255`.
- **Phát lại từ SePay:** chọn riêng lần gửi50938 của giao dịch39022 trong Test Mode → Tích hợp Webhook → Lịch sử gửi → Phát lại(1). Server nhận cùng transactionID, requestID mới `604b4795-1f9c-44a8-9fa6-1bfb2aa9ef9d`, ghi `duplicate`. Đối chiếu DB13:46:57 vẫn cùng reportID/hash và **1report/1grant/1job/1payment transaction**; không ký lại payload bằng công cụ cục bộ, không dùng mock-pay.
- **Bản giao giữ nguyên:** `reports.data.reading` bằng toàn bộ JSONB `order_reading_bindings.data`; `reports.data.contentHash` bằng hash binding. Có đủ snapshot/claim/facts/phiên bản trong record, không chỉ so số đoạn. Kiểm đầu tiên nhầm so report wrapper với reading record nên chofalse; sau đọc code wrapper, sửa truy vấn bằng chứng sang đúng `data.reading`, kết quảtrue. Không đổi dữ liệu hoặc ứng dụng để làm phép so đạt; giữ `valid.json` ban đầu và `valid-frozen-verified.json` giải thích lần kiểm lại.
- **Phiên sở hữu:** mở `/don-thu?id=9c9d9612-2d8f-4787-9e83-72cd0707ec74` thấy ready và bài đúng tên/dữ kiện; tải lại vẫn mở được. Nút tải toàn bài tải **thành công lần đầu**, PDF7trang. Đối chiếu văn bản trích xuất đủ **12/12đoạn** nguyên văn (chuẩn hóa Unicode/khoảng trắng phục vụ kiểm), render và xem cả7trang, không thấy trang trắng bất thường hoặc chữ bị cắt. Không có lỗi PDF xuất hiện lại ở ca này; không kết luận lỗi thoáng qua trước đây đã được sửa.
- **Quyền máy chủ:** khôngcookie và một phiên khách hợp lệ mới khác đều nhận404 ở GETđơn và GET`report-pdf`. Không in/lưu cookie. Dùng API tạo phiên hiện có; không tạo endpoint thanh toán công khai.

Bằng chứng `.local/sepay-acceptance-20261016/`: `wrong-amount.json`, `valid.json`, `valid-frozen-verified.json`, `replay-final.json`, `server-events.json`, `foreign-session.json`, `unauthorized.json`, ảnh`wrong-amount-sepay.png`/`valid-sepay.png`/`replay-sepay.png`/`order-ready.png`, `order-reading.pdf`, `pdf-verification.json`, `stored-paragraphs.json` (chỉ dữ liệu hồ sơ giả lập), ảnh7trang và contactsheet. Ảnh lịch sử được chụp ngay sau phát lại có thể chưa tự cập nhật hàng mới; bằng chứng xử lý trùng nằm ở log requestID mới và DB sau phát lại, kết hợp thao tác phát lại trên dashboard.

Trong lượt này có gián đoạn điều khiển Chrome khi trình duyệt chuyển sang tab khác; không gửi giao dịch bổ sung để thay ca replay. Công cụ trích PDF ban đầu không có`pdftotext`/`fitz`; dùng`pypdf` trong runtime có sẵn để đọc tệp tải thành công. Đây là lỗi công cụ kiểm tra, không phải lỗi xuất PDF. Không chạy unit/gate/PDF hàng loạt hoặc nghiên cứu nguồn. Không đổi engine/catalog, snapshot, nội dung lịch sử, checkout/email/đối soát hoặc Live. Chỉ thêm hồ sơ/đơn thử mới, kết quả giao dịch và phiên thử phục vụ kiểm quyền.

[Mở đơn đã giao trong đúng phiên](https://61ac-171-246-109-226.ngrok-free.app/don-thu?id=9c9d9612-2d8f-4787-9e83-72cd0707ec74). Quyền vẫn theo cookie phiên dùng thử và thời hạn hiện hành; đường dẫn không tự cấp quyền. Task dừng tại Test Mode đã kiểm, chưa bổ sung chức năng thương mại. Cấu hình nhận diện mã trên dashboard quan sát là`CORE[A-Za-z0-9]{6,12}`; hai mã12ký tự đã được nhận diện đúng, phía máy chủ vẫn kiểm đúng định dạng12ký tự, không nới rule vì dashboard rộng hơn.

### Đối soát API SePay Test Mode — 16/10/2026

Đã triển khai CLI đối soát dùng cùng settlement với webhook và cùng worker giao bản frozen. API đối soát không còn ở trạng thái tạm hoãn; nghiệm thu SePay thật đang được ghi theo từng ca dưới đây. Không mở checkout/email/Live. Gói admin chỉ xem trước đó chưa triển khai trong lượt này.

**Cơ chế:** API v2 Sandbox trả UUID, webhook trả ID số; không coi hai ID là một. Ghép qua ngân hàng + tài khoản + mã tham chiếu, kiểm thêm mã đơn/số tiền/chiều/VA. Lưu alias trong transaction với settlement. Quét đầy đủ có phân trang từ trang 1 mỗi lần, mặc định100/trang, tối đa100trang; checkpoint chỉ tiến sau scan hoàn tất. Lỗi giữa scan không bỏ qua giao dịch; lần sau quét lại và chống trùng. Đây là CLI thủ công hữu hạn, chưa phải tác vụ định kỳ hoặc API Live. Chi tiết hợp đồng, giới hạn phân trang và lệnh chạy tại [SEPAY-TEST-RECONCILIATION.md](SEPAY-TEST-RECONCILIATION.md).

**Ca thật do chủ dự án tạo trên SePay:** hồ sơ giả lập “SePay — Đối soát API”, bản `32f0d932-c9b3-4fd4-ac83-5ecaeb7df0cd`, đơn `3742170f-66de-4c33-9f5e-a8dcc1e627bd`, mã `CORE3742170F66DE`, tiền thử1000VND, ACB0000000001. Không phải giá bán. Khi tạo giao dịch, webhook chưa đến settlement: URL tạm trong quá trình thao tác Chrome bị nối thêm chuỗi, SePay ghi308 tới đường không xử lý. Ghi nhận lỗi thao tác này, không mô tả thành cố ý cấu hình URL chuẩn. Tại thời điểm API xử lý, DB không có webhook alias cho giao dịch này. Chủ dự án đã xác nhận sửa URL về endpoint chuẩn và gọi lại; việc nhận lại phía máy chủ được ghi riêng bên dưới, không lấy lời xác nhận thao tác thay bằng chứng xử lý.

Kết quả đã kiểm trực tiếp:

- **Sai tiền2000VND trước:** UUID`a980b9cf-c932-11f1-b21a-a6006ab65aca`, API3trang khi dùng1giao dịch/trang, disposition`mismatch`. DB14:25:55: pending/waiting,0report/0grant/0job/0payment transaction.
- **Đúng1000VND:** UUID`d98297e0-c932-11f1-b21a-a6006ab65aca`, webhook numericID39064 đọc từ dashboard, tham chiếu`SB01D4691C3A1B`. API4trang nhận`accepted`; DB14:27:15 paid/ready,1report/1grant/1job/1payment transaction. Report`3fac5db8-2156-486e-9dd4-5b7fdcc71aac`. Đây là API thực từ Sandbox, không dùng payload tự ký để thay SePay-origin.
- **Chạy đối soát lại:**4trang, tất cả`duplicate`; giữ đúng một report/grant/job/payment transaction. Hash`67435264b161433b1252bcbab5f6d1f841c5f7b30a090043c43c75ad5c6afc15`; cả JSON bản giao và hash bằng binding đã lưu.
- **Lỗi API thật:** gửi token sai cố ý chỉ trong bộ nhớ process con tới Sandbox, HTTP401/CLIexit1; checkpoint giữ nguyên. Không sửa token trong.env. Lỗi trang2HTTP429, lỗiDBenqueue và chạy lại từtrang1 được kiểm bằng fixture cục bộ, không gọi là sự cố phát sinh từSePay.
- **Phiên sở hữu:** mở đúng đơn đãready,15/15đoạn hiển thị bằng nguyên văn lưu. Không xuất lại PDF trong gói đối soát; quyền đọc/PDF dùng chung cơ chế đã nghiệm thu và có test hồi quy CORE. Không tuyên bố đã xuất PDF mới trong lượt này.
- **Lịch sử:** bản giao cũ của đơn`9c9d9612-2d8f-4787-9e83-72cd0707ec74` vẫn bằng frozen JSON/hash cũ. Manifest56tệp trong phạm vi engine/interpretation và kho bản đọcQA được chụp trước/sau:0thay đổi. Đây không phải kiểm kêhash mới toàn bộ kho lịch sử; không cộng bảnQA thành hồ sơ độc lập.

**Kiểm thử thực chạy:** lần đầu35/35 trong3file đạt. Sau bổ sung3ca rủi ro, lần cuối38/38 trong`sepay-test`, `sepay-reconcile`, `core-orders` đạt. Không có testfail; fixture tham chiếu trongsepay-test đổi thành duy nhất theo giao dịch để đúng hợp đồng định danh, không đổi expected lịch sử. Typecheck lần đầu và cuối đạt. ProductionbuildQA đạt; saubuild chỉ sửa kiểm tham sốCLI và thêmtest, không đổi mãứngdụngđãdeploy; typecheck cuối bao phủCLI. Không chạy toàn bộgate hoặc xuất bộPDF. Build cảnh báo workspace có nhiều lockfile; không gâyfail.

Lệnh đã chạy từroot: `node --env-file=.env .local/sepay-reconcile-20261016/test-run.mjs` (DB riêng, migrations001–005), `npm run typecheck`, `node --env-file=.env .local/sepay-test-20261016/runtime.mjs build`. QA3062/worker được nạp build mới, QA3055 không thay. Không cóGitcheckout; không ghi commitgiả. File mới: migration005, `lib/payments/sepay-reconcile.ts`, `scripts/sepay-reconcile.ts`, `tests/sepay-reconcile.test.ts`, tài liệu đối soát. File sửa: settlement`sepay-test.ts`, migrationrunner, testSePay, envtemplate, kếhoạch. Không đổiengine/catalog/renderer.

Bằng chứng `.local/sepay-reconcile-20261016/`: `api-wrong.json`, `wrong-after-api.json`, `api-valid.json`, `after-api.json`, `api-replay.json`, `after-api-replay.json`, `api-error.json`, `identities-before-webhook.json`, `owner-web.json`, `owner-ready.png`, manifests và các logtests/typecheck/build. Không lưusecret/cookie vào bằng chứng.

**Mốc kiểm14:38:46:** sau chủ dự án báo sửa URL/gọi lại, DB vẫn chỉ cóaliasAPI/reference, chưa cóaliaswebhook39064. Vì vậy tại mốc này ca “API trước → webhook sau” **chưa khép bằng chứng SePay thật**, dù test cục bộ đã đạt. Không gửi giao dịch mới để thay ca phát lại. Cần xác nhận kết quảHTTP/URL thực tế của lần gửi mới trong SePay và đối chiếualias rồi giữ nguyên sốreport/grant. Endpointtunnel chuẩn vẫn hoạt động; request thiếuContent-Type trả415, không có quyền thanh toán.

[Mở đơn API đã giao trong đúng phiên sở hữu](https://61ac-171-246-109-226.ngrok-free.app/don-thu?id=3742170f-66de-4c33-9f5e-a8dcc1e627bd). Đường dẫn không tự cấp quyền. Nội dung1.47.0/cataloginterpretation-1.45.0 giữ nguyên. Chưa có đối soátLive, scheduler, checkout, email, xử lý thủ công giao dịch lệch hoặc quyết định giá/thời hạn bán.

**Chốt14:47:48 ngày16/10:** chủ dự án cung cấp URL chuẩn và cho phép tiếp tục thao tác. Chrome điều hướng được tới chi tiết39064 nhưng trang nội dung trả trống; tải lại và quay lại không cung cấp trạng thái gửi mới. Kiểm DB lần cuối vẫn chưa có webhookalias39064, số lượng vẫn1 và frozenJSON/hash bằng nhau. Giữ kết luận **đã triển khai, nghiệm thu API đạt; ca SePay API→webhook phát lại còn mở**. Không quy lỗi cho ứng dụng hay cấu hình dashboard khi chưa có kết quảHTTP của lần phát lại mới. Cần duy nhất kiểm lần gửi mới đúng39064 trong SePay (URL,HTTP,thời điểm) rồi đối chiếu máy chủ; không cần tạo đơn/giao dịch mới. Bằng chứng cuối: `identities-final.json`, `after-webhook.json`. Tổng thời gian gói khoảng50phút, gồm thời gian chủ dự án thao tác và gián đoạn điều khiểnChrome; không tính là50phút phát triển thuần.

### Admin vận hành tối thiểu — 16/10/2026

**Đã hoàn thành phạm vi xem và tra cứu trên QA3062:** [Mở admin](https://61ac-171-246-109-226.ngrok-free.app/internal/admin). Dùng đăng nhập `/internal` và phiên nội bộ hiện có, hiệu lực một giờ. Sau đăng nhập, chọn “Quản trị vận hành” hoặc mở lại đường dẫn admin. Không tạo tài khoản/quyền mới và không đưa khóa máy chủ xuống giao diện. QA3055, trình bày 1.47.0 và catalog interpretation-1.45.0 giữ nguyên.

#### Chức năng đã có

- **Báo cáo:** tìm tên/ID, lọc miễn phí/đơn hàng/nội bộ, phân trang 5/20/50. Hiển thị ngày tạo của chính bản lưu và phiên bản. Khi đơn đã giao, mở đúng `reports.data.reading`; khi chưa giao, ghi rõ đang xem bản gắn đơn. Bản nội bộ cũ dẫn tới renderer lịch sử hiện có. Một reading có thể xuất hiện ở nguồn miễn phí và nguồn đơn hàng; không đếm thành nhiều khách. Chỉ đọc các store được runtime cấu hình, không quét archive hoặc lấy kho QA3055 làm dữ liệu QA3062.
- **Đơn hàng:** tìm mã/ID; lọc trạng thái thanh toán hoặc giao báo cáo; lọc Test/Live theo trường `demo` hiện có. Xem số tiền, trạng thái worker, số lượt, báo cáo được giao và liên kết chi tiết. Bộ lọc Live không bật provider Live.
- **Chi tiết đơn:** xem bản lưu, khoản thanh toán ghi sổ, inbox SePay, alias API/webhook nếu có, quyền và hạn truy cập, worker/email cùng mã lỗi đã ghi. Không trả email khách, owner hash, token/hash quyền, cookie, bank narrative, secret hoặc raw error trong DTO. Chỉ hiển thị mã lỗi thuộc danh sách cho phép; lỗi thô khác được che và ghi rõ đã có lỗi.
- **Giao dịch:** tìm mã đơn/ID sự kiện, phân trang; phân biệt `accepted`, `mismatch`, `duplicate`, khoản đã ghi sổ và alias. ID webhook và UUID API không tự được cộng thành hai khoản tiền. Hiển thị checkpoint API và tối đa 20 vấn đề đối soát gần nhất. Sổ này không phải nhật ký đầy đủ mọi lần HTTP; không bịa số lần replay hoặc lỗi xác thực chưa được lưu.
- **Quyền:** kiểm `reviewAuthorized` ở trang trước khi đọc dữ liệu, ở API và trong các hàm truy vấn. API chỉ GET, trả 403 cho khách, 405 với POST và `private, no-store`. Trang khách chỉ hiện yêu cầu đăng nhập, không chứa dữ liệu đơn/báo cáo. Chưa có sửa/xóa, đánh dấu paid, refund, retry hoặc cấp/thu hồi quyền.

#### Dữ liệu chưa có và giới hạn

PDF chưa có sổ trạng thái/lỗi bền vững theo đơn; admin ghi đúng điều này, không coi thiếu ghi nhận là xuất thành công. Email `not_requested` hiển thị “Không yêu cầu gửi”; không có email job thì ghi chưa có tác vụ. Lỗi HTTP đối soát nằm ở log CLI, chưa có lịch sử scan lỗi trong DB. Checkpoint thành công không chứng minh webhook phát lại đã tới.

Báo cáo đơn legacy không có frozen CustomerReading tương thích được đánh dấu chưa có trình xem; không chạy catalog mới để dựng lại. Sáu đơn hiện có trong QA đều có binding frozen nên không bị chặn bởi giới hạn này. Danh sách file đọc từ store hiện có, chưa xây index riêng cho quy mô lớn. Quyền admin dùng chung quyền nội bộ hiện hành, chưa phân vai chi tiết.

**Đối soát API đã triển khai**, không còn tạm hoãn. Giữ nguyên bằng chứng SePay thật về tìm giao dịch, giao bản frozen, quét lại, sai tiền và checkpoint. Trong lượt admin, giao dịch 39064 vẫn chưa có alias webhook ở DB: ca API → webhook phát lại còn mở. Có màn quản trị không đồng nghĩa ca provider này đã đạt.

#### Nghiệm thu thực tế

- Tìm và mở bản miễn phí `32f0d932-c9b3-4fd4-ac83-5ecaeb7df0cd` — “SePay — Đối soát API”: **15/15 đoạn bằng nguyên văn đã lưu**.
- Mở đơn `CORE3742170F66DE`: paid/ready, worker một lượt, một báo cáo, một quyền, một khoản 1.000đ. Sự kiện 2.000đ là `mismatch`, không ghi thêm tiền. Bản worker giao cũng khớp 15/15 đoạn; căn cứ mở được.
- Đơn cũ `CORE9C9D96122D8F` có inbox API `duplicate` bên cạnh webhook lịch sử; giao diện ghi rõ không thu thêm. Khoản thanh toán lấy từ ledger, không đếm inbox.
- Tìm tên, mã đơn, lọc Test/paid, chuyển trang 1 → 2, mở chi tiết/bản lưu/căn cứ hoạt động. Desktop 1280px và mobile 390px không tràn ngang; tab và phân trang hiện rõ. Không kiểm thêm viewport ngoài phạm vi 390px của task.
- HTTP qua tunnel: không cookie và **phiên khách hợp lệ mới** đều bị 403 ở API reports/orders/transactions/order detail. Trang danh sách/chi tiết/bản đọc chỉ hiện login, không lọt dữ liệu. POST admin trả 405. `/lap-la-so` trả 200. Sáu đơn chia trang 5+1 không giao nhau; có 21 bản miễn phí tại thời điểm kiểm. Đây không phải số lượng kỳ vọng cố định.

#### Kiểm thử, sửa lỗi và bảo toàn

Lượt đầu **8/8 test trong 3 file** `admin-operations`, `internal-login`, `internal-origin` đạt. Sau tăng che raw error và kiểm ngày tạo đúng bản lưu, lượt cuối **8/8 đạt**. Kiểm các rủi ro: quyền trước truy vấn; name/ID/source; phân trang không trùng; lọc Test/Live/status; chuỗi SQL được xử lý như dữ liệu tìm kiếm; bản lưu không đổi; alias không nhân khoản tiền; trạng thái PDF/email chưa có không thành công giả; cache headers. Fixture DB nằm trong database riêng, không tính là giao dịch SePay thật.

Typecheck và production build các lượt đều đạt. Build cuối dùng đúng source cuối qua runtime QA. Không chạy toàn bộ gate hoặc xuất PDF. Cảnh báo nhiều lockfile của QA còn tồn tại nhưng không làm build lỗi.

Kiểm mobile đầu phát hiện CSS public `nav > a {display:none}` ẩn tab/phân trang. Đã override riêng `.ops-shell`, không sửa CSS khách. Bỏ margin label cũ để form gọn và bỏ lồng hai landmark main. Lần đầu selector `main` bị trùng do cấu trúc lồng; đã sửa cấu trúc và đối chiếu nguyên văn trong `.customer-report`. Đây là lỗi UI/công cụ kiểm tra, không phải test nguồn bị sửa expected. Trong lúc dựng lại build QA, trạng thái browser cũ không dùng làm kết quả cuối; nạp lại tiến trình và kiểm trên build cuối.

Bảo toàn **960 tệp có trước** trong phạm vi engine/kho bản đọc gốc/kho QA: không thay đổi hash. Năm bảng QA được hash toàn hàng và không đổi: orders (6), bindings (6), reports (5), access_tokens (5), payment_transactions (5). Tái sử dụng manifest **49 tệp engine/catalog** của gói SePay trước và đối chiếu lại: không đổi. Các phạm vi có chồng lấp, không cộng thành số hồ sơ. Có thêm phiên khách để kiểm quyền và dữ liệu rate-limit đăng nhập bình thường; không sửa lịch sử bản đọc. Không có Git checkout; không gán commit giả.

File ứng dụng mới: `lib/admin/operations.ts`, `app/api/internal-admin/route.ts`, `app/internal/admin/page.tsx`, `app/internal/admin/style.css`, `tests/admin-operations.test.ts`. Sửa `app/internal/page.tsx` để thêm liên kết. Không migration DB, không đổi settlement/worker/evaluator. Helper và bằng chứng nằm riêng tại `.local/admin-operations-20261016/`.

Lệnh kiểm: `node --env-file=.env .local/admin-operations-20261016/test-run.mjs`, `npm run typecheck`, `node --env-file=.env .local/sepay-test-20261016/runtime.mjs build`. Bằng chứng: log tests/typecheck/build, `http-check.json`, `guest-check.json`, `reading-check.json`, `preservation.json`, `protected-code.json`, ảnh danh sách/chi tiết/giao dịch desktop và mobile.

**Điểm dừng:** admin chỉ xem và tra cứu đã chạy với dữ liệu hiện có. Còn ngoài gói: thao tác sửa dữ liệu/quyền, lưu log PDF và HTTP lỗi bền vững, phân vai admin, CMS/biểu đồ, checkout/email/Live; ca SePay API → webhook phát lại vẫn chưa khép. Thời gian khoảng 45 phút gồm build, nghiệm thu và ghi tài liệu. Không coi admin hoàn thành là phát hành thương mại.

### Toàn thư bản đầu — 16/10/2026

**Đã triển khai cơ chế thật trên QA3062**, không còn chỉ là prototype: [Toàn thư công khai](https://61ac-171-246-109-226.ngrok-free.app/toan-thu), [quản trị bài](https://61ac-171-246-109-226.ngrok-free.app/internal/admin/toan-thu). Dùng phiên nội bộ có sẵn; không tạo hệ quản trị/auth mới. Nội dung bản mệnh giữ trình bày1.47.0/cataloginterpretation-1.45.0; QA3055 không đổi.

Admin tạo/sửa/lưu nháp, xem trước, xuất bản và ẩn. Mỗi lần xuất bản chụp nguyên nội dung + nguồn thành phiên bản riêng trong transaction. Sửa nháp không đổi bài công khai, kể cả slug; concurrent stale revision bị chặn. Public chỉ đọc phiên bản đang xuất bản, tìm có/không dấu/đ, lọc Chính tinh/Cung/Kiến thức nền, mục lục và nguồn cuối bài. Nội dung thuần văn bản với heading, không thực thi HTML/script. Quyền kiểm ở máy chủ cả trang và API; POST kiểm Origin, schema và giới hạn kích thước.

**Nội dung chưa công bố:** ba bài mẫu có nguồn từ hồ sơ đã kiểm: Vũ Khúc; Cung Mệnh và vị trí Thân; Bản Mệnh–Cục–hành cung–hành sao. Cả ba ở nháp chờ chủ dự án duyệt, không tự ghi phê duyệt chuyên môn. Fixture có nhãn rõ được xuất bản hai phiên bản để kiểm rồi ẩn lại. Vì vậy trang công khai hiện đúng trạng thái chưa có bài, không lấy fixture làm nội dung chính thức. Không hoàn thành/viết thêm34bài trong task này.

Nghiệm thu: tạo→lưu→preview→publish→sửa nháp(public giữ nguyên)→hide404; xuất bản v2 giữv1; tìm không dấu/lọc/TOC/back; no-cookie và phiên khách thực bị403APIadmin, tranglogin không lộ draft; draft/hidden public404; CSRF403. Mobile360/390 và desktop1280, không tràn. Đã sửa lỗi UI so thứ tự khóaJSONB khiến nhận nhầm dirty, khóa form trước hydration, dùng xác nhận xuất bản/ẩn nội tuyến. Timeout nativeconfirm ban đầu là lỗi thao tác kiểm, trạng thái máy chủ được đối chiếu trước khi tiếp tục. Không giả báo một thao tác chưa xác nhận là đạt.

Lượt test đầu13/13, sau sửa14/14, cuối **15/15 trong4file**,0fail/skip; typecheck và productionbuild cuối đạt. Không chạy toàn bộgate/PDF. Bảo toàn1.003tệp trong phạm vi engine/catalog/kho bản đọc và5bảng báo cáo/đơn/quyền/thanh toán theo hash. Chỉ thêm migration006vàdữliệuCMS, không đổi engine/catalog/history/SePay/worker. Bằng chứng, file thay đổi, giới hạn và ảnh: `.local/encyclopedia-20261016/README.md` cùng JSON/log/PNG. Khoảng45phút thực hiện và nghiệm thu.

Còn ngoài bản đầu: duyệt nội dung/quyền nguồn trước công bố, biên tập phần còn lại theo phạm vi được chốt, rollbackUI/so sánh phiên bản, phân vai biên tập, tìm từ đồng nghĩa và index/phân trang cho quy mô lớn. Không đánh dấu34bài hoặc đầy đủ chuyên môn là xong. SePay API đối soát giữ trạng thái bằng chứng trước đó: đã triển khai và kiểm API; ca provider API→webhook phát lại còn mở, không thuộc task CMS.

### Duyệt tám bài nền trên web — 17/10/2026

**Đã cập nhật QA3062.** Mở [tám bản nháp kiến thức nền](http://127.0.0.1:3062/internal/admin/toan-thu?category=Ki%E1%BA%BFn+th%E1%BB%A9c+n%E1%BB%81n&draft=1), đăng nhập nội bộ nếu phiên đã hết hạn. Danh sách có bộ lọc nhóm/trạng thái, nút **Xem trước bản nháp** trực tiếp và **Bài trước/Bài tiếp** giữ bộ lọc. Không hardcode tám ID trong giao diện; số tám đến từ các bài nền chưa xuất bản đang lưu.

- Renderer dùng chung ở admin và công khai đã hỗ trợ bảng Markdown có dòng phân cách, căn lề cột, dấu `\|` trong ô; danh sách đánh số/không đánh số, tiêu đề và đoạn văn. Bảng sai số cột được giữ như văn bản, không cắt bỏ ô thừa. HTML/script/URL Markdown vẫn là chữ được React escape, không thực thi. Chưa mở HTML, ảnh nhúng hay Markdown tùy ý.
- Bảng ngũ hành hiện đủ bốn cột, bốn hàng dữ liệu và 16 ô. Mobile 360/390px cuộn ngang trong vùng bảng; toàn trang không tràn. Vùng cuộn có focus, nhãn và dùng được phím mũi tên. Typography phần bài được cô lập khỏi font tiêu đề của customer shell để preview/public đồng nhất; giữ khung thương hiệu của từng trang.
- Đã mở đúng cả tám nháp qua admin; kiểm mục lục/nguồn và chuyển bài. Public page/API của từng bài nháp trả404; API admin không có cookie trả403, trang admin không lộ bài.
- Dùng **fixture QA có sẵn**, tạm xuất bản để kiểm public với cùng nội dung bảng, sau đó ẩn lại và khôi phục nội dung nháp fixture trước kiểm. Các phiên bản fixture dùng để kiểm vẫn được lưu. Không xuất bản hoặc đổi nội dung/revision của chín bài thật (tám nền + ví dụ Vũ Khúc); đối chiếu toàn hàng trước/sau trong bằng chứng.

**Kiểm đã chạy:** 4 file `encyclopedia`, `encyclopedia-renderer`, `internal-login`, `internal-origin` trên DB kiểm thử riêng. Lượt đầu14đạt/1lỗi: fixture ô trống thiếu dấu phân cách biên, nên parser đúng khi giữ thành văn bản; sửa cú pháp fixture, không bỏ assertion. Lượt lại **15/15đạt, khôngskip**. Typecheck đạt. Hai productionbuild đạt (lượt sau bổ sung CSS đồng nhất typography). Không chạy lại unit sau CSS-only; kiểm trình duyệt và build đã chạy lại trên bản cuối.

Lượt khởi chạy browser đầu chưa chạy ca nào vì thiếu Chromium đi kèm Playwright; chuyển sang Chrome đã cài, headless với profile riêng. Lượt UI trước và sau chỉnh CSS đều đạt các ca; bản cuối bổ sung so computed typography và danh sách/HTML an toàn. Không coi lỗi môi trường khởi chạy là lỗi ứng dụng. Không chạy gate báo cáo hoặc PDF.

Bằng chứng: `.local/encyclopedia-display-20261017/README.md`, `browser-results.json`, `browser-final.log`, `tests-first.log`, `tests-final.log`, `typecheck-final.log`, `build-final.log`, ảnh admin/public360/390/desktop và bản chụp dữ liệu nháp. Trạng thái bài gửi duyệt vẫn **nháp**, không đồng nghĩa duyệt chuyên môn hoặc quyền nguồn. Điểm hiển thị bảng ở tài liệu tám bài ngày16/10 đã được giải quyết; các điểm nội dung cần duyệt còn nguyên.

Không thay engine/catalog, báo cáo, thanh toán, worker hoặc QA3055. Chỉ nạp lại web QA3062 từ build riêng `.local/encyclopedia-display-20261017/qa`. Catalog/trình bày bản đọc không tăng phiên bản. Phạm vi còn lại: chủ dự án duyệt tám bài và quyền nội dung trước khi xuất bản; chưa biên tập phần còn lại của34bài trong task này.

### Toàn thư — 12 bài giới thiệu cung, 18/10/2026

**Đã soạn và lưu đủ 12 nháp thuộc nhóm Cung trên CMS QA3062; chưa ghi nhận duyệt và chưa xuất bản.** [Duyệt nhóm 12 cung](http://127.0.0.1:3062/internal/admin/toan-thu?category=Cung&draft=1); mỗi bài có xem trước và chuyển bài trong cùng nhóm. Toàn văn xuất từ bản CMS đã lưu: [TOAN-THU-MUOI-HAI-CUNG-DUYET-NOI-DUNG.md](TOAN-THU-MUOI-HAI-CUNG-DUYET-NOI-DUNG.md).

Mỗi bài giải thích phương diện của cung, cách nhận diện và thông tin cần đọc cùng. Dùng định nghĩa Hàm Số PDF38–46 đã đọc chữ/đối chiếu ảnh, kế thừa ghi chú PDF13 và hồ sơ nguồn hiện có; không đọc lại toàn sách, không thêm phép luận. Bài Mệnh tách rõ với bài nền Mệnh–Thân; Tật Ách chỉ khái niệm và tra cứu dữ kiện. Nguồn cuối bài chỉ ghi sách/trang; hash, đường dẫn, giới hạn đối chiếu và điểm cần duyệt đặt riêng trong ghi chú nội bộ của file toàn văn.

Tiến độ theo ba trạng thái, **không đếm trùng**:

- **Kiến thức nền (8 mục):** đã soạn 8/8; đã duyệt: chưa ghi nhận; đã xuất bản 0/8.
- **Giới thiệu cung (12 mục):** đã soạn 12/12; đã duyệt: chưa ghi nhận; đã xuất bản 0/12.
- **Tổng quan chính tinh (14 mục):** đã soạn 0/14 theo phạm vi bài tổng quan; đã duyệt: chưa ghi nhận; đã xuất bản 0/14. Nháp ví dụ Vũ Khúc tại Mệnh đồng cung Văn Khúc vẫn được giữ, không tính thay bài tổng quan sao.
- **Trong 34 mục kế hoạch:** đã soạn 20/34; chưa ghi nhận bài được duyệt; đã xuất bản 0/34. Fixture QA có lịch sử xuất bản/ẩn không thuộc số bài nội dung này.

Còn lại: chủ dự án duyệt văn/phạm vi các bản nháp; duyệt chuyên môn và quyền nguồn trước xuất bản; biên tập 14 bài tổng quan chính tinh ở nhiệm vụ riêng. Các chỉ dẫn đọc tiếp hiện ghi tên bài, chưa tạo liên kết công khai tới nháp. Khi xuất bản cần nối và kiểm các liên kết theo bài thực sự được công khai. Không lấy hoàn thành bài giới thiệu làm bằng chứng đã có phương pháp luận đầy đủ 12 cung hoặc đã tổng hợp toàn lá số.

Lưu CMS qua API quản trị hiện có: 12 bài mới revision1, `visible=false`, `published_version=null`; đọc lại đúng toàn văn và nguồn. Đối chiếu 10 hàng có trước (8 nền, ví dụ Vũ Khúc và fixture) không thay đổi trường nào. Bằng chứng: `.local/encyclopedia-palaces-20261018/verification.json` cùng bản dữ liệu trước/sau. Không sửa code, engine/catalog, báo cáo, thanh toán hoặc cấu hình QA; không chạy test/build, không xuất PDF. Đây là nghiệm thu lưu nháp và biên tập, không phải một lượt kiểm thử ứng dụng mới.

### Toàn thư — 14 bài giới thiệu chính tinh, 18/10/2026

**Đã soạn và lưu nháp 14/14 bài giới thiệu chính tinh**, mỗi sao một bài; chưa ghi nhận duyệt, chưa xuất bản. [Duyệt nhóm Chính tinh](http://127.0.0.1:3062/internal/admin/toan-thu?category=Ch%C3%ADnh+tinh&draft=1). Nhóm admin có **15 nháp** vì còn bài bổ trợ Vũ Khúc–Văn Khúc; bài bổ trợ không tính thay mục Vũ Khúc trong kế hoạch. [Toàn văn 14 bài, liên kết từng nháp và ghi chú kiểm chứng](TOAN-THU-MUOI-BON-CHINH-TINH-DUYET-NOI-DUNG.md).

Danh sách một-một theo các mục chính tinh của Tân Biên: Tử Vi, Liêm Trinh, Thiên Đồng, Vũ Khúc, Thái Dương, Thiên Cơ, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân. Khuôn biên tập tám bài nền được dùng lại, nhưng mỗi bài có trọng tâm và tiêu đề mục riêng. Nội dung gồm nghĩa truyền thống, nhận diện và vai trò của cung/trạng thái/sao đi cùng; không hứa luận đủ mỗi sao ở cả 12 cung.

Hệ nguồn chính nhất quán là Tân Biên, không ghép các trường phái thành một kết luận chung. Đọc lại chữ/ảnh các đoạn quyết định, tái sử dụng hồ sơ đã đối chiếu cho ngữ cảnh. Các ví dụ giữ điều kiện cục bộ: Vũ–Khúc có trạng thái và cùng Mệnh; Cự vượng tại Mệnh Tý/Ngọ không bỏ điều kiện Hóa Lộc/Tuần–Triệt; Thiên Lương hãm phân Tỵ/Hợi với Dậu. Những điểm chưa chốt như Phủ–sát tinh, ngày trăng của Thái Âm, Lương–Xương và câu can/chi Phá Quân không được biến thành ví dụ có kết quả. Nguồn đặt cuối bài; ghi chú nội bộ tách riêng.

**Tiến độ hiện tại theo ba trạng thái** (thay số liệu tiến độ ở các mốc trước, không xóa lịch sử):

- Kiến thức nền: **đã soạn 8/8 / đã duyệt: chưa ghi nhận / đã xuất bản 0/8**.
- Giới thiệu cung: **đã soạn 12/12 / đã duyệt: chưa ghi nhận / đã xuất bản 0/12**.
- Giới thiệu chính tinh: **đã soạn 14/14 / đã duyệt: chưa ghi nhận / đã xuất bản 0/14**.
- Trong 34 mục kế hoạch: **đã soạn 34/34 bản thảo / đã duyệt: chưa ghi nhận / đã xuất bản 0/34**. Không tính bài Vũ–Khúc bổ trợ hoặc fixture QA vào số này.

Còn lại trước xuất bản: chủ dự án duyệt văn và phạm vi, phê duyệt nội dung/chuyên môn cùng quyền sử dụng nguồn; nối liên kết đọc tiếp giữa các bài thực sự được duyệt/xuất bản. Chưa gọi Toàn thư hoàn chỉnh hoặc toàn bộ phương pháp tử vi đã được phục vụ chỉ vì có đủ 34 nháp. Các khoảng nguồn chưa chốt vẫn được giữ ở ghi chú, không có rule mới trong đợt biên tập.

Bằng chứng lưu `.local/encyclopedia-major-stars-20261018/`: tạo 14 nháp mới, đọc lại so đủ sáu trường; 14 bài revision1, `visible=false`, `published_version=null`. Toàn bộ 22 hàng có trước lượt này giữ nguyên, gồm bài Vũ Khúc–Văn Khúc. Không sửa code, engine/catalog, báo cáo, thanh toán hoặc cấu hình QA; không chạy test/build, không xuất PDF báo cáo. Ảnh sách được dựng có chọn lọc chỉ để đọc lại nguồn. Đây là đối chiếu nội dung và dữ liệu nháp, không phải lượt kiểm thử ứng dụng hoặc phê duyệt chuyên môn.


### Khép bản thảo Toàn thư V1 — 18/10/2026

**Hoàn tất soạn thảo, chờ chủ dự án duyệt và quyết định xuất bản.** Đã soạn 8/8 kiến thức nền, 12/12 cung, 14/14 chính tinh; tổng 34/34 ID khác nhau. Đã duyệt: chưa ghi nhận. Đã xuất bản: 0/34. Không thêm bài hoặc mở nội dung mới trong lượt khép này.

[Danh sách duyệt 34 bài](TOAN-THU-V1-DANH-SACH-DUYET-34-BAI.md) mở trực tiếp từng nháp bằng trang admin có sẵn. Nhóm Chính tinh có 15 nháp do thêm bài bổ trợ Vũ Khúc–Văn Khúc; CMS có 36 hàng do thêm fixture QA. Hai hàng này không tính vào kế hoạch 34 bài.

Đã đối chiếu lại chữ và ảnh Tân Biên PDF67: lời Vũ miếu/vượng/đắc đồng cung Văn Khúc tại Mệnh nói **học rộng**, không phải ham học/hiếu học. Sửa nháp tổng quan Vũ Khúc r1 → r2 và đồng bộ toàn văn gửi duyệt. Bài bổ trợ r3 vốn dùng đúng “học rộng” giữ nguyên. Đọc lại CMS xác nhận sáu trường bản sửa và 35 hàng còn lại không đổi; cả 34 bài vẫn chưa có phiên bản xuất bản. Bằng chứng: `.local/encyclopedia-close-20261018/`. Không sửa ứng dụng, engine/catalog, dữ liệu báo cáo hoặc thanh toán; không chạy test/build.

Các mục soạn bài từng ghi “còn lại” ở những mốc trước đã hoàn tất theo danh sách này. Các yêu cầu duyệt nội dung, quyền sử dụng nguồn và quyết định xuất bản vẫn còn; không tự ghi người duyệt. Chưa nối các dẫn chiếu tới URL công khai của bài nháp.

#### Đúng một task triển khai tiếp theo đề xuất: khôi phục quyền đọc bản đã lưu qua email trên QA

**Trạng thái tại lúc chốt Toàn thư: đề xuất. Cập nhật triển khai QA 18/10/2026 ở mục kế tiếp.** Mục tiêu là người đã liên kết email với bản đọc trong lúc còn quyền có thể mở lại chính bản đó trên trình duyệt khác, gồm PDF; không cần tạo lại lá số hoặc báo cáo.

Căn cứ kiểm kê code ngày 18/10/2026:

- `lib/security.ts`, `app/api/[...action]/route.ts` và `app/recover/page.tsx` đã có token ngẫu nhiên, hash, hết hạn, thu hồi và đổi magic link một lần cho luồng đơn cũ. Trang đổi token hiện quay về `/`; chưa nối trực tiếp tới bản khách hàng frozen hiện tại.
- `lib/jobs.ts` đã có hàng đợi email/retry; `lib/notifications/index.ts` chỉ có provider ghi thư cục bộ, bị chặn ở production. Không coi đây là đã gửi email thật.
- `lib/order-readings.ts` giao bản frozen rồi đặt email `not_requested`; đơn thử dùng địa chỉ giả, không phải email đã xác minh của khách. `/api/recover` cũ dựa vào `scope.accessDays` và email delivery đã có, không tự dùng được cho scope đơn CORE mới.
- `lib/trial/store.ts` quản lý quyền theo cookie phiên, hết hạn cố định 7 ngày, không có liên kết email. Vì vậy có nền tảng tái sử dụng nhưng **chưa có khôi phục qua email cho bản đọc khách hàng hiện hành**.

**Phạm vi hữu hạn:** nối một luồng xác minh email → yêu cầu link → mở lại bản đã lưu. Chỉ chủ phiên còn quyền mới được đề nghị gắn email với bản cụ thể; chỉ kích hoạt liên kết sau khi xác minh hộp thư. Dùng token một lần, thời hạn ngắn, lưu hash và kiểm quyền ở máy chủ; phản hồi yêu cầu khôi phục không tiết lộ email có dữ liệu hay không, có giới hạn tần suất. Tái sử dụng provider interface, queue và cơ chế token/quyền hiện có; bổ sung tối thiểu cho artifact hiện hành, không xây hệ tài khoản thứ hai. Nếu bản gắn đơn thử, vẫn kiểm quyền cấp của đơn; email không thay thế trạng thái thanh toán. Link phục hồi không được cấp quyền các bản khác trong cùng phiên.

Nối adapter gửi thư QA với sandbox/danh sách người nhận được phép, giữ trạng thái gửi thất bại/thử lại rõ ràng. Chỉ mở đúng nội dung frozen và PDF đã lưu; không chạy lại catalog, không gửi nội dung sinh trong URL hoặc email. Không kéo dài quyền 7 ngày hay khôi phục dữ liệu đã hết hạn/bị xóa; không khôi phục bản cũ chưa liên kết email chỉ bằng tên, ngày sinh hoặc ID. Không bật gửi thư đại trà, checkout hoặc Live.

**Phụ thuộc còn thiếu:** chủ dự án chọn nhà cung cấp email và cung cấp cấu hình máy chủ (không qua chat), địa chỉ/domain gửi đã xác minh, URL HTTPS ổn định và hộp thư nhận thử được phép. Cần chốt thao tác gắn email là tự nguyện, giới hạn phục hồi trong thời hạn hiện hành; chưa quyết định thời hạn gói trả phí. Lượt này chỉ kiểm code, chưa kiểm cấu hình dịch vụ email, DNS hoặc khả năng giao thư thực tế. Nếu chưa có provider, chỉ nghiệm thu cục bộ phần token/quyền và ghi chưa đạt gửi–nhận thật; không gọi mail file là email đã tới khách.

**Tiêu chí hoàn thành:** hai phiên gắn hai email đã xác minh với hai bản đọc; từ trình duyệt mới, link mở đúng bản và tải PDF đúng nội dung/phiên bản; đổi ID không đọc chéo; token đã dùng, hết hạn hoặc thu hồi bị từ chối; không nâng quyền đơn chưa được giao hoặc truy cập nội bộ. Lỗi gửi và retry không tạo thêm báo cáo, cấp quyền trùng hoặc gia hạn quyền. Thử gửi–nhận thật tới hộp thư QA được phép, kiểm mobile 390px; luồng miễn phí và lịch sử giữ nguyên. Bàn giao giới hạn phục hồi rõ cho khách. Dừng sau luồng này, chưa mở tài khoản/mật khẩu hay email thương mại.


### Khôi phục quyền đọc/PDF qua email — QA 18/10/2026

**Đã triển khai và nghiệm thu cục bộ trên QA3070; chưa nghiệm thu email thật/HTTPS.** [Tự nhập](http://127.0.0.1:3070/lap-la-so) · [Yêu cầu mở lại](http://127.0.0.1:3070/recover?reading=1) · [Bàn giao, cấu hình và các lượt kiểm](READING-EMAIL-RECOVERY-QA.md).

- Trong phiên sở hữu bản/đơn, gắn email rồi xác minh bằng link. Khi mất phiên, email đã xác minh nhận link mới để mở đúng bản frozen và PDF; không cần tạo lại báo cáo. Mở GET chưa tiêu thụ link, bấm Tiếp tục mới đổi token; đã sửa cả trường hợp link đến cùng tab đang mở.
- Tái sử dụng `access_tokens`, `email_deliveries`, worker/retry, quyền đơn và bộ xuất PDF hiện hành. Migration007 thêm binding email–artifact và tham chiếu; token chỉ lưu hash, dùng một lần, tối đa 15 phút. Quyền vẫn kết thúc theo hạn gốc, kiểm lại thu hồi/hết hạn mỗi lần mở/tải. Không có endpoint trả link khôi phục, không có quyền từ email + ID đơn thuần.
- QA riêng/database riêng, hộp thư file local riêng; không chuyển dữ liệu hay đổi QA3062/3055, không sửa engine/catalog hoặc bản lưu cũ. Chỉ dùng đơn mock ở database thử, không bật SePay/Live và không gửi email thật. Bản soạn Toàn thư vẫn giữ 34 nháp, chưa duyệt/chưa xuất bản.
- Bốn file kiểm thử liên quan: 23/23 đạt ở lượt đầu và lượt cuối, không skip; typecheck và production build đạt. Browser: hai hồ sơ mới, hai phiên khách tách biệt, xác minh/gửi lại, đọc đúng bản, tải PDF và chặn chéo/thu hồi trên mobile360/390. Hai PDF kiểm đúng cùng artifact qua hai đường đọc miễn phí/đơn: đủ 22 đoạn, 9 trang mỗi tệp; không tính thành hai lá số độc lập.
- Ghi rõ lượt lỗi: phép kiểm GET nội bộ sai phương thức (405), selector PDF không đúng accessible name, và lỗi hashchange ứng dụng mới. Đã sửa ca kiểm tương ứng hoặc nguyên nhân ứng dụng, chạy lại ca thực tế; không xóa assertion. Giữ log lỗi và log lượt đạt riêng trong `.local/reading-recovery-20261018/`.

**Còn thiếu:** adapter provider gửi thư thật, địa chỉ/domain gửi đã xác minh, cấu hình server và HTTPS ổn định, nghiệm thu hộp thư thật được cho phép. Các mục này chưa hoàn thành và không được thay bằng bằng chứng mailbox local. Quyền dùng thử giữ 7 ngày; chưa đặt thời hạn gói trả phí. Mỗi cookie khôi phục chỉ mang một bản/đơn đang mở, không thành tài khoản gom toàn bộ lịch sử. Chưa có màn admin thao tác binding; không mở thêm task ở lượt này.


### Toàn thư — duyệt khuôn bài Vũ Khúc, 18/10/2026

Chủ dự án **tạm dừng quyết định xuất bản 34 bài để duyệt khuôn mới**. Chỉ sửa bài tổng quan Vũ Khúc hiện có r2 → r3; không thêm bài, không thay bài bổ trợ, không áp dụng hàng loạt. Bản mới gồm mở bài, bảng 12 địa chi theo Tân Biên, nghĩa tại Mệnh có điều kiện, ví dụ Vũ–Văn Khúc, ba FAQ, bài liên quan và nguồn. [Toàn văn/khuôn đề xuất/ghi chú đối chiếu](TOAN-THU-VU-KHUC-KHUON-MOI-DUYET.md).

Đã soạn vẫn 34/34; đã duyệt: chưa ghi nhận; đã xuất bản 0/34. Đọc lại CMS xác nhận nháp r3, không có phiên bản công khai, 35 hàng khác nguyên trạng. Xem trước kiểm 360/390px, bảng cuộn riêng, đủ 12 dòng, mục lục hoạt động. Chưa thêm liên kết công khai tới nháp; tên bài đọc tiếp và link duyệt nội bộ đã ghi trong tài liệu. Không sửa renderer/code, không chạy test/build, không tác động gói email QA3070, báo cáo, engine/catalog hoặc thanh toán. Bằng chứng: `.local/encyclopedia-vu-khuc-layout-20261018/`.

Điểm dừng: chủ dự án duyệt bài mẫu; chỉ sau đó mới quyết định áp khuôn cho nhóm chính tinh/cung/nền và xuất bản. Hoàn thiện khuôn không thay cho phê duyệt nội dung.


### Toàn thư — áp khuôn đã duyệt cho 34 nháp, 18/10/2026

**Đã áp khuôn cho 33/33 bài còn lại và chỉnh Vũ Khúc; tổng34/34, còn0bài trong gói. Chưa xuất bản.** Chủ dự án đã duyệt khuôn Vũ Khúc r3, chưa phê duyệt nội dung cả nhóm hoặc xuất bản. Tiến độ: đã soạn34/34, đã duyệt khuôn, duyệt nội dung từng bài chưa ghi nhận, xuất bản0/34. [Toàn văn mới nhất và link từng bài](TOAN-THU-V1-34-BAI-KHUON-MOI-DUYET.md); [danh sách duyệt](TOAN-THU-V1-DANH-SACH-DUYET-34-BAI.md).

Đã xử lý8bài nền,12cung,14chính tinh theo phạm vi riêng. Bảng trạng thái dùng nguồn Tân Biên đã kiểm; không thêm phương pháp/rule hoặc lời tổ hợp còn thiếu đặc tả. Vũ Khúc giải thích học rộng/ham học một lần; nguồn dùng trangPDF. Không tạo bài trùng; đúng34ID; bài bổ trợ và fixture giữ nguyên. Đã lưu tiến độ từng nhóm và đọc lại sáu trường nội dung qua API. Cả34bài vẫn nháp.

Renderer dùng chung chỉnh bảng2cột vừa mobile, bảng rộng cuộn riêng; React text an toàn giữ nguyên. Test renderer5/5, typecheck và productionbuild đạt. Kiểm360/390px ba bài đại diện, đủ ô bảng và mục lục/nguồn; khách bị chặn API quản trị và không thấy nháp. Có một lượt sửa định dạng nhãn nguồn13bài sau đọc lại, đã lưu/đối chiếu bản cuối; không đổi ý nghĩa. Không chạy gate báo cáo/PDF.

QA3062 nạp build mới riêng, chỉ hai file renderer/CSS Toàn thư khác checkout chạy trước. QA3070/gói email giữ nguyên; engine/catalog, báo cáo, thanh toán và worker không thay. Bằng chứng/checkpoint tại `.local/encyclopedia-template-rollout-20261018/`. Điểm dừng: chủ dự án duyệt nội dung và quyết định xuất bản, không tự triển khai thêm chức năng hoặc nghiên cứu.


### Toàn thư V1 — khép chuẩn bị theo khuôn mới, 18/10/2026

**Hoàn thành phạm vi chuẩn bị; chờ chủ dự án duyệt nội dung và cho phép xuất bản.** Đúng 34 bài: 8 nền, 12 cung, 14 chính tinh. Đã soạn 34; đã duyệt khuôn; duyệt nội dung toàn nhóm chưa ghi nhận; xuất bản 0. Bài bổ trợ Vũ–Văn Khúc và fixture không thuộc 34. [Duyệt QA3062](http://127.0.0.1:3062/internal/admin/toan-thu?draft=1) · [Toàn văn mới nhất](TOAN-THU-V1-34-BAI-KHUON-MOI-DUYET.md).

Sửa đúng 13 nhãn nguồn “Trang trang PDF” → “Trang PDF”, không biên tập lại thân bài. Bài liên quan dùng renderer hiện có, chỉ liên kết nội bộ tới tên/slug của bản đã công khai và còn hiển thị. Nháp/ẩn không có link; không truyền dữ liệu nháp hoặc link admin ra khách. Nhận diện đủ 79 dòng dẫn chiếu hiện có; nếu đổi tên đích thì cần cập nhật dẫn chiếu, không tự đoán. Công khai và xem trước dùng cùng cách render.

Kiểm 15/15 test ở hai file Toàn thư/CMS, typecheck và production build đạt. Fixture link công khai/nháp/ẩn được kiểm trong database test riêng và web fixture 3063, không phải xuất bản 34 bài; 8 kiểm HTTP đạt. Mobile 360/390px: bảng hai cột vừa, bốn cột cuộn riêng; đủ ô, không tràn trang. Lượt API đầu bị sandbox EPERM, chạy lại với quyền local đạt; một phép đo nhầm tab 474px được loại và đo lại đúng 360/390px. Không sửa expected, không chạy gate báo cáo hoặc PDF.

QA3062 nạp build mới, QA3070 giữ cùng tiến trình 82932; không tác động gói email, engine/catalog, báo cáo hoặc thanh toán. Bằng chứng: `.local/encyclopedia-close-20261018/`. Không còn việc trong gói chuẩn bị này; chưa xuất bản và không tự mở task mới.


### Toàn thư V1 — đã xuất bản theo phê duyệt của chủ dự án, 18/10/2026

**Đã soạn 34/34 · Chủ dự án duyệt nội dung 34/34 · Đã xuất bản 34/34 trên QA3062.** Phê duyệt này là quyết định nội dung/xuất bản của chủ dự án, **không phải phê duyệt chuyên môn**. Mốc này thay trạng thái chờ duyệt/xuất bản của các mục lịch sử phía trên.

[Toàn thư công khai qua tunnel đang hoạt động](https://61ac-171-246-109-226.ngrok-free.app/toan-thu) · [QA local](http://127.0.0.1:3062/toan-thu).

- Đúng 8 bài kiến thức nền, 12 bài cung, 14 bài chính tinh. So CMS với bản bàn giao trước khi xuất bản, không có thay đổi ngoài dự kiến. Từng bài xuất bản phiên bản1 từ đúng revision đã duyệt; đọc lại API công khai so toàn bộ sáu trường nội dung với bản đã duyệt.
- Bài bổ trợ Vũ Khúc–Văn Khúc và fixture giữ nguyên, không xuất bản. 34 bài công khai không kèm ghi chú biên tập nội bộ hoặc link admin. Không sửa thêm nội dung/code.
- Kiểm HTTP không cookie: đủ34bài, đúng nhóm8/12/14, cả34URL mở200; tìm có/không dấu và lọc nhóm hoạt động. 78 liên kết Bài liên quan trỏ tới đúng bài đang công khai; một dẫn chiếu bài bổ trợ giữ chữ. URL/API của hai bài loại trừ trả404, API quản trị403. Tunnel trỏ localhost3062 và trả đúng tập nội dung34bài.
- Browser qua tunnel không có quyền nội bộ (trang quản trị hiện yêu cầu đăng nhập): tìm “vu khuc”, mở Vũ Khúc, dùng liên kết/bàn phím sang bài Trạng thái sao, mở Điền Trạch. Kiểm ba nhóm mobile390/360px: nội dung/mục lục rõ, không tràn ngang. Một selector đọc heading chưa đủ cụ thể được sửa thành h1; click link chưa điều hướng ở lần đầu được kiểm lại bằng Enter và xác nhận đúng trang đích. Đây là thao tác kiểm trình duyệt, không sửa sản phẩm.
- Không chạy lại build/test suite/PDF. QA3070, gói email, báo cáo và thanh toán không bị tác động. Tunnel là địa chỉ tạm, cần giữ dịch vụ QA và tunnel chạy để khách truy cập.

Bằng chứng xuất bản, revision/hash nội dung, kiểm HTTP và ảnh mobile: `.local/encyclopedia-publish-20261018/`. Hoàn tất gói xuất bản Toàn thư V1, không tự triển khai thêm tính năng.


### Gmail SMTP cho khôi phục email/PDF — QA3070, 18/10/2026

**Đã triển khai adapter Gmail trong queue/worker hiện có; chưa nghiệm thu gửi–nhận Gmail thật hoặc HTTPS3070.** [Hướng dẫn cấu hình, phạm vi và bằng chứng](GMAIL-SMTP-QA3070.md).

- SMTP cố định smtp.gmail.com:587, bắt buộc STARTTLS/chứng chỉ TLS; tài khoản Gmail + App Password; tên gửi Tinh Luận và địa chỉ gửi đúng tài khoản. Chỉ người nhận được chỉ định trong cấu hình được nhận thư QA. Không log secret/token hoặc trả link qua API.
- File mẫu `.env.gmail-qa.example`; file riêng `.env.gmail-qa` quyền600 và gitignore. Hiện ba giá trị Gmail/App Password/email nhận thử còn thiếu, cờ gửi thật false. Đã yêu cầu chủ dự án điền trực tiếp trên máy, không gửi secret qua chat.
- HTTPS riêng ngrok3070 bị auto-review chặn trước thực thi do cần xác nhận mở QA ra Internet/đích ngrok. Đã hỏi quyền; chưa tạo tunnel, không đổi tunnel QA3062. Phần triển khai độc lập tiếp tục hoàn tất. Không dùng localhost làm bằng chứng link email HTTPS đã đạt.
- Test liên quan lượt đầu17/17, lượt cuối18/18 sau bổ sung ca Gmail giả lập + worker retry; typecheck và build đạt. Không chạy toàn gate/PDF. SMTP mocked chỉ chứng minh adapter/queue, không phải thư đã đến Gmail. Smoke QA3070 trang nhập/khôi phục200, adminAPI403; QA3062 còn34bài công khai.
- QA3070 đã nạp build riêng, giữ database/artifact/kho cũ; vẫn local mailbox khi chưa bật Gmail. QA3062/Toàn thư, engine/catalog, báo cáo và thanh toán không đổi. `sent` là provider chấp nhận, còn thư đến Inbox phải xác nhận riêng. Nhánh đơn Gmail dùng trạng thái `smtp_accepted`, không coi là khách đã nhận.

**Còn chờ:** Gmail + App Password + người nhận thử; quyền tạo HTTPS3070 hoặc origin do chủ dự án cung cấp; sau đó mới chạy ca thật tạo→xác minh→khôi phục ở trình duyệt mới→PDF, chặn token dùng lại/đọc chéo. Không báo hoàn thành nghiệm thu thật dựa vào local hoặc mock. Chưa mở dịch vụ email tới khách đại trà/Live.


Cập nhật kiểm cấu hình cuối lượt: ba biến Gmail/App Password/địa chỉ nhận thử đã có giá trị trong file riêng; chưa xác minh đăng nhập SMTP và không in giá trị. Còn thiếu `RECOVERY_ORIGIN`; cờ gửi thật vẫnfalse. Không cần chủ dự án nhập lại ba mục này. Chờ quyết định HTTPS/ngrok riêng cho3070, rồi mới nghiệm thu gửi–nhận thật.


### Gmail QA3070 — đã bật SMTP/HTTPS, chờ xác nhận hộp thư (18/10/2026)

Chủ dự án đã lưu cấu hình và đồng ý mở ngrok riêng. HTTPS3070 hoạt động, không đổi tunnel3062; Gmail chỉ gửi tới địa chỉ nhận thử được cấu hình. Tạo bản mới qua form, gắn email bằng phiên sở hữu; **Gmail SMTP thật chấp nhận1thư, worker sent/attempts1/không lỗi**. Chưa coi là thư đã đến Inbox: đang chờ người nhận xác nhận và đổi liên kết thành phiên mới. Các ca đọc/PDF qua thư thật, token dùng lại và truy cập chéo chưa được khép trong nghiệm thu thực.

[QA3070](https://b513-2402-800-63b9-f9cd-3d68-43fe-2f90-a120.ngrok-free.app/lap-la-so) · [Chi tiết/bằng chứng](GMAIL-SMTP-QA3070.md). Mobile360/390px form email không tràn;18/18test liên quan,typecheck/build đạt ở lượt triển khai, không chạy lại toàn gate. Mốc này thay phần cấu hình/HTTPS còn chờ ở trên; không thay bằng chứng hộp thư còn thiếu. QA3062/Toàn thư và paymentLive giữ nguyên.


Cập nhật Gmail thật: chủ dự án đã xác nhận nhận thư và mở được “Nghiệm thu Gmail QA”; DB xác nhận email verified, magic token tiêu thụ, session không gia hạn, hash bản lưu không đổi. Quan sát Chrome thật mở đúng báo cáo. Đã gửi thành công thư khôi phục lần hai qua form yêu cầu mở lại. Còn kiểm mở thư thứ hai, tải PDF từ phiên khôi phục và từ chối dùng lại/đọc chéo trực tiếp; không ghi nghiệm thu trọn luồng trước khi hoàn tất.


### Gmail QA3070 — khép nghiệm thu thật, 18/10/2026

**Đạt trong phạm vi QA một địa chỉ nhận thử:** thư Gmail thực nhận (chủ hộp thư xác nhận), xác minh email, yêu cầu mở lại gửi thư thứ hai, mở đúng bản lưu trên Chrome và tải PDF. PDF9trang đủ22/22đoạn/đúng hồ sơ/phiên bản; đã xem9trang. Token Gmail dùng lại bị từ chối trực tiếp; Chrome đổiID báo cáo khác bị chặn; không-cookie đọc/PDF404, admin403. Quyền PDF chéo, hết hạn/thu hồi và gửi lỗi/retry có test tích hợp18/18ở lượt triển khai, không nói tất cả đã chạy qua Gmail thật.

Bản lưu không đổi hash, vẫn1artifact;2lần đổi link tạo2session cùng hạn gốc, dùng lại không tạo lần3. Hộp thoại Save native từng không cho agent lưu, người dùng lưu giúp; không lỗi PDF máy chủ quan sát được, không xuất lại. Một lượt navigation thiếu focus và một lần người dùng chuyển tab không được tính là kiểm quyền; đọc chéo được kiểm lại bằng điều hướng đúng. Không thay code ở lượt nghiệm thu cuối, không chạy lại build/gate. QA3062 giữ34bài công khai; engine/catalog/báo cáo/thanh toán không đổi.

[QA3070](https://b513-2402-800-63b9-f9cd-3d68-43fe-2f90-a120.ngrok-free.app/lap-la-so) · [Hồ sơ nghiệm thu và PDF/bằng chứng](GMAIL-SMTP-QA3070.md). Mốc này thay các trạng thái chờ thư/PDF của nhật ký trước. Gmail chỉ bật cho email nhận thử, không phải mở dịch vụ tới khách đại trà. Còn trước phát hành: HTTPS ổn định, cấu hình email vận hành/phạm vi người nhận và kiểm khả năng nhận ở các hộp thư mục tiêu; không tự mở trong gói này.

### Hợp nhất recovery/Gmail vào QA chính3062 — 18/10/2026

**Đã tích hợp và triển khai, đang khép nghiệm thu email thật trên bản chung.** [QA chung](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so) · [Chi tiết triển khai/backup/rollback](QA-MAIN-EMAIL-MERGE.md).

Lấy checkout Toàn thư mới nhất làm nền, đưa đúng21file recovery/Gmail; giữ7file Toàn thư mới hơn,263file ngoài phạm vi byte-identical. Database/kho báo cáo chính giữ nguyên; không chép dữ liệu3070. Đã dừng worker/server cũ, backup dump23bảng +63file kho (không phải63báo cáo), kiểm dump đọc được, migration007transaction, kiểm dữ liệu cũ/filehash không đổi. Server/worker mới cùng checkout/cấu hình, HTTPSemail trỏ3062;3070 vàworker riêng giữ để đối chiếu.

Typecheck/build1lượt đạt. Test8file47/48ở lượt đầu;1lỗi admin expected7/actual12 do dùng chung database fixture với5đơn core. Chạy lại riêng admin database sạch5/5đạt, giữ assertion. Không gọi tất cả xanh cùng một lượt. SmokeHTTPS/local form/recover200,34bài công khai;admin cóquyền tìm đúng báo cáo mới/đơn/giao dịch200,khách403;khách khôngcookie đọc/PDF404. Mobile360/390pxformemail không tràn.

Đã tạo “Hợp nhất QA Gmail” bằng form và gửi thư xác minh thật thành công; đang chờ chủ hộp thư mở link để kiểm khôi phục/PDF trên bản chung. Gmail chỉ cho một địa chỉ thử,Live tắt. Không coi nghiệm thu3070 thay cho nghiệm thu bản hợp nhất. Chưa mở gửi đại trà hoặc thanh toán; không đổi catalog/phương pháp.


### QA chung3062 — kết quả hợp nhất Gmail/recovery, 18/10/2026

**Đã hợp nhất vào QA chính và nghiệm thu thư Gmail thật/PDF**; không lấy dữ liệu thử3070. QA3070 vẫn là bản đối chiếu độc lập. [Tự nhập](https://61ac-171-246-109-226.ngrok-free.app/lap-la-so) · [Khôi phục](https://61ac-171-246-109-226.ngrok-free.app/recover?reading=1) · [Chi tiết/bằng chứng/rollback](QA-MAIN-EMAIL-MERGE.md).

- Tạo hồ sơ mới trên main, gắn email bằng phiên sở hữu, chủ hộp thư nhận/mở thư; xác minh email và gửi lại thư khôi phục. Hai lần đổi liên kết tạo hai session cùng hạn quyền gốc; không tạo lại báo cáo. SMTP accepted được phân biệt với bằng chứng thư thực nhận trong Gmail/Chrome.
- PDF tải từ Chrome sau mở email:8trang, đúng hồ sơ/phiên bản1.47.0 và13/13đoạn frozen; xem cả8trang. Người dùng hỗ trợ lưu file vì hộp thoại Save native không cho agent lưu. Hash bản báo cáo không đổi.
- Link dùng lại hiển thị từ chối; DB không tạo session thứ ba. API không cookie đọc/PDF404,admin403. Các test quyền chéo/thu hồi/hết hạn đạt trong bộ liên quan; ca đổi ID trực tiếp trên Chrome bị vùng nội dung xám sau điều hướng, chưa ghi ca này là đạt trên giao diện.
- 34bài Toàn thư công khai, admin có quyền tra cứu đúng dữ liệu, luồng miễn phí vẫn chạy. Toàn bộ file báo cáo cũ và bảng nghiệp vụ cũ giữ nguyên; chỉ thêm dữ liệu nghiệm thu recovery và1báo cáo mới. Backup trước migration007 và cách quay lại đã lưu; chưa diễn tập restore dump.
- Typecheck/build đạt1lượt. Test47/48lượt đầu, lỗi admin do fixture dùng chungDB(expected7/actual12); chạy lại đúng5testadmin trênDBsạch đạt5/5, không sửa assertion. Không chạy toàn gate/PDF.

**Trước beta rộng hơn:** domainHTTPSổn định, diễn tập restore, cấu hình/chính sách email diện rộng và kiểm nhận ở các hộp thư mục tiêu. Gmail vẫn ghim1người nhận thử; không tự bỏ giới hạn. Checkout/giá/hạn quyền, điều kiện thu phí/Live, phê duyệt chuyên môn và các khoảng nội dung ngoài phạm vi vẫn cần xử lý theo kế hoạch; không coi tích hợpemail là hoàn tấtV1.


Cập nhật khép kiểm trực tiếp14:35ngày18/10/2026: Chrome phiên khôi phục mở đúng hồ sơ “Hợp nhất QA Gmail”; đổiID báo cáo khác hiển thị “Không mở được bản đọc”, có ảnh. Lần trắng trước đó không được tính là đạt; lượt kiểm lại này xác nhận chặn đọc chéo trên trình duyệt. DB vẫn2session,1artifact,không đổi hạn/hash. **Đã khép nghiệm thu hợp nhất recovery/Gmail vào QA3062 trong phạm vi một địa chỉ thử**; không sửa code hoặc chạy lại build/gate. Quyền PDF chéo được xác nhận bởi test tích hợp/API khôngcookie; điều hướng API PDF trực tiếp trong Chrome chưa trả nội dung quan sát được, không gán bằng chứng đó là đạt. Các giới hạn trước beta rộng hơn ở mốc trên giữ nguyên.


### Chuẩn bị triển khai beta miễn phí — 18/10/2026

**Đã có gói vận hành và diễn tập phục hồi; chưa triển khai lên host ổn định.** [Hướng dẫn triển khai, lệnh sao lưu/phục hồi và rollback](BETA-DEPLOYMENT.md). Giữ trình bày1.47.0/catalog1.45.0; không đổi ứng dụng, nội dung hoặc thanh toán của QA chính.

- Chuẩn bị `deploy/beta/`: env mẫu không secret; wrapper tái sử dụng Next/worker, lock chặn worker trùng; systemd restart/boot; health CLI/timer; Nginx HTTPS mẫu không lưu query/token; backup/restore và gói nguồn theo allowlist. Server/worker dùng cùng env. Gmail giữ một người nhận thử; Live/test payment không bật trên cấu hình beta mới.
- Đã backup main **24bảng,31file internal +34file trial (có sessions; không phải65báo cáo)**; restore database/kho mới, kiểm hash/count đủ24bảng và65file. Mở một báo cáo1.47.0 đã lưu, PDF9trang đủ21/21đoạn; đã xem9trang. Toàn thư34bài, APIadmin khách403. Không gửi email hoặc tính lại báo cáo trong diễn tập.
- Kiểm cấu hình ban đầu11/11; lượt cuối12/12 gồm chuyển tham số TLS;7fileMJS qua kiểm cú pháp. Chặn worker trùng/đích restore đã tồn tại/dump sai hash. Nginx syntax đạt ở lượt có quyền sau khi sandbox từ chối sysctl/log mặc định. Harness start đầu lỗi import startupQA/`GMAIL_CONFIG_INVALID`; sửa harness, lượt sau web/worker/health/PDF đạt. Không thay code nghiệp vụ và không chạy lại gate/typecheck/build ứng dụng. Systemd/Linux/Node22/build trên host đích **chưa kiểm**.
- Diễn tập3072 đã dừng; không chạm server/worker3062 hoặc3070. Main24bảng/65file không đổi hash;284file app/components/lib/db/scripts/public khớp checkout QA chính. Hai QA vẫn HTTP200,34bài công khai còn nguyên. Bằng chứng tại `.local/beta-deploy-20261018/`, backup riêng có dữ liệu cá nhân, không đóng vào gói nguồn.

**Còn chờ:** máy chủ (OS/CPU/RAM/SSD/quyền triển khai), domain/HTTPS và người quản lýDNS; PostgreSQL tự quản hay managed/quyền/TLS; nơi backup ngoài máy/retention; secret nhập riêng trên host; lịch khóa ghi/cutover. Chưa mua dịch vụ hoặc đổiDNS. Khi có host phải build Linux, kiểm restart/reboot, HTTPS, tạo/đọc/PDF, quyền và Gmail tới người nhận thử. Chưa có bằng chứng tải đồng thời. Chuyển domain không mang cookie ngrok sang; recovery chỉ email đã xác minh/được phép, phiên thử vẫn hạn7ngày. Không hứa lưu vô hạn hoặc email đại trà.

Mốc này khép việc **diễn tập restore** còn thiếu trong bàn giao merge email; không đồng nghĩa đã có production, đã phê duyệt chuyên môn hay hoàn chỉnh nội dung. Luồng beta ổn định giữ phạm vi lập lá số/đọc/PDF/Toàn thư/admin. Giá/checkout/email diện rộng/SePayLive vẫn ngoài gói này.


Chủ dự án đã chọn **Ubuntu**. Đã bổ sung [hướng dẫn từng lệnh cho Ubuntu24.04 x86_64](UBUNTU-BETA-QUICKSTART.md), kèm gói nguồn `tinhluan-free-beta-1.47.0-ubuntu.tar.gz` và checksum, dùng Node22 ở `/usr/local/bin/node`, PostgreSQL16 cùng máy, Chrome, systemd và Certbot/webroot gia hạn HTTPS. Đây là hướng dẫn để chủ dự án tự triển khai; chưa chạy trên máy Ubuntu thật. Còn cần xác nhận OS/kiến trúc/RAM, domain, mô hình DB và nơi backup ngoài máy. QA chính và3070 giữ nguyên.


</details>


### G5 — Admin vận hành, QA ngày 19/10/2026

[Admin QA chung](https://61ac-171-246-109-226.ngrok-free.app/internal/admin) · [Bàn giao và bằng chứng](G5-ADMIN-OPERATIONS-QA.md). **Chỉ Google A có vai trò admin**, theo chỉ định chủ dự án. B/khách/khóa nội bộ chung không được đọc API hoặc trang quản trị. Không dùng email để tự cấp vai trò.

- Đã nối tổng quan theo ngày Việt Nam, người dùng và liên kết bản/đơn/quyền; thống nhất danh sách/bộ lọc/phân trang, CMS cũ. Tổng tiền từ sổ giao dịch chấp nhận, tách Test/Live; webhook là lượt nhận riêng từ G5.
- QA thật: 2 user; 7 đơn Test (6 paid/ready, 1 pending/waiting), 6 khoản/6.000đ mô phỏng, không có Live. G4 một payment/một grant, đúng edition; không tạo thêm đơn/báo cáo để làm dashboard.
- Lỗi PDF/email/worker có mã an toàn bền vững từ G5; CMS ghi người thực hiện trong transaction. Không backfill lịch sử, không suy EMAIL_SENT thành tới Inbox. Quyền/đơn chỉ xem, không thêm nút paid/refund/retry/grant.
- Backup trước010; 30 bảng cũ nguyên hash,31tệp internal/45tệp trial nguyên trạng,54tệp engine/catalog/lịch không đổi;34bài public giữ nguyên. QA3070 không thay đổi. Web/worker G5 dùng cùng cấu hình/kho chính, không chép dữ liệu fixture.
- Kiểm liên quan: lượt đầu53đạt/1lỗi fixture ngắn; sửa fixture rồi10/10; phát hiện/sửa bộ lọc transaction không áp dụng disposition, kiểm lại10/10; SePay route/đối soát32/32. Typecheck/build cuối đạt;86test khác nhau/10file có kết quả còn hiệu lực qua các lượt, không phải toàn gate. UIfixture desktop/360/390, tìm/phân trang/empty/lọc/quyền đã kiểm; APIadmin/CMS khách403, Toàn thư/form200 trênQA.
- Đã quan sát Chrome Google A vào danh sách2người dùng và tổng quan thật63IDbản lưu/7đơn/6.000đTest; khớp máy chủ. Chrome ngắt khi chuyển chi tiết, không báo đã thao tác toàn luồng thật. G4 chỉ khép thao tác quay lại Huynh Đệ khi có xác nhận bấm thật; chưa ghi nhận xác nhận mới. Nội dung12cung, giá/hạn thương mại, Zalo/Live và triển khai máy chủ vẫn là hạng mục riêng chưa hoàn tất. Dừng tại G5.

Thời gian G5 khoảng30phút làm việc (13:15–13:45,19/10); không cộng thời gian G4.

### Kết quả lô Tử–Phu21/10/2026 — ND04/12/13

Code `8776d6e`, trình bày1.56/catalog1.53, baseline28328cc.16nhánh mới đủ điều kiện nguồn;37claim trên37snapshot192. Tử97→93, Phu67→51;10cung khác và nội dung/quyền cũ không đổi. Đã vào form khách QA3062; xem [nguồn và lý do giữ/bỏ từng cổng](PHU-TU-1.33.0.md), [kiểm](TESTING.md), [bài mẫu và bằng chứng](../.local/kin-batch-20261021/ban-giao.md).

Chỉ mở lại đúng các câu trong ảnh199,208–213 cần giải bất nhất với giới hạn triển khai; không đọc lại sách, không quét engine hàng loạt.13nhánh có witness192,1nhánh thêm qua đầu vào mới;2nhánh còn chỉfixture. Phần thiếu: định nghĩa sớm/muộn khi có nếu/mới; TT/lượng từ/vị trí; VCDPhu và nhánh Tử phụ thuộc trạng thái; Đồng–Âm Tý/Lương Tỵ bất nhất. Phạm vi số lượng/thứ bậc/quý tử/đặc tính con tiếp tục ND19, chưa mở. Phương án giữ chưa áp không tăng độ phủ; thẩm định phạm vi hoặc cung cấp bằng chứng định nghĩa là bước cần quyết định, không phải quyền tự code tiếp. Không hẹn ngày đủ12cung.

Khép bàn giao1.56 (chỉ tài liệu): năm nhóm câu hỏi và người quyết định được ghi trực tiếp tại [đặc tả Phu–Tử](PHU-TU-1.33.0.md). ND19: chủ dự án chọn giữ phạm vi hoặc cho thẩm định từng loại; không chọn toán tử, địa chi, trạng thái hay cách tách câu thay chuyên môn. Không còn nhóm đủ đặc tả trong phạm vi hiện hành chưa triển khai; không tuyên bố hết nguồn sách. Hai nhánh chỉfixture đã có code, không ghi là thiếu coding. Không thay trạng thái các đề xuất thành phê duyệt.

Gói quyết định tiếp nối1.56 (chỉ tài liệu, chưa duyệt): [bốn mẫu toàn văn](PHU-TU-1.33.0.md#gói-bốn-mẫu-để-duyệt--chưa-triển-khai-hoặc-publish). ND13: hai nhận định giữ điều kiện chậm/muộn cho Đồng Mão và Đồng–Âm Ngọ, chưa xác nhận điều kiện đã thỏa. ND12/19: xin phép riêng đặc tính thông minh (Hóa Khoa) và khéo tay (Hồng Loan), không mở các loại khác. Không có rule/publish hoặc độ phủ mới; không tạo kế hoạch khác.

**Đã thực hiện gói bốn mẫu theo duyệt trực tiếp,1.57/catalog1.54:** code3bff73c; [toàn văn và nghiệm thu](PHU-TU-1.33.0.md).17 cung mới có nhận định Tử,2 cung Phu chỉ mới có chú giải; không cộng thành cung hoàn chỉnh.41/192 snapshot đổi, bốn nhánh có engine witness; G2/lịch sử/Live giữ nguyên. ND12/13/19 chỉ khép đúng bốn nội dung đã duyệt, các câu hỏi khác giữ nguyên.

## Khép lô Nô–Điền–Phúc 1.58 — 21/10/2026

Baseline9f8d407/code3bff73c đã kiểm lại192; commitcode `e7bd1e4`. Chín nhánh mới,33snapshot có thêm lời; Nô71→71 (0 mới/0 bổ sung), Điền59→43 (16/4), Phúc43→36 (7/8). Không thêm cung chỉ chú giải có điều kiện;23 cung mới có nhận định không đồng nghĩa23 cung hoàn chỉnh. Không sửa các khoảng trống khác hoặc G2/lịch sử. Các dòng ND04/08/09/10 phía trên là trạng thái công việc duy nhất; không tạo kế hoạch tiếp. Nguồn/điểm chặn cụ thể ở [Nô–Điền](NO-DIEN-1.31.0.md), [Phúc–Di](PHUC-DI-1.0.0.md), bằng chứng và cách tạo mẫu ở [bàn giao](../.local/no-dien-phuc-20261021/ban-giao.md). Phần đủ căn cứ trong phạm vi đã rà đã hết; dừng lô, không tuyên bố khai thác hết sách.

## Khép lô Quan–Tài 1.59 — 21/10/2026

Baseline `e9fdbbd`/code `e7bd1e4`,192report khớp1.58/catalog1.55. Code `bb230d5`,3 nhánh toàn thời đoạn:2Quan/1Tài;7snapshot thêm lời. Quan28→24 (4 mới/1 bổ sung), Tài21→21 (0 mới/2 bổ sung); không thêm cung chỉ chú giải điều kiện, không gọi4 cung mới có lời là hoàn chỉnh. Phạm vi đã rà: ma trận45 mục Quan và103 hàng Tài cùng đặc tả CAREER-CLOSE/FINANCE-ASSETS; không còn câu đủ đặc tả chưa triển khai trong phạm vi đó. Không tự mở VCD, lượng từ, bất nhất hay loại nội dung khác. Cập nhật công việc ở ND15/16 phía trên, không tạo kế hoạch tiếp. [Bàn giao toàn văn/cách tạo/kiểm/thời gian](../.local/quan-tai-20261021/ban-giao.md).
