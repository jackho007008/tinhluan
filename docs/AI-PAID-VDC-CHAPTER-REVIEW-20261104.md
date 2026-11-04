# Đọc tiếp Sơ cấp: Tài, Phu và Tật — 04/11/2026

Baseline `main@ccbbfb2`; tracked/index sạch, giữ `buu-dinh-7parts/` và `docs/design-handoff/`. Chủ dự án yêu cầu đọc tiếp, phần đủ căn cứ áp dụng vào bài mới; mock, chưa API, giữ lịch sử và QA3062/3070. Đây là tiếp tục lô nguồn hiện có, không dự án rule hoặc gói thương mại mới.

## Đã đọc đến đâu

Đã đọc liên tục hết ba mục ưu tiên của bản cung cấp: **Phu Thê PDF189–199, Tài Bạch PDF207–216, Tật Ách PDF217–228**. Trong đó 26 trang chưa đọc ở phiên trước; 7 trang nội dung đã có được tái dùng/đối chiếu khi nối câu và đề mục. Đã kiểm thêm ảnh197,198,211,212,217,218. Lũy kế nhật ký: 41 trang nội dung, 16 trang kiểm ảnh; 305 trang đã trích **không đồng nghĩa đọc hết sách**. Trang228 bắt đầu mục Thiên Di sau khi kết thúc Tật, chưa tính là đã đọc toàn chương Thiên Di.

Vẫn là bản dịch máy Tử Vi Cổ Học, attribution Vương Đình Chi trên bản cung cấp; chưa đối chiếu nguyên bản Trung văn. SHA PDF `76a4c21032f603643cc87d47285bc7f3f6684c164d4d9f47a233c0cfc3e39a77` giữ nguyên. Mục lục cũ không dùng làm số trang hiện tại. Không sửa chữ gốc, không dùng câu dịch hỏng để tự đoán toán tử. Có thêm ghi nhận đoạn Thiên Tướng/Thiên Lương lặp ở214–215; không đếm thành hai nguồn độc lập.

[Nhật ký đọc](../.local/vdc-intro-depth-20261104/reading-receipt.json) · [10 phiếu nguồn có hash và quyết định](../.local/vdc-intro-depth-20261104/source-cards.json) · [trang còn lại/chưa đánh dấu đọc](../.local/vdc-intro-depth-20261104/remaining-pages.json). Trang đầu đã kiểm ảnh nhưng không tính là trang nội dung đã đọc. Không thay checkpoint/receipt phiên trước.

## Tài Bạch: đã tách rõ điều kiện, chưa nhận phép Liêm–Hao

Mục Liêm ở211–212 tách **Miếu, Hãm, Hóa Kỵ và từng tổ hợp** Liêm–Tướng/Sát/Phá/Phủ/Tham. Mẫu QA hiện tại Liêm Vượng theo bảng Tân Biên; chưa có đặc tả tương đương độ sáng giữa hai tác giả. Không tự coi Vượng là Miếu để nhận câu của nhánh Miếu; cũng không đổi facts hoặc tính lại bảng sao.

Đoạn hao tổn đi cùng thu tiền ở cuối212 nằm dưới đề mục **Thiên Phủ thủ Tài**, không phải Liêm Trinh. Mẫu có Phủ ở Mệnh nên không nhận lời ấy như Phủ tại Tài. Phá ở Phu cũng không thành Liêm–Phá tại Tài; vế có Đại Hao trong nhánh Liêm–Phá không được rút riêng. Cụm Không–Kiếp–Đại Hao chưa đủ rõ lượng từ trong bản dịch để tự chọn AND/OR.

Áp dụng vào unit phương pháp `thp2-tai-transaction-spending`: giữ khung tạo thu/nhịp thu/giữ tiền và ngữ cảnh Mệnh–Quan–Phúc của1.16; thêm kiểm chủ thể, độ sáng và hệ sao trước khi tổng hợp. **Không thêm lời dự báo tiền, nghề nghiệp, tài sản, lợi nhuận hoặc phép chế hóa.** Không coi sách Sơ cấp là chứng nhận cho nhánh quản lý Liêm Dần/Thân ở bản Thâm tạo đã tìm trên web.

Giá trị đối với bài mới: tránh mượn nhầm một câu nghe có chiều sâu để lấp khoảng trống Liêm–Hao. Nguồn này chưa tự bổ sung được một luận điểm cá nhân độc lập cho mẫu Tài; bài chuẩn cũ giữ nguyên.

## Phu Thê: đọc đủ nhánh, không đổi dự báo thành tâm lý

Mục Phá ở197 tách Tý/Ngọ, Dần/Thân, Thìn/Tuất, còn phân biệt nam/nữ và điều kiện ở Mệnh/Phu. Câu về giúp chồng sự nghiệp trong nhánh Thìn/Tuất có chủ thể nữ mệnh, không tự biến thành lời chung cho mọi người. Các mệnh đề kết hôn/ly tán/ngoại tình hoặc đặc tính phối ngẫu không được sửa cho nhẹ rồi trình bày như tác giả đã nói về nhu cầu tự chủ, sức hút hay phong cách tranh luận.

Mục Tả ở198 có điều kiện không gặp sát; không dùng vế đó cho hình thế có Đà/Hỏa chỉ vì cùng có Tả. Giữ riêng lời Tứ Hóa phái về **trợ giúp qua một giai đoạn**, không lấy tác giả mới ghi đè hoặc xóa sắc thái thời đoạn. Hỏa ở198 chia Miếu/Hãm; mẫu QA chưa có độ sáng Hỏa, nên không chọn nhánh. Đà ở199 là mục riêng, không chứng minh một công thức phối hợp cả ba sao. Những câu dịch sai tên sao giữ nghiên cứu, chưa sửa nghĩa theo phỏng đoán.

Áp dụng unit mới `vdcsc-phu-conditional-reading`: chỉ method/D/reference-only, yêu cầu Phá, Đà, Hỏa cùng Phu và facts đã truy nguồn. Dùng để kiểm điều kiện và giữ chủ thể khi phân tích; không chứa kết luận cá nhân mới. Không hạ các điều kiện mới thành một lời rào lặp trong thân bài; các giới hạn phục vụ lựa chọn/kiểm nội dung, không phải dàn ý buộc viết thành chương.

## Tật Ách: đã đọc hết mục, chưa có lời cá nhân T1 đủ phạm vi

Mở đầu217–218 nêu Phụ/Huynh/Điền, đối chiếu Mệnh, rồi trình bày khó khăn khi nối cách giải truyền thống với tên bệnh hiện đại và giới hạn tư liệu. Có thể nhận **lịch sử cấu trúc phương pháp và giới hạn tác giả tự nêu**, không xác nhận phương pháp đúng về y khoa. Giữ riêng với phương pháp Mệnh–Thân–Phúc/cứu–tác của Tân Biên.

Phần còn lại218–228 chủ yếu gắn âm dương/ngũ hành, sao, hệ sao với cơ quan/bệnh, tai họa hoặc thời điểm; kể cả lời giải cứu cũng là khẳng định sức khỏe. Chưa tìm được một mệnh đề mới đủ điều kiện và không y khoa để thành bài Tật cá nhân trên mẫu QA vô chính diệu. Có mục Diêu/Sứ/Quả Tú nhưng đầu ra vẫn về cơ thể; không tìm thấy mục riêng về Trực Phù/Quốc Ấn/Bệnh Phù trong chương này. Đây là kết quả rà đúng chương, không tuyên bố toàn bộ kho sách không có.

Áp dụng phần lịch sử/giới hạn vào `tb182-tat-t1-branches`, bỏ toàn bộ tên bệnh/ví dụ cơ thể khỏi đoạn mới gửi model. **Không đổi lời bệnh thành “áp lực”, “sức bền”, “hồi phục” khi nguồn không hỗ trợ.** Không tự mượn sao, đặt ngưỡng nhiều sao cứu, dùng Thiên Y làm bảo đảm, chẩn đoán/tuổi thọ/điều trị. Tật vẫn0direct và trạng thái insufficient; quyền, UI và các giới hạn T1 không đổi.

## Tích hợp cho đầu vào mới

- Retrieval **1.17.0**, prompt2.8/schema ReadingV2/guide1.1/facts1.1 giữ nguyên. Loader ưu tiên `index-v117.json`, giữ fallback1.16 khi file mới không tồn tại; file mới hỏng thì từ chối. Mọi phiên bản/input/attempt cũ giữ đọc nguyên.
- Kho riêng18unit: 2unit phương pháp mở rộng, 1unit phương pháp mới; không unit direct/foundation mới, không thay luật an sao/evaluator. Vẫn chỉ cho `vdcsc` vào kind=method; không nới schema trang, số nguồn hoặc trần14.000byte.
- Phu có2 phương pháp sách cụ thể trong D, khiến phương pháp chung `paid-method.inherited-NPL-45` không còn trong3slotD của input mới. Đoạn cũ bàn can hợp/phá và phối hôn hai lá số, không luận điểm trực tiếp của mẫu. NPL15 cùng mọi A/B/C vẫn giữ. Đây là chọn theo relevance/budget hiện có, không sửa hay xóa nguồn/lịch sử NPL45.
- Tài library11.391byte, Phu9.127byte, Tật2.567byte. Nô/Tử và sáu cung khác giữ nguồn; 159facts/cung và toàn bộ A/B/C của11cung không đổi.

Private: [index mới](../.local/source-library/knowledge/paid-passages/index-v117.json), [script dựng/nhật ký](../.local/vdc-intro-depth-20261104/prepare.py), [bundle44artifact có hash](../.local/vdc-intro-depth-20261104/private-bundle-manifest.json). Sách/toàn văn/bundle ngoài Git, không đưa vào public. Hai index1.16/1.17 là hai file riêng. Inventory cập nhật đếm đọc/ảnh cho đúng cuốn, có bản trước sửa; metadata đọc không được coi là bài lịch sử. Chuyển máy cần chuyển bundle riêng, không chỉ checkout Git.

## Kiểm thực sự đã chạy

Dry11 bằng factory chung, chặn network/không DB: facts và A/B/C nguyên; thay đúng2unitD ở Tài/Tật, thêm1/bớt1D ở Phu, tám cung còn lại nguyên. 10 bản biên tập và Tật insufficient qua validator với input1.16 lẫn1.17. 5probe âm: thiếu Hỏa, sai cung Hỏa, sao chưa truy nguồn, D bị nâng thành lời trực tiếp và khẳng định y khoa đều bị từ chối. **Mock không đánh giá được chiều sâu model hoặc xác nhận Tử Vi đúng đời sống.** 201file bài/input/index cũ giữ hash. [Script](../.local/vdc-intro-depth-20261104/check.ts) · [dry-run](../.local/vdc-intro-depth-20261104/mock-summary.json).

140 test riêng biệt tại6file đạt: library, adapter, scope-input, source-fidelity, V2, safety. Lượt đầu139/140; assertion còn đòi NPL45 ở input Phu mới không còn phù hợp với3slotD. Đã kiểm nội dung bị thay, ghi lý do ở trên rồi đổi assertion hiện hành sang unit Phu mới và giữ trần3; chạy lại đúng adapter13/13. Không sửa expected lời nguồn/bài lịch sử hoặc nâng quota để xanh. Hai ca mới kiểm index1.17 ưu tiên bản mới, bảo toàn1.16/fallback khi thiếu và từ chối bản mới hỏng. Log đầu và chạy lại giữ riêng.

Typecheck/build bản sao cách ly đạt, không ghi `.next` runtime. Build còn cảnh báo nhiều lockfile do bản sao lồng repo, không đổi cấu hình web để xóa cảnh báo. Không chạy E2E/UI/mobile hoặc xuất PDF sản phẩm vì không sửa UI. Ảnh ở đây là kiểm nguồn PDF. **0 CREATE/GET model, 0 DB/worker/supervisor/deploy; không restart/cập nhật QA3062/3070.**

## Chưa thể gọi là hoàn thiện thương mại

Đã khép đọc ba chương ưu tiên, chưa khép mọi khoảng thiếu. Ba điểm còn thiếu thực sự: (1) điều kiện/độ sáng của từng tác giả và nhánh tổ hợp chưa được xác minh tương đương, không có phép Liêm–Hao/Phá–Đà–Hỏa mới; (2) chưa có lời Tật cá nhân đủ phạm vi T1, đọc thêm các dự báo bệnh không giải quyết điều này; (3) chưa có bài model mới hoặc nghiệm thu toàn văn cho input1.17. Chưa cần gọi API chỉ để chứng minh đã đọc thêm nguồn.

Checklist hồ sơ giữ nguyên: Phụ90%, Phúc90%, Điền90%, Quan90%, Nô90%, Di90%, Tật90%, Tài90%, Tử90%, Phu90%, Huynh90%; **không phải phần trăm chất lượng/độ phủ/sẵn sàng thu phí**. P09 Tài partial, commercialReady=false. Không tăng % bằng số trang đọc.

Phần đọc tiếp có mục tiêu: nguyên tắc/chương chính tinh liên quan độ sáng và ngữ nghĩa Liêm/Phá trước khi nhận lời cá nhân; nhật ký đã chỉ rõ trang chưa đọc. Nếu cần xác minh câu bản dịch hỏng, cần nguyên bản đúng mục chứ không yêu cầu chủ dự án chọn câu thắng hoặc mua sách chung chung. Dừng ở kiểm offline; chưa có quyền gọi model/publish/deploy mới.
