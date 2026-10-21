/** Read-only snapshots; only creates new versioned artifacts and immutable internal reading forks. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { freezeReading } from "../lib/internal-review/dynamic-reading";
import { saveReading, getReading } from "../lib/internal-review/reading-store";
import { catalog, RULESET_VERSION } from "../lib/interpretation-rules/catalog";
const root = "exports/tanbien-career-1.11.0",
  local = ".local/tanbien-career-1.11.0";
mkdirSync(root, { recursive: true });
const pack = JSON.parse(readFileSync(local + "/before.json", "utf8"));
const rules = catalog.filter(
  (r) => r.id.startsWith("tanbien.") && r.presentation?.readingTheme === "work",
);
const work = (r: any) => ({
  template: r.templateVersion,
  snapshotId: r.snapshotId,
  facts: r.workFacts,
  notice: r.workStatusNote,
  section: r.sections.find((s: any) => s.id === "work"),
  traces: r.execution.traces.filter((t: any) =>
    rules.some((r) => r.id === t.ruleId),
  ),
});
const all = pack.rows.map((r: any) => ({
  ...r,
  after: buildTanBienReading(r.snapshot),
}));
const ids = new Set([
  "demo-wuqu-tianfu",
  "engine-career-co-luong",
  "vn-jumen",
  "vn-16",
  "vn-tiantong",
  "vn-qisha",
  "vn-20",
]);
const coverage = rules.map((rule) => {
  const hits = all.filter((r: any) =>
    r.after.execution.traces.some(
      (t: any) => t.ruleId === rule.id && t.status === "matched",
    ),
  );
  const engine = hits.find((r: any) => r.receipt) || hits[0];
  if (engine) ids.add(engine.id);
  return {
    id: rule.id,
    engineSamples: hits
      .filter((r: any) => r.kind !== "demo")
      .map((r: any) => r.id),
    selected: engine?.id || null,
    source: rule.sourceReferences,
    conditions: rule.conditions,
  };
});
const indexFile = local + "/reading-links.json",
  links = existsSync(indexFile)
    ? JSON.parse(readFileSync(indexFile, "utf8"))
    : {};
const selected = all.filter((r: any) => ids.has(r.id));
for (const r of selected) {
  if (r.receipt) {
    links[r.id] ||= randomUUID();
    await saveReading({
      id: links[r.id],
      createdAt: new Date().toISOString(),
      snapshot: r.snapshot,
      receipt: r.receipt,
      frozen: freezeReading(r.snapshot, r.receipt),
    });
    r.url = "/internal/readings?id=" + links[r.id];
  } else
    r.url =
      "/internal/editorial/demo-wuqu-tianfu?view=reading&sample=" +
      encodeURIComponent(r.id);
}
const rows = selected.map((r: any) => ({
  id: r.id,
  kind: r.kind,
  snapshot: r.snapshot,
  baselineNote:
    r.baselineNote || "Bản trước đã tính và giữ trước khi thay catalog.",
  url: r.url,
  before: work(r.before),
  after: work(r.after),
}));
const sample = all.find((r: any) => r.id === "engine-career-co-luong");
const missing = structuredClone(sample.snapshot);
delete missing.chart.palaces.find((p: any) => p.name === "Quan Lộc").majorStars;
rows.push({
  id: "technical-missing-career",
  kind: "Fixture kỹ thuật, không phải lá số engine hợp lệ",
  snapshot: missing,
  before: null,
  after: work(buildTanBienReading(missing)),
  url: null,
});
const runId = randomUUID();
const data = {
  runId,
  generatedAt: new Date().toISOString(),
  template: "1.11.0",
  catalog: RULESET_VERSION,
  search: pack.search,
  extraSearch: pack.extraSearch,
  coverage,
  rows,
};
const json = JSON.stringify(data, null, 2) + "\n";
writeFileSync(root + "/readings.json", json);
const prose = (w: any) =>
  [
    ...(w.facts || []).map((x: any) => x.text),
    ...(w.section.paragraphs.length
      ? w.section.paragraphs.flatMap((p: any) => [
          ...(p.secondary
            ? ["<details><summary>Căn cứ bổ sung cùng chủ đề tổ chức</summary>"]
            : []),
          p.display.text,
          ...p.nearbyNotes.map((n: any) => n.text),
          `Nguồn: ${p.claim.rules.map((r: any) => r.id + " — " + r.sourceReferences.map((x: any) => x.location).join("; ")).join("; ")}`,
          ...(p.secondary ? ["</details>"] : []),
        ])
      : ["Chưa có nội dung Công việc được hỗ trợ cho mẫu này."]),
    ...(w.notice ? [w.notice] : []),
  ].join("\n\n");
const review = [
  `# Công việc — bản duyệt 1.11.0`,
  `Dự thảo nội bộ. Lần xuất ${runId}. [JSON cùng lần xuất](./readings.json), SHA-256 ${createHash("sha256").update(json).digest("hex")}. Mẫu sinh giả lập và DEMO; không phải kiểm chứng chuyên môn. Hồ sơ cá nhân lưu riêng, không nằm ở đây.`,
  `Chỉ nhận định cục bộ; chưa tổng hợp điều chỉnh sát tinh §8.14, toàn cung hoặc toàn lá số.`,
];
for (const r of rows)
  review.push(
    `## ${r.id}`,
    r.kind,
    r.url ? `[Mở nội bộ](${r.url})` : "Chỉ fixture kỹ thuật.",
    r.baselineNote || "",
    `### Trước`,
    r.before ? prose(r.before) : "Không có bản lịch sử.",
    `### Sau`,
    prose(r.after),
  );
writeFileSync(root + "/review.md", review.join("\n\n") + "\n");
const evidence = [
  `# Ánh xạ Công việc 1.11.0`,
  `Lần xuất ${runId}; [bài đọc](./review.md); [JSON](./readings.json).`,
];
for (const r of rows) {
  evidence.push(`## ${r.id}`, `Snapshot ${r.after.snapshotId}`);
  for (const p of r.after.section.paragraphs)
    evidence.push(
      `### ${p.claim.id}`,
      p.display.text,
      ...p.evidence.flatMap((e: any) => [
        "Dữ kiện:",
        ...e.facts.map(
          (f: any) => "- " + f.text + " [" + f.paths.join(", ") + "]",
        ),
        "Điều kiện sách:",
        ...e.sourceConditions.map((s: string) => "- " + s),
        "Phạm vi dự án:",
        ...e.projectScope.map((s: string) => "- " + s),
        "Nguồn:",
        ...e.sources.map((s: any) => "- " + s.title + "; " + s.location),
        "Giới hạn:",
        ...e.limits.map((s: string) => "- " + s),
      ]),
    );
  evidence.push(
    "Trạng thái rule: " +
      r.after.traces.map((t: any) => `${t.ruleId}: ${t.status}`).join("; "),
  );
}
writeFileSync(root + "/evidence.md", evidence.join("\n\n") + "\n");
const previous = JSON.parse(
  readFileSync(".local/tanbien-career/readings-index.json", "utf8"),
);
const original = await getReading(previous.audit);
if (!original) throw Error("PRIVATE_READING_MISSING");
links.audit ||= randomUUID();
const frozen = freezeReading(original.snapshot, original.receipt);
await saveReading({
  ...original,
  id: links.audit,
  parentId: original.id,
  createdAt: new Date().toISOString(),
  frozen,
});
writeFileSync(
  local + "/audit-before-after.json",
  JSON.stringify(
    {
      runId,
      snapshotId: original.snapshot.resultId,
      before: work(original.frozen.reading),
      after: work(frozen.reading),
      url: "/internal/readings?id=" + links.audit,
      parentUrl: "/internal/readings?id=" + original.id,
    },
    null,
    2,
  ),
  { mode: 0o600 },
);
writeFileSync(
  local + "/audit-before-after.md",
  [
    "# Công việc — hồ sơ riêng",
    "Snapshot bất biến: " + original.snapshot.resultId,
    "## Trước",
    prose(work(original.frozen.reading)),
    "## Sau",
    prose(work(frozen.reading)),
    "Mở /internal/readings?id=" + links.audit,
  ].join("\n\n"),
  { mode: 0o600 },
);
writeFileSync(indexFile, JSON.stringify(links, null, 2), { mode: 0o600 });
console.log(
  "Exported versioned work readings:",
  rows.length,
  "source rules:",
  rules.length,
  "uncovered:",
  coverage.filter((c) => !c.selected).length,
  "private fork saved without overwrite.",
);
