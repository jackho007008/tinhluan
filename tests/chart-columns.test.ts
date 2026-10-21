import {it,expect} from 'vitest';
import {sheetColumns,referenceSide} from '../lib/chart-columns';
it('uses reference sides including exceptions rather than color or brightness',()=>{
 for(const n of ['Văn Xương','Hóa Lộc','Thiên Mã'])expect(referenceSide(n)).toBe('left');
 for(const n of ['Linh Tinh','Kình Dương','Hóa Kỵ','Tướng Quân','Lưu Đà La','Lưu Hà'])expect(referenceSide(n)).toBe('right');
 expect(referenceSide('Chưa phân loại')).toBe('unclassified');
});
it('keeps every entity and original paths without mutation or name deduplication',()=>{
 const entries=['Linh Tinh','Văn Xương','Tên khác','Linh Tinh'].map((name,i)=>({name,label:name,paths:[String(i)],kind:'test'}));const before=JSON.stringify(entries);
 const [l,r]=sheetColumns(entries);expect(l.map(e=>e.name)).toEqual(['Văn Xương','Tên khác']);expect(r.map(e=>e.paths)).toEqual([['0'],['3']]);expect(JSON.stringify(entries)).toBe(before);
});
