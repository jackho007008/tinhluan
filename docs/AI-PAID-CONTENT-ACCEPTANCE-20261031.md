# Nghiệm thu nội dung AI 11 cung trả phí — 31/10/2026

**Kết luận: chưa đủ căn cứ nghiệm thu thương mại gói “11 cung chuyên sâu”.** Quan Lộc3.3 tiến bộ so3.2 nhưng chưa phải bài đầy đủ. Tài/Phu vẫn chỉ có bài thật prompt cũ; ba cung Nô/Tử/Tật không có luận điểm trực tiếp trong dry-run mẫu hiện hành. Đủ tám phần, nhiều chữ, đủ159facts hoặc nguồn có ID không chứng minh chiều sâu và tính đúng của suy luận.

Baseline **main@a7d9341**, tracked/index sạch đầu phiên, chỉ `buu-dinh-7parts/` chưa theo dõi, không đọc/sửa/stage. Đây là đánh giá của Codex trên tài sản đã có và đề xuất cho chủ dự án, **không phải thẩm định độc lập, chứng minh dự báo Tử Vi hoặc quyền mở bán**. Không sửa app, prompt, kho tri thức, bài lưu, quyền hoặc engine. Không OpenAI/provider/DB/worker/supervisor/deploy, không test/build/typecheck/E2E/PDF. Chỉ chạy dry-run hàm thuần và kiểm tài liệu.

## 1. Bộ chứng cứ và phương pháp

Đã đọc toàn văn, bao gồm tám phần và phần giới hạn của bốn bài:

- [Quan Lộc3.2](../.local/ai-paid32-20261029/quan-loc-reading.md), [facts](../.local/ai-paid32-20261029/quan-loc-facts.json), [knowledge](../.local/ai-paid32-20261029/quan-loc-knowledge.json), [input thực gửi](../.local/ai-paid32-20261029/quan-loc-input.json).
- [Quan Lộc3.3](../.local/ai-paid33-20261030/quan-loc-reading.md), [content có basis/IDs](../.local/ai-paid33-20261030/quan-loc-content.json), [input thực gửi](../.local/ai-paid33-20261030/quan-loc-input.json).
- [Tài Bạch3.2](../.local/ai-paid32-20261029/tai-bach-reading.md), [facts](../.local/ai-paid32-20261029/tai-bach-facts.json), [knowledge](../.local/ai-paid32-20261029/tai-bach-knowledge.json), [input thực gửi](../.local/ai-paid32-20261029/tai-bach-input.json).
- [Phu Thê3.2](../.local/ai-paid32-20261029/phu-the-reading.md), [facts](../.local/ai-paid32-20261029/phu-the-facts.json), [knowledge](../.local/ai-paid32-20261029/phu-the-knowledge.json), [input thực gửi](../.local/ai-paid32-20261029/phu-the-input.json).

Đối chiếu [đánh giá3.2](AI-PAID-PACKAGE32-EVALUATION.md), [bàn giao3.3](AI-PAID-PACKAGE33-HANDOFF.md), [nguồn và dry-run3.4](AI-PAID-PACKAGE34-HANDOFF.md). Module chỉ đọc: facts/paid-facts, paid-input/retrieval, paid-contract/prompt và evaluator hiện có; thêm ba hồ sơ NPL27/33/45 liên quan Hao, Hổ–Tấu và phối hôn. Không mở PDF hoặc quét lại kho sách.

Dùng đúng snapshot QA đã lưu trong `original-private.json` Gói3.3 (cùng chart ba cung3.2): resultId `df4ccafb0dc2ec383f6189adb7436c43816d41f5e5479abefeb16127f8b7787e`, report1.79.0/catalog1.75.0. Hash snapshot hiện đọc `bbeaa031ed477ac4f5cd9c744cb8d8fa51f03c514a424397ae976e498ceed370`. Không nhập lại ngày sinh/an sao. Đối chiếu111facts cũ với facts mới theo ID/text/path, không đòi metadata provenance mới tồn tại trên bài cũ. Cả ba bộ111facts cũ giữ nguyên;48facts vòng bổ sung thành159. Input Quan3.3 thực gửi khớp dry3.3 sau chuẩn hóa thứ tự key JSON.

Mỗi nhận xét dưới đây tách: độ đúng trên snapshot, độ đầy đủ đầu vào, mức nguồn hỗ trợ và giá trị biên tập. Không chấm điểm tổng hợp để che một lỗi nghiêm trọng. “Chưa thấy bịa” chỉ giới hạn trong bốn bài đã đọc, không xác nhận toàn bộ hệ thống không thể bịa.

## 2. Đánh giá bốn bài thật theo chín tiêu chí

### 2.1. Quan Lộc Gói3.2 — đúng trục, đầu vào thiếu và luận chưa sâu

1. **Dữ kiện:** Tử Vi–Thiên Tướng Vượng tại Thìn, Thân cư Quan và Tử Vi hóa Quyền đúng. Nhưng giới hạn cuối nói “Không áp dụng chú giải Bạch Hổ–Tấu Thư vì dữ kiện Quan Lộc không ghi nhận hai sao này” không đúng khi so snapshot đầy đủ: có Tấu Thư ở boshi12 và Bạch Hổ ở suiqian12. Đây là **lỗi adapter đầu vào A**, không phải bằng chứng V1 sai hoặc Astra tự bịa vị trí. Không sửa bài lịch sử để giấu lỗi.
2. **Chính/phụ tinh:** phát triển được tổ chức–quyền hạn từ Tử Vi–Tướng và Quyền. Hữu Bật, Phi Liêm, Đường Phù, Thiên La, Hoa Cái được kê tên, rồi dừng vì thiếu nghĩa có nguồn. Thiếu tổ hợp Hổ–Tấu làm mất một nhánh có thể luận thực sự.
3. **Tam phương/tứ chính:** Mệnh–Tài tam hợp, Phu đối, Điền–Nô giáp đúng. Phân biệt sao chiếu và tọa đúng; nội dung chủ yếu là bản đồ vị trí, chưa giải thích ảnh hưởng đến cách làm việc. Không chuyển thiếu giải thích thành kết luận quan hệ gia đình cản nghề.
4. **Tứ Hóa/điều chỉnh:** tốt ở câu “không nên đếm thành hai lời bảo đảm độc lập” khi cùng Tử Vi vừa nằm trong bộ vừa hóa Quyền. Nhắc Kỵ tại Mệnh/Khoa tại Phu nhưng chưa có phép kết hợp, không giả Quyền xóa Kỵ. Tính thận trọng đạt; chiều sâu chế hóa chưa đạt.
5. **Chuyên sâu:** tám phần xoay quanh tổ chức và thẩm quyền; chưa phát triển được vai trò phụ tinh/hội chiếu thành luận điểm mới. Nội dung có ích như lời dẫn đọc bản đồ, chưa đủ giá trị bài chuyên sâu.
6. **Nguồn:** ba đơn vị V1 từ Tân Biên, trong đó Hổ–Tấu đã đúng điều kiện nhưng bị bỏ do facts thiếu. Hai luận điểm còn lại giữ phạm vi, không bịa sách/trang. Có ID và nguồn draft không đồng nghĩa đã chứng nhận chuyên môn.
7. **Văn phong:** rõ nhưng nhiều đoạn mở bằng danh sách sao, “cấu trúc”, “vị trí”, “chưa có căn cứ”. Đây là giọng thuyết minh kỹ thuật, không phải lỗi vì chứa từ cấm tiếng Anh.
8. **Cụ thể/tự đối chiếu:** câu hỏi trách nhiệm có đi cùng quyền quyết định là hữu ích. Còn thiếu tình huống khác biệt ngoài trục tổ chức, nên phần tự đối chiếu chưa đủ làm bài đặc thù.
9. **Không bịa/chắc chắn:** không khẳng định chức vụ/thăng tiến hay nghề bắt buộc. Có một phủ định về Hổ–Tấu sai so snapshot do A; không đánh đồng “không tiên đoán chắc chắn” với hoàn toàn đúng facts.

**Kết luận:** không đạt bài chuyên sâu; lỗi thiếu sao vòng đã được sửa cho input mới ở3.3, nhưng bài3.2 vẫn là chứng cứ lịch sử của lỗi ấy.

### 2.2. Quan Lộc Gói3.3 — cải thiện có thật, còn lệch sang coaching

1. **Dữ kiện:** xác nhận đúng “Bạch Hổ và Tấu Thư là hai sao vòng bản mệnh cùng ở Quan Lộc”; dẫn đúng hai ringfact. Không an lại/đổi độ sáng. Giữ bất nhất Suy tại phần giới hạn, không suy suy giảm sự nghiệp.
2. **Chính/phụ tinh:** đoạn “từ hiểu việc đến diễn đạt” nối Hổ–Tấu với chủ đề tổ chức, ghi rõ đó là liên hệ biên soạn. Đây là cải thiện quan trọng. Hữu Bật, Đường Phù, Thiên La, Hoa Cái vẫn chưa được giải nghĩa phối hợp; Phi Liêm upstream không được lén nâng thành căn cứ cá nhân.
3. **Tam phương/tứ chính:** dùng Vũ Khúc/Thiên Phủ tại Mệnh làm bối cảnh đúng cung gốc. Bài thiếu phần Tài trong tam hợp và phần lớn nội dung phía đối cung. **Không chỉ là model bỏ sót:** input thực3.3 đã chọn tám mục C đều thuộc Mệnh, loại lời Liêm Trinh tại Tài và Khoa tại Phu vì cap. Không gán hoàn toàn cho prompt hoặc thiếu sách.
4. **Tứ Hóa/điều chỉnh:** tách “được việc” của vị trí Quyền với mặt vượt quyền của bộ Tử Vi–Tướng, không coi chúng triệt tiêu nhau. Nhưng Kỵ tại Mệnh và Khoa đối cung chưa phát triển; không có quy tắc chế hóa đã xác nhận để lấp bằng tưởng tượng.
5. **Chuyên sâu:** luận điểm “Biết tổ chức không đồng nghĩa với được toàn quyền” có trục và lập luận. Tuy nhiên các phần2/4/7/8 lặp trách nhiệm–thẩm quyền–phản biện; ít trục thứ hai độc lập. Sáu phần basis ai-synthesis, hai phần source-interpretation: không sai chỉ vì là tổng hợp, nhưng cần kiểm mỗi tổng hợp còn bám nguồn thay vì ưu ái lời dài.
6. **Nguồn:** dùng đúng ba đơn vị A; hai mục Mệnh được dẫn đúng vai trò context. Không lấy phương pháp D làm quy luật chế hóa. Các nguồn vẫn draft, không chứng minh tổ chức–biểu đạt chắc chắn là năng lực của người đọc.
7. **Văn phong:** tự nhiên hơn3.2, có ví dụ mục tiêu/khâu phối hợp/người quyết định. Câu hỏi và lời tự bảo vệ vẫn nhiều; bốn đoạn trách nhiệm cùng dạng làm bài giống coaching năng lực hơn luận Tử Vi phong phú. Cải thiện một phần, chưa gọi “rất sâu”.
8. **Cụ thể/tự đối chiếu:** nhiệm vụ gần đây, ranh giới quyết định, cách viết yêu cầu là tình huống quan sát được. Cần giữ đây là câu hỏi để thử, không xem người đọc đồng ý là bằng chứng sao luận đúng.
9. **Không bịa/chắc chắn:** không thấy sự kiện/chức vụ/thời điểm bị bịa trong toàn văn. Phân biệt giả thuyết biên soạn và lời nguồn rõ. Giới hạn tốt phải giữ, nhưng có thể gộp bớt câu lặp.

**Kết luận:** bài tốt nhất trong bốn bài, đạt hạt nhân để đánh giá cải thiện tiếp; chưa nghiệm thu thương mại hoặc coi đại diện11cung. Ưu tiên sửa lựa chọn ngữ cảnh trước khi đòi model viết sâu hơn.

### 2.3. Tài Bạch Gói3.2 — có ý hữu ích, chưa luận được hao tinh

1. **Dữ kiện:** Liêm Trinh Vượng độc thủ Thân; Bát Tọa/Thiên Tài; Mệnh–Quan tam hợp, Phúc đối đúng. “Không ghi nhận sao trong nhóm phụ tinh” chỉ đúng minorStars của packet, không có nghĩa không còn sao đồng cung. Snapshot có Đại Hao/Thái Tuế/Chỉ Bối và Trường Sinh mà adapter cũ chưa chuyển. Đại Hao đặc biệt thiết yếu với chủ đề tài lộc.
2. **Chính/phụ tinh:** Liêm độc thủ được hiểu đúng là một chính tinh, không bị phụ tinh làm mất điều kiện. Bát Tọa/Thiên Tài chỉ ghi nhận, không suy năng khiếu kinh doanh từ tên Thiên Tài. Chưa có phân tích Liêm–Đại Hao vì facts lẫn tri thức hao phù hợp còn thiếu.
3. **Tam phương/tứ chính:** phân biệt Tham xung không thành Liêm–Tham đồng cung; Vũ–Phủ/Tử–Tướng ở tam hợp không thành bộ tọa Tài. Đây là điểm đúng đáng giữ. Phần liên hệ vẫn chủ yếu nhận diện, chưa giải thích đủ tài nguyên/công việc/chi tiêu.
4. **Tứ Hóa/điều chỉnh:** Quyền tại Quan/Kỵ tại Mệnh/Triệt tại Phúc đúng vị trí; bài không tự cho Quyền bù Kỵ hoặc Triệt đối bằng Triệt tọa. Chưa đủ nguồn để nêu tương tác Liêm–Hao và Tứ Hóa, không thể sửa bằng giảm lời rào đơn thuần.
5. **Chuyên sâu:** phân biệt nguồn thu–tích lũy–chi ngoài công việc có giá trị. “Cạnh tranh” và “chậm nhưng chắc” được tách đối tượng đúng. Chưa có trục sử dụng/giữ nguồn lực đủ sâu; chữ “chắc” không được dùng làm bảo đảm tài sản.
6. **Nguồn:** hai luận điểm liên quan trực tiếp: Tân Biên190§12.2; Trung Châu phần2 PDF201/617/619/626 dùng Tử VCD để xét chi ngoài công việc. Bài giữ riêng tác giả/phạm vi; không chuyển luận chi của đương số thành kết luận con cái. Hai mục Điền/tiền–nhà đất trong packet cũ là ngữ cảnh section, không thành lời trực tiếp Tài. Retrieval mới đã loại đúng việc kéo chúng vào trực tiếp.
7. **Văn phong:** mạch rõ, nhưng hai phần thiên giải thích “độc thủ/hội chiếu/trạng thái chưa có”, dài hơn lượng luận điểm mới. Vẫn nhiều câu phủ định giới hạn.
8. **Cụ thể/tự đối chiếu:** ba nhóm thu/tích lũy/chi tiêu hữu ích hơn nhãn giàu nghèo. Câu hỏi “sự cạnh tranh có ý nghĩa gì” còn trừu tượng; có thể đối chiếu thu nhập và khoản chi riêng trong trải nghiệm, không suy ra con số hoặc khuyến nghị đầu tư.
9. **Không bịa/chắc chắn:** không hứa lợi nhuận, thời điểm/mức thu nhập. Không dùng một Đại Hao thành Song Hao — bài chưa nhận Đại Hao nên cũng chưa thực sự kiểm năng lực ấy.

**Kết luận:** có nền biên tập đáng giữ, chưa đạt chuyên sâu. Input mới159facts giúp hết lỗi bỏ sao vòng, nhưng nguồn NPL27 chỉ D, **chưa bổ sung nghĩa trực tiếp Liêm–Hao**. Chưa có bài thật prompt1.1 để kết luận đã tốt lên.

### 2.4. Phu Thê Gói3.2 — rất mỏng về nội dung, chưa đạt chuyên sâu

1. **Dữ kiện:** Phá Quân Đắc Tuất, Đà La Đắc/Hỏa Tinh/Tả Phù, Tả hóa Khoa, Tuần trực tiếp/Triệt Dần ở tam hợp đúng. Không nhầm Phá Quân hóa Khoa. Adapter cũ thiếu Quan Phù/Tang Môn/Nguyệt Sát và Trường Sinh; input mới đã có, nhưng Nguyệt Sát chưa đủ xác minh để luận cá nhân.
2. **Chính/phụ tinh:** biết sao cùng cung và trạng thái; **chưa diễn giải bản chất Phá Quân–Đà La–Hỏa Tinh**. Không lấy Đắc của Phá làm đánh giá chung người phối ngẫu. Đây là hạn chế nguồn trọng yếu, không phải chỉ cách viết.
3. **Tam phương/tứ chính:** Phúc–Di tam hợp, Quan đối, Tử–Huynh giáp đúng. Gần như chỉ kể bản đồ, chưa lập luận về tương tác trong quan hệ. Không có quy tắc chuyển văn Thất Sát tại Di thành lời về người bạn đời.
4. **Tứ Hóa/điều chỉnh:** Khoa gắn học vấn theo nguồn nam mệnh; Quyền đối/Đà/Hỏa/Tuần được giữ riêng. Không mặc định Khoa cứu hết. Thiếu phép phối hợp thật, không nên yêu cầu model tự đặt một phép chế hóa cho bài hấp dẫn.
5. **Chuyên sâu:** phần2/4/5/6 chủ yếu phân loại facts, chỉ phần3 có lời nguồn và phần8 hỏi về học vấn. Chưa đáp ứng lời hứa phân tích kỳ vọng–ứng xử–xung đột trong quan hệ; không được tự tạo các nét ấy từ tên sao.
6. **Nguồn:** đúng một đơn vị Tân Biên214§14.21 về Khoa tại Phu nam. Có Phá Quân Thìn/Tuất ở TB213§14.14 và Phá–Tuần/Triệt ở215§14.35, nhưng gắn sớm/muộn/lần kết hôn/phạm vi đang giữ; không cắt thành tính cách nhẹ rồi gọi nguồn đã xác nhận. Hỏa tại Toàn Thư83 cần độ sáng/hỗ trợ phù hợp mà snapshot chưa ghi nhận. NPL45 cần hai lá số/hoàn cảnh, không có ở đây. Hồ sơ Đà Thìn/Tuất còn khác phép an/ngoại lệ, không gộp nguồn thắng. Đây là **C: có tài liệu liên quan nhưng điều kiện chưa đạt**, không phải chắc chắn không có sách viết về bộ này.
7. **Văn phong:** dễ hiểu nhưng phần lớn là chú giải vì sao không luận được, giống bản kiểm đầu vào. Một đề mục “chính tinh” không bù được việc chưa có nghĩa chính tinh theo cung.
8. **Cụ thể/tự đối chiếu:** câu hỏi bằng cấp/vốn hiểu biết/cùng học hỏi rõ nhưng chỉ một phương diện. Không đại diện trải nghiệm quan hệ, cũng không xác nhận người vợ có học vấn cụ thể.
9. **Không bịa/chắc chắn:** không thấy lời khẳng định ly hôn/số lần kết hôn/phẩm hạnh/tương lai trong bài; giới hạn đúng phải giữ. An toàn là điều kiện bắt buộc, không thay cho nội dung có giá trị.

**Kết luận:** chưa đạt. Prompt mới không tự tạo nguồn Phá–Đà–Hỏa; tăng8phần lên nhiều chữ sẽ chủ yếu lặp Khoa và phủ định.

## 3. Ma trận11cung — dry-run hiện hành trên một snapshot

[Ma trận CSV đầy đủ](AI-PAID-CONTENT-READINESS-20261031.csv) có sao, số đơn vị A/B/C/D, quan hệ, tổ hợp, khoảng thiếu và mức sẵn sàng. Đây là **ma trận đầu vào một lá số**, không tỷ lệ bao phủ mọi lá số hoặc bằng chứng chất lượng11bài. Không có bài thật cho tám chủ đề khác; Quan có hai phiên bản nhưng vẫn một cấu trúc chart.

Chạy `paidInput`/`paidKnowledge` hiện hành (facts1.1.0/retrieval1.1.1/prompt1.1.0), **không import provider/store/worker**, fetch bị chặn, không load.env/DB. Mỗi cung159facts; ba list sao và bốn field vòng đúng snapshot, không thiếu tên được kỳ vọng ở field đã kiểm. Geometry hai tam hợp/một đối/hai giáp đúng vị trí. `source-traced` là trace theo adapter, không chứng nhận đã có nghĩa sao hoặc ngoại lệ đầy đủ. Changsheng12 vẫn source-conflict; jiangqian12 upstream-unverified, không dùng luận cá nhân. Một sao có thể xuất hiện ở list sao và field vòng cùng tên; không đếm thành hai tác động độc lập. Trạng thái chưa ghi nhận không đồng nghĩa Hãm.

A/B/C/D đếm **đơn vị văn/tri thức được chọn**, không đếm tác giả/chứng cứ độc lập. Nhiều đơn vị cùng sách không tăng số xác nhận. Các kết quả:

- **Phụ Mẫu: A0/B1/C0/D3.** Có tổ hợp Nhật–Nguyệt tại Sửu; chưa có nghĩa phối hợp Thiên Hỷ/Nguyệt Đức/Địa Giải. Hai tam hợp Nô/Tử không có lời trực tiếp nên C0 không phải lỗi geometry. Một mệnh đề “khá giả nhưng bất hòa” không đủ mô tả thế hệ/kỳ vọng/ứng xử. Chỉ có nội dung một phần.
- **Phúc Đức: A0/B2/C4/D3.** Tham Lang và Thiên Mã có hai lời riêng, chưa có phép kết hợp với Linh/Xương/Tiểu Hao/Triệt. Không biến “phúc” thành phẩm hạnh/số phận hoặc xa quê thành lời khuyên. Một phần, có hạt nhân để bổ sung đúng điều kiện.
- **Điền Trạch: A0/B1/C1/D3.** Có Cơ–Cự gặp Triệt trực tiếp trong lời V1; nguồn giữ hai mặt tạo lập/duy trì. Chưa có phối hợp Địa Không/Khôi/Hình hoặc lời trực tiếp đầy đủ về Cơ–Cự Miếu và ngoại lệ. Không dùng Đại Hao cung khác để suy bán/mua nhà. Một phần.
- **Quan Lộc: A3/B0/C8/D3.** Hai tổ hợp Tử–Tướng và Hổ–Tấu, Quyền tại Quan có hạt nhân tốt. Chưa có nghĩa phù hợp cho Hữu Bật/các yếu tố điều chỉnh. C bị lệch hết về Mệnh; bài3.3 tiến bộ nhưng chưa đủ tổng hợp tam phương. Có thể thử cải thiện có kiểm soát sau sửa đầu vào, chưa mở bán.
- **Nô Bộc: A0/B0/C2/D3.** Thiên Lương Hãm, Việt/Quý/Đức/Thương/Kiếp và Lộc năm sinh có facts nhưng không có lời trực tiếp matched. Không lấy tên “Lương/Lộc” để hứa cộng sự tốt hoặc nguồn Phụ/Huynh để luận người làm. Chưa đủ bài chuyên sâu.
- **Thiên Di: A0/B1/C8/D3.** Thất Sát Ngọ có lời hai mặt nể sợ/tin phục và may rủi; chưa có phối hợp Tam Thai/Thiên Phúc/Hỷ Thần/Điếu Khách. C cũng bị Mệnh chiếm hết, loại nguồn Phúc/Phu. Một phần, không hứa vị thế/di cư.
- **Tật Ách: A0/B0/C3/D3.** VCD, Kiếp/Diêu/Y… và Bệnh Phù là facts, không phải chẩn đoán. `PAID_THEMES['Tật Ách']=[]` nên hiện không có A/B theo thiết kế. NguồnC từ Phụ/Huynh/Điền không thay được nghĩa Tật; Trường Sinh Mộ không chỉ tuổi thọ. **Chỉ chú giải cấu trúc/an toàn, chưa phải bài sức khỏe cá nhân hoặc cung chuyên sâu đã nghiệm thu.**
- **Tài Bạch: A1/B1/C8/D3.** Liêm độc thủ và chi ngoài công việc từ Tử VCD có nguồn riêng; chưa có tổ hợp Liêm–Đại Hao. NPL27 chỉ dạy giữ phạm vi, không áp Song Hao Mão/Dậu cho một Đại Hao ở Thân. C thiếu Quan/Phúc vì cap. Một phần, ưu tiên cao.
- **Tử Tức (engine Tử Nữ): A0/B0/C2/D3.** VCD, có Đào Hoa/Ân Quang/Thiên Trù/Thiên Không/Phá Toái; chưa có lời trực tiếp matched theo chủ đề con cái. Nguồn Tử VCD luận chi tiêu thuộc Tài, không chuyển sang con/sinh sản. Chưa đủ bài chuyên sâu.
- **Phu Thê: A0/B1/C6/D3.** Có Khoa tại Phu nam, không có lời đúng điều kiện giải nghĩa bộ Phá–Đà–Hỏa; Quan Phù/Tang Môn đã chuyển nhưng nghĩa phối hợp chưa có. C đủ ba phía Phúc/Di/Quan, nhưng sáu đoạn ngữ cảnh không bù một hạt nhân hôn nhân. Chưa đủ, ưu tiên cao.
- **Huynh Đệ: A0/B1/C1/D3.** Thiên Đồng Hợi có lời xa cách; Lộc Tồn/Cô Thần/Lưu Hà và Lộc/Khoa từ cung khác chưa thành luận phối hợp. Một mệnh đề xa cách không đủ luận chia sẻ/khác biệt của anh chị em; không quy kết hoàn cảnh thật. Một phần.

Đã kiểm các rule ứng viên trực tiếp matched của evaluator hiện có: **0 matched trực tiếp bị bỏ** trên11cung mẫu. Điều này không có nghĩa retrieval hết lỗi: nguồn ngữ cảnh phù hợp bị bỏ theo cap, còn văn nghĩa sao chưa chuẩn hóa chưa đi qua tập matched này. Không dùng con số0 để kết luận toàn kho đã khai thác hết.

## 4. Phân loại phát hiện A–F và ưu tiên

### A — facts/kỹ thuật

**A1, đã sửa cho input mới:** adapter3.2 bỏ48field vòng; ảnh hưởng trực tiếp Hổ–Tấu, Hao/Tuế và Phu.11dry-run hiện chuyển đúng dữ liệu ở các field được kiểm; không phát hiện thêm sao bị rơi ở ba list/bốn vòng. Không sửa bài3.2 hoặc nâng snapshot cũ.

**A2, rủi ro truy vết cần kiểm riêng, chưa phải lỗi vị trí đã xảy ra:** `paid-facts` đánh source-traced cho boshi/suiqian bằng membership12giá trị/unique và trace nguồn, không tự kiểm lại vị trí từng sao theo phép an; đó không phải phép chứng nhận độc lập. Không cần xây engine mới. Đề xuất kiểm chính xác quan hệ path/provenance và tránh diễn giải duplicate representation; không tuyên bố dry-run đã chứng minh mọi phép an sách.

**A3, rủi ro validator quan sát tĩnh, chưa có bài Tật thật để kiểm runtime:** `validatePaidNarration` dò từ cấm trên cả thân bài và limitations; regex có `chẩn đoán|điều trị|tuổi thọ|tử vong` nhưng không xét phủ định. Một câu giới hạn an toàn chứa “không chẩn đoán” vẫn trúng regex. Điều này có thể từ chối bài an toàn, không chứng minh bài đó có nội dung y khoa sai. Đề xuất một kiểm mock phân biệt phát biểu bị cấm và giới hạn phủ định trước khi thử Tật; không nới cổng cho lời chẩn đoán/điều trị. Lượt này không chạy test ứng dụng hoặc sửa validator.

### B — tri thức có nhưng chưa được chọn đúng

**B1, ưu tiên cao nhất có thể cải thiện ngay mà không thêm lời:** code xếp theo group→ưu tiên V1→ID rồi cắt C8. Ở Quan3.3 và dry hiện tại, tám mụcC là `natal-paragraph-0-0` đến `0-7`, **tất cả Mệnh**. `8-0/8-1` (Tài), `10-0` (Phu) bị ghi `bounded-context-budget`. Với Tài, nguồn Quan `4-0/4-1/4-2` và Phúc `2-0/2-1` cũng bị cắt; Thiên Di tương tự. Đây là thiên lệch chọn văn theo ID/độ nhiều đoạn, không phải thiếu hình học hoặc “model không biết phối hợp”. Đã đối chiếu nội dung C trong input Quan3.3 thực gửi, không chỉ tái hiện trên code mới.

**Đề xuất:** lựa chọn ngữ cảnh theo liên hệ hữu ích với chủ đề và phân bố cung gốc, trong cùng budget; không mặc định quota mỗi cung nếu không có nguồn phù hợp. Giữ đúng nhãnC, không kéo lời Phúc/Tài sang kết luận thẳng Quan. Dry-run lại đúng ba cung và so nguồn được giữ/loại trước API. Không tăng số token vô điều kiện.

### C — tri thức thiếu hoặc chưa đạt điều kiện

Phu có tài liệu liên quan nhưng điều kiện/ngoại lệ chưa đủ; không gọi “thiếu retrieval” cho mọi đoạn chưa vào. Thiếu nghĩa Liêm–Đại Hao tại Tài; thiếu nền Nô/Tử trên mẫu; Tật bị giới hạn sản phẩm. NPL27/33 là tóm tắt phương pháp, không có phép cứu giải chi tiết. Giữ D thay vì đổi nhãn thànhA để tăng độ phủ. Việc nguồn có nói về một sao không chứng minh áp được vào tổ hợp/cung đang xét.

**Đề xuất hữu hạn:** kiểm đúng nguồn nghĩa chính tinh/phụ tinh của Tài/Phu và khoảng trống Nô/Tử trên snapshot mẫu; lập một phiếu mỗi chủ đề gồm mệnh đề, điều kiện, ngoại lệ, tác giả, đoạn chữ và mức xác minh. Chỉ đề xuất lời đủ điều kiện; nếu không có thì ghi thiếu và điều chỉnh kỳ vọng sản phẩm. Không khởi động lấp469rule, không tự gán độ sáng Hỏa hoặc diễn giải Nguyệt Sát/Chỉ Bối chưa xác minh.

### D — prompt/schema chưa bảo đảm giá trị nội dung

Prompt1.1 đã cho tổng hợp, nhưng trục tổ chức lặp, nhiều nội dung trở thành coaching. Tám kind và900–1300từ không nên là tiêu chí chất lượng; khi chỉ một luận điểm vẫn bị kéo thành tám phần. Validator hiện kiểm schema/IDs/từ cấm, không chứng minh nguồn thực sự hỗ trợ toàn bộ câu hoặc rằng tám phần khác ý. Không có bằng chứng cần đổi model/hạ guard.

**Đề xuất:** yêu cầu lập luận có luận điểm→căn cứ→giải thích→giới hạn sát ý; chỉ dùng câu hỏi sau một phân tích thật. Phân biệt “bổ sung góc nhìn” và “chế hóa có nguồn”, không tự tạo yếu tố thắng. Soát9tiêu chí trên toàn văn/claim trọng yếu, không coi factIds hợp lệ là entailment. Đây là đề xuất nội dung, chưa sửa prompt/schema. Rà riêng lỗi từ cấm nuốt cả phủ định an toàn ởA3; không giải quyết bằng cách bỏ giới hạn y khoa.

### E — biên tập

Từ ngữ điềm đạm đã khá; ba bài3.2 vẫn giống chú giải bản đồ. Quan3.3 lặp “trách nhiệm/quyền hạn” ở nhiều phần, giới hạn tương tự lặp cả thân và cuối, nhiều câu hỏi hơn lập luận mới. Cần gộp ý chứ không tăng sự khẳng định để nghe uyên thâm. Không thêm các phẩm chất dễ được mọi người nhận mình như “sâu sắc, mạnh mẽ nhưng nhạy cảm”.

### F — giới hạn sản phẩm phải giữ

Không tiên đoán chắc chắn người phối ngẫu, số con, thu nhập, bệnh/tử vong, không tư vấn điều trị/đầu tư. Không biến giai đoạn Bệnh/Tử/Mộ thành sức khỏe/tuổi thọ. Không trộn can cung/lưu niên với Tứ Hóa năm sinh, không sửa Mệnh V1/Luna/lịch sử.

**Điểm chặn thương mại:** “11cung chuyên sâu” hiện không tương xứng nguồn ở Nô/Tử/Tật. Cần chốt mô tả/phạm vi và điều kiện nội dung trước mở bán; task này không tự bỏ Tật khỏi gói, đổi thanh toán, hứa mọi cung đều sâu hoặc publish chú giải Tật chưa duyệt. Giao diện8phần/11jobcompleted không giải quyết được điểm này.

## 5. Nguyên tắc giọng văn Tinh Luận và ví dụ đề xuất

1. Mỗi đoạn mở bằng ý cần hiểu, chỉ dẫn những sao cần cho ý ấy; không lặp công thức “cung X có A,B,C”.
2. Phân biệt vị trí sao, lời tác giả và liên hệ biên soạn. Không làm suy luận nghe như trích sách; không tăng độ chắc khi viết mượt.
3. Hai mặt khác phạm vi được giữ song song, giải thích vì sao không triệt tiêu; không tự đặt phép cân điểm.
4. Chỉ nêu giới hạn gắn trực tiếp với ý đang bàn; phần chung một lần cuối bài. Không xóa giới hạn y khoa/hôn nhân/ngoại lệ quan trọng.
5. Một tình huống tự đối chiếu cụ thể sau phần phân tích tốt hơn ba câu hỏi chung; không yêu cầu người đọc đồng ý để xác nhận lời luận.
6. Thân bài không kể engine/catalog/packet hoặc quy trình nội bộ; nguồn xem ở căn cứ. Giọng điềm đạm, không giả danh danh nhân, không phán đời người.

**Các đoạn dưới đây là bản đề xuất biên tập của Codex, không phải phản hồi Astra mới, chưa thay bài đã lưu và chưa được duyệt publish.**

**Quan Lộc — gộp tổ chức/quyền hạn, giữ liên hệ biên soạn:**

> Điểm đáng đọc cùng nhau ở đây là khả năng sắp xếp công việc và ranh giới của quyền quyết định. Tử Vi–Thiên Tướng được chú giải theo cả mặt tổ chức lẫn khuynh hướng vượt phần quyền; Hóa Quyền tại Quan là một nét thuận về vị trí, không xóa mặt còn lại. Bạch Hổ–Tấu Thư thêm chủ đề văn chương và học hỏi. Từ những ý ấy, có thể tự đối chiếu cách trình bày một kế hoạch sao cho người khác hiểu được mục tiêu và phần việc của mình. Đây là liên hệ biên soạn giữa tổ chức và biểu đạt, chưa phải quy luật bảo đảm năng lực giao tiếp hay chức vụ.

Căn cứ: ba đơn vị A Quan; đồng cung đúngfacts. Không thêm ý Hữu Bật nâng đỡ hoặc Quyền cứu Kỵ. Đoạn này gộp ý trùng, chưa giải quyết nguồn tam phương đang bị cắt.

**Tài Bạch — tách thu/tích lũy/chi tiêu:**

> Kiếm được tiền và giữ được phần đã tích lũy là hai việc cần đọc riêng. Lời về Liêm Trinh độc thủ Thân nhấn vào cạnh tranh khi tạo nguồn thu và nhịp gom góp “chậm nhưng chắc”. Góc nhìn Trung Châu về chi ngoài công việc lại lưu ý những lúc mua theo hứng rồi giữ tiền chặt. Hai nhận xét thuộc hai phạm vi; chúng không tự phủ định nhau. Bạn có thể đối chiếu những khoản chi riêng với cách mình tạo nguồn thu, thay vì gom cả hai thành kết luận rằng mình giỏi hay kém giữ tiền.

Căn cứ: hai đơn vị trực tiếp Tài, giữ riêng tác giả. **Chưa viết Liêm–Hao:** không lấy NPL27 D hoặc một Đại Hao ở Thân làm chứng cứ Song Hao; không gán tỷ lệ/khoản tiền/lời khuyên đầu tư.

**Phu Thê — minh họa rút gọn trung thực khi nguồn mỏng:**

> Trong phần có chú giải trực tiếp, Hóa Khoa tại Phu Thê của nam mệnh gắn với chủ đề học vấn trong hình tượng bạn đời. Điều này có thể gợi một câu hỏi về vốn hiểu biết và khả năng cùng học hỏi mà bạn coi trọng trong quan hệ. Nó không xác nhận bằng cấp hay phẩm chất của một người cụ thể. Phá Quân, Đà La, Hỏa Tinh và Tuần cùng hiện diện, nhưng nguồn đang dùng chưa cho một phép phối hợp đủ rõ để nói yếu tố nào hóa giải yếu tố nào.

Căn cứ: chỉ Khoa tại Phu nam và facts đồng cung; câu hỏi là liên hệ biên tập. **Đoạn này không được dùng làm “bản Phu Thê chuyên sâu” mới**; nó minh họa không kéo một ý thành tám phần.

## 6. Công việc hữu hạn và điều kiện mở bán — chỉ đề xuất

### Bắt buộc trước mở bán

**P0.1 — cân lại chọn ngữ cảnh:** một thay đổi nhỏ ở lựa chọnC, không tăng kho/rule/queue. Đầu ra nghiệm thu: dry ba cung cho thấy nguồn liên quan không bị Mệnh chiếm hết, đúng cung/điều kiện/tác giả, không template; input mới có version riêng, bài cũ nguyên.

**P0.2 — phiếu nguồn bốn khoảng trống:** Tài (Liêm–Hao và phạm vi chi), Phu (Phá/Đà/Hỏa và điều kiện), Nô, Tử. Mỗi phiếu kết thúc bằng đủ/không đủ/ngoài phạm vi, không đặt mục tiêu thêm số rule. Nếu chưa đủ thì chưa hứa bài chuyên sâu tương ứng. Tật giữ phiếu phạm vi riêng, không tìm cách biến triệu chứng thành lời hấp dẫn.

**P0.3 — đề cương và biên tập prompt hữu hạn:** dùng bốn bài hiện có làm đối chứng; bỏ lặp, tránh kéo dài vì schema, nêu phân tích khác biệt theo cung. Giữ nguồn và giả thuyết, không đổi model/độ khẳng định để “nâng điểm”. Chưa có quyền sửa trong lượt này.

**P0.4 — đọc nghiệm thu có dẫn chứng:** với mỗi bài thử mới, đối chiếu9tiêu chí trên toàn văn. Không có lỗi sao/vị trí/trạng thái; nhận định chính có nguồn đúng phạm vi hoặc tổng hợp được gắn mức độ; không D→kết luận trực tiếp; không lặp một ý để đủ phần; không bịa hoàn cảnh/tiên đoán/y khoa. Ngưỡng đề xuất là mọi mục bắt buộc đều đạt, không lấy điểm trung bình bù lỗi facts/an toàn. Chủ dự án quyết định chuẩn giá trị nội dung, không đòi một chuyên gia ngoài tự xuất hiện.

**P0.5 — chốt đúng lời hứa gói:** không nghiệm thu cả11cung từ Quan/Tài/Phu hoặc một chart. Tật không được quảng bá bài sức khỏe cá nhân hoàn chỉnh; nguồn thiếu ở Nô/Tử/Phu phải được giải quyết hoặc mô tả/phạm vi được chủ dự án quyết định rõ trước offer thật. Kiểm vận hành provider thật, giá/usage/ETA vẫn là gate độc lập với nội dung; không tự triển khai những gate ấy trong task này.

### Có thể làm sau, khi lõi đã đạt

Bổ sung tập lá số phân biệt (VCD, một/hai chính tinh, can/giới khác và ngoại lệ thật), phản hồi đọc hiểu từ chủ dự án, rút gọn nguồn lặp để tiết kiệm token, bổ sung các nghĩa phụ tinh có điều kiện đã khóa. Không coi tập QA hữu hạn là mọi cấu trúc. Không nhất thiết đổi schema/hạ tầng để làm các bước này.

### Không nên làm

Không chạy lại Astra nhiều lượt để chọn bài đẹp; không tăngreasoning/độ dài hoặc đổi model khi chưa sửa dữ kiện/ngữ cảnh. Không tạo nhà máy lấp469rule, quét toànPDF, xóa điều kiện/ngoại lệ, đưa tất cả sách mỗi request, thêm điểm vận hạn. Không tự lấy nguồnD/C làm lời trực tiếp hoặc nguồn một tác giả chứng nhận tác giả khác. Không backfill/sửa bài3.2/3.3/quyền/Mệnh miễn phí. Không dùng số nguồn, số phần hay sự trôi chảy làm chuẩn duy nhất.

## 7. Kế hoạch API thật có giới hạn và dự toán — chưa thực thi

**Lượt này:0CREATE/0GET Astra/Luna,0phí.** Chỉ truy cập trang tài liệu OpenAI công khai, không endpoint provider hoặc API project.

Đề xuất vòng1 **tối đa3CREATE**: Quan/Tài/Phu, một lượt/cung trên bản đánh giá QA mới có quyền hợp lệ, giữ bốn bài hiện có. Chỉ bắt đầu sau P0.1–P0.3 và dry đạt. Nếu Phu/Tài vẫn chưa có nền nguồn đủ thì **không gọi cung ấy để cố cải thiện bằng văn**. Không tự retry uncertain; đối soát cùng receipt bằng cơ chế đã có và GET hữu hạn, không bật consumer toànqueue. So cũ/mới bằng cùng rubric, che nhãn phiên bản lúc đọc so nếu phù hợp; không chấm “mới luôn tốt hơn”.

Nếu vòng1 đạt và được giao tiếp, vòng2 **tối đa7CREATE** cho bảy chủ đề còn lại ngoài Tật: Phụ/Phúc/Điền/Nô/Di/Tử/Huynh, mỗi chủ đề một lượt, chọn snapshot QA có phân biệt có chủ ý, không chọn bài thuận. Chỉ các chủ đề vượt gate nguồn mới được gọi. Tật **giữ mock/dry và duyệt phạm vi**, chưa đề xuất CREATE sức khỏe. Tổng10lượt này chỉ là kế hoạch thử ban đầu, không đủ tự chứng nhận tất cả cấu trúc hay quyền mở bán11bài. Nếu không cải thiện, dừng đánh giá nguyên nhân; không chạy thêm để nâng điểm.

Chi phí lịch sử:3.2 Quan/Tài/Phu ghi$0,30042/$0,35906/$0,28690 nhưng thiếu cache-write để đối soát đủ theo parser mới; không coi đó là giá hiện tại/cận trên hoặc sửa lại lịch sử. Quan3.3 có28.108input (28.105write),5.916output gồm3.358reasoning, ước$0,6471425;812giây provider chỉ một mẫu, không bảo đảm ETA5phút.

[OpenAI model pricing](https://developers.openai.com/api/docs/models/gpt-6-astra), đọc31/10: Standard ngữ cảnh ngắn input$10/M, read$1/M, write$12,50/M, output$50/M. Đề xuất dự toán với **giả định** mỗi request tổnginput≤60.000 đã gồm schema/instructions, output≤12.000 đã gồm reasoning; bảo thủ toàninput tínhwrite: `(60.000×12,5+12.000×50)/1M` = **$1,35/lượt**. Không cộng reasoning lần nữa. Vòng1≤$4,05, đề nghị ngân sách dự phòng$5; vòng2≤$9,45, dự phòng$10; tổnggiảđịnh≤$13,50, dựphòng$15. Chưa phải hóa đơn/hard cap; cần kiểm token/model/tier/giá trước lần gọi được duyệt, vượt giả định thì dừng xin quyền thay vì tự gửi. Không mặc định dùngBatch/Flex/Fast hoặc tính cache lần sau chắc chắn có.

Dry hiện dùng UTF8bytes/3..bytes/2 chỉ để so độ phình: khoảng26.868–49.631 token theo cung, **không tokenizer/cận chắc**, chưa tính schema chính xác. Quan3.3 thực tế28.108 thấp hơn dải33.130–49.695 từng ước; vì vậy không dùng heuristic làm bill. Không đổi concurrency hoặc ETA trong đề xuất nội dung.

Phương pháp so đối chứng/rubric cụ thể và tránh thiên vị văn dài tham khảo [OpenAI evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices). Không chạy model làm judge trong lượt này; tài liệu chính thức không chứng nhận đúng sai chuyên môn Tử Vi.

## 8. Bằng chứng thực thi và giới hạn kết luận

Private evidence: [matrix gốc](../.local/ai-paid-quality-20261031/matrix.json), [đối chiếu facts/input/hash](../.local/ai-paid-quality-20261031/verification.json), từng `*-packet.json` gồm facts/knowledge/prompt/exclusions; script `dry.ts` và `verify.mjs` chỉ phân tích offline. Snapshot/bốn bài/input thật và code AI đã đọc có manifest24file; xác minh lại hash trước kết thúc. Không sao chép PII/raw snapshot vào Git.

Lỗi phép so đầu dùng JSON.stringify theo thứ tự key nên báo khác packet; so sâu chỉ ra không fieldvalue nào đổi, đã dùng canonical key để kiểm lại. Kết quả: Quan3.3 actual=dry, nhómC vẫn giống hiện hành và toànMệnh. Không sửa expected, bài hoặc code ứng dụng để làm kết quả đẹp.

Độ chắc giới hạn ở bốn văn bản/một chart và các field/source đã đối chiếu; không kiểm lại nguyên tác bằng ảnhPDF, không giải mọi bất nhất tác giả, không chạy user session/DB/runtime mới. Ma trận nguồn không là chứng nhận chuyên môn hay thống kê toàn kho. Chưa có cơ sở gọi gói trả phí đạt thương mại. Dừng ở báo cáo, không Gói3.7/QA3062/3070/Live.
