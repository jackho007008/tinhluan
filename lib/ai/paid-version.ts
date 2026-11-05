import { narrationSchema } from "./contract";
import { PAID_PROMPT_V2, paidReadingV2Schema } from "./paid-reading-v2";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V21 } from "./paid-prompt-v21";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V22 } from "./paid-prompt-v22";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V23 } from "./paid-prompt-v23";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V24 } from "./paid-prompt-v24";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V25 } from "./paid-prompt-v25";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V26 } from "./paid-prompt-v26";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V27 } from "./paid-prompt-v27";
import { PAID_PROMPT_CURRENT as PAID_PROMPT_V28 } from "./paid-prompt-v28";
import { PAID_PROMPT_CURRENT } from "./paid-prompt-v281";
export const isPaidV2Prompt = (version: string) =>
  [
    PAID_PROMPT_V2,
    PAID_PROMPT_V21,
    PAID_PROMPT_V22,
    PAID_PROMPT_V23,
    PAID_PROMPT_V24,
    PAID_PROMPT_V25,
    PAID_PROMPT_V26,
    PAID_PROMPT_V27,
    PAID_PROMPT_V28,
    PAID_PROMPT_CURRENT,
  ].includes(version);
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
