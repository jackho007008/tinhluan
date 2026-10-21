// Public synthetic birth inputs only. Never reads orders, reports or credentials.
import { readFileSync, writeFileSync } from "node:fs";
import { collectCoverage } from "../lib/internal-review/coverage";
const before = JSON.parse(
  readFileSync("docs/evidence/overview-before-1.4.json", "utf8"),
);
const after = await collectCoverage();
const comparison = after.readings.map((r) => {
  const old = before.readings.find((x: { id: string }) => x.id === r.id);
  if (!old || JSON.stringify(old.input) !== JSON.stringify(r.input))
    throw new Error("Before/after inputs differ");
  return {
    id: r.id,
    input: r.input,
    profile: r.profile,
    engine: r.engine,
    before: {
      rules: before.ruleVersion,
      main: old.main,
      details: old.details,
      unsupported: old.unsupported,
    },
    after: {
      rules: after.ruleVersion,
      main: r.main,
      details: r.details,
      facts: r.supportingFacts,
      gaps: r.scopeGaps,
      unsupported: r.unsupported,
      excluded: r.excluded,
    },
  };
});
writeFileSync(
  "docs/evidence/overview-before-after.json",
  JSON.stringify(comparison, null, 2),
);
const lines = comparison
  .map((r) =>
    [
      `## ${r.id}`,
      `Đầu vào demo ${r.input.date} ${r.input.hour}:00; ${r.profile}. Không sửa kết quả engine.`,
      `Trước (${r.before.rules}): ${r.before.main.map((n: { id: string }) => n.id).join(", ") || "Không có"}. Mở rộng: ${r.before.details.map((n: { id: string }) => n.id).join(", ") || "không"}.`,
      `Sau (${r.after.rules}): ${r.after.main.map((n) => n.id).join(", ") || "Không có"}. Mở rộng: ${r.after.details.map((n) => n.id).join(", ") || "không"}.`,
      ...r.after.gaps,
      `Chưa có chú giải: ${r.after.unsupported.join(", ") || "không có khoảng trống tên sao trong mẫu này; vẫn chưa luận toàn lá số"}.`,
      "Các rule phối hợp không xuất:",
      ...r.after.excluded
        .filter((t) => t.ruleId.startsWith("combination."))
        .map((t) => `- ${t.ruleId}: ${t.status}; ${t.details.join("; ")}`),
    ].join("\n\n"),
  )
  .join("\n\n");
writeFileSync(
  "docs/OVERVIEW-BEFORE-AFTER.md",
  `# Sáu cấu hình trước/sau\n\nBản nháp nội bộ. Nội dung đầy đủ và căn cứ: [COVERAGE-READINGS.md](COVERAGE-READINGS.md). Các claim trước/sau nguyên văn và mọi lý do loại rule: [JSON đối chiếu](evidence/overview-before-after.json). Cùng đầu vào; không có xác nhận chuyên môn độc lập.\n\n${lines}\n`,
);
console.log(
  `Generated ${comparison.length} before/after readings with identical inputs.`,
);
