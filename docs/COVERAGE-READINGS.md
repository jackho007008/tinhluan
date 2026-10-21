# Sáu bản Tổng quan — bản nháp nội bộ

Bản đọc thử được sinh bằng template từ kết quả rule evaluator, không dùng AI. Chú giải truyền thống chưa được chuyên gia duyệt; bản chép và quyền chuyển ngữ còn chờ xác minh. Chỉ dùng nội bộ, không phải kết luận về tính cách, nghề nghiệp hoặc cuộc đời.

Các bản đọc lấy từ preview/evaluator interpretation-1.4.0, không tạo thêm luận điểm. Sáu cấu hình Mệnh khác nhau xét cả chính/phụ tinh và chi cung; hai mẫu Tử Vi–Phá Quân phân biệt bằng phụ tinh (mẫu có Đà La). Không đếm đơn hàng hay danh tính.

## Engine VN · Thiên Cơ và Thái Âm (vn-0)

Profile: vn-utc7-midnight-v1; engine: vn-adapter-1.0.0. Đầu vào giả lập: 2000-08-16, 0:00, female, Asia/Ho_Chi_Minh.

Mệnh tại Thân, ghi nhận Thiên Cơ và Thái Âm. Thân cư Mệnh.

Thái Âm dùng hình tượng mặt trăng, được đặt trong quan hệ với Thái Dương. Đây là lớp biểu tượng; không dùng tên sao để kết luận về tài sản hay gia đình.

Thiên Cơ được liên hệ với sự ứng biến và cách hành sự có tính toán. Khi đọc ở Mệnh, đây là một nét mô tả truyền thống, không phải phép đo trí thông minh.

### Căn cứ

- reading.overview.taiyin @ 1.0.0; claim 4f1f29f477577922e1c11ed2848fc8510062a62f5e540baa0155da0194a0c415. Dữ kiện: Chính tinh tại Mệnh: Thiên Cơ, Thái Âm.. Điều kiện: Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Thái Âm. Chỉ hiển thị chú giải của yếu tố này.. Nguồn: [Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 → 問太陰星所主若何？; toàn mục 答曰 và 希夷先生曰; xem cả thượng/hạ huyền và thân/mệnh. Giới hạn: Chưa xác minh cách áp dụng thượng/hạ huyền, trạng thái và phối hợp với các sao khác; không lấy vai trò tại Điền Trạch làm kết luận cho Mệnh. Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.

- reading.overview.tianji @ 1.0.0; claim 6b68bb2e089fe0be56cf5f4b2877b5800aca11563c4669146db47de3314b058f. Dữ kiện: Chính tinh tại Mệnh: Thiên Cơ, Thái Âm.. Điều kiện: Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Thiên Cơ. Chỉ hiển thị chú giải của yếu tố này.. Nguồn: [Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 → 問天機所主如何？; đoạn 答曰 và 希夷先生曰, gồm thân/mệnh, hội hợp và trạng thái. Giới hạn: Chưa đặc tả các hội hợp với Thiên Lương, phụ tá và điều kiện loại trừ. Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.

### Yếu tố bổ sung

Phụ tinh được ghi nhận tại Mệnh: Lộc Tồn.

Trong nhóm Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tại Mệnh: không ghi nhận trong danh sách đang có.

Phần đọc hiện chưa bao quát hội chiếu, tương tác giữa các chính tinh và ảnh hưởng của hệ nhãn trạng thái. Những phần đó cần đặc tả riêng trước khi có thể tổng hợp thành một cách đọc toàn lá số.

### Nội dung không xuất và lý do

- draft.overview.tong @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Đồng","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.wuqu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Vũ Khúc","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.tianfu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Phủ","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.overview.ziwei @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.overview.taiyang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Dương","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.overview.tianxiang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Tướng","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.overview.tianliang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Lương","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.overview.empty @ 1.0.0: condition-false; {"fact":"fact.life-major-presence","op":"eq","value":"empty","actual":"present","evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars"]}

- combination.ziwei-assistants @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}

- combination.ziwei-assistants-qualified @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}

- reading.overview.pojun @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

- reading.overview.qisha @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thất Sát","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}

## Engine VN · Mệnh không chính tinh (vn-2)

Profile: vn-utc7-midnight-v1; engine: vn-adapter-1.0.0. Đầu vào giả lập: 2000-08-16, 2:00, female, Asia/Ho_Chi_Minh.

Mệnh tại Mùi. Thân cư Phúc Đức.

Mệnh không có chính tinh trong danh sách đã tính. Cách gọi cung trống chính tinh chỉ nói về nhóm chính tinh, không có nghĩa cung không còn sao nào. Bản đọc này chưa mượn sao đối cung và chưa xếp trường hợp này tốt hay xấu.

### Căn cứ

- reading.overview.empty @ 1.0.0; claim 536cee68a8d9f2a6205fdfe2299720afcf026246d71d21d860a518568092de24. Dữ kiện: empty. Điều kiện: Mệnh duy nhất; trường majorStars tồn tại, là mảng hợp lệ có độ dài 0.. Nguồn: [Tài liệu tác giả iztro — hệ thống sao](https://docs.iztro.com/learn/star), 十四主星 và 十四辅星; đoạn phụ tinh trong 空宫. Giới hạn: Chỉ giải thích cấu trúc danh sách; chưa có quy tắc mượn sao đối cung hoặc luận ảnh hưởng của phụ tinh được duyệt. Chưa có đặc tả mượn sao, phụ tinh và hội chiếu; dữ liệu bị thiếu không đáp ứng điều kiện này.

### Yếu tố bổ sung

Phụ tinh được ghi nhận tại Mệnh: Thiên Việt, Đà La.

Trong nhóm Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tại Mệnh: Đà La.

Phần đọc hiện chưa bao quát hội chiếu, tương tác giữa các chính tinh và ảnh hưởng của hệ nhãn trạng thái. Những phần đó cần đặc tả riêng trước khi có thể tổng hợp thành một cách đọc toàn lá số.

### Nội dung không xuất và lý do

- draft.overview.tong @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Đồng","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.wuqu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Vũ Khúc","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.tianfu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Phủ","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.overview.ziwei @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.overview.tianji @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Cơ","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.overview.taiyang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Dương","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.overview.taiyin @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Âm","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.overview.tianxiang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Tướng","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.overview.tianliang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Lương","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- combination.ziwei-assistants @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}

- combination.ziwei-assistants-qualified @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}

- reading.overview.pojun @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- reading.overview.qisha @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thất Sát","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

## Engine VN · Tử Vi tại Mệnh (vn-4)

Profile: vn-utc7-midnight-v1; engine: vn-adapter-1.0.0. Đầu vào giả lập: 2000-08-16, 4:00, female, Asia/Ho_Chi_Minh.

Mệnh tại Ngọ, ghi nhận Tử Vi. Thân cư Quan Lộc.

Tử Vi dùng hình tượng đế tọa, vị trí trung tâm trong hệ sao. Đây là chú giải biểu tượng của sao có tại Mệnh, chưa phải nhận định về năng lực lãnh đạo.

### Căn cứ

- reading.overview.ziwei @ 1.0.0; claim 8e4bb602ab49604e638b09abcea013659c53a5b8b008c0cecfaea873b1da60e9. Dữ kiện: Chính tinh tại Mệnh: Tử Vi.. Điều kiện: Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Tử Vi. Chỉ hiển thị chú giải của yếu tố này.. Nguồn: [Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 → 問紫微所主若何？; đoạn 答曰, 希夷先生曰 và 玉蟾先生曰; xét cả thân/mệnh và phụ tá. Giới hạn: Vai trò phụ tá, hội chiếu và khác hệ trạng thái chưa được đặc tả để tổng hợp. Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.

### Yếu tố bổ sung

Phụ tinh được ghi nhận tại Mệnh: Văn Khúc.

Trong nhóm Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tại Mệnh: không ghi nhận trong danh sách đang có.

Phần đọc hiện chưa bao quát hội chiếu, tương tác giữa các chính tinh và ảnh hưởng của hệ nhãn trạng thái. Những phần đó cần đặc tả riêng trước khi có thể tổng hợp thành một cách đọc toàn lá số.

### Nội dung không xuất và lý do

- draft.overview.tong @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Đồng","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.wuqu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Vũ Khúc","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.tianfu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Phủ","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.overview.tianji @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Cơ","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.overview.taiyang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Dương","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.overview.taiyin @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Âm","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.overview.tianxiang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Tướng","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.overview.tianliang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Lương","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.overview.empty @ 1.0.0: condition-false; {"fact":"fact.life-major-presence","op":"eq","value":"empty","actual":"present","evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars"]}

- combination.ziwei-assistants @ 1.1.0: condition-false; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}

- combination.ziwei-assistants-qualified @ 1.1.0: condition-false; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}

- reading.overview.pojun @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

- reading.overview.qisha @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thất Sát","actual":["Tử Vi"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.majorStars","chart.palaces.4.majorStars.0.name"]}

## Engine VN · Vũ Khúc (vn-20)

Profile: vn-utc7-midnight-v1; engine: vn-adapter-1.0.0. Đầu vào giả lập: 2000-08-16, 20:00, female, Asia/Ho_Chi_Minh.

Mệnh tại Tuất, ghi nhận Vũ Khúc. Thân cư Tài Bạch.

Văn bản cổ gắn Vũ Khúc với tài và sự quả quyết.

### Căn cứ

- reading.wuqu @ 1.1.0; claim 4be61666bff58c14d42f8b50dcacad44964006e8b08fc6fb9f5123ecac6cb4a9. Dữ kiện: Chính tinh tại Mệnh: Vũ Khúc.. Điều kiện: Chỉ đọc ý nghĩa riêng của sao đang có tại Mệnh; chưa phải lời luận cho toàn lá số.. Nguồn: [Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 → 問武曲星所主為何？, đoạn mở đầu và 希夷先生曰. Giới hạn: Chỉ đọc ý nghĩa riêng của sao đang có tại Mệnh; chưa phải lời luận cho toàn lá số. Chưa có quy tắc đầy đủ phối hợp Vũ Khúc với tứ hóa và hội chiếu; không suy mức thu nhập. Danh sách ngoại lệ chưa được đặc tả đầy đủ; rỗng không có nghĩa không có ngoại lệ.

### Yếu tố bổ sung

Phụ tinh được ghi nhận tại Mệnh: Tả Phụ (Tả Phù trong dữ liệu).

Trong nhóm Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tại Mệnh: không ghi nhận trong danh sách đang có.

Phần đọc hiện chưa bao quát hội chiếu, tương tác giữa các chính tinh và ảnh hưởng của hệ nhãn trạng thái. Những phần đó cần đặc tả riêng trước khi có thể tổng hợp thành một cách đọc toàn lá số.

### Nội dung không xuất và lý do

- draft.overview.tong @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Đồng","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.tianfu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Phủ","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.ziwei @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.tianji @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Cơ","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.taiyang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Dương","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.taiyin @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Âm","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.tianxiang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Tướng","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.tianliang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Lương","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.empty @ 1.0.0: condition-false; {"fact":"fact.life-major-presence","op":"eq","value":"empty","actual":"present","evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars"]}

- combination.ziwei-assistants @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Tả Phù"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.minorStars","chart.palaces.8.minorStars.0.name"]}

- combination.ziwei-assistants-qualified @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Tả Phù"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.minorStars","chart.palaces.8.minorStars.0.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.8.name","chart.palaces.8.minorStars","chart.palaces.8.minorStars.0.name"]}

- reading.overview.pojun @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

- reading.overview.qisha @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thất Sát","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}

## Engine VN · Tử Vi–Phá Quân, đủ phụ tá (engine-combo)

Profile: vn-utc7-midnight-v1; engine: vn-adapter-1.0.0. Đầu vào giả lập: 2001-05-06, 20:00, female, Asia/Ho_Chi_Minh.

Mệnh tại Mùi, ghi nhận Tử Vi và Phá Quân. Thân cư Tài Bạch.

Tử Vi dùng hình tượng đế tọa, vị trí trung tâm trong hệ sao. Đây là chú giải biểu tượng của sao có tại Mệnh, chưa phải nhận định về năng lực lãnh đạo.

Phá Quân được cổ thư gọi là sao có hóa khí ‘hao’ (hao tổn) — một tên phân loại trong hệ thống truyền thống. Vì sao này hiện ở Mệnh, bản đọc giải thích thuật ngữ ấy tại đây; chưa suy thành hao tài, xu hướng thay đổi hay tính cách của bạn.

Khoảng trống nội dung: Phá Quân. Không phải đặc điểm của người dùng.

### Căn cứ

- reading.overview.ziwei @ 1.0.0; claim 8e4bb602ab49604e638b09abcea013659c53a5b8b008c0cecfaea873b1da60e9. Dữ kiện: Chính tinh tại Mệnh: Tử Vi, Phá Quân.. Điều kiện: Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Tử Vi. Chỉ hiển thị chú giải của yếu tố này.. Nguồn: [Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 → 問紫微所主若何？; đoạn 答曰, 希夷先生曰 và 玉蟾先生曰; xét cả thân/mệnh và phụ tá. Giới hạn: Vai trò phụ tá, hội chiếu và khác hệ trạng thái chưa được đặc tả để tổng hợp. Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.

- reading.overview.pojun @ 1.0.0; claim 162e196738871ab588a0913988cd49b52840f8909f0da671493e350122165b26. Dữ kiện: Chính tinh tại Mệnh: Tử Vi, Phá Quân.. Điều kiện: Phá Quân được ghi tại cung Mệnh duy nhất, danh sách chính tinh hợp lệ. Chỉ chọn vị trí trình bày thuật ngữ, không khẳng định nghĩa riêng tại Mệnh.. Nguồn: [Toàn Thư quyển một — bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 / 問破軍所主若何？ / 答曰; đọc toàn mục, chỉ dùng hình tượng/phân loại phần mở đầu. Giới hạn: Nghĩa chung của tên phân loại; đọc toàn đoạn có quan hệ với Tử Vi và các điều kiện vị trí. Không phải kết luận riêng cho Phá Quân thủ Mệnh. Chưa đặc tả Tử Vi–Phá Quân, điều kiện can sinh, vị trí và sao hội. Không suy nghĩa đổi mới/sáng tạo từ tên sao. Chưa biết hết ngoại lệ luận mệnh; mảng ngoại lệ rỗng chỉ áp dụng cho chú giải thuật ngữ.

### Yếu tố bổ sung

Phụ tinh được ghi nhận tại Mệnh: Tả Phụ (Tả Phù trong dữ liệu), Hữu Bật.

Trong nhóm Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tại Mệnh: không ghi nhận trong danh sách đang có.

Có Phá Quân cùng Tử Vi tại Mệnh: phần tổng hợp chủ tinh–phụ tá tạm dừng vì chưa đặc tả quan hệ Tử Vi–Phá Quân. Các chú giải riêng vẫn đọc được; đây là giới hạn nội dung, không phải đánh giá xấu về lá số.

Phần đọc hiện chưa bao quát hội chiếu, tương tác giữa các chính tinh và ảnh hưởng của hệ nhãn trạng thái. Những phần đó cần đặc tả riêng trước khi có thể tổng hợp thành một cách đọc toàn lá số.

### Nội dung không xuất và lý do

- draft.overview.tong @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Đồng","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.wuqu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Vũ Khúc","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.tianfu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Phủ","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.tianji @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Cơ","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.taiyang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Dương","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.taiyin @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Âm","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.tianxiang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Tướng","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.tianliang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Lương","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.empty @ 1.0.0: condition-false; {"fact":"fact.life-major-presence","op":"eq","value":"empty","actual":"present","evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- combination.ziwei-assistants @ 1.1.0: exception; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- combination.ziwei-assistants-qualified @ 1.1.0: condition-false; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}

- reading.overview.qisha @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thất Sát","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

## Engine VN · Tử Vi–Phá Quân, phụ tá và Đà La (engine-exception)

Profile: vn-utc7-midnight-v1; engine: vn-adapter-1.0.0. Đầu vào giả lập: 2000-05-13, 20:00, female, Asia/Ho_Chi_Minh.

Mệnh tại Mùi, ghi nhận Tử Vi và Phá Quân. Thân cư Tài Bạch.

Tử Vi dùng hình tượng đế tọa, vị trí trung tâm trong hệ sao. Đây là chú giải biểu tượng của sao có tại Mệnh, chưa phải nhận định về năng lực lãnh đạo.

Phá Quân được cổ thư gọi là sao có hóa khí ‘hao’ (hao tổn) — một tên phân loại trong hệ thống truyền thống. Vì sao này hiện ở Mệnh, bản đọc giải thích thuật ngữ ấy tại đây; chưa suy thành hao tài, xu hướng thay đổi hay tính cách của bạn.

Khoảng trống nội dung: Phá Quân. Không phải đặc điểm của người dùng.

### Căn cứ

- reading.overview.ziwei @ 1.0.0; claim 8e4bb602ab49604e638b09abcea013659c53a5b8b008c0cecfaea873b1da60e9. Dữ kiện: Chính tinh tại Mệnh: Tử Vi, Phá Quân.. Điều kiện: Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Tử Vi. Chỉ hiển thị chú giải của yếu tố này.. Nguồn: [Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 → 問紫微所主若何？; đoạn 答曰, 希夷先生曰 và 玉蟾先生曰; xét cả thân/mệnh và phụ tá. Giới hạn: Vai trò phụ tá, hội chiếu và khác hệ trạng thái chưa được đặc tả để tổng hợp. Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.

- reading.overview.pojun @ 1.0.0; claim 162e196738871ab588a0913988cd49b52840f8909f0da671493e350122165b26. Dữ kiện: Chính tinh tại Mệnh: Tử Vi, Phá Quân.. Điều kiện: Phá Quân được ghi tại cung Mệnh duy nhất, danh sách chính tinh hợp lệ. Chỉ chọn vị trí trình bày thuật ngữ, không khẳng định nghĩa riêng tại Mệnh.. Nguồn: [Toàn Thư quyển một — bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 諸星問答論 / 問破軍所主若何？ / 答曰; đọc toàn mục, chỉ dùng hình tượng/phân loại phần mở đầu. Giới hạn: Nghĩa chung của tên phân loại; đọc toàn đoạn có quan hệ với Tử Vi và các điều kiện vị trí. Không phải kết luận riêng cho Phá Quân thủ Mệnh. Chưa đặc tả Tử Vi–Phá Quân, điều kiện can sinh, vị trí và sao hội. Không suy nghĩa đổi mới/sáng tạo từ tên sao. Chưa biết hết ngoại lệ luận mệnh; mảng ngoại lệ rỗng chỉ áp dụng cho chú giải thuật ngữ.

### Yếu tố bổ sung

Phụ tinh được ghi nhận tại Mệnh: Tả Phụ (Tả Phù trong dữ liệu), Hữu Bật, Thiên Việt, Đà La.

Trong nhóm Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tại Mệnh: Đà La.

Có Phá Quân cùng Tử Vi tại Mệnh: phần tổng hợp chủ tinh–phụ tá tạm dừng vì chưa đặc tả quan hệ Tử Vi–Phá Quân. Các chú giải riêng vẫn đọc được; đây là giới hạn nội dung, không phải đánh giá xấu về lá số.

Phần đọc hiện chưa bao quát hội chiếu, tương tác giữa các chính tinh và ảnh hưởng của hệ nhãn trạng thái. Những phần đó cần đặc tả riêng trước khi có thể tổng hợp thành một cách đọc toàn lá số.

### Nội dung không xuất và lý do

- draft.overview.tong @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Đồng","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.wuqu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Vũ Khúc","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.tianfu @ 1.1.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Phủ","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.tianji @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Cơ","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.taiyang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Dương","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.taiyin @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thái Âm","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.tianxiang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Tướng","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.tianliang @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thiên Lương","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.empty @ 1.0.0: condition-false; {"fact":"fact.life-major-presence","op":"eq","value":"empty","actual":"present","evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}

- combination.ziwei-assistants @ 1.1.0: exception; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"recorded","evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name","chart.palaces.5.minorStars.2.name","chart.palaces.5.minorStars.3.name"]}

- combination.ziwei-assistants-qualified @ 1.1.0: exception; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- reading.overview.qisha @ 1.0.0: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Thất Sát","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}
