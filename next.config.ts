import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import type { NextConfig } from "next";
const atomicPlugin =
  process.env.NODE_ENV === "development"
    ? createRequire(import.meta.url)(
        "./scripts/atomic-next-manifests.cjs",
      ).install(fileURLToPath(new URL(".", import.meta.url)))
    : undefined;
const config: NextConfig = {
  webpack(config, { dev }) {
    if (dev && atomicPlugin) config.plugins.push(atomicPlugin);
    return config;
  },
  poweredByHeader: false,
  devIndicators: false,
  serverExternalPackages: ["pg", "iztro", "playwright-core"],
  async headers() {
    return [
      {
        source: "/beta",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        // Native same-origin POST forms otherwise send Origin: null under no-referrer.
        // Callback/redirect responses retain no-referrer so OAuth codes do not leak.
        source: "/(la-so-cua-toi|checkout)",
        headers: [{ key: "Referrer-Policy", value: "same-origin" }],
      },
    ];
  },
};
export default config;
