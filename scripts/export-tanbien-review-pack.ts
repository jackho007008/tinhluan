// Editorial package only: existing sample loader, no orders or DB writes; previous exports untouched.
import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { samples, loadSample } from "../lib/internal-review/samples";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { evidenceLayers } from "../lib/internal-review/tanbien-presentation";
import { RULESET_VERSION } from "../lib/interpretation-rules/catalog";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const dir = "exports/tanbien-review-1.9.0";
const old = JSON.parse(
  readFileSync("exports/tanbien-reading-examples.json", "utf8"),
);
const demo = JSON.parse(
  readFileSync("exports/demo-wuqu-tianfu-review.json", "utf8"),
).snapshot as ChartSnapshot;
const runId = randomUUID(),
  generatedAt = new Date().toISOString();
const rows = [
  {
    id: "demo-wuqu-tianfu",
    kind: "demo",
    snapshot: demo,
    ...buildTanBienReading(demo),
  },
];
for (const sample of samples) {
  const r = (await loadSample(sample.id))!;
  rows.push({
    id: sample.id,
    kind: sample.kind,
    snapshot: r.report.snapshot,
    ...buildTanBienReading(r.report.snapshot),
  });
}
for (const before of old) {
  const now = rows.find((x) => x.id === before.id)!;
  if (
    now.snapshotId !== before.snapshotId ||
    JSON.stringify(now.execution) !== JSON.stringify(before.execution)
  )
    throw Error("EVALUATOR_OR_SNAPSHOT_CHANGED:" + before.id);
}
const selected = [
  "demo-wuqu-tianfu",
  "vn-0",
  "vn-co-cu-loc",
  "vn-jumen",
  "vn-16",
  "vn-2",
];
const intro = `Lần xuất ${runId}; ${generatedAt}; template1.9.0; catalog ${RULESET_VERSION}. Nội bộ, draft/review=null. [JSON cùng lần xuất](./readings.json). Không phải đánh giá chuyên môn hoặc điều kiện mở bán. Không ghi phản hồi người thật.`;
const paragraphs = (r: (typeof rows)[number]) =>
  r.sections.flatMap((s) => s.paragraphs);
const multi = new Set(["tanbien.r02", "tanbien.r05", "tanbien.r20"]);
const type = (p: ReturnType<typeof paragraphs>[number]) =>
  p.claim.rules.some((x) => multi.has(x.id))
    ? "Phối hợp có điều kiện"
    : p.claim.rules.some((x) => x.presentation?.contentType === "combination")
      ? "Nhận định có điều kiện riêng (không phải tổ hợp)"
      : "Chú giải nền/yếu tố riêng";
const source = (p: ReturnType<typeof paragraphs>[number]) =>
  p.evidence
    .flatMap((e) => e.sources.map((s) => `${s.title}; ${s.location}`))
    .join("; ");
const esc = (s: string) => s.replaceAll("|", "/").replaceAll("\n", " ");
const map: any[] = [];
function article(r: (typeof rows)[number]) {
  const out = [
    `## ${r.id}`,
    `Mã mẫu ${r.id}; bản1.9.0; snapshot ${r.snapshotId}; loại ${r.kind}.`,
  ];
  const emit = (text: string, kind: string, refs: object) => {
    out.push(text);
    map.push({ sample: r.id, snapshotId: r.snapshotId, kind, text, ...refs });
  };
  emit(r.introduction.text, "giới hạn/biên tập", {
    metadata: "readerIntroduction",
  });
  for (const f of r.openingFacts)
    emit(f.text, "dữ kiện snapshot", { evidencePaths: f.paths });
  if (r.lifeMajorNotice)
    emit(r.lifeMajorNotice + ".", "giới hạn/biên tập", {
      metadata: "lifeMajorNotice",
    });
  if (r.scopeMessage)
    emit(r.scopeMessage, "giới hạn/biên tập", { metadata: "scopeMessage" });
  for (const s of r.sections.filter((s) => s.claims.length)) {
    out.push(`### ${s.title}`);
    for (const p of s.paragraphs) {
      out.push(`**${type(p)} · mã đoạn ${p.claim.id}**`);
      out.push(p.display.text);
      for (const text of p.display.text.split(/(?<=[.!?])\s+/)) {
        const fact =
          p.claim.rules.some((x) => x.id === "tanbien.r07") &&
          text === "Tài Bạch ghi nhận Lộc Tồn.";
        const editorial = /^(Đây là|Đây chỉ|Đoạn này|Không suy)/.test(text);
        map.push({
          sample: r.id,
          snapshotId: r.snapshotId,
          kind: fact
            ? "dữ kiện snapshot"
            : editorial
              ? "giới hạn/biên tập"
              : "nhận định có nguồn",
          text,
          claimId: p.claim.id,
          rules: p.claim.rules.map((x) => ({ id: x.id, version: x.version })),
          sources: p.evidence.flatMap((e) => e.sources),
          snapshotBindings: p.display.bindings,
          ...(fact
            ? {
                evidencePaths: p.evidence.flatMap((e) =>
                  e.facts.flatMap((f) => f.paths),
                ),
              }
            : {}),
          ...(editorial
            ? {
                metadata:
                  "giới hạn được lưu cùng claim, không phải luận điểm mới",
              }
            : {}),
        });
      }
      for (const note of p.nearbyNotes)
        emit(note.text, "giới hạn/biên tập", {
          claimId: p.claim.id,
          metadata: "nearbyNotes",
          evidencePaths: note.paths,
        });
      if (p.display.contextLink)
        emit(r.contextLinkText + ".", "giới hạn/biên tập", {
          claimId: p.claim.id,
          metadata: "contextLinkText",
          target: p.display.contextLink,
        });
      out.push("<details><summary>Xem căn cứ</summary>");
      for (let i = 0; i < p.evidence.length; i++) {
        const l = evidenceLayers(
          p.evidence[i],
          p.nearbyNotes,
          p.claim.rules[i].id,
        );
        out.push(
          "**Dữ kiện trên lá số**",
          ...l.snapshot.map((x) => "- " + x.text),
          "**Điều kiện và nội dung trong tài liệu nguồn**",
          ...l.sourceFacts.map((x) => "- " + x.text),
          ...l.sourceConditions.map((x) => "- " + x),
          ...l.sources.map((x) => x.title + " — " + x.location),
          "**Phạm vi triển khai và giới hạn biên soạn**",
          ...l.projectScope.map((x) => "- " + x),
          ...l.contextNotes.map((x) => "- " + x.text),
          ...l.limits.map((x) => "- " + x),
        );
      }
      out.push(
        "<details><summary>Chi tiết kỹ thuật</summary>",
        `Snapshot ${r.snapshotId}; claim ${p.claim.id}; ${p.claim.rules.map((x) => x.id + "@" + x.version).join(", ")}. Bản nguyên gốc và trace nằm trong JSON cùng lần xuất.`,
        "```json",
        JSON.stringify(
          {
            originalClaim: p.claim.text,
            bindings: p.display.bindings,
            changes: p.display.changes,
            evidence: p.evidence,
            traces: r.execution.traces.filter((t) =>
              p.claim.rules.some((x) => x.id === t.ruleId),
            ),
          },
          null,
          2,
        ),
        "```",
        "</details>",
        "</details>",
      );
    }
  }
  out.push("### Những yếu tố chưa được xét");
  for (const n of r.unassessed) {
    out.push(n.text);
    const [fact, ...scope] = n.text.split(";");
    map.push({
      sample: r.id,
      snapshotId: r.snapshotId,
      kind: "dữ kiện snapshot",
      text: fact,
      evidencePaths: n.paths,
    });
    if (scope.length)
      map.push({
        sample: r.id,
        snapshotId: r.snapshotId,
        kind: "giới hạn/biên tập",
        text: scope.join(";").trim(),
        metadata: "unassessed",
      });
  }
  if (r.unassessed.length)
    emit(r.contextPolicy, "giới hạn/biên tập", { metadata: "contextPolicy" });
  if (r.unsupported.length)
    emit(
      "Chưa có nội dung cho: " + r.unsupported.join("; ") + ".",
      "giới hạn/biên tập",
      { metadata: "unsupported" },
    );
  emit(
    "Phạm vi hiện tại: các nhận định cục bộ; chưa tổng hợp toàn lá số.",
    "giới hạn/biên tập",
    { metadata: "template-scope" },
  );
  return out.join("\n\n");
}
const articles = new Map(
  rows.filter((r) => r.kind !== "synthetic").map((r) => [r.id, article(r)]),
);
writeFileSync(
  `${dir}/readings.json`,
  JSON.stringify(
    {
      runId,
      generatedAt,
      templateVersion: "1.9.0",
      catalog: RULESET_VERSION,
      rows,
    },
    null,
    2,
  ) + "\n",
);
writeFileSync(
  `${dir}/all-readings.md`,
  [
    "# Bài đọc của DEMO và toàn bộ mẫu engine",
    intro,
    ...articles.values(),
  ].join("\n\n") + "\n",
);
writeFileSync(
  `${dir}/selected-readings.md`,
  [
    "# Sáu bản đọc để chủ dự án duyệt",
    intro,
    ...selected.map((id) => articles.get(id)),
  ].join("\n\n") + "\n",
);
writeFileSync(
  `${dir}/sentence-map.json`,
  JSON.stringify(
    {
      runId,
      generatedAt,
      scope:
        "Nội dung chính của 21 bài; nhận định được giữ theo đoạn claim, có binding dữ kiện khi đổi địa chi. Không gọi tiêu đề, nhãn giao diện và trace là câu chuyên môn.",
      map,
    },
    null,
    2,
  ) + "\n",
);
const risks: Record<string, [string, string, string]> = {
  "demo-wuqu-tianfu": [
    "Chưa có tổng hợp Vũ–Phủ và tác động Tuần tại Tài Bạch.",
    "R01/R03 cạnh nhau dễ bị cộng thành tính cách chung; R02 không đồng nghĩa bằng cấp.",
    "Biên tập: đọc thử các đoạn riêng; nghiên cứu nguồn: tổ hợp và điều chỉnh tài chính.",
  ],
  "vn-12": [
    "Chưa có lời luận tổ hợp Tử Vi–Thiên Phủ.",
    "Hai chú giải nền có thể bị hiểu là tổng hợp.",
    "Quyết định chuyên môn/nguồn: tổ hợp; biên tập: giữ phạm vi từng sao.",
  ],
  "vn-20": [
    "Thiếu chủ đề công việc/tài chính; Hóa Quyền chỉ ở phạm vi đã chọn.",
    "“Chủ động” dễ bị hiểu thành năng lực lãnh đạo.",
    "Biên tập trước; nghiên cứu nhánh công việc nếu được chọn.",
  ],
  "vn-2": [
    "Không có claim Tân Biên phù hợp; Mệnh không chính tinh là danh sách rỗng hợp lệ.",
    "Không được hiểu phần trống là đặc điểm tốt/xấu.",
    "Nguồn/quyết định phương pháp: cách đọc Mệnh không chính tinh; không tự mượn đối cung.",
  ],
  "vn-4": [
    "Triệt Lộ tại Mệnh chưa tổng hợp.",
    "Chú giải nền Tử Vi dễ bị đọc thành chức vụ.",
    "Biên tập giới hạn; nghiên cứu án ngữ.",
  ],
  "vn-6": [
    "Thiên Tướng có yếu tố đi cùng chưa tổng hợp.",
    "Không đổi biểu tượng thành năng lực tổ chức chắc chắn.",
    "Nguồn/phương pháp: tác động Hỏa Tinh, thuật ngữ Không; biên tập ghi chú.",
  ],
  "vn-lianzhen": [
    "Liêm Trinh/Thiên Phủ được đọc riêng; chưa tổng hợp.",
    "Hai đoạn nền dễ bị ghép; thuật ngữ Không còn chưa xác minh.",
    "Nguồn/quyết định: tổ hợp, Không; biên tập giữ hai lớp.",
  ],
  "vn-tanlang": [
    "Một chú giải nền, thiếu chủ đề khác.",
    "Không suy sở thích/năng lực cụ thể từ tên sao.",
    "Biên tập ngôn ngữ; nguồn: nhánh điều kiện riêng.",
  ],
  "vn-jumen": [
    "Không có Lộc Tồn đồng cung nên không xuất R20; chưa có nhánh phối hợp phù hợp.",
    "Hai chú giải sao có thể nghe khác chiều; không tự hòa giải.",
    "Nguồn/quyết định: nhánh Cơ–Cự khác; biên tập phạm vi.",
  ],
  "vn-0": [
    "Chưa tổng hợp Cơ–Âm và điều kiện thời gian của Âm.",
    "Không cộng mô tả hai sao thành trí thông minh/năng lực.",
    "Nguồn/phương pháp: ngày đêm và tổ hợp; biên tập đoạn riêng.",
  ],
  "vn-16": [
    "R21 chỉ vế văn chương/triết học/đạo lý; tài chính chỉ Lộc Tồn.",
    "Sở thích truyền thống có thể bị hiểu là sở thích thực tế; hãm không phải đánh giá kém.",
    "Biên tập giới hạn; nghiên cứu các nhánh điều chỉnh nếu cần.",
  ],
  "vn-taiyang": [
    "Ngày/đêm và ảnh hưởng khác chưa tổng hợp.",
    "Chú giải nền dễ bị coi là đánh giá tổng thể.",
    "Phương pháp: định nghĩa ngày/đêm; biên tập không lặp.",
  ],
  "vn-tiantong": [
    "Một chú giải riêng, chưa có nội dung công việc/tài chính.",
    "Không coi mô tả truyền thống là đánh giá tâm lý.",
    "Biên tập trước; nguồn: các nhánh đi cùng.",
  ],
  "vn-tianliang": [
    "Thái Dương và Thiên Lương riêng, chưa có lời luận tổ hợp.",
    "Không suy tuổi thọ từ Thiên Lương; không cộng nghĩa.",
    "Nguồn/phương pháp: tổ hợp và thời gian.",
  ],
  "vn-qisha": [
    "Chỉ nền trạng thái nguồn; nhánh can sinh/hội hợp chưa đọc được bằng rule.",
    "Hiếu thắng không đồng nghĩa nguy hiểm hoặc nghề cụ thể.",
    "Biên tập cách hiểu; nguồn cho nhánh điều kiện.",
  ],
  "vn-pojun": [
    "Dự án chỉ xét chính tinh duy nhất, chưa luận đồng cung.",
    "Ưa hoạt động không đồng nghĩa đổi mới/khởi nghiệp.",
    "Nguồn/quyết định: trường hợp đồng cung; biên tập giới hạn.",
  ],
  "engine-combo": [
    "Không có claim Tân Biên khớp cho Tử Vi–Phá Quân Mùi.",
    "Không dùng rule của nguồn khác để lấp chế độ Tân Biên.",
    "Nguồn/phương pháp: trạng thái và đồng cung; không nới rule.",
  ],
  "engine-exception": [
    "Không có claim Tân Biên khớp cho Tử Vi–Phá Quân Mùi.",
    "Tên mẫu exception không tự là kết luận chuyên môn.",
    "Nguồn/phương pháp: đồng cung và yếu tố điều chỉnh.",
  ],
  "engine-partial": [
    "Mệnh Thìn có Tử Vi/Thiên Tướng; chỉ R09 khớp, chưa có chú giải Tử Vi tại vị trí này hoặc lời luận tổ hợp.",
    "Không áp R05 của Quan Lộc sang tổ hợp tại Mệnh; tên partial không phải điểm chất lượng.",
    "Đọc lại căn cứ riêng; nguồn tổ hợp chưa được triển khai.",
  ],
  "cn-reference": [
    "Giữ profile lịch Trung Quốc tham chiếu riêng; chưa tổng hợp toàn lá số.",
    "Không coi mẫu cùng sao là bằng chứng hai quy ước lịch tương đương.",
    "Quyết định phương pháp trước đối chiếu; biên tập nhãn profile.",
  ],
  "vn-co-cu-loc": [
    "Có R20 đúng nhánh Lộc Tồn, chưa hòa giải với hai chú giải nền.",
    "“Thiếu thận trọng” có thể bị hiểu là phán xét cá nhân.",
    "Biên tập cần phản hồi; nguồn/phương pháp cho nhánh khác.",
  ],
};
const assessment = [
  "# Kiểm kê nội dung toàn bộ mẫu",
  intro,
  `Bản xuất trước có ${old.length} bài. Catalog mẫu có ${samples.length} mục:20engine,36fixture tổng hợp; thêm DEMO riêng =57hàng. Không tính fixture như lá số hợp lệ. Nhận xét rủi ro dưới đây là rà soát biên tập của dự án, không phải phản hồi người thật hay điểm chất lượng.`,
  "## DEMO và mẫu engine",
  "| Mẫu / profile | Mệnh | Chủ đề | Chú giải nền | Điều kiện riêng / tổ hợp | Khoảng trống | Rủi ro đọc | Việc tiếp theo |",
  "|---|---|---|---|---|---|---|---|",
];
for (const r of rows.filter((r) => r.kind !== "synthetic")) {
  const ps = paragraphs(r),
    base = ps.filter((p) => type(p).startsWith("Chú giải")),
    conditional = ps.filter((p) => !type(p).startsWith("Chú giải"));
  const describe = (ps: typeof base) =>
    ps
      .map(
        (p) =>
          type(p) +
          ": " +
          p.claim.rules
            .map((x) => x.id + " — " + x.presentation?.title)
            .join(", "),
      )
      .join("; ") || "Không có";
  assessment.push(
    `| ${r.id} / ${r.snapshot.profile.id} | ${esc(
      r.openingFacts
        .slice(0, 2)
        .map((x) => x.text)
        .join(" "),
    )} | ${
      r.sections
        .filter((s) => s.claims.length)
        .map((s) => s.title)
        .join("; ") || "Không có"
    } | ${esc(describe(base))} | ${esc(describe(conditional))} | ${esc(risks[r.id][0])} | ${esc(risks[r.id][1])} | ${esc(risks[r.id][2])} |`,
  );
}
assessment.push(
  "## Fixture kỹ thuật — không phải lá số hợp lệ để duyệt chuyên môn",
  "Chỉ dùng kiểm điều kiện evaluator; không đưa các bài này vào bộ sáu người đọc. Phạm vi nhận xét là thiếu dữ kiện/khớp điều kiện, không đánh giá chất lượng đời sống.",
  "| Fixture / profile | Dữ kiện Mệnh trong fixture | Chủ đề/loại claim | Phần thiếu | Rủi ro / bước tiếp |",
  "|---|---|---|---|---|",
);
for (const r of rows.filter((r) => r.kind === "synthetic"))
  assessment.push(
    `| ${r.id} / ${r.snapshot.profile.id} | ${esc(
      r.openingFacts
        .slice(0, 2)
        .map((x) => x.text)
        .join(" "),
    )} | ${esc(
      paragraphs(r).length
        ? r.sections
            .filter((s) => s.paragraphs.length)
            .map((s) => s.title)
            .join(", ") +
            ": " +
            paragraphs(r)
              .map(
                (p) =>
                  type(p) + ": " + p.claim.rules.map((x) => x.id).join(","),
              )
              .join("; ")
        : "Không có claim",
    )} | ${esc(r.unknown.map((x) => x.ruleId + ": " + x.status).join("; ") || "Không có thiếu dữ kiện được evaluator báo; không đồng nghĩa đủ luận giải")} | Dữ liệu thay đổi tổng hợp, không suy thành cấu trúc engine hợp lệ; chỉ kiểm logic. Không nghiên cứu nội dung dựa trên fixture này. |`,
  );
assessment.push(
  "## Ba ưu tiên đề xuất — chưa triển khai",
  "1. Biên tập và đọc thử giới hạn nhận định: vn-co-cu-loc, vn-jumen, vn-16. Kiểm người đọc có hiểu phạm vi cục bộ thay vì phán xét cá nhân; không thêm rule trước khi nhận phản hồi.",
  "2. Nghiên cứu cách đọc cấu hình hiện trống: vn-2, engine-combo, engine-exception; cần nguồn/phương pháp cho Mệnh không chính tinh và Tử Vi–Phá Quân tại Mùi, không mượn nguồn khác âm thầm.",
  "3. Quyết định phương pháp cho điều kiện chưa định nghĩa: ngày/đêm ở vn-0/vn-taiyang/vn-tianliang; án ngữ ở vn-4 và DEMO. Chốt nghĩa nguồn trước khi triển khai tác động.",
);
writeFileSync(`${dir}/assessment.md`, assessment.join("\n\n") + "\n");
const feedback = [
  "# Phiếu phản hồi trống — sáu mẫu",
  intro,
  "Không điền tên thật, khóa hoặc token. Đây là câu hỏi hiểu nội dung, không hỏi độ đúng vận mệnh. Không có câu trả lời mẫu.",
];
for (const id of selected) {
  const r = rows.find((x) => x.id === id)!;
  feedback.push(
    `## ${id}`,
    `Snapshot ${r.snapshotId}; engine ${r.snapshot.versions.engine}; catalog ${RULESET_VERSION}; template1.9.0.`,
  );
  for (const p of paragraphs(r)) {
    feedback.push(
      `### Mã đoạn ${p.claim.id}`,
      p.display.text,
      `Rule ${p.claim.rules.map((x) => x.id + "@" + x.version).join(", ")}`,
      "- Bạn hiểu ý chính của đoạn này là gì:\n- Từ hoặc câu nào khó hiểu:\n- Đoạn nào lặp, quá chung hoặc có vẻ khẳng định quá mức:\n- Căn cứ có giải thích được vì sao đoạn xuất hiện không:\n- Bạn mong biết thêm điều gì nhưng bài chưa trả lời:",
    );
  }
  feedback.push(
    "### Toàn bài / phần thiếu nội dung (section: scope)",
    "- Bạn hiểu ý chính và phạm vi bài này ra sao:\n- Từ hoặc câu nào khó hiểu:\n- Đoạn nào lặp, quá chung hoặc có vẻ khẳng định quá mức:\n- Căn cứ có giải thích được vì sao đoạn xuất hiện không:\n- Bạn mong biết thêm điều gì nhưng bài chưa trả lời:",
  );
}
writeFileSync(`${dir}/feedback.md`, feedback.join("\n\n") + "\n");
const changes = [
  "# Trước/sau trình bày — không thay claim",
  intro,
  "Phạm vi so sánh:19bài đã xuất1.8.0, cùng snapshot. Hai mẫu engine bổ sung vào bộ xuất mới (engine-partial, cn-reference) không có bản xuất1.8 để so; chúng không phải mẫu engine vừa tạo.",
];
for (const before of old) {
  const now = rows.find((x) => x.id === before.id)!;
  for (const p of paragraphs(now)) {
    const prev = before.sections
      .flatMap((s: any) => s.paragraphs)
      .find((x: any) => x.claim.id === p.claim.id);
    if (prev.display.text !== p.display.text)
      changes.push(
        `## ${now.id} · ${p.claim.id}`,
        `Trước: ${prev.display.text}`,
        `Sau: ${p.display.text}`,
        `Dữ kiện: ${JSON.stringify(p.display.bindings)}. Claim/rule/nguồn giữ nguyên: ${p.claim.rules.map((x) => x.id).join(", ")}; ${source(p).replace(/[.]+$/, "")}.`,
      );
  }
}
changes.push(
  "## Căn cứ — thay lớp, không đổi nội dung",
  "R21/R20/R19/R14/R16: các ghi chú biên tập trước bị gắn kind=source; nay kind=editorial, không mang tiền tố bảng nguồn. Bảng trạng thái thực vẫn nằm lớp nguồn. Câu giới hạn đã hiện nguyên văn cạnh đoạn được bỏ lặp ở căn cứ thông thường, nhưng giữ trong hồ sơ kỹ thuật. R21 bỏ lặp vế giới hạn cùng nghĩa ở lớp thông thường; nguyên bản vẫn trong JSON/chi tiết kỹ thuật.",
);
writeFileSync(`${dir}/changes.md`, changes.join("\n\n") + "\n");
console.log(
  JSON.stringify({
    runId,
    rows: rows.length,
    engine: rows.filter((r) => r.kind === "engine").length,
    synthetic: rows.filter((r) => r.kind === "synthetic").length,
    selected: selected.length,
  }),
);
