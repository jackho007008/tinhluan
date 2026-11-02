# Phu Thê: liên hệ liên cung và biên tập giới hạn — 02/11/2026

## Kết quả và phạm vi

Baseline `main@59da42f`, tracked/index sạch lúc bắt đầu. Giữ nguyên `buu-dinh-7parts/`, `docs/handoff/` chưa commit. Chỉ sửa prompt/registry/test và tài liệu; **0CREATE/0GET provider,0USD**, không consumer/supervisor, không DB, không cập nhật QA3062/3070. QA3118 vẫnPID68941; không khởi web mới.

Prompt mới **`paid-palaces-vietnamese-2.5.0`** dùng ReadingV2 cũ, retrieval1.5.0/facts1.1.0 không đổi. Writer opt-in V2 chọn2.5 cho job mới; mặc định writerV1 không đổi. Prompt2.4 và mọi bản cũ giữ nguyên byte; CREATE/GET vẫn chọn version đã lưu trên job/attempt. Không sửa schema, UI, thanh toán, quyền, retry, engine, MệnhV1/Luna hoặc bài đã lưu.

## Đối chiếu căn cứ có sẵn

Đã đọc toàn văn [bài Luna2.4 thật](../.local/ai-paid-luna24-20261102/phu-the-reading.md) và bốn đơn vị trong [knowledge thực gửi](../.local/ai-paid-luna24-20261102/phu-the-knowledge.json), tái dùng hồ sơ đã xử lý, không đọc PDF mới:

- Trung Châu Tứ Hóa Phái2/PDF173,178: Phá hoặc Tham hoặc Sát **tọa Phu**, lượng từ **phần nhiều**, nét mạnh/chủ quan/xung động khi theo điều cho là tốt đẹp, cần tâm tư duy trì quan hệ. Không phép Phá–Đà–Hỏa.
- Cùng sách/PDF173–174: Tả/Hữu **tọa Phu**, hình tượng có thể thành bạn đời **từng trợ giúp qua một giai đoạn**, có chỗ va chạm quan niệm. Không mở lời về người thứ ba/tái hôn hoặc suy nghĩa vụ giúp đỡ lâu dài; không suy sự phù hợp ngoài đời.
- Tân Biên/PDF214: Khoa tại Phu **nam mệnh**, chú giải học vấn, không suy hòa hợp hoặc xóa sát.
- Tân Biên/tr158,162: Tử Vi–Thiên Tướng **đồng cung Quan Lộc**, tổ chức và mặt mưu tính/vượt quyền. Giữ hai mặt, cung gốcC, không quy kết hành vi thực tế. Nguồn không cung cấp quy tắc phối hợp Quan–Phu.

Liên hệ khả thi là một **phân biệt khái niệm của AI**, không tri thức sách mới: tổ chức thực hiện mục tiêu khác với đồng thuận về cách nhìn mục tiêu; đọc cạnh lời Phu về xung động/quan niệm có thể làm rõ vì sao việc sắp xếp hành động chưa giải đáp chỗ khác nhau về cách nhìn. Điều này không chứng minh công việc gây căng thẳng hôn nhân hoặc người đọc áp đặt. Nếu thiếu tiền đề ở một phía, không dùng phép nối ấy. Chưa có nguồn phối hợp Đà La/Hỏa Tinh; không thêm nghĩa hoặc rule để lấp.

## Prompt trước/sau

2.4 yêu cầu tách lời nguồn–tổng hợp nhưng chưa chỉ rõ đóng góp cần có của liên hệ, nên bài thật chủ yếu tách hai lĩnh vực.2.5 thêm:

- Chọn hai tiền đề có căn cứ, tìm đúng điểm chung và khác biệt chủ thể/hoàn cảnh/thời gian, giải thích vì sao phân biệt đó hữu ích. Không chỉ kể lại hai cung hoặc dừng ở A không bảo đảm B.
- Phu có thể đối chiếu cách thực hiện và sự đồng thuận **chỉ khi** lời Quan và lời Phu tương ứng đều có; không biến ví dụ thành văn mẫu cho mọi lá số. Thiếu đóng góp thật thì bỏ liên hệ hoặc giữ ngắn, không ép chương.
- Lời nguồn giữ paragraph `source-interpretation`; phần nối là `ai-synthesis` có facts/knowledge cả hai phía, nhắc cung gốc Quan Lộc. Không gán phép nối cho tác giả.
- Giới hạn chung đặt một nơi trong coverageNote hoặc limitations; coverageNote có thể chỉ mô tả phạm vi. Điều kiện riêng “phần nhiều”, “nam mệnh”, “qua một giai đoạn” vẫn ngay cạnh lời áp dụng. Không xóa phủ định/an toàn để giảm lặp. Thiếu Phá–Đà–Hỏa nêu một lần cuối bài.

Không thêm regex phân loại văn hay tự viết lại đầu ra trong validator: khó xác nhận chiều sâu/nghĩa chỉ bằng mẫu câu. Guard2.4 tiếp tục áp2.5, không nới kiểm C/nguồn/y khoa/thời gian. Giới hạn này cần đọc toàn văn khi sau này có quyền thử thật.

## Ví dụ đề xuất, không phải bài model mới

[Toàn văn mock biên tập thủ công](../.local/ai-paid-phu-depth-20261102/phu-the-proposed.mock.md) · [JSON mock](../.local/ai-paid-phu-depth-20261102/phu-the-proposed.mock.json) · [input và prompt2.5](../.local/ai-paid-phu-depth-20261102/input-prompt.json).

Đoạn minh họa ai-synthesis:

> Đọc lời Quan Lộc ấy cạnh Phu Thê, điểm liên hệ nằm ở cách theo đuổi một mục tiêu: tổ chức nhấn vào việc thực hiện, còn khác biệt quan niệm đặt ra câu hỏi mục tiêu ấy được hai người nhìn nhận thế nào. Một cách sắp xếp rõ ràng chưa tự giải đáp sự đồng thuận; nếu vội chuyển từ điều mình cho là tốt sang hành động, chỗ khác nhau về cách nhìn có thể vẫn còn nguyên.

Bản mock giữ paragraph lời Quan riêng, dẫn ba nguồn Quan/Phá/Tả cho phần nối. Giới hạn về tính gợi mở nằm cuối paragraph và giới hạn chung cuối bài; không lặp lời không xác nhận sau từng đoạn Phá/Tả/Khoa. Vế trợ giúp có thời gian và điều kiện nam mệnh vẫn đủ. Mock chỉ là đề xuất tổ chức lập luận, không chứng nhận phép phối hợp Tử Vi hoặc kết quả Luna/Astra mới. Không dùng để thay bản lưu.

## Kiểm thực chạy

- **92/92 pure tests,5file:** editorial, V2/provider renderer, library, contextGuide và safety. Thêm trường hợp một giới hạn chung vẫn hợp lệ, giữ time/mixed-attribution/C-origin/unknown-ID/y khoa ở cả2.4/2.5. SDK mock kiểm CREATE/GET theo version lưu (kể cả2.4 cũ) khi flag writer đổi. Không gọi provider thật; fetch thật chặn ở launcher.
- Dry cùng input159facts/knowledge cũ: mock qua validator2.5, kết quả thật2.4 qua đúng validator2.4 và2.5; **8kết quả thật cũ đọc đúng saved version**, không sửa file. [Dry summary/hash kết quả](../.local/ai-paid-phu-depth-20261102/dry-summary.json). Đây không phải kiểm DB, quyền thực tế hoặc browser mới.
- Typecheck đạt, build Node24 cách ly/key rỗng/AI tắt/DBcổng1 đạt;607file, BUILD_ID `dN0Ka8dnULPEYeOpWQKmC`. [Tests](../.local/ai-paid-phu-depth-20261102/tests-first.log), [typecheck](../.local/ai-paid-phu-depth-20261102/typecheck.log), [build](../.local/ai-paid-phu-depth-20261102/build.log).
- Không DBintegration/E2E/PDF/mobile mới vì không sửa store/quyền/UI. DBtest chỉ đổi import version kỳ vọng cho lần chạy riêng tiếp theo, **không báo đã chạy**.
- Lỗi đầu: script sửa file bị Python từ chối UTF-8 trước khi thực thi; chạy lại với UTF-8 rõ ràng. Test/build không có lượt fail; không sửa expected nguồn để xanh. Đã bỏ format thừa ngoài phạm vi trong test.

Tham khảo [OpenAI Docs về prompt/eval](https://developers.openai.com/api/docs/guides/prompt-engineering): dùng chỉ dẫn rõ và ca đánh giá; không suy mock là bằng chứng model đã tuân thủ.

## Điểm dừng

Đã chuẩn bị prompt và mock cụ thể hơn; **chưa xác minh văn model2.5 thật**, chưa nghiệm thu thương mại Phu hoặc11cung. Không tự gọi API tiếp. Hai hạn chế nội dung còn nguyên: phép phối hợp Phá–Đà–Hỏa chưa có căn cứ; nguồn Quan–Phu hiện hỗ trợ phân biệt khái niệm, chưa hỗ trợ khẳng định ảnh hưởng nhân quả hay chế hóa. Giữ bài cũ và QA3062/3070.
