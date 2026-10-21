# Thống nhất đường đi preview — 2026-10-07

## Kết luận audit trước thay đổi

Không tìm thấy AGENTS.md trong repository hoặc các thư mục cha đã kiểm tra. Đã đọc README, tài liệu kiến trúc/preview và mã schema, derived facts, evaluator, catalog, template, customer projection, trang nội bộ và xác thực.

Preview 1.0.0 nằm tại `lib/internal-review/preview.ts`: năm chú giải có điều kiện `.majorStars.some(star.name === ...)` theo đúng cung và `isBodyPalace`. Không phải năm đoạn luôn hiện với mọi lá số, nhưng **không chạy qua evaluator**. Catalog tám rule (sáu mô tả dữ kiện, hai draft cũ) không bao gồm chúng. Trang đọc đúng một báo cáo theo cấu hình server. Đây là hai đường sinh nội dung khác nhau; giao diện cũ chưa giúp người kiểm tra phân biệt rõ.

## Đường đi hiện tại

Thông tin sinh → `lib/calendar` chuẩn hóa → `lib/tuvi-engine` tính → snapshot lưu cùng đơn → chọn báo cáo đã lưu tại `/internal` → `deriveFacts` 1.1.0 → `executeRules(..., 'internal-draft')` → kiểm tra profile/dữ kiện/evidence/điều kiện/ngoại lệ → khử trùng/xử lý xung đột → `previewClaims` → template preview 2.0.0.

Chỉ có **một catalog** ở `lib/interpretation-rules/catalog.ts`, một evaluator ở `execute.ts`. Catalog interpretation-1.1.0 gồm 16 rules:

- Sáu đặc tả dữ kiện cũ.
- Hai draft cũ `draft.overview.tong`, `draft.career.palace`.
- Năm chú giải đã chuyển vào catalog với ID giữ nguyên: `reading.wuqu`, `reading.tianfu`, `reading.ziwei`, `reading.tianxiang`, `reading.body-career` (1.1.0).
- Ba quy tắc ngữ cảnh: `context.wuqu-ji`, `context.ziwei-quan`, `context.career-labels` (1.0.0). Chép nhãn hoặc đối chiếu hệ nhãn, không phải ba dự đoán mới.

Tổng: 9 rules loại fact, 7 interpretation; **0 approved, 0 reviewer được khai nhận**. Danh sách ngoại lệ rỗng nghĩa là chưa đặc tả, không chứng minh không có ngoại lệ. Metadata phân biệt element-gloss/method-gloss/context/combination; chưa có combination nào.

Mỗi claim mang rule/version, fact IDs, đường dẫn cụ thể tới cung và sao (gồm index sao), điều kiện khớp, nguồn/vị trí, giới hạn và liên kết xung đột nếu có. ID sao độc lập không có trong snapshot hiện tại; evaluator so sánh chính xác tên chuẩn trong mảng sao có cấu trúc của adapter iztro đã khóa phiên bản. Không tìm kiếm trong câu hiển thị. Vị trí Thân dùng trường riêng `fact.body-palace`, không tách chuỗi “Thân cư…” để đoán.

## Chính sách xuất bản

`internal-draft` cho phép xem draft/reviewed/approved với cùng bộ kiểm tra điều kiện và cùng cơ chế xung đột. Retired, synthetic, sai profile/schema, thiếu evidence hoặc dữ kiện vẫn bị loại. Kết quả nội bộ có `approvedClaims=[]`, `previewClaims` riêng và publication đánh dấu nội bộ. Template khách và narrator hiện có từ chối execution nội bộ. Khách vẫn chỉ nhận các claim đã lưu từ luồng approved; không gọi lại evaluator khi xem báo cáo cũ.

Không gọi AI. Nội dung preview là template lấy nguyên claim text từ catalog, không ghép thêm kết luận từ hai sao. Nguồn thiếu ngoại lệ hoặc chưa rõ quyền vẫn được đánh dấu draft/rights pending; quyền đọc nội bộ không cấp quyền phát hành.

## Chọn và kiểm tra nhiều lá số

Đăng nhập như trước tại `http://localhost:3000/internal`. Chọn một trong 100 báo cáo gần nhất, bấm **Xem lá số này**. Mặc định còn dùng báo cáo ghim cũ; không cần chỉnh source để đổi lựa chọn. Có thể chọn lại A sau B, tải lại hoặc dùng lịch sử trình duyệt. Route động, no-store, xác thực trước truy vấn dữ liệu. Tham số URL chỉ chứa ID ngẫu nhiên của đơn; ID không cấp quyền và không chứa ngày sinh/email. UUID không hợp lệ hoặc không tìm thấy báo rõ, không fallback sang lá số khác.

Profile, engine version, result ID và phiên bản nội dung hiện ngay trên trang. “Lần thực thi hiện tại” hiển thị matched/condition-false/missing-facts/missing-evidence/exception/not-approved/conflict… cùng lý do. “Catalog thực sự chạy…” giữ nguyên execution hiện tại. Snapshot và trace báo cáo đã giao nằm ở mục riêng, không bị trình bày như trace mới.

Preview dùng hai chủ đề để kiểm tra nội bộ dù phạm vi gói cũ hẹp hơn; không đổi quyền gói của khách hoặc dữ liệu lưu. Các phần tóm tắt vị trí và bảng sao dùng chung phép chiếu dữ kiện khách; nội dung biên tập không còn điều kiện riêng ngoài evaluator. Câu giới hạn chung và thông báo chưa đủ tổng hợp là văn bản giao diện, không phải claim kết hợp nhiều yếu tố.

## Bằng chứng khác biệt nội dung

Hai dòng đầu đọc báo cáo thực đang lưu; các dòng sau là fixture kỹ thuật tự dựng, không phải xác nhận an sao độc lập.

| Trường hợp | Dữ kiện | Kết quả nội dung |
| --- | --- | --- |
| A, báo cáo đang thử | Mệnh Tý: Vũ Khúc, Thiên Phủ; Thân Quan Lộc Thìn: Tử Vi, Thiên Tướng | Năm `reading.*` khớp; draft phạm vi Quan Lộc cũng khớp; có ba context về Kỵ/Quyền/hệ nhãn |
| B, báo cáo demo khác đang lưu | Mệnh Ngọ: Tử Vi; Thân Quan Lộc Tuất: Liêm Trinh, Thiên Phủ | Chỉ `reading.body-career` và draft phạm vi Quan Lộc; không có bốn chú giải sao tại sai cung; không context |
| Fixture kỹ thuật: chuyển Vũ Khúc từ Mệnh sang Tài Bạch | Mệnh có mảng sao đầy đủ nhưng không Vũ Khúc | `reading.wuqu`: condition-false; chú giải biến mất |
| Fixture kỹ thuật: thiếu mảng chính tinh Mệnh | Không đủ dữ liệu đánh giá | `reading.wuqu`: missing-facts, không gọi là không có Vũ Khúc |
| Fixture kỹ thuật: Thân ở Mệnh / Quan Lộc / hai cung cùng đánh dấu Thân | Điều kiện khác nhau | condition-false / matched / missing-facts |
| Đổi A → B → A trên trình duyệt | Cùng database, không sửa báo cáo | Chú giải Vũ Khúc xuất hiện → biến mất → xuất hiện lại; reload giữ đúng lựa chọn |

Bằng chứng dữ liệu không kèm thông tin sinh/email: `docs/evidence/unified-preview-cases.json`. Hash báo cáo A trước/sau trùng khớp.

## Nguồn và phần chưa giải quyết

Đã truy cập lại Toàn Thư quyển một, mục 諸星問答論 (các câu hỏi Vũ Khúc, Thiên Phủ, Tử Vi, Thiên Tướng); quyển hai mục 定十二宮星辰落閒; tài liệu tác giả iztro mục 身宫在官禄宫. Vị trí nguồn được lưu trong từng rule, không chỉ ở tài liệu này.

Chỉ dùng lớp biểu tượng riêng từng yếu tố. Bản chép có nhắc tổ hợp, nhưng chưa đủ bản in/đặc tả điều kiện, trường phái và ngoại lệ để triển khai quy tắc tổ hợp có trách nhiệm. Không lấy các câu về tuổi thọ, bệnh hoặc giàu nghèo làm kết luận cho khách.

Hai hệ nhãn nhàn cung và Đắc vẫn tách biệt. Context chỉ chạy khi dữ liệu thực có cả hai nhãn Đắc tương ứng tại Thìn; không dùng vị trí Thìn để tự gán nhãn. Mọi tổng hợp phụ thuộc hai hệ này vẫn chưa đủ điều kiện. Không có quy tắc suy kết quả từ nhãn độ sáng, Hóa Kỵ hoặc Hóa Quyền.

Còn thiếu: bản in và đối chiếu bản chép; bản chuyển ngữ được kiểm tra/quyền sử dụng; đặc tả hội chiếu, tổ hợp và ngoại lệ; chuyên gia xác nhận phạm vi áp dụng theo profile; biên bản duyệt. Không có dữ liệu giả để lấp các phần thiếu.

## Kết quả kiểm thử thực tế

- `npm test`: 137/137 đạt, 6 files, 5.43s. Fixture mới kiểm điều kiện đúng/sai cung, Thân đúng/sai/không xác định, thiếu mảng sao, thiếu tứ hóa, nhiều rule, xung đột, ngoại lệ, retired/synthetic bị chặn, không giữ claim cũ, cấm template/narrator khách nhận draft và tính bất biến.
- `npm run test:e2e`: 6/6 đạt, 47.1s. Gồm mobile 360/390, luồng demo/worker/email và legacy; đăng nhập nội bộ, chọn A→B→A, tải lại, căn cứ và đăng xuất. Không tràn ngang.
- `npm run typecheck`: đạt.
- `npm run build`: production build đạt (log kèm trong `docs/evidence/unified-rules-build.txt`).
- Đã xem ảnh mobile; thông tin kỹ thuật nằm trong mục căn cứ/kiểm tra, không lọt vào trang khách. Không đưa khóa truy cập hoặc thông tin sinh vào log bằng chứng.

Các kết quả là kiểm thử phần mềm, không phải chuyên gia xác nhận nội dung hoặc an sao. Không chạy migration, không thay engine/calendar hoặc payment; không ghi lại báo cáo đã giao.
