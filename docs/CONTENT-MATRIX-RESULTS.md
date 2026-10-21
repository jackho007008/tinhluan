# Kết quả kiểm thử bộ mẫu nội dung — 07/10/2026

## Thay đổi

- `lib/internal-review/samples.ts`: allow-list 43 mẫu có đầu vào giả lập và kỳ vọng chọn lọc theo đặc tả. 32 mẫu kỹ thuật, 11 mẫu tính nguyên bản từ engine. Nhóm kỹ thuật không giữ resultId engine cho dữ liệu đã sửa.
- `/internal?sample=…`: selector chia hai nhóm; đọc preview/căn cứ/trace hiện có. Tên dễ nhận diện, đầu vào và kỳ vọng mở trong details. Không tạo đơn, thanh toán, email hoặc job. Nhánh mẫu không đọc dữ liệu đơn hàng, mẫu không tồn tại không fallback sang đơn khách.
- Giữ riêng profile CN/VN, không thay engine/quy ước hoặc catalog. Không viết lại báo cáo đã giao.

## Kỳ vọng và bằng chứng

`tests/content-matrix.test.ts` có 44 ca: 43 mẫu và vòng A → B → A/ID không tồn tại. Kỳ vọng kiểm rule cụ thể có claim hay bị condition-false/missing-facts/exception; kiểm không xuất draft cho customer, không sửa report object và giữ profile. Không dùng whole-output snapshot làm expected.

Lệnh hồi quy đã chạy:

```
npx vitest run tests/content-matrix.test.ts tests/combination.test.ts tests/preview-rules.test.ts tests/interpretation.test.ts tests/reading.test.ts tests/core.test.ts tests/vietnamese-engine.test.ts
npm run typecheck
npm run build
npx playwright test tests/e2e/content-samples.spec.ts
```

- Vitest: **192/192 đạt**, 7 files, 8.53s. Log: `evidence/content-matrix-regression.txt`.
- Typecheck: đạt. Build: đạt, log `evidence/content-matrix-build.txt`.
- E2E: ca mới kiểm xác thực, A → B → A, missing khác empty, mở căn cứ, 360px/390px, ID không tồn tại. So sánh số đơn, giao dịch và hash toàn bộ report JSON trước/sau trong bộ nhớ; không log dữ liệu khách. Không tạo đơn thử. Log: `evidence/content-matrix-e2e.txt`.
- Đã xem ảnh mobile mẫu kỹ thuật. Không thay theme hoặc bố cục trang khách.

## Vấn đề tìm thấy và xử lý

- Trước thay đổi, muốn thử mẫu qua UI phải chọn báo cáo đã gắn với đơn. Đã bổ sung nhánh mẫu riêng, không đi qua payment/worker.
- E2E đầu đo chiều rộng ngay lúc điều hướng, thất bại ở trạng thái chưa ổn định. Đã đổi assertion sang chờ chiều rộng ổn định; chạy lại đạt. Không che tràn ngang bằng CSS và không bỏ kiểm tra.
- Typecheck trong lúc triển khai phát hiện kiểu report suy luận bắt buộc interpretation, trong khi fixture thiếu dữ liệu cần bỏ phần đã tạo từ base. Đã dùng ReportData với trường optional đúng hợp đồng; không lưu report này.
- Không phát hiện lỗi điều kiện/ngoại lệ mới của evaluator trong ma trận. Không coi điều đó là xác nhận chuyên môn.

## Phần còn thiếu

Thiên Đồng/Thiên Lương được bao phủ đúng/sai cung bằng fixture kỹ thuật, chưa có input engine riêng trong selector. Chưa vét cạn mọi cấu hình, năm hoặc tổ hợp, không xác nhận độc lập an sao. Test database/payment khác không chạy lại trong đợt này vì không sửa các module đó. Engine samples không phải independent goldens. Draft vẫn nội bộ; không thêm scoring/AI hoặc trạng thái duyệt.
