// Review artifact only. No DB access. Synthetic case is labelled and never sold as an engine chart.
import { readFileSync, writeFileSync } from "node:fs";
import { loadSample } from "../lib/internal-review/samples";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/tanbien";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const now = JSON.parse(
  readFileSync("exports/tanbien-reading-examples.json", "utf8"),
);
const old = JSON.parse(
  readFileSync("exports/tanbien-reading-v1.5-archive/examples.json", "utf8"),
);
const r20 = tanBienRules.find((r) => r.id === "tanbien.r20")!;
const cases = [];
for (const id of ["vn-co-cu-loc", "vn-jumen", "vn-0"]) {
  const s = (await loadSample(id))!.report.snapshot;
  cases.push({
    id,
    kind: "engine-generated-fictitious-input-not-independent-validation",
    snapshot: s,
  });
}
const missing = structuredClone(cases[0].snapshot);
delete (
  missing.chart.palaces.find((p) => p.name === "Mệnh") as Partial<
    ChartSnapshot["chart"]["palaces"][number]
  >
).minorStars;
missing.resultId = "synthetic:co-cu-missing-minor";
cases.push({
  id: "syn-co-cu-missing-minor",
  kind: "synthetic-technical-fixture-NOT-engine-valid-chart",
  snapshot: missing,
});
const payload = {
  runId: now[0].runId,
  generatedAt: now[0].generatedAt,
  templateVersion: now[0].templateVersion,
  rule: r20,
  cases: cases.map((c) => ({
    ...c,
    execution: executeRules(c.snapshot, [r20], "internal-draft"),
    reading: buildTanBienReading(c.snapshot),
  })),
};
writeFileSync(
  "exports/tanbien-co-cu-cases.json",
  JSON.stringify(payload, null, 2) + "\n",
);
const plain = (r: any) =>
  r.sections
    .flatMap((s: any) =>
      s.paragraphs.flatMap((p: any) => [
        `**${p.evidence[0].contentLabel}**`,
        p.claim.text,
        ...p.nearbyNotes.map((n: any) => n.text),
        `Căn cứ: ${p.claim.rules.map((r: any) => r.id).join(", ")}.`,
      ]),
    )
    .join("\n\n");
const sameOld = old.find((r: any) => r.id === "vn-jumen"),
  sameNew = now.find((r: any) => r.id === "vn-jumen");
const yes = now.find((r: any) => r.id === "vn-co-cu-loc");
const md = [
  `# Cơ–Cự: đối chiếu cùng snapshot và các ca thực thi\n\nLần xuất ${payload.runId}, ${payload.generatedAt}; template ${payload.templateVersion}. [JSON trường hợp](./tanbien-co-cu-cases.json); [bài đầy đủ cùng lần xuất](./tanbien-reading-examples.md); [JSON bài](./tanbien-reading-examples.json).`,
  "Chỉ đọc thử nội bộ, draft, review=null. Chưa kiểm duyệt chuyên môn. Các mẫu engine dùng thông tin giả lập; fixture kỹ thuật không phải lá số engine hợp lệ.",
  "## Cùng snapshot vn-jumen: trước và sau",
  `Snapshot: ${sameOld.snapshotId}. Trước1.5.0 / sau1.6.0 cùng mã. Không thêm R20 vì minorStars=[] không ghi Lộc Tồn tại Mệnh. Không đổi thành kết luận người đọc thận trọng.`,
  "### Trước",
  plain(sameOld),
  "### Sau",
  plain(sameNew),
  "## Mẫu engine bổ sung có điều kiện khớp",
  `vn-co-cu-loc — snapshot ${yes.snapshotId}. Cơ–Cự–Lộc Tồn đồng cung Mệnh tại Dậu. Không chỉnh sao.`,
  plain(yes),
  "## Câu mới → rule → điều kiện → nguồn",
  "| Câu | Phân loại | Rule / điều kiện / nguồn |",
  "|---|---|---|",
  `| ${r20.claimTemplate} | Nhận định truyền thống có điều kiện | ${r20.id}@${r20.version}: Cơ/Cự là chính tinh Mệnh, chi Mão/Dậu, phụ tinh chứa Lộc Tồn cùng cung. Tân Biên PDF89/trang in89 §4.2.10 Phú giải, mục Cự–Cơ gặp Lộc Tồn. Không có điều kiện brightness/can sinh ở đoạn chọn. |`,
  "| Đoạn phối hợp này chỉ nói về mức thận trọng trong lời nói theo nguồn truyền thống, chưa đủ để đánh giá cách giao tiếp của người đọc. Hai chú giải sao riêng ở trên có phạm vi khác; bản đọc không tự hòa giải chúng. | Ghi chú phạm vi biên tập, không phải claim về người đọc | Gắn R20; nhắc giới hạn áp dụng, không thêm nhận định. |",
  "## Ca thử",
  "| Mẫu | Loại | R20 | Lý do |",
  "|---|---|---|---|",
];
for (const c of payload.cases) {
  const trace = c.execution.traces[0];
  md.push(
    `| ${c.id} | ${c.kind} | ${trace.status === "condition-false" ? "not-matched" : trace.status === "missing-facts" ? "unknown" : trace.status} | ${c.id === "vn-co-cu-loc" ? "Đủ ba sao và đúng Mệnh Dậu" : c.id === "vn-jumen" ? "Cơ–Cự Dậu nhưng danh sách phụ tinh rỗng, không Lộc Tồn" : c.id === "vn-0" ? "Thiên Cơ–Thái Âm, không Cự Môn tại Mệnh" : "Chủ động bỏ minorStars từ bản clone để kiểm thử; không coi thiếu là rỗng"} |`,
  );
}
md.push(
  "## Giới hạn còn lại",
  "Không có luận Cơ–Cự tổng quát cho mọi trường hợp. Các nhánh can sinh, Âm nữ/không gặp Tuần–Triệt xung chiếu, Song Hao hội hợp và khác biệt Dần/Mão/Dậu chưa triển khai. R20 là nhánh Cơ–Cự–Lộc Tồn; phần nguồn mở rộng Cự–Lộc ở mọi vị trí cũng chưa triển khai. Hai chú giải nền không bị bỏ hoặc hòa giải tự động. [Hồ sơ nguồn/đặc tả](../docs/TANBIEN-RULE-READING.md).",
);
writeFileSync("exports/tanbien-co-cu-review.md", md.join("\n\n") + "\n");
console.log(
  "Exported source-linked before/after and labelled cases from same reading run. No DB writes.",
);
