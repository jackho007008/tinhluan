import fs from "node:fs/promises";
import path from "node:path";
import { aiEnabled } from "./config";
import { aiEligible, requestMenh } from "./store";
import type { InternalReading } from "../internal-review/reading-store";
/** The creation-time file marker is a durable outbox if DB enqueue fails after
 * the immutable file save. Only new eligible editions in the active trial store
 * are discovered. Historical files are read, never changed or backfilled. */
export async function reconcileAiOutbox() {
  if (!aiEnabled()) return 0;
  const root = path.resolve(
      process.env.TRIAL_READING_DIR || ".local/trial-readings",
    ),
    owners = await fs.readdir(root + "/readings").catch(() => []);
  let count = 0;
  for (const owner of owners) {
    if (!/^[a-f0-9]{64}$/.test(owner)) continue;
    let session;
    try {
      session = JSON.parse(
        await fs.readFile(root + "/sessions/" + owner + ".json", "utf8"),
      );
    } catch {
      continue;
    }
    if (!Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now())
      continue;
    for (const name of await fs.readdir(root + "/readings/" + owner)) {
      if (!/^[a-f0-9-]{36}\.json$/.test(name)) continue;
      const r = JSON.parse(
        await fs.readFile(path.join(root, "readings", owner, name), "utf8"),
      ) as InternalReading;
      if (aiEligible(r)) {
        await requestMenh(r);
        count++;
      }
    }
  }
  return count;
}
