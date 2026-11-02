# Tật Ách T1 — khép P05 cho bản chú giải cấu trúc

02/11/2026, baseline `main@454a252`; tracked/index sạch lúc bắt đầu, giữ `buu-dinh-7parts/` và `docs/handoff/`. Phạm vi: tra thêm đúng các mục Bệnh/BệnhPhù, ThiênY, Thương–Sứ trong kho chữ đã xử lý, biên tập một bản T1 mới và ghép bộ bản luận hiện hành. Không appchange, không sửa nguồn/index/prompt/retrieval, bài cũ, engine, quyền hoặc runtime.

**P05 đạt trong phạm vi T1 cấu trúc đã khai; Tật80→90%. Mười cung khác90% giữ nguyên. P09 của cả11cung vẫn chưa kiểm, chưa đạt mục tiêu100%.** Không tự đổi checklist để gọi mock là nghiệm thu Astra. Đây là đánh giá biên tập của Codex trên một mẫu QA, không xác nhận lời sách đúng ngoài đời hoặc đủ phát hành.

[Toàn văn T1 mới](AI-PAID-TAT-T1-SYNTHESIS-20261102.md) · [Bộ10bài và T1 hiện hành](AI-PAID-READING-CURRENT-20261102.md) · [Bản T1 trước giữ nguyên](AI-PAID-TAT-T1-DEPTH-20261102.md) · [Checklist](AI-PAID-CONTENT-PROGRESS.json).

## 1. Nguồn bổ sung từ kho đã có

Không đọc lại toàn sách/PDF. Tra tên trong lớp chữ Hàm Số, chỉ đọc các mục liên quan; dùng bảng rà26/10 để nối vị trí và điều kiện. Không lấy việc đã trích sách làm bằng chứng đã giải mọi câu. Ba phiếu có hash nguồn, facts, điều kiện, ngoại lệ và phần tổng hợp ở [hồ sơ private](../.local/ai-paid-tat-t1-synthesis-20261102/source-cards.json).

- **Nguyễn Phát Lộc — Tử Vi Hàm Số154, Bệnh và Bệnh Phù; HS-S040:** tác giả nói chưa định rõ loại/cường độ trong sách vở và dùng mức suy đoán cho phần giải thích tiếp. Có các nhánh phối hợp và ngoại lệ riêng. Giữ đúng mức độ nhận định; không biến suy đoán của tác giả thành dữ kiện của người đọc. Câu chung không được dùng để chứng minh mọi nhánh đã đủ điều kiện. Không áp các kết quả về cơ thể.
- **Hàm Số220, Thiên Y; HS-S074:** nghĩa nền có mặt cứu giải, nhưng các phần Mệnh/Quan/Hạn có điều kiện và chủ thể khác nhau. Câu Y–Riêu nằm trong phần Hạn. Dữ kiện mẫu có cả Y và Diêu tại Tật; không dùng câu ở Hạn làm lời bản mệnh, không lấy nghĩa nền xóa Bệnh Phù hoặc tự nhận một nghề. Phần “không có phép trừ hai bên” là giới hạn của tổng hợp trong các đoạn đã chọn, không một câu nguồn nói về mọi cách giải.
- **Hàm Số216–217, Thương–Sứ; HS-S071:** Sứ ở Tật, Thương ở Nô là vị trí cố định; tác giả đặt ý nghĩa phối hợp vào hạn, đặc biệt tiểu hạn. Giữ điều kiện thời điểm. Không suy từ Sứ bản mệnh ra sự việc cả đời; cũng không biến giới hạn riêng của Thương–Sứ thành điều kiện chặn toàn bộ các sao khác ở Tật.

Đối chiếu tên **Diêu/Riêu** bằng ánh xạ đã có trong `lib/tuvi-engine/tanbien.ts`, không sửa hoặc gọi engine để an sao. OCR216 có chữ Hương ở đầu mục; ngữ cảnh217/hồ sơHS-S071 đã xác định Thương–Sứ. Không tự sửa file nguồn hoặc nhận đã kiểm ảnh mới. Các đoạn có kết quả y khoa/sinh tử/phẩm hạnh trong trang lân cận không được lấy làm lời cá nhân hay đổi thành tính cách.

## 2. Vì sao P05 nay đủ trong T1

Giữ định nghĩa cũ: “Đối chiếu các yếu tố trọng yếu của phạm vi bài, không chỉ liệt kê hoặc rào; không đòi diễn giải mọi sao.” RowTật vẫn “Chỉ chú giải cấu trúc hoặc insufficient, chưa duyệt bài sức khỏe cá nhân”; không hạ yêu cầu, thu hẹp scope trong phiên hoặc tính mức hoàn thành trên số lượng nguồn.

Bản trước mới nêu ba nhánh Bệnh Phù và những phép chuyển không được tự làm. Bản mới bổ sung **vai trò khác nhau của ba yếu tố thực sự ở chính cung**, cách chúng phải được đọc cùng nhau, và một giới hạn thời điểm có nguồn:

1. **Mục2 — hai tác giả không cùng mức phát biểu:** Tân Biên188 chia lời nền/nhánh; Hàm Số154 giữ mức suy đoán ngay trong phần giải thích. Tổng hợp phân biệt độ chắc của lời với điều kiện để áp lời. Không chọn lời nặng nhất, không lấy sự dè dặt của một tác giả xóa tác giả kia.
2. **Mục3 — đối chiếu Bệnh Phù với Thiên Y:** Y có mặt cứu giải ở phần nghĩa chung, nhưng các đoạn cụ thể lại đổi phạm vi theo cung/hạn. Vì thế sự cùng có mặt của BệnhPhù/Y không đủ thành phép trừ tốt–xấu. Phần nối giải thích hai yếu tố đóng góp gì cho cách đọc: một bên cần giữ nhánh và mức suy đoán, bên kia cần giữ phạm vi của nghĩa chung và nghĩa theo vị trí. Đây là phân tích điều kiện/ý nghĩa nguồn, không cơ chế cứu giải mới hoặc kết quả sức khỏe.
3. **Mục3 — Y và Diêu không tự tăng số bằng chứng:** hai tên đều có trong snapshot; câu nguồn nối chúng nằm trong phần Hạn. Bản tổng hợp giữ đúng vị trí câu và không dùng nó làm hai lời xác nhận độc lập cho kết luận bản mệnh. Không suy lại sao Y từ sao Diêu.
4. **Mục4 — Sứ có mặt nhưng thời điểm áp khác:** nhận vị trí Sứ ở Tật, giữ ý nghĩa phối hợp ở hạn theo Hàm Số; không dùng sao cố định để viết lời cả đời. Đồng thời không mở rộng giới hạn này thành cổng unknown cho mọi lời Tật. Phân biệt cả hai chiều tránh vừa dùng quá mức vừa loại quá rộng.

**Dẫn chứng bản mới:** “Đọc cả hai làm rõ hai việc khác nhau: một lời được trình bày với mức dè dặt nào, và nó cần thêm điều kiện gì.” Và: “Chưa có phép cân trong những đoạn này để lấy một bên trừ bên kia.”

Đây là lập luận của **một chú giải nguồn có cấu trúc**, đã đi xa hơn danh sách sao hoặc danh sách điều cấm. Bỏ HàmSố154 sẽ mất phân biệt mức suy đoán; bỏ220 sẽ mất việc đối chiếu nghĩa chung với phạm vi cụ thể của ThiênY; bỏ216–217 sẽ mất phân biệt sao bản mệnh với lời chỉ dùng khi xét hạn. Những đóng góp có căn cứ ấy đủ khép P05 trong scopeT1, **không cần giả vờ đã giải mọi phụ tinh hoặc mọi nhánh y khoa**.

P06 kế thừa quan hệ Mệnh–Tật đã kiểm ở bản trước; P07/P08 được rà lại toàn văn bản mới. Phần tổng hợp luôn được ghi là biên tập, không nguyên văn sách. THP2/TânBiên/NPL giữ riêng, không hợp nhất thành công thức. Các kết quả về cơ thể không được cá nhân hóa.

## 3. Phần vẫn chưa hoàn thành

Chưa chốt AND/OR/phạm vi tọa–hội cho các cụm Hình–Kỵ/Hao–Sát; chưa có phép định lượng mức điều chỉnh từ Mệnh–Thân–Phúc; không diễn giải ThiênSát upstream hoặc Mộ/source-conflict. Không phải tất cả những việc này đều bắt buộc trước một chú giải riêng, nhưng không được tuyên bố chúng đã giải chỉ vì P05 đạt.

T1 vẫn **chưa duyệt nội dung/chưa publish**, không luận sức khỏe cá nhân hoàn chỉnh. Ứng dụng vẫn `insufficient`, packet vẫn0direct Tật, không thêm indexunit/rule và không đưa artifact nghiên cứu vào renderer/provider. MệnhV1/Luna,10bản limited và lịch sử giữ nguyên.

**Mục tiêu100% còn P09 cho từng cung:** định nghĩa hiện hành yêu cầu Astra trên cấu hình hiện hành được đánh giá toàn văn đạt. Lượt rà nguồn và mock này không thể chứng minh điều ấy. Không thay mẫu số, miễn P09 cho Tật hoặc coi bản biên tập của Codex là kết quả Astra. Không có API hoặc quyền publish mới trong yêu cầu tiếp tục này.

## 4. Kiểm thực sự đã chạy

Node24, key rỗng/AI tắt/DBcổng1, chặn `fetch` trước import. Dùng lại `paidInput`, `validatePaidNarration`, `violatesPaidMedicalScope`; artifact T1 là hồ sơ nghiên cứu, không một schema/provider/queue mới.

- **159facts và knowledge giữ nguyên** so với bản trước và tái tạo từ snapshot đã lưu. Kiểm đúng BệnhPhù/Y/Diêu/Sứ tại Tật, provenance, nhãn conflict/upstream và mapping từng đoạn.
- **T1 có6phần/17đoạn**, qua guard an toàn và tham chiếu hợp lệ; đã đọc nghĩa từng đoạn đối chiếu nguồn. Validator không tự chứng minh P05 hoặc điều kiện chuyên môn.
- **6negativeprobe đạt:**3câu vượt y khoa bị chặn, C-onlyfocused bị từ chối, upstream không dùng để diễn giải, factID giả bị từ chối. Artifact `insufficient`0section hợp lệ; không tạo đoạn luận giả để lấy coverage.
- **10bản limited** qua validator hiện hành,8bài thật cũ qua đúng prompt/version đã lưu. Hash21artifact bundle nguồn và16artifact baseline gồm các bản thảo/T1/tổng hợp/snapshot giữ nguyên. Bộ bản luận mới ghép nguyên văn10bài, thêm T1 mới riêng; không chỉnh các bài để tăng điểm.
- Chỉ một lượt chạy mock trên bản cuối, đạt ngay; không có lượt fail. Các lệnh tra cứu có một đường dẫn index không tồn tại (`books/th/INDEX.md`); đã xác định kho TổngHợp là `books/npl`, không thay nguồn hoặc expected. Các mục mới thực dùng chỉ thuộc HàmSố.

[Script](../.local/ai-paid-tat-t1-synthesis-20261102/check.ts) · [Log](../.local/ai-paid-tat-t1-synthesis-20261102/check-1.log) · [Mapping/hash/summary](../.local/ai-paid-tat-t1-synthesis-20261102/summary.json) · [Baseline bảo toàn](../.local/ai-paid-tat-t1-synthesis-20261102/preservation-before.json).

Chỉ đổi tài liệu nên không build/typecheck/suite167/E2E/PDF/mobile hoặc DBintegration. **0CREATE/0GET OpenAI,0USD**; không consumer/supervisor/deploy, không QA3062/3070, không thay engine/thanh toán/quyền/MệnhV1-Luna/bài cũ. Git commit không phải quyền phát hành.

## 5. Checklist sau phiên

Phụ Mẫu90%; Phúc Đức90%; Điền Trạch90%; Quan Lộc90%; Nô Bộc90%; Thiên Di90%; **Tật Ách90%**; Tài Bạch90%; Tử Tức90%; Phu Thê90%; Huynh Đệ90%.

Chỉ `Tật Ách.P05` chuyển partial→passed; tất cảP09 giữ not-verified. Tiêu chí, phạm vi, trọng số, mẫu số và `commercialReady=false` giữ nguyên. % đo hồ sơ kiểm/biên tập trên mẫu QA, không độ chính xác, độ phủ mọi lá số hoặc mức sẵn sàng thương mại. Dừng ở bản tổng hợp/mapping và mock theo phạm vi được giao.
