import { Pool, type PoolClient } from "pg";
export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://localhost:55439/tuvi",
  max: 10,
});
export async function transaction<T>(fn: (c: PoolClient) => Promise<T>) {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const result = await fn(c);
    await c.query("COMMIT");
    return result;
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
  }
}
export async function rateLimit(key: string, max = 20) {
  const r = await pool.query(
    `INSERT INTO rate_limits(key,count,expires_at) VALUES($1,1,now()+interval '10 minutes') ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at<now() THEN 1 ELSE rate_limits.count+1 END,expires_at=CASE WHEN rate_limits.expires_at<now() THEN now()+interval '10 minutes' ELSE rate_limits.expires_at END RETURNING count`,
    [key],
  );
  if (r.rows[0].count > max) throw new Error("RATE_LIMIT");
}
