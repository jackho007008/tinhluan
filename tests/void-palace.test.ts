import {it,expect,describe,vi} from 'vitest';
import fs from 'node:fs';
import {voidAssessment,voidBranches,voidRules} from '../lib/interpretation-rules/void-palace';
import {executeRules} from '../lib/interpretation-rules/execute';
import * as tables from '../lib/tuvi-engine/tanbien';
const records=JSON.parse(fs.readFileSync('.local/tuan-triet-20261013/before8.json','utf8'));
const branch=(key:string)=>voidBranches.find(b=>b.key===key)!;
const assessment=(s:any,key:string)=>voidAssessment(s,branch(key));
// Deliberately edited technical fixtures, never counted as engine charts.
function fixture(palace:string,chi:string,stars:string[],tt=true){
 const s=structuredClone(records[1].snapshot);const ps=s.chart.palaces;const p=ps.find((p:any)=>p.name===palace),q=ps.find((p:any)=>p.earthlyBranch===chi);[p.earthlyBranch,q.earthlyBranch]=[q.earthlyBranch,p.earthlyBranch];
 const all=ps.flatMap((p:any)=>p.majorStars);ps.forEach((p:any)=>p.majorStars=[]);p.majorStars=all.filter((x:any)=>stars.includes(x.name));ps.find((x:any)=>x!==p).majorStars=all.filter((x:any)=>!stars.includes(x.name));
 const b=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'],i=b.indexOf(chi);s.chart.tanBien.voidRanges=[{name:'Tuần Không',branches:[b[(i+4)%12],b[(i+5)%12]]},{name:'Triệt Lộ',branches:tt?[chi,b[(i+1)%12]]:[b[(i+8)%12],b[(i+9)%12]]}];return s;
}
function move(s:any,star:string,chi:string){let found:any;for(const p of s.chart.palaces){const i=p.majorStars.findIndex((x:any)=>x.name===star);if(i>=0)found=p.majorStars.splice(i,1)[0];}s.chart.palaces.find((p:any)=>p.earthlyBranch===chi).majorStars.push(found);}
describe('source-specific direct Tuần/Triệt',()=>{
 it('stored 1992 and Kim actual branches, immutable chart and history',()=>{const copy=JSON.stringify(records);expect(assessment(records[1].snapshot,'dien-void-co-cu').value).toBe(true);expect(assessment(records[0].snapshot,'career-void-tu-ngo').value).toBe(true);expect(JSON.stringify(records)).toBe(copy);});
 it.each(['Mão','Dậu'])('Cơ–Cự source-compatible branch %s',chi=>expect(assessment(fixture('Điền Trạch',chi,['Thiên Cơ','Cự Môn']),'dien-void-co-cu').value).toBe(true));
 it.each([['Điền Trạch','Mão',['Thiên Cơ']],['Điền Trạch','Sửu',['Thiên Cơ','Cự Môn']],['Quan Lộc','Mão',['Thiên Cơ','Cự Môn']]])('wrong structure %s %s', (p,c,stars)=>expect(assessment(fixture(p as string,c as string,stars as string[]),'dien-void-co-cu').value).toBe(false));
 it('direct required; no borrowing from another palace',()=>expect(assessment(fixture('Điền Trạch','Mão',['Thiên Cơ','Cự Môn'],false),'dien-void-co-cu').value).toBe(false));
 it('both at Dien preserves older distinct branch, does not cancel at Quan',()=>{const s=fixture('Điền Trạch','Mão',['Thiên Cơ','Cự Môn']);s.chart.tanBien.voidRanges[0].branches=['Dần','Mão'];expect(assessment(s,'dien-void-co-cu').value).toBe(false);expect(assessment(records[0].snapshot,'career-void-tu-ngo').value).toBe(true);});
 it.each(['Sửu','Mùi'])('SunMoon dedicated Quan exception %s',chi=>{const s=fixture('Quan Lộc',chi,['Thái Dương','Thái Âm']);expect(assessment(s,'career-void-sun-moon').value).toBe(true);expect(assessment(s,'career-void-empty-base').value).toBe(false);});
 it('SunMoon wrong branch or missing member is not exception',()=>{expect(assessment(fixture('Quan Lộc','Mão',['Thái Dương','Thái Âm']),'career-void-sun-moon').value).toBe(false);expect(assessment(fixture('Quan Lộc','Sửu',['Thái Âm']),'career-void-sun-moon').value).toBe(false);});
 it.each(['Điền Trạch','Quan Lộc'])('VCD base and both-bright exception exclusive at %s',palace=>{const prefix=palace==='Điền Trạch'?'dien':'career';const s=fixture(palace,'Sửu',[]);move(s,'Thái Dương','Tỵ');move(s,'Thái Âm','Dậu');expect(assessment(s,prefix+'-void-empty-light').value).toBe(true);expect(assessment(s,prefix+'-void-empty-base').value).toBe(false);move(s,'Thái Âm','Ngọ');expect(assessment(s,prefix+'-void-empty-light').value).toBe(false);expect(assessment(s,prefix+'-void-empty-base').value).toBe(true);});
 it('brightness without appropriate relation does not satisfy exception',()=>{const s=fixture('Điền Trạch','Sửu',[]);move(s,'Thái Dương','Mão');move(s,'Thái Âm','Hợi');expect(assessment(s,'dien-void-empty-light').value).toBe(false);});
 it.each(['missing-list','incomplete','transit','missing-void','bad-void'])('unknown proof %s never false',type=>{const s=structuredClone(records[1].snapshot);if(type==='missing-list')s.chart.palaces.find((p:any)=>p.name==='Điền Trạch').majorStars=undefined;if(type==='incomplete')s.chart.tanBien.completeness.majorStars='unknown';if(type==='transit')s.chart.palaces.find((p:any)=>p.name==='Điền Trạch').majorStars[0].scope='yearly';if(type==='missing-void')delete s.chart.tanBien.voidRanges;if(type==='bad-void')s.chart.tanBien.voidRanges[0].branches=['Mão','Hợi'];expect(assessment(s,'dien-void-co-cu').value).toBeUndefined();});
 it('missing source state blocks base and exception, not filled from engine',()=>{const s=fixture('Điền Trạch','Sửu',[]);const spy=vi.spyOn(tables,'bookState').mockReturnValue({value:undefined} as any);try{expect(assessment(s,'dien-void-empty-base').value).toBeUndefined();expect(assessment(s,'dien-void-empty-light').value).toBeUndefined();}finally{spy.mockRestore();}});
 it('draft gate remains, expected source claims match internal only',()=>{const s=records[1].snapshot;expect(executeRules(s,voidRules,'internal-draft').previewClaims.map(c=>c.rules[0].id)).toContain('tanbien.dien-void-co-cu');expect(executeRules(s,voidRules,'customer').previewClaims).toHaveLength(0);expect(voidRules.every(r=>r.status==='draft'&&r.review===null)).toBe(true);});
});
