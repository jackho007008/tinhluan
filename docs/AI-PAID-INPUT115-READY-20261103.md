# Đầu vào 1.15 — chuẩn bị phép thử model có giới hạn

Baseline `main@fd0dd14`, tracked/index sạch; giữ `buu-dinh-7parts/` và `docs/handoff/`. Chủ dự án yêu cầu tiếp tục tra cứu/hoàn thiện để có thể thử model thật. Lô này **không gọi model**, không tự dùng lại quyền11CREATE đã hết, không deploy QA3062/3070 hoặc chạy worker/queue. Mệnh V1/Luna, bài/quyền/lịch sử giữ nguyên.

## Phần đã làm cụ thể

Đưa cách khai thác nguồn của [bộ biên tập mới](AI-PAID-TEN-READINGS-DEPTH-20261103.md) vào factory đầu vào dùng chung: **retrieval `paid-retrieval-1.15.0`, guide `paid-context-guide-1.1.0`**. Prompt vẫn2.8, schema ReadingV2 giữ nguyên. Không thêm pipeline, rule luận sao, unit nguồn, migration hoặc mẫu lời theo reportID/ngày sinh.

- Nhãn `action` cũ bao gồm cả lời tài lộc và âm dương, chưa đủ phân biệt suy xét/hành động. Thứ tự C mới ưu tiên đoạn thực có về suy tính, giải quyết việc khó, tổ chức/hành động, học hỏi khi nguồn gốc là Mệnh và đích là Quan/Tài. Đây chỉ là mức liên quan biên tập của văn nguồn đã khớp điều kiện, **không điểm Tử Vi hoặc bằng chứng một lời đúng hơn**.
- Ưu tiên phương diện không cho đoạn phương pháp chen lên chỉ vì có chữ hành động. Giữ nguyên đa dạng cung gốc, trầnC8 và ngân sách byte cũ; không cắt điều kiện/ngoại lệ để vừa. Không bắt đủ ba đoạn khi chỉ hai đoạn phù hợp vừa ngân sách.
- Guide chọn tối đa3nguồn từ C đã vào packet; giữ ID, nguồn gốc, geometry và mọi neo cần thiết. Quan/Tài ưu tiên suy xét/hành động thực có ở Mệnh. Các source chưa chọn vào packet không được guide tự kéo vào.
- Guide Phu giải thích khác nhau giữa sắp xếp việc, trình bày để hiểu và đồng thuận mục tiêu; chỉ giữ sắc thái trợ giúp/giai đoạn khi nguồn thực có. Guide Nô phân biệt cảm tình/kỳ vọng, hợp tác và thu lợi, không bỏ điều kiện phi hóa. Guide Tử phân biệt chủ thể quan hệ với phẩm chất con, không suy truyền đời hoặc mượn sao cho VCD.
- Tất cả nội dung guide là hướng dẫn tổ chức lập luận, **không một nhận định mới có nguồn riêng**. Lời nguồn và tổng hợp tiếp tục tách basis; không đưa tên sách vào thân bài khách.

Hướng này phù hợp nguyên tắc cung cấp ngữ cảnh liên quan và kiểm đánh giá của [OpenAI Docs](https://developers.openai.com/api/docs/guides/prompt-engineering); tài liệu API không phải chứng cứ chuyên môn Tử Vi hoặc bảo đảm chất lượng đầu ra.

## Tra nguồn: đã có gì, chưa đủ điều kiện gì

[Năm nhóm phiếu, đường dẫn/trang/hash](../.local/ai-paid-input-ready115-20261103/source-review.json). Chỉ đọc đoạn đã xử lý, không PDF/ảnh mới hoặc Bửu Đình.

1. **Nô — Tân Biên170:** bảng có điều kiện cả Mệnh, Nô và trạng thái hai phía. Chưa có phép hợp nhất bảng được khóa cho Mệnh Vũ–Phủ của mẫu; không lấy riêng nhãn Lương hãm rồi gán phẩm chất bạn bè.
2. **Tử — Tân Biên200–201:** những nhánh đã kiểm là lời theo chính tinh/cặp chính tinh tại Tử. Mẫu Tử trống chính tinh không được nhận nhánh bằng cách lấy Cơ–Cự ở Điền làm sao tọa Tử.
3. **Nô/Tử — Tứ Hóa Phái1,129–130:** nguồn thật sự phân biệt cảm tình, trợ giúp cần phi hóa, biểu hiện hợp tác và kết quả cần phối hợp; ý(12) về quan hệ với con khác lời thu lợi. Các đoạn này đã có trong input; nay guide hướng model dùng đúng sự phân biệt ấy, không sinh dữ kiện phi hóa.
4. **Phu — Tứ Hóa Phái2,178–179:** giữ phần nhiều, gợi ý đơn lẻ và hai phía Vũ–Phủ/Phá; câu sau có nhánh sát tụ/Thiên La Địa Võng chưa được giải. Không có quyền ghép thành phép Phá–Đà–Hỏa hoặc kết luận hôn nhân.
5. **Tài — Tân Biên190/195:** Liêm độc Dần/Thân nói cách tạo nguồn; Song Hao là nhóm có nhánh. Không có phép cộng trừ thành kết quả ròng Liêm–Đại Hao, không đổi trạng thái để hợp bảng khác.

**Không nhận nguồn trực tiếp mới chỉ để tăng số lượng.** Tật kế thừa [chín phiếu đã rà](AI-PAID-TEN-READINGS-DEPTH-20261103.md#tật-ách-chín-phiếu-rà-nguồnphạm-vi): giới hạn chủ đề, thời điểm, lượng từ/nhóm và provenance còn nguyên. Không đọc lại các trang ấy chỉ để tạo nhật ký mới, không publishT1. Không cần yêu cầu chủ dự án bổ sung sách một cách chung chung; các khoảng thiếu phải được giữ đúng thay vì gán là do chưa có toàn văn.

## Packet trước/sau trên đúng snapshot QA

[So sánh đầy đủ](../.local/ai-paid-input-ready115-20261103/dry-summary.json) · [Script](../.local/ai-paid-input-ready115-20261103/dry.ts) · [Log](../.local/ai-paid-input-ready115-20261103/dry-final.log).

- Cả11cung giữ **159facts** và toàn bộ nguồn trực tiếp/điều kiện cũ. Snapshot không sửa; nguồn có cùng ID giữ nguyên cả object, không chỉ phần text. Không template chưa resolve.
- **Quan:** packet vẫn cùng tập nguồn; guide Mệnh thay đoạn tài lộc chung `0-1` bằng đoạn Thiên Phủ suy xét `0-3`, giữ hành động `0-2` và học hỏi `0-0`. Không đưa lời Mệnh thành sao tọa Quan.
- **Tài:** packet C thay đúng `paid-v1.natal-paragraph-0-1` bằng `paid-v1.natal-paragraph-0-3`; guide Mệnh ưu tiên `0-3`,`0-2`. Không ép đoạn học hỏi thứ3 nếu không vừa byte; các source trực tiếp Liêm/chi ngoài công việc giữ nguyên.
- **Phu/Nô/Tử:** nguồn không đổi; focus guide rõ hơn như trên. Sáu cung khác không đổi tập nguồn; Tật vẫn0A/Bdirect và `insufficient`0section.
- Ngân sách C không tăng; toàn input trên mẫu tăng cục bộ do hướng dẫn rõ hơn, dưới1KB/cung ở các cung đã sửa. Đây là số byte thực, không token hoặc phép đo chi phí API.
- **10bản biên tập limited** vẫn qua validator với input1.15, không cần sửa hoặc ghi đè chúng. Mọi hướng dẫn/prompt2.7 cũ tái tạo từ savedinput giống nguyên request cũ; **120file** bài/input/receipt/nguồn/bản thảo giữ hash. Không gọi factory mới để thay savedinput khi GET hoặc mở bài cũ.

## Kiểm đã chạy và giới hạn

**220/220 test ở11file đạt**, gồm chọn C/guide, adapter, library/web-source, nguồn/sắc thái, foundation, schemaV2, y khoa và biên tập. Sau khi làm rõ thêm chữ nếu nguồn Phu có nêu, kiểm lại riêng guide và dry11; không chạy lại toànE2E/PDF hoặc DB. [Suite](../.local/ai-paid-input-ready115-20261103/tests-verified.log) · [Guide cuối](../.local/ai-paid-input-ready115-20261103/tests-guide-last.log).

Giữ log lỗi đầu: lần1, hai assertion mới phát hiện themeaction quá rộng, không phân được đoạn tài lộc; sửa thứ tự nội dung thực. Lần2, assertion đòi3đoạn không đúng trần byte khiến Tài chỉ có2đoạn phù hợp; giữ expected quan trọng là có ThiênPhủ/không lấy lời tài lộc thay suy xét, đổi ràng buộc số lượng về1–3 đúng contract. Dry tiếp phát hiện method-gloss nhắc hành động bị nâng ưu tiên; sửa thứ tự và thêm test hồi quy riêng, không bỏ nguồn/expected để tăng độ phủ. Script ghi phiếu đầu thiếu thư mục pages bị chặn trước ghi, sửa đúng đường dẫn. Không nới validator/source/medical guard.

Typecheck và build trong snapshot riêng đạt; có typecheck lại sau format, build cuối có kiểm type. [Build cuối](../.local/ai-paid-input-ready115-20261103/build-verified.log) · [Identity](../.local/ai-paid-input-ready115-20261103/build-identity-verified.json). Key rỗng/AI tắt/DBcổng1/fetch bị chặn, không sửa `.next` của web đang phục vụ. Không UI change nên không chạy lại mobile; [preview360/390 trước](AI-PAID-TEN-READINGS-DEPTH-20261103.md) không được gọi là smoke runtime mới.

**0 OpenAI CREATE/GET,0USD API,0DB/queue/worker/supervisor/deploy.** Không kiểm lại credit hoặc quyền model trong vòng không tính phí này. Mệnh miễn phí, bài cũ, quyền/offer/engine và QA3062/3070 giữ nguyên.

## Đã đủ để thử model chưa?

**Có thể chuẩn bị một phép thử limited có mục tiêu rõ cho Tài Bạch**, dùng input1.15/prompt2.8 trên QA mới cách ly, sau quyền gọi API và dự toán riêng. Lý do là tiền đề trực tiếp, nghĩa Hao có giới hạn, nghĩa nền biểu đạt và ngữ cảnh Mệnh/Quan đã được rà; bản biên tập cho thấy có thể xây lập luận trong phạm vi ấy. Không đợi một câu nguyên văn cho mọi tổ hợp, cũng không nhận nó đã được giải. Quan/Phu có thể là đối chứng sau; không đề nghị gọi đồng loạt10/11bài để tìm bài đẹp.

Tiêu chí phép thử: giải thích rõ tạo/giữ/chi; dùng Thiên Phủ ở Mệnh và Quan đúng vai; phân biệt tổng hợp với lời nguồn; giữ nhịp chi theo từng đợt; không bịa Liêm–Hao, không tên sách, không lặp ý. Cần đọc toàn văn thực tế mới biết model có làm được hay không. Không mặc định pass vì schema hợp lệ.

Nô/Tử và các cung chỉ có một nét trực tiếp vẫn cần đánh giá bài ngắn đúng phạm vi, không hứa sâu đồng đều. Tật chưa đủ cho phép thử bài cá nhân trả phí; chỉ có thể kiểm trạng thái giới hạn như hiện tại. Phép thử chất lượng không cần chốt lời quảng cáo trước, nhưng không tự chứng nhận hoặc mở rộng phạm vi thương mại.

Checklist **Phụ Mẫu90%,Phúc Đức90%,Điền Trạch90%,Quan Lộc90%,Nô Bộc90%,Thiên Di90%,Tật Ách90%,Tài Bạch90%,Tử Tức90%,Phu Thê90%,Huynh Đệ90%** giữ nguyên: đây là %hồ sơ mẫu, không mức sẵn sàng thương mại. P09 chưa kiểm model/input mới, commercialReady=false.

Ba điểm còn chặn phát hành vẫn là chất lượng đầu ra thật chưa đạt nghiệm thu trên phiên bản hiện hành, phạm vi/Tật chưa chốt, và runtime mới chưa kiểm phiên người dùng. Task này khép ở đầu vào/build/mock; **không tự gọi API, triển khai QA3062 hoặc mở bán**.
