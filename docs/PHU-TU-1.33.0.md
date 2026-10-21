# Phu Thê / Tử Nữ — 1.33.0

Baseline nội dung 1.32.0; căn cứ npl-evidence-process-1.0.0; engine không đổi. Phương pháp cục bộ mới: `tanbien-spouse-children-1.0.0`. Rule draft, review=null. Đối chiếu văn bản không phải phê duyệt chuyên môn.

## Phạm vi nguồn và triển khai

Tân Biên bản 277 trang: đọc toàn mục Tử Tức PDF/trang in 198–207 và Thê Thiếp/Phu Quân 208–216, đối chiếu ảnh toàn bộ; định nghĩa PDF33 §2.6–2.8. Thiên Lương bản 298 trang: đối chiếu PDF137–140, 164–167; Hàm Số bản 237 trang PDF40–42. Hash, ảnh và ma trận toàn mục ở `.local/phu-tu-20261013/`. Không tuyên bố đọc toàn ba sách.

`phu-tu-content.json` có 56 nhánh; điều kiện, câu biên tập, địa chỉ nguồn và giới hạn từng nhánh là đặc tả dữ liệu được kiểm thử. Dùng evaluator, familyAssessment và chứng nhận sao/Tứ Hóa hiện có. Không thêm một engine hoặc tính lại sao. Các mệnh đề được chọn quy định sao/địa chi trực tiếp, khai báo stateMethod=none; không đổi bảng trạng thái.

Nhánh một chính tinh được nguồn quy định đơn thủ dùng exact; tổ hợp dùng đúng bộ chính tinh. Thiên Tướng–Đào Hoa–Hồng Loan yêu cầu đủ ba đồng cung theo tiêu đề §14.39, không ép Thiên Tướng đơn thủ. Hóa Lộc/Quyền/Khoa Phu Thê phân biệt nam/nữ từ normalized.gender, không suy tình trạng hôn nhân. Tử là vòng Tràng Sinh, khác Tử Phù. Thái Tuế/Phục Binh lấy từ vòng suiqian12/boshi12 đã lưu: chỉ xác nhận âm khi đủ 12 tên vòng hợp lệ, duy nhất; thiếu hoặc sai giữ unknown. Không dùng sao lưu để kích hoạt bản mệnh.

Không thêm điều kiện vắng Tuần/Triệt hàng loạt. Không xuất những vế số lượng con/hôn nhân, sinh sản, sinh tử, quy kết phẩm hạnh hoặc lời khuyên cưới/sinh. Không thay chúng bằng lời tích cực khác. Điều kiện sớm/muộn, lần kết hôn và lượng từ chưa rõ giữ ngoài nhánh thực thi. Ma trận ghi rõ phần đã làm và phần còn lại theo từng mục.

Không áp Thiên Lương như một ưu tiên toàn sách: đoạn PDF165–167 là khung liên hệ và điều kiện cần, chưa thành công thức đủ cho các nhánh cụ thể. Hàm Số bổ sung giới hạn người thân/liên cung; ý giả thuyết về hôn nhân tiếp theo không thực thi. Không có thay thế phương pháp nguồn hiện hành.

## Bảo toàn và phiên bản

Bổ sung hai section/bộ chọn cung; bản mới lưu frozen reading 1.33.0. 8 bản mới dùng nguyên snapshot của bộ ứng viên, có parentId; không sửa lịch sử. Phụ Mẫu chỉ sửa giới hạn trình bày: thay lời mơ hồ về Nhật–Nguyệt bằng yếu tố còn chưa tổng hợp (chú giải khác chiều, sao phụ, liên cung). Claim/điều kiện không đổi.

Hồi quy cùng 192 v2 xác nhận claim, text, trace cũ và các section khác không đổi (Phụ Mẫu chỉ khác ghi chú). Hash 452 bản lịch sử và engine/calendar bảo toàn. Không dùng các snapshot QA sửa sao vào mẫu engine.

## Độ phủ và kiểm thử

192 v2, nhóm loại trừ nhau: Phu Thê 53 chính tinh/tổ hợp + 59 chỉ phụ tinh + 80 chỉ dữ kiện; Tử Nữ 54 + 30 + 108. Không missing-facts trong các nhánh mới trên bộ này; không có nghĩa các đoạn nguồn chưa triển khai đã rõ.

49/56 nhánh có mẫu trong 192 v2. Tìm hữu hạn 576 đầu vào tổng hợp thêm được 5 nhánh. Hai nhánh Thiên Tướng–Đào Hoa–Hồng Loan theo nam/nữ chưa tìm thấy; chưa chứng minh bất khả thi, không tính fixture kỹ thuật là mẫu engine.

- Full unit/integration: 70 file / 2713 test đạt, database test riêng. Không fail/skip.
- Typecheck và production build đạt (build trong QA copy, không đụng .next dev).
- E2E theo phạm vi: 52 lượt cung/mobile 360/390px cho 8 hồ sơ và 5 mẫu bổ sung; API tạo/lưu/mở lại; 8 bản lịch sử; auth và origin guard; không retry.
- Bản production QA kiểm tra: http://127.0.0.1:3027. Server chính 3000 giữ nguyên.

Các expected preview hiện hành được cập nhật cụ thể theo 56 nhánh mới, không sửa golden lịch sử. Kim Thoa: Thái Âm mang Kỵ tại Tử Nữ Hợi, TB PDF204 §13.3.24; 1992: Hóa Khoa tại Phu Thê, nam, TB PDF214 §14.21. Không dùng output làm chuẩn nguồn. Thêm kiểm thử điều kiện đúng/sai/thiếu, bản mệnh/sao lưu, nhóm bắt buộc, sai cung và bất biến snapshot.

## Điểm dừng

11 cung có nội dung cục bộ; Tật Ách chưa có gói. Chưa tổng hợp toàn cung hoặc toàn lá số. Chuẩn bị đọc trọn mục 11 Tân Biên, phần Phụ–Ách Thiên Lương và nhóm Phúc–Mệnh–Thân–Tật Hàm Số; chưa triển khai. Giữ nguyên beta, thanh toán, email và cổng duyệt.
