import { beforeAll, expect, it } from "vitest";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import {
  paidBookContexts,
  BOOK_CONTEXT_MAX_BYTES,
} from "../lib/ai/paid-book-context";
import { paidBookKnowledge } from "../lib/ai/paid-book-knowledge";
import { paidLibrary } from "../lib/ai/paid-library";
import { paidFacts } from "../lib/ai/paid-facts";
import { paidInput } from "../lib/ai/paid-input";
import {
  paidInstructions,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v26";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
import { reviewPaidContextUse } from "../lib/ai/paid-context-guide";
let record: any;
beforeAll(async () => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA source contexts",
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
it.each([
  ["Điền Trạch", "Tử Nữ"],
  ["Phụ Mẫu", "Tử Nữ"],
  ["Huynh Đệ", "Nô Bộc"],
])(
  "reuses applicable direct source words for %s as C from %s, without source promotion",
  (target, origin) => {
    const before = JSON.stringify(record),
      book = paidBookKnowledge(record, origin),
      trace = paidBookContexts(record, target);
    expect(trace.items.length).toBeGreaterThan(0);
    expect(trace.items.length).toBeLessThanOrEqual(4);
    expect(
      trace.items.reduce((n, k) => n + Buffer.byteLength(JSON.stringify(k)), 0),
    ).toBeLessThanOrEqual(BOOK_CONTEXT_MAX_BYTES);
    for (const k of trace.items) {
      expect(k).toMatchObject({
        group: "C",
        application: "context",
        subjectPalaces: [origin],
        contextOrigin: { palace: origin, application: "direct" },
      });
      expect(k.id).not.toBe(k.contextOrigin!.knowledgeId);
      const original = [
        ...book,
        ...paidLibrary(paidFacts(record, origin), origin).items,
      ].find((x) => x.id === k.contextOrigin!.knowledgeId);
      if (!original) throw Error("MISSING_ORIGINAL_SOURCE");
      expect(k.selection).toBe(original.selection);
      for (const field of [
        "text",
        "conditions",
        "limits",
        "references",
      ] as const)
        expect(k[field]).toEqual(original[field]);
      expect(k.passage?.kind).not.toBe("foundation");
      expect(k.passage?.kind).not.toBe("method");
    }
    expect(JSON.stringify(record)).toBe(before);
  },
);
it("additional book context cannot masquerade as a focused target reading without target A/B", () => {
  const i = paidInput(record, "Phụ Mẫu"),
    link = i.contextGuide!.links[0],
    raw = mockPaidV2(i, "focused").raw as any;
  i.knowledge = i.knowledge.filter((k) => k.application !== "direct");
  raw.sections = [0, 1].map((n) => ({
    id: "context" + n,
    role: "context",
    title: "BẢN MOCK",
    paragraphs: [
      {
        text: "BẢN MOCK. Tử Nữ là cung gốc của lời này.",
        basis: "source-interpretation",
        factIds: link.factIds,
        knowledgeIds: [link.sourceKnowledgeIds[0]],
      },
    ],
  }));
  expect(() => validatePaidNarration(raw, i, PAID_PROMPT_CURRENT)).toThrow(
    "AI_COVERAGE_UNSUPPORTED",
  );
});
it.each([
  "Tật Ách",
  "Nô Bộc",
  "Tử Nữ",
  "Phu Thê",
  "Tài Bạch",
  "Quan Lộc",
])(
  "does not broaden book contexts outside the approved target list: %s",
  (target) => {
    expect(paidBookContexts(record, target).items).toEqual([]);
  },
);
it.each([
  ["Điền Trạch", "Tử Nữ"],
  ["Phụ Mẫu", "Tử Nữ"],
  ["Huynh Đệ", "Nô Bộc"],
  ["Thiên Di", "Phúc Đức"],
])(
  "%s gets a source-grounded guide and context paragraphs retain %s",
  (target, origin) => {
    const i = paidInput(record, target),
      link = i.contextGuide!.links[0],
      raw = mockPaidV2(i, "limited").raw as any;
    expect(link.sourcePalace).toBe(origin);
    expect(link.factIds.every((id) => i.facts.some((f) => f.id === id))).toBe(
      true,
    );
    if (target === "Phụ Mẫu" || target === "Điền Trạch") {
      expect(link.factIds).toContain("natal.Lộc");
      expect(i.facts.find((f) => f.id === "natal.Lộc")!.text).toContain(
        "tại Nô Bộc (",
      );
    }
    raw.sections.push({
      id: "context",
      role: "context",
      title: "Ngữ cảnh MOCK",
      paragraphs: [
        {
          text: `BẢN MOCK. Tại ${origin}, nguồn giữ chủ thể riêng khi đọc cạnh ${target}.`,
          basis: "ai-synthesis",
          factIds: link.factIds,
          knowledgeIds: [
            link.sourceKnowledgeIds[0],
            link.targetKnowledgeIds[0],
          ],
        },
      ],
    });
    expect(() =>
      validatePaidNarration(raw, i, PAID_PROMPT_CURRENT),
    ).not.toThrow();
    expect(reviewPaidContextUse(i, raw)).toEqual([]);
    raw.sections[1].paragraphs[0].text = "BẢN MOCK. Chỉ nói cung mục tiêu.";
    expect(() => validatePaidNarration(raw, i, PAID_PROMPT_CURRENT)).toThrow(
      "AI_CONTEXT_AS_DIRECT",
    );
    expect(paidInstructions(i, PAID_PROMPT_CURRENT)).toContain(
      "Nguồn C không thành kết luận trực tiếp",
    );
  },
);
