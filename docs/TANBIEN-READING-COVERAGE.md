# Kiểm kê bằng chứng đọc Tử Vi Đẩu Số Tân Biên

Ngày kiểm kê: 15/10/2026. Phạm vi: hồ sơ nguồn hiện có, không đọc lại toàn sách và không đánh giá lại tính đúng của rule.

## 1. Kết luận

**Có bằng chứng hồ sơ ghi nhận đã đọc hết lớp chữ của bản PDF 277 trang.** Không đúng nếu nói dự án chỉ mới đọc chọn lọc Tân Biên: `TANBIEN-ENGINE-TRIAL.md`, ngày 09/10/2026, ghi rõ đã đọc toàn văn, liệt kê hai lượt tiếp nối phủ kín 1–277, cả các khoảng phải đọc lại vì output bị cắt. Những hồ sơ sau bổ sung ghi chú nội dung, điều kiện, ngoại lệ và đối chiếu ảnh cho nhiều mục.

**Chưa đủ bằng chứng để nâng kết luận đó thành “đã kiểm toán đầy đủ mọi phương pháp/ngoại lệ trong sách cho V1”.** Một số khoảng chỉ có xác nhận đọc chung, chưa tìm được ghi chú ngữ cảnh theo từng mục trong các hồ sơ đã kiểm kê; mức đối chiếu ảnh cũng không đồng đều. Nhật ký lịch sử là bằng chứng về việc đã ghi nhận đọc, không phải lần đọc lại hoặc tái xác minh toàn văn trong tác vụ này.

Vì vậy, cần **bổ sung nhật ký và đọc lại có mục tiêu**, không mở lại một đợt đọc từ trang 1. Chưa có bằng chứng chi tiết không đồng nghĩa chắc chắn chưa từng đọc. Nội dung đã đọc nhưng còn mơ hồ, khác quy ước hoặc ngoài phạm vi sản phẩm không được gộp thành “thiếu sách”.

## 2. Tệp, baseline và cách kiểm kê

### Nhận dạng nguồn

- Tên trên bìa: **Tử Vi Đẩu Số Tân Biên — Vân Đằng Thái Thứ Lang**, ghi **Sài Gòn 1956**.
- Tệp thực tế: `/Users/taiho/Desktop/TAILIEUTUVI/(boitoan)-Tử Vi Đầu Số Tân Biên - Vân Đằng Thái Thứ Lang-dantocking.com.pdf`. Tên tệp ghi “Đầu”, khác “Đẩu” trên bìa; dùng tên bìa để định danh tác phẩm.
- **SHA-256:** `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`.
- **277 trang PDF**, kiểm tra trên tệp thực tế; hash khớp manifest nguồn engine cũ và hồ sơ 1.47.0.
- Trang 276 ghi người đánh máy không biết, tạo ebook `nguyenbahuy`, ngày 3/11/2014. Đây là **bản ebook đánh máy**, chưa xác minh với bản in 1956. Không gọi ngày trên bìa là ngày tạo tệp hoặc chứng nhận đúng ấn bản gốc.
- Lượt này xem trực tiếp ảnh trang **1, 2, 3, 276**, kiểm tra mục lục và đối chiếu các đầu mục bằng lớp chữ đã lưu. Không xem lại ảnh toàn bộ các trang phương pháp.
- Số trang trong bảng dưới là **trang PDF**. Các hồ sơ trước xác nhận số hiển thị trong ebook trùng PDF ở những trang đã đối chiếu; không suy ra phân trang của mọi bản giấy. Bìa/mục lục không được gán một số trang in chưa thấy.

Mục lục ở PDF2–3 chia phần lập thành (bắt đầu 5), luận đoán (31), vận hạn (248). **Mục Huynh Đệ không xuất hiện trong danh sách mục lục đã xem**, nhưng thân sách có §15 tại PDF217–224, giữa Phu Quân và mục 16. Không coi thiếu dòng mục lục là thiếu chương trong tệp. Các dòng Phần I/II/III dưới lời dẫn trang 4 là giới thiệu, không thay vị trí bắt đầu các phần chính.

### Baseline và giới hạn thao tác

- Kiểm tra trực tiếp `lib/internal-review/customer-report.ts`: `CUSTOMER_VERSION='1.47.0'`; `lib/interpretation-rules/catalog.ts`: `interpretation-1.45.0`.
- Đọc phần phạm vi, nguồn và điểm còn mở của [bàn giao hiện hành](/Volumes/DATA/TINHLUAN/.local/natal-system-20261015/ban-giao.md), [phạm vi](/Volumes/DATA/TINHLUAN/.local/natal-system-20261015/scope.md), [đặc tả quyết định](/Volumes/DATA/TINHLUAN/.local/natal-system-20261015/decision-spec.md).
- Không thấy `AGENTS.md` tại repo, `docs/` và các thư mục cha đã kiểm tra. Checkout không có thư mục `.git`; không gán commit không tồn tại.
- Chỉ ghi file kiểm kê này. Không sửa code, rule, catalog, bản đọc, snapshot; không chạy test/E2E, xuất PDF, hash toàn kho hoặc thao tác với QA3055.
- “V1” trong tài liệu này chỉ phạm vi bản đọc bản mệnh đang được chuẩn bị; không tự định nghĩa lại tiêu chí hoàn chỉnh hay điều kiện phát hành.

### Phân cấp bằng chứng

| Ký hiệu | Ý nghĩa | Không được suy ra |
|---|---|---|
| **R** | Có ghi nhận đọc kèm nội dung/ngữ cảnh cụ thể: quyết định, ngoại lệ, đối chiếu hoặc ma trận toàn mục. | Không tự chứng minh mọi câu của cả khoảng đã được đặc tả. |
| **G** | Có nhật ký đọc toàn văn/khoảng trang, nhưng ở mức ghi nhận chung; chưa tìm được ghi chú chi tiết cho toàn khoảng. | Không hạ thành “chắc chắn chưa đọc”, cũng không nâng thành kiểm toán từng mệnh đề. |
| **C/O** | Chỉ citation, văn bản trích xuất hoặc ảnh lưu, nếu xét riêng vật chứng đó. | Có tệp OCR/text hoặc PNG không chứng minh đã đọc/nghiên cứu nó. |
| **Ø** | Chưa tìm thấy bằng chứng cho thao tác cụ thể đang hỏi, ví dụ đối chiếu ảnh hay giải nghĩa một ngoại lệ. | Không đồng nghĩa chưa từng đọc trang đó. |

**Ảnh cũ** ở bảng dưới là phạm vi được hồ sơ lịch sử ghi nhận, không phải ảnh được xem lại trong lượt này. **Ảnh mới** chỉ bìa/mục lục/ghi công nêu trên. Các mức có thể cùng tồn tại trong một khoảng: R cho đoạn được phân tích, G cho phần còn lại, Ø cho đối chiếu chưa có ghi nhận.

## 3. Bằng chứng đọc toàn văn và hồ sơ tra cứu

### Nhật ký bao phủ không có lỗ trang

[E — TANBIEN-ENGINE-TRIAL.md](/Volumes/DATA/TINHLUAN/docs/TANBIEN-ENGINE-TRIAL.md:15), mục “Nguồn và giới hạn việc đọc”, ghi:

> Đã đọc toàn văn lớp chữ 1–277, không chỉ trích xuất hay tìm từ khóa.

- Lượt v1: **1–51; 225–228; 248–249; 267–277**.
- Lượt v2: **52–172; 173–224; 229–247; 250–266**.
- Ghi đọc lại **58–70 và 84–93** vì output trước bị cắt.
- Hợp các khoảng trên là **1–277, không thiếu trang theo nhật ký**. Đây là phép kiểm phạm vi ghi nhận, không phải phép đo độ hiểu sách.
- Nhật ký ghi đối chiếu ảnh **5–43, 148, 168–170, 238–239, 241–242, 244–247, 253, 268–275**; có bảng quyết định về lập số, trạng thái và sai khác nguồn.

[Manifest nguồn engine](/Volumes/DATA/TINHLUAN/.local/tanbien-engine-source/manifest.json) trùng hash nguồn hiện tại. Thư mục có đủ `001.txt`–`277.txt`; kiểm tra không thiếu tên trang. **277 tệp text chỉ là vật chứng trích xuất C/O**, không phải lý do kết luận đã đọc hết. Lý do là nhật ký E, được bổ trợ bởi các ghi chú nội dung sau. Không cộng bản sao QA/archive của cùng nhật ký thành nhiều lượt đọc độc lập.

### Hồ sơ nội dung được dùng trong bảng

- **R0:** [TANBIEN-RULE-READING](/Volumes/DATA/TINHLUAN/docs/TANBIEN-RULE-READING.md), đặc biệt các ghi nhận tại dòng 7, 155, 268, 341, 465, 617, 701; [RULE-SOURCES](/Volumes/DATA/TINHLUAN/docs/RULE-SOURCES.md). R0 có cả lịch sử kỹ thuật; chỉ lấy các phần nói rõ việc đọc nguồn và ngữ cảnh.
- **L:** [Life gaps 1.18](/Volumes/DATA/TINHLUAN/docs/TANBIEN-LIFE-GAPS-1.18.0.md), [life expansion 1.27](/Volumes/DATA/TINHLUAN/docs/TANBIEN-LIFE-EXPANSION-1.27.0.md), [life hãm 1.28](/Volumes/DATA/TINHLUAN/docs/TANBIEN-LIFE-HAM-1.28.0.md).
- **D:** [Career definitions 1.20](/Volumes/DATA/TINHLUAN/docs/CAREER-DEFINITIONS-1.20.0.md); [phối hợp các claim](/Volumes/DATA/TINHLUAN/.local/claim-coordination-20261012/decisions.json).
- **MT:** [Mệnh–Thân 1.38](/Volumes/DATA/TINHLUAN/docs/MENH-THAN-1.38.0.md); [quyết định Thân cư Tài/Quan](/Volumes/DATA/TINHLUAN/.local/than-tai-quan-20261013/decisions.json).
- **PD:** [Phúc/Di](/Volumes/DATA/TINHLUAN/docs/PHUC-DI-1.0.0.md), [ma trận](/Volumes/DATA/TINHLUAN/.local/phuc-di-20261013/matrix.json).
- **ND:** [Nô/Điền](/Volumes/DATA/TINHLUAN/docs/NO-DIEN-1.31.0.md), [ma trận](/Volumes/DATA/TINHLUAN/.local/no-dien-20261013/matrix.json).
- **PH:** [Phụ/Huynh](/Volumes/DATA/TINHLUAN/docs/PHU-HUYNH-1.32.0.md), [ma trận](/Volumes/DATA/TINHLUAN/.local/phu-huynh-20261013/matrix.json).
- **PT:** [Phu/Tử](/Volumes/DATA/TINHLUAN/docs/PHU-TU-1.33.0.md), [ma trận](/Volumes/DATA/TINHLUAN/.local/phu-tu-20261013/matrix.json).
- **TA:** [Tật Ách](/Volumes/DATA/TINHLUAN/docs/TAT-ACH-1.34.0.md).
- **TC:** [Nội dung bản mệnh 1.12.1](/Volumes/DATA/TINHLUAN/docs/TANBIEN-NATAL-CONTENT-1.12.1.md), [Tài chính/tài sản 1.37](/Volumes/DATA/TINHLUAN/docs/FINANCE-ASSETS-1.37.0.md).
- **M:** [M05/M07](/Volumes/DATA/TINHLUAN/.local/menh-than-evidence-20261015/decision-spec.md), [điều tra M06/Phủ và nhật ký đọc](/Volumes/DATA/TINHLUAN/.local/menh-than-evidence-20261015/research.json).
- **N:** [Đặc tả nguồn 1.47](/Volumes/DATA/TINHLUAN/.local/natal-system-20261015/decision-spec.md).

Kiểm toán toàn văn **NPL** là bằng chứng đọc sách Nguyễn Phát Lộc; chỉ những đoạn nó dẫn/đối chiếu rõ Tân Biên mới có thể dùng cho Tân Biên. Không chuyển nhãn “đọc toàn văn NPL” sang cuốn này. Tương tự, [preview ban đầu](/Volumes/DATA/TINHLUAN/docs/TANBIEN-PREVIEW-TRIAL.md) có giai đoạn dùng HTML thay PDF: citation tại thời điểm đó không tự thành chứng cứ đã xem sách.

## 4. Bảng kiểm kê theo mục/khoảng trang

Các khoảng chung trang ở ranh giới mục là chủ ý theo sách; không cộng số trang của các hàng để tính tỷ lệ. E áp dụng cho mọi hàng, nhưng không thay chứng cứ chi tiết còn thiếu.

| Mục / trang PDF | Bằng chứng đã đọc | Mức đối chiếu | Phần chưa xác minh bằng hồ sơ đã kiểm | Liên quan V1 |
|---|---|---|---|---|
| Bìa, mục lục, lời dẫn **1–4** | E; lượt này xác minh bìa/mục lục và vị trí các phần | G; ảnh mới 1–3 | Lời dẫn 4 có ghi nhận đọc chung, chưa có phân tích riêng trong tập hồ sơ rà | Định danh, giới hạn sách |
| Định cung, Bản Mệnh, âm dương, giờ, an Mệnh/Thân, Cục **5–7** | E có bảng đầu vào/công thức/giới hạn | R; ảnh cũ 5–7 | Không xác nhận mọi quy ước lịch hiện đại chỉ bằng sách | Nền dữ kiện trực tiếp |
| An sao **7–17** | E phân từng phép và đối chiếu phụ lục; N dùng định nghĩa Lục Sát p10 | R; ảnh cũ toàn khoảng | Kim Cục 21/24, Hỏa, Tứ Hóa, ví dụ Triệt có sai khác chưa giải quyết; đã đọc, không phải thiếu đọc | Cao, nhưng không sửa engine trong việc này |
| Hướng chiếu **17–20** | E, D có đối/xung/nhị/tam hợp và sai khác ví dụ | R; ảnh cũ toàn khoảng | Ví dụ Sửu p20 khác bảng; không suy một định nghĩa giải mọi chữ “gặp” | Cao: điều kiện vị trí |
| Khởi hạn **20–24** | E có cách đếm, ví dụ và cách chưa chọn | R; ảnh cũ toàn khoảng | Không phải đã nghiệm thu luận vận; không mở lại trong V1 bản mệnh | Ngoài luận bản mệnh |
| Ngũ hành/can chi **24–30** | E có ghi chú bảng, can giờ, mùa, màu | R; ảnh cũ toàn khoảng | Chữ vòng ngoài la bàn 27–28 chưa đọc chắc; màu Thìn 26/27 và can giờ 29 còn bất nhất | Nền dữ kiện; màu/la bàn không phải nội dung V1 cần lấp |
| Những điều chú ý; định danh **31–33** | E, D, L, R0; nêu rõ sáng/mờ, đơn thủ/đồng cung/hội hợp | R; ảnh cũ 31–33 | Chưa có sổ đối chiếu toàn bộ nguyên tắc → mọi ngoại lệ của V1; định nghĩa không tự giải lượng từ | **Ưu tiên cao nhất** |
| Đặc tính sao **33–51** | E có bảng trạng thái; R0/D đối chiếu nhiều bảng; M đọc riêng Phủ p36 | R cho bảng/đoạn được phân tích; G cho phần còn lại. E ghi ảnh 33–43; kho còn ảnh 44–51 nhưng riêng ảnh chỉ C/O | Chưa có ma trận rà hết từng mệnh đề tính chất/điều chỉnh 44–51; không coi đủ ảnh là đã kiểm logic toàn mục | Cao: định nghĩa và trạng thái dùng chung |
| Mệnh–Thân đại cương **52–55** | L, MT, D có ngữ cảnh và quyết định riêng từng nhánh Thân Tài/Quan | R; ảnh cũ 53–55 được ghi trong các hồ sơ liên quan | Các câu đứt nghĩa p54, lượng từ/bộ sao p55 còn mở dù đã đọc kỹ | **Cao**; không cần đọc lại chỉ để lập lại cùng câu hỏi |
| Luận sao tại Mệnh **55–80** | R0/L: 55–59, 62–80 và các điều kiện nam/nữ, sáng/hãm; M: Vũ/Xương–Khúc; MT/D: Vũ–Phủ | R ở các đoạn có đặc tả; G ở phần chưa có ghi chú riêng. Ảnh cũ tiêu biểu 55,58,62,65–67,68–69,71,74,76–80 | Không có bằng chứng kiểm từng câu toàn khoảng trong lượt này; 60–61 chưa được một bản ghi chi tiết riêng xác nhận trong tập đã rà. Vũ–Phủ p77 vẫn có câu khó hiểu | Cao: nền, tổ hợp, ngoại lệ |
| Luận sao tại Mệnh **81–101** | R0 đọc 85–91 và toàn 92–101; L ghi các nhánh hãm và ngoại lệ | R cho các đoạn trên; G cho phần còn lại. Ảnh cũ 88–93,95,98,100–101 trong các hồ sơ | 81–84 chưa tìm thấy ghi chú ngữ cảnh riêng trong tập rà; p98 can/chi, p101 nhánh phụ còn vướng, không gọi thiếu sách | Cao: tránh lời nền bỏ sót điều chỉnh |
| Luận sao tại Mệnh **102–117** | E ghi đọc toàn khoảng; các citation/catalog không đủ nâng thành ma trận đọc | **G**; text/citation riêng là C/O | Chưa tìm thấy nhật ký nội dung/ngữ cảnh toàn khoảng và danh sách ảnh quyết định tương ứng trong các hồ sơ đã kiểm | **Cao: khoảng cần bổ sung sổ đọc** |
| Cuối mục Mệnh **118–123** | L: Tam Không/Song Lộc118–119; M: M06/M07 đọc118–121; MT đối chiếu121/123 | R từng nhánh, G cho phần còn lại; ảnh cũ118–121; ảnh123 được lưu trong hồ sơ MT | Chưa đủ ma trận toàn bộ cuối mục; M06 chưa chốt lượng từ, p123 có ảnh/citation không tự chứng minh mọi nhánh đã giải | **Cao** |
| Phụ Mẫu **124–131** | PH: đọc toàn mục, ma trận quyết định/loại trừ | R; văn bản và ảnh quyết định toàn khoảng được hồ sơ ghi nhận | Nhiều điều kiện/lượng từ hoặc nội dung người thân bị loại; không phải chưa đọc mục | Trực tiếp |
| Phúc Đức, luận sao **132–143** | PD toàn mục; N đọc lại132/140 và ngoại lệ sát tinh | R; ảnh cũ132–143 | Có ghi chú xung đột và nhánh chưa đặc tả; không suy đã tổng hợp toàn Phúc | Trực tiếp, cao ở quan hệ Phúc–Mệnh/Tài |
| Phúc Đức, âm phần **143–148** | PD ghi toàn mục đã đọc, riêng§6.2 chỉ kiểm kê; E có ảnh148 | G cho mức phân tích sâu; R về quyết định phạm vi. Ảnh cũ143/148 | Chưa có đặc tả từng nhánh âm phần; không dùng thiếu triển khai làm bằng chứng chưa đọc | Không ưu tiên V1 hiện hành |
| Điền Trạch **149–157** | ND toàn mục + ma trận; N rà Đẩu Quân155 và các nhóm phụ tinh | R; ảnh cũ toàn khoảng | Lượng từ và ngoại lệ còn khoanh; không phải khoảng trang chưa đọc | Trực tiếp |
| Quan Lộc **158–167** | R0 toàn mục kèm ma trận đề mục; D/TC và hồ sơ nghề nghiệp đọc lại | R; ảnh cũ toàn khoảng | Hai mục cùng số8.14; các nhóm sát/cát, lượng từ và quan hệ thay thế chưa tự có đáp án | Trực tiếp, ưu tiên điều chỉnh |
| Nô Bộc **168–173** | ND toàn mục; N bảng Mệnh–Nô và giới hạn Tuần/Triệt | R; ảnh cũ toàn khoảng, N đọc lại168–171/173 | Nhiều chính tinh, ô ngoài phạm vi và sửa sáng/mờ chưa được phép suy; đã đọc không đồng nghĩa hỗ trợ hết | Trực tiếp, liên cung |
| Thiên Di **174–180** | PD toàn mục; ND rà lại tọa/đơn thủ; D đọc quan hệ với Mệnh | R; ảnh cũ174–179, ND ghi rà174–180 | Chưa có phép chuyển toàn bộ lời đối cung; câu lặp “Tuần” còn vấn đề văn bản | Trực tiếp |
| Tật Ách **181–189** | TA toàn mục, cả mở đầu/cứu giải/ngoại lệ; ma trận phạm vi | R; ảnh cũ cả 9 trang +33 | Nội dung bệnh/sinh tử bị loại không phải thiếu nguồn; p184/p189 có ghi chú bất nhất cần giữ | Phạm vi dữ kiện/giới hạn; không mở luận sức khỏe |
| Tài Bạch **190–197** | TC đọc toàn mục; D và tài chính1.37 đọc lại quan hệ/ngoại lệ | R; ảnh cũ tiêu biểu190–192,195,197 | Chưa chứng minh đối chiếu ảnh từng câu toàn8trang; Cơ–Lương/Kỵ và hợp nhất Mệnh–Thân–Phúc–Quan–Di còn thiếu phép cụ thể | **Cao** |
| Tử Tức **198–207** | PT toàn mục + ma trận; N xem lại205 | R; ảnh cũ toàn khoảng | Lượng từ Tuần/Triệt và vế thời gian205 còn mở; số con/bệnh/tử ngoài phạm vi | Trực tiếp ở quan hệ |
| Thê Thiếp/Phu Quân **208–216** | PT toàn mục + ma trận | R; ảnh cũ toàn khoảng | Sớm/muộn, lần hôn nhân, dữ kiện thực tế và nội dung bị loại không được lấp bằng suy đoán | Trực tiếp |
| Huynh Đệ **217–224** | PH toàn mục + ma trận | R; văn bản/ảnh quyết định được ghi nhận | Mục lục bỏ tên mục; lời mở217 nhắc Tử Tức cần giữ vấn đề văn bản, không tự sửa nguồn | Trực tiếp |
| Mùa sinh/giờ sinh **225** | E ghi đọc lượt v1 | **G** | Chưa tìm thấy ghi chú riêng về phạm vi và điều kiện diễn giải mục này | Cần phân loại trước khi hứa luận toàn bản mệnh |
| Phụ luận Mệnh–Thân **226–227** | E ghi đọc lượt v1 | **G** | Chưa tìm thấy ma trận nội dung/ngoại lệ riêng; không được kết luận đã khai thác hết phối hợp từ sách | **Ưu tiên cao nhất** |
| Phụ luận Tử Tức **228** | E ghi đọc lượt v1 | **G** | PH/PT có toàn mục chính nhưng không tự chứng minh đã rà bổ luận này theo V1 | Ưu tiên vừa: kiểm điều kiện chi phối lời hiện có |
| Phân cục **229–233** | E ghi đọc lượt v2 | **G** | Chưa tìm thấy sổ giải nghĩa toàn mục; chưa biết phần nào là cách cục/quan hệ hữu ích cho V1, không tự đồng nhất với hành Cục | **Cao: cần phân loại phương pháp** |
| Vài hạng người trong xã hội **234–237** | E; D đọc có mục tiêu234–236, ghi cụ thể235§20.8 | R cho§20.8, G cho toàn mục; ảnh quyết định được D nói chung, chưa có danh sách đủ4trang | Chưa có ma trận toàn mục; lượng từ và phạm vi Mệnh/Thân/Quan chưa giải hết; loại nội dung phẩm hạnh khi cần | Cao ở điều kiện/cách cục; không suy nghề cho cá nhân |
| Tiểu nhi **238–240** | E có phân tích phép giờ/tuổi và lý do không triển khai | R; ảnh cũ238–239; G cho phần chưa chú giải riêng240 | Không có nghiệm thu ứng dụng cho lời bệnh/tử; đây là ngoài phạm vi | Không chặn V1 bản mệnh hiện hành |
| Bản Mệnh theo ngũ hành **241–243** | E bảng 30 cặp nạp âm và bốn ví dụ;241–242 có ghi chú rõ | R241–242; G243; ảnh cũ241–242 | Chưa có ghi chú riêng đủ cho243; không lấy bảng Tân Biên thay quy ước NPL mà không đối chiếu | Vừa: dữ liệu nền/phân biệt nguồn |
| Hình tượng các sao **244–247** | E ghi đọc và xem ảnh; ghi nhận phạm vi biểu tượng | G về nội dung từng mệnh đề; ảnh cũ toàn khoảng | Chưa có ma trận diễn giải biểu tượng; không biến biểu tượng thành kết luận về người đọc | Thấp; chưa là lời hứa V1 |
| Phương pháp/nhận định vận hạn **248–253** | E ghi đọc;253 có ảnh và ghi phạm vi | G về phương pháp luận từng đoạn; ảnh cũ253 | Chưa có audit toàn phương pháp vận; không kéo sang bản mệnh | Ngoài V1 hiện hành |
| Sao nhập hạn **254–267** | E ghi đọc toàn văn qua hai lượt | **G** | Chưa tìm thấy ma trận ngữ cảnh riêng toàn phần; citation nếu có không thay sổ đọc | Ngoài V1 |
| Sao lưu **267–269** | E có9 phép, đầu vào và ví dụ | R cho an sao lưu; G cho luận hạn còn lại; ảnh cũ268–269 | Không phải đã chứng minh luận vận; không lấy sao lưu làm sao bản mệnh | Phân lớp dữ kiện, không mở luận vận |
| Hạn chết/đám tang **269–270** | E ghi đọc và loại khỏi sản phẩm | G về từng nhánh; có ảnh lưu không tự nâng mức | Không cần đặc tả phát hành loại nội dung này | Ngoài phạm vi |
| Phụ lục và4lá số **271–275** | E có đối chiếu công thức/sai khác cụ thể ở bốn lá số272–275 | R cho các phép đã đối chiếu; ảnh cũ272–275 | Ví dụ không tự chứng minh mọi phương pháp luận hay giải mọi mâu thuẫn bảng | Dùng kiểm nguồn, không mở rộng rule |
| Ghi công ebook/Hết **276–277** | E; lượt này ảnh276 và chữ277 | R về nhận dạng; ảnh mới276 | Chưa xác minh người đánh máy hoặc bản in gốc | Xuất xứ, không phải phương pháp |

## 5. Điều chưa được xác minh và hệ quả với V1

1. **Không thiếu khoảng trang theo nhật ký đọc cũ.** Thiếu chủ yếu là bằng chứng phân tích chi tiết cho một số khoảng và bản đồ nối nguyên tắc chung với điều kiện/ngoại lệ. Không nên viết “chưa đọc Tân Biên toàn văn” trong bàn giao tiếp theo nếu không kèm phân biệt này.
2. **Chưa xác minh toàn bộ ảnh/bảng/công thức của sách.** Danh sách ảnh lịch sử chỉ chứng minh phạm vi đã ghi nhận; việc ảnh tồn tại không chứng minh đã xem. La bàn27–28 được E báo một phần khó đọc; lượt này không kiểm lại khả năng đọc mọi trang.
3. **Đọc rồi nhưng chưa giải nghĩa**: Thân cư Tài/Quan54–55, Vũ–Phủ77, M06118/120, Phủ36/76, các lượng từ và ngoại lệ Quan/Tài/Phúc/Nô. Không phải cứ đọc thêm là chắc có quy tắc; cần giữ câu hỏi cụ thể trong hồ sơ M/MT/D/N.
4. **Chưa kiểm với ấn bản độc lập**: câu đứt nghĩa, bảng Tứ Hóa/ví dụ, Hỏa, Kim Cục, Triệt. Gọi là bất nhất trong bản số hóa đang dùng; chưa đủ căn cứ kết luận lỗi in của sách gốc. Không thay quy ước hay dữ kiện trong lượt kiểm kê.
5. **Ngoài phạm vi**: vận hạn, bệnh/sinh tử, âm phần và quy kết phẩm hạnh không trở thành việc thiếu cần nhập cho đủ V1. Các mục chứa cả phần có thể dùng và phần bị loại cần tách theo mệnh đề, không loại cả sách.
6. **Không dùng số nhánh biên tập, claim hoặc test làm bằng chứng đọc sách.** Bảng này cũng không chứng nhận catalog đúng/đủ: trạng thái triển khai trong hồ sơ cũ là lịch sử, không phải kết quả kiểm thử mới.

## 6. Công việc đọc bổ sung hữu hạn

Danh sách dưới là việc còn lại đề xuất, **chưa thực hiện trong lượt này**. Mỗi việc dừng khi đã ghi câu nguồn, ngữ cảnh, điều kiện, ngoại lệ, mức rõ và liên quan V1; không coding hoặc mở vòng thêm từng sao. Ước lượng chỉ cho việc đọc/ghi nhận, không bao gồm triển khai hay phê duyệt.

| Ưu tiên / việc | Phần đọc và hồ sơ tái sử dụng | Câu hỏi cần trả lời | Điểm kết thúc | Ước lượng |
|---|---|---|---|---|
| **P0–1. Nguyên tắc phối hợp và phụ luận Mệnh–Thân** | Đọc có ghi chú226–227; nối với31–33,51–55 đã có D/L/MT | Phụ luận có quy tắc bổ sung/giới hạn nào ảnh hưởng lời hiện có? Chỗ nào chỉ yêu cầu xem thêm, chỗ nào cho kết quả phối hợp? | Một bảng theo từng mệnh đề226–227; mỗi liên hệ với nguyên tắc cũ có trang và kết luận rõ/chưa rõ/ngoài phạm vi. Không buộc giải xong câu hỏng54–55 | 30–45 phút |
| **P0–2a. Bổ sung nhật ký phần tính chất còn thưa** | 44–51,60–61,81–84; tái dùng E/R0 và bảng trạng thái đã kiểm | Có điều kiện/ngoại lệ chi phối lời nền mà hồ sơ chọn lọc chưa ghi đủ không? | Sổ ngắn phủ từng đề mục của ba khoảng, đánh dấu phần đã có, độc lập, cần phối hợp hoặc ngoài phạm vi | 30–45 phút |
| **P0–2b. Cuối mục Mệnh và phụ tinh** | 102–117,122–123; tái dùng ghi chú118–121 của M/L | Lượng từ, vị trí, ngoại lệ nào áp dụng cho các nhận định Mệnh hiện hành? Có dẫn chiếu nội bộ giải được M06 không? | Ma trận toàn đề mục trong phạm vi, ảnh cho câu quyết định; nếu không có bằng chứng mới thì giữ nguyên câu hỏi M06, không mở tìm vô hạn | 45–60 phút |
| **P0–3. Phân cục và các mô tả xã hội** | 229–237; dùng lại D tại235 | Có định nghĩa/cách định tính cụ thể cho bộ sao, nhiều/trội hoặc điều chỉnh không? Phạm vi là sao/cung/liên cung hay ví dụ/phán xét? | Phủ đủ đề mục229–237; phân rõ phép dùng được, ví dụ, mơ hồ, ngoài phạm vi; không ép thành hệ điểm hay chọn bên thắng | 30–45 phút |
| **P0–4. Đối chiếu các điểm đã đọc nhưng còn chặn** | M06:118/120; Phủ:36/76/77; MT54–55; Quan163–164; Tài190–197; dùng M/MT/D/N trước | Hồ sơ mới từ các việc trên có giải được đúng lượng từ/quan hệ/phương diện không? Ngoại lệ nào còn có nguy cơ làm người đọc hiểu sai? | Cập nhật một danh sách vấn đề với bằng chứng mới hoặc xác nhận không có bằng chứng mới; từng vấn đề ghi chính xác đoạn/ấn bản cần đối chứng, không đọc lại cả chương | 20–30 phút sau các việc trên |
| **P1–5. Bổ luận ngắn và dữ liệu nền** | 225,228,243; dùng E và ma trận gia đình hiện có | Có điều kiện độc lập hoặc giới hạn phải đọc cùng mục chính không? Phần nào không thuộc lời hứa V1? | Ghi chú cho cả 3 trang và dẫn chiếu cần thiết; không nhập nội dung bị loại để tăng độ phủ | 15–25 phút |

**Không đặt thành việc bắt buộc trước V1:** đọc lại toàn bộ149–224; rà luận vận248–270; đặc tả tiểu nhi238–240, âm phần143–148 hoặc biểu tượng244–247 để phát hành. Những phần này đã có ghi nhận đọc, và mức thiếu đặc tả không cùng mức ảnh hưởng với nguyên tắc Mệnh–Thân. Nếu sau này cần nhật ký học thuật chi tiết toàn sách, tách riêng công việc đó khỏi nghiệm thu V1.

**Thứ tự trước khi chốt V1:** P0–1 → P0–2a/2b → P0–3 → P0–4; P1–5 là rà bổ luận ngắn. Đây là thứ tự hoàn thiện bằng chứng nguồn, không tự đặt tiêu chí V1 phải triển khai mọi phương pháp tìm được. Khi nguồn vẫn chưa đủ, giữ giới hạn sản phẩm cụ thể và đưa chủ dự án quyết định lời hứa nội dung.

## 7. Dấu vết của lượt kiểm kê này

- Bắt đầu: **17:55:30, 15/10/2026 (Asia/Ho_Chi_Minh)**.
- Xác minh trực tiếp tệp/hash/số trang và ảnh nhận dạng/mục lục; kiểm hợp các khoảng nhật ký, sự hiện diện 277 tệp text và các đường dẫn hồ sơ.
- Không gọi thao tác tìm kiếm hoặc trích xuất là đọc toàn văn mới. Không kiểm lại chuyên môn các rule được hồ sơ nhắc tới.
- Không đọc/ghi kho bản đọc, không tác động server/QA3055. File bàn giao duy nhất: `docs/TANBIEN-READING-COVERAGE.md`.
- Hoàn tất: **18:08:52, 15/10/2026 (Asia/Ho_Chi_Minh)**. Thời gian thực tế: **13 phút 22 giây**. Kiểm tra 29 liên kết hồ sơ trong tài liệu: không có đường dẫn thiếu. Đây là kiểm tra tài liệu, không phải chạy lại bộ test ứng dụng.
