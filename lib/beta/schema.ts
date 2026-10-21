import { z } from "zod";
export const feedbackTags = [
  "Khó hiểu",
  "Chung chung",
  "Thiếu căn cứ",
  "Mâu thuẫn",
  "Lỗi thuật ngữ",
  "Hữu ích",
] as const;
export const feedbackSchema = z
  .object({
    id: z.string().uuid(),
    reportId: z.string().uuid(),
    readerAlias: z.string().regex(/^P-[a-f0-9]{12}$/),
    sectionId: z.string().min(1).max(100),
    understanding: z.number().int().min(1).max(5),
    tags: z
      .array(z.enum(feedbackTags))
      .max(6)
      .refine((a) => new Set(a).size === a.length),
    basisFound: z.enum(["yes", "no", "not-tried"]),
    useful: z.string().max(1500),
    unclear: z.string().max(1500),
    concern: z.string().max(1500),
    missing: z.string().max(1500),
  })
  .strict();
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export function betaEnabled() {
  return process.env.BETA_ENABLED === "true";
}
export function requireBeta() {
  if (!betaEnabled()) throw Error("BETA_DISABLED");
}
