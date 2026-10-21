import { collectCoverage } from "../lib/internal-review/coverage";
import { writeFileSync } from "node:fs";
const data = await collectCoverage();
writeFileSync(
  "docs/evidence/content-coverage.json",
  JSON.stringify(data, null, 2),
);
console.log(
  JSON.stringify(
    {
      summary: data.summary,
      uncovered: data.uncoveredRules,
      empty: data.rows.filter((r) => r.displayed === 0).map((r) => r.id),
      catalog: data.catalog.filter((c) => c.rules.length).length,
      readings: data.readings.map((r) => ({
        id: r.id,
        summary: r.summary,
        claims: r.main.map((n) => n.id),
      })),
    },
    null,
    2,
  ),
);
const lines = data.readings
  .map((r) =>
    [
      `## ${r.name} (${r.id})`,
      `Profile: ${r.profile}; engine: ${r.engine}. Đầu vào giả lập: ${r.input.date}, ${r.input.hour}:00, ${r.input.gender}, ${r.input.timezone}.`,
      r.summary,
      ...r.main.map((n) => n.text),
      ...(r.details.length
        ? [
            "Chú giải mở rộng (được giữ lại, không tính lần hai):",
            ...r.details.map((n) => n.text),
          ]
        : []),
      ...(r.unsupported.length
        ? [
            `Khoảng trống nội dung: ${r.unsupported.join(", ")}. Không phải đặc điểm của người dùng.`,
          ]
        : []),
      "### Căn cứ",
      ...[...r.main, ...r.details].map(
        (n) =>
          `- ${n.id} @ ${n.version}; claim ${n.claimId}. Dữ kiện: ${n.factor}. Điều kiện: ${n.condition}. Nguồn: ${n.sources.map((s) => `[${s.title}](${s.url}), ${s.location}`).join("; ")}. Giới hạn: ${n.missing}`,
      ),
      "### Yếu tố bổ sung",
      ...r.supportingFacts.map((f) => f.text),
      ...r.scopeGaps,
      r.synthesis,
      "### Nội dung không xuất và lý do",
      ...r.excluded.map(
        (t) =>
          `- ${t.ruleId} @ ${t.version}: ${t.status}; ${t.details.join("; ")}`,
      ),
    ].join("\n\n"),
  )
  .join("\n\n");
writeFileSync(
  "docs/COVERAGE-READINGS.md",
  `# Sáu bản Tổng quan — bản nháp nội bộ\n\n${data.readings[0].limit}\n\nCác bản đọc lấy từ preview/evaluator ${data.ruleVersion}, không tạo thêm luận điểm. Sáu cấu hình Mệnh khác nhau xét cả chính/phụ tinh và chi cung; hai mẫu Tử Vi–Phá Quân phân biệt bằng phụ tinh (mẫu có Đà La). Không đếm đơn hàng hay danh tính.\n\n${lines}\n`,
);
