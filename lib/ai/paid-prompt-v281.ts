import type { MenhInput } from "./contract";
import {
  paidInstructionsV28,
  PAID_PROMPT_CURRENT as V28,
} from "./paid-prompt-v28";

export const PAID_PROMPT_CURRENT = "paid-palaces-vietnamese-2.8.1";
/** Reference-contract patch for new attempts; 2.8.0 stays byte-for-byte. */
export function paidInstructionsV281(input: MenhInput) {
  return (
    paidInstructionsV28(input).replace(V28, PAID_PROMPT_CURRENT) +
    `
KIỂM ĐỦ TIỀN ĐỀ CỦA ĐOẠN TỔNG HỢP
Khi dùng nghĩa nền foundation, mỗi sao hoặc Tứ Hóa đem vào lập luận phải có nguồn thực sự giải thích tiền đề ấy, với anchorFactIds hoặc passage.anchorFactIds đúng factId ngay trong knowledgeIds của đoạn. Không chỉ dẫn nền của một sao rồi suy thêm nghĩa của sao khác; nguồn ở đoạn trước không thay căn cứ của đoạn hiện tại. Cung vị và hình học chỉ là khung, không tự cung cấp nghĩa sao. Không thêm nguồn không được dùng để vượt kiểm tra. Nếu chỉ mô tả một dữ kiện chưa có lời giải thích, tách thành đoạn facts; nếu không có nguồn hỗ trợ liên hệ thì bỏ liên hệ, không bỏ factId để né kiểm. Ví dụ nền của Thiên Lương không thay nguồn giải thích Hóa Lộc khi nối cả hai. Đây là kiểm đủ tiền đề, không chứng nhận mọi cách tổng hợp đều đúng; không tự tạo phép chế hóa.`
  );
}
