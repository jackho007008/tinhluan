// Owner-authorized private reading fork; exports below contain only DEMO/fake-input samples.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { freezeReading } from "../lib/internal-review/dynamic-reading";
import { saveReading, getReading } from "../lib/internal-review/reading-store";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const root = "exports/tanbien-career-1.10.0",
  privateRoot = ".local/tanbien-career";
mkdirSync(root, { recursive: true });
const old = JSON.parse(
  readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
);
const found = JSON.parse(
  readFileSync(privateRoot + "/engine-co-luong.json", "utf8"),
);
const work = (r: any) => ({
  template: r.templateVersion,
  snapshotId: r.snapshotId,
  facts: r.workFacts || [],
  notice: r.workStatusNote || null,
  section: r.sections.find((s: any) => s.id === "work"),
  traces: r.execution.traces.filter((t: any) =>
    ["tanbien.r05", "tanbien.r22"].includes(t.ruleId),
  ),
});
const rows: any[] = [];
for (const id of ["demo-wuqu-tianfu", "vn-16", "vn-jumen"]) {
  const before = old.rows.find((r: any) => r.id === id);
  rows.push({
    id,
    kind: before.kind,
    snapshot: before.snapshot,
    before: work(before),
    after: work(buildTanBienReading(before.snapshot)),
  });
}
rows.push({
  id: "engine-career-co-luong",
  kind: found.kind,
  search: found.search,
  snapshot: found.snapshot,
  before: work(found.before.reading),
  after: work(buildTanBienReading(found.snapshot)),
});
const missing = structuredClone(found.snapshot) as ChartSnapshot;
delete (missing.chart.palaces.find((p) => p.name === "Quan Lộc") as any)
  .majorStars;
rows.push({
  id: "technical-missing-career",
  kind: "Fixture kỹ thuật sửa dữ kiện; KHÔNG phải lá số engine hợp lệ",
  after: work(buildTanBienReading(missing)),
});
const runId = randomUUID(),
  generatedAt = new Date().toISOString();
const text = (w: any) =>
  w.section.paragraphs.map((p: any) => p.display.text).join("\n\n") ||
  "Chưa có nội dung Công việc được hỗ trợ cho mẫu này.";
const json =
  JSON.stringify(
    {
      runId,
      generatedAt,
      template: "1.10.0",
      catalog: "interpretation-1.13.0",
      rows,
    },
    null,
    2,
  ) + "\n";
writeFileSync(root + "/readings.json", json);
const md = [
  `# Công việc — template 1.10.0`,
  `Lần xuất ${runId}. [JSON cùng lần xuất](./readings.json), SHA-256 ${createHash("sha256").update(json).digest("hex")}.`,
  `Dự thảo nội bộ, chưa được chuyên gia duyệt. DEMO và mẫu engine dùng đầu vào giả lập; fixture thiếu dữ kiện chỉ kiểm thử phần mềm. Không có dữ liệu sinh thật trong file này.`,
];
for (const r of rows) {
  md.push(
    `\n## ${r.id}`,
    r.kind,
    `Snapshot: ${r.after.snapshotId}`,
    "\n### Trước",
    r.before
      ? text(r.before)
      : "Không có bản trước: fixture thiếu dữ kiện được tạo cho ca kiểm thử.",
    "\n### Sau",
    ...r.after.facts.map((f: any) => f.text),
    text(r.after),
  );
  if (r.after.notice) md.push(r.after.notice);
  for (const p of r.after.section.paragraphs) {
    md.push(
      ...p.nearbyNotes.map((n: any) => n.text),
      `\n<details><summary>Xem căn cứ — ${p.evidence[0].title}</summary>\n`,
      `Claim: ${p.claim.id}`,
    );
    for (const e of p.evidence)
      md.push(
        "Dữ kiện:",
        ...e.facts.filter((f: any) => ["snapshot", "geometry"].includes(f.kind)).map((f: any) => "- " + f.text),
        "Điều kiện nguồn:",
        ...e.sourceConditions.map((x: string) => "- " + x),
        "Phạm vi dự án:",
        ...e.projectScope.map((x: string) => "- " + x),
        ...e.facts.filter((f: any) => f.kind === "editorial").map((f: any) => "- " + f.text),
        "Nguồn:",
        ...e.sources.map((x: any) => "- " + x.title + " — " + x.location),
        "Giới hạn:",
        ...e.limits.map((x: string) => "- " + x),
      );
    md.push("</details>");
  }
  md.push(
    "\nTrạng thái: " +
      r.after.traces
        .map(
          (t: any) =>
            `${t.ruleId}@${t.version}: ${t.status}${t.status === "missing-facts" ? " (" + t.details.join(", ") + ")" : ""}`,
        )
        .join("; "),
  );
}
writeFileSync(root + "/readings.md", md.join("\n\n") + "\n");
// Freeze new content on the SAME saved snapshot. No recalculation, no DB, no overwrite.
const indexPath = privateRoot + "/readings-index.json";
const index: any = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, "utf8"))
  : {};
const oldId = JSON.parse(
  readFileSync(".local/tanbien-engine-audit/v2/new-reading.json", "utf8"),
).id;
const original = await getReading(oldId);
if (!original) throw Error("PRIVATE_SAVED_READING_MISSING");
const frozen = freezeReading(original.snapshot, original.receipt);
index.audit ||= randomUUID();
await saveReading({
  ...original,
  id: index.audit,
  parentId: oldId,
  createdAt: new Date().toISOString(),
  frozen,
});
index.sampleBefore ||= randomUUID();
index.sampleAfter ||= randomUUID();
await saveReading({
  id: index.sampleBefore,
  createdAt: new Date().toISOString(),
  snapshot: found.snapshot,
  receipt: found.receipt,
  frozen: found.before,
});
await saveReading({
  id: index.sampleAfter,
  parentId: index.sampleBefore,
  createdAt: new Date().toISOString(),
  snapshot: found.snapshot,
  receipt: found.receipt,
  frozen: freezeReading(found.snapshot, found.receipt),
});
writeFileSync(indexPath, JSON.stringify(index, null, 2), { mode: 0o600 });
writeFileSync(
  privateRoot + "/audit-work-before-after.json",
  JSON.stringify(
    {
      runId,
      snapshotId: original.snapshot.resultId,
      before: work(original.frozen.reading),
      after: work(frozen.reading),
      url: "/internal/readings?id=" + index.audit,
      parentUrl: "/internal/readings?id=" + oldId,
    },
    null,
    2,
  ),
  { mode: 0o600 },
);
writeFileSync(
  privateRoot + "/audit-work-before-after.md",
  [
    "# Công việc — hồ sơ riêng, không công khai",
    `Snapshot giữ nguyên: ${original.snapshot.resultId}`,
    "## Trước",
    text(work(original.frozen.reading)),
    "## Sau",
    ...frozen.reading.workFacts.map((f) => f.text),
    text(work(frozen.reading)),
    ...frozen.reading.sections
      .find((s) => s.id === "work")!
      .paragraphs.flatMap((p) => p.nearbyNotes.map((n) => n.text)),
    `Mở bản mới: /internal/readings?id=${index.audit}`,
    `Bản cũ: /internal/readings?id=${oldId}`,
  ].join("\n\n"),
  { mode: 0o600 },
);
console.log(
  "Exported versioned synthetic/DEMO readings; private audit and linked saved readings remain under .local.",
);
