// Synthetic evaluator fixtures, NEVER valid engine charts or persisted reports.
import type { ChartSnapshot } from "../tuvi-engine";
export function linhIsolation(rows: { id: string; snapshot: ChartSnapshot }[]) {
  return ["enter", "leave", "missing", "empty"].map((mode) => {
    const base = rows.find(
      (r) => r.id === (mode === "leave" ? "vn-tiantong" : "linh-entry"),
    )!;
    const snapshot = structuredClone(base.snapshot);
    snapshot.resultId = `technical-linh-${mode}`;
    const life = snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
    life.majorStars = [{ name: "Tử Vi" }];
    life.minorStars = [
      { name: "Tả Phù" },
      { name: "Hữu Bật" },
      ...(mode === "leave" ? [{ name: "Linh Tinh" }] : []),
    ];
    if (mode === "empty") life.minorStars = [];
    if (mode === "missing") delete (life as Partial<typeof life>).minorStars;
    return {
      id: `technical-linh-${mode}`,
      kind: "synthetic",
      snapshot,
      parentResultId: base.snapshot.resultId,
      provenance:
        "Fixture kỹ thuật: thay chính/phụ tinh Mệnh để cô lập điều kiện evaluator; không phải lá số engine, không kiểm chứng công thức an sao.",
    };
  });
}
