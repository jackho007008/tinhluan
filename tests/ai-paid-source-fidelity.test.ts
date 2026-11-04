import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { paidInput } from "../lib/ai/paid-input";
import { paidKnowledge } from "../lib/ai/paid-retrieval";
import { paidFacts } from "../lib/ai/paid-facts";
import { paidLibrary, LIBRARY_MAX_BYTES } from "../lib/ai/paid-library";
import {
  reviewPaidSource,
  PAID_SOURCE_REVIEW,
} from "../lib/ai/paid-source-fidelity";
import {
  paidInstructions,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v26";
import { openaiNarrator } from "../lib/ai/provider";
import type { Knowledge, MenhInput } from "../lib/ai/contract";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";

let record: any;
const hash = (x: unknown) =>
  createHash("sha256").update(JSON.stringify(x)).digest("hex");
beforeAll(async () => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA source fidelity",
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
beforeEach(() =>
  vi.stubGlobal("fetch", () => {
    throw Error("NO_REAL_NETWORK");
  }),
);
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
const getSource = (palace: string): Knowledge => {
  const sources = paidInput(record, palace).knowledge;
  const k =
    palace === "Quan Lộc"
      ? sources.find((k) => k.provenance?.ruleIds.includes("tanbien.r06"))
      : sources.find(
          (k) =>
            k.id ===
            (palace === "Nô Bộc"
              ? "paid-library.hs125-luong-general-disposition"
              : "paid-library.thp2-phu-ta-huu"),
        );
  if (!k) throw Error("SOURCE_NOT_SELECTED");
  return k;
};
// Technical negative fixtures start with a source that passed the real selector.
const unreviewed = (palace: string): Knowledge => {
  const k = structuredClone(getSource(palace));
  delete k.sourceReview;
  k.text = "BẢN NGUỒN KỸ THUẬT cho kiểm phạm vi, không phải lời luận.";
  k.limits = k.limits.slice(0, -1);
  return k;
};

it.each(["Quan Lộc", "Nô Bộc", "Phu Thê"])(
  "new %s input carries the reviewed source without changing facts or the saved report",
  (palace) => {
    const before = hash(record),
      i = paidInput(record, palace),
      k = getSource(palace);
    expect(i.knowledgeVersion).toBe("paid-retrieval-1.19.0");
    expect(i.facts).toEqual(paidFacts(record, palace).facts);
    expect(k.sourceReview).toMatchObject({ version: PAID_SOURCE_REVIEW });
    expect(k.sourceReview!.sourceTextDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(k.sourceReview!.reviewDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(hash(record)).toBe(before);
    expect(
      validatePaidNarration(mockPaidV2(i).raw, i, PAID_PROMPT_CURRENT),
    ).toBeDefined();
  },
);
it("Quan retains Tài as C and attributes the wealth claim instead of promising stable accumulation", () => {
  const k = getSource("Quan Lộc");
  expect(k).toMatchObject({
    group: "C",
    application: "context",
    subjectPalaces: ["Tài Bạch"],
  });
  expect(k.text).toContain("cạnh tranh ráo riết");
  expect(k.text).toContain("cách diễn đạt của tác giả");
  expect(k.text).toContain("không phải bằng chứng");
  expect(k.text).not.toContain("tích lũy chậm nhưng chắc");
  expect(
    paidInput(record, "Tài Bạch").knowledge.some((k) => k.sourceReview),
  ).toBe(false);
});
it("Nô's Lương stays a foundation, keeps both brightness scopes and never becomes a direct friend/owner trait", () => {
  const k = getSource("Nô Bộc");
  expect(k).toMatchObject({
    group: "B",
    application: "reference-only",
    passage: { kind: "foundation" },
  });
  expect(k.text).toContain("cả đắc lẫn hãm");
  expect(k.text).toContain("một hình tượng");
  expect(k.limits.join(" ")).toContain(
    "không nhận là kết quả phối hợp Lương–Lộc",
  );
});
it("Phu retains frequency, past phase, sequence and the boundary against guaranteed harmony", () => {
  const k = getSource("Phu Thê");
  expect(k).toMatchObject({
    group: "B",
    application: "direct",
    passage: { kind: "direct" },
  });
  expect(k.text).toContain("thường thường");
  expect(k.text).toContain("từng trợ giúp mệnh tạo trong một giai đoạn");
  expect(k.text).toContain("va chạm rồi mới hợp nhau");
  expect(k.limits.join(" ")).toContain("cứ va chạm thì sẽ hòa hợp");
});
it.each(["Quan Lộc", "Nô Bộc", "Phu Thê"])(
  "review of %s is immutable/idempotent and preserves applicability and original passage provenance",
  (palace) => {
    const raw = unreviewed(palace),
      before = structuredClone(raw),
      result = reviewPaidSource(raw, palace);
    expect(raw).toEqual(before);
    const { text, limits, sourceReview, ...rest } = result;
    const { text: oldText, limits: oldLimits, ...oldRest } = before;
    expect(rest).toEqual(oldRest);
    expect(limits.slice(0, -1)).toEqual(oldLimits);
    expect(sourceReview!.sourceTextDigest).toBe(
      createHash("sha256").update(oldText).digest("hex"),
    );
    expect(reviewPaidSource(result, palace)).toBe(result);
  },
);
it.each(["unknown-digest", "wrong-book", "no-anchors", "wrong-role"])(
  "does not apply a library review to drifted source metadata: %s",
  (change) => {
    const k = unreviewed("Phu Thê");
    if (change === "unknown-digest") k.passage!.digest = "0".repeat(64);
    if (change === "wrong-book") k.references[0].title = "Tác giả/sách khác";
    if (change === "no-anchors") k.passage!.anchorFactIds = [];
    if (change === "wrong-role") k.application = "reference-only";
    expect(reviewPaidSource(k, "Phu Thê")).toBe(k);
  },
);
it("does not rewrite a composite V1 paragraph, wrong page, D source or unrelated target", () => {
  const k = unreviewed("Quan Lộc");
  const variants = [
    {
      ...k,
      provenance: {
        ...k.provenance!,
        ruleIds: ["tanbien.r06", "another-source"],
      },
    },
    { ...k, references: [{ ...k.references[0], location: "Trang PDF 191" }] },
    { ...k, group: "D" as const },
  ];
  for (const x of variants) expect(reviewPaidSource(x, "Quan Lộc")).toBe(x);
  expect(reviewPaidSource(k, "Tài Bạch")).toBe(k);
  expect(
    reviewPaidSource(unreviewed("Phu Thê"), "Tật Ách").sourceReview,
  ).toBeUndefined();
});
it("never restores a source whose anchor failed, and budgets include editorial text and provenance", () => {
  for (const palace of ["Nô Bộc", "Phu Thê"]) {
    const input = paidFacts(record, palace),
      library = paidLibrary(input, palace);
    expect(
      library.items.reduce(
        (n, k) => n + Buffer.byteLength(JSON.stringify(k)),
        0,
      ),
    ).toBeLessThanOrEqual(LIBRARY_MAX_BYTES);
    expect(library.items.some((k) => k.sourceReview)).toBe(true);
    const selected = getSource(palace);
    input.facts = input.facts.filter(
      (f) => !selected.passage!.anchorFactIds.includes(f.id),
    );
    expect(
      paidLibrary(input, palace).items.some((k) => k.id === selected.id),
    ).toBe(false);
  }
  const q = paidKnowledge(record, "Quan Lộc");
  expect(q.contextSelection.usedBytes).toBeLessThanOrEqual(
    q.contextSelection.byteBudget,
  );
  expect(q.contextSelection.byteBudget).toBeLessThanOrEqual(24000);
});

const providerMock = (raw: unknown) =>
  vi.fn(async (url: any, init: any) => {
    const u = String(url),
      method = init?.method || "GET";
    if (u.includes("/models/") && method === "GET")
      return Response.json({ id: "gpt-6-astra" });
    if (!(u.includes("/responses") && ["GET", "POST"].includes(method)))
      throw Error("UNEXPECTED_MOCK_REQUEST");
    return Response.json({
      id: "resp_source_review_mock",
      object: "response",
      status: "completed",
      model: "gpt-6-astra",
      created_at: 1793606400,
      completed_at: 1793606401,
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
      usage: {
        input_tokens: 0,
        output_tokens: 0,
        input_tokens_details: { cached_tokens: 0 },
        output_tokens_details: { reasoning_tokens: 0 },
      },
    });
  });
it.each(["Quan Lộc", "Nô Bộc", "Phu Thê"])(
  "mock Responses request actually sends the new %s source with the unchanged V2 prompt/schema",
  async (palace) => {
    vi.stubEnv("OPENAI_API_KEY", "mock-only-key");
    vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6-astra");
    const input = paidInput(record, palace),
      raw = mockPaidV2(input).raw,
      fetcher = providerMock(raw),
      receipt = vi.fn(async () => {});
    vi.stubGlobal("fetch", fetcher);
    const result = await openaiNarrator(input, "source-review-mock", {
      promptVersion: PAID_PROMPT_CURRENT,
      onResponseCreated: receipt,
    });
    const creates = fetcher.mock.calls.filter((c) => c[1]?.method === "POST");
    expect(creates).toHaveLength(1);
    expect(receipt).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(creates[0][1].body),
      sent = JSON.parse(payload.input);
    expect(sent.knowledgeVersion).toBe("paid-retrieval-1.19.0");
    expect(
      sent.knowledge.find((k: Knowledge) => k.id === getSource(palace).id),
    ).toEqual(getSource(palace));
    expect(payload.background).toBe(true);
    expect(payload.instructions).toBe(
      paidInstructions(input, PAID_PROMPT_CURRENT),
    );
    expect(payload.text.format.type).toBe("json_schema");
    expect(
      validatePaidNarration(result.raw, input, PAID_PROMPT_CURRENT),
    ).toBeDefined();
  },
);
it("a saved 1.11 input stays unchanged on GET recovery and is never regenerated or CREATEd", async () => {
  vi.stubEnv("OPENAI_API_KEY", "mock-only-key");
  vi.stubEnv("AI_PAID_READING_MODEL", "gpt-6-astra");
  const saved: MenhInput = structuredClone(paidInput(record, "Quan Lộc"));
  saved.knowledgeVersion = "paid-retrieval-1.11.0";
  const old = saved.knowledge.find((k) => k.sourceReview)!;
  delete old.sourceReview;
  old.text =
    "BẢN INPUT CŨ KIỂM THỬ: giữ nguyên nội dung đã lưu, không hiệu đính khi đọc.";
  const before = hash(saved),
    raw = mockPaidV2(saved).raw,
    fetcher = providerMock(raw),
    receipt = vi.fn(async () => {});
  vi.stubGlobal("fetch", fetcher);
  const result = await openaiNarrator(saved, "existing-attempt-mock", {
    responseId: "resp_source_review_mock",
    promptVersion: PAID_PROMPT_CURRENT,
    onResponseCreated: receipt,
  });
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(fetcher.mock.calls[0][1]?.method || "GET").toBe("GET");
  expect(receipt).not.toHaveBeenCalled();
  expect(hash(saved)).toBe(before);
  expect(saved.knowledgeVersion).toBe("paid-retrieval-1.11.0");
  expect(
    validatePaidNarration(result.raw, saved, PAID_PROMPT_CURRENT),
  ).toBeDefined();
});
