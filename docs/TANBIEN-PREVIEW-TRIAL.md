> Cập nhật tiếp theo: [Bài từ rule và đối chiếu PDF trực tiếp](TANBIEN-RULE-READING.md). Phần dưới là biên bản lịch sử của lượt ba rule / bảng 1.0.0, không phải trạng thái hiện tại.

# Thử ba rule Tân Biên và bài đọc 1.1 — 08/10/2026

## Đường dẫn

- Bài biên soạn cố định mới: http://localhost:3000/internal/editorial/demo-wuqu-tianfu?v=1.1
- Bản 1.0 giữ lại: http://localhost:3000/internal/editorial/demo-wuqu-tianfu?v=1.0
- Thực thi ba rule trên snapshot đã lưu: http://localhost:3000/internal/editorial/demo-wuqu-tianfu?view=rules
- Có thể chọn bộ mẫu kiểm thử hiện có trong trang rule. Nhãn phân biệt engine từ đầu vào giả lập với fixture kỹ thuật. Chọn sai mã không fallback sang mẫu DEMO.

Cần đăng nhập nội bộ trên localhost:3000. Beta, quyền của người đọc, bản sandbox 3002 và các bản đọc đã giao không được mở rộng hoặc thay thế.

## Các phiên bản và phạm vi thay đổi

- `lib/internal-review/editorial/demo-wuqu-tianfu-v1.1.json`: `demo-vu-phu-editorial-1.1.0`; tệp 1.0 không sửa. Giữ 21 paragraph ID và danh sách mã tham chiếu.
- Chuyển ghi chú quy trình biên soạn của các đoạn 1, 3, 4, 5, 9, 11, 13, 17, 20 vào căn cứ. Đoạn 9 rút gọn nhưng giữ khác biệt Thái Thứ Lang/Vương Đình Chi. Câu hỏi E có nhãn “Gợi ý tự đối chiếu”. Giữ giới hạn về bằng cấp, chức vụ, tài chính, Tuần/Triệt cạnh nhận định; không thêm kết luận.
- `components/EditorialHashNavigation.tsx`: chỉ mở details đích thuộc danh sách hồ sơ cho phép, focus summary và cuộn sau khi mở; xử lý click, hashchange, popstate và hash ban đầu. Không tự đóng hồ sơ đã mở khác, không mở toàn bộ hồ sơ. Summary vẫn là phần tử native để đóng/mở bằng bàn phím.
- Catalog `interpretation-1.5.0`: thêm `tanbien.r02`, `tanbien.r05`, `tanbien.r06`, từng rule `0.1.0`, draft/review=null. Tổng 9 rule dữ kiện + 21 rule diễn giải/phương pháp; 0 approved.
- `lib/interpretation-rules/tanbien-source.ts`: bảng `tanbien-wuqu-state@1.0.0`, chỉ Tý → Vượng. Không nhập những vị trí chưa có đối chiếu tài liệu. Không thay brightness engine.
- Derivation `1.4.0`: thêm dữ kiện Tài Bạch (sao, số chính tinh, nhóm địa chi) và lookup bảng nguồn riêng. Thiếu/mơ hồ không tạo dữ kiện phủ định. Giữ evaluator, các toán tử, trace, chống trùng/xung đột hiện có; không tạo engine khác.
- Schema nguồn cho phép thêm đường dẫn nội bộ giới hạn `/internal/editorial/<slug>#<anchor>` để dẫn tài liệu đã cung cấp; không bịa URL PDF công khai. HTTPS vẫn được hỗ trợ, không nhận javascript/data URL.
- `components/TanBienResults.tsx`: chạy subset ba rule từ **catalog hiện có** bằng `executeRules(..., "internal-draft")`. Bài cố định không được coi là bài do evaluator sinh. Raw trace và trạng thái UI cùng hiển thị; thiếu-facts/missing-evidence/wrong-profile không thành kết luận ngược.

## Bảng nguồn và giới hạn

| Rule | Điều kiện | Nguồn theo tài liệu cung cấp | Giới hạn |
|---|---|---|---|
| tanbien.r02 | Vũ Khúc trong majorStars Mệnh; Văn Khúc trong minorStars cùng Mệnh; vị trí có trạng thái miếu/vượng/đắc ở bảng Tân Biên | Tân Biên tr.34–35, tr.67; F01–F02/R02 trong HTML | Bảng chỉ biết Tý. Vương Đình Chi (Cổ Học) có hướng đánh giá khác; không hòa giải. Không suy bằng cấp/trí thông minh/năng khiếu |
| tanbien.r05 | Tử Vi + Thiên Tướng cùng majorStars Quan Lộc | Tr.158 mục 8.1; tr.162 mục 8.11 | Không thêm brightness; chưa xét toàn bộ hội chiếu/ngoại lệ; không suy chức vụ/nghề/thời điểm thành công |
| tanbien.r06 | Tài Bạch Dần hoặc Thân; majorStars đúng một sao Liêm Trinh | Tr.190 mục 12.2 | Phụ tinh được phép; chưa tổng hợp Tuần/Triệt và cung liên quan; không hứa thu nhập/giàu có |

**Mức kiểm tra nguồn:** đã trực tiếp đọc HTML do chủ dự án cung cấp và đối chiếu nội dung phiên bản đã nhập. HTML ghi tác giả đã xem ảnh trang 35; chưa trực tiếp có/đọc lại ba PDF gốc trong lượt này. Bảng Tý là bản chép theo hồ sơ đó, không phải xác nhận độc lập. Các trang sách, khác biệt W1, quyền nội dung và ngoại lệ toàn tổ hợp vẫn cần người phụ trách nguồn/kiểm duyệt xác nhận. Không coi ba điều kiện cục bộ là đủ để luận toàn lá số. `exceptions=[]` không có nghĩa không có ngoại lệ.

## Ma trận thực tế đã chạy

Các hàng thay sao/chi/nhãn là fixture kỹ thuật tổng hợp, không phải lá số hợp lệ từ engine. Expected dựa trên điều kiện, không chụp output làm chuẩn chuyên môn.

| Ca | Loại | Kết quả UI | Trace / lý do |
|---|---|---|---|
| DEMO đã lưu — R02, R05, R06 | Snapshot engine đã lưu | matched × 3 | Đủ điều kiện cục bộ; 3 previewClaims, 0 approvedClaims |
| R02 Văn Khúc sang cung khác | Kỹ thuật | not-matched | condition-false: không ở minorStars Mệnh |
| R02 không có Vũ Khúc tại Mệnh | Kỹ thuật | not-matched | condition-false: không ở majorStars Mệnh |
| R02 không có Vũ Khúc, đồng thời địa chi chưa có bảng | Kỹ thuật | not-matched | AND có điều kiện đã biết sai; không cần suy giá trị unknown |
| R02 Mệnh Ngọ chưa có bảng | Kỹ thuật | unknown | missing-facts: chưa có lookup nguồn, không lấy brightness engine |
| R02 engine gắn Hãm, nguồn Tý Vượng | Kỹ thuật | matched | Giữ nhãn Hãm trong input; quyết định bằng bảng nguồn |
| R02 thiếu minorStars | Kỹ thuật | unknown | missing-facts |
| R02 minorStars=[] | Kỹ thuật | not-matched | condition-false |
| R05 bộ sao ở Mệnh, Quan Lộc rỗng | Kỹ thuật | not-matched | condition-false: đúng sao sai cung |
| R05 hai sao ở hai cung | Kỹ thuật | not-matched | condition-false |
| R05 xóa brightness | Kỹ thuật | matched | Đoạn nguồn không yêu cầu trường này |
| R06 thêm phụ tinh | Kỹ thuật | matched | Vẫn đúng một chính tinh |
| R06 thêm chính tinh | Kỹ thuật | not-matched | count khác 1 |
| R06 đúng sao nhưng Tài Bạch tại Tý | Kỹ thuật | not-matched | Không thuộc Dần/Thân |
| R06 Liêm Trinh ở Mệnh, Tài Bạch rỗng | Kỹ thuật | not-matched | Sai cung |
| R06 thiếu majorStars | Kỹ thuật | unknown | missing-facts; không thành mảng rỗng |
| R06 Liêm Trinh độc thủ Tài Bạch Dần | Kỹ thuật | matched | Nhánh Dần của điều kiện |

## Xác minh phần mềm

- **141/141** test, 8 file: tanbien, interpretation, preview-rules, combination, reading, editorial-preview, content-matrix, content-coverage. Bảo toàn dữ liệu đầu vào trước/sau thực thi; draft không đi vào customer approvedClaims; mã đoạn/căn cứ giữ nguyên. Log `docs/evidence/tanbien-tests.txt`.
- Typecheck đạt. Build bản sao riêng đạt, không làm hỏng dev server: `docs/evidence/editorial-v1.1-build.txt`.
- E2E Chrome đạt **1/1 scenario**, 7,6 giây: chặn chưa đăng nhập, 360/390px, căn cứ mở, liên kết click/Enter, focus, Back và URL hash mới, bản 1.0, ba matched trên snapshot, đổi fixture không giữ matched cũ, beta 3000 vẫn tắt, không tràn ngang cấp trang.
- Lượt E2E đầu dùng chuyển hash trong cùng document nhưng kỳ vọng state mở bị reset. Kỳ vọng đó sai với yêu cầu giữ trạng thái; đã đổi kiểm thử URL trực tiếp sang document mới, không sửa UI để tự đóng hồ sơ.
- Đã xem ảnh `exports/editorial-preview-v1.1/reading-390.png`, `evidence-360.png`, `rules-390.png`. Có đủ ảnh 360/390px. Không chứa khóa/token.

Kiểm thử phần mềm không xác nhận nguồn, bảng sao hoặc khả năng dự đoán. Không thêm AI/scoring, không gửi email hoặc bật thanh toán/beta công khai.

Đối chiếu cuối bằng SELECT read-only: snapshot/document/versions của edition cũ bằng bản export trước sửa. Evaluator giữ logic AND rõ ràng: điều kiện đã có dữ kiện và sai → not-matched; nếu chưa có điều kiện sai mà còn thiếu dữ kiện bắt buộc → unknown. Không suy unknown thành false. Ca này đã được kiểm thử riêng.

Nghiệm thu hash cuối: mở URL hash từ document mới cùng origin /internal để giữ đúng ngữ cảnh cookie SameSite Strict; thêm kiểm tra location.hash và thuộc tính open. Chẩn đoán Chrome riêng cũng mở trực tiếp URL hash ba lần thành công. Có cơ chế chờ phần đích nếu DOM còn đang stream; không coi giả thuyết streaming là nguyên nhân duy nhất đã xác minh của các lượt E2E lỗi. Kết quả cuối trong `docs/evidence/editorial-v1.1-e2e.txt`: 1/1 đạt (7,6 giây).
