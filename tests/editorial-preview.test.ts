import { expect, it } from "vitest";
import data from "../lib/internal-review/editorial/demo-wuqu-tianfu.json";
import original from "../exports/demo-wuqu-tianfu-review.json";
it("pins editorial preview to the existing DEMO without changing or claiming rule approval", () => {
  expect(data.editionId).toBe(original.identity.demoEditionId);
  expect(data.snapshotSha256).toBe(original.integrity.snapshotSha256);
  expect(data.oldReadingSha256).toBe(original.integrity.readingSha256);
  expect(data.snapshotResultId).toBe(original.snapshot.resultId);
  expect(data.status).toBe("draft");
  expect(data.reviewer).toBeNull();
  expect(data.articles.flatMap((a) => a.paragraphs)).toHaveLength(21);
});
it("every paragraph reference resolves to a document evidence record; prose is retained", () => {
  const known = new Set(data.records.flatMap((r) => r.codes));
  for (const p of data.articles.flatMap((a) => a.paragraphs)) {
    for (const ref of p.references)
      expect(known.has(ref), `${p.id}: ${ref}`).toBe(true);
    expect(p.text).toBe(p.originalText.replace(/\s*\[[^\]]+\]/g, "").trim());
  }
  expect(
    data.differences.some((b) =>
      b.text?.includes("Không tự kết luận nguồn nào đúng hơn"),
    ),
  ).toBe(true);
});
