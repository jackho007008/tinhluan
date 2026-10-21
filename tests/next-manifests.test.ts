import { it, expect } from "vitest";
import { mkdtemp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import fs from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const { install } = createRequire(import.meta.url)(
  "../scripts/atomic-next-manifests.cjs",
);
it("concurrent manifest readers only observe complete old/new documents, failed write preserves previous content", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tuvi-manifest-"));
  try {
    await mkdir(join(dir, ".next/server"), { recursive: true });
    const file = join(dir, ".next/server/app-paths-manifest.json");
    await fs.promises.writeFile(file, JSON.stringify({ version: 0 }));
    const plugin = install(dir);
    expect(install(dir)).toBe(plugin);
    let finished = false;
    let reads = 0;
    const reader = (async () => {
      while (!finished) {
        const value = JSON.parse(await readFile(file, "utf8"));
        expect(Number.isInteger(value.version)).toBe(true);
        reads++;
      }
    })();
    await Promise.all(
      Array.from({ length: 60 }, (_, version) =>
        fs.promises.writeFile(
          file,
          JSON.stringify({ version, body: "x".repeat(version * 1000) }),
        ),
      ),
    );
    finished = true;
    await reader;
    expect(reads).toBeGreaterThan(0);
    const before = await readFile(file, "utf8");
    await expect(
      fs.promises.writeFile(file, "broken", { signal: AbortSignal.abort() }),
    ).rejects.toThrow();
    expect(await readFile(file, "utf8")).toBe(before);
    expect(
      (await readdir(join(dir, ".next/server"))).filter((p) =>
        p.includes(".pending-"),
      ),
    ).toEqual([]);
    await new Promise<void>((resolve, reject) =>
      fs.writeFile(file, '{"version":99}', (e) => (e ? reject(e) : resolve())),
    );
    expect(JSON.parse(await readFile(file, "utf8")).version).toBe(99);
    const unrelated = join(dir, "snapshot.json");
    await fs.promises.writeFile(unrelated, "literal-not-json");
    expect(await readFile(unrelated, "utf8")).toBe("literal-not-json");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
