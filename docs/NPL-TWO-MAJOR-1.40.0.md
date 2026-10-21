# Hai chính tinh – Bản Mệnh: đặc tả trước triển khai

Baseline 1.39.0. Nguồn: Nguyễn Phát Lộc, Tử Vi Tổng Hợp, bản442trang, SHA256 82f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37. Trang PDF trùng số đầu trang ở các ảnh đã kiểm tra. Phạm vi đọc:107–112 liên tục;22–23,86–89,phụ lục101–102,349–352; đối chiếu Tân Biên52–53,Thiên Lương PDF119–120 bản298trang. Không đọc toàn sách.

## Quyết định
- NPL108 phân biệt hai hệ cấp cung→sao và sao→Bản Mệnh. NPL109, trường hợp3, yêu cầu hai chính tinh đồng cung Mệnh và chỉ nên chú ý hệ cấp thứ hai. Không phải phép so sao này thắng sao kia.
- Triển khai riêng mệnh đề: Bản Mệnh được sao nào sinh thì “thịnh về phía sao đó”, bị sao nào khắc thì “xấu về phía sao đó”. Diễn đạt: thuận/nghịch riêng về phương diện ngũ hành liên quan sao đó. Không xác nhận phẩm chất, năng lực, công danh, tài sản hay hoàn cảnh.
- Sinh: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc. Khắc: Mộc→Thổ→Thủy→Hỏa→Kim→Mộc (108). Chiều từ sao đến Bản Mệnh. Cùng hành, Bản Mệnh sinh sao/khắc sao chỉ ghi quan hệ, không dùng mệnh đề trên để đánh giá.
- Hai quan hệ cùng/khác chiều giữ riêng, không cộng, bù, chọn thắng. Không triển khai “tốt nhất/tệ nhất” vì câu còn nói cả hai hệ cấp; không biến lựa chọn chú trọng hệ thứ hai thành công thức xếp hạng toàn cục.
- Không dùng Cục–Thân111–112: tác giả ghi nhận quan điểm lạ, đề nghị kiểm nghiệm.
- Bảng NPL102: Kim Vũ/Thất; Thủy Cự/Tướng/Đồng/Âm/Phá/Tham; Mộc Cơ/Lương; Hỏa Dương/Liêm; Thổ Tử/Phủ. Đây là bảng NPL riêng, không sửa bảng Tân Biên (đặc biệt Lương), không suy đa hành từ sách khác. Nếu phiên bản bảng không có hoặc giá trị không đơn nhất trong chính bảng đã chọn: unknown.
- Nạp âm NPL349–352: đối chiếu năm can chi đã lưu với bảng riêng và nhãn nạp âm đã lưu; không gọi lại engine. Thiếu hàng Nhâm Thìn/Quý Tỵ trong PDF350: unknown, không điền Trường Lưu từ nguồn khác. Không sử dụng luận hôn phối của chương chứa bảng.
- Tân Biên53 cùng chiều về sao khắc Bản Mệnh nhưng có thêm quan hệ cung; không thay lời TB hoặc suy từ chiều đảo. TL119–120 bàn các điều chỉnh Không/Tuần/Triệt và kết quả khác phạm vi. Không có phép hợp nhất được triển khai. Bài mới chỉ đánh giá quan hệ ngũ hành, không tuyên bố ý nghĩa sao tăng/giảm trọn vẹn hoặc phủ nhận điều chỉnh. Những đoạn về biến cố/phẩm hạnh không dùng.

## Điều kiện kỹ thuật và kết quả
Cổng dữ liệu: majorStars complete và validator chính tinh hiện hành đạt, đúng hai sao bản mệnh duy nhất tại Mệnh; nạp âm đã lưu khớp bảng NPL theo năm âm đã lưu. Cổng toàn vẹn là giới hạn sản phẩm, không phải lời sách. Một/không chính tinh: ngoài phạm vi; không mượn đối cung. Không cần độ sáng cho mệnh đề ngũ hành riêng; không áp điều chỉnh độ sáng hay ngũ hành phụ tinh trong110.

Ba kết quả có lời: chỉ có sao sinh, chỉ có sao khắc, có cả hai. Cùng hành/chiều đảo không có mệnh đề trực tiếp thì không tạo claim. Thiếu/mâu thuẫn bảng hay dữ liệu: unknown. Lời cũ và hai chú giải Thân1.39 giữ nguyên. Quan hệ claim mới: bổ sung phương diện ngũ hành, chưa có phép phối hợp với lời tính cách/tổ hợp; không thay thế.

Phiên bản phương pháp npl-two-major-birth-1.0.0; bảng npl-elements-1.0.0. Rule draft, review=null. Đối chiếu văn bản không phải phê duyệt chuyên môn.

## Đối chiếu hành khác nguồn
TL PDF238 nói Thiên Lương “Mộc đới Thổ” trợ Kim Mệnh; NPL102 dùng Mộc. Trường hợp Kim Mệnh→Mộc là chiều Bản Mệnh khắc sao, không có kết luận NPL mới trong nhánh này, nên không tạo hai lời trái chiều; không tự lấy Thổ của TL vào bảng NPL. TL213 nói Tham Thủy đới Mộc trong ví dụ Tử–Tham; TL166–167/240–241 dùng Tham Mộc khi so với Vũ Kim. Đây không phải chỉ dẫn dùng hành Mộc thay bảng NPL102 trong chính công thức hai chính tinh→Bản Mệnh. Giữ bảng đúng tác giả; chưa hợp nhất các quy ước đa hành giữa nguồn. Không nói bảng NPL là chân lý chung hoặc ngầm thay bảng hiện hành.
