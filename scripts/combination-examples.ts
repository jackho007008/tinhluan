// Engine-generated public demo examples, not independent/expert validation.
import { calculate } from "../lib/tuvi-engine";
import { buildReport } from "../lib/reports";
import { internalPreview } from "../lib/internal-review/preview";
import { writeFileSync } from "node:fs";
const found = new Map();
let runs = 0;
for (const year of [2000, 2001])
  for (let day = 1; day <= 31 && found.size < 3; day++)
    for (let hour = 0; hour < 24 && found.size < 3; hour += 2) {
      const input = {
        date: `${year}-05-${String(day).padStart(2, "0")}`,
        hour,
        minute: 0,
        unknownTime: false,
        place: "Hà Nội",
        gender: "female",
        calendar: "solar",
        profile: "vn-utc7-midnight-v1",
        timezone: "Asia/Ho_Chi_Minh",
        consent: true,
      };
      const s = await calculate(input);
      runs++;
      const m = s.chart.palaces.find((p) => p.name === "Mệnh")!;
      if (!m.majorStars.some((s) => s.name === "Tử Vi")) continue;
      const report = await buildReport(s, {
          groups: ["Tổng quan"],
          year: null,
        }),
        p = internalPreview(report),
        topic = p.topics[0];
      const combos = topic.notes.filter((n) => n.id.startsWith("combination."));
      const key = combos[0]?.id || "nonmatch";
      if (!found.has(key))
        found.set(key, {
          input,
          engine: s.versions,
          resultId: s.resultId,
          major: m.majorStars,
          minor: m.minorStars,
          before: topic.notes
            .filter((n) => !n.id.startsWith("combination."))
            .map((n) => n.text),
          after: topic.mainNotes.map((n) => n.text),
          details: topic.detailNotes.map((n) => n.text),
          trace: p.execution.traces.filter((t) =>
            t.ruleId.startsWith("combination."),
          ),
        });
    }
writeFileSync(
  "docs/evidence/combination-engine-examples.json",
  JSON.stringify(
    {
      validation:
        "integration only; unmodified engine output; public demo inputs",
      runs,
      cases: Object.fromEntries(found),
    },
    null,
    2,
  ),
);
console.log(JSON.stringify({ runs, cases: [...found.keys()] }));
