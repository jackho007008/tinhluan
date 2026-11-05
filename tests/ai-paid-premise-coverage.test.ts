import { validatePaidPremiseCoverage } from "../lib/ai/paid-premise-coverage";
import { afterEach, expect, it, vi } from "vitest";
import type { MenhInput } from "../lib/ai/contract";
import {
  paidInstructions,
  paidWritePromptVersion,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT as V28 } from "../lib/ai/paid-prompt-v28";
import { PAID_PROMPT_CURRENT as V281 } from "../lib/ai/paid-prompt-v281";
import { paidOutputSchema } from "../lib/ai/paid-version";
import { isOutputValidationError } from "../lib/ai/provider-failure";
import { openaiNarrator } from "../lib/ai/provider";

// Synthetic reference-contract fixture, not an engine chart or source claim.
function fixture() {
  const input: MenhInput = {
    version: "paid-facts-1.1.0",
    knowledgeVersion: "paid-retrieval-1.20.0",
    paidTarget: { palace: "Nô Bộc", edition: "paid-palaces-ai-1.0.0" },
    missing: [],
    facts: [
      {
        id: "palace.3.majorStars.0",
        kind: "engine",
        text: "Nô Bộc tại Tỵ: Thiên Lương; nhóm chính tinh.",
        paths: ["chart.palaces.3.majorStars.0"],
        provenance: {
          palace: "Nô Bộc",
          relation: "target",
          field: "majorStars",
          scope: "natal",
          verification: "source-traced",
          source: "TECHNICAL ONLY",
        },
      },
      {
        id: "natal.Lộc",
        kind: "engine",
        text: "Tứ Hóa năm sinh: Thiên Lương hóa Lộc, tại Nô Bộc (Tỵ).",
        paths: ["chart.natalTransformations"],
      },
      {
        id: "palace.3.location",
        kind: "engine",
        text: "Nô Bộc tại Tỵ; can cung.",
        paths: ["chart.palaces.3"],
      },
    ],
    knowledge: [],
  };
  const shared = {
    title: "MOCK",
    text: "Technical reference only.",
    conditions: ["Technical conditions matched"],
    limits: ["Not a personal interpretation"],
    references: [{ title: "MOCK source", location: "Technical fixture" }],
    subjectPalaces: ["Nô Bộc"],
  };
  input.knowledge = [
    {
      ...shared,
      id: "foundation",
      group: "B",
      application: "reference-only",
      selection: "reference-only",
      passage: {
        version: "paid-library-1.0.0",
        kind: "foundation",
        digest: "a".repeat(64),
        anchorFactIds: [input.facts[0].id],
      },
    },
    {
      ...shared,
      id: "loc-source",
      group: "B",
      application: "direct",
      selection: "matched-snapshot",
      anchorFactIds: ["natal.Lộc"],
    },
  ];
  const raw: any = {
    schemaVersion: "paid-reading-v2.0.0",
    coverage: "limited",
    coverageNote: "BẢN MOCK kiểm tham chiếu.",
    limitations: ["Không dùng làm lời luận thật."],
    sections: [
      {
        id: "premises",
        role: "analysis",
        title: "BẢN MOCK",
        paragraphs: [
          {
            basis: "ai-synthesis",
            text: "BẢN MOCK: nền Thiên Lương nối với Lộc ở Nô để xét kỳ vọng đối đãi.",
            factIds: [input.facts[0].id, "natal.Lộc"],
            knowledgeIds: ["foundation", "loc-source"],
          },
        ],
      },
    ],
  };
  return { input, raw, p: raw.sections[0].paragraphs[0] };
}
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it("reproduces the missing Lộc source in 2.8 but rejects it only for new attempts", () => {
  const { input, raw, p } = fixture();
  p.knowledgeIds = ["foundation"];
  const before = JSON.stringify({ input, raw });
  expect(() => validatePaidNarration(raw, input, V28)).not.toThrow();
  expect(() => validatePaidNarration(raw, input, V281)).toThrow(
    "AI_PREMISE_SOURCE_MISSING",
  );
  expect(JSON.stringify({ input, raw })).toBe(before);
});
it("accepts the complete premises and does not require direct sources for a foundation alone", () => {
  const { input, raw, p } = fixture();
  expect(validatePaidNarration(raw, input, V281)).toEqual(raw);
  p.knowledgeIds = ["foundation"];
  p.factIds = [input.facts[0].id, "palace.3.location"];
  p.text = "BẢN MOCK về nền Thiên Lương; chưa suy về tài lộc hoặc Quan Lộc.";
  expect(() => validatePaidNarration(raw, input, V281)).not.toThrow();
});
it.each(["Hóa Lộc", "hóa lộc", "Lộc ở Nô", "nối với Lộc", "Lộc tại Nô"])(
  "removing the factId cannot hide explicit %s from a foundation paragraph",
  (name) => {
    const { input, raw, p } = fixture();
    p.knowledgeIds = ["foundation"];
    p.factIds = [input.facts[0].id];
    p.text = `BẢN MOCK nền Thiên Lương và ${name} gợi kỳ vọng.`;
    expect(() => validatePaidNarration(raw, input, V281)).toThrow(
      "AI_PREMISE_SOURCE_MISSING",
    );
  },
);
it.each(["method", "unrelated-direct", "elsewhere", "same-star-wrong-palace"])(
  "does not borrow coverage from %s",
  (mode) => {
    const { input, raw, p } = fixture();
    if (mode === "method") {
      input.knowledge[1].group = "D";
      input.knowledge[1].application = "reference-only";
    }
    if (mode === "unrelated-direct")
      input.knowledge[1].anchorFactIds = [input.facts[0].id];
    if (mode === "elsewhere") {
      raw.sections[0].paragraphs.push({
        ...p,
        knowledgeIds: ["loc-source"],
        factIds: ["natal.Lộc"],
        text: "BẢN MOCK Hóa Lộc.",
      });
      p.knowledgeIds = ["foundation"];
    }
    if (mode === "same-star-wrong-palace") {
      input.facts.push({
        ...input.facts[0],
        id: "palace.4.majorStars.0",
        text: "Thiên Di tại Ngọ: Thiên Lương; nhóm chính tinh.",
      });
      p.factIds.push("palace.4.majorStars.0");
    }
    expect(() => validatePaidNarration(raw, input, V281)).toThrow(
      "AI_PREMISE_SOURCE_MISSING",
    );
  },
);
it("named extra star without a factId cannot borrow a different star foundation", () => {
  const { input, raw, p } = fixture();
  input.facts.push({
    ...input.facts[0],
    id: "palace.3.minorStars.0",
    text: "Nô Bộc tại Tỵ: Thiên Việt; nhóm phụ tinh.",
  });
  p.text += " Thiên Việt gợi trợ giúp.";
  expect(() => validatePaidNarration(raw, input, V281)).toThrow(
    "AI_PREMISE_SOURCE_MISSING",
  );
});
it("still rejects source attribution, C/D misuse and medical assertions", () => {
  for (const mode of ["source", "C", "D", "medical"]) {
    const { input, raw, p } = fixture();
    if (mode === "source") p.basis = "source-interpretation";
    if (mode === "C") {
      input.knowledge[0].group = "C";
      p.basis = "source-interpretation";
    }
    if (mode === "D") {
      input.knowledge[0].group = "D";
      p.basis = "source-interpretation";
    }
    if (mode === "medical") p.text = "Bạn sẽ mắc bệnh nghiêm trọng.";
    expect(() => validatePaidNarration(raw, input, V281)).toThrow();
  }
});
it("keeps schema, opt-in, old instructions and classifies the new guard as output validation", () => {
  const { input } = fixture();
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "true");
  expect(paidWritePromptVersion()).toBe(V281);
  expect(paidOutputSchema(V281)).toBe(paidOutputSchema(V28));
  expect(paidInstructions(input, V281)).toContain("KIỂM ĐỦ TIỀN ĐỀ");
  expect(paidInstructions(input, V28)).not.toContain("KIỂM ĐỦ TIỀN ĐỀ");
  expect(isOutputValidationError("AI_PREMISE_SOURCE_MISSING")).toBe(true);
});
it.each([V28, V281])(
  "GET recovery selects the saved %s without CREATE or changing input",
  async (version) => {
    const { input, raw, p } = fixture();
    p.knowledgeIds = ["foundation"];
    const before = JSON.stringify(input);
    vi.stubEnv("OPENAI_API_KEY", "mock-only");
    vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6-astra");
    const fetcher = vi.fn(async () =>
      Response.json({
        id: "resp_mock_saved",
        object: "response",
        status: "completed",
        model: "gpt-6-astra",
        output: [
          {
            type: "message",
            role: "assistant",
            id: "msg_mock",
            content: [
              {
                type: "output_text",
                text: JSON.stringify(raw),
                annotations: [],
              },
            ],
          },
        ],
        usage: { input_tokens: 0, output_tokens: 0 },
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const receipt = vi.fn();
    const result = await openaiNarrator(input, "mock-attempt", {
      promptVersion: version,
      responseId: "resp_mock_saved",
      onResponseCreated: receipt,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(receipt).not.toHaveBeenCalled();
    expect(JSON.stringify(input)).toBe(before);
    if (version === V28)
      expect(() =>
        validatePaidNarration(result.raw, input, version),
      ).not.toThrow();
    else
      expect(() => validatePaidNarration(result.raw, input, version)).toThrow(
        "AI_PREMISE_SOURCE_MISSING",
      );
  },
);

it("mock CREATE sends 2.8.1 with Background and unchanged Structured Outputs", async () => {
  const { input, raw } = fixture();
  vi.stubEnv("OPENAI_API_KEY", "mock-only");
  vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6-astra");
  const fetcher = vi.fn(async (url: any, init: any) => {
    if (String(url).includes("/models/"))
      return Response.json({ id: "gpt-6-astra" });
    return Response.json({
      id: "resp_mock_new",
      object: "response",
      status: "completed",
      model: "gpt-6-astra",
      output: [
        {
          type: "message",
          role: "assistant",
          id: "msg_mock",
          content: [
            { type: "output_text", text: JSON.stringify(raw), annotations: [] },
          ],
        },
      ],
      usage: { input_tokens: 0, output_tokens: 0 },
    });
  });
  vi.stubGlobal("fetch", fetcher);
  const receipt = vi.fn();
  const result = await openaiNarrator(input, "mock-new-attempt", {
    promptVersion: V281,
    onResponseCreated: receipt,
  });
  const creates = fetcher.mock.calls.filter((c) => c[1]?.method === "POST");
  expect(creates).toHaveLength(1);
  const sent = JSON.parse(creates[0][1].body);
  expect(sent.background).toBe(true);
  expect(sent.instructions).toBe(paidInstructions(input, V281));
  expect(JSON.parse(sent.input).knowledge).toEqual(input.knowledge);
  expect(sent.text.format.type).toBe("json_schema");
  expect(receipt).toHaveBeenCalledTimes(1);
  expect(validatePaidNarration(result.raw, input, V281)).toEqual(raw);
});

it("allows a cited Hao entry label but still checks separate mentions and explicit star facts", () => {
  const { input, raw, p } = fixture();
  const dao = {
    ...input.facts[0],
    id: "palace.6.ring.boshi12",
    text: "Tài Bạch tại Thân: Đại Hao; vòng bản mệnh.",
  };
  const tieu = {
    ...dao,
    id: "palace.0.ring.boshi12",
    text: "Phúc Đức tại Dần: Tiểu Hao; vòng bản mệnh.",
  };
  input.facts = [dao, tieu];
  const k = input.knowledge[0];
  k.id = "paid-library.tb41-tai-hao-scope";
  k.passage!.digest =
    "13ef0725399f252a80c67b93e96c5b6bbe0f75c2e6e4c4564c9ea59707e48b36";
  k.passage!.anchorFactIds = [dao.id];
  p.text =
    "Đại Hao được xét trong nghĩa chung của nhóm Đại Hao–Tiểu Hao, khi nói đến hao hụt.";
  p.knowledgeIds = [k.id];
  p.factIds = [dao.id];
  const check = () => validatePaidPremiseCoverage(raw, input);
  expect(check).not.toThrow();
  p.factIds.push(tieu.id);
  expect(check).toThrow("AI_PREMISE_SOURCE_MISSING");
  p.factIds.pop();
  p.text += " Tiểu Hao cũng ở Tài.";
  expect(check).toThrow("AI_PREMISE_SOURCE_MISSING");
  p.text = p.text.split(" Tiểu Hao cũng")[0];
  k.passage!.digest = "0".repeat(64);
  expect(check).toThrow("AI_PREMISE_SOURCE_MISSING");
});

it("only resolves the complete R05 pair in its original career palace and paragraph", () => {
  const { input, raw, p } = fixture();
  const pair = ["Tử Vi", "Thiên Tướng"].map((name, n) => ({
    ...input.facts[0],
    id: "palace.2.majorStars." + n,
    text: "Quan Lộc tại Thìn: " + name + "; nhóm chính tinh.",
    provenance: { ...input.facts[0].provenance!, palace: "Quan Lộc" },
  }));
  input.facts.push(
    ...pair,
    ...["Tử", "Suy"].map((name, index) => ({
      ...pair[0],
      id: "palace." + index + ".ring.changsheng12",
      text: "Cung: " + name + "; vòng Trường Sinh.",
    })),
  );
  const k = input.knowledge[1];
  Object.assign(k, {
    id: "r05",
    selection: "matched-v1-editorial",
    group: "C",
    application: "context",
    subjectPalaces: ["Quan Lộc"],
    provenance: { ruleIds: ["tanbien.r05"] },
    anchorFactIds: undefined,
  });
  p.text =
    "Tử Vi và Thiên Tướng tại Quan Lộc là ngữ cảnh, chưa dùng để suy ra kết quả.";
  p.knowledgeIds = ["foundation", k.id];
  p.factIds = pair.map((f) => f.id);
  const check = () => validatePaidPremiseCoverage(raw, input);
  expect(check).not.toThrow();
  for (const stage of ["Tử", "Suy"]) {
    const original = p.text;
    p.text += " Vòng có " + stage + " tại Quan.";
    expect(check).toThrow("AI_PREMISE_SOURCE_MISSING");
    p.text = original;
  }
  pair[1].provenance.palace = "Tài Bạch";
  expect(check).toThrow("AI_PREMISE_SOURCE_MISSING");
  pair[1].provenance.palace = "Quan Lộc";
  p.factIds.shift();
  expect(check).toThrow("AI_PREMISE_SOURCE_MISSING");
  p.factIds = pair.map((f) => f.id);
  p.knowledgeIds = ["foundation"];
  expect(check).toThrow("AI_PREMISE_SOURCE_MISSING");
});
