import { birthSchema, type BirthInput } from './calendar';
export function birthForYear(input: BirthInput, year: string): BirthInput | null {
  if (!/^\d{4}$/.test(year) || input.profile !== 'tanbien-vn-trial-v2') return null;
  const {viewDate: _date, viewHourIndex: _hour, ...birth} = input;
  const parsed = birthSchema.safeParse({...birth, viewYear:Number(year)});
  return parsed.success ? parsed.data : null;
}

/** Civil year in the same timezone as the supported Vietnamese input profile. */
export function currentVietnameseYear(now: Date = new Date()): number {
  return Number(new Intl.DateTimeFormat('en', {year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(now));
}
