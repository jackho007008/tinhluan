import { describe, it, expect, vi } from "vitest";
import { normalize, timeIndex } from "../lib/calendar";
import { calculate } from "../lib/tuvi-engine";
import { facts, validateEvidence } from "../lib/interpretation-rules";
import { narrate } from "../lib/narration";
import { unavailableScore } from "../lib/scoring";
import { mockProvider, sign } from "../lib/payments";
import { demoOnly } from "../lib/security";
export const birth = {
  date: "2000-08-16",
  hour: 3,
  minute: 0,
  unknownTime: false,
  place: "Hà Nội",
  gender: "female",
  calendar: "solar",
  profile: "cn-reference",
  timezone: "Asia/Ho_Chi_Minh",
  consent: true,
};
describe("validation", () => {
  it.each(["2023-02-29", "2000-02-30", "1900-02-29", "2000-13-01", "invalid"])(
    "rejects %s",
    (date) => expect(() => normalize({ ...birth, date })).toThrow(),
  );
  it("accepts leap day", () =>
    expect(normalize({ ...birth, date: "2000-02-29" }).date).toBe(
      "2000-02-29",
    ));
  it("unknown time stays null", () =>
    expect(normalize({ ...birth, unknownTime: true }).hour).toBeNull());
  it("requires known time", () =>
    expect(() => normalize({ ...birth, hour: null })).toThrow());
  it("rejects unsupported timezone and lunar input", () => {
    expect(() => normalize({ ...birth, timezone: "Europe/Paris" })).toThrow();
    expect(() => normalize({ ...birth, calendar: "lunar" })).toThrow();
  });
  it.each([
    [22, 11],
    [23, 12],
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 2],
  ])("hour %i has branch index %i", (h, index) =>
    expect(timeIndex(h)).toBe(index),
  );
});
describe("isolated reference engine (not expert validation)", () => {
  it("blocks unknown time and VN calendar", async () => {
    await expect(calculate({ ...birth, unknownTime: true })).rejects.toThrow(
      "UNKNOWN_TIME",
    );
    await expect(
      calculate({ ...birth, profile: "vn-unavailable" }),
    ).rejects.toThrow("VN_UNAVAILABLE");
  });
  it("reproduces output and isolates simultaneous inputs", async () => {
    const [a, b, c] = await Promise.all([
      calculate(birth),
      calculate({ ...birth, gender: "male", hour: 23 }),
      calculate(birth),
    ]);
    expect(a.resultId).toBe(c.resultId);
    expect(a.chart.palaces).toHaveLength(12);
    expect(b.resultId).not.toBe(a.resultId);
    expect(a.chart.lunar).toMatchObject({
      lunarYear: 2000,
      lunarMonth: 7,
      lunarDay: 17,
    });
    expect(a.chart.palaces[0].name).toBe("Tài Bạch");
  });
  it.each([
    [22, 59],
    [23, 0],
    [23, 59],
    [0, 0],
  ])("handles %i:%i explicitly", async (hour, minute) => {
    const a = await calculate({ ...birth, hour, minute });
    expect(a.chart.palaces).toHaveLength(12);
    expect(a.normalized.minute).toBe(minute);
  });
  it.each([
    "2024-02-03",
    "2024-02-05",
    "2024-02-09",
    "2024-02-10",
    "2023-03-22",
  ])(
    "calendar/solar-term boundary %s has deterministic reference output",
    async (date) => {
      const a = await calculate({ ...birth, date });
      expect((await calculate({ ...birth, date })).resultId).toBe(a.resultId);
    },
  );
  it("rules reject missing evidence, AI invention and errors fall back", async () => {
    const a = await calculate(birth),
      f = facts(a);
    expect(() => validateEvidence(a, f)).not.toThrow();
    expect(() =>
      validateEvidence(a, [{ ...f[0], evidencePaths: ["chart.missing"] }]),
    ).toThrow("MISSING_EVIDENCE");
    expect(() =>
      validateEvidence(a, [{ ...f[0], approvalStatus: "unapproved" as never }]),
    ).toThrow("UNAPPROVED_RULE");
    const fallback = await narrate(f);
    expect(
      await narrate(f, {
        generate: async () => {
          throw Error();
        },
      }),
    ).toEqual(fallback);
    expect(
      await narrate(f, {
        generate: async () => [
          { text: "Bạn sẽ giàu", statementIds: [f[0].id] },
        ],
      }),
    ).toEqual(fallback);
  });
  it("missing score remains null", () =>
    expect(unavailableScore()).toMatchObject({
      score: null,
      status: "unavailable",
      approvalStatus: "unapproved",
    }));
});
describe("mock boundaries", () => {
  it("rejects invalid signature", () => {
    process.env.DEMO_ENABLED = "true";
    process.env.PAYMENT_PROVIDER = "mock";
    process.env.MOCK_WEBHOOK_SECRET = "a".repeat(64);
    expect(() => mockProvider.verify("{}", "bad")).toThrow("INVALID_SIGNATURE");
  });
  it("blocks mock even if demo flag enabled in production", () => {
    const old = process.env.NODE_ENV;
    vi.stubEnv("NODE_ENV", "production");
    try {
      expect(demoOnly).toThrow("DEMO_DISABLED");
      expect(() => mockProvider.verify("{}", sign("{}"))).toThrow(
        "DEMO_DISABLED",
      );
    } finally {
      vi.stubEnv("NODE_ENV", old);
    }
  });
});
