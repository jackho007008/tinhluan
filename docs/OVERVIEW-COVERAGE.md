# Độ phủ Tổng quan — catalog interpretation-1.2.0

Đã kiểm tra repository và thư mục cha: không tìm thấy AGENTS.md. Đã đọc README, RULE-SOURCES, UNIFIED-PREVIEW-AUDIT và schema/evaluator/derived/preview hiện có trước khi sửa.

**Trước:** 3/14 chính tinh tại Mệnh có chú giải (Vũ Khúc, Thiên Phủ, Thiên Đồng); chưa có rule mảng rỗng. **Sau:** 9/14 có chú giải và thêm 1 chú giải cấu trúc cho Mệnh không có chính tinh. Năm mục còn thiếu được giữ rõ, không thay bằng câu luận chung. Đây là độ phủ chú giải, không phải khả năng luận toàn lá số.

Nguồn A: [Toàn Thư quyển một — bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), mục 諸星問答論. Mỗi hàng ghi mục con đã đọc, gồm đoạn đầu và các đoạn bàn thân/mệnh, hội hợp, trạng thái tiếp sau; không chỉ lấy tiêu đề hay một câu tách rời. Không có bản in/trang quét đối chiếu, bản dịch chuyên môn hay quyền chuyển ngữ đã xác minh.

Nguồn B: [Tài liệu tác giả iztro — hệ thống sao](https://docs.iztro.com/learn/star), 十四主星 và 十四辅星, đoạn phụ tinh trong 空宫. Chỉ dùng phân biệt nhóm sao, không nhập nhận định phụ tinh mạnh lên hoặc cách mượn đối cung. Đây là nguồn hiện đại, không giả làm cùng ấn bản cổ thư; quyền nội dung website/chuyển ngữ còn pending.

## Bảng 14 chính tinh và mảng rỗng

Điều kiện chung **M(S)**: chỉ một cung tên Mệnh, có mảng chính tinh hợp lệ và tên chuẩn S hiện diện. Evaluator dùng mảng dữ liệu, không tìm chuỗi trong lời văn. Điều kiện này cho phép hiển thị chú giải yếu tố, **không chứng minh các điều kiện luận tổng hợp đã thỏa**. Ngoại lệ rỗng là chưa đặc tả, không có nghĩa không tồn tại ngoại lệ.

| Mục | Trước → sau / Rule | Nguồn và vị trí | Phạm vi được dùng | Điều kiện thực thi | Chưa xác định | Kiểm chứng / quyền |
|---|---|---|---|---|---|---|
| Tử Vi | Thiếu → thêm `reading.overview.ziwei` | A → 問紫微所主若何？ | Tử Vi dùng hình tượng đế tọa, vị trí trung tâm trong hệ sao | M(Tử Vi) | Vai trò phụ tá, hội chiếu và khác hệ trạng thái chưa được đặc tả để tổng hợp. | draft; đã đọc ngữ cảnh, chưa chuyên gia/bản in; quyền pending |
| Thiên Cơ | Thiếu → thêm `reading.overview.tianji` | A → 問天機所主如何？ | Thiên Cơ được liên hệ với sự ứng biến và cách hành sự có tính toán | M(Thiên Cơ) | Chưa đặc tả các hội hợp với Thiên Lương, phụ tá và điều kiện loại trừ. | draft; đã đọc ngữ cảnh, chưa chuyên gia/bản in; quyền pending |
| Thái Dương | Thiếu → thêm `reading.overview.taiyang` | A → 問太陽所主若何？ | Thái Dương lấy hình tượng mặt trời | M(Thái Dương) | Chưa có đặc tả đầy đủ trạng thái, sao hỗ trợ và điều kiện riêng theo vị trí; không chuyển nghĩa tại Quan Lộc sang Mệnh. | draft; đã đọc ngữ cảnh, chưa chuyên gia/bản in; quyền pending |
| Vũ Khúc | Có → giữ `reading.wuqu` | A → 問武曲星所主為何？ | Biểu tượng tài và quả quyết | M(Vũ Khúc) | Phối hợp tứ hóa và hội chiếu | draft; bản chép chưa đối chiếu; quyền pending |
| Thiên Đồng | Có → giữ `draft.overview.tong` | A → 問天同星所主若何？ | Mô tả ôn hòa ở thân/mệnh trong nguồn | M(Thiên Đồng) | Hội hợp, trạng thái và ngoại lệ chưa hoàn chỉnh | draft; bản chép chưa đối chiếu; quyền pending |
| Liêm Trinh | Thiếu → còn thiếu | A → 問廉貞所主若何？ | Chưa phát hành chú giải | Chưa có rule | Chưa xác lập nghĩa tại Mệnh từ thuật ngữ quyền lệnh/thứ đào hoa mà không áp nghĩa Quan Lộc hoặc kết luận đạo đức. | Đã đọc bản chép; chưa chọn đủ phạm vi/ngoại lệ; quyền chưa xác minh |
| Thiên Phủ | Có → giữ `reading.tianfu` | A → 問天府所主若何？ | Biểu tượng kho | M(Thiên Phủ) | Không Vong, sao hỗ trợ và phối hợp | draft; bản chép chưa đối chiếu; quyền pending |
| Thái Âm | Thiếu → thêm `reading.overview.taiyin` | A → 問太陰星所主若何？ | Thái Âm dùng hình tượng mặt trăng, được đặt trong quan hệ với Thái Dương | M(Thái Âm) | Chưa xác minh cách áp dụng thượng/hạ huyền, trạng thái và phối hợp với các sao khác; không lấy vai trò tại Điền Trạch làm kết luận cho Mệnh. | draft; đã đọc ngữ cảnh, chưa chuyên gia/bản in; quyền pending |
| Tham Lang | Thiếu → còn thiếu | A → 問貪狼所主若何？ | Chưa phát hành chú giải | Chưa có rule | Chưa xác lập phạm vi thuật ngữ đào hoa tại Mệnh tách khỏi phán xét giới/đạo đức của bản chép. | Đã đọc bản chép; chưa chọn đủ phạm vi/ngoại lệ; quyền chưa xác minh |
| Cự Môn | Thiếu → còn thiếu | A → 問巨門所主若何？ | Chưa phát hành chú giải | Chưa có rule | Chưa có cách giải thích nhãn ám và điều kiện khẩu thiệt mà không biến thành dự đoán tranh chấp hoặc phán xét con người. | Đã đọc bản chép; chưa chọn đủ phạm vi/ngoại lệ; quyền chưa xác minh |
| Thiên Tướng | Thiếu → thêm `reading.overview.tianxiang` | A → 問天相星所主若何？ | Thiên Tướng gắn với hình tượng ấn và vai trò phụ tá | M(Thiên Tướng) | Chưa có đặc tả điều kiện phụ tá, hội hợp, trạng thái và ngoại lệ; không tự ghép nghĩa với Tử Vi. | draft; đã đọc ngữ cảnh, chưa chuyên gia/bản in; quyền pending |
| Thiên Lương | Thiếu → thêm `reading.overview.tianliang` | A → 問天梁星所主若何？ | Thiên Lương mang biểu tượng che chở, thường gọi là hóa ấm | M(Thiên Lương) | Chưa có đặc tả hội chiếu, trạng thái và ngoại lệ; loại các phán đoán tuổi thọ, bệnh tật trong nguồn khỏi phạm vi diễn giải. | draft; đã đọc ngữ cảnh, chưa chuyên gia/bản in; quyền pending |
| Thất Sát | Thiếu → còn thiếu | A → 問七殺星所主若何？ | Chưa phát hành chú giải | Chưa có rule | Chưa đặc tả phạm vi tại Mệnh tách khỏi các luận thọ yểu/tai họa; không đưa hình tượng võ tướng thành đánh giá tính cách. | Đã đọc bản chép; chưa chọn đủ phạm vi/ngoại lệ; quyền chưa xác minh |
| Phá Quân | Thiếu → còn thiếu | A → 問破軍所主若何？ | Chưa phát hành chú giải | Chưa có rule | Chưa đặc tả phạm vi nhãn hao ở Mệnh; không tự chuyển thành nghĩa cải cách/đổi mới hoặc dự báo mất tài sản. | Đã đọc bản chép; chưa chọn đủ phạm vi/ngoại lệ; quyền chưa xác minh |
| Mệnh không có chính tinh | Thiếu → thêm `reading.overview.empty` | B → 十四主星 / 十四辅星 | Cung trống chính tinh không đồng nghĩa không còn sao | Mệnh duy nhất; majorStars là mảng hợp lệ độ dài 0 | Mượn sao, phụ tinh, hội chiếu chưa hỗ trợ; không xếp tốt/xấu | draft; nguồn hiện đại đã đọc; quyền pending |

## Thay đổi triển khai

Thêm bảy rule trong **catalog hiện có**, không có evaluator/catalog song song: sáu `reading.overview.*` cho Tử Vi, Thiên Cơ, Thái Dương, Thái Âm, Thiên Tướng, Thiên Lương và `reading.overview.empty`. Rule mới version 1.0.0, draft, review null, rights pending. Ba rule Tổng quan cũ và các rule Sự nghiệp giữ nguyên. Tổng catalog 23 rules: 9 fact, 14 interpretation; **0 approved**.

Derivation 1.2.0 bổ sung `fact.life-major-presence`/`fact.career-major-presence` từ mảng hợp lệ; empty/present là giá trị dữ kiện, không điểm số. Thiếu/null/sai kiểu/mảng có phần tử không hợp lệ không tạo dữ kiện này. Bằng chứng gồm đường dẫn cung và mảng sao; rule có sao còn có đường dẫn từng phần tử cụ thể. Không thêm toán tử DSL mới.

Trong bảng dữ kiện, mảng rỗng ghi “Danh sách chính tinh đã lưu là rỗng”; thiếu trường ghi “Thiếu dữ liệu danh sách chính tinh; chưa thể xác định”. Bố cục chính không đổi. Snapshot và báo cáo đã giao không được ghi lại. Preview chạy catalog mới; khách không nhận draft.

## Ví dụ từ engine thật

Chạy `node --import tsx scripts/overview-examples.ts` để tạo lại `docs/evidence/overview-engine-examples.json`. Dùng ngày demo công khai 2000-08-16, nữ, giờ dân sự UTC+7, profile vn-utc7-midnight-v1; 12 giờ mẫu từ 00:00 đến 22:00. Không sửa vị trí sao. Đây là **ví dụ tích hợp engine → rules**, không phải expected độc lập chứng minh engine đúng.

| Giờ mẫu | Engine trả về tại Mệnh | Preview Tổng quan |
|---|---|---|
| 00:00 | Thân: Thiên Cơ, Thái Âm | Hai chú giải riêng, không có kết luận tổ hợp |
| 02:00 | Mùi: danh sách chính tinh rỗng | Giải thích cấu trúc mảng rỗng, không mượn đối cung |
| 04:00 | Ngọ: Tử Vi | Chú giải Tử Vi tại Mệnh; không dùng rule Sự nghiệp |
| 06:00 | Tỵ: Thiên Tướng | Chú giải riêng tại Mệnh |
| 08:00 | Thìn: Cự Môn | Chưa có chú giải đủ phạm vi; dữ kiện vẫn hiển thị |
| 12:00 | Dần: Tử Vi, Thiên Phủ | Hai chú giải, không ghép thành kết luận mới |
| 16:00 | Tý: Thái Dương | Chú giải hình tượng, không luận đắc/hãm hoặc địa vị |
| 22:00 | Dậu: Tử Vi, Tham Lang | Chỉ Tử Vi; Tham Lang còn thiếu, không coi đã phủ cả tổ hợp |

## Giới hạn và phần cần duyệt

Tử Vi, Thái Dương, Thái Âm, Thiên Tướng, Thiên Lương mới dùng lớp biểu tượng chung khi sao có mặt tại Mệnh; không gọi đó là kết luận riêng của sao ở Mệnh. Thiên Cơ dùng nét mô tả có trong ngữ cảnh thân/mệnh nhưng chưa dùng hội hợp để luận cá nhân. Không chuyển lời luận ở Tài Bạch/Điền Trạch/Quan Lộc sang Mệnh.

Năm mục chưa thêm không phải vì nguồn hoàn toàn không có nội dung. Đã đọc các mục tương ứng, nhưng chưa đủ đặc tả và cơ sở chuyển ngữ để đưa ra đoạn đọc phổ thông không suy rộng/phán xét. Không tự thay nhãn cổ thành đặc tính tâm lý hiện đại. Cần bản in, kiểm tra dịch/thuật ngữ, nguồn phương pháp bổ sung có xuất xứ, đặc tả ngoại lệ và người duyệt.

Các nguồn có đoạn sức khỏe, thọ yểu và định kiến giới/đạo đức; không nhập những kết luận đó. Không đồng nhất nhàn cung/Đắc; không thêm scoring, AI, chủ đề hoặc thu tiền thật. Đủ chú giải đơn tinh không đồng nghĩa đủ luận giải toàn lá số.

## Nghiệm thu 2026-10-07

- Bộ hồi quy đầy đủ: **146/146 đạt**, 6 files, 5.28s. Có ma trận sáu sao mới đúng Mệnh/sai cung, cấm draft cho khách, mảng rỗng/thiếu/null/sai kiểu/phần tử sai/cung trùng, nhiều sao không sinh claim tổ hợp.
- Sau thêm thông báo chỉ phủ một phần lá số: **7/7 test reading đạt**, gồm test mới Tử Vi + Tham Lang chỉ có chú giải Tử Vi và nêu Tham Lang chưa được phủ.
- E2E đầy đủ: **6/6 đạt**, 46.1s; mobile 360/390px, mua demo/worker/email, bảo vệ nội bộ, đổi A→B→A, Tử Vi Mệnh Ngọ có chú giải mới, mở căn cứ. Chạy lại riêng E2E nội bộ sau bổ sung thông báo độ phủ: đạt.
- Typecheck: đạt. Production build: log `docs/evidence/overview-build.txt`.
- Báo cáo gốc kiểm bằng hash trước/sau: không đổi. 12 tệp engine/lịch/provenance/database/payment/worker đối chiếu bản bàn giao trước: không đổi. Không có migration.
- Các test là kiểm thử phần mềm. Ví dụ engine-generated không được dùng làm expected độc lập hoặc xác nhận chuyên gia.

Preview 2.1.0 hiển thị rõ sao chưa có chú giải trong lá số nhiều sao, ngoài bảng kiểm kê này. Không đánh đồng một chú giải với độ phủ đầy đủ của cung hoặc toàn lá số.
