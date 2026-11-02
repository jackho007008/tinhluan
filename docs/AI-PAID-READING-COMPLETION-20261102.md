# Hoàn thiện các cung từ nguồn hiện có — chỉ mock

02/11/2026, baseline `main@ae65022`. Lô hữu hạn tiếp tục sau gián đoạn: mở phần nguồn ngữ cảnh đã có cho Phụ Mẫu/Huynh Đệ, biên tập bốn bản limited Phụ/Điền/Di/Huynh và cập nhật checklist. Giữ nguyên thư mục chưa commit `buu-dinh-7parts/`, `docs/handoff/`. **0 CREATE/0 GET OpenAI, chi phí API 0 USD.** Không DB, consumer/supervisor, thanh toán, engine, bài lưu hoặc cập nhật/restart QA3062/3070.

## Khoảng thiếu thực sự và cách xử lý

Retrieval trước chỉ lấy phần sách bổ sung cho cung mục tiêu. Vì vậy, trên snapshot đối chứng, Phụ không có C mặc dù lời Tử phù hợp đã được nhận ở pipeline Tử; Huynh chỉ có C Điền, thiếu lời Nô phù hợp dù Nô là cung xung chiếu. Đây là thiếu đường dùng lại nguồn, không thiếu facts engine.

`paid-book-context.ts` dùng lại chính bộ chọn sách/thư viện hiện hành cho cung gốc. Chỉ nhận nguồn A/B có `application=direct`, đã khớp điều kiện và thuộc tam hợp/xung chiếu đã xác minh. Danh sách hữu hạn hiện là Phụ←Tử, Huynh←Nô. Khi đưa sang cung mục tiêu, nguồn trở thành **C/context**, không phải lời trực tiếp. Giữ nguyên chữ, references, điều kiện, ngoại lệ, selection và neo facts; thêm `contextOrigin` để truy về ID/cung gốc. Nền/phương pháp không được đưa vào nhánh này; missing-index/excluded được giữ trong trace. Không dựng rule mới hoặc sửa index sách.

Retrieval thành **paid-retrieval-1.9.0**; schema ReadingV2 và prompt **paid-palaces-vietnamese-2.6.0** giữ nguyên. Guide bổ sung Phụ–Tử, Huynh–Nô, Di–Phúc; mang neo thực của nguồn C, kể cả Lộc tại Nô cho lời Tử. Guide là đề nghị tổ chức bài, không quy tắc Tử Vi hoặc chứng cứ độc lập. Không thay writer mặc định, chọn version của job/attempt, validator cũ, quyền, queue hoặc JSONB.

Giới hạn nguồn sách ngữ cảnh mới: tối đa4đoạn/14.000byte trước bộ chọn C hiện hành. Tổng C vẫn tối đa8đoạn/24.000byte và giữ cách tính ngân sách đã có; không tăng toàn bộ packet để lấp khoảng thiếu. Packet có tăng tại hai cung được bổ sung nguồn, không tuyên bố kích thước giữ nguyên.

## Dry-run trên cùng snapshot QA

11cung đều159facts, so với dry trước giữ nguyên từng fact và toàn bộ nguồn trực tiếp. Không template chưa resolve. Không loại nguồn cũ trên mẫu này.

- **Phụ:** direct1 không đổi; C0→1, thêm `paid-context.tu-nu.paid-book.thp1-130-tu-from-no-loc`. Packet74.883→77.983byte.
- **Huynh:** direct1 không đổi; C1→4, thêm ba đoạn Nô từ THP1/PDF128–130: kỳ vọng đối đãi, biểu hiện hợp tác và mạng giao du. Packet76.656→82.980byte. Không lấy lời hợp tác làm bảo đảm thu lợi/trợ giúp.
- **Di:** direct1/C8 giữ nguyên; chỉ thêm guide Phúc và neo, packet88.582→89.522byte. Mock dùng đúng Thiên Mã tại Phúc, không chuyển sang Di.
- **Điền:** direct1/C1 giữ nguyên, packet76.695byte. C Huynh chưa có lập luận thích hợp về nhà đất nên không ép sử dụng.
- **Quan/Tài/Nô/Tử/Phu/Phúc/Tật:** sourceIDs/packet không đổi, ngoài version retrieval. Không sửa lại các bài đã lưu.

Byte chỉ là kích thước JSON thực đo, không token, giá hoặc chất lượng. [Dry11cung và nguồn giữ/thêm](../.local/ai-paid-remaining-20261102/dry-summary.json).

## Bốn bản biên tập, không phải kết quả AI

Tất cả `limited`, không ghi vào database hoặc thay bài khách hàng. Mỗi bản có JSON cùng tên `-dry.json` chứa facts/knowledge/instructions/content và basis/IDs từng đoạn.

- [Phụ:2phần/4đoạn](../.local/ai-paid-remaining-20261102/Phụ-Mẫu-proposed.mock.md): tách điều kiện vật chất với hòa khí ở gia đình xuất thân; đọc cạnh Tử ở vai khác của mệnh tạo. Giữ điều kiện Lộc tại Nô; không suy thế hệ sau lặp lại hoặc hóa giải thế hệ trước.
- [Huynh:2phần/3đoạn](../.local/ai-paid-remaining-20261102/Huynh-Đệ-proposed.mock.md): khoảng cách anh chị em đặt cạnh kỳ vọng giao du ở Nô; phân biệt hai loại quan hệ, không suy bạn thay người thân hoặc tự bổ sung phi hóa.
- [Di:2phần/4đoạn](../.local/ai-paid-remaining-20261102/Thiên-Di-proposed.mock.md): sự nể trọng không đồng nghĩa kết quả ra ngoài thuận lợi; đọc cạnh lời Thiên Mã tại Phúc về xa quê/xa họ hàng, giữ cả mặt đi kèm, không khuyên di cư.
- [Điền:1phần/2đoạn](../.local/ai-paid-remaining-20261102/Điền-Trạch-proposed.mock.md): tạo lập khác duy trì nhà đất đã có; Cơ–Cự đọc cùng Triệt. Không suy người đọc đang có tài sản, mất tài sản hoặc quyết định đầu tư.

Đã đọc toàn văn và đối chiếu từng lời chính với phần nguồn thật được chọn; source-interpretation riêng với ai-synthesis. Kiểm ngữ cảnh tự động không có cảnh báo, nhưng đó không thay đánh giá lập luận. Không xuất các vế số người/phẩm hạnh, chuyện tuổi thơ như sự kiện, tai nạn/tử vong trong bản cổ. Nguồn gồm Tân Biên126§5.2.5,177§10.13,218§15.2.3; lời Điền NPL260–261/nhánh đã đặc tả; Khâm Thiên Tứ Hóa Phái1/PDF128–130 và phiếu thư viện hiện có. Chỉ đối chiếu phần chữ cần thiết, không PDF/ảnh mới hoặc đọc lại toàn sách. Giữ riêng tác giả, không ghép thành quy luật chế hóa mới.

## Kiểm thực chạy

- **163/163 pure test,9file**, gồm adapter, book-context, topic-sources, context-guide, editorial, V2/provider mock, safety, library và premise-context. Lượt đầu162/162, thêm một ca phủ định focused chỉ có C rồi kiểm cuối163/163; không test fail. Kiểm nguồn nguyên chữ/điều kiện, origin/nhóm C, budget, không mở rộng ngoài scope, Lộc tại Nô, thiếu chủ thể C bị chặn, C không thay direct để nhận focused, y khoa và savedversion.
- Dry11cung và4mock qua validator2.6. Snapshot/facts/direct nguyên; nguồn C không thành lời áp trực tiếp.
- Tám bài thật cũ giữ hash và qua validator theo prompt đã lưu;19sourceartifact giữ hash. [Audit](../.local/ai-paid-remaining-20261102/preservation.json).
- Typecheck/build cách ly Node24.22.1/key rỗng/AI tắt/DBcổng1 đạt;612file, BUILD_ID `lUSDQNW8aaOQqgjV8481x`. [Tests](../.local/ai-paid-remaining-20261102/tests-final.log), [typecheck](../.local/ai-paid-remaining-20261102/typecheck.log), [build](../.local/ai-paid-remaining-20261102/build.log). Một lệnh khởi động build nhập dư đối số `node` đã được sửa trước lượt build thành công; không có thay đổi nguồn để né lỗi. Build có cảnh báo workspace root do nhiều lockfile, không sửa hạ tầng trong lượt này.
- Không chạy DBtest/E2E/PDF/browser/mobile mới vì không đổi UI; không xác nhận runtime web đã nhận code mới. Không worker, requeue, API thật hoặc quyền mới.

## Checklist sau phiên

Giữ10tiêu chí/trọng số/mẫu số `paid-content-progress-1.0.0`. Đây là **% hồ sơ kiểm/biên tập trên mẫu QA**, không độ chính xác, độ phủ mọi lá số hoặc mức sẵn sàng thương mại. [Mỗi ô, evidence và lịch sử](AI-PAID-CONTENT-PROGRESS.json).

- Phụ40→80%, Di40→80%, Huynh40→80%: hoàn thành bản mock có tham chiếu(P04), lập luận liên cung(P06), đối chiếu phân vai nguồn/tổng hợp(P07), rà an toàn(P08).
- Điền40→70%: P04/P07/P08 đạt, P06 chỉ partial và không tính điểm. Không ép thêm phần liên cung.
- Quan80%, Phúc80%, Nô80%, Tử80%, Phu80%, Tài80% giữ nguyên. Tật40% giữ nguyên; không bài y khoa mới.
- **P05 chiều sâu phối hợp và P09 chất lượng Astra cấu hình hiện hành vẫn chưa đạt ở mọi cung.** Không tăng điểm vì số đoạn hoặc văn trôi chảy. Mệnh miễn phí V1/Luna ngoài checklist, giữ nguyên.

## Nếu chủ dự án bổ sung sách

Chưa cần nhập thêm một kho lớn. Hữu ích nhất là chương/đoạn có **điều kiện và ngoại lệ rõ** cho các khoảng chưa giải được từ nguồn đã rà:

1. Nô: Thiên Lương với Hóa Lộc, phân biệt đối đãi, trợ giúp và lợi ích thực; Tử: vô chính diệu, Cơ–Cự xung chiếu và điều kiện chuyển lời.
2. Phu: Phá Quân–Đà La–Hỏa Tinh, mức phối hợp nào thực sự được tác giả bàn; không lấy nghĩa riêng ba sao ghép thành phép mới.
3. Tài: Liêm Trinh–Đại Hao trong tạo/giữ/chi nguồn lực; Điền: Cơ–Cự với Triệt, phân biệt tạo lập và bảo toàn nhà đất.

Nếu có, cung cấp tên tác giả/sách/ấn bản và nguyên đoạn kèm đoạn trước–sau hoặc trang liên quan. Đây là yêu cầu bằng chứng có trọng tâm, không khẳng định toàn kho hiện tại hoặc mọi sách đều không có lời giải. Codex sẽ đối chiếu cách hiểu/điều kiện, không yêu cầu chủ dự án chọn nguồn thắng. Không nhập hoặc sửa Bửu Đình trong lượt này.

**Kết luận: CHƯA ĐẠT để phát hành thương mại.** Điểm chặn còn là chiều sâu có nguồn và kiểm chất lượng model trên cấu hình hiện hành; Điền chưa có liên cung đủ căn cứ, Tật vẫn giữ giới hạn. Không tự gọi API để tăng điểm, không triển khai QA3062/3070 hoặc mở task/gói mới.
