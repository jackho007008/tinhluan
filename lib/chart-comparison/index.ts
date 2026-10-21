import { z } from "zod";
import { birthSchema } from "../calendar";
import { readPath, pathSchema } from "../interpretation-rules/schema";
import type { ChartSnapshot } from "../tuvi-engine";
const comparison = z
  .object({
    path: pathSchema,
    expected: z
      .unknown()
      .refine((v) => v !== undefined, "Expected is required"),
    resolution: z
      .object({
        status: z.enum([
          "unresolved",
          "convention-difference",
          "source-correction",
          "engine-issue",
        ]),
        note: z.string().min(1),
      })
      .strict(),
  })
  .strict();
export const fixtureSchema = z
  .object({
    id: z.string().min(1),
    schemaVersion: z.literal("1.0.0"),
    status: z.enum([
      "awaiting-source",
      "independent-source",
      "upstream-example",
      "synthetic",
    ]),
    birth: birthSchema,
    conventions: z
      .object({
        profile: z.enum(["cn-reference", "vn-utc7-midnight-v1"]),
        school: z.string().min(1),
        timezone: z.literal("UTC+7-civil"),
        dayBoundary: z.enum(["00:00", "23:00-forward"]),
        leapMonth: z.enum(["repeat-month-number", "half-month-upstream"]),
      })
      .strict(),
    source: z
      .object({
        title: z.string().min(1),
        reference: z.string().min(1),
        location: z.string().min(1),
        rights: z.string().min(1),
        comparedOn: z.string().date(),
        confirmedBy: z.string().min(1).nullable(),
        confirmationRecord: z.string().min(1).nullable(),
        confirmedScope: z.array(pathSchema),
      })
      .strict()
      .nullable(),
    expected: z.array(comparison).max(1000),
    notes: z.array(z.string()),
  })
  .strict()
  .superRefine((f, c) => {
    if (f.birth.profile !== f.conventions.profile)
      c.addIssue({ code: "custom", message: "Profile mismatch" });
    if (f.status === "awaiting-source" && (f.expected.length || f.source))
      c.addIssue({
        code: "custom",
        message: "Awaiting source must not contain invented expected/source",
      });
    if (f.status !== "awaiting-source" && (!f.source || !f.expected.length))
      c.addIssue({ code: "custom", message: "Evidence and expected required" });
    if (new Set(f.expected.map((e) => e.path)).size !== f.expected.length)
      c.addIssue({ code: "custom", message: "Duplicate expected path" });
    if (
      f.source &&
      f.expected.some((e) => !f.source!.confirmedScope.includes(e.path))
    )
      c.addIssue({
        code: "custom",
        message: "Expected outside confirmed scope",
      });
    if (f.source?.confirmedBy && !f.source.confirmationRecord)
      c.addIssue({
        code: "custom",
        message: "Reviewer requires a real confirmation record",
      });
  });
export type ComparisonFixture = z.infer<typeof fixtureSchema>;
const canonical = (v: unknown): string =>
  JSON.stringify(v, (_, x) =>
    x && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(
          Object.entries(x).sort(([a], [b]) => a.localeCompare(b)),
        )
      : x,
  );
export function compareChart(raw: unknown, snapshot: ChartSnapshot) {
  const f = fixtureSchema.parse(raw);
  if (f.status === "awaiting-source")
    return {
      id: f.id,
      status: "awaiting-source",
      differences: [],
      passed: 0,
      expertConfirmed: false,
    };
  const conventionMatch =
    f.conventions.dayBoundary ===
      (snapshot.profile.id === "cn-reference" ? "23:00-forward" : "00:00") &&
    f.conventions.leapMonth ===
      (snapshot.profile.id === "cn-reference"
        ? "half-month-upstream"
        : "repeat-month-number");
  const birthMatch = canonical(f.birth) === canonical(snapshot.normalized);
  if (
    !conventionMatch ||
    !birthMatch ||
    f.conventions.profile !== snapshot.profile.id
  )
    return {
      id: f.id,
      status: "input-or-profile-mismatch",
      differences: [],
      passed: 0,
      expertConfirmed: false,
    };
  const differences = f.expected.map((e) => ({
    path: e.path,
    expected: e.expected,
    actual: readPath(snapshot, e.path),
    resolution: e.resolution,
    match: canonical(readPath(snapshot, e.path)) === canonical(e.expected),
  }));
  return {
    id: f.id,
    status: differences.every((d) => d.match) ? "matched" : "differences",
    differences,
    passed: differences.filter((d) => d.match).length,
    expertConfirmed: false,
    evidenceClass: f.status,
    source: f.source,
    notice:
      "So khớp phần mềm không tự xác nhận tính thật của nguồn hoặc chuyên gia; chỉ các trường declared được so sánh.",
  };
}
