import { expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { star, data } from 'iztro';
import { readingContext } from '../lib/internal-review/tanbien-presentation';
import { internalPreview } from '../lib/internal-review/preview';
import { buildReport } from '../lib/reports';
import saved from '../exports/demo-wuqu-tianfu-review.json';
import type { ChartSnapshot } from '../lib/tuvi-engine';
const base=()=>structuredClone(saved.snapshot) as unknown as ChartSnapshot;
it('public iztro API is exactly the same installed function/data, no formula change',()=>{
 const require=createRequire(import.meta.url);
 for(const key of ['getKuiYueIndex','getChangQuIndexByHeavenlyStem','getLuYangTuoMaIndex','getLuanXiIndex'] as const) expect(star[key]).toBe(require('iztro/lib/star/location')[key]);
 expect(data.heavenlyStems).toBe(require('iztro/lib/data/heavenlyStems').heavenlyStems);
});
it('a missing transformation on Thien Phu never denies known natal Hoa Ky on Vu Khuc',()=>{
 const s=base(),p=s.chart.palaces.find(p=>p.name==='Mệnh')!;
 p.majorStars=[{name:'Vũ Khúc',scope:'origin',mutagen:'Kỵ'},{name:'Thiên Phủ',scope:'origin'}] as any;
 const before=JSON.stringify(s);const notes=readingContext(s,'action').items.map(i=>i.text);
 expect(notes).toContain('Vũ Khúc tại Mệnh mang Hóa Kỵ bản mệnh.');
 expect(notes).toContain('Thiên Phủ tại Mệnh chưa lưu trường Tứ Hóa; chưa thể xác nhận Tứ Hóa bản mệnh của riêng sao này từ các trường đó. Không suy là không có Tứ Hóa; dữ kiện đã biết của sao khác vẫn được giữ.');
 expect(notes.join()).not.toContain('đầy đủ lớp áp dụng và tứ hóa của chính tinh');
 expect(notes.join()).not.toContain('Vũ Khúc tại Mệnh chưa lưu');expect(JSON.stringify(s)).toBe(before);
});
it('missing scope alone, missing fields together, and complete scope are distinct',()=>{
 const s=base(),p=s.chart.palaces.find(p=>p.name==='Mệnh')!;
 p.majorStars=[{name:'Vũ Khúc',mutagen:'Kỵ'},{name:'Thiên Phủ'}] as any;
 let t=readingContext(s,'action').items.map(i=>i.text).join(' ');
 expect(t).toContain('Vũ Khúc tại Mệnh chưa lưu lớp áp dụng;');expect(t).toContain('Thiên Phủ tại Mệnh chưa lưu lớp áp dụng và trường Tứ Hóa;');
 expect(t).not.toContain('Vũ Khúc tại Mệnh mang Hóa Kỵ bản mệnh.');
 p.majorStars=[{name:'Vũ Khúc',scope:'annual',mutagen:'Kỵ'}] as any;
 t=readingContext(s,'action').items.map(i=>i.text).join(' ');expect(t).not.toContain('Hóa Kỵ bản mệnh');expect(t).not.toContain('chưa lưu');
});
it('legacy preview places finance in career/finance section without altering claim or draft gate',async()=>{
 const s=base();const report=await buildReport(s,{groups:['Tổng quan','Sự nghiệp & tài lộc'],year:null});const before=JSON.stringify(report);const preview=internalPreview(report);
 const financial=preview.notes.filter(n=>n.claim.rules.some(r=>r.presentation?.readingTheme==='finance'));
 expect(financial.length).toBeGreaterThan(0);
 for(const note of financial){expect(note.topic).toBe('career');expect(preview.topics.find(t=>t.id==='overview')!.notes.map(n=>n.id)).not.toContain(note.id);expect(note.text).toBe(note.claim.text);}
 expect(preview.execution.approvedClaims).toHaveLength(0);expect(JSON.stringify(report)).toBe(before);
});
it('explicit archived reading uses stored claims and never falls back to current catalog',async()=>{
 const {archivedReading}=await import('../lib/internal-review/archived-reading');
 const fs=await import('node:fs/promises');const pack=JSON.parse(await fs.readFile('exports/tanbien-review-1.9.0/readings.json','utf8'));
 for(const row of pack.rows){const old=await archivedReading('1.9.0',row.id);expect(old!.snapshot).toEqual(row.snapshot);expect(old!.frozen.reading).toEqual(row);}
 expect(await archivedReading('1.9.0','not-a-sample')).toBeNull();expect(await archivedReading('current','vn-16')).toBeNull();
 const old=await archivedReading('1.8.0','vn-16');expect(old!.frozen.reading.templateVersion).toBe('1.8.0');expect(old!.frozen.reading.sections.flatMap(s=>s.paragraphs.map(p=>p.claim.rules[0].id))).toEqual(['tanbien.r21','tanbien.r07']);
});
