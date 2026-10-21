import { it, expect } from "vitest";
import fs from "node:fs";
import { linhIsolation } from "../lib/internal-review/linh-isolation";
import { compareLinh } from "../lib/internal-review/linh-trial";
import { executeRules } from "../lib/interpretation-rules/execute";
import { catalog } from "../lib/interpretation-rules/catalog";
import { deriveFacts } from "../lib/interpretation-rules/derived";
const rows = JSON.parse(
  fs.readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
).rows;
rows.push(
  JSON.parse(
    fs.readFileSync(
      "lib/internal-review/engine-samples/linh-trial.json",
      "utf8",
    ),
  ),
);
const fixtures = linhIsolation(rows);
const prefix = "combination.ziwei-assistants";
const run = (s: any) => executeRules(s, catalog, "internal-draft");
it("engine entry fails three prerequisites; existing Kình keeps recorded", () => {
  const r = compareLinh(rows.find((r: any) => r.id === "linh-entry").snapshot);
  expect(r.status).toBe("compared");
  if (r.status !== "compared") return;
  for (const t of r.dependentRules) {
    expect(t.before.status).toBe("condition-false");
    expect(t.after.status).toBe("condition-false");
    expect(t.before.details.map((x) => JSON.parse(x).value)).toEqual([
      "Tử Vi",
      "Tả Phù",
      "Hữu Bật",
    ]);
  }
  expect(
    r.factChanges.find((f) => f.id === "fact.life-local-sat"),
  ).toMatchObject({
    before: { value: "recorded" },
    after: { value: "recorded" },
  });
});
it.each([
  [
    "enter",
    "none-recorded",
    "recorded",
    ["matched", "condition-false"],
    ["exception", "matched"],
  ],
  [
    "leave",
    "recorded",
    "none-recorded",
    ["exception", "matched"],
    ["matched", "condition-false"],
  ],
] as const)(
  "isolated Linh %s follows explicit condition/exception, text and ID change separately",
  (mode, b, a, before, after) => {
    const s = fixtures.find((r) => r.id === `technical-linh-${mode}`)!.snapshot;
    const saved = JSON.stringify(s);
    const r = compareLinh(s);
    expect(JSON.stringify(s)).toBe(saved);
    expect(r.status).toBe("compared");
    if (r.status !== "compared") return;
    expect(
      r.factChanges.find((f) => f.id === "fact.life-local-sat"),
    ).toMatchObject({ before: { value: b }, after: { value: a } });
    expect(r.dependentRules.map((t) => t.before.status)).toEqual(before);
    expect(r.dependentRules.map((t) => t.after.status)).toEqual(after);
    const removed = r.claimsRemoved.filter((c) =>
        c.rules.some((r) => r.id.startsWith(prefix)),
      ),
      added = r.claimsAdded.filter((c) =>
        c.rules.some((r) => r.id.startsWith(prefix)),
      );
    expect(removed).toHaveLength(1);
    expect(added).toHaveLength(1);
    expect(added[0].text).not.toBe(removed[0].text);
    expect(added[0].id).not.toBe(removed[0].id);
  },
);
it("missing is not absence; empty lacks assistants; Phá Quân remains an independent exception", () => {
  const missing = fixtures.find((r) => r.id.endsWith("missing"))!.snapshot;
  expect(deriveFacts(missing).some((f) => f.id === "fact.life-local-sat")).toBe(
    false,
  );
  expect(
    run(missing)
      .traces.filter((t) => t.ruleId.startsWith(prefix))
      .map((t) => t.status),
  ).toEqual(["missing-facts", "missing-facts"]);
  const empty = fixtures.find((r) => r.id.endsWith("empty"))!.snapshot;
  expect(
    deriveFacts(empty).find((f) => f.id === "fact.life-local-sat")?.value,
  ).toBe("none-recorded");
  expect(
    run(empty)
      .traces.filter((t) => t.ruleId.startsWith(prefix))
      .map((t) => t.status),
  ).toEqual(["condition-false", "condition-false"]);
  const s = structuredClone(fixtures[1].snapshot);
  s.chart.palaces
    .find((p) => p.name === "Mệnh")!
    .majorStars.push({ name: "Phá Quân" });
  expect(
    run(s)
      .traces.filter((t) => t.ruleId.startsWith(prefix))
      .map((t) => t.status),
  ).toEqual(["exception", "exception"]);
});
it("documents current structural limit: an unmarked truncated array is indistinguishable from a complete one", () => {
  const s = structuredClone(fixtures[0].snapshot); // Deliberately synthetically truncated, not engine data.
  expect(run(s).traces.find((t) => t.ruleId === prefix)?.status).toBe(
    "matched",
  );
  const life = s.chart.palaces.find((p) => p.name === "Mệnh")!;
  life.minorStars.push({ name: "" });
  expect(deriveFacts(s).some((f) => f.id === "fact.life-local-sat")).toBe(
    false,
  );
});
