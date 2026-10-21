# Kiểm chứng engine — 07/10/2026

## Mức bằng chứng

| Mức | Đã làm | Không chứng minh được |
|---|---|---|
| Nhất quán nội bộ | Chuyển đổi hai chiều toàn bộ 27.394 ngày 1976–2050; tháng liên tục 29/30 ngày, chu kỳ 12/13 tháng; deterministic/hash; cô lập profile/giới tính | Không chứng minh lịch đúng với mọi niên giám |
| Cùng thư viện, hai đường gọi | VN bridge và CN adapter cho cùng dữ kiện lịch 16/08/2000, nam/nữ: toàn bộ palaces bằng nhau | Cùng iztro, **không phải thư viện an sao độc lập** |
| Fixture upstream | Quick-start iztro: nữ, 16/08/2000 giờ Dần; tập con Mệnh Ngọ/Tử Vi, Tài Bạch/Vũ Khúc–Thiên Tướng; thử nam như kiểm tra bất biến chính tinh | Không phải lá số Việt Nam được chuyên gia xác nhận; nam là kiểm tra kỹ thuật bổ sung |
| Nguồn lịch độc lập | 11 ngày có URL/vị trí/expected; 6 thời điểm sóc NASA với dung sai công khai | Mẫu ít; báo chí không phải toàn bộ bộ lịch chuẩn; NASA cũng là tính thiên văn, không phép đo trực tiếp |
| Thư viện khác độc lập | Chưa có bộ đối chiếu an sao độc lập khác dòng iztro | Không tính hai adapter cùng iztro thành hai chuyên gia |
| Chuyên gia độc lập | **Chưa có ca nào** | Chưa phê duyệt trường phái, toàn bộ sao, vận hoặc khả năng dự báo |

Các expected bên ngoài nằm ở [tests/calendar-fixtures.json](../tests/calendar-fixtures.json), gồm source URL, loại nguồn, vị trí và cách suy ra nếu có. Expected không được sinh từ engine đang kiểm tra. Quét toàn miền và phép roundtrip được ghi đúng là consistency. Báo cáo đo lại tại [evidence/calendar-measurements.json](evidence/calendar-measurements.json), không dùng file này làm oracle.

## Nguồn và phạm vi đối chiếu

- [Hồ Ngọc Đức, bản tiếng Anh trên mirror](https://www.xemamlich.uhm.vn/calrules_en.html): quy tắc và bảng sự kiện 1984/1985. Các fixture 02/02, 29/02, 02/03/1984, 21/01 và 21/03/1985 gồm suy ra ngày từ đầu tháng được ghi rõ. Không gọi mirror là niên giám chính thức. Không chép mã thuật toán từ trang.
- [Bản tiếng Việt](https://www.xemamlich.uhm.vn/calrules.html): tháng 2 nhuận 2004 từ 21/03 đến 18/04; dùng làm hai fixture. Không dùng đoạn sai khác 1984 làm oracle.
- [Nhân Dân, mục 2 của tổng kết Bộ TT&TT năm 2007](https://nhandan.vn/bo-thong-tin-truyen-thong-cong-bo-10-su-kien-noi-bat-nam-2007-post483098.html): 17/02/2007 là mùng 1 Tết.
- [Cổng TTĐT Chính phủ, Tết 2023](https://thanglong.chinhphu.vn/ha-noi-dep-binh-yen-sang-mung-1-tet-103230122091833345.htm): 22/01/2023 là mùng 1.
- [Thông báo lịch nghỉ Tết 2024](https://xaydungchinhsach.chinhphu.vn/lich-nghi-tet-nguyen-dan-giap-thin-nam-2024-11923110317204931.htm): 08/02/2024 là 29 Chạp. [Bài CSGT Hà Nội](https://thanglong.chinhphu.vn/huy-dong-100-quan-so-bao-dam-giao-thong-cho-nhan-dan-don-tet-103240212091608758.htm) xác nhận 10/02 là mùng 1 nhưng ghi 08/02 là 28 Chạp; xử lý sai khác bên dưới.
- [NASA/Fred Espenak, New Moon UT 2001–2025](https://eclipse.gsfc.nasa.gov/phase/phase2001gmt.html): 6 mẫu 2004, 2007, 2023, 2024; sai lệch đo được **42,001–61,291 giây**, cùng ngày dân sự UTC+7. Test dung sai120 giây bao gồm độ phân giải phút của bảng và khác mô hình xấp xỉ; không suy thành bảo đảm mọi thời điểm đều sai số dưới120 giây.
- [HKO 2007](https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/2007e.pdf): dùng đối chiếu **lịch Trung Quốc**, không làm oracle cho Việt Nam.
- [iztro quick-start](https://docs.iztro.com/quick-start): fixture tập con sao, chỉ chứng minh tương thích upstream.

## Bảng sai khác và cách giải quyết

| Trường hợp | Sai khác | Nguyên nhân/quyết định | Trạng thái |
|---|---|---|---|
| 17/02/2007 | UTC+7: 1/1/2007; CN: 30/12/2006 | NASA sóc16:14UT:23:14 UTC+7 cùng ngày, 00:14 UTC+8 ngày sau. Ngày Tết độc lập và HKO khớp từng quy ước | Đã giải thích, test cả hai; sao khác do dữ kiện năm/tháng/ngày khác |
| 21/01/1985 | UTC+7 Tết sớm hơn lịch Trung Quốc một tháng | Đông chí1984 rơi21/12 UTC+7 nhưng22/12 UTC+8, trùng ngày sóc ở UTC+8; làm thay tháng11 và tháng nhuận | Fixture theo bảng sự kiện HND; chưa golden toàn lá số độc lập |
| 02/03/1984 | Bản HND tiếng Việt kết tháng1 ngày01/03; bản Anh kết02/03 | Bảng sóc tiếp theo02/03 18:30UT →03/03 UTC+7; theo chính quy tắc ngày sóc, tháng trước kết02/03. Không chọn theo số đông | Không dùng đoạn tiếng Việt làm expected; cần tác giả/mirror đính chính |
| 08/02/2024 | Một bài Chính phủ ghi28 Chạp; thông báo nghỉ Tết ghi29 | NASA sóc11/01 11:57UT →11/01 UTC+7. Đếm ngày dân sự tới08/02 =29. Hai profile UTC+7/+8 không giải thích chênh lệch này | Fixture ban đầu đã thất bại; giữ `disputes` với dữ kiện gốc, đổi oracle sang thông báo + thiên văn, không sửa runtime |
| Nửa sau tháng nhuận | CN fixLeap=true có thể đổi số tháng an sao; VN fixLeap=false giữ nguyên | Quy ước có chủ đích, không “sửa” để ép hai profile giống nhau | Test ngày15/16; quyết định trường phái còn cần chuyên gia |
| 23:00/00:00 | CN index12/dayDivide forward; VN index0/current, ngày đổi00:00 | Tránh nhánh tăng ngày riêng trong getStartIndex, giữ toàn bộ dữ kiện cùng ngày | Test22:59,23:00,23:59,00:00 qua năm âm; cần chuyên gia chấp thuận quy ước |
| Ví dụ quick-start iztro | Tài liệu có Thiên Mã trong majorStars và range mẫu khác phiên bản đang khóa | Tài liệu minh họa không pin toàn bộ output2.6.1; không copy toàn JSON làm golden | Chỉ assert tập con có nguồn; phân loại sao/range còn cần bản đặc tả và golden được duyệt |

Không có lựa chọn fallback tự động khi nguồn khác nhau. Dữ kiện lịch không đủ để xác minh toàn bộ chính tinh, phụ tinh, tạp diệu, miếu/vượng, tứ hóa, tuần/triệt theo mọi trường phái.

## Phạm vi test mã

`tests/vietnamese-engine.test.ts`: 11 ngày có nguồn; 6 sóc; roundtrip toàn miền; tháng nhuận hợp lệ/không hợp lệ; ngày sai/ngoài phạm vi; 24 mốc giờ; ranh giới Tết/Lập xuân; giới tính; so đường gọi; chặn lời gọi lịch ngoài bridge; tái lập đồng thời; báo cáo snapshot cũ/mới; thiếu giờ/lịch/múi giờ unsupported.

`tests/core.test.ts` giữ regression profile cũ, nguồn rule giả/thiếu, AI lỗi/nội dung ngoài allow-list fallback, score null, production mock guard. `tests/database.test.ts` dùng profile VN: payment mismatch/idempotency/late/out-of-order, transaction rollback lúc insert job thất bại, concurrent workers, retry/email/token và assert report snapshot chính xác. Mô phỏng transaction rollback không đồng nghĩa đã kiểm thử ngắt điện/kill DB thật.

`tests/e2e/flow.spec.ts`:360px dùng VN mới,390px dùng CN cũ; nhập→lá số→đơn→QR demo→reload→webhook→worker→báo cáo; chống đọc đơn khác; keyboard/giá client; magic link một lần. Không gọi provider thanh toán thật.

Kết quả chạy thực tế và lệnh tái chạy: [TEST-RESULTS.md](TEST-RESULTS.md).

## Còn thiếu trước luận giải và bán báo cáo

1. **Lịch**: bộ niên giám Việt Nam độc lập có quyền tái sử dụng, mở rộng golden bao phủ từng năm/tháng nhuận và các sát ranh giới; người phụ trách xác nhận cách chọn UTC+7/phạm vi lịch sử. Mở rộng ngoài1976–2050 cần profile mới và bằng chứng.
2. **An sao**: tài liệu trường phái với tác giả/ấn bản/trang cho từng bảng sao, cục, can cung, miếu/vượng, tứ hóa, tuần/triệt; quyết định giờ Tý và tháng nhuận; golden nam/nữ, các cục/năm/giờ do chuyên gia có danh tính thật ký duyệt, kèm cơ chế xử lý bất đồng. Hiện không có chuyên gia được chỉ định.
3. **Luận giải 6 nhóm**: rule có nguồn/vị trí, điều kiện/ngoại lệ, phạm vi, nhận định cho phép, cách xử lý xung đột và trạng thái phê duyệt. Các fact hiện tại không thể nâng thành luận mệnh chỉ bằng AI.
4. **Đại vận**: xác nhận cách tính tuổi/hướng/khởi vận, phạm vi từng giai đoạn, lưu tinh và tương tác với lá số gốc; range upstream chưa đủ để luận thuận lợi/thách thức.
5. **Tiểu vận**: định nghĩa rõ tiểu hạn và lưu niên (không đánh đồng), năm đổi Tết hay tiết khí, tuổi mụ, bảng sao lưu và quy tắc luận được duyệt. Chưa gọi horoscope trong VN bridge.
6. **Nhật vận**: quy ước tháng/ngày xem, tháng nhuận, ranh giới giờ, thuật toán an lưu tinh ngày được kiểm chứng; không có dữ liệu ngày thật trong báo cáo.
7. **Scoring**: phương pháp/phiên bản, đặc trưng, trọng số, chuẩn hóa0–100, evidence cho từng đóng góp, xử lý thiếu/conflict và kiểm duyệt. Không lấy số từ ảnh, AI hoặc fixture.
8. **Mở bán**: kiểm duyệt phạm vi/giá bởi chủ sản phẩm; provider thật với sandbox, chữ ký webhook, đối soát; email production; kiểm thử bảo mật/tải/backup/restore/crash recovery và chính sách hỗ trợ/dữ liệu. Mock và local email hiện giữ nguyên; chưa triển khai public.
