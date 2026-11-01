import { narrationSchema, SECTION_KINDS } from "./contract";
import {
  PAID_PROMPT_V2,
  paidV2Shape,
  type PaidResult,
} from "./paid-reading-v2";
import { PAID_V1_PROMPTS } from "./paid-version";
/** Pure reader shared by server and client. No shape guessing or legacy fallback. */
export function readPaidContent(
  result: Pick<PaidResult, "content" | "promptVersion">,
) {
  try {
    if (result.promptVersion === PAID_PROMPT_V2)
      return { version: 2 as const, content: paidV2Shape(result.content) };
    if (!(PAID_V1_PROMPTS as readonly string[]).includes(result.promptVersion))
      return null;
    const p = narrationSchema.safeParse(result.content);
    if (
      !p.success ||
      p.data.sections.map((s) => s.kind).join() !== SECTION_KINDS.join()
    )
      return null;
    return { version: 1 as const, content: p.data };
  } catch {
    return null;
  }
}
