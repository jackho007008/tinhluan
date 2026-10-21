# Tinh Luận — trạng thái bàn giao hiện hành

Cập nhật21/10/2026 sau lô Tử–Phu (1.56.0). Hướng Tật Ách vẫn chỉ được thẩm định, chưa publish. Đây là bản tóm tắt để chuyển thread, **không thay thế backlog 19 việc** tại [V1-DELIVERY-PLAN.md](V1-DELIVERY-PLAN.md).

Đọc tiếp: [hợp đồng sản phẩm](BUSINESS_RULES.md), [sổ quyết định](DECISIONS.md), [đầu mối bàn giao](HANDOFF.md).

## 1. Bản nào đang phục vụ khách?

- Trình bày **1.56.0**, catalog **interpretation-1.53.0**. Đã có trong luồng khách tạo mới, không chỉ bản nghiệm thu nội bộ.
- QA chính: `http://127.0.0.1:3062`; checkout phục vụ `/Volumes/DATA/TINHLUAN/.local/kin-batch-20261021/qa-final`.
- URL tunnel tại lần nghiệm thu gần nhất: https://61ac-171-246-109-226.ngrok-free.app/lap-la-so . Tunnel có thể đổi; không coi là tên miền triển khai ổn định.
- Nguồn làm việc: `/Volumes/DATA/TINHLUAN`. Checkout trước để đối chiếu/quay lại: `.local/family-accuracy-20261021/qa-final` (1.55.1/1.52.1). QA3070 giữ riêng, không hợp dữ liệu thử của nó vào kho chính.
- Policy bản mới: `menh-free-1.0.0`; continuous report: `continuous-report-1.6.1`. P1/P2/M05/M07 và các phép ND01/ND04 đã khép tiếp tục dùng chung pipeline.
- **Beta, chưa mở bán; SePay Live tắt.** Quy tắc luận vẫn `draft`, `review=null`. Chủ dự án duyệt giao diện hoặc nội dung Toàn thư không đồng nghĩa duyệt chuyên môn toàn báo cáo.
- Đã xác minh web/worker cùng checkout và API tạo mới QA3062 trong lô này; code commit `8776d6e`, baseline `28328cc` sạch. [Danh tính phục vụ](../.local/kin-batch-20261021/serving-code.json), [đích DB/kho](../.local/kin-batch-20261021/runtime-target.json), [bảo toàn](../.local/kin-batch-20261021/preservation.json). QA3070 giữ PID94421. Tunnel ở dòng trên là lần nghiệm thu cũ, không xác minh lại tunnel trong lô này.

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

### Nội dung đã vào pipeline chung

- ND01: Vũ Khúc tại Thiên Di Tứ Mộ; giữ các lời nền/điều chỉnh riêng, không đếm câu trùng.
- ND04 Thiên Di: sáu nhánh cặp và nền Nhật–Nguyệt đã chốt. **23/32 ca Di vô chính diệu trước trống có lời; 9 ca còn chặn**, không mở lại cùng nguồn khi chưa có bằng chứng mới.
- Tử Nữ: Cơ–Lương/Đồng–Cự ở đối cung theo hợp đồng riêng; Đồng/Lương Tỵ/Hợi có câu ly tán/phiêu bạt. Bốn cặp VCD bổ sung có trong catalog nhưng chỉ có kiểm predicate bằng fixture, chưa có chứng kiến engine trong 192 và phạm vi tìm 480 đầu vào; không báo đã nghiệm thu end-to-end.
- Nô Bộc: xét được nhiều chính tinh khi tất cả trong từng cung cùng rơi vào một ô nhóm/trạng thái nguồn. Không chọn sao thắng hoặc lấp ô nguồn thiếu.
- Phu Thê: bảy nhánh nguồn rõ đã thêm; giữ “sớm/muộn” và điều kiện đi kèm, không tạo tuổi kết hôn.
- **1.53.0:** Vũ–Tham tại Huynh Đệ giữ cả “sớm xa nhau” và “về sau đều giàu có”; không đặt tuổi kích hoạt. Một cung trước trống có lời, một cung có lời được bổ sung.

- **1.54.0 / ND03:** biên tập dùng chung Công việc và Tài–Điền; phân nguồn thu/giữ tiền/thừa hưởng/tự tạo/duy trì nhà đất, đặt lời nền và điều chỉnh cạnh nhau, giữ lời khác chiều. Không thêm claim hoặc đổi evaluator; bản mới lưu riêng. [Toàn văn trước/sau](../.local/nd03-20261020/ban-giao.md).

- **1.56.0 / ND12/13:** thêm16nhánh Tử–Phu đủ căn cứ, giữ điều kiện thời gian; xem mục5 và [đặc tả](PHU-TU-1.33.0.md).

- **1.55.0 / ND04:**33 câu của cặp chính tinh xung chiếu được nêu riêng cho Phụ/Huynh, không phụ thuộc địa chi/trạng thái. Chỉ dùng lời cung nhận; giữ TT chưa giải và giới hạn Phúc–Huynh. [Đặc tả nguồn](PHU-HUYNH-1.32.0.md).

## 3. Độ phủ thực tế: bộ 192, không phải mọi lá số

Theo [đối chiếu192 Tử–Phu với1.55.1](../.local/kin-batch-20261021/impact192.json), số cung **chưa có đoạn luận**:

- Mệnh **0**; Phụ Mẫu **54**; Phúc Đức **43**; Điền Trạch **59**.
- Quan Lộc **28**; Nô Bộc **71**; Thiên Di **14**; Tật Ách **192**.
- Tài Bạch **21**; Tử Nữ **93**; Phu Thê **51**; Huynh Đệ **44**.

ND04:38 snapshot có43 claim mới; Phụ16 cung mới có lời/2 bổ sung, Huynh20 mới/5 bổ sung. Các cung khác giữ nguyên;192/192 vẫn có ít nhất một cung thiếu lời (Tật). Có một đoạn không chứng minh đầy đủ chủ đề.33 nhánh có fixture;15 có mẫu engine trong192 hoặc tìm hữu hạn1.440 đầu vào ngoài bộ,18 chưa chứng minh khả đạt.14 đầu vào ngoài bộ chứng kiến15 nhánh, không đếm trùng snapshot. ND03 trước đó chỉ biên tập, không giảm cung trống.

## 4. Khoảng thiếu và điểm dừng

- **ND03 Công việc / Tài–Điền đã khép về trình bày**; chưa giải phép kết luận ròng khi lời khác chiều. **Có rule nhưng chờ quyết định quyền:** ND02 năm rule Mệnh–Thân, không phải thiếu code chuyên môn.
- **Chưa chốt điều kiện nguồn:** VCD phụ thuộc trạng thái/địa chi và nơi áp dụng ngoại lệ (tập con Phụ/Huynh không cần trạng thái đã có); M06 lượng từ/hội hợp; Phủ–sát tinh; ô ngũ hành; Tuần/Triệt và các cặp lời khác chiều. Câu hỏi, trang nguồn theo từng ND ở [BUSINESS_RULES](BUSINESS_RULES.md#4-các-câu-hỏi-chuyên-môn-thực-sự-đang-chặn).
- Lô21/10 đã giải tập con VCD Phụ/Huynh vốn bị chặn rộng bởi câu hỏi trạng thái. Các tập con chưa rõ vẫn ở ND04/11/14; không kết luận sách đã hết phương pháp. Không mở lại chín Di bị chặn khi chưa có bằng chứng mới.
- **Phạm vi:** số lượng/thứ bậc/âm phần đang bị loại do lựa chọn triển khai, chưa xác minh quyết định thương mại cuối của chủ dự án. Phân biệt với các cấm đã xác nhận tại [DECISIONS](DECISIONS.md).
- **Tật Ách:** chủ dự án đồng ý hướng chú giải truyền thống theo cấu trúc để thẩm định; **chưa duyệt hai mẫu, chưa publish, chưa hoàn thành luận cá nhân**. [Toàn văn hai mẫu](BUSINESS_RULES.md#5-toàn-văn-hai-mẫu-tật-ách-để-duyệt) giữ nguyên.
- **Kiểm thử ND03:**27/27 tại5file; G2 riêng6/6; typecheck/build cuối đạt. Expected cơ bản cũ đã được đối chiếu hợp đồng nguyên nhóm1.1 và khép; không phải toàngate xanh. [TESTING](TESTING.md#5-lỗi-mở-và-kết-quả-cũ-còn-giới-hạn).
- **Bảo toàn:**112file báo cáo/98ID khác nhau,31file phiên cũ giữ hash; quyền/binding/link cũ và34bài công khai giữ nguyên.4bản/4đơn mock QA mới qua2lượt, chỉ2cấu trúc engine. [File](../.local/nd03-20261020/file-preservation.json), [DB](../.local/nd03-20261020/db-after.json), [UI](../.local/nd03-20261020/public-acceptance.json).

## 5. Task vừa hoàn tất — Tử Nữ/Phu Thê

1.56.0/catalog1.53.0 thêm16nhánh (14tọa thủ +2TửVCD); dùng evaluator/renderer chung. Tử97→93trống (4mới/5bổ sung), Phu67→51 (16mới/12bổ sung),37snapshot đổi; mười cung khác, mọi lời/facts/relations cũ và G2 giữ nguyên. [Bảng nguồn và phần còn chặn](PHU-TU-1.33.0.md), [bàn giao](../.local/kin-batch-20261021/ban-giao.md). 13/16nhánh có engine trong192;2đầu vào ngoài bộ có chủ đích chứng kiến thêm Vũ/Phu nữ. Còn Nhật–Lương Dậu/Phu và Liêm–Phá/TửVCD chỉ fixture, không tính là engine thật.

436/436 test nội dung tại5file, G2 riêng6/6, PDF mock6/6; typecheck/build cuối đạt. Ba cấu trúc qua form khách trên DB/kho cách ly: full grant bằng đơn **mock**, reload nguyên văn, mobile360/390, căn cứ, chéo đọc/PDF404; PDF thật8trang/17đoạn đã kiểm. QA3062 sau tích hợp tạo3bản mới đúng phiên bản, miễn phí không lộ lời khóa/PDF403. Không tạo đơn mock vào QA chính.122file báo cáo/39file phiên/14filecode và các dòng quyền/link/binding cũ giữ hash;34bài Toàn thư giữ nguyên. Live tắt, Tật chưa publish.

Lỗi đầu đã ghi: assertion Tử áp nhầm nhánh Phu do chuỗi ID; sandbox chặn DB localhost; thiếu1.56 trong danh sách phân trang gây mục lục trống; thiếu ánh xạ căn cứ mới; công cụ hệ thống thiếu pdftotext/pypdf (đã dùng runtime đi kèm). Không sửa expected lịch sử, không chạy toàngate. Giữ nhóm nếu/mới, TT/lượng từ, VCD chưa rõ và phạm vi loại trừ; câu hỏi/phương án ở nguồn và ND04/12/13/19. Dừng sau lô này.

Khép bàn giao1.56 bằng tài liệu: không còn nhóm Tử–Phu đủ đặc tả trong phạm vi hiện hành chưa triển khai. Năm nhóm câu hỏi, phương án và người cần quyết định đã ghi trực tiếp trong [đặc tả](PHU-TU-1.33.0.md); phần chuyên môn do người thẩm định, phạm viND19 do chủ dự án. Đây không phải xác nhận khai thác hết sách hoặc phê duyệt phương án mới. Không sửa ứng dụng/chạy test/build trong bước khép này.

Đã chuẩn bị [bốn mẫu toàn văn để duyệt](PHU-TU-1.33.0.md#gói-bốn-mẫu-để-duyệt--chưa-triển-khai-hoặc-publish): hai mẫu quan hệ giữ điều kiện chậm/muộn và hai mẫu xin mở riêng đặc tính thông minh/khéo tay của con. Chưa duyệt, chưa code/publish; không tính lấp cung trống hoặc hoàn chỉnh cung.

## Baseline Git — 21/10/2026

Đã chuẩn bị quản lý mã/tài liệu cục bộ theo [GIT-BASELINE](GIT-BASELINE.md). Đã có baseline commit `0c5461a1d6fe2bbba9522e99dbeebd8fab67eb98` trên branch `main`, từ597 file đã rà; cập nhật bàn giao bằng commit tài liệu riêng. Không có remote/push. Gói Git không xác minh lại hoặc thay runtime1.54.0/catalog1.51.0, không restart QA/test/build/migration.
