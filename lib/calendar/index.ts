import { z } from "zod";
import profileRanges from "./profile-ranges.json" with { type: "json" };
export { profileRanges };
export function civilDateExists(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return (
    year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1]
  );
}
export const birthSchema = z
  .object({
    name: z.string().trim().max(80, "Họ tên tối đa 80 ký tự").optional(),
    date: z.string(),
    viewYear: z.number().int().min(1976).max(2050).optional(),
    viewDate: z.string().optional(),
    viewHourIndex: z.number().int().min(0).max(11).optional(),
    hour: z.number().int().min(0).max(23).nullable(),
    minute: z.number().int().min(0).max(59).nullable(),
    unknownTime: z.boolean(),
    place: z.string().trim().min(2, "Nhập nơi sinh").max(120),
    gender: z.enum(["male", "female"]),
    calendar: z.literal("solar"),
    profile: z.enum([
      "vn-unavailable",
      "cn-reference",
      "vn-utc7-midnight-v1",
      "tanbien-vn-trial-v1",
      "tanbien-vn-trial-v2",
    ]),
    timezone: z.literal("Asia/Ho_Chi_Minh"),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Vui lòng xác nhận giới hạn phương pháp" }),
    }),
  })
  .strict()
  .superRefine((v, c) => {
    if (
      v.viewYear !== undefined &&
      (v.profile !== "tanbien-vn-trial-v2" ||
        v.viewYear < Number(v.date.slice(0, 4)))
    )
      c.addIssue({
        code: "custom",
        path: ["viewYear"],
        message:
          "Năm xem chỉ hỗ trợ profile Tân Biên v2, không trước năm sinh.",
      });
    if (
      v.viewDate !== undefined &&
      (!civilDateExists(v.viewDate) ||
        v.viewDate < "1976-01-01" ||
        v.viewDate > "2050-12-31" ||
        v.viewYear === undefined)
    )
      c.addIssue({
        code: "custom",
        path: ["viewDate"],
        message:
          "Ngày xem phải tồn tại trong 1976–2050 và cần chọn năm âm xem.",
      });
    if (v.viewHourIndex !== undefined && v.viewDate === undefined)
      c.addIssue({
        code: "custom",
        path: ["viewHourIndex"],
        message: "Cần chọn ngày xem trước giờ xem.",
      });
    const range = profileRanges[v.profile];
    const message = !v.date
      ? "Vui lòng nhập ngày sinh"
      : !civilDateExists(v.date)
        ? "Ngày sinh không tồn tại hoặc sai định dạng YYYY-MM-DD"
        : v.date < range.min || v.date > range.max
          ? `${range.label} chỉ hỗ trợ ngày sinh từ ${range.min} đến ${range.max} (${range.years})`
          : null;
    if (message) c.addIssue({ code: "custom", path: ["date"], message });
    if (!v.unknownTime && (v.hour === null || v.minute === null))
      c.addIssue({
        code: "custom",
        path: ["hour"],
        message: "Cần giờ và phút sinh",
      });
  });
export type BirthInput = z.infer<typeof birthSchema>;
export function normalize(input: unknown) {
  const b = birthSchema.parse(input);
  return {
    ...b,
    hour: b.unknownTime ? null : b.hour,
    minute: b.unknownTime ? null : b.minute,
  };
}
export function timeIndex(hour: number) {
  return hour === 23 ? 12 : Math.floor((hour + 1) / 2);
}
