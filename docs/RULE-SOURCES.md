# Danh mục nguồn và quy tắc — 07/10/2026

> Trạng thái mới nhất: catalog interpretation-1.12.0 / template 1.8.0. Bảng Tân Biên hiện hành ở cuối tài liệu; [OVERVIEW-COVERAGE](OVERVIEW-COVERAGE.md) lưu phạm vi khảo sát trước. Các mục dưới lưu cả lịch sử khảo sát.

Template 1.7.0 chỉ biên tập cách đọc; không bổ sung hoặc hiệu khảo nguồn trong đợt này, không đổi rule hay trạng thái duyệt. Chi tiết tại [TANBIEN-RULE-READING](TANBIEN-RULE-READING.md).

## Bổ sung 09/10/2026 — Thái Dương Hợi/Tý

R21@0.1.0: trực tiếp đọc PDF35,68–73; xem ảnh35,69. Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên,69 §4.2.5 Đại cương: nhánh Nhật hãm Hợi/Tý, chỉ dùng vế ham chuộng văn chương/triết học/đạo lý, không dùng đánh giá đạo đức ở cùng dòng. Bảngtaiyang1.0.0 tr.35 giữ nguyên. R14 không đổi. Draft/review=null, quyền pending. Hồ sơ điều kiện và các nhánh không phát hành: [TANBIEN-RULE-READING](TANBIEN-RULE-READING.md). Không có nhận định ngày/đêm, án ngữ, hội hợp hoặc can sinh mới.

## Nguồn đã khảo sát

1. **Mã iztro2.6.1**, SylarLong/contributors: [repository](https://github.com/SylarLong/iztro/tree/v2.6.1), `lib/astro/astro.js`, `lib/astro/palace.js`, star DTO. MIT lưu sẵn trong docs/licenses. Đây là nguồn sơ cấp của **phần mềm**, không xác nhận học thuật. Dùng cho6 ánh xạ kỹ thuật, không diễn giải cuộc đời.
2. **紫微斗數全書 quyển một**, bản chép [Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), mục 諸星問答論 → 問天同星所主若何？, đoạn sau nhãn 希夷先生曰 nói Thiên Đồng ở thân/mệnh và tính ôn hòa. Đã đọc đoạn và ngữ cảnh; không xác định được bản in/trang quét để kiểm chứng bản chép. Không nhận tác giả gán truyền thống là bằng chứng tác quyền đã được khảo chứng. Quyền dùng bản chuyển ngữ/biên tập còn pending. Chỉ viết tóm tắt ngắn làm bản thảo, không sao chép các phán đoán sức khỏe, định kiến giới hay ngôn ngữ miệt thị trong ngữ cảnh cổ.
3. **Tác giả iztro, hệ thống cung**, [官禄宫](https://docs.iztro.com/learn/palace#官禄宫), đoạn đầu liên hệ với thái độ làm việc. Đây là phát biểu phương pháp của tác giả hiện đại có xuất xứ, không phải SEO và không phải chứng nhận chuyên gia Việt Nam. Website có quyền nội dung riêng cần xác minh; không tự áp MIT mã nguồn cho toàn bài. Chỉ dùng bản thảo phạm vi chủ đề.

Không dùng nội dung AI làm nguồn. Các trang trên là nguồn cho nội dung/đặc tả, không là bằng chứng dự đoán cuộc đời có độ chính xác đã biết. Catalog ghi accessedOn, URL, locator, rights và limitations. Không đưa một bản dịch do hệ thống soạn thành lời chuyên gia đã duyệt.

## Catalog

| ID | Nội dung | Loại | Trạng thái | Cần duyệt |
|---|---|---|---|---|
| fact.life-location | Chép tên/chi của Mệnh | Dữ kiện kỹ thuật | draft | Không có nhận định mệnh; cần review đặc tả nếu nâng thành rule chính thức |
| fact.body-location | Chép cung mang cờ Thân | Dữ kiện kỹ thuật | draft | Như trên |
| fact.life-stars | Danh sách chính tinh Mệnh | Dữ kiện kỹ thuật | draft | Như trên |
| fact.life-state | Nhãn brightness/mutagen Mệnh | Dữ kiện kỹ thuật | draft | Chưa xác minh bảng trạng thái độc lập |
| fact.career-location | Chép tên/chi Quan Lộc | Dữ kiện kỹ thuật | draft | Ánh xạ UI không xác định nghề |
| fact.career-stars | Danh sách chính tinh Quan Lộc | Dữ kiện kỹ thuật | draft | Chưa luận phối hợp sao |
| draft.overview.tong | Liên hệ truyền thống Thiên Đồng/Mệnh với ôn hòa | Bản thảo diễn giải, nguồn2 | draft, rights pending | Bản in, dịch thuật, trường phái, điều kiện/ngoại lệ, giới hạn áp dụng |
| draft.career.palace | Phạm vi đọc Quan Lộc theo tác giả iztro | Bản thảo phương pháp, nguồn3 | draft, rights pending | Quyền dùng, phương pháp chủ đề, không suy nghề/thu nhập |

Cả8 record: version1.0.0, review=null,0 approved.12 câu dữ kiện theo cung của module cũ là12 instance output, không được đếm thành12 rule mới.6 ánh xạ DerivedFacts được thực hiện riêng bằng code kiểm thử và hiển thị là engine-reported; **không công bố rằng rule draft đã được duyệt**. Hai diễn giải chỉ nằm trong catalog nguồn, không có trong văn báo cáo hoặc payload draft gửi khách. Career draft là định hướng phương pháp, chưa là quy tắc đoán nghề cụ thể.

## Quyền và bất đồng

Phải kiểm tra bản in/ấn bản/trang và quyền sử dụng trước khi đổi pending. Không có trọng số tín nhiệm, không chọn nguồn theo số đông. Nếu khác với quy ước profile hiện tại, ghi giới hạn/phạm vi hoặc giữ rule không phát hành; không sửa engine để khớp. Ngoại lệ của hai draft hiện chưa hoàn chỉnh, exceptions=[] không có nghĩa nguồn không có ngoại lệ. Đây là blocker phê duyệt.

Fixture đối chiếu independent đang trống có chủ đích. Mẫu upstream chỉ chứa tập con của ví dụ quick-start đã đọc, không lấy output hiện tại làm expected và không gán reviewer.

## Bản đọc thử có nguồn — 2026-10-07

Năm chú giải biên tập trong `lib/internal-review/preview.ts` chỉ phục vụ `/internal`, trạng thái draft, người duyệt null. Không bổ sung rules approved hoặc tự cấp quyền phát hành. Bảng đối chiếu đầy đủ nằm ngay trong trang preview.

Nguồn đã đọc:

- [紫微斗數全書 / 卷一](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), `諸星問答論`: các mục `問武曲星所主為何？`, `問天府所主若何？`, `問紫微所主若何？`, `問天相星所主若何？`. Chỉ diễn giải ngắn lớp biểu tượng của mỗi sao. Bản chép Wikisource là đầu mối văn bản có xuất xứ, chưa thay thế bản in đã khảo chứng. Không có xác nhận chuyên gia hoặc quyền bản dịch tiếng Việt được suy ra tự động.
- [紫微斗數全書 / 卷二](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷二), `定十二宮星辰落閒`: ghi lại sai khác hệ nhãn nhàn cung với nhãn Đắc đang lưu. Không coi đây là bằng chứng engine sai khi chưa thống nhất quy ước.
- [Tài liệu tác giả iztro: cung](https://docs.iztro.com/learn/palace), `身宫 → 身宫在官禄宫`: chú giải hiện đại, tách khỏi văn bản cổ. Giấy phép phần mềm không mặc nhiên cấp quyền sử dụng mọi nội dung diễn giải trên website.

Còn thiếu: văn bản/ấn bản xác minh; chuyên gia xác định cách áp dụng tổ hợp Vũ Phủ tại Tý và Tử Tướng tại Thìn; đặc tả đầy đủ phụ tá/hội chiếu, Hóa Kỵ/Hóa Quyền; cách xử lý khác hệ trạng thái; quyền sử dụng; biên bản duyệt. Không có suy đoán nghề nghiệp, thu nhập, tuổi thọ hoặc nhận định tổ hợp từ việc cộng nghĩa riêng từng sao.

## Thống nhất catalog — cập nhật 2026-10-07

Năm chú giải trên hiện là `reading.*` trong catalog chung (version 1.1.0), thay thế nhánh biên tập riêng của preview 1.0.0. Nguồn, vị trí và phạm vi ý nghĩa nằm trực tiếp trong rule. Ba context bổ sung chỉ chép nhãn hoặc nêu khác hệ, không đưa ra nhận định vận mệnh. Đã đọc lại các mục nguồn nêu trên; chưa xác minh bản in, quyền chuyển ngữ hoặc phê duyệt chuyên môn. Tổng cộng 7 interpretation draft, 9 fact draft, 0 approved. Không có rule tổ hợp mới. Xem `UNIFIED-PREVIEW-AUDIT.md`.

## Độ phủ Tổng quan 1.2.0

Xem [bảng 14 chính tinh và mảng rỗng](OVERVIEW-COVERAGE.md): 3 → 9 chính tinh tại Mệnh có chú giải; thêm một chú giải cấu trúc mảng rỗng. Các mục nguồn đã đọc, quyền, ngữ cảnh chưa đủ và phạm vi được phép đều ghi theo từng hàng. Bảy rule mới draft, không có người duyệt; không diễn giải năm mục còn thiếu. Catalog tổng 23, gồm 9 fact và 14 interpretation, 0 approved. Ví dụ engine thật có script tái lập và được phân biệt rõ với fixture kỹ thuật/đối chiếu độc lập.

## Nhóm phối hợp 1.3.0

Xem [đặc tả viết trước triển khai và ví dụ trước/sau](COMBINATION-SPEC.md). Nguồn diễn giải duy nhất là Toàn Thư quyển một: 重補斗數彀率 và 問紫微所主若何？. Hai rule Tử Vi–Tả Phụ–Hữu Bật đồng cung dùng tên engine “Tả Phù”. Tài liệu iztro về phụ tinh chỉ giúp kiểm tên/phân nhóm, không cung cấp nhận định trộn vào cổ thư. Cổng bốn sao đồng cung là chính sách biên tập bảo thủ được công khai, không phê duyệt một định luật cổ. Có Phá Quân trong hai ví dụ khớp vẫn là phần chưa được luận. Bản in, ngoại lệ đầy đủ và quyền chuyển ngữ còn pending.

## Hiện hành 1.4.0 — 2026-10-08

[Rà soát nguồn → điều kiện → rule → phạm vi nhận định](OVERVIEW-REVISION.md) thay thế kết luận áp dụng nhóm 1.3.0 phía trên. Hai rule combination phiên bản 1.1.0: chặn Phá Quân đồng cung, không đánh giá thuận khi chỉ vắng bốn tên sát tinh. Bản chép 玉蟾先生曰 có chỉ danh Kình/Đà/Hỏa/Linh; chưa đối chiếu ấn bản hay đặc tả xung phá.

Thêm `reading.overview.pojun` và `reading.overview.qisha` v1.0.0, loại method-gloss. Cả hai chỉ giải thích thuật ngữ/hình tượng chung, không phải luận Mệnh. Ba mục còn lại tiếp tục pending với vị trí nguồn và lý do cụ thể trong bảng rà soát. Tổng 27 rule; 0 approved, reviewer null, quyền nguồn mới pending.

## Thử nghiệm 1.5.0 — ba rule Tân Biên, chưa duyệt

`tanbien.r02/r05/r06@0.1.0` được thêm vào catalog hiện có; bảng `tanbien-wuqu-state@1.0.0` chỉ biết Tý → Vượng theo hồ sơ HTML chủ dự án cung cấp. Nguồn PDF gốc và quyền nội dung chưa được xác minh trong lượt này. Xem [điều kiện, phiên bản, ma trận và giới hạn](TANBIEN-PREVIEW-TRIAL.md). Bài biên soạn cố định phiên bản 1.1 vẫn tách khỏi kết quả thực thi ba rule. Không tăng số rule approved.


## Đối chiếu PDF Tân Biên và bài từ rule (08/10/2026)

Xem [TANBIEN-RULE-READING.md](TANBIEN-RULE-READING.md) cho trang PDF/trang in, bảng Vũ Khúc 1.1.0, bảy rule 0.2.0, nguồn đã xem ảnh và nguồn chỉ đọc lớp chữ. R01/R03/R04/R07 mới vẫn draft, review=null, quyền nguồn pending. Không thay đổi nội dung đã giao.


### Rà soát ngữ cảnh Vũ Khúc / Thiên Phủ và template 1.1.0

Đọc lại PDF 40, 65–67, 76–78, 158, 190; xem ảnh 77, 78, 190. Không thêm rule: đoạn Vũ–Phủ tại Tý tr.77 có ranh giới điều kiện chưa rõ ngay trong ảnh; các tổ hợp tr.78 còn thiếu đặc tả “hội hợp”/ngoại lệ. Giữ bảy rule 0.2.0 draft/review=null. Bảng quyết định nguồn và kiểm chứng nằm trong [TANBIEN-RULE-READING.md](TANBIEN-RULE-READING.md), không coi formatter/ngữ cảnh là bộ rule mới.






## Tân Biên — bổ sung Liêm / Tham / Cự, 08/10/2026

R10–R12 là **chú giải nền có điều kiện trạng thái**, draft0.1.0, review=null. Nguồn trực tiếp Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*: Liêm thủ Mệnh trang60–62 §4.2.2 (bảng34 §3.2); Tham trang81–83 §4.2.9 (bảng37 §3.9); Cự trang86–90 §4.2.10 (bảng37 §3.10). PDF=trang in. Đối chiếu ảnh34,37,60,81,86; rà lại ảnh91 cho Thiên Tướng. Bảng1.0.0 riêng từng sao, không từ brightness engine. Quyền nguồn pending; có PDF không đồng nghĩa có quyền thương mại.

R10/R11 lấy đoạn miếu/vượng/đắc. R12 chủ động thu hẹp miếu/đắc; không gán phạm vi thu hẹp này cho nguyên văn sách. Không triển khai các đoạn hội hợp, án ngữ hoặc dự đoán/định kiến; nguyên nhân theo từng mục ở [hồ sơ đang dùng](./TANBIEN-RULE-READING.md#đợt-liêm-trinh--tham-lang--cự-môn--08102026). R08/R09 không đổi claim/điều kiện; thêm ngữ cảnh chưa tổng hợp tại vị trí đọc, không tạo tác động Triệt/Hỏa hoặc đồng nhất Thiên Không/Địa Không.



## Tân Biên — Thiên Cơ / Thái Dương / Thiên Đồng / Thái Âm

Trực tiếp đọc PDF Vân Đằng Thái Thứ Lang; trangPDF=trangin. Xem ảnh34–36,62,68,74,78, đọc ngữ cảnh62–64,68–76,78–80. R13/Cơ:74 §4.2.6, bảng35 §3.6; R14/Nhật:68 §4.2.5, bảng35 §3.5; R15/Đồng:62 §4.2.3, bảng34 §3.3; R16/Âm:78 §4.2.8, bảng36 §3.8. Bảng1.0.0 riêng từng sao, đủ12chi, không chép nhãn engine. Cả bốn là chú giải nền dự thảo0.1.0, review=null, quyền pending; không tự đổi các nguồn khác hoặc trạng thái duyệt.

Chỉ dùng đoạn nền miếu/vượng/đắc. Các kết luận Nhật–Nguyệt về thuận lý/toàn mỹ chưa triển khai vì chưa đặc tả ngày/đêm, chưa giải quyết khoảng ngày1–15 (36) và10–20 (78). Đoạn nền được chọn không đòi điều kiện thời gian này; không dùng trạng thái thay giờ, không gọi chúng là mức thuận. Hội hợp, Tuần/Triệt, Kỵ, nghề, sức khỏe/tuổi thọ và các câu phán xét giới không phát hành. Bảng quyết định đầy đủ và điều kiện còn thiếu ở [hồ sơ hiện hành](./TANBIEN-RULE-READING.md).


## Đợt Tân Biên 1.5.0 — 09/10/2026

Đã đối chiếu trực tiếp ba sao cuối: bảng PDF/trang in 38 và Đại cương/Phú giải 92–101; ảnh trang 38, 92, 95, 98, 100, 101. R17 Thiên Lương, R18 Thất Sát, R19 Phá Quân đều là chú giải nền có điều kiện, draft, review=null. Phá Quân có thêm giới hạn dự án đúng một chính tinh tại Mệnh, không gán điều kiện này cho nguyên văn Đại cương. Bảng nguồn/điều kiện/quyết định triển khai, ngoại lệ chưa đặc tả và phần loại bỏ được ghi tại [TANBIEN-RULE-READING](TANBIEN-RULE-READING.md). Các nguồn Toàn Thư/Cổ Học cũ không bị thay hoặc trộn vào bài Tân Biên. Chưa xác minh quyền nguồn, chưa được duyệt chuyên môn.

## Đợt Cơ–Cự — template1.6.0, 09/10/2026

R20@0.1.0 bổ sung đúng nhánh **Thiên Cơ–Cự Môn–Lộc Tồn đồng cung Mệnh tại Mão/Dậu**. Nguồn: Tân Biên PDF/trang in89 §4.2.10 Phú giải, mục Cự–Cơ gặp Lộc Tồn. Đọc lớp chữ73–76,85–91, ảnh88–89. Không có điều kiện trạng thái/can sinh trong đoạn chọn; không dùng bảng engine thay điều kiện. Dự án không mở sang vế Cự–Lộc ở mọi địa chi. Draft, review=null, quyền nguồn pending. [Bảng ứng viên A/B/C và đặc tả](TANBIEN-RULE-READING.md), [bài đối chiếu và từng câu mới](../exports/tanbien-co-cu-review.md). Các đoạn Âm nữ/Ất–Tân/không gặp Tuần–Triệt xung chiếu, Song Hao hội hợp và khác biệt Dần/Mão/Dậu còn chờ, không nới để mẫu khớp.


<!-- MENH-COVERAGE -->
## Phạm vi Tân Biên tại Mệnh — interpretation-1.11.0, template 1.6.0, 09/10/2026

Tất cả 14 sao có dữ kiện an sao trong engine; bảng này chỉ kiểm kê nội dung Tân Biên. Đã nghiên cứu nguồn không đồng nghĩa đã đặc tả mọi điều kiện; có chú giải nền không đồng nghĩa đã luận toàn lá số. Không có nội dung nào được chuyên gia phê duyệt. Mẫu engine là đầu vào giả lập, không phải đối chiếu độc lập.

Lượt Cơ–Cự đọc trực tiếp tr.73–76, 85–91 và ảnh88–89; các trang38–39,92–101 giữ biên bản đợt1.5.0. Mức đọc của 11 sao trước kế thừa hồ sơ các đợt trước, không tuyên bố đọc lại toàn bộ sách trong lượt này. Quyền nguồn vẫn pending. Catalog Toàn Thư/Cổ Học được giữ riêng; không tính chúng như Tân Biên.

| Sao | Nghiên cứu / rule triển khai | Loại nội dung | Vị trí/trạng thái hỗ trợ | Chưa hỗ trợ | Điều kiện/ngoại lệ còn thiếu | Mẫu có sao / mẫu khớp rule nền | Duyệt |
|---|---|---|---|---|---|---|---|
| Tử Vi | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r08@0.3.0. PDF / trang in 55–56, mục 4.2.1 Đại cương và Phú giải; bảng PDF / trang in 33, mục 3.1. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Tỵ (Miếu), Ngọ (Miếu), Dần (Miếu), Thân (Miếu), Hợi (Bình hòa), Tý (Bình hòa), Mão (Bình hòa), Dậu (Bình hòa) | Thìn (Vượng), Tuất (Vượng), Sửu (Đắc), Mùi (Đắc); thiếu bảng/địa chi/danh sách giữ unknown | Không kết luận năng lực lãnh đạo, chức vụ, tài sản, tuổi thọ hoặc sự kiện tương lai. Không suy ý ngược cho vị trí không đạt điều kiện. Nguồn 55–57 còn nêu Tuần/Triệt, Không/Kiếp, phụ tá và sao hội hợp. Chưa có đặc tả đầy đủ; không mặc định chúng vắng mặt, không ghép với Thiên Phủ thành kết luận tổ hợp. | Có sao: vn-4, vn-12, engine-combo, engine-exception, engine-partial, cn-reference; **khớp: vn-4, vn-12, cn-reference** | Chưa; draft, review=null |
| Liêm Trinh | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r10@0.1.0. PDF / trang in 60–62, mục 4.2.2; bảng trang 34, mục 3.2. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Thìn (Miếu), Tuất (Miếu), Tý (Vượng), Ngọ (Vượng), Dần (Vượng), Thân (Vượng), Sửu (Đắc), Mùi (Đắc) | Tỵ (Hãm), Hợi (Hãm), Mão (Hãm), Dậu (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Các đoạn Liêm–Xương/Khúc, Sát tinh/Kỵ/Hình hội hợp chưa được tổng hợp. Không suy nghề nghiệp, kiện tụng, tuổi thọ hoặc kết quả tài chính. | Có sao: vn-lianzhen; **khớp: vn-lianzhen** | Chưa; draft, review=null |
| Thiên Đồng | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r15@0.1.0. PDF / trang in 62, mục 4.2.3 Đại cương, đoạn thứ hai; đọc điều chỉnh 63–64. Bảng PDF / trang in 34, mục 3.3. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Dần (Miếu), Thân (Miếu), Tý (Vượng), Mão (Đắc), Tỵ (Đắc), Hợi (Đắc) | Ngọ (Hãm), Dậu (Hãm), Thìn (Hãm), Tuất (Hãm), Sửu (Hãm), Mùi (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Chưa triển khai đoạn Tỵ/Hợi với tuổi Đinh/Canh, sao hội hợp hoặc các tổ hợp Đồng–Lương/Đồng–Âm. Không suy trí tuệ, giàu sang, sức khỏe hoặc tuổi thọ. Các câu bất nhất tại trang63 chưa được hiệu đính. | Có sao: vn-tiantong; **khớp: vn-tiantong** | Chưa; draft, review=null |
| Vũ Khúc | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r01@0.3.0; R02 đồng cung Văn Khúc. PDF / trang in 65, mục 4.2.4 Đại cương; bảng trạng thái PDF / trang in 34–35, mục 3.4. | Chú giải nền có điều kiện; R02 nhận định theo đồng cung; không phải luận tổ hợp toàn diện | Thìn (Miếu), Tuất (Miếu), Sửu (Miếu), Mùi (Miếu), Dần (Vượng), Thân (Vượng), Tý (Vượng), Ngọ (Vượng), Mão (Đắc), Dậu (Đắc) | Tỵ (Hãm), Hợi (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Nguồn cũng nhắc đến hiếu thắng; chưa tổng hợp tương tác các sao. Không suy bằng cấp, nghề nghiệp, giàu sang hoặc tuổi thọ. Tra bảng tanbien-wuqu-state@1.1.0; không dùng nhãn engine thay nhãn sách. | Có sao: vn-20; **khớp: vn-20** | Chưa; draft, review=null |
| Thái Dương | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r14@0.1.0. PDF / trang in 68, mục 4.2.5 Đại cương, đoạn đầu; đọc điều chỉnh 69–73. Bảng PDF / trang in 35, mục 3.5. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Tỵ (Miếu), Ngọ (Miếu), Dần (Vượng), Mão (Vượng), Thìn (Vượng), Sửu (Đắc), Mùi (Đắc) | Thân (Hãm), Dậu (Hãm), Tuất (Hãm), Hợi (Hãm), Tý (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Chưa đặc tả ranh giới sinh ban ngày/ban đêm; không xuất kết luận thuận lý hay rực rỡ. Trạng thái theo sách không thay điều kiện thời gian. Chưa tổng hợp Tuần/Triệt, Kỵ, hội hợp; không suy uy quyền, thu nhập hoặc sức khỏe. | Có sao: vn-taiyang, vn-tianliang, vn-16; **khớp: vn-taiyang, vn-tianliang** | Chưa; draft, review=null |
| Thiên Cơ | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r13@0.1.0; R20 Cơ–Cự–Lộc Tồn Mệnh Mão/Dậu (không thêm điều kiện trạng thái; PDF89). PDF / trang in 74, mục 4.2.6 Đại cương, đoạn đầu; đọc tiếp điều chỉnh 75–76. Bảng PDF / trang in 35, mục 3.6. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Thìn (Miếu), Tuất (Miếu), Mão (Miếu), Dậu (Miếu), Tỵ (Vượng), Thân (Vượng), Tý (Đắc), Ngọ (Đắc), Sửu (Đắc), Mùi (Đắc) | Dần (Hãm), Hợi (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Chưa tổng hợp Song Hao, các sao hội hợp, Sát đồng cung hoặc Tuần/Triệt. Không suy bệnh tật, tai nạn, tuổi thọ, nghề y hoặc kỹ thuật từ đoạn nền. | Có sao: vn-jumen, vn-co-cu-loc, vn-0; **khớp: vn-jumen, vn-co-cu-loc, vn-0** | Chưa; draft, review=null |
| Thiên Phủ | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r03@0.3.0. PDF / trang in 76, mục 4.2.7 Đại cương, đoạn mở đầu và các đoạn điều chỉnh tiếp ngay sau. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Không dùng điều kiện trạng thái cho đoạn nền R03 | Chưa có các nhánh điều chỉnh theo vị trí/trạng thái; thiếu bảng/địa chi/danh sách giữ unknown | Nguồn nêu Tuần/Triệt án ngữ, Không/Kiếp và sát tinh hội hợp có thể thay đổi cách đọc. Chưa đặc tả đầy đủ quan hệ và ngoại lệ; không coi chúng vắng mặt. Không suy đạo đức, tài sản hoặc kết luận cuối cùng cho Thiên Phủ đồng cung sao khác. | Có sao: vn-lianzhen, vn-12; **khớp: vn-lianzhen, vn-12** | Chưa; draft, review=null |
| Thái Âm | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r16@0.1.0. PDF / trang in 78, mục 4.2.8 Đại cương, đoạn đầu; đọc điều chỉnh 79–80. Bảng PDF / trang in 36, mục 3.8. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Dậu (Miếu), Tuất (Miếu), Hợi (Miếu), Thân (Vượng), Tý (Vượng), Sửu (Đắc), Mùi (Đắc) | Dần (Hãm), Mão (Hãm), Thìn (Hãm), Tỵ (Hãm), Ngọ (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Chưa đặc tả ngày/đêm và chưa hòa giải phạm vi ngày 1–15 ở trang36 với 10–20 ở trang78; không xuất kết luận thuận lý/toàn mỹ. Chưa tổng hợp Tuần/Triệt, Kỵ và hội hợp; không suy nhà đất, tài sản, sức khỏe hoặc tuổi thọ. | Có sao: vn-0; **khớp: vn-0** | Chưa; draft, review=null |
| Tham Lang | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r11@0.1.0. PDF / trang in 81–83, mục 4.2.9; bảng trang 37, mục 3.9. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Sửu (Miếu), Mùi (Miếu), Thìn (Vượng), Tuất (Vượng), Dần (Đắc), Thân (Đắc) | Tỵ (Hãm), Hợi (Hãm), Tý (Hãm), Ngọ (Hãm), Mão (Hãm), Dậu (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Chưa đặc tả đầy đủ phạm vi hội hợp, Hỏa/Linh đắc địa và các đoạn Kỵ/Riêu. Không suy tham lam từ tên sao, tuổi phát đạt, nghề hoặc bệnh tật. | Có sao: vn-tanlang; **khớp: vn-tanlang** | Chưa; draft, review=null |
| Cự Môn | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r12@0.1.0; R20 Cơ–Cự–Lộc Tồn Mệnh Mão/Dậu (không thêm điều kiện trạng thái; PDF89). PDF / trang in 86–87, mục 4.2.10; bảng trang 37, mục 3.10; đọc tiếp điều chỉnh trang 88–90. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Mão (Miếu), Dậu (Miếu), Thân (Đắc), Hợi (Đắc) | Tý (Vượng), Ngọ (Vượng), Dần (Vượng), Thìn (Hãm), Tuất (Hãm), Sửu (Hãm), Mùi (Hãm), Tỵ (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Chưa triển khai vượng địa: bảng sách yêu cầu thêm Hóa Lộc đồng cung hoặc Tuần/Triệt án ngữ cho cách ngọc trong đá; chưa đặc tả đủ phạm vi này. Không suy chức vụ, tài lộc, pháp lý hoặc ý ngược khi không khớp. | Có sao: vn-jumen, vn-co-cu-loc; **khớp: vn-jumen, vn-co-cu-loc** | Chưa; draft, review=null |
| Thiên Tướng | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r09@0.3.0. PDF / trang in 90–91, mục 4.2.11 Đại cương; bảng PDF / trang in 37, mục 3.11, đọc tiếp phần điều chỉnh trang 38 và 92. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Dần (Miếu), Thân (Miếu), Thìn (Vượng), Tuất (Vượng), Tý (Vượng), Ngọ (Vượng), Sửu (Đắc), Mùi (Đắc), Tỵ (Đắc), Hợi (Đắc) | Mão (Hãm), Dậu (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Không suy nghề nghiệp, chức vụ, mức tài sản, sức khỏe hoặc sự kiện tương lai; không áp đoạn Quan Lộc sang Mệnh. Nguồn nêu Tuần/Triệt án ngữ, Hình đồng cung, Kình/Đà và sao hội hợp; phạm vi và ngoại lệ chưa được đặc tả đủ để tổng hợp. Không tự suy án ngữ hai cung từ nhãn đang lưu. | Có sao: vn-6, engine-partial; **khớp: vn-6, engine-partial** | Chưa; draft, review=null |
| Thiên Lương | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r17@0.1.0. PDF 92 / trang in 92, mục 4.2.12, Đại cương; bảng PDF 38 / trang in 38, mục 3.12. Ngữ cảnh đã đọc: PDF/trang in 92–101. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Ngọ (Miếu), Thìn (Miếu), Tuất (Miếu), Tý (Vượng), Mão (Vượng), Dần (Vượng), Thân (Vượng), Sửu (Đắc), Mùi (Đắc) | Dậu (Hãm), Tỵ (Hãm), Hợi (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Không suy sức khỏe, tuổi thọ hoặc bảo đảm tránh tai họa. Chưa đặc tả các nhánh can sinh, hội hợp và Phú giải riêng. | Có sao: vn-tianliang; **khớp: vn-tianliang** | Chưa; draft, review=null |
| Thất Sát | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r18@0.1.0. PDF 95 / trang in 95, mục 4.2.13, Đại cương; bảng PDF 38 / trang in 38, mục 3.13. Ngữ cảnh đã đọc: PDF/trang in 92–101. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Dần (Miếu), Thân (Miếu), Tý (Miếu), Ngọ (Miếu), Tỵ (Vượng), Hợi (Vượng), Sửu (Đắc), Mùi (Đắc) | Mão (Hãm), Dậu (Hãm), Thìn (Hãm), Tuất (Hãm); thiếu bảng/địa chi/danh sách giữ unknown | Không suy bạo lực, nguy hiểm hoặc một nghề cụ thể. Chưa đặc tả các nhánh can sinh, hội hợp và vận. | Có sao: vn-qisha; **khớp: vn-qisha** | Chưa; draft, review=null |
| Phá Quân | Đã đọc theo hồ sơ; triển khai một phần: tanbien.r19@0.1.0. PDF 98 / trang in 98, mục 4.2.14, Đại cương; bảng PDF 38 / trang in 38, mục 3.14. Ngữ cảnh đã đọc: PDF/trang in 92–101. | Chú giải nền có điều kiện; không phải luận tổ hợp toàn diện | Tý (Miếu), Ngọ (Miếu), Sửu (Vượng), Mùi (Vượng), Thìn (Đắc), Tuất (Đắc); thêm phạm vi dự án: đúng một chính tinh tại Mệnh | Mão (Hãm), Dậu (Hãm), Dần (Hãm), Thân (Hãm), Tỵ (Hãm), Hợi (Hãm); mọi trường hợp đồng cung chính tinh khác; thiếu bảng/địa chi/danh sách giữ unknown | Bản thử chỉ xét khi Phá Quân là chính tinh duy nhất tại Mệnh; không luận tổ hợp với chính tinh khác. Không suy đổi mới, sáng tạo hoặc khởi nghiệp. Nhánh can sinh và hội hợp chưa được đặc tả. | Có sao: vn-pojun, engine-combo, engine-exception; **khớp: vn-pojun** | Chưa; draft, review=null |
| Mệnh không chính tinh (hàng riêng, không phải sao thứ 15) | Chưa triển khai rule Tân Biên; chú giải phương pháp ở nguồn khác giữ riêng | Có thể trình bày danh sách rỗng hợp lệ; không phải nhận định mệnh | Danh sách chính tinh rỗng đã lưu, phân biệt dữ liệu thiếu | Chưa luận mượn sao đối cung | Cần nguồn Tân Biên và đặc tả quan hệ, phạm vi áp dụng | vn-2 (dữ kiện, không tính khớp Tân Biên) | Chưa |

R04 Hóa Quyền là chú giải biểu tượng thu hẹp ở Vũ Khúc tại Mệnh; R05 ở Quan Lộc; R06/R07 ở Tài Bạch. Không tính chúng thành chính tinh hoặc thành độ phủ tổ hợp tại Mệnh. R19 chỉ có đoạn nền; điều kiện một chính tinh là giới hạn triển khai của dự án. Không thay cổng tổ hợp Tử Vi–phụ tá cũ.

R20@0.1.0: nhánh ba sao Cơ–Cự–Lộc Tồn cùng Mệnh Mão/Dậu; không đại diện mọi tổ hợp Cơ–Cự. Mẫu vn-co-cu-loc khớp; vn-jumen không khớp vì không ghi Lộc Tồn ở Mệnh. Chú giải nền và nhận định phối hợp giữ riêng.

### Tối đa ba ưu tiên nội dung tiếp theo

1. Đặc tả các nhánh/điều chỉnh thực sự làm thay đổi cách đọc: Cự Môn vượng, ngày/đêm của Nhật–Nguyệt và các can sinh; cần nguồn và quyết định phương pháp trước khi lập trình.

2. Nghiên cứu tổ hợp đang xuất hiện trong mẫu (Tử Vi–Phá Quân, Cơ–Cự, Cơ–Âm, Nhật–Lương): điều kiện đồng cung/hội hợp phải được xác định, không cộng nghĩa sao riêng.

3. Làm rõ thuật ngữ Tuần/Triệt/Không và phạm vi hội hợp theo cùng nguồn, sau đó kiểm duyệt điều kiện, văn biên soạn và quyền nội dung. Chưa triển khai các việc này trong đợt hiện tại.

## Công việc — đặc tả trước triển khai, 2026-10-09

Kế thừa nhật ký đọc toàn văn ở `TANBIEN-ENGINE-TRIAL.md`. Đợt này đọc lại toàn lớp chữ 158–168, xem ảnh trực tiếp 158,160,162: tên tác giả Vân Đằng Thái Thứ Lang, PDF do chủ dự án cung cấp; số trang PDF trùng số trang in ebook. Không đối chiếu bản in 1956. Quyền nguồn pending, không có người duyệt; bản diễn giải ngắn do dự án biên soạn.

| Nhận định nguồn (tóm tắt) | Trang PDF/in, mục | Điều kiện / dữ kiện / phụ thuộc | Ngoại lệ và phạm vi chọn | Quyết định |
|---|---|---|---|---|
| Tử Vi–Thiên Tướng: tổ chức công việc |158 §8.1;162 §8.11|Hai chính tinh đồng cung Quan Lộc. Không nêu can sinh, brightness hay giờ độc lập.|Không đưa vế phán xét thủ đoạn/lấn quyền và dự đoán chức vị vào kết luận cá nhân; không biến chúng thành phẩm chất tích cực. Điều chỉnh sát tinh §8.14 chưa đặc tả thành tổng hợp.|R05 giữ nguyên ý nghĩa/điều kiện sao; phiên bản mới bổ sung cổng dữ kiện nguồn theo chính sách dự án.|
| Thiên Cơ–Thiên Lương: cẩn thận, suy xét xa gần khi làm việc |160 §8.6;162 §8.12|Hai chính tinh cùng ở Quan Lộc. Không yêu cầu trạng thái, địa chi, tứ hóa, can hay vận ở dòng được chọn.|Không suy tham mưu, thầy thuốc, thầy giáo, chức vụ hoặc danh tiếng. Không nêu ngoại lệ riêng cho vế này; điều đó không xác nhận không có ngoại lệ. Chưa tổng hợp sát tinh/hội chiếu.|Triển khai R22, draft, review=null. Chú giải phối hợp cục bộ; không cộng nghĩa hai sao riêng.|
| Thiên Cơ–Cự Môn: mưu trí, thích máy móc |160 §8.6;161–162 §8.10|Đồng cung Quan Lộc.|Nguồn rõ ở dòng riêng, nhưng chưa chọn mở thêm nhóm này trong đợt; không dùng hồ sơ Cơ–Cự tại Mệnh thay cho Quan Lộc.|Để nghiên cứu/biên tập đợt sau, không phát hành đoạn bổ sung.|
| Liêm/Tử/Phủ/Vũ/Sát/Phá và các nhánh nghề/chức/tài sản |158–163 §8.1–8.14|Đơn thủ, đồng cung và vị trí khác nhau; nhiều vế kết quả tuyệt đối.|Không suy nghề cụ thể, thu nhập hoặc thời điểm thành công từ các đoạn này.|Không đưa các vế đó vào sản phẩm đợt này.|
| Sát tinh sáng/tối và nhóm chính tinh |163–164 §8.14 (số mục bị lặp sau Phá Quân)|Chưa rõ tập sao/phạm vi quan hệ và cách tổng hợp độ sáng cho mọi nhóm.|Không tự định nghĩa hội hợp/xâm phạm; không dùng lời cảnh báo thay điều kiện.|Cần quyết định phương pháp; không triển khai.|
| Xương/Khúc, Tả/Hữu, Khôi/Việt, các nhóm phụ tinh |164–166 §8.15–8.44|Có dòng không định nghĩa đồng cung/hội hợp đầy đủ; nhiều đoạn khẳng định nghề/chức.|Chưa tự thay quan hệ bằng hình học; riêng §8.41 Mã/Hỏa/Linh còn có bất đồng phép Hỏa theo nhóm chi.|Chưa triển khai, không tạo rule chỉ theo danh sách tên.|
| Vô chính diệu và Tuần/Triệt, Nhật/Nguyệt |166–167 §8.45|Xung/hợp chiếu, sáng sủa, án ngữ; có ngoại lệ bắt buộc.|Cần đặc tả phép mượn chính tinh/phạm vi án ngữ và xử lý Triệt Canh.|Chưa triển khai; không mượn sao đối cung ngầm.|

### Đặc tả R22 và cổng nguồn chung R05/R22

- R22 chỉ dùng `fact.career-stars` có Thiên Cơ và Thiên Lương; không yêu cầu vắng phụ tinh. Thiếu danh sách → unknown; sao ở cung khác/thiếu một sao đã xác định → not-matched. Không tạo lời luận ngược.
- Nội dung: “Theo Tân Biên, Thiên Cơ–Thiên Lương đồng cung Quan Lộc được mô tả qua sự cẩn thận khi làm việc và thói quen suy xét xa gần.” Giới hạn gần đoạn: chỉ cách diễn giải cục bộ, chưa tổng hợp sao đi cùng/hội chiếu, không dự đoán kết quả nghề nghiệp.
- Phụ thuộc an chính tinh theo Cục/ngày âm. Kim Cục ngày 21/24 (p8) còn mâu thuẫn: không cấp fact xác nhận nguồn cho cả R05/R22, evaluator giữ missing-facts nếu điều kiện sao còn khớp. Đây là giới hạn triển khai của dự án, **không phải điều kiện sách đặt cho hai tổ hợp**. Thiếu Cục/ngày âm cũng không cấp fact. Trace cho biết fact nào thiếu; UI giải thích nguyên nhân.
- Không dùng Hỏa, Triệt, Tứ Hóa, Thiên Quý, năm/tháng xem làm điều kiện hai đoạn cục bộ này. Vì vậy không chặn mọi hồ sơ Hợi/Mão/Mùi, Canh, Tân hay tháng nhuận. Các yếu tố thực sự ghi tại Quan Lộc được giữ ở căn cứ/ngữ cảnh, tác động chưa được tổng hợp. Không coi các đoạn là kết luận toàn cung.
- Không thay engine v2, không đổi bảng trạng thái, không sửa snapshot. Các bản đọc đóng băng vẫn chứa phiên bản rule/template cũ.

## Quan Lộc 1.11 — đặc tả trước triển khai (09/10/2026)

Đọc lại toàn văn và ảnh PDF/trang in 158–167, kể cả hai mục cùng đánh số 8.14; ảnh 9–10 xác định Bạch Hổ thuộc vòng Thái Tuế, Tấu Thư thuộc vòng Lộc Tồn/Bác Sỹ bản mệnh. Không dùng website làm nguồn. Tác giả: Vân Đằng Thái Thứ Lang; quyền nội dung chưa xác minh; diễn giải dự án, draft/review=null.

Các nhánh dự kiến triển khai được đặc tả tại `lib/interpretation-rules/tanbien-career-content.ts`: R23–R39. Điều kiện sao, độc thủ và địa chi là AND; độc thủ = đúng một chính tinh, không loại phụ tinh. Không đặt thêm brightness/can/giờ mà câu nguồn không yêu cầu. Chỉ lấy vế mô tả, bỏ kết quả nghề/chức vụ/tiền/thời điểm; không biến việc bỏ vế dự báo thành kết luận thuận lợi toàn cung. Ngoại lệ riêng không nêu ở vế chọn không đồng nghĩa đã hết ngoại lệ; §8.14 sát tinh còn chờ đặc tả.

Cổng dữ kiện dùng chung cho R05/R22 và mọi nhánh mới dựa vị trí chính tinh: thiếu Cục/ngày âm hoặc Kim Cục 21/24 => thiếu căn cứ, không phát claim; đây là chính sách chất lượng dữ kiện, không phải điều kiện luận sách. R36/R37 dựa phụ tinh, R38 dựa vòng bản mệnh không phụ thuộc vị trí chính tinh nên không dùng cổng này. Không rule mới nào dùng Hỏa/Linh, Triệt, Tứ Hóa, Thiên Quý hay tháng nhuận năm xem làm điều kiện; không chặn tất cả hồ sơ vì những bất đồng đó. Đọc từ snapshot bản mệnh đã lưu, không tính lại.

Trùng lặp: các đoạn đối ứng Cơ–Cự (§8.6/8.10), Nhật–Cự (§8.5/8.10), Đồng–Âm (§8.3/8.8) chỉ tạo một claim. Chú giải Lộc Tồn chỉ nói tổ chức: nếu đã có đoạn tổ chức từ R05/R31/R37, chuyển riêng R36 vào căn cứ mở rộng, không xóa claim/trace và không coi sao khác đã thay đổi ảnh hưởng của Lộc Tồn. Các ý khác vẫn giữ riêng; không có quy tắc tổng hợp sức mạnh.

### Kiểm kê toàn phần Quan Lộc (bảng duy nhất cho đợt 1.11)

Tất cả số trang dưới đây là cả trang PDF và trang in. “Ngoài phạm vi” là quyết định biên tập đợt Công việc, không tuyên bố câu sách sai. Mỗi mục có các nhánh được chọn và các nhánh còn lại; không coi số rule là độ đầy đủ.

| Mục | Trang | Nội dung, điều kiện, nhánh còn lại | Dữ kiện/phụ thuộc | Quyết định |
|---|---|---|---|---|
| 8.1 Tử Vi | 158 | Tướng đồng cung → R05. Độc Ngọ/Tý, Phủ/Sát/Phá/Tham đồng cung: vế danh vị/tài lộc/biến cố không dùng. | Vị trí chính tinh; cổng Kim21/24 | R05 giữ nguyên |
| 8.2 Liêm Trinh | 158 | Độc Dần/Thân; Phủ/Tướng/Sát/Phá/Tham đồng cung: toàn phần chức vị/nghề/kết quả, không đổi thành phẩm chất tích cực. | Chính tinh có; Kim21/24 nếu dùng | Ngoài phạm vi |
| 8.3 Thiên Đồng | 158–159 | Độc Mão/Dậu: thay đổi (R24); Tỵ/Hợi: chóng chán/di chuyển (R25); Thìn/Tuất: ăn nói/luận lý (R26); Âm đồng cung Tý: can gián (R39). Âm Ngọ, Lương, Cự: vế nghề/danh/kiện tụng không dùng. | Chính tinh, số lượng, chi có; Kim21/24 | R24–26, R39 |
| 8.4 Vũ Khúc | 159 | Độc Thìn/Tuất; Phủ/Tướng/Sát/Phá/Tham đồng cung: danh/nghề/tiền/tuổi30; không chuyển văn võ kiêm toàn thành năng lực hiện đại. | Chính tinh có; Kim21/24 | Ngoài phạm vi |
| 8.5 Thái Dương | 159–160 | Cự Dần luận lý/xét đoán R27; độc Tuất/Hợi văn chương R30. Độc Tý xuất hiện hai dòng sớm/muộn: chưa hiệu đính; Thìn dẫn chiếu dòng trước. Cự Thân/Lương Mão,Dậu/Âm: nghề, vận, TuầnTriệt án ngữ. | Chính tinh có; Kim21/24; TriệtCanh nếu dùng nhánh Âm | R27/R30; giữ mâu thuẫn Tý và điều kiện án ngữ chờ |
| 8.6 Thiên Cơ | 160 | Cự đồng cung mưu trí/máy móc R23; Lương cẩn thận R22. Độc TỵNgọMùi/HợiTýSửu và Âm Thìn/Dần: nghề/danh; vị trí Cơ–Âm cần đối chiếu riêng nếu mở nhánh. | Chính tinh có; Kim21/24 | R22/R23 |
| 8.7 Thiên Phủ | 160 | Độc Tỵ/Hợi, Sửu/Mùi/Mão/Dậu; Tử/Liêm/Vũ đồng cung: danh/tài/nghề. | Chính tinh có; Kim21/24 | Ngoài phạm vi |
| 8.8 Thái Âm | 160–161 | Độc Mão ăn nói/văn chương R28; Thìn/Tỵ văn chương R29; Đồng Tý can gián R39. Dậu/Hợi/Tuất, ĐồngNgọ/CơThìn,Dần: danh/nghề; dòng Nguyệt đồng cung dưới chính Thái Âm mâu thuẫn định danh. | Chính tinh có; Kim21/24 | R28/R29/R39; không tự sửa Nguyệt thành Nhật |
| 8.9 Tham Lang | 161 | Độc Thìn/Tuất,Dần/Thân,Tý/Ngọ; Tử/Liêm/Vũ: nghề/danh/tài/đạo đức/họa/tuổi30. | Chính tinh có; Kim21/24 | Ngoài phạm vi |
| 8.10 Cự Môn | 161–162 | Độc Tý/Ngọ ăn nói/tổ chức/mưu trí R31; Thìn/Tuất xét đoán/luận lý R32. NhậtDần R27, Cơ R23 chỉ xuất một lần. Hợi/Tỵ/Đồng/NhậtThân: dự báo không dùng. | Chính tinh có; Kim21/24 | R23/R27/R31/R32 |
| 8.11 Thiên Tướng | 162 | Tử đồng cung R05. Độc SửuMùi,TỵHợi,MãoDậu; Liêm/Vũ: nghề/danh/tài. | Chính tinh có; Kim21/24 | R05 |
| 8.12 Thiên Lương | 162 | Độc Tỵ/Hợi chóng chán/di chuyển R33; Cơ R22. Độc TýNgọ/SửuMùi; Đồng/NhậtMão,Dậu: nghề/danh. | Chính tinh có; Kim21/24 | R22/R33 |
| 8.13 Thất Sát | 162–163 | Độc DầnThân/TýNgọ/ThìnTuất, Tử/Liêm/Vũ: thành công/nguy hiểm/chức/nghề; không biến dự báo vượt khó thành phẩm chất. | Chính tinh có; Kim21/24 | Ngoài phạm vi |
| 8.14 Phá Quân | 163 | Độc TýNgọ mưu trí/dũng mãnh R34; ThìnTuất mưu trí R35, không lược vế át quyền rồi gọi tổng thể thuận lợi. DầnThân/Tử/Liêm/Vũ: nghề/danh/tài. | Chính tinh có; Kim21/24 | R34/R35 |
| 8.14 Sát tinh (số mục lặp trong sách) | 163–164 | 12 ô: sát sáng/mờ × chính tinh sáng/mờ × ba nhóm (TửPhủCựNhậtCơNguyệtĐồngLương; SátPháLiêmTham; VũTướng). Mỗi ô bàn danh vị, thăng giáng, trợ giúp/hại; chưa định nghĩa phạm vi sát ở đâu, số sao cần, trạng thái hỗn hợp hay thứ tự ưu tiên. Không tự chọn đồng cung/hội hợp. | Có vị trí/nhãn nhưng chưa đặc tả tổng hợp sáng/mờ; Hỏa nhóm HợiMãoMùi có bất đồng; Kim21/24 nếu dùng chính tinh | Chờ phương pháp cả 12 ô, không có ô đủ điều kiện để thực thi; không dùng cảnh báo thay điều kiện |
| 8.15 Xương/Khúc | 164 | Văn tài; chưa xác định một hay cả hai, cùng cung hay cách khác. | Có sao; chưa đủ quan hệ | Chờ phương pháp |
| 8.16 Khôi/Việt | 164 | Thêm nhiều sao sáng hội hợp, số lượng/phạm vi chưa rõ; nội dung chức vị. | Có sao, chưa phép hội hợp | Chờ / ngoài phạm vi |
| 8.17 Tả/Hữu | 164 | Sự nâng đỡ; một/hai và quan hệ chưa rõ. | Có sao, thiếu quan hệ | Chờ phương pháp |
| 8.18 Lộc Tồn | 164 | Lộc Tồn tại Quan Lộc: tổ chức; bỏ dự báo tiền/chức. | Phụ tinh bản mệnh, không Kim21/24 | R36 |
| 8.19 Hóa Kỵ | 164 | Trắc trở; ngoại lệ Nhật–Nguyệt đồng cung Sửu/Mùi. Không bỏ ngoại lệ để phát dự báo nghịch. | Tứ Hóa canTân còn mở, vị trí chính tinh Kim21/24 | Ngoài phạm vi dự báo; không triển khai |
| 8.20 Khoa/Quyền/Lộc | 164 | Tài lộc/uy quyền/danh chức, không viết lại thành tính cách. | Tứ Hóa, canTân nếu triển khai | Ngoài phạm vi |
| 8.21 Khốc/Hư | 165 | Suy xét/luận lý; nhánh sáng/mờ điều chỉnh. Chưa chốt một/hai và phép gom độ sáng. | Có sao, thiếu đặc tả nhóm | Chờ phương pháp |
| 8.22 Thiên Mã | 165 | Tổ chức/thao lược; bỏ dự báo công danh và chỉ định nghề lưu động. | Phụ tinh bản mệnh, không Kim21/24 | R37 |
| 8.23 Tham–Xương/Khúc | 165 | Đồng cung Hợi/Tý rõ, nhưng nội dung danh/tài. | Có; Kim21/24 | Ngoài phạm vi |
| 8.24 Cự–Đồng–Hình | 165 | Quan hệ chưa rõ; dự báo phải nhờ người trên mới khá giả. | Có sao; Kim21/24 nếu triển khai | Chờ / ngoài phạm vi |
| 8.25 Đồng–Âm–Kình | 165 | Đồng cung Ngọ rõ; võ quan/chiến công/thời loạn. | Có; Kim21/24 | Ngoài phạm vi |
| 8.26 Cơ–Nguyệt–Tả/Hữu | 165 | CơNguyệt đồng cung, TảHữu hội hợp chưa định nghĩa; nghề theo giới. | Có; Kim21/24 | Chờ / ngoài phạm vi |
| 8.27 CơNguyệtĐồngLương/XươngKhúcTảHữu | 165 | DầnThânThìnTuất; không biết phạm vi gặp, không thể ép mọi sao đồng cung; nghề/danh. | Có vị trí, thiếu quan hệ; Kim21/24 | Chờ / ngoài phạm vi |
| 8.28 CơNguyệtĐồngLương/Khoa/TảHữu/QuangQuý/QuanPhúc | 165 | Không xác định quan hệ; danh nghề y. | ThiênQuý, TứHóaTân, Kim21/24 liên quan nếu triển khai | Chờ / ngoài phạm vi |
| 8.29 Sát–Quyền | 165 | Sát DầnThân, Quyền đồng cung rõ; chức/uy quyền. | TứHóaTân, Kim21/24 nếu triển khai | Ngoài phạm vi |
| 8.30 Lộc–Mã | 165 | Buôn bán/di chuyển và dự báo; Lộc là sao nào, quan hệ chưa rõ. | Có LộcTồn/HóaLộc/Mã, không tự đồng nhất | Chờ phương pháp |
| 8.31 Kiếp–Hư–Hao–Quyền | 165 | Quan hệ và Hao chưa rõ; bị hại/trở ngại. | Có sao, TứHóaTân | Chờ / ngoài phạm vi |
| 8.32 Kình–Lực | 165–166 | Đồng cung rõ; suốt đời bất đắc chí/danh thấp, không chuyển thành mô tả tích cực. | Có phụ tinh/vòng | Ngoài phạm vi |
| 8.33 Kình–Mã | 166 | Kình TứMộ gặpMã chưa rõ phạm vi; võ chức/nguy hiểm. | Có; quan hệ chưa rõ | Chờ / ngoài phạm vi |
| 8.34 Tuế–Hổ–Phù–Xương–Khúc | 166 | Hùng biện/luận lý/văn chương; Phù và quan hệ chưa rõ. | Có vòng/sao, chưa đặc tả tổ hợp | Chờ phương pháp |
| 8.35 Xương–Khúc–Tấu–Long–Phượng | 166 | Văn nghệ; quan hệ chưa rõ. Không mặc định tất cả đồng cung. | Có sao/vòng, thiếu quan hệ | Chờ phương pháp |
| 8.36 Hồng–Đào–Riêu–Tấu–Cơ–Vũ | 166 | Nghề biểu diễn; quan hệ chưa rõ, không ép CơVũ đồng cung. | Có, Kim21/24 nếu triển khai | Chờ / ngoài phạm vi |
| 8.37 Tướng–Tấu–Phù, Mệnh TảHữu | 166 | Mệnh có TảHữu tọa thủ; Tướng/Phù và quan hệ QuanLộc chưa rõ; nghề tôn giáo. | Có, định danh chưa rõ | Chờ / ngoài phạm vi |
| 8.38 Binh–Hình–Tướng–Ấn | 166 | Võ chức/văn phòng, quan hệ và Tướng chưa rõ. | Có sao/vòng | Chờ / ngoài phạm vi |
| 8.39 Hổ–Tấu | 166 | Đồng cung QuanLộc: văn chương/học ngoại ngữ; bỏ dự báo danh chức. BạchHổ/TấuThư bản mệnh tr9–10. | suiqian12 + boshi12; không Kim21/24 | R38 |
| 8.40 Hình–Riêu–Y | 166 | Nghề thầy thuốc/báo chí; quan hệ chưa rõ. | Có phụ/tạp tinh | Chờ / ngoài phạm vi |
| 8.41 Mã–Hỏa–Linh | 166 | Nghề cơ khí/vận tải; quan hệ chưa rõ. | Hỏa nhómHợiMãoMùi có bất đồng; không áp cảnh báo đại trà | Chờ / ngoài phạm vi |
| 8.42 Thai–Tọa–Đào–Hồng | 166 | Sớm thành tựu/mọi việc dễ dàng; quan hệ chưa rõ. | Có sao | Ngoài phạm vi |
| 8.43 Đào–Hồng tại Tý | 166 | Can chi tuổi Tý/Dậu, dự báo sớm danh/chết non. | Có, nhưng không đưa kết luận cá nhân | Ngoài phạm vi |
| 8.44 Lương–Phá | 166 | Đồng cung; ngoặc PháToái/PháQuân chưa chốt lựa chọn; quân sự/mạo hiểm/uy quyền. | Có hai định danh, không tự thay thế; Kim21/24 nếu PháQuân | Chờ / ngoài phạm vi |
| 8.45 Vô chính diệu | 166–167 | Mượn chính tinh đối cung; ngoại lệ TuầnTriệt án ngữ và NhậtNguyệt cùng sáng xung/hợp. Chưa có đặc tả kế thừa điều kiện/độ sáng tổng hợp; không mượn ngầm. | Có hình học, không đồng nhất hội hợp; TriệtCanh, Kim21/24 có thể ảnh hưởng | Chờ quyết định phương pháp; không phát dự báo |

### Kết quả triển khai sau đặc tả

R23–R39 đã nối cùng catalog và template1.11.0;19rule Công việc gồm2rule cũ. R38 giới hạn profilev2 do dùng hai vòng **bản mệnh** theo phép an đã đối chiếu ở9–10, không mở tương thích profile cũ ngầm. Bản đọc, JSON và ánh xạ từng claim ở `exports/tanbien-career-1.11.0/`; nguồn/phạm vi cho mỗi rule được đóng băng theo bản đọc.

Mỗi nhánh mới đều có mẫu engine giả lập khớp trong phạm vi227lần tìm; nguồn sách là căn cứ cho điều kiện, outputengine chỉ chứng minh luồng. Mẫu thiếu dữ kiện là fixture kỹ thuật riêng. Không có rule nào được nâng trạng thái duyệt. Chi tiết kiểm thử/bảo toàn trong TANBIEN-RULE-READING, không nhân bản thêm hồ sơ.
