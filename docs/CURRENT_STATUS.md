# Tinh Luận — trạng thái bàn giao hiện hành

Cập nhật21/10/2026 sau ND04 Phụ Mẫu/Huynh Đệ (1.55.0). Hướng Tật Ách vẫn chỉ được thẩm định, chưa publish. Đây là bản tóm tắt để chuyển thread, **không thay thế backlog 19 việc** tại [V1-DELIVERY-PLAN.md](V1-DELIVERY-PLAN.md).

Đọc tiếp: [hợp đồng sản phẩm](BUSINESS_RULES.md), [sổ quyết định](DECISIONS.md), [đầu mối bàn giao](HANDOFF.md).

## 1. Bản nào đang phục vụ khách?

- Trình bày **1.55.0**, catalog **interpretation-1.52.0**. Đã có trong luồng khách tạo mới, không chỉ bản nghiệm thu nội bộ.
- QA chính: `http://127.0.0.1:3062`; checkout phục vụ `/Volumes/DATA/TINHLUAN/.local/vcd-20261021/qa-final`.
- URL tunnel tại lần nghiệm thu gần nhất: https://61ac-171-246-109-226.ngrok-free.app/lap-la-so . Tunnel có thể đổi; không coi là tên miền triển khai ổn định.
- Nguồn làm việc: `/Volumes/DATA/TINHLUAN`. Checkout trước để đối chiếu/quay lại: `.local/nd03-20261020/qa-final` (1.54.0/1.51.0). QA3070 giữ riêng, không hợp dữ liệu thử của nó vào kho chính.
- Policy bản mới: `menh-free-1.0.0`; continuous report: `continuous-report-1.6.0`. P1/P2/M05/M07 và các phép ND01/ND04 đã khép tiếp tục dùng chung pipeline.
- **Beta, chưa mở bán; SePay Live tắt.** Quy tắc luận vẫn `draft`, `review=null`. Chủ dự án duyệt giao diện hoặc nội dung Toàn thư không đồng nghĩa duyệt chuyên môn toàn báo cáo.
- Đã xác minh process/build/API tạo mới/tunnel tại lô21/10. Git đầu lô `main@1fa0829`, sạch; xem `git log -1` cho commit kết thúc. [Hash code phục vụ](../.local/vcd-20261021/serving-code.json), [bảo toàn kho](../.local/vcd-20261021/preservation.json). Web/worker cùng checkout, không chạy chồng; QA3070 giữ nguyên.

## 2. Những gì đã triển khai

### Đang có trên luồng khách

- `/lap-la-so`: nhập → kiểm dữ liệu → tạo và lưu bản thật → `/ban-doc`. Không còn bước xác nhận trung gian. Có trạng thái tạo, lỗi/thử lại, chống gửi trùng; sửa đầu vào tạo bản mới.
- Đọc Mệnh miễn phí theo nguyên nhóm nghĩa G2, phần “Nét chính về bạn” chỉ dùng nội dung miễn phí. Dữ kiện lá số, tra cứu 12 cung, mục lục và mở/thu; phân biệt có lời nhưng khóa với chưa có lời.
- Báo cáo có quyền đầy đủ đọc toàn bản đã lưu và tải PDF; không chạy lại catalog khi mở/giao/tải. Bản cũ giữ nguyên nội dung, quyền và hạn.
- Google Login, “Lá số của tôi”, tìm kiếm/phân trang, bản đã liên kết và đơn thật của tài khoản. Không tự nhận báo cáo theo tên/email.
- Khôi phục email đã nghiệm thu trên QA chính, dùng token một lần và phiên quyền hiện có. **Gmail vẫn chỉ gửi tới địa chỉ nhận thử được cho phép**, chưa gửi đại trà cho khách.
- Toàn thư: **34 bài đã được chủ dự án duyệt nội dung và xuất bản** — 8 nền, 12 cung, 14 chính tinh. Bài bổ trợ Vũ Khúc–Văn Khúc và fixture không thuộc 34 bài. CMS giữ nháp và phiên bản công khai riêng.

### Chỉ mở cho QA hoặc quản trị

- G4 checkout một gói **Test Mode**, chỉ tài khoản Google QA A/B; cấu hình thử 1.000đ/72 giờ không phải giá/hạn thương mại. Có webhook và API đối soát SePay thật, worker giao bản cố định, chống trùng và quyền máy chủ.
- G5 admin: tổng quan Test/Live, người dùng, báo cáo, đơn/giao dịch, quyền, lỗi email/PDF, nhật ký và CMS. Chỉ tài khoản A được chỉ định admin; Google Login thông thường không cấp vai trò này.
- Admin chủ yếu xem/tra cứu. Không có nút tự đánh dấu paid, hoàn tiền, cấp/thu hồi quyền đọc hoặc retry thủ công. CMS có thay đổi dữ liệu theo quyền và nhật ký.
- Các lỗi bền vững email/PDF chỉ được ghi từ lúc cơ chế đó triển khai; không suy “không có log cũ” thành “chưa từng có lỗi”.

### Nội dung mới nhất đã vào pipeline chung

- ND01: Vũ Khúc tại Thiên Di Tứ Mộ; giữ các lời nền/điều chỉnh riêng, không đếm câu trùng.
- ND04 Thiên Di: sáu nhánh cặp và nền Nhật–Nguyệt đã chốt. **23/32 ca Di vô chính diệu trước trống có lời; 9 ca còn chặn**, không mở lại cùng nguồn khi chưa có bằng chứng mới.
- Tử Nữ: Cơ–Lương/Đồng–Cự ở đối cung theo hợp đồng riêng; Đồng/Lương Tỵ/Hợi có câu ly tán/phiêu bạt. Bốn cặp VCD bổ sung có trong catalog nhưng chỉ có kiểm predicate bằng fixture, chưa có chứng kiến engine trong 192 và phạm vi tìm 480 đầu vào; không báo đã nghiệm thu end-to-end.
- Nô Bộc: xét được nhiều chính tinh khi tất cả trong từng cung cùng rơi vào một ô nhóm/trạng thái nguồn. Không chọn sao thắng hoặc lấp ô nguồn thiếu.
- Phu Thê: bảy nhánh nguồn rõ đã thêm; giữ “sớm/muộn” và điều kiện đi kèm, không tạo tuổi kết hôn.
- **1.53.0:** Vũ–Tham tại Huynh Đệ giữ cả “sớm xa nhau” và “về sau đều giàu có”; không đặt tuổi kích hoạt. Một cung trước trống có lời, một cung có lời được bổ sung.

- **1.54.0 / ND03:** biên tập dùng chung Công việc và Tài–Điền; phân nguồn thu/giữ tiền/thừa hưởng/tự tạo/duy trì nhà đất, đặt lời nền và điều chỉnh cạnh nhau, giữ lời khác chiều. Không thêm claim hoặc đổi evaluator; bản mới lưu riêng. [Toàn văn trước/sau](../.local/nd03-20261020/ban-giao.md).

- **1.55.0 / ND04:**33 câu của cặp chính tinh xung chiếu được nêu riêng cho Phụ/Huynh, không phụ thuộc địa chi/trạng thái. Chỉ dùng lời cung nhận; giữ TT chưa giải và giới hạn Phúc–Huynh. [Đặc tả nguồn](PHU-HUYNH-1.32.0.md).

## 3. Độ phủ thực tế: bộ 192, không phải mọi lá số

Theo [đối chiếu192 ND04 với1.54.0](../.local/vcd-20261021/impact192.json), số cung **chưa có đoạn luận**:

- Mệnh **0**; Phụ Mẫu **54**; Phúc Đức **43**; Điền Trạch **59**.
- Quan Lộc **28**; Nô Bộc **71**; Thiên Di **14**; Tật Ách **192**.
- Tài Bạch **21**; Tử Nữ **97**; Phu Thê **67**; Huynh Đệ **44**.

ND04:38 snapshot có43 claim mới; Phụ16 cung mới có lời/2 bổ sung, Huynh20 mới/5 bổ sung. Các cung khác giữ nguyên;192/192 vẫn có ít nhất một cung thiếu lời (Tật). Có một đoạn không chứng minh đầy đủ chủ đề.33 nhánh có fixture;15 có mẫu engine trong192 hoặc tìm hữu hạn1.440 đầu vào ngoài bộ,18 chưa chứng minh khả đạt.14 đầu vào ngoài bộ chứng kiến15 nhánh, không đếm trùng snapshot. ND03 trước đó chỉ biên tập, không giảm cung trống.

## 4. Khoảng thiếu và điểm dừng

- **ND03 Công việc / Tài–Điền đã khép về trình bày**; chưa giải phép kết luận ròng khi lời khác chiều. **Có rule nhưng chờ quyết định quyền:** ND02 năm rule Mệnh–Thân, không phải thiếu code chuyên môn.
- **Chưa chốt điều kiện nguồn:** VCD phụ thuộc trạng thái/địa chi và nơi áp dụng ngoại lệ (tập con Phụ/Huynh không cần trạng thái đã có); M06 lượng từ/hội hợp; Phủ–sát tinh; ô ngũ hành; Tuần/Triệt và các cặp lời khác chiều. Câu hỏi, trang nguồn theo từng ND ở [BUSINESS_RULES](BUSINESS_RULES.md#4-các-câu-hỏi-chuyên-môn-thực-sự-đang-chặn).
- Lô21/10 đã giải tập con VCD Phụ/Huynh vốn bị chặn rộng bởi câu hỏi trạng thái. Các tập con chưa rõ vẫn ở ND04/11/14; không kết luận sách đã hết phương pháp. Không mở lại chín Di bị chặn khi chưa có bằng chứng mới.
- **Phạm vi:** số lượng/thứ bậc/âm phần đang bị loại do lựa chọn triển khai, chưa xác minh quyết định thương mại cuối của chủ dự án. Phân biệt với các cấm đã xác nhận tại [DECISIONS](DECISIONS.md).
- **Tật Ách:** chủ dự án đồng ý hướng chú giải truyền thống theo cấu trúc để thẩm định; **chưa duyệt hai mẫu, chưa publish, chưa hoàn thành luận cá nhân**. [Toàn văn hai mẫu](BUSINESS_RULES.md#5-toàn-văn-hai-mẫu-tật-ách-để-duyệt) giữ nguyên.
- **Kiểm thử ND03:**27/27 tại5file; G2 riêng6/6; typecheck/build cuối đạt. Expected cơ bản cũ đã được đối chiếu hợp đồng nguyên nhóm1.1 và khép; không phải toàngate xanh. [TESTING](TESTING.md#5-lỗi-mở-và-kết-quả-cũ-còn-giới-hạn).
- **Bảo toàn:**112file báo cáo/98ID khác nhau,31file phiên cũ giữ hash; quyền/binding/link cũ và34bài công khai giữ nguyên.4bản/4đơn mock QA mới qua2lượt, chỉ2cấu trúc engine. [File](../.local/nd03-20261020/file-preservation.json), [DB](../.local/nd03-20261020/db-after.json), [UI](../.local/nd03-20261020/public-acceptance.json).

## 5. Task hiện tại

ND04 Phụ/Huynh đã khép tập con nguồn rõ và dừng. Luồng khách tạo1.55.0/catalog1.52.0; G2 không đổi.679/679 kiểm tại8file, G2 riêng6/6, typecheck/build đạt; hai hồ sơ ngoài bộ qua form, lưu/mở lại/mobile360/390/căn cứ; một PDF8trang đủ18đoạn, đã xem ảnh mọi trang. [Bàn giao và toàn văn mẫu](../.local/vcd-20261021/ban-giao.md).

Đã ghi cả lỗi đầu: input fixture thiếu nơi sinh; test xóa thuộc tính bắt buộc gây typecheck; bộ tìm mẫu chọn năm ngoài miền; phép so phát hiện thêm metadata vào quan hệ B cũ, đã tách B-vcd và giữ B cũ nguyên vẹn. Không sửa expected nguồn/lịch sử. Không chạy lại toàngate.

Bảo toàn117file báo cáo/103ID,35file phiên trước lô; quyền/binding/link và34bài công khai cũ không đổi. Hai báo cáo/hai đơn mock QA mới phục vụ nghiệm thu, không Live. [Hash file](../.local/vcd-20261021/preservation.json), [hash DB](../.local/vcd-20261021/db-after.json).

Cần thẩm định: TT tác động ở cung cho/nhận và cách đổi lời giàu nghèo của Phụ; vị trí xét cho các câu phụ thuộc trạng thái; phép phối hợp Phúc–Huynh. Không mở lại9Di cùng nguồn. Tật chưa duyệt mẫu/publish; chưa đủ12cung, chưa mở bán.

## Baseline Git — 21/10/2026

Đã chuẩn bị quản lý mã/tài liệu cục bộ theo [GIT-BASELINE](GIT-BASELINE.md). Đã có baseline commit `0c5461a1d6fe2bbba9522e99dbeebd8fab67eb98` trên branch `main`, từ597 file đã rà; cập nhật bàn giao bằng commit tài liệu riêng. Không có remote/push. Gói Git không xác minh lại hoặc thay runtime1.54.0/catalog1.51.0, không restart QA/test/build/migration.
