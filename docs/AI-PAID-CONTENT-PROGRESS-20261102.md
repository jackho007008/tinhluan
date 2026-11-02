# Hoàn thiện nội dung và mốc theo dõi tiến độ — 02/11/2026

Baseline `main@f84e9dc`, tracked/index sạch; chỉ `buu-dinh-7parts/`, `docs/handoff/` chưa theo dõi, giữ nguyên. Lượt hữu hạn: một nguồn Tài có ích, ràng buộc chọn đúng nguồn, bốn bản biên tập mock và mốc đo tiến độ. **0CREATE/0GET OpenAI,0USD**, không DB/consumer/supervisor, không QA3062/3070, không sửa bài lưu/MệnhV1-Luna/thanh toán/quyền/engine.

## Nguồn Tài mới và điều kiện

Nguồn **Nguyễn Anh Vũ — Trung Châu Tử Vi Đẩu Số, Tứ Hóa Phái2, PDF/in218, §2.5.3, Cung tài bạch có Liêm Trinh** đặt nhánh Liêm độc tọa Thân cạnh Tử Vi, Thiên Phủ, Vũ Khúc ở tam phương, gợi khuynh hướng công việc trong lĩnh vực tài chính, tiền tệ. Đây là nghĩa nền về ngữ cảnh nghề nghiệp từ Tài, **không lời đảm bảo thu nhập, chọn nghề, đầu tư hoặc phép Liêm–Đại Hao**.

Đọc đúng phần chữ đã xử lý và kiểm **ảnh218 sẵn có** do phát hiện chi bất thường: cả OCR và bản in đều ghi “Sửu hoặc Thân”. Giữ nguyên lỗi/bất nhất Sửu, không sửa thành Dần hoặc áp nhánh Sửu. Chỉ chọn vế Thân rõ ràng. Không đọc lại PDF/toàn sách, không sửa nguyên bản hoặc Bửu Đình. Không nhận đã hiệu đính cả chương; source-reviewed là Codex rà đoạn, không chứng nhận ngoài dự án.

Đơn vị `paid-library.thp2-tai-liem-than-trine` là **B/reference-only/foundation**. Điều kiện cùng đạt: Liêm **duy nhất** tại Tài **Thân**, Vũ Khúc và Thiên Phủ tại Mệnh, Tử Vi tại Quan — đúng tam phương trên snapshot. Bộ chọn hẹp hơn mọi bố cục mà lời sách có thể nói; không suy rộng ra Dần hoặc các nơi khác. Phần dẫn nhập về nghề văn có ngoại lệ Kình/Đà/Hỏa/Linh chưa được giải, nên không dùng lời nghề văn. Các nhánh Liêm–Tướng/Phủ/Sát/Phá/Tham ở cùng trang không bị lấy lẫn.

Phần tổng hợp trong mock phân biệt câu hỏi về cạnh tranh/tạo nguồn, góc nhìn nghề nghiệp từ tam phương và cách tổ chức ở Quan Lộc. Không lấy tác giả này sửa hoặc xóa lời tác giả khác. Chưa có căn cứ phối hợp Liêm–Hao; không giả vờ nguồn nghề nghiệp đã lấp được khoảng ấy.

## Code và tương thích

Retrieval **paid-retrieval-1.7.0**, prompt2.5/ReadingV2 không đổi. Loader ưu tiên index-v17 → index-v16 → index.json khi file mới không có; file mới tồn tại nhưng sai schema/hash phải fail closed. **Hai index cũ giữ nguyên byte,11đơn vị cũ nguyên**, index mới12đơn vị. Không đổi input/attempt/bài lịch sử khi đọc hoặc GET.

Thêm metadata `palaceConditions` có điều kiện chi và chính tinh duy nhất, dùng facts đã lưu; không an sao, chấm điểm hoặc tạo rule luận đoán. Phải có location đúng path và đủ dữ kiện chính tinh. Một sao phụ không phá “độc tọa”; **một chính tinh thứ hai, kể cả chưa verified, không được coi là vắng**. Thiếu nhóm majorStars phải loại. FactIDs của sao điều kiện và vị trí đều được giữ trong anchor, không chỉ kiểm rồi làm mất dấu vết. Giữ library4/14KB, A12/B10/C8/D3.

Kho private có bản sao đủ3index +15trang chữ/OCR +ảnh218: **19artifact**. [Manifest/hash](../.local/ai-paid-content-progress-20261102/source-bundle-manifest.json), [bảo toàn8kết quả cũ và index](../.local/ai-paid-content-progress-20261102/preservation.json). Không đóng sách vàoGit; bản sao cùng máy/volume, không backup ngoài máy hoặc bằng chứng deploy. Cần cả code và kho private đúng hash khi được phép triển khai sau này.

## Bốn bản biên tập mock

Không ghi vào báo cáo khách, không giả là model đã tạo. Mỗi bản có JSON input/knowledge/prompt/paragraph/basis/factIds/knowledgeIds trong cùng thư mục.

- **Nô:**2phần,3đoạn. Từ Lộc tại Nô, phát triển kỳ vọng đối đãi và phân biệt cảm tình với biểu hiện hợp tác/thu lợi. Không suy chất lượng Thiên Lương hãm hoặc Lương–Lộc khi chưa có nguồn. [Toàn văn mock](../.local/ai-paid-content-progress-20261102/Nô-Bộc-proposed.mock.md).
- **Tử:**1phần,2đoạn. Giữ lời cục bộ từ cách Khâm Thiên đọc Lộc tại Nô như biểu hiện của Tử, đúng vị trí sao và chủ thể. Không lấy chi tiêu/giao du làm đặc tính con. Bài ngắn vì nền mỏng, không ép chương. [Toàn văn mock](../.local/ai-paid-content-progress-20261102/Tử-Nữ-proposed.mock.md).
- **Phu:**2phần,5đoạn. Phá và hai nhịp quyết định trong ví dụ MệnhVũ–Phủ/PhuPhá; trợ giúp từng qua một giai đoạn, khác biệt quan niệm và Khoa nam mệnh được giữ riêng. Không gán phép nối cho nguồn hoặc dự báo hôn nhân. [Toàn văn mock](../.local/ai-paid-content-progress-20261102/Phu-Thê-proposed.mock.md).
- **Tài:**3phần,5đoạn. Cạnh tranh/tạo nguồn; ngữ cảnh tam phương và lời Quan; chi ngoài công việc so với xuất vốn. Không hứa nghề/tiền hoặc chế hóa Liêm–Hao. [Toàn văn mock](../.local/ai-paid-content-progress-20261102/Tài-Bạch-proposed.mock.md).

**Bốn bản đều limited và qua validator2.5.** Số phần không phải điểm chất lượng. Giới hạn chung gom cuối bài, điều kiện riêng đặt sát nhận định. Đây là đề xuất biên tập thủ công để làm rõ hướng viết, chưa chứng minh Astra sẽ tái hiện được.

## Kiểm đã chạy

- **131/131 pure test,7file**: library, topic-sources, context-guide, editorial, V2/provider mock, safety, adapter. Có độc tọa/chi, sao thứ hai chưa verified, thiếu location/majorStars, anchor, v17/legacy/invalid và các guard cũ. Không API/DB thật; SDK chỉ fetch mock.
- Dry cả **11cung**,159facts/cung, đối chiếu packet từ snapshot đã lưu, không template chưa resolve. Nô/Tử/Phu/Tài vẫn3/1/3/3nguồn direct; Tài thêm1foundation, không tự tăng coverage. Bỏ riêng từng tiền đề Liêm/Vũ/Phủ/Tử trên bản sao đều loại nguồn mới. [Dry summary11cung và probes](../.local/ai-paid-content-progress-20261102/dry-summary.json).
- **Tám kết quả thật cũ giữ hash**, không sửa hoặc retry. Đọc lại toàn văn Quan2.2/Phúc2.1 để ghi trạng thái hồ sơ, không gọi đó là bài cấu hình mới. Prompt cũ giữ byte.
- Typecheck/build Node24 cách ly/key rỗng/AI tắt/DBcổng1 đạt;607file, BUILD_ID `7g5yKpsaiKG2N_bxBQgsa`. [Test](../.local/ai-paid-content-progress-20261102/tests-final.log), [typecheck](../.local/ai-paid-content-progress-20261102/typecheck-final.log), [build](../.local/ai-paid-content-progress-20261102/build-final.log).
- Test không có lượt fail. Sau review bổ sung anchor của chính tinh trong ràng buộc độc tọa, chạy lại131test và build/typecheck cuối; không sửa expected nguồn/historical. Không DBintegration/E2E/PDF/browser/mobile mới vì không đổi UI/store/quyền. Không chạy consumer hoặc queued job.

## Cách báo % từ phiên này

Theo yêu cầu chủ dự án, sau mỗi phiên cập nhật [mốc tiến độ từng cung](AI-PAID-CONTENT-PROGRESS.json), kèm bằng chứng và phần chưa kiểm. **Đây là % hồ sơ kiểm/biên tập trên mẫu QA đang theo dõi**, không điểm chất lượng, độ đúng Tử Vi, tỷ lệ bao phủ mọi lá số hoặc % được phép phát hành. Đánh giá nguồn mỏng vẫn có thể hoàn tất một số việc hồ sơ; không có nghĩa nguồn đã đủ sâu.

Mẫu số cố định10mục, mỗi mục10điểm: P01snapshot/facts; P02retrieval điều kiện/phân vai; P03khai phạm vi; P04đề cương/bản luận truy vết; P05phối hợp/điều chỉnh đủ chiều sâu; P06liên cung có lập luận; P07tách nguồn–AI/giữ sắc thái; P08an toàn/không bịa; P09Astra hiện hành đạt đánh giá thực; P10tương thích quyền/lưu/mở đã kiểm. Chỉ `passed` tính điểm; `partial`/`not-verified` tính0. Điều kiện và evidence từng ô nằm trongJSON, không coi cộng nguồn hoặc chạy thêm test là tự tăng điểm.

Mốc đầu tiên, chưa có % phiên trước để báo tăng/giảm:

- **Nô70%, Tử70%**:7/10mục; P05/P06/P09 chưa đạt.
- **Phu80%, Tài80%**:8/10mục; P05/P09 chưa đạt.
- **Quan80%, Phúc80%**:8/10mục dựa bài thật cũ đã đọc, **không phải đã thử cấu hình hiện hành**; P05/P09 chưa đạt.
- **Phụ40%, Điền40%, Di40%, Huynh40%, Tật40%**:4/10mục nền tảng/phạm vi; chưa rà bản luận đầy đủ trong phiên này, không tự cho điểm phần ấy. Tật chỉ chú giải cấu trúc/insufficient, không bài sức khỏe cá nhân.

**P05 vàP09 là điểm chặn quan trọng dù hồ sơ đạt80%.** Năm mục chưa kiểm ở một cung không tự chứng minh cung ấy kém hơn một cung được rà nhiều hơn. Checklist có trọng số ngang nhau để theo dõi công việc, không đo mức tác động của lỗi. Thay tiêu chí phải tạo version/giải thích, không âm thầm đổi mẫu số để tăng %. Không dùng chỉ số này trên UI tiến trình khách hàng; X/11 vẫn dựa completed thực. Mệnh miễn phí V1/Luna ngoài bảng này, giữ nguyên.

## Điểm dừng

Đã cải thiện nền liên hệ Tài và bản đề xuất bốn cung; chưa có bài model mới. Vẫn thiếu chiều sâu nguồn/phối hợp Lương–Lộc, nền TửVCD toàn diện, Phá–Đà–Hỏa và Liêm–Hao trong phần kho đã rà; không tuyên bố hết kho hoặc tái mở469rule. Không tự gọi API hoặc cập nhật QA3062/3070. Chưa đạt nghiệm thu thương mại11cung.
