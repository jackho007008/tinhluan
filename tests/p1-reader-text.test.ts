import {describe,it,expect} from 'vitest';
import {p1ReaderText} from '../lib/internal-review/p1-reader-text';
describe('P1 reader wording, independent from professional evaluation',()=>{
 for(const kind of ['cuc','empty','one']) it(`explains ${kind}, keeps exact source assessment and limitation`,()=>{
  const original='Trong phép xét riêng, trường hợp này được xếp “xấu nhất”. Không phải mức tốt/xấu của toàn cung.';
  const text=p1ReaderText([`npl.life-foundation-${kind}`],original);
  expect(text).toContain('“xấu nhất”');expect(text).toContain('Không phải mức tốt/xấu của toàn cung.');
  expect(text).toContain('không dùng nó để chọn bên thắng');
  expect(text).toContain(kind==='cuc'?'hành nạp âm':kind==='empty'?'không mượn sao đối cung':'hành sao');
 });
 it('never rewrites other methods or old source claims',()=>{
  const t='trường hợp này được xếp “tốt nhất”';
  expect(p1ReaderText(['tanbien.r01'],t)).toBe(t);
  expect(p1ReaderText(['npl.life-two-major-generates'],t)).toBe(t);
  expect(p1ReaderText([],t)).toBe(t);
 });
});

import {lifeOverview} from '../lib/internal-review/life-overview';
import fs from 'node:fs';
it('empty-palace source gap does not deny a separate P1 reading',()=>{
 const rows=JSON.parse(fs.readFileSync('.local/npl-foundation-20261014/before192.json','utf8'));
 const s=rows.find((r:any)=>r.snapshot.chart.palaces.find((p:any)=>p.name==='Mệnh').majorStars.length===0).snapshot;
 const gap=lifeOverview(s,[],true,false).gaps[0];
 expect(gap.text).toContain('theo các nhánh Tân Biên');
 expect(gap.text).toContain('không thay thế các phép xét ngũ hành riêng');
 expect(gap.cause).not.toContain('Thiếu dữ kiện');
});
