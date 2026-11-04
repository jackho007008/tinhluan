import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import type { Knowledge, MenhInput } from "./contract";
import { unresolvedTemplate } from "./v1-editorial";
import { reviewPaidSource } from "./paid-source-fidelity";
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
    book: z.enum(["npl", "hs", "tb", "thp1", "thp2", "vttl170", "vdcsc"]),
    number: z.number().int().min(1).max(1000),
    layer: z.enum(["text", "ocr"]),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();
const webSource = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    url: z
      .string()
      .url()
      .refine((v) => {
        const u = new URL(v);
        return u.protocol === "https:" && !u.username && !u.password;
      }),
    title: z.string().min(1).max(240),
    locator: z.string().min(1).max(500),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();
// Only two image-checked source table branches are admitted. They annotate the
// author's interpretation; they never replace brightness in engine facts.
const AUTHOR_CONDITIONS = {
  "vdcsc-liem-than": {
    palace: "Tài Bạch",
    star: "Liêm Trinh",
    field: "majorStars",
    branch: "Thân",
    table: 34,
    passage: 211,
  },
  "vdcsc-hoa-tuat": {
    palace: "Phu Thê",
    star: "Hỏa Tinh",
    field: "minorStars",
    branch: "Tuất",
    table: 35,
    passage: 198,
  },
} as const;
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
          .object({
            palace: z.string(),
            any: z.array(anchor).min(1).max(3),
            relation: z.enum(["trine", "opposition"]).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(4),
    authorCondition: z.enum(["vdcsc-liem-than", "vdcsc-hoa-tuat"]).optional(),
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
    pages: z.array(page).max(6),
    webSources: z.array(webSource).min(1).max(2).optional(),
  })
  .strict()
  .refine(
    (u) => u.pages.length > 0 || !!u.webSources?.length,
    "A reviewed unit requires source evidence",
  )
  .refine(
    (u) => !u.webSources?.length || u.kind === "method",
    "Web research currently supports methods only, not personal interpretations",
  )
  .refine((u) => {
    if (!u.authorCondition)
      return !u.pages.some((p) => p.book === "vdcsc") || u.kind === "method";
    const c = AUTHOR_CONDITIONS[u.authorCondition];
    return (
      u.kind === "direct" &&
      !u.webSources &&
      !u.replaces?.length &&
      u.targets.length === 1 &&
      u.targets[0] === c.palace &&
      u.pages.every((p) => p.book === "vdcsc") &&
      [c.table, c.passage].every((n) =>
        u.pages.some((p) => p.number === n && p.layer === "text"),
      )
    );
  }, "VDC personal branches require an explicitly reviewed author condition and table/passage evidence")
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
  if (!["Nô Bộc", "Tử Nữ", "Phu Thê", "Tài Bạch", "Tật Ách"].includes(target))
    return { items, excluded, replacements };
  let data: z.infer<typeof index>;
  try {
    // Old checkouts keep reading their original index; new method units never
    // make a shared legacy index unreadable. Missing v1.6 assets use the old set.
    const v120 = path.join(root, "paid-passages", "index-v120.json");
    const v119 = path.join(root, "paid-passages", "index-v119.json");
    const v118 = path.join(root, "paid-passages", "index-v118.json");
    const v117 = path.join(root, "paid-passages", "index-v117.json");
    const v116 = path.join(root, "paid-passages", "index-v116.json");
    const v114 = path.join(root, "paid-passages", "index-v114.json");
    const v113 = path.join(root, "paid-passages", "index-v113.json");
    const v110 = path.join(root, "paid-passages", "index-v110.json");
    const v17 = path.join(root, "paid-passages", "index-v17.json");
    const v16 = path.join(root, "paid-passages", "index-v16.json");
    const file = fs.existsSync(v120)
      ? v120
      : fs.existsSync(v119)
        ? v119
        : fs.existsSync(v118)
          ? v118
          : fs.existsSync(v117)
            ? v117
            : fs.existsSync(v116)
              ? v116
              : fs.existsSync(v114)
                ? v114
                : fs.existsSync(v113)
                  ? v113
                  : fs.existsSync(v110)
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
    // T1 is method-only. A future index must not silently open personal readings.
    if (target === "Tật Ách" && u.kind !== "method") {
      reject("tat-t1-method-only");
      continue;
    }
    if (u.status !== "reviewed") {
      reject("not-reviewed");
      continue;
    }
    const authorAnchors = u.authorCondition
      ? (() => {
          const c = AUTHOR_CONDITIONS[u.authorCondition];
          const locations = input.facts.filter(
            (f) =>
              f.kind === "engine" &&
              /^palace\.\d+\.location$/.test(f.id) &&
              f.text.startsWith(`${c.palace} tại ${c.branch};`) &&
              f.paths.includes(`chart.palaces.${f.id.split(".")[1]}`),
          );
          const stars = input.facts.filter(
            (f) =>
              f.kind === "engine" &&
              f.provenance?.palace === c.palace &&
              f.provenance.field === c.field &&
              f.provenance.scope === "natal" &&
              f.provenance.verification === "source-traced" &&
              f.text.startsWith(`${c.palace} tại ${c.branch}: ${c.star};`) &&
              locations.some((l) =>
                f.paths.some((p) =>
                  p.startsWith(
                    `chart.palaces.${l.id.split(".")[1]}.${c.field}.`,
                  ),
                ),
              ),
          );
          return locations.length === 1 && stars.length === 1
            ? [...locations, ...stars].map((f) => f.id)
            : [];
        })()
      : [];
    if (u.authorCondition && !authorAnchors.length) {
      reject("author-condition-not-met");
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
      input.facts.filter(
        (f) =>
          (!req.relation || f.provenance?.relation === req.relation) &&
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
        ...authorAnchors,
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
      for (const w of u.webSources || []) {
        // A local, reviewed research receipt, not a live fetch or proof that a
        // web claim is true. Never load arbitrary paths/URLs from model output.
        const file = path.resolve(root, "../web", w.id + ".json");
        if (
          fs.lstatSync(file).isSymbolicLink() ||
          fs.statSync(file).size > 16000
        )
          throw Error();
        const bytes = fs.readFileSync(file);
        if (digest(bytes) !== w.sha256) throw Error();
        const receipt = JSON.parse(bytes.toString("utf8"));
        if (
          receipt.schemaVersion !== "paid-web-research-receipt-1.0.0" ||
          receipt.status !== "reviewed-method-only" ||
          receipt.id !== w.id ||
          receipt.url !== w.url ||
          receipt.title !== w.title ||
          receipt.locator !== w.locator ||
          !u.references.some((r) => r.location.includes(w.url))
        )
          throw Error();
      }
    } catch {
      reject("missing-or-changed-source-page");
      continue;
    }
    const candidate: Knowledge = {
      id,
      title: u.title,
      text: u.text,
      conditions: u.authorCondition
        ? [
            ...u.conditions,
            `Điều kiện riêng Vương Đình Chi: ${AUTHOR_CONDITIONS[u.authorCondition].star} tại ${AUTHOR_CONDITIONS[u.authorCondition].branch} là Miếu theo bảng PDF${AUTHOR_CONDITIONS[u.authorCondition].table}. Đây là lớp nguồn, không thay trạng thái engine hoặc đồng nhất Miếu/Vượng giữa tác giả.`,
          ]
        : u.conditions,
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
        ...(u.authorCondition
          ? {
              authorCondition: {
                id: u.authorCondition,
                author: "Vương Đình Chi",
                book: "vdcsc",
                branch: AUTHOR_CONDITIONS[u.authorCondition].branch,
                brightness: "Miếu",
                tablePage: AUTHOR_CONDITIONS[u.authorCondition].table,
              },
            }
          : {}),
        anchorFactIds: [...new Set(anchorFactIds)],
      },
    };
    candidates.push(reviewPaidSource(candidate, target));
  }
  // Keep four book slots, or five when a reviewed author branch is present.
  // The byte cap is unchanged; this avoids displacing its qualifying methods. At most one web method may use
  // remaining bytes, never evicting a book unit or raising the byte budget.
  const webIds = new Set(
    data.units
      .filter((u) => u.webSources?.length)
      .map((u) => "paid-library." + u.id),
  );
  candidates.sort(
    (a, b) =>
      Number(webIds.has(a.id)) - Number(webIds.has(b.id)) ||
      Number(b.application === "direct") - Number(a.application === "direct") ||
      b.passage!.anchorFactIds.length - a.passage!.anchorFactIds.length ||
      a.id.localeCompare(b.id),
  );
  const bookLimit = candidates.some((k) => k.passage?.authorCondition) ? 5 : 4;
  let bytes = 0;
  let bookItems = 0,
    webItems = 0;
  for (const k of candidates) {
    const n = Buffer.byteLength(JSON.stringify(k));
    const isWeb = webIds.has(k.id);
    if (
      (isWeb ? webItems >= 1 : bookItems >= bookLimit) ||
      bytes + n > LIBRARY_MAX_BYTES
    ) {
      excluded.push({ id: k.id, reason: "library-budget" });
      continue;
    }
    if (items.some((x) => x.text === k.text)) {
      excluded.push({ id: k.id, reason: "duplicate-text" });
      continue;
    }
    items.push(k);
    bytes += n;
    if (isWeb) webItems++;
    else bookItems++;
    for (const oldId of data.units.find((u) => "paid-library." + u.id === k.id)!
      .replaces || [])
      replacements.push({ oldId, newId: k.id });
  }
  return { items, excluded, replacements };
}
