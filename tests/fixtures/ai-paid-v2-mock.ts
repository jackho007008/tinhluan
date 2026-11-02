import type { MenhInput } from "../../lib/ai/contract";
import type { Generation } from "../../lib/ai/provider";
import {
  PAID_SCHEMA_V2,
  type PaidReadingV2,
} from "../../lib/ai/paid-reading-v2";
export function mockPaidV2(
  input: MenhInput,
  coverage: PaidReadingV2["coverage"] = "limited",
): Generation {
  const k = input.knowledge.find(
    (k) => ["A", "B"].includes(k.group || "") && k.application === "direct",
  );
  if (!k) coverage = "insufficient";
  const f =
    input.facts.find(
      (f) =>
        f.provenance?.relation === "target" &&
        f.provenance?.verification === "source-traced",
    ) || input.facts[0];
  const anchors = [
    ...new Set([
      f.id,
      ...(k?.anchorFactIds || []),
      ...(k?.passage?.anchorFactIds || []),
    ]),
  ];
  return {
    provider: "test-mock",
    model: "test-mock-not-an-openai-model",
    responseId: "mock-paid-v2",
    durationMs: 1,
    usage: {
      inputTokens: 0,
      cachedInputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
    },
    estimatedCostUsd: null,
    raw: {
      schemaVersion: PAID_SCHEMA_V2,
      coverage,
      coverageNote:
        "BẢN MÔ PHỎNG: " +
        (coverage === "insufficient"
          ? "Chưa có nền phù hợp để biên soạn bài phân tích."
          : "Chỉ kiểm cách hiển thị những luận điểm có căn cứ, không xác nhận lời luận thực tế."),
      sections:
        coverage === "insufficient"
          ? []
          : [
              {
                id: "main-idea",
                role: "analysis",
                title: "Luận điểm có căn cứ",
                paragraphs: [
                  {
                    text: "BẢN MÔ PHỎNG KIỂM THỬ. " + k!.text,
                    basis: "source-interpretation",
                    factIds: anchors,
                    knowledgeIds: [k!.id],
                  },
                ],
              },
              ...(coverage === "focused"
                ? [
                    {
                      id: "self-reflection",
                      role: "synthesis",
                      title: "Tổng hợp để tự đối chiếu",
                      paragraphs: [
                        {
                          text: "BẢN MÔ PHỎNG: lời nguồn trên chỉ gợi một cách tự quan sát trong phạm vi đã nêu, không phải kết luận về đời sống người đọc.",
                          basis: "ai-synthesis",
                          factIds: anchors,
                          knowledgeIds: [k!.id],
                        },
                      ],
                    },
                  ]
                : []),
            ],
      limitations: ["BẢN MÔ PHỎNG, không dùng để đánh giá chất lượng Astra."],
    },
  };
}
