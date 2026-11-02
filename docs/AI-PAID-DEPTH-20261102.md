# Biên luận bốn cung: giữ tiền đề và dùng ngữ cảnh đúng vai

02/11/2026, baseline `main@1fa79a3`. Đã kiểm Git sau gián đoạn: không có thay đổi tracked/index dở dang; giữ `buu-dinh-7parts/`, `docs/handoff/`. Lô hữu hạn gồm guide Nô/Tử, neo facts cho nguồn, prompt2.6, bốn bản biên tập mock và cập nhật checklist. **0CREATE/0GET OpenAI thật,0USD**; không DB/worker/supervisor hoặc cập nhật QA3062/3070.

## Điểm thiếu đã xử lý

Trước lượt này, packet đã có C từ Huynh/Phụ nhưng guide chỉ hỗ trợ Quan/Tài. Các mock Nô/Tử mới chủ yếu phân biệt chủ thể, chưa sử dụng hai tiền đề liên cung cụ thể. Ngoài ra, nguồn Tử theo cách Khâm Thiên phụ thuộc **Lộc tại Nô**, nhưng chưa có metadata buộc đoạn dẫn nguồn giữ chính fact điều kiện ấy; chỉ dẫn một sao bất kỳ ở Tử vẫn có thể qua kiểm tham chiếu cũ. Đây là khoảng thiếu truy vết, không thiếu sao engine.

- **Nô–Huynh:** guide chỉ được tạo khi có lời trực tiếp tại Nô, C phù hợp tại Huynh và quan hệ xung chiếu đã xác minh. Mock mới đối chiếu kỳ vọng giao du/đối đãi với mặt xa cách trong lời Huynh, giải thích sự đáp lại đang được xét trên hai mạng quan hệ khác nhau. Không dùng Lộc ở Nô để phủ Huynh hoặc nói bạn bè thay anh chị em.
- **Tử–Phụ:** guide giữ vai mệnh tạo là người con trong lời Phụ, một phía trong quan hệ với con trong lời Tử. Mock đối chiếu điều kiện vật chất và hòa thuận của thế hệ trước với lời đối đãi cục bộ ở Tử. Không suy truyền tính cách, lặp lại/xóa bỏ bất hòa hoặc kết quả nuôi dạy. Lộc vẫn tại Nô, không chuyển sang Tử.
- **Phu:** viết lại đoạn tổng hợp Phá/Tả thành hai tầng nhịp hành động và cách nhìn nhận mục tiêu; giữ trợ giúp từng qua một giai đoạn, Khoa nam mệnh riêng. Không dùng Khoa giải Phá–Đà–Hỏa hoặc giải nghĩa người phối ngẫu thực.
- **Tài:** bỏ câu tự bình phẩm “bài có nhiều tầng”. Đoạn mới giải thích góc gợi nghề từ tam phương có thể được đọc cạnh cạnh tranh/tạo nguồn mà không triệt nhau; tổ chức ở Quan là phương diện thực hiện. Không dùng hướng nghề để bảo đảm tiền bạc, không thêm phép Liêm–Hao.

## Nguồn và phạm vi

Tái dùng **nguyên các đoạn đã chọn**, không thêm đơn vị thư viện hoặc sửa index/catalog. Đọc phần chữ đã xử lý Tân Biên126§5.2.5,218§15.2.3 và giới hạn131§5.2.30; tái dùng Trung Châu Tứ Hóa Phái1/PDF128–130, nhất là ý(12), cùng các phiếu Phu/Tài đã có. Không PDF/ảnh mới, không rà toàn sách hoặc Bửu Đình.

Lời Nhật–Nguyệt tại Phụ giữ cả hai mặt khá giả và hai thân bất hòa/khó ở gần con, không lấy mặt tiền bạc thay mặt quan hệ. Lời Thiên Đồng tại Huynh được dùng ở phạm vi diễn ý xa cách đã có; không xuất các vế số người/phẩm hạnh trong câu gốc, không kể lại chuyện tuổi thơ như sự kiện. C vẫn là C của cung gốc, không nâng thành lời trực tiếp Nô/Tử. Hai tác giả/quan điểm không bị gộp thành một quy luật gia đình mới.

## Triển khai

**Retrieval1.8.0:** `paidTopicBooks` xuất thêm `anchorFactIds` cho bốn nhóm đoạn có tiền đề rõ: Lộc tại Nô; gợi ý Sát/Tham/Phá tọa Phu; lời Tử từ Lộc tại Nô; Khoa tại Tử. Phiên bản bộ trích1.1.0 chỉ phản ánh metadata mới, không sách mới. Guide mang cả các neo này, kể cả fact thuộc cung khác; không chỉ chọn sao thuận tiện ở cung mục tiêu. Thiếu neo, thiếu direct/C hoặc quan hệ phù hợp thì không tạo guide.

**Prompt `paid-palaces-vietnamese-2.6.0`:** thay khối hướng dẫn phát triển luận điểm của2.5 bằng khối ngắn về tiền đề/câu hỏi/đóng góp của tổng hợp và hai loại quan hệ gia đình. Không nối thêm nguyên khối cũ trùng lặp; giữ cảnh báo tài liệu trích là dữ liệu, hierarchy nguồn, an toàn, giữ lượng từ/thời gian, không chế hóa và V2 linh hoạt. Cấm tự bình phẩm độ sâu của chính bài. WriterV2 vẫn opt-in; writerV1 mặc định không đổi, model purpose vẫnAstra. Không sửa PAID_EDITION, quyền hoặc offer.

**Validator:** chỉ prompt2.6 kiểm thêm neo nguồn mới, báo `AI_REFERENCE_SCOPE` khi thiếu/sai/neo rỗng. Không tự sửa text, chuyển basis hoặc retry.2.5 và mọi prompt cũ giữ đúng hàm/validator; SDK CREATE/GET đọc theo phiên bản job/attempt đã lưu. Schema `paid-reading-v2.0.0`, JSONB, UI và queue không đổi, không migration. Việc neo đúng chỉ kiểm khả năng áp dụng/tham chiếu, **không chứng minh toàn bộ câu văn được nguồn hỗ trợ**.

## Bốn bản mock mới

Đây là **biên tập thủ công để kiểm lập luận/contract**, không kết quả model hoặc bài khách hàng; không ghi đè các bản mock hay bài thật cũ.

- [Nô: ba phần, năm đoạn](../.local/ai-paid-depth-20261102/Nô-Bộc-proposed.mock.md): thêm source paragraph Huynh và paragraph ai-synthesis đối chiếu với Nô.
- [Tử: hai phần, bốn đoạn](../.local/ai-paid-depth-20261102/Tử-Nữ-proposed.mock.md): thêm source paragraph Phụ và paragraph ai-synthesis phân biệt thế hệ/vai.
- [Phu: hai phần, năm đoạn](../.local/ai-paid-depth-20261102/Phu-Thê-proposed.mock.md): tổng hợp hai tầng của trao đổi, giữ thời gian trợ giúp.
- [Tài: ba phần, năm đoạn](../.local/ai-paid-depth-20261102/Tài-Bạch-proposed.mock.md): thay lời tự nhận độ sâu bằng phân tích tiến trình/nghề/tổ chức.

Tất cả `limited`, qua validator2.6 và không có cảnh báo bỏ ngữ cảnh phù hợp. JSON cùng thư mục giữ input/instructions/content/basis/IDs. Nguồn C và tiền đề trực tiếp được tách paragraph, không gán phép nối của AI cho tác giả. Không lấy số phần hoặc độ dài làm điểm chất lượng.

## Kiểm thực chạy

- **150/150 pure test,8file**: premise/context, topic-sources, context-guide, editorial, V2/provider mock, safety, adapter, library. Có 11outputmock theo writer mới; Nô–Huynh xung/Tử–Phụ tam hợp; giữ natal.Lộc tạiNô; thiếu direct/C/neo không có guide; thiếu neo bị từ chối cả source-interpretation/ai-synthesis; C origin, thời gian, y khoa và saved-version SDK giữ nguyên.
- Mở rộng fixture sinh mock kỹ thuật để dẫn đủ các neo của nguồn được chọn; không sửa snapshot/expected sách/bài lịch sử cho xanh. DBtest chỉ đổi import writer hiện hành, **không chạy DB trong phiên này**.
- Dry11cung vẫn159facts; sourceIDs/text/conditions/limits/references của bốn cung nguyên, direct vẫn3/1/3/3. Source indices/pages/images19artifact giữ hash. Tám bài thật cũ được đọc đúng savedversion và giữ hash. [Audit](../.local/ai-paid-depth-20261102/preservation.json), [dry](../.local/ai-paid-depth-20261102/dry-summary.json).
- Prompt2.6 tăng **300byte** so với2.5 trên từng cung mẫu, không phải tăng nguyên một khối dài; không gọi tokenizer/provider để đo. Byte là proxy kích thước, không token/chi phí thật. Guide/metadata chỉ thêm IDs, không chép lại kho chữ. Các cap A/B/C/D và thư viện giữ nguyên.
- Typecheck/build Node24 cách ly/key rỗng/AI tắt/DBcổng1 đạt,610file; BUILD_ID `4H2X2_Yn5gZ-93nOgU2I9`. [Test](../.local/ai-paid-depth-20261102/tests-final.log), [typecheck](../.local/ai-paid-depth-20261102/typecheck-final.log), [build](../.local/ai-paid-depth-20261102/build-final.log). Không lượt test fail; kiểm cuối sau khi thay khối prompt để giảm trùng lặp. Không E2E/PDF/browser/mobile hoặc runtimeDB mới.

Tham khảo [OpenAI Docs về chỉ dẫn và eval](https://developers.openai.com/api/docs/guides/prompt-engineering) cho cách tổ chức prompt/kiểm; tài liệu đó không xác nhận chuyên môn Tử Vi. Không gọi Models/Responses API.

## % sau phiên — không đổi checklist

Giữ `paid-content-progress-1.0.0`,10mục/trọng số/mẫu số như trước. [Dữ liệu từng ô và lịch sử thay đổi](AI-PAID-CONTENT-PROGRESS.json).

- **Nô70→80%, Tử70→80%:** chỉ P06 từpartial sangpassed, vì đã có hai tiền đề liên cung, giải thích lý do đọc chung và giữ đúng chủ thể; có đoạn mock, fact/knowledge mapping và kiểm tương ứng. Không cộng điểm chỉ vì thêm guide.
- **Phu80%, Tài80%:** đoạn tổng hợp tốt hơn trong phạm vi hẹp, nhưng P05chiều sâu phối hợp/điều chỉnh vàP09Astra hiện hành vẫn chưa đạt; không tự tăng điểm.
- **Quan80%, Phúc80%:** giữ mốc trước, không có bài mới trong lượt này.
- **Phụ40%, Điền40%, Di40%, Huynh40%, Tật40%:** giữ mốc trước, không tự cộng phần chưa rà.

Đây là % **hồ sơ kiểm/biên tập trên mẫu QA**, không độ chính xác, độ phủ mọi lá số hoặc mức sẵn sàng mở bán. Mệnh V1/Luna giữ nguyên và ngoài bảngAI11cung. Không đưa chỉ số hồ sơ vào progress khách hàng X/11.

**Còn chặn:** chưa giải nguồn/chiều sâu Lương–Lộc, TửVCD toàn diện, Phá–Đà–Hỏa và Liêm–Hao; chưa kiểm chất lượng Astra của retrieval1.8/prompt2.6. Không gọi thêm API để lấy điểm. Chưa đạt phát hành thương mại; dừng đúng phạm vi mock và không cập nhật QA3062/3070.
