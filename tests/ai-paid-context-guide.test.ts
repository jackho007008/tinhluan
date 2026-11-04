import { beforeAll, it, expect } from "vitest";
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
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
import {
  paidInstructions,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v22";
import { PAID_PROMPT_CURRENT as OLD } from "../lib/ai/paid-prompt-v21";
let record: any;
beforeAll(async () => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA ngữ cảnh",
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
it.each(["Quan Lộc", "Tài Bạch"])(
  "guide for %s joins existing C to direct foundations with real geometry",
  (palace) => {
    const before = JSON.stringify(record),
      i = paidInput(record, palace),
      guide = i.contextGuide!;
    expect(guide.links).toHaveLength(palace === "Tài Bạch" ? 3 : 2);
    expect(guide.links[0].sourcePalace).toBe(
      palace === "Quan Lộc" ? "Tài Bạch" : "Quan Lộc",
    );
    expect(guide.links[0].factIds).toContain("natal.Quyền");
    if (palace === "Tài Bạch") {
      expect(guide.links[0].factIds).toContain("palace.2.ring.boshi12");
      expect(guide.links[0].factIds).toContain("palace.2.ring.suiqian12");
    }
    for (const link of guide.links) {
      expect(link.relation).toBe(
        link.sourcePalace === "Phúc Đức" ? "opposition" : "trine",
      );
      expect(link.factIds).toContain(
        link.sourcePalace === "Phúc Đức"
          ? "geometry.xung-chieu"
          : "geometry.tam-hop",
      );
      expect(link.factIds.every((id) => i.facts.some((f) => f.id === id))).toBe(
        true,
      );
      expect(
        link.sourceKnowledgeIds.every((id) =>
          i.knowledge.some(
            (k) =>
              k.id === id &&
              k.group === "C" &&
              k.subjectPalaces?.includes(link.sourcePalace),
          ),
        ),
      ).toBe(true);
      expect(
        link.targetKnowledgeIds.every((id) =>
          i.knowledge.some((k) => k.id === id && k.application === "direct"),
        ),
      ).toBe(true);
    }
    expect(JSON.stringify(guide).length).toBeLessThan(5500);
    expect(JSON.stringify(record)).toBe(before);
    const raw = mockPaidV2(i, "limited").raw as any;
    expect(reviewPaidContextUse(i, raw)).toHaveLength(guide.links.length);
    const link = guide.links[0];
    raw.sections.push({
      id: "cross-palace",
      role: "context",
      title: "Liên hệ có giới hạn",
      paragraphs: [
        {
          text: `BẢN MOCK. Tại ${link.sourcePalace}, lời nguồn thuộc cung gốc; đối chiếu hai phương diện, không bảo đảm kết quả cho nhau.`,
          basis: "ai-synthesis",
          factIds: link.factIds,
          knowledgeIds: [
            link.sourceKnowledgeIds[0],
            link.targetKnowledgeIds[0],
          ],
        },
      ],
    });
    expect(validatePaidNarration(raw, i, PAID_PROMPT_CURRENT)).toMatchObject({
      coverage: "limited",
    });
    expect(reviewPaidContextUse(i, raw)).toEqual([]); // one useful link suffices; no all-C quota
  },
);
it("does not manufacture a guide without C, direct foundations or verified relation", () => {
  const i = paidInput(record, "Quan Lộc");
  const metadata = paidKnowledge(record, "Quan Lộc").contextMetadata;
  expect(paidContextGuide(i, metadata)).toBeDefined();
  expect(
    paidContextGuide(
      { ...i, knowledge: i.knowledge.filter((k) => k.group !== "C") },
      metadata,
    ),
  ).toBeUndefined();
  expect(
    paidContextGuide(
      {
        ...i,
        knowledge: i.knowledge.filter((k) => k.application !== "direct"),
      },
      metadata,
    ),
  ).toBeUndefined();
  const wrong = structuredClone(i);
  wrong.facts = wrong.facts.map((f) =>
    f.provenance
      ? { ...f, provenance: { ...f.provenance, relation: "adjacent" } }
      : f,
  );
  expect(paidContextGuide(wrong, metadata)).toBeUndefined();
  expect(
    paidContextGuide(
      i,
      new Map(
        [...metadata].map(([id, m]) => [id, { ...m, types: ["method-gloss"] }]),
      ),
    ),
  ).toBeUndefined();
});
it.each(["Quan Lộc", "Tài Bạch"])(
  "%s guide prioritizes useful action/thought context without changing source conditions or the knowledge budget",
  (palace) => {
    const input = paidInput(record, palace);
    const metadata = paidKnowledge(record, palace).contextMetadata;
    const before = JSON.stringify(input.knowledge);
    const guide = paidContextGuide(input, metadata)!;
    const link = guide.links.find((l) => l.sourcePalace === "Mệnh")!;
    expect(guide.version).toBe("paid-context-guide-1.3.0");
    expect(link.sourceKnowledgeIds.length).toBeGreaterThan(0);
    expect(link.sourceKnowledgeIds.length).toBeLessThanOrEqual(3);
    expect(link.sourceKnowledgeIds).toContain("paid-v1.natal-paragraph-0-3");
    expect(link.sourceKnowledgeIds).not.toContain(
      "paid-v1.natal-paragraph-0-1",
    );
    expect(
      link.sourceKnowledgeIds.every((id) =>
        metadata
          .get(id)
          ?.themes.some((theme) =>
            ["initiative", "action", "learning"].includes(theme),
          ),
      ),
    ).toBe(true);
    expect(JSON.stringify(input.knowledge)).toBe(before);
    expect(JSON.stringify(guide).length).toBeLessThan(5500);
    // Missing fine-grained themes do not suppress valid C; ranking uses the
    // supplied source prose because the historical action theme is too broad.
    const noPreferred = new Map(
      [...metadata].map(([id, m]) => [id, { ...m, themes: ["other"] }]),
    );
    const fallback = paidContextGuide(input, noPreferred)!.links.find(
      (l) => l.sourcePalace === "Mệnh",
    )!;
    expect(fallback.sourceKnowledgeIds.length).toBe(
      link.sourceKnowledgeIds.length,
    );
    expect(fallback.sourceKnowledgeIds).toEqual(link.sourceKnowledgeIds);
  },
);
it("new prompt cannot launder unnamed C by mixing a direct source; old version stays addressable", () => {
  const i = paidInput(record, "Quan Lộc"),
    link = i.contextGuide!.links[0],
    raw = mockPaidV2(i, "limited").raw as any;
  raw.sections[0].paragraphs[0] = {
    text: "BẢN MOCK. Đây là một tổng hợp có giới hạn.",
    basis: "ai-synthesis",
    knowledgeIds: [link.sourceKnowledgeIds[0], link.targetKnowledgeIds[0]],
    factIds: link.factIds,
  };
  expect(() => validatePaidNarration(raw, i, OLD)).not.toThrow();
  expect(() => validatePaidNarration(raw, i, PAID_PROMPT_CURRENT)).toThrow(
    "AI_CONTEXT_AS_DIRECT",
  );
  raw.sections[0].paragraphs[0].text =
    "BẢN MOCK. Tại tài bạch, lời nguồn giữ phạm vi riêng, không bảo đảm kết quả công việc.".normalize(
      "NFD",
    );
  expect(() =>
    validatePaidNarration(raw, i, PAID_PROMPT_CURRENT),
  ).not.toThrow();
  expect(reviewPaidContextUse(i, raw)).toEqual([]);
  expect(paidInstructions(i, OLD)).toContain(OLD);
  expect(paidInstructions(i, PAID_PROMPT_CURRENT)).toContain(
    "Không bỏ toàn bộ ngữ cảnh",
  );
});
it.each(["Tài Bạch", "Phu Thê"])(
  "%s links Phúc only with the reviewed method and an existing context premise",
  (palace) => {
    const input = paidInput(record, palace),
      metadata = paidKnowledge(record, palace).contextMetadata;
    const before = JSON.stringify(input);
    const link = paidContextGuide(input, metadata)!.links.find(
      (l) => l.sourcePalace === "Phúc Đức",
    )!;
    expect(link).toBeDefined();
    expect(
      link.sourceKnowledgeIds.every((id) =>
        input.knowledge.some(
          (k) => k.id === id && k.group === "C" && k.application === "context",
        ),
      ),
    ).toBe(true);
    expect(JSON.stringify(input)).toBe(before);
    const noMethod = structuredClone(input);
    noMethod.knowledge = noMethod.knowledge.filter(
      (k) =>
        k.id !==
        `paid-library.thp2-${palace === "Tài Bạch" ? "tai-transaction-spending" : "phu-combination-scope"}`,
    );
    expect(
      paidContextGuide(noMethod, metadata)?.links.some(
        (l) => l.sourcePalace === "Phúc Đức",
      ),
    ).toBe(false);
    const noContext = structuredClone(input);
    noContext.knowledge = noContext.knowledge.filter(
      (k) => !link.sourceKnowledgeIds.includes(k.id),
    );
    expect(
      paidContextGuide(noContext, metadata)?.links.some(
        (l) => l.sourcePalace === "Phúc Đức",
      ),
    ).toBe(false);
  },
);
