// Presentation-only edits. Never alter Claim.text, rules, matching, or snapshot.
import type { ChartSnapshot } from "../tuvi-engine";
import type { Claim } from "../interpretation-rules/execute";
const edits: Record<string, [string, string]> = {
  "tanbien.r01": [
    " Đây là ý nghĩa nền của sao trong phương pháp truyền thống.",
    "",
  ],
  "tanbien.r12": [
    "Đây là phần chú giải nền trong đoạn thủ Mệnh, không phải kết luận về năng lực giao tiếp hoặc nghề nghiệp của người đọc.",
    "Đoạn này không kết luận về năng lực giao tiếp hoặc nghề nghiệp của người đọc.",
  ],
  "tanbien.r13": [
    "Đây là chú giải nền riêng của sao, không phải đánh giá trí thông minh hay kết luận về nghề nghiệp.",
    "Đoạn này không đánh giá trí thông minh hay kết luận về nghề nghiệp.",
  ],
  "tanbien.r16": [
    "Đây là chú giải nền riêng của sao, không phải kết luận về năng khiếu hay nghề nghiệp.",
    "Đoạn này không kết luận về năng khiếu hay nghề nghiệp.",
  ],
};
export function editorialText(claim: Claim, snapshot?: ChartSnapshot) {
  const bindings: { text: string; evidencePaths: string[] }[] = [];
  const local = {
    "tanbien.r21": {
      palace: "Mệnh",
      phrase: "ở Hợi hoặc Tý",
      branches: ["Hợi", "Tý"],
    },
    "tanbien.r20": {
      palace: "Mệnh",
      phrase: "ở Mão hoặc Dậu",
      branches: ["Mão", "Dậu"],
    },
    "tanbien.r06": {
      palace: "Tài Bạch",
      phrase: "ở Dần hoặc Thân",
      branches: ["Dần", "Thân"],
    },
  }[claim.rules.length === 1 ? claim.rules[0].id : ""];
  let text = claim.text;
  const changes: string[] = [];
  if (local && snapshot && text.includes(local.phrase)) {
    const matches = snapshot.chart.palaces
      .map((p, i) => ({ p, i }))
      .filter((x) => x.p.name === local.palace);
    if (
      matches.length === 1 &&
      local.branches.includes(matches[0].p.earthlyBranch)
    ) {
      const { p, i } = matches[0];
      text = text.replace(local.phrase, `ở ${p.earthlyBranch}`);
      bindings.push({
        text: `${local.palace} tại ${p.earthlyBranch}.`,
        evidencePaths: [
          `chart.palaces.${i}.name`,
          `chart.palaces.${i}.earthlyBranch`,
        ],
      });
      changes.push(
        "Nêu địa chi thực tế từ snapshot; phạm vi đầy đủ của nguồn giữ tại Điều kiện trong tài liệu nguồn.",
      );
    }
  }
  const id = claim.rules.length === 1 ? claim.rules[0].id : "";
  if (id === "tanbien.life-vu-phu-ty-canh-nham") {
    text = "Với Vũ Khúc–Thiên Phủ đồng cung Mệnh tại Tý, Tân Biên nêu ngoại lệ cho người sinh can Canh hoặc Nhâm: không áp lời luận mang tiếng xấu do gặp Tuần/Triệt của nhánh đang được sách đối chiếu. Sách vẫn mô tả tài lộc và hưởng phúc ở nhánh Canh/Nhâm. Đây là ngoại lệ trong văn bản, không xác nhận Tuần/Triệt đang án tại Mệnh của hồ sơ, không khẳng định đã hóa giải và không bảo đảm tài lộc.";
    const ranges = snapshot?.chart.tanBien?.voidRanges;
    const life = snapshot?.chart.palaces.filter(p=>p.name==='Mệnh');
    if(ranges?.length===2 && new Set(ranges.map(v=>v.name)).size===2 && ranges.every(v=>['Tuần Không','Triệt Lộ'].includes(v.name)&&v.branches.length===2) && life?.length===1){
      const location = ranges.map(v=>`${v.name==='Tuần Không'?'Tuần':'Triệt'} tại ${v.branches.join('–')}`).join('; ');
      const direct = ranges.some(v=>v.branches.includes(life[0].earthlyBranch));
      const factual = `Trong hồ sơ này, ${location}; ${direct?'có án ngữ trực tiếp tại Mệnh':'không án ngữ trực tiếp tại Mệnh'}.`;
      text += ' '+factual+' Ngoại lệ nêu trên là phạm vi của đoạn sách, không phải kết luận về việc hóa giải trên hồ sơ này.';
      bindings.push({text:factual,evidencePaths:['chart.tanBien.voidRanges','chart.earthlyBranchOfSoulPalace']});
    }
    changes.push("Làm rõ ngoại lệ Canh/Nhâm; không phục dựng nhánh Giáp/Đinh bị đứt nghĩa, không thay điều kiện hoặc claim gốc.");
  }
  if (id === "tanbien.life-nhat-nguyet-suu" || id === "tanbien.life-nhat-nguyet-mui") {
    text = text.replace("sự giảm ánh sáng khi cùng cung.", "sự giảm ánh sáng khi cùng cung. “Giảm ánh sáng” là thuật ngữ trong đoạn luận tổ hợp, không thay nhãn trạng thái của từng sao đã lưu và không chỉ mức năng lực của người đọc.");
    changes.push("Giải thích thuật ngữ của đoạn tổ hợp; giữ nguyên trạng thái từng sao và giới hạn phối hợp.");
  }
  if (claim.rules.every(r => r.presentation?.readingTheme === "work")) {
    const before = text;
    text = text.replace(/ Nhánh độc thủ này không đòi Hóa Quyền đồng cung\./g, "");
    text = text.replace(/ “Võ nghiệp\/võ chức” chỉ đường quân sự\/chức vụ quân sự trong ngữ cảnh lịch sử; không tự quy đổi thành một nghề hiện đại\./g, "");
    text = text.replace(/ Đây là lời mô tả có điều kiện của sách, không xác nhận nghề nghiệp, chức vụ hay kết quả thực tế của bạn\./g, "");
    // The actual Quan structure is stated once in workFacts. Conditions remain in evidence.
    if (id.startsWith("tanbien.career-occupation-")) text = text.replace(/^Quan Lộc có [^.]+\. /, "");
    if (text !== before) changes.push("Gộp dữ kiện cấu trúc và lời giới hạn chung ở đầu Công việc; ghi chú Hóa Quyền và nguyên văn claim giữ trong căn cứ. Không đổi điều kiện hoặc ý nghĩa.");
  }
  const change =
    claim.rules.length === 1 ? edits[claim.rules[0].id] : undefined;
  if (!change || !text.includes(change[0])) return { text, changes, bindings };
  return {
    text: text.replace(change[0], change[1]),
    bindings,
    changes: [
      ...changes,
      `Rút gọn phần giới thiệu phương pháp: ${change[0].trim()}`,
    ],
  };
}
export const readerIntroduction =
  "Bản dự thảo gồm các chú giải phù hợp với lá số; chưa tổng hợp toàn bộ các yếu tố.";
export const readerGlossary = [
  {
    term: "Cung Mệnh, chính tinh và đồng cung",
    text: "Cung là một ô có tên trên lá số. Chính tinh là nhóm sao được liệt kê riêng trong ô đó. Đồng cung nghĩa là cùng nằm trong một cung; không đồng nghĩa nằm ở cung đối diện.",
  },
  {
    term: "Miếu, vượng, đắc",
    text: "Đây là các nhãn trạng thái trong bảng Tân Biên dùng để kiểm tra điều kiện của từng nhận định. Chúng không phải điểm số hoặc mức chính xác của lời luận.",
  },
  {
    term: "Chú giải riêng và nhận định phối hợp",
    text: "Chú giải riêng nói về một yếu tố. Nhận định phối hợp chỉ xuất khi đủ những yếu tố được nêu trong căn cứ; không phải cộng các chú giải riêng lại.",
  },
];
