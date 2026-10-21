# Kho nguồn Tử Vi — đầu mối tra cứu

Cập nhật21/10/2026 từ `main@cee0647`. [Kho riêng/hướng dẫn](../.local/source-library/README.md) · [Danh mục đầy đủ, tác giả, phiên bản, SHA256](../.local/source-library/inventory.json) · [Hồ sơ kiến thức](../.local/source-library/knowledge/README.md) · [Kết quả đối chiếu điểm chặn](../.local/source-library/blocker-results.md) · [Nhật ký mới/checkpoint](../.local/source-library/journals/20261021.json).

Kho sách, chữ đầy đủ, ảnh và hồ sơ dài ở `/Volumes/DATA/TINHLUAN/.local/source-library/`, ngoài Git/phần công khai theo ignore hiện có. Liên kết cục bộ không được khôi phục bằng clone Git; chưa tạo bản sao lưu ngoài máy.

## Danh mục và mức đọc thực tế

| ID | Tài liệu | Tác giả theo tài liệu | Trang PDF | Trạng thái đọc |
|---|---|---|---:|---|
| `tb` | [Tử Vi Đẩu Số Tân Biên](../.local/source-library/books/tb/INDEX.md) | Vân Đằng Thái Thứ Lang | 277 | Kế thừa đọc1–277 |
| `npl` | [Tử Vi Tổng Hợp](../.local/source-library/books/npl/INDEX.md) | Nguyễn Phát Lộc | 442 | Kế thừa đọc1–442 |
| `hs` | [Tử Vi Hàm Số](../.local/source-library/books/hs/INDEX.md) | Nguyễn Phát Lộc | 237 | Kế thừa đọc1–237 |
| `tl298` | [Tử Vi Nghiệm Lý Toàn Thư](../.local/source-library/books/tl298/INDEX.md) | Thiên Lương | 298 | Kế thừa chọn lọc160–163,180–182; chưa đọc hết |
| `tl186` | [Tử Vi Nghiệm Lý Toàn Thư](../.local/source-library/books/tl186/INDEX.md) | Thiên Lương | 186 | Đọc mới1–16,51–53,58–60,109–111 (25trang) |
| `npa` | [Tử Vi Lập Thành và Phụ Đoán](../.local/source-library/books/npa/INDEX.md) | Nguyễn Phúc Ấm | 120 | Đã trích; chưa đọc toàn chương |
| `terms` | [Một số thuật ngữ thường dùng trong Tử Vi](../.local/source-library/books/terms/INDEX.md) | Chưa xác định | 10 | Đọc và kiểm ảnh1–10; còn lỗi OCR nhỏ |
| `ddsn` | [Tử vi đấu sổ tinh thành (thượng hạ biên)](../.local/source-library/books/ddsn/INDEX.md) | Đại Đức Sơn Nhân — theo tên tệp, chờ kiểm nội dung | 898 | Đã trích; chưa đọc toàn chương |
| `toeic` | 600 từ vựng TOEIC | Chưa xác định | 46 | Ngoài Tử Vi; chỉ kiểm kê |

8PDF Tử Vi/7nhóm nhan đề,2.468trang đã trích theo trang; không đồng nghĩa đã đọc hoặc phục hồi mọi bảng/ảnh. Hai Thiên Lương khác hash, số trang/bố cục; chưa chứng minh cùng phiên bản, không gộp offset. Không có bản trùng byte trong danh mục. Tân Biên có mốc1956/ebook2014; NPL lời mở đầu1974/1972; TL186 lời giới thiệu1985; các mốc này không chứng nhận phiên bản in. DDSN là bản dịch máy tiếng Việt theo đầu trang; tên tác giả tạm theo tên tệp, cần xác minh tiếp. Tài liệu thuật ngữ không ghi tác giả trong10trang đã đọc.

Kiểm kê thư mục nguồn `/Users/taiho/Desktop/TAILIEUTUVI`, các PDF Desktop đã được hồ sơ dự án tham chiếu và cây tài liệu dự án; tách HTML tổng quan do dự án sinh,62PDF QA/báo cáo khỏi sách. Không quét sâu bản sao runtime/backup/dependencies để đếm lại. Danh mục không khẳng định bao phủ mọi thiết bị hoặc sách ngoài các đường dẫn đã kiểm.

## Cách dùng

Tra `books/<id>/full.txt` hoặc `pages/NNNN.txt` trước; `pages.json` chỉ bản chữ ưu tiên, chất lượng, trang PDF/trang in, bằng chứng đọc/ảnh/đặc tả riêng. Giữ raw, bản chuẩn hóa, OCR và sửa OCR có nhật ký;45trang được bổ sung OCR. Trang in chưa xác minh để trống/đánh dấu, không tự đồng nhất với trang PDF. Cần bảng, ký hiệu, chữ nghi ngờ hoặc thiếu ngữ cảnh mới mở ảnh/PDF đúng trang.

`rg --no-ignore -n -i 'vô chính diệu|tuần|triệt' .local/source-library/books/*/full.txt`

[Chỉ mục chủ đề](../.local/source-library/topic-index.json) và [ứng viên đề mục](../.local/source-library/chapter-candidates.json) là kết quả máy tìm, chưa phải chứng cứ đã đọc.64hồ sơ kiến thức gồm55nhóm NPL kế thừa và9hồ sơ mới;9audit cũ giữ bản/hash. Đây là bước chuyển có chọn lọc, chưa đặc tả từng mệnh đề toàn kho. Mỗi nguồn giữ riêng điều kiện, vị trí, lượng từ, ngoại lệ, kết quả, dẫn chiếu và phần chưa biết; bản tóm tắt Codex không được gọi nguyên văn.

## Kết quả và điểm tiếp tục

Đọc mới35trang, kiểm ảnh17trang. Đã làm rõ cục bộ cách Thiên Lương xét bộ/tam hợp/xung và phạm vi TT; tìm thấy khác biệt với tài liệu thuật ngữ. Chưa có bằng chứng mới đủ đóng điểm chặn lớn ND: VCD/địa chi–trạng thái, M06/lượng từ, bất nhất TB, phối hợp cùng phương diện, Tật cá nhân vẫn mở. Tật TL186109–111 đối chiếu nội dung TL298160–163 đã có; không phải phương pháp mới giải đủ Tật. Hai mẫu vẫn chưa duyệt/publish.

Tiếp **TL186 PDF17–25**, mục Lộc bắt đầu16; rồi26–35. Sau từng chương lưu nhật ký và hồ sơ; không đọc lại25trang đã khép nếu không thiếu ngữ cảnh. Hoàn tất TL186, đối chiếu TL298 theo mục, rồi NPA/DDSN; TB/NPL/HS dùng nhật ký cũ, bổ sung đúng đoạn thiếu. Phạm vi này thay giới hạn “không đọc toàn sách” của kế hoạch cũ theo yêu cầu mới; không tạo backlog triển khai khác. Codex làm khảo cứu/đối chiếu và đề xuất có lập luận; chủ dự án quyết định sản phẩm/duyệt phát hành, không phải đoán toán tử hoặc chọn câu thắng. Xem [quyết định](DECISIONS.md), ND04–18 trong [backlog duy nhất](V1-DELIVERY-PLAN.md).
