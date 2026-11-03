# Lời luận dễ hiểu, căn cứ xem riêng — 03/11/2026

Chủ dự án đọc bài Astra thật và xác định một vấn đề sản phẩm: lời luận phải dễ hiểu với người chưa học Tử Vi, không nêu tên sách, tác giả hoặc nguồn trong thân bài khách hàng. Đây là yêu cầu chung về văn phong, không phải lý do xóa căn cứ hoặc nâng độ chắc chắn của nhận định. Bài Tài Bạch 2.6 đã lưu và biên bản kiểm trước giữ nguyên; kết luận kỹ thuật/nguồn trước đó không chứng minh bài đã đạt yêu cầu văn phong mới.

Baseline `main@acb2aa9`, tracked/index sạch; giữ `buu-dinh-7parts/`, `docs/handoff/`. Lô hữu hạn: chính sách lời văn dùng chung, prompt mới, guard có version, mock/bản minh họa và kiểm tương thích. **0 CREATE/GET OpenAI thật, 0 USD; không DB, worker/supervisor, restart/deploy hoặc QA3062/3070.**

## Quy tắc mới

- Dùng từ quen thuộc, giải thích ý chính rồi mới nói các sao liên quan; không bắt khách đọc như một báo cáo khảo cứu. Các thuật ngữ cần thiết được giải thích ngắn, không tự thêm nghĩa sao để giải thích cho hay.
- Không tên sách/tác giả/website/trường phái, trang sách, URL hoặc các câu “theo sách”, “tác giả cho rằng”, “nguồn này” trong tiêu đề, đoạn văn, ghi chú phạm vi và giới hạn của bài mới. Không biến lời nguồn mạnh thành cam kết hoặc trích câu mạnh dưới tên tác giả để né giới hạn.
- Facts, basis, factIds, knowledgeIds, nguồn, điều kiện, ngoại lệ và lượng từ vẫn giữ riêng. Căn cứ tiếp tục có trong phần **Xem căn cứ** hiện có, không trộn vào thân bài và không xóa khỏi đầu vào.
- Giữ đúng cung gốc khi dùng ngữ cảnh; giữ sắc thái như “phần nhiều”, “từng trợ giúp qua một giai đoạn”, không biến câu dễ đọc thành kết luận chắc chắn về người thật. Tật Ách giữ giới hạn y khoa/T1.

Hướng dẫn [OpenAI về văn phong](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra.) cũng khuyến nghị yêu cầu rõ về từ quen thuộc và văn xuôi. Đây chỉ là căn cứ kỹ thuật để viết prompt, không là bằng chứng model mới đã đáp ứng hoặc là nguồn luận Tử Vi.

## Triển khai và phạm vi tương thích

`lib/ai/customer-prose.ts` giữ chính sách chung và guard hẹp. Guard kiểm các trường lời khách hàng, bắt tên nguồn phổ biến trong kho, tên tham chiếu đủ đặc trưng, URL và cách kể nguồn/nội bộ rõ ràng; chuẩn hóa dấu/case/ký tự ẩn. Không cấm mọi chữ “nguồn” vì **nguồn thu/nguồn lực** là từ bình thường; không nhầm tên sao **Tử Vi** hay **Hóa Quyền** với tên sách.

Đây **không** là bộ đo độ dễ hiểu, kiểm chứng nghĩa hoặc bộ nhận diện mọi cách viết tên nguồn. Tên lạ/viết tắt chưa biết và văn dài khó đọc vẫn cần rà toàn văn. Không dùng điểm readability tự đặt để tuyên bố mọi người đều hiểu được.

- Paid writer V2 mới: **`paid-palaces-vietnamese-2.7.0`**, dùng chung cho cả 11 cung. Schema **paid-reading-v2.0.0**, retrieval **1.14.0**, facts **1.1.0** và model Astra giữ nguyên.
- Chọn prompt/schema/validation theo version lưu trên job/attempt. **2.6 và mọi bản cũ** vẫn truy cập đúng hàm/guard cũ khi CREATE/GET/đọc lại; không áp guard văn phong mới vào kết quả lịch sử, không sửa renderer để cắt tên nguồn khỏi bài đã lưu.
- Thêm `AI_CUSTOMER_PROSE` vào phân loại lỗi đầu ra. Bài mới lọt tên nguồn bị từ chối theo luồng validation hiện có; không nhầm lỗi này với billing/provider, không sửa queue/retry hoặc tự gọi lại API để sửa văn.
- Các lượt **Luna biên tập Mệnh sau này** dùng **`menh-v1-copyedit-1.2.0`**, cùng quy tắc dễ hiểu/không tên nguồn nhưng chỉ biên tập ý V1, không được suy luận mới. Giữ nguyên prompt 1.0/1.1, đọc/duyệt candidate theo chính version cũ của nó. V1 gốc, các bản approved cũ, cơ chế fallback và Mệnh đã chốt trong báo cáo không bị viết lại. Không chạy Luna, không batch hoặc tạo candidate trong kho thật.

Không đổi PAID_EDITION, quyền, offer, thanh toán, engine hoặc cách đếm X/11. Không sửa sách/catalog. **QA3118 vẫn chạy checkout trước, prompt 2.6**; chưa thay web/build đang phục vụ trong phiên này. Code và build mới sẵn riêng, không lấy thay đổi Git làm bằng chứng runtime đã đổi.

## Bản Tài Bạch minh họa

**[Đọc bản biên tập dễ hiểu](../.local/ai-customer-prose-20261103/tai-bach-readable-preview.md)** · [JSON kèm căn cứ](../.local/ai-customer-prose-20261103/tai-bach-readable-preview.json).

Đây là **Codex biên tập minh họa từ bài thật**, không phải một bài Astra mới hoặc kết quả thay thế trong DB. Vẫn 4 section/10 paragraph, giữ id/role/basis/factIds/knowledgeIds, facts và knowledge; chỉ sửa lời khách đọc. Nguồn đầy đủ ở JSON và ở bài gốc để tra cứu, không có tên sách/tác giả trong phần luận của bản minh họa.

Ví dụ thay đổi:

- Phần kể hai tác giả và lời “làm giàu chắc chắn” được diễn đạt thận trọng: “Với Liêm Trinh là sao chính duy nhất ở Dần hoặc Thân, cách kiếm tiền được mô tả là có cạnh tranh và tích lũy chậm nhưng chắc.” Câu sau giữ rõ không hứa chắc giàu hoặc giữ được tiền, không gán tất cả lời của hai tác giả thành cùng mức khẳng định.
- “Nền nghĩa chung Đại Hao–Tiểu Hao trong Tân Biên…” được đổi thành: “Chữ Đắc của Đại Hao không có nghĩa cứ gặp sao này là giữ được tiền. Ý hao hụt vẫn cần được xét đến.” Không thêm quy tắc chế hóa hoặc khẳng định hao tài thực tế.
- “Mệnh tạo” đổi thành “bạn”; “thế tọa–xung” giải thích thành hai sao ở hai cung đối diện; nhánh nghề nghiệp giữ Mệnh/Quan và giải thích tam hợp ngắn. Chi ngoài công việc vẫn là chi của bạn, không thành tính cách con.

Không sửa [toàn văn Astra 2.6 gốc](../.local/ai-paid-official-20261103/tai-bach-reading.md) hoặc result/facts/knowledge cũ. Bản minh họa vẫn cần chủ dự án đánh giá giọng văn; việc qua validator không thay đánh giá đọc hiểu của người dùng.

## Kiểm thực sự đã chạy

- **120/120 test, 7 file**: customer prose; paid editorial/premises/V2; V1 edit/review/transfer. Lượt đầu 110/110 đạt; thêm kiểm sắc thái Phu và phạm vi tương thích kho V1 rồi lượt cuối 120/120 đạt, không có lượt fail. Test SDK CREATE/GET chỉ dùng fetch mock và saved prompt; không gọi provider thật.
- Kiểm không rò nguồn ở title/text/coverageNote/limitations; metadata tham chiếu vẫn nguyên. Có negative cho tên sách/tác giả có dấu/không dấu/case/ký tự ẩn, URL/cách kể nguồn; allow tên sao và “nguồn thu”. Giữ guard mất giai đoạn trợ giúp, sai fact/reference và y khoa.
- Dry-run **11 input** giữ nguyên toàn bộ facts/knowledge/context guide của 1.14. Bản minh họa Tài qua validator 2.7, mọi basis/refs/id/role nguyên. **9 bài thật cũ** qua đúng validator cũ và giữ hash. Bài Astra 2.6 vừa tạo bị guard **mới** bắt tên nguồn, nhưng vẫn hợp lệ/đọc được ở version **cũ** — tái hiện đúng vấn đề mà không phá lịch sử.
- Rà lại **73 đơn vị V1 đã quan sát** trong kiểm kê Gói 2.4: không bị guard văn phong mới đánh dấu, không tên sách/tác giả đã biết hoặc cách kể nguồn trong phần text. Chỉ đọc inventory đã có, không sinh lại lá số hoặc đăng ký/duyệt unit; mẫu này không đại diện mọi nội dung có thể render. [Audit V1](../.local/ai-customer-prose-20261103/v1-observed-style-audit.json).
- **Typecheck/build cách ly đạt**, Node24, không `.env` thật, key rỗng/AI tắt/DB cổng 1 và fetch bị chặn; BUILD_ID **`qiT-DI3piLWrtfOJVoENC`**. Không thay `.next` đang phục vụ. Cảnh báo workspace root nhiều lockfile có sẵn giữ nguyên.
- Không DB test, browser/mobile, E2E/PDF hoặc gọi API thật; không sửa UI/CSS, không tạo phiên/recovery fixture, không đọc lại PDF hoặc xử lý queue. Không suy chất lượng Astra 2.7 từ mock/bản tự biên tập.

[Test đầu](../.local/ai-customer-prose-20261103/tests-first.log) · [Test cuối](../.local/ai-customer-prose-20261103/tests-final.log) · [Dry-run](../.local/ai-customer-prose-20261103/dry-summary.json) · [Typecheck](../.local/ai-customer-prose-20261103/typecheck.log) · [Build](../.local/ai-customer-prose-20261103/build.log) · [Identity](../.local/ai-customer-prose-20261103/build-identity.json).

## Checklist và điểm dừng

**Tài Bạch 100 → 90% hồ sơ hiện hành**: P09 phải chờ đánh giá Astra theo prompt mới 2.7 và yêu cầu văn phong mới; kết quả 2.6 trước đó không tự chứng nhận 2.7. Không mất hoặc sửa kết quả cũ. Mười cung khác giữ 90%: Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tử Tức, Phu Thê, Huynh Đệ. Tật vẫn chỉ hồ sơ T1, không bài sức khỏe cá nhân. Mẫu số/tiêu chí không đổi; tất cả commercialReady=false.

Đã sửa đường tạo bài mới và có bản minh họa để đọc trước. **Chưa kiểm AI thật với văn phong mới, chưa cập nhật QA runtime và chưa nghiệm thu thương mại.** Không tự gọi thêm API hoặc triển khai chỉ vì build đã đạt.
