import type { MenhInput } from "./contract";
import { paidInstructionsV2 } from "./paid-prompt-v2";
export const PAID_PROMPT_CURRENT = "paid-palaces-vietnamese-2.1.0";
/** 2.0.0 is immutable and remains available for existing receipts. */
export function paidInstructionsV21(input: MenhInput) {
  return paidInstructionsV2(input)
    .replace("paid-palaces-vietnamese-2.0.0", PAID_PROMPT_CURRENT)
    .replace("A/B là các lời có điều kiện phù hợp; ưu tiên nền trực tiếp cho chủ đề.", "A và B/direct là các lời có điều kiện phù hợp. B/reference-only là nghĩa nền của sao trong ngữ cảnh được ghi, không phải mệnh đề cá nhân đã khớp. Không dùng B/reference-only như source-interpretation; chỉ hỗ trợ ai-synthesis cùng một nền A/B direct hợp lệ, giữ điều kiện và giới hạn nguồn. Nếu các nguồn dùng bảng khác nhau, không chọn bảng thắng hoặc đổi facts.") + `
BIÊN TẬP CUỐI: Viết một bài có đường dây lập luận, không lần lượt kể hết những gì có trong đầu vào. Chọn 2–4 luận điểm khác nhau nếu thật sự có; mỗi luận điểm giải thích được quan hệ giữa các yếu tố và điều đó đóng góp gì cho chủ đề. Đây không phải số mục bắt buộc. Một luận điểm được trình bày đầy đủ ở một nơi; phần tổng hợp không kể lại nguyên trục của phần phân tích. Những sao thiếu nghĩa đã kiểm có thể không được diễn giải.
Không chia trục quyền–trách nhiệm thành nhiều chương đổi tên. Với Tài, tách khả năng tạo nguồn thu, cách tích lũy và khoản chi chỉ khi mỗi ý có nguồn riêng; không lấp ba trục bằng lời khuyên tài chính. Chỉ đặt Liêm Trinh và Đại Hao cạnh nhau như hai dữ kiện cùng cung, không gọi đó là phép phối hợp đã được sách xác nhận. Nguồn đơn sao của tác giả khác nhau không tự tạo thành quy tắc tổ hợp.
Khi biên soạn một phép nối có ích, nói tự nhiên như “Có thể đọc hai nét này cạnh nhau...” và giải thích ngay căn cứ cùng giới hạn; không nhắc nhãn kỹ thuật ai-synthesis trong thân bài. Không lặp lời rào ở đầu mỗi đoạn. Hỏi tự đối chiếu phải xuất phát từ luận điểm vừa phân tích, không thành cẩm nang sống.
Trước khi trả bài, bỏ đoạn chỉ lặp một kết luận đã có, gộp các đoạn cùng ý, và kiểm tất cả factIds/knowledgeIds có thật. Chỉ cite facts nguồn đã kiểm khi diễn giải; không cite cả danh sách sao vòng chưa xác minh để minh họa một ý khác. Phạm vi limited/insufficient là kết quả kết thúc hợp lệ; không tăng coverage vì có nhiều nguồn nền.`;
}
