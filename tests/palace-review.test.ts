import{it,expect}from'vitest';import fs from'node:fs';
import{palaceReview,PALACE_REVIEW_VERSION}from'../lib/internal-review/palace-review';
import{buildTanBienReading}from'../lib/internal-review/tanbien-reading';
import{exploration}from'../lib/exploration/model';
import type{ChartSnapshot}from'../lib/tuvi-engine';
const pack=JSON.parse(fs.readFileSync('exports/tanbien-review-1.9.0/readings.json','utf8'));
const original:ChartSnapshot=pack.rows.find((r:any)=>r.id==='vn-20').snapshot;
const sourcePairs:Record<string,string>={Tý:'Sửu',Sửu:'Tý',Dần:'Hợi',Hợi:'Dần',Mão:'Tuất',Tuất:'Mão',Thìn:'Dậu',Dậu:'Thìn',Tỵ:'Thân',Thân:'Tỵ',Ngọ:'Mùi',Mùi:'Ngọ'};
it('NPL PDF29: own/opposite/two trines/nhị hợp; multiple relations survive without weight',()=>{
 const r=palaceReview(original,[],true);expect(r.version).toBe(PALACE_REVIEW_VERSION);
 for(const t of r.targets){expect(t.status).toBe('collected');expect(t.rows.filter(x=>x.relations.includes('đồng cung'))).toHaveLength(1);expect(t.rows.filter(x=>x.relations.includes('đối cung'))).toHaveLength(1);expect(t.rows.filter(x=>x.relations.includes('tam hợp'))).toHaveLength(2);expect(t.rows.find(x=>x.relations.includes('nhị hợp'))?.branch).toBe(sourcePairs[t.branch!]);expect(t.rows.filter(x=>x.relations.some(v=>v.startsWith('cung kề')))).toHaveLength(2);}
 // Technical fixture: move only palace labels to test Tý geometry, not an engine chart.
 const s=structuredClone(original),life=s.chart.palaces.find(x=>x.name==='Mệnh')!,ty=s.chart.palaces.find(x=>x.earthlyBranch==='Tý')!;[life.name,ty.name]=[ty.name,life.name];
 const t=palaceReview(s,[],true).targets[0];expect(t.rows.find(x=>x.branch==='Sửu')?.relations).toEqual(['nhị hợp','cung kề (chưa suy cách giáp)']);expect(t.rows.find(x=>x.branch==='Ngọ')?.relations).toEqual(['đối cung']);expect(t.rows.filter(x=>x.relations.includes('tam hợp')).map(x=>x.branch).sort()).toEqual(['Thân','Thìn'].sort());
});
it('source dependencies stay separate; Thân resolves to its actual palace',()=>{
 const r=palaceReview(original,[],true),d=r.dependencies;
 expect(d.find(x=>x.id==='personal')?.names).toEqual(['Phúc Đức','Mệnh','Thân cư','Tật Ách']);
 expect(d.find(x=>x.id==='assets')?.names).toEqual(['Tài Bạch','Điền Trạch']);
 expect(d.find(x=>x.id==='tanbien-finance')?.names).toEqual(['Mệnh','Thân cư','Phúc Đức','Quan Lộc','Thiên Di']);
 expect(d[0].members.find(x=>x.role==='Thân cư')?.palace).toBe(original.chart.palaces.find(x=>x.isBodyPalace)?.name);
});
it('unverified, malformed, missing lists and non-natal evidence never certify absence',()=>{
 expect(palaceReview(original,[],false).targets.every(t=>t.status==='missing-data')).toBe(true);
 const s=structuredClone(original);delete(s.chart.palaces[0] as any).majorStars;expect(palaceReview(s,[],true).targets.every(t=>t.status==='missing-data')).toBe(true);
 const a=structuredClone(original);(a.chart.palaces[0].minorStars as any).push({name:'Test lưu',scope:'year'});
 const rows=palaceReview(a,[],true).targets.flatMap(t=>t.rows).filter(r=>r.path==='chart.palaces.0');
 expect(rows.length).toBeGreaterThan(0);expect(rows.every(r=>!r.lists[1].complete&&r.lists[1].stars.length===0)).toBe(true);
});
it('does not mutate snapshot or claims, borrow opposite stars, or publish internal workflow',()=>{
 const s=structuredClone(original),before=JSON.stringify(s),reading=buildTanBienReading(s),claims=JSON.stringify(reading.execution.previewClaims);
 const r=palaceReview(s,reading.execution.previewClaims,true);expect(JSON.stringify(s)).toBe(before);expect(JSON.stringify(reading.execution.previewClaims)).toBe(claims);
 for(const t of r.targets)for(const row of t.rows)for(const list of row.lists)for(const star of list.stars)expect(star.path.startsWith(row.path+'.')).toBe(true);
 expect(exploration(s).palaceReview).toBeNull();
});
it('ambiguous Thân is missing, not silently Mệnh; method never sets a replacement claim',()=>{
 const s=structuredClone(original);for(const p of s.chart.palaces)p.isBodyPalace=false;
 const r=palaceReview(s,[],true);expect(r.targets.find(t=>t.target==='Thân cư')?.status).toBe('missing-data');expect(r.applied).toEqual([]);const partial=structuredClone(original);delete(partial.chart.palaces.find(p=>!p.isBodyPalace) as any).isBodyPalace;expect(palaceReview(partial,[],true).targets.find(t=>t.target==='Thân cư')?.status).toBe('missing-data');expect(r.procedure.find(x=>x.title==='Xác định điều chỉnh và ngoại lệ')?.status).toBe('unresolved');
});
