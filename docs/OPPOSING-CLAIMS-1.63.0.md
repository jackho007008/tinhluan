# Các lời khác chiều trong báo cáo khách — 1.63.0

Ngày22/10/2026, nối baseline thực `main@7ab01c5`, code phục vụ `daee8c2`,1.62/catalog1.59. Đây là đặc tả và kết quả của task hữu hạn trong ND03/ND10/ND11/ND12/ND16, không phải backlog mới. Không mở rộng TTDi, tìm câu lấp cung hoặc đọc sách mới.

## Ba loại kết quả

**Đã giải bằng phương pháp nguồn:** không có phép điều chỉnh/thay thế mới được chứng minh và triển khai trong lô này. Đối chiếu lại TB191§12.5 và kiểm evaluator hiện hành xác nhận Nhật–Nguyệt/Kỵ đã có ngoại lệ riêng; không dùng Kỵ nền để vừa nói tán tài vừa áp lời dễ làm giàu. Đây là phương pháp đã có, không tính thành thành quả mới. §7.33 cả Tuần lẫn Triệt ở Điền cũng đã có; không triển khai trùng. §5.2.30/§7.32 có yêu cầu nghịch đảo nhưng chưa đặc tả được tác động từng vế của các tổ hợp đang xét; cổng hiện hành giữ nguyên. Không tự đảo quan hệ gia đình, chọn sao thắng hoặc dùng nguyên tắc định tính NPL/TL làm trọng số.

**Đã phân rõ phương diện:** của cha mẹ khác phần con được hưởng (TB127–128§5.2.9 và130§5.2.21–22): cha mẹ có của và con không hưởng không phủ định nhau. Một mẫu192 nhận đoạn ngữ cảnh này. Tạo nguồn tiền khác hao/giữ tiền (TB190–197, TH241–245/254/264–265):19 mẫu được gom để đọc đúng phạm vi; không suy “kiếm được nhưng không giữ được”. Trong số19 có lời cảnh báo mất cắp được giữ rõ là cảnh báo, không xác nhận sự kiện. Tiền và nhà đất tiếp tục có giới hạn riêng; có cơ nghiệp tiền nhân, được nhận thừa kế, tự tạo và duy trì không được đồng nhất. Những diễn tiến vốn đã có trong nguồn như trước phá sau thành hay ngoài30 vẫn giữ trọn; không tự chia giai đoạn cho hai lời độc lập.

**Chỉ làm rõ bất định, chưa giải:**

- Tử Nữ: Hóa Lộc (`children-loc`, là **Hóa Lộc**, không phải Lộc Tồn) đối Liêm–Phá/Liêm–Tham về sau không khá giả.4mẫu34/127/139/152. Hai lời trùng đối tượng/phương diện/thời đoạn; sự hỗ trợ từ con không phải phép xóa lời khó. TB199§13.2.2,203§13.3.21; giữ nhánh VCD cùng nghĩa và Âm thấp trong registry, không đếm là đã chứng kiến trong192.
- Phụ Mẫu: thiếu thốn đối Lộc Tồn/Hóa Lộc có của.5mẫu3/9/51/63/147. Giữ vế bất hòa, xa cách và tiêu tán của Lộc Tồn, không đổi thành trước nghèo sau giàu. TB125§5.2.2,127–128§5.2.9,130§5.2.21–22,131§5.2.30–31. Nhánh Liêm đơn/VCD cùng phạm vi được khai báo chung, không tạo lời mới.
- Tài: tích lũy/giữ của đối hao hoặc khó giữ.7mẫu; có cả Tử–Phủ/Thiên Không bị bỏ sót bởi danh sách phối hợp cũ. Không gộp Thiên Không NPL265 với Địa Không hoặc gọi là cùng một phương pháp. Giữ cách hiểu nhẹ “chỉ không dư thừa”. Cảnh báo Phục Binh độc lập không được xếp như một khẳng định chắc chắn mất của trái với giữ của.
- Tài: Vũ–Tham ngoài30 đối hao tán,1mẫu137. Không gán hao tán cho trước30 hoặc xác nhận giàu sau30. TB191§12.4/195§12.23. Tập con TàiVCD/TT có cùng vấn đề được registry hỗ trợ nhưng0chứng kiến đồng thời trong192.
- Điền: có/tạo được cơ nghiệp đối Đà La không có hoặc mất phần thừa hưởng,4mẫu. Giữ riêng vấn đề quyền thừa hưởng; không chọn vế tự tạo để xóa “không có cơ nghiệp”.
- Điền: Kỵ giữ ổn định đối lời suy giảm/khó giữ/biến động,3mẫu50/131/143. TB149–155§7; chưa có phép xác định bên thắng hoặc giai đoạn riêng.

Các số theo nhóm có giao nhau: **40/192 báo cáo đổi**, không cộng số nhóm thành số hồ sơ độc lập. Không thêm claim, không đổi độ phủ cung; không coi một cung có đoạn là hoàn chỉnh.

## Pipeline và hợp đồng

`buildCustomerReport` gọi `contextualizeCustomerReport` sau biên tập chủ đề, trước chụp quyền G2 và chọn phần mở đầu. Registry nghĩa theo rule; không xét tên, ID/ngày sinh khách, không đoán qua từ khóa trong văn. Chỉ nhận những claim đã qua evaluator thật. Gom các đoạn nguyên vẹn theo thành phần liên thông vào một đoạn ngữ cảnh, dẫn các lời dưới dạng lời riêng và ghi giới hạn chung; không để hai khẳng định đối lập đứng thành hai kết quả cuối. Không tái tính sao hoặc tự tạo claim hòa giải.

Mỗi ngữ cảnh lưu `methodResolved:false`, loại bất định/phân diện, ID nhóm gốc, toàn claim/member/fact/trace/layers, câu gốc và nguồn. Ghi chú cục bộ đã nằm trọn trong nhóm được đưa vào căn cứ; ghi chú ranh giới tiền–nhà đất/công việc vẫn giữ riêng. Bản mới1.63/catalog1.59; continuous1.6.1, evaluator/catalog/policy không đổi. Lịch sử đọc frozen cũ, không backfill. PDF thêm đúng phiên bản mới vào paginator.

## Rà và chứng cứ

Dùng audit [Phu–Tử](PHU-TU-1.33.0.md), [Phụ–Huynh](PHU-HUYNH-1.32.0.md), [Tài–Điền](FINANCE-ASSETS-1.37.0.md), [Nô–Điền](NO-DIEN-1.31.0.md), kho chữ TB/NPL và hồ sơ phương pháp đã có. Chỉ đọc lại chữ các câu cần kiểm, không mở PDF sách hoặc cuốn mới; không tạo lượt đọc toàn sách/nhật ký nguồn mới.

[Khảo sát mọi tổ hợp192](../.local/opposing-20261022/survey.json), [so192/các nhóm và toàn đối tượng trước-sau](../.local/opposing-20261022/impact192.json), [toàn đoạn trước-sau của mọi ngữ cảnh thay đổi](../.local/opposing-20261022/full-before-after.txt), [bàn giao nghiệm thu](../.local/opposing-20261022/ban-giao.md). Kho riêng/ngoài Git, không chứa sách hoặc dữ liệu khách trong commit.

So192 dựng lại reading/continuous khớp sâu với baseline; toàn claim/rule/fact/trace/quan hệ nguồn không đổi. Mọi đoạn không gom giữ nguyên đối tượng; đoạn gom giữ đủ lời khách và member căn cứ cũ. `captureReadingPolicy` bằng baseline đủ192. Không lấy các phép so này làm bằng chứng phương pháp tổng hợp đã giải hoặc bài đã hoàn chỉnh.
