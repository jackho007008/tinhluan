import { narrationSchema } from "./contract";
import { PAID_PROMPT_V2, paidReadingV2Schema } from "./paid-reading-v2";
export const PAID_V1_PROMPTS = [
  "paid-palaces-vietnamese-1.0.0",
  "paid-palaces-vietnamese-1.0.1",
  "paid-palaces-vietnamese-1.1.0",
  "paid-palaces-vietnamese-1.2.0",
] as const;
export function paidOutputSchema(version: string) {
  if (version === PAID_PROMPT_V2) return paidReadingV2Schema;
  if ((PAID_V1_PROMPTS as readonly string[]).includes(version))
    return narrationSchema;
  throw Error("AI_PROMPT_VERSION_UNSUPPORTED");
}
