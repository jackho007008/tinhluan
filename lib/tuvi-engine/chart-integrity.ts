import type { ChartData } from './index';
import { verifiedNatalTransformations } from './natal-transformations';
export const PRINCIPAL_STARS = ['Tử Vi','Thiên Cơ','Thái Dương','Vũ Khúc','Thiên Đồng','Liêm Trinh','Thiên Phủ','Thái Âm','Tham Lang','Cự Môn','Thiên Tướng','Thiên Lương','Thất Sát','Phá Quân'];
export const CHART_BRANCHES = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
export function principalIntegrity(chart: ChartData) {
  const issues:string[]=[];const ps=chart.palaces;
  if(!Array.isArray(ps))return {valid:false,issues:['PALACES_MISSING']};
  if(ps.length!==12 || new Set(ps.map(p=>p.earthlyBranch)).size!==12 || ps.some(p=>!CHART_BRANCHES.includes(p.earthlyBranch)))issues.push('PALACES_NOT_12_UNIQUE_BRANCHES');
  if(new Set(ps.map(p=>p.name)).size!==12 || ps.some(p=>typeof p.name!=='string'||!p.name.trim()))issues.push('PALACE_NAMES_NOT_UNIQUE');
  const names:string[]=[];
  ps.forEach((p,i)=>{
    if(!Array.isArray(p.majorStars)){issues.push('MAJOR_LIST_MISSING:'+i);return;}
    p.majorStars.forEach((s,j)=>{
      // Current Star transport has no stable ID; exact canonical names are the existing contract.
      if(!s || !PRINCIPAL_STARS.includes(s.name))issues.push('UNKNOWN_MAJOR:'+i+':'+j);
      if((s as {scope?:string})?.scope!=='origin')issues.push('MAJOR_NOT_NATAL:'+i+':'+j);
      if(s)names.push(s.name);
    });
  });
  if(names.length!==14)issues.push('MAJOR_COUNT:'+names.length);
  for(const name of PRINCIPAL_STARS){const n=names.filter(x=>x===name).length;if(n!==1)issues.push((n===0?'MISSING_MAJOR:':'DUPLICATE_MAJOR:')+name);}
  return {valid:issues.length===0,issues};
}
export function chartIntegrity(chart: ChartData) {
  const result=principalIntegrity(chart),issues=[...result.issues];
  const scan=(value:unknown,path:string)=>{if(typeof value==='string' && value.includes('�'))issues.push('UTF8_REPLACEMENT:'+path);else if(value && typeof value==='object')for(const [key,item]of Object.entries(value))scan(item,path+'.'+key);};
  scan(chart,'chart');
  if(chart.natalTransformations!==undefined && !verifiedNatalTransformations(chart))issues.push('NATAL_TRANSFORMATIONS_INCONSISTENT');
  return {version:'chart-integrity-1.0.0',valid:issues.length===0,issues};
}
export function assertChartIntegrity(chart: ChartData) {
  const result=chartIntegrity(chart);
  if(!result.valid)throw Error('CHART_INTEGRITY:'+result.issues.join('|'));
}
