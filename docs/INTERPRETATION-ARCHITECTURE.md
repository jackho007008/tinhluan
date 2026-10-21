# Pipeline luận giải 1.0.0 — 07/10/2026

## Audit trước triển khai

Đã đọc ENGINE-AUDIT, CALENDAR-CONVENTIONS, ENGINE-VALIDATION, README và mã calendar bridge, iztro, reports, jobs, rules, narration, UI. Không có AGENTS.md tại các vị trí dự án/cha đã kiểm tra. Không sửa engine, profile, migrations, catalog giá hoặc payment/email adapter.

Engine trả ngày âm/dương, giờ, Mệnh chủ/Thân chủ, ngũ hành cục, vị trí Mệnh/Thân,12 cung (can/chi, cờ Thân/lai nhân), chính tinh/phụ tinh/tạp diệu, nhãn brightness/mutagen, các vòng sao và range/ages của upstream. DTO chỉ đưa dữ liệu ra, không đưa các hàm horoscope. Profile VN còn trả calendarEvidence. `lib/interpretation-rules/index.ts` cũ chỉ chép cung/địa chi/chính tinh thành12 câu; `narration` diễn đạt bằng template, không phải diễn giải. Giữ nguyên module này cho tương thích báo cáo cũ.

Cầu nối lịch ảnh hưởng nhiều hơn chính tinh: năm âm/can năm ảnh hưởng can cung, tứ hóa và sao an theo năm; tháng/chi giờ ảnh hưởng Mệnh/Thân, tháng nhuận và sao theo tháng/giờ; ngày âm/cục ảnh hưởng chính tinh và các sao theo ngày; năm/giới tính/cục ảnh hưởng chiều, khởi điểm/range đại vận và ages. Vị trí sao thay đổi kéo theo nhãn độ sáng tra bảng. Các vòng trang trí cũng đọc can chi năm. Mã liên quan: iztro `lib/astro/palace.js`, `lib/star/location.js`, `minorStar.js`, `adjectiveStar.js`, `decorativeStar.js`; bridge `lib/calendar/iztro-bridge.cjs`.

Không có xác nhận độc lập toàn bộ các trường đó. Tính nhất quán/cùng upstream không đủ dùng làm bằng chứng dự đoán. Phiên này chỉ trình bày dữ kiện dưới nhãn engine-reported, chưa xây tam phương/tứ chính, tổ hợp cách cục hoặc suy nghề. Không đổi quy ước để ép khớp nguồn.

## Các lớp

`ChartSnapshot → deriveFacts → executeRules → conflict resolution → approvedClaims → createTemplate → optional narrateClaims`.

- `derived.ts`:6 phép ánh xạ có ID/version: vị trí Mệnh, vị trí Thân, chính tinh Mệnh, nhãn độ sáng/tứ hóa Mệnh, vị trí Quan Lộc, chính tinh Quan Lộc. Tìm duy nhất cung theo tên/cờ; thiếu hoặc mơ hồ thì không tạo fact. Mỗi fact giữ value, text, evidencePaths, giới hạn. Rỗng chính tinh khác thiếu trường. Chỉ chép/định dạng, không đo tính cách hoặc nghề.
- `schema.ts`: Zod strict, schema rule gồm ID/version/kind/topic, profile, facts, conditions/exceptions, template, evidence, source/rights, conflict policy, trạng thái, record review, limitations. Không có confidence. Reviewed/approved phải có record review; có record dạng chuỗi **không tự xác thực con người**.
- DSL chỉ `exists`, `eq` và `includes` (membership mảng). Conditions AND; exceptions OR. Mọi fact trong điều kiện/ngoại lệ/template phải thuộc requiredFacts. Có giới hạn chiều dài/số lượng, không eval, hàm tùy ý, regex người dùng hay vòng lặp trong DSL. Path chỉ own properties dưới chart, cấm prototype/constructor.
- `execute.ts`: invalid schema, ID trùng, synthetic, profile sai, missing facts/evidence, điều kiện sai, ngoại lệ, chưa approved, rights pending đều có trace. Rule không approved có thể ghi điều kiện đã khớp để reviewer xem nhưng không sinh ApprovedClaim.
- Gom trùng theo topic + text chính xác; giữ mọi rule/version/căn cứ. Không dùng semantic AI để đoán hai ý giống nhau.
- Conflict qua conflictsWith (xét cả hai chiều) hoặc conflictGroup. `retain-both` giữ cả hai, liên kết claim ID và trace; không ưu tiên lời tích cực. `withhold-all` chặn toàn thành phần liên thông xung đột để không bỏ mất nhận định đối ứng. Không có trọng số/tự chọn người thắng. Conflict cùng group là chủ đích của người viết rule, không tự suy từ văn bản.
- `reports/interpretation.ts`: chỉ chạy rules thuộc topic đã mua. Lưu ruleset/derivation/schema versions, profile/engine versions nguyên bản, resultId, hash bộ rules/claims, DerivedFacts, traces, manifest ID/version/status và **toàn bộ rule được dùng trong ApprovedClaims**. Draft claimTemplate không đi vào JSON gửi khách. Template trình bày facts riêng, không coi facts là ApprovedClaims.
- `narrateClaims` chỉ nhận ID/text của ApprovedClaims, không birth/email hoặc raw chart. Không có provider/API call mặc định. Candidate hiện chỉ được chấp nhận khi bằng template cả text lẫn IDs; cùng citation nhưng sửa nghĩa sẽ fallback. Đây không phải semantic AI reviewer. AI tự do chưa bật.

## Trạng thái thật của catalog

6 đặc tả rule mô tả dữ kiện và2 bản thảo diễn giải đều `draft`, review=null.6 ánh xạ kỹ thuật DerivedFacts đã có test nhưng **không biến status rule thành approved**. Renderer facts dùng phép ánh xạ xác định, không dùng claimTemplate của rule draft.0 rule chuyên môn đã được duyệt. Không có chuyên gia giả định hoặc approval của AI.

Catalog production chỉ import từ `catalog.ts`; fixture synthetic nằm ở tests, origin=synthetic bị chặn trong purpose customer, kết quả purpose test bị TemplateReport/AI từ chối. Không có API nhập rule hoặc tùy chọn bật test từ trình duyệt. Đây là ranh giới tin cậy của mã server; người có quyền sửa mã vẫn cần quy trình review thực tế, schema không thay chữ ký chuyên gia.

## Báo cáo và tương thích

`lib/reports/index.ts` thêm trường optional `interpretation` vào report JSON. Không thay database/schema. Worker tiếp tục đọc chart snapshot đã lưu và INSERT report ON CONFLICT DO NOTHING. Report đã giao không được render lại từ catalog mới. Type/UI hỗ trợ report cũ không có interpretation bằng nhánh cũ; không backfill hoặc ghi đè.

Hai nhóm hiện có “Tổng quan” và “Sự nghiệp & tài lộc” ánh xạ sang phần mới “Tổng quan bản mệnh” và “Sự nghiệp”; phần tài lộc chưa triển khai. Giữ giá/gói/phạm vi cũ. `InterpretationTopic.tsx` dùng card/details hiện có, không thay stylesheet/bố cục website. “Xem căn cứ” có thành phần lá số, ID/version, nguồn kỹ thuật, cách tạo fact và trace rule; claim được phép trong tương lai có điều kiện/ngoại lệ/xung đột/nguồn của chính claim. Không có draft prose trong phần khách.

ChartSnapshot.versions.rules vẫn mô tả pipeline facts cũ của engine; phiên bản luận giải mới ở report.interpretation.version riêng. Không sửa hash/versions của engine để cập nhật rules.

## Công cụ đối chiếu

`lib/chart-comparison/index.ts`, `scripts/compare-chart.ts`, `fixtures/chart-comparison/`.

```sh
npm run chart:compare -- fixtures/chart-comparison/awaiting-vn.json
npm run chart:compare -- fixtures/chart-comparison/upstream-subset.json
npm run chart:compare -- /private/path/fixture.json /private/path/snapshot.json
```

Fixture chứa input, timezone/dayBoundary/leapMonth/profile/trường phái, nguồn/vị trí/quyền dùng/ngày/record người xác nhận nếu có, confirmedScope, expected từng path, resolution của sai khác. Dùng path chỉ mục cung thì phải ghi rõ thứ tự cung Dần→Sửu của engine; không tự ghép sao khác tên/trường phái. So sánh JSON chuẩn hóa key của object, thứ tự array có ý nghĩa. Input/profile/quy ước khác thì chặn đối chiếu, không đổi engine.

`awaiting-source`: source=null, expected=[]; CLI trả chờ nguồn và không tự sinh expected. `upstream-example` không độc lập; synthetic chỉ test. Comparator không gắn expertConfirmed=true chỉ vì dữ liệu giống hoặc có tên reviewer. Chuyên gia/nguồn có thật và phạm vi phải được kiểm tra ngoài máy. CLI in các thành phần lá số được so sánh: sử dụng file/output riêng tư, không đưa dữ liệu người thật vào repository/log công khai.

## Kiểm tra và giới hạn

Xem RULE-TEST-RESULTS.md. Chưa có migration registry phê duyệt, chữ ký số reviewer, editor rule, AI tự do, bảng quy tắc tổ hợp, scoring hoặc luận vận. Đây không phải phần bị che bằng fixture: UI báo rõ chưa có nhận định được duyệt. Nâng rule phải version mới + evidence review + tests, report cũ giữ nguyên.

## Cập nhật preview 2.0.0

Năm chú giải biên tập trước đây đã chuyển vào cùng catalog và `executeRules` với purpose `internal-draft`; không còn evaluator riêng trong preview. Kết quả nội bộ nằm ở `previewClaims`, không ở `approvedClaims`; template/narrator khách từ chối publication nội bộ. Derivation 1.1.0 bổ sung dữ kiện cấu trúc cho vị trí Thân, chi cung, tứ hóa và trạng thái sao. Catalog 1.1.0 có 16 rules, tất cả chưa approved. Xem `UNIFIED-PREVIEW-AUDIT.md` cho đường đi, bảng kiểm chứng và giới hạn.

## Beta opt-in, chưa phát hành — 2026-10-08

`freezeBeta` chạy preview/evaluator hiện có **khi operator chuẩn bị edition**, chốt văn bản/căn cứ/claim ID/version và snapshot gốc trong bảng riêng. Reader beta không đánh giá lại rule. Draft vẫn draft; không đi qua approvedClaims hoặc customerReport của đơn. Feature flag mặc định tắt và release từng edition là hai cổng độc lập. Đây là nhánh đọc thử có quyền riêng sau quyết định phát hành của chủ dự án, không mở rộng quyền /internal. Trước khi bật, chính sách draft chỉ nội bộ vẫn hiệu lực trên môi trường đang chạy. Không phát hành hoặc gửi mail trong giai đoạn chuẩn bị.


## Bài từ rule: lớp trình bày 1.1.0 — 08/10/2026

Preview Tân Biên dùng catalog/evaluator hiện có và formatter `lib/internal-review/tanbien-presentation.ts` riêng, không sửa DerivedFacts hoặc matching. `buildTanBienReading` giới hạn nhóm Vũ Khúc/Thiên Phủ Mệnh, chỉ sắp xếp claim khớp thành mục có nội dung; dữ kiện, quan hệ hình học và ảnh hưởng chưa tổng hợp là ba lớp tách biệt với claim diễn giải. Căn cứ thông thường không lộ ID/DSL; details kỹ thuật giữ trace và phiên bản. Không ghi report/snapshot/DB; các phiên bản DEMO JSON giữ nguyên. Xem [TANBIEN-RULE-READING.md](TANBIEN-RULE-READING.md) cho phép tính quan hệ, phần chưa đủ nguồn và phạm vi kiểm tra bảo toàn.

### Tân Biên template 1.2.0 — 08/10/2026

Tái sử dụng evaluator/catalog. `presentation.readingTheme`, `sourceConditions`, `projectScope` là metadata tùy chọn cho định dạng, không tham gia quyết định rule khớp. Nhãn loại nội dung dùng `contentType` sẵn có. Formatter vẫn tách khỏi evaluator. Derivation 1.6.0 thêm lookup riêng Tử Vi/Thiên Tướng theo bảng sách 1.0.0; thiếu đầu vào không tạo fact đủ điều kiện, brightness engine không bị đọc thay bảng nguồn. Template 1.2.0 bỏ cổng Vũ/Phủ cứng, chỉ trình bày claim matched của bộ Tân Biên trong quyền nội bộ; các nguồn khác vẫn độc lập. Xem [hồ sơ hiện hành và kết quả](TANBIEN-RULE-READING.md).

### Tân Biên template1.4.0

Vẫn cùng evaluator và catalog; thêm bốn lookup sách có phiên bản và R13–R16 chú giải nền. Formatter tách `nearbyNotes` cạnh đoạn với `contextNotes` trong căn cứ; ghi chú trùng trong một mục chỉ in một lần, mỗi claim vẫn giữ căn cứ đầy đủ. Không dùng dữ liệu biên tập DEMO hoặc source khác để lấp mục. Các nhận định thời gian Nhật/Nguyệt chưa có đặc tả nên không tồn tại trong bộ rule phát ra claim. Snapshot mẫu mới chốt riêng, không có đường ghi đơn/báo cáo trong preview. Xem TANBIEN-RULE-READING cho bảng quyết định và kết quả thực tế.
