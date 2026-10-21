import { defineConfig } from "vitest/config";
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": new URL(".", import.meta.url).pathname } },
  test: {
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
