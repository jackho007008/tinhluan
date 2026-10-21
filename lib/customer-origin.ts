/** Explicit customer origins only. Never trust Host or forwarded headers. */
export function customerRequestOrigin(value: string | null): boolean {
  const entries = [
    process.env.APP_ORIGIN || "http://localhost:3000",
    ...(process.env.CUSTOMER_ALLOWED_ORIGINS || "").split(","),
  ].filter((x) => x.trim());
  const allowed = new Set<string>();
  for (const entry of entries) {
    try {
      const url = new URL(entry.trim());
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash || url.hostname.includes("*")) return false;
      allowed.add(url.origin);
    } catch { return false; }
  }
  return value !== null && allowed.has(value);
}
