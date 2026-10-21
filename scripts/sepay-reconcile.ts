/** Server-only manual operator; no public route and no email/checkout work. */
import { reconcileSePayTest } from "../lib/payments/sepay-reconcile";
import { SePayError } from "../lib/payments/sepay-test";
import { pool } from "../lib/db";
try {
  const args = process.argv.slice(2);
  if (args.some((a) => !/^--(page-size|max-pages)=\d+$/.test(a)))
    throw new SePayError("SEPAY_CLI_ARGUMENT", 400);
  const option = (name: string) => {
    const a = args.find((a) => a.startsWith(name + "="));
    return a ? Number(a.split("=")[1]) : undefined;
  };
  console.log(
    JSON.stringify(
      await reconcileSePayTest({
        perPage: option("--page-size"),
        maxPages: option("--max-pages"),
      }),
    ),
  );
} catch (e) {
  console.error(
    JSON.stringify({
      event: "sepay_test_reconcile",
      reason: e instanceof SePayError ? e.code : "RECONCILIATION_FAILED",
      checkpointAdvanced: false,
    }),
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
