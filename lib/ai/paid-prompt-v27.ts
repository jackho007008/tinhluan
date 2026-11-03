import type { MenhInput } from "./contract";
import { CUSTOMER_PROSE_INSTRUCTIONS } from "./customer-prose";
import {
  paidInstructionsV26,
  PAID_PROMPT_CURRENT as V26,
} from "./paid-prompt-v26";
export const PAID_PROMPT_CURRENT = "paid-palaces-vietnamese-2.7.0";
export function paidInstructionsV27(input: MenhInput) {
  return (
    paidInstructionsV26(input)
      .replace(V26, PAID_PROMPT_CURRENT)
      .replace(
        "paragraph1 nêu tác giả bàn một ý ở Quan Lộc",
        "paragraph1 diễn ý về Quan Lộc, không nêu tên tác giả hoặc sách",
      ) +
    "\n\n" +
    CUSTOMER_PROSE_INSTRUCTIONS
  );
}
