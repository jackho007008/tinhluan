import type { ChartSnapshot } from "../tuvi-engine";
import { catalog, RULESET_VERSION } from "../interpretation-rules/catalog";
import {
  executeRules,
  type RuleExecution,
} from "../interpretation-rules/execute";
import { derivations } from "../interpretation-rules/derived";
export function createTemplate(execution: RuleExecution, groups: string[]) {
  if (execution.publication !== "customer")
    throw Error("SYNTHETIC_REPORT_BLOCKED");
  const definitions = [
    {
      id: "overview",
      group: "Tổng quan",
      title: "Tổng quan bản mệnh",
      glossary:
        "Mệnh: tên một cung trong lá số. Thân: cung được đánh dấu Thân trên lá số. Chính tinh, độ sáng và tứ hóa ở đây là nhãn của engine, không phải phép đo năng lực.",
    },
    {
      id: "career",
      group: "Sự nghiệp & tài lộc",
      title: "Sự nghiệp",
      glossary:
        "Quan Lộc: tên cung được dùng làm mục tra cứu cho chủ đề này. Việc chọn cung để trình bày không suy ra ngành nghề, thu nhập hoặc thời điểm thành công.",
    },
  ] as const;
  return definitions
    .filter((t) => groups.includes(t.group))
    .map((t) => {
      const ids = derivations
        .filter((d) => d.topic === t.id)
        .map((d) => d.id as string);
      const facts = execution.derivedFacts.filter((f) => ids.includes(f.id));
      const claims = execution.approvedClaims.filter((c) => c.topic === t.id);
      return {
        id: t.id,
        group: t.group,
        title: t.title,
        summary: `Có ${facts.length} mục dữ kiện từ snapshot. ${claims.length ? "Nhận định được phép được liệt kê riêng." : "Chưa có nhận định chuyên môn được duyệt."}`,
        facts,
        claims,
        glossary: t.glossary,
        limits: [
          "Dữ kiện an sao chưa được chuyên gia độc lập xác nhận; sử dụng theo đúng profile của snapshot.",
          "Không khẳng định chắc chắn tính cách, nghề nghiệp, thu nhập hay thời điểm thành công.",
        ],
        traces: execution.traces.filter((trace) =>
          execution.rules.some(
            (r) => r.id === trace.ruleId && r.topic === t.id,
          ),
        ),
        ruleReferences: execution.rules
          .filter((r) => r.topic === t.id && r.kind === "fact")
          .map(({ id, version, status, sourceReferences }) => ({
            id,
            version,
            status,
            sourceReferences,
          })),
      };
    });
}
export function buildInterpretation(snapshot: ChartSnapshot, groups: string[]) {
  const topics = groups.flatMap((g) =>
    g === "Tổng quan"
      ? ["overview"]
      : g === "Sự nghiệp & tài lộc"
        ? ["career"]
        : [],
  );
  const execution = executeRules(
    snapshot,
    catalog.filter((r) => topics.includes(r.topic)),
  );
  const { rules, ruleMatches, ...published } = execution;
  return structuredClone({
    version: RULESET_VERSION,
    engineVersions: snapshot.versions,
    engineProfile: snapshot.profile,
    resultId: snapshot.resultId,
    ...published,
    ruleMatches: ruleMatches.map((c) => ({
      id: c.id,
      topic: c.topic,
      ruleIds: c.rules.map((r) => r.id),
      reasons: c.reasons,
    })),
    ruleManifest: rules.map(({ id, version, status }) => ({
      id,
      version,
      status,
    })),
    topics: createTemplate(execution, groups),
  });
}
export type InterpretationReport = ReturnType<typeof buildInterpretation>;
// Optional AI gets only approved text/IDs, never the birth input or all facts.
export interface ClaimNarrator {
  generate(
    claims: { id: string; text: string }[],
  ): Promise<{ claimIds: string[]; text: string }[]>;
}
export async function narrateClaims(
  execution: RuleExecution,
  provider?: ClaimNarrator,
) {
  if (execution.publication !== "customer")
    throw Error("SYNTHETIC_REPORT_BLOCKED");
  const fallback = execution.approvedClaims.map((c) => ({
    claimIds: [c.id],
    text: c.text,
  }));
  if (!provider || !fallback.length) return fallback;
  try {
    const candidate = await provider.generate(
      execution.approvedClaims.map(({ id, text }) => ({ id, text })),
    );
    return JSON.stringify(candidate) === JSON.stringify(fallback)
      ? candidate
      : fallback;
  } catch {
    return fallback;
  }
}
