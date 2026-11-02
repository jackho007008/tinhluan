# Phu Thê — kiểm Luna prompt 2.4, 02/11/2026

## Kết luận

Đúng một bài Luna thật đã completed, validation và lưu thành công. Hai mục tiêu hẹp đạt trên mẫu này: tách lời nguồn khỏi tổng hợp AI; giữ đủ sắc thái “từng trợ giúp … qua một giai đoạn”. Không suy ra mọi lá số hoặc 11 cung đã đạt thương mại. Không gọi thêm API để chọn bài đẹp.

## Phiên bản và phạm vi

- Code chạy: `main@281f5d5`; không sửa mã ứng dụng trong lượt này.
- Model `gpt-6-luna`, prompt `paid-palaces-vietnamese-2.4.0`, retrieval `paid-retrieval-1.5.0`, schema `paid-reading-v2.0.0`.
- QA clone riêng PostgreSQL55456; không khởi chạy web. Report synthetic `7e5dec40-c6cd-49eb-8a72-b184883a39b2`, job `83fd855d-22a0-4384-9168-479f4cee1edb`.
- Response `resp_05a79f1aaaa08dc8006ae7e3136a3087d2b9dbe134f670d84f`, 1 attempt, Background; không retry CREATE.
- 159 facts cùng snapshot đối chứng; canonical input hash `3432f7db5243297ae241095f2d6e47d3d669dc5ccbe293377770032aa6df703c`.
- Không Astra, worker thường trực, supervisor, migration hoặc cập nhật QA3062/3070. Mệnh miễn phí và model sản phẩm không đổi. Bửu Đình không sửa.

## Gate trước khi gọi và số request

Quyền chủ dự án: đúng1CREATE Luna/Phu Thê/prompt2.4, dự phòng0,02USD. Models GET xác nhận quyền thực tế; endpoint input_tokens đếm28.322 token cho prompt/schema trước dispatch. Dự toán bảo thủ thêm5% input, cache-write12h và tối đa8.000 output: **0,01143475USD**, đã báo trước CREATE. Không đọc được credit/spending limit project trực tiếp; dự phòng nội bộ không phải hard cap hóa đơn.

Thực tế: **1CREATE Responses, 2GET Responses, 1 attempt**. Ngoài ra có2GET Models và1POST input_tokens, không phải request sinh bài. SDK tắt retry; guard chỉ cho phép đúng model/cung/attempt và GET cùng response ID. Không tiêu thụ queue khác.

## Toàn văn và đầu vào thực gửi

Các file private dưới `.local` không nằm trong Git, chỉ có trên máy hiện tại:

- [Toàn văn Luna2.4](../.local/ai-paid-luna24-20261102/phu-the-reading.md).
- [Result JSON đã lưu](../.local/ai-paid-luna24-20261102/phu-the-result.json).
- [Input và prompt thực gửi](../.local/ai-paid-luna24-20261102/phu-the-input.json).
- [Facts](../.local/ai-paid-luna24-20261102/phu-the-facts.json), [knowledge](../.local/ai-paid-luna24-20261102/phu-the-knowledge.json), [audit basis/nguồn từng đoạn](../.local/ai-paid-luna24-20261102/reference-audit.json).
- [Bài Luna2.3 đối chứng](../.local/ai-paid-luna-frugal-20261101/phu-the-reading.md).

## Đọc toàn văn và đối chiếu 2.3 → 2.4

Bài cũ2section/4paragraph, bài mới3section/6paragraph. Số phần tăng không phải bằng chứng chất lượng. Model tự khai `focused`; đây là coverage theo contract, không phải nghiệm thu chuyên môn/thương mại.

1. **Sắc thái trợ giúp:** bài cũ rút còn “có sự trợ giúp”. Bài mới viết “từng trợ giúp mệnh tạo qua một giai đoạn”, basis `source-interpretation`, knowledge `paid-library.thp2-phu-ta-huu`, fact `palace.8.minorStars.2`. Đoạn tổng hợp cũng giữ “sự trợ giúp từng diễn ra qua một giai đoạn”, basis `ai-synthesis`. Không biến thành nghĩa vụ giúp đỡ suốt đời.
2. **Lời nguồn và liên hệ liên cung:** bài cũ ghép lời Quan và câu “Đọc cạnh cung Phu Thê…” dưới cùng basis nguồn. Bài mới tách đoạn Quan `source-interpretation`/role `context`, giữ nguyên origin Quan Lộc của nguồn C `paid-v1.natal-paragraph-4-0`; đoạn “Đọc phần Quan Lộc cạnh các mô tả tại Phu Thê…” dùng `ai-synthesis`/role `context`, neo riêng facts/nguồn liên quan. Không gọi phép nối này là lời sách hoặc quan hệ nhân quả đã xác nhận.
3. **Điều kiện nguồn:** Phá Quân giữ “phần nhiều”, không gán toàn bộ tổ hợp Sát–Phá–Tham. Hóa Khoa giữ điều kiện nam mệnh và phạm vi chú giải học vấn. Không thấy thêm sao/vị trí/trích dẫn, quy tắc Khoa xóa sát hoặc kết luận về người phối ngẫu ngoài đời trong toàn văn này. Các IDs đều qua validation và audit.
4. **Giá trị và giới hạn:** rõ hơn về phân biệt trợ giúp/bất đồng/nhịp hành động, nhưng đoạn liên cung chủ yếu tách các phương diện; chưa phân tích phối hợp sâu. Còn lặp lời giới hạn ở nhiều đoạn. Không đủ bằng chứng nguồn cho phép phối hợp Phá Quân–Đà La–Hỏa Tinh; bài không bịa phép phối hợp để lấp thiếu. Chưa dùng mẫu này để kết luận phát hành thương mại11cung.

Hai lỗi mục tiêu đã cải thiện trong một mẫu thật; guard vẫn chỉ là kiểm dấu hiệu hẹp, không chứng minh mọi tổng hợp đều trung thành nguồn.

## Token, thời gian và chi phí

Usage thực: input28.294 = uncached3 + cache-write28.291 + cached-read0; output3.369 **đã gồm reasoning1.987**, không cộng reasoning lần nữa. Service tier `default`.

Theo [giá chính thức](https://developers.openai.com/api/docs/pricing) đã kiểm ngày02/11: mỗi triệu token input0,10USD, cached-read0,01USD, cache-write30m0,125USD hoặc12h0,25USD, output0,50USD. Không giả định usage đã cho biết thời hạn cache khi không có trường xác nhận.

- Ước theo write30m: **0,005221175USD**.
- Nếu write12h: **0,00875755USD**.
- Bài2.3 cũ: 0,004867675USD/0,00834405USD tương ứng; không lấy giá thấp làm bằng chứng chất lượng.
- [Breakdown và usage](../.local/ai-paid-luna24-20261102/luna-cost-estimate.json). Đây là ước tính response, không phải hóa đơn, không khẳng định endpoint đếm token miễn phí.

Parser lưu DB hiện chỉ hỗ trợ giá Astra nên giữ nguyên `estimated_cost_usd=null`, `unsupported-price` cho Luna; không sửa hoặc backfill giá lịch sử. Ước tính Luna riêng trong evidence trên.

Provider created01:10:43Z, completed01:11:24Z: **41giây**. Queue34,261giây; dispatch→persist95,875giây; HTTP observation cộng5,756giây. Không đánh đồng các số này hoặc suy ETA11cung.

## Lưu/mở, bảo toàn và kết thúc

Đọc qua store hai lần: nguyên nội dung, không đổi jobs/attempt và không phát sinh provider call; progress1/11. Không khởi web/browser nên **chưa kiểm UI/HTTP/mobile trong lượt này**, không dùng store-read thay cho nghiệm thu browser.

44job clone cũ (18queued) giữ nguyên;10job mới ngoài Phu vẫnqueued/0attempt. Bảy bảng lịch sử được đối chiếu từng cột các dòng cũ,35artifact đối chứng giữ hash. [Bảo toàn và đọc](../.local/ai-paid-luna24-20261102/preservation-and-read.json), [dữ liệu lịch sử](../.local/ai-paid-luna24-20261102/historical-data.json), [hash cũ](../.local/ai-paid-luna24-20261102/history-check.json), [đọc lại](../.local/ai-paid-luna24-20261102/reopen-check.json).

Backup DB QA sau kiểm68.820.054byte/SHA256 `4f919a7d9e7d69e49c68d0161156197c14fae684d13b1118159894ce39108653`; giữ private. DB55456 đã dừng, dữ liệu còn, consumer hữu hạn đã thoát. [Backup metadata](../.local/ai-paid-luna24-20261102/backup-after.json), [shutdown](../.local/ai-paid-luna24-20261102/shutdown.json).

Không sửa app nên không chạy lại test/build; dùng validation pipeline thật, audit toàn văn và kiểm lưu/bảo toàn nêu trên. 97mock+3DBtest/typecheck/build tại baseline281f5d5 là kết quả lượt trước, không báo là vừa chạy lại. Dừng đúng mộtCREATE được duyệt.
