import { expect, it } from "vitest";
import saved from "../exports/demo-wuqu-tianfu-review.json";
import type { ChartSnapshot } from "../lib/tuvi-engine";
import { catalog } from "../lib/interpretation-rules/catalog";
import { tanBienRules as selectRules } from "../lib/interpretation-rules/profile-rules";
const tanBienRules = catalog.filter(r=>r.id.startsWith("tanbien."));
import { executeRules } from "../lib/interpretation-rules/execute";
import {
  ruleEvidence,
  factEvidence,
  palaceGeometry,
  readingContext,
  familyScope,
} from "../lib/internal-review/tanbien-presentation";
import { buildTanBienReading } from "../lib/internal-review/tanbien-reading";
import { loadSample } from "../lib/internal-review/samples";
import { readPath } from "../lib/interpretation-rules/schema";
const base = () => structuredClone(saved.snapshot) as unknown as ChartSnapshot;
const p = (s: ChartSnapshot, n: string) =>
  s.chart.palaces.find((p) => p.name === n)!;
it("R06 formatter uses the actual branch and one major star, not the group code", () => {
  const s = base();
  const r = tanBienRules.find((r) => r.id === "tanbien.r06")!;
  const e = ruleEvidence(s, r);
  expect(e.facts.map((f) => f.text)).toContain("Tài Bạch tại Thân.");
  expect(e.facts.map((f) => f.text)).toContain(
    "Tài Bạch có một chính tinh là Liêm Trinh.",
  );
  expect(e.conditions.join(" ")).toContain("Dần hoặc Thân");
  expect(e.conditions.join(" ")).toContain("phụ tinh không làm mất");
  expect(
    JSON.stringify({
      facts: e.facts.map((f) => f.text),
      conditions: e.conditions,
    }),
  ).not.toMatch(/dan-than|fact\.|chart\.|\[\\"Liêm Trinh/);
  // Synthetic mutation for presentation only, not an engine chart.
  p(s, "Tài Bạch").earthlyBranch = "Dần";
  expect(factEvidence(s, "fact.wealth-branch-group").text).toBe(
    "Tài Bạch tại Dần.",
  );
  delete (p(s, "Tài Bạch") as Partial<ReturnType<typeof p>>).earthlyBranch;
  expect(factEvidence(s, "fact.wealth-branch-group").text).toContain(
    "Chưa có dữ liệu xác định",
  );
});
it("missing star lists differ from recorded empty lists; scope metadata is not invented", () => {
  const s = base();
  p(s, "Tài Bạch").majorStars = [];
  expect(factEvidence(s, "fact.wealth-major-count").text).toContain(
    "được ghi rỗng",
  );
  delete (p(s, "Tài Bạch") as Partial<ReturnType<typeof p>>).majorStars;
  expect(factEvidence(s, "fact.wealth-major-count").text).toContain(
    "Chưa có dữ liệu xác định",
  );
  delete (p(s, "Mệnh").majorStars[0] as { scope?: string }).scope;
  expect(factEvidence(s, "fact.life-wuqu-origin-mutagen").text).toContain(
    "Chưa đủ bằng chứng nhất quán",
  );
  expect(
    readingContext(s, "action").items.some((i) =>
      i.text.includes("Vũ Khúc tại Mệnh chưa lưu lớp áp dụng"),
    ),
  ).toBe(true);
});
it("geometry follows branch distance, not array index; partial or ambiguous charts do not infer relations", () => {
  const s = base();
  expect(palaceGeometry(s, "Mệnh", "Quan Lộc")?.text).toContain("tam hợp");
  expect(palaceGeometry(s, "Mệnh", "Thiên Di")?.text).toContain("đối cung");
  expect(palaceGeometry(s, "Mệnh", "Phụ Mẫu")).toBeUndefined();
  s.chart.palaces.reverse();
  expect(palaceGeometry(s, "Mệnh", "Tài Bạch")?.text).toContain("tam hợp");
  s.chart.palaces.pop();
  expect(palaceGeometry(s, "Mệnh", "Tài Bạch")).toBeUndefined();
  const duplicate = base();
  duplicate.chart.palaces[0].earthlyBranch =
    duplicate.chart.palaces[1].earthlyBranch;
  expect(palaceGeometry(duplicate, "Mệnh", "Tài Bạch")).toBeUndefined();
});
it("context records actual Tuần and Triệt without extending their placement or adding an effect", () => {
  const s = base();
  const finance = readingContext(s, "finance");
  expect(finance.items.map((i) => i.text)).toContain(
    "Tài Bạch ghi nhận Tuần Không.",
  );
  expect(finance.items.map((i) => i.text)).toContain(
    "Thiên Di ghi nhận Triệt Lộ.",
  );
  expect(
    finance.items.some((i) => i.text === "Mệnh ghi nhận Tuần Không."),
  ).toBe(false);
  expect(finance.items.map((i) => i.text).join(" ")).not.toMatch(
    /mất Lộc|tiền bạc bị chặn|làm giàu/,
  );
  for (const i of finance.items)
    for (const path of i.paths) expect(readPath(s, path)).not.toBeUndefined();
  expect(finance.unresolved).toContain("chưa tổng hợp");
});
it("formatting and context leave matching, input snapshot, and rule catalog unchanged", () => {
  const s = base();
  const before = JSON.stringify(s);
  const rules = JSON.stringify(tanBienRules);
  const old = executeRules(s, selectRules(s), "internal-draft");
  for (const r of tanBienRules) ruleEvidence(s, r);
  const reading = buildTanBienReading(s);
  expect(reading.execution).toEqual(old);
  expect(JSON.stringify(s)).toBe(before);
  expect(JSON.stringify(tanBienRules)).toBe(rules);
  expect(
    reading.sections
      .flatMap((s) => s.claims)
      .map((c) => c.text)
      .sort(),
  ).toEqual(old.previewClaims.map((c) => c.text).sort());
  expect(executeRules(s, tanBienRules, "customer").approvedClaims).toHaveLength(
    0,
  );
});
it("four real engine-input samples render only their supported sections and preserve trace identity", async () => {
  for (const [id, expected] of [
    ["vn-12", ["tanbien.r03", "tanbien.r08", "tanbien.finance-vu-thin-tuat"]],
    ["vn-20", ["tanbien.r01", "tanbien.r04", "tanbien.r37", "tanbien.r43"]],
    ["vn-2", ["tanbien.finance-nhat-luong-mao"]],
  ] as const) {
    const loaded = (await loadSample(id))!;
    expect(loaded.sample.kind).toBe("engine");
    const s = loaded.report.snapshot;
    const r = buildTanBienReading(s);
    expect(
      r.sections
        .flatMap((s) => s.claims.flatMap((c) => c.rules.map((r) => r.id)))
        .sort(),
    ).toEqual([...expected].sort());
    expect(r.snapshotId).toBe(s.resultId);
    if (id === "vn-2") {
      expect(r.lifeMajorNotice).toContain("Chưa có diễn giải cho trường hợp Mệnh không có chính tinh này");
      expect(r.sections.find(s=>s.id==="finance")!.claims[0].rules[0].id).toBe("tanbien.finance-nhat-luong-mao");
    }
  }
  const missing = base();
  delete (p(missing, "Mệnh") as Partial<ReturnType<typeof p>>).majorStars;
  expect(familyScope(missing)).toBe("unknown");
  expect(
    buildTanBienReading(missing).unknown.some(
      (t) => t.ruleId === "tanbien.r01" && t.status === "missing-facts",
    ),
  ).toBe(true);
});
