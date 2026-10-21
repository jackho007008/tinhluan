import type { ChartSnapshot } from '../tuvi-engine';
import { principalIntegrity } from '../tuvi-engine/chart-integrity';
import { careerRelations } from './career-conditions';
import type { Claim } from '../interpretation-rules/execute';

/** Evidence collection only. Never supplied as facts to executeRules. */
export const PALACE_REVIEW_VERSION = 'npl-evidence-process-1.0.0';
export const NPL_SOURCE = {
  author: 'Nguyễn Phát Lộc', title: 'Tử Vi Hàm Số', pages: 237,
  sha256: '2a0245dcadaf77f2d8e35c9798893343c3be7117c5cc40a42087153ea5212709',
};
const groups = ['majorStars', 'minorStars', 'adjectiveStars'] as const;
export function palaceReview(snapshot: ChartSnapshot, claims: Claim[], verified: boolean) {
  const ps = snapshot.chart.palaces;
  const valid = verified && principalIntegrity(snapshot.chart).valid;
  const body = ps.every(p=>typeof p.isBodyPalace === 'boolean')
    ? ps.map((p,i)=>({p,i})).filter(x=>x.p.isBodyPalace === true) : [];
  const locate = (name: string) => {
    const found = name === 'Thân cư' ? body : ps.map((p,i)=>({p,i})).filter(x=>x.p.name === name);
    return found.length === 1 ? found[0] : undefined;
  };
  const observations = ps.map((p,i)=>({
    palace: p.name, branch: p.earthlyBranch, path: `chart.palaces.${i}`,
    lists: groups.map(group=>{
      const list = p[group];
      const complete = valid && Array.isArray(list) && list.every(s=>s && typeof s.name === 'string' && (s as {scope?:string}).scope === 'origin');
      return { group, complete, stars: complete ? list.map((s,j)=>({
        name:s.name, state:s.brightness || null, path:`chart.palaces.${i}.${group}.${j}`,
      })) : [] };
    }),
  }));
  // Order is a technical reading aid, never strength, majority or precedence.
  const rank = (rs:string[]) => rs.includes('đồng cung') ? 0 : rs.includes('đối cung') ? 1 : rs.includes('tam hợp') ? 2 : rs.includes('nhị hợp') ? 3 : 4;
  const targets = ['Mệnh','Thân cư','Quan Lộc','Tài Bạch'].map(target=>{
    const own = locate(target);
    const rows = valid && own ? observations.flatMap((o,i)=>{
      const relations = careerRelations(own.p.earthlyBranch,o.branch);
      return relations.length ? [{...o, relations, originPath:`chart.palaces.${own.i}.earthlyBranch`, targetPath:`chart.palaces.${i}.earthlyBranch`}] : [];
    }).sort((a,b)=>rank(a.relations)-rank(b.relations)) : [];
    return { target, palace:own?.p.name || null, branch:own?.p.earthlyBranch || null,
      status: rows.length ? 'collected' as const : 'missing-data' as const, rows,
      source:'Nguyễn Phát Lộc — Tử Vi Hàm Số, PDF/trang ghi trong bản 28–33, 40–41, 50–51.',
      limit:'Quan hệ vị trí chỉ xác định nơi cần xem. Hai cung kề chưa chứng minh một cách giáp; sao chiếu vẫn ở cung gốc. Không mở rộng điều kiện tọa thủ của lời luận hiện hành.',
    };
  });
  const dependencies = [
    {id:'personal',title:'Cá nhân',names:['Phúc Đức','Mệnh','Thân cư','Tật Ách'],source:'Nguyễn Phát Lộc — Tử Vi Hàm Số, PDF/trang 73: hàm số cá nhân; các trường hợp riêng có thể cần thêm cung.'},
    {id:'social',title:'Xã hội',names:['Thiên Di','Quan Lộc','Nô Bộc'],source:'Nguyễn Phát Lộc — Tử Vi Hàm Số, PDF/trang 74: hàm số xã hội.'},
    {id:'career',title:'Nghề nghiệp',names:['Quan Lộc','Nô Bộc'],source:'Nguyễn Phát Lộc — Tử Vi Hàm Số, PDF/trang 74: hàm số nghề nghiệp.'},
    {id:'assets',title:'Tài sản',names:['Tài Bạch','Điền Trạch'],source:'Nguyễn Phát Lộc — Tử Vi Hàm Số, PDF/trang 74: hàm số tài sản.'},
    {id:'tanbien-finance',title:'Tài Bạch — các cung cần xét theo Tân Biên',names:['Mệnh','Thân cư','Phúc Đức','Quan Lộc','Thiên Di'],source:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, PDF 190, mở đầu mục Tài Bạch. Giữ riêng, không thay bằng nhóm Tài–Điền của Nguyễn Phát Lộc.'},
  ].map(g=>({...g, members:g.names.map(name=>{const x=locate(name);return {role:name,palace:x?.p.name||null,branch:x?.p.earthlyBranch||null,path:x?`chart.palaces.${x.i}`:null};})}));
  const applied = claims.map(c=>({claimId:c.id, text:c.text, rules:c.rules.map(r=>({id:r.id,version:r.version})), factIds:c.factIds}));
  return {
    version:PALACE_REVIEW_VERSION, snapshotId:snapshot.resultId, source:NPL_SOURCE,
    kind:'evidence-workflow' as const, targets, dependencies, applied,
    stateNotice:'Trạng thái dưới đây là giá trị đã lưu trên lá số. Không đổi sang bảng Nguyễn Phát Lộc; mỗi lời luận vẫn dùng bảng nguồn đã khai báo trong căn cứ riêng.',
    procedure:[
      {title:'Xác định cung và các cung liên hệ',sourcePages:[28,29,40,50,51],status:valid?'collected':'missing-data',text:valid?'Đã dẫn về vị trí gốc của chính cung, đối cung, hai cung tam hợp, nhị hợp và hai cung kề.':'Chưa xác minh được độ đầy đủ hoặc tính toàn vẹn dữ liệu; không suy sao vắng mặt.'},
      {title:'Đối chiếu chính tinh, tổ hợp và phụ tinh',sourcePages:[33,48,49],status:'existing-rules-only',text:'Chỉ các điều kiện hiện hành đã khớp mới sinh lời luận. Danh sách sao liên hệ không được dùng để giả lập sao tọa thủ.'},
      {title:'Xác định điều chỉnh và ngoại lệ',sourcePages:[49,76],status:'unresolved',text:'Ngoại lệ đã có đặc tả tiếp tục do từng rule xử lý. Nguyên tắc chính tinh có thể chế phụ tinh chưa xác định được câu nào phải thay trong các cặp nhận định đang xét.'},
      {title:'Xét các cung theo chủ đề',sourcePages:[73,74,76,77],status:'dependencies-collected',text:'Các nhóm dưới đây chỉ ra dữ kiện cần đối chiếu; chưa có phép hợp nhất kết luận toàn chủ đề.'},
    ],
    claimPolicy:'Các nhận định giữ nguyên căn cứ và phạm vi của từng rule. Không suy tổ hợp vô hiệu hóa đơn sao, không cộng hoặc triệt tiêu các ý khác chiều. Chỉ dẫn định tính ở PDF 49 và 76 chưa đủ để thực hiện một phép thay thế chung.',
  };
}
export type PalaceReview = ReturnType<typeof palaceReview>;
