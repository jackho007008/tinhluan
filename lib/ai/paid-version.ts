import { narrationSchema } from "./contract";
import { PAID_PROMPT_V2, paidReadingV2Schema } from "./paid-reading-v2";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V21 } from "./paid-prompt-v21";
import { PAID_PROMPT_CURRENT } from "./paid-prompt-v22";
export const isPaidV2Prompt = (version: string) => [PAID_PROMPT_V2, PAID_PROMPT_V21, PAID_PROMPT_CURRENT].includes(version);
export const PAID_V1_PROMPTS = [
  "paid-palaces-vietnamese-1.0.0",
  "paid-palaces-vietnamese-1.0.1",
  "paid-palaces-vietnamese-1.1.0",
  "paid-palaces-vietnamese-1.2.0",
] as const;
export function paidOutputSchema(version: string) {
  if (isPaidV2Prompt(version)) return paidReadingV2Schema;
  if ((PAID_V1_PROMPTS as readonly string[]).includes(version))
    return narrationSchema;
  throw Error("AI_PROMPT_VERSION_UNSUPPORTED");
}
