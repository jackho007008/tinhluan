import type { MenhInput } from "./contract";
import type { PaidReadingV2 } from "./paid-reading-v2";
import { paidContextFocusRank, type ContextMetadata } from "./paid-context";
type Link = NonNullable<MenhInput["contextGuide"]>["links"][number];
const namesPalace = (text: string, palace: string) =>
  text
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .includes(palace.normalize("NFC").toLocaleLowerCase("vi"));
/** Topic framing, not a new astrological proposition or an instruction in a source.
 * IDs point to existing, condition-matched C and target A/B. No duplicated prose. */
const FRAMES: Record<string, { palace: string; focus: string }[]> = {
  "Phu Thê": [
    {
      palace: "Quan Lộc",
      focus:
        "Từ nguồn thực có, phân biệt sắp xếp cách làm ở Quan Lộc với thống nhất điều muốn làm trong quan hệ Phu Thê. Nếu có nguồn biểu đạt ở Quan, phân tích vì sao trình bày để người khác hiểu khác với hai bên đồng ý; không suy nghề nghiệp gây bất hòa hoặc chuyển năng lực sang người phối ngẫu. Giữ lượng từ, sắc thái trợ giúp từng qua một giai đoạn và trình tự rồi mới nếu nguồn Phu có nêu. Một đoạn diễn ý nguồn đúng cung gốc, đoạn khác tổng hợp mối liên hệ; không lặp quyền–trách nhiệm hoặc dùng Khoa/Quyền hóa giải sát tinh. Nếu có phương pháp kiểm Phá–Đà–Hỏa, dùng nó loại nhánh Tả không gặp sát khi điều kiện không đúng; không suy ngược thành bất hòa. Chỉ nêu giới hạn ấy một lần ở chỗ ảnh hưởng lập luận, không biến thành chương giới hạn riêng.",
    },
  ],
  "Điền Trạch": [
    {
      palace: "Tử Nữ",
      focus:
        "Đặt quá trình tạo lập/duy trì nhà đất cạnh lời về quan hệ với con tại Tử. Phân biệt điều kiện nơi ở với cách đối đãi trong gia đình; không suy nhà khó tạo gây bất hòa hoặc lời hòa hợp bảo đảm tài sản. Giữ điều kiện Lộc tại Nô nếu nguồn Tử dựa vào đó, không chuyển sao.",
    },
  ],
  "Phụ Mẫu": [
    {
      palace: "Tử Nữ",
      focus:
        "Phân biệt gia đình xuất thân của mệnh tạo với quan hệ của mệnh tạo với con. Giữ riêng điều kiện vật chất, bất hòa trong lời Phụ và nét đối đãi trong lời Tử; không dự báo thế hệ sau lặp lại hoặc hóa giải thế hệ trước.",
    },
  ],
  "Huynh Đệ": [
    {
      palace: "Nô Bộc",
      focus:
        "Đọc sự gắn bó giữa anh chị em cạnh kỳ vọng giao du ở Nô; hai loại quan hệ khác nhau, không dùng bạn bè thay tình thân hoặc lời thuận ở Nô xóa lời xa cách tại Huynh.",
    },
  ],
  "Thiên Di": [
    {
      palace: "Phúc Đức",
      focus:
        "Đặt trải nghiệm bên ngoài được lời Di mô tả cạnh lời về nơi sinh sống/họ hàng ở Phúc, nếu nguồn có. Giữ cả mặt thuận và may rủi, không biến ở xa thành chỉ định di cư hoặc bảo đảm vị thế.",
    },
  ],
  "Nô Bộc": [
    {
      palace: "Huynh Đệ",
      focus:
        "Dùng lời đối đãi/giao du thực có tại Nô và lời về anh chị em tại Huynh Đệ để phân biệt độ rộng qua lại với độ sâu chia sẻ. Ở Nô, giữ riêng thiện chí, kỳ vọng đáp lại, biểu hiện hợp tác và kết quả thu lợi nếu nguồn có phân biệt; không lấy cảm tình thay điều kiện phi hóa. Nếu có nền Thiên Lương đã chọn, nối nét mềm mỏng/khoan hòa với kỳ vọng đáp lại của luận điểm trực tiếp: cách đối đãi và điều mong nhận lại là hai mặt cần giải thích cùng nhau. Phần nối là tổng hợp, không công thức Lương–Lộc, không xác nhận phẩm chất bạn bè hoặc dùng Lộc giải Lương hãm. Giải thích mối liên hệ thay vì chỉ nói hai cung khác nhau; không suy phản bội, trợ vốn hoặc lấy bạn bè thay tình thân.",
    },
  ],
  "Tử Nữ": [
    {
      palace: "Phụ Mẫu",
      focus:
        "Giải thích hai vai của người đọc: là con khi đọc Phụ Mẫu, là một bên trong quan hệ với con khi đọc Tử Nữ. Nếu lời Tử chỉ có một nét đối đãi, phân tích đúng chủ thể quan hệ, không biến thành phẩm chất cố định của con hoặc thêm chủ đề sinh sản/số con. Đặt điều kiện vật chất, hòa thuận, khoảng cách của lời Phụ vào đúng quan hệ; không suy truyền đời hoặc phép hóa giải. Giữ nguyên điều kiện ở cung khác của lời Tử, không chuyển sao hoặc mượn chính tinh để lấp cung trống.",
    },
  ],
  "Quan Lộc": [
    {
      palace: "Tài Bạch",
      focus:
        "Dùng đúng tiền đề của Quan Lộc và Tài Bạch để nối cách tổ chức/biểu đạt với tiến trình tạo và giữ nguồn thu. Giải thích mỗi phía góp ý gì; không chỉ lặp rằng hai mặt khác nhau hoặc quay lại quyền–trách nhiệm ở mọi phần. Tốc độ tích lũy ở Tài không tự đánh giá năng lực công việc, lời thuận ở Quan không bảo đảm thu nhập. Giữ nguyên nguồn, điều kiện và giới hạn phối hợp hao tinh.",
    },
    {
      palace: "Mệnh",
      focus:
        "Ưu tiên lời suy xét/hành động thực có tại Mệnh khi đối chiếu tổ chức ở Quan Lộc: một phía hình thành cách giải quyết, một phía thực hiện và truyền đạt. Nói rõ tiền đề nào thuộc Mệnh, tiền đề nào thuộc Quan, phần nối là tổng hợp. Không lấy lời tài lộc chung ở Mệnh thay phân tích công việc, không mở bài Mệnh thứ hai hoặc nhận đây là quan hệ nhân quả.",
    },
  ],
  "Tài Bạch": [
    {
      palace: "Quan Lộc",
      focus:
        "Đọc cách tổ chức/biểu đạt thực có ở Quan Lộc cạnh các mặt tạo nguồn, giữ lại và sử dụng tiền được nguồn Tài hỗ trợ. Nối rõ từ cách thực hiện đến câu hỏi về khoản thu, không lấy tổ chức tốt làm bằng chứng có lợi nhuận. Nếu dùng nghĩa nền biểu đạt của một sao tại Tài, đó là tổng hợp giới hạn, không lời nguồn xác nhận bán hàng/thu nhập. Giữ nhịp chi ngoài công việc theo đúng điều kiện nguồn, không gán mọi khoản hao cho một nguyên nhân.",
    },
    {
      palace: "Mệnh",
      focus:
        "Ưu tiên lời suy xét/hành động thực có ở Mệnh để đối chiếu cách tiếp cận nguồn lực tại Tài Bạch. Phân biệt tính toán phương án, quá trình tạo khoản thu và phần giữ lại; không lấy lời giàu có chung ở Mệnh làm kết quả của Tài. Phần nối là tổng hợp có mức độ, không tự tạo công thức cộng trừ chính tinh–hao tinh hoặc chọn bảng nguồn thắng.",
    },
  ],
};
export function paidContextGuide(
  input: MenhInput,
  metadata: Map<string, ContextMetadata> = new Map(),
): MenhInput["contextGuide"] {
  const target = input.paidTarget?.palace;
  if (!target || !FRAMES[target]) return undefined;
  const direct = input.knowledge.filter(
    (k) =>
      ["A", "B"].includes(k.group || "") &&
      k.application === "direct" &&
      k.subjectPalaces?.includes(target),
  );
  if (!direct.length) return undefined;
  const premiseIds = [
    ...new Set(
      direct.flatMap((k) => k.anchorFactIds || k.passage?.anchorFactIds || []),
    ),
  ];
  if (premiseIds.some((id) => !input.facts.some((f) => f.id === id)))
    return undefined;
  const links: Link[] = [];
  for (const frame of FRAMES[target]) {
    const source = input.knowledge.filter(
      (k) =>
        k.group === "C" &&
        k.application === "context" &&
        k.subjectPalaces?.length === 1 &&
        k.subjectPalaces[0] === frame.palace &&
        metadata.get(k.id)?.types.some((type) => type !== "method-gloss"),
    );
    // Rank only already-selected, condition-matched C. This changes neither the
    // retrieval budget nor source meaning. No new candidate enters the packet.
    const selectedSource = [...source]
      .sort(
        (a, b) =>
          paidContextFocusRank(a, target) - paidContextFocusRank(b, target),
      )
      .slice(0, 3);
    if (!source.length) continue;
    const sourcePremises = [
      ...new Set(
        selectedSource.flatMap(
          (k) => k.anchorFactIds || k.passage?.anchorFactIds || [],
        ),
      ),
    ];
    if (sourcePremises.some((id) => !input.facts.some((f) => f.id === id)))
      continue;
    const sourceFacts = input.facts.filter(
      (f) =>
        f.provenance?.palace === frame.palace &&
        f.provenance.verification === "source-traced",
    );
    const relation = sourceFacts[0]?.provenance?.relation;
    if (!["trine", "opposition"].includes(relation || "")) continue;
    const geometry = input.facts.find(
      (f) =>
        f.kind === "geometry" &&
        f.id ===
          (relation === "trine" ? "geometry.tam-hop" : "geometry.xung-chieu"),
    );
    if (!geometry) continue;
    const targetFacts = input.facts.filter(
      (f) =>
        f.provenance?.palace === target &&
        f.provenance.verification === "source-traced",
    );
    const anchors = (facts: MenhInput["facts"]) =>
      facts.filter((f) =>
        ["majorStars", "boshi12", "suiqian12"].includes(
          f.provenance?.field || "",
        ),
      );
    const natal = input.facts.filter(
      (f) =>
        /^natal\.(Lộc|Quyền|Khoa|Kỵ)$/u.test(f.id) &&
        [target, frame.palace].some((p) => f.text.includes(`tại ${p} (`)),
    );
    links.push({
      sourcePalace: frame.palace,
      relation: relation as Link["relation"],
      sourceKnowledgeIds: selectedSource.map((k) => k.id),
      targetKnowledgeIds: direct.slice(0, 3).map((k) => k.id),
      factIds: [
        ...new Set([
          geometry.id,
          ...anchors(targetFacts).map((f) => f.id),
          ...anchors(sourceFacts).map((f) => f.id),
          ...natal.map((f) => f.id),
          ...premiseIds,
          ...sourcePremises,
        ]),
      ],
      focus: frame.focus,
      limits: [
        "Đây là đề nghị tổ chức bài, không phải quy tắc phối hợp từ sách.",
        "Nguồn C giữ cung gốc, điều kiện, tác giả và ngoại lệ; không thành lời áp trực tiếp hoặc phép chế hóa.",
      ],
    });
  }
  return links.length
    ? { version: "paid-context-guide-1.2.0", links }
    : undefined;
}

/** Read-only editorial diagnostic. Never changes coverage, billing or retry.
 * Citation alone is not proof of a sound argument; full text still needs review. */
export function reviewPaidContextUse(input: MenhInput, content: PaidReadingV2) {
  const links = input.contextGuide?.links || [];
  if (content.coverage === "insufficient") return [];
  const paragraphs = content.sections.flatMap((s) =>
    s.paragraphs.map((p) => ({ ...p, role: s.role })),
  );
  if (
    links.some((link) =>
      paragraphs.some(
        (p) =>
          namesPalace(p.text, link.sourcePalace) &&
          p.knowledgeIds.some((id) => link.sourceKnowledgeIds.includes(id)),
      ),
    )
  )
    return [];
  return links.map((link) => ({
    code: "supported-context-not-used" as const,
    sourcePalace: link.sourcePalace,
  }));
}

/** New prompt only: mixing A/B into a paragraph must not erase C's subject. */
export function validatePaidContextAttribution(
  input: MenhInput,
  content: PaidReadingV2,
) {
  for (const section of content.sections)
    for (const paragraph of section.paragraphs) {
      const context = paragraph.knowledgeIds
        .map((id) => input.knowledge.find((k) => k.id === id))
        .filter((k) => k?.group === "C");
      if (
        context.some(
          (k) =>
            !k!.subjectPalaces?.length ||
            !k!.subjectPalaces.every((p) => namesPalace(paragraph.text, p)),
        )
      )
        throw Error("AI_CONTEXT_AS_DIRECT");
    }
}
