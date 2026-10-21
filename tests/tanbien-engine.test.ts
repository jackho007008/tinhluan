import { describe, it, expect } from "vitest";
import { calculate, type ChartData } from "../lib/tuvi-engine";
import {
  applyTanBien,
  BRANCHES,
  fireBell,
  voidPairs,
  ziweiFromBook,
  bookState,
} from "../lib/tuvi-engine/tanbien";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import { starState } from "../lib/chart-presentation";
const birth = {
  date: "2000-08-16",
  hour: 20,
  minute: 0,
  unknownTime: false,
  place: "DEMO kỹ thuật",
  gender: "female",
  calendar: "solar",
  profile: "tanbien-vn-trial-v1",
  timezone: "Asia/Ho_Chi_Minh",
  consent: true,
} as const;
const pos = (chart: ChartData, name: string) =>
  chart.palaces
    .filter((p) =>
      [...p.majorStars, ...p.minorStars, ...p.adjectiveStars].some(
        (s) => s.name === name,
      ),
    )
    .map((p) => p.earthlyBranch);
describe("Tân Biên source-formula tests (not expert validation)", () => {
  it("Hỏa/Linh four gender/polarity branches, all starting groups; expected manual walks pp10–11", () => {
    // starts Sửu/Mão, Dần/Tuất, Mão/Tuất, Dần/Tuất; each expected calculated before calling implementation.
    const cases = [
      [2, 0, "male", 8, "Dậu", "Mùi"],
      [2, 0, "female", 8, "Tỵ", "Hợi"],
      [3, 1, "female", 8, "Tuất", "Dần"],
      [3, 1, "male", 8, "Ngọ", "Ngọ"],
      [1, 1, "male", 3, "Tý", "Sửu"],
      [1, 1, "female", 3, "Ngọ", "Mùi"],
      [0, 0, "male", 8, "Tuất", "Dần"],
      [0, 0, "female", 8, "Ngọ", "Ngọ"],
      [2, 0, "male", 0, "Sửu", "Mão"],
      [11, 9, "female", 11, "Sửu", "Hợi"],
    ] as const;
    for (const [yearBranch, yearStem, gender, hourIndex, f, l] of cases) {
      const r = fireBell({ yearBranch, yearStem, gender, hourIndex });
      expect(r.status).toBe("computed");
      if (r.status === "computed") {
        expect(BRANCHES[r.fire]).toBe(f);
        expect(BRANCHES[r.bell]).toBe(l);
        expect(r.fireTrace).toHaveLength(hourIndex + 1);
      }
    }
    expect(
      fireBell({ yearBranch: 1, yearStem: 0, gender: "male", hourIndex: 8 })
        .status,
    ).toBe("unknown");
    expect(
      fireBell({ yearBranch: 0, yearStem: 0, gender: "?", hourIndex: 8 })
        .status,
    ).toBe("unknown");
  });
  it("Tuần six decade groups and Triệt ten stems, table+diagram p17, preserves conflicting example as a decision", () => {
    const decades = [
      [0, 10, 11],
      [10, 8, 9],
      [8, 6, 7],
      [6, 4, 5],
      [4, 2, 3],
      [2, 0, 1],
    ];
    for (const [start, a, b] of decades)
      for (let stem = 0; stem < 10; stem++)
        expect(voidPairs(stem, (start + stem) % 12)?.tuan).toEqual([a, b]);
    const expected = [
      [8, 9],
      [6, 7],
      [4, 5],
      [2, 3],
      [0, 1],
      [8, 9],
      [6, 7],
      [4, 5],
      [2, 3],
      [0, 1],
    ];
    for (let stem = 0; stem < 10; stem++)
      expect(voidPairs(stem, stem % 2)?.triet).toEqual(expected[stem]);
    expect(voidPairs(0, 1)).toBeNull();
  });
  it("five Cục charts pp7–8 provide independently read cells and preserve unresolved Kim branches", () => {
    for (const [c, d, b] of [
      [2, 1, 1],
      [2, 30, 4],
      [3, 9, 4],
      [3, 23, 8],
      [4, 1, 11],
      [4, 22, 9],
      [5, 1, 6],
      [5, 30, 7],
      [6, 1, 9],
      [6, 30, 6],
    ])
      expect(ziweiFromBook(c, d)).toEqual({ status: "computed", branch: b });
    expect(ziweiFromBook(4, 21).status).toBe("unknown");
    expect(ziweiFromBook(4, 24).status).toBe("unknown");
    // Bounded software consistency only. A known source contradiction must not be silently filled.
    for (const c of [2, 3, 5, 6])
      for (let d = 1; d <= 30; d++)
        expect(ziweiFromBook(c, d).status).toBe("computed");
  });
  it("Quý source examples use fixed chart geometry p5, NOT the inner annual labels, pp272–275", async () => {
    const old = await calculate({ ...birth, profile: "vn-utc7-midnight-v1" });
    // Technical source-input harness. These are lunar inputs from the book, not solar dates validated by our calendar.
    const cases = [
      {
        year: 1913,
        m: 9,
        d: 23,
        h: 2,
        gender: "male",
        khuc: "Ngọ",
        quy: "Dậu",
        zi: "Thân",
      },
      {
        year: 1891,
        m: 6,
        d: 6,
        h: 3,
        gender: "male",
        khuc: "Mùi",
        quy: "Mão",
        zi: "Thìn",
      },
      {
        year: 1904,
        m: 9,
        d: 10,
        h: 6,
        gender: "female",
        khuc: "Tuất",
        quy: "Dần",
        zi: "Mùi",
      },
      {
        year: 1931,
        m: 11,
        d: 30,
        h: 2,
        gender: "male",
        khuc: "Ngọ",
        quy: "Dần",
        zi: "Hợi",
      },
    ] as const;
    for (const c of cases) {
      const base = structuredClone(old.chart);
      base.lunar = {
        lunarYear: c.year,
        lunarMonth: c.m,
        lunarDay: c.d,
        isLeap: false,
      };
      const life = (2 + c.m - 1 - c.h + 12) % 12,
        body = (2 + c.m - 1 + c.h) % 12;
      // Assign palace labels by the explicit Mệnh/Thân construction solely to feed the source-formula harness.
      const names = [
        "Mệnh",
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
      ];
      for (const p of base.palaces) {
        const b = BRANCHES.indexOf(p.earthlyBranch);
        p.name = names[(b - life + 12) % 12];
        p.isBodyPalace = b === body;
      }
      const r = applyTanBien(base, {
        ...birth,
        gender: c.gender,
        hour: c.h * 2,
      });
      expect(pos(r.chart, "Văn Khúc")).toEqual([c.khuc]);
      expect(pos(r.chart, "Thiên Quý")).toEqual([c.quy]);
      expect(pos(r.chart, "Tử Vi")).toEqual([c.zi]);
    }
  });
  it("new engine preserves old output object, source state never falls back, transformations belong to one star and aliases do not duplicate", async () => {
    const old = await calculate({ ...birth, profile: "vn-utc7-midnight-v1" }),
      saved = JSON.stringify(old);
    const next = await calculateInternal(birth);
    expect(JSON.stringify(old)).toBe(saved);
    expect(next.snapshot.resultId).not.toBe(old.resultId);
    expect(next.snapshot.profile.id).toBe("tanbien-vn-trial-v1");
    expect(
      next.snapshot.chart.palaces.flatMap((p) => p.majorStars),
    ).toHaveLength(14);
    const stars = next.snapshot.chart.palaces.flatMap((p) => [
      ...p.majorStars,
      ...p.minorStars,
      ...p.adjectiveStars,
    ]);
    for (const alias of ["Phượng Các", "Thiên Riêu", "Thai Phụ"])
      expect(stars.some((s) => s.name === alias)).toBe(false);
    for (const canonical of ["Phụng Các", "Thiên Diêu", "Đài Phụ"])
      expect(stars.filter((s) => s.name === canonical)).toHaveLength(1);
    expect(stars.filter((s) => s.mutagen)).toHaveLength(4);
    expect(stars.find((s) => s.name === "Thái Âm")?.mutagen).toBe("Khoa"); // Canh row p14 differs upstream in some conventions.
    expect(bookState("Linh Tinh", "Thân")?.value).toBeUndefined();
    const reading = freezeReading(next.snapshot, next.receipt);
    expect(
      reading.reading.sections.flatMap((s) => s.paragraphs).length,
    ).toBeGreaterThan(0);
    expect(
      reading.reading.sections
        .flatMap((s) => s.paragraphs.flatMap((p) => p.claim.rules))
        .every((r) => r.id.startsWith("tanbien.")),
    ).toBe(true);
    expect(
      starState(
        { name: "not-in-book", brightness: "Miếu" },
        "Tý",
        next.snapshot,
        "tanbien",
      ).display,
    ).toContain("Chưa");
  });
  it("same profile inputs reproduce identity; time boundaries and leap month retain explicit VN calendar conventions", async () => {
    const a = await calculate(birth);
    expect((await calculate(birth)).resultId).toBe(a.resultId);
    for (const [date, h] of [
      ["2000-02-29", 22],
      ["2000-02-29", 23],
      ["2000-03-01", 0],
      ["2023-03-22", 8],
    ] as const) {
      const r = await calculate({ ...birth, date, hour: h });
      expect(r.chart.calendarEvidence?.dayBoundary).toBe("00:00");
      expect(r.chart.calendarEvidence?.timeIndex).toBe(
        h === 23 ? 0 : Math.floor((h + 1) / 2),
      );
      if (date === "2023-03-22") {
        expect(r.chart.lunar.isLeap).toBe(true);
        expect(r.chart.lunar.lunarMonth).toBe(2);
      }
    }
    await expect(
      calculate({ ...birth, hour: null, minute: null, unknownTime: true }),
    ).rejects.toThrow("UNKNOWN_TIME");
  });
});

it("source examples Hỏa keep the conflicts visible rather than selecting the convenient expected", () => {
  // Read fixed cells in images: 272 Hỏa=Sửu, 273=Ngọ, 274=Thân, 275=Mùi.
  const examples = [
    { y: 1, s: 9, g: "male", h: 2, printed: 1, formula: 1 },
    { y: 3, s: 7, g: "male", h: 3, printed: 6, formula: 11 },
    { y: 4, s: 0, g: "female", h: 6, printed: 8, formula: 8 },
    { y: 7, s: 7, g: "male", h: 2, printed: 7, formula: 0 },
  ];
  const conflicts = [];
  for (const [i, c] of examples.entries()) {
    const r = fireBell({
      yearBranch: c.y,
      yearStem: c.s,
      gender: c.g,
      hourIndex: c.h,
    });
    expect(r.status).toBe("computed");
    if (r.status === "computed") {
      expect(r.fire).toBe(c.formula);
      if (r.fire !== c.printed) conflicts.push(272 + i);
    }
  }
  expect(conflicts).toEqual([273, 275]);
});
