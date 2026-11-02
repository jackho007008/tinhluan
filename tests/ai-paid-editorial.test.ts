import { it, expect, vi, afterEach } from "vitest";
import {
  paidInstructions,
  paidWritePromptVersion,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT as V24 } from "../lib/ai/paid-prompt-v24";
import { PAID_PROMPT_CURRENT as V23 } from "../lib/ai/paid-prompt-v23";
import { paidOutputSchema } from "../lib/ai/paid-version";
import { isOutputValidationError } from "../lib/ai/provider-failure";
import type { MenhInput } from "../lib/ai/contract";
import { PAID_PROMPT_CURRENT as V25 } from "../lib/ai/paid-prompt-v25";
import { PAID_PROMPT_CURRENT as V26 } from "../lib/ai/paid-prompt-v26";
const input = (): MenhInput => ({
  paidTarget: { palace: "Phu Thê", edition: "paid-palaces-ai-1.0.0" },
  version: "paid-facts-1.1.0",
  knowledgeVersion: "paid-retrieval-1.5.0",
  missing: [],
  facts: [
    {
      id: "f",
      text: "Phu Thê tại Tuất: Tả Phù; nhóm phụ tinh",
      kind: "engine",
      paths: ["chart.p.0"],
      provenance: {
        palace: "Phu Thê",
        relation: "target",
        field: "minorStars",
        scope: "natal",
        verification: "source-traced",
        source: "fixture",
      },
    },
    {
      id: "q",
      text: "Quan Lộc tại Thìn: Tử Vi",
      kind: "engine",
      paths: ["chart.p.1"],
      provenance: {
        palace: "Quan Lộc",
        relation: "opposition",
        field: "majorStars",
        scope: "natal",
        verification: "source-traced",
        source: "fixture",
      },
    },
  ],
  knowledge: [
    {
      id: "paid-library.thp2-phu-ta-huu",
      title: "Nguồn fixture trợ giúp",
      text: "Hình tượng từng trợ giúp mệnh tạo trong một giai đoạn; quan niệm có chỗ va chạm.",
      conditions: ["Tả tại Phu"],
      limits: ["Không xác nhận thực tế"],
      group: "B",
      application: "direct",
      subjectPalaces: ["Phu Thê"],
      selection: "matched-snapshot",
      references: [{ title: "Nguồn fixture", location: "Kỹ thuật" }],
      passage: {
        version: "paid-library-1.0.0",
        digest: "a".repeat(64),
        kind: "direct",
        anchorFactIds: ["f"],
      },
    },
    {
      id: "c",
      title: "Nguồn fixture Quan",
      text: "Tử Vi–Thiên Tướng tại Quan Lộc có lời về tổ chức và ranh giới thẩm quyền.",
      conditions: ["Đúng bộ tại Quan"],
      limits: ["Không luận hôn nhân"],
      group: "C",
      application: "context",
      subjectPalaces: ["Quan Lộc"],
      selection: "matched-saved-context",
      references: [{ title: "Nguồn fixture", location: "Kỹ thuật" }],
    },
  ],
});
const content = (): any => ({
  schemaVersion: "paid-reading-v2.0.0",
  coverage: "limited",
  coverageNote: "BẢN MOCK",
  limitations: ["Không xác nhận hoàn cảnh thực tế."],
  sections: [
    {
      id: "help",
      role: "analysis",
      title: "Lời nguồn — MOCK",
      paragraphs: [
        {
          text: "BẢN MOCK. Nguồn Tả Phù tại Phu nói trợ giúp qua một giai đoạn và khác biệt quan niệm.",
          basis: "source-interpretation",
          factIds: ["f"],
          knowledgeIds: ["paid-library.thp2-phu-ta-huu"],
        },
      ],
    },
    {
      id: "context",
      role: "context",
      title: "Ngữ cảnh — MOCK",
      paragraphs: [
        {
          text: "BẢN MOCK. Tại Quan Lộc, lời nguồn giữ hai mặt tổ chức và ranh giới quyền hạn.",
          basis: "source-interpretation",
          factIds: ["q"],
          knowledgeIds: ["c"],
        },
        {
          text: "BẢN MOCK. Đọc cạnh Phu Thê, lời ở Quan Lộc giúp phân biệt tổ chức công việc với trợ giúp và khác quan niệm trong quan hệ; đây là phép nối biên tập, không kết luận về người thật.",
          basis: "ai-synthesis",
          factIds: ["q", "f"],
          knowledgeIds: ["c", "paid-library.thp2-phu-ta-huu"],
        },
      ],
    },
  ],
});
afterEach(() => vi.unstubAllEnvs());
it("accepts split source/context and synthesis with one temporal statement, not forced repetition", () => {
  expect(validatePaidNarration(content(), input(), V24)).toMatchObject({
    coverage: "limited",
  });
});
it.each([
  "Đọc cạnh Phu Thê",
  "Đặt hai phương diện cạnh nhau",
  "Nếu đối chiếu với Phu Thê",
  "Phép nối này",
  "Liên hệ sang Phu Thê",
])("rejects obvious editorial link in source-interpretation: %s", (marker) => {
  const r = content();
  r.sections[1].paragraphs[0].text +=
    " " + marker + ", lời ở Quan Lộc có thêm ý nghĩa khi bàn quan hệ.";
  expect(() => validatePaidNarration(r, input(), V24)).toThrow(
    "AI_MIXED_ATTRIBUTION",
  );
});
it("keeps source-authored connections available when the cited source itself contains that connection", () => {
  const r = content(),
    i = input();
  i.knowledge[1].text +=
    " Đọc cạnh Phu Thê là một hướng tác giả nêu trong fixture.";
  r.sections[1].paragraphs[0].text +=
    " Đọc cạnh Phu Thê theo cách tác giả nêu ở Quan Lộc.";
  expect(() => validatePaidNarration(r, i, V24)).not.toThrow();
});
it.each(["có sự trợ giúp", "nhận được giúp đỡ", "được hỗ trợ"])(
  "rejects lost time qualifier: %s",
  (text) => {
    const r = content();
    r.sections[0].paragraphs[0].text =
      "BẢN MOCK. Tả Phù tại Phu nêu " + text + " và khác biệt quan niệm.";
    expect(() => validatePaidNarration(r, input(), V24)).toThrow(
      "AI_SOURCE_QUALIFIER_LOST",
    );
  },
);
it.each([
  "trợ giúp qua một giai đoạn",
  "hỗ trợ trong một thời kỳ",
  "từng giúp đỡ",
  "đã nhận được trợ giúp",
  "trợ giúp ở một chặng",
])("allows equivalent temporal phrasing: %s", (text) => {
  const r = content();
  r.sections[0].paragraphs[0].text =
    "BẢN MOCK. Tả Phù tại Phu là hình tượng " +
    text +
    " và khác biệt quan niệm.";
  expect(() => validatePaidNarration(r, input(), V24)).not.toThrow();
});
it("does not demand the time clause when discussing only the independent difference-of-opinion facet", () => {
  const r = content();
  r.sections[0].paragraphs[0].text =
    "BẢN MOCK. Tả Phù tại Phu có lời về khác biệt quan niệm.";
  r.sections[1].paragraphs.pop();
  expect(() => validatePaidNarration(r, input(), V24)).not.toThrow();
});
it("cannot avoid the temporal requirement by labeling every assistance claim synthesis", () => {
  const r = content();
  r.sections[0].paragraphs[0].basis = "ai-synthesis";
  r.sections[0].paragraphs[0].text = "BẢN MOCK. Có sự trợ giúp trong quan hệ.";
  expect(() => validatePaidNarration(r, input(), V24)).toThrow(
    "AI_SOURCE_QUALIFIER_LOST",
  );
});
it("supports lowercase/NFD Vietnamese and preserves unknown reference, C and medical guards", () => {
  const r = content();
  r.sections[0].paragraphs[0].text = r.sections[0].paragraphs[0].text
    .toLowerCase()
    .normalize("NFD");
  expect(() => validatePaidNarration(r, input(), V24)).not.toThrow();
  r.sections[1].paragraphs[1].text = "BẢN MOCK: phép nối sang quan hệ.";
  expect(() => validatePaidNarration(r, input(), V24)).toThrow(
    "AI_CONTEXT_AS_DIRECT",
  );
  r.sections[1].paragraphs[1].text = "Quan Lộc trong BẢN MOCK.";
  r.sections[0].paragraphs[0].knowledgeIds = ["wrong"];
  expect(() => validatePaidNarration(r, input(), V24)).toThrow(
    "AI_UNKNOWN_REFERENCE",
  );
  r.sections[0].paragraphs[0].knowledgeIds = ["paid-library.thp2-phu-ta-huu"];
  r.coverageNote = "Bạn mắc bệnh tim.";
  expect(() => validatePaidNarration(r, input(), V24)).toThrow(
    "AI_SCOPE_VIOLATION",
  );
});
it("old 2.3 retains its validator while only the opt-in writer chooses 2.6", () => {
  const r = content();
  r.sections[0].paragraphs[0].text = "BẢN MOCK. Tả Phù có sự trợ giúp.";
  r.sections[1].paragraphs[1].basis = "source-interpretation";
  expect(() => validatePaidNarration(r, input(), V23)).not.toThrow();
  expect(() => validatePaidNarration(r, input(), V24)).toThrow();
  expect(paidInstructions(input(), V23)).not.toContain("TÁCH LỜI NGUỒN");
  expect(paidInstructions(input(), V24)).toContain(
    "trợ giúp qua một giai đoạn",
  );
  expect(paidOutputSchema(V24)).toBe(paidOutputSchema(V23));
  vi.stubEnv("AI_PAID_READING_V2_ENABLED", "true");
  expect(paidWritePromptVersion()).toBe(V26);
});
it.each(["AI_MIXED_ATTRIBUTION", "AI_SOURCE_QUALIFIER_LOST"])(
  "classifies %s as output validation, not provider billing or model failure",
  (code) => {
    expect(isOutputValidationError(code)).toBe(true);
  },
);

it("2.4 keeps the reviewed-foundation limited path introduced in 2.3", () => {
  const i = input(),
    r = content();
  i.knowledge[0].application = "reference-only";
  i.knowledge[0].passage!.kind = "foundation";
  r.sections[0].paragraphs[0].basis = "ai-synthesis";
  expect(() => validatePaidNarration(r, i, V23)).not.toThrow();
  expect(() => validatePaidNarration(r, i, V24)).not.toThrow();
});

it("2.5 adds a grounded context comparison and places general limits once without deleting source conditions", () => {
  const before = paidInstructions(input(), V24);
  const after = paidInstructions(input(), V25);
  expect(before).not.toContain("CHIỀU SÂU LIÊN CUNG");
  expect(after).toContain("CHIỀU SÂU LIÊN CUNG");
  expect(after).toContain("cả hai phía đã có nguồn và facts phù hợp");
  expect(after).toContain(
    "Nếu chỉ có lời trợ giúp, không suy thêm xung động hay tranh quyền",
  );
  expect(after).toContain("Đặt giới hạn chung");
  expect(after).toContain("Conditions riêng");
  expect(after).toContain("không gom mất xuống cuối");
  expect(paidOutputSchema(V25)).toBe(paidOutputSchema(V24));
});

it("2.5 accepts one shared limitation with separate source and synthesis paragraphs", () => {
  const r = content();
  r.sections[1].paragraphs[1].text =
    "BẢN MOCK. Đọc lời Quan Lộc về tổ chức cạnh khác biệt quan niệm tại Phu Thê, cách thực hiện và sự đồng thuận là hai phương diện cần phân biệt: một việc được sắp xếp rõ ràng vẫn có thể được hai người nhìn nhận khác nhau.";
  expect(validatePaidNarration(r, input(), V25)).toMatchObject({
    coverage: "limited",
  });
  expect(r.limitations).toHaveLength(1);
  // Technical acceptance is not a claim that these synthetic facts prove an astrological rule.
});

it.each([V24, V25, V26])(
  "%s preserves attribution, time, C origin, references and medical guards",
  (version) => {
    const r = content();
    expect(() => validatePaidNarration(r, input(), version)).not.toThrow();
    r.sections[1].paragraphs[1].basis = "source-interpretation";
    expect(() => validatePaidNarration(r, input(), version)).toThrow(
      "AI_MIXED_ATTRIBUTION",
    );
    r.sections[1].paragraphs[1].basis = "ai-synthesis";
    r.sections[0].paragraphs[0].text = "Tả Phù có sự trợ giúp.";
    expect(() => validatePaidNarration(r, input(), version)).toThrow(
      "AI_SOURCE_QUALIFIER_LOST",
    );
    r.sections[0].paragraphs[0].text =
      "Tả Phù từng trợ giúp qua một giai đoạn.";
    r.sections[1].paragraphs[1].text = "Phép nối sang Phu Thê.";
    expect(() => validatePaidNarration(r, input(), version)).toThrow(
      "AI_CONTEXT_AS_DIRECT",
    );
    r.sections[1].paragraphs[1].text = "Quan Lộc và Phu Thê trong bản mock.";
    r.sections[0].paragraphs[0].knowledgeIds = ["missing"];
    expect(() => validatePaidNarration(r, input(), version)).toThrow(
      "AI_UNKNOWN_REFERENCE",
    );
    r.sections[0].paragraphs[0].knowledgeIds = ["paid-library.thp2-phu-ta-huu"];
    r.limitations = ["Bạn mắc bệnh tim."];
    expect(() => validatePaidNarration(r, input(), version)).toThrow(
      "AI_SCOPE_VIOLATION",
    );
  },
);
