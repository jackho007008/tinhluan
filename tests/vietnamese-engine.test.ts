import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import {
  solarToLunar,
  lunarToSolar,
  span,
} from "../lib/calendar/vietnamese.cjs";
import { calculate } from "../lib/tuvi-engine";
import { buildReport } from "../lib/reports";
import fixtures from "./calendar-fixtures.json";
const require = createRequire(import.meta.url);
const birth = {
  date: "2000-08-16",
  hour: 3,
  minute: 0,
  unknownTime: false,
  place: "Hà Nội",
  gender: "female",
  calendar: "solar",
  profile: "vn-utc7-midnight-v1",
  timezone: "Asia/Ho_Chi_Minh",
  consent: true,
};
describe("independent calendar evidence (not expert star validation)", () => {
  it.each(fixtures.dates)("$solar: $source", (f) => {
    expect(Object.keys(fixtures.sources)).toContain(f.source);
    const [lunarYear, lunarMonth, lunarDay, isLeap] = f.lunar;
    expect(solarToLunar(f.solar)).toMatchObject({
      lunarYear,
      lunarMonth,
      lunarDay,
      isLeap,
    });
  });
  it.each(fixtures.newMoons)(
    "NASA new moon $solar: tolerance 120 seconds",
    (f) => {
      expect(
        Math.abs(+new Date(solarToLunar(f.solar).newMoonUtc) - +new Date(f.ut)),
      ).toBeLessThanOrEqual(120000);
    },
  );
  it("all 27394 civil dates roundtrip, months contiguous; internal consistency only", () => {
    let total = 0;
    for (
      let t = Date.UTC(1976, 0, 1);
      t <= Date.UTC(2050, 11, 31);
      t += 86400000
    ) {
      const date = new Date(t).toISOString().slice(0, 10),
        l = solarToLunar(date);
      expect(
        lunarToSolar({
          year: l.lunarYear,
          month: l.lunarMonth,
          day: l.lunarDay,
          isLeap: l.isLeap,
        }),
      ).toBe(date);
      total++;
    }
    expect(total).toBe(27394);
    for (let y = 1975; y <= 2050; y++) {
      const ms = span(y);
      expect([12, 13]).toContain(ms.length);
      expect(ms.filter((m) => m.isLeap)).toHaveLength(ms.length - 12);
      for (let i = 1; i < ms.length; i++)
        expect(ms[i].startDay).toBe(ms[i - 1].endDay);
    }
  });
  it.each(["1975-12-31", "2051-01-01", "2023-02-29", "invalid"])(
    "rejects %s",
    (date) => expect(() => solarToLunar(date)).toThrow(),
  );
  it("rejects nonexistent leap month and short-month day 30", () => {
    expect(() =>
      lunarToSolar({ year: 2024, month: 1, day: 1, isLeap: true }),
    ).toThrow();
    expect(() =>
      lunarToSolar({ year: 2004, month: 2, day: 30, isLeap: true }),
    ).toThrow();
  });
});
describe("isolated VN an sao adapter, upstream-only validation", () => {
  it("upstream documented star subset on common calendar date, both genders", async () => {
    for (const gender of ["male", "female"]) {
      const s = await calculate({ ...birth, gender });
      expect(s.chart.palaces.find((p) => p.name === "Mệnh")).toMatchObject({
        earthlyBranch: "Ngọ",
        majorStars: expect.arrayContaining([
          expect.objectContaining({ name: "Tử Vi" }),
        ]),
      });
      expect(
        s.chart.palaces
          .find((p) => p.name === "Tài Bạch")
          ?.majorStars.map((s) => s.name),
      ).toEqual(["Vũ Khúc", "Thiên Tướng"]);
      expect(s.chart.calendarEvidence?.cnCalendarAccess).toBe("blocked");
      expect(s.chart.calendarEvidence?.bridgeCalls.solar2lunar).toBeGreaterThan(
        0,
      );
    }
  });
  it("same-library crosspath star comparison; not independent verification", async () => {
    for (const gender of ["male", "female"]) {
      const a = await calculate({ ...birth, gender });
      const b = await calculate({ ...birth, gender, profile: "cn-reference" });
      expect(a.chart.palaces).toEqual(b.chart.palaces);
    }
  });
  it("known 2007 VN/CN difference from published Tet + HKO", async () => {
    const vn = await calculate({ ...birth, date: "2007-02-17" }),
      cn = await calculate({
        ...birth,
        date: "2007-02-17",
        profile: "cn-reference",
      });
    expect(vn.chart.lunar).toEqual({
      lunarYear: 2007,
      lunarMonth: 1,
      lunarDay: 1,
      isLeap: false,
    });
    expect(cn.chart.lunar).toEqual({
      lunarYear: 2006,
      lunarMonth: 12,
      lunarDay: 30,
      isLeap: false,
    });
    expect(vn.chart.palaces).not.toEqual(cn.chart.palaces);
  });
  it.each(Array.from({ length: 24 }, (_, hour) => hour))(
    "hour %i: declared double-hour convention",
    async (hour) => {
      const s = await calculate({ ...birth, hour });
      expect(s.chart.calendarEvidence?.timeIndex).toBe(
        hour === 23 ? 0 : Math.floor((hour + 1) / 2),
      );
    },
  );
  it("22:59 / 23:00 / 23:59 / next 00:00 lunar year boundary", async () => {
    const a = await calculate({
      ...birth,
      date: "2007-02-16",
      hour: 22,
      minute: 59,
    });
    const b = await calculate({
      ...birth,
      date: "2007-02-16",
      hour: 23,
      minute: 0,
    });
    const c = await calculate({
      ...birth,
      date: "2007-02-16",
      hour: 23,
      minute: 59,
    });
    const d = await calculate({
      ...birth,
      date: "2007-02-17",
      hour: 0,
      minute: 0,
    });
    expect(a.chart.lunar).toEqual(b.chart.lunar);
    expect(b.chart.palaces).toEqual(c.chart.palaces);
    expect(b.chart.lunar).toMatchObject({ lunarYear: 2006, lunarMonth: 12 });
    expect(d.chart.lunar).toMatchObject({
      lunarYear: 2007,
      lunarMonth: 1,
      lunarDay: 1,
    });
  });
  it("leap month day15/16 preserves palace assignment (explicit policy)", async () => {
    const a = await calculate({ ...birth, date: "2004-04-04" }),
      b = await calculate({ ...birth, date: "2004-04-05" });
    expect(a.chart.lunar).toMatchObject({ lunarDay: 15, isLeap: true });
    expect(b.chart.lunar).toMatchObject({ lunarDay: 16, isLeap: true });
    expect(a.chart.palaces.map((p) => [p.name, p.earthlyBranch])).toEqual(
      b.chart.palaces.map((p) => [p.name, p.earthlyBranch]),
    );
  });
  it("Lập xuân does not change lunar year", async () => {
    const a = await calculate({ ...birth, date: "2024-02-03" }),
      b = await calculate({ ...birth, date: "2024-02-05" });
    expect(a.chart.lunar.lunarYear).toBe(2023);
    expect(b.chart.lunar.lunarYear).toBe(2023);
  });
  it("parallel profiles remain deterministic and reports use frozen snapshots", async () => {
    const old = await calculate({ ...birth, profile: "cn-reference" }),
      saved = JSON.stringify(old);
    const [vn, again] = await Promise.all([
      calculate(birth),
      calculate({ ...birth, profile: "cn-reference" }),
    ]);
    expect(again).toEqual(old);
    expect((await calculate(birth)).resultId).toBe(vn.resultId);
    const report = await buildReport(JSON.parse(saved), {
      groups: ["Tổng quan"],
      year: null,
    });
    expect(report.snapshot).toEqual(old);
    expect(report.scoring.score).toBeNull();
    expect(JSON.stringify(old)).toBe(saved);
    const real = await buildReport(vn, { groups: ["Tổng quan"], year: null });
    expect(real.snapshot.resultId).toBe(vn.resultId);
    expect(real.statements).toHaveLength(12);
  });
  it("rejects unsupported calendar calls and late-Zi bridge index", () => {
    const { bridge } =
      require("../lib/calendar/iztro-bridge.cjs").createBridge();
    expect(() => bridge.lunar2solar).toThrow("UNSUPPORTED_CALENDAR_CALL");
    expect(() =>
      bridge.getHeavenlyStemAndEarthlyBranchBySolarDate("2000-08-16", 12, {
        year: "normal",
      }),
    ).toThrow();
  });
  it("rejects unavailable input, never silently falls back", async () => {
    await expect(calculate({ ...birth, date: "1970-01-01" })).rejects.toThrow(
      "1976-01-01",
    );
    await expect(calculate({ ...birth, unknownTime: true })).rejects.toThrow(
      "UNKNOWN_TIME",
    );
    await expect(
      calculate({ ...birth, timezone: "Asia/Shanghai" }),
    ).rejects.toThrow();
    await expect(calculate({ ...birth, calendar: "lunar" })).rejects.toThrow();
  });
});
