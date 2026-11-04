# Đọc và áp dụng Sơ cấp giảng nghĩa — 04/11/2026

Baseline `main@a49128f`; tracked/index sạch đầu phiên, giữ hai thư mục untracked `buu-dinh-7parts/`, `docs/design-handoff/`. Chủ dự án cung cấp sách và yêu cầu đọc, áp dụng. Đã nối **bốn đoạn phương pháp** vào factory đầu vào bài mới, retrieval `paid-retrieval-1.16.0`. Không phải bốn lời luận cá nhân mới hoặc nghiệm thu thương mại.

## Bản sách và phạm vi đã kiểm

Bản cung cấp: *Vương Đình Chi — Trung Châu phái Tử Vi Đẩu Số sơ cấp giảng nghĩa*, 305 trang PDF, SHA-256 `76a4c21032f603643cc87d47285bc7f3f6684c164d4d9f47a233c0cfc3e39a77`. Trang đầu ghi tác giả; chân trang tự ghi **biên dịch tự động bằng máy dịch của nhóm Tử Vi Cổ Học**. Đây là bản dịch máy được chủ dự án cung cấp, chưa phải đối chiếu nguyên bản Trung văn hoặc ấn bản xuất bản đã xác thực. Không đồng nhất với *Thâm tạo giảng nghĩa* hay hai tập Tứ Hóa Phái của Nguyễn Anh Vũ.

Đã trích 305/305 trang vào kho private; **không gọi đó là đã đọc toàn sách**. Đọc các trang 73–75, 189–190, 199–200, 206–207, 211–212, 216, 239, 249–250; kiểm ảnh 1, 74, 75, 189, 190, 200, 207, 239, 249, 250. Trang 75 có hình 5–6, bổ sung phần hình còn thiếu ở phiếu web W18. Số trang trong mục lục cũ không trùng số trang PDF hiện tại; mọi locator dưới đây dùng số trang PDF.

Giữ nguyên chữ trích, không âm thầm sửa dịch/OCR. Các từ như tên sao dịch thành danh từ thông thường, lỗi chữ ở trang 207 và ví dụ Giáp Tý/1994 trang 75 được ghi để kiểm nguyên bản, không đưa vào facts. Việc nhìn thấy hình không đồng nghĩa đã đặc tả được mọi toán tử, độ sáng, Tuần/Triệt hoặc chuỗi mượn sao.

## Phần đã áp dụng vào đầu vào mới

Các đoạn vẫn là nhóm **D, phương pháp tham khảo**, không nâng thành A/B hoặc lời cá nhân. Mỗi tác giả có phần diễn ý riêng trong unit; không gộp hai cách phân loại thành một quy luật chung. Tên sách chỉ ở đầu vào/căn cứ, quy tắc không đưa tên sách vào lời khách hàng giữ nguyên.

### Nô Bộc — xác định đúng chủ thể

Trang 239 dùng Phụ Mẫu tham khảo người trên, Tử Nữ tham khảo người trực tiếp được mình dìu dắt, Huynh Đệ tham khảo người ngang vai trong ngữ cảnh quan hệ công việc. Bổ sung vào `thp2-no-relationship-scope`, giữ riêng cách xác định phạm vi Nô của Tứ Hóa Phái đã có.

Giá trị: tránh lấy lời về người dưới quyền hoặc người cùng vai thành kết luận về mọi bạn bè. Điều kiện: chỉ khung đọc chủ thể; không chứng minh lòng trung thành, sự vụ lợi hoặc trợ lực thực tế. Trang 249 về Thiên Lương và Lộc/Quyền/Khoa còn cần kiểm lượng từ và đối chiếu bản *Thâm tạo*; không chọn đoạn thuận ý để tuyên bố bạn bè giúp đỡ.

### Tử Tức — liên cung và vô chính diệu

Trang 200 đặt Tử đối Điền, tam hợp Phụ và Nô trong bối cảnh gia đình lớn, có phân biệt tình cảm hai thế hệ. Trang 73–75 giải phương pháp mượn hệ sao đối cung khi vô chính diệu, không chỉ nhặt chính tinh; cũng xét cung liên quan vô chính diệu. Bổ sung vào `thp2-tu-family-scope`.

Giá trị: có căn cứ cho cách đặt câu hỏi liên cung và tránh đọc riêng một cung trống. Chưa triển khai toán tử mượn sao; **Cơ–Cự ở Điền vẫn ở Điền**, không chuyển thành tọa Tử, không bỏ Triệt/phụ tinh hoặc tự gán độ sáng. Không lấy số con, giới tính, sinh sản, phẩm chất hay thành tựu của trẻ làm lời lấp chỗ thiếu. Phương pháp có mặt không tự làm Tử thành bài sâu đủ căn cứ.

### Tài Bạch — tách thu, nhịp thu và giữ

Trang 207 phân biệt cách kiếm tiền, nhịp thu và khả năng giữ; Tài đối Phúc, tam hợp Mệnh và Quan. Bổ sung vào `thp2-tai-transaction-spending`, tách rõ khỏi phương pháp chi tiêu qua Tử của Tứ Hóa Phái.

Giá trị: yêu cầu bài phân biệt ba phương diện, dùng lời Mệnh/Quan/Phúc đúng chủ thể trước khi tổng hợp. Không suy thời điểm phát tài từ nguyên cục, không dùng khung này làm bằng chứng quản lý tốt hoặc có tài sản. Trang 211–212 của *Sơ cấp* không thay thế nhánh Liêm độc Dần/Thân về quản lý trong bản *Thâm tạo* W15; lời của Thiên Phủ không chuyển sang Liêm. **Chưa có phép Liêm–Hao được nguồn này xác nhận.**

### Phu Thê — đọc tương tác, không cộng nhãn sao

Trang 189–190 yêu cầu xét Phúc, Quan, Di và đối chiếu Mệnh; nhãn cát/hung đơn lẻ không đủ, muốn bàn tương tác cụ thể của hai người cần dữ kiện cả hai. Bổ sung vào `thp2-phu-combination-scope`, vẫn giữ điều kiện ba sao Phá–Đà–Hỏa cùng Phu và các giới hạn của đoạn nguồn cũ.

Giá trị: có phương pháp chọn các góc nhìn thay vì lặp danh sách sao. Không suy tính cách người phối ngẫu từ một lá số, không áp ví dụ bệnh/ngoại tình/kết cục trong sách. **Không có phép chế hóa Phá–Đà–Hỏa mới.** Không đổi các vế nguồn khó chấp nhận thành lời nhẹ hơn rồi gắn cùng căn cứ.

## Tích hợp, phiên bản và dữ liệu riêng

- `lib/ai/paid-library.ts`: thêm book key `vdcsc`, chỉ chấp nhận unit `method` từ bản dịch này; kiểm SHA trang như nguồn cũ. Đọc `index-v116.json` trước các index cũ. Nếu file mới không tồn tại thì dùng tập cũ; nếu tồn tại nhưng sai schema thì từ chối, không lén dùng bản cũ. Trang thiếu/đổi hash loại unit tương ứng.
- `lib/ai/paid-input.ts` và `contract.ts`: thêm retrieval 1.16, giữ mọi literal cũ. Prompt 2.8, Reading V2, facts 1.1, guide 1.1 không đổi. GET/lưu đọc attempt cũ vẫn dùng input đã lưu; không dựng lại lịch sử bằng nguồn mới.
- Kho mới 17 unit, chỉ mở rộng 4 unit phương pháp trong **index riêng**; ID là vị trí luận điểm cũ, digest mới truy được nội dung/điều kiện/nguồn. Index cũ không ghi đè. Giữ trần 14.000 byte và số nguồn; không tăng ngân sách để nhét sách.
- Không thay renderer, Mệnh V1/Luna, engine, thanh toán, quyền, job, retry hoặc gói bán. Không chuyển phương pháp vào bản đồ 11 cung/bài chuẩn đã lưu; những bản đó tiếp tục là artifact đối chứng 1.15.

Private: [bản nguồn](../.local/source-library/books/vdcsc/source.pdf), [nhật ký đọc](../.local/vdc-intro-apply-20261104/source-review.json), [script dựng index](../.local/vdc-intro-apply-20261104/build-index.py), [index mới](../.local/source-library/knowledge/paid-passages/index-v116.json), [bundle 37 artifact có hash](../.local/vdc-intro-apply-20261104/private-bundle-manifest.json). Bundle chứa index và trang/receipt cần dùng, không hồ sơ khách; sách gốc và toàn văn giữ ngoài Git. Inventory thêm một mục, các mục cũ bảo toàn, có bản inventory trước sửa. Git riêng không đủ để chuyển kho nguồn sang máy khác.

## Kiểm thực tế

Dry-run 11 input trên snapshot QA đã lưu bằng factory chung, chặn network và không kết nối DB: 159 facts/cung giữ nguyên; mọi ID nguồn, thứ tự và nội dung A/B/C giữ nguyên. Đúng một unit D thay đổi ở mỗi Nô/Tử/Tài/Phu; bảy cung còn lại không đổi nguồn. Dung lượng library mới: Nô 8.247, Tử 2.660, Tài 10.295, Phu 6.896 byte, dưới trần. Các nhánh Tử Lộc/Kỵ và Tài Thai/Tọa không đạt điều kiện vẫn bị loại. Tật vẫn không thêm lời cá nhân.

Mười bài biên tập cũ và trạng thái Tật insufficient qua validator với cả input cũ lẫn mới. **Đây là kiểm tương thích/schema, không chứng nhận nghĩa văn hoặc chất lượng model.** 189 file input/bài/index cũ giữ hash. [Script](../.local/vdc-intro-apply-20261104/check.ts) · [kết quả](../.local/vdc-intro-apply-20261104/mock-summary.json).

209 test riêng biệt tại 10 file đạt sau sửa: library, adapter, web-source, context-guide, book-context, foundation-scope, scope-input, editorial, V2, source-fidelity. Có 5 ca mới cho nguồn dịch máy: nhận phương pháp, từ chối direct/foundation, đổi hash và index mới hỏng. Lượt đầu 187/190 đạt, 3 ca scope-input giữ version 1.15; sửa expected factory hiện hành sang 1.16 rồi chạy lại đúng file 11/11. Không đổi expected lịch sử hoặc lời nguồn. Source-fidelity thêm lượt 19/19. Log giữ riêng, không cộng lượt chạy lại thành test mới.

Typecheck lần đầu phát hiện thiếu literal 1.16 và hai JSON private chưa chép vào bản build cách ly. Đã thêm literal tương thích và chép đúng hai phụ thuộc hiện có (không force-add Git); typecheck lần hai và build đạt. Build có cảnh báo nhiều lockfile do bản sao lồng trong repo; không sửa config runtime để làm mất cảnh báo. Không ghi `.next` của web đang phục vụ, không mở `.env`/key cho build. Không kiểm UI/mobile lại vì không sửa UI; không E2E/PDF xuất báo cáo. Đọc/render PDF nguồn không phải test xuất PDF sản phẩm.

**0 CREATE, 0 GET model, 0 DB, 0 worker, 0 deploy.** Chưa cập nhật bất kỳ checkout QA nào. Không tuyên bố kiểm runtime của web bằng kết quả build cách ly.

## Kết luận và điểm tiếp tục

Đã nhận sách và áp dụng phần rõ nghĩa trong phạm vi bốn cung, chưa đọc toàn bộ 305 trang, chưa nâng điểm thương mại. Checklist kế thừa giữ: Phụ 90%, Phúc 90%, Điền 90%, Quan 90%, Nô 90%, Di 90%, Tật 90%, Tài 90%, Tử 90%, Phu 90%, Huynh 90%. Đây là **tiến độ hồ sơ**, không phải phần trăm chất lượng hay sẵn sàng thu phí. P09 Tài vẫn partial; chưa có bài model dùng 1.16.

Phần cần bổ sung có mục tiêu: bản Trung văn/ấn bản rõ của chính các trang Sơ cấp đã đọc để đối chiếu điều kiện và hình; *Trung Châu phái Tử Vi Đẩu Số thâm tạo giảng nghĩa* của Vương Đình Chi, các mục Thiên Lương/Giao hữu, Thiên Cơ/Tử nữ, Liêm Trinh/Tài bạch, Phá Quân/Phu thê đã định vị ở W13–W16. Không yêu cầu tìm lại bản Sơ cấp vừa nhận, không giả định có thêm sách thì Tật tự đủ phạm vi an toàn.

Điểm tiếp tục chính xác: xác minh nghĩa nguyên bản những nhánh trên trước khi nhập lời cá nhân; các trang còn lại chưa có dấu đọc trong `books/vdcsc/pages.json`. Chưa có quyền API mới, publish hoặc cập nhật QA3062/3070. Không tự mở gói mới.
