# Mệnh: chú giải Hãm 1.28.0

Baseline 1.27.2; dùng nguyên `.local/snapshot-integrity-20261012/cohort-v2.json`, không trộn bộ gốc. Không sửa engine/calendar/validator hoặc rule cũ. Rule mới draft, review=null; đây là đối chiếu văn bản, không phải phê duyệt chuyên môn.

## Nguồn trực tiếp

Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên, PDF được cung cấp SHA256 `4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc`. Đọc ảnh PDF36–37,78–80,90–92: số in trên các trang ebook trùng số trang PDF; chưa xác minh phân trang ấn bản giấy gốc.

- PDF36 §3.8: Thái Âm Hãm Dần/Mão/Thìn/Tỵ/Ngọ. PDF79 §4.2.8 Đại cương, hai đoạn đầu: chú giải chung và giảm bất lợi về sinh kế/điều chẳng lành riêng Mão/Tỵ. Không đổi bảng Hãm thành Đắc. Vế hành vi riêng không yêu cầu độc thủ, can sinh, giới tính hay sao đi cùng.
- PDF37 §3.11: Thiên Tướng Hãm Mão/Dậu. Câu Đại cương bắt đầu cuối PDF90, tiếp đầu PDF91: đặt đôn hậu cạnh dễ đam mê, thích ăn chơi, không lo xa; cùng đoạn có bất như ý nhưng vẫn sinh kế và tuổi thọ. Không lấy một vế thành kết luận cá nhân. Không yêu cầu độc thủ/can/giới tính cho câu chung.
- Chọn chú giải đơn sao, không phải lời tổng hợp. Không chuyển câu về hình thể, trí tuệ, phẩm hạnh, bệnh tật, tuổi thọ hoặc số phận thành đánh giá người đọc. Vế hoàn cảnh được giữ ở giới hạn như mô tả của nguồn, không dự báo thực tế.

## Ba nhánh

1. `tanbien.life-batch-nguyet-ham-dan-thin-ngo`: Thái Âm bản mệnh tại Mệnh Dần/Thìn/Ngọ; `tanBienLifeTables.taiyin@1.0.0 = Hãm`.
2. `tanbien.life-batch-nguyet-ham-mao-ty`: cùng sao tại Mão/Tỵ, cùng bảng; nhắc điều chỉnh riêng của sách, không bảo đảm đời sống thuận lợi.
3. `tanbien.life-batch-tuong-ham-mao-dau`: Thiên Tướng bản mệnh tại Mệnh Mão/Dậu; `tanBienLifeTables.tianxiang@1.0.0 = Hãm`.

Hình thức hóa của dự án: profile tanbien-vn-trial-v2, chứng nhận danh sách đầy đủ + 12 cung/14 chính tinh duy nhất, scope origin, source-position gate hiện hành. Không dùng originalBrightness hoặc nhãn engine để lấp ô bảng nguồn. Thiếu bảng/ô cần thiết trả missing-facts; đủ dữ kiện sai vị trí hoặc trạng thái trả condition-false. Không thêm điều kiện độc thủ. Các sao cùng cung còn nguyên trong fact và căn cứ; không tạo lời Cơ–Âm/Đồng–Âm từ chú giải.

## Điều chỉnh chưa được thực thi

- Âm PDF79: nhiều sao mờ/sáng hội hợp; Tuần/Triệt án ngữ; Hình đồng cung. PDF80 còn các nhánh giới tính và hội hợp. Không đặt ngưỡng nhiều, không suy lượng từ AND/OR. Mão/Tỵ là ngoại lệ văn bản đã phản ánh ở chính nhánh địa chi, không phải giả thuyết giải hạn.
- Tướng PDF91: hội hợp nhiều sao mờ/sát tinh; Tuần/Triệt án ngữ; Hình đồng cung; các đoạn Nam/Nữ khác phạm vi. PDF92 có nhánh Liêm–Tướng Tý/Ngọ giáp Kình, không mượn cho Mão/Dậu.
- Các điều chỉnh này có thể thay đổi lời đánh giá hoàn cảnh; do đó không xuất lời đánh giá hoàn cảnh, kết luận tính cách hoặc sức khỏe. Chỉ xuất chú giải riêng và giới hạn ngay cạnh đoạn. `exceptions: []` của rule không chứng minh không tồn tại ngoại lệ; metadata ghi phạm vi chưa phối hợp.
- Tân Biên đủ cho các vế chú giải được chọn. Không dùng thêm Thiên Lương hoặc tuyên bố đã giải quyết tổng hợp bằng chính sách ưu tiên nguồn.

## Hồi quy

192 v2 đều qua validator. Bốn nhóm loại trừ nhau theo ưu tiên: có nhánh tổ hợp trực tiếp 10→10; cung thực tế một chính tinh có chú giải 74→81; các chú giải riêng còn lại 44→47; chỉ dữ kiện 64→54. Nhóm một chính tinh không có nghĩa rule yêu cầu độc thủ. Unknown là chỉ tiêu chồng lấp: 0→0. Thân không thêm diễn giải.
11 lượt claim mới: 10 mẫu trước chỉ có dữ kiện, 1 mẫu được thêm chú giải; không thêm lời tổ hợp. Tất cả rule/trace/claim cũ trên 192 được so sánh bằng cấu trúc và không đổi, gồm Công việc/Tài Bạch. Từng mẫu/đường dẫn nằm trong `.local/life-ham-20261012/comparison.json`.

Bản trước trong HTML được tái lập bằng renderer 1.27.2 trên cùng snapshot, không giả làm bản lưu lịch sử gốc. Bản mới lưu riêng, không ghi đè lịch sử. Bảng nguồn mới được đóng trong frozen reading; giới hạn mới được đặt cạnh đoạn qua cơ chế nearbyNotes hiện có.
