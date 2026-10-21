import { readFile } from "node:fs/promises";
import { pool } from "../lib/db";
import { packages } from "../lib/config";
await pool.query(
  await readFile(new URL("../db/001_init.sql", import.meta.url), "utf8"),
);
await pool.query(
  await readFile(new URL("../db/002_beta.sql", import.meta.url), "utf8"),
);
await pool.query(
  await readFile(
    new URL("../db/003_order_readings.sql", import.meta.url),
    "utf8",
  ),
);
await pool.query(
  await readFile(new URL("../db/004_sepay_test.sql", import.meta.url), "utf8"),
);
await pool.query(
  await readFile(
    new URL("../db/005_sepay_reconcile.sql", import.meta.url),
    "utf8",
  ),
);
await pool.query(await readFile(new URL("../db/006_encyclopedia.sql", import.meta.url), "utf8"));
await pool.query(await readFile(new URL("../db/007_reading_recovery.sql", import.meta.url), "utf8"));
await pool.query(await readFile(new URL("../db/008_customer_accounts.sql", import.meta.url), "utf8"));
await pool.query(await readFile(new URL('../db/009_test_checkout.sql', import.meta.url), 'utf8'));
await pool.query(await readFile(new URL('../db/010_admin_operations.sql', import.meta.url), 'utf8'));
for (const p of packages)
  await pool.query(
    "INSERT INTO packages(id,data) VALUES($1,$2) ON CONFLICT(id) DO UPDATE SET data=$2",
    [p.id, p],
  );
console.log("Migrations 001, 002, 003, 004, 005, 006, 007 008 and 009 applied");
await pool.end();
