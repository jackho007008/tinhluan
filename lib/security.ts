import { createHash, randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { pool, transaction } from "./db";
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export async function issueToken(
  c: PoolClient,
  orderId: string,
  purpose = "session",
  days = 30,
) {
  const token = randomBytes(32).toString("base64url");
  await c.query(
    "INSERT INTO access_tokens(hash,order_id,purpose,expires_at) VALUES($1,$2,$3,now()+$4*interval '1 day')",
    [hash(token), orderId, purpose, days],
  );
  return token;
}
export async function authorize(token: string | undefined, id: string) {
  if (!token) throw new Error("UNAUTHORIZED");
  const r = await pool.query(
    "SELECT 1 FROM access_tokens a JOIN orders o ON o.id=a.order_id WHERE a.hash=$1 AND a.order_id=$2 AND a.purpose='session' AND a.expires_at>now() AND a.revoked_at IS NULL AND o.created_at+((o.scope->>'accessDays')::int)*interval '1 day'>now()",
    [hash(token), id],
  );
  if (!r.rowCount) throw new Error("UNAUTHORIZED");
}
export function demoOnly() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.DEMO_ENABLED !== "true" ||
    process.env.PAYMENT_PROVIDER !== "mock"
  )
    throw new Error("DEMO_DISABLED");
}

export async function exchangeToken(t: string) {
  return transaction(async (c) => {
    const found = (
      await c.query(
        "SELECT a.* FROM access_tokens a JOIN orders o ON o.id=a.order_id WHERE a.hash=$1 AND a.purpose='magic' AND a.expires_at>now() AND a.revoked_at IS NULL AND o.created_at+((o.scope->>'accessDays')::int)*interval '1 day'>now() FOR UPDATE OF a",
        [hash(t)],
      )
    ).rows[0];
    if (!found) throw new Error("UNAUTHORIZED");
    await c.query("UPDATE access_tokens SET revoked_at=now() WHERE hash=$1", [
      hash(t),
    ]);
    return {
      id: found.order_id,
      token: await issueToken(c, found.order_id),
    };
  });
}
