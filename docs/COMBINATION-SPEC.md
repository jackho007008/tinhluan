# Đặc tả trước triển khai — Tử Vi / Tả Phụ / Hữu Bật đồng cung Mệnh

> Lịch sử 1.3.0, không phải đặc tả hiện hành. Từ 1.4.0: chặn cả hai rule khi có Phá Quân tại Mệnh; bỏ đánh giá thuận vô điều kiện. Xem [rà soát và đặc tả mới](OVERVIEW-REVISION.md). Ví dụ khớp dưới đây chỉ ghi lại hành vi cũ.

Ngày: 2026-10-07. Trạng thái: draft; không người duyệt; quyền chuyển ngữ pending. Đã đọc README, OVERVIEW-COVERAGE, evaluator, derived facts và preview. Không tìm thấy AGENTS.md trong repository.

## Lựa chọn và phạm vi

Kiểm kê báo cáo đã lưu (gồm đơn test, không phải mẫu dân số): 20 Tử Vi đơn thủ, 1 Tham Lang, 1 Vũ Khúc–Thiên Phủ tại Mệnh. Không có Tử Vi cùng Tả/Hữu tại Mệnh trong tập này. Số liệu: `evidence/combination-inventory.json`.

Nguồn duy nhất cho diễn giải: [紫微斗數全書 quyển một](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一), 重補斗數彀率, câu nói Tử Vi tại Mệnh và phụ bật đồng viên; đọc cùng 諸星問答論 / 問紫微所主若何？, 答曰 (phụ tá, sát tinh đồng cung), 希夷先生曰 (xét thêm tứ sát), 玉蟾先生曰 (Tả/Hữu làm phụ tá). Bản chép chưa được đối chiếu bản in, không xác nhận trường phái lịch Việt Nam. Áp dụng có điều kiện cho dữ kiện cấu trúc của hai profile hiện có, không tuyên bố cổ thư dùng cùng lịch/engine.

Không chọn Vũ Phủ: đoạn trực tiếp gần nhất trong 問武曲星所主為何？ nói về tuổi thọ, không đưa vào sản phẩm. Những câu giàu có trong mục Thiên Phủ chưa đủ để suy riêng cặp đồng cung Mệnh theo mọi vị trí.

## Hai rule dự thảo

| ID | Bắt buộc | Điều kiện bổ sung / ngoại lệ | Dữ kiện | Kết luận được phép | Không được suy |
|---|---|---|---|---|---|
| combination.ziwei-assistants | Mệnh duy nhất; Tử Vi ở majorStars; Tả Phụ và Hữu Bật cùng minorStars tại Mệnh; danh sách hợp lệ | Chặn cách đọc thuận riêng khi có Kình Dương, Đà La, Hỏa Tinh hoặc Linh Tinh đồng cung | life-stars, life-minor-stars, life-local-sat | Nguồn đánh giá thuận sự phối hợp Tử Vi với đủ hai phụ tá đồng cung; đây là đánh giá truyền thống cho tổ hợp, không phải cộng nghĩa sao | Chắc chắn quý hiển, chức vụ, giàu, giỏi lãnh đạo; không khẳng định không có sát tinh hội chiếu |
| combination.ziwei-assistants-qualified | Cùng ba sao tại Mệnh như trên, danh sách hợp lệ | Có ít nhất một trong bốn sao nêu trên đồng cung | Như trên, kèm tên sao thực tế | Giữ ghi nhận phối hợp phụ tá, đồng thời nêu yếu tố đồng cung cần xét theo ngữ cảnh nguồn; không dùng cách đọc thuận riêng | Tự đảo thành xấu, hạ cấp/cho điểm, dự báo tai nạn, nghèo hoặc thất bại |

**Cổng chặn rule thứ nhất là chính sách biên tập bảo thủ**, không phải bản dịch một định luật “gặp sát tinh thì tổ hợp mất tác dụng”. Rule thứ hai giữ cả phối hợp và điều kiện khác chiều, không xóa dữ kiện bất lợi. Hai rule này loại trừ nhau theo trạng thái local-sat. Không nói đã giải quyết mọi ngoại lệ của cổ thư.

Bốn tên sát tinh là tập kỹ thuật quy ước cho cổng biên tập (Kình, Đà, Hỏa, Linh theo nhóm 六煞星 của tài liệu iztro, loại Không/Kiếp khỏi tên gọi tứ sát); không trộn diễn giải hiện đại vào kết luận cổ thư. Cần xác nhận thuật ngữ tứ sát trong ấn bản trước phê duyệt. Phạm vi chỉ **đồng cung**: không triển khai tam phương, đối cung, giáp cung hoặc chữ “冲破” thành quan hệ chưa đặc tả. Vị trí chi, miếu/vượng, tứ hóa và hội chiếu vẫn chưa đủ căn cứ để tổng hợp; không coi chúng đã được bỏ qua hợp lệ trong một luận đoán toàn lá số.

## Chuẩn hóa dữ kiện và trace

Không sửa an sao. Đọc minorStars của chính cung Mệnh đã lưu, yêu cầu mảng tên sao hợp lệ/không trùng. Thiếu/null/sai kiểu → không có fact → missing-facts. Mảng đầy đủ nhưng thiếu một phụ tá → condition-false. Có sao khác cung không thay thế điều kiện đồng cung. Trace giữ fact/value/evidence cho từng điều kiện; phải phân biệt ngoại lệ biên tập với thiếu dữ liệu.

## Biên tập template

Nếu có claim phối hợp, trình bày trước chú giải đơn. Chú giải Tử Vi được chuyển vào mục mở rộng “Chú giải yếu tố riêng”, không xóa khỏi execution, căn cứ hoặc bảng claim. Các chú giải sao khác và mọi context/nhận định khác chiều vẫn giữ nguyên. Khi không khớp tổ hợp, cách trình bày cũ tiếp tục. Dữ kiện → diễn giải phối hợp → yếu tố bổ sung → phần chưa đủ tổng hợp. Không AI, không nối nghĩa sao để sinh một claim mới.

## Kiểm thử dự kiến

Full three-star match; một phụ tá thiếu; phụ tá ở cung khác; mỗi sát tinh đồng cung kích hoạt qualified và chặn rule thuận riêng; thiếu/null/malformed minorStars; nhiều rule đơn+phối hợp cùng khớp; không phát hành draft; không đổi báo cáo lưu. Fixture tự dựng chỉ kiểm evaluator. Tìm ví dụ từ engine với đầu vào demo công khai, không sửa output rồi gọi là lá số engine thật. Nếu chưa tìm được, công bố rõ thay vì dùng fixture giả.

## Đối chiếu tên dữ liệu khi triển khai

`node_modules/iztro/lib/i18n/locales/vi-VN/star.js` ở iztro 2.6.1 ánh xạ `zuofuMin` thành **Tả Phù**, `youbiMin` thành Hữu Bật. Tả Phụ trong tiêu đề đặc tả chỉ cùng sao 左輔. Conditions dùng chính xác “Tả Phù”, không tìm trong đoạn văn, không đổi nhãn snapshot. Fixture kỹ thuật đã sửa cho đúng hợp đồng này; ví dụ engine là kiểm tra bổ sung bắt buộc để phát hiện khác biệt tên.

## Ví dụ thực thi / trước và sau

`node --import tsx scripts/combination-examples.ts` tìm trong đầu vào demo công khai (nữ, ngày dương tháng 5/2000 và 5/2001, các chi giờ, UTC+7). Sau 443 lượt engine chưa chỉnh sửa, thu được ba ca lưu tại `evidence/combination-engine-examples.json`. Đây là bằng chứng tích hợp, không xác nhận chuyên môn của engine.

| Đầu vào demo | Dữ kiện tại Mệnh | Trước | Sau |
|---|---|---|---|
| 2000-05-05 02:00 | Tử Vi, Thiên Tướng; không Tả/Hữu đồng cung | Hai chú giải đơn | Không có claim phối hợp; condition-false chỉ rõ thiếu phụ tá |
| 2001-05-06 20:00 | Tử Vi, Phá Quân; Tả Phù, Hữu Bật đồng cung | Chú giải Tử Vi, Phá Quân chưa có nội dung | Rule phối hợp đứng trước; chú giải Tử Vi chuyển vào mục mở rộng; Phá Quân vẫn ghi chưa đủ nội dung |
| 2000-05-13 20:00 | Tử Vi, Phá Quân; Tả Phù, Hữu Bật, Thiên Việt, Đà La | Chú giải Tử Vi, Phá Quân chưa có nội dung | Rule thuận riêng bị exception; qualified giữ cả phối hợp phụ tá và Đà La |

**Giới hạn quan trọng:** hai ví dụ khớp còn có Phá Quân cùng cung. Đoạn riêng về Tử Vi–Phá Quân chưa được đặc tả; không dùng phần đọc phụ tá này thay thế hoặc kết luận toàn bộ cấu hình Mệnh. Giao diện vẫn nêu Phá Quân chưa có chú giải, các claim ghi giới hạn này trong căn cứ. Không lấy lời đánh giá phối hợp cục bộ để nói toàn lá số thuận lợi.

### Bản đọc sau, trường hợp có Đà La

Dữ kiện nổi bật: Tử Vi, Phá Quân cùng Mệnh; Tả Phù và Hữu Bật cũng tại cung này, kèm Đà La.

Cách đọc được hỗ trợ: phối hợp chủ tinh với hai phụ tá được giữ lại, nhưng có Đà La đồng cung nên không trình bày riêng đánh giá thuận của nhóm phụ tá. Không tự chuyển thành phán đoán xấu.

Điều kiện khác chiều: trace cho thấy rule thuận riêng bị chặn theo cổng biên tập; rule có điều kiện được xuất. Căn cứ chỉ rõ danh sách sao đã lưu, nguồn và giới hạn phạm vi đồng cung.

Chưa đủ căn cứ: Tử Vi–Phá Quân, hội chiếu, tứ hóa và quy ước trạng thái chưa được tổng hợp. Chú giải Tử Vi đơn vẫn đọc được trong mục mở rộng; không bị xóa khỏi bộ claim.

## Bàn giao kỹ thuật

Catalog 1.3.0: thêm đúng hai rule combination, đều draft/rights pending/review null; tổng 25 rules, 0 approved. Derivation 1.3.0 bổ sung dữ kiện minor-stars/local-sat/local-sat-stars với evidence tới từng sao. Preview 2.2.0 ưu tiên phối hợp trong văn chính và giữ chú giải đơn trong details theo metadata moveToDetails; không ảnh hưởng customer publication. Trace bổ sung giá trị thực và evidence tương ứng cho điều kiện khớp/sai/ngoại lệ.

## Kết quả kiểm thử thực tế

- `npm test`: **161/161 đạt**, 7 files, 5.69s. Có ca đầy đủ, từng điều kiện thiếu/sai cung, từng sao của cổng biên tập, thiếu/null/sai kiểu/trùng phụ tinh, nhiều claim, bảo toàn context và draft không ra khách.
- Typecheck: đạt. Production build: `docs/evidence/combination-build.txt`.
- E2E hồi quy: 6 ca hiện có đạt; ca thứ bảy ban đầu phát hiện render lặp chú giải đơn dù bộ claim đã phân nhóm đúng. Đã sửa sử dụng mainNotes trong văn chính. Chạy lại ca phối hợp: **1/1 đạt**, 7.2s; kiểm hai báo cáo demo từ engine, draft không ra API khách, chuyển chú giải đơn, căn cứ và không tràn ngang 360/390px.
- Đã xem ảnh mobile của nhóm mới. E2E tạo báo cáo demo mới để chọn trong trang nội bộ, không ghi đè báo cáo cũ. Hash báo cáo gốc trước/sau trùng khớp.
- Lần thử engine đầu phát hiện tên “Tả Phụ” không khớp tên iztro “Tả Phù”; đã sửa điều kiện theo dữ liệu thật. Test fixture tự dựng không được dùng thay kiểm tra hợp đồng engine.

Còn thiếu: bản in và kiểm quyền chuyển ngữ; quyết định chuyên môn về đầy đủ ngoại lệ, tứ sát/đồng cung/hội chiếu, Tử Vi–Phá Quân; phê duyệt chuyên gia. Không có scoring, AI, dự báo chắc chắn hoặc mở thanh toán thật.

Kiểm tra trình duyệt sau build/khởi động lại: trang nội bộ mẫu tải thành công, không ghi nhận console error hoặc pageerror.
