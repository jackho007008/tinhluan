import { BRANCHES, STEMS } from "../lib/tuvi-engine/tanbien";
import { expect, it } from "vitest";
import { calculate } from "../lib/tuvi-engine";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import {
  phaToai,
  flowingDecade,
  monthPalace,
  dayHourPalace,
  annualStars,
  bookStateV2,
  applyTanBienV2,
  napAm,
} from "../lib/tuvi-engine/tanbien-v2";
const birth = {
  date: "2000-08-16",
  hour: 20,
  minute: 0,
  unknownTime: false,
  place: "DEMO kiểm thử công thức",
  gender: "female",
  calendar: "solar",
  profile: "tanbien-vn-trial-v2",
  timezone: "Asia/Ho_Chi_Minh",
  consent: true,
} as const;
it("Phá Toái: literal three groups p15 and four independently read appendix cells", () => {
  for (const b of [0, 6, 3, 9]) expect(phaToai(b)).toBe(5);
  for (const b of [2, 8, 5, 11]) expect(phaToai(b)).toBe(9);
  for (const b of [4, 10, 1, 7]) expect(phaToai(b)).toBe(1);
  // Appendix272 Sửu→Sửu;273 Mão→Tỵ;274 Thìn→Sửu;275 Mùi→Sửu. Not engine-generated expectations.
  expect([1, 3, 4, 7].map(phaToai)).toEqual([1, 5, 1, 1]);
  expect(phaToai(NaN)).toBeNull();
  expect(phaToai(12)).toBeNull();
});
it("Lưu đại hạn follows the two source diagrams, and monthly/day/hour counts preserve inclusive start", () => {
  // p21 base23 Thìn→24 Tuất→25 Dậu→26 Tuất→27 Hợi. p22 base34 Dậu→35 Mão→36 Thìn→37 Mão→38 Dần (fixed cells, not text extraction order).
  expect([0, 1, 2, 3, 4].map((n) => flowingDecade(4, n, 1))).toEqual([
    4, 10, 9, 10, 11,
  ]);
  expect([0, 1, 2, 3, 4].map((n) => flowingDecade(9, n, -1))).toEqual([
    9, 3, 4, 3, 2,
  ]);
  // Technical count: annualTý, month3 shifts toTuất, hourDần shifts toTý; viewingmonth2→Sửu.
  expect(monthPalace(0, 3, 2, 2)).toBe(1);
  expect(dayHourPalace(1, 13, 11)).toEqual({ daily: 1, hourly: 0 });
  expect(monthPalace(0, 0, 2, 2)).toBeNull();
  expect(dayHourPalace(0, 0)).toBeNull();
});
it("nine annual positions match printed examples pp268–269 for Ất Mùi, separate from natal stars", () => {
  expect(annualStars(1, 7)?.map((s) => [s.name, s.branch])).toEqual([
    ["Lưu Thái Tuế", "Mùi"],
    ["Lưu Tang Môn", "Dậu"],
    ["Lưu Bạch Hổ", "Mão"],
    ["Lưu Thiên Khốc", "Hợi"],
    ["Lưu Thiên Hư", "Sửu"],
    ["Lưu Lộc Tồn", "Mão"],
    ["Lưu Kình Dương", "Thìn"],
    ["Lưu Đà La", "Dần"],
    ["Lưu Thiên Mã", "Tỵ"],
  ]);
  expect(annualStars(0, 1)).toBeNull();
});
it("partial source states do not infer complements or use upstream brightness", () => {
  expect(bookStateV2("Hóa Kỵ", "Sửu")?.value).toBe("Đắc");
  expect(bookStateV2("Hóa Kỵ", "Tý")?.value).toBeUndefined();
  expect(bookStateV2("Đại Hao", "Dậu")?.source).toContain("3.27");
  expect(bookStateV2("Kình Dương", "Thìn")?.source).toContain("3.14");
});
it("v1 reproducible, v2 movement refreshes states; no moving stars enter natal facts; draft-only reading still works", async () => {
  const before = await calculate({ ...birth, profile: "tanbien-vn-trial-v1" });
  const saved = JSON.stringify(before);
  const { snapshot, receipt } = await calculateInternal({
    ...birth,
    viewYear: 2015,
  });
  const next = snapshot.chart;
  expect(JSON.stringify(before)).toBe(saved);
  expect(
    (await calculate({ ...birth, profile: "tanbien-vn-trial-v1" })).resultId,
  ).toBe(before.resultId);
  expect(snapshot.profile.id).toBe("tanbien-vn-trial-v2");
  const positions = (s: typeof next, name: string) =>
    s.palaces
      .filter((p) =>
        [...p.majorStars, ...p.minorStars, ...p.adjectiveStars].some(
          (st) => st.name === name,
        ),
      )
      .map((p) => p.earthlyBranch);
  expect(positions(before.chart, "Phá Toái")).toEqual(["Dậu"]); // v1 defect at Thìn year
  expect(positions(next, "Phá Toái")).toEqual(["Sửu"]); // source group p15
  const tb = next.tanBien!;
  expect("viewing" in tb && tb.viewing?.stars).toHaveLength(9);
  expect("viewing" in tb && tb.viewing?.canChi).toBe("Ất Mùi");
  for (const p of next.palaces)
    for (const st of [...p.majorStars, ...p.minorStars, ...p.adjectiveStars]) {
      expect(st.name.startsWith("Lưu ")).toBe(st.name === "Lưu Hà");
      expect(st.brightness).toBe(bookStateV2(st.name, p.earthlyBranch)?.value);
    }
  const frozen = freezeReading(snapshot, receipt);
  expect(frozen.verified).toBe(true);
  expect(
    frozen.reading.sections.flatMap((s) => s.paragraphs).length,
  ).toBeGreaterThan(0);
  expect(
    frozen.reading.sections
      .flatMap((s) => s.paragraphs.flatMap((p) => p.claim.rules))
      .every((r) => r.id.startsWith("tanbien.") || ["npl.life-polarity-aligned","npl.life-polarity-opposed","npl.life-foundation-cuc","npl.life-foundation-empty","npl.life-foundation-one","npl.life-body-wealth","npl.life-body-career"].includes(r.id)),
  ).toBe(true);
  const noYear = await calculate(birth);
  expect(noYear.chart.palaces).toEqual(next.palaces);
  expect(noYear.resultId).not.toBe(snapshot.resultId);
});

it("four appendix charts: all14 major positions + void pairs independently transcribed from fixed cells pp272–275", async () => {
  const original = await calculate({
    ...birth,
    profile: "vn-utc7-midnight-v1",
  });
  const rows = [
    {
      year: 1913,
      m: 9,
      d: 23,
      h: 2,
      g: "male",
      start: 0,
      nap: "Tang Đố Mộc",
      tuan: ["Dần", "Mão"],
      triet: ["Tý", "Sửu"],
      cells: [
        ["Liêm Trinh", "Thiên Tướng"],
        ["Thiên Lương"],
        ["Thất Sát"],
        ["Thiên Đồng"],
        ["Vũ Khúc"],
        ["Thái Dương"],
        ["Phá Quân"],
        ["Thiên Cơ"],
        ["Tử Vi", "Thiên Phủ"],
        ["Thái Âm"],
        ["Tham Lang"],
        ["Cự Môn"],
      ],
    },
    {
      year: 1891,
      m: 6,
      d: 6,
      h: 3,
      g: "male",
      start: 6,
      nap: "Tùng Bách Mộc",
      tuan: ["Ngọ", "Mùi"],
      triet: ["Thìn", "Tỵ"],
      cells: [
        ["Vũ Khúc", "Thiên Phủ"],
        ["Thái Dương", "Thái Âm"],
        ["Tham Lang"],
        ["Cự Môn", "Thiên Cơ"],
        ["Tử Vi", "Thiên Tướng"],
        ["Thiên Lương"],
        ["Thất Sát"],
        [],
        ["Liêm Trinh"],
        [],
        ["Phá Quân"],
        ["Thiên Đồng"],
      ],
    },
    {
      year: 1904,
      m: 9,
      d: 10,
      h: 6,
      g: "female",
      start: 2,
      nap: "Phú Đăng Hỏa",
      tuan: ["Dần", "Mão"],
      triet: ["Thân", "Dậu"],
      cells: [
        ["Cự Môn"],
        ["Thiên Tướng"],
        ["Thiên Đồng", "Thiên Lương"],
        ["Vũ Khúc", "Thất Sát"],
        ["Thái Dương"],
        [],
        ["Thiên Cơ"],
        ["Tử Vi", "Phá Quân"],
        [],
        ["Thiên Phủ"],
        ["Thái Âm"],
        ["Liêm Trinh", "Tham Lang"],
      ],
    },
    {
      year: 1931,
      m: 11,
      d: 30,
      h: 2,
      g: "male",
      start: 6,
      nap: "Lộ Bàng Thổ",
      tuan: ["Tuất", "Hợi"],
      triet: ["Thìn", "Tỵ"],
      cells: [
        [],
        [],
        [],
        ["Liêm Trinh", "Phá Quân"],
        [],
        ["Thiên Phủ"],
        ["Thiên Đồng", "Thái Âm"],
        ["Vũ Khúc", "Tham Lang"],
        ["Thái Dương", "Cự Môn"],
        ["Thiên Tướng"],
        ["Thiên Cơ", "Thiên Lương"],
        ["Tử Vi", "Thất Sát"],
      ],
    },
  ];
  for (const r of rows) {
    // Technical lunar-source harness, NOT a supported Gregorian birth or an independent calendar validation.
    const base = structuredClone(original.chart);
    base.lunar = {
      lunarYear: r.year,
      lunarMonth: r.m,
      lunarDay: r.d,
      isLeap: false,
    };
    const life = (2 + r.m - 1 - r.h + 12) % 12,
      body = (2 + r.m - 1 + r.h) % 12;
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
      p.heavenlyStem = STEMS[(r.start + ((b - 2 + 12) % 12)) % 10];
    }
    const result = applyTanBienV2(base, {
      ...birth,
      gender: r.g as "male" | "female",
      hour: r.h * 2,
    });
    for (let b = 0; b < 12; b++)
      expect(
        result.chart.palaces
          .find((p) => p.earthlyBranch === BRANCHES[b])!
          .majorStars.map((s) => s.name)
          .sort(),
      ).toEqual([...r.cells[b]].sort());
    expect(result.calculation.voidRanges.map((v) => v.branches)).toEqual([
      r.tuan,
      r.triet,
    ]);
    expect(napAm(r.year)?.value).toBe(r.nap);
  }
});

it("selected periods validate civil date/year and keep leap-month method unknown, no implicit hour", async () => {
  const a = await calculate({
    ...birth,
    viewYear: 2015,
    viewDate: "2015-03-10",
  });
  const b = await calculate({
    ...birth,
    viewYear: 2023,
    viewDate: "2023-03-22",
    viewHourIndex: 8,
  });
  expect(
    "selectedPeriod" in a.chart.tanBien! &&
      a.chart.tanBien.selectedPeriod?.status,
  ).toBe("computed");
  expect(
    "selectedPeriod" in a.chart.tanBien! &&
      a.chart.tanBien.selectedPeriod?.hour,
  ).toBeNull();
  expect(
    "selectedPeriod" in b.chart.tanBien! &&
      b.chart.tanBien.selectedPeriod?.status,
  ).toBe("unknown");
  expect(
    "selectedPeriod" in b.chart.tanBien! && b.chart.tanBien.selectedPeriod?.day,
  ).toBeNull();
  await expect(
    calculate({ ...birth, viewYear: 2015, viewDate: "2015-01-01" }),
  ).rejects.toThrow("VIEW_YEAR_MISMATCH");
});
