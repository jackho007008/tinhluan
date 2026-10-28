import fs from "node:fs/promises";
import path from "node:path";
import { catalog } from "../interpretation-rules/catalog";
import { tanBienRules } from "../interpretation-rules/profile-rules";
import { executeRules } from "../interpretation-rules/execute";
import type { InternalReading } from "../internal-review/reading-store";
import { receiptMatches } from "../internal-review/dynamic-reading";
import { KNOWLEDGE_VERSION, type Knowledge, type MenhInput } from "./contract";
import {
  isMenhReference,
  ruleReference,
  unresolvedTemplate,
  v1MenhEditorial,
} from "./v1-editorial";
/** V1 is primary editorial context, not a source of chart facts or expert approval.
 * Additional personal claims must match the existing evaluator, never keywords. */
export async function retrieveMenhKnowledge(
  record: InternalReading,
  input: MenhInput,
): Promise<MenhInput> {
  if (
    !record.frozen.verified ||
    !receiptMatches(record.snapshot, record.receipt)
  )
    throw Error("AI_UNVERIFIED_SNAPSHOT");
  const v1 = v1MenhEditorial(record);
  const rules = record.snapshot.chart.tanBien
    ? tanBienRules(record.snapshot)
    : catalog;
  const execution = executeRules(record.snapshot, rules, "internal-draft");
  const matched = execution.previewClaims.flatMap((c) =>
    c.rules
      .filter(isMenhReference)
      .filter((r) => !v1.coveredRuleIds.has(r.id))
      .map((r) => ({ r, text: c.text })),
  );
  const knowledge: Knowledge[] = [...v1.items];
  const seen = new Set<string>();
  for (const { r, text } of matched.sort(
    (a, b) =>
      Number(b.r.presentation?.contentType === "combination") -
        Number(a.r.presentation?.contentType === "combination") ||
      a.r.id.localeCompare(b.r.id),
  )) {
    if (seen.has(r.id) || unresolvedTemplate(text)) continue;
    seen.add(r.id);
    knowledge.push(
      ruleReference(r, text, "matched-snapshot", execution.ruleSetHash),
    );
    if (seen.size >= 12) break;
  }
  const life = record.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
  const root =
    process.env.AI_KNOWLEDGE_DIR ||
    path.resolve(".local/source-library/knowledge");
  const ids = [
    "inherited-NPL-01",
    "inherited-NPL-07",
    ...(life.majorStars.length ? ["inherited-NPL-11"] : []),
    ...(life.majorStars.length >= 2 ? ["inherited-NPL-15"] : []),
    ...(life.majorStars.length === 0 ? ["inherited-NPL-16"] : []),
  ];
  for (const id of ids) {
    try {
      const r = JSON.parse(
        await fs.readFile(path.join(root, "records", id + ".json"), "utf8"),
      );
      if (
        typeof r.source_paraphrase !== "string" ||
        !Array.isArray(r.references) ||
        unresolvedTemplate(r.source_paraphrase)
      )
        continue;
      const references = r.references
        .filter(
          (x: any) => typeof x.book === "string" && Array.isArray(x.pdf_pages),
        )
        .map((x: any) => ({
          title: `${r.author} — ${{ npl: "Tử Vi Tổng Hợp", hs: "Tử Vi Hàm Số" }[x.book as "npl" | "hs"] || x.book}; hồ sơ ${r.title}`,
          location:
            "Trang PDF " +
            x.pdf_pages.join(", ") +
            "; nguồn theo hồ sơ đã lưu, không tự đồng nhất trang in.",
        }));
      if (!references.length) continue;
      knowledge.push({
        id: "knowledge:" + id,
        title: String(r.title),
        text: r.source_paraphrase.slice(0, 2400),
        conditions: [r.conditions, r.inputs].filter(
          (x) => typeof x === "string",
        ),
        limits: [
          r.exceptions,
          r.unresolved,
          "Tri thức nền về phương pháp, không phải kết luận riêng cho lá số hoặc nguyên văn sách.",
        ].filter((x) => typeof x === "string"),
        references,
        selection: "background-method",
      });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT")
        throw Error("AI_KNOWLEDGE_INVALID");
    }
  }
  return {
    ...input,
    knowledgeVersion: KNOWLEDGE_VERSION,
    editorial: v1.coverage,
    knowledge,
  };
}
