// Dedicated process. Replace lunar-lite's entire public entrypoint BEFORE loading
// iztro. Poison direct lunar-typescript access to catch any missed CN conversion.
const Module = require("node:module");
const { createBridge } = require("../lib/calendar/iztro-bridge.cjs");
const { solarToLunar } = require("../lib/calendar/vietnamese.cjs");
const { bridge, calls } = createBridge();
function inject(name, exports) {
  const filename = require.resolve(name);
  const mod = new Module(filename);
  mod.filename = filename;
  mod.loaded = true;
  mod.exports = exports;
  require.cache[filename] = mod;
}
inject("lunar-lite", bridge);
inject(
  "lunar-typescript",
  new Proxy(
    {},
    {
      get() {
        throw Error("CN_CALENDAR_FORBIDDEN");
      },
    },
  ),
);
if (require("iztro/package.json").version !== "2.6.1")
  throw Error("ENGINE_VERSION_MISMATCH");
const { astro } = require("iztro");
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (b) => (input += b));
process.stdin.on("end", () => {
  try {
    const b = JSON.parse(input);
    const lunar = solarToLunar(b.date);
    const timeIndex = b.hour === 23 ? 0 : Math.floor((b.hour + 1) / 2);
    astro.config({
      yearDivide: "normal",
      ageDivide: "normal",
      horoscopeDivide: "normal",
      dayDivide: "current",
      algorithm: "default",
    });
    const a = astro.bySolar(
      b.date,
      timeIndex,
      b.gender === "male" ? "男" : "女",
      false,
      "vi-VN",
    );
    const keys = [
      "solarDate",
      "lunarDate",
      "time",
      "timeRange",
      "soul",
      "body",
      "fiveElementsClass",
      "earthlyBranchOfSoulPalace",
      "earthlyBranchOfBodyPalace",
      "palaces",
    ];
    const data = Object.fromEntries(keys.map((k) => [k, a[k]]));
    data.lunar = {
      lunarYear: lunar.lunarYear,
      lunarMonth: lunar.lunarMonth,
      lunarDay: lunar.lunarDay,
      isLeap: lunar.isLeap,
    };
    data.timeRange =
      timeIndex === 0
        ? "23:00–00:59"
        : `${String(timeIndex * 2 - 1).padStart(2, "0")}:00–${String(timeIndex * 2).padStart(2, "0")}:59`;
    if (timeIndex === 0) data.time = "Giờ Tý";
    data.calendarEvidence = {
      ...lunar,
      provider: "astronomy-engine@2.1.19",
      calendarVersion: "vn-astronomical-1.0.0",
      bridgeCalls: calls,
      cnCalendarAccess: "blocked",
      timeIndex,
      dayBoundary: "00:00",
      leapStarMonth: "repeat-month-number",
    };
    process.stdout.write(JSON.stringify(data));
  } catch (e) {
    process.stdout.write(JSON.stringify({ error: e.message }));
    process.exitCode = 1;
  }
});
