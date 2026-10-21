# Đối chiếu lá số 07/08/1992 — kiểm toán chỉ đọc

Ngày kiểm tra: 09/10/2026. Không sửa engine, rule, snapshot, database hoặc bộ duyệt template 1.9.0. Hai ảnh là chứng cứ hiển thị, không phải chuẩn chuyên môn. Báo cáo này không luận vận mệnh.

## 1. Hồ sơ đã tìm và độ chắc chắn

Có **một** bản ghi phù hợp trong database đang cấu hình: snapshot `d6e24db3-9311-4cb9-b046-02cc92d8cce1`, result `b9814a624f44267102346c1bf13bdd1f07d938d6be6a3849c811e52d6b118927`. Truy vấn trong transaction `BEGIN READ ONLY`, lọc ngày 1992-08-07, nam, giờ 15–16; không đọc orders/email/token. Hồ sơ lưu **16:00, Quảng Nam**, solar, Asia/Ho_Chi_Minh, profile `vn-utc7-midnight-v1`. Đây là giá trị hồ sơ, không phải giả định từ ảnh; ảnh chỉ cho biết giờ Thân. Không xuất tên trong ảnh tham chiếu.

Snapshot khớp toàn bộ 14 chính tinh, 12 can chi cung, Cục, vị trí Thân, Mệnh chủ/Thân chủ và nhãn trạng thái đọc được từ ảnh dự án. Không có request ID/URL đầy đủ trong ảnh nên chưa thể chứng minh tuyệt đối ảnh được tạo bởi chính request lưu bản ghi này. Trạng thái ambient `/internal?sample=vn-lianzhen` không được coi là hồ sơ của ảnh.

Raw HTTP input **không có trong snapshot**: bảng birth_profile_snapshots cũng lưu normalized. Ngày dân sự không đổi UTC; phút lưu 0, engine dùng timeIndex=8, độ phân giải hai giờ. Nơi sinh không dùng để hiệu chỉnh giờ mặt trời.

## 2. Đường đi dữ liệu và tái hiện

`components/Experience.tsx:generate` POST `/api/chart` với birth → `app/api/[...action]/route.ts` → `calculate` → `normalize` (`lib/calendar/index.ts`) → tiến trình `scripts/engine-vn.cjs` → bridge lịch → iztro → DTO snapshot → `setSnapshot(data)` → `<Chart snapshot={snapshot}>`. Khi đặt đơn, server tính lại từ birth và lưu normalized/chart trong transaction; chart miễn phí không tự lưu riêng.

Trong `components/Chart.tsx`, `const a = snapshot.chart`; ngày giữa lá số là `a.solarDate`, giờ là `a.time/a.timeRange`, Cục/Mệnh chủ/Thân chủ cùng `a`, các ô dùng `a.palaces`. Không có DEMO fallback hoặc cache lá số trong đường này. localStorage trong Experience giữ mã đơn, không giữ chart. Đã đọc code, chưa tái dựng phiên trình duyệt lịch sử; không có HAR của lần chụp để loại trừ mọi race lịch sử. Không kết luận có cache sai từ bố cục giống DEMO.

Đã chạy `calculate` với **đúng normalized đã lưu**, không nhập thời gian giả. So deep equality toàn payload và resultId: **cùng dữ liệu và cùng hash**. Đây là tái lập nội bộ, không phải expected độc lập xác nhận engine đúng.

## 3. Cấu hình và lịch

Lockfile và package thực cài trùng: iztro 2.6.1, lunar-lite 0.2.8, lunar-typescript 1.8.6, astronomy-engine 2.1.19, dayjs 1.11.23. Snapshot ghi engine vn-adapter-1.0.0, calendar vn-astronomical-1.0.0, bridge iztro-vn-bridge-1.0.0. Không có build/commit ID thời điểm tạo trong snapshot.

Thực thi: algorithm=default; yearDivide/ageDivide/horoscopeDivide=normal; dayDivide=current; fixLeap=false; vi-VN; không custom brightness/mutagens. Bridge thay toàn lunar-lite trước require iztro, chặn truy cập lunar-typescript. Thư viện CN vẫn cài nhưng không được dùng đổi lịch trong profile VN.

Âm lịch lưu **9/7/1992, không nhuận**. Sóc UTC 1992-07-29 19:35:42.132 → ngày UTC+7 30/7; đầu tháng 30/7, tháng 29 ngày, tháng sau 28/8. Không có cảnh báo biên. Đổi ngày 00:00; năm đổi mùng 1 tháng 1 âm; tháng nhuận lặp số tháng. Không phải đổi nhãn UTC+8 thành UTC+7.

Can chi bốn trụ không có trường lưu trong DTO. Phần `derived` của JSON tái chạy **hàm bridge** theo input đã lưu: Nhâm Thân / Mậu Thân / Ất Mão / Giáp Thân, trùng chữ ảnh. Không ghi thêm vào snapshot. Chưa đối chiếu nguồn lịch độc lập cho riêng ngày này trong đợt này.

## 4. Bảng đối chiếu theo lớp

| Hạng mục | Dự án | Ảnh tham chiếu | Nguồn/công thức dự án | Kết luận | Bằng chứng còn thiếu |
|---|---|---|---|---|---|
| Lịch | 9/7 Nhâm Thân không nhuận | 9/7 Nhâm Thân | vietnamese.cjs + iztro-bridge.cjs | Trùng ở ngày này | Nguồn lịch độc lập; cấu hình website kia |
| Mệnh/Thân | Tý / Thìn, Thân cư Quan Lộc | Như dự án | palace.js:getSoulAndBody; thángIndex6, giờ8; (6−8) mod12=10=Tý; (6+8) mod12=2=Thìn trong thứ tự Dần | Trùng | Chưa xác nhận chuyên môn độc lập |
| Cục | Mộc Tam Cục | Mộc tam Cục | Nhâm Tý: can số5 + chi số1 −5=1 → wood3rd | Trùng | Không chứng minh toàn bộ hệ quy tắc |
| 14 chính tinh | Vị trí trùng toàn bộ ảnh | Xem bảng dưới | star/majorStar.js, location.js:getStartIndex | Không thấy sai khác vị trí | Nguồn an sao độc lập đầy đủ |
| Mệnh chủ | Tham Lang | Liêm Trinh | astro.js:212, bảng earthlyBranches | Hai công thức cho đúng hai kết quả | Chưa biết website kia chọn trường phái/công thức nào |
| Thân chủ | Thiên Lương | Thiên Lương | chi năm Thân → body | Trùng | Nguồn chuyên môn của website kia |
| Trạng thái | brightness iztro | Nhiều nhãn khác | STARS_INFO + i18n; không phải bảng Tân Biên | Khác bảng; thêm lỗi dịch nhãn Hạn | Không kết luận bảng nào đúng tuyệt đối |
| Tứ Hóa | 4 mutagen có scope origin | Cùng vị trí bốn Hóa | can sinh Nhâm, heavenlyStems | Dữ liệu có, UI không hiện thuộc tính mutagen | Ảnh không có source metadata |
| Phụ tinh | Có minor/adjective và vòng sao | Nhiều tên thêm/khác | location/adjective/decorativeStar.js | Vừa ẩn UI, vừa khác phép an và danh mục | Các tên chưa đồng nhất phải xét riêng |
| Tuần/Triệt | Tuần Không Tuất; Triệt Lộ Dần; Không Vong Mão | Marker Tuất–Hợi / Dần–Mão | yearlyIndex + default branch | Khác biểu diễn một nhãn/cung với marker hai cung | Không tự suy phạm vi án ngữ từ DTO |
| Đại vận | 3–12 ở Mệnh, rồi13–22…113–122 | Số đầu3,13,…113 trùng | getHoroscope theo Cục/nam dương | Trùng số đầu 12 cung | Chưa so luận vận |
| Năm xem | Không có horoscope2026 trong DTO | 2026 Bính Ngọ,35tuổi,T.1–T.12 | chỉ bySolar ngày sinh; không gọi horoscope | Không cùng lớp dữ liệu | Thuật toán tháng/tiểu vận website tham chiếu |

## 5. Trạng thái: tách engine, sách, ảnh

UI hiển thị nguyên `majorStars[].brightness`. Rule Tân Biên cần trạng thái tra **bảng riêng** `lib/interpretation-rules/tanbien-source.ts` qua `derived.ts`, không dùng brightness làm fallback. Bảng này không thay snapshot. Rule R05 Quan Lộc không thêm điều kiện brightness; không được suy rằng mọi trạng thái bảng dưới đều đang dùng làm điều kiện của rule.

Trong chính hồ sơ này Vũ Khúc tại Tý cùng Vượng giữa engine và bảng sách; khác biệt ở các cung khác không phải bằng chứng R02 dùng nhầm bảng. `Chart` chỉ ghi iztro trong caption, chưa giải thích rõ hai hệ nhãn ngay trên ô. Căn cứ Tân Biên có nhãn bảng nguồn và ghi chú không thay engine; người xem vẫn có thể thấy hai nhãn khác nhau mà thiếu đối chiếu trực tiếp. Đây là thiếu giải thích giao diện, không sửa bảng để làm chúng trùng.

| Sao / cung chi | Engine (key gốc) | Ảnh tham chiếu | Tân Biên đã đọc trực tiếp |
|---|---|---|---|
| Tham Lang / Phúc Đức Dần | Bình (ping) | Đắc | Đắc |
| Thiên Cơ / Điền Trạch Mão | Vượng (wang) | Miếu | Miếu |
| Cự Môn / Điền Trạch Mão | Miếu (miao) | Miếu | Miếu |
| Tử Vi / Quan Lộc Thìn | Đắc (de) | Vượng | Vượng |
| Thiên Tướng / Quan Lộc Thìn | Đắc (de) | Vượng | Vượng |
| Thiên Lương / Nô Bộc Tỵ | Hạn (xian) | Hãm | Hãm |
| Thất Sát / Thiên Di Ngọ | Vượng (wang) | Miếu | Miếu |
| Liêm Trinh / Tài Bạch Thân | Miếu (miao) | Vượng | Vượng |
| Phá Quân / Phu Thê Tuất | Vượng (wang) | Đắc | Đắc |
| Thiên Đồng / Huynh Đệ Hợi | Miếu (miao) | Đắc | Đắc |
| Vũ Khúc / Mệnh Tý | Vượng (wang) | Vượng | Vượng |
| Thiên Phủ / Mệnh Tý | Miếu (miao) | Miếu | Miếu (PDF36 §3.7; chưa có bảng registry riêng) |
| Thái Dương / Phụ Mẫu Sửu | Bất (bu) | Đắc | Đắc |
| Thái Âm / Phụ Mẫu Sửu | Miếu (miao) | Đắc | Đắc |

`xian` trong iztro vi-VN được dịch thành **Hạn**; sách/ảnh ghi **Hãm**. Đây là vấn đề dịch/nhãn xác minh được ở `node_modules/iztro/lib/i18n/locales/vi-VN/brightness.js:10`, không phải một cấp trạng thái mới. `bu` dịch “Bất” là cấp riêng của bảng upstream, không tự đổi thành Đắc/Hãm. Ảnh có chú giải5cấp; upstream có7key miao/wang/de/li/ping/bu/xian.

Các nhãn 14 sao trong ảnh phù hợp các dòng vị trí đọc ở Tân Biên PDF/trang in33–38 cho chính trường hợp này. Điều đó không chứng minh website sử dụng sách này hoặc bảng sách đúng tuyệt đối.

## 6. Mệnh chủ: tái hiện hai công thức

iztro 2.6.1 `astro/astro.js:212`: default tra `earthlyBranchOfSoulPalace`; chỉ algorithm=zhongzhou mới tra `earthlyBranchOfYear`. `data/earthlyBranches.js`: ziEarthly.soul=tanlangMaj, shenEarthly.soul=lianzhenMaj; shenEarthly.body=tianliangMaj.

Tra từng công thức mà **không bật cấu hình toàn cục**: chi Mệnh Tý → Tham Lang; chi năm Thân → Liêm Trinh; Thân chủ theo chi năm Thân → Thiên Lương. Đây là nguyên nhân tái hiện được của cặp kết quả. Chưa có mã/config website tham chiếu nên chỉ nói “phù hợp công thức theo chi năm”, không gán website đó là trường phái Trung Châu. Không tìm được đoạn Mệnh chủ/Thân chủ trong lớp chữ PDF đã tìm kiếm; nguồn chuyên môn cho việc chọn một trong hai còn chưa xác minh.

## 7. Phụ tinh, Tứ Hóa và vòng sao

Bốn Hóa bản mệnh lưu trên chính sao: Thiên Lương Lộc ở Tỵ, Tử Vi Quyền ở Thìn, Tả Phù Khoa ở Tuất, Vũ Khúc Kỵ ở Tý. Tả Phù là label của `zuofu` (左輔), sách/ảnh Tả Phụ; không đổi định danh. Bảng can Nhâm tại PDF/trang in14 §8.23 khớp bốn sao này. Không có Hóa đại hạn/lưu niên riêng được xuất.

`Chart` ô chính chỉ render majorStars tên/brightness. Bấm cung mới hiện tên minorStars/adjectiveStars và tuổi hạn; vẫn không render mutagen hoặc boshi12/suiqian12/jiangqian12/changsheng12. Câu “xem đủ sao” hiện rộng hơn dữ liệu thực sự trình bày. Type Palace còn không khai báo nhiều trường vòng sao tuy JSON có; đây là thiếu hợp đồng/hiển thị, không bị mất khi JSON stringify.

### Những sai khác thực sự, không chỉ ẩn UI

| Mục | Snapshot / công thức | Ảnh và nguồn đối chiếu | Kết luận / phần thiếu |
|---|---|---|---|
| Linh Tinh | Ngọ; getHuoLingIndex luôn Tuất+timeIndex8 → Ngọ | Ảnh Dần; Tân Biên10–11 §8.6.3: Dương nam Linh nghịch, Tuất−8 → Dần | Khác quy ước an Linh; không do phút/lịch. Không đổi engine trong audit |
| Hỏa Tinh | Tuất, Dần+8 | Ảnh Tuất; sách Dương nam thuận | Vị trí trùng; brightness khác bảng |
| Thiên Quý | Mùi; quIndex10 + dayIndex8 −1 =17 mod12=5 | Ảnh Tỵ; sách12 §8.13 đếm nghịch từ Văn Khúc rồi “lùi lại một cung” | Upstream đếm thuận; sách/ảnh phù hợp cách tiếp tục lùi theo chiều nghịch → Tỵ. Nghĩa thao tác “lùi” cần chủ phương pháp chốt trước code |
| Phi Liêm | boshi12 ở Tỵ và adjective feilian ở Thìn | Ảnh chỉ Phi Liêm Tỵ | Hai key faylian/feilian (hai hệ) cùng dịch Phi Liêm; không gộp theo tên. Chưa xác minh phạm vi sao thứ hai trong nguồn VN |
| Thiên Y, Quốc Ấn, Đường Phù, Thiên La, Địa Võng, Thiên Giải, Địa Giải, Lưu Hà, Đẩu Quân, Văn Tinh | Không có các trường/tên này trong snapshot | Ảnh có; sách12–16 có một số cách an | Không phải UI giấu chúng: pipeline xuất danh mục upstream hiện tại không cung cấp chúng tại các vị trí ảnh. Chưa triển khai/đối chiếu từng công thức; không bổ sung tự động |
| Thiên Vu/Đài Phụ/Phụng Các, Hàm Trì | Snapshot có tại Dần/Dậu | Ảnh Văn Tinh/Thai Phụ/Phượng Các, Đào Hoa | Một số là cách gọi; Đài Phụ key taifu, Phụng Các fengge. Không mặc định Thiên Vu=Văn Tinh hoặc Hàm Trì=mọi Đào Hoa của mọi hệ |
| Vòng suiqian12 | Tuế Kiện Thân, Hối Khí Dậu, Quán Tác Hợi, Tiểu Hao Sửu, Đại Hao Dần, Thiên Đức Tỵ, Bệnh Phù Mùi | Ảnh Thái Tuế/Thiếu Dương/Thiếu Âm/Tử Phù/Tuế Phá/Phúc Đức/Trực Phù ở các vị trí tương ứng | Danh mục vòng upstream khác danh mục ảnh; không chỉ chính tả. Chưa đọc được công thức website kia; không đổi từng nhãn thành tương đương |
| Trường Sinh / Bác Sỹ | Cùng vị trí các vòng đọc được; Mục Dục, Lực Sỹ là label lưu | Ảnh Mộc Dục, Lực Sĩ | Khác chính tả/phiên âm ở các ví dụ, không sai an cung. Cần bảng hiển thị riêng, không sửa snapshot |
| Địa Không/Địa Kiếp và nhiều phụ tinh | brightness rỗng trên hai sao này | Ảnh có Hãm | Chưa có trạng thái trong snapshot, không phải 0/Bình; không nhập từ ảnh |

### Tuần/Triệt

Default iztro đặt jielu tại Dần và kongwang tại Mão; xunkong theo năm Nhâm Thân chọn Tuất. Sách17 bảng ghi Tuần Tuất–Hợi (Giáp Tý→Quý Dậu), Triệt Đinh/Nhâm Dần–Mão, phù hợp marker ảnh. Snapshot chỉ lưu nhãn tại cung, không lưu quan hệ án ngữ2cung; không tự nhân đôi nhãn. Trang17 còn có ví dụ Canh Ngọ ghi Thân–Dậu trái với chính bảng Ất/Canh Mùi–Ngọ; không dùng ví dụ đó làm chuẩn.

### Toàn bộ dữ liệu 12 cung (từ snapshot, không thêm sao ảnh)

| Cung / can chi | Phụ tinh (nhãn trạng thái gốc nếu có) | Tạp diệu | Trường Sinh / Bác Sỹ / Tuế trước / Tướng trước | Đại vận; tuổi tiểu hạn |
|---|---|---|---|---|
| Phúc Đức / Nhâm Dần | Văn Xương (Hạn), Thiên Mã | Giải Thần, Phụng Các, Đài Phụ, Thiên Vu, Triệt Lộ, Âm Sát, Thiên Hư, Niên Giải | Lâm Quan / Tiểu Hao / Đại Hao / Tuế Dịch | [23, 32]; [5, 17, 29, 41, 53, 65, 77, 89, 101, 113] |
| Điền Trạch / Quý Mão | Thiên Khôi, Địa Không | Không Vong, Thiên Hình | Đế Vượng / Tướng Quân / Long Đức / Tức Thần | [33, 42]; [6, 18, 30, 42, 54, 66, 78, 90, 102, 114] |
| Quan Lộc / Giáp Thìn | Hữu Bật | Hoa Cái, Phi Liêm | Suy / Tấu Thư / Bạch Hổ / Hoa Cái | [43, 52]; [7, 19, 31, 43, 55, 67, 79, 91, 103, 115] |
| Nô Bộc / Ất Tỵ | Thiên Việt | Thiên Đức, Thiên Thương | Bệnh / Phi Liêm / Thiên Đức / Kiếp Sát | [53, 62]; [8, 20, 32, 44, 56, 68, 80, 92, 104, 116] |
| Thiên Di / Bính Ngọ | Linh Tinh (Miếu) | Tam Thai, Thiên Phúc | Tử / Hỷ Thần / Điếu Khách / Tai Sát | [63, 72]; [9, 21, 33, 45, 57, 69, 81, 93, 105, 117] |
| Tật Ách / Đinh Mùi | Địa Kiếp | Hồng Loan, Thiên Diêu, Thiên Quý, Quả Tú, Thiên Sứ | Mộ / Bệnh Phù / Bệnh Phù / Thiên Sát | [73, 82]; [10, 22, 34, 46, 58, 70, 82, 94, 106, 118] |
| Tài Bạch / Mậu Thân | Danh sách rỗng | Bát Tọa, Thiên Tài | Tuyệt / Đại Hao / Tuế Kiện / Chỉ Bối | [83, 92]; [11, 23, 35, 47, 59, 71, 83, 95, 107, 119] |
| Tử Nữ / Kỷ Dậu | Danh sách rỗng | Hàm Trì, Ân Quang, Thiên Trù, Thiên Không, Phá Toái | Thai / Phục Binh / Hối Khí / Hàm Trì | [93, 102]; [12, 24, 36, 48, 60, 72, 84, 96, 108, 120] |
| Phu Thê / Canh Tuất | Tả Phù Hóa Khoa, Hỏa Tinh (Miếu), Đà La (Miếu) | Phong Cáo, Thiên Quan, Tuần Không, Thiên Khốc | Dưỡng / Quan Phủ / Tang Môn / Nguyệt Sát | [103, 112]; [1, 13, 25, 37, 49, 61, 73, 85, 97, 109] |
| Huynh Đệ / Tân Hợi | Lộc Tồn | Thiên Nguyệt, Cô Thần | Trường Sinh / Bác Sỹ / Quán Tác / Vong Thần | [113, 122]; [2, 14, 26, 38, 50, 62, 74, 86, 98, 110] |
| Mệnh / Nhâm Tý | Văn Khúc (Đắc), Kình Dương (Hạn) | Long Trì, Thiên Thọ | Mục Dục / Lực Sỹ / Quan Phù / Tướng Tinh | [3, 12]; [3, 15, 27, 39, 51, 63, 75, 87, 99, 111] |
| Phụ Mẫu / Quý Sửu | Danh sách rỗng | Thiên Hỷ, Nguyệt Đức | Quan Đới / Thanh Long / Tiểu Hao / Phan Án | [13, 22]; [4, 16, 28, 40, 52, 64, 76, 88, 100, 112] |

`suiqian12/jiangqian12` có tên hàm upstream nói về sao theo năm, nhưng lời gọi trong bySolar dùng **ngày sinh**, không dùng 2026. Vì vậy không gắn nhãn chúng là lưu niên2026. Tên sao “Lưu Hà” trong ảnh cũng không tự chứng minh đây là sao lưu. Không có metadata lớp sao trong ảnh để phân biệt mọi ký hiệu năm/tháng; T.1…T.12 chưa đối chiếu.

## 8. Nguồn đã đọc và giới hạn

Đã đọc README, ENGINE-AUDIT, CALENDAR-CONVENTIONS, các module liên quan; đúng mã dependency cài và lockfile. Tái đọc PDF gốc do chủ dự án cung cấp: Tử Vi Đẩu Số Tân Biên, Vân Đằng Thái Thứ Lang. Đọc lớp chữ các phần liên quan; xem ảnh trực tiếp PDF/trang in10,12,14,17,33–38. Trang11 bảng khởi Hỏa/Linh đọc lớp chữ; trang13 công thức sao khác đọc lớp chữ, chưa kết luận xử lý mọi nhánh. Số trang PDF và trang in trùng tại các trang đã xem. Không sao chép dài nguồn vào báo cáo. Quyền nội dung/chuyên gia phê duyệt chưa được xác nhận.

Ảnh tham chiếu được đọc thủ công. Vị trí 14 chính tinh, nhãn và tên phụ tinh đọc được ghi riêng trong JSON; không coi ảnh chứa cấu hình, phút sinh hoặc source code. Không có nguồn độc lập xác nhận toàn bộ lá số.

## 9. Phân loại và đề xuất — chưa thực hiện

**Lỗi/thiếu hiển thị xác minh:** dịch xian thành Hạn; UI không hiện bốn Hóa và vòng sao dù dữ liệu có; “xem đủ sao” chưa đúng; các nhãn nguồn trạng thái chưa giải thích ngay trên ô. Sửa formatter/legend/field hiển thị có thể không đổi hash snapshot, nhưng cần kiểm tra nội dung báo cáo lưu và ánh xạ nhãn ổn định.

**Khác quy ước xác minh được:** chi tra Mệnh chủ; bảng brightness upstream/Tân Biên; hướng an Linh; hướng tính Thiên Quý; danh mục vòng sao. Chủ dự án cần chốt profile an sao mục tiêu và nguồn, không sửa trường lẻ hoặc đổi global algorithm để hợp một ảnh. Thay công thức phải tạo phiên bản profile/engine mới, không migrate âm thầm snapshot/report cũ.

**Chưa đủ bằng chứng:** cấu hình website tham chiếu, fullraw request/phiên chụp; chuyên môn chọn Mệnh chủ; nghĩa từng tên sao khác và lớp năm xem; những sao upstream chưa xuất. Nên lập đặc tả và fixture nguồn độc lập cho từng thay đổi trước khi triển khai, không dùng replay hiện tại làm expected.

**Không phát hiện:** đổi nhầm ngày ở giữa lá số, vị trí chính tinh lấy từ DEMO khác, mất phụ tinh khi lưu JSON, hoặc fallback lịch Trung Quốc trong lần tái lập. Kết luận giới hạn ở hồ sơ/mã hiện tại, không tuyên bố mọi phiên lịch sử không thể gặp race.

## 10. Bằng chứng và bảo toàn

JSON kiểm toán nội bộ: `.local/chart-comparison-1992-08-07/audit.json` (quyền0600, không public), chứa input đã lưu, nguyên snapshot, dependency/config, so trạng thái và phép tính dẫn xuất. Không có tên thật/email/order/thanh toán/token/khóa. Script kiểm toán chỉ đặt trong `.local`, không nối vào ứng dụng.

Kiểm tra thực tế: SELECT READ ONLY tìm1snapshot; replay payload và resultId trùng; tra2công thức Mệnh chủ không đổi config; kiểm14chính tinh và4Hóa; đọc ảnh sách/ảnh người dùng. Không chạy test toàn suite/build vì không sửa mã runtime. Bản duyệt1.9 và các engine/rule giữ nguyên. Không bật beta/thanh toán/email. Dừng sau báo cáo.

Kiểm tra cuối: SELECT READ ONLY lần hai cho đúng hồ sơ cho kết quả snapshot và birth_data không đổi; baseline 101 file từ đợt trước vẫn cùng SHA-256. Không có thao tác sửa file ứng dụng hoặc thư mục xuất 1.9 trong đợt này.
