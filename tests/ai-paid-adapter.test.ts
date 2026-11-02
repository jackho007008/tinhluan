import { beforeAll, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { paidInput } from "../lib/ai/paid-input";
import { paidKnowledge } from "../lib/ai/paid-retrieval";
import {
  paidInstructions,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { mockPaidGeneration } from "./fixtures/ai-paid-mock";
let record: any;
beforeAll(async () => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA adapter",
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
  record = {
    id: "00000000-0000-4000-8000-000000000033",
    createdAt: new Date().toISOString(),
    snapshot,
    receipt,
    frozen: freezeReading(snapshot, receipt),
  };
});
it.each([
  ["Quan Lộc", "Bạch Hổ", "Tấu Thư"],
  ["Tài Bạch", "Đại Hao", "Thái Tuế", "Chỉ Bối"],
  ["Phu Thê", "Quan Phù", "Tang Môn", "Nguyệt Sát"],
])("stored rings are present at correct palace: %s", (...args) => {
  const [target, ...stars] = args;
  const before = JSON.stringify(record.snapshot);
  const input = paidInput(record, target);
  for (const star of stars) {
    const f = input.facts.find(
      (f) =>
        f.text.startsWith(target + " tại ") &&
        f.text.includes(": " + star + ";"),
    );
    expect(f, star).toBeDefined();
    expect(f!.provenance?.palace).toBe(target);
    expect(f!.provenance?.relation).toBe("target");
    expect(
      f!.paths.some((p) => /\.boshi12$|\.suiqian12$|\.jiangqian12$/.test(p)),
    ).toBe(true);
  }
  expect(JSON.stringify(record.snapshot)).toBe(before);
});
it("keeps checked rings, inherited rings and Trường Sinh distinct; no invented brightness", () => {
  const i = paidInput(record, "Tài Bạch");
  const at = (field: string) =>
    i.facts.find(
      (f) =>
        f.provenance?.palace === "Tài Bạch" && f.provenance?.field === field,
    )!;
  expect(at("boshi12").provenance?.verification).toBe("source-traced");
  expect(at("boshi12").text).toContain("Đại Hao");
  expect(at("jiangqian12").provenance?.verification).toBe(
    "upstream-unverified",
  );
  expect(at("jiangqian12").text).not.toContain("trạng thái đã lưu");
  expect(at("changsheng12").provenance?.verification).toBe("source-conflict");
  expect(at("changsheng12").text).toContain("không phải độ sáng");
});
it("preserves target/trine/opposition/other positions instead of moving stars", () => {
  const q = paidInput(record, "Quan Lộc"),
    p = paidInput(record, "Phu Thê");
  const star = (i: any) =>
    i.facts.find((f: any) => f.text.startsWith("Quan Lộc tại Thìn: Tử Vi;"));
  expect(star(q).provenance.relation).toBe("target");
  expect(star(p).provenance.relation).toBe("opposition");
  expect(star(p).provenance.palace).toBe("Quan Lộc");
});
it("direct retrieval includes Bạch Hổ–Tấu Thư, excludes shared property topic, and separates methods", () => {
  const q = paidInput(record, "Quan Lộc");
  expect(
    q.knowledge.some(
      (k) => k.application === "direct" && k.text.includes("Bạch Hổ–Tấu Thư"),
    ),
  ).toBe(true);
  const t = paidInput(record, "Tài Bạch");
  expect(
    t.knowledge.some(
      (k) =>
        k.application === "direct" &&
        k.provenance?.ruleIds.includes("tanbien.dien-void-co-cu"),
    ),
  ).toBe(false);
  expect(
    t.knowledge
      .filter((k) => k.group === "D")
      .every((k) => k.application === "reference-only"),
  ).toBe(true);
  expect(t.knowledge.some((k) => k.group === "C")).toBe(true);
  const r = structuredClone(record);
  const sec = r.frozen.customerReport.sections.find(
    (s: any) => s.id === "natal-palace-4",
  );
  const duplicate = structuredClone(sec.paragraphs[0]);
  duplicate.id = "qa-distinct-provenance";
  duplicate.members[0].claim.rules[0].sourceReferences[0].title =
    "QA alternate provenance marker (not a book)";
  sec.paragraphs.push(duplicate);
  const sameText = paidKnowledge(r, "Quan Lộc").items.filter(
    (k) => k.text === duplicate.text,
  );
  expect(sameText).toHaveLength(2);
  expect(
    sameText.some((k) =>
      k.references.some(
        (x) => x.title === "QA alternate provenance marker (not a book)",
      ),
    ),
  ).toBe(true);
});
it("never promotes unresolved templates or false predicates to direct knowledge", () => {
  const r = structuredClone(record);
  const p = r.frozen.customerReport.sections.find(
    (s: any) => s.id === "natal-palace-4",
  ).paragraphs[0];
  p.text = "Unresolved {{missing}}";
  expect(
    paidKnowledge(r, "Quan Lộc").excluded.some(
      (x) => x.id === p.id && x.reason === "unresolved-template",
    ),
  ).toBe(true);
  p.text = "Source text without placeholders";
  p.members[0].claim.rules[0].presentation.sourceConditions = [
    "{{unresolved-source-condition}}",
  ];
  expect(
    paidKnowledge(r, "Quan Lộc").items.some((k) => k.id === "paid-v1." + p.id),
  ).toBe(false);
  p.members[0].claim.rules[0].presentation.sourceConditions = [
    "Original applicability retained",
  ];
  p.text = "Wrong branch must be withheld";
  const rule = p.members[0].claim.rules[0];
  rule.conditions[0] = {
    ...rule.conditions[0],
    op: "eq",
    value: "__no_match__",
  };
  expect(
    paidKnowledge(r, "Quan Lộc").items.some((k) => k.id === "paid-v1." + p.id),
  ).toBe(false);
});
it("rejects mismatched snapshot and a method cited as direct source interpretation", () => {
  const r = structuredClone(record);
  r.snapshot.chart.palaces[0].earthlyBranch = "Tý";
  expect(() => paidInput(r, "Quan Lộc")).toThrow("AI_UNVERIFIED_SNAPSHOT");
  const i = paidInput(record, "Quan Lộc");
  i.knowledge.push({
    id: "method-only",
    title: "method",
    text: "method",
    conditions: [],
    limits: [],
    references: [],
    selection: "background-method",
    group: "D",
    application: "reference-only",
  });
  const raw: any = mockPaidGeneration(i).raw;
  raw.sections[0].basis = "source-interpretation";
  raw.sections[0].knowledgeIds = ["method-only"];
  expect(() => validatePaidNarration(raw, i)).toThrow("AI_UNKNOWN_REFERENCE");
});
it("keeps old prompt versions addressable and specializes every paid topic", () => {
  const i = paidInput(record, "Quan Lộc");
  expect(
    createHash("sha256")
      .update(paidInstructions(i, "paid-palaces-vietnamese-1.0.1"))
      .digest("hex"),
  ).toBe("fa108c93fccbdaf7efc425683b45a575dd4cf8643c8ec8eecaf0512d1e652618");
  expect(paidInstructions(i, "paid-palaces-vietnamese-1.0.1")).toContain(
    "Phiên bản paid-palaces-vietnamese-1.0.1.",
  );
  expect(paidInstructions(i)).toContain(
    "Cách làm việc, tổ chức và trách nhiệm",
  );
  expect(paidInstructions(paidInput(record, "Phu Thê"))).toContain(
    "Xu hướng tương tác",
  );
  expect(paidInstructions(paidInput(record, "Tật Ách"))).toContain(
    "Không chẩn đoán bệnh",
  );
});
it("selects existing source-specific methods as reference-only, never promotes Hao or Hổ–Tấu to a new direct claim", () => {
  const t = paidInput(record, "Tài Bạch"),
    q = paidInput(record, "Quan Lộc"),
    p = paidInput(record, "Phu Thê");
  expect(t.knowledgeVersion).toBe("paid-retrieval-1.8.0");
  expect(
    t.knowledge.find((k) => k.id === "paid-method.inherited-NPL-27"),
  ).toMatchObject({
    group: "D",
    application: "reference-only",
    subjectPalaces: [],
  });
  expect(
    q.knowledge.find((k) => k.id === "paid-method.inherited-NPL-33"),
  ).toMatchObject({ group: "D", application: "reference-only" });
  expect(
    p.knowledge.some((k) =>
      [
        "paid-method.inherited-NPL-27",
        "paid-method.inherited-NPL-33",
      ].includes(k.id),
    ),
  ).toBe(false);
  expect(p.knowledge.find(k => k.id === "paid-method.inherited-NPL-45")).toMatchObject({group:"D",application:"reference-only"});
  expect(t.knowledge.filter((k) => k.group === "D")).toHaveLength(3);
});
it.each(["Quan Lộc", "Tài Bạch", "Phu Thê"])(
  "selects context from useful related palaces on a real stored shape without enlarging C: %s",
  (palace) => {
    const before = JSON.stringify(record);
    const result = paidKnowledge(record, palace),
      c = result.items.filter((k) => k.group === "C");
    const expected =
      palace === "Quan Lộc"
        ? ["Mệnh", "Tài Bạch", "Phu Thê"]
        : palace === "Tài Bạch"
          ? ["Mệnh", "Quan Lộc", "Phúc Đức"]
          : ["Quan Lộc", "Phúc Đức", "Thiên Di"];
    expect(c.length).toBeLessThanOrEqual(8);
    expect(new Set(c.flatMap((k) => k.subjectPalaces || []))).toEqual(
      new Set(expected),
    );
    expect(result.contextSelection.usedBytes).toBeLessThanOrEqual(
      result.contextSelection.byteBudget,
    );
    expect(c.every((k) => k.application === "context")).toBe(true);
    expect(JSON.stringify(record)).toBe(before);
  },
);
