# Rà soát Tổng quan — 2026-10-08

Đặc tả ghi trước khi sửa catalog 1.3.0. Nội dung mới chỉ là draft nội bộ. Không có người duyệt. Không đổi engine, lịch, dữ liệu đã giao hoặc quy tắc phát hành.

## Nguồn và quyết định phạm vi

Đã đọc lại [Toàn Thư, quyển một — bản chép Wikisource](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), ngày 2026-10-08. Đây là bản chép trực tuyến, chưa đối chiếu ảnh bản in; không phải xác nhận chuyên gia hay bằng chứng dự đoán. Quyền bản chép/chuyển ngữ chưa hoàn tất kiểm tra; chỉ viết lời giải thích ngắn của dự án, không sao chép đoạn dài.

| Vị trí nguồn | Điều kiện nguồn / giới hạn | Quyết định triển khai |
|---|---|---|
| 太微賦, đoạn phụ bật đồng cung; 重補斗數彀率, đoạn Tử Vi tại Mệnh | Có ngữ cảnh đồng cung; không đồng nhất với mọi hội chiếu | Chỉ đủ cả hai phụ tá cùng Mệnh; đây là phạm vi thu hẹp, không khẳng định một phụ tá vô tác dụng |
| 問紫微所主若何？ / 答曰 | Còn xét cung độ, trạng thái và sao thủ/chiếu | Bỏ câu đánh giá thuận vô điều kiện, chỉ giải thích quan hệ chủ tinh–phụ tá |
| Cùng mục / 希夷先生曰; 問破軍所主若何？ / 答曰 | Có đoạn riêng về Phá Quân; đoạn đầu nêu Thìn/Tuất/Sửu/Mùi, đoạn sau không diễn đạt cùng giới hạn | Chặn cả hai rule phụ tá khi ghi Phá Quân tại Mệnh ở mọi vị trí. Đây là cổng thận trọng, không phải định luật xấu hay giải quyết mâu thuẫn nguồn |
| 問紫微所主若何？ / 玉蟾先生曰 | Bản chép gọi rõ nhóm Kình/Đà/Hỏa/Linh; còn có quan hệ xung phá và sao khác | Giữ tập bốn tên để ghi yếu tố đồng cung, không coi chúng bao trùm mọi sát tinh hoặc mọi quan hệ |
| 問左輔所主若何？ | Có cả phạm vi tam hợp/xung chiếu | Không nhập phạm vi này vào điều kiện đồng cung |

“none-recorded” chỉ nói mảng dữ liệu hợp lệ không ghi bốn tên tại Mệnh. Không chứng minh không có tác động khác cung, không đủ để đánh giá thuận. Thiếu mảng → missing-facts; không có đủ bộ ba → condition-false; Phá Quân cùng Mệnh → exception. Ngoại lệ rỗng ở chú giải thuật ngữ không có nghĩa đã biết mọi ngoại lệ luận mệnh.

## Năm mục nghiên cứu

Tất cả cùng phương pháp văn bản Toàn Thư, không ghép nghĩa từ trường phái khác. Các vị trí dưới đây thuộc 諸星問答論. Trạng thái chung: bản chép đã đọc, ấn bản/diễn nghĩa chuyên môn/quyền sử dụng pending, 0 approved.

| Mục | Vị trí chính xác | Phạm vi triển khai / phần còn thiếu |
|---|---|---|
| Phá Quân | 問破軍所主若何？ / 答曰, phần đầu hóa khí; đọc toàn đoạn tới các cung | `reading.overview.pojun`: chỉ giải thích tên gọi “hao”, khi sao có tại Mệnh. Đây là nghĩa chung, không phải luận Mệnh; không suy hao tiền, đổi mới, tính cách. Phần Tử Vi–Phá Quân cần đặc tả riêng |
| Thất Sát | 問七殺星所主若何？ / 答曰, đầu đoạn; đọc cùng 希夷先生曰 và 歌曰 | `reading.overview.qisha`: chỉ hình tượng tướng trong hệ sao, khi có tại Mệnh; không suy nghề hoặc năng lực. Không chuyển nghĩa tại Quan Lộc sang Mệnh |
| Liêm Trinh | 問廉貞所主若何？ / 答曰, phân biệt Quan Lộc với Thân/Mệnh | Chưa tạo rule: thuật ngữ thứ đào hoa cần diễn nghĩa và phạm vi không phán xét; không dùng nghĩa quyền ở Quan Lộc để luận Mệnh |
| Tham Lang | 問貪狼所主若何？ / 答曰 và 希夷先生曰 | Chưa tạo rule: cách gọi đào hoa chưa đủ cho kết luận sức hút/tài năng; cần xử lý điều kiện vị trí, trạng thái và tổ hợp, tránh định kiến giới |
| Cự Môn | 問巨門所主若何？ / 答曰 và 希夷先生曰 | Chưa tạo rule: nhãn ám/khẩu thiệt không được tự đảo thành tài giao tiếp hoặc dự đoán tranh chấp; cần đặc tả điều chỉnh, ngoại lệ |

Hai rule mới là `method-gloss`, không phải nhận định cá nhân hóa và không cộng vào số chú giải đơn có nội dung luận. Required: fact.life-stars hợp lệ; includes đúng tên tại Mệnh. Evidence được evaluator mở rộng tới phần tử thực. Không cần biết trạng thái sao để giải thích thuật ngữ chung; mọi kết luận phụ thuộc trạng thái đều ngoài phạm vi. Không có rule tổ hợp mới.

## Tên gọi

iztro 2.6.1 `lib/i18n/locales/vi-VN/star.js`: `zuofuMin` → Tả Phù, tương ứng 左輔. Giao diện nội bộ gọi “Tả Phụ (Tả Phù trong dữ liệu)”; conditions vẫn dùng Tả Phù. Không thay tên/ID trong snapshot hoặc engine. Đây là ánh xạ tên hiển thị, không phải chuyển phương pháp.

## Biên tập và nghiệm thu

Giữ sáu cấu hình engine cũ để đối chiếu trước/sau bằng cùng input. Bản trước: evidence/overview-before-1.4.json. Bản sau giữ claim ID/căn cứ và trace loại trừ. Hai mẫu engine có Phá Quân phải không còn claim phối hợp; không thay bằng phán đoán tiêu cực. Tử Vi đơn quay lại văn chính; chú giải thuật ngữ Phá Quân được ghi rõ phạm vi. Mẫu kỹ thuật không Phá Quân vẫn kiểm quan hệ phụ tá, không xác nhận một lá số hợp lệ.

Template chia phần luận theo yếu tố và phần thuật ngữ; thông báo tổng hợp thiếu điều kiện bám trace ngoại lệ thay vì lặp cảnh báo chung. Claim không bị sửa nghĩa hoặc nối thành quan hệ mới. Không đổi bản báo cáo lưu.

## Kết quả sau triển khai

- Catalog 1.4.0: 27 rule = 9 dữ kiện + 18 diễn giải/phương pháp. Hai rule thêm, hai rule phối hợp sửa lên 1.1.0; 0 approved, không có người duyệt.
- Độ phủ theo thước đo trước: vẫn **10/15** (9 chính tinh có chú giải theo yếu tố + giải thích Mệnh rỗng). Hai mục Phá Quân/Thất Sát chỉ có thuật ngữ, ghi riêng, không nâng thành 12/15 nhận định tại Mệnh. Cả 15 mục đều chưa có nội dung được phê duyệt. Không đại diện mọi tổ hợp.
- Bộ mẫu **47**: 36 fixture kỹ thuật, 11 ca engine. Hai chủ đề có ít nhất một claim đơn/phối hợp: VN engine **9/10**, CN engine **1/1**, kỹ thuật **19/36**; riêng Tổng quan lần lượt **9/10**, **1/1**, **16/36**. Tử số không tính hai thuật ngữ mới, dữ kiện hoặc phần giới thiệu; mẫu số theo đúng loại/profile. Không đại diện tỷ lệ khách.
- 26/27 rule có ca matched trong bộ mẫu; `context.career-labels` vẫn chưa khớp bộ này. Chưa giải quyết khác hệ nhãn nhàn cung/Đắc; không đổi engine để tăng số.
- Sáu bản engine giữ nguyên input: `vn-0`, `vn-2`, `vn-4`, `vn-20`, `engine-combo`, `engine-exception`. Hai mẫu cuối khác phụ tinh; không đếm đơn hàng trùng. [Bản đọc và căn cứ](COVERAGE-READINGS.md); [đối chiếu trước/sau](OVERVIEW-BEFORE-AFTER.md). JSON lưu mọi claim/rule/version, nội dung trước/sau và lý do rule không xuất.

## Kiểm thử đã chạy

- `npx vitest run --exclude tests/database.test.ts`: **211/211 đạt**, 9 files. Có đúng/sai cung, Phá Quân tại Mệnh hoặc cung khác, mỗi phụ tá thiếu, từng sao điều chỉnh, missing facts, mảng rỗng, nhiều rule khớp, không xuất draft và không biến thuật ngữ thành độ phủ luận cá nhân. Bảo toàn đối tượng report trước/sau preview. Không chạy lại suite giao dịch DB vì không sửa thanh toán/worker.
- `npm run typecheck`: đạt. `npm run build`: đạt. Logs: `evidence/overview-revision-{tests,typecheck,build}.txt`.
- E2E dev: đổi A→B→A, thiếu dữ kiện, xác thực, không ghi DB/report, căn cứ và tổ hợp ở 360/390px đạt. Bảng độ phủ đạt assertions giao diện nhưng thất bại vì console “Connection closed.”; tái hiện lại khi source ổn định. Chưa xác định nguyên nhân, không bỏ assertion hoặc tuyên bố đã sửa.
- Chạy cùng coverage E2E trên **production build chỉ bind loopback**: 1/1 đạt, không console error/pageerror, các bộ lọc, sáu bản đọc và căn cứ 360/390px đạt. Không triển khai Internet hoặc mở payment thật. Log `evidence/overview-revision-build-e2e.txt`.

## Cách tự kiểm tra và phần còn thiếu

Vào `/internal` bằng quyền nội bộ hiện có, chọn mẫu rồi bấm **Xem mẫu kiểm thử**:

- `engine-combo`: Tử Vi + Phá Quân, có đủ phụ tá; không có claim phối hợp. Có chú giải Tử Vi, thuật ngữ Phá Quân và lý do dừng tổng hợp.
- `engine-exception`: cùng chính tinh, thêm Đà La; tên Đà La vẫn hiện trong dữ kiện bổ sung, không thành kết luận tiêu cực.
- `syn-combo`, `syn-combo-exception`: fixture kỹ thuật không Phá Quân để kiểm hai nhánh phụ tá. Không gọi là lá số được chuyên gia xác nhận.
- `syn-pojun`, `other-pojun`, `syn-qisha`, `other-qisha`: so đúng/sai cung; `syn-missing-major` khác `syn-empty`.

Phần mới đã chạy bằng template/evaluator chung, không AI. Chưa hoàn thành luận riêng tại Mệnh cho năm sao còn thiếu; hai mục chỉ cung cấp thuật ngữ. Cần người phụ trách xác định ấn bản, diễn nghĩa không phán xét, điều kiện tổ hợp Tử Vi–Phá Quân, quan hệ hội chiếu, hệ nhãn và quyền sử dụng; xem checklist chuyên môn. Không coi bản đọc này đủ để bán hoặc dự đoán đời người.

Kiểm tra bổ sung bản build: ca phối hợp/mở căn cứ/A→B→A **1/1 đạt** (6.5s), cả 360/390px. Ảnh đã xem: `.local/reading-review/overview-revised-360.png`, `overview-revised-390.png`; ngắt dòng/căn cứ nằm trong chiều rộng trang. Ca E2E này dùng mẫu bộ nhớ, không tạo đơn/giao dịch. Sau kiểm tra trả server về chế độ dev để giữ luồng demo như trước.
