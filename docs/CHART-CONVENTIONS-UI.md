# Giao diện quy ước lá số — 09/10/2026

Đọc toàn bộ báo cáo kiểm toán và JSON trước sửa. Phần đã giải thích: Mệnh chủ theo chi Mệnh, brightness khác bảng, các lớp UI chưa hiện, chiều an Linh. Thiên Quý còn mơ hồ bước cuối; cấu hình website tham chiếu chưa có. Giữ engine/profile/Mệnh chủ và bộ duyệt1.9, không sửa catalog/evaluator/template sinh bài.

## Thay đổi trình bày

- `lib/chart-presentation.ts` phiên bản1.0.0: chỉ đổi **trường brightness** “Hạn” của iztro@2.6.1 thành “Hãm”. Đã đọc key xian=陷 trong zh-CN và xian=Hạn trong vi-VN. Không sửa node_modules, không replace văn bản “đại hạn/tiểu hạn”. Snapshot cũ vẫn lưu Hạn; nguồn trạng thái cho xem nguyên văn. Dependency khác không tự áp mapping.
- `Chart` có context engine mặc định; preview Tân Biên truyền context tanbien rõ ràng. Không đổi mặc định của luồng khách. Bảng Tân Biên chỉ lấy registry đã có; **Thiên Phủ chưa có registry trạng thái nên hiện chưa đối chiếu**, dù PDF từng được đọc. Không nhập thêm bảng trong đợt này, không fallback engine. Mỗi sao có nguồn/phiên bản sách và nhãn gốc iztro.
- Mệnh chủ vẫn một kết quả hiện hành, giải thích theo chi cung Mệnh trong chi tiết. Không hiển thị Liêm Trinh như Mệnh chủ thứ hai.
- Chi tiết cung hiện chính/phụ/tạp diệu, mutagen bản mệnh, bốn vòng thực lưu, range đại vận/ages. Rỗng và thiếu danh sách khác nhau. Không tạo sao/hạn mới; Tuần/Triệt không tự mở rộng sang cung cạnh.
- Chart remount khi resultId/context đổi, không giữ cung được chọn từ mẫu cũ. Mobile vẫn cuộn lá số trong vùng riêng.
- Ghi chú Linh/Thiên Quý trong chi tiết sao và trang preview nội bộ; root /internal cũng có hồ sơ ghi chú cho catalog Toàn Thư. Không thay claim/rule hoặc lịch sử báo cáo. TanBienResults JSON trace và các văn bản report lưu sẵn vẫn nguyên nhãn gốc, không sửa hàng loạt nội dung lịch sử.

## Danh sách mẫu engine/DEMO cần chú ý

Đây là phạm vi dữ kiện/ngữ cảnh, không khẳng định claim nào cũng thay đổi khi đổi phép an. Danh sách kỹ thuật36mẫu và trace đầy đủ ở JSON đi kèm. Chỉ vn-tiantong có Linh tại Mệnh trong bộ đang xét; không có claim tổ hợp phụ thuộc Linh đang xuất trên mẫu engine.

| Mẫu | Dữ kiện Linh/Quý | Linh tại Mệnh | Claim phối hợp hiện xuất |
|---|---|---|---|
| demo-wuqu-tianfu | Thiên Quý tại Phúc Đức Dần; Linh Tinh tại Thiên Di Ngọ | Không ghi tại Mệnh | Không |
| vn-lianzhen | Linh Tinh tại Phúc Đức Ngọ; Thiên Quý tại Tật Ách Hợi | Không ghi tại Mệnh | Không |
| vn-jumen | Thiên Quý tại Phu Thê Mùi; Linh Tinh tại Quan Lộc Sửu | Không ghi tại Mệnh | Không |
| vn-tanlang | Linh Tinh tại Thiên Di Dần; Thiên Quý tại Mệnh Thân | Không ghi tại Mệnh | Không |
| vn-tiantong | Linh Tinh tại Mệnh Tỵ; Thiên Quý tại Tật Ách Tý | Có | Không |
| vn-taiyang | Linh Tinh tại Phu Thê Thìn; Thiên Quý tại Thiên Di Tý | Không ghi tại Mệnh | Không |
| vn-pojun | Thiên Quý tại Quan Lộc Thìn; Linh Tinh tại Phu Thê Tuất | Không ghi tại Mệnh | Không |
| vn-qisha | Linh Tinh tại Phu Thê Thìn; Thiên Quý tại Nô Bộc Hợi | Không ghi tại Mệnh | Không |
| vn-tianliang | Thiên Quý tại Phúc Đức Tỵ; Linh Tinh tại Quan Lộc Mùi | Không ghi tại Mệnh | Không |
| vn-co-cu-loc | Thiên Quý tại Thiên Di Mão; Linh Tinh tại Tật Ách Thìn | Không ghi tại Mệnh | Không |
| vn-0 | Thiên Quý tại Huynh Đệ Mùi; Linh Tinh tại Phúc Đức Tuất | Không ghi tại Mệnh | Không |
| vn-2 | Thiên Quý tại Phụ Mẫu Thân; Linh Tinh tại Quan Lộc Hợi | Không ghi tại Mệnh | Không |
| vn-4 | Thiên Quý tại Điền Trạch Dậu; Linh Tinh tại Thiên Di Tý | Không ghi tại Mệnh | Không |
| vn-6 | Thiên Quý tại Nô Bộc Tuất; Linh Tinh tại Tài Bạch Sửu | Không ghi tại Mệnh | Không |
| vn-12 | Linh Tinh tại Phúc Đức Thìn; Thiên Quý tại Huynh Đệ Sửu | Không ghi tại Mệnh | Không |
| vn-16 | Thiên Quý tại Điền Trạch Mão; Linh Tinh tại Thiên Di Ngọ | Không ghi tại Mệnh | Không |
| vn-20 | Thiên Quý tại Tật Ách Tỵ; Linh Tinh tại Phu Thê Thân | Không ghi tại Mệnh | Không |
| engine-combo | Thiên Quý tại Tật Ách Dần; Linh Tinh tại Phụ Mẫu Thân | Không ghi tại Mệnh | Không |
| engine-exception | Linh Tinh tại Phụ Mẫu Thân; Thiên Quý tại Điền Trạch Tuất | Không ghi tại Mệnh | Không |
| engine-partial | Thiên Quý tại Phụ Mẫu Tỵ; Linh Tinh tại Tật Ách Hợi | Không ghi tại Mệnh | Không |
| cn-reference | Thiên Quý tại Điền Trạch Dậu; Linh Tinh tại Thiên Di Tý | Không ghi tại Mệnh | Không |

## Nguồn và kiểm tra

[Hồ sơ hai sao](LINH-TINH-THIEN-QUY-INVESTIGATION.md) ghi phép tính, PDF/in10–12 và đính chính chiều bước cuối Thiên Quý. Phần mềm đã xác minh; chưa phê duyệt chuyên môn. Không lấy fixture làm lá số hợp lệ.

Chạy 39 test / 4 file: chart-presentation, tanbien-review-pack, tanbien-presentation, interpretation; typecheck đạt; production build cô lập đạt. E2E một luồng chạy cả360/390: mở chart Tân Biên, mở Quan Lộc, so Vượng sách với Đắc snapshot, đọc vòng sao và xác nhận Hóa Quyền tại Mệnh DEMO, đổi sang vn-16 và mở cung; không tràn ngang, retries0. Nhật ký [unit](evidence/chart-conventions/unit.txt), [build](evidence/chart-conventions/build.txt), [E2E](evidence/chart-conventions/e2e.txt). Không chạy toàn suite hoặc chẩn đoán lại hạ tầng.

Môi trường production test localhost3005 với DB test55443, phiên test cùng origin; dev3000 giữ chạy. Không dùng database thật để tạo/xóa test. Test ca1992đọc JSON kiểm toán nội bộ, kiểm formatter không biến đổi snapshot, Mệnh chủ và toàn execution. Không thêm dữ liệu người dùng vào public hoặc mẫu test công khai.

Ảnh trước: ảnh dự án do người dùng cung cấp ngày09/10 09:53, chỉ hiện chính tinh/brightness iztro — không phải ảnh tự chụp lại phiên lịch sử. Ảnh sau tự chụp trên mẫu DEMO giả lập, không tuyên bố cùng snapshot với ảnh1992: [nguồn360](evidence/chart-conventions/states-360.png), [đổi mẫu390](evidence/chart-conventions/switched-390.png). Ảnh cho thấy hai bảng và dữ liệu cung thực lưu; không có khóa/token.

Xem thử: http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading → “Mở lá số — trạng thái theo Tân Biên” → chọn cung → “Nguồn trạng thái”. Đổi mẫu bằng bộ chọn hiện có. Luồng khách dùng chart mặc định bảng iztro; không phát hành draft ra ngoài nội bộ.

Bảo toàn: SHA256 toàn bộ exports (gồm1.9), catalog/derived/source/engine/calendar/frozen samples và audit JSON trước/sau; xem preservation.json. Không ghi DB; không bật beta/thanh toán/email/AI/scoring. Dừng trước thay phép an.

[Ảnh trước do người dùng cung cấp](</Users/taiho/Desktop/Screenshot 2026-10-09 at 09.53.27.png>). [Kết quả phép tính chẩn đoán](evidence/chart-conventions/calculation.json).

## Cập nhật trình bày 1.1.0 — đợt đối chiếu Linh

- Giải thích Mệnh chủ theo chi cung Mệnh chuyển vào hồ sơ **thông tin chung** của lá số; bỏ khỏi chi tiết từng cung. Kết quả và công thức không đổi.
- Nhãn thiếu dữ liệu đổi thành **“Chưa có đối chiếu trạng thái theo Tân Biên”**. Đây là thiếu bảng trạng thái, không phải chưa an được vị trí sao. Thông báo bảng Tân Biên mới bao phủ một phần; không fallback iztro.
- Công cụ nội bộ `/internal/linh-comparison` là lớp chẩn đoán riêng, không đổi ngữ cảnh hoặc mặc định component Chart. Bộ duyệt nội dung1.9.0 và bảng nguồn không đổi.

## Lá số đầy đủ — trình bày1.2.0

Đợt này đọc đúng `.local/chart-comparison-1992-08-07/audit.json`, không gọi engine để thay thế. Kiểm kê đủ12cung lưu **riêng**, file0600: `.local/chart-comparison-1992-08-07/display-inventory.md` và `.json`. Chạy lại bằng `node --import tsx scripts/chart-inventory-private.ts`. Không đưa dữ liệu cá nhân vào docs/public/fixture. Bảng có các cột cung, dữ liệu snapshot, khung trước, chi tiết trước và dữ liệu chưa có.

Chủ dự án đăng nhập `/internal`, mở `/internal/readings?audit=chart-comparison`. Route kiểm quyền trước đọc tệp cố định; thiếu tệp báo lỗi, không fallback. Trang chỉ đọc snapshot kiểm toán và hiển thị bảng kiểm kê; không tạo bài mới hoặc gắn receipt đầy đủ hồi tố. Hồ sơ đọc động hiện có tiếp tục dùng đúng snapshot đã lưu cùng bài đọc.

### Phân biệt thiếu hiển thị và thiếu dữ liệu

| Lớp | Trước đây | Đầy đủ hiện tại | Giới hạn |
|---|---|---|---|
| Chính tinh | Khung và chi tiết | Nổi bật, trạng thái ngắn | Bảng theo context; Tân Biên không fallback iztro |
| Phụ tinh, tạp diệu | Chỉ trong chi tiết | Tên trực tiếp trong từng cung | Theo nguyên nhóm engine; không tự phân tốt/xấu |
| Tứ Hóa | Trong chi tiết sao | Cạnh đúng sao mang `mutagen`, kèm scope | Không tạo thêm một “sao Hóa” để đếm lần hai |
| Tuần/Triệt | Tên trong tạp diệu của cung đã lưu | Nhãn ngay tại cung đó | Không vẽ thanh chắn hoặc suy án ngữ sang cung kề |
| Bốn vòng | Chỉ trong chi tiết | Khu vực riêng: Trường Sinh, Bác Sỹ, Tuế trước, Tướng trước | Dữ liệu năm sinh, không tự gọi là sao lưu năm xem |
| Đại vận | Mốc đầu trên khung, range trong chi tiết | Range và can chi đại vận đã lưu | Không tính thêm; can chi đại vận trước đây chưa trình bày |
| Tiểu hạn | ages trong chi tiết | Danh sách ages đã lưu, ghi tuổi mụ | Không tự tính năm/ngày từ tuổi |
| Sao lưu năm đang xem | Không có lớp tương ứng trong hồ sơ kiểm toán | Ghi rõ không tính thêm | Không lấy từ ảnh website để điền |

Khác quy ước vẫn giữ riêng: brightness iztro/Tân Biên, Mệnh chủ theo chi Mệnh, Linh và Thiên Quý theo hồ sơ điều tra. Bổ sung hiển thị không giải quyết hoặc che các khác biệt này. Chi tiết Linh/Quý vẫn có ghi chú phương pháp chưa đồng nhất. Không thay bảng nguồn.

### Giao diện và hợp đồng render

`Chart` dùng cùng snapshot cho khung/chọn cung; key resultId+context remount khi đổi hồ sơ. Tân Biên mặc định **Đầy đủ**, context engine của luồng khách vẫn mặc định **Rút gọn**. Hai lựa chọn độc lập với Tổng thể/Phóng to/Danh sách.

Khung đầy đủ min-width1120px trong `.chart-scroll`, không ép chữ nhỏ để vừa360px; chính tinh16px, phụ tinh/vòng14px. Danh sách đầy đủ một cột. Chạm cung đưa focus tới chi tiết, nút đóng đưa focus về cung. Chi tiết không có button lồng button. Tất cả sao được truy bằng evidence path (`data-star-path`), Tứ Hóa bằng đường dẫn sao mang hóa.

Nhãn ngắn “Chưa đối chiếu” chỉ nghĩa thiếu **đối chiếu trạng thái Tân Biên**, không thiếu tên/vị trí. Phụ tinh không có bảng vẫn hiện tên. Chi tiết giữ nguyên nguồn, phiên bản, brightness gốc. Lớp `scope=origin` ghi bản mệnh; scope khác hiển thị riêng, scope thiếu ghi chưa biết, không tự gọi bản mệnh. Tuần/Triệt chỉ là tên sao đã ghi, không có dữ liệu hình học thanh chắn.

`palaceDisplayData` phân biệt mảng rỗng đã lưu với trường thiếu; không tuyên bố mảng cũ đã được kiểm chứng đầy đủ. `periodDisplay` cũng phân biệt ages/range rỗng và thiếu. Các giới hạn về completeness của bản đọc động vẫn giữ nguyên.

### Kiểm thử và bảo toàn

Unit test đối chiếu **từng path+tên+dữ liệu sao** với snapshot riêng, không chỉ tổng số; kiểm scope, mutagen gắn đúng sao, rỗng/thiếu, bất biến snapshot/evaluator. E2E dùng **mẫu engine giả lập** trên production test3005; không sao chép hồ sơ cá nhân vào môi trường test hoặc ảnh bàn giao. Kiểm tra toàn tập path/tên trong DOM, bốn vòng từng cung, mutagen từng sao, rút gọn/đầy đủ, danh sách, focus/đóng chi tiết, đổi hồ sơ và viewport360/390/1440.

Ảnh trước có thể đối chiếu `docs/evidence/dynamic-reading/mobile/dynamic-vn-20-390.png` (cùng dữ liệu giả lập). Ảnh sau trong `docs/evidence/full-chart/mobile/`. Các ảnh không phải hình hồ sơ kiểm toán cá nhân. Hồ sơ cá nhân chỉ xem trực tiếp qua route có quyền hoặc bảng private ở trên.

### Kết quả trực tiếp — 09/10/2026

- Unit: **13/13**, ba file `chart-presentation`, `dynamic-reading`, `tanbien-review-pack`; log `evidence/full-chart/unit-final.txt`.
- Typecheck và production build: đạt; log `evidence/full-chart/typecheck-final.txt`, `build-final.txt`. Lượt typecheck đầu phát hiện bốn callback trong test mới thiếu kiểu; đã sửa khai báo kiểu và chạy lại đạt.
- Production E2E tại `http://localhost:3005`, Chrome, một worker, **retries=0**: **3/3**, 45,9 giây; log `evidence/full-chart/e2e-final.txt`. Các ca gồm quy ước trạng thái, luồng nhập nội bộ và lá số đầy đủ; viewport 360/390/1440px. Lượt trước chỉnh ảnh cũng đạt 3/3; đây không phải kiểm chứng chuyên môn.
- Đã xem ảnh sau cùng: `evidence/full-chart/mobile/full-grid-1440.png`, `full-detail-390.png`; ảnh dùng thông tin sinh giả lập. Chi tiết Linh Tinh đang mở cho thấy nguồn trạng thái và ghi chú sai khác; không tràn ngang cấp trang.
- Đã mở trực tiếp route kiểm toán trên dev 3000 bằng phiên nội bộ, đối chiếu result ID và **toàn bộ path/tên sao DOM** với audit snapshot riêng: khớp. Ảnh và kết quả kiểm tra riêng được giữ tại `.local/chart-comparison-1992-08-07/ui-review/` (thư mục 0700, tệp 0600), không đưa vào bộ ảnh phát hành.
- Đối chiếu hash **106 tệp được bảo vệ: không thay đổi**, gồm engine/lịch, catalog/nguồn/derived facts, bản xuất và mẫu lịch sử, audit riêng; xem `evidence/full-chart/preservation.json`. Không ghi database hiện hành. Bản đọc/snapshot cũ giữ nguyên; lớp trình bày mới đọc dữ liệu đã lưu.

Giới hạn còn lại: không có lớp sao lưu năm xem hoặc hình học án ngữ hai cung trong hồ sơ này; bảng trạng thái Tân Biên chưa bao phủ mọi sao. Không bổ sung dữ liệu từ ảnh tham chiếu và không kết luận phép an Linh Tinh/Thiên Quý đã được thống nhất. Beta, thanh toán và email thật không được bật trong đợt này.

## Phiếu truyền thống 1.0.0 — 09/10/2026

Task Công việc đã bàn giao ở template 1.11.0 trước đợt này. Không đổi engine v2/0.2.0, catalog, evaluator, template luận hoặc dữ liệu lịch sử.

### Sử dụng và phạm vi tích hợp

Mở `/internal/readings`, chọn hồ sơ, mở **Mở lá số — trạng thái theo Tân Biên**. Phiếu mới nằm trong `Chart` dùng chung với `Experience` (sau nhập sinh và xem hồ sơ đã lưu), preview nội bộ và đường dẫn kiểm toán. Không tạo route demo mới. Chọn **Vừa màn hình**, **Phóng to** (kéo trong vùng riêng) hoặc **Danh sách**; chạm cung mở căn cứ hiện có. **Tải PNG 2400px** và **In / lưu PDF A4** chỉ xuất phiếu, không xuất nút, bài đọc hoặc trace.

`components/ChartSheet.tsx` dùng một SVG 1200×1760 cho cả web và xuất. PNG 2400×3520; bản in SVG giữ chữ vector, A4 dọc, lề 8mm. Chờ `document.fonts.ready`, giải mã ảnh trước PNG. Không tải font/ảnh/dữ liệu cá nhân lên dịch vụ ngoài. Export giữ resultId, profile, mật độ và năm xem của snapshot đang mở. Thay resultId remount state cung đang chọn.

### Ánh xạ và quy tắc trình bày

`lib/chart-sheet.ts` là phép chiếu thuần, không tính sao. Vị trí theo địa chi, không theo vị trí phần tử mảng. Chính tinh giữ thứ tự nguồn; phần còn lại giữ thứ tự phụ tinh → tạp diệu → vòng đã lưu → sao lưu, chia luân phiên hai cột để dàn chữ. Màu trung tính; đỏ dùng cho thương hiệu, Thân và nhấn dòng Tứ Hóa, không phải phân loại tốt/xấu/ngũ hành.

- Mỗi thực thể có các evidence paths. Tứ Hóa lấy từ `star.mutagen`, dòng riêng giữ `parent` trỏ sao mang hóa; chi tiết cung vẫn có quan hệ gốc.
- Không khử trùng chung theo tên. Chỉ gộp alias đã xác định, cùng cung và `scope=origin`, dependency iztro2.6.1: Hoa Cái/Hàm Trì/Kiếp Sát giữa adjectiveStars và jiangqian12; Thiên Đức giữa adjectiveStars và suiqian12. Đối chiếu `adjectiveStar.js`, `location.js`, `decorativeStar.js` của thư viện đang cài và phép Kiếp Sát v2. Hai đường dẫn vẫn được giữ. Thực thể khác lớp hoặc không thuộc ánh xạ này không bị gộp.
- Tuần/Triệt bản mệnh có `voidRanges` thay các bản ghi sao thuộc chính phạm vi ấy bằng nhãn cặp, vẫn giữ tất cả đường dẫn. Sáu vị trí cặp được kiểm tra riêng; trùng cặp gộp nhãn. Snapshot cũ không có cặp vẫn hiện tên tại cung đã ghi, không tự mở rộng.
- Vòng Tràng Sinh ở chân cung; ba vòng khác nằm trong vùng sao. Tuổi bắt đầu đại hạn ở góc phải; chuỗi tuổi dài ở chi tiết. Nếu snapshot đã có năm xem: sao lưu có tiền tố “Lưu”, tháng tại cung và dấu tiểu hạn từ `viewing`. Không tự chọn năm hiện tại.
- Ký hiệu trạng thái chỉ lấy `starState` theo context/profile. Tân Biên không fallback iztro. Không có ký hiệu không đồng nghĩa bình hòa. Bảng nguyên gốc/nguồn/phiên bản còn trong căn cứ.
- Thiếu danh sách khác danh sách rỗng; chỉ dùng “Vô chính diệu” khi metadata xác nhận chính tinh đầy đủ. Không sửa metadata cũ.

### Khác ảnh tham chiếu và phần chưa được lưu

Các khác biệt sao/vị trí/Mệnh chủ giữ nguyên theo snapshot và hồ sơ engine v2; không sao chép dữ liệu website tham chiếu. Tham khảo báo cáo so sánh và hồ sơ bất đồng engine hiện có. Màu ngũ hành chưa có metadata trình bày được xác minh nên không tái tạo màu của ảnh.

Snapshot kiểm toán được dùng không lưu tên hiển thị, can chi tháng/ngày/giờ, quan hệ Mệnh–Cục, thuận/nghịch lý hoặc năm xem. Phiếu không suy các mục đó từ ảnh hoặc ngày hiện tại. Giờ thực nhập và khoảng giờ chi hiển thị riêng. Nạp âm, Cục, giới tính, can chi năm và Mệnh/Thân chủ lấy các trường đã lưu. Luồng hồ sơ mới có năm xem hiển thị lớp lưu tương ứng. Chi tiết ngày/giờ xem hiện vẫn nằm trong căn cứ hiện có; không thêm phép tính vào phiếu.

Ảnh Kim Thoa chỉ dùng đối chiếu bố cục; không tái lập hồ sơ vì không có phút sinh thực nhập được xác nhận. Fixture đông sao là **fixture trình bày**, dùng nhãn “Sao bố cục”, không phải expected chuyên môn hay lá số engine hợp lệ. Không sao chép logo, con dấu hoặc watermark.

### Kiểm tra thực chạy

- 11/11 test, 2 file: `chart-sheet.test.ts`, `chart-presentation.test.ts`. Kiểm tập đường dẫn, liên kết hóa, alias theo lớp, sáu cặp Tuần/Triệt và trùng cặp, missing/empty, bảng trạng thái không fallback, compact/full, bất biến snapshot và execution.
- Typecheck và production build cô lập đạt; log tại `docs/evidence/chart-sheet/`. Không chạy toàn bộ suite.
- Chrome production tại localhost3005, phiên riêng cùng origin, dữ liệu test riêng: mở hồ sơ kiểm toán đã được phép, so tập paths thực render từng sao; kiểm bounding box không vượt ô; download PNG; gọi nút in và kiểm đúng nội dung iframe; xuất PDF từ nội dung in. Desktop1440, mobile360/390: không tràn trang, phóng to, mở/đóng cung, mở nguồn trạng thái, chuyển mật độ, đổi hồ sơ không giữ cung cũ. Hai hồ sơ sinh giả lập được tính bằng engine hiện tại cho năm xem2026/2027 kiểm đổi snapshot và lớp lưu. Không ghi database thật.
- Lượt đầu phát hiện React418 do các con text tách trong SVG title; sửa thành một chuỗi title. Đã chạy lại không còn pageerror, không dùng retry tự động. Đây là kiểm tra trong các kịch bản đã chạy, không chứng nhận mọi trình duyệt hoặc máy in.
- PNG2400×3520 và PDF một trang A4 đã được mở/xem trực tiếp; PDF render bằng Poppler. Fixture cung đông sao và nhãn chung đã kiểm trực tiếp và kiểm giới hạn SVG. Native hộp thoại máy in không được tự xác nhận; phép thử dùng nội dung in thực và Chrome PDF.
- 151 tệp baseline trong engine/calendar/rules/exports/internal-readings so SHA256 không đổi. Không bật beta/email/payment/AI/scoring; không đổi snapshot/bản đọc cũ. Không có phê duyệt chuyên môn mới.

Bản xuất/ảnh hồ sơ kiểm toán và nhật ký chi tiết nằm riêng `.local/chart-sheet/` (không public): `audit.png`, `audit.pdf`, `desktop.png`, `mobile-360.png`, `mobile-390.png`, `details-360.png`, `details-390.png`. Script kiểm riêng cũng ở đây; không đưa dữ liệu sinh vào fixture phát hành. Các tên/giới hạn chưa có trong snapshot vẫn thiếu một cách có chủ đích, không được xem là đã hoàn thiện dữ liệu theo ảnh tham chiếu.

### Nền trống đồng và đường chiếu — phiếu 1.1.0

Dùng nguyên tệp `Trongdong.webp` chủ dự án cung cấp, sao chép sang `public/images/trongdong.webp`; không chỉnh ảnh hoặc lấy watermark website. Nền mặc định bật, độ mờ0.12, có checkbox tắt. PNG và bản in nhúng ảnh thành data URL, đợi decode thành công; không phụ thuộc tài nguyên ngoài khi xuất.

Rê chuột/focus vào cung: hai đường tam hợp (khoảng cách4/8 chi) và một đường đối cung (6chi), điểm đầu/cuối ở mép trong phiếu. Tái sử dụng `palaceGeometry`, kiểm đủ12cung và địa chi duy nhất; thiếu dữ liệu không tự vẽ đủ đường. Chỉ là hình học hiển thị, không định nghĩa hội hợp hoặc tạo luận giải. Đường được đặt sau nền, dưới chữ; pointer-events none để không cản thao tác. Điện thoại/bàn phím dùng focus/chọn cung. Không đưa đường hover/focus vào PNG/in.

Đã mở trang AItuvi do chủ dự án gửi; trang dừng ở skeleton với lỗi Failed to fetch, nên **chưa xác minh trực tiếp hiệu ứng hover của website đó**. Cách nối dựa trên ảnh đã cung cấp và quan hệ hình học sẵn có trong dự án, không tuyên bố sao chép chính xác mọi tương tác website.

Kiểm tra đợt này:12test/2file đạt, typecheck và production build cô lập đạt. Kiểm trực tiếp component thật bằng mẫu sinh giả lập trên server tạm3006: bật/tắt nền, đổi cung, con trỏ đi vào Ngọ cập nhật3đường ngay cả khi cung không focus; Tý nối Thìn/Thân/Ngọ; không có lỗi console. Đã tải PNG2400px và trực tiếp xem ảnh có nền, không có đường tương tác. Không chạy lại native print/PDF trong đợt này; nhánh in dùng chung serialize đã nhúng ảnh. Trang hồ sơ trên3000 yêu cầu đăng nhập tại lúc kiểm tra; không thay cơ chế quyền để vượt qua. Không sửa engine/rule/snapshot/bản đọc. Ảnh mẫu kiểm tra và log lưu `.local/chart-sheet-background/`.

## Phiếu 1.2.0 — nền, màu tham khảo và chọn năm (2026-10-09)

Đã mở lại trang AItuvi do chủ dự án cung cấp và thao tác cả hai lựa chọn lưu vận. Trang tải thành công: đại vận thêm các dòng `DV.` (Lộc Tồn/Kình/Đà/Mã/Khôi/Việt/Tứ Hóa…), tiểu vận thêm các dòng `L.`. Không coi chúng là expected chuyên môn.

- Trống đồng: dùng nguyên tệp người dùng, sau nền giấy và trước toàn bộ chữ/cung; mở rộng 1200×1200, opacity 0.075. PNG nhúng asset; không phụ thuộc đường dẫn ngoài khi xuất.
- `lib/chart-reference-colors.json`: bảng **màu trình bày** đọc từ chữ sao/vòng trên trang tham khảo, không phải bảng ngũ hành Tân Biên. `chart-colors.ts` giảm độ sáng đỏ/xanh/cam để chữ nhỏ dễ đọc; tên chưa có màu dùng trung tính. Không nhập dữ liệu sinh từ trang vào bảng màu. Không suy ngũ hành, tốt/xấu, không đưa metadata màu vào engine/facts.
- `ReadingYear` trên hồ sơ `/internal/readings?id=…`: nhập năm âm → API nội bộ hiện có → snapshot mới có `parentId` → mở bản mới. Không ghi đè lịch sử; không mang ngày/giờ xem cũ sang năm khác. Giữ profile v2; kiểm tra phạm vi năm theo schema hiện hành.
- “An lưu tiểu vận”: bật/tắt đúng **9 sao lưu năm, tiểu hạn và vị trí tháng đã lưu**. Không tuyên bố tương đương toàn bộ lớp lưu của AItuvi. Năm chưa có thì khóa điều khiển.
- **Chưa hỗ trợ bộ sao lưu đại vận**: checkbox khóa và có nhãn rõ. `viewing.decade` chỉ là vị trí lưu đại hạn; có checkbox riêng “Hiện vị trí lưu đại hạn”. Không đổi tên vị trí này để giả làm bộ sao `DV.`. Muốn hoàn thiện phần còn lại cần đặc tả và kiểm chứng riêng bộ sao đại vận; đợt này không sửa engine/profile.
- Bộ lọc chỉ áp dụng phiếu và bản xuất; chi tiết cung/danh sách tiếp tục cho xem dữ liệu snapshot đã lưu. Mỗi bản xuất ghi các lớp đang bật.

Kiểm tra thực chạy: 16/16 unit test (chart-year, chart-sheet, chart-presentation), typecheck và build production cô lập đạt. Đã thao tác luồng thật localhost:3000 với hồ sơ giả lập: chọn 2026, tạo bản con mới, mở phiếu; toggle sao lưu/đánh dấu đại hạn; mobile 360 và 390 không tràn ngang. Bản con thử: `59310653-5419-4b86-90df-dba9901a57bd` (không phải hồ sơ cá nhân). PNG 2400×3520 đã tải và xem trực tiếp. Bằng chứng ở `.local/chart-sheet-background/colors-year.png`, `live-year.jpg`, `live-mobile360.jpg`, `live-mobile390.jpg`; ảnh 390 chụp trước chỉnh cỡ checkbox, ảnh 360 sau chỉnh. PDF chưa chạy lại trong lượt này; vẫn dùng cùng bộ tuần tự hóa SVG. Không đổi catalog, rule, engine hoặc snapshot cũ.

### Phiếu 1.2.1 — nền và màu luôn bật

Theo yêu cầu chủ dự án: bỏ hai checkbox nền/màu; tăng opacity trống đồng từ 0.075 lên 0.20, vẫn sau chữ và đường cung. Thêm các ô màu Kim/Mộc/Thủy/Hỏa/Thổ theo bảng màu tham khảo bên dưới phiếu, giữ nhãn “Màu tham khảo” (không xác nhận bảng ngũ hành Tân Biên). Chú thích nằm trong SVG nên có trong PNG/PDF. Không thay dữ liệu hay phép an. Typecheck đạt; kiểm tra trực tiếp hồ sơ giả lập trên `/internal/readings`, xác nhận hai checkbox biến mất, nền 0.20 và đủ năm nhãn màu. Ảnh: `.local/chart-sheet-background/always-on.jpg`.

### Sửa luồng hồ sơ chưa có năm xem

Nguyên nhân: checkbox chỉ bật/tắt dữ liệu `viewing` có sẵn; hồ sơ cũ thiếu năm bị disabled, còn form năm nằm ngoài phiếu. Đưa ReadingYear vào ChartSheet qua readingId chỉ từ route hồ sơ nội bộ. Ô năm đề xuất năm hiện tại (giới hạn 2050/năm sinh), chưa coi đó là dữ liệu đã tính. Chọn checkbox khi chưa có lớp năm gọi API hiện có để tạo bản con và chuyển tới #reading-chart; phiếu bản có năm tự mở. Snapshot nguồn không đổi. Bản có lớp năm tiếp tục toggle thuần. Nhãn bản chưa tính là “Bản mệnh (chưa lập lớp lưu năm)”, tránh lẫn năm nhập với năm đang hiển thị. Hai test render bổ sung kiểm tra checkbox không bị khóa khi thiếu năm và giữ năm đã lưu; tổng 18 test liên quan đạt. Cấu hình Vitest bổ sung JSX automatic bằng oxc và alias @ để kiểm tra component thực. Lượt mở trình duyệt xác nhận phiên nội bộ đã hết hạn; chưa chạy lại click tạo hồ sơ end-to-end sau sửa này.

### Phiếu 1.3.0 — hai cột theo ảnh Kim Thoa

Thay chia xen kẽ bằng bảng trình bày `lib/chart-columns.ts`, phiên bản `reference-kim-thoa-1`, đối chiếu trực tiếp ảnh chủ dự án gửi. Chính tinh giữ phía trên; sao phụ, Tứ Hóa và vòng sao theo cột trái/phải của ảnh. Không suy nhóm từ màu hoặc trạng thái miếu/hãm. Đây là quy ước trình bày theo mẫu, không kết luận tốt/xấu tuyệt đối (ví dụ Tướng Quân ở phải trong ảnh). Tên chưa đối chiếu giữ cuối cột trái, đánh dấu *, không bị bỏ. Sao lưu giữ lớp/nhãn và dùng nhóm sao gốc; Lưu Hà là tên sao bản mệnh, không bị cắt tiền tố. Không khử trùng hoặc thay đổi thực thể khi chia cột. SVG dùng chung cho xem và xuất.

11/11 test liên quan đạt (chart-columns, chart-sheet, chart-year-controls); typecheck đạt. Kiểm tra component thật trong trình duyệt với hồ sơ sinh giả lập: hai cột, tên sao lưu, Lưu Hà, chính tinh, chú giải và chế độ vừa màn hình. Ảnh đã xem trực tiếp: `.local/chart-sheet-background/columns-final.jpg`. Phiên nội bộ hết hạn nên không tuyên bố đã kiểm lại toàn luồng xác thực hoặc xuất PDF trong lượt này. Không đổi engine, rule, snapshot hoặc bài đọc.

### Kiểm lại lỗi năm xem trên luồng thật — 2026-10-10

Đã thao tác localhost:3000/internal/readings bằng phiên nội bộ: hồ sơ giả lập dfd66fc6-3ebb-4513-855f-c02802f1b016 chưa có năm → bấm checkbox An lưu tiểu vận → tạo bản con 52abb0fb-cc84-4a5d-8e95-175a2066c2eb năm 2026 → mở phiếu có Năm đang hiển thị: 2026 và checkbox checked. Bật/tắt loại đúng 9 sao lưu năm (10 tên bắt đầu Lưu khi bật, còn 1 là sao bản mệnh Lưu Hà khi tắt). Thêm dấu chọn và thông báo đang lập năm trong lúc chờ để tránh checkbox trông như không phản hồi. 12 test/3 file liên quan và typecheck đạt. Ảnh trình duyệt: .local/chart-sheet-background/year-fix-live.jpg. Hồ sơ cũ không ghi đè.

### Lập phiếu ngay trang chủ — 2026-10-10

Trang / dùng InternalBirthForm và API nội bộ hiện hành, mặc định profile v2. Phiên hợp lệ nhập trực tiếp; chưa có phiên dùng InternalForm với returnTo=/; endpoint đăng nhập chỉ cho quay về / hoặc /internal, không nhận redirect ngoài. Trang chủ không còn đi qua bước gói/đơn hàng. Sau tạo mở /internal/readings?id=…&chart=1#reading-chart, phiếu mở sẵn dù chưa chọn năm. Bản đọc và snapshot lưu theo cơ chế cũ.

Đã kiểm tra trình duyệt thật từ trang chủ, nhập dữ liệu giả lập 2002-11-16 00:00 nữ Hà Nội không năm xem, tạo bản a26d665c-582c-4c12-9ab2-0d0a41cade12 và xác nhận phiếu mở đúng snapshot, có nút PNG/PDF. Ảnh .local/chart-sheet-background/home-form.jpg và home-created.jpg. 2 test trang chủ kiểm phiên chưa đăng nhập/đã đăng nhập đạt; 9 test chart-sheet/year-controls đạt; typecheck đạt. Không thay quyền truy cập API, engine hoặc lịch sử; không bật beta/thanh toán/email.

### Điều chỉnh theo yêu cầu giữ nguyên trang chủ — 2026-10-10

Đã hoàn nguyên thay đổi giao diện và luồng trang chủ ở mục trước: dùng lại Experience nguyên bố cục, không thay bằng biểu mẫu nội bộ. Chỉ mặc định năm xem bằng năm hiện tại theo Asia/Ho_Chi_Minh (truyền từ server vào Experience để đồng nhất render), và bỏ năm 2026 cố định trong lựa chọn năm. Khi đổi sang profile không hỗ trợ lưu năm thì bỏ viewYear. Form nhập nội bộ cũng mặc định năm hiện tại cho hồ sơ mới; dữ liệu initial của hồ sơ đã lưu vẫn được ưu tiên.

### Sửa origin trang chủ — 2026-10-10

Cấu hình APP_ORIGIN trỏ ngrok; CUSTOMER_ALLOWED_ORIGINS thiếu http://localhost:3000 dù allowlist nội bộ có. Bổ sung đúng origin localhost vào .env cho API trang chủ, không đổi bộ kiểm origin/Host hoặc cho phép wildcard. Ba test customer-origin đạt, gồm tunnel + localhost và chặn port/host ngoài danh sách. Đã nhập hồ sơ giả lập qua trang chủ và bấm xác nhận: lập phiếu thành công, năm 2026 và An lưu tiểu vận checked. Giữ nguyên giao diện. Ảnh: .local/chart-sheet-background/home-origin-fixed.jpg.

### Phiếu 1.4.0 — nguồn và lớp sao

Mặc định Tân Biên hiển thị danh mục đã đặc tả. Lớp bổ sung iztro bật riêng, không xóa khỏi snapshot; nguồn và đường dẫn từng sao xem ở mục “Nguồn sao và phạm vi dữ liệu”. Vòng Tướng trước dùng năm sinh trong snapshot natal, không gắn nhãn sao lưu chỉ vì tên hàm upstream. Phi Liêm Bác Sỹ và sao riêng Phi Liêm là hai mã khác nhau. Thai Phụ hiển thị theo tên sách, snapshot vẫn giữ Đài Phụ. Mệnh chủ/Thân chủ ghi rõ iztro. Dấu * phân cột cũ đã bỏ; màu/nhóm cột không đại diện cho nguồn. Hồ sơ kiểm tra chi tiết: phần đối chiếu Kim Thoa trong `TANBIEN-ENGINE-TRIAL.md`.
