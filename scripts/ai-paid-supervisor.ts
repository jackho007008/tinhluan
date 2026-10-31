import { pool } from "../lib/db";
import { runPaidSupervisor } from "../lib/ai/supervisor";
try {
  console.log(
    JSON.stringify({
      at: new Date().toISOString(),
      ...(await runPaidSupervisor(process.env.AI_PAID_SCOPE_FILE || "")),
    }),
  );
} catch (error) {
  console.error(
    error instanceof Error && /^AI_[A-Z_]+$/.test(error.message)
      ? error.message
      : "AI_SUPERVISOR_CONFIGURATION_OR_RUNTIME_ERROR",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
