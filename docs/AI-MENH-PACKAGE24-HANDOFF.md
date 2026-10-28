# Gói 2.4 — Kho biên tập Mệnh V1 có phiên bản và lịch sử duyệt

Ngày 28/10/2026. Baseline `main@a234263`, tracked/index sạch trước sửa; thư mục Bửu Đình chưa commit được giữ nguyên. Chỉ cập nhật web QA3111; không QA3062/3070/3101, worker thanh toán, migration, Gói 3 hoặc Live. Không gọi OpenAI trong task này: **0 CREATE, 0 token mới, $0**. Ba phản hồi Luna có sẵn từ Gói 2.3 được đối chiếu lại, không sinh lại.

## Phạm vi nguồn và số lượng thực tế

Pipeline đang dùng: snapshot/receipt → frozen `continuous-report-1.14.0` → `customerReport` **1.79.0**, catalog **interpretation-1.75.0** → policy `freeParagraphIds` → `freeMenhParagraphs` → đơn vị đã render → chọn bản biên tập hợp lệ hoặc V1 gốc → lưu `freeMenh`. Không sửa engine, evaluator, rule, quyền hoặc văn V1 lịch sử. Các nhóm nguồn Mệnh được đọc từ chính danh sách của renderer hiện có: life-elements, life-body, structure, action, learning; export chỉ đọc, không dựng bộ chọn lời khác.

- **51 mẫu rule nguồn Mệnh** trong năm nhóm: **45** có thể thuộc phần miễn phí, **6** nhóm Mệnh–Thân giữ ngoài phạm vi theo policy hiện hành. Mẫu template chưa được render không được gửi biên tập như văn đã áp dụng.
- Cả 51 rule nguồn còn **draft**. Có hồ sơ/căn cứ không có nghĩa đã được chứng nhận đúng về con người thực tế. Trạng thái duyệt lời biên tập là một lớp riêng, không nâng trạng thái rule.
- Tập hữu hạn **28 lá số**: A/B/C đã lưu từ Gói 2.1, một bản QA V1 có sẵn D và 24 phép tính engine QA mới, chọn trước khi xem kết quả biên tập. Hai đầu vào kiểm thử công khai × 12 giờ; không ghi các mẫu tính thuần này vào thư viện/báo cáo người dùng. Không dùng tên/ID/ngày sinh để chọn lời.
- Quan sát **109 lần xuất hiện**, **73 đơn vị render khác nhau**. Có 22 đơn vị dùng lại chính xác, tương ứng 36 lần xuất hiện lặp. Đây là số trong tập QA, **không phải tổng mọi đơn vị có thể sinh từ V1**.
- 31 mẫu nguồn đã xuất hiện; 14 mẫu có thể miễn phí chưa xuất hiện trong tập này. Không suy chúng không thể xảy ra hoặc cần bỏ điều kiện để tăng phủ.
- 0 nhóm cùng toàn văn nhưng khác ngữ cảnh; 194 cặp gần trùng theo Jaccard từ ≥0,82, trong đó 187 cặp có cùng metadata điều kiện nhưng văn đã render/ngữ cảnh khác. Đây chỉ là gợi ý đọc soát; không gộp hoặc dùng lại theo độ giống.

[Kiểm kê đầy đủ: văn gốc, điều kiện, ngoại lệ, nguồn, giới hạn, từng lần xuất hiện](../.local/ai-menh-package24-20261028/inventory.json), [tóm tắt](../.local/ai-menh-package24-20261028/inventory-summary.json), [đối chiếu từng lá số](../.local/ai-menh-package24-20261028/coverage.txt). Bản kiểm kê bàn giao dùng nhãn A/B/C/D/Q01–Q24, không chứa tên/ngày sinh/chứng thực truy cập. Snapshot đầu vào đầy đủ nằm riêng trong file private, không Git.

Nguồn được giữ đúng từng rule: các nhãn Tân Biên, Hàm Số, Tử Vi Tổng Hợp, Thiên Lương Toàn Thư, nhãn kết hợp Hàm Số–Tử Vi Nghiệm Lý, Trung Châu Thiên Cơ Luận và nguồn web bổ trợ Cổ Học về Vũ Khúc. Đây là **7 nhãn tham chiếu**, không phải 7 sách độc lập hoặc 7 bằng chứng đồng thuận. Kiểm kê giữ trang/vị trí, điều kiện nguồn, ngoại lệ và phần chưa biết; không đọc/quét lại PDF hoặc mở dự án lấp rule.

## Kho bền vững và quy trình duyệt

Dùng lại `AI_V1_EDIT_DIR` private và cơ chế file bất biến hiện có, không CMS/queue/database mới. QA3111 tiếp tục trỏ `.local/ai-menh-package23-20261028/edits`.

- `sources/<contextHash>.json`: ID V1 ổn định theo ruleID@version, unitHash, toàn văn gốc, sources/conditions/exceptions/limits, report/catalog version và thời điểm đăng ký. Context hash có thêm catalog version; ID đoạn trong báo cáo chỉ nằm trong nhật ký occurrence, không tham gia hay làm đổi hash đơn vị cũ.
- `requests/`, `candidates/`, `errors/`: reservation một lần, kết quả provider và lỗi/unknown cũ giữ nguyên. Khóa candidate vẫn gồm toàn bộ unit, model và prompt thực tế; không relabel ba bản cũ thành prompt mới.
- `reviews/<candidateKey>/<contextHash>/<sequence>.json`: nhật ký nối tiếp draft/approved/rejected, candidateHash, phiên bản nguồn, năm tiêu chí có chứng cứ, ghi chú, technical findings và updatedAt. Phải đưa đúng previousReviewId. Ghi temp hoàn chỉnh rồi hardlink vào sequence slot; hai người/lệnh cùng duyệt không đè nhau, lệnh stale bị từ chối. Không overwrite hoặc xóa quyết định cũ.
- Chỉ approved với đủ năm tiêu chí pass, candidate hash đúng, không lỗi kỹ thuật và đúng toàn bộ điều kiện/nguồn/V1/catalog/model/prompt mới dùng. Không có review cho phiên bản/điều kiện mới thì V1 gốc. Prompt 1.1 được ưu tiên; bản 1.0 chỉ được dùng nếu được đối chiếu riêng đúng context. Dữ liệu review hỏng trả fallback, không tự phê duyệt.
- Quyết định chỉ áp dụng khi tạo báo cáo mới. `freeMenhView` mở lại chỉ đọc text đã chốt trong báo cáo; không xem kho mới hoặc gọi API. Không đổi báo cáo cũ khi thêm/từ chối một bản biên tập.

CLI server nội bộ `ai:inventory-menh <private-QA-samples.json>` nhận 1–64 snapshot có nhãn riêng, chỉ kiểm kê/đăng ký nguồn, không AI. `ai:edit-v1 register <private-source-bundle.json>`, `list`, `inspect <context-id>` không gọi provider. Bundle chứa `{unit,source}`. `prepare <bundle>` chỉ được operator chủ động gọi cho **một** đơn vị; đây là lệnh có thể tính phí, không nằm trong luồng lập/mở lá số. `review <candidate-key> <private-review.json>` chứa candidateHash, source, assessment; assessment có requestedState, previousReviewId, note và checks: factsAndScope, conditions, noNewClaims, meaning, sources. Mỗi check phải pass/fail/uncertain và giải thích đối chiếu; uncertain/fail hoặc technical finding không thể thành approved. Không tự chạy batch hoặc retry reservation chưa rõ kết quả. CLI kiểm kê đã chạy thật với 28 snapshot trên QA, lưu inventory bất biến trong kho; [receipt không gọi model](../.local/ai-menh-package24-20261028/inventory-cli.json).

Kho private cần nằm trên volume bền vững và được sao lưu cùng candidates/sources/reviews/requests; không nằm trong build output hoặc Git. Quyền file 0600, thư mục 0700 theo cơ chế hiện có. Trước tích hợp host khác phải chuyển cả journal/context, không chỉ thư mục approved kiểu cũ. Các artifact approved cũ vẫn giữ nguyên để truy vết, không còn đủ điều kiện tự chọn cho báo cáo mới nếu thiếu journal đúng context.

## Biên tập và chất lượng

Phân tầng giữ nguyên `AI_FREE_EDIT_MODEL=gpt-6-luna`, `AI_PAID_READING_MODEL=gpt-6-astra`; không fallback model. Prompt mới **menh-v1-copyedit-1.1.0** nhấn giọng Tinh Luận điềm đạm, câu cụ thể, kết nối tự nhiên nhưng không tăng mức khẳng định, bỏ lượng từ/phủ định, đích Mệnh hay ngoại lệ. Khi không chắc tương đương thì giữ nguyên câu gốc. Prompt 1.0 giữ nguyên từng byte cho provenance cũ. Responses/Structured Outputs dùng SDK server hiện có; [tài liệu Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), [hướng dẫn prompt](https://developers.openai.com/api/docs/guides/prompt-engineering). Không kiểm lại quyền bằng request API trong task này.

Trước duyệt có kiểm schema/số/tên sao và soát thêm can–chi, Mệnh/Thân, vị trí, lượng từ, phủ định. Các kiểm này có thể chặn cách viết tương đương hợp lệ và không phát hiện hết sai nghĩa; **không thay việc đọc đối chiếu đầy đủ**. Codex đã đọc soát ba phản hồi cũ và ghi chứng cứ cho từng tiêu chí, không gọi là thẩm định chuyên môn Tử Vi.

Kho hiện có **73 đơn vị**, **3 đã có văn Luna**, **2 approved**, **1 rejected**, **70 draft chưa sinh**. Đơn vị chưa sinh ghi Luna/model/prompt thực tế là null, tách riêng cấu hình dự kiến; không biến draft thành kết quả AI giả. [Danh mục nguồn/bản biên tập/trạng thái](../.local/ai-menh-package24-20261028/editorial-library.json), [toàn văn trước/sau và lý do duyệt/từ chối](../.local/ai-menh-package24-20261028/examples.txt), [receipt review](../.local/ai-menh-package24-20261028/existing-reviews.json).

Ví dụ approved: V1 “Về cách hành động, lời luận nhắc đến sự quả quyết, cương nghị và khả năng tổ chức, đồng thời có mặt hiếu thắng. Đây là những nét riêng gắn với Vũ Khúc, chưa phải một kết luận chung về tính cách.” → Luna “Về cách hành động, lời luận nhắc đến sự quả quyết, cương nghị, khả năng tổ chức và tính hiếu thắng. Đây là những nét riêng gắn với Vũ Khúc, chưa phải kết luận chung về tính cách.” Giữ bốn nét và giới hạn, chỉ gọn câu. Bản rejected đổi “các sao chiếu về Mệnh” thành “các sao hội chiếu”, mất đích Mệnh và thêm nhãn ngoài gốc; giữ V1.

Đây đều là **phản hồi thật Gói 2.3 bằng prompt 1.0**, không phải văn mới bằng 1.1. [Prompt 1.1 dry-run](../.local/ai-menh-package24-20261028/prompt-1.1-dry-run.txt); chưa có kiểm văn/API thật cho prompt này. Không gọi thêm để tối ưu.

## Bao phủ và phần thiếu

Tập QA có 2–7 đoạn miễn phí/lá số, tất cả chỉ là phần V1 khớp điều kiện, không luận Mệnh hoàn chỉnh. Bốn ca vô chính diệu: B/Hợi 2 đoạn, Q03/Sửu 2, Q17/Tỵ 2, Q24/Tuất 3. Q17/Q24 có phép xét ngũ hành vô chính diệu `npl.life-foundation-empty`; giữ riêng với sao chiếu. Cả bốn chưa khớp nhánh chú giải sao chiếu Tân Biên đang hỗ trợ; frozen lifeGaps đã ghi đúng giới hạn này. Không nói mọi lời VCD đều thiếu, không tự thêm sao/cách cục để lấp phần thiếu. Các chính tinh không xuất hiện bằng tên trong phần miễn phí được liệt kê chỉ như kiểm từ ngữ, không coi đó là phép đo chuyên môn đầy đủ.

## QA đã chạy và bảo toàn

**45/45 test** trên DB test riêng: 30 AI, 4 editorial, 5 review, 6 scope; điều kiện/version/model, review stale/đồng thời/chuỗi hỏng, pass/fail/uncertain, không mất phủ định/phạm vi, legacy prompt, không dùng lại theo gần trùng, fallback, lưu selection rồi reject không đổi lịch sử, SSR/lưu–mở không API và 11 cung. Typecheck và production build đạt. Cảnh báo nhiều lockfile Next.js đã có, không phải lỗi build. [Test](../.local/ai-menh-package24-20261028/test.log), [typecheck](../.local/ai-menh-package24-20261028/typecheck.log), [build](../.local/ai-menh-package24-20261028/build.log).

Hai báo cáo QA mới qua form thật: `c1c934e5…` có 7 đoạn ngay, 2 Luna đã duyệt/5 gốc; `6cf783ae…` VCD có 2 gốc, 0 Luna. Browser 360/390 không tràn ngang; đúng 4 tab, Mệnh mở mặc định, căn cứ đóng–mở, 11 cung khóa AI, không nhãn chờ. Refresh/rời trang/mở lại vẫn đúng nội dung; nạp lại build cuối vẫn hiển thị. Không tạo job Astra hay request Luna từ thao tác này. [Ảnh VCD 360](../.local/ai-menh-package24-20261028/void-360.png), [ảnh 2 đoạn duyệt 390](../.local/ai-menh-package24-20261028/primary-390.png), [reopen](../.local/ai-menh-package24-20261028/reopen-ui.json).

13 file báo cáo trước giữ hash, hai lời Luna đã lưu vẫn đọc nguyên; 8 artifact biên tập cũ giữ hash; 12 job AI giữ status/attempt/result/responseID, kể cả pending/uncertain/completed. Main 282 file/8 bảng và PID/thời điểm khởi động của QA3062/3070/3101/worker thanh toán nguyên, main không thêm bảng AI. Chỉ web QA3111 nạp build mới; AI worker vẫn dừng. [Đối chiếu](../.local/ai-menh-package24-20261028/verification.json), [runtime](../.local/ai-menh-package24-20261028/runtime.json), [bảo toàn main](../.local/ai-menh-package2-20261027/protected-after.json). Không full E2E/PDF, không migration hoặc sửa quyền/lịch sử/Toàn thư.

## File thay đổi và điểm dừng

Mã: `lib/ai/v1-edit-storage.ts`, `v1-review-store.ts`, `v1-inventory.ts`, `v1-edit.ts`, `free-menh.ts`; export danh sách nguồn trong `lib/internal-review/tanbien-reading.ts`; CLI `scripts/edit-v1-unit.ts`, `inventory-menh-v1.ts`; `package.json`; ba file test `ai-menh`, `ai-v1-edit`, `ai-v1-review`. Tài liệu: bàn giao này cùng HANDOFF, CURRENT_STATUS, V1-DELIVERY-PLAN, BUSINESS_RULES, DECISIONS, ARCHITECTURE, TESTING. Commit thực tế được ghi trong bàn giao cuối và Git; không gắn số commit dự đoán vào tài liệu trước khi commit.

Đã hoàn thiện cơ chế kho/kiểm kê/duyệt trong phạm vi này; **chưa biên tập hết 73 đơn vị**, chưa khảo sát hết không gian lá số, chưa xác minh văn prompt 1.1 bằng API thật. Trước QA3062: cần quyền tích hợp riêng, kiểm volume/backup/cấu hình model và chuyển cả journal, tiếp tục duyệt có hạn những đơn vị được chọn. V1 còn draft và thiếu phần nội dung; không có lỗi runtime chặn các ca đã kiểm, không coi đây là nghiệm thu chuyên môn/toàn bộ Mệnh. Không tự chạy batch, thêm API, QA3062/3070 hoặc Gói 3.
