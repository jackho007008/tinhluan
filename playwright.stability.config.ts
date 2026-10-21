import { defineConfig } from "@playwright/test";
process.env.E2E_ARTIFACT_DIR ||= "docs/evidence/json-stability/mobile";
const origin = process.env.E2E_ORIGIN;
if (!["http://localhost:3005", "http://localhost:3006"].includes(origin || ""))
  throw Error("ISOLATED_ORIGIN_REQUIRED");
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: [
    "tanbien-reading.spec.ts",
    "editorial-preview.spec.ts",
    "reading-stability.spec.ts",
  ],
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 90000,
  outputDir: ".local/json-stability/test-results",
  use: {
    baseURL: origin,
    headless: true,
    launchOptions: { channel: "chrome" },
  },
  reporter: "list",
});
