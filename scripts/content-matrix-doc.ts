import { samples, SAMPLE_VERSION } from "../lib/internal-review/samples";
import { writeFileSync } from "node:fs";
const header = `# Ma trận kiểm thử nội dung — ${SAMPLE_VERSION}\n\n## Hai loại dữ liệu\n\n- **synthetic**: cấu hình kỹ thuật sửa vị trí có chủ đích để cô lập điều kiện evaluator. Không phải lá số hợp lệ về chuyên môn; resultId được thay bằng synthetic, không giữ nhận dạng engine cho dữ liệu đã sửa.\n- **engine**: đầu vào sinh giả lập công khai hợp lệ, chạy calculate → snapshot → report template → preview/evaluator. Không sửa sao. Chỉ kiểm tích hợp; không xác minh độ đúng của chính engine.\n\nTái sử dụng đầu vào từ overview-engine-examples và combination-engine-examples. Kỳ vọng chỉ định rule/claim cụ thể theo đặc tả, không snapshot toàn bộ output. Không thêm nguồn diễn giải hoặc trạng thái duyệt. Fixture không phải rule mới.\n\n## Cách thử\n\nMở /internal, đăng nhập bằng khóa đang cấu hình. Chọn **Chọn mẫu kiểm thử → Xem mẫu kiểm thử**. Hai nhóm engine và kỹ thuật tách trong danh sách. Mở **Đầu vào và kỳ vọng có chủ đích**, đọc preview, **Xem căn cứ**, rồi **Lần thực thi hiện tại** để đối chiếu claim/condition-false/missing-facts/exception. Đổi engine-combo → engine-partial → engine-combo để thử A → B → A. Liên kết Trở lại báo cáo đã lưu đưa về luồng chỉ đọc cũ.\n\nKhông gọi tạo đơn, webhook, worker hoặc email. Nhánh sample không truy vấn đơn; mẫu không tồn tại không fallback sang báo cáo khách. Mọi nhánh vẫn nằm sau xác thực nội bộ. Không cache output giữa mẫu, không cập nhật báo cáo đã giao.\n\n## Ma trận\n\n| Mẫu | Loại / profile | Rule và kỳ vọng | Lý do theo đặc tả |\n|---|---|---|---|\n`;
const rows = samples
  .map(
    (s) =>
      `| ${s.id} — ${s.name} | ${s.kind} / ${s.input.profile} | ${s.expected.map((e) => e.rule + ": " + e.outcome).join("<br>")} | ${s.expected.map((e) => e.why).join(" ")} |`,
  )
  .join("\n");
writeFileSync(
  "docs/CONTENT-MATRIX.md",
  header +
    rows +
    `\n\n## Giới hạn và các kiểm tra bổ sung\n\n43 mẫu: 32 tổng hợp và 11 từ engine. Cả 9 chính tinh có nội dung được thử đúng/sai cung bằng fixture kỹ thuật. Thiên Đồng/Thiên Lương chưa có ca engine riêng trong bộ chọn này; không sửa output engine để lấp khoảng trống. CN và VN giữ nguyên quy ước riêng; bộ này không yêu cầu hai profile có cùng lá số.\n\nCác ca ngoại lệ từng Kình Dương/Đà La/Hỏa Tinh/Linh Tinh, dữ liệu null/sai kiểu, xung đột rule, thiếu/sai profile và cấm rule tổng hợp phát hành được tái sử dụng từ combination.test.ts, preview-rules.test.ts và interpretation.test.ts. Không suy ra fixture tổng hợp là khả thi thiên văn.\n\nChạy: npx vitest run tests/content-matrix.test.ts; npx playwright test tests/e2e/content-samples.spec.ts (dev server và DB local). Lệnh sinh lại bảng: node --import tsx scripts/content-matrix-doc.ts. Không cần tạo đơn hoặc bật worker để thử mẫu.\n`,
);
console.log("Wrote public software sample matrix:", samples.length);
