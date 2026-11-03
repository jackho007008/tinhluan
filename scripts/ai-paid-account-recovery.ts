import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { pool, transaction } from "../lib/db";
import { authorizePaidAccountRetry } from "../lib/ai/account-recovery";
// Local operator CLI only. Dry-run by default; no provider network or new endpoint.
const [file, flag, ...extra] = process.argv.slice(2);
try {
  if (!file || extra.length || (flag && flag !== "--apply"))
    throw Error("AI_RECOVERY_EXPLICIT_PLAN_REQUIRED");
  const stat = await fs.lstat(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 16000)
    throw Error("AI_RECOVERY_PLAN_INVALID");
  if (stat.mode & 0o077) throw Error("AI_RECOVERY_PRIVATE_PLAN_REQUIRED");
  const bytes = await fs.readFile(file),
    plan = JSON.parse(bytes.toString()),
    digest = createHash("sha256").update(bytes).digest("hex");
  if (flag !== "--apply")
    console.log(JSON.stringify(await authorizePaidAccountRetry(pool, plan)));
  else {
    const receipt = file + ".receipt.json";
    await fs.writeFile(
      receipt,
      JSON.stringify({
        at: new Date().toISOString(),
        planSha256: digest,
        state: "applying",
      }),
      { flag: "wx", mode: 0o600 },
    );
    try {
      const result = await transaction((c) =>
        authorizePaidAccountRetry(c, plan, true),
      );
      const temp = receipt + ".tmp";
      await fs.writeFile(
        temp,
        JSON.stringify({
          at: new Date().toISOString(),
          planSha256: digest,
          state: "authorized",
          result,
        }),
        { mode: 0o600, flag: "wx" },
      );
      await fs.rename(temp, receipt);
      console.log(JSON.stringify(result));
    } catch (error) {
      // An "applying" receipt after a crash/commit needs inspection, never an
      // automatic retry. No API call or attempt insertion happens in this CLI.
      throw error;
    }
  }
} catch (error) {
  console.error(
    error instanceof Error && /^AI_[A-Z_]+$/.test(error.message)
      ? error.message
      : "AI_RECOVERY_CONFIGURATION_OR_TRANSACTION_ERROR",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
