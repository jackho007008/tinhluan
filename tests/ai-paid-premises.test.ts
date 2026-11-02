import { beforeAll, afterEach, expect, it, vi } from "vitest";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { paidInput } from "../lib/ai/paid-input";
import { paidKnowledge } from "../lib/ai/paid-retrieval";
import {
  paidContextGuide,
  reviewPaidContextUse,
} from "../lib/ai/paid-context-guide";
import {
  validatePaidNarration,
  paidInstructions,
  PAID_PALACES,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT as V26 } from "../lib/ai/paid-prompt-v26";
import { PAID_PROMPT_CURRENT as V25 } from "../lib/ai/paid-prompt-v25";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
let record: any;
beforeAll(async () => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA premises",
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
afterEach(() => vi.unstubAllGlobals());
it.each(PAID_PALACES)(
  "new writer accepts an appropriately anchored technical mock for %s",
  (target) => {
    const input = paidInput(record, target),
      raw = mockPaidV2(input, "limited").raw;
    expect(() => validatePaidNarration(raw, input, V26)).not.toThrow();
  },
);
it.each([
  ["Nô Bộc", "Huynh Đệ", "opposition", "geometry.xung-chieu"],
  ["Tử Nữ", "Phụ Mẫu", "trine", "geometry.tam-hop"],
])(
  "builds a condition-backed guide for %s without moving natal Lộc",
  (target, source, relation, geometry) => {
    const before = JSON.stringify(record),
      i = paidInput(record, target),
      link = i.contextGuide!.links[0];
    expect(link).toMatchObject({ sourcePalace: source, relation });
    expect(link.factIds).toContain(geometry);
    expect(link.factIds).toContain("natal.Lộc");
    expect(i.facts.find((f) => f.id === "natal.Lộc")!.text).toContain(
      "tại Nô Bộc (",
    );
    expect(
      link.sourceKnowledgeIds.every((id) =>
        i.knowledge.some(
          (k) =>
            k.id === id &&
            k.group === "C" &&
            k.subjectPalaces?.includes(source),
        ),
      ),
    ).toBe(true);
    expect(link.factIds.every((id) => i.facts.some((f) => f.id === id))).toBe(
      true,
    );
    expect(JSON.stringify(record)).toBe(before);
    const raw = mockPaidV2(i, "limited").raw as any;
    raw.sections.push({
      id: "context",
      role: "context",
      title: "Ngữ cảnh — MOCK",
      paragraphs: [
        {
          text: `BẢN MOCK. Tại ${source}, lời có cung gốc riêng; đọc cạnh ${target} giữ hai chủ thể, không phán đời sống thật.`,
          basis: "ai-synthesis",
          factIds: link.factIds,
          knowledgeIds: [
            link.sourceKnowledgeIds[0],
            link.targetKnowledgeIds[0],
          ],
        },
      ],
    });
    expect(() => validatePaidNarration(raw, i, V26)).not.toThrow();
    expect(reviewPaidContextUse(i, raw)).toEqual([]);
  },
);
it("never invents a family context guide without a direct premise or a valid C source", () => {
  const i = paidInput(record, "Tử Nữ"),
    meta = paidKnowledge(record, "Tử Nữ").contextMetadata;
  expect(
    paidContextGuide(
      { ...i, knowledge: i.knowledge.filter((k) => k.group !== "C") },
      meta,
    ),
  ).toBeUndefined();
  expect(
    paidContextGuide(
      {
        ...i,
        knowledge: i.knowledge.filter((k) => k.application !== "direct"),
      },
      meta,
    ),
  ).toBeUndefined();
  const damaged = structuredClone(i);
  damaged.facts = damaged.facts.filter((f) => f.id !== "natal.Lộc");
  expect(paidContextGuide(damaged, meta)).toBeUndefined();
});
it.each(["source-interpretation", "ai-synthesis"])(
  "2.6 requires the actual applicability anchor for %s, not a convenient target star",
  (basis) => {
    const i = paidInput(record, "Tử Nữ"),
      k = i.knowledge.find(
        (k) => k.id === "paid-book.thp1-130-tu-from-no-loc",
      )!;
    const raw = mockPaidV2(i, "limited").raw as any,
      p = raw.sections[0].paragraphs[0];
    expect(k.anchorFactIds).toEqual(["natal.Lộc"]);
    p.knowledgeIds = [k.id];
    p.basis = basis;
    p.factIds = [
      i.facts.find(
        (f) =>
          f.provenance?.palace === "Tử Nữ" &&
          f.provenance.verification === "source-traced",
      )!.id,
    ];
    expect(() => validatePaidNarration(raw, i, V26)).toThrow(
      "AI_REFERENCE_SCOPE",
    );
    expect(() => validatePaidNarration(raw, i, V25)).not.toThrow(); // frozen prior validator
    p.factIds.push("natal.Lộc");
    expect(() => validatePaidNarration(raw, i, V26)).not.toThrow();
    k.anchorFactIds = ["missing"];
    expect(() => validatePaidNarration(raw, i, V26)).toThrow(
      "AI_REFERENCE_SCOPE",
    );
    k.anchorFactIds = [];
    expect(() => validatePaidNarration(raw, i, V26)).toThrow(
      "AI_REFERENCE_SCOPE",
    );
  },
);
it("2.6 keeps C origins, attribution, temporal and medical restrictions", () => {
  const i = paidInput(record, "Tử Nữ"),
    link = i.contextGuide!.links[0],
    raw = mockPaidV2(i, "limited").raw as any;
  raw.sections[0].paragraphs[0] = {
    text: "BẢN MOCK. Chỉ lời về con.",
    basis: "ai-synthesis",
    factIds: link.factIds,
    knowledgeIds: [...link.sourceKnowledgeIds, ...link.targetKnowledgeIds],
  };
  expect(() => validatePaidNarration(raw, i, V26)).toThrow(
    "AI_CONTEXT_AS_DIRECT",
  );
  raw.sections[0].paragraphs[0].text =
    "BẢN MOCK. Phụ Mẫu và Tử Nữ giữ vai riêng.";
  expect(() => validatePaidNarration(raw, i, V26)).not.toThrow();
  raw.coverageNote = "Bạn mắc bệnh tim.";
  expect(() => validatePaidNarration(raw, i, V26)).toThrow(
    "AI_SCOPE_VIOLATION",
  );
  expect(paidInstructions(i, V26)).toContain("anchorFactIds");
  expect(paidInstructions(i, V25)).not.toContain("LẬP LUẬN TỪ TIỀN ĐỀ");
});
