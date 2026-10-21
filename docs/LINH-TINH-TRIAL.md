# Đối chiếu Linh Tinh — công thức thử nghiệm 0.1.0

Ngày thực hiện: 09/10/2026. Đây là công cụ nội bộ riêng, không phải profile Tân Biên hoàn chỉnh. Không đổi engine iztro 2.6.1, lịch, Mệnh chủ, catalog hay bộ duyệt 1.9.0. Quyền truy cập dùng phiên nội bộ hiện có.

## Đặc tả nguồn

Đọc trực tiếp ảnh PDF/trang in 10–11, §8.6.3, Vân Đằng Thái Thứ Lang, *Tử Vi Đẩu Số Tân Biên*, bản PDF chủ dự án cung cấp. Đọc cả quy tắc Hỏa cùng đoạn và các mục kề; không suy giấy phép từ việc có tệp. Phiên bản công thức `tanbien-linh-comparison@0.1.0`, draft, review=null.

| Nhóm chi năm | Điểm khởi Hỏa trong sách | Điểm khởi Linh |
|---|---|---|
| Dần/Ngọ/Tuất | Sửu | Mão |
| Thân/Tý/Thìn | Dần | Tuất |
| Tỵ/Dậu/Sửu | Mão | Tuất |
| Hợi/Mão/Mùi | Dần | Tuất |

Dương nam/âm nữ: Hỏa thuận, Linh nghịch. Âm nam/dương nữ: Hỏa nghịch, Linh thuận. Điểm khởi ứng với giờ Tý (0 bước); Sửu=1,…Thân=8,…Hợi=11. Chi năm dương: Tý/Dần/Thìn/Ngọ/Thân/Tuất; các chi còn lại âm. Dữ liệu âm/dương mâu thuẫn chi năm trả unknown. Không thấy điều kiện loại trừ thêm trong đoạn công thức; điều đó không chứng minh toàn sách không có điều chỉnh.

Phạm vi tương thích: upstream an Linh luôn cộng chỉ số giờ, không nhận giới tính. Công thức Hỏa cũng cần kiểm tra riêng trước khi xây profile: nhóm Hợi/Mão/Mùi trong bảng sách khởi Dần, upstream khởi Dậu. Đợt này **không triển khai hoặc thay Hỏa**. Không thay trường phái toàn cục.

Hàm thuần `lib/internal-review/linh-trial.ts:linhPosition` nhận chi năm, âm/dương, giới tính, chỉ số chi giờ. Không nhận ngày sinh mặc định; thiếu/không hợp lệ trả unknown. Chỉ số địa chi dùng Tý=0, không dùng trực tiếp index cung Dần=0 của upstream.

Adapter `compareLinh` đọc năm âm đã lưu và giờ dân sự đã chuẩn hóa trong snapshot. Hai đoạn giờ Tý 23h và 0h cùng chi giờ 0 cho riêng phép an Linh; không đổi ranh giới ngày/năm của engine. Không chuyển lịch lại. Yêu cầu đủ 12 địa chi khác nhau, đầy đủ danh sách phụ tinh, đúng một Linh và giờ đã biết. Danh sách rỗng không tự trở thành vị trí Linh. Không fallback upstream khi thiếu dữ kiện.

## Bản sao chẩn đoán và phép đếm độc lập

`compareLinh` tạo bản sao cục bộ, chuyển đúng Linh Tinh để đo độ nhạy evaluator, bỏ brightness cũ của sao trong bản sao khi đổi cung vì chưa có phép đối chiếu brightness tại vị trí mới. Không trả bản sao như snapshot engine, không tạo result ID engine mới, không ghi DB. Kết quả có parentResultId, công thức, đầu vào, trace, vị trí cũ/mới, fact/trace/claim thay đổi. Snapshot gốc và nhãn đã lưu giữ nguyên.

Ca riêng chủ dự án: bảng đếm từ Tuất đến giờ Thân là **Tuất → Dậu → Thân → Mùi → Ngọ → Tỵ → Thìn → Mão → Dần**, chín mốc gồm điểm khởi, tám bước nghịch. Upstream tám bước thuận ra Ngọ. Dữ liệu sinh và kết quả chi tiết chỉ ở `.local/chart-comparison-1992-08-07/linh-trial.json` (0600) và lựa chọn hồ sơ kiểm toán riêng trên route được xác thực; không chép vào fixture công khai. Nếu môi trường không có tệp, công cụ báo không tìm thấy, không tạo dữ liệu thay.

## Ảnh hưởng trên bộ mẫu

[Bảng từng mẫu](evidence/linh-trial/impact.md), [JSON đầy đủ](evidence/linh-trial/impact.json). Chạy trên toàn bộ 57 mẫu đã lưu của gói 1.9.0, cộng một mẫu engine mới giả lập. Đây không phải kiểm chứng độc lập engine hoặc luận giải pha trường phái.

- 1 DEMO: vị trí không đổi.
- 20 mẫu engine cũ: 6 vị trí đổi. `vn-tiantong` Linh rời Mệnh (Tỵ → Mão).
- Thêm `linh-entry`: Hợi → Dậu, đi vào Mệnh. Đầu vào giả lập được tìm theo tháng 1–12, giờ 0–23, ngày16 năm2000, nam; dừng ca đầu tiên. Script `scripts/linh-trial-sample.ts`; snapshot riêng `lib/internal-review/engine-samples/linh-trial.json`, không chỉnh sao, không tạo đơn. Không đưa vào bộ duyệt 1.9.0.
- 36 fixture tổng hợp cũ: unknown vì không có đúng một Linh hoặc thiếu danh sách phụ tinh. Không ép chúng thành lá số hợp lệ.
- Các mẫu engine/DEMO không đổi tập claim trong lần chẩn đoán này. Fact ở Mệnh đổi ở hai mẫu ra/vào Mệnh. Một số trace R02/R20 đổi dữ liệu quan sát nhưng không đổi trạng thái hay claim: cần phân biệt **trace đổi** với **kết luận đổi**.
- Hai rule Toàn Thư `combination.ziwei-assistants` và biến thể `-qualified` có điều kiện dùng nhóm sát tinh tại Mệnh. Test kỹ thuật riêng ghép Tử Vi/phụ tá trên bản sao có nhãn fixture để kiểm tra độ nhạy; tuyệt đối không gọi đó là lá số engine.

## Truy cập và tái lập

Đăng nhập `/internal` bằng quyền hiện có, chọn liên kết **Đối chiếu phép an Linh Tinh — thử nghiệm riêng**, hoặc `/internal/linh-comparison`. Chọn `vn-tiantong`, `linh-entry`, `syn-missing-minor` để xem ra Mệnh, vào Mệnh và unknown. Mở bảng đếm và chi tiết kỹ thuật. Chỉ có GET đọc, không nút áp dụng vào engine/snapshot.

- `node --import tsx scripts/linh-trial-impact.ts`: xuất lại kết quả chẩn đoán riêng, không sửa gói 1.9.0.
- Test: `node node_modules/vitest/vitest.mjs run tests/linh-trial.test.ts tests/chart-presentation.test.ts tests/interpretation.test.ts tests/tanbien-review-pack.test.ts`.
- Production test: harness `scripts/reading-stability.mjs prepare/build/start`, cổng3005, DB test riêng theo tài liệu vận hành hiện có; không dùng DB hiện hành. Playwright chọn `linh trial|chart conventions mobile`, retries=0. Không in env/cookie.

## Quyết định còn cần chốt

1. Xác nhận chuyên môn cách hiểu chiều Linh và phạm vi tương thích Hỏa; chỉ sau đó mới đề xuất profile mới có phiên bản riêng.
2. Xử lý mâu thuẫn ví dụ Thiên Quý trong phụ lục, xem hồ sơ điều tra. Giữ Tỵ/Mão là giả thuyết; upstream Mùi bất biến trong ca riêng.
3. Nếu tạo profile mới: định nghĩa đầy đủ sao liên quan, bảng trạng thái, nguồn và di trú opt-in; không sửa báo cáo đã giao. Chưa có phê duyệt chuyên môn.

## Kết quả kiểm tra thực chạy

- **39/39 test, 4 file**: Linh trial (6), chart presentation, interpretation, review pack. Riêng test hữu hạn chạy 288 tổ hợp hợp lệ bên trong một test; không gọi đó là 288 ca xác nhận chuyên môn. Expected nhánh được viết trước từ bảng điểm khởi và phép đi từng cung độc lập.
- Fixture kỹ thuật kiểm tra chiều nhạy: thêm Linh vào Mệnh có Tử Vi/Tả Phù/Hữu Bật làm rule `combination.ziwei-assistants` từ matched → exception; biến thể `-qualified` từ condition-false → matched. Claim tương ứng đổi. Đây chỉ là test logic catalog hiện có, không phải đề xuất phát hành nhận định pha quy ước.
- Typecheck đạt; production build cô lập Next15.5.27 đạt. Build có cảnh báo nhiều lockfile/workspace root, không có lỗi build; không sửa cấu hình hạ tầng ngoài phạm vi.
- Playwright production3005: **2/2 kịch bản đạt, retries=0**, mỗi kịch bản thực hiện ở **360/390px**. Kiểm tra quyền nội bộ, chọn mẫu, unknown, Back, mở trace; hồi quy mở cung, xem hai bảng trạng thái, đổi mẫu và thông tin chung. Lượt đầu phát hiện selector cũ trùng hai lớp hồ sơ và tràn ngang do result ID; sửa selector và xuống dòng ở vùng chẩn đoán, chạy lại đạt. Không che lần lỗi đầu.
- Log: [unit](evidence/linh-trial/unit.txt), [typecheck](evidence/linh-trial/typecheck.txt), [build](evidence/linh-trial/build.txt), [lượt E2E đầu](evidence/linh-trial/e2e.txt), [E2E sau sửa](evidence/linh-trial/e2e-after.txt).
- Ảnh mẫu giả lập: [360px](evidence/linh-trial/mobile/linh-entry-360.png), [390px](evidence/linh-trial/mobile/linh-entry-390.png); ảnh chứa trace mẫu giả lập, không khóa/token/hồ sơ riêng. Đã xem trực tiếp ảnh390 sau chạy.
- [Bảo toàn](evidence/linh-trial/preservation.json): 107 tệp trong baseline có hash không đổi, gồm exports, bộ1.9.0, engine/calendar, catalog/derived/bảng nguồn, các snapshot mẫu cũ và audit riêng. Không truy vấn/ghi database trong đợt này; không khẳng định đã checksum toàn database.

Đã kiểm tra phần mềm và đọc văn bản/ảnh nguồn; chưa được chuyên gia duyệt. Công cụ dừng ở chẩn đoán; không có đường áp dụng phương án mới vào lập lá số.

## Đóng thử nghiệm: cô lập tác động của Linh (09/10/2026)

### Khoảng trống linh-entry được xác nhận

Snapshot `linh-entry` có Mệnh tại Dậu: chính tinh **Thiên Cơ, Cự Môn**; phụ tinh **Văn Xương, Kình Dương**. Khi Linh từ Hợi vào Dậu, `fact.life-local-sat` giữ **recorded**, danh sách sát tinh đổi Kình Dương → Kình Dương/Linh Tinh. Hai rule đều condition-false vì **không có Tử Vi, Tả Phù, Hữu Bật tại Mệnh** (ba điều kiện sai, không phải vì điều kiện sát tinh). `executeRules` kiểm tra điều kiện sai trước ngoại lệ, nên trace không báo ngoại lệ Kình Dương trong ca này. Mẫu chỉ chứng minh vị trí/danh sách sao đổi, không chứng minh nhánh sát tinh đổi trạng thái.

### Đặc tả dùng lập expected trước chạy test

Đã đọc đầy đủ hai rule catalog phiên bản1.1.0 và thứ tự evaluator/derivation:

- Cùng yêu cầu profile VN hoặc CN reference, fact chính tinh, phụ tinh, trạng thái và danh sách bốn sát tinh tại Mệnh; Tử Vi trong chính tinh, Tả Phù và Hữu Bật trong phụ tinh. Không áp ở cung khác.
- `combination.ziwei-assistants`: loại khi Phá Quân cùng Mệnh **hoặc** trạng thái sát tinh `recorded`.
- `combination.ziwei-assistants-qualified`: cần `recorded`; ngoại lệ Phá Quân vẫn chặn. Đây là cổng biên tập, không phải quy tắc mức độ tốt/xấu.
- Cả hai draft, review=null, retain-both, không conflictGroup. Không thay catalog/điều kiện/nguồn; chạy internal-draft riêng để quan sát.
- Claim ID hiện là SHA256 của topic và **nội dung**, không bao gồm snapshot ID. ID giữ nguyên khi nội dung giữ nguyên không chứng minh snapshot giống nhau; provenance và parentResultId phải đọc riêng.

### Bộ ca bổ sung

Quét lại **21 mẫu engine + 1 DEMO** từ bộ cũ và linh-entry. Không tìm thấy cặp engine cô lập đáp ứng các tiền đề còn lại, không Phá Quân/Kình/Đà/Hỏa và chỉ Linh vào/ra. Không mở thêm tìm kiếm ngày sinh vì ưu tiên đóng thử nghiệm; không khẳng định cấu trúc đó không tồn tại trong engine. Dùng fixture tối thiểu, giữ riêng công thức an sao đã kiểm ở đợt trước với phản ứng evaluator ở đợt này.

`lib/internal-review/linh-isolation.ts` tạo bản sao kỹ thuật tại thời điểm xem: thay chính tinh Mệnh thành Tử Vi và phụ tinh thành Tả Phù/Hữu Bật (+Linh cho ca ra). Mã `technical-linh-*` không giả làm result ID engine; gắn nhãn rõ không phải lá số hợp lệ. Không ghi đè các snapshot nguồn. Trước/sau mỗi ca chỉ chuyển Linh; không có Kình/Đà/Hỏa tại Mệnh. Ca vào dùng bố cục của linh-entry, ca ra dùng bố cục vn-tiantong, nhưng **không còn gọi chúng là mẫu engine**.

| Ca | Loại | Fact sát tinh trước → sau | Rule thường | Rule qualified | Claim của hai rule |
|---|---|---|---|---|---|
| linh-entry | Engine giả lập nguyên bản | recorded → recorded | condition-false → condition-false | condition-false → condition-false | không có trước/sau |
| technical-linh-enter | Fixture kỹ thuật | none-recorded → recorded | matched → exception | condition-false → matched | bỏ thường, thêm qualified; text và ID khác |
| technical-linh-leave | Fixture kỹ thuật | recorded → none-recorded | exception → matched | matched → condition-false | bỏ qualified, thêm thường; text và ID khác |
| technical-linh-missing | Fixture kỹ thuật | fact không tồn tại | missing-facts | missing-facts | không xuất; phép đối chiếu unknown |
| technical-linh-empty | Fixture kỹ thuật | none-recorded → recorded | condition-false → condition-false | condition-false → condition-false | vẫn thiếu cả hai phụ tá; không xuất |
| Có Phá Quân + Linh | Fixture trong unit test | recorded | exception | exception | không xuất; không bỏ cổng Phá Quân |

Dữ liệu đầy đủ gồm facts, lý do từng condition, claim ID/text trước/sau: [results.json](evidence/linh-isolation/results.json). Tệp này chỉ chứa mẫu giả lập/fixture, không hồ sơ cá nhân riêng. Ca engine không đổi claim; hai fixture cô lập đổi nhánh theo đúng điều kiện đã đọc. Không suy thành tác động chuyên môn có lợi/bất lợi của Linh.

### Dữ liệu thiếu và giới hạn completeness

`deriveFacts` chỉ tạo nhóm fact phụ tinh Mệnh khi có mảng, mọi tên hợp lệ và không trùng. Thiếu trường hoặc phần tử lỗi: không tạo fact, không biến thành mảng rỗng. Khi Tử Vi đã có và không có điều kiện đã biết sai khác, hai rule trả missing-facts. Mảng rỗng hợp lệ cho none-recorded nhưng hai phụ tá cũng không có, nên condition-false. `none-recorded` chỉ nghĩa không ghi trong danh sách, không phải bảo đảm không có sát tinh trên toàn lá số.

**Giới hạn thực sự còn tồn tại:** hợp đồng snapshot không có cờ xác nhận danh sách phụ tinh đầy đủ. Một mảng bị cắt mà vẫn hợp lệ về cấu trúc không thể phân biệt với mảng đầy đủ; ví dụ chỉ giữ Tả Phù/Hữu Bật có thể làm nhánh thường matched. Đây là khoảng trống hợp đồng đầu vào/derivation, không phải lỗi toán tử của evaluator. Không có bằng chứng các snapshot engine đã lưu bị cắt. Không sửa evaluator hay schema trong đợt này. Trước khi nhận dữ liệu nhập ngoài không đầy đủ, cần quyết định metadata completeness và chặn fact vắng mặt nếu không đủ — đề xuất chưa triển khai, cần tác vụ riêng.

### Công cụ và điểm dừng

Cùng route `/internal/linh-comparison`, thêm bốn lựa chọn fixture kỹ thuật. Nhãn **Đối chiếu trạng thái rule** hiển thị cả hai rule phụ thuộc, kể cả không đổi. Mở “Lý do trước/sau” để xem condition/exception. Facts, trạng thái, và claim text/ID là ba lớp riêng; trace đổi không tự nghĩa claim đổi. Không thêm màn hình hoặc evaluator.

Thiên Quý đóng **chưa chốt**, xem bảng phụ lục trong hồ sơ điều tra. Không tạo profile mới, không áp dụng phương án an Linh vào engine, không phát hành claim từ bản sao. Đợt thử nghiệm kết thúc tại đây.

### Kiểm tra thực chạy khi đóng đợt

- **36/36 test**, 3 file: `linh-isolation.test.ts` (5 ca, gồm vào/ra), `linh-trial.test.ts`, `interpretation.test.ts`. Không cộng 288 tổ hợp bên trong test thành 288 test riêng. [Log](evidence/linh-isolation/unit.txt).
- Typecheck và production build cô lập đạt; cảnh báo workspace nhiều lockfile có từ trước, không sửa hạ tầng. [Typecheck](evidence/linh-isolation/typecheck.txt), [build](evidence/linh-isolation/build.txt).
- **1 E2E đạt**, retries=0, production cổng3005, thực hiện ở cả360/390px: xác thực nội bộ, đổi mẫu engine/fixture, mở lý do rule, hai chiều chuyển trạng thái, unknown và Back; không tràn ngang. [Log](evidence/linh-isolation/e2e.txt), [ảnh vào390](evidence/linh-isolation/mobile/technical-linh-enter-390.png), [ảnh ra360](evidence/linh-isolation/mobile/technical-linh-leave-360.png). Đã xem trực tiếp ảnh vào390.
- [107 hash baseline không đổi](evidence/linh-isolation/preservation.json). Không ghi database, không sửa engine, catalog hoặc bộ duyệt1.9.0. Tệp kết quả đợt này riêng, không ghi đè bảng ảnh hưởng đợt trước.
- Công thức Linh vẫn0.1.0; chỉ bổ sung dữ liệu so trạng thái rule và fixture chẩn đoán. Không có phê duyệt chuyên môn mới. Không bật beta/thanh toán/email. Dừng ở kết thúc thử nghiệm.
