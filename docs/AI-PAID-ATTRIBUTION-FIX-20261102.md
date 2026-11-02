# Tách lời nguồn và giữ sắc thái trợ giúp — 02/11/2026

**Đã sửa prompt/validator và kiểm mock; chưa gọi model thật.** Baseline `main@96c229a`, tracked/index sạch đầu phiên; giữ `buu-dinh-7parts/`, `docs/handoff/` chưa commit. Không sửa bài Luna/Astra cũ, facts, kho sách, Mệnh miễn phí, UI, thanh toán hoặc quyền. Không cập nhật QA3062/3070.

## Hai lỗi có bằng chứng

Tái dùng đúng [result Luna2.3 đã lưu](../.local/ai-paid-luna-frugal-20261101/phu-the-result.json) và packet của nó, không tạo bài mẫu khác để kết luận:

1. Đoạn ngữ cảnh Quan Lộc bắt đầu bằng lời Tử–Tướng từ nguồn, rồi nối sang quan hệ Phu Thê bằng câu “Đọc cạnh cung Phu Thê…”, nhưng cả đoạn là `source-interpretation`.
2. Đoạn Tả/Hữu rút lời trợ giúp trong một giai đoạn thành “có sự trợ giúp”, mất sắc thái thời gian của nguồn TứHóaPhái2 PDF173–174 đã rà. Không mở PDF hoặc diễn giải sách mới trong lượt này.

## Thay đổi hữu hạn

Prompt mới **`paid-palaces-vietnamese-2.4.0`** yêu cầu mỗi paragraph có một basis: lời nguồn đúng phạm vi ở đoạn `source-interpretation`, câu liên hệ biên soạn tách riêng thành `ai-synthesis`, giữ các facts/nguồn tiền đề và tên cung gốc. Không chỉ đổi nhãn cả đoạn cho qua kiểm. Ví dụ trong prompt chỉ hướng dẫn cách tổ chức, không tạo luận điểm Tử Vi mới. Giữ V2 linh hoạt, không ép thêm section/từ.

Khi dùng vế trợ giúp của Tả/Hữu tại Phu, phải giữ “từng trợ giúp”, “qua/trong một giai đoạn”, “ở một chặng” hoặc cách diễn đạt tương đương; không thành luôn giúp/suốt đời. Có thể nêu đủ một lần trong đoạn lời nguồn rồi gọi ngắn ở phần tổng hợp, tránh ép lặp điều kiện mỗi câu. Không bắt buộc diễn giải vế trợ giúp nếu chỉ đang dùng một vế khác độc lập về khác biệt quan niệm.

`validatePaidEditorial` chỉ áp dụng **2.4**, kiểm hẹp:

- Dấu nối biên soạn rõ như “đọc/đặt…cạnh”, “phép nối”, “nếu đối chiếu”… bị chặn khi gắn `source-interpretation`, trừ khi chính nguồn được dẫn có dấu nối ấy. Mã lỗi `AI_MIXED_ATTRIBUTION`.
- Với đúng nguồn Tả/Hữu và vế thời gian đang có trong input, đoạn lời nguồn nói về trợ giúp phải có dấu thời gian; không được đổi mọi đoạn thành ai-synthesis để bỏ mất dấu này trên toàn bài. Mã lỗi `AI_SOURCE_QUALIFIER_LOST`.
- Hai mã được phân loại lỗi validation đầu ra, không nhầm lỗi provider/model/credit. Không sửa retry/backoff/budget, không tự sửa prose, đổi basis hoặc CREATE lại.

**Giới hạn:** đây là kiểm dấu hiệu ngôn ngữ có phạm vi, không máy chứng minh ngữ nghĩa. Có thể bỏ sót cách trộn khác hoặc cần đọc lại một trường hợp bị chặn; ngoại lệ nguồn có cùng dấu nối không chứng minh mọi câu được nguồn hỗ trợ. Vẫn cần đối chiếu toàn văn khi sau này được phép thử thật. Không coi regex/mock là chứng nhận nội dung đã đúng.

Tham khảo [OpenAI Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) về hướng dẫn cụ thể và eval theo phiên bản; tài liệu API không chứng nhận chuyên môn Tử Vi.

## Bảo toàn version và mock đối chứng

Giữ nguyên byte mọi prompt1.x/2.0/2.1/2.2/2.3. Writer V2 opt-in chọn2.4; schema vẫn `paid-reading-v2.0.0`, retrieval vẫn1.5/facts1.1. GET đối soát chọn validator từ version đã lưu của job/attempt như trước.2.3 tiếp tục quyền tổng hợp nghĩa nền đã có; guard C theo cung gốc của2.2/2.3 còn nguyên. Không migration, backfill hoặc thay gói bán hàng.

Offline trên đúng bài Luna:

- Nội dung gốc vẫn qua validator2.3; với2.4, tái hiện `AI_MIXED_ATTRIBUTION`.
- Trong **bản sao mock thủ công**, tách lời Quan khỏi câu nối sang Phu;2.4 tiếp tục phát hiện `AI_SOURCE_QUALIFIER_LOST`.
- Bổ sung “có sự trợ giúp qua một giai đoạn” vào đoạn lời Tả/Hữu trong bản mock; bản này qua2.4, không cần lặp sắc thái ở mọi câu tổng hợp.

[Bản mock đọc được](../.local/ai-paid-attribution-20261102/phu-the-corrected.mock.md), [basis/IDs và kết quả từng bước](../.local/ai-paid-attribution-20261102/phu-the-corrected.mock.json), [tổng hợp dry-run](../.local/ai-paid-attribution-20261102/dry-summary.json). Đây là **mock biên tập thủ công, không phải phản hồi Luna/Astra2.4**. File result, nội dung, phiên bản và receipt gốc không bị thay.

Bảy kết quả thật2.1/2.2/2.3 được đọc lại qua validator đúng version; input mới và input job cũ khớp hash canonical, không đổi facts/nguồn. Lượt dry đầu dùng JSON.stringify nhầm thứ tự key của JSONB là input drift; sửa **harness so sánh** sang `readingHash` hiện có, không sửa dữ liệu/expected nguồn. Chỉ có lỗi harness này, test ứng dụng không fail trong các lượt đã chạy.

## Kiểm thực sự chạy

- **97/97 mock test trong6file**, gồm22ca mới: dấu nối/basis, diễn đạt thời gian tương đương, Unicode NFD/hoa-thường, không ép lặp, không suy tất cả tổng hợp thành lời nguồn, giữ đường nghĩa nền2.3/2.4, references/C/y khoa, registry/reader/provider-error. Fetch thật bị chặn trong launcher.
- **3/3 DB mock** trên instance test mới55455, identity/name/data_directory đã kiểm; bản sao QA riêng để chạy test, không DB lịch sử/gốc. Kiểm writer2.4, quyền/payment lặp/read không CREATE và V1pending theo test hiện có. Không native worker/supervisor. DB test đã dừng, data giữ lại.
- Typecheck/build Node24.22.1 cách ly/key rỗng/AI tắt/DBcổng1 đạt; BUILD_ID `gqnOEx0x76q3mjqLnY3Ji`. Không serve/restart web hoặc browser/mobile mới; không toàn E2E/PDF.
- **0CREATE/0GET OpenAI thật,0Luna/0Astra, chi phí API0USD.** Chỉ web tài liệu chính thức được tra; không endpoint Models/Responses.

[Logs, hash nguồn build và bằng chứng](../.local/ai-paid-attribution-20261102/manifest.json). QA3118 giữ PID68941; QA3062/3070 không cập nhật/restart, không worker thanh toán/engine/quyền/Mệnh hoặc BửuĐình bị sửa.

Phạm vi hoàn tất là ngăn hai dạng lỗi đã tái hiện và hướng dẫn writer2.4. Chưa xác minh model thật tuân thủ ổn định hoặc nâng chất lượng thương mại; dừng ở mock, không tự gọi lại để thử văn.
