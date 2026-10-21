// Reproducible software measurements, NEVER an expected-output oracle.
const fs = require("node:fs");
const c = require("../lib/calendar/vietnamese.cjs");
const fixtures = require("../tests/calendar-fixtures.json");
let checked = 0,
  blocked = 0,
  roundTripFailures = 0;
for (let t = Date.UTC(1976, 0, 1); t <= Date.UTC(2050, 11, 31); t += 86400000) {
  const date = new Date(t).toISOString().slice(0, 10);
  try {
    const l = c.solarToLunar(date);
    if (
      c.lunarToSolar({
        year: l.lunarYear,
        month: l.lunarMonth,
        day: l.lunarDay,
        isLeap: l.isLeap,
      }) !== date
    )
      roundTripFailures++;
    checked++;
  } catch (e) {
    if (e.message === "CALENDAR_BOUNDARY_REVIEW") blocked++;
    else throw e;
  }
}
const exclusions = [];
for (let y = 1975; y <= 2050; y++)
  for (const m of c.span(y))
    if (m.boundaryRisks.length)
      exclusions.push({
        start: new Date(m.startDay * 86400000).toISOString().slice(0, 10),
        end: new Date((m.endDay - 1) * 86400000).toISOString().slice(0, 10),
        reasons: m.boundaryRisks,
      });
const measurements = fixtures.newMoons.map((f) => ({
  source: fixtures.sources[f.source].url,
  solar: f.solar,
  expectedUt: f.ut,
  actualUtc: c.solarToLunar(f.solar).newMoonUtc,
  deltaSeconds:
    (+new Date(c.solarToLunar(f.solar).newMoonUtc) - +new Date(f.ut)) / 1000,
}));
fs.mkdirSync("docs/evidence", { recursive: true });
fs.writeFileSync(
  "docs/evidence/calendar-exclusions.json",
  JSON.stringify(exclusions, null, 2) + "\n",
);
fs.writeFileSync(
  "docs/evidence/calendar-measurements.json",
  JSON.stringify(
    {
      profile: "vn-utc7-midnight-v1",
      calendar: "vn-astronomical-1.0.0",
      dependency: "astronomy-engine@2.1.19",
      checked,
      blocked,
      roundTripFailures,
      measurements,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    checked,
    blocked,
    roundTripFailures,
    nasaSamples: measurements.length,
  }),
);
if (
  roundTripFailures ||
  measurements.some((m) => Math.abs(m.deltaSeconds) > 120)
)
  process.exitCode = 1;
