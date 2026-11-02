import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { beforeAll, expect, it } from "vitest";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { paidInput } from "../lib/ai/paid-input";
import { paidLibrary } from "../lib/ai/paid-library";
import { paidKnowledge } from "../lib/ai/paid-retrieval";
import { paidContextGuide } from "../lib/ai/paid-context-guide";
import { paidUserInput, validatePaidNarration } from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v26";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
let record: any;
const webId = "paid-library.dl-hao-opposition-method";
beforeAll(async () => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA web method",
    date: "1992-08-07",
    hour: 16,
    minute: 0,
    gender: "male",
    calendar: "solar",
    timezone: "Asia/Ho_Chi_Minh",
    profile: "tanbien-vn-trial-v2",
    place: "Không ghi",
    unknownTime: false,
    consent: true,
  });
  record = { snapshot, receipt, frozen: freezeReading(snapshot, receipt) };
});
it("new Tài input keeps both stored Hao locations as method-only, never a direct money claim", () => {
  const before = JSON.stringify(record),
    i = paidInput(record, "Tài Bạch");
  const k = i.knowledge.find((k) => k.id === webId)!;
  for (const id of [
    "npl226-tai-speech",
    "tb41-tai-hao-scope",
    "thp2-tai-liem-than-trine",
    "thp2-tai-transaction-spending",
  ])
    expect(i.knowledge.some((k) => k.id === "paid-library." + id)).toBe(true);
  expect(i.knowledge.some((k) => k.id === "paid-method.inherited-NPL-27")).toBe(
    true,
  );
  const library = paidLibrary(i, "Tài Bạch");
  expect(library.items.length).toBeLessThanOrEqual(5);
  expect(
    library.items.reduce((n, k) => n + Buffer.byteLength(JSON.stringify(k)), 0),
  ).toBeLessThanOrEqual(14000);
  expect(k).toMatchObject({
    group: "D",
    application: "reference-only",
    passage: { kind: "method" },
  });
  const anchors = k.passage!.anchorFactIds.map(
    (id) => i.facts.find((f) => f.id === id)!,
  );
  expect(anchors).toHaveLength(2);
  expect(anchors).toContainEqual(
    expect.objectContaining({
      provenance: expect.objectContaining({
        palace: "Tài Bạch",
        field: "boshi12",
        relation: "target",
      }),
    }),
  );
  expect(anchors).toContainEqual(
    expect.objectContaining({
      provenance: expect.objectContaining({
        palace: "Phúc Đức",
        field: "boshi12",
        relation: "opposition",
      }),
    }),
  );
  expect(JSON.parse(paidUserInput(i)).knowledge).toContainEqual(k);
  expect(paidUserInput(i)).not.toContain('"webSources"');
  expect(i.knowledge.filter((k) => k.group === "D").length).toBeLessThanOrEqual(
    3,
  );
  expect(JSON.stringify(record)).toBe(before);
  const raw: any = mockPaidV2(i).raw;
  raw.sections[0].paragraphs[0].basis = "source-interpretation";
  raw.sections[0].paragraphs[0].factIds = k.passage!.anchorFactIds;
  raw.sections[0].paragraphs[0].knowledgeIds = [webId];
  expect(() => validatePaidNarration(raw, i, PAID_PROMPT_CURRENT)).toThrow(
    "AI_REFERENCE_SCOPE",
  );
});
it.each(["missing-star", "wrong-relation", "unverified-star", "wrong-ring"])(
  "Hao method is rejected for %s",
  (mode) => {
    const i = paidInput(record, "Tài Bạch");
    const f = i.facts.find(
      (f) =>
        f.provenance?.palace === "Phúc Đức" && f.provenance.field === "boshi12",
    )!;
    if (mode === "missing-star") i.facts = i.facts.filter((x) => x !== f);
    if (mode === "wrong-relation") f.provenance!.relation = "adjacent";
    if (mode === "unverified-star")
      f.provenance!.verification = "upstream-unverified";
    if (mode === "wrong-ring") f.provenance!.field = "suiqian12";
    expect(paidLibrary(i, "Tài Bạch").items.some((k) => k.id === webId)).toBe(
      false,
    );
  },
);
it("Phu guide uses verified opposition to Quan, keeps both source scopes and no Mệnh geometry invented", () => {
  const i = paidInput(record, "Phu Thê"),
    link = i.contextGuide!.links[0];
  expect(i.contextGuide!.links).toHaveLength(1);
  expect(link).toMatchObject({
    sourcePalace: "Quan Lộc",
    relation: "opposition",
  });
  expect(link.factIds).toContain("geometry.xung-chieu");
  expect(
    link.sourceKnowledgeIds.every((id) =>
      i.knowledge.some(
        (k) =>
          k.id === id &&
          k.group === "C" &&
          k.subjectPalaces?.includes("Quan Lộc"),
      ),
    ),
  ).toBe(true);
  expect(
    link.targetKnowledgeIds.every((id) =>
      i.knowledge.some(
        (k) =>
          k.id === id &&
          k.application === "direct" &&
          k.subjectPalaces?.includes("Phu Thê"),
      ),
    ),
  ).toBe(true);
  const metadata = paidKnowledge(record, "Phu Thê").contextMetadata;
  const absent = structuredClone(i);
  absent.knowledge = absent.knowledge.filter((k) => k.application !== "direct");
  expect(paidContextGuide(absent, metadata)).toBeUndefined();
  const wrong = structuredClone(i);
  wrong.facts.forEach((f) => {
    if (f.provenance?.palace === "Quan Lộc") f.provenance.relation = "adjacent";
  });
  expect(paidContextGuide(wrong, metadata)).toBeUndefined();
});
it.each([
  "valid",
  "changed-hash",
  "changed-url",
  "changed-status",
  "symlink",
  "direct",
  "no-proof",
  "http",
  "oversize",
])("web receipt admission is closed for %s", (mode) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "paid-web-"));
  try {
    const root = path.join(temp, "knowledge"),
      dir = path.join(temp, "web");
    fs.mkdirSync(path.join(root, "paid-passages"), { recursive: true });
    fs.mkdirSync(dir);
    const i = paidInput(record, "Tài Bạch");
    const r: any = {
      schemaVersion: "paid-web-research-receipt-1.0.0",
      id: "technical-web",
      status: "reviewed-method-only",
      url: "https://example.invalid/source",
      title: "Technical evidence",
      locator: "Technical heading",
    };
    if (mode === "changed-status") r.status = "draft";
    const w: any = {
      id: r.id,
      url: r.url,
      title: r.title,
      locator: r.locator,
      sha256: "",
    };
    if (mode === "http") w.url = "http://example.invalid/source";
    if (mode === "changed-url") r.url = "https://example.invalid/other";
    if (mode === "oversize") r.padding = "x".repeat(16001);
    const bytes = JSON.stringify(r);
    w.sha256 = createHash("sha256").update(bytes).digest("hex");
    if (mode === "changed-hash") w.sha256 = "0".repeat(64);
    const file = path.join(dir, r.id + ".json");
    if (mode === "symlink") {
      fs.writeFileSync(path.join(temp, "actual.json"), bytes);
      fs.symlinkSync(path.join(temp, "actual.json"), file);
    } else fs.writeFileSync(file, bytes);
    const u: any = {
      id: "technical-method",
      status: "reviewed",
      title: "Technical method",
      text: "Technical method only; no personal claim.",
      targets: ["Tài Bạch"],
      kind: mode === "direct" ? "direct" : "method",
      requirements: [
        {
          palace: "Tài Bạch",
          any: [{ kind: "star", name: "Đại Hao", field: "boshi12" }],
        },
      ],
      conditions: ["Technical"],
      limits: ["Technical"],
      references: [{ title: w.title, location: w.url }],
      pages: [],
      webSources: [w],
    };
    if (mode === "no-proof") delete u.webSources;
    fs.writeFileSync(
      path.join(root, "paid-passages/index-v114.json"),
      JSON.stringify({ version: "paid-library-1.0.0", units: [u] }),
    );
    const result = paidLibrary(i, "Tài Bạch", root);
    expect(result.items).toHaveLength(mode === "valid" ? 1 : 0);
    if (mode !== "valid") expect(result.excluded.length).toBeGreaterThan(0);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
