# Nô–Tử–Phu–Tài: bổ sung nguồn có điều kiện, chỉ mock

02/11/2026, baseline `main@49732b2`. Tracked/index sạch lúc bắt đầu; giữ nguyên `buu-dinh-7parts/` và `docs/handoff/`. Không API, DB, worker/supervisor, sửa lịch sử, engine hoặc cập nhật QA3062/3070. QA3118 vẫnPID68941; không khởi web khác.

## Đã hoàn thiện

Retrieval **paid-retrieval-1.6.0** mở rộng bộ đọc đoạn sách hiện có để nhận **phương pháp nhómD**; không dựng pipeline/queue/CMS mới. Prompt2.5 và ReadingV2 giữ nguyên. Chỉ nguồn có hash/điều kiện hợp lệ được lấy. Bổ sung bốn đơn vị vào index có phiên bản riêng: **3method và1foundation**, không có luận điểm direct mới.

- **Nô:** thêm cách phân biệt chủ thể đối đãi, bạn ngang vai/cộng sự với thân nhân đã biết rõ. Dùng cùng ba lời Lộc tại Nô để phân tích giao du, kỳ vọng đáp lại và kết quả hợp tác; không lấy cảm tình làm chứng cứ chân tình, trợ vốn hoặc độ tin cậy.
- **Tử:** thêm cách phân biệt nghĩa hẹp về quan hệ với con và các nghĩa khác như vãn bối/thuộc cấp/giao du/chi tiêu. Giúp bài không trộn chủ thể; không lấp Tử VCD bằng lời chi của mệnh tạo hoặc tên phụ tinh.
- **Phu:** thêm nền ví dụ **Mệnh Vũ Khúc–Thiên Phủ và Phu có Phá Quân**. Đủ để đọc hai nhịp “nắm chắc trước khi làm” và “quả quyết/không thích gò bó” cạnh nhau ở mức tổng hợp gợi mở, không phải tính cách người phối ngẫu đã xác nhận hoặc hệ quả hôn nhân. Đây là nguồn trực tiếp có nhắc cả hai phía trong một ví dụ, sâu hơn việc chỉ đặt hai đoạn không liên quan cạnh nhau.
- **Tài:** thêm phương pháp phân biệt giao dịch nghề nghiệp có nhập/có xuất vốn tại Tài với chi ngoài công việc được xét ở Tử. Giữ riêng chủ thể mệnh tạo; không gộp mọi khoản xuất tiền thành hoang phí hoặc phép Liêm–Đại Hao.

## Bốn phiếu nguồn

Nguồn mới đều từ **Nguyễn Anh Vũ — Trung Châu Tử Vi Đẩu Số, Tứ Hóa Phái, phần2**, kho OCR đã xử lý. Tái dùng checkpoint/hồ sơ trong SOURCE-LIBRARY; không mở PDF/ảnh mới, không tuyên bố đã hiệu đính toàn trang hoặc chứng nhận chuyên môn độc lập. Không sửa Bửu Đình. Đây là diễn ý có giới hạn của Codex, không quyết định publish.

1. **`thp2-no-relationship-scope` — PDF267,269, §2.8.1/2.8.2.** Mệnh đề: Nô xét bạn ngang vai, đồng sự, hợp tác và đối đãi; Huynh là quan hệ huyết thống, phía Nô gồm người ngoài chưa biết rõ như thân nhân. Điều kiện chọn chỉ là đúng cung Nô đã lưu, vì đây là phương pháp xác định chủ thể, **không điều kiện chứng minh lời cá nhân**. Không dùng các vế bệnh, sinh tử, hung ách, đào hoa hay phi hóa trong phần khác của trang. Đủ làmD; chưa thêm nghĩa Thiên Lương hãm hoặc phép Lương–Lộc.
2. **`thp2-tu-family-scope` — PDF180, §2.4.1.** Mệnh đề: nghĩa hẹp về người là con, nghĩa rộng còn vãn bối/học sinh/thuộc cấp; giữ vai trò đang luận, không đổi chủ thể. Điều kiện: đúng chủ đề Tử trong snapshot. Không dùng các vế sinh sản, giới tính, tính dục, thành tựu hoặc phẩm chất trẻ; không lấy sự hiện diện của cung làm bằng chứng đã có con. Đủ làmD; chưa thêm lời cá nhân cho mọi Tử VCD.
3. **`thp2-tai-transaction-spending` — PDF199–200, §2.4.5.** Mệnh đề: Tài là giao dịch đối ngoại, bán sở trường/kỹ năng/thể lực/hàng hóa và có thể xuất vốn; Tử là góc xét chi sau khi kiếm tiền. Điều kiện: phương pháp phân định chủ đề, giữ riêng cách đọc của tác giả. Không tự chuyển sang quy tắc Tân Biên; không suy nghề, mức tiền, khả năng thu hồi vốn hoặc lợi nhuận. Đủ làmD, không phải nghĩa Liêm hoặc Hao và không đánh giá chất lượng đầu tư.
4. **`thp2-phu-vu-phu-pha-context` — PDF173,179, §2.3.7, trước hình15.** Mệnh đề: ví dụ mô tả phía Mệnh Vũ–Phủ “phần nhiều” cương cường/thực dụng/vững vàng, không hành động khi chưa nắm chắc; phía Phá mạnh/quả quyết/không thích gò bó. Điều kiện AND: **Vũ Khúc tại Mệnh + Thiên Phủ tại Mệnh + Phá Quân tọa Phu**, đều source-traced, không lấy sao chiếu thay tọa. Chỉ chọn mô tả hai phía đầu ví dụ. Câu sau về áp lực/khó ly dị có nhánh sát tinh tụ hội và Thiên La Địa Võng chưa giải điều kiện; không lấy kết luận đó, không bỏ nhánh để suy “hôn nhân bền”. Không dùng hình15 để gán thêm sao/chi. Đủ làm **B/reference-only/foundation** cùng lời trực tiếp phù hợp, không phải direct hoặc phép Phá–Đà–Hỏa. Giữ lượng từ và không khẳng định người phối ngẫu thật có các đặc điểm ấy.

Không thêm quy tắc chế hóa hoặc thay bên thắng giữa tác giả. Những mô tả còn khẳng định mạnh/phán hôn nhân, bệnh, sinh sản, số con hoặc nhân phẩm không được đổi thành câu mềm để lách phạm vi.

## Cơ chế an toàn và tương thích

`paid-library.ts` ưu tiên `paid-passages/index-v16.json`, thiếu file này thì đọc `index.json` cũ; file mới sai schema/hash không được âm thầm coi như đã tải thành công. **Index cũ giữ nguyên byte**, loader cũ không thấy loại mới. Bảy đơn vị cũ nguyên object, index mới11đơn vị. Contract cấu trúc thư viện vẫn1.0.0, thêm kind `method` tương thích reader mới; content digest/phiên bản retrieval phân biệt đầu vào. Không thay job/attempt đã lưu hoặc tái tạo input khi GET.

Anchor sự hiện diện cung chỉ được phép cho method, kiểm ID location và path snapshot; không được dùng cho direct/foundation. Method thànhD/reference-only/background-method; validator sẵn có chặn D đứng riêng thành luận giải hoặc mang basis source-interpretation. Method không được `replaces` một lời sao. Foundation vẫn cần đủ các neo sao đã truy nguồn, không tự nâng thành direct.

Giữ cap4đoạn thư viện/14KB, A12/B10/C8/D3. Khi có method thư viện đúng chủ đề, giữ hai method chuyên biệt cũ trước mục quy trình chung. Không tăng cap để nhét thêm nguồn. Nguồn C và điều kiện của mọi nguồn cũ giữ nguyên.

## Dry-run bốn cung

Cùng snapshot QA đối chứng các vòng trước, **159facts nguyên**, không an lại, snapshot/freeMenh không sửa. [Danh sách trước/sau, nguồn loại và lý do](../.local/ai-paid-four-sources-20261102/dry-summary.json).

- Nô: direct **3→3**, thêmD mới; bỏ khỏi packet mục quy trình chung `inherited-NPL-01` theo cap, giữNPL02/42. Ba lời trực tiếp đều dựa Lộc tại Nô, không coi là ba tổ hợp sao độc lập.
- Tử: direct **1→1**, thêmD; bỏNPL01, giữNPL07/46. Nhánh Lộc/Kỵ **tại Tử** vẫn bị loại đúng điều kiện; Lộc thực nằm Nô, không chuyển sang Tử. Nguồn trực tiếp vẫn là chú giải quan hệ từ cách đọc Lộc tại Nô, chưa đủ toàn bộ Tử VCD.
- Phu: direct **3→3**, thêm1Bfoundation với ba neo Mệnh/Phu; không bỏ nguồn cũ. Ba phép thử xóa riêng Vũ Khúc, Thiên Phủ hoặc Phá Quân khỏi bản sao packet đều loại foundation vì `condition-not-met`. Không sửa facts thật để khớp.
- Tài: direct **3→3**, thêmD; bỏNPL01, giữNPL22/27. Thai–Tọa vẫn không được lấy vì thiếu Tam Thai đúng cung. Giới hạn Hao theo bảng khác vẫn có; không đổi độ sáng hoặc coi Liêm–Hao đã giải.

Các bản sau là **mock biên tập thủ công, không phải kết quả Astra/Luna, không chèn vào báo cáo**. Mỗi bản có JSON input/knowledge/prompt/basis và tham chiếu thật trong cùng thư mục:

- [Nô: kỳ vọng, cảm tình và hợp tác](../.local/ai-paid-four-sources-20261102/Nô-Bộc-proposed.mock.md).
- [Tử: giữ chủ thể quan hệ với con](../.local/ai-paid-four-sources-20261102/Tử-Nữ-proposed.mock.md).
- [Phu: hai nhịp ra quyết định](../.local/ai-paid-four-sources-20261102/Phu-Thê-proposed.mock.md).
- [Tài: tạo nguồn, xuất vốn và chi ngoài nghề](../.local/ai-paid-four-sources-20261102/Tài-Bạch-proposed.mock.md).

Tất cả mock khai `limited`, qua validation2.5. Không lấy việc qua validator, số nguồn hoặc nguồn nền mới làm bằng chứng đạt bài chuyên sâu. Phần nối đều basis ai-synthesis, không gán phép suy ra cho tác giả. Prompt2.5 không đổi trong lượt này.

## Kiểm thực chạy và bảo toàn

- **122/122 pure test,7file**: library, topic-sources, context-guide, editorial, V2/provider mock, safety, adapter. Có D không thể đứng riêng, location không thể cấp direct/foundation, vị trí/path thiếu/sai, method không thay lời sao, AND nhiều cung, index riêng/legacy fallback và invalid mới fail closed; giữ guard nguồn/thời gian/y khoa và SDK chọn version đã lưu.
- Dry bốn cung qua validator; ba negative probes nguồn Phu; **8bài thật cũ** qua đúng saved version, hash giữ nguyên. Không chạy provider/DB để kiểm. [Preservation](../.local/ai-paid-four-sources-20261102/preservation.json).
- Typecheck/build cuối Node24 cách ly, key rỗng/AI tắt/DBcổng1 đạt;607file, BUILD_ID `evBPgavDwW_vpkiwAE2W9`. [Test](../.local/ai-paid-four-sources-20261102/tests-final.log), [typecheck](../.local/ai-paid-four-sources-20261102/typecheck-final.log), [build](../.local/ai-paid-four-sources-20261102/build-final.log).
- Lỗi đầu: mock D đặt limitations rỗng nên schema từ chối trước cổng nguồn; thêm giới hạn mock hợp lệ, giữ expected chặn D. Lượt đầu107pass/1fail; lượt sau121/121; sau thêm bảo vệ index riêng122/122. Không đổi expected lịch sử để xanh. Một script Unicode bị từ chối trước thực thi, sau đó dùng fileUTF8; không thay sách để sửa lỗi công cụ. Dry đầu cho thấy capD loạiNPL27, đã ưu tiên method chuyên biệt hơn mục quy trình chung trước khi chốt.
- Không DBintegration/E2E/PDF/browser/mobile mới, vì không đổi store/quyền/UI. Không restart QA hoặc xử lý queued. **0OpenAI CREATE/GET,0USD**. Không tuyên bố đã kiểm chất lượng model mới.

## Kho private và điểm dừng

Kho chữ, index và bản mock nằm ngoài Git. [Bộ nguồn private16artifact và hash](../.local/ai-paid-four-sources-20261102/source-bundle-manifest.json): index cũ + index-v16 +14trang chữ/OCR, giữ layout knowledge/books. Index mới SHA256 `9e245370be6e1a85d1e960085eae9e933a027480b6c0a2ebadff97d6586b03ac`; index cũ `113cd5b37ecdb44edbda8a2f3b64848bc9f073552fc8f14e3f0effba070cad2f`. Đây là bản sao cùng máy/volume, không backup ngoài máy hoặc bằng chứng đã deploy. Khi sau này triển khai phải chuyển cả code và tài sản private có hash, không chỉ commit Git.

Đã giải quyết một phần thiếu ngữ cảnh/phân định chủ thể và có nền liên hệ Mệnh–Phu từ ví dụ thật của nguồn. **Chưa giải**: nghĩa Lương hãm phối Lộc tại Nô; nền toàn diện TửVCD; phép Phá–Đà–Hỏa; phép Liêm–Đại Hao. Không có mệnh đề mới đủ điều kiện cho các phép ấy trong phần kho đã rà, không nói đã khảo cứu hết kho sách. Chưa nghiệm thu thương mại11cung. Dừng sau mock, không tự gọi API hoặc triển khai QA3062/3070.
