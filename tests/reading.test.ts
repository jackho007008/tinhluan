import { beforeAll, expect, it } from "vitest";
import { calculate } from "../lib/tuvi-engine";
import { buildReport, type ReportData } from "../lib/reports";
import { customerReport } from "../lib/reading/customer";
import { internalPreview } from "../lib/internal-review/preview";
import {
  validKey,
  issueReviewSession,
  reviewAuthorized,
} from "../lib/internal-review/auth";
import pending from "../fixtures/chart-comparison/awaiting-vn.json";
let report: ReportData;
beforeAll(async () => {
  report = await buildReport(await calculate(pending.birth), {
    groups: ["Tổng quan", "Sự nghiệp & tài lộc", "Sức khỏe"],
    year: null,
  });
});
it("customer projection excludes raw technical data and internal drafts", () => {
  const r = customerReport(report),
    text = JSON.stringify(r);
  for (const term of [
    "snapshot",
    "isBodyPalace",
    "evidencePaths",
    "not-approved",
    "ruleSetHash",
    "reading.wuqu",
  ])
    expect(text).not.toContain(term);
  expect(r.topics).toHaveLength(2);
  expect(r.unsupported).toContain("Sức khỏe");
  expect(r.topics.every((t) => t.claims.length === 0)).toBe(true);
});
it("missing star labels are unknown, not absence; saved report remains unchanged", () => {
  const copy = structuredClone(report),
    p = copy.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
  p.majorStars[0].mutagen = "";
  p.majorStars[0].brightness = "";
  const before = JSON.stringify(copy);
  const r = customerReport(copy);
  expect(r.topics[0].stars[0]).toMatchObject({
    state: null,
    transformation: null,
  });
  internalPreview(copy);
  expect(JSON.stringify(copy)).toBe(before);
});
it("legacy report and ambiguous palaces do not manufacture claims or facts", () => {
  const copy = structuredClone(report);
  delete copy.interpretation;
  expect(customerReport(copy).topics[0].claims).toEqual([]);
  copy.snapshot.chart.palaces.push(
    structuredClone(
      copy.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!,
    ),
  );
  expect(customerReport(copy).topics.map((t) => t.id)).not.toContain(
    "overview",
  );
});
it("synthetic presentation fixture gates five notes; never claims expert approval", () => {
  // Deliberately synthetic layout fixture, NOT independent engine validation.
  const copy = structuredClone(report),
    p = copy.snapshot.chart.palaces;
  const m = p.find((p) => p.name === "Mệnh")!,
    q = p.find((p) => p.name === "Quan Lộc")!;
  p.forEach((p) => (p.isBodyPalace = false));
  q.isBodyPalace = true;
  m.earthlyBranch = "Tý";
  q.earthlyBranch = "Thìn";
  const base = m.majorStars[0];
  m.majorStars = [
    { ...base, name: "Vũ Khúc", brightness: "Vượng", mutagen: "Kỵ" },
    { ...base, name: "Thiên Phủ", brightness: "Miếu", mutagen: "" },
  ];
  q.majorStars = [
    { ...base, name: "Tử Vi", brightness: "Đắc", mutagen: "Quyền" },
    { ...base, name: "Thiên Tướng", brightness: "Đắc", mutagen: "" },
  ];
  const before = JSON.stringify(copy),
    preview = internalPreview(copy);
  expect(preview.execution.publication).toBe("internal-draft");
  expect(preview.notes.filter((n) => n.id.startsWith("reading."))).toHaveLength(
    5,
  );
  expect(preview.reviewer).toBeNull();
  expect(preview.status).toBe("draft");
  expect(JSON.stringify(copy)).toBe(before);
  m.majorStars = [];
  q.majorStars = [];
  q.isBodyPalace = false;
  expect(
    internalPreview(copy).notes.filter((n) =>
      [
        "reading.wuqu",
        "reading.tianfu",
        "reading.ziwei",
        "reading.tianxiang",
        "reading.body-career",
      ].includes(n.id),
    ),
  ).toHaveLength(0);
  expect(
    internalPreview(copy)
      .topics[1].adjustments.map((c) => c.text)
      .join(" "),
  ).not.toContain("nhàn cung");
});
it("internal session rejects malformed, expired, tampered and customer tokens", () => {
  const original = process.env.INTERNAL_REVIEW_KEY;
  try {
    process.env.INTERNAL_REVIEW_KEY = "test-only-secret-".repeat(4);
    const now = Date.now(),
      token = issueReviewSession(now);
    expect(validKey("wrong")).toBe(false);
    expect(validKey(process.env.INTERNAL_REVIEW_KEY)).toBe(true);
    expect(reviewAuthorized(token, now)).toBe(true);
    expect(reviewAuthorized(token, now + 3600000)).toBe(false);
    expect(reviewAuthorized(token + "x", now)).toBe(false);
    expect(reviewAuthorized("customer-session", now)).toBe(false);
    process.env.INTERNAL_REVIEW_KEY = "";
    expect(reviewAuthorized(token, now)).toBe(false);
  } finally {
    if (original === undefined) delete process.env.INTERNAL_REVIEW_KEY;
    else process.env.INTERNAL_REVIEW_KEY = original;
  }
});

it("customer fact display explicitly distinguishes empty and missing major-star lists", () => {
  const copy = structuredClone(report),
    m = copy.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
  m.majorStars = [];
  expect(customerReport(copy).topics[0].majorStarsStatus).toBe("empty");
  Reflect.deleteProperty(m, "majorStars");
  expect(customerReport(copy).topics[0].majorStarsStatus).toBe("missing");
  expect(
    internalPreview(copy).notes.some((n) => n.id === "reading.overview.empty"),
  ).toBe(false);
});

it("partial overview coverage names the star still awaiting content without inferring a combination", () => {
  const copy = structuredClone(report),
    m = copy.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
  m.majorStars = [{ name: "Tử Vi" }, { name: "Tham Lang" }];
  const t = internalPreview(copy).topics.find((t) => t.id === "overview")!;
  expect(t.notes.map((n) => n.id)).toEqual([
    "reading.overview.ziwei",
    "tanbien.r08",
  ]);
  expect(t.unexplainedStars).toEqual(["Tham Lang"]);
});
