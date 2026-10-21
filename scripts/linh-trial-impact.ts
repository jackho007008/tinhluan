// Read-only with respect to snapshots, exports and the database.
import fs from "node:fs";
import { compareLinh, LINH_FORMULA } from "../lib/internal-review/linh-trial";
import type { ChartSnapshot } from "../lib/tuvi-engine";
const pack = JSON.parse(
  fs.readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
);
pack.rows.push(
  JSON.parse(
    fs.readFileSync(
      "lib/internal-review/engine-samples/linh-trial.json",
      "utf8",
    ),
  ),
);
const rows = pack.rows.map(
  (r: { id: string; kind: string; snapshot: ChartSnapshot }) => ({
    id: r.id,
    kind: r.kind,
    result: compareLinh(r.snapshot),
  }),
);
fs.writeFileSync(
  "docs/evidence/linh-trial/impact.json",
  JSON.stringify(
    { formula: LINH_FORMULA, parentRun: pack.runId, rows },
    null,
    2,
  ),
);
for (const kind of [...new Set(rows.map((r: any) => r.kind))]) {
  const subset = rows.filter((r: any) => r.kind === kind);
  console.log(
    kind,
    subset.length,
    subset.filter(
      (r: any) => r.result.status === "compared" && r.result.changed,
    ).length,
    "changed",
  );
}
console.log(
  rows
    .filter((r: any) => r.result.lifeMovement === "vào Mệnh")
    .map((r: any) => ({
      id: r.id,
      kind: r.kind,
      old: r.result.old.branch,
      next: r.result.proposed.branch,
    })),
);
const headers = [
  "Mẫu | Loại | Linh cũ → mới | Mệnh | Fact đổi | Rule đổi (trace) | Claim thêm/bớt",
  "---|---|---|---|---|---|---",
];
const lines = rows.map((r: any) => {
  const x = r.result;
  return x.status === "compared"
    ? `${r.id} | ${r.kind} | ${x.old.branch} → ${x.proposed.branch} | ${x.lifeMovement} | ${x.factChanges.map((f: any) => f.id).join(", ") || "—"} | ${x.ruleChanges.map((t: any) => t.ruleId).join(", ") || "—"} | +${x.claimsAdded.length}/−${x.claimsRemoved.length}`
    : `${r.id} | ${r.kind} | unknown | — | ${x.reasons.join("; ")} | — | —`;
});
fs.writeFileSync(
  "docs/evidence/linh-trial/impact.md",
  "# Độ nhạy vị trí Linh — không phải kết quả luận giải hợp lệ\n\n" +
    headers.concat(lines).join("\n") +
    "\n",
);
const audit = ".local/chart-comparison-1992-08-07/audit.json";
if (fs.existsSync(audit))
  fs.writeFileSync(
    ".local/chart-comparison-1992-08-07/linh-trial.json",
    JSON.stringify(
      compareLinh(JSON.parse(fs.readFileSync(audit, "utf8")).snapshot),
      null,
      2,
    ),
    { mode: 0o600 },
  );
