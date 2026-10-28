import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  contentHash,
  v1EditRoot,
  writeEditArtifact,
  readEditArtifact,
} from "./v1-edit-storage";
import type { V1EditUnit } from "./v1-edit";

export const V1_REVIEW_VERSION = "v1-edit-review-1.0.0";
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const sourceContextSchema = z
  .object({
    sourceId: z.string().min(1),
    unitHash: digest,
    v1Version: z.string().min(1),
    catalogVersion: z.string().min(1),
  })
  .strict();
export type V1SourceContext = z.infer<typeof sourceContextSchema>;
export function v1SourceContext(
  unit: V1EditUnit,
  catalogVersion: string,
): V1SourceContext {
  const ids = [
    ...new Set(unit.conditions.map((c) => c.id + "@" + c.version)),
  ].sort();
  return sourceContextSchema.parse({
    sourceId: "menh-v1:" + ids.join("+"),
    unitHash: contentHash(unit),
    v1Version: unit.sourceVersion,
    catalogVersion,
  });
}
export const sourceContextId = (source: V1SourceContext) =>
  contentHash(sourceContextSchema.parse(source));
export async function registerV1Source(
  unit: V1EditUnit,
  source: V1SourceContext,
) {
  if (
    contentHash(v1SourceContext(unit, source.catalogVersion)) !==
    contentHash(source)
  )
    throw Error("V1_SOURCE_MISMATCH");
  const id = sourceContextId(source),
    entry = {
      version: V1_REVIEW_VERSION,
      id,
      source,
      unit,
      createdAt: new Date().toISOString(),
    };
  try {
    await writeEditArtifact("sources", id, entry);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    const old = await readEditArtifact("sources", id);
    if (
      contentHash(old.source) !== contentHash(source) ||
      contentHash(old.unit) !== contentHash(unit)
    )
      throw Error("V1_SOURCE_CORRUPT");
  }
  return id;
}
export const REVIEW_CRITERIA = [
  "factsAndScope",
  "conditions",
  "noNewClaims",
  "meaning",
  "sources",
] as const;
const check = z
  .object({
    status: z.enum(["pass", "fail", "uncertain"]),
    evidence: z.string().trim().min(15).max(2000),
  })
  .strict();
export const reviewAssessmentSchema = z
  .object({
    requestedState: z.enum(["draft", "approved", "rejected"]),
    previousReviewId: z.string().uuid().nullable(),
    note: z.string().trim().min(15).max(4000),
    checks: z
      .object({
        factsAndScope: check,
        conditions: check,
        noNewClaims: check,
        meaning: check,
        sources: check,
      })
      .strict(),
  })
  .strict();
export type V1ReviewAssessment = z.infer<typeof reviewAssessmentSchema>;
const reviewEventSchema = z
  .object({
    version: z.literal(V1_REVIEW_VERSION),
    id: z.string().uuid(),
    sequence: z.number().int().positive(),
    key: digest,
    source: sourceContextSchema,
    candidateHash: digest,
    state: z.enum(["draft", "approved", "rejected"]),
    requestedState: z.enum(["draft", "approved", "rejected"]),
    previousReviewId: z.string().uuid().nullable(),
    note: z.string(),
    checks: reviewAssessmentSchema.shape.checks,
    technicalFindings: z.array(z.string()),
    updatedAt: z.string().datetime(),
  })
  .strict();
export type V1ReviewEvent = z.infer<typeof reviewEventSchema>;
function reviewDir(key: string, source: V1SourceContext) {
  digest.parse(key);
  return path.join(v1EditRoot(), "reviews", key, sourceContextId(source));
}
export async function v1ReviewHistory(
  key: string,
  source: V1SourceContext,
): Promise<V1ReviewEvent[]> {
  const dir = reviewDir(key, source);
  let files: string[];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
  const events: V1ReviewEvent[] = [];
  for (const file of files) {
    const e = reviewEventSchema.parse(
      JSON.parse(await fs.readFile(path.join(dir, file), "utf8")),
    );
    const prev = events.at(-1);
    if (
      e.key !== key ||
      contentHash(e.source) !== contentHash(source) ||
      e.sequence !== events.length + 1 ||
      e.previousReviewId !== (prev?.id || null) ||
      file !== String(e.sequence).padStart(8, "0") + ".json"
    )
      throw Error("V1_REVIEW_CHAIN_INVALID");
    events.push(e);
  }
  return events;
}
export async function appendV1Review(
  key: string,
  source: V1SourceContext,
  candidateHash: string,
  assessment: V1ReviewAssessment,
  technicalFindings: string[],
) {
  const parsed = reviewAssessmentSchema.parse(assessment);
  sourceContextSchema.parse(source);
  digest.parse(candidateHash);
  const history = await v1ReviewHistory(key, source),
    prev = history.at(-1);
  if (parsed.previousReviewId !== (prev?.id || null))
    throw Error("V1_REVIEW_STALE");
  const passed =
    REVIEW_CRITERIA.every((c) => parsed.checks[c].status === "pass") &&
    technicalFindings.length === 0;
  const state =
    parsed.requestedState === "approved" && !passed
      ? "draft"
      : parsed.requestedState;
  const event: V1ReviewEvent = {
    version: V1_REVIEW_VERSION,
    id: randomUUID(),
    sequence: history.length + 1,
    key,
    source,
    candidateHash,
    state,
    ...parsed,
    technicalFindings,
    updatedAt: new Date().toISOString(),
  };
  const dir = reviewDir(key, source);
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  // Link a complete file into its sequence slot. Concurrent/stale reviewers do
  // not overwrite each other, and a crash cannot expose a half-written event.
  const target = path.join(
      dir,
      String(event.sequence).padStart(8, "0") + ".json",
    ),
    tmp = path.join(dir, "." + randomUUID() + ".tmp");
  try {
    await fs.writeFile(tmp, JSON.stringify(event), { flag: "wx", mode: 0o600 });
    await fs.link(tmp, target);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "EEXIST")
      throw Error("V1_REVIEW_STALE");
    throw e;
  } finally {
    await fs.unlink(tmp).catch(() => {});
  }
  return event;
}
/** A read-only index for the operator, not a CMS or generation queue. */
export async function listV1Sources() {
  let files: string[];
  try {
    files = await fs.readdir(path.join(v1EditRoot(), "sources"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
  return Promise.all(
    files
      .filter((f) => /^[a-f0-9]{64}\.json$/.test(f))
      .sort()
      .map(async (f) => {
        const entry = await readEditArtifact("sources", f.slice(0, -5));
        sourceContextSchema.parse(entry.source);
        if (
          sourceContextId(entry.source) !== entry.id ||
          contentHash(entry.unit) !== entry.source.unitHash
        )
          throw Error("V1_SOURCE_CORRUPT");
        return entry as {
          version: string;
          id: string;
          source: V1SourceContext;
          unit: V1EditUnit;
          createdAt: string;
        };
      }),
  );
}
