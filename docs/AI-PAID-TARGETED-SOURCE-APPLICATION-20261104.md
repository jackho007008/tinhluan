# Thiên Lương/Nô, điều chỉnh Phu, quan hệ Tử và Tật T1 — 04/11/2026

Baseline `main@ef606fc`, tracked/index sạch trước sửa; giữ `buu-dinh-7parts/` và `docs/design-handoff/`. Lô hữu hạn theo yêu cầu chủ dự án: khai thác bốn điểm đã chỉ định, áp phần đủ căn cứ vào đầu vào/bản biên tập mới, mock. Không API, DB, worker, deploy hoặc đổi bài đã lưu. **Chưa đạt nghiệm thu thương mại.**

## Đầu ra để đọc

- [Bản Nô và Phu đã biên tập; Tử hiện hành và ví dụ điều kiện riêng](../.local/ai-paid-four-targeted-20261104/readings.md). Đây là đề xuất của Codex, không phải kết quả model hoặc bài đã được chủ dự án duyệt.
- [Chú giải Tật T1 theo đúng cấu trúc](../.local/ai-paid-four-targeted-20261104/tat-t1-review.md), [facts và nguồn T1](../.local/ai-paid-four-targeted-20261104/tat-t1-evidence.json). Chỉ nghiên cứu, không đưa vào sections trả phí.
- Dấu vết từng đoạn: [Nô](../.local/ai-paid-four-targeted-20261104/palace-4-evidence.json), [Phu](../.local/ai-paid-four-targeted-20261104/palace-9-evidence.json), [Tử](../.local/ai-paid-four-targeted-20261104/palace-8-evidence.json).

## Nô: đã sử dụng nền Thiên Lương, không tạo công thức mới

Tái dùng Hàm Số125, đoạn tác giả nói các nét nhân hậu/khoan hòa/mềm mỏng cho cả đắc và hãm. Không áp bảng sáng Tân Biên sang các nhánh riêng của Hàm Số. Bản mới nối **cách đối đãi mềm mỏng** với **kỳ vọng được đáp lại** từ Lộc năm sinh tại Nô; tách phần tổng hợp khỏi lời nguồn. Bỏ một đoạn tổng hợp cũ trùng ý, không tăng chiều dài để làm giả độ sâu.

Bài Nô mới có ba phần/năm đoạn. Không kết luận bạn bè nhân hậu, trợ giúp chắc chắn, Lộc giải Lương hãm hoặc quan hệ bền vững. Các điều kiện phi hóa về chân tình/lợi ích vẫn chưa có. Guide mới chỉ hướng dẫn khai thác nền nếu unit đã được chọn; không thêm lời nền vào lá số không có Thiên Lương phù hợp.

## Phu: điều chỉnh bằng cách loại nhánh không phù hợp

Tái dùng hồ sơ THP2/173–174,179 và Sơ cấp197–199 đã kiểm ảnh ở lượt trước. Nhánh Tả của Sơ cấp đòi **không gặp sát** để nhận lời thuận hòa. Mẫu đang có Đà La và Hỏa Tinh đồng cung Phu, nên không nhận nhánh ấy. Không suy ngược “không nhận thuận hòa” thành “chắc chắn bất hòa”.

Giữ riêng lời Tứ Hóa phái: **thường thường**, **từng trợ giúp trong một giai đoạn**, **va chạm rồi mới hợp**. Không dùng một tác giả xóa tác giả kia. Bản Phu mới có ba phần/bảy đoạn, một đoạn giải thích điều chỉnh ngay tại luận điểm trợ giúp; không dựng thêm chương giới hạn. Method/D được dẫn cùng luận điểm trực tiếp trong đoạn `ai-synthesis`, không nâng D thành lời nguồn áp cá nhân.

Đã khép việc loại nhánh thuận sai điều kiện; **chưa có phép phối hợp Phá–Đà–Hỏa/Tuần đầy đủ**. Thiếu độ sáng Hỏa không được tự chọn Miếu/Hãm; Khoa/Tả không hóa giải tự động. Những câu dịch máy mơ hồ vẫn không thành claim mới.

## Tử: có luận điểm quan hệ mới có điều kiện, chưa áp được mẫu đang xét

Đã kiểm ảnh THP2/191, mục Duyên phận của mệnh tạo với con cái. Với **Hóa Kỵ năm sinh tại Điền**, nguồn nêu hai vế: có con muộn; sau khi sinh con rất yêu thương con cái. Chọn riêng phương diện tình cảm sau khi đã có con; vế muộn sinh là kết quả tác giả nêu, **không tự biến thành điều kiện “phải sinh muộn mới yêu con”**, cũng không đưa vào dự báo/khuyên thời điểm sinh.

Unit mới `thp2-tu-dien-natal-ky-affection` giữ đích luận **Tử Nữ**, fact neo **Kỵ năm sinh tại Điền**. Không chuyển Kỵ sang Tử, không suy con đáp lại/hiếu thuận/được thừa hưởng hoặc cha mẹ kiểm soát. Nguồn có thể hỗ trợ một chiều tình cảm; không bảo đảm hòa hợp hai chiều.

**Lá số QA đang đối chiếu có Kỵ tại Mệnh, nên unit mới bị loại.** Bài Tử đó vẫn một phần/ba đoạn, một luận điểm Lộc tại Nô; không đổi nhãn thành chuyên sâu. Có thêm ví dụ engine QA khác khớp điều kiện để kiểm selection và validator, không dùng ví dụ ấy thay bằng chứng của mẫu cũ. Factory tính đúng snapshot/receipt; không sửa facts, không chọn theo tên/ID. [Input ví dụ riêng](../.local/ai-paid-four-targeted-20261104/tu-conditional-input.json), [bản đọc riêng](../.local/ai-paid-four-targeted-20261104/tu-conditional-proposal.json).

Hai nhánh khác đã kiểm nhưng chưa nhận: THP2/191 đòi Hóa Kỵ/sát xung và còn phi hóa ở các dòng tiếp theo; không tự suy toán tử hoặc tính phi hóa. TB205 §13.3.38 Quang–Quý nói về **con nuôi**, chưa đủ đặc tả vị trí/toán tử để dùng Ân Quang tại Tử và Thiên Quý tại Nô như một tổ hợp áp dụng; không đổi thành mọi con hoặc mọi quan hệ. TB201/207 có chỉ dẫn VCD nhưng nhánh Cơ–Cự chưa cung cấp thêm lời đối đãi đúng phạm vi. Không cần thêm sách chung chung để che các điều kiện cụ thể này.

## Tật: đã làm chú giải T1 cụ thể, chưa đóng đầu ra cá nhân

Đính chính cách diễn đạt quá hẹp ở bàn giao trước: T1 cho phép thẩm định chú giải thuật ngữ cổ đúng cấu trúc; không có quy định cấm nghiên cứu mọi câu có tên bệnh. Tuy nhiên việc được nghiên cứu **không** tự cho phép xuất lời sức khỏe hoặc tính một đoạn trích là cung đã giao.

Bản mới nhận diện chính xác Bệnh Phù vòng Bác Sĩ, tách Bệnh/Mộ của Trường Sinh; dẫn câu nền trong tư cách văn bản, không đánh giá sức khỏe. Đối chiếu Hình tại Điền, Kỵ tại Mệnh, Hao tại Tài, Kiếp tại Tật; chưa khóa phép áp hai nhánh Hình–Kỵ/Hao–Sát. Không lấy Thiên Y làm điều chỉnh không có nguồn, chuyển Quyền/Tả sang Tật hoặc biến từ bệnh thành stress/sức bền.

T1 còn thiếu **điều kiện chọn nhánh và điều chỉnh trực tiếp**, không chỉ thiếu tên sao. Hai mẫu T1 trước chưa được duyệt vẫn nguyên. Runtime giữ `insufficient`, zero direct/zero sections; quyền không đổi. Guard chưa hỗ trợ xuất bản chú giải trích thuật ngữ của hồ sơ nghiên cứu này, không nới guard trong lượt này. Không gọi đây là bài cá nhân hoàn tất.

## Phiên bản, kho riêng và bảo toàn

- Retrieval `paid-retrieval-1.19.0`; guide `paid-context-guide-1.2.0`; prompt2.8, facts1.1, ReadingV2 giữ nguyên. Reader/CREATE/GET/queue không sửa; attempt cũ dùng input đã lưu.
- Index riêng `index-v119.json`: 19 unit, thêm một direct Tử có điều kiện; sửa hai method Phu/Tật. Foundation Nô và sourceReview không đổi. Không nâng trần14.000byte hoặc số slot nguồn. Thiếu index mới thì dùng phiên bản trước; index mới hỏng thì từ chối. Không sửa các index cũ.
- Dry-run cùng snapshot đủ11:159facts/cung nguyên, không nguồn cũ bị rơi; chỉ hai method Phu/Tật thay text/limits. Các cung không liên quan giữ knowledge; guide có version mới, chỉ framing Nô/Phu đổi nội dung. Kho Phu9.532byte, Tật2.893byte, Nô9.569byte; vẫn trong trần. Mẫu Tử riêng chọn nguồn mới đúng vị trí.
- [Receipt nguồn](../.local/ai-paid-four-targeted-20261104/source-receipt.json), [index mới](../.local/source-library/knowledge/paid-passages/index-v119.json), [bundle private có hash](../.local/ai-paid-four-targeted-20261104/private-bundle-manifest.json). Chuyển máy phải mang kho private; Git không chứa sách hoặc index riêng. Đã kiểm bundle cho bốn cung và ví dụ Tử mới cho kết quả giống kho gốc.
- 264 artifact cũ giữ hash, snapshot gốc nguyên; không sửa Bửu Đình hoặc hai thư mục untracked. Không .env/key, không DB/API/worker/supervisor/payment.

## Kiểm thực sự chạy, gồm lỗi đầu

136 test duy nhất thuộc sáu file library/context-guide/scope-input/source-fidelity/V2/safety đạt sau sửa assertion version hiện hành. Lượt đầu130/136: sáu failure cùng hai assertion còn đòi1.18; sau đối chiếu delta đã sửa thành1.19, chạy lại đúng source-fidelity19/19. Không đổi expected lời nguồn/historical để xanh. [Log đầu](../.local/ai-paid-four-targeted-20261104/tests-first.log), [chạy lại](../.local/ai-paid-four-targeted-20261104/tests-rerun.log).

Dry-run factory/validator hiện có:11input, các bài cũ/mới, một ví dụ Tử engine riêng,10probe âm; facts và refs/digest kiểm lại. [Script](../.local/ai-paid-four-targeted-20261104/check.ts), [log cuối](../.local/ai-paid-four-targeted-20261104/mock-final.log), [summary](../.local/ai-paid-four-targeted-20261104/mock-summary.json).

**Giới hạn validator được tái hiện:** câu giả “Tả Phù bảo đảm luôn hòa hợp” dẫn nguồn Tả vẫn qua guard vì guard kiểm sắc thái trợ giúp theo từ khóa, không chứng minh mọi nhận định đúng nghĩa. Lượt mock đầu đã fail kỳ vọng bắt câu ấy; giữ [log](../.local/ai-paid-four-targeted-20261104/mock-first.log). Không đưa câu sai vào bài đề xuất. Probe mất thời đoạn khi dùng từ trợ giúp bị chặn đúng. Ghi riêng giới hạn ngữ nghĩa, không tuyên bố đã sửa hoặc validator đủ thay đọc toàn văn; không mở rộng sang xây bộ rule ngôn ngữ mới.

Typecheck/build bản sao cách ly đạt: [typecheck](../.local/ai-paid-four-targeted-20261104/typecheck.log), [build](../.local/ai-paid-four-targeted-20261104/build.log). Không E2E/PDF/UI/mobile vì không thay renderer; không coi bản text local là UI đã nghiệm thu. 0 CREATE/GET OpenAI,0 chi phí API; không cập nhật QA3062/3070 hoặc khởi chạy consumer.

## Tiến độ và điểm dừng

Checklist hồ sơ kế thừa: **Phụ Mẫu90%, Phúc Đức90%, Điền Trạch90%, Quan Lộc90%, Nô Bộc90%, Thiên Di90%, Tật Ách90%, Tài Bạch90%, Tử Tức90%, Phu Thê90%, Huynh Đệ90%.** Đây không phải phần trăm chất lượng hoặc sẵn sàng thu phí; không nâng số bằng số nguồn mới. Nô đã dùng thêm một nền nghĩa; Phu đã loại đúng một nhánh; Tử thêm lựa chọn cho lá số đủ điều kiện nhưng mẫu hiện tại chưa thêm luận điểm; Tật hoàn thiện chú giải nghiên cứu, chưa giao bài cá nhân.

Ba điểm còn chặn: (1) độ sâu áp dụng thực tế của Tử/Tật và phối hợp Phu chưa đủ; (2) cần đánh giá toàn văn, validator cấu trúc không đảm bảo đúng nghĩa; (3) các bản tham chiếu chưa được chấp nhận và runtime phiên bản này chưa nghiệm thu. Chưa nên chi API để thử các khoảng thiếu chưa có câu trả lời. Dừng đúng lô được giao, không mở gói mới hoặc đổi phạm vi thương mại.
