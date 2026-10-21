// Public demonstration inputs. Outputs demonstrate integration, NOT independent engine validation.
import { calculate } from "../lib/tuvi-engine";
import { buildReport } from "../lib/reports";
import { internalPreview } from "../lib/internal-review/preview";
import { writeFileSync } from "node:fs";
const examples = [];
for (let hour = 0; hour < 24; hour += 2) {
  const input = {
    date: "2000-08-16",
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
  const snapshot = await calculate(input),
    report = await buildReport(snapshot, { groups: ["Tổng quan"], year: null });
  const before = JSON.stringify(report),
    p = internalPreview(report),
    topic = p.topics.find((t) => t.id === "overview")!;
  if (JSON.stringify(report) !== before) throw Error("REPORT_MUTATED");
  examples.push({
    label: "Đầu vào demo công khai, không phải người dùng",
    input,
    resultId: snapshot.resultId,
    engine: snapshot.versions.engine,
    contentVersion: p.contentVersion,
    summary: topic.summary,
    majorStars: snapshot.chart.palaces
      .find((p) => p.name === "Mệnh")!
      .majorStars.map((s) => s.name),
    notes: topic.notes.map((n) => ({
      id: n.id,
      claimId: n.claimId,
      text: n.text,
    })),
    trace: p.execution.traces.filter((t) =>
      p.execution.rules.some(
        (r) =>
          r.id === t.ruleId &&
          r.topic === "overview" &&
          r.kind === "interpretation",
      ),
    ),
  });
}
writeFileSync(
  "docs/evidence/overview-engine-examples.json",
  JSON.stringify(
    {
      validation:
        "engine-generated integration examples; not expert or independent goldens",
      examples,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    examples.map((e) => ({
      hour: e.input.hour,
      summary: e.summary,
      rules: e.notes.map((n) => n.id),
    })),
    null,
    2,
  ),
);
