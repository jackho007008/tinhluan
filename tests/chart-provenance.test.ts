import { it, expect } from 'vitest';
import { calculate } from '../lib/tuvi-engine';
import { sheetPalaces } from '../lib/chart-sheet';
import { entryProvenance } from '../lib/chart-provenance';
import { referenceSide } from '../lib/chart-columns';

it('projects core and supplemental entities without losing same-name ring records or mutating the snapshot', async () => {
  // Synthetic input; no personal fixture. Exercises the same year group and hour as the audit.
  const s = await calculate({date:'2005-07-09', hour:8, minute:15, unknownTime:false, place:'Dữ liệu kiểm thử', gender:'female', calendar:'solar', timezone:'Asia/Ho_Chi_Minh', profile:'tanbien-vn-trial-v2', consent:true, viewYear:2026});
  const before = JSON.stringify(s);
  const all = sheetPalaces(s,'tanbien',true,true,true).flatMap(c=>c.entries);
  const core = sheetPalaces(s,'tanbien',true,true,false).flatMap(c=>c.entries);
  const extra = all.filter(e=>entryProvenance(s,e).layer==='extended');
  expect(extra.length).toBeGreaterThan(10);
  expect(new Set([...core,...extra].flatMap(e=>e.paths))).toEqual(new Set(all.flatMap(e=>e.paths)));
  expect(all.filter(e=>e.name==='Phi Liêm')).toHaveLength(2);
  expect(core.filter(e=>e.name==='Phi Liêm').map(e=>e.kind)).toEqual(['boshi12']);
  expect(extra.find(e=>e.name==='Phi Liêm')?.kind).toBe('adjectiveStars');
  for(const name of ['Hoa Cái','Kiếp Sát']) {
    expect(core.some(e=>e.name===name)).toBe(true);
    expect(core.find(e=>e.name===name)?.paths).toHaveLength(2);
  }
  expect(core.find(e=>e.name==='Đài Phụ')?.label).toMatch(/^Thai Phụ/);
  expect(referenceSide('Đài Phụ')).toBe('left');
  expect(core.filter(e=>e.kind==='moving')).toHaveLength(9);
  expect(sheetPalaces(s,'tanbien',true,false,false).flatMap(c=>c.entries).some(e=>e.kind==='moving')).toBe(false);
  expect(JSON.stringify(s)).toBe(before);
});
