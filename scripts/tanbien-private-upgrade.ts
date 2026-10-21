// Owner-authorized local fork; no writes to historical audit or live database.
import {readFile,writeFile,mkdir,chmod} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {calculateInternal,freezeReading} from '../lib/internal-review/dynamic-reading';
import {getReading,saveReading} from '../lib/internal-review/reading-store';
const root='.local/tanbien-engine-audit/v2';await mkdir(root,{recursive:true,mode:0o700});await chmod(root,0o700);
const original=JSON.parse(await readFile('.local/chart-comparison-1992-08-07/audit.json','utf8')).snapshot;
const newInput={...original.normalized,profile:'tanbien-vn-trial-v2'};
const {snapshot,receipt}=await calculateInternal(newInput);
let id:string;
try{const index=JSON.parse(await readFile(root+'/new-reading.json','utf8'));const saved=await getReading(index.id);id=saved?.snapshot.resultId===snapshot.resultId?index.id:randomUUID();}catch{id=randomUUID();}
await saveReading({id,createdAt:new Date().toISOString(),parentId:'audit-chart-comparison',snapshot,receipt,frozen:freezeReading(snapshot,receipt)});
const slots=(s:typeof snapshot)=>{const out:Record<string,unknown[]>={};for(const p of s.chart.palaces)for(const g of ['majorStars','minorStars','adjectiveStars'] as const)for(const st of p[g]){(out[st.name] ||= []).push({branch:p.earthlyBranch,palace:p.name,state:st.brightness||null,mutagen:st.mutagen||null});}return out;};
const old=slots(original),next=slots(snapshot);
const comparison={beforeResultId:original.resultId,afterResultId:snapshot.resultId,id,profile:snapshot.profile,changes:[...new Set([...Object.keys(old),...Object.keys(next)])].filter(n=>JSON.stringify(old[n])!==JSON.stringify(next[n])).map(name=>({name,before:old[name],after:next[name]})),voidRanges:snapshot.chart.tanBien?.voidRanges,calculation:snapshot.chart.tanBien};
await writeFile(root+'/new-reading.json',JSON.stringify({id,url:'/internal/readings?id='+id,resultId:snapshot.resultId},null,2),{mode:0o600});
await writeFile(root+'/comparison.json',JSON.stringify(comparison,null,2),{mode:0o600});
await writeFile(root+'/comparison.md',['# Hồ sơ riêng — đối chiếu bản mới','Không công khai. Bản cũ không thay đổi.',`Profile: ${snapshot.profile.id}; engine ${snapshot.versions.engine}.`,'| Sao | Bản cũ | Bản mới |','|---|---|---|',...comparison.changes.map(x=>`| ${x.name} | ${JSON.stringify(x.before)} | ${JSON.stringify(x.after)} |`),'','Cặp Tuần/Triệt phải đọc trong voidRanges, không dùng phép gom theo tên sao để suy hai vị trí.','Mệnh chủ giữ nguyên theo chi Mệnh; thay đổi trạng thái theo bảng Tân Biên, không thay nhãn lưu trong bản cũ.'].join('\n'),{mode:0o600});
console.log('Created/reused private new-version reading; identifiers and comparison saved under .local/tanbien-engine-audit/v2. No historical writes.');
