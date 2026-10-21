// Editorial review only, using the already exported run; no calculation or database access.
import { readFileSync, writeFileSync } from "node:fs";
const rows = JSON.parse(
  readFileSync("exports/tanbien-reading-examples.json", "utf8"),
);
const old = JSON.parse(
  readFileSync("exports/tanbien-reading-v1.7-archive/examples.json", "utf8"),
);
const ids = ["demo-wuqu-tianfu", "vn-0", "vn-co-cu-loc", "vn-jumen", "vn-16"];
const chosen = ids.map((id) => rows.find((r: any) => r.id === id));
const common = `Lần xuất ${rows[0].runId}; template ${rows[0].templateVersion}. [JSON cùng lần xuất](./tanbien-reading-examples.json). Nội bộ, dự thảo, chưa kiểm duyệt chuyên môn; dữ liệu DEMO/engine giả lập.`;
const main = (r: any, previous = false) =>
  [
    r.introduction?.text ||
      "Bản đọc thử theo Tân Biên, chưa tổng hợp toàn lá số.",
    r.scopeMessage || "",
    r.lifeMajorNotice ? r.lifeMajorNotice + "." : "",
    (r.openingFacts || r.background).map((f: any) => f.text).join(" "),
    ...r.sections
      .filter((s: any) => s.claims.length)
      .flatMap((s: any) => [
        `### ${s.title}`,
        ...s.paragraphs.flatMap((p: any) => [
          `**${p.evidence[0].contentLabel}**`,
          p.display?.text || p.claim.text,
          ...p.nearbyNotes.map((n: any) => n.text),
          ...(p.display?.contextLink ? [r.contextLinkText] : []),
          `Căn cứ: ${p.claim.rules.map((x: any) => x.id).join(", ")}.`,
        ]),
      ]),
    ...(r.unassessed?.length
      ? [
          "### Những yếu tố chưa được xét",
          ...r.unassessed.map((n: any) => n.text),
          r.contextPolicy || "Đây không phải danh sách đầy đủ.",
        ]
      : []),
    `Phạm vi chưa hỗ trợ: ${r.unsupported.join("; ") || "chưa tổng hợp toàn lá số"}. Phần thiếu không phải đặc điểm cá nhân.`,
  ]
    .filter(Boolean)
    .join("\n\n");
writeFileSync(
  "exports/tanbien-five-reading-review.md",
  [
    "# Năm bản đọc để đánh giá toàn bài",
    common,
    ...chosen.flatMap((r) => [`## ${r.id}`, main(r)]),
  ].join("\n\n") + "\n",
);
const diff = [
  "# Đối chiếu biên tập 1.7.0 → 1.8.0",
  common,
  "Các rule cũ giữ nguyên; vn-16 có thêm R21 theo nguồn tr.69. Câu biên tập chỉ tổ chức bài; ngữ cảnh không phải nhận định mới.",
];
const feedback = [
  "# Phiếu ghi nhận nội bộ — chưa có câu trả lời",
  common,
  "Luồng phản hồi hiện có yêu cầu grant/report beta bất biến và cờ beta. Không tái sử dụng cho preview động khi beta tắt; không tạo endpoint hoặc bảng dữ liệu mới. Chủ dự án có thể ghi vào phiếu này. Không ghi tên thật hoặc khóa truy cập. Các ô để trống không phải dữ liệu người thử.",
];
for (const r of chosen) {
  const before = old.find((x: any) => x.id === r.id);
  diff.push(
    `## ${r.id} — cùng snapshot ${r.snapshotId}`,
    "### Trước",
    readFileSync("exports/tanbien-reading-v1.7-archive/tanbien-five-reading-review.md", "utf8").split(`## ${r.id}\n`)[1].split("\n## ")[0].trim(),
    "### Sau",
    main(r),
    "### Ánh xạ từng câu diễn giải",
    "| Câu sau biên tập | Claim | Rule và nguồn | Thay đổi |",
    "|---|---|---|---|",
  );
  feedback.push(
    `## ${r.id}`,
    `Snapshot ${r.snapshotId}; engine ${r.engine.engine}; catalog ${r.catalog}; template ${r.templateVersion}.`,
  );
  for (const s of r.sections)
    for (const p of s.paragraphs) {
      const esc = (x: string) => x.replace(/\|/g, "/").replace(/\n/g, " ");
      diff.push(
        `| ${esc(p.display.text)} | ${p.claim.id} | ${p.claim.rules.map((x: any) => x.id + "@" + x.version).join(", ")}; ${esc(p.evidence.flatMap((e: any) => e.sources.map((s: any) => s.location)).join("; "))} | ${esc(p.display.changes.join("; ") || "Giữ nguyên câu claim")} |`,
      );
      feedback.push(
        `### ${s.title} — ${p.claim.rules.map((x: any) => x.id).join(", ")}`,
        `Claim: ${p.claim.id}`,
        `Đoạn: ${p.display.text}`,
        "- Khó hiểu ở chỗ nào:",
        "- Có vẻ lặp với đoạn nào:",
        "- Câu nào nghe như khẳng định chắc chắn:",
        "- Muốn hiểu thêm điều gì:",
      );
    }
  diff.push(
    "Ghi chú chuyển lớp: dữ kiện ngữ cảnh chưa tổng hợp gom cuối bài; vẫn giữ căn cứ từng claim. Riêng R20 rút câu giới hạn ở bài chính, giữ giải thích không hòa giải với chú giải riêng trong căn cứ. Không đổi điều kiện hoặc kết luận.",
  );
  feedback.push(
    "### Toàn bài",
    "- Người đọc hiểu được điều gì:",
    "- Mục còn quá ít nội dung:",
    "- Có tìm được căn cứ không:",
    "- Mong muốn được giải thích thêm:",
  );
}
writeFileSync(
  "exports/tanbien-five-reading-comparison.md",
  diff.join("\n\n") + "\n",
);
writeFileSync(
  "exports/tanbien-five-reading-feedback.md",
  feedback.join("\n\n") + "\n",
);
console.log(
  "Exported five readings, same-snapshot comparison, claim/source mapping and blank feedback worksheet. No feedback collected.",
);
