/** Explicit internal-login origins only; never trust Host/Forwarded headers. */
export function internalRequestOrigin(value: string | null): string | null {
  const entries = [
    process.env.APP_ORIGIN || "http://localhost:3000",
    ...(process.env.INTERNAL_REVIEW_ALLOWED_ORIGINS || "").split(","),
  ].filter((entry) => entry.trim());
  const allowed = new Set<string>();
  for (const entry of entries) {
    try {
      const url = new URL(entry.trim());
      // Reject paths, credentials, queries, wildcards and comma-separated APP_ORIGIN.
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash ||
        url.hostname.includes("*")
      )
        return null;
      allowed.add(url.origin);
    } catch {
      return null;
    }
  }
  return value && allowed.has(value) ? value : null;
}
