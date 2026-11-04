# Tích hợp nguồn đã rõ vào đầu vào trả phí 1.20 — 04/11/2026

Đã tích hợp hai nhánh nguồn có điều kiện cho Tài/Phu và bổ sung phương pháp Nô/Tử vào **đầu vào bài mới**, kiểm offline bằng pipeline hiện có. Không sửa facts, bản đọc cũ, prompt2.8, ReadingV2, Mệnh miễn phí hoặc quyền. Không gọi model, DB, worker, deploy hay publish. Đây là hoàn thành lô tích hợp, **chưa nghiệm thu chất lượng model hoặc thương mại**.

Baseline `main@f4af631`; tracked/index sạch trước sửa. Giữ nguyên `buu-dinh-7parts/` và `docs/design-handoff/`. Phiên bản mới `paid-retrieval-1.20.0`, `paid-context-guide-1.3.0`; facts vẫn1.1.0. QA3118 PID74791 trước/sau, cwd `.local/qa-paid-current-20261103/checkout`, code input1.14; không dùng kết quả offline để nói runtime đã cập nhật. Không thao tác QA3062/3070.

## Nguồn mới và điều kiện

Tái dùng [nhật ký đọc toàn sách](AI-PAID-VDC-FULL-BOOK-REVIEW-20261104.md), không quét lại PDF. Nguồn là bản dịch máy Tử Vi Cổ Học của sách Vương Đình Chi, không bản Trung văn đã hiệu đính. Chỉ hai điều kiện bảng đã kiểm ảnh được mở; các đoạn khác của sách vẫn chỉ nhận phương pháp như trước.

- **Tài Bạch:** `vdcsc-liem-than` nối bảng PDF34 với câu211: Liêm Trinh thực ở Tài/Thân, theo riêng bảng tác giả là Miếu; luận điểm tạo tài trong cạnh tranh. Không nhận vế Hãm/Kỵ, không bảo đảm thắng hoặc thu nhập. Engine vẫn **Vượng**, không quy đổi thành Miếu. Không ghép Phủ ở Mệnh thành Phủ thủ Tài, không tự tạo phép Liêm–Đại Hao. Kho giữ riêng nền Liêm của THP2, Hao của Tân Biên và lời khác; không chọn tác giả thắng.
- **Phu Thê:** `vdcsc-hoa-tuat` nối bảng35 với nhánh Miếu ở198: Hỏa thực ở Phu/Tuất. Giữ hai khả năng **ít thời gian cùng nhau hoặc biến chuyển công việc của phối ngẫu**, không đổi OR thành AND hoặc sự kiện chắc chắn. Engine vẫn chưa ghi nhận độ sáng Hỏa. Loại câu dịch hỏng cuối198–đầu199, không ghép phép Phá–Đà–Hỏa/Tuần. Lời THP2 “trợ giúp qua một giai đoạn” và việc loại nhánh Tả không gặp sát vẫn giữ riêng.
- **Nô Bộc:** mở rộng phương pháp238–239 về ba tầng quan hệ, chỉ trong khung đang xét Nô. Huynh/ngang hàng, Phụ/trưởng bối, Tử/vãn bối là hướng đặt câu hỏi; không chuyển mọi lời cha mẹ/con thành lời sếp/thuộc cấp. Trang249 được gắn hash để giữ giới hạn: không tự coi một Việt/Lộc đủ nhóm trợ tinh, không coi Đồng đối cung thành Đồng–Lương đồng độ. Chưa thêm mệnh đề trợ lực cá nhân từ nhánh lượng từ chưa rõ.
- **Tử Tức (key `Tử Nữ`):** nối69/73–75 với phương pháp gia đình đã có. Phân biệt đồng độ, tam hợp, xung; phương pháp VCD xét toàn tinh hệ, không chỉ chính tinh. Chưa thực hiện phép mượn, không chuyển Cơ–Cự ở Điền sang facts Tử, không bỏ Hình/Không/Triệt để lấy riêng vế thuận. Nhánh Kỵ năm sinh tại Điền đã có vẫn chỉ chọn khi khớp; mẫu hiện hành Kỵ tại Mệnh không nhận nhánh ấy.

## Cách tích hợp và bảo toàn

`paid-library.ts` nhận hai mã `authorCondition` hữu hạn. Mỗi mã buộc đúng cung đích, bộ nguồn riêng vdcsc, trang bảng và trang mệnh đề; vị trí lấy từ location engine, sao natal truy nguồn, cùng chỉ mục cung và đường dẫn. Sai cung/chi/trường sao, thiếu neo, trùng location hoặc nguồn chưa xác minh đều bị loại. Hash trang sai không được sử dụng. Không triển khai bảng sáng/engine mới.

Metadata `passage.authorCondition` giữ tác giả, sách, địa chi, Miếu và trang bảng; điều kiện nguồn nằm trong knowledge, **không thêm vào facts**. `anchorFactIds` gồm sao và location. Validator hiện có buộc đoạn dẫn nguồn đủ neo; metadata và điều kiện được serializer giữ nguyên. Cấu trúc tham chiếu đúng không chứng minh mọi câu diễn giải đúng nghĩa; vẫn cần đọc toàn văn khi thử model.

Index mới private `index-v120.json`:21unit =19cũ +2mới, sửa4method; mọi index cũ nguyên byte. Loader ưu tiên120, thiếu file mới mới dùng chuỗi cũ; file mới hỏng fail closed. Tối đa4slot sách như cũ, chỉ mở5slot khi có nhánh tác giả đã khớp; tối đa1web dùng phần byte dư, **trần14.000byte không tăng**. Mẫu Tài6unit gồm5sách+1web,13.738byte; Phu5sách11.764byte. Không có nguồn cũ bị rơi trong dry-run.

Guide1.3 chỉ thêm liên hệ Phúc cho Tài/Phu khi có methodD tương ứng và nguồnC đã chọn, có neo/geometry thật. Giữ nguyên C, điều kiện và cung gốc. Nếu lời Phúc chỉ về nơi ở/họ hàng, không biến thành hài lòng, thói quen tiêu tiền, sức khỏe tâm lý hoặc tính cách phối ngẫu. Không tăng số đoạn C/nguồn trong packet. Nô/Tử không tự thêm liên hệ từ những chủ thể chưa có lời phù hợp.

Savedinput, prompt, job/attempt và kết quả cũ không đọc lại index để viết lại. Không migration, queue hoặc renderer mới. Code chỉ áp khi dựng input mới; không backfill.

## Đầu ra nội bộ

- [Kho mới](../.local/source-library/knowledge/paid-passages/index-v120.json), [script dựng](../.local/ai-paid-vdc-integration-20261104/build-index.py). Không chạy lại script lên file đã tồn tại.
- [Manifest48artifact và hash](../.local/ai-paid-vdc-integration-20261104/source-bundle-manifest.json); bản sao riêng ở `.local/ai-paid-vdc-integration-20261104/source-bundle/`. Gồm index, trang nguồn và receipt web thực dùng; không toàn sách trong Git. Code commit **không chứa kho private**; chưa chuyển kho sang checkout QA.
- [Dry-run đủ11cung, delta nguồn và guide](../.local/ai-paid-vdc-integration-20261104/summary.json). Mỗi input riêng `palace-{0..10}-input120.json` cùng thư mục.
- [Ví dụ một đoạn Tài](../.local/ai-paid-vdc-integration-20261104/palace-7-new-premise-example.json), [ví dụ một đoạn Phu](../.local/ai-paid-vdc-integration-20261104/palace-9-new-premise-example.json). Đây là **biên tập mock**, không bài API, không bài đầy đủ hoặc đã được chủ dự án duyệt. Tên sách không nằm trong lời khách; nguồn giữ ở căn cứ.

Ví dụ Tài: “Với Liêm Trinh tại Thân ở cung Tài Bạch, một cách luận truyền thống nhấn vào việc tạo nguồn thu trong cạnh tranh. Điểm đáng tự đối chiếu là cách bạn tham gia một môi trường có nhiều bên cùng tìm cơ hội; lời này chưa cho biết bạn sẽ thắng thế hoặc thu được bao nhiêu.”

Ví dụ Phu: “Hỏa Tinh tại Tuất ở cung Phu Thê có một cách đọc về hoàn cảnh chung sống: có thể ít thời gian ở bên nhau, hoặc công việc của người bạn đời có biến chuyển. Hai khả năng này được đặt riêng, không phải hai việc chắc chắn cùng xảy ra; cũng chưa nói quan hệ sẽ tốt hay xấu.”

## Kiểm thực sự chạy

Node24.21.0, không nạp `.env` hoặc gọi provider.

- 159/159 test tại6file: library, context-guide, scope-input, source-fidelity, V2 và editorial. Nhánh nguồn đúng/sai, hash, version/fallback, C/D/refs/safety và tương thích đã kiểm. [Log cuối](../.local/ai-paid-vdc-integration-20261104/tests-second.log).
- Lượt đầu94/98:4fail do assertion còn đòi guide1.2, hai liên hệ Tài, tối đa5unit kể cảweb. Đối chiếu delta rồi sửa kiểm đếm cho guide1.3 và nhánh tác giả có5sách; **không tăng trần byte hoặc sửa expected lời nguồn để xanh**. [Log đầu](../.local/ai-paid-vdc-integration-20261104/tests-first.log).
- Dry11giữ159facts/cung, không nguồn cũ bị loại; 11bản biên tập cũ hợp lệ với input cũ/mới,2ví dụ mới hợp lệ và thiếu neo bị chặn; Tật vẫn0direct/insufficient.1.479file trong manifest gồm nguồn/bản cũ/hồ sơ nghiên cứu giữ hash. Đây là file preservation, không tuyên bố đã đối soát DB. [Script](../.local/ai-paid-vdc-integration-20261104/check.ts), [log cuối](../.local/ai-paid-vdc-integration-20261104/mock-final.log).
- Bản sao48artifact kiểm96hash, chọn nguồn bốn cung giống kho gốc; serializer giữ facts/knowledge,8file code/test trong bản build khớp working tree. [Log](../.local/ai-paid-vdc-integration-20261104/bundle-check.log).
- Typecheck/build bản sao cách ly đạt. Lượt typecheck đầu thiếu2file private `exports/demo-wuqu-tianfu-review.json`, `fixtures/customer-reading-samples.json`; sao chép đúng phụ thuộc đang có, không force-add hoặc sửa dữ liệu. [Lỗi đầu](../.local/ai-paid-vdc-integration-20261104/typecheck.log), [typecheck cuối](../.local/ai-paid-vdc-integration-20261104/typecheck-final.log), [build](../.local/ai-paid-vdc-integration-20261104/build.log). Build có cảnh báo nhiều lockfile do checkout lồng, không thay config chung để che cảnh báo.
- 0CREATE/GET, $0 API. Không E2E/PDF/UI/mobile hoặc kiểm DB vì không đổi các phần đó; không khởi động consumer/supervisor. Không gọi mock là kiểm dịch vụ thật.

## Phần còn mở và điểm dừng

Hai nhánh mới khép điều kiện **nguồn** cụ thể, không tự khép công thức Liêm–Hao, Phá–Đà–Hỏa/Tuần, lượng từ trợ tinh Thiên Lương, phép mượn toàn tinh hệ Tử hoặc bài Tật cá nhân. Không tự chọn AND/OR, không đổi nguồn bệnh thành lời sức bền/áp lực.

Checklist hồ sơ kế thừa giữ nguyên: Phụ Mẫu90%, Phúc Đức90%, Điền Trạch90%, Quan Lộc90%, Nô Bộc90%, Thiên Di90%, Tật Ách90%, Tài Bạch90%, Tử Tức90%, Phu Thê90%, Huynh Đệ90%. **Không phải90% chất lượng hoặc sẵn sàng thu phí**; không tăng điểm bằng số đoạn mới. Chưa có bài model dùng input1.20, chưa có phê duyệt nội dung/phạm vi thương mại; `commercialReady=false`.

Dừng ở tích hợp offline đã kiểm. Không tự gọi API, publishT1, đổi gói bán hoặc cập nhật QA. Nếu tiếp tục, dùng bản đầu vào này để biên tập/đánh giá toàn văn trước phép thử thật được cấp quyền riêng.
