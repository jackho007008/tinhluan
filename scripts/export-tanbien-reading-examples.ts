// Only fake-input engine samples and the existing DEMO export; no DB writes.
import { createHash, randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import saved from "../exports/demo-wuqu-tianfu-review.json";
import type { ChartSnapshot } from "../lib/tuvi-engine";
import { loadSample } from "../lib/internal-review/samples";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { RULESET_VERSION } from "../lib/interpretation-rules/catalog";
const entries = [
  {
    id: "demo-wuqu-tianfu",
    kind: "Snapshot DEMO đã lưu; không tính lại",
    snapshot: saved.snapshot as unknown as ChartSnapshot,
  },
];
for (const id of [
  "vn-12",
  "vn-20",
  "vn-2",
  "vn-4",
  "vn-6",
  "vn-lianzhen",
  "vn-tanlang",
  "vn-jumen",
  "vn-0",
  "vn-16",
  "vn-taiyang",
  "vn-tiantong",
  "vn-tianliang",
  "vn-qisha",
  "vn-pojun",
  "engine-combo",
  "engine-exception",
  "vn-co-cu-loc",
]) {
  const s = await loadSample(id);
  if (!s || s.sample.kind !== "engine") throw Error("ENGINE_SAMPLE_REQUIRED");
  entries.push({
    id,
    kind: "Engine tính từ thông tin sinh giả lập có sẵn; không sửa sao",
    snapshot: s.report.snapshot,
  });
}
const runId = randomUUID();
const generatedAt = new Date().toISOString();
const rows = entries.map(({ id, kind, snapshot }) => ({
  id,
  runId,
  generatedAt,
  kind,
  profile: snapshot.profile.id,
  engine: snapshot.versions,
  catalog: RULESET_VERSION,
  ...buildTanBienReading(snapshot),
}));
const json = JSON.stringify(rows, null, 2) + "\n";
writeFileSync("exports/tanbien-reading-examples.json", json);
const jsonHash = createHash("sha256").update(json).digest("hex");
const md = [
  `# Các bản Tổng quan — template ${rows[0].templateVersion}\n`,
  `Lần xuất: ${runId}; thời điểm ${generatedAt}. [JSON cùng lần xuất](./tanbien-reading-examples.json), SHA-256: ${jsonHash}.\n`,
  "Dữ liệu DEMO / đầu vào giả lập. Đây là kiểm thử phần mềm và trải nghiệm nội dung, không xác nhận chuyên môn của engine. Bản trước đợt này: [template 1.7.0](./tanbien-reading-v1.7-archive/examples.md). [template 1.6.0](./tanbien-reading-v1.6-archive/examples.md). [template 1.5.0](./tanbien-reading-v1.5-archive/examples.md). [template 1.4.0](./tanbien-reading-v1.4-archive/examples.md). [template 1.3.0](./tanbien-reading-v1.3-archive/examples.md). [template 1.2.0](./tanbien-reading-v1.2-archive/examples.md). Bản cũ: [template 1.0.0](./tanbien-reading-v1/examples.md), [template 1.1.0](./tanbien-reading-v1.1/examples.md).\n",
  "| Mẫu | Dữ kiện nền | Rule khớp / đoạn xuất | Ngữ cảnh có trong dữ liệu | Phần chưa hỗ trợ |",
  "|---|---|---|---|---|",
];
for (const r of rows)
  md.push(
    `| ${r.id} | ${r.background.map((f) => f.text).join(" ")} | ${
      r.execution.traces
        .filter((t) => t.status === "matched")
        .map((t) => t.ruleId)
        .join(", ") || "Không có"
    } / ${r.sections.flatMap((s) => s.claims).length} đoạn | ${[...new Set(r.sections.flatMap((s) => s.context?.items.filter((i) => i.kind === "snapshot").map((i) => i.text) || []))].join(" ") || "Chưa có claim để chọn ngữ cảnh"} | ${r.unsupported.join("; ") || "Chưa tổng hợp tác động toàn lá số"} |`,
  );
for (const r of rows) {
  md.push(
    `\n## ${r.id}\n`,
    r.kind + "\n",
    r.introduction.text + "\n",
    r.openingFacts.map((f) => f.text).join(" ") + "\n",
    `Bản đọc thử nội bộ — dự thảo, chưa phê duyệt chuyên môn. Profile ${r.profile}, engine ${r.engine.engine}, catalog ${r.catalog}, template ${r.templateVersion}.\n`,
  );
  if (r.lifeMajorNotice) md.push(r.lifeMajorNotice + ".\n");
  if (r.scopeMessage) md.push(r.scopeMessage + "\n");
  md.push("### Dữ kiện nổi bật\n", ...r.background.map((f) => `- ${f.text}`));
  for (const section of r.sections.filter((s) => s.claims.length)) {
    md.push(`\n### ${section.title}\n`);
    for (const {
      claim,
      display,
      evidence,
      nearbyNotes,
    } of section.paragraphs) {
      md.push(
        `**${evidence[0]?.contentLabel} · dự thảo**\n`,
        display.text + "\n",
        ...nearbyNotes.map((n) => n.text + "\n"),
        ...(display.contextLink
          ? [`${r.contextLinkText} — ${section.title}.\n`]
          : []),
        "<details><summary>Xem căn cứ</summary>\n",
      );
      if (display.changes.length)
        md.push(
          "**Ghi chú biên tập (không phải nhận định mới)**\n",
          ...display.changes,
          "Nguyên văn claim: " + claim.text + "\n",
        );
      for (const e of evidence)
        md.push(
          "**Yếu tố thực tế**\n",
          ...e.facts.map(
            (f) =>
              `- ${f.kind === "source" ? "Đối chiếu bảng nguồn: " : ""}${f.text}`,
          ),
          ...(e.contextNotes.length
            ? [
                "\n**Ngữ cảnh và phạm vi chưa tổng hợp**\n",
                ...e.contextNotes.map((n) => `- ${n.text}`),
              ]
            : []),
          "\n**Điều kiện do nguồn nêu**\n",
          ...e.sourceConditions.map((c) => `- ${c}`),
          "\n**Phạm vi dự án chủ động chọn**\n",
          ...e.projectScope.map((c) => `- ${c}`),
          "\n**Điều kiện thực thi đã kiểm tra**\n",
          ...e.conditions.map((c) => `- ${c}`),
          "\n**Nguồn và giới hạn**\n",
          ...e.sources.map(
            (s) =>
              `- ${s.title} — ${s.location.replace(/[.\s]+$/, "")}. ${s.rightsNote}`,
          ),
          ...e.limits.map((l) => `- ${l}`),
        );
      md.push(
        `\n<details><summary>Chi tiết kỹ thuật</summary>\n\nSnapshot: ${r.snapshotId}; claim: ${claim.id}; rule: ${claim.rules.map((x) => `${x.id}@${x.version}`).join(", ")}. Đầy đủ fact, toán tử, đường dẫn và trace nằm trong [tanbien-reading-examples.json](./tanbien-reading-examples.json), cùng mã lần xuất ${runId}.\n\n</details>\n\n</details>\n`,
      );
    }
  }
  md.push("\n### Những yếu tố cần xét thêm\n", r.contextPolicy + "\n");
  md.push(...r.unassessed.map((n) => "- " + n.text));
  for (const context of r.contexts) {
    md.push(
      `<details><summary>Ngữ cảnh — ${context.titles.join("; ")}</summary>\n`,
      ...context.data.items.map(
        (i) =>
          `- ${i.kind === "geometry" ? "Quan hệ vị trí: " : "Dữ kiện: "}${i.text}`,
      ),
      "\nẢnh hưởng chưa được tổng hợp: " + context.data.unresolved + "\n",
      "</details>\n",
    );
  }
  if (r.unsupported.length)
    md.push(`Chưa có nội dung được hỗ trợ cho: ${r.unsupported.join("; ")}.\n`);
  md.push(
    "<details><summary>Chi tiết kỹ thuật — các rule không xuất</summary>\n",
    ...r.execution.traces
      .filter((t) => t.status !== "matched")
      .map((t) => `- ${t.ruleId}: ${t.status}; ${t.details.join("; ")}`),
    "\nKhông dùng not-matched/unknown để suy ra nhận định ngược.\n</details>\n",
  );
}
writeFileSync("exports/tanbien-reading-examples.md", md.join("\n") + "\n");
console.log("Exported DEMO/engine examples; no DB writes or access secrets.");

const short = [
  `# Bản duyệt văn — template ${rows[0].templateVersion}`,
  `Lần xuất ${runId}; ${generatedAt}. [JSON cùng lần xuất](./tanbien-reading-examples.json).`,
  "Bản đọc thử nội bộ · dự thảo theo phương pháp truyền thống, chưa được chuyên gia duyệt. Không phải luận giải đầy đủ.",
];
for (const r of rows) {
  short.push(
    `\n## ${r.id}`,
    r.scopeMessage || "",
    r.lifeMajorNotice ? r.lifeMajorNotice + "." : "",
    r.introduction.text,
    r.openingFacts.map((f) => f.text).join(" "),
  );
  for (const section of r.sections.filter((s) => s.claims.length)) {
    short.push(`\n### ${section.title}`);
    for (const p of section.paragraphs)
      short.push(
        `**${p.evidence[0]?.contentLabel}**`,
        p.display.text,
        ...p.nearbyNotes.map((n) => n.text),
        ...(p.display.contextLink
          ? [`${r.contextLinkText} — ${section.title}.`]
          : []),
        `Căn cứ: ${p.claim.rules.map((x) => x.id).join(", ")}; ${p.evidence.flatMap((e) => e.sources.map((s) => s.location.replace(/[.\s]+$/, ""))).join("; ")}.`,
      );
  }
  if (r.unassessed.length)
    short.push(
      "### Những yếu tố chưa được xét",
      ...r.unassessed.map((n) => n.text),
      r.contextPolicy,
    );
  if (r.unsupported.length)
    short.push(`Chưa có nội dung cho: ${r.unsupported.join("; ")}.`);
  short.push(
    "Phạm vi hiện tại: các nhận định cục bộ; chưa tổng hợp toàn lá số.",
  );
}
writeFileSync(
  "exports/tanbien-reading-review.md",
  short
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n\n") + "\n",
);
