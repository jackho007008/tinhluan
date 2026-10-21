# Độ phủ nội dung — 07/10/2026

> Số liệu 1.3.0 được giữ để đối chiếu lịch sử. Kết quả hiện hành và thay đổi cách đọc: [OVERVIEW-REVISION.md](OVERVIEW-REVISION.md), [sáu bản trước/sau](OVERVIEW-BEFORE-AFTER.md).

## Phạm vi và cách tái lập

Mở `/internal?view=coverage` sau đăng nhập. Bảng dùng `collectCoverage()` → `loadSample()` → engine/report trong bộ nhớ → `internalPreview()` → evaluator hiện có. Chạy lại khi tải trang/lọc, không cache chéo phiên bản, không đọc đơn khách hoặc tạo đơn/job/email. Thời điểm chạy, phiên bản đo, bộ mẫu, engine, profile và ruleset được giữ trong kết quả. Không thêm rule hoặc sửa engine. `node --import tsx scripts/content-coverage.ts` xuất `docs/evidence/content-coverage.json` và `docs/COVERAGE-READINGS.md` từ chính pipeline đó.

Đã đọc hướng dẫn README, CONTENT-MATRIX-RESULTS, OVERVIEW-COVERAGE, catalog/schema/evaluator/preview trước sửa; không thấy AGENTS.md ở dự án hoặc các thư mục cha đã kiểm tra.

## Định nghĩa chỉ số

- Rule khớp: trace `matched`, trước gom trùng/xử lý xung đột. Chia factual, single, combination, method. Không dùng số DerivedFacts làm số nhận định.
- Claim hiển thị: tập ID duy nhất từ mainNotes + detailNotes sau evaluator xử lý xung đột và preview chuyển chú giải đơn vào mục mở rộng. Chỉ tính single/combination. Main và detail cũng được báo riêng. Claim bị withhold không được tính.
- Factual/context chép vị trí, trạng thái, tứ hóa không được tính vào nhận định theo yếu tố. Method-gloss và lời giới thiệu chung không được tính. Thiên Đồng là rule legacy thiếu metadata được ánh xạ rõ thành single; draft.career.palace ánh xạ method. Các loại chưa biết mặc định method, không tự làm tăng tử số.
- `reading.body-career` hiện mang nhãn method-gloss: giữ hiển thị trên preview nhưng không tính vào tử số theo định nghĩa bảo thủ này. Không gọi nó là nội dung không tồn tại.
- Chủ đề “trống” nghĩa là không có claim single/combination hiển thị theo thước đo này; không có nghĩa giao diện không có dữ kiện hoặc giải thích thuật ngữ. Trace phân biệt missing-facts, condition-false và conflict-withheld. Danh sách facts có sẵn và các rule thiếu căn cứ xem trong từng hàng.
- Các chú giải theo yếu tố truyền thống chưa phải nhận định cá nhân được kiểm chứng. Chỉ số này không đo vận mệnh, độ đúng dự đoán hoặc xác suất thành công.

## Kết quả và mẫu số

Danh mục mục tiêu cố định: 14 chính tinh tại Mệnh + 1 trường hợp Mệnh rỗng. **10/15** có nội dung draft: 9 chú giải sao và 1 giải thích phương pháp cho mảng rỗng. Riêng chính tinh **9/14**. **0/15** có rule approved. Mẫu số này không đại diện mọi tổ hợp/hội chiếu.

Trên mẫu, tử số = số mẫu có ít nhất một claim single/combination hiển thị; mẫu số = số mẫu trong đúng loại dữ liệu và profile:

| Loại và profile | Hai chủ đề | Riêng Tổng quan |
|---|---:|---:|
| Engine VN | 9/10 | 9/10 |
| Engine CN tham chiếu | 1/1 | 1/1 |
| Kỹ thuật VN | 19/32 | 16/32 |

Không gộp các hàng thành tỷ lệ khách ngoài thực tế. Bộ mẫu được chọn có chủ đích, có nhiều ca âm/thiếu dữ kiện; CN chỉ một ca. **24/25 rule** có ít nhất một trace matched trong bộ này. Rule chưa khớp: `context.career-labels` — Quan Lộc tại Thìn, Tử Vi:Đắc và Thiên Tướng:Đắc. Không khớp bộ mẫu không đồng nghĩa chưa có test khác hoặc rule sai.

## Các trường hợp chưa có nội dung theo thước đo

14/43 mẫu không có single/combination hiển thị ở cả hai chủ đề:

- 9 mẫu `other-*`: cố ý đặt sao ngoài Mệnh. Không xuất chú giải Mệnh là hành vi đúng, không phải yêu cầu mở thêm cung.
- `syn-missing-major`: thiếu danh sách sao; phải chặn và nêu thiếu căn cứ.
- `syn-empty`, `vn-2`: vẫn có giải thích Mệnh rỗng, chưa có luận phối hợp/đối cung. Không được tự mượn sao đối cung.
- `syn-body-career`, `syn-body-other`: chỉ vị trí/giải thích phương pháp; không tính là chú giải sao hoặc tổ hợp. Không suy rằng người đó thiếu khả năng nghề nghiệp.

Khoảng trống danh mục: Liêm Trinh, Tham Lang, Cự Môn, Thất Sát, Phá Quân. Trong sáu bản đọc, Phá Quân xuất hiện ở cả hai mẫu phối hợp; nhóm phụ tá không thay thế phần thiếu này. Không có phép tổng hợp toàn lá số được duyệt.

## Kiểm tra chất lượng đọc

Sáu bản tại trang độ phủ và `COVERAGE-READINGS.md` được lấy nguyên văn từ claim, có rule/version/claim ID, dữ kiện, nguồn/vị trí, điều kiện và giới hạn. Gồm:

1. `vn-0`: Thiên Cơ + Thái Âm — hai chú giải riêng, không ghép thành luận tổ hợp.
2. `vn-4`: Tử Vi tại Ngọ — chú giải Tử Vi, không nhận định phối hợp thiếu phụ tá.
3. `vn-20`: Vũ Khúc tại Tuất — chỉ chú giải Vũ Khúc.
4. `engine-combo`: Tử Vi + Phá Quân cùng phụ tá — claim phối hợp, chú giải Tử Vi giữ ở details; Phá Quân ghi thiếu.
5. `engine-exception`: cùng chính tinh nhưng có Đà La — claim có điều kiện khác bản trên; không chuyển thành kết luận xấu.
6. `vn-2`: Mệnh rỗng — chỉ thuật ngữ/phạm vi, không phán tốt/xấu.

Test kiểm sáu cấu hình khác nhau theo chi cung + chính/phụ tinh; hai mẫu có cùng chính tinh khác phụ tinh. Không đếm đơn trùng thành đa dạng. Mọi đoạn đọc phải trùng ID/text trong previewClaims, không thêm luận điểm. Giới hạn chung dùng một đoạn; căn cứ mở khi cần. Đây là kiểm tra biên tập kỹ thuật, không thay duyệt chuyên môn.

## Ưu tiên đợt tiếp theo theo bằng chứng

1. **Kỹ thuật làm ngay:** thêm ca dương và ca thiếu từng điều kiện cho context.career-labels; vẫn tách fixture kỹ thuật khỏi engine input. Tìm đầu vào engine thực cho Thiên Đồng/Thiên Lương và thêm đối chiếu profile tại ranh giới ngày, không sửa output để đạt độ phủ. Chỉ làm những khoảng trống cụ thể này trước.
2. **Nghiên cứu nguồn:** ưu tiên Phá Quân tại Mệnh và đoạn trực tiếp về Tử Vi–Phá Quân vì hai mẫu phối hợp hiện có đều chứa sao này. Chưa cần mở rộng toàn bộ năm sao thiếu cùng lúc. Nếu nguồn không đủ thì giữ trạng thái thiếu, không diễn đạt thay bằng nghĩa hiện đại tự suy.
3. **Quyết định phương pháp/duyệt:** xác định phạm vi phối hợp phụ tá khi có Phá Quân; xử lý hệ nhãn “nhàn cung”/“Đắc” trong rule chưa có mẫu; xác minh ấn bản, quyền chuyển ngữ và chuyên gia duyệt các đoạn đang có. Không đổi lịch/engine để khớp nguồn. Giải thích Mệnh rỗng không tự trở thành quy tắc mượn đối cung.

Đề xuất đợt tiếp theo chỉ gồm kiểm thử context.career-labels và nghiên cứu/đặc tả Phá Quân–Tử Vi trong phạm vi đủ nguồn. Độ phủ cao không đủ điều kiện mở bán; thanh toán demo và ranh giới draft giữ nguyên.

## Kiểm thử thực tế

- 110/110 test liên quan đạt (6 files): coverage, matrix, combination, preview-rules, interpretation, reading. Có kiểm loại factual/method, mẫu số cố định, đếm một lần chú giải chuyển details, thiếu dữ kiện, bất biến report, claim whitelist và đa dạng sáu cấu hình.
- Typecheck và production build đạt; bằng chứng build cuối trong `evidence/content-coverage-build.txt`.
- E2E bảng độ phủ/bộ lọc, auth, sáu bản đọc/căn cứ, 360/390px và hồi quy A → B → A, không tạo đơn/ghi report: `evidence/content-coverage-e2e.txt`.
- Xem ảnh mobile phát hiện ID dài trong căn cứ cần ngắt dòng: dùng class evidence hiện có, bổ sung đo chiều rộng sau mở details. Không tăng claim hoặc sửa catalog để cải thiện chỉ số.

### Ghi nhận E2E sau kiểm tra ảnh

Lượt đầu trước thêm assertion console: 2/2 E2E đạt (46.1s), log `content-coverage-e2e.txt`. Sau sửa ngắt dòng và thêm assertion, coverage E2E ghi một lỗi console `Connection closed.` khi điều hướng trên dev; ca mẫu vẫn đạt. Không ghi nhận lỗi tính chỉ số/claim. Giữ log `content-coverage-e2e-first.txt`. Chạy lại coverage trên server ổn định: 1/1 đạt, không có console error/pageerror, ngắt dòng và chiều rộng sau mở căn cứ đạt (`content-coverage-e2e-retry.txt`). Chưa xác định nguyên nhân lỗi kết nối đơn lẻ; không tuyên bố đã sửa lỗi đó. Không ảnh hưởng số liệu đo từ CLI.
