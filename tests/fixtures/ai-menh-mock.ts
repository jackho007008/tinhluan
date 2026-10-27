import {
  SECTION_KINDS,
  type MenhInput,
  type Narration,
} from "../../lib/ai/contract";
import type { Generation } from "../../lib/ai/provider";
/** Deliberately test-only. No environment flag enables this narrator in the app
 * or production worker. Every stored result identifies provider=test-mock. */
export function mockMenhGeneration(input: MenhInput): Generation {
  const location = input.facts.find((f) => /^Mệnh tại /.test(f.text))!,
    prefix = location.id.replace(".location", ""),
    majors = input.facts.filter(
      (f) =>
        f.id.startsWith(prefix + ".majorStars.") && !f.id.endsWith(".empty"),
    );
  const starNames =
    majors
      .map((f) => f.text.split(": ")[1]?.split(";")[0])
      .filter(Boolean)
      .join(" và ") || "không có chính tinh tọa thủ trong danh sách đã lưu";
  const geometry = input.facts.find((f) => f.id === "geometry.tam-hop")!,
    body = input.facts.find((f) => f.id === "body.location") || location;
  const titles = [
    "Bản chất cung Mệnh",
    "Tính cách và xu hướng",
    "Năng lực và điểm cần phát triển",
    "Tổ hợp chính tinh",
    "Vai trò các sao đi kèm",
    "Tam phương tứ chính",
    "Những mặt cần đọc cùng nhau",
    "Gợi ý tự đối chiếu",
  ];
  const descriptions = [
    `Bản mô phỏng này sử dụng vị trí Mệnh và danh sách sao thật của engine: ${starNames}. Nó kiểm việc đưa dữ kiện đã lưu vào đúng bài của hồ sơ, không giả làm kết quả do OpenAI phân tích. Khi có model thật, phần này cần giải thích ý nghĩa của tổ hợp trong đúng vị trí và giữ các điều kiện của tài liệu.`,
    "Đoạn kiểm thử chưa kết luận tính cách của người thật. Các dữ kiện về chính tinh, trạng thái và sao đi kèm đã có trong gói đầu vào; model thật cần chỉ rõ xu hướng nào được hỗ trợ bởi dữ kiện nào, và trình bày như khả năng để người đọc tự quan sát thay vì một nhãn cố định.",
    "Bản mô phỏng dùng phần này để kiểm cách trình bày ưu điểm, mặt hạn chế và câu hỏi tự đối chiếu trong cùng cấu trúc lưu trữ. Chưa có suy luận về năng lực được tạo bởi một model thật. Không dùng vị trí sao để xác nhận bằng cấp, thành tích hoặc thay thế hiểu biết về trải nghiệm của người đọc.",
    `Các sao tọa Mệnh được truyền nguyên từ snapshot: ${starNames}. Bộ kiểm không tự cộng ý nghĩa các sao thành một kết luận. Phân tích thật có thể tổng hợp, nhưng cần nói rõ điều gì đến từ tài liệu và điều gì là cách hiểu do AI đề xuất, nhất là khi các yếu tố cùng cung khác chiều.`,
    "Danh sách phụ tinh và các sao khác vẫn gắn với từng cung và nhóm đã lưu. Trong bài thật, không được tự thêm sao đang thiếu hoặc quy mọi phụ tinh thành một tác động giống nhau. Bản mô phỏng chỉ xác nhận rằng phần luận này có chỗ để hiển thị cùng căn cứ và giới hạn phù hợp.",
    "Quan hệ tam hợp và xung chiếu được adapter xác định từ vị trí địa chi đã lưu. Đây là quan hệ hình học của các cung, chưa tự động có nghĩa mượn sao hay chế hóa. Model thật phải giữ sự khác nhau giữa tọa thủ và hội chiếu; không biến ngữ cảnh các cung khác thành bài chi tiết về những chủ đề trả phí.",
    "Bản mô phỏng giữ một phần riêng để model thật nêu những yếu tố thuận và khó cần đọc cùng nhau. Chưa có kết luận rằng một yếu tố xóa yếu tố còn lại. Nếu tài liệu chưa giải được cách phối hợp, model có thể nêu cách hiểu có lý do nhưng phải đánh dấu đó là suy luận, đồng thời giữ điều chưa biết.",
    "Bạn có thể dùng bài thật để tự hỏi mô tả nào phù hợp với trải nghiệm của mình và mô tả nào không. Bản kiểm này không đưa lời khuyên cụ thể hoặc dự báo. Mục tiêu hiện tại là kiểm việc tạo, lưu, mở lại và truy vết một bài Mệnh độc lập, không gọi lại API khi chỉ đọc báo cáo.",
  ];
  const content: Narration = {
    sections: SECTION_KINDS.map((kind, i) => ({
      kind,
      title: titles[i],
      content: descriptions[i],
      factIds: [
        i === 5 ? geometry.id : i === 7 ? body.id : location.id,
        ...majors.slice(0, 2).map((f) => f.id),
      ],
      knowledgeIds: input.knowledge.slice(0, 1).map((k) => k.id),
      basis: "ai-synthesis",
    })),
    limitations: [
      "BẢN MÔ PHỎNG KIỂM THỬ; không phải kết quả OpenAI hoặc đánh giá chất lượng model.",
      "Dữ kiện là engine thật trong môi trường kiểm riêng; văn minh họa không xác nhận con người hoặc hoàn cảnh thực tế.",
    ],
  };
  return {
    raw: content,
    model: "test-mock-not-an-openai-model",
    provider: "test-mock",
    responseId: "mock-response",
    durationMs: 12,
    usage: {
      inputTokens: 0,
      cachedInputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
    },
    estimatedCostUsd: null,
  };
}
