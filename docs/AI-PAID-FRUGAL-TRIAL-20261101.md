# Rà mock bốn cung và một bản nháp Luna tiết kiệm — 01/11/2026

Baseline `main@4f30e4f`; chỉ bổ sung tài liệu/bằng chứng, không sửa ứng dụng. Giữ `buu-dinh-7parts/`, `docs/handoff/` chưa commit, mọi bài cũ và Mệnh V1/Luna. Không QA3062/3070, worker thanh toán, Live hoặc Astra thật.

## Rà facts và nguồn trước API

31/31test liên quan trong3file (library/topic-sources/adapter) chạy mới, mạng thật bị chặn. Tái dựng packet Nô/Tử/Phu/Tài từ snapshot có receipt hợp lệ:159facts/cung, mọi path truy được snapshot, JSON input bằng dry-run4f30e4f, không template chưa resolve. Không tự an sao hoặc sửa snapshot.35facts mang provenance chưa đủ xác minh/bất nhất trên toàn packet vẫn giữ nhãn, không dùng để diễn giải. Chín artifact index/trang chữ khớp hash;28artifact vòng Astra2.2 giữ nguyên.

- **Nô:**3đoạn direct, nhưng cùng nhánh Lộc năm sinh tại Nô; giao du, kỳ vọng và biểu hiện hợp tác là những mặt khác nhau, không ba nguồn độc lập bảo đảm bạn tốt/hỗ trợ. Chưa chọn làm bài thử đầu.
- **Tử:**1đoạn về quan hệ từ Lộc tại Nô; hai nhánh Lộc/Kỵ tọa Tử bị loại đúng điều kiện trên mẫu. VCD và đối cung Cơ–Cự chưa đủ lời toàn cấu trúc; không dùng nguồn chi tiêu của người xem làm lời con cái. Chưa đáng tốn API ở vòng này.
- **Tài:**3đoạn direct, có tạo/tích lũy/chi, TháiTuế chỉ nghĩa nền về biểu đạt; Thai–Tọa bị loại vì chỉ có BátTọa. Không thêm phép phối hợp Liêm–ĐạiHao hoặc đổi bảng độ sáng. Chưa chọn vì câu hỏi chuyên môn còn thiếu nguồn.
- **Phu được chọn:** ba nền trực tiếp đúng điều kiện: Phá tọa Phu theo TứHóaPhái2 PDF173/178; TảPhụ (TảPhù snapshot) tọa Phu theo PDF173–174; Khoa năm sinh tại Phu/hồ sơ nam theo TânBiên214. Có thể thử nối chủ động/xung động với trợ giúp/khác biệt quan niệm, giữ học vấn là phương diện riêng. ĐàĐắc/Hỏa chưa ghi nhận trạng thái không trở thành một phép chế hóa. Chỉ đủ bài nháp có giới hạn, không chứng nhận chuyên sâu.

[Audit bốn cung, điều kiện và IDs](../.local/ai-paid-frugal-audit-20261101/audit.json), [hash nguồn/lịch sử](../.local/ai-paid-frugal-audit-20261101/source-check.json), [mock tổng hợp Phu thủ công](../.local/ai-paid-frugal-audit-20261101/phu-the-mock.md). Mock này đã qua validator2.3, không phải kết quả của Luna/Astra và không thay bài đã lưu.

## Dự toán đã báo trước CREATE

Chủ dự án yêu cầu mock trước, chọn một cung để thử model nhẹ và báo dự toán trước gọi. Codex đã báo chọn1Phu/`gpt-6-luna`, reasoning medium, output cap8000, dự toán0,009–0,014USD và dự phòng0,02USD **trước khi gọi**. Đây là mức dự phòng được báo trong phạm vi bài thử, không phải một xác nhận riêng của chủ dự án về số tiền hoặc hard cap provider. Không tự fallback model/Astra.

Theo [model Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) và [giá Standard](https://developers.openai.com/api/docs/pricing): input0,10/output0,50/cached-read0,01/cache-write30m0,125/cache-write12h0,25USD/Mtoken; model hỗ trợ Responses/Structured Outputs và reasoning medium. Đây là giá công khai, không bằng chứng quyền project. Root.env có key nhưng không model riêng; chỉ cấu hình model trong env của phép thử QA, không sửa root.env hoặc mô hình sản phẩm.

Preflight thực:1ModelsGET xác nhận quyền Luna,1POSTinput_tokens đếm đúng prompt/schema:27842input. Gate tính5% dự phòng input, toàn input ở giá write12h và8000output: **0,01130875USD**, dưới0,02. Nếu vượt sẽ không dispatch. Không dùng heuristic bytes làm bill; không đọc được spending limit trực tiếp. [Gate/calls](../.local/ai-paid-frugal-audit-20261101/cost-gate.json), [request dự kiến](../.local/ai-paid-frugal-audit-20261101/proposed-request.json).

## Bài Luna thật và đánh giá

DB QA mới55454 từ backup QA có kiểm soát, không web/consumer/supervisor thường trực. Tạo báo cáo synthetic mới `e747a51e-5a01-483e-bd0c-78a1c5d24480`, checkout/webhook test/quyền hợp lệ qua cơ chế hiện có. Chỉ dispatch Phu, model đúngLuna, prompt2.3.0/retrieval1.5.0/ReadingV2.0.0; guard chặn CREATE thứ hai và GET sai receipt. Không retry các attempt credit/uncertain cũ.

**1CREATE/2ResponsesGET/1attempt**, completed và lưu, model `gpt-6-luna`, response `resp_023291a30162c02b006ae72b5044c487d29a0cd3bf2dd445f5`. Thêm2ModelsGET tổng (1preflight/1dispatch),1POSTinput_tokens, không API khác. Provider39giây; queue34,946giây; dispatch→lưu95,491giây vì backoff; không suy ETA11cung. Coverage do model trả `focused`,2section/4đoạn, không đồng nghĩa đã giao bài chuyên sâu.

[Toàn văn Luna, không sửa thân bài](../.local/ai-paid-luna-frugal-20261101/phu-the-reading.md), [result/basis/IDs](../.local/ai-paid-luna-frugal-20261101/phu-the-result.json), [input/facts/knowledge/prompt](../.local/ai-paid-luna-frugal-20261101/phu-the-input.json). Bản xuất ban đầu dùng nhầm tiêu đề wrapper “Astra V2” kế thừa script cũ; đã sửa thành “Luna thử nghiệm”. Model/result DB và thân bài không đổi.

Đã đọc toàn văn, đối chiếu ba nguồn và [bài Phu Astra2.2 cũ](../.local/ai-paid22-real-20261101/phu-the-reading.md):

- Giữ đúng Phá tại Phu, Tả hóa Khoa và Quan là cung gốc của nguồn ngữ cảnh; không thêm sao/trạng thái hoặc dự báo hôn nhân. Không thấy lỗi facts/trích dẫn nghiêm trọng trong bài này.
- Có dùng nguồn Tả/Hữu mới, nối được nét chủ động với trợ giúp và khác quan niệm; học vấn không thành bảo đảm hòa hợp. Không tự tạo phép Phá–Đà–Hỏa/Khoa giải sát. Văn ngắn, không ép tám phần.
- **Điểm chưa đạt:** đoạn role context vừa kể lời Tử–Tướng tại Quan, vừa đưa liên hệ biên soạn sang Phu nhưng gắn toàn đoạn `source-interpretation`; cần tách lời nguồn và phần AI-synthesis. Validator kiểm được IDs/role/cung gốc nhưng không chứng minh toàn đoạn do nguồn hỗ trợ.
- **Điểm biên tập:** vế Tả/Hữu trợ giúp “trong một giai đoạn” bị rút thành “có sự trợ giúp”, thiếu sắc thái thời gian; chưa thành hứa giúp đỡ suốt đời nhưng nên giữ đủ. Bài vẫn nhiều lời rào/giải thích giới hạn, ngữ cảnh Quan còn thiên phân biệt hai trục hơn là phân tích sâu.

**Đạt mục đích bản nháp chi phí thấp; chưa dùng nguyên văn cho khách hoặc nghiệm thu thương mại.** Không coi Luna thay được Astra từ một mẫu: cả model, prompt và nguồn đã khác đối chứng2.2. Không gọi lại để sửa hai điểm này hoặc chọn bài đẹp.

## Chi phí và bảo toàn

Usage thực: input27814 = uncached3 + cache-write27811 + cached-read0; output2782 đã gồm reasoning1552. Ước **0,004867675USD** theo Standard/cache-write30m; nếu dùng giá write12h thì **0,00834405USD**, đều dưới dự phòng. Đây là estimate cho response, không hóa đơn provider; chi phí token-count endpoint không được tự khẳng định miễn phí.

Parser hiện chỉ định giá Astra nên DB lưu `estimated_cost_usd=null`, `unsupported-price` cho Luna đúng thiết kế. Không coi null là0 và không sửa parser/backfill DB trong task này. [Phép tính riêng và giá áp dụng](../.local/ai-paid-luna-frugal-20261101/luna-cost-estimate.json), [usage/timing](../.local/ai-paid-luna-frugal-20261101/metrics.json).

Đọc lại hai lần từ store trả nguyên kết quả và giữ quyền, không tăng job/attempt/network.44job cũ/18queued không đổi;10job mới ngoài Phu vẫnqueued/0attempt;7bảng lịch sử QA clone khớp backup. Đã backup và dừng đúng DB55454, giữ dữ liệu/receipt; không kiểm browser/mobile hoặc khởi chạy web. [Đọc lại](../.local/ai-paid-luna-frugal-20261101/reopen-check.json), [bảo toàn](../.local/ai-paid-luna-frugal-20261101/preservation-and-read.json), [backup](../.local/ai-paid-luna-frugal-20261101/backup-after.json), [dừng](../.local/ai-paid-luna-frugal-20261101/shutdown.json).

Không sửa code ứng dụng, không chạy lại build/typecheck/E2E/PDF hoặc toàn bộ test. Chỉ31test/mock và audit/pipeline một bài cần thiết. Giữ chính sách: mặc định mock; bài nháp model nhẹ ghi rõ mục đích/giới hạn; báo dự toán trước gọi; mỗi vòng bắt đầu1bài; không tự thêm lượt hoặc dùng một mẫu nhẹ để nghiệm thu Astra. Mô hình trả phí sản phẩm vẫnAstra; Mệnh miễn phí V1/Luna giữ nguyên.
