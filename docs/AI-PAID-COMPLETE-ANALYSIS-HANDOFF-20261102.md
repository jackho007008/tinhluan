# Từ phiếu nguồn sang bốn bản luận liền mạch

02/11/2026, baseline `main@72cc31f`. Theo chỉ đạo mới, tập trung phân tích và tổng hợp từ sách đã có; không tiếp tục coi việc chưa tìm được một câu giải sẵn toàn bộ tổ hợp là điều kiện chặn mọi biên luận. Các điều kiện thật của từng nguồn vẫn giữ nguyên. Không API/DB/worker/supervisor/QA3062/3070, không sửa Bửu Đình hoặc lịch sử.

## Đầu ra chính: toàn văn để đọc và đối chiếu

[Bốn bản luận đầy đủ trong phạm vi đã khai](AI-PAID-FOUR-COMPLETE-READINGS-20261102.md): Nô4phần, Tử3phần, Phu3phần, Tài5phần. Đây là **bản biên soạn MOCK thủ công trên cùng một snapshot QA**, không phải kết quả Astra hoặc nội dung đã phục vụ khách hàng. Toàn văn không có tên/ngày sinh/report ID. Cả bốn `limited`: bài đọc liền mạch, không cam kết diễn giải mọi sao hoặc tương lai người đọc. Không ép tám phần/số từ.

- **Nô:** thay việc chỉ kể giới hạn bằng một trục phân tích Lương–Lộc: lớp nghĩa khoan hòa/nhường nhịn của Lương đặt cạnh đối đãi và kỳ vọng đáp lại của Lộc. Phân biệt thiện chí, hưởng ứng và trợ lực thực chất; Huynh là ngữ cảnh huyết thống riêng. Đây là tổng hợp từ hai nguồn, không gán cho sách một phép Lộc giải Lương hãm hoặc kết luận bạn bè tốt.
- **Tử:** quan hệ với con được đặt cạnh hai thế hệ ở Phụ và điều kiện tạo lập nếp nhà ở Điền. Phân biệt điều kiện vật chất, nơi sống và cách đối đãi. Cơ–Cự vẫn ở Điền đối cung, không chuyển thành sao tọa Tử hoặc dùng nhà đất dự đoán tính con/sinh sản.
- **Phu:** giữ trục muốn nắm chắc của ví dụ Mệnh Vũ–Phủ và nhu cầu chủ động ở Phá tại Phu; nối với trợ giúp từng qua một giai đoạn nhưng còn khác quan niệm ở Tả. Gộp phần nhịp quyết định bị lặp. Khoa nam mệnh giữ riêng phương diện học vấn, không dùng giải sát hoặc suy kết quả hôn nhân.
- **Tài:** khai thác nguồn Thái Tuế vốn đã có nhưng bản trước chưa dùng: biện luận/đấu lý được đọc như nền của cách trao đổi. Đối chiếu Liêm về cạnh tranh, Quan về tổ chức và ranh giới quyết định, tam phương gợi môi trường nghề; sau đó tách xuất vốn, chi ngoài công việc và phần giữ lại. Không lấy nghĩa Song Hao áp vào riêng Đại Hao, không tính tài sản ròng hoặc hứa thu nhập.

Từng paragraph lưu basis/factIds/knowledgeIds trong [các JSON private và tổng hợp kiểm](../.local/ai-paid-complete-analysis-20261102/summary.json). Các phép nối mới là `ai-synthesis`; không đổi chúng thành `source-interpretation` để tạo cảm giác tác giả đã xác nhận. Một paragraph tổng hợp có thể đặt hai ý nghĩa độc lập cạnh nhau nếu giải thích rõ phần nối; không nhất thiết có nguồn nói nguyên cùng câu tổng hợp. Điều này không cho phép tự sáng tạo quy luật chế hóa, thay điều kiện hoặc suy sự kiện chắc chắn.

## Nguồn đã có được đưa vào pipeline

Thêm đúng **một foundation**: Nguyễn Phát Lộc, *Tử Vi Hàm Số*, PDF125§4, lớp tính chất chung Thiên Lương trước các nhánh đắc/hãm. Đoạn này nói khoan hòa, nhẫn nhục, mềm mỏng dù đắc hay hãm. Giữ rõ đây là **nghĩa nền**, không lời trực tiếp về bạn bè. Các nhánh trạng thái cùng trang không bị coi là biến mất; không kích hoạt chúng bằng bảng Tân Biên hay dùng các vế nhân phẩm/bệnh/tuổi thọ.

`paidLibrary` nhận book `hs`, ưu tiên `index-v110.json` riêng; thiếu mới lùi về v17/v16/legacy, file mới có nhưng sai schema/hash thì fail closed. **Index cũ nguyên byte**. Index mới13đơn vị =12cũ+1foundation, không thêm rule, không thay yêu cầu độ sáng. Foundation cần Thiên Lương tọa Nô source-traced, nhómB/reference-only, không direct. Các cap4/library14KB và C8/24KB giữ nguyên. Nô được thêm đúng1nền; Phu/Tài dùng lại các nền đã có; Tử dùng C Điền và Phụ đã chọn sẵn. Không thêm tri thức chỉ vì trùng từ khóa.

Retrieval mới **paid-retrieval-1.10.0**, prompt2.6/schemaV2/model purpose không đổi. Không sửa queue/provider/retry/worker/quyền/UI. Job và response cũ tiếp tục dùng input/prompt đã lưu.

Kho private cần đi cùng code khi được phép triển khai sau này: [21artifact và SHA256](../.local/ai-paid-complete-analysis-20261102/source-bundle-manifest.json), bản sao layout `source-bundle/` cùng thư mục. Gồm19artifact cũ giữ hash, index-v110 và HS125. Đây là bản sao cùng máy/volume, không phải backup ngoài máy hoặc bằng chứng đã deploy. Không đưa toàn văn sách vào Git. Tái dùng chữ sách đã trích; không PDF/ảnh mới hoặc nhập sách khác.

## Kiểm thực chạy

- **166/166 pure test,9file**, [log](../.local/ai-paid-complete-analysis-20261102/tests-final.log). Ba ca thêm: HS foundation vẫn reference-only và legacy nguyên; thiếu neo bị loại; index mới sai không fallback âm thầm; chữ HS đổi bị loại theo hash. Các guard C/D, source/time, y khoa, savedversion và adapter giữ nguyên. Lượt đầu149/149 ở8file do lệnh ghi sai tên file premises nên không chọn file ấy; đã sửa đúng selector và kiểm cuối166/166, không test fail.
- **4/4 bản luận qua validator2.6**, không cảnh báo bỏ ngữ cảnh phù hợp.159facts mỗi cung nguyên;8bài thật cũ giữ hash và qua validator savedversion;19artifact nguồn cũ nguyên. [Log biên soạn](../.local/ai-paid-complete-analysis-20261102/compose-final.log). Đã đọc toàn văn; không lấy validation kỹ thuật làm chứng nhận độ đúng chuyên môn.
- Typecheck/build Node24 cách ly/key rỗng/AI tắt/DBcổng1 đạt; BUILD_ID `puxTqD8rsxvn5rm776wAq`,612file. [Typecheck](../.local/ai-paid-complete-analysis-20261102/typecheck.log), [build](../.local/ai-paid-complete-analysis-20261102/build.log). Cảnh báo workspace root do nhiều lockfile giữ nguyên. Script chuẩn bị index qua stdin bị lỗi encoding trước thực thi; chuyển sang file UTF8, không sửa sách/expected để vượt lỗi.
- Không DBintegration/E2E/PDF/mobile mới vì không đổi storage/quyền/UI; không xác nhận runtime phục vụ bài mới. **0CREATE/0GET OpenAI,0USD**, không gọi lại model nhẹ hoặc Astra. Không thay bài lưu, Mệnh V1/Luna, quyền hoặc thanh toán.

## Checklist và mức hoàn thành

Giữ10mục và mẫu số cũ. Nô/Tử/Phu/Tài **80%**; Phụ/Phúc/Quan/Di/Huynh80%, Điền70%, Tật40%. Evidence P04/P07/P08 cập nhật sang bản luận liền mạch; không tự tăng P05 chỉ vì thêm nền hoặc viết dài. P05 còn cần đối chiếu chiều sâu các yếu tố trọng yếu trong phạm vi bài; P09 chưa có chất lượng Astra trên cấu hình mới. Không coi thiếu một câu sách giải toàn bộ tổ hợp là yêu cầu phải mở lại chương trình rule.

Đây là % hồ sơ trên mẫu QA, không độ chính xác/độ phủ mọi lá số. **Đã có bốn bản luận trọn bài để chủ dự án đọc; chưa đạt nghiệm thu thương mại11cung và chưa phải output model thật.** Dừng sau biên soạn/kiểm mock, không xin thêm sách chung chung, gọi API hoặc cập nhật QA3062/3070.
