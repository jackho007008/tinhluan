import { it, expect } from "vitest";
import { samples, loadSample } from "../lib/internal-review/samples";
import { internalPreview } from "../lib/internal-review/preview";
import { customerReport } from "../lib/reading/customer";
import { executeRules } from "../lib/interpretation-rules/execute";
import { catalog } from "../lib/interpretation-rules/catalog";
it.each(samples)(
  "matrix $id: intentional rule and claim expectations",
  async (sample) => {
    const loaded = (await loadSample(sample.id))!;
    const before = JSON.stringify(loaded.report);
    const p = internalPreview(loaded.report);
    const ids = p.execution.previewClaims.flatMap((c) =>
      c.rules.map((r) => r.id),
    );
    for (const expected of sample.expected) {
      if (expected.outcome === "claim")
        expect(ids, expected.why).toContain(expected.rule);
      else {
        expect(ids, expected.why).not.toContain(expected.rule);
        expect(
          p.execution.traces.find((t) => t.ruleId === expected.rule)?.status,
          expected.why,
        ).toBe(expected.outcome);
      }
    }
    expect(loaded.report.snapshot.profile.id).toBe(sample.input.profile);
    expect(
      executeRules(loaded.report.snapshot, catalog).approvedClaims,
    ).toHaveLength(0);
    expect(
      customerReport(loaded.report).topics.every((t) => t.claims.length === 0),
    ).toBe(true);
    expect(JSON.stringify(loaded.report)).toBe(before);
    if (sample.kind === "synthetic")
      expect(loaded.report.snapshot.resultId).toMatch(/^synthetic:/);
    else expect(loaded.report.snapshot.resultId).not.toMatch(/^synthetic:/);
  },
);
it("A → B → A preserves claims and rejects unknown samples without fallback", async () => {
  const a = (await loadSample("engine-combo"))!,
    b = (await loadSample("engine-partial"))!;
  const first = internalPreview(a.report);
  expect(internalPreview(b.report).notes.map((n) => n.id)).not.toContain(
    "combination.ziwei-assistants",
  );
  expect(internalPreview(a.report).execution.claimSetHash).toBe(
    first.execution.claimSetHash,
  );
  expect(await loadSample("not-a-sample")).toBeNull();
});
