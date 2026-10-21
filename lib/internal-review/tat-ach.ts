import type { ChartSnapshot } from '../tuvi-engine';
import { principalIntegrity } from '../tuvi-engine/chart-integrity';
import { verifiedNatalTransformations } from '../tuvi-engine/natal-transformations';
import { recordedLayers } from '../chart-presentation';

export const TAT_ACH_VERSION = 'tat-ach-scope-1.0.0';
export const TAT_ACH_NOTICE = 'Phần này trình bày dữ kiện và cách hiểu trong tài liệu tử vi; không đánh giá tình trạng sức khỏe hoặc thay thế khám bệnh.';
// Snapshot projection saved in the reading. No interpretation rules, scores or inferred medical facts.
export function tatAchReading(s: ChartSnapshot, verified: boolean) {
  const ps=s.chart.palaces, matches=ps.map((p,i)=>({p,i})).filter(x=>x.p.name==='Tật Ách');
  const own=matches.length===1?matches[0]:undefined, p=own?.p, path=own?`chart.palaces.${own.i}`:null;
  const valid=verified&&principalIntegrity(s.chart).valid;
  const groups=(['majorStars','minorStars','adjectiveStars'] as const).map((key,i)=>{
    const list=p?.[key];
    const contract=key==='majorStars'?s.chart.tanBien?.completeness?.majorStars==='complete':s.chart.tanBien?.completeness?.[key]==='complete-with-declared-supplements';
    const complete=valid&&contract&&Array.isArray(list)&&list.every(st=>(st as {scope?:string}).scope==='origin');
    return {label:['Chính tinh','Phụ tinh','Tạp diệu'][i],complete,path:path?`${path}.${key}`:null,stars:(!valid?[]:list||[]).flatMap((st,j)=>{
      if((st as {scope?:string}).scope!=='origin')return [];
      const state=s.chart.tanBien?.states[st.name+'@'+p!.earthlyBranch];
      return [{name:st.name,path:`${path}.${key}.${j}`,savedState:st.brightness||null,sourceState:state?.value||null,source:state?.source||null,version:state?.version||null}];
    })};
  });
  const cert=valid&&p?verifiedNatalTransformations(s.chart):undefined;
  const positive=valid&&p?(['majorStars','minorStars','adjectiveStars'] as const).flatMap(g=>(p[g]||[]).flatMap((st,j)=>(st as {scope?:string}).scope==='origin'&&['Lộc','Quyền','Khoa','Kỵ'].includes(st.mutagen||'')?[{star:st.name,kind:st.mutagen!,path:`${path}.${g}.${j}`}]:[])):[];
  const transformations=cert?{status:'complete' as const,text:positive.length?positive.map(x=>`${x.star} Hóa ${x.kind}`).join('; '):'Chứng nhận Tứ Hóa bản mệnh xác nhận không có sao mang Tứ Hóa tại Tật Ách.',entries:positive}
    :{status:'unknown' as const,text:(positive.length?'Snapshot ghi '+positive.map(x=>`${x.star} Hóa ${x.kind}`).join('; ')+'. ':'')+'Chưa có chứng nhận Tứ Hóa đầy đủ, hợp lệ; không suy các sao còn lại không được Hóa.',entries:positive};
  const ranges=s.chart.tanBien?.voidRanges;
  const voidComplete=valid&&!!p&&Array.isArray(ranges)&&ranges.length===2&&new Set(ranges.map(r=>r.name)).size===2&&ranges.every(r=>['Tuần Không','Triệt Lộ'].includes(r.name)&&r.branches.length===2&&new Set(r.branches).size===2&&r.branches.every(b=>ps.some(q=>q.earthlyBranch===b)));
  const voids=voidComplete?ranges!.map(r=>`${r.name} tại ${r.branches.join('–')}; Tật Ách ${r.branches.includes(p!.earthlyBranch)?'thuộc':'không thuộc'} cặp này.`):['Chưa đủ dữ kiện hai cặp Tuần/Triệt đã lưu; không suy vắng mặt.'];
  return {version:TAT_ACH_VERSION,snapshotId:s.resultId,notice:TAT_ACH_NOTICE,palace:'Tật Ách',branch:p?.earthlyBranch||null,path,
    status:p&&groups.every(g=>g.complete)&&cert&&voidComplete?'facts-only' as const:'missing-data' as const,
    groups,transformations,voids,rings:p&&valid?recordedLayers(p):[],
    scope:'Phần này hiện chỉ trình bày dữ kiện đã lưu. Chưa có chú giải cá nhân phù hợp phạm vi sản phẩm từ các đoạn Tật Ách đã đối chiếu; đây không phải kết luận tốt/xấu về cung này.',
    limit:'Trạng thái sao và vị trí Tuần/Triệt là dữ kiện của phương pháp đã lưu, không phải mức sức khỏe hoặc tác động đã được xác nhận. Không mượn lời sao ở đối cung.',
    evidence:{sources:['Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, PDF/trang in 181–189, toàn mục 11; định nghĩa PDF33 §2.6–2.9.','Thiên Lương — Tử Vi Nghiệm Lý Toàn Thư, bản 298 trang, PDF160–163, Phụ Mẫu liên quan gì tới Tật Ách (không có số trang in sách gốc).','Nguyễn Phát Lộc — Tử Vi Hàm Số, bản 237 trang, PDF/trang ghi 44 và 73.'],
      decision:'Các lời về bệnh nạn, cứu giải, tuổi thọ và sinh tử chỉ giữ trong hồ sơ nghiên cứu. Không đổi thành nhận định sức khỏe, căng thẳng hoặc khả năng hồi phục. Các ví dụ kiện cáo/tù tội cũng không chuyển thành dự báo sự kiện cá nhân.',
      dependencies:'Tân Biên yêu cầu xét Mệnh, Thân, Phúc Đức; Thiên Lương khảo sát Phụ–Ách; Hàm Số nêu nhóm Phúc–Mệnh–Thân–Tật. Đây là các phạm vi xem xét, chưa phải phép hợp nhất hoặc bù trừ.',
      statePolicy:'Chỉ đọc trạng thái nguồn đã lưu trong snapshot; ô không có giữ chưa xác định. Không dùng bảng khác hoặc originalBrightness lấp chỗ trống.',snapshotVersion:s.versions,verified,voidComplete,mutagenCertificate:cert||null},
  };
}
export type TatAchReading=ReturnType<typeof tatAchReading>;
