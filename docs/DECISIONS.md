# Sổ quyết định Tinh Luận

Cập nhật 20/10/2026. [BUSINESS_RULES](BUSINESS_RULES.md) diễn giải hợp đồng hiện hành; [backlog duy nhất](V1-DELIVERY-PLAN.md) quản lý công việc. Sổ này không phải phê duyệt chuyên môn và không tự cho phép thực thi task tiếp theo.

## Cách đọc bằng chứng

- **U:** lời chủ dự án trực tiếp trong lịch sử chat của task. Trích ngắn kèm tên gói để thread sau tìm. Chat chưa được xuất thành bản ghi có permalink/chữ ký; dẫn tài liệu dưới đây là bản ghi dự án hỗ trợ truy vết, không thay chứng cứ U.
- **D:** bàn giao/audit trên đĩa; xác nhận nhóm đã ghi gì, tự nó không chứng minh chủ dự án đã phê duyệt.
- **C:** code/symbol; chứng minh cách triển khai, không chứng minh ai quyết định.
- Khi chỉ có D/C, ghi **lựa chọn triển khai/đề xuất**, không gắn nhãn “chủ dự án đã chốt”. Không tự đặt ngày cho những tin chat không có mốc xác minh.

## Những quyết định có xác nhận trực tiếp

### Q01 — Mục tiêu đủ 12 cung, beta và điều kiện mở bán

**Đã chốt.** U, task tiếp tục từ1.52: “Tôi giữ mục tiêu báo cáo đầy đủ12 cung”; task G2: “Chưa mở bán hoặc bật SePay Live”. U mới nhất giữ baseline1.53/catalog1.51, Live tắt. [D: kế hoạch V1-4/V1-7](V1-DELIVERY-PLAN.md), [CURRENT_STATUS](CURRENT_STATUS.md). Không suy đủ tiêu đề/đoạn hoặc test đạt là hoàn chỉnh chuyên môn. Không cam kết ngày đủ12cung.

### Q02 — G2, lịch sử và phân quyền

**Đã chốt.** U G2: “Báo cáo mới: miễn phí luận cung Mệnh; các cung khác cần quyền trả phí”; “Giữ nguyên quyền và hạn của mọi báo cáo cũ”; kiểm tại server, không gửi nội dung khóa xuống trình duyệt. U G3 giữ nguyên xử lý năm rule Mệnh–Thân đang giữ riêng. [D: G2](G2-READING-SCOPE-QA.md), [G3](G3-CUSTOMER-WORKSPACE-QA.md); C: `captureReadingPolicy`/`projectReading` trong [reading-policy.ts](../lib/trial/reading-policy.ts), `customerReadingAccess` trong [reading-access.ts](../lib/trial/reading-access.ts).

**Không suy rộng:** việc đề xuất ND02 mở ba nhóm vào miễn phí chưa được duyệt. Quyền đọc bản cũ không biến ID thành quyền truy cập.

### Q03 — Danh tính khách, recovery, admin

**Đã chốt.** U G1a: “Không tự gộp tài khoản/báo cáo theo email hoặc tên”; chỉ liên kết từ sở hữu/khôi phục đã xác minh; không gia hạn/admin. U G5 hỏi tài khoản quản trị, chủ dự án trả lời **“Chỉ tài khoản A”**. [D: G1a](G1A-GOOGLE-LOGIN-QA.md), [G5](G5-ADMIN-OPERATIONS-QA.md); C: [accounts.ts](../lib/customer-auth/accounts.ts), [admin/auth.ts](../lib/admin/auth.ts). A là nhãn nghiệm thu, không email hardcode để tự nhận dạng ở thread mới.

U gói recovery yêu cầu hash token, hạn, dùng một lần, chỉ tiêu thụ khi bấm tiếp tục; không hồi sinh quyền thu hồi. U Gmail/hợp nhất giới hạn địa chỉ thử. [D: QA-MAIN-EMAIL-MERGE](QA-MAIN-EMAIL-MERGE.md); C: [recovery.ts](../lib/trial/recovery.ts), [gmail.ts](../lib/notifications/gmail.ts). Chưa có phép gửi đại trà.

### Q04 — Test checkout và dịch vụ tạm hoãn

**Đã chốt phạm vi Test, chưa chốt thương mại.** U G4 chỉ QA được chỉ định; phản hồi **“Cả A và B”**. Giá/hạn là cấu hình kiểm thử có nhãn, chưa giá thương mại. U tạm hoãn G1b Zalo chờ xét duyệt; các task nội dung chưa mở G6 hoặc máy chủ. [D: G4](G4-TEST-CHECKOUT-QA.md), [kế hoạch](V1-DELIVERY-PLAN.md); C: [checkout/test.ts](../lib/checkout/test.ts). Con số1.000đ/72giờ là lựa chọn cấu hình nghiệm thu, không được ghi thành giá/hạn bán hàng được duyệt.

### Q05 — Nội dung nguồn và AI biên tập

**Đã chốt.** U task tiếp tục1.50 cho AI gom ý/giải thích từ nhận định đã xác minh, không thêm kết luận/chọn bên thắng, ưu tiên văn dùng lại; các task1.51/1.52 giữ điều kiện và không đổi lời bệnh/sinh tử/phẩm hạnh thành lời quan hệ nhẹ để tăng độ phủ. U P1/P2 giữ ưu tiên Thiên Lương khi xung đột trực tiếp cùng phạm vi đã xác minh. [D: audit bổ luận](TANBIEN-MENH-THAN-SUPPLEMENT-AUDIT.md), [BUSINESS_RULES](BUSINESS_RULES.md). Không áp ưu tiên trường phái cho mọi câu chỉ vì tên sao giống nhau.

### Q06 — Tật Ách: chỉ hướng thẩm định

**Đã chốt hướng, chưa duyệt mẫu/publish.** U gần nhất: “Tôi đồng ý dùng hướng ‘chú giải truyền thống theo cấu trúc’ ... Đây chưa phải duyệt hai đoạn mẫu, chưa cho phép publish và không được tính là hoàn thành luận cá nhân cung Tật Ách.” U1.52 cấm suy bệnh thực tế/chẩn đoán/thời điểm tử vong/khuyên điều trị. [Toàn văn hai mẫu và điều kiện](BUSINESS_RULES.md#5-toàn-văn-hai-mẫu-tật-ách-để-duyệt); [D: đề xuất trong backlog](V1-DELIVERY-PLAN.md#tật-ách--đề-xuất-để-duyệt-chưa-publish). Hai mẫu Đồng–Cự/Cơ–Âm chưa giải phối hợp cứu/tác và Mệnh–Thân–Phúc; không tính192cung Tật đã có luận.

### Q07 — Toàn thư và cách hiểu phê duyệt

**Đã chốt xuất bản đúng34bài.** U: “Tôi duyệt nội dung bản mới và đồng ý xuất bản 34 bài Toàn thư V1 trên QA3062”; loại bài bổ trợ Vũ–Khúc và fixture; không ghi thành phê duyệt chuyên môn. [D: nhật ký Toàn thư trong kế hoạch](V1-DELIVERY-PLAN.md); C: [model.ts](../lib/encyclopedia/model.ts). Bản công khai và draft tách nhau; không xuất bản nội dung mới chỉ vì34bài cũ đã được phép.

### Q08 — Bộ tài liệu và điểm dừng của phiên tài liệu trước

**Đã chốt.** U task khép tài liệu yêu cầu root AGENTS + sáu tài liệu và HANDOFF; chỉ sửa tài liệu, chưa ND03. Kế hoạch giữ một backlog, giữ ứng dụng/dữ liệu. Các quy tắc điều phối trong [AGENTS](../AGENTS.md) là chỉ dẫn làm việc thực hiện yêu cầu này, không quyết định chuyên môn mới.

### Q09 — ND03 đã được giao, không thêm phương pháp

**Đã chốt theo yêu cầu trực tiếp20/10.** U: “Triển khai ND03: hoàn thiện văn và bố cục các chủ đề Công việc, Tiền bạc–tích lũy–nhà đất từ nhận định hiện có”; giữ G2/evaluator/lịch sử, chưa Tật/Live. Thay trạng thái “đề xuất chưa triển khai” của phiên tài liệu; không thay bất kỳ quyết định chuyên môn nào. D: [bàn giao1.54](../.local/nd03-20261020/ban-giao.md); C: `editCustomerTopics`, `customerTopicOwner`, `buildCustomerReport`; kiểm `customer-topic-editorial.test.ts` và so192. Không tính biên tập thành giảm cung trống/đủ12cung.

### Q10 — ND04 Phụ/Huynh, tập con có câu không phụ thuộc chi/trạng thái

**Triển khai theo ủy quyền lô nội dung21/10; không phải phê duyệt chuyên môn của chủ dự án.** U giao giải một nhóm điều kiện và publish phần đủ nguồn, giữ G2/lịch sử/Tật chưa publish. C: `familyVcdAssessment`, `familyVcdRules`, `tests/family-vcd.test.ts`. D: [bảng nguồn](PHU-HUYNH-1.32.0.md), [bằng chứng](../.local/vcd-20261021/ban-giao.md). Dùng chỉ dẫn riêng PDF131/224 và câu cung nhận không đòi chi/trạng thái; không giả định phương pháp mượn chung. Cổng giữ unknown khi Tuần/Triệt ở một trong hai cung với lời vật chất Phụ là lựa chọn thận trọng của triển khai, chưa phải điều kiện được chủ dự án hoặc nguồn xác nhận. Tập con33nhánh đã lên1.55/1.52; các câu trạng thái/ngoại lệ chưa rõ vẫn ở backlog, không mở rộng quyết định phạm vi.

## Đề xuất chưa duyệt hoặc chưa xác định nguồn quyết định

- **ND02:** mở nguyên ba nhóm vai trò Mệnh–Thân miễn phí, hai nhóm Thân cư Quan/Tài chi tiết. D: mục phân quyền5rule trong kế hoạch; **chưa thấy U duyệt thay policy**. Giữ G2.
- **Loại số con/anh chị em, thứ bậc, giới tính, số lần hôn nhân, âm phần:** có hồ sơ triển khai hạn chế; **chưa xác định được xác nhận U bao trùm từng loại thành phạm vi thương mại cuối**. Chỉ ghi hành vi hiện tại; cần quyết định theo ND19, không tự mở hoặc coi sách thiếu.
- **Tật Ách:** vị trí hiển thị, câu chữ hai mẫu, danh sách loại trừ mở rộng, tiêu chí được tính là luận cá nhân đều chưa duyệt. Các cấm cụ thể ởQ06 đã có hiệu lực; không nhập hai mức làm một.
- **Cổng bảo thủ nguồn:** khi chưa giải nghĩa Tuần/Triệt/“nhiều”/hội hợp, dự án giữ unknown hoặc không hỗ trợ. Đây là lựa chọn triển khai có lý do, **không phải lời sách cấm mọi trường hợp có sao ấy**. D: audit chuyên đề và backlogND04–ND19; C: các evaluator tương ứng. Chưa có phép chủ dự án cho tự bỏ cổng để tăng độ phủ.
- **Giá, hạn bán hàng, hoàn tiền, quyền nguồn/thẩm định chuyên môn, email đại trà/Live:** chưa có quyết định phê duyệt trong các bằng chứng đã đọc. Thiết lập Test không thay các quyết định đó.

## Quyết định/phạm vi đã bị thay thế — không áp ngược

- Quyền trial cũ từng cho cơ bản/chi tiết/PDF miễn phí → Q02 áp policy cho **bản mới**, không thu hồi quyền/hạn cũ.
- Giới hạn các gói trình bày “không thêm rule” → task hoàn thiện1.46 cho phép rule đủ căn cứ trong lô được giao; **không phải quyền thêm rule trong mọi task**, đặc biệt phiên tài liệu này.
- Hạn chế phát hành sức khỏe trước đây → Q06 cho phép thẩm định hướng chú giải; **chưa thay bằng cho phép phát hành**.
- Toàn thư “34nháp chờ duyệt” trong nhật ký cũ → Q07 đã xuất bản; bản nhật ký phải giữ mốc thời gian để không hiểu là trạng thái hiện hành.
- Admin dùng khóa nội bộ cũ → G5 yêu cầu danh tính Google + vai trò persist; không khẳng định mọi route kỹ thuật legacy đã bị xóa. Đọc `requireAdmin` và route thực tế trước sửa.
- Cổng kỹ thuật Nô chỉ một chính tinh và Vũ–Tham/Huynh phải có tuổi đã được lô1.52/1.53 sửa theo nguồn; đây là **sửa lựa chọn triển khai**, không phải chủ dự án sửa nội dung sách.

Không có sổ quyết định có chữ ký/permalink độc lập cho toàn bộ lịch sử. Những chỗ không có U được đánh dấu ở trên; không lấy lời assistant trong kế hoạch làm xác nhận thay chủ dự án.

## Q11 — Lô Tử–Phu21/10/2026

**U trực tiếp trong task:** hoàn thiện toàn lô đủ căn cứ hai cung, xử lý giới hạn code đặt thêm khi chứng minh không phải điều kiện nguồn; giữ loại trừ/G2/lịch sử/Live tắt. Đây là ủy quyền triển khai, không phải duyệt chuyên môn hoặc mở ND19. D/C: [bảng câu và điều kiện](PHU-TU-1.33.0.md), commit8776d6e;14nhánh tọa thủ +2TửVCD. Giữ nguyên các điều kiện nếu/mới ở câu có chúng; chữ sớm mô tả hoặc lời khuyên đứng riêng không tự trở thành gate tuổi của câu độc lập. Những phân định cụ thể thay ô chặn rộng trong ma trận cũ, không thay quy tắc nguồn chung hoặc quyền lịch sử.

## 21/10/2026 — duyệt đúng bốn mẫu Tử–Phu

**U trực tiếp:** chủ dự án duyệt triển khai hai chú giải Đồng/Mão, Đồng–Âm/Ngọ tại Phu và hai đặc tính Hóa Khoa, Hồng Loan tại Tử; cho biên tập gọn, pipeline chung và luồng khách. Thay trạng thái đề xuất chưa duyệt của đúng bốn mẫu trong [Phu–Tử](PHU-TU-1.33.0.md). ND19 chỉ mở thông minh/khéo tay theo câu độc lập, không Hóa Quyền hoặc loại khác. Hai mẫu Phu bắt buộc điều kiện unknown, outcomeApplied=false; không đặt tuổi/hỏi thêm/suy ngược. Độ phủ tách nhận định với chú giải, không gọi đầy đủ cung. D/C:3bff73c,1.57/catalog1.54; G2/lịch sử/Live giữ nguyên.


## 21/10/2026 — lô Nô–Điền–Phúc 1.58

Căn cứ yêu cầu trực tiếp trong phiên: chuyển các câu độc lập đủ điều kiện từ audit hiện có sang pipeline khách khi bấm “Lập lá số”, giữ đúng phương diện quan hệ/nguồn gốc/tạo dựng/duy trì; không tự mở loại nội dung hoặc áp duyệt bốn mẫu Tử–Phu cho cung khác. Đã thực hiện9nhánh tại codee7bd1e4. Phân biệt các cổng TT, vắng Riêu/Đà/Kỵ hoặc Không/Kiếp là giới hạn triển khai khi điều chỉnh chưa giải; không nhận chúng là điều kiện nguyên văn hoặc tự bỏ để tăng độ phủ. Bỏ chặn toàn mục VCDĐiền khi câu đầu độc lập; DươngPhúc dùng tọa thủ đúng nguồn. Chưa phê duyệt chuyên môn toàn báo cáo, rule vẫn draft/review=null. Nhóm ngoài phạm vi giữ riêng theoND19; lịch sử/G2/Livefalse không đổi. Đặc tả chi tiết ở NO-DIEN-1.31.0 và PHUC-DI-1.0.0.


## 21/10/2026 — Quan–Tài giữ toàn thời đoạn, 1.59

U trực tiếp giao hoàn thiện lô Quan–Tài, giữ điều kiện tuổi/chi/tổ hợp/ngoại lệ, không đổi công danh thành thu nhập hoặc giữ tiền thành giàu có. Triển khai3nhánh tại `bb230d5`: Vũ–Tham/Quan, Nhật–Cự Thân/Quan, Vũ–Tham/Tài. Thay giới hạn triển khai phải tính tuổi hiện tại/chọn giai đoạn bằng việc giữ nguyên toàn diễn tiến nguồn; không xác nhận thời đoạn hoặc kết quả đã xảy ra, không tự định nghĩa tuổi mụ/dương hay tuổi “già”. Phân biệt “từ30” và “ngoài30”. Đây là ủy quyền trong task, không phải phê duyệt chuyên môn hoặc mở tất cả chú giải nếu/mới. ND03/G2/lịch sử/Livefalse giữ nguyên, không mở Tật Ách. Chi tiết nguồn ở CAREER-CLOSE-1.0.0 và FINANCE-ASSETS-1.37.0.


## 21/10/2026 — bảng quyết định hoàn thành12 cung, chỉ tài liệu

**U trực tiếp trong phiên:** “Mục tiêu là khép các quyết định còn ngăn hoàn thành báo cáo 12 cung có thể thu phí, áp dụng chung cho mọi khách hàng.”; yêu cầu lập bảng từ audit hiện có, cập nhật kế hoạch/CURRENT_STATUS, chưa thêm rule hoặc sửa ứng dụng, giữ G2/lịch sử/Live tắt. Mục tiêu này xác nhận Q01, không cho phép hạ thành12 tiêu đề hoặc chỉ bán cấu trúc mẫu. [Bảng quyết định trong backlog duy nhất](V1-DELIVERY-PLAN.md#bảng-quyết-định-cuối-gói-tài-liệu--21102026) là **đề xuất chưa duyệt**: tiêu chí Tật, xác nhận loại trừND19, mức đầy đủ theo phương diện và giữ ND02 hiện hành. Không coi việc tổng hợp là chủ dự án đã duyệt hai mẫu Tật, phương pháp chuyên môn hoặc cho phép publish. Không thay Q02/Q06 và các phê duyệt hữu hạn trước đó.
