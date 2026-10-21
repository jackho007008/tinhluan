import frozenCoCu from "./engine-samples/tanbien-co-cu.json" with { type: "json" };
import frozenLast from "./engine-samples/tanbien-last.json" with { type: "json" };
// Internal-only, deterministic software samples. Never persisted as orders or reports.
import frozenFour from "./engine-samples/tanbien-four.json" with { type: "json" };
import frozenThree from "./engine-samples/tanbien-three.json" with { type: "json" };
import type { ChartSnapshot } from "../tuvi-engine";
import { calculate } from "../tuvi-engine";
import type { BirthInput } from "../calendar";
import { buildReport, type ReportData } from "../reports";
export const SAMPLE_VERSION = "content-matrix-1.5.0";
const base: BirthInput = {
  date: "2000-08-16",
  hour: 4,
  minute: 0,
  unknownTime: false,
  place: "Hà Nội",
  gender: "female",
  calendar: "solar",
  profile: "vn-utc7-midnight-v1",
  timezone: "Asia/Ho_Chi_Minh",
  consent: true,
};
export const supportedStars = [
  ["wuqu", "Vũ Khúc", "reading.wuqu"],
  ["tianfu", "Thiên Phủ", "reading.tianfu"],
  ["tong", "Thiên Đồng", "draft.overview.tong"],
  ["ziwei", "Tử Vi", "reading.overview.ziwei"],
  ["tianji", "Thiên Cơ", "reading.overview.tianji"],
  ["taiyang", "Thái Dương", "reading.overview.taiyang"],
  ["taiyin", "Thái Âm", "reading.overview.taiyin"],
  ["tianxiang", "Thiên Tướng", "reading.overview.tianxiang"],
  ["pojun", "Phá Quân", "reading.overview.pojun"],
  ["qisha", "Thất Sát", "reading.overview.qisha"],
  ["tianliang", "Thiên Lương", "reading.overview.tianliang"],
] as const;
type Expected = {
  rule: string;
  outcome: "claim" | "condition-false" | "missing-facts" | "exception";
  why: string;
};
export type Sample = {
  id: string;
  name: string;
  kind: "engine" | "synthetic";
  input: BirthInput;
  expected: Expected[];
  star?: string;
  variant?: string;
};
const e = (
  rule: string,
  outcome: Expected["outcome"],
  why: string,
): Expected => ({ rule, outcome, why });
const plain = "combination.ziwei-assistants",
  qualified = plain + "-qualified";
export const samples: Sample[] = [
  ...[
    ...frozenThree.entries,
    ...frozenFour.entries,
    ...frozenLast.entries,
    ...frozenCoCu.entries,
  ].map(
    (entry): Sample => ({
      id: entry.id,
      name: entry.name,
      kind: "engine",
      input: entry.input as BirthInput,
      expected: [
        e(
          (
            {
              "vn-lianzhen": "tanbien.r10",
              "vn-tanlang": "tanbien.r11",
              "vn-jumen": "tanbien.r12",
              "vn-taiyang": "tanbien.r14",
              "vn-tiantong": "tanbien.r15",
              "vn-tianliang": "tanbien.r17",
              "vn-qisha": "tanbien.r18",
              "vn-pojun": "tanbien.r19",
              "vn-co-cu-loc": "tanbien.r20",
            } as Record<string, string>
          )[entry.id],
          "claim",
          entry.id === "vn-co-cu-loc"
            ? "Cơ và Cự là chính tinh Mệnh Mão/Dậu; Lộc Tồn ở phụ tinh cùng cung. Không yêu cầu trạng thái/can sinh. Mẫu engine giả lập."
            : "Chính tinh tại Mệnh và trạng thái theo bảng nguồn nằm trong phạm vi rule; mẫu engine giả lập, không xác nhận chuyên môn.",
        ),
      ],
    }),
  ),
  ...(["Quyền", "", null] as const).map(
    (mutagen, i): Sample => ({
      id: `syn-career-quan-${i}`,
      name: `Kỹ thuật · Tử Vi Quan Lộc: ${mutagen === null ? "thiếu tứ hóa" : mutagen || "không ghi tứ hóa"}`,
      kind: "synthetic",
      input: base,
      variant: `career-quan-${i}`,
      expected: [
        e(
          "context.ziwei-quan",
          i === 0 ? "claim" : i === 1 ? "condition-false" : "missing-facts",
          "Chỉ nhãn Tử Vi:Quyền tại Quan Lộc đáp ứng; thiếu nhãn khác chuỗi rỗng.",
        ),
      ],
    }),
  ),
  ...supportedStars.flatMap(([slug, star, rule]): Sample[] => [
    {
      id: `syn-${slug}`,
      name: `Kỹ thuật · ${star} tại Mệnh`,
      kind: "synthetic",
      input: base,
      star,
      expected: [e(rule, "claim", "Chính tinh được chỉ định có tại Mệnh.")],
    },
    {
      id: `other-${slug}`,
      name: `Kỹ thuật · ${star} ở Tài Bạch`,
      kind: "synthetic",
      input: base,
      star,
      variant: "other",
      expected: [
        e(
          rule,
          "condition-false",
          "Cùng sao ở cung khác không đáp ứng điều kiện Mệnh.",
        ),
      ],
    },
  ]),
  ...[
    "empty",
    "missing-major",
    "body-career",
    "body-other",
    "wuqu-ji",
    "wuqu-none",
    "missing-mutagen",
    "combo",
    "combo-partial",
    "combo-exception",
    "missing-minor",
  ].map((variant): Sample => {
    const expected: Record<string, Expected[]> = {
      empty: [
        e(
          "reading.overview.empty",
          "claim",
          "Danh sách chính tinh rỗng hợp lệ.",
        ),
      ],
      "missing-major": [
        e(
          "reading.overview.empty",
          "missing-facts",
          "Thiếu trường không đồng nghĩa mảng rỗng.",
        ),
        e("reading.wuqu", "missing-facts", "Không có danh sách sao để xét."),
      ],
      "body-career": [
        e("reading.body-career", "claim", "Duy nhất Quan Lộc có cờ an Thân."),
      ],
      "body-other": [
        e(
          "reading.body-career",
          "condition-false",
          "Thân tại Mệnh, không tại Quan Lộc.",
        ),
      ],
      "wuqu-ji": [
        e("reading.wuqu", "claim", "Vũ Khúc ở Mệnh."),
        e("context.wuqu-ji", "claim", "Nhãn Vũ Khúc:Kỵ được ghi rõ."),
      ],
      "wuqu-none": [
        e(
          "context.wuqu-ji",
          "condition-false",
          "Nhãn tứ hóa là chuỗi rỗng, không phải Kỵ.",
        ),
      ],
      "missing-mutagen": [
        e(
          "context.wuqu-ji",
          "missing-facts",
          "Thiếu nhãn tứ hóa, không được suy thành không có.",
        ),
      ],
      combo: [
        e(plain, "claim", "Đủ ba sao cùng Mệnh và danh sách phụ tinh hợp lệ."),
        e(
          "reading.overview.ziwei",
          "claim",
          "Chú giải đơn vẫn giữ trong phần mở rộng.",
        ),
        e(qualified, "condition-false", "Không ghi bốn sát tinh tại Mệnh."),
      ],
      "combo-partial": [e(plain, "condition-false", "Thiếu Hữu Bật tại Mệnh.")],
      "combo-exception": [
        e(plain, "exception", "Đà La kích hoạt cổng biên tập đã đặc tả."),
        e(qualified, "claim", "Giữ phối hợp cùng yếu tố điều chỉnh."),
      ],
      "missing-minor": [
        e(plain, "missing-facts", "Không có danh sách phụ tinh để đánh giá."),
      ],
    };
    return {
      id: `syn-${variant}`,
      name: `Kỹ thuật · ${{ empty: "Mệnh rỗng hợp lệ", "missing-major": "Thiếu danh sách chính tinh", "body-career": "Thân cư Quan Lộc", "body-other": "Thân cư Mệnh", "wuqu-ji": "Vũ Khúc có Hóa Kỵ", "wuqu-none": "Vũ Khúc không ghi tứ hóa", "missing-mutagen": "Thiếu nhãn tứ hóa", combo: "Đủ bộ ba phối hợp", "combo-partial": "Phối hợp thiếu Hữu Bật", "combo-exception": "Phối hợp có Đà La", "missing-minor": "Thiếu danh sách phụ tinh" }[variant]}`,
      kind: "synthetic",
      input: base,
      variant,
      expected: expected[variant],
    };
  }),
  ...(
    [
      [0, "Thiên Cơ và Thái Âm", "reading.overview.tianji"],
      [2, "Mệnh không chính tinh", "reading.overview.empty"],
      [4, "Tử Vi tại Mệnh", "reading.overview.ziwei"],
      [6, "Thiên Tướng", "reading.overview.tianxiang"],
      [12, "Tử Vi và Thiên Phủ", "reading.tianfu"],
      [16, "Thái Dương", "reading.overview.taiyang"],
      [20, "Vũ Khúc", "reading.wuqu"],
    ] as const
  ).map(
    ([hour, name, rule]): Sample => ({
      id: `vn-${hour}`,
      name: `Engine VN · ${name}`,
      kind: "engine",
      input: { ...base, hour },
      expected: [
        e(
          rule,
          "claim",
          "Đầu vào demo đã chọn tạo yếu tố tại Mệnh; assertion kiểm hợp đồng nội dung, không xác nhận an sao.",
        ),
      ],
    }),
  ),
  {
    id: "engine-combo",
    name: "Engine VN · Tử Vi–Phá Quân, đủ phụ tá",
    kind: "engine",
    input: { ...base, date: "2001-05-06", hour: 20 },
    expected: [
      e(plain, "exception", "Có Phá Quân: chặn tổng hợp chưa đủ đặc tả."),
      e(
        "reading.overview.pojun",
        "claim",
        "Chỉ giải thích thuật ngữ Phá Quân tại đúng Mệnh.",
      ),
      e(
        qualified,
        "condition-false",
        "Không ghi sát tinh tại Mệnh trong ca này.",
      ),
    ],
  },
  {
    id: "engine-exception",
    name: "Engine VN · Tử Vi–Phá Quân, phụ tá và Đà La",
    kind: "engine",
    input: { ...base, date: "2000-05-13", hour: 20 },
    expected: [
      e(plain, "exception", "Đà La đồng cung chặn bản đọc riêng."),
      e(
        qualified,
        "exception",
        "Có Phá Quân: Đà La không làm đủ điều kiện tổng hợp.",
      ),
    ],
  },
  {
    id: "engine-partial",
    name: "Engine VN · Tử Vi thiếu phụ tá",
    kind: "engine",
    input: { ...base, date: "2000-05-05", hour: 2 },
    expected: [e(plain, "condition-false", "Tử Vi đơn không đủ bộ ba.")],
  },
  {
    id: "cn-reference",
    name: "Engine CN · quy ước tham chiếu riêng",
    kind: "engine",
    input: { ...base, profile: "cn-reference" },
    expected: [
      e(
        "reading.overview.ziwei",
        "claim",
        "Ca CN được chọn có Tử Vi tại Mệnh; chỉ kiểm tích hợp nội dung theo profile CN, không dùng làm expected cho VN.",
      ),
    ],
  },
];
export async function loadSample(id: string) {
  const sample = samples.find((s) => s.id === id);
  if (!sample) return null; // allow-list only; never fall back to customer data
  const frozen = [
    ...frozenThree.entries,
    ...frozenFour.entries,
    ...frozenLast.entries,
    ...frozenCoCu.entries,
  ].find((e) => e.id === id);
  const snapshot = frozen
    ? (structuredClone(frozen.snapshot) as unknown as ChartSnapshot)
    : await calculate(sample.input);
  const report: ReportData = await buildReport(snapshot, {
    groups: ["Tổng quan", "Sự nghiệp & tài lộc"],
    year: null,
  });
  if (sample.kind === "synthetic") {
    // Placements are intentionally artificial; retain no engine result identity for edited data.
    for (const p of snapshot.chart.palaces) {
      p.majorStars = [];
      p.minorStars = [];
      p.isBodyPalace = p.name === "Mệnh";
    }
    const m = snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
    const target = snapshot.chart.palaces.find(
      (p) => p.name === (sample.variant === "other" ? "Tài Bạch" : "Mệnh"),
    )!;
    if (sample.star)
      target.majorStars = [
        { name: sample.star, brightness: "Đắc", mutagen: "" },
      ];
    const v = sample.variant || "";
    if (v.startsWith("career-quan-")) {
      const c = snapshot.chart.palaces.find((p) => p.name === "Quan Lộc")!;
      c.majorStars = [
        {
          name: "Tử Vi",
          brightness: "Đắc",
          ...(v.endsWith("2")
            ? {}
            : { mutagen: v.endsWith("0") ? "Quyền" : "" }),
        },
      ];
    }
    if (v.startsWith("wuqu") || v === "missing-mutagen")
      m.majorStars = [
        {
          name: "Vũ Khúc",
          brightness: "Đắc",
          mutagen: v === "wuqu-ji" ? "Kỵ" : "",
        },
      ];
    if (v === "missing-mutagen") delete m.majorStars[0].mutagen;
    if (v.startsWith("combo") || v === "missing-minor") {
      m.majorStars = [{ name: "Tử Vi", brightness: "Đắc", mutagen: "" }];
      m.minorStars = [
        { name: "Tả Phù" },
        ...(v === "combo-partial" ? [] : [{ name: "Hữu Bật" }]),
        ...(v === "combo-exception" ? [{ name: "Đà La" }] : []),
      ];
    }
    if (v === "body-career")
      snapshot.chart.palaces.forEach(
        (p) => (p.isBodyPalace = p.name === "Quan Lộc"),
      );
    if (v === "missing-major") Reflect.deleteProperty(m, "majorStars");
    if (v === "missing-minor") Reflect.deleteProperty(m, "minorStars");
    snapshot.resultId = `synthetic:${SAMPLE_VERSION}:${sample.id}`;
    snapshot.warnings = [
      "Fixture kỹ thuật tổng hợp; không phải lá số hợp lệ hoặc kết quả nguyên bản của engine.",
    ];
    report.interpretation = undefined;
    report.statements = [];
    report.paragraphs = [];
  }
  return { sample, report };
}
