import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
const canonical = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(canonical)
    : v && typeof v === "object"
      ? Object.fromEntries(
          Object.entries(v)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, x]) => [k, canonical(x)]),
        )
      : v;
export const contentHash = (v: unknown) =>
  createHash("sha256")
    .update(JSON.stringify(canonical(v)))
    .digest("hex");
export const v1EditRoot = () =>
  path.resolve(process.env.AI_V1_EDIT_DIR || ".local/ai-v1-edits");
const keyPath = (kind: string, key: string) => {
  if (!/^[a-f0-9]{64}$/.test(key)) throw Error("V1_EDIT_INVALID_KEY");
  return path.join(v1EditRoot(), kind, key + ".json");
};
export async function writeEditArtifact(
  kind: string,
  key: string,
  value: unknown,
) {
  const target = keyPath(kind, key);
  await fs.mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  const tmp = target + "." + randomUUID() + ".tmp";
  try {
    await fs.writeFile(tmp, JSON.stringify(value), { flag: "wx", mode: 0o600 });
    await fs.link(tmp, target);
  } finally {
    await fs.unlink(tmp).catch(() => {});
  }
}
export async function readEditArtifact(kind: string, key: string) {
  return JSON.parse(await fs.readFile(keyPath(kind, key), "utf8"));
}
