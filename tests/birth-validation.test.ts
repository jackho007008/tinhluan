import { it, expect } from "vitest";
import {
  birthSchema,
  civilDateExists,
  profileRanges,
  normalize,
} from "../lib/calendar";
import { calculate } from "../lib/tuvi-engine";
const input = {
  date: "1992-06-15",
  hour: 10,
  minute: 30,
  unknownTime: false,
  place: "Hà Nội — mẫu",
  gender: "female",
  calendar: "solar",
  profile: "vn-utc7-midnight-v1",
  timezone: "Asia/Ho_Chi_Minh",
  consent: true,
};
it("missing, invalid civil dates and profile ranges have distinct errors without UTC conversion", () => {
  for (const [date, part] of [
    ["", "nhập ngày"],
    ["1992-02-30", "không tồn tại"],
    ["1900-02-29", "không tồn tại"],
    ["1975-12-31", "1976–2050"],
    ["2051-01-01", "1976–2050"],
  ]) {
    const r = birthSchema.safeParse({ ...input, date });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(r.error.flatten().fieldErrors.date?.join()).toContain(part);
  }
  for (const date of ["1992-02-29", "2000-02-29", "1976-01-01", "2050-12-31"])
    expect(birthSchema.safeParse({ ...input, date }).success).toBe(true);
  expect(civilDateExists("2100-02-29")).toBe(false);
  expect(normalize(input).date).toBe("1992-06-15");
  expect(normalize({ ...input, unknownTime: true }).hour).toBeNull();
});
it("CN boundaries stay separate; switching profile never changes birth date", () => {
  for (const date of ["1900-01-01", "2099-12-31"])
    expect(
      birthSchema.safeParse({ ...input, profile: "cn-reference", date })
        .success,
    ).toBe(true);
  for (const date of ["1899-12-31", "2100-01-01"])
    expect(
      birthSchema.safeParse({ ...input, profile: "cn-reference", date })
        .success,
    ).toBe(false);
  expect(birthSchema.safeParse({ ...input, date: "1960-01-01" }).success).toBe(
    false,
  );
  expect(
    normalize({ ...input, profile: "cn-reference", date: "1960-01-01" }).date,
  ).toBe("1960-01-01");
});
it.each(["vn-utc7-midnight-v1", "cn-reference"] as const)(
  "actual engine accepts unchanged boundary dates: %s",
  async (profile) => {
    for (const date of [
      profileRanges[profile].min,
      profileRanges[profile].max,
    ]) {
      const s = await calculate({ ...input, profile, date });
      expect(s.normalized.date).toBe(date);
      expect(s.profile.id).toBe(profile);
    }
  },
);
