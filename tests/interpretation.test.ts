import { beforeAll, describe, it, expect } from "vitest";
import { calculate, type ChartSnapshot } from "../lib/tuvi-engine";
import {
  ruleSchema,
  readPath,
  type Rule,
} from "../lib/interpretation-rules/schema";
import { deriveFacts } from "../lib/interpretation-rules/derived";
import { catalog } from "../lib/interpretation-rules/catalog";
import { executeRules } from "../lib/interpretation-rules/execute";
import {
  buildInterpretation,
  createTemplate,
  narrateClaims,
} from "../lib/reports/interpretation";
import { compareChart, fixtureSchema } from "../lib/chart-comparison";
import pending from "../fixtures/chart-comparison/awaiting-vn.json";
let snapshot: ChartSnapshot;
beforeAll(async () => {
  snapshot = await calculate(pending.birth);
});
// Synthetic approval exists ONLY here; no reviewer is claimed to be a real expert.
const synthetic = (patch: Partial<Rule> = {}): Rule =>
  ruleSchema.parse({
    ...catalog[0],
    id: "test.rule-a",
    origin: "synthetic",
    status: "approved",
    review: {
      reviewer: "TEST_ONLY_NOT_A_PERSON",
      reviewedOn: "2026-10-07",
      recordUrl: "https://example.invalid/test-only",
      scope: "Synthetic execution tests only",
    },
    claimTemplate: "Synthetic {{fact.life-location}}",
    ...patch,
  });
const run = (rules: unknown[]) => executeRules(snapshot, rules, "test");
describe("rule pipeline", () => {
  it("six factual derivations, no personal predictions", () => {
    const f = deriveFacts(snapshot);
    expect(
      f.filter((f) =>
        [
          "fact.life-location",
          "fact.body-location",
          "fact.life-stars",
          "fact.life-state",
          "fact.career-location",
          "fact.career-stars",
        ].includes(f.id),
      ),
    ).toHaveLength(6);
    expect(
      f.every((f) =>
        f.evidencePaths.every((p) => readPath(snapshot, p) !== undefined),
      ),
    ).toBe(true);
  });
  it("evaluates matching condition and renders allowed placeholders", () => {
    const r = run([synthetic()]);
    expect(r.approvedClaims).toHaveLength(1);
    expect(r.approvedClaims[0].text).toContain("Mệnh tại Ngọ");
  });
  it("false condition", () =>
    expect(
      run([
        synthetic({
          conditions: [
            { fact: "fact.life-location", op: "eq", value: "No match" },
          ],
        }),
      ]).traces[0].status,
    ).toBe("condition-false"));
  it("exception", () =>
    expect(
      run([
        synthetic({
          exceptions: [{ fact: "fact.life-location", op: "exists" }],
        }),
      ]).traces[0].status,
    ).toBe("exception"));
  it("missing data and ambiguous palace do not become negative facts", () => {
    const s = structuredClone(snapshot);
    s.chart.palaces = s.chart.palaces.filter((p) => p.name !== "Mệnh");
    expect(executeRules(s, [synthetic()], "test").traces[0].status).toBe(
      "missing-facts",
    );
  });
  it("wrong profile", () =>
    expect(
      run([synthetic({ requiredEngineProfile: ["cn-reference"] })]).traces[0]
        .status,
    ).toBe("wrong-profile"));
  it.each(["draft", "reviewed", "retired"] as const)("blocks %s", (status) => {
    expect(run([synthetic({ status })]).approvedClaims).toHaveLength(0);
  });
  it("bad schema and review record", () => {
    expect(run([{ ...synthetic(), confidence: 0.99 }]).traces[0].status).toBe(
      "invalid-schema",
    );
    expect(() => synthetic({ review: null })).toThrow();
  });
  it("unknown operator and code reject without execution", () => {
    expect(
      run([
        {
          ...synthetic(),
          conditions: [
            { fact: "fact.life-location", op: "eval", value: "process.exit()" },
          ],
        },
      ]).traces[0].status,
    ).toBe("invalid-schema");
  });
  it("missing evidence and prototype paths rejected", () => {
    expect(
      run([synthetic({ evidencePaths: ["chart.missing"] })]).traces[0].status,
    ).toBe("missing-evidence");
    expect(() =>
      synthetic({ evidencePaths: ["chart.__proto__.constructor"] }),
    ).toThrow();
  });
  it("exceptions cannot bypass missing facts, pending rights cannot publish", () => {
    expect(() =>
      synthetic({ exceptions: [{ fact: "unknown", op: "exists" }] }),
    ).toThrow();
    expect(
      run([
        synthetic({
          sourceReferences: catalog[0].sourceReferences.map((s) => ({
            ...s,
            rights: "pending",
          })),
        }),
      ]).traces[0].status,
    ).toBe("rights-pending");
  });
  it("deduplicates and retains both source rule versions", () => {
    const r = run([synthetic(), synthetic({ id: "test.rule-b" })]);
    expect(r.approvedClaims).toHaveLength(1);
    expect(r.approvedClaims[0].rules).toHaveLength(2);
  });
  it("retains opposing claims without selecting nicer text", () => {
    const r = run([
      synthetic({ conflictGroup: "test.direction" }),
      synthetic({
        id: "test.rule-b",
        claimTemplate: "Opposite synthetic",
        conflictGroup: "test.direction",
      }),
    ]);
    expect(r.approvedClaims).toHaveLength(2);
    expect(r.approvedClaims.every((c) => c.unresolvedWith.length === 1)).toBe(
      true,
    );
  });
  it("explicit conflict IDs withhold all, including transitive conflict partners", () => {
    const r = run([
      synthetic({
        conflictsWith: ["test.rule-b"],
        conflictPolicy: "withhold-all",
      }),
      synthetic({
        id: "test.rule-b",
        claimTemplate: "B",
        conflictsWith: ["test.rule-c"],
      }),
      synthetic({ id: "test.rule-c", claimTemplate: "C" }),
    ]);
    expect(r.approvedClaims).toHaveLength(0);
    expect(
      r.traces.filter((t) => t.status === "conflict-withheld"),
    ).toHaveLength(3);
  });
  it("duplicate rule IDs do not select order-dependent versions", () =>
    expect(
      run([synthetic(), synthetic({ version: "2.0.0" })]).approvedClaims,
    ).toHaveLength(0));
  it("synthetic rules cannot publish even if marked approved", () => {
    expect(executeRules(snapshot, [synthetic()]).traces[0].status).toBe(
      "synthetic-blocked",
    );
    expect(() => createTemplate(run([synthetic()]), ["Tổng quan"])).toThrow(
      "SYNTHETIC_REPORT_BLOCKED",
    );
  });
  it("all catalog rules unapproved, exact counts honest; drafts never returned in customer report", () => {
    expect(catalog.filter((r) => r.kind === "fact")).toHaveLength(9);
    expect(catalog.filter((r) => r.kind === "interpretation")).toHaveLength(566); // +32 source-scoped natal completion branches. // 1.44 adds exactly M05/M07; P2 adds two source-specified local branches; current-only count, historical expectations unchanged. P1 adds exactly three independent NPL foundation methods; historical expectations unchanged. // +7 direct-void branches, source specification 1.36. // 454 baseline 1.32 + 56 specified Phu Thê/Tử Nữ branches; no approvals.
    expect(catalog.find(r=>r.id === "tanbien.career-quyen-position")).toMatchObject({status:"draft",review:null,version:"0.1.0"});
    expect(catalog.find(r=>r.id === "tanbien.life-empty-mui-sun-moon-opposite")).toMatchObject({status:"draft",review:null});
    expect(catalog.filter((r) => r.status === "approved")).toHaveLength(0);
    const r = buildInterpretation(snapshot, [
      "Tổng quan",
      "Sự nghiệp & tài lộc",
    ]);
    expect(r.approvedClaims).toHaveLength(0);
    expect(r.topics).toHaveLength(2);
    expect(JSON.stringify(r)).not.toContain("Bản thảo đọc nguồn");
    expect(JSON.stringify(r)).not.toContain("Bản thảo phương pháp");
  });
  it("same snapshot/catalog deterministic, scope respected, delivered object detached", () => {
    const a = buildInterpretation(snapshot, ["Tổng quan"]);
    const saved = JSON.stringify(a);
    expect(buildInterpretation(snapshot, ["Tổng quan"])).toEqual(a);
    expect(a.topics).toHaveLength(1);
    const old = catalog[0].version;
    try {
      catalog[0].version = "9.0.0";
      const b = buildInterpretation(snapshot, ["Tổng quan"]);
      expect(b.ruleSetHash).not.toBe(a.ruleSetHash);
      expect(JSON.stringify(a)).toBe(saved);
    } finally {
      catalog[0].version = old;
    }
  });
  it("AI fallback rejects same citations with invented meaning and failures", async () => {
    const e = run([synthetic()]);
    await expect(narrateClaims(e)).rejects.toThrow();
    const customer = { ...e, publication: "customer" };
    const expected = await narrateClaims(customer);
    expect(
      await narrateClaims(customer, {
        generate: async (c) => [
          { claimIds: [c[0].id], text: "Invented prediction" },
        ],
      }),
    ).toEqual(expected);
    expect(
      await narrateClaims(customer, {
        generate: async () => {
          throw Error();
        },
      }),
    ).toEqual(expected);
  });
});
describe("independent comparison intake", () => {
  it("empty pending source cannot be claimed as validated", () => {
    expect(compareChart(pending, snapshot)).toMatchObject({
      status: "awaiting-source",
      expertConfirmed: false,
    });
    expect(() =>
      fixtureSchema.parse({
        ...pending,
        expected: [
          {
            path: "chart.soul",
            expected: "made up",
            resolution: { status: "unresolved", note: "test" },
          },
        ],
      }),
    ).toThrow();
  });
  const fixture = () => ({
    ...pending,
    id: "test.synthetic-comparison",
    status: "synthetic",
    source: {
      title: "Synthetic unit example",
      reference: "test only",
      location: "this test",
      rights: "test",
      comparedOn: "2026-10-07",
      confirmedBy: null,
      confirmationRecord: null,
      confirmedScope: ["chart.soul"],
    },
    expected: [
      {
        path: "chart.soul",
        expected: "deliberate mismatch",
        resolution: {
          status: "unresolved",
          note: "Do not change engine to match",
        },
      },
    ],
  });
  it("reports mismatch; never manufactures approval", () => {
    expect(compareChart(fixture(), snapshot)).toMatchObject({
      status: "differences",
      expertConfirmed: false,
      passed: 0,
    });
  });
  it("requires identical birth/profile; evidence coverage must match declared fields", () => {
    expect(
      compareChart(
        { ...fixture(), birth: { ...pending.birth, hour: 9 } },
        snapshot,
      ).status,
    ).toBe("input-or-profile-mismatch");
    expect(() =>
      fixtureSchema.parse({
        ...fixture(),
        source: { ...fixture().source, confirmedScope: [] },
      }),
    ).toThrow();
  });
  it("compares only supplied fields; matching synthetic data not independent", () => {
    const f = fixture();
    f.expected[0].expected = snapshot.chart.soul;
    const r = compareChart(f, snapshot);
    expect(r.status).toBe("matched");
    expect(r.expertConfirmed).toBe(false);
  });
});
