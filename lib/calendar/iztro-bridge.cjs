const { solarToLunar, parseSolar } = require("./vietnamese.cjs");
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];
const ZODIAC = [
  "鼠",
  "牛",
  "虎",
  "兔",
  "龙",
  "蛇",
  "马",
  "羊",
  "猴",
  "鸡",
  "狗",
  "猪",
];
function createBridge() {
  const calls = {};
  const trace = (name) => {
    calls[name] = (calls[name] || 0) + 1;
  };
  function lunar(date) {
    trace("solar2lunar");
    const d = solarToLunar(date);
    return {
      ...d,
      toString: () =>
        `${d.lunarYear}-${d.lunarMonth}-${d.lunarDay}${d.isLeap ? " (nhuận)" : ""}`,
    };
  }
  const bridge = {
    solar2lunar: lunar,
    getTotalDaysOfLunarMonth(date) {
      trace("getTotalDaysOfLunarMonth");
      return solarToLunar(date).monthLength;
    },
    getHeavenlyStemAndEarthlyBranchBySolarDate(date, timeIndex, options = {}) {
      trace("getHeavenlyStemAndEarthlyBranchBySolarDate");
      if (
        options.year !== "normal" ||
        (options.month && options.month !== "normal") ||
        !Number.isInteger(timeIndex) ||
        timeIndex < 0 ||
        timeIndex > 11
      )
        throw Error("UNSUPPORTED_BRIDGE_CONVENTION");
      const l = solarToLunar(date);
      const jdn = parseSolar(date) + 2440588;
      const yearStem = (l.lunarYear + 6) % 10,
        dayStem = (jdn + 9) % 10;
      const yearly = [STEMS[yearStem], BRANCHES[(l.lunarYear + 8) % 12]];
      const monthly = [
        STEMS[(l.lunarYear * 12 + l.lunarMonth + 3) % 10],
        BRANCHES[(l.lunarMonth + 1) % 12],
      ];
      const daily = [STEMS[dayStem], BRANCHES[(jdn + 1) % 12]];
      const hourly = [
        STEMS[(dayStem * 2 + timeIndex) % 10],
        BRANCHES[timeIndex],
      ];
      return {
        yearly,
        monthly,
        daily,
        hourly,
        toString: () =>
          [yearly, monthly, daily, hourly].map((p) => p.join("")).join(" "),
      };
    },
    getZodiac(branch) {
      trace("getZodiac");
      const i = BRANCHES.indexOf(branch);
      if (i < 0) throw Error("INVALID_BRANCH");
      return ZODIAC[i];
    },
    // Western zodiac is not a product capability and is not included in the DTO.
    getSign() {
      trace("getSignExcluded");
      return "";
    },
  };
  return {
    calls,
    bridge: new Proxy(bridge, {
      get(target, key) {
        if (key in target) return target[key];
        throw Error("UNSUPPORTED_CALENDAR_CALL:" + String(key));
      },
    }),
  };
}
module.exports = { createBridge };
