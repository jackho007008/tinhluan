import { expect, it } from "vitest";
import type { MenhInput } from "../lib/ai/contract";
import {
  paidInstructions,
  validatePaidNarration,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT as V28 } from "../lib/ai/paid-prompt-v28";
import { PAID_PROMPT_CURRENT as V27 } from "../lib/ai/paid-prompt-v27";
const fixture = () => {
  const input: MenhInput = {
    version: "paid-facts-1.1.0",
    knowledgeVersion: "paid-retrieval-1.14.0",
    paidTarget: { palace: "Tài Bạch", edition: "paid-palaces-ai-1.0.0" },
    missing: [],
    facts: [
      {
        id: "palace.6.location",
        kind: "engine",
        text: "Tài Bạch tại Thân; can cung Mậu.",
        paths: ["chart.palaces.6"],
      },
      ...[
        ["6", "Tài Bạch", "Thân", "target"],
        ["10", "Mệnh", "Tý", "trine"],
        ["2", "Quan Lộc", "Thìn", "trine"],
      ].map(([i, p, b, r]): any => ({
        id: `palace.${i}.majorStars.0`,
        kind: "engine",
        text: `${p} tại ${b}: SAO FIXTURE; nhóm chính tinh.`,
        paths: [`chart.palaces.${i}.majorStars.0`],
        provenance: {
          palace: p,
          relation: r,
          field: "majorStars",
          scope: "natal",
          verification: "source-traced",
          source: "TECHNICAL FIXTURE, not a real source",
        },
      })),
      {
        id: "geometry.tam-hop",
        kind: "geometry",
        text: "tam-hop của Tài Bạch: Mệnh tại Tý; Quan Lộc tại Thìn. Chỉ xác định vị trí.",
        paths: ["chart.palaces"],
      },
    ],
    knowledge: [],
  };
  input.knowledge = [
    {
      id: "fixture-foundation",
      title: "Technical foundation",
      text: "TECHNICAL ONLY, not a personal reading.",
      conditions: ["All recorded premises must match."],
      limits: ["No personal prediction."],
      references: [{ title: "Technical fixture", location: "unit fixture" }],
      group: "B",
      application: "reference-only",
      selection: "reference-only",
      subjectPalaces: ["Tài Bạch"],
      passage: {
        version: "paid-library-1.0.0",
        kind: "foundation",
        digest: "a".repeat(64),
        anchorFactIds: input.facts
          .filter((f) => f.kind === "engine")
          .map((f) => f.id),
      },
    },
  ];
  const raw: any = {
    schemaVersion: "paid-reading-v2.0.0",
    coverage: "limited",
    coverageNote: "BẢN MOCK kỹ thuật, không bài luận thật.",
    limitations: ["Chỉ kiểm hợp đồng tham chiếu."],
    sections: [
      {
        id: "test",
        role: "context",
        title: "BẢN MOCK",
        paragraphs: [
          {
            text: "BẢN MOCK tổng hợp có giới hạn, giữ Mệnh và Quan Lộc đúng cung gốc.",
            basis: "ai-synthesis",
            factIds: input.facts.map((f) => f.id),
            knowledgeIds: ["fixture-foundation"],
          },
        ],
      },
    ],
  };
  return { input, raw };
};
it("admits a condition-matched cross-palace foundation only in 2.8, without changing input or output", () => {
  const { input, raw } = fixture(),
    before = JSON.stringify({ input, raw });
  expect(() => validatePaidNarration(raw, input, V27)).toThrow(
    "AI_REFERENCE_SCOPE",
  );
  expect(validatePaidNarration(raw, input, V28)).toEqual(raw);
  expect(JSON.stringify({ input, raw })).toBe(before);
});
it.each([
  "missing-anchor",
  "uncited-anchor",
  "uncited-geometry",
  "missing-geometry",
  "wrong-geometry-kind",
  "wrong-geometry-origin",
  "wrong-geometry-place",
  "wrong-geometry-branch",
  "unverified",
  "source-conflict",
  "wrong-relation",
  "wrong-target-relation",
  "wrong-scope",
  "wrong-location",
  "wrong-path",
  "wrong-subject",
  "no-target-anchor",
  "bad-digest",
  "no-passage",
  "method",
  "missing-origin-name",
])("rejects unsupported foundation premises: %s", (mode) => {
  const { input, raw } = fixture(),
    p = raw.sections[0].paragraphs[0],
    k = input.knowledge[0],
    f = input.facts[2],
    g = input.facts[4];
  if (mode === "missing-anchor")
    input.facts = input.facts.filter((x) => x !== f);
  if (mode === "uncited-anchor")
    p.factIds = p.factIds.filter((id: string) => id !== f.id);
  if (mode === "uncited-geometry")
    p.factIds = p.factIds.filter((id: string) => id !== g.id);
  if (mode === "missing-geometry")
    input.facts = input.facts.filter((x) => x !== g);
  if (mode === "wrong-geometry-kind") g.kind = "engine";
  if (mode === "wrong-geometry-origin")
    g.text = g.text.replace("của Tài Bạch", "của Phu Thê");
  if (mode === "wrong-geometry-place")
    g.text = g.text.replace("Mệnh", "Phúc Đức");
  if (mode === "wrong-geometry-branch") g.text = g.text.replace("Tý", "Dần");
  if (mode === "unverified") f.provenance!.verification = "upstream-unverified";
  if (mode === "source-conflict")
    f.provenance!.verification = "source-conflict";
  if (mode === "wrong-relation") f.provenance!.relation = "adjacent";
  if (mode === "wrong-target-relation")
    input.facts[1].provenance!.relation = "trine";
  if (mode === "wrong-scope") f.provenance!.scope = "transit" as any;
  if (mode === "wrong-location")
    input.facts[0].text = "Tài Bạch tại Dần; can cung Mậu.";
  if (mode === "wrong-path") input.facts[0].paths = ["chart.palaces.5"];
  if (mode === "wrong-subject") k.subjectPalaces = ["Quan Lộc"];
  if (mode === "no-target-anchor") k.passage!.anchorFactIds = [f.id];
  if (mode === "bad-digest") k.passage!.digest = "unverified";
  if (mode === "no-passage") k.passage = undefined;
  if (mode === "method") k.passage!.kind = "method";
  if (mode === "missing-origin-name") p.text = "BẢN MOCK chỉ nói Tài Bạch.";
  expect(() => validatePaidNarration(raw, input, V28)).toThrow();
});
it("supports verified opposition, not a replacement by trine or adjacency", () => {
  const { input, raw } = fixture();
  input.facts = input.facts.filter((f) => f.provenance?.palace !== "Quan Lộc");
  input.knowledge[0].passage!.anchorFactIds =
    input.knowledge[0].passage!.anchorFactIds.filter(
      (id) => id !== "palace.2.majorStars.0",
    );
  const opposite = input.facts.find((f) => f.provenance?.palace === "Mệnh")!;
  opposite.provenance!.relation = "opposition";
  opposite.text = opposite.text.replace("Tý", "Dần");
  input.facts[3] = {
    ...input.facts[3],
    id: "geometry.xung-chieu",
    text: "xung-chieu của Tài Bạch: Mệnh tại Dần.",
  };
  raw.sections[0].paragraphs[0].factIds = input.facts.map((f) => f.id);
  // Technical fixture for guard branching; not an engine chart.
  expect(() => validatePaidNarration(raw, input, V28)).not.toThrow();
});
it.each([
  "source-interpretation",
  "focused",
  "C",
  "D",
  "medical",
  "unknown-reference",
])(
  "does not upgrade foundation into direct/paid depth or weaken safety: %s",
  (mode) => {
    const { input, raw } = fixture(),
      p = raw.sections[0].paragraphs[0];
    if (mode === "source-interpretation") p.basis = "source-interpretation";
    if (mode === "focused") {
      raw.coverage = "focused";
      raw.sections.push({ ...raw.sections[0], id: "second" });
    }
    if (mode === "C") {
      input.knowledge[0].group = "C";
      p.basis = "source-interpretation";
    }
    if (mode === "D") input.knowledge[0].group = "D";
    if (mode === "medical") p.text += " Bạn bị ung thư.";
    if (mode === "unknown-reference") p.knowledgeIds.push("missing");
    expect(() => validatePaidNarration(raw, input, V28)).toThrow();
  },
);
it.each(["Phụ Mẫu", "Huynh Đệ", "Tử Nữ", "Phu Thê", "Tài Bạch"])(
  "2.8 asks for a non-redundant, grounded reading at %s without changing the 2.7 prompt",
  (palace) => {
    const { input } = fixture();
    input.paidTarget!.palace = palace;
    const old = paidInstructions(input, V27),
      now = paidInstructions(input, V28);
    expect(now).toContain(V28);
    expect(old).toContain(V27);
    expect(now).toContain("Nếu phần tổng hợp chỉ nói lại");
    if (palace === "Tử Nữ") expect(now).toContain("Không dựng tính cách");
    expect(now).toContain("không thành kết luận trực tiếp");
    expect(now).toContain("không nêu tên tác giả hoặc sách");
    expect(now).toContain("Không tự chọn sao cùng tên");
    expect(now).toContain("không dùng Khoa hóa giải");
    expect(old).not.toContain("TRỌNG TÂM BIÊN TẬP CUNG ĐANG ĐỌC");
  },
);
