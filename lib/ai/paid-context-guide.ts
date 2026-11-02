import type { MenhInput } from "./contract";
import type { PaidReadingV2 } from "./paid-reading-v2";
import type { ContextMetadata } from "./paid-context";
type Link = NonNullable<MenhInput["contextGuide"]>["links"][number];
const namesPalace = (text: string, palace: string) =>
  text
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .includes(palace.normalize("NFC").toLocaleLowerCase("vi"));
/** Topic framing, not a new astrological proposition or an instruction in a source.
 * IDs point to existing, condition-matched C and target A/B. No duplicated prose. */
const FRAMES: Record<string, { palace: string; focus: string }[]> = {
  "Nô Bộc": [
    {
      palace: "Huynh Đệ",
      focus:
        "Đọc lời đối đãi/giao du tại Nô cạnh lời về anh chị em tại Huynh Đệ: hai loại quan hệ và kỳ vọng đáp lại khác nhau. Phân tích vì sao không thể lấy độ rộng giao du thay cho sự gần gũi trong quan hệ huyết thống; không suy trợ giúp, phản bội hoặc thay thế tình thân.",
    },
  ],
  "Tử Nữ": [
    {
      palace: "Phụ Mẫu",
      focus:
        "Phân biệt hai thế hệ và vai của mệnh tạo: là con khi đọc Phụ Mẫu, trong quan hệ với con khi đọc Tử Nữ. Giữ riêng điều kiện vật chất và sự hòa thuận trong lời Phụ; không truyền lời về cha mẹ sang phẩm chất con hoặc dự báo gia đình lặp lại. Điều kiện cho lời Tử có thể nằm ở cung khác theo phương pháp nguồn, không chuyển sao.",
    },
  ],
  "Quan Lộc": [
    {
      palace: "Tài Bạch",
      focus:
        "Đối chiếu lời về công việc với những phương diện tiền bạc thực sự được nguồn ở Tài hỗ trợ; phân biệt tạo, tích lũy và chi, không coi một mặt bảo đảm mặt kia.",
    },
    {
      palace: "Mệnh",
      focus:
        "Đặt những luận điểm phù hợp ở Mệnh cạnh cách làm việc tại Quan, giải thích sự khác nhau về chủ thể và phạm vi; không lấy nét ở Mệnh thành nghĩa của sao tọa Quan.",
    },
  ],
  "Tài Bạch": [
    {
      palace: "Quan Lộc",
      focus:
        "Đối chiếu những mặt thực sự được nguồn Quan hỗ trợ với chủ đề tạo và dùng tiền; chỉ bàn tổ chức/biểu đạt nếu nguồn có, không đổi lời thuận công việc thành mức thu nhập hoặc lợi nhuận.",
    },
    {
      palace: "Mệnh",
      focus:
        "Đọc những luận điểm phù hợp ở Mệnh như ngữ cảnh riêng bên cạnh thu/tích lũy/chi; không tự bù trừ Hóa Kỵ, lời thuận hoặc hao tinh.",
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
    if (!source.length) continue;
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
      sourceKnowledgeIds: source.slice(0, 3).map((k) => k.id),
      targetKnowledgeIds: direct.slice(0, 3).map((k) => k.id),
      factIds: [
        ...new Set([
          geometry.id,
          ...anchors(targetFacts).map((f) => f.id),
          ...anchors(sourceFacts).map((f) => f.id),
          ...natal.map((f) => f.id),
          ...premiseIds,
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
    ? { version: "paid-context-guide-1.0.0", links }
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
