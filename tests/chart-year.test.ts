import {it,expect} from 'vitest';
import {birthForYear} from '../lib/chart-year';
import {chartColor} from '../lib/chart-colors';
import type {BirthInput} from '../lib/calendar';
const birth:BirthInput={date:'2000-06-15',hour:8,minute:0,unknownTime:false,gender:'female',calendar:'solar',timezone:'Asia/Ho_Chi_Minh',place:'Giả lập',profile:'tanbien-vn-trial-v2',consent:true,viewYear:2025,viewDate:'2025-08-01',viewHourIndex:2};
it('changes year without carrying stale day/hour or mutating input',()=>{const before=JSON.stringify(birth);const next=birthForYear(birth,'2026');expect(next?.viewYear).toBe(2026);expect(next?.viewDate).toBeUndefined();expect(next?.viewHourIndex).toBeUndefined();expect(JSON.stringify(birth)).toBe(before);expect(next?.profile).toBe(birth.profile)});
it('rejects unavailable years and other profiles',()=>{for(const year of ['', '1999','2051','2026.5'])expect(birthForYear(birth,year)).toBeNull();expect(birthForYear({...birth,profile:'cn-reference'},'2026')).toBeNull()});
it('color lookup is explicit and unknown names remain neutral',()=>{expect(chartColor('Thiên Cơ')).toBe('#087b48');expect(chartColor('Lưu Thiên Mã')).toBe('#c83232');expect(chartColor('Chưa xác minh')).toBe('#282624');expect(chartColor('Tham Lang')).toBe('#087b48')});

it('current year follows Vietnam civil time across the UTC year boundary',async()=>{
 const {currentVietnameseYear}=await import('../lib/chart-year');
 expect(currentVietnameseYear(new Date('2026-12-31T16:59:59Z'))).toBe(2026);
 expect(currentVietnameseYear(new Date('2026-12-31T17:00:00Z'))).toBe(2027);
});
