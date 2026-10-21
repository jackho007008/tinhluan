import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: process.env.E2E_ORIGIN || "http://localhost:3000",
    headless: true,
    launchOptions: { channel: "chrome" },
  },
  reporter: "list",
});
