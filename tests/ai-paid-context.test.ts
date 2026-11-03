import { it, expect } from "vitest";
import type { Knowledge } from "../lib/ai/contract";
import {
  contextBytes,
  selectPaidContext,
  type ContextMetadata,
} from "../lib/ai/paid-context";
const item = (id: string, palace: string): Knowledge => {
  const k: Knowledge = {
    id,
    title: id,
    text: "Source argument with its original conditions and provenance. ".repeat(
      3,
    ),
    conditions: ["original condition"],
    limits: ["original exception"],
    references: [],
    selection: "matched-v1-editorial",
    group: "C",
    application: "context",
    subjectPalaces: [palace],
  };
  k.text += " ".repeat(1024 - contextBytes(k));
  return k;
};
it("selects useful related origins without a fixed per-palace quota and preserves original objects", () => {
  const candidates = [
    ...Array.from({ length: 10 }, (_, i) => item("a" + i, "Mệnh")),
    item("b0", "Quan Lộc"),
    item("c0", "Phúc Đức"),
  ];
  const meta = new Map<string, ContextMetadata>(
    candidates.map((k) => [
      k.id,
      {
        themes: [k.subjectPalaces![0] === "Quan Lộc" ? "work" : "action"],
        types: ["context"],
      },
    ]),
  );
  const result = selectPaidContext(candidates, "Tài Bạch", meta);
  expect(result.items).toHaveLength(8);
  expect(new Set(result.items.flatMap((k) => k.subjectPalaces!))).toEqual(
    new Set(["Mệnh", "Quan Lộc", "Phúc Đức"]),
  );
  expect(
    result.items.filter((k) => k.subjectPalaces![0] === "Mệnh"),
  ).toHaveLength(6);
  expect(result.items.every((k) => candidates.includes(k))).toBe(true);
  expect(result.usedBytes).toBeLessThanOrEqual(result.byteBudget);
});
it("fills available capacity from one origin; does not invent a missing side", () => {
  const c = Array.from({ length: 9 }, (_, i) => item(String(i), "Mệnh"));
  const x = selectPaidContext(c, "Quan Lộc", new Map());
  expect(x.items).toHaveLength(8);
  expect(new Set(x.items.flatMap((k) => k.subjectPalaces!))).toEqual(
    new Set(["Mệnh"]),
  );
});
it("does not exceed previous C8 serialized-byte budget, truncate sources, or promote context", () => {
  const c = Array.from({ length: 8 }, (_, i) => item("a" + i, "Mệnh"));
  const long = item("z0", "Phu Thê");
  long.text = "Long source with indispensable conditions. ".repeat(2000);
  const x = selectPaidContext([...c, long], "Quan Lộc", new Map());
  expect(x.items).not.toContain(long);
  expect(x.decisions.find((d) => d.id === long.id)?.reason).toBe(
    "context-byte-budget",
  );
  expect(x.usedBytes).toBeLessThanOrEqual(
    c.reduce((n, k) => n + contextBytes(k), 0),
  );
  expect(
    x.items.every(
      (k) =>
        k.group === "C" &&
        k.application === "context" &&
        k.conditions[0] === "original condition",
    ),
  ).toBe(true);
});
it("selection is stable when input array order changes", () => {
  const c = [item("a", "Mệnh"), item("b", "Tài Bạch"), item("c", "Phu Thê")];
  expect(selectPaidContext(c, "Quan Lộc", new Map()).items).toEqual(
    selectPaidContext([...c].reverse(), "Quan Lộc", new Map()).items,
  );
});
it("does not promote a method that mentions action above a usable thought/action premise", () => {
  const method = {
    ...item("method", "Mệnh"),
    text: "Vai trò Mệnh và Thân trong hành động.",
  };
  const wealth = {
    ...item("wealth", "Mệnh"),
    text: "Lời tài lộc và hưởng phúc với điều kiện riêng.",
  };
  const thought = {
    ...item("thought", "Mệnh"),
    text: "Nghĩa nền suy tính và tìm cách giải quyết việc khó.",
  };
  const meta = new Map<string, ContextMetadata>([
    [method.id, { themes: ["action"], types: ["method-gloss"] }],
    [wealth.id, { themes: ["action"], types: ["context"] }],
    [thought.id, { themes: ["action"], types: ["element-gloss"] }],
  ]);
  const before = JSON.stringify([method, wealth, thought]);
  const result = selectPaidContext([method, wealth, thought], "Tài Bạch", meta);
  expect(result.items.map((k) => k.id)).toEqual([
    "thought",
    "wealth",
    "method",
  ]);
  expect(JSON.stringify([method, wealth, thought])).toBe(before);
  expect(result.usedBytes).toBeLessThanOrEqual(result.byteBudget);
});
