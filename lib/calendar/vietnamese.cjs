// Project implementation of a civil UTC+7 lunisolar calendar.
// Astronomy Engine is MIT; no Ho Ngoc Duc implementation code is copied.
const Astronomy = require("astronomy-engine");
const DAY = 86400000,
  OFFSET = 7 * 3600000;
const range = require("./profile-ranges.json")["vn-utc7-midnight-v1"];
const MIN_DATE = range.min,
  MAX_DATE = range.max;
const cache = new Map();
const civilDay = (date, offset = 7) =>
  Math.floor((+date + offset * 3600000) / DAY);
const isoDay = (d) => new Date(d * DAY).toISOString().slice(0, 10);
function boundaryDistance(date) {
  const m = (((+date + OFFSET) % DAY) + DAY) % DAY;
  return Math.min(m, DAY - m) / 1000;
}
function event(time, kind) {
  if (!time) throw Error("ASTRONOMY_SEARCH_FAILED");
  return {
    utc: time.date.toISOString(),
    day: civilDay(time.date),
    kind,
    midnightDistanceSeconds: boundaryDistance(time.date),
  };
}
function span(year) {
  if (cache.has(year)) return cache.get(year);
  const winter = event(Astronomy.Seasons(year).dec_solstice, "winter-solstice");
  const nextWinter = event(
    Astronomy.Seasons(year + 1).dec_solstice,
    "winter-solstice",
  );
  const moons = [];
  let cursor = new Date(Date.UTC(year, 10, 1));
  while (civilDay(cursor) <= nextWinter.day + 35) {
    const moon = Astronomy.SearchMoonPhase(0, cursor, 35);
    moons.push(event(moon, "new-moon"));
    cursor = new Date(+moon.date + 20 * DAY);
  }
  const first = moons.findLastIndex((m) => m.day <= winter.day),
    last = moons.findLastIndex((m) => m.day <= nextWinter.day);
  const count = last - first;
  if (count !== 12 && count !== 13) throw Error("INVALID_LUNAR_SPAN");
  const terms = [winter];
  let prev = new Date(winter.utc);
  for (let i = 1; i <= 12; i++) {
    const t = Astronomy.SearchSunLongitude(
      (270 + i * 30) % 360,
      new Date(+prev + 20 * DAY),
      20,
    );
    terms.push(event(t, "principal-term"));
    prev = t.date;
  }
  const starts = moons.slice(first, last + 1);
  let leapIndex = -1;
  if (count === 13) {
    leapIndex = starts.findIndex(
      (m, i) =>
        i > 0 &&
        i < count &&
        !terms.some((t) => t.day >= m.day && t.day < starts[i + 1].day),
    );
    if (leapIndex < 0) throw Error("LEAP_MONTH_NOT_FOUND");
  }
  // An event close to midnight can change civil-day membership. Fail closed for
  // month starts and any term near a month boundary; do not claim exact ephemerides.
  const termRisks = terms.filter(
    (t) =>
      t.midnightDistanceSeconds < 120 &&
      starts.some(
        (m) =>
          m.day ===
          Math.max(
            civilDay(new Date(+new Date(t.utc) - 120000)),
            civilDay(new Date(+new Date(t.utc) + 120000)),
          ),
      ),
  );
  const months = [];
  let month = 11,
    lunarYear = year;
  for (let i = 0; i < count; i++) {
    const leap = i === leapIndex;
    if (i > 0 && !leap) {
      month = (month % 12) + 1;
      if (month === 1) lunarYear++;
    }
    const start = starts[i],
      end = starts[i + 1];
    const length = end.day - start.day;
    if (length !== 29 && length !== 30)
      throw Error("INVALID_LUNAR_MONTH_LENGTH");
    months.push({
      lunarYear,
      lunarMonth: month,
      isLeap: leap,
      startDay: start.day,
      endDay: end.day,
      length,
      newMoonUtc: start.utc,
      nextNewMoonUtc: end.utc,
      principalTerms: terms
        .filter((t) => t.day >= start.day && t.day < end.day)
        .map((t) => t.utc),
      boundaryRisks: [
        ...termRisks,
        ...[start, end].filter((m) => m.midnightDistanceSeconds < 120),
      ].map((e) => ({
        kind: e.kind,
        utc: e.utc,
        seconds: e.midnightDistanceSeconds,
      })),
    });
  }
  cache.set(year, months);
  return months;
}
function parseSolar(date, publicRange = true) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw Error("INVALID_SOLAR_DATE");
  const instant = new Date(date + "T00:00:00Z");
  if (!Number.isFinite(+instant) || instant.toISOString().slice(0, 10) !== date)
    throw Error("INVALID_SOLAR_DATE");
  if (publicRange && (date < MIN_DATE || date > MAX_DATE))
    throw Error("VN_DATE_RANGE");
  return +instant / DAY;
}
function solarToLunar(date, { allowBoundaryRisk = false } = {}) {
  const day = parseSolar(date);
  const year = Number(date.slice(0, 4));
  const m = [...span(year - 1), ...span(year)].find(
    (m) => m.startDay <= day && day < m.endDay,
  );
  if (!m) throw Error("LUNAR_MONTH_NOT_FOUND");
  if (m.boundaryRisks.length && !allowBoundaryRisk)
    throw Error("CALENDAR_BOUNDARY_REVIEW");
  return {
    lunarYear: m.lunarYear,
    lunarMonth: m.lunarMonth,
    lunarDay: day - m.startDay + 1,
    isLeap: m.isLeap,
    monthLength: m.length,
    monthStart: isoDay(m.startDay),
    nextMonthStart: isoDay(m.endDay),
    newMoonUtc: m.newMoonUtc,
    nextNewMoonUtc: m.nextNewMoonUtc,
    principalTerms: m.principalTerms,
    boundaryRisks: m.boundaryRisks,
  };
}
function lunarToSolar({ year, month, day, isLeap }) {
  if (
    !Number.isInteger(year) ||
    year < 1975 ||
    year > 2050 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 30 ||
    typeof isLeap !== "boolean"
  )
    throw Error("INVALID_LUNAR_DATE");
  const m = [...span(year - 1), ...span(year)].find(
    (m) =>
      m.lunarYear === year && m.lunarMonth === month && m.isLeap === isLeap,
  );
  if (!m || day > m.length) throw Error("INVALID_LUNAR_DATE");
  const date = isoDay(m.startDay + day - 1);
  solarToLunar(date);
  return date;
}
module.exports = {
  solarToLunar,
  lunarToSolar,
  span,
  civilDay,
  parseSolar,
  MIN_DATE,
  MAX_DATE,
};
