# Ma trận kiểm thử nội dung — content-matrix-1.0.0

## Hai loại dữ liệu

- **synthetic**: cấu hình kỹ thuật sửa vị trí có chủ đích để cô lập điều kiện evaluator. Không phải lá số hợp lệ về chuyên môn; resultId được thay bằng synthetic, không giữ nhận dạng engine cho dữ liệu đã sửa.
- **engine**: đầu vào sinh giả lập công khai hợp lệ, chạy calculate → snapshot → report template → preview/evaluator. Không sửa sao. Chỉ kiểm tích hợp; không xác minh độ đúng của chính engine.

Tái sử dụng đầu vào từ overview-engine-examples và combination-engine-examples. Kỳ vọng chỉ định rule/claim cụ thể theo đặc tả, không snapshot toàn bộ output. Không thêm nguồn diễn giải hoặc trạng thái duyệt. Fixture không phải rule mới.

## Cách thử

Mở /internal, đăng nhập bằng khóa đang cấu hình. Chọn **Chọn mẫu kiểm thử → Xem mẫu kiểm thử**. Hai nhóm engine và kỹ thuật tách trong danh sách. Mở **Đầu vào và kỳ vọng có chủ đích**, đọc preview, **Xem căn cứ**, rồi **Lần thực thi hiện tại** để đối chiếu claim/condition-false/missing-facts/exception. Đổi engine-combo → engine-partial → engine-combo để thử A → B → A. Liên kết Trở lại báo cáo đã lưu đưa về luồng chỉ đọc cũ.

Không gọi tạo đơn, webhook, worker hoặc email. Nhánh sample không truy vấn đơn; mẫu không tồn tại không fallback sang báo cáo khách. Mọi nhánh vẫn nằm sau xác thực nội bộ. Không cache output giữa mẫu, không cập nhật báo cáo đã giao.

## Ma trận

| Mẫu | Loại / profile | Rule và kỳ vọng | Lý do theo đặc tả |
|---|---|---|---|
| syn-career-quan-0 — Kỹ thuật · Tử Vi Quan Lộc: Quyền | synthetic / vn-utc7-midnight-v1 | context.ziwei-quan: claim | Chỉ nhãn Tử Vi:Quyền tại Quan Lộc đáp ứng; thiếu nhãn khác chuỗi rỗng. |
| syn-career-quan-1 — Kỹ thuật · Tử Vi Quan Lộc: không ghi tứ hóa | synthetic / vn-utc7-midnight-v1 | context.ziwei-quan: condition-false | Chỉ nhãn Tử Vi:Quyền tại Quan Lộc đáp ứng; thiếu nhãn khác chuỗi rỗng. |
| syn-career-quan-2 — Kỹ thuật · Tử Vi Quan Lộc: thiếu tứ hóa | synthetic / vn-utc7-midnight-v1 | context.ziwei-quan: missing-facts | Chỉ nhãn Tử Vi:Quyền tại Quan Lộc đáp ứng; thiếu nhãn khác chuỗi rỗng. |
| syn-wuqu — Kỹ thuật · Vũ Khúc tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.wuqu: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-wuqu — Kỹ thuật · Vũ Khúc ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.wuqu: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-tianfu — Kỹ thuật · Thiên Phủ tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.tianfu: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-tianfu — Kỹ thuật · Thiên Phủ ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.tianfu: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-tong — Kỹ thuật · Thiên Đồng tại Mệnh | synthetic / vn-utc7-midnight-v1 | draft.overview.tong: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-tong — Kỹ thuật · Thiên Đồng ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | draft.overview.tong: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-ziwei — Kỹ thuật · Tử Vi tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.overview.ziwei: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-ziwei — Kỹ thuật · Tử Vi ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.overview.ziwei: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-tianji — Kỹ thuật · Thiên Cơ tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.overview.tianji: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-tianji — Kỹ thuật · Thiên Cơ ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.overview.tianji: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-taiyang — Kỹ thuật · Thái Dương tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.overview.taiyang: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-taiyang — Kỹ thuật · Thái Dương ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.overview.taiyang: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-taiyin — Kỹ thuật · Thái Âm tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.overview.taiyin: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-taiyin — Kỹ thuật · Thái Âm ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.overview.taiyin: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-tianxiang — Kỹ thuật · Thiên Tướng tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.overview.tianxiang: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-tianxiang — Kỹ thuật · Thiên Tướng ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.overview.tianxiang: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-tianliang — Kỹ thuật · Thiên Lương tại Mệnh | synthetic / vn-utc7-midnight-v1 | reading.overview.tianliang: claim | Chính tinh được chỉ định có tại Mệnh. |
| other-tianliang — Kỹ thuật · Thiên Lương ở Tài Bạch | synthetic / vn-utc7-midnight-v1 | reading.overview.tianliang: condition-false | Cùng sao ở cung khác không đáp ứng điều kiện Mệnh. |
| syn-empty — Kỹ thuật · Mệnh rỗng hợp lệ | synthetic / vn-utc7-midnight-v1 | reading.overview.empty: claim | Danh sách chính tinh rỗng hợp lệ. |
| syn-missing-major — Kỹ thuật · Thiếu danh sách chính tinh | synthetic / vn-utc7-midnight-v1 | reading.overview.empty: missing-facts<br>reading.wuqu: missing-facts | Thiếu trường không đồng nghĩa mảng rỗng. Không có danh sách sao để xét. |
| syn-body-career — Kỹ thuật · Thân cư Quan Lộc | synthetic / vn-utc7-midnight-v1 | reading.body-career: claim | Duy nhất Quan Lộc có cờ an Thân. |
| syn-body-other — Kỹ thuật · Thân cư Mệnh | synthetic / vn-utc7-midnight-v1 | reading.body-career: condition-false | Thân tại Mệnh, không tại Quan Lộc. |
| syn-wuqu-ji — Kỹ thuật · Vũ Khúc có Hóa Kỵ | synthetic / vn-utc7-midnight-v1 | reading.wuqu: claim<br>context.wuqu-ji: claim | Vũ Khúc ở Mệnh. Nhãn Vũ Khúc:Kỵ được ghi rõ. |
| syn-wuqu-none — Kỹ thuật · Vũ Khúc không ghi tứ hóa | synthetic / vn-utc7-midnight-v1 | context.wuqu-ji: condition-false | Nhãn tứ hóa là chuỗi rỗng, không phải Kỵ. |
| syn-missing-mutagen — Kỹ thuật · Thiếu nhãn tứ hóa | synthetic / vn-utc7-midnight-v1 | context.wuqu-ji: missing-facts | Thiếu nhãn tứ hóa, không được suy thành không có. |
| syn-combo — Kỹ thuật · Đủ bộ ba phối hợp | synthetic / vn-utc7-midnight-v1 | combination.ziwei-assistants: claim<br>reading.overview.ziwei: claim<br>combination.ziwei-assistants-qualified: condition-false | Đủ ba sao cùng Mệnh và danh sách phụ tinh hợp lệ. Chú giải đơn vẫn giữ trong phần mở rộng. Không ghi bốn sát tinh tại Mệnh. |
| syn-combo-partial — Kỹ thuật · Phối hợp thiếu Hữu Bật | synthetic / vn-utc7-midnight-v1 | combination.ziwei-assistants: condition-false | Thiếu Hữu Bật tại Mệnh. |
| syn-combo-exception — Kỹ thuật · Phối hợp có Đà La | synthetic / vn-utc7-midnight-v1 | combination.ziwei-assistants: exception<br>combination.ziwei-assistants-qualified: claim | Đà La kích hoạt cổng biên tập đã đặc tả. Giữ phối hợp cùng yếu tố điều chỉnh. |
| syn-missing-minor — Kỹ thuật · Thiếu danh sách phụ tinh | synthetic / vn-utc7-midnight-v1 | combination.ziwei-assistants: missing-facts | Không có danh sách phụ tinh để đánh giá. |
| vn-0 — Engine VN · Thiên Cơ và Thái Âm | engine / vn-utc7-midnight-v1 | reading.overview.tianji: claim | Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao. |
| vn-2 — Engine VN · Mệnh không chính tinh | engine / vn-utc7-midnight-v1 | reading.overview.empty: claim | Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao. |
| vn-4 — Engine VN · Tử Vi tại Mệnh | engine / vn-utc7-midnight-v1 | reading.overview.ziwei: claim | Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao. |
| vn-6 — Engine VN · Thiên Tướng | engine / vn-utc7-midnight-v1 | reading.overview.tianxiang: claim | Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao. |
| vn-12 — Engine VN · Tử Vi và Thiên Phủ | engine / vn-utc7-midnight-v1 | reading.tianfu: claim | Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao. |
| vn-16 — Engine VN · Thái Dương | engine / vn-utc7-midnight-v1 | reading.overview.taiyang: claim | Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao. |
| vn-20 — Engine VN · Vũ Khúc | engine / vn-utc7-midnight-v1 | reading.wuqu: claim | Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao. |
| engine-combo — Engine VN · phối hợp đủ điều kiện | engine / vn-utc7-midnight-v1 | combination.ziwei-assistants: claim<br>combination.ziwei-assistants-qualified: condition-false | Ba yếu tố đồng cung theo ca tích hợp đã chọn. Không ghi sát tinh tại Mệnh trong ca này. |
| engine-exception — Engine VN · phối hợp có Đà La | engine / vn-utc7-midnight-v1 | combination.ziwei-assistants: exception<br>combination.ziwei-assistants-qualified: claim | Đà La đồng cung chặn bản đọc riêng. Bản có điều kiện giữ yếu tố điều chỉnh. |
| engine-partial — Engine VN · Tử Vi thiếu phụ tá | engine / vn-utc7-midnight-v1 | combination.ziwei-assistants: condition-false | Tử Vi đơn không đủ bộ ba. |
| cn-reference — Engine CN · quy ước tham chiếu riêng | engine / cn-reference | reading.overview.ziwei: claim | Ca CN được chọn có Tử Vi tại Mệnh; chỉ kiểm tích hợp nội dung theo profile CN, không dùng làm expected cho VN. |

## Giới hạn và các kiểm tra bổ sung

43 mẫu: 32 tổng hợp và 11 từ engine. Cả 9 chính tinh có nội dung được thử đúng/sai cung bằng fixture kỹ thuật. Thiên Đồng/Thiên Lương chưa có ca engine riêng trong bộ chọn này; không sửa output engine để lấp khoảng trống. CN và VN giữ nguyên quy ước riêng; bộ này không yêu cầu hai profile có cùng lá số.

Các ca ngoại lệ từng Kình Dương/Đà La/Hỏa Tinh/Linh Tinh, dữ liệu null/sai kiểu, xung đột rule, thiếu/sai profile và cấm rule tổng hợp phát hành được tái sử dụng từ combination.test.ts, preview-rules.test.ts và interpretation.test.ts. Không suy ra fixture tổng hợp là khả thi thiên văn.

Chạy: npx vitest run tests/content-matrix.test.ts; npx playwright test tests/e2e/content-samples.spec.ts (dev server và DB local). Lệnh sinh lại bảng: node --import tsx scripts/content-matrix-doc.ts. Không cần tạo đơn hoặc bật worker để thử mẫu.
