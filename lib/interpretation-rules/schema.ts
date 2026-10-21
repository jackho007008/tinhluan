import { z } from "zod";
const id = z.string().regex(/^[a-z][a-z0-9._-]{0,100}$/);
const version = z.string().regex(/^\d+\.\d+\.\d+$/);
export const pathSchema = z
  .string()
  .regex(/^(?:chart(?:\.[A-Za-z0-9_]+)+|normalized\.gender)$/)
  .refine(
    (s) =>
      !s
        .split(".")
        .some((k) => ["__proto__", "prototype", "constructor"].includes(k)),
  );
export const referenceSchema = z
  .object({
    id,
    title: z.string().min(1).max(300),
    url: z.string().refine((s) => {
      if (/^\/internal\/editorial\/[a-z0-9-]+(?:#[a-z0-9-]+)?$/.test(s))
        return true;
      try {
        return new URL(s).protocol === "https:";
      } catch {
        return false;
      }
    }),
    location: z.string().min(1).max(500),
    accessedOn: z.string().date(),
    rights: z.enum(["cleared", "pending"]),
    rightsNote: z.string().min(1).max(1000),
  })
  .strict();
const scalar = z.union([z.string().max(300), z.number().finite(), z.boolean()]);
export const conditionSchema = z.discriminatedUnion("op", [
  z.object({ fact: id, op: z.literal("exists") }).strict(),
  z.object({ fact: id, op: z.literal("eq"), value: scalar }).strict(),
  z.object({ fact: id, op: z.literal("includes"), value: scalar }).strict(),
]);
export const ruleSchema = z
  .object({
    id,
    version,
    kind: z.enum(["fact", "interpretation"]),
    topic: z.enum(["overview", "career"]),
    presentation: z
      .object({
        title: z.string().min(1),
        readerLimit: z.string().min(1).optional(),
        readingTheme: z
          .enum(["action", "learning", "initiative", "work", "finance", "phuc", "di", "no", "dien", "parents", "siblings", "spouse", "children"])
          .optional(),
        sourceConditions: z.array(z.string().min(1)).min(1).optional(),
        projectScope: z.array(z.string().min(1)).min(1).optional(),
        moveToDetails: z.array(id).max(20).optional(),
        contentType: z.enum([
          "element-gloss",
          "method-gloss",
          "context",
          "combination",
        ]),
        applicability: z.string().min(1),
        knownExceptions: z.array(z.string()),
        unknownConditions: z.array(z.string()).min(1),
        sourceScope: z.string().min(1),
      })
      .strict()
      .optional(),
    origin: z.enum(["catalog", "synthetic"]),
    requiredEngineProfile: z
      .array(
        z.enum([
          "vn-utc7-midnight-v1",
          "cn-reference",
          "tanbien-vn-trial-v1",
          "tanbien-vn-trial-v2",
        ]),
      )
      .min(1)
      .max(3),
    requiredFacts: z.array(id).min(1).max(30),
    conditions: z.array(conditionSchema).min(1).max(30),
    exceptions: z.array(conditionSchema).max(30),
    claimTemplate: z.string().min(1).max(1200),
    evidencePaths: z.array(pathSchema).min(1).max(50),
    sourceReferences: z.array(referenceSchema).min(1).max(10),
    conflictsWith: z.array(id).max(30),
    conflictGroup: id.nullable(),
    conflictPolicy: z.enum(["retain-both", "withhold-all"]),
    status: z.enum(["draft", "reviewed", "approved", "retired"]),
    review: z
      .object({
        reviewer: z.string().min(1),
        reviewedOn: z.string().date(),
        recordUrl: z.string().url(),
        scope: z.string().min(1),
      })
      .strict()
      .nullable(),
    limitations: z.array(z.string().min(1).max(600)).min(1).max(10),
  })
  .strict()
  .superRefine((r, c) => {
    for (const x of [...r.conditions, ...r.exceptions])
      if (!r.requiredFacts.includes(x.fact))
        c.addIssue({
          code: "custom",
          message: "Every condition/exception fact must be required",
        });
    for (const m of r.claimTemplate.matchAll(/\{\{([^{}]+)\}\}/g))
      if (!r.requiredFacts.includes(m[1]))
        c.addIssue({ code: "custom", message: "Unknown template fact" });
    if (/[{}]/.test(r.claimTemplate.replace(/\{\{[^{}]+\}\}/g, "")))
      c.addIssue({ code: "custom", message: "Invalid template syntax" });
    if (["reviewed", "approved"].includes(r.status) && !r.review)
      c.addIssue({ code: "custom", message: "Review record required" });
  });
export type Rule = z.infer<typeof ruleSchema>;
export type Condition = z.infer<typeof conditionSchema>;
export function readPath(root: unknown, path: string): unknown {
  if (!pathSchema.safeParse(path).success) return undefined;
  return path
    .split(".")
    .reduce<unknown>(
      (v, k) =>
        v !== null && typeof v === "object" && Object.hasOwn(v, k)
          ? (v as Record<string, unknown>)[k]
          : undefined,
      root,
    );
}
