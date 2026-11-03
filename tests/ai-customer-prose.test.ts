import { afterEach, expect, it, vi } from "vitest";
import type { MenhInput } from "../lib/ai/contract";
import { validateCustomerProse } from "../lib/ai/customer-prose";
import {
  PAID_PALACES,
  paidInstructions,
  paidWritePromptVersion,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT as V27 } from "../lib/ai/paid-prompt-v27";
import { PAID_PROMPT_CURRENT as V26 } from "../lib/ai/paid-prompt-v26";
import { paidOutputSchema } from "../lib/ai/paid-version";
import { readPaidContent } from "../lib/ai/paid-result";
import { isOutputValidationError } from "../lib/ai/provider-failure";
import {
  supportedV1Prompt,
  V1_EDIT_PROMPT,
  v1EditInstructions,
  validateV1Edit,
  type V1EditUnit,
} from "../lib/ai/v1-edit";

const input = (): MenhInput => ({
  version: "paid-facts-1.1.0",
  knowledgeVersion: "paid-retrieval-1.14.0",
  paidTarget: { palace: "Tài Bạch", edition: "paid-palaces-ai-1.0.0" },
  missing: [],
  facts: [
    {
      id: "f",
      kind: "engine",
      text: "Tài Bạch tại Thân: Liêm Trinh.",
      paths: ["chart.palaces.6"],
    },
  ],
  knowledge: [
    {
      id: "k",
      title: "Lời nguồn có căn cứ",
      text: "Kiếm tiền qua cạnh tranh; tích lũy cần thời gian.",
      conditions: ["Liêm độc thủ Thân"],
      limits: ["Không hứa thu nhập"],
      references: [
        { title: "Nguyễn Phát Lộc — Tử Vi Tổng Hợp", location: "PDF 261" },
      ],
      selection: "matched-snapshot",
      group: "A",
      application: "direct",
      subjectPalaces: ["Tài Bạch"],
    },
  ],
});
const output = (): any => ({
  schemaVersion: "paid-reading-v2.0.0",
  coverage: "limited",
  coverageNote: "BẢN MOCK. Bài bàn về kiếm tiền và giữ lại tiền.",
  sections: [
    {
      id: "earning",
      role: "analysis",
      title: "Kiếm tiền cần thời gian",
      paragraphs: [
        {
          text: "BẢN MOCK. Liêm Trinh tại Tài Bạch gợi cách kiếm tiền có cạnh tranh, tích lũy cần thời gian.",
          basis: "source-interpretation",
          factIds: ["f"],
          knowledgeIds: ["k"],
        },
      ],
    },
  ],
  limitations: [
    "Cách đọc này không xác nhận hoàn cảnh tài chính thực tế của bạn.",
  ],
});
afterEach(() => vi.unstubAllEnvs());

it.each(PAID_PALACES)(
  "plain-language policy applies to every new paid palace: %s",
  (palace) => {
    const i = input();
    i.paidTarget!.palace = palace;
    const prompt = paidInstructions(i, V27);
    expect(prompt).toContain("người chưa biết Tử Vi");
    expect(prompt).toContain("Không nhắc tên sách, tác giả, website");
    expect(prompt).toContain("từng trợ giúp qua một giai đoạn");
    expect(prompt).toContain("không chẩn đoán");
    expect(prompt).toContain("chỉ trình bày phần đủ căn cứ");
    expect(prompt).not.toContain("paragraph1 nêu tác giả");
  },
);
it("selects 2.7 for new V2 jobs but preserves schema and saved 2.6 prompt", () => {
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "true");
  expect(paidWritePromptVersion()).toBe(V27);
  expect(paidOutputSchema(V27)).toBe(paidOutputSchema(V26));
  expect(paidInstructions(input(), V26)).not.toContain(
    "LỜI VĂN DÀNH CHO NGƯỜI CHƯA HỌC",
  );
});
it.each([
  "Theo Tân Biên, bạn có thể tích lũy.",
  "NGUYỄN PHÁT LỘC mô tả cách kiếm tiền.",
  "Nguyen Phat Loc mo ta cach kiem tien.",
  "Tử Vi Tổng Hợp có lời về cạnh tranh.",
  "Trung Châu Tử Vi Đẩu Số có một nhánh.",
  "Theo sách, bạn có thể giữ tiền.",
  "Tác giả cho rằng bạn có thể giữ tiền.",
  "Nguồn này bàn về phần chi tiêu.",
  "Mệnh tạo nên đọc nhánh nguồn.",
  "Xem https://example.test/reading",
])(
  "blocks source/citation/internal prose without stripping the result: %s",
  (text) => {
    expect(() => validateCustomerProse([text])).toThrow("AI_CUSTOMER_PROSE");
  },
);
it("normalizes accents, punctuation and zero-width characters in known source names", () => {
  expect(() =>
    validateCustomerProse(["Tân\u200b Biên".normalize("NFD")]),
  ).toThrow("AI_CUSTOMER_PROSE");
  expect(() => validateCustomerProse(["NGUYỄN—PHÁT—LỘC"])).toThrow(
    "AI_CUSTOMER_PROSE",
  );
});
it("uses reference titles for additional books while keeping ordinary star and finance terms", () => {
  expect(() =>
    validateCustomerProse(
      ["Chuyên Khảo Quan Hệ Gia Đình có lời luận."],
      ["Chuyên Khảo Quan Hệ Gia Đình"],
    ),
  ).toThrow("AI_CUSTOMER_PROSE");
  expect(() =>
    validateCustomerProse(
      [
        "Sao Tử Vi ở Quan Lộc; nguồn thu và nguồn lực cần được xét riêng. Hóa Quyền tại Quan Lộc.",
      ],
      ["Sao Tử Vi"],
    ),
  ).not.toThrow();
});
it.each(["paragraph", "title", "coverageNote", "limitation"])(
  "checks new customer-facing %s only, leaving reference metadata intact",
  (field) => {
    const i = input(),
      raw = output();
    expect(validatePaidNarration(raw, i, V27)).toEqual(raw);
    const original = structuredClone(i);
    if (field === "paragraph")
      raw.sections[0].paragraphs[0].text =
        "Theo Tân Biên, cần cạnh tranh để kiếm tiền.";
    if (field === "title") raw.sections[0].title = "Nguyễn Phát Lộc";
    if (field === "coverageNote") raw.coverageNote = "Tử Vi Tổng Hợp";
    if (field === "limitation")
      raw.limitations = ["Theo sách, chưa luận toàn bộ."];
    expect(() => validatePaidNarration(raw, i, V27)).toThrow(
      "AI_CUSTOMER_PROSE",
    );
    expect(() => validatePaidNarration(raw, i, V26)).not.toThrow();
    expect(i).toEqual(original);
  },
);
it("does not rewrite or reject an old reading at read time", () => {
  const raw = output();
  raw.sections[0].paragraphs[0].text =
    "Theo Tân Biên, cần cạnh tranh để kiếm tiền.";
  const before = JSON.stringify(raw);
  expect(readPaidContent({ content: raw, promptVersion: V26 })).not.toBeNull();
  expect(JSON.stringify(raw)).toBe(before);
  expect(isOutputValidationError("AI_CUSTOMER_PROSE")).toBe(true);
});
it("keeps medical and reference guards on new plain-language output", () => {
  const i = input(),
    raw = output();
  i.paidTarget!.palace = "Tật Ách";
  raw.sections[0].paragraphs[0].text = "Bạn mắc bệnh tim.";
  expect(() => validatePaidNarration(raw, i, V27)).toThrow(
    "AI_SCOPE_VIOLATION",
  );
  raw.sections[0].paragraphs[0].text =
    "BẢN MOCK. Kiếm tiền có thể cần cạnh tranh.";
  raw.sections[0].paragraphs[0].factIds = ["not-a-fact"];
  expect(() => validatePaidNarration(raw, i, V27)).toThrow(
    "AI_UNKNOWN_REFERENCE",
  );
});
it("keeps the time qualifier when removing source names from a Phu Thê paragraph", () => {
  const i = input(),
    raw = output();
  i.paidTarget!.palace = "Phu Thê";
  i.facts[0].text = "Phu Thê tại Tuất: Tả Phù.";
  i.knowledge[0] = {
    ...i.knowledge[0],
    id: "paid-library.thp2-phu-ta-huu",
    subjectPalaces: ["Phu Thê"],
    text: "Từng trợ giúp mệnh tạo qua một giai đoạn.",
    passage: {
      version: "paid-library-1.0.0",
      kind: "direct",
      digest: "a".repeat(64),
      anchorFactIds: ["f"],
    },
  };
  const p = raw.sections[0].paragraphs[0];
  p.knowledgeIds = [i.knowledge[0].id];
  p.text =
    "BẢN MOCK. Tả Phù ở Phu Thê gợi hình tượng người từng trợ giúp bạn qua một giai đoạn; chưa xác nhận một người có thật.";
  expect(() => validatePaidNarration(raw, i, V27)).not.toThrow();
  p.text = "BẢN MOCK. Tả Phù ở Phu Thê có sự trợ giúp.";
  expect(() => validatePaidNarration(raw, i, V27)).toThrow(
    "AI_SOURCE_QUALIFIER_LOST",
  );
});
it("versions future Luna edits while retaining 1.0/1.1 validation and source metadata", () => {
  const unit: V1EditUnit = {
    sourceVersion: "fixture",
    title: "Mệnh",
    text: "Vũ Khúc gợi sự quả quyết, chưa xác nhận tính cách thực tế.",
    original: "Fixture",
    conditions: [],
    conditionalAssessment: [],
    context: null,
    relations: [],
    sentences: [],
  };
  expect(V1_EDIT_PROMPT).toBe("menh-v1-copyedit-1.2.0");
  expect(supportedV1Prompt("menh-v1-copyedit-1.1.0")).toBe(true);
  expect(v1EditInstructions("menh-v1-copyedit-1.1.0")).not.toContain(
    "LỜI VĂN DÀNH CHO NGƯỜI CHƯA HỌC",
  );
  expect(v1EditInstructions()).toContain("Không nhắc tên sách, tác giả");
  expect(validateV1Edit({ text: unit.text }, unit)).toBe(unit.text);
  const oldText = unit.text + " Theo Tân Biên.";
  expect(() =>
    validateV1Edit({ text: oldText }, unit, "menh-v1-copyedit-1.1.0"),
  ).not.toThrow();
  expect(() => validateV1Edit({ text: oldText }, unit)).toThrow(
    "AI_CUSTOMER_PROSE",
  );
});
