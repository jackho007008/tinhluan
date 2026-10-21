# Linh Tinh và Thiên Quý — đối chiếu phép an, 09/10/2026

Đọc lại toàn bộ CHART-COMPARISON-1992-08-07 và JSON kiểm toán nội bộ. Không thay thuật toán. Snapshot d6e24db3-9311-4cb9-b046-02cc92d8cce1; result b9814a624f44267102346c1bf13bdd1f07d938d6be6a3849c811e52d6b118927. Dữ kiện đã lưu: 1992-08-07, 16:00, nam, UTC+7; âm 9/7 Nhâm Thân không nhuận. Không tự giả định phút/nơi sinh từ ảnh.

## Nguồn và cách đọc

Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên, PDF chủ dự án cung cấp trong TAILIEUTUVI. Đợt này xem trực tiếp ảnh PDF **10, 11, 12**, số trang in cũng **10, 11, 12**; đọc cả đoạn kề: §8.6.2–8.6.3, §8.7–8.11, §8.12–8.17. Không dùng website tham chiếu thay sách. Hai vị trí ảnh người dùng đọc được: Linh Tinh ở Phúc Đức Dần; Thiên Quý ở Nô Bộc Tỵ. Ảnh không có metadata scope, nên chỉ nói chúng phù hợp lớp sao theo dữ kiện sinh, không chứng minh mọi sao trong ảnh đều là bản mệnh. Snapshot ghi scope=origin cho cả hai; không gọi horoscope năm2026.

## A. Linh Tinh

### Công thức đúng phiên bản đang cài

iztro2.6.1 `lib/star/location.js:getHuoLingIndex` dùng chi năm và timeIndex; hàm **không nhận giới tính**. Nhóm Thân/Tý/Thìn khởi Linh ở Tuất rồi cộng chỉ số giờ. Chỉ số cung upstream bắt đầu Dần=0, Mão=1,…Tuất=8,Hợi=9,Tý=10,Sửu=11. Chỉ số giờ Tý=0,…Thân=8. Đây là đếm có bao gồm điểm đầu: 9 chi giờ tương ứng 8 bước.

- Nhâm Thân → nhóm Thân/Tý/Thìn → Tuất, index8.
- 16:00 → floor((16+1)/2)=8.
- (8+8) mod12=4 → Ngọ, Thiên Di, đúng snapshot.
- Cùng hàm trả Hỏa index8=Tuất, cũng trùng snapshot/ảnh.

### Phép tính riêng theo sách

PDF/in10 §8.6.3 phân hướng: Dương nam/âm nữ Linh đếm nghịch; âm nam/dương nữ Linh thuận. PDF/in11 bảng cho Thân/Tý/Thìn khởi Linh tại Tuất. Năm Nhâm dương, nam → nghịch. Tuất(Tý), Dậu(Sửu), Thân(Dần), Mùi(Mão), Ngọ(Thìn), Tỵ(Tỵ), Thìn(Ngọ), Mão(Mùi), **Dần(Thân)**. Công thức index (8−8) mod12=0=Dần. Không có thêm điều kiện loại trừ trong đoạn công thức đã đọc; không suy rằng toàn sách không có điều chỉnh khác.

**Phân loại:** khác quy ước có nguồn, cụ thể là chiều đếm phụ thuộc âm dương/giới tính trong sách so với hướng cộng cố định của upstream. Chưa chứng minh lỗi cài đặt so với hợp đồng iztro default; nếu yêu cầu sản phẩm là an Linh đúng công thức Tân Biên thì đây là chênh lệch cần một profile mới. Không phải lỗi lệch index0/1 hay chuyển lịch trong ca này.

## B. Thiên Quý

### Công thức hiện hành

`location.js:getDailyStarIndex`, `getChangQuIndex`; `utils/index.js:fixLunarDayIndex`:

- Văn Khúc khởi Thìn=index2, giờ Thân8 → (2+8) mod12=10=Tý.
- Ngày âm9 → dayIndex8. timeIndex8 không phải nhánh Tý muộn12; không tăng ngày.
- tianguiIndex = ((quIndex + dayIndex) mod12) −1, rồi fixIndex.
- (10+8−1) mod12=5=Mùi, Tật Ách; đúng snapshot.
- Ân Quang tính cùng hướng từ Văn Xương Dần0: (0+8−1) mod12=7=Dậu, phù hợp ảnh.

### Sách và điểm phải chốt

PDF/in12 §8.13: Thiên Quý bắt đầu ở Văn Khúc, coi là ngày1, đếm **nghịch** đến ngày sinh, rồi “lùi lại một cung”. Vế Ân Quang ngay trước dùng đếm thuận rồi cùng cụm “lùi lại”. Không có sơ đồ hay ví dụ giải nghĩa chữ lùi cho Thiên Quý ngay đoạn này.

Đếm nghịch đúng 9 ngày từ Tý: Tý1 → Hợi2 → Tuất3 → Dậu4 → Thân5 → Mùi6 → Ngọ7 → Tỵ8 → **Thìn9**. Từ đây:

- Nếu “lùi lại” nghĩa quay lại một bước trong trình tự vừa đếm: Thìn → **Tỵ**, index (10−8+1) mod12=3; phù hợp ảnh.
- Nếu hiểu là giảm thêm một cung theo chỉ số/chiều nghịch cố định: Thìn → **Mão**, index (10−8−1) mod12=1; không phù hợp ảnh.

**Đính chính báo cáo trước:** câu “tiếp tục lùi theo chiều nghịch → Tỵ” không đúng phép đếm. Tiếp tục nghịch phải ra Mão; ra Tỵ là quay lại theo chiều thuận. Báo cáo/JSON cũ được bảo toàn làm dấu vết; ghi đính chính tại đây, không dùng cách diễn đạt cũ làm đặc tả.

**Phân loại:** chiều đếm ban đầu khác rõ giữa sách (nghịch) và code (thuận); bước cuối chưa đủ bằng chứng để chốt đặc tả Tân Biên. Website cho Tỵ chỉ củng cố một cách hiểu, không tự giải quyết sự mơ hồ của nguồn. Chưa chứng minh một lỗi implementation của profile default hiện hành; chưa sửa sao.

## C. Kiểm tra bridge và chỉ số

Chạy trực tiếp đúng dependency cài trong tiến trình kiểm tra riêng: lunar-lite cho [1992,7,9], calendarVN cũng [1992,7,9]; timeIndex8, dayIndex8, changIndex0, quIndex10; getHuoLingIndex trả huoIndex8/lingIndex4; getDailyStarIndex trả santai4/bazuo6/enguang7/tiangui5. Không dùng output này làm expected chuyên môn: đối chiếu nguồn được tính riêng ở trên.

Bridge đổi nguồn lịch nhưng ca này không đổi ngày/tháng/chi năm đầu vào của hai phép an. Linh không dùng tháng/ngày; Thiên Quý dùng ngày9 và Văn Khúc theo giờ8. Không có off-by-one được tìm thấy giữa adapter và code cho ca này. Phút0 được lưu; engine chỉ phân chi giờ. Không thay đồng loạt algorithm=zhongzhou để sửa Mệnh chủ hoặc hai sao.

## D. Ảnh hưởng và quyết định cần chốt

Tìm trong toàn catalog, derived, template, context, UI. `fact.life-local-sat` và `fact.life-local-sat-stars` lọc Kình/Đà/Hỏa/**Linh** trong minorStars tại Mệnh. Hai rule `combination.ziwei-assistants` (ngoại lệ recorded) và `combination.ziwei-assistants-qualified` (điều kiện recorded) có phụ thuộc **gián tiếp**. Đây là nguồn Toàn Thư, không phải Tân Biên. Các fact liệt kê minor-stars cũng mang tên sao; không tự coi việc liệt kê là nhận định tác động.

Thiên Quý không có điều kiện chuyên biệt trong catalog hiện tại; chỉ là dữ kiện có thể được liệt kê từ snapshot. 21 rule tanbien.r01–r21 không dùng Linh/Thiên Quý làm điều kiện. Context ở tanbien-reading/presentation có thể nêu Linh trong các cung liên quan; đây là yếu tố chưa tổng hợp, không phải claim mới. Chi tiết kỹ thuật giữ nguyên dữ liệu gốc.

Quét 57 mục của bộ1.9 (21 DEMO/engine,36 kỹ thuật): tất cả21 mẫu DEMO/engine đều có hai sao trong snapshot; chỉ **vn-tiantong** ghi Linh tại Mệnh. Hai claim phối hợp trên chỉ xuất ở **syn-combo / syn-combo-exception**, là fixture kỹ thuật, không lá số engine. Không có claim phối hợp đang xuất ở mẫu engine dựa trên Linh tại Mệnh trong bộ đã quét. Việc đổi vị trí sau này vẫn có thể làm điều kiện vắng/có đổi; không suy rằng không cần hồi quy.

Danh sách từng mẫu, vị trí, trạng thái hai rule và claim ID: [impact.json](evidence/chart-conventions/impact.json); bảng đọc được trong [CHART-CONVENTIONS-UI.md](CHART-CONVENTIONS-UI.md). Không sửa fixture hoặc mẫu để tạo khác biệt.

Cần chủ phương pháp chốt: (1) có tạo profile an Linh theo hướng Tân Biên hay giữ upstream; (2) nghĩa bước lùi Thiên Quý, cần ví dụ nguồn/đối chiếu chuyên môn độc lập; (3) phạm vi dùng hai sao trong rule Toàn Thư khi engine và nguồn khác quy ước. Mọi thay đổi sau này phải có phiên bản mới và giữ snapshot/report cũ. Đợt này chỉ ghi chú và sửa trình bày.

## Bổ sung nguồn Thiên Quý — phụ lục, 09/10/2026

Đợt tiếp theo đọc trực tiếp ảnh PDF/trang in **272–275**, mục **6.1–6.4** (bốn lá số phụ lục), cùng ảnh trang12 §8.13. Tìm toàn văn tên Thiên Quý và cụm “lùi lại”; đoạn đại cương ý nghĩa sao không giải nghĩa phép đếm. Không dùng nguồn bên ngoài hay website để chọn kết quả.

Bảng dưới lấy **vị trí Văn Khúc và Thiên Quý in trên từng sơ đồ**, không giả định sơ đồ hoàn toàn tương thích đầu vào sinh. Phép đếm riêng dùng Tý=0,…Hợi=11; từ Văn Khúc đếm nghịch `ngày−1`, rồi thử +1 (quay lại một bước) hoặc −1 (tiếp tục nghịch).

| Trang/mục | Ngày âm in | Văn Khúc in | Thiên Quý in | Nghịch rồi +1 | Nghịch rồi −1 | Kết luận cục bộ |
|---|---|---|---|---|---|---|
| 272 / 6.1 | 23 | Tý | Mão | Mão | Sửu | Phù hợp cách quay lại một bước |
| 273 / 6.2 | 6 | Dậu | Tỵ | Tỵ | Mão | Phù hợp cách quay lại một bước |
| 274 / 6.3 | 10 | Thìn | Tý | Thân | Ngọ | Không phù hợp cả hai; thuận rồi −1 lại ra Tý |
| 275 / 6.4 | 30 | Tý | Thân | Thân | Ngọ | Phù hợp cách quay lại một bước |

**Không chọn theo số đông.** Trang274 là bằng chứng mâu thuẫn chưa giải quyết. Một số sơ đồ còn có vấn đề giữa chi cung in, vị trí Văn Khúc và giờ sinh ghi ở giữa (272/273), nên bảng chỉ chứng minh quan hệ đếm giữa các nhãn đã đọc, không xác nhận toàn bộ lá số phụ lục. Cần bản in khác/đính chính hoặc giải thích có xuất xứ để xác định sơ đồ bị lệch nhãn hay dùng quy ước khác. Không tự sửa trang sách hoặc hoàn thiện câu bị nghi sai.

Ân Quang cùng mục12 đếm thuận rồi “lùi lại”; phép lùi ngược chiều vừa đếm là một cách hiểu khả dĩ. Tương đồng câu chữ không giải quyết được mâu thuẫn trang274. Chưa có nguồn nhất quán đủ để chốt nghĩa bước cuối của Thiên Quý.

Với hồ sơ riêng đang đối chiếu: từ Văn Khúc Tý, ngày9 đếm nghịch đến Thìn; quay lại một bước → **Tỵ**, tiếp tục nghịch → **Mão**. Giữ cả hai giả thuyết. Upstream vẫn **Mùi** trong snapshot; chưa thay phép an, không chọn để khớp ảnh tham chiếu.

Công cụ Linh và phạm vi kiểm tra riêng: [LINH-TINH-TRIAL.md](LINH-TINH-TRIAL.md). Quyền nội dung PDF chưa xác định; không tái phát hành trang sách hoặc sao chép dài.

## Đóng hồ sơ Thiên Quý — chưa chốt

Bảng bốn ví dụ ngay trên dùng số **trang PDF = trang in** 272,273,274,275. Dữ kiện đối chiếu là ngày âm, nhãn cung chứa Văn Khúc và Thiên Quý in trên sơ đồ; hai phép tính đã trình bày riêng. Trong đợt đóng hồ sơ này kế thừa lần đọc ảnh trực tiếp đã ghi ở trên, không tuyên bố tìm được nguồn mới.

| PDF/in | Vấn đề còn phải xác minh |
|---|---|
| 272/272 | Văn Khúc Tý, ngày23, Thiên Quý Mão phù hợp nghịch rồi quay lại; nhưng nhãn chi/vị trí Khúc và giờ ghi giữa lá số cần đối chiếu bản khác. |
| 273/273 | Văn Khúc Dậu, ngày6, Thiên Quý Tỵ phù hợp nghịch rồi quay lại; vẫn có vấn đề tương thích nhãn chi/giờ ở sơ đồ. |
| 274/274 | Văn Khúc Thìn, ngày10, Thiên Quý Tý không trùng Thân hoặc Ngọ theo hai giả thuyết. Chưa xác định là khác cách an, cách đọc sơ đồ, nhãn bị lệch, chất lượng bản quét hay lỗi in. **Không kết luận lỗi in.** |
| 275/275 | Văn Khúc Tý, ngày30, Thiên Quý Thân phù hợp nghịch rồi quay lại; một ví dụ phù hợp không giải quyết mâu thuẫn274. |

Câu hỏi gửi người phụ trách chuyên môn: (1) nhãn vị trí của các sơ đồ được đọc đúng theo bố cục bản in này chưa; (2) có bản in/đính chính độc lập để đối chiếu trang274 không; (3) “lùi lại” là ngược chiều vừa đếm hay lùi theo hướng cố định, và vì sao ví dụ274 dùng kết quả khác? Không biểu quyết 3–1, không mở rộng tìm kiếm vô hạn. Giữ hai giả thuyết Tỵ/Mão cho ca riêng, giữ nguyên Mùi upstream trong snapshot; không phát hành cách an mới.

## Đính chính bằng ảnh nguồn khi xây profile mới — 09/10/2026

**Bảng Thiên Quý phụ lục ở trên đã đọc nhầm lớp chi.** Đọc lại trực tiếp ảnh trang5 (khung cố định), 12, 22–23 và272–275: chữ chi bên trong/ở mép trong sơ đồ là lớp lưu niên tiểu hạn, không phải địa chi cố định của ô. Không cần giả thuyết lỗi in ở274. Giữ nguyên biên bản trước để truy vết, không dùng các vị trí cũ làm expected nữa.

| PDF/in | Văn Khúc: ô cố định | Thiên Quý: ô cố định | Ngày âm | Nghịch ngày−1, rồi quay lại +1 | Tiếp tục nghịch −1 |
|---|---|---|---|---|---|
|272|Ngọ (hàng trên, cột2)|Dậu (phải, hàng2)|23|Dậu — khớp|Mùi — khác|
|273|Mùi (hàng trên, cột3)|Mão (trái, hàng3)|6|Mão — khớp|Sửu — khác|
|274|Tuất (phải, hàng3)|Dần (dưới, cột1)|10|Dần — khớp|Tý — khác|
|275|Ngọ (trên, cột2)|Dần (dưới, cột1)|30|Dần — khớp|Tý — khác|

Bằng chứng là quy định vị trí không đổi ở §1 trang5 kết hợp công thức §8.13 và vị trí ô thực tế, không biểu quyết số website. Profile mới `tanbien-vn-trial-v1` dùng `Văn Khúc − (ngày−1) +1` theo chi Tý=0. Snapshot cũ vẫn giữ upstream. Không tuyên bố chuyên gia duyệt hoặc mọi sao của bốn ví dụ đều khớp.

**Sai khác còn thật ở Hỏa:** ảnh273 (Tân Mão, âm nam, giờ Mão) ghi Hỏa tại Ngọ; bảng11 khởi Dần, nghịch3 ra Hợi. Ảnh275 (Tân Mùi, âm nam, giờ Dần) ghi Hỏa tại Mùi; bảng11 khởi Dần, nghịch2 ra Tý. Hai ảnh phù hợp điểm khởi Dậu, nhưng không tự coi bảng Dần là lỗi in. 272/274 phù hợp công thức Hỏa trong bảng. Bản thử chọn bảng ở11, ghi `source-conflict` cho nhóm Hợi/Mão/Mùi; cần bản in khác/giải thích chuyên môn. Linh không bị thay chiều theo các sai khác này.
