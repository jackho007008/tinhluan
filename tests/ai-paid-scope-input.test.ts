import { beforeAll, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { paidInput } from "../lib/ai/paid-input";
import { paidLibrary, LIBRARY_MAX_BYTES } from "../lib/ai/paid-library";
import { paidKnowledge } from "../lib/ai/paid-retrieval";
import { validatePaidNarration, paidUserInput } from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v26";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
let record: any;
const ids: Record<string, string> = {
  "Phu Thê": "thp2-phu-combination-scope",
  "Tài Bạch": "tb41-tai-hao-scope",
  "Tật Ách": "tb182-tat-t1-branches",
};
beforeAll(async () => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA scope input",
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
it.each(Object.keys(ids))(
  "new %s input carries a bounded, source-checked unit without changing the snapshot",
  (target) => {
    const before = JSON.stringify(record),
      i = paidInput(record, target),
      k = i.knowledge.find((k) => k.id === "paid-library." + ids[target]);
    expect(k).toBeDefined();
    expect(i.knowledgeVersion).toBe("paid-retrieval-1.13.0");
    expect(k!.application).toBe("reference-only");
    expect(k!.group).toBe(target === "Tài Bạch" ? "B" : "D");
    expect(k!.passage!.kind).toBe(
      target === "Tài Bạch" ? "foundation" : "method",
    );
    expect(JSON.parse(paidUserInput(i)).knowledge).toContainEqual(k);
    expect(JSON.stringify(record)).toBe(before);
    const library = paidLibrary(i, target);
    expect(library.items.length).toBeLessThanOrEqual(4);
    expect(
      library.items.reduce(
        (n, k) => n + Buffer.byteLength(JSON.stringify(k)),
        0,
      ),
    ).toBeLessThanOrEqual(LIBRARY_MAX_BYTES);
    expect(
      i.knowledge.filter((k) => k.group === "D").length,
    ).toBeLessThanOrEqual(3);
    const trace = paidKnowledge(record, target);
    expect(trace.contextSelection.usedBytes).toBeLessThanOrEqual(
      trace.contextSelection.byteBudget,
    );
    expect(() =>
      validatePaidNarration(mockPaidV2(i).raw, i, PAID_PROMPT_CURRENT),
    ).not.toThrow();
  },
);
it("Tài can synthesize the grounded Hao foundation with Liêm, without promoting it to a direct combination", () => {
  const i = paidInput(record, "Tài Bạch"),
    k = i.knowledge.find((k) => k.id === "paid-library." + ids["Tài Bạch"])!,
    d = i.knowledge.find((k) => k.id === "paid-book.npl261-liem-tai")!,
    raw: any = mockPaidV2(i).raw;
  raw.sections.push({
    id: "hao-role",
    role: "analysis",
    title: "Tạo nguồn và nghĩa hao",
    paragraphs: [
      {
        text: "BẢN MOCK: cùng tác giả phân biệt nhãn đắc với nghĩa hao. Đặt cạnh lời Liêm về tạo nguồn, có thể tách tạo được với giữ lại; chưa có phép cộng trừ hoặc kết quả tài sản chắc chắn.",
        basis: "ai-synthesis",
        factIds: k.passage!.anchorFactIds,
        knowledgeIds: [k.id, d.id],
      },
    ],
  });
  expect(() =>
    validatePaidNarration(raw, i, PAID_PROMPT_CURRENT),
  ).not.toThrow();
  raw.sections.at(-1).paragraphs[0].basis = "source-interpretation";
  expect(() => validatePaidNarration(raw, i, PAID_PROMPT_CURRENT)).toThrow(
    "AI_REFERENCE_SCOPE",
  );
});
it.each(["Phu Thê", "Tật Ách"])(
  "method at %s never becomes a personal source claim",
  (target) => {
    const i = paidInput(record, target),
      k = i.knowledge.find((k) => k.id === "paid-library." + ids[target])!,
      raw: any = {
        schemaVersion: "paid-reading-v2.0.0",
        coverage: "limited",
        coverageNote: "BẢN MOCK không áp lời phương pháp thành kết luận.",
        sections: [
          {
            id: "method",
            role: "analysis",
            title: "BẢN MOCK",
            paragraphs: [
              {
                text: "BẢN MOCK phương pháp không phải kết luận cá nhân.",
                basis: "source-interpretation",
                factIds: k.passage!.anchorFactIds,
                knowledgeIds: [k.id],
              },
            ],
          },
        ],
        limitations: ["Không chẩn đoán bệnh."],
      };
    expect(() => validatePaidNarration(raw, i, PAID_PROMPT_CURRENT)).toThrow(
      "AI_REFERENCE_SCOPE",
    );
  },
);
it("Tật keeps zero direct sources, no fake article, and the relevant NPL non-cancellation method", () => {
  const i = paidInput(record, "Tật Ách");
  expect(i.knowledge.some((k) => k.application === "direct")).toBe(false);
  expect(i.knowledge.some((k) => k.id === "paid-method.inherited-NPL-15")).toBe(
    true,
  );
  expect(mockPaidV2(i).raw).toMatchObject({
    coverage: "insufficient",
    sections: [],
  });
});
it.each(["Phu Thê", "Tài Bạch"])(
  "missing anchors cannot be restored by a scope note at %s",
  (target) => {
    const i = paidInput(record, target),
      k = i.knowledge.find((k) => k.id === "paid-library." + ids[target])!;
    i.facts = i.facts.filter((f) => !k.passage!.anchorFactIds.includes(f.id));
    expect(paidLibrary(i, target).items.some((x) => x.id === k.id)).toBe(false);
  },
);
it("unknown extra major stars cannot satisfy the sole-Liêm editorial subset", () => {
  const i = paidInput(record, "Tài Bạch"),
    f = structuredClone(
      i.facts.find(
        (f) =>
          f.provenance?.palace === "Tài Bạch" &&
          f.provenance.field === "majorStars",
      )!,
    );
  f.id = "extra-major";
  f.text = f.text.replace("Liêm Trinh", "Thiên Đồng");
  f.provenance!.verification = "upstream-unverified";
  i.facts.push(f);
  expect(
    paidLibrary(i, "Tài Bạch").items.some(
      (k) => k.id === "paid-library." + ids["Tài Bạch"],
    ),
  ).toBe(false);
});
it("the new index fails closed when malformed and cannot add direct Tật content", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "scope-index-"));
  try {
    fs.mkdirSync(path.join(root, "paid-passages"));
    fs.writeFileSync(path.join(root, "paid-passages/index-v113.json"), "{}");
    expect(
      paidLibrary(paidInput(record, "Tài Bạch"), "Tài Bạch", root).excluded,
    ).toContainEqual({
      id: "paid-library",
      reason: "missing-or-invalid-index",
    });
    const u = {
      id: "forbidden-direct",
      status: "reviewed",
      title: "Technical fixture",
      text: "Not a real source claim.",
      targets: ["Tật Ách"],
      kind: "direct",
      requirements: [
        {
          palace: "Tật Ách",
          any: [{ kind: "star", name: "Địa Kiếp", field: "minorStars" }],
        },
      ],
      conditions: ["Technical"],
      limits: ["Technical"],
      references: [{ title: "Technical", location: "Technical" }],
      pages: [
        { book: "tb", number: 41, layer: "text", sha256: "0".repeat(64) },
      ],
    };
    fs.writeFileSync(
      path.join(root, "paid-passages/index-v113.json"),
      JSON.stringify({ version: "paid-library-1.0.0", units: [u] }),
    );
    expect(
      paidLibrary(paidInput(record, "Tật Ách"), "Tật Ách", root).excluded,
    ).toContainEqual({
      id: "paid-library.forbidden-direct",
      reason: "tat-t1-method-only",
    });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
