# Sao lưu năm và sao lưu đại vận — 10/10/2026

Triển khai trong `calculate → applyTanBienV2 → decadalLayer`, engine `tanbien-trial-0.3.0`, quy ước bổ sung `supplemental-iztro-decadal-1.0.0`. UI/PNG/PDF cùng đọc `chart.tanBien.decadal`, không tính lại tại tầng trình bày. Profile v2 giữ tên; phiên bản engine và resultId mới. Không đưa các sao này vào facts/rule luận giải bản mệnh.

## Đặc tả đã triển khai

- Năm xem là nhãn năm âm; tuổi mụ = năm xem − năm âm sinh + 1. Không sử dụng ngày hiện tại hoặc tháng sinh để chuyển vận trong một năm.
- Đại vận là cung duy nhất có khoảng `palaces[].decadal.range` chứa tuổi, tính cả hai đầu. Các khoảng bản mệnh hiện hành khởi từ số Cục tại Mệnh, dương nam/âm nữ thuận, âm nam/dương nữ nghịch, mỗi cung thêm 10. Nguồn Tân Biên tr.20–21 §10.1, cách thứ nhất.
- Can chi đầu vào bộ sao là `palaces[].heavenlyStem/earthlyBranch` của cung gốc trên, không phải can chi năm xem hoặc vị trí lưu đại hạn từng năm §10.2.
- Chưa đến vận đầu, ngoài khoảng đã lưu, khoảng chồng nhau, thiếu can chi: trả unavailable, không dùng vận đầu làm fallback. Thiếu sao gốc của một Hóa: chỉ bỏ mục Hóa đó, ghi partial và vấn đề; các sao độc lập vẫn được tính.
- Dữ liệu mỗi sao: ID ổn định theo vận và mã sao, scope decadal, mã, tên, cung đích, nguồn, quy ước và phiên bản. Hóa còn có target.code/name/path trỏ vào chính/phụ tinh bản mệnh. Không gộp tên giữa các scope.

## Nhóm công thức và phạm vi

| Nhóm               | Đầu vào / công thức                                                                                          | Nguồn / phạm vi                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Khôi–Việt          | Can đại vận: Giáp/Mậu/Canh → Sửu/Mùi; Ất/Kỷ → Tý/Thân; Bính/Đinh → Hợi/Dậu; Tân → Ngọ/Dần; Nhâm/Quý → Mão/Tỵ | Bổ sung iztro 2.6.1 getKuiYueIndex; đối chiếu An tinh quyết §14                                 |
| Xương–Khúc         | Theo can Giáp…Quý: Tỵ/Dậu, Ngọ/Thân, Thân/Ngọ, Dậu/Tỵ, Thân/Ngọ, Dậu/Tỵ, Hợi/Mão, Tý/Dần, Dần/Tý, Mão/Hợi    | Bổ sung iztro 2.6.1 getChangQuIndexByHeavenlyStem; không dùng giờ sinh cho hai sao lưu này      |
| Lộc–Kình–Đà        | Lộc theo can Giáp…Quý: Dần,Mão,Tỵ,Ngọ,Tỵ,Ngọ,Thân,Dậu,Hợi,Tý; Kình tiến 1, Đà lùi 1                          | Bổ sung iztro getLuYangTuoMaIndex; đối chiếu An tinh quyết §15                                  |
| Thiên Mã           | Chi cung đại vận: Dần/Ngọ/Tuất → Thân; Thân/Tý/Thìn → Dần; Tỵ/Dậu/Sửu → Hợi; Hợi/Mão/Mùi → Tỵ                | Bổ sung iztro getLuYangTuoMaIndex; đối chiếu An tinh quyết §16                                  |
| Hồng Loan–Thiên Hỷ | Tý=0: Hồng Loan = (3 − chi) mod12; Hỷ = Loan+6                                                               | Bổ sung iztro getLuanXiIndex                                                                    |
| Tứ Hóa             | Bảng can cố định của iztro default; liên kết tới sao bản mệnh, không sửa mutagen bản mệnh                    | Bổ sung iztro heavenlyStems.mutagen; đối chiếu An tinh quyết §18. Không thay bằng bảng Tân Biên |

API đúng phiên bản đã đọc: `FunctionalAstrolabe.decadalList` và `horoscope().decadal`, `getHoroscopeStar` (10 sao). Tái sử dụng bốn helper vị trí; kết quả helper Dần=0 được đổi thành Tý=0 bằng `(i+2)%12`. Bảng Hóa dùng dữ liệu mặc định cố định, không thay global astro.config. Không gọi fallback vận tuổi nhỏ của iztro.

Nguồn bổ sung:

- https://iztro.com/learn/horoscope — phân biệt đại vận, tiểu hạn, lưu niên.
- https://iztro.com/learn/setup — An tinh quyết §§4,14–16,18.
- Bản cài khóa `iztro@2.6.1`: lib/star/location.js, lib/star/horoscopeStar.js, lib/data/heavenlyStems.js, lib/astro/FunctionalAstrolabe.js.

PDF Tân Biên của dự án: tr.20–22 và 268–269 đã đọc. Chưa xác lập từ sách một bộ 10 sao/Tứ Hóa đại vận như iztro; đây là quy ước bổ sung có tên, không gán cho Tân Biên. Sai khác văn ví dụ/sơ đồ lưu đại hạn tr.21–22 vẫn được ghi nhận, không được dùng để chọn cung an bộ sao này. Không hỗ trợ các vòng Bác Sỹ/Thái Tuế/Tướng trước của đại vận hoặc thêm sao ngoài 10 sao+4 Hóa nêu trên.

## Điều khiển và lưu trữ

Ba lựa chọn mặc định false, không đọc localStorage/URL/snapshot để tự bật. Hiện chưa cung cấp link khôi phục lớp; link hồ sơ luôn mở bản mệnh. Đổi tên checkbox “An lưu tiểu vận” thành “Sao lưu năm”: lớp hiện có là 9 sao theo can chi năm xem (Tân Biên tr.268–269), không an từ cung tiểu hạn. Dấu tiểu hạn và tháng lưu là dữ liệu thời hạn riêng đi kèm lựa chọn cũ.

“Đánh dấu cung đại vận” đánh dấu cung gốc mười năm, độc lập bộ sao. Dữ liệu `viewing.decade` cũ (lưu đại hạn từng năm) không bị xóa, chỉ không dùng cho dấu cung gốc mới.

Đổi năm giữ lựa chọn lớp trong phiên, tính lại snapshot. Ngay khi sửa năm: ẩn phiếu/không có nút xuất; request cũ bị hủy và kiểm tra sequence. Chỉ nhận kết quả khớp năm yêu cầu. Lỗi vẫn ẩn kết quả cũ. Luồng nội bộ tạo hồ sơ con mới; trang chủ dùng POST /api/chart. Không ghi đè hồ sơ gốc.

Export clone cùng SVG đang xem; sao lưu năm có L., đại vận ĐV.; Lưu Hà bản mệnh giữ tên. File có hậu tố năm/vận. Nếu trạng thái thay đổi trong khi chuẩn bị export, hủy xuất thay vì trả bản cũ. PDF A4 chứa ảnh chất lượng cao từ cùng canvas PNG, không phải PDF chữ có thể chọn.

## Ranh giới đối chiếu

Kim Thoa: 2019 (15 tuổi) và 2028 (24 tuổi) ở Phụ Mẫu/Kỷ Mão; 2029 (25 tuổi) sang Phúc Đức/Canh Thìn, khoảng 25–34.
Hồ sơ 07/08/1992: 2024 (33 tuổi) và 2033 (42 tuổi) ở Điền Trạch/Quý Mão; 2034 (43 tuổi) sang Quan Lộc/Giáp Thìn, khoảng 43–52.
Ca đảo chiều: cùng ngày sinh Kim Thoa nhưng nam, năm 2019 vận 15–24 ở Huynh Đệ/Sửu, chiều nghịch. Expected lấy từ phép đếm Tân Biên §10.1 và bảng can cung đã lưu, không lấy output hàm đang thử.

## Nghiệm thu và tệp bàn giao

- 31/31 kiểm thử liên quan đạt (7 tệp); TypeScript đạt. Gồm bảng Khôi–Việt–Lộc đủ 10 can, ranh giới hai hồ sơ, đảo chiều, thiếu dữ liệu, partial Tứ Hóa, bốn tổ hợp lớp và Lưu Hà. Log: `.local/decadal-20261010/targeted-tests.log`.
- Luồng trang chủ đã lập cả hai hồ sơ và xuất bằng nút PNG/PDF thật. ID kết quả khớp hai hồ sơ mới lưu bằng API nội bộ.
- Kim Thoa: request 2029 tiếp theo 2027 trả đúng 2027; 2028 còn 15–24, 2029 chuyển 25–34. Checkbox đang tắt không tự bật khi đổi năm. Dấu cung bật riêng cho 0 sao lưu. Khi input năm chưa áp dụng, DOM có 0 phiếu và 0 nút xuất.
- Lần tra cứu 1992 sau Kim Thoa bật cả hai lớp trở về 0 sao lưu. Bật cả hai: 9 lưu năm, 14 đại vận, cỡ chữ sao tối thiểu 16 trên SVG.
- Desktop và viewport 360/390px: không tràn toàn trang; phiếu 900px nằm trong vùng cuộn ngang. Không tuyên bố toàn bộ 12 cung vừa màn hình nhỏ. Có chế độ Danh sách.
- Hai PDF render một trang A4 595.28×841.89pt, không chồng chữ qua kiểm tra ảnh. Tắt/bật các lớp không đổi dữ liệu cung. Bản PNG/PDF dùng chung SVG theo trạng thái đã chọn.
- So sánh 50 tệp hồ sơ lịch sử bằng SHA-256: không đổi. 12 cung bản mệnh của hai hồ sơ mới bằng tuyệt đối hồ sơ gốc (gồm sao, Hóa, đại hạn và dữ liệu vòng); không thay engine an sao bản mệnh, danh tính sao hoặc Tuần/Triệt.
- Chạy thử toàn dự án ban đầu chưa xanh: nhóm database/beta bị EPERM khi kết nối PostgreSQL cục bộ; bốn kiểm thử luận giải/catalog ngoài phạm vi vẫn có expected không khớp. Các lỗi UI/ruler-convention phát hiện trong lần chạy đó đã sửa và 31 kiểm thử liên quan chạy lại đạt. Không sửa rule/catalog để làm xanh các ca ngoài phạm vi; không bật dịch vụ thật.

Hồ sơ mới (mở mặc định chỉ bản mệnh, cần phiên nội bộ):
- Kim Thoa: http://localhost:3000/internal/readings?id=9f53ec47-4361-49b6-953c-6238060cbb08
- 07/08/1992: http://localhost:3000/internal/readings?id=d7953053-6452-4f9c-a3a1-b2fe46eda69d

Tệp thực tế trong `.local/decadal-20261010/`: `kim-natal.png`, `kim-year.png`, `kim-decade.png`, `kim-both.png`, `kim-both.pdf`, `1992-both.png`, `1992-both.pdf`. `records.json` lưu ID, quan hệ hồ sơ nguồn và hash lịch sử. Các ảnh mobile và ảnh render A4 ở cùng thư mục.
