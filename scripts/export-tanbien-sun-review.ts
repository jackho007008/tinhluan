// Reads the same exported run. Does not calculate charts or touch any database.
import { readFileSync, writeFileSync } from "node:fs";
const rows = JSON.parse(
  readFileSync("exports/tanbien-reading-examples.json", "utf8"),
);
const old = JSON.parse(
  readFileSync("exports/tanbien-reading-v1.7-archive/examples.json", "utf8"),
);
const ids = ["vn-16", "vn-taiyang"];
const archivedReview = readFileSync("exports/tanbien-reading-v1.7-archive/review.md", "utf8");
function oldArticle(id: string) { const start=archivedReview.indexOf(`## ${id}\n`); if(start<0) throw Error("ARCHIVED_ARTICLE_MISSING"); const end=archivedReview.indexOf("\n## ",start+3); return archivedReview.slice(start,end<0?undefined:end).trim(); }
const ledger: any[] = [];
const output = [
  "# Thái Dương — bài đọc trước/sau cùng snapshot",
  `Lần xuất ${rows[0].runId}; template ${rows[0].templateVersion}. [JSON bài đọc](./tanbien-reading-examples.json), [JSON ánh xạ](./tanbien-sun-sentence-map.json). Mẫu engine từ đầu vào giả lập, không phải xác nhận chuyên môn độc lập.`,
];
function main(r: any, collect = false) {
  const lines: string[] = [];
  function emit(text: string, kind: string, evidence: any) {
    lines.push(text);
    if (collect) {
      if (kind === "dữ kiện + giới hạn") {
        const [fact, ...limit] = text.split(";");
        ledger.push({sample:r.id,snapshotId:r.snapshotId,kind:"dữ kiện",text:fact,...evidence});
        if(limit.length) ledger.push({sample:r.id,snapshotId:r.snapshotId,kind:"phương pháp/giới hạn",text:limit.join(";").trim(),metadata:"unassessed: ảnh hưởng chưa tổng hợp là giới hạn phần mềm"});
      } else ledger.push({sample:r.id,snapshotId:r.snapshotId,kind,text,...evidence});
    }
  }
  emit(r.introduction.text, "phương pháp/giới hạn", {
    metadata: "readerIntroduction",
  });
  if (r.lifeMajorNotice)
    emit(r.lifeMajorNotice + ".", "phương pháp/giới hạn", {
      metadata: "lifeMajorNotice: không có claim chính tinh Mệnh",
    });
  if (r.scopeMessage)
    emit(r.scopeMessage, "phương pháp/giới hạn", { metadata: "scopeMessage" });
  for (const f of r.openingFacts)
    emit(f.text, "dữ kiện", { evidencePaths: f.paths });
  for (const s of r.sections.filter((s: any) => s.claims.length)) {
    lines.push(`### ${s.title}`);
    for (const p of s.paragraphs) {
      lines.push(`**${p.evidence[0].contentLabel} · dự thảo**`);
      const refs = {
        claimId: p.claim.id,
        rules: p.claim.rules.map((x: any) => ({
          id: x.id,
          version: x.version,
        })),
        sources: p.evidence.flatMap((e: any) => e.sources),
      };
      for (const text of p.display.text.split(/(?<=[.!?])\s+/)) {
        const isRecordedFact = p.claim.rules.some((x:any)=>x.id === "tanbien.r07") && text === "Tài Bạch ghi nhận Lộc Tồn.";
        emit(
          text,
          isRecordedFact ? "dữ kiện" : /^(Đây là|Đoạn này|Không suy)/.test(text)
            ? "phương pháp/giới hạn"
            : "nhận định",
          isRecordedFact ? {...refs, evidencePaths:p.evidence.flatMap((e:any)=>e.facts.flatMap((f:any)=>f.paths))} : refs,
        );
      }
      for (const n of p.nearbyNotes)
        emit(n.text, "phương pháp/giới hạn", {
          ...refs,
          evidencePaths: n.paths,
          metadata: "nearbyNotes",
        });
      if (p.display.contextLink)
        emit(r.contextLinkText, "phương pháp/giới hạn", {
          metadata: "contextLinkText",
          target: p.display.contextLink,
        });
      lines.push(`Căn cứ: ${p.claim.rules.map((x: any) => x.id).join(", ")}.`);
    }
  }
  if (r.unassessed.length) {
    lines.push("### Những yếu tố chưa được xét");
    for (const n of r.unassessed)
      emit(n.text, "dữ kiện + giới hạn", {
        evidencePaths: n.paths,
        metadata:
          "unassessed: dữ kiện snapshot; mệnh đề ảnh hưởng chưa tổng hợp là chính sách phần mềm, không phải tác động chuyên môn",
      });
    emit(
      r.contextPolicy || "Đây không phải danh sách đầy đủ.",
      "phương pháp/giới hạn",
      { metadata: "contextPolicy" },
    );
  }
  if (r.unsupported.length)
    emit(
      `Chưa có nội dung cho: ${r.unsupported.join("; ")}.`,
      "phương pháp/giới hạn",
      { metadata: "unsupported: chủ đề không có claim" },
    );
  emit(
    "Phạm vi hiện tại: các nhận định cục bộ; chưa tổng hợp toàn lá số.",
    "phương pháp/giới hạn",
    { metadata: "chính sách phạm vi template" },
  );
  return lines.join("\n\n");
}
for (const id of ids) {
  const r = rows.find((x: any) => x.id === id),
    b = old.find((x: any) => x.id === id);
  if (r.snapshotId !== b.snapshotId) throw Error("SNAPSHOT_CHANGED");
  output.push(
    `## ${id}\n\nSnapshot ${r.snapshotId}\n\n### Trước — 1.7.0`,
    oldArticle(id),
    "### Sau — 1.8.0",
    main(r, true),
  );
}
output.push(
  "## Ánh xạ câu bài chính",
  "Phạm vi: toàn bộ câu nội dung chính được xuất ở trên, gồm mở đầu, dữ kiện, nhận định, ghi chú và phạm vi. Không tuyên bố ánh xạ chữ giao diện, tiêu đề, glossary hoặc mọi dòng hồ sơ/trace thu gọn. Câu có cả dữ kiện và giới hạn được tách tại dấu chấm phẩy thành hai vế để ghi rõ hai lớp; không gọi giới hạn phần mềm là claim chuyên môn.",
  "| Mẫu / loại | Câu | Căn cứ |",
  "|---|---|---|",
);
for (const l of ledger)
  output.push(
    `| ${l.sample} / ${l.kind} | ${l.text.replaceAll("|", "/")} | ${[l.claimId, l.rules?.map((x: any) => x.id + "@" + x.version).join(", "), l.sources?.map((s: any) => s.location).join("; "), l.evidencePaths?.join(", "), l.metadata, l.target].filter(Boolean).join("; ").replaceAll("|", "/")} |`,
  );
writeFileSync("exports/tanbien-sun-review.md", output.join("\n\n") + "\n");
writeFileSync(
  "exports/tanbien-sun-sentence-map.json",
  JSON.stringify(
    {
      runId: rows[0].runId,
      generatedAt: rows[0].generatedAt,
      templateVersion: rows[0].templateVersion,
      ledger,
    },
    null,
    2,
  ) + "\n",
);
