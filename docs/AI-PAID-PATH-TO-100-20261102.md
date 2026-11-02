# Mục tiêu100% — tiến độ thật và các điều kiện còn mở

02/11/2026, baseline `main@935318f`. Chủ dự án yêu cầu tiếp tục rà nguồn/tổng hợp, đích tất cả cung100%. Giữ giới hạn chưa gọi API, chưa cập nhật QA3062/3070 và không thay lịch sử. Không đổi10tiêu chí hoặc tính mock thành model thật để đạt mục tiêu. Bửu Đình và thư mục ngoài phạm vi giữ nguyên.

## Phần đã hoàn thiện trong phiên

**P06Điền đạt cho bản limited trên mẫu QA.** Bộ truy xuất trước chưa lấy được lời Tử từ sách mặc dù nó thuộc đối cung và có điều kiện khớp. Mở đúng một đường dùng lại nguồn: Điền←Tử qua `paidBookContexts`; không rule Tử Vi mới, không chọn theo ID/ngày sinh mẫu. Chỉ nguồn directA/B của Tử đã khớp điều kiện mới được nhận, chuyển sangC/context tại Điền, giữ nguyên chữ/ngoại lệ/anchor/cung gốc. Không nâng C thành lời trực tiếp.

Tiền đề Điền là Cơ–Cự Mão/Triệt, tạo lập và duy trì nhà đất. Tiền đề Tử là THP1/PDF130§4.2.8ý(12), quan hệ với con theo cách đọc Lộc năm sinh tại Nô. Guide giữ Lộc tại Nô, không chuyển sao sang Tử hoặc Điền. Hai tiền đề giúp phân biệt tạo lập nơi sống và sự gần gũi trong gia đình; không suy nhà khó tạo gây bất hòa, hòa hợp bảo đảm có nhà hoặc nhà đất quyết định tình thân.

[Đọc toàn văn Điền mới](AI-PAID-DIEN-P06-20261102.md). Đã đọc và đối chiếu hai đoạn mới: nguồn Tử có thể gợi hòa hợp, đoạn nối là ai-synthesis có hai tiền đề và giữ rõ cung gốc. Coverage vẫnlimited. Bản Điền trước và P05 giữ nguyên; Điền80→90%, chỉP06partial→passed. Không coi tăng số nguồn tự động đủP06.

Retrieval **paid-retrieval-1.11.0**, prompt2.6/schemaV2 giữ nguyên. Các cap của bộ chọn nguồn cũ giữ nguyên. Không thay queue, provider, worker, thanh toán, quyền, UI hoặc engine. Lịch sử/GET vẫn dùng input/prompt của job đã lưu, không tạo lại theo code mới.

## Vì sao chưa thể ghi100%

**Mười cung90%:** Phụ, Phúc, Điền, Quan, Nô, Di, Tài, Tử, Phu, Huynh. Mỗi cung còn **P09**, định nghĩa là chất lượng Astra thật trên cấu hình hiện hành. Việc thêm văn, mock hoặc dùng model nhẹ không đáp ứng mục ấy. Các request được duyệt ở vòng cũ không tự là quyền cho vòng mới; phiên này0API, không chạy consumer.

Khi có quyền kiểm thật, cần chốt trước cung được thử, số CREATE và dự phòng phí, kiểm model/credit/giá, giữ Background/receipt cùng các giới hạn hiện hành. Để tiết kiệm, chỉ nên bắt đầu một cung đại diện; đạt mẫu đó không tự khépP09 của chín cung chưa thử. Không mặc định gọi cả11cung hoặc dùng credit đã bổ sung làm quyền chi tiêu mới.

**Tật40%:** còn P04/P05/P06/P07/P08/P09. Packet hiện có0nguồn direct,3C từ Phụ/Điền/Huynh và3D phương pháp. Sáu đoạn ấy không trở thành sáu luận điểm trực tiếp về sức khỏe. Đã chuẩn bị [hồ sơ cấu trúc/facts và vai trò nguồn](../.local/ai-paid-path100-20261102/tat-structural-dossier.json), không phải bài cá nhân và không được đưa vào báo cáo. Không tăng điểm chỉ vì tạo hồ sơ này.

Hướng T1 hiện hành chỉ cho thẩm định chú giải truyền thống theo cấu trúc; hai mẫu cũ còn điều kiện điều chỉnh chưa khép, chưa được duyệt xuất. Đích100% không tự mở nội dung chẩn đoán, bệnh/tổn thương/sinh tử, tuổi thọ hoặc điều trị. Không dùng văn miễn trừ để hợp thức hóa nội dung ấy. Muốn khép phần biên tập Tật phải có bản chú giải đúng phạm vi và căn cứ được rà/duyệt; P09 sau đó vẫn cần kiểm model thật riêng. Xem [giới hạn và phụ thuộc hai mẫu](PRODUCT-SCOPE-D-REVIEW.md#tật-đồng-ý-phạm-vi-không-giải-hai-phụ-thuộc-đang-có).

Mệnh miễn phí V1/Luna không nằm trong checklist11cung trả phí và giữ nguyên.100%checklist vẫn chỉ là hồ sơ trên mẫu QA, không bằng chứng đúng mọi lá số hoặc quyền mở bán.

## Kiểm thực chạy

- **167/167puretest,9file**, [log](../.local/ai-paid-path100-20261102/tests.log). Thêm Điền vào các ca giữ nguyên source/C/condition/anchor và guide; bỏ khỏi danh sách ngoài scope vì nay là mục tiêu được thực hiện. Lộc tại Nô được kiểm cho cả Phụ/Điền; guard C, source, an toàn và savedversion giữ nguyên. Không thay expected sách hoặc lịch sử để xanh.
- Mock Điền qua validator2.6, không cảnh báo bỏ ngữ cảnh; xóa tên cung gốc bị chặn `AI_CONTEXT_AS_DIRECT`. Dry11cung159facts/cung nguyên; nguồn Điền cũ giữ, thêm đúng1nguồn Tử.8bài thật cũ qua đúng savedvalidator/giữhash,21sourceartifact giữhash. [Summary](../.local/ai-paid-path100-20261102/summary.json), [logcuối](../.local/ai-paid-path100-20261102/mock-final.log).
- Script dry đầu dừng do đường dẫn baseline bốn cung trước nằm trong file `reading.json`, không ở thư mục sáu cung `input.json`. Sửa bộ đọc baseline đúng layout và kiểm lại đạt; không thay input/snapshot hoặc validator.
- Typecheck/build Node24 cách ly/keyrỗng/AI tắt/DBcổng1 đạt; BUILD_ID `P2UdeA4x7aBWeMBPvkMFA`,612file. [Typecheck](../.local/ai-paid-path100-20261102/typecheck.log), [build](../.local/ai-paid-path100-20261102/build.log). Cảnh báo workspace-root nhiều lockfile giữ nguyên, không sửa hạ tầng.
- Không DBtest/E2E/PDF/mobile hoặc runtimeweb mới; không triển khai build này. **0CREATE/0GET OpenAI,0USD**, không worker/supervisor/migration, không cập nhật QA3062/3070 hoặc mở Live. Tất cảcommercialReady vẫnfalse.

**Mục tiêu tất cả100% chưa đạt.** Đã khép phần khả thi P06Điền; hai điều kiện còn lại là kiểm Astra thật và hoàn thiện/duyệt nội dung Tật đúng giới hạn. Không tự ghi100%, mở API hoặc đổi phạm vi để vượt các điều kiện này.
