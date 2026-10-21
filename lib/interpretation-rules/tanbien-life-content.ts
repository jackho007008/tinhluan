import { ruleSchema, type Rule, type Condition } from "./schema";
/** Source-specific local readings, not a synthesis of single-star glosses. */
export const lifeBranches = [
  {
    id: "vu-phu-ty-canh-nham",
    stars: ["Vũ Khúc", "Thiên Phủ"],
    branches: ["Tý"],
    stems: ["Canh", "Nhâm"],
    pages: "77 §4.2.7 Phú giải; ngữ cảnh 76–78",
    category: "A",
    text: "Với Vũ Khúc–Thiên Phủ đồng cung Mệnh tại Tý, sách dành riêng cho tuổi Canh và Nhâm một ngoại lệ: không áp lời luận mang tiếng xấu do gặp Tuần/Triệt như ở nhánh trước. Đoạn này vẫn giữ mô tả tài lộc và hưởng phúc. Đây là nhánh nguồn dành cho cả tổ hợp và can sinh, không phải cộng ý nghĩa hai sao.",
    limit:
      "Chỉ xác định được nhánh Canh/Nhâm trong đoạn nguồn; chưa kết luận tài sản, danh tiếng hay sự hóa giải Tuần/Triệt trên lá số. Phần đầu nhánh Giáp/Đinh trong bản PDF bị đứt nghĩa; không áp hoặc sửa đoán phần đó.",
  },
  {
    id: "dong-nguyet-ty",
    stars: ["Thiên Đồng", "Thái Âm"],
    branches: ["Tý"],
    stems: [],
    pages: "64 §4.2.3 Phú giải; ngữ cảnh 62–65, 78–80",
    category: "B",
    text: "Trong nhánh Thiên Đồng–Thái Âm cùng ở Mệnh tại Tý, Tân Biên dùng hình ảnh mặt trăng sáng để mô tả tổ hợp. Cùng đoạn còn đặt điều chỉnh riêng khi Hổ, Khốc, Riêu, Tang hội hợp ở nữ mệnh. Vì điều kiện hội hợp chưa được đặc tả cho đoạn này, phần đọc chỉ giới thiệu cách sách phân nhánh, không rút ra kết luận về ngoại hình hoặc hôn nhân.",
    limit:
      "Chưa xác định phạm vi hội hợp và cách phối hợp Hổ–Khốc–Riêu–Tang; không coi các sao ấy vắng mặt hoặc ngoại lệ đã được loại trừ.",
  },
  ...["Sửu", "Mùi"].map((branch, i) => ({
    id: "nhat-nguyet-" + ["suu", "mui"][i],
    stars: ["Thái Dương", "Thái Âm"],
    branches: [branch],
    stems: [],
    pages: "71–72 §4.2.5 Phú giải; ngữ cảnh 68–72, 78–80",
    category: "B",
    text: "Tân Biên có nhánh riêng cho Thái Dương–Thái Âm đồng cung Mệnh tại Sửu hoặc Mùi: sách không coi đây là cộng hai ý nghĩa đơn sao mà nói đến sự giảm ánh sáng khi cùng cung. Phần tiếp theo xét sao chiếu, sát tinh, Tuần/Triệt và các phụ tinh. Chưa đủ quy tắc phối hợp những yếu tố đó để đánh giá con người hay mức thành đạt từ tổ hợp này.",
    limit:
      "Chưa chốt ngưỡng “nhiều sao sáng”, phạm vi sát tinh và nghĩa án ngữ trong đoạn này. Không suy cung kém tốt, năng lực thấp hoặc thành bại từ phần chú giải.",
  })),
];
export const lifeContentRules: Rule[] = lifeBranches.map((s) => {
  const conditions: Condition[] = [
    ...s.stars.map((value) => ({
      fact: "fact.life-stars",
      op: "includes" as const,
      value,
    })),
    { fact: "fact.life-branch", op: "eq", value: s.branches[0] },
  ];
  if (s.stems.length)
    conditions.push({
      fact: "fact.life-birth-stem-group",
      op: "eq",
      value: "canh-nham",
    });
  return ruleSchema.parse({
    id: "tanbien.life-" + s.id,
    version: "0.1.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["tanbien-vn-trial-v2"],
    requiredFacts: [
      ...conditions.map((c) => c.fact),
      "fact.source-position-available",
    ],
    conditions,
    exceptions: [],
    claimTemplate: s.text,
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "tanbien-supplied-pdf",
        title: "Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên",
        url: "/internal/editorial/demo-wuqu-tianfu#source-list",
        location: "Trang ebook/PDF " + s.pages,
        accessedOn: "2026-10-11",
        rights: "pending",
        rightsNote:
          "Đọc bản ebook chủ dự án cung cấp; chưa xác minh trang bản in gốc hoặc quyền sử dụng. Diễn giải ngắn, dự thảo nội bộ.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [s.limit],
    presentation: {
      title: "Nhánh " + s.stars.join("–") + " tại " + s.branches.join("/"),
      contentType: "context",
      readingTheme: "action",
      readerLimit: s.limit,
      sourceConditions: [
        "Hai chính tinh bản mệnh " +
          s.stars.join(" và ") +
          " đồng cung Mệnh tại " +
          s.branches.join("/") +
          ".",
        ...(s.stems.length ? ["Can năm sinh âm lịch là Canh hoặc Nhâm."] : []),
      ],
      projectScope: [
        "Chỉ chú giải nhánh có điều kiện được nêu trực tiếp; không xác nhận kết quả cá nhân.",
        "Không thêm nhánh dự đoán ngoại hình, sức khỏe, hôn nhân, nghề nghiệp hoặc tài sản.",
      ],
      applicability:
        "Đủ vị trí chính tinh và đầu vào được nhánh yêu cầu; không dùng sao lưu.",
      knownExceptions: [s.limit],
      unknownConditions: [s.limit],
      sourceScope:
        "Nhánh Mệnh trong Tân Biên; không mượn nội dung Quan Lộc hay Tài Bạch.",
    },
  });
});
export function refineLifeRules(rules: Rule[]): Rule[] {
  return rules.map((r) =>
    r.id !== "tanbien.r02"
      ? r
      : ruleSchema.parse({
          ...r,
          version: "0.5.0",
          claimTemplate:
            "Vũ Khúc sáng theo bảng nguồn và Văn Khúc cùng ở Mệnh là một tổ hợp được Tân Biên nêu riêng trong phần Phú giải, gắn với chủ đề học hỏi rộng. Đây là chú giải truyền thống của điều kiện ấy, không xác nhận trí thông minh, bằng cấp hoặc năng lực học tập thực tế.",
          presentation: {
            ...r.presentation!,
            contentType: "context",
            projectScope: [
              "Chú giải tổ hợp Vũ Khúc–Văn Khúc; không suy trí thông minh, bằng cấp hoặc năng khiếu cụ thể.",
            ],
            readerLimit:
              "Chưa tổng hợp các sao khác và điều chỉnh; không dùng nhánh này để đánh giá năng lực học tập.",
          },
          limitations: [
            "Chưa tổng hợp các sao khác và điều chỉnh; không dùng nhánh này để đánh giá năng lực học tập.",
          ],
        }),
  );
}

/** life-expansion/1.0.0: source-local descriptions, not whole-person conclusions. */
export const lifeExpansionBranches = [
 {id:'co-luong-thin-tuat',stars:['Thiên Cơ','Thiên Lương'],branches:['Thìn','Tuất'],table:null,state:null,kind:'combination',pages:'75 §4.2.6 Phú giải; ngữ cảnh74–76',title:'Cơ–Lương tại Mệnh Thìn/Tuất',
 text:'Với Thiên Cơ và Thiên Lương cùng ở Mệnh tại Thìn hoặc Tuất, Tân Biên có lời riêng về tổ hợp: hay bàn xét chính lược, chiến lược. Đây là chủ đề luận bàn trong cách mô tả truyền thống, không phải xác nhận học vấn, tài năng hoạch định hay nghề phù hợp của người đọc.',
 limit:'Chưa phối hợp các sao chiếu, Tuần/Triệt và sát tinh. Không áp các câu về phúc thọ hay giàu sang ở những nhánh bên cạnh cho riêng điều kiện này.'},
 {id:'dong-dac-ty-hoi',stars:['Thiên Đồng'],branches:['Tỵ','Hợi'],table:'tiantong',state:'Đắc',kind:'star-gloss',pages:'62 §4.2.3 Đại cương; ngữ cảnh62–65; bảng34 §3.3',title:'Thiên Đồng Đắc tại Mệnh Tỵ/Hợi',
 text:'Ở nhánh Thiên Đồng đắc địa tại Tỵ hoặc Hợi, Tân Biên mô tả sự thích phiêu lưu, nay đây mai đó và hay thay đổi chỗ ở. Đây là ý riêng theo vị trí của sao; không xác nhận người đọc sẽ di chuyển hay nên rời nơi đang sống.',
 limit:'Đoạn kế có điều chỉnh cho tuổi Đinh/Canh về sự toại lòng, chưa được dùng để kết luận cuộc đời. Ý thích đi đây đó không tự chứng minh sự thuận lợi của việc di chuyển.'},
 {id:'dong-ham',stars:['Thiên Đồng'],branches:[],table:'tiantong',state:'Hãm',kind:'star-gloss',pages:'62–63 §4.2.3 Đại cương; đối chiếu64 Phú giải; bảng34 §3.3',title:'Thiên Đồng Hãm tại Mệnh',
 text:'Với Thiên Đồng hãm địa tại Mệnh, đoạn Đại cương trong Tân Biên mô tả sự thay đổi ý kiến, thiếu quả quyết và dễ chóng chán khi làm một việc. Đây là chú giải riêng của sao trong tài liệu; chưa thể dùng để đánh giá tính cách hoặc sự bền chí thực tế của người đọc.',
 limit:'Các nhánh can sinh, hội hợp và chính tinh đi cùng chưa được tổng hợp. Không suy trí thông minh, đạo đức, sinh kế hoặc tuổi thọ từ chữ Hãm; không áp lời này thành kết luận về cả tổ hợp.'},
 {id:'luong-ham-ty-hoi',stars:['Thiên Lương'],branches:['Tỵ','Hợi'],table:'tianliang',state:'Hãm',kind:'star-gloss',pages:'92–93 §4.2.12 Đại cương; ngữ cảnh92–95; bảng38 §3.12',title:'Thiên Lương Hãm tại Mệnh Tỵ/Hợi',
 text:'Trong nhánh Thiên Lương hãm địa tại Tỵ hoặc Hợi, Tân Biên đặt cạnh nhau ý thích phiêu lưu, nay đây mai đó và sự nông nổi, ăn tiêu rộng tay. Đây là mô tả của nhánh nguồn, không phải kết luận về hành vi, mức chi tiêu hay hoàn cảnh tài chính của người đọc.',
 limit:'Chưa phối hợp các sao khác và điều chỉnh hội hợp. Không lấy chú giải này để suy trí tuệ, phẩm hạnh, bệnh tật, tai họa hoặc khuyên thay đổi chỗ ở.'},
 {id:'luong-ham-dau',stars:['Thiên Lương'],branches:['Dậu'],table:'tianliang',state:'Hãm',kind:'star-gloss',pages:'92–93 §4.2.12 Đại cương; ngữ cảnh92–95; bảng38 §3.12',title:'Thiên Lương Hãm tại Mệnh Dậu',
 text:'Riêng Thiên Lương hãm địa tại Dậu, Tân Biên mô tả sự thiếu bền chí và chưa suy xét cẩn thận trước khi làm nên dễ nhầm lẫn. Đây là ý riêng của Thiên Lương theo vị trí; chưa tổng hợp với chính tinh cùng cung và không phải đánh giá khả năng cân nhắc của người đọc.',
 limit:'Không ghép ý này với chú giải Thái Dương để tự tạo kết luận Nhật–Lương. Chưa xét phối hợp các sao và điều chỉnh; chữ Hãm không phải mức năng lực cá nhân.'},
] as const;
/** life-ham-gloss/1.0.0: PDF images 36–37,78–80,90–92 verified.
 * These are individual-star glosses, not exception-resolved personal conclusions.
 * No solitary-star, stem or sex requirement occurs in the chosen general clauses.
 */
export const lifeHamBranches = [
 {id:'nguyet-ham-dan-thin-ngo',stars:['Thái Âm'],branches:['Dần','Thìn','Ngọ'],table:'taiyin',state:'Hãm',kind:'star-gloss',pages:'79 §4.2.8 Đại cương; ngữ cảnh78–80; bảng36 §3.8',title:'Thái Âm Hãm tại Mệnh Dần/Thìn/Ngọ',
 text:'Với Thái Âm ở Mệnh tại Dần, Thìn hoặc Ngọ, bảng Tân Biên ghi Hãm. Đoạn Đại cương mô tả sự ưa ngao du, ngâm vịnh và không tham cầu danh lợi, đi cùng nét ương ngạnh. Đây là những ý riêng về sao trong tài liệu, không phải kết luận về tính cách của người đọc.',
 limit:'Cùng đoạn còn mô tả sự bất như ý, vất vả; không dùng các ý ấy để dự báo hoàn cảnh. Sách có điều chỉnh riêng khi hội hợp hoặc gặp Tuần/Triệt án ngữ, chưa được tổng hợp ở đây. Nếu có chính tinh cùng cung, chú giải này không phải lời luận tổ hợp.'},
 {id:'nguyet-ham-mao-ty',stars:['Thái Âm'],branches:['Mão','Tỵ'],table:'taiyin',state:'Hãm',kind:'star-gloss',pages:'79 §4.2.8 Đại cương, hai đoạn đầu và các điều chỉnh; ngữ cảnh78–80; bảng36 §3.8',title:'Thái Âm Hãm tại Mệnh Mão/Tỵ',
 text:'Thái Âm tại Mệnh Mão hoặc Tỵ vẫn thuộc Hãm theo bảng Tân Biên. Nhánh chung mô tả sự ưa ngao du, ngâm vịnh, không tham cầu danh lợi cùng nét ương ngạnh. Tuy nhiên, ngay sau đó sách giảm mức bất lợi về sinh kế và điều chẳng lành riêng cho Mão/Tỵ; không nên áp nguyên lời bất lợi chung cho hai vị trí này.',
 limit:'Đây là chú giải cách sách phân nhánh, không xác nhận tính cách hay bảo đảm hoàn cảnh sống. Điều chỉnh Mão/Tỵ không đổi trạng thái Hãm trong bảng. Chưa tổng hợp hội hợp, Tuần/Triệt hoặc chính tinh đi cùng; không ghép với Thiên Cơ thành lời Cơ–Âm.'},
 {id:'tuong-ham-mao-dau',stars:['Thiên Tướng'],branches:['Mão','Dậu'],table:'tianxiang',state:'Hãm',kind:'star-gloss',pages:'90–91 §4.2.11 Đại cương; ngữ cảnh90–92; bảng37 §3.11',title:'Thiên Tướng Hãm tại Mệnh Mão/Dậu',
 text:'Thiên Tướng tại Mệnh Mão hoặc Dậu được bảng Tân Biên ghi Hãm. Đoạn Đại cương đặt nét đôn hậu bên cạnh sự dễ đam mê, thích ăn chơi và ít lo xa. Đây là các mặt được sách nêu cùng nhau trong chú giải riêng của sao, không phải đánh giá phẩm chất hoặc khả năng cân nhắc của người đọc.',
 limit:'Cùng đoạn mô tả sự bất như ý nhưng vẫn có sinh kế; không lấy một vế để kết luận hoàn cảnh thực tế. Các đoạn sau có điều chỉnh về hội hợp, Tuần/Triệt và Hình; chưa đủ để áp các kết quả ấy trong chú giải này. Không suy sức khỏe, tuổi thọ hoặc lời luận tổ hợp từ chữ Hãm.'},
] as const;
export const allLifeExpansionBranches = [...lifeExpansionBranches,...lifeHamBranches];

export const lifeExpansionRules:Rule[]=allLifeExpansionBranches.map(s=>ruleSchema.parse({
 id:'tanbien.life-batch-'+s.id,version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.life-batch-'+s.id,'fact.source-position-available'],conditions:[{fact:'fact.life-batch-'+s.id,op:'eq',value:'yes'}],exceptions:[],claimTemplate:s.text,evidencePaths:['chart.palaces','chart.tanBien.completeness'],sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:'PDF/trang ebook '+s.pages,accessedOn:'2026-10-12',rights:'pending',rightsNote:'Đối chiếu trực tiếp văn bản và ảnh PDF chủ dự án cung cấp. Chưa phê duyệt chuyên môn.'}],conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:[s.limit],presentation:{title:s.title,contentType:s.kind==='combination'?'context':'element-gloss',readingTheme:'action',readerLimit:s.limit,sourceConditions:[s.stars.join(' và ')+' bản mệnh tọa Mệnh'+(s.branches.length?' tại '+s.branches.join(' hoặc '):'')+'.',...(s.state?[`Trạng thái ${s.state} theo bảng Tân Biên của đúng sao; không dùng originalBrightness.`]:[])],projectScope:[(lifeHamBranches.some(x=>x.id===s.id)?'life-ham-gloss/1.0.0. ':'life-expansion/1.0.0. ')+'Kiểm tra hợp đồng danh sách đầy đủ:12 cung,14 chính tinh bản mệnh duy nhất.','Phương pháp trạng thái: '+(s.table?'tanBienLifeTables.'+s.table+'@1.0.0':'không yêu cầu cho câu được chọn')+'.','Chỉ vế mô tả chủ đề/hành vi trong nhánh nguồn; không xuất phán xét trí tuệ, đạo đức, tuổi thọ hoặc lời hứa phú quý.'],applicability:'Đúng sao, vị trí và trạng thái khi nguồn yêu cầu; thiếu dữ liệu giữ unknown.',knownExceptions:[s.limit],unknownConditions:['Chưa có phương pháp hợp nhất các ý đơn sao và điều chỉnh thành kết luận cá nhân.'],sourceScope:'Mệnh §4.2; không mượn lời Quan Lộc/Tài Bạch, không luận vận.'}}));
