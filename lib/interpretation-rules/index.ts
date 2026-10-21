import type { ChartSnapshot } from "../tuvi-engine";
export type Statement = {
  id: string;
  version: string;
  system: string;
  kind: "fact";
  text: string;
  evidencePaths: string[];
  conditions: string;
  exceptions: string;
  source: { url: string; location: string };
  conflictPolicy: string;
  approvalStatus: "factual-only";
};
export function facts(s: ChartSnapshot): Statement[] {
  return s.chart.palaces.map((p, i) => ({
    id: `fact.palace.${i}`,
    version: "1.0.0",
    system: s.profile.id,
    kind: "fact",
    text: `Cung ${p.name} tại ${p.earthlyBranch}: ${p.majorStars.length ? p.majorStars.map((x) => x.name).join(", ") : "không có chính tinh"}.`,
    evidencePaths: [
      `chart.palaces.${i}.name`,
      `chart.palaces.${i}.earthlyBranch`,
      `chart.palaces.${i}.majorStars`,
    ],
    conditions: "Có snapshot engine hợp lệ",
    exceptions: "Không suy ra sự kiện cuộc đời từ vị trí sao",
    source: {
      url: "https://github.com/SylarLong/iztro/tree/v2.6.1",
      location: "lib/astro/astro.js bySolar; palaces",
    },
    conflictPolicy: "Chỉ chép dữ kiện snapshot; từ chối căn cứ thiếu",
    approvalStatus: "factual-only",
  }));
}
export function validateEvidence(s: ChartSnapshot, statements: Statement[]) {
  for (const a of statements) {
    if (a.approvalStatus !== "factual-only" || a.kind !== "fact")
      throw new Error("UNAPPROVED_RULE");
    for (const p of a.evidencePaths) {
      const found = p
        .split(".")
        .reduce<unknown>(
          (v, k) =>
            v && typeof v === "object"
              ? (v as Record<string, unknown>)[k]
              : undefined,
          s,
        );
      if (found === undefined) throw new Error("MISSING_EVIDENCE");
    }
    const canonical = facts(s).find((item) => item.id === a.id);
    if (!canonical || JSON.stringify(canonical) !== JSON.stringify(a))
      throw new Error("UNAPPROVED_RULE");
  }
}
