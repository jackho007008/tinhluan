import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";

const MARKER = ".v1-edit-snapshot.json";
const VERSION = "v1-edit-snapshot-1.0.0";
const hash = (b: Uint8Array | string) =>
  createHash("sha256").update(b).digest("hex");
const artifactPath = z.string().refine((s) => {
  const parts = s.split("/");
  return (
    [
      "sources",
      "requests",
      "candidates",
      "reviews",
      "approved",
      "errors",
      "inventories",
    ].includes(parts[0]) &&
    parts.length >= 2 &&
    parts.every((p) => /^[a-zA-Z0-9_-]+(?:\.json)?$/.test(p)) &&
    parts.at(-1)!.endsWith(".json")
  );
});
const manifestSchema = z
  .object({
    version: z.literal(VERSION),
    createdAt: z.string().datetime(),
    files: z.array(
      z
        .object({
          path: artifactPath,
          sha256: z.string().regex(/^[a-f0-9]{64}$/),
          bytes: z.number().int().nonnegative(),
        })
        .strict(),
    ),
  })
  .strict();
export type V1EditManifest = z.infer<typeof manifestSchema>;

async function list(root: string, relative = ""): Promise<string[]> {
  const entries = await fs.readdir(path.join(root, relative), {
    withFileTypes: true,
  });
  const result: string[] = [];
  for (const entry of entries) {
    if (!relative && entry.name === MARKER) continue;
    const p = relative ? relative + "/" + entry.name : entry.name;
    if (entry.isSymbolicLink() || (!entry.isDirectory() && !entry.isFile()))
      throw Error("V1_TRANSFER_UNSAFE_ENTRY");
    if (entry.isDirectory()) result.push(...(await list(root, p)));
    else {
      artifactPath.parse(p);
      result.push(p);
    }
  }
  return result.sort();
}
async function entries(root: string) {
  const result: V1EditManifest["files"] = [];
  for (const p of await list(root)) {
    const b = await fs.readFile(path.join(root, p));
    // A partial/temp or non-JSON artifact is never promoted into a release.
    JSON.parse(b.toString("utf8"));
    result.push({ path: p, sha256: hash(b), bytes: b.length });
  }
  return result;
}
async function markerExists(root: string) {
  try {
    await fs.lstat(path.join(root, MARKER));
    return true;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw e;
  }
}
export async function verifyV1EditSnapshot(root: string) {
  const info = await fs.lstat(root);
  if (!info.isDirectory() || info.isSymbolicLink())
    throw Error("V1_TRANSFER_UNSAFE_ROOT");
  const marker = await fs.lstat(path.join(root, MARKER));
  if (!marker.isFile() || marker.isSymbolicLink())
    throw Error("V1_TRANSFER_UNSAFE_MARKER");
  const manifest = manifestSchema.parse(
    JSON.parse(await fs.readFile(path.join(root, MARKER), "utf8")),
  );
  const actual = await entries(root);
  if (JSON.stringify(actual) !== JSON.stringify(manifest.files))
    throw Error("V1_TRANSFER_HASH_MISMATCH");
  if (!actual.length) throw Error("V1_TRANSFER_EMPTY");
  return {
    manifest,
    manifestHash: hash(JSON.stringify(manifest)),
    fileCount: actual.length,
  };
}
/** Explicit operator snapshot/restore into a NEW directory. No merge, overwrite,
 * database, process control, model call, or customer-report path is involved.
 * A failed copy has no completion marker and must never be used by the web. */
export async function snapshotV1EditStore(source: string, destination: string) {
  const info = await fs.lstat(source);
  if (!info.isDirectory() || info.isSymbolicLink())
    throw Error("V1_TRANSFER_UNSAFE_ROOT");
  const from = await fs.realpath(source);
  // Resolve existing parent links before checking overlap; destination must not exist.
  const parent = await fs.realpath(path.dirname(path.resolve(destination)));
  const to = path.join(parent, path.basename(destination));
  if (
    from === to ||
    from.startsWith(to + path.sep) ||
    to.startsWith(from + path.sep)
  )
    throw Error("V1_TRANSFER_OVERLAP");
  if (await markerExists(from)) await verifyV1EditSnapshot(from);
  const before = await entries(from);
  if (!before.length) throw Error("V1_TRANSFER_EMPTY");
  await fs.mkdir(to, { mode: 0o700 }); // EEXIST is deliberate; never merge into an active store.
  for (const file of before) {
    const target = path.join(to, file.path);
    await fs.mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
    const b = await fs.readFile(path.join(from, file.path));
    if (hash(b) !== file.sha256) throw Error("V1_TRANSFER_SOURCE_CHANGED");
    await fs.writeFile(target, b, { flag: "wx", mode: 0o600 });
  }
  if (JSON.stringify(await entries(from)) !== JSON.stringify(before))
    throw Error("V1_TRANSFER_SOURCE_CHANGED");
  const manifest: V1EditManifest = {
    version: VERSION,
    createdAt: new Date().toISOString(),
    files: before,
  };
  await fs.writeFile(path.join(to, MARKER), JSON.stringify(manifest), {
    flag: "wx",
    mode: 0o600,
  });
  return verifyV1EditSnapshot(to);
}
