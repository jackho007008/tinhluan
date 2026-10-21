# Kho nguồn Tử Vi — đầu mối tra cứu

Cập nhật21/10/2026 nối `main@093feff`. [Kho riêng/hướng dẫn](../.local/source-library/README.md) · [Danh mục đầy đủ, tác giả, phiên bản, SHA256](../.local/source-library/inventory.json) · [Hồ sơ kiến thức](../.local/source-library/knowledge/README.md) · [Kết quả đối chiếu điểm chặn](../.local/source-library/blocker-results-tl186-complete.md) · [Nhật ký mới/checkpoint](../.local/source-library/journals/tl186-remaining-20261021.json).

Kho sách, chữ đầy đủ, ảnh và hồ sơ dài ở `/Volumes/DATA/TINHLUAN/.local/source-library/`, ngoài Git/phần công khai theo ignore hiện có. Liên kết cục bộ không được khôi phục bằng clone Git; chưa tạo bản sao lưu ngoài máy.

## Danh mục và mức đọc thực tế

| ID | Tài liệu | Tác giả theo tài liệu | Trang PDF | Trạng thái đọc |
|---|---|---|---:|---|
| `tb` | [Tử Vi Đẩu Số Tân Biên](../.local/source-library/books/tb/INDEX.md) | Vân Đằng Thái Thứ Lang | 277 | Kế thừa đọc1–277 |
| `npl` | [Tử Vi Tổng Hợp](../.local/source-library/books/npl/INDEX.md) | Nguyễn Phát Lộc | 442 | Kế thừa đọc1–442 |
| `hs` | [Tử Vi Hàm Số](../.local/source-library/books/hs/INDEX.md) | Nguyễn Phát Lộc | 237 | Kế thừa đọc1–237 |
| `tl298` | [Tử Vi Nghiệm Lý Toàn Thư](../.local/source-library/books/tl298/INDEX.md) | Thiên Lương | 298 | Kế thừa chọn lọc160–163,180–182; chưa đọc hết |
| `tl186` | [Tử Vi Nghiệm Lý Toàn Thư](../.local/source-library/books/tl186/INDEX.md) | Thiên Lương | 186 | Đã đọc186/186; phiên này161trang mới,47trang kiểm ảnh |
| `npa` | [Tử Vi Lập Thành và Phụ Đoán](../.local/source-library/books/npa/INDEX.md) | Nguyễn Phúc Ấm | 120 | Đã trích; chưa đọc toàn chương |
| `terms` | [Một số thuật ngữ thường dùng trong Tử Vi](../.local/source-library/books/terms/INDEX.md) | Chưa xác định | 10 | Đọc và kiểm ảnh1–10; còn lỗi OCR nhỏ |
| `ddsn` | [Tử vi đấu sổ tinh thành (thượng hạ biên)](../.local/source-library/books/ddsn/INDEX.md) | Đại Đức Sơn Nhân — theo tên tệp, chờ kiểm nội dung | 898 | Đã trích; chưa đọc toàn chương |
| `toeic` | 600 từ vựng TOEIC | Chưa xác định | 46 | Ngoài Tử Vi; chỉ kiểm kê |

8PDF Tử Vi/7nhóm nhan đề,2.468trang đã trích theo trang; không đồng nghĩa đã đọc hoặc phục hồi mọi bảng/ảnh. Hai Thiên Lương khác hash, số trang/bố cục; chưa chứng minh cùng phiên bản, không gộp offset. Không có bản trùng byte trong danh mục. Tân Biên có mốc1956/ebook2014; NPL lời mở đầu1974/1972; TL186 lời giới thiệu1985; các mốc này không chứng nhận phiên bản in. DDSN là bản dịch máy tiếng Việt theo đầu trang; tên tác giả tạm theo tên tệp, cần xác minh tiếp. Tài liệu thuật ngữ không ghi tác giả trong10trang đã đọc.

Kiểm kê thư mục nguồn `/Users/taiho/Desktop/TAILIEUTUVI`, các PDF Desktop đã được hồ sơ dự án tham chiếu và cây tài liệu dự án; tách HTML tổng quan do dự án sinh,62PDF QA/báo cáo khỏi sách. Không quét sâu bản sao runtime/backup/dependencies để đếm lại. Danh mục không khẳng định bao phủ mọi thiết bị hoặc sách ngoài các đường dẫn đã kiểm.

## Cách dùng

Tra `books/<id>/full.txt` hoặc `pages/NNNN.txt` trước; `pages.json` chỉ bản chữ ưu tiên, chất lượng, trang PDF/trang in, bằng chứng đọc/ảnh/đặc tả riêng. Giữ raw, bản chuẩn hóa, OCR và sửa OCR có nhật ký;45trang được bổ sung OCR. Trang in chưa xác minh để trống/đánh dấu, không tự đồng nhất với trang PDF. Cần bảng, ký hiệu, chữ nghi ngờ hoặc thiếu ngữ cảnh mới mở ảnh/PDF đúng trang.

`rg --no-ignore -n -i 'vô chính diệu|tuần|triệt' .local/source-library/books/*/full.txt`

[Chỉ mục chủ đề](../.local/source-library/topic-index.json) và [ứng viên đề mục](../.local/source-library/chapter-candidates.json) là kết quả máy tìm, chưa phải chứng cứ đã đọc.78hồ sơ kiến thức:64hồ sơ mốc trước và14hồ sơ nguồn mới; [70ghi chép theo chương/phương pháp TL186](../.local/source-library/knowledge/tl186-reading/README.md), kèm47lượt kiểm ảnh.9audit cũ giữ bản/hash. Đây là bước chuyển có chọn lọc, chưa đặc tả từng mệnh đề toàn kho. Mỗi nguồn giữ riêng điều kiện, vị trí, lượng từ, ngoại lệ, kết quả, dẫn chiếu và phần chưa biết; bản tóm tắt Codex không được gọi nguyên văn.

## Kết quả và điểm tiếp tục

**Đã đọc hết bản Thiên Lương186:**25trang kế thừa +161trang đọc mới;47trang kiểm ảnh mới (cộng7trang trước thành54). Không kiểm kê/trích xuất lại. Đã nối mục Lộc từ16 và khép các chương tới mục lục186. Phụ luận ký Lê Hồng Đức179–182 và bài Thời Lý học182–184 được giữ riêng; không gán mọi câu cho một tác giả. Đọc hết không đồng nghĩa đã hiệu đính mọi chữ/bảng hoặc đặc tả từng mệnh đề.

Đủ căn cứ lưu đặc tả nguồn cục bộ về nhị hợp/xung83–86/155–159, VCDMùi–Kỵ75, chỉ huy/điều kiện lục sát39–43, Lộc16–18/34–37 và giới hạn giáp93–95. VCD/TamKhông có khác biệt giữa chính văn80 và phụ luận183; TT, TứHóa, KhôiViệt và một số bảng còn bất nhất đã ghi địa chỉ/ảnh. **Chưa đóng điểm chặn lớn ND hoặc có rule mới được phép triển khai.** Tật vẫn thiếu phép phối hợp lời từng sao+cứu/tác+Mệnh–Thân–Phúc cho mọi cấu trúc; hai mẫu chưa duyệt/publish.

Không còn chương chưa đọc ởTL186. Nếu được giao tiếp: đối chiếu TL298 theo mục VCD/TamKhông, TT, nhị hợp/xung và Phụ–Ách bằng kho chữ, không suy cùng phiên bản/offset; sau đó mới tiếp NPA/DDSN. TB/NPL/HS dùng audit cũ, không đọc lại chỉ để tạo nhật ký. [Kết quả có bằng chứng âm tính và điểm tiếp tục](../.local/source-library/blocker-results-tl186-complete.md). Backlog duy nhất vẫn [V1](V1-DELIVERY-PLAN.md); ứng dụng/G2/lịch sử/Live giữ nguyên.
