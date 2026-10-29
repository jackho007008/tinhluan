import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  snapshotV1EditStore,
  verifyV1EditSnapshot,
} from "../lib/ai/v1-edit-transfer";
let root: string, source: string;
beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "v1-transfer-"));
  source = path.join(root, "operator-store");
  for (const kind of [
    "sources",
    "candidates",
    "requests",
    "reviews/key/context",
    "approved",
    "errors",
    "inventories",
  ]) {
    await fs.mkdir(path.join(source, kind), { recursive: true });
    await fs.writeFile(
      path.join(source, kind, "artifact.json"),
      JSON.stringify({ kind, text: "Fixture, not a customer report." }),
    );
  }
});
afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true });
});
describe("private V1 editorial store snapshot and restore", () => {
  it("copies every artifact and journal, checks hashes and restores into a fresh private directory", async () => {
    const destination = path.join(root, "release");
    const r = await snapshotV1EditStore(source, destination);
    expect(r.fileCount).toBe(7);
    expect(r.manifest.files.some((f) => f.path.startsWith("reviews/"))).toBe(
      true,
    );
    for (const f of r.manifest.files) {
      expect(await fs.readFile(path.join(destination, f.path), "utf8")).toBe(
        await fs.readFile(path.join(source, f.path), "utf8"),
      );
      expect((await fs.stat(path.join(destination, f.path))).mode & 0o777).toBe(
        0o600,
      );
    }
    expect((await fs.stat(destination)).mode & 0o777).toBe(0o700);
    const restored = await snapshotV1EditStore(
      destination,
      path.join(root, "restore-drill"),
    );
    expect(restored.manifest.files).toEqual(r.manifest.files);
  });
  it("never overwrites or merges an existing destination and rejects overlapping paths", async () => {
    await expect(snapshotV1EditStore(source, source)).rejects.toThrow(
      "V1_TRANSFER_OVERLAP",
    );
    await expect(
      snapshotV1EditStore(source, path.join(source, "nested")),
    ).rejects.toThrow("V1_TRANSFER_OVERLAP");
    const destination = path.join(root, "existing");
    await fs.mkdir(destination);
    await fs.writeFile(path.join(destination, "keep.txt"), "do not overwrite");
    await expect(snapshotV1EditStore(source, destination)).rejects.toThrow();
    expect(await fs.readFile(path.join(destination, "keep.txt"), "utf8")).toBe(
      "do not overwrite",
    );
  });
  it("rejects symlinks and refuses to mark incomplete or malformed data as a usable snapshot", async () => {
    await expect(verifyV1EditSnapshot(source)).rejects.toThrow();
    await fs.symlink(
      path.join(source, "candidates/artifact.json"),
      path.join(source, "sources/link.json"),
    );
    await expect(
      snapshotV1EditStore(source, path.join(root, "unsafe")),
    ).rejects.toThrow("V1_TRANSFER_UNSAFE_ENTRY");
    await fs.unlink(path.join(source, "sources/link.json"));
    await fs.writeFile(path.join(source, "requests/artifact.json"), "{");
    await expect(
      snapshotV1EditStore(source, path.join(root, "broken")),
    ).rejects.toThrow();
    await expect(
      fs.access(path.join(root, "broken/.v1-edit-snapshot.json")),
    ).rejects.toThrow();
  });
  it("detects tampered, missing and unexpected files before restore or use", async () => {
    const destination = path.join(root, "release");
    await snapshotV1EditStore(source, destination);
    const f = path.join(destination, "sources/artifact.json");
    const original = await fs.readFile(f);
    await fs.writeFile(f, JSON.stringify({ changed: true }));
    await expect(verifyV1EditSnapshot(destination)).rejects.toThrow(
      "V1_TRANSFER_HASH_MISMATCH",
    );
    await expect(
      snapshotV1EditStore(destination, path.join(root, "bad-restore")),
    ).rejects.toThrow("V1_TRANSFER_HASH_MISMATCH");
    await fs.writeFile(f, original);
    await fs.writeFile(path.join(destination, "sources/extra.json"), "{}");
    await expect(verifyV1EditSnapshot(destination)).rejects.toThrow(
      "V1_TRANSFER_HASH_MISMATCH",
    );
    await fs.unlink(path.join(destination, "sources/extra.json"));
    await fs.unlink(f);
    await expect(verifyV1EditSnapshot(destination)).rejects.toThrow(
      "V1_TRANSFER_HASH_MISMATCH",
    );
  });
});
