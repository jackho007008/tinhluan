import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import type { Knowledge, MenhInput } from "./contract";
import { unresolvedTemplate } from "./v1-editorial";
const anchor = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("star"),
      name: z.string().min(1),
      field: z.enum([
        "majorStars",
        "minorStars",
        "adjectiveStars",
        "boshi12",
        "suiqian12",
      ]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("natal"),
      name: z.enum(["Lộc", "Quyền", "Khoa", "Kỵ"]),
    })
    .strict(),
  z.object({ kind: z.literal("palace") }).strict(),
]);
const page = z
  .object({
    book: z.enum(["npl", "hs", "tb", "thp1", "thp2", "vttl170"]),
    number: z.number().int().min(1).max(1000),
    layer: z.enum(["text", "ocr"]),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();
const unit = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    status: z.enum(["reviewed", "draft", "rejected"]),
    replaces: z
      .array(z.string().regex(/^paid-book\.[a-z0-9-]+$/))
      .max(2)
      .optional(),
    title: z.string().min(1).max(180),
    text: z.string().min(1).max(3000),
    targets: z.array(z.string()).min(1).max(4),
    kind: z.enum(["direct", "foundation", "method"]),
    // All requirements must hold; alternatives inside a requirement are explicit OR.
    requirements: z
      .array(
        z
          .object({ palace: z.string(), any: z.array(anchor).min(1).max(3) })
          .strict(),
      )
      .min(1)
      .max(4),
    palaceConditions: z
      .array(
        z
          .object({
            palace: z.string().min(1),
            branches: z.array(z.string().min(1)).min(1).max(12),
            soleMajor: z.string().min(1),
          })
          .strict(),
      )
      .min(1)
      .max(4)
      .optional(),
    conditions: z.array(z.string().min(1)).min(1).max(8),
    limits: z.array(z.string().min(1)).min(1).max(8),
    references: z
      .array(
        z
          .object({ title: z.string().min(1), location: z.string().min(1) })
          .strict(),
      )
      .min(1)
      .max(4),
    pages: z.array(page).min(1).max(6),
  })
  .strict()
  .refine(
    (u) =>
      u.kind === "method" ||
      !u.requirements.some((r) => r.any.some((a) => a.kind === "palace")),
    "Palace presence anchors methods only, never personal interpretations",
  )
  .refine(
    (u) => u.kind !== "method" || !u.replaces?.length,
    "A method cannot replace a star interpretation",
  );
const index = z
  .object({
    version: z.literal("paid-library-1.0.0"),
    units: z.array(unit).max(64),
  })
  .strict();
export type PaidLibraryUnit = z.infer<typeof unit>;
const digest = (x: string | Buffer) =>
  createHash("sha256").update(x).digest("hex");
export const LIBRARY_MAX_BYTES = 14000;
/** Read only a reviewed index and its named processed pages. Never scan PDFs or
 * choose a personal claim from raw keyword matches. Missing/stale assets fail closed. */
export function paidLibrary(
  input: MenhInput,
  target: string,
  root = process.env.AI_KNOWLEDGE_DIR ||
    path.resolve(".local/source-library/knowledge"),
) {
  const excluded: { id: string; reason: string }[] = [];
  const items: Knowledge[] = [];
  const replacements: { oldId: string; newId: string }[] = [];
  if (!["Nô Bộc", "Tử Nữ", "Phu Thê", "Tài Bạch"].includes(target))
    return { items, excluded, replacements };
  let data: z.infer<typeof index>;
  try {
    // Old checkouts keep reading their original index; new method units never
    // make a shared legacy index unreadable. Missing v1.6 assets use the old set.
    const v110 = path.join(root, "paid-passages", "index-v110.json");
    const v17 = path.join(root, "paid-passages", "index-v17.json");
    const v16 = path.join(root, "paid-passages", "index-v16.json");
    const file = fs.existsSync(v110)
      ? v110
      : fs.existsSync(v17)
        ? v17
        : fs.existsSync(v16)
          ? v16
          : path.join(root, "paid-passages", "index.json");
    if (fs.lstatSync(file).isSymbolicLink() || fs.statSync(file).size > 256000)
      throw Error();
    data = index.parse(JSON.parse(fs.readFileSync(file, "utf8")));
    if (new Set(data.units.map((u) => u.id)).size !== data.units.length)
      throw Error();
  } catch {
    return {
      items,
      replacements,
      excluded: [{ id: "paid-library", reason: "missing-or-invalid-index" }],
    };
  }
  const candidates: Knowledge[] = [];
  for (const u of data.units.filter((u) => u.targets.includes(target))) {
    const id = "paid-library." + u.id;
    const reject = (reason: string) => excluded.push({ id, reason });
    if (u.status !== "reviewed") {
      reject("not-reviewed");
      continue;
    }
    // A name match does not establish an exclusive-star or branch condition.
    // Count even unverified extra major stars: they cannot be treated as absent.
    if (
      u.palaceConditions?.some((c) => {
        const located = input.facts.some(
          (f) =>
            /^palace\.\d+\.location$/.test(f.id) &&
            f.kind === "engine" &&
            c.branches.some((b) =>
              f.text.startsWith(`${c.palace} tại ${b};`),
            ) &&
            f.paths.some((p) => /^chart\.palaces\.\d+$/.test(p)),
        );
        const majors = input.facts.filter(
          (f) =>
            f.provenance?.palace === c.palace &&
            f.provenance.field === "majorStars",
        );
        return (
          !located ||
          majors.length !== 1 ||
          majors[0].provenance?.verification !== "source-traced" ||
          !majors[0].text.includes(`: ${c.soleMajor};`) ||
          input.missing.some(
            (m) => m.startsWith(c.palace + ":") && m.includes("majorStars"),
          )
        );
      })
    ) {
      reject("palace-condition-not-met");
      continue;
    }
    if (
      unresolvedTemplate(
        [
          u.title,
          u.text,
          ...u.conditions,
          ...u.limits,
          ...u.references.map((r) => r.title + r.location),
        ].join(" "),
      )
    ) {
      reject("unresolved-template");
      continue;
    }
    const matches = u.requirements.map((req) =>
      input.facts.filter((f) =>
        req.any.some((a) => {
          if (a.kind === "palace")
            return (
              /^palace\.\d+\.location$/.test(f.id) &&
              f.kind === "engine" &&
              f.text.startsWith(`${req.palace} tại `) &&
              f.paths.some((p) => /^chart\.palaces\.\d+$/.test(p))
            );
          if (a.kind === "natal")
            return (
              f.id === "natal." + a.name &&
              f.text.includes(`tại ${req.palace} (`)
            );
          return (
            f.provenance?.verification === "source-traced" &&
            f.provenance.scope === "natal" &&
            f.provenance.palace === req.palace &&
            f.provenance.field === a.field &&
            f.text.includes(`: ${a.name};`)
          );
        }),
      ),
    );
    if (matches.some((m) => !m.length)) {
      reject("condition-not-met");
      continue;
    }
    const anchorFactIds = [
      ...new Set([
        ...matches.flat().map((f) => f.id),
        ...input.facts
          .filter((f) =>
            u.palaceConditions?.some(
              (c) =>
                (/^palace\.\d+\.location$/.test(f.id) &&
                  c.branches.some((b) =>
                    f.text.startsWith(`${c.palace} tại ${b};`),
                  )) ||
                (f.provenance?.palace === c.palace &&
                  f.provenance.field === "majorStars"),
            ),
          )
          .map((f) => f.id),
      ]),
    ];
    try {
      for (const p of u.pages) {
        const file = path.resolve(
          root,
          "../books",
          p.book,
          "pages",
          String(p.number).padStart(4, "0") +
            (p.layer === "ocr" ? ".ocr.txt" : ".txt"),
        );
        if (
          fs.lstatSync(file).isSymbolicLink() ||
          fs.statSync(file).size > 64000 ||
          digest(fs.readFileSync(file)) !== p.sha256
        )
          throw Error();
      }
    } catch {
      reject("missing-or-changed-source-page");
      continue;
    }
    candidates.push({
      id,
      title: u.title,
      text: u.text,
      conditions: u.conditions,
      limits: u.limits,
      references: u.references,
      group: u.kind === "method" ? "D" : "B",
      application: u.kind === "direct" ? "direct" : "reference-only",
      subjectPalaces: [target],
      selection:
        u.kind === "direct"
          ? "matched-snapshot"
          : u.kind === "method"
            ? "background-method"
            : "reference-only",
      provenance: {
        ruleIds: [],
        ruleStatuses: [],
        sourceVersion: data.version,
        certification: "editorial-reference-not-expert-approved",
      },
      passage: {
        version: data.version,
        digest: digest(JSON.stringify(u)),
        kind: u.kind,
        anchorFactIds: [...new Set(anchorFactIds)],
      },
    });
  }
  // Direct theses before background; more matched anchors before ID. No score of
  // a chart/person, no promotion of background to a direct claim.
  candidates.sort(
    (a, b) =>
      Number(b.application === "direct") - Number(a.application === "direct") ||
      b.passage!.anchorFactIds.length - a.passage!.anchorFactIds.length ||
      a.id.localeCompare(b.id),
  );
  let bytes = 0;
  for (const k of candidates) {
    const n = Buffer.byteLength(JSON.stringify(k));
    if (items.length >= 4 || bytes + n > LIBRARY_MAX_BYTES) {
      excluded.push({ id: k.id, reason: "library-budget" });
      continue;
    }
    if (items.some((x) => x.text === k.text)) {
      excluded.push({ id: k.id, reason: "duplicate-text" });
      continue;
    }
    items.push(k);
    bytes += n;
    for (const oldId of data.units.find((u) => "paid-library." + u.id === k.id)!
      .replaces || [])
      replacements.push({ oldId, newId: k.id });
  }
  return { items, excluded, replacements };
}
