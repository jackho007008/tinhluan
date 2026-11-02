import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v25";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V24 } from "../lib/ai/paid-prompt-v24";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V21 } from "../lib/ai/paid-prompt-v21";
import { it, expect, afterEach, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MenhInput } from "../lib/ai/contract";
import {
  PAID_PROMPT_V2,
  PAID_SCHEMA_V2,
  validatePaidV2,
} from "../lib/ai/paid-reading-v2";
import { paidOutputSchema, PAID_V1_PROMPTS } from "../lib/ai/paid-version";
import {
  paidInstructions,
  validatePaidNarration,
  paidWritePromptVersion,
  PAID_EDITION,
} from "../lib/ai/paid-contract";
import { readPaidContent } from "../lib/ai/paid-result";
import { paidProgress } from "../lib/ai/paid-progress";
import PaidReadingContent from "../components/PaidReadingContent";
import { mockPaidGeneration } from "./fixtures/ai-paid-mock";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
import { openaiNarrator } from "../lib/ai/provider";
const input: MenhInput = {
  version: "paid-facts-1.1.0",
  knowledgeVersion: "paid-retrieval-1.2.0",
  paidTarget: { palace: "Quan Lộc", edition: PAID_EDITION },
  facts: [
    {
      id: "f1",
      kind: "engine",
      text: "Quan Lộc tại Thìn: Tử Vi, trạng thái Vượng.",
      paths: ["palaces.2"],
    },
  ],
  knowledge: [
    {
      id: "k1",
      group: "A",
      application: "direct",
      subjectPalaces: ["Quan Lộc"],
      title: "Lời nguồn",
      text: "Tử Vi–Thiên Tướng tại Quan gắn với tổ chức công việc, giữ cả mặt vượt quyền trong lời nguồn.",
      conditions: ["Hai sao đồng cung Quan Lộc."],
      limits: ["Chưa phối hợp ngoại lệ."],
      references: [
        {
          title: "Nguồn fixture",
          location: "Mục kỹ thuật, không phải chứng nhận chuyên môn",
        },
      ],
      selection: "matched-v1-editorial",
    },
  ],
  missing: [],
};
const output = (
  coverage: "focused" | "limited" | "insufficient" = "limited",
): any => mockPaidV2(input, coverage).raw;
const result = (raw: any, prompt = PAID_PROMPT_V2): any => ({
  content: raw,
  promptVersion: prompt,
  facts: input.facts,
  knowledge: input.knowledge,
  provider: "test-mock",
  edition: PAID_EDITION,
  model: "test-mock",
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it.each(["focused", "limited", "insufficient"] as const)(
  "accepts %s without padding",
  (coverage) => {
    expect(validatePaidV2(output(coverage), input).coverage).toBe(coverage);
  },
);
it("allows 4 focused and 8 limited: count is not a depth classifier", () => {
  for (const [c, n] of [
    ["focused", 4],
    ["limited", 8],
  ] as const) {
    const r = output(c);
    r.sections = Array.from({ length: n }, (_, i) => ({
      ...r.sections[0],
      id: "idea-" + i,
    }));
    expect(validatePaidV2(r, input).sections).toHaveLength(n);
  }
});
it.each(["focused", "limited", "insufficient"] as const)(
  "rejects incorrect section count for %s",
  (c) => {
    const r = output(c);
    r.sections = c === "insufficient" ? output().sections : [];
    expect(() => validatePaidV2(r, input)).toThrow("AI_COVERAGE_MISMATCH");
  },
);
it("rejects unknown version, duplicate IDs, invalid role, >8 sections and whitespace note", () => {
  for (const change of [
    (r: any) => (r.schemaVersion = "unknown"),
    (r: any) => r.sections.push(r.sections[0]),
    (r: any) => (r.sections[0].role = "traits"),
    (r: any) => (r.sections = Array(9).fill(r.sections[0])),
    (r: any) => (r.coverageNote = "  "),
  ]) {
    const r = output();
    change(r);
    expect(() => validatePaidV2(r, input)).toThrow();
  }
});
it.each(["factIds", "knowledgeIds"])("rejects unknown %s", (field) => {
  const r = output();
  r.sections[0].paragraphs[0][field] = ["invented"];
  expect(() => validatePaidV2(r, input)).toThrow("AI_UNKNOWN_REFERENCE");
});
it("rejects C promoted to direct; accepts named original palace in context", () => {
  const i = structuredClone(input);
  Object.assign(i.knowledge[0], {
    group: "C",
    application: "context",
    subjectPalaces: ["Mệnh"],
  });
  const r = output();
  expect(() => validatePaidV2(r, i)).toThrow("AI_CONTEXT_AS_DIRECT");
  r.sections[0].role = "context";
  r.sections[0].paragraphs[0].text =
    "Tại Mệnh, lời nguồn được giữ ở cung gốc, không thành kết quả riêng cho công việc.";
  expect(() => validatePaidV2(r, i)).not.toThrow();
  r.sections[0].paragraphs[0].text = "Bạn có công việc thuận lợi.";
  expect(() => validatePaidV2(r, i)).toThrow("AI_CONTEXT_AS_DIRECT");
});
it("rejects D as source interpretation or sole synthesis basis and facts laundering", () => {
  for (const basis of ["source-interpretation", "ai-synthesis", "facts"]) {
    const i = structuredClone(input);
    i.knowledge[0].group = "D";
    const r = output();
    r.sections[0].paragraphs[0].basis = basis;
    expect(() => validatePaidV2(r, i)).toThrow("AI_REFERENCE_SCOPE");
  }
});
it("rejects interpretation using unverified facts and focused without a used direct source", () => {
  const i = structuredClone(input);
  i.facts[0].provenance = {
    palace: "Quan Lộc",
    relation: "target",
    field: "jiangqian12",
    scope: "natal",
    verification: "upstream-unverified",
    source: "fixture",
  };
  expect(() => validatePaidV2(output(), i)).toThrow(
    "AI_UNVERIFIED_INTERPRETATION",
  );
  const r = output("focused");
  for (const s of r.sections) {
    s.paragraphs[0].basis = "facts";
    s.paragraphs[0].knowledgeIds = [];
  }
  expect(() => validatePaidV2(r, input)).toThrow("AI_COVERAGE_UNSUPPORTED");
});
it.each(["coverageNote", "title", "paragraph", "limitations"])(
  "guards medical assertions in %s, including insufficient note",
  (field) => {
    const r = output();
    if (field === "coverageNote") {
      r.coverage = "insufficient";
      r.sections = [];
      r.coverageNote = "Bạn sẽ mắc bệnh.";
    }
    if (field === "title") r.sections[0].title = "Bạn cần điều trị.";
    if (field === "paragraph")
      r.sections[0].paragraphs[0].text =
        "Không chẩn đoán bệnh nhưng hãy dùng thuốc.";
    if (field === "limitations") r.limitations = ["Bạn có tuổi thọ 65 năm."];
    expect(() => validatePaidV2(r, input)).toThrow("AI_SCOPE_VIOLATION");
  },
);
it("guards split medical phrases and allows exact safe limitations", () => {
  const r = output();
  r.sections[0].title = "chẩn";
  r.sections[0].paragraphs[0].text = "đoán bạn có bệnh.";
  expect(() => validatePaidV2(r, input)).toThrow("AI_SCOPE_VIOLATION");
  const safe = output("insufficient");
  safe.coverageNote = "Không chẩn đoán bệnh.";
  safe.limitations = ["Không dự báo tuổi thọ hoặc tử vong."];
  expect(() => validatePaidV2(safe, input)).not.toThrow();
});
it("reads all legacy prompts as eight sections; rejects unknown schema instead of guessing", () => {
  for (const p of PAID_V1_PROMPTS) {
    const raw = mockPaidGeneration(input).raw;
    expect(readPaidContent(result(raw, p))?.version).toBe(1);
    expect(validatePaidNarration(raw, input, p).sections).toHaveLength(8);
  }
  expect(readPaidContent(result(output(), "unknown"))).toBeNull();
  expect(readPaidContent(result(output(), PAID_V1_PROMPTS[3]))).toBeNull();
  expect(readPaidContent(result(mockPaidGeneration(input).raw))).toBeNull();
});
it("renderer uses section IDs/paragraphs, labels bounded coverage and never renders fake insufficient sections", () => {
  for (const c of ["focused", "limited", "insufficient"] as const) {
    const html = renderToStaticMarkup(
      createElement(PaidReadingContent, { result: result(output(c)) }),
    );
    expect(html).toContain("BẢN MÔ PHỎNG");
    expect(html).not.toContain("schemaVersion");
    if (c === "insufficient") {
      expect(html).not.toContain("<article");
      expect(html).toContain("Chưa đủ căn cứ");
    } else {
      expect(html).toContain("Xem căn cứ");
      expect(html).toContain("main-idea");
    }
  }
  const old = mockPaidGeneration(input).raw;
  const before = JSON.stringify(old);
  expect(
    (
      renderToStaticMarkup(
        createElement(PaidReadingContent, {
          result: result(old, PAID_V1_PROMPTS[3]),
        }),
      ).match(/<article/g) || []
    ).length,
  ).toBe(8);
  expect(JSON.stringify(old)).toBe(before);
  expect(
    renderToStaticMarkup(
      createElement(PaidReadingContent, {
        result: result(output(), "unknown"),
      }),
    ),
  ).toContain("liên hệ hỗ trợ");
});
it("projects processed vs delivered, ends bounded content, preserves legacy progress and unknown stored result", () => {
  const row = (n: number, raw: any, p = PAID_PROMPT_V2) => ({
    palace: [
      "Phụ Mẫu",
      "Phúc Đức",
      "Điền Trạch",
      "Quan Lộc",
      "Nô Bộc",
      "Thiên Di",
      "Tật Ách",
      "Tài Bạch",
      "Tử Nữ",
      "Phu Thê",
      "Huynh Đệ",
    ][n],
    status: "completed",
    attempts: 1,
    run_after: new Date(),
    result: result(raw, p),
  });
  const rows = Array.from({ length: 11 }, (_, n) =>
    row(n, output(n === 0 ? "insufficient" : n === 1 ? "limited" : "focused")),
  );
  const before = JSON.stringify(rows);
  expect(paidProgress(rows, new Date(0).toISOString())).toMatchObject({
    processed: 11,
    completed: 10,
    focused: 9,
    limited: 1,
    insufficient: 1,
    state: "content-limited",
    overEstimate: false,
  });
  expect(JSON.stringify(rows)).toBe(before);
  rows[0].result.promptVersion = "unknown";
  const v = paidProgress(rows, new Date(0).toISOString());
  expect(v.state).toBe("attention");
  expect(v.palaces[0].result).toBeUndefined();
  expect(v.palaces[0].canRetry).toBe(false);
  expect(
    paidProgress(
      Array.from({ length: 11 }, (_, n) =>
        row(n, mockPaidGeneration(input).raw, PAID_V1_PROMPTS[3]),
      ),
      new Date().toISOString(),
    ),
  ).toMatchObject({ completed: 11, processed: 11, state: "completed" });
});
it("writer is opt-in while V1/V2 schema and prompts remain addressable", () => {
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "false");
  expect(paidWritePromptVersion()).toBe(PAID_V1_PROMPTS[3]);
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "true");
  expect(paidWritePromptVersion()).toBe(PAID_PROMPT_CURRENT);
  expect(paidInstructions(input, PAID_PROMPT_V2)).toContain(
    "Không số từ tối thiểu".toLowerCase().replace("không", "không"),
  );
  expect(paidOutputSchema(PAID_PROMPT_V2).parse(output())).toMatchObject({
    schemaVersion: PAID_SCHEMA_V2,
  });
  expect(() => paidOutputSchema("unknown")).toThrow();
});
it.each([
  PAID_V1_PROMPTS[3],
  PAID_PROMPT_V2,
  PAID_PROMPT_V21,
  PAID_PROMPT_V24,
  PAID_PROMPT_CURRENT,
])(
  "SDK CREATE/GET uses saved %s even if writer flag changes (fetch mock)",
  async (version) => {
    vi.stubEnv("OPENAI_API_KEY", "unit-test-not-live");
    vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6-astra");
    vi.stubEnv(
      "AI_PAID_READING_V2_ENABLED",
      version !== PAID_V1_PROMPTS[3] ? "false" : "true",
    );
    const raw =
      version !== PAID_V1_PROMPTS[3] ? output() : mockPaidGeneration(input).raw;
    let creates = 0,
      gets = 0;
    const response = {
      id: "resp_fixture_saved",
      object: "response",
      status: "completed",
      model: "gpt-6-astra",
      output: [
        {
          type: "message",
          id: "msg_mock",
          status: "completed",
          role: "assistant",
          content: [
            { type: "output_text", text: JSON.stringify(raw), annotations: [] },
          ],
        },
      ],
      usage: {
        input_tokens: 10,
        input_tokens_details: { cached_tokens: 0 },
        output_tokens: 10,
        output_tokens_details: { reasoning_tokens: 0 },
      },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: any, init: any) => {
        if (String(url).includes("/models/"))
          return new Response(JSON.stringify({ id: "gpt-6-astra" }), {
            headers: { "Content-Type": "application/json" },
          });
        if (init.method === "POST") {
          creates++;
          const body = JSON.parse(init.body);
          expect(body.instructions).toContain(version);
          expect(body.text.format.schema.properties.sections.maxItems).toBe(8);
          expect(
            body.text.format.schema.properties.schemaVersion?.const ?? null,
          ).toBe(version !== PAID_V1_PROMPTS[3] ? PAID_SCHEMA_V2 : null);
        } else gets++;
        return new Response(JSON.stringify(response), {
          headers: { "Content-Type": "application/json" },
        });
      }),
    );
    let receipt = "";
    const recovery = {
      promptVersion: version,
      onResponseCreated: async (id: string) => {
        receipt = id;
      },
    };
    await openaiNarrator(input, "attempt_fixture", recovery);
    await openaiNarrator(input, "attempt_fixture", {
      ...recovery,
      responseId: receipt,
    });
    expect([creates, gets]).toEqual([1, 1]);
  },
);

it("paid provider refuses missing saved version before any network call", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  await expect(
    openaiNarrator(input, "fixture", { onResponseCreated: async () => {} }),
  ).rejects.toMatchObject({ code: "AI_PROMPT_VERSION_UNSUPPORTED" });
  expect(fetcher).not.toHaveBeenCalled();
});

it("book background cannot substitute for a matched direct thesis", () => {
  const i = structuredClone(input);
  Object.assign(i.knowledge[0], {group:"B",application:"reference-only"});
  const r = output();r.sections[0].paragraphs[0].basis="ai-synthesis";
  expect(() => validatePaidV2(r,i)).toThrow("AI_REFERENCE_SCOPE");
  i.knowledge.push({...input.knowledge[0],id:"direct-base"});
  r.sections[0].paragraphs[0].knowledgeIds.push("direct-base");
  expect(() => validatePaidV2(r,i)).not.toThrow();
});
