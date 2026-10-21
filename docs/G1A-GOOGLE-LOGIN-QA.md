# G1a — tài khoản khách và Google Login trên QA

Ngày 18/10/2026. Gói chỉ thêm danh tính và liên kết quyền cũ; không triển khai G2. Trình bày bản đọc vẫn **1.47.0**, catalog **interpretation-1.45.0**. Yêu cầu hoàn thiện nội dung **12 cung** trong kế hoạch V1 giữ nguyên, không chuyển thành phạm vi rút gọn.

## Phần đã tích hợp

- Migration `008_customer_accounts.sql` thêm user, danh tính `(provider, subject)`, phiên tài khoản, phiên OAuth và liên kết bản đọc. Dùng PostgreSQL hiện có; không dựng hệ đơn/quyền hoặc báo cáo thứ hai. Cấu trúc danh tính có chỗ cho Zalo; chưa có Zalo Login.
- Google server-side Authorization Code + PKCE S256, state gắn cookie trình duyệt, nonce, thời hạn luồng 10 phút, dùng một lần. `google-auth-library@10.9.1` kiểm chữ ký/issuer/audience/hạn ID token; ứng dụng kiểm nonce. Chỉ xin `openid email profile`, không xin quyền Gmail, không lưu Google access/refresh token.
- Khóa danh tính là Google `sub`; email/tên chỉ là metadata. Hai `sub` có cùng email vẫn là hai tài khoản. Lần đăng nhập sau cùng `sub` trở về đúng user.
- Cookie tài khoản HttpOnly, SameSite=Lax, Secure trên HTTPS; token ngẫu nhiên32byte chỉ lưu SHA-256. Phiên đăng nhập có hạn7ngày và thu hồi khi đăng xuất; hạn này **không thay hạn đọc**.
- Sau đăng nhập, chỉ nhận bản của trial session đang hợp lệ hoặc recovery session đã xác minh. Không nhận ID/email từ khách để cấp quyền. Liên kết giữ owner, bản lưu, đơn nếu có, nguồn recovery nếu có và **hạn gốc**. Không chuyển liên kết đã thuộc một tài khoản sang tài khoản khác.
- Mỗi lần mở/PDF, kiểm lại quyền gốc: phiên trial còn hạn; hoặc đơn paid/ready, báo cáo/hash đúng, access token đơn chưa thu hồi; hoặc binding recovery đã xác minh/chưa thu hồi. Quyền hết hạn/thu hồi không sống lại vì đăng nhập.
- `/la-so-cua-toi`: danh sách bản còn quyền, liên kết thêm bản của phiên, đăng xuất, quay lại báo cáo/tác vụ. Danh sách tối thiểu giới hạn200liên kết gần nhất; chưa làm phân trang/đơn hàng G3. Bản tạo sau đăng nhập có thể dùng nút liên kết trên trang này; không tự gộp theo email.
- Trang đọc/API/PDF miễn phí và đơn dùng resolver hiện có với nhánh quyền tài khoản. PDF luôn là toàn văn bản chi tiết đã lưu, không chạy lại catalog. Giữ quyền internal/admin riêng.
- Đăng xuất chỉ thu hồi phiên **tài khoản**; nếu trình duyệt còn phiên trial/recovery hợp lệ, quyền riêng đó tiếp tục đúng hạn cũ. Không tự thu hồi quyền cũ để làm nút đăng xuất trông như đã xóa mọi quyền.

## Đường dùng thử và cấu hình

- QA chung: https://61ac-171-246-109-226.ngrok-free.app/la-so-cua-toi
- Tạo lá số: https://61ac-171-246-109-226.ngrok-free.app/lap-la-so
- Callback chính xác: `https://61ac-171-246-109-226.ngrok-free.app/api/account/google/callback`
- Mẫu không secret: `.env.google-qa.example`. File thật `.env.google-qa`, mode0600, được gitignore. Không gửi secret qua chat.

Trong Google Cloud / Google Auth Platform:
1. OAuth client loại **Web application**, thêm đúng callback phía trên vào Authorized redirect URIs. Luồng server không cần một client dành cho mobile hoặc JavaScript SDK.
2. Nếu Audience ở Testing, thêm hai tài khoản được phép kiểm vào Test users. Không tự chuyển ứng dụng Google sang Production.
3. Điền `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_AUTH_ORIGIN` tại máy. `CUSTOMER_AUTH_ENABLED=true`; chỉ bật `GOOGLE_LOGIN_ENABLED=true` sau kiểm cấu hình. Dùng cùng HTTPS để tạo bản, đăng nhập và quay lại; cookie của localhost không tự chuyển sang domain ngrok.
4. Đổi domain cần sửa callback tại Google và cấu hình máy chủ; không tự suy domain từ Host hoặc forwarded headers.

Chủ dự án đã báo lưu cấu hình. Đã kiểm **có đủ biến và dạng Client ID**, không in giá trị; Google đã bật trên QA. Việc có đủ cấu hình không chứng minh đăng nhập Google thành công — xem phần bằng chứng thực tế bên dưới.

## Kiểm chứng đã chạy

- Lượt đầu: 3 file tài khoản/recovery/PDF đã lưu, **20/20** đạt.
- Bổ sung ca đơn hàng và HTTP callback: cùng3file, **22/22** đạt.
- Sau bổ sung giới hạn body form OAuth2KB, kiểm lại riêng nhóm tài khoản: **10/10** đạt. Các ca recovery/PDF không sửa sau lượt22/22.
- Typecheck đạt ở các trạng thái đã kiểm; production build đầu đạt, build sau giới hạn form đạt; build thứ ba sau sửa Origin cũng đạt. Không chạy gate nội dung hay bộ PDF.
- Test xác nhận: không gộp email, cùngsub nhận đúnguser, xoay/thu hồi phiên, CSRF/state/nonce/PKCE, hết hạn/dùng lại luồng OAuth, hủy, returnURL allowlist; thiếu quyền không claim; retry không chuyển quyền; recovery chưa xác minh/thu hồi bị chặn; quyền đơn revoked không tảiPDF; accountcookie không cấp quyền API nội bộ.
- Production build chạy riêng loopback3074 với database test: hai danh tính **fixture kỹ thuật**, không phải Google thật. Tài khoảnA đọc đúng nguyên văn/hạn và xuất1PDF bằng pipeline thật; B đọc/PDF404; đăng xuất thu hồi quyền tài khoản. Đã dừng web3074. Bằng chứng `.local/g1a-20261018/http-acceptance.json`; không đưa tokenfixture ra tài liệu.
- Trên QA3062, đã dùng form thực tạo hồ sơ kiểm `170a7177-e01a-44f4-8cd0-b316650c9f44`, mở bản cơ bản, tới trang tài khoản và quay đúngID/mode. Đây là hồ sơ engine mới, khác với fixture danh tính ở DBtest.
- Đã xem mobile360/390: trang tài khoản và điều hướng, scrollWidth bằng viewport, không tràn. Ảnh `account-360.png`, `account-390.png`, `return-context-360.png` trong thư mục bằng chứng. Đây là trạng thái chưa đăng nhập/chờ cấu hình ở thời điểm chụp; không dùng ảnh này chứng minh OAuth thành công.

Các lượt lỗi môi trường/harness: npm lầnđầu ENOTFOUND trong sandbox, cài lại từ registry với quyền mạng đạt, audit0vulnerability; backup lầnđầu bị chặn kết nối và để thư mục rỗng, lầnkếtiếp từ chối ghi đè theo thiết kế, bỏ đúng thư mục rỗng rồi backup đạt; preflight cấu hình một lượt dùng sai workingdirectory, chạy lại từroot đạt. Không có test ứng dụng fail trong những lượt nêu trên; không sửa expected lịch sử. Lần thao tác form mobile chọn nhãn ngày sai timeout, chọn đúng “Ngày12” sau xem nhãn thì tạo được.

## Bằng chứng Google thật

- Lỗi thực tế đầu tiên: native POST từ Chrome mang Origin:null vì trang dùng Referrer-Policy:no-referrer, bị CSRF guard chặn403. Sửa riêng header trang /la-so-cua-toi thành same-origin; không nới guard, không đổi callback. Kiểm HTTP sau sửa: Origin null/ngoại lai vẫn403; cùng origin303 sang Google; callback vẫn no-referrer; hủy và phát lại state được xử lý đúng. Bằng chứng origin-regression.json.
- Google sau đó trả redirect_uri_mismatch. Chủ dự án thêm callback chính xác ở Web client, Google chuyển được tới chọn tài khoản. Đây là sửa cấu hình Google, không sửa secret hoặc bỏ kiểm redirect.
- Lúc16:32 ngày18/10, chủ dự án xác nhận thấy “Lá số của tôi” và “Đăng xuất”. Máy chủ ghi nhận **1 Google identity thật, 1 user, 11 liên kết quyền cũ**; đối chiếu từng liên kết: **11/11 hạn bằng đúng hạn gốc**. Không ghi email, subject, cookie hoặc token vào bằng chứng bàn giao. Dữ liệu an toàn tại google-evidence.json.
- Lúc16:34, máy chủ có **2 phiên đăng nhập cùng1Googleidentity/user, 1 phiên đã thu hồi**, vẫn11liên kết và11/11hạn gốc không đổi. Đã quan sát trực tiếp cửa sổ **Chrome Incognito**: “Lá số của tôi” có11bản, tên/phiên bản/hạn và nút Đăng xuất. Chủ dự án xác nhận chỉ thử1tài khoản Google.
- Sau bấm “Hợp nhất QA Gmail” trong Chrome ẩn danh, URL chuyển đúng bản03769744-87b8-4823-b5e2-0fd66d828bba nhưng công cụ đọc Chrome trả vùng xám, không cung cấp nội dung để xác nhận toàn văn/PDF. Không coi điều này là lỗi ứng dụng đã chứng minh. **Chưa khép bằng chứng tảiPDF qua phiên Google thật và tài khoản Google thứhai**; các ca API/PDF/cách ly đã đạt ở fixture kỹ thuật, không thay nghiệm thu nhà cung cấp.
- Ảnh mobile nút Google đã bật: google-enabled-360.png, google-390.png. Kiểm360px scrollWidth360px; phục hồi viewport sau kiểm. Ảnh chụp native Chrome có thể chỉ ghi vùng xám nên không dùng làm bằng chứng trực quan; bằng chứng danh sách ẩn danh là accessibility tree và trạng thái máy chủ.

## Sao lưu, QA và quay lui

- Backup trước migration: `.local/g1a-20261018/private-backup/`, PostgreSQL customdump và manifest24bảng,31file internal +34file trial (gồm session; không gọi65file là65báo cáo).
- Chỉ áp SQL008 trong transaction; **không chạy script upsert package/giá**. Dữ liệu QA3070 không được chép sang.
- Checkout chạy: `.local/g1a-20261018/qa-google`, web3062 và một worker cùng `.env` + `.env.gmail-qa` + `.env.google-qa`, cùng database/kho QA chính. QA3070 giữ nguyên. Gmail vẫn allowlist; Live vẫn tắt.
- Khởi động lại bằng `node --env-file=.env --env-file=.env.gmail-qa --env-file=.env.google-qa .local/g1a-20261018/runtime.mjs start` và `worker` sau khi dừng đúng PID cũ trong thư mục này. Script từ chối chạy chồng PID.
- Rollback code: dừng đúng start/worker G1a, khởi động `.local/qa-main-email-20261018/runtime.mjs` bằng `.env` và `.env.gmail-qa`. Giữ nguyên bảng008; code cũ không dùng chúng. Không restore backup đè DB hoặc xóa tài khoản/quyền mới. Nếu cần rollback dữ liệu, restore sang DB/kho riêng để điều tra như quy trìnhbeta hiện có.
- Kiểm sau chuyển: toàn bộ65file baseline giữ hash; thêm1session và1bảnkiểm. 23/24bảng cũ giữ hash, bảng `rate_limits` đổi đúng do ca tạo bản.48file engine/calendar/catalog trong manifest giữ hash;34bài công khai và dữ liệu báo cáo/đơn/recovery giữ nguyên. Kết quả có timestamp tại `preservation.json`.

## Điểm dừng

Không đổi chính sách miễn phí/hạn, không paywall, không Live, không adminrole theoGoogle, không G2. Chưa phải G1đầyđủ vì Zalo chưa triểnkhai. Nội dung12cung vẫn là hạngmục bắtbuộc riêng của V1; không dùng tiến độ auth để tuyên bố báo cáo hoàn chỉnh.

Nguồn triển khai: [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect), [thư viện Google Auth Node.js](https://github.com/googleapis/google-auth-library-nodejs). Không dùng email làm khóa nhận diện theo hướng dẫnGoogle; dùng `sub` đã xác minh.

## Lượt triển khai đầu — thời gian và phần còn thiếu tại16:36

Làm việc từ16:09:51 đến16:36 ngày18/10/2026, khoảng26phút (gồm chờ cấu hình và thao tác Google). Phần triển khai đã chạy trên QA; nghiệm thu Google thật còn hai mục nêu trên. Cần tài khoản thử thứhai được Google Audience cho phép và xác nhận tảiPDF trong phiên chỉ đăng nhậpGoogle. Không cần đổi engine/catalog hoặc mởG2 để hoàn tất các ca này.

## Nghiệm thu bổ sung — 18/10/2026, bắt đầu16:38

Ca A đã kiểm bằng Google thật trong Chrome ẩn danh mới, không mở recovery (chủ dự án xác nhận đã đóng hết cửa sổ ẩn danh cũ). Công cụ quan sát trực tiếp danh sách11bản và hạn gốc. Khi điều khiển mở bản, ScreenCaptureKit lỗi ghi hình; đã dừng ngay và chuyển thao tác cho chủ dự án, không lặp kéo dài.

Chủ dự án mở “Hợp nhất QA Gmail” từ danh sách và lưu PDF tại `.local/g1a-acceptance-20261018/a-google.pdf`. Kiểm tệp tải thật:
- Đúng bản03769744-87b8-4823-b5e2-0fd66d828bba, tên, thông tin sinh, bảntrìnhbày1.47.0.
- Đủ13/13đoạn luận,6/6ghi chú phạmvi, các intro và dữkiện12cung so với bảnlưu; không dùng kết quả dựng lại catalog làm expected.
- Đã render/xem8/8trang: dấu tiếngViệt đúng, không thấy cắt chữ/tràn hoặc trangtrắng bất thường.
- SauA,11/11liên kết giữ hạn gốc; không tạo thêm bảnđọc.

Ca B: chủ dự án đã đăng nhập Google thật từ phiên sạch khác; máy chủ xác nhận user/Googleidentity thứhai,0liênkết và UI không hiển thị11bản củaA. Sau đó đã tạo và liên kết bản “G1a — tài khoản B”, ID c77c48a2-5da7-4cf9-9dd8-0ca82057a40c, đúng tài khoản B. Công cụ đọc trực tiếp trang báo cáo B và kiểm DB; đây là bản engine mới qua biểu mẫu, không phải fixture.

Bằng chứng chi tiết tại `.local/g1a-acceptance-20261018/`: observations.md, a-pdf-check.json, report-baseline.json, after-a.json vàảnh8trang. Không chạy lại test/build; không sửa ứngdụng.

### Kết luận nghiệm thu bổ sung lúc16:58

**Khép hai ca còn thiếu của G1a với bằng chứng được phân loại dưới đây.** Các mục “còn chờ” trong lượt16:36 ở trên là lịch sử, được thay bằng kết quả này.

1. **A — PDF bằng Google thật:** nhật ký QA16:52:35 ghi PDF200, chỉ có customer session củaA, không trial/recovery. Chủ dự án tải/lưu a-google-clean.pdf. Đối chiếu đủ13đoạn,6ghi chú, cácintro,12dữkiện cung, tên/thông tin sinh/phiênbản với bảnđã lưu.8/8trang render giống từngpixel với8trang đã xem, không thấy lỗi dấu/cắtchữ/trangtrắng.
2. **B — cách ly quyền:** Googleidentity riêng, danh sách ban đầu0, không thấy11bảnA. B→đọcA được chủ dự án xác nhận bị chặn với thông báo không thuộc phiên/hết hạn; log yêu cầu này không còn trong bộ đệm nên không ghi là đã trực tiếp quan sát HTTPstatus. B→PDF A: nhật kýHTTP404, không recovery, dánURL trực tiếp (fetch-site:none).
3. **B tạo bản riêng; A không nhận bảnB:** bảnB được liên kết đúng userB, mở được200. A→APIđọcB vàPDF B đều404 trong log; chủ dự án xác nhận không tải được và trang hiển thị không mở được bảnđọc. **Các lượt kiểmchéo bằngA còn cookie trial/recovery cũ**; không gọi đó là ca Google-only. Ngay cả các quyền cũ đó cũng không mở được bảnB. CaGoogle-only được chứng minh độc lập ở mục1.
4. **Hạn/nội dung:** cuốiđợtA11liênkết, B1;12/12hạn đúng quyềngốc.11/11bảnA giữhash và hạn so với baselineđợt này. Không tạo lại báo cáoA, không sửa catalog/engine hoặc lịch sử.
5. **Mức bằng chứng:** thao tácGoogle và một sốbướcUI do chủ dựán thực hiện sau khi ScreenCaptureKit lỗi; công cụ trực tiếp quan sát danh sáchA/B và bảnB, đọcPDF tải xuống, đối chiếuDB và logQA cógiới hạn. Không biến fixture trước đây thành bằngchứng Googlethật.
6. **Không chạy thêm test/build**, không sửaứngdụng, không gửiemail, không đổi thanh toán/quyềnadmin, không mởG2/Zalo. Thời gianbổ sung16:38:39–16:58, khoảng19phút.

Automaticapprovalreview đã chặn đề xuất phátlại cookiephiên từlog để kiểmAPI do cách dùng đó chưa được ủyquyền; lệnhkhông chạy. Không bypass hoặc dùng cách đó làm bằngchứng. Nghiệmthu sử dụng thao táctrình duyệt thật và nhật ký chỉđọc. Bằngchứng không chứa cookie/token/email/secret.

Tệp chính: [.local/g1a-acceptance-20261018/a-google-clean.pdf](../.local/g1a-acceptance-20261018/a-google-clean.pdf). Kết quả máyđọc: result.json, a-clean-pdf-check.json, request-evidence.json, google-evidence.json, final-check.json trong cùng thưmục. Nhật ký observations.md phân biệt từng lượt và giới hạn quan sát.
