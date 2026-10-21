import fs from "node:fs";
import { linhIsolation } from "../lib/internal-review/linh-isolation";
import { compareLinh } from "../lib/internal-review/linh-trial";
import { executeRules } from "../lib/interpretation-rules/execute";
import { catalog } from "../lib/interpretation-rules/catalog";
import { deriveFacts } from "../lib/interpretation-rules/derived";
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
const engine = pack.rows.filter((r: any) => r.kind !== "synthetic");
const fixtures = linhIsolation(pack.rows);
const inspect = (r: any) => {
  const execution = executeRules(r.snapshot, catalog, "internal-draft");
  return {
    id: r.id,
    kind: r.kind,
    provenance: r.provenance,
    life: r.snapshot.chart.palaces.find((p: any) => p.name === "Mệnh"),
    facts: deriveFacts(r.snapshot).filter((f) => f.id.startsWith("fact.life-")),
    traces: execution.traces.filter((t) =>
      t.ruleId.startsWith("combination.ziwei-assistants"),
    ),
    claims: execution.previewClaims.filter((c) =>
      c.rules.some((t) => t.id.startsWith("combination.ziwei-assistants")),
    ),
    comparison: compareLinh(r.snapshot),
  };
};
const result = {
  scope:
    "Engine samples screened, then explicitly synthetic evaluator isolation. No live DB access.",
  engine: engine.map(inspect),
  fixtures: fixtures.map(inspect),
};
fs.writeFileSync(
  "docs/evidence/linh-isolation/results.json",
  JSON.stringify(result, null, 2),
);
console.log(
  JSON.stringify(
    result.engine.find((r: any) => r.id === "linh-entry")?.traces,
    null,
    2,
  ),
);
console.log(
  result.fixtures.map((r) => ({
    id: r.id,
    before: r.traces.map((t) => t.status),
    after:
      r.comparison.status === "compared"
        ? r.comparison.dependentRules.map((t) => t.after.status)
        : "unknown",
  })),
);
