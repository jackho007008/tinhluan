# Quy ước Mệnh chủ theo chi năm sinh — 1.0.0

Quyết định sản phẩm của chủ dự án ngày 11/10/2026. Chỉ áp dụng cho kết quả **mới** của profile `tanbien-vn-trial-v2`. Không tuyên bố cách theo chi cung Mệnh sai, không gán phương pháp này cho Tân Biên. Không đổi `algorithm=default` của iztro, không thay engine an sao.

## Đối chiếu trước triển khai

Đã đọc trực tiếp iztro 2.6.1 đang cài: `node_modules/iztro/lib/data/earthlyBranches.js` trường `soul`, `lib/data/constants.js` thứ tự chi Tý=0, `lib/astro/astro.js` đoạn chọn đầu vào soul (khoảng dòng 203–226). Nhánh thư viện `zhongzhou` dùng chi năm; **dự án không bật nhánh này**. Chỉ bảng mã được tái sử dụng qua adapter riêng. Bảng khớp đầy đủ bảng người dùng chốt:

Tý/ziEarthly → tanlangMaj/Tham Lang; Sửu/chouEarthly → jumenMaj/Cự Môn; Dần/yinEarthly → lucunMin/Lộc Tồn; Mão/maoEarthly → wenquMin/Văn Khúc; Thìn/chenEarthly → lianzhenMaj/Liêm Trinh; Tỵ/siEarthly → wuquMaj/Vũ Khúc; Ngọ/wuEarthly → pojunMaj/Phá Quân; Mùi/weiEarthly → wuquMaj/Vũ Khúc; Thân/shenEarthly → lianzhenMaj/Liêm Trinh; Dậu/youEarthly → wenquMin/Văn Khúc; Tuất/xuEarthly → lucunMin/Lộc Tồn; Hợi/haiEarthly → jumenMaj/Cự Môn.

## Luồng dữ liệu và phiên bản

`calculate` → lịch và an sao hiện hành → `applyYearRuler` → snapshot → lưu bài đọc. Adapter lấy `chart.tanBien.inputs.lunar.lunarYear`, tức năm âm đã được profile chuẩn hóa, chuyển `(year - 4) mod 12` sang mã chi Tý=0 (cùng phép chuẩn hóa của profile). Không lấy năm dương nhập, năm xem, nhãn chi đã dịch hoặc chi cung Mệnh. Hàm tra nhận mã chi, trả mã sao rồi mới dịch tên Việt. Thiếu năm âm thì trạng thái `missing-birth-year`, giá trị trống; không fallback.

Dữ liệu mới có `chart.rulers` ghi phương pháp, mã chi, mã sao, đường dẫn đầu vào, nguồn, phiên bản và giá trị upstream trước thay đổi. `versions.rulerConvention = birth-year-soul-1.0.0` tham gia resultId. Phiên bản engine an sao giữ nguyên. Trace/inheritance của engine vẫn ghi đúng phương pháp upstream; quyết định áp dụng cuối cùng nằm ở `chart.rulers`. Receipt có hash adapter mới.

Hồ sơ cũ không chạy adapter khi đọc. Giữ nguyên `chart.soul`, snapshot, receipt, frozen reading, báo cáo/ảnh cũ. Giá trị upstream cũ trong metadata mới là bằng chứng chuyển đổi, không dùng để ghi đè lịch sử. Hai bản đối chiếu mới có parentId tới hồ sơ nguồn.

## Nơi sử dụng và ảnh hưởng

`customerInfo` đọc nguyên `chart.soul`/`chart.body`, được ChartSheet dùng cho web, PNG, PDF; không tra lại tại UI. Sao chủ cục bị ẩn trong formatter, không xóa thuộc tính lịch sử, giữ Cục. Các nhãn không mang thuật ngữ kỹ thuật.

Rà `lib/interpretation-rules` và `lib/internal-review`: không có điều kiện rule hoặc claim lấy `chart.soul`/Mệnh chủ. Không sửa catalog, rule, trạng thái duyệt hoặc luận giải. Bản bài đọc mới chỉ đổi liên kết snapshot/provenance; nội dung được so sánh riêng khi tạo hai hồ sơ.

Kiểm thử: đủ 12 chi và mã sao theo bảng người dùng (expected thủ công độc lập với output); cùng năm khác 12 cung Mệnh; đổi năm xem; thiếu đầu vào; bản dịch chi khác; hai hồ sơ; so sánh toàn bộ chart trừ soul/rulers. Không nghiên cứu Sao chủ cục.

## Cập nhật được chủ dự án chọn: `quan-xuan-thinh-year-rulers-1.0.0`

Áp dụng cho kết quả mới từ 11/10/2026: cả Mệnh chủ và Thân chủ theo địa chi năm âm bản mệnh đã chuẩn hóa. Nguồn là đoạn trích người dùng cung cấp, ghi “Số Tử vi kinh nghiệm, quyển thượng — Quản Xuân Thịnh”; chưa đối chiếu bản gốc của tác giả, không gán thành công thức Tân Biên. Không đưa các đoạn luận giải/Tam Tài đi kèm vào rule.

Mệnh chủ giữ bảng mã ở mục trên. Thân chủ: Tý → Linh Tinh/lingxingMin; Sửu → Thiên Tướng/tianxiangMaj; Dần → Thiên Lương/tianliangMaj; Mão → Thiên Đồng/tiantongMaj; Thìn → Văn Xương/wenchangMin; Tỵ → Thiên Cơ/tianjiMaj; Ngọ → Hỏa Tinh/huoxingMin; Mùi → Thiên Tướng; Thân → Thiên Lương; Dậu → Thiên Đồng; Tuất → Văn Xương; Hợi → Thiên Cơ.

Đối chiếu mã nguồn iztro 2.6.1: bảng soul khớp toàn bộ; bảng body khác tại Tý (thư viện dùng huoxingMin, lựa chọn mới dùng lingxingMin). Đây là thay đổi có chủ đích theo nguồn đã chọn, không phải lỗi dịch và không thay algorithm của thư viện. Giữ bảng tham chiếu iztro cũ trong test để phân biệt hai quy ước.

Metadata mới `chart.rulers.body` giữ mã sao, phương pháp và giá trị upstream; metadata soul và phiên bản cũ vẫn đọc được. Thiếu năm âm: cả hai giá trị trống, có trạng thái missing-birth-year, không tra chi cung Mệnh hoặc năm xem. UI, PNG và PDF tiếp tục đọc các giá trị đã lưu qua formatter chung; không thêm nhãn kỹ thuật. Không thay Cục, vị trí sao hoặc Thân cư. Rule không dùng hai chủ tinh nên không thay nội dung luận giải.
