import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { paidLibrary } from "../lib/ai/paid-library";
import {
  validatePaidNarration,
  paidInstructions,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v23";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
import type { MenhInput } from "../lib/ai/contract";
let temp: string, root: string, units: any[], input: MenhInput;
const sha = (x: string) => createHash("sha256").update(x).digest("hex");
const write = () =>
  fs.writeFileSync(
    path.join(root, "paid-passages/index.json"),
    JSON.stringify({ version: "paid-library-1.0.0", units }),
  );
beforeEach(() => {
  vi.stubGlobal("fetch", () => {
    throw Error("NO_NETWORK_IN_MOCK");
  });
  temp = fs.mkdtempSync(path.join(os.tmpdir(), "paid-library-"));
  root = path.join(temp, "knowledge");
  fs.mkdirSync(path.join(root, "paid-passages"), { recursive: true });
  fs.mkdirSync(path.join(temp, "books/npl/pages"), { recursive: true });
  fs.writeFileSync(
    path.join(temp, "books/npl/pages/0226.txt"),
    "TECHNICAL SOURCE FIXTURE, not a real astrological claim.",
  );
  input = {
    version: "paid-facts-1.1.0",
    knowledgeVersion: "paid-retrieval-1.5.0",
    paidTarget: { palace: "Tài Bạch", edition: "paid-palaces-ai-1.0.0" },
    missing: [],
    knowledge: [],
    facts: [
      {
        id: "f",
        kind: "engine",
        text: "Tài Bạch tại Thân: Thái Tuế; trường suiqian12",
        paths: ["p.1"],
        provenance: {
          palace: "Tài Bạch",
          relation: "target",
          field: "suiqian12",
          scope: "natal",
          verification: "source-traced",
          source: "fixture",
        },
      },
    ],
  };
  units = [
    {
      id: "speech",
      status: "reviewed",
      title: "Nguồn kỹ thuật",
      text: "Nghĩa nền về cách diễn đạt; không lời dự báo tiền bạc.",
      targets: ["Tài Bạch"],
      kind: "foundation",
      requirements: [
        {
          palace: "Tài Bạch",
          any: [{ kind: "star", name: "Thái Tuế", field: "suiqian12" }],
        },
      ],
      conditions: ["Ngữ cảnh biểu đạt, chỉ tự đối chiếu."],
      limits: ["Không suy thu nhập."],
      references: [{ title: "Nguồn fixture", location: "Vị trí kỹ thuật" }],
      pages: [
        {
          book: "npl",
          number: 226,
          layer: "text",
          sha256: sha(
            "TECHNICAL SOURCE FIXTURE, not a real astrological claim.",
          ),
        },
      ],
    },
  ];
  write();
});
afterEach(() => {
  fs.rmSync(temp, { recursive: true, force: true });
  vi.unstubAllGlobals();
});
it("loads only a reviewed, hash-verified topic passage with the exact natal anchor", () => {
  const before = JSON.stringify(input),
    k = paidLibrary(input, "Tài Bạch", root).items[0];
  expect(k).toMatchObject({
    application: "reference-only",
    passage: { kind: "foundation", anchorFactIds: ["f"] },
  });
  expect(paidLibrary(input, "Phu Thê", root).items).toEqual([]);
  expect(JSON.stringify(input)).toBe(before);
  input.facts[0].provenance!.relation = "opposition";
  input.facts[0].provenance!.palace = "Quan Lộc";
  expect(paidLibrary(input, "Tài Bạch", root).items).toEqual([]);
});
it.each(["engine-reported", "source-conflict", "upstream-unverified"] as const)(
  "never interprets %s anchors",
  (verification) => {
    input.facts[0].provenance!.verification = verification;
    expect(paidLibrary(input, "Tài Bạch", root).excluded[0].reason).toBe(
      "condition-not-met",
    );
  },
);
it("does not infer an AND requirement from one member or merge different requirements at the same palace", () => {
  units[0].requirements.push({
    palace: "Tài Bạch",
    any: [{ kind: "star", name: "Bát Tọa", field: "minorStars" }],
  });
  write();
  expect(paidLibrary(input, "Tài Bạch", root).items).toEqual([]);
  units[0].requirements.pop();
  units[0].requirements[0].any.unshift({
    kind: "star",
    name: "Other",
    field: "minorStars",
  });
  write();
  expect(paidLibrary(input, "Tài Bạch", root).items).toHaveLength(1);
});
it("birth transformations cannot be replaced by self/flow transformations or a similarly named star", () => {
  units[0].requirements = [
    { palace: "Tài Bạch", any: [{ kind: "natal", name: "Lộc" }] },
  ];
  write();
  input.facts.push({
    id: "self.Lộc",
    kind: "engine",
    text: "Tứ Hóa: Lộc, tại Tài Bạch (Thân).",
    paths: [],
  });
  expect(paidLibrary(input, "Tài Bạch", root).items).toEqual([]);
  input.facts.push({
    id: "natal.Lộc",
    kind: "engine",
    text: "Tứ Hóa năm sinh: hóa Lộc, tại Tài Bạch (Thân).",
    paths: [],
  });
  expect(paidLibrary(input, "Tài Bạch", root).items).toHaveLength(1);
});
it("fails closed on missing/private index, changed source, draft, templates and unsafe page names", () => {
  fs.writeFileSync(path.join(temp, "books/npl/pages/0226.txt"), "changed");
  expect(paidLibrary(input, "Tài Bạch", root).excluded[0].reason).toBe(
    "missing-or-changed-source-page",
  );
  units[0].status = "draft";
  write();
  expect(paidLibrary(input, "Tài Bạch", root).excluded[0].reason).toBe(
    "not-reviewed",
  );
  units[0].status = "reviewed";
  units[0].text = "{{unresolved}}";
  write();
  expect(paidLibrary(input, "Tài Bạch", root).excluded[0].reason).toBe(
    "unresolved-template",
  );
  units[0].pages[0].book = "../../secret";
  write();
  expect(paidLibrary(input, "Tài Bạch", root).items).toEqual([]);
  fs.unlinkSync(path.join(root, "paid-passages/index.json"));
  expect(paidLibrary(input, "Tài Bạch", root).items).toEqual([]);
});
it("budgets the library, deduplicates exact text and replaces only when new passage survives verification", () => {
  units[0].replaces = ["paid-book.old"];
  units.push({ ...units[0], id: "duplicate" });
  write();
  expect(paidLibrary(input, "Tài Bạch", root).items).toHaveLength(1);
  expect(paidLibrary(input, "Tài Bạch", root).replacements).toHaveLength(1);
  units = Array.from({ length: 8 }, (_, i) => ({
    ...units[0],
    id: "s" + i,
    text: units[0].text + i,
  }));
  write();
  expect(paidLibrary(input, "Tài Bạch", root).items).toHaveLength(4);
  fs.writeFileSync(path.join(temp, "books/npl/pages/0226.txt"), "bad");
  expect(paidLibrary(input, "Tài Bạch", root).replacements).toEqual([]);
});
it("2.3 allows limited synthesis anchored in reviewed background without direct V1; 2.2 stays strict", () => {
  input.knowledge = paidLibrary(input, "Tài Bạch", root).items;
  const r = mockPaidV2(input, "limited").raw as any;
  r.coverage = "limited";
  r.coverageNote = "BẢN MOCK nghĩa nền giới hạn";
  r.sections = [
    {
      id: "background",
      role: "analysis",
      title: "Tự đối chiếu — MOCK",
      paragraphs: [],
    },
  ];
  r.sections[0].paragraphs = [
    {
      text: "BẢN MOCK: một góc biểu đạt để tự đối chiếu, chưa phải kết quả tiền bạc.",
      basis: "ai-synthesis",
      factIds: ["f"],
      knowledgeIds: [input.knowledge[0].id],
    },
  ];
  expect(validatePaidNarration(r, input, PAID_PROMPT_CURRENT)).toMatchObject({
    coverage: "limited",
  });
  expect(() =>
    validatePaidNarration(r, input, "paid-palaces-vietnamese-2.2.0"),
  ).toThrow("AI_REFERENCE_SCOPE");
  r.coverage = "focused";
  r.sections.push({ ...r.sections[0], id: "another" });
  expect(() => validatePaidNarration(r, input, PAID_PROMPT_CURRENT)).toThrow(
    "AI_COVERAGE_UNSUPPORTED",
  );
  r.coverage = "limited";
  r.sections.pop();
  r.sections[0].paragraphs[0].basis = "source-interpretation";
  expect(() => validatePaidNarration(r, input, PAID_PROMPT_CURRENT)).toThrow(
    "AI_REFERENCE_SCOPE",
  );
  r.sections[0].paragraphs[0].basis = "ai-synthesis";
  input.knowledge[0].passage!.anchorFactIds = ["missing"];
  expect(() => validatePaidNarration(r, input, PAID_PROMPT_CURRENT)).toThrow(
    "AI_REFERENCE_SCOPE",
  );
});
it("2.3 prompt permits grounded synthesis without a verbatim full-combination rule, retaining safety", () => {
  const p = paidInstructions(input, PAID_PROMPT_CURRENT);
  expect(p).toContain("Không đòi sách có nguyên văn");
  expect(p).toContain("không tự tạo quy tắc thắng/thua");
  expect(p).toContain("không chẩn đoán");
  expect(
    paidInstructions(input, "paid-palaces-vietnamese-2.2.0"),
  ).not.toContain("Không đòi sách có nguyên văn");
});

it("library facts stay attached even when a direct V1 thesis is present, and new synthesis keeps medical/C guards", () => {
  input.knowledge = paidLibrary(input, "Tài Bạch", root).items;
  const k = input.knowledge[0];
  input.facts.push({ ...input.facts[0], id: "other" });
  input.knowledge.push({
    ...k,
    id: "direct",
    application: "direct",
    passage: undefined,
  });
  const r = mockPaidV2(input, "limited").raw as any;
  r.sections[0].paragraphs = [
    {
      text: "BẢN MOCK tổng hợp có giới hạn.",
      basis: "ai-synthesis",
      factIds: ["other"],
      knowledgeIds: [k.id, "direct"],
    },
  ];
  expect(() => validatePaidNarration(r, input, PAID_PROMPT_CURRENT)).toThrow(
    "AI_REFERENCE_SCOPE",
  );
  r.sections[0].paragraphs[0].factIds = ["f"];
  r.coverageNote = "Bạn mắc bệnh tim.";
  expect(() => validatePaidNarration(r, input, PAID_PROMPT_CURRENT)).toThrow(
    "AI_SCOPE_VIOLATION",
  );
  r.coverageNote = "BẢN MOCK";
  r.limitations = ["Không chẩn đoán bệnh, không điều trị."];
  expect(() =>
    validatePaidNarration(r, input, PAID_PROMPT_CURRENT),
  ).not.toThrow();
  input.knowledge.push({
    ...k,
    id: "c",
    group: "C",
    application: "context",
    subjectPalaces: ["Quan Lộc"],
    passage: undefined,
  });
  r.sections[0].paragraphs[0].knowledgeIds.push("c");
  expect(() => validatePaidNarration(r, input, PAID_PROMPT_CURRENT)).toThrow(
    "AI_CONTEXT_AS_DIRECT",
  );
});
