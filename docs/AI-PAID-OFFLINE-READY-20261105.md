# Bộ luận trả phí đối chiếu offline — 05/11/2026

**Đã hoàn tất ba bước offline trong phạm vi có căn cứ: chốt phạm vi 11 cung, biên tập bản đối chiếu, kiểm và đóng bộ đầu vào. Có 10 bản `limited` và một trạng thái Tật Ách `insufficient`, không phải 11 bài chuyên sâu đã nghiệm thu.** Không có API mới hoặc thay đổi ứng dụng/runtime. Bài tham chiếu do Codex biên tập, chưa phải bài model và chưa được chủ dự án duyệt làm chuẩn thương mại.

Baseline `main@0d6b7b5`; tracked/index sạch trước phiên. Giữ nguyên `buu-dinh-7parts/`, `docs/design-handoff/`. Quyền mới chỉ cho ba bước offline, không phải quyền thử model, triển khai hoặc mở bán.

## Đọc bản hoàn chỉnh và căn cứ

- [Bộ đọc HTML đủ 11 mục, căn cứ mở riêng](../.local/ai-paid-offline-ready-20261105/bo-bien-tap-qa.html).
- [Toàn văn Markdown](../.local/ai-paid-offline-ready-20261105/ban-doc-11-cung.md).
- [Phạm vi, câu hỏi và phần giữ ngoài bài của từng cung](../.local/ai-paid-offline-ready-20261105/scope-11.json).
- [Thay đổi so với các bản biên tập trước](../.local/ai-paid-offline-ready-20261105/changes.json).

Mỗi cung có `palace-{0..10}-proposal.json`, `palace-{0..10}-evidence.json`, `palace-{0..10}-input.json` và `palace-{0..10}-request-preview.json` trong [thư mục riêng](../.local/ai-paid-offline-ready-20261105/). Thứ tự là Phụ, Phúc, Điền, Quan, Nô, Di, Tật, Tài, Tử, Phu, Huynh. Evidence giữ từng đoạn, loại diễn ý/tổng hợp, facts gốc và đầy đủ knowledge/điều kiện/ngoại lệ/provenance. Không hiển thị tên sách/tác giả hoặc thuật ngữ triển khai trong thân bài; xem nguồn riêng ở căn cứ.

Đây là bản tham chiếu gắn với **một snapshot QA đã lưu**, không nội dung chọn theo ID/ngày sinh để giao khách. Factory vẫn xử lý snapshot và điều kiện chung. Bản tham chiếu không được chèn vào prompt sản xuất hoặc dùng làm đầu ra model giả. Chưa chứng minh độ bao phủ mọi lá số.

## 1. Phạm vi chốt cho từng cung

- **Phụ Mẫu — limited, 2 phần/4 đoạn.** Ba mặt vật chất, hòa thuận giữa cha mẹ và khoảng cách với con; liên hệ hai vai gia đình với Tử. Chưa giải toàn bộ phụ tinh hoặc nguyên nhân sống xa. Không suy thế hệ sau lặp lại/hóa giải thế hệ trước.
- **Phúc Đức — limited, 3 phần/5 đoạn.** Hoàn cảnh họ tộc, điều kiện xa quê và trải nghiệm bên ngoài. Bỏ đoạn lặp ý Thiên Mã trước khi giải thích chính luận điểm đó. Không chấm phẩm chất/hạnh phúc hoặc nhận nhánh Tuần/Triệt chưa đặc tả.
- **Điền Trạch — limited, 2 phần/4 đoạn.** Phân biệt tạo lập với duy trì nhà đất, giữ Triệt trực tiếp; liên hệ quan hệ với con chỉ là ngữ cảnh. Không tự chọn di sản hay tự lập, không xác định tài sản/thời điểm.
- **Quan Lộc — limited, 3 phần/6 đoạn.** Tổ chức và giới hạn quyền quyết định; biểu đạt Bạch Hổ–Tấu Thư; suy tính ở Mệnh đến thực hiện ở Quan và tạo nguồn ở Tài. Mỗi phần có vai riêng, không lặp quyền–trách nhiệm thành nhiều chương. Chưa xác định nghề, chức vị hoặc thăng tiến.
- **Nô Bộc — limited, 3 phần/5 đoạn.** Kỳ vọng, cách biểu lộ tình cảm và nền Thiên Lương; trợ giúp thực chất dưới điều kiện bạn bè muốn giúp; tách việc hợp tác với thu lợi. Giữ sắc thái thường âm thầm giúp, không suy im lặng chứng minh thiện chí. Chưa nhận lượng từ trợ tinh VDC hoặc kết luận trợ lực khi thiếu phi hóa.
- **Thiên Di — limited, 2 phần/4 đoạn.** Sự tin phục đi cùng may rủi, đối chiếu hoàn cảnh nơi sống ở Phúc. Không dùng nét thuận để bảo đảm mọi việc bên ngoài, không chỉ định di cư.
- **Tật Ách — insufficient, 0 phần/0 đoạn luận.** Chỉ thông báo phạm vi và giới hạn y khoa. Chú giải T1 vẫn là nghiên cứu riêng, không biến thành bài sức khỏe cá nhân, không đổi lời bệnh thành stress/sức bền để lấp chỗ trống. Không sẵn sàng thử để tạo bài cá nhân; có thể kiểm trạng thái bằng mock.
- **Tài Bạch — limited, 4 phần/7 đoạn.** Cạnh tranh và tích lũy, phần tiền giữ lại, Mệnh–Quan–Tài và nhịp chi sinh hoạt. Đã dùng nhánh Liêm Thân đủ điều kiện tác giả trong input1.20; định danh Đại Hao vòng Bác Sĩ trong lời facts. Không gán loại Hao ấy cho mọi câu Sơ cấp, không tạo phép Liêm–Hao tính kết quả ròng.
- **Tử Tức — limited, 1 phần/3 đoạn.** Một nét đối đãi qua Hóa Lộc tại Nô, có thể hòa hợp. Không lấy cung trống chính tinh để phủ định hoặc mở rộng nét ấy. Chưa có luận điểm quan hệ thứ hai độc lập đủ điều kiện; chưa triển khai mượn toàn tinh hệ. Không luận số con, sinh sản hay cuộc đời con. Bài ngắn phản ánh đúng mức nguồn.
- **Phu Thê — limited, 4 phần/7 đoạn.** Nhịp quyết định, trợ giúp từng qua một giai đoạn, hoàn cảnh Hỏa tại Tuất và cách thực hiện/truyền đạt ở Quan. Đã dùng nhánh Hỏa Tuất của input1.20, giữ OR giữa hai khả năng; chuyển đoạn chỉ nêu nhánh bị loại xuống giới hạn. Chưa ghép Phá–Đà–Hỏa hoặc dùng Khoa/Tuần hóa giải.
- **Huynh Đệ — limited, 2 phần/4 đoạn.** Nét xa cách giữa anh chị em, đối chiếu mong muốn giao du tại Nô. Không chọn nguyên nhân nơi ở/cảm xúc/quan niệm; chưa dùng Tuần làm yếu tố điều chỉnh. Một nét trực tiếp không được gọi là phân tích sâu toàn cung.

Số phần/đoạn mô tả đầu ra, không phải thang chất lượng. Câu hỏi trong `scope-11.json` kế thừa bản đồ trước và giữ trạng thái trả lời một phần khi chưa đủ. Không nâng coverage bằng việc thêm một đoạn diễn đạt lại.

## 2. Biên tập và đầu vào đã đóng

Giữ `paid-retrieval-1.20.0`, guide `1.3.0`, facts `1.1.0`, prompt `paid-palaces-vietnamese-2.8.0`, schema `paid-reading-v2.0.0`. Không tăng phiên bản runtime chỉ để đánh dấu bản thảo. Phiên bản biên tập riêng: `offline-reference-20261105.1`.

Factory `paidInput`, `paidInstructions`, `paidUserInput` tạo lại 11 đầu vào và nội dung prompt đúng luồng chung. So sâu với input1.20 trước: facts/knowledge/guide/điều kiện không đổi; mỗi cung159facts. Preview request không gọi provider, không chọn model hoặc dùng key. Không thêm câu nguồn chưa rõ từ lần tra Trung văn vào input.

So với các bản cha gần nhất: 50 → 49 đoạn; phần thân 3.530 → 2.946 đơn vị tách bằng khoảng trắng. Đây chỉ là đo độ dài bản biên tập, không số token hoặc bằng chứng chất lượng. Hai luận điểm nguồn mới được khai thác ở Tài/Phu; giảm lặp lời giới hạn, bỏ dẫn nguồn không có đóng góp tại đoạn tương ứng. Giữ tần suất, đối tượng, điều kiện nếu/hay, từng giai đoạn và trình tự rồi mới.

Nhánh Liêm Thân giữ bảng tác giả riêng, không đổi Vượng engine thành Miếu. Hỏa Tuất giữ bảng riêng, không tự thêm độ sáng vào snapshot. Các nguồn nhiều tác giả ở Tài vẫn riêng trong evidence; không cộng sự đồng ý thành bằng chứng tiên đoán chắc chắn. Nô không coi một Việt/Lộc đủ nhóm trợ tinh; Tử không chuyển Cơ–Cự từ Điền thành sao tọa Tử.

[Bundle48artifact](../.local/ai-paid-offline-ready-20261105/source-bundle-manifest.json) sao đúng kho private đã kiểm, đối chiếu hash nguồn và bản sao. Bundle này là tập nguồn thư viện dùng trong lần kiểm, **không phải bộ cài đủ toàn ứng dụng**. Các knowledge khác đã có đầy đủ trong input/prompt preview. [Manifest đóng phiên bản](../.local/ai-paid-offline-ready-20261105/package-manifest.json) khóa hash các file dùng và đầu ra. Code commit không chứa sách, snapshot riêng hoặc toàn văn bản thảo; cần giữ thư mục private để tái hiện.

## 3. Kiểm thực sự đã chạy

Node24.21.0; `env -i`, không load `.env`, không key/DB URL; chặn fetch/socket/TLS trước khi import trong kiểm nội dung. Không provider/store/consumer/DB. [Harness](../.local/ai-paid-offline-ready-20261105/check.ts) dùng factory/validator hiện có, không viết evaluator nội dung thay thế.

- **11/11** input khớp bản đã kiểm; 10 limited và1 insufficient qua validator2.8. Bản cha vẫn đọc/validate bằng input đã lưu. Giữ snapshot trong bộ nhớ; không gọi đây là kiểm refresh báo cáo từ DB.
- **49 đoạn** có đối chiếu facts/knowledge riêng; metadata điều kiện, ngoại lệ và cung nguồn giữ nguyên. Serializer giữ đủ facts/knowledge; ngân sách thư viện vẫn tối đa14.000byte. Không dùng kết quả model cũ để gắn nhãn API mới.
- **18 phép thử âm bị chặn:** ID sai, thiếu neo vị trí tác giả, C nâng thành trực tiếp, D đứng riêng, nền đổi thành lời nguồn, trộn suy luận vào lời nguồn, tên sách, template, coverage/schema/ID phần sai, y khoa ở thân/tiêu đề/coverage/giới hạn, tuổi thọ và mất sắc thái giai đoạn trợ giúp.
- **4 kiểm sắc thái bản tham chiếu đạt:** Hỏa giữ hoặc; Tả giữ thường thường/giai đoạn/rồi mới; Nô giữ nếu muốn giúp; Tài ghi đúng vòng Bác Sĩ. Đây là probe biên tập của bản tham chiếu, không tuyên bố validator hiểu mọi lượng từ.
- **86/86 test sẵn có tại4file đạt:** V2, source-fidelity, editorial, context-guide. [Log](../.local/ai-paid-offline-ready-20261105/tests-run1.log). Không chạy toàn E2E/PDF hoặc kiểm DB. Không typecheck/build ứng dụng vì không đổi mã ứng dụng.
- **2.606 file cũ giữ hash** trong manifest trước phiên. Không sửa source index, bài đã lưu, bản biên tập cha hoặc snapshot. [Kết quả mock](../.local/ai-paid-offline-ready-20261105/mock-summary.json), [log cuối](../.local/ai-paid-offline-ready-20261105/mock-final.log).

### Một phép thử ngữ nghĩa vẫn mở, không tính đạt

Lượt mock đầu đã validate11bản nhưng dừng ở thử âm Nô: xóa nguồn Lộc khỏi đoạn tổng hợp mà giữ nguyên lời suy luận về Lộc. Validator2.8 vẫn nhận vì B/foundation có neo hợp lệ; cơ chế này cho phép nền đứng riêng khi đủ điều kiện cấu trúc. Nó không chứng minh từng câu trong đoạn được nguồn còn lại hỗ trợ.

Giữ [log đầu](../.local/ai-paid-offline-ready-20261105/mock-run1.log) và [mẫu thiếu căn cứ](../.local/ai-paid-offline-ready-20261105/open-semantic-probe.json); trạng thái **OPEN**, không đổi expected nguồn hoặc gọi phép thử này đạt. Bản biên tập Nô giao xem vẫn dẫn đủ nền Lương **và** nguồn Lộc, không dùng mẫu hỏng. Lượt tiếp theo hoàn tất kiểm còn lại và báo lỗi ngữ nghĩa riêng. Đây là lý do phải đọc toàn văn đầu ra thật và đối chiếu từng tiền đề; không thể coi validator xanh là chứng nhận chuyên môn. Chưa nới hoặc đổi validator/runtime trong lô offline.

### Bản đọc mobile riêng

Dùng `PaidReadingContent` hiện hành để render tĩnh 11 mục; không đưa JSON thô cho người đọc. Bộ preview dùng adapter nút căn cứ cho HTML tĩnh, không phải phiên React đã hydrate trên QA. [Kết quả360/390](../.local/ai-paid-offline-ready-20261105/mobile-summary.json); ảnh [Tài360](../.local/ai-paid-offline-ready-20261105/tai-360.png), [Tài390](../.local/ai-paid-offline-ready-20261105/tai-390.png), [Phu390](../.local/ai-paid-offline-ready-20261105/phu-390.png), [Tật390](../.local/ai-paid-offline-ready-20261105/tat-390.png).

Lỗi đầu: Chrome không khởi động được trong sandbox; chạy lại headless bằng profile tạm ngoài sandbox. Lượt2 phát hiện scaffold preview cũ tìm `summary`, trong khi renderer hiện tại dùng `button`; sửa riêng adapter preview, không sửa component ứng dụng. Lượt cuối kiểm49đoạn/11mục, căn cứ, không tràn360/390 và reload file tĩnh. HTTP/HTTPS bị chặn; không gọi API, không xác minh phiên sở hữu/quyền qua phép thử này.

## Điểm dừng, phần sẵn sàng thử và chặn nghiệm thu

**Sẵn sàng chuẩn bị phép thử model có giới hạn:** 10 bài limited có đầu vào đóng phiên bản và bản đối chiếu; nên ưu tiên Tài để đánh giá cách thu–giữ–chi/liên cung, hoặc Phu để kiểm sắc thái nguồn. Tử/Huynh chỉ thử trong phạm vi hẹp đã nêu, không dùng chúng để chứng minh độ sâu toàn cung. Tật không được đưa vào lượt tạo bài cá nhân. Chưa có quyền API mới, chưa kiểm model/credit/dự toán phiên này.

Ba nhóm còn chặn nghiệm thu thương mại:

1. **Đầu ra thật chưa chứng minh chất lượng phiên bản này.** Bản biên tập không bảo đảm model sẽ viết đạt; đặc biệt phải kiểm từng nhận định có đúng nguồn, không trộn attribution hoặc lặp văn. Phép thử Nô nêu trên là một điểm bắt buộc trong review toàn văn.
2. **Phạm vi sản phẩm chưa được chốt.** Tật chưa có bài cá nhân; Tử/Huynh và một số cung nguồn hẹp không thể hứa cùng độ sâu. Ba điều kiện Trung văn còn mở giữ ngoài bài, không model tự điền. Chủ dự án trước đó chưa chấp nhận mô tả10cung có giới hạn/Tật chỉ trạng thái; không tự sửa offer, giá hoặc chính sách.
3. **Runtime dùng để thử/triển khai chưa đồng bộ bộ này.** Quan sát chỉ đọc: QA3118 PID74791, cwd `.local/qa-paid-current-20261103/checkout`, code retrieval1.14/guide1.0. Đây không phải runtime1.20. Lần thử sau phải có checkout/DB riêng, nguồn/hash đúng và quyền API hữu hạn; chưa thực hiện bước đó trong phiên này. QA3062/3070 nguyên, không worker/restart/migration.

Checklist hồ sơ cũ vẫn Phụ90%, Phúc90%, Điền90%, Quan90%, Nô90%, Di90%, Tật90%, Tài90%, Tử90%, Phu90%, Huynh90%; không phải phần trăm chất lượng hoặc sẵn sàng thu phí. Ba bước offline hoàn tất trong phạm vi trên không tự nâng P09 hay chứng nhận thương mại. **Kết luận phát hành: CHƯA ĐẠT.** 0CREATE/0GET model, $0 API; dừng ở bản đối chiếu và bộ đầu vào offline, giữ toàn bộ bài cũ.
