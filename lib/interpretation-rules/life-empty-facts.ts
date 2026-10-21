import { principalIntegrity } from '../tuvi-engine/chart-integrity';
import type { ChartSnapshot } from '../tuvi-engine';
import type { DerivedFact } from './derived';
import { tanBienLifeTables } from './tanbien-source';
import { CHART_BRANCHES as branches } from '../tuvi-engine/chart-integrity';
/** Read saved natal lists only. The declaration and structural checks are both required. */
export function emptyLifeFacts(s: ChartSnapshot): DerivedFact[] {
  const ps=s.chart.palaces;
  if(s.chart.tanBien?.completeness?.majorStars!=='complete' || !principalIntegrity(s.chart).valid) return [];
  const lives=ps.map((p,i)=>({p,i})).filter(x=>x.p.name==='Mệnh');
  if(lives.length!==1)return [];
  const {p,i}=lives[0];const base=`chart.palaces.${i}`;
  const oppositeBranch=branches[(branches.indexOf(p.earthlyBranch)+6)%12];
  const j=ps.findIndex(x=>x.earthlyBranch===oppositeBranch);const opposite=ps[j];const ob=`chart.palaces.${j}`;
  const proof=['chart.tanBien.completeness.majorStars',...ps.map((_,k)=>`chart.palaces.${k}.majorStars`)];
  const out:DerivedFact[]=[];
  const add=(id:string,value:string|string[],text:string,evidencePaths:string[],status:DerivedFact['status']='engine-reported')=>out.push({id,derivationId:'saved-empty-life-geometry',version:'1.0.0',value,text,evidencePaths,status,limitation:'Dữ kiện bản mệnh đã lưu; không chuyển sao xung chiếu thành sao tọa Mệnh, không đánh giá tốt/xấu toàn cung.'});
  add('fact.life-complete-major-count',String(p.majorStars.length),`Mệnh tại ${p.earthlyBranch} có ${p.majorStars.length} chính tinh; hồ sơ ghi danh sách đầy đủ và đủ 14 chính tinh duy nhất trên 12 cung.`,[`${base}.name`,`${base}.majorStars`,...proof]);
  add('fact.life-opposite-branch',oppositeBranch,`${opposite.name} tại ${oppositeBranch} là đối cung của Mệnh tại ${p.earthlyBranch}.`,[`${base}.earthlyBranch`,`${ob}.earthlyBranch`,`${ob}.name`]);
  add('fact.life-opposite-majors',opposite.majorStars.map(st=>st.name),`Chính tinh tại đối cung ${opposite.name} (${oppositeBranch}): ${opposite.majorStars.map(st=>st.name).join(', ') || 'không có'}.`,[`${ob}.majorStars`]);
  add('fact.life-opposite-major-count',String(opposite.majorStars.length),`Đối cung có ${opposite.majorStars.length} chính tinh trong danh sách đầy đủ.`,[`${ob}.majorStars`,...proof]);
  if(['Thái Dương','Thái Âm'].every(n=>opposite.majorStars.some(st=>st.name===n))){
    const states=[tanBienLifeTables.taiyang?.states?.[oppositeBranch],tanBienLifeTables.taiyin?.states?.[oppositeBranch]];
    if(states.every(Boolean))add('fact.life-opposite-sun-moon-light',states.every(x=>['Miếu','Vượng','Đắc'].includes(x))?'bright':'other',`Theo bảng Tân Biên, Thái Dương tại ${oppositeBranch}: ${states[0]}; Thái Âm: ${states[1]}. Đây là trạng thái theo vị trí, chưa phải đánh giá tổ hợp.`,[`${ob}.earthlyBranch`,`${ob}.majorStars`],'source-table');
  }
  // The source branches name both original palaces; never borrow resident-star claims.
  const luminaries = [{name:'Thái Dương',key:'taiyang',id:'sun'}, {name:'Thái Âm',key:'taiyin',id:'moon'}] as const;
  for(const star of luminaries){
    const k=ps.findIndex(x=>x.majorStars.some(st=>st.name===star.name));
    const palace=ps[k],paths=[`chart.palaces.${k}.majorStars`,`chart.palaces.${k}.earthlyBranch`,`${base}.earthlyBranch`,...proof];
    add(`fact.empty-life-${star.id}-branch`,palace.earthlyBranch,`${star.name} ở ${palace.name} tại ${palace.earthlyBranch}; giữ nguyên cung gốc.`,paths);
    const state=tanBienLifeTables[star.key]?.states?.[palace.earthlyBranch];
    if(state)add(`fact.empty-life-${star.id}-light`,['Miếu','Vượng','Đắc'].includes(state)?'bright':'other',`${star.name} tại ${palace.earthlyBranch}: ${state} theo ${tanBienLifeTables[star.key].id}, phiên bản ${tanBienLifeTables[star.key].version}; không đổi trạng thái đã lưu.`,paths,'source-table');
  }
  return out;
}
