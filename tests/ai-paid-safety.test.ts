import { it, expect } from "vitest";
import {
  validatePaidNarration,
  paidInstructions,
  PAID_EDITION,
} from "../lib/ai/paid-contract";
import { mockPaidGeneration } from "./fixtures/ai-paid-mock";
import type { MenhInput } from "../lib/ai/contract";
const input: MenhInput = {
  version: "paid-facts-1.1.0",
  knowledgeVersion: "paid-retrieval-1.1.1",
  paidTarget: { palace: "Tật Ách", edition: PAID_EDITION },
  facts: [
    {
      id: "target",
      kind: "engine",
      paths: ["chart.palaces"],
      text: "Tật Ách tại Mùi: vô chính diệu; chỉ giữ dữ kiện bản mệnh đã lưu.",
    },
  ],
  knowledge: [],
  missing: [],
};
it.each([
  "Không chẩn đoán bệnh.",
  "Không điều trị.",
  "Không chẩn đoán, không điều trị.",
  "Bài viết này không chẩn đoán bệnh.",
  "Không dự báo tuổi thọ hoặc tử vong.",
])(
  "allows a complete safe limitation, not an affirmative medical claim: %s",
  (text) => {
    const raw: any = mockPaidGeneration(input).raw;
    raw.limitations = [text];
    expect(() => validatePaidNarration(raw, input)).not.toThrow();
  },
);
it.each([
  "Bạn sẽ mắc bệnh và cần điều trị ngay.",
  "Lá số chẩn đoán bạn có bệnh.",
  "Bạn có tuổi thọ 65 năm.",
  "Không chẩn đoán bệnh, nhưng cần điều trị ngay.",
  "Không phải không chẩn đoán bệnh.",
  "Không điều trị là không đúng; bạn cần điều trị.",
  "Không chẩn đoán bệnh. Bạn sẽ mắc bệnh.",
])("rejects medical claim/negation laundering: %s", (text) => {
  const raw: any = mockPaidGeneration(input).raw;
  raw.sections[0].content =
    text + " Đây là câu kiểm thử, không phải kết quả thật.";
  expect(() => validatePaidNarration(raw, input)).toThrow("AI_SCOPE_VIOLATION");
});
it("keeps the exact old prompt addressable", () => {
  expect(paidInstructions(input, "paid-palaces-vietnamese-1.1.0")).toContain(
    "Khoảng900–1300từ",
  );
});
it.each([
  "Không chẩn đoán bệnh nhưng hãy dùng thuốc.",
  "Không điều trị; dùng thuốc này mỗi ngày.",
  "Không chẩn đoán, không điều trị nhưng cần kê đơn.",
  "Bạn bị ung thư.",
  "Bạn cần dùng thuốc theo lá số.",
])("rejects advice or diagnosis even with a safe prefix: %s", (text) => {
  const raw: any = mockPaidGeneration(input).raw;
  raw.sections[1].content = text + " Đây là ca kiểm thử riêng của validator.";
  expect(() => validatePaidNarration(raw, input)).toThrow("AI_SCOPE_VIOLATION");
});
it("preserves hash of the full 1.1.0 prompt and introduces substantive editorial rules only in 1.2.0", async () => {
  const { createHash } = await import("node:crypto");
  const q = {
    ...input,
    paidTarget: { palace: "Quan Lộc", edition: PAID_EDITION },
  };
  expect(
    createHash("sha256")
      .update(paidInstructions(q, "paid-palaces-vietnamese-1.1.0"))
      .digest("hex"),
  ).toBe("15f9bd0959005d07fc32b44cdc17785c946c636ca07c5dcc8099d7e8266e4a60");
  const prompt = paidInstructions(q);
  expect(prompt).toContain("paid-palaces-vietnamese-1.2.0");
  expect(prompt).toContain("Không mục tiêu số từ");
  expect(prompt).toContain("Không biến bài thành coaching chung");
  expect(prompt).toContain("không dùng D như chứng cứ trực tiếp");
});
it("accepts the same complete limitation inside the body while keeping Bệnh Phù as a star name", () => {
  const raw: any = mockPaidGeneration(input).raw;
  raw.sections[0].content =
    "Không chẩn đoán bệnh. Bệnh Phù là tên sao trong dữ kiện bản mệnh, không tự suy thành một tình trạng sức khỏe.";
  expect(() => validatePaidNarration(raw, input)).not.toThrow();
});
it("keeps legacy 1.0.0 prompt bytes, and rejects unsupported versions", async () => {
  const { createHash } = await import("node:crypto");
  const q = {
    ...input,
    paidTarget: { palace: "Quan Lộc", edition: PAID_EDITION },
  };
  expect(
    createHash("sha256")
      .update(paidInstructions(q, "paid-palaces-vietnamese-1.0.0"))
      .digest("hex"),
  ).toBe("02bba40a5cfeea44f34a082000ddebb045f8dc965844fb144849ddee88384a81");
  expect(() => paidInstructions(q, "paid-palaces-vietnamese-9.0.0")).toThrow(
    "AI_PROMPT_VERSION_UNSUPPORTED",
  );
});
it("does not launder a forbidden phrase split between title and content", () => {
  const raw: any = mockPaidGeneration(input).raw;
  raw.sections[0].title = "Chẩn";
  raw.sections[0].content =
    "đoán bệnh từ cung Tật là một nhận định y khoa không hợp lệ.";
  expect(() => validatePaidNarration(raw, input)).toThrow("AI_SCOPE_VIOLATION");
});
