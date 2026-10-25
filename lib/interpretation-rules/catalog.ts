import {vttlNoLuongRule} from './vttl-no-luong';
import {nplDienSingleRules} from './npl-dien-single-void';
import {vttlCareerCoAmRule} from './vttl-career-co-am';
import {vttlDienPhuRule} from './vttl-dien-phu';
import {trungchauRules} from './trungchau-natal';
import {vcdLightRules} from './vcd-light-exceptions';
import {phucUnadjustedRules} from './phuc-unadjusted';
import {parentUnadjustedRules} from './parent-unadjusted';
import {diVoidRules} from './di-void';
import {financeVcdRules,financeVcdScaleRules,careerVcdScaleRules} from './finance-vcd';
import {quanTaiRules} from './quan-tai';
import {localPalaceRules} from './no-dien-phuc';
import {approvedKinRules} from './kin-approved';
import {familyVcdRules} from './family-vcd';
import {familyExtensionRules} from './family-extension';
import {kinExtensionRules} from './kin-extension';
import {childrenVcdRules} from './children-vcd';
import {completionRules} from './natal-completion';
import {lifeLiteraryRules} from './life-literary';
import {nplLocalRules} from './npl-local-adjustments';
import {nplTwoV2Rules as nplTwoRules,nplFoundationRules} from './npl-foundation';
import {nplBodyRules} from './npl-body';
import {lifeBodyRules} from './life-body-method';
import {retentionRule} from './finance-retention';
import {voidRules} from './void-palace';
import {kinRules} from './phu-tu';
import {familyRules} from './phu-huynh';
import {noDienRules} from "./no-dien";
import {phucDiRules} from "./phuc-di";
import { careerClosingRules } from "./career-closing";
import { occupationalCareerRules } from "./career-occupations";
import { activeIndependentCareerRules } from "./career-independent";
import { careerKyRules } from "./tanbien-career-ky";
import { careerQuyenRule } from "./tanbien-career-quyen";
import { emptyLifeRule, emptyLifeTrineRules } from "./tanbien-empty-life";
import {lifeContentRules,lifeExpansionRules,refineLifeRules} from "./tanbien-life-content";
import { tanBienRules } from "./tanbien";
import { derivations } from "./derived";
import { ruleSchema, type Rule } from "./schema";
export const RULESET_VERSION = "interpretation-1.70.0";
const base = {
  version: "1.0.0",
  origin: "catalog" as const,
  requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
  exceptions: [],
  conflictsWith: [],
  conflictGroup: null,
  conflictPolicy: "retain-both" as const,
  status: "draft" as const,
  review: null,
};
export const catalog: Rule[] = [
  ...derivations.map((d) =>
    ruleSchema.parse({
      ...base,
      id: d.id,
      kind: "fact",
      topic: d.topic,
      requiredFacts: [d.id],
      conditions: [{ fact: d.id, op: "exists" }],
      claimTemplate: `{{${d.id}}}`,
      evidencePaths: ["chart.palaces"],
      sourceReferences: [
        {
          id: "iztro-technical",
          title: "iztro 2.6.1 — dữ liệu cung/sao",
          url: "https://github.com/SylarLong/iztro/tree/v2.6.1",
          location:
            "lib/astro/astro.js bySolar, lib/astro/palace.js; technical DTO only",
          accessedOn: "2026-10-07",
          rights: "cleared",
          rightsNote:
            "MIT; chỉ mô tả trường dữ liệu, giữ attribution trong docs/licenses.",
        },
      ],
      limitations: [
        "Đặc tả chép dữ kiện kỹ thuật; không phải quy tắc luận mệnh được chuyên gia duyệt.",
      ],
    }),
  ),
  ruleSchema.parse({
    ...base,
    id: "draft.overview.tong",
    kind: "interpretation",
    topic: "overview",
    requiredFacts: ["fact.life-stars"],
    conditions: [
      { fact: "fact.life-stars", op: "includes", value: "Thiên Đồng" },
    ],
    claimTemplate:
      "Bản thảo đọc nguồn: Thiên Đồng tại Mệnh được liên hệ với sự ôn hòa trong văn bản truyền thống. Không đủ để kết luận tính cách của một người.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "紫微斗數全書, quyển một — bản chép Wikisource",
        url: "https://zh.wikisource.org/wiki/紫微斗數全書/卷一",
        location:
          "諸星問答論 / 問天同星所主若何？; đoạn thân/mệnh và tính ôn hòa",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Chờ xác định bản in, đối chiếu bản chép và quyền dùng bản chuyển ngữ; không sao chép dài.",
      },
    ],
    limitations: [
      "Chưa đối chiếu bản in và bản dịch chuyên môn.",
      "Chưa đặc tả đầy đủ ngoại lệ, hội chiếu, sát tinh; không được phát hành.",
      "Nội dung truyền thống không phải phép đo tâm lý.",
    ],
  }),
  ruleSchema.parse({
    ...base,
    id: "draft.career.palace",
    kind: "interpretation",
    topic: "career",
    requiredFacts: ["fact.career-location"],
    conditions: [{ fact: "fact.career-location", op: "exists" }],
    claimTemplate:
      "Bản thảo phương pháp: Quan Lộc được dùng để bàn về cách làm việc trong phương pháp của tác giả iztro. Vị trí cung riêng lẻ không xác định nghề nghiệp hoặc thu nhập.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "iztro-palace",
        title: "Tài liệu tác giả iztro — hệ thống cung",
        url: "https://docs.iztro.com/learn/palace",
        location: "官禄宫; đoạn mô tả thái độ làm việc",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Nguồn tác giả hiện đại, không phải cổ thư hoặc xác nhận chuyên gia Việt Nam; cần kiểm tra quyền nội dung website riêng với license mã.",
      },
    ],
    limitations: [
      "Chỉ là bản thảo cách chọn phạm vi chủ đề, không phải dự báo nghề.",
      "Chưa có đặc tả phối hợp sao/ngoại lệ hoặc người kiểm duyệt.",
    ],
  }),
  ruleSchema.parse({
    id: "reading.wuqu",
    version: "1.1.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Vũ Khúc",
      },
    ],
    exceptions: [],
    claimTemplate: "Văn bản cổ gắn Vũ Khúc với tài và sự quả quyết.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location: "諸星問答論 → 問武曲星所主為何？, đoạn mở đầu và 希夷先生曰",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Bản chép chưa đối chiếu bản in; quyền chuyển ngữ/chú giải chưa xác minh, chỉ đọc nội bộ.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chỉ đọc ý nghĩa riêng của sao đang có tại Mệnh; chưa phải lời luận cho toàn lá số.",
      "Chưa có quy tắc đầy đủ phối hợp Vũ Khúc với tứ hóa và hội chiếu; không suy mức thu nhập.",
    ],
    presentation: {
      title: "Vũ Khúc: biểu tượng về tài",
      contentType: "element-gloss",
      applicability:
        "Chỉ đọc ý nghĩa riêng của sao đang có tại Mệnh; chưa phải lời luận cho toàn lá số.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa có quy tắc đầy đủ phối hợp Vũ Khúc với tứ hóa và hội chiếu; không suy mức thu nhập.",
        "Danh sách ngoại lệ chưa được đặc tả đầy đủ; rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Ý nghĩa riêng của yếu tố; không suy thành tính cách, nghề nghiệp hoặc kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.tianfu",
    version: "1.1.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Thiên Phủ",
      },
    ],
    exceptions: [],
    claimTemplate: "Thiên Phủ được ví với kho chứa trong văn bản cổ.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location: "諸星問答論 → 問天府所主若何？, đoạn văn và bài ca về 祿庫",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Bản chép chưa đối chiếu bản in; quyền chuyển ngữ/chú giải chưa xác minh, chỉ đọc nội bộ.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Đây là chú giải biểu tượng Thiên Phủ, không phải kết luận tổ hợp Vũ Khúc–Thiên Phủ.",
      "Cần bản in và đặc tả phối hợp Thiên Phủ với các yếu tố đi kèm. Không ghép biểu tượng thành kết luận về tài sản.",
    ],
    presentation: {
      title: "Thiên Phủ: hình tượng kho tàng",
      contentType: "element-gloss",
      applicability:
        "Đây là chú giải biểu tượng Thiên Phủ, không phải kết luận tổ hợp Vũ Khúc–Thiên Phủ.",
      knownExceptions: [],
      unknownConditions: [
        "Cần bản in và đặc tả phối hợp Thiên Phủ với các yếu tố đi kèm. Không ghép biểu tượng thành kết luận về tài sản.",
        "Danh sách ngoại lệ chưa được đặc tả đầy đủ; rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Ý nghĩa riêng của yếu tố; không suy thành tính cách, nghề nghiệp hoặc kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.ziwei",
    version: "1.1.0",
    kind: "interpretation",
    topic: "career",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.career-stars"],
    conditions: [
      {
        fact: "fact.career-stars",
        op: "includes",
        value: "Tử Vi",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Tử Vi mang hình tượng đế tọa; cách đọc của cổ thư còn xét sao phụ tá.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location: "諸星問答論 → 問紫微所主若何？, đoạn xét 左右 và 官祿身命",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Bản chép chưa đối chiếu bản in; quyền chuyển ngữ/chú giải chưa xác minh, chỉ đọc nội bộ.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chỉ bàn lớp biểu tượng của Tử Vi tại cung đang xét.",
      "Chưa đủ điều kiện về phụ tá, hội chiếu và quy tắc Hóa Quyền cho trường hợp này.",
    ],
    presentation: {
      title: "Tử Vi: hình tượng chủ trì",
      contentType: "element-gloss",
      applicability: "Chỉ bàn lớp biểu tượng của Tử Vi tại cung đang xét.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa đủ điều kiện về phụ tá, hội chiếu và quy tắc Hóa Quyền cho trường hợp này.",
        "Danh sách ngoại lệ chưa được đặc tả đầy đủ; rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Ý nghĩa riêng của yếu tố; không suy thành tính cách, nghề nghiệp hoặc kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.tianxiang",
    version: "1.1.0",
    kind: "interpretation",
    topic: "career",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.career-stars"],
    conditions: [
      {
        fact: "fact.career-stars",
        op: "includes",
        value: "Thiên Tướng",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Thiên Tướng được gắn với ấn và vai trò phụ tá trong cổ thư.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "諸星問答論 → 問天相星所主若何？, đoạn mở đầu 化氣曰印、佐帝之位",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Bản chép chưa đối chiếu bản in; quyền chuyển ngữ/chú giải chưa xác minh, chỉ đọc nội bộ.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Giải thích riêng biểu tượng; không cộng ý nghĩa Tử Vi với Thiên Tướng thành một kết luận tổ hợp.",
      "Thiếu quy tắc phối hợp Thiên Tướng với các yếu tố tại Quan Lộc, gồm cả điều kiện loại trừ.",
    ],
    presentation: {
      title: "Thiên Tướng: hình tượng ấn và phụ tá",
      contentType: "element-gloss",
      applicability:
        "Giải thích riêng biểu tượng; không cộng ý nghĩa Tử Vi với Thiên Tướng thành một kết luận tổ hợp.",
      knownExceptions: [],
      unknownConditions: [
        "Thiếu quy tắc phối hợp Thiên Tướng với các yếu tố tại Quan Lộc, gồm cả điều kiện loại trừ.",
        "Danh sách ngoại lệ chưa được đặc tả đầy đủ; rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Ý nghĩa riêng của yếu tố; không suy thành tính cách, nghề nghiệp hoặc kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.body-career",
    version: "1.1.0",
    kind: "interpretation",
    topic: "career",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.body-palace"],
    conditions: [
      {
        fact: "fact.body-palace",
        op: "eq",
        value: "Quan Lộc",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Tác giả iztro liên hệ Thân cư Quan Lộc với sự chú ý đến cách hoàn thành công việc.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "iztro-palace",
        title: "Tài liệu tác giả iztro — hệ thống cung",
        url: "https://docs.iztro.com/learn/palace",
        location: "身宫 → 身宫在官禄宫",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Bản chép chưa đối chiếu bản in; quyền chuyển ngữ/chú giải chưa xác minh, chỉ đọc nội bộ.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Cần đúng vị trí an Thân, đồng thời đọc toàn bộ Mệnh và các yếu tố liên quan.",
      "Cần người duyệt xác nhận phạm vi áp dụng của phương pháp hiện đại với quy ước lập lá số này.",
    ],
    presentation: {
      title: "Thân cư Quan Lộc",
      contentType: "method-gloss",
      applicability:
        "Cần đúng vị trí an Thân, đồng thời đọc toàn bộ Mệnh và các yếu tố liên quan.",
      knownExceptions: [],
      unknownConditions: [
        "Cần người duyệt xác nhận phạm vi áp dụng của phương pháp hiện đại với quy ước lập lá số này.",
        "Danh sách ngoại lệ chưa được đặc tả đầy đủ; rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Ý nghĩa riêng của yếu tố; không suy thành tính cách, nghề nghiệp hoặc kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "context.wuqu-ji",
    version: "1.0.0",
    kind: "fact",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-transformations"],
    conditions: [
      {
        fact: "fact.life-transformations",
        op: "includes",
        value: "Vũ Khúc:Kỵ",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Lá số ghi Vũ Khúc Hóa Kỵ tại Mệnh. Chưa có quy tắc tổng hợp nhãn này với chú giải về tài.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "iztro-technical",
        title: "iztro 2.6.1 — dữ liệu đã lưu",
        url: "https://github.com/SylarLong/iztro/tree/v2.6.1",
        location: "Astrolabe palaces majorStars brightness/mutagen",
        accessedOn: "2026-10-07",
        rights: "cleared",
        rightsNote: "MIT; chép nhãn, không thêm ý nghĩa.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: ["Chỉ chép tứ hóa, không suy kết quả cuộc đời."],
    presentation: {
      title: "Dữ kiện bổ sung: tứ hóa",
      contentType: "context",
      applicability: "Đúng sao và tứ hóa tại cung được xét.",
      knownExceptions: [],
      unknownConditions: ["Chưa có quy tắc tổng hợp và ngoại lệ được duyệt."],
      sourceScope: "Nhãn engine, không giải thích ảnh hưởng.",
    },
  }),
  ruleSchema.parse({
    id: "context.ziwei-quan",
    version: "1.0.0",
    kind: "fact",
    topic: "career",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.career-transformations"],
    conditions: [
      {
        fact: "fact.career-transformations",
        op: "includes",
        value: "Tử Vi:Quyền",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Lá số ghi Tử Vi Hóa Quyền tại Quan Lộc. Chưa có quy tắc tổng hợp để luận chức vụ hoặc thăng tiến.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "iztro-technical",
        title: "iztro 2.6.1 — dữ liệu đã lưu",
        url: "https://github.com/SylarLong/iztro/tree/v2.6.1",
        location: "Astrolabe palaces majorStars brightness/mutagen",
        accessedOn: "2026-10-07",
        rights: "cleared",
        rightsNote: "MIT; chép nhãn, không thêm ý nghĩa.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: ["Chỉ chép tứ hóa, không suy kết quả cuộc đời."],
    presentation: {
      title: "Dữ kiện bổ sung: tứ hóa",
      contentType: "context",
      applicability: "Đúng sao và tứ hóa tại cung được xét.",
      knownExceptions: [],
      unknownConditions: ["Chưa có quy tắc tổng hợp và ngoại lệ được duyệt."],
      sourceScope: "Nhãn engine, không giải thích ảnh hưởng.",
    },
  }),
  ruleSchema.parse({
    id: "context.career-labels",
    version: "1.0.0",
    kind: "fact",
    topic: "career",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.career-branch", "fact.career-brightness"],
    conditions: [
      {
        fact: "fact.career-branch",
        op: "eq",
        value: "Thìn",
      },
      {
        fact: "fact.career-brightness",
        op: "includes",
        value: "Tử Vi:Đắc",
      },
      {
        fact: "fact.career-brightness",
        op: "includes",
        value: "Thiên Tướng:Đắc",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Hai sao Tử Vi và Thiên Tướng tại Thìn được dữ liệu hiện tại ghi Đắc; bản chép Toàn Thư quyển hai dùng nhãn nhàn cung. Chưa đủ điều kiện kết luận dựa trên việc đồng nhất hai hệ nhãn.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "iztro-technical",
        title: "iztro 2.6.1 — dữ liệu đã lưu",
        url: "https://github.com/SylarLong/iztro/tree/v2.6.1",
        location: "Astrolabe palaces majorStars brightness/mutagen",
        accessedOn: "2026-10-07",
        rights: "cleared",
        rightsNote: "MIT; chép nhãn, không thêm ý nghĩa.",
      },
      {
        id: "quanshu-vol2",
        title: "Toàn Thư — quyển hai, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷二",
        location: "定十二宮星辰落閒",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote: "Chưa đối chiếu bản in và quyền chuyển ngữ.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Giữ riêng hai hệ nhãn; không sửa engine, không suy tốt/xấu.",
    ],
    presentation: {
      title: "Khác hệ nhãn: Đắc và nhàn cung",
      contentType: "context",
      applicability:
        "Hai nhãn Đắc được ghi đúng cho Tử Vi và Thiên Tướng tại Quan Lộc ở Thìn.",
      knownExceptions: [],
      unknownConditions: ["Chưa xác minh hai hệ phân loại cùng nghĩa/phạm vi."],
      sourceScope: "Đối chiếu thuật ngữ, không phải nhận định tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.overview.ziwei",
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Tử Vi",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Tử Vi dùng hình tượng đế tọa, vị trí trung tâm trong hệ sao. Đây là chú giải biểu tượng của sao có tại Mệnh, chưa phải nhận định về năng lực lãnh đạo.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "諸星問答論 → 問紫微所主若何？; đoạn 答曰, 希夷先生曰 và 玉蟾先生曰; xét cả thân/mệnh và phụ tá",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Đã đọc ngữ cảnh bản chép; chưa đối chiếu bản in hoặc xác minh quyền chuyển ngữ. Không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Vai trò phụ tá, hội chiếu và khác hệ trạng thái chưa được đặc tả để tổng hợp.",
    ],
    presentation: {
      title: "Tử Vi tại Mệnh",
      contentType: "element-gloss",
      applicability:
        "Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Tử Vi. Chỉ hiển thị chú giải của yếu tố này.",
      knownExceptions: [],
      unknownConditions: [
        "Vai trò phụ tá, hội chiếu và khác hệ trạng thái chưa được đặc tả để tổng hợp.",
        "Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Chú giải yếu tố riêng: biểu tượng chung không được coi là nhận định riêng về người có sao ở Mệnh. Không kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.overview.tianji",
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Thiên Cơ",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Thiên Cơ được liên hệ với sự ứng biến và cách hành sự có tính toán. Khi đọc ở Mệnh, đây là một nét mô tả truyền thống, không phải phép đo trí thông minh.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "諸星問答論 → 問天機所主如何？; đoạn 答曰 và 希夷先生曰, gồm thân/mệnh, hội hợp và trạng thái",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Đã đọc ngữ cảnh bản chép; chưa đối chiếu bản in hoặc xác minh quyền chuyển ngữ. Không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chưa đặc tả các hội hợp với Thiên Lương, phụ tá và điều kiện loại trừ.",
    ],
    presentation: {
      title: "Thiên Cơ tại Mệnh",
      contentType: "element-gloss",
      applicability:
        "Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Thiên Cơ. Chỉ hiển thị chú giải của yếu tố này.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa đặc tả các hội hợp với Thiên Lương, phụ tá và điều kiện loại trừ.",
        "Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Chú giải yếu tố riêng: biểu tượng chung không được coi là nhận định riêng về người có sao ở Mệnh. Không kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.overview.taiyang",
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Thái Dương",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Thái Dương lấy hình tượng mặt trời. Chú giải này giới thiệu biểu tượng ánh sáng của sao đang có tại Mệnh; chưa áp dụng các lời luận về địa vị trong nguồn.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "諸星問答論 → 問太陽所主若何？; toàn mục; hình tượng 日之精 và các đoạn thân/mệnh, phân biệt đoạn cung khác",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Đã đọc ngữ cảnh bản chép; chưa đối chiếu bản in hoặc xác minh quyền chuyển ngữ. Không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chưa có đặc tả đầy đủ trạng thái, sao hỗ trợ và điều kiện riêng theo vị trí; không chuyển nghĩa tại Quan Lộc sang Mệnh.",
    ],
    presentation: {
      title: "Thái Dương tại Mệnh",
      contentType: "element-gloss",
      applicability:
        "Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Thái Dương. Chỉ hiển thị chú giải của yếu tố này.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa có đặc tả đầy đủ trạng thái, sao hỗ trợ và điều kiện riêng theo vị trí; không chuyển nghĩa tại Quan Lộc sang Mệnh.",
        "Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Chú giải yếu tố riêng: biểu tượng chung không được coi là nhận định riêng về người có sao ở Mệnh. Không kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.overview.taiyin",
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Thái Âm",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Thái Âm dùng hình tượng mặt trăng, được đặt trong quan hệ với Thái Dương. Đây là lớp biểu tượng; không dùng tên sao để kết luận về tài sản hay gia đình.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "諸星問答論 → 問太陰星所主若何？; toàn mục 答曰 và 希夷先生曰; xem cả thượng/hạ huyền và thân/mệnh",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Đã đọc ngữ cảnh bản chép; chưa đối chiếu bản in hoặc xác minh quyền chuyển ngữ. Không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chưa xác minh cách áp dụng thượng/hạ huyền, trạng thái và phối hợp với các sao khác; không lấy vai trò tại Điền Trạch làm kết luận cho Mệnh.",
    ],
    presentation: {
      title: "Thái Âm tại Mệnh",
      contentType: "element-gloss",
      applicability:
        "Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Thái Âm. Chỉ hiển thị chú giải của yếu tố này.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa xác minh cách áp dụng thượng/hạ huyền, trạng thái và phối hợp với các sao khác; không lấy vai trò tại Điền Trạch làm kết luận cho Mệnh.",
        "Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Chú giải yếu tố riêng: biểu tượng chung không được coi là nhận định riêng về người có sao ở Mệnh. Không kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.overview.tianxiang",
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Thiên Tướng",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Thiên Tướng gắn với hình tượng ấn và vai trò phụ tá. Chú giải biểu tượng này không chuyển lời luận ở Quan Lộc thành dự báo chức vụ khi sao nằm tại Mệnh.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "諸星問答論 → 問天相星所主若何？; đoạn mở đầu 化氣曰印, 佐帝之位, cùng đoạn thân/mệnh và điều kiện cuối mục",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Đã đọc ngữ cảnh bản chép; chưa đối chiếu bản in hoặc xác minh quyền chuyển ngữ. Không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chưa có đặc tả điều kiện phụ tá, hội hợp, trạng thái và ngoại lệ; không tự ghép nghĩa với Tử Vi.",
    ],
    presentation: {
      title: "Thiên Tướng tại Mệnh",
      contentType: "element-gloss",
      applicability:
        "Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Thiên Tướng. Chỉ hiển thị chú giải của yếu tố này.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa có đặc tả điều kiện phụ tá, hội hợp, trạng thái và ngoại lệ; không tự ghép nghĩa với Tử Vi.",
        "Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Chú giải yếu tố riêng: biểu tượng chung không được coi là nhận định riêng về người có sao ở Mệnh. Không kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.overview.tianliang",
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-stars"],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Thiên Lương",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Thiên Lương mang biểu tượng che chở, thường gọi là hóa ấm. Đây là cách gọi trong hệ thống truyền thống, không phải bảo đảm tránh rủi ro hoặc kéo dài tuổi thọ.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-vol1",
        title: "Tử Vi Đẩu Số Toàn Thư — quyển một, bản chép Wikisource",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "諸星問答論 → 問天梁星所主若何？; đoạn 答曰, 希夷先生又曰 và bài ca; chỉ lấy thuật ngữ hóa ấm",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Đã đọc ngữ cảnh bản chép; chưa đối chiếu bản in hoặc xác minh quyền chuyển ngữ. Không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chưa có đặc tả hội chiếu, trạng thái và ngoại lệ; loại các phán đoán tuổi thọ, bệnh tật trong nguồn khỏi phạm vi diễn giải.",
    ],
    presentation: {
      title: "Thiên Lương tại Mệnh",
      contentType: "element-gloss",
      applicability:
        "Mệnh duy nhất, có mảng chính tinh hợp lệ chứa đúng Thiên Lương. Chỉ hiển thị chú giải của yếu tố này.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa có đặc tả hội chiếu, trạng thái và ngoại lệ; loại các phán đoán tuổi thọ, bệnh tật trong nguồn khỏi phạm vi diễn giải.",
        "Ngoại lệ chưa hoàn chỉnh; mảng exceptions rỗng không có nghĩa không có ngoại lệ.",
      ],
      sourceScope:
        "Chú giải yếu tố riêng: biểu tượng chung không được coi là nhận định riêng về người có sao ở Mệnh. Không kết luận tổ hợp.",
    },
  }),
  ruleSchema.parse({
    id: "reading.overview.empty",
    version: "1.0.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: ["fact.life-major-presence"],
    conditions: [
      {
        fact: "fact.life-major-presence",
        op: "eq",
        value: "empty",
      },
    ],
    exceptions: [],
    claimTemplate:
      "Mệnh không có chính tinh trong danh sách đã tính. Cách gọi cung trống chính tinh chỉ nói về nhóm chính tinh, không có nghĩa cung không còn sao nào. Bản đọc này chưa mượn sao đối cung và chưa xếp trường hợp này tốt hay xấu.",
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "iztro-star-groups",
        title: "Tài liệu tác giả iztro — hệ thống sao",
        url: "https://docs.iztro.com/learn/star",
        location: "十四主星 và 十四辅星; đoạn phụ tinh trong 空宫",
        accessedOn: "2026-10-07",
        rights: "pending",
        rightsNote:
          "Nguồn hiện đại chỉ dùng cho thuật ngữ/phân nhóm, không nhập cách luận phụ tinh; quyền nội dung website/chuyển ngữ chưa xác minh.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chỉ giải thích cấu trúc danh sách; chưa có quy tắc mượn sao đối cung hoặc luận ảnh hưởng của phụ tinh được duyệt.",
    ],
    presentation: {
      title: "Mệnh không có chính tinh",
      contentType: "method-gloss",
      applicability:
        "Mệnh duy nhất; trường majorStars tồn tại, là mảng hợp lệ có độ dài 0.",
      knownExceptions: [],
      unknownConditions: [
        "Chưa có đặc tả mượn sao, phụ tinh và hội chiếu; dữ liệu bị thiếu không đáp ứng điều kiện này.",
      ],
      sourceScope:
        "Phân biệt nhóm chính tinh với phụ tinh, không phải dự đoán vô chính diệu.",
    },
  }),
  ruleSchema.parse({
    version: "1.1.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: [
      "fact.life-stars",
      "fact.life-minor-stars",
      "fact.life-local-sat",
      "fact.life-local-sat-stars",
    ],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Tử Vi",
      },
      {
        fact: "fact.life-minor-stars",
        op: "includes",
        value: "Tả Phù",
      },
      {
        fact: "fact.life-minor-stars",
        op: "includes",
        value: "Hữu Bật",
      },
    ],
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-ziwei-assistants",
        title: "Toàn Thư quyển một — phối hợp Tử Vi và phụ bật",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "重補斗數彀率: Tử Vi tại Mệnh, phụ bật đồng viên; 諸星問答論 / 問紫微所主若何？: 答曰, 希夷先生曰, 玉蟾先生曰; đọc cùng 問破軍所主若何？ / 答曰, đoạn quan hệ với Tử Vi",
        accessedOn: "2026-10-08",
        rights: "pending",
        rightsNote:
          "Bản chép chưa đối chiếu ấn bản, chưa kiểm quyền chuyển ngữ; không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chỉ xét cùng cung Mệnh; chưa đặc tả hội chiếu/giáp cung, tứ hóa hoặc hệ nhãn trạng thái. Không chứng minh đã đủ điều kiện luận toàn lá số.",
      "Phân nhánh khi ghi một trong bốn sao đồng cung là cổng biên tập, không phải định luật giảm tốt/xấu. Cả hai nhánh chỉ mô tả quan hệ, không đánh giá thuận.",
    ],
    presentation: {
      title: "Tử Vi cùng Tả Phụ (Tả Phù) và Hữu Bật tại Mệnh",
      contentType: "combination",
      moveToDetails: ["reading.overview.ziwei"],
      applicability:
        "Đủ Tử Vi, Tả Phụ và Hữu Bật cùng tại Mệnh; danh sách chính/phụ tinh phải đầy đủ và hợp lệ.",
      knownExceptions: [
        "Có Kình Dương/Đà La/Hỏa Tinh/Linh Tinh đồng cung thì dùng nhánh nêu rõ tên yếu tố cần xét; có Phá Quân thì cả hai nhánh bị chặn.",
      ],
      unknownConditions: [
        "Chưa xác minh thuật ngữ/ấn bản, mọi ngoại lệ và phạm vi hội chiếu; không coi không ghi sát tinh đồng cung là không có yếu tố khác chiều.",
        "Phá Quân tại Mệnh chặn cả hai bản đọc phối hợp. Đây là cổng biên tập trong lúc chưa đặc tả quan hệ riêng, không phải đánh giá xấu.",
      ],
      sourceScope:
        "Chỉ dùng quan hệ phối hợp được nguồn nói trực tiếp; không cộng ý nghĩa sao, không dự báo chức vụ, tài sản hoặc năng lực.",
    },
    id: "combination.ziwei-assistants",
    exceptions: [
      { fact: "fact.life-stars", op: "includes", value: "Phá Quân" },
      {
        fact: "fact.life-local-sat",
        op: "eq",
        value: "recorded",
      },
    ],
    claimTemplate:
      "Tử Vi cùng Tả Phụ và Hữu Bật tại Mệnh tạo quan hệ chủ tinh–phụ tá được cổ thư mô tả trực tiếp. Bản đọc giữ hình tượng có sự phụ trợ trong hệ sao; chưa chuyển hình tượng ấy thành đánh giá thuận lợi hoặc khẳng định bạn được người khác giúp đỡ.",
  }),
  ruleSchema.parse({
    version: "1.1.0",
    kind: "interpretation",
    topic: "overview",
    origin: "catalog",
    requiredEngineProfile: ["vn-utc7-midnight-v1", "cn-reference"],
    requiredFacts: [
      "fact.life-stars",
      "fact.life-minor-stars",
      "fact.life-local-sat",
      "fact.life-local-sat-stars",
    ],
    conditions: [
      {
        fact: "fact.life-stars",
        op: "includes",
        value: "Tử Vi",
      },
      {
        fact: "fact.life-minor-stars",
        op: "includes",
        value: "Tả Phù",
      },
      {
        fact: "fact.life-minor-stars",
        op: "includes",
        value: "Hữu Bật",
      },
      {
        fact: "fact.life-local-sat",
        op: "eq",
        value: "recorded",
      },
    ],
    evidencePaths: ["chart.palaces"],
    sourceReferences: [
      {
        id: "quanshu-ziwei-assistants",
        title: "Toàn Thư quyển một — phối hợp Tử Vi và phụ bật",
        url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
        location:
          "重補斗數彀率: Tử Vi tại Mệnh, phụ bật đồng viên; 諸星問答論 / 問紫微所主若何？: 答曰, 希夷先生曰, 玉蟾先生曰; đọc cùng 問破軍所主若何？ / 答曰, đoạn quan hệ với Tử Vi",
        accessedOn: "2026-10-08",
        rights: "pending",
        rightsNote:
          "Bản chép chưa đối chiếu ấn bản, chưa kiểm quyền chuyển ngữ; không có chuyên gia duyệt.",
      },
    ],
    conflictsWith: [],
    conflictGroup: null,
    conflictPolicy: "retain-both",
    status: "draft",
    review: null,
    limitations: [
      "Chỉ xét cùng cung Mệnh; chưa đặc tả hội chiếu/giáp cung, tứ hóa hoặc hệ nhãn trạng thái. Không chứng minh đã đủ điều kiện luận toàn lá số.",
      "Phân nhánh khi ghi một trong bốn sao đồng cung là cổng biên tập, không phải định luật giảm tốt/xấu. Cả hai nhánh chỉ mô tả quan hệ, không đánh giá thuận.",
    ],
    presentation: {
      title: "Tử Vi cùng Tả Phụ (Tả Phù) và Hữu Bật tại Mệnh",
      contentType: "combination",
      moveToDetails: ["reading.overview.ziwei"],
      applicability:
        "Đủ Tử Vi, Tả Phụ và Hữu Bật cùng tại Mệnh; danh sách chính/phụ tinh phải đầy đủ và hợp lệ.",
      knownExceptions: [
        "Có Kình Dương/Đà La/Hỏa Tinh/Linh Tinh đồng cung thì dùng nhánh nêu rõ tên yếu tố cần xét; có Phá Quân thì cả hai nhánh bị chặn.",
      ],
      unknownConditions: [
        "Chưa xác minh thuật ngữ/ấn bản, mọi ngoại lệ và phạm vi hội chiếu; không coi không ghi sát tinh đồng cung là không có yếu tố khác chiều.",
        "Phá Quân tại Mệnh chặn cả hai bản đọc phối hợp. Đây là cổng biên tập trong lúc chưa đặc tả quan hệ riêng, không phải đánh giá xấu.",
      ],
      sourceScope:
        "Chỉ dùng quan hệ phối hợp được nguồn nói trực tiếp; không cộng ý nghĩa sao, không dự báo chức vụ, tài sản hoặc năng lực.",
    },
    id: "combination.ziwei-assistants-qualified",
    exceptions: [
      { fact: "fact.life-stars", op: "includes", value: "Phá Quân" },
    ],
    claimTemplate:
      "Tử Vi, Tả Phụ và Hữu Bật cùng có mặt tại Mệnh, đồng thời ghi nhận {{fact.life-local-sat-stars}}. Nguồn dùng hình tượng chủ tinh–phụ tá, đồng thời yêu cầu xét các yếu tố khác. Bản đọc chỉ đặt hai nhóm dữ kiện cạnh nhau, chưa xác định mức điều chỉnh hoặc đánh giá thuận/nghịch.",
  }),
  ...[
    {
      slug: "pojun",
      star: "Phá Quân",
      section: "問破軍所主若何？ / 答曰",
      text: "Phá Quân được cổ thư gọi là sao có hóa khí ‘hao’ (hao tổn) — một tên phân loại trong hệ thống truyền thống. Vì sao này hiện ở Mệnh, bản đọc giải thích thuật ngữ ấy tại đây; chưa suy thành hao tài, xu hướng thay đổi hay tính cách của bạn.",
      scope:
        "Nghĩa chung của tên phân loại; đọc toàn đoạn có quan hệ với Tử Vi và các điều kiện vị trí. Không phải kết luận riêng cho Phá Quân thủ Mệnh.",
      unknown:
        "Chưa đặc tả Tử Vi–Phá Quân, điều kiện can sinh, vị trí và sao hội. Không suy nghĩa đổi mới/sáng tạo từ tên sao.",
    },
    {
      slug: "qisha",
      star: "Thất Sát",
      section: "問七殺星所主若何？ / 答曰; 希夷先生曰; 歌曰",
      text: "Thất Sát được mô tả bằng hình tượng vị tướng trong hệ sao. Đây là cách gọi vai trò của sao trong cổ thư, không phải chỉ định nghề nghiệp hoặc xác nhận sự quyết đoán, năng lực chỉ huy của người có sao này tại Mệnh.",
      scope:
        "Chỉ hình tượng chung ở đầu mục. Không chuyển phần Quan Lộc sang Mệnh, không sử dụng các dự báo sức khỏe hoặc tai họa trong văn bản.",
      unknown:
        "Các điều kiện tại Mệnh về cung độ, phụ tá, vận và xung chiếu chưa được đặc tả; không chuyển thành kết luận về người đọc.",
    },
  ].map((entry) =>
    ruleSchema.parse({
      ...base,
      id: `reading.overview.${entry.slug}`,
      kind: "interpretation",
      topic: "overview",
      requiredFacts: ["fact.life-stars"],
      conditions: [
        { fact: "fact.life-stars", op: "includes", value: entry.star },
      ],
      claimTemplate: entry.text,
      evidencePaths: ["chart.palaces"],
      sourceReferences: [
        {
          id: `quanshu-${entry.slug}`,
          title: "Toàn Thư quyển một — bản chép Wikisource",
          url: "https://zh.wikisource.org/zh-hant/紫微斗數全書/卷一",
          location: `諸星問答論 / ${entry.section}; đọc toàn mục, chỉ dùng hình tượng/phân loại phần mở đầu`,
          accessedOn: "2026-10-08",
          rights: "pending",
          rightsNote:
            "Chưa đối chiếu bản in hoặc kiểm quyền chuyển ngữ. Diễn giải ngắn do dự án biên soạn, không có chuyên gia duyệt.",
        },
      ],
      limitations: [entry.scope, entry.unknown],
      presentation: {
        title: `${entry.star}: thuật ngữ trong cổ thư`,
        contentType: "method-gloss",
        applicability: `${entry.star} được ghi tại cung Mệnh duy nhất, danh sách chính tinh hợp lệ. Chỉ chọn vị trí trình bày thuật ngữ, không khẳng định nghĩa riêng tại Mệnh.`,
        knownExceptions: [],
        unknownConditions: [
          entry.unknown,
          "Chưa biết hết ngoại lệ luận mệnh; mảng ngoại lệ rỗng chỉ áp dụng cho chú giải thuật ngữ.",
        ],
        sourceScope: entry.scope,
      },
    }),
  ),
  ...refineLifeRules(tanBienRules),
  ...lifeContentRules, ...lifeExpansionRules,
  emptyLifeRule,
  ...emptyLifeTrineRules,
  careerQuyenRule,
  ...careerKyRules,
  ...activeIndependentCareerRules,
  ...occupationalCareerRules,
  ...careerClosingRules,
  ...phucDiRules,
  ...lifeLiteraryRules,...nplLocalRules,...nplFoundationRules,...nplTwoRules, ...nplBodyRules, ...lifeBodyRules, retentionRule, ...voidRules, ...kinRules, ...childrenVcdRules.slice(0,2), ...familyRules, ...noDienRules, ...completionRules, ...childrenVcdRules.slice(2,6), ...kinExtensionRules.slice(0,9), ...familyExtensionRules, ...familyVcdRules, ...kinExtensionRules.slice(9), ...childrenVcdRules.slice(6), ...approvedKinRules, ...localPalaceRules, ...quanTaiRules, ...vcdLightRules,...financeVcdRules,...financeVcdScaleRules,...careerVcdScaleRules, ...diVoidRules, ...parentUnadjustedRules, ...phucUnadjustedRules,
  ...trungchauRules, vttlDienPhuRule, vttlCareerCoAmRule, ...nplDienSingleRules, vttlNoLuongRule,
];
