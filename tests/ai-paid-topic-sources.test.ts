import { beforeAll, it, expect } from "vitest";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { paidInput } from "../lib/ai/paid-input";
import { paidTopicBooks } from "../lib/ai/paid-topic-books";
import {
  validatePaidNarration,
  paidInstructions,
} from "../lib/ai/paid-contract";
import { PAID_PROMPT_CURRENT } from "../lib/ai/paid-prompt-v22";
import { mockPaidV2 } from "./fixtures/ai-paid-v2-mock";
import type { MenhInput } from "../lib/ai/contract";
let record: any, khoaRecord: any;
const build = async (hour: number) => {
  const { snapshot, receipt } = await calculateInternal({
    name: "QA nguồn theo cung",
    date: "1992-08-07",
    hour,
    minute: 0,
    gender: "male",
    calendar: "solar",
    timezone: "Asia/Ho_Chi_Minh",
    profile: "tanbien-vn-trial-v2",
    place: "Không ghi",
    unknownTime: false,
    consent: true,
  });
  return { snapshot, receipt, frozen: freezeReading(snapshot, receipt) };
};
beforeAll(async () => {
  record = await build(16);
  khoaRecord = await build(14);
});
it("Nô birth-Lộc adds an owner-expectation thesis, not guaranteed loyal helpers", () => {
  const before = JSON.stringify(record),
    input = paidInput(record, "Nô Bộc"),
    k = input.knowledge.find((k) => k.id === "paid-book.thp1-128-no-loc");
  expect(k).toMatchObject({
    group: "B",
    application: "direct",
    subjectPalaces: ["Nô Bộc"],
  });
  expect(k!.text).toContain("đơn phương");
  expect(k!.limits.join(" ")).toContain("Chưa có phi hóa");
  expect(input.facts.find((f) => f.id === "natal.Lộc")?.text).toContain(
    "tại Nô Bộc (",
  );
  expect(JSON.stringify(record)).toBe(before);
  const fake = structuredClone(input);
  fake.facts = fake.facts.filter((f) => f.id !== "natal.Lộc");
  fake.facts.push({
    id: "loc-ton",
    kind: "engine",
    text: "Nô Bộc: Lộc Tồn",
    paths: [],
  });
  expect(paidTopicBooks(fake, "Nô Bộc")).toEqual([]);
});
it("Phu Sát/Tham/Phá keeps the partial-analysis boundary and never adds Đà–Hỏa synthesis", () => {
  const input = paidInput(record, "Phu Thê"),
    k = input.knowledge.find(
      (k) => k.id === "paid-book.thp2-178-phu-sat-pha-tham",
    )!;
  expect(k.application).toBe("direct");
  expect(k.text).toContain("phần nhiều");
  expect(k.conditions.join(" ")).toContain(
    "Chưa tính không có nghĩa phải vắng",
  );
  expect(k.limits.join(" ")).toContain("Không xác nhận phép phối hợp");
  const projected = structuredClone(input);
  projected.facts = projected.facts.map((f) =>
    f.provenance?.palace === "Phu Thê" && f.provenance.field === "majorStars"
      ? {
          ...f,
          provenance: {
            ...f.provenance,
            palace: "Quan Lộc",
            relation: "opposition",
          },
        }
      : f,
  );
  expect(paidTopicBooks(projected, "Phu Thê")).toEqual([]);
});
it("Tử uses the narrow Khoa source only on a real verified natal-Khoa-at-Tử chart", () => {
  const input = paidInput(khoaRecord, "Tử Nữ"),
    before = JSON.stringify(khoaRecord);
  expect(input.facts.find((f) => f.id === "natal.Khoa")?.text).toContain(
    "tại Tử Nữ (",
  );
  expect(
    input.knowledge.find((k) => k.id === "paid-book.thp2-196-tu-khoa"),
  ).toMatchObject({ application: "direct", subjectPalaces: ["Tử Nữ"] });
  expect(
    paidTopicBooks(paidInput(record, "Tử Nữ"), "Tử Nữ").some(
      (k) => k.id === "paid-book.thp2-196-tu-khoa",
    ),
  ).toBe(false);
  expect(JSON.stringify(khoaRecord)).toBe(before);
  const noBirth = structuredClone(input);
  noBirth.facts = noBirth.facts.filter((f) => f.id !== "natal.Khoa");
  noBirth.facts.push({
    id: "self.khoa",
    kind: "engine",
    text: "Tử Nữ tự Hóa Khoa",
    paths: [],
  });
  expect(paidTopicBooks(noBirth, "Tử Nữ")).toEqual([]);
});
it.each(["Nô Bộc", "Phu Thê", "Tử Nữ"])(
  "new-source %s mock remains V2-valid without asserting depth",
  (palace) => {
    const input = paidInput(palace === "Tử Nữ" ? khoaRecord : record, palace),
      k = input.knowledge.find((k) => k.id.startsWith("paid-book.thp"))!;
    const gen = mockPaidV2(input, "limited"),
      raw = gen.raw as any;
    raw.sections[0].paragraphs[0] = {
      text: "BẢN MOCK. " + k.text,
      basis: "source-interpretation",
      knowledgeIds: [k.id],
      factIds: [
        input.facts.find((f) =>
          palace === "Nô Bộc"
            ? f.id === "natal.Lộc"
            : palace === "Tử Nữ"
              ? f.id === "natal.Khoa"
              : f.provenance?.palace === "Phu Thê" &&
                f.provenance.field === "majorStars",
        )!.id,
      ],
    };
    expect(
      validatePaidNarration(raw, input, PAID_PROMPT_CURRENT),
    ).toMatchObject({ coverage: "limited" });
    expect(paidInstructions(input, PAID_PROMPT_CURRENT)).toContain(
      "không dự báo cưới/chia tay",
    );
  },
);

it("Tử uses the explicit child-relation clause from natal Lộc at Nô without moving the fact", () => {
  const input = paidInput(record, "Tử Nữ");
  const k = input.knowledge.find(
    (k) => k.id === "paid-book.thp1-130-tu-from-no-loc",
  )!;
  expect(k).toMatchObject({ application: "direct", subjectPalaces: ["Tử Nữ"] });
  expect(k.conditions.join(" ")).toContain("Hóa Lộc năm sinh tại Nô Bộc");
  expect(k.limits.join(" ")).toContain("Không chuyển Hóa Lộc từ Nô sang Tử");
  const fact = input.facts.find((f) => f.id === "natal.Lộc")!;
  expect(fact.text).toContain("tại Nô Bộc (");
  const raw = mockPaidV2(input, "limited").raw as any;
  raw.sections[0].paragraphs[0] = {
    text: "BẢN MOCK. " + k.text,
    basis: "source-interpretation",
    factIds: [fact.id],
    knowledgeIds: [k.id],
  };
  expect(validatePaidNarration(raw, input, PAID_PROMPT_CURRENT)).toMatchObject({
    coverage: "limited",
  });
  const missing = {
    ...input,
    facts: input.facts.filter((f) => f.id !== "natal.Lộc"),
  };
  expect(
    paidTopicBooks(missing, "Tử Nữ").some((candidate) => candidate.id === k.id),
  ).toBe(false);
});
