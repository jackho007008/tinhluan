import type { InternalReading } from "../internal-review/reading-store";
import type { CustomerParagraph } from "../internal-review/customer-report";
import { captureReadingPolicy } from "../trial/reading-policy";
import { receiptMatches } from "../internal-review/dynamic-reading";
import {
  approvedV1Edit,
  contentHash,
  v1EditUnit,
  V1_EDIT_PROMPT,
} from "./v1-edit";

export const FREE_MENH_VERSION = "menh-v1-immediate-1.0.0";
export type FreeMenhEdition = {
  version: typeof FREE_MENH_VERSION;
  units: {
    paragraphId: string;
    sourceHash: string;
    text: string;
    editor: "v1" | "luna";
    edit?: { model: string; promptVersion: string; artifactHash: string };
  }[];
};
export function freeMenhParagraphs(record: InternalReading) {
  const report = record.frozen.customerReport;
  if (
    !report ||
    !record.frozen.verified ||
    !receiptMatches(record.snapshot, record.receipt) ||
    report.snapshotId !== record.snapshot.resultId
  )
    return [];
  // Older frozen formats need their original renderer, not a guessed upgrade.
  // An unsupported paragraph must not make opening an old report throw.
  if (
    !Array.isArray(report.sections) ||
    !report.sections.every(
      (s) =>
        Array.isArray(s.paragraphs) &&
        s.paragraphs.every(
          (p) =>
            Array.isArray(p.claimIds) &&
            Array.isArray(p.relations) &&
            Array.isArray(p.sentences) &&
            typeof p.original === "string" &&
            Array.isArray(p.members) &&
            p.members.every(
              (m) =>
                Array.isArray(m.layers) &&
                Array.isArray(m.claim?.rules) &&
                m.claim.rules.every(
                  (r) =>
                    Array.isArray(r.limitations) &&
                    Array.isArray(r.sourceReferences),
                ),
            ),
        ),
    )
  )
    return [];
  // Use the saved free boundary; legacy absence is scoped for this view only,
  // without modifying the original policy or any existing full entitlement.
  const policy =
    record.accessPolicy === undefined
      ? captureReadingPolicy(record)
      : record.accessPolicy;
  if (policy.version !== "menh-free-1.0.0") return [];
  if (!Array.isArray(policy.freeParagraphIds)) return [];
  const allowed = new Set(policy.freeParagraphIds);
  return report.sections
    .filter((s) => s.palaces.length === 1 && s.palaces[0] === "Mệnh")
    .flatMap((s) =>
      s.paragraphs.filter(
        (p) => allowed.has(p.id) && p.text.trim() && !/\{\{|\}\}/.test(p.text),
      ),
    );
}
/** Creation only: file reads, no provider call, no queue or paid grant. */
export async function captureFreeMenh(
  record: InternalReading,
): Promise<FreeMenhEdition> {
  const version = record.frozen.customerReport!.version;
  const units = await Promise.all(
    freeMenhParagraphs(record).map(async (p) => {
      const source = v1EditUnit(p, version),
        edit = await approvedV1Edit(source);
      return {
        paragraphId: p.id,
        sourceHash: contentHash(source),
        text: edit?.text || p.text,
        editor: edit ? ("luna" as const) : ("v1" as const),
        ...(edit
          ? {
              edit: {
                model: edit.model,
                promptVersion: edit.promptVersion,
                artifactHash: edit.artifactHash,
              },
            }
          : {}),
      };
    }),
  );
  return { version: FREE_MENH_VERSION, units };
}
export type FreeMenhView = {
  version: string;
  paragraphs: {
    paragraph: CustomerParagraph;
    text: string;
    editor: "v1" | "luna";
    edit?: FreeMenhEdition["units"][number]["edit"];
  }[];
};
/** Read-only reopening never looks for newer edits and never calls OpenAI. */
export function freeMenhView(record: InternalReading): FreeMenhView {
  const version = record.frozen.customerReport?.version || "unknown";
  return {
    version,
    paragraphs: freeMenhParagraphs(record).map((paragraph) => {
      const saved =
        record.freeMenh?.version === FREE_MENH_VERSION &&
        Array.isArray(record.freeMenh.units)
          ? record.freeMenh.units.find(
              (u) =>
                u.paragraphId === paragraph.id &&
                u.sourceHash === contentHash(v1EditUnit(paragraph, version)),
            )
          : undefined;
      const valid =
        saved?.editor === "luna" &&
        saved.edit?.promptVersion === V1_EDIT_PROMPT &&
        !!saved.text.trim();
      return {
        paragraph,
        text: valid ? saved.text : paragraph.text,
        editor: valid ? "luna" : "v1",
        ...(valid ? { edit: saved.edit } : {}),
      };
    }),
  };
}
