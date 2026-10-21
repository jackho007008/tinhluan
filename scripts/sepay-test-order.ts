import { pool } from "../lib/db";
import { enrollSePayTestOrder, SePayError } from "../lib/payments/sepay-test";
try {
  if (process.argv[2] !== "enroll" || !process.argv[3])
    throw Error("USAGE: enroll ORDER_UUID");
  console.log(JSON.stringify(await enrollSePayTestOrder(process.argv[3])));
} catch (error) {
  console.error(
    error instanceof SePayError ? error.code : "SEPAY_TEST_OPERATOR_FAILED",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
