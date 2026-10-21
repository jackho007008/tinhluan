import type {ChartSnapshot} from '../tuvi-engine';
import {familyFacts,makeFamilyRule,type FamilyBranch} from './phu-huynh';
import {ruleSchema} from './schema';

// TB PDF219 §15.2.4, repeated PDF220 §15.2.9: "sau" qualifies
// the description, not an age predicate. Do not invent an age threshold.
export const siblingsVuTham:FamilyBranch={
 id:'vu-tham-later',palace:'Huynh Đệ',stars:['Vũ Khúc','Tham Lang'],
 branches:[],mode:'exact',wealth:false,page:219,section:'15.2.4',
 text:'mô tả anh chị em sớm xa nhau, về sau đều giàu có.',
};
const base=makeFamilyRule(siblingsVuTham);
export const familyExtensionRules=[ruleSchema.parse({
 ...base,version:'0.1.0',
 sourceReferences:base.sourceReferences.map(s=>({...s,
  location:'Trang PDF219 §15.2.4; lặp lại trang PDF220 §15.2.9. Ngữ cảnh Huynh Đệ PDF217–224; định nghĩa đồng cung PDF33.',
  accessedOn:'2026-10-20',
 })),
 presentation:{...base.presentation,
  projectScope:[
   'tanbien-family-extension-1.0.0; Vũ Khúc và Tham Lang bản mệnh đồng cung Huynh Đệ; chính tinh đầy đủ, hợp lệ.',
   'Giữ cả sớm xa nhau và về sau đều giàu có; không dùng vế giàu có để xóa vế xa cách.',
   'Không đặt tuổi, giới tính, trạng thái sáng hoặc vắng Tuần/Triệt khi đoạn nguồn không quy định.',
   'Không xuất mệnh đề số lượng anh chị em; không chuyển tiền của người thân thành tài chính của đương số.',
  ],
  sourceConditions:['Vũ Khúc–Tham Lang đồng cung Huynh Đệ bản mệnh.'],
  readerLimit:'Lời riêng của cặp sao về anh chị em, không xác định tuổi diễn ra hoặc một người thân cụ thể; chưa phối hợp Phúc Đức để kết luận toàn bộ.',
 },
})];
export const familyExtensionFacts=(snapshot:ChartSnapshot)=>familyFacts(snapshot,[siblingsVuTham]);
