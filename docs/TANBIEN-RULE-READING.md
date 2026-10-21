## Công việc 1.11.0 — kiểm kê toàn phần Quan Lộc và triển khai cục bộ (09/10/2026)

Nền tính toán giữ `tanbien-vn-trial-v2` / engine `0.2.0`. Template **1.11.0**, catalog **interpretation-1.14.0**, derivation **1.13.0**, formatter **1.9.0**, compatibility **0.3.0**. R01–R39 đều còn draft/review=null. Không tạo evaluator, dashboard hoặc chủ đề mới.

### Nguồn và phạm vi quyết định

Đọc lại văn bản **và ảnh** trang PDF/in **158–167**, ảnh9–10 để định danh vòng bản mệnh. Tận dụng hồ sơ v2 và nhật ký đã đọc; không tuyên bố lần này đọc lại277trang. Bảng duy nhất theo toàn bộ46đề mục (8.1–8.45, có hai mục8.14) nằm ở cuối [RULE-SOURCES.md](./RULE-SOURCES.md), gồm cả các nhánh không triển khai. Không dùng số đề mục/rule làm thước đo chất lượng hoặc độ chính xác.

**17 rule mới R23–R39**, cộng R05/R22 giữ nguyên điều kiện và câu claim, tạo19nhận định Công việc cục bộ. Đặc tả dữ liệu nguồn `lib/interpretation-rules/tanbien-career-content.ts` được biên dịch vào cùng catalog/DSL, không phải bộ máy điều kiện song song. Phần đã triển khai: Cơ–Cự, các nhánh đơn thủ Đồng/Âm/Dương/Cự/Lương/Phá theo địa chi, Nhật–Cự tạiDần, Đồng–Âm tạiTý, LộcTồn, ThiênMã, Hổ–Tấu. Độc thủ luôn đếm chính tinh, không loại phụ tinh. Không dùng brightness iztro; các vế được chọn không yêu cầu trạng thái nên không tự thêm bảng sáng.

Hổ–Tấu chỉ chạy **profilev2** có vòng bản mệnh đã đối chiếu; không tự mở sang profile cũ qua adapter compatibility. R38 lấy `suiqian12=Bạch Hổ`, `boshi12=Tấu Thư` cùng QuanLộc, không dò sao lưu hay câu văn. Thiếu trường giữ missing-facts. Receipt không xác minh thì không xuất claim từ danh sách sao/vòng của hợp đồng chưa được xác nhận.

Các dự báo chức vị, tài lộc, nghề định sẵn, thời điểm, tai họa và phán xét trong phần còn lại là **quyết định loại khỏi phạm vi biên tập**, không giả gọi là thiếu dữ kiện. Các mục có thể có ý nghĩa nhưng chưa rõ quan hệ được ghi chờ: 8.15–17,8.21,8.30,8.34–35 và các nhóm gặp/hội hợp. Không tự sửa hai dòng Tý ở8.5 hoặc dòng Nguyệt đồng cung dưới TháiÂm ở8.8. §8.14sát tinh: cả12ô sáng/mờ × nhóm chính tinh đã kiểm kê; chưa chốt phạm vi quan hệ, cách gom trạng thái hỗn hợp và thứ tự tác động, nên không tạo phép điều chỉnh hình thức. Các nhánh8.45 còn thiếu quy tắc mượn/ánh xạ điều kiện và ngoại lệ, không mượn chính tinh ngầm.

### Chất lượng dữ kiện và biên tập

`careerMajorRuleIds` dùng chung `fact.career-source-available` cho mọi nhận định phụ thuộc vị trí chính tinh. Thiếu Cục/ngày âm hoặc KimCục21/24 giữ unknown/missing-facts; không ghi thành điều kiện sai. Cổng nằm ở **phạm vi dự án**, không gán cho sách. R36/R37/R38 không bị chặn bởi bất đồng bảng chính tinh. Không nhánh mới nào phụ thuộc Hỏa, ThiênQuý, Triệt, TứHóaTân hoặc tháng nhuận năm xem; các mục chờ liên quan đã ghi riêng trong kiểm kê. Không tự tuyên bố các bất đồng đã giải quyết.

Đoạn đối ứng trong sách chỉ tạo một rule, dẫn cả hai trang. Khi R36 lặp riêng ý tổ chức của R05/R31/R37, bài chuyển R36 sang “Căn cứ bổ sung cùng chủ đề tổ chức”, mặc định đóng; claim/trace vẫn giữ nguyên. Đây là biên tập tránh lặp, không phải quy tắc sao này thắng sao kia. Các ý khác giữ riêng, giới hạn tại đoạn và nguồn/trace đóng mặc định. Các phần Mệnh/Tài chính không thêm nội dung.

### Bản đọc và đường dẫn

- [24 trường hợp trước/sau, bài đọc tách trace](../exports/tanbien-career-1.11.0/review.md):23mẫu DEMO/engine và1fixture thiếu dữ kiện.
- [Ánh xạ câu → dữ kiện/điều kiện/nguồn](../exports/tanbien-career-1.11.0/evidence.md).
- [JSON cùng lần xuất](../exports/tanbien-career-1.11.0/readings.json); Markdown ghi runId và SHA-256 JSON. Giữ nguyên bộ1.9 và1.10.
- Nhập mới ở `/internal/readings`; mẫu Cơ–Cự mới: `/internal/readings?id=dfd66fc6-3ebb-4513-855f-c02802f1b016` (cần quyền nội bộ). Link từng mẫu trong bản duyệt.
- Hồ sơ1992: riêng `.local/tanbien-career-1.11.0/audit-before-after.md/json` và `reading-links.json`, không đưa dữ liệu cá nhân vào exports/public. Bản mới **R05+R38**, bản trước **R05**, cùng snapshot; chỉ thêm phiên bản nội dung. Bản DEMO vẫn R05; không làm dài cưỡng ép. vn-jumen vẫn không có Công việc; vn-16 thêmR32 theo CựMôn tạiQuanLộc, không đổi phần Mệnh.

Tìm mẫu:192đầu vào giả lập theo lưới đã lưu, rồi35/384đầu vào của lượt bổ sung, dừng khi đủ các nhánh. 17rule mới đều có mẫu enginekhớp; đây chỉ là chứng minh luồng, **không phải kiểm chứng chuyên môn**. Lượt đầu từ chối2đầu vào: `TANBIEN_PALACE_STEM_MISMATCH` và lỗi đọc `majorStars` trên undefined. Đầu vào/trace tìm mẫu nằm riêng trong `.local/tanbien-career-1.11.0/before.json`; không sửa engine trong đợt này, không giả tạo snapshot cho2ca đó. Bộ tìm ban đầu chạy trước khi đổi catalog; bốn mẫu tìm sau ghi rõ baseline là phép đối chiếu tập R05/R22, không giả làm bản đọc lịch sử đã giao.

### Kiểm tra thực chạy

- **63/63test**,6file: career-expansion,career,tanbien,presentation,dynamic-reading,review-pack. Bao phủ các nhánh mới, sai cung/chi/độc thủ, thiếu trường so với rỗng, cổng chung, vòngv2, không receipt, trùng ý, tính bất biến, sourcepaths, JSON/Markdown. Test kỹ thuật sửa sao có nhãn riêng; không coi engine output là expected độc lập.
- Typecheck và **production build cô lập** đạt. Không dùng devbuild làm bằng chứng production.
- **1E2E đạt, retries=0**, workers1, port3005; chạy cả360/390px: nhập mới Cơ–Cự và Hổ–Tấu, đúng snapshot/câu, mở căn cứ/trace, đổi sang vn-jumen không có Công việc, quay lại/reload không lẫn bài, không tràn ngang. Không mở lại đợt manifest/rate-limit. Ảnh trong `docs/evidence/tanbien-career-1.11.0/mobile`.
- Kiểm tra đọc riêng trên **localhost:3000**,390px: bản mới/cũ hồ sơ kiểm toán giữ cùng resultId và đúng tập claim; ảnh chỉ trong `.local/tanbien-career-1.11.0/private-*.png`. Lượt khởi chạy đầu cần chuyển sang Chrome đã cài do thiếu Chromium bundled; không phải lỗi ứng dụng.
- **107/107tệp baseline không đổi**: engine/calendar, evaluator, các bản xuất cũ và toàn bộ reading đã có trước đợt này. Không ghi DB; chỉ tạo readingfile mới có UUID, profile/snapshot giữ nguyên. Log và bằng chứng: [thư mục kiểm tra](./evidence/tanbien-career-1.11.0/).

Giới hạn nghiệm thu: đã kiểm tra phần mềm và đọc văn bản nguồn, chưa được chuyên gia duyệt; quyền nội dung nguồn chưa xác minh. Không gọi đây là luận toàn cung hoặc đủ để bán. Beta/thanh toán/email thật vẫn tắt. Dừng đợt ở phạm vi Công việc này.

---

# Công việc — template 1.10.0, 2026-10-09

Nền engine giữ nguyên `tanbien-vn-trial-v2` / `tanbien-trial-0.2.0`. Catalog `interpretation-1.13.0`; formatter `1.8.0`; derivation `1.12.0`. Đã đọc lại lớp chữ PDF 158–168, đối chiếu ảnh 158/160/162; kế thừa nhật ký toàn văn, không tuyên bố đọc lại toàn sách. [Bảng nguồn và quyết định](RULE-SOURCES.md#công-việc--đặc-tả-trước-triển-khai-2026-10-09).

## Nội dung và điều kiện thực thi

- **R22@0.1.0:** Thiên Cơ và Thiên Lương cùng trong chính tinh Quan Lộc → diễn giải cục bộ về cẩn thận khi làm việc, suy xét xa gần. Nguồn PDF/trang in 160 §8.6 và 162 §8.12. Không dùng trạng thái sao, can sinh, tứ hóa hoặc giờ độc lập làm điều kiện mà đoạn nguồn không đặt ra. Không dự đoán nghề, chức vụ, tài sản hay thành công. Không ghép hai chú giải sao riêng.
- **R05@0.4.0:** giữ nguyên văn claim và hai điều kiện sao Tử Vi/Thiên Tướng tại Quan Lộc. Rà ảnh 158 §8.1 và 162 §8.11 không phát hiện điều kiện brightness/địa chi bắt buộc bị bỏ sót ở vế tổ chức. Thêm yêu cầu dữ kiện `fact.career-source-available`: chặn khi thiếu Cục/ngày âm hoặc thuộc Kim Cục ngày 21/24. Claim ID R05 không đổi vì nội dung không đổi; phiên bản rule/catalog/receipt phân biệt các lần đọc.
- Cổng nguồn trên là **phạm vi triển khai của dự án**, không phải một điều kiện mới gán cho sách. Ở ca còn khớp sao nhưng nguồn an chưa xác định, evaluator trả `missing-facts`; không tạo nhận định ngược. Khi biết rõ sao không khớp thì `condition-false`, kể cả có dữ kiện khác thiếu. Giữ nguyên evaluator.
- Không có ngoại lệ riêng đủ rõ cho vế R22 được chọn; danh sách exceptions rỗng không xác nhận không có ngoại lệ. Mục sát tinh 163–164 chưa đủ đặc tả tổng hợp. Giới hạn này ở cạnh nhận định và trong căn cứ, không gọi là bài luận toàn cung.

## Bất đồng engine liên quan thực sự

| Điểm | R05 / R22 có phụ thuộc? | Xử lý |
|---|---|---|
| Kim Cục ngày 21/24 | Có: vị trí cả hai nhóm chính tinh đi từ phép an Tử Vi | Không cấp fact nguồn khả dụng, giữ unknown khi còn khớp sao; nguyên nhân hiển thị cụ thể |
| Hỏa nhóm Hợi/Mão/Mùi | Không phải điều kiện hai vế đang xuất | Không chặn cả hồ sơ; chưa tổng hợp ảnh hưởng sao đi cùng |
| Triệt Canh | Không phải điều kiện hai vế đang xuất | Không suy tác động hoặc án ngữ; chỉ dữ kiện ngữ cảnh |
| Tứ Hóa Tân | Không dùng hóa làm điều kiện | Không mặc định mọi năm Tân bị chặn |
| Tháng nhuận xem | Hai rule chỉ dùng bản mệnh, không dùng lớp năm/tháng xem | Không tác động tập claim Công việc |
| Thiên Quý | Không phải điều kiện hai rule; quy ước v2 kế thừa hồ sơ nguồn đã chốt ở mức thử nghiệm | Không suy thành mức tin cậy hoặc tác động nghề nghiệp |
| Thiếu danh sách / receipt | Có: chưa xác định sao ở Quan Lộc | Luồng mới vẫn fail closed; không dùng mảng rỗng giả hoặc DEMO fallback |

## Trước/sau và mở bản mới

[Bộ Công việc trước/sau](../exports/tanbien-career-1.10.0/readings.md), [JSON cùng lần xuất](../exports/tanbien-career-1.10.0/readings.json). JSON giữ snapshot, claim ID, rule, facts, điều kiện, nguồn, trace và phiên bản. Markdown tách dữ kiện với phạm vi biên soạn. Các file 1.9.0 và các bản xuất cũ không thay.

| Mẫu | Dữ kiện kiểm tra | Trước → sau | Phần chưa có |
|---|---|---|---|
| DEMO Vũ–Phủ | Tử Vi/Thiên Tướng tại Quan Lộc Thìn, snapshot DEMO cũ | R05 → R05 giữ nguyên ý; thêm dữ kiện trước đoạn và giới hạn gần đoạn | Không thêm suy luận về tổ hợp ngoài R05 |
| Engine Cơ–Lương giả lập | Quan Lộc Thìn có Thiên Cơ/Thiên Lương, engine v2 | Chưa có Công việc → R22 | Chưa tổng hợp toàn cung, hội chiếu và sao điều chỉnh |
| vn-16 | Cự Môn tại Quan Lộc Thìn | Không khớp → không khớp | Chưa triển khai nhánh Công việc này; không lấp bằng nội dung Mệnh |
| vn-jumen | Quan Lộc Sửu, chính tinh rỗng trong snapshot | Không khớp → không khớp | Không mượn sao đối cung; §8.45 cần đặc tả riêng |
| Fixture thiếu chính tinh Quan Lộc | Dữ kiện cố ý xóa, không phải lá số engine | unknown cho R05/R22 | Không diễn giải thiếu thành không có sao |
| Hồ sơ kiểm toán riêng | Cùng snapshot v2 đã lưu; không tính lại | R05 giữ ý; template mới nêu dữ kiện và giới hạn | Chưa có cơ sở thêm nhận định mới riêng cho hồ sơ này |

Mẫu Cơ–Lương được tìm ở lượt 42 trong giới hạn 48 lần (bốn ngày giả lập × 12 giờ chi), không sửa sao. Đầu vào, profile, engine, search ledger và snapshot có trong JSON xuất. Đây không phải đối chứng chuyên môn độc lập.

Dùng quyền nội bộ hiện có:
- Nhập mới: `http://localhost:3000/internal/readings`.
- Mẫu engine có R22: `http://localhost:3000/internal/readings?id=c19762af-cd48-479f-9b02-dd9729dc88d0`. Liên kết “Mở hồ sơ nguồn” quay về bản 1.9 cùng snapshot, không có đoạn Công việc.
- DEMO: `http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading`.
- Hồ sơ kiểm toán thật: URL và so sánh chỉ lưu trong `.local/tanbien-career/readings-index.json`, `audit-work-before-after.md/json`; không đưa dữ liệu sinh thật vào exports/public.

## Kết quả nghiệm thu

- 41/41 test trong 5 file: career, tanbien, presentation, dynamic-reading, review-pack. Kiểm tra đúng/sai cung, thiếu một sao, thiếu danh sách, cổng Kim21/24, thiếu Cục/ngày, không thêm ngoại lệ từ tên sát tinh, không dùng brightness thay điều kiện, draft không sang khách, dữ kiện/căn cứ đúng cung, snapshot bất biến và claim ngoài Công việc giữ nguyên. [Log](evidence/tanbien-career/unit-regression.txt).
- Lượt đầu có một assertion cũ đếm cố định 21 rule bị lỗi sau khi thêm R22. Đã cập nhật đúng 22 và khẳng định R22 không khớp DEMO; không sửa điều kiện để cứu test. [Log lượt đầu](evidence/tanbien-career/unit.txt).
- Typecheck và production build cô lập đạt: [typecheck](evidence/tanbien-career/typecheck-final.txt), [build](evidence/tanbien-career/build.txt).
- Một E2E, chạy cả360/390, Chrome production3005, một worker, retries=0: nhập giả lập → lưu/mở đúng snapshot → đọc Công việc → mở nguồn/trace → đổi sang vn-jumen không còn đoạn cũ → mở lại/reload. Không tràn ngang, không pageerror. [Log](evidence/tanbien-career/e2e.txt), [ảnh bài390](evidence/tanbien-career/mobile/career-reading-390.png), [ảnh căn cứ360](evidence/tanbien-career/mobile/career-evidence-360.png). Không kiểm thử lại hạ tầng manifest/rate limit.
- Kiểm tra trực tiếp localhost3000 cả hồ sơ cá nhân mới, mẫu giả lập R22 và bản nguồn 1.9: đúng snapshot, đúng phiên bản, bản trước chưa có đoạn Công việc. Kết quả/ảnh cá nhân ở `.local/tanbien-career/`, không phát hành.
- 108/108 tệp baseline giữ hash: engine/calendar, snapshot nội bộ có trước, mẫu đóng băng, DEMO cố định và các bản xuất. [Bảo toàn](evidence/tanbien-career/preservation.json). Không phải checksum toàn database; không ghi database hiện hành.

Phần mềm đã kiểm tra; đoạn nguồn đã đọc trực tiếp; nội dung vẫn **draft, review=null**, quyền nguồn pending, chưa phê duyệt chuyên môn. Không bật beta, thanh toán/email thật, AI hay scoring. Dừng phạm vi Công việc tại đây.

---

# Bộ duyệt toàn mẫu — template 1.9.0, 09/10/2026

Đợt này chỉ sửa trình bày: template 1.9.0, formatter 1.7.0; catalog vẫn interpretation-1.12.0, 21 rule Tân Biên, draft/review=null. Không đổi evaluator, claim chuyên môn, engine, lịch hoặc snapshot. Không đọc/đối chiếu lại PDF trong đợt này; kết luận về văn bản nguồn bên dưới là hồ sơ kế thừa, không phải một lần xác minh nguồn mới.

## Phạm vi đã kiểm tra trực tiếp

Bản xuất 1.8.0 có 19 bài. Catalog mẫu có 56 mục: 20 mẫu engine và 36 fixture kỹ thuật; thêm DEMO snapshot riêng thành 57 hàng kiểm kê. Bộ mới xuất đủ 21 bài DEMO/engine, giữ 36 fixture trong bảng riêng, không xem fixture là lá số hợp lệ. Hai mẫu engine có sẵn nhưng chưa có trong bản xuất trước: engine-partial và cn-reference; không tạo snapshot hoặc đơn mới. Profile tham chiếu Trung Quốc được ghi riêng.

Đã đọc code, JSON snapshot, log thực tế; so toàn bộ execution của 19 mẫu trước/sau, không chỉ số claim. Hash 101 file baseline (rule/engine/calendar, mẫu đóng băng, bài DEMO và các bản xuất cũ) không thay đổi: [bằng chứng](evidence/tanbien-review/preservation.json). Không chạy thao tác ghi database thật và không tuyên bố đã audit toàn database.

## Sửa hiển thị

Căn cứ tách bốn lớp: dữ kiện snapshot; điều kiện/nội dung nguồn; phạm vi/giới hạn biên soạn; chi tiết kỹ thuật mặc định đóng. Ghi chú R21/R20/R19/R14/R16 từng mang kind=source được phân loại editorial, không còn tiền tố “Đối chiếu bảng nguồn”. Bảng trạng thái thật vẫn thuộc nguồn. Ghi chú đã xuất cạnh đoạn không lặp nguyên văn ở căn cứ thông thường; hồ sơ đầy đủ còn trong lớp kỹ thuật.

R21 ở vn-16 hiển thị Mệnh tại Tý; R20 ở vn-co-cu-loc dùng Dậu; R06 ở DEMO dùng Tài Bạch Thân. Chỉ gắn địa chi đã xác định từ đúng cung, không đoán khi thiếu/nhập nhằng. Phạm vi đầy đủ Hợi/Tý, Mão/Dậu, Dần/Thân vẫn ở điều kiện nguồn, claim gốc không đổi. Các câu mới là phép gắn dữ kiện vào câu hiện có, không thêm ý nghĩa chuyên môn.

## Bộ duyệt và cách mở

- [Sáu bản đọc có căn cứ](../exports/tanbien-review-1.9.0/selected-readings.md): DEMO Vũ–Phủ, vn-0, vn-co-cu-loc, vn-jumen, vn-16, vn-2 (không có claim phù hợp).
- [Phiếu trống](../exports/tanbien-review-1.9.0/feedback.md): mã mẫu, snapshot, phiên bản, claim ID; không có phản hồi giả hoặc lời mời đã gửi.
- [Đánh giá toàn bộ mẫu](../exports/tanbien-review-1.9.0/assessment.md), [21 bài đầy đủ](../exports/tanbien-review-1.9.0/all-readings.md), [JSON cùng lần xuất](../exports/tanbien-review-1.9.0/readings.json).
- [Trước/sau](../exports/tanbien-review-1.9.0/changes.md), [ánh xạ câu ba loại](../exports/tanbien-review-1.9.0/sentence-map.json). Phạm vi ánh xạ là phần đọc chính, gồm nhận định, dữ kiện và ghi chú phạm vi; không tuyên bố ánh xạ mọi nhãn UI hoặc toàn trace.

Mở http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-16 bằng phiên nội bộ hiện có; chọn mẫu rồi “Đối chiếu rule”. DEMO là lựa chọn mặc định không có sample. Không chia sẻ khóa. Bộ xuất 1.8 tại đường dẫn gốc và mọi archive giữ nguyên; đường dẫn version 1.9 là bộ mới, không dùng file gốc cũ để so văn mới. Chạy xuất lại bằng `node --import tsx scripts/export-tanbien-review-pack.ts` (chỉ ghi thư mục 1.9; làm đổi runId/thời điểm).

## Vì sao 194 test và 98 test

Đã đọc trực tiếp [log 1.7](evidence/tanbien-editorial/unit.txt): 194 test/15 file; [log 1.8](evidence/tanbien-sun/unit.txt): 98 test/11 file. Hai tổng số thuộc tập chạy khác nhau, không phải chứng cứ 96 test bị xóa. Log 1.7 không giữ lệnh/tên từng file nên không xác định được chính xác từng file chênh lệch. Không suy rằng hồi quy đầy đủ từ con số tổng.

Tập 1.8 ghi rõ: tanbien-co-cu, tanbien-editorial, tanbien-four, tanbien-last, tanbien-menh-expansion, tanbien-presentation, tanbien-sun, tanbien-three, tanbien, interpretation, reading (đều `.test.ts`). Đợt này không chạy lại toàn bộ chỉ để đạt lại một tổng số.

## Kiểm thử đợt 1.9

- 44/44 test, 5 file: tanbien-review-pack, tanbien-presentation, interpretation, reading, editorial-preview. Tập trung ràng buộc dữ kiện, phân lớp, bảo toàn 19 execution, 6 phiếu và ánh xạ. [Log](evidence/tanbien-review/unit.txt).
- `npm run typecheck` đạt; production build cô lập đạt. [Typecheck](evidence/tanbien-review/typecheck.txt), [build](evidence/tanbien-review/build.txt).
- Một kịch bản Playwright chạy cả 360/390, sáu mẫu và quay lại vn-16, mở căn cứ/technical, reload, không tràn ngang, không pageerror: đạt, retries=0. [Log](evidence/tanbien-review/e2e.txt). Đây không phải sáu test độc lập hay bằng chứng chuyên môn.
- Môi trường production test riêng localhost:3005, DB test 55443, fixture phiên cùng origin, không dùng phiên hoặc DB khách. Lệnh: `node scripts/reading-stability.mjs prepare`, `build`, `start`; chỉ build khi server 3005 dừng. E2E chọn `tests/e2e/tanbien-reading.spec.ts -g "review pack evidence layers"` với config `playwright.stability.config.ts` và env riêng `.local/json-stability/test.env` (không xuất giá trị).
- Đã xem trực tiếp ảnh [bài 360](evidence/tanbien-review/mobile/r21-main-360.png) và [căn cứ 390](evidence/tanbien-review/mobile/r21-evidence-390.png). Test còn lưu ảnh hai kích thước. Dev 3000 được giữ hoạt động. Không mở rộng kiểm thử hạ tầng.

## Ba ưu tiên sau khi chủ dự án đọc

1. **Biên tập:** vn-co-cu-loc, vn-jumen, vn-16 — kiểm tra người đọc có hiểu giới hạn từng nhận định, tránh đọc thành phán xét cá nhân. Dùng phiếu trống, chưa có phản hồi thực tế.
2. **Nghiên cứu nguồn:** vn-2, engine-combo, engine-exception — hiện không có claim Tân Biên phù hợp cho Mệnh không chính tinh / Tử Vi–Phá Quân tại Mùi. Không lấp bài bằng nguồn khác.
3. **Quyết định phương pháp:** ngày/đêm ở vn-0/vn-taiyang/vn-tianliang; Tuần/Triệt ở vn-4/DEMO. Chưa đặc tả thì không suy tác động.

Chưa phê duyệt chuyên môn; không dùng độ phủ làm độ chính xác hoặc điều kiện mở bán. Không thay cấu hình beta, thanh toán, email/AI/scoring. Dừng ở bộ duyệt, không tự thêm rule.

---

# Thái Dương tại Mệnh ngoài R14 — template 1.8.0, 09/10/2026

Đã xác minh trước sửa: template1.7.0, catalog interpretation-1.11.0, R01–R20; vn-16 chỉR07, R14 không khớp. Hai snapshot đã có: vn-16 Mệnh Tý, một chính tinh Thái Dương, Thân cư Quan Lộc Thìn; vn-taiyang Mệnh Ngọ, một chính tinh Thái Dương, Thân cư Mệnh Ngọ. Mẫu đối chứng vn-tianliang: Mệnh Mão, Thái Dương/Thiên Lương. Đây là đầu vào engine giả lập, không phải xác nhận chuyên môn độc lập. Không tạo mẫu, đơn hoặc giao dịch mới.

## Nguồn đọc trực tiếp và quyết định

Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*, PDF chủ dự án cung cấp tại thư mục TAILIEUTUVI. Đọc toàn lớp chữ PDF35 và68–73, tức §3.5, §4.2.5 Đại cương/Nam mệnh/Nữ mệnh/Phú giải; xem trực tiếp ảnh PDF35 và69 để xác nhận bảng và ranh giới câu được sử dụng. Trang PDF trùng trang in tại các trang này. Không dùng hồ sơ DEMO hay nguồn khác thay PDF. Quyền nội dung pending; diễn giải ngắn do dự án biên soạn, chưa phê duyệt chuyên môn. Không phân phối toàn trang sách trong bản xuất khách.

| Ứng viên/nhận định nguồn (tóm tắt) | Phạm vi và điều kiện bắt buộc | Ngoại lệ, điểm chưa đặc tả | Dữ kiện hệ thống | Locator PDF/trang in | Quyết định |
|---|---|---|---|---|---|
| Thẳng thắn, cương nghị, hơi nóng nảy | Nhật thủ Mệnh; miếu/vượng/đắc | Các nhánh ngày/đêm, hội hợp/án ngữ riêng chưa tổng hợp | Có cung, sao, chi; bảng sách riêng |35 §3.5;68 §4.2.5 Đại cương|Giữ nguyên R14; không áp cho Tý |
| Ham chuộng văn chương, triết học, đạo lý | Nhật tại Mệnh Hợi/Tý, hãm theo bảng sách | Dòng riêng không nêu giờ, can, sao đi cùng hoặc ngoại lệ riêng; không đồng nghĩa đã hết ngoại lệ toàn hệ thống. Không áp điều kiện từ dòng khác ngầm vào dòng này |Có Mệnh, chính tinh, chi; bảngtaiyang1.0.0 ghi Hợi/Tý Hãm|69 §4.2.5 Đại cương, dòng Nhật hãm địa Hợi/Tý; bảng35|A: R21. Chỉ chọn vế ham chuộng; bỏ phán xét đạo đức ở cùng dòng, không thay chúng bằng lời khen khác |
| Mô tả hãm nói chung về hình dáng, tính, sức khỏe, tuổi thọ | Nhật hãm tại Mệnh | Bảng35 có cách mô tả trí tuệ khác Đại cương69; không tự hòa giải. Không đảo nghĩa R14 |Có trạng thái nhưng không đủ cơ sở kết luận cá nhân|35;69 Đại cương|C: không dùng phán xét, hình tướng, bệnh/tử vong hoặc dự đoán tuyệt đối; không tạo đoạn tích cực thay thế |
| Về già an nhàn; vật chất ở Thân/Tuất/Tý | Hãm; nhánh sau thêm Dương cung | Kết quả cuộc đời/sức khỏe tuyệt đối |Có chi; không triển khai kết quả|69 Đại cương|C: không phát hành dự đoán tài chính/sức khỏe/tuổi già |
| Thuận lý khi sinh ban ngày; kém tốt đẹp khi sinh ban đêm | Miếu/vượng, điều kiện thời gian độc lập | Chưa định nghĩa ranh giới ngày/đêm theo tác giả; không dùng giờ dân sự hoặc trạng thái để thay |Có giờ đầu vào, chưa có fact ngày/đêm theo nguồn|35;68 Đại cương|B: chưa triển khai, không bỏ điều kiện bằng cảnh báo |
| Tốt/xấu theo nhiều sao hội hợp; Tuần/Triệt án ngữ | Trạng thái và quan hệ/sao cụ thể | Chưa đặc tả nhiều/hội hợp/án ngữ/xâm phạm; nhãn Tuần trong một cung không xác định hai cung; Không chưa đồng nhất Thiên Không/Địa Không |Có danh sách sao, chưa có fact quan hệ theo phương pháp tác giả|35;68–69|B/C: không tổng hợp tác động; phần phú quý, bệnh/tử vong ngoài phạm vi |
| Nhật đắc với Kỵ đồng cung | Đắc, Kỵ; không bị Kình/Đà/Không/Kiếp/Riêu/Hình xâm phạm | “Xâm phạm” chưa có phạm vi, thiếu dữ kiện vắng mặt đủ chặt |Có sao/cung; chưa đủ điều kiện loại trừ|69 đầu trang|B/C: không bỏ điều kiện loại trừ; kết quả phú quý/sống lâu không phát hành |
| Nhật Tý theo can Bính/Đinh so với tuổi khác | Nhật Mệnh Tý và phân nhánh can năm sinh | Không lấy can cung làm can sinh; không bỏ phân nhánh để mẫu khớp |Input/can năm nếu lưu phải đọc riêng, chưa dùng trong nhánh mới|70 Phú giải, Nhật cư Tý|C: giàu sang/đạo đức/bất đắc chí không dùng; không biến “tài giỏi” thành câu chung bất kể can |
| Nhật Mùi/Thân, làm việc chuyên cần lúc đầu rồi bỏ dở | Nhật Mệnh Mùi/Thân | Ngoài nhánh Hợi/Tý đang chọn, cần quyết định biên tập về phán xét hành vi |Có sao/chi|70 Phú giải|Chờ: không mở rộng đợt này |
| Nhật Nguyệt đồng cung, hợp/xung/giáp; nhánh Tỵ/Hợi gặp Cự, các bộ phụ tinh | Cung, vị trí, quan hệ và các sao tùy từng đoạn; có absence sát/án ngữ, thời bình/loạn | Một số chữ OCR bất nhất (71,73); chưa kiểm ảnh/hiệu khảo từng dòng không sử dụng; không tự sửa. Hội hợp/ngoại triều/giao hội chưa quy đổi thành hình học |Có vị trí; chưa có đủ đặc tả nguồn|70 cuối–73 Phú giải|B/C: không triển khai tổ hợp, chức vụ/giàu sang/thi đỗ/sức khỏe hay phán xét giới. Không ảnh hưởng R21 riêng dòng69 |

## Đặc tả R21 và giới hạn

`tanbien.r21@0.1.0`, loại **nhận định theo điều kiện cụ thể** (schema combination dùng cho điều kiện, không gọi đây là tổ hợp nhiều sao), chủ đề overview/learning, draft, review=null. Ba điều kiện AND: life-stars chứa Thái Dương; life-hoi-ty bằng hoi-ty; tanbien-taiyang-state bằng Hãm theo bảng1.0.0. Không thêm bảng mới hay sửa bảng cũ. Fact nhóm Hợi/Tý chỉ xác định khi chi có trong bảng nguồn; state chép nhãn bảng theo chi. Không đọc brightness engine làm fallback. Evidence về name/earthlyBranch/majorStars của đúng cung Mệnh.

Thiếu danh sách sao, chi hoặc lookup → unknown khi không có điều kiện đã biết sai, theo evaluator hiện có. Nhánh khác hoặc sao chỉ ở cung khác → not-matched, không sinh kết luận ngược. Exceptions=[] chỉ nói chưa có ngoại lệ riêng được đặc tả trong dòng này; không tuyên bố không có ngoại lệ. Không có can sinh/giờ/ngày đêm bị lược bỏ khỏi điều kiện dòng69; chúng thuộc các nhánh khác trong hồ sơ trên.

Câu được phép: “Theo Tân Biên, Thái Dương tại Mệnh ở Hợi hoặc Tý, thuộc hãm địa theo bảng sách, được liên hệ với sự ham chuộng văn chương, triết học và đạo lý.” Gần đoạn: không xác định sở thích thực tế, học vấn hoặc năng lực người đọc. Không suy nghề, giàu nghèo, tốt/xấu hay tương lai. Không có rule mới cho các sao khác.

## Bài đọc và biên tập

Template1.8.0, catalog1.12.0, derivation1.11.0, formatter1.6.0; evaluator và R01–R20 giữ nguyên. vn-16 xuấtR21 ở Học hỏi và giữR07 ở Tài chính; R14 vẫn condition-false. vn-taiyang giữR14, R21condition-false. vn-tianliang giữR14/R17, R21condition-false. Chưa thêm mẫu engine Hợi; nhánh Hợi kiểm bằng fixture kỹ thuật có nhãn, không gọi đó là lá số engine.

- Phần yếu tố chưa xét dùng câu kết ngắn “không phải danh sách đầy đủ”, không lặp ảnh hưởng chưa tổng hợp.
- Mỗi đoạn có liên kết đến đúng ngữ cảnh đang thu gọn; mở trước khi cuộn, hỗ trợ hash/Back/focus bằng component sẵn có. Giới hạn nguồn trực tiếp vẫn gần nhận định.
- Bài không có claim diễn giải chính tinh Mệnh hiển thị thông báo rõ; không dùng số đoạn làm độ tin cậy. R04 hoặc R07 riêng không được coi là đã diễn giải chính tinh Mệnh.
- Bản xuất cũ giữ trong `exports/tanbien-reading-v1.7-archive/`. [Trước/sau và ánh xạ](../exports/tanbien-sun-review.md), [JSON ánh xạ](../exports/tanbien-sun-sentence-map.json), [bài đầy đủ](../exports/tanbien-reading-examples.md), [JSON](../exports/tanbien-reading-examples.json), [duyệt văn](../exports/tanbien-reading-review.md) cùng runId. Ánh xạ bài chính gồm nhận định → claim/nguồn; dữ kiện → snapshot/path; giới hạn/phương pháp → metadata. Không gọi trace, tiêu đề hoặc nút giao diện là câu nhận định.

URL: `http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-16`; đổi sang `vn-taiyang` để đối chiếu. Chỉ quyền nội bộ; beta/payment/email thật không bật.

## Kiểm thử và bảo toàn — thực tế

- Unit hồi quy liên quan: **98/98**, 11 file, gồm nhánh nguồn R21, R14 cũ, sai cung/chi, thiếu danh sách/lookup, nhãn brightness khác sách, draft không phát hành, bài và bản xuất. Fixture thay chi/sao chỉ là kiểm logic, không phải lá số engine. Lượt đầu còn kỳ vọng số rule/claim cũ; đã cập nhật đúng phần thêm R21, các rule cũ được so riêng nguyên vẹn.
- Typecheck và production build đạt. Build tại bản sao `.local/json-stability/app`, server3005, DB test55443, không dùng DB3000. E2E Chrome một worker, **5/5 đạt,0retry**,46,9giây; thao tác đổi mẫu, reload/Back, link mở đúng details/focus, căn cứ/trace và overflow360/390. Lượt E2E đầu3lỗi đều là kỳ vọng cũ (20rule/1đoạn vn-16) và chuỗi locator nguồn `PDF 68` so với định dạng thực `PDF / trang in 68`; log đầu được giữ, không che bằng retry.
- Log `docs/evidence/tanbien-sun/{unit,typecheck,build,e2e}.txt`; ảnh mobile `vn-16-main-{360,390}.png`, `vn-16-evidence-{360,390}.png`, `vn-taiyang-main-{360,390}.png`, `vn-taiyang-evidence-{360,390}.png`. Đã trực tiếp mở xem ảnh bài vn-16 360 và căn cứ vn-taiyang360; hai chiều rộng và trace kiểm tự động. Không tuyên bố người dùng thật đã đánh giá.
- `preservation.json`:20tệp đã hash không đổi (engine/lịch, bảng nguồn, evaluator, snapshot engine đóng băng, DEMO và archive1.7);19snapshotId và toàn bộ định nghĩa/kết quả/claim R01–R20 không đổi. Trong19mẫu chỉ vn-16 có thêm claim R21. DerivedFacts có hai dữ kiện mới, không thay kết quả cũ. Không ghi vào database khách, không khẳng định đã kiểm checksum toàn DB/báo cáo khách.
- Tái xuất: `node --import tsx scripts/export-tanbien-reading-examples.ts`, rồi `scripts/export-tanbien-five-reading.ts` và `scripts/export-tanbien-sun-review.ts` bằng tsx. Hai script sau đọc cùng JSON hiện hành. Production E2E dùng `playwright.stability.config.ts` và phiên fixture riêng; không đăng nhập lặp hay sửa rate-limit/manifest.

## Giá trị và phần còn thiếu

vn-16 nay có một nhận định riêng cho chính tinh Mệnh thay vì chỉ nội dung phụ tinh Tài Bạch. Điều hữu ích là điều kiện và xuất xứ được nhìn thấy, không phải số chữ tăng. Vẫn không phải Tổng quan hoàn chỉnh. Chưa giải quyết ranh giới ngày/đêm, hội hợp/xâm phạm/án ngữ, hiệu khảo các dòng không dùng, điều chỉnh toàn hệ thống và quyền nội dung. Các khoảng trống tương tự ở sao khác: nhánh hãm ngoài phạm vi bảng đang dùng; điều kiện thời gian của Thái Âm; điều kiện đồng cung/hội hợp/can sinh của Phá Quân và các tổ hợp. Chỉ ghi phạm vi, không triển khai trong đợt này.


---

# Bản đọc biên tập — template 1.7.0, 09/10/2026

Đợt này chỉ biên tập và tổ chức bài. Catalog **interpretation-1.11.0**, formatter 1.5.0, điều kiện R01–R20, evaluator, nguồn và trạng thái draft/review=null giữ nguyên. Không đọc/hiệu khảo thêm PDF hoặc đưa nhận định chuyên môn mới. Lịch sử nghiên cứu phía dưới được giữ nguyên theo phiên bản của từng đợt.

## Trải nghiệm đã thay đổi

- Mở đầu có nhãn đọc thử, phạm vi cục bộ và dữ kiện chính của đúng snapshot. Dữ kiện chi tiết và chú giải thuật ngữ mở được; chỉ các chủ đề có claim mới hiện thành mục bài.
- R01 bỏ một câu giới thiệu phương pháp lặp; R12/R13/R16 rút ngắn lời giới hạn nhưng giữ các điều kiện và nội dung chuyên môn. Văn gốc vẫn nằm trong căn cứ. Formatter biên tập đối chiếu câu gốc chính xác trước khi rút gọn, không dò từ khóa để suy chủ đề.
- R20 giữ nguyên câu nhận định, kèm “Nhận định này chưa đủ để đánh giá cách giao tiếp của người đọc.” Giải thích không tự hòa giải với chú giải riêng chuyển vào căn cứ. Không ẩn R12/R13 và không tạo kết luận tổng hợp.
- Những yếu tố chưa xét: danh sách chọn lọc tối đa ba dữ kiện liên quan, có đường dẫn về snapshot; không phải danh sách đầy đủ, không suy tác động. Giới hạn nguồn bắt buộc vẫn gần đoạn. Chủ đề chưa có nội dung gom cuối bài, không biến thành đặc điểm người đọc.
- Câu mở đầu, thuật ngữ, ghi chú phạm vi được phân loại biên tập; diễn giải vẫn truy về claim. Claim.text và toàn bộ execution không đổi.

## Năm mẫu đọc toàn bài

| Mẫu | Claim xuất | Người đọc có thể đối chiếu | Phần còn thiếu |
|---|---|---|---|
| DEMO Vũ–Phủ | R01–R07 | Các đoạn riêng về nền, học hỏi/chủ động, công việc và tài chính | Chưa tổng hợp toàn lá số hoặc tác động của các yếu tố đi cùng |
| vn-0 | R13/R16 | Hai chú giải Thiên Cơ và Thái Âm riêng | Không có lời luận tổ hợp Cơ–Âm; ít chủ đề |
| vn-co-cu-loc | R12/R13/R20 | Hai chú giải riêng và nhánh Cơ–Cự–Lộc Tồn có điều kiện | Không hòa giải thành tính cách chung, không suy nghề hay tương lai |
| vn-jumen | R12/R13 | Chú giải riêng Cự Môn/Thiên Cơ; không áp R20 vì không có Lộc Tồn đồng cung | Bài còn mỏng, không có nhánh phối hợp phù hợp |
| vn-16 | R07 | Ý nghĩa nền Lộc Tồn bên dữ kiện Tài Bạch | R14 không khớp bảng nguồn; không có diễn giải Mệnh phù hợp. Quá ít để coi là Tổng quan hữu ích |

Đây là mẫu engine giả lập/DEMO để kiểm thử và đọc văn, không phải đối chiếu chuyên môn độc lập hay phản hồi của người thật.

## Bản xuất và phản hồi

- [Năm bài đọc](../exports/tanbien-five-reading-review.md).
- [Trước/sau cùng snapshot và từng đoạn → claim → nguồn](../exports/tanbien-five-reading-comparison.md).
- [Phiếu phản hồi trống theo đoạn/toàn bài](../exports/tanbien-five-reading-feedback.md).
- [Bản đầy đủ 19 mẫu](../exports/tanbien-reading-examples.md), [JSON cùng lần xuất](../exports/tanbien-reading-examples.json), [bản duyệt văn gọn](../exports/tanbien-reading-review.md).
- Archive nguyên bản 1.6: `exports/tanbien-reading-v1.6-archive/`. Hồ sơ Cơ–Cự cũ vẫn mô tả lần chạy 1.6; không coi chúng cùng lần chạy với bản xuất 1.7.

Phản hồi web hiện có gắn quyền beta và bản đọc đóng băng. Không tái sử dụng cho preview động bằng cách bỏ cổng beta hoặc mở rộng quyền. Vì chưa có luồng phản hồi nội bộ tương đương, đợt này cung cấp phiếu trống gắn sample/snapshot/claim/phiên bản; không thêm backend, không ghi phản hồi giả, không gửi lời mời. Chủ dự án có thể ghi nhận khó hiểu, lặp, cảm giác khẳng định chắc chắn và điều muốn biết thêm trong phiếu.

URL: `http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-co-cu-loc`. Cần phiên nội bộ hiện có; chọn mẫu bằng bộ chọn, bấm Đối chiếu rule. DEMO dùng URL bỏ tham số sample. Không chia sẻ khóa nội bộ.

Tái xuất: chạy `node --import tsx scripts/export-tanbien-reading-examples.ts`, sau đó `node --import tsx scripts/export-tanbien-five-reading.ts`. Script thứ hai dùng đúng JSON đã xuất, không tính lại engine. RunId và generatedAt liên kết các bản cùng lần chạy.

## Kiểm tra thực tế và bảo toàn

- Unit: **194/194**, 15 file; typecheck và production build đạt. Lượt đầu có bốn lỗi kỳ vọng hiển thị cũ, đã điều chỉnh để kiểm display.text và vị trí căn cứ; không đổi kỳ vọng evaluator để làm test đạt.
- Production E2E riêng cổng3005, DB test riêng, Chrome, một worker, **4/4 đạt, 0 retry** (46,2 giây). Kiểm năm mẫu, đổi mẫu/Back/reload, bài hiển thị so với JSON, mở căn cứ/trace, 360px/390px, quyền nội bộ. Không chạy lại bộ chẩn đoán manifest/rate-limit.
- Log: `docs/evidence/tanbien-editorial/{unit,typecheck,build,e2e}.txt`. Ảnh: `docs/evidence/tanbien-editorial/mobile/`. Trực tiếp xem ảnh mở đầu DEMO360 và bài Cơ–Cự390; các thao tác/hai chiều rộng còn được kiểm tự động. Không coi kiểm overflow tự động là đánh giá chuyên môn hay phản hồi người đọc.
- `preservation.json`: SHA-256 35 tệp không đổi (engine/lịch/rules, snapshot mẫu, DEMO cố định, archive); snapshotId và toàn bộ execution của 19 mẫu trùng bản 1.6. Không thao tác DB khách; đây không phải kiểm checksum toàn database khách.
- Beta, thanh toán và email thật không bật; không sửa cấu hình các cổng này. Dev server3000 giữ hoạt động. Không có AI hoặc scoring.

## Mốc đánh giá và ba khoảng trống đề xuất

Biên tập đã giảm lặp phương pháp, tách chi tiết kỹ thuật và làm rõ giới hạn. Chủ dự án cần đọc để đánh giá cách diễn đạt; chưa có dữ liệu phản hồi người thử. Những phần thiếu dưới đây cần nguồn/rule, không thể lấp bằng văn:

1. Nhánh vị trí/trạng thái chưa có nhận định Mệnh phù hợp, tiêu biểu Thái Dương tại Tý ở vn-16.
2. Chủ đề công việc, tài chính và học hỏi còn thưa ngoài DEMO; không có căn cứ để suy thêm từ các chú giải nền.
3. Tổ hợp và tác động ngữ cảnh (Cơ–Âm, Cơ–Cự ngoài nhánh Lộc Tồn, Tuần/Triệt và điều kiện thời gian) chưa được tổng hợp; từng nhánh cần nghiên cứu nguồn riêng.

Dừng ở mốc đọc và đánh giá này, không triển khai các nhánh tiếp theo. Phần mềm đã kiểm tra; nguồn chuyên môn kế thừa các lần đối chiếu được ghi bên dưới; **chưa được phê duyệt chuyên môn** và chưa phải Tổng quan đầy đủ.

---

# Cơ–Cự tại Mệnh — template1.6.0, bàn giao09/10/2026

Hiện trạng trước sửa: template 1.5.0, catalog interpretation-1.10.0, R01–R19. Không có AGENTS.md ở dự án/các thư mục cha đã kiểm tra. `vn-jumen`: snapshot `00a34921815fe99f5cd7f1f42bd5a48b3c9eafa1237b81ccb2d4305d837ba918`, Mệnh Dậu, Thiên Cơ/Cự Môn, minorStars=[] hợp lệ, Tuần Không ở adjectiveStars. Hai claim R12/R13; không có Lộc Tồn tại Mệnh. Không lấy cung can Quý làm can năm sinh.

## Nguồn và phân loại ứng viên

Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*, PDF chủ dự án cung cấp. Trực tiếp đọc toàn trang PDF/in 73–76, 85–91; xem ảnh 88–89, ranh giới lời phú và lời giải. Số trang PDF trùng trang in. Quyền nguồn pending, không có phê duyệt chuyên môn. Không dùng Toàn Thư làm nguồn thay thế. Các diễn giải dưới là tóm tắt nội dung nghiên cứu, không phải nhận định xuất cho người đọc.

| Ứng viên | Nguồn và nghĩa riêng | Cung/quan hệ/địa chi | Trạng thái, can, phụ tinh, vận | Ngoại lệ/điểm chưa rõ | Quyết định |
|---|---|---|---|---|---|
| Cơ–Cự: học rộng nhưng tiêu pha | Tr.88 §4.2.10 Phú giải, câu bắt đầu “Cự Tú, Thiện Cơ…” | Lời giải ghi Mệnh **Dần**, đồng cung | Không đặt trạng thái/can trong đoạn | Hai đoạn kế ghi Mão/Dậu; cần hiệu khảo địa chi, không tự đổi Dần thành Mão. Câu quan chức kế tiếp cũng ghi Dần. | B: chưa xác minh khác biệt văn bản; C đối với dự đoán quan chức. Không phát hành nhánh này. |
| Cơ–Cự: công khanh | Tr.88 cuối →89 đầu, Phú giải | Mệnh Mão/Dậu, đồng cung | Tuổi Ất/Tân/Kỷ/Bính được phân biệt với các tuổi khác; câu đề tr.88 ghi “Kỵ”, lời giải89 ghi Kỷ | Không được bỏ can sinh để khớp mẫu. Dự báo quyền cao/chức trọng không chuyển thành tính tổ chức. | C: ngoài phạm vi, kèm vấn đề hiệu khảo. |
| Cơ–Cự Dậu so với Mão | Tr.89, đoạn trước mục Âm nữ | Mệnh Dậu đồng cung; so sánh Mão | Cần “nhiều sao sáng sủa tốt đẹp hội hợp”, có danh sách gợi ý | Chưa đặc tả “nhiều”, “hội hợp”; lời nói về giàu sang/giảm thọ không phù hợp sản phẩm | B/C: không triển khai, không biến thành điểm tốt/xấu. |
| Âm nữ Ất/Tân, tài giỏi/thao lược | Tr.89 mục Mão/Dậu–Ất/Tân–Âm nữ | Mệnh Mão/Dậu, Cơ–Cự đồng cung | Âm nữ, can Ất/Tân; vế sau yêu cầu không gặp Tuần/Triệt **xung chiếu** | Chưa xác định cách đọc “bất kiến” trong câu đề so với “xung chiếu” ở lời giải; không coi nhãn Tuần tại Mệnh là bằng chứng đáp ứng điều kiện vắng mặt. Phần vượng phu ích tử loại khỏi phạm vi. | B: không bỏ điều kiện giới/can/absence để xuất vế tài giỏi. |
| Cơ–Cự–Lộc Tồn, lời nói | Tr.89 §4.2.10 Phú giải, mục “Cự, Cơ nhi ngộ Lộc Tồn, ngôn ngữ bất cẩn” | Mệnh Mão/Dậu; cả Cự/Cơ/Lộc Tồn đồng cung | Đoạn này không đặt thêm trạng thái, can sinh, giới, tứ hóa hay vận | Lời giải mở rộng cả Cự+Lộc ở địa chi khác; dự án **không triển khai vế mở rộng**. Không ghi ngoại lệ riêng trong đoạn, không khẳng định không có ngoại lệ toàn hệ thống. | A: chỉ nhánh ba sao ở Mão/Dậu, lời mô tả truyền thống về thiếu thận trọng trong lời nói; không đánh giá chắc chắn người đọc. |
| Cơ–Cự–Song Hao | Tr.89, mục kế ngay sau Lộc Tồn | Mệnh Mão/Dậu, Cơ–Cự đồng cung; Song Hao hội hợp | Chưa rõ phạm vi hội hợp, không phải chỉ một nhãn vòng sao tên Hao | “Uy quyền/danh tiếng” là dự đoán tuyệt đối, không đổi thành phẩm chất tích cực | B/C: chưa đặc tả quan hệ, ngoài phạm vi dự đoán. |

Phần Thiên Cơ tr.74–76 không cung cấp một đoạn nền Cơ–Cự trung tính để có thể cộng vào R12/R13; các đoạn Cơ–Lương, Cơ–Nguyệt, Song Hao phải giữ riêng. Các đoạn Cự–Nhật, Cự–Đồng ở88–90 không áp dụng sang Cơ–Cự. Điều chỉnh chung về sức khỏe, tai nạn, tử vong và phán xét giới/đạo đức không phát hành; không biến chúng thành lời khen thay thế.

## Đặc tả trước code — tanbien.r20@0.1.0

- Loại: nhận định phối hợp có điều kiện, topic overview, readingTheme action, draft, review=null.
- Điều kiện nguồn: một cung Mệnh xác định duy nhất; chính tinh chứa **Thiên Cơ và Cự Môn**; địa chi **Mão hoặc Dậu**; phụ tinh chứa **Lộc Tồn** cùng cung đó. Không chấp nhận Hóa Lộc thay Lộc Tồn, Lộc Tồn ở cung khác, hoặc tên trong văn hiển thị. Không dùng nhãn brightness làm điều kiện nguồn không yêu cầu.
- Phạm vi dự án: chỉ nhánh Cơ–Cự–Lộc ở Mão/Dậu; không triển khai vế Cự+Lộc ở mọi vị trí. Chỉ snapshot bản mệnh của profile được hỗ trợ; không tính vận.
- Dữ kiện: `fact.life-stars`, `fact.life-minor-stars`, thêm ánh xạ xác định `fact.life-mao-dau` từ một cung Mệnh có địa chi thuộc đủ 12 chi. Hợp lệ nhưng khác Mão/Dậu → other; thiếu/không biết chi → không sinh fact, unknown. Đường dẫn về đúng name/earthlyBranch/majorStars/minorStars. Không sửa snapshot.
- Loại trừ: điều kiện bắt buộc sai → not-matched. Không có ngoại lệ riêng đủ rõ trong đoạn được chọn; exceptions=[] không đồng nghĩa đã xác nhận không có ngoại lệ. Không tự thêm Tuần/Triệt thành ngoại lệ; dữ kiện này chỉ ghi là tác động chưa tổng hợp.
- Thiếu: khi không có điều kiện đã biết sai, thiếu danh sách chính tinh/phụ tinh/chi → unknown. Danh sách phụ tinh rỗng hợp lệ → not-matched, không phải unknown; không suy kết luận “ăn nói cẩn thận”.
- Claim đã triển khai: “Theo Tân Biên, Thiên Cơ–Cự Môn tại Mệnh ở Mão hoặc Dậu, có Lộc Tồn đồng cung, được liên hệ với cách ăn nói thiếu thận trọng.” Một câu duy nhất truy về rule và tr.89. Ghi chú gần đoạn: “Đây là mô tả truyền thống của điều kiện này, chưa đủ để đánh giá cách giao tiếp của người đọc.” Không chuyển thành lời khuyên, khả năng giao tiếp kém, đạo đức, nghề, thu nhập hoặc tương lai.
- Biên tập: đoạn phối hợp riêng, nhãn “Nhận định phối hợp có điều kiện”. Không tự ẩn R12/R13: xét đoán/ăn nói đanh thép và mưu trí/quyền biến khác ý với mức thận trọng. Ghi rõ ba đoạn có phạm vi khác nhau; không hòa giải hay coi đoạn tổ hợp thay mọi ý nghĩa nền. Các dữ kiện ngữ cảnh giống nhau vẫn xuất một lần theo template hiện có; căn cứ mỗi claim giữ đầy đủ.
- Locator: PDF89 / trang in89, §4.2.10 Phú giải, mục Cự–Cơ gặp Lộc Tồn; nguồn đã kiểm lớp chữ và ảnh09/10/2026. Không có bảng trạng thái mới. Chưa duyệt chuyên môn/quyền nội dung.


## Triển khai và bài đọc thực tế

- R20@0.1.0 vào cùng catalog `interpretation-1.11.0`, draft/review=null; evaluator giữ nguyên. Derivation `1.10.0` chỉ thêm nhóm địa chi xác định Mão/Dậu, không tính sao hoặc đo mức tốt/xấu. Template `1.6.0`, formatter `1.5.0`, sample catalog `content-matrix-1.5.0`. Không có bảng trạng thái mới.
- R12/R13 giữ nguyên; R20 ở đoạn riêng sau hai chú giải nền. Không ẩn hai đoạn vì khác nghĩa, không tự ghép hoặc giải quyết khác chiều. Ghi chú phạm vi gần R20 không phải một claim tính cách mới. Dữ kiện ngữ cảnh trùng được in một lần; căn cứ mỗi claim giữ riêng.
- Căn cứ kỹ thuật nay chỉ liệt kê bảng nguồn mà requiredFacts của rule thực sự sử dụng; R20 có sourceTables={} vì không tra bảng. Trang thực thi lấy số rule từ catalog thay tiêu đề “Chín rule” cũ. Không sửa giao diện khách hoặc phát hành draft.
- Mẫu mới `vn-co-cu-loc`: sinh giả lập 01/03/2001 lúc12:00, nữ, Hà Nội, profile `vn-utc7-midnight-v1`; Mệnh Dậu, Cơ/Cự chính tinh, Lộc Tồn phụ tinh. Cự Môn còn có Hóa Lộc nhưng **Hóa Lộc không phải điều kiện thay Lộc Tồn**. Engine cũng ghi Hỏa Tinh và Tuần Không: chỉ là ngữ cảnh chưa tổng hợp, không thêm ngoại lệ hoặc tác động phỏng đoán.
- Script tìm `scripts/find-tanbien-co-cu.ts`: đọc mẫu engine sẵn có trước; sau đó giới hạn tháng3 của2001/2005, ngày1–31, giờ chẵn0–22; dừng khi có mẫu. 26 trường hợp được kiểm tra; đã chạy `--verify`, trùng input/resultId. Snapshot đóng băng `lib/internal-review/engine-samples/tanbien-co-cu.json`; không tạo đơn. Chỉ chứng minh toàn luồng phần mềm, không xác nhận engine độc lập.

| Ca | Loại dữ liệu | R20 | Nội dung xuất |
|---|---|---|---|
| vn-co-cu-loc | Engine giả lập thật, Mệnh Dậu Cơ–Cự–Lộc | matched | R12/R13 riêng + R20 phối hợp |
| vn-jumen | Snapshot cũ, Cơ–Cự Dậu, minorStars=[] | not-matched | R12/R13 giữ nguyên; không sinh kết luận ngược |
| vn-0 | Engine cũ, Cơ–Âm tại Mệnh Thân | not-matched | R13/R16 riêng; không gán Cơ–Cự |
| syn-co-cu-missing-minor | Clone kỹ thuật bỏ minorStars; resultId ghi synthetic, không phải lá số engine hợp lệ | unknown | Không xuất R20; missing-facts chỉ rõ danh sách phụ tinh |
| Đổi một sao sang cung khác / đổi Dần / chỉ Hóa Lộc | Fixture kỹ thuật trong test | not-matched | Không xuất R20 |
| Đổi chi sang Mão nhưng đủ ba sao | Fixture kỹ thuật trong test, không gọi là mẫu engine | matched | Kiểm logic nhánh Mão của nguồn; chưa thêm mẫu engine riêng tại Mão |

## Bản xuất và đường dẫn xem thử

- [Bản duyệt văn19mẫu](../exports/tanbien-reading-review.md), [bản đầy đủ](../exports/tanbien-reading-examples.md), [JSON cùng lần xuất](../exports/tanbien-reading-examples.json).
- [Trước/sau cùng snapshot, từng câu mới → rule → nguồn, ca khớp/không/unknown](../exports/tanbien-co-cu-review.md); [JSON ca thử có nhãn nguồn gốc](../exports/tanbien-co-cu-cases.json). Cùng runId/generatedAt với bản xuất bài; fixture kỹ thuật chỉ ở hồ sơ ca thử, không đưa vào danh sách engine/báo cáo khách.
- Archive1.5.0 giữ nguyên trong `exports/tanbien-reading-v1.5-archive/{examples.md,examples.json,review.md}`. Không tính lại thay snapshot đã lưu.
- Xem `http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-co-cu-loc`, cần quyền nội bộ hiện có. Chọn `vn-jumen` rồi **Đối chiếu rule** để xem cùng hai sao nhưng thiếu Lộc Tồn. **Chi tiết thực thi** hiển thị matched/not-matched/unknown và đường dẫn căn cứ. Không chia sẻ khóa, không dùng link beta.

## Kiểm thử thực tế

- 190/190 test,14file đạt; typecheck đạt; production build Next15.5.27 đạt. Log `docs/evidence/tanbien-co-cu/{unit,typecheck,build}.txt`.
- Production E2E cô lập ở3005, DB test riêng, Chrome,1worker,0retry: **3/3** qua. Chạy hai file `tanbien-reading.spec.ts` và `editorial-preview.spec.ts`; không chạy lại suite chẩn đoán rate-limit/manifest. Có kiểm nội bộ chưa đăng nhập, mẫu cũ, đổi mẫu mớiA→B→A, reload/Back, căn cứ/trace, overflow360/390px. Log `docs/evidence/tanbien-co-cu/e2e.txt`.
- Ảnh `docs/evidence/tanbien-co-cu/mobile/co-cu-{reading,evidence,trace}-{360,390}.png`. Đã trực tiếp mở ảnh bài360 và căn cứ390, đọc rõ, không tràn; hai chiều rộng/trace còn kiểm bằng E2E. Không có khóa/token trong ảnh.
- SHA-256 **43tệp** không đổi: engine/lịch, evaluator, bảng trạng thái, DEMO cố định, các snapshot mẫu cũ, archive và manifest fix. So 18snapshotId, nội dung claim và định nghĩa R01–R19 cũ trong archive với lần xuất mới: không đổi. `docs/evidence/tanbien-co-cu/preservation.json`. Không thao tác DB khách; không tuyên bố audit checksum toàn DB khách. Các script tìm mẫu cũ cũng tái chạy verify thành công.
- Tái hiện: `node --import tsx scripts/find-tanbien-co-cu.ts --verify`; xuất bài bằng `scripts/export-tanbien-reading-examples.ts` rồi `scripts/export-tanbien-co-cu-review.ts` (tsx). Test dùng config `playwright.stability.config.ts`, `E2E_ORIGIN=http://localhost:3005`, env test riêng. Không tắt bảo mật hoặc đổi ngưỡng rate limit.

## Phạm vi kết luận

Nguồn có ý nghĩa riêng cho tổ hợp, nhưng đoạn triển khai lần này là **nhánh có thêm Lộc Tồn**, không phải lời luận mọi Cơ–Cự. Nó bổ sung khía cạnh thận trọng trong lời nói, khác với xét đoán/ăn nói đanh thép của R12 và mưu trí/quyền biến của R13. Những điều kiện can sinh, giới, absence Tuần/Triệt xung chiếu, Song Hao hội hợp và bất nhất địa chi Dần ở bản sách vẫn chờ; không nới điều kiện để vn-jumen nhận bài mới.

Về kỹ thuật, có thể tái dùng evaluator AND/membership, facts cấu trúc, trace, formatter, version và mẫu engine; không cần evaluator mới. Mỗi tổ hợp khác vẫn phải đọc nguồn riêng, xác định quan hệ, điều kiện và ngoại lệ. Không suy nội dung từ phép cộng ý nghĩa sao. Đây là kiểm thử phần mềm và đối chiếu văn bản; **chưa được duyệt chuyên môn**, quyền nguồn chưa xác minh, chưa phải Tổng quan toàn lá số. Beta/thanh toán/email thật không bật.


---

## Template 1.5.0 — bàn giao 09/10/2026

Catalog `interpretation-1.10.0`; derivation `1.9.0`; formatter `1.4.0`; sample catalog `content-matrix-1.4.0`. R17/R18/R19 phiên bản `0.1.0`, draft, review=null. Ba bảng `tanbien-tianliang-state`, `tanbien-qisha-state`, `tanbien-pojun-state` đều `1.0.0`, đối chiếu đủ 12 chi trên ảnh trang 38. Bảng sách độc lập brightness engine.

## Đặc tả đợt 09/10/2026 — Thiên Lương, Thất Sát, Phá Quân

Đọc trực tiếp PDF/trang in 38–39, 92–101; đối chiếu ảnh 38, 92, 95, 98, 100, 101. Các trang PDF và trang in trùng nhau tại các vị trí này. Nguồn: Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*, PDF chủ dự án cung cấp. Quyền nội dung chưa xác minh; không có phê duyệt chuyên môn.

| Rule đã triển khai | Đoạn nguồn / điều kiện | Phạm vi biên soạn | Chưa triển khai / lý do |
|---|---|---|---|
| R17 | Tr.92 §4.2.12 Đại cương: Lương thủ Mệnh; đoạn tiếp yêu cầu miếu/vượng/đắc. Bảng tr.38 §3.12. | Khoan hòa, nhân hậu, ưa việc từ thiện; kiểm tra ba trạng thái trước khi xuất. | Không dùng hình tướng, tuổi thọ, bảo đảm sức khỏe, tài sản. Tr.93–95: hội hợp, can sinh, Cơ–Nguyệt–Đồng–Lương chưa đặc tả; Lương–Xương có khác biệt miếu/vượng ở đề và miếu ở lời giải, để chờ. |
| R18 | Tr.95 §4.2.13 Đại cương: Sát thủ Mệnh miếu/vượng/đắc. Bảng tr.38 §3.13. | Can đảm, cương nghị, hiếu thắng; chú giải nền, không suy bạo lực/nghề. | Tr.95–98: nhánh can sinh, sao hội hợp, vận chưa đặc tả. Loại dự đoán tai họa/tử vong và phán xét cá nhân. Không coi danh sách ngoại lệ rỗng là không có ngoại lệ. |
| R19 | Tr.98 §4.2.14 Đại cương: Phá thủ Mệnh miếu/vượng/đắc. Bảng tr.38, đề Phá Quân §3.14. | Ưa hoạt động, thích đi xa, hiếu thắng. Dự án **thu hẹp** vào một chính tinh tại Mệnh; phụ tinh không làm mất điều kiện này. | Tr.100 Phú giải “nhất diệu” nói riêng đơn thủ ở sáu chi; không dùng đoạn phán xét đó làm lời nền hoặc đổi thành lời khen. Không nhận định đồng cung Tử Vi/khác. Tr.98 nhánh can/chi lặp và khó xác định; tr.99–101 hội hợp, Lộc/Mã, vận chưa đặc tả. Loại phán xét đạo đức/giới, bệnh/tử vong và dự đoán tuyệt đối. |

Cả ba là draft, review=null. Điều kiện sao đúng Mệnh và bảng nguồn được đánh giá độc lập nhãn engine. Thiếu danh sách/địa chi/lookup là unknown khi các điều kiện đã biết không loại rule. R19 cần danh sách chính tinh đầy đủ hợp lệ; không coi thiếu là rỗng. Không thêm ngoại lệ suy từ tên sao; các đoạn nguồn chưa rõ không được dùng để phát sinh nhận định.

### Ngữ cảnh nguồn và quyết định chưa triển khai

- Tr.38 ghi Thất Sát gặp Kình và Phá Quân gặp Lương/Hỷ/Lộc như các điều chỉnh; lời về tai họa hoặc giảm hung không được chuyển thành dự đoán cá nhân. Phạm vi “gặp” chưa được đặc tả, không tự thay bằng đồng cung/tam hợp. Không dùng các câu này như điều kiện loại trừ ngầm của đoạn nền.
- Tr.93–95: các nhánh Thiên Lương phụ thuộc can sinh, sao hội hợp, Lương–Xương, Cơ–Nguyệt–Đồng–Lương còn chờ. Không chuyển lời giải trừ bệnh/tai họa thành bảo đảm sức khỏe hoặc tuổi thọ.
- Tr.95–98: Thất Sát có nhánh theo can Giáp/Canh/Đinh/Kỷ, hãm Mão/Dậu với Ất/Tân, các sao sáng/tối, Hình và vận. Chưa đặc tả chúng; đoạn chọn chỉ là nền miếu/vượng/đắc, không xuất dự báo thăng trầm, nghề võ hoặc bạo lực.
- Tr.98: Phá Quân có đoạn can/chi lặp và lẫn loại dữ kiện; ảnh vẫn không đủ để quyết định một bản hiệu đính. Không tự sửa câu. Tr.100 “nhất diệu” nói riêng đơn thủ; không lấy đoạn này làm nguồn cho ý nghĩa sáng tạo/khởi nghiệp, cũng không phát hành phán xét bất lợi về người đọc. Tr.101 các nhánh Ngọ/Lộc/Thiếu Dương, Thìn/Tuất/Khoa/Tuần còn chờ phạm vi áp dụng. Bảng tr.38 dùng đúng đề Phá Quân §3.14; không dựa vào cách đánh số mục kế tiếp để sửa nguồn.
- Chưa triển khai các nhánh hãm và các kết luận về đạo đức/giới, thân thể, bệnh/tử vong, tài sản, nghề cụ thể hay sự kiện chắc chắn. Việc bỏ chúng không tạo ra một lời khen thay thế. Quyền nội dung và phê duyệt chuyên môn vẫn chưa có.

### Mẫu và so sánh trước/sau

Giữ 13 mẫu cũ; thêm ba snapshot engine giả lập và đưa hai mẫu Tử Vi–Phá Quân sẵn có vào bản xuất đối chứng. Không tạo đơn/giao dịch. `scripts/find-tanbien-last.ts` tìm trong mẫu engine cũ trước, sau đó giới hạn 01–31/01/2000, giờ chẵn 0–22; dừng khi đủ ba trường hợp. 86 phép tính, đã tái chạy `--verify` trùng input/resultId. Dữ liệu đóng băng ở `lib/internal-review/engine-samples/tanbien-last.json`. Không gọi đây là xác nhận engine độc lập.

| Mẫu | Dữ kiện engine | Trước | Sau | Phần chưa có |
|---|---|---|---|---|
| demo-wuqu-tianfu | Mệnh tại Tý. Chính tinh tại Mệnh: Vũ Khúc, Thiên Phủ. Thân cư Quan Lộc tại Thìn. Quan Lộc tại Thìn. Chính tinh tại Quan Lộc: Tử Vi, Thiên Tướng. Tài Bạch tại Thân. Tài Bạch có một chính tinh là Liêm Trinh. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r01, tanbien.r03, tanbien.r02, tanbien.r04, tanbien.r05, tanbien.r06, tanbien.r07 | Các mục có đoạn cục bộ; vẫn chưa tổng hợp toàn lá số |
| vn-12 | Mệnh tại Dần. Chính tinh tại Mệnh: Tử Vi, Thiên Phủ. Thân cư Mệnh tại Dần. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r03, tanbien.r08 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-20 | Mệnh tại Tuất. Mệnh có một chính tinh là Vũ Khúc. Thân cư Tài Bạch tại Ngọ. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r01, tanbien.r04 | Công việc; Tài chính |
| vn-2 | Mệnh tại Mùi. Danh sách chính tinh tại Mệnh được ghi rỗng. Thân cư Phúc Đức tại Dậu. | Giữ nguyên tập claim và nguyên văn 1.4.0 | Không khớp | Cách hành động và cân nhắc; Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-4 | Mệnh tại Ngọ. Mệnh có một chính tinh là Tử Vi. Thân cư Quan Lộc tại Tuất. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r08 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-6 | Mệnh tại Tỵ. Mệnh có một chính tinh là Thiên Tướng. Thân cư Thiên Di tại Hợi. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r09 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-lianzhen | Mệnh tại Thìn. Chính tinh tại Mệnh: Liêm Trinh, Thiên Phủ. Thân cư Quan Lộc tại Thân. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r03, tanbien.r10 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-tanlang | Mệnh tại Thân. Mệnh có một chính tinh là Tham Lang. Thân cư Tài Bạch tại Thìn. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r11 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-jumen | Mệnh tại Dậu. Chính tinh tại Mệnh: Thiên Cơ, Cự Môn. Thân cư Thiên Di tại Mão. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r12, tanbien.r13 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-0 | Mệnh tại Thân. Chính tinh tại Mệnh: Thiên Cơ, Thái Âm. Thân cư Mệnh tại Thân. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r13, tanbien.r16 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-16 | Mệnh tại Tý. Mệnh có một chính tinh là Thái Dương. Thân cư Quan Lộc tại Thìn. Tài Bạch tại Thân. Danh sách chính tinh tại Tài Bạch được ghi rỗng. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r07 | Cách hành động và cân nhắc; Học hỏi / sự chủ động; Công việc |
| vn-taiyang | Mệnh tại Ngọ. Mệnh có một chính tinh là Thái Dương. Thân cư Mệnh tại Ngọ. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r14 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-tiantong | Mệnh tại Tỵ. Mệnh có một chính tinh là Thiên Đồng. Thân cư Phúc Đức tại Mùi. | Giữ nguyên tập claim và nguyên văn 1.4.0 | tanbien.r15 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-tianliang | Mệnh tại Mão. Chính tinh tại Mệnh: Thái Dương, Thiên Lương. Thân cư Thiên Di tại Dậu. | Chưa có mẫu trong bản xuất; R17 chưa tồn tại | tanbien.r14, tanbien.r17 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-qisha | Mệnh tại Ngọ. Mệnh có một chính tinh là Thất Sát. Thân cư Mệnh tại Ngọ. | Chưa có mẫu trong bản xuất; chưa có rule nền Tân Biên này | tanbien.r18 | Học hỏi / sự chủ động; Công việc; Tài chính |
| vn-pojun | Mệnh tại Tý. Mệnh có một chính tinh là Phá Quân. Thân cư Mệnh tại Tý. | Chưa có mẫu trong bản xuất; chưa có rule nền Tân Biên này | tanbien.r19 | Học hỏi / sự chủ động; Công việc; Tài chính |
| engine-combo | Mệnh tại Mùi. Chính tinh tại Mệnh: Tử Vi, Phá Quân. Thân cư Tài Bạch tại Mão. | Mẫu đã có, chưa đưa vào bản xuất Tân Biên; không có claim Tân Biên | Không khớp | Cách hành động và cân nhắc; Học hỏi / sự chủ động; Công việc; Tài chính |
| engine-exception | Mệnh tại Mùi. Chính tinh tại Mệnh: Tử Vi, Phá Quân. Thân cư Tài Bạch tại Mão. | Mẫu đã có, chưa đưa vào bản xuất Tân Biên; không có claim Tân Biên | Không khớp | Cách hành động và cân nhắc; Học hỏi / sự chủ động; Công việc; Tài chính |

13 snapshotId cũ và toàn bộ định nghĩa R01–R16 trong bản xuất cũ trùng bản mới; không sửa bài DEMO hoặc snapshot. Hai mẫu Tử Vi–Phá Quân ở Mùi: R08 không khớp trạng thái trong phạm vi hiện có; R19 không khớp số chính tinh. Không dùng lời luận ngược để lấp chỗ trống. Mẫu Nhật–Lương có R14 và R17 là hai chú giải riêng, chưa phải rule tổ hợp.

### Bản xuất và URL

- [Bản duyệt văn gọn](../exports/tanbien-reading-review.md): 18 mẫu, không đưa trace vào bài chính.
- [Bản đầy đủ](../exports/tanbien-reading-examples.md), [JSON](../exports/tanbien-reading-examples.json): cùng runId/thời điểm; Markdown ghi SHA-256 JSON.
- Bản 1.4.0 lưu nguyên byte trong `exports/tanbien-reading-v1.4-archive/`; archive trước đó giữ nguyên.
- URL hiện hành: `http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-tianliang`. Chọn `vn-qisha`, `vn-pojun`, `engine-combo`, `engine-exception` qua ô mẫu rồi bấm **Đối chiếu rule**. Cần phiên nội bộ hiện có; không chia sẻ khóa. Xem **Chi tiết thực thi** để thấy not-matched/unknown, không coi chúng là kết luận về người đọc.
- Production test riêng: cùng đường dẫn trên cổng 3005, phiên đăng nhập riêng; không tái dùng cookie giữa môi trường. Không bật beta.

### Kiểm thử thực tế và giới hạn bảo toàn

- 184/184 test trong 13 file đạt. Ca mới: sao đúng/sai cung, trạng thái không đạt, thiếu địa chi/danh sách/lookup, nhãn engine khác bảng sách; R19 thêm chính tinh bị loại, thêm phụ tinh vẫn khớp; Tử Vi–Phá Quân engine không khớp; draft không đi vào customer. Fixture thay sao chỉ là fixture kỹ thuật.
- Kiểm tra URL hiện hành 3000: trang chủ HTTP 200; `/beta` vẫn hiện “Đợt đọc thử chưa được mở”; preview không có phiên vẫn yêu cầu quyền nội bộ (các trang trạng thái dùng HTTP 200).
- Typecheck đạt. Production build cô lập đạt (`next build`, Next 15.5.27). E2E 5/5, một worker, **0 retry**, Chrome production tại 3005, 360px/390px: mẫu mới, mở căn cứ/trace, đổi mẫu, reload/back, quyền nội bộ. Kế thừa kiểm tra rate limit trong bộ hiện có; không chỉnh cơ chế hoặc threshold. Đây là bằng chứng một lượt trong phạm vi này, không bảo đảm mọi lỗi gián đoạn đã biến mất.
- Lượt unit đầu có 4 lỗi kỳ vọng cũ: tổng số sample/rule tăng và fixture Phá/Sát nay khớp chú giải nền Tân Biên. Đã cập nhật kỳ vọng phân biệt chú giải thuật ngữ cũ với claim nền mới; giữ log `unit-initial.txt`. Không sửa evaluator để ép test qua.
- Log: `docs/evidence/tanbien-last/{unit,typecheck,build,e2e}.txt`; `preservation.json`: **37 tệp** hash trước/sau không đổi (engine/calendar, DEMO, snapshot mẫu cũ, archive, manifest fix). 13 mẫu cũ giữ snapshotId và định nghĩa rule cũ. Không đọc/ghi DB khách, không khẳng định đã checksum toàn DB/báo cáo khách; kiểm thử chỉ dùng DB cô lập có sẵn.
- Ảnh ở `docs/evidence/tanbien-last/mobile/`. Đã mở và kiểm trực tiếp ảnh bài Thiên Lương 360px và căn cứ Phá Quân 390px: đọc được, không tràn ngang; các mẫu/chiều rộng còn lại kiểm tự động và có ảnh. Nội dung chính/giới hạn/căn cứ tách riêng, trace mặc định thu gọn.
- Kiểm tra phần mềm và đối chiếu văn bản nguồn là hai việc riêng. **Chưa có phê duyệt chuyên môn**. Bộ Tổng quan mới cung cấp các chú giải cục bộ có điều kiện và căn cứ, chưa tổng hợp tương tác toàn lá số, chưa đủ làm báo cáo hoàn chỉnh hoặc điều kiện mở bán.


## Lịch sử — bàn giao template1.4.0 — nội dung nền bốn sao

Catalog **interpretation-1.9.0**, derivation **1.8.0**, formatter **1.3.0**. Thêm `tanbien.r13` (Thiên Cơ), `r14` (Thái Dương), `r15` (Thiên Đồng), `r16` (Thái Âm), tất cả0.1.0, **chú giải nền**, draft, review=null. R01–R12 giữ phiên bản/nội dung; evaluator không đổi. Bốn bảng trạng thái riêng1.0.0, mỗi bảng12chi đối chiếu ảnh sách: `tanbien-tianji-state` (35 §3.6), `tanbien-taiyang-state` (35 §3.5), `tanbien-tiantong-state` (34 §3.3), `tanbien-taiyin-state` (36 §3.8). Không đọc brightness engine thay bảng.

### Bài đọc và thay đổi biên tập

- Giải thích Thiên Không không đồng nhất Địa Không/chữ Không chuyển vào căn cứ, vẫn có path và nằm trong JSON/fullMarkdown. Cạnh bài chỉ còn ghi chú dữ kiện thực tế + ảnh hưởng chưa tổng hợp. Ghi chú ngữ cảnh giống nhau xuất một lần trong cùng mục; căn cứ từng claim vẫn giữ đầy đủ. Ghi chú thời gian Nhật/Nguyệt vẫn cạnh chính đoạn đó.
- Bản duyệt văn giảm dòng trắng, danh sách nền dùng các dòng liền nhau; không trace. Chỉ dùng ‘Chưa có nội dung cho…’ với chủ đề trống, tách câu ‘Phạm vi hiện tại: các nhận định cục bộ; chưa tổng hợp toàn lá số.’
- Giữ9mẫu cũ; xuất thêm vn-0, vn-16 từ mẫu có sẵn và2mẫu engine giả lập mới. Tổng13bản đọc, không gọi đây là13lá số được kiểm chứng chuyên môn.

| Mẫu | Dữ kiện xác minh | Trước → sau | Phần chưa có |
|---|---|---|---|
|demo-wuqu-tianfu|Vũ–Phủ tại Tý|R01–R07 giữ nguyên|Chưa tổng hợp toàn lá số; tách câu phạm vi khỏi chủ đề trống |
|vn-12|Tử–Phủ tại Dần|R03,R08 giữ nguyên|Chưa có luận tổ hợp |
|vn-20|Vũ Khúc, Quyền tại Mệnh|R01,R04 giữ nguyên|Chủ đề học hỏi không tự thêm |
|vn-2|Mệnh không chính tinh|0 →0|Không lấy nghĩa đối cung để lấp bài |
|vn-4|Tử Vi Ngọ; Triệt Lộ|R08 giữ nguyên|Ảnh hưởng Triệt chưa tổng hợp |
|vn-6|Thiên Tướng Tỵ; Hỏa Tinh, Thiên Không|R09 giữ nguyên|Giải thích tên Không chuyển vào căn cứ |
|vn-lianzhen|Liêm–Phủ Thìn; Thiên Không|R03,R10 giữ nguyên|Giải thích tên Không chuyển vào căn cứ |
|vn-tanlang|Tham Lang Thân|R11 giữ nguyên|Chưa tổng hợp các yếu tố đi cùng |
|vn-jumen|Cơ–Cự Dậu|R12 → R12,R13|Hai chú giải riêng; Tuần ghi một lần ở bài chính, căn cứ cả hai còn đủ |
|vn-0|Cơ–Âm Thân|Mẫu có sẵn, trước không có claim Tân Biên →R13,R16|Không có luận Cơ–Âm; mức thuận theo ngày/đêm/ngày âm chưa xét |
|vn-16|Thái Dương Tý, hãm theo sách|Mẫu có sẵn, R07 ở Tài Bạch → vẫn chỉR07|R14 condition-false đúng phạm vi; không coi đoạn tài chính là luận Thái Dương |
|vn-taiyang|Nhật Ngọ, miếu theo sách|Mẫu mới, catalog cũ không có →R14|Chưa đánh giá ngày/đêm và các kết quả phụ thuộc thời gian |
|vn-tiantong|Đồng Tỵ, đắc theo sách|Mẫu mới, catalog cũ không có →R15|Chưa tổng hợp tuổi Đinh/Canh hoặc hội hợp |

Tất cả nhận định mới là chú giải nền có điều kiện trạng thái; **không có rule tổ hợp mới**. Không đưa chú giải gần nghĩa Toàn Thư vào chế độ Tân Biên.

### Mẫu và bảo toàn

Đã duyệt các mẫu engine hiện có trước khi tìm. Script `scripts/find-tanbien-four.ts` duyệt hữu hạn01–31/01/2000, giờ0..22 bước2, dừng đủ2mẫu: Thiên Đồng ngày03/01/2000 14h, Thái Dương ngày04/01/2000 12h (đều đầu vào giả lập). Tổng57lần tính kể cả lượt kiểm mẫu cũ. Lưu input/profile/engine version/fullsnapshot tại `lib/internal-review/engine-samples/tanbien-four.json`; bộ chọn đọc clone snapshot đã chốt. `--verify` tái lập57lần chỉ đọc, cùngresultId. Script tìm ba sao trước được giới hạn bỏ qua hai mẫu mới để giữ tập tìm ban đầu; kiểm lại vẫn28lần/cùngsnapshot. Không tạo đơn/giao dịch, không chỉnh danh sách sao.

Bản1.3.0 đã lưu byte-for-byte trong `exports/tanbien-reading-v1.3-archive/{examples.md,examples.json,review.md}`; các archive1.0–1.2 và DEMO cố định không đổi. Đối chiếu riêng9snapshotId cũ và nguyên văn claim cũ từ archive; chỉ bổ sung R13 ở vn-jumen. Không ghi DB hiện hành; không khẳng định đã audit hoặc hash toàn DB khách.

### Kiểm tra đã chạy — đợt1.4.0

- `typecheck` đạt; production `next build` đạt trên bản sao `.local/json-stability/app`; Next15.5.27/Node20. Cảnh báo nhiều lockfile ở bản sao thử có sẵn; không sửa manifest hoặc cấu hình dự án để tắt cảnh báo.
- **175/175 test,12file**: các rule mới đúng/sai cung, trạng thái nguồn, missing/unknown, nhãn engine không thay lookup; khách không nhận draft; phân biệt chú giải riêng/tổ hợp; ghi chú thời gian vẫn hiện; alias Không chỉ nằm trong căn cứ; xuất MD/JSON/duyệt văn cùngrunId; hồi quy các bộ trước. Không phải xác minh khả năng dự đoán.
- **5/5 E2E, retries=0**, production localhost:3005, DB thử55443, Chrome, một worker; không đăng nhập lặp cho từng thao tác. Kiểm13mẫu chọn đọc (vn-jumen mở riêng cảR12/R13), URL/snapshot/nội dung, căn cứ/trace, quyền nội bộ, Reload/Back và lỗi xác thực sẵn có,360/390px không tràn cấp trang. Không phát hiện lỗi manifest tái xuất trong các ca này; không mở lại đợt chẩn đoán manifest.
- Hash trước/sau **33tệp không đổi**;9resultId cũ không đổi, toàn bộ claimtext cũ còn nguyên; chỉ vn-jumen thêmR13. Chi tiết `docs/evidence/tanbien-four/preservation.json`. Không đọc/ghi DB thật để tuyên bố đã audit toàn DB; tác vụ chỉ dùng file mẫu và DB test.
- Log: `docs/evidence/tanbien-four/{unit,typecheck,build,e2e,search}.txt`. Ảnh: thư mục `mobile/`; đã mở xem trực tiếp `vn-0-tanbien.r16-reading-360.png`, `vn-tiantong-tanbien.r15-390.png`, `vn-jumen-tanbien.r13-reading-390.png`. Các ảnh còn lại được chụp và kiểm overflow bởi E2E.

Tái chạy unit bằng `node node_modules/vitest/vitest.mjs run tests/tanbien-four.test.ts tests/tanbien-three.test.ts tests/tanbien.test.ts tests/tanbien-presentation.test.ts tests/tanbien-menh-expansion.test.ts tests/content-coverage.test.ts tests/content-matrix.test.ts tests/interpretation.test.ts tests/preview-rules.test.ts tests/reading.test.ts tests/editorial-preview.test.ts tests/combination.test.ts`.

Môi trường E2E vẫn dùng harness hiện có (`node scripts/reading-stability.mjs prepare`, `build`, `start`; phải dừng riêng3005 trước prepare/build). Chạy `E2E_ORIGIN=http://localhost:3005 E2E_ARTIFACT_DIR=docs/evidence/tanbien-four/mobile node --env-file=.local/json-stability/test.env node_modules/@playwright/test/cli.js test -c playwright.stability.config.ts`. Không in nội dungenv và không dùng key/origin website. Bộ test kế thừa rate-limit không bị chỉnh ngưỡng.

**Ba mức kết luận:** phần mềm đã kiểm trong phạm vi trên; văn bản/ảnh sách đã đối chiếu trực tiếp theo các trang đã ghi; **chuyên môn chưa phê duyệt**, quyền nguồn pending. Phần ngày/đêm, ngày âm, hội hợp/án ngữ chưa rõ vẫn không có rule xuất nhận định tương ứng.

### Xem và tái xuất

`http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-0` (cần phiên nội bộ hiện có). Đổi bộ chọn sang vn-jumen, vn-16, vn-taiyang, vn-tiantong hoặc9mẫu cũ; `view=rules` cho trace. Không cung cấp key/token trong tài liệu. Beta/payment/email thật vẫn không bật.

- `exports/tanbien-reading-review.md`: bản duyệt văn13mẫu.
- `exports/tanbien-reading-examples.md` + `.json`: chungrunId/thời điểm, Markdown dẫn file JSON thật và SHA256; có đủ căn cứ, phần chưa khớp/unknown.
- Tái xuất: `node --import tsx scripts/export-tanbien-reading-examples.ts`.
- Tái tìm chỉ đọc: `node --import tsx scripts/find-tanbien-four.ts --verify`.


## Đợt Thiên Cơ / Thái Dương / Thiên Đồng / Thái Âm — đặc tả trước triển khai

Đọc trực tiếp PDF chủ dự án cung cấp, Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên. Trang PDF=trang in tại các vị trí này. Đã xem ảnh34,35,36,62,68,74,78; đọc lớp chữ62–64,68–76,78–80 để giữ ngữ cảnh trước/sau. Không lấy nội dung Toàn Thư/iztro làm bằng chứng Tân Biên; quyền nguồn chưa xác minh.

| Rule dự kiến / nội dung nguồn | Điều kiện nguồn; dữ kiện bắt buộc | Phạm vi dự án / diễn giải | Điều chỉnh, ngoại lệ và phần chưa đặc tả | Nguồn; quyết định |
|---|---|---|---|---|
| R13 Thiên Cơ: mưu trí, biết quyền biến | Cơ là chính tinh Mệnh; miếu/vượng/đắc theo bảng35 §3.6 | Chú giải nền về mưu trí và sự linh hoạt trong xử lý tình huống; không suy trí thông minh khách quan/nghề | Các đoạn Song Hao, Tả/Hữu/Lộc/Hình/Y/Quang/Quý, Tuần/Triệt, Sát đồng cung có điều kiện riêng; chưa xuất. Không lấy lời phán xét đạo đức ở phú thay thành phẩm chất tích cực |74 §4.2.6 Đại cương, đọc75–76; triển khai đoạn nền, không tổ hợp |
| R14 Thái Dương: thẳng thắn, cương nghị, hơi nóng nảy | Nhật là chính tinh Mệnh; miếu/vượng/đắc theo bảng35 §3.5 | Chỉ mô tả nền trong đoạn đầu68; không kết luận thuận lý, rực rỡ, tài lộc hoặc sức khỏe | Đoạn sau riêng về sinh ban đêm khi miếu/vượng; bảng35 nêu sinh ban ngày thuận lý. Chưa đặc tả ranh giới ngày/đêm; không có rule phụ thuộc thời gian được xuất. Tuần/Triệt, Kỵ và hội hợp chưa tổng hợp |68 §4.2.5, đọc69–73; triển khai nền, chặn kết luận thời gian bằng cách không triển khai chúng |
| R15 Thiên Đồng: khoan hòa, nhưng thiếu quả quyết/bền chí, hay đổi ý và công việc | Đồng là chính tinh Mệnh; miếu/vượng/đắc theo bảng34 §3.3 | Giữ cả hai chiều của đoạn nền, không suy năng lực trí tuệ hoặc dự báo | Tỵ/Hợi với tuổi Đinh/Canh, hội hợp Xương/Khúc hoặc Sát/Hình là đoạn khác; chưa xuất kết luận cuộc đời. Trang63 có câu gọi các sao trợ là mờ ám và đoạn nữ mệnh diễn đạt bất nhất: không sửa sách bằng suy đoán |62 §4.2.3 Đại cương, đọc63–64; triển khai nền, không tổ hợp |
| R16 Thái Âm: khoan hòa, ưa văn chương/mỹ thuật | Âm là chính tinh Mệnh; miếu/vượng/đắc theo bảng36 §3.8 | Chỉ đoạn nền đầu78; không suy năng khiếu cụ thể, nhà đất hoặc toàn mỹ | Bảng36: đêm, ngày1–15; trang78: đêm, nhất là10–20. Chưa hòa giải hai phạm vi, chưa định nghĩa đêm hoặc dùng trạng thái thay giờ. Tuần/Triệt, Kỵ không bị giả định vắng mặt |78 §4.2.8, đọc79–80; triển khai nền; phần thời gian/hội hợp chưa triển khai |

**Ranh giới lựa chọn:** Đoạn đầu68/78 gắn mô tả nền với ba trạng thái, không đặt ngày/đêm làm tiền đề của chính các nét đã chọn. Các đoạn sau bàn mức thuận hoặc kết quả khác có tiền đề độc lập. Rule nền không được gọi là mức đánh giá tổng hợp và không xuất bất kỳ kết luận thuận lý/toàn mỹ nào. Chỉ khi triển khai loại kết luận đó mới được thêm dữ kiện thời gian với quy ước đã xác minh; không tự chọn6h/18h. Không thấy điều kiện mùa trong các đoạn đã đọc, không suy rằng toàn sách không có.

**Ngoại lệ:** Không có điều kiện loại trừ rõ ràng cho chính phần mô tả nền đã chọn được chuyển thành `exceptions` trong đợt này. Các đoạn riêng có ngoại lệ/điều chỉnh được giữ chờ, không lấy cảnh báo để xuất chúng thiếu điều kiện. Mọi rule draft, review=null; danh sách exceptions rỗng không chứng minh đã xét đủ.

**Mẫu đã kiểm trước khi lập trình:** vn-jumen có Cơ–Cự tại Dậu; vn-0 có Cơ–Âm tại Thân; vn-16 có Nhật tại Tý (**hãm theo sách**, không được nới R14 để mẫu có bài). Bộ engine hiện có không ghi Đồng tại Mệnh; sẽ tìm hữu hạn mẫu Đồng và một mẫu Nhật đáp ứng bảng nguồn, không sửa sao/không tạo đơn.


## Đợt Liêm Trinh / Tham Lang / Cự Môn — 08/10/2026

Template **1.3.0**, formatter **1.2.0**, catalog **interpretation-1.8.0**, derivation **1.7.0**. R10–R12 phiên bản0.1.0, đều `draft`, `review=null`; R01–R09 giữ0.3.0 và nguyên văn claim. Không thêm evaluator, AI, scoring hoặc cơ chế phát hành.

### Nguồn trực tiếp và đặc tả

Tác giả Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*, PDF do chủ dự án cung cấp. Trang PDF trùng trang in ở các vị trí dưới đây. Đọc lớp chữ và **trực tiếp xem ảnh trang34,37,60,81,86,91**; đọc lớp chữ34–37,55,60–62,81–83,86–91 theo phạm vi ghi dưới. Chỉ những trang đã đọc trong đợt này được liệt kê; biên bản R08/R09 trước còn dẫn90–92. Không suy quyền khai thác từ việc có PDF; quyền nguồn vẫn pending. Đây là đối chiếu văn bản, không phải phê duyệt chuyên môn.

| Nhận định → rule | Điều kiện nguồn / phạm vi triển khai | Ngoại lệ và phần chưa triển khai | PDF / trang in, mục | Trạng thái |
|---|---|---|---|---|
| Liêm: thẳng thắn, can đảm; nghiêm nghị, nóng nảy → R10 | Chính tinh Liêm Trinh tại Mệnh; miếu/vượng/đắc theo bảng riêng | Liêm–Xương/Khúc cần làm rõ cả hai hay một; Sát/Kỵ/Hình hội hợp chưa đặc tả; không dùng đoạn Tài Bạch của R06 |60 §4.2.2 Đại cương, đọc tiếp61–62; bảng34 §3.2 |Triển khai chú giải nền; chưa tổng hợp sao đi cùng |
| Tham: ưa hoạt động, tổ chức; muốn chóng xong, dễ chán/bỏ dở → R11 | Chính tinh Tham Lang tại Mệnh; miếu/vượng/đắc | Hỏa/Linh đắc địa và hội hợp chưa có phạm vi; đoạn Kỵ/Riêu có điều kiện khác nhau chưa hòa giải; không phát hành các phán xét đạo đức/giới hoặc dự đoán tuổi, bệnh |81 §4.2.9, đọc82–83; bảng37 §3.9 |Triển khai chú giải nền; không suy ‘tham lam’ từ tên sao |
| Cự: xét đoán, ăn nói đanh thép → R12 | Đoạn nguồn nêu miếu/vượng/đắc; **dự án chỉ chọn miếu/đắc** | Vượng Tý/Ngọ/Dần chưa triển khai; phần ngọc trong đá yêu cầu thêm Hóa Lộc hoặc Tuần/Triệt chưa đặc tả án ngữ; các đoạn năm sinh, hội hợp, phú chưa chuyển thành rule |86 §4.2.10 Đại cương, đọc87–90; bảng37 §3.10 |Triển khai chú giải nền; không suy năng lực giao tiếp khách quan hay nghề |

Ba bảng nguồn `tanbien-lianzhen-state`, `tanbien-tanlang-state`, `tanbien-jumen-state` phiên bản1.0.0 nhập đủ12chi từ ảnh trang34/37. Nguồn ảnh và lớp chữ được so trước khi nhập, không chép brightness engine. Điều kiện bắt buộc là danh sách chính tinh Mệnh và địa chi có lookup hợp lệ; thiếu một trong hai → unknown. Hãm/ngoài phạm vi đã biết → not-matched, không suy nhận định trái ngược. Chưa có ngoại lệ bắt buộc rõ ràng đối với **chính đoạn nền đã chọn** được nhập thêm; `exceptions=[]` không có nghĩa nguồn không có ngoại lệ.

### R08/R09: giới hạn đặt cạnh nhận định

Đã kiểm lại vn-4: Tử Vi tại Mệnh Ngọ, **Triệt Lộ** tại Mệnh. vn-6: Thiên Tướng tại Mệnh Tỵ, **Hỏa Tinh, Thiên Không** tại Mệnh. Trang55 đặt ý nghĩa trung hậu/thẳng thắn trong đoạn miếu/bình hòa; đoạn Tuần/Triệt bàn các kết quả khác, chưa xác định là mệnh đề phủ định chú giải nền đó. Trang90–91 tách đôn hậu/ăn mặc khỏi các đoạn Tuần/Triệt, Hình, Kình/Đà và kết quả khác. Vì vậy giữ trường hợp **B — chú giải nền**, không bịa điều kiện vắng Triệt/Hỏa để sửa evaluator và cũng không xuất các câu đánh giá cuộc đời của những đoạn điều chỉnh.

Formatter chỉ đặt dữ kiện đồng cung Mệnh đã lưu sát đoạn tương ứng; có evidence path riêng, không diễn giải tác động. Không suy phạm vi hai cung của Tuần/Triệt, không đổi Thiên Không thành Địa Không. Khi danh sách ngữ cảnh thiếu, nói chưa xác định đầy đủ; không biến thành không có sao. Các sao ở cung liên quan còn nằm trong hồ sơ mở rộng, không được dùng như ngoại lệ chưa có đặc tả.

### Mẫu và trước/sau

Mẫu mới là snapshot **engine tính từ đầu vào giả lập**, lưu tại `lib/internal-review/engine-samples/tanbien-three.json`. Tìm trong mẫu engine sẵn có trước, sau đó duyệt ngày01–31/01/2000 và giờ0..22 bước2, dừng khi đủ ba trường hợp; tổng28lần tính. Script `scripts/find-tanbien-three.ts` từ chối ghi đè file đã chốt. Không tạo đơn, không chỉnh sao. Việc tính lại trong test chỉ kiểm nhất quán, không phải đối chiếu chuyên môn độc lập.

| Mẫu | Dữ kiện Mệnh thực tế | Claim trước → sau | Thay đổi / thiếu |
|---|---|---|---|
|demo-wuqu-tianfu|Vũ Khúc–Thiên Phủ tại Tý|R01–R07 → giữ nguyên|Không thêm R10 Mệnh dù Liêm ở Tài Bạch |
|vn-12|Tử Vi–Thiên Phủ|R03,R08 → giữ nguyên|Hai chú giải riêng, không luận tổ hợp |
|vn-20|Vũ Khúc có Quyền|R01,R04 → giữ nguyên|Giữ tiêu đề Sự chủ động |
|vn-2|Mệnh không chính tinh|Không có → không có|Bộ Tân Biên này chưa có diễn giải phù hợp, không lấp bằng DEMO |
|vn-4|Tử Vi Ngọ + Triệt Lộ|R08 → giữ nguyên|Thêm ghi chú phần Triệt chưa tổng hợp ngay cạnh đoạn |
|vn-6|Thiên Tướng Tỵ + Hỏa Tinh, Thiên Không|R09 → giữ nguyên|Thêm ngữ cảnh cụ thể và ranh giới tên sao |
|vn-lianzhen|Liêm Trinh–Thiên Phủ tại Thìn|Mẫu mới; đối chiếu catalog cũ chỉ có R03 → R03,R10|Hai chú giải nền riêng; không tổng hợp Liêm–Phủ |
|vn-tanlang|Tham Lang tại Thân|Mẫu mới; catalog cũ không có → R11|Chưa tổng hợp Liêm/Hỏa/Linh/Kỵ hoặc vận |
|vn-jumen|Cự Môn tại Dậu|Mẫu mới; catalog cũ không có → R12|Chưa tổng hợp Thiên Cơ hoặc quan hệ hội hợp |

### Xem và xuất bài

Mở `/internal/editorial/demo-wuqu-tianfu?view=reading`, đăng nhập quyền nội bộ hiện có rồi chọn mẫu ở bộ chọn. Mẫu mới dùng tham số `sample=vn-lianzhen`, `vn-tanlang`, `vn-jumen`; sáu mẫu cũ giữ nguyên. `view=rules` xem thực thi. Không có quyền nội bộ thì không phát hành draft.

- Toàn văn và căn cứ: `exports/tanbien-reading-examples.md` và JSON cùng tên, chung runId/thời điểm; Markdown có SHA256 của JSON.
- Duyệt văn gọn: `exports/tanbien-reading-review.md`, cùng runId và liên kết JSON, không nhét trace vào bài chính.
- Bản trước được giữ byte-for-byte tại `exports/tanbien-reading-v1.2-archive/examples.{md,json}`. Các bản1.0/1.1 và DEMO biên soạn không đổi.
- Tái xuất: `node --import tsx scripts/export-tanbien-reading-examples.ts` (không DB). Sau đó chạy tests xuất để đối chiếu cùng lần chạy.

### Kiểm tra thực tế của đợt này

- **Phần mềm:** 164/164 test trong11file nội dung/evaluator/formatter/coverage/matrix/editorial; typecheck đạt. `next build` bản sao cô lập đạt. Production `next start` localhost:3005, DB thử55443, Chrome Playwright một worker, retries=0: **5/5 ca đạt**, gồm chín mẫu tại360/390, đổi mẫu, căn cứ/trace, Reload/Back, kiểm quyền nội bộ và các ca lỗi xác thực sẵn có. Không thay manifest/rate limit.
- Lượt đầu trình chạy dừng trước test do thiếu E2E_ORIGIN, rồi thiếu import attribute JSON ở fixture mới; đã thêm khai báo JSON đúng kiểu. Lượt E2E đầu chạy đủ:3/5, hai lỗi expected cũ (catalog9 thay vì12; mẫu Liêm–Phủ có2đoạn chứ không phải1). Đã đối chiếu cấu trúc mẫu và điều kiện trước khi sửa expected. Lượt cuối5/5 không được cứu bằng auto-retry. Không xem đó là bảo đảm không còn lỗi gián đoạn.
- **Nguồn:** trực tiếp đối chiếu văn bản/ảnh như danh sách trên. Không chạy chuyên gia xác nhận và không coi mẫu do engine sinh là đối chứng độc lập.
- **Bảo toàn:** so SHA256 trước/sau17tệp, không đổi: engine/calendar, hai DEMO biên soạn, snapshot DEMO, archive1.0/1.1/1.2, next.config và atomicmanifestshim. Không thực hiện truy vấn ghi vào DB hiện hành; không tuyên bố đã đối chiếu toàn bộ DB thật. Test chỉ truy cập DB riêng. Khẳng định snapshot/báo cáo cũ dựa trên không có đường ghi trong tác vụ và hash tệp đã liệt kê, không phải audit toàn DB.
- Log: `docs/evidence/tanbien-three/{unit,typecheck,build,e2e,e2e-initial,search}.txt`; hash `preservation.json`. Ảnh mới `mobile/vn-lianzhen-reading-360.png`, `mobile/vn-tanlang-390.png` và đủ ba sao, R08/R09 ở360/390. Đã mở kiểm trực tiếp ảnh Liêm360 và căn cứ Tham390; các ảnh còn lại được chụp tự động, kiểm overflow trong E2E.
- Tái lập tìm mẫu (chỉ đọc): `node --import tsx scripts/find-tanbien-three.ts --verify` →3snapshot,28lần tính, không ghi đè. Unit: chạy11file đã ghi trong log. E2E dùng `E2E_ORIGIN=http://localhost:3005 E2E_ARTIFACT_DIR=docs/evidence/tanbien-three/mobile node --env-file=.local/json-stability/test.env node_modules/@playwright/test/cli.js test -c playwright.stability.config.ts`; trước đó prepare/build/start bằng harness hiện có, không in file cấu hình.

### Chờ người phụ trách nội dung

Cần chốt phạm vi ‘hội hợp’, ‘án ngữ’, phân biệt các chữ ‘Không’, điều kiện Xương/Khúc và các đoạn Kỵ; nghiên cứu các tổ hợp và mâu thuẫn nguồn trước khi thêm rule. Cần kiểm duyệt câu diễn giải và quyền nguồn. Không dùng số rule hay chín mẫu để tuyên bố đọc đủ14chính tinh/toàn lá số. Không có người duyệt hoặc trạng thái approved mới.


## Chẩn đoán JSON và nghiệm thu trình duyệt — template giữ 1.2.0

### Kết luận và mức bằng chứng

Lượt tái hiện trước sửa trên dev3000: **5/8 ca thất bại**, có stack `JSON.parse → next/dist/server/load-manifest.external.js:43 → AppPageRouteModule.loadManifests/prepare`. Cũng có lỗi `Expected clientReferenceManifest to be defined`. Đây là lỗi đọc manifest **phía server Next**, được đưa vào trang lỗi dev của trình duyệt; không phải evaluator, `response.json()` của API báo cáo hoặc Playwright đang đọc JSON xuất. 90 chuyển mẫu đơn giản ban đầu không tái hiện; chuỗi mở căn cứ/trace rồi chuyển mẫu mới bắt được stack.

Quan sát chỉ đọc tại dev cô lập ghi nhận `.next/server/pages-manifest.json` và `app-paths-manifest.json` được đọc khi dài **0 byte**. Bản Next 15.5.27 đang dùng đọc/parse manifest đồng bộ; các bước phát manifest ghi trực tiếp vào file đích. Một reader có thể thấy khoảng trống giữa truncate và write. Không xác định được tên manifest của *đúng lần lỗi đầu tiên ở lượt trước*: log cũ không có đối số path. Bằng chứng hiện tại xác định nhánh loadManifest, đồng thời xác nhận tình trạng đọc file chưa ghi xong trong lớp manifest; không gán lỗi cho response API bị cắt.

Log HTTP bổ sung của dev cô lập có document `200`, `text/html; charset=utf-8`, body đo được khi request hoàn tất; một số body không thu được khi điều hướng đóng request được ghi `bytes:null`, không gọi đó là body rỗng. Lượt đối chứng đó 8/8 không tái hiện lỗi; không bịa HTTP status cho lần lỗi ban đầu. Request `__nextjs_original-stack-frames` bị hủy khi đóng/chuyển trang là request của overlay, không phải nguồn JSON của bài đọc.

429 là vấn đề độc lập: test cũ đăng nhập lặp dùng chung bộ đếm. Bộ đếm vẫn **8 lần/10 phút**. Kiểm tra cô lập còn bắt trường hợp submit trước hydration đi theo POST form gốc và nhận trang text 429; đã giữ form disabled tới khi handler sẵn sàng. Nội dung form không bị reset.

Đã tham khảo [issue upstream về race ghi manifest](https://github.com/vercel/next.js/issues/96664). Issue nói về phiên bản/nhánh khác; chỉ là đối chiếu cơ chế, không dùng thay bằng chứng cục bộ.

### Thay đổi có phạm vi

- `scripts/atomic-next-manifests.cjs` + `next.config.ts`: chỉ **development**, chỉ file `*manifest.json/js` bên trong `.next` của dự án. Ghi file tạm cùng thư mục, rename sau khi ghi đủ; áp dụng cả writer Promise/callback và output filesystem của webpack. Lỗi ghi được trả nguyên; không dùng `{}`, cache cũ hoặc DEMO để chữa parse lỗi. Không sửa node_modules, không đổi Next/engine. Production không cài shim này. Đây là biện pháp tương thích cho Next 15.5.27 cần rà lại khi nâng Next.
- `InternalForm.tsx`: chờ hydration trước submit, giữ thông báo có chủ đích cho 403/429/500; lỗi transport có thông báo tiếng Việt và nút hoạt động trở lại. Không đổi ngưỡng rate limit.
- `SampleNavigation.tsx`: vẫn điều hướng **GET document đầy đủ**, không có request JSON song song hoặc kết quả async cũ ghi đè. Nếu offline trước submit, giữ bài hiện tại, ghi rõ tên mẫu đó và hướng dẫn thử lại. Không tự retry.
- Route preview thêm `loading.tsx` và `error.tsx`: phân biệt đang tải với lỗi tải, có nút thử lại thủ công. Lỗi server cấp manifest trước khi route được dựng nằm ngoài boundary này; sửa writer xử lý nhánh đó. Mất mạng giữa một điều hướng document đầy đủ vẫn có thể hiện lỗi kết nối của trình duyệt, dùng Reload/Back; không có fallback nội dung hoặc spinner ứng dụng vô hạn.
- Test đọc dùng phiên ký cho đúng origin/key thử, không đăng nhập mỗi thao tác. Test rate limit riêng dùng đúng handler/DB cô lập; 8 request được xử lý, request tiếp theo 429 `text/plain`. Thử thêm HTML500 và transport abort tại form, không parse chúng thành JSON.
- `scripts/reading-stability.mjs`, `playwright.stability.config.ts`: chuẩn bị bản sao, cấu hình riêng, một worker, **retries=0**, chặn build/prepare khi server thử đang chạy; kiểm BUILD_ID không đổi giữa các lượt. Ảnh nghiệm thu ghi riêng, không thay bản xuất nội dung cũ.

### Môi trường và tái chạy

Nguồn và template 1.2.0; Next15.5.27, Chrome qua Playwright. Production `next build` + `next start` tại **http://localhost:3005**, bind127.0.0.1. Database riêng **127.0.0.1:55443/tuvi_json_test**; key được tạo riêng trong `.local/json-stability/test.env` quyền0600. Không đọc `.env` website cho môi trường này. Beta/demo payment tắt, email local; không chạy worker. Server3000 của chủ dự án không bị dừng thủ công; config dev được Next tự nạp lại. Sandbox3002 không thay đổi.

```sh
# Server thử3005 phải dừng trước prepare/build. Không dừng3000.
node scripts/reading-stability.mjs prepare
# Chỉ khởi tạo một lần nếu thư mục pg chưa tồn tại:
/Applications/ServBay/bin/initdb -D .local/json-stability/pg -A trust --encoding=UTF8 --locale=C
/Applications/ServBay/bin/pg_ctl -D .local/json-stability/pg -l .local/json-stability/pg.log -o '-h 127.0.0.1 -p 55443 -k /tmp' start
/Applications/ServBay/bin/createdb -h 127.0.0.1 -p 55443 tuvi_json_test
node --env-file=.local/json-stability/test.env --import tsx scripts/migrate.ts
node scripts/reading-stability.mjs build
node scripts/reading-stability.mjs start
# Terminal khác; ba lượt, dừng ngay nếu lượt nào lỗi:
node scripts/reading-stability.mjs test
```

Trust chỉ cho instance test loopback này. Đừng chạy initdb/createdb lần nữa nếu đã tồn tại. Không đưa test.env vào log/chat. Preview: `/internal/editorial/demo-wuqu-tianfu?view=reading` trên3005, đăng nhập bằng key riêng do chủ máy đọc tại file cục bộ; không dùng key/phiên của3000. Không có link bearer/token trong tài liệu.

### Phạm vi test và kết quả

- 156/156 test logic (11 file), gồm reader/writer manifest đồng thời, failure không phá file cũ, đường dẫn ngoài manifest không bị can thiệp, các hồi quy rule/template không đổi. Đây là test phần mềm.
- Typecheck và production build đạt. Sau sửa: dev3000 **6/6**, dev cô lập **6/6**, không tự retry; các pageerror làm test thất bại.
- Sáu mẫu: DEMO7 claim; vn-12=2; vn-20=2 và tiêu đề Sự chủ động; vn-2=0 với danh sách chính tinh rỗng; vn-4=R08 (Tử Vi Mệnh Ngọ); vn-6=R09 (Thiên Tướng Mệnh Tỵ). Expected dựa dữ kiện snapshot và đặc tả, không sửa sao. Fixture `syn-missing-major` bổ sung chỉ kiểm trạng thái thiếu dữ kiện, không gọi là lá số engine.
- Mobile360/390: đổi A→B→A, đúng URL/snapshot/claim/căn cứ, mở/đóng trace, Reload/Back, nhãn/chủ đề, không tràn ngang, offline giữ tên mẫu cũ, hết quyền quay về yêu cầu đăng nhập. Test rate limit tách riêng; lỗi HTML500/transport ở form không thành lỗi JSON.
- Các lượt thăm dò có lỗi selector (route announcer cũng mang role alert) đã sửa bằng scope form. Lượt đang thay build không tính nghiệm thu; đã thêm guard chặn thao tác này. Log thăm dò vẫn lưu ở `evidence/json-stability/exploratory` và các file diagnostic.
- **Nghiệm thu cuối: lượt1 5/5 (45,6s), lượt2 5/5 (46,8s), lượt3 5/5 (45,8s), automatic retries=0.** Kết quả xem `evidence/json-stability/production-run-1.txt`, `-2.txt`, `-3.txt`. Chỉ tính khi cả ba trên build cố định đạt, retries=0. Ba lượt không phải bảo đảm không còn lỗi ngoài kịch bản.

Bảo toàn: SHA-256 **23 file** engine/lịch/rules, JSON biên soạn cố định và toàn bộ JSON/Markdown xuất hiện có không đổi. Transaction **READ ONLY** đối chiếu snapshot/document/versions DEMO trong DB với export vẫn trùng; không phải kiểm toán toàn bộ DB. Không ghi database hiện hành; chỉ bộ đếm rate limit trong DB test được tạo/xóa. Không thay phê duyệt chuyên môn, scoring, beta, thanh toán hoặc email thật.

Ảnh mới: `docs/evidence/json-stability/mobile/`; log và `preservation.json`, `snapshot-readonly.txt` cùng thư mục evidence. Không ghi key/cookie/token/body cá nhân. Còn giới hạn: lỗi mạng sau khi browser đã rời document dùng trang lỗi mạng của browser; shim manifest cần kiểm lại khi thay Next, chưa phải bản sửa upstream tổng quát.


---

## Bản hiện hành — mở rộng Tử Vi / Thiên Tướng, 08/10/2026

Đọc thử tại http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading. Đăng nhập bằng quyền nội bộ hiện có; chọn mẫu và bấm **Đối chiếu rule**. Mẫu Tử Vi: thêm `&sample=vn-4`; Thiên Tướng: `&sample=vn-6`. Không cần khóa trong URL. Bài biên soạn DEMO cố định, bài từ rule và chi tiết thực thi vẫn là ba chế độ riêng.

### Phiên bản và thay đổi

- Template **1.2.0**, formatter **1.1.0**, catalog **interpretation-1.7.0**, derivation **1.6.0**. Chín rule Tân Biên **0.3.0**, toàn bộ `draft`, `review=null`. Bảng Vũ Khúc **1.1.0** giữ nguyên; thêm bảng Tử Vi và Thiên Tướng riêng **1.0.0**, đọc từ sách, không dùng brightness engine.
- R01–R07 giữ nguyên nhận định/điều kiện chuyên môn, thêm metadata chủ đề, điều kiện nguồn và giới hạn triển khai. R08/R09 bổ sung chú giải nền có điều kiện trạng thái; không phải kết luận tổ hợp.
- Tiêu đề dựa trên `readingTheme`: vn-20 chỉ R04 ở nhóm này nên hiện **Sự chủ động**. R02 cùng R04 mới hiện **Học hỏi, sự chủ động**. Không dò câu văn.
- Nhãn phân biệt chú giải nền/biểu tượng, nhận định có điều kiện phối hợp, dữ kiện/ngữ cảnh. R04 là nghĩa chung Hóa Quyền được dự án thu hẹp vào Vũ Khúc tại Mệnh; R07 là nghĩa chung Lộc Tồn đặt cạnh dữ kiện Tài Bạch. Trong căn cứ, **Điều kiện do nguồn nêu** tách khỏi **Phạm vi dự án chủ động chọn**.
- Bỏ chặn hiển thị cứng Vũ Khúc/Thiên Phủ. Không khớp, thiếu dữ kiện, mục chưa triển khai và draft chưa phát hành được ghi riêng. vn-2 không có claim trong bộ Tân Biên này, không bị diễn giải thành đặc điểm người đọc.
- Ngữ cảnh bỏ lặp dữ kiện nền, gom trùng giữa các mục; vẫn có căn cứ mở rộng. Danh sách được chọn để đọc, không tự nhận là đủ mọi yếu tố. Không suy tác động hay phạm vi án ngữ Tuần/Triệt.
- Bản xuất sửa dấu câu nguồn, có liên kết JSON tương đối thật, run ID/thời điểm chung và SHA-256 JSON. Bản 1.1 được lưu nguyên byte tại `exports/tanbien-reading-v1.1/examples.md` và `.json`; bản 1.0 cũng giữ nguyên.

### Nguồn trực tiếp đã đối chiếu và điều kiện mới

Nguồn: **Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên**, PDF người dùng cung cấp. Lượt này đọc lớp chữ các trang **33, 34, 37, 38, 55–57, 90–92**; xem trực tiếp ảnh **33, 37, 55, 90, 91**. Trang PDF trùng trang in tại các vị trí sử dụng. Nội dung tiếng Việt ngắn do dự án biên soạn; chưa xác minh quyền tái sử dụng nguồn, không suy từ việc có PDF. Không đọc lại nguồn Cổ Học/Toàn Thư trong lượt này.

| Rule | Nguồn → điều kiện | Nội dung được phép | Điều chưa triển khai |
|---|---|---|---|
| R08 | Bảng tr.33 §3.1; Mệnh tr.55–56 §4.2.1. Tử Vi là chính tinh Mệnh, **miếu hoặc bình hòa** theo bảng sách | Chú giải nền về trung hậu, thẳng thắn | Không dùng vượng/đắc để tự mở rộng. Chưa tổng hợp Tuần/Triệt, Không/Kiếp, phụ tá, sao đồng cung/hội chiếu; không suy chức vụ, tài sản hay sự kiện |
| R09 | Bảng tr.37 §3.11; Mệnh tr.90–91 §4.2.11. Thiên Tướng là chính tinh Mệnh, **miếu/vượng/đắc** theo bảng sách | Chú giải nền về đôn hậu và ưa ăn ngon, mặc đẹp | Chưa đặc tả đủ Hình đồng cung, Kình/Đà hội hợp, Tuần/Triệt và sao khác; không áp đoạn Quan Lộc sang Mệnh |
| R01–R07 | Nguồn/điều kiện chuyên môn cũ không đổi; xem catalog và bản xuất | Metadata phân loại và phân biệt điều kiện sách/phạm vi dự án | Không nâng trạng thái kiểm duyệt hoặc mở rộng kết luận |

Bảng Tử Vi: miếu Tỵ/Ngọ/Dần/Thân; vượng Thìn/Tuất; đắc Sửu/Mùi; bình hòa Hợi/Tý/Mão/Dậu. Bảng Thiên Tướng: miếu Dần/Thân; vượng Thìn/Tuất/Tý/Ngọ; đắc Sửu/Mùi/Tỵ/Hợi; hãm Mão/Dậu. Thiếu địa chi hoặc ngoài bảng trả thiếu dữ kiện, không lấy nhãn engine thay thế.

Chưa triển khai: tổ hợp Tử Vi–Thiên Phủ. Trang 57 có tiêu đề “vô Sát” và đoạn sau có thêm điều kiện can/chi, chưa đặc tả đủ để chuyển thành tổ hợp chung. Không ghép R03 với R08 thành kết luận mới. Từ “thẳng thắng” ở phần Thiên Tướng còn vấn đề chính tả/nghĩa nên không dùng trong diễn giải R09. Các đoạn dự đoán tuổi thọ, bệnh tật, tài sản, giới tính/phán xét được loại khỏi phạm vi. Exceptions rỗng không phải bằng chứng không có ngoại lệ: trạng thái chưa tổng hợp nằm gần nhận định và trong căn cứ.

Các rule Toàn Thư đã có được giữ riêng nguồn/phương pháp. Bài Tân Biên chỉ lấy rule `tanbien.*`, không xuất nối tiếp hai sách như cùng một phương pháp.

### Sáu mẫu và đối chiếu trước/sau

| Mẫu engine / snapshot | Dữ kiện thực tế | Trước 1.1 → sau 1.2 | Phần còn thiếu |
|---|---|---|---|
| DEMO đã lưu | Mệnh Tý Vũ Khúc–Thiên Phủ; Tử Vi–Thiên Tướng ở Quan Lộc | R01–R07 → giữ 7 đoạn; R08/R09 không khớp sai cung | Chưa có tổng hợp toàn lá số/Vũ–Phủ |
| vn-12 | Mệnh Dần Tử Vi–Thiên Phủ | R03 → R03 + R08, hai chú giải nền riêng | Không phải luận bộ Tử–Phủ; thiếu học hỏi, công việc, tài chính |
| vn-20 | Mệnh Tuất Vũ Khúc, Hóa Quyền | R01/R04 → giữ 2 đoạn; đổi tiêu đề sang Sự chủ động | Không xuất R02 vì Văn Khúc ở cung khác; thiếu công việc/tài chính |
| vn-2 | Mệnh Mùi, danh sách chính tinh rỗng hợp lệ | 0 → 0; giải thích chưa có nội dung Tân Biên khớp | Không mượn đối cung hoặc suy kết luận phủ định |
| vn-4 | Mệnh Ngọ Tử Vi; ghi nhận Triệt Lộ | 0 theo bộ cũ → R08 | Chưa tổng hợp ảnh hưởng Triệt; không coi chú giải là kết luận đầy đủ |
| vn-6 | Mệnh Tỵ Thiên Tướng | 0 theo bộ cũ → R09 | Chưa tổng hợp Hỏa Tinh tại Mệnh, Kình Dương tại Quan Lộc và các điều chỉnh |

Hai dòng mới so sánh phạm vi bộ rule cũ, không giả là bản xuất 1.1 đã có sáu mẫu. Năm mẫu `vn-*` được engine tính từ đầu vào giả lập có sẵn, không sửa sao; DEMO đọc snapshot đã xuất. Fixture đổi sao chỉ có trong unit test, không gọi là lá số engine hợp lệ.

- [Toàn văn sáu bài, căn cứ và ngữ cảnh](../exports/tanbien-reading-examples.md).
- [JSON cùng lần xuất, claim/fact/trace/version](../exports/tanbien-reading-examples.json).
- [Bảng 14 chính tinh + Mệnh không chính tinh](RULE-SOURCES.md): tách dữ kiện an sao, chú giải nền, tổ hợp, chưa duyệt. Không dùng số rule làm tỷ lệ đúng/đầy đủ.
- Chạy xuất: `node --import tsx scripts/export-tanbien-reading-examples.ts`; cập nhật bảng: `node --import tsx scripts/export-menh-coverage.ts`. Cả hai không ghi database.

### Xác minh phần mềm và giới hạn bằng chứng

- **155/155 test**, 10 file: đúng/sai cung, trạng thái nguồn, dữ kiện thiếu, không dùng brightness engine, draft không vào khách, metadata/tiêu đề, tính nhất quán cặp xuất, các kiểm tra evaluator/reading cũ. Các kỳ vọng biên theo đặc tả; không coi engine tự xác minh engine.
- **Hai ca E2E đã từng đạt cùng lượt** và ca chuyển mẫu chạy riêng đạt (Chrome, 360/390px, căn cứ/trace, auth và bài DEMO). Tuy nhiên các lượt lặp chung không ổn định: ảnh `diagnostic-360.png` ghi lỗi runtime Next.js dev **Unexpected end of JSON input** sau điều hướng, chưa xác định thành phần gây parse lỗi. Không thể chốt hồi quy trình duyệt hoàn toàn xanh. Lượt chẩn đoán cuối: ca bài từ rule đạt, ca biên soạn bị **429** do chạy lặp đăng nhập chạm giới hạn hiện có; không hạ rate limit. Giữ các log `tanbien-reading-v1.2-e2e.txt`, `tanbien-reading-v1.2-e2e-intermittent.txt`, `tanbien-reading-v1.2-navigation-recheck.txt`, `tanbien-reading-v1.2-runtime-diagnostic.txt`. DOM kiểm tra không tràn ngang trong các lượt đạt; đã xem trực tiếp ảnh bài đọc Tử Vi 360px và căn cứ Thiên Tướng 390px. Đây là hạn chế môi trường dev còn cần chẩn đoán, không có bằng chứng snapshot hoặc nội dung đã bị ghi nhầm.
- Typecheck và production build đạt; build chạy trong bản sao cục bộ để không phá dev server đang dùng. Log tại `docs/evidence/tanbien-reading-v1.2-*.txt`.
- So SHA-256 **14 file** engine/calendar/evaluator, DEMO export, JSON biên soạn và bản xuất lưu trữ: không đổi. Đối chiếu chỉ đọc DB bản DEMO với export: snapshot/document/versions trùng. Đây không phải kiểm toán toàn bộ báo cáo trong DB. Không có lệnh ghi DB trong đợt này.
- Ảnh tại `exports/tanbien-reading-v1.2/`: reading/evidence/context/technical và vn-4/vn-6 ở cả 360/390px. Badge lỗi/hot-reload của Next dev có thể hiện trong ảnh; không phải thành phần sản phẩm.

**Phân biệt:** phần mềm đã kiểm tra; các trang nguồn nêu trên đã đọc/đối chiếu; nội dung và engine chưa được phê duyệt chuyên môn. Beta/thanh toán/email không được bật. Cần người phụ trách quyết định phạm vi ngoại lệ và quyền nội dung trước bất kỳ phát hành nào.

---

## Hồ sơ phiên bản 1.1.0 — giữ để đối chiếu, không mô tả trạng thái hiện hành

### Template 1.1.0, formatter 1.0.0

## Trạng thái mới — 08/10/2026

URL: http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading. Đăng nhập ở `/internal` bằng quyền hiện có. Chọn DEMO mặc định, hoặc mẫu Engine VN Tử Vi và Thiên Phủ (`vn-12`), Vũ Khúc (`vn-20`), Mệnh không chính tinh (`vn-2`), rồi bấm **Đối chiếu rule**. Có thể dùng `&sample=vn-12` / `vn-20` / `vn-2`. Bài DEMO cố định và trang thực thi vẫn tách riêng.

### Nội dung và hai lớp căn cứ

- Template **1.1.0**, formatter/ngữ cảnh **1.0.0**. Catalog **interpretation-1.6.0**, bảy rule **0.2.0**, bảng Vũ Khúc **1.1.0**, derivation **1.5.0** giữ nguyên từng byte; không thêm/sửa điều kiện hoặc nhận định chuyên môn.
- `tanbien-presentation.ts` chỉ định dạng căn cứ, kiểm tra đầy đủ dữ liệu và tạo ngữ cảnh; không gọi evaluator phụ, không cho điểm, không suy diễn tác động.
- Lớp thông thường: vị trí cụ thể, số chính tinh/các sao, điều kiện bằng tiếng Việt, tên tác giả/sách/trang/mục, giới hạn, nhãn dự thảo. R06 lấy **Thân** từ cung Tài Bạch của snapshot, không đoán từ `dan-than`. Rỗng hợp lệ được ghi “danh sách … được ghi rỗng”; thiếu trường ghi “Chưa có dữ liệu xác định…”.
- Lớp **Chi tiết kỹ thuật** mặc định đóng: snapshot/result ID, claim ID, rule/version, fact ID/value, toán tử, evidence paths, trace, bảng nguồn và template. Lớp này vẫn có đầy đủ căn cứ thô; định dạng dễ đọc không sửa kết quả evaluator.
- Mạch bài: dữ kiện nổi bật → hành động/cân nhắc → học hỏi/chủ động → công việc → tài chính → yếu tố cần xét thêm. Chỉ mở mục có claim, các mục chưa hỗ trợ gom cuối. Không nối claim thành quan hệ nhân quả, không cộng nghĩa Vũ–Phủ, không lấy văn DEMO. Hai phần dùng cùng ngữ cảnh Mệnh được gộp một lần nhưng giữ tên cả hai phần.
- Template có giới hạn phạm vi **Vũ Khúc hoặc Thiên Phủ tại Mệnh**. Ngoài phạm vi hiện thông báo rõ; thiếu dữ liệu Mệnh là trạng thái riêng, không gọi là ngoài phạm vi. Evaluator vẫn chạy nguyên bộ để xem ở trang thực thi; việc không trình bày claim ngoài phạm vi là chính sách template, không sửa kết quả rule.

### Phân biệt dữ kiện, hình học, diễn giải và phần chưa tổng hợp

A. **Dữ kiện snapshot:** chính tinh Mệnh, tứ hóa kèm sao và lớp bản mệnh khi ghi rõ, Văn Xương/Văn Khúc ở đâu, Thân ở đâu; Kình/Đà/Hỏa/Linh, Không/Kiếp, Tuần Không/Triệt Lộ tại cung đang đọc và các cung liên quan. Không có ghi nhận không được chuyển thành khẳng định sao vắng mặt; dữ liệu không đủ được báo thiếu.

B. **Quan hệ hình học:** chỉ tính khi đủ 12 địa chi hợp lệ duy nhất và tên cung duy nhất. Dùng vòng Tý→…→Hợi, khoảng cách modulo 12: 0 cùng cung, 4/8 tam hợp, 6 đối cung. Không dùng index mảng để đo; đảo mảng vẫn đúng. Đường dẫn cả 12 tên/chi được giữ vì đó là tiền đề kiểm tra. Không suy giáp cung, án ngữ hai cung hoặc tự gọi quan hệ này là hội chiếu của một trường phái. Chưa đủ dữ liệu thì không tạo quan hệ.

C. **Diễn giải:** chỉ nguyên văn claim matched trong catalog, có điều kiện và nguồn tương ứng; không dùng A/B tạo kết luận tốt/xấu.

D. **Ảnh hưởng chưa tổng hợp:** từng khối ngữ cảnh nói rõ chưa có phép tổng hợp tác động. Tài chính dẫn yêu cầu đọc Mệnh, Thân, Phúc Đức, Quan Lộc, Thiên Di ở PDF/trang in 190. Ví dụ DEMO ghi Tuần Không ở Tài Bạch; không kết luận mất Lộc hoặc bị chặn tiền bạc. Không mở rộng vị trí của nhãn sang cung kế bên.

### Bảng bốn mẫu đã chạy

| Mẫu | Dữ kiện chính | Rule khớp / đoạn xuất | Ngữ cảnh cụ thể (trích) | Phần thiếu |
|---|---|---|---|---|
| DEMO đã lưu | Mệnh Tý: Vũ Khúc–Thiên Phủ; Thân Quan Lộc Thìn | R01–R07 / 7 đoạn, 4 mục | Văn Khúc Mệnh, Văn Xương Phúc Đức; Vũ Khúc Hóa Quyền bản mệnh; Tuần Không Tài Bạch; Linh Tinh và Triệt Lộ Thiên Di | Chưa tổng hợp tác động các yếu tố; chưa có quy tắc riêng Vũ–Phủ |
| vn-12 | Mệnh Dần: Tử Vi–Thiên Phủ; Thân cư Mệnh | R03 / 1 đoạn | Văn Khúc Tài Bạch, Văn Xương Phúc Đức; Triệt Lộ Quan Lộc; Hỏa Tinh và Tuần Không Thiên Di | Học hỏi/chủ động, công việc, tài chính; không gọi 1 đoạn là luận giải đầy đủ |
| vn-20 | Mệnh Tuất: Vũ Khúc; Thân cư Tài Bạch Ngọ | R01, R04 / 2 đoạn, 2 mục | Vũ Khúc Hóa Quyền bản mệnh; Văn Khúc Quan Lộc (không đồng cung Mệnh); Triệt Lộ Tài Bạch | Không xuất R02; chưa có công việc/tài chính trong nhóm rule này |
| vn-2 | Mệnh không có chính tinh trong danh sách hợp lệ | 0 / 0 | Chỉ trình bày dữ kiện nền; giải thích mẫu ngoài phạm vi, không mượn sao đối cung | Toàn bộ bốn mục diễn giải của bộ thử nghiệm |

[Bốn bản đọc đầy đủ và căn cứ](../exports/tanbien-reading-examples.md), [dữ liệu/claim/trace tương ứng](../exports/tanbien-reading-examples.json). Script `node --import tsx scripts/export-tanbien-reading-examples.ts` chỉ tính đầu vào mẫu giả lập và đọc DEMO đã xuất, không ghi database. Bản xuất template 1.0.0 cũ được giữ tại `exports/tanbien-reading-v1/examples.md` và `.json`. Những mẫu engine này kiểm toàn luồng nội dung, không xác nhận độ đúng chuyên môn của engine.

### Rà soát nguồn lần này

Đã đọc lại toàn trang lớp chữ **40, 65, 66, 67, 76, 77, 78, 158, 190** của PDF đính kèm. Đã xem trực tiếp ảnh **77, 78, 190** trong lượt này, ngoài các trang 34–35, 40, 65, 67, 76 đã xem ở lượt trước. Số trang PDF trùng trang in tại các vị trí này. Không lấy HTML DEMO thay nguồn sách. Không đọc lại trang Cổ Học; khác biệt Vương Đình Chi vẫn là ghi nhận theo hồ sơ, chưa tự hòa giải.

| Nội dung rà soát | Kết luận triển khai |
|---|---|
| Vũ Khúc miếu/vượng/đắc ở Mệnh, tr.65 | Giữ R01 là chú giải nền; không lấy dự đoán tài sản, tuổi, bệnh tật hoặc phán xét trong các đoạn tiếp. Trang 66 có đoạn riêng nam/nữ, không áp sang R01 |
| Vũ Khúc–Văn Khúc, tr.67 | Giữ đúng đồng cung Mệnh và trạng thái bảng sách. Không dùng đoạn Vũ–Phá–Xương/Khúc ở phía trên để thêm nghĩa |
| Thiên Phủ Mệnh, tr.76 | Giữ chú giải nền R03 và giới hạn gần đoạn; Tuần/Triệt, Không/Kiếp, sát tinh hội hợp được nêu nhưng chưa đủ đặc tả để biến thành phép chặn hay điều chỉnh đầy đủ |
| Hóa Quyền, tr.40 §3.24 | Giữ R04 trong phạm vi hẹp Vũ Khúc ở Mệnh mang Quyền bản mệnh. Chưa có tập định nghĩa sao “tốt/xấu” và quan hệ đi cùng, không tự thêm mức tác động |
| Vũ–Phủ tại Tý, tr.77 Phú giải | **Chưa triển khai**: ảnh trang cũng có phần văn xuôi nối phúc/giàu sang với tiếng xấu mà không rõ ranh giới Tuần/Triệt; cần đối chiếu bản in/ấn bản khác và quyết định phương pháp. Không tự chèn từ hoặc sửa câu |
| Phủ–Xương–Khúc–Tả/Hữu/Lộc, tr.78 | **Chưa triển khai**: chưa đặc tả phạm vi “hội hợp”, tập sao phải có đủ, trạng thái và ngoại lệ tr.76. Không coi tam hợp hình học là tự đủ để áp dụng; không chuyển dự đoán tài sản thành câu hứa hẹn |
| Tử Vi–Thiên Tướng Quan Lộc, tr.158; Tài Bạch tr.190 | Giữ giới hạn cung của R05–R07, dùng danh sách cung phải xét ở mở đầu tr.190 làm ngữ cảnh, không đưa thành nhận định Mệnh |

**Không có rule mới hoặc rule chuyên môn bị sửa.** Ngoại lệ chưa đủ rõ vẫn chưa triển khai. Quyền sử dụng bản điện tử còn pending; có PDF không đồng nghĩa có quyền tái sử dụng thương mại. Tất cả vẫn draft/review=null.

### Kết quả xác minh

- **Phần mềm:** 150/150 test, 9 file; typecheck và build đạt. E2E Chrome 2/2 scenario: bốn mẫu, A→B→C→D→A, căn cứ hai lớp, trace đúng snapshot, không tràn ngang 360/390px, chặn chưa đăng nhập, phiên bản DEMO cũ, beta vẫn tắt. Log `docs/evidence/tanbien-reading-v1.1-{tests,typecheck,build,e2e}.txt`.
- **Bảo toàn:** SHA-256 của 13 file engine/calendar/bảng nguồn/rule/evaluator/derivation/DEMO bằng nhau trước/sau lượt sửa. DB sandbox kiểm bằng transaction READ ONLY: snapshot/document/versions DEMO cũ vẫn bằng bản xuất. Log `tanbien-reading-v1.1-preservation.txt` và `tanbien-reading-v1.1-snapshot.txt` trong `docs/evidence`. Không tuyên bố đã kiểm checksum mọi dòng báo cáo khách trong database; mã này không có thao tác ghi báo cáo/đơn.
- **Ảnh:** `exports/tanbien-reading-v1.1/reading-{360,390}.png`, `evidence-{360,390}.png`, `technical-{360,390}.png`, `context-{360,390}.png`. Đã trực tiếp xem ảnh bài chính 390px, căn cứ 360px, kỹ thuật 360px và ngữ cảnh 390px.
- **Văn bản nguồn:** mức đối chiếu từng trang như trên; không xác minh lịch sử biên tập bản điện tử hoặc giải quyết đoạn mơ hồ tr.77.
- **Chuyên môn:** chưa phê duyệt; test đạt không xác nhận khả năng dự đoán. Không bật AI, scoring, beta, thanh toán hoặc email thật.

---

## Biên bản lượt template 1.0.0 (giữ làm lịch sử)

# Tổng quan từ rule — 08/10/2026

## Truy cập và phiên bản

Đăng nhập bằng cơ chế nội bộ hiện có tại http://localhost:3000/internal, rồi mở:

- Bài từ rule: http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=reading
- Chi tiết thực thi: http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=rules
- Bài DEMO cố định 1.1 và 1.0 vẫn giữ nguyên: tham số `v=1.1` / `v=1.0`.

Ba chế độ riêng; selector dùng mẫu có sẵn. Mã mẫu sai không fallback. Bản DEMO lấy snapshot đã xuất từ bản đọc lưu; mẫu engine khác chạy lại đầu vào giả lập có sẵn, không sửa sao. Fixture kỹ thuật được ghi nhãn riêng. Không ghi DB hoặc thay bản đọc đã giao.

Catalog interpretation-1.6.0; bảy rule Tân Biên 0.2.0, draft/review=null; bảng tanbien-wuqu-state 1.1.0; derivation 1.5.0; template 1.0.0. Không có rule được tự phê duyệt. Catalog hiện có 9 rule dữ kiện và 25 rule diễn giải/phương pháp; số lượng không biểu thị độ đầy đủ.

## Nguồn trực tiếp đọc

Tệp PDF chủ dự án cung cấp: `(boitoan)-Tử Vi Đầu Số Tân Biên - Vân Đằng Thái Thứ Lang-dantocking.com.pdf` tại thư mục Desktop/TAILIEUTUVI. Tên sách trong sách: **Tử Vi Đẩu Số Tân Biên**, tác giả **Vân Đằng Thái Thứ Lang**, trang đầu ghi Sài Gòn 1956. PDF 277 trang. Đây là bản điện tử được cung cấp, chưa xác minh lịch sử biên tập hoặc quyền phân phối của bản điện tử.

Đọc lớp chữ bằng pypdf: PDF 1, 34, 35, 40, 65, 66, 67, 76, 77, 158, 162, 190. Trực tiếp xem ảnh render PDF 34, 35, 40, 65, 67, 76. Số trang PDF và trang in trùng nhau tại các đoạn được sử dụng. Trang 158, 162, 190 đã đọc lớp chữ, chưa kiểm ảnh trong lượt này. HTML `tong-quan-vu-phu-v01.html` được đọc lại các mục R01/R03/R04/R07 để kiểm phạm vi đề xuất, không coi HTML là bằng chứng thay PDF.

| Bảng Vũ Khúc — PDF/trang in 34–35 §3.4 | Địa chi trực tiếp đọc trên ảnh |
|---|---|
| Miếu | Thìn, Tuất, Sửu, Mùi |
| Vượng | Dần, Thân, Tý, Ngọ |
| Đắc | Mão, Dậu |
| Hãm | Tỵ, Hợi |

Đủ 12 chi, không sao chép brightness engine. Unknown vẫn áp dụng khi thiếu/không nhận diện được địa chi; Hãm là điều kiện không đạt, khác unknown. Bảng 1.0.0 trước chỉ có Tý theo hồ sơ; ghi nhận lịch sử ở TANBIEN-PREVIEW-TRIAL.md được giữ lại, không sửa thành đã đọc nguồn từ trước.

## Nguồn → điều kiện → rule → phạm vi nội dung

| Rule | Nguồn PDF / trang in | Điều kiện thực thi | Nhận định và giới hạn |
|---|---|---|---|
| R01 | 65 §4.2.4 Đại cương; 34–35 §3.4 | Vũ Khúc trong chính tinh Mệnh; bảng sách miếu/vượng/đắc | Ý nghĩa nền quả quyết, tổ chức. Nguồn có hiếu thắng; chưa tổng hợp tương tác. Bỏ dự đoán tài sản, tuổi thọ, sức khỏe và phán xét trong các đoạn khác |
| R02 | 67 Phú giải, đoạn Vũ Khúc–Văn Khúc; 34–35 | Vũ Khúc tại Mệnh đạt trạng thái nguồn, Văn Khúc đồng cung | Học rộng/nhiều khả năng; không suy bằng cấp, trí thông minh, năng khiếu cụ thể |
| R03 | 76 §4.2.7 Đại cương và ngay các đoạn tiếp | Thiên Phủ trong chính tinh Mệnh | Chú giải nền suy tính/giải quyết việc khó. Giới hạn Tuần/Triệt và hội chiếu nằm ngay đoạn chính. Chưa coi điều kiện bất lợi vắng mặt |
| R04 | 40 §3.24; phạm vi hẹp theo hồ sơ HTML R04 | Vũ Khúc tại Mệnh; mutagen=Quyền; scope=origin được ghi rõ | Biểu tượng Hóa Quyền: mạnh bạo, mau mắn, nắm quyền hành. Không phải kết luận Vũ–Phủ. Thiếu scope/mutagen → unknown |
| R05 | 158 §8.1; 162 §8.11 | Tử Vi và Thiên Tướng cùng chính tinh Quan Lộc | Tổ chức công việc; không thêm brightness hoặc kết luận chức vụ |
| R06 | 190 §12.2 | Tài Bạch Dần/Thân, đúng một chính tinh Liêm Trinh | Cạnh tranh/tích lũy chậm theo cách đọc truyền thống, không hứa thu nhập; phụ tinh không làm mất độc thủ |
| R07 | 40 §3.20; 190 mở đầu Tài Bạch | Lộc Tồn trong phụ tinh Tài Bạch | Biểu tượng chung tài lộc đặt cạnh dữ kiện cung, không phải kết luận riêng có tiền/giữ tiền tốt |

R03: PDF nêu Tuần/Triệt án ngữ, Không/Kiếp và sát tinh hội hợp; chưa có đặc tả đầy đủ để tự chặn/điều chỉnh toàn tổ hợp. Vì thế chỉ phát chú giải nền có giới hạn sát bên, không phát kết luận tích cực hoàn chỉnh. R04: PDF nói sao tốt/xấu đi cùng có ảnh hưởng, nhưng chưa xác định tập sao/quan hệ nên không tự gán trọng số hay ngoại lệ giả. R07: phần dẫn Tài Bạch yêu cầu xét Mệnh, Thân, Phúc Đức, Quan Lộc, Thiên Di; chưa thực hiện phép tổng hợp đó.

Khác biệt với Cổ Học/Vương Đình Chi vẫn chỉ được dẫn theo hồ sơ chủ dự án; **chưa đọc lại trang web trong lượt này**, không tự hòa giải. Quyền sử dụng nguồn còn pending; không sao chép dài, không coi đọc được tài liệu là chuyên gia duyệt.

## Template và truy vết

Bài dùng đúng các previewClaims do evaluator hiện có trả về từ subset Tân Biên trong catalog. Không lấy văn DEMO, không AI, không tự tạo câu nhân quả. Nhóm ý theo hành động/học hỏi, công việc, tài chính. Dữ kiện nền riêng, không tính là nhận định cá nhân hóa.

Mỗi claim chỉ hiển thị một lần; evaluator gộp trùng chính xác và giữ rule liên quan. R01 nói quả quyết/tổ chức, R02 nói học hỏi, nên không loại R01 chỉ vì cùng Vũ Khúc. Không bổ sung lời khuyên hoặc câu hỏi biên tập mới. Rule not-matched không sinh ý ngược; unknown được liệt kê với lý do và mã dữ kiện thiếu. Mục trống ghi rõ chưa có nội dung hỗ trợ. Căn cứ mở được snapshot ID, fact/evidence paths, điều kiện, rule version, bảng nguồn, nguồn và giới hạn.

## So sánh bốn mẫu engine

Bản đọc đầy đủ và căn cứ: [exports/tanbien-reading-examples.md](../exports/tanbien-reading-examples.md). JSON gồm phiên bản, claim, điều kiện, nguồn và trace: [exports/tanbien-reading-examples.json](../exports/tanbien-reading-examples.json). Tạo lại bằng `node --import tsx scripts/export-tanbien-reading-examples.ts`; không tạo đơn hoặc ghi database.

| Mẫu | Chính tinh Mệnh | Rule khớp | Mục chưa có nội dung |
|---|---|---|---|
| demo-wuqu-tianfu, snapshot đã lưu | Vũ Khúc–Thiên Phủ | R01–R07 | Không trống trong ba nhóm, nhưng chưa tổng hợp toàn lá số |
| vn-12, engine từ đầu vào giả lập | Tử Vi–Thiên Phủ | R03 | Công việc, tài chính |
| vn-20, engine từ đầu vào giả lập | Vũ Khúc | R01, R04 | Công việc, tài chính; không có đoạn Vũ–Văn Khúc |
| vn-2, engine từ đầu vào giả lập | Danh sách chính tinh rỗng hợp lệ | Không có trong nhóm Tân Biên | Cả ba nhóm; không tự mượn sao đối cung hoặc lấp văn DEMO |

Trước: chỉ có ba rule R02/R05/R06, lookup chỉ Tý, và bài DEMO cố định. Sau: bảy rule, lookup 12 chi, có bài riêng theo từng kết quả. Đây là kiểm thử độ phù hợp nội dung theo cấu trúc engine, không xác nhận độ đúng chuyên môn hoặc tần suất thực tế của khách.

## Kiểm thử và giới hạn

- 144/144 test liên quan, 8 file; log `docs/evidence/tanbien-reading-tests.txt`.
- Lượt typecheck đầu của script xuất ví dụ phát hiện viết sai tên trường ruleSetHash; đã sửa, tạo lại ví dụ có hash đầy đủ rồi chạy typecheck/build lại.
- Typecheck đạt; log `docs/evidence/tanbien-reading-typecheck.txt`.
- E2E Chrome: 2/2 scenario, gồm 360/390px, mở căn cứ, A→B→C→A, không giữ bài cũ, chặn người chưa đăng nhập, giữ phiên bản DEMO cũ, beta tắt. Log `docs/evidence/tanbien-reading-e2e.txt`; sau chỉnh nhãn dữ kiện, chạy lại riêng luồng bài từ rule đạt 1/1 trong `docs/evidence/tanbien-reading-e2e-final.txt`.
- Lượt E2E đầu phát hiện ID dài trong căn cứ làm tràn ngang; đã thêm wrap chỉ cho vùng bài từ rule và chạy lại đạt. Không che tràn bằng cắt nội dung.
- Đối chiếu DB sandbox bằng transaction READ ONLY: snapshot/document/versions cũ trùng bản xuất; log `docs/evidence/tanbien-reading-snapshot.txt`.
- Build bản sao tách biệt để không phá dev server; log `docs/evidence/tanbien-reading-build.txt`.
- Test lookup 12 chi có expected chép từ ảnh PDF; fixture đổi sao/chi/scope chỉ kiểm logic, không gọi là lá số hợp lệ. Test thiếu dữ kiện giữ unknown, brightness không đổi, draft bị chặn khỏi approvedClaims khách.

Chưa xác minh quyền nội dung, ngoại lệ toàn tổ hợp và cách giải quyết khác biệt trường phái; cần người phụ trách nội dung quyết định. Không có phê duyệt chuyên gia; test đạt không xác nhận dự đoán. Không sửa engine, lịch, snapshot, bài DEMO, thanh toán, email, beta hoặc scoring.

## Luồng nhập và đọc động nội bộ — internal-reading-1.0.0 (09/10/2026)

### Hiện trạng kiểm tra và phần bổ sung

Trước đợt này, `/` đã nhập/chuẩn hóa thông tin và gọi `calculate`, hiển thị Chart; `/internal` đọc report DB hoặc mẫu, dùng preview khác; `/internal/editorial/demo-wuqu-tianfu?view=reading` đã có template1.9.0 nhưng chỉ chọn các mẫu. Không có luồng nhập hồ sơ riêng rồi lưu bài Tân Biên có phiên bản.

Bổ sung `/internal/readings`: schema/profile ranges hiện có → xác nhận → API nội bộ → `calculate` hiện có → snapshot nguyên bản → receipt dữ liệu → **chỉ catalog tanbien.r*** → template1.9.0 → lưu edition nội bộ bất biến → Chart/TanBienReading hiện có. Không dùng bài DEMO, rule Toàn Thư, AI hoặc phép an Linh thử nghiệm. Không tạo đơn, giao dịch, email; engine/calendar/Mệnh chủ/Thiên Quý không đổi.

Form nội bộ dùng schema, các giá trị lựa chọn và CSS sẵn có; không mang luồng mua hàng vào trang nội bộ. Ngày dân sự giữ nguyên, không chuyển UTC; unknownTime không được lập đầy đủ. Validation phía server lặp lại validation client. Lỗi được hiển thị và giữ dữ liệu để thử lại.

### Hợp đồng độ đầy đủ

Đọc trực tiếp `scripts/engine.cjs`, `scripts/engine-vn.cjs`, `lib/tuvi-engine/index.ts`, `lib/interpretation-rules/derived.ts`, `execute.ts`, `components/Chart.tsx`:

- Hai runner lấy nguyên `a.palaces`, JSON serialize, adapter parse toàn bộ. Không có bước lọc chính/phụ tinh trước snapshot. UI lựa chọn phần hiển thị nhưng không sửa snapshot đầu vào evaluator.
- Receipt `engine-list-receipt-1` chỉ tạo ngay sau **lần calculate do server thực hiện**; ghi hash chart, resultId, nguồn/hợp đồng, hash nội dung runner và adapter. API không nhận snapshot hoặc receipt từ client. Kiểm tra cấu trúc 12 cung/danh sách là kiểm tra lỗi dữ liệu, **không phải bằng chứng độc lập danh sách đầy đủ**; căn cứ đầy đủ là provenance của phép xuất nguyên danh sách vừa chạy, trong phạm vi adapter/pinned iztro2.6.1.
- Snapshot cũ không tự được gắn receipt. Trong API này không có cơ chế tải JSON ngoài rồi tự xác nhận đầy đủ. Nếu build bản động không có receipt hoặc hash không khớp: giữ snapshot lưu trữ nguyên bản, nhưng bản sao dùng trình bày bỏ các danh sách chưa xác minh; lớp thực thi bỏ các facts có evidence phụ thuộc danh sách sao. Không tạo lời khẳng định vắng mặt hoặc rule đếm/độc thủ từ mảng chưa rõ độ đầy đủ.
- Danh sách rỗng mới có receipt → dữ kiện rỗng đã ghi theo hợp đồng engine. Thiếu trường → dữ kiện thiếu. Mảng hợp lệ cũ không receipt → chưa xác minh, không tương đương rỗng. Chính sách bảo thủ này cũng giữ lại các claim chỉ cần sao hiện diện nếu danh sách chưa xác minh; chưa triển khai suy luận dương tính trên dữ liệu một phần.
- `executeRules` thêm tùy chọn `unverifiedStarLists`, mặc định không bật để không đổi luồng lịch sử. `buildTanBienReading` nhận cùng tùy chọn. Không đổi catalog, điều kiện rule, bảng nguồn hoặc derivation hiện có. Phiên bản chính sách mới nằm ở **internal-reading-1.0.0**; template nội dung vẫn1.9.0. Luồng mẫu cũ chưa được di trú sang chính sách mới.

### Lưu và mở lại

Lưu JSON immutable (atomic link không ghi đè, file0600, thư mục0700) dưới `.local/internal-readings`, ngoài public. Có snapshot, receipt, thời điểm, UUID, bản đọc, claims/rules/trace, lớp căn cứ đã trình bày và bảng nguồn dùng cho rule. Mở lại đọc bản lưu, không chạy engine/evaluator/template mới. Component hiển thị được tái sử dụng; bố cục và component Chart vẫn là giao diện hiện hành, không cam kết lưu pixel/HTML lịch sử.

`TanBienReading` nhận optional frozen edition; đường mẫu cũ giữ nguyên cách chạy. Nguồn/claim/đoạn và phiên bản của hồ sơ được lưu riêng. Mở hồ sơ không tồn tại báo lỗi, không lấy mẫu đầu tiên hoặc DEMO. Hai hồ sơ có UUID và resultId riêng; URL không chứa dữ liệu sinh hoặc token.

Quyền là **vai trò chủ dự án nội bộ hiện hành** bằng cookie `tuvi_internal`, được kiểm tra trước đọc/list/tạo. Vai trò này có quyền các hồ sơ trong khu vực riêng này; không tạo tài khoản/người sở hữu mới hoặc chia sẻ cho khách. Cookie beta/đơn hàng không đủ quyền. API kiểm origin theo allowlist đăng nhập nội bộ, giới hạn body8KiB, tối đa hai phép tạo đang chạy trong một process; không gọi đây là rate limit phân tán. Retry cùng UUID/input trả hồ sơ cũ; UUID dùng cho input khác bị từ chối. Không endpoint nhận đường dẫn tệp tùy ý.

Dữ liệu thật chỉ nên nhập khi chủ dự án đồng ý lưu nội bộ. Không sao chép thư mục này vào public hoặc bộ fixture. Cần bảo toàn thư mục khi deploy; máy chủ stateless/multi-replica cần chọn kho lưu chung trước khi vận hành. `INTERNAL_READING_DIR` có thể chỉ tới thư mục private riêng; production test dùng cwd cô lập nên không đọc/ghi thư mục live. Không có lịch xóa tự động mới: giao diện ghi rõ; chủ dự án có thể xóa đúng tệp `<UUID>.json` trong kho riêng để xóa hồ sơ. Không ảnh hưởng báo cáo đơn hàng.

### Cách chủ dự án trải nghiệm

1. Đăng nhập `/internal`; chọn **Nhập thông tin sinh và đọc Tân Biên nội bộ**, hoặc mở `/internal/readings`.
2. Nhập ngày dương, giờ/phút, nơi sinh, giới tính, profile và xác nhận giới hạn; bấm **Kiểm tra thông tin**, kiểm tra rồi **Xác nhận & mở bản đọc nội bộ**.
3. Xem thông tin sinh ở đầu, mở lá số và căn cứ từng đoạn. Chi tiết kỹ thuật mặc định đóng. Không có claim thì báo phần chưa hỗ trợ, không lấp văn.
4. Trở lại **Nhập mới / hồ sơ đã lưu** để chọn hồ sơ cũ; URL UUID chỉ có tác dụng trong phiên nội bộ còn hiệu lực.

Các report đơn hàng/snapshot lịch sử vẫn mở qua luồng cũ, không bị chuyển đổi hoặc xác nhận lại độ đầy đủ trong đợt này. Luồng mới mở lại các edition nội bộ do chính luồng này lưu.

### Kết quả kiểm tra đợt luồng động

- 37/37 test ở4 file (`dynamic-reading`, `tanbien-review-pack`, `interpretation`, `linh-isolation`): receipt gắn đúng chart, chỉ rule Tân Biên, dữ liệu chưa xác minh không suy vắng mặt, mảng rỗng có receipt, lưu/mở lại immutable và retry, hồ sơ khác cùng UUID bị chặn, hồi quy lịch sử và công cụ Linh. Log `docs/evidence/dynamic-reading/unit.txt`.
- Typecheck và production build riêng đạt. Log cùng thư mục `typecheck.txt`, `build.txt`; giữ cảnh báo workspace nhiều lockfile hiện có, không mở đợt sửa hạ tầng.
- E2E gồm luồng mới và hồi quy bộ duyệt cũ; chạy trên production test3005, input giả lập, thư mục lưu riêng dưới cwd của harness. Kiểm tra 360/390px, A→B→A, reload, đọc snapshot đúng, mở lá số/căn cứ, bài không có claim, quyền nội bộ bắt buộc cả với UUID biết trước và API, origin không hợp lệ bị chặn, hồ sơ không tồn tại không fallback. Không dùng cookie của dev3000.
- Hai lượt đầu có lỗi **selector test** (getByLabel exact bao gồm text option; role alert trùng Next announcer). Đọc DOM/stack để sửa selector, không sửa dữ liệu để test đạt. Lượt sau đạt cả hai ca. Khi xem ảnh, phát hiện CSS chung ẩn nav mobile; chuyển liên kết chọn hồ sơ sang khối văn bản và thêm assertion visibility, kiểm tra lại.
- Đối chiếu baseline107 tệp: **106 không đổi**, riêng `lib/interpretation-rules/execute.ts` thay đổi có chủ đích thêm policy tùy chọn; không đổi mặc định. Bảng xuất1.9.0, catalog, engine/calendar, snapshot audit/mẫu và các bản đọc cũ trong baseline không đổi. Xem `docs/evidence/dynamic-reading/preservation.json`. Không migration hay ghi báo cáo/đơn trong DB.

Giới hạn: đầy đủ theo hợp đồng xuất dữ liệu không phải xác nhận chuyên môn engine/rule; tất cả nội dung còn draft. Hồ sơ cũ không receipt chưa được mở thành bài động mới; người dùng vẫn có luồng lịch sử nguyên trạng. Quyền nội bộ là một vai trò chủ dự án dùng chung, chưa có phân quyền từng nhân sự. Kho tệp private thích hợp môi trường máy chủ hiện tại, chưa dùng để phát hành nhiều instance/public beta.

Kết quả cuối sau sửa liên kết mobile: **2/2 E2E đạt, retries=0**, 14.4s, gồm cả360/390px. Log `docs/evidence/dynamic-reading/e2e-mobile-final.txt`; ảnh `docs/evidence/dynamic-reading/mobile/dynamic-vn-20-390.png` và `dynamic-vn-2-360.png`. Typecheck sau thay đổi cuối đạt. Không phát hành beta hay bật dịch vụ thật; bàn giao để chủ dự án trực tiếp trải nghiệm.
