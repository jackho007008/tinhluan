import { beforeAll, it, expect } from "vitest";
import { calculate, type ChartSnapshot } from "../lib/tuvi-engine";
import { catalog } from "../lib/interpretation-rules/catalog";
import { executeRules } from "../lib/interpretation-rules/execute";
import { readPath } from "../lib/interpretation-rules/schema";
import { createTemplate, narrateClaims } from "../lib/reports/interpretation";
import pending from "../fixtures/chart-comparison/awaiting-vn.json";
let base: ChartSnapshot;
beforeAll(async () => {
  base = await calculate(pending.birth);
});
// Synthetic software fixture only. Edited placements are NOT validated astrological charts.
function fixture() {
  const s = structuredClone(base);
  for (const p of s.chart.palaces) {
    p.majorStars = [];
    p.isBodyPalace = false;
  }
  s.chart.palaces.find((p) => p.name === "Mệnh")!.isBodyPalace = true;
  return s;
}
const stars = (s: ChartSnapshot, p: string, names: string[]) =>
  (s.chart.palaces.find((x) => x.name === p)!.majorStars = names.map(
    (name) => ({ name, brightness: "Đắc", mutagen: "" }),
  ));
const run = (s: ChartSnapshot) => executeRules(s, catalog, "internal-draft");
const ids = (s: ChartSnapshot) =>
  run(s).previewClaims.flatMap((c) => c.rules.map((r) => r.id));
it.each([
  ["Vũ Khúc", "Mệnh", "reading.wuqu"],
  ["Thiên Phủ", "Mệnh", "reading.tianfu"],
  ["Tử Vi", "Quan Lộc", "reading.ziwei"],
  ["Thiên Tướng", "Quan Lộc", "reading.tianxiang"],
])(
  "gates %s by structured palace; absent and other palace do not match",
  (star, palace, id) => {
    const s = fixture();
    expect(ids(s)).not.toContain(id);
    stars(s, "Tài Bạch", [star]);
    expect(ids(s)).not.toContain(id);
    stars(s, palace, [star]);
    expect(ids(s)).toContain(id);
    const c = run(s).previewClaims.find((c) =>
      c.rules.some((r) => r.id === id),
    )!;
    expect(c.evidencePaths.every((p) => readPath(s, p) !== undefined)).toBe(
      true,
    );
    expect(c.evidencePaths.some((p) => p.endsWith(".majorStars.0.name"))).toBe(
      true,
    );
  },
);
it("body condition distinguishes nonmatch, match and missing/ambiguous data", () => {
  const s = fixture();
  expect(
    run(s).traces.find((t) => t.ruleId === "reading.body-career")?.status,
  ).toBe("condition-false");
  s.chart.palaces.forEach((p) => (p.isBodyPalace = p.name === "Quan Lộc"));
  expect(ids(s)).toContain("reading.body-career");
  s.chart.palaces.find((p) => p.name === "Mệnh")!.isBodyPalace = true;
  expect(
    run(s).traces.find((t) => t.ruleId === "reading.body-career")?.status,
  ).toBe("missing-facts");
});
it("missing star list differs from empty list; partial state blocks dependent context", () => {
  const s = fixture(),
    m = s.chart.palaces.find((p) => p.name === "Mệnh")!;
  expect(run(s).traces.find((t) => t.ruleId === "reading.wuqu")?.status).toBe(
    "condition-false",
  );
  Reflect.deleteProperty(m, "majorStars");
  expect(run(s).traces.find((t) => t.ruleId === "reading.wuqu")?.status).toBe(
    "missing-facts",
  );
  stars(s, "Mệnh", ["Vũ Khúc"]);
  Reflect.deleteProperty(m.majorStars[0], "mutagen");
  expect(ids(s)).toContain("reading.wuqu");
  expect(
    run(s).traces.find((t) => t.ruleId === "context.wuqu-ji")?.status,
  ).toBe("missing-facts");
});
it("switch snapshots is deterministic, no stale claims, no draft publication or report mutation", async () => {
  const a = fixture(),
    b = fixture();
  stars(a, "Mệnh", ["Vũ Khúc", "Thiên Phủ"]);
  const saved = JSON.stringify(a),
    first = run(a);
  expect(ids(a)).toEqual(
    expect.arrayContaining(["reading.wuqu", "reading.tianfu"]),
  );
  expect(ids(b)).not.toContain("reading.wuqu");
  expect(run(a).claimSetHash).toBe(first.claimSetHash);
  expect(JSON.stringify(a)).toBe(saved);
  expect(first.approvedClaims).toEqual([]);
  expect(executeRules(a, catalog).approvedClaims).toEqual([]);
  expect(() => createTemplate(first, ["Tổng quan"])).toThrow();
  await expect(narrateClaims(first)).rejects.toThrow();
});
it("internal drafts obey conflicts, exceptions, retired and synthetic gates", () => {
  const s = fixture();
  stars(s, "Mệnh", ["Vũ Khúc", "Thiên Phủ"]);
  const a = structuredClone(catalog.find((r) => r.id === "reading.wuqu")!),
    b = structuredClone(catalog.find((r) => r.id === "reading.tianfu")!);
  a.conflictsWith = [b.id];
  a.conflictPolicy = "withhold-all";
  expect(executeRules(s, [a, b], "internal-draft").previewClaims).toHaveLength(
    0,
  );
  a.conflictPolicy = "retain-both";
  expect(
    executeRules(s, [a, b], "internal-draft").previewClaims.every(
      (c) => c.unresolvedWith.length === 1,
    ),
  ).toBe(true);
  a.exceptions = [
    { fact: "fact.life-stars", op: "includes", value: "Vũ Khúc" },
  ];
  expect(executeRules(s, [a], "internal-draft").traces[0].status).toBe(
    "exception",
  );
  a.exceptions = [];
  a.status = "retired";
  expect(executeRules(s, [a], "internal-draft").previewClaims).toHaveLength(0);
  a.status = "draft";
  a.origin = "synthetic";
  expect(executeRules(s, [a], "internal-draft").traces[0].status).toBe(
    "synthetic-blocked",
  );
});

it.each([
  ["Tử Vi", "ziwei"],
  ["Thiên Cơ", "tianji"],
  ["Thái Dương", "taiyang"],
  ["Thái Âm", "taiyin"],
  ["Thiên Tướng", "tianxiang"],
  ["Thiên Lương", "tianliang"],
])(
  "overview %s requires that star at Mệnh, not another palace",
  (name, slug) => {
    const s = fixture(),
      id = "reading.overview." + slug;
    expect(ids(s)).not.toContain(id);
    stars(s, "Quan Lộc", [name]);
    expect(ids(s)).not.toContain(id);
    stars(s, "Mệnh", [name]);
    expect(ids(s)).toContain(id);
    expect(executeRules(s, catalog).approvedClaims).toHaveLength(0);
    const c = run(s).previewClaims.find((c) =>
      c.rules.some((r) => r.id === id),
    )!;
    expect(c.evidencePaths.every((p) => readPath(s, p) !== undefined)).toBe(
      true,
    );
  },
);
it("empty major stars is distinct from absent, null, malformed or ambiguous palace", () => {
  const s = fixture(),
    id = "reading.overview.empty",
    m = s.chart.palaces.find((p) => p.name === "Mệnh")!;
  expect(ids(s)).toContain(id);
  stars(s, "Tài Bạch", ["Tử Vi"]);
  expect(ids(s)).toContain(id);
  for (const invalid of [undefined, null, {}, [null], [{ name: "" }]]) {
    Reflect.set(m, "majorStars", invalid);
    expect(run(s).traces.find((t) => t.ruleId === id)?.status).toBe(
      "missing-facts",
    );
  }
  m.majorStars = [];
  s.chart.palaces.push(structuredClone(m));
  expect(run(s).traces.find((t) => t.ruleId === id)?.status).toBe(
    "missing-facts",
  );
});
it("empty and single-star glosses never persist across changed input or combine into a new claim", () => {
  const s = fixture();
  expect(ids(s)).toContain("reading.overview.empty");
  stars(s, "Mệnh", ["Tử Vi", "Thiên Tướng"]);
  const e = run(s);
  expect(ids(s)).not.toContain("reading.overview.empty");
  expect(
    e.previewClaims
      .filter(
        (c) =>
          c.topic === "overview" &&
          c.rules.some((r) => r.kind === "interpretation"),
      )
      .flatMap((c) => c.rules.map((r) => r.id))
      .sort(),
  ).toEqual([
    "reading.overview.tianxiang",
    "reading.overview.ziwei",
    "tanbien.r08",
    "tanbien.r09",
  ]);
  expect(
    e.previewClaims.every((c) =>
      c.rules.every((r) => r.presentation?.contentType !== "combination"),
    ),
  ).toBe(true);
});
