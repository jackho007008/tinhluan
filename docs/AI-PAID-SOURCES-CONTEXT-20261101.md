# Bổ sung nguồn Nô–Tử–Phu và ngữ cảnh Quan–Tài

**Đã triển khai và kiểm mock phần đầu vào; chưa nghiệm thu lời Astra mới hoặc phát hành.** Không gọi API thật. Nô/Tử trên mẫu đối chứng đều có thêm một luận điểm hẹp phù hợp, Phu thêm một góc đọc đơn lẻ. Quan/Tài có hướng dẫn liên hệ bằng ID nguồn/facts, không chỉ danh sách C để model tự tìm trong toàn bộ đầu vào.

Baseline `main@9fea5c5`; tracked/index sạch đầu phiên. Giữ nguyên `buu-dinh-7parts/`, `docs/handoff/` chưa commit. Không thay engine, catalog, Mệnh V1/Luna, thanh toán, quyền, queue/worker/supervisor, schema DB hoặc bài đã lưu. Không cập nhật web QA nào, không mở bán/Live. Không tái khởi động chương trình rule thủ công.

## 1. Nguồn được thêm và ranh giới áp dụng

Tái dùng kho chữ và hồ sơ ba sách đã xử lý, đối chiếu đoạn cụ thể; **không mở PDF/ảnh mới**. Bốn trích ý nhỏ trong `paid-topic-books.ts`, qua `paidBookKnowledge` và adapter hiện có. Các fact điều kiện lấy từ snapshot đã kiểm receipt; không lấy ngày sinh/ID mẫu làm selector. `B/direct` chỉ nói phù hợp với vế nguồn cục bộ, không chứng nhận đúng đời sống hoặc đủ chiều sâu toàn cung.

### Nô Bộc — kỳ vọng trong giao du

**Trung Châu Tử Vi Đẩu Số, Tứ Hóa Phái phần1: Khâm Thiên Bí Nghi**, Nguyễn Anh Vũ theo hồ sơ nguồn, PDF128–130 §4.2.8, nhất là ý(2),(3),(6),(12). Hóa Lộc **năm sinh tọa Nô** gắn với việc mệnh tạo bày tỏ tình cảm, kỳ vọng người khác đáp lại như mình, ký thác hy vọng vào bạn bè. Nguồn tự phân biệt thiên về tình cảm với sự chân tình; muốn luận quý nhân/giúp đỡ còn phải xét phi hóa thích hợp.

Đã thêm `paid-book.thp1-128-no-loc`, điều kiện `natal.Lộc` tại Nô đã xác minh. Không lấy Lộc Tồn/tự Lộc/phi Lộc thay thế. Không kết luận bạn bè chân thành, giúp vốn hoặc hợp tác có lời. Không dùng Lộc để bỏ Thiên Lương Hãm hoặc giải ô bảng Tân Biên với Mệnh Vũ–Phủ còn chưa rõ. Đây là phương diện kỳ vọng/đối đãi của mệnh tạo, khác việc phán phẩm chất bạn bè.

### Tử Tức — quan hệ với con từ Lộc tại Nô

**Cùng sách phần1, PDF130 §4.2.8 ý(12)** nêu riêng: khi đọc Nô như cung biểu hiện của Tử Nữ, **có thể** luận con hòa hợp với mệnh tạo. Vế này có chủ đề là quan hệ với con dù vị trí điều kiện nằm ở Nô. Không phải tự chuyển một nguồn về bạn bè sang lời con; chính đoạn nguồn nêu chủ thể và cách đọc ấy. Câu tiếp theo về biểu hiện hợp tác/thu lợi là chủ đề khác, còn yêu cầu phối hợp Nô và tam phương.

Đã thêm `paid-book.thp1-130-tu-from-no-loc`: điều kiện Hóa Lộc năm sinh tại **Nô**, khi xét quan hệ với con theo mô hình cung chức Khâm Thiên. Giữ nguyên “có thể”, quan điểm tác giả và phạm vi cục bộ; không xác nhận đã có con hoặc gia đình thực tế hòa hợp. **Lộc vẫn ở Nô**, không thành Lộc tại Tử, không biến Tử VCD thành có chính tinh và không giải xong việc nhận Cơ–Cự xung của Tân Biên. Không suy số con, sinh sản, giới tính, học vấn hoặc lợi nhuận từ câu này.

### Tử Tức — nhánh Khoa riêng, khi thực sự phù hợp

**Phần2: Thiên Cơ Luận, PDF196–197, §2.4, Ý tượng cơ bản của Tứ Hóa năm sinh tại Tử Nữ**, nhánh Hóa Khoa. Có vế nho nhã/biết nghe lời/hiếu học; chỉ giữ phương diện học hỏi và ứng xử theo biểu tượng, không coi là đánh giá một trẻ thực tế.

Đã thêm `paid-book.thp2-196-tu-khoa` **chỉ khi Khoa năm sinh tọa Tử**. Loại vế số lượng con, hình thể, sinh sản và các chủ đề khác khỏi đầu ra cá nhân; không hứa thành tích. Mẫu đối chứng có Khoa ở Phu nên **không nhận nhánh Khoa này**; được kiểm thêm bằng một snapshot engine QA khác có Khoa tại Tử. Đào Hoa/Ân Quang hoặc VCD không được dùng để thay điều kiện Khoa.

### Phu Thê — nét xung động, chưa phối hợp toàn bộ

**Phần2 PDF173 và178, §2.3.7 mở đầu và mục(4)**: Phu có **Thất Sát hoặc Tham Lang hoặc Phá Quân**. Nguồn mô tả với lượng từ **phần nhiều**, nhấn nét mạnh/chủ quan/xung động khi theo đuổi điều mình cho là tốt đẹp, và lưu ý quan hệ cần tâm tư duy trì. Đầu mục nói rõ đây là những gợi ý đơn lẻ **chưa tính** phụ/hung tinh đồng cung, can cung phi hóa và tự hóa.

Đã thêm `paid-book.thp2-178-phu-sat-pha-tham`, dùng sao **tọa** Phu có nguồn đã kiểm, không lấy hội chiếu thay thế. “Chưa tính” không được đổi thành điều kiện “phải vắng phụ tinh”. Không biến “phần nhiều” thành mọi người; không gán cá tính thực cho phối ngẫu hoặc dự báo cưới nhanh/chia tay. Không gọi đây là phép phối hợp **Phá–Đà–Hỏa**, không dùng Khoa xóa sát hoặc bỏ Tuần. Giữ riêng quan điểm Tứ Hóa phái.

### Những nguồn vẫn giữ ngoài

- Đà La/Phá tại Phu trong các đoạn **nữ mệnh** PDF171–172 không thành lời về người vợ của mẫu nam. Các lời định phẩm hạnh hoặc bạo hành không thành khuyến nghị khách hàng.
- Toàn Thư87 nói Thiên Lương có “nhiều gia nhân”; không đổi số lượng gia nhân thành bạn bè trung thành hoặc giúp việc tốt. Nhánh đồng Thiên Đồng/Thiên Cơ cũng không được áp khi thiếu đồng cung.
- NPL383 Ân Quang/Thiên Quý thuộc bối cảnh nhóm sao và con nuôi/sinh sản; không suy OR từ dấu phẩy hoặc lấy một Ân Quang tại Tử thành phẩm chất con.
- Tử VCD nhận Cơ–Cự: các điều kiện muộn sinh, trạng thái/nơi nhận lời còn giữ theo hồ sơ cũ. Nguồn Lộc tại Nô là một cách đọc riêng, không sửa hoặc chọn thắng các điều kiện ấy.
- Các nhánh can cung/tự hóa/phi hóa cần dữ kiện chưa xác minh không được thay bằng Tứ Hóa năm sinh. Không tự xây phép phi hóa hoặc an lại sao.

[Hồ sơ nguồn và hash bảy trang trụ cột dùng cho bốn trích ý](../.local/ai-paid-context-sources-20261101/source-audit.json) giữ ngoài Git; không gọi đây là hiệu đính toàn sách hoặc kiểm ảnh mới. Ngoài các trang trụ cột, đã đối chiếu các đoạn loại/giữ nêu trên và hồ sơ đã có, không đọc lại toàn PDF.

## 2. Ngữ cảnh Quan/Tài và prompt2.2

Nguyên nhân có bằng chứng từ ba bài vòng trước: C8 có nguồn phù hợp nhưng hai bài Quan/Tài2.1 không dùng. Prompt2.1 ưu tiên ít ý trực tiếp và phần hỏi tự đối chiếu, chỉ nói có thể dùng liên cung; đầu vào chưa chỉ rõ liên hệ nào cần phát triển. Đây là hạn chế thiết kế đầu vào/hướng dẫn, **chưa phải chứng minh nguyên nhân suy luận duy nhất của model**.

`contextGuide` mới là **gợi ý biên tập, không tri thức Tử Vi hay facts mới**:

- Tối đa hai liên hệ: Quan ưu tiên Tài rồi Mệnh; Tài ưu tiên Quan rồi Mệnh. Chỉ lập khi có nền A/B direct tại cung mục tiêu, nguồn C đã khớp và quan hệ trine/opposition đã kiểm. Không dùng nhóm C thuần `method-gloss` để ép liên hệ.
- Mỗi link trỏ đến tối đa3ID nguồn C và3ID nền trực tiếp, facts hình học, chính tinh/vòng sao đã truy nguồn và Tứ Hóa năm sinh liên quan. Trên mẫu Tài→Quan có đủ ID **Bạch Hổ–Tấu Thư và Quyền**, tránh thu gọn mất dữ kiện vòng sao. Không sao chép lại văn nguồn vào guide, không thay conditions/exceptions/provenance.
- Góc đọc phân biệt phương diện công việc, nguồn tiền và Mệnh; không mặc định nguồn nào cũng nói về thu nhập hay tổ chức. Không đổi công việc thuận thành lợi nhuận hoặc tự đặt phép bù trừ.
- C8 và bytebudget cũ giữ nguyên. Guide của Quan/Tài lần lượt1.981/1.963bytes; tổng input+prompt100.896→102.855 và101.711→103.652bytes, tăng khoảng2% do ID/gợi ý. Đây là byte UTF8, không token thực hoặc chi phí.

Prompt mới **`paid-palaces-vietnamese-2.2.0`**, retrieval **`paid-retrieval-1.4.0`**, schema vẫn **`paid-reading-v2.0.0`**, facts vẫn1.1.0. Prompt được tổ chức lại thành ưu tiên facts/nguồn → khai thác ngữ cảnh → biên tập → định dạng/an toàn. Yêu cầu chọn một liên hệ có ích khi guide phù hợp, giải thích lời ở cung gốc, vì sao nên đọc cùng, và ranh giới của phép nối; không dành chỗ cho coaching rồi bỏ hết ngữ cảnh. Không ép dùng mọi link, mọi cung hoặc một chương riêng; insufficient vẫn0section.

Chỉ validator của **prompt2.2** thêm kiểm tên cung gốc trên mọi đoạn dẫn C, kể cả `ai-synthesis` trộn A/B. Không cho thêm một ID trực tiếp để giấu chủ thể của C. Phép so tên mới chuẩn hóa Unicode/hoa-thường cho trường hợp tổng hợp, không phải bộ kiểm chứng ngữ nghĩa. Các validator/schema/version cũ vẫn được chọn từ job/attempt, không áp ràng buộc mới lên GET cũ. Không migration, retry, backoff, ngân sách hoặc thay edition/offer.

`reviewPaidContextUse` là hàm chẩn đoán **chỉ đọc** cho dry-run/review: có guide nhưng không đoạn nào dẫn nguồn và nêu cung gốc thì báo `supported-context-not-used`. Một liên hệ hợp lệ là đủ, không quota dùng hết C. Insufficient không bị ép thêm lời. Hàm không đổi coverage, job status, quyền hoặc tự retry; chưa gắn thành dashboard/consumer/scheduler. Có citation không chứng minh lập luận hay, vẫn cần đọc bài thật.

Tham khảo [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) về chỉ dẫn, ngữ cảnh và kiểm phiên bản; không dùng tài liệu này làm chứng nhận chuyên môn Tử Vi.

## 3. Dry-run và ví dụ mock

Cùng snapshot đã lưu của vòng trước, hash nguồn `bbeaa031ed477ac4f5cd9c744cb8d8fa51f03c514a424397ae976e498ceed370`. Không tính lại snapshot đối chứng. Một snapshot QA engine riêng có Khoa tại Tử dùng kiểm điều kiện dương; không sửa facts để tạo witness.

- **Nô:** nguồn trực tiếp0→1; mock limited với fact `natal.Lộc` tại Nô, không lấy chính tinh khác làm căn cứ thay Lộc.
- **Tử:**0→1 từ nhánh đối đãi Lộc tại Nô; mock limited, không giả Khoa tại Tử. Witness khác nhận nhánh Khoa đúng vị trí; không cộng hai nhánh không cùng điều kiện vào mẫu đối chứng.
- **Phu:**1→2, thêm gợi ý Sát/Tham/Phá riêng, không thành bộ ba Đà–Hỏa. Mock limited.
- **Quan/Tài:** direct vẫn3/3, C8 nguyên; guide lần lượt Tài/Mệnh và Quan/Mệnh. Hai bài2.1 cũ được đọc offline cùng guide tái dựng và đều phát hiện bỏ toàn bộ các liên hệ đề nghị. Mock mới dùng một liên hệ có tên cung gốc và ID hợp lệ, qua validation2.2; không đổi bài cũ.

Mỗi packet vẫn **159facts**, hash facts cũ/mới bằng nhau, mọi object nguồn cũ còn nguyên và không có template chưa resolve. [Tổng hợp trước/sau, guide và cảnh báo bài cũ](../.local/ai-paid-context-sources-20261101/dry-summary.json).

Ví dụ dưới đây là **mock kiểm contract/nguồn, không phải bài Astra hoặc lời luận mới đã được duyệt cho khách**:

- [Nô — dữ liệu và mock](../.local/ai-paid-context-sources-20261101/Nô-Bộc-dry.json), [bản đọc mock](../.local/ai-paid-context-sources-20261101/Nô-Bộc-dry.mock.md).
- [Tử — dữ liệu và mock](../.local/ai-paid-context-sources-20261101/Tử-Nữ-dry.json), [bản đọc mock](../.local/ai-paid-context-sources-20261101/Tử-Nữ-dry.mock.md), [witness Khoa đúng Tử](../.local/ai-paid-context-sources-20261101/Tu-Khoa-positive-input.json).
- [Phu — dữ liệu và mock](../.local/ai-paid-context-sources-20261101/Phu-Thê-dry.json), [bản đọc mock](../.local/ai-paid-context-sources-20261101/Phu-Thê-dry.mock.md).
- [Quan — guide/prompt/mock](../.local/ai-paid-context-sources-20261101/Quan-Lộc-dry.json), [bản đọc mock](../.local/ai-paid-context-sources-20261101/Quan-Lộc-dry.mock.md).
- [Tài — guide/prompt/mock](../.local/ai-paid-context-sources-20261101/Tài-Bạch-dry.json), [bản đọc mock](../.local/ai-paid-context-sources-20261101/Tài-Bạch-dry.mock.md).

## 4. Kiểm thực sự chạy và bảo toàn

**92/92test liên quan đạt:**89pure trong8file và3ca DB V2 trên database test riêng. Có điều kiện Lộc/Khoa năm sinh so với Lộc Tồn/tự hóa, đúng cung, sao chiếu không thành tọa, nguồn thiếu không tạo guide, C thuần phương pháp không ép dùng, references/role/phủ định y khoa, V1/V2 và SDK CREATE/GET mô phỏng theo version đã lưu. Ca mới chặn C bị giấu bằng cách trộn A/B nhưng không tên cung gốc; chấp nhận tổng hợp có tên cung viết thường/NFD. Một link đủ, không ép đủ hai link.

DB riêng cổng55451, `tinhluan_ai_menh_paid31_test_content_1793528616480`, identity/data_directory được kiểm trước chạy; restore backup QA vào instance mới, không migration hoặc DB gốc. Các handler thanh toán/job chỉ chạy trong test mock scope synthetic; không worker thanh toán chính. Kiểm duplicate payment/grant/enqueue, đọc nhiều lần không tạo mới, giữ Mệnh, insufficient giữ quyền, V1pending tiếp tục schema/responseID/attempt cũ khi writer2.2 bật, billing giữ receipt. [Biên nhận DB test](../.local/ai-paid-context-sources-20261101/test-db-receipt.json).

Typecheck đạt. Build cuối Node24.22.1 cách ly, key rỗng, AI tắt, DB cổng1; BUILD_ID `QzPj4G4XnE4qZMGJoF-yd`. **Không serve build**, không kiểm browser/mobile mới, không toàn E2E/PDF. Các lượt kiểm lặp chỉ theo source/guard mới thêm; không có test fail cần sửa facts, nguồn hoặc lịch sử để xanh. [Build](../.local/ai-paid-context-sources-20261101/build-final.json), logs89/3 và typecheck giữ tại cùng thư mục private.

**0CREATE/0GET OpenAI thật,0Luna, chi phí API0USD**. Fetch thật bị chặn trong launcher mock, SDK chỉ dùng fetch fixture; web OpenAI Docs không phải Models/Responses API. Không bật consumer/supervisor hoặc xử lý queue QA hiện hành. Prompt1.x/2.0/2.1 giữ nguyên byte,79artifact lịch sử khớp hash, kể cả ba bài thật vòng gần nhất. [Bằng chứng bảo toàn](../.local/ai-paid-context-sources-20261101/history-check.json). Mệnh V1/Luna, quyền/báo cáo cũ và Bửu Đình không sửa; QA3118 giữ PID68941, QA3062/3070 không cập nhật/restart.

DB test55451 đã được dừng riêng sau kiểm, data directory giữ lại; không có web/consumer/supervisor mới. [Biên nhận dừng](../.local/ai-paid-context-sources-20261101/shutdown.json).

## 5. Giới hạn còn lại

Đầu vào của hai điểm chặn đã có bổ sung thực chất và cơ chế kiểm mock. **Chưa thể kết luận Astra2.2 viết sâu hơn hoặc đã đạt phát hành** vì nhiệm vụ này không gọi provider. Nô/Tử mới có vế cục bộ, Phu chưa có phép phối hợp Phá–Đà–Hỏa; Tử VCD nhận Cơ–Cự và Liêm–Hao vẫn chưa được nguồn này giải quyết. Không nâng limited thành chuyên sâu hoặc dùng số nguồn làm thước đo chất lượng.

Giữ nguyên bài đã lưu và kết luận chưa phát hành của vòng trước. Dừng ở code/mock/build, không tự gọi API hoặc mở một gói triển khai tiếp theo.
