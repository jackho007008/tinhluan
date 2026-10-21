// One isolated process per calculation: upstream has mutable config and i18n globals.
const { astro } = require("iztro");
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (b) => (input += b));
process.stdin.on("end", () => {
  try {
    const b = JSON.parse(input);
    astro.config({
      yearDivide: "normal",
      ageDivide: "normal",
      horoscopeDivide: "normal",
      dayDivide: "forward",
      algorithm: "default",
    });
    const a = astro.bySolar(
      b.date,
      b.hour === 23 ? 12 : Math.floor((b.hour + 1) / 2),
      b.gender === "male" ? "男" : "女",
      true,
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
    data.lunar = a.rawDates.lunarDate;
    process.stdout.write(JSON.stringify(data));
  } catch {
    process.exitCode = 1;
  }
});
