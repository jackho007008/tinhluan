# Đọc toàn bộ Sơ cấp giảng nghĩa và đối chiếu 11 cung — 04/11/2026

**Đã đọc hết phần chữ của 305/305 trang, đối chiếu toàn bộ 83 trang có ảnh nhúng; chưa phải hiệu đính toàn bộ bản dịch hoặc nghiệm thu thương mại.** Lượt này đọc thêm 264 trang, kế thừa 41 trang có nhật ký trước. Kiểm ảnh thêm 91 trang, lũy kế 107 trang; 134 ảnh nhúng được xem trong trang hoặc tách hình. Các con số là độ phủ đọc nguồn, không phải phần trăm chất lượng bài luận.

Baseline `main@4ee8351`; tracked/index sạch đầu phiên. Giữ `buu-dinh-7parts/`, `docs/design-handoff/`. Chỉ cập nhật hồ sơ khảo cứu và trạng thái đọc. Không sửa ứng dụng, engine, bảng sáng/Tứ Hóa, prompt, index runtime, bài đã lưu, quyền hoặc QA. Không API, worker, DB, publish; không dựng pipeline cho riêng mẫu.

## 1. Nguồn, nhật ký và đầu ra

Sách chủ dự án cung cấp: *Vương Đình Chi — Trung Châu phái Tử Vi Đẩu Số sơ cấp giảng nghĩa*, bản ghi rõ **dịch tự động của Tử Vi Cổ Học**. Không gọi đây là bản Trung văn đã đối chiếu toàn văn, không đồng nhất với *Thâm tạo giảng nghĩa* hoặc THP1/THP2 Nguyễn Anh Vũ. Số trang dưới đây là **trang PDF**, trùng số in của tệp này.

SHA-256 PDF: `76a4c21032f603643cc87d47285bc7f3f6684c164d4d9f47a233c0cfc3e39a77`. Toàn văn, hình và bản sao nằm ngoài Git tại `.local/source-library/books/vdcsc/`; không sửa chữ đã trích hoặc PDF.

- [Nhật ký đủ 305 trang và 16 nhóm chương](../.local/vdc-full-review-20261104/reading-receipt.json).
- [24 phiếu mệnh đề, điều kiện, ngoại lệ, hash từng trang](../.local/vdc-full-review-20261104/source-cards.json).
- [Bản đồ phần bổ sung và phần còn thiếu cho 11 cung](../.local/vdc-full-review-20261104/gap-map-11.json).
- [Danh mục trang có ảnh nhúng](../.local/vdc-full-review-20261104/embedded-image-inventory.json), [kiểm bảo toàn và liên kết](../.local/vdc-full-review-20261104/verification.json).
- Bản đồ này bổ sung [bản đồ luận điểm hiện có](AI-PAID-ARGUMENT-MAP-11-20261104.md), không thay những kết luận/phiên bản đã lưu. Các phiếu mới đều `runtimeEligible=false`, `claimApproved=false`: đã khảo cứu khác với đã được chọn vào bài khách.

Đã đọc cả tựa/lịch/an sao (1–67), thuật ngữ và phương pháp (68–89), tính chất cơ bản (90–117), Mệnh và tinh hệ (117–181), toàn bộ 11 mục cung tiếp theo (181–288), hạn và các ví dụ đến hết305. Phu189–199/Tài207–216/Tật217–228 tái dùng nhật ký đọc đủ trước và đối chiếu lại các câu liên quan. Không làm lại toàn bộ nhật ký chỉ để tăng số đếm.

Giới hạn ảnh: đã xem mọi trang có ảnh nhúng để hiểu bảng/hình và đối chiếu lập luận. Không tuyên bố phiên âm từng ô của mọi bảng. Bảng31 còn mờ; các lá số ví dụ294–302 có chữ nhỏ. Những ô chưa rõ không được dùng làm facts hoặc điều kiện đã xác minh. Hai ô Liêm/Thân ở34 và Hỏa/Tuất ở35 đọc được rõ; hình mượn sao73–75 và sơ đồ77 đã được kiểm.

## 2. Những phát hiện làm thay đổi cách đánh giá khoảng thiếu

### Có thể khép việc tra bảng sáng của chính tác giả

**Tài Bạch — S01:** bảng34 ghi Liêm Trinh tại Thân là **Miếu**. Câu211 về Liêm Miếu tại Tài nói đến tạo tài trong cạnh tranh. Trước đây chỉ có trạng thái Vượng từ engine nên chưa đủ nối điều kiện; nay đã có bằng chứng độc lập từ bảng của sách. Khép được **tra điều kiện trong nguồn**, không đổi engine thành Miếu, cũng không đồng nhất Vượng với Miếu. Khi đặc tả ứng viên mới phải mang rõ điều kiện theo tác giả, dùng vị trí Thân thật từ snapshot và giữ lớp nguồn riêng.

**Phu Thê — S02:** bảng35 ghi Hỏa Tinh tại Tuất là **Miếu**. Đoạn198–199 phân biệt Hãm với Miếu; vế Miếu nói đến ít thời gian ở cùng nhau hoặc biến chuyển công việc của phối ngẫu. Không còn lý do nói “trong sách chưa xác định được Miếu/Hãm của Hỏa Tuất”. Tuy nhiên, trạng thái engine đang thiếu vẫn giữ nguyên; đây không phải chứng nhận mọi lời về Hỏa hoặc phép phối hợp Phá–Đà–Hỏa. Câu tiếp có tên sao bị dịch hỏng chưa nhận; không suy “Miếu = tốt mọi mặt”.

### Những chỗ trùng tên dễ gây luận sai

**S03/S24:** Đại Hao an theo chi năm ở29/53–54 khác Đại Hao của vòng Bác Sĩ ở63–64; phần tính chất115–116 cũng tách hai hệ. Mẫu QA có Đại Hao Bác Sĩ. Câu chỉ ghi Đại Hao trong chương Tài chưa mặc nhiên cùng danh tính. “Hao” trong một số cổ phú còn chỉ Phá Quân (82). Bệnh Phù vòng Bác Sĩ, Bệnh Phù trong hệ Thái Tuế và Bệnh/Mộ của Trường Sinh cũng không phải một điều kiện.

**S04:** bảng Tứ Hóa30/45 khác engine ở một số can. Với Nhâm, sách dùng Khoa Thiên Phủ, engine dùng Khoa Tả Phù. Không lấy Khoa của hệ này làm bằng chứng cho nhánh của hệ kia; không sửa facts hoặc an lại sao.

### Sách có căn cứ để nối liên cung, nhưng không cho phép chuyển lời tùy ý

**S05/S06:** trang68–69 định nghĩa gặp/tọa/hội/xung/giáp; trang73–77 giải thích mượn sao và đối tinh. Mượn sao là một phương pháp diễn giải có cung gốc, không phải chuyển sao trong snapshot. Trang116 thừa nhận dị biệt giữa hai phần tài liệu cơ bản; 116–117 phân biệt nền Mệnh/hạn với luận 12 cung. Không áp mọi câu về tính chất sao thành lời trực tiếp của mọi cung.

**S07–S13:** sách giải thích vì sao phải xét các cung cùng nhau: Quan với Phu về công việc/gia đình; Tài với Phúc về vật chất và tinh thần; Di với Mệnh/Phúc/Phu về cá nhân và hoàn cảnh bên ngoài; Nô với Huynh/Phụ/Tử về các tầng quan hệ. Đây là phần đáng đưa vào hướng dẫn tổng hợp sau khi tách đơn vị nguồn, giúp tránh chỉ liệt kê thêm sao.

## 3. Bổ sung cụ thể cho đủ 11 cung

### Tài Bạch

Nguồn mới nối được: bảng34 + lời Liêm211; phương pháp207–208; nền Vũ–Phủ Mệnh139–140; đối chiếu Phúc271–278. Có thể xây trục **cách tạo nguồn lực → cách giữ và tiến hành → mong muốn sử dụng nguồn lực**, từng vế giữ cung gốc. Vũ–Phủ ở Mệnh không biến thành Phủ tọa Tài. Mẫu có Vũ Kỵ ngay Mệnh: không lấy riêng vế giữ tài tích cực của139 rồi bỏ nhánh Kỵ; cũng không chuyển dự báo tai họa/bệnh trong139–140 thành kết luận về khách.

Khoảng thiếu còn thật: danh tính Hao trong các câu riêng; phép phối hợp Liêm–Hao; điều kiện nhóm Không–Kiếp–Hao và Hình–Kỵ chưa được tự chọn AND/OR. Câu212 về thu vào đồng thời hao ra nằm dưới **Thiên Phủ tọa Tài**, không được dùng cho Liêm tại Tài chỉ vì Phủ ở Mệnh. Không ghép những câu ấy thành quy luật “càng kiếm càng chi” hoặc dự báo bị mất tiền.

### Phu Thê

Đã có điều kiện Hỏa/Tuất theo bảng35, Phá197, Tả198, Đà199, khung liên cung189–190/251 và ngữ cảnh Phúc277–278. Có thể tách **nhu cầu chủ động trong quan hệ**, **thời gian/hoàn cảnh chung sống**, **công việc và nếp hưởng thụ** thành các góc khác nhau, chỉ khi tiền đề cụ thể phù hợp. Đây là đề xuất tổ chức luận, không phải các sự kiện đã được xác nhận về khách.

Giữ loại nhánh Tả “không gặp sát” ở mẫu có Đà/Hỏa. Lời Tả giúp qua một giai đoạn thuộc THP2 vẫn giữ nguyên sắc thái và tác giả; không lấy Sơ cấp xóa lời ấy. Chưa thấy trong toàn cuốn một công thức hoàn chỉnh Phá–Đà–Hỏa/Tuần cho mẫu hiện tại. Không bắt buộc phải có nguyên văn cả tổ hợp mới được tổng hợp, nhưng không được tự đặt sao nào thắng hoặc giải hết sao nào. Cụm dịch hỏng cuối198–đầu199 và câu Phá Thìn/Tuất197 cần bản chữ rõ trước khi dùng trọn ý.

### Nô Bộc

Trang238–239 bổ sung khung ba tầng: khi đang luận Nô, Huynh là ngang hàng, Phụ là trưởng bối, Tử là vãn bối. Trang249 có nhánh Thiên Lương riêng, phân biệt mức kết giao, trợ lực và các điều kiện cát/sát. Đây là nguồn độc lập với phi hóa THP1: không được gọi thiếu phi hóa là thiếu mọi luận điểm về Lương.

Mẫu có Lương tại Nô, Việt và Lộc liên quan; nhưng cụm trợ tinh trong bản dịch không đủ rõ để coi một Việt đã thỏa toàn bộ danh sách hoặc tự chốt toán tử. Đồng ở đối cung không phải Đồng–Lương đồng độ; lời Cơ–Lương đông bạn cũng không áp Lương đơn. Có thể bổ sung cách phân tầng đối đãi; chưa có căn cứ bảo đảm bạn bè trung thành, trợ giúp bền vững hoặc Hóa Lộc xóa Lương hãm.

### Tử Tức

Đã đọc trọn199–206, gồm phần201–205 trước chưa đọc. Trang199–200 đề nghị xét quan hệ thế hệ; trang69/73–75 cho địa chỉ phương pháp VCD. Nhiều câu Cơ–Cự nói số con, sinh sản hoặc cách nuôi theo quan niệm cổ; không đổi chúng thành lời dạy con hiện đại.

**Có ứng viên thứ hai cần đặc tả, không nên gọi hoàn toàn thiếu nguồn:** nhánh Cự204–205 nói đến Thái Dương và cát hóa/Lộc Tồn, có vế về sắc thái tường hòa. Trang74 yêu cầu mượn **toàn tinh hệ** đối cung. Với Tử VCD Dậu, sau lớp mượn Cơ–Cự từ Điền/Mão, tam phương cần xét vẫn là Dậu–Sửu–Tỵ: có Dương ở Phụ/Sửu và Lộc ở Nô/Tỵ. Không được loại Dương chỉ vì xét tam phương của Cự ở vị trí gốc Mão. Cũng không biến Dương thành đồng độ Cự hoặc Lương Nô thành Lương tọa Tử.

Ứng viên này **chưa đủ để xuất lời thuận hòa tổng kết**: phải mang cả Hình/Không/Triệt và các sao đi kèm, giữ lớp nguyên cục/mượn riêng, đọc đủ nhánh điều chỉnh và không biến tường hòa thành hiếu thuận chắc chắn. Pipeline hiện chưa có toán tử mượn toàn tinh hệ đã đặc tả; không âm thầm an lại hoặc đổi facts. Khoảng thiếu chính chuyển từ “chưa thấy mệnh đề” sang “chưa khóa cách áp và điều chỉnh”.

Quang–Quý trong phương pháp đối tinh76–77 không tự giải điều kiện/đối tượng “con nuôi” của nguồn TB205. Nhánh Kỵ tại Điền đã triển khai1.19 chỉ dùng khi đúng vị trí; mẫu Kỵ tại Mệnh vẫn không khớp. Bài mẫu chưa được thêm luận điểm hoặc nâng thành chuyên sâu.

### Tật Ách

Đã đối chiếu toàn chương217–228, phần phương pháp69/73–75, vòng sao63–64/115–116 và ví dụ hạn293–300. Bổ sung được hồ sơ T1: đúng loại Bệnh Phù, cách xét VCD theo tác giả, phân biệt nguyên cục với thời hạn và giới hạn bản dịch. Sách tự ghi hạn chế khi nói về bệnh hiện đại.

Chưa có căn cứ để đưa ra bài sức khỏe cá nhân phù hợp phạm vi sản phẩm. Không đổi lời bệnh thành “stress/sức bền” rồi coi là giữ nguồn; không dùng ca bệnh/treatment trong ví dụ làm bằng chứng lâm sàng. T1 tiếp tục là chú giải truyền thống theo cấu trúc, hai mẫu trước chưa duyệt; runtime `insufficient` và quyền giữ nguyên. Không coi đọc đủ chương là đã giao cung.

### Quan Lộc

Trang251–253 và261 cho thêm cách phân biệt tổ chức, phụ tá, vị trí và hoàn cảnh; trang251 nêu rõ hạn chế suy ra chính xác nghề. Quan đối Phu giúp giải thích quan hệ công việc/gia đình; Mệnh139–140 và Phúc có thể bổ sung cách tiến hành, không chỉ lặp Quyền–trách nhiệm.

Cần giữ điều kiện cát/sát của từng lời; không dùng Mệnh Tử–Tướng124–125 như Quan Tử–Tướng. Không lấy nguồn này hợp thức hóa mọi phép Bạch Hổ–Tấu Thư của tác giả khác. Tiến trình, chức vụ và mức công danh vẫn không được khẳng định từ một nhóm sao; chưa khép toàn bộ Q2/Q3.

### Phúc Đức

Trang271–280 tách vật chất và tinh thần;277–278 có các nhánh Tham, văn/đào hoa/Không–Hoa Cái, Hỏa/Linh. Có thể thêm luận về **điều muốn hưởng và nhịp theo đuổi**, thay vì chỉ nói phúc chung chung. Phần mở đầu đòi Miếu không áp mặc định cho Tham Dần; nhánh Hỏa/Linh phải giữ văn cảnh riêng.

Không suy nghiện, ngoại tình hay chẩn đoán tâm lý; không lấy Linh tại Phúc thành cách Linh–Tham phát tài ở Tài. Triệt trực tiếp và tổ hợp Tham–Linh–Mã chưa được giải trọn bằng cuốn này; nguồn TB đã có tiếp tục giữ riêng.

### Điền Trạch

Trang263–271 phân nguyên cục/hạn;264 nhắc bán tài sản có thể là đổi cũ lấy mới, không nhất thiết thất thoát. Trang265 phân Cơ–Cự Mão/Dậu, có các nhóm điều kiện tranh chấp. Mẫu Điền Mão có thể đối chiếu đúng nhánh, không dùng lời Dậu.

Chưa tự chốt toán tử cụm sát/Hình/Không/Hao hoặc suy đã tranh chấp/mất nhà. Nguồn gốc tài sản, mức thừa hưởng và vai Triệt vẫn cần đơn vị đủ điều kiện; không dùng lời biến động để trả lời thay câu hỏi thừa hưởng hay tự tạo.

### Thiên Di

Trang229 giải thích Di↔Mệnh, liên quan Phúc/Phu;236–238 có Thất Sát và các trợ/sát khác nhau. Có thể nối **được đón nhận bên ngoài**, **cách thích ứng**, **ảnh hưởng tới gia đình/đời sống tinh thần** bằng nguồn đúng nơi.

Không từ nể trọng suy mọi việc thành công; không dùng lời tai nạn hoặc đi xa theo hạn thành sự kiện chắc chắn của nguyên cục. Chưa có phép điều chỉnh chung cho toàn nhóm sao tại Di.

### Phụ Mẫu

Trang281–282 làm rõ ba lớp đối tượng: nguyên cục chủ yếu cha mẹ; cấp trên/cơ quan chủ yếu xét hạn và kiêm cung liên quan. Đây là bổ sung quan trọng để tránh viết sai người đang được luận. Không đổi toàn bộ Phụ thành “sếp” chỉ vì ở Nô có khung trưởng bối.

Lời Nhật–Nguyệt283–284 chứa nhiều kết luận sinh tử/hoàn cảnh gia đình không phù hợp đưa thẳng vào bài. Chưa khép điều chỉnh quan hệ cha mẹ–con trên mẫu chỉ bằng nguồn này; giữ phạm vi giới hạn của bài đang có.

### Huynh Đệ

Trang181–188 phân biệt hòa hợp, trợ lực và số lượng. Trang184 có nhánh Đồng;188 nêu ít liên lạc không nhất thiết bất hòa. Hữu ích để tránh kết luận quá mạnh về tình thân và để phân biệt gần gũi với giúp đỡ.

Chỉ dùng nét Đà nếu đúng vị trí/quan hệ của nhánh, không gắn cho mẫu không có. Không dự đoán số anh em, tử vong hoặc nhận nuôi; chưa lấy những sắc thái ấy thay lời điều chỉnh Tuần của nguồn khác.

## 4. Cách chuyển phần đủ căn cứ thành đầu vào bài mới

Đây là đề xuất triển khai hữu hạn tiếp theo, **chưa thực hiện trong lượt đọc sách**:

1. Tách những phương pháp rõ nghĩa S05/S06/S08/S09/S12/S13/S18/S21 thành đơn vị có cung đích, cung gốc và ngoại lệ. Dùng selector hiện có, không tăng toàn bộ packet hoặc dựng đường riêng cho mẫu.
2. Đặc tả riêng hai điều kiện đã kiểm ảnh: Liêm/Thân theo bảng34 và Hỏa/Tuất theo35. Không đưa chúng vào facts engine. Muốn nhận lời trực tiếp phải có phiên bản điều kiện theo tác giả và test không chọn nhầm vị trí/bảng; không đơn giản nới toàn bộ guard nguồn dịch máy.
3. Chỉ tổng hợp từ các tiền đề được nhận: đoạn diễn ý nguồn và đoạn tổng hợp mới tách rõ `basis`; ngữ cảnh cung khác giữ nguyên vai. Câu tổ chức ý hoặc ví dụ biên tập của Codex không tự thành tri thức sách. Tên sách nằm ở căn cứ, không trong thân bài khách.
4. Mock trước bằng đầu vào chung, có probe sai cung/độ sáng/vòng sao/không-sát/Tứ Hóa; đọc toàn văn để bắt sai nghĩa mà validator cấu trúc không chứng minh được. Chỉ sau đó mới xem xét một phép thử API có quyền riêng.

Code hiện tại `lib/ai/paid-library.ts` vẫn chỉ nhận `vdcsc` dạng method. Không thay đổi điều này trong nghiên cứu. Input1.19/guide1.2/prompt2.8 và các index/attempt cũ nguyên. Các bảng mới giải được điều kiện **trong tài liệu**, chưa có nghĩa writer đã dùng chúng.

## 5. Tài liệu thật sự cần nếu muốn khép phần chữ còn mơ hồ

Không cần yêu cầu mua thêm sách chung chung để làm tiếp phần đã rõ. Nếu có bản Trung văn hoặc bản dịch có người hiệu đính của **chính Sơ cấp giảng nghĩa**, ưu tiên đúng các mục sau:

- **Phu197–199:** toàn mục Phá Quân, Tả Phụ, Hỏa/Linh, Đà; làm rõ câu Phá Thìn/Tuất và tên sao bị dịch hỏng cuối198–đầu199. Cần nguyên văn/ảnh đoạn, không chỉ bài đăng diễn giải lại.
- **Nô249:** mục Thiên Lương, nhất là cụm trợ tinh/Tứ Hóa và quan hệ đồng độ–hội chiếu; cần lượng từ/điều kiện của câu, không cần chủ dự án tự chọn AND/OR.
- **Tài211–212 cùng chú giải danh tính Đại Hao:** xác định phạm vi từng cụm và loại Hao; ảnh bảng34 đã đủ cho ô Liêm/Thân, không cần tìm lại ô ấy.
- **Tử202/204–205:** câu Cơ–Cự và Cự–Dương để khóa ý và điều kiện ứng viên quan hệ; phương pháp mượn toàn tinh hệ đã có ở74. Không hứa bản chữ rõ tự giải hết phép điều chỉnh hoặc bổ sung sách là đủ100%.

Tật không chỉ thiếu bản dịch: còn giới hạn loại đầu ra được chấp nhận và điều kiện chọn nhánh. Cuốn này không giải bằng chứng y khoa, không mở quyền publishT1.

## 6. Kiểm, tiến độ và kết luận

Đã kiểm hash PDF gốc/bản sao,305 trang chữ, metadata/receipt, các neo phiếu và bản đồ11; kiểm phần inventory ngoài `vdcsc` không đổi, các file lịch sử được manifest trước giữ nguyên. Kiểm liên kết mới và `git diff --check`. Không chạy build/typecheck/E2E/mock ứng dụng vì không sửa code hoặc runtime input; kiểm hồ sơ không được gọi là model/test nội dung đã đạt. [Kết quả chính xác](../.local/vdc-full-review-20261104/verification.json).

Đã bổ sung **24 phiếu nghiên cứu**, không phải24 luận điểm độc lập hay24 nguồn mới. Độ phủ đọc cuốn sách:100%. Checklist hồ sơ kế thừa giữ **Phụ90%, Phúc90%, Điền90%, Quan90%, Nô90%, Di90%, Tật90%, Tài90%, Tử90%, Phu90%, Huynh90%**; không phải90% chất lượng/thu phí và không tăng bằng số trang đọc. Chưa có bài model mới để đánh giá cải thiện đầu ra.

**Chưa đạt phát hành thương mại.** Ba nhóm còn chặn thực chất: (1) một số điều kiện/danh tính nguồn và nhánh Tử/Tật chưa khép; (2) phiếu mới chưa được tích hợp/kiểm qua đầu vào và bài mới; (3) cần nghiệm thu toàn văn/phạm vi giao nội dung, validator không thay được đọc hiểu. Không gọi thêm API để thử phần chưa có câu trả lời.

Điểm dừng: đọc hết sách, lưu chứng cứ và lập bản đồ bổ sung11cung; không mở gói mới, không đổi gói bán hàng, không cập nhật QA3062/3070, không phát hành hoặc sửa lịch sử.
